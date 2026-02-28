import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cameraPath, projects, skills } from './content.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up all GSAP-driven animations:
 * - Hero intro sequence with typewriter role effect
 * - Scroll-driven camera movement through 3D space
 * - Section header reveals
 * - Project card scroll-triggered fade in/out
 * - Skills grid stagger animation
 * - Timeline reveal
 * - Contact section
 * - Progress bar sync
 * - Section indicator
 * - Navbar active link
 */
export function initAnimations(scene3d) {
    const camera = scene3d.getCamera();
    const projectObjects = scene3d.getProjectObjects();

    // =============================
    // POPULATE DYNAMIC CONTENT
    // =============================
    populateProjects();
    populateSkills();
    setupRoleTypewriter();
    setupScrollProgress();
    setupSectionIndicator();
    setupNavLinks();

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
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
        })
        .to('.hero__title-line', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
        }, '-=0.4')
        .to('#hero-roles', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('#hero-subtitle', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('#hero-actions', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.3')
        .to('#scroll-indicator', {
            opacity: 0.5,
            duration: 1,
            ease: 'power2.out',
        }, '-=0.2');

    // =============================
    // SCROLL-DRIVEN CAMERA
    // =============================
    const cameraTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '#scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
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
    // HERO FADE OUT
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
            end: '25% top',
            scrub: 1,
        }
    });

    // =============================
    // SECTION HEADER ANIMATIONS
    // =============================
    document.querySelectorAll('.section-header').forEach((header) => {
        gsap.to(header, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header.closest('.section'),
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
            }
        });
    });

    // =============================
    // ABOUT SECTION
    // =============================
    gsap.to('.about__text-block', {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            end: 'top 45%',
            scrub: 1,
        }
    });

    gsap.to('.about__info-cards', {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
        }
    });

    // =============================
    // SKILLS SECTION
    // =============================
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: i * 0.05,
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            }
        });

        // Animate the fill bar
        const fill = card.querySelector('.skill-card__fill');
        if (fill) {
            gsap.to(fill, {
                width: fill.dataset.level + '%',
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 60%',
                    toggleActions: 'play none none reverse',
                }
            });
        }
    });

    // =============================
    // PROJECTS HEADER
    // =============================
    gsap.to('.projects-header__subtitle', {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
            trigger: '.section--projects-header',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
        }
    });

    // =============================
    // PROJECT CARD ANIMATIONS
    // =============================
    const projectCards = document.querySelectorAll('.project__card');
    projectCards.forEach((card, i) => {
        const section = card.closest('.section--project');

        // Fade in
        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 35%',
                scrub: 1,
            }
        });

        // Fade out
        gsap.to(card, {
            opacity: 0,
            y: -30,
            scale: 0.97,
            duration: 1,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: section,
                start: 'bottom 70%',
                end: 'bottom 30%',
                scrub: 1,
            }
        });

        // 3D object pulse
        if (projectObjects[i]) {
            gsap.to(projectObjects[i].material, {
                opacity: 0.5,
                emissiveIntensity: 0.4,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 40%',
                    scrub: 1,
                }
            });

            gsap.to(projectObjects[i].material, {
                opacity: 0.12,
                emissiveIntensity: 0.08,
                scrollTrigger: {
                    trigger: section,
                    start: 'bottom 70%',
                    end: 'bottom 30%',
                    scrub: 1,
                }
            });

            gsap.to(projectObjects[i].scale, {
                x: 1.4, y: 1.4, z: 1.4,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'center center',
                    scrub: 1,
                }
            });

            gsap.to(projectObjects[i].scale, {
                x: 1, y: 1, z: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'center center',
                    end: 'bottom 30%',
                    scrub: 1,
                }
            });
        }
    });

    // =============================
    // EXPERIENCE TIMELINE
    // =============================
    gsap.to('.timeline', {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '#experience',
            start: 'top 75%',
            end: 'top 45%',
            scrub: 1,
        }
    });

    // =============================
    // CONTACT SECTION
    // =============================
    gsap.to('#contact-subtitle', {
        opacity: 1,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            end: 'top 45%',
            scrub: 1,
        }
    });

    gsap.to('#contact-links', {
        opacity: 1,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 65%',
            end: 'top 40%',
            scrub: 1,
        }
    });

    gsap.to('.contact__cta', {
        opacity: 1,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 55%',
            end: 'top 30%',
            scrub: 1,
        }
    });
}

