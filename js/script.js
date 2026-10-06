// ========================================
// Sticky Navigation
// ========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link
    updateActiveNavLink();
    updateNavigationHeight();
});

// ========================================
// Mobile Menu Toggle
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function closeNavigation() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
}

function updateNavigationHeight() {
    const sizes = {
        '--nav-height': `${navbar.offsetHeight}px`,
        '--top-header-height': `${document.querySelector('.top-header').offsetHeight}px`,
        '--nav-menu-top': `${Math.max(0, navbar.getBoundingClientRect().bottom)}px`
    };
    Object.entries(sizes).forEach(([name, value]) => {
        if (document.documentElement.style.getPropertyValue(name) !== value) {
            document.documentElement.style.setProperty(name, value);
        }
    });
    if (window.innerWidth > 1100) closeNavigation();
}

updateNavigationHeight();
window.addEventListener('resize', updateNavigationHeight);
new ResizeObserver(updateNavigationHeight).observe(navbar);
new ResizeObserver(updateNavigationHeight).observe(document.querySelector('.top-header'));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeNavigation();
        hamburger.focus();
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    const expanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(expanded));
    hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeNavigation();
    });
});

// ========================================
// Smooth Scroll Navigation
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - navbar.offsetHeight - 16;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            history.pushState(null, null, targetId);
        }
    });
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========================================
// Video Autoplay with IntersectionObserver & Controls
// ========================================
const propertyVideo = document.getElementById('propertyVideo');
const videoPlayPause = document.getElementById('videoPlayPause');
const videoMute = document.getElementById('videoMute');
const videoVolume = document.getElementById('videoVolume');
const videoFullscreen = document.getElementById('videoFullscreen');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');

const deferredMediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target.dataset.poster) entry.target.poster = entry.target.dataset.poster;
        if (entry.target.classList.contains('contact')) entry.target.classList.add('has-background');
        deferredMediaObserver.unobserve(entry.target);
    });
}, { rootMargin: '600px' });
if (propertyVideo) deferredMediaObserver.observe(propertyVideo);
const contactSection = document.querySelector('.contact');
if (contactSection) deferredMediaObserver.observe(contactSection);

