/*!
 * Script for my portfolio. See script.js for unminified version with comments.
 * Copyright 2022 Zikai Liu
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
// import ScrollSpy from "bootstrap/js/src/scrollspy"
// import Tab from "bootstrap/js/src/tab"
// import Toast from "bootstrap/js/src/toast"
// import Tooltip from "bootstrap/js/src/tooltip"

window.addEventListener("DOMContentLoaded", event => {

    // Home page scroll indicator
    const scrollIndicators = document.querySelectorAll("#homeScrollIndicator > path");

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
            // Stop the scroll indicator animation smoothly
            Array.from(scrollIndicators).forEach(e => {
                e.addEventListener('animationiteration', _ => {
                    e.classList.remove("scroll-indicator-path-active");
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

    function clamp(num, min, max) {
        return num <= min ? min : (num >= max ? max : num);
    }

    function percentageEase(percentage) {
        return percentage * percentage * percentage * percentage;
    }

    let mainNavBodyElem = document.getElementById("mainNavBody");
    let mainNavBodyMobileElem = document.getElementById("mainNavBodyMobile");

    function calcProjectSVGPercentage(projectElem) {
        // 0% when first becomes visible from the bottom
        //   clientRect.top = window.innerHeight
        // Case 1: 100% when the container is centralized vertically
        //   clientRect.top = navBarHeight + (window.innerHeight - navBarHeight) * 0.5 - clientRect.height * 0.5
        // Case 2: 100% when container.top = navBarHeight * 1.5, useful for mobile short screen
        //   clientRect.top = navBarHeight * 1.5
        // Choose the larger one of case 1 and 2 (whichever reach first)
        let clientRect = projectElem.getBoundingClientRect();
        // mainNav expandable in mobile, use mainNavBody
        let navBarHeight = mainNavBodyElem.offsetHeight;
        if (navBarHeight === 0) navBarHeight = mainNavBodyMobileElem.offsetHeight;
        let topStart = window.innerHeight,
            topEnd1 = (navBarHeight + window.innerHeight - clientRect.height) * 0.5,  // simplified
            topEnd2 = (navBarHeight * 1.5),
            topEnd = Math.max(topEnd1, topEnd2);
        let slope = 1 / (topEnd - topStart);
        let percentage = (clientRect.top - topStart) * slope;
        if (percentage < 0) return 0;
        return percentageEase(clamp(percentage, 0, 1));
    }

    function drawProjectSVG(svgElem, dashTotal, percentage) {
        svgElem.style.strokeDashoffset = dashTotal * (1 - percentage);
    }

    // SVG information: {svg element => [container element, stroke-dashoffset]}
    let svgInfo = new Map();

    // Update all SVGs
    function updateSVGs() {
        for (const [key, value] of svgInfo.entries()) {
            drawProjectSVG(key, value[1], calcProjectSVGPercentage(value[0]));
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Async function to drive an SVG to a certain percentage with delay (animation)
    // Used to drive a svg when it first shows up, when user refresh the page and it already shows up in the viewpoint
    async function driveSVG(svgElem, dashTotal, current, target) {
        if (current > target) current = target;
        drawProjectSVG(svgElem, dashTotal, current);
        if (current < target) {
            // Forward 4% per 40ms (take 1s from 0% to 100%)
            await sleep(40);
            await driveSVG(svgElem, dashTotal, current + 0.04, target);
        }
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
                        // Get the stroke-dashoffset
                        let style = window.getComputedStyle(svg);
                        let len = parseInt(style.getPropertyValue("stroke-dashoffset"), 10);

                        // Store the information
                        svgInfo.set(svg, [container, len]);

                        // First-time show up, animate it to the current point if already in the view point
                        // console.log("driveSVG: " + svg.id + " " + calcProjectSVGPercentage(container) + "/" + len);
                        driveSVG(svg, len, 0, calcProjectSVGPercentage(container)).then();
                    }
                });
            }
        };
        request.send();
    }
    // Note: svgInfo is updated async

    // Lazy load images and videos in Read More sections

    // Get the array of all .read-more-button
    let allReadMoreButtons = [];
    for (let e of document.getElementsByClassName("read-more-button")) {
        allReadMoreButtons.push(e);
    }

    // Slide in animation
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
        updateSVGs();
        updateSlideInTexts();
        handleVisibleReadMoreButtons();
    });


    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#me-photo", {
        scrollTrigger: {
            trigger: "#me-photo",
            start: "top bottom",
            end: "+=" + (360 * 11),
            pin: true,
            pinSpacing: false,
            scrub: true,
            // toggleActions: "restart none reverse none",
            markers: true,
        },
        y: "-150vh",
        ease: "power1.out",
        // duration: 3,
    });
    gsap.to("#me-intro-self", {
        scrollTrigger: {
            trigger: "#me-intro-self",
            start: "top bottom",
            end: "+=" + (360 * 10),
            pin: true,
            pinSpacing: false,
            scrub: true,
            // toggleActions: "restart none reverse none",
            markers: true,
        },
        y: "-150vh",
        ease: "power2.out",
        // duration: 3,
    });
    gsap.to("#me-intro-tech", {
        scrollTrigger: {
            trigger: "#me-intro-tech",
            start: "top bottom",
            end: "+=" + (360 * 8),
            pin: true,
            pinSpacing: false,
            scrub: true,
            // toggleActions: "restart none reverse none",
            markers: true,
        },
        y: "-90vh",
        ease: "power2.out",
        // duration: 3,
    });
    gsap.to("#me-intro-art", {
        scrollTrigger: {
            trigger: "#me-intro-art",
            start: "top bottom",
            end: "+=" + (360 * 6),
            pin: true,
            pinSpacing: false,
            scrub: true,
            // toggleActions: "restart none reverse none",
            // markers: true,
        },
        y: "-80vh",
        // duration: 3,
    });
    gsap.to("#me-intro-combined", {
        scrollTrigger: {
            trigger: "#me-intro-combined",
            start: "top bottom",
            end: "+=" + (360 * 4),
            pin: true,
            // pinSpacing: false,
            scrub: true,
            // toggleActions: "restart none reverse none",
            // markers: true,
        },
        y: "-60vh",
        // duration: 3,
    })
});
