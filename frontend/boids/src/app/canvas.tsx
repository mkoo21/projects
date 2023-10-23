'use client'

import { useMemo, useEffect, useState, useRef } from 'react';
import { initScene, initLoop } from './boids';

const CANVAS_HEIGHT = 600;

const Canvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scene, camera, renderer } = useMemo(() => {
        if(!document) return { scene: null, camera: null, renderer: null };
        return initScene();
    }, []);

    useEffect(() => {
        // set renderer dimensions and add it to the dom
        const element = containerRef.current;
        if(!element || !scene || !camera || !renderer) return;
        const [ canvasWidth, canvasHeight ] = [ element.clientWidth || window.innerWidth, CANVAS_HEIGHT ];
        renderer.setSize( canvasWidth, canvasHeight );
        element.replaceChildren( renderer.domElement );
        const loop = initLoop(scene, camera);

        const animate = () => {
            loop();
            requestAnimationFrame( animate );
        
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