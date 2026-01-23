import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import '../styles/information.css';

const Information = () => {

    const backdrops = [
        {
            id: 1,
            name: "White Studio",
            hex: "#FFFFFF",
            bgHex: "#EAEAEA",
            desc: "A pureza do branco. Essencial para e-commerce, high-key e minimalismo. O fundo infinito branco reflete luz máxima.",
            images: [
                "/fundos/Bege.jpg",
                "/fundos/Bege1.jpg"
            ]
        },
        {
            id: 2,
            name: "Black Onyx",
            hex: "#111111",
            bgHex: "#222222",
            desc: "Sofisticação e drama. O fundo preto absorve a luz, criando contornos perfeitos e silhuetas marcantes.",
            images: [
                "/fundos/Black1.jpg",
                "/fundos/Black2.jpg"
            ]
        },
        {
            id: 3,
            name: "Bege Vetra",
            hex: "#E8DCCA",
            bgHex: "#F5F0E6",
            desc: "Nossa assinatura. Um tom quente que traz naturalidade à pele. Perfeito para retratos orgânicos.",
            images: [
                "https://images.unsplash.com/photo-1611558709796-ca5687958862?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=1895&auto=format&fit=crop"
            ]
        },
        {
            id: 4,
            name: "Oxford Blue",
            hex: "#2c3e50",
            bgHex: "#D6E4F0",
            desc: "Confiança e serenidade. Um azul profundo clássico que transmite autoridade corporativa.",
            images: [
                "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1727&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1935&auto=format&fit=crop"
            ]
        },
        {
            id: 5,
            name: "Terracota",
            hex: "#A0522D",
            bgHex: "#EEDCCA",
            desc: "Energia da terra. Tons quentes que adicionam vida, vibração e um toque de outono à composição.",
            images: [
                "/fundos/Marrom_1.jpg",
                "/fundos/Marrom_2.jpg"
            ]
        },
        {
            id: 6,
            name: "Olive Green",
            hex: "#556B2F",
            bgHex: "#E3E8DA",
            desc: "Conexão com a natureza. Um verde sóbrio e chique, escolha excelente para marcas de sustentabilidade.",
            images: [
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
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
                                    aria-label={`Selecionar cor ${b.name}`}
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
                                        aria-label={`Ir para foto ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        <Link to="/agendamento" className="action-btn">
                            Reservar Este Fundo <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Information;