if (propertyVideo) {
    const hideUnavailableVideoControls = () => {
        propertyVideo.closest('.video-container').classList.add('video-unavailable');
        document.querySelector('.video-controls').hidden = true;
    };
    propertyVideo.addEventListener('error', hideUnavailableVideoControls);
    propertyVideo.querySelectorAll('source').forEach(source => {
        source.addEventListener('error', hideUnavailableVideoControls);
    });
    // Autoplay on scroll into view
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                propertyVideo.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            } else {
                // Don't pause when scrolling away, let user control
            }
        });
    }, {
        threshold: 0.3
    });

    videoObserver.observe(propertyVideo);

    // Play/Pause button
    if (videoPlayPause) {
        videoPlayPause.addEventListener('click', () => {
            if (propertyVideo.paused) {
                propertyVideo.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
            } else {
                propertyVideo.pause();
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            }
        });
    }

    // Update play/pause icon based on video state
    propertyVideo.addEventListener('play', () => {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'inline';
    });

    propertyVideo.addEventListener('pause', () => {
        if (playIcon) playIcon.style.display = 'inline';
        if (pauseIcon) pauseIcon.style.display = 'none';
    });

    // Mute/Unmute button
    if (videoMute) {
        videoMute.addEventListener('click', () => {
            propertyVideo.muted = !propertyVideo.muted;
            if (propertyVideo.muted) {
                if (volumeIcon) volumeIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'inline';
            } else {
                if (volumeIcon) volumeIcon.style.display = 'inline';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        });
    }

    // Volume slider
    if (videoVolume) {
        videoVolume.addEventListener('input', (e) => {
            propertyVideo.volume = e.target.value / 100;
            propertyVideo.muted = false;
            if (volumeIcon) volumeIcon.style.display = 'inline';
            if (muteIcon) muteIcon.style.display = 'none';
        });
    }

    // Fullscreen button
    if (videoFullscreen) {
        videoFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                propertyVideo.requestFullscreen().catch(err => {
                    console.log('Fullscreen error:', err);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Update fullscreen icon
    document.addEventListener('fullscreenchange', () => {
        const fullscreenIcon = videoFullscreen?.querySelector('i');
        if (fullscreenIcon) {
            if (document.fullscreenElement) {
                fullscreenIcon.className = 'fas fa-compress';
            } else {
                fullscreenIcon.className = 'fas fa-expand';
            }
        }
    });
}

// ========================================
// Floor Plan Tabs
// ========================================
const layoutTabs = document.querySelectorAll('.layout-tab');
const layoutData = {
    'a': {
        title: 'Type A',
        room: '2 Bedrooms + 2 Bathrooms',
        size: '978 sq.ft',
        image: 'assets/images/Type A.webp'
    },
    'b': {
        title: 'Type B',
        room: '3 Bedrooms + 2 Bathrooms',
        size: '936 - 981 sq.ft',
        image: 'assets/images/Type B.webp'
    },
    'c': {
        title: 'Type C',
        room: '4 Bedrooms + 3 Bathrooms',
        size: '1323 sq.ft',
        image: 'assets/images/Type C.webp'
    }
};

layoutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        layoutTabs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Get layout type
        const layoutType = tab.getAttribute('data-layout');
        const layout = layoutData[layoutType];

        if (layout) {
            // Fade out
            const layoutImage = document.getElementById('layoutImage');
            const layoutTitle = document.getElementById('layoutTitle');
            const layoutRoom = document.getElementById('layoutRoom');
            const layoutSize = document.getElementById('layoutSize');

            layoutImage.style.opacity = '0';

            setTimeout(() => {
                // Update content
                layoutTitle.textContent = layout.title;
                layoutRoom.textContent = layout.room;
                layoutSize.textContent = layout.size;
                layoutImage.src = layout.image;
                layoutImage.alt = `${layout.title} floor plan`;

                // Fade in
                setTimeout(() => {
                    layoutImage.style.opacity = '1';
                }, 50);
            }, 200);
        }
    });
});

// ========================================
// Facilities Tabs
// ========================================
const facilityTabs = document.querySelectorAll('.facility-tab');
const facilityPanels = document.querySelectorAll('.facility-panel');

