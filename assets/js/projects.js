/**
 * Projects Page - Project filtering, view switching, and GitHub integration
 */

class ProjectsPage {
    constructor() {
        this.currentLanguage = 'tr';
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.projects = [];
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupViewToggle();
        this.loadProjects();
        this.setupAnimations();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.applyFilter(filter);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.getAttribute('data-view');
                this.switchView(view);
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        card.style.display = 'block';
                    }
                });
            } else {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            }
        });

        // Update project count
        this.updateProjectCount();
    }

    switchView(view) {
        this.currentView = view;
        const container = document.getElementById('projects-container');
        
        if (view === 'list') {
            container.classList.add('list-view');
            container.classList.remove('grid-view');
        } else {
            container.classList.add('grid-view');
            container.classList.remove('list-view');
        }

        // Animate transition
        gsap.fromTo('.project-card', {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out'
        });
    }

    updateProjectCount() {
        const visibleProjects = document.querySelectorAll('.project-card:not([style*="display: none"])');
        const countElement = document.querySelector('.project-count');
        
        if (countElement) {
            countElement.textContent = `${visibleProjects.length} proje`;
        }
    }

    loadProjects() {
        // In a real implementation, this would fetch from an API or JSON file
        this.projects = this.getStaticProjects();
        this.renderProjects();
    }

    getStaticProjects() {
        return [
            {
                id: 'bych4n-website',
                name: 'ByCh4n Group Website',
                description: 'Modern, animasyonlu ve tamamen statik topluluk web sitesi',
                category: 'web',
                status: 'active',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
                stars: 45,
                forks: 12,
                watchers: 250,
                github: 'https://github.com/ByCh4n-Group/ByCh4n-Group.github.io',
                demo: 'https://bych4n-group.github.io',
                featured: true
            },
            {
                id: 'animation-library',
                name: 'Animation Library',
                description: 'Hafif ve performanslı CSS/JS animasyon kütüphanesi',
                category: 'library',
                status: 'active',
                tech: ['CSS', 'JavaScript', 'GSAP'],
                stars: 68,
                forks: 22,
                watchers: 450,
                github: 'https://github.com/ByCh4n-Group/animation-library',
                demo: 'https://bych4n-group.github.io/animation-library'
            },
            {
                id: 'rest-api-starter',
                name: 'REST API Starter',
                description: 'Node.js ve Express ile hazır REST API şablonu',
                category: 'api',
                status: 'development',
                tech: ['Node.js', 'Express', 'MongoDB'],
                stars: 42,
                forks: 15,
                watchers: 320,
                github: 'https://github.com/ByCh4n-Group/rest-api-starter'
            }
        ];
    }

    renderProjects() {
        // This method would dynamically render projects
        // For now, we're using static HTML, but this could be enhanced
        this.setupProjectInteractions();
    }

    setupProjectInteractions() {
        // Setup hover effects for project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Setup tech tag interactions
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.filterByTech(tag.textContent);
            });
        });

        // Setup status badge interactions
        const statusBadges = document.querySelectorAll('.status-badge');
        statusBadges.forEach(badge => {
            badge.addEventListener('click', () => {
                this.filterByStatus(badge.textContent);
            });
        });
    }

    filterByTech(tech) {
        // Filter projects by technology
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const techTags = card.querySelectorAll('.tech-tag');
            const hasTech = Array.from(techTags).some(tag => 
                tag.textContent.toLowerCase() === tech.toLowerCase()
            );
            
            if (hasTech) {
                card.style.display = 'block';
                gsap.fromTo(card, {
                    opacity: 0,
                    scale: 0.9
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                });
            } else {
                gsap.to(card, {
                    opacity: 0.3,
                    scale: 0.95,
                    duration: 0.3
                });
            }
        });

        // Show filter indicator
        this.showFilterIndicator(`Teknoloji: ${tech}`);
    }

    filterByStatus(status) {
        // Filter projects by status
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const statusBadge = card.querySelector('.status-badge');
            const cardStatus = statusBadge ? statusBadge.textContent : '';
            
            if (cardStatus === status) {
                card.style.display = 'block';
                gsap.fromTo(card, {
                    opacity: 0,
                    scale: 0.9
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                });
            } else {
                gsap.to(card, {
                    opacity: 0.3,
                    scale: 0.95,
                    duration: 0.3
                });
            }
        });

        // Show filter indicator
        this.showFilterIndicator(`Durum: ${status}`);
    }

    showFilterIndicator(text) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.filter-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'filter-indicator';
        indicator.innerHTML = `
            <span>${text}</span>
            <button class="clear-filter">
                <i class="fas fa-times"></i>
            </button>
        `;

        const container = document.querySelector('.projects-grid');
        container.parentNode.insertBefore(indicator, container);

        // Setup clear button
        indicator.querySelector('.clear-filter').addEventListener('click', () => {
            this.clearFilters();
            indicator.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 10000);
    }

    clearFilters() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.style.display = 'block';
            gsap.to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.3
            });
        });

        // Reset filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
        });

        this.currentFilter = 'all';
    }

    setupAnimations() {
        // Setup scroll-triggered animations
        gsap.registerPlugin(ScrollTrigger);

        // Animate project cards on scroll
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Animate contributing steps
        gsap.utils.toArray('.step').forEach((step, index) => {
            gsap.fromTo(step, {
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Parallax effect for featured project
        const featuredProject = document.querySelector('.featured-project');
        if (featuredProject) {
            gsap.to(featuredProject, {
                y: -50,
                scrollTrigger: {
                    trigger: featuredProject,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    // Method to fetch real GitHub data (for future enhancement)
    async fetchGitHubData(username, repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
            const data = await response.json();
            
            return {
                stars: data.stargazers_count,
                forks: data.forks_count,
                watchers: data.watchers_count,
                description: data.description,
                language: data.language,
                updated: data.updated_at
            };
        } catch (error) {
            console.error('Failed to fetch GitHub data:', error);
            return null;
        }
    }
}

// Initialize projects page
document.addEventListener('DOMContentLoaded', () => {
    window.projectsPage = new ProjectsPage();
});
