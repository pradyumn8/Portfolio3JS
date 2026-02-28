/**
 * Portfolio Data — Pradyumna's content
 */

export const profile = {
    name: 'Pradyumna',
    roles: ['Frontend Developer', 'Database Developer', 'MERN Stack Developer', 'Problem Solver'],
    tagline: 'Passionate Frontend Developer and Database Developer with a love for coding and continuous learning.',
    status: 'Available for opportunities',
    social: {
        linkedin: 'https://www.linkedin.com/in/pradyumna-web-developer/',
        github: 'https://github.com/pradyumn8/',
        instagram: 'https://www.instagram.com/firebrand121/',
        facebook: 'https://www.facebook.com/vishwakarma.pradyumn.1/',
    },
    email: 'pradyumn8@gmail.com',
};

export const skills = [
    { name: 'HTML', category: 'frontend', level: 90 },
    { name: 'CSS', category: 'frontend', level: 85 },
    { name: 'JavaScript', category: 'frontend', level: 88 },
    { name: 'React', category: 'frontend', level: 85 },
    { name: 'Three.js', category: 'frontend', level: 70 },
    { name: 'MySQL', category: 'database', level: 80 },
    { name: 'MS SQL', category: 'database', level: 75 },
    { name: 'MongoDB', category: 'database', level: 82 },
    { name: 'Node.js', category: 'backend', level: 78 },
    { name: 'Git', category: 'tools', level: 85 },
    { name: 'VS Code', category: 'tools', level: 90 },
    { name: 'Postman', category: 'tools', level: 80 },
];

export const projects = [
    {
        title: 'StudyBridge',
        subtitle: 'Learning Management System',
        description: 'A comprehensive LMS built with MERN stack — ReactJS frontend, MongoDB backend. Features course management, student enrollment, and interactive learning modules.',
        tech: ['React', 'Node.js', 'MongoDB', 'Express'],
        github: 'https://github.com/pradyumn8/Learning-Management-System.git',
        live: null,
        color: '#00e5ff',
    },
    {
        title: 'Authentication System',
        subtitle: 'Secure Auth Flow',
        description: 'A robust MERN stack authentication system with JWT tokens, password hashing, login/register flows, and protected route handling.',
        tech: ['React', 'Node.js', 'MongoDB', 'JWT'],
        github: 'https://github.com/pradyumn8/Authentication.git',
        live: null,
        color: '#a855f7',
    },
    {
        title: 'E-Commerce',
        subtitle: 'Full-Stack Shopping Platform',
        description: 'Complete e-commerce solution with product listings, cart management, payment integration, and admin dashboard.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        github: 'https://github.com/pradyumn8/E-commerce.git',
        live: null,
        color: '#ff006e',
    },
    {
        title: 'StormAlert',
        subtitle: 'Real-Time Weather App',
        description: 'Live weather application with real-time updates, location search, and beautiful visual forecasts using weather APIs.',
        tech: ['JavaScript', 'API', 'CSS'],
        github: null,
        live: 'https://stormalert.netlify.app/',
        color: '#3b82f6',
    },
    {
        title: 'CollegeSphere',
        subtitle: 'Educational Platform',
        description: 'A comprehensive college management platform for academic operations, student resources, and institutional information.',
        tech: ['React', 'CSS', 'JavaScript'],
        github: null,
        live: 'https://collegesphare.netlify.app/',
        color: '#ffd700',
    },
    {
        title: 'Imagify',
        subtitle: 'AI Text-to-Image Generator',
        description: 'An AI-powered text-to-image generator that transforms written descriptions into stunning visual artwork.',
        tech: ['React', 'AI API', 'Node.js'],
        github: null,
        live: 'https://imagify-1.onrender.com/',
        color: '#f97316',
    },
];

export const experience = [
    {
        role: 'Junior Web Developer (Trainee)',
        company: 'Aspirent Solutions',
        location: 'Mumbai',
        period: 'Mar 2023 — Sep 2023',
        description: 'Developed and maintained web applications, collaborated with senior developers on client projects, and gained hands-on experience with modern frontend frameworks.',
    },
];

export const education = [
    {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'IGNOU',
        period: '2022 — 2024',
    },
    {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'University of Allahabad',
        period: '2019 — 2022',
    },
];

/**
 * Camera path waypoints for scroll-driven movement.
 * The camera moves through the 3D space as user scrolls.
 */
export const cameraPath = [
    { x: 0, y: 2, z: 60 },      // Hero
    { x: -5, y: 1, z: 40 },     // About
    { x: 5, y: 3, z: 20 },      // Skills
    { x: -8, y: 0, z: -5 },     // Project 1
    { x: 6, y: 2, z: -25 },     // Project 2
    { x: -6, y: -1, z: -45 },   // Project 3
    { x: 5, y: 1, z: -65 },     // Project 4
    { x: -5, y: 2, z: -85 },    // Project 5
    { x: 6, y: 0, z: -105 },    // Project 6
    { x: -3, y: 1, z: -125 },   // Experience
    { x: 3, y: 2, z: -145 },    // Education
    { x: 0, y: 0, z: -165 },    // Contact
];
