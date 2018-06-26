;
(function($, window, undefined) {
    'use strict';
    var $body = $('body');
    $.DLMenu = function(options, element) {
        this.$el = $(element);
        this._init(options);
    };
    $.DLMenu.defaults = {
        animationClasses: {
            classin: 'dl-animate-in-1',
            classout: 'dl-animate-out-1'
        },
        onLevelClick: function(el, name) {
            return false;
        },
        onLinkClick: function(el, ev) {
            return false;
        },
        backLabel: 'Back',
        showCurrentLabel: 'Show this page',
        useActiveItemAsBackLabel: false,
        useActiveItemAsLink: true
    };
    $.DLMenu.prototype = {
        _init: function(options) {
            this.options = $.extend(true, {}, $.DLMenu.defaults, options);
            this._config();
            var animEndEventNames = {
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'OAnimation': 'oAnimationEnd',
                    'msAnimation': 'MSAnimationEnd',
                    'animation': 'animationend',
                    "MozAnimation": "animationend"
                },
                transEndEventNames = {
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MozTransition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'msTransition': 'MSTransitionEnd',
                    'transition': 'transitionend'
                };
            if (animEndEventNames[window.supportedAnimation] != undefined) {
                this.animEndEventName = animEndEventNames[window.supportedAnimation] + '.dlmenu';
            } else {
                this.animEndEventName = animEndEventNames['animation'] + '.dlmenu';
            }
            if (transEndEventNames[window.supportedTransition] != undefined) {
                this.transEndEventName = transEndEventNames[window.supportedTransition] + '.dlmenu';
            } else {
                this.transEndEventName = transEndEventNames['transition'] + '.dlmenu';
            }
            this.supportAnimations = window.supportsAnimations;
            this.supportTransitions = window.supportsTransitions;
            this._initEvents();
        },
        _config: function() {
            var self = this;
            this.open = false;
            this.$trigger = this.$el.hasClass('primary-navigation') && $('#perspective-menu-buttons').length > 0 ? $('#perspective-menu-buttons .dl-trigger') : this.$el.find('.dl-trigger:first');
            this.$menu = this.$el.find('ul.dl-menu:first');
            this.$menuitems = this.$menu.find('li:not(.dl-back)');
            this.$el.find('ul.dl-submenu').prepend('<li class="dl-back"><a href="#">' + this.options.backLabel + '</a></li>');
            this.$back = this.$menu.find('li.dl-back');
            if (this.options.useActiveItemAsBackLabel) {
                this.$back.each(function() {
                    var $this = $(this),
                        parentLabel = $this.parents('li:first').find('a:first').text();
                    $this.find('a').html(parentLabel);
                });
            }
            if (this.options.useActiveItemAsLink) {
                this.$el.find('ul.dl-submenu').prepend(function() {
                    var activeLi = $(this).parents('li:not(.dl-back):first');
                    var parentli = activeLi.find('a:first');
                    if (activeLi.hasClass('mobile-clickable'))
                        return '<li class="dl-parent"><a href="' + parentli.attr('href') + '">' + self.options.showCurrentLabel + '</a></li>';
                    else
                        return '';
                });
            }
        },
        _initEvents: function() {
            var self = this;
            this.$trigger.on('click.dlmenu', function() {
                if (self.open) {
                    self._closeMenu();
                } else {
                    self._openMenu();
                    $body.off('click').children().on('click.dlmenu', function() {
                        self._closeMenu();
                    });
                }
                return false;
            });
            this.$menuitems.on('click.dlmenu', function(event) {
                event.stopPropagation();
                var $item = $(this),
                    $submenu = $item.children('ul.dl-submenu'),
                    level = 1;
                if (!self.$menu.hasClass('dl-menuopen')) {
                    self.options.onLinkClick($item, event);
                    return;
                }
                var $itemList = $item.parent();
                while ($itemList.attr('id') != 'primary-menu') {
                    if ($itemList[0].nodeName.toUpperCase() == 'UL') {
                        level++;
                    }
                    $itemList = $itemList.parent();
                    if (!$itemList.length) {
                        break;
                    }
                }
                if (level > 3) {
                    level = 3;
                }
                if (($submenu.length > 0) && !($(event.currentTarget).hasClass('dl-subviewopen'))) {
                    var $flyin = $submenu.clone().addClass('level' + (level + 1)).css('opacity', 0).insertAfter(self.$menu),
                        onAnimationEndFn = function() {
                            self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classout).addClass('dl-subview');
                            $item.addClass('dl-subviewopen').parents('.dl-subviewopen:first').removeClass('dl-subviewopen').addClass('dl-subview');
                            $flyin.remove();
                        };
                    setTimeout(function() {
                        $flyin.addClass(self.options.animationClasses.classin);
                        self.$menu.addClass(self.options.animationClasses.classout);
                        if (self.supportAnimations) {
                            self.$menu.on(self.animEndEventName, onAnimationEndFn);
                        } else {
                            onAnimationEndFn.call();
                        }
                        self.options.onLevelClick($item, $item.children('a:first').text());
                    });
                    return false;
                } else {
                    self.options.onLinkClick($item, event);
                }
            });
            this.$back.on('click.dlmenu', function(event) {
                var $this = $(this),
                    $submenu = $this.parents('ul.dl-submenu:first'),
                    $item = $submenu.parent(),
                    level = 1;
                var $itemList = $this.parent();
                while ($itemList.attr('id') != 'primary-menu') {
                    if ($itemList[0].nodeName.toUpperCase() == 'UL') {
                        level++;
                    }
                    $itemList = $itemList.parent();
                    if (!$itemList.length) {
                        break;
                    }
                }
                if (level > 3) {
                    level = 3;
                }
                var $flyin = $submenu.clone().addClass('level' + level).insertAfter(self.$menu);
                var onAnimationEndFn = function() {
                    self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classin);
                    $flyin.remove();
                };
                setTimeout(function() {
                    $flyin.addClass(self.options.animationClasses.classout);
                    self.$menu.addClass(self.options.animationClasses.classin);
                    if (self.supportAnimations) {
                        self.$menu.on(self.animEndEventName, onAnimationEndFn);
                    } else {
                        onAnimationEndFn.call();
                    }
                    $item.removeClass('dl-subviewopen');
                    var $subview = $this.parents('.dl-subview:first');
                    if ($subview.is('li')) {
                        $subview.addClass('dl-subviewopen');
                    }
                    $subview.removeClass('dl-subview');
                });
                return false;
            });
        },
        closeMenu: function() {
            if (this.open) {
                this._closeMenu();
            }
        },
        _closeMenu: function() {
            var self = this,
                onTransitionEndFn = function() {
                    self.$menu.off(self.transEndEventName);
                    self._resetMenu();
                };
            this.$menu.removeClass('dl-menuopen');
            this.$menu.addClass('dl-menu-toggle');
            this.$trigger.removeClass('dl-active');
            if (this.supportTransitions) {
                this.$menu.on(this.transEndEventName, onTransitionEndFn);
            } else {
                onTransitionEndFn.call();
            }
            this.open = false;
        },
        openMenu: function() {
            if (!this.open) {
                this._openMenu();
            }
        },
        _openMenu: function() {
            var self = this;
            $body.off('click').on('click.dlmenu', function() {
                self._closeMenu();
            });
            this.$menu.addClass('dl-menuopen dl-menu-toggle').on(this.transEndEventName, function() {
                $(this).removeClass('dl-menu-toggle');
            });
            this.$trigger.addClass('dl-active');
            this.open = true;
        },
        _resetMenu: function() {
            this.$menu.removeClass('dl-subview');
            this.$menuitems.removeClass('dl-subview dl-subviewopen');
        }
    };
    var logError = function(message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    $.fn.dlmenu = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var instance = $.data(this, 'dlmenu');
                if (!instance) {
                    logError("cannot call methods on dlmenu prior to initialization; " + "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for dlmenu instance");
                    return;
                }
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var instance = $.data(this, 'dlmenu');
                if (instance) {
                    instance._init();
                } else {
                    instance = $.data(this, 'dlmenu', new $.DLMenu(options, this));
                }
            });
        }
        return this;
    };
})(jQuery, window);;

function supportsTransitions() {
    return getSupportedTransition() != '';
}

function getSupportedTransition() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';
    if (typeof s[p] == 'string') {
        return p;
    }
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);
    for (var i = 0; i < v.length; i++) {
        if (typeof s[v[i] + p] == 'string') {
            return true;
        }
    }
    return '';
}
window.supportedTransition = getSupportedTransition();
window.supportsTransitions = supportsTransitions();

function supportsAnimations() {
    return getSupportedAnimation() != '';
}

function getSupportedAnimation() {
    var t, el = document.createElement("fakeelement");
    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd",
        'msAnimation': 'MSAnimationEnd'
    };
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return t;
        }
    }
    return '';
}
window.supportedAnimation = getSupportedAnimation();
window.supportsAnimations = supportsAnimations();

function getMobileMenuType() {
    if (!document.getElementById('site-header')) return 'default';
    var m = document.getElementById('site-header').className.match(/mobile-menu-layout-([a-zA-Z0-9]+)/);
    window.gemMobileMenuType = m ? m[1] : 'default';
    return window.gemMobileMenuType;
}
getMobileMenuType();
(function() {
    var logoFixTimeout = false;

    function getElementPosition(elem) {
        var w = elem.offsetWidth,
            h = elem.offsetHeight,
            l = 0,
            t = 0;
        while (elem) {
            l += elem.offsetLeft;
            t += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return {
            "left": l,
            "top": t,
            "width": w,
            "height": h
        };
    }

    function fixMenuLogoPosition() {
        if (logoFixTimeout) {
            clearTimeout(logoFixTimeout);
        }
        var headerMain = document.querySelector('#site-header .header-main');
        if (headerMain == null) {
            return false;
        }
        var headerMainClass = headerMain.className;
        if (headerMainClass.indexOf('logo-position-menu_center') == -1 || headerMainClass.indexOf('header-layout-fullwidth_hamburger') != -1 || headerMainClass.indexOf('header-layout-vertical') != -1) {
            return false;
        }
        logoFixTimeout = setTimeout(function() {
            var page = document.getElementById('page'),
                primaryMenu = document.getElementById('primary-menu'),
                primaryNavigation = document.getElementById('primary-navigation'),
                windowWidth = page.offsetWidth,
                pageComputedStyles = window.getComputedStyle(page, null),
                pageMargin = parseFloat(pageComputedStyles['marginLeft']);
            if (isNaN(pageMargin)) {
                pageMargin = 0;
            }
            if (headerMainClass.indexOf('header-layout-fullwidth') != -1) {
                var logoItem = primaryMenu.querySelector('.menu-item-logo'),
                    lastItem = primaryNavigation.querySelector('#primary-menu > li:last-child');
                primaryMenu.style.display = '';
                logoItem.style.marginLeft = '';
                logoItem.style.marginRight = '';
                if (windowWidth < 1212) {
                    return;
                }
                primaryMenu.style.display = 'block';
                var pageCenter = windowWidth / 2 + pageMargin,
                    logoOffset = getElementPosition(logoItem),
                    offset = pageCenter - logoOffset.left - logoItem.offsetWidth / 2;
                logoItem.style.marginLeft = offset + 'px';
                var primaryMenuOffsetWidth = primaryMenu.offsetWidth,
                    primaryMenuOffsetLeft = getElementPosition(primaryMenu).left,
                    lastItemOffsetWidth = lastItem.offsetWidth,
                    lastItemOffsetLeft = getElementPosition(lastItem).left,
                    rightItemsOffset = primaryMenuOffsetWidth - lastItemOffsetLeft - lastItemOffsetWidth + primaryMenuOffsetLeft;
                logoItem.style.marginRight = rightItemsOffset + 'px';
            } else {
                if (windowWidth < 1212) {
                    primaryNavigation.style.textAlign = '';
                    primaryMenu.style.position = '';
                    primaryMenu.style.left = '';
                    return;
                }
                primaryNavigation.style.textAlign = 'left';
                primaryMenu.style.left = 0 + 'px';
                var pageCenter = windowWidth / 2,
                    primaryMenuOffsetLeft = getElementPosition(primaryMenu).left,
                    logoOffset = getElementPosition(document.querySelector('#site-header .header-main #primary-navigation .menu-item-logo')),
                    pageOffset = getElementPosition(page),
                    offset = pageCenter - (logoOffset.left - pageOffset.left) - document.querySelector('#site-header .header-main #primary-navigation .menu-item-logo').offsetWidth / 2;
                if (primaryMenuOffsetLeft + offset >= 0) {
                    primaryMenu.style.position = 'relative';
                    primaryMenu.style.left = offset + 'px';
                } else {
                    primaryMenu.style.position = '';
                    primaryMenu.style.left = '';
                }
            }
        }, 50);
    }
    window.fixMenuLogoPosition = fixMenuLogoPosition;
    window.addEventListener('load', function(event) {
        window.fixMenuLogoPosition();
    }, false);
})();
(function($) {
    var isVerticalMenu = $('.header-main').hasClass('header-layout-vertical'),
        isHamburgerMenu = $('.header-main').hasClass('header-layout-fullwidth_hamburger'),
        isPerspectiveMenu = $('#thegem-perspective').length > 0;
    $(window).resize(function() {
        window.updateGemClientSize(false);
        window.updateGemInnerSize();
    });
    window.menuResizeTimeoutHandler = false;
    var megaMenuSettings = {};

    function getOffset(elem) {
        if (elem.getBoundingClientRect && window.gemBrowser.platform.name != 'ios') {
            var bound = elem.getBoundingClientRect(),
                html = elem.ownerDocument.documentElement,
                htmlScroll = getScroll(html),
                elemScrolls = getScrolls(elem),
                isFixed = (styleString(elem, 'position') == 'fixed');
            return {
                x: parseInt(bound.left) + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
                y: parseInt(bound.top) + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
            };
        }
        var element = elem,
            position = {
                x: 0,
                y: 0
            };
        if (isBody(elem)) return position;
        while (element && !isBody(element)) {
            position.x += element.offsetLeft;
            position.y += element.offsetTop;
            if (window.gemBrowser.name == 'firefox') {
                if (!borderBox(element)) {
                    position.x += leftBorder(element);
                    position.y += topBorder(element);
                }
                var parent = element.parentNode;
                if (parent && styleString(parent, 'overflow') != 'visible') {
                    position.x += leftBorder(parent);
                    position.y += topBorder(parent);
                }
            } else if (element != elem && window.gemBrowser.name == 'safari') {
                position.x += leftBorder(element);
                position.y += topBorder(element);
            }
            element = element.offsetParent;
        }
        if (window.gemBrowser.name == 'firefox' && !borderBox(elem)) {
            position.x -= leftBorder(elem);
            position.y -= topBorder(elem);
        }
        return position;
    };

    function getScroll(elem) {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    };

    function getScrolls(elem) {
        var element = elem.parentNode,
            position = {
                x: 0,
                y: 0
            };
        while (element && !isBody(element)) {
            position.x += element.scrollLeft;
            position.y += element.scrollTop;
            element = element.parentNode;
        }
        return position;
    };

    function styleString(element, style) {
        return $(element).css(style);
    };

    function styleNumber(element, style) {
        return parseInt(styleString(element, style)) || 0;
    };

    function borderBox(element) {
        return styleString(element, '-moz-box-sizing') == 'border-box';
    };

    function topBorder(element) {
        return styleNumber(element, 'border-top-width');
    };

    function leftBorder(element) {
        return styleNumber(element, 'border-left-width');
    };

    function isBody(element) {
        return (/^(?:body|html)$/i).test(element.tagName);
    };

    function checkMegaMenuSettings() {
        if (window.customMegaMenuSettings == undefined || window.customMegaMenuSettings == null) {
            return false;
        }
        var uri = window.location.pathname;
        window.customMegaMenuSettings.forEach(function(item) {
            for (var i = 0; i < item.urls.length; i++) {
                if (uri.match(item.urls[i])) {
                    megaMenuSettings[item.menuItem] = item.data;
                }
            }
        });
    }

    function fixMegaMenuWithSettings() {
        checkMegaMenuSettings();
        $('#primary-menu > li.megamenu-enable').each(function() {
            var m = this.className.match(/(menu-item-(\d+))/);
            if (!m) {
                return;
            }
            var itemId = parseInt(m[2]);
            if (megaMenuSettings[itemId] == undefined || megaMenuSettings[itemId] == null) {
                return;
            }
            var $item = $('> ul', this);
            if (megaMenuSettings[itemId].masonry != undefined) {
                if (megaMenuSettings[itemId].masonry) {
                    $item.addClass('megamenu-masonry');
                } else {
                    $item.removeClass('megamenu-masonry');
                }
            }
            if (megaMenuSettings[itemId].style != undefined) {
                $(this).removeClass('megamenu-style-default megamenu-style-grid').addClass('megamenu-style-' + megaMenuSettings[itemId].style);
            }
            var css = {};
            if (megaMenuSettings[itemId].backgroundImage != undefined) {
                css.backgroundImage = megaMenuSettings[itemId].backgroundImage;
            }
            if (megaMenuSettings[itemId].backgroundPosition != undefined) {
                css.backgroundPosition = megaMenuSettings[itemId].backgroundPosition;
            }
            if (megaMenuSettings[itemId].padding != undefined) {
                css.padding = megaMenuSettings[itemId].padding;
            }
            if (megaMenuSettings[itemId].borderRight != undefined) {
                css.borderRight = megaMenuSettings[itemId].borderRight;
            }
            $item.css(css);
        });
    }

    function isResponsiveMenuVisible() {
        return $('.primary-navigation .menu-toggle').is(':visible');
    }
    window.isResponsiveMenuVisible = isResponsiveMenuVisible;

    function isTopAreaVisible() {
        return window.gemSettings.topAreaMobileDisable ? window.gemOptions.clientWidth >= 768 : true;
    }
    window.isTopAreaVisible = isTopAreaVisible;

    function isVerticalToggleVisible() {
        return window.gemOptions.clientWidth > 1600;
    }
    $('#primary-menu > li.megamenu-enable').hover(function() {
        fix_megamenu_position(this);
    }, function() {});
    $('#primary-menu > li.megamenu-enable:hover').each(function() {
        fix_megamenu_position(this);
    });
    $('#primary-menu > li.megamenu-enable').each(function() {
        var $item = $('> ul', this);
        if ($item.length == 0) return;
        $item.addClass('megamenu-item-inited');
    });

    function fix_megamenu_position(elem) {
        if (!$('.megamenu-inited', elem).length && isResponsiveMenuVisible()) {
            return false;
        }
        var $item = $('> ul', elem);
        if ($item.length == 0) return;
        var self = $item.get(0);
        $item.addClass('megamenu-item-inited');
        var default_item_css = {
            width: 'auto',
            height: 'auto'
        };
        if (!isVerticalMenu && !isHamburgerMenu && !isPerspectiveMenu) {
            default_item_css.left = 0;
        }
        $item.removeClass('megamenu-masonry-inited megamenu-fullwidth').css(default_item_css);
        $(' > li', $item).css({
            left: 0,
            top: 0
        }).each(function() {
            var old_width = $(this).data('old-width') || -1;
            if (old_width != -1) {
                $(this).width(old_width).data('old-width', -1);
            }
        });
        if (isResponsiveMenuVisible()) {
            return;
        }
        if (isVerticalMenu) {
            var container_width = window.gemOptions.clientWidth - $('#site-header-wrapper').outerWidth();
        } else if (isPerspectiveMenu) {
            var container_width = window.gemOptions.clientWidth - $('#primary-navigation').outerWidth();
        } else if (isHamburgerMenu) {
            var container_width = window.gemOptions.clientWidth - $('#primary-menu').outerWidth();
        } else {
            var $container = $item.closest('.header-main'),
                container_width = $container.width(),
                container_padding_left = parseInt($container.css('padding-left')),
                container_padding_right = parseInt($container.css('padding-right')),
                parent_width = $item.parent().outerWidth();
        }
        var megamenu_width = $item.outerWidth();
        if (megamenu_width > container_width) {
            megamenu_width = container_width;
            var new_megamenu_width = container_width - parseInt($item.css('padding-left')) - parseInt($item.css('padding-right'));
            var columns = $item.data('megamenu-columns') || 4;
            var column_width = parseFloat(new_megamenu_width - columns * parseInt($(' > li.menu-item:first', $item).css('margin-left'))) / columns;
            var column_width_int = parseInt(column_width);
            $(' > li', $item).each(function() {
                $(this).data('old-width', $(this).width()).css('width', column_width_int);
            });
            $item.addClass('megamenu-fullwidth').width(new_megamenu_width - (column_width - column_width_int) * columns);
        }
        if (!isVerticalMenu && !isHamburgerMenu && !isPerspectiveMenu) {
            if (megamenu_width > parent_width) {
                var left = -(megamenu_width - parent_width) / 2;
            } else {
                var left = 0;
            }
            var container_offset = getOffset($container[0]);
            var megamenu_offset = getOffset(self);
            if ((megamenu_offset.x - container_offset.x - container_padding_left + left) < 0) {
                left = -(megamenu_offset.x - container_offset.x - container_padding_left);
            }
            if ((megamenu_offset.x + megamenu_width + left) > (container_offset.x + $container.outerWidth() - container_padding_right)) {
                left -= (megamenu_offset.x + megamenu_width + left) - (container_offset.x + $container.outerWidth() - container_padding_right);
            }
            $item.css('left', left).css('left');
        }
        if ($item.hasClass('megamenu-masonry')) {
            var positions = {},
                max_bottom = 0;
            $item.width($item.width() - 1);
            var new_row_height = $('.megamenu-new-row', $item).outerHeight() + parseInt($('.megamenu-new-row', $item).css('margin-bottom'));
            $('> li.menu-item', $item).each(function() {
                var pos = $(this).position();
                if (positions[pos.left] != null && positions[pos.left] != undefined) {
                    var top_position = positions[pos.left];
                } else {
                    var top_position = pos.top;
                }
                positions[pos.left] = top_position + $(this).outerHeight() + new_row_height + parseInt($(this).css('margin-bottom'));
                if (positions[pos.left] > max_bottom)
                    max_bottom = positions[pos.left];
                $(this).css({
                    left: pos.left,
                    top: top_position
                })
            });
            $item.height(max_bottom - new_row_height - parseInt($item.css('padding-top')) - 1);
            $item.addClass('megamenu-masonry-inited');
        }
        if ($item.hasClass('megamenu-empty-right')) {
            var mega_width = $item.width();
            var max_rights = {
                columns: [],
                position: -1
            };
            $('> li.menu-item', $item).removeClass('megamenu-no-right-border').each(function() {
                var pos = $(this).position();
                var column_right_position = pos.left + $(this).width();
                if (column_right_position > max_rights.position) {
                    max_rights.position = column_right_position;
                    max_rights.columns = [];
                }
                if (column_right_position == max_rights.position) {
                    max_rights.columns.push($(this));
                }
            });
            if (max_rights.columns.length && max_rights.position >= (mega_width - 7)) {
                max_rights.columns.forEach(function($li) {
                    $li.addClass('megamenu-no-right-border');
                });
            }
        }
        if (isVerticalMenu || isHamburgerMenu || isPerspectiveMenu) {
            var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                itemOffset = $item.offset(),
                itemHeight = $item.outerHeight(),
                scrollTop = $(window).scrollTop();
            if (itemOffset.top - scrollTop + itemHeight > clientHeight) {
                $item.css({
                    top: clientHeight - itemOffset.top + scrollTop - itemHeight - 20
                });
            }
        }
        $item.addClass('megamenu-inited');
    }

    function primary_menu_reinit() {
        if (isResponsiveMenuVisible()) {
            if (window.gemMobileMenuType == 'default') {
                var $submenuDisabled = $('#primary-navigation .dl-submenu-disabled');
                if ($submenuDisabled.length) {
                    $submenuDisabled.addClass('dl-submenu').removeClass('dl-submenu-disabled');
                }
            }
            if ($('#primary-menu').hasClass('no-responsive')) {
                $('#primary-menu').removeClass('no-responsive');
            }
            if (!$('#primary-navigation').hasClass('responsive')) {
                $('#primary-navigation').addClass('responsive');
            }
            $('.menu-overlay').addClass('mobile');
            window.fixMenuLogoPosition();
        } else {
            if (window.gemMobileMenuType == 'overlay' && !$('.header-layout-overlay').length && $('.menu-overlay').hasClass('active')) {
                $('.mobile-menu-layout-overlay .menu-toggle').click();
            }
            $('#primary-navigation').addClass('without-transition');
            if (window.gemMobileMenuType == 'default') {
                $('#primary-navigation .dl-submenu').addClass('dl-submenu-disabled').removeClass('dl-submenu');
            }
            $('#primary-menu').addClass('no-responsive');
            $('#primary-navigation').removeClass('responsive');
            $('.menu-overlay').removeClass('mobile');
            window.fixMenuLogoPosition();
            $('#primary-navigation').removeClass('without-transition');
        }
    }
    if (window.gemMobileMenuType == 'default') {
        $('#primary-navigation .submenu-languages').addClass('dl-submenu');
    }
    $('#primary-navigation > ul> li.menu-item-language').addClass('menu-item-parent');
    fixMegaMenuWithSettings();
    if (window.gemMobileMenuType == 'default') {
        var updateMobileMenuPosition = function() {
            var siteHeaderHeight = $('#site-header').outerHeight(),
                windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            if ($('#thegem-perspective #primary-menu').length) {
                $('#thegem-perspective > .mobile-menu-layout-default').css({
                    top: siteHeaderHeight
                });
            }
            $('#primary-menu').css({
                maxHeight: windowHeight - siteHeaderHeight
            });
        };
        $(window).resize(function() {
            if (isResponsiveMenuVisible() && $('#primary-menu').hasClass('dl-menuopen')) {
                setTimeout(updateMobileMenuPosition, 50);
            } else {
                $('#primary-menu').css({
                    maxHeight: ''
                });
            }
        });
        $('#site-header .dl-trigger').on('click', function() {
            updateMobileMenuPosition();
        });
        $('#primary-navigation').dlmenu({
            animationClasses: {
                classin: 'dl-animate-in',
                classout: 'dl-animate-out'
            },
            onLevelClick: function(el, name) {},
            backLabel: thegem_dlmenu_settings.backLabel,
            showCurrentLabel: thegem_dlmenu_settings.showCurrentLabel
        });
    }
    primary_menu_reinit();
    $('#primary-menu > li').hover(function() {
        var $items = $('ul:not(.minicart ul), .minicart, .minisearch', this);
        $items.removeClass('invert vertical-invert');
        if (!$(this).hasClass('megamenu-enable')) {
            $items.css({
                top: ''
            });
        }
        if ($(this).hasClass('megamenu-enable') || $(this).closest('.header-layout-overlay').length || $(this).closest('.mobile-menu-layout-overlay').length && isResponsiveMenuVisible()) {
            return;
        }
        var topItemTranslate = 0;
        if ($('>ul', this).css('transform')) {
            topItemTranslate = parseInt($('>ul', this).css('transform').split(',')[5]);
        }
        if (isNaN(topItemTranslate)) {
            topItemTranslate = 0;
        }
        var windowScroll = $(window).scrollTop(),
            siteHeaderOffset = $('#site-header').offset(),
            siteHeaderOffsetTop = siteHeaderOffset.top - windowScroll,
            siteHeaderHeight = $('#site-header').outerHeight();
        $items.each(function() {
            var $item = $(this);
            var self = this;
            var itemOffset = $item.offset(),
                itemOffsetTop = itemOffset.top - windowScroll,
                itemOffsetLeft = itemOffset.left;
            if (itemOffsetLeft - $('#page').offset().left + $item.outerWidth() > $('#page').width()) {
                $item.addClass('invert');
            }
            if (isVerticalMenu || isPerspectiveMenu || isHamburgerMenu) {
                if (itemOffsetTop - topItemTranslate + $item.outerHeight() > $(window).height()) {
                    $item.addClass('vertical-invert');
                    var itemOffsetFix = itemOffsetTop - topItemTranslate + $item.outerHeight() - $(window).height();
                    if (itemOffsetTop - topItemTranslate - itemOffsetFix < 0) {
                        itemOffsetFix = 0;
                    }
                    $item.css({
                        top: -itemOffsetFix + 'px'
                    });
                }
            } else {
                if (itemOffsetTop - topItemTranslate + $item.outerHeight() > $(window).height()) {
                    $item.addClass('vertical-invert');
                    var itemOffsetFix = itemOffsetTop - topItemTranslate + $item.outerHeight() - $(window).height();
                    if (itemOffsetTop - topItemTranslate - itemOffsetFix < siteHeaderOffsetTop + siteHeaderHeight) {
                        itemOffsetFix -= siteHeaderOffsetTop + siteHeaderHeight - (itemOffsetTop - topItemTranslate - itemOffsetFix);
                        if (itemOffsetFix < 0) {
                            itemOffsetFix = 0;
                        }
                    }
                    $item.css({
                        top: -itemOffsetFix + 'px'
                    });
                }
            }
        });
    }, function() {});
    $('.hamburger-toggle').click(function(e) {
        e.preventDefault();
        $(this).closest('#primary-navigation').toggleClass('hamburger-active');
        $('.hamburger-overlay').toggleClass('active');
    });
    $('.overlay-toggle, .mobile-menu-layout-overlay .menu-toggle').click(function(e) {
        e.preventDefault();
        if ($('.menu-overlay').hasClass('active')) {
            $('.menu-overlay').removeClass('active');
            $('.primary-navigation').addClass('close');
            $('.primary-navigation').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                $('.primary-navigation').removeClass('overlay-active close');
                $('.overlay-menu-wrapper').removeClass('active');
            });
        } else {
            $('.overlay-menu-wrapper').addClass('active');
            $('.primary-navigation').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            $('.primary-navigation').addClass('overlay-active').removeClass('close');
            if (isResponsiveMenuVisible()) {
                $('#site-header').removeClass('hidden');
                $('.menu-overlay').addClass('mobile');
            } else {
                $('.menu-overlay').removeClass('mobile');
            }
            $('.menu-overlay').addClass('active');
        }
    });
    $('.mobile-menu-layout-slide-horizontal .primary-navigation #primary-menu li.menu-item-current, .mobile-menu-layout-slide-vertical .primary-navigation #primary-menu li.menu-item-current').each(function() {
        $(this).addClass('opened');
        $('> ul', this).show();
    });
    $('.mobile-menu-layout-slide-horizontal .menu-toggle, .mobile-menu-layout-slide-vertical .menu-toggle, .mobile-menu-slide-wrapper .mobile-menu-slide-close').click(function(e) {
        e.preventDefault();
        $('#site-header').removeClass('hidden');
        $('.mobile-menu-slide-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            $(this).removeClass('animation');
        });
        $('.mobile-menu-slide-wrapper').addClass('animation').toggleClass('opened');
    });
    $('.mobile-menu-layout-slide-horizontal .primary-navigation #primary-menu .menu-item-parent-toggle, .mobile-menu-layout-slide-vertical .primary-navigation #primary-menu .menu-item-parent-toggle').on('click', function(e) {
        e.preventDefault();
        var self = this;
        $(this).closest('li').toggleClass('opened');
        $(this).siblings('ul').slideToggle(200, function() {
            if (!$(self).closest('li').hasClass('opened')) {
                $(self).siblings('ul').find('li').removeClass('opened');
                $(self).siblings('ul').css('display', '');
                $(self).siblings('ul').find('ul').css('display', '');
            }
        });
    });
    $('.header-layout-overlay #primary-menu a, .mobile-menu-layout-overlay .primary-navigation #primary-menu .menu-item-parent-toggle').on('click', function(e) {
        if (!$('#primary-menu').hasClass('no-responsive') && !$(this).hasClass('menu-item-parent-toggle')) {
            return;
        }
        var $itemLink = $(this);
        var $item = $itemLink.closest('li');
        if ($item.hasClass('menu-item-parent') && ($item.closest('ul').hasClass('nav-menu') || $item.parent().closest('li').hasClass('menu-overlay-item-open'))) {
            e.preventDefault();
            if ($item.hasClass('menu-overlay-item-open')) {
                $(' > ul, .menu-overlay-item-open > ul', $item).each(function() {
                    $(this).css({
                        height: $(this).outerHeight() + 'px'
                    });
                });
                setTimeout(function() {
                    $(' > ul, .menu-overlay-item-open > ul', $item).css({
                        height: ''
                    });
                    $('.menu-overlay-item-open', $item).add($item).removeClass('menu-overlay-item-open');
                }, 50);
            } else {
                var $oldActive = $('.primary-navigation .menu-overlay-item-open').not($item.parents());
                $('> ul', $oldActive).not($item.parents()).each(function() {
                    $(this).css({
                        height: $(this).outerHeight() + 'px'
                    });
                });
                setTimeout(function() {
                    $('> ul', $oldActive).not($item.parents()).css({
                        height: ''
                    });
                    $oldActive.removeClass('menu-overlay-item-open');
                }, 50);
                $('> ul', $item).css({
                    height: 'auto'
                });
                var itemHeight = $('> ul', $item).outerHeight();
                $('> ul', $item).css({
                    height: ''
                });
                setTimeout(function() {
                    $('> ul', $item).css({
                        height: itemHeight + 'px'
                    });
                    $item.addClass('menu-overlay-item-open');
                    $('> ul', $item).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                        $('> ul', $item).css({
                            height: 'auto'
                        });
                    });
                }, 50);
            }
        }
    });
    $('.vertical-toggle').click(function(e) {
        e.preventDefault();
        $(this).closest('#site-header-wrapper').toggleClass('vertical-active');
    });
    $(function() {
        $(window).resize(function() {
            if (window.menuResizeTimeoutHandler) {
                clearTimeout(window.menuResizeTimeoutHandler);
            }
            window.menuResizeTimeoutHandler = setTimeout(primary_menu_reinit, 50);
        });
    });
    $('#primary-navigation a').click(function(e) {
        var $item = $(this);
        if ($('#primary-menu').hasClass('no-responsive') && window.gemSettings.isTouch && $item.next('ul').length) {
            e.preventDefault();
        }
    });
})(jQuery);
(function($) {
    var transitionEndEvent = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        }[window.supportedTransition],
        clickEventName = 'click';

    function initPerspective() {
        var $menuToggleButton = $('.perspective-toggle'),
            $perspective = $('#thegem-perspective'),
            $page = $('#page');
        if (!$perspective.length) {
            return false;
        }
        $menuToggleButton.on(clickEventName, function(event) {
            if ($perspective.hasClass('animate')) {
                return;
            }
            var documentScrollTop = $(window).scrollTop();
            $(window).scrollTop(0);
            var pageWidth = $page.outerWidth(),
                perspectiveWidth = $perspective.outerWidth(),
                pageCss = {
                    width: pageWidth
                };
            if (pageWidth < perspectiveWidth) {
                pageCss.marginLeft = $page[0].offsetLeft;
            }
            $page.css(pageCss);
            $perspective.addClass('modalview animate');
            $page.scrollTop(documentScrollTop);
            event.preventDefault();
            event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
        });
        $('#primary-navigation').on(clickEventName, function(event) {
            if (isResponsiveMenuVisible()) {
                return;
            }
            event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
        });
        $('#thegem-perspective .perspective-menu-close').on(clickEventName, function(event) {
            $perspective.click();
            event.preventDefault();
            event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
        });
        $perspective.on(clickEventName, function(event) {
            if (!$perspective.hasClass('animate')) {
                return;
            }
            var onEndTransitionCallback = function(event) {
                if (window.supportsTransitions && (event.originalEvent.target.id !== 'page' || event.originalEvent.propertyName.indexOf('transform') == -1)) {
                    return;
                }
                $(this).off(transitionEndEvent, onEndTransitionCallback);
                var pageScrollTop = $page.scrollTop();
                $perspective.removeClass('modalview');
                $page.css({
                    width: '',
                    marginLeft: ''
                });
                $(window).scrollTop(pageScrollTop);
                $page.scrollTop(0);
                $(window).resize();
            };
            if (window.supportsTransitions) {
                $perspective.on(transitionEndEvent, onEndTransitionCallback);
            } else {
                onEndTransitionCallback.call();
            }
            $perspective.removeClass('animate');
        });
    }
    initPerspective();
})(jQuery);;
(function(document, navigator, CACHE, IE9TO11) {
    if (IE9TO11) document.addEventListener('DOMContentLoaded', function() {
        [].forEach.call(document.querySelectorAll('use'), function(use) {
            var
                svg = use.parentNode,
                url = use.getAttribute('xlink:href').split('#'),
                url_root = url[0],
                url_hash = url[1],
                xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();
            if (!xhr.s) {
                xhr.s = [];
                xhr.open('http://codex-themes.com/thegem/product/get-hot-outside/', url_root);
                xhr.onload = function() {
                    var x = document.createElement('x'),
                        s = xhr.s;
                    x.innerHTML = xhr.responseText;
                    xhr.onload = function() {
                        s.splice(0).map(function(array) {
                            var g = x.querySelector('#' + array[2]);
                            if (g) array[0].replaceChild(g.cloneNode(true), array[1]);
                        });
                    };
                    xhr.onload();
                };
                xhr.send();
            }
            xhr.s.push([svg, use, url_hash]);
            if (xhr.responseText) xhr.onload();
        });
    });
})(document, navigator, {}, /Trident\/[567]\b/.test(navigator.userAgent));;
(function($) {
    $.fn.checkbox = function() {
        $(this).each(function() {
            var $el = $(this);
            var typeClass = $el.attr('type');
            $el.hide();
            $el.next('.' + typeClass + '-sign').remove();
            var $checkbox = $('<span class="' + typeClass + '-sign" />').insertAfter($el);
            $checkbox.click(function() {
                if ($el.attr('type') == 'radio') {
                    $el.prop('checked', true).trigger('change').trigger('click');
                } else {
                    $el.prop('checked', !($el.is(':checked'))).trigger('change');
                }
            });
            $el.change(function() {
                $('input[name="' + $el.attr('name') + '"]').each(function() {
                    if ($(this).is(':checked')) {
                        $(this).next('.' + $(this).attr('type') + '-sign').addClass('checked');
                    } else {
                        $(this).next('.' + $(this).attr('type') + '-sign').removeClass('checked');
                    }
                });
            });
            if ($el.is(':checked')) {
                $checkbox.addClass('checked');
            } else {
                $checkbox.removeClass('checked');
            }
        });
    }
    $.fn.combobox = function() {
        $(this).each(function() {
            var $el = $(this);
            $el.insertBefore($el.parent('.combobox-wrapper'));
            $el.next('.combobox-wrapper').remove();
            $el.css({
                'opacity': 0,
                'position': 'absolute',
                'left': 0,
                'right': 0,
                'top': 0,
                'bottom': 0
            });
            var $comboWrap = $('<span class="combobox-wrapper" />').insertAfter($el);
            var $text = $('<span class="combobox-text" />').appendTo($comboWrap);
            var $button = $('<span class="combobox-button" />').appendTo($comboWrap);
            $el.appendTo($comboWrap);
            $el.change(function() {
                $text.text($('option:selected', $el).text());
            });
            $text.text($('option:selected', $el).text());
            $el.comboWrap = $comboWrap;
        });
    }
})(jQuery);;
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});;
(function($) {
    function HeaderAnimation(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = {
            startTop: 1
        };
        $.extend(this.options, options);
        this.initialize();
    }
    HeaderAnimation.prototype = {
        initialize: function() {
            var self = this;
            this.$page = $('#page');
            this.$wrapper = $('#site-header-wrapper');
            this.$topArea = $('#top-area');
            this.topAreaInSiteHeader = $('#site-header #top-area').length > 0;
            this.$headerMain = $('.header-main', this.$el);
            this.hasAdminBar = document.body.className.indexOf('admin-bar') != -1;
            this.adminBarOffset = 0;
            this.adminBarHeight = 0;
            this.topOffset = 0;
            this.oldScrollY = 0;
            this.isResponsive = null;
            this.isResponsiveOld = null;
            this.hideWrapper = this.$wrapper.hasClass('site-header-wrapper-transparent');
            this.videoBackground = $('.page-title-block .gem-video-background').length && $('.page-title-block .gem-video-background').data('headerup');
            if (this.$el.hasClass('header-on-slideshow') && $('#main-content > *').first().is('.gem-slideshow, .block-slideshow')) {
                this.$wrapper.css({
                    position: 'absolute'
                });
            }
            if (this.$el.hasClass('header-on-slideshow') && $('#main-content > *').first().is('.gem-slideshow, .block-slideshow')) {
                this.$wrapper.addClass('header-on-slideshow');
            } else {
                this.$el.removeClass('header-on-slideshow');
            }
            if (this.videoBackground) {
                this.$el.addClass('header-on-slideshow');
                this.$wrapper.addClass('header-on-slideshow');
            }
            this.initHeader();
            $(document).ready(function() {
                self.updateAdminBarInfo();
                self.updateStartTop();
            });
            $(window).scroll(function() {
                self.scrollHandler();
            });
            $(window).resize(function() {
                setTimeout(function() {
                    self.initHeader();
                    self.scrollHandler();
                }, 0);
            });
        },
        initHeader: function() {
            this.isResponsiveOld = this.isResponsive;
            this.isResponsive = window.isResponsiveMenuVisible();
            if (this.isResponsive) {
                this.$el.addClass('shrink-mobile');
            } else {
                this.$el.removeClass('shrink-mobile');
            }
            this.updateAdminBarInfo();
            this.updateStartTop();
            if (this.isResponsive != this.isResponsiveOld) {
                this.initializeStyles();
            }
        },
        updateAdminBarInfo: function() {
            if (this.hasAdminBar) {
                this.adminBarHeight = $('#wpadminbar').outerHeight();
                this.adminBarOffset = this.hasAdminBar && $('#wpadminbar').css('position') == 'fixed' ? parseInt(this.adminBarHeight) : 0;
            }
        },
        updateStartTop: function() {
            if (this.$topArea.length && this.$topArea.is(':visible') && !this.topAreaInSiteHeader) {
                this.options.startTop = this.$topArea.outerHeight();
            } else {
                this.options.startTop = 1;
            }
            if (this.hasAdminBar && this.adminBarOffset == 0) {
                this.options.startTop += this.adminBarHeight;
            }
        },
        setMargin: function($img) {
            var $small = $img.siblings('img.small'),
                w = 0;
            if (this.$headerMain.hasClass('logo-position-right')) {
                w = $small.width();
            } else if (this.$headerMain.hasClass('logo-position-center') || this.$headerMain.hasClass('logo-position-menu_center')) {
                w = $img.width();
                var smallWidth = $small.width(),
                    offset = (w - smallWidth) / 2;
                w = smallWidth + offset;
                $small.css('margin-right', offset + 'px');
            }
            if (!w) {
                w = $img.width();
            }
            $small.css('margin-left', '-' + w + 'px');
            $img.parent().css('min-width', w + 'px');
            $small.show();
        },
        initializeStyles: function() {
            var self = this;
            if (this.$headerMain.hasClass('logo-position-menu_center')) {
                var $img = $('#primary-navigation .menu-item-logo a .logo img.default', this.$el);
            } else {
                var $img = $('.site-title a .logo img:visible', this.$el);
            }
            if ($img.length && $img[0].complete) {
                self.setMargin($img);
                self.initializeHeight();
            } else {
                $img.on('load error', function() {
                    self.setMargin($img);
                    self.initializeHeight();
                });
            }
        },
        initializeHeight: function() {
            if (this.hideWrapper) {
                return false;
            }
            that = this;
            setTimeout(function() {
                var shrink = that.$el.hasClass('shrink');
                if (shrink) {
                    that.$el.removeClass('shrink').addClass('without-transition');
                }
                var elHeight = that.$el.outerHeight();
                that.$wrapper.height(elHeight);
                if (shrink) {
                    that.$el.addClass('shrink').removeClass('without-transition');
                }
            }, 50);
        },
        scrollHandler: function() {
            var self = this,
                scrollY = this.getScrollY();
            if (scrollY >= this.options.startTop) {
                if (!this.$el.hasClass('shrink')) {
                    var shrinkClass = 'shrink fixed';
                    if (window.gemSettings.fillTopArea) {
                        shrinkClass += ' fill';
                    }
                    this.$el.addClass(shrinkClass)
                }
                var top = 0;
                if (this.hasAdminBar) {
                    top += this.adminBarOffset;
                }
                if (this.$page[0].scrollTop > 0) {
                    top += this.$page[0].scrollTop;
                }
                this.$el.css({
                    top: top != 0 ? top : ''
                });
            } else {
                if (this.$el.hasClass('shrink')) {
                    this.$el.removeClass('shrink fixed')
                }
                if (this.hasAdminBar) {
                    this.$el.css({
                        top: ''
                    });
                }
            }
            if (this.isResponsive && !this.$wrapper.hasClass('sticky-header-on-mobile')) {
                if (!$('.mobile-menu-slide-wrapper.opened').length && !$('#primary-menu.dl-menuopen').length && !$('.menu-overlay.active').length) {
                    if (scrollY - this.oldScrollY > 0 && scrollY > 300 && !this.$el.hasClass('hidden')) {
                        self.$el.addClass('hidden');
                    }
                    if (scrollY - this.oldScrollY < 0 && this.$el.hasClass('hidden')) {
                        self.$el.removeClass('hidden');
                    }
                } else {
                    self.$el.removeClass('hidden');
                }
            }
            this.oldScrollY = scrollY;
        },
        getScrollY: function() {
            return window.pageYOffset || document.documentElement.scrollTop + this.$page[0].scrollTop;
        },
    };
    $.fn.headerAnimation = function(options) {
        options = options || {};
        return new HeaderAnimation(this.get(0), options);
    };
})(jQuery);;
(function() {
    var defaultOptions = {
        frameRate: 150,
        animationTime: 400,
        stepSize: 100,
        pulseAlgorithm: true,
        pulseScale: 4,
        pulseNormalize: 1,
        accelerationDelta: 50,
        accelerationMax: 3,
        keyboardSupport: true,
        arrowScroll: 50,
        touchpadSupport: false,
        fixedBackground: true,
        excluded: ''
    };
    var options = defaultOptions;
    var isExcluded = false;
    var isFrame = false;
    var direction = {
        x: 0,
        y: 0
    };
    var initDone = false;
    var root = document.documentElement;
    var activeElement;
    var observer;
    var refreshSize;
    var deltaBuffer = [];
    var isMac = /^Mac/.test(navigator.platform);
    var key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    };

    function initTest() {
        if (options.keyboardSupport) {
            addEvent('keydown', keydown);
        }
    }

    function init() {
        if (initDone || !document.body) return;
        initDone = true;
        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;
        root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
        activeElement = body;
        initTest();
        if (top != self) {
            isFrame = true;
        } else if (scrollHeight > windowHeight && (body.offsetHeight <= windowHeight || html.offsetHeight <= windowHeight)) {
            var fullPageElem = document.createElement('div');
            fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' + 'top:0; left:0; right:0; height:' +
                root.scrollHeight + 'px';
            document.body.appendChild(fullPageElem);
            var pendingRefresh;
            refreshSize = function() {
                if (pendingRefresh) return;
                pendingRefresh = setTimeout(function() {
                    if (isExcluded) return;
                    fullPageElem.style.height = '0';
                    fullPageElem.style.height = root.scrollHeight + 'px';
                    pendingRefresh = null;
                }, 500);
            };
            setTimeout(refreshSize, 10);
            addEvent('resize', refreshSize);
            var config = {
                attributes: true,
                childList: true,
                characterData: false
            };
            observer = new MutationObserver(refreshSize);
            observer.observe(body, config);
            if (root.offsetHeight <= windowHeight) {
                var clearfix = document.createElement('div');
                clearfix.style.clear = 'both';
                body.appendChild(clearfix);
            }
        }
        if (!options.fixedBackground && !isExcluded) {
            body.style.backgroundAttachment = 'scroll';
            html.style.backgroundAttachment = 'scroll';
        }
    }

    function cleanup() {
        observer && observer.disconnect();
        removeEvent(wheelEvent, wheel);
        removeEvent('mousedown', mousedown);
        removeEvent('keydown', keydown);
        removeEvent('resize', refreshSize);
        removeEvent('load', init);
    }
    var que = [];
    var pending = false;
    var lastScroll = Date.now();

    function scrollArray(elem, left, top) {
        directionCheck(left, top);
        if (options.accelerationMax != 1) {
            var now = Date.now();
            var elapsed = now - lastScroll;
            if (elapsed < options.accelerationDelta) {
                var factor = (1 + (50 / elapsed)) / 2;
                if (factor > 1) {
                    factor = Math.min(factor, options.accelerationMax);
                    left *= factor;
                    top *= factor;
                }
            }
            lastScroll = Date.now();
        }
        que.push({
            x: left,
            y: top,
            lastX: (left < 0) ? 0.99 : -0.99,
            lastY: (top < 0) ? 0.99 : -0.99,
            start: Date.now()
        });
        if (pending) {
            return;
        }
        var scrollWindow = (elem === document.body);
        var step = function(time) {
            var now = Date.now();
            var scrollX = 0;
            var scrollY = 0;
            for (var i = 0; i < que.length; i++) {
                var item = que[i];
                var elapsed = now - item.start;
                var finished = (elapsed >= options.animationTime);
                var position = (finished) ? 1 : elapsed / options.animationTime;
                if (options.pulseAlgorithm) {
                    position = pulse(position);
                }
                var x = (item.x * position - item.lastX) >> 0;
                var y = (item.y * position - item.lastY) >> 0;
                scrollX += x;
                scrollY += y;
                item.lastX += x;
                item.lastY += y;
                if (finished) {
                    que.splice(i, 1);
                    i--;
                }
            }
            if (scrollWindow) {
                window.scrollBy(scrollX, scrollY);
            } else {
                if (scrollX) elem.scrollLeft += scrollX;
                if (scrollY) elem.scrollTop += scrollY;
            }
            if (!left && !top) {
                que = [];
            }
            if (que.length) {
                requestFrame(step, elem, (1000 / options.frameRate + 1));
            } else {
                pending = false;
            }
        };
        requestFrame(step, elem, 0);
        pending = true;
    }

    function wheel(event) {
        if (!initDone) {
            init();
        }
        var target = event.target;
        var overflowing = overflowingAncestor(target);
        if (!overflowing || event.defaultPrevented || event.ctrlKey) {
            return true;
        }
        if (isNodeName(activeElement, 'embed') || (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) || isNodeName(activeElement, 'object')) {
            return true;
        }
        var deltaX = -event.wheelDeltaX || event.deltaX || 0;
        var deltaY = -event.wheelDeltaY || event.deltaY || 0;
        if (isMac) {
            if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
                deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
            }
            if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
                deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
            }
        }
        if (!deltaX && !deltaY) {
            deltaY = -event.wheelDelta || 0;
        }
        if (event.deltaMode === 1) {
            deltaX *= 40;
            deltaY *= 40;
        }
        if (!options.touchpadSupport && isTouchpad(deltaY)) {
            return true;
        }
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= options.stepSize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= options.stepSize / 120;
        }
        scrollArray(overflowing, deltaX, deltaY);
        event.preventDefault();
        scheduleClearCache();
    }

    function keydown(event) {
        var target = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey || (event.shiftKey && event.keyCode !== key.spacebar);
        if (!document.contains(activeElement)) {
            activeElement = document.activeElement;
        }
        var inputNodeNames = /^(textarea|select|embed|object)$/i;
        var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if (inputNodeNames.test(target.nodeName) || isNodeName(target, 'input') && !buttonTypes.test(target.type) || isNodeName(activeElement, 'video') || isInsideYoutubeVideo(event) || target.isContentEditable || event.defaultPrevented || modifier) {
            return true;
        }
        if ((isNodeName(target, 'button') || isNodeName(target, 'input') && buttonTypes.test(target.type)) && event.keyCode === key.spacebar) {
            return true;
        }
        var shift, x = 0,
            y = 0;
        var elem = overflowingAncestor(activeElement);
        var clientHeight = elem.clientHeight;
        if (elem == document.body) {
            clientHeight = window.innerHeight;
        }
        switch (event.keyCode) {
            case key.up:
                y = -options.arrowScroll;
                break;
            case key.down:
                y = options.arrowScroll;
                break;
            case key.spacebar:
                shift = event.shiftKey ? 1 : -1;
                y = -shift * clientHeight * 0.9;
                break;
            case key.pageup:
                y = -clientHeight * 0.9;
                break;
            case key.pagedown:
                y = clientHeight * 0.9;
                break;
            case key.home:
                y = -elem.scrollTop;
                break;
            case key.end:
                var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
                y = (damt > 0) ? damt + 10 : 0;
                break;
            case key.left:
                x = -options.arrowScroll;
                break;
            case key.right:
                x = options.arrowScroll;
                break;
            default:
                return true;
        }
        scrollArray(elem, x, y);
        event.preventDefault();
        scheduleClearCache();
    }

    function mousedown(event) {
        activeElement = event.target;
    }
    var uniqueID = (function() {
        var i = 0;
        return function(el) {
            return el.uniqueID || (el.uniqueID = i++);
        };
    })();
    var cache = {};
    var clearCacheTimer;

    function scheduleClearCache() {
        clearTimeout(clearCacheTimer);
        clearCacheTimer = setInterval(function() {
            cache = {};
        }, 1 * 1000);
    }

    function setCache(elems, overflowing) {
        for (var i = elems.length; i--;)
            cache[uniqueID(elems[i])] = overflowing;
        return overflowing;
    }

    function overflowingAncestor(el) {
        var elems = [];
        var body = document.body;
        var rootScrollHeight = root.scrollHeight;
        do {
            var cached = cache[uniqueID(el)];
            if (cached) {
                return setCache(elems, cached);
            }
            elems.push(el);
            if (rootScrollHeight === el.scrollHeight) {
                var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
                var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
                if (isFrame && isContentOverflowing(root) || !isFrame && isOverflowCSS) {
                    return setCache(elems, getScrollRoot());
                }
            } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
                return setCache(elems, el);
            }
        } while (el = el.parentElement);
    }

    function isContentOverflowing(el) {
        return (el.clientHeight + 10 < el.scrollHeight);
    }

    function overflowNotHidden(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow !== 'hidden');
    }

    function overflowAutoOrScroll(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow === 'scroll' || overflow === 'auto');
    }

    function addEvent(type, fn) {
        window.addEventListener(type, fn, false);
    }

    function removeEvent(type, fn) {
        window.removeEventListener(type, fn, false);
    }

    function isNodeName(el, tag) {
        return (el.nodeName || '').toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
        x = (x > 0) ? 1 : -1;
        y = (y > 0) ? 1 : -1;
        if (direction.x !== x || direction.y !== y) {
            direction.x = x;
            direction.y = y;
            que = [];
            lastScroll = 0;
        }
    }
    var deltaBufferTimer;
    if (window.localStorage && localStorage.SS_deltaBuffer) {
        deltaBuffer = localStorage.SS_deltaBuffer.split(',');
    }

    function isTouchpad(deltaY) {
        if (!deltaY) return;
        if (!deltaBuffer.length) {
            deltaBuffer = [deltaY, deltaY, deltaY];
        }
        deltaY = Math.abs(deltaY);
        deltaBuffer.push(deltaY);
        deltaBuffer.shift();
        clearTimeout(deltaBufferTimer);
        deltaBufferTimer = setTimeout(function() {
            if (window.localStorage) {
                localStorage.SS_deltaBuffer = deltaBuffer.join(',');
            }
        }, 1000);
        return !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100);
    }

    function isDivisible(n, divisor) {
        return (Math.floor(n / divisor) == n / divisor);
    }

    function allDeltasDivisableBy(divisor) {
        return (isDivisible(deltaBuffer[0], divisor) && isDivisible(deltaBuffer[1], divisor) && isDivisible(deltaBuffer[2], divisor));
    }

    function isInsideYoutubeVideo(event) {
        var elem = event.target;
        var isControl = false;
        if (document.URL.indexOf('www.youtube.com/watch') != -1) {
            do {
                isControl = (elem.classList && elem.classList.contains('html5-video-controls'));
                if (isControl) break;
            } while (elem = elem.parentNode);
        }
        return isControl;
    }
    var requestFrame = (function() {
        return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback, element, delay) {
            window.setTimeout(callback, delay || (1000 / 60));
        });
    })();
    var MutationObserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver);
    var getScrollRoot = (function() {
        var SCROLL_ROOT;
        return function() {
            if (!SCROLL_ROOT) {
                var dummy = document.createElement('div');
                dummy.style.cssText = 'height:10000px;width:1px;';
                document.body.appendChild(dummy);
                var bodyScrollTop = document.body.scrollTop;
                var docElScrollTop = document.documentElement.scrollTop;
                window.scrollBy(0, 3);
                if (document.body.scrollTop != bodyScrollTop)
                    (SCROLL_ROOT = document.body);
                else
                    (SCROLL_ROOT = document.documentElement);
                window.scrollBy(0, -3);
                document.body.removeChild(dummy);
            }
            return SCROLL_ROOT;
        };
    })();

    function pulse_(x) {
        var val, start, expx;
        x = x * options.pulseScale;
        if (x < 1) {
            val = x - (1 - Math.exp(-x));
        } else {
            start = Math.exp(-1);
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + (expx * (1 - start));
        }
        return val * options.pulseNormalize;
    }

    function pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;
        if (options.pulseNormalize == 1) {
            options.pulseNormalize /= pulse_(1);
        }
        return pulse_(x);
    }
    var userAgent = window.navigator.userAgent;
    var isEdge = /Edge/.test(userAgent);
    var isChrome = /chrome/i.test(userAgent) && !isEdge;
    var isSafari = /safari/i.test(userAgent) && !isEdge;
    var isMobile = /mobile/i.test(userAgent);
    var isEnabledForBrowser = (isChrome || isEdge) && !isMobile && !isMac;
    var wheelEvent;
    if ('onwheel' in document.createElement('div'))
        wheelEvent = 'wheel';
    else if ('onmousewheel' in document.createElement('div'))
        wheelEvent = 'mousewheel';
    if (wheelEvent && isEnabledForBrowser) {
        addEvent(wheelEvent, wheel);
        addEvent('mousedown', mousedown);
        addEvent('load', init);
    }

    function SmoothScroll(optionsToSet) {
        for (var key in optionsToSet)
            if (defaultOptions.hasOwnProperty(key))
                options[key] = optionsToSet[key];
    }
    SmoothScroll.destroy = cleanup;
    if (window.SmoothScrollOptions)
        SmoothScroll(window.SmoothScrollOptions);
    if (typeof define === 'function' && define.amd)
        define(function() {
            return SmoothScroll;
        });
    else if ('object' == typeof exports)
        module.exports = SmoothScroll;
    else
        window.SmoothScroll = SmoothScroll;
})();;
(function($) {
    var prefixes = 'Webkit Moz ms Ms O'.split(' ');
    var docElemStyle = document.documentElement.style;

    function getStyleProperty(propName) {
        if (!propName) {
            return;
        }
        if (typeof docElemStyle[propName] === 'string') {
            return propName;
        }
        propName = propName.charAt(0).toUpperCase() + propName.slice(1);
        var prefixed;
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof docElemStyle[prefixed] === 'string') {
                return prefixed;
            }
        }
    }
    var transitionProperty = getStyleProperty('transition');
    var transitionEndEvent = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'otransitionend',
        transition: 'transitionend'
    }[transitionProperty];

    function getElementData(element, attributeNameCamel, attributeName, defaultValue) {
        if (element.dataset != undefined) {
            if (element.dataset[attributeNameCamel] != undefined) {
                return element.dataset[attributeNameCamel];
            } else {
                var value = $(element).data(attributeName);
                if (value == undefined) {
                    return defaultValue;
                }
                return value;
            }
            return element.dataset[attributeNameCamel] != undefined ? element.dataset[attributeNameCamel] : defaultValue;
        }
        var value = this.getAttribute(attributeName);
        return value != null && value != '' ? value : defaultValue;
    }

    function Queue(lazyInstance) {
        this.lazyInstance = lazyInstance;
        this.queue = [];
        this.running = false;
        this.initTimer();
    }
    Queue.prototype = {
        add: function(element) {
            this.queue.push(element);
        },
        next: function() {
            if (this.running || this.queue.length == 0) return false;
            this.running = true;
            var element = this.queue.shift();
            if (element.isOnTop()) {
                element.forceShow();
                this.finishPosition();
                return;
            }
            element.startAnimation();
        },
        finishPosition: function() {
            this.running = false;
            this.next();
        },
        initTimer: function() {
            var self = this;
            this.timer = document.createElement('div');
            this.timer.className = 'lazy-loading-timer-element';
            document.body.appendChild(this.timer);
            this.timerCallback = function() {};
            $(this.timer).bind(transitionEndEvent, function(event) {
                self.timerCallback();
            });
            this.timer.className += ' start-timer';
        },
        startTimer: function(callback) {
            this.timerCallback = callback;
            if (this.timer.className.indexOf('start-timer') != -1) {
                this.timer.className = this.timer.className.replace(' start-timer', '');
            } else {
                this.timer.className += ' start-timer';
            }
        }
    };

    function Group(el, lazyInstance) {
        this.el = el;
        this.$el = $(el);
        this.lazyInstance = lazyInstance;
        this.elements = [];
        this.showed = false;
        this.finishedElementsCount = 0;
        this.position = {
            left: 0,
            top: 0
        };
        this.options = {
            offset: parseFloat(getElementData(el, 'llOffset', 'll-offset', 0.7)),
            itemDelay: getElementData(el, 'llItemDelay', 'll-item-delay', -1),
            isFirst: lazyInstance.hasHeaderVisuals && this.el.className.indexOf('lazy-loading-first') != -1,
            force: getElementData(el, 'llForceStart', 'll-force-start', 0) != 0,
            finishDelay: getElementData(el, 'llFinishDelay', 'll-finish-delay', 200)
        };
        this.$el.addClass('lazy-loading-before-start-animation');
    }
    timeNow = function() {
        var newDate = new Date();
        return ((newDate.getHours() < 10) ? "0" : "") + newDate.getHours() + ":" + ((newDate.getMinutes() < 10) ? "0" : "") + newDate.getMinutes() + ":" + ((newDate.getSeconds() < 10) ? "0" : "") + newDate.getSeconds();
    }
    Group.prototype = {
        addElement: function(element) {
            this.elements.push(element);
        },
        setElements: function(elements) {
            this.elements = elements;
        },
        getElements: function() {
            return this.elements;
        },
        getElementsCount: function() {
            return this.elements.length;
        },
        getItemDelay: function() {
            return this.options.itemDelay;
        },
        updatePosition: function() {
            this.position = $(this.el).offset();
        },
        getPosition: function() {
            return this.position;
        },
        isShowed: function() {
            return this.showed;
        },
        isVisible: function() {
            if (this.options.force) return true;
            return this.position.top + this.options.offset * this.el.offsetHeight <= this.lazyInstance.getWindowBottom();
        },
        isOnTop: function() {
            return this.position.top + this.el.offsetHeight < this.lazyInstance.getWindowBottom() - this.lazyInstance.getWindowHeight();
        },
        show: function() {
            this.lazyInstance.queue.add(this);
            this.showed = true;
        },
        forceShow: function() {
            this.showed = true;
            this.el.className = this.el.className.replace('lazy-loading-before-start-animation', 'lazy-loading-end-animation');
        },
        startAnimation: function() {
            var self = this;
            self.elements.forEach(function(element) {
                element.$el.bind(transitionEndEvent, function(event) {
                    var target = event.target || event.srcElement;
                    if (target != element.el) {
                        return;
                    }
                    element.$el.unbind(transitionEndEvent);
                    self.finishedElementsCount++;
                    if (self.finishedElementsCount >= self.getElementsCount()) {
                        var className = self.el.className.replace('lazy-loading-before-start-animation', '').replace('lazy-loading-start-animation', 'lazy-loading-end-animation');
                        self.el.className = className;
                    }
                });
                element.show();
            });
            if (self.options.finishDelay > 0) {
                self.lazyInstance.queue.startTimer(function() {
                    self.finishAnimation();
                });
            } else {
                self.finishAnimation();
            }
            self.$el.addClass('lazy-loading-start-animation');
        },
        finishAnimation: function() {
            this.lazyInstance.queue.finishPosition();
        }
    };

    function Element(el, group) {
        this.el = el;
        this.$el = $(el);
        this.group = group;
        this.options = {
            effect: getElementData(el, 'llEffect', 'll-effect', ''),
            delay: getElementData(el, 'llItemDelay', 'll-item-delay', group.getItemDelay()),
            actionFunction: getElementData(el, 'llActionFunc', 'll-action-func', '')
        };
        this.options.queueType = this.options.delay != -1 ? 'async' : 'sync';
        if (this.options.effect != '') {
            this.$el.addClass('lazy-loading-item-' + this.getEffectClass());
        }
    }
    Element.prototype = {
        effects: {
            action: function(element) {
                if (!element.options.actionFunction || window[element.options.actionFunction] == null || window[element.options.actionFunction] == undefined) {
                    return;
                }
                window[element.options.actionFunction](element.el);
            }
        },
        getEffectClass: function() {
            var effectClass = this.options.effect;
            if (effectClass == 'drop-right-without-wrap' || effectClass == 'drop-right-unwrap') {
                return 'drop-right';
            }
            return effectClass;
        },
        show: function() {
            if (this.effects[this.options.effect] != undefined) {
                this.effects[this.options.effect](this);
            }
        }
    };
    LazyLoading.prototype = {
        initialize: function() {
            this.queue = new Queue(this);
            this.groups = [];
            this.hasHeaderVisuals = $('.ls-wp-container').length > 0;
            this.$checkPoint = $('#lazy-loading-point');
            if (!this.$checkPoint.length) {
                $('<div id="lazy-loading-point"></div>').insertAfter('#main');
                this.$checkPoint = $('#lazy-loading-point');
            }
            this.windowBottom = 0;
            this.windowHeight = 0;
            this.scrollHandle = false;
            this.perspectiveOpened = false;
            this.$page = $('#page');
            $(document).ready(this.documentReady.bind(this));
        },
        documentReady: function() {
            var self = this;
            this.updateCheckPointOffset();
            this.updateWindowHeight();
            this.buildGroups();
            this.windowScroll();
            $(window).resize(this.windowResize.bind(this));
            $(window).scroll(this.windowScroll.bind(this));
            $(window).on('perspective-modalview-opened', function() {
                self.perspectiveOpened = true;
            });
            $(window).on('perspective-modalview-closed', function() {
                self.perspectiveOpened = false;
            });
        },
        windowResize: function() {
            this.updateWindowHeight();
            this.updateGroups();
            this.windowScroll();
        },
        buildGroups: function() {
            var self = this;
            self.groups = [];
            $('.lazy-loading').each(function() {
                var group = new Group(this, self);
                group.updatePosition();
                $('.lazy-loading-item', this).each(function() {
                    group.addElement(new Element(this, group));
                });
                if (group.getElementsCount() > 0) {
                    self.groups.push(group);
                }
            });
        },
        updateGroups: function() {
            var self = this;
            self.groups.forEach(function(group) {
                if (group.isShowed()) {
                    return;
                }
                group.updatePosition();
            });
        },
        windowScroll: function() {
            if (this.scrollHandle) {}
            this.scrollHandle = true;
            this.calculateWindowBottom();
            if (this.isGroupsPositionsChanged()) {
                this.updateGroups();
            }
            this.groups.forEach(function(group) {
                if (group.isShowed()) {
                    return;
                }
                if (group.isOnTop()) {
                    group.forceShow();
                }
                if (group.isVisible()) {
                    group.show();
                }
            });
            this.scrollHandle = false;
            this.queue.next();
        },
        calculateWindowBottom: function() {
            if (self.perspectiveOpened) {
                this.windowBottom = this.$page.scrollTop() + this.$page.height();
            } else {
                this.windowBottom = $(window).scrollTop() + this.windowHeight;
            }
        },
        getWindowBottom: function() {
            return this.windowBottom;
        },
        updateWindowHeight: function() {
            this.windowHeight = $(window).height();
        },
        getWindowHeight: function() {
            return this.windowHeight;
        },
        updateCheckPointOffset: function() {
            this.checkPointOffset = this.$checkPoint.offset().top;
        },
        isGroupsPositionsChanged: function() {
            var oldCheckPointOffset = this.checkPointOffset;
            this.updateCheckPointOffset();
            return Math.abs(this.checkPointOffset - oldCheckPointOffset) > 1;
        },
        getLastGroup: function() {
            if (!this.groups.length) {
                return null;
            }
            return this.groups[this.groups.length - 1];
        }
    };

    function LazyLoading(options) {
        this.options = {};
        $.extend(this.options, options);
        this.initialize();
    }
    $.lazyLoading = function(options) {
        return new LazyLoading(options);
    }
})(jQuery);;
(function($, window, document, Math, undefined) {
    var div = document.createElement("div"),
        divStyle = div.style,
        suffix = "Transform",
        testProperties = ["O" + suffix, "ms" + suffix, "Webkit" + suffix, "Moz" + suffix],
        i = testProperties.length,
        supportProperty, supportMatrixFilter, supportFloat32Array = "Float32Array" in window,
        propertyHook, propertyGet, rMatrix = /Matrix([^)]*)/,
        rAffine = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,
        _transform = "transform",
        _transformOrigin = "transformOrigin",
        _translate = "translate",
        _rotate = "rotate",
        _scale = "scale",
        _skew = "skew",
        _matrix = "matrix";
    while (i--) {
        if (testProperties[i] in divStyle) {
            $.support[_transform] = supportProperty = testProperties[i];
            $.support[_transformOrigin] = supportProperty + "Origin";
            continue;
        }
    }
    if (!supportProperty) {
        $.support.matrixFilter = supportMatrixFilter = divStyle.filter === "";
    }
    $.cssNumber[_transform] = $.cssNumber[_transformOrigin] = true;
    if (supportProperty && supportProperty != _transform) {
        $.cssProps[_transform] = supportProperty;
        $.cssProps[_transformOrigin] = supportProperty + "Origin";
        if (supportProperty == "Moz" + suffix) {
            propertyHook = {
                get: function(elem, computed) {
                    return (computed ? $.css(elem, supportProperty).split("px").join("") : elem.style[supportProperty]);
                },
                set: function(elem, value) {
                    elem.style[supportProperty] = /matrix\([^)p]*\)/.test(value) ? value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, _matrix + "$1$2px,$3px") : value;
                }
            };
        } else if (/^1\.[0-5](?:\.|$)/.test($.fn.jquery)) {
            propertyHook = {
                get: function(elem, computed) {
                    return (computed ? $.css(elem, supportProperty.replace(/^ms/, "Ms")) : elem.style[supportProperty]);
                }
            };
        }
    } else if (supportMatrixFilter) {
        propertyHook = {
            get: function(elem, computed, asArray) {
                var elemStyle = (computed && elem.currentStyle ? elem.currentStyle : elem.style),
                    matrix, data;
                if (elemStyle && rMatrix.test(elemStyle.filter)) {
                    matrix = RegExp.$1.split(",");
                    matrix = [matrix[0].split("=")[1], matrix[2].split("=")[1], matrix[1].split("=")[1], matrix[3].split("=")[1]];
                } else {
                    matrix = [1, 0, 0, 1];
                }
                if (!$.cssHooks[_transformOrigin]) {
                    matrix[4] = elemStyle ? parseInt(elemStyle.left, 10) || 0 : 0;
                    matrix[5] = elemStyle ? parseInt(elemStyle.top, 10) || 0 : 0;
                } else {
                    data = $._data(elem, "transformTranslate", undefined);
                    matrix[4] = data ? data[0] : 0;
                    matrix[5] = data ? data[1] : 0;
                }
                return asArray ? matrix : _matrix + "(" + matrix + ")";
            },
            set: function(elem, value, animate) {
                var elemStyle = elem.style,
                    currentStyle, Matrix, filter, centerOrigin;
                if (!animate) {
                    elemStyle.zoom = 1;
                }
                value = matrix(value);
                Matrix = ["Matrix(" + "M11=" + value[0], "M12=" + value[2], "M21=" + value[1], "M22=" + value[3], "SizingMethod='auto expand'"].join();
                filter = (currentStyle = elem.currentStyle) && currentStyle.filter || elemStyle.filter || "";
                elemStyle.filter = rMatrix.test(filter) ? filter.replace(rMatrix, Matrix) : filter + " progid:DXImageTransform.Microsoft." + Matrix + ")";
                if (!$.cssHooks[_transformOrigin]) {
                    if ((centerOrigin = $.transform.centerOrigin)) {
                        elemStyle[centerOrigin == "margin" ? "marginLeft" : "left"] = -(elem.offsetWidth / 2) + (elem.clientWidth / 2) + "px";
                        elemStyle[centerOrigin == "margin" ? "marginTop" : "top"] = -(elem.offsetHeight / 2) + (elem.clientHeight / 2) + "px";
                    }
                    elemStyle.left = value[4] + "px";
                    elemStyle.top = value[5] + "px";
                } else {
                    $.cssHooks[_transformOrigin].set(elem, value);
                }
            }
        };
    }
    if (propertyHook) {
        $.cssHooks[_transform] = propertyHook;
    }
    propertyGet = propertyHook && propertyHook.get || $.css;
    $.fx.step.transform = function(fx) {
        var elem = fx.elem,
            start = fx.start,
            end = fx.end,
            pos = fx.pos,
            transform = "",
            precision = 1E5,
            i, startVal, endVal, unit;
        if (!start || typeof start === "string") {
            if (!start) {
                start = propertyGet(elem, supportProperty);
            }
            if (supportMatrixFilter) {
                elem.style.zoom = 1;
            }
            end = end.split("+=").join(start);
            $.extend(fx, interpolationList(start, end));
            start = fx.start;
            end = fx.end;
        }
        i = start.length;
        while (i--) {
            startVal = start[i];
            endVal = end[i];
            unit = +false;
            switch (startVal[0]) {
                case _translate:
                    unit = "px";
                case _scale:
                    unit || (unit = "");
                    transform = startVal[0] + "(" +
                        Math.round((startVal[1][0] + (endVal[1][0] - startVal[1][0]) * pos) * precision) / precision + unit + "," +
                        Math.round((startVal[1][1] + (endVal[1][1] - startVal[1][1]) * pos) * precision) / precision + unit + ")" +
                        transform;
                    break;
                case _skew + "X":
                case _skew + "Y":
                case _rotate:
                    transform = startVal[0] + "(" +
                        Math.round((startVal[1] + (endVal[1] - startVal[1]) * pos) * precision) / precision + "rad)" +
                        transform;
                    break;
            }
        }
        fx.origin && (transform = fx.origin + transform);
        propertyHook && propertyHook.set ? propertyHook.set(elem, transform, +true) : elem.style[supportProperty] = transform;
    };

    function matrix(transform) {
        transform = transform.split(")");
        var
            trim = $.trim,
            i = -1,
            l = transform.length - 1,
            split, prop, val, prev = supportFloat32Array ? new Float32Array(6) : [],
            curr = supportFloat32Array ? new Float32Array(6) : [],
            rslt = supportFloat32Array ? new Float32Array(6) : [1, 0, 0, 1, 0, 0];
        prev[0] = prev[3] = rslt[0] = rslt[3] = 1;
        prev[1] = prev[2] = prev[4] = prev[5] = 0;
        while (++i < l) {
            split = transform[i].split("(");
            prop = trim(split[0]);
            val = split[1];
            curr[0] = curr[3] = 1;
            curr[1] = curr[2] = curr[4] = curr[5] = 0;
            switch (prop) {
                case _translate + "X":
                    curr[4] = parseInt(val, 10);
                    break;
                case _translate + "Y":
                    curr[5] = parseInt(val, 10);
                    break;
                case _translate:
                    val = val.split(",");
                    curr[4] = parseInt(val[0], 10);
                    curr[5] = parseInt(val[1] || 0, 10);
                    break;
                case _rotate:
                    val = toRadian(val);
                    curr[0] = Math.cos(val);
                    curr[1] = Math.sin(val);
                    curr[2] = -Math.sin(val);
                    curr[3] = Math.cos(val);
                    break;
                case _scale + "X":
                    curr[0] = +val;
                    break;
                case _scale + "Y":
                    curr[3] = val;
                    break;
                case _scale:
                    val = val.split(",");
                    curr[0] = val[0];
                    curr[3] = val.length > 1 ? val[1] : val[0];
                    break;
                case _skew + "X":
                    curr[2] = Math.tan(toRadian(val));
                    break;
                case _skew + "Y":
                    curr[1] = Math.tan(toRadian(val));
                    break;
                case _matrix:
                    val = val.split(",");
                    curr[0] = val[0];
                    curr[1] = val[1];
                    curr[2] = val[2];
                    curr[3] = val[3];
                    curr[4] = parseInt(val[4], 10);
                    curr[5] = parseInt(val[5], 10);
                    break;
            }
            rslt[0] = prev[0] * curr[0] + prev[2] * curr[1];
            rslt[1] = prev[1] * curr[0] + prev[3] * curr[1];
            rslt[2] = prev[0] * curr[2] + prev[2] * curr[3];
            rslt[3] = prev[1] * curr[2] + prev[3] * curr[3];
            rslt[4] = prev[0] * curr[4] + prev[2] * curr[5] + prev[4];
            rslt[5] = prev[1] * curr[4] + prev[3] * curr[5] + prev[5];
            prev = [rslt[0], rslt[1], rslt[2], rslt[3], rslt[4], rslt[5]];
        }
        return rslt;
    }

    function unmatrix(matrix) {
        var
            scaleX, scaleY, skew, A = matrix[0],
            B = matrix[1],
            C = matrix[2],
            D = matrix[3];
        if (A * D - B * C) {
            scaleX = Math.sqrt(A * A + B * B);
            A /= scaleX;
            B /= scaleX;
            skew = A * C + B * D;
            C -= A * skew;
            D -= B * skew;
            scaleY = Math.sqrt(C * C + D * D);
            C /= scaleY;
            D /= scaleY;
            skew /= scaleY;
            if (A * D < B * C) {
                A = -A;
                B = -B;
                skew = -skew;
                scaleX = -scaleX;
            }
        } else {
            scaleX = scaleY = skew = 0;
        }
        return [
            [_translate, [+matrix[4], +matrix[5]]],
            [_rotate, Math.atan2(B, A)],
            [_skew + "X", Math.atan(skew)],
            [_scale, [scaleX, scaleY]]
        ];
    }

    function interpolationList(start, end) {
        var list = {
                start: [],
                end: []
            },
            i = -1,
            l, currStart, currEnd, currType;
        (start == "none" || isAffine(start)) && (start = "");
        (end == "none" || isAffine(end)) && (end = "");
        if (start && end && !end.indexOf("matrix") && toArray(start).join() == toArray(end.split(")")[0]).join()) {
            list.origin = start;
            start = "";
            end = end.slice(end.indexOf(")") + 1);
        }
        if (!start && !end) {
            return;
        }
        if (!start || !end || functionList(start) == functionList(end)) {
            start && (start = start.split(")")) && (l = start.length);
            end && (end = end.split(")")) && (l = end.length);
            while (++i < l - 1) {
                start[i] && (currStart = start[i].split("("));
                end[i] && (currEnd = end[i].split("("));
                currType = $.trim((currStart || currEnd)[0]);
                append(list.start, parseFunction(currType, currStart ? currStart[1] : 0));
                append(list.end, parseFunction(currType, currEnd ? currEnd[1] : 0));
            }
        } else {
            list.start = unmatrix(matrix(start));
            list.end = unmatrix(matrix(end))
        }
        return list;
    }

    function parseFunction(type, value) {
        var
            defaultValue = +(!type.indexOf(_scale)),
            scaleX, cat = type.replace(/e[XY]/, "e");
        switch (type) {
            case _translate + "Y":
            case _scale + "Y":
                value = [defaultValue, value ? parseFloat(value) : defaultValue];
                break;
            case _translate + "X":
            case _translate:
            case _scale + "X":
                scaleX = 1;
            case _scale:
                value = value ? (value = value.split(",")) && [parseFloat(value[0]), parseFloat(value.length > 1 ? value[1] : type == _scale ? scaleX || value[0] : defaultValue + "")] : [defaultValue, defaultValue];
                break;
            case _skew + "X":
            case _skew + "Y":
            case _rotate:
                value = value ? toRadian(value) : 0;
                break;
            case _matrix:
                return unmatrix(value ? toArray(value) : [1, 0, 0, 1, 0, 0]);
                break;
        }
        return [
            [cat, value]
        ];
    }

    function isAffine(matrix) {
        return rAffine.test(matrix);
    }

    function functionList(transform) {
        return transform.replace(/(?:\([^)]*\))|\s/g, "");
    }

    function append(arr1, arr2, value) {
        while (value = arr2.shift()) {
            arr1.push(value);
        }
    }

    function toRadian(value) {
        return ~value.indexOf("deg") ? parseInt(value, 10) * (Math.PI * 2 / 360) : ~value.indexOf("grad") ? parseInt(value, 10) * (Math.PI / 200) : parseFloat(value);
    }

    function toArray(matrix) {
        matrix = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);
        return [matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6]];
    }
    $.transform = {
        centerOrigin: "margin"
    };
})(jQuery, window, document, Math);;
/*!
 * jQuery UI Effects 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/effects-core/
 */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function(a) {
    var b = "ui-effects-",
        c = a;
    /*!
     * jQuery Color Animations v2.1.2
     * https://github.com/jquery/jquery-color
     *
     * Copyright 2014 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * Date: Wed Jan 16 08:47:09 2013 -0600
     */
    return a.effects = {
            effect: {}
        },
        function(a, b) {
            function c(a, b, c) {
                var d = l[b.type] || {};
                return null == a ? c || !b.def ? null : b.def : (a = d.floor ? ~~a : parseFloat(a), isNaN(a) ? b.def : d.mod ? (a + d.mod) % d.mod : 0 > a ? 0 : d.max < a ? d.max : a)
            }

            function d(b) {
                var c = j(),
                    d = c._rgba = [];
                return b = b.toLowerCase(), o(i, function(a, e) {
                    var f, g = e.re.exec(b),
                        h = g && e.parse(g),
                        i = e.space || "rgba";
                    if (h) return f = c[i](h), c[k[i].cache] = f[k[i].cache], d = c._rgba = f._rgba, !1
                }), d.length ? ("0,0,0,0" === d.join() && a.extend(d, f.transparent), c) : f[b]
            }

            function e(a, b, c) {
                return c = (c + 1) % 1, 6 * c < 1 ? a + (b - a) * c * 6 : 2 * c < 1 ? b : 3 * c < 2 ? a + (b - a) * (2 / 3 - c) * 6 : a
            }
            var f, g = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
                h = /^([\-+])=\s*(\d+\.?\d*)/,
                i = [{
                    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function(a) {
                        return [a[1], a[2], a[3], a[4]]
                    }
                }, {
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function(a) {
                        return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
                    }
                }, {
                    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                    parse: function(a) {
                        return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]
                    }
                }, {
                    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                    parse: function(a) {
                        return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]
                    }
                }, {
                    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    space: "hsla",
                    parse: function(a) {
                        return [a[1], a[2] / 100, a[3] / 100, a[4]]
                    }
                }],
                j = a.Color = function(b, c, d, e) {
                    return new a.Color.fn.parse(b, c, d, e)
                },
                k = {
                    rgba: {
                        props: {
                            red: {
                                idx: 0,
                                type: "byte"
                            },
                            green: {
                                idx: 1,
                                type: "byte"
                            },
                            blue: {
                                idx: 2,
                                type: "byte"
                            }
                        }
                    },
                    hsla: {
                        props: {
                            hue: {
                                idx: 0,
                                type: "degrees"
                            },
                            saturation: {
                                idx: 1,
                                type: "percent"
                            },
                            lightness: {
                                idx: 2,
                                type: "percent"
                            }
                        }
                    }
                },
                l = {
                    "byte": {
                        floor: !0,
                        max: 255
                    },
                    percent: {
                        max: 1
                    },
                    degrees: {
                        mod: 360,
                        floor: !0
                    }
                },
                m = j.support = {},
                n = a("<p>")[0],
                o = a.each;
            n.style.cssText = "background-color:rgba(1,1,1,.5)", m.rgba = n.style.backgroundColor.indexOf("rgba") > -1, o(k, function(a, b) {
                b.cache = "_" + a, b.props.alpha = {
                    idx: 3,
                    type: "percent",
                    def: 1
                }
            }), j.fn = a.extend(j.prototype, {
                parse: function(e, g, h, i) {
                    if (e === b) return this._rgba = [null, null, null, null], this;
                    (e.jquery || e.nodeType) && (e = a(e).css(g), g = b);
                    var l = this,
                        m = a.type(e),
                        n = this._rgba = [];
                    return g !== b && (e = [e, g, h, i], m = "array"), "string" === m ? this.parse(d(e) || f._default) : "array" === m ? (o(k.rgba.props, function(a, b) {
                        n[b.idx] = c(e[b.idx], b)
                    }), this) : "object" === m ? (e instanceof j ? o(k, function(a, b) {
                        e[b.cache] && (l[b.cache] = e[b.cache].slice())
                    }) : o(k, function(b, d) {
                        var f = d.cache;
                        o(d.props, function(a, b) {
                            if (!l[f] && d.to) {
                                if ("alpha" === a || null == e[a]) return;
                                l[f] = d.to(l._rgba)
                            }
                            l[f][b.idx] = c(e[a], b, !0)
                        }), l[f] && a.inArray(null, l[f].slice(0, 3)) < 0 && (l[f][3] = 1, d.from && (l._rgba = d.from(l[f])))
                    }), this) : void 0
                },
                is: function(a) {
                    var b = j(a),
                        c = !0,
                        d = this;
                    return o(k, function(a, e) {
                        var f, g = b[e.cache];
                        return g && (f = d[e.cache] || e.to && e.to(d._rgba) || [], o(e.props, function(a, b) {
                            if (null != g[b.idx]) return c = g[b.idx] === f[b.idx]
                        })), c
                    }), c
                },
                _space: function() {
                    var a = [],
                        b = this;
                    return o(k, function(c, d) {
                        b[d.cache] && a.push(c)
                    }), a.pop()
                },
                transition: function(a, b) {
                    var d = j(a),
                        e = d._space(),
                        f = k[e],
                        g = 0 === this.alpha() ? j("transparent") : this,
                        h = g[f.cache] || f.to(g._rgba),
                        i = h.slice();
                    return d = d[f.cache], o(f.props, function(a, e) {
                        var f = e.idx,
                            g = h[f],
                            j = d[f],
                            k = l[e.type] || {};
                        null !== j && (null === g ? i[f] = j : (k.mod && (j - g > k.mod / 2 ? g += k.mod : g - j > k.mod / 2 && (g -= k.mod)), i[f] = c((j - g) * b + g, e)))
                    }), this[e](i)
                },
                blend: function(b) {
                    if (1 === this._rgba[3]) return this;
                    var c = this._rgba.slice(),
                        d = c.pop(),
                        e = j(b)._rgba;
                    return j(a.map(c, function(a, b) {
                        return (1 - d) * e[b] + d * a
                    }))
                },
                toRgbaString: function() {
                    var b = "rgba(",
                        c = a.map(this._rgba, function(a, b) {
                            return null == a ? b > 2 ? 1 : 0 : a
                        });
                    return 1 === c[3] && (c.pop(), b = "rgb("), b + c.join() + ")"
                },
                toHslaString: function() {
                    var b = "hsla(",
                        c = a.map(this.hsla(), function(a, b) {
                            return null == a && (a = b > 2 ? 1 : 0), b && b < 3 && (a = Math.round(100 * a) + "%"), a
                        });
                    return 1 === c[3] && (c.pop(), b = "hsl("), b + c.join() + ")"
                },
                toHexString: function(b) {
                    var c = this._rgba.slice(),
                        d = c.pop();
                    return b && c.push(~~(255 * d)), "#" + a.map(c, function(a) {
                        return a = (a || 0).toString(16), 1 === a.length ? "0" + a : a
                    }).join("")
                },
                toString: function() {
                    return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
                }
            }), j.fn.parse.prototype = j.fn, k.hsla.to = function(a) {
                if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
                var b, c, d = a[0] / 255,
                    e = a[1] / 255,
                    f = a[2] / 255,
                    g = a[3],
                    h = Math.max(d, e, f),
                    i = Math.min(d, e, f),
                    j = h - i,
                    k = h + i,
                    l = .5 * k;
                return b = i === h ? 0 : d === h ? 60 * (e - f) / j + 360 : e === h ? 60 * (f - d) / j + 120 : 60 * (d - e) / j + 240, c = 0 === j ? 0 : l <= .5 ? j / k : j / (2 - k), [Math.round(b) % 360, c, l, null == g ? 1 : g]
            }, k.hsla.from = function(a) {
                if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
                var b = a[0] / 360,
                    c = a[1],
                    d = a[2],
                    f = a[3],
                    g = d <= .5 ? d * (1 + c) : d + c - d * c,
                    h = 2 * d - g;
                return [Math.round(255 * e(h, g, b + 1 / 3)), Math.round(255 * e(h, g, b)), Math.round(255 * e(h, g, b - 1 / 3)), f]
            }, o(k, function(d, e) {
                var f = e.props,
                    g = e.cache,
                    i = e.to,
                    k = e.from;
                j.fn[d] = function(d) {
                    if (i && !this[g] && (this[g] = i(this._rgba)), d === b) return this[g].slice();
                    var e, h = a.type(d),
                        l = "array" === h || "object" === h ? d : arguments,
                        m = this[g].slice();
                    return o(f, function(a, b) {
                        var d = l["object" === h ? a : b.idx];
                        null == d && (d = m[b.idx]), m[b.idx] = c(d, b)
                    }), k ? (e = j(k(m)), e[g] = m, e) : j(m)
                }, o(f, function(b, c) {
                    j.fn[b] || (j.fn[b] = function(e) {
                        var f, g = a.type(e),
                            i = "alpha" === b ? this._hsla ? "hsla" : "rgba" : d,
                            j = this[i](),
                            k = j[c.idx];
                        return "undefined" === g ? k : ("function" === g && (e = e.call(this, k), g = a.type(e)), null == e && c.empty ? this : ("string" === g && (f = h.exec(e), f && (e = k + parseFloat(f[2]) * ("+" === f[1] ? 1 : -1))), j[c.idx] = e, this[i](j)))
                    })
                })
            }), j.hook = function(b) {
                var c = b.split(" ");
                o(c, function(b, c) {
                    a.cssHooks[c] = {
                        set: function(b, e) {
                            var f, g, h = "";
                            if ("transparent" !== e && ("string" !== a.type(e) || (f = d(e)))) {
                                if (e = j(f || e), !m.rgba && 1 !== e._rgba[3]) {
                                    for (g = "backgroundColor" === c ? b.parentNode : b;
                                        ("" === h || "transparent" === h) && g && g.style;) try {
                                        h = a.css(g, "backgroundColor"), g = g.parentNode
                                    } catch (i) {}
                                    e = e.blend(h && "transparent" !== h ? h : "_default")
                                }
                                e = e.toRgbaString()
                            }
                            try {
                                b.style[c] = e
                            } catch (i) {}
                        }
                    }, a.fx.step[c] = function(b) {
                        b.colorInit || (b.start = j(b.elem, c), b.end = j(b.end), b.colorInit = !0), a.cssHooks[c].set(b.elem, b.start.transition(b.end, b.pos))
                    }
                })
            }, j.hook(g), a.cssHooks.borderColor = {
                expand: function(a) {
                    var b = {};
                    return o(["Top", "Right", "Bottom", "Left"], function(c, d) {
                        b["border" + d + "Color"] = a
                    }), b
                }
            }, f = a.Color.names = {
                aqua: "#00ffff",
                black: "#000000",
                blue: "#0000ff",
                fuchsia: "#ff00ff",
                gray: "#808080",
                green: "#008000",
                lime: "#00ff00",
                maroon: "#800000",
                navy: "#000080",
                olive: "#808000",
                purple: "#800080",
                red: "#ff0000",
                silver: "#c0c0c0",
                teal: "#008080",
                white: "#ffffff",
                yellow: "#ffff00",
                transparent: [null, null, null, 0],
                _default: "#ffffff"
            }
        }(c),
        function() {
            function b(b) {
                var c, d, e = b.ownerDocument.defaultView ? b.ownerDocument.defaultView.getComputedStyle(b, null) : b.currentStyle,
                    f = {};
                if (e && e.length && e[0] && e[e[0]])
                    for (d = e.length; d--;) c = e[d], "string" == typeof e[c] && (f[a.camelCase(c)] = e[c]);
                else
                    for (c in e) "string" == typeof e[c] && (f[c] = e[c]);
                return f
            }

            function d(b, c) {
                var d, e, g = {};
                for (d in c) e = c[d], b[d] !== e && (f[d] || !a.fx.step[d] && isNaN(parseFloat(e)) || (g[d] = e));
                return g
            }
            var e = ["add", "remove", "toggle"],
                f = {
                    border: 1,
                    borderBottom: 1,
                    borderColor: 1,
                    borderLeft: 1,
                    borderRight: 1,
                    borderTop: 1,
                    borderWidth: 1,
                    margin: 1,
                    padding: 1
                };
            a.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(b, d) {
                a.fx.step[d] = function(a) {
                    ("none" !== a.end && !a.setAttr || 1 === a.pos && !a.setAttr) && (c.style(a.elem, d, a.end), a.setAttr = !0)
                }
            }), a.fn.addBack || (a.fn.addBack = function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }), a.effects.animateClass = function(c, f, g, h) {
                var i = a.speed(f, g, h);
                return this.queue(function() {
                    var f, g = a(this),
                        h = g.attr("class") || "",
                        j = i.children ? g.find("*").addBack() : g;
                    j = j.map(function() {
                        var c = a(this);
                        return {
                            el: c,
                            start: b(this)
                        }
                    }), f = function() {
                        a.each(e, function(a, b) {
                            c[b] && g[b + "Class"](c[b])
                        })
                    }, f(), j = j.map(function() {
                        return this.end = b(this.el[0]), this.diff = d(this.start, this.end), this
                    }), g.attr("class", h), j = j.map(function() {
                        var b = this,
                            c = a.Deferred(),
                            d = a.extend({}, i, {
                                queue: !1,
                                complete: function() {
                                    c.resolve(b)
                                }
                            });
                        return this.el.animate(this.diff, d), c.promise()
                    }), a.when.apply(a, j.get()).done(function() {
                        f(), a.each(arguments, function() {
                            var b = this.el;
                            a.each(this.diff, function(a) {
                                b.css(a, "")
                            })
                        }), i.complete.call(g[0])
                    })
                })
            }, a.fn.extend({
                addClass: function(b) {
                    return function(c, d, e, f) {
                        return d ? a.effects.animateClass.call(this, {
                            add: c
                        }, d, e, f) : b.apply(this, arguments)
                    }
                }(a.fn.addClass),
                removeClass: function(b) {
                    return function(c, d, e, f) {
                        return arguments.length > 1 ? a.effects.animateClass.call(this, {
                            remove: c
                        }, d, e, f) : b.apply(this, arguments)
                    }
                }(a.fn.removeClass),
                toggleClass: function(b) {
                    return function(c, d, e, f, g) {
                        return "boolean" == typeof d || void 0 === d ? e ? a.effects.animateClass.call(this, d ? {
                            add: c
                        } : {
                            remove: c
                        }, e, f, g) : b.apply(this, arguments) : a.effects.animateClass.call(this, {
                            toggle: c
                        }, d, e, f)
                    }
                }(a.fn.toggleClass),
                switchClass: function(b, c, d, e, f) {
                    return a.effects.animateClass.call(this, {
                        add: c,
                        remove: b
                    }, d, e, f)
                }
            })
        }(),
        function() {
            function c(b, c, d, e) {
                return a.isPlainObject(b) && (c = b, b = b.effect), b = {
                    effect: b
                }, null == c && (c = {}), a.isFunction(c) && (e = c, d = null, c = {}), ("number" == typeof c || a.fx.speeds[c]) && (e = d, d = c, c = {}), a.isFunction(d) && (e = d, d = null), c && a.extend(b, c), d = d || c.duration, b.duration = a.fx.off ? 0 : "number" == typeof d ? d : d in a.fx.speeds ? a.fx.speeds[d] : a.fx.speeds._default, b.complete = e || c.complete, b
            }

            function d(b) {
                return !(b && "number" != typeof b && !a.fx.speeds[b]) || ("string" == typeof b && !a.effects.effect[b] || (!!a.isFunction(b) || "object" == typeof b && !b.effect))
            }
            a.extend(a.effects, {
                version: "1.11.4",
                save: function(a, c) {
                    for (var d = 0; d < c.length; d++) null !== c[d] && a.data(b + c[d], a[0].style[c[d]])
                },
                restore: function(a, c) {
                    var d, e;
                    for (e = 0; e < c.length; e++) null !== c[e] && (d = a.data(b + c[e]), void 0 === d && (d = ""), a.css(c[e], d))
                },
                setMode: function(a, b) {
                    return "toggle" === b && (b = a.is(":hidden") ? "show" : "hide"), b
                },
                getBaseline: function(a, b) {
                    var c, d;
                    switch (a[0]) {
                        case "top":
                            c = 0;
                            break;
                        case "middle":
                            c = .5;
                            break;
                        case "bottom":
                            c = 1;
                            break;
                        default:
                            c = a[0] / b.height
                    }
                    switch (a[1]) {
                        case "left":
                            d = 0;
                            break;
                        case "center":
                            d = .5;
                            break;
                        case "right":
                            d = 1;
                            break;
                        default:
                            d = a[1] / b.width
                    }
                    return {
                        x: d,
                        y: c
                    }
                },
                createWrapper: function(b) {
                    if (b.parent().is(".ui-effects-wrapper")) return b.parent();
                    var c = {
                            width: b.outerWidth(!0),
                            height: b.outerHeight(!0),
                            "float": b.css("float")
                        },
                        d = a("<div></div>").addClass("ui-effects-wrapper").css({
                            fontSize: "100%",
                            background: "transparent",
                            border: "none",
                            margin: 0,
                            padding: 0
                        }),
                        e = {
                            width: b.width(),
                            height: b.height()
                        },
                        f = document.activeElement;
                    try {
                        f.id
                    } catch (g) {
                        f = document.body
                    }
                    return b.wrap(d), (b[0] === f || a.contains(b[0], f)) && a(f).focus(), d = b.parent(), "static" === b.css("position") ? (d.css({
                        position: "relative"
                    }), b.css({
                        position: "relative"
                    })) : (a.extend(c, {
                        position: b.css("position"),
                        zIndex: b.css("z-index")
                    }), a.each(["top", "left", "bottom", "right"], function(a, d) {
                        c[d] = b.css(d), isNaN(parseInt(c[d], 10)) && (c[d] = "auto")
                    }), b.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    })), b.css(e), d.css(c).show()
                },
                removeWrapper: function(b) {
                    var c = document.activeElement;
                    return b.parent().is(".ui-effects-wrapper") && (b.parent().replaceWith(b), (b[0] === c || a.contains(b[0], c)) && a(c).focus()), b
                },
                setTransition: function(b, c, d, e) {
                    return e = e || {}, a.each(c, function(a, c) {
                        var f = b.cssUnit(c);
                        f[0] > 0 && (e[c] = f[0] * d + f[1])
                    }), e
                }
            }), a.fn.extend({
                effect: function() {
                    function b(b) {
                        function c() {
                            a.isFunction(f) && f.call(e[0]), a.isFunction(b) && b()
                        }
                        var e = a(this),
                            f = d.complete,
                            h = d.mode;
                        (e.is(":hidden") ? "hide" === h : "show" === h) ? (e[h](), c()) : g.call(e[0], d, c)
                    }
                    var d = c.apply(this, arguments),
                        e = d.mode,
                        f = d.queue,
                        g = a.effects.effect[d.effect];
                    return a.fx.off || !g ? e ? this[e](d.duration, d.complete) : this.each(function() {
                        d.complete && d.complete.call(this)
                    }) : f === !1 ? this.each(b) : this.queue(f || "fx", b)
                },
                show: function(a) {
                    return function(b) {
                        if (d(b)) return a.apply(this, arguments);
                        var e = c.apply(this, arguments);
                        return e.mode = "show", this.effect.call(this, e)
                    }
                }(a.fn.show),
                hide: function(a) {
                    return function(b) {
                        if (d(b)) return a.apply(this, arguments);
                        var e = c.apply(this, arguments);
                        return e.mode = "hide", this.effect.call(this, e)
                    }
                }(a.fn.hide),
                toggle: function(a) {
                    return function(b) {
                        if (d(b) || "boolean" == typeof b) return a.apply(this, arguments);
                        var e = c.apply(this, arguments);
                        return e.mode = "toggle", this.effect.call(this, e)
                    }
                }(a.fn.toggle),
                cssUnit: function(b) {
                    var c = this.css(b),
                        d = [];
                    return a.each(["em", "px", "%", "pt"], function(a, b) {
                        c.indexOf(b) > 0 && (d = [parseFloat(c), b])
                    }), d
                }
            })
        }(),
        function() {
            var b = {};
            a.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(a, c) {
                b[c] = function(b) {
                    return Math.pow(b, a + 2)
                }
            }), a.extend(b, {
                Sine: function(a) {
                    return 1 - Math.cos(a * Math.PI / 2)
                },
                Circ: function(a) {
                    return 1 - Math.sqrt(1 - a * a)
                },
                Elastic: function(a) {
                    return 0 === a || 1 === a ? a : -Math.pow(2, 8 * (a - 1)) * Math.sin((80 * (a - 1) - 7.5) * Math.PI / 15)
                },
                Back: function(a) {
                    return a * a * (3 * a - 2)
                },
                Bounce: function(a) {
                    for (var b, c = 4; a < ((b = Math.pow(2, --c)) - 1) / 11;);
                    return 1 / Math.pow(4, 3 - c) - 7.5625 * Math.pow((3 * b - 2) / 22 - a, 2)
                }
            }), a.each(b, function(b, c) {
                a.easing["easeIn" + b] = c, a.easing["easeOut" + b] = function(a) {
                    return 1 - c(1 - a)
                }, a.easing["easeInOut" + b] = function(a) {
                    return a < .5 ? c(2 * a) / 2 : 1 - c(a * -2 + 2) / 2
                }
            })
        }(), a.effects
});;
/*!
 * jQuery UI Effects Drop 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/drop-effect/
 */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./effect"], a) : a(jQuery)
}(function(a) {
    return a.effects.effect.drop = function(b, c) {
        var d, e = a(this),
            f = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
            g = a.effects.setMode(e, b.mode || "hide"),
            h = "show" === g,
            i = b.direction || "left",
            j = "up" === i || "down" === i ? "top" : "left",
            k = "up" === i || "left" === i ? "pos" : "neg",
            l = {
                opacity: h ? 1 : 0
            };
        a.effects.save(e, f), e.show(), a.effects.createWrapper(e), d = b.distance || e["top" === j ? "outerHeight" : "outerWidth"](!0) / 2, h && e.css("opacity", 0).css(j, "pos" === k ? -d : d), l[j] = (h ? "pos" === k ? "+=" : "-=" : "pos" === k ? "-=" : "+=") + d, e.animate(l, {
            queue: !1,
            duration: b.duration,
            easing: b.easing,
            complete: function() {
                "hide" === g && e.hide(), a.effects.restore(e, f), a.effects.removeWrapper(e), c()
            }
        })
    }
});;
(function() {
    var COUNT_FRAMERATE, COUNT_MS_PER_FRAME, DIGIT_FORMAT, DIGIT_HTML, DIGIT_SPEEDBOOST, DURATION, FORMAT_MARK_HTML, FORMAT_PARSER, FRAMERATE, FRAMES_PER_VALUE, MS_PER_FRAME, MutationObserver, Odometer, RIBBON_HTML, TRANSITION_END_EVENTS, TRANSITION_SUPPORT, VALUE_HTML, addClass, createFromHTML, fractionalPart, now, removeClass, requestAnimationFrame, round, transitionCheckStyles, trigger, truncate, wrapJQuery, _jQueryWrapped, _old, _ref, _ref1, __slice = [].slice;
    VALUE_HTML = '<span class="odometer-value"></span>';
    RIBBON_HTML = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + VALUE_HTML + '</span></span>';
    DIGIT_HTML = '<span class="odometer-digit"><span class="odometer-digit-spacer">0</span><span class="odometer-digit-inner">' + RIBBON_HTML + '</span></span>';
    FORMAT_MARK_HTML = '<span class="odometer-formatting-mark"></span>';
    DIGIT_FORMAT = '(,ddd).dd';
    FORMAT_PARSER = /^\(?([^)]*)\)?(?:(.)(d+))?$/;
    FRAMERATE = 30;
    DURATION = 2000;
    COUNT_FRAMERATE = 20;
    FRAMES_PER_VALUE = 2;
    DIGIT_SPEEDBOOST = .5;
    MS_PER_FRAME = 1000 / FRAMERATE;
    COUNT_MS_PER_FRAME = 1000 / COUNT_FRAMERATE;
    TRANSITION_END_EVENTS = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
    transitionCheckStyles = document.createElement('div').style;
    TRANSITION_SUPPORT = (transitionCheckStyles.transition != null) || (transitionCheckStyles.webkitTransition != null) || (transitionCheckStyles.mozTransition != null) || (transitionCheckStyles.oTransition != null);
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    createFromHTML = function(html) {
        var el;
        el = document.createElement('div');
        el.innerHTML = html;
        return el.children[0];
    };
    removeClass = function(el, name) {
        return el.className = el.className.replace(new RegExp("(^| )" + (name.split(' ').join('|')) + "( |$)", 'gi'), ' ');
    };
    addClass = function(el, name) {
        removeClass(el, name);
        return el.className += " " + name;
    };
    trigger = function(el, name) {
        var evt;
        if (document.createEvent != null) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(name, true, true);
            return el.dispatchEvent(evt);
        }
    };
    now = function() {
        var _ref, _ref1;
        return (_ref = (_ref1 = window.performance) != null ? typeof _ref1.now === "function" ? _ref1.now() : void 0 : void 0) != null ? _ref : +(new Date);
    };
    round = function(val, precision) {
        if (precision == null) {
            precision = 0;
        }
        if (!precision) {
            return Math.round(val);
        }
        val *= Math.pow(10, precision);
        val += 0.5;
        val = Math.floor(val);
        return val /= Math.pow(10, precision);
    };
    truncate = function(val) {
        if (val < 0) {
            return Math.ceil(val);
        } else {
            return Math.floor(val);
        }
    };
    fractionalPart = function(val) {
        return val - round(val);
    };
    _jQueryWrapped = false;
    (wrapJQuery = function() {
        var property, _i, _len, _ref, _results;
        if (_jQueryWrapped) {
            return;
        }
        if (window.jQuery != null) {
            _jQueryWrapped = true;
            _ref = ['html', 'text'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                property = _ref[_i];
                _results.push((function(property) {
                    var old;
                    old = window.jQuery.fn[property];
                    return window.jQuery.fn[property] = function(val) {
                        var _ref1;
                        if ((val == null) || (((_ref1 = this[0]) != null ? _ref1.odometer : void 0) == null)) {
                            return old.apply(this, arguments);
                        }
                        return this[0].odometer.update(val);
                    };
                })(property));
            }
            return _results;
        }
    })();
    setTimeout(wrapJQuery, 0);
    Odometer = (function() {
        function Odometer(options) {
            var e, k, property, v, _base, _i, _len, _ref, _ref1, _ref2, _this = this;
            this.options = options;
            this.el = this.options.el;
            if (this.el.odometer != null) {
                return this.el.odometer;
            }
            this.el.odometer = this;
            _ref = Odometer.options;
            for (k in _ref) {
                v = _ref[k];
                if (this.options[k] == null) {
                    this.options[k] = v;
                }
            }
            if ((_base = this.options).duration == null) {
                _base.duration = DURATION;
            }
            this.MAX_VALUES = ((this.options.duration / MS_PER_FRAME) / FRAMES_PER_VALUE) | 0;
            this.resetFormat();
            this.value = this.cleanValue((_ref1 = this.options.value) != null ? _ref1 : '');
            this.renderInside();
            this.render();
            try {
                _ref2 = ['innerHTML', 'innerText', 'textContent'];
                for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                    property = _ref2[_i];
                    if (this.el[property] != null) {
                        (function(property) {
                            return Object.defineProperty(_this.el, property, {
                                get: function() {
                                    var _ref3;
                                    if (property === 'innerHTML') {
                                        return _this.inside.outerHTML;
                                    } else {
                                        return (_ref3 = _this.inside.innerText) != null ? _ref3 : _this.inside.textContent;
                                    }
                                },
                                set: function(val) {
                                    return _this.update(val);
                                }
                            });
                        })(property);
                    }
                }
            } catch (_error) {
                e = _error;
                this.watchForMutations();
            }
            this;
        }
        Odometer.prototype.renderInside = function() {
            this.inside = document.createElement('div');
            this.inside.className = 'odometer-inside';
            this.el.innerHTML = '';
            return this.el.appendChild(this.inside);
        };
        Odometer.prototype.watchForMutations = function() {
            var e, _this = this;
            if (MutationObserver == null) {
                return;
            }
            try {
                if (this.observer == null) {
                    this.observer = new MutationObserver(function(mutations) {
                        var newVal;
                        newVal = _this.el.innerText;
                        _this.renderInside();
                        _this.render(_this.value);
                        return _this.update(newVal);
                    });
                }
                this.watchMutations = true;
                return this.startWatchingMutations();
            } catch (_error) {
                e = _error;
            }
        };
        Odometer.prototype.startWatchingMutations = function() {
            if (this.watchMutations) {
                return this.observer.observe(this.el, {
                    childList: true
                });
            }
        };
        Odometer.prototype.stopWatchingMutations = function() {
            var _ref;
            return (_ref = this.observer) != null ? _ref.disconnect() : void 0;
        };
        Odometer.prototype.cleanValue = function(val) {
            var _ref;
            if (typeof val === 'string') {
                val = val.replace((_ref = this.format.radix) != null ? _ref : '.', '<radix>');
                val = val.replace(/[.,]/g, '');
                val = val.replace('<radix>', '.');
                val = parseFloat(val, 10) || 0;
            }
            return round(val, this.format.precision);
        };
        Odometer.prototype.bindTransitionEnd = function() {
            var event, renderEnqueued, _i, _len, _ref, _results, _this = this;
            if (this.transitionEndBound) {
                return;
            }
            this.transitionEndBound = true;
            renderEnqueued = false;
            _ref = TRANSITION_END_EVENTS.split(' ');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                event = _ref[_i];
                _results.push(this.el.addEventListener(event, function() {
                    if (renderEnqueued) {
                        return true;
                    }
                    renderEnqueued = true;
                    setTimeout(function() {
                        _this.render();
                        renderEnqueued = false;
                        return trigger(_this.el, 'odometerdone');
                    }, 0);
                    return true;
                }, false));
            }
            return _results;
        };
        Odometer.prototype.resetFormat = function() {
            var format, fractional, parsed, precision, radix, repeating, _ref, _ref1;
            format = (_ref = this.options.format) != null ? _ref : DIGIT_FORMAT;
            format || (format = 'd');
            parsed = FORMAT_PARSER.exec(format);
            if (!parsed) {
                throw new Error("Odometer: Unparsable digit format");
            }
            _ref1 = parsed.slice(1, 4), repeating = _ref1[0], radix = _ref1[1], fractional = _ref1[2];
            precision = (fractional != null ? fractional.length : void 0) || 0;
            return this.format = {
                repeating: repeating,
                radix: radix,
                precision: precision
            };
        };
        Odometer.prototype.render = function(value) {
            var classes, cls, digit, match, newClasses, theme, wholePart, _i, _j, _len, _len1, _ref;
            if (value == null) {
                value = this.value;
            }
            this.stopWatchingMutations();
            this.resetFormat();
            this.inside.innerHTML = '';
            theme = this.options.theme;
            classes = this.el.className.split(' ');
            newClasses = [];
            for (_i = 0, _len = classes.length; _i < _len; _i++) {
                cls = classes[_i];
                if (!cls.length) {
                    continue;
                }
                if (match = /^odometer-theme-(.+)$/.exec(cls)) {
                    theme = match[1];
                    continue;
                }
                if (/^odometer(-|$)/.test(cls)) {
                    continue;
                }
                newClasses.push(cls);
            }
            newClasses.push('odometer');
            if (!TRANSITION_SUPPORT) {
                newClasses.push('odometer-no-transitions');
            }
            if (theme) {
                newClasses.push("odometer-theme-" + theme);
            } else {
                newClasses.push("odometer-auto-theme");
            }
            this.el.className = newClasses.join(' ');
            this.ribbons = {};
            this.digits = [];
            wholePart = !this.format.precision || !fractionalPart(value) || false;
            _ref = value.toString().split('').reverse();
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                digit = _ref[_j];
                if (digit === '.') {
                    wholePart = true;
                }
                this.addDigit(digit, wholePart);
            }
            return this.startWatchingMutations();
        };
        Odometer.prototype.update = function(newValue) {
            var diff, _this = this;
            newValue = this.cleanValue(newValue);
            if (!(diff = newValue - this.value)) {
                return;
            }
            removeClass(this.el, 'odometer-animating-up odometer-animating-down odometer-animating');
            if (diff > 0) {
                addClass(this.el, 'odometer-animating-up');
            } else {
                addClass(this.el, 'odometer-animating-down');
            }
            this.stopWatchingMutations();
            this.animate(newValue);
            this.startWatchingMutations();
            setTimeout(function() {
                _this.el.offsetHeight;
                return addClass(_this.el, 'odometer-animating');
            }, 0);
            return this.value = newValue;
        };
        Odometer.prototype.renderDigit = function() {
            return createFromHTML(DIGIT_HTML);
        };
        Odometer.prototype.insertDigit = function(digit, before) {
            if (before != null) {
                return this.inside.insertBefore(digit, before);
            } else if (!this.inside.children.length) {
                return this.inside.appendChild(digit);
            } else {
                return this.inside.insertBefore(digit, this.inside.children[0]);
            }
        };
        Odometer.prototype.addSpacer = function(chr, before, extraClasses) {
            var spacer;
            spacer = createFromHTML(FORMAT_MARK_HTML);
            spacer.innerHTML = chr;
            if (extraClasses) {
                addClass(spacer, extraClasses);
            }
            return this.insertDigit(spacer, before);
        };
        Odometer.prototype.addDigit = function(value, repeating) {
            var chr, digit, resetted, _ref;
            if (repeating == null) {
                repeating = true;
            }
            if (value === '-') {
                return this.addSpacer(value, null, 'odometer-negation-mark');
            }
            if (value === '.') {
                return this.addSpacer((_ref = this.format.radix) != null ? _ref : '.', null, 'odometer-radix-mark');
            }
            if (repeating) {
                resetted = false;
                while (true) {
                    if (!this.format.repeating.length) {
                        if (resetted) {
                            throw new Error("Bad odometer format without digits");
                        }
                        this.resetFormat();
                        resetted = true;
                    }
                    chr = this.format.repeating[this.format.repeating.length - 1];
                    this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1);
                    if (chr === 'd') {
                        break;
                    }
                    this.addSpacer(chr);
                }
            }
            digit = this.renderDigit();
            digit.querySelector('.odometer-value').innerHTML = value;
            this.digits.push(digit);
            return this.insertDigit(digit);
        };
        Odometer.prototype.animate = function(newValue) {
            if (!TRANSITION_SUPPORT || this.options.animation === 'count') {
                return this.animateCount(newValue);
            } else {
                return this.animateSlide(newValue);
            }
        };
        Odometer.prototype.animateCount = function(newValue) {
            var cur, diff, last, start, tick, _this = this;
            if (!(diff = +newValue - this.value)) {
                return;
            }
            start = last = now();
            cur = this.value;
            return (tick = function() {
                var delta, dist, fraction;
                if ((now() - start) > _this.options.duration) {
                    _this.value = newValue;
                    _this.render();
                    trigger(_this.el, 'odometerdone');
                    return;
                }
                delta = now() - last;
                if (delta > COUNT_MS_PER_FRAME) {
                    last = now();
                    fraction = delta / _this.options.duration;
                    dist = diff * fraction;
                    cur += dist;
                    _this.render(Math.round(cur));
                }
                if (requestAnimationFrame != null) {
                    return requestAnimationFrame(tick);
                } else {
                    return setTimeout(tick, COUNT_MS_PER_FRAME);
                }
            })();
        };
        Odometer.prototype.getDigitCount = function() {
            var i, max, value, values, _i, _len;
            values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
                value = values[i];
                values[i] = Math.abs(value);
            }
            max = Math.max.apply(Math, values);
            return Math.ceil(Math.log(max + 1) / Math.log(10));
        };
        Odometer.prototype.getFractionalDigitCount = function() {
            var i, parser, parts, value, values, _i, _len;
            values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            parser = /^\-?\d*\.(\d*?)0*$/;
            for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
                value = values[i];
                values[i] = value.toString();
                parts = parser.exec(values[i]);
                if (parts == null) {
                    values[i] = 0;
                } else {
                    values[i] = parts[1].length;
                }
            }
            return Math.max.apply(Math, values);
        };
        Odometer.prototype.resetDigits = function() {
            this.digits = [];
            this.ribbons = [];
            this.inside.innerHTML = '';
            return this.resetFormat();
        };
        Odometer.prototype.animateSlide = function(newValue) {
            var boosted, cur, diff, digitCount, digits, dist, end, fractionalCount, frame, frames, i, incr, j, mark, numEl, oldValue, start, _base, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _results;
            oldValue = this.value;
            fractionalCount = this.getFractionalDigitCount(oldValue, newValue);
            if (fractionalCount) {
                newValue = newValue * Math.pow(10, fractionalCount);
                oldValue = oldValue * Math.pow(10, fractionalCount);
            }
            if (!(diff = newValue - oldValue)) {
                return;
            }
            this.bindTransitionEnd();
            digitCount = this.getDigitCount(oldValue, newValue);
            digits = [];
            boosted = 0;
            for (i = _i = 0; 0 <= digitCount ? _i < digitCount : _i > digitCount; i = 0 <= digitCount ? ++_i : --_i) {
                start = truncate(oldValue / Math.pow(10, digitCount - i - 1));
                end = truncate(newValue / Math.pow(10, digitCount - i - 1));
                dist = end - start;
                if (Math.abs(dist) > this.MAX_VALUES) {
                    frames = [];
                    incr = dist / (this.MAX_VALUES + this.MAX_VALUES * boosted * DIGIT_SPEEDBOOST);
                    cur = start;
                    while ((dist > 0 && cur < end) || (dist < 0 && cur > end)) {
                        frames.push(Math.round(cur));
                        cur += incr;
                    }
                    if (frames[frames.length - 1] !== end) {
                        frames.push(end);
                    }
                    boosted++;
                } else {
                    frames = (function() {
                        _results = [];
                        for (var _j = start; start <= end ? _j <= end : _j >= end; start <= end ? _j++ : _j--) {
                            _results.push(_j);
                        }
                        return _results;
                    }).apply(this);
                }
                for (i = _k = 0, _len = frames.length; _k < _len; i = ++_k) {
                    frame = frames[i];
                    frames[i] = Math.abs(frame % 10);
                }
                digits.push(frames);
            }
            this.resetDigits();
            _ref = digits.reverse();
            for (i = _l = 0, _len1 = _ref.length; _l < _len1; i = ++_l) {
                frames = _ref[i];
                if (!this.digits[i]) {
                    this.addDigit(' ', i >= fractionalCount);
                }
                if ((_base = this.ribbons)[i] == null) {
                    _base[i] = this.digits[i].querySelector('.odometer-ribbon-inner');
                }
                this.ribbons[i].innerHTML = '';
                if (diff < 0) {
                    frames = frames.reverse();
                }
                for (j = _m = 0, _len2 = frames.length; _m < _len2; j = ++_m) {
                    frame = frames[j];
                    numEl = document.createElement('div');
                    numEl.className = 'odometer-value';
                    numEl.innerHTML = frame;
                    this.ribbons[i].appendChild(numEl);
                    if (j === frames.length - 1) {
                        addClass(numEl, 'odometer-last-value');
                    }
                    if (j === 0) {
                        addClass(numEl, 'odometer-first-value');
                    }
                }
            }
            if (start < 0) {
                this.addDigit('-');
            }
            mark = this.inside.querySelector('.odometer-radix-mark');
            if (mark != null) {
                mark.parent.removeChild(mark);
            }
            if (fractionalCount) {
                return this.addSpacer(this.format.radix, this.digits[fractionalCount - 1], 'odometer-radix-mark');
            }
        };
        return Odometer;
    })();
    Odometer.options = (_ref = window.odometerOptions) != null ? _ref : {};
    setTimeout(function() {
        var k, v, _base, _ref1, _results;
        if (window.odometerOptions) {
            _ref1 = window.odometerOptions;
            _results = [];
            for (k in _ref1) {
                v = _ref1[k];
                _results.push((_base = Odometer.options)[k] != null ? (_base = Odometer.options)[k] : _base[k] = v);
            }
            return _results;
        }
    }, 0);
    Odometer.init = function() {
        var el, elements, _i, _len, _ref1, _results;
        if (document.querySelectorAll == null) {
            return;
        }
        elements = document.querySelectorAll(Odometer.options.selector || '.odometer');
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
            el = elements[_i];
            _results.push(el.odometer = new Odometer({
                el: el,
                value: (_ref1 = el.innerText) != null ? _ref1 : el.textContent
            }));
        }
        return _results;
    };
    if ((((_ref1 = document.documentElement) != null ? _ref1.doScroll : void 0) != null) && (document.createEventObject != null)) {
        _old = document.onreadystatechange;
        document.onreadystatechange = function() {
            if (document.readyState === 'complete' && Odometer.options.auto !== false) {
                Odometer.init();
            }
            return _old != null ? _old.apply(this, arguments) : void 0;
        };
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (Odometer.options.auto !== false) {
                return Odometer.init();
            }
        }, false);
    }
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function() {
            return Odometer;
        });
    } else if (typeof exports === !'undefined') {
        module.exports = Odometer;
    } else {
        window.Odometer = Odometer;
    }
}).call(this);;
(function($) {
    function getScrollY(elem) {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    function Sticky(el, options) {
        var self = this;
        this.el = el;
        this.$el = $(el);
        this.options = {};
        $.extend(this.options, options);
        self.init();
    }
    $.fn.scSticky = function(options) {
        $(this).each(function() {
            return new Sticky(this, options);
        });
    }
    Sticky.prototype = {
        init: function() {
            var self = this;
            this.$wrapper = false;
            this.$parent = this.getParent();
            $(window).scroll(function() {
                if (self.useSticky()) {
                    self.wrap();
                    self.scroll();
                } else {
                    self.unwrap();
                }
            });
            $(window).resize(function() {
                if (self.useSticky()) {
                    self.wrap();
                    self.scroll();
                } else {
                    self.unwrap();
                }
            });
        },
        wrap: function() {
            if (!this.$wrapper)
                this.$wrapper = this.$el.wrap('<div />').parent();
            this.$wrapper.attr('class', this.$el.attr('class')).addClass('gem-sticky-block').css({
                padding: 0,
                height: this.$el.outerHeight()
            });
            this.$el.css({
                width: this.$wrapper.outerWidth(),
                margin: 0
            });
        },
        getParent: function() {
            return this.$el.parent();
        },
        useSticky: function() {
            var is_sidebar = true;
            if (this.$el.hasClass('sidebar')) {
                if (this.$wrapper) {
                    if (this.$wrapper.outerHeight() > this.$wrapper.siblings('.panel-center:first').outerHeight())
                        is_sidebar = false;
                } else {
                    if (this.$el.outerHeight() > this.$el.siblings('.panel-center:first').outerHeight())
                        is_sidebar = false;
                }
            }
            return $(window).width() > 1000 && is_sidebar;
        },
        unwrap: function() {
            if (this.$el.parent().is('.gem-sticky-block')) {
                this.$el.unwrap();
                this.$wrapper = false;
            }
            this.$el.css({
                width: "",
                top: "",
                bottom: "",
                margin: ""
            });
        },
        scroll: function() {
            var top_offset = parseInt($('html').css('margin-top'));
            var $header = $('#site-header');
            if ($header.hasClass('fixed')) {
                top_offset += $header.outerHeight();
            }
            var scroll = getScrollY();
            var offset = this.$wrapper.offset();
            var parent_offset = this.$parent.offset();
            var parent_bottom = parent_offset.top + this.$parent.outerHeight() - scroll;
            var bottom = $(window).height() - parent_bottom;
            if ((top_offset + this.$el.outerHeight()) >= parent_bottom) {
                this.$el.addClass('sticky-fixed').css({
                    top: "",
                    bottom: bottom,
                    left: offset.left
                });
                return;
            }
            if ((scroll + top_offset) > offset.top) {
                this.$el.addClass('sticky-fixed').css({
                    top: top_offset,
                    bottom: "",
                    left: offset.left
                });
            } else {
                this.$el.removeClass('sticky-fixed').css({
                    top: "",
                    bottom: "",
                    left: ""
                });
            }
        }
    };
}(jQuery));;
(function($) {
    $.fn.thegemPreloader = function(callback) {
        $(this).each(function() {
            var $el = $(this);
            if (!$el.prev('.preloader').length) {
                $('<div class="preloader">').insertBefore($el);
            }
            $el.data('thegemPreloader', $('img, iframe', $el).add($el.filter('img, iframe')).length);
            if ($el.data('thegemPreloader') == 0) {
                $el.prev('.preloader').remove();
                callback();
                $el.trigger('thegem-preloader-loaded');
                return;
            }
            $('img, iframe', $el).add($el.filter('img, iframe')).each(function() {
                var $obj = $('<img>');
                if ($(this).prop('tagName').toLowerCase() == 'iframe') {
                    $obj = $(this);
                }
                $obj.attr('src', $(this).attr('src'));
                $obj.on('load error', function() {
                    $el.data('thegemPreloader', $el.data('thegemPreloader') - 1);
                    if ($el.data('thegemPreloader') == 0) {
                        $el.prev('.preloader').remove();
                        callback();
                        $el.trigger('thegem-preloader-loaded');
                    }
                });
            });
        });
    }
})(jQuery);
(function($) {
    var oWidth = $.fn.width;
    $.fn.width = function(argument) {
        if (arguments.length == 0 && this.length == 1 && this[0] === window) {
            if (window.gemOptions.innerWidth != -1) {
                return window.gemOptions.innerWidth;
            }
            var width = oWidth.apply(this, arguments);
            window.updateGemInnerSize(width);
            return width;
        }
        return oWidth.apply(this, arguments);
    };
    var $page = $('#page');
    $(window).load(function() {
        var $preloader = $('#page-preloader');
        if ($preloader.length && !$preloader.hasClass('preloader-loaded')) {
            $preloader.addClass('preloader-loaded');
        }
    });
    $('#site-header.animated-header').headerAnimation();
    $.fn.updateTabs = function() {
        jQuery('.gem-tabs', this).each(function(index) {
            var $tabs = $(this);
            $tabs.thegemPreloader(function() {
                $tabs.easyResponsiveTabs({
                    type: 'default',
                    width: 'auto',
                    fit: false,
                    activate: function(currentTab, e) {
                        var $tab = $(currentTab.target);
                        var controls = $tab.attr('aria-controls');
                        $tab.closest('.ui-tabs').find('.gem_tab[aria-labelledby="' + controls + '"]').trigger('tab-update');
                    }
                });
            });
        });
        jQuery('.gem-tour', this).each(function(index) {
            var $tabs = $(this);
            $tabs.thegemPreloader(function() {
                $tabs.easyResponsiveTabs({
                    type: 'vertical',
                    width: 'auto',
                    fit: false,
                    activate: function(currentTab, e) {
                        var $tab = $(currentTab.target);
                        var controls = $tab.attr('aria-controls');
                        $tab.closest('.ui-tabs').find('.gem_tab[aria-labelledby="' + controls + '"]').trigger('tab-update');
                    }
                });
            });
        });
    };

    function fullwidth_block_after_update($item) {
        $item.trigger('updateTestimonialsCarousel');
        $item.trigger('updateClientsCarousel');
        $item.trigger('fullwidthUpdate');
    }

    function fullwidth_block_update($item, pageOffset, pagePaddingLeft, pageWidth, skipTrigger) {
        var $prevElement = $item.prev(),
            extra_padding = 0;
        if ($prevElement.length == 0 || $prevElement.hasClass('fullwidth-block')) {
            $prevElement = $item.parent();
            extra_padding = parseInt($prevElement.css('padding-left'));
        }
        var offsetKey = window.gemSettings.isRTL ? 'right' : 'left';
        var cssData = {
            width: pageWidth
        };
        cssData[offsetKey] = pageOffset.left - ($prevElement.length ? $prevElement.offset().left : 0) + parseInt(pagePaddingLeft) - extra_padding;
        $item.css(cssData);
        if (!skipTrigger) {
            fullwidth_block_after_update($item);
        }
    }
    var inlineFullwidths = [],
        notInlineFullwidths = [];
    $('.fullwidth-block').each(function() {
        var $item = $(this),
            $parents = $item.parents('.vc_row'),
            fullw = {
                isInline: false
            };
        $parents.each(function() {
            if (this.hasAttribute('data-vc-full-width')) {
                fullw.isInline = true;
                return false;
            }
        });
        if (fullw.isInline) {
            inlineFullwidths.push(this);
        } else {
            notInlineFullwidths.push(this);
        }
    });

    function update_fullwidths(inline, init) {
        var $needUpdate = [];
        (inline ? inlineFullwidths : notInlineFullwidths).forEach(function(item) {
            $needUpdate.push(item);
        });
        if ($needUpdate.length > 0) {
            var pageOffset = $page.offset(),
                pagePaddingLeft = $page.css('padding-left'),
                pageWidth = $page.width();
            $needUpdate.forEach(function(item) {
                fullwidth_block_update($(item), pageOffset, pagePaddingLeft, pageWidth);
            });
        }
    }
    if (!window.disableGemSlideshowPreloaderHandle) {
        jQuery('.gem-slideshow').each(function() {
            var $slideshow = $(this);
            $slideshow.thegemPreloader(function() {});
        });
    }
    $(function() {
        $('#gem-icons-loading-hide').remove();
        $('#thegem-preloader-inline-css').remove();
        jQuery('iframe').not('.gem-video-background iframe').each(function() {
            $(this).thegemPreloader(function() {});
        });
        jQuery('.gem-video-background').each(function() {
            var $videoBG = $(this);
            var $videoContainer = $('.gem-video-background-inner', this);
            var ratio = $videoBG.data('aspect-ratio') ? $videoBG.data('aspect-ratio') : '16:9';
            var regexp = /(\d+):(\d+)/;
            var $fullwidth = $videoBG.closest('.fullwidth-block');
            ratio = regexp.exec(ratio);
            if (!ratio || parseInt(ratio[1]) == 0 || parseInt(ratio[2]) == 0) {
                ratio = 16 / 9;
            } else {
                ratio = parseInt(ratio[1]) / parseInt(ratio[2]);
            }

            function gemVideoUpdate() {
                $videoContainer.removeAttr('style');
                if ($videoContainer.width() / $videoContainer.height() > ratio) {
                    $videoContainer.css({
                        height: ($videoContainer.width() / ratio) + 'px',
                        marginTop: -($videoContainer.width() / ratio - $videoBG.height()) / 2 + 'px'
                    });
                } else {
                    $videoContainer.css({
                        width: ($videoContainer.height() * ratio) + 'px',
                        marginLeft: -($videoContainer.height() * ratio - $videoBG.width()) / 2 + 'px'
                    });
                }
            }
            if ($videoBG.closest('.page-title-block').length > 0) {
                gemVideoUpdate();
            }
            if ($fullwidth.length) {
                $fullwidth.on('fullwidthUpdate', gemVideoUpdate);
            } else {
                $(window).resize(gemVideoUpdate);
            }
        });
        update_fullwidths(false, true);
        if (!window.gemSettings.parallaxDisabled) {
            $('.fullwidth-block').each(function() {
                var $item = $(this),
                    mobile_enabled = $item.data('mobile-parallax-enable') || '0';
                if (!window.gemSettings.isTouch || mobile_enabled == '1') {
                    if ($item.hasClass('fullwidth-block-parallax-vertical')) {
                        $('.fullwidth-block-background', $item).parallaxVertical('50%');
                    } else if ($item.hasClass('fullwidth-block-parallax-horizontal')) {
                        $('.fullwidth-block-background', $item).parallaxHorizontal();
                    }
                } else {
                    $('.fullwidth-block-background', $item).css({
                        backgroundAttachment: 'scroll'
                    });
                }
            });
        }
        $(window).resize(function() {
            update_fullwidths(false, false);
        });
        jQuery('select.gem-combobox, .gem-combobox select, .widget_archive select, .widget_product_categories select, .widget_layered_nav select, .widget_categories select').each(function(index) {
            $(this).combobox();
        });
        jQuery('input.gem-checkbox, .gem-checkbox input').checkbox();
        if (typeof($.fn.ReStable) == "function") {
            jQuery('.gem-table-responsive').each(function(index) {
                $('> table', this).ReStable({
                    maxWidth: 768,
                    rowHeaders: $(this).hasClass('row-headers')
                });
            });
        }
        jQuery('.fancybox').each(function() {
            $(this).fancybox();
        });

        function init_odometer(el) {
            if (jQuery('.gem-counter-odometer', el).size() == 0)
                return;
            var odometer = jQuery('.gem-counter-odometer', el).get(0);
            var format = jQuery(el).closest('.gem-counter-box').data('number-format');
            format = format ? format : '(ddd).ddd';
            var od = new Odometer({
                el: odometer,
                value: $(odometer).text(),
                format: format
            });
            od.update($(odometer).data('to'));
        }
        window['thegem_init_odometer'] = init_odometer;
        jQuery('.gem-counter').each(function(index) {
            if (jQuery(this).closest('.gem-counter-box').size() > 0 && jQuery(this).closest('.gem-counter-box').hasClass('lazy-loading') && !window.gemSettings.lasyDisabled) {
                jQuery(this).addClass('lazy-loading-item').data('ll-effect', 'action').data('item-delay', '0').data('ll-action-func', 'thegem_init_odometer');
                jQuery('.gem-icon', this).addClass('lazy-loading-item').data('ll-effect', 'fading').data('item-delay', '0');
                jQuery('.gem-counter-text', this).addClass('lazy-loading-item').data('ll-effect', 'fading').data('item-delay', '0');
                return;
            }
            init_odometer(this);
        });
        jQuery('.panel-sidebar-sticky > .sidebar').scSticky();
        jQuery('iframe + .map-locker').each(function() {
            var $locker = $(this);
            $locker.click(function(e) {
                e.preventDefault();
                if ($locker.hasClass('disabled')) {
                    $locker.prev('iframe').css({
                        'pointer-events': 'none'
                    });
                } else {
                    $locker.prev('iframe').css({
                        'pointer-events': 'auto'
                    });
                }
                $locker.toggleClass('disabled');
            });
        });
        $('.primary-navigation a.mega-no-link').closest('li').removeClass('menu-item-active current-menu-item');
        var $anhorsElements = [];
        $('.primary-navigation a, .gem-button, .footer-navigation a, .scroll-top-button, .scroll-to-anchor, .scroll-to-anchor a, .top-area-menu a').each(function(e) {
            var $anhor = $(this);
            var link = $anhor.attr('href');
            if (!link) return;
            link = link.split('#');
            if ($('#' + link[1]).hasClass('vc_tta-panel')) return;
            if ($('#' + link[1]).length) {
                $anhor.closest('li').removeClass('menu-item-active current-menu-item');
                $anhor.closest('li').parents('li').removeClass('menu-item-current');
                $(window).scroll(function() {
                    if (!$anhor.closest('li.menu-item').length) return;
                    var correction = 0;
                    if (!$('#page').hasClass('vertical-header')) {
                        correction = $('#site-header').outerHeight() + $('#site-header').position().top;
                    }
                    var target_top = $('#' + link[1]).offset().top - correction;
                    if (getScrollY() >= target_top && getScrollY() <= target_top + $('#' + link[1]).outerHeight()) {
                        $anhor.closest('li').addClass('menu-item-active');
                        $anhor.closest('li').parents('li').addClass('menu-item-current');
                    } else {
                        $anhor.closest('li').removeClass('menu-item-active');
                        $anhor.closest('li').parents('li.menu-item-current').each(function() {
                            if (!$('.menu-item-active', this).length) {
                                $(this).removeClass('menu-item-current');
                            }
                        });
                    }
                });
                $(document).on('update-page-scroller', function(e, elem) {
                    var $elem = $(elem);
                    if (!$anhor.closest('li.menu-item').length) return;
                    if ($elem.is($('#' + link[1])) || $elem.find($('#' + link[1])).length) {
                        $anhor.closest('li').addClass('menu-item-active');
                        $anhor.closest('li').parents('li').addClass('menu-item-current');
                    } else {
                        $anhor.closest('li').removeClass('menu-item-active');
                        $anhor.closest('li').parents('li.menu-item-current').each(function() {
                            if (!$('.menu-item-active', this).length) {
                                $(this).removeClass('menu-item-current');
                            }
                        });
                    }
                });
                $anhor.click(function(e) {
                    e.preventDefault();
                    var correction = 0;
                    if ($('#site-header.animated-header').length) {
                        var shrink = $('#site-header').hasClass('shrink');
                        $('#site-header').addClass('scroll-counting');
                        $('#site-header').addClass('fixed shrink');
                        correction = $('#site-header').outerHeight() + $('#site-header').position().top;
                        if (!shrink && $('#top-area').length && !$('#site-header').find('#top-area').length) {
                            correction = correction - $('#top-area').outerHeight();
                        }
                        if (!shrink) {
                            $('#site-header').removeClass('fixed shrink');
                        }
                        setTimeout(function() {
                            $('#site-header').removeClass('scroll-counting');
                        }, 50);
                    }
                    var target_top = $('#' + link[1]).offset().top - correction + 1;
                    if ($('body').hasClass('page-scroller') && $('.page-scroller-nav-pane').is(':visible')) {
                        var $block = $('#' + link[1] + '.scroller-block').add($('#' + link[1]).closest('.scroller-block')).eq(0);
                        if ($block.length) {
                            $('.page-scroller-nav-pane .page-scroller-nav-item').eq($('.scroller-block').index($block)).trigger('click');
                        }
                    } else {
                        $('html, body').stop(true, true).animate({
                            scrollTop: target_top
                        }, 1500, 'easeInOutQuint');
                    }
                });
                $anhorsElements.push($anhor[0]);
            }
        });
        if ($anhorsElements.length) {
            $(window).load(function() {
                for (var i = 0; i < $anhorsElements.length; i++) {
                    var anhor = $anhorsElements[i];
                    if (anhor.href != undefined && anhor.href && window.location.href == anhor.href) {
                        anhor.click();
                        break;
                    }
                }
            });
        }
        $('body').on('click', '.post-footer-sharing .gem-button', function(e) {
            e.preventDefault();
            $(this).closest('.post-footer-sharing').find('.sharing-popup').toggleClass('active');
        });
        var scrollTimer, body = document.body;
        $(window).scroll(function() {
            clearTimeout(scrollTimer);
            if (!body.classList.contains('disable-hover')) {}
            scrollTimer = setTimeout(function() {}, 300);
            if (getScrollY() > 0) {
                $('.scroll-top-button').addClass('visible');
            } else {
                $('.scroll-top-button').removeClass('visible');
            }
        }).scroll();

        function getScrollY(elem) {
            return window.pageYOffset || document.documentElement.scrollTop;
        }
        $('a.hidden-email').each(function() {
            $(this).attr('href', 'mailto:' + $(this).data('name') + '@' + $(this).data('domain'));
        });
        $('#colophon .footer-widget-area').thegemPreloader(function() {
            $('#colophon .footer-widget-area').isotope({
                itemSelector: '.widget',
                layoutMode: 'masonry'
            });
        });
        $('body').updateTabs();
    });
    $(document).on('show.vc.accordion', '[data-vc-accordion]', function() {
        var $target = $(this).data('vc.accordion').getContainer();
        var correction = 0;
        if (!$target.find('.vc_tta-tabs').length || !$(this).is(':visible') || $target.data('vc-tta-autoplay')) return;
        if ($('#site-header.animated-header').length && $('#site-header').hasClass('fixed')) {
            var shrink = $('#site-header').hasClass('shrink');
            $('#site-header').addClass('scroll-counting');
            $('#site-header').addClass('fixed shrink');
            correction = $('#site-header').outerHeight() + $('#site-header').position().top;
            if (!shrink) {
                $('#site-header').removeClass('fixed shrink');
            }
            $('#site-header').removeClass('scroll-counting');
        }
        var target_top = $target.offset().top - correction - 100 + 1;
        $('html, body').stop(true, true).animate({
            scrollTop: target_top
        }, 500, 'easeInOutQuint');
    });
    var vc_update_fullwidth_init = true;
    $(document).on('vc-full-width-row', function(e) {
        if (window.gemOptions.clientWidth - $page.width() > 25 || window.gemSettings.isRTL) {
            for (var i = 1; i < arguments.length; i++) {
                var $el = $(arguments[i]);
                $el.addClass("vc_hidden");
                var $el_full = $el.next(".vc_row-full-width");
                $el_full.length || ($el_full = $el.parent().next(".vc_row-full-width"));
                var el_margin_left = parseInt($el.css("margin-left"), 10),
                    el_margin_right = parseInt($el.css("margin-right"), 10),
                    offset = 0 - $el_full.offset().left - el_margin_left + $('#page').offset().left + parseInt($('#page').css('padding-left')),
                    width = $('#page').width();
                var offsetKey = window.gemSettings.isRTL ? 'right' : 'left';
                var cssData = {
                    position: "relative",
                    left: offset,
                    "box-sizing": "border-box",
                    width: $("#page").width()
                };
                cssData[offsetKey] = offset;
                if ($el.css(cssData), !$el.data("vcStretchContent")) {
                    var padding = -1 * offset;
                    0 > padding && (padding = 0);
                    var paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right;
                    0 > paddingRight && (paddingRight = 0), $el.css({
                        "padding-left": padding + "px",
                        "padding-right": paddingRight + "px"
                    })
                }
                $el.attr("data-vc-full-width-init", "true"), $el.removeClass("vc_hidden");
                $el.trigger('VCRowFullwidthUpdate');
            }
        }
        update_fullwidths(true, vc_update_fullwidth_init);
        vc_update_fullwidth_init = false;
    });
    if (!window.gemSettings.lasyDisabled && $.support.opacity) {
        $('.wpb_text_column.wpb_animate_when_almost_visible.wpb_fade').each(function() {
            $(this).wrap('<div class="lazy-loading"></div>').addClass('lazy-loading-item').data('ll-effect', 'fading');
        });
        $('.gem-list.lazy-loading').each(function() {
            $(this).data('ll-item-delay', '200');
            $('li', this).addClass('lazy-loading-item').data('ll-effect', 'slide-right');
            $('li', this).each(function(index) {
                $(this).attr("style", "transition-delay: " + (index + 1) * 0.2 + "s;");
            });
        });
        $.lazyLoading();
    }
    $('body').on('click', '.gem-button[href^="#give-form-"]', function(e) {
        var form_id = $(this).attr('href').replace('#give-form-', '');
        form_id = parseInt(form_id);
        if (!isNaN(form_id)) {
            $('#give-form-' + form_id + ' .give-btn-modal').click();
        }
        e.preventDefault();
        return false;
    });
})(jQuery);
(function($) {
    $('.menu-item-search a').on('click', function(e) {
        e.preventDefault();
        $('.menu-item-search').toggleClass('active');
    });
})(jQuery);;
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(d) {
    function e(a) {
        var b = a || window.event,
            c = [].slice.call(arguments, 1),
            f = 0,
            e = 0,
            g = 0,
            a = d.event.fix(b);
        a.type = "mousewheel";
        b.wheelDelta && (f = b.wheelDelta / 120);
        b.detail && (f = -b.detail / 3);
        g = f;
        b.axis !== void 0 && b.axis === b.HORIZONTAL_AXIS && (g = 0, e = -1 * f);
        b.wheelDeltaY !== void 0 && (g = b.wheelDeltaY / 120);
        b.wheelDeltaX !== void 0 && (e = -1 * b.wheelDeltaX / 120);
        c.unshift(a, f, e, g);
        return (d.event.dispatch || d.event.handle).apply(this, c)
    }
    var c = ["DOMMouseScroll", "mousewheel"];
    if (d.event.fixHooks)
        for (var h = c.length; h;) d.event.fixHooks[c[--h]] = d.event.mouseHooks;
    d.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var a = c.length; a;) this.addEventListener(c[--a], e, false);
            else this.onmousewheel = e
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var a = c.length; a;) this.removeEventListener(c[--a], e, false);
            else this.onmousewheel = null
        }
    };
    d.fn.extend({
        mousewheel: function(a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        },
        unmousewheel: function(a) {
            return this.unbind("mousewheel", a)
        }
    })
})(jQuery);; // ==================================================
// fancyBox v3.1.20
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
! function(t, e, n, o) {
    "use strict";

    function i(t) {
        var e = t.currentTarget,
            o = t.data ? t.data.options : {},
            i = t.data ? t.data.items : [],
            a = n(e).attr("data-fancybox") || "",
            s = 0;
        t.preventDefault(), t.stopPropagation(), a ? (i = i.length ? i.filter('[data-fancybox="' + a + '"]') : n('[data-fancybox="' + a + '"]'), s = i.index(e), s < 0 && (s = 0)) : i = [e], n.fancybox.open(i, o, s)
    }
    if (n) {
        if (n.fn.fancybox) return void n.error("fancyBox already initialized");
        var a = {
                loop: !1,
                margin: [44, 0],
                gutter: 50,
                keyboard: !0,
                arrows: !0,
                infobar: !1,
                toolbar: !0,
                buttons: ["slideShow", "fullScreen", "thumbs", "close"],
                idleTime: 4,
                smallBtn: "auto",
                protect: !1,
                modal: !1,
                image: {
                    preload: "auto"
                },
                ajax: {
                    settings: {
                        data: {
                            fancybox: !0
                        }
                    }
                },
                iframe: {
                    tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
                    preload: !0,
                    css: {},
                    attr: {
                        scrolling: "auto"
                    }
                },
                animationEffect: "zoom",
                animationDuration: 366,
                zoomOpacity: "auto",
                transitionEffect: "fade",
                transitionDuration: 366,
                slideClass: "",
                baseClass: "",
                baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><button data-fancybox-prev title="{{PREV}}" class="fancybox-button fancybox-button--left"></button><div class="fancybox-infobar__body"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><button data-fancybox-next title="{{NEXT}}" class="fancybox-button fancybox-button--right"></button></div><div class="fancybox-toolbar">{{BUTTONS}}</div><div class="fancybox-navigation"><button data-fancybox-prev title="{{PREV}}" class="fancybox-arrow fancybox-arrow--left" /><button data-fancybox-next title="{{NEXT}}" class="fancybox-arrow fancybox-arrow--right" /></div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',
                spinnerTpl: '<div class="fancybox-loading"></div>',
                errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',
                btnTpl: {
                    slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
                    fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
                    thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
                    close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
                    smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
                },
                parentEl: "body",
                autoFocus: !0,
                backFocus: !0,
                trapFocus: !0,
                fullScreen: {
                    autoStart: !1
                },
                touch: {
                    vertical: !0,
                    momentum: !0
                },
                hash: null,
                media: {},
                slideShow: {
                    autoStart: !1,
                    speed: 4e3
                },
                thumbs: {
                    autoStart: !1,
                    hideOnClose: !0
                },
                onInit: n.noop,
                beforeLoad: n.noop,
                afterLoad: n.noop,
                beforeShow: n.noop,
                afterShow: n.noop,
                beforeClose: n.noop,
                afterClose: n.noop,
                onActivate: n.noop,
                onDeactivate: n.noop,
                clickContent: function(t, e) {
                    return "image" === t.type && "zoom"
                },
                clickSlide: "close",
                clickOutside: "close",
                dblclickContent: !1,
                dblclickSlide: !1,
                dblclickOutside: !1,
                mobile: {
                    clickContent: function(t, e) {
                        return "image" === t.type && "toggleControls"
                    },
                    clickSlide: function(t, e) {
                        return "image" === t.type ? "toggleControls" : "close"
                    },
                    dblclickContent: function(t, e) {
                        return "image" === t.type && "zoom"
                    },
                    dblclickSlide: function(t, e) {
                        return "image" === t.type && "zoom"
                    }
                },
                lang: "en",
                i18n: {
                    en: {
                        CLOSE: "Close",
                        NEXT: "Next",
                        PREV: "Previous",
                        ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                        PLAY_START: "Start slideshow",
                        PLAY_STOP: "Pause slideshow",
                        FULL_SCREEN: "Full screen",
                        THUMBS: "Thumbnails"
                    },
                    de: {
                        CLOSE: "Schliessen",
                        NEXT: "Weiter",
                        PREV: "Zurück",
                        ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",
                        PLAY_START: "Diaschau starten",
                        PLAY_STOP: "Diaschau beenden",
                        FULL_SCREEN: "Vollbild",
                        THUMBS: "Vorschaubilder"
                    }
                }
            },
            s = n(t),
            r = n(e),
            c = 0,
            l = function(t) {
                return t && t.hasOwnProperty && t instanceof n
            },
            u = function() {
                return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
                    return t.setTimeout(e, 1e3 / 60)
                }
            }(),
            d = function() {
                var t, n = e.createElement("fakeelement"),
                    i = {
                        transition: "transitionend",
                        OTransition: "oTransitionEnd",
                        MozTransition: "transitionend",
                        WebkitTransition: "webkitTransitionEnd"
                    };
                for (t in i)
                    if (n.style[t] !== o) return i[t]
            }(),
            f = function(t) {
                return t && t.length && t[0].offsetHeight
            },
            h = function(t, o, i) {
                var s = this;
                s.opts = n.extend(!0, {
                    index: i
                }, a, o || {}), o && n.isArray(o.buttons) && (s.opts.buttons = o.buttons), s.id = s.opts.id || ++c, s.group = [], s.currIndex = parseInt(s.opts.index, 10) || 0, s.prevIndex = null, s.prevPos = null, s.currPos = 0, s.firstRun = null, s.createGroup(t), s.group.length && (s.$lastFocus = n(e.activeElement).blur(), s.slides = {}, s.init(t))
            };
        n.extend(h.prototype, {
            init: function() {
                var t, e, o, i = this,
                    a = i.group[i.currIndex].opts;
                i.scrollTop = r.scrollTop(), i.scrollLeft = r.scrollLeft(), n.fancybox.getInstance() || n.fancybox.isMobile || "hidden" === n("body").css("overflow") || (t = n("body").width(), n("html").addClass("fancybox-enabled"), t = n("body").width() - t, t > 1 && n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + t + "px; }</style>")), o = "", n.each(a.buttons, function(t, e) {
                    o += a.btnTpl[e] || ""
                }), e = n(i.translate(i, a.baseTpl.replace("{{BUTTONS}}", o))).addClass("fancybox-is-hidden").attr("id", "fancybox-container-" + i.id).addClass(a.baseClass).data("FancyBox", i).prependTo(a.parentEl), i.$refs = {
                    container: e
                }, ["bg", "inner", "infobar", "toolbar", "stage", "caption"].forEach(function(t) {
                    i.$refs[t] = e.find(".fancybox-" + t)
                }), (!a.arrows || i.group.length < 2) && e.find(".fancybox-navigation").remove(), a.infobar || i.$refs.infobar.remove(), a.toolbar || i.$refs.toolbar.remove(), i.trigger("onInit"), i.activate(), i.jumpTo(i.currIndex)
            },
            translate: function(t, e) {
                var n = t.opts.i18n[t.opts.lang];
                return e.replace(/\{\{(\w+)\}\}/g, function(t, e) {
                    var i = n[e];
                    return i === o ? t : i
                })
            },
            createGroup: function(t) {
                var e = this,
                    i = n.makeArray(t);
                n.each(i, function(t, i) {
                    var a, s, r, c, l = {},
                        u = {},
                        d = [];
                    n.isPlainObject(i) ? (l = i, u = i.opts || i) : "object" === n.type(i) && n(i).length ? (a = n(i), d = a.data(), u = "options" in d ? d.options : {}, u = "object" === n.type(u) ? u : {}, l.src = "src" in d ? d.src : u.src || a.attr("href"), ["width", "height", "thumb", "type", "filter"].forEach(function(t) {
                        t in d && (u[t] = d[t])
                    }), "srcset" in d && (u.image = {
                        srcset: d.srcset
                    }), u.$orig = a, l.type || l.src || (l.type = "inline", l.src = i)) : l = {
                        type: "html",
                        src: i + ""
                    }, l.opts = n.extend(!0, {}, e.opts, u), n.fancybox.isMobile && (l.opts = n.extend(!0, {}, l.opts, l.opts.mobile)), s = l.type || l.opts.type, r = l.src || "", !s && r && (r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s = "image" : r.match(/\.(pdf)((\?|#).*)?$/i) ? s = "pdf" : "#" === r.charAt(0) && (s = "inline")), l.type = s, l.index = e.group.length, l.opts.$orig && !l.opts.$orig.length && delete l.opts.$orig, !l.opts.$thumb && l.opts.$orig && (l.opts.$thumb = l.opts.$orig.find("img:first")), l.opts.$thumb && !l.opts.$thumb.length && delete l.opts.$thumb, "function" === n.type(l.opts.caption) ? l.opts.caption = l.opts.caption.apply(i, [e, l]) : "caption" in d && (l.opts.caption = d.caption), l.opts.caption = l.opts.caption === o ? "" : l.opts.caption + "", "ajax" === s && (c = r.split(/\s+/, 2), c.length > 1 && (l.src = c.shift(), l.opts.filter = c.shift())), "auto" == l.opts.smallBtn && (n.inArray(s, ["html", "inline", "ajax"]) > -1 ? (l.opts.toolbar = !1, l.opts.smallBtn = !0) : l.opts.smallBtn = !1), "pdf" === s && (l.type = "iframe", l.opts.iframe.preload = !1), l.opts.modal && (l.opts = n.extend(!0, l.opts, {
                        infobar: 0,
                        toolbar: 0,
                        smallBtn: 0,
                        keyboard: 0,
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,
                        clickContent: !1,
                        clickSlide: !1,
                        clickOutside: !1,
                        dblclickContent: !1,
                        dblclickSlide: !1,
                        dblclickOutside: !1
                    })), e.group.push(l)
                })
            },
            addEvents: function() {
                var o = this;
                o.removeEvents(), o.$refs.container.on("click.fb-close", "[data-fancybox-close]", function(t) {
                    t.stopPropagation(), t.preventDefault(), o.close(t)
                }).on("click.fb-prev touchend.fb-prev", "[data-fancybox-prev]", function(t) {
                    t.stopPropagation(), t.preventDefault(), o.previous()
                }).on("click.fb-next touchend.fb-next", "[data-fancybox-next]", function(t) {
                    t.stopPropagation(), t.preventDefault(), o.next()
                }), s.on("orientationchange.fb resize.fb", function(t) {
                    t && t.originalEvent && "resize" === t.originalEvent.type ? u(function() {
                        o.update()
                    }) : (o.$refs.stage.hide(), setTimeout(function() {
                        o.$refs.stage.show(), o.update()
                    }, 500))
                }), r.on("focusin.fb", function(t) {
                    var i = n.fancybox ? n.fancybox.getInstance() : null;
                    i.isClosing || !i.current || !i.current.opts.trapFocus || n(t.target).hasClass("fancybox-container") || n(t.target).is(e) || i && "fixed" !== n(t.target).css("position") && !i.$refs.container.has(t.target).length && (t.stopPropagation(), i.focus(), s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft))
                }), r.on("keydown.fb", function(t) {
                    var e = o.current,
                        i = t.keyCode || t.which;
                    if (e && e.opts.keyboard && !n(t.target).is("input") && !n(t.target).is("textarea")) return 8 === i || 27 === i ? (t.preventDefault(), void o.close(t)) : 37 === i || 38 === i ? (t.preventDefault(), void o.previous()) : 39 === i || 40 === i ? (t.preventDefault(), void o.next()) : void o.trigger("afterKeydown", t, i)
                }), o.group[o.currIndex].opts.idleTime && (o.idleSecondsCounter = 0, r.on("mousemove.fb-idle mouseenter.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function() {
                    o.idleSecondsCounter = 0, o.isIdle && o.showControls(), o.isIdle = !1
                }), o.idleInterval = t.setInterval(function() {
                    o.idleSecondsCounter++, o.idleSecondsCounter >= o.group[o.currIndex].opts.idleTime && (o.isIdle = !0, o.idleSecondsCounter = 0, o.hideControls())
                }, 1e3))
            },
            removeEvents: function() {
                var e = this;
                s.off("orientationchange.fb resize.fb"), r.off("focusin.fb keydown.fb .fb-idle"), this.$refs.container.off(".fb-close .fb-prev .fb-next"), e.idleInterval && (t.clearInterval(e.idleInterval), e.idleInterval = null)
            },
            previous: function(t) {
                return this.jumpTo(this.currPos - 1, t)
            },
            next: function(t) {
                return this.jumpTo(this.currPos + 1, t)
            },
            jumpTo: function(t, e, i) {
                var a, s, r, c, l, u, d, h = this,
                    p = h.group.length;
                if (!(h.isSliding || h.isClosing || h.isAnimating && h.firstRun)) {
                    if (t = parseInt(t, 10), s = h.current ? h.current.opts.loop : h.opts.loop, !s && (t < 0 || t >= p)) return !1;
                    if (a = h.firstRun = null === h.firstRun, !(p < 2 && !a && h.isSliding)) {
                        if (c = h.current, h.prevIndex = h.currIndex, h.prevPos = h.currPos, r = h.createSlide(t), p > 1 && ((s || r.index > 0) && h.createSlide(t - 1), (s || r.index < p - 1) && h.createSlide(t + 1)), h.current = r, h.currIndex = r.index, h.currPos = r.pos, h.trigger("beforeShow", a), h.updateControls(), u = n.fancybox.getTranslate(r.$slide), r.isMoved = (0 !== u.left || 0 !== u.top) && !r.$slide.hasClass("fancybox-animated"), r.forcedDuration = o, n.isNumeric(e) ? r.forcedDuration = e : e = r.opts[a ? "animationDuration" : "transitionDuration"], e = parseInt(e, 10), a) return r.opts.animationEffect && e && h.$refs.container.css("transition-duration", e + "ms"), h.$refs.container.removeClass("fancybox-is-hidden"), f(h.$refs.container), h.$refs.container.addClass("fancybox-is-open"), r.$slide.addClass("fancybox-slide--current"), h.loadSlide(r), void h.preload();
                        n.each(h.slides, function(t, e) {
                            n.fancybox.stop(e.$slide)
                        }), r.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"), r.isMoved ? (l = Math.round(r.$slide.width()), n.each(h.slides, function(t, o) {
                            var i = o.pos - r.pos;
                            n.fancybox.animate(o.$slide, {
                                top: 0,
                                left: i * l + i * o.opts.gutter
                            }, e, function() {
                                o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"), o.pos === h.currPos && (r.isMoved = !1, h.complete())
                            })
                        })) : h.$refs.stage.children().removeAttr("style"), r.isLoaded ? h.revealContent(r) : h.loadSlide(r), h.preload(), c.pos !== r.pos && (d = "fancybox-slide--" + (c.pos > r.pos ? "next" : "previous"), c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"), c.isComplete = !1, e && (r.isMoved || r.opts.transitionEffect) && (r.isMoved ? c.$slide.addClass(d) : (d = "fancybox-animated " + d + " fancybox-fx-" + r.opts.transitionEffect, n.fancybox.animate(c.$slide, d, e, function() {
                            c.$slide.removeClass(d).removeAttr("style")
                        }))))
                    }
                }
            },
            createSlide: function(t) {
                var e, o, i = this;
                return o = t % i.group.length, o = o < 0 ? i.group.length + o : o, !i.slides[t] && i.group[o] && (e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage), i.slides[t] = n.extend(!0, {}, i.group[o], {
                    pos: t,
                    $slide: e,
                    isLoaded: !1
                }), i.updateSlide(i.slides[t])), i.slides[t]
            },
            scaleToActual: function(t, e, i) {
                var a, s, r, c, l, u = this,
                    d = u.current,
                    f = d.$content,
                    h = parseInt(d.$slide.width(), 10),
                    p = parseInt(d.$slide.height(), 10),
                    g = d.width,
                    b = d.height;
                "image" != d.type || d.hasError || !f || u.isAnimating || (n.fancybox.stop(f), u.isAnimating = !0, t = t === o ? .5 * h : t, e = e === o ? .5 * p : e, a = n.fancybox.getTranslate(f), c = g / a.width, l = b / a.height, s = .5 * h - .5 * g, r = .5 * p - .5 * b, g > h && (s = a.left * c - (t * c - t), s > 0 && (s = 0), s < h - g && (s = h - g)), b > p && (r = a.top * l - (e * l - e), r > 0 && (r = 0), r < p - b && (r = p - b)), u.updateCursor(g, b), n.fancybox.animate(f, {
                    top: r,
                    left: s,
                    scaleX: c,
                    scaleY: l
                }, i || 330, function() {
                    u.isAnimating = !1
                }), u.SlideShow && u.SlideShow.isActive && u.SlideShow.stop())
            },
            scaleToFit: function(t) {
                var e, o = this,
                    i = o.current,
                    a = i.$content;
                "image" != i.type || i.hasError || !a || o.isAnimating || (n.fancybox.stop(a), o.isAnimating = !0, e = o.getFitPos(i), o.updateCursor(e.width, e.height), n.fancybox.animate(a, {
                    top: e.top,
                    left: e.left,
                    scaleX: e.width / a.width(),
                    scaleY: e.height / a.height()
                }, t || 330, function() {
                    o.isAnimating = !1
                }))
            },
            getFitPos: function(t) {
                var e, o, i, a, r, c = this,
                    l = t.$content,
                    u = t.width,
                    d = t.height,
                    f = t.opts.margin;
                return !(!l || !l.length || !u && !d) && ("number" === n.type(f) && (f = [f, f]), 2 == f.length && (f = [f[0], f[1], f[0], f[1]]), s.width() < 800 && (f = [0, 0, 0, 0]), e = parseInt(c.$refs.stage.width(), 10) - (f[1] + f[3]), o = parseInt(c.$refs.stage.height(), 10) - (f[0] + f[2]), i = Math.min(1, e / u, o / d), a = Math.floor(i * u), r = Math.floor(i * d), {
                    top: Math.floor(.5 * (o - r)) + f[0],
                    left: Math.floor(.5 * (e - a)) + f[3],
                    width: a,
                    height: r
                })
            },
            update: function() {
                var t = this;
                n.each(t.slides, function(e, n) {
                    t.updateSlide(n)
                })
            },
            updateSlide: function(t) {
                var e = this,
                    o = t.$content;
                o && (t.width || t.height) && (n.fancybox.stop(o), n.fancybox.setTranslate(o, e.getFitPos(t)), t.pos === e.currPos && e.updateCursor()), t.$slide.trigger("refresh"), e.trigger("onUpdate", t)
            },
            updateCursor: function(t, e) {
                var n, i = this,
                    a = i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut");
                i.current && !i.isClosing && (i.isZoomable() ? (a.addClass("fancybox-is-zoomable"), n = t !== o && e !== o ? t < i.current.width && e < i.current.height : i.isScaledDown(), n ? a.addClass("fancybox-can-zoomIn") : i.current.opts.touch ? a.addClass("fancybox-can-drag") : a.addClass("fancybox-can-zoomOut")) : i.current.opts.touch && a.addClass("fancybox-can-drag"))
            },
            isZoomable: function() {
                var t, e = this,
                    o = e.current;
                if (o && !e.isClosing) return !!("image" === o.type && o.isLoaded && !o.hasError && ("zoom" === o.opts.clickContent || n.isFunction(o.opts.clickContent) && "zoom" === o.opts.clickContent(o)) && (t = e.getFitPos(o), o.width > t.width || o.height > t.height))
            },
            isScaledDown: function() {
                var t = this,
                    e = t.current,
                    o = e.$content,
                    i = !1;
                return o && (i = n.fancybox.getTranslate(o), i = i.width < e.width || i.height < e.height), i
            },
            canPan: function() {
                var t = this,
                    e = t.current,
                    n = e.$content,
                    o = !1;
                return n && (o = t.getFitPos(e), o = Math.abs(n.width() - o.width) > 1 || Math.abs(n.height() - o.height) > 1), o
            },
            loadSlide: function(t) {
                var e, o, i, a = this;
                if (!t.isLoading && !t.isLoaded) {
                    switch (t.isLoading = !0, a.trigger("beforeLoad", t), e = t.type, o = t.$slide, o.off("refresh").trigger("onReset").addClass("fancybox-slide--" + (e || "unknown")).addClass(t.opts.slideClass), e) {
                        case "image":
                            a.setImage(t);
                            break;
                        case "iframe":
                            a.setIframe(t);
                            break;
                        case "html":
                            a.setContent(t, t.src || t.content);
                            break;
                        case "inline":
                            n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t);
                            break;
                        case "ajax":
                            a.showLoading(t), i = n.ajax(n.extend({}, t.opts.ajax.settings, {
                                url: t.src,
                                success: function(e, n) {
                                    "success" === n && a.setContent(t, e)
                                },
                                error: function(e, n) {
                                    e && "abort" !== n && a.setError(t)
                                }
                            })), o.one("onReset", function() {
                                i.abort()
                            });
                            break;
                        default:
                            a.setError(t)
                    }
                    return !0
                }
            },
            setImage: function(e) {
                var o, i, a, s, r = this,
                    c = e.opts.image.srcset;
                if (c) {
                    a = t.devicePixelRatio || 1, s = t.innerWidth * a, i = c.split(",").map(function(t) {
                        var e = {};
                        return t.trim().split(/\s+/).forEach(function(t, n) {
                            var o = parseInt(t.substring(0, t.length - 1), 10);
                            return 0 === n ? e.url = t : void(o && (e.value = o, e.postfix = t[t.length - 1]))
                        }), e
                    }), i.sort(function(t, e) {
                        return t.value - e.value
                    });
                    for (var l = 0; l < i.length; l++) {
                        var u = i[l];
                        if ("w" === u.postfix && u.value >= s || "x" === u.postfix && u.value >= a) {
                            o = u;
                            break
                        }
                    }!o && i.length && (o = i[i.length - 1]), o && (e.src = o.url, e.width && e.height && "w" == o.postfix && (e.height = e.width / e.height * o.value, e.width = o.value))
                }
                e.$content = n('<div class="fancybox-image-wrap"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide), e.opts.preload !== !1 && e.opts.width && e.opts.height && (e.opts.thumb || e.opts.$thumb) ? (e.width = e.opts.width, e.height = e.opts.height, e.$ghost = n("<img />").one("error", function() {
                    n(this).remove(), e.$ghost = null, r.setBigImage(e)
                }).one("load", function() {
                    r.afterLoad(e), r.setBigImage(e)
                }).addClass("fancybox-image").appendTo(e.$content).attr("src", e.opts.thumb || e.opts.$thumb.attr("src"))) : r.setBigImage(e)
            },
            setBigImage: function(t) {
                var e = this,
                    o = n("<img />");
                t.$image = o.one("error", function() {
                    e.setError(t)
                }).one("load", function() {
                    clearTimeout(t.timouts), t.timouts = null, e.isClosing || (t.width = this.naturalWidth, t.height = this.naturalHeight, t.opts.image.srcset && o.attr("sizes", "100vw").attr("srcset", t.opts.image.srcset), e.hideLoading(t), t.$ghost ? t.timouts = setTimeout(function() {
                        t.timouts = null, t.$ghost.hide()
                    }, Math.min(300, Math.max(1e3, t.height / 1600))) : e.afterLoad(t))
                }).addClass("fancybox-image").attr("src", t.src).appendTo(t.$content), o[0].complete ? o.trigger("load") : o[0].error ? o.trigger("error") : t.timouts = setTimeout(function() {
                    o[0].complete || t.hasError || e.showLoading(t)
                }, 100)
            },
            setIframe: function(t) {
                var e, i = this,
                    a = t.opts.iframe,
                    s = t.$slide;
                t.$content = n('<div class="fancybox-content' + (a.preload ? " fancybox-is-hidden" : "") + '"></div>').css(a.css).appendTo(s), e = n(a.tpl.replace(/\{rnd\}/g, (new Date).getTime())).attr(a.attr).appendTo(t.$content), a.preload ? (i.showLoading(t), e.on("load.fb error.fb", function(e) {
                    this.isReady = 1, t.$slide.trigger("refresh"), i.afterLoad(t)
                }), s.on("refresh.fb", function() {
                    var n, i, s, r, c, l = t.$content;
                    if (1 === e[0].isReady) {
                        try {
                            n = e.contents(), i = n.find("body")
                        } catch (t) {}
                        i && i.length && (a.css.width === o || a.css.height === o) && (s = e[0].contentWindow.document.documentElement.scrollWidth, r = Math.ceil(i.outerWidth(!0) + (l.width() - s)), c = Math.ceil(i.outerHeight(!0)), l.css({
                            width: a.css.width === o ? r + (l.outerWidth() - l.innerWidth()) : a.css.width,
                            height: a.css.height === o ? c + (l.outerHeight() - l.innerHeight()) : a.css.height
                        })), l.removeClass("fancybox-is-hidden")
                    }
                })) : this.afterLoad(t), e.attr("src", t.src), t.opts.smallBtn === !0 && t.$content.prepend(i.translate(t, t.opts.btnTpl.smallBtn)), s.one("onReset", function() {
                    try {
                        n(this).find("iframe").hide().attr("src", "//about:blank")
                    } catch (t) {}
                    n(this).empty(), t.isLoaded = !1
                })
            },
            setContent: function(t, e) {
                var o = this;
                o.isClosing || (o.hideLoading(t), t.$slide.empty(), l(e) && e.parent().length ? (e.parent(".fancybox-slide--inline").trigger("onReset"), t.$placeholder = n("<div></div>").hide().insertAfter(e), e.css("display", "inline-block")) : t.hasError || ("string" === n.type(e) && (e = n("<div>").append(n.trim(e)).contents(), 3 === e[0].nodeType && (e = n("<div>").html(e))), t.opts.filter && (e = n("<div>").html(e).find(t.opts.filter))), t.$slide.one("onReset", function() {
                    t.$placeholder && (t.$placeholder.after(e.hide()).remove(), t.$placeholder = null), t.$smallBtn && (t.$smallBtn.remove(), t.$smallBtn = null), t.hasError || (n(this).empty(), t.isLoaded = !1)
                }), t.$content = n(e).appendTo(t.$slide), t.opts.smallBtn && !t.$smallBtn && (t.$smallBtn = n(o.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content)), this.afterLoad(t))
            },
            setError: function(t) {
                t.hasError = !0, t.$slide.removeClass("fancybox-slide--" + t.type), this.setContent(t, this.translate(t, t.opts.errorTpl))
            },
            showLoading: function(t) {
                var e = this;
                t = t || e.current, t && !t.$spinner && (t.$spinner = n(e.opts.spinnerTpl).appendTo(t.$slide))
            },
            hideLoading: function(t) {
                var e = this;
                t = t || e.current, t && t.$spinner && (t.$spinner.remove(), delete t.$spinner)
            },
            afterLoad: function(t) {
                var e = this;
                e.isClosing || (t.isLoading = !1, t.isLoaded = !0, e.trigger("afterLoad", t), e.hideLoading(t), t.opts.protect && t.$content && !t.hasError && (t.$content.on("contextmenu.fb", function(t) {
                    return 2 == t.button && t.preventDefault(), !0
                }), "image" === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)), e.revealContent(t))
            },
            revealContent: function(t) {
                var e, i, a, s, r, c = this,
                    l = t.$slide,
                    u = !1;
                return e = t.opts[c.firstRun ? "animationEffect" : "transitionEffect"], a = t.opts[c.firstRun ? "animationDuration" : "transitionDuration"], a = parseInt(t.forcedDuration === o ? a : t.forcedDuration, 10), !t.isMoved && t.pos === c.currPos && a || (e = !1), "zoom" !== e || t.pos === c.currPos && a && "image" === t.type && !t.hasError && (u = c.getThumbPos(t)) || (e = "fade"), "zoom" === e ? (r = c.getFitPos(t), r.scaleX = Math.round(r.width / u.width * 100) / 100, r.scaleY = Math.round(r.height / u.height * 100) / 100, delete r.width, delete r.height, s = t.opts.zoomOpacity, "auto" == s && (s = Math.abs(t.width / t.height - u.width / u.height) > .1), s && (u.opacity = .1, r.opacity = 1), n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"), u), f(t.$content), void n.fancybox.animate(t.$content, r, a, function() {
                    c.complete()
                })) : (c.updateSlide(t), e ? (n.fancybox.stop(l), i = "fancybox-animated fancybox-slide--" + (t.pos > c.prevPos ? "next" : "previous") + " fancybox-fx-" + e, l.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i), t.$content.removeClass("fancybox-is-hidden"), f(l), void n.fancybox.animate(l, "fancybox-slide--current", a, function(e) {
                    l.removeClass(i).removeAttr("style"), t.pos === c.currPos && c.complete()
                }, !0)) : (f(l), t.$content.removeClass("fancybox-is-hidden"), void(t.pos === c.currPos && c.complete())))
            },
            getThumbPos: function(o) {
                var i, a = this,
                    s = !1,
                    r = function(e) {
                        for (var o, i = e[0], a = i.getBoundingClientRect(), s = []; null !== i.parentElement;) "hidden" !== n(i.parentElement).css("overflow") && "auto" !== n(i.parentElement).css("overflow") || s.push(i.parentElement.getBoundingClientRect()), i = i.parentElement;
                        return o = s.every(function(t) {
                            var e = Math.min(a.right, t.right) - Math.max(a.left, t.left),
                                n = Math.min(a.bottom, t.bottom) - Math.max(a.top, t.top);
                            return e > 0 && n > 0
                        }), o && a.bottom > 0 && a.right > 0 && a.left < n(t).width() && a.top < n(t).height()
                    },
                    c = o.opts.$thumb,
                    l = c ? c.offset() : 0;
                return l && c[0].ownerDocument === e && r(c) && (i = a.$refs.stage.offset(), s = {
                    top: l.top - i.top + parseFloat(c.css("border-top-width") || 0),
                    left: l.left - i.left + parseFloat(c.css("border-left-width") || 0),
                    width: c.width(),
                    height: c.height(),
                    scaleX: 1,
                    scaleY: 1
                }), s
            },
            complete: function() {
                var t = this,
                    o = t.current,
                    i = {};
                o.isMoved || !o.isLoaded || o.isComplete || (o.isComplete = !0, o.$slide.siblings().trigger("onReset"), f(o.$slide), o.$slide.addClass("fancybox-slide--complete"), n.each(t.slides, function(e, o) {
                    o.pos >= t.currPos - 1 && o.pos <= t.currPos + 1 ? i[o.pos] = o : o && (n.fancybox.stop(o.$slide), o.$slide.unbind().remove())
                }), t.slides = i, t.updateCursor(), t.trigger("afterShow"), (n(e.activeElement).is("[disabled]") || o.opts.autoFocus && "image" != o.type && "iframe" !== o.type) && t.focus())
            },
            preload: function() {
                var t, e, n = this;
                n.group.length < 2 || (t = n.slides[n.currPos + 1], e = n.slides[n.currPos - 1], t && "image" === t.type && n.loadSlide(t), e && "image" === e.type && n.loadSlide(e))
            },
            focus: function() {
                var t, e = this.current;
                this.isClosing || (t = e && e.isComplete ? e.$slide.find("button,:input,[tabindex],a").filter(":not([disabled]):visible:first") : null, t = t && t.length ? t : this.$refs.container, t.focus())
            },
            activate: function() {
                var t = this;
                n(".fancybox-container").each(function() {
                    var e = n(this).data("FancyBox");
                    e && e.uid !== t.uid && !e.isClosing && e.trigger("onDeactivate")
                }), t.current && (t.$refs.container.index() > 0 && t.$refs.container.prependTo(e.body), t.updateControls()), t.trigger("onActivate"), t.addEvents()
            },
            close: function(t, e) {
                var o, i, a, s, r, c, l = this,
                    f = l.current,
                    h = function() {
                        l.cleanUp(t)
                    };
                return !l.isClosing && (l.isClosing = !0, l.trigger("beforeClose", t) === !1 ? (l.isClosing = !1, u(function() {
                    l.update()
                }), !1) : (l.removeEvents(), f.timouts && clearTimeout(f.timouts), a = f.$content, o = f.opts.animationEffect, i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0, f.$slide.off(d).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"), f.$slide.siblings().trigger("onReset").remove(), i && l.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"), l.hideLoading(f), l.hideControls(), l.updateCursor(), "zoom" !== o || t !== !0 && a && i && "image" === f.type && !f.hasError && (c = l.getThumbPos(f)) || (o = "fade"), "zoom" === o ? (n.fancybox.stop(a), r = n.fancybox.getTranslate(a), r.width = r.width * r.scaleX, r.height = r.height * r.scaleY, s = f.opts.zoomOpacity, "auto" == s && (s = Math.abs(f.width / f.height - c.width / c.height) > .1), s && (c.opacity = 0), r.scaleX = r.width / c.width, r.scaleY = r.height / c.height, r.width = c.width, r.height = c.height, n.fancybox.setTranslate(f.$content, r), n.fancybox.animate(f.$content, c, i, h), !0) : (o && i ? t === !0 ? setTimeout(h, i) : n.fancybox.animate(f.$slide.removeClass("fancybox-slide--current"), "fancybox-animated fancybox-slide--previous fancybox-fx-" + o, i, h) : h(), !0)))
            },
            cleanUp: function(t) {
                var e, o = this;
                o.current.$slide.trigger("onReset"), o.$refs.container.empty().remove(), o.trigger("afterClose", t), o.$lastFocus && !o.current.focusBack && o.$lastFocus.focus(), o.current = null, e = n.fancybox.getInstance(), e ? e.activate() : (s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft), n("html").removeClass("fancybox-enabled"), n("#fancybox-style-noscroll").remove())
            },
            trigger: function(t, e) {
                var o, i = Array.prototype.slice.call(arguments, 1),
                    a = this,
                    s = e && e.opts ? e : a.current;
                return s ? i.unshift(s) : s = a, i.unshift(a), n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)), o === !1 ? o : void("afterClose" === t ? r.trigger(t + ".fb", i) : a.$refs.container.trigger(t + ".fb", i))
            },
            updateControls: function(t) {
                var e = this,
                    o = e.current,
                    i = o.index,
                    a = o.opts,
                    s = a.caption,
                    r = e.$refs.caption;
                o.$slide.trigger("refresh"), e.$caption = s && s.length ? r.html(s) : null, e.isHiddenControls || e.showControls(), n("[data-fancybox-count]").html(e.group.length), n("[data-fancybox-index]").html(i + 1), n("[data-fancybox-prev]").prop("disabled", !a.loop && i <= 0), n("[data-fancybox-next]").prop("disabled", !a.loop && i >= e.group.length - 1)
            },
            hideControls: function() {
                this.isHiddenControls = !0, this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav")
            },
            showControls: function() {
                var t = this,
                    e = t.current ? t.current.opts : t.opts,
                    n = t.$refs.container;
                t.isHiddenControls = !1, t.idleSecondsCounter = 0, n.toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons)).toggleClass("fancybox-show-infobar", !!(e.infobar && t.group.length > 1)).toggleClass("fancybox-show-nav", !!(e.arrows && t.group.length > 1)).toggleClass("fancybox-is-modal", !!e.modal), t.$caption ? n.addClass("fancybox-show-caption ") : n.removeClass("fancybox-show-caption")
            },
            toggleControls: function() {
                this.isHiddenControls ? this.showControls() : this.hideControls()
            }
        }), n.fancybox = {
            version: "3.1.20",
            defaults: a,
            getInstance: function(t) {
                var e = n('.fancybox-container:not(".fancybox-is-closing"):first').data("FancyBox"),
                    o = Array.prototype.slice.call(arguments, 1);
                return e instanceof h && ("string" === n.type(t) ? e[t].apply(e, o) : "function" === n.type(t) && t.apply(e, o), e)
            },
            open: function(t, e, n) {
                return new h(t, e, n)
            },
            close: function(t) {
                var e = this.getInstance();
                e && (e.close(), t === !0 && this.close())
            },
            destroy: function() {
                this.close(!0), r.off("click.fb-start")
            },
            isMobile: e.createTouch !== o && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
            use3d: function() {
                var n = e.createElement("div");
                return t.getComputedStyle && t.getComputedStyle(n).getPropertyValue("transform") && !(e.documentMode && e.documentMode < 11)
            }(),
            getTranslate: function(t) {
                var e;
                if (!t || !t.length) return !1;
                if (e = t.eq(0).css("transform"), e && e.indexOf("matrix") !== -1 ? (e = e.split("(")[1], e = e.split(")")[0], e = e.split(",")) : e = [], e.length) e = e.length > 10 ? [e[13], e[12], e[0], e[5]] : [e[5], e[4], e[0], e[3]], e = e.map(parseFloat);
                else {
                    e = [0, 0, 1, 1];
                    var n = /\.*translate\((.*)px,(.*)px\)/i,
                        o = n.exec(t.eq(0).attr("style"));
                    o && (e[0] = parseFloat(o[2]), e[1] = parseFloat(o[1]))
                }
                return {
                    top: e[0],
                    left: e[1],
                    scaleX: e[2],
                    scaleY: e[3],
                    opacity: parseFloat(t.css("opacity")),
                    width: t.width(),
                    height: t.height()
                }
            },
            setTranslate: function(t, e) {
                var n = "",
                    i = {};
                if (t && e) return e.left === o && e.top === o || (n = (e.left === o ? t.position().left : e.left) + "px, " + (e.top === o ? t.position().top : e.top) + "px", n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"), e.scaleX !== o && e.scaleY !== o && (n = (n.length ? n + " " : "") + "scale(" + e.scaleX + ", " + e.scaleY + ")"), n.length && (i.transform = n), e.opacity !== o && (i.opacity = e.opacity), e.width !== o && (i.width = e.width), e.height !== o && (i.height = e.height), t.css(i)
            },
            animate: function(t, e, i, a, s) {
                var r = d || "transitionend";
                n.isFunction(i) && (a = i, i = null), n.isPlainObject(e) || t.removeAttr("style"), t.on(r, function(i) {
                    (!i || !i.originalEvent || t.is(i.originalEvent.target) && "z-index" != i.originalEvent.propertyName) && (t.off(r), n.isPlainObject(e) ? e.scaleX !== o && e.scaleY !== o && (t.css("transition-duration", "0ms"), e.width = t.width() * e.scaleX, e.height = t.height() * e.scaleY, e.scaleX = 1, e.scaleY = 1, n.fancybox.setTranslate(t, e)) : s !== !0 && t.removeClass(e), n.isFunction(a) && a(i))
                }), n.isNumeric(i) && t.css("transition-duration", i + "ms"), n.isPlainObject(e) ? n.fancybox.setTranslate(t, e) : t.addClass(e), t.data("timer", setTimeout(function() {
                    t.trigger("transitionend")
                }, i + 16))
            },
            stop: function(t) {
                clearTimeout(t.data("timer")), t.off(d)
            }
        }, n.fn.fancybox = function(t) {
            var e;
            return t = t || {}, e = t.selector || !1, e ? n("body").off("click.fb-start", e).on("click.fb-start", e, {
                items: n(e),
                options: t
            }, i) : this.off("click.fb-start").on("click.fb-start", {
                items: this,
                options: t
            }, i), this
        }, r.on("click.fb-start", "[data-fancybox]", i)
    }
}(window, document, window.jQuery),
function(t) {
    "use strict";
    var e = function(e, n, o) {
            if (e) return o = o || "", "object" === t.type(o) && (o = t.param(o, !0)), t.each(n, function(t, n) {
                e = e.replace("$" + t, n || "")
            }), o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o), e
        },
        n = {
            youtube: {
                matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
                params: {
                    autoplay: 1,
                    autohide: 1,
                    fs: 1,
                    rel: 0,
                    hd: 1,
                    wmode: "transparent",
                    enablejsapi: 1,
                    html5: 1
                },
                paramPlace: 8,
                type: "iframe",
                url: "//www.youtube.com/embed/$4",
                thumb: "//img.youtube.com/vi/$4/hqdefault.jpg"
            },
            vimeo: {
                matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
                params: {
                    autoplay: 1,
                    hd: 1,
                    show_title: 1,
                    show_byline: 1,
                    show_portrait: 0,
                    fullscreen: 1,
                    api: 1
                },
                paramPlace: 3,
                type: "iframe",
                url: "//player.vimeo.com/video/$2"
            },
            metacafe: {
                matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
                type: "iframe",
                url: "//www.metacafe.com/embed/$1/?ap=1"
            },
            dailymotion: {
                matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
                params: {
                    additionalInfos: 0,
                    autoStart: 1
                },
                type: "iframe",
                url: "//www.dailymotion.com/embed/video/$1"
            },
            vine: {
                matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
                type: "iframe",
                url: "//vine.co/v/$1/embed/simple"
            },
            instagram: {
                matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
                type: "image",
                url: "//$1/p/$2/media/?size=l"
            },
            google_maps: {
                matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
                type: "iframe",
                url: function(t) {
                    return "//maps.google." + t[2] + "/?ll=" + (t[9] ? t[9] + "&z=" + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, "&") : "") : t[12]) + "&output=" + (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
                }
            }
        };
    t(document).on("onInit.fb", function(o, i) {
        t.each(i.group, function(o, i) {
            var a, s, r, c, l, u, d, f = i.src || "",
                h = !1;
            i.type || (a = t.extend(!0, {}, n, i.opts.media), t.each(a, function(n, o) {
                if (r = f.match(o.matcher), u = {}, d = n, r) {
                    if (h = o.type, o.paramPlace && r[o.paramPlace]) {
                        l = r[o.paramPlace], "?" == l[0] && (l = l.substring(1)), l = l.split("&");
                        for (var a = 0; a < l.length; ++a) {
                            var p = l[a].split("=", 2);
                            2 == p.length && (u[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")))
                        }
                    }
                    return c = t.extend(!0, {}, o.params, i.opts[n], u), f = "function" === t.type(o.url) ? o.url.call(this, r, c, i) : e(o.url, r, c), s = "function" === t.type(o.thumb) ? o.thumb.call(this, r, c, i) : e(o.thumb, r), "vimeo" === d && (f = f.replace("&%23", "#")), !1
                }
            }), h ? (i.src = f, i.type = h, i.opts.thumb || i.opts.$thumb && i.opts.$thumb.length || (i.opts.thumb = s), "iframe" === h && (t.extend(!0, i.opts, {
                iframe: {
                    preload: !1,
                    attr: {
                        scrolling: "no"
                    }
                }
            }), i.contentProvider = d, i.opts.slideClass += " fancybox-slide--" + ("google_maps" == d ? "map" : "video"))) : i.type = "image")
        })
    })
}(window.jQuery),
function(t, e, n) {
    "use strict";
    var o = function() {
            return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
                return t.setTimeout(e, 1e3 / 60)
            }
        }(),
        i = function() {
            return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function(e) {
                t.clearTimeout(e)
            }
        }(),
        a = function(e) {
            var n = [];
            e = e.originalEvent || e || t.e, e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];
            for (var o in e) e[o].pageX ? n.push({
                x: e[o].pageX,
                y: e[o].pageY
            }) : e[o].clientX && n.push({
                x: e[o].clientX,
                y: e[o].clientY
            });
            return n
        },
        s = function(t, e, n) {
            return e && t ? "x" === n ? t.x - e.x : "y" === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) : 0
        },
        r = function(t) {
            if (t.is("a,button,input,select,textarea") || n.isFunction(t.get(0).onclick)) return !0;
            for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++)
                if ("data-fancybox-" === o[e].nodeName.substr(0, 14)) return !0;
            return !1
        },
        c = function(e) {
            var n = t.getComputedStyle(e)["overflow-y"],
                o = t.getComputedStyle(e)["overflow-x"],
                i = ("scroll" === n || "auto" === n) && e.scrollHeight > e.clientHeight,
                a = ("scroll" === o || "auto" === o) && e.scrollWidth > e.clientWidth;
            return i || a
        },
        l = function(t) {
            for (var e = !1;;) {
                if (e = c(t.get(0))) break;
                if (t = t.parent(), !t.length || t.hasClass("fancybox-stage") || t.is("body")) break
            }
            return e
        },
        u = function(t) {
            var e = this;
            e.instance = t, e.$bg = t.$refs.bg, e.$stage = t.$refs.stage, e.$container = t.$refs.container, e.destroy(), e.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(e, "ontouchstart"))
        };
    u.prototype.destroy = function() {
        this.$container.off(".fb.touch")
    }, u.prototype.ontouchstart = function(o) {
        var i = this,
            c = n(o.target),
            u = i.instance,
            d = u.current,
            f = d.$content,
            h = "touchstart" == o.type;
        if (h && i.$container.off("mousedown.fb.touch"), !d || i.instance.isAnimating || i.instance.isClosing) return o.stopPropagation(), void o.preventDefault();
        if ((!o.originalEvent || 2 != o.originalEvent.button) && c.length && !r(c) && !r(c.parent()) && !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left) && (i.startPoints = a(o), i.startPoints && !(i.startPoints.length > 1 && u.isSliding))) {
            if (i.$target = c, i.$content = f, i.canTap = !0, n(e).off(".fb.touch"), n(e).on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(i, "ontouchend")), n(e).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(i, "ontouchmove")), o.stopPropagation(), !u.current.opts.touch && !u.canPan() || !c.is(i.$stage) && !i.$stage.find(c).length) return void(c.is("img") && o.preventDefault());
            n.fancybox.isMobile && (l(i.$target) || l(i.$target.parent())) || o.preventDefault(), i.canvasWidth = Math.round(d.$slide[0].clientWidth), i.canvasHeight = Math.round(d.$slide[0].clientHeight), i.startTime = (new Date).getTime(), i.distanceX = i.distanceY = i.distance = 0, i.isPanning = !1, i.isSwiping = !1, i.isZooming = !1, i.sliderStartPos = i.sliderLastPos || {
                top: 0,
                left: 0
            }, i.contentStartPos = n.fancybox.getTranslate(i.$content), i.contentLastPos = null, 1 !== i.startPoints.length || i.isZooming || (i.canTap = !u.isSliding, "image" === d.type && (i.contentStartPos.width > i.canvasWidth + 1 || i.contentStartPos.height > i.canvasHeight + 1) ? (n.fancybox.stop(i.$content), i.$content.css("transition-duration", "0ms"), i.isPanning = !0) : i.isSwiping = !0, i.$container.addClass("fancybox-controls--isGrabbing")), 2 !== i.startPoints.length || u.isAnimating || d.hasError || "image" !== d.type || !d.isLoaded && !d.$ghost || (i.isZooming = !0, i.isSwiping = !1, i.isPanning = !1, n.fancybox.stop(i.$content), i.$content.css("transition-duration", "0ms"), i.centerPointStartX = .5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft(), i.centerPointStartY = .5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop(), i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width, i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height, i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1]))
        }
    }, u.prototype.ontouchmove = function(t) {
        var e = this;
        if (e.newPoints = a(t), n.fancybox.isMobile && (l(e.$target) || l(e.$target.parent()))) return t.stopPropagation(), void(e.canTap = !1);
        if ((e.instance.current.opts.touch || e.instance.canPan()) && e.newPoints && e.newPoints.length && (e.distanceX = s(e.newPoints[0], e.startPoints[0], "x"), e.distanceY = s(e.newPoints[0], e.startPoints[0], "y"), e.distance = s(e.newPoints[0], e.startPoints[0]), e.distance > 0)) {
            if (!e.$target.is(e.$stage) && !e.$stage.find(e.$target).length) return;
            t.stopPropagation(), t.preventDefault(), e.isSwiping ? e.onSwipe() : e.isPanning ? e.onPan() : e.isZooming && e.onZoom()
        }
    }, u.prototype.onSwipe = function() {
        var e, a = this,
            s = a.isSwiping,
            r = a.sliderStartPos.left || 0;
        s === !0 ? Math.abs(a.distance) > 10 && (a.canTap = !1, a.instance.group.length < 2 && a.instance.opts.touch.vertical ? a.isSwiping = "y" : a.instance.isSliding || a.instance.opts.touch.vertical === !1 || "auto" === a.instance.opts.touch.vertical && n(t).width() > 800 ? a.isSwiping = "x" : (e = Math.abs(180 * Math.atan2(a.distanceY, a.distanceX) / Math.PI), a.isSwiping = e > 45 && e < 135 ? "y" : "x"), a.instance.isSliding = a.isSwiping, a.startPoints = a.newPoints, n.each(a.instance.slides, function(t, e) {
            n.fancybox.stop(e.$slide), e.$slide.css("transition-duration", "0ms"), e.inTransition = !1, e.pos === a.instance.current.pos && (a.sliderStartPos.left = n.fancybox.getTranslate(e.$slide).left)
        }), a.instance.SlideShow && a.instance.SlideShow.isActive && a.instance.SlideShow.stop()) : ("x" == s && (a.distanceX > 0 && (a.instance.group.length < 2 || 0 === a.instance.current.index && !a.instance.current.opts.loop) ? r += Math.pow(a.distanceX, .8) : a.distanceX < 0 && (a.instance.group.length < 2 || a.instance.current.index === a.instance.group.length - 1 && !a.instance.current.opts.loop) ? r -= Math.pow(-a.distanceX, .8) : r += a.distanceX), a.sliderLastPos = {
            top: "x" == s ? 0 : a.sliderStartPos.top + a.distanceY,
            left: r
        }, a.requestId && (i(a.requestId), a.requestId = null), a.requestId = o(function() {
            a.sliderLastPos && (n.each(a.instance.slides, function(t, e) {
                var o = e.pos - a.instance.currPos;
                n.fancybox.setTranslate(e.$slide, {
                    top: a.sliderLastPos.top,
                    left: a.sliderLastPos.left + o * a.canvasWidth + o * e.opts.gutter
                })
            }), a.$container.addClass("fancybox-is-sliding"))
        }))
    }, u.prototype.onPan = function() {
        var t, e, a, s = this;
        s.canTap = !1, t = s.contentStartPos.width > s.canvasWidth ? s.contentStartPos.left + s.distanceX : s.contentStartPos.left, e = s.contentStartPos.top + s.distanceY, a = s.limitMovement(t, e, s.contentStartPos.width, s.contentStartPos.height), a.scaleX = s.contentStartPos.scaleX, a.scaleY = s.contentStartPos.scaleY, s.contentLastPos = a, s.requestId && (i(s.requestId), s.requestId = null), s.requestId = o(function() {
            n.fancybox.setTranslate(s.$content, s.contentLastPos)
        })
    }, u.prototype.limitMovement = function(t, e, n, o) {
        var i, a, s, r, c = this,
            l = c.canvasWidth,
            u = c.canvasHeight,
            d = c.contentStartPos.left,
            f = c.contentStartPos.top,
            h = c.distanceX,
            p = c.distanceY;
        return i = Math.max(0, .5 * l - .5 * n), a = Math.max(0, .5 * u - .5 * o), s = Math.min(l - n, .5 * l - .5 * n), r = Math.min(u - o, .5 * u - .5 * o), n > l && (h > 0 && t > i && (t = i - 1 + Math.pow(-i + d + h, .8) || 0), h < 0 && t < s && (t = s + 1 - Math.pow(s - d - h, .8) || 0)), o > u && (p > 0 && e > a && (e = a - 1 + Math.pow(-a + f + p, .8) || 0), p < 0 && e < r && (e = r + 1 - Math.pow(r - f - p, .8) || 0)), {
            top: e,
            left: t
        }
    }, u.prototype.limitPosition = function(t, e, n, o) {
        var i = this,
            a = i.canvasWidth,
            s = i.canvasHeight;
        return n > a ? (t = t > 0 ? 0 : t, t = t < a - n ? a - n : t) : t = Math.max(0, a / 2 - n / 2), o > s ? (e = e > 0 ? 0 : e, e = e < s - o ? s - o : e) : e = Math.max(0, s / 2 - o / 2), {
            top: e,
            left: t
        }
    }, u.prototype.onZoom = function() {
        var e = this,
            a = e.contentStartPos.width,
            r = e.contentStartPos.height,
            c = e.contentStartPos.left,
            l = e.contentStartPos.top,
            u = s(e.newPoints[0], e.newPoints[1]),
            d = u / e.startDistanceBetweenFingers,
            f = Math.floor(a * d),
            h = Math.floor(r * d),
            p = (a - f) * e.percentageOfImageAtPinchPointX,
            g = (r - h) * e.percentageOfImageAtPinchPointY,
            b = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(),
            m = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(),
            y = b - e.centerPointStartX,
            v = m - e.centerPointStartY,
            x = c + (p + y),
            w = l + (g + v),
            $ = {
                top: w,
                left: x,
                scaleX: e.contentStartPos.scaleX * d,
                scaleY: e.contentStartPos.scaleY * d
            };
        e.canTap = !1, e.newWidth = f, e.newHeight = h, e.contentLastPos = $, e.requestId && (i(e.requestId), e.requestId = null), e.requestId = o(function() {
            n.fancybox.setTranslate(e.$content, e.contentLastPos)
        })
    }, u.prototype.ontouchend = function(t) {
        var o = this,
            s = Math.max((new Date).getTime() - o.startTime, 1),
            r = o.isSwiping,
            c = o.isPanning,
            l = o.isZooming;
        return o.endPoints = a(t), o.$container.removeClass("fancybox-controls--isGrabbing"), n(e).off(".fb.touch"), o.requestId && (i(o.requestId), o.requestId = null), o.isSwiping = !1, o.isPanning = !1, o.isZooming = !1, o.canTap ? o.onTap(t) : (o.speed = 366, o.velocityX = o.distanceX / s * .5, o.velocityY = o.distanceY / s * .5, o.speedX = Math.max(.5 * o.speed, Math.min(1.5 * o.speed, 1 / Math.abs(o.velocityX) * o.speed)), void(c ? o.endPanning() : l ? o.endZooming() : o.endSwiping(r)))
    }, u.prototype.endSwiping = function(t) {
        var e = this,
            o = !1;
        e.instance.isSliding = !1, e.sliderLastPos = null, "y" == t && Math.abs(e.distanceY) > 50 ? (n.fancybox.animate(e.instance.current.$slide, {
            top: e.sliderStartPos.top + e.distanceY + 150 * e.velocityY,
            opacity: 0
        }, 150), o = e.instance.close(!0, 300)) : "x" == t && e.distanceX > 50 && e.instance.group.length > 1 ? o = e.instance.previous(e.speedX) : "x" == t && e.distanceX < -50 && e.instance.group.length > 1 && (o = e.instance.next(e.speedX)), o !== !1 || "x" != t && "y" != t || e.instance.jumpTo(e.instance.current.index, 150), e.$container.removeClass("fancybox-is-sliding")
    }, u.prototype.endPanning = function() {
        var t, e, o, i = this;
        i.contentLastPos && (i.instance.current.opts.touch.momentum === !1 ? (t = i.contentLastPos.left, e = i.contentLastPos.top) : (t = i.contentLastPos.left + i.velocityX * i.speed, e = i.contentLastPos.top + i.velocityY * i.speed), o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height), o.width = i.contentStartPos.width, o.height = i.contentStartPos.height, n.fancybox.animate(i.$content, o, 330))
    }, u.prototype.endZooming = function() {
        var t, e, o, i, a = this,
            s = a.instance.current,
            r = a.newWidth,
            c = a.newHeight;
        a.contentLastPos && (t = a.contentLastPos.left, e = a.contentLastPos.top, i = {
            top: e,
            left: t,
            width: r,
            height: c,
            scaleX: 1,
            scaleY: 1
        }, n.fancybox.setTranslate(a.$content, i), r < a.canvasWidth && c < a.canvasHeight ? a.instance.scaleToFit(150) : r > s.width || c > s.height ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150) : (o = a.limitPosition(t, e, r, c), n.fancybox.setTranslate(a.content, n.fancybox.getTranslate(a.$content)), n.fancybox.animate(a.$content, o, 150)))
    }, u.prototype.onTap = function(t) {
        var e, o = this,
            i = n(t.target),
            s = o.instance,
            r = s.current,
            c = t && a(t) || o.startPoints,
            l = c[0] ? c[0].x - o.$stage.offset().left : 0,
            u = c[0] ? c[0].y - o.$stage.offset().top : 0,
            d = function(e) {
                var i = r.opts[e];
                if (n.isFunction(i) && (i = i.apply(s, [r, t])), i) switch (i) {
                    case "close":
                        s.close(o.startEvent);
                        break;
                    case "toggleControls":
                        s.toggleControls(!0);
                        break;
                    case "next":
                        s.next();
                        break;
                    case "nextOrClose":
                        s.group.length > 1 ? s.next() : s.close(o.startEvent);
                        break;
                    case "zoom":
                        "image" == r.type && (r.isLoaded || r.$ghost) && (s.canPan() ? s.scaleToFit() : s.isScaledDown() ? s.scaleToActual(l, u) : s.group.length < 2 && s.close(o.startEvent))
                }
            };
        if (!(t.originalEvent && 2 == t.originalEvent.button || s.isSliding || l > i[0].clientWidth + i.offset().left)) {
            if (i.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) e = "Outside";
            else if (i.is(".fancybox-slide")) e = "Slide";
            else {
                if (!s.current.$content || !s.current.$content.has(t.target).length) return;
                e = "Content"
            }
            if (o.tapped) {
                if (clearTimeout(o.tapped), o.tapped = null, Math.abs(l - o.tapX) > 50 || Math.abs(u - o.tapY) > 50 || s.isSliding) return this;
                d("dblclick" + e)
            } else o.tapX = l, o.tapY = u, r.opts["dblclick" + e] && r.opts["dblclick" + e] !== r.opts["click" + e] ? o.tapped = setTimeout(function() {
                o.tapped = null, d("click" + e)
            }, 300) : d("click" + e);
            return this
        }
    }, n(e).on("onActivate.fb", function(t, e) {
        e && !e.Guestures && (e.Guestures = new u(e))
    }), n(e).on("beforeClose.fb", function(t, e) {
        e && e.Guestures && e.Guestures.destroy()
    })
}(window, document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function(t) {
        this.instance = t, this.init()
    };
    e.extend(n.prototype, {
        timer: null,
        isActive: !1,
        $button: null,
        speed: 3e3,
        init: function() {
            var t = this;
            t.$button = t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click", function() {
                t.toggle()
            }), (t.instance.group.length < 2 || !t.instance.group[t.instance.currIndex].opts.slideShow) && t.$button.hide()
        },
        set: function() {
            var t = this;
            t.instance && t.instance.current && (t.instance.current.opts.loop || t.instance.currIndex < t.instance.group.length - 1) ? t.timer = setTimeout(function() {
                t.instance.next()
            }, t.instance.current.opts.slideShow.speed || t.speed) : (t.stop(), t.instance.idleSecondsCounter = 0, t.instance.showControls())
        },
        clear: function() {
            var t = this;
            clearTimeout(t.timer), t.timer = null
        },
        start: function() {
            var t = this,
                e = t.instance.current;
            t.instance && e && (e.opts.loop || e.index < t.instance.group.length - 1) && (t.isActive = !0, t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_STOP).addClass("fancybox-button--pause"), e.isComplete && t.set())
        },
        stop: function() {
            var t = this,
                e = t.instance.current;
            t.clear(), t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause"), t.isActive = !1
        },
        toggle: function() {
            var t = this;
            t.isActive ? t.stop() : t.start()
        }
    }), e(t).on({
        "onInit.fb": function(t, e) {
            e && !e.SlideShow && (e.SlideShow = new n(e))
        },
        "beforeShow.fb": function(t, e, n, o) {
            var i = e && e.SlideShow;
            o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear()
        },
        "afterShow.fb": function(t, e, n) {
            var o = e && e.SlideShow;
            o && o.isActive && o.set()
        },
        "afterKeydown.fb": function(n, o, i, a, s) {
            var r = o && o.SlideShow;
            !r || !i.opts.slideShow || 80 !== s && 32 !== s || e(t.activeElement).is("button,a,input") || (a.preventDefault(), r.toggle())
        },
        "beforeClose.fb onDeactivate.fb": function(t, e) {
            var n = e && e.SlideShow;
            n && n.stop()
        }
    }), e(t).on("visibilitychange", function() {
        var n = e.fancybox.getInstance(),
            o = n && n.SlideShow;
        o && o.isActive && (t.hidden ? o.clear() : o.set())
    })
}(document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function() {
        var e, n, o, i = [
                ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
            ],
            a = {};
        for (n = 0; n < i.length; n++)
            if (e = i[n], e && e[1] in t) {
                for (o = 0; o < e.length; o++) a[i[0][o]] = e[o];
                return a
            }
        return !1
    }();
    if (!n) return void(e.fancybox.defaults.btnTpl.fullScreen = !1);
    var o = {
        request: function(e) {
            e = e || t.documentElement, e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)
        },
        exit: function() {
            t[n.exitFullscreen]()
        },
        toggle: function(e) {
            e = e || t.documentElement, this.isFullscreen() ? this.exit() : this.request(e)
        },
        isFullscreen: function() {
            return Boolean(t[n.fullscreenElement])
        },
        enabled: function() {
            return Boolean(t[n.fullscreenEnabled])
        }
    };
    e(t).on({
        "onInit.fb": function(t, e) {
            var n, i = e.$refs.toolbar.find("[data-fancybox-fullscreen]");
            e && !e.FullScreen && e.group[e.currIndex].opts.fullScreen ? (n = e.$refs.container, n.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function(t) {
                t.stopPropagation(), t.preventDefault(), o.toggle(n[0])
            }), e.opts.fullScreen && e.opts.fullScreen.autoStart === !0 && o.request(n[0]), e.FullScreen = o) : i.hide()
        },
        "afterKeydown.fb": function(t, e, n, o, i) {
            e && e.FullScreen && 70 === i && (o.preventDefault(), e.FullScreen.toggle(e.$refs.container[0]))
        },
        "beforeClose.fb": function(t) {
            t && t.FullScreen && o.exit()
        }
    }), e(t).on(n.fullscreenchange, function() {
        var t = e.fancybox.getInstance();
        t.current && "image" === t.current.type && t.isAnimating && (t.current.$content.css("transition", "none"), t.isAnimating = !1, t.update(!0, !0, 0))
    })
}(document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function(t) {
        this.instance = t, this.init()
    };
    e.extend(n.prototype, {
        $button: null,
        $grid: null,
        $list: null,
        isVisible: !1,
        init: function() {
            var t = this,
                e = t.instance.group[0],
                n = t.instance.group[1];
            t.$button = t.instance.$refs.toolbar.find("[data-fancybox-thumbs]"), t.instance.group.length > 1 && t.instance.group[t.instance.currIndex].opts.thumbs && ("image" == e.type || e.opts.thumb || e.opts.$thumb) && ("image" == n.type || n.opts.thumb || n.opts.$thumb) ? (t.$button.on("click", function() {
                t.toggle()
            }), t.isActive = !0) : (t.$button.hide(), t.isActive = !1)
        },
        create: function() {
            var t, n, o = this.instance;
            this.$grid = e('<div class="fancybox-thumbs"></div>').appendTo(o.$refs.container), t = "<ul>", e.each(o.group, function(e, o) {
                n = o.opts.thumb || (o.opts.$thumb ? o.opts.$thumb.attr("src") : null), n || "image" !== o.type || (n = o.src), n && n.length && (t += '<li data-index="' + e + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + n + '" /></li>')
            }), t += "</ul>", this.$list = e(t).appendTo(this.$grid).on("click", "li", function() {
                o.jumpTo(e(this).data("index"))
            }), this.$list.find("img").hide().one("load", function() {
                var t, n, o, i, a = e(this).parent().removeClass("fancybox-thumbs-loading"),
                    s = a.outerWidth(),
                    r = a.outerHeight();
                t = this.naturalWidth || this.width, n = this.naturalHeight || this.height, o = t / s, i = n / r, o >= 1 && i >= 1 && (o > i ? (t /= i, n = r) : (t = s, n /= o)), e(this).css({
                    width: Math.floor(t),
                    height: Math.floor(n),
                    "margin-top": Math.min(0, Math.floor(.3 * r - .3 * n)),
                    "margin-left": Math.min(0, Math.floor(.5 * s - .5 * t))
                }).show()
            }).each(function() {
                this.src = e(this).data("src")
            })
        },
        focus: function() {
            this.instance.current && this.$list.children().removeClass("fancybox-thumbs-active").filter('[data-index="' + this.instance.current.index + '"]').addClass("fancybox-thumbs-active").focus()
        },
        close: function() {
            this.$grid.hide()
        },
        update: function() {
            this.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible), this.isVisible ? (this.$grid || this.create(), this.instance.trigger("onThumbsShow"), this.focus()) : this.$grid && this.instance.trigger("onThumbsHide"), this.instance.update()
        },
        hide: function() {
            this.isVisible = !1, this.update()
        },
        show: function() {
            this.isVisible = !0, this.update()
        },
        toggle: function() {
            this.isVisible = !this.isVisible, this.update()
        }
    }), e(t).on({
        "onInit.fb": function(t, e) {
            e && !e.Thumbs && (e.Thumbs = new n(e))
        },
        "beforeShow.fb": function(t, e, n, o) {
            var i = e && e.Thumbs;
            if (i && i.isActive) {
                if (n.modal) return i.$button.hide(), void i.hide();
                o && e.opts.thumbs.autoStart === !0 && i.show(), i.isVisible && i.focus()
            }
        },
        "afterKeydown.fb": function(t, e, n, o, i) {
            var a = e && e.Thumbs;
            a && a.isActive && 71 === i && (o.preventDefault(), a.toggle())
        },
        "beforeClose.fb": function(t, e) {
            var n = e && e.Thumbs;
            n && n.isVisible && e.opts.thumbs.hideOnClose !== !1 && n.close()
        }
    })
}(document, window.jQuery),
function(t, e, n) {
    "use strict";

    function o() {
        var t = e.location.hash.substr(1),
            n = t.split("-"),
            o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1,
            i = n.join("-");
        return o < 1 && (o = 1), {
            hash: t,
            index: o,
            gallery: i
        }
    }

    function i(t) {
        var e;
        "" !== t.gallery && (e = n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1), e.length ? e.trigger("click") : n("#" + n.escapeSelector(t.gallery)).trigger("click"))
    }

    function a(t) {
        var e;
        return !!t && (e = t.current ? t.current.opts : t.opts, e.$orig ? e.$orig.data("fancybox") : e.hash || "")
    }
    n.escapeSelector || (n.escapeSelector = function(t) {
        var e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
            n = function(t, e) {
                return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t
            };
        return (t + "").replace(e, n)
    });
    var s = null,
        r = null;
    n(function() {
        setTimeout(function() {
            n.fancybox.defaults.hash !== !1 && (n(t).on({
                "onInit.fb": function(t, e) {
                    var n, i;
                    e.group[e.currIndex].opts.hash !== !1 && (n = o(), i = a(e), i && n.gallery && i == n.gallery && (e.currIndex = n.index - 1))
                },
                "beforeShow.fb": function(n, o, i, c) {
                    var l;
                    i.opts.hash !== !1 && (l = a(o), l && "" !== l && (e.location.hash.indexOf(l) < 0 && (o.opts.origHash = e.location.hash), s = l + (o.group.length > 1 ? "-" + (i.index + 1) : ""), "replaceState" in e.history ? (r && clearTimeout(r), r = setTimeout(function() {
                        e.history[c ? "pushState" : "replaceState"]({}, t.title, e.location.pathname + e.location.search + "#" + s), r = null
                    }, 300)) : e.location.hash = s))
                },
                "beforeClose.fb": function(o, i, c) {
                    var l, u;
                    r && clearTimeout(r), c.opts.hash !== !1 && (l = a(i), u = i && i.opts.origHash ? i.opts.origHash : "", l && "" !== l && ("replaceState" in history ? e.history.replaceState({}, t.title, e.location.pathname + e.location.search + u) : (e.location.hash = u, n(e).scrollTop(i.scrollTop).scrollLeft(i.scrollLeft))), s = null)
                }
            }), n(e).on("hashchange.fb", function() {
                var t = o();
                n.fancybox.getInstance() ? !s || s === t.gallery + "-" + t.index || 1 === t.index && s == t.gallery || (s = null, n.fancybox.close()) : "" !== t.gallery && i(t)
            }), n(e).one("unload.fb popstate.fb", function() {
                n.fancybox.getInstance("close", !0, 0)
            }), i(o()))
        }, 50)
    })
}(document, window, window.jQuery);;
(function($) {
    $.fn.initGalleryFancybox = function() {
        $('a.fancy-gallery', this).fancybox({
            caption: function(instance, item) {
                var slideInfo = $('.slide-info', this);
                if ($('> *', slideInfo).length) {
                    return slideInfo.clone().html();
                }
            },
            onInit: function(instance) {
                instance.$refs.caption.addClass('fancybox-title');
                instance.$refs.caption.parent().addClass('slideinfo');
            }
        });
    };
    $.fn.initPortfolioFancybox = function() {
        $('a.fancy, .fancy-link-inner a', this).fancybox();
        $('.portfolio-item a.vimeo, .portfolio-item a.youtube', this).fancybox({
            type: 'iframe'
        });
        $('.portfolio-item a.self_video', this).fancybox({
            iframe: {
                preload: false
            },
            type: 'video',
            afterShow: function(instance, current) {
                current.$slide.addClass('thegem-fancybox-video');
                var $video = $('<div id="fancybox-video"><video width="100%" height="100%" autoplay="autoplay" controls="controls" src="' + current.opts.$orig.attr('href') + '" preload="none"></video></div>');
                current.$content.html($video);
                $('video', $video).mediaelementplayer();
            }
        });
    };
    $.fn.initBlogFancybox = function() {
        $('a.fancy, .fancy-link-inner a', this).fancybox();
        $('.blog article a.youtube, .blog article a.vimeo', this).fancybox({
            type: 'iframe'
        });
    };
    $(document).initGalleryFancybox();
    $(document).initPortfolioFancybox();
    $(document).initBlogFancybox();
    $('a.fancy, .fancy-link-inner a').fancybox();
})(jQuery);;
(function($) {
    $(function() {
        $('body').updateAccordions();
    });
    $.fn.updateAccordions = function() {
        $('.gem_accordion', this).each(function(index) {
            var $accordion = $(this);
            $accordion.thegemPreloader(function() {
                var $tabs, interval = $accordion.attr("data-interval"),
                    active_tab = !isNaN($accordion.data('active-tab')) && parseInt($accordion.data('active-tab')) > 0 ? parseInt($accordion.data('active-tab')) - 1 : false,
                    collapsible = $accordion.data('collapsible') === 'yes';
                $tabs = $accordion.find('.gem_accordion_wrapper').accordion({
                    header: "> div > .gem_accordion_header",
                    autoHeight: false,
                    heightStyle: "content",
                    active: active_tab,
                    collapsible: collapsible,
                    navigation: true,
                    activate: function(event, ui) {
                        if (ui.newPanel.size() > 0) {
                            ui.newPanel.trigger('accordion-update');
                        }
                    },
                    beforeActivate: function(event, ui) {
                        if (ui.newPanel.size() > 0) {
                            $("html, body").animate({
                                scrollTop: ui.newPanel.closest('.gem_accordion').offset().top - 200
                            }, 300);
                        }
                    }
                });
            });
        });
    }
})(jQuery);;
(function($) {
    'use strict';
    if (typeof wpcf7 === 'undefined' || wpcf7 === null) {
        return;
    }
    wpcf7 = $.extend({
        cached: 0,
        inputs: []
    }, wpcf7);
    $(function() {
        wpcf7.supportHtml5 = (function() {
            var features = {};
            var input = document.createElement('input');
            features.placeholder = 'placeholder' in input;
            var inputTypes = ['email', 'url', 'tel', 'number', 'range', 'date'];
            $.each(inputTypes, function(index, value) {
                input.setAttribute('type', value);
                features[value] = input.type !== 'text';
            });
            return features;
        })();
        $('div.wpcf7 > form').each(function() {
            var $form = $(this);
            wpcf7.initForm($form);
            if (wpcf7.cached) {
                wpcf7.refill($form);
            }
        });
    });
    wpcf7.getId = function(form) {
        return parseInt($('input[name="_wpcf7"]', form).val(), 10);
    };
    wpcf7.initForm = function(form) {
        var $form = $(form);
        $form.submit(function(event) {
            if (typeof window.FormData !== 'function') {
                return;
            }
            wpcf7.submit($form);
            event.preventDefault();
        });
        $('.wpcf7-submit', $form).after('<span class="ajax-loader"></span>');
        wpcf7.toggleSubmit($form);
        $form.on('click', '.wpcf7-acceptance', function() {
            wpcf7.toggleSubmit($form);
        });
        $('.wpcf7-exclusive-checkbox', $form).on('click', 'input:checkbox', function() {
            var name = $(this).attr('name');
            $form.find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false);
        });
        $('.wpcf7-list-item.has-free-text', $form).each(function() {
            var $freetext = $(':input.wpcf7-free-text', this);
            var $wrap = $(this).closest('.wpcf7-form-control');
            if ($(':checkbox, :radio', this).is(':checked')) {
                $freetext.prop('disabled', false);
            } else {
                $freetext.prop('disabled', true);
            }
            $wrap.on('change', ':checkbox, :radio', function() {
                var $cb = $('.has-free-text', $wrap).find(':checkbox, :radio');
                if ($cb.is(':checked')) {
                    $freetext.prop('disabled', false).focus();
                } else {
                    $freetext.prop('disabled', true);
                }
            });
        });
        if (!wpcf7.supportHtml5.placeholder) {
            $('[placeholder]', $form).each(function() {
                $(this).val($(this).attr('placeholder'));
                $(this).addClass('placeheld');
                $(this).focus(function() {
                    if ($(this).hasClass('placeheld')) {
                        $(this).val('').removeClass('placeheld');
                    }
                });
                $(this).blur(function() {
                    if ('' === $(this).val()) {
                        $(this).val($(this).attr('placeholder'));
                        $(this).addClass('placeheld');
                    }
                });
            });
        }
        if (wpcf7.jqueryUi && !wpcf7.supportHtml5.date) {
            $form.find('input.wpcf7-date[type="date"]').each(function() {
                $(this).datepicker({
                    dateFormat: 'yy-mm-dd',
                    minDate: new Date($(this).attr('min')),
                    maxDate: new Date($(this).attr('max'))
                });
            });
        }
        if (wpcf7.jqueryUi && !wpcf7.supportHtml5.number) {
            $form.find('input.wpcf7-number[type="number"]').each(function() {
                $(this).spinner({
                    min: $(this).attr('min'),
                    max: $(this).attr('max'),
                    step: $(this).attr('step')
                });
            });
        }
        $('.wpcf7-character-count', $form).each(function() {
            var $count = $(this);
            var name = $count.attr('data-target-name');
            var down = $count.hasClass('down');
            var starting = parseInt($count.attr('data-starting-value'), 10);
            var maximum = parseInt($count.attr('data-maximum-value'), 10);
            var minimum = parseInt($count.attr('data-minimum-value'), 10);
            var updateCount = function(target) {
                var $target = $(target);
                var length = $target.val().length;
                var count = down ? starting - length : length;
                $count.attr('data-current-value', count);
                $count.text(count);
                if (maximum && maximum < length) {
                    $count.addClass('too-long');
                } else {
                    $count.removeClass('too-long');
                }
                if (minimum && length < minimum) {
                    $count.addClass('too-short');
                } else {
                    $count.removeClass('too-short');
                }
            };
            $(':input[name="' + name + '"]', $form).each(function() {
                updateCount(this);
                $(this).keyup(function() {
                    updateCount(this);
                });
            });
        });
        $form.on('change', '.wpcf7-validates-as-url', function() {
            var val = $.trim($(this).val());
            if (val && !val.match(/^[a-z][a-z0-9.+-]*:/i) && -1 !== val.indexOf('.')) {
                val = val.replace(/^\/+/, '');
                val = 'http://' + val;
            }
            $(this).val(val);
        });
    };
    wpcf7.submit = function(form) {
        if (typeof window.FormData !== 'function') {
            return;
        }
        var $form = $(form);
        $('.ajax-loader', $form).addClass('is-active');
        $('[placeholder].placeheld', $form).each(function(i, n) {
            $(n).val('');
        });
        wpcf7.clearResponse($form);
        var formData = new FormData($form.get(0));
        var detail = {
            id: $form.closest('div.wpcf7').attr('id'),
            status: 'init',
            inputs: [],
            formData: formData
        };
        $.each($form.serializeArray(), function(i, field) {
            if ('_wpcf7' == field.name) {
                detail.contactFormId = field.value;
            } else if ('_wpcf7_version' == field.name) {
                detail.pluginVersion = field.value;
            } else if ('_wpcf7_locale' == field.name) {
                detail.contactFormLocale = field.value;
            } else if ('_wpcf7_unit_tag' == field.name) {
                detail.unitTag = field.value;
            } else if ('_wpcf7_container_post' == field.name) {
                detail.containerPostId = field.value;
            } else if (field.name.match(/^_wpcf7_\w+_free_text_/)) {
                var owner = field.name.replace(/^_wpcf7_\w+_free_text_/, '');
                detail.inputs.push({
                    name: owner + '-free-text',
                    value: field.value
                });
            } else if (field.name.match(/^_/)) {} else {
                detail.inputs.push(field);
            }
        });
        wpcf7.triggerEvent($form.closest('div.wpcf7'), 'beforesubmit', detail);
        var ajaxSuccess = function(data, status, xhr, $form) {
            detail.id = $(data.into).attr('id');
            detail.status = data.status;
            var $message = $('.wpcf7-response-output', $form);
            switch (data.status) {
                case 'validation_failed':
                    $.each(data.invalidFields, function(i, n) {
                        $(n.into, $form).each(function() {
                            wpcf7.notValidTip(this, n.message);
                            $('.wpcf7-form-control', this).addClass('wpcf7-not-valid');
                            $('[aria-invalid]', this).attr('aria-invalid', 'true');
                        });
                    });
                    $message.addClass('wpcf7-validation-errors');
                    $form.addClass('invalid');
                    wpcf7.triggerEvent(data.into, 'invalid', detail);
                    break;
                case 'spam':
                    $message.addClass('wpcf7-spam-blocked');
                    $form.addClass('spam');
                    $('[name="g-recaptcha-response"]', $form).each(function() {
                        if ('' === $(this).val()) {
                            var $recaptcha = $(this).closest('.wpcf7-form-control-wrap');
                            wpcf7.notValidTip($recaptcha, wpcf7.recaptcha.messages.empty);
                        }
                    });
                    wpcf7.triggerEvent(data.into, 'spam', detail);
                    break;
                case 'mail_sent':
                    $message.addClass('wpcf7-mail-sent-ok');
                    $form.addClass('sent');
                    if (data.onSentOk) {
                        $.each(data.onSentOk, function(i, n) {
                            eval(n)
                        });
                    }
                    wpcf7.triggerEvent(data.into, 'mailsent', detail);
                    break;
                case 'mail_failed':
                case 'acceptance_missing':
                default:
                    $message.addClass('wpcf7-mail-sent-ng');
                    $form.addClass('failed');
                    wpcf7.triggerEvent(data.into, 'mailfailed', detail);
            }
            wpcf7.refill($form, data);
            if (data.onSubmit) {
                $.each(data.onSubmit, function(i, n) {
                    eval(n)
                });
            }
            wpcf7.triggerEvent(data.into, 'submit', detail);
            if ('mail_sent' == data.status) {
                $form.each(function() {
                    this.reset();
                });
            }
            $form.find('[placeholder].placeheld').each(function(i, n) {
                $(n).val($(n).attr('placeholder'));
            });
            $message.html('').append(data.message).slideDown('fast');
            $message.attr('role', 'alert');
            $('.screen-reader-response', $form.closest('.wpcf7')).each(function() {
                var $response = $(this);
                $response.html('').attr('role', '').append(data.message);
                if (data.invalidFields) {
                    var $invalids = $('<ul></ul>');
                    $.each(data.invalidFields, function(i, n) {
                        if (n.idref) {
                            var $li = $('<li></li>').append($('<a></a>').attr('href', '#' + n.idref).append(n.message));
                        } else {
                            var $li = $('<li></li>').append(n.message);
                        }
                        $invalids.append($li);
                    });
                    $response.append($invalids);
                }
                $response.attr('role', 'alert').focus();
            });
        };
        $.ajax({
            type: 'POST',
            url: wpcf7.apiSettings.getRoute('/contact-forms/' + wpcf7.getId($form) + '/feedback'),
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false
        }).done(function(data, status, xhr) {
            ajaxSuccess(data, status, xhr, $form);
            $('.ajax-loader', $form).removeClass('is-active');
        }).fail(function(xhr, status, error) {
            var $e = $('<div class="ajax-error"></div>').text(error.message);
            $form.after($e);
        });
    };
    wpcf7.triggerEvent = function(target, name, detail) {
        var $target = $(target);
        var event = new CustomEvent('wpcf7' + name, {
            bubbles: true,
            detail: detail
        });
        $target.get(0).dispatchEvent(event);
        $target.trigger('wpcf7:' + name, detail);
        $target.trigger(name + '.wpcf7', detail);
    };
    wpcf7.toggleSubmit = function(form, state) {
        var $form = $(form);
        var $submit = $('input:submit', $form);
        if (typeof state !== 'undefined') {
            $submit.prop('disabled', !state);
            return;
        }
        if ($form.hasClass('wpcf7-acceptance-as-validation')) {
            return;
        }
        $submit.prop('disabled', false);
        $('input:checkbox.wpcf7-acceptance', $form).each(function() {
            var $a = $(this);
            if ($a.hasClass('wpcf7-invert') && $a.is(':checked') || !$a.hasClass('wpcf7-invert') && !$a.is(':checked')) {
                $submit.prop('disabled', true);
                return false;
            }
        });
    };
    wpcf7.notValidTip = function(target, message) {
        var $target = $(target);
        $('.wpcf7-not-valid-tip', $target).remove();
        $('<span role="alert" class="wpcf7-not-valid-tip"></span>').text(message).appendTo($target);
        if ($target.is('.use-floating-validation-tip *')) {
            var fadeOut = function(target) {
                $(target).not(':hidden').animate({
                    opacity: 0
                }, 'fast', function() {
                    $(this).css({
                        'z-index': -100
                    });
                });
            };
            $target.on('mouseover', '.wpcf7-not-valid-tip', function() {
                fadeOut(this);
            });
            $target.on('focus', ':input', function() {
                fadeOut($('.wpcf7-not-valid-tip', $target));
            });
        }
    };
    wpcf7.refill = function(form, data) {
        var $form = $(form);
        var refillCaptcha = function($form, items) {
            $.each(items, function(i, n) {
                $form.find(':input[name="' + i + '"]').val('');
                $form.find('img.wpcf7-captcha-' + i).attr('src', n);
                var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
                $form.find('input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]').attr('value', match[1]);
            });
        };
        var refillQuiz = function($form, items) {
            $.each(items, function(i, n) {
                $form.find(':input[name="' + i + '"]').val('');
                $form.find(':input[name="' + i + '"]').siblings('span.wpcf7-quiz-label').text(n[0]);
                $form.find('input:hidden[name="_wpcf7_quiz_answer_' + i + '"]').attr('value', n[1]);
            });
        };
        if (typeof data === 'undefined') {
            $.ajax({
                type: 'GET',
                url: wpcf7.apiSettings.getRoute('/contact-forms/' + wpcf7.getId($form) + '/refill'),
                dataType: 'json'
            }).done(function(data, status, xhr) {
                if (data.captcha) {
                    refillCaptcha($form, data.captcha);
                }
                if (data.quiz) {
                    refillQuiz($form, data.quiz);
                }
            });
        } else {
            if (data.captcha) {
                refillCaptcha($form, data.captcha);
            }
            if (data.quiz) {
                refillQuiz($form, data.quiz);
            }
        }
    };
    wpcf7.clearResponse = function(form) {
        var $form = $(form);
        $form.removeClass('invalid spam sent failed');
        $form.siblings('.screen-reader-response').html('').attr('role', '');
        $('.wpcf7-not-valid-tip', $form).remove();
        $('[aria-invalid]', $form).attr('aria-invalid', 'false');
        $('.wpcf7-form-control', $form).removeClass('wpcf7-not-valid');
        $('.wpcf7-response-output', $form).hide().empty().removeAttr('role').removeClass('wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked');
    };
    wpcf7.apiSettings.getRoute = function(path) {
        var url = wpcf7.apiSettings.root;
        url = url.replace(wpcf7.apiSettings.namespace, wpcf7.apiSettings.namespace + path);
        return url;
    };
})(jQuery);
(function() {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();;
/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */
! function() {
    "use strict";

    function e(e) {
        function t(t, n) {
            var s, h, k = t == window,
                y = n && n.message !== undefined ? n.message : undefined;
            if (!(n = e.extend({}, e.blockUI.defaults, n || {})).ignoreIfBlocked || !e(t).data("blockUI.isBlocked")) {
                if (n.overlayCSS = e.extend({}, e.blockUI.defaults.overlayCSS, n.overlayCSS || {}), s = e.extend({}, e.blockUI.defaults.css, n.css || {}), n.onOverlayClick && (n.overlayCSS.cursor = "pointer"), h = e.extend({}, e.blockUI.defaults.themedCSS, n.themedCSS || {}), y = y === undefined ? n.message : y, k && p && o(window, {
                        fadeOut: 0
                    }), y && "string" != typeof y && (y.parentNode || y.jquery)) {
                    var m = y.jquery ? y[0] : y,
                        g = {};
                    e(t).data("blockUI.history", g), g.el = m, g.parent = m.parentNode, g.display = m.style.display, g.position = m.style.position, g.parent && g.parent.removeChild(m)
                }
                e(t).data("blockUI.onUnblock", n.onUnblock);
                var v, I, w, U, x = n.baseZ;
                v = e(r || n.forceIframe ? '<iframe class="blockUI" style="z-index:' + x++ + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + n.iframeSrc + '"></iframe>' : '<div class="blockUI" style="display:none"></div>'), I = e(n.theme ? '<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + x++ + ';display:none"></div>' : '<div class="blockUI blockOverlay" style="z-index:' + x++ + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'), n.theme && k ? (U = '<div class="blockUI ' + n.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (x + 10) + ';display:none;position:fixed">', n.title && (U += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (n.title || "&nbsp;") + "</div>"), U += '<div class="ui-widget-content ui-dialog-content"></div>', U += "</div>") : n.theme ? (U = '<div class="blockUI ' + n.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (x + 10) + ';display:none;position:absolute">', n.title && (U += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (n.title || "&nbsp;") + "</div>"), U += '<div class="ui-widget-content ui-dialog-content"></div>', U += "</div>") : U = k ? '<div class="blockUI ' + n.blockMsgClass + ' blockPage" style="z-index:' + (x + 10) + ';display:none;position:fixed"></div>' : '<div class="blockUI ' + n.blockMsgClass + ' blockElement" style="z-index:' + (x + 10) + ';display:none;position:absolute"></div>', w = e(U), y && (n.theme ? (w.css(h), w.addClass("ui-widget-content")) : w.css(s)), n.theme || I.css(n.overlayCSS), I.css("position", k ? "fixed" : "absolute"), (r || n.forceIframe) && v.css("opacity", 0);
                var C = [v, I, w],
                    S = e(k ? "body" : t);
                e.each(C, function() {
                    this.appendTo(S)
                }), n.theme && n.draggable && e.fn.draggable && w.draggable({
                    handle: ".ui-dialog-titlebar",
                    cancel: "li"
                });
                var O = f && (!e.support.boxModel || e("object,embed", k ? null : t).length > 0);
                if (u || O) {
                    if (k && n.allowBodyStretch && e.support.boxModel && e("html,body").css("height", "100%"), (u || !e.support.boxModel) && !k) var E = a(t, "borderTopWidth"),
                        T = a(t, "borderLeftWidth"),
                        M = E ? "(0 - " + E + ")" : 0,
                        B = T ? "(0 - " + T + ")" : 0;
                    e.each(C, function(e, t) {
                        var o = t[0].style;
                        if (o.position = "absolute", e < 2) k ? o.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" + n.quirksmodeOffsetHack + ') + "px"') : o.setExpression("height", 'this.parentNode.offsetHeight + "px"'), k ? o.setExpression("width", 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"') : o.setExpression("width", 'this.parentNode.offsetWidth + "px"'), B && o.setExpression("left", B), M && o.setExpression("top", M);
                        else if (n.centerY) k && o.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'), o.marginTop = 0;
                        else if (!n.centerY && k) {
                            var i = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + (n.css && n.css.top ? parseInt(n.css.top, 10) : 0) + ') + "px"';
                            o.setExpression("top", i)
                        }
                    })
                }
                if (y && (n.theme ? w.find(".ui-widget-content").append(y) : w.append(y), (y.jquery || y.nodeType) && e(y).show()), (r || n.forceIframe) && n.showOverlay && v.show(), n.fadeIn) {
                    var j = n.onBlock ? n.onBlock : c,
                        H = n.showOverlay && !y ? j : c,
                        z = y ? j : c;
                    n.showOverlay && I._fadeIn(n.fadeIn, H), y && w._fadeIn(n.fadeIn, z)
                } else n.showOverlay && I.show(), y && w.show(), n.onBlock && n.onBlock.bind(w)();
                if (i(1, t, n), k ? (p = w[0], b = e(n.focusableElements, p), n.focusInput && setTimeout(l, 20)) : d(w[0], n.centerX, n.centerY), n.timeout) {
                    var W = setTimeout(function() {
                        k ? e.unblockUI(n) : e(t).unblock(n)
                    }, n.timeout);
                    e(t).data("blockUI.timeout", W)
                }
            }
        }

        function o(t, o) {
            var s, l = t == window,
                d = e(t),
                a = d.data("blockUI.history"),
                c = d.data("blockUI.timeout");
            c && (clearTimeout(c), d.removeData("blockUI.timeout")), o = e.extend({}, e.blockUI.defaults, o || {}), i(0, t, o), null === o.onUnblock && (o.onUnblock = d.data("blockUI.onUnblock"), d.removeData("blockUI.onUnblock"));
            var r;
            r = l ? e(document.body).children().filter(".blockUI").add("body > .blockUI") : d.find(">.blockUI"), o.cursorReset && (r.length > 1 && (r[1].style.cursor = o.cursorReset), r.length > 2 && (r[2].style.cursor = o.cursorReset)), l && (p = b = null), o.fadeOut ? (s = r.length, r.stop().fadeOut(o.fadeOut, function() {
                0 == --s && n(r, a, o, t)
            })) : n(r, a, o, t)
        }

        function n(t, o, n, i) {
            var s = e(i);
            if (!s.data("blockUI.isBlocked")) {
                t.each(function(e, t) {
                    this.parentNode && this.parentNode.removeChild(this)
                }), o && o.el && (o.el.style.display = o.display, o.el.style.position = o.position, o.el.style.cursor = "default", o.parent && o.parent.appendChild(o.el), s.removeData("blockUI.history")), s.data("blockUI.static") && s.css("position", "static"), "function" == typeof n.onUnblock && n.onUnblock(i, n);
                var l = e(document.body),
                    d = l.width(),
                    a = l[0].style.width;
                l.width(d - 1).width(d), l[0].style.width = a
            }
        }

        function i(t, o, n) {
            var i = o == window,
                l = e(o);
            if ((t || (!i || p) && (i || l.data("blockUI.isBlocked"))) && (l.data("blockUI.isBlocked", t), i && n.bindEvents && (!t || n.showOverlay))) {
                var d = "mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
                t ? e(document).bind(d, n, s) : e(document).unbind(d, s)
            }
        }

        function s(t) {
            if ("keydown" === t.type && t.keyCode && 9 == t.keyCode && p && t.data.constrainTabKey) {
                var o = b,
                    n = !t.shiftKey && t.target === o[o.length - 1],
                    i = t.shiftKey && t.target === o[0];
                if (n || i) return setTimeout(function() {
                    l(i)
                }, 10), !1
            }
            var s = t.data,
                d = e(t.target);
            return d.hasClass("blockOverlay") && s.onOverlayClick && s.onOverlayClick(t), d.parents("div." + s.blockMsgClass).length > 0 || 0 === d.parents().children().filter("div.blockUI").length
        }

        function l(e) {
            if (b) {
                var t = b[!0 === e ? b.length - 1 : 0];
                t && t.focus()
            }
        }

        function d(e, t, o) {
            var n = e.parentNode,
                i = e.style,
                s = (n.offsetWidth - e.offsetWidth) / 2 - a(n, "borderLeftWidth"),
                l = (n.offsetHeight - e.offsetHeight) / 2 - a(n, "borderTopWidth");
            t && (i.left = s > 0 ? s + "px" : "0"), o && (i.top = l > 0 ? l + "px" : "0")
        }

        function a(t, o) {
            return parseInt(e.css(t, o), 10) || 0
        }
        e.fn._fadeIn = e.fn.fadeIn;
        var c = e.noop || function() {},
            r = /MSIE/.test(navigator.userAgent),
            u = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent),
            f = (document.documentMode, e.isFunction(document.createElement("div").style.setExpression));
        e.blockUI = function(e) {
            t(window, e)
        }, e.unblockUI = function(e) {
            o(window, e)
        }, e.growlUI = function(t, o, n, i) {
            var s = e('<div class="growlUI"></div>');
            t && s.append("<h1>" + t + "</h1>"), o && s.append("<h2>" + o + "</h2>"), n === undefined && (n = 3e3);
            var l = function(t) {
                t = t || {}, e.blockUI({
                    message: s,
                    fadeIn: "undefined" != typeof t.fadeIn ? t.fadeIn : 700,
                    fadeOut: "undefined" != typeof t.fadeOut ? t.fadeOut : 1e3,
                    timeout: "undefined" != typeof t.timeout ? t.timeout : n,
                    centerY: !1,
                    showOverlay: !1,
                    onUnblock: i,
                    css: e.blockUI.defaults.growlCSS
                })
            };
            l();
            s.css("opacity");
            s.mouseover(function() {
                l({
                    fadeIn: 0,
                    timeout: 3e4
                });
                var t = e(".blockMsg");
                t.stop(), t.fadeTo(300, 1)
            }).mouseout(function() {
                e(".blockMsg").fadeOut(1e3)
            })
        }, e.fn.block = function(o) {
            if (this[0] === window) return e.blockUI(o), this;
            var n = e.extend({}, e.blockUI.defaults, o || {});
            return this.each(function() {
                var t = e(this);
                n.ignoreIfBlocked && t.data("blockUI.isBlocked") || t.unblock({
                    fadeOut: 0
                })
            }), this.each(function() {
                "static" == e.css(this, "position") && (this.style.position = "relative", e(this).data("blockUI.static", !0)), this.style.zoom = 1, t(this, o)
            })
        }, e.fn.unblock = function(t) {
            return this[0] === window ? (e.unblockUI(t), this) : this.each(function() {
                o(this, t)
            })
        }, e.blockUI.version = 2.7, e.blockUI.defaults = {
            message: "<h1>Please wait...</h1>",
            title: null,
            draggable: !0,
            theme: !1,
            css: {
                padding: 0,
                margin: 0,
                width: "30%",
                top: "40%",
                left: "35%",
                textAlign: "center",
                color: "#000",
                border: "3px solid #aaa",
                backgroundColor: "#fff",
                cursor: "wait"
            },
            themedCSS: {
                width: "30%",
                top: "40%",
                left: "35%"
            },
            overlayCSS: {
                backgroundColor: "#000",
                opacity: .6,
                cursor: "wait"
            },
            cursorReset: "default",
            growlCSS: {
                width: "350px",
                top: "10px",
                left: "",
                right: "10px",
                border: "none",
                padding: "5px",
                opacity: .6,
                cursor: "default",
                color: "#fff",
                backgroundColor: "#000",
                "-webkit-border-radius": "10px",
                "-moz-border-radius": "10px",
                "border-radius": "10px"
            },
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
            forceIframe: !1,
            baseZ: 1e3,
            centerX: !0,
            centerY: !0,
            allowBodyStretch: !0,
            bindEvents: !0,
            constrainTabKey: !0,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: !0,
            focusInput: !0,
            focusableElements: ":input:enabled:visible",
            onBlock: null,
            onUnblock: null,
            onOverlayClick: null,
            quirksmodeOffsetHack: 4,
            blockMsgClass: "blockMsg",
            ignoreIfBlocked: !1
        };
        var p = null,
            b = []
    }
    "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], e) : e(jQuery)
}();;
/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
! function(e) {
    var n = !1;
    if ("function" == typeof define && define.amd && (define(e), n = !0), "object" == typeof exports && (module.exports = e(), n = !0), !n) {
        var o = window.Cookies,
            t = window.Cookies = e();
        t.noConflict = function() {
            return window.Cookies = o, t
        }
    }
}(function() {
    function e() {
        for (var e = 0, n = {}; e < arguments.length; e++) {
            var o = arguments[e];
            for (var t in o) n[t] = o[t]
        }
        return n
    }

    function n(o) {
        function t(n, r, i) {
            var c;
            if ("undefined" != typeof document) {
                if (arguments.length > 1) {
                    if ("number" == typeof(i = e({
                            path: "/"
                        }, t.defaults, i)).expires) {
                        var a = new Date;
                        a.setMilliseconds(a.getMilliseconds() + 864e5 * i.expires), i.expires = a
                    }
                    i.expires = i.expires ? i.expires.toUTCString() : "";
                    try {
                        c = JSON.stringify(r), /^[\{\[]/.test(c) && (r = c)
                    } catch (m) {}
                    r = o.write ? o.write(r, n) : encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), n = (n = (n = encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
                    var f = "";
                    for (var s in i) i[s] && (f += "; " + s, !0 !== i[s] && (f += "=" + i[s]));
                    return document.cookie = n + "=" + r + f
                }
                n || (c = {});
                for (var p = document.cookie ? document.cookie.split("; ") : [], d = /(%[0-9A-Z]{2})+/g, u = 0; u < p.length; u++) {
                    var l = p[u].split("="),
                        C = l.slice(1).join("=");
                    '"' === C.charAt(0) && (C = C.slice(1, -1));
                    try {
                        var g = l[0].replace(d, decodeURIComponent);
                        if (C = o.read ? o.read(C, g) : o(C, g) || C.replace(d, decodeURIComponent), this.json) try {
                            C = JSON.parse(C)
                        } catch (m) {}
                        if (n === g) {
                            c = C;
                            break
                        }
                        n || (c[g] = C)
                    } catch (m) {}
                }
                return c
            }
        }
        return t.set = t, t.get = function(e) {
            return t.call(t, e)
        }, t.getJSON = function() {
            return t.apply({
                json: !0
            }, [].slice.call(arguments))
        }, t.defaults = {}, t.remove = function(n, o) {
            t(n, "", e(o, {
                expires: -1
            }))
        }, t.withConverter = n, t
    }
    return n(function() {})
});;
jQuery(function(o) {
    o(".woocommerce-ordering").on("change", "select.orderby", function() {
        o(this).closest("form").submit()
    }), o("input.qty:not(.product-quantity input.qty)").each(function() {
        var e = parseFloat(o(this).attr("min"));
        e >= 0 && parseFloat(o(this).val()) < e && o(this).val(e)
    }), jQuery(".woocommerce-store-notice__dismiss-link").click(function() {
        Cookies.set("store_notice", "hidden", {
            path: "/"
        }), jQuery(".woocommerce-store-notice").hide()
    }), "hidden" === Cookies.get("store_notice") ? jQuery(".woocommerce-store-notice").hide() : jQuery(".woocommerce-store-notice").show()
});;
jQuery(function(e) {
    function t() {
        o && sessionStorage.setItem("wc_cart_created", (new Date).getTime())
    }

    function n(e) {
        o && (localStorage.setItem(a, e), sessionStorage.setItem(a, e))
    }

    function r() {
        e.ajax(s)
    }
    if ("undefined" == typeof wc_cart_fragments_params) return !1;
    var o, a = wc_cart_fragments_params.ajax_url.toString() + "-wc_cart_hash";
    try {
        o = "sessionStorage" in window && null !== window.sessionStorage, window.sessionStorage.setItem("wc", "test"), window.sessionStorage.removeItem("wc"), window.localStorage.setItem("wc", "test"), window.localStorage.removeItem("wc")
    } catch (w) {
        o = !1
    }
    var s = {
        url: wc_cart_fragments_params.wc_ajax_url.toString().replace("%%endpoint%%", "get_refreshed_fragments"),
        type: "POST",
        success: function(r) {
            r && r.fragments && (e.each(r.fragments, function(t, n) {
                e(t).replaceWith(n)
            }), o && (sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(r.fragments)), n(r.cart_hash), r.cart_hash && t()), e(document.body).trigger("wc_fragments_refreshed"))
        }
    };
    if (o) {
        var i = null;
        e(document.body).on("wc_fragment_refresh updated_wc_div", function() {
            r()
        }), e(document.body).on("added_to_cart", function(e, r, o) {
            var s = sessionStorage.getItem(a);
            null !== s && s !== undefined && "" !== s || t(), sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(r)), n(o)
        }), e(document.body).on("wc_fragments_refreshed", function() {
            clearTimeout(i), i = setTimeout(r, 864e5)
        }), e(window).on("storage onstorage", function(e) {
            a === e.originalEvent.key && localStorage.getItem(a) !== sessionStorage.getItem(a) && r()
        }), e(window).on("pageshow", function(t) {
            t.originalEvent.persisted && (e(".widget_shopping_cart_content").empty(), e(document.body).trigger("wc_fragment_refresh"))
        });
        try {
            var c = e.parseJSON(sessionStorage.getItem(wc_cart_fragments_params.fragment_name)),
                _ = sessionStorage.getItem(a),
                g = Cookies.get("woocommerce_cart_hash"),
                m = sessionStorage.getItem("wc_cart_created");
            if (null !== _ && _ !== undefined && "" !== _ || (_ = ""), null !== g && g !== undefined && "" !== g || (g = ""), _ && (null === m || m === undefined || "" === m)) throw "No cart_created";
            if (m) {
                var d = 1 * m + 864e5,
                    f = (new Date).getTime();
                if (d < f) throw "Fragment expired";
                i = setTimeout(r, d - f)
            }
            if (!c || !c["div.widget_shopping_cart_content"] || _ !== g) throw "No fragment";
            e.each(c, function(t, n) {
                e(t).replaceWith(n)
            }), e(document.body).trigger("wc_fragments_loaded")
        } catch (w) {
            r()
        }
    } else r();
    Cookies.get("woocommerce_items_in_cart") > 0 ? e(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show() : e(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").hide(), e(document.body).on("adding_to_cart", function() {
        e(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show()
    })
});;
! function(t) {
    function e() {
        var t = location.href;
        return hashtag = -1 !== t.indexOf("#prettyPhoto") && decodeURI(t.substring(t.indexOf("#prettyPhoto") + 1, t.length)), hashtag && (hashtag = hashtag.replace(/<|>/g, "")), hashtag
    }

    function i() {
        "undefined" != typeof theRel && (location.hash = theRel + "/" + rel_index + "/")
    }

    function p() {
        -1 !== location.href.indexOf("#prettyPhoto") && (location.hash = "prettyPhoto")
    }

    function o(t, e) {
        var i = "[\\?&]" + (t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")) + "=([^&#]*)",
            p = new RegExp(i).exec(e);
        return null == p ? "" : p[1]
    }
    t.prettyPhoto = {
        version: "3.1.6"
    }, t.fn.prettyPhoto = function(a) {
        function s() {
            t(".pp_loaderIcon").hide(), projectedTop = scroll_pos.scrollTop + (I / 2 - u.containerHeight / 2), projectedTop < 0 && (projectedTop = 0), $ppt.fadeTo(settings.animation_speed, 1), $pp_pic_holder.find(".pp_content").animate({
                height: u.contentHeight,
                width: u.contentWidth
            }, settings.animation_speed), $pp_pic_holder.animate({
                top: projectedTop,
                left: j / 2 - u.containerWidth / 2 < 0 ? 0 : j / 2 - u.containerWidth / 2,
                width: u.containerWidth
            }, settings.animation_speed, function() {
                $pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(u.height).width(u.width), $pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed), isSet && "image" == h(pp_images[set_position]) ? $pp_pic_holder.find(".pp_hoverContainer").show() : $pp_pic_holder.find(".pp_hoverContainer").hide(), settings.allow_expand && (u.resized ? t("a.pp_expand,a.pp_contract").show() : t("a.pp_expand").hide()), !settings.autoplay_slideshow || P || v || t.prettyPhoto.startSlideshow(), settings.changepicturecallback(), v = !0
            }), m(), a.ajaxcallback()
        }

        function n(e) {
            $pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility", "hidden"), $pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed, function() {
                t(".pp_loaderIcon").show(), e()
            })
        }

        function l(e) {
            e > 1 ? t(".pp_nav").show() : t(".pp_nav").hide()
        }

        function r(t, e) {
            if (resized = !1, d(t, e), imageWidth = t, imageHeight = e, (k > j || b > I) && doresize && settings.allow_resize && !$) {
                for (resized = !0, fitting = !1; !fitting;) k > j ? (imageWidth = j - 200, imageHeight = e / t * imageWidth) : b > I ? (imageHeight = I - 200, imageWidth = t / e * imageHeight) : fitting = !0, b = imageHeight, k = imageWidth;
                (k > j || b > I) && r(k, b), d(imageWidth, imageHeight)
            }
            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(b),
                containerWidth: Math.floor(k) + 2 * settings.horizontal_padding,
                contentHeight: Math.floor(y),
                contentWidth: Math.floor(w),
                resized: resized
            }
        }

        function d(e, i) {
            e = parseFloat(e), i = parseFloat(i), $pp_details = $pp_pic_holder.find(".pp_details"), $pp_details.width(e), detailsHeight = parseFloat($pp_details.css("marginTop")) + parseFloat($pp_details.css("marginBottom")), $pp_details = $pp_details.clone().addClass(settings.theme).width(e).appendTo(t("body")).css({
                position: "absolute",
                top: -1e4
            }), detailsHeight += $pp_details.height(), detailsHeight = detailsHeight <= 34 ? 36 : detailsHeight, $pp_details.remove(), $pp_title = $pp_pic_holder.find(".ppt"), $pp_title.width(e), titleHeight = parseFloat($pp_title.css("marginTop")) + parseFloat($pp_title.css("marginBottom")), $pp_title = $pp_title.clone().appendTo(t("body")).css({
                position: "absolute",
                top: -1e4
            }), titleHeight += $pp_title.height(), $pp_title.remove(), y = i + detailsHeight, w = e, b = y + titleHeight + $pp_pic_holder.find(".pp_top").height() + $pp_pic_holder.find(".pp_bottom").height(), k = e
        }

        function h(t) {
            return t.match(/youtube\.com\/watch/i) || t.match(/youtu\.be/i) ? "youtube" : t.match(/vimeo\.com/i) ? "vimeo" : t.match(/\b.mov\b/i) ? "quicktime" : t.match(/\b.swf\b/i) ? "flash" : t.match(/\biframe=true\b/i) ? "iframe" : t.match(/\bajax=true\b/i) ? "ajax" : t.match(/\bcustom=true\b/i) ? "custom" : "#" == t.substr(0, 1) ? "inline" : "image"
        }

        function c() {
            if (doresize && "undefined" != typeof $pp_pic_holder) {
                if (scroll_pos = _(), contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width(), projectedTop = I / 2 + scroll_pos.scrollTop - contentHeight / 2, projectedTop < 0 && (projectedTop = 0), contentHeight > I) return;
                $pp_pic_holder.css({
                    top: projectedTop,
                    left: j / 2 + scroll_pos.scrollLeft - contentwidth / 2
                })
            }
        }

        function _() {
            return self.pageYOffset ? {
                scrollTop: self.pageYOffset,
                scrollLeft: self.pageXOffset
            } : document.documentElement && document.documentElement.scrollTop ? {
                scrollTop: document.documentElement.scrollTop,
                scrollLeft: document.documentElement.scrollLeft
            } : document.body ? {
                scrollTop: document.body.scrollTop,
                scrollLeft: document.body.scrollLeft
            } : void 0
        }

        function g() {
            I = t(window).height(), j = t(window).width(), "undefined" != typeof $pp_overlay && $pp_overlay.height(t(document).height()).width(j)
        }

        function m() {
            isSet && settings.overlay_gallery && "image" == h(pp_images[set_position]) ? (itemWidth = 57, navWidth = "facebook" == settings.theme || "pp_default" == settings.theme ? 50 : 30, itemsPerPage = Math.floor((u.containerWidth - 100 - navWidth) / itemWidth), itemsPerPage = itemsPerPage < pp_images.length ? itemsPerPage : pp_images.length, totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1, 0 == totalPage ? (navWidth = 0, $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()) : $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(), galleryWidth = itemsPerPage * itemWidth, fullGalleryWidth = pp_images.length * itemWidth, $pp_gallery.css("margin-left", -(galleryWidth / 2 + navWidth / 2)).find("div:first").width(galleryWidth + 5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected"), goToPage = Math.floor(set_position / itemsPerPage) < totalPage ? Math.floor(set_position / itemsPerPage) : totalPage, t.prettyPhoto.changeGalleryPage(goToPage), $pp_gallery_li.filter(":eq(" + set_position + ")").addClass("selected")) : $pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")
        }

        function f(e) {
            if (settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href))), settings.markup = settings.markup.replace("{pp_social}", ""), t("body").append(settings.markup), $pp_pic_holder = t(".pp_pic_holder"), $ppt = t(".ppt"), $pp_overlay = t("div.pp_overlay"), isSet && settings.overlay_gallery) {
                currentGalleryPage = 0, toInject = "";
                for (var i = 0; i < pp_images.length; i++) pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi) ? (classname = "", img_src = pp_images[i]) : (classname = "default", img_src = ""), toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject), $pp_pic_holder.find("#pp_full_res").after(toInject), $pp_gallery = t(".pp_pic_holder .pp_gallery"), $pp_gallery_li = $pp_gallery.find("li"), $pp_gallery.find(".pp_arrow_next").click(function() {
                    return t.prettyPhoto.changeGalleryPage("next"), t.prettyPhoto.stopSlideshow(), !1
                }), $pp_gallery.find(".pp_arrow_previous").click(function() {
                    return t.prettyPhoto.changeGalleryPage("previous"), t.prettyPhoto.stopSlideshow(), !1
                }), $pp_pic_holder.find(".pp_content").hover(function() {
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()
                }, function() {
                    $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()
                }), itemWidth = 57, $pp_gallery_li.each(function(e) {
                    t(this).find("a").click(function() {
                        return t.prettyPhoto.changePage(e), t.prettyPhoto.stopSlideshow(), !1
                    })
                })
            }
            settings.slideshow && ($pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>'), $pp_pic_holder.find(".pp_nav .pp_play").click(function() {
                return t.prettyPhoto.startSlideshow(), !1
            })), $pp_pic_holder.attr("class", "pp_pic_holder " + settings.theme), $pp_overlay.css({
                opacity: 0,
                height: t(document).height(),
                width: t(window).width()
            }).bind("click", function() {
                settings.modal || t.prettyPhoto.close()
            }), t("a.pp_close").bind("click", function() {
                return t.prettyPhoto.close(), !1
            }), settings.allow_expand && t("a.pp_expand").bind("click", function(e) {
                return t(this).hasClass("pp_expand") ? (t(this).removeClass("pp_expand").addClass("pp_contract"), doresize = !1) : (t(this).removeClass("pp_contract").addClass("pp_expand"), doresize = !0), n(function() {
                    t.prettyPhoto.open()
                }), !1
            }), $pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click", function() {
                return t.prettyPhoto.changePage("previous"), t.prettyPhoto.stopSlideshow(), !1
            }), $pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click", function() {
                return t.prettyPhoto.changePage("next"), t.prettyPhoto.stopSlideshow(), !1
            }), c()
        }
        a = jQuery.extend({
            hook: "rel",
            animation_speed: "fast",
            ajaxcallback: function() {},
            slideshow: 5e3,
            autoplay_slideshow: !1,
            opacity: .8,
            show_title: !0,
            allow_resize: !0,
            allow_expand: !0,
            default_width: 500,
            default_height: 344,
            counter_separator_label: "/",
            theme: "pp_default",
            horizontal_padding: 20,
            hideflash: !1,
            wmode: "opaque",
            autoplay: !0,
            modal: !1,
            deeplinking: !0,
            overlay_gallery: !0,
            overlay_gallery_max: 30,
            keyboard_shortcuts: !0,
            changepicturecallback: function() {},
            callback: function() {},
            ie6_fallback: !0,
            markup: '<div class="pp_pic_holder"> \t\t\t\t\t\t<div class="ppt">&nbsp;</div> \t\t\t\t\t\t<div class="pp_top"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_content_container"> \t\t\t\t\t\t\t<div class="pp_left"> \t\t\t\t\t\t\t<div class="pp_right"> \t\t\t\t\t\t\t\t<div class="pp_content"> \t\t\t\t\t\t\t\t\t<div class="pp_loaderIcon"></div> \t\t\t\t\t\t\t\t\t<div class="pp_fade"> \t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_expand" title="Expand the image">Expand</a> \t\t\t\t\t\t\t\t\t\t<div class="pp_hoverContainer"> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_next" href="#">next</a> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_previous" href="#">previous</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t<div id="pp_full_res"></div> \t\t\t\t\t\t\t\t\t\t<div class="pp_details"> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_nav"> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t\t\t\t\t<p class="currentTextHolder">0/0</p> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t\t<p class="pp_description"></p> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_social">{pp_social}</div> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_close" href="#">Close</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_bottom"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t</div> \t\t\t\t\t<div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t<div> \t\t\t\t\t\t\t\t\t<ul> \t\t\t\t\t\t\t\t\t\t{gallery} \t\t\t\t\t\t\t\t\t</ul> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="https://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="https://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: "",
            social_tools: '<div class="twitter"><a href="//twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"><\/script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'
        }, a);
        var u, v, y, w, b, k, P, x = this,
            $ = !1,
            I = t(window).height(),
            j = t(window).width();
        return doresize = !0, scroll_pos = _(), t(window).unbind("resize.prettyphoto").bind("resize.prettyphoto", function() {
            c(), g()
        }), a.keyboard_shortcuts && t(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto", function(e) {
            if ("undefined" != typeof $pp_pic_holder && $pp_pic_holder.is(":visible")) switch (e.keyCode) {
                case 37:
                    t.prettyPhoto.changePage("previous"), e.preventDefault();
                    break;
                case 39:
                    t.prettyPhoto.changePage("next"), e.preventDefault();
                    break;
                case 27:
                    settings.modal || t.prettyPhoto.close(), e.preventDefault()
            }
        }), t.prettyPhoto.initialize = function() {
            return settings = a, "pp_default" == settings.theme && (settings.horizontal_padding = 16), theRel = t(this).attr(settings.hook), galleryRegExp = /\[(?:.*)\]/, isSet = !!galleryRegExp.exec(theRel), pp_images = isSet ? jQuery.map(x, function(e, i) {
                if (-1 != t(e).attr(settings.hook).indexOf(theRel)) return t(e).attr("href")
            }) : t.makeArray(t(this).attr("href")), pp_titles = isSet ? jQuery.map(x, function(e, i) {
                if (-1 != t(e).attr(settings.hook).indexOf(theRel)) return t(e).find("img").attr("alt") ? t(e).find("img").attr("alt") : ""
            }) : t.makeArray(t(this).find("img").attr("alt")), pp_descriptions = isSet ? jQuery.map(x, function(e, i) {
                if (-1 != t(e).attr(settings.hook).indexOf(theRel)) return t(e).attr("title") ? t(e).attr("title") : ""
            }) : t.makeArray(t(this).attr("title")), pp_images.length > settings.overlay_gallery_max && (settings.overlay_gallery = !1), set_position = jQuery.inArray(t(this).attr("href"), pp_images), rel_index = isSet ? set_position : t("a[" + settings.hook + "^='" + theRel + "']").index(t(this)), f(), settings.allow_resize && t(window).bind("scroll.prettyphoto", function() {
                c()
            }), t.prettyPhoto.open(), !1
        }, t.prettyPhoto.open = function(e) {
            return "undefined" == typeof settings && (settings = a, pp_images = t.makeArray(arguments[0]), pp_titles = arguments[1] ? t.makeArray(arguments[1]) : t.makeArray(""), pp_descriptions = arguments[2] ? t.makeArray(arguments[2]) : t.makeArray(""), isSet = pp_images.length > 1, set_position = arguments[3] ? arguments[3] : 0, f(e.target)), settings.hideflash && t("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "hidden"), l(t(pp_images).length), t(".pp_loaderIcon").show(), settings.deeplinking && i(), settings.social_tools && (facebook_like_link = settings.social_tools.replace("{location_href}", encodeURIComponent(location.href)), $pp_pic_holder.find(".pp_social").html(facebook_like_link)), $ppt.is(":hidden") && $ppt.css("opacity", 0).show(), $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity), $pp_pic_holder.find(".currentTextHolder").text(set_position + 1 + settings.counter_separator_label + t(pp_images).length), "undefined" != typeof pp_descriptions[set_position] && "" != pp_descriptions[set_position] ? $pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position])) : $pp_pic_holder.find(".pp_description").hide(), movie_width = parseFloat(o("width", pp_images[set_position])) ? o("width", pp_images[set_position]) : settings.default_width.toString(), movie_height = parseFloat(o("height", pp_images[set_position])) ? o("height", pp_images[set_position]) : settings.default_height.toString(), $ = !1, -1 != movie_height.indexOf("%") && (movie_height = parseFloat(t(window).height() * parseFloat(movie_height) / 100 - 150), $ = !0), -1 != movie_width.indexOf("%") && (movie_width = parseFloat(t(window).width() * parseFloat(movie_width) / 100 - 150), $ = !0), $pp_pic_holder.fadeIn(function() {
                switch (settings.show_title && "" != pp_titles[set_position] && "undefined" != typeof pp_titles[set_position] ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html("&nbsp;"), imgPreloader = "", skipInjection = !1, h(pp_images[set_position])) {
                    case "image":
                        imgPreloader = new Image, nextImage = new Image, isSet && set_position < t(pp_images).length - 1 && (nextImage.src = pp_images[set_position + 1]), prevImage = new Image, isSet && pp_images[set_position - 1] && (prevImage.src = pp_images[set_position - 1]), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]), imgPreloader.onload = function() {
                            u = r(imgPreloader.width, imgPreloader.height), s()
                        }, imgPreloader.onerror = function() {
                            alert("Image cannot be loaded. Make sure the path is correct and image exist."), t.prettyPhoto.close()
                        }, imgPreloader.src = pp_images[set_position];
                        break;
                    case "youtube":
                        u = r(movie_width, movie_height), movie_id = o("v", pp_images[set_position]), "" == movie_id && (movie_id = pp_images[set_position].split("youtu.be/index.html"), movie_id = movie_id[1], movie_id.indexOf("?") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("?"))), movie_id.indexOf("&") > 0 && (movie_id = movie_id.substr(0, movie_id.indexOf("&")))), movie = "//www.youtube.com/embed/" + movie_id, o("rel", pp_images[set_position]) ? movie += "?rel=" + o("rel", pp_images[set_position]) : movie += "?rel=1", settings.autoplay && (movie += "&autoplay=1"), toInject = settings.iframe_markup.replace(/{width}/g, u.width).replace(/{height}/g, u.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;
                    case "vimeo":
                        u = r(movie_width, movie_height), movie_id = pp_images[set_position];
                        var e = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/,
                            i = movie_id.match(e);
                        movie = "//player.vimeo.com/video/" + i[3] + "?title=0&amp;byline=0&amp;portrait=0", settings.autoplay && (movie += "&autoplay=1;"), vimeo_width = u.width + "/embed/?moog_width=" + u.width, toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, u.height).replace(/{path}/g, movie);
                        break;
                    case "quicktime":
                        (u = r(movie_width, movie_height)).height += 15, u.contentHeight += 15, u.containerHeight += 15, toInject = settings.quicktime_markup.replace(/{width}/g, u.width).replace(/{height}/g, u.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;
                    case "flash":
                        u = r(movie_width, movie_height), flash_vars = pp_images[set_position], flash_vars = flash_vars.substring(pp_images[set_position].indexOf("flashvars") + 10, pp_images[set_position].length), filename = pp_images[set_position], filename = filename.substring(0, filename.indexOf("?")), toInject = settings.flash_markup.replace(/{width}/g, u.width).replace(/{height}/g, u.height).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + "?" + flash_vars);
                        break;
                    case "iframe":
                        u = r(movie_width, movie_height), frame_url = pp_images[set_position], frame_url = frame_url.substr(0, frame_url.indexOf("iframe") - 1), toInject = settings.iframe_markup.replace(/{width}/g, u.width).replace(/{height}/g, u.height).replace(/{path}/g, frame_url);
                        break;
                    case "ajax":
                        doresize = !1, u = r(movie_width, movie_height), doresize = !0, skipInjection = !0, t.get(pp_images[set_position], function(t) {
                            toInject = settings.inline_markup.replace(/{content}/g, t), $pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, s()
                        });
                        break;
                    case "custom":
                        u = r(movie_width, movie_height), toInject = settings.custom_markup;
                        break;
                    case "inline":
                        myClone = t(pp_images[set_position]).clone().append('<br clear="all" />').css({
                            width: settings.default_width
                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(t("body")).show(), doresize = !1, u = r(t(myClone).width(), t(myClone).height()), doresize = !0, t(myClone).remove(), toInject = settings.inline_markup.replace(/{content}/g, t(pp_images[set_position]).html())
                }
                imgPreloader || skipInjection || ($pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject, s())
            }), !1
        }, t.prettyPhoto.changePage = function(e) {
            currentGalleryPage = 0, "previous" == e ? --set_position < 0 && (set_position = t(pp_images).length - 1) : "next" == e ? ++set_position > t(pp_images).length - 1 && (set_position = 0) : set_position = e, rel_index = set_position, doresize || (doresize = !0), settings.allow_expand && t(".pp_contract").removeClass("pp_contract").addClass("pp_expand"), n(function() {
                t.prettyPhoto.open()
            })
        }, t.prettyPhoto.changeGalleryPage = function(t) {
            "next" == t ? ++currentGalleryPage > totalPage && (currentGalleryPage = 0) : "previous" == t ? --currentGalleryPage < 0 && (currentGalleryPage = totalPage) : currentGalleryPage = t, slide_speed = "next" == t || "previous" == t ? settings.animation_speed : 0, slide_to = currentGalleryPage * (itemsPerPage * itemWidth), $pp_gallery.find("ul").animate({
                left: -slide_to
            }, slide_speed)
        }, t.prettyPhoto.startSlideshow = function() {
            void 0 === P ? ($pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function() {
                return t.prettyPhoto.stopSlideshow(), !1
            }), P = setInterval(t.prettyPhoto.startSlideshow, settings.slideshow)) : t.prettyPhoto.changePage("next")
        }, t.prettyPhoto.stopSlideshow = function() {
            $pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function() {
                return t.prettyPhoto.startSlideshow(), !1
            }), clearInterval(P), P = undefined
        }, t.prettyPhoto.close = function() {
            $pp_overlay.is(":animated") || (t.prettyPhoto.stopSlideshow(), $pp_pic_holder.stop().find("object,embed").css("visibility", "hidden"), t("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed, function() {
                t(this).remove()
            }), $pp_overlay.fadeOut(settings.animation_speed, function() {
                settings.hideflash && t("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility", "visible"), t(this).remove(), t(window).unbind("scroll.prettyphoto"), p(), settings.callback(), doresize = !0, v = !1, delete settings
            }))
        }, !pp_alreadyInitialized && e() && (pp_alreadyInitialized = !0, hashIndex = e(), hashRel = hashIndex, hashIndex = hashIndex.substring(hashIndex.indexOf("http://codex-themes.com/") + 1, hashIndex.length - 1), hashRel = hashRel.substring(0, hashRel.indexOf("http://codex-themes.com/")), setTimeout(function() {
            t("a[" + a.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger("click")
        }, 50)), this.unbind("click.prettyphoto").bind("click.prettyphoto", t.prettyPhoto.initialize)
    }
}(jQuery);
var pp_alreadyInitialized = !1;;
/**
 * jQuery SelectBox
 *
 * v1.2.0
 * github.com/marcj/jquery-selectBox
 */
(function(a) {
    var b = this.SelectBox = function(c, d) {
        if (c instanceof jQuery) {
            if (c.length > 0) {
                c = c[0]
            } else {
                return
            }
        }
        this.typeTimer = null;
        this.typeSearch = "";
        this.isMac = navigator.platform.match(/mac/i);
        d = "object" === typeof d ? d : {};
        this.selectElement = c;
        if (!d.mobile && navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)) {
            return false
        }
        if ("select" !== c.tagName.toLowerCase()) {
            return false
        }
        this.init(d)
    };
    b.prototype.version = "1.2.0";
    b.prototype.init = function(o) {
        var j = a(this.selectElement);
        if (j.data("selectBox-control")) {
            return false
        }
        var f = a('<a class="selectBox" />'),
            h = j.attr("multiple") || parseInt(j.attr("size")) > 1,
            d = o || {},
            c = parseInt(j.prop("tabindex")) || 0,
            m = this;
        f.width(j.outerWidth()).addClass(j.attr("class")).attr("title", j.attr("title") || "").attr("tabindex", c).css("display", "inline-block").bind("focus.selectBox", function() {
            if (this !== document.activeElement && document.body !== document.activeElement) {
                a(document.activeElement).blur()
            }
            if (f.hasClass("selectBox-active")) {
                return
            }
            f.addClass("selectBox-active");
            j.trigger("focus")
        }).bind("blur.selectBox", function() {
            if (!f.hasClass("selectBox-active")) {
                return
            }
            f.removeClass("selectBox-active");
            j.trigger("blur")
        });
        if (!a(window).data("selectBox-bindings")) {
            a(window).data("selectBox-bindings", true).bind("scroll.selectBox", this.hideMenus).bind("resize.selectBox", this.hideMenus)
        }
        if (j.attr("disabled")) {
            f.addClass("selectBox-disabled")
        }
        j.bind("click.selectBox", function(p) {
            f.focus();
            p.preventDefault()
        });
        if (h) {
            o = this.getOptions("inline");
            f.append(o).data("selectBox-options", o).addClass("selectBox-inline selectBox-menuShowing").bind("keydown.selectBox", function(p) {
                m.handleKeyDown(p)
            }).bind("keypress.selectBox", function(p) {
                m.handleKeyPress(p)
            }).bind("mousedown.selectBox", function(p) {
                if (1 !== p.which) {
                    return
                }
                if (a(p.target).is("A.selectBox-inline")) {
                    p.preventDefault()
                }
                if (!f.hasClass("selectBox-focus")) {
                    f.focus()
                }
            }).insertAfter(j);
            if (!j[0].style.height) {
                var n = j.attr("size") ? parseInt(j.attr("size")) : 5;
                var e = f.clone().removeAttr("id").css({
                    position: "absolute",
                    top: "-9999em"
                }).show().appendTo("body");
                e.find(".selectBox-options").html("<li><a>\u00A0</a></li>");
                var l = parseInt(e.find(".selectBox-options A:first").html("&nbsp;").outerHeight());
                e.remove();
                f.height(l * n)
            }
            this.disableSelection(f)
        } else {
            var i = a('<span class="selectBox-label" />'),
                k = a('<span class="selectBox-arrow" />');
            i.attr("class", this.getLabelClass()).text(this.getLabelText());
            o = this.getOptions("dropdown");
            o.appendTo("BODY");
            f.data("selectBox-options", o).addClass("selectBox-dropdown").append(i).append(k).bind("mousedown.selectBox", function(p) {
                if (1 === p.which) {
                    if (f.hasClass("selectBox-menuShowing")) {
                        m.hideMenus()
                    } else {
                        p.stopPropagation();
                        o.data("selectBox-down-at-x", p.screenX).data("selectBox-down-at-y", p.screenY);
                        m.showMenu()
                    }
                }
            }).bind("keydown.selectBox", function(p) {
                m.handleKeyDown(p)
            }).bind("keypress.selectBox", function(p) {
                m.handleKeyPress(p)
            }).bind("open.selectBox", function(q, p) {
                if (p && p._selectBox === true) {
                    return
                }
                m.showMenu()
            }).bind("close.selectBox", function(q, p) {
                if (p && p._selectBox === true) {
                    return
                }
                m.hideMenus()
            }).insertAfter(j);
            var g = f.width() - k.outerWidth() - parseInt(i.css("paddingLeft")) || 0 - parseInt(i.css("paddingRight")) || 0;
            i.width(g);
            this.disableSelection(f)
        }
        j.addClass("selectBox").data("selectBox-control", f).data("selectBox-settings", d).hide()
    };
    b.prototype.getOptions = function(j) {
        var f;
        var c = a(this.selectElement);
        var e = this;
        var d = function(i, k) {
            i.children("OPTION, OPTGROUP").each(function() {
                if (a(this).is("OPTION")) {
                    if (a(this).length > 0) {
                        e.generateOptions(a(this), k)
                    } else {
                        k.append("<li>\u00A0</li>")
                    }
                } else {
                    var l = a('<li class="selectBox-optgroup" />');
                    l.text(a(this).attr("label"));
                    k.append(l);
                    k = d(a(this), k)
                }
            });
            return k
        };
        switch (j) {
            case "inline":
                f = a('<ul class="selectBox-options" />');
                f = d(c, f);
                f.find("A").bind("mouseover.selectBox", function(i) {
                    e.addHover(a(this).parent())
                }).bind("mouseout.selectBox", function(i) {
                    e.removeHover(a(this).parent())
                }).bind("mousedown.selectBox", function(i) {
                    if (1 !== i.which) {
                        return
                    }
                    i.preventDefault();
                    if (!c.selectBox("control").hasClass("selectBox-active")) {
                        c.selectBox("control").focus()
                    }
                }).bind("mouseup.selectBox", function(i) {
                    if (1 !== i.which) {
                        return
                    }
                    e.hideMenus();
                    e.selectOption(a(this).parent(), i)
                });
                this.disableSelection(f);
                return f;
            case "dropdown":
                f = a('<ul class="selectBox-dropdown-menu selectBox-options" />');
                f = d(c, f);
                f.data("selectBox-select", c).css("display", "none").appendTo("BODY").find("A").bind("mousedown.selectBox", function(i) {
                    if (i.which === 1) {
                        i.preventDefault();
                        if (i.screenX === f.data("selectBox-down-at-x") && i.screenY === f.data("selectBox-down-at-y")) {
                            f.removeData("selectBox-down-at-x").removeData("selectBox-down-at-y");
                            e.hideMenus()
                        }
                    }
                }).bind("mouseup.selectBox", function(i) {
                    if (1 !== i.which) {
                        return
                    }
                    if (i.screenX === f.data("selectBox-down-at-x") && i.screenY === f.data("selectBox-down-at-y")) {
                        return
                    } else {
                        f.removeData("selectBox-down-at-x").removeData("selectBox-down-at-y")
                    }
                    e.selectOption(a(this).parent());
                    e.hideMenus()
                }).bind("mouseover.selectBox", function(i) {
                    e.addHover(a(this).parent())
                }).bind("mouseout.selectBox", function(i) {
                    e.removeHover(a(this).parent())
                });
                var h = c.attr("class") || "";
                if ("" !== h) {
                    h = h.split(" ");
                    for (var g in h) {
                        f.addClass(h[g] + "-selectBox-dropdown-menu")
                    }
                }
                this.disableSelection(f);
                return f
        }
    };
    b.prototype.getLabelClass = function() {
        var c = a(this.selectElement).find("OPTION:selected");
        return ("selectBox-label " + (c.attr("class") || "")).replace(/\s+$/, "")
    };
    b.prototype.getLabelText = function() {
        var c = a(this.selectElement).find("OPTION:selected");
        return c.text() || "\u00A0"
    };
    b.prototype.setLabel = function() {
        var c = a(this.selectElement);
        var d = c.data("selectBox-control");
        if (!d) {
            return
        }
        d.find(".selectBox-label").attr("class", this.getLabelClass()).text(this.getLabelText())
    };
    b.prototype.destroy = function() {
        var c = a(this.selectElement);
        var e = c.data("selectBox-control");
        if (!e) {
            return
        }
        var d = e.data("selectBox-options");
        d.remove();
        e.remove();
        c.removeClass("selectBox").removeData("selectBox-control").data("selectBox-control", null).removeData("selectBox-settings").data("selectBox-settings", null).show()
    };
    b.prototype.refresh = function() {
        var c = a(this.selectElement),
            e = c.data("selectBox-control"),
            f = e.hasClass("selectBox-dropdown"),
            d = e.hasClass("selectBox-menuShowing");
        c.selectBox("options", c.html());
        if (f && d) {
            this.showMenu()
        }
    };
    b.prototype.showMenu = function() {
        var e = this,
            d = a(this.selectElement),
            j = d.data("selectBox-control"),
            h = d.data("selectBox-settings"),
            f = j.data("selectBox-options");
        if (j.hasClass("selectBox-disabled")) {
            return false
        }
        this.hideMenus();
        var g = parseInt(j.css("borderBottomWidth")) || 0;
        f.width(j.innerWidth()).css({
            top: j.offset().top + j.outerHeight() - g,
            left: j.offset().left
        });
        if (d.triggerHandler("beforeopen")) {
            return false
        }
        var i = function() {
            d.triggerHandler("open", {
                _selectBox: true
            })
        };
        switch (h.menuTransition) {
            case "fade":
                f.fadeIn(h.menuSpeed, i);
                break;
            case "slide":
                f.slideDown(h.menuSpeed, i);
                break;
            default:
                f.show(h.menuSpeed, i);
                break
        }
        if (!h.menuSpeed) {
            i()
        }
        var c = f.find(".selectBox-selected:first");
        this.keepOptionInView(c, true);
        this.addHover(c);
        j.addClass("selectBox-menuShowing");
        a(document).bind("mousedown.selectBox", function(k) {
            if (1 === k.which) {
                if (a(k.target).parents().andSelf().hasClass("selectBox-options")) {
                    return
                }
                e.hideMenus()
            }
        })
    };
    b.prototype.hideMenus = function() {
        if (a(".selectBox-dropdown-menu:visible").length === 0) {
            return
        }
        a(document).unbind("mousedown.selectBox");
        a(".selectBox-dropdown-menu").each(function() {
            var d = a(this),
                c = d.data("selectBox-select"),
                g = c.data("selectBox-control"),
                e = c.data("selectBox-settings");
            if (c.triggerHandler("beforeclose")) {
                return false
            }
            var f = function() {
                c.triggerHandler("close", {
                    _selectBox: true
                })
            };
            if (e) {
                switch (e.menuTransition) {
                    case "fade":
                        d.fadeOut(e.menuSpeed, f);
                        break;
                    case "slide":
                        d.slideUp(e.menuSpeed, f);
                        break;
                    default:
                        d.hide(e.menuSpeed, f);
                        break
                }
                if (!e.menuSpeed) {
                    f()
                }
                g.removeClass("selectBox-menuShowing")
            } else {
                a(this).hide();
                a(this).triggerHandler("close", {
                    _selectBox: true
                });
                a(this).removeClass("selectBox-menuShowing")
            }
        })
    };
    b.prototype.selectOption = function(d, j) {
        var c = a(this.selectElement);
        d = a(d);
        var k = c.data("selectBox-control"),
            h = c.data("selectBox-settings");
        if (k.hasClass("selectBox-disabled")) {
            return false
        }
        if (0 === d.length || d.hasClass("selectBox-disabled")) {
            return false
        }
        if (c.attr("multiple")) {
            if (j.shiftKey && k.data("selectBox-last-selected")) {
                d.toggleClass("selectBox-selected");
                var e;
                if (d.index() > k.data("selectBox-last-selected").index()) {
                    e = d.siblings().slice(k.data("selectBox-last-selected").index(), d.index())
                } else {
                    e = d.siblings().slice(d.index(), k.data("selectBox-last-selected").index())
                }
                e = e.not(".selectBox-optgroup, .selectBox-disabled");
                if (d.hasClass("selectBox-selected")) {
                    e.addClass("selectBox-selected")
                } else {
                    e.removeClass("selectBox-selected")
                }
            } else {
                if ((this.isMac && j.metaKey) || (!this.isMac && j.ctrlKey)) {
                    d.toggleClass("selectBox-selected")
                } else {
                    d.siblings().removeClass("selectBox-selected");
                    d.addClass("selectBox-selected")
                }
            }
        } else {
            d.siblings().removeClass("selectBox-selected");
            d.addClass("selectBox-selected")
        }
        if (k.hasClass("selectBox-dropdown")) {
            k.find(".selectBox-label").text(d.text())
        }
        var f = 0,
            g = [];
        if (c.attr("multiple")) {
            k.find(".selectBox-selected A").each(function() {
                g[f++] = a(this).attr("rel")
            })
        } else {
            g = d.find("A").attr("rel")
        }
        k.data("selectBox-last-selected", d);
        if (c.val() !== g) {
            c.val(g);
            this.setLabel();
            c.trigger("change")
        }
        return true
    };
    b.prototype.addHover = function(d) {
        d = a(d);
        var c = a(this.selectElement),
            f = c.data("selectBox-control"),
            e = f.data("selectBox-options");
        e.find(".selectBox-hover").removeClass("selectBox-hover");
        d.addClass("selectBox-hover")
    };
    b.prototype.getSelectElement = function() {
        return this.selectElement
    };
    b.prototype.removeHover = function(d) {
        d = a(d);
        var c = a(this.selectElement),
            f = c.data("selectBox-control"),
            e = f.data("selectBox-options");
        e.find(".selectBox-hover").removeClass("selectBox-hover")
    };
    b.prototype.keepOptionInView = function(e, d) {
        if (!e || e.length === 0) {
            return
        }
        var c = a(this.selectElement),
            j = c.data("selectBox-control"),
            g = j.data("selectBox-options"),
            h = j.hasClass("selectBox-dropdown") ? g : g.parent(),
            i = parseInt(e.offset().top - h.position().top),
            f = parseInt(i + e.outerHeight());
        if (d) {
            h.scrollTop(e.offset().top - h.offset().top + h.scrollTop() - (h.height() / 2))
        } else {
            if (i < 0) {
                h.scrollTop(e.offset().top - h.offset().top + h.scrollTop())
            }
            if (f > h.height()) {
                h.scrollTop((e.offset().top + e.outerHeight()) - h.offset().top + h.scrollTop() - h.height())
            }
        }
    };
    b.prototype.handleKeyDown = function(c) {
        var k = a(this.selectElement),
            g = k.data("selectBox-control"),
            l = g.data("selectBox-options"),
            e = k.data("selectBox-settings"),
            f = 0,
            h = 0;
        if (g.hasClass("selectBox-disabled")) {
            return
        }
        switch (c.keyCode) {
            case 8:
                c.preventDefault();
                this.typeSearch = "";
                break;
            case 9:
            case 27:
                this.hideMenus();
                this.removeHover();
                break;
            case 13:
                if (g.hasClass("selectBox-menuShowing")) {
                    this.selectOption(l.find("LI.selectBox-hover:first"), c);
                    if (g.hasClass("selectBox-dropdown")) {
                        this.hideMenus()
                    }
                } else {
                    this.showMenu()
                }
                break;
            case 38:
            case 37:
                c.preventDefault();
                if (g.hasClass("selectBox-menuShowing")) {
                    var d = l.find(".selectBox-hover").prev("LI");
                    f = l.find("LI:not(.selectBox-optgroup)").length;
                    h = 0;
                    while (d.length === 0 || d.hasClass("selectBox-disabled") || d.hasClass("selectBox-optgroup")) {
                        d = d.prev("LI");
                        if (d.length === 0) {
                            if (e.loopOptions) {
                                d = l.find("LI:last")
                            } else {
                                d = l.find("LI:first")
                            }
                        }
                        if (++h >= f) {
                            break
                        }
                    }
                    this.addHover(d);
                    this.selectOption(d, c);
                    this.keepOptionInView(d)
                } else {
                    this.showMenu()
                }
                break;
            case 40:
            case 39:
                c.preventDefault();
                if (g.hasClass("selectBox-menuShowing")) {
                    var j = l.find(".selectBox-hover").next("LI");
                    f = l.find("LI:not(.selectBox-optgroup)").length;
                    h = 0;
                    while (0 === j.length || j.hasClass("selectBox-disabled") || j.hasClass("selectBox-optgroup")) {
                        j = j.next("LI");
                        if (j.length === 0) {
                            if (e.loopOptions) {
                                j = l.find("LI:first")
                            } else {
                                j = l.find("LI:last")
                            }
                        }
                        if (++h >= f) {
                            break
                        }
                    }
                    this.addHover(j);
                    this.selectOption(j, c);
                    this.keepOptionInView(j)
                } else {
                    this.showMenu()
                }
                break
        }
    };
    b.prototype.handleKeyPress = function(e) {
        var c = a(this.selectElement),
            f = c.data("selectBox-control"),
            d = f.data("selectBox-options");
        if (f.hasClass("selectBox-disabled")) {
            return
        }
        switch (e.keyCode) {
            case 9:
            case 27:
            case 13:
            case 38:
            case 37:
            case 40:
            case 39:
                break;
            default:
                if (!f.hasClass("selectBox-menuShowing")) {
                    this.showMenu()
                }
                e.preventDefault();
                clearTimeout(this.typeTimer);
                this.typeSearch += String.fromCharCode(e.charCode || e.keyCode);
                d.find("A").each(function() {
                    if (a(this).text().substr(0, this.typeSearch.length).toLowerCase() === this.typeSearch.toLowerCase()) {
                        this.addHover(a(this).parent());
                        this.selectOption(a(this).parent(), e);
                        this.keepOptionInView(a(this).parent());
                        return false
                    }
                });
                this.typeTimer = setTimeout(function() {
                    this.typeSearch = ""
                }, 1000);
                break
        }
    };
    b.prototype.enable = function() {
        var c = a(this.selectElement);
        c.prop("disabled", false);
        var d = c.data("selectBox-control");
        if (!d) {
            return
        }
        d.removeClass("selectBox-disabled")
    };
    b.prototype.disable = function() {
        var c = a(this.selectElement);
        c.prop("disabled", true);
        var d = c.data("selectBox-control");
        if (!d) {
            return
        }
        d.addClass("selectBox-disabled")
    };
    b.prototype.setValue = function(f) {
        var c = a(this.selectElement);
        c.val(f);
        f = c.val();
        if (null === f) {
            f = c.children().first().val();
            c.val(f)
        }
        var g = c.data("selectBox-control");
        if (!g) {
            return
        }
        var e = c.data("selectBox-settings"),
            d = g.data("selectBox-options");
        this.setLabel();
        d.find(".selectBox-selected").removeClass("selectBox-selected");
        d.find("A").each(function() {
            if (typeof(f) === "object") {
                for (var h = 0; h < f.length; h++) {
                    if (a(this).attr("rel") == f[h]) {
                        a(this).parent().addClass("selectBox-selected")
                    }
                }
            } else {
                if (a(this).attr("rel") == f) {
                    a(this).parent().addClass("selectBox-selected")
                }
            }
        });
        if (e.change) {
            e.change.call(c)
        }
    };
    b.prototype.setOptions = function(m) {
        var l = a(this.selectElement),
            f = l.data("selectBox-control"),
            d = l.data("selectBox-settings"),
            k;
        switch (typeof(m)) {
            case "string":
                l.html(m);
                break;
            case "object":
                l.html("");
                for (var g in m) {
                    if (m[g] === null) {
                        continue
                    }
                    if (typeof(m[g]) === "object") {
                        var c = a('<optgroup label="' + g + '" />');
                        for (var e in m[g]) {
                            c.append('<option value="' + e + '">' + m[g][e] + "</option>")
                        }
                        l.append(c)
                    } else {
                        var h = a('<option value="' + g + '">' + m[g] + "</option>");
                        l.append(h)
                    }
                }
                break
        }
        if (!f) {
            return
        }
        f.data("selectBox-options").remove();
        k = f.hasClass("selectBox-dropdown") ? "dropdown" : "inline";
        m = this.getOptions(k);
        f.data("selectBox-options", m);
        switch (k) {
            case "inline":
                f.append(m);
                break;
            case "dropdown":
                this.setLabel();
                a("BODY").append(m);
                break
        }
    };
    b.prototype.disableSelection = function(c) {
        a(c).css("MozUserSelect", "none").bind("selectstart", function(d) {
            d.preventDefault()
        })
    };
    b.prototype.generateOptions = function(e, f) {
        var c = a("<li />"),
            d = a("<a />");
        c.addClass(e.attr("class"));
        c.data(e.data());
        d.attr("rel", e.val()).text(e.text());
        c.append(d);
        if (e.attr("disabled")) {
            c.addClass("selectBox-disabled")
        }
        if (e.attr("selected")) {
            c.addClass("selectBox-selected")
        }
        f.append(c)
    };
    a.extend(a.fn, {
        selectBox: function(e, c) {
            var d;
            switch (e) {
                case "control":
                    return a(this).data("selectBox-control");
                case "settings":
                    if (!c) {
                        return a(this).data("selectBox-settings")
                    }
                    a(this).each(function() {
                        a(this).data("selectBox-settings", a.extend(true, a(this).data("selectBox-settings"), c))
                    });
                    break;
                case "options":
                    if (undefined === c) {
                        return a(this).data("selectBox-control").data("selectBox-options")
                    }
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.setOptions(c)
                        }
                    });
                    break;
                case "value":
                    if (undefined === c) {
                        return a(this).val()
                    }
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.setValue(c)
                        }
                    });
                    break;
                case "refresh":
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.refresh()
                        }
                    });
                    break;
                case "enable":
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.enable(this)
                        }
                    });
                    break;
                case "disable":
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.disable()
                        }
                    });
                    break;
                case "destroy":
                    a(this).each(function() {
                        if (d = a(this).data("selectBox")) {
                            d.destroy();
                            a(this).data("selectBox", null)
                        }
                    });
                    break;
                case "instance":
                    return a(this).data("selectBox");
                default:
                    a(this).each(function(g, f) {
                        if (!a(f).data("selectBox")) {
                            a(f).data("selectBox", new b(f, e))
                        }
                    });
                    break
            }
            return a(this)
        }
    })
})(jQuery);;
jQuery(document).ready(function(b) {
    function l() {
        h.off("change");
        h = b('.wishlist_table tbody input[type="checkbox"]');
        "undefined" != typeof b.fn.selectBox && b("select.selectBox").selectBox();
        k();
        m()
    }

    function t() {
        var a = b(".woocommerce-message");
        0 == a.length ? b("#yith-wcwl-form").prepend(yith_wcwl_l10n.labels.added_to_cart_message) : a.fadeOut(300, function() {
            b(this).replaceWith(yith_wcwl_l10n.labels.added_to_cart_message).fadeIn()
        })
    }

    function u(a) {
        var c = a.data("product-id"),
            d = b(".add-to-wishlist-" + c),
            c = {
                add_to_wishlist: c,
                product_type: a.data("product-type"),
                action: yith_wcwl_l10n.actions.add_to_wishlist_action
            };
        if (yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in) {
            var e = a.parents(".yith-wcwl-popup-footer").prev(".yith-wcwl-popup-content"),
                f = e.find(".wishlist-select"),
                g = e.find(".wishlist-name"),
                e = e.find(".wishlist-visibility");
            c.wishlist_id = f.val();
            c.wishlist_name = g.val();
            c.wishlist_visibility = e.val()
        }
        q() ? b.ajax({
            type: "POST",
            url: yith_wcwl_l10n.ajax_url,
            data: c,
            dataType: "json",
            beforeSend: function() {
                a.siblings(".ajax-loading").css("visibility", "visible")
            },
            complete: function() {
                a.siblings(".ajax-loading").css("visibility", "hidden")
            },
            success: function(a) {
                var c = b("#yith-wcwl-popup-message"),
                    e = a.result,
                    f = a.message;
                if (yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in) {
                    var g = b("select.wishlist-select");
                    "undefined" != typeof b.prettyPhoto && "undefined" != typeof b.prettyPhoto.close && b.prettyPhoto.close();
                    g.each(function(d) {
                        d = b(this);
                        var c = d.find("option"),
                            c = c.slice(1, c.length - 1);
                        c.remove();
                        if ("undefined" != typeof a.user_wishlists)
                            for (c in c = 0, a.user_wishlists) "1" != a.user_wishlists[c].is_default && b("<option>").val(a.user_wishlists[c].ID).html(a.user_wishlists[c].wishlist_name).insertBefore(d.find("option:last-child"))
                    })
                }
                b("#yith-wcwl-message").html(f);
                c.css("margin-left", "-" + b(c).width() + "px").fadeIn();
                window.setTimeout(function() {
                    c.fadeOut()
                }, 2E3);
                "true" == e ? ((!yith_wcwl_l10n.multi_wishlist || !yith_wcwl_l10n.is_user_logged_in || yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in && yith_wcwl_l10n.hide_add_button) && d.find(".yith-wcwl-add-button").hide().removeClass("show").addClass("hide"), d.find(".yith-wcwl-wishlistexistsbrowse").hide().removeClass("show").addClass("hide").find("a").attr("href", a.wishlist_url), d.find(".yith-wcwl-wishlistaddedbrowse").show().removeClass("hide").addClass("show").find("a").attr("href", a.wishlist_url)) : "exists" == e ? ((!yith_wcwl_l10n.multi_wishlist || !yith_wcwl_l10n.is_user_logged_in || yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in && yith_wcwl_l10n.hide_add_button) && d.find(".yith-wcwl-add-button").hide().removeClass("show").addClass("hide"), d.find(".yith-wcwl-wishlistexistsbrowse").show().removeClass("hide").addClass("show").find("a").attr("href", a.wishlist_url), d.find(".yith-wcwl-wishlistaddedbrowse").hide().removeClass("show").addClass("hide").find("a").attr("href", a.wishlist_url)) : (d.find(".yith-wcwl-add-button").show().removeClass("hide").addClass("show"), d.find(".yith-wcwl-wishlistexistsbrowse").hide().removeClass("show").addClass("hide"), d.find(".yith-wcwl-wishlistaddedbrowse").hide().removeClass("show").addClass("hide"));
                b("body").trigger("added_to_wishlist")
            }
        }) : alert(yith_wcwl_l10n.labels.cookie_disabled)
    }

    function v(a) {
        var c = a.parents(".cart.wishlist_table"),
            d = c.data("pagination"),
            e = c.data("per-page"),
            f = c.data("page");
        a = a.parents("[data-row-id]");
        c.find(".pagination-row");
        a = a.data("row-id");
        var g = c.data("id"),
            n = c.data("token"),
            d = {
                action: yith_wcwl_l10n.actions.remove_from_wishlist_action,
                remove_from_wishlist: a,
                pagination: d,
                per_page: e,
                current_page: f,
                wishlist_id: g,
                wishlist_token: n
            };
        b("#yith-wcwl-message").html("&nbsp;");
        "undefined" != typeof b.fn.block && c.fadeTo("400", "0.6").block({
            message: null,
            overlayCSS: {
                background: "transparent url(" + yith_wcwl_l10n.ajax_loader_url + ") no-repeat center",
                backgroundSize: "16px 16px",
                opacity: .6
            }
        });
        b("#yith-wcwl-form").load(yith_wcwl_l10n.ajax_url + " #yith-wcwl-form", d, function() {
            "undefined" != typeof b.fn.unblock && c.stop(!0).css("opacity", "1").unblock();
            l();
            b("body").trigger("removed_from_wishlist")
        })
    }

    function w(a, c) {
        var d = a.data("product-id"),
            e = b(document).find(".cart.wishlist_table"),
            f = e.data("pagination"),
            g = e.data("per-page"),
            n = e.data("id"),
            h = e.data("token"),
            d = {
                action: yith_wcwl_l10n.actions.reload_wishlist_and_adding_elem_action,
                pagination: f,
                per_page: g,
                wishlist_id: n,
                wishlist_token: h,
                add_to_wishlist: d,
                product_type: a.data("product-type")
            };
        q() ? b.ajax({
            type: "POST",
            url: yith_wcwl_l10n.ajax_url,
            data: d,
            dataType: "html",
            beforeSend: function() {
                "undefined" != typeof b.fn.block && e.fadeTo("400", "0.6").block({
                    message: null,
                    overlayCSS: {
                        background: "transparent url(" + yith_wcwl_l10n.ajax_loader_url + ") no-repeat center",
                        backgroundSize: "16px 16px",
                        opacity: .6
                    }
                })
            },
            success: function(a) {
                a = b(a).find("#yith-wcwl-form");
                c.replaceWith(a);
                l()
            }
        }) : alert(yith_wcwl_l10n.labels.cookie_disabled)
    }

    function x(a) {
        var c = a.parents(".cart.wishlist_table"),
            d = c.data("token"),
            e = c.data("id"),
            f = a.parents("[data-row-id]").data("row-id");
        a = a.val();
        var g = c.data("pagination"),
            h = c.data("per-page"),
            k = c.data("page"),
            d = {
                action: yith_wcwl_l10n.actions.move_to_another_wishlist_action,
                wishlist_token: d,
                wishlist_id: e,
                destination_wishlist_token: a,
                item_id: f,
                pagination: g,
                per_page: h,
                current_page: k
            };
        "" != a && ("undefined" != typeof b.fn.block && c.fadeTo("400", "0.6").block({
            message: null,
            overlayCSS: {
                background: "transparent url(" + yith_wcwl_l10n.ajax_loader_url + ") no-repeat center",
                backgroundSize: "16px 16px",
                opacity: .6
            }
        }), b("#yith-wcwl-form").load(yith_wcwl_l10n.ajax_url + " #yith-wcwl-form", d, function() {
            "undefined" != typeof b.fn.unblock && c.stop(!0).css("opacity", "1").unblock();
            l();
            b("body").trigger("moved_to_another_wishlist")
        }))
    }

    function r(a) {
        var c = b(this);
        a.preventDefault();
        c.parents(".wishlist-title").next().show();
        c.parents(".wishlist-title").hide()
    }

    function y(a) {
        var c = b(this);
        a.preventDefault();
        c.parents(".hidden-title-form").hide();
        c.parents(".hidden-title-form").prev().show()
    }

    function q() {
        if (navigator.cookieEnabled) return !0;
        document.cookie = "cookietest=1";
        var a = -1 != document.cookie.indexOf("cookietest=");
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return a
    }

    function z() {
        if (0 != b(".yith-wcwl-add-to-wishlist").length && 0 == b("#yith-wcwl-popup-message").length) {
            var a = b("<div>").attr("id", "yith-wcwl-message"),
                a = b("<div>").attr("id", "yith-wcwl-popup-message").html(a).hide();
            b("body").prepend(a)
        }
    }

    function k() {
        h.on("change", function() {
            var a = "",
                c = b(this).parents(".cart.wishlist_table"),
                d = c.data("id"),
                c = c.data("token"),
                e = document.URL;
            h.filter(":checked").each(function() {
                var c = b(this);
                a += 0 != a.length ? "," : "";
                a += c.parents("[data-row-id]").data("row-id")
            });
            e = p(e, "wishlist_products_to_add_to_cart", a);
            e = p(e, "wishlist_token", c);
            e = p(e, "wishlist_id", d);
            b("#custom_add_to_cart").attr("href", e)
        })
    }

    function m() {
        "undefined" != typeof b.prettyPhoto && b('a[data-rel^="prettyPhoto[add_to_wishlist_"]').add('a[data-rel="prettyPhoto[ask_an_estimate]"]').unbind("click").prettyPhoto({
            hook: "data-rel",
            social_tools: !1,
            theme: "pp_woocommerce",
            horizontal_padding: 20,
            opacity: .8,
            deeplinking: !1
        })
    }

    function p(a, b, d) {
        d = b + "=" + d;
        a = a.replace(new RegExp("(&|\\?)" + b + "=[^&]*"), "$1" + d); - 1 < a.indexOf(b + "=") || (a = -1 < a.indexOf("?") ? a + ("&" + d) : a + ("?" + d));
        return a
    }
    var A = "undefined" !== typeof wc_add_to_cart_params && null !== wc_add_to_cart_params ? wc_add_to_cart_params.cart_redirect_after_add : "",
        h = b('.wishlist_table tbody input[type="checkbox"]:not(:disabled)');
    b(document).on("yith_wcwl_init", function() {
        var a = b(this),
            c = b('.wishlist_table tbody input[type="checkbox"]:not(:disabled)');
        a.on("click", ".add_to_wishlist", function(a) {
            var c = b(this);
            a.preventDefault();
            u(c);
            return !1
        });
        a.on("click", ".remove_from_wishlist", function(a) {
            var c = b(this);
            a.preventDefault();
            v(c);
            return !1
        });
        a.on("adding_to_cart", "body", function(a, b, c) {
            "undefined" != typeof b && "undefined" != typeof c && 0 != b.closest(".wishlist_table").length && (c.remove_from_wishlist_after_add_to_cart = b.closest("[data-row-id]").data("row-id"), c.wishlist_id = b.closest(".wishlist_table").data("id"), wc_add_to_cart_params.cart_redirect_after_add = yith_wcwl_l10n.redirect_to_cart)
        });
        a.on("added_to_cart", "body", function(a) {
            wc_add_to_cart_params.cart_redirect_after_add = A;
            a = b(".wishlist_table");
            a.find(".added").removeClass("added");
            a.find(".added_to_cart").remove()
        });
        a.on("added_to_cart", "body", t);
        a.on("cart_page_refreshed", "body", l);
        a.on("click", ".show-title-form", r);
        a.on("click", ".wishlist-title-with-form h2", r);
        a.on("click", ".hide-title-form", y);
        a.on("change", ".change-wishlist", function(a) {
            a = b(this);
            x(a);
            return !1
        });
        a.on("change", ".yith-wcwl-popup-content .wishlist-select", function(a) {
            a = b(this);
            "new" == a.val() ? a.parents(".yith-wcwl-first-row").next(".yith-wcwl-second-row").css("display", "table-row") : a.parents(".yith-wcwl-first-row").next(".yith-wcwl-second-row").hide()
        });
        a.on("change", "#bulk_add_to_cart", function() {
            b(this).is(":checked") ? c.attr("checked", "checked").change() : c.removeAttr("checked").change()
        });
        a.on("click", "#custom_add_to_cart", function(a) {
            var d = b(this),
                f = d.parents(".cart.wishlist_table");
            yith_wcwl_l10n.ajax_add_to_cart_enabled && (a.preventDefault(), "undefined" != typeof b.fn.block && f.fadeTo("400", "0.6").block({
                message: null,
                overlayCSS: {
                    background: "transparent url(" + yith_wcwl_l10n.ajax_loader_url + ") no-repeat center",
                    backgroundSize: "16px 16px",
                    opacity: .6
                }
            }), b("#yith-wcwl-form").load(yith_wcwl_l10n.ajax_url + d.attr("href") + " #yith-wcwl-form", {
                action: yith_wcwl_l10n.actions.bulk_add_to_cart_action
            }, function() {
                "undefined" != typeof b.fn.unblock && f.stop(!0).css("opacity", "1").unblock();
                c.off("change");
                c = b('.wishlist_table tbody input[type="checkbox"]');
                "undefined" != typeof b.fn.selectBox && b("select.selectBox").selectBox();
                k();
                m()
            }))
        });
        a.on("click", ".yith-wfbt-add-wishlist", function(a) {
            a.preventDefault();
            a = b(this);
            var c = b("#yith-wcwl-form");
            b("html, body").animate({
                scrollTop: c.offset().top
            }, 500);
            w(a, c)
        });
        z();
        k();
        m()
    }).trigger("yith_wcwl_init");
    "undefined" != typeof b.fn.selectBox && b("select.selectBox").selectBox()
});;
jQuery(document).ready(function($) {
    $('.zilla-likes').live('click', function() {
        var link = $(this);
        if (link.hasClass('active')) return false;
        var id = $(this).attr('id'),
            postfix = link.find('.zilla-likes-postfix').text();
        $.post(zilla_likes.ajaxurl, {
            action: 'zilla-likes',
            likes_id: id,
            postfix: postfix
        }, function(data) {
            link.html(data).addClass('active').attr('title', 'You already like this');
        });
        return false;
    });
    if ($('body.ajax-zilla-likes').length) {
        $('.zilla-likes').each(function() {
            var id = $(this).attr('id');
            $(this).load(zilla_likes.ajaxurl, {
                action: 'zilla-likes',
                post_id: id
            });
        });
    }
});;
jQuery(function(t) {
    if ("undefined" == typeof wc_add_to_cart_params) return !1;
    var a = function() {
        t(document).on("click", ".add_to_cart_button", this.onAddToCart).on("added_to_cart", this.updateButton).on("added_to_cart", this.updateCartPage).on("added_to_cart", this.updateFragments)
    };
    a.prototype.onAddToCart = function(a) {
        var d = t(this);
        if (d.is(".ajax_add_to_cart")) {
            if (!d.attr("data-product_id")) return !0;
            a.preventDefault(), d.removeClass("added"), d.addClass("loading");
            var o = {};
            t.each(d.data(), function(t, a) {
                o[t] = a
            }), t(document.body).trigger("adding_to_cart", [d, o]), t.post(wc_add_to_cart_params.wc_ajax_url.toString().replace("%%endpoint%%", "add_to_cart"), o, function(a) {
                a && (a.error && a.product_url ? window.location = a.product_url : "yes" !== wc_add_to_cart_params.cart_redirect_after_add ? t(document.body).trigger("added_to_cart", [a.fragments, a.cart_hash, d]) : window.location = wc_add_to_cart_params.cart_url)
            })
        }
    }, a.prototype.updateButton = function(a, d, o, r) {
        (r = void 0 !== r && r) && (r.removeClass("loading"), r.addClass("added"), wc_add_to_cart_params.is_cart || 0 !== r.parent().find(".added_to_cart").length || r.after(' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' + wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + "</a>"), t(document.body).trigger("wc_cart_button_updated", [r]))
    }, a.prototype.updateCartPage = function() {
        var a = window.location.toString().replace("add-to-cart", "added-to-cart");
        t(".shop_table.cart").load(a + " .shop_table.cart:eq(0) > *", function() {
            t(".shop_table.cart").stop(!0).css("opacity", "1").unblock(), t(document.body).trigger("cart_page_refreshed")
        }), t(".cart_totals").load(a + " .cart_totals:eq(0) > *", function() {
            t(".cart_totals").stop(!0).css("opacity", "1").unblock(), t(document.body).trigger("cart_totals_refreshed")
        })
    }, a.prototype.updateFragments = function(a, d) {
        d && (t.each(d, function(a) {
            t(a).addClass("updating").fadeTo("400", "0.6").block({
                message: null,
                overlayCSS: {
                    opacity: .6
                }
            })
        }), t.each(d, function(a, d) {
            t(a).replaceWith(d), t(a).stop(!0).css("opacity", "1").unblock()
        }), t(document.body).trigger("wc_fragments_loaded"))
    }, new a
});;
window.jQuery(document).ready(function($) {
    $('body').on('adding_to_cart', function(event, $button, data) {
        $button && $button.hasClass('vc_gitem-link') && $button.addClass('vc-gitem-add-to-cart-loading-btn').parents('.vc_grid-item-mini').addClass('vc-woocommerce-add-to-cart-loading').append($('<div class="vc_wc-load-add-to-loader-wrapper"><div class="vc_wc-load-add-to-loader"></div></div>'));
    }).on('added_to_cart', function(event, fragments, cart_hash, $button) {
        if ('undefined' === typeof($button)) {
            $button = $('.vc-gitem-add-to-cart-loading-btn');
        }
        $button && $button.hasClass('vc_gitem-link') && $button.removeClass('vc-gitem-add-to-cart-loading-btn').parents('.vc_grid-item-mini').removeClass('vc-woocommerce-add-to-cart-loading').find('.vc_wc-load-add-to-loader-wrapper').remove();
    });
});;
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    var config = $.cookie = function(key, value, options) {
        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        var result = key ? undefined : {};
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
                result = read(cookie, value);
                break;
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
}));;
(function($) {
    var loaded = false,
        loading = false;
    $(window).load(function() {
        setTimeout(init, 1000);
    });

    function check_show() {
        return $(window).width() >= 800;
    }

    function load() {
        if (loading || loaded || !check_show()) {
            return false;
        }
        var data = $.extend(true, {}, window['tsc_loader_localize']);
        loading = true;
        $.ajax({
            type: "GET",
            url: data.ajax_url,
            data: {
                action: 'tsc_load',
                nonce: data.nonce,
                tsc_options: data.tsc_options
            },
            dataType: "html"
        }).done(function(html) {
            loaded = true;
            $('body').append(html);
            setTimeout(init, 1000);
        }).always(function() {
            loading = false;
        });
    }

    function init() {
        if ($.cookie('style_changer_status') == undefined || $.cookie('style_changer_status') == 'open') {
            $('.style-changer-holder').addClass('collapsed');
            setTimeout(function() {
                if ($.cookie('style_changer_status') == undefined) {
                    $('.style-changer-holder').removeClass('collapsed');
                    $.cookie('style_changer_status', 'closed', {
                        path: '/'
                    });
                }
            }, 3000);
        }
        $('.tsc-button').on('click', function(e) {
            e.preventDefault();
            $('.style-changer-holder').toggleClass('collapsed');
            if ($('.style-changer-holder').is('.collapsed')) {
                $.cookie('style_changer_status', 'open', {
                    path: '/'
                });
                $('body, html').animate({
                    scrollTop: 0
                });
            } else {
                $.cookie('style_changer_status', 'closed', {
                    path: '/'
                });
            }
        });
        $('.tsc-control-button').on('click', function(e) {
            e.preventDefault();
            var $form = $(this).closest('form');
            var $field = $('[name="tsc_options[' + $(this).data('tsc-option') + ']"]', $form);
            $field.val($(this).data('tsc-value'));
            $(this).addClass('active');
            $form.submit();
        });
        $('.tsc-presale-button').on('click', function(e) {
            e.preventDefault();
            $.fancybox.open({
                title: false,
                type: 'inline',
                src: '#presale-form',
                width: 610,
                padding: 0,
                autoSize: false,
                autoHeight: true
            });
        });
    }
})(jQuery);;
! function(a, b) {
    "use strict";

    function c() {
        if (!e) {
            e = !0;
            var a, c, d, f, g = -1 !== navigator.appVersion.indexOf("MSIE 10"),
                h = !!navigator.userAgent.match(/Trident.*rv:11\./),
                i = b.querySelectorAll("iframe.wp-embedded-content");
            for (c = 0; c < i.length; c++) {
                if (d = i[c], !d.getAttribute("data-secret")) f = Math.random().toString(36).substr(2, 10), d.src += "#?secret=" + f, d.setAttribute("data-secret", f);
                if (g || h) a = d.cloneNode(!0), a.removeAttribute("security"), d.parentNode.replaceChild(a, d)
            }
        }
    }
    var d = !1,
        e = !1;
    if (b.querySelector)
        if (a.addEventListener) d = !0;
    if (a.wp = a.wp || {}, !a.wp.receiveEmbedMessage)
        if (a.wp.receiveEmbedMessage = function(c) {
                var d = c.data;
                if (d.secret || d.message || d.value)
                    if (!/[^a-zA-Z0-9]/.test(d.secret)) {
                        var e, f, g, h, i, j = b.querySelectorAll('iframe[data-secret="' + d.secret + '"]'),
                            k = b.querySelectorAll('blockquote[data-secret="' + d.secret + '"]');
                        for (e = 0; e < k.length; e++) k[e].style.display = "none";
                        for (e = 0; e < j.length; e++)
                            if (f = j[e], c.source === f.contentWindow) {
                                if (f.removeAttribute("style"), "height" === d.message) {
                                    if (g = parseInt(d.value, 10), g > 1e3) g = 1e3;
                                    else if (~~g < 200) g = 200;
                                    f.height = g
                                }
                                if ("link" === d.message)
                                    if (h = b.createElement("a"), i = b.createElement("a"), h.href = f.getAttribute("src"), i.href = d.value, i.host === h.host)
                                        if (b.activeElement === f) a.top.location.href = d.value
                            } else;
                    }
            }, d) a.addEventListener("message", a.wp.receiveEmbedMessage, !1), b.addEventListener("DOMContentLoaded", c, !1), a.addEventListener("load", c, !1)
}(window, document);;

function vc_js() {
    vc_toggleBehaviour(), vc_tabsBehaviour(), vc_accordionBehaviour(), vc_teaserGrid(), vc_carouselBehaviour(), vc_slidersBehaviour(), vc_prettyPhoto(), vc_googleplus(), vc_pinterest(), vc_progress_bar(), vc_plugin_flexslider(), vc_google_fonts(), vc_gridBehaviour(), vc_rowBehaviour(), vc_prepareHoverBox(), vc_googleMapsPointer(), vc_ttaActivation(), jQuery(document).trigger("vc_js"), window.setTimeout(vc_waypoints, 500)
}

function getSizeName() {
    var screen_w = jQuery(window).width();
    return 1170 < screen_w ? "desktop_wide" : 960 < screen_w && 1169 > screen_w ? "desktop" : 768 < screen_w && 959 > screen_w ? "tablet" : 300 < screen_w && 767 > screen_w ? "mobile" : 300 > screen_w ? "mobile_portrait" : ""
}

function loadScript(url, $obj, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript", script.readyState && (script.onreadystatechange = function() {
        "loaded" !== script.readyState && "complete" !== script.readyState || (script.onreadystatechange = null, callback())
    }), script.src = url, $obj.get(0).appendChild(script)
}

function vc_ttaActivation() {
    jQuery("[data-vc-accordion]").on("show.vc.accordion", function(e) {
        var $ = window.jQuery,
            ui = {};
        ui.newPanel = $(this).data("vc.accordion").getTarget(), window.wpb_prepare_tab_content(e, ui)
    })
}

function vc_accordionActivate(event, ui) {
    if (ui.newPanel.length && ui.newHeader.length) {
        var $pie_charts = ui.newPanel.find(".vc_pie_chart:not(.vc_ready)"),
            $round_charts = ui.newPanel.find(".vc_round-chart"),
            $line_charts = ui.newPanel.find(".vc_line-chart"),
            $carousel = ui.newPanel.find('[data-ride="vc_carousel"]');
        void 0 !== jQuery.fn.isotope && ui.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"), ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
            var grid = jQuery(this).data("vcGrid");
            grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
        }), vc_carouselBehaviour(ui.newPanel), vc_plugin_flexslider(ui.newPanel), $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat(), $round_charts.length && jQuery.fn.vcRoundChart && $round_charts.vcRoundChart({
            reload: !1
        }), $line_charts.length && jQuery.fn.vcLineChart && $line_charts.vcLineChart({
            reload: !1
        }), $carousel.length && jQuery.fn.carousel && $carousel.carousel("resizeAction"), ui.newPanel.parents(".isotope").length && ui.newPanel.parents(".isotope").each(function() {
            jQuery(this).isotope("layout")
        })
    }
}

function initVideoBackgrounds() {
    return window.console && window.console.warn && window.console.warn("this function is deprecated use vc_initVideoBackgrounds"), vc_initVideoBackgrounds()
}

function vc_initVideoBackgrounds() {
    jQuery("[data-vc-video-bg]").each(function() {
        var youtubeUrl, youtubeId, $element = jQuery(this);
        $element.data("vcVideoBg") ? (youtubeUrl = $element.data("vcVideoBg"), youtubeId = vcExtractYoutubeId(youtubeUrl), youtubeId && ($element.find(".vc_video-bg").remove(), insertYoutubeVideoAsBackground($element, youtubeId)), jQuery(window).on("grid:items:added", function(event, $grid) {
            $element.has($grid).length && vcResizeVideoBackground($element)
        })) : $element.find(".vc_video-bg").remove()
    })
}

function insertYoutubeVideoAsBackground($element, youtubeId, counter) {
    if ("undefined" == typeof YT || void 0 === YT.Player) return 100 < (counter = void 0 === counter ? 0 : counter) ? void console.warn("Too many attempts to load YouTube api") : void setTimeout(function() {
        insertYoutubeVideoAsBackground($element, youtubeId, counter++)
    }, 100);
    var $container = $element.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");
    new YT.Player($container[0], {
        width: "100%",
        height: "100%",
        videoId: youtubeId,
        playerVars: {
            playlist: youtubeId,
            iv_load_policy: 3,
            enablejsapi: 1,
            disablekb: 1,
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            rel: 0,
            loop: 1,
            wmode: "transparent"
        },
        events: {
            onReady: function(event) {
                event.target.mute().setLoop(!0)
            }
        }
    }), vcResizeVideoBackground($element), jQuery(window).bind("resize", function() {
        vcResizeVideoBackground($element)
    })
}

function vcResizeVideoBackground($element) {
    var iframeW, iframeH, marginLeft, marginTop, containerW = $element.innerWidth(),
        containerH = $element.innerHeight();
    containerW / containerH < 16 / 9 ? (iframeW = containerH * (16 / 9), iframeH = containerH, marginLeft = -Math.round((iframeW - containerW) / 2) + "px", marginTop = -Math.round((iframeH - containerH) / 2) + "px", iframeW += "px", iframeH += "px") : (iframeW = containerW, iframeH = containerW * (9 / 16), marginTop = -Math.round((iframeH - containerH) / 2) + "px", marginLeft = -Math.round((iframeW - containerW) / 2) + "px", iframeW += "px", iframeH += "px"), $element.find(".vc_video-bg iframe").css({
        maxWidth: "1000%",
        marginLeft: marginLeft,
        marginTop: marginTop,
        width: iframeW,
        height: iframeH
    })
}

function vcExtractYoutubeId(url) {
    if (void 0 === url) return !1;
    var id = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    return null !== id && id[1]
}

function vc_googleMapsPointer() {
    var $ = window.jQuery,
        $wpbGmapsWidget = $(".wpb_gmaps_widget");
    $wpbGmapsWidget.click(function() {
        $("iframe", this).css("pointer-events", "auto")
    }), $wpbGmapsWidget.mouseleave(function() {
        $("iframe", this).css("pointer-events", "none")
    }), $(".wpb_gmaps_widget iframe").css("pointer-events", "none")
}

function vc_setHoverBoxPerspective(hoverBox) {
    hoverBox.each(function() {
        var $this = jQuery(this),
            width = $this.width(),
            perspective = 4 * width + "px";
        $this.css("perspective", perspective)
    })
}

function vc_setHoverBoxHeight(hoverBox) {
    hoverBox.each(function() {
        var $this = jQuery(this),
            hoverBoxInner = $this.find(".vc-hoverbox-inner");
        hoverBoxInner.css("min-height", 0);
        var frontHeight = $this.find(".vc-hoverbox-front-inner").outerHeight(),
            backHeight = $this.find(".vc-hoverbox-back-inner").outerHeight(),
            hoverBoxHeight = frontHeight > backHeight ? frontHeight : backHeight;
        hoverBoxHeight < 250 && (hoverBoxHeight = 250), hoverBoxInner.css("min-height", hoverBoxHeight + "px")
    })
}

function vc_prepareHoverBox() {
    var hoverBox = jQuery(".vc-hoverbox");
    vc_setHoverBoxHeight(hoverBox), vc_setHoverBoxPerspective(hoverBox)
}
document.documentElement.className += " js_active ", document.documentElement.className += "ontouchstart" in document.documentElement ? " vc_mobile " : " vc_desktop ",
    function() {
        for (var prefix = ["-webkit-", "-moz-", "-ms-", "-o-", ""], i = 0; i < prefix.length; i++) prefix[i] + "transform" in document.documentElement.style && (document.documentElement.className += " vc_transform ")
    }(), "function" != typeof window.vc_plugin_flexslider && (window.vc_plugin_flexslider = function($parent) {
        ($parent ? $parent.find(".wpb_flexslider") : jQuery(".wpb_flexslider")).each(function() {
            var this_element = jQuery(this),
                sliderTimeout = 1e3 * parseInt(this_element.attr("data-interval")),
                sliderFx = this_element.attr("data-flex_fx"),
                slideshow = !0;
            0 === sliderTimeout && (slideshow = !1), this_element.is(":visible") && this_element.flexslider({
                animation: sliderFx,
                slideshow: slideshow,
                slideshowSpeed: sliderTimeout,
                sliderSpeed: 800,
                smoothHeight: !0
            })
        })
    }), "function" != typeof window.vc_googleplus && (window.vc_googleplus = function() {
        0 < jQuery(".wpb_googleplus").length && function() {
            var po = document.createElement("script");
            po.type = "text/javascript", po.async = !0, po.src = "../../../apis.google.com/js/plusone.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(po, s)
        }()
    }), "function" != typeof window.vc_pinterest && (window.vc_pinterest = function() {
        0 < jQuery(".wpb_pinterest").length && function() {
            var po = document.createElement("script");
            po.type = "text/javascript", po.async = !0, po.src = "../../../assets.pinterest.com/js/pinit.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(po, s)
        }()
    }), "function" != typeof window.vc_progress_bar && (window.vc_progress_bar = function() {
        void 0 !== jQuery.fn.waypoint && jQuery(".vc_progress_bar").waypoint(function() {
            jQuery(this).find(".vc_single_bar").each(function(index) {
                var $this = jQuery(this),
                    bar = $this.find(".vc_bar"),
                    val = bar.data("percentage-value");
                setTimeout(function() {
                    bar.css({
                        width: val + "%"
                    })
                }, 200 * index)
            })
        }, {
            offset: "85%"
        })
    }), "function" != typeof window.vc_waypoints && (window.vc_waypoints = function() {
        void 0 !== jQuery.fn.waypoint && jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").waypoint(function() {
            jQuery(this).addClass("wpb_start_animation animated")
        }, {
            offset: "85%"
        })
    }), "function" != typeof window.vc_toggleBehaviour && (window.vc_toggleBehaviour = function($el) {
        function event(e) {
            e && e.preventDefault && e.preventDefault();
            var title = jQuery(this),
                element = title.closest(".vc_toggle"),
                content = element.find(".vc_toggle_content");
            element.hasClass("vc_toggle_active") ? content.slideUp({
                duration: 300,
                complete: function() {
                    element.removeClass("vc_toggle_active")
                }
            }) : content.slideDown({
                duration: 300,
                complete: function() {
                    element.addClass("vc_toggle_active")
                }
            })
        }
        $el ? $el.hasClass("vc_toggle_title") ? $el.unbind("click").click(event) : $el.find(".vc_toggle_title").unbind("click").click(event) : jQuery(".vc_toggle_title").unbind("click").on("click", event)
    }), "function" != typeof window.vc_tabsBehaviour && (window.vc_tabsBehaviour = function($tab) {
        if (jQuery.ui) {
            var $call = $tab || jQuery(".wpb_tabs, .wpb_tour"),
                ver = jQuery.ui && jQuery.ui.version ? jQuery.ui.version.split(".") : "1.10",
                old_version = 1 === parseInt(ver[0]) && 9 > parseInt(ver[1]);
            $call.each(function(index) {
                var $tabs, interval = jQuery(this).attr("data-interval"),
                    tabs_array = [];
                if ($tabs = jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({
                        show: function(event, ui) {
                            wpb_prepare_tab_content(event, ui)
                        },
                        beforeActivate: function(event, ui) {
                            1 !== ui.newPanel.index() && ui.newPanel.find(".vc_pie_chart:not(.vc_ready)")
                        },
                        activate: function(event, ui) {
                            wpb_prepare_tab_content(event, ui)
                        }
                    }), interval && 0 < interval) try {
                    $tabs.tabs("rotate", 1e3 * interval)
                } catch (e) {
                    window.console && window.console.log && console.log(e)
                }
                jQuery(this).find(".wpb_tab").each(function() {
                    tabs_array.push(this.id)
                }), jQuery(this).find(".wpb_tabs_nav li").click(function(e) {
                    return e.preventDefault(), old_version ? $tabs.tabs("select", jQuery("a", this).attr("href")) : $tabs.tabs("option", "active", jQuery(this).index()), !1
                }), jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").click(function(e) {
                    if (e.preventDefault(), old_version) {
                        var index = $tabs.tabs("option", "selected");
                        jQuery(this).parent().hasClass("wpb_next_slide") ? index++ : index--, 0 > index ? index = $tabs.tabs("length") - 1 : index >= $tabs.tabs("length") && (index = 0), $tabs.tabs("select", index)
                    } else {
                        var index = $tabs.tabs("option", "active"),
                            length = $tabs.find(".wpb_tab").length;
                        index = jQuery(this).parent().hasClass("wpb_next_slide") ? index + 1 >= length ? 0 : index + 1 : 0 > index - 1 ? length - 1 : index - 1, $tabs.tabs("option", "active", index)
                    }
                })
            })
        }
    }), "function" != typeof window.vc_accordionBehaviour && (window.vc_accordionBehaviour = function() {
        jQuery(".wpb_accordion").each(function(index) {
            var $tabs, $this = jQuery(this),
                active_tab = ($this.attr("data-interval"), !isNaN(jQuery(this).data("active-tab")) && 0 < parseInt($this.data("active-tab")) && parseInt($this.data("active-tab")) - 1),
                collapsible = !1 === active_tab || "yes" === $this.data("collapsible");
            $tabs = $this.find(".wpb_accordion_wrapper").accordion({
                header: "> div > h3",
                autoHeight: !1,
                heightStyle: "content",
                active: active_tab,
                collapsible: collapsible,
                navigation: !0,
                activate: vc_accordionActivate,
                change: function(event, ui) {
                    void 0 !== jQuery.fn.isotope && ui.newContent.find(".isotope").isotope("layout"), vc_carouselBehaviour(ui.newPanel)
                }
            }), !0 === $this.data("vcDisableKeydown") && ($tabs.data("uiAccordion")._keydown = function() {})
        })
    }), "function" != typeof window.vc_teaserGrid && (window.vc_teaserGrid = function() {
        var layout_modes = {
            fitrows: "fitRows",
            masonry: "masonry"
        };
        jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function() {
            var $container = jQuery(this),
                $thumbs = $container.find(".wpb_thumbnails"),
                layout_mode = $thumbs.attr("data-layout-mode");
            $thumbs.isotope({
                itemSelector: ".isotope-item",
                layoutMode: void 0 === layout_modes[layout_mode] ? "fitRows" : layout_modes[layout_mode]
            }), $container.find(".categories_filter a").data("isotope", $thumbs).click(function(e) {
                e.preventDefault();
                var $thumbs = jQuery(this).data("isotope");
                jQuery(this).parent().parent().find(".active").removeClass("active"), jQuery(this).parent().addClass("active"), $thumbs.isotope({
                    filter: jQuery(this).attr("data-filter")
                })
            }), jQuery(window).bind("load resize", function() {
                $thumbs.isotope("layout")
            })
        })
    }), "function" != typeof window.vc_carouselBehaviour && (window.vc_carouselBehaviour = function($parent) {
        ($parent ? $parent.find(".wpb_carousel") : jQuery(".wpb_carousel")).each(function() {
            var $this = jQuery(this);
            if (!0 !== $this.data("carousel_enabled") && $this.is(":visible")) {
                $this.data("carousel_enabled", !0), getColumnsCount(jQuery(this)), jQuery(this).hasClass("columns_count_1");
                var carousele_li = jQuery(this).find(".wpb_thumbnails-fluid li");
                carousele_li.css({
                    "margin-right": carousele_li.css("margin-left"),
                    "margin-left": 0
                });
                var fluid_ul = jQuery(this).find("ul.wpb_thumbnails-fluid");
                fluid_ul.width(fluid_ul.width() + 300), jQuery(window).resize(function() {
                    var before_resize = screen_size;
                    screen_size = getSizeName(), before_resize != screen_size && window.setTimeout("location.reload()", 20)
                })
            }
        })
    }), "function" != typeof window.vc_slidersBehaviour && (window.vc_slidersBehaviour = function() {
        jQuery(".wpb_gallery_slides").each(function(index) {
            var $imagesGrid, this_element = jQuery(this);
            if (this_element.hasClass("wpb_slider_nivo")) {
                var sliderTimeout = 1e3 * this_element.attr("data-interval");
                0 === sliderTimeout && (sliderTimeout = 9999999999), this_element.find(".nivoSlider").nivoSlider({
                    effect: "boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",
                    slices: 15,
                    boxCols: 8,
                    boxRows: 4,
                    animSpeed: 800,
                    pauseTime: sliderTimeout,
                    startSlide: 0,
                    directionNav: !0,
                    directionNavHide: !0,
                    controlNav: !0,
                    keyboardNav: !1,
                    pauseOnHover: !0,
                    manualAdvance: !1,
                    prevText: "Prev",
                    nextText: "Next"
                })
            } else this_element.hasClass("wpb_image_grid") && (jQuery.fn.imagesLoaded ? $imagesGrid = this_element.find(".wpb_image_grid_ul").imagesLoaded(function() {
                $imagesGrid.isotope({
                    itemSelector: ".isotope-item",
                    layoutMode: "fitRows"
                })
            }) : this_element.find(".wpb_image_grid_ul").isotope({
                itemSelector: ".isotope-item",
                layoutMode: "fitRows"
            }))
        })
    }), "function" != typeof window.vc_prettyPhoto && (window.vc_prettyPhoto = function() {
        try {
            jQuery && jQuery.fn && jQuery.fn.prettyPhoto && jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({
                animationSpeed: "normal",
                hook: "data-rel",
                padding: 15,
                opacity: .7,
                showTitle: !0,
                allowresize: !0,
                counter_separator_label: "/",
                hideflash: !1,
                deeplinking: !1,
                modal: !1,
                callback: function() {
                    location.href.indexOf("#!prettyPhoto") > -1 && (location.hash = "")
                },
                social_tools: ""
            })
        } catch (err) {
            window.console && window.console.log && console.log(err)
        }
    }), "function" != typeof window.vc_google_fonts && (window.vc_google_fonts = function() {
        return !1
    }), window.vcParallaxSkroll = !1, "function" != typeof window.vc_rowBehaviour && (window.vc_rowBehaviour = function() {
        function fullWidthRow() {
            var $elements = $('[data-vc-full-width="true"]');
            $.each($elements, function(key, item) {
                var $el = $(this);
                $el.addClass("vc_hidden");
                var $el_full = $el.next(".vc_row-full-width");
                if ($el_full.length || ($el_full = $el.parent().next(".vc_row-full-width")), $el_full.length) {
                    var el_margin_left = parseInt($el.css("margin-left"), 10),
                        el_margin_right = parseInt($el.css("margin-right"), 10),
                        offset = 0 - $el_full.offset().left - el_margin_left,
                        width = $(window).width();
                    if ($el.css({
                            position: "relative",
                            left: offset,
                            "box-sizing": "border-box",
                            width: $(window).width()
                        }), !$el.data("vcStretchContent")) {
                        var padding = -1 * offset;
                        0 > padding && (padding = 0);
                        var paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right;
                        0 > paddingRight && (paddingRight = 0), $el.css({
                            "padding-left": padding + "px",
                            "padding-right": paddingRight + "px"
                        })
                    }
                    $el.attr("data-vc-full-width-init", "true"), $el.removeClass("vc_hidden"), $(document).trigger("vc-full-width-row-single", {
                        el: $el,
                        offset: offset,
                        marginLeft: el_margin_left,
                        marginRight: el_margin_right,
                        elFull: $el_full,
                        width: width
                    })
                }
            }), $(document).trigger("vc-full-width-row", $elements)
        }

        function fullHeightRow() {
            var $element = $(".vc_row-o-full-height:first");
            if ($element.length) {
                var $window, windowHeight, offsetTop, fullHeight;
                $window = $(window), windowHeight = $window.height(), offsetTop = $element.offset().top, offsetTop < windowHeight && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh"))
            }
            $(document).trigger("vc-full-height-row", $element)
        }
        var $ = window.jQuery;
        $(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour", fullWidthRow).on("resize.vcRowBehaviour", fullHeightRow), fullWidthRow(), fullHeightRow(),
            function() {
                (window.navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) && $(".vc_row-o-full-height").each(function() {
                    "flex" === $(this).css("display") && $(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')
                })
            }(), vc_initVideoBackgrounds(),
            function() {
                var vcSkrollrOptions, callSkrollInit = !1;
                window.vcParallaxSkroll && window.vcParallaxSkroll.destroy(), $(".vc_parallax-inner").remove(), $("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"), $("[data-vc-parallax]").each(function() {
                    var skrollrSpeed, skrollrSize, skrollrStart, skrollrEnd, $parallaxElement, parallaxImage, youtubeId;
                    callSkrollInit = !0, "on" === $(this).data("vcParallaxOFade") && $(this).children().attr("data-5p-top-bottom", "opacity:0;").attr("data-30p-top-bottom", "opacity:1;"), skrollrSize = 100 * $(this).data("vcParallax"), $parallaxElement = $("<div />").addClass("vc_parallax-inner").appendTo($(this)), $parallaxElement.height(skrollrSize + "%"), parallaxImage = $(this).data("vcParallaxImage"), youtubeId = vcExtractYoutubeId(parallaxImage), youtubeId ? insertYoutubeVideoAsBackground($parallaxElement, youtubeId) : void 0 !== parallaxImage && $parallaxElement.css("background-image", "url(" + parallaxImage + ")"), skrollrSpeed = skrollrSize - 100, skrollrStart = -skrollrSpeed, skrollrEnd = 0, $parallaxElement.attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: " + skrollrEnd + "%;")
                }), !(!callSkrollInit || !window.skrollr) && (vcSkrollrOptions = {
                    forceHeight: !1,
                    smoothScrolling: !1,
                    mobileCheck: function() {
                        return !1
                    }
                }, window.vcParallaxSkroll = skrollr.init(vcSkrollrOptions), window.vcParallaxSkroll)
            }()
    }), "function" != typeof window.vc_gridBehaviour && (window.vc_gridBehaviour = function() {
        jQuery.fn.vcGrid && jQuery("[data-vc-grid]").vcGrid()
    }), "function" != typeof window.getColumnsCount && (window.getColumnsCount = function(el) {
        for (var find = !1, i = 1; !1 === find;) {
            if (el.hasClass("columns_count_" + i)) return find = !0, i;
            i++
        }
    });
var screen_size = getSizeName();
"function" != typeof window.wpb_prepare_tab_content && (window.wpb_prepare_tab_content = function(event, ui) {
    var $ui_panel, $google_maps, panel = ui.panel || ui.newPanel,
        $pie_charts = panel.find(".vc_pie_chart:not(.vc_ready)"),
        $round_charts = panel.find(".vc_round-chart"),
        $line_charts = panel.find(".vc_line-chart"),
        $carousel = panel.find('[data-ride="vc_carousel"]');
    if (vc_carouselBehaviour(), vc_plugin_flexslider(panel), ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
            var grid = jQuery(this).data("vcGrid");
            grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
        }), panel.find(".vc_masonry_media_grid, .vc_masonry_grid").length && panel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function() {
            var grid = jQuery(this).data("vcGrid");
            grid && grid.gridBuilder && grid.gridBuilder.setMasonry && grid.gridBuilder.setMasonry()
        }), $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat(), $round_charts.length && jQuery.fn.vcRoundChart && $round_charts.vcRoundChart({
            reload: !1
        }), $line_charts.length && jQuery.fn.vcLineChart && $line_charts.vcLineChart({
            reload: !1
        }), $carousel.length && jQuery.fn.carousel && $carousel.carousel("resizeAction"), $ui_panel = panel.find(".isotope, .wpb_image_grid_ul"), $google_maps = panel.find(".wpb_gmaps_widget"), 0 < $ui_panel.length && $ui_panel.isotope("layout"), $google_maps.length && !$google_maps.is(".map_ready")) {
        var $frame = $google_maps.find("iframe");
        $frame.attr("src", $frame.attr("src")), $google_maps.addClass("map_ready")
    }
    panel.parents(".isotope").length && panel.parents(".isotope").each(function() {
        jQuery(this).isotope("layout")
    })
}), window.vc_googleMapsPointer, jQuery(document).ready(vc_prepareHoverBox), jQuery(window).resize(vc_prepareHoverBox), jQuery(document).ready(function($) {
    window.vc_js()
});;
(function($) {
    $(function() {
        $('.quickfinder-item').each(function() {
            var $item = $(this);
            var $quickfinder = $item.closest('.quickfinder');
            var initHover = {
                icon_color1: $('.gem-icon-half-1', $item).css('color'),
                icon_color2: $('.gem-icon-half-2', $item).css('color'),
                icon_background: $('.gem-icon-inner', $item).css('background-color'),
                icon_border: $('.gem-icon', $item).css('border-left-color'),
                box_color: $('.quickfinder-item-box', $item).css('background-color'),
                border_color: $('.quickfinder-item-box', $item).css('border-left-color'),
                title_color: $('.quickfinder-item-title', $item).css('color'),
                description_color: $('.quickfinder-item-text', $item).css('color'),
                button_text_color: $('.quickfinder-button .gem-button', $item).css('color'),
                button_background_color: $('.quickfinder-button .gem-button', $item).css('background-color'),
                button_border_color: $('.quickfinder-button .gem-button', $item).css('border-left-color')
            };
            if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                initHover.icon_background = $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color');
                initHover.icon_border = $('.gem-icon .gem-icon-shape-hexagon-back-inner-before', $item).css('background-color');
            }
            $item.data('initHover', initHover);
            if ($('a', $item).length) {
                if ($item.hasClass('quickfinder-item-effect-background-reverse') || $item.hasClass('quickfinder-item-effect-border-reverse') && !$item.hasClass('border-reverse-with-background')) {
                    $('.gem-icon-inner', $item).prepend('<div class="quickfinder-animation"/>');
                }
            }
        });
        $('body').on('mouseenter', '.quickfinder-item a', function() {
            var $item = $(this).closest('.quickfinder-item');
            var $quickfinder = $item.closest('.quickfinder');
            var initHover = $item.data('initHover');
            $item.addClass('hover');
            if ($quickfinder.data('hover-icon-color')) {
                if ($item.hasClass('quickfinder-item-effect-background-reverse')) {
                    if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                        $('.gem-icon .gem-icon-shape-hexagon-back-inner-before', $item).css('background-color', $quickfinder.data('hover-icon-color'));
                        $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color', '#ffffff');
                    } else {
                        $('.gem-icon', $item).css('border-color', $quickfinder.data('hover-icon-color'));
                        $('.gem-icon-inner', $item).css('background-color', $quickfinder.data('hover-icon-color'));
                    }
                    $('.gem-icon-half-1', $item).css('color', $quickfinder.data('hover-icon-color'));
                    $('.gem-icon-half-2', $item).css('color', $quickfinder.data('hover-icon-color'));
                }
                if ($item.hasClass('quickfinder-item-effect-border-reverse')) {
                    if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                        $('.gem-icon .gem-icon-shape-hexagon-back-inner-before', $item).css('background-color', $quickfinder.data('hover-icon-color'));
                        $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color', $quickfinder.data('hover-icon-color'));
                    } else {
                        $('.gem-icon', $item).css('border-color', $quickfinder.data('hover-icon-color'));
                        $('.gem-icon-inner', $item).css('background-color', $quickfinder.data('hover-icon-color'));
                    }
                    $('.gem-icon-half-1', $item).css('color', '#ffffff');
                    $('.gem-icon-half-2', $item).css('color', '#ffffff');
                }
                if ($item.hasClass('quickfinder-item-effect-simple')) {
                    $('.gem-icon-half-1', $item).css('color', $quickfinder.data('hover-icon-color'));
                    $('.gem-icon-half-2', $item).css('color', $quickfinder.data('hover-icon-color'));
                }
            } else {
                if ($item.hasClass('quickfinder-item-effect-background-reverse')) {
                    if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                        $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color', '#ffffff');
                    } else {
                        $('.gem-icon', $item).css('border-color', $quickfinder.data('hover-icon-color'));
                    }
                    if (initHover.icon_color1 == '#ffffff' || initHover.icon_color1 == 'rgb(255, 255, 255)') {
                        $('.gem-icon-half-1', $item).css('color', initHover.icon_border);
                    }
                    if (initHover.icon_color2 == '#ffffff' || initHover.icon_color2 == 'rgb(255, 255, 255)') {
                        $('.gem-icon-half-2', $item).css('color', initHover.icon_border);
                    }
                }
                if ($item.hasClass('quickfinder-item-effect-border-reverse')) {
                    if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                        $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color', initHover.icon_border);
                    } else {
                        $('.gem-icon-inner', $item).css('background-color', initHover.icon_border);
                    }
                    $('.gem-icon-half-1', $item).css('color', '#ffffff');
                    $('.gem-icon-half-2', $item).css('color', '#ffffff');
                }
            }
            if ($quickfinder.data('hover-box-color') && !$quickfinder.hasClass('quickfinder-style-default') && !$quickfinder.hasClass('quickfinder-style-vertical')) {
                $('.quickfinder-item-box', $item).css('background-color', $quickfinder.data('hover-box-color'));
            }
            if ($quickfinder.data('hover-border-color') && !$quickfinder.hasClass('quickfinder-style-default') && !$quickfinder.hasClass('quickfinder-style-vertical')) {
                $('.quickfinder-item-box', $item).css('border-color', $quickfinder.data('hover-border-color'));
            }
            if ($quickfinder.data('hover-title-color')) {
                $('.quickfinder-item-title', $item).css('color', $quickfinder.data('hover-title-color'));
            }
            if ($quickfinder.data('hover-description-color')) {
                $('.quickfinder-item-text', $item).css('color', $quickfinder.data('hover-description-color'));
            }
            if ($quickfinder.data('hover-button-text-color')) {
                $('.quickfinder-button .gem-button', $item).css('color', $quickfinder.data('hover-button-text-color'));
            }
            if ($quickfinder.data('hover-button-background-color')) {
                $('.quickfinder-button .gem-button', $item).css('background-color', $quickfinder.data('hover-button-background-color'));
            }
            if ($quickfinder.data('hover-button-border-color')) {
                $('.quickfinder-button .gem-button', $item).css('border-color', $quickfinder.data('hover-button-border-color'));
            }
        });
        $('body').on('mouseleave', '.quickfinder-item a', function() {
            var $item = $(this).closest('.quickfinder-item');
            var $quickfinder = $item.closest('.quickfinder');
            var initHover = $item.data('initHover');
            $item.removeClass('hover');
            $('.gem-icon', $item).css('border-color', initHover.icon_border);
            $('.gem-icon-inner', $item).css('background-color', initHover.icon_background);
            $('.gem-icon-half-1', $item).css('color', initHover.icon_color1);
            $('.gem-icon-half-2', $item).css('color', initHover.icon_color2);
            $('.quickfinder-item-box', $item).css('background-color', initHover.box_color);
            $('.quickfinder-item-box', $item).css('border-color', initHover.border_color);
            $('.quickfinder-item-title', $item).css('color', initHover.title_color);
            $('.quickfinder-item-text', $item).css('color', initHover.description_color);
            $('.quickfinder-button .gem-button', $item).css('color', initHover.button_text_color);
            $('.quickfinder-button .gem-button', $item).css('background-color', initHover.button_background_color);
            $('.quickfinder-button .gem-button', $item).css('border-color', initHover.button_border_color);
            if ($('.gem-icon', $item).hasClass('gem-icon-shape-hexagon')) {
                $('.gem-icon .gem-icon-shape-hexagon-top-inner-before', $item).css('background-color', initHover.icon_background);
                $('.gem-icon .gem-icon-shape-hexagon-back-inner-before', $item).css('background-color', initHover.icon_border);
            }
        });
    });
})(jQuery);;
(function() {
    "use strict";

    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if ("object" == typeof a) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if ("object" === c)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a
}).call(this),
    function(a) {
        function b(b) {
            var c = a.event;
            return c.target = c.target || c.srcElement || b, c
        }
        var c = document.documentElement,
            d = function() {};
        c.addEventListener ? d = function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : c.attachEvent && (d = function(a, c, d) {
            a[c + d] = d.handleEvent ? function() {
                var c = b(a);
                d.handleEvent.call(d, c)
            } : function() {
                var c = b(a);
                d.call(a, c)
            }, a.attachEvent("on" + c, a[c + d])
        });
        var e = function() {};
        c.removeEventListener ? e = function(a, b, c) {
            a.removeEventListener(b, c, !1)
        } : c.detachEvent && (e = function(a, b, c) {
            a.detachEvent("on" + b, a[b + c]);
            try {
                delete a[b + c]
            } catch (d) {
                a[b + c] = void 0
            }
        });
        var f = {
            bind: d,
            unbind: e
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", f) : a.eventie = f
    }(this),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof module && module.exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("eventie")) : a.imagesLoaded = b(a, a.EventEmitter, a.eventie)
    }(window, function(a, b, c) {
        function d(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }

        function e(a) {
            return "[object Array]" == l.call(a)
        }

        function f(a) {
            var b = [];
            if (e(a)) b = a;
            else if ("number" == typeof a.length)
                for (var c = 0; c < a.length; c++) b.push(a[c]);
            else b.push(a);
            return b
        }

        function g(a, b, c) {
            if (!(this instanceof g)) return new g(a, b, c);
            "string" == typeof a && (a = document.querySelectorAll(a)), this.elements = f(a), this.options = d({}, this.options), "function" == typeof b ? c = b : d(this.options, b), c && this.on("always", c), this.getImages(), j && (this.jqDeferred = new j.Deferred);
            var e = this;
            setTimeout(function() {
                e.check()
            })
        }

        function h(a) {
            this.img = a
        }

        function i(a, b) {
            this.url = a, this.element = b, this.img = new Image
        }
        var j = a.jQuery,
            k = a.console,
            l = Object.prototype.toString;
        g.prototype = new b, g.prototype.options = {}, g.prototype.getImages = function() {
            this.images = [];
            for (var a = 0; a < this.elements.length; a++) {
                var b = this.elements[a];
                this.addElementImages(b)
            }
        }, g.prototype.addElementImages = function(a) {
            "IMG" == a.nodeName && this.addImage(a), this.options.background === !0 && this.addElementBackgroundImages(a);
            var b = a.nodeType;
            if (b && m[b]) {
                for (var c = a.querySelectorAll("img"), d = 0; d < c.length; d++) {
                    var e = c[d];
                    this.addImage(e)
                }
                if ("string" == typeof this.options.background) {
                    var f = a.querySelectorAll(this.options.background);
                    for (d = 0; d < f.length; d++) {
                        var g = f[d];
                        this.addElementBackgroundImages(g)
                    }
                }
            }
        };
        var m = {
            1: !0,
            9: !0,
            11: !0
        };
        g.prototype.addElementBackgroundImages = function(a) {
            for (var b = n(a), c = /url\(['"]*([^'"\)]+)['"]*\)/gi, d = c.exec(b.backgroundImage); null !== d;) {
                var e = d && d[1];
                e && this.addBackground(e, a), d = c.exec(b.backgroundImage)
            }
        };
        var n = a.getComputedStyle || function(a) {
            return a.currentStyle
        };
        return g.prototype.addImage = function(a) {
            var b = new h(a);
            this.images.push(b)
        }, g.prototype.addBackground = function(a, b) {
            var c = new i(a, b);
            this.images.push(c)
        }, g.prototype.check = function() {
            function a(a, c, d) {
                setTimeout(function() {
                    b.progress(a, c, d)
                })
            }
            var b = this;
            if (this.progressedCount = 0, this.hasAnyBroken = !1, !this.images.length) return void this.complete();
            for (var c = 0; c < this.images.length; c++) {
                var d = this.images[c];
                d.once("progress", a), d.check()
            }
        }, g.prototype.progress = function(a, b, c) {
            this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emit("progress", this, a, b), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && k && k.log("progress: " + c, a, b)
        }, g.prototype.complete = function() {
            var a = this.hasAnyBroken ? "fail" : "done";
            if (this.isComplete = !0, this.emit(a, this), this.emit("always", this), this.jqDeferred) {
                var b = this.hasAnyBroken ? "reject" : "resolve";
                this.jqDeferred[b](this)
            }
        }, h.prototype = new b, h.prototype.check = function() {
            var a = this.getIsImageComplete();
            return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, c.bind(this.proxyImage, "load", this), c.bind(this.proxyImage, "error", this), c.bind(this.img, "load", this), c.bind(this.img, "error", this), void(this.proxyImage.src = this.img.src))
        }, h.prototype.getIsImageComplete = function() {
            return this.img.complete && void 0 !== this.img.naturalWidth
        }, h.prototype.confirm = function(a, b) {
            this.isLoaded = a, this.emit("progress", this, this.img, b)
        }, h.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, h.prototype.onload = function() {
            this.confirm(!0, "onload"), this.unbindEvents()
        }, h.prototype.onerror = function() {
            this.confirm(!1, "onerror"), this.unbindEvents()
        }, h.prototype.unbindEvents = function() {
            c.unbind(this.proxyImage, "load", this), c.unbind(this.proxyImage, "error", this), c.unbind(this.img, "load", this), c.unbind(this.img, "error", this)
        }, i.prototype = new h, i.prototype.check = function() {
            c.bind(this.img, "load", this), c.bind(this.img, "error", this), this.img.src = this.url;
            var a = this.getIsImageComplete();
            a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
        }, i.prototype.unbindEvents = function() {
            c.unbind(this.img, "load", this), c.unbind(this.img, "error", this)
        }, i.prototype.confirm = function(a, b) {
            this.isLoaded = a, this.emit("progress", this, this.element, b)
        }, g.makeJQueryPlugin = function(b) {
            b = b || a.jQuery, b && (j = b, j.fn.imagesLoaded = function(a, b) {
                var c = new g(this, a, b);
                return c.jqDeferred.promise(j(this))
            })
        }, g.makeJQueryPlugin(), g
    });;
/*!
 * Isotope PACKAGED v2.2.2
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

! function(a) {
    function b() {}

    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }

        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                            k = a.data(j, b);
                        if (k)
                            if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                var l = k[e].apply(k, g);
                                if (void 0 !== l) return l
                            } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b)
            }, a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
}(window),
function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c
    }
    var c = document.documentElement,
        d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        } : function() {
            var c = b(a);
            d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch (d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
}(window),
function() {
    "use strict";

    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if (a instanceof RegExp) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if (a instanceof RegExp)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
}.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a, b) {
        function c(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function d() {}

        function e() {
            for (var a = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, b = 0, c = h.length; c > b; b++) {
                var d = h[b];
                a[d] = 0
            }
            return a
        }

        function f(b) {
            function d() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || g("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = b("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var f = document.body || document.documentElement;
                        f.appendChild(e);
                        var h = j(e);
                        l = 200 === c(h.width), f.removeChild(e)
                    }
                }
            }

            function f(a) {
                if (d(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var b = j(a);
                    if ("none" === b.display) return e();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var g = f.isBorderBox = !(!k || !b[k] || "border-box" !== b[k]), m = 0, n = h.length; n > m; m++) {
                        var o = h[m],
                            p = b[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = g && l,
                        y = c(b.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = c(b.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return f
        }
        var g = "undefined" == typeof console ? d : function(a) {
                console.error(a)
            },
            h = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], f) : "object" == typeof exports ? module.exports = f(require("desandro-get-style-property")) : a.getSize = f(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a) {
            "function" == typeof a && (b.isReady ? a() : g.push(a))
        }

        function c(a) {
            var c = "readystatechange" === a.type && "complete" !== f.readyState;
            b.isReady || c || d()
        }

        function d() {
            b.isReady = !0;
            for (var a = 0, c = g.length; c > a; a++) {
                var d = g[a];
                d()
            }
        }

        function e(e) {
            return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
        }
        var f = a.document,
            g = [];
        b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
    }(window),
    function(a) {
        "use strict";

        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matches) return "matches";
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
    }(window, function(a, b, c) {
        var d = {};
        d.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, d.modulo = function(a, b) {
            return (a % b + b) % b
        };
        var e = Object.prototype.toString;
        d.isArray = function(a) {
            return "[object Array]" == e.call(a)
        }, d.makeArray = function(a) {
            var b = [];
            if (d.isArray(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var c = 0, e = a.length; e > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }, d.indexOf = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }, d.removeFrom = function(a, b) {
            var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
        }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
            return a instanceof HTMLElement
        } : function(a) {
            return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
        }, d.setText = function() {
            function a(a, c) {
                b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c
            }
            var b;
            return a
        }(), d.getParent = function(a, b) {
            for (; a != document.body;)
                if (a = a.parentNode, c(a, b)) return a
        }, d.getQueryElement = function(a) {
            return "string" == typeof a ? document.querySelector(a) : a
        }, d.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, d.filterFindElements = function(a, b) {
            a = d.makeArray(a);
            for (var e = [], f = 0, g = a.length; g > f; f++) {
                var h = a[f];
                if (d.isElement(h))
                    if (b) {
                        c(h, b) && e.push(h);
                        for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
                    } else e.push(h)
            }
            return e
        }, d.debounceMethod = function(a, b, c) {
            var d = a.prototype[b],
                e = b + "Timeout";
            a.prototype[b] = function() {
                var a = this[e];
                a && clearTimeout(a);
                var b = arguments,
                    f = this;
                this[e] = setTimeout(function() {
                    d.apply(f, b), delete f[e]
                }, c || 100)
            }
        }, d.toDashed = function(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        };
        var f = a.console;
        return d.htmlInit = function(c, e) {
            b(function() {
                for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                    var k, l = g[i],
                        m = l.getAttribute(h);
                    try {
                        k = m && JSON.parse(m)
                    } catch (n) {
                        f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + n);
                        continue
                    }
                    var o = new c(l, k),
                        p = a.jQuery;
                    p && p.data(l, e, o)
                }
            })
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(c, d, e, f) {
            return b(a, c, d, e, f)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
    }(window, function(a, b, c, d, e) {
        "use strict";

        function f(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function g(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }

        function h(a) {
            return a.replace(/([A-Z])/g, function(a) {
                return "-" + a.toLowerCase()
            })
        }
        var i = a.getComputedStyle,
            j = i ? function(a) {
                return i(a, null)
            } : function(a) {
                return a.currentStyle
            },
            k = d("transition"),
            l = d("transform"),
            m = k && l,
            n = !!d("perspective"),
            o = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[k],
            p = ["transform", "transition", "transitionDuration", "transitionProperty"],
            q = function() {
                for (var a = {}, b = 0, c = p.length; c > b; b++) {
                    var e = p[b],
                        f = d(e);
                    f && f !== e && (a[e] = f)
                }
                return a
            }();
        e.extend(g.prototype, b.prototype), g.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.getSize = function() {
            this.size = c(this.element)
        }, g.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = q[c] || c;
                b[d] = a[c]
            }
        }, g.prototype.getPosition = function() {
            var a = j(this.element),
                b = this.layout.options,
                c = b.isOriginLeft,
                d = b.isOriginTop,
                e = a[c ? "left" : "right"],
                f = a[d ? "top" : "bottom"],
                g = this.layout.size,
                h = -1 != e.indexOf("%") ? parseFloat(e) / 100 * g.width : parseInt(e, 10),
                i = -1 != f.indexOf("%") ? parseFloat(f) / 100 * g.height : parseInt(f, 10);
            h = isNaN(h) ? 0 : h, i = isNaN(i) ? 0 : i, h -= c ? g.paddingLeft : g.paddingRight, i -= d ? g.paddingTop : g.paddingBottom, this.position.x = h, this.position.y = i
        }, g.prototype.layoutPosition = function() {
            var a = this.layout.size,
                b = this.layout.options,
                c = {},
                d = b.isOriginLeft ? "paddingLeft" : "paddingRight",
                e = b.isOriginLeft ? "left" : "right",
                f = b.isOriginLeft ? "right" : "left",
                g = this.position.x + a[d];
            c[e] = this.getXValue(g), c[f] = "";
            var h = b.isOriginTop ? "paddingTop" : "paddingBottom",
                i = b.isOriginTop ? "top" : "bottom",
                j = b.isOriginTop ? "bottom" : "top",
                k = this.position.y + a[h];
            c[i] = this.getYValue(k), c[j] = "", this.css(c), this.emitEvent("layout", [this])
        }, g.prototype.getXValue = function(a) {
            var b = this.layout.options;
            return b.percentPosition && !b.isHorizontal ? a / this.layout.size.width * 100 + "%" : a + "px"
        }, g.prototype.getYValue = function(a) {
            var b = this.layout.options;
            return b.percentPosition && b.isHorizontal ? a / this.layout.size.height * 100 + "%" : a + "px"
        }, g.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x,
                d = this.position.y,
                e = parseInt(a, 10),
                f = parseInt(b, 10),
                g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c,
                i = b - d,
                j = {};
            j.transform = this.getTranslate(h, i), this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, g.prototype.getTranslate = function(a, b) {
            var c = this.layout.options;
            return a = c.isOriginLeft ? a : -a, b = c.isOriginTop ? b : -b, n ? "translate3d(" + a + "px, " + b + "px, 0)" : "translate(" + a + "px, " + b + "px)"
        }, g.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition()
        }, g.prototype.moveTo = m ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
        }, g.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
        }, g.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transn;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
        };
        var r = "opacity," + h(q.transform || "transform");
        g.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: r,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(o, this, !1))
        }, g.prototype.transition = g.prototype[k ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a)
        }, g.prototype.onotransitionend = function(a) {
            this.ontransitionend(a)
        };
        var s = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        g.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transn,
                    c = s[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                    var d = b.onEnd[c];
                    d.call(this), delete b.onEnd[c]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, g.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(o, this, !1), this.isTransitioning = !1
        }, g.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b)
        };
        var t = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return g.prototype.removeTransitionStyles = function() {
            this.css(t)
        }, g.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, g.prototype.remove = function() {
            if (!k || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.once("transitionEnd", function() {
                a.removeElem()
            }), this.hide()
        }, g.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("visibleStyle");
            b[c] = this.onRevealTransitionEnd, this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, g.prototype.getHideRevealTransitionEndProperty = function(a) {
            var b = this.layout.options[a];
            if (b.opacity) return "opacity";
            for (var c in b) return c
        }, g.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("hiddenStyle");
            b[c] = this.onHideTransitionEnd, this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, g.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, g
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(c, d, e, f, g) {
            return b(a, c, d, e, f, g)
        }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
    }(window, function(a, b, c, d, e, f) {
        "use strict";

        function g(a, b) {
            var c = e.getQueryElement(a);
            if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
            this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b);
            var d = ++k;
            this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var h = a.console,
            i = a.jQuery,
            j = function() {},
            k = 0,
            l = {};
        return g.namespace = "outlayer", g.Item = f, g.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, e.extend(g.prototype, c.prototype), g.prototype.option = function(a) {
            e.extend(this.options, a)
        }, g.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, g.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, g.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e],
                    h = new c(g, this);
                d.push(h)
            }
            return d
        }, g.prototype._filterFindItemElements = function(a) {
            return e.filterFindElements(a, this.options.itemSelector)
        }, g.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a
        }, g.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0
        }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function() {
            this.getSize()
        }, g.prototype.getSize = function() {
            this.size = d(this.element)
        }, g.prototype._getMeasurement = function(a, b) {
            var c, f = this.options[a];
            f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
        }, g.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
        }, g.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e)
            }
            return b
        }, g.prototype._layoutItems = function(a, b) {
            if (this._emitCompleteOnItems("layout", a), a && a.length) {
                for (var c = [], d = 0, e = a.length; e > d; d++) {
                    var f = a[d],
                        g = this._getItemLayoutPosition(f);
                    g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g)
                }
                this._processLayoutQueue(c)
            }
        }, g.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, g.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant)
            }
        }, g.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c)
        }, g.prototype._postLayout = function() {
            this.resizeContainer()
        }, g.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var a = this._getContainerSize();
                a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
            }
        }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
            }
        }, g.prototype._emitCompleteOnItems = function(a, b) {
            function c() {
                e.dispatchEvent(a + "Complete", null, [b])
            }

            function d() {
                g++, g === f && c()
            }
            var e = this,
                f = b.length;
            if (!b || !f) return void c();
            for (var g = 0, h = 0, i = b.length; i > h; h++) {
                var j = b[h];
                j.once(a, d)
            }
        }, g.prototype.dispatchEvent = function(a, b, c) {
            var d = b ? [b].concat(c) : c;
            if (this.emitEvent(a, d), i)
                if (this.$element = this.$element || i(this.element), b) {
                    var e = i.Event(b);
                    e.type = a, this.$element.trigger(e, c)
                } else this.$element.trigger(a, c)
        }, g.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0)
        }, g.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored
        }, g.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d)
                }
            }
        }, g.prototype.unstamp = function(a) {
            if (a = this._find(a))
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    e.removeFrom(this.stamps, d), this.unignore(d)
                }
        }, g.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
        }, g.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c)
                }
            }
        }, g.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(),
                b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            }
        }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(),
                c = this._boundingRect,
                e = d(a),
                f = {
                    left: b.left - c.left - e.marginLeft,
                    top: b.top - c.top - e.marginTop,
                    right: c.right - b.right - e.marginRight,
                    bottom: c.bottom - b.bottom - e.marginBottom
                };
            return f
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.bindResize = function() {
            this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
        }, g.prototype.unbindResize = function() {
            this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1
        }, g.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100)
        }, g.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, g.prototype.needsResizeLayout = function() {
            var a = d(this.element),
                b = this.size && a;
            return b && a.innerWidth !== this.size.innerWidth
        }, g.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b
        }, g.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b))
        }, g.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
            }
        }, g.prototype.reveal = function(a) {
            this._emitCompleteOnItems("reveal", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.reveal()
            }
        }, g.prototype.hide = function(a) {
            this._emitCompleteOnItems("hide", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.hide()
            }
        }, g.prototype.revealItemElements = function(a) {
            var b = this.getItems(a);
            this.reveal(b)
        }, g.prototype.hideItemElements = function(a) {
            var b = this.getItems(a);
            this.hide(b)
        }, g.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d
            }
        }, g.prototype.getItems = function(a) {
            a = e.makeArray(a);
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var f = a[c],
                    g = this.getItem(f);
                g && b.push(g)
            }
            return b
        }, g.prototype.remove = function(a) {
            var b = this.getItems(a);
            if (this._emitCompleteOnItems("remove", b), b && b.length)
                for (var c = 0, d = b.length; d > c; c++) {
                    var f = b[c];
                    f.remove(), e.removeFrom(this.items, f)
                }
        }, g.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy()
            }
            this.unbindResize();
            var e = this.element.outlayerGUID;
            delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace)
        }, g.data = function(a) {
            a = e.getQueryElement(a);
            var b = a && a.outlayerGUID;
            return b && l[b]
        }, g.create = function(a, b) {
            function c() {
                g.apply(this, arguments)
            }
            return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function() {
                f.apply(this, arguments)
            }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c
        }, g.Item = f, g
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], b) : "object" == typeof exports ? module.exports = b(require("outlayer")) : (a.Isotope = a.Isotope || {}, a.Isotope.Item = b(a.Outlayer))
    }(window, function(a) {
        "use strict";

        function b() {
            a.Item.apply(this, arguments)
        }
        b.prototype = new a.Item, b.prototype._create = function() {
            this.id = this.layout.itemGUID++, a.Item.prototype._create.call(this), this.sortData = {}
        }, b.prototype.updateSortData = function() {
            if (!this.isIgnored) {
                this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
                var a = this.layout.options.getSortData,
                    b = this.layout._sorters;
                for (var c in a) {
                    var d = b[c];
                    this.sortData[c] = d(this.element, this)
                }
            }
        };
        var c = b.prototype.destroy;
        return b.prototype.destroy = function() {
            c.apply(this, arguments), this.css({
                display: ""
            })
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], b) : "object" == typeof exports ? module.exports = b(require("get-size"), require("outlayer")) : (a.Isotope = a.Isotope || {}, a.Isotope.LayoutMode = b(a.getSize, a.Outlayer))
    }(window, function(a, b) {
        "use strict";

        function c(a) {
            this.isotope = a, a && (this.options = a.options[this.namespace], this.element = a.element, this.items = a.filteredItems, this.size = a.size)
        }
        return function() {
            function a(a) {
                return function() {
                    return b.prototype[a].apply(this.isotope, arguments)
                }
            }
            for (var d = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], e = 0, f = d.length; f > e; e++) {
                var g = d[e];
                c.prototype[g] = a(g)
            }
        }(), c.prototype.needsVerticalResizeLayout = function() {
            var b = a(this.isotope.element),
                c = this.isotope.size && b;
            return c && b.innerHeight != this.isotope.size.innerHeight
        }, c.prototype._getMeasurement = function() {
            this.isotope._getMeasurement.apply(this, arguments)
        }, c.prototype.getColumnWidth = function() {
            this.getSegmentSize("column", "Width")
        }, c.prototype.getRowHeight = function() {
            this.getSegmentSize("row", "Height")
        }, c.prototype.getSegmentSize = function(a, b) {
            var c = a + b,
                d = "outer" + b;
            if (this._getMeasurement(c, d), !this[c]) {
                var e = this.getFirstItemSize();
                this[c] = e && e[d] || this.isotope.size["inner" + b]
            }
        }, c.prototype.getFirstItemSize = function() {
            var b = this.isotope.filteredItems[0];
            return b && b.element && a(b.element)
        }, c.prototype.layout = function() {
            this.isotope.layout.apply(this.isotope, arguments)
        }, c.prototype.getSize = function() {
            this.isotope.getSize(), this.size = this.isotope.size
        }, c.modes = {}, c.create = function(a, b) {
            function d() {
                c.apply(this, arguments)
            }
            return d.prototype = new c, b && (d.options = b), d.prototype.namespace = a, c.modes[a] = d, d
        }, c
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
    }(window, function(a, b, c) {
        var d = a.create("masonry");
        return d.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var a = this.cols;
            for (this.colYs = []; a--;) this.colYs.push(0);
            this.maxY = 0
        }, d.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var a = this.items[0],
                    c = a && a.element;
                this.columnWidth = c && b(c).outerWidth || this.containerWidth
            }
            var d = this.columnWidth += this.gutter,
                e = this.containerWidth + this.gutter,
                f = e / d,
                g = d - e % d,
                h = g && 1 > g ? "round" : "floor";
            f = Math[h](f), this.cols = Math.max(f, 1)
        }, d.prototype.getContainerWidth = function() {
            var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                c = b(a);
            this.containerWidth = c && c.innerWidth
        }, d.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth % this.columnWidth,
                d = b && 1 > b ? "round" : "ceil",
                e = Math[d](a.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
                    x: this.columnWidth * h,
                    y: g
                }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
            return i
        }, d.prototype._getColGroup = function(a) {
            if (2 > a) return this.colYs;
            for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                var e = this.colYs.slice(d, d + a);
                b[d] = Math.max.apply(Math, e)
            }
            return b
        }, d.prototype._manageStamp = function(a) {
            var c = b(a),
                d = this._getElementOffset(a),
                e = this.options.isOriginLeft ? d.left : d.right,
                f = e + c.outerWidth,
                g = Math.floor(e / this.columnWidth);
            g = Math.max(0, g);
            var h = Math.floor(f / this.columnWidth);
            h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
        }, d.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var a = {
                height: this.maxY
            };
            return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
        }, d.prototype._getContainerFitWidth = function() {
            for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
            return (this.cols - a) * this.columnWidth - this.gutter
        }, d.prototype.needsResizeLayout = function() {
            var a = this.containerWidth;
            return this.getContainerWidth(), a !== this.containerWidth
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode"), require("masonry-layout")) : b(a.Isotope.LayoutMode, a.Masonry)
    }(window, function(a, b) {
        "use strict";

        function c(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }
        var d = a.create("masonry"),
            e = d.prototype._getElementOffset,
            f = d.prototype.layout,
            g = d.prototype._getMeasurement;
        c(d.prototype, b.prototype), d.prototype._getElementOffset = e, d.prototype.layout = f, d.prototype._getMeasurement = g;
        var h = d.prototype.measureColumns;
        d.prototype.measureColumns = function() {
            this.items = this.isotope.filteredItems, h.call(this)
        };
        var i = d.prototype._manageStamp;
        return d.prototype._manageStamp = function() {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, i.apply(this, arguments)
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode")) : b(a.Isotope.LayoutMode)
    }(window, function(a) {
        "use strict";
        var b = a.create("fitRows");
        return b.prototype._resetLayout = function() {
            this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth")
        }, b.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth + this.gutter,
                c = this.isotope.size.innerWidth + this.gutter;
            0 !== this.x && b + this.x > c && (this.x = 0, this.y = this.maxY);
            var d = {
                x: this.x,
                y: this.y
            };
            return this.maxY = Math.max(this.maxY, this.y + a.size.outerHeight), this.x += b, d
        }, b.prototype._getContainerSize = function() {
            return {
                height: this.maxY
            }
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode")) : b(a.Isotope.LayoutMode)
    }(window, function(a) {
        "use strict";
        var b = a.create("vertical", {
            horizontalAlignment: 0
        });
        return b.prototype._resetLayout = function() {
            this.y = 0
        }, b.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = (this.isotope.size.innerWidth - a.size.outerWidth) * this.options.horizontalAlignment,
                c = this.y;
            return this.y += a.size.outerHeight, {
                x: b,
                y: c
            }
        }, b.prototype._getContainerSize = function() {
            return {
                height: this.y
            }
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], function(c, d, e, f, g, h) {
            return b(a, c, d, e, f, g, h)
        }) : "object" == typeof exports ? module.exports = b(a, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("./item"), require("./layout-mode"), require("./layout-modes/masonry"), require("./layout-modes/fit-rows"), require("./layout-modes/vertical")) : a.Isotope = b(a, a.Outlayer, a.getSize, a.matchesSelector, a.fizzyUIUtils, a.Isotope.Item, a.Isotope.LayoutMode)
    }(window, function(a, b, c, d, e, f, g) {
        function h(a, b) {
            return function(c, d) {
                for (var e = 0, f = a.length; f > e; e++) {
                    var g = a[e],
                        h = c.sortData[g],
                        i = d.sortData[g];
                    if (h > i || i > h) {
                        var j = void 0 !== b[g] ? b[g] : b,
                            k = j ? 1 : -1;
                        return (h > i ? 1 : -1) * k
                    }
                }
                return 0
            }
        }
        var i = a.jQuery,
            j = String.prototype.trim ? function(a) {
                return a.trim()
            } : function(a) {
                return a.replace(/^\s+|\s+$/g, "")
            },
            k = document.documentElement,
            l = k.textContent ? function(a) {
                return a.textContent
            } : function(a) {
                return a.innerText
            },
            m = b.create("isotope", {
                layoutMode: "masonry",
                isJQueryFiltering: !0,
                sortAscending: !0
            });
        m.Item = f, m.LayoutMode = g, m.prototype._create = function() {
            this.itemGUID = 0, this._sorters = {}, this._getSorters(), b.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
            for (var a in g.modes) this._initLayoutMode(a)
        }, m.prototype.reloadItems = function() {
            this.itemGUID = 0, b.prototype.reloadItems.call(this)
        }, m.prototype._itemize = function() {
            for (var a = b.prototype._itemize.apply(this, arguments), c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.id = this.itemGUID++
            }
            return this._updateItemsSortData(a), a
        }, m.prototype._initLayoutMode = function(a) {
            var b = g.modes[a],
                c = this.options[a] || {};
            this.options[a] = b.options ? e.extend(b.options, c) : c, this.modes[a] = new b(this)
        }, m.prototype.layout = function() {
            return !this._isLayoutInited && this.options.isInitLayout ? void this.arrange() : void this._layout()
        }, m.prototype._layout = function() {
            var a = this._getIsInstant();
            this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, a), this._isLayoutInited = !0
        }, m.prototype.arrange = function(a) {
            function b() {
                d.reveal(c.needReveal), d.hide(c.needHide)
            }
            this.option(a), this._getIsInstant();
            var c = this._filter(this.items);
            this.filteredItems = c.matches;
            var d = this;
            this._bindArrangeComplete(), this._isInstant ? this._noTransition(b) : b(), this._sort(), this._layout()
        }, m.prototype._init = m.prototype.arrange, m.prototype._getIsInstant = function() {
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            return this._isInstant = a, a
        }, m.prototype._bindArrangeComplete = function() {
            function a() {
                b && c && d && e.dispatchEvent("arrangeComplete", null, [e.filteredItems])
            }
            var b, c, d, e = this;
            this.once("layoutComplete", function() {
                b = !0, a()
            }), this.once("hideComplete", function() {
                c = !0, a()
            }), this.once("revealComplete", function() {
                d = !0, a()
            })
        }, m.prototype._filter = function(a) {
            var b = this.options.filter;
            b = b || "*";
            for (var c = [], d = [], e = [], f = this._getFilterTest(b), g = 0, h = a.length; h > g; g++) {
                var i = a[g];
                if (!i.isIgnored) {
                    var j = f(i);
                    j && c.push(i), j && i.isHidden ? d.push(i) : j || i.isHidden || e.push(i)
                }
            }
            return {
                matches: c,
                needReveal: d,
                needHide: e
            }
        }, m.prototype._getFilterTest = function(a) {
            return i && this.options.isJQueryFiltering ? function(b) {
                return i(b.element).is(a)
            } : "function" == typeof a ? function(b) {
                return a(b.element)
            } : function(b) {
                return d(b.element, a)
            }
        }, m.prototype.updateSortData = function(a) {
            var b;
            a ? (a = e.makeArray(a), b = this.getItems(a)) : b = this.items, this._getSorters(), this._updateItemsSortData(b)
        }, m.prototype._getSorters = function() {
            var a = this.options.getSortData;
            for (var b in a) {
                var c = a[b];
                this._sorters[b] = n(c)
            }
        }, m.prototype._updateItemsSortData = function(a) {
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.updateSortData()
            }
        };
        var n = function() {
            function a(a) {
                if ("string" != typeof a) return a;
                var c = j(a).split(" "),
                    d = c[0],
                    e = d.match(/^\[(.+)\]$/),
                    f = e && e[1],
                    g = b(f, d),
                    h = m.sortDataParsers[c[1]];
                return a = h ? function(a) {
                    return a && h(g(a))
                } : function(a) {
                    return a && g(a)
                }
            }

            function b(a, b) {
                var c;
                return c = a ? function(b) {
                    return b.getAttribute(a)
                } : function(a) {
                    var c = a.querySelector(b);
                    return c && l(c)
                }
            }
            return a
        }();
        m.sortDataParsers = {
            parseInt: function(a) {
                return parseInt(a, 10)
            },
            parseFloat: function(a) {
                return parseFloat(a)
            }
        }, m.prototype._sort = function() {
            var a = this.options.sortBy;
            if (a) {
                var b = [].concat.apply(a, this.sortHistory),
                    c = h(b, this.options.sortAscending);
                this.filteredItems.sort(c), a != this.sortHistory[0] && this.sortHistory.unshift(a)
            }
        }, m.prototype._mode = function() {
            var a = this.options.layoutMode,
                b = this.modes[a];
            if (!b) throw new Error("No layout mode: " + a);
            return b.options = this.options[a], b
        }, m.prototype._resetLayout = function() {
            b.prototype._resetLayout.call(this), this._mode()._resetLayout()
        }, m.prototype._getItemLayoutPosition = function(a) {
            return this._mode()._getItemLayoutPosition(a)
        }, m.prototype._manageStamp = function(a) {
            this._mode()._manageStamp(a)
        }, m.prototype._getContainerSize = function() {
            return this._mode()._getContainerSize()
        }, m.prototype.needsResizeLayout = function() {
            return this._mode().needsResizeLayout()
        }, m.prototype.appended = function(a) {
            var b = this.addItems(a);
            if (b.length) {
                var c = this._filterRevealAdded(b);
                this.filteredItems = this.filteredItems.concat(c)
            }
        }, m.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                this._resetLayout(), this._manageStamps();
                var c = this._filterRevealAdded(b);
                this.layoutItems(this.filteredItems), this.filteredItems = c.concat(this.filteredItems), this.items = b.concat(this.items)
            }
        }, m.prototype._filterRevealAdded = function(a) {
            var b = this._filter(a);
            return this.hide(b.needHide), this.reveal(b.matches), this.layoutItems(b.matches, !0), b.matches
        }, m.prototype.insert = function(a) {
            var b = this.addItems(a);
            if (b.length) {
                var c, d, e = b.length;
                for (c = 0; e > c; c++) d = b[c], this.element.appendChild(d.element);
                var f = this._filter(b).matches;
                for (c = 0; e > c; c++) b[c].isLayoutInstant = !0;
                for (this.arrange(), c = 0; e > c; c++) delete b[c].isLayoutInstant;
                this.reveal(f)
            }
        };
        var o = m.prototype.remove;
        return m.prototype.remove = function(a) {
            a = e.makeArray(a);
            var b = this.getItems(a);
            o.call(this, a);
            var c = b && b.length;
            if (c)
                for (var d = 0; c > d; d++) {
                    var f = b[d];
                    e.removeFrom(this.filteredItems, f)
                }
        }, m.prototype.shuffle = function() {
            for (var a = 0, b = this.items.length; b > a; a++) {
                var c = this.items[a];
                c.sortData.random = Math.random()
            }
            this.options.sortBy = "random", this._sort(), this._layout()
        }, m.prototype._noTransition = function(a) {
            var b = this.options.transitionDuration;
            this.options.transitionDuration = 0;
            var c = a.call(this);
            return this.options.transitionDuration = b, c
        }, m.prototype.getFilteredItemElements = function() {
            for (var a = [], b = 0, c = this.filteredItems.length; c > b; b++) a.push(this.filteredItems[b].element);
            return a
        }, m
    });;
(function(window, factory) {
    'use strict';
    if (typeof define == 'function' && define.amd) {
        define(['../layout-mode'], factory);
    } else if (typeof exports == 'object') {
        module.exports = factory(require('../layout-mode'));
    } else {
        factory(window.Isotope.LayoutMode);
    }
}(window, function factory(LayoutMode) {
    'use strict';
    var Metro = LayoutMode.create('metro');
    Metro.prototype._resetLayout = function() {
        this.x = 0;
        this.y = 0;
        this.maxY = 0;
        this._getMeasurement('gutter', 'outerWidth');
        this.perColumn = 0;
        this.rows = [];
        this.rowIndex = 0;
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        this.targetHeight = parseFloat(jQuery(container).data('max-row-height')) || 380;
        this.minHeight = 210;
        if (this.minHeight > this.targetHeight) {
            this.minHeight = this.targetHeight * 0.8;
        }
        this.getColumnCount();
        this.initItems();
        this.buildRows();
    };
    Metro.prototype.getRowItemsHeight = function(rowItems, item, minHeight) {
        var rowItemsInnerWidth = 0;
        var rowItemsOuterWidth = 0;
        rowItems.push(item);
        rowItems.forEach(function(item, index) {
            if (item.imageHeight > minHeight) {
                var relHeight = minHeight / item.imageHeight;
            } else {
                var relHeight = 1;
            }
            rowItemsInnerWidth += item.size.innerWidth * relHeight;
            rowItemsOuterWidth += item.size.innerWidth * relHeight + (item.size.outerWidth - item.size.innerWidth);
        });
        if (rowItemsOuterWidth > this.containerWidth) {
            return (this.containerWidth - (rowItemsOuterWidth - rowItemsInnerWidth)) * minHeight / rowItemsInnerWidth;
        } else {
            return minHeight;
        }
    };
    Metro.prototype.checkRowItemsFull = function(rowItems) {
        var rowItemsMinHeight = -1;
        rowItems.forEach(function(item, index) {
            if (rowItemsMinHeight == -1 || item.imageHeight < rowItemsMinHeight) {
                rowItemsMinHeight = item.imageHeight;
            }
        });
        if (rowItemsMinHeight == -1) {
            return false;
        }
        var rowItemsHeight = this.getRowItemsHeight(rowItems.slice(0, rowItems.length - 1), rowItems.slice(-1)[0], rowItemsMinHeight);
        if (rowItemsHeight < this.targetHeight * 1.3) {
            var rowItemsInnerWidth = 0;
            var rowItemsOuterWidth = 0;
            rowItems.forEach(function(item, index) {
                if (item.imageHeight > rowItemsHeight) {
                    var relHeight = rowItemsHeight / item.imageHeight;
                } else {
                    var relHeight = 1;
                }
                rowItemsInnerWidth += item.size.innerWidth * relHeight;
                rowItemsOuterWidth += item.size.innerWidth * relHeight + (item.size.outerWidth - item.size.innerWidth);
            });
            return {
                items: rowItems,
                innerWidth: rowItemsInnerWidth,
                outerWidth: rowItemsOuterWidth,
                height: rowItemsHeight
            };
        }
        return false;
    };
    Metro.prototype.getRowItems = function(targetHeight) {
        var rowItems = [];
        var rowItemsInnerWidth = 0;
        var rowItemsOuterWidth = 0;
        var defaultItemIndex = this.itemIndex;
        var minHeight = targetHeight;
        while ((rowItemsOuterWidth < this.containerWidth || rowItems.length < this.perColumn) && this.itemIndex < this.items.length) {
            var item = this.items[this.itemIndex];
            item.getSize();
            if (rowItems.length >= this.perColumn) {
                var canSizeResult = this.checkRowItemsFull(rowItems);
                if (canSizeResult) {
                    return canSizeResult;
                }
            }
            var rowHeight = this.getRowItemsHeight(rowItems.slice(0), item, minHeight);
            if (rowHeight < this.minHeight && rowItems.length > 0) {
                var canSizeResult = this.checkRowItemsFull(rowItems);
                if (canSizeResult) {
                    return canSizeResult;
                }
                return {
                    items: rowItems,
                    innerWidth: rowItemsInnerWidth,
                    outerWidth: rowItemsOuterWidth,
                    height: targetHeight
                };
            }
            if (item.imageHeight > targetHeight) {
                var relHeight = targetHeight / item.imageHeight;
            } else {
                var relHeight = 1;
            }
            rowItemsInnerWidth += item.size.innerWidth * relHeight;
            rowItemsOuterWidth += item.size.innerWidth * relHeight + (item.size.outerWidth - item.size.innerWidth);
            if (minHeight > item.imageHeight) {
                minHeight = item.imageHeight;
            }
            rowItems.push(item);
            this.itemIndex += 1;
            if (minHeight < targetHeight) {
                this.itemIndex = defaultItemIndex;
                return this.getRowItems(minHeight);
            }
        }
        if (rowItemsOuterWidth < this.containerWidth) {
            var canSizeResult = this.checkRowItemsFull(rowItems);
            if (canSizeResult) {
                return canSizeResult;
            }
        }
        return {
            items: rowItems,
            innerWidth: rowItemsInnerWidth,
            outerWidth: rowItemsOuterWidth,
            height: targetHeight
        };
    }
    Metro.prototype.buildRows = function() {
        var self = this;
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        jQuery(this.isotope.options.itemSelector + ' .caption', container).hide();
        this.getContainerWidth();
        this.itemIndex = 0;
        while (this.itemIndex < this.items.length) {
            var targetHeight = this.targetHeight;
            var rowItems = this.getRowItems(this.targetHeight);
            if (rowItems.outerWidth > this.containerWidth) {
                var height = (this.containerWidth - (rowItems.outerWidth - rowItems.innerWidth)) * rowItems.height / rowItems.innerWidth;
            } else {
                var height = rowItems.height;
            }
            rowItems.items.forEach(function(item, index) {
                var rel = 1;
                if (item.imageHeight > height) {
                    rel = height / item.imageHeight;
                }
                var calculatedWidth = Math.round(item.size.innerWidth * rel - 0.5);
                calculatedWidth += (item.size.outerWidth - item.size.innerWidth);
                jQuery(item.element).css('width', calculatedWidth);
            });
        }
        jQuery(this.isotope.options.itemSelector + ' .caption', container).show();
    };
    Metro.prototype.initItems = function() {
        var self = this;
        this.items = this.isotope.filteredItems;
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        this.items.forEach(function(item, index) {
            if (item.imageHeight == null || item.imageHeight == undefined) {
                self.items[index].imageWidth = parseInt(jQuery(self.isotope.options.itemImageWrapperSelector + ' img', item.element).attr('width'));
                self.items[index].imageHeight = parseInt(jQuery(self.isotope.options.itemImageWrapperSelector + ' img', item.element).attr('height'));
                if (isNaN(self.items[index].imageHeight)) {
                    self.items[index].imageHeight = self.targetHeight;
                }
            }
            var $element = jQuery(item.element);
            if (!$element.data('original-width')) {
                var original = self.items[index].imageWidth / 1.1;
                var padding = parseFloat($element.css('padding-left'));
                if (isNaN(padding)) {
                    padding = 0;
                }
                $element.data('original-width', original + 2 * padding);
            }
            $element.css('width', $element.data('original-width'));
        });
    };
    Metro.prototype.getColumnCount = function() {
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        if (this.isotope.options.itemSelector == '.portfolio-item') {
            var classes = jQuery(container).closest('.portfolio').attr('class');
        } else {
            var classes = jQuery(container).closest('.gem-gallery-grid').attr('class');
        }
        var m = classes.match(/columns-(\d)/);
        if (m) {
            this.perColumn = parseInt(m[1]);
        } else {
            this.perColumn = 4;
        }
    };
    Metro.prototype.getContainerWidth = function() {
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        var size = getSize(container);
        this.containerWidth = size && size.innerWidth;
    };
    Metro.prototype._getItemLayoutPosition = function(item) {
        item.getSize();
        var itemWidth = item.size.outerWidth + this.gutter;
        var containerWidth = this.isotope.size.innerWidth + this.gutter;
        if (this.x !== 0 && itemWidth + this.x > containerWidth) {
            this.x = 0;
            this.y = this.maxY;
        }
        var position = {
            x: this.x,
            y: this.y
        };
        this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
        this.x += itemWidth;
        return position;
    };
    Metro.prototype._getContainerSize = function() {
        return {
            height: this.maxY
        };
    };
    return Metro;
}));;
/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */
(function(window, factory) {
    'use strict';
    if (typeof define == 'function' && define.amd) {
        define(['../layout-mode', 'masonry/masonry'], factory);
    } else if (typeof exports == 'object') {
        module.exports = factory(require('../layout-mode'), require('masonry-layout'));
    } else {
        factory(window.Isotope.LayoutMode, window.Masonry);
    }
}(window, function factory(LayoutMode, Masonry) {
    'use strict';

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }
    var MasonryMode = LayoutMode.create('masonry-custom');
    var _getElementOffset = MasonryMode.prototype._getElementOffset;
    var layout = MasonryMode.prototype.layout;
    var _getMeasurement = MasonryMode.prototype._getMeasurement;
    extend(MasonryMode.prototype, Masonry.prototype);
    MasonryMode.prototype._getElementOffset = _getElementOffset;
    MasonryMode.prototype.layout = layout;
    MasonryMode.prototype._getMeasurement = _getMeasurement;
    var measureColumns = MasonryMode.prototype.measureColumns;
    MasonryMode.prototype.measureColumns = function() {
        this.items = this.isotope.filteredItems;
        measureColumns.call(this);
    };
    var _manageStamp = MasonryMode.prototype._manageStamp;
    MasonryMode.prototype._manageStamp = function() {
        this.options.isOriginLeft = this.isotope.options.isOriginLeft;
        this.options.isOriginTop = this.isotope.options.isOriginTop;
        _manageStamp.apply(this, arguments);
    };

    function getStyle(elem) {
        return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
    }
    MasonryMode.prototype.fix_images_height = function() {
        var self = this;
        var $ = jQuery;
        var container = this.options.isFitWidth ? this.element.parentNode : this.element;
        var $set = $(container);
        var max_heigth = 0;
        var padding = parseInt($(self.isotope.options.itemSelector, $set).not('.double-item').first().css('padding-top'));
        var caption = 0;
        if (self.isotope.options.itemSelector == '.portfolio-item') {
            if ($(self.isotope.options.itemSelector, $set).not('.double-item').first().find('.wrap > .caption').is(':visible')) {
                caption = parseInt($(self.isotope.options.itemSelector, $set).not('.double-item').first().find('.wrap > .caption').outerHeight());
            }
        }
        var fix_caption = false;
        $(self.isotope.options.itemSelector, $set).not('.double-item').each(function() {
            var height = parseFloat(getStyle($(self.isotope.options.itemImageWrapperSelector, this)[0]).height);
            var diff = height - parseInt(height);
            if (diff < 0.5) {
                height = parseInt(height);
            }
            if ((height - parseInt(height)) > 0.5) {
                height = parseInt(height + 0.5);
                fix_caption = true;
            }
            if (height > max_heigth) {
                max_heigth = height;
            }
        });
        if (caption > 0 && fix_caption) {
            caption -= 1;
        }
        if (caption > 0 && $set.closest('.portfolio').hasClass('title-on-page')) {
            caption += 1;
        }
        $(self.isotope.options.itemSelector + '.double-item ' + self.isotope.options.itemImageWrapperSelector, $set).css('height', '');
        $(self.isotope.options.itemSelector + '.double-item ' + self.isotope.options.itemImageWrapperSelector + ' img', $set).css('height', '');
        $(self.isotope.options.itemSelector + '.double-item-horizontal', $set).each(function() {
            var height = $(self.isotope.options.itemImageWrapperSelector, this).height();
            if (height > max_heigth) {
                $(self.isotope.options.itemImageWrapperSelector, this).height(max_heigth);
            }
        });
        var setWidth = $set.outerWidth();
        $(self.isotope.options.itemSelector + '.double-item-vertical' + ', ' + self.isotope.options.itemSelector + '.double-item-squared', $set).each(function() {
            var height = $(self.isotope.options.itemImageWrapperSelector, this).height();
            var calc_height = 2 * max_heigth + 2 * padding + caption;
            if (height > calc_height) {
                $(self.isotope.options.itemImageWrapperSelector, this).height(calc_height);
            } else if (height < calc_height) {
                if ($(this).outerWidth() < setWidth) {
                    $(self.isotope.options.itemImageWrapperSelector + ' img', this).height(calc_height);
                }
            }
        });
    }
    var _resetLayout = MasonryMode.prototype._resetLayout;
    MasonryMode.prototype._resetLayout = function() {
        if (this.isotope.options.fixHeightDoubleItems) {
            this.fix_images_height();
        }
        _resetLayout.apply(this, arguments);
    };
    return MasonryMode;
}));;
(function(factory) {
    if (typeof define !== 'undefined' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        window.scrollMonitor = factory();
    }
})(function() {
    var scrollTop = function() {
        return window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    };
    var exports = {};
    var watchers = [];
    var VISIBILITYCHANGE = 'visibilityChange';
    var ENTERVIEWPORT = 'enterViewport';
    var FULLYENTERVIEWPORT = 'fullyEnterViewport';
    var EXITVIEWPORT = 'exitViewport';
    var PARTIALLYEXITVIEWPORT = 'partiallyExitViewport';
    var LOCATIONCHANGE = 'locationChange';
    var STATECHANGE = 'stateChange';
    var eventTypes = [VISIBILITYCHANGE, ENTERVIEWPORT, FULLYENTERVIEWPORT, EXITVIEWPORT, PARTIALLYEXITVIEWPORT, LOCATIONCHANGE, STATECHANGE];
    var defaultOffsets = {
        top: 0,
        bottom: 0
    };
    var getViewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight;
    };
    var getDocumentHeight = function() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    };
    exports.viewportTop = null;
    exports.viewportBottom = null;
    exports.documentHeight = null;
    exports.viewportHeight = getViewportHeight();
    var previousDocumentHeight;
    var latestEvent;
    var calculateViewportI;

    function calculateViewport() {
        exports.viewportTop = scrollTop();
        exports.viewportBottom = exports.viewportTop + exports.viewportHeight;
        exports.documentHeight = getDocumentHeight();
        if (exports.documentHeight !== previousDocumentHeight) {
            calculateViewportI = watchers.length;
            while (calculateViewportI--) {
                watchers[calculateViewportI].recalculateLocation();
            }
            previousDocumentHeight = exports.documentHeight;
        }
    }

    function recalculateWatchLocationsAndTrigger() {
        exports.viewportHeight = getViewportHeight();
        calculateViewport();
        updateAndTriggerWatchers();
    }
    var recalculateAndTriggerTimer;

    function debouncedRecalcuateAndTrigger() {
        clearTimeout(recalculateAndTriggerTimer);
        recalculateAndTriggerTimer = setTimeout(recalculateWatchLocationsAndTrigger, 100);
    }
    var updateAndTriggerWatchersI;

    function updateAndTriggerWatchers() {
        updateAndTriggerWatchersI = watchers.length;
        var i = 0;
        while (i < updateAndTriggerWatchersI) {
            watchers[i].update();
            i++;
        }
        updateAndTriggerWatchersI = watchers.length;
        var j = 0,
            newLength;
        while (j < updateAndTriggerWatchersI) {
            watchers[j].triggerCallbacks();
            newLength = watchers.length;
            if (newLength < updateAndTriggerWatchersI) {
                j -= updateAndTriggerWatchersI - newLength;
            }
            updateAndTriggerWatchersI = newLength;
            j++;
        }
    }

    function ElementWatcher(watchItem, offsets) {
        var self = this;
        this.watchItem = watchItem;
        this.uid = Math.random().toString(36).substring(8);
        if (!offsets) {
            this.offsets = defaultOffsets;
        } else if (offsets === +offsets) {
            this.offsets = {
                top: offsets,
                bottom: offsets
            };
        } else {
            this.offsets = {
                top: offsets.top || defaultOffsets.top,
                bottom: offsets.bottom || defaultOffsets.bottom
            };
        }
        this.callbacks = {};
        for (var i = 0, j = eventTypes.length; i < j; i++) {
            self.callbacks[eventTypes[i]] = [];
        }
        this.locked = false;
        var wasInViewport;
        var wasFullyInViewport;
        var wasAboveViewport;
        var wasBelowViewport;
        var listenerToTriggerListI;
        var listener;

        function triggerCallbackArray(listeners) {
            if (listeners.length === 0) {
                return;
            }
            listenerToTriggerListI = listeners.length;
            while (listenerToTriggerListI--) {
                listener = listeners[listenerToTriggerListI];
                listener.callback.call(self, latestEvent);
                if (listener.isOne) {
                    listeners.splice(listenerToTriggerListI, 1);
                }
            }
        }
        this.triggerCallbacks = function triggerCallbacks() {
            if (this.isInViewport && !wasInViewport) {
                triggerCallbackArray(this.callbacks[ENTERVIEWPORT]);
            }
            if (this.isFullyInViewport && !wasFullyInViewport) {
                triggerCallbackArray(this.callbacks[FULLYENTERVIEWPORT]);
            }
            if (this.isAboveViewport !== wasAboveViewport && this.isBelowViewport !== wasBelowViewport) {
                triggerCallbackArray(this.callbacks[VISIBILITYCHANGE]);
                if (!wasFullyInViewport && !this.isFullyInViewport) {
                    triggerCallbackArray(this.callbacks[FULLYENTERVIEWPORT]);
                    triggerCallbackArray(this.callbacks[PARTIALLYEXITVIEWPORT]);
                }
                if (!wasInViewport && !this.isInViewport) {
                    triggerCallbackArray(this.callbacks[ENTERVIEWPORT]);
                    triggerCallbackArray(this.callbacks[EXITVIEWPORT]);
                }
            }
            if (!this.isFullyInViewport && wasFullyInViewport) {
                triggerCallbackArray(this.callbacks[PARTIALLYEXITVIEWPORT]);
            }
            if (!this.isInViewport && wasInViewport) {
                triggerCallbackArray(this.callbacks[EXITVIEWPORT]);
            }
            if (this.isInViewport !== wasInViewport) {
                triggerCallbackArray(this.callbacks[VISIBILITYCHANGE]);
            }
            switch (true) {
                case wasInViewport !== this.isInViewport:
                case wasFullyInViewport !== this.isFullyInViewport:
                case wasAboveViewport !== this.isAboveViewport:
                case wasBelowViewport !== this.isBelowViewport:
                    triggerCallbackArray(this.callbacks[STATECHANGE]);
            }
            wasInViewport = this.isInViewport;
            wasFullyInViewport = this.isFullyInViewport;
            wasAboveViewport = this.isAboveViewport;
            wasBelowViewport = this.isBelowViewport;
        };
        this.recalculateLocation = function() {
            if (this.locked) {
                return;
            }
            var previousTop = this.top;
            var previousBottom = this.bottom;
            if (this.watchItem.nodeName) {
                var cachedDisplay = this.watchItem.style.display;
                if (cachedDisplay === 'none') {
                    this.watchItem.style.display = '';
                }
                var boundingRect = this.watchItem.getBoundingClientRect();
                this.top = boundingRect.top + exports.viewportTop;
                this.bottom = boundingRect.bottom + exports.viewportTop;
                if (cachedDisplay === 'none') {
                    this.watchItem.style.display = cachedDisplay;
                }
            } else if (this.watchItem === +this.watchItem) {
                if (this.watchItem > 0) {
                    this.top = this.bottom = this.watchItem;
                } else {
                    this.top = this.bottom = exports.documentHeight - this.watchItem;
                }
            } else {
                this.top = this.watchItem.top;
                this.bottom = this.watchItem.bottom;
            }
            this.top -= this.offsets.top;
            this.bottom += this.offsets.bottom;
            this.height = this.bottom - this.top;
            if ((previousTop !== undefined || previousBottom !== undefined) && (this.top !== previousTop || this.bottom !== previousBottom)) {
                triggerCallbackArray(this.callbacks[LOCATIONCHANGE]);
            }
        };
        this.recalculateLocation();
        this.update();
        wasInViewport = this.isInViewport;
        wasFullyInViewport = this.isFullyInViewport;
        wasAboveViewport = this.isAboveViewport;
        wasBelowViewport = this.isBelowViewport;
    }
    ElementWatcher.prototype = {
        on: function(event, callback, isOne) {
            switch (true) {
                case event === VISIBILITYCHANGE && !this.isInViewport && this.isAboveViewport:
                case event === ENTERVIEWPORT && this.isInViewport:
                case event === FULLYENTERVIEWPORT && this.isFullyInViewport:
                case event === EXITVIEWPORT && this.isAboveViewport && !this.isInViewport:
                case event === PARTIALLYEXITVIEWPORT && this.isAboveViewport:
                    callback.call(this, latestEvent);
                    if (isOne) {
                        return;
                    }
            }
            if (this.callbacks[event]) {
                this.callbacks[event].push({
                    callback: callback,
                    isOne: isOne || false
                });
            } else {
                throw new Error('Tried to add a scroll monitor listener of type ' + event + '. Your options are: ' + eventTypes.join(', '));
            }
        },
        off: function(event, callback) {
            if (this.callbacks[event]) {
                for (var i = 0, item; item = this.callbacks[event][i]; i++) {
                    if (item.callback === callback) {
                        this.callbacks[event].splice(i, 1);
                        break;
                    }
                }
            } else {
                throw new Error('Tried to remove a scroll monitor listener of type ' + event + '. Your options are: ' + eventTypes.join(', '));
            }
        },
        one: function(event, callback) {
            this.on(event, callback, true);
        },
        recalculateSize: function() {
            this.height = this.watchItem.offsetHeight + this.offsets.top + this.offsets.bottom;
            this.bottom = this.top + this.height;
        },
        update: function() {
            this.isAboveViewport = this.top < exports.viewportTop;
            this.isBelowViewport = this.bottom > exports.viewportBottom;
            this.isInViewport = (this.top <= exports.viewportBottom && this.bottom >= exports.viewportTop);
            this.isFullyInViewport = (this.top >= exports.viewportTop && this.bottom <= exports.viewportBottom) || (this.isAboveViewport && this.isBelowViewport);
        },
        destroy: function() {
            var index = -1,
                self = this;
            for (var i = 0; i < watchers.length; i++) {
                if (this.uid == watchers[i].uid) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                index = watchers.indexOf(this);
            }
            watchers.splice(index, 1);
            for (var i = 0, j = eventTypes.length; i < j; i++) {
                self.callbacks[eventTypes[i]].length = 0;
            }
        },
        lock: function() {
            this.locked = true;
        },
        unlock: function() {
            this.locked = false;
        }
    };
    var eventHandlerFactory = function(type) {
        return function(callback, isOne) {
            this.on.call(this, type, callback, isOne);
        };
    };
    for (var i = 0, j = eventTypes.length; i < j; i++) {
        var type = eventTypes[i];
        ElementWatcher.prototype[type] = eventHandlerFactory(type);
    }
    try {
        calculateViewport();
    } catch (e) {
        try {
            window.$(calculateViewport);
        } catch (e) {
            throw new Error('If you must put scrollMonitor in the <head>, you must use jQuery.');
        }
    }

    function scrollMonitorListener(event) {
        latestEvent = event;
        calculateViewport();
        updateAndTriggerWatchers();
    }
    if (window.addEventListener) {
        window.addEventListener('scroll', scrollMonitorListener);
        window.addEventListener('resize', debouncedRecalcuateAndTrigger);
    } else {
        window.attachEvent('onscroll', scrollMonitorListener);
        window.attachEvent('onresize', debouncedRecalcuateAndTrigger);
    }
    exports.beget = exports.create = function(element, offsets) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        } else if (element && element.length > 0) {
            element = element[0];
        }
        var watcher = new ElementWatcher(element, offsets);
        watchers.push(watcher);
        watcher.update();
        return watcher;
    };
    exports.update = function() {
        latestEvent = null;
        calculateViewport();
        updateAndTriggerWatchers();
    };
    exports.recalculateLocations = function() {
        exports.documentHeight = 0;
        exports.update();
    };
    return exports;
});;
(function($) {
    var animations = {
        'move-up': {
            timeout: 200
        },
        bounce: {
            timeout: 100
        },
        'fade-in': {
            timeout: 100
        },
        scale: {
            timeout: 100
        },
        flip: {
            timeout: 100
        },
        'fall-perspective': {
            timeout: 100
        },
    };
    var prefixes = 'Webkit Moz ms Ms O'.split(' ');
    var docElemStyle = document.documentElement.style;

    function getStyleProperty(propName) {
        if (!propName) {
            return;
        }
        if (typeof docElemStyle[propName] === 'string') {
            return propName;
        }
        propName = propName.charAt(0).toUpperCase() + propName.slice(1);
        var prefixed;
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof docElemStyle[prefixed] === 'string') {
                return prefixed;
            }
        }
    }
    var transitionProperty = getStyleProperty('transition');
    var transitionEndEvent = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'otransitionend',
        transition: 'transitionend'
    }[transitionProperty];

    function ItemsAnimations(el, options) {
        var self = this;
        this.el = el;
        this.$el = $(el);
        this.options = {
            itemSelector: '',
            scrollMonitor: false,
            firstItemStatic: false
        };
        $.extend(this.options, options);
        this.$el.data('itemsAnimations', this);
        self.initialize();
    }
    $.fn.itemsAnimations = function(options) {
        if (typeof options === 'string') {
            var instance = $(this.get(0)).data('itemsAnimations');
            if (!instance) {
                return false;
            }
            if (options === 'instance') {
                return instance;
            }
        } else {
            return new ItemsAnimations(this.get(0), options);
        }
    }
    ItemsAnimations.prototype = {
        initialize: function() {
            var self = this;
            this.queue = [];
            this.queue_is_run = false;
            this.watchers = {};
            this.animation = this.getAnimation();
            if (!this.animation || $(window).width() < 767) {
                this.animationName = 'disabled';
                this.animation = this.getAnimationByName('disabled');
            }
            if (this.options.firstItemStatic) {
                this.firstStatisItem = $(this.options.itemSelector + ':first', this.$el);
                this.firstStatisItem.removeClass('item-animations-not-inited');
            }
            if (this.animationName == 'disabled') {
                $(this.options.itemSelector, this.$el).removeClass('item-animations-not-inited');
            }
            this.initTimer();
        },
        initTimer: function() {
            var self = this;
            this.timer = document.createElement('div');
            this.timer.className = 'items-animations-timer-element';
            if (this.animation.timeout > 0) {
                this.timer.setAttribute("style", "transition-duration: " + this.animation.timeout + "ms; -webkit-transition-duration: " + this.animation.timeout + "ms; -moz-transition-duration: " + this.animation.timeout + "ms; -o-transition-duration: " + this.animation.timeout + "ms;");
            }
            document.body.appendChild(this.timer);
            this.timerCallback = function() {};
            $(this.timer).bind(transitionEndEvent, function(event) {
                self.timerCallback();
            });
            this.timer.className += ' start-timer';
        },
        startTimer: function(callback) {
            this.timerCallback = callback;
            if (this.timer.className.indexOf('start-timer') != -1) {
                this.timer.className = this.timer.className.replace(' start-timer', '');
            } else {
                this.timer.className += ' start-timer';
            }
        },
        show: function($items) {
            var self = this;
            if (this.animationName == 'disabled') {
                $(this.options.itemSelector, this.$el).removeClass('item-animations-not-inited');
                return false;
            }
            if ($items == undefined) {
                $items = $(this.options.itemSelector, this.$el);
            }
            $items.not('.item-animations-inited').each(function(index) {
                var $this = $(this);
                if (self.options.firstItemStatic && self.firstStatisItem && self.firstStatisItem.get(0) == this) {
                    $this.addClass('item-animations-inited');
                    return;
                }
                $this.addClass('item-animations-inited');
                if (self.options.scrollMonitor && this.animationName != 'disabled') {
                    var watcher = scrollMonitor.create(this, -50);
                    watcher.enterViewport(function() {
                        var watcher = this;
                        self.showItem($this, watcher);
                    });
                    self.watchers[watcher.uid] = watcher;
                } else {
                    self.showItem($this);
                }
            });
            $(this.options.itemSelector, this.$el).not('.item-animations-inited').removeClass('item-animations-not-inited');
        },
        reinitItems: function($items) {
            $items.removeClass('start-animation item-animations-inited item-animations-loading before-start').addClass('item-animations-not-inited');
            this.clear();
        },
        getAnimationName: function() {
            var m = this.$el[0].className.match(/item-animation-(\S+)/);
            if (!m) {
                return '';
            }
            return m[1];
        },
        getAnimation: function() {
            this.animationName = this.getAnimationName();
            return this.getAnimationByName(this.animationName);
        },
        getAnimationByName: function(name) {
            if (!name || animations[name] == undefined) {
                return false;
            }
            return animations[name];
        },
        showItem: function($item, watcher) {
            var self = this;
            if ($item.hasClass('item-animations-loading')) {
                return false;
            }
            $item.addClass('before-start');

            function showItemCallback() {
                if ($item.length == 0) {
                    return false;
                }
                self.animate($item);
                if (watcher != undefined) {
                    self.destroyWatcher(watcher);
                }
            }
            $item.addClass('item-animations-loading');
            if (this.animation.timeout > 0) {
                this.queueAdd(showItemCallback, this.animation.timeout);
            } else {
                showItemCallback();
            }
        },
        destroyWatcher: function(watcher) {
            if (this.watchers[watcher.uid] != undefined) {
                delete this.watchers[watcher.uid];
            }
            watcher.destroy();
        },
        animate: function($item, animation) {
            $item.bind(transitionEndEvent, function(event) {
                var target = event.target || event.srcElement;
                if (target != $item[0]) {
                    return;
                }
                $item.unbind(transitionEndEvent);
                $item.removeClass('before-start start-animation');
            });
            $item.removeClass('item-animations-loading item-animations-not-inited').addClass('start-animation');
        },
        queueAdd: function(callback, timeout) {
            var self = this;
            this.queue.push({
                callback: callback,
                timeout: timeout
            });
            if (this.queue.length == 1 && !this.queue_is_run) {
                this.startTimer(function() {
                    self.queueNext();
                });
            }
        },
        queueNext: function() {
            var self = this;
            if (this.queue.length == 0) {
                return false;
            }
            var next_action = this.queue.shift();
            if (next_action == undefined) {
                return false;
            }
            this.queue_is_run = true;
            next_action.callback();
            this.startTimer(function() {
                self.queue_is_run = false;
                self.queueNext();
            });
        },
        clear: function() {
            this.queue = [];
            this.queue_is_run = false;
            for (var watcher_uid in this.watchers) {
                if (this.watchers.hasOwnProperty(watcher_uid)) {
                    this.destroyWatcher(this.watchers[watcher_uid]);
                }
            }
            this.watchers = [];
        }
    };
})(jQuery);;
(function($) {
    function Slider(el, options) {
        var self = this;
        this.el = el;
        this.$el = $(el);
        this.options = {
            element: 'li',
            margin: 0,
            delay: 100,
            duration: 200,
            nextPageDelay: 300,
            prevButton: false,
            nextButton: false,
            loop: true,
            afterInit: false,
            autoscroll: false
        };
        $.extend(this.options, options);
        self.initialize(true);
    }
    $.fn.reverse = [].reverse;
    $.fn.juraSlider = function(options) {
        return new Slider(this.get(0), options);
    }
    Slider.prototype = {
        initialize: function(first_init) {
            var self = this;
            if (first_init == undefined) {
                first_init = false;
            }
            this.is_animation = false;
            var first_element_height = this.$el.find(this.options.element + ':first').outerHeight();
            var padding_left = parseInt(this.$el.parent().css('padding-left'));
            var padding_right = parseInt(this.$el.parent().css('padding-right'));
            this.$el.css({
                whiteSpace: 'nowrap',
                left: padding_left,
                right: padding_right,
                top: 0,
                bottom: 0,
                height: first_element_height,
                position: 'absolute',
                clip: 'rect(auto, auto, ' + (first_element_height + 60) + 'px, auto)'
            });
            this.$el.parent().css({
                height: first_element_height,
                position: 'relative'
            });
            this.$el.find(this.options.element).css({
                margin: 0,
                position: 'absolute',
                left: this.$el.outerWidth(),
                top: 0,
                zIndex: 1
            }).removeClass('leftPosition currentPosition').addClass('rightPosition');
            if (first_init && this.options.nextButton)
                this.options.nextButton.click(function() {
                    self.triggerNext(false);
                });
            if (first_init && this.options.prevButton)
                this.options.prevButton.click(function() {
                    self.triggerPrev();
                });
            if (first_init) {
                $(window).resize(function() {
                    self.initialize(false);
                });
            }
            if (first_init && $.isFunction(this.options.afterInit))
                this.options.afterInit();
            if (!first_init && autoscrollInterval) {
                clearInterval(autoscrollInterval);
            }
            this.triggerNext(true, !first_init);
            if (!first_init && this.options.autoscroll) {
                autoscrollInterval = setInterval(function() {
                    self.triggerNext(false);
                }, this.options.autoscroll);
            }
            if (first_init && this.options.autoscroll) {
                var autoscrollInterval;
                var that = this;
                autoscrollInterval = setInterval(function() {
                    self.triggerNext(false);
                }, that.options.autoscroll);
                that.$el.hover(function() {
                    clearInterval(autoscrollInterval);
                }, function() {
                    autoscrollInterval = setInterval(function() {
                        self.triggerNext(false);
                    }, that.options.autoscroll);
                });
            }
        },
        getNextCount: function() {
            var self = this;
            var count = 0;
            var next_width = 0;
            var index = 0;
            var el_width = parseFloat(getComputedStyle(this.el, '').getPropertyValue('width'));
            var new_width = 0;
            this.$el.find(this.options.element + '.rightPosition').each(function() {
                var width = parseFloat(getComputedStyle(this, '').getPropertyValue('width'));
                if (index > 0)
                    width += self.options.margin;
                new_width = next_width + width;
                if (new_width > el_width)
                    return false;
                next_width = next_width + width;
                count += 1;
                index += 1;
            });
            if (this.options.loop && new_width < el_width) {
                this.$el.find(this.options.element + '.leftPosition').each(function() {
                    var width = parseFloat(getComputedStyle(this, '').getPropertyValue('width'));
                    if (index > 0)
                        width += self.options.margin;
                    new_width = next_width + width;
                    if (new_width > el_width)
                        return false;
                    $(this).css({
                        left: el_width
                    }).removeClass('leftPosition').addClass('rightPosition').appendTo(self.$el);
                    next_width = next_width + width;
                    count += 1;
                    index += 1;
                });
            }
            return [count, next_width];
        },
        triggerNext: function(init, without_transition) {
            if (this.is_animation)
                return false;
            if (without_transition == undefined) {
                without_transition = false;
            }
            var self = this;
            var info = this.getNextCount();
            if (init && info[0] == this.$el.find(this.options.element).size()) {
                if (this.options.nextButton)
                    this.options.nextButton.hide();
                if (this.options.prevButton)
                    this.options.prevButton.hide();
            }
            if (info[0] < 1)
                return false;
            this.is_animation = true;
            this.hideLeft();
            setTimeout(function() {
                self.showNext(info, without_transition);
            }, without_transition ? 1 : this.options.nextPageDelay);
        },
        hideLeft: function() {
            var delay = 0;
            var app = this;
            app.$el.find(app.options.element + '.currentPosition').each(function() {
                var self = this;
                setTimeout(function() {
                    var offset = $(self).outerWidth();
                    $(self).addClass('slider-animation').animate({
                        left: -offset
                    }, {
                        duration: app.options.duration,
                        queue: false,
                        complete: function() {
                            $(this).removeClass('currentPosition slider-animation currentPosition-first currentPosition-last').addClass('leftPosition');
                        }
                    });
                }, delay);
                delay += app.options.delay;
            });
        },
        showNext: function(info, without_transition) {
            var app = this;
            if (info[0] < 1)
                return false;
            var offset = (app.$el.width() - info[1]) / 2;
            var delay = 0;
            var index = 0;
            app.$el.find(app.options.element + '.rightPosition:lt(' + info[0] + ')').each(function() {
                var self = this;
                if (without_transition) {
                    $(self).removeClass('leftPosition rightPosition').addClass('currentPosition').css({
                        left: offset
                    });
                } else {
                    app.showElement(self, offset, delay, index, info[0]);
                }
                delay += app.options.delay;
                offset += $(self).outerWidth() + app.options.margin;
                index += 1;
            });
            if (without_transition) {
                app.is_animation = false;
            }
        },
        showElement: function(element, offset, delay, index, count) {
            var app = this;
            setTimeout(function() {
                $(element).addClass('slider-animation' + (index == 0 ? ' currentPosition-first' : '') + (index == count - 1 ? ' currentPosition-last' : '')).animate({
                    left: offset
                }, {
                    duration: app.options.duration,
                    queue: false,
                    complete: function() {
                        $(this).removeClass('rightPosition leftPosition slider-animation').addClass('currentPosition');
                        if (index == count - 1)
                            app.is_animation = false;
                    }
                });
            }, delay);
        },
        getPrevCount: function() {
            var self = this;
            var count = 0;
            var prev_width = 0;
            var index = 0;
            var el_width = parseFloat(getComputedStyle(this.el, '').getPropertyValue('width'));
            var new_width = 0;
            this.$el.find(this.options.element + '.leftPosition').reverse().each(function() {
                var width = parseFloat(getComputedStyle(this, '').getPropertyValue('width'));
                if (index > 0)
                    width += self.options.margin;
                new_width = prev_width + width;
                if (new_width > el_width)
                    return false;
                prev_width = prev_width + width;
                count += 1;
                index += 1;
            });
            if (this.options.loop && new_width < el_width) {
                this.$el.find(this.options.element + '.rightPosition').reverse().each(function() {
                    var width = parseFloat(getComputedStyle(this, '').getPropertyValue('width'));
                    if (index > 0)
                        width += self.options.margin;
                    new_width = prev_width + width;
                    if (new_width > el_width)
                        return false;
                    $(this).css({
                        left: -width
                    }).removeClass('rightPosition').addClass('leftPosition').prependTo(self.$el);
                    prev_width = prev_width + width;
                    count += 1;
                    index += 1;
                });
            }
            return [count, prev_width];
        },
        triggerPrev: function() {
            if (this.is_animation)
                return false;
            var self = this;
            var info = this.getPrevCount();
            if (info[0] < 1)
                return false;
            this.is_animation = true;
            this.hideRight();
            setTimeout(function() {
                self.showPrev(info);
            }, this.options.nextPageDelay);
        },
        hideRight: function() {
            var delay = 0;
            var app = this;
            var offset = app.$el.width();
            app.$el.find(app.options.element + '.currentPosition').reverse().each(function() {
                var self = this;
                setTimeout(function() {
                    $(self).addClass('slider-animation').animate({
                        left: offset
                    }, {
                        duration: app.options.duration,
                        queue: false,
                        complete: function() {
                            $(this).removeClass('currentPosition slider-animation currentPosition-first currentPosition-last').addClass('rightPosition');
                        }
                    });
                }, delay);
                delay += app.options.delay;
            });
        },
        showPrev: function(info) {
            var app = this;
            if (info[0] < 1)
                return false;
            var offset = info[1] + (app.$el.width() - info[1]) / 2;
            var delay = 0;
            var index = 0;
            app.$el.find(app.options.element + '.leftPosition').slice(-info[0]).reverse().each(function() {
                var self = this;
                offset -= $(self).outerWidth();
                if (index > 0)
                    offset -= app.options.margin;
                app.showElement(self, offset, delay, index, info[0]);
                delay += app.options.delay;
                index += 1;
            });
        }
    };
}(jQuery));;
(function($) {
    $(function() {
        window.defaultSortData = {
            date: '[data-sort-date] parseInt',
            name: '.title'
        };

        function portfolio_images_loaded($box, image_selector, callback) {
            function check_image_loaded(img) {
                return img.complete && img.naturalWidth !== undefined && img.naturalWidth != 0;
            }
            var $images = $(image_selector, $box).filter(function() {
                    return !check_image_loaded(this);
                }),
                images_count = $images.length;
            if (images_count == 0) {
                return callback();
            }
            if (window.gemBrowser.name == 'ie' && !isNaN(parseInt(window.gemBrowser.version)) && parseInt(window.gemBrowser.version) <= 10) {
                function image_load_event() {
                    images_count--;
                    if (images_count == 0) {
                        callback();
                    }
                }
                $images.each(function() {
                    if (check_image_loaded(this)) {
                        return;
                    }
                    var proxyImage = new Image();
                    proxyImage.addEventListener('load', image_load_event);
                    proxyImage.addEventListener('error', image_load_event);
                    proxyImage.src = this.src;
                });
                return;
            }
            $images.on('load error', function() {
                images_count--;
                if (images_count == 0) {
                    callback();
                }
            });
        }

        function init_prev_next_navigator_buttons($portfolio) {
            var current_page = $portfolio.data('current-page');
            var pages_count = $portfolio.data('pages-count');
            if (current_page <= 1)
                $('.portfolio-navigator a.prev', $portfolio).css('visibility', 'hidden');
            else
                $('.portfolio-navigator a.prev', $portfolio).css('visibility', 'visible');
            if (current_page >= pages_count)
                $('.portfolio-navigator a.next', $portfolio).css('visibility', 'hidden');
            else
                $('.portfolio-navigator a.next', $portfolio).css('visibility', 'visible');
        }

        function get_portfolio_sorted_items($portfolio, $activeItems) {
            if (!$('.portfolio-sorting a.sorting-switcher', $portfolio).length) {
                return $activeItems;
            }
            var sortOptions = get_portfolio_sorting_data($portfolio);
            var sortBy = window.defaultSortData[sortOptions.sortBy];
            var isParseInt = false;
            if (sortBy.indexOf('parseInt') != -1) {
                sortBy = sortBy.replace(' parseInt', '');
                var isParseInt = true;
            }
            var isSortByAttr = false;
            var m = sortBy.match(/^\[(.+)\]$/);
            if (m) {
                sortBy = m[1];
                var isSortByAttr = true;
            }
            $activeItems.sort(function($item1, $item2) {
                if (isSortByAttr) {
                    var item1_value = $item1.getAttribute(sortBy);
                    var item2_value = $item2.getAttribute(sortBy);
                } else {
                    var item1_value = $(sortBy, $item1).text();
                    var item2_value = $(sortBy, $item2).text();
                }
                if (isParseInt) {
                    item1_value = parseInt(item1_value);
                    item2_value = parseInt(item2_value);
                }
                return (item1_value > item2_value ? 1 : -1) * (sortOptions.sortAscending ? 1 : -1);
            });
            return $activeItems;
        }

        function init_portfolio_pages($portfolio) {
            var activeFilter = '*';
            if ($('.portfolio-filters a.active', $portfolio).length) {
                activeFilter = $('.portfolio-filters a.active', $portfolio).data('filter');
            }
            var $activeItems = $('.portfolio-set .portfolio-item', $portfolio);
            if (activeFilter != '*') {
                $activeItems = $activeItems.filter(activeFilter);
            }
            var count = $activeItems.length;
            var default_per_page = $portfolio.data('per-page') || count;
            if ($('.portfolio-count select', $portfolio).length)
                var per_page = $('.portfolio-count select', $portfolio).val();
            else
                var per_page = default_per_page;
            var pages_count = Math.ceil(count / per_page);
            var current_page = 1;
            $portfolio.data('per-page', per_page);
            $portfolio.data('pages-count', pages_count);
            $portfolio.data('current-page', current_page);
            if ($('.portfolio-navigator', $portfolio).length && pages_count > 1) {
                var pagenavigator = '<a href="#" class="prev">&#xe603;</a>';
                for (var i = 0; i < pages_count; i++)
                    pagenavigator += '<a href="#" data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
                pagenavigator += '<a href="#" class="next">&#xe601;</a>';
                $('.portfolio-navigator', $portfolio).html(pagenavigator).show();
                $('.portfolio-set', $portfolio).css('margin-bottom', '');
                $('.portfolio-navigator a[data-page="' + current_page + '"]', $portfolio).addClass('current')
                init_prev_next_navigator_buttons($portfolio);
            } else {
                $('.portfolio-navigator', $portfolio).html('').hide();
                $('.portfolio-set', $portfolio).css('margin-bottom', 0);
            }
            $('.portfolio-set .portfolio-item', $portfolio).removeClass(function(index, class_name) {
                return (class_name.match(/\bpaginator-page-\S+/g) || []).join(' ');
            });
            var sorted_items = get_portfolio_sorted_items($portfolio, $activeItems);
            $.each(sorted_items, function(i, item) {
                var page = Math.ceil((i + 1) / per_page);
                $(item).addClass('paginator-page-' + page);
            });
            $('.portfolio-navigator', $portfolio).on('click', 'a', function() {
                if ($(this).hasClass('current'))
                    return false;
                var current_page = $(this).siblings('.current:first').data('page');
                if ($(this).hasClass('prev')) {
                    var page = current_page - 1;
                } else if ($(this).hasClass('next')) {
                    var page = current_page + 1
                } else {
                    var page = $(this).data('page');
                }
                if (page < 1)
                    page = 1;
                if (page > pages_count)
                    page = pages_count;
                $(this).siblings('a').removeClass('current');
                $(this).parent().find('a[data-page="' + page + '"]').addClass('current');
                $portfolio.data('current-page', page);
                init_prev_next_navigator_buttons($portfolio);
                $portfolio.itemsAnimations('instance').reinitItems($('.portfolio-set .portfolio-item', $portfolio));
                $('.portfolio-set', $portfolio).isotope({
                    filter: '.paginator-page-' + page
                });
                $("html, body").animate({
                    scrollTop: $portfolio.offset().top - 200
                }, 600);
                return false;
            });
        }

        function init_portfolio_count($portfolio) {
            if (!$('.portfolio-count select', $portfolio).length) {
                return false;
            }
            $('.portfolio-count select', $portfolio).on('change', function() {
                init_portfolio_pages($portfolio);
                $portfolio.itemsAnimations('instance').reinitItems($('.portfolio-set .portfolio-item', $portfolio));
                var current_page = $portfolio.data('current-page');
                $('.portfolio-set', $portfolio).isotope({
                    filter: '.paginator-page-' + current_page
                });
            });
        }

        function get_portfolio_sorting_data($portfolio) {
            var sorting = {
                sortBy: $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current'),
                sortAscending: $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current') == 'ASC'
            };
            return sorting;
        }

        function init_portfolio_sorting($portfolio) {
            if (!$('.portfolio-sorting a.sorting-switcher', $portfolio).length)
                return false;
            $('.portfolio-sorting a.sorting-switcher', $portfolio).on('click', function(e) {
                var $selected = $('label[data-value!="' + $(this).data('current') + '"]', $(this).parent());
                $(this).data('current', $selected.data('value'));
                if ($(this).next().is($selected)) {
                    $(this).addClass('right');
                } else {
                    $(this).removeClass('right');
                }
                if ($portfolio.hasClass('portfolio-pagination-scroll')) {
                    $portfolio.data('next-page', 1);
                    portfolio_scroll_load_next_request($portfolio);
                } else if (!$('.portfolio-load-more', $portfolio).length) {
                    init_portfolio_pages($portfolio);
                    var current_page = $portfolio.data('current-page'),
                        sortOptions = get_portfolio_sorting_data($portfolio);
                    $portfolio.itemsAnimations('instance').reinitItems($('.portfolio-set .portfolio-item', $portfolio));
                    $('.portfolio-set', $portfolio).isotope({
                        filter: '.paginator-page-' + current_page,
                        sortBy: sortOptions.sortBy,
                        sortAscending: sortOptions.sortAscending
                    });
                } else {
                    $portfolio.data('next-page', 1);
                    portfolio_load_core_request($portfolio);
                }
                e.preventDefault();
                return false;
            });
            $('.portfolio-sorting label', $portfolio).on('click', function(e) {
                if ($(this).data('value') != $('.sorting-switcher', $(this).parent()).data('current')) {
                    $('.sorting-switcher', $(this).parent()).click();
                }
                e.preventDefault();
                return false;
            });
        }

        function portfolio_load_more_request($portfolio, $set, is_scroll) {
            var uid = $portfolio.data('portfolio-uid'),
                is_processing_request = $set.data('request-process') || false;
            if (is_processing_request) {
                return false;
            }
            var data = $.extend(true, {}, window['portfolio_ajax_' + uid]);
            if ($('.portfolio-count select', $portfolio).length) {
                data['data']['more_count'] = $('.portfolio-count select', $portfolio).val();
            }
            data['data']['more_page'] = $portfolio.data('next-page');
            if (data['data']['more_page'] == null || data['data']['more_page'] == undefined) {
                data['data']['more_page'] = 1;
            }
            if (data['data']['more_page'] == 0) {
                return false;
            }
            if ($('.portfolio-filters', $portfolio).length) {
                if ($portfolio.hasClass('products')) {
                    data['data']['categories'] = $portfolio.data('more-filter') || data['data']['categories'];
                } else {
                    data['data']['portfolio'] = $portfolio.data('more-filter') || data['data']['portfolio'];
                }
            }
            if ($('.portfolio-sorting', $portfolio).length) {
                data['data']['orderby'] = $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current');
                data['data']['order'] = $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current');
            }
            data['action'] = data['action'] != undefined ? data['action'] : 'portfolio_load_more';
            $set.data('request-process', true);
            if (is_scroll) {
                $('.portfolio-scroll-pagination', $portfolio).addClass('active').html('<div class="loading"></div>');
            } else {
                $('.portfolio-load-more .gem-button', $portfolio).before('<div class="loading"></div>');
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: data.url,
                data: data,
                success: function(response) {
                    if (response.status == 'success') {
                        var $newItems = $(response.html);
                        if ($newItems.hasClass('woocommerce')) {
                            $newItems = $newItems.find('>div');
                        }
                        var current_page = $newItems.data('page'),
                            next_page = $newItems.data('next-page'),
                            $inserted_data = $($newItems.html());
                        $inserted_data.addClass('paginator-page-1');
                        if ($portfolio.itemsAnimations('instance').getAnimationName() != 'disabled') {
                            $inserted_data.addClass('item-animations-not-inited');
                        } else {
                            $inserted_data.removeClass('item-animations-not-inited');
                        }
                        if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.outerWidth() > 1170) {
                            $('.image-inner picture source', $inserted_data).remove();
                        }
                        portfolio_images_loaded($inserted_data, '.image-inner img', function() {
                            if (current_page == 1) {
                                $portfolio.itemsAnimations('instance').clear();
                                $set.html('');
                            }
                            $set.isotope('insert', $inserted_data);
                            $portfolio.itemsAnimations('instance').show($inserted_data);
                            if (is_scroll) {
                                $('.portfolio-scroll-pagination', $portfolio).removeClass('active').html('');
                            } else {
                                $('.portfolio-scroll-pagination', $portfolio).addClass('active').html('<div class="loading"></div>');
                                if (next_page > 0) {
                                    $('.portfolio-load-more', $portfolio).show();
                                } else {
                                    $('.portfolio-load-more', $portfolio).hide();
                                }
                            }
                            $portfolio.initPortfolioFancybox();
                            $portfolio.data('next-page', next_page);
                            $set.data('request-process', false);
                        });
                    } else {
                        alert(response.message);
                    }
                }
            });
        }

        function portfolio_load_core_request($portfolio) {
            var $set = $('.portfolio-set', $portfolio);
            var uid = $portfolio.data('portfolio-uid');
            var is_processing_request = $set.data('request-process') || false;
            if (is_processing_request)
                return false;
            $set.data('request-process', true);
            var data = $.extend(true, {}, window['portfolio_ajax_' + uid]);
            data['action'] = data['action'] != undefined ? data['action'] : 'portfolio_load_more';
            if ($('.portfolio-count select', $portfolio).size() > 0)
                data['data']['more_count'] = $('.portfolio-count select', $portfolio).val();
            data['data']['more_page'] = $portfolio.data('next-page') || 1;
            if (data['data']['more_page'] == 0)
                return false;
            if ($('.portfolio-filters', $portfolio).size() > 0) {
                if ($portfolio.hasClass('products')) {
                    data['data']['categories'] = $portfolio.data('more-filter') || data['data']['categories'];
                } else {
                    data['data']['portfolio'] = $portfolio.data('more-filter') || data['data']['portfolio'];
                }
            }
            if ($('.portfolio-sorting', $portfolio).length > 0) {
                data['data']['orderby'] = $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current');
                data['data']['order'] = $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current');
            }
            $('.portfolio-load-more .gem-button', $portfolio).before('<div class="loading"><div class="preloader-spin"></div></div>');
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: data.url,
                data: data,
                success: function(response) {
                    if (response.status == 'success') {
                        var minZIndex = $('.portfolio-item:last', $set).css('z-index') - 1;
                        var $newItems = $(response.html);
                        if ($newItems.hasClass('woocommerce')) {
                            $newItems = $newItems.find('>div');
                        }
                        $('.portfolio-item', $newItems).addClass('paginator-page-1')
                        $('.portfolio-item', $newItems).each(function() {
                            $(this).css('z-index', minZIndex--);
                        });
                        var current_page = $newItems.data('page');
                        var next_page = $newItems.data('next-page');
                        var $inserted_data = $($newItems.html());
                        if ($portfolio.itemsAnimations('instance').getAnimationName() != 'disabled') {
                            $inserted_data.addClass('item-animations-not-inited');
                        } else {
                            $inserted_data.removeClass('item-animations-not-inited');
                        }
                        if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.outerWidth() > 1170) {
                            $('.image-inner picture source', $inserted_data).remove();
                        }
                        portfolio_images_loaded($inserted_data, '.image-inner img', function() {
                            if (current_page == 1) {
                                $portfolio.itemsAnimations('instance').clear();
                                $set.html('');
                            }
                            $set.isotope('insert', $inserted_data);
                            init_circular_overlay($portfolio, $set);
                            $portfolio.itemsAnimations('instance').show($inserted_data);
                            $('.portfolio-load-more .loading', $portfolio).remove();
                            $portfolio.data('next-page', next_page);
                            if (next_page > 0) {
                                $('.portfolio-load-more', $portfolio).show();
                            } else {
                                $('.portfolio-load-more', $portfolio).hide();
                            }
                            $portfolio.initPortfolioFancybox();
                            $set.data('request-process', false);
                        });
                    } else {
                        alert(response.message);
                        $('.portfolio-load-more .gem-button .loading', $portfolio).remove();
                    }
                }
            });
        }

        function init_portfolio_more_count($portfolio) {
            if ($('.portfolio-count select', $portfolio).size() == 0)
                return false;
            $('.portfolio-count select', $portfolio).on('change', function() {
                $portfolio.data('next-page', 1);
                portfolio_load_core_request($portfolio);
            });
        }

        function init_portfolio_scroll_next_count($portfolio) {
            if ($('.portfolio-count select', $portfolio).size() == 0)
                return false;
            $('.portfolio-count select', $portfolio).on('change', function() {
                $portfolio.data('next-page', 1);
                portfolio_scroll_load_next_request($portfolio);
            });
        }

        function portfolio_scroll_load_next_request($portfolio) {
            var $set = $('.portfolio-set', $portfolio);
            var uid = $portfolio.data('portfolio-uid');
            var is_processing_request = $set.data('request-process') || false;
            if (is_processing_request)
                return false;
            var data = $.extend(true, {}, window['portfolio_ajax_' + uid]);
            data['action'] = data['action'] != undefined ? data['action'] : 'portfolio_load_more';
            if ($('.portfolio-count select', $portfolio).size() > 0)
                data['data']['more_count'] = $('.portfolio-count select', $portfolio).val();
            data['data']['more_page'] = $portfolio.data('next-page');
            if (data['data']['more_page'] == null || data['data']['more_page'] == undefined) {
                data['data']['more_page'] = 1;
            }
            if (data['data']['more_page'] == 0)
                return false;
            if ($('.portfolio-filters', $portfolio).size() > 0) {
                if ($portfolio.hasClass('products')) {
                    data['data']['categories'] = $portfolio.data('more-filter') || data['data']['categories'];
                } else {
                    data['data']['portfolio'] = $portfolio.data('more-filter') || data['data']['portfolio'];
                }
            }
            if ($('.portfolio-sorting', $portfolio).length > 0) {
                data['data']['orderby'] = $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current');
                data['data']['order'] = $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current');
            }
            $set.data('request-process', true);
            $('.portfolio-scroll-pagination', $portfolio).addClass('active').html('<div class="loading"><div class="preloader-spin"></div></div>');
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: data.url,
                data: data,
                success: function(response) {
                    if (response.status == 'success') {
                        var minZIndex = $('.portfolio-item:last', $set).css('z-index') - 1;
                        var $newItems = $(response.html);
                        if ($newItems.hasClass('woocommerce')) {
                            $newItems = $newItems.find('>div');
                        }
                        $('.portfolio-item', $newItems).addClass('paginator-page-1')
                        $('.portfolio-item', $newItems).each(function() {
                            $(this).css('z-index', minZIndex--);
                        });
                        var current_page = $newItems.data('page');
                        var next_page = $newItems.data('next-page');
                        var $inserted_data = $($newItems.html());
                        if ($portfolio.itemsAnimations('instance').getAnimationName() != 'disabled') {
                            $inserted_data.addClass('item-animations-not-inited');
                        } else {
                            $inserted_data.removeClass('item-animations-not-inited');
                        }
                        if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.outerWidth() > 1170) {
                            $('.image-inner picture source', $inserted_data).remove();
                        }
                        portfolio_images_loaded($inserted_data, '.image-inner img', function() {
                            if (current_page == 1) {
                                $portfolio.itemsAnimations('instance').clear();
                                $set.html('');
                            }
                            $set.isotope('insert', $inserted_data);
                            init_circular_overlay($portfolio, $set);
                            $portfolio.itemsAnimations('instance').show($inserted_data);
                            $('.portfolio-scroll-pagination', $portfolio).removeClass('active').html('');
                            $portfolio.data('next-page', next_page);
                            $set.data('request-process', false);
                            $portfolio.initPortfolioFancybox();
                        });
                    } else {
                        alert(response.message);
                        $('.portfolio-scroll-pagination', $portfolio).removeClass('active').html('');
                    }
                }
            });
        }

        function init_portfolio_scroll_next_page($portfolio) {
            if ($('.portfolio-scroll-pagination', $portfolio).length == 0) {
                return false;
            }
            var $pagination = $('.portfolio-scroll-pagination', $portfolio);
            var watcher = scrollMonitor.create($pagination[0]);
            watcher.enterViewport(function() {
                portfolio_scroll_load_next_request($portfolio);
            });
        }
        $('.portfolio-count select').combobox();

        function init_circular_overlay($portfolio, $set) {
            if (!$portfolio.hasClass('hover-circular')) {
                return;
            }
            $('.portfolio-item', $set).on('mouseenter', function() {
                var overlayWidth = $('.overlay', this).width(),
                    overlayHeight = $('.overlay', this).height(),
                    $overlayCircle = $('.overlay-circle', this),
                    maxSize = 0;
                if (overlayWidth > overlayHeight) {
                    maxSize = overlayWidth;
                    $overlayCircle.height(overlayWidth)
                } else {
                    maxSize = overlayHeight;
                    $overlayCircle.width(overlayHeight);
                }
                maxSize += overlayWidth * 0.3;
                $overlayCircle.css({
                    marginLeft: -maxSize / 2,
                    marginTop: -maxSize / 2
                });
            });
        }
        $('.portfolio').not('.portfolio-slider').each(function() {
            var $portfolio = $(this);
            var $set = $('.portfolio-set', this);
            if ($portfolio.hasClass('portfolio-pagination-scroll')) {
                var current_page = 1;
                $('.portfolio-set .portfolio-item', $portfolio).addClass('paginator-page-1');
                init_portfolio_sorting($portfolio);
                init_portfolio_scroll_next_count($portfolio);
            } else if ($('.portfolio-load-more', $portfolio).size() == 0) {
                init_portfolio_count($portfolio);
                init_portfolio_sorting($portfolio);
                init_portfolio_pages($portfolio);
                var current_page = $portfolio.data('current-page');
            } else {
                var current_page = 1;
                $('.portfolio-set .portfolio-item', $portfolio).addClass('paginator-page-1');
                init_portfolio_sorting($portfolio);
                init_portfolio_more_count($portfolio);
            }
            if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.outerWidth() > 1170) {
                $('.image-inner picture source', $set).remove();
            }
            portfolio_images_loaded($set, '.image-inner img', function() {
                var sortOptions = get_portfolio_sorting_data($portfolio);
                var layoutMode = 'masonry-custom';
                if ($portfolio.hasClass('portfolio-style-metro')) {
                    layoutMode = 'metro';
                }
                var itemsAnimations = $portfolio.itemsAnimations({
                    itemSelector: '.portfolio-item',
                    scrollMonitor: true
                });
                init_circular_overlay($portfolio, $set);
                var isotope_options = {
                    itemSelector: '.portfolio-item',
                    layoutMode: layoutMode,
                    itemImageWrapperSelector: '.image-inner',
                    fixHeightDoubleItems: $portfolio.hasClass('portfolio-style-justified'),
                    'masonry-custom': {
                        columnWidth: '.portfolio-item:not(.double-item)'
                    },
                    filter: '.paginator-page-' + current_page,
                    transitionDuration: 0
                };
                if ($('.portfolio-load-more', $portfolio).size() == 0 && !$portfolio.hasClass('portfolio-pagination-scroll')) {
                    isotope_options['getSortData'] = window.defaultSortData;
                    isotope_options['sortBy'] = sortOptions.sortBy;
                    isotope_options['sortAscending'] = sortOptions.sortAscending;
                }
                var init_portfolio = true;
                $portfolio.closest('.portfolio-preloader-wrapper').prev('.preloader').remove();
                $set.on('layoutComplete', function(event, laidOutItems) {
                    if ($portfolio.hasClass('products')) {
                        var setWidth = $set[0].offsetWidth;
                        for (var i = 0; i < laidOutItems.length; i++) {
                            var item = laidOutItems[i],
                                itemWrapWidth = item.element.querySelector('.wrap').offsetWidth,
                                itemPadding = parseFloat($(item.element).css('padding-left'));
                            if (isNaN(itemPadding)) {
                                itemPadding = 0;
                            }
                            if ($portfolio.hasClass('hover-title') && $portfolio.hasClass('item-separator')) {
                                item.element.style.zIndex = laidOutItems.length - i;
                            }
                            if (item.position.x === 0) {
                                item.element.classList.add('left-item');
                            } else {
                                item.element.classList.remove('left-item');
                            }
                            if (item.position.y === 0) {
                                item.element.classList.add('top-item');
                            } else {
                                item.element.classList.remove('top-item');
                            }
                            if (item.position.x + itemWrapWidth + 2 * itemPadding > setWidth - 4) {
                                item.element.classList.add('right-item');
                            } else {
                                item.element.classList.remove('right-item');
                            }
                            if (itemWrapWidth < 320) {
                                item.element.classList.add('item-small-size');
                            } else {
                                item.element.classList.remove('item-small-size');
                            }
                        }
                    }
                }).on('arrangeComplete', function(event, filteredItems) {
                    if ($portfolio.hasClass('products')) {
                        if ($portfolio.hasClass('columns-1') && $portfolio.hasClass('caption-position-zigzag')) {
                            $('.portfolio-item .image', $portfolio).removeClass('col-md-push-4 col-md-push-5');
                            $('.portfolio-item .caption', $portfolio).removeClass('col-md-pull-8 col-md-pull-7');
                            for (var i = 0; i < filteredItems.length; i++) {
                                if (i % 2 == 1) {
                                    if ($(filteredItems[i].element).hasClass('portfolio-1x-fullwidth-item')) {
                                        $('.image', filteredItems[i].element).addClass('col-md-push-4');
                                        $('.caption', filteredItems[i].element).addClass('col-md-pull-8');
                                    } else {
                                        $('.image', filteredItems[i].element).addClass('col-md-push-5');
                                        $('.caption', filteredItems[i].element).addClass('col-md-pull-7');
                                    }
                                }
                            }
                        }
                        if ($portfolio.hasClass('title-on-hover') || $portfolio.hasClass('hover-gradient') || $portfolio.hasClass('hover-circular')) {
                            $('.portfolio-item .portfolio-icons-inner > a:not(.added_to_cart), .portfolio-item .portfolio-icons-inner .yith-wcwl-add-to-wishlist, .portfolio-item .portfolio-icons-inner .yith-wcwl-add-to-wishlist div:not(.yith-wcwl-wishlistaddedbrowse) a', $portfolio).addClass('icon');
                        }
                    }
                    if ($set.closest('.fullwidth-block').size() > 0) {
                        $set.closest('.fullwidth-block').bind('fullwidthUpdate', function() {
                            if ($set.data('isotope')) {
                                $set.isotope('layout');
                                return false;
                            }
                        });
                    } else {
                        if ($set.closest('.vc_row[data-vc-stretch-content="true"]').length > 0) {
                            $set.closest('.vc_row[data-vc-stretch-content="true"]').bind('VCRowFullwidthUpdate', function() {
                                if ($set.data('isotope')) {
                                    $set.isotope('layout');
                                    return false;
                                }
                            });
                        }
                    }
                    if (init_portfolio) {
                        var items = [];
                        filteredItems.forEach(function(item) {
                            items.push(item.element);
                        });
                        itemsAnimations.show($(items));
                    }
                }).isotope(isotope_options);
                if (!window.gemSettings.lasyDisabled) {
                    var elems = $('.portfolio-item:visible', $set);
                    var items = [];
                    for (var i = 0; i < elems.length; i++)
                        items.push($set.isotope('getItem', elems[i]));
                    $set.isotope('reveal', items);
                }
                if ($set.closest('.gem_tab').size() > 0) {
                    $set.closest('.gem_tab').bind('tab-update', function() {
                        if ($set.data('isotope')) {
                            $set.isotope('layout');
                        }
                    });
                }
                $(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function() {
                    var $tab = $(this).data('vc.accordion').getTarget();
                    if ($tab.find($set).length) {
                        if ($set.data('isotope')) {
                            $set.isotope('layout');
                        }
                    }
                });
                $(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function() {
                    var $tab = $(this).data('vc.accordion').getTarget();
                    if ($tab.find($set).length) {
                        if ($set.data('isotope')) {
                            $set.isotope('layout');
                        }
                    }
                });
                if ($set.closest('.gem_accordion_content').size() > 0) {
                    $set.closest('.gem_accordion_content').bind('accordion-update', function() {
                        if ($set.data('isotope')) {
                            $set.isotope('layout');
                        }
                    });
                }
                if ($('.portfolio-filters', $portfolio).size() > 0) {
                    $('.portfolio-filters, .portfolio-filters-resp ul li', $portfolio).on('click', 'a', function() {
                        if ($('.portfolio-load-more', $portfolio).size() == 0 && !$portfolio.hasClass('portfolio-pagination-scroll')) {
                            $('.portfolio-filters a.active, .portfolio-filters-resp ul li a.active', $portfolio).removeClass('active');
                            $(this).addClass('active');
                            init_portfolio_pages($portfolio);
                            var current_page = $portfolio.data('current-page');
                            var filterValue = $(this).data('filter') || '';
                            filterValue += '.paginator-page-' + current_page;
                            $portfolio.itemsAnimations('instance').reinitItems($('.portfolio-set .portfolio-item', $portfolio));
                            $('.portfolio-set', $portfolio).isotope({
                                filter: filterValue
                            });
                        } else {
                            var filterValue = $(this).data('filter') || '';
                            $('.portfolio-filters a.active, .portfolio-filters-resp ul li a.active', $portfolio).removeClass('active');
                            $(this).addClass('active');
                            $portfolio.data('more-filter', filterValue.substr(1));
                            $portfolio.data('next-page', 1);
                            if ($portfolio.hasClass('portfolio-pagination-scroll')) {
                                portfolio_scroll_load_next_request($portfolio);
                            } else {
                                portfolio_load_core_request($portfolio);
                            }
                        }
                        if ($('.portfolio-filters-resp', $portfolio).size() > 0)
                            $('.portfolio-filters-resp', $portfolio).dlmenu('closeMenu');
                        return false;
                    });
                }
                $('.info', $portfolio).on('click', 'a:not(.zilla-likes)', function() {
                    var slug = $(this).data('slug') || '';
                    $('.portfolio-filters a[data-filter=".' + slug + '"]').click();
                    return false;
                });
                $('.portfolio-load-more', $portfolio).on('click', function() {
                    portfolio_load_core_request($portfolio);
                });
                if ($portfolio.hasClass('portfolio-pagination-scroll')) {
                    init_portfolio_scroll_next_page($portfolio);
                }
            });
            $('.portfolio-filters-resp', $portfolio).dlmenu({
                animationClasses: {
                    classin: 'dl-animate-in',
                    classout: 'dl-animate-out'
                }
            });
        });

        function update_slider_paddings($portfolio) {
            var first_item_height = $('.portfolio-item:first .image-inner', $portfolio).outerHeight(),
                button_height = $('.portolio-slider-prev span', $portfolio).outerHeight(),
                itemPadding = parseFloat($('.portfolio-item:first', $portfolio).css('padding-top'));
            if (isNaN(itemPadding)) {
                itemPadding = 0;
            }
            $('.portolio-slider-prev', $portfolio).css('padding-top', (first_item_height - button_height) / 2 + itemPadding);
            $('.portolio-slider-next', $portfolio).css('padding-top', (first_item_height - button_height) / 2 + itemPadding);
        }
        $.fn.updatePortfolioSlider = function() {
            var $portfolio = $(this),
                $set = $('.portfolio-set:not(.fake)', $portfolio),
                autoscroll = parseInt($set.data('autoscroll'));
            if (!$portfolio.hasClass('gem-slider-animation-one')) {
                return;
            }
            if (isNaN(autoscroll)) {
                autoscroll = false;
            }
            var $fakeSet = $('.portfolio-set.fake', $portfolio),
                $fakeItem;
            if (!$fakeSet.length) {
                $fakeSet = $('<div class="portfolio-set fake" style="height: 0; overflow: hidden;"></div>').insertBefore($set);
                $fakeItem = $('.portfolio-item:first', $set).clone().css('width', '').appendTo($fakeSet);
            } else {
                $fakeItem = $('.portfolio-item:first', $fakeSet);
            }
            var fakeSetWidth = $fakeSet.outerWidth(),
                itemWidth = $fakeItem.outerWidth(),
                itemsCount = Math.round(fakeSetWidth / itemWidth),
                itemWidth = fakeSetWidth / itemsCount;
            $('.portfolio-item', $set).outerWidth(itemWidth);
            $portfolio.prev('.preloader').remove();
            $set.carouFredSel({
                auto: autoscroll,
                circular: true,
                infinite: true,
                scroll: {
                    items: 1,
                    pauseOnHover: true,
                    onBefore: function(data) {
                        for (var i = 0; i < data.items.old.length; i++) {
                            data.items.old[i].classList.remove('currentPosition-first', 'currentPosition-last');
                        }
                        for (var i = 0; i < data.items.visible.length; i++) {
                            if (i == 0) {
                                data.items.visible[i].classList.add('currentPosition-first');
                            }
                            if (i == data.items.visible.length - 1) {
                                data.items.visible[i].classList.add('currentPosition-last');
                            }
                        }
                    }
                },
                onCreate: function(data) {
                    for (var i = 0; i < data.items.length; i++) {
                        if (i == 0) {
                            data.items[i].classList.add('currentPosition-first');
                        }
                        if (i == data.items.length - 1) {
                            data.items[i].classList.add('currentPosition-last');
                        }
                    }
                },
                width: '100%',
                responsive: false,
                height: 'auto',
                align: 'center',
                prev: $('.portolio-slider-prev span', $portfolio),
                next: $('.portolio-slider-next span', $portfolio)
            });
        };
        $('.portfolio.portfolio-slider').each(function() {
            var $portfolio = $(this);
            var $set = $('.portfolio-set', this);
            var $prev = $('.portolio-slider-prev span', $portfolio);
            var $next = $('.portolio-slider-next span', $portfolio);
            if ($portfolio.hasClass('products') && ($portfolio.hasClass('title-on-hover') || $portfolio.hasClass('hover-gradient') || $portfolio.hasClass('hover-circular'))) {
                $('.portfolio-item .portfolio-icons-inner > a:not(.added_to_cart), .portfolio-item .portfolio-icons-inner .yith-wcwl-add-to-wishlist, .portfolio-item .portfolio-icons-inner .yith-wcwl-add-to-wishlist div:not(.yith-wcwl-wishlistaddedbrowse) a', $portfolio).addClass('icon');
            }
            portfolio_images_loaded($set, '.image-inner img', function() {
                init_circular_overlay($portfolio, $set);
                if ($portfolio.hasClass('gem-slider-animation-dynamic')) {
                    $set.juraSlider({
                        element: '.portfolio-item',
                        prevButton: $prev,
                        nextButton: $next,
                        nextPageDelay: $portfolio.hasClass('columns-2') ? 200 : 300,
                        afterInit: function() {
                            $portfolio.prev('.preloader').remove();
                        },
                        autoscroll: $set.data('autoscroll') ? $set.data('autoscroll') : false
                    });
                }
                if ($portfolio.hasClass('gem-slider-animation-one')) {
                    $portfolio.updatePortfolioSlider();
                    if ($portfolio.find('.fullwidth-block').length) {
                        $portfolio.find('.fullwidth-block').on('fullwidthUpdate', function() {
                            $portfolio.updatePortfolioSlider();
                        });
                    }
                    $(document).on('vc-full-width-row', function() {
                        $portfolio.updatePortfolioSlider();
                    });
                }
                update_slider_paddings($portfolio);
                setTimeout(function() {
                    update_slider_paddings($portfolio);
                }, 100);
            });
        });
        $(window).resize(function() {
            $('.portfolio.portfolio-slider').each(function() {
                var $portfolio = $(this);
                setTimeout(function() {
                    update_slider_paddings($portfolio);
                    $portfolio.updatePortfolioSlider();
                }, 10);
            });
        });
        $('body').on('click', 'a.icon.share', function(e) {
            e.preventDefault();
            $(this).closest('.links').find('.portfolio-sharing-pane').toggleClass('active');
            return false;
        });
        $('.portfolio-item').on('mouseleave', function() {
            $('.portfolio-sharing-pane').removeClass('active');
        });
        $('.portfolio').on('click', '.portfolio-item', function() {
            $(this).mouseover();
        });
    });
})(jQuery);;
/*!
 *
 * MediaElement.js
 * HTML5 <video> and <audio> shim and player
 * http://mediaelementjs.com/
 *
 * Creates a JavaScript object that mimics HTML5 MediaElement API
 * for browsers that don't understand HTML5 or can't play the provided codec
 * Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
 *
 * Copyright 2010-2014, John Dyer (http://j.hn)
 * License: MIT
 *
 */
var mejs = mejs || {};
mejs.version = "2.22.0", mejs.meIndex = 0, mejs.plugins = {
        silverlight: [{
            version: [3, 0],
            types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
        }],
        flash: [{
            version: [9, 0, 124],
            types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mpeg", "video/dailymotion", "video/x-dailymotion", "application/x-mpegURL"]
        }],
        youtube: [{
            version: null,
            types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]
        }],
        vimeo: [{
            version: null,
            types: ["video/vimeo", "video/x-vimeo"]
        }]
    }, mejs.Utility = {
        encodeUrl: function(a) {
            return encodeURIComponent(a)
        },
        escapeHTML: function(a) {
            return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")
        },
        absolutizeUrl: function(a) {
            var b = document.createElement("div");
            return b.innerHTML = '<a href="' + this.escapeHTML(a) + '">x</a>', b.firstChild.href
        },
        getScriptPath: function(a) {
            for (var b, c, d, e, f, g, h = 0, i = "", j = "", k = document.getElementsByTagName("script"), l = k.length, m = a.length; l > h; h++) {
                for (e = k[h].src, c = e.lastIndexOf("http://codex-themes.com/"), c > -1 ? (g = e.substring(c + 1), f = e.substring(0, c + 1)) : (g = e, f = ""), b = 0; m > b; b++)
                    if (j = a[b], d = g.indexOf(j), d > -1) {
                        i = f;
                        break
                    }
                if ("" !== i) break
            }
            return i
        },
        calculateTimeFormat: function(a, b, c) {
            0 > a && (a = 0), "undefined" == typeof c && (c = 25);
            var d = b.timeFormat,
                e = d[0],
                f = d[1] == d[0],
                g = f ? 2 : 1,
                h = ":",
                i = Math.floor(a / 3600) % 24,
                j = Math.floor(a / 60) % 60,
                k = Math.floor(a % 60),
                l = Math.floor((a % 1 * c).toFixed(3)),
                m = [
                    [l, "f"],
                    [k, "s"],
                    [j, "m"],
                    [i, "h"]
                ];
            d.length < g && (h = d[g]);
            for (var n = !1, o = 0, p = m.length; p > o; o++)
                if (-1 !== d.indexOf(m[o][1])) n = !0;
                else if (n) {
                for (var q = !1, r = o; p > r; r++)
                    if (m[r][0] > 0) {
                        q = !0;
                        break
                    }
                if (!q) break;
                f || (d = e + d), d = m[o][1] + h + d, f && (d = m[o][1] + d), e = m[o][1]
            }
            b.currentTimeFormat = d
        },
        twoDigitsString: function(a) {
            return 10 > a ? "0" + a : String(a)
        },
        secondsToTimeCode: function(a, b) {
            if (0 > a && (a = 0), "object" != typeof b) {
                var c = "m:ss";
                c = arguments[1] ? "hh:mm:ss" : c, c = arguments[2] ? c + ":ff" : c, b = {
                    currentTimeFormat: c,
                    framesPerSecond: arguments[3] || 25
                }
            }
            var d = b.framesPerSecond;
            "undefined" == typeof d && (d = 25);
            var c = b.currentTimeFormat,
                e = Math.floor(a / 3600) % 24,
                f = Math.floor(a / 60) % 60,
                g = Math.floor(a % 60),
                h = Math.floor((a % 1 * d).toFixed(3));
            lis = [
                [h, "f"],
                [g, "s"],
                [f, "m"],
                [e, "h"]
            ];
            var j = c;
            for (i = 0, len = lis.length; i < len; i++) j = j.replace(lis[i][1] + lis[i][1], this.twoDigitsString(lis[i][0])), j = j.replace(lis[i][1], lis[i][0]);
            return j
        },
        timeCodeToSeconds: function(a, b, c, d) {
            "undefined" == typeof c ? c = !1 : "undefined" == typeof d && (d = 25);
            var e = a.split(":"),
                f = parseInt(e[0], 10),
                g = parseInt(e[1], 10),
                h = parseInt(e[2], 10),
                i = 0,
                j = 0;
            return c && (i = parseInt(e[3]) / d), j = 3600 * f + 60 * g + h + i
        },
        convertSMPTEtoSeconds: function(a) {
            if ("string" != typeof a) return !1;
            a = a.replace(",", ".");
            var b = 0,
                c = -1 != a.indexOf(".") ? a.split(".")[1].length : 0,
                d = 1;
            a = a.split(":").reverse();
            for (var e = 0; e < a.length; e++) d = 1, e > 0 && (d = Math.pow(60, e)), b += Number(a[e]) * d;
            return Number(b.toFixed(c))
        },
        removeSwf: function(a) {
            var b = document.getElementById(a);
            b && /object|embed/i.test(b.nodeName) && (mejs.MediaFeatures.isIE ? (b.style.display = "none", function() {
                4 == b.readyState ? mejs.Utility.removeObjectInIE(a) : setTimeout(arguments.callee, 10)
            }()) : b.parentNode.removeChild(b))
        },
        removeObjectInIE: function(a) {
            var b = document.getElementById(a);
            if (b) {
                for (var c in b) "function" == typeof b[c] && (b[c] = null);
                b.parentNode.removeChild(b)
            }
        },
        determineScheme: function(a) {
            return a && -1 != a.indexOf("://") ? a.substr(0, a.indexOf("://") + 3) : "//"
        }
    }, mejs.PluginDetector = {
        hasPluginVersion: function(a, b) {
            var c = this.plugins[a];
            return b[1] = b[1] || 0, b[2] = b[2] || 0, c[0] > b[0] || c[0] == b[0] && c[1] > b[1] || c[0] == b[0] && c[1] == b[1] && c[2] >= b[2] ? !0 : !1
        },
        nav: window.navigator,
        ua: window.navigator.userAgent.toLowerCase(),
        plugins: [],
        addPlugin: function(a, b, c, d, e) {
            this.plugins[a] = this.detectPlugin(b, c, d, e)
        },
        detectPlugin: function(a, b, c, d) {
            var e, f, g, h = [0, 0, 0];
            if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[a]) {
                if (e = this.nav.plugins[a].description, e && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[b] || this.nav.mimeTypes[b].enabledPlugin))
                    for (h = e.replace(a, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), f = 0; f < h.length; f++) h[f] = parseInt(h[f].match(/\d+/), 10)
            } else if ("undefined" != typeof window.ActiveXObject) try {
                g = new ActiveXObject(c), g && (h = d(g))
            } catch (i) {}
            return h
        }
    }, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function(a) {
        var b = [],
            c = a.GetVariable("$version");
        return c && (c = c.split(" ")[1].split(","), b = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)]), b
    }), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function(a) {
        var b = [0, 0, 0, 0],
            c = function(a, b, c, d) {
                for (; a.isVersionSupported(b[0] + "." + b[1] + "." + b[2] + "." + b[3]);) b[c] += d;
                b[c] -= d
            };
        return c(a, b, 0, 1), c(a, b, 1, 1), c(a, b, 2, 1e4), c(a, b, 2, 1e3), c(a, b, 2, 100), c(a, b, 2, 10), c(a, b, 2, 1), c(a, b, 3, 1), b
    }), mejs.MediaFeatures = {
        init: function() {
            var a, b, c = this,
                d = document,
                e = mejs.PluginDetector.nav,
                f = mejs.PluginDetector.ua.toLowerCase(),
                g = ["source", "track", "audio", "video"];
            c.isiPad = null !== f.match(/ipad/i), c.isiPhone = null !== f.match(/iphone/i), c.isiOS = c.isiPhone || c.isiPad, c.isAndroid = null !== f.match(/android/i), c.isBustedAndroid = null !== f.match(/android 2\.[12]/), c.isBustedNativeHTTPS = "https:" === location.protocol && (null !== f.match(/android [12]\./) || null !== f.match(/macintosh.* version.* safari/)), c.isIE = -1 != e.appName.toLowerCase().indexOf("microsoft") || null !== e.appName.toLowerCase().match(/trident/gi), c.isChrome = null !== f.match(/chrome/gi), c.isChromium = null !== f.match(/chromium/gi), c.isFirefox = null !== f.match(/firefox/gi), c.isWebkit = null !== f.match(/webkit/gi), c.isGecko = null !== f.match(/gecko/gi) && !c.isWebkit && !c.isIE, c.isOpera = null !== f.match(/opera/gi), c.hasTouch = "ontouchstart" in window, c.svgAsImg = !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
            for (a = 0; a < g.length; a++) b = document.createElement(g[a]);
            c.supportsMediaTag = "undefined" != typeof b.canPlayType || c.isBustedAndroid;
            try {
                b.canPlayType("video/mp4")
            } catch (h) {
                c.supportsMediaTag = !1
            }
            c.supportsPointerEvents = function() {
                var a, b = document.createElement("x"),
                    c = document.documentElement,
                    d = window.getComputedStyle;
                return "pointerEvents" in b.style ? (b.style.pointerEvents = "auto", b.style.pointerEvents = "x", c.appendChild(b), a = d && "auto" === d(b, "").pointerEvents, c.removeChild(b), !!a) : !1
            }(), c.hasFirefoxPluginMovingProblem = !1, c.hasiOSFullScreen = "undefined" != typeof b.webkitEnterFullscreen, c.hasNativeFullscreen = "undefined" != typeof b.requestFullscreen, c.hasWebkitNativeFullScreen = "undefined" != typeof b.webkitRequestFullScreen, c.hasMozNativeFullScreen = "undefined" != typeof b.mozRequestFullScreen, c.hasMsNativeFullScreen = "undefined" != typeof b.msRequestFullscreen, c.hasTrueNativeFullScreen = c.hasWebkitNativeFullScreen || c.hasMozNativeFullScreen || c.hasMsNativeFullScreen, c.nativeFullScreenEnabled = c.hasTrueNativeFullScreen, c.hasMozNativeFullScreen ? c.nativeFullScreenEnabled = document.mozFullScreenEnabled : c.hasMsNativeFullScreen && (c.nativeFullScreenEnabled = document.msFullscreenEnabled), c.isChrome && (c.hasiOSFullScreen = !1), c.hasTrueNativeFullScreen && (c.fullScreenEventName = "", c.hasWebkitNativeFullScreen ? c.fullScreenEventName = "webkitfullscreenchange" : c.hasMozNativeFullScreen ? c.fullScreenEventName = "mozfullscreenchange" : c.hasMsNativeFullScreen && (c.fullScreenEventName = "MSFullscreenChange"), c.isFullScreen = function() {
                return c.hasMozNativeFullScreen ? d.mozFullScreen : c.hasWebkitNativeFullScreen ? d.webkitIsFullScreen : c.hasMsNativeFullScreen ? null !== d.msFullscreenElement : void 0
            }, c.requestFullScreen = function(a) {
                c.hasWebkitNativeFullScreen ? a.webkitRequestFullScreen() : c.hasMozNativeFullScreen ? a.mozRequestFullScreen() : c.hasMsNativeFullScreen && a.msRequestFullscreen()
            }, c.cancelFullScreen = function() {
                c.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : c.hasMozNativeFullScreen ? document.mozCancelFullScreen() : c.hasMsNativeFullScreen && document.msExitFullscreen()
            }), c.hasiOSFullScreen && f.match(/mac os x 10_5/i) && (c.hasNativeFullScreen = !1, c.hasiOSFullScreen = !1)
        }
    }, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
        pluginType: "native",
        isFullScreen: !1,
        setCurrentTime: function(a) {
            this.currentTime = a
        },
        setMuted: function(a) {
            this.muted = a
        },
        setVolume: function(a) {
            this.volume = a
        },
        stop: function() {
            this.pause()
        },
        setSrc: function(a) {
            for (var b = this.getElementsByTagName("source"); b.length > 0;) this.removeChild(b[0]);
            if ("string" == typeof a) this.src = a;
            else {
                var c, d;
                for (c = 0; c < a.length; c++)
                    if (d = a[c], this.canPlayType(d.type)) {
                        this.src = d.src;
                        break
                    }
            }
        },
        setVideoSize: function(a, b) {
            this.width = a, this.height = b
        }
    }, mejs.PluginMediaElement = function(a, b, c) {
        this.id = a, this.pluginType = b, this.src = c, this.events = {}, this.attributes = {}
    }, mejs.PluginMediaElement.prototype = {
        pluginElement: null,
        pluginType: "",
        isFullScreen: !1,
        playbackRate: -1,
        defaultPlaybackRate: -1,
        seekable: [],
        played: [],
        paused: !0,
        ended: !1,
        seeking: !1,
        duration: 0,
        error: null,
        tagName: "",
        muted: !1,
        volume: 1,
        currentTime: 0,
        play: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
        },
        load: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
        },
        pause: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? 1 == this.pluginApi.getPlayerState() && this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
        },
        stop: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
        },
        canPlayType: function(a) {
            var b, c, d, e = mejs.plugins[this.pluginType];
            for (b = 0; b < e.length; b++)
                if (d = e[b], mejs.PluginDetector.hasPluginVersion(this.pluginType, d.version))
                    for (c = 0; c < d.types.length; c++)
                        if (a == d.types[c]) return "probably";
            return ""
        },
        positionFullscreenButton: function(a, b, c) {
            null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(a), Math.floor(b), c)
        },
        hideFullscreenButton: function() {
            null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
        },
        setSrc: function(a) {
            if ("string" == typeof a) this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a)), this.src = mejs.Utility.absolutizeUrl(a);
            else {
                var b, c;
                for (b = 0; b < a.length; b++)
                    if (c = a[b], this.canPlayType(c.type)) {
                        this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src)), this.src = mejs.Utility.absolutizeUrl(c.src);
                        break
                    }
            }
        },
        setCurrentTime: function(a) {
            null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.seekTo(a) : this.pluginApi.setCurrentTime(a), this.currentTime = a)
        },
        setVolume: function(a) {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.setVolume(100 * a) : this.pluginApi.setVolume(a), this.volume = a)
        },
        setMuted: function(a) {
            null != this.pluginApi && ("youtube" == this.pluginType ? (a ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = a, this.dispatchEvent({
                type: "volumechange"
            })) : this.pluginApi.setMuted(a), this.muted = a)
        },
        setVideoSize: function(a, b) {
            this.pluginElement && this.pluginElement.style && (this.pluginElement.style.width = a + "px", this.pluginElement.style.height = b + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(a, b)
        },
        setFullscreen: function(a) {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(a)
        },
        enterFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
        },
        exitFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
        },
        addEventListener: function(a, b, c) {
            this.events[a] = this.events[a] || [], this.events[a].push(b)
        },
        removeEventListener: function(a, b) {
            if (!a) return this.events = {}, !0;
            var c = this.events[a];
            if (!c) return !0;
            if (!b) return this.events[a] = [], !0;
            for (var d = 0; d < c.length; d++)
                if (c[d] === b) return this.events[a].splice(d, 1), !0;
            return !1
        },
        dispatchEvent: function(a) {
            var b, c = this.events[a.type];
            if (c)
                for (b = 0; b < c.length; b++) c[b].apply(this, [a])
        },
        hasAttribute: function(a) {
            return a in this.attributes
        },
        removeAttribute: function(a) {
            delete this.attributes[a]
        },
        getAttribute: function(a) {
            return this.hasAttribute(a) ? this.attributes[a] : ""
        },
        setAttribute: function(a, b) {
            this.attributes[a] = b
        },
        remove: function() {
            mejs.Utility.removeSwf(this.pluginElement.id)
        }
    }, mejs.MediaElementDefaults = {
        mode: "auto",
        plugins: ["flash", "silverlight", "youtube", "vimeo"],
        enablePluginDebug: !1,
        httpsBasicAuthSite: !1,
        type: "",
        pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.html", "mediaelement-and-player.html", "mediaelement-and-player.min.js"]),
        flashName: "flashmediaelement.swf",
        flashStreamer: "",
        flashScriptAccess: "sameDomain",
        enablePluginSmoothing: !1,
        enablePseudoStreaming: !1,
        pseudoStreamingStartQueryParam: "start",
        silverlightName: "silverlightmediaelement.xap",
        defaultVideoWidth: 480,
        defaultVideoHeight: 270,
        pluginWidth: -1,
        pluginHeight: -1,
        pluginVars: [],
        timerRate: 250,
        startVolume: .8,
        success: function() {},
        error: function() {}
    }, mejs.MediaElement = function(a, b) {
        return mejs.HtmlMediaElementShim.create(a, b)
    }, mejs.HtmlMediaElementShim = {
        create: function(a, b) {
            var c, d, e = {},
                f = "string" == typeof a ? document.getElementById(a) : a,
                g = f.tagName.toLowerCase(),
                h = "audio" === g || "video" === g,
                i = h ? f.getAttribute("src") : f.getAttribute("href"),
                j = f.getAttribute("poster"),
                k = f.getAttribute("autoplay"),
                l = f.getAttribute("preload"),
                m = f.getAttribute("controls");
            for (d in mejs.MediaElementDefaults) e[d] = mejs.MediaElementDefaults[d];
            for (d in b) e[d] = b[d];
            return i = "undefined" == typeof i || null === i || "" == i ? null : i, j = "undefined" == typeof j || null === j ? "" : j, l = "undefined" == typeof l || null === l || "false" === l ? "none" : l, k = !("undefined" == typeof k || null === k || "false" === k), m = !("undefined" == typeof m || null === m || "false" === m), c = this.determinePlayback(f, e, mejs.MediaFeatures.supportsMediaTag, h, i), c.url = null !== c.url ? mejs.Utility.absolutizeUrl(c.url) : "", c.scheme = mejs.Utility.determineScheme(c.url), "native" == c.method ? (mejs.MediaFeatures.isBustedAndroid && (f.src = c.url, f.addEventListener("click", function() {
                f.play()
            }, !1)), this.updateNative(c, e, k, l)) : "" !== c.method ? this.createPlugin(c, e, j, k, l, m) : (this.createErrorMessage(c, e, j), this)
        },
        determinePlayback: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = [],
                r = {
                    method: "",
                    url: "",
                    htmlMediaElement: a,
                    isVideo: "audio" != a.tagName.toLowerCase(),
                    scheme: ""
                };
            if ("undefined" != typeof b.type && "" !== b.type)
                if ("string" == typeof b.type) q.push({
                    type: b.type,
                    url: e
                });
                else
                    for (f = 0; f < b.type.length; f++) q.push({
                        type: b.type[f],
                        url: e
                    });
            else if (null !== e) k = this.formatType(e, a.getAttribute("type")), q.push({
                type: k,
                url: e
            });
            else
                for (f = 0; f < a.childNodes.length; f++) j = a.childNodes[f], 1 == j.nodeType && "source" == j.tagName.toLowerCase() && (e = j.getAttribute("src"), k = this.formatType(e, j.getAttribute("type")), p = j.getAttribute("media"), (!p || !window.matchMedia || window.matchMedia && window.matchMedia(p).matches) && q.push({
                    type: k,
                    url: e
                }));
            if (!d && q.length > 0 && null !== q[0].url && this.getTypeFromFile(q[0].url).indexOf("audio") > -1 && (r.isVideo = !1), mejs.MediaFeatures.isBustedAndroid && (a.canPlayType = function(a) {
                    return null !== a.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
                }), mejs.MediaFeatures.isChromium && (a.canPlayType = function(a) {
                    return null !== a.match(/video\/(webm|ogv|ogg)/gi) ? "maybe" : ""
                }), c && ("auto" === b.mode || "auto_plugin" === b.mode || "native" === b.mode) && (!mejs.MediaFeatures.isBustedNativeHTTPS || b.httpsBasicAuthSite !== !0)) {
                for (d || (o = document.createElement(r.isVideo ? "video" : "audio"), a.parentNode.insertBefore(o, a), a.style.display = "none", r.htmlMediaElement = a = o), f = 0; f < q.length; f++)
                    if ("video/m3u8" == q[f].type || "" !== a.canPlayType(q[f].type).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/mp3/, "mpeg")).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/m4a/, "mp4")).replace(/no/, "")) {
                        r.method = "native", r.url = q[f].url;
                        break
                    }
                if ("native" === r.method && (null !== r.url && (a.src = r.url), "auto_plugin" !== b.mode)) return r
            }
            if ("auto" === b.mode || "auto_plugin" === b.mode || "shim" === b.mode)
                for (f = 0; f < q.length; f++)
                    for (k = q[f].type, g = 0; g < b.plugins.length; g++)
                        for (l = b.plugins[g], m = mejs.plugins[l], h = 0; h < m.length; h++)
                            if (n = m[h], null == n.version || mejs.PluginDetector.hasPluginVersion(l, n.version))
                                for (i = 0; i < n.types.length; i++)
                                    if (k.toLowerCase() == n.types[i].toLowerCase()) return r.method = l, r.url = q[f].url, r;
            return "auto_plugin" === b.mode && "native" === r.method ? r : ("" === r.method && q.length > 0 && (r.url = q[0].url), r)
        },
        formatType: function(a, b) {
            return a && !b ? this.getTypeFromFile(a) : b && ~b.indexOf(";") ? b.substr(0, b.indexOf(";")) : b
        },
        getTypeFromFile: function(a) {
            a = a.split("?")[0];
            var b = a.substring(a.lastIndexOf(".") + 1).toLowerCase(),
                c = /(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b) ? "video/" : "audio/";
            return this.getTypeFromExtension(b, c)
        },
        getTypeFromExtension: function(a, b) {
            switch (b = b || "", a) {
                case "mp4":
                case "m4v":
                case "m4a":
                case "f4v":
                case "f4a":
                    return b + "mp4";
                case "flv":
                    return b + "x-flv";
                case "webm":
                case "webma":
                case "webmv":
                    return b + "webm";
                case "ogg":
                case "oga":
                case "ogv":
                    return b + "ogg";
                case "m3u8":
                    return "application/x-mpegurl";
                case "ts":
                    return b + "mp2t";
                default:
                    return b + a
            }
        },
        createErrorMessage: function(a, b, c) {
            var d = a.htmlMediaElement,
                e = document.createElement("div"),
                f = b.customError;
            e.className = "me-cannotplay";
            try {
                e.style.width = d.width + "px", e.style.height = d.height + "px"
            } catch (g) {}
            f || (f = '<a href="' + a.url + '">', "" !== c && (f += '<img src="' + c + '" width="100%" height="100%" alt="" />'), f += "<span>" + mejs.i18n.t("Download File") + "</span></a>"), e.innerHTML = f, d.parentNode.insertBefore(e, d), d.style.display = "none", b.error(d)
        },
        createPlugin: function(a, b, c, d, e, f) {
            var g, h, i, j = a.htmlMediaElement,
                k = 1,
                l = 1,
                m = "me_" + a.method + "_" + mejs.meIndex++,
                n = new mejs.PluginMediaElement(m, a.method, a.url),
                o = document.createElement("div");
            n.tagName = j.tagName;
            for (var p = 0; p < j.attributes.length; p++) {
                var q = j.attributes[p];
                q.specified && n.setAttribute(q.name, q.value)
            }
            for (h = j.parentNode; null !== h && null != h.tagName && "body" !== h.tagName.toLowerCase() && null != h.parentNode && null != h.parentNode.tagName && null != h.parentNode.constructor && "ShadowRoot" === h.parentNode.constructor.name;) {
                if ("p" === h.parentNode.tagName.toLowerCase()) {
                    h.parentNode.parentNode.insertBefore(h, h.parentNode);
                    break
                }
                h = h.parentNode
            }
            switch (a.isVideo ? (k = b.pluginWidth > 0 ? b.pluginWidth : b.videoWidth > 0 ? b.videoWidth : null !== j.getAttribute("width") ? j.getAttribute("width") : b.defaultVideoWidth, l = b.pluginHeight > 0 ? b.pluginHeight : b.videoHeight > 0 ? b.videoHeight : null !== j.getAttribute("height") ? j.getAttribute("height") : b.defaultVideoHeight, k = mejs.Utility.encodeUrl(k), l = mejs.Utility.encodeUrl(l)) : b.enablePluginDebug && (k = 320, l = 240), n.success = b.success, o.className = "me-plugin", o.id = m + "_container", a.isVideo ? j.parentNode.insertBefore(o, j) : document.body.insertBefore(o, document.body.childNodes[0]), ("flash" === a.method || "silverlight" === a.method) && (i = ["id=" + m, "isvideo=" + (a.isVideo ? "true" : "false"), "autoplay=" + (d ? "true" : "false"), "preload=" + e, "width=" + k, "startvolume=" + b.startVolume, "timerrate=" + b.timerRate, "flashstreamer=" + b.flashStreamer, "height=" + l, "pseudostreamstart=" + b.pseudoStreamingStartQueryParam], null !== a.url && ("flash" == a.method ? i.push("file=" + mejs.Utility.encodeUrl(a.url)) : i.push("file=" + a.url)), b.enablePluginDebug && i.push("debug=true"), b.enablePluginSmoothing && i.push("smoothing=true"), b.enablePseudoStreaming && i.push("pseudostreaming=true"), f && i.push("controls=true"), b.pluginVars && (i = i.concat(b.pluginVars)), window[m + "_init"] = function() {
                switch (n.pluginType) {
                    case "flash":
                        n.pluginElement = n.pluginApi = document.getElementById(m);
                        break;
                    case "silverlight":
                        n.pluginElement = document.getElementById(n.id), n.pluginApi = n.pluginElement.Content.MediaElementJS
                }
                null != n.pluginApi && n.success && n.success(n, j)
            }, window[m + "_event"] = function(a, b) {
                var c, d, e;
                c = {
                    type: a,
                    target: n
                };
                for (d in b) n[d] = b[d], c[d] = b[d];
                e = b.bufferedTime || 0, c.target.buffered = c.buffered = {
                    start: function(a) {
                        return 0
                    },
                    end: function(a) {
                        return e
                    },
                    length: 1
                }, n.dispatchEvent(c)
            }), a.method) {
                case "silverlight":
                    o.innerHTML = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + m + '" name="' + m + '" width="' + k + '" height="' + l + '" class="mejs-shim"><param name="initParams" value="' + i.join(",") + '" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="' + b.pluginPath + b.silverlightName + '" /></object>';
                    break;
                case "flash":
                    mejs.MediaFeatures.isIE ? (g = document.createElement("div"), o.appendChild(g), g.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + m + '" width="' + k + '" height="' + l + '" class="mejs-shim"><param name="movie" value="' + b.pluginPath + b.flashName + "?" + (new Date).getTime() + '" /><param name="flashvars" value="' + i.join("&amp;") + '" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + b.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>') : o.innerHTML = '<embed id="' + m + '" name="' + m + '" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="' + b.flashScriptAccess + '" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="' + b.pluginPath + b.flashName + '" flashvars="' + i.join("&") + '" width="' + k + '" height="' + l + '" scale="default"class="mejs-shim"></embed>';
                    break;
                case "youtube":
                    var r;
                    if (-1 != a.url.lastIndexOf("youtu.be")) r = a.url.substr(a.url.lastIndexOf("http://codex-themes.com/") + 1), -1 != r.indexOf("?") && (r = r.substr(0, r.indexOf("?")));
                    else {
                        var s = a.url.match(/[?&]v=([^&#]+)|&|#|$/);
                        s && (r = s[1])
                    }
                    youtubeSettings = {
                        container: o,
                        containerId: o.id,
                        pluginMediaElement: n,
                        pluginId: m,
                        videoId: r,
                        height: l,
                        width: k,
                        scheme: a.scheme
                    }, window.postMessage ? mejs.YouTubeApi.enqueueIframe(youtubeSettings) : mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0]) && mejs.YouTubeApi.createFlash(youtubeSettings, b);
                    break;
                case "vimeo":
                    var t = m + "_player";
                    if (n.vimeoid = a.url.substr(a.url.lastIndexOf("http://codex-themes.com/") + 1), o.innerHTML = '<iframe src="' + a.scheme + "player.vimeo.com/video/" + n.vimeoid + "?api=1&portrait=0&byline=0&title=0&player_id=" + t + '" width="' + k + '" height="' + l + '" frameborder="0" class="mejs-shim" id="' + t + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "function" == typeof $f) {
                        var u = $f(o.childNodes[0]),
                            v = -1;
                        u.addEvent("ready", function() {
                            function a(a, b, c, d) {
                                var e = {
                                    type: c,
                                    target: b
                                };
                                "timeupdate" == c && (b.currentTime = e.currentTime = d.seconds, b.duration = e.duration = d.duration), b.dispatchEvent(e)
                            }
                            u.playVideo = function() {
                                u.api("play")
                            }, u.stopVideo = function() {
                                u.api("unload")
                            }, u.pauseVideo = function() {
                                u.api("pause")
                            }, u.seekTo = function(a) {
                                u.api("seekTo", a)
                            }, u.setVolume = function(a) {
                                u.api("setVolume", a)
                            }, u.setMuted = function(a) {
                                a ? (u.lastVolume = u.api("getVolume"), u.api("setVolume", 0)) : (u.api("setVolume", u.lastVolume), delete u.lastVolume)
                            }, u.getPlayerState = function() {
                                return v
                            }, u.addEvent("play", function() {
                                v = 1, a(u, n, "play"), a(u, n, "playing")
                            }), u.addEvent("pause", function() {
                                v = 2, a(u, n, "pause")
                            }), u.addEvent("finish", function() {
                                v = 0, a(u, n, "ended")
                            }), u.addEvent("playProgress", function(b) {
                                a(u, n, "timeupdate", b)
                            }), u.addEvent("seek", function(b) {
                                v = 3, a(u, n, "seeked", b)
                            }), u.addEvent("loadProgress", function(b) {
                                v = 3, a(u, n, "progress", b)
                            }), n.pluginElement = o, n.pluginApi = u, n.success(n, n.pluginElement)
                        })
                    } else console.warn("You need to include froogaloop for vimeo to work")
            }
            return j.style.display = "none", j.removeAttribute("autoplay"), n
        },
        updateNative: function(a, b, c, d) {
            var e, f = a.htmlMediaElement;
            for (e in mejs.HtmlMediaElement) f[e] = mejs.HtmlMediaElement[e];
            return b.success(f, f), f
        }
    }, mejs.YouTubeApi = {
        isIframeStarted: !1,
        isIframeLoaded: !1,
        loadIframeApi: function(a) {
            if (!this.isIframeStarted) {
                var b = document.createElement("script");
                b.src = a.scheme + "www.youtube.com/player_api";
                var c = document.getElementsByTagName("script")[0];
                c.parentNode.insertBefore(b, c), this.isIframeStarted = !0
            }
        },
        iframeQueue: [],
        enqueueIframe: function(a) {
            this.isLoaded ? this.createIframe(a) : (this.loadIframeApi(a), this.iframeQueue.push(a))
        },
        createIframe: function(a) {
            var b = a.pluginMediaElement,
                c = new YT.Player(a.containerId, {
                    height: a.height,
                    width: a.width,
                    videoId: a.videoId,
                    playerVars: {
                        controls: 0,
                        wmode: "transparent"
                    },
                    events: {
                        onReady: function() {
                            c.setVideoSize = function(a, b) {
                                c.setSize(a, b)
                            }, a.pluginMediaElement.pluginApi = c, a.pluginMediaElement.pluginElement = document.getElementById(a.containerId), b.success(b, b.pluginElement), setInterval(function() {
                                mejs.YouTubeApi.createEvent(c, b, "timeupdate")
                            }, 250)
                        },
                        onStateChange: function(a) {
                            mejs.YouTubeApi.handleStateChange(a.data, c, b)
                        }
                    }
                })
        },
        createEvent: function(a, b, c) {
            var d = {
                type: c,
                target: b
            };
            if (a && a.getDuration) {
                b.currentTime = d.currentTime = a.getCurrentTime(), b.duration = d.duration = a.getDuration(), d.paused = b.paused, d.ended = b.ended, d.muted = a.isMuted(), d.volume = a.getVolume() / 100, d.bytesTotal = a.getVideoBytesTotal(), d.bufferedBytes = a.getVideoBytesLoaded();
                var e = d.bufferedBytes / d.bytesTotal * d.duration;
                d.target.buffered = d.buffered = {
                    start: function(a) {
                        return 0
                    },
                    end: function(a) {
                        return e
                    },
                    length: 1
                }
            }
            b.dispatchEvent(d)
        },
        iFrameReady: function() {
            for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0;) {
                var a = this.iframeQueue.pop();
                this.createIframe(a)
            }
        },
        flashPlayers: {},
        createFlash: function(a) {
            this.flashPlayers[a.pluginId] = a;
            var b, c = a.scheme + "www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=" + a.pluginId + "&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";
            mejs.MediaFeatures.isIE ? (b = document.createElement("div"), a.container.appendChild(b), b.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + a.scheme + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + a.pluginId + '" width="' + a.width + '" height="' + a.height + '" class="mejs-shim"><param name="movie" value="' + c + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + options.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /></object>') : a.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + a.pluginId + '" data="' + c + '" width="' + a.width + '" height="' + a.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="' + options.flashScriptAccess + '"><param name="wmode" value="transparent"></object>'
        },
        flashReady: function(a) {
            var b = this.flashPlayers[a],
                c = document.getElementById(a),
                d = b.pluginMediaElement;
            d.pluginApi = d.pluginElement = c, b.success(d, d.pluginElement), c.cueVideoById(b.videoId);
            var e = b.containerId + "_callback";
            window[e] = function(a) {
                mejs.YouTubeApi.handleStateChange(a, c, d)
            }, c.addEventListener("onStateChange", e), setInterval(function() {
                mejs.YouTubeApi.createEvent(c, d, "timeupdate")
            }, 250), mejs.YouTubeApi.createEvent(c, d, "canplay")
        },
        handleStateChange: function(a, b, c) {
            switch (a) {
                case -1:
                    c.paused = !0, c.ended = !0, mejs.YouTubeApi.createEvent(b, c, "loadedmetadata");
                    break;
                case 0:
                    c.paused = !1, c.ended = !0, mejs.YouTubeApi.createEvent(b, c, "ended");
                    break;
                case 1:
                    c.paused = !1, c.ended = !1, mejs.YouTubeApi.createEvent(b, c, "play"), mejs.YouTubeApi.createEvent(b, c, "playing");
                    break;
                case 2:
                    c.paused = !0, c.ended = !1, mejs.YouTubeApi.createEvent(b, c, "pause");
                    break;
                case 3:
                    mejs.YouTubeApi.createEvent(b, c, "progress");
                    break;
                case 5:
            }
        }
    }, window.onYouTubePlayerAPIReady = function() {
        mejs.YouTubeApi.iFrameReady()
    }, window.onYouTubePlayerReady = function(a) {
        mejs.YouTubeApi.flashReady(a)
    }, window.mejs = mejs, window.MediaElement = mejs.MediaElement,
    function(a, b, c) {
        "use strict";
        var d = {
            locale: {
                language: b.i18n && b.i18n.locale.language || "",
                strings: b.i18n && b.i18n.locale.strings || {}
            },
            ietf_lang_regex: /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/,
            methods: {}
        };
        d.getLanguage = function() {
            var a = d.locale.language || window.navigator.userLanguage || window.navigator.language;
            return d.ietf_lang_regex.exec(a) ? a : null
        }, "undefined" != typeof mejsL10n && (d.locale.language = mejsL10n.language), d.methods.checkPlain = function(a) {
            var b, c, d = {
                "&": "&amp;",
                '"': "&quot;",
                "<": "&lt;",
                ">": "&gt;"
            };
            a = String(a);
            for (b in d) d.hasOwnProperty(b) && (c = new RegExp(b, "g"), a = a.replace(c, d[b]));
            return a
        }, d.methods.t = function(a, b) {
            return d.locale.strings && d.locale.strings[b.context] && d.locale.strings[b.context][a] && (a = d.locale.strings[b.context][a]), d.methods.checkPlain(a)
        }, d.t = function(a, b) {
            if ("string" == typeof a && a.length > 0) {
                var c = d.getLanguage();
                return b = b || {
                    context: c
                }, d.methods.t(a, b)
            }
            throw {
                name: "InvalidArgumentException",
                message: "First argument is either not a string or empty."
            }
        }, b.i18n = d
    }(document, mejs),
    function(a, b) {
        "use strict";
        "undefined" != typeof mejsL10n && (a[mejsL10n.language] = mejsL10n.strings)
    }(mejs.i18n.locale.strings),
    /*!
     *
     * MediaElementPlayer
     * http://mediaelementjs.com/
     *
     * Creates a controller bar for HTML5 <video> add <audio> tags
     * using jQuery and MediaElement.js (HTML5 Flash/Silverlight wrapper)
     *
     * Copyright 2010-2013, John Dyer (http://j.hn/)
     * License: MIT
     *
     */
    "undefined" != typeof jQuery ? mejs.$ = jQuery : "undefined" != typeof Zepto ? (mejs.$ = Zepto, Zepto.fn.outerWidth = function(a) {
        var b = $(this).width();
        return a && (b += parseInt($(this).css("margin-right"), 10), b += parseInt($(this).css("margin-left"), 10)), b
    }) : "undefined" != typeof ender && (mejs.$ = ender),
    function(a) {
        mejs.MepDefaults = {
                poster: "",
                showPosterWhenEnded: !1,
                defaultVideoWidth: 480,
                defaultVideoHeight: 270,
                videoWidth: -1,
                videoHeight: -1,
                defaultAudioWidth: 400,
                defaultAudioHeight: 30,
                defaultSeekBackwardInterval: function(a) {
                    return .05 * a.duration
                },
                defaultSeekForwardInterval: function(a) {
                    return .05 * a.duration
                },
                setDimensions: !0,
                audioWidth: -1,
                audioHeight: -1,
                startVolume: .8,
                loop: !1,
                autoRewind: !0,
                enableAutosize: !0,
                timeFormat: "",
                alwaysShowHours: !1,
                showTimecodeFrameCount: !1,
                framesPerSecond: 25,
                autosizeProgress: !0,
                alwaysShowControls: !1,
                hideVideoControlsOnLoad: !1,
                clickToPlayPause: !0,
                iPadUseNativeControls: !1,
                iPhoneUseNativeControls: !1,
                AndroidUseNativeControls: !1,
                features: ["playpause", "current", "progress", "duration", "tracks", "volume", "fullscreen"],
                isVideo: !0,
                stretching: "auto",
                enableKeyboard: !0,
                pauseOtherPlayers: !0,
                keyActions: [{
                    keys: [32, 179],
                    action: function(a, b) {
                        b.paused || b.ended ? b.play() : b.pause()
                    }
                }, {
                    keys: [38],
                    action: function(a, b) {
                        a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                        var c = Math.min(b.volume + .1, 1);
                        b.setVolume(c)
                    }
                }, {
                    keys: [40],
                    action: function(a, b) {
                        a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                        var c = Math.max(b.volume - .1, 0);
                        b.setVolume(c)
                    }
                }, {
                    keys: [37, 227],
                    action: function(a, b) {
                        if (!isNaN(b.duration) && b.duration > 0) {
                            a.isVideo && (a.showControls(), a.startControlsTimer());
                            var c = Math.max(b.currentTime - a.options.defaultSeekBackwardInterval(b), 0);
                            b.setCurrentTime(c)
                        }
                    }
                }, {
                    keys: [39, 228],
                    action: function(a, b) {
                        if (!isNaN(b.duration) && b.duration > 0) {
                            a.isVideo && (a.showControls(), a.startControlsTimer());
                            var c = Math.min(b.currentTime + a.options.defaultSeekForwardInterval(b), b.duration);
                            b.setCurrentTime(c)
                        }
                    }
                }, {
                    keys: [70],
                    action: function(a, b) {
                        "undefined" != typeof a.enterFullScreen && (a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen())
                    }
                }, {
                    keys: [77],
                    action: function(a, b) {
                        a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer()), a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                    }
                }]
            }, mejs.mepIndex = 0, mejs.players = {}, mejs.MediaElementPlayer = function(b, c) {
                if (!(this instanceof mejs.MediaElementPlayer)) return new mejs.MediaElementPlayer(b, c);
                var d = this;
                return d.$media = d.$node = a(b), d.node = d.media = d.$media[0], d.node ? "undefined" != typeof d.node.player ? d.node.player : ("undefined" == typeof c && (c = d.$node.data("mejsoptions")), d.options = a.extend({}, mejs.MepDefaults, c), d.options.timeFormat || (d.options.timeFormat = "mm:ss", d.options.alwaysShowHours && (d.options.timeFormat = "hh:mm:ss"), d.options.showTimecodeFrameCount && (d.options.timeFormat += ":ff")), mejs.Utility.calculateTimeFormat(0, d.options, d.options.framesPerSecond || 25), d.id = "mep_" + mejs.mepIndex++, mejs.players[d.id] = d, d.init(), d) : void 0
            }, mejs.MediaElementPlayer.prototype = {
                hasFocus: !1,
                controlsAreVisible: !0,
                init: function() {
                    var b = this,
                        c = mejs.MediaFeatures,
                        d = a.extend(!0, {}, b.options, {
                            success: function(a, c) {
                                b.meReady(a, c)
                            },
                            error: function(a) {
                                b.handleError(a)
                            }
                        }),
                        e = b.media.tagName.toLowerCase();
                    if (b.isDynamic = "audio" !== e && "video" !== e, b.isDynamic ? b.isVideo = b.options.isVideo : b.isVideo = "audio" !== e && b.options.isVideo, c.isiPad && b.options.iPadUseNativeControls || c.isiPhone && b.options.iPhoneUseNativeControls) b.$media.attr("controls", "controls"), c.isiPad && null !== b.media.getAttribute("autoplay") && b.play();
                    else if (c.isAndroid && b.options.AndroidUseNativeControls);
                    else {
                        b.$media.removeAttr("controls");
                        var f = b.isVideo ? mejs.i18n.t("Video Player") : mejs.i18n.t("Audio Player");
                        a('<span class="mejs-offscreen">' + f + "</span>").insertBefore(b.$media), b.container = a('<div id="' + b.id + '" class="mejs-container ' + (mejs.MediaFeatures.svgAsImg ? "svg" : "no-svg") + '" tabindex="0" role="application" aria-label="' + f + '"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(b.$media[0].className).insertBefore(b.$media).focus(function(a) {
                            if (!b.controlsAreVisible && !b.hasFocus && (b.showControls(!0), !b.hasMsNativeFullScreen)) {
                                var c = b.container.find(".mejs-playpause-button > button");
                                c.focus()
                            }
                        }), "fill" !== b.options.stretching || b.container.parent("mejs-fill-container").length || (b.outerContainer = b.$media.parent(), b.container.wrap('<div class="mejs-fill-container"/>')), b.container.addClass((c.isAndroid ? "mejs-android " : "") + (c.isiOS ? "mejs-ios " : "") + (c.isiPad ? "mejs-ipad " : "") + (c.isiPhone ? "mejs-iphone " : "") + (b.isVideo ? "mejs-video " : "mejs-audio ")), b.container.find(".mejs-mediaelement").append(b.$media), b.node.player = b, b.controls = b.container.find(".mejs-controls"), b.layers = b.container.find(".mejs-layers");
                        var g = b.isVideo ? "video" : "audio",
                            h = g.substring(0, 1).toUpperCase() + g.substring(1);
                        b.options[g + "Width"] > 0 || b.options[g + "Width"].toString().indexOf("%") > -1 ? b.width = b.options[g + "Width"] : "" !== b.media.style.width && null !== b.media.style.width ? b.width = b.media.style.width : null !== b.media.getAttribute("width") ? b.width = b.$media.attr("width") : b.width = b.options["default" + h + "Width"], b.options[g + "Height"] > 0 || b.options[g + "Height"].toString().indexOf("%") > -1 ? b.height = b.options[g + "Height"] : "" !== b.media.style.height && null !== b.media.style.height ? b.height = b.media.style.height : null !== b.$media[0].getAttribute("height") ? b.height = b.$media.attr("height") : b.height = b.options["default" + h + "Height"], b.setPlayerSize(b.width, b.height), d.pluginWidth = b.width, d.pluginHeight = b.height
                    }
                    mejs.MediaElement(b.$media[0], d), "undefined" != typeof b.container && b.controlsAreVisible && b.container.trigger("controlsshown")
                },
                showControls: function(a) {
                    var b = this;
                    a = "undefined" == typeof a || a, b.controlsAreVisible || (a ? (b.controls.removeClass("mejs-offscreen").stop(!0, !0).fadeIn(200, function() {
                        b.controlsAreVisible = !0, b.container.trigger("controlsshown")
                    }), b.container.find(".mejs-control").removeClass("mejs-offscreen").stop(!0, !0).fadeIn(200, function() {
                        b.controlsAreVisible = !0
                    })) : (b.controls.removeClass("mejs-offscreen").css("display", "block"), b.container.find(".mejs-control").removeClass("mejs-offscreen").css("display", "block"), b.controlsAreVisible = !0, b.container.trigger("controlsshown")), b.setControlsSize())
                },
                hideControls: function(b) {
                    var c = this;
                    b = "undefined" == typeof b || b, !c.controlsAreVisible || c.options.alwaysShowControls || c.keyboardAction || (b ? (c.controls.stop(!0, !0).fadeOut(200, function() {
                        a(this).addClass("mejs-offscreen").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")
                    }), c.container.find(".mejs-control").stop(!0, !0).fadeOut(200, function() {
                        a(this).addClass("mejs-offscreen").css("display", "block")
                    })) : (c.controls.addClass("mejs-offscreen").css("display", "block"), c.container.find(".mejs-control").addClass("mejs-offscreen").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")))
                },
                controlsTimer: null,
                startControlsTimer: function(a) {
                    var b = this;
                    a = "undefined" != typeof a ? a : 1500, b.killControlsTimer("start"), b.controlsTimer = setTimeout(function() {
                        b.hideControls(), b.killControlsTimer("hide")
                    }, a)
                },
                killControlsTimer: function(a) {
                    var b = this;
                    null !== b.controlsTimer && (clearTimeout(b.controlsTimer), delete b.controlsTimer, b.controlsTimer = null)
                },
                controlsEnabled: !0,
                disableControls: function() {
                    var a = this;
                    a.killControlsTimer(), a.hideControls(!1), this.controlsEnabled = !1
                },
                enableControls: function() {
                    var a = this;
                    a.showControls(!1), a.controlsEnabled = !0
                },
                meReady: function(b, c) {
                    var d, e, f = this,
                        g = mejs.MediaFeatures,
                        h = c.getAttribute("autoplay"),
                        i = !("undefined" == typeof h || null === h || "false" === h);
                    if (!f.created) {
                        if (f.created = !0, f.media = b, f.domNode = c, !(g.isAndroid && f.options.AndroidUseNativeControls || g.isiPad && f.options.iPadUseNativeControls || g.isiPhone && f.options.iPhoneUseNativeControls)) {
                            f.buildposter(f, f.controls, f.layers, f.media), f.buildkeyboard(f, f.controls, f.layers, f.media), f.buildoverlays(f, f.controls, f.layers, f.media), f.findTracks();
                            for (d in f.options.features)
                                if (e = f.options.features[d], f["build" + e]) try {
                                    f["build" + e](f, f.controls, f.layers, f.media)
                                } catch (j) {}
                            f.container.trigger("controlsready"), f.setPlayerSize(f.width, f.height), f.setControlsSize(), f.isVideo && (mejs.MediaFeatures.hasTouch ? f.$media.bind("touchstart", function() {
                                f.controlsAreVisible ? f.hideControls(!1) : f.controlsEnabled && f.showControls(!1)
                            }) : (f.clickToPlayPauseCallback = function() {
                                f.options.clickToPlayPause && (f.media.paused ? f.play() : f.pause())
                            }, f.media.addEventListener("click", f.clickToPlayPauseCallback, !1), f.container.bind("mouseenter", function() {
                                f.controlsEnabled && (f.options.alwaysShowControls || (f.killControlsTimer("enter"), f.showControls(), f.startControlsTimer(2500)))
                            }).bind("mousemove", function() {
                                f.controlsEnabled && (f.controlsAreVisible || f.showControls(), f.options.alwaysShowControls || f.startControlsTimer(2500))
                            }).bind("mouseleave", function() {
                                f.controlsEnabled && (f.media.paused || f.options.alwaysShowControls || f.startControlsTimer(1e3))
                            })), f.options.hideVideoControlsOnLoad && f.hideControls(!1), i && !f.options.alwaysShowControls && f.hideControls(), f.options.enableAutosize && f.media.addEventListener("loadedmetadata", function(a) {
                                f.options.videoHeight <= 0 && null === f.domNode.getAttribute("height") && !isNaN(a.target.videoHeight) && (f.setPlayerSize(a.target.videoWidth, a.target.videoHeight), f.setControlsSize(), f.media.setVideoSize(a.target.videoWidth, a.target.videoHeight))
                            }, !1)), f.media.addEventListener("play", function() {
                                var a;
                                for (a in mejs.players) {
                                    var b = mejs.players[a];
                                    b.id == f.id || !f.options.pauseOtherPlayers || b.paused || b.ended || b.pause(), b.hasFocus = !1
                                }
                                f.hasFocus = !0
                            }, !1), f.media.addEventListener("ended", function(b) {
                                if (f.options.autoRewind) try {
                                    f.media.setCurrentTime(0), window.setTimeout(function() {
                                        a(f.container).find(".mejs-overlay-loading").parent().hide()
                                    }, 20)
                                } catch (c) {}
                                f.media.pause(), f.setProgressRail && f.setProgressRail(), f.setCurrentRail && f.setCurrentRail(), f.options.loop ? f.play() : !f.options.alwaysShowControls && f.controlsEnabled && f.showControls()
                            }, !1), f.media.addEventListener("loadedmetadata", function(a) {
                                f.updateDuration && f.updateDuration(), f.updateCurrent && f.updateCurrent(), f.isFullScreen || (f.setPlayerSize(f.width, f.height), f.setControlsSize())
                            }, !1);
                            var k = null;
                            f.media.addEventListener("timeupdate", function() {
                                k !== this.duration && (k = this.duration, mejs.Utility.calculateTimeFormat(k, f.options, f.options.framesPerSecond || 25), f.updateDuration && f.updateDuration(), f.updateCurrent && f.updateCurrent(), f.setControlsSize())
                            }, !1), f.container.focusout(function(b) {
                                if (b.relatedTarget) {
                                    var c = a(b.relatedTarget);
                                    f.keyboardAction && 0 === c.parents(".mejs-container").length && (f.keyboardAction = !1, f.hideControls(!0))
                                }
                            }), setTimeout(function() {
                                f.setPlayerSize(f.width, f.height), f.setControlsSize()
                            }, 50), f.globalBind("resize", function() {
                                f.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen || f.setPlayerSize(f.width, f.height), f.setControlsSize()
                            }), "youtube" == f.media.pluginType && (g.isiOS || g.isAndroid) && (f.container.find(".mejs-overlay-play").hide(), f.container.find(".mejs-poster").hide())
                        }
                        i && "native" == b.pluginType && f.play(), f.options.success && ("string" == typeof f.options.success ? window[f.options.success](f.media, f.domNode, f) : f.options.success(f.media, f.domNode, f))
                    }
                },
                handleError: function(a) {
                    var b = this;
                    b.controls && b.controls.hide(), b.options.error && b.options.error(a)
                },
                setPlayerSize: function(a, b) {
                    var c = this;
                    if (!c.options.setDimensions) return !1;
                    switch ("undefined" != typeof a && (c.width = a), "undefined" != typeof b && (c.height = b), c.options.stretching) {
                        case "fill":
                            c.isVideo ? this.setFillMode() : this.setDimensions(c.width, c.height);
                            break;
                        case "responsive":
                            this.setResponsiveMode();
                            break;
                        case "none":
                            this.setDimensions(c.width, c.height);
                            break;
                        default:
                            this.hasFluidMode() === !0 ? this.setResponsiveMode() : this.setDimensions(c.width, c.height)
                    }
                },
                hasFluidMode: function() {
                    var a = this;
                    return a.height.toString().indexOf("%") > 0 || "none" !== a.$node.css("max-width") && "t.width" !== a.$node.css("max-width") || a.$node[0].currentStyle && "100%" === a.$node[0].currentStyle.maxWidth
                },
                setResponsiveMode: function() {
                    var b = this,
                        c = function() {
                            return b.isVideo ? b.media.videoWidth && b.media.videoWidth > 0 ? b.media.videoWidth : null !== b.media.getAttribute("width") ? b.media.getAttribute("width") : b.options.defaultVideoWidth : b.options.defaultAudioWidth
                        }(),
                        d = function() {
                            return b.isVideo ? b.media.videoHeight && b.media.videoHeight > 0 ? b.media.videoHeight : null !== b.media.getAttribute("height") ? b.media.getAttribute("height") : b.options.defaultVideoHeight : b.options.defaultAudioHeight
                        }(),
                        e = b.container.parent().closest(":visible").width(),
                        f = b.container.parent().closest(":visible").height(),
                        g = b.isVideo || !b.options.autosizeProgress ? parseInt(e * d / c, 10) : d;
                    (isNaN(g) || 0 !== f && g > f && f > d) && (g = f), b.container.parent().length > 0 && "body" === b.container.parent()[0].tagName.toLowerCase() && (e = a(window).width(), g = a(window).height()), g && e && (b.container.width(e).height(g), b.$media.add(b.container.find(".mejs-shim")).width("100%").height("100%"), b.isVideo && b.media.setVideoSize && b.media.setVideoSize(e, g), b.layers.children(".mejs-layer").width("100%").height("100%"))
                },
                setFillMode: function() {
                    var a = this,
                        b = a.outerContainer;
                    b.width() || b.height(a.$media.width()), b.height() || b.height(a.$media.height());
                    var c = b.width(),
                        d = b.height();
                    a.setDimensions("100%", "100%"), a.container.find(".mejs-poster img").css("display", "block"), targetElement = a.container.find("object, embed, iframe, video");
                    var e = a.height,
                        f = a.width,
                        g = c,
                        h = e * c / f,
                        i = f * d / e,
                        j = d,
                        k = !(i > c),
                        l = k ? Math.floor(g) : Math.floor(i),
                        m = k ? Math.floor(h) : Math.floor(j);
                    k ? (targetElement.height(m).width(c), a.media.setVideoSize && a.media.setVideoSize(c, m)) : (targetElement.height(d).width(l), a.media.setVideoSize && a.media.setVideoSize(l, d)), targetElement.css({
                        "margin-left": Math.floor((c - l) / 2),
                        "margin-top": 0
                    })
                },
                setDimensions: function(a, b) {
                    var c = this;
                    c.container.width(a).height(b), c.layers.children(".mejs-layer").width(a).height(b)
                },
                setControlsSize: function() {
                    var b = this,
                        c = 0,
                        d = 0,
                        e = b.controls.find(".mejs-time-rail"),
                        f = b.controls.find(".mejs-time-total"),
                        g = e.siblings(),
                        h = g.last(),
                        i = null;
                    if (b.container.is(":visible") && e.length && e.is(":visible")) {
                        b.options && !b.options.autosizeProgress && (d = parseInt(e.css("width"), 10)), 0 !== d && d || (g.each(function() {
                            var b = a(this);
                            "absolute" != b.css("position") && b.is(":visible") && (c += a(this).outerWidth(!0))
                        }), d = b.controls.width() - c - (e.outerWidth(!0) - e.width()));
                        do e.width(d), f.width(d - (f.outerWidth(!0) - f.width())), "absolute" != h.css("position") && (i = h.length ? h.position() : null, d--); while (null !== i && i.top.toFixed(2) > 0 && d > 0);
                        b.container.trigger("controlsresize")
                    }
                },
                buildposter: function(b, c, d, e) {
                    var f = this,
                        g = a('<div class="mejs-poster mejs-layer"></div>').appendTo(d),
                        h = b.$media.attr("poster");
                    "" !== b.options.poster && (h = b.options.poster), h ? f.setPoster(h) : g.hide(), e.addEventListener("play", function() {
                        g.hide()
                    }, !1), b.options.showPosterWhenEnded && b.options.autoRewind && e.addEventListener("ended", function() {
                        g.show()
                    }, !1)
                },
                setPoster: function(b) {
                    var c = this,
                        d = c.container.find(".mejs-poster"),
                        e = d.find("img");
                    0 === e.length && (e = a('<img width="100%" height="100%" alt="" />').appendTo(d)), e.attr("src", b), d.css({
                        "background-image": "url(" + b + ")"
                    })
                },
                buildoverlays: function(b, c, d, e) {
                    var f = this;
                    if (b.isVideo) {
                        var g = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(d),
                            h = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(d),
                            i = a('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(d).bind("click", function() {
                                f.options.clickToPlayPause && e.paused && e.play()
                            });
                        e.addEventListener("play", function() {
                            i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                        }, !1), e.addEventListener("playing", function() {
                            i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                        }, !1), e.addEventListener("seeking", function() {
                            g.show(), c.find(".mejs-time-buffering").show()
                        }, !1), e.addEventListener("seeked", function() {
                            g.hide(), c.find(".mejs-time-buffering").hide()
                        }, !1), e.addEventListener("pause", function() {
                            mejs.MediaFeatures.isiPhone || i.show()
                        }, !1), e.addEventListener("waiting", function() {
                            g.show(), c.find(".mejs-time-buffering").show()
                        }, !1), e.addEventListener("loadeddata", function() {
                            g.show(), c.find(".mejs-time-buffering").show(), mejs.MediaFeatures.isAndroid && (e.canplayTimeout = window.setTimeout(function() {
                                if (document.createEvent) {
                                    var a = document.createEvent("HTMLEvents");
                                    return a.initEvent("canplay", !0, !0), e.dispatchEvent(a)
                                }
                            }, 300))
                        }, !1), e.addEventListener("canplay", function() {
                            g.hide(), c.find(".mejs-time-buffering").hide(), clearTimeout(e.canplayTimeout)
                        }, !1), e.addEventListener("error", function(a) {
                            f.handleError(a), g.hide(), i.hide(), h.show(), h.find(".mejs-overlay-error").html("Error loading this resource")
                        }, !1), e.addEventListener("keydown", function(a) {
                            f.onkeydown(b, e, a)
                        }, !1)
                    }
                },
                buildkeyboard: function(b, c, d, e) {
                    var f = this;
                    f.container.keydown(function() {
                        f.keyboardAction = !0
                    }), f.globalBind("keydown", function(c) {
                        return b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length && a(c.target).closest(".mejs-container").attr("id") === b.$media.closest(".mejs-container").attr("id"), f.onkeydown(b, e, c)
                    }), f.globalBind("click", function(c) {
                        b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length
                    })
                },
                onkeydown: function(a, b, c) {
                    if (a.hasFocus && a.options.enableKeyboard)
                        for (var d = 0, e = a.options.keyActions.length; e > d; d++)
                            for (var f = a.options.keyActions[d], g = 0, h = f.keys.length; h > g; g++)
                                if (c.keyCode == f.keys[g]) return "function" == typeof c.preventDefault && c.preventDefault(), f.action(a, b, c.keyCode, c), !1;
                    return !0
                },
                findTracks: function() {
                    var b = this,
                        c = b.$media.find("track");
                    b.tracks = [], c.each(function(c, d) {
                        d = a(d), b.tracks.push({
                            srclang: d.attr("srclang") ? d.attr("srclang").toLowerCase() : "",
                            src: d.attr("src"),
                            kind: d.attr("kind"),
                            label: d.attr("label") || "",
                            entries: [],
                            isLoaded: !1
                        })
                    })
                },
                changeSkin: function(a) {
                    this.container[0].className = "mejs-container " + a, this.setPlayerSize(this.width, this.height), this.setControlsSize()
                },
                play: function() {
                    this.load(), this.media.play()
                },
                pause: function() {
                    try {
                        this.media.pause()
                    } catch (a) {}
                },
                load: function() {
                    this.isLoaded || this.media.load(), this.isLoaded = !0
                },
                setMuted: function(a) {
                    this.media.setMuted(a)
                },
                setCurrentTime: function(a) {
                    this.media.setCurrentTime(a)
                },
                getCurrentTime: function() {
                    return this.media.currentTime
                },
                setVolume: function(a) {
                    this.media.setVolume(a)
                },
                getVolume: function() {
                    return this.media.volume
                },
                setSrc: function(a) {
                    this.media.setSrc(a)
                },
                remove: function() {
                    var a, b, c = this;
                    c.container.prev(".mejs-offscreen").remove();
                    for (a in c.options.features)
                        if (b = c.options.features[a], c["clean" + b]) try {
                            c["clean" + b](c)
                        } catch (d) {}
                    c.isDynamic ? c.$node.insertBefore(c.container) : (c.$media.prop("controls", !0), c.$node.clone().insertBefore(c.container).show(), c.$node.remove()), "native" !== c.media.pluginType && c.media.remove(), delete mejs.players[c.id], "object" == typeof c.container && c.container.remove(), c.globalUnbind(), delete c.node.player
                },
                rebuildtracks: function() {
                    var a = this;
                    a.findTracks(), a.buildtracks(a, a.controls, a.layers, a.media)
                },
                resetSize: function() {
                    var a = this;
                    setTimeout(function() {
                        a.setPlayerSize(a.width, a.height), a.setControlsSize()
                    }, 50)
                }
            },
            function() {
                function b(b, d) {
                    var e = {
                        d: [],
                        w: []
                    };
                    return a.each((b || "").split(" "), function(a, b) {
                        var f = b + "." + d;
                        0 === f.indexOf(".") ? (e.d.push(f), e.w.push(f)) : e[c.test(b) ? "w" : "d"].push(f)
                    }), e.d = e.d.join(" "), e.w = e.w.join(" "), e
                }
                var c = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
                mejs.MediaElementPlayer.prototype.globalBind = function(c, d, e) {
                    var f = this,
                        g = f.node ? f.node.ownerDocument : document;
                    c = b(c, f.id), c.d && a(g).bind(c.d, d, e), c.w && a(window).bind(c.w, d, e)
                }, mejs.MediaElementPlayer.prototype.globalUnbind = function(c, d) {
                    var e = this,
                        f = e.node ? e.node.ownerDocument : document;
                    c = b(c, e.id), c.d && a(f).unbind(c.d, d), c.w && a(window).unbind(c.w, d)
                }
            }(), "undefined" != typeof a && (a.fn.mediaelementplayer = function(b) {
                return b === !1 ? this.each(function() {
                    var b = a(this).data("mediaelementplayer");
                    b && b.remove(), a(this).removeData("mediaelementplayer")
                }) : this.each(function() {
                    a(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, b))
                }), this
            }, a(document).ready(function() {
                a(".mejs-player").mediaelementplayer()
            })), window.MediaElementPlayer = mejs.MediaElementPlayer
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            playText: mejs.i18n.t("Play"),
            pauseText: mejs.i18n.t("Pause")
        }), a.extend(MediaElementPlayer.prototype, {
            buildplaypause: function(b, c, d, e) {
                function f(a) {
                    "play" === a ? (i.removeClass("mejs-play").addClass("mejs-pause"), j.attr({
                        title: h.pauseText,
                        "aria-label": h.pauseText
                    })) : (i.removeClass("mejs-pause").addClass("mejs-play"), j.attr({
                        title: h.playText,
                        "aria-label": h.playText
                    }))
                }
                var g = this,
                    h = g.options,
                    i = a('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="' + g.id + '" title="' + h.playText + '" aria-label="' + h.playText + '"></button></div>').appendTo(c).click(function(a) {
                        return a.preventDefault(), e.paused ? e.play() : e.pause(), !1
                    }),
                    j = i.find("button");
                f("pse"), e.addEventListener("play", function() {
                    f("play")
                }, !1), e.addEventListener("playing", function() {
                    f("play")
                }, !1), e.addEventListener("pause", function() {
                    f("pse")
                }, !1), e.addEventListener("paused", function() {
                    f("pse")
                }, !1)
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            stopText: "Stop"
        }), a.extend(MediaElementPlayer.prototype, {
            buildstop: function(b, c, d, e) {
                var f = this;
                a('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="' + f.id + '" title="' + f.options.stopText + '" aria-label="' + f.options.stopText + '"></button></div>').appendTo(c).click(function() {
                    e.paused || e.pause(), e.currentTime > 0 && (e.setCurrentTime(0), e.pause(), c.find(".mejs-time-current").width("0px"), c.find(".mejs-time-handle").css("left", "0px"), c.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0, b.options)), c.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0, b.options)), d.find(".mejs-poster").show())
                })
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            progessHelpText: mejs.i18n.t("Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.")
        }), a.extend(MediaElementPlayer.prototype, {
            buildprogress: function(b, c, d, e) {
                a('<div class="mejs-time-rail"><span  class="mejs-time-total mejs-time-slider"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(c), c.find(".mejs-time-buffering").hide();
                var f = this,
                    g = c.find(".mejs-time-total"),
                    h = c.find(".mejs-time-loaded"),
                    i = c.find(".mejs-time-current"),
                    j = c.find(".mejs-time-handle"),
                    k = c.find(".mejs-time-float"),
                    l = c.find(".mejs-time-float-current"),
                    m = c.find(".mejs-time-slider"),
                    n = function(a) {
                        var c, d = g.offset(),
                            f = g.width(),
                            h = 0,
                            i = 0,
                            j = 0;
                        c = a.originalEvent && a.originalEvent.changedTouches ? a.originalEvent.changedTouches[0].pageX : a.changedTouches ? a.changedTouches[0].pageX : a.pageX, e.duration && (c < d.left ? c = d.left : c > f + d.left && (c = f + d.left), j = c - d.left, h = j / f, i = .02 >= h ? 0 : h * e.duration, o && i !== e.currentTime && e.setCurrentTime(i), mejs.MediaFeatures.hasTouch || (k.css("left", j), l.html(mejs.Utility.secondsToTimeCode(i, b.options)), k.show()))
                    },
                    o = !1,
                    p = !1,
                    q = 0,
                    r = !1,
                    s = b.options.autoRewind,
                    t = function(a) {
                        var c = e.currentTime,
                            d = mejs.i18n.t("Time Slider"),
                            f = mejs.Utility.secondsToTimeCode(c, b.options),
                            g = e.duration;
                        m.attr({
                            "aria-label": d,
                            "aria-valuemin": 0,
                            "aria-valuemax": g,
                            "aria-valuenow": c,
                            "aria-valuetext": f,
                            role: "slider",
                            tabindex: 0
                        })
                    },
                    u = function() {
                        var a = new Date;
                        a - q >= 1e3 && e.play()
                    };
                m.bind("focus", function(a) {
                    b.options.autoRewind = !1
                }), m.bind("blur", function(a) {
                    b.options.autoRewind = s
                }), m.bind("keydown", function(a) {
                    new Date - q >= 1e3 && (r = e.paused);
                    var c = a.keyCode,
                        d = e.duration,
                        f = e.currentTime,
                        g = b.options.defaultSeekForwardInterval(d),
                        h = b.options.defaultSeekBackwardInterval(d);
                    switch (c) {
                        case 37:
                        case 40:
                            f -= h;
                            break;
                        case 39:
                        case 38:
                            f += g;
                            break;
                        case 36:
                            f = 0;
                            break;
                        case 35:
                            f = d;
                            break;
                        case 32:
                        case 13:
                            return void(e.paused ? e.play() : e.pause());
                        default:
                            return
                    }
                    return f = 0 > f ? 0 : f >= d ? d : Math.floor(f), q = new Date, r || e.pause(), f < e.duration && !r && setTimeout(u, 1100), e.setCurrentTime(f), a.preventDefault(), a.stopPropagation(), !1
                }), g.bind("mousedown touchstart", function(a) {
                    (1 === a.which || 0 === a.which) && (o = !0, n(a), f.globalBind("mousemove.dur touchmove.dur", function(a) {
                        n(a)
                    }), f.globalBind("mouseup.dur touchend.dur", function(a) {
                        o = !1, k.hide(), f.globalUnbind(".dur")
                    }))
                }).bind("mouseenter", function(a) {
                    p = !0, f.globalBind("mousemove.dur", function(a) {
                        n(a)
                    }), mejs.MediaFeatures.hasTouch || k.show()
                }).bind("mouseleave", function(a) {
                    p = !1, o || (f.globalUnbind(".dur"), k.hide())
                }), e.addEventListener("progress", function(a) {
                    b.setProgressRail(a), b.setCurrentRail(a)
                }, !1), e.addEventListener("timeupdate", function(a) {
                    b.setProgressRail(a), b.setCurrentRail(a), t(a)
                }, !1), f.container.on("controlsresize", function() {
                    b.setProgressRail(), b.setCurrentRail()
                }), f.loaded = h, f.total = g, f.current = i, f.handle = j
            },
            setProgressRail: function(a) {
                var b = this,
                    c = void 0 !== a ? a.target : b.media,
                    d = null;
                c && c.buffered && c.buffered.length > 0 && c.buffered.end && c.duration ? d = c.buffered.end(c.buffered.length - 1) / c.duration : c && void 0 !== c.bytesTotal && c.bytesTotal > 0 && void 0 !== c.bufferedBytes ? d = c.bufferedBytes / c.bytesTotal : a && a.lengthComputable && 0 !== a.total && (d = a.loaded / a.total), null !== d && (d = Math.min(1, Math.max(0, d)), b.loaded && b.total && b.loaded.width(b.total.width() * d))
            },
            setCurrentRail: function() {
                var a = this;
                if (void 0 !== a.media.currentTime && a.media.duration && a.total && a.handle) {
                    var b = Math.round(a.total.width() * a.media.currentTime / a.media.duration),
                        c = b - Math.round(a.handle.outerWidth(!0) / 2);
                    a.current.width(b), a.handle.css("left", c)
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            duration: -1,
            timeAndDurationSeparator: "<span> | </span>"
        }), a.extend(MediaElementPlayer.prototype, {
            buildcurrent: function(b, c, d, e) {
                var f = this;
                a('<div class="mejs-time" role="timer" aria-live="off"><span class="mejs-currenttime">' + mejs.Utility.secondsToTimeCode(0, b.options) + "</span></div>").appendTo(c), f.currenttime = f.controls.find(".mejs-currenttime"), e.addEventListener("timeupdate", function() {
                    b.updateCurrent()
                }, !1)
            },
            buildduration: function(b, c, d, e) {
                var f = this;
                c.children().last().find(".mejs-currenttime").length > 0 ? a(f.options.timeAndDurationSeparator + '<span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span>").appendTo(c.find(".mejs-time")) : (c.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"), a('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span></div>").appendTo(c)), f.durationD = f.controls.find(".mejs-duration"), e.addEventListener("timeupdate", function() {
                    b.updateDuration()
                }, !1)
            },
            updateCurrent: function() {
                var a = this,
                    b = a.media.currentTime;
                isNaN(b) && (b = 0), a.currenttime && a.currenttime.html(mejs.Utility.secondsToTimeCode(b, a.options))
            },
            updateDuration: function() {
                var a = this,
                    b = a.media.duration;
                a.options.duration > 0 && (b = a.options.duration), isNaN(b) && (b = 0), a.container.toggleClass("mejs-long-video", b > 3600), a.durationD && b > 0 && a.durationD.html(mejs.Utility.secondsToTimeCode(b, a.options))
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            muteText: mejs.i18n.t("Mute Toggle"),
            allyVolumeControlText: mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),
            hideVolumeOnTouchDevices: !0,
            audioVolume: "horizontal",
            videoVolume: "vertical"
        }), a.extend(MediaElementPlayer.prototype, {
            buildvolume: function(b, c, d, e) {
                if (!mejs.MediaFeatures.isAndroid && !mejs.MediaFeatures.isiOS || !this.options.hideVolumeOnTouchDevices) {
                    var f = this,
                        g = f.isVideo ? f.options.videoVolume : f.options.audioVolume,
                        h = "horizontal" == g ? a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button></div><a href="javascript:void(0);" class="mejs-horizontal-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></a>').appendTo(c) : a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button><a href="javascript:void(0);" class="mejs-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></a></div>').appendTo(c),
                        i = f.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),
                        j = f.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),
                        k = f.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),
                        l = f.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),
                        m = function(a, b) {
                            if (!i.is(":visible") && "undefined" == typeof b) return i.show(), m(a, !0), void i.hide();
                            a = Math.max(0, a), a = Math.min(a, 1), 0 === a ? (h.removeClass("mejs-mute").addClass("mejs-unmute"), h.children("button").attr("title", mejs.i18n.t("Unmute")).attr("aria-label", mejs.i18n.t("Unmute"))) : (h.removeClass("mejs-unmute").addClass("mejs-mute"), h.children("button").attr("title", mejs.i18n.t("Mute")).attr("aria-label", mejs.i18n.t("Mute")));
                            var c = j.position();
                            if ("vertical" == g) {
                                var d = j.height(),
                                    e = d - d * a;
                                l.css("top", Math.round(c.top + e - l.height() / 2)), k.height(d - e), k.css("top", c.top + e)
                            } else {
                                var f = j.width(),
                                    n = f * a;
                                l.css("left", Math.round(c.left + n - l.width() / 2)), k.width(Math.round(n))
                            }
                        },
                        n = function(a) {
                            var b = null,
                                c = j.offset();
                            if ("vertical" === g) {
                                var d = j.height(),
                                    f = a.pageY - c.top;
                                if (b = (d - f) / d, 0 === c.top || 0 === c.left) return
                            } else {
                                var h = j.width(),
                                    i = a.pageX - c.left;
                                b = i / h
                            }
                            b = Math.max(0, b), b = Math.min(b, 1), m(b), 0 === b ? e.setMuted(!0) : e.setMuted(!1), e.setVolume(b)
                        },
                        o = !1,
                        p = !1;
                    h.hover(function() {
                        i.show(), p = !0
                    }, function() {
                        p = !1, o || "vertical" != g || i.hide()
                    });
                    var q = function(a) {
                        var b = Math.floor(100 * e.volume);
                        i.attr({
                            "aria-label": mejs.i18n.t("Volume Slider"),
                            "aria-valuemin": 0,
                            "aria-valuemax": 100,
                            "aria-valuenow": b,
                            "aria-valuetext": b + "%",
                            role: "slider",
                            tabindex: 0
                        })
                    };
                    i.bind("mouseover", function() {
                        p = !0
                    }).bind("mousedown", function(a) {
                        return n(a), f.globalBind("mousemove.vol", function(a) {
                            n(a)
                        }), f.globalBind("mouseup.vol", function() {
                            o = !1, f.globalUnbind(".vol"), p || "vertical" != g || i.hide()
                        }), o = !0, !1
                    }).bind("keydown", function(a) {
                        var b = a.keyCode,
                            c = e.volume;
                        switch (b) {
                            case 38:
                                c = Math.min(c + .1, 1);
                                break;
                            case 40:
                                c = Math.max(0, c - .1);
                                break;
                            default:
                                return !0
                        }
                        return o = !1, m(c), e.setVolume(c), !1
                    }), h.find("button").click(function() {
                        e.setMuted(!e.muted)
                    }), h.find("button").bind("focus", function() {
                        i.show()
                    }), e.addEventListener("volumechange", function(a) {
                        o || (e.muted ? (m(0), h.removeClass("mejs-mute").addClass("mejs-unmute")) : (m(e.volume), h.removeClass("mejs-unmute").addClass("mejs-mute"))), q(a)
                    }, !1), 0 === b.options.startVolume && e.setMuted(!0), "native" === e.pluginType && e.setVolume(b.options.startVolume), f.container.on("controlsresize", function() {
                        m(e.volume)
                    })
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            usePluginFullScreen: !0,
            newWindowCallback: function() {
                return ""
            },
            fullscreenText: mejs.i18n.t("Fullscreen")
        }), a.extend(MediaElementPlayer.prototype, {
            isFullScreen: !1,
            isNativeFullScreen: !1,
            isInIframe: !1,
            fullscreenMode: "",
            buildfullscreen: function(b, c, d, e) {
                if (b.isVideo) {
                    b.isInIframe = window.location != window.parent.location, e.addEventListener("play", function() {
                        b.detectFullscreenMode()
                    });
                    var f = this,
                        g = null,
                        h = a('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="' + f.id + '" title="' + f.options.fullscreenText + '" aria-label="' + f.options.fullscreenText + '"></button></div>').appendTo(c).on("click", function() {
                            var a = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || b.isFullScreen;
                            a ? b.exitFullScreen() : b.enterFullScreen()
                        }).on("mouseover", function() {
                            if ("plugin-hover" == f.fullscreenMode) {
                                null !== g && (clearTimeout(g), delete g);
                                var a = h.offset(),
                                    c = b.container.offset();
                                e.positionFullscreenButton(a.left - c.left, a.top - c.top, !0);
                            }
                        }).on("mouseout", function() {
                            "plugin-hover" == f.fullscreenMode && (null !== g && (clearTimeout(g), delete g), g = setTimeout(function() {
                                e.hideFullscreenButton()
                            }, 1500))
                        });
                    if (b.fullscreenBtn = h, f.globalBind("keydown", function(a) {
                            27 == a.keyCode && (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || f.isFullScreen) && b.exitFullScreen()
                        }), f.normalHeight = 0, f.normalWidth = 0, mejs.MediaFeatures.hasTrueNativeFullScreen) {
                        var i = function(a) {
                            b.isFullScreen && (mejs.MediaFeatures.isFullScreen() ? (b.isNativeFullScreen = !0, b.setControlsSize()) : (b.isNativeFullScreen = !1, b.exitFullScreen()))
                        };
                        b.globalBind(mejs.MediaFeatures.fullScreenEventName, i)
                    }
                }
            },
            detectFullscreenMode: function() {
                var a = this,
                    b = "",
                    c = mejs.MediaFeatures;
                return c.hasTrueNativeFullScreen && "native" === a.media.pluginType ? b = "native-native" : c.hasTrueNativeFullScreen && "native" !== a.media.pluginType && !c.hasFirefoxPluginMovingProblem ? b = "plugin-native" : a.usePluginFullScreen ? mejs.MediaFeatures.supportsPointerEvents ? (b = "plugin-click", a.createPluginClickThrough()) : b = "plugin-hover" : b = "fullwindow", a.fullscreenMode = b, b
            },
            isPluginClickThroughCreated: !1,
            createPluginClickThrough: function() {
                var b = this;
                if (!b.isPluginClickThroughCreated) {
                    var c, d, e = !1,
                        f = function() {
                            if (e) {
                                for (var a in g) g[a].hide();
                                b.fullscreenBtn.css("pointer-events", ""), b.controls.css("pointer-events", ""), b.media.removeEventListener("click", b.clickToPlayPauseCallback), e = !1
                            }
                        },
                        g = {},
                        h = ["top", "left", "right", "bottom"],
                        i = function() {
                            var a = fullscreenBtn.offset().left - b.container.offset().left,
                                d = fullscreenBtn.offset().top - b.container.offset().top,
                                e = fullscreenBtn.outerWidth(!0),
                                f = fullscreenBtn.outerHeight(!0),
                                h = b.container.width(),
                                i = b.container.height();
                            for (c in g) g[c].css({
                                position: "absolute",
                                top: 0,
                                left: 0
                            });
                            g.top.width(h).height(d), g.left.width(a).height(f).css({
                                top: d
                            }), g.right.width(h - a - e).height(f).css({
                                top: d,
                                left: a + e
                            }), g.bottom.width(h).height(i - f - d).css({
                                top: d + f
                            })
                        };
                    for (b.globalBind("resize", function() {
                            i()
                        }), c = 0, d = h.length; d > c; c++) g[h[c]] = a('<div class="mejs-fullscreen-hover" />').appendTo(b.container).mouseover(f).hide();
                    fullscreenBtn.on("mouseover", function() {
                        if (!b.isFullScreen) {
                            var a = fullscreenBtn.offset(),
                                d = player.container.offset();
                            media.positionFullscreenButton(a.left - d.left, a.top - d.top, !1), b.fullscreenBtn.css("pointer-events", "none"), b.controls.css("pointer-events", "none"), b.media.addEventListener("click", b.clickToPlayPauseCallback);
                            for (c in g) g[c].show();
                            i(), e = !0
                        }
                    }), media.addEventListener("fullscreenchange", function(a) {
                        b.isFullScreen = !b.isFullScreen, b.isFullScreen ? b.media.removeEventListener("click", b.clickToPlayPauseCallback) : b.media.addEventListener("click", b.clickToPlayPauseCallback), f()
                    }), b.globalBind("mousemove", function(a) {
                        if (e) {
                            var c = fullscreenBtn.offset();
                            (a.pageY < c.top || a.pageY > c.top + fullscreenBtn.outerHeight(!0) || a.pageX < c.left || a.pageX > c.left + fullscreenBtn.outerWidth(!0)) && (fullscreenBtn.css("pointer-events", ""), b.controls.css("pointer-events", ""), e = !1)
                        }
                    }), b.isPluginClickThroughCreated = !0
                }
            },
            cleanfullscreen: function(a) {
                a.exitFullScreen()
            },
            containerSizeTimeout: null,
            enterFullScreen: function() {
                var b = this;
                return mejs.MediaFeatures.hasiOSFullScreen ? void b.media.webkitEnterFullscreen() : (a(document.documentElement).addClass("mejs-fullscreen"), b.normalHeight = b.container.height(), b.normalWidth = b.container.width(), "native-native" === b.fullscreenMode || "plugin-native" === b.fullscreenMode ? (mejs.MediaFeatures.requestFullScreen(b.container[0]), b.isInIframe && setTimeout(function c() {
                    if (b.isNativeFullScreen) {
                        var d = .002,
                            e = a(window).width(),
                            f = screen.width,
                            g = Math.abs(f - e),
                            h = f * d;
                        g > h ? b.exitFullScreen() : setTimeout(c, 500)
                    }
                }, 1e3)) : "fullwindow" == b.fullscreeMode, b.container.addClass("mejs-container-fullscreen").width("100%").height("100%"), b.containerSizeTimeout = setTimeout(function() {
                    b.container.css({
                        width: "100%",
                        height: "100%"
                    }), b.setControlsSize()
                }, 500), "native" === b.media.pluginType ? b.$media.width("100%").height("100%") : (b.container.find(".mejs-shim").width("100%").height("100%"), setTimeout(function() {
                    var c = a(window),
                        d = c.width(),
                        e = c.height();
                    b.media.setVideoSize(d, e)
                }, 500)), b.layers.children("div").width("100%").height("100%"), b.fullscreenBtn && b.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"), b.setControlsSize(), b.isFullScreen = !0, b.container.find(".mejs-captions-text").css("font-size", screen.width / b.width * 1 * 100 + "%"), b.container.find(".mejs-captions-position").css("bottom", "45px"), void b.container.trigger("enteredfullscreen"))
            },
            exitFullScreen: function() {
                var b = this;
                clearTimeout(b.containerSizeTimeout), mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || b.isFullScreen) && mejs.MediaFeatures.cancelFullScreen(), a(document.documentElement).removeClass("mejs-fullscreen"), b.container.removeClass("mejs-container-fullscreen").width(b.normalWidth).height(b.normalHeight), "native" === b.media.pluginType ? b.$media.width(b.normalWidth).height(b.normalHeight) : (b.container.find(".mejs-shim").width(b.normalWidth).height(b.normalHeight), b.media.setVideoSize(b.normalWidth, b.normalHeight)), b.layers.children("div").width(b.normalWidth).height(b.normalHeight), b.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"), b.setControlsSize(), b.isFullScreen = !1, b.container.find(".mejs-captions-text").css("font-size", ""), b.container.find(".mejs-captions-position").css("bottom", ""), b.container.trigger("exitedfullscreen")
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
            defaultSpeed: "1.00",
            speedChar: "x"
        }), a.extend(MediaElementPlayer.prototype, {
            buildspeed: function(b, c, d, e) {
                var f = this;
                if ("native" == f.media.pluginType) {
                    for (var g = null, h = null, i = null, j = null, k = [], l = !1, m = 0, n = f.options.speeds.length; n > m; m++) {
                        var o = f.options.speeds[m];
                        "string" == typeof o ? (k.push({
                            name: o + f.options.speedChar,
                            value: o
                        }), o === f.options.defaultSpeed && (l = !0)) : (k.push(o), o.value === f.options.defaultSpeed && (l = !0))
                    }
                    l || k.push({
                        name: f.options.defaultSpeed + f.options.speedChar,
                        value: f.options.defaultSpeed
                    }), k.sort(function(a, b) {
                        return parseFloat(b.value) - parseFloat(a.value)
                    });
                    var p = function(a) {
                            for (m = 0, n = k.length; n > m; m++)
                                if (k[m].value === a) return k[m].name
                        },
                        q = '<div class="mejs-button mejs-speed-button"><button type="button">' + p(f.options.defaultSpeed) + '</button><div class="mejs-speed-selector"><ul>';
                    for (m = 0, il = k.length; m < il; m++) j = f.id + "-speed-" + k[m].value, q += '<li><input type="radio" name="speed" value="' + k[m].value + '" id="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? " checked" : "") + ' /><label for="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? ' class="mejs-speed-selected"' : "") + ">" + k[m].name + "</label></li>";
                    q += "</ul></div></div>", g = a(q).appendTo(c), h = g.find(".mejs-speed-selector"), i = f.options.defaultSpeed, e.addEventListener("loadedmetadata", function(a) {
                        i && (e.playbackRate = parseFloat(i))
                    }, !0), h.on("click", 'input[type="radio"]', function() {
                        var b = a(this).attr("value");
                        i = b, e.playbackRate = parseFloat(b), g.find("button").html(p(b)), g.find(".mejs-speed-selected").removeClass("mejs-speed-selected"), g.find('input[type="radio"]:checked').next().addClass("mejs-speed-selected")
                    }), g.one("mouseenter focusin", function() {
                        h.height(g.find(".mejs-speed-selector ul").outerHeight(!0) + g.find(".mejs-speed-translations").outerHeight(!0)).css("top", -1 * h.height() + "px")
                    })
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            startLanguage: "",
            tracksText: mejs.i18n.t("Captions/Subtitles"),
            tracksAriaLive: !1,
            hideCaptionsButtonWhenEmpty: !0,
            toggleCaptionsButtonWhenOnlyOne: !1,
            slidesSelector: ""
        }), a.extend(MediaElementPlayer.prototype, {
            hasChapters: !1,
            cleartracks: function(a, b, c, d) {
                a && (a.captions && a.captions.remove(), a.chapters && a.chapters.remove(), a.captionsText && a.captionsText.remove(), a.captionsButton && a.captionsButton.remove())
            },
            buildtracks: function(b, c, d, e) {
                if (0 !== b.tracks.length) {
                    var f, g = this,
                        h = g.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : "";
                    if (g.domNode.textTracks)
                        for (f = g.domNode.textTracks.length - 1; f >= 0; f--) g.domNode.textTracks[f].mode = "hidden";
                    g.cleartracks(b, c, d, e), b.chapters = a('<div class="mejs-chapters mejs-layer"></div>').prependTo(d).hide(), b.captions = a('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" ' + h + '><span class="mejs-captions-text"></span></div></div>').prependTo(d).hide(), b.captionsText = b.captions.find(".mejs-captions-text"), b.captionsButton = a('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="' + g.id + '" title="' + g.options.tracksText + '" aria-label="' + g.options.tracksText + '"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="' + b.id + '_captions" id="' + b.id + '_captions_none" value="none" checked="checked" /><label for="' + b.id + '_captions_none">' + mejs.i18n.t("None") + "</label></li></ul></div></div>").appendTo(c);
                    var i = 0;
                    for (f = 0; f < b.tracks.length; f++) "subtitles" == b.tracks[f].kind && i++;
                    for (g.options.toggleCaptionsButtonWhenOnlyOne && 1 == i ? b.captionsButton.on("click", function() {
                            null === b.selectedTrack ? lang = b.tracks[0].srclang : lang = "none", b.setTrack(lang)
                        }) : (b.captionsButton.on("mouseenter focusin", function() {
                            a(this).find(".mejs-captions-selector").removeClass("mejs-offscreen")
                        }).on("click", "input[type=radio]", function() {
                            lang = this.value, b.setTrack(lang)
                        }), b.captionsButton.on("mouseleave focusout", function() {
                            a(this).find(".mejs-captions-selector").addClass("mejs-offscreen")
                        })), b.options.alwaysShowControls ? b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover") : b.container.bind("controlsshown", function() {
                            b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")
                        }).bind("controlshidden", function() {
                            e.paused || b.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")
                        }), b.trackToLoad = -1, b.selectedTrack = null, b.isLoadingTrack = !1, f = 0; f < b.tracks.length; f++) "subtitles" == b.tracks[f].kind && b.addTrackButton(b.tracks[f].srclang, b.tracks[f].label);
                    b.loadNextTrack(), e.addEventListener("timeupdate", function(a) {
                        b.displayCaptions()
                    }, !1), "" !== b.options.slidesSelector && (b.slidesContainer = a(b.options.slidesSelector), e.addEventListener("timeupdate", function(a) {
                        b.displaySlides()
                    }, !1)), e.addEventListener("loadedmetadata", function(a) {
                        b.displayChapters()
                    }, !1), b.container.hover(function() {
                        b.hasChapters && (b.chapters.removeClass("mejs-offscreen"), b.chapters.fadeIn(200).height(b.chapters.find(".mejs-chapter").outerHeight()))
                    }, function() {
                        b.hasChapters && !e.paused && b.chapters.fadeOut(200, function() {
                            a(this).addClass("mejs-offscreen"), a(this).css("display", "block")
                        })
                    }), g.container.on("controlsresize", function() {
                        g.adjustLanguageBox()
                    }), null !== b.node.getAttribute("autoplay") && b.chapters.addClass("mejs-offscreen")
                }
            },
            setTrack: function(a) {
                var b, c = this;
                if ("none" == a) c.selectedTrack = null, c.captionsButton.removeClass("mejs-captions-enabled");
                else
                    for (b = 0; b < c.tracks.length; b++)
                        if (c.tracks[b].srclang == a) {
                            null === c.selectedTrack && c.captionsButton.addClass("mejs-captions-enabled"), c.selectedTrack = c.tracks[b], c.captions.attr("lang", c.selectedTrack.srclang), c.displayCaptions();
                            break
                        }
            },
            loadNextTrack: function() {
                var a = this;
                a.trackToLoad++, a.trackToLoad < a.tracks.length ? (a.isLoadingTrack = !0, a.loadTrack(a.trackToLoad)) : (a.isLoadingTrack = !1, a.checkForTracks())
            },
            loadTrack: function(b) {
                var c = this,
                    d = c.tracks[b],
                    e = function() {
                        d.isLoaded = !0, c.enableTrackButton(d.srclang, d.label), c.loadNextTrack()
                    };
                a.ajax({
                    url: d.src,
                    dataType: "text",
                    success: function(a) {
                        "string" == typeof a && /<tt\s+xml/gi.exec(a) ? d.entries = mejs.TrackFormatParser.dfxp.parse(a) : d.entries = mejs.TrackFormatParser.webvtt.parse(a), e(), "chapters" == d.kind && c.media.addEventListener("play", function(a) {
                            c.media.duration > 0 && c.displayChapters(d)
                        }, !1), "slides" == d.kind && c.setupSlides(d)
                    },
                    error: function() {
                        c.removeTrackButton(d.srclang), c.loadNextTrack()
                    }
                })
            },
            enableTrackButton: function(b, c) {
                var d = this;
                "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("input[value=" + b + "]").prop("disabled", !1).siblings("label").html(c), d.options.startLanguage == b && a("#" + d.id + "_captions_" + b).prop("checked", !0).trigger("click"), d.adjustLanguageBox()
            },
            removeTrackButton: function(a) {
                var b = this;
                b.captionsButton.find("input[value=" + a + "]").closest("li").remove(), b.adjustLanguageBox()
            },
            addTrackButton: function(b, c) {
                var d = this;
                "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("ul").append(a('<li><input type="radio" name="' + d.id + '_captions" id="' + d.id + "_captions_" + b + '" value="' + b + '" disabled="disabled" /><label for="' + d.id + "_captions_" + b + '">' + c + " (loading)</label></li>")), d.adjustLanguageBox(), d.container.find(".mejs-captions-translations option[value=" + b + "]").remove()
            },
            adjustLanguageBox: function() {
                var a = this;
                a.captionsButton.find(".mejs-captions-selector").height(a.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0) + a.captionsButton.find(".mejs-captions-translations").outerHeight(!0))
            },
            checkForTracks: function() {
                var a = this,
                    b = !1;
                if (a.options.hideCaptionsButtonWhenEmpty) {
                    for (i = 0; i < a.tracks.length; i++)
                        if ("subtitles" == a.tracks[i].kind && a.tracks[i].isLoaded) {
                            b = !0;
                            break
                        }
                    b || (a.captionsButton.hide(), a.setControlsSize())
                }
            },
            displayCaptions: function() {
                if ("undefined" != typeof this.tracks) {
                    var a, b = this,
                        c = b.selectedTrack;
                    if (null !== c && c.isLoaded) {
                        for (a = 0; a < c.entries.times.length; a++)
                            if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop) return b.captionsText.html(c.entries.text[a]).attr("class", "mejs-captions-text " + (c.entries.times[a].identifier || "")), void b.captions.show().height(0);
                        b.captions.hide()
                    } else b.captions.hide()
                }
            },
            setupSlides: function(a) {
                var b = this;
                b.slides = a, b.slides.entries.imgs = [b.slides.entries.text.length], b.showSlide(0)
            },
            showSlide: function(b) {
                if ("undefined" != typeof this.tracks && "undefined" != typeof this.slidesContainer) {
                    var c = this,
                        d = c.slides.entries.text[b],
                        e = c.slides.entries.imgs[b];
                    "undefined" == typeof e || "undefined" == typeof e.fadeIn ? c.slides.entries.imgs[b] = e = a('<img src="' + d + '">').on("load", function() {
                        e.appendTo(c.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
                    }) : e.is(":visible") || e.is(":animated") || e.fadeIn().siblings(":visible").fadeOut()
                }
            },
            displaySlides: function() {
                if ("undefined" != typeof this.slides) {
                    var a, b = this,
                        c = b.slides;
                    for (a = 0; a < c.entries.times.length; a++)
                        if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop) return void b.showSlide(a)
                }
            },
            displayChapters: function() {
                var a, b = this;
                for (a = 0; a < b.tracks.length; a++)
                    if ("chapters" == b.tracks[a].kind && b.tracks[a].isLoaded) {
                        b.drawChapters(b.tracks[a]), b.hasChapters = !0;
                        break
                    }
            },
            drawChapters: function(b) {
                var c, d, e = this,
                    f = 0,
                    g = 0;
                for (e.chapters.empty(), c = 0; c < b.entries.times.length; c++) d = b.entries.times[c].stop - b.entries.times[c].start, f = Math.floor(d / e.media.duration * 100), (f + g > 100 || c == b.entries.times.length - 1 && 100 > f + g) && (f = 100 - g), e.chapters.append(a('<div class="mejs-chapter" rel="' + b.entries.times[c].start + '" style="left: ' + g.toString() + "%;width: " + f.toString() + '%;"><div class="mejs-chapter-block' + (c == b.entries.times.length - 1 ? " mejs-chapter-block-last" : "") + '"><span class="ch-title">' + b.entries.text[c] + '</span><span class="ch-time">' + mejs.Utility.secondsToTimeCode(b.entries.times[c].start, e.options) + "&ndash;" + mejs.Utility.secondsToTimeCode(b.entries.times[c].stop, e.options) + "</span></div></div>")), g += f;
                e.chapters.find("div.mejs-chapter").click(function() {
                    e.media.setCurrentTime(parseFloat(a(this).attr("rel"))), e.media.paused && e.media.play()
                }), e.chapters.show()
            }
        }), mejs.language = {
            codes: {
                af: "Afrikaans",
                sq: "Albanian",
                ar: "Arabic",
                be: "Belarusian",
                bg: "Bulgarian",
                ca: "Catalan",
                zh: "Chinese",
                "zh-cn": "Chinese Simplified",
                "zh-tw": "Chinese Traditional",
                hr: "Croatian",
                cs: "Czech",
                da: "Danish",
                nl: "Dutch",
                en: "English",
                et: "Estonian",
                fl: "Filipino",
                fi: "Finnish",
                fr: "French",
                gl: "Galician",
                de: "German",
                el: "Greek",
                ht: "Haitian Creole",
                iw: "Hebrew",
                hi: "Hindi",
                hu: "Hungarian",
                is: "Icelandic",
                id: "Indonesian",
                ga: "Irish",
                it: "Italian",
                ja: "Japanese",
                ko: "Korean",
                lv: "Latvian",
                lt: "Lithuanian",
                mk: "Macedonian",
                ms: "Malay",
                mt: "Maltese",
                no: "Norwegian",
                fa: "Persian",
                pl: "Polish",
                pt: "Portuguese",
                ro: "Romanian",
                ru: "Russian",
                sr: "Serbian",
                sk: "Slovak",
                sl: "Slovenian",
                es: "Spanish",
                sw: "Swahili",
                sv: "Swedish",
                tl: "Tagalog",
                th: "Thai",
                tr: "Turkish",
                uk: "Ukrainian",
                vi: "Vietnamese",
                cy: "Welsh",
                yi: "Yiddish"
            }
        }, mejs.TrackFormatParser = {
            webvtt: {
                pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
                parse: function(b) {
                    for (var c, d, e, f = 0, g = mejs.TrackFormatParser.split2(b, /\r?\n/), h = {
                            text: [],
                            times: []
                        }; f < g.length; f++) {
                        if (c = this.pattern_timecode.exec(g[f]), c && f < g.length) {
                            for (f - 1 >= 0 && "" !== g[f - 1] && (e = g[f - 1]), f++, d = g[f], f++;
                                "" !== g[f] && f < g.length;) d = d + "\n" + g[f], f++;
                            d = a.trim(d).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), h.text.push(d), h.times.push({
                                identifier: e,
                                start: 0 === mejs.Utility.convertSMPTEtoSeconds(c[1]) ? .2 : mejs.Utility.convertSMPTEtoSeconds(c[1]),
                                stop: mejs.Utility.convertSMPTEtoSeconds(c[3]),
                                settings: c[5]
                            })
                        }
                        e = ""
                    }
                    return h
                }
            },
            dfxp: {
                parse: function(b) {
                    b = a(b).filter("tt");
                    var c, d, e = 0,
                        f = b.children("div").eq(0),
                        g = f.find("p"),
                        h = b.find("#" + f.attr("style")),
                        i = {
                            text: [],
                            times: []
                        };
                    if (h.length) {
                        var j = h.removeAttr("id").get(0).attributes;
                        if (j.length)
                            for (c = {}, e = 0; e < j.length; e++) c[j[e].name.split(":")[1]] = j[e].value
                    }
                    for (e = 0; e < g.length; e++) {
                        var k, l = {
                            start: null,
                            stop: null,
                            style: null
                        };
                        if (g.eq(e).attr("begin") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("begin"))), !l.start && g.eq(e - 1).attr("end") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e - 1).attr("end"))), g.eq(e).attr("end") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("end"))), !l.stop && g.eq(e + 1).attr("begin") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e + 1).attr("begin"))), c) {
                            k = "";
                            for (var m in c) k += m + ":" + c[m] + ";"
                        }
                        k && (l.style = k), 0 === l.start && (l.start = .2), i.times.push(l), d = a.trim(g.eq(e).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), i.text.push(d), 0 === i.times.start && (i.times.start = 2)
                    }
                    return i
                }
            },
            split2: function(a, b) {
                return a.split(b)
            }
        }, 3 != "x\n\ny".split(/\n/gi).length && (mejs.TrackFormatParser.split2 = function(a, b) {
            var c, d = [],
                e = "";
            for (c = 0; c < a.length; c++) e += a.substring(c, c + 1), b.test(e) && (d.push(e.replace(b, "")), e = "");
            return d.push(e), d
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            contextMenuItems: [{
                render: function(a) {
                    return "undefined" == typeof a.enterFullScreen ? null : a.isFullScreen ? mejs.i18n.t("Turn off Fullscreen") : mejs.i18n.t("Go Fullscreen")
                },
                click: function(a) {
                    a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen()
                }
            }, {
                render: function(a) {
                    return a.media.muted ? mejs.i18n.t("Unmute") : mejs.i18n.t("Mute")
                },
                click: function(a) {
                    a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                }
            }, {
                isSeparator: !0
            }, {
                render: function(a) {
                    return mejs.i18n.t("Download Video")
                },
                click: function(a) {
                    window.location.href = a.media.currentSrc
                }
            }]
        }), a.extend(MediaElementPlayer.prototype, {
            buildcontextmenu: function(b, c, d, e) {
                b.contextMenu = a('<div class="mejs-contextmenu"></div>').appendTo(a("body")).hide(), b.container.bind("contextmenu", function(a) {
                    return b.isContextMenuEnabled ? (a.preventDefault(), b.renderContextMenu(a.clientX - 1, a.clientY - 1), !1) : void 0
                }), b.container.bind("click", function() {
                    b.contextMenu.hide()
                }), b.contextMenu.bind("mouseleave", function() {
                    b.startContextMenuTimer()
                })
            },
            cleancontextmenu: function(a) {
                a.contextMenu.remove()
            },
            isContextMenuEnabled: !0,
            enableContextMenu: function() {
                this.isContextMenuEnabled = !0
            },
            disableContextMenu: function() {
                this.isContextMenuEnabled = !1
            },
            contextMenuTimeout: null,
            startContextMenuTimer: function() {
                var a = this;
                a.killContextMenuTimer(), a.contextMenuTimer = setTimeout(function() {
                    a.hideContextMenu(), a.killContextMenuTimer()
                }, 750)
            },
            killContextMenuTimer: function() {
                var a = this.contextMenuTimer;
                null != a && (clearTimeout(a), delete a, a = null)
            },
            hideContextMenu: function() {
                this.contextMenu.hide()
            },
            renderContextMenu: function(b, c) {
                for (var d = this, e = "", f = d.options.contextMenuItems, g = 0, h = f.length; h > g; g++)
                    if (f[g].isSeparator) e += '<div class="mejs-contextmenu-separator"></div>';
                    else {
                        var i = f[g].render(d);
                        null != i && (e += '<div class="mejs-contextmenu-item" data-itemindex="' + g + '" id="element-' + 1e6 * Math.random() + '">' + i + "</div>")
                    }
                d.contextMenu.empty().append(a(e)).css({
                    top: c,
                    left: b
                }).show(), d.contextMenu.find(".mejs-contextmenu-item").each(function() {
                    var b = a(this),
                        c = parseInt(b.data("itemindex"), 10),
                        e = d.options.contextMenuItems[c];
                    "undefined" != typeof e.show && e.show(b, d), b.click(function() {
                        "undefined" != typeof e.click && e.click(d), d.contextMenu.hide()
                    })
                }), setTimeout(function() {
                    d.killControlsTimer("rev3")
                }, 100)
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            skipBackInterval: 30,
            skipBackText: mejs.i18n.t("Skip back %1 seconds")
        }), a.extend(MediaElementPlayer.prototype, {
            buildskipback: function(b, c, d, e) {
                var f = this,
                    g = f.options.skipBackText.replace("%1", f.options.skipBackInterval);
                a('<div class="mejs-button mejs-skip-back-button"><button type="button" aria-controls="' + f.id + '" title="' + g + '" aria-label="' + g + '">' + f.options.skipBackInterval + "</button></div>").appendTo(c).click(function() {
                    e.setCurrentTime(Math.max(e.currentTime - f.options.skipBackInterval, 0)), a(this).find("button").blur()
                })
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            postrollCloseText: mejs.i18n.t("Close")
        }), a.extend(MediaElementPlayer.prototype, {
            buildpostroll: function(b, c, d, e) {
                var f = this,
                    g = f.container.find('link[rel="postroll"]').attr("href");
                "undefined" != typeof g && (b.postroll = a('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + f.options.postrollCloseText + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(d).hide(), f.media.addEventListener("ended", function(c) {
                    a.ajax({
                        dataType: "html",
                        url: g,
                        success: function(a, b) {
                            d.find(".mejs-postroll-layer-content").html(a)
                        }
                    }), b.postroll.show()
                }, !1))
            }
        })
    }(mejs.$);;
(function(window, $) {
    window.wp = window.wp || {};
    mejs.plugins.silverlight[0].types.push('video/x-ms-wmv');
    mejs.plugins.silverlight[0].types.push('audio/x-ms-wma');

    function wpMediaElement() {
        var settings = {};

        function initialize() {
            if (typeof _wpmejsSettings !== 'undefined') {
                settings = $.extend(true, {}, _wpmejsSettings);
            }
            settings.success = settings.success || function(mejs) {
                var autoplay, loop;
                if ('flash' === mejs.pluginType) {
                    autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
                    loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
                    autoplay && mejs.addEventListener('canplay', function() {
                        mejs.play();
                    }, false);
                    loop && mejs.addEventListener('ended', function() {
                        mejs.play();
                    }, false);
                }
            };
            $('.wp-audio-shortcode, .wp-video-shortcode, .video-block video, .audio-block audio').not('.mejs-container').filter(function() {
                return !$(this).parent().hasClass('.mejs-mediaelement');
            }).mediaelementplayer(settings);
        }
        return {
            initialize: initialize
        };
    }
    window.wp.mediaelement = new wpMediaElement();
    $(window.wp.mediaelement.initialize);
})(window, jQuery);;
(function($) {
    $(function() {
        $('.gem-counter').each(function() {
            var $item = $(this);
            var initHover = {
                icon_color1: $('.gem-icon-half-1', $item).css('color'),
                icon_color2: $('.gem-icon-half-2', $item).css('color'),
                icon_background: $('.gem-icon-inner', $item).css('background-color'),
                icon_border: $('.gem-icon', $item).css('border-left-color'),
                icon_box_border: $('.gem-counter-icon-circle-1', $item).css('border-left-color'),
                icon_box_shadow: $('.gem-icon', $item).css('box-shadow'),
                box_color: $('.gem-counter-inner', $item).css('background-color'),
                number_color: $('.gem-counter-number', $item).css('color'),
                text_color: $('.gem-counter-text', $item).css('color'),
            };
            $item.data('initHover', initHover);
            if ($item.hasClass('gem-counter-effect-background-reverse') || $item.hasClass('gem-counter-effect-border-reverse')) {
                $('.gem-icon-inner', $item).prepend('<div class="gem-counter-animation"/>');
                if ($item.hasClass('gem-counter-effect-border-reverse')) {
                    $('.gem-counter-animation', $item).css('background-color', initHover.box_color);
                } else if ($item.data('hover-background-color')) {
                    $('.gem-counter-animation', $item).css('background-color', $item.data('hover-background-color'));
                }
            }
        });
        $('body').on('mouseenter', '.gem-counter a', function() {
            var $item = $(this).closest('.gem-counter');
            var initHover = $item.data('initHover');
            var $box = $item.closest('.gem-counter-box');
            $item.addClass('hover');
            if ($item.data('hover-icon-color')) {
                if ($box.hasClass('gem-counter-style-2')) {
                    $('.gem-icon-half-1', $item).css('color', initHover.icon_box_border);
                    $('.gem-icon-half-2', $item).css('color', initHover.icon_box_border);
                    $('.gem-counter-icon-circle-1', $item).css('border-color', $item.data('hover-icon-color'));
                    $('.gem-counter-icon-circle-1', $item).css('background-color', $item.data('hover-icon-color'));
                    $('.gem-counter-icon-circle-2', $item).css('border-color', 'transparent');
                } else {
                    if ($item.hasClass('gem-counter-effect-background-reverse')) {
                        $('.gem-icon', $item).css('border-color', $item.data('hover-icon-color'));
                        $('.gem-icon-half-1', $item).css('color', $item.data('hover-icon-color'));
                        $('.gem-icon-half-2', $item).css('color', $item.data('hover-icon-color'));
                    }
                    if ($item.hasClass('gem-counter-effect-border-reverse')) {
                        $('.gem-icon', $item).css('border-color', $item.data('hover-icon-color'));
                        $('.gem-icon-inner', $item).css('background-color', $item.data('hover-icon-color'));
                        $('.gem-icon-half-1', $item).css('color', '#ffffff');
                        $('.gem-icon-half-2', $item).css('color', '#ffffff');
                    }
                    if ($item.hasClass('gem-counter-effect-simple')) {
                        $('.gem-icon-half-1', $item).css('color', $item.data('hover-icon-color'));
                        $('.gem-icon-half-2', $item).css('color', $item.data('hover-icon-color'));
                    }
                }
            }
            if ($item.data('hover-numbers-color')) {
                $('.gem-counter-number', $item).css('color', $item.data('hover-numbers-color'));
            }
            if ($item.data('hover-text-color')) {
                $('.gem-counter-text', $item).css('color', $item.data('hover-text-color'));
            }
            if ($item.data('hover-background-color')) {
                $('.gem-counter-inner', $item).css('background-color', $item.data('hover-background-color'));
                $('.gem-counter-bottom-left, .gem-counter-bottom-right', $item).css('background-color', $item.data('hover-background-color'));
                $('.gem-counter-bottom svg', $item).css('fill', $item.data('hover-background-color'));
                if (!$box.hasClass('gem-counter-style-vertical')) {
                    $('.gem-icon', $item).css('box-shadow', '0 0 0 5px ' + $item.data('hover-background-color') + ', 0 0 0 6px ' + ($item.data('hover-icon-color') ? $item.data('hover-icon-color') : '#ffffff'));
                }
            }
        });
        $('body').on('mouseleave', '.gem-counter a', function() {
            var $item = $(this).closest('.gem-counter');
            var initHover = $item.data('initHover');
            $item.removeClass('hover');
            $('.gem-icon', $item).css('border-color', initHover.icon_border);
            $('.gem-icon-inner', $item).css('background-color', initHover.icon_background);
            $('.gem-icon-half-1', $item).css('color', initHover.icon_color1);
            $('.gem-icon-half-2', $item).css('color', initHover.icon_color2);
            $('.gem-icon', $item).css('box-shadow', initHover.icon_box_shadow), $('.gem-counter-icon-circle-1, .gem-counter-icon-circle-2', $item).css('border-color', initHover.icon_box_border);
            $('.gem-counter-icon-circle-1').css('background-color', 'transparent');
            $('.gem-counter-inner', $item).css('background-color', initHover.box_color);
            $('.gem-counter-bottom-left, .gem-counter-bottom-right', $item).css('background-color', initHover.box_color);
            $('.gem-counter-bottom svg', $item).css('fill', initHover.box_color);
            $('.gem-counter-number', $item).css('color', initHover.number_color);
            $('.gem-counter-text', $item).css('color', initHover.text_color);
        });
    });
})(jQuery);;
(function($) {
    var $window = $(window),
        $page = $('#page');
    $.fn.parallaxVertical = function(xpos) {
        var windowHeight = $window.height(),
            perspectiveOpened = false;
        this.each(function() {
            var $this = $(this),
                speedFactor, offsetFactor = 0,
                getHeight, topOffset = 0,
                containerHeight = 0,
                containerWidth = 0,
                disableParallax = false,
                parallaxIsDisabled = false,
                baseImgHeight = 0,
                baseImgWidth = 0,
                isBgCover = ($this.css('background-size') == 'cover'),
                curImgHeight = 0,
                reversed = $this.hasClass('parallax-reversed'),
                baseSpeedFactor = reversed ? -0.1 : 0.61,
                outerHeight = true;
            if (xpos === undefined) xpos = "50%";
            if (outerHeight) {
                getHeight = function(jqo) {
                    return jqo.outerHeight(true);
                };
            } else {
                getHeight = function(jqo) {
                    return jqo.height();
                };
            }

            function getBackgroundSize(callback) {
                var img = new Image(),
                    width, height, backgroundSize = ($this.css('background-size') || ' ').split(' ');
                if (/px/.test(backgroundSize[0])) width = parseInt(backgroundSize[0]);
                if (/%/.test(backgroundSize[0])) width = $this.parent().width() * (parseInt(backgroundSize[0]) / 100);
                if (/px/.test(backgroundSize[1])) height = parseInt(backgroundSize[1]);
                if (/%/.test(backgroundSize[1])) height = $this.parent().height() * (parseInt(backgroundSize[0]) / 100);
                if (width !== undefined && height !== undefined) {
                    return callback({
                        width: width,
                        height: height
                    });
                }
                img.onload = function() {
                    if (typeof width == 'undefined') width = this.width;
                    if (typeof height == 'undefined') height = this.height;
                    callback({
                        width: width,
                        height: height
                    });
                };
                img.src = ($this.css('background-image') || '').replace(/url\(['"]*(.*?)['"]*\)/g, '$1');
            }

            function update() {
                if (disableParallax) {
                    if (!parallaxIsDisabled) {
                        $this.css('backgroundPosition', '');
                        $this.removeClass('fullwidth-block-parallax-vertical');
                        parallaxIsDisabled = true;
                    }
                    return;
                } else {
                    if (parallaxIsDisabled) {
                        $this.addClass('fullwidth-block-parallax-vertical');
                        parallaxIsDisabled = false;
                    }
                }
                if (isNaN(speedFactor))
                    return;
                if (perspectiveOpened) {
                    var pos = $page.scrollTop();
                } else {
                    var pos = $window.scrollTop();
                }
                if ((topOffset + containerHeight < pos) || (pos < topOffset - windowHeight)) return;
                $this.css('backgroundPosition', xpos + " " + (offsetFactor + speedFactor * (topOffset - pos)) + "px");
            }

            function resize() {
                setTimeout(function() {
                    if (perspectiveOpened) {
                        windowHeight = $page.height();
                    } else {
                        windowHeight = $window.height();
                    }
                    containerHeight = getHeight($this);
                    containerWidth = $this.width();
                    if (isBgCover) {
                        if (baseImgWidth / baseImgHeight <= containerWidth / containerHeight) {
                            curImgHeight = baseImgHeight * ($this.width() / baseImgWidth);
                            disableParallax = false;
                        } else {
                            disableParallax = true;
                        }
                    }
                    if (curImgHeight !== 0) {
                        if (baseSpeedFactor >= 0) {
                            speedFactor = Math.min(baseSpeedFactor, curImgHeight / windowHeight);
                            offsetFactor = Math.min(0, .5 * (windowHeight - curImgHeight - speedFactor * (windowHeight - containerHeight)));
                        } else {
                            speedFactor = Math.min(baseSpeedFactor, (windowHeight - containerHeight) / (windowHeight + containerHeight));
                            offsetFactor = Math.max(0, speedFactor * containerHeight);
                        }
                    } else {
                        speedFactor = baseSpeedFactor;
                        offsetFactor = 0;
                    }
                    topOffset = $this.offset().top;
                    update();
                }, 10);
            }
            getBackgroundSize(function(sz) {
                curImgHeight = baseImgHeight = sz.height;
                baseImgWidth = sz.width;
                resize();
            });
            $window.bind({
                scroll: update,
                load: resize,
                resize: resize
            });
            resize();
        });
        $(window).on('perspective-modalview-opened', function() {
            perspectiveOpened = true;
            windowHeight = $page.height();
        });
        $(window).on('perspective-modalview-closed', function() {
            perspectiveOpened = false;
            windowHeight = $window.height();
        });
    };
})(jQuery);;
(function(a) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], a)
    } else {
        if (typeof module !== "undefined" && module.exports) {
            a(require("jquery"))
        } else {
            a(jQuery)
        }
    }
}(function(f) {
    var y = "1.6.15",
        p = "left",
        o = "right",
        e = "up",
        x = "down",
        c = "in",
        A = "out",
        m = "none",
        s = "auto",
        l = "swipe",
        t = "pinch",
        B = "tap",
        j = "doubletap",
        b = "longtap",
        z = "hold",
        E = "horizontal",
        u = "vertical",
        i = "all",
        r = 10,
        g = "start",
        k = "move",
        h = "end",
        q = "cancel",
        a = "ontouchstart" in window,
        v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !a,
        d = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && !a,
        C = "TouchSwipe";
    var n = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "label, button, input, select, textarea, .noSwipe",
        preventDefaultEvents: true
    };
    f.fn.swipe = function(H) {
        var G = f(this),
            F = G.data(C);
        if (F && typeof H === "string") {
            if (F[H]) {
                return F[H].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                f.error("Method " + H + " does not exist on jQuery.swipe")
            }
        } else {
            if (F && typeof H === "object") {
                F.option.apply(this, arguments)
            } else {
                if (!F && (typeof H === "object" || !H)) {
                    return w.apply(this, arguments)
                }
            }
        }
        return G
    };
    f.fn.swipe.version = y;
    f.fn.swipe.defaults = n;
    f.fn.swipe.phases = {
        PHASE_START: g,
        PHASE_MOVE: k,
        PHASE_END: h,
        PHASE_CANCEL: q
    };
    f.fn.swipe.directions = {
        LEFT: p,
        RIGHT: o,
        UP: e,
        DOWN: x,
        IN: c,
        OUT: A
    };
    f.fn.swipe.pageScroll = {
        NONE: m,
        HORIZONTAL: E,
        VERTICAL: u,
        AUTO: s
    };
    f.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        ALL: i
    };

    function w(F) {
        if (F && (F.allowPageScroll === undefined && (F.swipe !== undefined || F.swipeStatus !== undefined))) {
            F.allowPageScroll = m
        }
        if (F.click !== undefined && F.tap === undefined) {
            F.tap = F.click
        }
        if (!F) {
            F = {}
        }
        F = f.extend({}, f.fn.swipe.defaults, F);
        return this.each(function() {
            var H = f(this);
            var G = H.data(C);
            if (!G) {
                G = new D(this, F);
                H.data(C, G)
            }
        })
    }

    function D(a5, au) {
        var au = f.extend({}, au);
        var az = (a || d || !au.fallbackToMouseEvents),
            K = az ? (d ? (v ? "MSPointerDown" : "pointerdown") : "touchstart") : "mousedown",
            ax = az ? (d ? (v ? "MSPointerMove" : "pointermove") : "touchmove") : "mousemove",
            V = az ? (d ? (v ? "MSPointerUp" : "pointerup") : "touchend") : "mouseup",
            T = az ? (d ? "mouseleave" : null) : "mouseleave",
            aD = (d ? (v ? "MSPointerCancel" : "pointercancel") : "touchcancel");
        var ag = 0,
            aP = null,
            a2 = null,
            ac = 0,
            a1 = 0,
            aZ = 0,
            H = 1,
            ap = 0,
            aJ = 0,
            N = null;
        var aR = f(a5);
        var aa = "start";
        var X = 0;
        var aQ = {};
        var U = 0,
            a3 = 0,
            a6 = 0,
            ay = 0,
            O = 0;
        var aW = null,
            af = null;
        try {
            aR.bind(K, aN);
            aR.bind(aD, ba)
        } catch (aj) {
            f.error("events not supported " + K + "," + aD + " on jQuery.swipe")
        }
        this.enable = function() {
            aR.bind(K, aN);
            aR.bind(aD, ba);
            return aR
        };
        this.disable = function() {
            aK();
            return aR
        };
        this.destroy = function() {
            aK();
            aR.data(C, null);
            aR = null
        };
        this.option = function(bd, bc) {
            if (typeof bd === "object") {
                au = f.extend(au, bd)
            } else {
                if (au[bd] !== undefined) {
                    if (bc === undefined) {
                        return au[bd]
                    } else {
                        au[bd] = bc
                    }
                } else {
                    if (!bd) {
                        return au
                    } else {
                        f.error("Option " + bd + " does not exist on jQuery.swipe.options")
                    }
                }
            }
            return null
        };

        function aN(be) {
            if (aB()) {
                return
            }
            if (f(be.target).closest(au.excludedElements, aR).length > 0) {
                return
            }
            var bf = be.originalEvent ? be.originalEvent : be;
            var bd, bg = bf.touches,
                bc = bg ? bg[0] : bf;
            aa = g;
            if (bg) {
                X = bg.length
            } else {
                if (au.preventDefaultEvents !== false) {
                    be.preventDefault()
                }
            }
            ag = 0;
            aP = null;
            a2 = null;
            aJ = null;
            ac = 0;
            a1 = 0;
            aZ = 0;
            H = 1;
            ap = 0;
            N = ab();
            S();
            ai(0, bc);
            if (!bg || (X === au.fingers || au.fingers === i) || aX()) {
                U = ar();
                if (X == 2) {
                    ai(1, bg[1]);
                    a1 = aZ = at(aQ[0].start, aQ[1].start)
                }
                if (au.swipeStatus || au.pinchStatus) {
                    bd = P(bf, aa)
                }
            } else {
                bd = false
            }
            if (bd === false) {
                aa = q;
                P(bf, aa);
                return bd
            } else {
                if (au.hold) {
                    af = setTimeout(f.proxy(function() {
                        aR.trigger("hold", [bf.target]);
                        if (au.hold) {
                            bd = au.hold.call(aR, bf, bf.target)
                        }
                    }, this), au.longTapThreshold)
                }
                an(true)
            }
            return null
        }

        function a4(bf) {
            var bi = bf.originalEvent ? bf.originalEvent : bf;
            if (aa === h || aa === q || al()) {
                return
            }
            var be, bj = bi.touches,
                bd = bj ? bj[0] : bi;
            var bg = aH(bd);
            a3 = ar();
            if (bj) {
                X = bj.length
            }
            if (au.hold) {
                clearTimeout(af)
            }
            aa = k;
            if (X == 2) {
                if (a1 == 0) {
                    ai(1, bj[1]);
                    a1 = aZ = at(aQ[0].start, aQ[1].start)
                } else {
                    aH(bj[1]);
                    aZ = at(aQ[0].end, aQ[1].end);
                    aJ = aq(aQ[0].end, aQ[1].end)
                }
                H = a8(a1, aZ);
                ap = Math.abs(a1 - aZ)
            }
            if ((X === au.fingers || au.fingers === i) || !bj || aX()) {
                aP = aL(bg.start, bg.end);
                a2 = aL(bg.last, bg.end);
                ak(bf, a2);
                ag = aS(bg.start, bg.end);
                ac = aM();
                aI(aP, ag);
                be = P(bi, aa);
                if (!au.triggerOnTouchEnd || au.triggerOnTouchLeave) {
                    var bc = true;
                    if (au.triggerOnTouchLeave) {
                        var bh = aY(this);
                        bc = F(bg.end, bh)
                    }
                    if (!au.triggerOnTouchEnd && bc) {
                        aa = aC(k)
                    } else {
                        if (au.triggerOnTouchLeave && !bc) {
                            aa = aC(h)
                        }
                    }
                    if (aa == q || aa == h) {
                        P(bi, aa)
                    }
                }
            } else {
                aa = q;
                P(bi, aa)
            }
            if (be === false) {
                aa = q;
                P(bi, aa)
            }
        }

        function M(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc,
                be = bd.touches;
            if (be) {
                if (be.length && !al()) {
                    G(bd);
                    return true
                } else {
                    if (be.length && al()) {
                        return true
                    }
                }
            }
            if (al()) {
                X = ay
            }
            a3 = ar();
            ac = aM();
            if (bb() || !am()) {
                aa = q;
                P(bd, aa)
            } else {
                if (au.triggerOnTouchEnd || (au.triggerOnTouchEnd == false && aa === k)) {
                    if (au.preventDefaultEvents !== false) {
                        bc.preventDefault()
                    }
                    aa = h;
                    P(bd, aa)
                } else {
                    if (!au.triggerOnTouchEnd && a7()) {
                        aa = h;
                        aF(bd, aa, B)
                    } else {
                        if (aa === k) {
                            aa = q;
                            P(bd, aa)
                        }
                    }
                }
            }
            an(false);
            return null
        }

        function ba() {
            X = 0;
            a3 = 0;
            U = 0;
            a1 = 0;
            aZ = 0;
            H = 1;
            S();
            an(false)
        }

        function L(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc;
            if (au.triggerOnTouchLeave) {
                aa = aC(h);
                P(bd, aa)
            }
        }

        function aK() {
            aR.unbind(K, aN);
            aR.unbind(aD, ba);
            aR.unbind(ax, a4);
            aR.unbind(V, M);
            if (T) {
                aR.unbind(T, L)
            }
            an(false)
        }

        function aC(bg) {
            var bf = bg;
            var be = aA();
            var bd = am();
            var bc = bb();
            if (!be || bc) {
                bf = q
            } else {
                if (bd && bg == k && (!au.triggerOnTouchEnd || au.triggerOnTouchLeave)) {
                    bf = h
                } else {
                    if (!bd && bg == h && au.triggerOnTouchLeave) {
                        bf = q
                    }
                }
            }
            return bf
        }

        function P(be, bc) {
            var bd, bf = be.touches;
            if (J() || W()) {
                bd = aF(be, bc, l)
            }
            if ((Q() || aX()) && bd !== false) {
                bd = aF(be, bc, t)
            }
            if (aG() && bd !== false) {
                bd = aF(be, bc, j)
            } else {
                if (ao() && bd !== false) {
                    bd = aF(be, bc, b)
                } else {
                    if (ah() && bd !== false) {
                        bd = aF(be, bc, B)
                    }
                }
            }
            if (bc === q) {
                if (W()) {
                    bd = aF(be, bc, l)
                }
                if (aX()) {
                    bd = aF(be, bc, t)
                }
                ba(be)
            }
            if (bc === h) {
                if (bf) {
                    if (!bf.length) {
                        ba(be)
                    }
                } else {
                    ba(be)
                }
            }
            return bd
        }

        function aF(bf, bc, be) {
            var bd;
            if (be == l) {
                aR.trigger("swipeStatus", [bc, aP || null, ag || 0, ac || 0, X, aQ, a2]);
                if (au.swipeStatus) {
                    bd = au.swipeStatus.call(aR, bf, bc, aP || null, ag || 0, ac || 0, X, aQ, a2);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && aV()) {
                    clearTimeout(aW);
                    clearTimeout(af);
                    aR.trigger("swipe", [aP, ag, ac, X, aQ, a2]);
                    if (au.swipe) {
                        bd = au.swipe.call(aR, bf, aP, ag, ac, X, aQ, a2);
                        if (bd === false) {
                            return false
                        }
                    }
                    switch (aP) {
                        case p:
                            aR.trigger("swipeLeft", [aP, ag, ac, X, aQ, a2]);
                            if (au.swipeLeft) {
                                bd = au.swipeLeft.call(aR, bf, aP, ag, ac, X, aQ, a2)
                            }
                            break;
                        case o:
                            aR.trigger("swipeRight", [aP, ag, ac, X, aQ, a2]);
                            if (au.swipeRight) {
                                bd = au.swipeRight.call(aR, bf, aP, ag, ac, X, aQ, a2)
                            }
                            break;
                        case e:
                            aR.trigger("swipeUp", [aP, ag, ac, X, aQ, a2]);
                            if (au.swipeUp) {
                                bd = au.swipeUp.call(aR, bf, aP, ag, ac, X, aQ, a2)
                            }
                            break;
                        case x:
                            aR.trigger("swipeDown", [aP, ag, ac, X, aQ, a2]);
                            if (au.swipeDown) {
                                bd = au.swipeDown.call(aR, bf, aP, ag, ac, X, aQ, a2)
                            }
                            break
                    }
                }
            }
            if (be == t) {
                aR.trigger("pinchStatus", [bc, aJ || null, ap || 0, ac || 0, X, H, aQ]);
                if (au.pinchStatus) {
                    bd = au.pinchStatus.call(aR, bf, bc, aJ || null, ap || 0, ac || 0, X, H, aQ);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && a9()) {
                    switch (aJ) {
                        case c:
                            aR.trigger("pinchIn", [aJ || null, ap || 0, ac || 0, X, H, aQ]);
                            if (au.pinchIn) {
                                bd = au.pinchIn.call(aR, bf, aJ || null, ap || 0, ac || 0, X, H, aQ)
                            }
                            break;
                        case A:
                            aR.trigger("pinchOut", [aJ || null, ap || 0, ac || 0, X, H, aQ]);
                            if (au.pinchOut) {
                                bd = au.pinchOut.call(aR, bf, aJ || null, ap || 0, ac || 0, X, H, aQ)
                            }
                            break
                    }
                }
            }
            if (be == B) {
                if (bc === q || bc === h) {
                    clearTimeout(aW);
                    clearTimeout(af);
                    if (Z() && !I()) {
                        O = ar();
                        aW = setTimeout(f.proxy(function() {
                            O = null;
                            aR.trigger("tap", [bf.target]);
                            if (au.tap) {
                                bd = au.tap.call(aR, bf, bf.target)
                            }
                        }, this), au.doubleTapThreshold)
                    } else {
                        O = null;
                        aR.trigger("tap", [bf.target]);
                        if (au.tap) {
                            bd = au.tap.call(aR, bf, bf.target)
                        }
                    }
                }
            } else {
                if (be == j) {
                    if (bc === q || bc === h) {
                        clearTimeout(aW);
                        clearTimeout(af);
                        O = null;
                        aR.trigger("doubletap", [bf.target]);
                        if (au.doubleTap) {
                            bd = au.doubleTap.call(aR, bf, bf.target)
                        }
                    }
                } else {
                    if (be == b) {
                        if (bc === q || bc === h) {
                            clearTimeout(aW);
                            O = null;
                            aR.trigger("longtap", [bf.target]);
                            if (au.longTap) {
                                bd = au.longTap.call(aR, bf, bf.target)
                            }
                        }
                    }
                }
            }
            return bd
        }

        function am() {
            var bc = true;
            if (au.threshold !== null) {
                bc = ag >= au.threshold
            }
            return bc
        }

        function bb() {
            var bc = false;
            if (au.cancelThreshold !== null && aP !== null) {
                bc = (aT(aP) - ag) >= au.cancelThreshold
            }
            return bc
        }

        function ae() {
            if (au.pinchThreshold !== null) {
                return ap >= au.pinchThreshold
            }
            return true
        }

        function aA() {
            var bc;
            if (au.maxTimeThreshold) {
                if (ac >= au.maxTimeThreshold) {
                    bc = false
                } else {
                    bc = true
                }
            } else {
                bc = true
            }
            return bc
        }

        function ak(bc, bd) {
            if (au.preventDefaultEvents === false) {
                return
            }
            if (au.allowPageScroll === m) {
                bc.preventDefault()
            } else {
                var be = au.allowPageScroll === s;
                switch (bd) {
                    case p:
                        if ((au.swipeLeft && be) || (!be && au.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case o:
                        if ((au.swipeRight && be) || (!be && au.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case e:
                        if ((au.swipeUp && be) || (!be && au.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break;
                    case x:
                        if ((au.swipeDown && be) || (!be && au.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break
                }
            }
        }

        function a9() {
            var bd = aO();
            var bc = Y();
            var be = ae();
            return bd && bc && be
        }

        function aX() {
            return !!(au.pinchStatus || au.pinchIn || au.pinchOut)
        }

        function Q() {
            return !!(a9() && aX())
        }

        function aV() {
            var bf = aA();
            var bh = am();
            var be = aO();
            var bc = Y();
            var bd = bb();
            var bg = !bd && bc && be && bh && bf;
            return bg
        }

        function W() {
            return !!(au.swipe || au.swipeStatus || au.swipeLeft || au.swipeRight || au.swipeUp || au.swipeDown)
        }

        function J() {
            return !!(aV() && W())
        }

        function aO() {
            return ((X === au.fingers || au.fingers === i) || !a)
        }

        function Y() {
            return aQ[0].end.x !== 0
        }

        function a7() {
            return !!(au.tap)
        }

        function Z() {
            return !!(au.doubleTap)
        }

        function aU() {
            return !!(au.longTap)
        }

        function R() {
            if (O == null) {
                return false
            }
            var bc = ar();
            return (Z() && ((bc - O) <= au.doubleTapThreshold))
        }

        function I() {
            return R()
        }

        function aw() {
            return ((X === 1 || !a) && (isNaN(ag) || ag < au.threshold))
        }

        function a0() {
            return ((ac > au.longTapThreshold) && (ag < r))
        }

        function ah() {
            return !!(aw() && a7())
        }

        function aG() {
            return !!(R() && Z())
        }

        function ao() {
            return !!(a0() && aU())
        }

        function G(bc) {
            a6 = ar();
            ay = bc.touches.length + 1
        }

        function S() {
            a6 = 0;
            ay = 0
        }

        function al() {
            var bc = false;
            if (a6) {
                var bd = ar() - a6;
                if (bd <= au.fingerReleaseThreshold) {
                    bc = true
                }
            }
            return bc
        }

        function aB() {
            return !!(aR.data(C + "_intouch") === true)
        }

        function an(bc) {
            if (!aR) {
                return
            }
            if (bc === true) {
                aR.bind(ax, a4);
                aR.bind(V, M);
                if (T) {
                    aR.bind(T, L)
                }
            } else {
                aR.unbind(ax, a4, false);
                aR.unbind(V, M, false);
                if (T) {
                    aR.unbind(T, L, false)
                }
            }
            aR.data(C + "_intouch", bc === true)
        }

        function ai(be, bc) {
            var bd = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            bd.start.x = bd.last.x = bd.end.x = bc.pageX || bc.clientX;
            bd.start.y = bd.last.y = bd.end.y = bc.pageY || bc.clientY;
            aQ[be] = bd;
            return bd
        }

        function aH(bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            var bd = ad(be);
            if (bd === null) {
                bd = ai(be, bc)
            }
            bd.last.x = bd.end.x;
            bd.last.y = bd.end.y;
            bd.end.x = bc.pageX || bc.clientX;
            bd.end.y = bc.pageY || bc.clientY;
            return bd
        }

        function ad(bc) {
            return aQ[bc] || null
        }

        function aI(bc, bd) {
            bd = Math.max(bd, aT(bc));
            N[bc].distance = bd
        }

        function aT(bc) {
            if (N[bc]) {
                return N[bc].distance
            }
            return undefined
        }

        function ab() {
            var bc = {};
            bc[p] = av(p);
            bc[o] = av(o);
            bc[e] = av(e);
            bc[x] = av(x);
            return bc
        }

        function av(bc) {
            return {
                direction: bc,
                distance: 0
            }
        }

        function aM() {
            return a3 - U
        }

        function at(bf, be) {
            var bd = Math.abs(bf.x - be.x);
            var bc = Math.abs(bf.y - be.y);
            return Math.round(Math.sqrt(bd * bd + bc * bc))
        }

        function a8(bc, bd) {
            var be = (bd / bc) * 1;
            return be.toFixed(2)
        }

        function aq() {
            if (H < 1) {
                return A
            } else {
                return c
            }
        }

        function aS(bd, bc) {
            return Math.round(Math.sqrt(Math.pow(bc.x - bd.x, 2) + Math.pow(bc.y - bd.y, 2)))
        }

        function aE(bf, bd) {
            var bc = bf.x - bd.x;
            var bh = bd.y - bf.y;
            var be = Math.atan2(bh, bc);
            var bg = Math.round(be * 180 / Math.PI);
            if (bg < 0) {
                bg = 360 - Math.abs(bg)
            }
            return bg
        }

        function aL(bd, bc) {
            var be = aE(bd, bc);
            if ((be <= 45) && (be >= 0)) {
                return p
            } else {
                if ((be <= 360) && (be >= 315)) {
                    return p
                } else {
                    if ((be >= 135) && (be <= 225)) {
                        return o
                    } else {
                        if ((be > 45) && (be < 135)) {
                            return x
                        } else {
                            return e
                        }
                    }
                }
            }
        }

        function ar() {
            var bc = new Date();
            return bc.getTime()
        }

        function aY(bc) {
            bc = f(bc);
            var be = bc.offset();
            var bd = {
                left: be.left,
                right: be.left + bc.outerWidth(),
                top: be.top,
                bottom: be.top + bc.outerHeight()
            };
            return bd
        }

        function F(bc, bd) {
            return (bc.x > bd.left && bc.x < bd.right && bc.y > bd.top && bc.y < bd.bottom)
        }
    }
}));;
(function($) {
    function sc_setScroll(a, b, c) {
        return "transition" == c.transition && "swing" == b && (b = "ease"), {
            anims: [],
            duration: a,
            orgDuration: a,
            easing: b,
            startTime: getTime()
        }
    }

    function sc_startScroll(a, b) {
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e && e[0][b.transition](e[1], a.duration, a.easing, e[2])
        }
    }

    function sc_stopScroll(a, b) {
        is_boolean(b) || (b = !0), is_object(a.pre) && sc_stopScroll(a.pre, b);
        for (var c = 0, d = a.anims.length; d > c; c++) {
            var e = a.anims[c];
            e[0].stop(!0), b && (e[0].css(e[1]), is_function(e[2]) && e[2]())
        }
        is_object(a.post) && sc_stopScroll(a.post, b)
    }

    function sc_afterScroll(a, b, c) {
        switch (b && b.remove(), c.fx) {
            case "fade":
            case "crossfade":
            case "cover-fade":
            case "uncover-fade":
                a.css("opacity", 1), a.css("filter", "")
        }
    }

    function sc_fireCallbacks(a, b, c, d, e) {
        if (b[c] && b[c].call(a, d), e[c].length)
            for (var f = 0, g = e[c].length; g > f; f++) e[c][f].call(a, d);
        return []
    }

    function sc_fireQueue(a, b, c) {
        return b.length && (a.trigger(cf_e(b[0][0], c), b[0][1]), b.shift()), b
    }

    function sc_hideHiddenItems(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden", a.is(":hidden")).hide()
        })
    }

    function sc_showHiddenItems(a) {
        a && a.each(function() {
            var a = $(this);
            a.data("_cfs_isHidden") || a.show()
        })
    }

    function sc_clearTimers(a) {
        return a.auto && clearTimeout(a.auto), a.progress && clearInterval(a.progress), a
    }

    function sc_mapCallbackArguments(a, b, c, d, e, f, g) {
        return {
            width: g.width,
            height: g.height,
            items: {
                old: a,
                skipped: b,
                visible: c
            },
            scroll: {
                items: d,
                direction: e,
                duration: f
            }
        }
    }

    function sc_getDuration(a, b, c, d) {
        var e = a.duration;
        return "none" == a.fx ? 0 : ("auto" == e ? e = b.scroll.duration / b.scroll.items * c : 10 > e && (e = d / e), 1 > e ? 0 : ("fade" == a.fx && (e /= 2), Math.round(e)))
    }

    function nv_showNavi(a, b, c) {
        var d = is_number(a.items.minimum) ? a.items.minimum : a.items.visible + 1;
        if ("show" == b || "hide" == b) var e = b;
        else if (d > b) {
            debug(c, "Not enough items (" + b + " total, " + d + " needed): Hiding navigation.");
            var e = "hide"
        } else var e = "show";
        var f = "show" == e ? "removeClass" : "addClass",
            g = cf_c("hidden", c);
        a.auto.button && a.auto.button[e]()[f](g), a.prev.button && a.prev.button[e]()[f](g), a.next.button && a.next.button[e]()[f](g), a.pagination.container && a.pagination.container[e]()[f](g)
    }

    function nv_enableNavi(a, b, c) {
        if (!a.circular && !a.infinite) {
            var d = "removeClass" == b || "addClass" == b ? b : !1,
                e = cf_c("disabled", c);
            if (a.auto.button && d && a.auto.button[d](e), a.prev.button) {
                var f = d || 0 == b ? "addClass" : "removeClass";
                a.prev.button[f](e)
            }
            if (a.next.button) {
                var f = d || b == a.items.visible ? "addClass" : "removeClass";
                a.next.button[f](e)
            }
        }
    }

    function go_getObject(a, b) {
        return is_function(b) ? b = b.call(a) : is_undefined(b) && (b = {}), b
    }

    function go_getItemsObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = {
            visible: b
        } : "variable" == b ? b = {
            visible: b,
            width: b,
            height: b
        } : is_object(b) || (b = {}), b
    }

    function go_getScrollObject(a, b) {
        return b = go_getObject(a, b), is_number(b) ? b = 50 >= b ? {
            items: b
        } : {
            duration: b
        } : is_string(b) ? b = {
            easing: b
        } : is_object(b) || (b = {}), b
    }

    function go_getNaviObject(a, b) {
        if (b = go_getObject(a, b), is_string(b)) {
            var c = cf_getKeyCode(b);
            b = -1 == c ? $(b) : c
        }
        return b
    }

    function go_getAutoObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {
            button: b
        } : is_boolean(b) ? b = {
            play: b
        } : is_number(b) && (b = {
            timeoutDuration: b
        }), b.progress && (is_string(b.progress) || is_jquery(b.progress)) && (b.progress = {
            bar: b.progress
        }), b
    }

    function go_complementAutoObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_boolean(b.play) || (b.play = !0), is_number(b.delay) || (b.delay = 0), is_undefined(b.pauseOnEvent) && (b.pauseOnEvent = !0), is_boolean(b.pauseOnResize) || (b.pauseOnResize = !0), is_number(b.timeoutDuration) || (b.timeoutDuration = 10 > b.duration ? 2500 : 5 * b.duration), b.progress && (is_function(b.progress.bar) && (b.progress.bar = b.progress.bar.call(a)), is_string(b.progress.bar) && (b.progress.bar = $(b.progress.bar)), b.progress.bar ? (is_function(b.progress.updater) || (b.progress.updater = $.fn.carouFredSel.progressbarUpdater), is_number(b.progress.interval) || (b.progress.interval = 50)) : b.progress = !1), b
    }

    function go_getPrevNextObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {
            button: b
        } : is_number(b) && (b = {
            key: b
        }), b
    }

    function go_complementPrevNextObject(a, b) {
        return is_function(b.button) && (b.button = b.button.call(a)), is_string(b.button) && (b.button = $(b.button)), is_string(b.key) && (b.key = cf_getKeyCode(b.key)), b
    }

    function go_getPaginationObject(a, b) {
        return b = go_getNaviObject(a, b), is_jquery(b) ? b = {
            container: b
        } : is_boolean(b) && (b = {
            keys: b
        }), b
    }

    function go_complementPaginationObject(a, b) {
        return is_function(b.container) && (b.container = b.container.call(a)), is_string(b.container) && (b.container = $(b.container)), is_number(b.items) || (b.items = !1), is_boolean(b.keys) || (b.keys = !1), is_function(b.anchorBuilder) || is_false(b.anchorBuilder) || (b.anchorBuilder = $.fn.carouFredSel.pageAnchorBuilder), is_number(b.deviation) || (b.deviation = 0), b
    }

    function go_getSwipeObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_undefined(b) && (b = {
            onTouch: !1
        }), is_true(b) ? b = {
            onTouch: b
        } : is_number(b) && (b = {
            items: b
        }), b
    }

    function go_complementSwipeObject(a, b) {
        return is_boolean(b.onTouch) || (b.onTouch = !0), is_boolean(b.onMouse) || (b.onMouse = !1), is_object(b.options) || (b.options = {}), is_boolean(b.options.triggerOnTouchEnd) || (b.options.triggerOnTouchEnd = !1), b
    }

    function go_getMousewheelObject(a, b) {
        return is_function(b) && (b = b.call(a)), is_true(b) ? b = {} : is_number(b) ? b = {
            items: b
        } : is_undefined(b) && (b = !1), b
    }

    function go_complementMousewheelObject(a, b) {
        return b
    }

    function gn_getItemIndex(a, b, c, d, e) {
        if (is_string(a) && (a = $(a, e)), is_object(a) && (a = $(a, e)), is_jquery(a) ? (a = e.children().index(a), is_boolean(c) || (c = !1)) : is_boolean(c) || (c = !0), is_number(a) || (a = 0), is_number(b) || (b = 0), c && (a += d.first), a += b, d.total > 0) {
            for (; a >= d.total;) a -= d.total;
            for (; 0 > a;) a += d.total
        }
        return a
    }

    function gn_getVisibleItemsPrev(a, b, c) {
        for (var d = 0, e = 0, f = c; f >= 0; f--) {
            var g = a.eq(f);
            if (d += g.is(":visible") ? g[b.d.outerWidth](!0) : 0, d > b.maxDimension) return e;
            0 == f && (f = a.length), e++
        }
    }

    function gn_getVisibleItemsPrevFilter(a, b, c) {
        return gn_getItemsPrevFilter(a, b.items.filter, b.items.visibleConf.org, c)
    }

    function gn_getScrollItemsPrevFilter(a, b, c, d) {
        return gn_getItemsPrevFilter(a, b.items.filter, d, c)
    }

    function gn_getItemsPrevFilter(a, b, c, d) {
        for (var e = 0, f = 0, g = d, h = a.length; g >= 0; g--) {
            if (f++, f == h) return f;
            var i = a.eq(g);
            if (i.is(b) && (e++, e == c)) return f;
            0 == g && (g = h)
        }
    }

    function gn_getVisibleOrg(a, b) {
        return b.items.visibleConf.org || a.children().slice(0, b.items.visible).filter(b.items.filter).length
    }

    function gn_getVisibleItemsNext(a, b, c) {
        for (var d = 0, e = 0, f = c, g = a.length - 1; g >= f; f++) {
            var h = a.eq(f);
            if (d += h.is(":visible") ? h[b.d.outerWidth](!0) : 0, d > b.maxDimension) return e;
            if (e++, e == g + 1) return e;
            f == g && (f = -1)
        }
    }

    function gn_getVisibleItemsNextTestCircular(a, b, c, d) {
        var e = gn_getVisibleItemsNext(a, b, c);
        return b.circular || c + e > d && (e = d - c), e
    }

    function gn_getVisibleItemsNextFilter(a, b, c) {
        return gn_getItemsNextFilter(a, b.items.filter, b.items.visibleConf.org, c, b.circular)
    }

    function gn_getScrollItemsNextFilter(a, b, c, d) {
        return gn_getItemsNextFilter(a, b.items.filter, d + 1, c, b.circular) - 1
    }

    function gn_getItemsNextFilter(a, b, c, d) {
        for (var f = 0, g = 0, h = d, i = a.length - 1; i >= h; h++) {
            if (g++, g >= i) return g;
            var j = a.eq(h);
            if (j.is(b) && (f++, f == c)) return g;
            h == i && (h = -1)
        }
    }

    function gi_getCurrentItems(a, b) {
        return a.slice(0, b.items.visible)
    }

    function gi_getOldItemsPrev(a, b, c) {
        return a.slice(c, b.items.visibleConf.old + c)
    }

    function gi_getNewItemsPrev(a, b) {
        return a.slice(0, b.items.visible)
    }

    function gi_getOldItemsNext(a, b) {
        return a.slice(0, b.items.visibleConf.old)
    }

    function gi_getNewItemsNext(a, b, c) {
        return a.slice(c, b.items.visible + c)
    }

    function sz_storeMargin(a, b, c) {
        b.usePadding && (is_string(c) || (c = "_cfs_origCssMargin"), a.each(function() {
            var a = $(this),
                d = parseInt(a.css(b.d.marginRight), 10);
            is_number(d) || (d = 0), a.data(c, d)
        }))
    }

    function sz_resetMargin(a, b, c) {
        if (b.usePadding) {
            var d = is_boolean(c) ? c : !1;
            is_number(c) || (c = 0), sz_storeMargin(a, b, "_cfs_tempCssMargin"), a.each(function() {
                var a = $(this);
                a.css(b.d.marginRight, d ? a.data("_cfs_tempCssMargin") : c + a.data("_cfs_origCssMargin"))
            })
        }
    }

    function sz_storeOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.data("_cfs_origCss", a.attr("style") || "")
        })
    }

    function sz_restoreOrigCss(a) {
        a.each(function() {
            var a = $(this);
            a.attr("style", a.data("_cfs_origCss") || "")
        })
    }

    function sz_setResponsiveSizes(a, b) {
        var d = (a.items.visible, a.items[a.d.width]),
            e = a[a.d.height],
            f = is_percentage(e);
        b.each(function() {
            var b = $(this),
                c = d - ms_getPaddingBorderMargin(b, a, "Width");
            b[a.d.width](c), f && b[a.d.height](ms_getPercentage(c, e))
        })
    }

    function sz_setSizes(a, b) {
        var c = a.parent(),
            d = a.children(),
            e = gi_getCurrentItems(d, b),
            f = cf_mapWrapperSizes(ms_getSizes(e, b, !0), b, !1);
        if (c.css(f), b.usePadding) {
            var g = b.padding,
                h = g[b.d[1]];
            b.align && 0 > h && (h = 0);
            var i = e.last();
            i.css(b.d.marginRight, i.data("_cfs_origCssMargin") + h), a.css(b.d.top, g[b.d[0]]), a.css(b.d.left, g[b.d[3]])
        }
        return a.css(b.d.width, f[b.d.width] + 2 * ms_getTotalSize(d, b, "width")), a.css(b.d.height, ms_getLargestSize(d, b, "height")), f
    }

    function ms_getSizes(a, b, c) {
        return [ms_getTotalSize(a, b, "width", c), ms_getLargestSize(a, b, "height", c)]
    }

    function ms_getLargestSize(a, b, c, d) {
        return is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d ? b[b.d[c]] : is_number(b.items[b.d[c]]) ? b.items[b.d[c]] : (c = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", ms_getTrueLargestSize(a, b, c))
    }

    function ms_getTrueLargestSize(a, b, c) {
        for (var d = 0, e = 0, f = a.length; f > e; e++) {
            var g = a.eq(e),
                h = g.is(":visible") ? g[b.d[c]](!0) : 0;
            h > d && (d = h)
        }
        return d
    }

    function ms_getTotalSize(a, b, c, d) {
        if (is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d) return b[b.d[c]];
        if (is_number(b.items[b.d[c]])) return b.items[b.d[c]] * a.length;
        for (var e = c.toLowerCase().indexOf("width") > -1 ? "outerWidth" : "outerHeight", f = 0, g = 0, h = a.length; h > g; g++) {
            var i = a.eq(g);
            f += i.is(":visible") ? i[b.d[e]](!0) : 0
        }
        return f
    }

    function ms_getParentSize(a, b, c) {
        var d = a.is(":visible");
        d && a.hide();
        var e = a.parent()[b.d[c]]();
        return d && a.show(), e
    }

    function ms_getMaxDimension(a, b) {
        return is_number(a[a.d.width]) ? a[a.d.width] : b
    }

    function ms_hasVariableSizes(a, b, c) {
        for (var d = !1, e = !1, f = 0, g = a.length; g > f; f++) {
            var h = a.eq(f),
                i = h.is(":visible") ? h[b.d[c]](!0) : 0;
            d === !1 ? d = i : d != i && (e = !0), 0 == d && (e = !0)
        }
        return e
    }

    function ms_getPaddingBorderMargin(a, b, c) {
        return a[b.d["outer" + c]](!0) - a[b.d[c.toLowerCase()]]()
    }

    function ms_getPercentage(a, b) {
        if (is_percentage(b)) {
            if (b = parseInt(b.slice(0, -1), 10), !is_number(b)) return a;
            a *= b / 100
        }
        return a
    }

    function cf_e(a, b, c, d, e) {
        return is_boolean(c) || (c = !0), is_boolean(d) || (d = !0), is_boolean(e) || (e = !1), c && (a = b.events.prefix + a), d && (a = a + "." + b.events.namespace), d && e && (a += b.serialNumber), a
    }

    function cf_c(a, b) {
        return is_string(b.classnames[a]) ? b.classnames[a] : a
    }

    function cf_mapWrapperSizes(a, b, c) {
        is_boolean(c) || (c = !0);
        var d = b.usePadding && c ? b.padding : [0, 0, 0, 0],
            e = {};
        return e[b.d.width] = a[0] + d[1] + d[3], e[b.d.height] = a[1] + d[0] + d[2], e
    }

    function cf_sortParams(a, b) {
        for (var c = [], d = 0, e = a.length; e > d; d++)
            for (var f = 0, g = b.length; g > f; f++)
                if (b[f].indexOf(typeof a[d]) > -1 && is_undefined(c[f])) {
                    c[f] = a[d];
                    break
                }
        return c
    }

    function cf_getPadding(a) {
        if (is_undefined(a)) return [0, 0, 0, 0];
        if (is_number(a)) return [a, a, a, a];
        if (is_string(a) && (a = a.split("px").join("").split("em").join("").split(" ")), !is_array(a)) return [0, 0, 0, 0];
        for (var b = 0; 4 > b; b++) a[b] = parseInt(a[b], 10);
        switch (a.length) {
            case 0:
                return [0, 0, 0, 0];
            case 1:
                return [a[0], a[0], a[0], a[0]];
            case 2:
                return [a[0], a[1], a[0], a[1]];
            case 3:
                return [a[0], a[1], a[2], a[1]];
            default:
                return [a[0], a[1], a[2], a[3]]
        }
    }

    function cf_getAlignPadding(a, b) {
        var c = is_number(b[b.d.width]) ? Math.ceil(b[b.d.width] - ms_getTotalSize(a, b, "width")) : 0;
        switch (b.align) {
            case "left":
                return [0, c];
            case "right":
                return [c, 0];
            case "center":
            default:
                return [Math.ceil(c / 2), Math.floor(c / 2)]
        }
    }

    function cf_getDimensions(a) {
        for (var b = [
                ["width", "innerWidth", "outerWidth", "height", "innerHeight", "outerHeight", "left", "top", "marginRight", 0, 1, 2, 3],
                ["height", "innerHeight", "outerHeight", "width", "innerWidth", "outerWidth", "top", "left", "marginBottom", 3, 2, 1, 0]
            ], c = b[0].length, d = "right" == a.direction || "left" == a.direction ? 0 : 1, e = {}, f = 0; c > f; f++) e[b[0][f]] = b[d][f];
        return e
    }

    function cf_getAdjust(a, b, c, d) {
        var e = a;
        if (is_function(c)) e = c.call(d, e);
        else if (is_string(c)) {
            var f = c.split("+"),
                g = c.split("-");
            if (g.length > f.length) var h = !0,
                i = g[0],
                j = g[1];
            else var h = !1,
                i = f[0],
                j = f[1];
            switch (i) {
                case "even":
                    e = 1 == a % 2 ? a - 1 : a;
                    break;
                case "odd":
                    e = 0 == a % 2 ? a - 1 : a;
                    break;
                default:
                    e = a
            }
            j = parseInt(j, 10), is_number(j) && (h && (j = -j), e += j)
        }
        return (!is_number(e) || 1 > e) && (e = 1), e
    }

    function cf_getItemsAdjust(a, b, c, d) {
        return cf_getItemAdjustMinMax(cf_getAdjust(a, b, c, d), b.items.visibleConf)
    }

    function cf_getItemAdjustMinMax(a, b) {
        return is_number(b.min) && b.min > a && (a = b.min), is_number(b.max) && a > b.max && (a = b.max), 1 > a && (a = 1), a
    }

    function cf_getSynchArr(a) {
        is_array(a) || (a = [
            [a]
        ]), is_array(a[0]) || (a = [a]);
        for (var b = 0, c = a.length; c > b; b++) is_string(a[b][0]) && (a[b][0] = $(a[b][0])), is_boolean(a[b][1]) || (a[b][1] = !0), is_boolean(a[b][2]) || (a[b][2] = !0), is_number(a[b][3]) || (a[b][3] = 0);
        return a
    }

    function cf_getKeyCode(a) {
        return "right" == a ? 39 : "left" == a ? 37 : "up" == a ? 38 : "down" == a ? 40 : -1
    }

    function cf_setCookie(a, b, c) {
        if (a) {
            var d = b.triggerHandler(cf_e("currentPosition", c));
            $.fn.carouFredSel.cookie.set(a, d)
        }
    }

    function cf_getCookie(a) {
        var b = $.fn.carouFredSel.cookie.get(a);
        return "" == b ? 0 : b
    }

    function in_mapCss(a, b) {
        for (var c = {}, d = 0, e = b.length; e > d; d++) c[b[d]] = a.css(b[d]);
        return c
    }

    function in_complementItems(a, b, c, d) {
        return is_object(a.visibleConf) || (a.visibleConf = {}), is_object(a.sizesConf) || (a.sizesConf = {}), 0 == a.start && is_number(d) && (a.start = d), is_object(a.visible) ? (a.visibleConf.min = a.visible.min, a.visibleConf.max = a.visible.max, a.visible = !1) : is_string(a.visible) ? ("variable" == a.visible ? a.visibleConf.variable = !0 : a.visibleConf.adjust = a.visible, a.visible = !1) : is_function(a.visible) && (a.visibleConf.adjust = a.visible, a.visible = !1), is_string(a.filter) || (a.filter = c.filter(":hidden").length > 0 ? ":visible" : "*"), a[b.d.width] || (b.responsive ? (debug(!0, "Set a " + b.d.width + " for the items!"), a[b.d.width] = ms_getTrueLargestSize(c, b, "outerWidth")) : a[b.d.width] = ms_hasVariableSizes(c, b, "outerWidth") ? "variable" : c[b.d.outerWidth](!0)), a[b.d.height] || (a[b.d.height] = ms_hasVariableSizes(c, b, "outerHeight") ? "variable" : c[b.d.outerHeight](!0)), a.sizesConf.width = a.width, a.sizesConf.height = a.height, a
    }

    function in_complementVisibleItems(a, b) {
        return "variable" == a.items[a.d.width] && (a.items.visibleConf.variable = !0), a.items.visibleConf.variable || (is_number(a[a.d.width]) ? a.items.visible = Math.floor(a[a.d.width] / a.items[a.d.width]) : (a.items.visible = Math.floor(b / a.items[a.d.width]), a[a.d.width] = a.items.visible * a.items[a.d.width], a.items.visibleConf.adjust || (a.align = !1)), ("Infinity" == a.items.visible || 1 > a.items.visible) && (debug(!0, 'Not a valid number of visible items: Set to "variable".'), a.items.visibleConf.variable = !0)), a
    }

    function in_complementPrimarySize(a, b, c) {
        return "auto" == a && (a = ms_getTrueLargestSize(c, b, "outerWidth")), a
    }

    function in_complementSecondarySize(a, b, c) {
        return "auto" == a && (a = ms_getTrueLargestSize(c, b, "outerHeight")), a || (a = b.items[b.d.height]), a
    }

    function in_getAlignPadding(a, b) {
        var c = cf_getAlignPadding(gi_getCurrentItems(b, a), a);
        return a.padding[a.d[1]] = c[1], a.padding[a.d[3]] = c[0], a
    }

    function in_getResponsiveValues(a, b) {
        var d = cf_getItemAdjustMinMax(Math.ceil(a[a.d.width] / a.items[a.d.width]), a.items.visibleConf);
        d > b.length && (d = b.length);
        var e = Math.floor(a[a.d.width] / d);
        return a.items.visible = d, a.items[a.d.width] = e, a[a.d.width] = d * e, a
    }

    function bt_pauseOnHoverConfig(a) {
        if (is_string(a)) var b = a.indexOf("immediate") > -1 ? !0 : !1,
            c = a.indexOf("resume") > -1 ? !0 : !1;
        else var b = c = !1;
        return [b, c]
    }

    function bt_mousesheelNumber(a) {
        return is_number(a) ? a : null
    }

    function is_null(a) {
        return null === a
    }

    function is_undefined(a) {
        return is_null(a) || a === void 0 || "" === a || "undefined" === a
    }

    function is_array(a) {
        return a instanceof Array
    }

    function is_jquery(a) {
        return a instanceof jQuery
    }

    function is_object(a) {
        return (a instanceof Object || "object" == typeof a) && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a)
    }

    function is_number(a) {
        return (a instanceof Number || "number" == typeof a) && !isNaN(a)
    }

    function is_string(a) {
        return (a instanceof String || "string" == typeof a) && !is_undefined(a) && !is_true(a) && !is_false(a)
    }

    function is_function(a) {
        return a instanceof Function || "function" == typeof a
    }

    function is_boolean(a) {
        return a instanceof Boolean || "boolean" == typeof a || is_true(a) || is_false(a)
    }

    function is_true(a) {
        return a === !0 || "true" === a
    }

    function is_false(a) {
        return a === !1 || "false" === a
    }

    function is_percentage(a) {
        return is_string(a) && "%" == a.slice(-1)
    }

    function getTime() {
        return (new Date).getTime()
    }

    function deprecated(a, b) {
        debug(!0, a + " is DEPRECATED, support for it will be removed. Use " + b + " instead.")
    }

    function debug(a, b) {
        if (!is_undefined(window.console) && !is_undefined(window.console.log)) {
            if (is_object(a)) {
                var c = " (" + a.selector + ")";
                a = a.debug
            } else var c = "";
            if (!a) return !1;
            b = is_string(b) ? "carouFredSel" + c + ": " + b : ["carouFredSel" + c + ":", b], window.console.log(b)
        }
        return !1
    }
    $.fn.carouFredSel || ($.fn.caroufredsel = $.fn.carouFredSel = function(options, configs) {
        if (0 == this.length) return debug(!0, 'No element found for "' + this.selector + '".'), this;
        if (this.length > 1) return this.each(function() {
            $(this).carouFredSel(options, configs)
        });
        var $cfs = this,
            $tt0 = this[0],
            starting_position = !1;
        $cfs.data("_cfs_isCarousel") && (starting_position = $cfs.triggerHandler("_cfs_triggerEvent", "currentPosition"), $cfs.trigger("_cfs_triggerEvent", ["destroy", !0]));
        var FN = {};
        FN._init = function(a, b, c) {
            a = go_getObject($tt0, a), a.items = go_getItemsObject($tt0, a.items), a.scroll = go_getScrollObject($tt0, a.scroll), a.auto = go_getAutoObject($tt0, a.auto), a.prev = go_getPrevNextObject($tt0, a.prev), a.next = go_getPrevNextObject($tt0, a.next), a.pagination = go_getPaginationObject($tt0, a.pagination), a.swipe = go_getSwipeObject($tt0, a.swipe), a.mousewheel = go_getMousewheelObject($tt0, a.mousewheel), b && (opts_orig = $.extend(!0, {}, $.fn.carouFredSel.defaults, a)), opts = $.extend(!0, {}, $.fn.carouFredSel.defaults, a), opts.d = cf_getDimensions(opts), crsl.direction = "up" == opts.direction || "left" == opts.direction ? "next" : "prev";
            var d = $cfs.children(),
                e = ms_getParentSize($wrp, opts, "width");
            if (is_true(opts.cookie) && (opts.cookie = "caroufredsel_cookie_" + conf.serialNumber), opts.maxDimension = ms_getMaxDimension(opts, e), opts.items = in_complementItems(opts.items, opts, d, c), opts[opts.d.width] = in_complementPrimarySize(opts[opts.d.width], opts, d), opts[opts.d.height] = in_complementSecondarySize(opts[opts.d.height], opts, d), opts.responsive && (is_percentage(opts[opts.d.width]) || (opts[opts.d.width] = "100%")), is_percentage(opts[opts.d.width]) && (crsl.upDateOnWindowResize = !0, crsl.primarySizePercentage = opts[opts.d.width], opts[opts.d.width] = ms_getPercentage(e, crsl.primarySizePercentage), opts.items.visible || (opts.items.visibleConf.variable = !0)), opts.responsive ? (opts.usePadding = !1, opts.padding = [0, 0, 0, 0], opts.align = !1, opts.items.visibleConf.variable = !1) : (opts.items.visible || (opts = in_complementVisibleItems(opts, e)), opts[opts.d.width] || (!opts.items.visibleConf.variable && is_number(opts.items[opts.d.width]) && "*" == opts.items.filter ? (opts[opts.d.width] = opts.items.visible * opts.items[opts.d.width], opts.align = !1) : opts[opts.d.width] = "variable"), is_undefined(opts.align) && (opts.align = is_number(opts[opts.d.width]) ? "center" : !1), opts.items.visibleConf.variable && (opts.items.visible = gn_getVisibleItemsNext(d, opts, 0))), "*" == opts.items.filter || opts.items.visibleConf.variable || (opts.items.visibleConf.org = opts.items.visible, opts.items.visible = gn_getVisibleItemsNextFilter(d, opts, 0)), opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts.responsive) opts.items.visibleConf.min || (opts.items.visibleConf.min = opts.items.visible), opts.items.visibleConf.max || (opts.items.visibleConf.max = opts.items.visible), opts = in_getResponsiveValues(opts, d, e);
            else switch (opts.padding = cf_getPadding(opts.padding), "top" == opts.align ? opts.align = "left" : "bottom" == opts.align && (opts.align = "right"), opts.align) {
                case "center":
                case "left":
                case "right":
                    "variable" != opts[opts.d.width] && (opts = in_getAlignPadding(opts, d), opts.usePadding = !0);
                    break;
                default:
                    opts.align = !1, opts.usePadding = 0 == opts.padding[0] && 0 == opts.padding[1] && 0 == opts.padding[2] && 0 == opts.padding[3] ? !1 : !0
            }
            is_number(opts.scroll.duration) || (opts.scroll.duration = 500), is_undefined(opts.scroll.items) && (opts.scroll.items = opts.responsive || opts.items.visibleConf.variable || "*" != opts.items.filter ? "visible" : opts.items.visible), opts.auto = $.extend(!0, {}, opts.scroll, opts.auto), opts.prev = $.extend(!0, {}, opts.scroll, opts.prev), opts.next = $.extend(!0, {}, opts.scroll, opts.next), opts.pagination = $.extend(!0, {}, opts.scroll, opts.pagination), opts.auto = go_complementAutoObject($tt0, opts.auto), opts.prev = go_complementPrevNextObject($tt0, opts.prev), opts.next = go_complementPrevNextObject($tt0, opts.next), opts.pagination = go_complementPaginationObject($tt0, opts.pagination), opts.swipe = go_complementSwipeObject($tt0, opts.swipe), opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel), opts.synchronise && (opts.synchronise = cf_getSynchArr(opts.synchronise)), opts.auto.onPauseStart && (opts.auto.onTimeoutStart = opts.auto.onPauseStart, deprecated("auto.onPauseStart", "auto.onTimeoutStart")), opts.auto.onPausePause && (opts.auto.onTimeoutPause = opts.auto.onPausePause, deprecated("auto.onPausePause", "auto.onTimeoutPause")), opts.auto.onPauseEnd && (opts.auto.onTimeoutEnd = opts.auto.onPauseEnd, deprecated("auto.onPauseEnd", "auto.onTimeoutEnd")), opts.auto.pauseDuration && (opts.auto.timeoutDuration = opts.auto.pauseDuration, deprecated("auto.pauseDuration", "auto.timeoutDuration"))
        }, FN._build = function() {
            $cfs.data("_cfs_isCarousel", !0);
            var a = $cfs.children(),
                b = in_mapCss($cfs, ["textAlign", "float", "position", "top", "right", "bottom", "left", "zIndex", "width", "height", "marginTop", "marginRight", "marginBottom", "marginLeft"]),
                c = "relative";
            switch (b.position) {
                case "absolute":
                case "fixed":
                    c = b.position
            }
            "parent" == conf.wrapper ? sz_storeOrigCss($wrp) : $wrp.css(b), $wrp.css({
                overflow: "hidden",
                position: c
            }), sz_storeOrigCss($cfs), $cfs.data("_cfs_origCssZindex", b.zIndex), $cfs.css({
                textAlign: "left",
                "float": "none",
                position: "absolute",
                top: 0,
                right: "auto",
                bottom: "auto",
                left: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0
            }), sz_storeMargin(a, opts), sz_storeOrigCss(a), opts.responsive && sz_setResponsiveSizes(opts, a)
        }, FN._bind_events = function() {
            FN._unbind_events(), $cfs.bind(cf_e("stop", conf), function(a, b) {
                return a.stopPropagation(), crsl.isStopped || opts.auto.button && opts.auto.button.addClass(cf_c("stopped", conf)), crsl.isStopped = !0, opts.auto.play && (opts.auto.play = !1, $cfs.trigger(cf_e("pause", conf), b)), !0
            }), $cfs.bind(cf_e("finish", conf), function(a) {
                return a.stopPropagation(), crsl.isScrolling && sc_stopScroll(scrl), !0
            }), $cfs.bind(cf_e("pause", conf), function(a, b, c) {
                if (a.stopPropagation(), tmrs = sc_clearTimers(tmrs), b && crsl.isScrolling) {
                    scrl.isStopped = !0;
                    var d = getTime() - scrl.startTime;
                    scrl.duration -= d, scrl.pre && (scrl.pre.duration -= d), scrl.post && (scrl.post.duration -= d), sc_stopScroll(scrl, !1)
                }
                if (crsl.isPaused || crsl.isScrolling || c && (tmrs.timePassed += getTime() - tmrs.startTime), crsl.isPaused || opts.auto.button && opts.auto.button.addClass(cf_c("paused", conf)), crsl.isPaused = !0, opts.auto.onTimeoutPause) {
                    var e = opts.auto.timeoutDuration - tmrs.timePassed,
                        f = 100 - Math.ceil(100 * e / opts.auto.timeoutDuration);
                    opts.auto.onTimeoutPause.call($tt0, f, e)
                }
                return !0
            }), $cfs.bind(cf_e("play", conf), function(a, b, c, d) {
                a.stopPropagation(), tmrs = sc_clearTimers(tmrs);
                var e = [b, c, d],
                    f = ["string", "number", "boolean"],
                    g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], "prev" != b && "next" != b && (b = crsl.direction), is_number(c) || (c = 0), is_boolean(d) || (d = !1), d && (crsl.isStopped = !1, opts.auto.play = !0), !opts.auto.play) return a.stopImmediatePropagation(), debug(conf, "Carousel stopped: Not scrolling.");
                crsl.isPaused && opts.auto.button && (opts.auto.button.removeClass(cf_c("stopped", conf)), opts.auto.button.removeClass(cf_c("paused", conf))), crsl.isPaused = !1, tmrs.startTime = getTime();
                var h = opts.auto.timeoutDuration + c;
                return dur2 = h - tmrs.timePassed, perc = 100 - Math.ceil(100 * dur2 / h), opts.auto.progress && (tmrs.progress = setInterval(function() {
                    var a = getTime() - tmrs.startTime + tmrs.timePassed,
                        b = Math.ceil(100 * a / h);
                    opts.auto.progress.updater.call(opts.auto.progress.bar[0], b)
                }, opts.auto.progress.interval)), tmrs.auto = setTimeout(function() {
                    opts.auto.progress && opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100), opts.auto.onTimeoutEnd && opts.auto.onTimeoutEnd.call($tt0, perc, dur2), crsl.isScrolling ? $cfs.trigger(cf_e("play", conf), b) : $cfs.trigger(cf_e(b, conf), opts.auto)
                }, dur2), opts.auto.onTimeoutStart && opts.auto.onTimeoutStart.call($tt0, perc, dur2), !0
            }), $cfs.bind(cf_e("resume", conf), function(a) {
                return a.stopPropagation(), scrl.isStopped ? (scrl.isStopped = !1, crsl.isPaused = !1, crsl.isScrolling = !0, scrl.startTime = getTime(), sc_startScroll(scrl, conf)) : $cfs.trigger(cf_e("play", conf)), !0
            }), $cfs.bind(cf_e("prev", conf) + " " + cf_e("next", conf), function(a, b, c, d, e) {
                if (a.stopPropagation(), crsl.isStopped || $cfs.is(":hidden")) return a.stopImmediatePropagation(), debug(conf, "Carousel stopped or hidden: Not scrolling.");
                var f = is_number(opts.items.minimum) ? opts.items.minimum : opts.items.visible + 1;
                if (f > itms.total) return a.stopImmediatePropagation(), debug(conf, "Not enough items (" + itms.total + " total, " + f + " needed): Not scrolling.");
                var g = [b, c, d, e],
                    h = ["object", "number/string", "function", "boolean"],
                    i = cf_sortParams(g, h);
                b = i[0], c = i[1], d = i[2], e = i[3];
                var j = a.type.slice(conf.events.prefix.length);
                if (is_object(b) || (b = {}), is_function(d) && (b.onAfter = d), is_boolean(e) && (b.queue = e), b = $.extend(!0, {}, opts[j], b), b.conditions && !b.conditions.call($tt0, j)) return a.stopImmediatePropagation(), debug(conf, 'Callback "conditions" returned false.');
                if (!is_number(c)) {
                    if ("*" != opts.items.filter) c = "visible";
                    else
                        for (var k = [c, b.items, opts[j].items], i = 0, l = k.length; l > i; i++)
                            if (is_number(k[i]) || "page" == k[i] || "visible" == k[i]) {
                                c = k[i];
                                break
                            } switch (c) {
                        case "page":
                            return a.stopImmediatePropagation(), $cfs.triggerHandler(cf_e(j + "Page", conf), [b, d]);
                        case "visible":
                            opts.items.visibleConf.variable || "*" != opts.items.filter || (c = opts.items.visible)
                    }
                }
                if (scrl.isStopped) return $cfs.trigger(cf_e("resume", conf)), $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]]), a.stopImmediatePropagation(), debug(conf, "Carousel resumed scrolling.");
                if (b.duration > 0 && crsl.isScrolling) return b.queue && ("last" == b.queue && (queu = []), ("first" != b.queue || 0 == queu.length) && $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]])), a.stopImmediatePropagation(), debug(conf, "Carousel currently scrolling.");
                if (tmrs.timePassed = 0, $cfs.trigger(cf_e("slide_" + j, conf), [b, c]), opts.synchronise)
                    for (var m = opts.synchronise, n = [b, c], o = 0, l = m.length; l > o; o++) {
                        var p = j;
                        m[o][2] || (p = "prev" == p ? "next" : "prev"), m[o][1] || (n[0] = m[o][0].triggerHandler("_cfs_triggerEvent", ["configuration", p])), n[1] = c + m[o][3], m[o][0].trigger("_cfs_triggerEvent", ["slide_" + p, n])
                    }
                return !0
            }), $cfs.bind(cf_e("slide_prev", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && 0 == itms.first) return opts.infinite && $cfs.trigger(cf_e("next", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if (opts.items.visibleConf.variable) c = gn_getVisibleItemsPrev(d, opts, itms.total - 1);
                    else if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsPrevFilter(d, opts, itms.total - 1, e)
                    } else c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                if (opts.circular || itms.total - c < itms.first && (c = itms.total - itms.first), opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    var f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0);
                    f >= opts.items.visible + c && itms.total > c && (c++, f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0)), opts.items.visible = f
                } else if ("*" != opts.items.filter) {
                    var f = gn_getVisibleItemsNextFilter(d, opts, itms.total - c);
                    opts.items.visible = cf_getItemsAdjust(f, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c) return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items backward."), itms.first += c; itms.first >= itms.total;) itms.first -= itms.total;
                opts.circular || (0 == itms.first && b.onEnd && b.onEnd.call($tt0, "prev"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), $cfs.children().slice(itms.total - c, itms.total).prependTo($cfs), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(),
                    g = gi_getOldItemsPrev(d, opts, c),
                    h = gi_getNewItemsPrev(d, opts),
                    i = d.eq(c - 1),
                    j = g.last(),
                    k = h.last();
                sz_resetMargin(d, opts);
                var l = 0,
                    m = 0;
                if (opts.align) {
                    var n = cf_getAlignPadding(h, opts);
                    l = n[0], m = n[1]
                }
                var o = 0 > l ? opts.padding[opts.d[3]] : 0,
                    p = !1,
                    q = $();
                if (c > opts.items.visible && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, i = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1,
                    t = ms_getTotalSize(d.slice(0, c), opts, "width"),
                    u = cf_mapWrapperSizes(ms_getSizes(h, opts, !0), opts, !opts.usePadding),
                    v = 0,
                    w = {},
                    x = {},
                    y = {},
                    z = {},
                    A = {},
                    B = {},
                    C = {},
                    D = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case "cover":
                    case "cover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visible), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), sz_resetMargin(d, opts, !0), m >= 0 && sz_resetMargin(j, opts, opts.padding[opts.d[1]]), l >= 0 && sz_resetMargin(i, opts, opts.padding[opts.d[3]]), opts.align && (opts.padding[opts.d[1]] = m, opts.padding[opts.d[3]] = l), B[opts.d.left] = -(t - o), C[opts.d.left] = -(v - o), x[opts.d.left] = u[opts.d.width];
                var E = function() {},
                    F = function() {},
                    G = function() {},
                    H = function() {},
                    I = function() {},
                    J = function() {},
                    K = function() {},
                    L = function() {},
                    M = function() {},
                    N = function() {},
                    O = function() {};
                switch (b.fx) {
                    case "crossfade":
                    case "cover":
                    case "cover-fade":
                    case "uncover":
                    case "uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp)
                }
                switch (b.fx) {
                    case "crossfade":
                    case "uncover":
                    case "uncover-fade":
                        s.children().slice(0, c).remove(), s.children().slice(opts.items.visibleConf.old).remove();
                        break;
                    case "cover":
                    case "cover-fade":
                        s.children().slice(opts.items.visible).remove(), s.css(C)
                }
                if ($cfs.css(B), scrl = sc_setScroll(D, b.easing, conf), w[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0, ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (E = function() {
                        $wrp.css(u)
                    }, F = function() {
                        scrl.anims.push([$wrp, u])
                    }), opts.usePadding) {
                    switch (k.not(i).length && (y[opts.d.marginRight] = i.data("_cfs_origCssMargin"), 0 > l ? i.css(y) : (K = function() {
                        i.css(y)
                    }, L = function() {
                        scrl.anims.push([i, y])
                    })), b.fx) {
                        case "cover":
                        case "cover-fade":
                            s.children().eq(c - 1).css(y)
                    }
                    k.not(j).length && (z[opts.d.marginRight] = j.data("_cfs_origCssMargin"), G = function() {
                        j.css(z)
                    }, H = function() {
                        scrl.anims.push([j, z])
                    }), m >= 0 && (A[opts.d.marginRight] = k.data("_cfs_origCssMargin") + opts.padding[opts.d[1]], I = function() {
                        k.css(A)
                    }, J = function() {
                        scrl.anims.push([k, A])
                    })
                }
                O = function() {
                    $cfs.css(w)
                };
                var P = opts.items.visible + c - itms.total;
                N = function() {
                    if (P > 0 && ($cfs.children().slice(itms.total).remove(), g = $($cfs.children().slice(itms.total - (opts.items.visible - P)).get().concat($cfs.children().slice(0, P).get()))), sc_showHiddenItems(p), opts.usePadding) {
                        var a = $cfs.children().eq(opts.items.visible + c - 1);
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var Q = sc_mapCallbackArguments(g, q, h, c, "prev", D, u);
                switch (M = function() {
                    sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", Q, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", Q, clbk), b.fx) {
                    case "none":
                        $cfs.css(w), E(), G(), I(), K(), O(), N(), M();
                        break;
                    case "fade":
                        scrl.anims.push([$cfs, {
                            opacity: 0
                        }, function() {
                            E(), G(), I(), K(), O(), N(), scrl = sc_setScroll(D, b.easing, conf), scrl.anims.push([$cfs, {
                                opacity: 1
                            }, M]), sc_startScroll(scrl, conf)
                        }]);
                        break;
                    case "crossfade":
                        $cfs.css({
                            opacity: 0
                        }), scrl.anims.push([s, {
                            opacity: 0
                        }]), scrl.anims.push([$cfs, {
                            opacity: 1
                        }, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case "cover":
                        scrl.anims.push([s, w, function() {
                            G(), I(), K(), O(), N(), M()
                        }]), F();
                        break;
                    case "cover-fade":
                        scrl.anims.push([$cfs, {
                            opacity: 0
                        }]), scrl.anims.push([s, w, function() {
                            G(), I(), K(), O(), N(), M()
                        }]), F();
                        break;
                    case "uncover":
                        scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    case "uncover-fade":
                        $cfs.css({
                            opacity: 0
                        }), scrl.anims.push([$cfs, {
                            opacity: 1
                        }]), scrl.anims.push([s, x, M]), F(), G(), I(), K(), O(), N();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                            N(), M()
                        }]), F(), H(), J(), L()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slide_next", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && itms.first == opts.items.visible) return opts.infinite && $cfs.trigger(cf_e("prev", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsNextFilter(d, opts, 0, e)
                    } else c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                var f = 0 == itms.first ? itms.total : itms.first;
                if (!opts.circular) {
                    if (opts.items.visibleConf.variable) var g = gn_getVisibleItemsNext(d, opts, c),
                        e = gn_getVisibleItemsPrev(d, opts, f - 1);
                    else var g = opts.items.visible,
                        e = opts.items.visible;
                    c + g > f && (c = f - e)
                }
                if (opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    for (var g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0); opts.items.visible - c >= g && itms.total > c;) c++, g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0);
                    opts.items.visible = g
                } else if ("*" != opts.items.filter) {
                    var g = gn_getVisibleItemsNextFilter(d, opts, c);
                    opts.items.visible = cf_getItemsAdjust(g, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c) return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items forward."), itms.first -= c; 0 > itms.first;) itms.first += itms.total;
                opts.circular || (itms.first == opts.items.visible && b.onEnd && b.onEnd.call($tt0, "next"), opts.infinite || nv_enableNavi(opts, itms.first, conf)), itms.total < opts.items.visible + c && $cfs.children().slice(0, opts.items.visible + c - itms.total).clone(!0).appendTo($cfs);
                var d = $cfs.children(),
                    h = gi_getOldItemsNext(d, opts),
                    i = gi_getNewItemsNext(d, opts, c),
                    j = d.eq(c - 1),
                    k = h.last(),
                    l = i.last();
                sz_resetMargin(d, opts);
                var m = 0,
                    n = 0;
                if (opts.align) {
                    var o = cf_getAlignPadding(i, opts);
                    m = o[0], n = o[1]
                }
                var p = !1,
                    q = $();
                if (c > opts.items.visibleConf.old && (q = d.slice(opts.items.visibleConf.old, c), "directscroll" == b.fx)) {
                    var r = opts.items[opts.d.width];
                    p = q, j = k, sc_hideHiddenItems(p), opts.items[opts.d.width] = "variable"
                }
                var s = !1,
                    t = ms_getTotalSize(d.slice(0, c), opts, "width"),
                    u = cf_mapWrapperSizes(ms_getSizes(i, opts, !0), opts, !opts.usePadding),
                    v = 0,
                    w = {},
                    x = {},
                    y = {},
                    z = {},
                    A = {},
                    B = sc_getDuration(b, opts, c, t);
                switch (b.fx) {
                    case "uncover":
                    case "uncover-fade":
                        v = ms_getTotalSize(d.slice(0, opts.items.visibleConf.old), opts, "width")
                }
                p && (opts.items[opts.d.width] = r), opts.align && 0 > opts.padding[opts.d[1]] && (opts.padding[opts.d[1]] = 0), sz_resetMargin(d, opts, !0), sz_resetMargin(k, opts, opts.padding[opts.d[1]]), opts.align && (opts.padding[opts.d[1]] = n, opts.padding[opts.d[3]] = m), A[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0;
                var C = function() {},
                    D = function() {},
                    E = function() {},
                    F = function() {},
                    G = function() {},
                    H = function() {},
                    I = function() {},
                    J = function() {},
                    K = function() {};
                switch (b.fx) {
                    case "crossfade":
                    case "cover":
                    case "cover-fade":
                    case "uncover":
                    case "uncover-fade":
                        s = $cfs.clone(!0).appendTo($wrp), s.children().slice(opts.items.visibleConf.old).remove()
                }
                switch (b.fx) {
                    case "crossfade":
                    case "cover":
                    case "cover-fade":
                        $cfs.css("zIndex", 1), s.css("zIndex", 0)
                }
                if (scrl = sc_setScroll(B, b.easing, conf), w[opts.d.left] = -t, x[opts.d.left] = -v, 0 > m && (w[opts.d.left] += m), ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (C = function() {
                        $wrp.css(u)
                    }, D = function() {
                        scrl.anims.push([$wrp, u])
                    }), opts.usePadding) {
                    var L = l.data("_cfs_origCssMargin");
                    n >= 0 && (L += opts.padding[opts.d[1]]), l.css(opts.d.marginRight, L), j.not(k).length && (z[opts.d.marginRight] = k.data("_cfs_origCssMargin")), E = function() {
                        k.css(z)
                    }, F = function() {
                        scrl.anims.push([k, z])
                    };
                    var M = j.data("_cfs_origCssMargin");
                    m > 0 && (M += opts.padding[opts.d[3]]), y[opts.d.marginRight] = M, G = function() {
                        j.css(y)
                    }, H = function() {
                        scrl.anims.push([j, y])
                    }
                }
                K = function() {
                    $cfs.css(A)
                };
                var N = opts.items.visible + c - itms.total;
                J = function() {
                    N > 0 && $cfs.children().slice(itms.total).remove();
                    var a = $cfs.children().slice(0, c).appendTo($cfs).last();
                    if (N > 0 && (i = gi_getCurrentItems(d, opts)), sc_showHiddenItems(p), opts.usePadding) {
                        if (itms.total < opts.items.visible + c) {
                            var b = $cfs.children().eq(opts.items.visible - 1);
                            b.css(opts.d.marginRight, b.data("_cfs_origCssMargin") + opts.padding[opts.d[1]])
                        }
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var O = sc_mapCallbackArguments(h, q, i, c, "next", B, u);
                switch (I = function() {
                    $cfs.css("zIndex", $cfs.data("_cfs_origCssZindex")), sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", O, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", O, clbk), b.fx) {
                    case "none":
                        $cfs.css(w), C(), E(), G(), K(), J(), I();
                        break;
                    case "fade":
                        scrl.anims.push([$cfs, {
                            opacity: 0
                        }, function() {
                            C(), E(), G(), K(), J(), scrl = sc_setScroll(B, b.easing, conf), scrl.anims.push([$cfs, {
                                opacity: 1
                            }, I]), sc_startScroll(scrl, conf)
                        }]);
                        break;
                    case "crossfade":
                        $cfs.css({
                            opacity: 0
                        }), scrl.anims.push([s, {
                            opacity: 0
                        }]), scrl.anims.push([$cfs, {
                            opacity: 1
                        }, I]), D(), E(), G(), K(), J();
                        break;
                    case "cover":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case "cover-fade":
                        $cfs.css(opts.d.left, $wrp[opts.d.width]()), scrl.anims.push([s, {
                            opacity: 0
                        }]), scrl.anims.push([$cfs, A, I]), D(), E(), G(), J();
                        break;
                    case "uncover":
                        scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    case "uncover-fade":
                        $cfs.css({
                            opacity: 0
                        }), scrl.anims.push([$cfs, {
                            opacity: 1
                        }]), scrl.anims.push([s, x, I]), D(), E(), G(), K(), J();
                        break;
                    default:
                        scrl.anims.push([$cfs, w, function() {
                            K(), J(), I()
                        }]), D(), F(), H()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slideTo", conf), function(a, b, c, d, e, f, g) {
                a.stopPropagation();
                var h = [b, c, d, e, f, g],
                    i = ["string/number/object", "number", "boolean", "object", "string", "function"],
                    j = cf_sortParams(h, i);
                return e = j[3], f = j[4], g = j[5], b = gn_getItemIndex(j[0], j[1], j[2], itms, $cfs), 0 == b ? !1 : (is_object(e) || (e = !1), "prev" != f && "next" != f && (f = opts.circular ? itms.total / 2 >= b ? "next" : "prev" : 0 == itms.first || itms.first > b ? "next" : "prev"), "prev" == f && (b = itms.total - b), $cfs.trigger(cf_e(f, conf), [e, b, g]), !0)
            }), $cfs.bind(cf_e("prevPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d - 1, b, "prev", c])
            }), $cfs.bind(cf_e("nextPage", conf), function(a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d + 1, b, "next", c])
            }), $cfs.bind(cf_e("slideToPage", conf), function(a, b, c, d, e) {
                a.stopPropagation(), is_number(b) || (b = $cfs.triggerHandler(cf_e("currentPage", conf)));
                var f = opts.pagination.items || opts.items.visible,
                    g = Math.ceil(itms.total / f) - 1;
                return 0 > b && (b = g), b > g && (b = 0), $cfs.triggerHandler(cf_e("slideTo", conf), [b * f, 0, !0, c, d, e])
            }), $cfs.bind(cf_e("jumpToStart", conf), function(a, b) {
                if (a.stopPropagation(), b = b ? gn_getItemIndex(b, 0, !0, itms, $cfs) : 0, b += itms.first, 0 != b) {
                    if (itms.total > 0)
                        for (; b > itms.total;) b -= itms.total;
                    $cfs.prepend($cfs.children().slice(b, itms.total))
                }
                return !0
            }), $cfs.bind(cf_e("synchronise", conf), function(a, b) {
                if (a.stopPropagation(), b) b = cf_getSynchArr(b);
                else {
                    if (!opts.synchronise) return debug(conf, "No carousel to synchronise.");
                    b = opts.synchronise
                }
                for (var c = $cfs.triggerHandler(cf_e("currentPosition", conf)), d = !0, e = 0, f = b.length; f > e; e++) b[e][0].triggerHandler(cf_e("slideTo", conf), [c, b[e][3], !0]) || (d = !1);
                return d
            }), $cfs.bind(cf_e("queue", conf), function(a, b, c) {
                return a.stopPropagation(), is_function(b) ? b.call($tt0, queu) : is_array(b) ? queu = b : is_undefined(b) || queu.push([b, c]), queu
            }), $cfs.bind(cf_e("insertItem", conf), function(a, b, c, d, e) {
                a.stopPropagation();
                var f = [b, c, d, e],
                    g = ["string/object", "string/number/object", "boolean", "number"],
                    h = cf_sortParams(f, g);
                if (b = h[0], c = h[1], d = h[2], e = h[3], is_object(b) && !is_jquery(b) ? b = $(b) : is_string(b) && (b = $(b)), !is_jquery(b) || 0 == b.length) return debug(conf, "Not a valid object.");
                is_undefined(c) && (c = "end"), sz_storeMargin(b, opts), sz_storeOrigCss(b);
                var i = c,
                    j = "before";
                "end" == c ? d ? (0 == itms.first ? (c = itms.total - 1, j = "after") : (c = itms.first, itms.first += b.length), 0 > c && (c = 0)) : (c = itms.total - 1, j = "after") : c = gn_getItemIndex(c, e, d, itms, $cfs);
                var k = $cfs.children().eq(c);
                return k.length ? k[j](b) : (debug(conf, "Correct insert-position not found! Appending item to the end."), $cfs.append(b)), "end" == i || d || itms.first > c && (itms.first += b.length), itms.total = $cfs.children().length, itms.first >= itms.total && (itms.first -= itms.total), $cfs.trigger(cf_e("updateSizes", conf)), $cfs.trigger(cf_e("linkAnchors", conf)), !0
            }), $cfs.bind(cf_e("removeItem", conf), function(a, b, c, d) {
                a.stopPropagation();
                var e = [b, c, d],
                    f = ["string/number/object", "boolean", "number"],
                    g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], b instanceof $ && b.length > 1) return i = $(), b.each(function() {
                    var e = $cfs.trigger(cf_e("removeItem", conf), [$(this), c, d]);
                    e && (i = i.add(e))
                }), i;
                if (is_undefined(b) || "end" == b) i = $cfs.children().last();
                else {
                    b = gn_getItemIndex(b, d, c, itms, $cfs);
                    var i = $cfs.children().eq(b);
                    i.length && itms.first > b && (itms.first -= i.length)
                }
                return i && i.length && (i.detach(), itms.total = $cfs.children().length, $cfs.trigger(cf_e("updateSizes", conf))), i
            }), $cfs.bind(cf_e("onBefore", conf) + " " + cf_e("onAfter", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length);
                return is_array(b) && (clbk[c] = b), is_function(b) && clbk[c].push(b), clbk[c]
            }), $cfs.bind(cf_e("currentPosition", conf), function(a, b) {
                if (a.stopPropagation(), 0 == itms.first) var c = 0;
                else var c = itms.total - itms.first;
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("currentPage", conf), function(a, b) {
                a.stopPropagation();
                var e, c = opts.pagination.items || opts.items.visible,
                    d = Math.ceil(itms.total / c - 1);
                return e = 0 == itms.first ? 0 : itms.first < itms.total % c ? 0 : itms.first != c || opts.circular ? Math.round((itms.total - itms.first) / c) : d, 0 > e && (e = 0), e > d && (e = d), is_function(b) && b.call($tt0, e), e
            }), $cfs.bind(cf_e("currentVisible", conf), function(a, b) {
                a.stopPropagation();
                var c = gi_getCurrentItems($cfs.children(), opts);
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("slice", conf), function(a, b, c, d) {
                if (a.stopPropagation(), 0 == itms.total) return !1;
                var e = [b, c, d],
                    f = ["number", "number", "function"],
                    g = cf_sortParams(e, f);
                if (b = is_number(g[0]) ? g[0] : 0, c = is_number(g[1]) ? g[1] : itms.total, d = g[2], b += itms.first, c += itms.first, itms.total > 0) {
                    for (; b > itms.total;) b -= itms.total;
                    for (; c > itms.total;) c -= itms.total;
                    for (; 0 > b;) b += itms.total;
                    for (; 0 > c;) c += itms.total
                }
                var i, h = $cfs.children();
                return i = c > b ? h.slice(b, c) : $(h.slice(b, itms.total).get().concat(h.slice(0, c).get())), is_function(d) && d.call($tt0, i), i
            }), $cfs.bind(cf_e("isPaused", conf) + " " + cf_e("isStopped", conf) + " " + cf_e("isScrolling", conf), function(a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length),
                    d = crsl[c];
                return is_function(b) && b.call($tt0, d), d
            }), $cfs.bind(cf_e("configuration", conf), function(e, a, b, c) {
                e.stopPropagation();
                var reInit = !1;
                if (is_function(a)) a.call($tt0, opts);
                else if (is_object(a)) opts_orig = $.extend(!0, {}, opts_orig, a), b !== !1 ? reInit = !0 : opts = $.extend(!0, {}, opts, a);
                else if (!is_undefined(a))
                    if (is_function(b)) {
                        var val = eval("opts." + a);
                        is_undefined(val) && (val = ""), b.call($tt0, val)
                    } else {
                        if (is_undefined(b)) return eval("opts." + a);
                        "boolean" != typeof c && (c = !0), eval("opts_orig." + a + " = b"), c !== !1 ? reInit = !0 : eval("opts." + a + " = b")
                    }
                if (reInit) {
                    sz_resetMargin($cfs.children(), opts), FN._init(opts_orig), FN._bind_buttons();
                    var sz = sz_setSizes($cfs, opts);
                    $cfs.trigger(cf_e("updatePageStatus", conf), [!0, sz])
                }
                return opts
            }), $cfs.bind(cf_e("linkAnchors", conf), function(a, b, c) {
                return a.stopPropagation(), is_undefined(b) ? b = $("body") : is_string(b) && (b = $(b)), is_jquery(b) && 0 != b.length ? (is_string(c) || (c = "a.caroufredsel"), b.find(c).each(function() {
                    var a = this.hash || "";
                    a.length > 0 && -1 != $cfs.children().index($(a)) && $(this).unbind("click").click(function(b) {
                        b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), a)
                    })
                }), !0) : debug(conf, "Not a valid object.")
            }), $cfs.bind(cf_e("updatePageStatus", conf), function(a, b) {
                if (a.stopPropagation(), opts.pagination.container) {
                    var d = opts.pagination.items || opts.items.visible,
                        e = Math.ceil(itms.total / d);
                    b && (opts.pagination.anchorBuilder && (opts.pagination.container.children().remove(), opts.pagination.container.each(function() {
                        for (var a = 0; e > a; a++) {
                            var b = $cfs.children().eq(gn_getItemIndex(a * d, 0, !0, itms, $cfs));
                            $(this).append(opts.pagination.anchorBuilder.call(b[0], a + 1))
                        }
                    })), opts.pagination.container.each(function() {
                        $(this).children().unbind(opts.pagination.event).each(function(a) {
                            $(this).bind(opts.pagination.event, function(b) {
                                b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [a * d, -opts.pagination.deviation, !0, opts.pagination])
                            })
                        })
                    }));
                    var f = $cfs.triggerHandler(cf_e("currentPage", conf)) + opts.pagination.deviation;
                    return f >= e && (f = 0), 0 > f && (f = e - 1), opts.pagination.container.each(function() {
                        $(this).children().removeClass(cf_c("selected", conf)).eq(f).addClass(cf_c("selected", conf))
                    }), !0
                }
            }), $cfs.bind(cf_e("updateSizes", conf), function() {
                var b = opts.items.visible,
                    c = $cfs.children(),
                    d = ms_getParentSize($wrp, opts, "width");
                if (itms.total = c.length, crsl.primarySizePercentage ? (opts.maxDimension = d, opts[opts.d.width] = ms_getPercentage(d, crsl.primarySizePercentage)) : opts.maxDimension = ms_getMaxDimension(opts, d), opts.responsive ? (opts.items.width = opts.items.sizesConf.width, opts.items.height = opts.items.sizesConf.height, opts = in_getResponsiveValues(opts, c, d), b = opts.items.visible, sz_setResponsiveSizes(opts, c)) : opts.items.visibleConf.variable ? b = gn_getVisibleItemsNext(c, opts, 0) : "*" != opts.items.filter && (b = gn_getVisibleItemsNextFilter(c, opts, 0)), !opts.circular && 0 != itms.first && b > itms.first) {
                    if (opts.items.visibleConf.variable) var e = gn_getVisibleItemsPrev(c, opts, itms.first) - itms.first;
                    else if ("*" != opts.items.filter) var e = gn_getVisibleItemsPrevFilter(c, opts, itms.first) - itms.first;
                    else var e = opts.items.visible - itms.first;
                    debug(conf, "Preventing non-circular: sliding " + e + " items backward."), $cfs.trigger(cf_e("prev", conf), e)
                }
                opts.items.visible = cf_getItemsAdjust(b, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts = in_getAlignPadding(opts, c);
                var f = sz_setSizes($cfs, opts);
                return $cfs.trigger(cf_e("updatePageStatus", conf), [!0, f]), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), f
            }), $cfs.bind(cf_e("destroy", conf), function(a, b) {
                return a.stopPropagation(), tmrs = sc_clearTimers(tmrs), $cfs.data("_cfs_isCarousel", !1), $cfs.trigger(cf_e("finish", conf)), b && $cfs.trigger(cf_e("jumpToStart", conf)), sz_restoreOrigCss($cfs.children()), sz_restoreOrigCss($cfs), FN._unbind_events(), FN._unbind_buttons(), "parent" == conf.wrapper ? sz_restoreOrigCss($wrp) : $wrp.replaceWith($cfs), !0
            }), $cfs.bind(cf_e("debug", conf), function() {
                return debug(conf, "Carousel width: " + opts.width), debug(conf, "Carousel height: " + opts.height), debug(conf, "Item widths: " + opts.items.width), debug(conf, "Item heights: " + opts.items.height), debug(conf, "Number of items visible: " + opts.items.visible), opts.auto.play && debug(conf, "Number of items scrolled automatically: " + opts.auto.items), opts.prev.button && debug(conf, "Number of items scrolled backward: " + opts.prev.items), opts.next.button && debug(conf, "Number of items scrolled forward: " + opts.next.items), conf.debug
            }), $cfs.bind("_cfs_triggerEvent", function(a, b, c) {
                return a.stopPropagation(), $cfs.triggerHandler(cf_e(b, conf), c)
            })
        }, FN._unbind_events = function() {
            $cfs.unbind(cf_e("", conf)), $cfs.unbind(cf_e("", conf, !1)), $cfs.unbind("_cfs_triggerEvent")
        }, FN._bind_buttons = function() {
            if (FN._unbind_buttons(), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), opts.auto.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
                $wrp.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.auto.button && opts.auto.button.bind(cf_e(opts.auto.event, conf, !1), function(a) {
                    a.preventDefault();
                    var b = !1,
                        c = null;
                    crsl.isPaused ? b = "play" : opts.auto.pauseOnEvent && (b = "pause", c = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)), b && $cfs.trigger(cf_e(b, conf), c)
                }), opts.prev.button && (opts.prev.button.bind(cf_e(opts.prev.event, conf, !1), function(a) {
                    a.preventDefault(), $cfs.trigger(cf_e("prev", conf))
                }), opts.prev.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
                opts.prev.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.next.button && (opts.next.button.bind(cf_e(opts.next.event, conf, !1), function(a) {
                    a.preventDefault(), $cfs.trigger(cf_e("next", conf))
                }), opts.next.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
                opts.next.button.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.pagination.container && opts.pagination.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
                opts.pagination.container.bind(cf_e("mouseenter", conf, !1), function() {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function() {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if ((opts.prev.key || opts.next.key) && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                    var b = a.keyCode;
                    b == opts.next.key && (a.preventDefault(), $cfs.trigger(cf_e("next", conf))), b == opts.prev.key && (a.preventDefault(), $cfs.trigger(cf_e("prev", conf)))
                }), opts.pagination.keys && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function(a) {
                    var b = a.keyCode;
                    b >= 49 && 58 > b && (b = (b - 49) * opts.items.visible, itms.total >= b && (a.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [b, 0, !0, opts.pagination])))
                }), $.fn.swipe) {
                var b = "ontouchstart" in window;
                if (b && opts.swipe.onTouch || !b && opts.swipe.onMouse) {
                    var c = $.extend(!0, {}, opts.prev, opts.swipe),
                        d = $.extend(!0, {}, opts.next, opts.swipe),
                        e = function() {
                            $cfs.trigger(cf_e("prev", conf), [c])
                        },
                        f = function() {
                            $cfs.trigger(cf_e("next", conf), [d])
                        };
                    switch (opts.direction) {
                        case "up":
                        case "down":
                            opts.swipe.options.swipeUp = f, opts.swipe.options.swipeDown = e;
                            break;
                        default:
                            opts.swipe.options.swipeLeft = f, opts.swipe.options.swipeRight = e
                    }
                    crsl.swipe && $cfs.swipe("destroy"), $wrp.swipe(opts.swipe.options), $wrp.css("cursor", "move"), crsl.swipe = !0
                }
            }
            if ($.fn.mousewheel && opts.mousewheel) {
                var g = $.extend(!0, {}, opts.prev, opts.mousewheel),
                    h = $.extend(!0, {}, opts.next, opts.mousewheel);
                crsl.mousewheel && $wrp.unbind(cf_e("mousewheel", conf, !1)), $wrp.bind(cf_e("mousewheel", conf, !1), function(a, b) {
                    a.preventDefault(), b > 0 ? $cfs.trigger(cf_e("prev", conf), [g]) : $cfs.trigger(cf_e("next", conf), [h])
                }), crsl.mousewheel = !0
            }
            if (opts.auto.play && $cfs.trigger(cf_e("play", conf), opts.auto.delay), crsl.upDateOnWindowResize) {
                var i = function() {
                        $cfs.trigger(cf_e("finish", conf)), opts.auto.pauseOnResize && !crsl.isPaused && $cfs.trigger(cf_e("play", conf)), sz_resetMargin($cfs.children(), opts), $cfs.trigger(cf_e("updateSizes", conf))
                    },
                    j = $(window),
                    k = null;
                if ($.debounce && "debounce" == conf.onWindowResize) k = $.debounce(200, i);
                else if ($.throttle && "throttle" == conf.onWindowResize) k = $.throttle(300, i);
                else {
                    var l = 0,
                        m = 0;
                    k = function() {
                        var a = j.width(),
                            b = j.height();
                        (a != l || b != m) && (i(), l = a, m = b)
                    }
                }
                j.bind(cf_e("resize", conf, !1, !0, !0), k)
            }
        }, FN._unbind_buttons = function() {
            var b = (cf_e("", conf), cf_e("", conf, !1));
            var ns3 = cf_e("", conf, !1, !0, !0);
            $(document).unbind(ns3), $(window).unbind(ns3), $wrp.unbind(b), opts.auto.button && opts.auto.button.unbind(b), opts.prev.button && opts.prev.button.unbind(b), opts.next.button && opts.next.button.unbind(b), opts.pagination.container && (opts.pagination.container.unbind(b), opts.pagination.anchorBuilder && opts.pagination.container.children().remove()), crsl.swipe && ($cfs.swipe("destroy"), $wrp.css("cursor", "default"), crsl.swipe = !1), crsl.mousewheel && (crsl.mousewheel = !1), nv_showNavi(opts, "hide", conf), nv_enableNavi(opts, "removeClass", conf)
        }, is_boolean(configs) && (configs = {
            debug: configs
        });
        var crsl = {
                direction: "next",
                isPaused: !0,
                isScrolling: !1,
                isStopped: !1,
                mousewheel: !1,
                swipe: !1
            },
            itms = {
                total: $cfs.children().length,
                first: 0
            },
            tmrs = {
                auto: null,
                progress: null,
                startTime: getTime(),
                timePassed: 0
            },
            scrl = {
                isStopped: !1,
                duration: 0,
                startTime: 0,
                easing: "",
                anims: []
            },
            clbk = {
                onBefore: [],
                onAfter: []
            },
            queu = [],
            conf = $.extend(!0, {}, $.fn.carouFredSel.configs, configs),
            opts = {},
            opts_orig = $.extend(!0, {}, options),
            $wrp = "parent" == conf.wrapper ? $cfs.parent() : $cfs.wrap("<" + conf.wrapper.element + ' class="' + conf.wrapper.classname + '" />').parent();
        if (conf.selector = $cfs.selector, conf.serialNumber = $.fn.carouFredSel.serialNumber++, conf.transition = conf.transition && $.fn.transition ? "transition" : "animate", FN._init(opts_orig, !0, starting_position), FN._build(), FN._bind_events(), FN._bind_buttons(), is_array(opts.items.start)) var start_arr = opts.items.start;
        else {
            var start_arr = [];
            0 != opts.items.start && start_arr.push(opts.items.start)
        }
        if (opts.cookie && start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10)), start_arr.length > 0)
            for (var a = 0, l = start_arr.length; l > a; a++) {
                var s = start_arr[a];
                if (0 != s) {
                    if (s === !0) {
                        if (s = window.location.hash, 1 > s.length) continue
                    } else "random" === s && (s = Math.floor(Math.random() * itms.total));
                    if ($cfs.triggerHandler(cf_e("slideTo", conf), [s, 0, !0, {
                            fx: "none"
                        }])) break
                }
            }
        var siz = sz_setSizes($cfs, opts),
            itm = gi_getCurrentItems($cfs.children(), opts);
        return opts.onCreate && opts.onCreate.call($tt0, {
            width: siz.width,
            height: siz.height,
            items: itm
        }), $cfs.trigger(cf_e("updatePageStatus", conf), [!0, siz]), $cfs.trigger(cf_e("linkAnchors", conf)), conf.debug && $cfs.trigger(cf_e("debug", conf)), $cfs
    }, $.fn.carouFredSel.serialNumber = 1, $.fn.carouFredSel.defaults = {
        synchronise: !1,
        infinite: !0,
        circular: !0,
        responsive: !1,
        direction: "left",
        items: {
            start: 0
        },
        scroll: {
            easing: "swing",
            duration: 500,
            pauseOnHover: !1,
            event: "click",
            queue: !1
        }
    }, $.fn.carouFredSel.configs = {
        debug: !1,
        transition: !1,
        onWindowResize: "throttle",
        events: {
            prefix: "",
            namespace: "cfs"
        },
        wrapper: {
            element: "div",
            classname: "caroufredsel_wrapper"
        },
        classnames: {}
    }, $.fn.carouFredSel.pageAnchorBuilder = function(a) {
        return '<a href="#"><span>' + a + "</span></a>"
    }, $.fn.carouFredSel.progressbarUpdater = function(a) {
        $(this).css("width", a + "%")
    }, $.fn.carouFredSel.cookie = {
        get: function(a) {
            a += "=";
            for (var b = document.cookie.split(";"), c = 0, d = b.length; d > c; c++) {
                for (var e = b[c];
                    " " == e.charAt(0);) e = e.slice(1);
                if (0 == e.indexOf(a)) return e.slice(a.length)
            }
            return 0
        },
        set: function(a, b, c) {
            var d = "";
            if (c) {
                var e = new Date;
                e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c), d = "; expires=" + e.toGMTString()
            }
            document.cookie = a + "=" + b + d + "; path=/"
        },
        remove: function(a) {
            $.fn.carouFredSel.cookie.set(a, "", -1)
        }
    }, $.extend($.easing, {
        quadratic: function(a) {
            var b = a * a;
            return a * (-b * a + 4 * b - 6 * a + 4)
        },
        cubic: function(a) {
            return a * (4 * a * a - 9 * a + 6)
        },
        elastic: function(a) {
            var b = a * a;
            return a * (33 * b * b - 106 * b * a + 126 * b - 67 * a + 15)
        }
    }))
})(jQuery);;
(function($) {
    $(function() {
        $('.gem-testimonials').each(function() {
            var $testimonialsElement = $(this);
            var $testimonials = $('.gem-testimonial-item', $testimonialsElement);
            var $testimonialsWrap = $('<div class="gem-testimonials-carousel-wrap"/>').appendTo($testimonialsElement);
            var $testimonialsCarousel = $('<div class="gem-testimonials-carousel"/>').appendTo($testimonialsWrap);
            if ($testimonialsElement.hasClass('fullwidth-block')) {
                $testimonialsCarousel.wrap('<div class="container" />');
            }
            var $testimonialsNavigation = $('<div class="gem-testimonials-navigation"/>').appendTo($testimonialsWrap);
            var $testimonialsPrev = $('<a href="javascript:void(0);" class="gem-prev gem-testimonials-prev"/></a>').appendTo($testimonialsNavigation);
            var $testimonialsNext = $('<a href="javascript:void(0);" class="gem-next gem-testimonials-next"/></a>').appendTo($testimonialsNavigation);
            $testimonials.appendTo($testimonialsCarousel);
        });
        $('body').updateTestimonialsCarousel();
        $('.fullwidth-block').each(function() {
            $(this).on('updateTestimonialsCarousel', function() {
                $(this).updateTestimonialsCarousel();
            });
        });
        $('.gem_tab').on('tab-update', function() {
            $(this).updateTestimonialsCarousel();
        });
        $('.gem_accordion_content').on('accordion-update', function() {
            $(this).updateTestimonialsCarousel();
        });
    });
    $.fn.updateTestimonialsCarousel = function() {
        $('.gem-testimonials', this).add($(this).filter('.gem-testimonials')).each(function() {
            var $testimonialsElement = $(this);
            var $testimonialsCarousel = $('.gem-testimonials-carousel', $testimonialsElement);
            var $testimonials = $('.gem-testimonial-item', $testimonialsCarousel);
            var $testimonialsPrev = $('.gem-testimonials-prev', $testimonialsElement);
            var $testimonialsNext = $('.gem-testimonials-next', $testimonialsElement);
            $testimonialsElement.thegemPreloader(function() {
                var $testimonialsView = $testimonialsCarousel.carouFredSel({
                    auto: true,
                    circular: true,
                    infinite: true,
                    width: '100%',
                    height: 'auto',
                    items: 1,
                    align: 'center',
                    responsive: true,
                    swipe: true,
                    prev: $testimonialsPrev,
                    next: $testimonialsNext,
                    scroll: {
                        pauseOnHover: true,
                        fx: 'scroll',
                        easing: 'easeInOutCubic',
                        duration: 1000,
                        onBefore: function(data) {
                            data.items.old.css({
                                opacity: 1
                            }).animate({
                                opacity: 0
                            }, 500, 'linear');
                            data.items.visible.css({
                                opacity: 0
                            }).animate({
                                opacity: 1
                            }, 1000, 'linear');
                        }
                    }
                });
            });
        });
    }
})(jQuery);;
(function($) {
    $(function() {
        $('.gem-clients-type-carousel-grid:not(.carousel-disabled)').each(function() {
            var $clientsCarouselElement = $(this);
            var $clientsItems = $('.gem-clients-slide', $clientsCarouselElement);
            var $clientsItemsWrap = $('<div class="gem-clients-grid-carousel-wrap"/>').appendTo($clientsCarouselElement);
            var $clientsItemsCarousel = $('<div class="gem-clients-grid-carousel"/>').appendTo($clientsItemsWrap);
            var $clientsItemsPagination = $('<div class="gem-clients-grid-pagination gem-mini-pagination"/>').appendTo($clientsItemsWrap);
            $clientsItems.appendTo($clientsItemsCarousel);
        });
        $('.gem_client_carousel-items').each(function() {
            var $clientsElement = $(this);
            var $clients = $('.gem-client-item', $clientsElement);
            var $clientsWrap = $('<div class="gem-client-carousel-item-wrap"/>').appendTo($clientsElement);
            var $clientsCarousel = $('<div class="gem-client-carousel"/>').appendTo($clientsWrap);
            var $clientsNavigation = $('<div class="gem-client-carousel-navigation"/>').appendTo($clientsWrap);
            var $clientsPrev = $('<a href="#" class="gem-prev gem-client-prev"/></a>').appendTo($clientsNavigation);
            var $clientsNext = $('<a href="#" class="gem-next gem-client-next"/></a>').appendTo($clientsNavigation);
            $clients.appendTo($clientsCarousel);
        });
        $('body').updateClientsGrid();
        $('body').updateClientsCarousel();
        $('.fullwidth-block').each(function() {
            $(this).on('updateClientsCarousel', function() {
                $(this).updateClientsCarousel();
            });
        });
        $('.gem_tab').on('tab-update', function() {
            $(this).updateClientsGrid();
        });
        $('.gem_accordion_content').on('accordion-update', function() {
            $(this).updateClientsGrid();
        });
        $(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function() {
            $(this).data('vc.accordion').getTarget().updateClientsGrid();
        });
        $(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function() {
            $(this).data('vc.accordion').getTarget().updateClientsGrid();
        });
    });
    $.fn.updateClientsGrid = function() {
        $('.gem-clients-type-carousel-grid:not(.carousel-disabled)', this).each(function() {
            var $clientsCarouselElement = $(this);
            var $clientsItemsCarousel = $('.gem-clients-grid-carousel', $clientsCarouselElement);
            var $clientsItemsPagination = $('.gem-mini-pagination', $clientsCarouselElement);
            var autoscroll = $clientsCarouselElement.data('autoscroll') > 0 ? $clientsCarouselElement.data('autoscroll') : false;
            $clientsCarouselElement.thegemPreloader(function() {
                var $clientsGridCarousel = $clientsItemsCarousel.carouFredSel({
                    auto: autoscroll,
                    circular: false,
                    infinite: true,
                    width: '100%',
                    items: 1,
                    responsive: true,
                    height: 'auto',
                    align: 'center',
                    pagination: $clientsItemsPagination,
                    scroll: {
                        pauseOnHover: true
                    }
                });
            });
        });
    }
    $.fn.updateClientsCarousel = function() {
        $('.gem_client_carousel-items:not(.carousel-disabled)', this).each(function() {
            var $clientsElement = $(this);
            var $clientsCarousel = $('.gem-client-carousel', $clientsElement);
            var $clientsPrev = $('.gem-client-prev', $clientsElement);
            var $clientsNext = $('.gem-client-next', $clientsElement);
            var autoscroll = $clientsElement.data('autoscroll') > 0 ? $clientsElement.data('autoscroll') : false;
            $clientsElement.thegemPreloader(function() {
                var $clientsView = $clientsCarousel.carouFredSel({
                    auto: autoscroll,
                    circular: true,
                    infinite: false,
                    scroll: {
                        items: 1
                    },
                    width: '100%',
                    responsive: false,
                    height: 'auto',
                    align: 'center',
                    prev: $clientsPrev,
                    next: $clientsNext
                });
            });
        });
    }
})(jQuery);