import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './RainingHearts.scss';

interface HeartParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector2;
  acceleration: THREE.Vector2;
  mass: number;
}

const RainingHearts: React.FC = () => {
  // Use refs instead of state for better performance
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

  // Fallback to CSS hearts if WebGL is not supported
  const fallbackRef = useRef<boolean>(false);
  const cssHeartsRef = useRef<HTMLDivElement[]>([]);

  // Add mouse state tracking for interaction
  const isMouseDownRef = useRef<boolean>(false);
  const blackHoleStrengthRef = useRef<number>(0);
  const explosionStrengthRef = useRef<number>(0);
  const clickPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Check WebGL support
    let isWebGLSupported = true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        isWebGLSupported = false;
      }
    } catch (e) {
      isWebGLSupported = false;
      console.warn('WebGL not supported, falling back to CSS hearts');
    }
    fallbackRef.current = !isWebGLSupported;

    // If WebGL is not supported, create CSS hearts
    if (fallbackRef.current) {
      createCSSHearts();
      return;
    }

    if (!containerRef.current) return;

    // Initialize Three.js scene
    initializeThreeJS();

    // Handle mouse movement and resize
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      // Clean up resources
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      disposeThreeJS();
    };
  }, []);

  // Handle mouse down event for black hole effect
  const handleMouseDown = (event: MouseEvent) => {
    isMouseDownRef.current = true;
    blackHoleStrengthRef.current = 0; // Start at 0 and ramp up

    // Store click position in world space
    const vector = new THREE.Vector3(
      (event.clientX / dimensionsRef.current.width) * 2 - 1,
      -((event.clientY / dimensionsRef.current.height) * 2 - 1),
      0
    );
    vector.unproject(cameraRef.current!);
    const dir = vector.sub(cameraRef.current!.position).normalize();
    const distance = -cameraRef.current!.position.z / dir.z;
    clickPositionRef.current = cameraRef.current!.position.clone().add(dir.multiplyScalar(distance));
  };

  // Handle mouse up event for explosion effect
  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      // Only trigger explosion if we were in black hole mode
      explosionStrengthRef.current = blackHoleStrengthRef.current * 1.5; // Explosion is stronger than attraction
      blackHoleStrengthRef.current = 0;
      isMouseDownRef.current = false;
    }
  };

  // Initialize Three.js scene efficiently
  const initializeThreeJS = () => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera with good initial position
    const camera = new THREE.PerspectiveCamera(
      75,
      dimensionsRef.current.width / dimensionsRef.current.height,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Create renderer with good defaults for performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Balance quality and performance
    renderer.setSize(dimensionsRef.current.width, dimensionsRef.current.height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting for better visual appeal
    addLighting(scene);

    // Create heart particles
    createHeartParticles();

    // Start animation loop outside of React lifecycle
    animate();
  };

  // Add lighting to the scene
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

  // Create heart particles with instanced geometry for better performance
  const createHeartParticles = () => {
    if (!sceneRef.current) return;

    // Create heart shape geometry once
    const heartShape = createHeartShape();

    // Extrusion settings for 3D hearts
    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2, // Reduced for performance
      bevelSize: 0.2,
      bevelThickness: 0.2,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.scale(0.1, 0.1, 0.1);
    heartGeometry.rotateZ(Math.PI);

    // Create heart instances
    const heartCount = Math.min(30, Math.floor(dimensionsRef.current.width / 60)); // Adaptive count based on screen size
    heartParticlesRef.current = [];

    for (let i = 0; i < heartCount; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0, 0.8, 0.4), // Green hearts
        emissive: new THREE.Color(0, 0.2, 0.1),
        specular: new THREE.Color(0.5, 1, 0.5),
        shininess: 100,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5,
      });

      // Create mesh
      const mesh = new THREE.Mesh(heartGeometry.clone(), material);

      // Initial position spread throughout screen
      mesh.position.set(
        (Math.random() * 2 - 1) * 10,
        (Math.random() * 2 - 1) * 10,
        Math.random() * 5 - 2.5
      );

      // Random initial rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Random scaling factor
      const scale = 0.5 + Math.random() * 1.0;
      mesh.scale.set(scale, scale, scale);

      // Add to scene
      sceneRef.current.add(mesh);

      // Store the particle with physics properties
      heartParticlesRef.current.push({
        mesh,
        velocity: new THREE.Vector2(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.03 + 0.01
        ),
        acceleration: new THREE.Vector2(0, 0),
        mass: 0.1 + Math.random() * 0.9, // Variability in mass affects orbit behavior
      });
    }
  };

  // Create heart shape for geometry
  const createHeartShape = () => {
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;

    heartShape.moveTo(x, y);
    // Left curve
    heartShape.bezierCurveTo(x - 1, y - 1.5, x - 3, y + 1, x, y + 3);
    // Right curve
    heartShape.bezierCurveTo(x + 3, y + 1, x + 1, y - 1.5, x, y);

    return heartShape;
  };

  // Create CSS hearts fallback if WebGL is not supported
  const createCSSHearts = () => {
    if (!containerRef.current) return;

    // Create hearts using DOM elements
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

    // Animate CSS hearts
    animateCSSHearts();
  };

  // Animate CSS hearts as fallback
  const animateCSSHearts = () => {
    if (fallbackRef.current && cssHeartsRef.current.length > 0) {
      cssHeartsRef.current.forEach((heart, index) => {
        // Current position
        const top = parseFloat(heart.style.top);
        const left = parseFloat(heart.style.left);

        // Simple falling animation
        heart.style.top = `${top + 1 + Math.random()}px`;

        // Add slight horizontal movement
        heart.style.left = `${left + Math.sin(Date.now() * 0.001 + index) * 0.5}px`;

        // Reset when out of view
        if (top > window.innerHeight) {
          heart.style.top = `-50px`;
          heart.style.left = `${Math.random() * 100}vw`;
        }
      });

      requestAnimationFrame(animateCSSHearts);
    }
  };

  // Handle mouse movement more efficiently
  const handleMouseMove = (event: MouseEvent) => {
    // Correctly convert screen coordinates to normalized device coordinates
    // x: -1 (left) to 1 (right), y: -1 (bottom) to 1 (top)
    const x = (event.clientX / dimensionsRef.current.width) * 2 - 1;
    const y = -((event.clientY / dimensionsRef.current.height) * 2 - 1); // Flip Y axis
    mouseRef.current.set(x, y);
  };

  // Handle window resize efficiently
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

  // Main animation loop using requestAnimationFrame directly
  const animate = () => {
    frameIdRef.current = requestAnimationFrame(animate);

    // Skip if not initialized
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    // Update time reference (for smooth animations)
    const currentTime = performance.now() * 0.001;
    const deltaTime = Math.min(0.05, currentTime - timeRef.current); // Cap delta time to avoid large jumps
    timeRef.current = currentTime;

    // Update black hole effect strength (gradually increase when mouse is down)
    if (isMouseDownRef.current) {
      blackHoleStrengthRef.current = Math.min(1.0, blackHoleStrengthRef.current + deltaTime * 1.5);
    }

    // Update explosion effect strength (gradually decrease after mouse up)
    if (explosionStrengthRef.current > 0) {
      explosionStrengthRef.current = Math.max(0, explosionStrengthRef.current - deltaTime * 1.0);
    }

    // Physics-based update for heart particles
    updateHeartParticles(deltaTime);

    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  // Update heart particles with improved physics
  const updateHeartParticles = (deltaTime: number) => {
    if (!heartParticlesRef.current.length) return;

    // Correctly convert normalized device coordinates to world coordinates
    // This ensures the mouse position in the scene matches the actual cursor position
    const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0);
    vector.unproject(cameraRef.current!);
    const dir = vector.sub(cameraRef.current!.position).normalize();
    const distance = -cameraRef.current!.position.z / dir.z;
    const mouseWorldPos = cameraRef.current!.position.clone().add(dir.multiplyScalar(distance));

    // Update each heart particle
    heartParticlesRef.current.forEach((particle, index) => {
      const { mesh, velocity, mass } = particle;

      // Apply gravity (weak downward force unless in black hole mode)
      const gravityStrength = isMouseDownRef.current ? 0.01 : 0.05; // Weaker gravity during black hole effect
      particle.acceleration.set(0, -gravityStrength);

      // Calculate distance to mouse for normal attraction
      const dx = mouseWorldPos.x - mesh.position.x;
      const dy = mouseWorldPos.y - mesh.position.y;
      const distanceSquared = dx * dx + dy * dy;
      const distance = Math.sqrt(distanceSquared);

      // Black hole effect (stronger with increasing blackHoleStrength)
      if (isMouseDownRef.current && blackHoleStrengthRef.current > 0) {
        // Distance to click position (the black hole center)
        const bhDx = clickPositionRef.current.x - mesh.position.x;
        const bhDy = clickPositionRef.current.y - mesh.position.y;
        const bhDistanceSquared = bhDx * bhDx + bhDy * bhDy;
        const bhDistance = Math.sqrt(bhDistanceSquared);

        // Stronger attraction for black hole effect
        const blackHoleAttraction = 0.4 * blackHoleStrengthRef.current / mass;
        const bhForceMagnitude = blackHoleAttraction / Math.max(0.1, bhDistanceSquared / 3);

        // Limit maximum force
        const cappedBhForce = Math.min(bhForceMagnitude, 1.0);

        // Apply black hole attraction force
        particle.acceleration.x += bhDx * cappedBhForce;
        particle.acceleration.y += bhDy * cappedBhForce;

        // Add spiraling effect for visual interest
        const spiralStrength = 0.1 * blackHoleStrengthRef.current;
        particle.acceleration.x += -bhDy * spiralStrength / bhDistance;
        particle.acceleration.y += bhDx * spiralStrength / bhDistance;

        // Gradually shrink hearts as they approach the black hole
        const proximityFactor = Math.max(0.4, Math.min(1.0, bhDistance / 5));
        const baseScale = 0.5 + mass * 0.5;
        mesh.scale.set(
          baseScale * proximityFactor,
          baseScale * proximityFactor,
          baseScale * proximityFactor
        );
      }
      // Explosion effect
      else if (explosionStrengthRef.current > 0) {
        // Distance to explosion center (previous click position)
        const expDx = clickPositionRef.current.x - mesh.position.x;
        const expDy = clickPositionRef.current.y - mesh.position.y;
        const expDistanceSquared = expDx * expDx + expDy * expDy;
        const expDistance = Math.sqrt(expDistanceSquared);

        // Repulsion force (stronger when closer to center)
        const explosionRepulsion = 2.0 * explosionStrengthRef.current / Math.sqrt(mass);
        const expForceMagnitude = explosionRepulsion / Math.max(0.5, expDistance);

        // Apply explosion force (pushing away from click position)
        const cappedExpForce = Math.min(expForceMagnitude, 2.0);
        particle.acceleration.x -= expDx * cappedExpForce / expDistance;
        particle.acceleration.y -= expDy * cappedExpForce / expDistance;

        // Add slight spin to particles during explosion
        const spinStrength = 0.2 * explosionStrengthRef.current;
        particle.acceleration.x += -expDy * spinStrength / expDistance;
        particle.acceleration.y += expDx * spinStrength / expDistance;

        // Reset heart scale with slight randomization during explosion
        const scaleBoost = 1.0 + 0.5 * explosionStrengthRef.current * Math.random();
        const baseScale = 0.5 + mass * 0.5;
        mesh.scale.set(
          baseScale * scaleBoost,
          baseScale * scaleBoost,
          baseScale * scaleBoost
        );
      }
      // Normal attraction to mouse when not in special modes
      else if (distance > 0.5) {
        // Normal attraction strength
        const attractionStrength = 0.1 / mass;
        const forceMagnitude = attractionStrength / Math.max(0.1, distanceSquared);

        // Apply attraction force
        const cappedForce = Math.min(forceMagnitude, 0.3);
        particle.acceleration.x += dx * cappedForce;
        particle.acceleration.y += dy * cappedForce;

        // Apply orbital velocity for stable orbits
        if (distance < 5 && distance > 0.5) {
          const orbitalFactor = 0.02 / Math.sqrt(mass);
          particle.acceleration.x += -dy * orbitalFactor;
          particle.acceleration.y += dx * orbitalFactor;
        }

        // Normal pulse scale effect
        const pulseFactor = 0.05 * Math.sin(timeRef.current * 2 + index);
        const baseScale = 0.5 + mass * 0.5;
        mesh.scale.set(
          baseScale * (1 + pulseFactor),
          baseScale * (1 + pulseFactor),
          baseScale * (1 + pulseFactor)
        );
      }

      // Update velocity with acceleration
      velocity.x += particle.acceleration.x * deltaTime;
      velocity.y += particle.acceleration.y * deltaTime;

      // Apply air resistance (drag) - stronger during black hole
      const drag = isMouseDownRef.current ? 0.95 : 0.99;
      velocity.x *= drag;
      velocity.y *= drag;

      // Update position
      mesh.position.x += velocity.x;
      mesh.position.y += velocity.y;

      // Add rotation (more rotation during explosion)
      const rotationSpeed = explosionStrengthRef.current > 0 ? 0.01 : 0.002;
      mesh.rotation.x += rotationSpeed * deltaTime * 60;
      mesh.rotation.z += rotationSpeed * 2 * deltaTime * 60;

      // Handle boundaries
      if (mesh.position.y < -10) {
        // Reset when heart falls below screen
        mesh.position.set(
          (Math.random() * 2 - 1) * 10,
          10,
          Math.random() * 5 - 2.5
        );
        velocity.set(
          (Math.random() - 0.5) * 0.02,
          -0.01 - Math.random() * 0.02
        );
      }

      // Keep hearts within reasonable horizontal bounds
      if (mesh.position.x < -15) mesh.position.x = 15;
      if (mesh.position.x > 15) mesh.position.x = -15;
    });
  };

  // Clean up Three.js resources
  const disposeThreeJS = () => {
    if (!rendererRef.current || !containerRef.current) return;

    // Remove renderer
    containerRef.current.removeChild(rendererRef.current.domElement);
    rendererRef.current.dispose();

    // Dispose geometries and materials
    heartParticlesRef.current.forEach((particle) => {
      if (particle.mesh.geometry) particle.mesh.geometry.dispose();

      if (Array.isArray(particle.mesh.material)) {
        particle.mesh.material.forEach((material) => material.dispose());
      } else if (particle.mesh.material) {
        particle.mesh.material.dispose();
      }
    });

    // Clear references
    heartParticlesRef.current = [];
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;
  };

  return <div className="raining-hearts" ref={containerRef} />;
};

export default RainingHearts;
