/**
 * Documentation Page - Dynamic Documentation Rendering
 * Multi-language syntax highlighting, search, navigation
 */

class DocsPage {
    constructor() {
        this.docs = [];
        this.filteredDocs = [];
        this.categories = new Map();
        this.currentDoc = null;
        this.searchQuery = '';
        this.tocItems = [];
        
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
            await this.loadDocs();
            this.processData();
            this.setupSearch();
            this.setupSidebar();
            this.checkURLParams();
            this.renderDocs();
            this.renderSidebar();
            this.setupPrismHighlighting();
        } catch (error) {
            console.error('Docs page initialization failed:', error);
        }
    }

    async loadDocs() {
        try {
            const response = await fetch('/data/docs.json');
            this.docs = await response.json();
            this.filteredDocs = [...this.docs];
        } catch (error) {
            console.error('Failed to load documentation:', error);
            this.docs = [];
            this.filteredDocs = [];
        }
    }

    processData() {
        // Process categories and sort docs
        this.docs.forEach(doc => {
            const lang = this.currentLanguage || 'tr';
            const category = doc.category[lang] || doc.category.tr;
            
            if (!this.categories.has(category)) {
                this.categories.set(category, []);
            }
            this.categories.get(category).push(doc);
        });

        // Sort docs by order within categories
        this.categories.forEach((docs, category) => {
            docs.sort((a, b) => (a.order || 999) - (b.order || 999));
        });

        // Sort docs overall
        this.docs.sort((a, b) => (a.order || 999) - (b.order || 999));
        this.filteredDocs = [...this.docs];
    }

    setupSearch() {
        const searchInput = document.getElementById('docs-search');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applySearch();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applySearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applySearch();
            });
        }
    }

    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.docs-sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.docs-sidebar');
                const toggle = document.getElementById('sidebar-toggle');
                
                if (sidebar && toggle && 
                    !sidebar.contains(e.target) && 
                    !toggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const docId = urlParams.get('doc');
        
        if (docId) {
            const doc = this.docs.find(d => d.id === docId);
            if (doc) {
                this.showDocument(doc);
            }
        }
    }

    applySearch() {
        if (!this.searchQuery) {
            this.filteredDocs = [...this.docs];
        } else {
            this.filteredDocs = this.docs.filter(doc => {
                const lang = this.currentLanguage || 'tr';
                const title = doc.title[lang] || doc.title.tr || '';
                const description = doc.description[lang] || doc.description.tr || '';
                const content = doc.content[lang] || doc.content.tr || '';
                
                return title.toLowerCase().includes(this.searchQuery) ||
                       description.toLowerCase().includes(this.searchQuery) ||
                       content.toLowerCase().includes(this.searchQuery);
            });
        }

        this.renderDocs();
        
        // Update URL without reloading
        const url = new URL(window.location);
        if (this.searchQuery) {
            url.searchParams.set('search', this.searchQuery);
        } else {
            url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url);
    }

    renderDocs() {
        const container = document.getElementById('docs-container');
        const docsGrid = document.querySelector('.docs-grid');
        const docArticle = document.getElementById('doc-article');
        
        if (!container) return;

        // Show grid view, hide single doc view
        docsGrid.style.display = 'grid';
        docArticle.style.display = 'none';

        if (this.filteredDocs.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Group docs by category for display
        const categorizedDocs = new Map();
        this.filteredDocs.forEach(doc => {
            const lang = this.currentLanguage || 'tr';
            const category = doc.category[lang] || doc.category.tr;
            
            if (!categorizedDocs.has(category)) {
                categorizedDocs.set(category, []);
            }
            categorizedDocs.get(category).push(doc);
        });

        let html = '';
        categorizedDocs.forEach((docs, category) => {
            html += `
                <div class="docs-category">
                    <h2 class="category-title">
                        <i class="fas fa-folder"></i>
                        ${category}
                    </h2>
                    <div class="docs-category-grid">
                        ${docs.map(doc => this.createDocHTML(doc)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Add click events
        container.querySelectorAll('.doc-card').forEach(card => {
            card.addEventListener('click', () => {
                const docId = card.getAttribute('data-doc-id');
                const doc = this.docs.find(d => d.id === docId);
                if (doc) {
                    this.showDocument(doc);
                }
            });
        });

        // Animate cards
        gsap.fromTo('.doc-card', {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    createDocHTML(doc) {
        const lang = this.currentLanguage || 'tr';
        const title = doc.title[lang] || doc.title.tr;
        const description = doc.description[lang] || doc.description.tr;
        const category = doc.category[lang] || doc.category.tr;

        return `
            <div class="doc-card" data-doc-id="${doc.id}">
                <div class="doc-icon">
                    <i class="${doc.icon || 'fas fa-file-alt'}"></i>
                </div>
                <div class="doc-content">
                    <h3 class="doc-title">${title}</h3>
                    <p class="doc-description">${description}</p>
                    <div class="doc-meta">
                        <span class="doc-category">${category}</span>
                        <span class="doc-read-time">
                            <i class="fas fa-clock"></i>
                            ${this.calculateReadTime(doc.content[lang] || doc.content.tr)} dk
                        </span>
                    </div>
                </div>
                <div class="doc-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    }

    showDocument(doc) {
        this.currentDoc = doc;
        const lang = this.currentLanguage || 'tr';
        
        // Hide grid, show single doc
        const docsGrid = document.querySelector('.docs-grid');
        const docArticle = document.getElementById('doc-article');
        
        docsGrid.style.display = 'none';
        docArticle.style.display = 'block';

        // Update document content
        this.renderDocumentContent(doc);
        this.setupDocumentNavigation(doc);
        this.updateURL(doc.id);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update sidebar active state
        this.updateSidebarActiveState(doc);
    }

    renderDocumentContent(doc) {
        const lang = this.currentLanguage || 'tr';
        const title = doc.title[lang] || doc.title.tr;
        const category = doc.category[lang] || doc.category.tr;
        const content = doc.content[lang] || doc.content.tr;
        
        // Update header
        document.querySelector('.current-doc-category').textContent = category;
        document.querySelector('.doc-title').textContent = title;
        document.querySelector('.doc-category').textContent = category;
        
        // Update content
        const contentArea = document.getElementById('doc-content-area');
        contentArea.innerHTML = this.processMarkdownContent(content);
        
        // Setup syntax highlighting
        this.setupSyntaxHighlighting(contentArea);
        
        // Generate table of contents
        this.generateTableOfContents(contentArea);
        
        // Setup copy buttons
        this.setupCopyButtons();
        
        // Setup document actions
        this.setupDocumentActions(doc);
    }

    processMarkdownContent(content) {
        // Simple markdown to HTML conversion
        // In a real implementation, you might want to use a proper markdown parser
        
        let html = content
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                const language = lang || 'text';
                return `<pre class="line-numbers"><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
            })
            
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            
            // Lists
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            
            // Fix nested elements
            .replace(/<p><h([1-6])>/g, '<h$1>')
            .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
            .replace(/<p><pre/g, '<pre')
            .replace(/<\/pre><\/p>/g, '</pre>')
            .replace(/<p><ul>/g, '<ul>')
            .replace(/<\/ul><\/p>/g, '</ul>');

        return html;
    }

    setupSyntaxHighlighting(container) {
        // Initialize Prism.js for syntax highlighting
        if (typeof Prism !== 'undefined') {
            // Add line numbers and copy buttons
            const codeBlocks = container.querySelectorAll('pre code');
            codeBlocks.forEach((block, index) => {
                // Add unique ID for copy functionality
                block.id = `code-block-${index}`;
                
                // Add copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-code-btn';
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.title = 'Kodu Kopyala';
                
                copyButton.addEventListener('click', () => {
                    this.copyCodeBlock(block);
                    this.showCopyFeedback(copyButton);
                });
                
                const pre = block.parentElement;
                pre.style.position = 'relative';
                pre.appendChild(copyButton);
            });
            
            // Highlight code
            Prism.highlightAllUnder(container);
            
            // Add language labels
            container.querySelectorAll('pre code[class*="language-"]').forEach(block => {
                const language = block.className.match(/language-(\w+)/);
                if (language) {
                    const label = document.createElement('div');
                    label.className = 'code-language-label';
                    label.textContent = this.getLanguageDisplayName(language[1]);
                    
                    const pre = block.parentElement;
                    pre.insertBefore(label, block);
                }
            });
        }
    }

    copyCodeBlock(codeBlock) {
        const text = codeBlock.textContent;
        navigator.clipboard.writeText(text).then(() => {
            console.log('Code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy code: ', err);
        });
    }

    showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#4ade80';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
        }, 2000);
    }

    getLanguageDisplayName(lang) {
        const languageNames = {
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'python': 'Python',
            'py': 'Python',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'sass': 'Sass',
            'php': 'PHP',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'csharp': 'C#',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'ruby': 'Ruby',
            'bash': 'Bash',
            'shell': 'Shell',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'yml': 'YAML',
            'sql': 'SQL',
            'markdown': 'Markdown',
            'md': 'Markdown'
        };
        
        return languageNames[lang.toLowerCase()] || lang.toUpperCase();
    }

    generateTableOfContents(container) {
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        this.tocItems = [];
        
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            this.tocItems.push({
                id: id,
                text: heading.textContent,
                level: parseInt(heading.tagName.charAt(1))
            });
        });
        
        // Update sidebar TOC if needed
        this.updateTableOfContents();
    }

    updateTableOfContents() {
        // This could be used to show a floating TOC or update sidebar
        // For now, we'll skip this implementation
    }

    setupDocumentActions(doc) {
        // Copy link button
        const copyLinkBtn = document.getElementById('copy-link-btn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const url = `${window.location.origin}/docs.html?doc=${doc.id}`;
                navigator.clipboard.writeText(url).then(() => {
                    copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı';
                    setTimeout(() => {
                        copyLinkBtn.innerHTML = '<i class="fas fa-link"></i> Linki Kopyala';
                    }, 2000);
                });
            });
        }
        
        // Print button
        const printBtn = document.getElementById('print-doc-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }

    setupDocumentNavigation(currentDoc) {
        const currentIndex = this.docs.findIndex(doc => doc.id === currentDoc.id);
        const prevDoc = currentIndex > 0 ? this.docs[currentIndex - 1] : null;
        const nextDoc = currentIndex < this.docs.length - 1 ? this.docs[currentIndex + 1] : null;
        
        const lang = this.currentLanguage || 'tr';
        
        // Previous document
        const prevDocElement = document.getElementById('prev-doc');
        if (prevDoc && prevDocElement) {
            prevDocElement.style.display = 'block';
            prevDocElement.querySelector('.nav-title').textContent = 
                prevDoc.title[lang] || prevDoc.title.tr;
            prevDocElement.onclick = () => this.showDocument(prevDoc);
        } else if (prevDocElement) {
            prevDocElement.style.display = 'none';
        }
        
        // Next document
        const nextDocElement = document.getElementById('next-doc');
        if (nextDoc && nextDocElement) {
            nextDocElement.style.display = 'block';
            nextDocElement.querySelector('.nav-title').textContent = 
                nextDoc.title[lang] || nextDoc.title.tr;
            nextDocElement.onclick = () => this.showDocument(nextDoc);
        } else if (nextDocElement) {
            nextDocElement.style.display = 'none';
        }
    }

    renderSidebar() {
        const nav = document.getElementById('docs-nav');
        if (!nav) return;

        const lang = this.currentLanguage || 'tr';
        let html = '';

        // Add back to docs link
        html += `
            <div class="nav-section">
                <a href="/docs.html" class="back-to-docs">
                    <i class="fas fa-arrow-left"></i>
                    Tüm Dökümanlar
                </a>
            </div>
        `;

        // Group by categories
        this.categories.forEach((docs, category) => {
            html += `
                <div class="nav-section">
                    <h4 class="nav-section-title">${category}</h4>
                    <ul class="nav-links">
                        ${docs.map(doc => `
                            <li>
                                <a href="#" class="nav-link" data-doc-id="${doc.id}">
                                    <i class="${doc.icon || 'fas fa-file-alt'}"></i>
                                    ${doc.title[lang] || doc.title.tr}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        nav.innerHTML = html;

        // Add click events
        nav.querySelectorAll('.nav-link[data-doc-id]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const docId = link.getAttribute('data-doc-id');
                const doc = this.docs.find(d => d.id === docId);
                if (doc) {
                    this.showDocument(doc);
                }
            });
        });
    }

    updateSidebarActiveState(activeDoc) {
        const navLinks = document.querySelectorAll('.nav-link[data-doc-id]');
        navLinks.forEach(link => {
            if (link.getAttribute('data-doc-id') === activeDoc.id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateURL(docId) {
        const url = new URL(window.location);
        url.searchParams.set('doc', docId);
        window.history.pushState({ docId }, '', url);
    }

    showEmptyState(container) {
        const lang = this.currentLanguage || 'tr';
        const emptyMessage = lang === 'tr' ? 
            'Aradığınız kriterlere uygun döküman bulunamadı.' :
            'No documentation found matching your criteria.';
        const resetText = lang === 'tr' ? 'Aramayı Temizle' : 'Clear Search';

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="empty-title">${emptyMessage}</h3>
                <button class="btn btn-primary reset-search-btn">
                    ${resetText}
                </button>
            </div>
        `;

        // Add reset functionality
        container.querySelector('.reset-search-btn').addEventListener('click', () => {
            this.resetSearch();
        });
    }

    resetSearch() {
        this.searchQuery = '';
        const searchInput = document.getElementById('docs-search');
        if (searchInput) searchInput.value = '';
        this.applySearch();
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        return Math.ceil(words / wordsPerMinute);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (window.docsPage) {
        window.docsPage.checkURLParams();
    }
});

// Initialize docs page
document.addEventListener('DOMContentLoaded', () => {
    window.docsPage = new DocsPage();
});
