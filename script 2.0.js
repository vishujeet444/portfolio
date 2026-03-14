/**
 * ===========================================
 * CINEMATIC PORTFOLIO - Enhanced JavaScript
 * ===========================================
 */

// ==========================================
// LOADER FUNCTIONALITY
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelector('.loader-text');
    
    // Check session storage for repeat visits
    if (sessionStorage.getItem('portfolioLoaded')) {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
        return;
    }
    sessionStorage.setItem('portfolioLoaded', 'true');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 3;
        if (progress > 100) progress = 100;
        
        if (loaderText) {
            loaderText.textContent = progress < 100 ? `LOADING ${progress}%` : 'READY';
        }
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    loader.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
                }
            }, 500);
        }
    }, 80);
});

// ==========================================
// GPU DETECTION FOR PERFORMANCE
// ==========================================
const isLowPower = navigator.hardwareConcurrency <= 4 || window.innerWidth < 900;
if (isLowPower) {
    document.documentElement.classList.add('low-power');
}

// ==========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Fade-in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .section-card').forEach(el => {
        fadeObserver.observe(el);
    });

    // ==========================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // PROJECT MODAL FUNCTIONALITY
    // ==========================================
    const projectItems = document.querySelectorAll('.work-item');
    const modal = document.getElementById('project-modal');
    const closeModal = document.getElementById('close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTabs = document.querySelectorAll('.modal-tabs button');

    // Project data with multiple views
    const projectData = {
        project1: {
            title: 'Architectural Visualization',
            desc: 'Photorealistic render of a modern residential complex. This project showcases advanced lighting techniques and material realism in architectural visualization. Created using Blender with custom HDRI lighting setup and procedural materials.',
            image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80',
            tools: 'Blender, Substance Painter, V-Ray',
            views: {
                beauty: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80&sepia=100'
            }
        },
        project2: {
            title: 'Product Showcase',
            desc: 'High-end product render for a luxury brand. Focus on material accuracy and studio lighting setup to highlight product details. Created with Maya and V-Ray for maximum realism.',
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
            tools: 'Maya, V-Ray, Photoshop',
            views: {
                beauty: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80&sepia=100'
            }
        },
        project3: {
            title: 'Cinematic Scene',
            desc: 'Atmospheric 3D environment created with Houdini. Features complex particle systems, procedural texturing, and volumetric lighting for a cinematic feel.',
            image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
            tools: 'Houdini, Redshift, Nuke',
            views: {
                beauty: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80&sepia=100'
            }
        },
        project4: {
            title: 'Interior Design',
            desc: 'Luxury interior visualization with emphasis on natural lighting and realistic material rendering. Features custom furniture modeling and detailed textures.',
            image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
            tools: '3ds Max, Corona Renderer, Photoshop',
            views: {
                beauty: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&sepia=100'
            }
        },
        project5: {
            title: 'Automotive Render',
            desc: 'Studio-quality automotive visualization with precise reflections and custom lighting setup using V-Ray. Features ray-traced reflections and accurate car paint materials.',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            tools: 'Maya, V-Ray, Substance Painter',
            views: {
                beauty: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&sepia=100'
            }
        },
        project6: {
            title: 'Abstract 3D',
            desc: 'Creative abstract piece exploring form and color using Cinema 4D and Octane Render. A study in organic shapes and vibrant color palettes.',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
            tools: 'Cinema 4D, Octane Render, After Effects',
            views: {
                beauty: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                wire: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&sat=-100',
                clay: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&sepia=100'
            }
        }
    };

    // Open modal on work item click
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.project;
            const data = projectData[projectId];
            
            if (data) {
                modalImage.src = data.image;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset tabs
                modalTabs.forEach(tab => tab.classList.remove('active'));
                modalTabs[0].classList.add('active');
            }
        });
    });

    // Tab switching
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            const currentProject = document.querySelector('.work-item.active')?.dataset.project || 'project1';
            const data = projectData[currentProject];
            
            if (data && data.views && data.views[type]) {
                modalImage.src = data.views[type];
            }
            
            modalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================
    // DOCK NAVIGATION BOUNCE EFFECT
    // ==========================================
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.remove('dock-bounce');
            void item.offsetWidth;
            item.classList.add('dock-bounce');
        });
    });

    // ==========================================
    // MAGNETIC BUTTONS EFFECT
    // ==========================================
    const magneticElements = document.querySelectorAll('.dock-item, .social-link, .cinematic-btn, .work-item, .skill-card, .timeline-content');
    
    magneticElements.forEach(el => {
        el.classList.add('magnetic');
        
        el.addEventListener('mousemove', (e) => {
            if (isLowPower) return;
            
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        });
    });

    // ==========================================
    // WORK ITEM HOVER EFFECTS
    // ==========================================
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('active');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        });
    });

    // ==========================================
    // SPOTLIGHT EFFECT ON CARDS
    // ==========================================
    if (!isLowPower) {
        const cards = document.querySelectorAll('.section-card, .work-item, .skill-card, .timeline-content');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // Add dynamic gradient based on mouse position
                const hue = 190 + (x / rect.width) * 40;
                card.style.setProperty('--spotlight-hue', hue);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    }

    // ==========================================
    // VIDEO PLAY ON HOVER (SHOWREEL)
    // ==========================================
    const videoContainer = document.querySelector('.video-container');
    const showreelVideo = document.querySelector('.cinematic-video');
    
    if (videoContainer && showreelVideo) {
        videoContainer.addEventListener('mouseenter', () => {
            // Only autoplay if user hasn't interacted with the video
            if (showreelVideo.paused && window.innerWidth > 768) {
                // Don't autoplay - just show play button hint
            }
        });
    }

    // ==========================================
    // SKILL METER INTERACTION
    // ==========================================
    const skillMeters = document.querySelectorAll('.skill-meter');
    
    skillMeters.forEach(meter => {
        meter.addEventListener('mouseenter', () => {
            const progress = meter.querySelector('.progress');
            const percent = meter.dataset.percent;
            
            if (progress && percent) {
                progress.style.strokeDashoffset = 314 - (314 * percent / 100);
            }
        });
        
        meter.addEventListener('mouseleave', () => {
            const progress = meter.querySelector('.progress');
            if (progress) {
                progress.style.strokeDashoffset = 314;
            }
        });
    });

    // ==========================================
    // WORKFLOW STEPS ANIMATION
    // ==========================================
    const workflowSteps = document.querySelectorAll('.workflow-step');
    workflowSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.5s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 150);
    });

    // ==========================================
    // CONTACT FORM VALIDATION
    // ==========================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // ==========================================
    // PARALLAX EFFECT ON SCROLL
    // ==========================================
    if (!isLowPower) {
        const bgGlows = document.querySelectorAll('.bg-glow');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            bgGlows.forEach((glow, index) => {
                const speed = 0.1 + (index * 0.05);
                glow.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ==========================================
    // KEYBOARD ACCESSIBILITY
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('project-modal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // ==========================================
    // REDUCE MOTION FOR ACCESSIBILITY
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.classList.add('reduce-motion');
    }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// PERFORMANCE MONITORING (Optional)
// ==========================================
if (window.performance && window.performance.mark) {
    window.performance.mark('portfolio-loaded');
    
    window.addEventListener('load', () => {
        window.performance.mark('portfolio-interactive');
        window.performance.measure('load-time', 'navigationStart', 'portfolio-loaded');
    });
}

console.log('%c🎬 Vishwajeet Kumar Portfolio', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c3D Cinematic Artist', 'color: #bf00ff; font-size: 14px;');
