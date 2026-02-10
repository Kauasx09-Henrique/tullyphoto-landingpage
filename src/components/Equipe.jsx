import React from 'react';
import '../styles/equipe.css';

const Equipe = () => {
    const membros = [
        { id: 1, nome: "Tuly", cargo: "Fotógrafa e Fundadora do Estúdio", img: "/Equipe/Tully/Tully.jpg" },
        { id: 2, nome: "Felipe", cargo: "Fotógrafo", img: "/Equipe/Felipe/Felipe-Photo2.jpg" }, // Troquei para uma mulher para variar o time, mas pode ser revertido se preferir
        { id: 3, nome: "Thiago", cargo: "Fotógrafo", img: "/Equipe/Thiago/Thiago.jpeg" },
        { id: 4, nome: "Matheus", cargo: "Fotógrafo", img: "/Equipe/Matheus/matheus.jpeg" },
    ];

    return (
        <section className="equipe-section">
            <div className="equipe-header">
                <h2 className="equipe-title">EQUIPE</h2>

                <p className="equipe-description">
                    Somos um time de especialistas apaixonados por criar narrativas visuais.
                    Unimos técnica e sensibilidade para entregar produções de alto padrão,
                    seja em retratos, editoriais de moda, campanhas publicitárias ou gastronomia.
                    No Estúdio Vetra, seu resultado é a nossa prioridade.
                </p>
            </div>

            <div className="equipe-grid">
                {membros.map((membro) => (
                    <div key={membro.id} className="member-card">
                        <img src={membro.img} alt={membro.nome} className="member-photo" />

                        <div className="member-overlay">
                            <h3 className="member-name">{membro.nome}</h3>
                            <p className="member-role">{membro.cargo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Equipe;