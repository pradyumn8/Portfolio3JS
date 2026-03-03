import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cameraPath, personal } from './content.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Portfolio GSAP animations:
 * - Hero intro sequence with typewriter
 * - Laptop model scroll animation (fade + rotate as user leaves hero)
 * - Scroll-driven camera movement through 3D space
 * - Section reveals (about, skills, projects, timeline, contact)
 * - Navigation highlighting
 * - 3D object glow on scroll
 */
export function initAnimations(scene3d) {
    const camera = scene3d.getCamera();
    const sectionObjects = scene3d.getSectionObjects();

    // =============================
    // TYPEWRITER EFFECT
    // =============================
    const roles = personal.roles;
    const roleEl = document.getElementById('hero-role');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const current = roles[roleIndex];
        if (!roleEl) return;

        if (isDeleting) {
            roleEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 300;
        }

        setTimeout(typeWriter, speed);
    }

    setTimeout(typeWriter, 2500);

    // =============================
    // NAVBAR SHOW ON SCROLL
    // =============================
    const navbar = document.getElementById('navbar');

    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        onEnter: () => navbar && navbar.classList.add('visible'),
        onLeaveBack: () => navbar && navbar.classList.remove('visible'),
    });

    // =============================
    // NAV LINK ACTIVE STATE
    // =============================
    const sections = ['about', 'skills', 'projects', 'timeline', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach((sectionId) => {
        ScrollTrigger.create({
            trigger: `#${sectionId}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setActiveNav(sectionId),
            onEnterBack: () => setActiveNav(sectionId),
        });
    });

    function setActiveNav(id) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
        });
    }

    // =============================
    // HERO INTRO ANIMATION
    // =============================
    const heroTl = gsap.timeline({
        delay: 0.3,
        onComplete: () => ScrollTrigger.refresh(),
    });

    heroTl
        .to('#hero-status', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        })
        .to('#hero-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
        }, '-=0.3')
        .to('.hero__role-wrapper', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.4')
        .to('#hero-bio', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('#hero-actions', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('#hero-socials', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.4')
        .to('#scroll-indicator', {
            opacity: 0.6,
            duration: 1,
            ease: 'power2.out',
        }, '-=0.3');

    // =============================
    // LAPTOP MODEL ANIMATIONS
    // =============================
    function setupLaptopAnimations() {
        const laptopGroup = scene3d.getLaptopGroup();
        if (!laptopGroup) {
            setTimeout(setupLaptopAnimations, 200);
            return;
        }

        const lidPart = scene3d.getLidPart();
        const lidOriginalRotation = scene3d.getLidOriginalRotation();
        let slideInDone = false;
        let openDone = !lidPart; // If no lid found, consider open done

        function checkAllDone() {
            if (slideInDone && openDone) {
                scene3d.autoRotateEnabled = true;
            }
        }

        // --- INTRO: Slide from LEFT to CENTER ---
        gsap.to(laptopGroup.position, {
            x: 0,
            y: -1,
            duration: 2,
            ease: 'power3.out',
            delay: 0.5,
            onComplete: () => {
                slideInDone = true;
                checkAllDone();
            }
        });
        gsap.to(laptopGroup.rotation, {
            y: -0.15,
            x: 0.2,
            z: 0,
            duration: 2,
            ease: 'power3.out',
            delay: 0.5,
        });

        // --- OPEN LID ANIMATION (rotate lid part back to original) ---
        if (lidPart && lidOriginalRotation !== null) {
            gsap.to(lidPart.rotation, {
                x: lidOriginalRotation,
                duration: 1.8,
                ease: 'power2.out',
                delay: 1.0, // Start opening after slide-in begins
                onComplete: () => {
                    openDone = true;
                    checkAllDone();
                }
            });
        } else if (!lidPart) {
            // Fallback: tilt the whole laptop from more closed to open position
            // (start more tilted forward, animate to normal)
            laptopGroup.rotation.x = 0.8; // More tilted = looks more closed
            gsap.to(laptopGroup.rotation, {
                x: 0.2,
                duration: 2,
                ease: 'power2.out',
                delay: 0.8,
                onComplete: () => {
                    openDone = true;
                    checkAllDone();
                }
            });
        }

        // --- SCROLL: Disable auto-rotate and take manual control ---
        ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            onEnterBack: () => {
                // Re-enable auto-rotate when scrolling back to hero
                scene3d.autoRotateEnabled = true;
            },
            onUpdate: (self) => {
                const p = self.progress;

                // Disable auto-rotate once scrolling begins
                if (p > 0.02) {
                    scene3d.autoRotateEnabled = false;
                }

                // Move downward (-Y direction) from resting y=-1
                laptopGroup.position.y = -1 - p * 15;
                // Slight forward push
                laptopGroup.position.z = 46 - p * 6;

                // Tilt forward as it drops
                laptopGroup.rotation.x = 0.2 + p * 0.5;
                // Spin slightly
                laptopGroup.rotation.y = -0.15 - p * 0.4;

                // Scale down gently
                const scale = 1 - p * 0.25;
                laptopGroup.scale.setScalar(scale);

                // Fade out materials
                laptopGroup.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.transparent = true;
                        child.material.opacity = 1 - p * 0.9;
                    }
                });
            }
        });
    }

    setupLaptopAnimations();

    // =============================
    // SCROLL-DRIVEN CAMERA
    // =============================
    const cameraTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
        }
    });

    cameraPath.forEach((point, i) => {
        if (i === 0) return;
        cameraTimeline.to(camera.position, {
            x: point.x,
            y: point.y,
            z: point.z,
            duration: 1,
            ease: 'none',
        }, (i - 1));
    });

    // =============================
    // HERO FADE ON SCROLL
    // =============================
    gsap.to('.hero__content', {
        opacity: 0,
        y: -80,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '50% top',
            scrub: 1,
        }
    });

    gsap.to('#scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: '10% top',
            end: '30% top',
            scrub: 1,
        }
    });

    // =============================
    // ABOUT SECTION
    // =============================
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        gsap.to('#about .section__label', {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: '#about', start: 'top 75%', end: 'top 45%', scrub: 1 }
        });
        gsap.to('#about .section__title', {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: { trigger: '#about', start: 'top 70%', end: 'top 40%', scrub: 1 }
        });

        const aboutParagraphs = aboutSection.querySelectorAll('.about__text p');
        aboutParagraphs.forEach((p, i) => {
            gsap.to(p, {
                opacity: 1, y: 0, duration: 0.8,
                scrollTrigger: {
                    trigger: '#about',
                    start: `top ${65 - i * 8}%`,
                    end: `top ${40 - i * 5}%`,
                    scrub: 1
                }
            });
        });

        const statCards = aboutSection.querySelectorAll('.stat-card');
        statCards.forEach((card, i) => {
            gsap.to(card, {
                opacity: 1, x: 0, duration: 0.8,
                scrollTrigger: {
                    trigger: '#about',
                    start: `top ${60 - i * 8}%`,
                    end: `top ${35 - i * 5}%`,
                    scrub: 1
                }
            });
        });
    }

    // =============================
    // SKILLS SECTION
    // =============================
    gsap.to('#skills .section__label', {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: '#skills', start: 'top 75%', end: 'top 50%', scrub: 1 }
    });
    gsap.to('#skills .section__title', {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: '#skills', start: 'top 70%', end: 'top 45%', scrub: 1 }
    });

    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, scale: 1, duration: 0.6,
            scrollTrigger: {
                trigger: '#skills',
                start: `top ${65 - i * 3}%`,
                end: `top ${40 - i * 2}%`,
                scrub: 1
            }
        });
    });

    // =============================
    // PROJECTS SECTION
    // =============================
    gsap.to('#projects .section__label', {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: '#projects', start: 'top 75%', end: 'top 50%', scrub: 1 }
    });
    gsap.to('#projects .section__title', {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: '#projects', start: 'top 70%', end: 'top 45%', scrub: 1 }
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 55%',
                scrub: 1,
            }
        });
    });

    // =============================
    // TIMELINE SECTION
    // =============================
    gsap.to('#timeline .section__label', {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: '#timeline', start: 'top 75%', end: 'top 50%', scrub: 1 }
    });
    gsap.to('#timeline .section__title', {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: '#timeline', start: 'top 70%', end: 'top 45%', scrub: 1 }
    });

    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach((item) => {
        gsap.to(item, {
            opacity: 1, x: 0, duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1,
            }
        });
    });

    // =============================
    // CONTACT SECTION
    // =============================
    gsap.to('#contact .section__label', {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: '#contact', start: 'top 75%', end: 'top 50%', scrub: 1 }
    });
    gsap.to('#contact .section__title', {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: '#contact', start: 'top 70%', end: 'top 45%', scrub: 1 }
    });
    gsap.to('#contact-subtitle', {
        opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: '#contact', start: 'top 65%', end: 'top 40%', scrub: 1 }
    });

    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: {
                trigger: '#contact',
                start: `top ${55 - i * 6}%`,
                end: `top ${35 - i * 4}%`,
                scrub: 1,
            }
        });
    });

    // =============================
    // 3D OBJECT GLOW ON SCROLL
    // =============================
    // Section objects now map: 0=about, 1=skills, 2=projects, 3=timeline, 4=contact
    const sectionIds = ['about', 'skills', 'projects', 'timeline', 'contact'];
    sectionIds.forEach((id, i) => {
        if (!sectionObjects[i]) return;

        gsap.to(sectionObjects[i].material, {
            opacity: 0.55,
            emissiveIntensity: 0.45,
            scrollTrigger: {
                trigger: `#${id}`,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1,
            }
        });

        gsap.to(sectionObjects[i].material, {
            opacity: 0.12,
            emissiveIntensity: 0.08,
            scrollTrigger: {
                trigger: `#${id}`,
                start: 'bottom 60%',
                end: 'bottom 20%',
                scrub: 1,
            }
        });

        gsap.to(sectionObjects[i].scale, {
            x: 1.4, y: 1.4, z: 1.4,
            scrollTrigger: {
                trigger: `#${id}`,
                start: 'top 70%',
                end: 'center center',
                scrub: 1,
            }
        });

        gsap.to(sectionObjects[i].scale, {
            x: 1, y: 1, z: 1,
            scrollTrigger: {
                trigger: `#${id}`,
                start: 'center center',
                end: 'bottom 30%',
                scrub: 1,
            }
        });
    });

    // =============================
    // SMOOTH SCROLL FOR NAV LINKS
    // =============================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
