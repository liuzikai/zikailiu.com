$(function () {

    // Dynamically load files as inline (necessary for svg animation) source
    $.each($('[data-include]'), function () {
        $(this).load($(this).data('include'))
    })


    var allMods = $(".come-in-text");
    allMods.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("already-visible");
        }
    });

    //on a scroll event - execute function
    $(window).scroll(function() {

        // SVG animation
        $.each($("[id$=animated-svg]"), function () {
            var $distanceFromMiddle = this.getBoundingClientRect().top + this.getBoundingClientRect().height / 2 - window.innerHeight / 2;
            //variable for the 'stroke-dashoffset' unit
            var $dashOffset = $(this).css("stroke-dasharray");
            //calculate how far down the page the user is
            var $percentageComplete = 1 - $distanceFromMiddle / (window.innerHeight / 2);
            //convert dashoffset pixel value to integer
            var $newUnit = parseInt($dashOffset, 10);
            //get the value to be subtracted from the 'stroke-dashoffset'
            var $offsetUnit = $percentageComplete * $percentageComplete * $percentageComplete * $newUnit ;
            //set the new value of the dashoffset to create the drawing effect
            $(this).css("stroke-dashoffset", $newUnit - $offsetUnit);
        })

        allMods.each(function(i, el) {
            var el = $(el);
            if (el.visible(true)) {
                el.addClass("come-in");
            }
        });

    });
})

$(document).ready(function() {

});