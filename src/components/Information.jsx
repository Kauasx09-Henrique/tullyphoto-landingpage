import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaArrowRight, 
    FaWifi, 
    FaSnowflake, 
    FaCoffee, 
    FaMusic, 
    FaStar, 
    FaLightbulb,
    FaRulerCombined, 
    FaArrowsAltV,
    FaBolt,
    FaDoorOpen
} from 'react-icons/fa'; 
import Header from './Header';
import Footer from './Footer';
import '../styles/information.css';

// IMAGENS
import imgBege from './bege.jpg';
import GentininGreen1 from './gentiam_green/green1.jpg';
import GentininGreen2 from './gentiam_green/green2.jpg';
import GentininGreen3 from './gentiam_green/green3.jpg';
import grey from './grey/grey1.jpg';
import coco from './coco/coco1.jpg';
import blue2 from './deep_blue/blue2.jpg';
import depgreen from './green/foto1.jpg';
import depgreen2 from './green/foto2.jpg';
import branco1 from './branco/foto1.jpg';
import branco2 from './branco/foto2.jpg';

import plantaBaixaImg from '/public/planta/planta_estudio.jpg'; // Certifique-se de ter essa imagem na pasta ou mude o nome

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
            desc: "Quente e autêntico. O marrom coco cria uma atmosfera sofisticada.",
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
            images: [depgreen,depgreen2
               
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
            branco1, branco2
            ]
        }
    ];

    const amenities = [
        { icon: <FaStar />, title: "Camarim Privativo", desc: "Espelho iluminado, arara e vaporizador." },
        { icon: <FaWifi />, title: "Wi-Fi 6 High Speed", desc: "Conexão de fibra para upload imediato." },
        { icon: <FaSnowflake />, title: "Climatização Total", desc: "Ambiente controlado para conforto da equipe." },
        { icon: <FaCoffee />, title: "Vetra Lounge", desc: "Café espresso, frigobar e área de descanso." },
        { icon: <FaMusic />, title: "Sistema de Som", desc: "Controle via Bluetooth para criar o mood." },
        { icon: <FaLightbulb />, title: "Acervo de Luz", desc: "Locação de equipamentos Profoto (Opcional)." },
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
                            <h2>Cenários & Acervo</h2>
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
                            Reservar Locação <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. DETALHES TÉCNICOS PAPEL */}
            <div className="info-details-section">
                <div className="details-content">
                    <div className="details-header">
                        <h2>Experiência Vetra</h2>
                        <div className="divider-gold"></div>
                        <p className="details-text">
                            Mais do que apenas cores, oferecemos uma atmosfera. Nossos fundos são curados meticulosamente
                            para elevar produções que exigem acabamento impecável.
                        </p>
                    </div>

                    <div className="specs-grid">
                        <div className="spec-item">
                            <h3>Dimensões Amplas</h3>
                            <p>Rolos profissionais de 2,70m de largura, permitindo enquadramentos de corpo inteiro.</p>
                        </div>
                        <div className="spec-item">
                            <h3>CICLORAMA - FUNDO INFINITO BRANCO</h3>
                            <p>Duas paredes brancas com curvatura contínua que ligam o chão à parede sem ângulos visíveis, criando um fundo infinito que elimina linhas, cantos e distrações.</p>
                        </div>
                        <div className="spec-item">
                            <h3>Versatilidade</h3>
                            <p>Troca ágil de fundos através de sistema de roldanas elétricas.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ARQUITETURA & PLANTA (IMAGEM) */}
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
                                    <h4>Largura aproximada:</h4>
                                    <span>6,35m</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <FaRulerCombined className="tech-icon" />
                                <div>
                                    <h4>Profundidade aproximada</h4>
                                    <span>10,73m</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <FaBolt className="tech-icon" />
                                <div>
                                    <h4>Energia</h4>
                                    <span>220v</span>
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

                    {/* FOTO DA PLANTA BAIXA */}
                    <div className="blueprint-visual">
                        <div className="floor-plan-wrapper">
                            {/* Caso a imagem não carregue, use um placeholder ou verifique o import */}
                            <img 
                                src={plantaBaixaImg} 
                                alt="Planta Baixa do Estúdio" 
                                className="blueprint-image"
                                onError={(e) => { e.target.src = "https://placehold.co/600x400/EEE/31343C?text=Foto+da+Planta"; }} 
                            />
                        </div>
                    </div>
                </div>
            </div>


            <Footer />
        </>
    );
};

export default Information;