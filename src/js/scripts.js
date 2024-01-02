/*!
 * Script for my portfolio. See script.js for unminified version with comments.
 * Copyright 2023 Zikai Liu
 * Reference: Start Bootstrap - Grayscale v7.0.5 (https://startbootstrap.com/theme/grayscale, Licensed under MIT)
 */

// Include only necessary JS from Bootstrap
// import Alert from "bootstrap/js/src/alert"
// import Button from "bootstrap/js/src/button"
// import Carousel from "bootstrap/js/src/carousel"
import Collapse from "bootstrap/js/src/collapse"
// import Dropdown from "bootstrap/js/src/dropdown"
import Modal from "bootstrap/js/src/modal"
// import Offcanvas from "bootstrap/js/src/offcanvas"
// import Popover from "bootstrap/js/src/popover"
import ScrollSpy from "bootstrap/js/src/scrollspy"
// import Tab from "bootstrap/js/src/tab"
// import Toast from "bootstrap/js/src/toast"
// import Tooltip from "bootstrap/js/src/tooltip"

// BaguetteBox
import baguetteBox from './baguettebox.js';

// GSAP
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

window.addEventListener("DOMContentLoaded", event => {

    // Home page scroll indicator
    const scrollIndicators = document.querySelectorAll("#homeScrollIndicator > path");

    // Navbar shrink
    const navbarCollapsible = document.getElementById("mainNav");

    let navbarShrink = function () {
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY <= 0) {
            // navbarCollapsible.classList.remove("navbar-shrink")
            // Do not restart the scroll indicator animation
        } else {
            // navbarCollapsible.classList.add("navbar-shrink")

            // Stop the scroll indicator animation smoothly
            Array.from(scrollIndicators).forEach(el => {
                el.addEventListener('animationiteration', _ => {
                    el.classList.remove("scroll-indicator-path-active");
                }, {once: true});
            });
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener("scroll", navbarShrink);

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector(".navbar-toggler");
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll("#navbarResponsive .nav-link")
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener("click", () => {
            if (window.getComputedStyle(navbarToggler).display !== "none") {
                navbarToggler.click();
            }
        });
    });

    /*!
     * My JS Script
     */

    // Reference: https://stackoverflow.com/a/12418814/10087792
    //            jquery-visible(https://github.com/customd/jquery-visible)
    function inViewportPartial(element) {
        if (!element) return false;
        if (1 !== element.nodeType) return false;
        if (element.offsetParent === null) return false;  // invisible

        let vpWidth = window.innerWidth,
            vpHeight = window.innerHeight * 1.1;  // multiply by a factor to avoid flicking

        let rec = element.getBoundingClientRect(),
            tViz = rec.top >= 0 && rec.top < vpHeight,
            bViz = rec.bottom > 0 && rec.bottom <= vpHeight,
            lViz = rec.left >= 0 && rec.left < vpWidth,
            rViz = rec.right > 0 && rec.right <= vpWidth;

        let vVisible = tViz || bViz,
            hVisible = lViz || rViz;
        vVisible = (rec.top < 0 && rec.bottom > vpHeight) ? true : vVisible;
        hVisible = (rec.left < 0 && rec.right > vpWidth) ? true : hVisible;

        return vVisible && hVisible;
    }

    // Get the array of all .slide-in-text
    let allSlideInTexts = [];
    for (const e of document.getElementsByClassName("slide-in-text")) {
        allSlideInTexts.push(e);
    }

    // Slide in animation
    function updateSlideInTexts() {
        for (var i = 0; i < allSlideInTexts.length; i++) {
            let e = allSlideInTexts[i];
            if (inViewportPartial(e)) {
                e.classList.add("come-in");
                // Remove it from the list
                allSlideInTexts.splice(i, 1);
                i--;
            }
        }
    }

    updateSlideInTexts();  // run once when DOM is ready

    // Functions for SVG animation

    let mainNavBodyElem = document.getElementById("mainNavBody");

    function calcEndTop(projectElem) {
        // Case 1: 100% when the container is centralized vertically
        //   clientRect.top = navBarHeight + (window.innerHeight - navBarHeight) * 0.5 - clientRect.height * 0.5
        // Case 2: 100% when container.top = navBarHeight * 1.5, useful for mobile short screen
        //   clientRect.top = navBarHeight * 1.5
        // Choose the larger one of case 1 and 2 (whichever reach first)
        let clientRect = projectElem.getBoundingClientRect();
        let navBarHeight = mainNavBodyElem.offsetHeight;
        let topEnd1 = (navBarHeight + window.innerHeight - clientRect.height) * 0.5,  // simplified
            topEnd2 = (navBarHeight * 1.5);
        return Math.max(topEnd1, topEnd2);
    }

    for (let e of document.getElementsByClassName("icon-placeholder")) {
        // Fetch the content
        let request = new XMLHttpRequest();
        request.open("GET", e.dataset.include, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                e.innerHTML = request.responseText;

                // Find the container
                let container = e.closest(".project-container-down-lg");
                if (!container) {
                    container = e.closest(".project-container");
                }

                // Iterate the path inside
                Array.from(e.querySelectorAll("path")).forEach(svg => {
                    if (svg.id.endsWith("-animated-svg")) {
                        gsap.to(svg, {
                            scrollTrigger: {
                                trigger: svg,
                                start: "top bottom",
                                endTrigger: container,
                                end: () => "top " + calcEndTop(container),  // container as let variable is captured
                                invalidateOnRefresh: true,
                                scrub: 2,
                                // markers: true,
                            },
                            strokeDashoffset: 0,
                            ease: "power1.in",
                        });
                    }
                });
            }
        };
        request.send();
    }

    // Lazy load images and videos in Read More sections

    // Get the array of all .read-more-button
    let allReadMoreButtons = [];
    for (let e of document.getElementsByClassName("read-more-button")) {
        allReadMoreButtons.push(e);
    }

    // Load images when READ MORE buttons are visible
    function handleVisibleReadMoreButtons() {
        for (let i = 0; i < allReadMoreButtons.length; i++) {
            let e = allReadMoreButtons[i];
            if (inViewportPartial(e)) {
                // Lazy load modal image
                let modal = document.querySelector(e.getAttribute("data-bs-target"));
                Array.from(modal.querySelectorAll(".modal-image")).forEach(e => {
                    e.src = e.dataset.src;
                    // console.log("Lazy load image:", e.src);
                });

                // Remove it from the list
                allReadMoreButtons.splice(i, 1);
                i--;
            }
        }
    }

    handleVisibleReadMoreButtons();  // call once at start

    window.readMoreClicked = function (readMoreButton) {
        // console.log("readMoreClicked:", readMoreButton);
        let modal = document.querySelector(readMoreButton.getAttribute("data-bs-target"));
        // Lazy load modal videos
        Array.from(modal.querySelectorAll(".modal-lazy-video")).forEach(e => {
            e.src = e.dataset.src;
            e.classList.remove("modal-lazy-video");
            if (e.type === "video/mp4") {
                // console.log(e.src, e.parentNode);
                e.parentNode.load();
            }
        });
        // Just in case handleVisibleReadMoreButtons does not work
        Array.from(modal.querySelectorAll(".modal-image")).forEach(e => {
            if (!e.getAttribute("src")) {
                e.src = e.dataset.src;
                console.warn("Modal lazy loading image is not loaded:", e.src);
            }
        });
    };

    // On a scroll event
    document.addEventListener("scroll", function (e) {
        updateSlideInTexts();
        handleVisibleReadMoreButtons();
    });

    const currentPage = document.getElementById("main-script").getAttribute("data-page");
    // console.warn(currentPage);

    // Note on GSAP: unit vh does not work with pin + scrub
    // Solution: use innerHeight and invalidateOnRefresh (y need to be callable to be refreshed)

    gsap.registerPlugin(ScrollTrigger);

    if (currentPage === "home") {

        function createAboutAnimation(vars) {
            return gsap.timeline(vars)
                .to(".about-icon.one", {x: "+=2", y: "-=2"}, "<")
                .to(".about-icon.two", {x: "-=2", y: "+=2"}, "<")
                .to(".about-icon, #about-link", {fill: "#669966",}, "<");
        }

        function createProjectsAnimation(vars) {
            return gsap.timeline(vars)
                .to(".projects-icon.one", {x: "-=2", y: "-=2"}, "<")
                .to(".projects-icon.two", {x: "+=2", y: "-=2"}, "<")
                .to(".projects-icon.three", {x: "+=2", y: "+=2"}, "<")
                .to(".projects-icon, #projects-link", {fill: "#3366ff",}, "<");
        }

        function createPhotographyAnimation(vars) {
            return gsap.timeline(vars)
                .to(".photography-icon.one", {x: "+=2", y: "+=2"}, "<")
                .to(".photography-icon.two", {x: "-=2", y: "+=2"}, "<")
                .to(".photography-icon.three", {x: "+=2", y: "-=2"}, "<")
                .to(".photography-icon, #photography-link", {fill: "#e62e00",}, "<");
        }

        let mm = gsap.matchMedia();

        // >= lg: scroll effect + trigger link animations on hover + contact icon animations on hover
        mm.add("(min-width: 992px)", () => {

            let section = document.getElementById("homeSection");
            let container = document.getElementById("biographyContainer");
            gsap.to("#biographyContainer", {
                scrollTrigger: {
                    trigger: "#homeSection",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true,
                    // markers: true,
                    invalidateOnRefresh: true,
                },
                y: () => Math.max(0, section.getBoundingClientRect().height - container.getBoundingClientRect().height),
                ease: "none",
                // duration: 3,
            });

            let aboutHoverAnimation = createAboutAnimation({paused: true})
            let aboutNav = document.getElementById("about-link");
            aboutNav.addEventListener("mouseenter", () => aboutHoverAnimation.play());
            aboutNav.addEventListener("mouseleave", () => aboutHoverAnimation.reverse());

            let projectsHoverAnimation = createProjectsAnimation({paused: true});
            let projectsNav = document.getElementById("projects-link");
            projectsNav.addEventListener("mouseenter", () => projectsHoverAnimation.play());
            projectsNav.addEventListener("mouseleave", () => projectsHoverAnimation.reverse());

            let photographyHoverAnimation = createPhotographyAnimation({paused: true});
            let photographyNav = document.getElementById("photography-link");
            photographyNav.addEventListener("mouseenter", () => photographyHoverAnimation.play());
            photographyNav.addEventListener("mouseleave", () => photographyHoverAnimation.reverse());

            let myPhoto = document.getElementById("biography-photo");
            myPhoto.addEventListener("mouseenter", () => {
                aboutHoverAnimation.play()
                projectsHoverAnimation.play()
                photographyHoverAnimation.play()
            });
            myPhoto.addEventListener("mouseleave", () => {
                aboutHoverAnimation.reverse()
                projectsHoverAnimation.reverse()
                photographyHoverAnimation.reverse()
            });

            // Color animations for contacts
            let contacts = document.querySelectorAll("#homeContacts > a");
            console.log(contacts);
            Array.from(contacts).forEach(el => {
                let tl = gsap.timeline({paused: true}).to(el, {color: "rgba(0, 0, 0, 0.25)",}, "<");
                el.addEventListener("mouseenter", () => tl.play());
                el.addEventListener("mouseleave", () => tl.reverse());
            });

            return () => { // optional
                // custom cleanup code here (runs when it STOPS matching)
            };
        });

        // < lg: trigger link animation on scroll
        mm.add("(max-width: 991px)", () => {

            let vars = {
                paused: true,
                scrollTrigger: {
                    trigger: "#biography-links",
                    start: "center bottom",
                    endTrigger: "#biography",
                    end: "top top",
                    scrub: 12,
                    // markers: true,
                },
            };

            createAboutAnimation(vars);
            createProjectsAnimation(vars);
            createPhotographyAnimation(vars);

            return () => { // optional
                // custom cleanup code here (runs when it STOPS matching)
            };
        });

    } else if (currentPage === "projects") {

        gsap.to(document.getElementById("projectNav"), {
            scrollTrigger: {
                trigger: document.getElementById("projects"),
                start: "top bottom",
                end: "top 25%",
                invalidateOnRefresh: true,
                scrub: 2,
                // markers: true,
            },
            opacity: 1,
            ease: "power1.in",
        });

    } else if (currentPage === "photography") {

        baguetteBox.run('.compact-gallery', {animation: 'slideIn', overlayBackgroundColor: 'rgba(0, 0, 0, 0.9)'});

    }
});
