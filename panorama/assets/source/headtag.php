<?php
/*
 * BurtonTech Team Dev Project
 *  Kopimi at your own fancy  * 
 *  AECONSTRUCTORA   * 
 */
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AE Constructora &#8211; Panorama II</title>
<link rel='stylesheet' id='icons-fontawesome-css' href='assets/css/icons-fontawesome4a41.css?ver=4.8.2' type='text/css' media='all' />
<link rel='stylesheet' id='icons-elegant-css' href='assets/css/icons-elegant4a41.css?ver=4.8.2' type='text/css' media='all' />
<link rel='stylesheet' id='thegem-portfolio-group-css' href='assets/css/portfolio.css' type='text/css' media='all' />
<link rel='stylesheet' id='icons-material-css' href='assets/css/icons-material4a41.css?ver=4.8.2' type='text/css' media='all' />
<link rel="icon" href="assets/img/logoae2.png" sizes="32x32" />
<link rel="icon" href="assets/img/logoae2.png" sizes="192x192" />
<link rel="apple-touch-icon-precomposed" href="assets/img/logoae2.png" />
<link rel='stylesheet' id='thegem-google-fonts-css' href='http://fonts.googleapis.com/css?family=Montserrat%3A700%2Cregular%7CSource+Sans+Pro%3Aregular%2C300&amp;subset=vietnamese%2Clatin-ext%2Clatin&amp;ver=4.8.2' type='text/css' media='all' />
<link rel='stylesheet' id='thegem-preloader-group-css' href='assets/css/preload.css' type='text/css' media='all' />
<link rel="stylesheet" type="text/css" href="assets/css/slick.css"/>
<link rel="stylesheet" type="text/css" href="assets/css/slick-theme.css"/>
<script type='text/javascript' src='assets/js/jquery.js'></script>
<script type="text/javascript">
    document.documentElement.className = document.documentElement.className + ' yes-js js_active js'
</script>
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
</script>

<style>
    .wishlist_table .add_to_cart,
    a.add_to_wishlist.button.alt {
        border-radius: 16px;
        -moz-border-radius: 16px;
        -webkit-border-radius: 16px
    }
</style>
<style id='thegem-preloader-inline-css' type='text/css'>
    body:not(.compose-mode) .gem-icon .gem-icon-half-1,
    body:not(.compose-mode) .gem-icon .gem-icon-half-2 {
        opacity: 0 !important
    }
</style>
<style id='thegem-reset-inline-css' type='text/css'>
    .fullwidth-block {
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0)
    }
</style>
<style id='rs-plugin-settings-inline-css' type='text/css'>
    #rs-demo-id {}
</style>
<style type="text/css">
    .recentcomments a {
        display: inline !important;
        padding: 0 !important;
        margin: 0 !important
    }
</style>
<style type="text/css" data-type="vc_custom-css">
    @media (max-width: 1199px) {
        .wpb_row {
            margin-top: 0
        }
        .wpb_row>* {
            margin-top: 0
        }
    }

    @media (max-width: 1199px) {
        .row {
            margin-top: 0
        }
        .row>* {
            margin-top: 0
        }
    }

    #primary-navigation .hamburger-toggle>span {
        background: #fff
    }

    .shrink #primary-navigation .hamburger-toggle>span {
        background: #313131
    }

    .quickfinder.quickfinder-binded {
        padding: 0 0 10px 0
    }

    .quickfinder-binded .quickfinder-item-box {
        padding: 50px
    }

    .quickfinder-binded .inline-column {
        margin-bottom: 0
    }

    .gem-divider-style-2 {
        z-index: 1
    }

    .title-our {
        letter-spacing: 10px
    }

    .title-latest-project span,
    .title-letshere span {
        letter-spacing: 9px
    }

    .title-livingroom span {
        letter-spacing: 5px
    }

    .portfolio-filters a {
        background: #5c5c5c
    }

    .portfolio-filters a:hover {
        background: #756859
    }

    .portfolio-filters a.active {
        background: #939ce5
    }

    .portfolio-filters .title-h6 .light {
        color: #c4c0bc
    }

    .portfolio-filters a.title-h6:hover .light,
    .portfolio-filters .title-h6.active .light {
        color: #fff
    }

    .team-person-email a,
    .gem-team-style-5 .team-person:hover .team-person-name,
    .team-person-socials .socials-item,
    .gem-testimonial-name,
    .gem-testimonials.style1 .gem-testimonial-wrapper:after {
        color: #939ce5
    }

    .gem-prev:hover:after,
    .gem-next:hover:after {
        background: #939ce5 !important
    }

    .gem-team-style-5 .team-person .image-hover {
        border-color: #eee2d2
    }

    .gem-team-style-5 .team-person:hover .image-hover {
        background: #939ce5;
        border-color: #939ce5
    }

    .gem-testimonial-company,
    .gem-testimonial-text p {
        color: #fff
    }

    .gem-clients-type-carousel-grid .gem-client-item a {
        background: transparent
    }

    .fullwidth-block:hover .gem-testimonials.fullwidth-block .gem-prev:after,
    .fullwidth-block:hover .gem-testimonials.fullwidth-block .gem-next:after {
        background-color: #939ce5
    }

    footer#colophon,
    footer#footer-nav {
        background: #1e1e1e
    }

    footer .widget-title:after,
    footer .mc-text span,
    footer#colophon .gem-pp-posts-date,
    footer#colophon .widget a:hover,
    footer#colophon .gem-contacts .gem-contacts-item.gem-contacts-website a,
    footer#footer-nav .footer-site-info a,
    footer#colophon .gem-contacts .gem-contacts-item.gem-contacts-email a {
        color: #939ce5
    }

    footer#colophon .textwidget li:before,
    footer#colophon .gem-mini-pagination a.selected {
        background: #939ce5
    }

    footer#colophon #mc4wp_email {
        border-color: #939ce5;
        background: #191919
    }

    footer#colophon #mc4wp_submit,
    footer#colophon #mc4wp_submit:hover {
        background: #939ce5;
        color: #191919
    }

    #colophon input[type="text"],
    #colophon input[type="email"],
    #colophon .wpcf7-form-control-wrap textarea {
        border-color: #313131;
        background: #191919
    }

    #colophon input[type="text"]:focus,
    #colophon input[type="email"]:focus,
    #colophon .wpcf7-form-control-wrap textarea:focus {
        border-color: #939ce5
    }

    #colophon .wpcf7 .wpcf7-form .contact-form-footer .wpcf7-submit {
        background: #313131
    }

    #colophon .wpcf7 .wpcf7-form .contact-form-footer .wpcf7-submit:hover {
        background: #191919;
        color: #fff
    }

    #colophon.site-footer .gem-contacts-item.gem-contacts-address,
    #colophon .Custom_Recent_Posts ul li:not(:last-child),
    #colophon .site-footer .widget_text ul li:not(:last-child) {
        border-bottom-color: #313131
    }

    #footer-nav {
        border-top-color: #313131
    }

    #colophon .widget .gem-dummy {
        background: #4b565d
    }
