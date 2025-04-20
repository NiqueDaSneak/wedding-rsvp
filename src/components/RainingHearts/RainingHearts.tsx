import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './RainingHearts.scss';

interface HeartParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector2;
  acceleration: THREE.Vector2;
  mass: number;
  orbitType: number; // Add orbit pattern type for each particle
  orbitPhase: number; // Add phase offset for orbit variations
  orbitEccentricity: number; // Add eccentricity for elliptical orbits
}

const RainingHearts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const heartParticlesRef = useRef<HeartParticle[]>([]);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const timeRef = useRef<number>(0);
  const dimensionsRef = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const isInitializedRef = useRef(false);
  const fallbackRef = useRef<boolean>(false);
  const cssHeartsRef = useRef<HTMLDivElement[]>([]);
  const isMouseDownRef = useRef<boolean>(false);
  const blackHoleStrengthRef = useRef<number>(0);
  const explosionStrengthRef = useRef<number>(0);
  const clickPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isTouchDeviceRef = useRef<boolean>(false);
  const orbitPatternRef = useRef<number>(0); // 0: circular, 1: elliptical, 2: figure-8, 3: spiral
  const orbitVariationTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    let isWebGLSupported = true;
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        isWebGLSupported = false;
      }
    } catch (e) {
      isWebGLSupported = false;
      console.warn('WebGL not supported, falling back to CSS hearts');
    }
    fallbackRef.current = !isWebGLSupported;

    isTouchDeviceRef.current =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    if (fallbackRef.current) {
      createCSSHearts();
      return;
    }

    if (!containerRef.current) return;

    initializeThreeJS();

    // Handle mouse events only (not touch)
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    // We're removing touch event listeners to allow scrolling on mobile
    // Hearts will still display but won't react to touch

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      disposeThreeJS();
    };
  }, []);

  const handleMouseDown = (event: MouseEvent) => {
    isMouseDownRef.current = true;
    blackHoleStrengthRef.current = 0;

    const vector = new THREE.Vector3(
      (event.clientX / dimensionsRef.current.width) * 2 - 1,
      -((event.clientY / dimensionsRef.current.height) * 2 - 1),
      0,
    );
    vector.unproject(cameraRef.current!);
    const dir = vector.sub(cameraRef.current!.position).normalize();
    const distance = -cameraRef.current!.position.z / dir.z;
    clickPositionRef.current = cameraRef
      .current!.position.clone()
      .add(dir.multiplyScalar(distance));
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      explosionStrengthRef.current = blackHoleStrengthRef.current * 1.5;
      blackHoleStrengthRef.current = 0;
      isMouseDownRef.current = false;
    }
  };

  const initializeThreeJS = () => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      dimensionsRef.current.width / dimensionsRef.current.height,
      0.1,
      1000,
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(dimensionsRef.current.width, dimensionsRef.current.height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    addLighting(scene);

    createHeartParticles();

    // Ensure the container doesn't capture any pointer events
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = 'none';
    }

    animate();
  };

  const addLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff40, 0.8, 15);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);
  };

  const createHeartParticles = () => {
    if (!sceneRef.current) return;

    const heartShape = createHeartShape();

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.2,
      bevelThickness: 0.2,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(
      heartShape,
      extrudeSettings,
    );
    heartGeometry.scale(0.1, 0.1, 0.1);
    heartGeometry.rotateZ(Math.PI);

    const isMobile = window.innerWidth < 768;
    const heartCount = isMobile
      ? Math.min(20, Math.floor(dimensionsRef.current.width / 80))
      : Math.min(30, Math.floor(dimensionsRef.current.width / 60));

    heartParticlesRef.current = [];

    const coolGreen = new THREE.Color(0, 0.8, 0.4);
    const coolGreenEmissive = new THREE.Color(0, 0.2, 0.1);

    for (let i = 0; i < heartCount; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: coolGreen,
        emissive: coolGreenEmissive,
        specular: new THREE.Color(0.5, 1, 0.5),
        shininess: 100,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5,
      });

      const mesh = new THREE.Mesh(heartGeometry.clone(), material);

      mesh.position.set(
        (Math.random() * 2 - 1) * 10,
        (Math.random() * 2 - 1) * 10,
        Math.random() * 5 - 2.5,
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      const scale = 0.5 + Math.random() * 1.0;
      mesh.scale.set(scale, scale, scale);

      sceneRef.current.add(mesh);

      heartParticlesRef.current.push({
        mesh,
        velocity: new THREE.Vector2(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.03 + 0.01,
        ),
        acceleration: new THREE.Vector2(0, 0),
        mass: 0.1 + Math.random() * 0.9,
        orbitType: Math.floor(Math.random() * 4),
        orbitPhase: Math.random() * Math.PI * 2,
        orbitEccentricity: 0.2 + Math.random() * 0.6,
      });
    }
  };

  const createHeartShape = () => {
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;

    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo(x - 1, y - 1.5, x - 3, y + 1, x, y + 3);
    heartShape.bezierCurveTo(x + 3, y + 1, x + 1, y - 1.5, x, y);

    return heartShape;
  };

  const createCSSHearts = () => {
    if (!containerRef.current) return;

    const heartCount = 20;
    cssHeartsRef.current = [];

    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerHTML = '💚';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.top = `-50px`;
      heart.style.opacity = `${0.5 + Math.random() * 0.5}`;
      heart.style.fontSize = `${10 + Math.random() * 20}px`;
      heart.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

      containerRef.current.appendChild(heart);
      cssHeartsRef.current.push(heart);
    }

    animateCSSHearts();
  };

  const animateCSSHearts = () => {
    if (fallbackRef.current && cssHeartsRef.current.length > 0) {
      cssHeartsRef.current.forEach((heart, index) => {
        const top = parseFloat(heart.style.top);
        const left = parseFloat(heart.style.left);

        heart.style.top = `${top + 1 + Math.random()}px`;
        heart.style.left = `${
          left + Math.sin(Date.now() * 0.001 + index) * 0.5
        }px`;

        if (top > window.innerHeight) {
          heart.style.top = `-50px`;
          heart.style.left = `${Math.random() * 100}vw`;
        }
      });

      requestAnimationFrame(animateCSSHearts);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / dimensionsRef.current.width) * 2 - 1;
    const y = -((event.clientY / dimensionsRef.current.height) * 2 - 1);
    mouseRef.current.set(x, y);
  };

  const handleResize = () => {
    dimensionsRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  };

  const animate = () => {
    frameIdRef.current = requestAnimationFrame(animate);

    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const currentTime = performance.now() * 0.001;
    const deltaTime = Math.min(0.05, currentTime - timeRef.current);
    timeRef.current = currentTime;

    if (isMouseDownRef.current) {
      blackHoleStrengthRef.current = Math.min(
        1.0,
        blackHoleStrengthRef.current + deltaTime * 1.5,
      );
    }

    if (explosionStrengthRef.current > 0) {
      explosionStrengthRef.current = Math.max(
        0,
        explosionStrengthRef.current - deltaTime * 1.0,
      );
    }

    orbitVariationTimeRef.current += deltaTime * 0.2;
    if (!isMouseDownRef.current && explosionStrengthRef.current === 0) {
      if (Math.random() < 0.001) {
        orbitPatternRef.current = (orbitPatternRef.current + 1) % 4;
      }
    }

    updateHeartParticles(deltaTime);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const updateHeartParticles = (deltaTime: number) => {
    if (!heartParticlesRef.current.length) return;

    const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0);
    vector.unproject(cameraRef.current!);
    const dir = vector.sub(cameraRef.current!.position).normalize();
    const distance = -cameraRef.current!.position.z / dir.z;
    const mouseWorldPos = cameraRef
      .current!.position.clone()
      .add(dir.multiplyScalar(distance));

    const coolGreen = new THREE.Color(0, 0.8, 0.4);
    const dangerRed = new THREE.Color(0.9, 0.1, 0.1);
    const coolGreenEmissive = new THREE.Color(0, 0.2, 0.1);
    const dangerRedEmissive = new THREE.Color(0.3, 0, 0);

    const tempColor = new THREE.Color();
    const tempEmissive = new THREE.Color();

    heartParticlesRef.current.forEach((particle, index) => {
      const { mesh, velocity, mass, orbitType, orbitPhase, orbitEccentricity } =
        particle;

      const gravityStrength = isMouseDownRef.current ? 0.01 : 0.05;
      particle.acceleration.set(0, -gravityStrength);

      const dx = mouseWorldPos.x - mesh.position.x;
      const dy = mouseWorldPos.y - mesh.position.y;
      const distanceSquared = dx * dx + dy * dy;
      const distance = Math.sqrt(distanceSquared);

      if (isMouseDownRef.current && blackHoleStrengthRef.current > 0) {
        const bhDx = clickPositionRef.current.x - mesh.position.x;
        const bhDy = clickPositionRef.current.y - mesh.position.y;
        const bhDistanceSquared = bhDx * bhDx + bhDy * bhDy;
        const bhDistance = Math.sqrt(bhDistanceSquared);

        const blackHoleAttraction = (0.4 * blackHoleStrengthRef.current) / mass;
        const bhForceMagnitude =
          blackHoleAttraction / Math.max(0.1, bhDistanceSquared / 3);

        const cappedBhForce = Math.min(bhForceMagnitude, 1.0);

        particle.acceleration.x += bhDx * cappedBhForce;
        particle.acceleration.y += bhDy * cappedBhForce;

        const spiralStrength = 0.1 * blackHoleStrengthRef.current;

        switch (orbitType) {
          case 0:
            particle.acceleration.x += (-bhDy * spiralStrength) / bhDistance;
            particle.acceleration.y += (bhDx * spiralStrength) / bhDistance;
            break;

          case 1:
            particle.acceleration.x +=
              (-bhDy * spiralStrength * 2) / bhDistance;
            particle.acceleration.y += (bhDx * spiralStrength * 2) / bhDistance;
            break;

          case 2:
            const oscillation = Math.sin(timeRef.current * 3 + orbitPhase);
            particle.acceleration.x +=
              (-bhDy * spiralStrength * oscillation) / bhDistance;
            particle.acceleration.y +=
              (bhDx * spiralStrength * oscillation) / bhDistance;
            break;

          case 3:
            const angle = Math.atan2(bhDy, bhDx);
            const eccFactor =
              1 + orbitEccentricity * Math.sin(angle * 2 + timeRef.current);
            particle.acceleration.x +=
              (-bhDy * spiralStrength * eccFactor) / bhDistance;
            particle.acceleration.y +=
              (bhDx * spiralStrength * eccFactor) / bhDistance;
            break;
        }

        const proximityFactor = Math.max(0.4, Math.min(1.0, bhDistance / 5));
        const baseScale = 0.5 + mass * 0.5;
        mesh.scale.set(
          baseScale * proximityFactor,
          baseScale * proximityFactor,
          baseScale * proximityFactor,
        );

        const redFactor = Math.min(
          1.0,
          blackHoleStrengthRef.current * (1.0 - Math.min(1.0, bhDistance / 8)),
        );

        tempColor.copy(coolGreen).lerp(dangerRed, redFactor);
        tempEmissive.copy(coolGreenEmissive).lerp(dangerRedEmissive, redFactor);

        if (mesh.material instanceof THREE.MeshPhongMaterial) {
          mesh.material.color.copy(tempColor);
          mesh.material.emissive.copy(tempEmissive);
          mesh.material.shininess = 100 + redFactor * 100;
        }
      } else if (explosionStrengthRef.current > 0) {
        const expDx = clickPositionRef.current.x - mesh.position.x;
        const expDy = clickPositionRef.current.y - mesh.position.y;
        const expDistanceSquared = expDx * expDx + expDy * expDy;
        const expDistance = Math.sqrt(expDistanceSquared);

        const explosionRepulsion =
          (2.0 * explosionStrengthRef.current) / Math.sqrt(mass);
        const expForceMagnitude =
          explosionRepulsion / Math.max(0.5, expDistance);

        const cappedExpForce = Math.min(expForceMagnitude, 2.0);
        particle.acceleration.x -= (expDx * cappedExpForce) / expDistance;
        particle.acceleration.y -= (expDy * cappedExpForce) / expDistance;

        const spinStrength = 0.2 * explosionStrengthRef.current;
        particle.acceleration.x += (-expDy * spinStrength) / expDistance;
        particle.acceleration.y += (expDx * spinStrength) / expDistance;

        const scaleBoost =
          1.0 + 0.5 * explosionStrengthRef.current * Math.random();
        const baseScale = 0.5 + mass * 0.5;
        mesh.scale.set(
          baseScale * scaleBoost,
          baseScale * scaleBoost,
          baseScale * scaleBoost,
        );

        const coolDownFactor = explosionStrengthRef.current;

        tempColor.copy(dangerRed).lerp(coolGreen, 1 - coolDownFactor);
        tempEmissive
          .copy(dangerRedEmissive)
          .lerp(coolGreenEmissive, 1 - coolDownFactor);

        if (mesh.material instanceof THREE.MeshPhongMaterial) {
          mesh.material.color.copy(tempColor);
          mesh.material.emissive.copy(tempEmissive);
          mesh.material.shininess = 200 - (1 - coolDownFactor) * 100;
        }
      } else if (distance > 0.5) {
        const attractionStrength = 0.1 / mass;
        const forceMagnitude =
          attractionStrength / Math.max(0.1, distanceSquared);

        const cappedForce = Math.min(forceMagnitude, 0.3);
        particle.acceleration.x += dx * cappedForce;
        particle.acceleration.y += dy * cappedForce;

        if (distance < 5 && distance > 0.5) {
          const orbitalFactor = 0.02 / Math.sqrt(mass);

          switch (orbitPatternRef.current) {
            case 0:
              particle.acceleration.x += -dy * orbitalFactor;
              particle.acceleration.y += dx * orbitalFactor;
              break;

            case 1:
              const angle = Math.atan2(dy, dx);
              const eccFactor =
                1 + orbitEccentricity * Math.sin(angle * 2 + orbitPhase);
              particle.acceleration.x += -dy * orbitalFactor * eccFactor;
              particle.acceleration.y += dx * orbitalFactor * eccFactor;
              break;

            case 2:
              const phase =
                Math.atan2(dy, dx) + timeRef.current * 0.5 + orbitPhase;
              const figureFactor = Math.sin(phase * 2) * orbitalFactor;
              particle.acceleration.x += -dy * figureFactor;
              particle.acceleration.y += dx * figureFactor;
              break;

            case 3:
              const vortexFactor =
                orbitalFactor *
                (1 + 0.5 * Math.sin(timeRef.current + index * 0.1));
              const wobble = Math.sin(timeRef.current * 0.5 + orbitPhase);
              particle.acceleration.x +=
                -dy * vortexFactor + dx * wobble * 0.01;
              particle.acceleration.y += dx * vortexFactor + dy * wobble * 0.01;
              break;
          }
        }
      }

      velocity.x += particle.acceleration.x * deltaTime;
      velocity.y += particle.acceleration.y * deltaTime;

      const drag = isMouseDownRef.current ? 0.95 : 0.99;
      velocity.x *= drag;
      velocity.y *= drag;

      mesh.position.x += velocity.x;
      mesh.position.y += velocity.y;

      const rotationSpeed = explosionStrengthRef.current > 0 ? 0.01 : 0.002;
      mesh.rotation.x += rotationSpeed * deltaTime * 60;
      mesh.rotation.z += rotationSpeed * 2 * deltaTime * 60;

      if (mesh.position.y < -10) {
        mesh.position.set(
          (Math.random() * 2 - 1) * 10,
          10,
          Math.random() * 5 - 2.5,
        );
        velocity.set(
          (Math.random() - 0.5) * 0.02,
          -0.01 - Math.random() * 0.02,
        );
      }

      if (mesh.position.x < -15) mesh.position.x = 15;
      if (mesh.position.x > 15) mesh.position.x = -15;
    });
  };

  const disposeThreeJS = () => {
    if (!rendererRef.current || !containerRef.current) return;

    containerRef.current.removeChild(rendererRef.current.domElement);
    rendererRef.current.dispose();

    heartParticlesRef.current.forEach((particle) => {
      if (particle.mesh.geometry) particle.mesh.geometry.dispose();

      if (Array.isArray(particle.mesh.material)) {
        particle.mesh.material.forEach((material) => material.dispose());
      } else if (particle.mesh.material) {
        particle.mesh.material.dispose();
      }
    });

    heartParticlesRef.current = [];
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '4') {
        orbitPatternRef.current = parseInt(event.key) - 1;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      className="raining-hearts"
      ref={containerRef}
      style={{ pointerEvents: 'none' }} // Ensure touch events pass through
    />
  );
};

export default RainingHearts;
