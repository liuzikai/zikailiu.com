$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        $(this).load($(this).data('include'))
    })




    //on a scroll event - execute function
    $(window).scroll(function() {

        $.each($("[id$=animated-svg]"), function () {
            var $distanceFromTop = this.getBoundingClientRect().top;
            //variable for the 'stroke-dashoffset' unit
            var $dashOffset = $(this).css("stroke-dasharray");
            //calculate how far down the page the user is
            var $percentageComplete = 1 - $distanceFromTop / (window.innerHeight - $('#mainNav').height());
            //convert dashoffset pixel value to integer
            var $newUnit = parseInt($dashOffset, 10);
            //get the value to be subtracted from the 'stroke-dashoffset'
            var $offsetUnit = $percentageComplete * $newUnit ;
            //set the new value of the dashoffset to create the drawing effect
            $(this).css("stroke-dashoffset", $newUnit - $offsetUnit);
        })



    });
})

$(document).ready(function() {

});