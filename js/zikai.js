$(function () {

    // Reference: https://stackoverflow.com/a/12418814/10087792
    function inViewport(element) {
        if (!element) return false;
        if (1 !== element.nodeType) return false;

        var html = document.documentElement;
        var rect = element.getBoundingClientRect();

        return !!rect &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.left <= html.clientWidth &&
            rect.top <= html.clientHeight;
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
            if (inViewport(e)) {
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
        // When clientRect.top = window.innerHeight, 0%
        // When clientRect.top = navBarHeight, 100%
        let alpha = -1 / (window.innerHeight - document.getElementById("mainNav").offsetHeight);
        let percentage = (projectElem.getBoundingClientRect().top - window.innerHeight) * alpha;
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
            // Forward 2% per 50ms (take 2.5s from 0% to 100%)
            await sleep(50);
            await driveSVG(svgElem, dashTotal, current + 0.02, target);
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
})

$(document).ready(function () {

});
