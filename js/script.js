"use strict";

/*==================================================
    SCRIPT.JS
    Muhammad Kumail Noor Portfolio

    FEATURES
    1.  Global Setup & DOM Cache, (done) 
    2.  Page Loader, (done)
    3.  Mobile Navigation
    4.  Typing Effect
    5.  Scroll Progress
    6.  Header Scroll Effect
    7.  Active Navigation
    8.  Reveal Animations
    9.  Project Sliders
    11. Custom Cursor
    12. Back To Top
    13. Dynamic Footer Year
    14. Toast System
    15. Final Initialization
==================================================*/


/*====================
    1. GLOBAL SETUP & DOM CACHE
====================*/

const DOM = {

    /*-------------------- GLOBAL --------------------*/

    body: document.body,

    html: document.documentElement,


    /*-------------------- HEADER --------------------*/

    header:
        document.querySelector(".header"),


    /*-------------------- NAVIGATION --------------------*/

    nav:
        document.querySelector(".nav"),

    navToggle:
        document.getElementById("menu-btn"),

    navMenu:
        document.getElementById("navbar"),

    navLinks:
        document.querySelectorAll(
            "#navbar .nav-link"
        ),


    /*-------------------- PAGE LOADER --------------------*/

    loader:
        document.getElementById("loader") ||
        document.querySelector(".page-loader") ||
        document.getElementById("page-loader"),


    /*-------------------- TYPING EFFECT --------------------*/

    typing:
        document.getElementById("typing"),


    /*-------------------- SCROLL PROGRESS --------------------*/

    scrollProgress:
        document.getElementById("progress-bar"),


    /*-------------------- BACK TO TOP --------------------*/

    backToTop:
        document.getElementById("back-to-top"),


    /*-------------------- TOAST --------------------*/

    toastContainer:
        document.getElementById("toast-container"),


    /*-------------------- SECTIONS --------------------*/

    sections:
        document.querySelectorAll(
            "main section[id]"
        ),


    /*-------------------- FOOTER YEAR --------------------*/

    footerYear:
        document.getElementById("year"),


    /*-------------------- PROJECTS --------------------*/

    projectCards:
        document.querySelectorAll(
            ".project-card"
        ),


    /*-------------------- PROJECT SLIDER BUTTONS --------------------*/

    sliderButtons:
        document.querySelectorAll(
            ".slider-btn, .project-slider-btn"
        )

};


/*==================== GLOBAL STATE ====================*/

const STATE = {

    mobileMenuOpen: false,

    currentSection: "",

    typingIndex: 0,

    typingCharacterIndex: 0,

    typingDeleting: false,

    typingTimer: null,

    revealObserver: null,

    cursorEnabled: false

};
/*==================== 2. PAGE LOADER ====================*/

