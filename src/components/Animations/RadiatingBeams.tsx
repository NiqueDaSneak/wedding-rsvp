import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RadiatingBeams: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const beams = new THREE.Group();
    const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    for (let i = 0; i < 12; i++) {
      const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 32);
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.rotation.z = (i * Math.PI) / 6;
      beams.add(beam);
    }

    scene.add(beams);
    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      beams.rotation.z += 0.01;
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

export default RadiatingBeams;