function activateFacilityTab(selectedTab) {
    const selectedFacility = selectedTab.getAttribute('data-facility');
    const selectedPanel = document.querySelector(`[data-facility-panel="${selectedFacility}"]`);

    if (!selectedPanel) return;

    facilityTabs.forEach(tab => {
        const isActive = tab === selectedTab;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    facilityPanels.forEach(panel => {
        const isActive = panel === selectedPanel;
        panel.hidden = !isActive;
        panel.classList.toggle('active', isActive);

        if (isActive) {
            panel.classList.add('is-transitioning');
            window.setTimeout(() => {
                panel.classList.remove('is-transitioning');
            }, 30);
        }
    });
}

facilityTabs.forEach((tab, index) => {
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');

    tab.addEventListener('click', () => {
        activateFacilityTab(tab);
    });

    tab.addEventListener('keydown', e => {
        let nextIndex = index;

        if (e.key === 'ArrowRight') {
            nextIndex = (index + 1) % facilityTabs.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (index - 1 + facilityTabs.length) % facilityTabs.length;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = facilityTabs.length - 1;
        } else {
            return;
        }

        e.preventDefault();
        facilityTabs[nextIndex].focus();
        activateFacilityTab(facilityTabs[nextIndex]);
    });
});

document.querySelectorAll('.facility-image img').forEach(image => {
    image.addEventListener('error', () => {
        image.hidden = true;
        image.closest('.facility-image')?.classList.add('image-missing');
    });
});

// ========================================
// Gallery Carousel with Swipe Support
// ========================================
const galleryTrack = document.getElementById('galleryTrack');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
let gallerySlides = document.querySelectorAll('.gallery-slide');

let currentGallerySlide = 0;
let galleryAutoSlideInterval;
let galleryStartX = 0;
let galleryCurrentX = 0;
let galleryIsDragging = false;

// Clone first slide for smooth infinite loop
if (gallerySlides.length > 0) {
    const firstClone = gallerySlides[0].cloneNode(true);
    galleryTrack.appendChild(firstClone);
    gallerySlides = document.querySelectorAll('.gallery-slide');
}

function updateGalleryCarousel(animate = true) {
    if (animate) {
        galleryTrack.style.transition = 'transform 0.5s ease-in-out';
    } else {
        galleryTrack.style.transition = 'none';
    }
    const slideWidth = gallerySlides[0]?.offsetWidth || 0;
    galleryTrack.style.transform = `translateX(-${currentGallerySlide * slideWidth}px)`;
}

function nextGallerySlide() {
    currentGallerySlide++;
    updateGalleryCarousel();

    // If at cloned slide, jump back to first slide smoothly
    if (currentGallerySlide >= gallerySlides.length - 1) {
        setTimeout(() => {
            currentGallerySlide = 0;
            updateGalleryCarousel(false);
        }, 500);
    }
}

function prevGallerySlide() {
    if (currentGallerySlide === 0) {
        currentGallerySlide = gallerySlides.length - 1;
        updateGalleryCarousel(false);
        setTimeout(() => {
            currentGallerySlide--;
            updateGalleryCarousel();
        }, 20);
    } else {
        currentGallerySlide--;
        updateGalleryCarousel();
    }
}

function startGalleryAutoSlide() {
    clearInterval(galleryAutoSlideInterval);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    galleryAutoSlideInterval = setInterval(nextGallerySlide, 7000);
}

function stopGalleryAutoSlide() {
    clearInterval(galleryAutoSlideInterval);
}

// Touch/Swipe handlers
function handleGalleryTouchStart(e) {
    galleryStartX = e.touches ? e.touches[0].clientX : e.clientX;
    galleryCurrentX = galleryStartX;
    galleryIsDragging = true;
    stopGalleryAutoSlide();
    galleryTrack.style.transition = 'none';
}

function handleGalleryTouchMove(e) {
    if (!galleryIsDragging) return;
    galleryCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = galleryStartX - galleryCurrentX;
    const slideWidth = gallerySlides[0]?.offsetWidth || 0;
    const offset = currentGallerySlide * slideWidth + diffX;
    galleryTrack.style.transform = `translateX(-${offset}px)`;
}

function handleGalleryTouchEnd(e) {
    if (!galleryIsDragging) return;
    galleryIsDragging = false;
    const diffX = galleryStartX - galleryCurrentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            nextGallerySlide();
        } else {
            prevGallerySlide();
        }
    } else {
        updateGalleryCarousel();
    }

    startGalleryAutoSlide();
}

// Event listeners
if (galleryNext) {
    galleryNext.addEventListener('click', () => {
        nextGallerySlide();
        stopGalleryAutoSlide();
        startGalleryAutoSlide();
    });
}

if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
        prevGallerySlide();
        stopGalleryAutoSlide();
        startGalleryAutoSlide();
    });
}

// Swipe support
if (galleryTrack) {
    galleryTrack.querySelectorAll('img').forEach(image => { image.draggable = false; });
    galleryTrack.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
    galleryTrack.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
    galleryTrack.addEventListener('touchend', handleGalleryTouchEnd);
    galleryTrack.addEventListener('touchcancel', () => {
        galleryIsDragging = false;
        updateGalleryCarousel();
        startGalleryAutoSlide();
    });

    // Mouse drag support for desktop
    galleryTrack.addEventListener('mousedown', handleGalleryTouchStart);
    galleryTrack.addEventListener('mousemove', handleGalleryTouchMove);
    galleryTrack.addEventListener('mouseup', handleGalleryTouchEnd);
    galleryTrack.addEventListener('mouseleave', handleGalleryTouchEnd);
}

