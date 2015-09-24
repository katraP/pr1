
//TO STOP AUTOMATIC SLIDE CHANGES - remove class 'autoplay' from element '.head_slider ul'

$(function() {
    var delay = 1000, // time for slide to hide
        playInterval = 8000, //time between automatic slide change
        current = 1,
        $buttons = $('.head_slider .controls'),
        $bg = $('.head_slider .slider-bg'),
        $slides = $('.head_slider ul'),
        autoplay = $slides.hasClass('autoplay'),
        timeout, interval,
        isIE = function() {
            var myNav = navigator.userAgent.toLowerCase(),
                ver = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
            return (ver && ver < 10);
        },
        changeSlider = function(number, first) {
            var $curr_slide = $slides.children('.s'+current),
                $next_slide = $slides.children('.s'+number);
            $curr_slide.removeClass('animate').addClass('finish');
            $buttons.children().removeClass('active');
            $buttons.children('.c'+number).addClass('active');
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                $curr_slide.removeClass('finish');
                $next_slide.addClass('animate');
                $bg.removeClass('s'+current).addClass('s'+number);
                current = number;
                if(autoplay)
                    resetInterval();
            }, isIE() ? 0 : delay);
        },
        resetInterval = function() {
            clearInterval(interval);
            interval = setInterval(function() {
                changeSlider((current + 1 == 4) ? 1 : current + 1);
            }, playInterval);
        };

    //buttons handler
    $buttons.children().click(function() {
        if(!$(this).hasClass('active'))
            changeSlider(parseInt($(this).attr('class').substring(1,2)));
    });

    //autoplaying
    if(autoplay) {
        resetInterval();
    }

    //show the first slide
    changeSlider(1);

});