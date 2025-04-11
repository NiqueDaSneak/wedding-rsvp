import React, { useRef, useEffect, useState } from 'react';
import './ParticleHashtag.scss';

const ParticleHashtag: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // Gatsby-specific check to ensure we're running in browser environment
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    // Only run WebGL code in browser environment
    if (!isBrowser) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(setupWebGL);

    if (container) {
      resizeObserver.observe(container);
    }

    // Try to get WebGL context
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
    });

    // Fallback to experimental-webgl if needed
    if (!gl) {
      console.warn('WebGL not supported, falling back to experimental-webgl');
      const altGL = canvas.getContext('experimental-webgl');
      if (!altGL) {
        console.error('WebGL not supported by this browser');
        return;
      }
    }

    const textParticleCount = 8000; // Increased from 6000 for better density
    const backgroundParticleCount = 600; // Reduced background noise
    const particleCount = textParticleCount + backgroundParticleCount;

    let time = 0;
    let animationId: number;
    let textPoints: Array<{ x: number; y: number; isEdge: boolean }> = [];

    // Vertex shader for particles
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_targetPosition;
      attribute float a_size;
      attribute vec4 a_color;
      attribute float a_speed;
      attribute float a_isText;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_transition;
      
      varying vec4 v_color;
      varying float v_isText;
      
      const float PI = 3.14159265359;
      
      void main() {
        // Calculate the position based on transition between random and target
        vec2 currentPos = a_position;
        
        // If we have a valid target position, interpolate toward it
        if (a_targetPosition.x > 0.0 || a_targetPosition.y > 0.0) {
          // Use a smoother transition curve for more precise positioning
          float t = clamp(u_transition * a_speed, 0.0, 1.0);
          t = smoothstep(0.0, 1.0, t); // Apply easing for smoother motion
          currentPos = mix(a_position, a_targetPosition, t);
          
          // After transition is complete, stick exactly to target position
          if (t >= 0.99) {
            currentPos = a_targetPosition;
          }
        }
        
        // Convert to clip space (-1 to 1)
        vec2 clipSpace = (currentPos / u_resolution) * 2.0 - 1.0;
        clipSpace.y = -clipSpace.y; // Flip y for WebGL coordinate system
        
        // Minimal pulse for text particles, stronger for edge particles
        float isEdge = step(1.5, a_isText);
        float isFill = step(0.5, a_isText) * (1.0 - isEdge);
        
        // Reduced pulse effect for better definition
        float pulseIntensity = isEdge * 0.15 + isFill * 0.08 + (1.0 - step(0.5, a_isText)) * 0.2;
        float pulseSpeed = a_isText * 1.5 + 1.0;
        float pulse = 1.0 + pulseIntensity * sin(u_time * pulseSpeed + currentPos.x * 0.01);
        
        gl_Position = vec4(clipSpace, 0.0, 1.0);
        gl_PointSize = a_size * pulse * (u_resolution.x / 800.0); // Scale with resolution
        
        v_color = a_color;
        v_isText = a_isText;
      }
    `;

    // Fragment shader for particle appearance
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec4 v_color;
      varying float v_isText;
      
      void main() {
        // Create circular particles
        float distance = length(gl_PointCoord - vec2(0.5));
        
        // Different edge treatment based on particle type
        float isEdge = step(1.5, v_isText);
        float isFill = step(0.5, v_isText) * (1.0 - isEdge);
        
        // Sharper edges for text particles, softer for background
        float edgeSoftness = isFill * 0.07 + isEdge * 0.04 + (1.0 - step(0.5, v_isText)) * 0.15;
        
        if (distance > 0.5) {
          discard; // Outside of circle
        }
        
        // Enhanced soft edge for text particles
        float alpha = v_color.a * smoothstep(0.5, 0.5 - edgeSoftness, distance);
        
        // Add slight glow to text particles
        if (v_isText > 0.5) {
          alpha *= 1.2; // Boost text particles
          
          // Extra boost for edge particles
          if (v_isText > 1.5) {
            alpha *= 1.1; // Further boost edge particles
          }
        }
        
        gl_FragColor = vec4(v_color.rgb, alpha);
      }
    `;

    // Compile shaders and create program
    function createShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string,
    ) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader,
    ) {
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    // Function to sample points from text
    function sampleTextPoints(
      width: number,
      height: number,
    ): Array<{ x: number; y: number; isEdge: boolean }> {
      // Create a high-resolution offscreen canvas for text sampling
      const scale = 3; // Increased from 2 for higher definition
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width * scale;
      offscreenCanvas.height = height * scale;
      const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true })!;

      // Clear with transparent background
      offscreenCtx.clearRect(0, 0, width * scale, height * scale);

      // Set text properties for main fill with better contrast
      const fontSize = Math.min(width / 7, 70) * scale; // Larger font size for better readability
      offscreenCtx.fillStyle = 'white';
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.font = `bold ${fontSize}px 'Montserrat', sans-serif`;

      // Draw hashtag text
      offscreenCtx.fillText(
        '#itsclemmertime',
        (width * scale) / 2,
        (height * scale) / 2,
      );

      // Get image data from the high-resolution canvas
      const imageData = offscreenCtx.getImageData(
        0,
        0,
        width * scale,
        height * scale,
      );

      // Create a second canvas to detect edges
      const edgeCanvas = document.createElement('canvas');
      edgeCanvas.width = width * scale;
      edgeCanvas.height = height * scale;
      const edgeCtx = edgeCanvas.getContext('2d', { alpha: true })!;

      // Draw the text with a thicker stroke for better edge detection
      edgeCtx.clearRect(0, 0, width * scale, height * scale);
      edgeCtx.strokeStyle = 'white';
      edgeCtx.lineWidth = Math.max(3, fontSize / 25) * scale; // Thicker stroke
      edgeCtx.textAlign = 'center';
      edgeCtx.textBaseline = 'middle';

      // Draw hashtag with stroke for edges
      edgeCtx.font = `bold ${fontSize}px 'Montserrat', sans-serif`;
      edgeCtx.strokeText(
        '#itsclemmertime',
        (width * scale) / 2,
        (height * scale) / 2,
      );

      const edgeImageData = edgeCtx.getImageData(
        0,
        0,
        width * scale,
        height * scale,
      );

      // Sample points with precise control
      const points: Array<{ x: number; y: number; isEdge: boolean }> = [];

      // Use a smaller step size for denser sampling
      const sampleStep = 1.5; // More dense sampling
      const threshold = 10; // Alpha threshold for detecting text pixels

      for (let y = 0; y < height * scale; y += sampleStep) {
        for (let x = 0; x < width * scale; x += sampleStep) {
          const i = (y * width * scale + x) * 4;
          const alpha = imageData.data[i + 3]; // Alpha channel

          if (alpha > threshold) {
            // Check if this is an edge pixel
            const isEdge =
              edgeImageData.data[i + 3] > threshold &&
              imageData.data[i + 3] < 200; // Edge pixels are in the stroke but not deep in fill

            points.push({
              x: x / scale, // Scale back to original canvas size
              y: y / scale,
              isEdge,
            });
          }
        }
      }

      // Add noise reduction by removing isolated pixels
      const filteredPoints = points.filter((point, index) => {
        // Skip edge points as they're important for definition
        if (point.isEdge) return true;

        // Count nearby points
        let nearbyPoints = 0;
        const proximityThreshold = 4; // How close points need to be to be considered "nearby"

        for (let i = 0; i < points.length; i++) {
          if (i === index) continue;

          const dx = points[i].x - point.x;
          const dy = points[i].y - point.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < proximityThreshold * proximityThreshold) {
            nearbyPoints++;
            if (nearbyPoints >= 2) return true; // Keep points with at least 2 neighbors
          }
        }

        return false; // Remove isolated points
      });

      return filteredPoints;
    }

    function setupWebGL() {
      if (!gl || !canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = 150; // Height for hashtag
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Sample text points
      textPoints = sampleTextPoints(canvas.width, canvas.height);

      // Enhanced color palette with better contrast
      const textFillColors = [
        [0.325, 0.459, 0.078, 1.0], // #537614 - dark green (fully opaque)
        [0.635, 0.773, 0.388, 1.0], // #A2C563 - medium green (fully opaque)
      ];

      const textEdgeColors = [
        [0.125, 0.21, 0.049, 1.0], // Darker green (fully opaque)
        [0.204, 0.31, 0.149, 1.0], // #344f26 - very dark green (fully opaque)
      ];

      const backgroundColors = [
        [0.82, 0.929, 0.62, 0.2], // #D1ED9E - light green (transparent)
        [0.635, 0.773, 0.388, 0.1], // #A2C563 - medium green (very transparent)
      ];

      // Compile shaders
      const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource,
      )!;
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      )!;
      const program = createProgram(gl, vertexShader, fragmentShader)!;

      // Define uniforms
      const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
      const resolutionUniformLocation = gl.getUniformLocation(
        program,
        'u_resolution',
      );
      const transitionUniformLocation = gl.getUniformLocation(
        program,
        'u_transition',
      );

      // Define attributes
      const positionAttributeLocation = gl.getAttribLocation(
        program,
        'a_position',
      );
      const targetPositionAttributeLocation = gl.getAttribLocation(
        program,
        'a_targetPosition',
      );
      const sizeAttributeLocation = gl.getAttribLocation(program, 'a_size');
      const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
      const speedAttributeLocation = gl.getAttribLocation(program, 'a_speed');
      const isTextAttributeLocation = gl.getAttribLocation(program, 'a_isText');

      // Create buffer data for particles
      const positions = new Float32Array(particleCount * 2); // x, y
      const targetPositions = new Float32Array(particleCount * 2); // target x, y
      const sizes = new Float32Array(particleCount);
      const particleColors = new Float32Array(particleCount * 4); // r, g, b, a
      const speeds = new Float32Array(particleCount);
      const isText = new Float32Array(particleCount); // Flag for text particles

      // First, create text particles with higher priority
      const textParticlesToAssign = Math.min(
        textParticleCount,
        textPoints.length,
      );

      for (let i = 0; i < textParticlesToAssign; i++) {
        // Random initial position across the canvas
        positions[i * 2] = Math.random() * canvas.width;
        positions[i * 2 + 1] = Math.random() * canvas.height;

        // Assign text point as target
        const textPoint = textPoints[i % textPoints.length];
        targetPositions[i * 2] = textPoint.x;
        targetPositions[i * 2 + 1] = textPoint.y;

        // Size based on whether it's an edge particle
        const isEdgePoint = textPoint.isEdge;

        if (isEdgePoint) {
          // Edge particles - smaller but fully opaque for crisp edges
          sizes[i] = 2.0 + Math.random() * 0.8;

          // Edge particles move faster to position
          speeds[i] = 1.0 + Math.random() * 0.3;

          // Use edge colors
          const colorIndex = Math.floor(Math.random() * textEdgeColors.length);
          particleColors[i * 4] = textEdgeColors[colorIndex][0];
          particleColors[i * 4 + 1] = textEdgeColors[colorIndex][1];
          particleColors[i * 4 + 2] = textEdgeColors[colorIndex][2];
          particleColors[i * 4 + 3] = textEdgeColors[colorIndex][3];

          // Mark as edge particle
          isText[i] = 2.0;
        } else {
          // Fill particles - larger for better coverage
          sizes[i] = 2.5 + Math.random() * 1.0;

          // Regular transition speed
          speeds[i] = 0.85 + Math.random() * 0.25;

          // Use fill colors
          const colorIndex = Math.floor(Math.random() * textFillColors.length);
          particleColors[i * 4] = textFillColors[colorIndex][0];
          particleColors[i * 4 + 1] = textFillColors[colorIndex][1];
          particleColors[i * 4 + 2] = textFillColors[colorIndex][2];
          particleColors[i * 4 + 3] = textFillColors[colorIndex][3];

          // Mark as fill particle
          isText[i] = 1.0;
        }
      }

      // Then add background particles
      for (let i = textParticlesToAssign; i < particleCount; i++) {
        // Random position
        positions[i * 2] = Math.random() * canvas.width;
        positions[i * 2 + 1] = Math.random() * canvas.height;

        // No target position
        targetPositions[i * 2] = 0;
        targetPositions[i * 2 + 1] = 0;

        // Smaller size for background particles
        sizes[i] = 0.5 + Math.random() * 1.5;

        // Slower speed
        speeds[i] = 0.5 + Math.random() * 0.3;

        // Not a text particle
        isText[i] = 0.0;

        // Background colors are more transparent
        const colorIndex = Math.floor(Math.random() * backgroundColors.length);
        particleColors[i * 4] = backgroundColors[colorIndex][0];
        particleColors[i * 4 + 1] = backgroundColors[colorIndex][1];
        particleColors[i * 4 + 2] = backgroundColors[colorIndex][2];
        particleColors[i * 4 + 3] =
          backgroundColors[colorIndex][3] * (0.4 + Math.random() * 0.3);
      }

      // Create and bind buffers
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const targetPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, targetPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, targetPositions, gl.STATIC_DRAW);

      const sizeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particleColors, gl.STATIC_DRAW);

      const speedBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, speeds, gl.STATIC_DRAW);

      const isTextBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, isTextBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, isText, gl.STATIC_DRAW);

      // Animation function
      function render() {
        if (!gl) return;

        time += 0.01;

        // Calculate transition value (0 to 1 over time)
        // Faster transition - form text in 2 seconds instead of 3
        const transitionValue = Math.max(0, Math.min(1, (time - 1) / 2));

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Use our shader program
        gl.useProgram(program);

        // Update uniforms
        gl.uniform1f(timeUniformLocation, time);
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform1f(transitionUniformLocation, transitionValue);

        // Set up position attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
          positionAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0,
        );

        // Set up target position attribute
        gl.enableVertexAttribArray(targetPositionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, targetPositionBuffer);
        gl.vertexAttribPointer(
          targetPositionAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0,
        );

        // Set up size attribute
        gl.enableVertexAttribArray(sizeAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.vertexAttribPointer(sizeAttributeLocation, 1, gl.FLOAT, false, 0, 0);

        // Set up color attribute
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
          colorAttributeLocation,
          4,
          gl.FLOAT,
          false,
          0,
          0,
        );

        // Set up speed attribute
        gl.enableVertexAttribArray(speedAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
        gl.vertexAttribPointer(
          speedAttributeLocation,
          1,
          gl.FLOAT,
          false,
          0,
          0,
        );

        // Set up isText attribute
        gl.enableVertexAttribArray(isTextAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, isTextBuffer);
        gl.vertexAttribPointer(
          isTextAttributeLocation,
          1,
          gl.FLOAT,
          false,
          0,
          0,
        );

        // Enable blending for transparent particles
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Draw the points
        gl.drawArrays(gl.POINTS, 0, particleCount);

        animationId = requestAnimationFrame(render);
      }

      // Start rendering
      render();
    }

    // Initial setup
    setupWebGL();

    // Clean up
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [isBrowser]);

  return (
    <div className="particle-hashtag" ref={containerRef}>
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
    </div>
  );
};

export default ParticleHashtag;