// Pause on hover
const galleryCarousel = document.querySelector('.gallery-carousel');
if (galleryCarousel) {
    galleryCarousel.addEventListener('mouseenter', stopGalleryAutoSlide);
    galleryCarousel.addEventListener('mouseleave', startGalleryAutoSlide);
}

// Initialize
if (galleryTrack && gallerySlides.length > 0) {
    updateGalleryCarousel();
    startGalleryAutoSlide();
}

// Update on window resize
window.addEventListener('resize', () => {
    if (galleryTrack && gallerySlides.length > 0) {
        updateGalleryCarousel(false);
    }
});


// ========================================
// Showroom Carousel with Swipe Support
// ========================================
const showroomTrack = document.getElementById('showroomTrack');
const showroomPrev = document.getElementById('showroomPrev');
const showroomNext = document.getElementById('showroomNext');
const showroomSlides = document.querySelectorAll('.showroom-slide');

let currentShowroomSlide = 0;
let showroomStartX = 0;
let showroomCurrentX = 0;
let showroomIsDragging = false;
let showroomIsAnimating = false;
let showroomAnimationTimer;

function getShowroomSlidesToShow() {
    if (window.innerWidth <= 640) {
        return 1;
    }

    if (window.innerWidth <= 1024) {
        return 2;
    }

    return 3;
}

function getShowroomSlideStep() {
    if (!showroomSlides.length) return 0;

    const slideWidth = showroomSlides[0].offsetWidth;
    const trackStyles = window.getComputedStyle(showroomTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return slideWidth + gap;
}

function updateShowroomButtons() {
    const cannotSlide = showroomSlides.length <= getShowroomSlidesToShow();

    if (showroomPrev) {
        showroomPrev.disabled = cannotSlide;
    }

    if (showroomNext) {
        showroomNext.disabled = cannotSlide;
    }
}

function updateShowroomCarousel(animate = true) {
    if (!showroomTrack || !showroomSlides.length) return;

    clearTimeout(showroomAnimationTimer);
    showroomIsAnimating = animate;
    showroomTrack.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    showroomTrack.style.transform = `translateX(-${(currentShowroomSlide + showroomSlides.length) * getShowroomSlideStep()}px)`;
    updateShowroomButtons();
    if (animate) {
        // Also settle if a hidden tab or interrupted transition emits no event.
        showroomAnimationTimer = setTimeout(finishShowroomTransition, 600);
    }
}

function finishShowroomTransition() {
    if (!showroomIsAnimating) return;
    currentShowroomSlide = (currentShowroomSlide + showroomSlides.length) % showroomSlides.length;
    // The cloned cards match the originals, so this reset is invisible.
    updateShowroomCarousel(false);
}

function nextShowroomSlide() {
    if (!showroomIsAnimating && showroomSlides.length > getShowroomSlidesToShow()) {
        currentShowroomSlide++;
        updateShowroomCarousel();
    }
}

function prevShowroomSlide() {
    if (!showroomIsAnimating && showroomSlides.length > getShowroomSlidesToShow()) {
        currentShowroomSlide--;
        updateShowroomCarousel();
    }
}

function handleShowroomTouchStart(e) {
    if (!showroomTrack || showroomIsAnimating || showroomSlides.length <= getShowroomSlidesToShow()) return;
    if (!e.touches && e.button !== 0) return;
    if (e.target.closest('button')) return;

    showroomStartX = e.touches ? e.touches[0].clientX : e.clientX;
    showroomCurrentX = showroomStartX;
    showroomIsDragging = true;
    showroomTrack.style.transition = 'none';
}

function handleShowroomTouchMove(e) {
    if (!showroomIsDragging || !showroomTrack) return;

    showroomCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = showroomStartX - showroomCurrentX;
    const offset = (currentShowroomSlide + showroomSlides.length) * getShowroomSlideStep() + diffX;
    showroomTrack.style.transform = `translateX(-${offset}px)`;
}

function handleShowroomTouchEnd() {
    if (!showroomIsDragging) return;

    showroomIsDragging = false;
    const diffX = showroomStartX - showroomCurrentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            nextShowroomSlide();
        } else {
            prevShowroomSlide();
        }
    } else {
        updateShowroomCarousel();
    }
}

