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

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.addEventListener("DOMContentLoaded", event => {

    // Navbar shrink function
    let navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector("#mainNav");
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY <= 0) {
            navbarCollapsible.classList.remove("navbar-shrink")
            // Do not restart the scroll indicator animation
        } else {
            navbarCollapsible.classList.add("navbar-shrink")
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
        let mm = gsap.matchMedia();

        // >= lg only animation
        mm.add("(min-width: 992px)", () => {

            /*gsap.to("#me-intro", {
                scrollTrigger: {
                    trigger: "#me-intro",
                    start: "top bottom",
                    end: "top top",
                    // pin: true,
                    // pinSpacing: false,
                    scrub: true,
                    // markers: true,
                },
                y: "+50vh",
                yPercent: "-50",
                ease: "none",
                // duration: 3,
            });*/

            let aboutHoverAnimation = gsap.timeline({paused: true})
                .to(".about-icon.one", {x: "+=2", y: "-=2"}, "<")
                .to(".about-icon.two", {x: "-=2", y: "+=2"}, "<")
                .to(".about-icon.three", {x: "+=2", y: "+=2"}, "<")
                .to(".about-icon, #about-link", {fill: "#669966",}, "<");
            let aboutNav = document.getElementById("about-link");
            aboutNav.addEventListener("mouseenter", () => aboutHoverAnimation.play());
            aboutNav.addEventListener("mouseleave", () => aboutHoverAnimation.reverse());

            let projectsHoverAnimation = gsap.timeline({paused: true})
                .to(".projects-icon.one", {x: "-=2", y: "-=2"}, "<")
                .to(".projects-icon.two", {x: "+=2", y: "-=2"}, "<")
                .to(".projects-icon.three", {x: "+=2", y: "+=2"}, "<")
                .to(".projects-icon, #projects-link", {fill: "#3366ff",}, "<");
            let projectsNav = document.getElementById("projects-link");
            projectsNav.addEventListener("mouseenter", () => projectsHoverAnimation.play());
            projectsNav.addEventListener("mouseleave", () => projectsHoverAnimation.reverse());

            let photographsHoverAnimation = gsap.timeline({paused: true})
                .to(".photographs-icon.one", {x: "+=2", y: "+=2"}, "<")
                .to(".photographs-icon.two", {x: "-=2", y: "+=2"}, "<")
                .to(".photographs-icon.three", {x: "+=2", y: "+=2"}, "<")
                .to(".photographs-icon, #photographs-link", {fill: "#e62e00",}, "<");
            ;
            let photographsNav = document.getElementById("photographs-link");
            photographsNav.addEventListener("mouseenter", () => photographsHoverAnimation.play());
            photographsNav.addEventListener("mouseleave", () => photographsHoverAnimation.reverse());


            return () => { // optional
                // custom cleanup code here (runs when it STOPS matching)
            };
        });

    } else if (currentPage === "photographs") {

        gsap.to("#thumbnails", {
            scrollTrigger: {
                trigger: "#photos",
                start: "top 20%",
                endTrigger: "#photos",
                end: "bottom bottom",
                pin: "#thumbnails",
                pinSpacing: false,
                scrub: true,
                invalidateOnRefresh: true,
                // anticipatePin: 1,
                // markers: true,
            },
            yPercent: "-100",
            y: () => window.innerHeight * 0.40,
            ease: "none",
        });
    }
});
