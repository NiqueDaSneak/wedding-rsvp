import React, { useEffect, useRef } from 'react';
import './WebGPUHashtag.scss';

// Simplified shader code based on the example
const particleWGSL = `
struct VertexInput {
  @location(0) position : vec3f,
  @location(1) color : vec4f,
  @location(2) quad_pos : vec2f,
}

struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f,
  @location(1) quad_pos : vec2f,
}

struct Uniforms {
  modelViewProjectionMatrix : mat4x4f,
  right : vec3f,
  up : vec3f,
  time : f32,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

@vertex
fn vs_main(in : VertexInput) -> VertexOutput {
  var quad_pos = mat2x3f(uniforms.right, uniforms.up) * in.quad_pos;
  var position = in.position + quad_pos * 0.01;
  var out : VertexOutput;
  out.position = uniforms.modelViewProjectionMatrix * vec4f(position, 1.0);
  out.color = in.color;
  out.quad_pos = in.quad_pos;
  return out;
}

@fragment
fn fs_main(in : VertexOutput) -> @location(0) vec4f {
  var color = in.color;
  // Apply a circular particle alpha mask
  color.a = color.a * max(1.0 - length(in.quad_pos), 0.0);
  return color;
}

@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) global_id : vec3u) {
  // Simplified simulation
  let idx = global_id.x;
  // Particle simulation would go here
}
`;

const WebGPUHashtag: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallbackEl = fallbackRef.current;

    if (!canvas || !fallbackEl) return;

    // Check if WebGPU is available
    if (!navigator.gpu) {
      canvas.style.display = 'none';
      fallbackEl.style.display = 'block';
      return;
    }

    let cleanup: (() => void) | undefined;

    async function initWebGPU() {
      try {
        // Request adapter with compatibility mode
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: 'high-performance',
        });

        if (!adapter) {
          throw new Error('No appropriate GPUAdapter found');
        }

        // Request device
        const device = await adapter.requestDevice();

        // Configure canvas
        const context = canvas.getContext('webgpu') as GPUCanvasContext;
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;

        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
          device,
          format: presentationFormat,
          alphaMode: 'premultiplied',
        });

        // Create a texture with the hashtag
        const hashtagTexture = await createHashtagTexture(
          device,
          '#itsclemmertime',
        );

        // Create pipeline, buffers, etc.
        const renderPipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: device.createShaderModule({
              code: particleWGSL,
            }),
            entryPoint: 'vs_main',
            buffers: [
              // Position, color buffer
              {
                arrayStride: 28, // vec3f + vec4f
                stepMode: 'instance',
                attributes: [
                  {
                    // position
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3',
                  },
                  {
                    // color
                    shaderLocation: 1,
                    offset: 12,
                    format: 'float32x4',
                  },
                ],
              },
              // Quad vertices
              {
                arrayStride: 8, // vec2f
                stepMode: 'vertex',
                attributes: [
                  {
                    shaderLocation: 2,
                    offset: 0,
                    format: 'float32x2',
                  },
                ],
              },
            ],
          },
          fragment: {
            module: device.createShaderModule({
              code: particleWGSL,
            }),
            entryPoint: 'fs_main',
            targets: [
              {
                format: presentationFormat,
                blend: {
                  color: {
                    srcFactor: 'src-alpha',
                    dstFactor: 'one',
                    operation: 'add',
                  },
                  alpha: {
                    srcFactor: 'zero',
                    dstFactor: 'one',
                    operation: 'add',
                  },
                },
              },
            ],
          },
          primitive: {
            topology: 'triangle-list',
          },
        });

        // Create quad vertex buffer (for billboard particles)
        const quadVertexBuffer = device.createBuffer({
          size: 6 * 2 * 4, // 6 vertices * 2 floats * 4 bytes
          usage: GPUBufferUsage.VERTEX,
          mappedAtCreation: true,
        });
        // Quad vertices (2 triangles)
        new Float32Array(quadVertexBuffer.getMappedRange()).set([
          -1.0, -1.0, +1.0, -1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0,
          +1.0,
        ]);
        quadVertexBuffer.unmap();

        // Create uniform buffer
        const uniformBufferSize =
          4 * 4 * 4 + // mat4x4f modelViewProjectionMatrix
          3 * 4 + // vec3f right
          4 + // padding
          3 * 4 + // vec3f up
          4 + // padding
          4; // float time

        const uniformBuffer = device.createBuffer({
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const uniformBindGroup = device.createBindGroup({
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: {
                buffer: uniformBuffer,
              },
            },
          ],
        });

        // Create particles
        const numParticles = 10000;
        const particleData = new Float32Array(numParticles * 7); // 3 position + 4 color

        // Initialize particles based on hashtag
        for (let i = 0; i < numParticles; i++) {
          const baseIndex = i * 7;
          // Random positions across the canvas
          particleData[baseIndex] = (Math.random() - 0.5) * 2; // x
          particleData[baseIndex + 1] = (Math.random() - 0.5) * 2; // y
          particleData[baseIndex + 2] = (Math.random() - 0.5) * 2; // z

          // Color (green shades for wedding theme)
          particleData[baseIndex + 3] = 0.325 + Math.random() * 0.3; // r
          particleData[baseIndex + 4] = 0.459 + Math.random() * 0.3; // g
          particleData[baseIndex + 5] = 0.078 + Math.random() * 0.3; // b
          particleData[baseIndex + 6] = 0.7 + Math.random() * 0.3; // a
        }

        // Create particle buffer
        const particleBuffer = device.createBuffer({
          size: particleData.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          mappedAtCreation: true,
        });
        new Float32Array(particleBuffer.getMappedRange()).set(particleData);
        particleBuffer.unmap();

        // Animation loop
        let animationId: number;
        let lastTime = 0;

        function frame(time: number) {
          const deltaTime = time - lastTime;
          lastTime = time;

          // Update uniform data
          const aspect = canvas.width / canvas.height;

          // Simple projection & view matrices
          const projectionMatrix = perspectiveMatrix(
            (60 * Math.PI) / 180,
            aspect,
            0.1,
            100,
          );
          const viewMatrix = lookAt(
            [0, 0, 1.5], // camera position
            [0, 0, 0], // look target
            [0, 1, 0], // up vector
          );
          const mvpMatrix = multiplyMatrices(projectionMatrix, viewMatrix);

          // Update uniform buffer with new MVP matrix
          const uniformData = new Float32Array(uniformBufferSize / 4);

          // Set modelViewProjectionMatrix
          for (let i = 0; i < 16; i++) {
            uniformData[i] = mvpMatrix[i];
          }

          // Set right and up vectors for billboarding
          uniformData[16] = viewMatrix[0];
          uniformData[17] = viewMatrix[4];
          uniformData[18] = viewMatrix[8];
          // padding at 19

          uniformData[20] = viewMatrix[1];
          uniformData[21] = viewMatrix[5];
          uniformData[22] = viewMatrix[9];
          // padding at 23

          // Set time
          uniformData[24] = time * 0.001;

          device.queue.writeBuffer(uniformBuffer, 0, uniformData);

          // Begin render pass
          const commandEncoder = device.createCommandEncoder();
          const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
              {
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
          });

          renderPass.setPipeline(renderPipeline);
          renderPass.setBindGroup(0, uniformBindGroup);
          renderPass.setVertexBuffer(0, particleBuffer);
          renderPass.setVertexBuffer(1, quadVertexBuffer);
          renderPass.draw(6, numParticles, 0, 0); // 6 vertices per quad, numParticles instances
          renderPass.end();

          device.queue.submit([commandEncoder.finish()]);

          animationId = requestAnimationFrame(frame);
        }

        animationId = requestAnimationFrame(frame);

        // Clean up
        cleanup = () => {
          cancelAnimationFrame(animationId);
          device.destroy();
        };
      } catch (err) {
        console.error('WebGPU not supported or initialization failed:', err);
        canvas.style.display = 'none';
        fallbackEl.style.display = 'block';
      }
    }

    initWebGPU();

    return () => cleanup?.();
  }, []);

  return (
    <div className="webgpu-hashtag-container">
      <canvas ref={canvasRef} className="webgpu-canvas"></canvas>
      <div
        ref={fallbackRef}
        className="webgpu-fallback"
        style={{ display: 'none' }}
      >
        #itsclemmertime
      </div>
    </div>
  );
};

