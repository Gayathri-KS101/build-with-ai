import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const containerRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create spheres
    const spheres = [];
    const sphereCount = 15;
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    for (let i = 0; i < sphereCount; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${(i * 360) / sphereCount}, 70%, 70%)`),
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
        Math.random() * 40 - 20
      );
      sphere.userData = {
        velocity: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
      };
      spheres.push(sphere);
      scene.add(sphere);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    camera.position.z = 30;

    // Mouse move handler
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      spheres.forEach((sphere) => {
        // Update position based on velocity
        sphere.position.add(sphere.userData.velocity);

        // Bounce off boundaries
        ['x', 'y', 'z'].forEach((axis) => {
          if (Math.abs(sphere.position[axis]) > 20) {
            sphere.userData.velocity[axis] *= -1;
          }
        });

        // React to mouse
        const mouseInfluence = 0.001;
        sphere.position.x += mousePosition.current.x * mouseInfluence;
        sphere.position.y += mousePosition.current.y * mouseInfluence;

        // Rotate sphere
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      spheres.forEach((sphere) => {
        sphere.geometry.dispose();
        sphere.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(45deg, #4158D0, #C850C0, #FFCC70)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      }}
    />
  );
};

export default AnimatedBackground;
