import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const NUM_BOIDS = 50;
const Z_RANGE = 3; // 6
const VISION_RANGE = 2.2;
const COLLISION_RANGE = 1.5;
const VERY_LARGE_NUMBER = 9000; // larger than VISION_RANGE, hopefully

// params
const COHERENCE = 0.025;
const SEPARATION = 0.08;
const ALIGNMENT = 0.03;

const SPEED_LIMIT = 0.1; // 0.1
const INITIAL_SPEED = 0.04;
const INITIAL_POSITION = 12; // 10
const BOID_SIZE_PARAMS = [0, 0.2, 1];

type Velocity = {
    x: number,
    y: number,
    z: number,
}
type Boid = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap>;

export const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, 16 / 9, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    camera.position.z = 10;
    
    // lighting
    scene.add( new THREE.AmbientLight( 0x999999 ));
    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0.5, 0.5, 1 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4; // tighter shadow map
    scene.add( light );

    return { scene, camera, renderer };
}

export const initBoids = (scene: THREE.Scene) => {
    const boids: Boid[] = []; // stores meshes
    const velocities: Velocity[] = []; // track each boid velocity in separate array

    // reset scene
    for(let i = 0; i < scene.children.length; i++) {
        let child = scene.children[i];
        if(child.type == "Mesh") {
            scene.remove(child);
            i--;
        }
    }
    const geometryBackground = new THREE.PlaneGeometry( 100, 100 );
    const materialBackground = new THREE.MeshPhongMaterial( { color: 0x111111 } );
    const background = new THREE.Mesh( geometryBackground, materialBackground );
    background.receiveShadow = true;
    background.position.set( 0, 0, - 10 );
    scene.add( background );

    for( let i = 0; i < NUM_BOIDS; i++ ) {
        // init a single boid to a random starting position
        const geometry = new THREE.CylinderGeometry( ...BOID_SIZE_PARAMS );
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        let mesh = new THREE.Mesh( geometry, material );
        [ mesh.position.x, mesh.position.y, mesh.position.z ] = [ Math.random() * INITIAL_POSITION - INITIAL_POSITION / 2, Math.random() * INITIAL_POSITION - INITIAL_POSITION / 2, Math.random() * Z_RANGE - (Z_RANGE / 2)];
        // [ mesh.rotation.x, mesh.rotation.y, mesh.rotation.z ] = Array.from({ length: 3 }, () => Math.random() * 4 - 2)
        mesh.geometry.rotateX(-Math.PI / 2);
        boids.push(mesh);
        velocities.push({ x: Math.random() * INITIAL_SPEED - (INITIAL_SPEED * 0.5), y: Math.random() * INITIAL_SPEED - (INITIAL_SPEED * 0.5), z: Math.random() * INITIAL_SPEED - (INITIAL_SPEED * 0.5) });
        scene.add( mesh );
    }
    return { boids, velocities };
}

const getStayInBoundsFromCanvasSize = (width: number, height: number) => (boid: Boid, velocity: Velocity) => {
    // TODO: this calculation is for a cube
    [ width, height ] = [ 15, 10 ]; // testing
    const turnFactor = -1;

    // u-turn if oob and heading further oob
    if (( boid.position.x < -width && velocity.x < 0 ) || ( boid.position.x > width && velocity.x > 0  )) {
      velocity.x *= turnFactor;
    }
    if (( boid.position.y < -height && velocity.y < 0 ) || ( boid.position.y > height && velocity.y > 0 )) {
      velocity.y *= turnFactor;
    }
    if (( boid.position.z < -Z_RANGE && velocity.z < 0 ) || ( boid.position.z > Z_RANGE && velocity.z > 0 )) {
      velocity.z *= turnFactor;
    }
    return [ velocity.x, velocity.y, velocity.z ];
}

const dist = (b1: Boid, b2: Boid) => {
    const [ dx, dy, dz ] = [ b1.position.x - b2.position.x, b1.position.y - b2.position.y, b1.position.z - b2.position.z ];
    // naively avoid some expensive sqrt operations
    if (Math.abs(dx) > VISION_RANGE ||  Math.abs(dy) > VISION_RANGE || Math.abs(dz) > VISION_RANGE) {
        return VERY_LARGE_NUMBER;
    }
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
}

