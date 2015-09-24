$(function() {
    var $lButton = $('.header .buttons .login'),
        $lPopup = $('.login-popup'),
        $faqItem = $('.s-faq-item'),
        $carouselTrigger = 0;
        $menu = $('.top_menu');
        $moreSlideDown = $('.slideDown'),
        $menuToggler = $('.menu-toggle'),
        $body = $('body'),
        checkScroll = function() {
            if($('.hiw ul').length) {
                var position = $('.hiw ul').offset().top,
                    height = $(window).height(),
                    scroll = $(window).scrollTop();
                if((height + scroll) > position + 400) {
                    $('.hiw ul').addClass('animate');
                    $(window).unbind('scroll');
                }
            }
        },
        showPopup = function() {
            $lButton.addClass('active');
            $lPopup.css({visibility: 'visible'}).addClass('shown');
            setTimeout(function(){
                $body.addClass('fixed');
            }, 400);
        },
        hidePopup = function() {
            $lButton.removeClass('active');
            $lPopup.removeClass('shown');
            setTimeout(function() {
                $body.removeClass('fixed');
                $lPopup.css({visibility: 'hidden'});
            }, 400);
        },
        toggleMenu = function(){
            $menu.toggleClass('visible').toggleClass('inactive');
            setTimeout(function(){
                $body.toggleClass('fixed');
            }, 400);
        };

    $(window).bind('scroll', function() {
        checkScroll();
    });
    $('.header').bind('click', function(e){
       if($(e.target).hasClass('menu-toggle') ||$(e.target).parent().hasClass('menu-toggle') ) {
           if($('.login-popup').hasClass('shown')) {
               hidePopup();
               setTimeout(toggleMenu, 400);
           }
           else {
               toggleMenu();
           }
       }
        else if ($(e.target).hasClass('login')) {
           if($menu.hasClass('visible')) {
               toggleMenu();
               setTimeout(showPopup, 400);
           }
           else {
               if(!$(e.target).hasClass('active'))
                   showPopup();
               else
                   hidePopup();
           }
       }
        else if($(e.target).hasClass('header-contacts')) {
           if($('.login-popup').hasClass('shown')) {
               hidePopup();
           }
           else if($menu.hasClass('visible')) {
               toggleMenu();
           }
       }
    });
    checkScroll();

    //testimonials carousel
    function countCarouselValues() {
        $carouselTrigger = 0;

        if($(window).width() < 459) {
            if(!$('body').hasClass('min-mobile-mode')) {
                $carouselTrigger = 1;
                $('body').removeClass('mobile-mode').addClass('min-mobile-mode');
                var o = {
                    slideWidth: 260,
                    slideMargin: 30,
                    minSlides: 1,
                    maxSlides: 1,
                    moveSlides: 1,
                    speed: 1000,
                    nextText: '&#xf105;',
                    prevText: '&#xf104;'

                };
            }
        }
        else if($(window).width() < 757) {
            if(!$('body').hasClass('mobile-mode')) {
                $carouselTrigger = 1;
                $('body').removeClass('tablet-mode').removeClass('min-mobile-mode').addClass('mobile-mode');
                var o = {
                    slideWidth: 360,
                    slideMargin: 30,
                    minSlides: 1,
                    maxSlides: 1,
                    moveSlides: 1,
                    speed: 1000,
                    nextText: '&#xf105;',
                    prevText: '&#xf104;'

                };

            }
        }
        else if($(window).width() < 1004) {
            if(!$('body').hasClass('tablet-mode')) {
                $carouselTrigger = 1;
                $('body').removeClass('mobile-mode').removeClass('desktop-mode').addClass('tablet-mode');
                var o = {
                    slideWidth: 630,
                    slideMargin: 30,
                    minSlides: 1,
                    maxSlides: 1,
                    moveSlides: 1,
                    speed: 1000,
                    nextText: '&#xf105;',
                    prevText: '&#xf104;'

                };
            }
        }
        else {
            if(!$('body').hasClass('desktop-mode')) {
                $carouselTrigger = 1;
                $('body').removeClass('tablet-mode').addClass('desktop-mode');
                var o = {
                    slideWidth: 280,
                    slideMargin: 30,
                    minSlides: 1,
                    maxSlides: 3,
                    moveSlides: 3,
                    speed: 1000,
                    nextText: '&#xf105;',
                    prevText: '&#xf104;'

                };

            }
        }
        return o;
    }
    //review rating choice

    function ratingSelect() {
        var container = $('.s-review-stars'),
            starElement = container.find('.s-review__star');
        starElement.bind('mouseenter', function(e){
            var target = $(e.target),
                selectTrigger =0;
            starElement.removeClass('selected');
            starElement.each(function(i){
                if(selectTrigger==1) {
                    $(this).removeClass('selected');
                }
                else {
                    if(target.hasClass('s'+(i+1))) {
                        for(var j= 1; j< i+2; j++) {
                            var currEl = container.find('.s'+j);
                            if(!currEl.hasClass('selected')) {
                                currEl.addClass('selected');
                            }
                        }
                        return false;
                        selectTrigger=1;
                    }
                }
           });
        })
            .bind('click', function(){
                starElement.removeClass('checked');
                $(this).addClass('checked');
            });
        container.bind('mouseleave', function(){
            starElement.removeClass('selected');
            if(container.find('.checked').length) {
                starElement.each(function(){
                    $(this).addClass('selected');
                    if($(this).hasClass('checked')) {
                        return false;
                    }
                });
            }
        })
    }
    //review form handler
    function reviewFormHandler() {
        var textField = '.s-review__field',
            textareaField = '.s-review__field--textarea';
        function checkElement(a) {
            var i= 0, arrLength = a.length, trigger = true;
            for(i; i< arrLength; i++) {
                if(!a[i].val()) {
                    a[i].addClass('error');
                    trigger = false;
                }
            }
            return trigger;
        }
        $('.s-review__button').click(function(){
            if(checkElement([$(textField), $(textareaField)])) {
                var textComplete = $('<div>').addClass('s-review__complete').text('Your testimonial has been sent'),
                    self = $(this);
                $(this).find('.s-review__button-text').hide().end()
                    .find('.s-review-loader').addClass('active');
                setTimeout(function(){
                    textComplete.insertBefore(self);
                    self.hide();
                }, 2500);
            }
        });
        $(textField + ',' + textareaField).bind('focus', function(){
            $(this).removeClass('error');
        })
    }

    ratingSelect();
    reviewFormHandler();
    var carouselObj = countCarouselValues(), isCarouselPresent = $('.carousel').length;
    if (isCarouselPresent) {
        var slider = $('.carousel');
        slider.bxSlider(carouselObj);
    }
    $(window).bind('resize', function(){
        var carouselObj = countCarouselValues();
        if($carouselTrigger == 1 && isCarouselPresent) {
            slider.reloadSlider(carouselObj);
        }
    });

    $('.tablet-mode .phones .us, .mobile-mode .phones .us, .min-mobile-mode .phones .us').bind('click', function(){
       $(this).parent().toggleClass('opened');
    });
    $faqItem.bind('click', function(){
       $(this).toggleClass('opened');
    });
    $('.feature__checkbox input').bind('click', function(){
       $(this).parent().toggleClass('selected');
    });
    $(' .radio__check input').bind('click', function(){
       $(this).parent().parent().find('.selected').removeClass('selected');
        $(this).parent().addClass('selected');
    });
    if($('.orderform').length) {
        $(window).resize(function(){
            $('.ui-selectmenu-menu').css('left', 0);
        });
    }
});