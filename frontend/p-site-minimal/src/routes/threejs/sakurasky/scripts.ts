import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/addons/loaders/FBXLoader';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader';

const CLOUD_RADIUS = 200;

const MODELS_PREFIX = '/src/lib/models';
const tdaModel = '/src/lib/models/TdaMikuVer1.10/Tda式初音ミク・アペンド_Ver1.10.pmx';
const vpdFiles = Array.from({ length: 8}, (x, i) => `${MODELS_PREFIX}/Pose Pack 1 - Snorlaxin/${i + 1}.vpd`);

const loader = new THREE.TextureLoader();

export const initScene = (canvas: HTMLDivElement | undefined) => {
    if(!canvas) return;
    const scene = new THREE.Scene();
    const camera = setCamera();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const composer = composeEffects(renderer, scene, camera);
    const background = loadBackground(scene);
    const cloud = createCloud({ count: 150, ellipseParams: { a: 20, b: 4, c: 20, surfaceOnly: false }});
    console.log(THREE.Color.NAMES)
    scene.add(cloud);
    setLighting(scene);
    // loadModels(scene);

    document.body.replaceChildren( renderer.domElement );

    const main = () => {

        renderer.render( scene, camera );
        background.rotation.x -= 0.0002;
        background.rotation.y += 0.0005;
        background.rotation.z -= 0.0001;
        requestAnimationFrame( main );
        controls.update();
    }
    return { scene, camera, renderer, main, composer, controls };
};

const loadBackground = (scene: THREE.Scene) => {
    const texture = loader.load('https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg');
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    const sphereGeometry = new THREE.SphereGeometry(40, 100, 100);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: texture,
        toneMapped: false,
    });
    const background = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(background);
    return background;
};

const setCamera = () => {
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
    // camera.position.set(0, 5, 70);
    camera.position.set(0, 0, 50)
    return camera;
};

const setLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambientLight );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLight.position.set(20, 100, 10 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );
};

const loadModels = (scene: THREE.Scene) => {
    const loader = new MMDLoader();
    const helper = new MMDAnimationHelper();
    // const loader = new GLTFLoader();
    loader.load(tdaModel,
    (model) => {
        model.position.y = - 10;
        scene.add( model );

        loader.loadVPD(vpdFiles[1], false, (vpd) => {
            helper.pose(model, vpd)
        });
    },
    (xhr) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    (error) => {
        console.error(error)
    })
};

const composeEffects = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
    const effect = new SelectiveBloomEffect(scene, camera, {
        mipmapBlur: true,
        luminanceThreshold: 0,
        luminanceSmoothing: 0.2,
        intensity: 2.0
    });
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // composer.addPass(new EffectPass(camera, effect));

    return composer;
};

interface CloudParams {
    count?: number;
    color?: THREE.Color,
    ellipseParams?: EllipseParams
}

const createCloud = (params?: CloudParams) => {
    const count = params?.count || 100;
    const color = params?.color || new THREE.Color('plum');
    const ellipseParams = params?.ellipseParams || {};

    const texture = loader.load('/src/assets/p3-ttfn70.png');
    const positions = new THREE.BufferAttribute(new Float32Array(3 * count), 3),
        colors = new THREE.BufferAttribute(new Float32Array(3 * count), 3);

    for(let i = 0; i < count; i++) {
        // v.randomDirection().setLength(1); // generate a point on unit sphere surface
        const v = genPointEllipse(ellipseParams);
        // scale to ellipse
        positions.setXYZ(i, v.x, v.y, v.z);
        colors.setXYZ(i, color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', positions );
        geometry.setAttribute( 'color', colors );
    const material = new THREE.PointsMaterial({
        color: 'white',
        vertexColors: true,
        size: 2,
        sizeAttenuation: true,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    return new THREE.Points(geometry, material);
}

interface EllipseParams {
    a?: number;
    b?: number;
    c?: number;
    minA?: number;
    minB?: number;
    minC?: number;
    maxTheta?: number;
    maxPhi?: number;
    surfaceOnly?: boolean;
};

const genPointEllipse = ( _params?: EllipseParams ) => {
    const DEFAULTPARAMS = { a: 10, b: 10, c: 10, minA: 0, minB: 0, minC: 0, maxTheta: 2 * Math.PI, maxPhi: Math.PI, surfaceOnly: true };
    const params = {
        ...DEFAULTPARAMS,
        ..._params,
    };

    const v = new THREE.Vector3();
    const t = new THREE.Vector3(params.a, params.b, params.c);

    // technically not the correct way to gen uniform spherical coordiantes but w.e.
    const theta = Math.random() * params.maxTheta;
    const phi = Math.random() * params.maxPhi;
    const radius = params.surfaceOnly ? 1 : Math.random();
    v.setFromSphericalCoords(radius, phi, theta); // generate point on unit sphere
    v.multiplyVectors(v, t); // stretch to ellipse
    return v;
};