// =============================
// HELPER: Populate project cards
// =============================
function populateProjects() {
    projects.forEach((project, i) => {
        const card = document.querySelector(`.project__card[data-card="${i}"]`);
        if (!card) return;

        card.style.setProperty('--project-color', project.color);

        const techTags = project.tech.map(t => `<span class="project__tech-tag">${t}</span>`).join('');

        let linksHtml = '';
        if (project.github) {
            linksHtml += `<a href="${project.github}" target="_blank" class="project__link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Code
            </a>`;
        }
        if (project.live) {
            linksHtml += `<a href="${project.live}" target="_blank" class="project__link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Live
            </a>`;
        }

        card.innerHTML = `
            <span class="project__number">0${i + 1} / 0${projects.length}</span>
            <h3 class="project__title">${project.title}</h3>
            <p class="project__subtitle">${project.subtitle}</p>
            <p class="project__desc">${project.description}</p>
            <div class="project__tech">${techTags}</div>
            <div class="project__links">${linksHtml}</div>
        `;
    });
}

// =============================
// HELPER: Populate skills
// =============================
function populateSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    const colorMap = {
        frontend: '#00d4ff',
        database: '#a855f7',
        backend: '#22c55e',
        tools: '#f97316',
    };

    skills.forEach((skill) => {
        const color = colorMap[skill.category] || '#00d4ff';
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.setProperty('--skill-color', color);
        card.innerHTML = `
            <span class="skill-card__name">${skill.name}</span>
            <div class="skill-card__bar">
                <div class="skill-card__fill" data-level="${skill.level}"></div>
            </div>
            <span class="skill-card__level">${skill.level}%</span>
        `;
        grid.appendChild(card);
    });
}

// =============================
// HELPER: Typewriter effect for roles
// =============================
function setupRoleTypewriter() {
    const roles = ['Frontend Developer', 'Database Developer', 'MERN Stack Developer', 'Problem Solver'];
    const element = document.getElementById('role-text');
    if (!element) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = roles[roleIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 2000);
}

// =============================
// HELPER: Scroll progress bar
// =============================
function setupScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = `${progress}%`;
    });
}

// =============================
// HELPER: Section indicator
// =============================
function setupSectionIndicator() {
    const indicator = document.getElementById('section-indicator');
    const label = document.getElementById('section-label');
    if (!indicator || !label) return;

    const sections = [
        { id: 'hero', label: '01 / HOME' },
        { id: 'about', label: '02 / ABOUT' },
        { id: 'skills', label: '03 / SKILLS' },
        { id: 'projects', label: '04 / PROJECTS' },
        { id: 'project-1', label: '04 / PROJECT 01' },
        { id: 'project-2', label: '04 / PROJECT 02' },
        { id: 'project-3', label: '04 / PROJECT 03' },
        { id: 'project-4', label: '04 / PROJECT 04' },
        { id: 'project-5', label: '04 / PROJECT 05' },
        { id: 'project-6', label: '04 / PROJECT 06' },
        { id: 'experience', label: '05 / EXPERIENCE' },
        { id: 'contact', label: '06 / CONTACT' },
    ];

    sections.forEach(({ id, label: sLabel }) => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                label.textContent = sLabel;
                indicator.classList.add('visible');
            },
            onEnterBack: () => {
                label.textContent = sLabel;
            },
        });
    });

    // Show indicator after scrolling
    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 90%',
        onEnter: () => indicator.classList.add('visible'),
        onLeaveBack: () => indicator.classList.remove('visible'),
    });
}

// =============================
// HELPER: Navbar active link
// =============================
function setupNavLinks() {
    const links = document.querySelectorAll('.navbar__link');
    const navSections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

    navSections.forEach((id) => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveLink(id),
            onEnterBack: () => updateActiveLink(id),
        });
    });

    function updateActiveLink(activeId) {
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === activeId);
        });
    }

    // Smooth scroll for nav links
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
