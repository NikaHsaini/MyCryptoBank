/**
 * Main JavaScript for Green Coin by MyCryptoBank
 * 
 * Ce fichier contient toutes les fonctionnalités interactives du site Green Coin,
 * y compris les animations, le calculateur de staking, et les effets visuels.
 */

// Variables globales
let particlesArray = [];
let animationFrameId;

/**
 * Initialisation au chargement du document
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le loader
    initLoader();
    
    // Initialiser la navigation
    initNavigation();
    
    // Initialiser les événements de défilement
    initScrollEvents();
    
    // Initialiser le calculateur de staking
    initStakingCalculator();
});

/**
 * Initialise l'animation de chargement
 */
function initLoader() {
    const loaderContainer = document.getElementById('loader-container');
    const mainContent = document.getElementById('main-content');
    const loaderBarFill = document.querySelector('.loader-bar-fill');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Cacher le loader et afficher le contenu après un court délai
            setTimeout(() => {
                loaderContainer.style.opacity = '0';
                loaderContainer.style.visibility = 'hidden';
                mainContent.classList.add('visible');
                
                // Déclencher les animations pour les éléments visibles
                initParticles();
                animateProgressBars();
            }, 500);
        }
        
        loaderBarFill.style.width = `${progress}%`;
        loaderPercentage.textContent = `${Math.floor(progress)}%`;
    }, 100);
}

/**
 * Initialise la navigation et le menu mobile
 */
function initNavigation() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll pour les liens de navigation
    document.querySelectorAll('nav a, .scroll-indicator').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initialise les événements liés au défilement
 */
function initScrollEvents() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        // Effet de scroll sur le header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Mettre à jour le lien actif dans la navigation
        updateActiveNavLink();
        
        // Animation des barres de progression au défilement
        animateOnScroll();
    });
}

/**
 * Met à jour le lien actif dans la navigation en fonction de la position de défilement
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Anime les éléments au défilement
 */
function animateOnScroll() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            const targetWidth = bar.parentElement.previousElementSibling.querySelector('.progress-value').textContent;
            bar.style.width = targetWidth;
        }
    });
}

/**
 * Anime les barres de progression
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.parentElement.previousElementSibling.querySelector('.progress-value').textContent;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

/**
 * Initialise le calculateur de staking
 */
function initStakingCalculator() {
    const stakingAmount = document.getElementById('staking-amount');
    const stakingPeriod = document.getElementById('staking-period');
    
    if (!stakingAmount || !stakingPeriod) return;
    
    const amountValue = document.querySelector('.calculator-input:nth-child(1) .input-value');
    const periodValue = document.querySelector('.calculator-input:nth-child(2) .input-value');
    const monthlyReward = document.querySelector('.result-item:nth-child(1) .result-value');
    const totalReward = document.querySelector('.result-item:nth-child(2) .result-value');
    const apyValue = document.querySelector('.result-item:nth-child(3) .result-value');
    
    // Mettre à jour le calculateur lors du changement des entrées
    [stakingAmount, stakingPeriod].forEach(input => {
        input.addEventListener('input', updateCalculator);
    });
    
    // Calcul initial
    updateCalculator();
    
    /**
     * Met à jour les calculs de staking
     */
    function updateCalculator() {
        const amount = parseInt(stakingAmount.value);
        const period = parseInt(stakingPeriod.value);
        const apy = 12; // 12% APY
        
        // Mettre à jour les valeurs affichées
        amountValue.textContent = `${amount.toLocaleString()} GRC`;
        periodValue.textContent = `${period} mois`;
        
        // Calculer les récompenses
        const monthlyRewardValue = (amount * apy / 100) / 12;
        const totalRewardValue = monthlyRewardValue * period;
        
        // Mettre à jour les valeurs des résultats
        monthlyReward.textContent = `${monthlyRewardValue.toFixed(2)} USDT`;
        totalReward.textContent = `${totalRewardValue.toFixed(2)} USDT`;
        apyValue.textContent = `${apy}%`;
    }
}

/**
 * Initialise les particules d'arrière-plan
 */
function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 80;
    
    // Nettoyer les particules existantes
    container.innerHTML = '';
    particlesArray = [];
    
    // Créer de nouvelles particules
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Couleur aléatoire (vert, rose ou bleu)
        const colorRandom = Math.random();
        if (colorRandom < 0.33) {
            particle.classList.add('particle-pink');
        } else if (colorRandom < 0.66) {
            particle.classList.add('particle-blue');
        }
        
        // Taille aléatoire
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position aléatoire
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Vitesse aléatoire
        const speedX = (Math.random() - 0.5) * 0.2;
        const speedY = (Math.random() - 0.5) * 0.2;
        
        container.appendChild(particle);
        
        // Stocker les propriétés de la particule
        particlesArray.push({
            element: particle,
            posX: posX,
            posY: posY,
            speedX: speedX,
            speedY: speedY
        });
    }
    
    // Démarrer l'animation
    animateParticles();
}

/**
 * Anime les particules d'arrière-plan
 */
function animateParticles() {
    // Annuler l'animation précédente si elle existe
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Fonction d'animation
    function animate() {
        particlesArray.forEach(particle => {
            // Mettre à jour la position
            particle.posX += particle.speedX;
            particle.posY += particle.speedY;
            
            // Rebondir sur les bords
            if (particle.posX < 0 || particle.posX > 100) {
                particle.speedX = -particle.speedX;
                particle.posX = Math.max(0, Math.min(100, particle.posX));
            }
            
            if (particle.posY < 0 || particle.posY > 100) {
                particle.speedY = -particle.speedY;
                particle.posY = Math.max(0, Math.min(100, particle.posY));
            }
            
            // Appliquer la nouvelle position
            particle.element.style.left = `${particle.posX}%`;
            particle.element.style.top = `${particle.posY}%`;
        });
        
        // Continuer l'animation
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Démarrer l'animation
    animate();
}

/**
 * Gère les interactions avec les boutons
 */
function handleButtonInteractions() {
    // Bouton de connexion wallet
    const connectButton = document.querySelector('.btn-connect');
    if (connectButton) {
        connectButton.addEventListener('click', function() {
            alert('Fonctionnalité de connexion wallet en développement.');
        });
    }
    
    // Boutons d'achat de tokens
    const buyButtons = document.querySelectorAll('.btn-primary');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Acheter')) {
                alert('Fonctionnalité d\'achat de tokens en développement.');
            } else if (this.textContent.includes('Commencer le staking')) {
                document.querySelector('#staking .staking-calculator').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Bouton d'exploration du whitepaper
    const whitePaperButton = document.querySelector('.btn-secondary');
    if (whitePaperButton) {
        whitePaperButton.addEventListener('click', function() {
            alert('Le whitepaper sera disponible prochainement.');
        });
    }
}

/**
 * Initialise le formulaire de newsletter
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.newsletter-input');
            if (emailInput.value.trim() !== '') {
                alert(`Merci de vous être abonné avec l'adresse : ${emailInput.value}`);
                emailInput.value = '';
            } else {
                alert('Veuillez entrer une adresse email valide.');
            }
        });
    }
}

// Initialiser les interactions avec les boutons et le formulaire de newsletter
document.addEventListener('DOMContentLoaded', function() {
    handleButtonInteractions();
    initNewsletterForm();
});

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Réinitialiser les particules lors du redimensionnement pour une meilleure performance
    if (window.innerWidth < 768) {
        // Moins de particules sur mobile
        particlesArray = [];
        initParticles();
    }
});

// Nettoyer les ressources lors de la fermeture de la page
window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