// Helper function to create a texture from hashtag text
async function createHashtagTexture(
  device: GPUDevice,
  text: string,
): Promise<GPUTexture> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const width = 512;
  const height = 128;

  canvas.width = width;
  canvas.height = height;

  // Draw hashtag text
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 50px Montserrat';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Create texture
  const texture = device.createTexture({
    size: [width, height],
    format: 'rgba8unorm',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  });

  // Copy canvas data to texture
  const imageData = ctx.getImageData(0, 0, width, height);
  device.queue.writeTexture(
    { texture },
    imageData.data,
    { bytesPerRow: width * 4 },
    { width, height },
  );

  return texture;
}

// Matrix helper functions
function perspectiveMatrix(
  fovRadians: number,
  aspect: number,
  near: number,
  far: number,
): number[] {
  const f = 1.0 / Math.tan(fovRadians / 2);
  const rangeInv = 1.0 / (near - far);

  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (near + far) * rangeInv,
    -1,
    0,
    0,
    near * far * rangeInv * 2,
    0,
  ];
}

function lookAt(eye: number[], center: number[], up: number[]): number[] {
  const z0 = eye[0] - center[0];
  const z1 = eye[1] - center[1];
  const z2 = eye[2] - center[2];

  let len = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  if (len === 0) len = 1;

  const z = [z0 / len, z1 / len, z2 / len];

  const x = [
    up[1] * z[2] - up[2] * z[1],
    up[2] * z[0] - up[0] * z[2],
    up[0] * z[1] - up[1] * z[0],
  ];

  len = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
  if (len === 0) {
    x[0] = 0;
    x[1] = 0;
    x[2] = 0;
  } else {
    x[0] /= len;
    x[1] /= len;
    x[2] /= len;
  }

  const y = [
    z[1] * x[2] - z[2] * x[1],
    z[2] * x[0] - z[0] * x[2],
    z[0] * x[1] - z[1] * x[0],
  ];

  return [
    x[0],
    y[0],
    z[0],
    0,
    x[1],
    y[1],
    z[1],
    0,
    x[2],
    y[2],
    z[2],
    0,
    -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
    -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
    -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]),
    1,
  ];
}

function multiplyMatrices(a: number[], b: number[]): number[] {
  const result = new Array(16);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[i * 4 + k] * b[k * 4 + j];
      }
      result[i * 4 + j] = sum;
    }
  }

  return result;
}

export default WebGPUHashtag;
