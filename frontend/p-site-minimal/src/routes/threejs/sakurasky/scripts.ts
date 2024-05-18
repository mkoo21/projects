import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/addons/loaders/FBXLoader';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader';

const PARTICLE_COUNT = 100;
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
    const controls = new OrbitControls(camera, canvas);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const composer = composeEffects(renderer, scene, camera);
    const background = loadBackground(scene);
    createStars(scene);
    setLighting(scene);
    // loadModels(scene);

    document.body.replaceChildren( renderer.domElement );

    const main = () => {

        renderer.render( scene, camera );
        background.rotation.x -= 0.0002;
        background.rotation.y += 0.0005;
        background.rotation.z -= 0.0001;
        requestAnimationFrame( main );
    }
    return { scene, camera, renderer, main, composer };
};

const loadBackground = (scene: THREE.Scene) => {
    // const texture = loader.load(`${PREFIX}/jeremy-perkins-FsK54FVNRfM-unsplash.jpg`);
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

const createStars = (scene: THREE.Scene) => {
    const texture = loader.load('/src/assets/p3-ttfn70.png');
    var position = new THREE.BufferAttribute( new Float32Array(3*PARTICLE_COUNT), 3),
        color = new THREE.BufferAttribute( new Float32Array(3*PARTICLE_COUNT), 3),
        v = new THREE.Vector3( );

    for( var i=0; i<PARTICLE_COUNT; i++ )
    {
            v.randomDirection( ).setLength( 3+2*Math.pow(Math.random(),1/3) );
            position.setXYZ( i, v.x, v.y, v.z );
            color.setXYZ( i, Math.random( ), Math.random( ), Math.random( ) );
    }

    var geometry = new THREE.BufferGeometry( );
            geometry.setAttribute( 'position', position );
            geometry.setAttribute( 'color', color );
    var material = new THREE.PointsMaterial( {
                    color: 'white',
                    vertexColors: true,
                    size: 2,
                    sizeAttenuation: true,
                    map: texture,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
            } );
    var cloud = new THREE.Points( geometry, material );
    scene.add( cloud );
}