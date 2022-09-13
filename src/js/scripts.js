/*!
 * Script for my portfolio. See script.js for unminified version with comments.
 * Copyright 2022 Zikai Liu
 * Reference: Start Bootstrap - Grayscale v7.0.5 (https://startbootstrap.com/theme/grayscale, Licensed under MIT)
 */

// Include only necessary JS from Bootstrap
// import Alert from 'bootstrap/js/src/alert'
// import Button from 'bootstrap/js/src/button'
// import Carousel from 'bootstrap/js/src/carousel'
import Collapse from 'bootstrap/js/src/collapse'
// import Dropdown from 'bootstrap/js/src/dropdown'
import Modal from 'bootstrap/js/src/modal'
// import Offcanvas from 'bootstrap/js/src/offcanvas'
// import Popover from 'bootstrap/js/src/popover'
import ScrollSpy from 'bootstrap/js/src/scrollspy'
// import Tab from 'bootstrap/js/src/tab'
// import Toast from 'bootstrap/js/src/toast'
// import Tooltip from 'bootstrap/js/src/tooltip'

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY <= 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
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

        let vpWidth = window.innerWidth,
            vpHeight = window.innerHeight;

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
    for (const el of document.getElementsByClassName("slide-in-text")) {
        allSlideInTexts.push(el);
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
        let navBarHeight = document.getElementById("mainNavBody").offsetHeight;
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

    for (const e of document.getElementsByClassName("icon-placeholder")) {
        // Fetch the content
        let request = new XMLHttpRequest();
        request.open('GET', e.dataset.include, true);
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

    // On a scroll event
    document.addEventListener('scroll', function (e) {
        updateSVGs();
        updateSlideInTexts();
    });

    window.readMoreClicked = function(readMoreButton) {
        // Lazy loading images and videos (not in scripts.js as it is removed as unused)
        let modal = document.querySelector(readMoreButton.getAttribute("data-bs-target"));
        Array.from(modal.querySelectorAll(".modal-lazy")).forEach(e => {
            e.src = e.dataset.src;
            e.classList.remove("modal-lazy");
            if (e.type === "video/mp4") {
                e.parentNode.load();
            }
        });
        // console.log("readMoreClicked");
    };

    // Home page

    // let mhElem = document.getElementById("homeMasthead");
    // let mhRunning = false;
    // let mhDirection, mhStep, mhCurrent = 0;
    //
    // async function mhDrive() {
    //     // console.log(mhCurrent);
    //     if ((mhStep > 0 && mhCurrent <= 1) || (mhStep < 0 && mhCurrent >= 0)) {
    //         let transparentEnd = clamp(mhCurrent, 0, 1) * 100;
    //         let solidStart = clamp(mhCurrent, 0, 1) * 100;
    //         let direction = mhDirection > 0 ? "90deg" : "-90deg";
    //         let mask = "linear-gradient(" + direction + ", transparent 0%, black " + solidStart + "%, black 100%)";
    //         mhElem.style["mask-image"] = mask;
    //         mhElem.style["-webkit-mask-image"] = mask;
    //         await sleep(30);
    //         mhCurrent += mhStep;
    //         await mhDrive();
    //     } else {
    //
    //     }
    // }
    //
    // function mhStart(direction, step) {
    //     mhDirection = direction;
    //     mhStep = step
    //     // if (!mhRunning) {
    //         mhRunning = true;
    //         mhDrive().then(_ => mhRunning = false);
    //     // }
    // }
    //
    // let homeProjectElem = document.getElementById("homeProject");
    // homeProjectElem.addEventListener("mouseenter", _ => mhStart(1, 0.05));
    // homeProjectElem.addEventListener("mouseout", _ => mhStart(1, -0.05));
    //
    // window.setMastheadMask = function(step) {
    //     console.log(step);
    //
    // };

});
