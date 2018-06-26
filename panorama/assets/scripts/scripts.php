<script type="text/javascript">
    function setREVStartSize(e) {
        try {
            var i = jQuery(window).width(),
                    t = 9999,
                    r = 0,
                    n = 0,
                    l = 0,
                    f = 0,
                    s = 0,
                    h = 0;
            if (e.responsiveLevels && (jQuery.each(e.responsiveLevels, function (e, f) {
                f > i && (t = r = f, l = e), i > f && f > r && (r = f, n = e)
            }), t > r && (l = n)), f = e.gridheight[l] || e.gridheight[0] || e.gridheight, s = e.gridwidth[l] || e.gridwidth[0] || e.gridwidth, h = i / s, h = h > 1 ? 1 : h, f = Math.round(h * f), "fullscreen" == e.sliderLayout) {
                var u = (e.c.width(), jQuery(window).height());
                if (void 0 != e.fullScreenOffsetContainer) {
                    var c = e.fullScreenOffsetContainer.split(",");
                    if (c)
                        jQuery.each(c, function (e, i) {
                            u = jQuery(i).length > 0 ? u - jQuery(i).outerHeight(!0) : u
                        }), e.fullScreenOffset.split("%").length > 1 && void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 ? u -= jQuery(window).height() * parseInt(e.fullScreenOffset, 0) / 100 : void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 && (u -= parseInt(e.fullScreenOffset, 0))
                }
                f = u
            } else
                void 0 != e.minHeight && f < e.minHeight && (f = e.minHeight);
            e.c.closest(".rev_slider_wrapper").css({
                height: f
            })
        } catch (d) {
            console.log("Failure at Presize of Slider:" + d)
        }
    }
    ;


    var gemSettings = {
        "isTouch": "",
        "forcedLasyDisabled": "",
        "tabletPortrait": "1",
        "tabletLandscape": "",
        "topAreaMobileDisable": "",
        "parallaxDisabled": "",
        "fillTopArea": "",
        "themePath": "http:\/\/codex-themes.com\/thegem\/wp-content\/themes\/thegem",
        "rootUrl": "http:\/\/codex-themes.com\/thegem",
        "mobileEffectsEnabled": "",
        "isRTL": ""
    };
    (function () {
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.MaxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        }

        window.gemSettings.isTouch = isTouchDevice();

        function userAgentDetection() {
            var ua = navigator.userAgent.toLowerCase(),
                    platform = navigator.platform.toLowerCase(),
                    UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
                    mode = UA[1] == 'ie' && document.documentMode;

            window.gemBrowser = {
                name: (UA[1] == 'version') ? UA[3] : UA[1],
                version: UA[2],
                platform: {
                    name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
                }
            };
        }

        window.updateGemClientSize = function () {
            if (window.gemOptions == null || window.gemOptions == undefined) {
                window.gemOptions = {
                    first: false,
                    clientWidth: 0,
                    clientHeight: 0,
                    innerWidth: -1
                };
            }

            window.gemOptions.clientWidth = window.innerWidth || document.documentElement.clientWidth;
            if (document.body != null && !window.gemOptions.clientWidth) {
                window.gemOptions.clientWidth = document.body.clientWidth;
            }

            window.gemOptions.clientHeight = window.innerHeight || document.documentElement.clientHeight;
            if (document.body != null && !window.gemOptions.clientHeight) {
                window.gemOptions.clientHeight = document.body.clientHeight;
            }
        };

        window.updateGemInnerSize = function (width) {
            window.gemOptions.innerWidth = width != undefined ? width : (document.body != null ? document.body.clientWidth : 0);
        };

        userAgentDetection();
        window.updateGemClientSize(true);

        window.gemSettings.lasyDisabled = window.gemSettings.forcedLasyDisabled || (!window.gemSettings.mobileEffectsEnabled && (window.gemSettings.isTouch || window.gemOptions.clientWidth <= 800));
    })();
    (function () {
        if (window.gemBrowser.name == 'safari') {
            try {
                var safariVersion = parseInt(window.gemBrowser.version);
            } catch (e) {
                var safariVersion = 0;
            }
            if (safariVersion >= 9) {
                window.gemSettings.parallaxDisabled = true;
                window.gemSettings.fillTopArea = true;
            }
        }
    })();
    (function () {
        var fullwithData = {
            page: null,
            pageWidth: 0,
            pageOffset: {},
            fixVcRow: true,
            pagePaddingLeft: 0
        };

        function updateFullwidthData() {
            fullwithData.pageOffset = fullwithData.page.getBoundingClientRect();
            fullwithData.pageWidth = parseFloat(fullwithData.pageOffset.width);
            fullwithData.pagePaddingLeft = 0;

            if (fullwithData.page.className.indexOf('vertical-header') != -1) {
                fullwithData.pagePaddingLeft = 45;
                if (fullwithData.pageWidth >= 1600) {
                    fullwithData.pagePaddingLeft = 360;
                }
                if (fullwithData.pageWidth < 980) {
                    fullwithData.pagePaddingLeft = 0;
                }
            }
        }

        function gem_fix_fullwidth_position(element) {
            if (element == null) {
                return false;
            }

            if (fullwithData.page == null) {
                fullwithData.page = document.getElementById('page');
                updateFullwidthData();
            }

            if (fullwithData.pageWidth < 1170) {
                return false;
            }

            if (!fullwithData.fixVcRow) {
                return false;
            }

            if (element.previousElementSibling != null && element.previousElementSibling != undefined && element.previousElementSibling.className.indexOf('fullwidth-block') == -1) {
                var elementParentViewportOffset = element.previousElementSibling.getBoundingClientRect();
            } else {
                var elementParentViewportOffset = element.parentNode.getBoundingClientRect();
            }

            if (elementParentViewportOffset.top > window.gemOptions.clientHeight) {
                fullwithData.fixVcRow = false;
                return false;
            }

            if (element.className.indexOf('vc_row') != -1) {
                var elementMarginLeft = -21;
                var elementMarginRight = -21;
            } else {
                var elementMarginLeft = 0;
                var elementMarginRight = 0;
            }

            var offset = parseInt(fullwithData.pageOffset.left + 0.5) - parseInt((elementParentViewportOffset.left < 0 ? 0 : elementParentViewportOffset.left) + 0.5) - elementMarginLeft + fullwithData.pagePaddingLeft;
            var offsetKey = window.gemSettings.isRTL ? 'right' : 'left';

            element.style.position = 'relative';
            element.style[offsetKey] = offset + 'px';
            element.style.width = fullwithData.pageWidth - fullwithData.pagePaddingLeft + 'px';

            if (element.className.indexOf('vc_row') == -1) {
                element.setAttribute('data-fullwidth-updated', 1);
            }

            if (element.className.indexOf('vc_row') != -1 && !element.hasAttribute('data-vc-stretch-content')) {
                var el_full = element.parentNode.querySelector('.vc_row-full-width-before');
                var padding = -1 * offset;
                0 > padding && (padding = 0);
                var paddingRight = fullwithData.pageWidth - padding - el_full.offsetWidth + elementMarginLeft + elementMarginRight;
                0 > paddingRight && (paddingRight = 0);
                element.style.paddingLeft = padding + 'px';
                element.style.paddingRight = paddingRight + 'px';
            }
        }

        window.gem_fix_fullwidth_position = gem_fix_fullwidth_position;

        if (window.gemSettings.isTouch) {
            setTimeout(function () {
                var head = document.getElementsByTagName('head')[0],
                        link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = window.gemSettings.themePath + '/css/thegem-touch.css';
                head.appendChild(link);
            }, 1000);
        }

        if (window.gemSettings.lasyDisabled && !window.gemSettings.forcedLasyDisabled) {
            setTimeout(function () {
                var head = document.getElementsByTagName('head')[0],
                        link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = window.gemSettings.themePath + '/css/thegem-effects-disabled.css';
                head.appendChild(link);
            }, 1000);
        }

        if (window.gemSettings.parallaxDisabled) {
            var head = document.getElementsByTagName('head')[0],
                    link = document.createElement('style');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.innerHTML = ".fullwidth-block.fullwidth-block-parallax-vertical .fullwidth-block-background, .fullwidth-block.fullwidth-block-parallax-fixed .fullwidth-block-background { background-attachment: scroll !important; }";
            head.appendChild(link);
        }
    })();

    (function () {
        setTimeout(function () {
            var preloader = document.getElementById('page-preloader');
            if (preloader != null && preloader != undefined) {
                preloader.className += ' preloader-loaded';
            }
        }, window.pagePreloaderHideTime || 1000);
    })();

    function revslider_showDoubleJqueryError(sliderID) {
        var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
        errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
        errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
        errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
        errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>";
        jQuery(sliderID).show().html(errorMessage);
    }
    /* <![CDATA[ */
    var thegem_dlmenu_settings = {
        "backLabel": "Back",
        "showCurrentLabel": "Show this page"
    };
    /* ]]> */

    /* <![CDATA[ */
    var wpcf7 = {
        "apiSettings": {
            "root": "http:\/\/codex-themes.com\/thegem\/wp-json\/contact-form-7\/v1",
            "namespace": "contact-form-7\/v1"
        },
        "recaptcha": {
            "messages": {
                "empty": "Please verify that you are not a robot."
            }
        },
        "cached": "1"
    };
    /* ]]> */

    /* <![CDATA[ */
    var woocommerce_params = {
        "ajax_url": "\/thegem\/wp-admin\/admin-ajax.php",
        "wc_ajax_url": "\/thegem\/interior-sparta\/?wc-ajax=%%endpoint%%"
    };
    /* ]]> */

    /* <![CDATA[ */
    var wc_cart_fragments_params = {
        "ajax_url": "\/thegem\/wp-admin\/admin-ajax.php",
        "wc_ajax_url": "\/thegem\/interior-sparta\/?wc-ajax=%%endpoint%%",
        "fragment_name": "wc_fragments_f83a613d55fa152edf7eee7319908b0a"
    };
    /* ]]> */

    /* <![CDATA[ */
    var yith_wcwl_l10n = {
        "ajax_url": "\/thegem\/wp-admin\/admin-ajax.php",
        "redirect_to_cart": "no",
        "multi_wishlist": "",
        "hide_add_button": "1",
        "is_user_logged_in": "",
        "ajax_loader_url": "http:\/\/codex-themes.com\/thegem\/wp-content\/plugins\/yith-woocommerce-wishlist\/assets\/images\/ajax-loader.gif",
        "remove_from_wishlist_after_add_to_cart": "yes",
        "labels": {
            "cookie_disabled": "We are sorry, but this feature is available only if cookies are enabled on your browser.",
            "added_to_cart_message": "<div class=\"woocommerce-message\">Product correctly added to cart<\/div>"
        },
        "actions": {
            "add_to_wishlist_action": "add_to_wishlist",
            "remove_from_wishlist_action": "remove_from_wishlist",
            "move_to_another_wishlist_action": "move_to_another_wishlsit",
            "reload_wishlist_and_adding_elem_action": "reload_wishlist_and_adding_elem"
        }
    };
    /* ]]> */

    /* <![CDATA[ */
    var zilla_likes = {
        "ajaxurl": "http:\/\/codex-themes.com\/thegem\/wp-admin\/admin-ajax.php"
    };
    /* ]]> */

    /* <![CDATA[ */
    var wc_add_to_cart_params = {
        "ajax_url": "\/thegem\/wp-admin\/admin-ajax.php",
        "wc_ajax_url": "\/thegem\/interior-sparta\/?wc-ajax=%%endpoint%%",
        "i18n_view_cart": "View cart",
        "cart_url": "http:\/\/codex-themes.com\/thegem\/cart\/",
        "is_cart": "",
        "cart_redirect_after_add": "no"
    };
    /* ]]> */

    /* <![CDATA[ */

    var portfolio_ajax_36de7e0 = {
        "data": {
            "portfolio": "planta1,planta2,planta3,planta4,planta5",
            "title": "",
            "layout": "100%",
            "layout_version": "fullwidth",
            "caption_position": "right",
            "style": "masonry",
            "gaps_size": "0",
            "display_titles": "hover",
            "background_style": "white",
            "title_style": "light",
            "hover": "zooming-blur",
            "pagination": "normal",
            "loading_animation": "move-up",
            "items_per_page": 8,
            "with_filter": "1",
            "show_info": "",
            "is_ajax": false,
            "disable_socials": "",
            "fullwidth_columns": "4",
            "likes": false,
            "sorting": false,
            "all_text": "Show All",
            "orderby": "",
            "order": "",
            "button": {
                "text": "Load More",
                "style": "flat",
                "size": "medium",
                "text_weight": "normal",
                "no_uppercase": 0,
                "corner": 25,
                "border": 2,
                "text_color": "",
                "background_color": "#00bcd5",
                "border_color": "",
                "hover_text_color": "",
                "hover_background_color": "",
                "hover_border_color": "",
                "icon_pack": "elegant",
                "icon_elegant": "",
                "icon_material": "",
                "icon_fontawesome": "",
                "icon_userpack": "",
                "icon_position": "left",
                "separator": "load-more",
                "icon": ""
            },
            "metro_max_row_height": "380"
        },
        "url": "http:\/\/codex-themes.com\/thegem\/wp-admin\/admin-ajax.php",
        "nonce": "3e4e54b56f"
    };
    /* ]]> */

    /* <![CDATA[ */
    var mejsL10n = {
        "language": "en-US",
        "strings": {
            "Close": "Close",
            "Fullscreen": "Fullscreen",
            "Turn off Fullscreen": "Turn off Fullscreen",
            "Go Fullscreen": "Go Fullscreen",
            "Download File": "Download File",
            "Download Video": "Download Video",
            "Play": "Play",
            "Pause": "Pause",
            "Captions\/Subtitles": "Captions\/Subtitles",
            "None": "None",
            "Time Slider": "Time Slider",
            "Skip back %1 seconds": "Skip back %1 seconds",
            "Video Player": "Video Player",
            "Audio Player": "Audio Player",
            "Volume Slider": "Volume Slider",
            "Mute Toggle": "Mute Toggle",
            "Unmute": "Unmute",
            "Mute": "Mute",
            "Use Up\/Down Arrow keys to increase or decrease volume.": "Use Up\/Down Arrow keys to increase or decrease volume.",
            "Use Left\/Right Arrow keys to advance one second, Up\/Down arrows to advance ten seconds.": "Use Left\/Right Arrow keys to advance one second, Up\/Down arrows to advance ten seconds."
        }
    };
    var _wpmejsSettings = {
        "pluginPath": "\/thegem\/wp-includes\/js\/mediaelement\/",
        "hideVideoControlsOnLoad": "1",
        "audioVolume": "vertical"
    };
    /* ]]> */

    var htmlDiv = document.getElementById("rs-plugin-settings-inline-css");
    var htmlDivCss = "";
    if (htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    } else {
        var htmlDiv = document.createElement("div");
        htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
        document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
    }

    var htmlDiv = document.getElementById("rs-plugin-settings-inline-css");
    var htmlDivCss = "";
    if (htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    } else {
        var htmlDiv = document.createElement("div");
        htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
        document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
    }

    setREVStartSize({
        c: jQuery('#rev_slider_62_1'),
        responsiveLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1025, 778, 480],
        gridheight: [868, 768, 960, 720],
        sliderLayout: 'fullscreen',
        fullScreenAutoWidth: 'off',
        fullScreenAlignForce: 'off',
        fullScreenOffsetContainer: '',
        fullScreenOffset: ''
    });

    var revapi62,
            tpj = jQuery;

    tpj(document).ready(function () {
        if (tpj("#rev_slider_62_1").revolution == undefined) {
            revslider_showDoubleJqueryError("#rev_slider_62_1");
        } else {
            revapi62 = tpj("#rev_slider_62_1").show().revolution({
                sliderType: "standard",
                jsFileLocation: "//codex-themes.com/thegem/wp-content/plugins/revslider/public/assets/js/",
                sliderLayout: "fullscreen",
                dottedOverlay: "none",
                delay: 9000,
                navigation: {
                    keyboardNavigation: "off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation: "off",
                    mouseScrollReverse: "default",
                    onHoverStop: "off",
                    arrows: {
                        style: "uranus",
                        enable: false,
                        hide_onmobile: true,
                        hide_under: 480,
                        hide_onleave: false,
                        tmp: '',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        enable: true,
                        hide_onmobile: false,
                        hide_over: 480,
                        style: "uranus",
                        hide_onleave: false,
                        direction: "horizontal",
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20,
                        space: 20,
                        tmp: '<span class="tp-bullet-inner"></span>'
                    }
                },
                responsiveLevels: [1240, 1024, 778, 480],
                visibilityLevels: [1240, 1024, 778, 480],
                gridwidth: [1240, 1025, 778, 480],
                gridheight: [868, 768, 960, 720],
                lazyType: "none",
                shadow: 0,
                spinner: "spinner2",
                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                shuffle: "off",
                autoHeight: "off",
                fullScreenAutoWidth: "off",
                fullScreenAlignForce: "off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "",
                disableProgressBar: "on",
                hideThumbsOnMobile: "off",
                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                debugMode: false,
                fallbacks: {
                    simplifyAll: "off",
                    nextSlideOnWindowFocus: "off",
                    disableFocusListener: false,
                }
            });
        }

    }); /*ready*/

    var htmlDivCss = ' #rev_slider_62_1_wrapper .tp-loader.spinner2{ background-color: #FFFFFF !important; } ';
    var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
    if (htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    } else {
        var htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
        document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
    }

    var htmlDivCss = unescape("body%20.slideshow-preloader%20%7B%0A%09height%3A%20100vh%3B%0A%7D");
    var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
    if (htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    } else {
        var htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
        document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
    }

    var htmlDivCss = unescape("%23rev_slider_62_1%20.uranus.tparrows%20%7B%0A%20%20width%3A50px%3B%0A%20%20height%3A50px%3B%0A%20%20background%3Argba%28255%2C255%2C255%2C0%29%3B%0A%20%7D%0A%20%23rev_slider_62_1%20.uranus.tparrows%3Abefore%20%7B%0A%20width%3A50px%3B%0A%20height%3A50px%3B%0A%20line-height%3A50px%3B%0A%20font-size%3A40px%3B%0A%20transition%3Aall%200.3s%3B%0A-webkit-transition%3Aall%200.3s%3B%0A%20%7D%0A%20%0A%20%20%23rev_slider_62_1%20.uranus.tparrows%3Ahover%3Abefore%20%7B%0A%20%20%20%20opacity%3A0.75%3B%0A%20%20%7D%0A%23rev_slider_62_1%20.uranus%20.tp-bullet%7B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20box-shadow%3A%200%200%200%202px%20rgba%28255%2C%20255%2C%20255%2C%200%29%3B%0A%20%20-webkit-transition%3A%20box-shadow%200.3s%20ease%3B%0A%20%20transition%3A%20box-shadow%200.3s%20ease%3B%0A%20%20background%3Atransparent%3B%0A%20%20width%3A15px%3B%0A%20%20height%3A15px%3B%0A%7D%0A%23rev_slider_62_1%20.uranus%20.tp-bullet.selected%2C%0A%23rev_slider_62_1%20.uranus%20.tp-bullet%3Ahover%20%7B%0A%20%20box-shadow%3A%200%200%200%202px%20rgba%28255%2C%20255%2C%20255%2C1%29%3B%0A%20%20border%3Anone%3B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20background%3Atransparent%3B%0A%7D%0A%0A%23rev_slider_62_1%20.uranus%20.tp-bullet-inner%20%7B%0A%20%20-webkit-transition%3A%20background-color%200.3s%20ease%2C%20-webkit-transform%200.3s%20ease%3B%0A%20%20transition%3A%20background-color%200.3s%20ease%2C%20transform%200.3s%20ease%3B%0A%20%20top%3A%200%3B%0A%20%20left%3A%200%3B%0A%20%20width%3A%20100%25%3B%0A%20%20height%3A%20100%25%3B%0A%20%20outline%3A%20none%3B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20background-color%3A%20rgb%28255%2C%20255%2C%20255%29%3B%0A%20%20background-color%3A%20rgba%28255%2C%20255%2C%20255%2C%200.3%29%3B%0A%20%20text-indent%3A%20-999em%3B%0A%20%20cursor%3A%20pointer%3B%0A%20%20position%3A%20absolute%3B%0A%7D%0A%0A%23rev_slider_62_1%20.uranus%20.tp-bullet.selected%20.tp-bullet-inner%2C%0A%23rev_slider_62_1%20.uranus%20.tp-bullet%3Ahover%20.tp-bullet-inner%7B%0A%20transform%3A%20scale%280.4%29%3B%0A%20-webkit-transform%3A%20scale%280.4%29%3B%0A%20background-color%3Argb%28255%2C%20255%2C%20255%29%3B%0A%7D%0A");
    var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
    if (htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    } else {
        var htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
        document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
    }



    jQuery(document).ready(function () {
        jQuery('.slidergaleria').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
        });

        setInterval(function () {
            jQuery('.slidergaleria').slick('slickNext');
        }, 2500);

        jQuery(document).on('keypress', function (event) {
            ///////////////////////////////////////////////////////////////// CUANDO EL OPERADOR NAVEGA HACIA LOS LATERALES
            if (event.keyCode == 100) {
                jQuery('.slider-nav').slick('slickNext');
            }
            if (event.keyCode == 97) {
                jQuery('.slider-nav').slick('slickPrev');
            }
            console.log(event.keyCode);
        });

        if (typeof (gem_fix_fullwidth_position) == "function") {
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a9ebed9409a3"));
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a9ebed940b57"));
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a9ebed940b577"));
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a9ebed944ca1"));
            gem_fix_fullwidth_position(document.getElementById("fullwidth-block-5a9ebed94673f"));
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996667d1cc"));
            gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996666f010"));
        }
    });
</script>