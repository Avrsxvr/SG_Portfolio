"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useAnimationFrame, MotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Code, Compass, Briefcase, FileText, Download, Plus, Minus } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Matter from "matter-js";
import "./physics.css";

/* ─── Social Icons ─── */
const IconLinkedIn = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
);

const IconGithub = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"/>
    </svg>
);

const IconMail = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);


const CORE_TECH_DATA = [
    { id: "unity", name: "Unity", category: "Spatial Engine", desc: "Core engine for building 3D VR/AR physics interactions.", useCase: "XR Mechanics & Physics" },
    { id: "csharp", name: "C#", category: "Core Language", desc: "Primary language for architecture and Unity tooling.", useCase: "System Architecture" },
    { id: "eighthwall", name: "8th Wall", category: "WebAR Platform", desc: "High-performance markerless WebAR tracking.", useCase: "WebAR Campaigns" },
    { id: "python", name: "Python", category: "Automation", desc: "Scripting language for models and data pipelines.", useCase: "AI Pipelines" },
    { id: "mindar", name: "MindAR", category: "WebAR", desc: "WebAR tracking for image and face tracking.", useCase: "Browser Tracking" },
    { id: "arcore", name: "ARCore", category: "Mobile AR", desc: "Markerless plane detection and motion tracking.", useCase: "Android Spatial AR" },
    { id: "arkit", name: "ARKit", category: "Mobile AR", desc: "Native augmented reality framework for Apple devices.", useCase: "iOS Spatial AR" },
    { id: "vuforia", name: "Vuforia", category: "Enterprise AR", desc: "Industrial strength image and model tracking.", useCase: "Enterprise AR" },
    { id: "threejs", name: "Three.js", category: "Web Graphics", desc: "3D rendering and real-time configurators for web.", useCase: "Web 3D Graphics" },
    { id: "xri", name: "XR Toolkit", category: "XR Framework", desc: "Unity standard for 6DoF interaction and locomotion.", useCase: "Interaction Systems" },
    { id: "meta", name: "Meta SDK", category: "VR Headsets", desc: "Native API for Meta Quest hand tracking and presence.", useCase: "Quest Development" }
];

const ARCHITECTURE_LAYERS = [
    {
        num: "01",
        title: "CORE ENGINE & LOGIC",
        subtitle: "Foundation for 3D physics, scene management, and system scripts.",
        techs: [
            { name: "Unity 3D", tag: "Spatial Engine", desc: "Physics & 3D Environment Engine" },
            { name: "C#", tag: "Primary Language", desc: "Core System Scripts & Unity Tooling" }
        ]
    },
    {
        num: "02",
        title: "SPATIAL & XR FRAMEWORKS",
        subtitle: "Cross-platform tracking, locomotion, and WebAR platforms.",
        techs: [
            { name: "OpenXR / XR Toolkit", tag: "XR Standard", desc: "6DoF Hand Tracking & Interaction" },
            { name: "ARCore / ARKit", tag: "Mobile AR", desc: "Markerless Motion & Plane Tracking" },
            { name: "WebXR API", tag: "Web 3D", desc: "Browser-Native Spatial Computing" },
            { name: "8th Wall", tag: "WebAR", desc: "Cross-Device Zero-Install WebAR" }
        ]
    },
    {
        num: "03",
        title: "WEB 3D & GRAPHICS",
        subtitle: "Real-time rendering, WebGL shaders, and 3D web experiences.",
        techs: [
            { name: "Three.js / WebGL", tag: "Graphics Engine", desc: "Custom Shaders & Product Configurators" }
        ]
    },
    {
        num: "04",
        title: "AI & PERCEPTION",
        subtitle: "Computer vision algorithms, gesture tracking, and adaptive AI.",
        techs: [
            { name: "Computer Vision", tag: "OpenCV", desc: "Image Processing & Gesture Tracking" },
            { name: "Spatial AI", tag: "GenAI", desc: "Adaptive LLM Agents in Spatial Apps" },
            { name: "Python", tag: "Automation", desc: "Vision Models & Automation Pipelines" }
        ]
    }
];