function initPageLoader() {

    if (!DOM.loader) return;


    /*==================== PROGRESS ELEMENTS ====================*/

    const progressFill =
        DOM.loader.querySelector(
            ".loader-progress-fill"
        );

    const progressText =
        DOM.loader.querySelector(
            ".loader-progress-text"
        );


    /*==================== PROGRESS STATE ====================*/

    let progress = 0;

    let progressInterval;


    /*==================== UPDATE PROGRESS ====================*/

    const updateProgress = (value) => {

        progress = Math.min(
            Math.max(value, 0),
            100
        );


        if (progressFill) {

            progressFill.style.width =
                `${progress}%`;

        }


        if (progressText) {

            progressText.textContent =
                `${Math.round(progress)}%`;

        }

    };


    /*==================== INITIAL PROGRESS ====================*/

    updateProgress(0);


    /*==================== SIMULATED LOADING ====================*/

    progressInterval = setInterval(() => {

        if (progress < 30) {

            updateProgress(
                progress + 2
            );

        }

        else if (progress < 60) {

            updateProgress(
                progress + 1
            );

        }

        else if (progress < 80) {

            updateProgress(
                progress + 0.5
            );

        }

        else if (progress < 90) {

            updateProgress(
                progress + 0.2
            );

        }

    }, 45);


    /*==================== HIDE LOADER ====================*/

    const hideLoader = () => {

        clearInterval(
            progressInterval
        );


        /*------------------------ Finish progress ------------------------*/

        updateProgress(100);


        /*------------------------ Small delay so 100% is visible ------------------------*/

        setTimeout(() => {


            /*-------------------- Hide loader --------------------*/

            DOM.loader.classList.add(
                "hidden"
            );


            /*-------------------- Remove loading state --------------------*/

            DOM.body.classList.remove(
                "loading"
            );


            /*-------------------- Start hero animation --------------------*/

            requestAnimationFrame(() => {

                DOM.body.classList.add(
                    "hero-loaded"
                );

            });


            /*-------------------- Accessibility --------------------*/

            setTimeout(() => {

                if (DOM.loader) {

                    DOM.loader.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }

            }, 700);


        }, 250);

    };


    /*==================== PAGE ALREADY LOADED ====================*/

    if (
        document.readyState ===
        "complete"
    ) {

        hideLoader();

    }


    /*==================== WAIT FOR PAGE LOAD ====================*/

    else {

        window.addEventListener(
            "load",
            hideLoader,
            { once: true }
        );

    }

}

/*==================== 3. MOBILE NAVIGATION ====================*/

function closeMobileMenu() {

    if (!DOM.navMenu) return;

    DOM.navMenu.classList.remove(
        "active",
        "open",
        "show"
    );

    if (DOM.navToggle) {

        DOM.navToggle.classList.remove(
            "active",
            "open"
        );

        DOM.navToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    STATE.mobileMenuOpen = false;

    DOM.body.classList.remove(
        "menu-open"
    );

}


function openMobileMenu() {

    if (!DOM.navMenu) return;

    DOM.navMenu.classList.add("active");

    if (DOM.navToggle) {

        DOM.navToggle.classList.add("active");

        DOM.navToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    STATE.mobileMenuOpen = true;

    DOM.body.classList.add(
        "menu-open"
    );

}


function toggleMobileMenu() {

    if (STATE.mobileMenuOpen) {

        closeMobileMenu();

    } else {

        openMobileMenu();

    }

}


function initMobileNavigation() {

    if (DOM.navToggle) {

        DOM.navToggle.addEventListener(
            "click",
            toggleMobileMenu
        );

    }


    /* Close menu when navigation link is clicked */

    DOM.navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu();

            }
        );

    });


    /* Close menu when clicking outside */

    document.addEventListener(
        "click",
        event => {

            if (!STATE.mobileMenuOpen) return;

            if (
                DOM.navMenu &&
                DOM.navToggle &&
                !DOM.navMenu.contains(event.target) &&
                !DOM.navToggle.contains(event.target)
            ) {

                closeMobileMenu();

            }

        }
    );


    /* Close menu with Escape */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        }
    );


    /* Reset mobile menu when returning to desktop */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 768) {

                closeMobileMenu();

            }

        },
        { passive: true }
    );

}

/*==================== 4. TYPING EFFECT ====================*/

