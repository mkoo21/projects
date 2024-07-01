import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI, NumberController } from 'three/addons/libs/lil-gui.module.min.js';

const loader = new THREE.TextureLoader();

enum Shapes {
    Sphere,
    Ellipse, 
}

const SETTINGS = {
    'particle count': 150,
    'shape': Shapes[Shapes.Sphere],
}

const ELLIPSE_PARAMS = { a: 10, b: 10, c: 10, minA: 0, minB: 0, minC: 0, maxTheta: 2 * Math.PI, maxPhi: Math.PI, surfaceOnly: true };
const SPHERE_PARAMS = { radius: 10, maxTheta: 2 * Math.PI, maxPhi: Math.PI };

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
    initGui();
    return { scene, camera, renderer, main, composer, controls };
};

const initGui = () => {
    const panel = new GUI();
    const settings = {
        ...SETTINGS,
    };
    const shapesFolder = panel.addFolder('Shapes');
    let paramsFolder = panel.addFolder('Params');
    const setSphereParams = () => {
        paramsFolder.add(SPHERE_PARAMS, 'radius', 0, 100, 1);
    };
    const setEllipseParams = () => {
        paramsFolder.add(ELLIPSE_PARAMS, 'a', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'b', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'c', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'minA', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'minB', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'minC', 0, 100, 1);
        paramsFolder.add(ELLIPSE_PARAMS, 'maxTheta', 0, 2 * Math.PI, 0.1);
        paramsFolder.add(ELLIPSE_PARAMS, 'maxPhi', 0, Math.PI, 0.1);
    };
    const onShapeChange = (shape: string | number) => {
        paramsFolder.destroy();

        paramsFolder = panel.addFolder('Params');
        switch (shape) {
            case Shapes[Shapes.Sphere]:
                setSphereParams();
            case Shapes[Shapes.Ellipse]:
                setEllipseParams();
        };
    }

    shapesFolder.add<typeof settings, keyof typeof settings>(settings, "shape", Object.keys(Shapes).filter(x => isNaN(Number(x)))).onChange(onShapeChange);
    setSphereParams(); // because sphere is default
    // shapesFolder.add<typeof settings, keyof typeof settings>(settings, "shape").onChange(onShapeChange);
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
    camera.position.set(0, 0, 50);
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
    color?: THREE.Color;
    ellipseParams?: EllipseParams;
    sphereParams?: SphereParams;
    count?: number;
    shape: Shapes[Shapes.Sphere];
}

const createCloud = (params?: CloudParams) => {
    const count = params?.count || 100;
    const color = params?.color || new THREE.Color('plum');
    const sphereParams = params?.sphereParams || {};
    const ellipseParams = params?.ellipseParams || {};
    const shape = params?.shape;

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
    const params = {
        ...ELLIPSE_PARAMS,
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

interface SphereParams {
    radius?: number;
    maxTheta?: number;
    maxPhi?: number;
};

const genPointSphere = ( _params?: SphereParams ) => {
    const params = {
        ...SPHERE_PARAMS,
        ..._params,
    }

    const v = new THREE.Vector3();
    const theta = Math.random() * params.maxTheta;
    const phi = Math.random() * params.maxPhi;
    const { radius } = params;
    v.setFromSphericalCoords(radius, phi, theta);
    return v;
};