const MatterPhysicsEngine = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const [positions, setPositions] = useState<{ id: string, x: number, y: number, angle: number }[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!sceneRef.current) return;
        
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        const width = mobile ? 360 : 600;
        const height = mobile ? 360 : 600;
        const ballRadius = mobile ? 35 : 45;

        const engine = Matter.Engine.create();
        engineRef.current = engine;
        const world = engine.world;
        
        // Slightly lower gravity for a floaty space feel
        engine.gravity.y = 0.8;

        // Create the hollow circular boundary
        const numSegments = 64;
        const containerRadius = width / 2;
        const segmentLength = (2 * Math.PI * containerRadius) / numSegments;
        
        const boundaryBodies: Matter.Body[] = [];
        for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const x = containerRadius + Math.cos(angle) * containerRadius;
            const y = containerRadius + Math.sin(angle) * containerRadius;
            
            const segment = Matter.Bodies.rectangle(x, y, segmentLength + 2, 20, {
                isStatic: true,
                angle: angle,
                friction: 0.1,
                restitution: 0.8, // Bouncy walls
                render: { visible: false }
            });
            boundaryBodies.push(segment);
        }
        
        Matter.World.add(world, boundaryBodies);

        // Create the tech balls
        const bodies = CORE_TECH_DATA.map((tech, i) => {
            // Spawn safely in a grid to avoid physics overlapping ejections
            const cols = mobile ? 3 : 5;
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            // Map grid across the upper area of the container
            const startX = containerRadius - ((cols * ballRadius * 1.1) - ballRadius);
            const x = startX + (col * ballRadius * 2.2) + (Math.random() * 10);
            const y = ballRadius + 40 + (row * ballRadius * 2.2) + (Math.random() * 10);
            
            return Matter.Bodies.circle(x, y, ballRadius, {
                label: tech.id,
                restitution: 0.95, // Very bouncy balls
                friction: 0.005,
                density: 0.04,
                render: { visible: false }
            });
        });
        
        Matter.World.add(world, bodies);

        // Add an invisible physical cursor body to bat the balls around on hover!
        const cursorBody = Matter.Bodies.circle(0, 0, ballRadius * 1.5, {
            isStatic: true,
            render: { visible: false }
        });
        Matter.World.add(world, cursorBody);

        const handleMouseMove = (e: MouseEvent) => {
            if (!sceneRef.current) return;
            const rect = sceneRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the invisible cursor body to follow the mouse.
            // Because it is physical, dragging it through the balls will bat them away instantly!
            Matter.Body.setPosition(cursorBody, { x, y });
        };
        
        // Listen to mouse move on the container
        sceneRef.current.addEventListener('mousemove', handleMouseMove);

        // Still keep mouse control for clicking/grabbing
        const mouse = Matter.Mouse.create(sceneRef.current);
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel as EventListener);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel as EventListener);

        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Matter.World.add(world, mouseConstraint);

        // Run the engine
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        // Sync DOM
        Matter.Events.on(engine, 'afterUpdate', () => {
            const newPositions = bodies.map(b => ({
                id: b.label,
                x: b.position.x,
                y: b.position.y,
                angle: b.angle
            }));
            setPositions(newPositions);
        });

        return () => {
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            Matter.World.clear(world, false);
            if (sceneRef.current) {
                sceneRef.current.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    const ballRadius = isMobile ? 35 : 45;

    return (
        <section id="technologies" className="physics-section">
            <div style={{ textAlign: "center", zIndex: 10, marginBottom: "3rem", pointerEvents: "none", padding: "0 1rem" }}>
                <h2 className="section-main-title" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.01em" }}>
                    CORE <span className="accent-gradient-text">TECHNOLOGIES</span>
                </h2>
                <p style={{ color: "var(--secondary)", marginTop: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    Interactive Physics Sandbox
                </p>
            </div>

            <div 
                className="physics-container"
                ref={sceneRef}
            >
                {positions.map(pos => {
                    const tech = CORE_TECH_DATA.find(t => t.id === pos.id);
                    if (!tech) return null;
                    
                    return (
                        <div 
                            key={pos.id}
                            className="physics-ball"
                            style={{
                                width: ballRadius * 2,
                                height: ballRadius * 2,
                                transform: `translate(${pos.x - ballRadius}px, ${pos.y - ballRadius}px) rotate(${pos.angle}rad)`
                            }}
                        >
                            <span className="physics-ball-text" style={{ transform: `rotate(${-pos.angle}rad)` }}>
                                {tech.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

interface Project {
    title: string;
    desc: string;
    video: string;
    color: string;
    id: string;
}

const PROJECTS_DATA: Project[] = [
    { title: "SPACESHIP VR", desc: "Immersive spaceship experience with physics-based interactions and dynamic cockpit controls for space exploration.", video: "/videos/space_vr.mp4", color: "#F07400", id: "01" },
    { title: "VR INTERACTIVE GAME", desc: "Diverse VR gameplay featuring basketball, target shooting, and escape rooms with fluid mechanics.", video: "/videos/intro_vr.mp4", color: "#8800ff", id: "02" },
    { title: "AR HERITAGE", desc: "Explore India’s cultural heritage interactively with immersive storytelling and 3D visualizations.", video: "/videos/ar_heritage.mp4", color: "#00d4ff", id: "03" },
    { title: "SMART INTERIORS", desc: "Visualize furniture with accurate scaling and positioning.\nCustomize textures for a personalized experience.", video: "/videos/ar_furniture.mp4", color: "#00ff88", id: "04" }
];

const NAV_LINKS = ["Home", "Projects", "Skills", "Contact"];



const AccordionProjectCard = ({ project, index, expandedId, setExpandedId }: any) => {
    const isOpen = expandedId === project.id;
    
    const updateOrigin = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const origin = y < rect.height / 2 ? 'top' : 'bottom';
        const fillEl = e.currentTarget.querySelector('.acc-hover-fill') as HTMLElement;
        if (fillEl) {
            fillEl.style.transformOrigin = origin;
        }
    };

    return (
        <div className={`acc-project-wrapper ${isOpen ? 'open' : ''}`}>
            <div 
                className="acc-project-bar" 
                onClick={() => setExpandedId(isOpen ? null : project.id)}
                onMouseEnter={updateOrigin}
                onMouseLeave={updateOrigin}
            >
                <div className="acc-hover-fill" />
                
                <div className="acc-bar-content">
                    <div className="acc-id">{project.id}</div>
                    <div className="acc-title-wrap">
                        <h2 className="acc-title">{project.title}</h2>
                        <span className="acc-category">{project.color ? "Spatial Computing" : "XR Development"}</span>
                    </div>
                    <div className="acc-icon">
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="acc-details-container"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="acc-details-inner">
                            <div className="acc-video-col">
                                <video src={project.video} autoPlay muted loop playsInline preload="metadata" />
                            </div>
                            <div className="acc-info-col">
                                <p className="acc-desc">{project.desc}</p>
                                <a href="https://github.com/Avrsxvr" target="_blank" rel="noopener noreferrer" className="acc-btn">
                                    Explore Project <ArrowRight size={16} style={{marginLeft: "0.5rem"}}/>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EXPERTISE_DATA = [
    {
        id: "xr",
        num: "01",
        category: "XR Development",
        summary: "Building immersive spatial experiences, physics-based VR interactions, and markerless AR applications.",
        skills: [
            {
                title: "AR Applications (Unity)",
                desc: "Developing markerless AR applications with accurate object placement, environmental tracking, and interactive user flows.",
                tags: ["UNITY", "ARCORE", "ARKIT", "C#"],
                deliverable: "Markerless AR & Tracking"
            },
            {
                title: "VR Interaction Systems",
                desc: "Building immersive VR mechanics including 6DoF hand manipulation, custom physics-based interactions, and comfortable locomotion.",
                tags: ["OPENXR", "VR PHYSICS", "C#", "UNITY"],
                deliverable: "6DoF Physics Systems"
            },
            {
                title: "XR Interaction Design",
                desc: "Designing intuitive spatial UI and interaction flows tailored specifically for 3D spatial computing environments.",
                tags: ["SPATIAL UI", "UX DESIGN", "PROTOTYPING"],
                deliverable: "Spatial UI & Design"
            }
        ]
    },
    {
        id: "web",
        num: "02",
        category: "Interactive & Web",
        summary: "Creating high-performance web 3D applications, WebAR configurators, and modern frontend prototypes.",
        skills: [
            {
                title: "WebAR Experiences",
                desc: "Browser-based augmented reality experiences enabling real-time 3D model placement and interaction without app installs.",
                tags: ["THREE.JS", "WEBGL", "WEBAR", "JS/TS"],
                deliverable: "Zero-Install WebAR"
            },
            {
                title: "Interactive 3D Configurators",
                desc: "Developing real-time product configurators allowing users to customize materials, colors, and features dynamically.",
                tags: ["THREE.JS", "REACT", "SHADERS", "GLTF"],
                deliverable: "Real-Time 3D Engine"
            },
            {
                title: "Frontend Prototyping",
                desc: "Rapidly building responsive, motion-rich web interfaces and functional prototypes to validate product interaction concepts.",
                tags: ["NEXT.JS", "REACT", "FRAMER MOTION", "CSS3"],
                deliverable: "High-Fidelity Web Apps"
            }
        ]
    },
    {
        id: "ai",
        num: "03",
        category: "Intelligent Systems",
        summary: "Integrating computer vision algorithms, AI automation tools, and adaptive intelligence into XR workflows.",
        skills: [
            {
                title: "Computer Vision",
                desc: "Implementing vision-based object detection, gesture tracking, and spatial mapping features to enable context-aware interactions.",
                tags: ["OPENCV", "PYTHON", "GESTURE TRACKING"],
                deliverable: "Spatial Perception"
            },
            {
                title: "Automation Tools",
                desc: "Developing lightweight AI-driven automation tools and scripts to streamline repetitive technical workflows.",
                tags: ["PYTHON", "AI APIS", "AUTOMATION"],
                deliverable: "Workflow Efficiency"
            },
            {
                title: "AI in XR Exploration",
                desc: "Exploring modern generative AI integration inside XR to build dynamic, contextually adaptive spatial user interfaces.",
                tags: ["GENAI", "SPATIAL AI", "PROTOTYPING"],
                deliverable: "Adaptive Intelligent XR"
            }
        ]
    }
];

const CapabilitiesShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);
    const activeGroup = EXPERTISE_DATA[activeTab];

    return (
        <div className="showcase-container">
            <div className="showcase-tabs">
                {EXPERTISE_DATA.map((group, idx) => {
                    const isActive = activeTab === idx;
                    return (
                        <button 
                            key={group.id} 
                            className={`showcase-tab-btn ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            <span className="tab-num">{group.num}</span>
                            <span className="tab-title">{group.category}</span>
                            {isActive && (
                                <motion.div 
                                    className="tab-active-indicator" 
                                    layoutId="activeTabIndicator"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeGroup.id}
                    className="showcase-stage"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="stage-header">
                        <div className="stage-header-meta">
                            <span className="stage-num">{activeGroup.num}</span>
                            <h3 className="stage-title">{activeGroup.category}</h3>
                        </div>
                        <p className="stage-summary">{activeGroup.summary}</p>
                    </div>

                    <div className="stage-cards-grid">
                        {activeGroup.skills.map((skill, idx) => (
                            <motion.div 
                                key={idx}
                                className="stage-feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                            >
                                <div className="card-top">
                                    <span className="deliverable-badge">{skill.deliverable}</span>
                                </div>
                                <h4 className="card-skill-title">{skill.title}</h4>
                                <p className="card-skill-desc">{skill.desc}</p>
                                
                                <div className="card-tags-list">
                                    {skill.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="tech-tag">{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const heroRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!footerRef.current) return;
        const rect = footerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    useEffect(() => { 
        setIsClient(true);
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const smoothHero = useSpring(heroProgress, { stiffness: 180, damping: 35, mass: 0.15 });
    const scaleHero = useTransform(smoothHero, [0, 0.3], [1, 12], { clamp: true });
    const heroOpacity = useTransform(smoothHero, [0, 0.3], [1, 0], { clamp: true });
    const aboutOpacity = useTransform(smoothHero, [0.25, 0.4, 0.7, 0.9], [0, 1, 1, 0], { clamp: true });
    const aboutScale = useTransform(smoothHero, [0.25, 0.9], [0.95, 1.05], { clamp: true });
    const aboutY = useTransform(smoothHero, [0.25, 0.9], [50, -20], { clamp: true });
    const textOpacity = useTransform(smoothHero, [0, 0.1, 0.8, 0.9], [1, 0.2, 0.2, 1], { clamp: true });
    const navPointerEvents = useTransform(textOpacity, (v) => v > 0.1 ? "auto" : "none");
 

 
    return (
        <main style={{ backgroundColor: "#000" }}>
            <motion.nav className="nav-overlay" style={{ opacity: textOpacity, pointerEvents: navPointerEvents as any }}>
                {NAV_LINKS.map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
                ))}
            </motion.nav>
 
            <motion.aside className="social-bar" style={{ opacity: textOpacity, pointerEvents: navPointerEvents as any }}>
                <a href="https://linkedin.com/in/sujal-gupta-2a7b14251/" target="_blank" rel="noopener noreferrer"><IconLinkedIn /></a>
                <a href="https://github.com/Avrsxvr" target="_blank" rel="noopener noreferrer"><IconGithub /></a>
                <a href="mailto:vanshsg12@gmail.com"><IconMail /></a>
            </motion.aside>
 
            <section ref={heroRef} id="home" style={{ height: "250dvh", position: "relative" }}>
                <div style={{ position: "sticky", top: 0, height: "100dvh", overflow: "hidden", backgroundColor: "#000" }}>
                    {/* LAYER 1: ZOOMING ELEMENTS & ABOUT */}
                    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", pointerEvents: "none", perspective: "1000px" }}>
                        <motion.div className="z-container hero-z" style={{ scale: scaleHero, opacity: heroOpacity }}>
                            <div className="hero-grid" aria-hidden="true" />
                            <div className="hero-glow" aria-hidden="true" />
                            <div className="hero-name-block" aria-label="Sujal Gupta">
                                <div className="hero-name-row">
                                    <span className="hero-name-first">SUJAL</span>
                                    <span className="hero-name-last">GUPTA</span>
                                </div>
                            </div>
                            <div className="hero-profile-img-wrap">
                                <div className="hero-profile-img-ring" />
                                <Image src="/Gemini_Generated_Image_7577lg7577lg7577-Photoroom.png" alt="Sujal Gupta" width={1000} height={1000} className="hero-profile-img" priority />
                            </div>
                        </motion.div>
 
                        <motion.div 
                            className="about-layer"
                            style={{ 
                                opacity: aboutOpacity,
                                scale: aboutScale,
                                y: aboutY,
                                position: "absolute",
                                zIndex: 30,
                                left: 0,
                                right: 0,
                                margin: "0 auto"
                            }}
                        >
                            <div className="bento-about-container">
                                {/* Bento Tile 1: Hero Title */}
                                <motion.div 
                                    className="bento-tile tile-title"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <div className="bento-title-content">
                                        <div className="bento-badge">XR DEVELOPER</div>
                                        <h1 className="bento-huge-title">KNOW<br/><span className="bento-gradient-text">ME</span></h1>
                                        <p className="bento-tagline">Building XR experiences that feel real.</p>
                                    </div>
                                </motion.div>

                                {/* Bento Tile 2: Location Map */}
                                <motion.div 
                                    className="bento-tile tile-location"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                >
                                    <div className="bento-map-bg">
                                        <div className="map-grid-lines" />
                                        <div className="map-pulse-dot-wrap">
                                            <div className="map-pulse-ring" />
                                            <div className="map-pulse-dot" />
                                        </div>
                                    </div>
                                    <div className="bento-loc-text">
                                        <MapPin size={16} color="var(--accent)" /> Based in Chennai
                                    </div>
                                </motion.div>

                                {/* Bento Tile 3: Bio Text */}
                                <motion.div 
                                    className="bento-tile tile-bio"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                >
                                    <p className="bento-bio-main">
                                        I’m an <span className="accent">XR developer</span> building interactive AR/VR experiences using Unity and modern spatial technologies. I focus on creating practical, usable products that go beyond experimentation.
                                    </p>
                                    <p className="bento-bio-sub">
                                        Alongside my personal projects, I collaborate on select freelance XR work. Recently, I’ve been exploring the intersection of spatial computing and AI to build more intuitive and adaptive experiences.
                                    </p>
                                </motion.div>

                                {/* Bento Tiles 4, 5, 6: Currently */}
                                {[
                                    { icon: Code, label: "Building", desc: "XR interaction systems", delay: 0.3 },
                                    { icon: Compass, label: "Exploring", desc: "AI in spatial environments", delay: 0.4 },
                                    { icon: Briefcase, label: "Working on", desc: "Real-world AR applications", delay: 0.5 }
                                ].map((item, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        className={`bento-tile tile-status tile-status-${idx}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                                    >
                                        <div className="status-icon-wrap">
                                            <item.icon size={22} className="status-icon" />
                                        </div>
                                        <div className="status-text-wrap">
                                            <div className="bento-status-label">{item.label}</div>
                                            <div className="bento-status-desc">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
 
            <section id="projects" className="acc-projects-section">
                <div className="acc-section-header">
                    <motion.h2 
                        className="section-main-title"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        Selected <span className="accent-gradient-text">Works</span>
                    </motion.h2>
                </div>
                
                <div className="acc-projects-container">
                    {PROJECTS_DATA.map((project, i) => (
                        <AccordionProjectCard 
                            key={project.id} 
                            project={project} 
                            index={i} 
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                        />
                    ))}
                </div>
            </section>
 
            <section id="skills" className="capabilities-section">
                <motion.div 
                    className="carousel-section-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                >
                    <h2 className="section-main-title">What I <span className="accent-gradient-text">Build</span></h2>
                </motion.div>
                <CapabilitiesShowcase />
            </section>
 
            <MatterPhysicsEngine />
 
            <section className="resume-strip-section">
                <motion.div 
                    className="resume-strip"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                >
                    <div className="resume-strip-text">
                        <h3>
                            <span style={{ display: "block" }}>WANT TO KNOW MORE</span>
                            <span style={{ display: "block" }}>ABOUT MY WORK?</span>
                        </h3>
                        <p>Download my detailed resume for more information.</p>
                    </div>
                    <a href="/Sujal_Resume(XR).pdf" download className="resume-download-btn">
                        <FileText size={20} />
                        <span>Download Resume</span>
                        <div className="download-icon-wrap"><Download size={14} /></div>
                    </a>
                </motion.div>
            </section>
 
            <footer id="contact" ref={footerRef} className="pro-footer" onMouseMove={handleMouseMove}>
                <motion.div className="footer-mouse-glow" style={{ left: mouseX, top: mouseY }} />
                <div className="footer-content">
                    <div className="footer-top">
                        <motion.h2 
                            className="footer-big-title" 
                            initial={{ opacity: 0, y: 40 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 1.1, ease: "easeOut" }} 
                        >
                            Ready to Build <br/>
                            <span className="footer-accent-text">The Next Reality?</span>
                        </motion.h2>
                        <motion.a href="mailto:vanshsg12@gmail.com" className="footer-cta-magnetic" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Drop an Email <div className="cta-arrow"><ArrowRight size={20} /></div>
                        </motion.a>
                    </div>
                    <div className="footer-bottom">
                        <motion.div 
                            className="footer-brand"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="footer-logo">SUJAL GUPTA</h3>
                            <p className="footer-tagline">Spatial & Experience Design</p>
                        </motion.div>
                        <motion.div 
                            className="footer-socials"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <a href="https://linkedin.com/in/sujal-gupta-2a7b14251/" target="_blank" rel="noopener noreferrer" className="footer-social-link">LinkedIn</a>
                            <a href="https://github.com/Avrsxvr" target="_blank" rel="noopener noreferrer" className="footer-social-link">Github</a>
                            <a href="https://instagram.com/sujalg_12" target="_blank" rel="noopener noreferrer" className="footer-social-link">Instagram</a>
                            <a href="https://wa.me/917987911292" target="_blank" rel="noopener noreferrer" className="footer-social-link">WhatsApp</a>
                        </motion.div>
                        <motion.div 
                            className="footer-info"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <span className="copyright">© 2026 All Rights Reserved</span>
                            <span className="location">Based in India</span>
                        </motion.div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