function initTypingEffect() {

    if (!DOM.typing) {
        console.warn("Typing element #typing not found.");
        return;
    }

    const words = [
        "Frontend Developer",
        "Web Developer",
        "React Developer",
        "Future Full Stack Developer"
    ];

    const typingSpeed = 100;
    const deletingSpeed = 60;
    const pauseAfterTyping = 1800;
    const pauseAfterDeleting = 400;

    function type() {

        const currentWord =
            words[STATE.typingIndex];

        if (!STATE.typingDeleting) {

            STATE.typingCharacterIndex++;

            DOM.typing.textContent =
                currentWord.substring(
                    0,
                    STATE.typingCharacterIndex
                );

            if (
                STATE.typingCharacterIndex >=
                currentWord.length
            ) {

                STATE.typingDeleting = true;

                STATE.typingTimer = setTimeout(
                    type,
                    pauseAfterTyping
                );

                return;
            }

            STATE.typingTimer = setTimeout(
                type,
                typingSpeed
            );

        } else {

            STATE.typingCharacterIndex--;

            DOM.typing.textContent =
                currentWord.substring(
                    0,
                    STATE.typingCharacterIndex
                );

            if (
                STATE.typingCharacterIndex <= 0
            ) {

                STATE.typingDeleting = false;

                STATE.typingIndex =
                    (STATE.typingIndex + 1) %
                    words.length;

                STATE.typingTimer = setTimeout(
                    type,
                    pauseAfterDeleting
                );

                return;
            }

            STATE.typingTimer = setTimeout(
                type,
                deletingSpeed
            );
        }
    }

    type();
}

/*==================== 5. SCROLL PROGRESS ====================*/

function updateScrollProgress() {

    if (!DOM.scrollProgress) return;


    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (documentHeight <= 0) {

        DOM.scrollProgress.style.width = "0%";

        return;

    }


    const progress =
        (scrollTop / documentHeight) * 100;


    DOM.scrollProgress.style.width =
        `${Math.min(Math.max(progress, 0), 100)}%`;

}


function initScrollProgress() {

    updateScrollProgress();

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateScrollProgress,
        { passive: true }
    );

}

/*==================== 6. HEADER SCROLL EFFECT ====================*/

function updateHeader() {

    if (!DOM.header) return;


    if (window.scrollY > 50) {

        DOM.header.classList.add(
            "scrolled"
        );

    } else {

        DOM.header.classList.remove(
            "scrolled"
        );

    }

}

function initHeaderScroll() {

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}

/*==================== 7. ACTIVE NAVIGATION ====================*/

function updateActiveNavigation() {

    if (
        !DOM.navLinks.length ||
        !DOM.sections.length
    ) {

        return;

    }


    const scrollPosition =
        window.scrollY + 180;


    let currentSection = "";


    DOM.sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;


        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection =
                section.id;

        }

    });


    /*
        If user reaches the bottom of the page,
        activate the final section.
    */

    const pageBottom =
        window.scrollY +
        window.innerHeight;


    const documentBottom =
        document.documentElement.scrollHeight;


    if (
        pageBottom >=
        documentBottom - 10
    ) {

        const lastSection =
            DOM.sections[
            DOM.sections.length - 1
            ];

        if (lastSection) {

            currentSection =
                lastSection.id;

        }

    }


    STATE.currentSection =
        currentSection;


    DOM.navLinks.forEach(link => {

        const href =
            link.getAttribute("href");


        link.classList.remove(
            "active"
        );


        if (
            href &&
            href === `#${currentSection}`
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


function initActiveNavigation() {

    updateActiveNavigation();

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateActiveNavigation,
        { passive: true }
    );

}

/*==================== 8. REVEAL ANIMATIONS ====================*/

function initRevealAnimations() {

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-scale"
        );


    if (!revealElements.length) return;


    /*
        Important:
        If IntersectionObserver is not supported,
        show everything instead of leaving elements hidden.
    */

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {

            element.classList.add(
                "active",
                "revealed"
            );

        });

        return;

    }


    STATE.revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "active",
                            "revealed"
                        );


                        STATE.revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    revealElements.forEach(element => {

        STATE.revealObserver.observe(
            element
        );

    });

}

/*==================== 9. PROJECT SLIDERS ====================*/

