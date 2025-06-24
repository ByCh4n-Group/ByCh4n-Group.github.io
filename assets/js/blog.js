/**
 * Blog Page - Dynamic Blog Post Rendering
 * Filters, search, pagination, and language switching
 */

class BlogPage {
    constructor() {
        this.blogPosts = [];
        this.filteredPosts = [];
        this.categories = new Set();
        this.tags = new Set();
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.searchQuery = '';
        
        // Check if main site is loaded
        if (window.bych4nSite) {
            this.currentLanguage = window.bych4nSite.currentLanguage;
            this.init();
        } else {
            // Wait for main site to load
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.init(), 100);
            });
        }
    }

    async init() {
        try {
            await this.loadBlogPosts();
            this.processData();
            this.setupFilters();
            this.setupSearch();
            this.renderBlogPosts();
            this.renderSidebar();
            this.setupLoadMore();
        } catch (error) {
            console.error('Blog page initialization failed:', error);
        }
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('/data/blog-posts.json');
            this.blogPosts = await response.json();
            this.filteredPosts = [...this.blogPosts];
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            this.blogPosts = [];
            this.filteredPosts = [];
        }
    }

    processData() {
        // Extract categories and tags
        this.blogPosts.forEach(post => {
            if (post.categories) {
                post.categories.forEach(cat => this.categories.add(cat));
            }
            if (post.tags) {
                post.tags.forEach(tag => this.tags.add(tag));
            }
        });

        // Sort posts by date (newest first)
        this.blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.filteredPosts = [...this.blogPosts];
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.applyFilter(filter);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('blog-search');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderBlogPosts(true); // append mode
                
                // Hide button if no more posts
                const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
                if (this.currentPage >= totalPages) {
                    loadMoreBtn.style.display = 'none';
                }
            });
        }
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.blogPosts];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => 
                post.categories && post.categories.includes(this.currentFilter) ||
                post.tags && post.tags.includes(this.currentFilter)
            );
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(post => {
                const lang = this.currentLanguage || 'tr';
                const title = post.title[lang] || post.title.tr || '';
                const excerpt = post.excerpt[lang] || post.excerpt.tr || '';
                const content = post.content[lang] || post.content.tr || '';
                
                return title.toLowerCase().includes(this.searchQuery) ||
                       excerpt.toLowerCase().includes(this.searchQuery) ||
                       content.toLowerCase().includes(this.searchQuery) ||
                       (post.tags && post.tags.some(tag => 
                           tag.toLowerCase().includes(this.searchQuery)
                       ));
            });
        }

        this.filteredPosts = filtered;
        this.currentPage = 1;
        this.renderBlogPosts();
        this.updateLoadMoreButton();
    }

    renderBlogPosts(append = false) {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(
            append ? 0 : startIndex, 
            endIndex
        );

        const postsHTML = postsToShow.map(post => this.createPostHTML(post)).join('');
        
        if (append) {
            const newStartIndex = (this.currentPage - 1) * this.postsPerPage;
            const newPosts = this.filteredPosts.slice(newStartIndex, endIndex);
            container.innerHTML += newPosts.map(post => this.createPostHTML(post)).join('');
        } else {
            container.innerHTML = postsHTML;
        }

        // Animate new posts
        gsap.fromTo('.blog-card', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Show empty state if no posts
        if (this.filteredPosts.length === 0) {
            this.showEmptyState(container);
        }
    }

    createPostHTML(post) {
        const lang = this.currentLanguage || 'tr';
        const title = post.title[lang] || post.title.tr;
        const excerpt = post.excerpt[lang] || post.excerpt.tr;
        const readMoreText = lang === 'tr' ? 'Devamını Oku' : 'Read More';
        const featuredBadge = post.featured ? 
            `<div class="featured-badge">
                <i class="fas fa-star"></i>
                ${lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
            </div>` : '';

        return `
            <article class="blog-card" data-category="${(post.categories || []).join(' ')}" data-tags="${(post.tags || []).join(' ')}">
                ${featuredBadge}
                <div class="blog-image">
                    <img src="${post.image || '/assets/images/blog/default.jpg'}" 
                         alt="${title}" loading="lazy">
                    <div class="blog-overlay">
                        <a href="/blog/${post.id}.html" class="btn btn-white btn-sm">
                            ${readMoreText}
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(post.date)}
                        </span>
                        <span class="blog-author">
                            <i class="fas fa-user"></i>
                            ${post.author}
                        </span>
                        <span class="blog-read-time">
                            <i class="fas fa-clock"></i>
                            ${this.calculateReadTime(post.content[lang] || post.content.tr)} dk
                        </span>
                    </div>
                    <h3 class="blog-title">
                        <a href="/blog/${post.id}.html">${title}</a>
                    </h3>
                    <p class="blog-excerpt">${excerpt}</p>
                    <div class="blog-footer">
                        <div class="blog-tags">
                            ${(post.tags || []).slice(0, 3).map(tag => 
                                `<span class="blog-tag">#${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="blog-categories">
                            ${(post.categories || []).slice(0, 2).map(cat => 
                                `<span class="blog-category">${cat}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderSidebar() {
        this.renderCategories();
        this.renderTags();
        this.renderRecentPosts();
    }

    renderCategories() {
        const container = document.getElementById('blog-categories');
        if (!container) return;

        const categoryCounts = {};
        this.blogPosts.forEach(post => {
            if (post.categories) {
                post.categories.forEach(cat => {
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });
            }
        });

        container.innerHTML = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => `
                <li>
                    <a href="#" class="category-link" data-filter="${category}">
                        ${this.formatCategoryName(category)}
                        <span class="count">(${count})</span>
                    </a>
                </li>
            `).join('');

        // Add click events
        container.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = link.getAttribute('data-filter');
                this.applyFilter(filter);
            });
        });
    }

    renderTags() {
        const container = document.getElementById('blog-tags');
        if (!container) return;

        const tagCounts = {};
        this.blogPosts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        container.innerHTML = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20) // Show top 20 tags
            .map(([tag, count]) => `
                <span class="tag" data-filter="${tag}" style="font-size: ${Math.min(1.2, 0.8 + count * 0.1)}em">
                    #${tag}
                </span>
            `).join('');

        // Add click events
        container.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const filter = tag.getAttribute('data-filter');
                this.applyFilter(filter);
            });
        });
    }

    renderRecentPosts() {
        const container = document.getElementById('recent-posts');
        if (!container) return;

        const recentPosts = this.blogPosts.slice(0, 5);
        const lang = this.currentLanguage || 'tr';

        container.innerHTML = recentPosts.map(post => `
            <div class="recent-post">
                <div class="recent-post-image">
                    <img src="${post.image || '/assets/images/blog/default.jpg'}" 
                         alt="${post.title[lang] || post.title.tr}" loading="lazy">
                </div>
                <div class="recent-post-content">
                    <h5 class="recent-post-title">
                        <a href="/blog/${post.id}.html">
                            ${post.title[lang] || post.title.tr}
                        </a>
                    </h5>
                    <div class="recent-post-date">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(post.date)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        if (this.currentPage >= totalPages || this.filteredPosts.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    showEmptyState(container) {
        const lang = this.currentLanguage || 'tr';
        const emptyMessage = lang === 'tr' ? 
            'Aradığınız kriterlere uygun blog yazısı bulunamadı.' :
            'No blog posts found matching your criteria.';
        const resetText = lang === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters';

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="empty-title">${emptyMessage}</h3>
                <button class="btn btn-primary reset-filters-btn">
                    ${resetText}
                </button>
            </div>
        `;

        // Add reset functionality
        container.querySelector('.reset-filters-btn').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    resetFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        
        // Reset UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
        });
        
        const searchInput = document.getElementById('blog-search');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const lang = this.currentLanguage || 'tr';
        return date.toLocaleDateString(
            lang === 'tr' ? 'tr-TR' : 'en-US', 
            options
        );
    }

    formatCategoryName(category) {
        const categoryNames = {
            'tr': {
                'web-development': 'Web Geliştirme',
                'javascript': 'JavaScript',
                'python': 'Python',
                'tutorial': 'Eğitim',
                'open-source': 'Açık Kaynak'
            },
            'en': {
                'web-development': 'Web Development',
                'javascript': 'JavaScript',
                'python': 'Python',
                'tutorial': 'Tutorial',
                'open-source': 'Open Source'
            }
        };
        
        const lang = this.currentLanguage || 'tr';
        return categoryNames[lang][category] || category;
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        return Math.ceil(words / wordsPerMinute);
    }
}

// Initialize blog page
document.addEventListener('DOMContentLoaded', () => {
    window.blogPage = new BlogPage();
});
