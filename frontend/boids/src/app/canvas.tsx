'use client'

import { useMemo, useEffect, useReducer, useState, useRef } from 'react';
import { initScene, initLoop } from './boids';

const CANVAS_HEIGHT = 600;

const Canvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ frameCount, setFrameCount ] = useState(0); // for tracking framerate
    const [ fps, setFps ] = useState<number | null>(null);
    const [ timer, setTimer ] = useState<ReturnType<typeof setInterval> | null>(null);

    const { scene, camera, renderer } = useMemo(() => {
        if(!document) return { scene: null, camera: null, renderer: null };
        return initScene();
    }, []);

    const incrementFrames = () => {
        setFrameCount((frameCount) => {
            return frameCount + 1
        });
    };

    const fpsTick = () => {
        console.log(frameCount)
        setFps(frameCount);
        setFrameCount(0);
    }

    useEffect(() => {
        // set renderer dimensions and add it to the dom
        const element = containerRef.current;
        if(!element || !scene || !camera || !renderer) return;
        const [ canvasWidth, canvasHeight ] = [ element.clientWidth || window.innerWidth, CANVAS_HEIGHT ];
        renderer.setSize( canvasWidth, canvasHeight );
        element.replaceChildren( renderer.domElement );

        // track framerate
        if(!timer) {
            setTimer(setInterval(fpsTick, 1000));
        };

        // animate canvas
        const loop = initLoop(scene, camera);
        const animate = () => {
            loop();
            requestAnimationFrame( animate );
            incrementFrames();
            renderer.render( scene, camera );
        }
        animate();

    }, [camera, renderer, scene]);

    return <div ref={containerRef} />;
};

const NextIsStupid = () => {
    // tricks the compiler into not prerendering ThreeJS. Cause as of next@13.5.6 this only works if it's its own component. Try it.
    const [ isClient, setIsClient ] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <Canvas /> : null;
}

export default NextIsStupid;