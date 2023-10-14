"use client"

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

const canvasContainerId = "canvas-container";
const CANVAS_HEIGHT = 600;
const NUM_BOIDS = 100;
const Z_RANGE = 10; // z axis is not limited by canvas but must be set
const VISION_RANGE = 200;
const COLLISION_RANGE = 3;
const VERY_LARGE_NUMBER = 9000; // larger than VISION_RANGE, hopefully
const SPEED_LIMIT = 15;

// params
const COHERENCE = 0.01;
const SEPARATION = 0.06; // must be higher than coherence
const ALIGNMENT = 0.04;


type Velocity = {
    x: number,
    y: number,
    z: number,
}
type Boid = THREE.Mesh<THREE.WireframeGeometry<THREE.ConeGeometry>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

const initBoids = (scene: THREE.Scene, canvasWidth: number, canvasHeight: number) => {
    const boids: Boid[] = []; // stores meshes
    const velocities: Velocity[] = []; // track each boid velocity in separate array
    for( let i = 0; i < NUM_BOIDS; i++ ) {
        // init a single boid to a random starting position
        const geometry = new THREE.WireframeGeometry(new THREE.ConeGeometry( 0.1, 0.3, 4, 1 ));
        const material = new THREE.MeshBasicMaterial({ color: 0x5000ee });
        let mesh = new THREE.Mesh( geometry, material );
        // [ mesh.position.x, mesh.position.y, mesh.position.z, mesh.rotation.x, mesh.rotation.y, mesh.rotation.z ] 
            // = Array.from({ length: 6 }, () => Math.random() * 10 - 5);
        [ mesh.position.x, mesh.position.y, mesh.position.z ] = [ Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * Z_RANGE - (Z_RANGE / 2)];
        [ mesh.rotation.x, mesh.rotation.y, mesh.rotation.z ] = Array.from({ length: 3 }, () => Math.random() * 2)
        boids.push(mesh);
        velocities.push({ x: Math.random() * 10 - 5, y: Math.random() * 10 - 5, z: Math.random() * 10 - 5 });
        debugger;
        scene.add( mesh );

    }
    return { boids, velocities };
}

const getStayInBoundsFromCanvasSize = (width: number, height: number) => (boid: Boid, velocity: Velocity) => {
    // todo: transform to threejs coords
    const turnFactor = 1; // rotation is rad

    // u-turn if oob
    if (boid.position.x < 0 || boid.position.x > width) {
      velocity.x += turnFactor;
    }
    
    if (boid.position.y < 0 || boid.position.y > height) {
      velocity.y += turnFactor;
    }
    if (boid.position.z > Z_RANGE || boid.position.z < -Z_RANGE) {
      velocity.z += turnFactor;
    }
    return [ velocity.x, velocity.y, velocity.z ];
}

const dist = (b1: Boid, b2: Boid) => {
    // naively avoid some expensive sqrt operations
    const [ dx, dy, dz ] = [ b1.position.x - b2.position.x, b1.position.y - b2.position.y, b1.position.z - b2.position.z ];
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

const getLoopFromCanvasSize = (width: number, height: number) =>  (boids: Boid[], velocities: Velocity[]) => {
    // TODO: integrity check (boids.length == velocities.length yada yada)
    for( let i = 0; i < NUM_BOIDS; i++ ) {
        let [ cx, cy, cz ] = [0, 0, 0]; // for tracking center of mass of nearby boids
        let [ sx, sy, sz ] = [0, 0, 0]; // adjustment vector to avoid collision with other boids
        let { x: dx, y: dy, z: dz } = velocities[i] // final change vector
        let nNeighbors = 0;
        for( let j = 0; j < NUM_BOIDS; j++ ) {
            if(i == j) continue;
            const d = dist(boids[i], boids[j]);
            // running tally of nearby boids for center of mass
            if( d < VISION_RANGE ) {
                cx += boids[j].position.x;
                cy += boids[j].position.y;
                cz += boids[j].position.z;
                nNeighbors += 1;
            }
            // separation; avoid neighbours
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
        dx += com.x * COHERENCE;
        dy += com.y * COHERENCE;
        dz += com.z * COHERENCE;

        // move along avoidance vector
        dx += sx * SEPARATION;
        dy += sy * SEPARATION;
        dz += sz * SEPARATION;

        // stay within speed limit
        [ dx, dy, dz ] = limitSpeed(dx, dy, dz);

        // stay in bounds
        const stayInBounds = getStayInBoundsFromCanvasSize(width, height);
        [ dx, dy, dz ] = stayInBounds(boids[i], { x: dx, y: dy, z: dz });

        // rotate to face direction

        // make final movement
        boids[i].position.x += dx;
        boids[i].position.y += dy;
        boids[i].position.z += dz;
        velocities[i] = { x: dx, y: dy, z: dz };
    }
}

export default () => {
    const { scene, camera, renderer } = useMemo(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        return { scene, camera, renderer };
    }, [window.innerHeight, window.innerWidth]);

    useEffect(() => {
        // set renderer dimensions and add it to the dom
        const element = document.getElementById(canvasContainerId);
        const [ canvasWidth, canvasHeight ] = [ element?.clientWidth || window.innerWidth, CANVAS_HEIGHT ];
        renderer.setSize( canvasWidth, canvasHeight );
        element?.replaceChildren( renderer.domElement );
        const loop = getLoopFromCanvasSize(canvasWidth, canvasHeight);

        // lighting
        const light = new THREE.AmbientLight( 0xcccccc ); // soft white light
        scene.add( light );

        const { boids, velocities } = initBoids(scene, canvasWidth, canvasHeight);
        // set camera
        camera.position.z = 10;

        const animate = () => {
            // loop(boids, velocities);
            requestAnimationFrame( animate );
        
            renderer.render( scene, camera );
        }
        animate();

    }, [renderer, document]);

    if(!window) return null;
    return <div id={canvasContainerId} />;
};
