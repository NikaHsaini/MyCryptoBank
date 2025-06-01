/**
 * Animations et effets visuels pour Green Coin by MyCryptoBank
 * 
 * Ce fichier contient des animations avancées et des effets visuels
 * pour améliorer l'expérience utilisateur du site Green Coin.
 */

// Classe pour gérer les effets de particules
class ParticleEffect {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.options = Object.assign({
      particleCount: 80,
      colors: ['green', 'pink', 'blue'],
      minSize: 2,
      maxSize: 7,
      speed: 0.2,
      connectParticles: true,
      connectDistance: 150,
      responsive: [
        {
          breakpoint: 768,
          options: {
            particleCount: 40,
            connectDistance: 100
          }
        },
        {
          breakpoint: 425,
          options: {
            particleCount: 25,
            connectDistance: 80
          }
        }
      ]
    }, options);
    
    this.particles = [];
    this.animationFrameId = null;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.init();
  }
  
  init() {
    // Configurer le canvas
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.container.appendChild(this.canvas);
    
    // Appliquer les options responsives
    this.applyResponsiveOptions();
    
    // Créer les particules
    this.createParticles();
    
    // Démarrer l'animation
    this.animate();
    
    // Gérer le redimensionnement
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  applyResponsiveOptions() {
    if (!this.options.responsive) return;
    
    const windowWidth = window.innerWidth;
    
    for (let i = 0; i < this.options.responsive.length; i++) {
      const breakpoint = this.options.responsive[i];
      
      if (windowWidth <= breakpoint.breakpoint) {
        this.options = Object.assign({}, this.options, breakpoint.options);
        break;
      }
    }
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      const colorType = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
      let color;
      
      switch (colorType) {
        case 'green':
          color = 'rgba(138, 255, 138, 0.7)';
          break;
        case 'pink':
          color = 'rgba(255, 20, 147, 0.7)';
          break;
        case 'blue':
          color = 'rgba(30, 136, 229, 0.7)';
          break;
        default:
          color = 'rgba(255, 255, 255, 0.7)';
      }
      
      const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
      
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: size,
        color: color,
        speedX: (Math.random() - 0.5) * this.options.speed,
        speedY: (Math.random() - 0.5) * this.options.speed,
        glowSize: size * 2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Mettre à jour et dessiner les particules
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Mettre à jour la position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Rebondir sur les bords
      if (p.x < 0 || p.x > this.width) {
        p.speedX = -p.speedX;
        p.x = Math.max(0, Math.min(this.width, p.x));
      }
      
      if (p.y < 0 || p.y > this.height) {
        p.speedY = -p.speedY;
        p.y = Math.max(0, Math.min(this.height, p.y));
      }
      
      // Dessiner la lueur
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Dessiner la particule
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
    
    // Connecter les particules
    if (this.options.connectParticles) {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + 
            Math.pow(p1.y - p2.y, 2)
          );
          
          if (distance <= this.options.connectDistance) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / this.options.connectDistance})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }
  
  handleResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.applyResponsiveOptions();
    this.createParticles();
  }
  
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    window.removeEventListener('resize', this.handleResize);
  }
}

// Classe pour les effets de texte glitch
class GlitchText {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' 
      ? document.querySelectorAll(elements) 
      : elements;
    
    if (!this.elements || this.elements.length === 0) return;
    
    this.options = Object.assign({
      glitchInterval: 3000,
      glitchDuration: 500,
      minGlitches: 5,
      maxGlitches: 10
    }, options);
    
    this.originalTexts = [];
    this.intervals = [];
    
