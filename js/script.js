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
});

// ========================================
// Mobile Menu Toggle
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
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
            const offsetTop = targetSection.offsetTop - 70;
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

if (propertyVideo) {
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
    '2a': {
        title: 'Type 2A',
        room: '3 Bedrooms + 2 Bathrooms',
        size: '978 sq.ft',
        image: 'assets/images/typea.avif'
    },
    '2a1': {
        title: 'Type 2A1',
        room: '2+1 Bedrooms + 2 Bathrooms',
        size: '978 sq.ft',
        image: 'assets/images/type 2A1.avif'
    },
    '2b1': {
        title: 'Type 2B1',
        room: '2 Bedrooms + 2 Bathrooms',
        size: '917 sq.ft',
        image: 'assets/images/Type 2B1.avif'
    },
    '3a': {
        title: 'Type 3A',
        room: '3 Bedrooms + 3 Bathrooms',
        size: '1,435 sq.ft',
        image: 'assets/images/Type 3A.avif'
    },
    '3b': {
        title: 'Type 3B',
        room: '3+1 Bedrooms + 3+1 Bathrooms',
        size: '1,478 sq.ft',
        image: 'assets/images/Type 3B.avif'
    },
    '3c': {
        title: 'Type 3C',
        room: '3+1 Bedrooms + 3+1 Bathrooms',
        size: '1372 sq.ft',
        image: 'assets/images/Type 3C.avif'
    },
    '1a': {
        title: 'Type 1A',
        room: '3 Bedrooms + 3 Bathrooms',
        size: '1,345 sq.ft',
        image: 'assets/images/Type1A.webp'
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
    galleryAutoSlideInterval = setInterval(nextGallerySlide, 7000);
}

function stopGalleryAutoSlide() {
    clearInterval(galleryAutoSlideInterval);
}

// Touch/Swipe handlers
function handleGalleryTouchStart(e) {
    galleryStartX = e.touches ? e.touches[0].clientX : e.clientX;
    galleryIsDragging = true;
    stopGalleryAutoSlide();
    galleryTrack.style.transition = 'none';
}

function handleGalleryTouchMove(e) {
    if (!galleryIsDragging) return;
    galleryCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = galleryStartX - galleryCurrentX;
    const slideWidth = gallerySlides[0]?.offsetWidth || 0;
    const offset = currentGallerySlide * slideWidth - diffX;
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
    galleryTrack.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
    galleryTrack.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
    galleryTrack.addEventListener('touchend', handleGalleryTouchEnd);

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
    if (window.innerWidth < 768) {
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
    testimonialIsDragging = true;
    stopTestimonialAutoSlide();
    testimonialTrack.style.transition = 'none';
}

function handleTestimonialTouchMove(e) {
    if (!testimonialIsDragging) return;
    testimonialCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = testimonialStartX - testimonialCurrentX;
    const slideWidth = testimonialSlides[0]?.offsetWidth || 0;
    const offset = currentTestimonialSlide * slideWidth - diffX;
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
if (testimonialTrack) {
    updateSlidesToShow();
    setupClones();
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
    if (testimonialTrack) {
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
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// WhatsApp Tracking + GCLID + Reference ID
// + Google Sheet
// + Different WhatsApp Click Types
// + Message Controlled From HTML
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const GOOGLE_SHEET_URL =
        "https://script.google.com/macros/s/AKfycby7-9HkktDSgMtIr21LXthCyNqAxTDuDuHU3pL7-ur-T5B573vbzYMTvX4uHBe36s_Ckg/exec";

    document.body.addEventListener("click", function (e) {

        const link = e.target.closest('a[href*="wa.link"]');

        if (link) {
            e.preventDefault();

            // ========================================
            // 1. Capture Google Ads identifiers
            // ========================================

            const urlParams = new URLSearchParams(window.location.search);

            let gclid = urlParams.get("gclid");
            let gbraid = urlParams.get("gbraid");
            let wbraid = urlParams.get("wbraid");

            if (gclid) {
                localStorage.setItem("bhp_gclid", gclid);
            } else {
                gclid = localStorage.getItem("bhp_gclid") || "";
            }

            if (gbraid) {
                localStorage.setItem("bhp_gbraid", gbraid);
            } else {
                gbraid = localStorage.getItem("bhp_gbraid") || "";
            }

            if (wbraid) {
                localStorage.setItem("bhp_wbraid", wbraid);
            } else {
                wbraid = localStorage.getItem("bhp_wbraid") || "";
            }

            // ========================================
            // 2. Generate unique BHP Reference ID
            // ========================================

            const reference =
                "BHP-" + Math.floor(10000 + Math.random() * 90000);
            // ========================================
            // 3. Click date/time
            // ========================================

            const clickDateTime = new Date().toISOString();

            // ========================================
            // 4. Get WhatsApp type + message from HTML
            // ========================================

            const whatsappType =
                link.getAttribute("data-whatsapp-type") || "general";

            const whatsappMessage =
                link.getAttribute("data-whatsapp-message") ||
                "Hi, I'm interested in Bangsar Hill Park.";

            // ========================================
            // 5. DataLayer tracking
            // ========================================

            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
                event: "whatsapp_click",
                whatsapp_url: "https://wa.me/60198995496",
                whatsapp_type: whatsappType,
                whatsapp_message: whatsappMessage,
                gclid: gclid,
                gbraid: gbraid,
                wbraid: wbraid,
                reference_id: reference
            });

            // ========================================
            // 6. Send WhatsApp click to Google Sheet
            // ========================================

            const sheetData = {
                GCLID: gclid,
                BHP_Reference: reference,
                Click_DateTime: clickDateTime,
                WhatsApp_Click: "YES",
                WhatsApp_Type: whatsappType,

                Customer_Name: "",
                Customer_Phone: "",

                Lead_Status: "New",

                // IMPORTANT:
                // Leave these blank until lead becomes Qualified
                Conversion_Name: "BHP - Qualified WhatsApp Lead",

                Currency: "MYR",

                Uploaded_to_Google_Ads: "NO"
            };

            fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(sheetData)
            }).catch(function (error) {

                console.error(
                    "Google Sheet tracking error:",
                    error
                );

            });

            // ========================================
            // 7. Create WhatsApp message
            // ========================================

            const finalMessage =
                whatsappMessage +
                "\n\nReference: " +
                reference;

            // ========================================
            // 8. Open WhatsApp
            // ========================================

            const whatsappURL =
                "https://wa.me/60198995496?text=" +
                encodeURIComponent(finalMessage);

            window.open(whatsappURL, "_blank");
        }

    });

});