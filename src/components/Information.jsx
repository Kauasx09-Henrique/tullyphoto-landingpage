import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import '../styles/information.css';

import imgBege from './bege.jpg';
import imgBege1 from './bege1.jpg';
import GentininGreen1 from './gentiam_green/green1.jpg';
import GentininGreen2 from './gentiam_green/green2.jpg';
import GentininGreen3 from './gentiam_green/green3.jpg';
import flame from './scrarlet_flame/flame1.jpg';
import grey from './grey/grey1.jpg';
import grey2 from './grey/grey2.jpg';
import coco from './coco/coco1.jpg';
import blue1 from './deep_blue/blue1.jpg';
import blue2 from './deep_blue/blue2.jpg';

const Information = () => {

    const backdrops = [
        {
            id: 1,
            name: "CREME",
            hex: "#f1ddbd",
            bgHex: "#F2F0EB",
            desc: "Suave, acolhedor e sofisticado. O tom claro cria uma atmosfera leve e elegante, com sensação de proximidade e naturalidade.",
            images: [imgBege, imgBege1]
        },
        {
            id: 2,
            name: "COCO BROWN",
            hex: "#553e31",
            bgHex: "#EBE5DE",
            desc: "Quente e autêntico. O marrom coco cria uma atmosfera sofisticada e natural, trazendo sensação de estabilidade e proximidade.",
            images: [coco]
        },
        {
            id: 3,
            name: "GENTIAN GREEN",
            hex: "#8da89a",
            bgHex: "#E3E8DA",
            desc: "Sofisticado e atemporal. O verde Gentian cria uma base visual elegante, transmitindo equilíbrio e personalidade sem excessos.",
            images: [GentininGreen1, GentininGreen2, GentininGreen3]
        },
        {
            id: 4,
            name: "DEEP GREEN",
            hex: "#1A332A",
            bgHex: "#C8D1CE",
            desc: "Profundo, elegante e contemporâneo. O verde transmite estabilidade e conexão com o natural.",
            images: [
                "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1527&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1932&auto=format&fit=crop"
            ]
        },
        {
            id: 5,
            name: "SCARLET FLAME",
            hex: "#800404",
            bgHex: "#E8D5D5",
            desc: "Impacto e presença imediata. O vermelho traz energia, atitude e personalidade, criando imagens expressivas e cheias de força visual.",
            images: [flame]
        },
        {
            id: 6,
            name: "Black Onyx",
            hex: "#5c5a59",
            bgHex: "#222222",
            desc: "Sofisticação e drama. O fundo preto absorve a luz, criando contornos perfeitos e silhuetas marcantes.",
            images: [grey, grey2]
        },
        {
            id: 7,
            name: "Oxford Blue",
            hex: "#385566",
            bgHex: "#D6E4F0",
            desc: "Confiança e serenidade. Um azul profundo clássico que transmite autoridade corporativa.",
            images: [blue1, blue2]
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

            <div className="info-details-section">
                <div className="details-content">
                    <div className="details-header">
                        <h2>Experiência Vetra</h2>
                        <div className="divider-gold"></div>
                        <p className="details-text">
                            Mais do que apenas cores, oferecemos uma atmosfera. Nossos fundos são curados meticulosamente
                            para elevar <strong>ensaios fotográficos</strong>, editoriais de moda, retratos corporativos
                            e produções de conteúdo digital que exigem acabamento impecável.
                        </p>
                    </div>

                    <div className="specs-grid">
                        <div className="spec-item">
                            <h3>Dimensões Amplas</h3>
                            <p>
                                Rolos profissionais de 2,70m de largura, permitindo enquadramentos de corpo inteiro,
                                movimentos dinâmicos e composições em grupo com total liberdade.
                            </p>
                        </div>
                        <div className="spec-item">
                            <h3>Acabamento Matte</h3>
                            <p>
                                Papel de alta gramatura com textura fina e superfície antirreflexo.
                                Garante distribuição uniforme da luz e facilita a pós-produção e recorte.
                            </p>
                        </div>
                        <div className="spec-item">
                            <h3>Versatilidade</h3>
                            <p>
                                Projetado para atender desde a fotografia still e lookbooks até
                                retratos artísticos e headshots, adaptando-se à visão criativa do fotógrafo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Information;