import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/videosection.css';

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="video-bg-overlay"></div>
      
      <div className="content-wrapper">
        <div className="text-content">
          <span className="subtitle">Cinematic Experience</span>
          <h2 className="gold-gradient-text">Movimento &<br/>Emoção</h2>
          <p>
           Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro excepturi necessitatibus a sapiente quibusdam sunt vero cumque aliquam cum. Iure dolorem dolores laboriosam ad quisquam accusantium temporibus harum in aliquam.
          </p>
          
          <div className="action-group">
            <Link to="/agendamento" className="btn-luxury">
              Agendar Produção
            </Link>
          </div>
        </div>

        <div className="video-showcase">
          <div className="gold-glow"></div>
          
          <div className="video-frame-glass">
            <video 
              className="the-video" 
              autoPlay 
              muted 
              loop 
              playsInline
              controls={false}
            >
              <source src="public/Videos/Video_teste.mp4" type="video/mp4" />
            </video>
            <div className="glass-reflection"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;