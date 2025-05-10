import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NebulaGlow: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const textureLoader = new THREE.TextureLoader();
    const nebulaTexture = textureLoader.load('https://threejs.org/examples/textures/galaxy.png');

    const nebulaMaterial = new THREE.SpriteMaterial({ map: nebulaTexture });
    const nebula = new THREE.Sprite(nebulaMaterial);
    nebula.scale.set(10, 10, 1);
    scene.add(nebula);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      nebula.rotation.z += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default NebulaGlow;