</style>
<style type="text/css" data-type="vc_shortcodes-custom-css">
    
    .vc_custom_1463751373158 {
        margin-bottom: 0px !important;
        background-image: url(http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/05/dark_background.jpg) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important
    }
    
    .vc_custom_1459858176418 {
        margin-bottom: 0px !important
    }

    .vc_custom_1461148598737 {
        margin-bottom: 20px !important
    }

    .vc_custom_1459856528613 {
        margin-bottom: 0px !important;
        background-color: #3b3b3b !important
    }

    .vc_custom_14598565286133 {
        margin-bottom: 0px !important;
        background-color: #3b3b3b !important
    }

    .vc_custom_1459929330948 {
        margin-bottom: 0px !important;
        background-color: #3b3b3b !important
    }


    .vc_custom_1463754812407 {
        margin-bottom: 0px !important
    }

    .vc_custom_1459862102781 {
        margin-bottom: 0px !important;
        border-top-width: 42px !important;
        border-right-width: 42px !important;
        border-bottom-width: 42px !important;
        border-left-width: 42px !important;
        background-image: url(uploads/2016/04/7-2.jpg) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        border-left-color: #fff !important;
        border-left-style: solid !important;
        border-right-color: #fff !important;
        border-right-style: solid !important;
        border-top-color: #fff !important;
        border-top-style: solid !important;
        border-bottom-color: #fff !important;
        border-bottom-style: solid !important
    }

    .vc_custom_1459865822730 {
        margin-bottom: 0px !important;
        background-image: url(http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/04/6-2.jpg) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important
    }

    .vc_custom_1459869513430 {
        margin-bottom: 0px !important;
        background-image: url(http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/04/3-2.jpg) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important
    }

    .vc_custom_1459854746176 {
        padding-right: 0px !important;
        padding-left: 0px !important
    }

    .vc_custom_1461148814173 {
        padding-right: 0px !important;
        padding-left: 0px !important
    }

    .vc_custom_1459955499840 {
        margin-top: -5px !important;
        margin-bottom: -30px !important;
        padding-right: 0px !important;
        padding-left: 0px !important
    }


    .vc_custom_1463740191072 {
        margin-bottom: 0px !important;
        background-image: url(http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/05/construction01_about_us_background.png) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important
    }

    .vc_custom_1461148978687 {
        margin-top: -123px !important;
        padding-right: 0px !important;
        padding-left: 42px !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important
    }

    .vc_custom_1459858341356 {
        padding-top: 20px !important
    }

    .vc_custom_1459955728792 {
        padding-right: 0px !important;
        padding-left: 0px !important;
        background-color: rgba(255, 255, 255, 0.81) !important;
        *background-color: rgb(255, 255, 255) !important
    }

    .vc_custom_1459862170172 {
        padding-right: 40px !important;
        padding-left: 40px !important
    }

    .vc_custom_1459859779871 {
        padding-bottom: 10px !important
    }

    .vc_custom_1459862254804 {
        padding-top: 20px !important
    }

    .vc_custom_1459865778329 {
        padding-top: 70px !important
    }

    .vc_custom_1459868353338 {
        padding-top: 60px !important
    }
</style>
<noscript><style type="text/css">.wpb_animate_when_almost_visible{opacity:1}</style></noscript>