import React from 'react';
import '../styles/equipe.css';

const Equipe = () => {
    const membros = [
        { id: 1, nome: "João Silva", cargo: "Direção Criativa", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 2, nome: "Ana Costa", cargo: "Fotografia Editorial", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }, // Troquei para uma mulher para variar
        { id: 3, nome: "André Lima", cargo: "Retratos & Moda", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 4, nome: "Marcos Viana", cargo: "Filmmaker", img: "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 5, nome: "Lucas Mendes", cargo: "Produção Executiva", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    ];

    return (
        <section className="equipe-section">
            <div className="equipe-header">
                {/* Título em Caixa Alta igual ao PDF "VALORES" */}
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