function initProjectSliders() {

    const sliders =
        document.querySelectorAll(".project-slider");


    sliders.forEach(slider => {

        /*------------------------------------------
            FIND SLIDES
        ------------------------------------------*/

        const images =
            slider.querySelectorAll(".slide");


        /*------------------------------------------
            FIND BUTTONS
        ------------------------------------------*/

        const nextButton =
            slider.querySelector(
                ".next, .slider-next, .next-btn"
            );


        const prevButton =
            slider.querySelector(
                ".prev, .slider-prev, .prev-btn"
            );


        /*------------------------------------------
            FIND DOTS
        ------------------------------------------*/

        const dots =
            slider.querySelectorAll(
                ".slider-dots button"
            );


        /*------------------------------------------
            STOP IF NO IMAGES
        ------------------------------------------*/

        if (!images.length) {

            return;

        }


        let currentIndex = 0;


        /*==================== SHOW SLIDE ====================*/

        function showSlide(index) {

            currentIndex =
                (index + images.length) %
                images.length;


            /*--------------------------------------
                Update Images
            --------------------------------------*/

            images.forEach(
                (image, imageIndex) => {

                    image.classList.toggle(
                        "active",
                        imageIndex === currentIndex
                    );

                }
            );


            /*--------------------------------------
                Update Dots
            --------------------------------------*/

            dots.forEach(
                (dot, dotIndex) => {

                    dot.classList.toggle(
                        "active",
                        dotIndex === currentIndex
                    );

                }
            );

        }


        /*==================== NEXT BUTTON ====================*/

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showSlide(
                        currentIndex + 1
                    );

                }
            );

        }


        /*==================== PREVIOUS BUTTON ====================*/

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showSlide(
                        currentIndex - 1
                    );

                }
            );

        }


        /*==================== DOT BUTTONS ====================*/

        dots.forEach(
            (dot, dotIndex) => {

                dot.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        showSlide(dotIndex);

                    }
                );

            }
        );


        /*==================== INITIALIZE ====================*/

        showSlide(0);

    });

}










// /*==================== 11. CUSTOM CURSOR ====================*/

// function initCustomCursor() {

//     const cursorDot =
//         document.querySelector(".cursor-dot");

//     const cursorOutline =
//         document.querySelector(".cursor-outline");


//     if (!cursorDot || !cursorOutline) {

//         return;

//     }


//     /* Disable on touch devices */

//     if (
//         window.matchMedia(
//             "(hover: none), (pointer: coarse)"
//         ).matches
//     ) {

//         return;

//     }


//     STATE.cursorEnabled = true;


//     let mouseX = window.innerWidth / 2;
//     let mouseY = window.innerHeight / 2;

//     let outlineX = mouseX;
//     let outlineY = mouseY;


//     /*----------------------------------------------
//         MOUSE MOVEMENT
//     ----------------------------------------------*/

//     document.addEventListener(
//         "mousemove",
//         event => {

//             mouseX = event.clientX;
//             mouseY = event.clientY;


//             cursorDot.style.left =
//                 `${mouseX}px`;

//             cursorDot.style.top =
//                 `${mouseY}px`;

//         },
//         { passive: true }
//     );


//     /*----------------------------------------------
//         SMOOTH OUTLINE
//     ----------------------------------------------*/

//     function animateCursor() {

//         outlineX +=
//             (mouseX - outlineX) * 0.15;

//         outlineY +=
//             (mouseY - outlineY) * 0.15;


//         cursorOutline.style.left =
//             `${outlineX}px`;

//         cursorOutline.style.top =
//             `${outlineY}px`;


//         requestAnimationFrame(
//             animateCursor
//         );

//     }


//     animateCursor();


//     /*----------------------------------------------
//         INTERACTIVE ELEMENTS
//     ----------------------------------------------*/

//     const interactiveElements =
//         document.querySelectorAll(
//             "a, button, input, textarea, select, .project-card"
//         );


//     interactiveElements.forEach(element => {

//         element.addEventListener(
//             "mouseenter",
//             () => {

//                 document.body.classList.add(
//                     "cursor-hover"
//                 );

//             }
//         );


//         element.addEventListener(
//             "mouseleave",
//             () => {

//                 document.body.classList.remove(
//                     "cursor-hover"
//                 );

//             }
//         );

//     });


