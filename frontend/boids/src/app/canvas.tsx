"use client"

import { useMemo, useEffect } from 'react';
import { initScene, initLoop } from './boids';

const canvasContainerId = "canvas-container";
const CANVAS_HEIGHT = 600;

export default () => {
    const { scene, camera, renderer } = useMemo(() => {
        return initScene();
    }, []);

    useEffect(() => {
        // set renderer dimensions and add it to the dom
        const element = document.getElementById(canvasContainerId);
        const [ canvasWidth, canvasHeight ] = [ element?.clientWidth || window.innerWidth, CANVAS_HEIGHT ];
        renderer.setSize( canvasWidth, canvasHeight );
        element?.replaceChildren( renderer.domElement );
        const loop = initLoop(scene, camera);

        const animate = () => {
            loop();
            requestAnimationFrame( animate );
        
            renderer.render( scene, camera );
        }
        animate();

    }, []);

    if(!window) return null;
    return <div id={canvasContainerId} />;
};