    this.init();
  }
  
  init() {
    Array.from(this.elements).forEach((element, index) => {
      // Stocker le texte original
      this.originalTexts[index] = element.textContent;
      
      // Ajouter l'attribut data-text pour les effets CSS
      element.setAttribute('data-text', this.originalTexts[index]);
      
      // Démarrer l'effet de glitch
      this.startGlitchEffect(element, index);
    });
  }
  
  startGlitchEffect(element, index) {
    this.intervals[index] = setInterval(() => {
      this.glitch(element, index);
    }, this.options.glitchInterval);
  }
  
  glitch(element, index) {
    const originalText = this.originalTexts[index];
    const numGlitches = Math.floor(Math.random() * 
      (this.options.maxGlitches - this.options.minGlitches + 1)) + 
      this.options.minGlitches;
    
    let glitchTimeout;
    let glitchCount = 0;
    
    const performGlitch = () => {
      if (glitchCount >= numGlitches) {
        element.textContent = originalText;
        return;
      }
      
      let glitchedText = '';
      
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.2) {
          // Caractères aléatoires pour le glitch
          const chars = '!<>-_\\/[]{}—=+*^?#________';
          glitchedText += chars.charAt(Math.floor(Math.random() * chars.length));
        } else {
          glitchedText += originalText.charAt(i);
        }
      }
      
      element.textContent = glitchedText;
      glitchCount++;
      
      glitchTimeout = setTimeout(performGlitch, Math.random() * 100);
    };
    
    performGlitch();
    
    // Restaurer le texte original après la durée de l'effet
    setTimeout(() => {
      clearTimeout(glitchTimeout);
      element.textContent = originalText;
    }, this.options.glitchDuration);
  }
  
  destroy() {
    this.intervals.forEach(interval => {
      clearInterval(interval);
    });
    
    Array.from(this.elements).forEach((element, index) => {
      element.textContent = this.originalTexts[index];
    });
  }
}

// Classe pour les effets de parallaxe
class Parallax {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' 
      ? document.querySelectorAll(elements) 
      : elements;
    
    if (!this.elements || this.elements.length === 0) return;
    
    this.options = Object.assign({
      speed: 0.5,
      direction: 'vertical',
      reverse: false
    }, options);
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.handleScroll(); // Appliquer immédiatement
  }
  
  handleScroll() {
    const scrollPosition = window.pageYOffset;
    
    Array.from(this.elements).forEach(element => {
      const elementPosition = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Vérifier si l'élément est visible
      if (
        elementPosition + elementHeight > scrollPosition && 
        elementPosition < scrollPosition + viewportHeight
      ) {
        const distance = scrollPosition - elementPosition;
        const speed = this.options.reverse ? -this.options.speed : this.options.speed;
        
        if (this.options.direction === 'vertical') {
          element.style.transform = `translateY(${distance * speed}px)`;
        } else {
          element.style.transform = `translateX(${distance * speed}px)`;
        }
      }
    });
  }
  
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    
    Array.from(this.elements).forEach(element => {
      element.style.transform = '';
    });
  }
}

// Classe pour les effets de néon
class NeonEffect {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' 
      ? document.querySelectorAll(elements) 
      : elements;
    
    if (!this.elements || this.elements.length === 0) return;
    
    this.options = Object.assign({
      colors: ['#8AFF8A', '#FF1493', '#1E88E5'],
      pulseInterval: 2000,
      minIntensity: 0.7,
      maxIntensity: 1
    }, options);
    
    this.intervals = [];
    
    this.init();
  }
  
  init() {
    Array.from(this.elements).forEach((element, index) => {
      // Appliquer une couleur aléatoire
      const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
      
      // Appliquer l'effet de néon
      element.style.color = color;
      element.style.textShadow = `0 0 10px ${color}`;
      
      // Démarrer l'effet de pulsation
      this.startPulseEffect(element, color, index);
    });
  }
  
  startPulseEffect(element, color, index) {
    let increasing = true;
    let intensity = this.options.minIntensity;
    
    this.intervals[index] = setInterval(() => {
      if (increasing) {
        intensity += 0.01;
        if (intensity >= this.options.maxIntensity) {
          increasing = false;
        }
      } else {
        intensity -= 0.01;
        if (intensity <= this.options.minIntensity) {
          increasing = true;
        }
      }
      
      element.style.textShadow = `0 0 ${10 * intensity}px ${color}`;
    }, 50);
  }
  
  destroy() {
    this.intervals.forEach(interval => {
      clearInterval(interval);
    });
    
    Array.from(this.elements).forEach(element => {
      element.style.color = '';
      element.style.textShadow = '';
    });
  }
}

// Classe pour les effets de hover 3D
class Hover3DEffect {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' 
      ? document.querySelectorAll(elements) 
      : elements;
    
    if (!this.elements || this.elements.length === 0) return;
    
    this.options = Object.assign({
      sensitivity: 20,
      perspective: 1000,
      layerMultiplier: 0.5,
      shadowIntensity: 0.5
    }, options);
    