//     /*----------------------------------------------
//         CLICK EFFECT
//     ----------------------------------------------*/

//     document.addEventListener(
//         "mousedown",
//         () => {

//             document.body.classList.add(
//                 "cursor-click"
//             );

//         }
//     );


//     document.addEventListener(
//         "mouseup",
//         () => {

//             document.body.classList.remove(
//                 "cursor-click"
//             );

//         }
//     );


//     /*----------------------------------------------
//         CURSOR LEAVES WINDOW
//     ----------------------------------------------*/

//     document.addEventListener(
//         "mouseleave",
//         () => {

//             cursorDot.style.opacity = "0";

//             cursorOutline.style.opacity = "0";

//         }
//     );


//     document.addEventListener(
//         "mouseenter",
//         () => {

//             cursorDot.style.opacity = "1";

//             cursorOutline.style.opacity = "0.55";

//         }
//     );

// }

/*==================== 12. BACK TO TOP ====================*/

function updateBackToTop() {

    if (!DOM.backToTop) return;


    if (window.scrollY > 400) {

        DOM.backToTop.classList.add(
            "show",
            "visible"
        );

        DOM.backToTop.setAttribute(
            "aria-hidden",
            "false"
        );

    } else {

        DOM.backToTop.classList.remove(
            "show",
            "visible"
        );

        DOM.backToTop.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


function initBackToTop() {

    if (!DOM.backToTop) return;


    DOM.backToTop.addEventListener(
        "click",
        scrollToTop
    );


    updateBackToTop();


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

}


/*==================== 13. DYNAMIC FOOTER YEAR ====================*/

function initFooterYear() {

    if (!DOM.footerYear) return;


    DOM.footerYear.textContent =
        new Date().getFullYear();

}


/*==================== 14. TOAST SYSTEM ====================*/

function showToast(
    message,
    type = "info",
    duration = 3500
) {

    if (!DOM.toastContainer) {

        console.warn(
            "Toast container not found:",
            message
        );

        return;

    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${type}`;


    const iconMap = {

        success:
            "fa-check-circle",

        error:
            "fa-exclamation-circle",

        warning:
            "fa-exclamation-triangle",

        info:
            "fa-info-circle"

    };


    const icon =
        iconMap[type] ||
        iconMap.info;


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fas ${icon}"></i>

        </div>

        <div class="toast-message">

            ${message}

        </div>

        <button
            class="toast-close"
            type="button"
            aria-label="Close notification"
        >

            <i class="fas fa-times"></i>

        </button>

    `;


    DOM.toastContainer.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.classList.add(
            "show",
            "visible"
        );

    });


    const closeToast = () => {

        toast.classList.remove(
            "show",
            "visible"
        );


        setTimeout(() => {

            if (toast.parentNode) {

                toast.remove();

            }

        }, 300);

    };


    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeToast
        );

    }


    setTimeout(
        closeToast,
        duration
    );

}


/*
    Make showToast available to other JS files.

    This is important because contact.js may use
    showToast().
*/

window.showToast =
    showToast;


/*==================== 15. FINAL INITIALIZATION ====================*/

function initializePortfolio() {

    console.log(
        "%cPortfolio initialization started...",
        "color:#6366f1;font-weight:bold;"
    );


    /* Page */

    initPageLoader();


    /* Navigation */

    initMobileNavigation();

    initActiveNavigation();


    /* Hero */

    initTypingEffect();


    /* Scroll */

    initScrollProgress();

    initHeaderScroll();

    initBackToTop();


    /* Animations */

    initRevealAnimations();


    /* Projects */

    initProjectSliders();


    /* Cursor */

    initCustomCursor();


    /* Footer */

    initFooterYear();


    console.log(
        "%cPortfolio System Ready ✔",
        "color:#22c55e;font-size:14px;font-weight:bold;"
    );

}


/*==================== START APPLICATION ====================*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePortfolio,
        { once: true }
    );

} else {

    initializePortfolio();

}