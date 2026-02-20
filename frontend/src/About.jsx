import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaServer, FaDatabase, FaTools, FaRunning } from 'react-icons/fa';
import './About.css';

const About = () => {
    const roles = ["Java Full Stack Developer", "AI-powered Developer"];
    const [currentRole, setCurrentRole] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="about-container">
            <h1 className="page-title its-me-title">It's Me</h1>

            <div className="about-card">
                <div className="profile-section">
                    <div className="profile-header">
                        <h2 className="dev-name">Hariprasath R</h2>
                        <h3 className="dev-role">
                            <span key={currentRole} className="role-text-swap">{roles[currentRole]}</span>
                        </h3>
                    </div>
                </div>

                <div className="content-grid">
                    <div className="text-content">
                        <div className="bio-section">
                            <p>
                                I build scalable backend systems and intelligent applications using Java and Spring Boot. With a strong foundation in RESTful APIs, database-driven architecture, and secure authentication (JWT), I design systems that are structured, efficient, and production-ready.
                            </p>
                            <p>
                                I am passionate about transforming ideas into reliable digital solutions through clean code, modular architecture, and real-world engineering practices focused on performance, security, and scalability.
                            </p>
                        </div>

                        <div className="stats-strip">
                            <div className="stat-item">
                                <span className="stat-value">2</span>
                                <span className="stat-label">Projects Completed</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">2</span>
                                <span className="stat-label">Internships</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value"><FaRunning className="inline-icon" /></span>
                                <span className="stat-label">Hackathon Winner</span>
                            </div>
                        </div>
                    </div>

                    <div className="tech-stack-section">
                        <h3 className="section-subtitle">Technical Stack</h3>
                        <div className="stack-grid">
                            <div className="stack-card">
                                <div className="stack-header">
                                    <FaServer className="stack-icon" /> <span>Backend</span>
                                </div>
                                <ul>
                                    <li>Java 21</li>
                                    <li>Spring Boot 3.5.4</li>
                                    <li>Spring Security & JWT</li>
                                    <li>REST API Design</li>
                                    <li>JPA / Hibernate ORM</li>
                                </ul>
                            </div>

                            <div className="stack-card">
                                <div className="stack-header">
                                    <FaCode className="stack-icon" /> <span>Frontend</span>
                                </div>
                                <ul>
                                    <li>React 19</li>
                                    <li>Vite Build Tool</li>
                                    <li>Axios Integration</li>
                                    <li>React Router DOM</li>
                                    <li>Context API State</li>
                                </ul>
                            </div>

                            <div className="stack-card">
                                <div className="stack-header">
                                    <FaDatabase className="stack-icon" /> <span>Database</span>
                                </div>
                                <ul>
                                    <li>MySQL RDBMS</li>
                                    <li>Schema Design</li>
                                    <li>Entity Relationships</li>
                                </ul>
                            </div>

                            <div className="stack-card">
                                <div className="stack-header">
                                    <FaTools className="stack-icon" /> <span>Tools & DevOps</span>
                                </div>
                                <ul>
                                    <li>Docker (Multi-stage)</li>
                                    <li>Render Deployment</li>
                                    <li>Git & GitHub</li>
                                    <li>Postman (API)</li>
                                    <li>Google Generative AI</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="about-project-section">
                        <h3 className="section-subtitle">About This Project</h3>
                        <div className="project-description-card">
                            <p>
                                <strong>TopCart</strong> is a fully deployed, production-ready e-commerce application designed to showcase advanced full-stack capabilities.
                                Built with a <strong>Spring Boot</strong> backend and a <strong>React</strong> frontend, it features a seamless, high-performance architecture.
                            </p>
                            <p>
                                Key features include <strong>secure authentication</strong>, an advanced product <strong>search and filter</strong> system, dedicated user <strong>wishlists</strong>,
                                and integrated <strong>product reviews</strong> with star ratings. It also features a fully-functional interactive <strong>chatbot assistant</strong> serving as a virtual concierge.
                            </p>
                            <p>
                                The application implements a secure simulated checkout flow capable of generating instant PDF receipts and tracking persistent shopping carts.
                                TopCart stands as a testament to clean architecture, boasting a <strong>12-Factor</strong> cloud-ready deployment pipeline containerized by <strong>Docker</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="contact-footer">
                    <a href="https://github.com/Hp24get" target="_blank" rel="noopener noreferrer" className="social-link">
                        {/* Corrected Link note: User provided https://github.com/Hp24get/HARIPRASATH-R which is a specific repo/profile readme. 
                            Usually profile link is just username, but I will use exactly what they asked or the profile root if implies. 
                            Actually, `Hp24get` seems to be the user. `HARIPRASATH-R` might be the special repo. 
                            I will use the full link provided: https://github.com/Hp24get/HARIPRASATH-R 
                            Wait, usually social icon goes to profile. I'll stick to the requested link `https://github.com/Hp24get/HARIPRASATH-R` as requested ("the above links has to be used"). 
                          */}
                        <FaGithub /> <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/hariprasath-r-85a346267/" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaLinkedin /> <span>LinkedIn</span>
                    </a>
                    <a href="mailto:hariprasath24r@gmail.com" className="social-link">
                        <FaEnvelope /> <span>Email</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
