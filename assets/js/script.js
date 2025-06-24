// ByCh4n-Group - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Typewriter effect
    initTypewriterEffect();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Matrix background effect
    initMatrixEffect();
    
    // Glitch effects
    initGlitchEffects();
});

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Hide/show navigation on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Typewriter Effect
function initTypewriterEffect() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const messages = [
        'Welcome to ByCh4n-Group...',
        'Independent Cybersecurity Community',
        'Penetration Testing • Security Research',
        'Free Software Advocates',
        'Building a Secure Digital Future',
        'cat /etc/passwd | grep freedom',
        'sudo rm -rf /surveillance',
        'Knowledge should be free...',
        'We are ByCh4n-Group.',
        'We are independent.',
        'We are unstoppable.'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentMessage = messages[messageIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentMessage.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            typingSpeed = 500; // Pause before starting new message
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start the effect after a brief delay
    setTimeout(typeEffect, 1000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Matrix Background Effect
function initMatrixEffect() {
    const matrixContainer = document.querySelector('.matrix-bg');
    if (!matrixContainer) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    
    matrixContainer.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    
    // Initialize drops
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * -100);
    }
    
    function drawMatrix() {
        // Semi-transparent black background to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text properties
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        // Draw falling characters
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            // Reset drop when it reaches bottom or randomly
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Start animation
    setInterval(drawMatrix, 35);
}

// Glitch Effects
function initGlitchEffects() {
    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.animation = 'glitch 0.5s infinite';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.animation = '';
        });
    }
    
    // Random glitch effects on page load
    setTimeout(() => {
        const elements = document.querySelectorAll('.section-title, .project-card h3, .blog-post h3');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = 'textGlitch 0.3s ease-out';
                setTimeout(() => {
                    el.style.animation = '';
                }, 300);
            }, index * 200);
        });
    }, 2000);
}

// Terminal Commands Simulation
function simulateTerminalCommands() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    const commands = [
        { command: 'whoami', output: 'bych4n-group' },
        { command: 'pwd', output: '/home/bych4n-group' },
        { command: 'ls -la', output: 'drwxr-xr-x  projects/\ndrwxr-xr-x  research/\ndrwxr-xr-x  tools/' },
        { command: 'cat mission.txt', output: 'Advancing cybersecurity through open collaboration' },
        { command: 'ps aux | grep freedom', output: 'bych4n-group  1337  0.0  0.1  freedom is running' }
    ];
    
    let commandIndex = 0;
    
    function executeCommand() {
        if (commandIndex >= commands.length) return;
        
        const cmd = commands[commandIndex];
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `
            <span class="prompt">root@bych4n-group:~#</span>
            <span class="command">${cmd.command}</span>
        `;
        
        terminalBody.appendChild(newLine);
        
        setTimeout(() => {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-output';
            outputLine.style.color = '#00ff41';
            outputLine.style.marginLeft = '20px';
            outputLine.textContent = cmd.output;
            terminalBody.appendChild(outputLine);
            
            commandIndex++;
            setTimeout(executeCommand, 2000);
        }, 1000);
    }
    
    setTimeout(executeCommand, 3000);
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.project-card, .blog-post, .social-card, .about-content');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollAnimations, 500);
});

// Add CSS keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    @keyframes textGlitch {
        0% { 
            transform: translate(0);
            filter: hue-rotate(0deg);
        }
        10% { 
            transform: translate(-2px, -1px);
            filter: hue-rotate(90deg);
        }
        20% { 
            transform: translate(-1px, 0px);
            filter: hue-rotate(180deg);
        }
        30% { 
            transform: translate(1px, 2px);
            filter: hue-rotate(270deg);
        }
        40% { 
            transform: translate(1px, -1px);
            filter: hue-rotate(360deg);
        }
        50% { 
            transform: translate(-1px, 2px);
        }
        60% { 
            transform: translate(-1px, 1px);
        }
        70% { 
            transform: translate(0px, 1px);
        }
        80% { 
            transform: translate(1px, 0px);
        }
        90% { 
            transform: translate(1px, 2px);
        }
        100% { 
            transform: translate(0);
            filter: hue-rotate(0deg);
        }
    }
`;
document.head.appendChild(style);

// Console ASCII Art
console.log(`
██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗  ██╗███╗   ██╗      ██████╗ ██████╗  ██████╗ ██╗   ██╗██████╗ 
██╔══██╗╚██╗ ██╔╝██╔════╝██║  ██║██║  ██║████╗  ██║     ██╔════╝ ██╔══██╗██╔═══██╗██║   ██║██╔══██╗
██████╔╝ ╚████╔╝ ██║     ███████║███████║██╔██╗ ██║     ██║  ███╗██████╔╝██║   ██║██║   ██║██████╔╝
██╔══██╗  ╚██╔╝  ██║     ██╔══██║╚════██║██║╚██╗██║     ██║   ██║██╔══██╗██║   ██║██║   ██║██╔═══╝ 
██████╔╝   ██║   ╚██████╗██║  ██║     ██║██║ ╚████║     ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║     
╚═════╝    ╚═╝    ╚═════╝╚═╝  ╚═╝     ╚═╝╚═╝  ╚═══╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     

Welcome to ByCh4n-Group!
Independent Cybersecurity Community
Website: https://bych4n-group.github.io
GitHub: https://github.com/ByCh4n-Group
`);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated
        document.body.style.filter = 'hue-rotate(180deg) invert(1)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        console.log('🎮 Konami Code activated! Welcome, fellow hacker!');
        konamiCode = [];
    }
});