const limitSpeed = (dx: number, dy: number, dz: number) => {
    // scale the vector so its maximum length does not exceed SPEED_LIMIT
    const speed = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
    if (speed > SPEED_LIMIT) {
        const slowFactor = SPEED_LIMIT / speed;
        return [dx * slowFactor, dy * slowFactor, dz * slowFactor];
    }
    return [dx, dy, dz];
}

export const initLoop = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    const { boids, velocities } = initBoids(scene);
    return _loop(camera)(boids, velocities);
}
const _loop = (camera: THREE.PerspectiveCamera) =>  (boids: Boid[], velocities: Velocity[]) => () => {
    const [ getXBounds, getYBounds ] = [ getVisibleWidthAtZDepth(camera), getVisibleHeightAtZDepth(camera) ]
    // TODO: integrity check (boids.length == velocities.length yada yada)
    for( let i = 0; i < NUM_BOIDS; i++ ) {
        let [ cx, cy, cz ] = [0, 0, 0]; // for tracking center of mass of nearby boids
        let [ sx, sy, sz ] = [0, 0, 0]; // adjustment vector to avoid collision with other boids
        let [ ax, ay, az ] = [0, 0, 0]; // adjustment vector to match velocity of nearby boids
        let { x: dx, y: dy, z: dz } = velocities[i] // final change vector
        let nNeighbors = 0;

        // search for neighbours
        for( let j = 0; j < NUM_BOIDS; j++ ) {
            if(i == j) continue;
            const d = dist(boids[i], boids[j]);
            if( d < VISION_RANGE ) {
                // running tally of nearby boids for center of mass
                cx += boids[j].position.x;
                cy += boids[j].position.y;
                cz += boids[j].position.z;
                nNeighbors += 1;

                // running tally of velocity of nearby boids for alignment
                ax += velocities[j].x;
                ay += velocities[j].y;
                az += velocities[j].z;
            }
            // track a vector directly away from colliding neighbours
            if ( d <= COLLISION_RANGE ) {
                sx += boids[i].position.x - boids[j].position.x;
                sy += boids[i].position.y - boids[j].position.y;
                sz += boids[i].position.z - boids[j].position.z;
            }
            
        }
        // calculate center of mass and move towards it
        const com = {
            x: cx / nNeighbors,
            y: cy / nNeighbors,
            z: cz / nNeighbors,
        };
        if (nNeighbors) {
            dx += ( com.x - boids[i].position.x ) * COHERENCE;
            dy += ( com.y - boids[i].position.y ) * COHERENCE;
            dz += ( com.z - boids[i].position.z ) * COHERENCE;
        }

        // move along avoidance vector
        dx += sx * SEPARATION;
        dy += sy * SEPARATION;
        dz += sz * SEPARATION;

        // match velocity of nearby boids
        if (nNeighbors) {
            dx += ((ax / nNeighbors) - dx) * ALIGNMENT;
            dy += ((ay / nNeighbors) - dy) * ALIGNMENT;
            dz += ((az / nNeighbors) - dz) * ALIGNMENT;
        }
        // stay within speed limit
        [ dx, dy, dz ] = limitSpeed(dx, dy, dz);

        // stay in bounds
        const stayInBounds = getStayInBoundsFromCanvasSize(getXBounds(boids[i].position.z), getYBounds(boids[i].position.z));
        // const stayInBounds = getStayInBoundsFromCanvasSize(getXBounds(0), getYBounds(0));
        [ dx, dy, dz ] = stayInBounds(boids[i], { x: dx, y: dy, z: dz });

        // TODO: set rotation
        const q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(dx, dy, dz));
        boids[i].applyQuaternion(q);

        // make final movement
        boids[i].position.x += dx;
        boids[i].position.y += dy;
        boids[i].position.z += dz;
        velocities[i] = { x: dx, y: dy, z: dz };
    }
}

/**
 * The following two functions calculate boundaries of the field of view along the x and y axes for a given camera position and z coordinate.
 * They will be used to restrict the movement of boids to remain within the FOV.
 * 
 * @param depth a z coordinate
 * @param camera the ThreeJS camera object for this canvas (although we only use the fov)
 * @returns 
 */
const getVisibleHeightAtZDepth = ( camera: THREE.PerspectiveCamera ) => ( depth: number ) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;
  
    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180; 
  
    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
  };
  
  const getVisibleWidthAtZDepth = ( camera: THREE.PerspectiveCamera ) => ( depth: number ) => {
    const height = getVisibleHeightAtZDepth( camera )( depth );
    return height * camera.aspect;
};