function initializeShowroomCarousel() {
    if (!showroomTrack || !showroomSlides.length) return;
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    showroomSlides.forEach(slide => {
        slide.querySelectorAll('img').forEach(image => { image.draggable = false; });
        [before, after].forEach(fragment => {
            const clone = slide.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.inert = true;
            fragment.appendChild(clone);
        });
    });
    showroomTrack.prepend(before);
    showroomTrack.append(after);
    updateShowroomCarousel(false);
    showroomTrack.addEventListener('transitionend', e => {
        if (e.target === showroomTrack && e.propertyName === 'transform') finishShowroomTransition();
    });

    if (showroomNext) {
        showroomNext.addEventListener('click', nextShowroomSlide);
    }

    if (showroomPrev) {
        showroomPrev.addEventListener('click', prevShowroomSlide);
    }

    const showroomCarousel = showroomTrack.closest('.showroom-carousel');
    showroomCarousel.addEventListener('touchstart', handleShowroomTouchStart, { passive: true });
    showroomCarousel.addEventListener('touchmove', handleShowroomTouchMove, { passive: true });
    showroomCarousel.addEventListener('touchend', handleShowroomTouchEnd);
    showroomCarousel.addEventListener('touchcancel', () => {
        showroomIsDragging = false;
        updateShowroomCarousel();
    });

    showroomCarousel.addEventListener('mousedown', handleShowroomTouchStart);
    showroomCarousel.addEventListener('mousemove', handleShowroomTouchMove);
    showroomCarousel.addEventListener('mouseup', handleShowroomTouchEnd);
    showroomCarousel.addEventListener('mouseleave', handleShowroomTouchEnd);

    window.addEventListener('resize', () => {
        showroomIsDragging = false;
        currentShowroomSlide = (currentShowroomSlide + showroomSlides.length) % showroomSlides.length;
        updateShowroomCarousel(false);
    });
}

const showroomInitObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
        initializeShowroomCarousel();
        showroomInitObserver.disconnect();
    }
}, { rootMargin: '600px' });
if (showroomTrack) showroomInitObserver.observe(showroomTrack.closest('.showroom-carousel'));


// ========================================
// Testimonial Slider with Swipe Support
// ========================================
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

let testimonialSlides = [];
let currentTestimonialSlide = 0;
let testimonialAutoSlideInterval;
let slidesToShow = 2;
let transitionTime = 600;
let testimonialStartX = 0;
let testimonialCurrentX = 0;
let testimonialIsDragging = false;

// Responsive slides count
function updateSlidesToShow() {
    if (window.innerWidth <= 768) {
        slidesToShow = 1;
    } else {
        slidesToShow = 2;
    }
}

// Remove old clones & rebuild
function setupClones() {
    // Remove existing clones
    document.querySelectorAll('.testimonial-slide.clone').forEach(clone => clone.remove());

    testimonialSlides = document.querySelectorAll('.testimonial-slide:not(.clone)');

    // Clone first slides for looping
    for (let i = 0; i < slidesToShow; i++) {
        const clone = testimonialSlides[i].cloneNode(true);
        clone.classList.add('clone');
        testimonialTrack.appendChild(clone);
    }

    testimonialSlides = document.querySelectorAll('.testimonial-slide');

    // After cloning, update card heights
    setEqualTestimonialHeights();
}

