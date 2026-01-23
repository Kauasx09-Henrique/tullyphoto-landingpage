import React from 'react';
import '../styles/equipe.css';

const Equipe = () => {
    const membros = [
        { id: 1, nome: "Tuly", cargo: "Fotografo", img: "/Equipe/Tully/Tully.jpg" },
        { id: 2, nome: "Felipe", cargo: "Fotografa", img: "/Equipe/Felipe/Felipe-Photo2.jpg" }, // Troquei para uma mulher para variar
        { id: 3, nome: "André Lima", cargo: "Retratos & Moda", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 4, nome: "Camila Souza", cargo: "Eventos & Casamentos", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
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