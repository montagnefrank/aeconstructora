<?php
$r = rand(1, 3);
if ($r == 1) {
    $active1 = "vc_active";
    $active2 = "";
    $active3 = "";
}if ($r == 2) {
    $active1 = "";
    $active2 = "vc_active";
    $active3 = "";
}if ($r == 3) {
    $active1 = "";
    $active2 = "";
    $active3 = "vc_active";
}
?>
<!DOCTYPE html>
<html lang="en-US" >
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AE Constructora Inmobiliaria - 20 a&ntilde;os edificando sue&ntilde;os</title>
        <link rel='stylesheet' id='thegem-preloader-group-css' href='assets/css/style.css' type='text/css' media='all' />
        <link rel='stylesheet' id='thegem-google-fonts-css' href='http://fonts.googleapis.com/css?family=Montserrat%3A700%2Cregular%7CSource+Sans+Pro%3Aregular%2C300&amp;subset=vietnamese%2Clatin-ext%2Clatin&amp;ver=4.8.2' type='text/css' media='all' />
        <link rel="icon" href="assets/img/logoae2.png"  />
        <?php require ("assets/scripts/headstyles.php"); ?>
        <link rel='stylesheet' id='thegem-preloader-group-css' href='assets/css/preload.css' type='text/css' media='all' />
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
    </head>
    <body class="page-template-default page page-id-24405 wpb-js-composer js-comp-ver-5.2.1 vc_responsive">
        <script type="text/javascript">
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

            
        </script>
        <div id="page" class="layout-fullwidth header-style-3"><a href="#page" class="scroll-top-button"></a>
            <div id="site-header-wrapper" class="site-header-wrapper-transparent ">
                <div class="menu-overlay"></div>
                <header id="site-header" class="site-header animated-header mobile-menu-layout-overlay" role="banner">
                    <div class="transparent-header-background" style="background-color: rgba(255, 255, 255, 0);">
                        <div class="container">
                            <div class="header-main logo-position-left header-colors-light header-layout-default header-style-3">
                                <div class="site-title">
                                    <div class="site-logo" style="width:164px;"> <a href="index.php" rel="home"> 
                                            <span class="logo">
                                                <img src="assets/img/logoae.png" srcset="assets/img/logoae.png 1x,assets/img/logoae.png 2x,assets/img/logoae.png? 3x" alt="AEConstructora" style="width:80px;" class="default"/>
                                                <img src="assets/img/logoae.png" srcset="assets/img/logoae.png 1x,assets/img/logoae.png 2x,assets/img/logoae.png? 3x" alt="AEConstructora" style="width:60px;" class="small light"/>
                                                <img src="assets/img/logo2.png" srcset="assets/img/logo2.png 1x,assets/img/logo2.png 2x,assets/img/logo2.png? 3x" alt="AEConstructora" style="width:200px;" class="small"/>
                                            </span> 
                                        </a>
                                    </div>
                                </div>
                                <nav id="primary-navigation" class="site-navigation primary-navigation" role="navigation"> <button class="menu-toggle dl-trigger">Primary Menu<span
                                            class="menu-line-1"></span><span
                                            class="menu-line-2"></span><span
                                            class="menu-line-3"></span></button>
                                    <div class="overlay-menu-wrapper">
                                        <div class="overlay-menu-table">
                                            <div class="overlay-menu-row">
                                                <div class="overlay-menu-cell">
                                                    <ul id="primary-menu" class="nav-menu styled no-responsive">
                                                        <li id="menu-item-28423" 
                                                            class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-parent menu-item-28423 megamenu-first-element">
                                                            <a href="#main_slider_aec">Inicio</a>
                                                        </li>
                                                        <li id="menu-item-28423" 
                                                            class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-parent menu-item-28423 megamenu-first-element">
                                                            <a href="#vc_row-5a7996666b219">AEConstructora</a>
                                                        </li>
                                                        <li id="menu-item-28423" 
                                                            class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-parent menu-item-28423 megamenu-first-element">
                                                            <a href="#vc_row-5a7996666ee7b">Proyectos</a>
                                                        </li>
                                                        <li id="menu-item-28423" 
                                                            class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-parent menu-item-28423 megamenu-first-element">
                                                            <a href="#vc_row-5a79966676472">Financiamiento</a>
                                                        </li>
                                                        <li id="menu-item-28423" 
                                                            class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-parent menu-item-28423 megamenu-first-element">
                                                            <a href="#vc_row-5a7996667d1cc">Contacto</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            <div id="main" class="site-main">
                <div id="main-content" class="main-content">
                    <div class="preloader slideshow-preloader" style="height: 100vh;background-color: #2c2e3d">
                    <div class="preloader-spin"></div>
                </div>
                    <div id="main_slider_aec" class="gem-slideshow">
                    <link href="http://fonts.googleapis.com/css?family=Montserrat:700%2C400%7CPermanent+Marker:400" rel="stylesheet" property="stylesheet" type="text/css" media="all">
                    <div id="rev_slider_55_1_wrapper" class="rev_slider_wrapper fullwidthbanner-container" data-source="gallery" style="margin:0px auto;background:#2c2e3d;padding:0px;margin-top:0px;margin-bottom:0px;">
                        <div id="rev_slider_55_1" class="rev_slider fullwidthabanner" style="display:none;" data-version="5.4.5.1">
                            <ul>
                                <li data-index="rs-148" data-transition="slotslide-vertical" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off" data-easein="Power3.easeInOut" data-easeout="Power3.easeInOut" data-masterspeed="1500" data-thumb="http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/04/1_1-2_mini_mini-100x50.jpg" data-delay="8000" data-rotate="0" data-saveperformance="off" data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description=""> <img src="assets/img/1.jpg" alt="" title="1_1-2_mini_mini" width="1920" height="1125" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="off" class="rev-slidebg" data-no-retina>
                                    <div class="tp-caption  " id="slide-148-layer-1" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['315','175','275','120']" data-fontsize="['80','80','50','36']" data-lineheight="['80','80','60','40']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1040,"split":"words","splitdelay":0.2,"speed":1000,"frame":"0","from":"y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;","mask":"x:0px;y:[100%];s:inherit;e:inherit;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","split":"words","splitdelay":0.1,"speed":500,"frame":"999","to":"x:[-100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 5; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 100; color: rgba(255,255,255,1);font-family:Montserrat UltraLight;">Te ayudamos</div>
                                    <div class="tp-caption  " id="slide-148-layer-2" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['405','265','345','170']" data-fontsize="['80','80','50','24']" data-lineheight="['80','80','60',w'32']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1410,"split":"words","splitdelay":0.2,"speed":1000,"frame":"0","from":"y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;","mask":"x:0px;y:[100%];s:inherit;e:inherit;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","split":"words","splitdelay":0.1,"speed":500,"frame":"999","to":"x:[-100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 6; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 700; color: rgba(255,255,255,1);font-family:Montserrat;">A cumplir tus metas</div>
                                    <div class="tp-caption  " id="slide-148-layer-3" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['496','355','415','210']" data-fontsize="['80','80','50','24']" data-lineheight="['80','80','60','32']" data-width="['354','none','none','none']" data-height="['81','none','none','none']" data-whitespace="['normal','nowrap','nowrap','nowrap']" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1790,"split":"words","splitdelay":0.2,"speed":1000,"frame":"0","from":"y:[100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;","mask":"x:0px;y:[100%];s:inherit;e:inherit;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","split":"words","splitdelay":0.1,"speed":500,"frame":"999","to":"x:[-100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 7; min-width: 354px; max-width: 354px; max-width: 81px; max-width: 81px; white-space: normal; font-size: 80px; line-height: 80px; font-weight: 400; color: rgba(0,221,188,1);font-family:Permanent Marker;">AHORA!</div>
                                    <div class="tp-caption  " id="slide-148-layer-4" data-x="['left','left','left','left']" data-hoffset="['50','70','100','31']" data-y="['top','top','top','top']" data-voffset="['630','490','530','280']" data-width="['465','465','415','268']" data-height="['none','none','none','89']" data-whitespace="normal" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":2310,"split":"words","splitdelay":0.1,"speed":2000,"frame":"0","from":"y:300px;z:0;rZ:90deg;sX:1;sY:1;skX:0;skY:0;opacity:0;","to":"o:1;","ease":"Power4.easeInOut"},{"delay":"wait","split":"lines","splitdelay":0.1,"speed":500,"frame":"999","to":"x:[-100%];","mask":"x:inherit;y:inherit;s:inherit;e:inherit;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 8; min-width: 465px; max-width: 465px; white-space: normal; font-size: 16px; line-height: 22px; font-weight: 400; color: rgba(255,255,255,1);font-family:Montserrat;">Somos la empresa que se dedica a construir las ideas que existen en tu mente</div>
                                    <div class="tp-caption tp-shape tp-shapewrapper " id="slide-148-layer-6" data-x="['left','left','left','left']" data-hoffset="['51','70','100','30']" data-y="['top','top','top','top']" data-voffset="['600','460','500','255']" data-width="130" data-height="1" data-whitespace="nowrap" data-type="shape" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1420,"speed":2000,"frame":"0","from":"sX:200;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":700,"frame":"999","to":"sX:1000;opacity:0;","ease":"Power3.easeInOut"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 9;background-color:rgba(0,221,188,1);"></div>
                                </li>
                                <li data-index="rs-149" data-transition="slotslide-horizontal" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off" data-easein="Power3.easeInOut" data-easeout="Power3.easeInOut" data-masterspeed="1500" data-thumb="http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/04/3-25_mini_mini2-100x50.jpg" data-delay="7500" data-rotate="0" data-saveperformance="off" data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description=""> <img src="assets/img/2.jpg" alt="" title="3-25_mini_mini2" width="1920" height="1125" data-bgposition="center center" data-kenburns="on" data-duration="9000" data-ease="Linear.easeNone" data-scalestart="100" data-scaleend="115" data-rotatestart="0" data-rotateend="0" data-blurstart="0" data-blurend="0" data-offsetstart="0 0" data-offsetend="0 0" data-bgparallax="off" class="rev-slidebg" data-no-retina>
                                    <div class="tp-caption  " id="slide-149-layer-1" data-x="['left','left','left','left']" data-hoffset="['49','70','100','30']" data-y="['top','top','top','top']" data-voffset="['314','175','275','120']" data-fontsize="['80','70','50','36']" data-lineheight="['80','80','60','40']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1130,"speed":1300,"frame":"0","from":"x:left;rX:2000deg;opacity:0;","to":"o:1;","ease":"Power3.easeOut"},{"delay":"wait","speed":1000,"frame":"999","to":"y:bottom;opacity:0;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 5; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 100; color: rgba(255,255,255,1);font-family:Montserrat UltraLight;">Creemos en ti</div>
                                    <div class="tp-caption  " id="slide-149-layer-2" data-x="['left','left','left','left']" data-hoffset="['51','70','100','30']" data-y="['top','top','top','top']" data-voffset="['405','265','345','170']" data-fontsize="['80','70','50','24']" data-lineheight="['80','80','60','32']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":1770,"speed":1000,"frame":"0","from":"x:left;rX:2000deg;opacity:0;","to":"o:1;","ease":"Power3.easeOut"},{"delay":"wait","speed":900,"frame":"999","to":"y:bottom;opacity:0;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 6; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 700; color: rgba(255,255,255,1);font-family:Montserrat;">Y en lo que te mereces</div>
                                    <div class="tp-caption  " id="slide-149-layer-3" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['496','355','415','210']" data-fontsize="['80','70','50','24']" data-lineheight="['80','80','60','32']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":2360,"speed":1000,"frame":"0","from":"x:left;rX:2000deg;opacity:0;","to":"o:1;","ease":"Power3.easeOut"},{"delay":"wait","speed":800,"frame":"999","to":"y:bottom;opacity:0;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 7; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 400; color: rgba(0,188,212,1);font-family:Permanent Marker;">Viviendas</div>
                                    <div class="tp-caption  " id="slide-149-layer-4" data-x="['left','left','left','left']" data-hoffset="['50','70','100','31']" data-y="['top','top','top','top']" data-voffset="['630','490','530','280']" data-width="['465','465','465','312']" data-height="none" data-whitespace="normal" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":2850,"split":"words","split_direction":"forward","splitdelay":0.05,"speed":1500,"frame":"0","from":"x:left;rX:2000deg;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":600,"frame":"999","to":"y:bottom;opacity:0;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 8; min-width: 465px; max-width: 465px; white-space: normal; font-size: 16px; line-height: 22px; font-weight: 400; color: rgba(255,255,255,1);font-family:Montserrat;">Contamos con m&aacute;s de 20 a&ntilde;os creando un estilo de vida &uacute;nico para nuestros clientes</div>
                                    <div class="tp-caption tp-shape tp-shapewrapper " id="slide-149-layer-6" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['600','460','500','255']" data-width="130" data-height="1" data-whitespace="nowrap" data-type="shape" data-responsive_offset="off" data-responsive="off" data-frames='[{"delay":3110,"speed":1000,"frame":"0","from":"x:-2000px;sX:3;opacity:1;","to":"o:1;","ease":"Elastic.easeOut"},{"delay":"wait","speed":700,"frame":"999","to":"y:bottom;opacity:0;","ease":"Power3.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 10;background-color:rgba(0,188,212,1);"></div>
                                </li>
                                <li data-index="rs-150" data-transition="cube" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off" data-easein="Power4.easeInOut" data-easeout="Power4.easeInOut" data-masterspeed="500" data-thumb="http://thegem2.codexthemes.netdna-cdn.com/thegem/wp-content/uploads/2016/04/4-25_mini_mini2-100x50.jpg" data-delay="7960" data-rotate="0" data-saveperformance="off" data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description=""> <img src="assets/img/3.jpg" alt="" title="4-25_mini_mini2" width="1920" height="1125" data-bgposition="center center" data-kenburns="on" data-duration="9000" data-ease="Linear.easeNone" data-scalestart="115" data-scaleend="100" data-rotatestart="0" data-rotateend="0" data-blurstart="0" data-blurend="0" data-offsetstart="0 0" data-offsetend="0 0" data-bgparallax="off" class="rev-slidebg" data-no-retina>
                                    <div class="tp-caption  " id="slide-150-layer-4" data-x="['left','left','left','left']" data-hoffset="['50','70','100','31']" data-y="['top','top','top','top']" data-voffset="['630','490','530','280']" data-width="['465','465','465','256']" data-height="['none','none','none','89']" data-whitespace="normal" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"from":"y:-350px;opacity:0;","speed":1000,"to":"o:1;","delay":1200,"ease":"Power4.easeOut"},{"delay":"wait","speed":1000,"to":"x:400px;y:200px;rY:50deg;rZ:-45deg;opacity:0;","ease":"Power4.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 18; min-width: 465px; max-width: 465px; white-space: normal; font-size: 16px; line-height: 22px; font-weight: 400; color: rgba(255,255,255,1);font-family:Montserrat;">Es tu momento de pensar en tu futuro y el de tu familia</div>
                                    <div class="tp-caption tp-shape tp-shapewrapper " id="slide-150-layer-6" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['600','460','500','255']" data-width="130" data-height="1" data-whitespace="nowrap" data-type="shape" data-responsive_offset="off" data-responsive="off" data-frames='[{"from":"y:-350px;opacity:0;","speed":1000,"to":"o:1;","delay":1400,"ease":"Power4.easeOut"},{"delay":"wait","speed":700,"to":"x:200px;y:500px;rZ:180deg;opacity:0;","ease":"Power4.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 19;background-color:rgba(232,225,27,1);"></div>
                                    <div class="tp-caption  " id="slide-150-layer-3" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['497','355','415','210']" data-fontsize="['80','70','50','24']" data-lineheight="['80','80','60','32']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"from":"y:-350px;opacity:0;","speed":1000,"to":"o:1;","delay":1600,"ease":"Power4.easeOut"},{"delay":"wait","speed":1000,"to":"x:500px;y:200px;rY:120deg;rZ:120deg;opacity:0;","ease":"Power4.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 20; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 400; color: rgba(232,225,27,1);font-family:Permanent Marker;">Excelencia</div>
                                    <div class="tp-caption  " id="slide-150-layer-2" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['405','265','345','170']" data-fontsize="['80','70','50','24']" data-lineheight="['80','80','60','32']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"from":"y:-350px;opacity:0;","speed":1000,"to":"o:1;","delay":1800,"ease":"Power4.easeOut"},{"delay":"wait","speed":1000,"to":"x:700px;rX:180deg;rZ:35deg;opacity:0;","ease":"Power4.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 21; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 700; color: rgba(255,255,255,1);font-family:Montserrat;">Que estabas esperando</div>
                                    <div class="tp-caption  " id="slide-150-layer-1" data-x="['left','left','left','left']" data-hoffset="['50','70','100','30']" data-y="['top','top','top','top']" data-voffset="['314','175','275','120']" data-fontsize="['80','70','50','36']" data-lineheight="['80','80','60','40']" data-width="none" data-height="none" data-whitespace="nowrap" data-type="text" data-responsive_offset="off" data-responsive="off" data-frames='[{"from":"y:-350px;opacity:0;","speed":1000,"to":"o:1;","delay":2000,"ease":"Power4.easeOut"},{"delay":"wait","speed":1000,"to":"x:300px;y:-500px;rY:60deg;rZ:-70deg;opacity:0;","ease":"Power4.easeIn"}]' data-textAlign="['left','left','left','left']" data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]" data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]" style="z-index: 22; white-space: nowrap; font-size: 80px; line-height: 80px; font-weight: 100; color: rgba(255,255,255,1);font-family:Montserrat UltraLight;">Somos la inmobiliaria</div>
                                </li>
                            </ul>
                            <div class="tp-bannertimer tp-bottom" style="visibility: hidden !important;"></div>
                        </div>
                    </div>
                </div>
                    <div class="block-content no-bottom-margin no-top-margin">
                        <div class="container">
                            <div class="panel row">
                                <div class="panel-center col-xs-12">
                                    <article id="post-24405" class="post-24405 page type-page status-publish hentry">
                                        <div class="entry-content post-content">
                                            <div class="vc_row-full-width-before"></div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a7996666b219" data-vc-full-width="true" data-vc-full-width-init="false" class="vc_row wpb_row vc_row-fluid vc_custom_1463740191072 vc_row-has-fill">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996666b219"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 100px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-4 vc_col-md-4">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 10px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h1" style="margin-bottom: 20px;"><span style="color: #2c2c2c;">Somos AE Constructora Inmobiliaria</span></div>
                                                                    <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h5"><span class="light" style="color: #737373;">20 a&ntilde;os siendo La empresa l&iacute;der en la industria Inmobiliaria!</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-offset-2 vc_col-lg-6 vc_col-md-offset-0 vc_col-md-8 vc_col-sm-offset-0">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 20px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div id="aboutsidetext_div" class="wpb_wrapper" style="width: 70%;position:  absolute;">
                                                                    <p><span style="color: #8d8d8d;">Nuestro equipo dedicado de trabajadores se esfuerza cada d&iacute;a para hacer realidad los sue&ntilde;os de todos nuestros clientes, trayendo la mejor calidad de inmuebles a los precios m&aacute;s competitivos del mercado y en las mejores ubicaciones del Ecuador.</span></p>
                                                                    <p><span style="color: #8d8d8d;">Con nuestros planes de financiamiento podr&aacute;s adquirir tu inmueble deseado sin necesidad de largos procesos de aprobaci&oacute;n, comun&iacute;cate con nuestros asesores para obtener el plan que se ajusta a tu presupuesto y haz realidad tu sue&ntilde;o de tener tu propia vivienda!.</span></p>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 50px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 85px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a7996666b59c" data-vc-full-width="true" data-vc-full-width-init="false" data-vc-stretch-content="true" class="vc_row wpb_row vc_row-fluid vc_custom_1463741455478">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996666b59c"));
                                                    }
                                                </script>
                                                <div class="custom-bottom-border wpb_column vc_column_container vc_col-sm-4 vc_col-has-fill">
                                                    <div class="vc_column-inner vc_custom_1463743258913" >
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 150px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-10 vc_col-sm-offset-1 vc_col-xs-offset-1 vc_col-xs-10">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h4"><span style="color: #ffffff;">Misi&oacute;n</span></div>
                                                                                    <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="wpb_text_column wpb_content_element  vc_custom_1464000710801">
                                                                                <div class="wpb_wrapper">
                                                                                    <p><span style="color: #ffffff;">Servir a los quite&ntilde;os<br />  con las mejores soluciones de vivienda<br />  que traiga a sus familias seguridad, estabilidad y desarrollo personal.</span></p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 60px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="custom-bottom-border wpb_column vc_column_container vc_col-sm-4 vc_col-has-fill">
                                                    <div class="vc_column-inner vc_custom_1463743266480">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 150px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-10 vc_col-sm-offset-1 vc_col-xs-offset-1 vc_col-xs-10">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h4"><span style="color: #ffffff;">Visi&oacute;n</span></div>
                                                                                    <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="wpb_text_column wpb_content_element  vc_custom_1464000700460">
                                                                                <div class="wpb_wrapper">
                                                                                    <p><span style="color: #ffffff;">Entregar a nuestros clientes soluciones para su seguridad familiar, su calidad de vida y rentabilidad para su inversi&oacute;n. Entregamos viviendas con el mejor servicio, dise&ntilde;o, y la m&aacute;s alta calidad en nuestras construcciones.</span></p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 60px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="custom-bottom-border wpb_column vc_column_container vc_col-sm-4 vc_col-has-fill">
                                                    <div class="vc_column-inner vc_custom_1463743273573">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 150px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-10 vc_col-sm-offset-1 vc_col-xs-offset-1 vc_col-xs-10">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h4"><span style="color: #ffffff;">Valores</span></div>
                                                                                    <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="wpb_text_column wpb_content_element  vc_custom_1464000735115">
                                                                                <div class="wpb_wrapper">
                                                                                    <p><span style="color: #ffffff;">Nuestras acciones est&aacute;n enmarcadas en principios y normas &eacute;ticas de servicio y calidad para nuestros clientes. Valores como: Puntualidad, honestidad, pasi&oacute;n, calidad, son puestas en acci&oacute;n en cada uno de nuestras obras. </span></p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 60px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div id="vc_row-5a7996666bbfe" class="vc_row wpb_row vc_row-fluid vc_custom_1464083253035 vc_row-has-fill">
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 80px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h2" style="text-align: center; margin-bottom: 20px;"><span style="color: #2c2c2c;">NOS DESTACAMOS POR</span></div>
                                                                    <div style="width: 63px; height: 2px; background: #0179bb; margin: 0 auto; text-indent: 9999px;">1</div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 80px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="vc_row-5a7996666bd4c" class="vc_row wpb_row vc_row-fluid crane vc_custom_1464083074533 vc_row-has-fill">
                                                <div class="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-6 vc_col-md-6 vc_hidden-md vc_hidden-sm vc_hidden-xs vc_col-has-fill">
                                                    <div class="vc_column-inner vc_custom_1464085058847">
                                                        <div class="wpb_wrapper">
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="left_crane wpb_column vc_column_container vc_col-sm-9">
                                                                    <div class="vc_column-inner vc_custom_1464086088099">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="quickfinder quickfinder-style-vertical-3 quickfinder-style-vertical quickfinder-icon-position-top quickfinder-alignment-left quickfinder-title-bold">
                                                                                <div id="post-24927" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24927 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Rentabilidad</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con las mejores cuotas del mercado, nuestra meta es ajustarnos a tu presupuesto.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf129;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf129;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div id="post-24929" class="quickfinder-item even quickfinder-item-effect-border-reverse small post-24929 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Elegancia</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Nuestros clientes nos conocen por destacarnos en el el estilo de vida moderno que les ofrecemos.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf32f;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf32f;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div id="post-24930" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24930 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Seguridad</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Nuestros sistemas de vigilancia se encuentran optimizados y preparados para proteger tu estilo de vida.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf217;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf217;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-6 vc_col-md-6 vc_hidden-md vc_hidden-sm vc_hidden-xs vc_col-has-fill">
                                                    <div class="vc_column-inner vc_custom_1464085066992">
                                                        <div class="wpb_wrapper">
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="right_crane wpb_column vc_column_container vc_col-sm-12 vc_col-lg-offset-3 vc_col-lg-9">
                                                                    <div class="vc_column-inner vc_custom_1464086100103">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="quickfinder quickfinder-style-vertical-3 quickfinder-style-vertical quickfinder-icon-position-top quickfinder-alignment-right quickfinder-title-bold">
                                                                                <div id="post-24935" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24935 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4a3;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4a3;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Tangibilidad</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con una gran familia de clientes satisfechos y de proyectos entregados, nuestra mejor carta de presentaci&oacute;n son nuestros clientes felices.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                </div>
                                                                                <div id="post-24936" class="quickfinder-item even quickfinder-item-effect-border-reverse small post-24936 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4fb;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4fb;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Sociable</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Todos cuentan con &aacute;reas y jardines comunales donde conocer&aacute;s propietarios exitosos como tu.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                </div>
                                                                                <div id="post-24937" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24937 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                                    <div class="quickfinder-item-image">
                                                                                        <div class="quickfinder-item-image-content">
                                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4b6;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                                class="back-angle">&#xf4b6;</span></span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                    </div>
                                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                                        <div class="quickfinder-item-info ">
                                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Dise&ntilde;o Impecable</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con los mejores acabados y los materiales de mejor categor&iacute;a para darte ese sitio que te mereces.</div>
                                                                                            </div>
                                                                                        </div> <a href="#vc_row-5a7996667d1cc" target="_self" class="quickfinder-item-link"></a></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="vc_row-5a7996666d98d" class="vc_row wpb_row vc_row-fluid vc_custom_1464083253035 vc_row-has-fill">
                                                <div class="wpb_column vc_column_container vc_col-sm-6 vc_hidden-lg">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -150px;"></div>
                                                            <div class="quickfinder quickfinder-style-vertical-3 quickfinder-style-vertical quickfinder-icon-position-top quickfinder-alignment-left quickfinder-title-bold">
                                                                <div id="post-24927" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24927 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Rentabilidad</div>
                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con las mejores cuotas del mercado, nuestra meta es ajustarnos a tu presupuesto.</div>
                                                                            </div>
                                                                        </div> 
                                                                        <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a>
                                                                    </div>
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf129;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf129;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                </div>
                                                                <div id="post-24929" class="quickfinder-item even quickfinder-item-effect-border-reverse small post-24929 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Elegancia</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Nuestros clientes nos conocen por destacarnos en el el estilo de vida moderno que les ofrecemos.</div>
                                                                                            </div>
                                                                        </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf32f;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf32f;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                </div>
                                                                <div id="post-24930" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24930 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; right: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Seguridad</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Nuestros sistemas de vigilancia se encuentran optimizados y preparados para proteger tu estilo de vida.</div>
                                                                                            </div>
                                                                        </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf217;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf217;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-6 vc_hidden-lg">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -150px;"></div>
                                                            <div class="quickfinder quickfinder-style-vertical-3 quickfinder-style-vertical quickfinder-icon-position-top quickfinder-alignment-right quickfinder-title-bold">
                                                                <div id="post-24935" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24935 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4a3;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4a3;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Tangibilidad</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con una gran familia de clientes satisfechos y de proyectos entregados, nuestra mejor carta de presentaci&oacute;n son nuestros clientes felices.</div>
                                                                                            </div>
                                                                        </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                </div>
                                                                <div id="post-24936" class="quickfinder-item even quickfinder-item-effect-border-reverse small post-24936 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4fb;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4fb;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Sociable</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Todos nuestros complejos cuentan con &aacute;reas comunales y jardines comunales donde conocer&acute; propietarios exitosos como usted.</div>
                                                                                            </div>
                                                                        </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                </div>
                                                                <div id="post-24937" class="quickfinder-item odd quickfinder-item-effect-border-reverse small post-24937 thegem_qf_item type-thegem_qf_item status-publish hentry">
                                                                    <div class="quickfinder-item-image">
                                                                        <div class="quickfinder-item-image-content">
                                                                            <div class="quickfinder-item-image-wrapper">
                                                                                <div class="gem-icon gem-icon-pack-material gem-icon-size-small gem-icon-shape-square" style="border-color: #cecece;opacity: 1;">
                                                                                    <div class="gem-icon-inner" style=""><span class="gem-icon-half-1" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4b6;</span></span><span class="gem-icon-half-2" style="color: #0179bb;"><span
                                                                                                class="back-angle">&#xf4b6;</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                    </div>
                                                                    <div class="quickfinder-item-info-wrapper" style="min-height: 100px;">
                                                                        <div class="connector" style="border-color: #cecece; left: -27px;"></div>
                                                                        <div class="quickfinder-item-info ">
                                                                            <div style="display: block; min-height: 50px;">
                                                                                                <div class="quickfinder-item-title" style="color: #2c2c2c;">Dise&ntilde;o Impecable</div>
                                                                                                <div class="quickfinder-item-text" style="color: #8d8d8d ;">Contamos con los mejores acabados y los materiales de mejor categor&iacute;a para darte ese sitio que te mereces.</div>
                                                                                            </div>
                                                                        </div> <a href="#vc_row-5a7996667d1cc"  class="quickfinder-item-link"></a></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a7996666ee7b" data-vc-full-width="true" data-vc-full-width-init="false" class="vc_row wpb_row vc_row-fluid vc_custom_1463751373158 vc_row-has-fill">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996666ee7b"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 75px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h2" style="text-align: center; margin-bottom: 20px;"><span style="color: #fff;">Proyectos en Venta</span></div>
                                                                    <div style="width: 63px; height: 2px; background: #0179bb; margin: 0 auto; text-indent: 9999px;">1</div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 40px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h6" style="text-align: center;"><span class="light" style="color: #ffffff;">Somos un grupo respaldado por los hechos, echa un vistazo a nuestros proyectos</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 98px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a7996666f010" data-vc-full-width="true" data-vc-full-width-init="false" data-vc-stretch-content="true" class="vc_row wpb_row vc_row-fluid vc_custom_1463754812407 vc_row-no-padding">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996666f010"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="preloader">
                                                                <div class="preloader-spin"></div>
                                                            </div>
                                                            <div class="portfolio-preloader-wrapper">
                                                                <div data-per-page="8" data-portfolio-uid="4e2b936" class="portfolio no-padding portfolio-pagination-normal portfolio-style-justified background-style-white title-style-light hover-circular item-animation-move-up title-on-hover no-gaps fullwidth-columns-4 hover-title" data-hover="circular">
                                                                    <div class="fullwidth-block no-paddings">
                                                                        <div class="row" style="margin: 0;">
                                                                            <div class="portfolio-set clearfix" data-max-row-height="380">
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="22" data-sort-date="1463754554">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port1.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Panorama I" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port1.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/naeGBBsKgQ4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=naeGBBsKgQ4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Panorama I </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>Elegante y Atractivo</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24650 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="23" data-sort-date="1463754583">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port2.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Panorama I" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port2.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/naeGBBsKgQ4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=naeGBBsKgQ4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Panorama I </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>Elegante y Atractivo</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24651 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="24" data-sort-date="1463754616">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port3.jpg 1x, assets/img/port3.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port3.jpg 1x, assets/img/port3.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port3.jpg 1x, assets/img/port3.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port3.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Panorama I" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port3.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/naeGBBsKgQ4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=naeGBBsKgQ4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Panorama I </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>Elegante y Atractivo</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24652 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="25" data-sort-date="1463754643">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port4.jpg 1x, assets/img/port4.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port4.jpg 1x, assets/img/port4.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port4.jpg 1x, assets/img/port4.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port4.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Panorama I" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port4.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/naeGBBsKgQ4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=naeGBBsKgQ4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Panorama I </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>Elegante y Atractivo</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24653 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="26" data-sort-date="1463754676">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port5.jpg 1x, assets/img/port5.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port5.jpg 1x, assets/img/port5.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port5.jpg 1x, assets/img/port5.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port5.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Mitad del Mundo" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port5.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/07t_mw35Zh4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=07t_mw35Zh4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Mitad del Mundo </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>El mejor precio para tu Propiedad</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24654 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="27" data-sort-date="1463754704">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port6.jpg 1x, assets/img/port6.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port6.jpg 1x, assets/img/port6.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port6.jpg 1x, assets/img/port6.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port6.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Mitad del Mundo" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port6.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/07t_mw35Zh4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=07t_mw35Zh4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Mitad del Mundo </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>El mejor precio para tu Propiedad</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24655 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="28" data-sort-date="1463754724">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port1.jpg 1x, assets/img/port1.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port1.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Mitad del Mundo" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port1.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/07t_mw35Zh4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=07t_mw35Zh4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Mitad del Mundo </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>El mejor precio para tu Propiedad</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="portfolio-item construction-set item-animations-not-inited post-24657 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry" style="padding: 0px;" data-default-sort="31" data-sort-date="1463754763">
                                                                                    <div class="wrap clearfix">
                                                                                        <div class="image post-24649 thegem_pf_item type-thegem_pf_item status-publish has-post-thumbnail hentry">
                                                                                            <div class="image-inner">
                                                                                                <picture>
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(max-width: 550px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(min-width: 1280px) and (max-width: 1495px)" sizes="100vw">
                                                                                                    <source srcset="assets/img/port2.jpg 1x, assets/img/port2.jpg 2x" media="(max-width: 1920px)" sizes="100vw"> 
                                                                                                    <img src="assets/img/port2.jpg" width="844" height="767" class="attachment-thegem-portfolio-justified" alt="Mitad del Mundo" /> 
                                                                                                </picture>
                                                                                            </div>
                                                                                            <div class="overlay">
                                                                                                <div class="overlay-circle"></div>
                                                                                                <div class="links-wrapper">
                                                                                                    <div class="links">
                                                                                                        <div class="portfolio-icons"> 
                                                                                                            <a href="assets/img/port2.jpg" target="_self" class="icon full-image fancy"></a> 
                                                                                                            <a href="https://www.youtube.com/embed/07t_mw35Zh4?controls=0&showinfo=0&rel=0&mute=1&modestbranding=1&autoplay=1&loop=1&playlist=07t_mw35Zh4" target="_self" class="icon vimeo "></a> 
                                                                                                            <a href="javascript: void(0);" class="icon share"></a>
                                                                                                            <div class="overlay-line"></div>
                                                                                                            <div class="portfolio-sharing-pane">
                                                                                                                <div class="socials-sharing socials socials-colored-hover "> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Facebook"><i class="socials-item-icon facebook"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Twitter"><i class="socials-item-icon twitter"></i></a> 
                                                                                                                    <a class="socials-item" target="_blank" href="" title="Google Plus"><i class="socials-item-icon google-plus"></i></a> 
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="caption">
                                                                                                            <div class="title title-h4"> Mitad del Mundo </span>
                                                                                                            </div>
                                                                                                            <div class="description">
                                                                                                                <div class="subtitle">
                                                                                                                    <p>El mejor precio para tu Propiedad</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="portfolio-navigator gem-pagination"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a799666747f3" data-vc-full-width="true" data-vc-full-width-init="false" data-vc-stretch-content="true" class="vc_row wpb_row vc_row-fluid vc_custom_1464176165727 vc_row-no-padding">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a799666747f3"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12 vc_hidden-xs">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="vc_tta-container vc_tta-o-non-responsive" data-vc-action="collapse">
                                                                <div class="vc_general vc_tta vc-tta-autoplay vc_tta-tabs vc_tta-o-shape-group vc_tta-has-pagination vc_tta-o-no-fill vc_tta-tabs-position-top  vc_tta-pageable">
                                                                    <div class="vc_tta-panels-container">
                                                                        <ul class="vc_general vc_pagination vc_pagination-style-thegem vc_pagination-shape-circle vc_pagination-color-grey">
                                                                            <li class="vc_pagination-item <?php echo $active1; ?>" data-vc-tab><a href="#1464176174235-eb1e9ec4-de1e" class="vc_pagination-trigger" data-vc-tabs data-vc-container=".vc_tta"></a></li>
                                                                            <li class="vc_pagination-item <?php echo $active2; ?>" data-vc-tab><a href="#1464179744014-9f173a6a-78f4" class="vc_pagination-trigger" data-vc-tabs data-vc-container=".vc_tta"></a></li>
                                                                            <li class="vc_pagination-item <?php echo $active3; ?>" data-vc-tab><a href="#1464179759981-ae389282-b49a" class="vc_pagination-trigger" data-vc-tabs data-vc-container=".vc_tta"></a></li>
                                                                        </ul>
                                                                        <div class="vc_tta-panels">
                                                                            <div class="vc_tta-panel <?php echo $active1; ?>" id="1464176174235-eb1e9ec4-de1e" data-vc-content=".vc_tta-panel-body">
                                                                                <div class="vc_tta-panel-body"> 
                                                                                    <span class="vc_tta-panel-title"> 
                                                                                        <a data-vc-container=".vc_tta-container" data-vc-accordion="" data-vc-target="#1464176174235-eb1e9ec4-de1e"></a> 
                                                                                    </span>
                                                                                    <div class="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1464176408570 vc_row-has-fill">
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6">
                                                                                            <div class="vc_column-inner ">
                                                                                                <div class="wpb_wrapper"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-has-fill">
                                                                                            <div class="vc_column-inner vc_custom_1464181857087">
                                                                                                <div class="wpb_wrapper">
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 100px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h2" style="margin-bottom: 20px;"><span style="color: #fff;">Panorama I</span></div>
                                                                                                            <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 65px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h6"><span style="color: #ffffff; font-size: 14px;">Un espacio tranquilo, bien ubicado y exclusivo</span></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 40px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">105 m2 de &aacute;rea util</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">105 m2 de terraza semidescubierta</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">2 parqueaderos privados de 14 m2 cada uno</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">1 bodega de 4 m2 </div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Grifer&iacute;a en ba&ntilde;os y cocinas FV</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 90px;"></div>
                                                                                                    <div class="gem-button-container gem-button-position-left"><a class="gem-button gem-button-size-small gem-button-style-flat gem-button-text-weight-normal" style="border-radius: 3px;background-color: #0179bb;color: #2c2c2c;" onmouseleave="this.style.backgroundColor='#0179bb';this.style.color='#2c2c2c';" onmouseenter="this.style.backgroundColor='#2c2c2c';this.style.color='#0179bb';" href="#vc_row-5a7996667d1cc" target="_self">Quiero ver m&aacute;s</a></div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 95px;"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="vc_tta-panel <?php echo $active2; ?>" id="1464179744014-9f173a6a-78f4" data-vc-content=".vc_tta-panel-body">
                                                                                <div class="vc_tta-panel-body"> 
                                                                                    <span class="vc_tta-panel-title"> 
                                                                                        <a data-vc-container=".vc_tta-container" data-vc-accordion="" data-vc-target="#1464179744014-9f173a6a-78f4"></a> </span>
                                                                                    <div class="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1464179777055 vc_row-has-fill">
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6">
                                                                                            <div class="vc_column-inner ">
                                                                                                <div class="wpb_wrapper"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-has-fill">
                                                                                            <div class="vc_column-inner vc_custom_1464181876795">
                                                                                                <div class="wpb_wrapper">
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 100px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h2" style="margin-bottom: 20px;"><span style="color: #fff;">Panorama II</span></div>
                                                                                                            <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 65px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h6"><span style="color: #ffffff; font-size: 14px;">60% CONSTRUIDO "&Uacute;LTIMOS DEPARTAMENTOS"</span></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 40px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Sal&oacute;n comunal y jardines comunales</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">2 parqueaderos privados</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Sistema de c&aacute;maras de  seguridad</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Piezas sanitarias Briggs</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Grifer&iacute;a en ba&ntilde;os y cocinas FV</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 90px;"></div>
                                                                                                    <div class="gem-button-container gem-button-position-left"><a class="gem-button gem-button-size-small gem-button-style-flat gem-button-text-weight-normal" style="border-radius: 3px;background-color: #0179bb;color: #2c2c2c;" onmouseleave="this.style.backgroundColor='#0179bb';this.style.color='#2c2c2c';" onmouseenter="this.style.backgroundColor='#2c2c2c';this.style.color='#0179bb';" href="#vc_row-5a7996667d1cc" target="_self">Estoy interesado</a></div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 95px;"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="vc_tta-panel <?php echo $active3; ?>" id="1464179759981-ae389282-b49a" data-vc-content=".vc_tta-panel-body">
                                                                                <div class="vc_tta-panel-body"> 
                                                                                    <span class="vc_tta-panel-title"> <a
                                                                                            data-vc-container=".vc_tta-container" data-vc-accordion="" data-vc-target="#1464179759981-ae389282-b49a"></a> </span>
                                                                                    <div class="vc_row wpb_row vc_inner vc_row-fluid vc_custom_1464179788656 vc_row-has-fill">
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6">
                                                                                            <div class="vc_column-inner ">
                                                                                                <div class="wpb_wrapper"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-has-fill">
                                                                                            <div class="vc_column-inner vc_custom_1464181884903">
                                                                                                <div class="wpb_wrapper">
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 100px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h2" style="margin-bottom: 20px;"><span style="color: #fff;">Mitad del Mundo</span></div>
                                                                                                            <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 65px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div class="title-h6"><span style="color: #ffffff; font-size: 14px;">Zona de alta proyecci&oacute;n y gran plusvalia, sector centrico, turistico y comercial</span></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 40px;"></div>
                                                                                                    <div class="wpb_text_column wpb_content_element ">
                                                                                                        <div class="wpb_wrapper">
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Casas de 75m2 en dos plantas</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Dos y tres dormitorios con dos ba&ntilde;os completos</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Internet y tel&eacute;fono con fibra &oacute;ptica</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Amplios Parqueaderos</div>
                                                                                                            <div style="text-indent: 9999px; line-height: 20px;">1</div>
                                                                                                            <div style="display: inline-block; width: 300px; color: #ffffff;">Amplias &aacute;reas verdes con juegos infantiles</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 90px;"></div>
                                                                                                    <div class="gem-button-container gem-button-position-left"><a class="gem-button gem-button-size-small gem-button-style-flat gem-button-text-weight-normal" style="border-radius: 3px;background-color: #0179bb;color: #2c2c2c;" onmouseleave="this.style.backgroundColor='#0179bb';this.style.color='#2c2c2c';" onmouseenter="this.style.backgroundColor='#2c2c2c';this.style.color='#0179bb';" href="#vc_row-5a7996667d1cc" target="_self">Ver precios</a></div>
                                                                                                    <div class="clearboth"></div>
                                                                                                    <div class="gem-divider " style="margin-top: 95px;"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a79966676472" data-vc-full-width="true" data-vc-full-width-init="false" class="vc_row wpb_row vc_row-fluid vc_custom_1464001258663 vc_row-has-fill">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a79966676472"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h2" style="text-align: center; margin-bottom: 20px;"><span id="finan_title" style="color: #2c2c2c;">Financiamiento</span></div>
                                                                    <div style="width: 63px; height: 2px; background: #0179bb; margin: 0 auto; text-indent: 9999px;">1</div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 65px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered" style="">
                                                                    <div class="gem-wrapbox-inner "><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_icon_2-1.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-xlarge" style="text-align: center;"><span style="color: #0179bb;">01</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 30px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h5" style="text-align: center;">Planifica</div>
                                                                                    <p style="text-align: center;">Te ayudamos a planificar tu presupuesto ideal, que se ajuste a tu medida y te permita ser un propietario feliz.</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered" style="">
                                                                    <div class="gem-wrapbox-inner "><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_icon_1-1.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-xlarge" style="text-align: center;"><span style="color: #0179bb;">02</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 30px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h5" style="text-align: center;">Dise&ntilde;a</div>
                                                                                    <p style="text-align: center;">Puedes seleccionar entre un cat&aacute;logo de propiedades para que dise&ntilde;es tu estilo de vida.</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered" style="">
                                                                    <div class="gem-wrapbox-inner "><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_icon_3-1.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-xlarge" style="text-align: center;"><span style="color: #0179bb;">03</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 30px;"></div>
                                                            <div class="vc_row wpb_row vc_inner vc_row-fluid">
                                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                                    <div class="vc_column-inner ">
                                                                        <div class="wpb_wrapper">
                                                                            <div class="wpb_text_column wpb_content_element ">
                                                                                <div class="wpb_wrapper">
                                                                                    <div class="title-h5" style="text-align: center;">Ejecuta</div>
                                                                                    <p style="text-align: center;">Pon en marcha tu plan y comienza ese camino que te convertir&aacute; en una persona exitosa y moderna con un inmueble que le identifica</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-offset-2 vc_col-md-offset-2 vc_hidden-md vc_col-sm-offset-2 vc_hidden-sm vc_hidden-xs">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -250px;"></div>
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered lazy-loading" style="">
                                                                    <div class="gem-wrapbox-inner  lazy-loading-item" data-ll-effect="move-up"><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_horizontal_arrow.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-offset-0 vc_hidden-md vc_hidden-sm vc_hidden-xs">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -250px;"></div>
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered lazy-loading" style="">
                                                                    <div class="gem-wrapbox-inner  lazy-loading-item" data-ll-effect="move-up"><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_horizontal_arrow.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4 vc_col-lg-offset-2 vc_hidden-lg vc_col-md-offset-2 vc_col-sm-offset-2 vc_hidden-sm vc_hidden-xs">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -275px;"></div>
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered" style="">
                                                                    <div class="gem-wrapbox-inner "><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_horizontal_arrow.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4 vc_hidden-lg vc_hidden-sm vc_hidden-xs">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: -275px;"></div>
                                                            <div class="centered-box gem-image-centered-box">
                                                                <div class="gem-image gem-wrapbox gem-wrapbox-style-default gem-wrapbox-position-centered" style="">
                                                                    <div class="gem-wrapbox-inner "><img class="gem-wrapbox-element img-responsive" src="assets/img/construction_horizontal_arrow.png" alt="" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a799666773ad" data-vc-full-width="true" data-vc-full-width-init="false" class="vc_row wpb_row vc_row-fluid vc_custom_1464002689027 vc_row-has-fill">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a799666773ad"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-8">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 35px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h3"><span style="color: #111111;">
                                                                            <span class="light">SI EST&Aacute;S LISTO PARA ADQUIRIR TU INMUEBLE AL MEJOR PRECIO DE ECUADOR </span> &iexcl;LLAMA AHORA!</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 65px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-4">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 20px;"></div>
                                                            <div class="gem-button-container gem-button-position-center"><a class="gem-button gem-button-size-medium gem-button-style-outline gem-button-text-weight-normal gem-button-border-3" style="border-radius: 0px;border-color: #ffffff;color: #ffffff;" onmouseleave="this.style.borderColor='#ffffff';this.style.backgroundColor='transparent';this.style.color='#ffffff';" onmouseenter="this.style.borderColor='#111111';this.style.backgroundColor='#111111';this.style.color='#0179bb';" href="#vc_row-5a7996667d1cc" target="_self">Contactar</a></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                            <div class="vc_row-full-width-before"></div>
                                            <div id="vc_row-5a7996667d1cc" data-vc-full-width="true" data-vc-full-width-init="false" class="vc_row wpb_row vc_row-fluid vc_custom_1463740191072 vc_row-has-fill">
                                                <script type="text/javascript">
                                                    if (typeof (gem_fix_fullwidth_position) == "function") {
                                                        gem_fix_fullwidth_position(document.getElementById("vc_row-5a7996667d1cc"));
                                                    }
                                                </script>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 35px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-6">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h2" style="margin-bottom: 20px;"><span style="color: #2c2c2c;">Esperamos tu mensaje</span></div>
                                                                    <div style="width: 63px; height: 2px; background: #0179bb; text-indent: 9999px;">1</div>
                                                                </div>
                                                            </div>
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 55px;"></div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h6" style="font-size: 14px;">Nuestro equipo especializado est&aacute; listo para darte atenci&oacute;n exclusiva</div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element ">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h1"><span style="color: #fbc300;">098 351 1702</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="wpb_text_column wpb_content_element  vc_custom_1464014256658">
                                                                <div class="wpb_wrapper">
                                                                    <div class="title-h6" style="font-size: 14px;">&Aacute;ngel Rojas y Juan Le&oacute;n Mera.<br /> Quito, Ecuador<br /> <span style="color: #fbc300;">ventas@aeconstructora.com</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="contactform wpb_column vc_column_container vc_col-sm-6 vc_col-lg-offset-0 vc_col-md-offset-0 vc_col-sm-offset-0">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 10px;"></div>
                                                            <div role="form" class="wpcf7" id="wpcf7-f13123-p24405-o1" lang="en-US" dir="ltr">
                                                                <div class="screen-reader-response"></div>
                                                                <form action="" method="post" class="wpcf7-form" novalidate="novalidate">
                                                                    <div style="display: none;"> 
                                                                        <input type="hidden" name="_wpcf7" value="13123" /> 
                                                                        <input type="hidden" name="_wpcf7_version" value="4.9" /> 
                                                                        <input type="hidden" name="_wpcf7_locale" value="en_US" /> 
                                                                        <input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f13123-p24405-o1" /> <input type="hidden" name="_wpcf7_container_post" value="24405" /></div>
                                                                    <div class='form-sidebar'>
                                                                        <p><span class="wpcf7-form-control-wrap name">
                                                                                <input type="text" name="name" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Nombre*" /></span></p>
                                                                        <p><span class="wpcf7-form-control-wrap phone">
                                                                                <input type="text" name="phone" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Tel&eacute;fono*" /></span></p>
                                                                        <p><span class="wpcf7-form-control-wrap email">
                                                                                <input type="email" name="email" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email" aria-required="true" aria-invalid="false" placeholder="Email*" /></span></p>
                                                                        <p><span class="wpcf7-form-control-wrap your-message">
                                                                                <textarea name="your-message" cols="40" rows="6" class="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Mensaje*"></textarea></span></p>
                                                                        <p><input type="submit" value="Enviar Mensaje" class="wpcf7-form-control wpcf7-submit" /></p>
                                                                    </div>
                                                                    <div class="wpcf7-response-output wpcf7-display-none"></div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="wpb_column vc_column_container vc_col-sm-12">
                                                    <div class="vc_column-inner ">
                                                        <div class="wpb_wrapper">
                                                            <div class="clearboth"></div>
                                                            <div class="gem-divider " style="margin-top: 20px;"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vc_row-full-width vc_clearfix"></div>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer id="footer-nav" class="site-footer">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3 col-md-push-9">
                            <div id="footer-socials">
                                <div class="socials inline-inside socials-colored"> 
                                    <a href="#" target="_blank" title="facebook" class="socials-item"><i
                                    class="socials-item-icon facebook"></i></a> 
                                    <a href="#" target="_blank" title="twitter" class="socials-item"><i
                                    class="socials-item-icon twitter"></i></a> 
                                    <a href="#" target="_blank" title="instagram" class="socials-item"><i
                                    class="socials-item-icon instagram"></i></a> 
                                    <a href="#" target="_blank" title="googleplus" class="socials-item"><i
                                    class="socials-item-icon googleplus"></i></a> 
                                    <a href="#" target="_blank" title="youtube" class="socials-item"><i
                                    class="socials-item-icon youtube"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-3 col-md-pull-9">
                            <div class="footer-site-info">AEConstructora 2018 &copy;  BY <a href="http://www.burtonservers.com" target="_self"> BURTONTECH</a></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        
        <script type="text/javascript">
            (function () {
                function addEventListener(element, event, handler) {
                    if (element.addEventListener) {
                        element.addEventListener(event, handler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent('on' + event, handler);
                    }
                }

                function maybePrefixUrlField() {
                    if (this.value.trim() !== '' && this.value.indexOf('http') !== 0) {
                        this.value = "http://" + this.value;
                    }
                }

                var urlFields = document.querySelectorAll('.mc4wp-form input[type="url"]');
                if (urlFields && urlFields.length > 0) {
                    for (var j = 0; j < urlFields.length; j++) {
                        addEventListener(urlFields[j], 'blur', maybePrefixUrlField);
                    }
                } /* test if browser supports date fields */
                var testInput = document.createElement('input');
                testInput.setAttribute('type', 'date');
                if (testInput.type !== 'date') {

                    /* add placeholder & pattern to all date fields */
                    var dateFields = document.querySelectorAll('.mc4wp-form input[type="date"]');
                    for (var i = 0; i < dateFields.length; i++) {
                        if (!dateFields[i].placeholder) {
                            dateFields[i].placeholder = 'YYYY-MM-DD';
                        }
                        if (!dateFields[i].pattern) {
                            dateFields[i].pattern = '[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])';
                        }
                    }
                }

            })();
        </script>
        <link rel='stylesheet' id='icons-fontawesome-css' href='assets/css/fontawesome.css?ver=4.8.2' type='text/css' media='all' />
        <link rel='stylesheet' id='icons-material-css' href='assets/css/material.css?ver=4.8.2' type='text/css' media='all' />
        <link rel='stylesheet' id='odometr-group-css' href='assets/css/odo.css' type='text/css' media='all' />
        <script type='text/javascript' defer="defer" src='assets/js/jquery.js'></script>
        <script type='text/javascript' defer="defer" src='assets/js/script.js'></script>
    </body>
</html>