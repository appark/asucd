(function ($) {

    $(document).ready(function () {

        window.et_pb_jt_filterable_grid_init = function () {

            //Fix image streching on IE and Edge
            function detectIE() {
                var ua = window.navigator.userAgent;

                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    // IE 10 or older => return version number
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    // IE 11 => return version number
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    // Edge (IE 12+) => return version number
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                // other browser
                return false;
            }

            if (detectIE()) {
                $(".et_pb_jt_filterable_grid_item_image_container").each(function () {
                    var $container = $(this),
                        imgUrl = $container.find("img").prop("src");
                    if (imgUrl) {
                        $container.css("backgroundImage", 'url(' + imgUrl + ')').addClass("et_pb_jt_filterable_grid_item_custom_object_fit");
                    }
                });
            }

            function setupLightbox(target) {
                //Iterate over each lightbox container
                target.find('.et_pb_lightbox_image').each(function () {

                    //Re-setup the lightbox functionality
                    var $et_lightbox_image = $(this);
                    $et_lightbox_image.magnificPopup({
                        type: 'image',
                        removalDelay: 500,
                        mainClass: 'mfp-fade',
                        zoom: {
                            enabled: !et_pb_custom.is_builder_plugin_used,
                            duration: 500,
                            opener: function (element) {
                                return element.find('img');
                            }
                        }
                    });
                });
            }
            //Fix image lightbox after filter change because divi only sets up lightboxes once after page load
            $(".et_pb_jt_filterable_grid_container").each(function () {

                var target = $(this);
                var observer = new MutationObserver(function (mutations) {
                    setupLightbox(target);
                });

                // configuration of the observer:
                var config = { attributes: true, childList: true, characterData: true };

                // pass in the target node, as well as the observer options to start observing
                observer.observe(this, config);

                //Setup once again in case the url linked directly to the grid
                setupLightbox(target);
            });

            //Select default filter if necessary
            $(".et_pb_jt_filterable_grid").each(function () {
                var shouldSelectDefaultFilter = true;
                var hash = window.location.hash;
                if (hash) {
                    var components = hash.split("|");
                    if (components[0]) {
                        var grid = $(components[0]);
                        if(grid.attr('id') === $(this).attr('id')) {
                            shouldSelectDefaultFilter = false;
                        }
                    }
                }

                var defaultFilter = $(this).attr('data-default-filter');
                if (typeof defaultFilter !== typeof undefined && defaultFilter !== false && shouldSelectDefaultFilter) {
                    $(this).find("a[data-category-slug=" + defaultFilter + "]").click();
                }
            });
        }

        $('body').on('click', '.et_pb_post .et_pb_video_overlay, .et_pb_video .et_pb_video_overlay, .et_pb_video_wrap .et_pb_video_overlay', function () {
            var $this = $(this);
            window.et_pb_play_overlayed_video($this);
            return false;
        });
        

        if (window.et_load_event_fired) {
            window.et_pb_jt_filterable_grid_init();
        } else {
            $(window).load(function () {
                window.et_pb_jt_filterable_grid_init();
            });
        }

    });

    $(window).load(function () {
        var hash = window.location.hash;
        if (hash) {
            var components = hash.split("|");
            if (components[0]) {
                var grid = $(components[0]);
                if (grid.hasClass("et_pb_jt_filterable_grid")) {
                    setTimeout(function () {
                        grid[0].scrollIntoView();
                    }, 100);
                }
            }
        }
    });

})(jQuery);