// Move carousel
function updateTestimonialCarousel(animate = true) {
    if (animate) {
        testimonialTrack.style.transition = `transform ${transitionTime}ms ease-in-out`;
    } else {
        testimonialTrack.style.transition = 'none';
    }

    const slideWidth = testimonialSlides[0].offsetWidth;
    testimonialTrack.style.transform = `translateX(-${currentTestimonialSlide * slideWidth}px)`;
}

// Next slide
function nextTestimonialSlide() {
    currentTestimonialSlide++;
    updateTestimonialCarousel();

    if (currentTestimonialSlide >= testimonialSlides.length - slidesToShow) {
        setTimeout(() => {
            currentTestimonialSlide = 0;
            updateTestimonialCarousel(false);
        }, transitionTime);
    }
}

// Previous slide
function prevTestimonialSlide() {
    if (currentTestimonialSlide === 0) {
        currentTestimonialSlide = testimonialSlides.length - slidesToShow;
        updateTestimonialCarousel(false);

        setTimeout(() => {
            currentTestimonialSlide--;
            updateTestimonialCarousel();
        }, 20);
    } else {
        currentTestimonialSlide--;
        updateTestimonialCarousel();
    }
}

// Start auto-scroll every 5 seconds
function startTestimonialAutoSlide() {
    clearInterval(testimonialAutoSlideInterval);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    testimonialAutoSlideInterval = setInterval(nextTestimonialSlide, 5000); // 5 seconds
}

// Stop auto-scroll
function stopTestimonialAutoSlide() {
    clearInterval(testimonialAutoSlideInterval);
}

// ---------------------------
// Set equal heights for testimonial cards
// ---------------------------
function setEqualTestimonialHeights() {
    const cards = document.querySelectorAll('.testimonial-card');
    let maxHeight = 0;
    cards.forEach(card => card.style.height = 'auto');
    cards.forEach(card => {
        const cardHeight = card.offsetHeight;
        if (cardHeight > maxHeight) maxHeight = cardHeight;
    });
    cards.forEach(card => card.style.height = maxHeight + 'px');
}

// Touch/Swipe handlers
function handleTestimonialTouchStart(e) {
    testimonialStartX = e.touches ? e.touches[0].clientX : e.clientX;
    testimonialCurrentX = testimonialStartX;
    testimonialIsDragging = true;
    stopTestimonialAutoSlide();
    testimonialTrack.style.transition = 'none';
}

function handleTestimonialTouchMove(e) {
    if (!testimonialIsDragging) return;
    testimonialCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = testimonialStartX - testimonialCurrentX;
    const slideWidth = testimonialSlides[0]?.offsetWidth || 0;
    const offset = currentTestimonialSlide * slideWidth + diffX;
    testimonialTrack.style.transform = `translateX(-${offset}px)`;
}

function handleTestimonialTouchEnd(e) {
    if (!testimonialIsDragging) return;
    testimonialIsDragging = false;
    const diffX = testimonialStartX - testimonialCurrentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            nextTestimonialSlide();
        } else {
            prevTestimonialSlide();
        }
    } else {
        updateTestimonialCarousel();
    }

    startTestimonialAutoSlide();
}

