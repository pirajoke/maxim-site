// ========== CUSTOM CURSOR ==========
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effects
document.querySelectorAll('a, button, .project-card, .exp-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Hide custom cursor on mobile
if ('ontouchstart' in window) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ========== NAV ==========
const nav = document.getElementById('nav');
const navMenu = document.getElementById('navMenu');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

navMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// ========== GRADIENT BORDER MOUSE TRACKING ==========
document.querySelectorAll('.gradient-border').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

// ========== CHARACTER-BY-CHARACTER REVEAL ==========
function initCharReveal() {
    document.querySelectorAll('.char-reveal').forEach(el => {
        if (el.dataset.split) return; // already split
        el.dataset.split = 'true';

        const html = el.innerHTML;
        // We need to handle HTML tags (like <span> and <br>)
        let result = '';
        let inTag = false;
        let charIndex = 0;

        for (let i = 0; i < html.length; i++) {
            if (html[i] === '<') {
                inTag = true;
                result += html[i];
            } else if (html[i] === '>') {
                inTag = false;
                result += html[i];
            } else if (inTag) {
                result += html[i];
            } else if (html[i] === ' ') {
                result += `<span class="char space" style="transition-delay: ${charIndex * 25}ms"> </span>`;
                charIndex++;
            } else {
                result += `<span class="char" style="transition-delay: ${charIndex * 25}ms">${html[i]}</span>`;
                charIndex++;
            }
        }

        el.innerHTML = result;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                el.querySelectorAll('.char').forEach(c => c.classList.add('visible'));
            },
            once: true
        });
    });
}

// ========== GSAP ANIMATIONS ==========
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
heroTl
    .from('.hero-photo', {
        x: -80,
        opacity: 0,
        duration: 1.2,
        delay: 0.2
    })
    .to('.title-word', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        delay: 0.3
    })
    .to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.6')
    .to('.hero-stats', {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.5')
    .to('.hero-tag', {
        opacity: 1,
        duration: 0.6
    }, '-=0.8');

// Background text parallax
gsap.to('.hero-bg-text', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -150,
    opacity: 0,
    scale: 1.1
});

// Counter animation
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 80%',
    onEnter: animateCounters,
    once: true
});

// Reveal text animations
gsap.utils.toArray('.reveal-text').forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });
});

// Reveal up animations (staggered)
gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out'
    });
});

// Section labels
gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from(el.querySelector('.label-line'), {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
    });
});

// Experience cards stagger
gsap.utils.toArray('.exp-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out'
    });
});

// Project cards
gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Service items
gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Language bars animation
ScrollTrigger.create({
    trigger: '.languages-block',
    start: 'top 80%',
    onEnter: () => {
        document.querySelectorAll('.lang-fill').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    },
    once: true
});

// Parallax on sections
gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
        },
        opacity: 0.3
    });
});

// Init character reveals
initCharReveal();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== LIGHTBOX ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxBadge = document.getElementById('lightboxBadge');
const lightboxTags = document.getElementById('lightboxTags');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Slideshow state
let currentSlides = [];
let currentSlideIndex = 0;

function showSlide(index) {
    const slide = currentSlides[index];
    currentSlideIndex = index;

    // Show/hide media
    if (slide.type === 'video') {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = slide.src;
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImg.style.display = 'block';
        lightboxImg.src = slide.src;
        lightboxImg.alt = slide.alt || '';
    }

    // Info
    lightboxTitle.textContent = slide.project || '';
    lightboxDesc.textContent = slide.desc || '';
    lightboxBadge.textContent = slide.badge || '';
    lightboxTags.innerHTML = '';
    if (slide.tags) {
        slide.tags.split(',').forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag.trim();
            lightboxTags.appendChild(span);
        });
    }

    // Arrows
    lightboxPrev.classList.toggle('visible', currentSlides.length > 1 && index > 0);
    lightboxNext.classList.toggle('visible', currentSlides.length > 1 && index < currentSlides.length - 1);
}

function openLightbox(slides, startIndex) {
    currentSlides = slides;
    showSlide(startIndex || 0);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Build slides from gallery images
function slidesFromGallery(gallery) {
    return Array.from(gallery.querySelectorAll('img[data-project]')).map(img => ({
        type: 'image', src: img.src, alt: img.alt,
        project: img.dataset.project, desc: img.dataset.desc,
        badge: img.dataset.badge, tags: img.dataset.tags
    }));
}

// Project cards click — build slides from card content
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        let slides = [];

        // Video card
        if (card.dataset.lightboxVideo) {
            slides.push({
                type: 'video', src: card.dataset.lightboxVideo,
                project: card.dataset.project, desc: card.dataset.desc,
                badge: card.dataset.badge, tags: card.dataset.tags
            });
        }

        // Single image card
        if (card.dataset.lightboxImg) {
            slides.push({
                type: 'image', src: card.dataset.lightboxImg, alt: card.dataset.project,
                project: card.dataset.project, desc: card.dataset.desc,
                badge: card.dataset.badge, tags: card.dataset.tags
            });
        }

        // Gallery inside card
        const gallery = card.querySelector('.exp-gallery');
        if (gallery) {
            slides = slides.concat(slidesFromGallery(gallery));
        }

        if (slides.length > 0) openLightbox(slides, 0);
    });
});

// Experience gallery images — click opens that image within its gallery context
document.querySelectorAll('.exp-card .exp-gallery img[data-project]').forEach(img => {
    img.addEventListener('click', () => {
        const gallery = img.closest('.exp-gallery');
        const slides = slidesFromGallery(gallery);
        const index = slides.findIndex(s => s.src === img.src);
        openLightbox(slides, index >= 0 ? index : 0);
    });
});

// Navigation
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSlideIndex > 0) showSlide(currentSlideIndex - 1);
});
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSlideIndex < currentSlides.length - 1) showSlide(currentSlideIndex + 1);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentSlideIndex > 0) showSlide(currentSlideIndex - 1);
    if (e.key === 'ArrowRight' && currentSlideIndex < currentSlides.length - 1) showSlide(currentSlideIndex + 1);
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxPrev.classList.remove('visible');
    lightboxNext.classList.remove('visible');
}

// ========== TILT EFFECT ON PROJECT CARDS ==========
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', (x * 3) + 'deg');
        card.style.setProperty('--tilt-y', (y * -3) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
    });
});
