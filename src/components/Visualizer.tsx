import React, { useRef, useEffect } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ParticleSystem,
  Texture,
  Color4,
} from 'babylonjs';
import AudioManager from '../audio/AudioManager';

interface VisualizerProps {
  mode: 'waveform' | 'spectrum' | 'radial' | 'particle' | 'tunnel';
}

const Visualizer = ({ mode }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Set up camera and light
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvasRef.current, true);
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Get audio analyser data
    const analyser = AudioManager.getInstance().getAnalyser();
    const sampleCount = analyser.fftSize;
    const timeDomainData = new Uint8Array(sampleCount);
    const frequencyData = new Uint8Array(sampleCount);

    let customMeshes: any = {};

    // Create the common waveform line points
    const points: Vector3[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const x = (i / (sampleCount - 1)) * 10 - 5;
      points.push(new Vector3(x, 0, 0));
    }
    // Create an updatable lines mesh
    let oscilloscopeLine = MeshBuilder.CreateLines('oscilloscope', { points, updatable: true }, scene);

    // Create mode-specific meshes
    if (mode === 'spectrum') {
      const barCount = 32;
      const spectrumBars = [];
      for (let i = 0; i < barCount; i++) {
        const bar = MeshBuilder.CreateBox('bar' + i, { width: 0.3, height: 0.1, depth: 0.3 }, scene);
        bar.position.x = (i - barCount / 2) * 0.4;
        spectrumBars.push(bar);
      }
      customMeshes = { spectrumBars, barCount };
    } else if (mode === 'radial') {
      const barCount = 32;
      const radialBars = [];
      const radius = 5;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * 2 * Math.PI;
        const bar = MeshBuilder.CreateBox('radialBar' + i, { width: 0.3, height: 0.1, depth: 0.3 }, scene);
        bar.position.x = radius * Math.cos(angle);
        bar.position.z = radius * Math.sin(angle);
        bar.rotation.y = -angle;
        radialBars.push(bar);
      }
      customMeshes = { radialBars, barCount };
    } else if (mode === 'particle') {
      // Use imported ParticleSystem, Texture, and Color4 instead of window.BABYLON
      const particleSystem = new ParticleSystem('particles', 2000, scene);
      particleSystem.particleTexture = new Texture('https://www.babylonjs-playground.com/textures/flare.png', scene);
      particleSystem.emitter = new Vector3(0, 0, 0);
      particleSystem.minEmitBox = new Vector3(-1, 0, 0);
      particleSystem.maxEmitBox = new Vector3(1, 0, 0);
      particleSystem.color1 = new Color4(1, 0, 0, 1);
      particleSystem.color2 = new Color4(0, 1, 0, 1);
      particleSystem.start();
      customMeshes = { particleSystem };
    } else if (mode === 'tunnel') {
      const path = [];
      for (let i = 0; i < 20; i++) {
        path.push(new Vector3(0, 0, i));
      }
      const tube = MeshBuilder.CreateTube('tunnel', { path, radius: 5, tessellation: 32 }, scene);
      // Adjust camera target for tunnel view
      camera.setTarget(new Vector3(0, 0, 10));
      customMeshes = { tube };
    }

    // Render loop
    engine.runRenderLoop(() => {
      switch (mode) {
        case 'waveform':
          analyser.getByteTimeDomainData(timeDomainData);
          for (let i = 0; i < sampleCount; i++) {
            points[i].y = (timeDomainData[i] - 128) / 50;
          }
          // Update the existing line mesh with new points
          oscilloscopeLine = MeshBuilder.CreateLines('oscilloscope', { points, instance: oscilloscopeLine, updatable: true });
          break;
        case 'spectrum': {
          analyser.getByteFrequencyData(frequencyData);
          const { spectrumBars, barCount } = customMeshes;
          
          const step = Math.floor(sampleCount / barCount);
          for (let i = 0; i < barCount; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
              sum += frequencyData[i * step + j];
            }
            const avg = sum / step;
            const scaleY = avg / 50;
            spectrumBars[i].scaling.y = scaleY;
            spectrumBars[i].position.y = scaleY / 2;
          }
          break;
        }
        case 'radial': {
          analyser.getByteFrequencyData(frequencyData);
          const { radialBars, barCount } = customMeshes;
          const step = Math.floor(sampleCount / barCount);
          for (let i = 0; i < barCount; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
              sum += frequencyData[i * step + j];
            }
            const avg = sum / step;
            const scaleY = avg / 50;
            radialBars[i].scaling.y = scaleY;
            radialBars[i].position.y = scaleY / 2;
          }
          break;
        }
        case 'particle': {
          analyser.getByteTimeDomainData(timeDomainData);
          let sum = 0;
          for (let i = 0; i < sampleCount; i++) {
            sum += timeDomainData[i];
          }
          const avg = sum / sampleCount;
          customMeshes.particleSystem.emitRate = avg * 10;
          break;
        }
        case 'tunnel': {
          analyser.getByteFrequencyData(frequencyData);
          let total = 0;
          for (let i = 0; i < sampleCount; i++) {
            total += frequencyData[i];
          }
          const avgFreq = total / sampleCount;
          customMeshes.tube.scaling.x = 1 + avgFreq / 255;
          customMeshes.tube.scaling.y = 1 + avgFreq / 255;
          break;
        }
      }
      scene.render();
    });

    // Resize listener and cleanup
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      engine.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Visualizer;
