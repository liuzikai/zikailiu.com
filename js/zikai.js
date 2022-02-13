$(function () {


    let allSlideInTexts = $(".slide-in-text");
    $.each(allSlideInTexts, function () {
        if ($(this).visible(true)) {
            $(this).addClass("come-in");
        }
    });

    function clamp(num, min, max) {
        return num <= min ? min : (num >= max ? max : num)
    }

    function easeQuint(percentage) {
        return percentage * percentage * percentage * percentage;
    }

    function calcProjectSVGPercentage(projectElem) {
        // When clientRect.top = window.innerHeight, 0%
        // When clientRect.top = window.innerHeight * 0.25, 100%
        let alpha = -1 / (window.innerHeight * 0.9)
        let percentage = (projectElem.getBoundingClientRect().top - window.innerHeight) * alpha
        if (percentage < 0) return 0;
        return easeQuint(clamp(percentage, 0, 1))
    }

    function drawProjectSVG(svgSel, percentage) {
        let dashTotal = parseInt(svgSel.css("stroke-dasharray"), 10);
        svgSel.css("stroke-dashoffset", dashTotal * (1 - percentage));
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let allProjectContainers = $(".project-container");

    async function driveProjectSVG(svgSel, current, target) {
        if (current > target) current = target;
        drawProjectSVG(svgSel, current);
        if (current < target) {
            // Forward 2% per 30ms (take 1.5s from 0% to 100%)
            await sleep(30);
            await driveProjectSVG(svgSel, current + 0.02, target);
        }
    }

    // Dynamically load files as inline source (necessary for svg animation)
    $.each($('[data-include]'), function () {
        $(this).load($(this).data('include'), function() {
            // If the svg is already visible, drive the animation using timer
            let projectSel = $(this).parent().closest(".project-container")
            if (projectSel.length > 0) {
                let percentage = calcProjectSVGPercentage(projectSel.get(0));
                if (percentage > 0) {
                    let svgSel = $(this).find("[id$=animated-svg]");
                    driveProjectSVG(svgSel, 0, percentage).then(_ => {});
                }
            }
        })
    })


    // On a scroll event
    $(window).scroll(function () {
        $.each(allProjectContainers, function () {
            let svgSel = $(this).find("[id$=animated-svg]");
            drawProjectSVG(svgSel, calcProjectSVGPercentage(this))
        })

        $.each(allSlideInTexts, function () {
            if ($(this).visible(true)) {
                $(this).addClass("come-in");
            }
        });

    });
})

$(document).ready(function () {

});