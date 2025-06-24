// Advanced Animation System
class AnimationSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.mouse = { x: 0, y: 0 };
    this.isInitialized = false;
  }

  // Initialize particle system
  init() {
    if (this.isInitialized) return;
    
    this.createParticleCanvas();
    this.createHeroAnimation();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initCounterAnimations();
    
    this.isInitialized = true;
  }

  // Create particle background
  createParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.resizeCanvas();
    this.createParticles();
    this.animateParticles();
    
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.min(window.innerWidth / 10, 100);
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 240 // Blue to purple range
      });
    }
  }

  animateParticles() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= dx * force * 0.01;
        particle.y -= dy * force * 0.01;
        particle.opacity = Math.min(particle.opacity + force * 0.02, 1);
      } else {
        particle.opacity = Math.max(particle.opacity - 0.01, 0.2);
      }
      
      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      
      // Connect nearby particles
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.save();
          this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
          this.ctx.strokeStyle = `hsl(${particle.hue}, 70%, 60%)`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      });
    });
    
    requestAnimationFrame(() => this.animateParticles());
  }

  // Create hero animation with Three.js
  createHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating geometric shapes
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x667eea, wireframe: true, transparent: true, opacity: 0.3 }),
      new THREE.MeshBasicMaterial({ color: 0x764ba2, wireframe: true, transparent: true, opacity: 0.3 }),
      new THREE.MeshBasicMaterial({ color: 0xf093fb, wireframe: true, transparent: true, opacity: 0.3 })
    ];
    
    const meshes = [];
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(mesh);
      meshes.push(mesh);
    }
    
    camera.position.z = 8;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 * (index + 1);
        mesh.rotation.y += 0.01 * (index + 1);
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    });
  }

  // Initialize scroll animations
  initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
      gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    // Animate post cards
    gsap.utils.toArray('.post-card').forEach((card, index) => {
      gsap.fromTo(card,
        { x: index % 2 === 0 ? -80 : 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    // Parallax effect for hero
    gsap.to('.hero-background', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Initialize hover effects
  initHoverEffects() {
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => {
        if (window.gsap) {
          gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
      });
      
      btn.addEventListener('mouseleave', (e) => {
        if (window.gsap) {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
      });
    });
    
    // Card hover effects
    document.querySelectorAll('.feature-card, .post-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        if (window.gsap) {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
      
      card.addEventListener('mouseleave', (e) => {
        if (window.gsap) {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    });
    
    // Magnetic effect for social links
    document.querySelectorAll('.social-links a').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        if (window.gsap) {
          gsap.to(link, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3
          });
        }
      });
      
      link.addEventListener('mouseleave', (e) => {
        if (window.gsap) {
          gsap.to(link, {
            x: 0,
            y: 0,
            duration: 0.3
          });
        }
      });
    });
  }

  // Initialize counter animations
  initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (Utils.isInViewport(counter)) {
          Utils.animateCounter(counter, 0, target, 2000);
          counter.removeAttribute('data-count'); // Prevent re-animation
        }
      });
    };
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-count'));
            if (target) {
              Utils.animateCounter(counter, 0, target, 2000);
              counter.removeAttribute('data-count');
              observer.unobserve(counter);
            }
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(counter => observer.observe(counter));
    } else {
      // Fallback for older browsers
      window.addEventListener('scroll', Utils.throttle(animateCounters, 100));
    }
  }

  // Text animation effects
  animateText(element, options = {}) {
    const defaults = {
      type: 'fadeInUp',
      duration: 1,
      delay: 0,
      stagger: 0.1
    };
    
    const config = { ...defaults, ...options };
    
    if (!window.gsap) return;
    
    const chars = element.textContent.split('');
    element.innerHTML = '';
    
    chars.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      element.appendChild(span);
    });
    
    const spans = element.querySelectorAll('span');
    
    switch (config.type) {
      case 'fadeInUp':
        gsap.fromTo(spans, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: config.duration,
            delay: config.delay,
            stagger: config.stagger,
            ease: 'power2.out'
          }
        );
        break;
        
      case 'slideInLeft':
        gsap.fromTo(spans,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: config.duration,
            delay: config.delay,
            stagger: config.stagger,
            ease: 'power2.out'
          }
        );
        break;
        
      case 'typewriter':
        gsap.fromTo(spans,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.05,
            delay: config.delay,
            stagger: 0.05,
            ease: 'none'
          }
        );
        break;
    }
  }

  // Morphing shapes animation
  createMorphingShapes(container) {
    if (!window.gsap) return;
    
    const shapes = ['circle', 'square', 'triangle', 'hexagon'];
    let currentShape = 0;
    
    const morphShape = () => {
      const nextShape = (currentShape + 1) % shapes.length;
      
      gsap.to(container, {
        borderRadius: nextShape === 0 ? '50%' : nextShape === 1 ? '0%' : '20%',
        rotation: `+=${90}`,
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          currentShape = nextShape;
          setTimeout(morphShape, 2000);
        }
      });
    };
    
    morphShape();
  }

  // Glitch effect
  createGlitchEffect(element, options = {}) {
    if (!window.gsap) return;
    
    const defaults = {
      duration: 0.1,
      repeat: 3,
      intensity: 10
    };
    
    const config = { ...defaults, ...options };
    
    const timeline = gsap.timeline();
    
    for (let i = 0; i < config.repeat; i++) {
      timeline
        .to(element, {
          x: Math.random() * config.intensity - config.intensity / 2,
          y: Math.random() * config.intensity - config.intensity / 2,
          skewX: Math.random() * 20 - 10,
          duration: config.duration
        })
        .to(element, {
          x: 0,
          y: 0,
          skewX: 0,
          duration: config.duration
        });
    }
    
    return timeline;
  }
}

// Initialize animation system
const animationSystem = new AnimationSystem();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => animationSystem.init(), 100);
});

// Export for global use
window.AnimationSystem = AnimationSystem;
window.animationSystem = animationSystem;
