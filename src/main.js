import './style.css';
import { Scene3D } from './scene.js';
import { initAnimations } from './animations.js';

/**
 * Main Application Entry Point
 *
 * 1. Shows loading screen with animated progress
 * 2. Initializes Three.js 3D scene
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
        progress += Math.random() * 12 + 3;
        if (progress > 92) progress = 92;
        if (loaderBar) loaderBar.style.width = `${progress}%`;
    }, 180);

    // Initialize 3D scene
    const scene3d = new Scene3D(canvas);

    // Let scene settle
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Complete loading
    clearInterval(progressInterval);
    if (loaderBar) loaderBar.style.width = '100%';

    await new Promise(resolve => setTimeout(resolve, 600));

    // Hide loader
    if (loader) loader.classList.add('hidden');

    // Show scroll container
    if (scrollContainer) {
        scrollContainer.style.opacity = '1';
        scrollContainer.style.transition = 'opacity 1s ease';
    }

    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, 400));

    // Initialize scroll animations
    initAnimations(scene3d);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
