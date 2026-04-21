"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame, MotionValue } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Code, Compass, Briefcase, FileText, Download } from "lucide-react";

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


interface TechItem {
    label: string;
    size: number;
    mobileSize: number;
}

const OrbitItem = ({ tech, angle, rotation }: { tech: TechItem, angle: number, rotation: MotionValue<number> }) => {
    const counterRotate = useTransform(rotation, (r: number) => -(r + angle));
    return (
        <div 
            className="orbit-node"
            style={{ 
                transform: `rotate(${angle}deg) translateY(calc(-1 * var(--radius)))`,
                "--tech-size": `${tech.size}px`,
                "--tech-mobile-size": `${tech.mobileSize}px`
            } as React.CSSProperties}
        >
            <motion.div className="orbit-item-anim" style={{ rotate: counterRotate }}>
                <div className="orbit-item">{tech.label}</div>
            </motion.div>
        </div>
    );
};

const OrbitalTechStack = () => {
    const techItems = [
        { label: "Unity", size: 90, mobileSize: 65 },
        { label: "WebXR", size: 100, mobileSize: 70 },
        { label: "8th Wall", size: 110, mobileSize: 80 },
        { label: "ARCore", size: 95, mobileSize: 70 },
        { label: "XR Toolkit", size: 110, mobileSize: 80 },
        { label: "Computer Vision", size: 130, mobileSize: 95 },
        { label: "C#", size: 80, mobileSize: 60 },
        { label: "Spatial AI", size: 110, mobileSize: 80 },
    ];
    const rotation = useMotionValue(0);
    const bonusVelocity = useMotionValue(0);
    const smoothBonus = useSpring(bonusVelocity, { damping: 30, stiffness: 60 });
    const [isDragging, setIsDragging] = useState(false);
    const baseSpeed = 0.2; 

    useAnimationFrame(() => {
        const currentSpeed = baseSpeed + (smoothBonus.get() * 0.15);
        rotation.set(rotation.get() + currentSpeed);
        if (!isDragging && bonusVelocity.get() !== 0) {
            bonusVelocity.set(bonusVelocity.get() * 0.95);
            if (Math.abs(bonusVelocity.get()) < 0.001) bonusVelocity.set(0);
        }
    });

    return (
        <div className="orbit-system">
            <div className="orbit-center" style={{ pointerEvents: "none", zIndex: 100 }}>XR</div>
            <motion.div 
                className="orbit-track" 
                style={{ rotate: rotation, cursor: isDragging ? "grabbing" : "grab" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                onDragStart={() => { setIsDragging(true); bonusVelocity.set(0); }}
                onDragEnd={(e, info) => { setIsDragging(false); bonusVelocity.set(info.velocity.x * 0.05); }}
                onDrag={(e, info) => { rotation.set(rotation.get() + info.delta.x * 0.4); }}
            >
                {techItems.map((tech, i) => (
                    <OrbitItem key={tech.label} tech={tech} angle={(i / techItems.length) * 360} rotation={rotation} />
                ))}
            </motion.div>
        </div>
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



const CarouselCard = ({ project }: { project: Project }) => {
    return (
        <motion.div className="carousel-project-card" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
            <div className="carousel-card-inner">
                <div className="carousel-video-bg">
                    <video src={project.video} autoPlay muted loop playsInline preload="metadata" />
                    <div className="carousel-overlay" />
                </div>
                <div className="carousel-project-id" style={{ color: "var(--accent)" }}>{project.id}</div>
                <div className="carousel-content">
                    <h3 className="carousel-title">{project.title}</h3>
                    <p className="carousel-desc">{project.desc}</p>
                    <div className="carousel-actions">
                        <a href="https://github.com/Avrsxvr" target="_blank" rel="noopener noreferrer" className="carousel-btn-main">
                            Explore <IconGithub />
                        </a>
                    </div>
                </div>
                <div className="carousel-top-border" />
            </div>
        </motion.div>
    );
};

const EXPERTISE_DATA = [
    {
        category: "XR Development",
        color: "var(--accent)",
        skills: [
            { title: "AR Applications (Unity)", desc: "Developing markerless AR applications with accurate object placement and interactive user experiences." },
            { title: "VR Interaction Systems", desc: "Building immersive VR systems with core mechanics such as object manipulation, physics-based interactions, and locomotion." },
            { title: "XR Interaction Design", desc: "Designing intuitive interaction flows that enhance usability and engagement within immersive environments." }
        ]
    },
    {
        category: "Interactive & Web",
        color: "var(--accent)",
        skills: [
            { title: "WebAR Experiences", desc: "Creating browser-based AR experiences that enable real-time placement and interaction with 3D content." },
            { title: "Interactive Configurators", desc: "Developing AR-driven configurators allowing users to customize products through dynamic color and material changes." },
            { title: "Frontend Prototyping", desc: "Rapidly building functional web interfaces and prototypes to validate ideas and interaction flows." }
        ]
    },
    {
        category: "Intelligent Systems",
        color: "var(--accent)",
        skills: [
            { title: "Computer Vision", desc: "Implementing vision-based features such as detection and tracking to enable context-aware interactions." },
            { title: "Automation Tools", desc: "Developing lightweight AI-driven tools to streamline repetitive tasks and workflows." },
            { title: "AI in XR (Exploraion)", desc: "Exploring the integration of AI within XR to create more adaptive and responsive user experiences." }
        ]
    }
];

const ExpertiseCard = ({ group }: { group: typeof EXPERTISE_DATA[0] }) => (
    <motion.div 
        className="expertise-group-card"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        <div className="expertise-header-wrap">
            <h3 className="expertise-num-tag">{group.category}</h3>
        </div>
        <div className="expertise-list">
            {group.skills.map((skill, idx) => (
                <div key={idx} className="expertise-item">
                    <h4>{skill.title}</h4>
                    <p>{skill.desc}</p>
                </div>
            ))}
        </div>
        <div className="expertise-corner-accent" />
    </motion.div>
);

export default function Home() {
    const [isClient, setIsClient] = useState(false);
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

    useEffect(() => { setIsClient(true); }, []);

    const { scrollYProgress: heroProgress } = useScroll({
        target: isClient ? (heroRef as any) : undefined,
        offset: ["start start", "end start"]
    });
    
    const smoothHero = useSpring(heroProgress, { stiffness: 180, damping: 35, mass: 0.15 });
    const scaleHero = useTransform(smoothHero, [0, 0.16], [1, 12], { clamp: true });
    const heroOpacity = useTransform(smoothHero, [0, 0.16], [1, 0], { clamp: true });
    const aboutOpacity = useTransform(smoothHero, [0.15, 0.22, 0.35, 0.45], [0, 1, 1, 0], { clamp: true });
    const aboutScale = useTransform(smoothHero, [0.15, 0.45], [0.95, 1.05], { clamp: true });
    const aboutY = useTransform(smoothHero, [0.15, 0.45], [50, -20], { clamp: true });
    const bgColor = useTransform(smoothHero, [0.35, 0.5], ["rgba(0,0,0,1)", "rgba(0,0,0,0)"], { clamp: true });
    const textOpacity = useTransform(smoothHero, [0, 0.05, 0.45, 0.55], [1, 0.2, 0.2, 1], { clamp: true });
    const panProgress = useTransform(smoothHero, [0.45, 0.78], [0, 1], { clamp: true });
    const carouselX = useTransform(panProgress, (v) => {
        // Automatically translates exactly to the inner edge of the padded window (90vw available)
        return `calc(${v * -100}% + ${v * 90}vw)`;
    });
    const navPointerEvents = useTransform(textOpacity, (v) => v > 0.1 ? "auto" : "none");
 
    if (!isClient) return <div style={{ background: "#000", minHeight: "100dvh" }} />;
 
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
 
            <section ref={heroRef} id="home" style={{ height: "500dvh", position: "relative" }}>
                <div id="projects" style={{ position: "absolute", top: "125dvh" }} />
                
                <div style={{ position: "sticky", top: 0, height: "100dvh", overflow: "hidden", backgroundColor: "#000" }}>
                    {/* LAYER 1: PROJECTS TRACK */}
                    <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <motion.div 
                            className="carousel-section-header" 
                            style={{ marginBottom: "2rem" }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, ease: "easeOut" }}
                        >
                            <h2 className="section-main-title">Selected <span style={{ color: "var(--accent)" }}>Projects</span></h2>
                        </motion.div>
                        <div className="carousel-view-port">
                            <motion.div className="carousel-track" style={{ x: carouselX }}>
                                {PROJECTS_DATA.map((project, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: i * 0.05 }}
                                        viewport={{ margin: "-50px" }}
                                    >
                                        <CarouselCard project={project} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                        <div className="carousel-hint" style={{ marginTop: "2rem" }}>
                            <ArrowLeft size={16} /> Keep scrolling down to explore <ArrowRight size={16} />
                        </div>
                    </div>
 
                    {/* LAYER 2: ZOOMING ELEMENTS */}
                    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: bgColor as any, pointerEvents: "none", perspective: "1000px" }}>
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
                                <Image src="/Gemini_Generated_Image_7577lg7577lg7577-Photoroom.png" alt="Sujal Gupta" width={220} height={220} className="hero-profile-img" priority />
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
                            <div className="about-container">
                                <div className="about-left">
                                    <div className="about-bg-graphic" aria-hidden="true" />
                                    <div style={{ width: "40px", height: "2px", background: "#fff", marginBottom: "2rem" }} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1.1, ease: "easeOut" }}
                                    >
                                        <h1 className="know-me-title">KNOW <span>ME</span></h1>
                                    </motion.div>
                                    <motion.h2 
                                        className="about-sub"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
                                    >
                                        XR Developer
                                    </motion.h2>
                                    <div className="about-loc">
                                        <MapPin size={14} /> Based in Chennai
                                    </div>
                                    <p className="about-tagline">
                                        Building XR experiences that <span>feel real.</span>
                                    </p>
                                </div>
 
                                <div className="about-right">
                                    <p className="about-main-text">
                                        I’m an <span className="accent">XR developer</span> building interactive <strong>AR/VR experiences</strong> using Unity and modern spatial technologies. I focus on creating practical, usable products that go beyond experimentation.
                                        <br/><br/>
                                        Alongside my personal projects, I collaborate on select <strong>freelance XR work</strong>, working on real-world interactive solutions. Recently, I’ve been exploring the intersection of <span className="accent">spatial computing</span> and <strong>AI</strong> to build more intuitive and adaptive experiences.
                                    </p>
 
                                    <div className="about-currently-section">
                                        <span className="about-section-label">Currently</span>
                                        <div className="status-grid">
                                            {[
                                                { icon: Code, label: "Building", desc: "XR interaction systems" },
                                                { icon: Compass, label: "Exploring", desc: "AI in spatial environments" },
                                                { icon: Briefcase, label: "Working on", desc: "Real-world AR applications" }
                                            ].map((item, idx) => (
                                                <motion.div 
                                                    key={idx} 
                                                    className="status-card"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
                                                >
                                                    <item.icon size={18} color="var(--accent)" />
                                                    <div className="status-label">{item.label}</div>
                                                    <div className="status-desc">{item.desc}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
 
            <section id="skills" className="capabilities-section">
                <motion.div 
                    className="carousel-section-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                >
                    <h2 className="section-main-title">What I <span style={{ color: "var(--accent)" }}>Build</span></h2>
                </motion.div>
                <div className="expertise-grid">
                    {EXPERTISE_DATA.map((group, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, delay: i * 0.15, ease: "easeOut" }}
                        >
                            <ExpertiseCard group={group} />
                        </motion.div>
                    ))}
                </div>
            </section>
 
            <section id="technologies" className="content-section" style={{ alignItems: "center", textAlign: "center", display: "flex", flexDirection: "column", padding: "10rem 5vw 8rem 5vw", position: "relative" }}>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    style={{ marginBottom: "5rem", zIndex: 10 }}
                >
                    <h2 
                        className="section-main-title" 
                        style={{ 
                            maxWidth: "1200px", 
                            margin: "0 auto", 
                            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
                            fontWeight: 900,
                            letterSpacing: "-0.01em",
                            lineHeight: 1
                        }}
                    >
                        CORE <span style={{ color: "var(--accent)" }}>TECHNOLOGIES</span>
                    </h2>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ width: "100%", display: "flex", justifyContent: "center" }}
                >
                    <OrbitalTechStack />
                </motion.div>
            </section>
 
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
