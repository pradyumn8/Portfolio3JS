/**
 * Portfolio content data — Pradyumna's 3D Portfolio
 */

export const personal = {
    name: 'Pradyumna',
    roles: ['Frontend Developer', 'Database Developer', 'React Developer', 'Web Developer'],
    bio: 'Passionate Frontend Developer and Database Developer with a love for coding and continuous learning. Building modern, performant web applications with clean code.',
    location: 'Mumbai, Maharashtra',
    email: 'pradyumnavishwakarma121@gmail.com',
    phone: '+91 7565860738',
    social: {
        linkedin: 'https://www.linkedin.com/in/pradyumna-web-developer/',
        github: 'https://github.com/pradyumn8/',
        instagram: 'https://www.instagram.com/firebrand121/',
    },
    resume: 'https://drive.google.com/file/d/1nhyQ7FPxVPTo649VxRD5Zy4lr2x8WjjY/view?usp=sharing',
};

export const skills = [
    { name: 'HTML', icon: '🌐', color: '#e44d26' },
    { name: 'CSS', icon: '🎨', color: '#264de4' },
    { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
    { name: 'React', icon: '⚛️', color: '#61dafb' },
    { name: 'MySQL', icon: '🗄️', color: '#00758f' },
    { name: 'MS SQL', icon: '💾', color: '#cc2927' },
    { name: 'MongoDB', icon: '🍃', color: '#47a248' },
];

export const projects = [
    {
        title: 'StudyBridge LMS',
        desc: 'A full-featured learning management system with course management, student dashboards, and progress tracking.',
        tech: ['React', 'CSS', 'JavaScript'],
        live: null,
        github: 'https://github.com/pradyumn8/Learning-Management-System.git',
        color: '#61dafb',
    },
    {
        title: 'VidTube',
        desc: 'A YouTube clone with video streaming, search, and responsive UI for seamless video consumption.',
        tech: ['React', 'API', 'CSS'],
        live: 'https://vvidtube.netlify.app/',
        github: null,
        color: '#ff006e',
    },
    {
        title: 'Prescripto',
        desc: 'Healthcare platform for doctor appointments, patient management, and medical prescriptions.',
        tech: ['React', 'MongoDB', 'Node.js'],
        live: 'https://prescrriptoo.netlify.app/',
        github: null,
        color: '#00e5ff',
    },
    {
        title: 'E-Commerce Store',
        desc: 'Full-featured online store with product listings, cart, checkout, and payment integration.',
        tech: ['React', 'MongoDB', 'Express'],
        live: null,
        github: 'https://github.com/pradyumn8/E-commerce.git',
        color: '#ffd700',
    },
    {
        title: 'Real Estate Platform',
        desc: 'Property listing platform with search filters, property details, and modern responsive design.',
        tech: ['React', 'CSS', 'JavaScript'],
        live: 'https://estatedev.netlify.app/',
        github: null,
        color: '#a855f7',
    },
    {
        title: 'Imagify',
        desc: 'AI-powered image generation tool that transforms text prompts into stunning visuals.',
        tech: ['React', 'AI API', 'Node.js'],
        live: 'https://imagify-1.onrender.com/',
        github: null,
        color: '#3b82f6',
    },
];

export const timeline = [
    {
        year: '2015 - 2016',
        title: 'Matriculation',
        desc: 'NIC Janghai, UP Board',
        type: 'education',
    },
    {
        year: '2017 - 2018',
        title: 'Intermediate',
        desc: 'NIC Janghai, UP Board',
        type: 'education',
    },
    {
        year: '2019 - 2022',
        title: 'Bachelor of Computer Application',
        desc: 'University of Allahabad',
        type: 'education',
    },
    {
        year: '2022 - 2024',
        title: 'Master of Computer Application',
        desc: 'IGNOU',
        type: 'education',
    },
    {
        year: 'Mar 2023 - Sep 2023',
        title: 'Trainee Web Developer',
        desc: 'Aspirant Solutions, Mumbai',
        type: 'work',
    },
];

/**
 * Camera path waypoints for scroll-driven 3D camera movement.
 */
export const cameraPath = [
    { x: 0, y: 0, z: 50 },     // Hero
    { x: -5, y: 2, z: 35 },    // About
    { x: 6, y: -1, z: 20 },    // Skills
    { x: -4, y: 3, z: 0 },     // Projects
    { x: 5, y: -2, z: -20 },   // Timeline
    { x: -3, y: 1, z: -40 },   // Contact
    { x: 0, y: 0, z: -55 },    // Footer
];