    this.init();
  }
  
  init() {
    Array.from(this.elements).forEach(element => {
      // Ajouter un conteneur pour l'effet 3D
      const parent = element.parentElement;
      parent.style.perspective = `${this.options.perspective}px`;
      parent.style.transformStyle = 'preserve-3d';
      
      // Ajouter les événements
      element.addEventListener('mouseenter', this.handleMouseEnter.bind(this, element));
      element.addEventListener('mousemove', this.handleMouseMove.bind(this, element));
      element.addEventListener('mouseleave', this.handleMouseLeave.bind(this, element));
    });
  }
  
  handleMouseEnter(element, e) {
    element.style.transition = 'none';
    
    // Trouver les couches internes
    const layers = element.querySelectorAll('[data-hover-layer]');
    layers.forEach(layer => {
      layer.style.transition = 'none';
    });
  }
  
  handleMouseMove(element, e) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const percentX = (mouseX - centerX) / (rect.width / 2);
    const percentY = (mouseY - centerY) / (rect.height / 2);
    
    const tiltX = percentY * this.options.sensitivity;
    const tiltY = -percentX * this.options.sensitivity;
    
    element.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    
    // Effet d'ombre
    if (this.options.shadowIntensity > 0) {
      const shadowX = -tiltY * this.options.shadowIntensity;
      const shadowY = tiltX * this.options.shadowIntensity;
      element.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.4)`;
    }
    
    // Animer les couches internes
    const layers = element.querySelectorAll('[data-hover-layer]');
    layers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-hover-layer')) || 1;
      const translateZ = depth * this.options.layerMultiplier * 50;
      const layerTiltX = tiltX * depth * this.options.layerMultiplier;
      const layerTiltY = tiltY * depth * this.options.layerMultiplier;
      
      layer.style.transform = `translateZ(${translateZ}px) rotateX(${layerTiltX}deg) rotateY(${layerTiltY}deg)`;
    });
  }
  
  handleMouseLeave(element, e) {
    element.style.transition = 'all 0.5s ease';
    element.style.transform = 'rotateX(0) rotateY(0)';
    element.style.boxShadow = '';
    
    // Réinitialiser les couches internes
    const layers = element.querySelectorAll('[data-hover-layer]');
    layers.forEach(layer => {
      layer.style.transition = 'all 0.5s ease';
      layer.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
    });
  }
  
  destroy() {
    Array.from(this.elements).forEach(element => {
      element.removeEventListener('mouseenter', this.handleMouseEnter);
      element.removeEventListener('mousemove', this.handleMouseMove);
      element.removeEventListener('mouseleave', this.handleMouseLeave);
      
      element.style.transition = '';
      element.style.transform = '';
      element.style.boxShadow = '';
      
      const parent = element.parentElement;
      parent.style.perspective = '';
      parent.style.transformStyle = '';
      
      const layers = element.querySelectorAll('[data-hover-layer]');
      layers.forEach(layer => {
        layer.style.transition = '';
        layer.style.transform = '';
      });
    });
  }
}

// Initialisation des effets
document.addEventListener('DOMContentLoaded', function() {
  // Attendre que le loader soit terminé
  const loaderInterval = setInterval(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent && mainContent.classList.contains('visible')) {
      clearInterval(loaderInterval);
      initEffects();
    }
  }, 100);
  
  function initEffects() {
    // Effet de particules avancé
    const particleEffect = new ParticleEffect('particles-container');
    
    // Effet de glitch sur les titres
    const glitchEffect = new GlitchText('.glitch-text');
    
    // Effet de parallaxe sur certains éléments
    const parallaxEffect = new Parallax('.hexagon, .eco-stats', {
      speed: 0.2,
      direction: 'vertical'
    });
    
    // Effet néon sur les valeurs statistiques
    const neonEffect = new NeonEffect('.stat-value, .feature-value, .eco-value');
    
    // Effet 3D au survol des cartes
    const hover3DEffect = new Hover3DEffect('.ecosystem-card, .project-card');
    
    // Nettoyer les ressources lors de la fermeture de la page
    window.addEventListener('beforeunload', function() {
      particleEffect.destroy();
      glitchEffect.destroy();
      parallaxEffect.destroy();
      neonEffect.destroy();
      hover3DEffect.destroy();
    });
  }
});