// Initialize carousel
function initializeTestimonialCarousel() {
    if (!testimonialTrack) return;
    updateSlidesToShow();
    setupClones();
    testimonialTrack.querySelectorAll('img').forEach(image => { image.draggable = false; });
    updateTestimonialCarousel(false);
    startTestimonialAutoSlide();

    // Buttons
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => {
            nextTestimonialSlide();
            startTestimonialAutoSlide();
        });
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => {
            prevTestimonialSlide();
            startTestimonialAutoSlide();
        });
    }

    // Swipe support
    testimonialTrack.addEventListener('touchstart', handleTestimonialTouchStart, { passive: true });
    testimonialTrack.addEventListener('touchmove', handleTestimonialTouchMove, { passive: true });
    testimonialTrack.addEventListener('touchend', handleTestimonialTouchEnd);
    testimonialTrack.addEventListener('touchcancel', () => {
        testimonialIsDragging = false;
        updateTestimonialCarousel();
        startTestimonialAutoSlide();
    });

    // Mouse drag support for desktop
    testimonialTrack.addEventListener('mousedown', handleTestimonialTouchStart);
    testimonialTrack.addEventListener('mousemove', handleTestimonialTouchMove);
    testimonialTrack.addEventListener('mouseup', handleTestimonialTouchEnd);
    testimonialTrack.addEventListener('mouseleave', handleTestimonialTouchEnd);

    // Pause on hover
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('mouseenter', stopTestimonialAutoSlide);
        testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoSlide);
    }

    // Resize fix
    window.addEventListener('resize', () => {
        updateSlidesToShow();
        setupClones();
        currentTestimonialSlide = 0;
        updateTestimonialCarousel(false);
        setEqualTestimonialHeights();
    });
}

const testimonialInitObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
        initializeTestimonialCarousel();
        testimonialInitObserver.disconnect();
    }
}, { rootMargin: '600px' });
if (testimonialTrack) testimonialInitObserver.observe(testimonialTrack.closest('.testimonial-carousel'));

// Ensure equal heights on page load
window.addEventListener('load', setEqualTestimonialHeights);

// ========================================
// Form Submission
// ========================================
const enquiryForm = document.getElementById('enquiryForm');
const formMessage = document.getElementById('formMessage');

if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = enquiryForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        const formData = new FormData(enquiryForm);

        try {

            const response = await fetch(enquiryForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.textContent = 'Thank you! We will contact you shortly.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "form_submit_success"
                });

                enquiryForm.reset();

                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Network response was not OK');
            }
        } catch (error) {
            formMessage.textContent = 'There was an error submitting your form. Please try again or contact us directly.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';


            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

const ebrochureBtn = document.getElementById('ebrochureBtn');
if (ebrochureBtn) {
    // Button already has href in HTML, but we can add analytics tracking here if needed
    ebrochureBtn.addEventListener('click', () => {
        // Track click event if needed
        console.log('E-Brochure button clicked');
    });
}

// ========================================
// Scroll Animations (Fade-in on scroll)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe section headers
document.querySelectorAll('.section-header').forEach(header => {
    fadeInObserver.observe(header);
});

// Observe other elements that should fade in
document.querySelectorAll('.location-left, .about-text, .contact-card').forEach(el => {
    el.classList.add('fade-in');
    fadeInObserver.observe(el);
});

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bangsar Hill Park website loaded successfully!');

    // Update testimonial carousel on load
    if (testimonialTrack && testimonialSlides.length) {
        updateTestimonialCarousel();
    }

    // Update gallery carousel on load
    if (galleryTrack && gallerySlides.length > 0) {
        updateGalleryCarousel();
    }

    // Initialize fade-in animations
    document.querySelectorAll('.section-header').forEach(header => {
        fadeInObserver.observe(header);
    });
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (e.defaultPrevented) return;
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - navbar.offsetHeight - 16;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {

    document.body.addEventListener("click", function (e) {

        const link = e.target.closest('a[href*="wa.link"]');

        if (!link) {
            return;
        }

        // Track WhatsApp click
        window.dataLayer = window.dataLayer || [];

        const whatsappType =
            link.getAttribute("data-whatsapp-type") || "general";

        const whatsappMessage =
            link.getAttribute("data-whatsapp-message") || "";

        window.dataLayer.push({
            event: "whatsapp_click",
            whatsapp_url: link.href,
            whatsapp_type: whatsappType,
            whatsapp_message: whatsappMessage
        });

        // Open WhatsApp with the message
        if (whatsappMessage) {
            e.preventDefault();

            const whatsappUrl =
                "https://wa.me/60198995496?text=" +
                encodeURIComponent(whatsappMessage);

            window.open(whatsappUrl, "_blank");
        }

    });

});
