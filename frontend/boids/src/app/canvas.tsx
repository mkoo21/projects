'use client'

import { useMemo, useEffect, useReducer, useState, useRef } from 'react';
import { initScene, initLoop } from './boids';
import fpsReducer, { FPS_INITIAL_VALUE} from './fpsReducer';

const CANVAS_HEIGHT = 600;

const Canvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ fpsState, fpsDispatch ] = useReducer(fpsReducer, FPS_INITIAL_VALUE);

    const { scene, camera, renderer } = useMemo(() => {
        if(!document) return { scene: null, camera: null, renderer: null };
        return initScene();
    }, []);

    const incrementFrames = () => {
        fpsDispatch({ type: "increment" })
    };

    const setFpsTimer = () => {
        if(fpsState.timerId) return;
        const tick = () => fpsDispatch({ type: "tick" });
        fpsDispatch({
            type: "set_timer",
            payload: tick,
        })
    }

    useEffect(() => {
        // set renderer dimensions and add it to the dom
        const element = containerRef.current;
        if(!element || !scene || !camera || !renderer) return;
        const [ canvasWidth, canvasHeight ] = [ element.clientWidth || window.innerWidth, CANVAS_HEIGHT ];
        renderer.setSize( canvasWidth, canvasHeight );
        element.replaceChildren( renderer.domElement );

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

    useEffect(() => {
        setFpsTimer();
        return () => {
            if(fpsState.timerId) {
                clearInterval(fpsState.timerId);
            }
        }
    }, []);

    return <>
        <div ref={containerRef} />
        Estimated fps: { fpsState.measuredFrameRate }
    </>;
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