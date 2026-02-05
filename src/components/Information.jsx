import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRulerCombined, FaBolt, FaArrowsAltV, FaDoorOpen } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import '../styles/information.css';

// Mantenha suas importações de imagens
import imgBege from './bege.jpg';
import GentininGreen1 from './gentiam_green/green1.jpg';
import GentininGreen2 from './gentiam_green/green2.jpg';
import GentininGreen3 from './gentiam_green/green3.jpg';
import grey from './grey/grey1.jpg';
import coco from './coco/coco1.jpg';
import blue2 from './deep_blue/blue2.jpg';

const Information = () => {

    const backdrops = [
        {
            id: 1,
            name: "CREME",
            hex: "#f1ddbd",
            bgHex: "#F2F0EB",
            desc: "Suave, acolhedor e sofisticado. O tom claro cria uma atmosfera leve e elegante.",
            images: [imgBege]
        },
        {
            id: 2,
            name: "COCO BROWN",
            hex: "#553e31",
            bgHex: "#EBE5DE",
            desc: "Quente e autêntico. O marrom coco cria uma atmosfera sofisticada e natural.",
            images: [coco]
        },
        {
            id: 3,
            name: "GENTIAN GREEN",
            hex: "#8da89a",
            bgHex: "#E3E8DA",
            desc: "Sofisticado e atemporal. O verde Gentian cria uma base visual elegante.",
            images: [GentininGreen1, GentininGreen2, GentininGreen3]
        },
        {
            id: 4,
            name: "DEEP GREEN",
            hex: "#1A332A",
            bgHex: "#C8D1CE",
            desc: "Profundo, elegante e contemporâneo.",
            images: [
                "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1527&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1932&auto=format&fit=crop"
            ]
        },
        {
            id: 5,
            name: "Black Onyx",
            hex: "#5c5a59",
            bgHex: "#222222",
            desc: "Sofisticação e drama. O fundo preto absorve a luz.",
            images: [grey]
        },
        {
            id: 6,
            name: "Oxford Blue",
            hex: "#385566",
            bgHex: "#D6E4F0",
            desc: "Confiança e serenidade.",
            images: [blue2]
        },
        {
            id: 7,
            name: "Branco Puro",
            hex: "#FFFFFF",
            bgHex: "#F5F5F5",
            desc: "Versatilidade e clareza. Ideal para High-Key.",
            images: [
                "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1470&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop"
            ]
        }
    ];

    const [currentBackdrop, setCurrentBackdrop] = useState(backdrops[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (currentBackdrop.images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === currentBackdrop.images.length - 1 ? 0 : prev + 1
            );
        }, 4500);
        return () => clearInterval(interval);
    }, [currentBackdrop]);

    const handleSelectBackdrop = (backdrop) => {
        if (backdrop.id === currentBackdrop.id) return;
        setCurrentBackdrop(backdrop);
        setCurrentImageIndex(0);
    };

    return (
        <>
            <Header />

            {/* 1. VISUALIZADOR DE CORES */}
            <div className="info-page" style={{ backgroundColor: currentBackdrop.bgHex }}>
                <div className="bg-watermark">{currentBackdrop.name}</div>

                <div className="visualizer-container">
                    <div className="image-stage">
                        {currentBackdrop.images.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`${currentBackdrop.name} view ${index + 1}`}
                                className={`main-photo ${index === currentImageIndex ? 'active-slide' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="glass-panel">
                        <div className="panel-header">
                            <h2>Acervo de Cores</h2>
                        </div>
                        <h1 className="color-title">{currentBackdrop.name}</h1>
                        <div className="colors-row">
                            {backdrops.map((b) => (
                                <button
                                    key={b.id}
                                    className={`color-btn ${currentBackdrop.id === b.id ? 'selected' : ''}`}
                                    style={{ backgroundColor: b.hex }}
                                    onClick={() => handleSelectBackdrop(b)}
                                    title={b.name}
                                />
                            ))}
                        </div>
                        <p className="color-desc">{currentBackdrop.desc}</p>

                        {currentBackdrop.images.length > 1 && (
                            <div className="slide-indicators">
                                {currentBackdrop.images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}

                        <Link to="/agendamento" className="action-btn">
                            Reservar Agora <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. DETALHES DO PAPEL (Branco) */}
            <div className="info-details-section">
                <div className="details-content">
                    <div className="details-header">
                        <h2>Qualidade de Estúdio</h2>
                        <div className="divider-gold"></div>
                        <p className="details-text">
                            Nossos fundos são curados meticulosamente para elevar ensaios fotográficos, 
                            editoriais de moda e produções de conteúdo.
                        </p>
                    </div>
                    <div className="specs-grid">
                        <div className="spec-item">
                            <h3>Dimensões Amplas</h3>
                            <p>Rolos profissionais de 2,70m de largura para enquadramentos de corpo inteiro.</p>
                        </div>
                        <div className="spec-item">
                            <h3>Acabamento Matte</h3>
                            <p>Papel de alta gramatura com textura fina e superfície antirreflexo.</p>
                        </div>
                        <div className="spec-item">
                            <h3>Sistema Elétrico</h3>
                            <p>Troca ágil de fundos através de sistema motorizado via controle remoto.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. NOVA SEÇÃO: FICHA TÉCNICA (Blueprint) */}
            <div className="blueprint-section">
                <div className="blueprint-container">
                    <div className="blueprint-text">
                        <h2>Layout & Dimensões</h2>
                        <div className="divider-gold"></div>
                        <p>
                            Um espaço pensado geometricamente para maximizar a luz e a profundidade de campo.
                            Ideal para lentes longas e iluminação complexa.
                        </p>
                        
                        <div className="tech-grid">
                            <div className="tech-item">
                                <FaArrowsAltV className="tech-icon" />
                                <div>
                                    <h4>Pé Direito</h4>
                                    <span>4,50 Metros</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <FaRulerCombined className="tech-icon" />
                                <div>
                                    <h4>Área Útil</h4>
                                    <span>120m² Livres</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <FaBolt className="tech-icon" />
                                <div>
                                    <h4>Energia</h4>
                                    <span>110v / 220v (Trifásico)</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <FaDoorOpen className="tech-icon" />
                                <div>
                                    <h4>Acesso</h4>
                                    <span>Porta larga (Térreo)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Representação visual da planta */}
                    <div className="blueprint-visual">
                        <div className="floor-plan-box">
                            <span className="label-area">Área de Shooting</span>
                            <span className="label-make">Camarim</span>
                            <span className="label-lounge">Lounge</span>
                            <div className="measurement-line width">10m</div>
                            <div className="measurement-line height">12m</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Information;