import './style.css';
import { Scene3D } from './scene.js';
import { initAnimations } from './animations.js';

/**
 * Main Application Entry Point
 *
 * 1. Shows loading screen with animated progress
 * 2. Initializes Three.js 3D scene (including laptop model loading)
 * 3. Sets up GSAP scroll-driven animations
 * 4. Hides loader and reveals the experience
 */
async function init() {
    const canvas = document.getElementById('webgl-canvas');
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const scrollContainer = document.getElementById('scroll-container');

    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10 + 3;
        if (progress > 90) progress = 90;
        if (loaderBar) loaderBar.style.width = `${progress}%`;
    }, 200);

    // Initialize 3D scene (starts loading laptop model in background)
    const scene3d = new Scene3D(canvas);

    // Wait for the laptop model to load (or timeout after 5s)
    await new Promise((resolve) => {
        let elapsed = 0;
        const check = setInterval(() => {
            elapsed += 100;
            if (scene3d.getLoadingProgress() >= 1 || elapsed > 5000) {
                clearInterval(check);
                resolve();
            }
        }, 100);
    });

    // Complete loading
    clearInterval(progressInterval);
    if (loaderBar) loaderBar.style.width = '100%';

    await new Promise(resolve => setTimeout(resolve, 400));

    // Hide loader
    if (loader) loader.classList.add('hidden');

    // Show scroll container
    if (scrollContainer) {
        scrollContainer.style.opacity = '1';
        scrollContainer.style.transition = 'opacity 0.8s ease';
    }

    // Wait for DOM transition
    await new Promise(resolve => setTimeout(resolve, 300));

    // Initialize scroll animations
    initAnimations(scene3d);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
