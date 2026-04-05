import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Config {
  color: string;
  shape: string;
  autoRotate: boolean;
  rotationSpeed: number;
  wireframe: boolean;
  metalness: number;
  roughness: number;
  scale: number;
  texture: string;
}

export default function Scene({ config }: { config: Config }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Add Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 15);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 5);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // 3. Setup Mesh Management
    let mesh: THREE.Mesh;
    const createMesh = () => {
      if (mesh) scene.remove(mesh);

      let geometry;
      switch (config.shape) {
        case 'Sphere':
          geometry = new THREE.SphereGeometry(1.5, 64, 64);
          break;
        case 'Torus':
          geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
          break;
        case 'Octahedron':
          geometry = new THREE.OctahedronGeometry(1.8);
          break;
        case 'Knot':
          geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
          break;
        case 'Dodecahedron':
          geometry = new THREE.DodecahedronGeometry(1.5);
          break;
        case 'Icosahedron':
          geometry = new THREE.IcosahedronGeometry(1.5);
          break;
        case 'Cone':
          geometry = new THREE.ConeGeometry(1, 2, 32);
          break;
        default:
          geometry = new THREE.BoxGeometry(2, 2, 2);
      }

      const lightenColor = (color: string, amount: number) => {
        let colorValue = parseInt(color.slice(1), 16);
        let r = (colorValue >> 16) & 255;
        let g = (colorValue >> 8) & 255;
        let b = colorValue & 255;

        r = Math.min(255, r + r * amount);
        g = Math.min(255, g + g * amount);
        b = Math.min(255, b + b * amount);
        
        const rr = Math.round(r).toString(16).padStart(2, '0');
        const gg = Math.round(g).toString(16).padStart(2, '0');
        const bb = Math.round(b).toString(16).padStart(2, '0');

        return `#${rr}${gg}${bb}`;
      };

      const textureLoader = new THREE.TextureLoader();

      const loadOrCreateTexture = (type: string) => {
        switch (type) {
          case 'brick':
            return textureLoader.load('/brick.jpg');
          case 'wood':
            return textureLoader.load('/wood.jpg');
          case 'stone':
            return textureLoader.load('/stone.jpg');
          case 'stone & patterns':
            const canvas = document.createElement('canvas');
            canvas.width = 1024; // Use higher resolution for better quality
            canvas.height = 1024;
            const context = canvas.getContext('2d');
            const texture = new THREE.CanvasTexture(canvas);

            textureLoader.load('/stone.jpg', (stoneTexture) => {
              if (context) {
                // Draw stone texture as base
                context.drawImage(stoneTexture.image, 0, 0, 1024, 1024);

                // Add lines and dots on top
                const textureColorHex = lightenColor(config.color, 1.2); // Even Brighter color
                const textureColorR = parseInt(textureColorHex.slice(1, 3), 16);
                const textureColorG = parseInt(textureColorHex.slice(3, 5), 16);
                const textureColorB = parseInt(textureColorHex.slice(5, 7), 16);
                
                context.strokeStyle = `rgb(${textureColorR}, ${textureColorG}, ${textureColorB})`; // No opacity
                context.fillStyle = `rgb(${textureColorR}, ${textureColorG}, ${textureColorB})`; // No opacity

                // Lines
                for (let i = 0; i < 150; i++) {
                  context.beginPath();
                  context.moveTo(Math.random() * 1024, Math.random() * 1024);
                  context.lineTo(Math.random() * 1024, Math.random() * 1024);
                  context.lineWidth = Math.random() * 2 + 1; // Much smaller lines
                  context.stroke();
                }
                // Dots
                for (let i = 0; i < 2000; i++) {
                  context.beginPath();
                  context.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 1 + 0.5, 0, Math.PI * 2); // Much smaller dots
                  context.fill();
                }
                texture.needsUpdate = true;
              }
            });
            return texture;
          default:
            return null;
        }
      };

      const texture = loadOrCreateTexture(config.texture);
      const isImageTexture = ['brick', 'wood', 'stone', 'stone & patterns'].includes(config.texture);

      const material = new THREE.MeshStandardMaterial({
        color: isImageTexture ? '#ffffff' : config.color,
        metalness: config.metalness,
        roughness: config.roughness,
        wireframe: config.wireframe,
        map: texture,
        transparent: !isImageTexture, // Revert this
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(config.scale, config.scale, config.scale);
      scene.add(mesh);
    };

    createMesh();
    camera.position.z = 5;

    // 4. Interaction State
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const onMouseDown = (e: any) => {
      isDragging = true;
    };

    const onMouseMove = (e: any) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDragging && mesh) {
        const deltaMove = {
          x: x - previousMousePosition.x,
          y: y - previousMousePosition.y
        };

        const rotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
            deltaMove.y * 0.01,
            deltaMove.x * 0.01,
            0,
            'XYZ'
          ));

        mesh.quaternion.multiplyQuaternions(rotationQuaternion, mesh.quaternion);
      }

      previousMousePosition = { x, y };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
        camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.01, 2), 10);
    };

    // Event Listeners
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onMouseDown);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('wheel', onWheel);

    // 5. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (config.autoRotate && mesh && !isDragging) {
        mesh.rotation.y += 0.01 * config.rotationSpeed;
        mesh.rotation.x += 0.005 * config.rotationSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('wheel', onWheel);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [config]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
