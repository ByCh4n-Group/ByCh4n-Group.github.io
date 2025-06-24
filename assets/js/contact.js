/**
 * Contact Page - Form handling and FAQ interactions
 */

class ContactPage {
    constructor() {
        this.currentLanguage = 'tr';
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupFAQ();
        this.setupStats();
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Form validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Geçerli bir e-posta adresi girin';
                }
                break;
            case 'text':
            case 'textarea':
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'Bu alan zorunludur';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Lütfen tüm zorunlu alanları doğru şekilde doldurun.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission(data);
            
            this.showFormMessage('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            form.reset();
            
        } catch (error) {
            this.showFormMessage('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% chance)
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;

        const form = document.getElementById('contact-form');
        form.insertBefore(messageElement, form.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);

        // Smooth scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherIcon.style.transform = 'rotate(0deg)';
                        
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        gsap.to(otherAnswer, {
                            height: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    icon.style.transform = 'rotate(0deg)';
                    gsap.to(answer, {
                        height: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    item.classList.add('active');
                    icon.style.transform = 'rotate(180deg)';
                    
                    // Get natural height
                    const naturalHeight = answer.scrollHeight;
                    gsap.fromTo(answer, {
                        height: 0
                    }, {
                        height: naturalHeight,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    setupStats() {
        // Animate stats when they come into view
        const statNumbers = document.querySelectorAll('.contact-stats .stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element, target) {
        gsap.to(element, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                element.textContent = Math.ceil(element.textContent);
            }
        });
    }
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});
