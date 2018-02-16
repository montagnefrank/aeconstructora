(function ($) {
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
            for (var f = 0, g = e[c].length; g > f; f++)
                e[c][f].call(a, d);
        return []
    }

    function sc_fireQueue(a, b, c) {
        return b.length && (a.trigger(cf_e(b[0][0], c), b[0][1]), b.shift()), b
    }

    function sc_hideHiddenItems(a) {
        a.each(function () {
            var a = $(this);
            a.data("_cfs_isHidden", a.is(":hidden")).hide()
        })
    }

    function sc_showHiddenItems(a) {
        a && a.each(function () {
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
        if ("show" == b || "hide" == b)
            var e = b;
        else if (d > b) {
            debug(c, "Not enough items (" + b + " total, " + d + " needed): Hiding navigation.");
            var e = "hide"
        } else
            var e = "show";
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
            for (; a >= d.total; )
                a -= d.total;
            for (; 0 > a; )
                a += d.total
        }
        return a
    }

    function gn_getVisibleItemsPrev(a, b, c) {
        for (var d = 0, e = 0, f = c; f >= 0; f--) {
            var g = a.eq(f);
            if (d += g.is(":visible") ? g[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
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
            if (f++, f == h)
                return f;
            var i = a.eq(g);
            if (i.is(b) && (e++, e == c))
                return f;
            0 == g && (g = h)
        }
    }

    function gn_getVisibleOrg(a, b) {
        return b.items.visibleConf.org || a.children().slice(0, b.items.visible).filter(b.items.filter).length
    }

    function gn_getVisibleItemsNext(a, b, c) {
        for (var d = 0, e = 0, f = c, g = a.length - 1; g >= f; f++) {
            var h = a.eq(f);
            if (d += h.is(":visible") ? h[b.d.outerWidth](!0) : 0, d > b.maxDimension)
                return e;
            if (e++, e == g + 1)
                return e;
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
            if (g++, g >= i)
                return g;
            var j = a.eq(h);
            if (j.is(b) && (f++, f == c))
                return g;
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
        b.usePadding && (is_string(c) || (c = "_cfs_origCssMargin"), a.each(function () {
            var a = $(this),
                    d = parseInt(a.css(b.d.marginRight), 10);
            is_number(d) || (d = 0), a.data(c, d)
        }))
    }

    function sz_resetMargin(a, b, c) {
        if (b.usePadding) {
            var d = is_boolean(c) ? c : !1;
            is_number(c) || (c = 0), sz_storeMargin(a, b, "_cfs_tempCssMargin"), a.each(function () {
                var a = $(this);
                a.css(b.d.marginRight, d ? a.data("_cfs_tempCssMargin") : c + a.data("_cfs_origCssMargin"))
            })
        }
    }

    function sz_storeOrigCss(a) {
        a.each(function () {
            var a = $(this);
            a.data("_cfs_origCss", a.attr("style") || "")
        })
    }

    function sz_restoreOrigCss(a) {
        a.each(function () {
            var a = $(this);
            a.attr("style", a.data("_cfs_origCss") || "")
        })
    }

    function sz_setResponsiveSizes(a, b) {
        var d = (a.items.visible, a.items[a.d.width]),
                e = a[a.d.height],
                f = is_percentage(e);
        b.each(function () {
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
        if (is_boolean(d) || (d = !1), is_number(b[b.d[c]]) && d)
            return b[b.d[c]];
        if (is_number(b.items[b.d[c]]))
            return b.items[b.d[c]] * a.length;
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
            if (b = parseInt(b.slice(0, -1), 10), !is_number(b))
                return a;
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
        if (is_undefined(a))
            return [0, 0, 0, 0];
        if (is_number(a))
            return [a, a, a, a];
        if (is_string(a) && (a = a.split("px").join("").split("em").join("").split(" ")), !is_array(a))
            return [0, 0, 0, 0];
        for (var b = 0; 4 > b; b++)
            a[b] = parseInt(a[b], 10);
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
        ], c = b[0].length, d = "right" == a.direction || "left" == a.direction ? 0 : 1, e = {}, f = 0; c > f; f++)
            e[b[0][f]] = b[d][f];
        return e
    }

    function cf_getAdjust(a, b, c, d) {
        var e = a;
        if (is_function(c))
            e = c.call(d, e);
        else if (is_string(c)) {
            var f = c.split("+"),
                    g = c.split("-");
            if (g.length > f.length)
                var h = !0,
                        i = g[0],
                        j = g[1];
            else
                var h = !1,
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
        for (var b = 0, c = a.length; c > b; b++)
            is_string(a[b][0]) && (a[b][0] = $(a[b][0])), is_boolean(a[b][1]) || (a[b][1] = !0), is_boolean(a[b][2]) || (a[b][2] = !0), is_number(a[b][3]) || (a[b][3] = 0);
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
        for (var c = {}, d = 0, e = b.length; e > d; d++)
            c[b[d]] = a.css(b[d]);
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
        if (is_string(a))
            var b = a.indexOf("immediate") > -1 ? !0 : !1,
                    c = a.indexOf("resume") > -1 ? !0 : !1;
        else
            var b = c = !1;
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
            } else
                var c = "";
            if (!a)
                return !1;
            b = is_string(b) ? "carouFredSel" + c + ": " + b : ["carouFredSel" + c + ":", b], window.console.log(b)
        }
        return !1
    }
    $.fn.carouFredSel || ($.fn.caroufredsel = $.fn.carouFredSel = function (options, configs) {
        if (0 == this.length)
            return debug(!0, 'No element found for "' + this.selector + '".'), this;
        if (this.length > 1)
            return this.each(function () {
                $(this).carouFredSel(options, configs)
            });
        var $cfs = this,
                $tt0 = this[0],
                starting_position = !1;
        $cfs.data("_cfs_isCarousel") && (starting_position = $cfs.triggerHandler("_cfs_triggerEvent", "currentPosition"), $cfs.trigger("_cfs_triggerEvent", ["destroy", !0]));
        var FN = {};
        FN._init = function (a, b, c) {
            a = go_getObject($tt0, a), a.items = go_getItemsObject($tt0, a.items), a.scroll = go_getScrollObject($tt0, a.scroll), a.auto = go_getAutoObject($tt0, a.auto), a.prev = go_getPrevNextObject($tt0, a.prev), a.next = go_getPrevNextObject($tt0, a.next), a.pagination = go_getPaginationObject($tt0, a.pagination), a.swipe = go_getSwipeObject($tt0, a.swipe), a.mousewheel = go_getMousewheelObject($tt0, a.mousewheel), b && (opts_orig = $.extend(!0, {}, $.fn.carouFredSel.defaults, a)), opts = $.extend(!0, {}, $.fn.carouFredSel.defaults, a), opts.d = cf_getDimensions(opts), crsl.direction = "up" == opts.direction || "left" == opts.direction ? "next" : "prev";
            var d = $cfs.children(),
                    e = ms_getParentSize($wrp, opts, "width");
            if (is_true(opts.cookie) && (opts.cookie = "caroufredsel_cookie_" + conf.serialNumber), opts.maxDimension = ms_getMaxDimension(opts, e), opts.items = in_complementItems(opts.items, opts, d, c), opts[opts.d.width] = in_complementPrimarySize(opts[opts.d.width], opts, d), opts[opts.d.height] = in_complementSecondarySize(opts[opts.d.height], opts, d), opts.responsive && (is_percentage(opts[opts.d.width]) || (opts[opts.d.width] = "100%")), is_percentage(opts[opts.d.width]) && (crsl.upDateOnWindowResize = !0, crsl.primarySizePercentage = opts[opts.d.width], opts[opts.d.width] = ms_getPercentage(e, crsl.primarySizePercentage), opts.items.visible || (opts.items.visibleConf.variable = !0)), opts.responsive ? (opts.usePadding = !1, opts.padding = [0, 0, 0, 0], opts.align = !1, opts.items.visibleConf.variable = !1) : (opts.items.visible || (opts = in_complementVisibleItems(opts, e)), opts[opts.d.width] || (!opts.items.visibleConf.variable && is_number(opts.items[opts.d.width]) && "*" == opts.items.filter ? (opts[opts.d.width] = opts.items.visible * opts.items[opts.d.width], opts.align = !1) : opts[opts.d.width] = "variable"), is_undefined(opts.align) && (opts.align = is_number(opts[opts.d.width]) ? "center" : !1), opts.items.visibleConf.variable && (opts.items.visible = gn_getVisibleItemsNext(d, opts, 0))), "*" == opts.items.filter || opts.items.visibleConf.variable || (opts.items.visibleConf.org = opts.items.visible, opts.items.visible = gn_getVisibleItemsNextFilter(d, opts, 0)), opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts.responsive)
                opts.items.visibleConf.min || (opts.items.visibleConf.min = opts.items.visible), opts.items.visibleConf.max || (opts.items.visibleConf.max = opts.items.visible), opts = in_getResponsiveValues(opts, d, e);
            else
                switch (opts.padding = cf_getPadding(opts.padding), "top" == opts.align ? opts.align = "left" : "bottom" == opts.align && (opts.align = "right"), opts.align) {
                    case "center":
                    case "left":
                    case "right":
                        "variable" != opts[opts.d.width] && (opts = in_getAlignPadding(opts, d), opts.usePadding = !0);
                        break;
                    default:
                        opts.align = !1, opts.usePadding = 0 == opts.padding[0] && 0 == opts.padding[1] && 0 == opts.padding[2] && 0 == opts.padding[3] ? !1 : !0
                }
            is_number(opts.scroll.duration) || (opts.scroll.duration = 500), is_undefined(opts.scroll.items) && (opts.scroll.items = opts.responsive || opts.items.visibleConf.variable || "*" != opts.items.filter ? "visible" : opts.items.visible), opts.auto = $.extend(!0, {}, opts.scroll, opts.auto), opts.prev = $.extend(!0, {}, opts.scroll, opts.prev), opts.next = $.extend(!0, {}, opts.scroll, opts.next), opts.pagination = $.extend(!0, {}, opts.scroll, opts.pagination), opts.auto = go_complementAutoObject($tt0, opts.auto), opts.prev = go_complementPrevNextObject($tt0, opts.prev), opts.next = go_complementPrevNextObject($tt0, opts.next), opts.pagination = go_complementPaginationObject($tt0, opts.pagination), opts.swipe = go_complementSwipeObject($tt0, opts.swipe), opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel), opts.synchronise && (opts.synchronise = cf_getSynchArr(opts.synchronise)), opts.auto.onPauseStart && (opts.auto.onTimeoutStart = opts.auto.onPauseStart, deprecated("auto.onPauseStart", "auto.onTimeoutStart")), opts.auto.onPausePause && (opts.auto.onTimeoutPause = opts.auto.onPausePause, deprecated("auto.onPausePause", "auto.onTimeoutPause")), opts.auto.onPauseEnd && (opts.auto.onTimeoutEnd = opts.auto.onPauseEnd, deprecated("auto.onPauseEnd", "auto.onTimeoutEnd")), opts.auto.pauseDuration && (opts.auto.timeoutDuration = opts.auto.pauseDuration, deprecated("auto.pauseDuration", "auto.timeoutDuration"))
        }, FN._build = function () {
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
        }, FN._bind_events = function () {
            FN._unbind_events(), $cfs.bind(cf_e("stop", conf), function (a, b) {
                return a.stopPropagation(), crsl.isStopped || opts.auto.button && opts.auto.button.addClass(cf_c("stopped", conf)), crsl.isStopped = !0, opts.auto.play && (opts.auto.play = !1, $cfs.trigger(cf_e("pause", conf), b)), !0
            }), $cfs.bind(cf_e("finish", conf), function (a) {
                return a.stopPropagation(), crsl.isScrolling && sc_stopScroll(scrl), !0
            }), $cfs.bind(cf_e("pause", conf), function (a, b, c) {
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
            }), $cfs.bind(cf_e("play", conf), function (a, b, c, d) {
                a.stopPropagation(), tmrs = sc_clearTimers(tmrs);
                var e = [b, c, d],
                        f = ["string", "number", "boolean"],
                        g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], "prev" != b && "next" != b && (b = crsl.direction), is_number(c) || (c = 0), is_boolean(d) || (d = !1), d && (crsl.isStopped = !1, opts.auto.play = !0), !opts.auto.play)
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped: Not scrolling.");
                crsl.isPaused && opts.auto.button && (opts.auto.button.removeClass(cf_c("stopped", conf)), opts.auto.button.removeClass(cf_c("paused", conf))), crsl.isPaused = !1, tmrs.startTime = getTime();
                var h = opts.auto.timeoutDuration + c;
                return dur2 = h - tmrs.timePassed, perc = 100 - Math.ceil(100 * dur2 / h), opts.auto.progress && (tmrs.progress = setInterval(function () {
                    var a = getTime() - tmrs.startTime + tmrs.timePassed,
                            b = Math.ceil(100 * a / h);
                    opts.auto.progress.updater.call(opts.auto.progress.bar[0], b)
                }, opts.auto.progress.interval)), tmrs.auto = setTimeout(function () {
                    opts.auto.progress && opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100), opts.auto.onTimeoutEnd && opts.auto.onTimeoutEnd.call($tt0, perc, dur2), crsl.isScrolling ? $cfs.trigger(cf_e("play", conf), b) : $cfs.trigger(cf_e(b, conf), opts.auto)
                }, dur2), opts.auto.onTimeoutStart && opts.auto.onTimeoutStart.call($tt0, perc, dur2), !0
            }), $cfs.bind(cf_e("resume", conf), function (a) {
                return a.stopPropagation(), scrl.isStopped ? (scrl.isStopped = !1, crsl.isPaused = !1, crsl.isScrolling = !0, scrl.startTime = getTime(), sc_startScroll(scrl, conf)) : $cfs.trigger(cf_e("play", conf)), !0
            }), $cfs.bind(cf_e("prev", conf) + " " + cf_e("next", conf), function (a, b, c, d, e) {
                if (a.stopPropagation(), crsl.isStopped || $cfs.is(":hidden"))
                    return a.stopImmediatePropagation(), debug(conf, "Carousel stopped or hidden: Not scrolling.");
                var f = is_number(opts.items.minimum) ? opts.items.minimum : opts.items.visible + 1;
                if (f > itms.total)
                    return a.stopImmediatePropagation(), debug(conf, "Not enough items (" + itms.total + " total, " + f + " needed): Not scrolling.");
                var g = [b, c, d, e],
                        h = ["object", "number/string", "function", "boolean"],
                        i = cf_sortParams(g, h);
                b = i[0], c = i[1], d = i[2], e = i[3];
                var j = a.type.slice(conf.events.prefix.length);
                if (is_object(b) || (b = {}), is_function(d) && (b.onAfter = d), is_boolean(e) && (b.queue = e), b = $.extend(!0, {}, opts[j], b), b.conditions && !b.conditions.call($tt0, j))
                    return a.stopImmediatePropagation(), debug(conf, 'Callback "conditions" returned false.');
                if (!is_number(c)) {
                    if ("*" != opts.items.filter)
                        c = "visible";
                    else
                        for (var k = [c, b.items, opts[j].items], i = 0, l = k.length; l > i; i++)
                            if (is_number(k[i]) || "page" == k[i] || "visible" == k[i]) {
                                c = k[i];
                                break
                            }
                    switch (c) {
                        case "page":
                            return a.stopImmediatePropagation(), $cfs.triggerHandler(cf_e(j + "Page", conf), [b, d]);
                        case "visible":
                            opts.items.visibleConf.variable || "*" != opts.items.filter || (c = opts.items.visible)
                    }
                }
                if (scrl.isStopped)
                    return $cfs.trigger(cf_e("resume", conf)), $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]]), a.stopImmediatePropagation(), debug(conf, "Carousel resumed scrolling.");
                if (b.duration > 0 && crsl.isScrolling)
                    return b.queue && ("last" == b.queue && (queu = []), ("first" != b.queue || 0 == queu.length) && $cfs.trigger(cf_e("queue", conf), [j, [b, c, d]])), a.stopImmediatePropagation(), debug(conf, "Carousel currently scrolling.");
                if (tmrs.timePassed = 0, $cfs.trigger(cf_e("slide_" + j, conf), [b, c]), opts.synchronise)
                    for (var m = opts.synchronise, n = [b, c], o = 0, l = m.length; l > o; o++) {
                        var p = j;
                        m[o][2] || (p = "prev" == p ? "next" : "prev"), m[o][1] || (n[0] = m[o][0].triggerHandler("_cfs_triggerEvent", ["configuration", p])), n[1] = c + m[o][3], m[o][0].trigger("_cfs_triggerEvent", ["slide_" + p, n])
                    }
                return !0
            }), $cfs.bind(cf_e("slide_prev", conf), function (a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && 0 == itms.first)
                    return opts.infinite && $cfs.trigger(cf_e("next", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if (opts.items.visibleConf.variable)
                        c = gn_getVisibleItemsPrev(d, opts, itms.total - 1);
                    else if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsPrevFilter(d, opts, itms.total - 1, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                if (opts.circular || itms.total - c < itms.first && (c = itms.total - itms.first), opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    var f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0);
                    f >= opts.items.visible + c && itms.total > c && (c++, f = cf_getItemsAdjust(gn_getVisibleItemsNext(d, opts, itms.total - c), opts, opts.items.visibleConf.adjust, $tt0)), opts.items.visible = f
                } else if ("*" != opts.items.filter) {
                    var f = gn_getVisibleItemsNextFilter(d, opts, itms.total - c);
                    opts.items.visible = cf_getItemsAdjust(f, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items backward."), itms.first += c; itms.first >= itms.total; )
                    itms.first -= itms.total;
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
                var E = function () {},
                        F = function () {},
                        G = function () {},
                        H = function () {},
                        I = function () {},
                        J = function () {},
                        K = function () {},
                        L = function () {},
                        M = function () {},
                        N = function () {},
                        O = function () {};
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
                if ($cfs.css(B), scrl = sc_setScroll(D, b.easing, conf), w[opts.d.left] = opts.usePadding ? opts.padding[opts.d[3]] : 0, ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (E = function () {
                    $wrp.css(u)
                }, F = function () {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    switch (k.not(i).length && (y[opts.d.marginRight] = i.data("_cfs_origCssMargin"), 0 > l ? i.css(y) : (K = function () {
                            i.css(y)
                        }, L = function () {
                            scrl.anims.push([i, y])
                        })), b.fx) {
                        case "cover":
                        case "cover-fade":
                            s.children().eq(c - 1).css(y)
                    }
                    k.not(j).length && (z[opts.d.marginRight] = j.data("_cfs_origCssMargin"), G = function () {
                        j.css(z)
                    }, H = function () {
                        scrl.anims.push([j, z])
                    }), m >= 0 && (A[opts.d.marginRight] = k.data("_cfs_origCssMargin") + opts.padding[opts.d[1]], I = function () {
                        k.css(A)
                    }, J = function () {
                        scrl.anims.push([k, A])
                    })
                }
                O = function () {
                    $cfs.css(w)
                };
                var P = opts.items.visible + c - itms.total;
                N = function () {
                    if (P > 0 && ($cfs.children().slice(itms.total).remove(), g = $($cfs.children().slice(itms.total - (opts.items.visible - P)).get().concat($cfs.children().slice(0, P).get()))), sc_showHiddenItems(p), opts.usePadding) {
                        var a = $cfs.children().eq(opts.items.visible + c - 1);
                        a.css(opts.d.marginRight, a.data("_cfs_origCssMargin"))
                    }
                };
                var Q = sc_mapCallbackArguments(g, q, h, c, "prev", D, u);
                switch (M = function () {
                        sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", Q, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", Q, clbk), b.fx) {
                    case "none":
                        $cfs.css(w), E(), G(), I(), K(), O(), N(), M();
                        break;
                    case "fade":
                        scrl.anims.push([$cfs, {
                                opacity: 0
                            }, function () {
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
                        scrl.anims.push([s, w, function () {
                                G(), I(), K(), O(), N(), M()
                            }]), F();
                        break;
                    case "cover-fade":
                        scrl.anims.push([$cfs, {
                                opacity: 0
                            }]), scrl.anims.push([s, w, function () {
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
                        scrl.anims.push([$cfs, w, function () {
                                N(), M()
                            }]), F(), H(), J(), L()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slide_next", conf), function (a, b, c) {
                a.stopPropagation();
                var d = $cfs.children();
                if (!opts.circular && itms.first == opts.items.visible)
                    return opts.infinite && $cfs.trigger(cf_e("prev", conf), itms.total - 1), a.stopImmediatePropagation();
                if (sz_resetMargin(d, opts), !is_number(c)) {
                    if ("*" != opts.items.filter) {
                        var e = is_number(b.items) ? b.items : gn_getVisibleOrg($cfs, opts);
                        c = gn_getScrollItemsNextFilter(d, opts, 0, e)
                    } else
                        c = opts.items.visible;
                    c = cf_getAdjust(c, opts, b.items, $tt0)
                }
                var f = 0 == itms.first ? itms.total : itms.first;
                if (!opts.circular) {
                    if (opts.items.visibleConf.variable)
                        var g = gn_getVisibleItemsNext(d, opts, c),
                                e = gn_getVisibleItemsPrev(d, opts, f - 1);
                    else
                        var g = opts.items.visible,
                                e = opts.items.visible;
                    c + g > f && (c = f - e)
                }
                if (opts.items.visibleConf.old = opts.items.visible, opts.items.visibleConf.variable) {
                    for (var g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0); opts.items.visible - c >= g && itms.total > c; )
                        c++, g = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(d, opts, c, f), opts, opts.items.visibleConf.adjust, $tt0);
                    opts.items.visible = g
                } else if ("*" != opts.items.filter) {
                    var g = gn_getVisibleItemsNextFilter(d, opts, c);
                    opts.items.visible = cf_getItemsAdjust(g, opts, opts.items.visibleConf.adjust, $tt0)
                }
                if (sz_resetMargin(d, opts, !0), 0 == c)
                    return a.stopImmediatePropagation(), debug(conf, "0 items to scroll: Not scrolling.");
                for (debug(conf, "Scrolling " + c + " items forward."), itms.first -= c; 0 > itms.first; )
                    itms.first += itms.total;
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
                var C = function () {},
                        D = function () {},
                        E = function () {},
                        F = function () {},
                        G = function () {},
                        H = function () {},
                        I = function () {},
                        J = function () {},
                        K = function () {};
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
                if (scrl = sc_setScroll(B, b.easing, conf), w[opts.d.left] = -t, x[opts.d.left] = -v, 0 > m && (w[opts.d.left] += m), ("variable" == opts[opts.d.width] || "variable" == opts[opts.d.height]) && (C = function () {
                    $wrp.css(u)
                }, D = function () {
                    scrl.anims.push([$wrp, u])
                }), opts.usePadding) {
                    var L = l.data("_cfs_origCssMargin");
                    n >= 0 && (L += opts.padding[opts.d[1]]), l.css(opts.d.marginRight, L), j.not(k).length && (z[opts.d.marginRight] = k.data("_cfs_origCssMargin")), E = function () {
                        k.css(z)
                    }, F = function () {
                        scrl.anims.push([k, z])
                    };
                    var M = j.data("_cfs_origCssMargin");
                    m > 0 && (M += opts.padding[opts.d[3]]), y[opts.d.marginRight] = M, G = function () {
                        j.css(y)
                    }, H = function () {
                        scrl.anims.push([j, y])
                    }
                }
                K = function () {
                    $cfs.css(A)
                };
                var N = opts.items.visible + c - itms.total;
                J = function () {
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
                switch (I = function () {
                        $cfs.css("zIndex", $cfs.data("_cfs_origCssZindex")), sc_afterScroll($cfs, s, b), crsl.isScrolling = !1, clbk.onAfter = sc_fireCallbacks($tt0, b, "onAfter", O, clbk), queu = sc_fireQueue($cfs, queu, conf), crsl.isPaused || $cfs.trigger(cf_e("play", conf))
                    }, crsl.isScrolling = !0, tmrs = sc_clearTimers(tmrs), clbk.onBefore = sc_fireCallbacks($tt0, b, "onBefore", O, clbk), b.fx) {
                    case "none":
                        $cfs.css(w), C(), E(), G(), K(), J(), I();
                        break;
                    case "fade":
                        scrl.anims.push([$cfs, {
                                opacity: 0
                            }, function () {
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
                        scrl.anims.push([$cfs, w, function () {
                                K(), J(), I()
                            }]), D(), F(), H()
                }
                return sc_startScroll(scrl, conf), cf_setCookie(opts.cookie, $cfs, conf), $cfs.trigger(cf_e("updatePageStatus", conf), [!1, u]), !0
            }), $cfs.bind(cf_e("slideTo", conf), function (a, b, c, d, e, f, g) {
                a.stopPropagation();
                var h = [b, c, d, e, f, g],
                        i = ["string/number/object", "number", "boolean", "object", "string", "function"],
                        j = cf_sortParams(h, i);
                return e = j[3], f = j[4], g = j[5], b = gn_getItemIndex(j[0], j[1], j[2], itms, $cfs), 0 == b ? !1 : (is_object(e) || (e = !1), "prev" != f && "next" != f && (f = opts.circular ? itms.total / 2 >= b ? "next" : "prev" : 0 == itms.first || itms.first > b ? "next" : "prev"), "prev" == f && (b = itms.total - b), $cfs.trigger(cf_e(f, conf), [e, b, g]), !0)
            }), $cfs.bind(cf_e("prevPage", conf), function (a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d - 1, b, "prev", c])
            }), $cfs.bind(cf_e("nextPage", conf), function (a, b, c) {
                a.stopPropagation();
                var d = $cfs.triggerHandler(cf_e("currentPage", conf));
                return $cfs.triggerHandler(cf_e("slideToPage", conf), [d + 1, b, "next", c])
            }), $cfs.bind(cf_e("slideToPage", conf), function (a, b, c, d, e) {
                a.stopPropagation(), is_number(b) || (b = $cfs.triggerHandler(cf_e("currentPage", conf)));
                var f = opts.pagination.items || opts.items.visible,
                        g = Math.ceil(itms.total / f) - 1;
                return 0 > b && (b = g), b > g && (b = 0), $cfs.triggerHandler(cf_e("slideTo", conf), [b * f, 0, !0, c, d, e])
            }), $cfs.bind(cf_e("jumpToStart", conf), function (a, b) {
                if (a.stopPropagation(), b = b ? gn_getItemIndex(b, 0, !0, itms, $cfs) : 0, b += itms.first, 0 != b) {
                    if (itms.total > 0)
                        for (; b > itms.total; )
                            b -= itms.total;
                    $cfs.prepend($cfs.children().slice(b, itms.total))
                }
                return !0
            }), $cfs.bind(cf_e("synchronise", conf), function (a, b) {
                if (a.stopPropagation(), b)
                    b = cf_getSynchArr(b);
                else {
                    if (!opts.synchronise)
                        return debug(conf, "No carousel to synchronise.");
                    b = opts.synchronise
                }
                for (var c = $cfs.triggerHandler(cf_e("currentPosition", conf)), d = !0, e = 0, f = b.length; f > e; e++)
                    b[e][0].triggerHandler(cf_e("slideTo", conf), [c, b[e][3], !0]) || (d = !1);
                return d
            }), $cfs.bind(cf_e("queue", conf), function (a, b, c) {
                return a.stopPropagation(), is_function(b) ? b.call($tt0, queu) : is_array(b) ? queu = b : is_undefined(b) || queu.push([b, c]), queu
            }), $cfs.bind(cf_e("insertItem", conf), function (a, b, c, d, e) {
                a.stopPropagation();
                var f = [b, c, d, e],
                        g = ["string/object", "string/number/object", "boolean", "number"],
                        h = cf_sortParams(f, g);
                if (b = h[0], c = h[1], d = h[2], e = h[3], is_object(b) && !is_jquery(b) ? b = $(b) : is_string(b) && (b = $(b)), !is_jquery(b) || 0 == b.length)
                    return debug(conf, "Not a valid object.");
                is_undefined(c) && (c = "end"), sz_storeMargin(b, opts), sz_storeOrigCss(b);
                var i = c,
                        j = "before";
                "end" == c ? d ? (0 == itms.first ? (c = itms.total - 1, j = "after") : (c = itms.first, itms.first += b.length), 0 > c && (c = 0)) : (c = itms.total - 1, j = "after") : c = gn_getItemIndex(c, e, d, itms, $cfs);
                var k = $cfs.children().eq(c);
                return k.length ? k[j](b) : (debug(conf, "Correct insert-position not found! Appending item to the end."), $cfs.append(b)), "end" == i || d || itms.first > c && (itms.first += b.length), itms.total = $cfs.children().length, itms.first >= itms.total && (itms.first -= itms.total), $cfs.trigger(cf_e("updateSizes", conf)), $cfs.trigger(cf_e("linkAnchors", conf)), !0
            }), $cfs.bind(cf_e("removeItem", conf), function (a, b, c, d) {
                a.stopPropagation();
                var e = [b, c, d],
                        f = ["string/number/object", "boolean", "number"],
                        g = cf_sortParams(e, f);
                if (b = g[0], c = g[1], d = g[2], b instanceof $ && b.length > 1)
                    return i = $(), b.each(function () {
                        var e = $cfs.trigger(cf_e("removeItem", conf), [$(this), c, d]);
                        e && (i = i.add(e))
                    }), i;
                if (is_undefined(b) || "end" == b)
                    i = $cfs.children().last();
                else {
                    b = gn_getItemIndex(b, d, c, itms, $cfs);
                    var i = $cfs.children().eq(b);
                    i.length && itms.first > b && (itms.first -= i.length)
                }
                return i && i.length && (i.detach(), itms.total = $cfs.children().length, $cfs.trigger(cf_e("updateSizes", conf))), i
            }), $cfs.bind(cf_e("onBefore", conf) + " " + cf_e("onAfter", conf), function (a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length);
                return is_array(b) && (clbk[c] = b), is_function(b) && clbk[c].push(b), clbk[c]
            }), $cfs.bind(cf_e("currentPosition", conf), function (a, b) {
                if (a.stopPropagation(), 0 == itms.first)
                    var c = 0;
                else
                    var c = itms.total - itms.first;
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("currentPage", conf), function (a, b) {
                a.stopPropagation();
                var e, c = opts.pagination.items || opts.items.visible,
                        d = Math.ceil(itms.total / c - 1);
                return e = 0 == itms.first ? 0 : itms.first < itms.total % c ? 0 : itms.first != c || opts.circular ? Math.round((itms.total - itms.first) / c) : d, 0 > e && (e = 0), e > d && (e = d), is_function(b) && b.call($tt0, e), e
            }), $cfs.bind(cf_e("currentVisible", conf), function (a, b) {
                a.stopPropagation();
                var c = gi_getCurrentItems($cfs.children(), opts);
                return is_function(b) && b.call($tt0, c), c
            }), $cfs.bind(cf_e("slice", conf), function (a, b, c, d) {
                if (a.stopPropagation(), 0 == itms.total)
                    return !1;
                var e = [b, c, d],
                        f = ["number", "number", "function"],
                        g = cf_sortParams(e, f);
                if (b = is_number(g[0]) ? g[0] : 0, c = is_number(g[1]) ? g[1] : itms.total, d = g[2], b += itms.first, c += itms.first, itms.total > 0) {
                    for (; b > itms.total; )
                        b -= itms.total;
                    for (; c > itms.total; )
                        c -= itms.total;
                    for (; 0 > b; )
                        b += itms.total;
                    for (; 0 > c; )
                        c += itms.total
                }
                var i, h = $cfs.children();
                return i = c > b ? h.slice(b, c) : $(h.slice(b, itms.total).get().concat(h.slice(0, c).get())), is_function(d) && d.call($tt0, i), i
            }), $cfs.bind(cf_e("isPaused", conf) + " " + cf_e("isStopped", conf) + " " + cf_e("isScrolling", conf), function (a, b) {
                a.stopPropagation();
                var c = a.type.slice(conf.events.prefix.length),
                        d = crsl[c];
                return is_function(b) && b.call($tt0, d), d
            }), $cfs.bind(cf_e("configuration", conf), function (e, a, b, c) {
                e.stopPropagation();
                var reInit = !1;
                if (is_function(a))
                    a.call($tt0, opts);
                else if (is_object(a))
                    opts_orig = $.extend(!0, {}, opts_orig, a), b !== !1 ? reInit = !0 : opts = $.extend(!0, {}, opts, a);
                else if (!is_undefined(a))
                    if (is_function(b)) {
                        var val = eval("opts." + a);
                        is_undefined(val) && (val = ""), b.call($tt0, val)
                    } else {
                        if (is_undefined(b))
                            return eval("opts." + a);
                        "boolean" != typeof c && (c = !0), eval("opts_orig." + a + " = b"), c !== !1 ? reInit = !0 : eval("opts." + a + " = b")
                    }
                if (reInit) {
                    sz_resetMargin($cfs.children(), opts), FN._init(opts_orig), FN._bind_buttons();
                    var sz = sz_setSizes($cfs, opts);
                    $cfs.trigger(cf_e("updatePageStatus", conf), [!0, sz])
                }
                return opts
            }), $cfs.bind(cf_e("linkAnchors", conf), function (a, b, c) {
                return a.stopPropagation(), is_undefined(b) ? b = $("body") : is_string(b) && (b = $(b)), is_jquery(b) && 0 != b.length ? (is_string(c) || (c = "a.caroufredsel"), b.find(c).each(function () {
                    var a = this.hash || "";
                    a.length > 0 && -1 != $cfs.children().index($(a)) && $(this).unbind("click").click(function (b) {
                        b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), a)
                    })
                }), !0) : debug(conf, "Not a valid object.")
            }), $cfs.bind(cf_e("updatePageStatus", conf), function (a, b) {
                if (a.stopPropagation(), opts.pagination.container) {
                    var d = opts.pagination.items || opts.items.visible,
                            e = Math.ceil(itms.total / d);
                    b && (opts.pagination.anchorBuilder && (opts.pagination.container.children().remove(), opts.pagination.container.each(function () {
                        for (var a = 0; e > a; a++) {
                            var b = $cfs.children().eq(gn_getItemIndex(a * d, 0, !0, itms, $cfs));
                            $(this).append(opts.pagination.anchorBuilder.call(b[0], a + 1))
                        }
                    })), opts.pagination.container.each(function () {
                        $(this).children().unbind(opts.pagination.event).each(function (a) {
                            $(this).bind(opts.pagination.event, function (b) {
                                b.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [a * d, -opts.pagination.deviation, !0, opts.pagination])
                            })
                        })
                    }));
                    var f = $cfs.triggerHandler(cf_e("currentPage", conf)) + opts.pagination.deviation;
                    return f >= e && (f = 0), 0 > f && (f = e - 1), opts.pagination.container.each(function () {
                        $(this).children().removeClass(cf_c("selected", conf)).eq(f).addClass(cf_c("selected", conf))
                    }), !0
                }
            }), $cfs.bind(cf_e("updateSizes", conf), function () {
                var b = opts.items.visible,
                        c = $cfs.children(),
                        d = ms_getParentSize($wrp, opts, "width");
                if (itms.total = c.length, crsl.primarySizePercentage ? (opts.maxDimension = d, opts[opts.d.width] = ms_getPercentage(d, crsl.primarySizePercentage)) : opts.maxDimension = ms_getMaxDimension(opts, d), opts.responsive ? (opts.items.width = opts.items.sizesConf.width, opts.items.height = opts.items.sizesConf.height, opts = in_getResponsiveValues(opts, c, d), b = opts.items.visible, sz_setResponsiveSizes(opts, c)) : opts.items.visibleConf.variable ? b = gn_getVisibleItemsNext(c, opts, 0) : "*" != opts.items.filter && (b = gn_getVisibleItemsNextFilter(c, opts, 0)), !opts.circular && 0 != itms.first && b > itms.first) {
                    if (opts.items.visibleConf.variable)
                        var e = gn_getVisibleItemsPrev(c, opts, itms.first) - itms.first;
                    else if ("*" != opts.items.filter)
                        var e = gn_getVisibleItemsPrevFilter(c, opts, itms.first) - itms.first;
                    else
                        var e = opts.items.visible - itms.first;
                    debug(conf, "Preventing non-circular: sliding " + e + " items backward."), $cfs.trigger(cf_e("prev", conf), e)
                }
                opts.items.visible = cf_getItemsAdjust(b, opts, opts.items.visibleConf.adjust, $tt0), opts.items.visibleConf.old = opts.items.visible, opts = in_getAlignPadding(opts, c);
                var f = sz_setSizes($cfs, opts);
                return $cfs.trigger(cf_e("updatePageStatus", conf), [!0, f]), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), f
            }), $cfs.bind(cf_e("destroy", conf), function (a, b) {
                return a.stopPropagation(), tmrs = sc_clearTimers(tmrs), $cfs.data("_cfs_isCarousel", !1), $cfs.trigger(cf_e("finish", conf)), b && $cfs.trigger(cf_e("jumpToStart", conf)), sz_restoreOrigCss($cfs.children()), sz_restoreOrigCss($cfs), FN._unbind_events(), FN._unbind_buttons(), "parent" == conf.wrapper ? sz_restoreOrigCss($wrp) : $wrp.replaceWith($cfs), !0
            }), $cfs.bind(cf_e("debug", conf), function () {
                return debug(conf, "Carousel width: " + opts.width), debug(conf, "Carousel height: " + opts.height), debug(conf, "Item widths: " + opts.items.width), debug(conf, "Item heights: " + opts.items.height), debug(conf, "Number of items visible: " + opts.items.visible), opts.auto.play && debug(conf, "Number of items scrolled automatically: " + opts.auto.items), opts.prev.button && debug(conf, "Number of items scrolled backward: " + opts.prev.items), opts.next.button && debug(conf, "Number of items scrolled forward: " + opts.next.items), conf.debug
            }), $cfs.bind("_cfs_triggerEvent", function (a, b, c) {
                return a.stopPropagation(), $cfs.triggerHandler(cf_e(b, conf), c)
            })
        }, FN._unbind_events = function () {
            $cfs.unbind(cf_e("", conf)), $cfs.unbind(cf_e("", conf, !1)), $cfs.unbind("_cfs_triggerEvent")
        }, FN._bind_buttons = function () {
            if (FN._unbind_buttons(), nv_showNavi(opts, itms.total, conf), nv_enableNavi(opts, itms.first, conf), opts.auto.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
                $wrp.bind(cf_e("mouseenter", conf, !1), function () {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function () {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.auto.button && opts.auto.button.bind(cf_e(opts.auto.event, conf, !1), function (a) {
                a.preventDefault();
                var b = !1,
                        c = null;
                crsl.isPaused ? b = "play" : opts.auto.pauseOnEvent && (b = "pause", c = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent)), b && $cfs.trigger(cf_e(b, conf), c)
            }), opts.prev.button && (opts.prev.button.bind(cf_e(opts.prev.event, conf, !1), function (a) {
                a.preventDefault(), $cfs.trigger(cf_e("prev", conf))
            }), opts.prev.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
                opts.prev.button.bind(cf_e("mouseenter", conf, !1), function () {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function () {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.next.button && (opts.next.button.bind(cf_e(opts.next.event, conf, !1), function (a) {
                a.preventDefault(), $cfs.trigger(cf_e("next", conf))
            }), opts.next.pauseOnHover)) {
                var a = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
                opts.next.button.bind(cf_e("mouseenter", conf, !1), function () {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function () {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if (opts.pagination.container && opts.pagination.pauseOnHover) {
                var a = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
                opts.pagination.container.bind(cf_e("mouseenter", conf, !1), function () {
                    $cfs.trigger(cf_e("pause", conf), a)
                }).bind(cf_e("mouseleave", conf, !1), function () {
                    $cfs.trigger(cf_e("resume", conf))
                })
            }
            if ((opts.prev.key || opts.next.key) && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function (a) {
                var b = a.keyCode;
                b == opts.next.key && (a.preventDefault(), $cfs.trigger(cf_e("next", conf))), b == opts.prev.key && (a.preventDefault(), $cfs.trigger(cf_e("prev", conf)))
            }), opts.pagination.keys && $(document).bind(cf_e("keyup", conf, !1, !0, !0), function (a) {
                var b = a.keyCode;
                b >= 49 && 58 > b && (b = (b - 49) * opts.items.visible, itms.total >= b && (a.preventDefault(), $cfs.trigger(cf_e("slideTo", conf), [b, 0, !0, opts.pagination])))
            }), $.fn.swipe) {
                var b = "ontouchstart" in window;
                if (b && opts.swipe.onTouch || !b && opts.swipe.onMouse) {
                    var c = $.extend(!0, {}, opts.prev, opts.swipe),
                            d = $.extend(!0, {}, opts.next, opts.swipe),
                            e = function () {
                                $cfs.trigger(cf_e("prev", conf), [c])
                            },
                            f = function () {
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
                crsl.mousewheel && $wrp.unbind(cf_e("mousewheel", conf, !1)), $wrp.bind(cf_e("mousewheel", conf, !1), function (a, b) {
                    a.preventDefault(), b > 0 ? $cfs.trigger(cf_e("prev", conf), [g]) : $cfs.trigger(cf_e("next", conf), [h])
                }), crsl.mousewheel = !0
            }
            if (opts.auto.play && $cfs.trigger(cf_e("play", conf), opts.auto.delay), crsl.upDateOnWindowResize) {
                var i = function () {
                    $cfs.trigger(cf_e("finish", conf)), opts.auto.pauseOnResize && !crsl.isPaused && $cfs.trigger(cf_e("play", conf)), sz_resetMargin($cfs.children(), opts), $cfs.trigger(cf_e("updateSizes", conf))
                },
                        j = $(window),
                        k = null;
                if ($.debounce && "debounce" == conf.onWindowResize)
                    k = $.debounce(200, i);
                else if ($.throttle && "throttle" == conf.onWindowResize)
                    k = $.throttle(300, i);
                else {
                    var l = 0,
                            m = 0;
                    k = function () {
                        var a = j.width(),
                                b = j.height();
                        (a != l || b != m) && (i(), l = a, m = b)
                    }
                }
                j.bind(cf_e("resize", conf, !1, !0, !0), k)
            }
        }, FN._unbind_buttons = function () {
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
        if (conf.selector = $cfs.selector, conf.serialNumber = $.fn.carouFredSel.serialNumber++, conf.transition = conf.transition && $.fn.transition ? "transition" : "animate", FN._init(opts_orig, !0, starting_position), FN._build(), FN._bind_events(), FN._bind_buttons(), is_array(opts.items.start))
            var start_arr = opts.items.start;
        else {
            var start_arr = [];
            0 != opts.items.start && start_arr.push(opts.items.start)
        }
        if (opts.cookie && start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10)), start_arr.length > 0)
            for (var a = 0, l = start_arr.length; l > a; a++) {
                var s = start_arr[a];
                if (0 != s) {
                    if (s === !0) {
                        if (s = window.location.hash, 1 > s.length)
                            continue
                    } else
                        "random" === s && (s = Math.floor(Math.random() * itms.total));
                    if ($cfs.triggerHandler(cf_e("slideTo", conf), [s, 0, !0, {
                            fx: "none"
                        }]))
                        break
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
    }, $.fn.carouFredSel.pageAnchorBuilder = function (a) {
        return '<a href="#"><span>' + a + "</span></a>"
    }, $.fn.carouFredSel.progressbarUpdater = function (a) {
        $(this).css("width", a + "%")
    }, $.fn.carouFredSel.cookie = {
        get: function (a) {
            a += "=";
            for (var b = document.cookie.split(";"), c = 0, d = b.length; d > c; c++) {
                for (var e = b[c];
                        " " == e.charAt(0); )
                    e = e.slice(1);
                if (0 == e.indexOf(a))
                    return e.slice(a.length)
            }
            return 0
        },
        set: function (a, b, c) {
            var d = "";
            if (c) {
                var e = new Date;
                e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c), d = "; expires=" + e.toGMTString()
            }
            document.cookie = a + "=" + b + d + "; path=/"
        },
        remove: function (a) {
            $.fn.carouFredSel.cookie.set(a, "", -1)
        }
    }, $.extend($.easing, {
        quadratic: function (a) {
            var b = a * a;
            return a * (-b * a + 4 * b - 6 * a + 4)
        },
        cubic: function (a) {
            return a * (4 * a * a - 9 * a + 6)
        },
        elastic: function (a) {
            var b = a * a;
            return a * (33 * b * b - 106 * b * a + 126 * b - 67 * a + 15)
        }
    }))
})(jQuery);
;
(function ($) {
    $(function () {
        $('.gem-testimonials').each(function () {
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
//        $('body').updateTestimonialsCarousel();
        $('.fullwidth-block').each(function () {
            $(this).on('updateTestimonialsCarousel', function () {
                $(this).updateTestimonialsCarousel();
            });
        });
        $('.gem_tab').on('tab-update', function () {
            $(this).updateTestimonialsCarousel();
        });
        $('.gem_accordion_content').on('accordion-update', function () {
            $(this).updateTestimonialsCarousel();
        });
    });
    $.fn.updateTestimonialsCarousel = function () {
        $('.gem-testimonials', this).add($(this).filter('.gem-testimonials')).each(function () {
            var $testimonialsElement = $(this);
            var $testimonialsCarousel = $('.gem-testimonials-carousel', $testimonialsElement);
            var $testimonials = $('.gem-testimonial-item', $testimonialsCarousel);
            var $testimonialsPrev = $('.gem-testimonials-prev', $testimonialsElement);
            var $testimonialsNext = $('.gem-testimonials-next', $testimonialsElement);
            $testimonialsElement.thegemPreloader(function () {
                var $testimonialsView = $testimonialsCarousel.carouFredSel({
                    auto: ($testimonialsElement.data('autoscroll') > 0 ? $testimonialsElement.data('autoscroll') : false),
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
                        onBefore: function (data) {
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
})(jQuery);
;
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
    encodeUrl: function (a) {
        return encodeURIComponent(a)
    },
    escapeHTML: function (a) {
        return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")
    },
    absolutizeUrl: function (a) {
        var b = document.createElement("div");
        return b.innerHTML = '<a href="' + this.escapeHTML(a) + '">x</a>', b.firstChild.href
    },
    getScriptPath: function (a) {
        for (var b, c, d, e, f, g, h = 0, i = "", j = "", k = document.getElementsByTagName("script"), l = k.length, m = a.length; l > h; h++) {
            for (e = k[h].src, c = e.lastIndexOf("index.php"), c > - 1 ? (g = e.substring(c + 1), f = e.substring(0, c + 1)) : (g = e, f = ""), b = 0; m > b; b++)
                if (j = a[b], d = g.indexOf(j), d > -1) {
                    i = f;
                    break
                }
            if ("" !== i)
                break
        }
        return i
    },
    calculateTimeFormat: function (a, b, c) {
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
            if (-1 !== d.indexOf(m[o][1]))
                n = !0;
            else if (n) {
                for (var q = !1, r = o; p > r; r++)
                    if (m[r][0] > 0) {
                        q = !0;
                        break
                    }
                if (!q)
                    break;
                f || (d = e + d), d = m[o][1] + h + d, f && (d = m[o][1] + d), e = m[o][1]
            }
        b.currentTimeFormat = d
    },
    twoDigitsString: function (a) {
        return 10 > a ? "0" + a : String(a)
    },
    secondsToTimeCode: function (a, b) {
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
        for (i = 0, len = lis.length; i < len; i++)
            j = j.replace(lis[i][1] + lis[i][1], this.twoDigitsString(lis[i][0])), j = j.replace(lis[i][1], lis[i][0]);
        return j
    },
    timeCodeToSeconds: function (a, b, c, d) {
        "undefined" == typeof c ? c = !1 : "undefined" == typeof d && (d = 25);
        var e = a.split(":"),
                f = parseInt(e[0], 10),
                g = parseInt(e[1], 10),
                h = parseInt(e[2], 10),
                i = 0,
                j = 0;
        return c && (i = parseInt(e[3]) / d), j = 3600 * f + 60 * g + h + i
    },
    convertSMPTEtoSeconds: function (a) {
        if ("string" != typeof a)
            return !1;
        a = a.replace(",", ".");
        var b = 0,
                c = -1 != a.indexOf(".") ? a.split(".")[1].length : 0,
                d = 1;
        a = a.split(":").reverse();
        for (var e = 0; e < a.length; e++)
            d = 1, e > 0 && (d = Math.pow(60, e)), b += Number(a[e]) * d;
        return Number(b.toFixed(c))
    },
    removeSwf: function (a) {
        var b = document.getElementById(a);
        b && /object|embed/i.test(b.nodeName) && (mejs.MediaFeatures.isIE ? (b.style.display = "none", function () {
            4 == b.readyState ? mejs.Utility.removeObjectInIE(a) : setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    },
    removeObjectInIE: function (a) {
        var b = document.getElementById(a);
        if (b) {
            for (var c in b)
                "function" == typeof b[c] && (b[c] = null);
            b.parentNode.removeChild(b)
        }
    },
    determineScheme: function (a) {
        return a && -1 != a.indexOf("://") ? a.substr(0, a.indexOf("://") + 3) : "//"
    }
}, mejs.PluginDetector = {
    hasPluginVersion: function (a, b) {
        var c = this.plugins[a];
        return b[1] = b[1] || 0, b[2] = b[2] || 0, c[0] > b[0] || c[0] == b[0] && c[1] > b[1] || c[0] == b[0] && c[1] == b[1] && c[2] >= b[2] ? !0 : !1
    },
    nav: window.navigator,
    ua: window.navigator.userAgent.toLowerCase(),
    plugins: [],
    addPlugin: function (a, b, c, d, e) {
        this.plugins[a] = this.detectPlugin(b, c, d, e)
    },
    detectPlugin: function (a, b, c, d) {
        var e, f, g, h = [0, 0, 0];
        if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[a]) {
            if (e = this.nav.plugins[a].description, e && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[b] || this.nav.mimeTypes[b].enabledPlugin))
                for (h = e.replace(a, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), f = 0; f < h.length; f++)
                    h[f] = parseInt(h[f].match(/\d+/), 10)
        } else if ("undefined" != typeof window.ActiveXObject)
            try {
                g = new ActiveXObject(c), g && (h = d(g))
            } catch (i) {
            }
        return h
    }
}, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function (a) {
    var b = [],
            c = a.GetVariable("$version");
    return c && (c = c.split(" ")[1].split(","), b = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)]), b
}), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function (a) {
    var b = [0, 0, 0, 0],
            c = function (a, b, c, d) {
                for (; a.isVersionSupported(b[0] + "." + b[1] + "." + b[2] + "." + b[3]); )
                    b[c] += d;
                b[c] -= d
            };
    return c(a, b, 0, 1), c(a, b, 1, 1), c(a, b, 2, 1e4), c(a, b, 2, 1e3), c(a, b, 2, 100), c(a, b, 2, 10), c(a, b, 2, 1), c(a, b, 3, 1), b
}), mejs.MediaFeatures = {
    init: function () {
        var a, b, c = this,
                d = document,
                e = mejs.PluginDetector.nav,
                f = mejs.PluginDetector.ua.toLowerCase(),
                g = ["source", "track", "audio", "video"];
        c.isiPad = null !== f.match(/ipad/i), c.isiPhone = null !== f.match(/iphone/i), c.isiOS = c.isiPhone || c.isiPad, c.isAndroid = null !== f.match(/android/i), c.isBustedAndroid = null !== f.match(/android 2\.[12]/), c.isBustedNativeHTTPS = "https:" === location.protocol && (null !== f.match(/android [12]\./) || null !== f.match(/macintosh.* version.* safari/)), c.isIE = -1 != e.appName.toLowerCase().indexOf("microsoft") || null !== e.appName.toLowerCase().match(/trident/gi), c.isChrome = null !== f.match(/chrome/gi), c.isChromium = null !== f.match(/chromium/gi), c.isFirefox = null !== f.match(/firefox/gi), c.isWebkit = null !== f.match(/webkit/gi), c.isGecko = null !== f.match(/gecko/gi) && !c.isWebkit && !c.isIE, c.isOpera = null !== f.match(/opera/gi), c.hasTouch = "ontouchstart" in window, c.svgAsImg = !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        for (a = 0; a < g.length; a++)
            b = document.createElement(g[a]);
        c.supportsMediaTag = "undefined" != typeof b.canPlayType || c.isBustedAndroid;
        try {
            b.canPlayType("video/mp4")
        } catch (h) {
            c.supportsMediaTag = !1
        }
        c.supportsPointerEvents = function () {
            var a, b = document.createElement("x"),
                    c = document.documentElement,
                    d = window.getComputedStyle;
            return "pointerEvents" in b.style ? (b.style.pointerEvents = "auto", b.style.pointerEvents = "x", c.appendChild(b), a = d && "auto" === d(b, "").pointerEvents, c.removeChild(b), !!a) : !1
        }(), c.hasFirefoxPluginMovingProblem = !1, c.hasiOSFullScreen = "undefined" != typeof b.webkitEnterFullscreen, c.hasNativeFullscreen = "undefined" != typeof b.requestFullscreen, c.hasWebkitNativeFullScreen = "undefined" != typeof b.webkitRequestFullScreen, c.hasMozNativeFullScreen = "undefined" != typeof b.mozRequestFullScreen, c.hasMsNativeFullScreen = "undefined" != typeof b.msRequestFullscreen, c.hasTrueNativeFullScreen = c.hasWebkitNativeFullScreen || c.hasMozNativeFullScreen || c.hasMsNativeFullScreen, c.nativeFullScreenEnabled = c.hasTrueNativeFullScreen, c.hasMozNativeFullScreen ? c.nativeFullScreenEnabled = document.mozFullScreenEnabled : c.hasMsNativeFullScreen && (c.nativeFullScreenEnabled = document.msFullscreenEnabled), c.isChrome && (c.hasiOSFullScreen = !1), c.hasTrueNativeFullScreen && (c.fullScreenEventName = "", c.hasWebkitNativeFullScreen ? c.fullScreenEventName = "webkitfullscreenchange" : c.hasMozNativeFullScreen ? c.fullScreenEventName = "mozfullscreenchange" : c.hasMsNativeFullScreen && (c.fullScreenEventName = "MSFullscreenChange"), c.isFullScreen = function () {
            return c.hasMozNativeFullScreen ? d.mozFullScreen : c.hasWebkitNativeFullScreen ? d.webkitIsFullScreen : c.hasMsNativeFullScreen ? null !== d.msFullscreenElement : void 0
        }, c.requestFullScreen = function (a) {
            c.hasWebkitNativeFullScreen ? a.webkitRequestFullScreen() : c.hasMozNativeFullScreen ? a.mozRequestFullScreen() : c.hasMsNativeFullScreen && a.msRequestFullscreen()
        }, c.cancelFullScreen = function () {
            c.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : c.hasMozNativeFullScreen ? document.mozCancelFullScreen() : c.hasMsNativeFullScreen && document.msExitFullscreen()
        }), c.hasiOSFullScreen && f.match(/mac os x 10_5/i) && (c.hasNativeFullScreen = !1, c.hasiOSFullScreen = !1)
    }
}, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
    pluginType: "native",
    isFullScreen: !1,
    setCurrentTime: function (a) {
        this.currentTime = a
    },
    setMuted: function (a) {
        this.muted = a
    },
    setVolume: function (a) {
        this.volume = a
    },
    stop: function () {
        this.pause()
    },
    setSrc: function (a) {
        for (var b = this.getElementsByTagName("source"); b.length > 0; )
            this.removeChild(b[0]);
        if ("string" == typeof a)
            this.src = a;
        else {
            var c, d;
            for (c = 0; c < a.length; c++)
                if (d = a[c], this.canPlayType(d.type)) {
                    this.src = d.src;
                    break
                }
        }
    },
    setVideoSize: function (a, b) {
        this.width = a, this.height = b
    }
}, mejs.PluginMediaElement = function (a, b, c) {
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
    play: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
    },
    load: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
    },
    pause: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? 1 == this.pluginApi.getPlayerState() && this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
    },
    stop: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
    },
    canPlayType: function (a) {
        var b, c, d, e = mejs.plugins[this.pluginType];
        for (b = 0; b < e.length; b++)
            if (d = e[b], mejs.PluginDetector.hasPluginVersion(this.pluginType, d.version))
                for (c = 0; c < d.types.length; c++)
                    if (a == d.types[c])
                        return "probably";
        return ""
    },
    positionFullscreenButton: function (a, b, c) {
        null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(a), Math.floor(b), c)
    },
    hideFullscreenButton: function () {
        null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
    },
    setSrc: function (a) {
        if ("string" == typeof a)
            this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a)), this.src = mejs.Utility.absolutizeUrl(a);
        else {
            var b, c;
            for (b = 0; b < a.length; b++)
                if (c = a[b], this.canPlayType(c.type)) {
                    this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src)), this.src = mejs.Utility.absolutizeUrl(c.src);
                    break
                }
        }
    },
    setCurrentTime: function (a) {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.seekTo(a) : this.pluginApi.setCurrentTime(a), this.currentTime = a)
    },
    setVolume: function (a) {
        null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.setVolume(100 * a) : this.pluginApi.setVolume(a), this.volume = a)
    },
    setMuted: function (a) {
        null != this.pluginApi && ("youtube" == this.pluginType ? (a ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = a, this.dispatchEvent({
            type: "volumechange"
        })) : this.pluginApi.setMuted(a), this.muted = a)
    },
    setVideoSize: function (a, b) {
        this.pluginElement && this.pluginElement.style && (this.pluginElement.style.width = a + "px", this.pluginElement.style.height = b + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(a, b)
    },
    setFullscreen: function (a) {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(a)
    },
    enterFullScreen: function () {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
    },
    exitFullScreen: function () {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
    },
    addEventListener: function (a, b, c) {
        this.events[a] = this.events[a] || [], this.events[a].push(b)
    },
    removeEventListener: function (a, b) {
        if (!a)
            return this.events = {}, !0;
        var c = this.events[a];
        if (!c)
            return !0;
        if (!b)
            return this.events[a] = [], !0;
        for (var d = 0; d < c.length; d++)
            if (c[d] === b)
                return this.events[a].splice(d, 1), !0;
        return !1
    },
    dispatchEvent: function (a) {
        var b, c = this.events[a.type];
        if (c)
            for (b = 0; b < c.length; b++)
                c[b].apply(this, [a])
    },
    hasAttribute: function (a) {
        return a in this.attributes
    },
    removeAttribute: function (a) {
        delete this.attributes[a]
    },
    getAttribute: function (a) {
        return this.hasAttribute(a) ? this.attributes[a] : ""
    },
    setAttribute: function (a, b) {
        this.attributes[a] = b
    },
    remove: function () {
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
    success: function () {},
    error: function () {}
}, mejs.MediaElement = function (a, b) {
    return mejs.HtmlMediaElementShim.create(a, b)
}, mejs.HtmlMediaElementShim = {
    create: function (a, b) {
        var c, d, e = {},
                f = "string" == typeof a ? document.getElementById(a) : a,
                g = f.tagName.toLowerCase(),
                h = "audio" === g || "video" === g,
                i = h ? f.getAttribute("src") : f.getAttribute("href"),
                j = f.getAttribute("poster"),
                k = f.getAttribute("autoplay"),
                l = f.getAttribute("preload"),
                m = f.getAttribute("controls");
        for (d in mejs.MediaElementDefaults)
            e[d] = mejs.MediaElementDefaults[d];
        for (d in b)
            e[d] = b[d];
        return i = "undefined" == typeof i || null === i || "" == i ? null : i, j = "undefined" == typeof j || null === j ? "" : j, l = "undefined" == typeof l || null === l || "false" === l ? "none" : l, k = !("undefined" == typeof k || null === k || "false" === k), m = !("undefined" == typeof m || null === m || "false" === m), c = this.determinePlayback(f, e, mejs.MediaFeatures.supportsMediaTag, h, i), c.url = null !== c.url ? mejs.Utility.absolutizeUrl(c.url) : "", c.scheme = mejs.Utility.determineScheme(c.url), "native" == c.method ? (mejs.MediaFeatures.isBustedAndroid && (f.src = c.url, f.addEventListener("click", function () {
            f.play()
        }, !1)), this.updateNative(c, e, k, l)) : "" !== c.method ? this.createPlugin(c, e, j, k, l, m) : (this.createErrorMessage(c, e, j), this)
    },
    determinePlayback: function (a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, n, o, p, q = [],
                r = {
                    method: "",
                    url: "",
                    htmlMediaElement: a,
                    isVideo: "audio" != a.tagName.toLowerCase(),
                    scheme: ""
                };
        if ("undefined" != typeof b.type && "" !== b.type)
            if ("string" == typeof b.type)
                q.push({
                    type: b.type,
                    url: e
                });
            else
                for (f = 0; f < b.type.length; f++)
                    q.push({
                        type: b.type[f],
                        url: e
                    });
        else if (null !== e)
            k = this.formatType(e, a.getAttribute("type")), q.push({
                type: k,
                url: e
            });
        else
            for (f = 0; f < a.childNodes.length; f++)
                j = a.childNodes[f], 1 == j.nodeType && "source" == j.tagName.toLowerCase() && (e = j.getAttribute("src"), k = this.formatType(e, j.getAttribute("type")), p = j.getAttribute("media"), (!p || !window.matchMedia || window.matchMedia && window.matchMedia(p).matches) && q.push({
                    type: k,
                    url: e
                }));
        if (!d && q.length > 0 && null !== q[0].url && this.getTypeFromFile(q[0].url).indexOf("audio") > -1 && (r.isVideo = !1), mejs.MediaFeatures.isBustedAndroid && (a.canPlayType = function (a) {
            return null !== a.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
        }), mejs.MediaFeatures.isChromium && (a.canPlayType = function (a) {
            return null !== a.match(/video\/(webm|ogv|ogg)/gi) ? "maybe" : ""
        }), c && ("auto" === b.mode || "auto_plugin" === b.mode || "native" === b.mode) && (!mejs.MediaFeatures.isBustedNativeHTTPS || b.httpsBasicAuthSite !== !0)) {
            for (d || (o = document.createElement(r.isVideo ? "video" : "audio"), a.parentNode.insertBefore(o, a), a.style.display = "none", r.htmlMediaElement = a = o), f = 0; f < q.length; f++)
                if ("video/m3u8" == q[f].type || "" !== a.canPlayType(q[f].type).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/mp3/, "mpeg")).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/m4a/, "mp4")).replace(/no/, "")) {
                    r.method = "native", r.url = q[f].url;
                    break
                }
            if ("native" === r.method && (null !== r.url && (a.src = r.url), "auto_plugin" !== b.mode))
                return r
        }
        if ("auto" === b.mode || "auto_plugin" === b.mode || "shim" === b.mode)
            for (f = 0; f < q.length; f++)
                for (k = q[f].type, g = 0; g < b.plugins.length; g++)
                    for (l = b.plugins[g], m = mejs.plugins[l], h = 0; h < m.length; h++)
                        if (n = m[h], null == n.version || mejs.PluginDetector.hasPluginVersion(l, n.version))
                            for (i = 0; i < n.types.length; i++)
                                if (k.toLowerCase() == n.types[i].toLowerCase())
                                    return r.method = l, r.url = q[f].url, r;
        return "auto_plugin" === b.mode && "native" === r.method ? r : ("" === r.method && q.length > 0 && (r.url = q[0].url), r)
    },
    formatType: function (a, b) {
        return a && !b ? this.getTypeFromFile(a) : b && ~b.indexOf(";") ? b.substr(0, b.indexOf(";")) : b
    },
    getTypeFromFile: function (a) {
        a = a.split("?")[0];
        var b = a.substring(a.lastIndexOf(".") + 1).toLowerCase(),
                c = /(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b) ? "video/" : "audio/";
        return this.getTypeFromExtension(b, c)
    },
    getTypeFromExtension: function (a, b) {
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
    createErrorMessage: function (a, b, c) {
        var d = a.htmlMediaElement,
                e = document.createElement("div"),
                f = b.customError;
        e.className = "me-cannotplay";
        try {
            e.style.width = d.width + "px", e.style.height = d.height + "px"
        } catch (g) {
        }
        f || (f = '<a href="' + a.url + '">', "" !== c && (f += '<img src="' + c + '" width="100%" height="100%" alt="" />'), f += "<span>" + mejs.i18n.t("Download File") + "</span></a>"), e.innerHTML = f, d.parentNode.insertBefore(e, d), d.style.display = "none", b.error(d)
    },
    createPlugin: function (a, b, c, d, e, f) {
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
        for (h = j.parentNode; null !== h && null != h.tagName && "body" !== h.tagName.toLowerCase() && null != h.parentNode && null != h.parentNode.tagName && null != h.parentNode.constructor && "ShadowRoot" === h.parentNode.constructor.name; ) {
            if ("p" === h.parentNode.tagName.toLowerCase()) {
                h.parentNode.parentNode.insertBefore(h, h.parentNode);
                break
            }
            h = h.parentNode
        }
        switch (a.isVideo ? (k = b.pluginWidth > 0 ? b.pluginWidth : b.videoWidth > 0 ? b.videoWidth : null !== j.getAttribute("width") ? j.getAttribute("width") : b.defaultVideoWidth, l = b.pluginHeight > 0 ? b.pluginHeight : b.videoHeight > 0 ? b.videoHeight : null !== j.getAttribute("height") ? j.getAttribute("height") : b.defaultVideoHeight, k = mejs.Utility.encodeUrl(k), l = mejs.Utility.encodeUrl(l)) : b.enablePluginDebug && (k = 320, l = 240), n.success = b.success, o.className = "me-plugin", o.id = m + "_container", a.isVideo ? j.parentNode.insertBefore(o, j) : document.body.insertBefore(o, document.body.childNodes[0]), ("flash" === a.method || "silverlight" === a.method) && (i = ["id=" + m, "isvideo=" + (a.isVideo ? "true" : "false"), "autoplay=" + (d ? "true" : "false"), "preload=" + e, "width=" + k, "startvolume=" + b.startVolume, "timerrate=" + b.timerRate, "flashstreamer=" + b.flashStreamer, "height=" + l, "pseudostreamstart=" + b.pseudoStreamingStartQueryParam], null !== a.url && ("flash" == a.method ? i.push("file=" + mejs.Utility.encodeUrl(a.url)) : i.push("file=" + a.url)), b.enablePluginDebug && i.push("debug=true"), b.enablePluginSmoothing && i.push("smoothing=true"), b.enablePseudoStreaming && i.push("pseudostreaming=true"), f && i.push("controls=true"), b.pluginVars && (i = i.concat(b.pluginVars)), window[m + "_init"] = function () {
                switch (n.pluginType) {
                    case "flash":
                        n.pluginElement = n.pluginApi = document.getElementById(m);
                        break;
                    case "silverlight":
                        n.pluginElement = document.getElementById(n.id), n.pluginApi = n.pluginElement.Content.MediaElementJS
                }
                null != n.pluginApi && n.success && n.success(n, j)
            }, window[m + "_event"] = function (a, b) {
                var c, d, e;
                c = {
                    type: a,
                    target: n
                };
                for (d in b)
                    n[d] = b[d], c[d] = b[d];
                e = b.bufferedTime || 0, c.target.buffered = c.buffered = {
                    start: function (a) {
                        return 0
                    },
                    end: function (a) {
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
                if (-1 != a.url.lastIndexOf("youtu.be"))
                    r = a.url.substr(a.url.lastIndexOf("index.php") + 1), -1 != r.indexOf("?") && (r = r.substr(0, r.indexOf("?")));
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
                if (n.vimeoid = a.url.substr(a.url.lastIndexOf("index.php") + 1), o.innerHTML = '<iframe src="' + a.scheme + "player.vimeo.com/video/" + n.vimeoid + "?api=1&portrait=0&byline=0&title=0&player_id=" + t + '" width="' + k + '" height="' + l + '" frameborder="0" class="mejs-shim" id="' + t + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "function" == typeof $f) {
                    var u = $f(o.childNodes[0]),
                            v = -1;
                    u.addEvent("ready", function () {
                        function a(a, b, c, d) {
                            var e = {
                                type: c,
                                target: b
                            };
                            "timeupdate" == c && (b.currentTime = e.currentTime = d.seconds, b.duration = e.duration = d.duration), b.dispatchEvent(e)
                        }
                        u.playVideo = function () {
                            u.api("play")
                        }, u.stopVideo = function () {
                            u.api("unload")
                        }, u.pauseVideo = function () {
                            u.api("pause")
                        }, u.seekTo = function (a) {
                            u.api("seekTo", a)
                        }, u.setVolume = function (a) {
                            u.api("setVolume", a)
                        }, u.setMuted = function (a) {
                            a ? (u.lastVolume = u.api("getVolume"), u.api("setVolume", 0)) : (u.api("setVolume", u.lastVolume), delete u.lastVolume)
                        }, u.getPlayerState = function () {
                            return v
                        }, u.addEvent("play", function () {
                            v = 1, a(u, n, "play"), a(u, n, "playing")
                        }), u.addEvent("pause", function () {
                            v = 2, a(u, n, "pause")
                        }), u.addEvent("finish", function () {
                            v = 0, a(u, n, "ended")
                        }), u.addEvent("playProgress", function (b) {
                            a(u, n, "timeupdate", b)
                        }), u.addEvent("seek", function (b) {
                            v = 3, a(u, n, "seeked", b)
                        }), u.addEvent("loadProgress", function (b) {
                            v = 3, a(u, n, "progress", b)
                        }), n.pluginElement = o, n.pluginApi = u, n.success(n, n.pluginElement)
                    })
                } else
                    console.warn("You need to include froogaloop for vimeo to work")
        }
        return j.style.display = "none", j.removeAttribute("autoplay"), n
    },
    updateNative: function (a, b, c, d) {
        var e, f = a.htmlMediaElement;
        for (e in mejs.HtmlMediaElement)
            f[e] = mejs.HtmlMediaElement[e];
        return b.success(f, f), f
    }
}, mejs.YouTubeApi = {
    isIframeStarted: !1,
    isIframeLoaded: !1,
    loadIframeApi: function (a) {
        if (!this.isIframeStarted) {
            var b = document.createElement("script");
            b.src = a.scheme + "www.youtube.com/player_api";
            var c = document.getElementsByTagName("script")[0];
            c.parentNode.insertBefore(b, c), this.isIframeStarted = !0
        }
    },
    iframeQueue: [],
    enqueueIframe: function (a) {
        this.isLoaded ? this.createIframe(a) : (this.loadIframeApi(a), this.iframeQueue.push(a))
    },
    createIframe: function (a) {
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
                        onReady: function () {
                            c.setVideoSize = function (a, b) {
                                c.setSize(a, b)
                            }, a.pluginMediaElement.pluginApi = c, a.pluginMediaElement.pluginElement = document.getElementById(a.containerId), b.success(b, b.pluginElement), setInterval(function () {
                                mejs.YouTubeApi.createEvent(c, b, "timeupdate")
                            }, 250)
                        },
                        onStateChange: function (a) {
                            mejs.YouTubeApi.handleStateChange(a.data, c, b)
                        }
                    }
                })
    },
    createEvent: function (a, b, c) {
        var d = {
            type: c,
            target: b
        };
        if (a && a.getDuration) {
            b.currentTime = d.currentTime = a.getCurrentTime(), b.duration = d.duration = a.getDuration(), d.paused = b.paused, d.ended = b.ended, d.muted = a.isMuted(), d.volume = a.getVolume() / 100, d.bytesTotal = a.getVideoBytesTotal(), d.bufferedBytes = a.getVideoBytesLoaded();
            var e = d.bufferedBytes / d.bytesTotal * d.duration;
            d.target.buffered = d.buffered = {
                start: function (a) {
                    return 0
                },
                end: function (a) {
                    return e
                },
                length: 1
            }
        }
        b.dispatchEvent(d)
    },
    iFrameReady: function () {
        for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0; ) {
            var a = this.iframeQueue.pop();
            this.createIframe(a)
        }
    },
    flashPlayers: {},
    createFlash: function (a) {
        this.flashPlayers[a.pluginId] = a;
        var b, c = a.scheme + "www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=" + a.pluginId + "&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";
        mejs.MediaFeatures.isIE ? (b = document.createElement("div"), a.container.appendChild(b), b.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + a.scheme + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + a.pluginId + '" width="' + a.width + '" height="' + a.height + '" class="mejs-shim"><param name="movie" value="' + c + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + options.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /></object>') : a.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + a.pluginId + '" data="' + c + '" width="' + a.width + '" height="' + a.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="' + options.flashScriptAccess + '"><param name="wmode" value="transparent"></object>'
    },
    flashReady: function (a) {
        var b = this.flashPlayers[a],
                c = document.getElementById(a),
                d = b.pluginMediaElement;
        d.pluginApi = d.pluginElement = c, b.success(d, d.pluginElement), c.cueVideoById(b.videoId);
        var e = b.containerId + "_callback";
        window[e] = function (a) {
            mejs.YouTubeApi.handleStateChange(a, c, d)
        }, c.addEventListener("onStateChange", e), setInterval(function () {
            mejs.YouTubeApi.createEvent(c, d, "timeupdate")
        }, 250), mejs.YouTubeApi.createEvent(c, d, "canplay")
    },
    handleStateChange: function (a, b, c) {
        switch (a) {
            case - 1:
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
}, window.onYouTubePlayerAPIReady = function () {
    mejs.YouTubeApi.iFrameReady()
}, window.onYouTubePlayerReady = function (a) {
    mejs.YouTubeApi.flashReady(a)
}, window.mejs = mejs, window.MediaElement = mejs.MediaElement,
        function (a, b, c) {
            "use strict";
            var d = {
                locale: {
                    language: b.i18n && b.i18n.locale.language || "",
                    strings: b.i18n && b.i18n.locale.strings || {}
                },
                ietf_lang_regex: /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/,
                methods: {}
            };
            d.getLanguage = function () {
                var a = d.locale.language || window.navigator.userLanguage || window.navigator.language;
                return d.ietf_lang_regex.exec(a) ? a : null
            }, "undefined" != typeof mejsL10n && (d.locale.language = mejsL10n.language), d.methods.checkPlain = function (a) {
                var b, c, d = {
                    "&": "&amp;",
                    '"': "&quot;",
                    "<": "&lt;",
                    ">": "&gt;"
                };
                a = String(a);
                for (b in d)
                    d.hasOwnProperty(b) && (c = new RegExp(b, "g"), a = a.replace(c, d[b]));
                return a
            }, d.methods.t = function (a, b) {
                return d.locale.strings && d.locale.strings[b.context] && d.locale.strings[b.context][a] && (a = d.locale.strings[b.context][a]), d.methods.checkPlain(a)
            }, d.t = function (a, b) {
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
        function (a, b) {
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
        "undefined" != typeof jQuery ? mejs.$ = jQuery : "undefined" != typeof Zepto ? (mejs.$ = Zepto, Zepto.fn.outerWidth = function (a) {
            var b = $(this).width();
            return a && (b += parseInt($(this).css("margin-right"), 10), b += parseInt($(this).css("margin-left"), 10)), b
        }) : "undefined" != typeof ender && (mejs.$ = ender),
        function (a) {
            mejs.MepDefaults = {
                poster: "",
                showPosterWhenEnded: !1,
                defaultVideoWidth: 480,
                defaultVideoHeight: 270,
                videoWidth: -1,
                videoHeight: -1,
                defaultAudioWidth: 400,
                defaultAudioHeight: 30,
                defaultSeekBackwardInterval: function (a) {
                    return .05 * a.duration
                },
                defaultSeekForwardInterval: function (a) {
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
                        action: function (a, b) {
                            b.paused || b.ended ? b.play() : b.pause()
                        }
                    }, {
                        keys: [38],
                        action: function (a, b) {
                            a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                            var c = Math.min(b.volume + .1, 1);
                            b.setVolume(c)
                        }
                    }, {
                        keys: [40],
                        action: function (a, b) {
                            a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                            var c = Math.max(b.volume - .1, 0);
                            b.setVolume(c)
                        }
                    }, {
                        keys: [37, 227],
                        action: function (a, b) {
                            if (!isNaN(b.duration) && b.duration > 0) {
                                a.isVideo && (a.showControls(), a.startControlsTimer());
                                var c = Math.max(b.currentTime - a.options.defaultSeekBackwardInterval(b), 0);
                                b.setCurrentTime(c)
                            }
                        }
                    }, {
                        keys: [39, 228],
                        action: function (a, b) {
                            if (!isNaN(b.duration) && b.duration > 0) {
                                a.isVideo && (a.showControls(), a.startControlsTimer());
                                var c = Math.min(b.currentTime + a.options.defaultSeekForwardInterval(b), b.duration);
                                b.setCurrentTime(c)
                            }
                        }
                    }, {
                        keys: [70],
                        action: function (a, b) {
                            "undefined" != typeof a.enterFullScreen && (a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen())
                        }
                    }, {
                        keys: [77],
                        action: function (a, b) {
                            a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer()), a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                        }
                    }]
            }, mejs.mepIndex = 0, mejs.players = {}, mejs.MediaElementPlayer = function (b, c) {
                if (!(this instanceof mejs.MediaElementPlayer))
                    return new mejs.MediaElementPlayer(b, c);
                var d = this;
                return d.$media = d.$node = a(b), d.node = d.media = d.$media[0], d.node ? "undefined" != typeof d.node.player ? d.node.player : ("undefined" == typeof c && (c = d.$node.data("mejsoptions")), d.options = a.extend({}, mejs.MepDefaults, c), d.options.timeFormat || (d.options.timeFormat = "mm:ss", d.options.alwaysShowHours && (d.options.timeFormat = "hh:mm:ss"), d.options.showTimecodeFrameCount && (d.options.timeFormat += ":ff")), mejs.Utility.calculateTimeFormat(0, d.options, d.options.framesPerSecond || 25), d.id = "mep_" + mejs.mepIndex++, mejs.players[d.id] = d, d.init(), d) : void 0
            }, mejs.MediaElementPlayer.prototype = {
                hasFocus: !1,
                controlsAreVisible: !0,
                init: function () {
                    var b = this,
                            c = mejs.MediaFeatures,
                            d = a.extend(!0, {}, b.options, {
                                success: function (a, c) {
                                    b.meReady(a, c)
                                },
                                error: function (a) {
                                    b.handleError(a)
                                }
                            }),
                            e = b.media.tagName.toLowerCase();
                    if (b.isDynamic = "audio" !== e && "video" !== e, b.isDynamic ? b.isVideo = b.options.isVideo : b.isVideo = "audio" !== e && b.options.isVideo, c.isiPad && b.options.iPadUseNativeControls || c.isiPhone && b.options.iPhoneUseNativeControls)
                        b.$media.attr("controls", "controls"), c.isiPad && null !== b.media.getAttribute("autoplay") && b.play();
                    else if (c.isAndroid && b.options.AndroidUseNativeControls)
                        ;
                    else {
                        b.$media.removeAttr("controls");
                        var f = b.isVideo ? mejs.i18n.t("Video Player") : mejs.i18n.t("Audio Player");
                        a('<span class="mejs-offscreen">' + f + "</span>").insertBefore(b.$media), b.container = a('<div id="' + b.id + '" class="mejs-container ' + (mejs.MediaFeatures.svgAsImg ? "svg" : "no-svg") + '" tabindex="0" role="application" aria-label="' + f + '"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(b.$media[0].className).insertBefore(b.$media).focus(function (a) {
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
                showControls: function (a) {
                    var b = this;
                    a = "undefined" == typeof a || a, b.controlsAreVisible || (a ? (b.controls.removeClass("mejs-offscreen").stop(!0, !0).fadeIn(200, function () {
                        b.controlsAreVisible = !0, b.container.trigger("controlsshown")
                    }), b.container.find(".mejs-control").removeClass("mejs-offscreen").stop(!0, !0).fadeIn(200, function () {
                        b.controlsAreVisible = !0
                    })) : (b.controls.removeClass("mejs-offscreen").css("display", "block"), b.container.find(".mejs-control").removeClass("mejs-offscreen").css("display", "block"), b.controlsAreVisible = !0, b.container.trigger("controlsshown")), b.setControlsSize())
                },
                hideControls: function (b) {
                    var c = this;
                    b = "undefined" == typeof b || b, !c.controlsAreVisible || c.options.alwaysShowControls || c.keyboardAction || (b ? (c.controls.stop(!0, !0).fadeOut(200, function () {
                        a(this).addClass("mejs-offscreen").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")
                    }), c.container.find(".mejs-control").stop(!0, !0).fadeOut(200, function () {
                        a(this).addClass("mejs-offscreen").css("display", "block")
                    })) : (c.controls.addClass("mejs-offscreen").css("display", "block"), c.container.find(".mejs-control").addClass("mejs-offscreen").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")))
                },
                controlsTimer: null,
                startControlsTimer: function (a) {
                    var b = this;
                    a = "undefined" != typeof a ? a : 1500, b.killControlsTimer("start"), b.controlsTimer = setTimeout(function () {
                        b.hideControls(), b.killControlsTimer("hide")
                    }, a)
                },
                killControlsTimer: function (a) {
                    var b = this;
                    null !== b.controlsTimer && (clearTimeout(b.controlsTimer), delete b.controlsTimer, b.controlsTimer = null)
                },
                controlsEnabled: !0,
                disableControls: function () {
                    var a = this;
                    a.killControlsTimer(), a.hideControls(!1), this.controlsEnabled = !1
                },
                enableControls: function () {
                    var a = this;
                    a.showControls(!1), a.controlsEnabled = !0
                },
                meReady: function (b, c) {
                    var d, e, f = this,
                            g = mejs.MediaFeatures,
                            h = c.getAttribute("autoplay"),
                            i = !("undefined" == typeof h || null === h || "false" === h);
                    if (!f.created) {
                        if (f.created = !0, f.media = b, f.domNode = c, !(g.isAndroid && f.options.AndroidUseNativeControls || g.isiPad && f.options.iPadUseNativeControls || g.isiPhone && f.options.iPhoneUseNativeControls)) {
                            f.buildposter(f, f.controls, f.layers, f.media), f.buildkeyboard(f, f.controls, f.layers, f.media), f.buildoverlays(f, f.controls, f.layers, f.media), f.findTracks();
                            for (d in f.options.features)
                                if (e = f.options.features[d], f["build" + e])
                                    try {
                                        f["build" + e](f, f.controls, f.layers, f.media)
                                    } catch (j) {
                                    }
                            f.container.trigger("controlsready"), f.setPlayerSize(f.width, f.height), f.setControlsSize(), f.isVideo && (mejs.MediaFeatures.hasTouch ? f.$media.bind("touchstart", function () {
                                f.controlsAreVisible ? f.hideControls(!1) : f.controlsEnabled && f.showControls(!1)
                            }) : (f.clickToPlayPauseCallback = function () {
                                f.options.clickToPlayPause && (f.media.paused ? f.play() : f.pause())
                            }, f.media.addEventListener("click", f.clickToPlayPauseCallback, !1), f.container.bind("mouseenter", function () {
                                f.controlsEnabled && (f.options.alwaysShowControls || (f.killControlsTimer("enter"), f.showControls(), f.startControlsTimer(2500)))
                            }).bind("mousemove", function () {
                                f.controlsEnabled && (f.controlsAreVisible || f.showControls(), f.options.alwaysShowControls || f.startControlsTimer(2500))
                            }).bind("mouseleave", function () {
                                f.controlsEnabled && (f.media.paused || f.options.alwaysShowControls || f.startControlsTimer(1e3))
                            })), f.options.hideVideoControlsOnLoad && f.hideControls(!1), i && !f.options.alwaysShowControls && f.hideControls(), f.options.enableAutosize && f.media.addEventListener("loadedmetadata", function (a) {
                                f.options.videoHeight <= 0 && null === f.domNode.getAttribute("height") && !isNaN(a.target.videoHeight) && (f.setPlayerSize(a.target.videoWidth, a.target.videoHeight), f.setControlsSize(), f.media.setVideoSize(a.target.videoWidth, a.target.videoHeight))
                            }, !1)), f.media.addEventListener("play", function () {
                                var a;
                                for (a in mejs.players) {
                                    var b = mejs.players[a];
                                    b.id == f.id || !f.options.pauseOtherPlayers || b.paused || b.ended || b.pause(), b.hasFocus = !1
                                }
                                f.hasFocus = !0
                            }, !1), f.media.addEventListener("ended", function (b) {
                                if (f.options.autoRewind)
                                    try {
                                        f.media.setCurrentTime(0), window.setTimeout(function () {
                                            a(f.container).find(".mejs-overlay-loading").parent().hide()
                                        }, 20)
                                    } catch (c) {
                                    }
                                f.media.pause(), f.setProgressRail && f.setProgressRail(), f.setCurrentRail && f.setCurrentRail(), f.options.loop ? f.play() : !f.options.alwaysShowControls && f.controlsEnabled && f.showControls()
                            }, !1), f.media.addEventListener("loadedmetadata", function (a) {
                                f.updateDuration && f.updateDuration(), f.updateCurrent && f.updateCurrent(), f.isFullScreen || (f.setPlayerSize(f.width, f.height), f.setControlsSize())
                            }, !1);
                            var k = null;
                            f.media.addEventListener("timeupdate", function () {
                                k !== this.duration && (k = this.duration, mejs.Utility.calculateTimeFormat(k, f.options, f.options.framesPerSecond || 25), f.updateDuration && f.updateDuration(), f.updateCurrent && f.updateCurrent(), f.setControlsSize())
                            }, !1), f.container.focusout(function (b) {
                                if (b.relatedTarget) {
                                    var c = a(b.relatedTarget);
                                    f.keyboardAction && 0 === c.parents(".mejs-container").length && (f.keyboardAction = !1, f.hideControls(!0))
                                }
                            }), setTimeout(function () {
                                f.setPlayerSize(f.width, f.height), f.setControlsSize()
                            }, 50), f.globalBind("resize", function () {
                                f.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen || f.setPlayerSize(f.width, f.height), f.setControlsSize()
                            }), "youtube" == f.media.pluginType && (g.isiOS || g.isAndroid) && (f.container.find(".mejs-overlay-play").hide(), f.container.find(".mejs-poster").hide())
                        }
                        i && "native" == b.pluginType && f.play(), f.options.success && ("string" == typeof f.options.success ? window[f.options.success](f.media, f.domNode, f) : f.options.success(f.media, f.domNode, f))
                    }
                },
                handleError: function (a) {
                    var b = this;
                    b.controls && b.controls.hide(), b.options.error && b.options.error(a)
                },
                setPlayerSize: function (a, b) {
                    var c = this;
                    if (!c.options.setDimensions)
                        return !1;
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
                hasFluidMode: function () {
                    var a = this;
                    return a.height.toString().indexOf("%") > 0 || "none" !== a.$node.css("max-width") && "t.width" !== a.$node.css("max-width") || a.$node[0].currentStyle && "100%" === a.$node[0].currentStyle.maxWidth
                },
                setResponsiveMode: function () {
                    var b = this,
                            c = function () {
                                return b.isVideo ? b.media.videoWidth && b.media.videoWidth > 0 ? b.media.videoWidth : null !== b.media.getAttribute("width") ? b.media.getAttribute("width") : b.options.defaultVideoWidth : b.options.defaultAudioWidth
                            }(),
                            d = function () {
                                return b.isVideo ? b.media.videoHeight && b.media.videoHeight > 0 ? b.media.videoHeight : null !== b.media.getAttribute("height") ? b.media.getAttribute("height") : b.options.defaultVideoHeight : b.options.defaultAudioHeight
                            }(),
                            e = b.container.parent().closest(":visible").width(),
                            f = b.container.parent().closest(":visible").height(),
                            g = b.isVideo || !b.options.autosizeProgress ? parseInt(e * d / c, 10) : d;
                    (isNaN(g) || 0 !== f && g > f && f > d) && (g = f), b.container.parent().length > 0 && "body" === b.container.parent()[0].tagName.toLowerCase() && (e = a(window).width(), g = a(window).height()), g && e && (b.container.width(e).height(g), b.$media.add(b.container.find(".mejs-shim")).width("100%").height("100%"), b.isVideo && b.media.setVideoSize && b.media.setVideoSize(e, g), b.layers.children(".mejs-layer").width("100%").height("100%"))
                },
                setFillMode: function () {
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
                setDimensions: function (a, b) {
                    var c = this;
                    c.container.width(a).height(b), c.layers.children(".mejs-layer").width(a).height(b)
                },
                setControlsSize: function () {
                    var b = this,
                            c = 0,
                            d = 0,
                            e = b.controls.find(".mejs-time-rail"),
                            f = b.controls.find(".mejs-time-total"),
                            g = e.siblings(),
                            h = g.last(),
                            i = null;
                    if (b.container.is(":visible") && e.length && e.is(":visible")) {
                        b.options && !b.options.autosizeProgress && (d = parseInt(e.css("width"), 10)), 0 !== d && d || (g.each(function () {
                            var b = a(this);
                            "absolute" != b.css("position") && b.is(":visible") && (c += a(this).outerWidth(!0))
                        }), d = b.controls.width() - c - (e.outerWidth(!0) - e.width()));
                        do
                            e.width(d), f.width(d - (f.outerWidth(!0) - f.width())), "absolute" != h.css("position") && (i = h.length ? h.position() : null, d--);
                        while (null !== i && i.top.toFixed(2) > 0 && d > 0);
                        b.container.trigger("controlsresize")
                    }
                },
                buildposter: function (b, c, d, e) {
                    var f = this,
                            g = a('<div class="mejs-poster mejs-layer"></div>').appendTo(d),
                            h = b.$media.attr("poster");
                    "" !== b.options.poster && (h = b.options.poster), h ? f.setPoster(h) : g.hide(), e.addEventListener("play", function () {
                        g.hide()
                    }, !1), b.options.showPosterWhenEnded && b.options.autoRewind && e.addEventListener("ended", function () {
                        g.show()
                    }, !1)
                },
                setPoster: function (b) {
                    var c = this,
                            d = c.container.find(".mejs-poster"),
                            e = d.find("img");
                    0 === e.length && (e = a('<img width="100%" height="100%" alt="" />').appendTo(d)), e.attr("src", b), d.css({
                        "background-image": "url(" + b + ")"
                    })
                },
                buildoverlays: function (b, c, d, e) {
                    var f = this;
                    if (b.isVideo) {
                        var g = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(d),
                                h = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(d),
                                i = a('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(d).bind("click", function () {
                            f.options.clickToPlayPause && e.paused && e.play()
                        });
                        e.addEventListener("play", function () {
                            i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                        }, !1), e.addEventListener("playing", function () {
                            i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                        }, !1), e.addEventListener("seeking", function () {
                            g.show(), c.find(".mejs-time-buffering").show()
                        }, !1), e.addEventListener("seeked", function () {
                            g.hide(), c.find(".mejs-time-buffering").hide()
                        }, !1), e.addEventListener("pause", function () {
                            mejs.MediaFeatures.isiPhone || i.show()
                        }, !1), e.addEventListener("waiting", function () {
                            g.show(), c.find(".mejs-time-buffering").show()
                        }, !1), e.addEventListener("loadeddata", function () {
                            g.show(), c.find(".mejs-time-buffering").show(), mejs.MediaFeatures.isAndroid && (e.canplayTimeout = window.setTimeout(function () {
                                if (document.createEvent) {
                                    var a = document.createEvent("HTMLEvents");
                                    return a.initEvent("canplay", !0, !0), e.dispatchEvent(a)
                                }
                            }, 300))
                        }, !1), e.addEventListener("canplay", function () {
                            g.hide(), c.find(".mejs-time-buffering").hide(), clearTimeout(e.canplayTimeout)
                        }, !1), e.addEventListener("error", function (a) {
                            f.handleError(a), g.hide(), i.hide(), h.show(), h.find(".mejs-overlay-error").html("Error loading this resource")
                        }, !1), e.addEventListener("keydown", function (a) {
                            f.onkeydown(b, e, a)
                        }, !1)
                    }
                },
                buildkeyboard: function (b, c, d, e) {
                    var f = this;
                    f.container.keydown(function () {
                        f.keyboardAction = !0
                    }), f.globalBind("keydown", function (c) {
                        return b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length && a(c.target).closest(".mejs-container").attr("id") === b.$media.closest(".mejs-container").attr("id"), f.onkeydown(b, e, c)
                    }), f.globalBind("click", function (c) {
                        b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length
                    })
                },
                onkeydown: function (a, b, c) {
                    if (a.hasFocus && a.options.enableKeyboard)
                        for (var d = 0, e = a.options.keyActions.length; e > d; d++)
                            for (var f = a.options.keyActions[d], g = 0, h = f.keys.length; h > g; g++)
                                if (c.keyCode == f.keys[g])
                                    return "function" == typeof c.preventDefault && c.preventDefault(), f.action(a, b, c.keyCode, c), !1;
                    return !0
                },
                findTracks: function () {
                    var b = this,
                            c = b.$media.find("track");
                    b.tracks = [], c.each(function (c, d) {
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
                changeSkin: function (a) {
                    this.container[0].className = "mejs-container " + a, this.setPlayerSize(this.width, this.height), this.setControlsSize()
                },
                play: function () {
                    this.load(), this.media.play()
                },
                pause: function () {
                    try {
                        this.media.pause()
                    } catch (a) {
                    }
                },
                load: function () {
                    this.isLoaded || this.media.load(), this.isLoaded = !0
                },
                setMuted: function (a) {
                    this.media.setMuted(a)
                },
                setCurrentTime: function (a) {
                    this.media.setCurrentTime(a)
                },
                getCurrentTime: function () {
                    return this.media.currentTime
                },
                setVolume: function (a) {
                    this.media.setVolume(a)
                },
                getVolume: function () {
                    return this.media.volume
                },
                setSrc: function (a) {
                    this.media.setSrc(a)
                },
                remove: function () {
                    var a, b, c = this;
                    c.container.prev(".mejs-offscreen").remove();
                    for (a in c.options.features)
                        if (b = c.options.features[a], c["clean" + b])
                            try {
                                c["clean" + b](c)
                            } catch (d) {
                            }
                    c.isDynamic ? c.$node.insertBefore(c.container) : (c.$media.prop("controls", !0), c.$node.clone().insertBefore(c.container).show(), c.$node.remove()), "native" !== c.media.pluginType && c.media.remove(), delete mejs.players[c.id], "object" == typeof c.container && c.container.remove(), c.globalUnbind(), delete c.node.player
                },
                rebuildtracks: function () {
                    var a = this;
                    a.findTracks(), a.buildtracks(a, a.controls, a.layers, a.media)
                },
                resetSize: function () {
                    var a = this;
                    setTimeout(function () {
                        a.setPlayerSize(a.width, a.height), a.setControlsSize()
                    }, 50)
                }
            },
                    function () {
                        function b(b, d) {
                            var e = {
                                d: [],
                                w: []
                            };
                            return a.each((b || "").split(" "), function (a, b) {
                                var f = b + "." + d;
                                0 === f.indexOf(".") ? (e.d.push(f), e.w.push(f)) : e[c.test(b) ? "w" : "d"].push(f)
                            }), e.d = e.d.join(" "), e.w = e.w.join(" "), e
                        }
                        var c = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
                        mejs.MediaElementPlayer.prototype.globalBind = function (c, d, e) {
                            var f = this,
                                    g = f.node ? f.node.ownerDocument : document;
                            c = b(c, f.id), c.d && a(g).bind(c.d, d, e), c.w && a(window).bind(c.w, d, e)
                        }, mejs.MediaElementPlayer.prototype.globalUnbind = function (c, d) {
                            var e = this,
                                    f = e.node ? e.node.ownerDocument : document;
                            c = b(c, e.id), c.d && a(f).unbind(c.d, d), c.w && a(window).unbind(c.w, d)
                        }
                    }(), "undefined" != typeof a && (a.fn.mediaelementplayer = function (b) {
                return b === !1 ? this.each(function () {
                    var b = a(this).data("mediaelementplayer");
                    b && b.remove(), a(this).removeData("mediaelementplayer")
                }) : this.each(function () {
                    a(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, b))
                }), this
            }, a(document).ready(function () {
                a(".mejs-player").mediaelementplayer()
            })), window.MediaElementPlayer = mejs.MediaElementPlayer
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                playText: mejs.i18n.t("Play"),
                pauseText: mejs.i18n.t("Pause")
            }), a.extend(MediaElementPlayer.prototype, {
                buildplaypause: function (b, c, d, e) {
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
                            i = a('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="' + g.id + '" title="' + h.playText + '" aria-label="' + h.playText + '"></button></div>').appendTo(c).click(function (a) {
                        return a.preventDefault(), e.paused ? e.play() : e.pause(), !1
                    }),
                            j = i.find("button");
                    f("pse"), e.addEventListener("play", function () {
                        f("play")
                    }, !1), e.addEventListener("playing", function () {
                        f("play")
                    }, !1), e.addEventListener("pause", function () {
                        f("pse")
                    }, !1), e.addEventListener("paused", function () {
                        f("pse")
                    }, !1)
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                stopText: "Stop"
            }), a.extend(MediaElementPlayer.prototype, {
                buildstop: function (b, c, d, e) {
                    var f = this;
                    a('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="' + f.id + '" title="' + f.options.stopText + '" aria-label="' + f.options.stopText + '"></button></div>').appendTo(c).click(function () {
                        e.paused || e.pause(), e.currentTime > 0 && (e.setCurrentTime(0), e.pause(), c.find(".mejs-time-current").width("0px"), c.find(".mejs-time-handle").css("left", "0px"), c.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0, b.options)), c.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0, b.options)), d.find(".mejs-poster").show())
                    })
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                progessHelpText: mejs.i18n.t("Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.")
            }), a.extend(MediaElementPlayer.prototype, {
                buildprogress: function (b, c, d, e) {
                    a('<div class="mejs-time-rail"><span  class="mejs-time-total mejs-time-slider"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(c), c.find(".mejs-time-buffering").hide();
                    var f = this,
                            g = c.find(".mejs-time-total"),
                            h = c.find(".mejs-time-loaded"),
                            i = c.find(".mejs-time-current"),
                            j = c.find(".mejs-time-handle"),
                            k = c.find(".mejs-time-float"),
                            l = c.find(".mejs-time-float-current"),
                            m = c.find(".mejs-time-slider"),
                            n = function (a) {
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
                            t = function (a) {
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
                            u = function () {
                                var a = new Date;
                                a - q >= 1e3 && e.play()
                            };
                    m.bind("focus", function (a) {
                        b.options.autoRewind = !1
                    }), m.bind("blur", function (a) {
                        b.options.autoRewind = s
                    }), m.bind("keydown", function (a) {
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
                    }), g.bind("mousedown touchstart", function (a) {
                        (1 === a.which || 0 === a.which) && (o = !0, n(a), f.globalBind("mousemove.dur touchmove.dur", function (a) {
                            n(a)
                        }), f.globalBind("mouseup.dur touchend.dur", function (a) {
                            o = !1, k.hide(), f.globalUnbind(".dur")
                        }))
                    }).bind("mouseenter", function (a) {
                        p = !0, f.globalBind("mousemove.dur", function (a) {
                            n(a)
                        }), mejs.MediaFeatures.hasTouch || k.show()
                    }).bind("mouseleave", function (a) {
                        p = !1, o || (f.globalUnbind(".dur"), k.hide())
                    }), e.addEventListener("progress", function (a) {
                        b.setProgressRail(a), b.setCurrentRail(a)
                    }, !1), e.addEventListener("timeupdate", function (a) {
                        b.setProgressRail(a), b.setCurrentRail(a), t(a)
                    }, !1), f.container.on("controlsresize", function () {
                        b.setProgressRail(), b.setCurrentRail()
                    }), f.loaded = h, f.total = g, f.current = i, f.handle = j
                },
                setProgressRail: function (a) {
                    var b = this,
                            c = void 0 !== a ? a.target : b.media,
                            d = null;
                    c && c.buffered && c.buffered.length > 0 && c.buffered.end && c.duration ? d = c.buffered.end(c.buffered.length - 1) / c.duration : c && void 0 !== c.bytesTotal && c.bytesTotal > 0 && void 0 !== c.bufferedBytes ? d = c.bufferedBytes / c.bytesTotal : a && a.lengthComputable && 0 !== a.total && (d = a.loaded / a.total), null !== d && (d = Math.min(1, Math.max(0, d)), b.loaded && b.total && b.loaded.width(b.total.width() * d))
                },
                setCurrentRail: function () {
                    var a = this;
                    if (void 0 !== a.media.currentTime && a.media.duration && a.total && a.handle) {
                        var b = Math.round(a.total.width() * a.media.currentTime / a.media.duration),
                                c = b - Math.round(a.handle.outerWidth(!0) / 2);
                        a.current.width(b), a.handle.css("left", c)
                    }
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                duration: -1,
                timeAndDurationSeparator: "<span> | </span>"
            }), a.extend(MediaElementPlayer.prototype, {
                buildcurrent: function (b, c, d, e) {
                    var f = this;
                    a('<div class="mejs-time" role="timer" aria-live="off"><span class="mejs-currenttime">' + mejs.Utility.secondsToTimeCode(0, b.options) + "</span></div>").appendTo(c), f.currenttime = f.controls.find(".mejs-currenttime"), e.addEventListener("timeupdate", function () {
                        b.updateCurrent()
                    }, !1)
                },
                buildduration: function (b, c, d, e) {
                    var f = this;
                    c.children().last().find(".mejs-currenttime").length > 0 ? a(f.options.timeAndDurationSeparator + '<span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span>").appendTo(c.find(".mejs-time")) : (c.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"), a('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span></div>").appendTo(c)), f.durationD = f.controls.find(".mejs-duration"), e.addEventListener("timeupdate", function () {
                        b.updateDuration()
                    }, !1)
                },
                updateCurrent: function () {
                    var a = this,
                            b = a.media.currentTime;
                    isNaN(b) && (b = 0), a.currenttime && a.currenttime.html(mejs.Utility.secondsToTimeCode(b, a.options))
                },
                updateDuration: function () {
                    var a = this,
                            b = a.media.duration;
                    a.options.duration > 0 && (b = a.options.duration), isNaN(b) && (b = 0), a.container.toggleClass("mejs-long-video", b > 3600), a.durationD && b > 0 && a.durationD.html(mejs.Utility.secondsToTimeCode(b, a.options))
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                muteText: mejs.i18n.t("Mute Toggle"),
                allyVolumeControlText: mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),
                hideVolumeOnTouchDevices: !0,
                audioVolume: "horizontal",
                videoVolume: "vertical"
            }), a.extend(MediaElementPlayer.prototype, {
                buildvolume: function (b, c, d, e) {
                    if (!mejs.MediaFeatures.isAndroid && !mejs.MediaFeatures.isiOS || !this.options.hideVolumeOnTouchDevices) {
                        var f = this,
                                g = f.isVideo ? f.options.videoVolume : f.options.audioVolume,
                                h = "horizontal" == g ? a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button></div><a href="javascript:void(0);" class="mejs-horizontal-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></a>').appendTo(c) : a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button><a href="javascript:void(0);" class="mejs-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></a></div>').appendTo(c),
                                i = f.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),
                                j = f.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),
                                k = f.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),
                                l = f.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),
                                m = function (a, b) {
                                    if (!i.is(":visible") && "undefined" == typeof b)
                                        return i.show(), m(a, !0), void i.hide();
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
                                n = function (a) {
                                    var b = null,
                                            c = j.offset();
                                    if ("vertical" === g) {
                                        var d = j.height(),
                                                f = a.pageY - c.top;
                                        if (b = (d - f) / d, 0 === c.top || 0 === c.left)
                                            return
                                    } else {
                                        var h = j.width(),
                                                i = a.pageX - c.left;
                                        b = i / h
                                    }
                                    b = Math.max(0, b), b = Math.min(b, 1), m(b), 0 === b ? e.setMuted(!0) : e.setMuted(!1), e.setVolume(b)
                                },
                                o = !1,
                                p = !1;
                        h.hover(function () {
                            i.show(), p = !0
                        }, function () {
                            p = !1, o || "vertical" != g || i.hide()
                        });
                        var q = function (a) {
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
                        i.bind("mouseover", function () {
                            p = !0
                        }).bind("mousedown", function (a) {
                            return n(a), f.globalBind("mousemove.vol", function (a) {
                                n(a)
                            }), f.globalBind("mouseup.vol", function () {
                                o = !1, f.globalUnbind(".vol"), p || "vertical" != g || i.hide()
                            }), o = !0, !1
                        }).bind("keydown", function (a) {
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
                        }), h.find("button").click(function () {
                            e.setMuted(!e.muted)
                        }), h.find("button").bind("focus", function () {
                            i.show()
                        }), e.addEventListener("volumechange", function (a) {
                            o || (e.muted ? (m(0), h.removeClass("mejs-mute").addClass("mejs-unmute")) : (m(e.volume), h.removeClass("mejs-unmute").addClass("mejs-mute"))), q(a)
                        }, !1), 0 === b.options.startVolume && e.setMuted(!0), "native" === e.pluginType && e.setVolume(b.options.startVolume), f.container.on("controlsresize", function () {
                            m(e.volume)
                        })
                    }
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                usePluginFullScreen: !0,
                newWindowCallback: function () {
                    return ""
                },
                fullscreenText: mejs.i18n.t("Fullscreen")
            }), a.extend(MediaElementPlayer.prototype, {
                isFullScreen: !1,
                isNativeFullScreen: !1,
                isInIframe: !1,
                fullscreenMode: "",
                buildfullscreen: function (b, c, d, e) {
                    if (b.isVideo) {
                        b.isInIframe = window.location != window.parent.location, e.addEventListener("play", function () {
                            b.detectFullscreenMode()
                        });
                        var f = this,
                                g = null,
                                h = a('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="' + f.id + '" title="' + f.options.fullscreenText + '" aria-label="' + f.options.fullscreenText + '"></button></div>').appendTo(c).on("click", function () {
                            var a = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || b.isFullScreen;
                            a ? b.exitFullScreen() : b.enterFullScreen()
                        }).on("mouseover", function () {
                            if ("plugin-hover" == f.fullscreenMode) {
                                null !== g && (clearTimeout(g), delete g);
                                var a = h.offset(),
                                        c = b.container.offset();
                                e.positionFullscreenButton(a.left - c.left, a.top - c.top, !0);
                            }
                        }).on("mouseout", function () {
                            "plugin-hover" == f.fullscreenMode && (null !== g && (clearTimeout(g), delete g), g = setTimeout(function () {
                                e.hideFullscreenButton()
                            }, 1500))
                        });
                        if (b.fullscreenBtn = h, f.globalBind("keydown", function (a) {
                            27 == a.keyCode && (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || f.isFullScreen) && b.exitFullScreen()
                        }), f.normalHeight = 0, f.normalWidth = 0, mejs.MediaFeatures.hasTrueNativeFullScreen) {
                            var i = function (a) {
                                b.isFullScreen && (mejs.MediaFeatures.isFullScreen() ? (b.isNativeFullScreen = !0, b.setControlsSize()) : (b.isNativeFullScreen = !1, b.exitFullScreen()))
                            };
                            b.globalBind(mejs.MediaFeatures.fullScreenEventName, i)
                        }
                    }
                },
                detectFullscreenMode: function () {
                    var a = this,
                            b = "",
                            c = mejs.MediaFeatures;
                    return c.hasTrueNativeFullScreen && "native" === a.media.pluginType ? b = "native-native" : c.hasTrueNativeFullScreen && "native" !== a.media.pluginType && !c.hasFirefoxPluginMovingProblem ? b = "plugin-native" : a.usePluginFullScreen ? mejs.MediaFeatures.supportsPointerEvents ? (b = "plugin-click", a.createPluginClickThrough()) : b = "plugin-hover" : b = "fullwindow", a.fullscreenMode = b, b
                },
                isPluginClickThroughCreated: !1,
                createPluginClickThrough: function () {
                    var b = this;
                    if (!b.isPluginClickThroughCreated) {
                        var c, d, e = !1,
                                f = function () {
                                    if (e) {
                                        for (var a in g)
                                            g[a].hide();
                                        b.fullscreenBtn.css("pointer-events", ""), b.controls.css("pointer-events", ""), b.media.removeEventListener("click", b.clickToPlayPauseCallback), e = !1
                                    }
                                },
                                g = {},
                                h = ["top", "left", "right", "bottom"],
                                i = function () {
                                    var a = fullscreenBtn.offset().left - b.container.offset().left,
                                            d = fullscreenBtn.offset().top - b.container.offset().top,
                                            e = fullscreenBtn.outerWidth(!0),
                                            f = fullscreenBtn.outerHeight(!0),
                                            h = b.container.width(),
                                            i = b.container.height();
                                    for (c in g)
                                        g[c].css({
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
                        }), c = 0, d = h.length; d > c; c++)
                            g[h[c]] = a('<div class="mejs-fullscreen-hover" />').appendTo(b.container).mouseover(f).hide();
                        fullscreenBtn.on("mouseover", function () {
                            if (!b.isFullScreen) {
                                var a = fullscreenBtn.offset(),
                                        d = player.container.offset();
                                media.positionFullscreenButton(a.left - d.left, a.top - d.top, !1), b.fullscreenBtn.css("pointer-events", "none"), b.controls.css("pointer-events", "none"), b.media.addEventListener("click", b.clickToPlayPauseCallback);
                                for (c in g)
                                    g[c].show();
                                i(), e = !0
                            }
                        }), media.addEventListener("fullscreenchange", function (a) {
                            b.isFullScreen = !b.isFullScreen, b.isFullScreen ? b.media.removeEventListener("click", b.clickToPlayPauseCallback) : b.media.addEventListener("click", b.clickToPlayPauseCallback), f()
                        }), b.globalBind("mousemove", function (a) {
                            if (e) {
                                var c = fullscreenBtn.offset();
                                (a.pageY < c.top || a.pageY > c.top + fullscreenBtn.outerHeight(!0) || a.pageX < c.left || a.pageX > c.left + fullscreenBtn.outerWidth(!0)) && (fullscreenBtn.css("pointer-events", ""), b.controls.css("pointer-events", ""), e = !1)
                            }
                        }), b.isPluginClickThroughCreated = !0
                    }
                },
                cleanfullscreen: function (a) {
                    a.exitFullScreen()
                },
                containerSizeTimeout: null,
                enterFullScreen: function () {
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
                    }, 1e3)) : "fullwindow" == b.fullscreeMode, b.container.addClass("mejs-container-fullscreen").width("100%").height("100%"), b.containerSizeTimeout = setTimeout(function () {
                        b.container.css({
                            width: "100%",
                            height: "100%"
                        }), b.setControlsSize()
                    }, 500), "native" === b.media.pluginType ? b.$media.width("100%").height("100%") : (b.container.find(".mejs-shim").width("100%").height("100%"), setTimeout(function () {
                        var c = a(window),
                                d = c.width(),
                                e = c.height();
                        b.media.setVideoSize(d, e)
                    }, 500)), b.layers.children("div").width("100%").height("100%"), b.fullscreenBtn && b.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"), b.setControlsSize(), b.isFullScreen = !0, b.container.find(".mejs-captions-text").css("font-size", screen.width / b.width * 1 * 100 + "%"), b.container.find(".mejs-captions-position").css("bottom", "45px"), void b.container.trigger("enteredfullscreen"))
                },
                exitFullScreen: function () {
                    var b = this;
                    clearTimeout(b.containerSizeTimeout), mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || b.isFullScreen) && mejs.MediaFeatures.cancelFullScreen(), a(document.documentElement).removeClass("mejs-fullscreen"), b.container.removeClass("mejs-container-fullscreen").width(b.normalWidth).height(b.normalHeight), "native" === b.media.pluginType ? b.$media.width(b.normalWidth).height(b.normalHeight) : (b.container.find(".mejs-shim").width(b.normalWidth).height(b.normalHeight), b.media.setVideoSize(b.normalWidth, b.normalHeight)), b.layers.children("div").width(b.normalWidth).height(b.normalHeight), b.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"), b.setControlsSize(), b.isFullScreen = !1, b.container.find(".mejs-captions-text").css("font-size", ""), b.container.find(".mejs-captions-position").css("bottom", ""), b.container.trigger("exitedfullscreen")
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
                defaultSpeed: "1.00",
                speedChar: "x"
            }), a.extend(MediaElementPlayer.prototype, {
                buildspeed: function (b, c, d, e) {
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
                        }), k.sort(function (a, b) {
                            return parseFloat(b.value) - parseFloat(a.value)
                        });
                        var p = function (a) {
                            for (m = 0, n = k.length; n > m; m++)
                                if (k[m].value === a)
                                    return k[m].name
                        },
                                q = '<div class="mejs-button mejs-speed-button"><button type="button">' + p(f.options.defaultSpeed) + '</button><div class="mejs-speed-selector"><ul>';
                        for (m = 0, il = k.length; m < il; m++)
                            j = f.id + "-speed-" + k[m].value, q += '<li><input type="radio" name="speed" value="' + k[m].value + '" id="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? " checked" : "") + ' /><label for="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? ' class="mejs-speed-selected"' : "") + ">" + k[m].name + "</label></li>";
                        q += "</ul></div></div>", g = a(q).appendTo(c), h = g.find(".mejs-speed-selector"), i = f.options.defaultSpeed, e.addEventListener("loadedmetadata", function (a) {
                            i && (e.playbackRate = parseFloat(i))
                        }, !0), h.on("click", 'input[type="radio"]', function () {
                            var b = a(this).attr("value");
                            i = b, e.playbackRate = parseFloat(b), g.find("button").html(p(b)), g.find(".mejs-speed-selected").removeClass("mejs-speed-selected"), g.find('input[type="radio"]:checked').next().addClass("mejs-speed-selected")
                        }), g.one("mouseenter focusin", function () {
                            h.height(g.find(".mejs-speed-selector ul").outerHeight(!0) + g.find(".mejs-speed-translations").outerHeight(!0)).css("top", -1 * h.height() + "px")
                        })
                    }
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                startLanguage: "",
                tracksText: mejs.i18n.t("Captions/Subtitles"),
                tracksAriaLive: !1,
                hideCaptionsButtonWhenEmpty: !0,
                toggleCaptionsButtonWhenOnlyOne: !1,
                slidesSelector: ""
            }), a.extend(MediaElementPlayer.prototype, {
                hasChapters: !1,
                cleartracks: function (a, b, c, d) {
                    a && (a.captions && a.captions.remove(), a.chapters && a.chapters.remove(), a.captionsText && a.captionsText.remove(), a.captionsButton && a.captionsButton.remove())
                },
                buildtracks: function (b, c, d, e) {
                    if (0 !== b.tracks.length) {
                        var f, g = this,
                                h = g.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : "";
                        if (g.domNode.textTracks)
                            for (f = g.domNode.textTracks.length - 1; f >= 0; f--)
                                g.domNode.textTracks[f].mode = "hidden";
                        g.cleartracks(b, c, d, e), b.chapters = a('<div class="mejs-chapters mejs-layer"></div>').prependTo(d).hide(), b.captions = a('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" ' + h + '><span class="mejs-captions-text"></span></div></div>').prependTo(d).hide(), b.captionsText = b.captions.find(".mejs-captions-text"), b.captionsButton = a('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="' + g.id + '" title="' + g.options.tracksText + '" aria-label="' + g.options.tracksText + '"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="' + b.id + '_captions" id="' + b.id + '_captions_none" value="none" checked="checked" /><label for="' + b.id + '_captions_none">' + mejs.i18n.t("None") + "</label></li></ul></div></div>").appendTo(c);
                        var i = 0;
                        for (f = 0; f < b.tracks.length; f++)
                            "subtitles" == b.tracks[f].kind && i++;
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
                        }), b.trackToLoad = - 1, b.selectedTrack = null, b.isLoadingTrack = !1, f = 0; f < b.tracks.length; f++)
                            "subtitles" == b.tracks[f].kind && b.addTrackButton(b.tracks[f].srclang, b.tracks[f].label);
                        b.loadNextTrack(), e.addEventListener("timeupdate", function (a) {
                            b.displayCaptions()
                        }, !1), "" !== b.options.slidesSelector && (b.slidesContainer = a(b.options.slidesSelector), e.addEventListener("timeupdate", function (a) {
                            b.displaySlides()
                        }, !1)), e.addEventListener("loadedmetadata", function (a) {
                            b.displayChapters()
                        }, !1), b.container.hover(function () {
                            b.hasChapters && (b.chapters.removeClass("mejs-offscreen"), b.chapters.fadeIn(200).height(b.chapters.find(".mejs-chapter").outerHeight()))
                        }, function () {
                            b.hasChapters && !e.paused && b.chapters.fadeOut(200, function () {
                                a(this).addClass("mejs-offscreen"), a(this).css("display", "block")
                            })
                        }), g.container.on("controlsresize", function () {
                            g.adjustLanguageBox()
                        }), null !== b.node.getAttribute("autoplay") && b.chapters.addClass("mejs-offscreen")
                    }
                },
                setTrack: function (a) {
                    var b, c = this;
                    if ("none" == a)
                        c.selectedTrack = null, c.captionsButton.removeClass("mejs-captions-enabled");
                    else
                        for (b = 0; b < c.tracks.length; b++)
                            if (c.tracks[b].srclang == a) {
                                null === c.selectedTrack && c.captionsButton.addClass("mejs-captions-enabled"), c.selectedTrack = c.tracks[b], c.captions.attr("lang", c.selectedTrack.srclang), c.displayCaptions();
                                break
                            }
                },
                loadNextTrack: function () {
                    var a = this;
                    a.trackToLoad++, a.trackToLoad < a.tracks.length ? (a.isLoadingTrack = !0, a.loadTrack(a.trackToLoad)) : (a.isLoadingTrack = !1, a.checkForTracks())
                },
                loadTrack: function (b) {
                    var c = this,
                            d = c.tracks[b],
                            e = function () {
                                d.isLoaded = !0, c.enableTrackButton(d.srclang, d.label), c.loadNextTrack()
                            };
                    a.ajax({
                        url: d.src,
                        dataType: "text",
                        success: function (a) {
                            "string" == typeof a && /<tt\s+xml/gi.exec(a) ? d.entries = mejs.TrackFormatParser.dfxp.parse(a) : d.entries = mejs.TrackFormatParser.webvtt.parse(a), e(), "chapters" == d.kind && c.media.addEventListener("play", function (a) {
                                c.media.duration > 0 && c.displayChapters(d)
                            }, !1), "slides" == d.kind && c.setupSlides(d)
                        },
                        error: function () {
                            c.removeTrackButton(d.srclang), c.loadNextTrack()
                        }
                    })
                },
                enableTrackButton: function (b, c) {
                    var d = this;
                    "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("input[value=" + b + "]").prop("disabled", !1).siblings("label").html(c), d.options.startLanguage == b && a("#" + d.id + "_captions_" + b).prop("checked", !0).trigger("click"), d.adjustLanguageBox()
                },
                removeTrackButton: function (a) {
                    var b = this;
                    b.captionsButton.find("input[value=" + a + "]").closest("li").remove(), b.adjustLanguageBox()
                },
                addTrackButton: function (b, c) {
                    var d = this;
                    "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("ul").append(a('<li><input type="radio" name="' + d.id + '_captions" id="' + d.id + "_captions_" + b + '" value="' + b + '" disabled="disabled" /><label for="' + d.id + "_captions_" + b + '">' + c + " (loading)</label></li>")), d.adjustLanguageBox(), d.container.find(".mejs-captions-translations option[value=" + b + "]").remove()
                },
                adjustLanguageBox: function () {
                    var a = this;
                    a.captionsButton.find(".mejs-captions-selector").height(a.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0) + a.captionsButton.find(".mejs-captions-translations").outerHeight(!0))
                },
                checkForTracks: function () {
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
                displayCaptions: function () {
                    if ("undefined" != typeof this.tracks) {
                        var a, b = this,
                                c = b.selectedTrack;
                        if (null !== c && c.isLoaded) {
                            for (a = 0; a < c.entries.times.length; a++)
                                if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop)
                                    return b.captionsText.html(c.entries.text[a]).attr("class", "mejs-captions-text " + (c.entries.times[a].identifier || "")), void b.captions.show().height(0);
                            b.captions.hide()
                        } else
                            b.captions.hide()
                    }
                },
                setupSlides: function (a) {
                    var b = this;
                    b.slides = a, b.slides.entries.imgs = [b.slides.entries.text.length], b.showSlide(0)
                },
                showSlide: function (b) {
                    if ("undefined" != typeof this.tracks && "undefined" != typeof this.slidesContainer) {
                        var c = this,
                                d = c.slides.entries.text[b],
                                e = c.slides.entries.imgs[b];
                        "undefined" == typeof e || "undefined" == typeof e.fadeIn ? c.slides.entries.imgs[b] = e = a('<img src="' + d + '">').on("load", function () {
                            e.appendTo(c.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
                        }) : e.is(":visible") || e.is(":animated") || e.fadeIn().siblings(":visible").fadeOut()
                    }
                },
                displaySlides: function () {
                    if ("undefined" != typeof this.slides) {
                        var a, b = this,
                                c = b.slides;
                        for (a = 0; a < c.entries.times.length; a++)
                            if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop)
                                return void b.showSlide(a)
                    }
                },
                displayChapters: function () {
                    var a, b = this;
                    for (a = 0; a < b.tracks.length; a++)
                        if ("chapters" == b.tracks[a].kind && b.tracks[a].isLoaded) {
                            b.drawChapters(b.tracks[a]), b.hasChapters = !0;
                            break
                        }
                },
                drawChapters: function (b) {
                    var c, d, e = this,
                            f = 0,
                            g = 0;
                    for (e.chapters.empty(), c = 0; c < b.entries.times.length; c++)
                        d = b.entries.times[c].stop - b.entries.times[c].start, f = Math.floor(d / e.media.duration * 100), (f + g > 100 || c == b.entries.times.length - 1 && 100 > f + g) && (f = 100 - g), e.chapters.append(a('<div class="mejs-chapter" rel="' + b.entries.times[c].start + '" style="left: ' + g.toString() + "%;width: " + f.toString() + '%;"><div class="mejs-chapter-block' + (c == b.entries.times.length - 1 ? " mejs-chapter-block-last" : "") + '"><span class="ch-title">' + b.entries.text[c] + '</span><span class="ch-time">' + mejs.Utility.secondsToTimeCode(b.entries.times[c].start, e.options) + "&ndash;" + mejs.Utility.secondsToTimeCode(b.entries.times[c].stop, e.options) + "</span></div></div>")), g += f;
                    e.chapters.find("div.mejs-chapter").click(function () {
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
                    parse: function (b) {
                        for (var c, d, e, f = 0, g = mejs.TrackFormatParser.split2(b, /\r?\n/), h = {
                            text: [],
                            times: []
                        }; f < g.length; f++) {
                            if (c = this.pattern_timecode.exec(g[f]), c && f < g.length) {
                                for (f - 1 >= 0 && "" !== g[f - 1] && (e = g[f - 1]), f++, d = g[f], f++;
                                        "" !== g[f] && f < g.length; )
                                    d = d + "\n" + g[f], f++;
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
                    parse: function (b) {
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
                                for (c = {}, e = 0; e < j.length; e++)
                                    c[j[e].name.split(":")[1]] = j[e].value
                        }
                        for (e = 0; e < g.length; e++) {
                            var k, l = {
                                start: null,
                                stop: null,
                                style: null
                            };
                            if (g.eq(e).attr("begin") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("begin"))), !l.start && g.eq(e - 1).attr("end") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e - 1).attr("end"))), g.eq(e).attr("end") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("end"))), !l.stop && g.eq(e + 1).attr("begin") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e + 1).attr("begin"))), c) {
                                k = "";
                                for (var m in c)
                                    k += m + ":" + c[m] + ";"
                            }
                            k && (l.style = k), 0 === l.start && (l.start = .2), i.times.push(l), d = a.trim(g.eq(e).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), i.text.push(d), 0 === i.times.start && (i.times.start = 2)
                        }
                        return i
                    }
                },
                split2: function (a, b) {
                    return a.split(b)
                }
            }, 3 != "x\n\ny".split(/\n/gi).length && (mejs.TrackFormatParser.split2 = function (a, b) {
                var c, d = [],
                        e = "";
                for (c = 0; c < a.length; c++)
                    e += a.substring(c, c + 1), b.test(e) && (d.push(e.replace(b, "")), e = "");
                return d.push(e), d
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                contextMenuItems: [{
                        render: function (a) {
                            return "undefined" == typeof a.enterFullScreen ? null : a.isFullScreen ? mejs.i18n.t("Turn off Fullscreen") : mejs.i18n.t("Go Fullscreen")
                        },
                        click: function (a) {
                            a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen()
                        }
                    }, {
                        render: function (a) {
                            return a.media.muted ? mejs.i18n.t("Unmute") : mejs.i18n.t("Mute")
                        },
                        click: function (a) {
                            a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                        }
                    }, {
                        isSeparator: !0
                    }, {
                        render: function (a) {
                            return mejs.i18n.t("Download Video")
                        },
                        click: function (a) {
                            window.location.href = a.media.currentSrc
                        }
                    }]
            }), a.extend(MediaElementPlayer.prototype, {
                buildcontextmenu: function (b, c, d, e) {
                    b.contextMenu = a('<div class="mejs-contextmenu"></div>').appendTo(a("body")).hide(), b.container.bind("contextmenu", function (a) {
                        return b.isContextMenuEnabled ? (a.preventDefault(), b.renderContextMenu(a.clientX - 1, a.clientY - 1), !1) : void 0
                    }), b.container.bind("click", function () {
                        b.contextMenu.hide()
                    }), b.contextMenu.bind("mouseleave", function () {
                        b.startContextMenuTimer()
                    })
                },
                cleancontextmenu: function (a) {
                    a.contextMenu.remove()
                },
                isContextMenuEnabled: !0,
                enableContextMenu: function () {
                    this.isContextMenuEnabled = !0
                },
                disableContextMenu: function () {
                    this.isContextMenuEnabled = !1
                },
                contextMenuTimeout: null,
                startContextMenuTimer: function () {
                    var a = this;
                    a.killContextMenuTimer(), a.contextMenuTimer = setTimeout(function () {
                        a.hideContextMenu(), a.killContextMenuTimer()
                    }, 750)
                },
                killContextMenuTimer: function () {
                    var a = this.contextMenuTimer;
                    null != a && (clearTimeout(a), delete a, a = null)
                },
                hideContextMenu: function () {
                    this.contextMenu.hide()
                },
                renderContextMenu: function (b, c) {
                    for (var d = this, e = "", f = d.options.contextMenuItems, g = 0, h = f.length; h > g; g++)
                        if (f[g].isSeparator)
                            e += '<div class="mejs-contextmenu-separator"></div>';
                        else {
                            var i = f[g].render(d);
                            null != i && (e += '<div class="mejs-contextmenu-item" data-itemindex="' + g + '" id="element-' + 1e6 * Math.random() + '">' + i + "</div>")
                        }
                    d.contextMenu.empty().append(a(e)).css({
                        top: c,
                        left: b
                    }).show(), d.contextMenu.find(".mejs-contextmenu-item").each(function () {
                        var b = a(this),
                                c = parseInt(b.data("itemindex"), 10),
                                e = d.options.contextMenuItems[c];
                        "undefined" != typeof e.show && e.show(b, d), b.click(function () {
                            "undefined" != typeof e.click && e.click(d), d.contextMenu.hide()
                        })
                    }), setTimeout(function () {
                        d.killControlsTimer("rev3")
                    }, 100)
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                skipBackInterval: 30,
                skipBackText: mejs.i18n.t("Skip back %1 seconds")
            }), a.extend(MediaElementPlayer.prototype, {
                buildskipback: function (b, c, d, e) {
                    var f = this,
                            g = f.options.skipBackText.replace("%1", f.options.skipBackInterval);
                    a('<div class="mejs-button mejs-skip-back-button"><button type="button" aria-controls="' + f.id + '" title="' + g + '" aria-label="' + g + '">' + f.options.skipBackInterval + "</button></div>").appendTo(c).click(function () {
                        e.setCurrentTime(Math.max(e.currentTime - f.options.skipBackInterval, 0)), a(this).find("button").blur()
                    })
                }
            })
        }(mejs.$),
        function (a) {
            a.extend(mejs.MepDefaults, {
                postrollCloseText: mejs.i18n.t("Close")
            }), a.extend(MediaElementPlayer.prototype, {
                buildpostroll: function (b, c, d, e) {
                    var f = this,
                            g = f.container.find('link[rel="postroll"]').attr("href");
                    "undefined" != typeof g && (b.postroll = a('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + f.options.postrollCloseText + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(d).hide(), f.media.addEventListener("ended", function (c) {
                        a.ajax({
                            dataType: "html",
                            url: g,
                            success: function (a, b) {
                                d.find(".mejs-postroll-layer-content").html(a)
                            }
                        }), b.postroll.show()
                    }, !1))
                }
            })
        }(mejs.$);
;
(function (window, $) {
    window.wp = window.wp || {};
    mejs.plugins.silverlight[0].types.push('video/x-ms-wmv');
    mejs.plugins.silverlight[0].types.push('audio/x-ms-wma');

    function wpMediaElement() {
        var settings = {};

        function initialize() {
            if (typeof _wpmejsSettings !== 'undefined') {
                settings = $.extend(true, {}, _wpmejsSettings);
            }
            settings.success = settings.success || function (mejs) {
                var autoplay, loop;
                if ('flash' === mejs.pluginType) {
                    autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
                    loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
                    autoplay && mejs.addEventListener('canplay', function () {
                        mejs.play();
                    }, false);
                    loop && mejs.addEventListener('ended', function () {
                        mejs.play();
                    }, false);
                }
            };
            $('.wp-audio-shortcode, .wp-video-shortcode, .video-block video, .audio-block audio').not('.mejs-container').filter(function () {
                return !$(this).parent().hasClass('.mejs-mediaelement');
            }).mediaelementplayer(settings);
        }
        return {
            initialize: initialize
        };
    }
    window.wp.mediaelement = new wpMediaElement();
    $(window.wp.mediaelement.initialize);
})(window, jQuery);
;
(function ($) {
    $(function () {
        function gallery_images_loaded($box, image_selector, callback) {
            function check_image_loaded(img) {
                return img.complete && img.naturalWidth !== undefined && img.naturalWidth != 0;
            }
            var $images = $(image_selector, $box).filter(function () {
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
                $images.each(function () {
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
            $images.on('load error', function () {
                images_count--;
                if (images_count == 0) {
                    callback();
                }
            });
        }

        function init_circular_overlay($gallery, $set) {
            if (!$gallery.hasClass('hover-circular')) {
                return;
            }
            $('.gallery-item', $set).on('mouseenter', function () {
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
        $('.gem-gallery-grid').not('.gallery-slider').each(function () {
            var $gallery = $(this);
            var $set = $('.gallery-set', this);
            if (!$gallery.hasClass('metro')) {
                gallery_images_loaded($set, '.image-wrap img', function () {
                    $gallery.closest('.gallery-preloader-wrapper').prev('.preloader').remove();
                    init_circular_overlay($gallery, $set);
                    var itemsAnimations = $gallery.itemsAnimations({
                        itemSelector: '.gallery-item',
                        scrollMonitor: true
                    });
                    var init_gallery = true;
                    $set.on('arrangeComplete', function (event, filteredItems) {
                        if (init_gallery) {
                            init_gallery = false;
                            var items = [];
                            filteredItems.forEach(function (item) {
                                items.push(item.element);
                            });
                            itemsAnimations.show($(items));
                        }
                    }).isotope({
                        itemSelector: '.gallery-item',
                        itemImageWrapperSelector: '.image-wrap',
                        fixHeightDoubleItems: $gallery.hasClass('gallery-style-justified'),
                        layoutMode: 'masonry-custom',
                        'masonry-custom': {
                            columnWidth: '.gallery-item:not(.double-item)'
                        }
                    });
                });
                if ($set.closest('.gem_tab').size() > 0) {
                    $set.closest('.gem_tab').bind('tab-update', function () {
                        $set.isotope('layout');
                    });
                }
                $(document).on('show.vc.tab', '[data-vc-tabs]', function () {
                    var $tab = $(this).data('vc.tabs').getTarget();
                    if ($tab.find($set).length) {
                        $set.isotope('layout');
                    }
                });
                if ($set.closest('.gem_accordion_content').size() > 0) {
                    $set.closest('.gem_accordion_content').bind('accordion-update', function () {
                        $set.isotope('layout');
                    });
                }
            }
        });
        var resizeTimer = null;
        $('.gem-gallery-grid.metro').not('.gallery-slider').each(function () {
            var $gallery = $(this);
            var $set = $('.gallery-set', this);
            gallery_images_loaded($set, '.image-wrap img', function () {
                $gallery.closest('.gallery-preloader-wrapper').prev('.preloader').remove();
                var itemsAnimations = $gallery.itemsAnimations({
                    itemSelector: '.gallery-item',
                    scrollMonitor: true
                });
                var init_gallery = true;
                init_circular_overlay($gallery, $set);
                $set.on('arrangeComplete', function (event, filteredItems) {
                    if (init_gallery) {
                        init_gallery = false;
                        var items = [];
                        filteredItems.forEach(function (item) {
                            items.push(item.element);
                        });
                        itemsAnimations.show($(items));
                    }
                }).isotope({
                    itemSelector: '.gallery-item',
                    itemImageWrapperSelector: '.image-wrap',
                    fixHeightDoubleItems: $gallery.hasClass('gallery-style-justified'),
                    layoutMode: 'metro',
                    'masonry-custom': {
                        columnWidth: '.gallery-item:not(.double-item)'
                    },
                    transitionDuration: 0
                });
                if ($set.closest('.gem_tab').size() > 0) {
                    $set.closest('.gem_tab').bind('tab-update', function () {
                        $set.isotope('layout');
                    });
                }
                $(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function () {
                    var $tab = $(this).data('vc.accordion').getTarget();
                    if ($tab.find($set).length) {
                        $set.isotope('layout');
                    }
                });
                $(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function () {
                    var $tab = $(this).data('vc.accordion').getTarget();
                    if ($tab.find($set).length) {
                        $set.isotope('layout');
                    }
                });
                if ($set.closest('.gem_accordion_content').size() > 0) {
                    $set.closest('.gem_accordion_content').bind('accordion-update', function () {
                        $set.isotope('layout');
                    });
                }
            });
        });
        $('.gem-gallery-grid').on('click', '.gallery-item', function () {
            $(this).mouseover();
        });
        $('.gallery-slider').each(function () {
            var $gallery = $(this);
            var $set = $('.gallery-set', this);
            var $items = $('.gallery-item', $set);
            init_circular_overlay($gallery, $set);
            $set.wrap('<div class="gem-gallery-preview-carousel-wrap clearfix"/>');
            var $galleryPreviewWrap = $('.gem-gallery-preview-carousel-wrap', this);
            $galleryPreviewWrap.wrap('<div class="gem-gallery-preview-carousel-padding clearfix"/>');
            var $galleryPreviewNavigation = $('<div class="gem-gallery-preview-navigation"/>').appendTo($galleryPreviewWrap);
            var $galleryPreviewPrev = $('<a href="#" class="gem-prev gem-gallery-preview-prev"></a>').appendTo($galleryPreviewNavigation);
            var $galleryPreviewNext = $('<a href="#" class="gem-next gem-gallery-preview-next"></a>').appendTo($galleryPreviewNavigation);
            var $galleryThumbsWrap = $('<div class="gem-gallery-thumbs-carousel-wrap col-lg-12 col-md-12 col-sm-12 clearfix" style="opacity: 0"/>').appendTo($gallery);
            var $galleryThumbsCarousel = $('<ul class="gem-gallery-thumbs-carousel"/>').appendTo($galleryThumbsWrap);
            var $galleryThumbsNavigation = $('<div class="gem-gallery-thumbs-navigation"/>').appendTo($galleryThumbsWrap);
            var $galleryThumbsPrev = $('<a href="#" class="gem-prev gem-gallery-thumbs-prev"></a>').appendTo($galleryThumbsNavigation);
            var $galleryThumbsNext = $('<a href="#" class="gem-next gem-gallery-thumbs-next"></a>').appendTo($galleryThumbsNavigation);
            var thumbItems = '';
            $items.each(function () {
                thumbItems += '<li><span><img src="' + $('.image-wrap img', this).data('thumb-url') + '" alt="" /></span></li>';
            });
            var $thumbItems = $(thumbItems);
            $thumbItems.appendTo($galleryThumbsCarousel);
            $thumbItems.each(function (index) {
                $(this).data('gallery-item-num', index);
            });
            var $galleryPreview = $set.carouFredSel({
                auto: false,
                circular: false,
                infinite: false,
                responsive: true,
                width: '100%',
                height: '100%',
                items: 1,
                align: 'center',
                prev: $galleryPreviewPrev,
                next: $galleryPreviewNext,
                swipe: true,
                scroll: {
                    items: 1,
                    onBefore: function (data) {
                        var current = $(this).triggerHandler('currentPage');
                        var thumbCurrent = $galleryThumbs.triggerHandler('slice', [current, current + 1]);
                        var thumbsVisible = $galleryThumbs.triggerHandler('currentVisible');
                        $thumbItems.filter('.active').removeClass('active');
                        if (thumbsVisible.index(thumbCurrent) === -1) {
                            $galleryThumbs.trigger('slideTo', current);
                        }
                        $('span', thumbCurrent).trigger('click');
                    }
                }
            });
            var $galleryThumbs = null;
            $galleryThumbsCarousel.imagesLoaded(function () {
                $galleryThumbs = $galleryThumbsCarousel.carouFredSel({
                    auto: false,
                    circular: false,
                    infinite: false,
                    width: '100%',
                    height: 'variable',
                    align: 'center',
                    prev: $galleryThumbsPrev,
                    next: $galleryThumbsNext,
                    swipe: true,
                    onCreate: function (data) {
                        $('span', $thumbItems).click(function (e) {
                            e.preventDefault();
                            $thumbItems.filter('.active').removeClass('active');
                            $(this).closest('li').addClass('active');
                            $galleryPreview.trigger('slideTo', $(this).closest('li').data('gallery-item-num'));
                        });
                        $thumbItems.eq(0).addClass('active');
                    }
                });
                $galleryThumbsWrap.animate({
                    opacity: 1
                }, 400);
                if ($thumbItems.length < 2) {
                    $galleryThumbsWrap.hide();
                }
            });
        });
        $('.gem-gallery').each(function () {
            var $galleryElement = $(this);
            var $thumbItems = $('.gem-gallery-item', $galleryElement);
            var $galleryPreviewWrap = $('<div class="gem-gallery-preview-carousel-wrap"/>').appendTo($galleryElement);
            var $galleryPreviewCarousel = $('<div class="gem-gallery-preview-carousel "/>').appendTo($galleryPreviewWrap);
            var $galleryPreviewNavigation = $('<div class="gem-gallery-preview-navigation"/>').appendTo($galleryPreviewWrap);
            var $galleryPreviewPrev = $('<a href="#" class="gem-prev gem-gallery-preview-prev"></a>').appendTo($galleryPreviewNavigation);
            var $galleryPreviewNext = $('<a href="#" class="gem-next gem-gallery-preview-next"></a>').appendTo($galleryPreviewNavigation);
            if ($galleryElement.hasClass('with-pagination')) {
                var $galleryPreviewPagination = $('<div class="gem-gallery-preview-pagination gem-mini-pagination"/>').appendTo($galleryPreviewWrap);
            }
            var $previewItems = $thumbItems.clone(true, true);
            $previewItems.appendTo($galleryPreviewCarousel);
            $previewItems.each(function () {
                $('img', this).attr('src', $('a', this).attr('href'));
                $('a', this).attr('href', $('a', this).data('full-image-url')).attr('data-fancybox', $('a', this).data('fancybox-group')).addClass('fancy-gallery');
            });
            $galleryPreviewCarousel.initGalleryFancybox();
            var $galleryThumbsWrap = $('<div class="gem-gallery-thumbs-carousel-wrap"/>').appendTo($galleryElement);
            var $galleryThumbsCarousel = $('<div class="gem-gallery-thumbs-carousel"/>').appendTo($galleryThumbsWrap);
            var $galleryThumbsNavigation = $('<div class="gem-gallery-thumbs-navigation"/>').appendTo($galleryThumbsWrap);
            var $galleryThumbsPrev = $('<a href="#" class="gem-prev gem-gallery-thumbs-prev"></a>').appendTo($galleryThumbsNavigation);
            var $galleryThumbsNext = $('<a href="#" class="gem-next gem-gallery-thumbs-next"></a>').appendTo($galleryThumbsNavigation);
            $thumbItems.appendTo($galleryThumbsCarousel);
            $thumbItems.each(function (index) {
                $(this).data('gallery-item-num', index);
            });
        });
//        $('body').updateGalleries();
//        $('body').buildSimpleGalleries();
//        $('body').updateSimpleGalleries();
        $('.gem_tab').on('tab-update', function () {
            $(this).updateGalleries();
        });
        $(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function () {
            $(this).data('vc.accordion').getTarget().updateGalleries();
        });
        $(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function () {
            $(this).data('vc.accordion').getTarget().updateGalleries();
        });
        $('.gem_accordion_content').on('accordion-update', function () {
            $(this).updateGalleries();
        });
    });
    $.fn.buildSimpleGalleries = function () {
        $('.gem-simple-gallery:not(.activated)', this).each(function () {
            var $galleryElement = $(this);
            $galleryElement.addClass('activated');
            var $thumbItems = $('.gem-gallery-item', $galleryElement);
            var $galleryItemsWrap = $('<div class="gem-gallery-items-carousel-wrap"/>').appendTo($galleryElement);
            var $galleryItemsCarousel = $('<div class="gem-gallery-items-carousel"/>').appendTo($galleryItemsWrap);
            var $galleryItemsNavigation = $('<div class="gem-gallery-items-navigation"/>').appendTo($galleryItemsWrap);
            var $galleryItemsPrev = $('<a href="#" class="gem-prev gem-gallery-items-prev"></a>').appendTo($galleryItemsNavigation);
            var $galleryItemsNext = $('<a href="#" class="gem-next gem-gallery-items-next"></a>').appendTo($galleryItemsNavigation);
            $thumbItems.appendTo($galleryItemsCarousel);
            $('a', $galleryItemsCarousel).addClass('fancy-gallery');
            $galleryItemsCarousel.initGalleryFancybox();
        });
    }
    $.fn.updateGalleries = function () {
        $('.gem-gallery', this).each(function () {
            var $galleryElement = $(this);
            var $galleryPreviewCarousel = $('.gem-gallery-preview-carousel', $galleryElement);
            var $galleryThumbsWrap = $('.gem-gallery-thumbs-carousel-wrap', $galleryElement);
            var $galleryThumbsCarousel = $('.gem-gallery-thumbs-carousel', $galleryElement);
            var $thumbItems = $('.gem-gallery-item', $galleryThumbsCarousel);
            var $galleryPreviewPrev = $('.gem-gallery-preview-prev', $galleryElement);
            var $galleryPreviewNext = $('.gem-gallery-preview-next', $galleryElement);
            var $galleryPreviewPagination = $('.gem-gallery-preview-pagination', $galleryElement);
            var $galleryThumbsPrev = $('.gem-gallery-thumbs-prev', $galleryElement);
            var $galleryThumbsNext = $('.gem-gallery-thumbs-next', $galleryElement);
            $galleryElement.thegemPreloader(function () {
                var $galleryPreview = $galleryPreviewCarousel.carouFredSel({
                    auto: $galleryElement.data('autoscroll') ? $galleryElement.data('autoscroll') : false,
                    circular: true,
                    infinite: true,
                    responsive: true,
                    width: '100%',
                    height: 'auto',
                    items: 1,
                    align: 'center',
                    prev: $galleryPreviewPrev,
                    next: $galleryPreviewNext,
                    pagination: $galleryElement.hasClass('with-pagination') ? $galleryPreviewPagination : false,
                    swipe: true,
                    scroll: {
                        pauseOnHover: true,
                        items: 1,
                        onBefore: function (data) {
                            var current = $(this).triggerHandler('currentPage');
                            var thumbCurrent = $galleryThumbs.triggerHandler('slice', [current, current + 1]);
                            var thumbsVisible = $galleryThumbs.triggerHandler('currentVisible');
                            $thumbItems.filter('.active').removeClass('active');
                            if (thumbsVisible.index(thumbCurrent) === -1) {
                                $galleryThumbs.trigger('slideTo', current);
                            }
                            $('a', thumbCurrent).trigger('click');
                        }
                    },
                    onCreate: function () {
                        $(window).on('resize', function () {
                            $galleryPreviewCarousel.parent().add($galleryPreviewCarousel).height($galleryPreviewCarousel.children().first().height());
                        }).trigger('resize');
                    }
                });
                var $galleryThumbs = $galleryThumbsCarousel.carouFredSel({
                    auto: false,
                    circular: true,
                    infinite: true,
                    width: '100%',
                    height: 'variable',
                    align: 'center',
                    prev: $galleryThumbsPrev,
                    next: $galleryThumbsNext,
                    swipe: true,
                    onCreate: function (data) {
                        $('a', $thumbItems).click(function (e) {
                            e.preventDefault();
                            $thumbItems.filter('.active').removeClass('active');
                            $(this).closest('.gem-gallery-item').addClass('active');
                            $galleryPreview.trigger('slideTo', $(this).closest('.gem-gallery-item').data('gallery-item-num'));
                        });
                    }
                });
                if ($thumbItems.filter('.active').length) {
                    $thumbItems.filter('.active').eq(0).find('a').trigger('click');
                } else {
                    $thumbItems.eq(0).find('a').trigger('click');
                }
                if ($thumbItems.length < 2) {
                    $galleryThumbsWrap.hide();
                }
            });
        });
    }
    $.fn.updateSimpleGalleries = function () {
        $('.gem-simple-gallery', this).each(function () {
            var $galleryElement = $(this);
            var $galleryItemsCarousel = $('.gem-gallery-items-carousel', $galleryElement);
            var $thumbItems = $('.gem-gallery-item', $galleryItemsCarousel);
            var $galleryItemsPrev = $('.gem-gallery-items-prev', $galleryElement);
            var $galleryItemsNext = $('.gem-gallery-items-next', $galleryElement);
            $galleryElement.thegemPreloader(function () {
                var $galleryItems = $galleryItemsCarousel.carouFredSel({
                    auto: ($galleryElement.data('autoscroll') > 0 ? $galleryElement.data('autoscroll') : false),
                    circular: true,
                    infinite: true,
                    responsive: $galleryElement.hasClass('responsive'),
                    width: '100%',
                    height: 'variable',
                    align: 'center',
                    prev: $galleryItemsPrev,
                    next: $galleryItemsNext,
                    swipe: true,
                    scroll: {
                        pauseOnHover: true
                    }
                });
            });
        });
    }
})(jQuery);
;
(function ($) {
    function init_blog_scroll_next_page($blog, $pagination) {
        if (!$pagination.length) {
            return false;
        }
        var watcher = scrollMonitor.create($pagination[0]);
        watcher.enterViewport(function () {
            blog_load_more_request($blog, $pagination, true);
        });
    }
    $('.blog-style-masonry, .blog-style-timeline_new').each(function () {
        var $blog = $(this),
                isTimeline = $blog.hasClass('blog-style-timeline_new');
        if (isTimeline && $blog.closest('.vc_row[data-vc-stretch-content="true"]').length > 0) {
            $('.post-image img.img-responsive', $blog).removeAttr('srcset');
        }
        $blog.imagesLoaded(function () {
            $blog.prev('.preloader').remove();
            var itemsAnimations = $blog.itemsAnimations({
                itemSelector: 'article',
                scrollMonitor: true,
                firstItemStatic: isTimeline
            });
            var init_blog = true;
            if (isTimeline) {
                $blog.on('layoutComplete', function (event, laidOutItems) {
                    laidOutItems.forEach(function (item) {
                        if (item.position.x == 0) {
                            $(item.element).removeClass('right-position').addClass('left-position');
                        } else {
                            $(item.element).removeClass('left-position').addClass('right-position');
                        }
                    });
                });
            }
            $blog.on('arrangeComplete', function (event, filteredItems) {
                if (!isTimeline) {
                    $blog.buildSimpleGalleries();
                    $blog.updateSimpleGalleries();
                }
                if (init_blog) {
                    init_blog = false;
                    itemsAnimations.show();
                }
            }).isotope({
                itemSelector: 'article',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: 'article:not(.sticky)'
                },
                transitionDuration: 0
            });
        });
        var $blogParent = $blog;
        if (isTimeline) {
            $blogParent = $blog.parent();
        }
        $blogParent.siblings('.blog-load-more').on('click', function () {
            blog_load_more_request($blog, $(this), false);
        });
        init_blog_scroll_next_page($blog, $blogParent.siblings('.blog-scroll-pagination'));
    });
    $('.blog:not(body,.blog-style-timeline_new,.blog-style-masonry)').each(function () {
        var $blog = $(this);
        $('.blog-load-more', $blog.parent()).on('click', function () {
            blog_load_more_request($blog, $(this), false);
        });
        init_blog_scroll_next_page($blog, $blog.siblings('.blog-scroll-pagination'));
        var itemsAnimations = $blog.itemsAnimations({
            itemSelector: 'article',
            scrollMonitor: true
        });
        itemsAnimations.show();
        if ($blog.hasClass('blog-style-justified-3x') || $blog.hasClass('blog-style-justified-4x')) {
            $blog.imagesLoaded(function () {
                oneSizeArticles($blog);
            });
        }
    });

    function oneSizeArticles($blog) {
        var elements = {};
        $("article", $blog).css('height', '');
        $("article", $blog).each(function (i, e) {
            var transform = $(this).css('transform');
            var translateY = 0;
            if (transform != undefined && transform != 'none') {
                translateY = parseFloat(transform.substr(1, transform.length - 2).split(',')[5]);
                if (isNaN(translateY)) {
                    translateY = 0;
                }
            }
            var elPosition = parseInt($(this).position().top - translateY);
            var elHeight = $(this).height();
            if (elements[elPosition] == undefined) {
//                elements[elPosition] = {
//                    'array': [$(this)],
//                    'maxHeight': elHeight
//                };
            } else {
//                elements[elPosition]['array'].push($(this));
//                if (elements[elPosition]['maxHeight'] < elHeight) {
//                    elements[elPosition]['maxHeight'] = elHeight;
//                }
            }
        });
        $.each(elements, function (i, e) {
            var item = this;
            $.each(item.array, function () {
                $(this).height(item.maxHeight);
            });
        });
    }
    $(window).on('resize', function () {
        $(".blog-style-justified-3x, .blog-style-justified-4x").each(function () {
            oneSizeArticles($(this));
        });
    });

    function finishAjaxRequestActions($blog, $inserted_data, is_scroll, $pagination, next_page, $loading_marker) {
        $inserted_data.buildSimpleGalleries();
        $inserted_data.updateSimpleGalleries();
        window.wp.mediaelement.initialize();
        $blog.itemsAnimations('instance').show($inserted_data);
        if ($blog.hasClass('blog-style-justified-3x') || $blog.hasClass('blog-style-justified-4x')) {
            $blog.imagesLoaded(function () {
                oneSizeArticles($blog);
            });
        }
        if (is_scroll) {
            $pagination.removeClass('active').html('');
        } else {
            $loading_marker.remove();
            if (next_page == 0) {
                $pagination.hide();
            }
        }
        $blog.data('request-process', false).data('next-page', next_page);
    }

    function blog_load_more_request($blog, $pagination, is_scroll) {
        var data = thegem_blog_ajax;
        var is_processing_request = $blog.data('request-process') || false;
        if (is_processing_request) {
            return false;
        }
        var paged = $blog.data('next-page');
        if (paged == null || paged == undefined) {
            paged = 1;
        }
        if (paged == 0) {
            return false;
        }
        data['data']['paged'] = paged;
        data['action'] = 'blog_load_more';
        $blog.data('request-process', true);
        if (is_scroll) {
            $pagination.addClass('active').html('<div class="loading"><div class="preloader-spin"></div></div>');
        } else {
            var $loading_marker = $('<div class="loading"><div class="preloader-spin"></div></div>');
            $('.gem-button-container', $pagination).before($loading_marker);
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: thegem_blog_ajax.url,
            data: data,
            success: function (response) {
                if (response.status == 'success') {
                    var $newItems = $(response.html),
                            $inserted_data = $($newItems.html()),
                            current_page = $newItems.data('page'),
                            next_page = $newItems.data('next-page');
                    if ($blog.hasClass('blog-style-masonry') || $blog.hasClass('blog-style-timeline_new')) {
                        $inserted_data.imagesLoaded(function () {
                            $blog.isotope('insert', $inserted_data);
                            finishAjaxRequestActions($blog, $inserted_data, is_scroll, $pagination, next_page, $loading_marker);
                        });
                    } else {
                        $blog.append($inserted_data);
                        finishAjaxRequestActions($blog, $inserted_data, is_scroll, $pagination, next_page, $loading_marker);
                    }
                    $blog.initBlogFancybox();
                } else {
                    alert(response.message);
                }
            }
        });
    }
})(jQuery);
;
(function ($) {
    $(function () {
        $('.gem-clients-type-carousel-grid:not(.carousel-disabled)').each(function () {
            var $clientsCarouselElement = $(this);
            var $clientsItems = $('.gem-clients-slide', $clientsCarouselElement);
            var $clientsItemsWrap = $('<div class="gem-clients-grid-carousel-wrap"/>').appendTo($clientsCarouselElement);
            var $clientsItemsCarousel = $('<div class="gem-clients-grid-carousel"/>').appendTo($clientsItemsWrap);
            var $clientsItemsPagination = $('<div class="gem-clients-grid-pagination gem-mini-pagination"/>').appendTo($clientsItemsWrap);
            $clientsItems.appendTo($clientsItemsCarousel);
        });
        $('.gem_client_carousel-items').each(function () {
            var $clientsElement = $(this);
            var $clients = $('.gem-client-item', $clientsElement);
            var $clientsWrap = $('<div class="gem-client-carousel-item-wrap"/>').appendTo($clientsElement);
            var $clientsCarousel = $('<div class="gem-client-carousel"/>').appendTo($clientsWrap);
            var $clientsNavigation = $('<div class="gem-client-carousel-navigation"/>').appendTo($clientsWrap);
            var $clientsPrev = $('<a href="#" class="gem-prev gem-client-prev"/></a>').appendTo($clientsNavigation);
            var $clientsNext = $('<a href="#" class="gem-next gem-client-next"/></a>').appendTo($clientsNavigation);
            $clients.appendTo($clientsCarousel);
        });
//        $('body').updateClientsGrid();
//        $('body').updateClientsCarousel();
        $('.fullwidth-block').each(function () {
            $(this).on('updateClientsCarousel', function () {
                $(this).updateClientsCarousel();
            });
        });
        $('.gem_tab').on('tab-update', function () {
            $(this).updateClientsGrid();
        });
        $('.gem_accordion_content').on('accordion-update', function () {
            $(this).updateClientsGrid();
        });
        $(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function () {
            $(this).data('vc.accordion').getTarget().updateClientsGrid();
        });
        $(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function () {
            $(this).data('vc.accordion').getTarget().updateClientsGrid();
        });
    });
    $.fn.updateClientsGrid = function () {
        $('.gem-clients-type-carousel-grid:not(.carousel-disabled)', this).each(function () {
            var $clientsCarouselElement = $(this);
            var $clientsItemsCarousel = $('.gem-clients-grid-carousel', $clientsCarouselElement);
            var $clientsItemsPagination = $('.gem-mini-pagination', $clientsCarouselElement);
            var autoscroll = $clientsCarouselElement.data('autoscroll') > 0 ? $clientsCarouselElement.data('autoscroll') : false;
            $clientsCarouselElement.thegemPreloader(function () {
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
    $.fn.updateClientsCarousel = function () {
        $('.gem_client_carousel-items:not(.carousel-disabled)', this).each(function () {
            var $clientsElement = $(this);
            var $clientsCarousel = $('.gem-client-carousel', $clientsElement);
            var $clientsPrev = $('.gem-client-prev', $clientsElement);
            var $clientsNext = $('.gem-client-next', $clientsElement);
            var autoscroll = $clientsElement.data('autoscroll') > 0 ? $clientsElement.data('autoscroll') : false;
            $clientsElement.thegemPreloader(function () {
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
;
!function () {
    var e = void 0,
            t = void 0;
    !function t(n, r, i) {
//        function o(c, a) {
//            if (!r[c]) {
////                if (!n[c]) {
////                    var u = "function" == typeof e && e;
////                    if (!a && u) return u(c, !0);
////                    if (s) return s(c, !0);
////                    var f = new Error("Cannot find module '" + c + "'");
////                    throw f.code = "MODULE_NOT_FOUND", f
////                }
//                var l = r[c] = {
//                    exports: {}
//                };
//                n[c][0].call(l.exports, function(e) {
//                    var t = n[c][1][e];
//                    return o(t || e)
//                }, l, l.exports, t, n, r, i)
//            }
//            return r[c].exports
//        }
//        for (var s = "function" == typeof e && e, c = 0; c < i.length; c++) o(i[c]);
//        return o
    }({
        1: [function (e, t, n) {
                "use strict";

                function r(e) {
                    var t = "animated" === u.auto_scroll,
                            n = {
                                behavior: t ? "smooth" : "instant",
                                block: "center",
                                inline: "center"
                            };
                    e.element.scrollIntoView(n)
                }

                function i(e, t, n) {
                    return function () {
                        var r = this.value.trim(),
                                i = "radio" !== this.getAttribute("type") && "checked" !== this.getAttribute("type") || this.checked,
                                o = i && (r === t && "" !== t || "" === t && r.length > 0);
                        e.style.display = n ? o ? "" : "none" : o ? "none" : ""
                    }
                }

                function o() {
                    var e = this,
                            t = e.form.querySelectorAll("[data-show-if], [data-hide-if]"),
                            n = (e.getAttribute("name") || "").toLowerCase();
                    [].forEach.call(t, function (t) {
                        var r = !!t.getAttribute("data-show-if"),
                                o = r ? t.getAttribute("data-show-if").split(":") : t.getAttribute("data-hide-if").split(":"),
                                s = o[0],
                                c = o[1] || "";
                        if (n === s.toLowerCase()) {
                            i(t, c, r).call(e)
                        }
                    })
                }
                var s = window.mc4wp || {},
                        c = e("gator"),
                        a = e("forms/forms.html"),
                        u = window.mc4wp_forms_config || {};
                if (c(document.body).on("keyup", ".mc4wp-form input, .mc4wp-form textarea, .mc4wp-form select", o), c(document.body).on("change", ".mc4wp-form input, .mc4wp-form textarea, .mc4wp-form select", o), window.addEventListener("load", function () {
                    [].forEach.call(document.querySelectorAll(".mc4wp-form input, .mc4wp-form textarea, .mc4wp-form select"), function (e) {
                        o.call(e)
                    })
                }), c(document.body).on("submit", ".mc4wp-form", function (e) {
                    var t = a.getByElement(e.target || e.srcElement);
                    a.trigger("submit", [t, e]), a.trigger(t.id + ".submit", [t, e])
                }), c(document.body).on("focus", ".mc4wp-form", function (e) {
                    var t = a.getByElement(e.target || e.srcElement);
                    t.started || (a.trigger("started", [t, e]), a.trigger(t.id + ".started", [t, e]), t.started = !0)
                }), c(document.body).on("change", ".mc4wp-form", function (e) {
                    var t = a.getByElement(e.target || e.srcElement);
                    a.trigger("change", [t, e]), a.trigger(t.id + ".change", [t, e])
                }), s.listeners) {
                    for (var f = s.listeners, l = 0; l < f.length; l++)
                        a.on(f[l].event, f[l].callback);
                    delete s.listeners
                }
                if (s.forms = a, u.submitted_form) {
                    var h = u.submitted_form,
                            d = document.getElementById(h.element_id),
                            m = a.getByElement(d);
                    !function (e, t, n, i) {
                        var o = document.body.clientHeight,
                                s = Date.now();
                        n && e.setData(i), u.auto_scroll && r(e), window.addEventListener("load", function () {
                            var c = Date.now() - s;
                            u.auto_scroll && c < 800 && document.body.clientHeight !== o && r(e), a.trigger("submitted", [e]), a.trigger(e.id + ".submitted", [e]), n ? (a.trigger("error", [e, n]), a.trigger(e.id + ".error", [e, n])) : (a.trigger("success", [e, i]), a.trigger(e.id + ".success", [e, i]), a.trigger(t + "d", [e, i]), a.trigger(e.id + "." + t + "d", [e, i]))
                        })
                    }(m, h.action, h.errors, h.data)
                }
                window.mc4wp = s
            }, {
                "./forms/forms.js": 3,
                gator: 5
            }],
        2: [function (e, t, n) {
                "use strict";
                var r = e("form-serialize"),
                        i = e("populate.html"),
                        o = function (e, t) {
                            this.id = e, this.element = t || document.createElement("form"), this.name = this.element.getAttribute("data-name") || "Form #" + this.id, this.errors = [], this.started = !1
                        };
                o.prototype.setData = function (e) {
                    try {
                        i(this.element, e)
                    } catch (e) {
                        console.error(e)
                    }
                }, o.prototype.getData = function () {
                    return r(this.element, {
                        hash: !0
                    })
                }, o.prototype.getSerializedData = function () {
                    return r(this.element)
                }, o.prototype.setResponse = function (e) {
                    this.element.querySelector(".mc4wp-response").innerHTML = e
                }, o.prototype.reset = function () {
                    this.setResponse(""), this.element.querySelector(".mc4wp-form-fields").style.display = "", this.element.reset()
                }, t.exports = o
            }, {
                "form-serialize": 4,
                "populate.js": 6
            }],
        3: [function (e, t, n) {
                "use strict";

                function r(e) {
                    for (var t = 0; t < f.length; t++)
                        if (f[t].id == e)
                            return f[t];
                    return o(document.querySelector(".mc4wp-form-" + e), e)
                }

                function i(e) {
                    for (var t = e.form || e, n = 0; n < f.length; n++)
                        if (f[n].element == t)
                            return f[n];
                    return o(t)
                }

                function o(e, t) {
                    t = t || parseInt(e.getAttribute("data-id")) || 0;
                    var n = new a(t, e);
                    return f.push(n), n
                }

                function s() {
                    return f
                }
                var c = e("wolfy87-eventemitter"),
                        a = e("form.html"),
                        u = new c,
                        f = [];
                t.exports = {
                    all: s,
                    get: r,
                    getByElement: i,
                    on: u.on.bind(u),
                    trigger: u.trigger.bind(u),
                    off: u.off.bind(u)
                }
            }, {
                "./form.js": 2,
                "wolfy87-eventemitter": 7
            }],
        4: [function (e, t, n) {
                function r(e, t) {
                    "object" != typeof t ? t = {
                        hash: !!t
                    } : void 0 === t.hash && (t.hash = !0);
                    for (var n = t.hash ? {} : "", r = t.serializer || (t.hash ? s : c), i = e && e.elements ? e.elements : [], o = Object.create(null), f = 0; f < i.length; ++f) {
                        var l = i[f];
                        if ((t.disabled || !l.disabled) && l.name && (u.test(l.nodeName) && !a.test(l.type))) {
                            var h = l.name,
                                    d = l.value;
                            if ("checkbox" !== l.type && "radio" !== l.type || l.checked || (d = void 0), t.empty) {
                                if ("checkbox" !== l.type || l.checked || (d = ""), "radio" === l.type && (o[l.name] || l.checked ? l.checked && (o[l.name] = !0) : o[l.name] = !1), void 0 == d && "radio" == l.type)
                                    continue
                            } else if (!d)
                                continue;
                            if ("select-multiple" !== l.type)
                                n = r(n, h, d);
                            else {
                                d = [];
                                for (var m = l.options, p = !1, v = 0; v < m.length; ++v) {
                                    var g = m[v],
                                            y = t.empty && !g.value,
                                            w = g.value || y;
                                    g.selected && w && (p = !0, n = t.hash && "[]" !== h.slice(h.length - 2) ? r(n, h + "[]", g.value) : r(n, h, g.value))
                                }
                                !p && t.empty && (n = r(n, h, ""))
                            }
                        }
                    }
                    if (t.empty)
                        for (var h in o)
                            o[h] || (n = r(n, h, ""));
                    return n
                }

                function i(e) {
                    var t = [],
                            n = /^([^\[\]]*)/,
                            r = new RegExp(f),
                            i = n.exec(e);
                    for (i[1] && t.push(i[1]); null !== (i = r.exec(e)); )
                        t.push(i[1]);
                    return t
                }

                function o(e, t, n) {
                    if (0 === t.length)
                        return e = n;
                    var r = t.shift(),
                            i = r.match(/^\[(.+?)\]$/);
                    if ("[]" === r)
                        return e = e || [], Array.isArray(e) ? e.push(o(null, t, n)) : (e._values = e._values || [], e._values.push(o(null, t, n))), e;
                    if (i) {
                        var s = i[1],
                                c = +s;
                        isNaN(c) ? (e = e || {}, e[s] = o(e[s], t, n)) : (e = e || [], e[c] = o(e[c], t, n))
                    } else
                        e[r] = o(e[r], t, n);
                    return e
                }

                function s(e, t, n) {
                    if (t.match(f))
                        o(e, i(t), n);
                    else {
                        var r = e[t];
                        r ? (Array.isArray(r) || (e[t] = [r]), e[t].push(n)) : e[t] = n
                    }
                    return e
                }

                function c(e, t, n) {
                    return n = n.replace(/(\r)?\n/g, "\r\n"), n = encodeURIComponent(n), n = n.replace(/%20/g, "+"), e + (e ? "&" : "") + encodeURIComponent(t) + "=" + n
                }
                var a = /^(?:submit|button|image|reset|file)$/i,
                        u = /^(?:input|select|textarea|keygen)/i,
                        f = /(\[[^\[\]]*\])/g;
                t.exports = r
            }, {}],
        5: [function (e, t, n) {
                !function () {
                    function e(e, t, n) {
                        var r = "blur" == t || "focus" == t;
                        e.element.addEventListener(t, n, r)
                    }

                    function n(e) {
                        e.preventDefault(), e.stopPropagation()
                    }

                    function r(e) {
                        return f || (f = e.matches ? e.matches : e.webkitMatchesSelector ? e.webkitMatchesSelector : e.mozMatchesSelector ? e.mozMatchesSelector : e.msMatchesSelector ? e.msMatchesSelector : e.oMatchesSelector ? e.oMatchesSelector : u.matchesSelector)
                    }

                    function i(e, t, n) {
                        if ("_root" == t)
                            return n;
                        if (e !== n)
                            return r(e).call(e, t) ? e : e.parentNode ? (l++, i(e.parentNode, t, n)) : void 0
                    }

                    function o(e, t, n, r) {
                        d[e.id] || (d[e.id] = {}), d[e.id][t] || (d[e.id][t] = {}), d[e.id][t][n] || (d[e.id][t][n] = []), d[e.id][t][n].push(r)
                    }

                    function s(e, t, n, r) {
                        if (d[e.id])
                            if (t) {
                                if (!r && !n)
                                    return void(d[e.id][t] = {});
                                if (!r)
                                    return void delete d[e.id][t][n];
                                if (d[e.id][t][n])
                                    for (var i = 0; i < d[e.id][t][n].length; i++)
                                        if (d[e.id][t][n][i] === r) {
                                            d[e.id][t][n].splice(i, 1);
                                            break
                                        }
                            } else
                                for (var o in d[e.id])
                                    d[e.id].hasOwnProperty(o) && (d[e.id][o] = {})
                    }

                    function c(e, t, n) {
                        if (d[e][n]) {
                            var r, o, s = t.target || t.srcElement,
                                    c = {},
                                    a = 0,
                                    f = 0;
                            l = 0;
                            for (r in d[e][n])
                                d[e][n].hasOwnProperty(r) && (o = i(s, r, m[e].element)) && u.matchesEvent(n, m[e].element, o, "_root" == r, t) && (l++, d[e][n][r].match = o, c[l] = d[e][n][r]);
                            for (t.stopPropagation = function() {
                            t.cancelBubble = !0
                            }, a = 0; a <= l; a++)
                                if (c[a])
                                    for (f = 0; f < c[a].length; f++) {
                                        if (!1 === c[a][f].call(c[a].match, t))
                                            return void u.cancel(t);
                                        if (t.cancelBubble)
                                            return
                                    }
                        }
                    }

                    function a(e, t, n, r) {
                        if (this.element) {
                            e instanceof Array || (e = [e]), n || "function" != typeof t || (n = t, t = "_root");
                            var i, a = this.id;
                            for (i = 0; i < e.length; i++)
                                r ? s(this, e[i], t, n) : (d[a] && d[a][e[i]] || u.addEvent(this, e[i], function (e) {
                                    return function (t) {
                                        c(a, t, e)
                                    }
                                }(e[i])), o(this, e[i], t, n));
                            return this
                        }
                    }

                    function u(e, t) {
                        if (!(this instanceof u)) {
                            for (var n in m)
                                if (m[n].element === e)
                                    return m[n];
                            return h++, m[h] = new u(e, h), m[h]
                        }
                        this.element = e, this.id = t
                    }
                    var f, l = 0,
                            h = 0,
                            d = {},
                            m = {};
                    u.prototype.on = function (e, t, n) {
                        return a.call(this, e, t, n)
                    }, u.prototype.off = function (e, t, n) {
                        return a.call(this, e, t, n, !0)
                    }, u.matchesSelector = function () {}, u.cancel = n, u.addEvent = e, u.matchesEvent = function () {
                        return !0
                    }, void 0 !== t && t.exports && (t.exports = u), window.Gator = u
                }()
            }, {}],
        6: [function (e, n, r) {
                !function (e) {
                    var r = function (e, t, n) {
                        for (var i in t)
                            if (t.hasOwnProperty(i)) {
                                var o = i,
                                        s = t[i];
                                if (void 0 === s && (s = ""), null === s && (s = ""), void 0 !== n && (o = n + "[" + i + "]"), s.constructor === Array)
                                    o += "[]";
                                else if ("object" == typeof s) {
                                    r(e, s, o);
                                    continue
                                }
                                var c = e.elements.namedItem(o);
                                if (c) {
                                    var a = c.type || c[0].type;
                                    switch (a) {
                                        default:
                                            c.value = s;
                                            break;
                                        case "radio":
                                        case "checkbox":
                                            for (var u = 0; u < c.length; u++)
                                                c[u].checked = s.indexOf(c[u].value) > -1;
                                            break;
                                        case "select-multiple":
                                            for (var f = s.constructor == Array ? s : [s], l = 0; l < c.options.length; l++)
                                                c.options[l].selected |= f.indexOf(c.options[l].value) > -1;
                                            break;
                                        case "select":
                                        case "select-one":
                                            c.value = s.toString() || s;
                                            break;
                                        case "date":
                                            c.value = new Date(s).toISOString().split("T")[0]
                                    }
                                }
                            }
                    };
                    "function" == typeof t && "object" == typeof t.amd && t.amd ? t(function () {
                        return r
                    }) : void 0 !== n && n.exports ? n.exports = r : e.populate = r
                }(this)
            }, {}],
        7: [function (e, n, r) {
                !function (e) {
                    "use strict";

                    function r() {}

                    function i(e, t) {
                        for (var n = e.length; n--; )
                            if (e[n].listener === t)
                                return n;
                        return -1
                    }

                    function o(e) {
                        return function () {
                            return this[e].apply(this, arguments)
                        }
                    }

                    function s(e) {
                        return "function" == typeof e || e instanceof RegExp || !(!e || "object" != typeof e) && s(e.listener)
                    }
                    var c = r.prototype,
                            a = e.EventEmitter;
                    c.getListeners = function (e) {
                        var t, n, r = this._getEvents();
                        if (e instanceof RegExp) {
                            t = {};
                            for (n in r)
                                r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n])
                        } else
                            t = r[e] || (r[e] = []);
                        return t
                    }, c.flattenListeners = function (e) {
                        var t, n = [];
                        for (t = 0; t < e.length; t += 1)
                            n.push(e[t].listener);
                        return n
                    }, c.getListenersAsObject = function (e) {
                        var t, n = this.getListeners(e);
                        return n instanceof Array && (t = {}, t[e] = n), t || n
                    }, c.addListener = function (e, t) {
                        if (!s(t))
                            throw new TypeError("listener must be a function");
                        var n, r = this.getListenersAsObject(e),
                                o = "object" == typeof t;
                        for (n in r)
                            r.hasOwnProperty(n) && -1 === i(r[n], t) && r[n].push(o ? t : {
                                listener: t,
                                once: !1
                            });
                        return this
                    }, c.on = o("addListener"), c.addOnceListener = function (e, t) {
                        return this.addListener(e, {
                            listener: t,
                            once: !0
                        })
                    }, c.once = o("addOnceListener"), c.defineEvent = function (e) {
                        return this.getListeners(e), this
                    }, c.defineEvents = function (e) {
                        for (var t = 0; t < e.length; t += 1)
                            this.defineEvent(e[t]);
                        return this
                    }, c.removeListener = function (e, t) {
                        var n, r, o = this.getListenersAsObject(e);
                        for (r in o)
                            o.hasOwnProperty(r) && -1 !== (n = i(o[r], t)) && o[r].splice(n, 1);
                        return this
                    }, c.off = o("removeListener"), c.addListeners = function (e, t) {
                        return this.manipulateListeners(!1, e, t)
                    }, c.removeListeners = function (e, t) {
                        return this.manipulateListeners(!0, e, t)
                    }, c.manipulateListeners = function (e, t, n) {
                        var r, i, o = e ? this.removeListener : this.addListener,
                                s = e ? this.removeListeners : this.addListeners;
                        if ("object" != typeof t || t instanceof RegExp)
                            for (r = n.length; r--; )
                                o.call(this, t, n[r]);
                        else
                            for (r in t)
                                t.hasOwnProperty(r) && (i = t[r]) && ("function" == typeof i ? o.call(this, r, i) : s.call(this, r, i));
                        return this
                    }, c.removeEvent = function (e) {
                        var t, n = typeof e,
                                r = this._getEvents();
                        if ("string" === n)
                            delete r[e];
                        else if (e instanceof RegExp)
                            for (t in r)
                                r.hasOwnProperty(t) && e.test(t) && delete r[t];
                        else
                            delete this._events;
                        return this
                    }, c.removeAllListeners = o("removeEvent"), c.emitEvent = function (e, t) {
                        var n, r, i, o, s = this.getListenersAsObject(e);
                        for (o in s)
                            if (s.hasOwnProperty(o))
                                for (n = s[o].slice(0), i = 0; i < n.length; i++)
                                    r = n[i], !0 === r.once && this.removeListener(e, r.listener), r.listener.apply(this, t || []) === this._getOnceReturnValue() && this.removeListener(e, r.listener);
                        return this
                    }, c.trigger = o("emitEvent"), c.emit = function (e) {
                        var t = Array.prototype.slice.call(arguments, 1);
                        return this.emitEvent(e, t)
                    }, c.setOnceReturnValue = function (e) {
                        return this._onceReturnValue = e, this
                    }, c._getOnceReturnValue = function () {
                        return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
                    }, c._getEvents = function () {
                        return this._events || (this._events = {})
                    }, r.noConflict = function () {
                        return e.EventEmitter = a, r
                    }, "function" == typeof t && t.amd ? t(function () {
                        return r
                    }) : "object" == typeof n && n.exports ? n.exports = r : e.EventEmitter = r
                }(this || {})
            }, {}]
    }, {}, [1])
}();
//# sourceMappingURL=forms-api.min.js.map

; /* Placeholders.js v4.0.1 */
/*!
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
!function (a) {
    "use strict";

    function b() {}

    function c() {
        try {
            return document.activeElement
        } catch (a) {
        }
    }

    function d(a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            if (a[c] === b)
                return !0;
        return !1
    }

    function e(a, b, c) {
        return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0
    }

    function f(a, b) {
        var c;
        a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), a.setSelectionRange(b, b))
    }

    function g(a, b) {
        try {
            return a.type = b, !0
        } catch (c) {
            return !1
        }
    }

    function h(a, b) {
        if (a && a.getAttribute(B))
            b(a);
        else
            for (var c, d = a ? a.getElementsByTagName("input") : N, e = a ? a.getElementsByTagName("textarea") : O, f = d ? d.length : 0, g = e ? e.length : 0, h = f + g, i = 0; h > i; i++)
                c = f > i ? d[i] : e[i - f], b(c)
    }

    function i(a) {
        h(a, k)
    }

    function j(a) {
        h(a, l)
    }

    function k(a, b) {
        var c = !!b && a.value !== b,
                d = a.value === a.getAttribute(B);
        if ((c || d) && "true" === a.getAttribute(C)) {
            a.removeAttribute(C), a.value = a.value.replace(a.getAttribute(B), ""), a.className = a.className.replace(A, "");
            var e = a.getAttribute(I);
            parseInt(e, 10) >= 0 && (a.setAttribute("maxLength", e), a.removeAttribute(I));
            var f = a.getAttribute(D);
            return f && (a.type = f), !0
        }
        return !1
    }

    function l(a) {
        var b = a.getAttribute(B);
        if ("" === a.value && b) {
            a.setAttribute(C, "true"), a.value = b, a.className += " " + z;
            var c = a.getAttribute(I);
            c || (a.setAttribute(I, a.maxLength), a.removeAttribute("maxLength"));
            var d = a.getAttribute(D);
            return d ? a.type = "text" : "password" === a.type && g(a, "text") && a.setAttribute(D, "password"), !0
        }
        return !1
    }

    function m(a) {
        return function () {
            P && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) ? f(a, 0) : k(a)
        }
    }

    function n(a) {
        return function () {
            l(a)
        }
    }

    function o(a) {
        return function () {
            i(a)
        }
    }

    function p(a) {
        return function (b) {
            return v = a.value, "true" === a.getAttribute(C) && v === a.getAttribute(B) && d(x, b.keyCode) ? (b.preventDefault && b.preventDefault(), !1) : void 0
        }
    }

    function q(a) {
        return function () {
            k(a, v), "" === a.value && (a.blur(), f(a, 0))
        }
    }

    function r(a) {
        return function () {
            a === c() && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) && f(a, 0)
        }
    }

    function s(a) {
        var b = a.form;
        b && "string" == typeof b && (b = document.getElementById(b), b.getAttribute(E) || (e(b, "submit", o(b)), b.setAttribute(E, "true"))), e(a, "focus", m(a)), e(a, "blur", n(a)), P && (e(a, "keydown", p(a)), e(a, "keyup", q(a)), e(a, "click", r(a))), a.setAttribute(F, "true"), a.setAttribute(B, T), (P || a !== c()) && l(a)
    }
    var t = document.createElement("input"),
            u = void 0 !== t.placeholder;
    if (a.Placeholders = {
        nativeSupport: u,
        disable: u ? b : i,
        enable: u ? b : j
    }, !u) {
        var v, w = ["text", "search", "url", "tel", "email", "password", "number", "textarea"],
                x = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46],
                y = "#ccc",
                z = "placeholdersjs",
                A = new RegExp("(?:^|\\s)" + z + "(?!\\S)"),
                B = "data-placeholder-value",
                C = "data-placeholder-active",
                D = "data-placeholder-type",
                E = "data-placeholder-submit",
                F = "data-placeholder-bound",
                G = "data-placeholder-focus",
                H = "data-placeholder-live",
                I = "data-placeholder-maxlength",
                J = 100,
                K = document.getElementsByTagName("head")[0],
                L = document.documentElement,
                M = a.Placeholders,
                N = document.getElementsByTagName("input"),
                O = document.getElementsByTagName("textarea"),
                P = "false" === L.getAttribute(G),
                Q = "false" !== L.getAttribute(H),
                R = document.createElement("style");
        R.type = "text/css";
        var S = document.createTextNode("." + z + " {color:" + y + ";}");
        R.styleSheet ? R.styleSheet.cssText = S.nodeValue : R.appendChild(S), K.insertBefore(R, K.firstChild);
        for (var T, U, V = 0, W = N.length + O.length; W > V; V++)
            U = V < N.length ? N[V] : O[V - N.length], T = U.attributes.placeholder, T && (T = T.nodeValue, T && d(w, U.type) && s(U));
        var X = setInterval(function () {
            for (var a = 0, b = N.length + O.length; b > a; a++)
                U = a < N.length ? N[a] : O[a - N.length], T = U.attributes.placeholder, T ? (T = T.nodeValue, T && d(w, U.type) && (U.getAttribute(F) || s(U), (T !== U.getAttribute(B) || "password" === U.type && !U.getAttribute(D)) && ("password" === U.type && !U.getAttribute(D) && g(U, "text") && U.setAttribute(D, "password"), U.value === U.getAttribute(B) && (U.value = T), U.setAttribute(B, T)))) : U.getAttribute(C) && (k(U), U.removeAttribute(B));
            Q || clearInterval(X)
        }, J);
        e(a, "beforeunload", function () {
            M.disable()
        })
    }
}(this);


/////////////////////////////////////////////////////////////////////SLIDER

/********************************************
	-	THEMEPUNCH TOOLS Ver. 1.0     -
	 Last Update of Tools 27.02.2015
*********************************************/


/*
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.9
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.skinkers.com/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */



(function(a) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], a)
    } else {
        a(jQuery)
    }
}(function(f) {
    var y = "1.6.9",
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
        v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled,
        d = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
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
        excludedElements: "label, button, input, select, textarea, a, .noSwipe",
        preventDefaultEvents: true
    };
    f.fn.swipetp = function(H) {
        var G = f(this),
            F = G.data(C);
        if (F && typeof H === "string") {
            if (F[H]) {
                return F[H].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                f.error("Method " + H + " does not exist on jQuery.swipetp")
            }
        } else {
            if (!F && (typeof H === "object" || !H)) {
                return w.apply(this, arguments)
            }
        }
        return G
    };
    f.fn.swipetp.version = y;
    f.fn.swipetp.defaults = n;
    f.fn.swipetp.phases = {
        PHASE_START: g,
        PHASE_MOVE: k,
        PHASE_END: h,
        PHASE_CANCEL: q
    };
    f.fn.swipetp.directions = {
        LEFT: p,
        RIGHT: o,
        UP: e,
        DOWN: x,
        IN: c,
        OUT: A
    };
    f.fn.swipetp.pageScroll = {
        NONE: m,
        HORIZONTAL: E,
        VERTICAL: u,
        AUTO: s
    };
    f.fn.swipetp.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
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
        F = f.extend({}, f.fn.swipetp.defaults, F);
        return this.each(function() {
            var H = f(this);
            var G = H.data(C);
            if (!G) {
                G = new D(this, F);
                H.data(C, G)
            }
        })
    }

    function D(a5, aw) {
        var aA = (a || d || !aw.fallbackToMouseEvents),
            K = aA ? (d ? (v ? "MSPointerDown" : "pointerdown") : "touchstart") : "mousedown",
            az = aA ? (d ? (v ? "MSPointerMove" : "pointermove") : "touchmove") : "mousemove",
            V = aA ? (d ? (v ? "MSPointerUp" : "pointerup") : "touchend") : "mouseup",
            T = aA ? null : "mouseleave",
            aE = (d ? (v ? "MSPointerCancel" : "pointercancel") : "touchcancel");
        var ah = 0,
            aQ = null,
            ac = 0,
            a2 = 0,
            a0 = 0,
            H = 1,
            ar = 0,
            aK = 0,
            N = null;
        var aS = f(a5);
        var aa = "start";
        var X = 0;
        var aR = null;
        var U = 0,
            a3 = 0,
            a6 = 0,
            ae = 0,
            O = 0;
        var aX = null,
            ag = null;
        try {
            aS.bind(K, aO);
            aS.bind(aE, ba)
        } catch (al) {
            f.error("events not supported " + K + "," + aE + " on jQuery.swipetp")
        }
        this.enable = function() {
            aS.bind(K, aO);
            aS.bind(aE, ba);
            return aS
        };
        this.disable = function() {
            aL();
            return aS
        };
        this.destroy = function() {
            aL();
            aS.data(C, null);
            aS = null
        };
        this.option = function(bd, bc) {
            if (aw[bd] !== undefined) {
                if (bc === undefined) {
                    return aw[bd]
                } else {
                    aw[bd] = bc
                }
            } else {
                f.error("Option " + bd + " does not exist on jQuery.swipetp.options")
            }
            return null
        };

        function aO(be) {
            if (aC()) {
                return
            }
            if (f(be.target).closest(aw.excludedElements, aS).length > 0) {
                return
            }
            var bf = be.originalEvent ? be.originalEvent : be;
            var bd, bg = bf.touches,
                bc = bg ? bg[0] : bf;
            aa = g;
            if (bg) {
                X = bg.length
            } else {
                be.preventDefault()
            }
            ah = 0;
            aQ = null;
            aK = null;
            ac = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            ar = 0;
            aR = ak();
            N = ab();
            S();
            if (!bg || (X === aw.fingers || aw.fingers === i) || aY()) {
                aj(0, bc);
                U = au();
                if (X == 2) {
                    aj(1, bg[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start)
                }
                if (aw.swipeStatus || aw.pinchStatus) {
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
                if (aw.hold) {
                    ag = setTimeout(f.proxy(function() {
                        aS.trigger("hold", [bf.target]);
                        if (aw.hold) {
                            bd = aw.hold.call(aS, bf, bf.target)
                        }
                    }, this), aw.longTapThreshold)
                }
                ap(true)
            }
            return null
        }

        function a4(bf) {
            var bi = bf.originalEvent ? bf.originalEvent : bf;
            if (aa === h || aa === q || an()) {
                return
            }
            var be, bj = bi.touches,
                bd = bj ? bj[0] : bi;
            var bg = aI(bd);
            a3 = au();
            if (bj) {
                X = bj.length
            }
            if (aw.hold) {
                clearTimeout(ag)
            }
            aa = k;
            if (X == 2) {
                if (a2 == 0) {
                    aj(1, bj[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start)
                } else {
                    aI(bj[1]);
                    a0 = av(aR[0].end, aR[1].end);
                    aK = at(aR[0].end, aR[1].end)
                }
                H = a8(a2, a0);
                ar = Math.abs(a2 - a0)
            }
            if ((X === aw.fingers || aw.fingers === i) || !bj || aY()) {
                aQ = aM(bg.start, bg.end);
                am(bf, aQ);
                ah = aT(bg.start, bg.end);
                ac = aN();
                aJ(aQ, ah);
                if (aw.swipeStatus || aw.pinchStatus) {
                    be = P(bi, aa)
                }
                if (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave) {
                    var bc = true;
                    if (aw.triggerOnTouchLeave) {
                        var bh = aZ(this);
                        bc = F(bg.end, bh)
                    }
                    if (!aw.triggerOnTouchEnd && bc) {
                        aa = aD(k)
                    } else {
                        if (aw.triggerOnTouchLeave && !bc) {
                            aa = aD(h)
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
                if (be.length) {
                    G();
                    return true
                }
            }
            if (an()) {
                X = ae
            }
            a3 = au();
            ac = aN();
            if (bb() || !ao()) {
                aa = q;
                P(bd, aa)
            } else {
                if (aw.triggerOnTouchEnd || (aw.triggerOnTouchEnd == false && aa === k)) {
                    bc.preventDefault();
                    aa = h;
                    P(bd, aa)
                } else {
                    if (!aw.triggerOnTouchEnd && a7()) {
                        aa = h;
                        aG(bd, aa, B)
                    } else {
                        if (aa === k) {
                            aa = q;
                            P(bd, aa)
                        }
                    }
                }
            }
            ap(false);
            return null
        }

        function ba() {
            X = 0;
            a3 = 0;
            U = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            S();
            ap(false)
        }

        function L(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc;
            if (aw.triggerOnTouchLeave) {
                aa = aD(h);
                P(bd, aa)
            }
        }

        function aL() {
            aS.unbind(K, aO);
            aS.unbind(aE, ba);
            aS.unbind(az, a4);
            aS.unbind(V, M);
            if (T) {
                aS.unbind(T, L)
            }
            ap(false)
        }

        function aD(bg) {
            var bf = bg;
            var be = aB();
            var bd = ao();
            var bc = bb();
            if (!be || bc) {
                bf = q
            } else {
                if (bd && bg == k && (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave)) {
                    bf = h
                } else {
                    if (!bd && bg == h && aw.triggerOnTouchLeave) {
                        bf = q
                    }
                }
            }
            return bf
        }

        function P(be, bc) {
            var bd, bf = be.touches;
            if ((J() || W()) || (Q() || aY())) {
                if (J() || W()) {
                    bd = aG(be, bc, l)
                }
                if ((Q() || aY()) && bd !== false) {
                    bd = aG(be, bc, t)
                }
            } else {
                if (aH() && bd !== false) {
                    bd = aG(be, bc, j)
                } else {
                    if (aq() && bd !== false) {
                        bd = aG(be, bc, b)
                    } else {
                        if (ai() && bd !== false) {
                            bd = aG(be, bc, B)
                        }
                    }
                }
            }
            if (bc === q) {
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

        function aG(bf, bc, be) {
            var bd;
            if (be == l) {
                aS.trigger("swipeStatus", [bc, aQ || null, ah || 0, ac || 0, X, aR]);
                if (aw.swipeStatus) {
                    bd = aw.swipeStatus.call(aS, bf, bc, aQ || null, ah || 0, ac || 0, X, aR);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && aW()) {
                    aS.trigger("swipe", [aQ, ah, ac, X, aR]);
                    if (aw.swipe) {
                        bd = aw.swipe.call(aS, bf, aQ, ah, ac, X, aR);
                        if (bd === false) {
                            return false
                        }
                    }
                    switch (aQ) {
                        case p:
                            aS.trigger("swipeLeft", [aQ, ah, ac, X, aR]);
                            if (aw.swipeLeft) {
                                bd = aw.swipeLeft.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case o:
                            aS.trigger("swipeRight", [aQ, ah, ac, X, aR]);
                            if (aw.swipeRight) {
                                bd = aw.swipeRight.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case e:
                            aS.trigger("swipeUp", [aQ, ah, ac, X, aR]);
                            if (aw.swipeUp) {
                                bd = aw.swipeUp.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case x:
                            aS.trigger("swipeDown", [aQ, ah, ac, X, aR]);
                            if (aw.swipeDown) {
                                bd = aw.swipeDown.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break
                    }
                }
            }
            if (be == t) {
                aS.trigger("pinchStatus", [bc, aK || null, ar || 0, ac || 0, X, H, aR]);
                if (aw.pinchStatus) {
                    bd = aw.pinchStatus.call(aS, bf, bc, aK || null, ar || 0, ac || 0, X, H, aR);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && a9()) {
                    switch (aK) {
                        case c:
                            aS.trigger("pinchIn", [aK || null, ar || 0, ac || 0, X, H, aR]);
                            if (aw.pinchIn) {
                                bd = aw.pinchIn.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR)
                            }
                            break;
                        case A:
                            aS.trigger("pinchOut", [aK || null, ar || 0, ac || 0, X, H, aR]);
                            if (aw.pinchOut) {
                                bd = aw.pinchOut.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR)
                            }
                            break
                    }
                }
            }
            if (be == B) {
                if (bc === q || bc === h) {
                    clearTimeout(aX);
                    clearTimeout(ag);
                    if (Z() && !I()) {
                        O = au();
                        aX = setTimeout(f.proxy(function() {
                            O = null;
                            aS.trigger("tap", [bf.target]);
                            if (aw.tap) {
                                bd = aw.tap.call(aS, bf, bf.target)
                            }
                        }, this), aw.doubleTapThreshold)
                    } else {
                        O = null;
                        aS.trigger("tap", [bf.target]);
                        if (aw.tap) {
                            bd = aw.tap.call(aS, bf, bf.target)
                        }
                    }
                }
            } else {
                if (be == j) {
                    if (bc === q || bc === h) {
                        clearTimeout(aX);
                        O = null;
                        aS.trigger("doubletap", [bf.target]);
                        if (aw.doubleTap) {
                            bd = aw.doubleTap.call(aS, bf, bf.target)
                        }
                    }
                } else {
                    if (be == b) {
                        if (bc === q || bc === h) {
                            clearTimeout(aX);
                            O = null;
                            aS.trigger("longtap", [bf.target]);
                            if (aw.longTap) {
                                bd = aw.longTap.call(aS, bf, bf.target)
                            }
                        }
                    }
                }
            }
            return bd
        }

        function ao() {
            var bc = true;
            if (aw.threshold !== null) {
                bc = ah >= aw.threshold
            }
            return bc
        }

        function bb() {
            var bc = false;
            if (aw.cancelThreshold !== null && aQ !== null) {
                bc = (aU(aQ) - ah) >= aw.cancelThreshold
            }
            return bc
        }

        function af() {
            if (aw.pinchThreshold !== null) {
                return ar >= aw.pinchThreshold
            }
            return true
        }

        function aB() {
            var bc;
            if (aw.maxTimeThreshold) {
                if (ac >= aw.maxTimeThreshold) {
                    bc = false
                } else {
                    bc = true
                }
            } else {
                bc = true
            }
            return bc
        }

        function am(bc, bd) {
            if (aw.preventDefaultEvents === false) {
                return
            }
            if (aw.allowPageScroll === m) {
                bc.preventDefault()
            } else {
                var be = aw.allowPageScroll === s;
                switch (bd) {
                    case p:
                        if ((aw.swipeLeft && be) || (!be && aw.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case o:
                        if ((aw.swipeRight && be) || (!be && aw.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case e:
                        if ((aw.swipeUp && be) || (!be && aw.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break;
                    case x:
                        if ((aw.swipeDown && be) || (!be && aw.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break
                }
            }
        }

        function a9() {
            var bd = aP();
            var bc = Y();
            var be = af();
            return bd && bc && be
        }

        function aY() {
            return !!(aw.pinchStatus || aw.pinchIn || aw.pinchOut)
        }

        function Q() {
            return !!(a9() && aY())
        }

        function aW() {
            var bf = aB();
            var bh = ao();
            var be = aP();
            var bc = Y();
            var bd = bb();
            var bg = !bd && bc && be && bh && bf;
            return bg
        }

        function W() {
            return !!(aw.swipe || aw.swipeStatus || aw.swipeLeft || aw.swipeRight || aw.swipeUp || aw.swipeDown)
        }

        function J() {
            return !!(aW() && W())
        }

        function aP() {
            return ((X === aw.fingers || aw.fingers === i) || !a)
        }

        function Y() {
            return aR[0].end.x !== 0
        }

        function a7() {
            return !!(aw.tap)
        }

        function Z() {
            return !!(aw.doubleTap)
        }

        function aV() {
            return !!(aw.longTap)
        }

        function R() {
            if (O == null) {
                return false
            }
            var bc = au();
            return (Z() && ((bc - O) <= aw.doubleTapThreshold))
        }

        function I() {
            return R()
        }

        function ay() {
            return ((X === 1 || !a) && (isNaN(ah) || ah < aw.threshold))
        }

        function a1() {
            return ((ac > aw.longTapThreshold) && (ah < r))
        }

        function ai() {
            return !!(ay() && a7())
        }

        function aH() {
            return !!(R() && Z())
        }

        function aq() {
            return !!(a1() && aV())
        }

        function G() {
            a6 = au();
            ae = event.touches.length + 1
        }

        function S() {
            a6 = 0;
            ae = 0
        }

        function an() {
            var bc = false;
            if (a6) {
                var bd = au() - a6;
                if (bd <= aw.fingerReleaseThreshold) {
                    bc = true
                }
            }
            return bc
        }

        function aC() {
            return !!(aS.data(C + "_intouch") === true)
        }

        function ap(bc) {
            if (bc === true) {
                aS.bind(az, a4);
                aS.bind(V, M);
                if (T) {
                    aS.bind(T, L)
                }
            } else {
                aS.unbind(az, a4, false);
                aS.unbind(V, M, false);
                if (T) {
                    aS.unbind(T, L, false)
                }
            }
            aS.data(C + "_intouch", bc === true)
        }

        function aj(bd, bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            aR[bd].identifier = be;
            aR[bd].start.x = aR[bd].end.x = bc.pageX || bc.clientX;
            aR[bd].start.y = aR[bd].end.y = bc.pageY || bc.clientY;
            return aR[bd]
        }

        function aI(bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            var bd = ad(be);
            bd.end.x = bc.pageX || bc.clientX;
            bd.end.y = bc.pageY || bc.clientY;
            return bd
        }

        function ad(bd) {
            for (var bc = 0; bc < aR.length; bc++) {
                if (aR[bc].identifier == bd) {
                    return aR[bc]
                }
            }
        }

        function ak() {
            var bc = [];
            for (var bd = 0; bd <= 5; bd++) {
                bc.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                })
            }
            return bc
        }

        function aJ(bc, bd) {
            bd = Math.max(bd, aU(bc));
            N[bc].distance = bd
        }

        function aU(bc) {
            if (N[bc]) {
                return N[bc].distance
            }
            return undefined
        }

        function ab() {
            var bc = {};
            bc[p] = ax(p);
            bc[o] = ax(o);
            bc[e] = ax(e);
            bc[x] = ax(x);
            return bc
        }

        function ax(bc) {
            return {
                direction: bc,
                distance: 0
            }
        }

        function aN() {
            return a3 - U
        }

        function av(bf, be) {
            var bd = Math.abs(bf.x - be.x);
            var bc = Math.abs(bf.y - be.y);
            return Math.round(Math.sqrt(bd * bd + bc * bc))
        }

        function a8(bc, bd) {
            var be = (bd / bc) * 1;
            return be.toFixed(2)
        }

        function at() {
            if (H < 1) {
                return A
            } else {
                return c
            }
        }

        function aT(bd, bc) {
            return Math.round(Math.sqrt(Math.pow(bc.x - bd.x, 2) + Math.pow(bc.y - bd.y, 2)))
        }

        function aF(bf, bd) {
            var bc = bf.x - bd.x;
            var bh = bd.y - bf.y;
            var be = Math.atan2(bh, bc);
            var bg = Math.round(be * 180 / Math.PI);
            if (bg < 0) {
                bg = 360 - Math.abs(bg)
            }
            return bg
        }

        function aM(bd, bc) {
            var be = aF(bd, bc);
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

        function au() {
            var bc = new Date();
            return bc.getTime()
        }

        function aZ(bc) {
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
}));

if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = console.groupCollapsed = function() {};
}

if (window.tplogs == true)
    try {
        console.groupCollapsed("ThemePunch GreenSocks Logs");
    } catch (e) {}


var oldgs = window.GreenSockGlobals;
oldgs_queue = window._gsQueue;

var punchgs = window.GreenSockGlobals = {};

if (window.tplogs == true)
    try {
        console.info("Build GreenSock SandBox for ThemePunch Plugins");
        console.info("GreenSock TweenLite Engine Initalised by ThemePunch Plugin");
    } catch (e) {}


    /* TWEEN LITE */
    /*!
     * VERSION: 1.19.1
     * DATE: 2017-01-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     */
    ! function(a, b) {
        "use strict";
        var c = {},
            d = a.document,
            e = a.GreenSockGlobals = a.GreenSockGlobals || a;
        if (!e.TweenLite) {
            var f, g, h, i, j, k = function(a) {
                    var b, c = a.split("."),
                        d = e;
                    for (b = 0; b < c.length; b++) d[c[b]] = d = d[c[b]] || {};
                    return d
                },
                l = k("com.greensock"),
                m = 1e-10,
                n = function(a) {
                    var b, c = [],
                        d = a.length;
                    for (b = 0; b !== d; c.push(a[b++]));
                    return c
                },
                o = function() {},
                p = function() {
                    var a = Object.prototype.toString,
                        b = a.call([]);
                    return function(c) {
                        return null != c && (c instanceof Array || "object" == typeof c && !!c.push && a.call(c) === b)
                    }
                }(),
                q = {},
                r = function(d, f, g, h) {
                    this.sc = q[d] ? q[d].sc : [], q[d] = this, this.gsClass = null, this.func = g;
                    var i = [];
                    this.check = function(j) {
                        for (var l, m, n, o, p, s = f.length, t = s; --s > -1;)(l = q[f[s]] || new r(f[s], [])).gsClass ? (i[s] = l.gsClass, t--) : j && l.sc.push(this);
                        if (0 === t && g) {
                            if (m = ("com.greensock." + d).split("."), n = m.pop(), o = k(m.join("."))[n] = this.gsClass = g.apply(g, i), h)
                                if (e[n] = c[n] = o, p = "undefined" != typeof module && module.exports, !p && "function" == typeof define && define.amd) define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + d.split(".").pop(), [], function() {
                                    return o
                                });
                                else if (p)
                                if (d === b) {
                                    module.exports = c[b] = o;
                                    for (s in c) o[s] = c[s]
                                } else c[b] && (c[b][n] = o);
                            for (s = 0; s < this.sc.length; s++) this.sc[s].check()
                        }
                    }, this.check(!0)
                },
                s = a._gsDefine = function(a, b, c, d) {
                    return new r(a, b, c, d)
                },
                t = l._class = function(a, b, c) {
                    return b = b || function() {}, s(a, [], function() {
                        return b
                    }, c), b
                };
            s.globals = e;
            var u = [0, 0, 1, 1],
                v = t("easing.Ease", function(a, b, c, d) {
                    this._func = a, this._type = c || 0, this._power = d || 0, this._params = b ? u.concat(b) : u
                }, !0),
                w = v.map = {},
                x = v.register = function(a, b, c, d) {
                    for (var e, f, g, h, i = b.split(","), j = i.length, k = (c || "easeIn,easeOut,easeInOut").split(","); --j > -1;)
                        for (f = i[j], e = d ? t("easing." + f, null, !0) : l.easing[f] || {}, g = k.length; --g > -1;) h = k[g], w[f + "." + h] = w[h + f] = e[h] = a.getRatio ? a : a[h] || new a
                };
            for (h = v.prototype, h._calcEnd = !1, h.getRatio = function(a) {
                    if (this._func) return this._params[0] = a, this._func.apply(null, this._params);
                    var b = this._type,
                        c = this._power,
                        d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
                    return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *= d * d * d : 4 === c && (d *= d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
                }, f = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], g = f.length; --g > -1;) h = f[g] + ",Power" + g, x(new v(null, null, 1, g), h, "easeOut", !0), x(new v(null, null, 2, g), h, "easeIn" + (0 === g ? ",easeNone" : "")), x(new v(null, null, 3, g), h, "easeInOut");
            w.linear = l.easing.Linear.easeIn, w.swing = l.easing.Quad.easeInOut;
            var y = t("events.EventDispatcher", function(a) {
                this._listeners = {}, this._eventTarget = a || this
            });
            h = y.prototype, h.addEventListener = function(a, b, c, d, e) {
                e = e || 0;
                var f, g, h = this._listeners[a],
                    k = 0;
                for (this !== i || j || i.wake(), null == h && (this._listeners[a] = h = []), g = h.length; --g > -1;) f = h[g], f.c === b && f.s === c ? h.splice(g, 1) : 0 === k && f.pr < e && (k = g + 1);
                h.splice(k, 0, {
                    c: b,
                    s: c,
                    up: d,
                    pr: e
                })
            }, h.removeEventListener = function(a, b) {
                var c, d = this._listeners[a];
                if (d)
                    for (c = d.length; --c > -1;)
                        if (d[c].c === b) return void d.splice(c, 1)
            }, h.dispatchEvent = function(a) {
                var b, c, d, e = this._listeners[a];
                if (e)
                    for (b = e.length, b > 1 && (e = e.slice(0)), c = this._eventTarget; --b > -1;) d = e[b], d && (d.up ? d.c.call(d.s || c, {
                        type: a,
                        target: c
                    }) : d.c.call(d.s || c))
            };
            var z = a.requestAnimationFrame,
                A = a.cancelAnimationFrame,
                B = Date.now || function() {
                    return (new Date).getTime()
                },
                C = B();
            for (f = ["ms", "moz", "webkit", "o"], g = f.length; --g > -1 && !z;) z = a[f[g] + "RequestAnimationFrame"], A = a[f[g] + "CancelAnimationFrame"] || a[f[g] + "CancelRequestAnimationFrame"];
            t("Ticker", function(a, b) {
                var c, e, f, g, h, k = this,
                    l = B(),
                    n = b !== !1 && z ? "auto" : !1,
                    p = 500,
                    q = 33,
                    r = "tick",
                    s = function(a) {
                        var b, d, i = B() - C;
                        i > p && (l += i - q), C += i, k.time = (C - l) / 1e3, b = k.time - h, (!c || b > 0 || a === !0) && (k.frame++, h += b + (b >= g ? .004 : g - b), d = !0), a !== !0 && (f = e(s)), d && k.dispatchEvent(r)
                    };
                y.call(k), k.time = k.frame = 0, k.tick = function() {
                    s(!0)
                }, k.lagSmoothing = function(a, b) {
                    p = a || 1 / m, q = Math.min(b, p, 0)
                }, k.sleep = function() {
                    null != f && (n && A ? A(f) : clearTimeout(f), e = o, f = null, k === i && (j = !1))
                }, k.wake = function(a) {
                    null !== f ? k.sleep() : a ? l += -C + (C = B()) : k.frame > 10 && (C = B() - p + 5), e = 0 === c ? o : n && z ? z : function(a) {
                        return setTimeout(a, 1e3 * (h - k.time) + 1 | 0)
                    }, k === i && (j = !0), s(2)
                }, k.fps = function(a) {
                    return arguments.length ? (c = a, g = 1 / (c || 60), h = this.time + g, void k.wake()) : c
                }, k.useRAF = function(a) {
                    return arguments.length ? (k.sleep(), n = a, void k.fps(c)) : n
                }, k.fps(a), setTimeout(function() {
                    "auto" === n && k.frame < 5 && "hidden" !== d.visibilityState && k.useRAF(!1)
                }, 1500)
            }), h = l.Ticker.prototype = new l.events.EventDispatcher, h.constructor = l.Ticker;
            var D = t("core.Animation", function(a, b) {
                if (this.vars = b = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = b.immediateRender === !0, this.data = b.data, this._reversed = b.reversed === !0, W) {
                    j || i.wake();
                    var c = this.vars.useFrames ? V : W;
                    c.add(this, c._time), this.vars.paused && this.paused(!0)
                }
            });
            i = D.ticker = new l.Ticker, h = D.prototype, h._dirty = h._gc = h._initted = h._paused = !1, h._totalTime = h._time = 0, h._rawPrevTime = -1, h._next = h._last = h._onUpdate = h._timeline = h.timeline = null, h._paused = !1;
            var E = function() {
                j && B() - C > 2e3 && i.wake(), setTimeout(E, 2e3)
            };
            E(), h.play = function(a, b) {
                return null != a && this.seek(a, b), this.reversed(!1).paused(!1)
            }, h.pause = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!0)
            }, h.resume = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!1)
            }, h.seek = function(a, b) {
                return this.totalTime(Number(a), b !== !1)
            }, h.restart = function(a, b) {
                return this.reversed(!1).paused(!1).totalTime(a ? -this._delay : 0, b !== !1, !0)
            }, h.reverse = function(a, b) {
                return null != a && this.seek(a || this.totalDuration(), b), this.reversed(!0).paused(!1)
            }, h.render = function(a, b, c) {}, h.invalidate = function() {
                return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
            }, h.isActive = function() {
                var a, b = this._timeline,
                    c = this._startTime;
                return !b || !this._gc && !this._paused && b.isActive() && (a = b.rawTime(!0)) >= c && a < c + this.totalDuration() / this._timeScale
            }, h._enabled = function(a, b) {
                return j || i.wake(), this._gc = !a, this._active = this.isActive(), b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
            }, h._kill = function(a, b) {
                return this._enabled(!1, !1)
            }, h.kill = function(a, b) {
                return this._kill(a, b), this
            }, h._uncache = function(a) {
                for (var b = a ? this : this.timeline; b;) b._dirty = !0, b = b.timeline;
                return this
            }, h._swapSelfInParams = function(a) {
                for (var b = a.length, c = a.concat(); --b > -1;) "{self}" === a[b] && (c[b] = this);
                return c
            }, h._callback = function(a) {
                var b = this.vars,
                    c = b[a],
                    d = b[a + "Params"],
                    e = b[a + "Scope"] || b.callbackScope || this,
                    f = d ? d.length : 0;
                switch (f) {
                    case 0:
                        c.call(e);
                        break;
                    case 1:
                        c.call(e, d[0]);
                        break;
                    case 2:
                        c.call(e, d[0], d[1]);
                        break;
                    default:
                        c.apply(e, d)
                }
            }, h.eventCallback = function(a, b, c, d) {
                if ("on" === (a || "").substr(0, 2)) {
                    var e = this.vars;
                    if (1 === arguments.length) return e[a];
                    null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = p(c) && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d), "onUpdate" === a && (this._onUpdate = b)
                }
                return this
            }, h.delay = function(a) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
            }, h.duration = function(a) {
                return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
            }, h.totalDuration = function(a) {
                return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
            }, h.time = function(a, b) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
            }, h.totalTime = function(a, b, c) {
                if (j || i.wake(), !arguments.length) return this._totalTime;
                if (this._timeline) {
                    if (0 > a && !c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                        this._dirty && this.totalDuration();
                        var d = this._totalDuration,
                            e = this._timeline;
                        if (a > d && !c && (a = d), this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale, e._dirty || this._uncache(!1), e._timeline)
                            for (; e._timeline;) e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0), e = e._timeline
                    }
                    this._gc && this._enabled(!0, !1), (this._totalTime !== a || 0 === this._duration) && (J.length && Y(), this.render(a, b, !1), J.length && Y())
                }
                return this
            }, h.progress = h.totalProgress = function(a, b) {
                var c = this.duration();
                return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
            }, h.startTime = function(a) {
                return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
            }, h.endTime = function(a) {
                return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
            }, h.timeScale = function(a) {
                if (!arguments.length) return this._timeScale;
                if (a = a || m, this._timeline && this._timeline.smoothChildTiming) {
                    var b = this._pauseTime,
                        c = b || 0 === b ? b : this._timeline.totalTime();
                    this._startTime = c - (c - this._startTime) * this._timeScale / a
                }
                return this._timeScale = a, this._uncache(!1)
            }, h.reversed = function(a) {
                return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
            }, h.paused = function(a) {
                if (!arguments.length) return this._paused;
                var b, c, d = this._timeline;
                return a != this._paused && d && (j || a || i.wake(), b = d.rawTime(), c = b - this._pauseTime, !a && d.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = this.isActive(), !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale, this.render(b, b === this._totalTime, !0))), this._gc && !a && this._enabled(!0, !1), this
            };
            var F = t("core.SimpleTimeline", function(a) {
                D.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming = !0
            });
            h = F.prototype = new D, h.constructor = F, h.kill()._gc = !1, h._first = h._last = h._recent = null, h._sortChildren = !1, h.add = h.insert = function(a, b, c, d) {
                var e, f;
                if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), e = this._last, this._sortChildren)
                    for (f = a._startTime; e && e._startTime > f;) e = e._prev;
                return e ? (a._next = e._next, e._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = e, this._recent = a, this._timeline && this._uncache(!0), this
            }, h._remove = function(a, b) {
                return a.timeline === this && (b || a._enabled(!1, !0), a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev), a._next = a._prev = a.timeline = null, a === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
            }, h.render = function(a, b, c) {
                var d, e = this._first;
                for (this._totalTime = this._time = this._rawPrevTime = a; e;) d = e._next, (e._active || a >= e._startTime && !e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)), e = d
            }, h.rawTime = function() {
                return j || i.wake(), this._totalTime
            };
            var G = t("TweenLite", function(b, c, d) {
                    if (D.call(this, c, d), this.render = G.prototype.render, null == b) throw "Cannot tween a null target.";
                    this.target = b = "string" != typeof b ? b : G.selector(b) || b;
                    var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType),
                        i = this.vars.overwrite;
                    if (this._overwrite = i = null == i ? U[G.defaultOverwrite] : "number" == typeof i ? i >> 0 : U[i], (h || b instanceof Array || b.push && p(b)) && "number" != typeof b[0])
                        for (this._targets = g = n(b), this._propLookup = [], this._siblings = [], e = 0; e < g.length; e++) f = g[e], f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style && !f.nodeType) ? (g.splice(e--, 1), this._targets = g = g.concat(n(f))) : (this._siblings[e] = Z(f, this, !1), 1 === i && this._siblings[e].length > 1 && _(f, this, null, 1, this._siblings[e])) : (f = g[e--] = G.selector(f), "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
                    else this._propLookup = {}, this._siblings = Z(b, this, !1), 1 === i && this._siblings.length > 1 && _(b, this, null, 1, this._siblings);
                    (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -m, this.render(Math.min(0, -this._delay)))
                }, !0),
                H = function(b) {
                    return b && b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType)
                },
                I = function(a, b) {
                    var c, d = {};
                    for (c in a) T[c] || c in b && "transform" !== c && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c || !(!Q[c] || Q[c] && Q[c]._autoCSS) || (d[c] = a[c], delete a[c]);
                    a.css = d
                };
            h = G.prototype = new D, h.constructor = G, h.kill()._gc = !1, h.ratio = 0, h._firstPT = h._targets = h._overwrittenProps = h._startAt = null, h._notifyPluginsOfEnabled = h._lazy = !1, G.version = "1.19.1", G.defaultEase = h._ease = new v(null, null, 1, 1), G.defaultOverwrite = "auto", G.ticker = i, G.autoSleep = 120, G.lagSmoothing = function(a, b) {
                i.lagSmoothing(a, b)
            }, G.selector = a.$ || a.jQuery || function(b) {
                var c = a.$ || a.jQuery;
                return c ? (G.selector = c, c(b)) : "undefined" == typeof d ? b : d.querySelectorAll ? d.querySelectorAll(b) : d.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
            };
            var J = [],
                K = {},
                L = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
                M = function(a) {
                    for (var b, c = this._firstPT, d = 1e-6; c;) b = c.blob ? 1 === a ? this.end : a ? this.join("") : this.start : c.c * a + c.s, c.m ? b = c.m(b, this._target || c.t) : d > b && b > -d && !c.blob && (b = 0), c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b, c = c._next
                },
                N = function(a, b, c, d) {
                    var e, f, g, h, i, j, k, l = [],
                        m = 0,
                        n = "",
                        o = 0;
                    for (l.start = a, l.end = b, a = l[0] = a + "", b = l[1] = b + "", c && (c(l), a = l[0], b = l[1]), l.length = 0, e = a.match(L) || [], f = b.match(L) || [], d && (d._next = null, d.blob = 1, l._firstPT = l._applyPT = d), i = f.length, h = 0; i > h; h++) k = f[h], j = b.substr(m, b.indexOf(k, m) - m), n += j || !h ? j : ",", m += j.length, o ? o = (o + 1) % 5 : "rgba(" === j.substr(-5) && (o = 1), k === e[h] || e.length <= h ? n += k : (n && (l.push(n), n = ""), g = parseFloat(e[h]), l.push(g), l._firstPT = {
                        _next: l._firstPT,
                        t: l,
                        p: l.length - 1,
                        s: g,
                        c: ("=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * parseFloat(k.substr(2)) : parseFloat(k) - g) || 0,
                        f: 0,
                        m: o && 4 > o ? Math.round : 0
                    }), m += k.length;
                    return n += b.substr(m), n && l.push(n), l.setRatio = M, l
                },
                O = function(a, b, c, d, e, f, g, h, i) {
                    "function" == typeof d && (d = d(i || 0, a));
                    var j, k = typeof a[b],
                        l = "function" !== k ? "" : b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3),
                        m = "get" !== c ? c : l ? g ? a[l](g) : a[l]() : a[b],
                        n = "string" == typeof d && "=" === d.charAt(1),
                        o = {
                            t: a,
                            p: b,
                            s: m,
                            f: "function" === k,
                            pg: 0,
                            n: e || b,
                            m: f ? "function" == typeof f ? f : Math.round : 0,
                            pr: 0,
                            c: n ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)) : parseFloat(d) - m || 0
                        };
                    return ("number" != typeof m || "number" != typeof d && !n) && (g || isNaN(m) || !n && isNaN(d) || "boolean" == typeof m || "boolean" == typeof d ? (o.fp = g, j = N(m, n ? o.s + o.c : d, h || G.defaultStringFilter, o), o = {
                        t: j,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 2,
                        pg: 0,
                        n: e || b,
                        pr: 0,
                        m: 0
                    }) : (o.s = parseFloat(m), n || (o.c = parseFloat(d) - o.s || 0))), o.c ? ((o._next = this._firstPT) && (o._next._prev = o), this._firstPT = o, o) : void 0
                },
                P = G._internals = {
                    isArray: p,
                    isSelector: H,
                    lazyTweens: J,
                    blobDif: N
                },
                Q = G._plugins = {},
                R = P.tweenLookup = {},
                S = 0,
                T = P.reservedProps = {
                    ease: 1,
                    delay: 1,
                    overwrite: 1,
                    onComplete: 1,
                    onCompleteParams: 1,
                    onCompleteScope: 1,
                    useFrames: 1,
                    runBackwards: 1,
                    startAt: 1,
                    onUpdate: 1,
                    onUpdateParams: 1,
                    onUpdateScope: 1,
                    onStart: 1,
                    onStartParams: 1,
                    onStartScope: 1,
                    onReverseComplete: 1,
                    onReverseCompleteParams: 1,
                    onReverseCompleteScope: 1,
                    onRepeat: 1,
                    onRepeatParams: 1,
                    onRepeatScope: 1,
                    easeParams: 1,
                    yoyo: 1,
                    immediateRender: 1,
                    repeat: 1,
                    repeatDelay: 1,
                    data: 1,
                    paused: 1,
                    reversed: 1,
                    autoCSS: 1,
                    lazy: 1,
                    onOverwrite: 1,
                    callbackScope: 1,
                    stringFilter: 1,
                    id: 1
                },
                U = {
                    none: 0,
                    all: 1,
                    auto: 2,
                    concurrent: 3,
                    allOnStart: 4,
                    preexisting: 5,
                    "true": 1,
                    "false": 0
                },
                V = D._rootFramesTimeline = new F,
                W = D._rootTimeline = new F,
                X = 30,
                Y = P.lazyRender = function() {
                    var a, b = J.length;
                    for (K = {}; --b > -1;) a = J[b], a && a._lazy !== !1 && (a.render(a._lazy[0], a._lazy[1], !0), a._lazy = !1);
                    J.length = 0
                };
            W._startTime = i.time, V._startTime = i.frame, W._active = V._active = !0, setTimeout(Y, 1), D._updateRoot = G.render = function() {
                var a, b, c;
                if (J.length && Y(), W.render((i.time - W._startTime) * W._timeScale, !1, !1), V.render((i.frame - V._startTime) * V._timeScale, !1, !1), J.length && Y(), i.frame >= X) {
                    X = i.frame + (parseInt(G.autoSleep, 10) || 120);
                    for (c in R) {
                        for (b = R[c].tweens, a = b.length; --a > -1;) b[a]._gc && b.splice(a, 1);
                        0 === b.length && delete R[c]
                    }
                    if (c = W._first, (!c || c._paused) && G.autoSleep && !V._first && 1 === i._listeners.tick.length) {
                        for (; c && c._paused;) c = c._next;
                        c || i.sleep()
                    }
                }
            }, i.addEventListener("tick", D._updateRoot);
            var Z = function(a, b, c) {
                    var d, e, f = a._gsTweenID;
                    if (R[f || (a._gsTweenID = f = "t" + S++)] || (R[f] = {
                            target: a,
                            tweens: []
                        }), b && (d = R[f].tweens, d[e = d.length] = b, c))
                        for (; --e > -1;) d[e] === b && d.splice(e, 1);
                    return R[f].tweens
                },
                $ = function(a, b, c, d) {
                    var e, f, g = a.vars.onOverwrite;
                    return g && (e = g(a, b, c, d)), g = G.onOverwrite, g && (f = g(a, b, c, d)), e !== !1 && f !== !1
                },
                _ = function(a, b, c, d, e) {
                    var f, g, h, i;
                    if (1 === d || d >= 4) {
                        for (i = e.length, f = 0; i > f; f++)
                            if ((h = e[f]) !== b) h._gc || h._kill(null, a, b) && (g = !0);
                            else if (5 === d) break;
                        return g
                    }
                    var j, k = b._startTime + m,
                        l = [],
                        n = 0,
                        o = 0 === b._duration;
                    for (f = e.length; --f > -1;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || aa(b, 0, o), 0 === aa(h, j, o) && (l[n++] = h)) : h._startTime <= k && h._startTime + h.totalDuration() / h._timeScale > k && ((o || !h._initted) && k - h._startTime <= 2e-10 || (l[n++] = h)));
                    for (f = n; --f > -1;)
                        if (h = l[f], 2 === d && h._kill(c, a, b) && (g = !0), 2 !== d || !h._firstPT && h._initted) {
                            if (2 !== d && !$(h, b)) continue;
                            h._enabled(!1, !1) && (g = !0)
                        }
                    return g
                },
                aa = function(a, b, c) {
                    for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
                        if (f += d._startTime, e *= d._timeScale, d._paused) return -100;
                        d = d._timeline
                    }
                    return f /= e, f > b ? f - b : c && f === b || !a._initted && 2 * m > f - b ? m : (f += a.totalDuration() / a._timeScale / e) > b + m ? 0 : f - b - m
                };
            h._init = function() {
                var a, b, c, d, e, f, g = this.vars,
                    h = this._overwrittenProps,
                    i = this._duration,
                    j = !!g.immediateRender,
                    k = g.ease;
                if (g.startAt) {
                    this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), e = {};
                    for (d in g.startAt) e[d] = g.startAt[d];
                    if (e.overwrite = !1, e.immediateRender = !0, e.lazy = j && g.lazy !== !1, e.startAt = e.delay = null, this._startAt = G.to(this.target, 0, e), j)
                        if (this._time > 0) this._startAt = null;
                        else if (0 !== i) return
                } else if (g.runBackwards && 0 !== i)
                    if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                    else {
                        0 !== this._time && (j = !1), c = {};
                        for (d in g) T[d] && "autoCSS" !== d || (c[d] = g[d]);
                        if (c.overwrite = 0, c.data = "isFromStart", c.lazy = j && g.lazy !== !1, c.immediateRender = j, this._startAt = G.to(this.target, 0, c), j) {
                            if (0 === this._time) return
                        } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                    }
                if (this._ease = k = k ? k instanceof v ? k : "function" == typeof k ? new v(k, g.easeParams) : w[k] || G.defaultEase : G.defaultEase, g.easeParams instanceof Array && k.config && (this._ease = k.config.apply(k, g.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                    for (f = this._targets.length, a = 0; f > a; a++) this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], h ? h[a] : null, a) && (b = !0);
                else b = this._initProps(this.target, this._propLookup, this._siblings, h, 0);
                if (b && G._onPluginEvent("_onInitAllProps", this), h && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), g.runBackwards)
                    for (c = this._firstPT; c;) c.s += c.c, c.c = -c.c, c = c._next;
                this._onUpdate = g.onUpdate, this._initted = !0
            }, h._initProps = function(b, c, d, e, f) {
                var g, h, i, j, k, l;
                if (null == b) return !1;
                K[b._gsTweenID] && Y(), this.vars.css || b.style && b !== a && b.nodeType && Q.css && this.vars.autoCSS !== !1 && I(this.vars, b);
                for (g in this.vars)
                    if (l = this.vars[g], T[g]) l && (l instanceof Array || l.push && p(l)) && -1 !== l.join("").indexOf("{self}") && (this.vars[g] = l = this._swapSelfInParams(l, this));
                    else if (Q[g] && (j = new Q[g])._onInitTween(b, this.vars[g], this, f)) {
                    for (this._firstPT = k = {
                            _next: this._firstPT,
                            t: j,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: 1,
                            n: g,
                            pg: 1,
                            pr: j._priority,
                            m: 0
                        }, h = j._overwriteProps.length; --h > -1;) c[j._overwriteProps[h]] = this._firstPT;
                    (j._priority || j._onInitAllProps) && (i = !0), (j._onDisable || j._onEnable) && (this._notifyPluginsOfEnabled = !0), k._next && (k._next._prev = k)
                } else c[g] = O.call(this, b, g, "get", l, g, 0, null, this.vars.stringFilter, f);
                return e && this._kill(e, b) ? this._initProps(b, c, d, e, f) : this._overwrite > 1 && this._firstPT && d.length > 1 && _(b, this, c, this._overwrite, d) ? (this._kill(c, b), this._initProps(b, c, d, e, f)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (K[b._gsTweenID] = !0), i)
            }, h.render = function(a, b, c) {
                var d, e, f, g, h = this._time,
                    i = this._duration,
                    j = this._rawPrevTime;
                if (a >= i - 1e-7 && a >= 0) this._totalTime = this._time = i, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (d = !0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === i && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > j || 0 >= a && a >= -1e-7 || j === m && "isPause" !== this.data) && j !== a && (c = !0, j > m && (e = "onReverseComplete")), this._rawPrevTime = g = !b || a || j === a ? a : m);
                else if (1e-7 > a) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== h || 0 === i && j > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active = !1, 0 === i && (this._initted || !this.vars.lazy || c) && (j >= 0 && (j !== m || "isPause" !== this.data) && (c = !0), this._rawPrevTime = g = !b || a || j === a ? a : m)), this._initted || (c = !0);
                else if (this._totalTime = this._time = a, this._easeType) {
                    var k = a / i,
                        l = this._easeType,
                        n = this._easePower;
                    (1 === l || 3 === l && k >= .5) && (k = 1 - k), 3 === l && (k *= 2), 1 === n ? k *= k : 2 === n ? k *= k * k : 3 === n ? k *= k * k * k : 4 === n && (k *= k * k * k * k), 1 === l ? this.ratio = 1 - k : 2 === l ? this.ratio = k : .5 > a / i ? this.ratio = k / 2 : this.ratio = 1 - k / 2
                } else this.ratio = this._ease.getRatio(a / i);
                if (this._time !== h || c) {
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = h, this._rawPrevTime = j, J.push(this), void(this._lazy = [a, b]);
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / i) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== h && a >= 0 && (this._active = !0), 0 === h && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === i) && (b || this._callback("onStart"))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
                    this._onUpdate && (0 > a && this._startAt && a !== -1e-4 && this._startAt.render(a, b, c), b || (this._time !== h || d || c) && this._callback("onUpdate")), e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && a !== -1e-4 && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this._callback(e), 0 === i && this._rawPrevTime === m && g !== m && (this._rawPrevTime = 0))
                }
            }, h._kill = function(a, b, c) {
                if ("all" === a && (a = null), null == a && (null == b || b === this.target)) return this._lazy = !1, this._enabled(!1, !1);
                b = "string" != typeof b ? b || this._targets || this.target : G.selector(b) || b;
                var d, e, f, g, h, i, j, k, l, m = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline;
                if ((p(b) || H(b)) && "number" != typeof b[0])
                    for (d = b.length; --d > -1;) this._kill(a, b[d], c) && (i = !0);
                else {
                    if (this._targets) {
                        for (d = this._targets.length; --d > -1;)
                            if (b === this._targets[d]) {
                                h = this._propLookup[d] || {}, this._overwrittenProps = this._overwrittenProps || [], e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                                break
                            }
                    } else {
                        if (b !== this.target) return !1;
                        h = this._propLookup, e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                    }
                    if (h) {
                        if (j = a || h, k = a !== e && "all" !== e && a !== h && ("object" != typeof a || !a._tempKill), c && (G.onOverwrite || this.vars.onOverwrite)) {
                            for (f in j) h[f] && (l || (l = []), l.push(f));
                            if ((l || !a) && !$(this, c, b, l)) return !1
                        }
                        for (f in j)(g = h[f]) && (m && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s, i = !0), g.pg && g.t._kill(j) && (i = !0), g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next), g._next && (g._next._prev = g._prev), g._next = g._prev = null), delete h[f]), k && (e[f] = 1);
                        !this._firstPT && this._initted && this._enabled(!1, !1)
                    }
                }
                return i
            }, h.invalidate = function() {
                return this._notifyPluginsOfEnabled && G._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], D.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -m, this.render(Math.min(0, -this._delay))), this
            }, h._enabled = function(a, b) {
                if (j || i.wake(), a && this._gc) {
                    var c, d = this._targets;
                    if (d)
                        for (c = d.length; --c > -1;) this._siblings[c] = Z(d[c], this, !0);
                    else this._siblings = Z(this.target, this, !0)
                }
                return D.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? G._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
            }, G.to = function(a, b, c) {
                return new G(a, b, c)
            }, G.from = function(a, b, c) {
                return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new G(a, b, c)
            }, G.fromTo = function(a, b, c, d) {
                return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new G(a, b, d)
            }, G.delayedCall = function(a, b, c, d, e) {
                return new G(b, 0, {
                    delay: a,
                    onComplete: b,
                    onCompleteParams: c,
                    callbackScope: d,
                    onReverseComplete: b,
                    onReverseCompleteParams: c,
                    immediateRender: !1,
                    lazy: !1,
                    useFrames: e,
                    overwrite: 0
                })
            }, G.set = function(a, b) {
                return new G(a, 0, b)
            }, G.getTweensOf = function(a, b) {
                if (null == a) return [];
                a = "string" != typeof a ? a : G.selector(a) || a;
                var c, d, e, f;
                if ((p(a) || H(a)) && "number" != typeof a[0]) {
                    for (c = a.length, d = []; --c > -1;) d = d.concat(G.getTweensOf(a[c], b));
                    for (c = d.length; --c > -1;)
                        for (f = d[c], e = c; --e > -1;) f === d[e] && d.splice(c, 1)
                } else
                    for (d = Z(a).concat(), c = d.length; --c > -1;)(d[c]._gc || b && !d[c].isActive()) && d.splice(c, 1);
                return d
            }, G.killTweensOf = G.killDelayedCallsTo = function(a, b, c) {
                "object" == typeof b && (c = b, b = !1);
                for (var d = G.getTweensOf(a, b), e = d.length; --e > -1;) d[e]._kill(c, a)
            };
            var ba = t("plugins.TweenPlugin", function(a, b) {
                this._overwriteProps = (a || "").split(","), this._propName = this._overwriteProps[0], this._priority = b || 0, this._super = ba.prototype
            }, !0);
            if (h = ba.prototype, ba.version = "1.19.0", ba.API = 2, h._firstPT = null, h._addTween = O, h.setRatio = M, h._kill = function(a) {
                    var b, c = this._overwriteProps,
                        d = this._firstPT;
                    if (null != a[this._propName]) this._overwriteProps = [];
                    else
                        for (b = c.length; --b > -1;) null != a[c[b]] && c.splice(b, 1);
                    for (; d;) null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)), d = d._next;
                    return !1
                }, h._mod = h._roundProps = function(a) {
                    for (var b, c = this._firstPT; c;) b = a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")], b && "function" == typeof b && (2 === c.f ? c.t._applyPT.m = b : c.m = b), c = c._next
                }, G._onPluginEvent = function(a, b) {
                    var c, d, e, f, g, h = b._firstPT;
                    if ("_onInitAllProps" === a) {
                        for (; h;) {
                            for (g = h._next, d = e; d && d.pr > h.pr;) d = d._next;
                            (h._prev = d ? d._prev : f) ? h._prev._next = h: e = h, (h._next = d) ? d._prev = h : f = h, h = g
                        }
                        h = b._firstPT = e
                    }
                    for (; h;) h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0), h = h._next;
                    return c
                }, ba.activate = function(a) {
                    for (var b = a.length; --b > -1;) a[b].API === ba.API && (Q[(new a[b])._propName] = a[b]);
                    return !0
                }, s.plugin = function(a) {
                    if (!(a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
                    var b, c = a.propName,
                        d = a.priority || 0,
                        e = a.overwriteProps,
                        f = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_mod",
                            mod: "_mod",
                            initAll: "_onInitAllProps"
                        },
                        g = t("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                            ba.call(this, c, d), this._overwriteProps = e || []
                        }, a.global === !0),
                        h = g.prototype = new ba(c);
                    h.constructor = g, g.API = a.API;
                    for (b in f) "function" == typeof a[b] && (h[f[b]] = a[b]);
                    return g.version = a.version, ba.activate([g]), g
                }, f = a._gsQueue) {
                for (g = 0; g < f.length; g++) f[g]();
                for (h in q) q[h].func || a.console.log("GSAP encountered missing dependency: " + h)
            }
            j = !1
        }
    }("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");
/* TIME LINE LITE */
/*!
 * VERSION: 1.17.0
 * DATE: 2015-05-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
            var s = function(t) {
                    e.call(this, t), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
                    var i, s, r = this.vars;
                    for (s in r) i = r[s], h(i) && -1 !== i.join("").indexOf("{self}") && (r[s] = this._swapSelfInParams(i));
                    h(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
                },
                r = 1e-10,
                n = i._internals,
                a = s._internals = {},
                o = n.isSelector,
                h = n.isArray,
                l = n.lazyTweens,
                _ = n.lazyRender,
                u = [],
                f = _gsScope._gsDefine.globals,
                c = function(t) {
                    var e, i = {};
                    for (e in t) i[e] = t[e];
                    return i
                },
                p = a.pauseCallback = function(t, e, i, s) {
                    var n, a = t._timeline,
                        o = a._totalTime,
                        h = t._startTime,
                        l = 0 > t._rawPrevTime || 0 === t._rawPrevTime && a._reversed,
                        _ = l ? 0 : r,
                        f = l ? r : 0;
                    if (e || !this._forcingPlayhead) {
                        for (a.pause(h), n = t._prev; n && n._startTime === h;) n._rawPrevTime = f, n = n._prev;
                        for (n = t._next; n && n._startTime === h;) n._rawPrevTime = _, n = n._next;
                        e && e.apply(s || a.vars.callbackScope || a, i || u), (this._forcingPlayhead || !a._paused) && a.seek(o)
                    }
                },
                m = function(t) {
                    var e, i = [],
                        s = t.length;
                    for (e = 0; e !== s; i.push(t[e++]));
                    return i
                },
                d = s.prototype = new e;
            return s.version = "1.17.0", d.constructor = s, d.kill()._gc = d._forcingPlayhead = !1, d.to = function(t, e, s, r) {
                var n = s.repeat && f.TweenMax || i;
                return e ? this.add(new n(t, e, s), r) : this.set(t, s, r)
            }, d.from = function(t, e, s, r) {
                return this.add((s.repeat && f.TweenMax || i).from(t, e, s), r)
            }, d.fromTo = function(t, e, s, r, n) {
                var a = r.repeat && f.TweenMax || i;
                return e ? this.add(a.fromTo(t, e, s, r), n) : this.set(t, r, n)
            }, d.staggerTo = function(t, e, r, n, a, h, l, _) {
                var u, f = new s({
                    onComplete: h,
                    onCompleteParams: l,
                    callbackScope: _,
                    smoothChildTiming: this.smoothChildTiming
                });
                for ("string" == typeof t && (t = i.selector(t) || t), t = t || [], o(t) && (t = m(t)), n = n || 0, 0 > n && (t = m(t), t.reverse(), n *= -1), u = 0; t.length > u; u++) r.startAt && (r.startAt = c(r.startAt)), f.to(t[u], e, c(r), u * n);
                return this.add(f, a)
            }, d.staggerFrom = function(t, e, i, s, r, n, a, o) {
                return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o)
            }, d.staggerFromTo = function(t, e, i, s, r, n, a, o, h) {
                return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, this.staggerTo(t, e, s, r, n, a, o, h)
            }, d.call = function(t, e, s, r) {
                return this.add(i.delayedCall(0, t, e, s), r)
            }, d.set = function(t, e, s) {
                return s = this._parseTimeOrLabel(s, 0, !0), null == e.immediateRender && (e.immediateRender = s === this._time && !this._paused), this.add(new i(t, 0, e), s)
            }, s.exportRoot = function(t, e) {
                t = t || {}, null == t.smoothChildTiming && (t.smoothChildTiming = !0);
                var r, n, a = new s(t),
                    o = a._timeline;
                for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;) n = r._next, e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay), r = n;
                return o.add(a, 0), a
            }, d.add = function(r, n, a, o) {
                var l, _, u, f, c, p;
                if ("number" != typeof n && (n = this._parseTimeOrLabel(n, 0, !0, r)), !(r instanceof t)) {
                    if (r instanceof Array || r && r.push && h(r)) {
                        for (a = a || "normal", o = o || 0, l = n, _ = r.length, u = 0; _ > u; u++) h(f = r[u]) && (f = new s({
                            tweens: f
                        })), this.add(f, l), "string" != typeof f && "function" != typeof f && ("sequence" === a ? l = f._startTime + f.totalDuration() / f._timeScale : "start" === a && (f._startTime -= f.delay())), l += o;
                        return this._uncache(!0)
                    }
                    if ("string" == typeof r) return this.addLabel(r, n);
                    if ("function" != typeof r) throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
                    r = i.delayedCall(0, r)
                }
                if (e.prototype.add.call(this, r, n), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                    for (c = this, p = c.rawTime() > r._startTime; c._timeline;) p && c._timeline.smoothChildTiming ? c.totalTime(c._totalTime, !0) : c._gc && c._enabled(!0, !1), c = c._timeline;
                return this
            }, d.remove = function(e) {
                if (e instanceof t) return this._remove(e, !1);
                if (e instanceof Array || e && e.push && h(e)) {
                    for (var i = e.length; --i > -1;) this.remove(e[i]);
                    return this
                }
                return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e)
            }, d._remove = function(t, i) {
                e.prototype._remove.call(this, t, i);
                var s = this._last;
                return s ? this._time > s._startTime + s._totalDuration / s._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
            }, d.append = function(t, e) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
            }, d.insert = d.insertMultiple = function(t, e, i, s) {
                return this.add(t, e || 0, i, s)
            }, d.appendMultiple = function(t, e, i, s) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s)
            }, d.addLabel = function(t, e) {
                return this._labels[t] = this._parseTimeOrLabel(e), this
            }, d.addPause = function(t, e, s, r) {
                var n = i.delayedCall(0, p, ["{self}", e, s, r], this);
                return n.data = "isPause", this.add(n, t)
            }, d.removeLabel = function(t) {
                return delete this._labels[t], this
            }, d.getLabelTime = function(t) {
                return null != this._labels[t] ? this._labels[t] : -1
            }, d._parseTimeOrLabel = function(e, i, s, r) {
                var n;
                if (r instanceof t && r.timeline === this) this.remove(r);
                else if (r && (r instanceof Array || r.push && h(r)))
                    for (n = r.length; --n > -1;) r[n] instanceof t && r[n].timeline === this && this.remove(r[n]);
                if ("string" == typeof i) return this._parseTimeOrLabel(i, s && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, s);
                if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e]) null == e && (e = this.duration());
                else {
                    if (n = e.indexOf("="), -1 === n) return null == this._labels[e] ? s ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
                    i = parseInt(e.charAt(n - 1) + "1", 10) * Number(e.substr(n + 1)), e = n > 1 ? this._parseTimeOrLabel(e.substr(0, n - 1), 0, s) : this.duration()
                }
                return Number(e) + i
            }, d.seek = function(t, e) {
                return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1)
            }, d.stop = function() {
                return this.paused(!0)
            }, d.gotoAndPlay = function(t, e) {
                return this.play(t, e)
            }, d.gotoAndStop = function(t, e) {
                return this.pause(t, e)
            }, d.render = function(t, e, i) {
                this._gc && this._enabled(!0, !1);
                var s, n, a, o, h, u = this._dirty ? this.totalDuration() : this._totalDuration,
                    f = this._time,
                    c = this._startTime,
                    p = this._timeScale,
                    m = this._paused;
                if (t >= u) this._totalTime = this._time = u, this._reversed || this._hasPausedChild() || (n = !0, o = "onComplete", h = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === t || 0 > this._rawPrevTime || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (h = !0, this._rawPrevTime > r && (o = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, t = u + 1e-4;
                else if (1e-7 > t)
                    if (this._totalTime = this._time = 0, (0 !== f || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (o = "onReverseComplete", n = this._reversed), 0 > t) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (h = n = !0, o = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (h = !0), this._rawPrevTime = t;
                    else {
                        if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, 0 === t && n)
                            for (s = this._first; s && 0 === s._startTime;) s._duration || (n = !1), s = s._next;
                        t = 0, this._initted || (h = !0)
                    }
                else this._totalTime = this._time = this._rawPrevTime = t;
                if (this._time !== f && this._first || i || h) {
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== f && t > 0 && (this._active = !0), 0 === f && this.vars.onStart && 0 !== this._time && (e || this._callback("onStart")), this._time >= f)
                        for (s = this._first; s && (a = s._next, !this._paused || m);)(s._active || s._startTime <= this._time && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
                    else
                        for (s = this._last; s && (a = s._prev, !this._paused || m);)(s._active || f >= s._startTime && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
                    this._onUpdate && (e || (l.length && _(), this._callback("onUpdate"))), o && (this._gc || (c === this._startTime || p !== this._timeScale) && (0 === this._time || u >= this.totalDuration()) && (n && (l.length && _(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[o] && this._callback(o)))
                }
            }, d._hasPausedChild = function() {
                for (var t = this._first; t;) {
                    if (t._paused || t instanceof s && t._hasPausedChild()) return !0;
                    t = t._next
                }
                return !1
            }, d.getChildren = function(t, e, s, r) {
                r = r || -9999999999;
                for (var n = [], a = this._first, o = 0; a;) r > a._startTime || (a instanceof i ? e !== !1 && (n[o++] = a) : (s !== !1 && (n[o++] = a), t !== !1 && (n = n.concat(a.getChildren(!0, e, s)), o = n.length))), a = a._next;
                return n
            }, d.getTweensOf = function(t, e) {
                var s, r, n = this._gc,
                    a = [],
                    o = 0;
                for (n && this._enabled(!0, !0), s = i.getTweensOf(t), r = s.length; --r > -1;)(s[r].timeline === this || e && this._contains(s[r])) && (a[o++] = s[r]);
                return n && this._enabled(!1, !0), a
            }, d.recent = function() {
                return this._recent
            }, d._contains = function(t) {
                for (var e = t.timeline; e;) {
                    if (e === this) return !0;
                    e = e.timeline
                }
                return !1
            }, d.shiftChildren = function(t, e, i) {
                i = i || 0;
                for (var s, r = this._first, n = this._labels; r;) r._startTime >= i && (r._startTime += t), r = r._next;
                if (e)
                    for (s in n) n[s] >= i && (n[s] += t);
                return this._uncache(!0)
            }, d._kill = function(t, e) {
                if (!t && !e) return this._enabled(!1, !1);
                for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; --s > -1;) i[s]._kill(t, e) && (r = !0);
                return r
            }, d.clear = function(t) {
                var e = this.getChildren(!1, !0, !0),
                    i = e.length;
                for (this._time = this._totalTime = 0; --i > -1;) e[i]._enabled(!1, !1);
                return t !== !1 && (this._labels = {}), this._uncache(!0)
            }, d.invalidate = function() {
                for (var e = this._first; e;) e.invalidate(), e = e._next;
                return t.prototype.invalidate.call(this)
            }, d._enabled = function(t, i) {
                if (t === this._gc)
                    for (var s = this._first; s;) s._enabled(t, !0), s = s._next;
                return e.prototype._enabled.call(this, t, i)
            }, d.totalTime = function() {
                this._forcingPlayhead = !0;
                var e = t.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = !1, e
            }, d.duration = function(t) {
                return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
            }, d.totalDuration = function(t) {
                if (!arguments.length) {
                    if (this._dirty) {
                        for (var e, i, s = 0, r = this._last, n = 999999999999; r;) e = r._prev, r._dirty && r.totalDuration(), r._startTime > n && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : n = r._startTime, 0 > r._startTime && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), i = r._startTime + r._totalDuration / r._timeScale, i > s && (s = i), r = e;
                        this._duration = this._totalDuration = s, this._dirty = !1
                    }
                    return this._totalDuration
                }
                return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t), this
            }, d.paused = function(e) {
                if (!e)
                    for (var i = this._first, s = this._time; i;) i._startTime === s && "isPause" === i.data && (i._rawPrevTime = 0), i = i._next;
                return t.prototype.paused.apply(this, arguments)
            }, d.usesFrames = function() {
                for (var e = this._timeline; e._timeline;) e = e._timeline;
                return e === t._rootFramesTimeline
            }, d.rawTime = function() {
                return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
            }, s
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(t) {
        "use strict";
        var e = function() {
            return (_gsScope.GreenSockGlobals || _gsScope)[t]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("TweenLite.html"), module.exports = e())
    }("TimelineLite");


/* EASING PLUGIN*/
/*!
 * VERSION: 1.15.5
 * DATE: 2016-07-08
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(a) {
            var b, c, d, e = _gsScope.GreenSockGlobals || _gsScope,
                f = e.com.greensock,
                g = 2 * Math.PI,
                h = Math.PI / 2,
                i = f._class,
                j = function(b, c) {
                    var d = i("easing." + b, function() {}, !0),
                        e = d.prototype = new a;
                    return e.constructor = d, e.getRatio = c, d
                },
                k = a.register || function() {},
                l = function(a, b, c, d, e) {
                    var f = i("easing." + a, {
                        easeOut: new b,
                        easeIn: new c,
                        easeInOut: new d
                    }, !0);
                    return k(f, a), f
                },
                m = function(a, b, c) {
                    this.t = a, this.v = b, c && (this.next = c, c.prev = this, this.c = c.v - b, this.gap = c.t - a)
                },
                n = function(b, c) {
                    var d = i("easing." + b, function(a) {
                            this._p1 = a || 0 === a ? a : 1.70158, this._p2 = 1.525 * this._p1
                        }, !0),
                        e = d.prototype = new a;
                    return e.constructor = d, e.getRatio = c, e.config = function(a) {
                        return new d(a)
                    }, d
                },
                o = l("Back", n("BackOut", function(a) {
                    return (a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
                }), n("BackIn", function(a) {
                    return a * a * ((this._p1 + 1) * a - this._p1)
                }), n("BackInOut", function(a) {
                    return (a *= 2) < 1 ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
                })),
                p = i("easing.SlowMo", function(a, b, c) {
                    b = b || 0 === b ? b : .7, null == a ? a = .7 : a > 1 && (a = 1), this._p = 1 !== a ? b : 0, this._p1 = (1 - a) / 2, this._p2 = a, this._p3 = this._p1 + this._p2, this._calcEnd = c === !0
                }, !0),
                q = p.prototype = new a;
            return q.constructor = p, q.getRatio = function(a) {
                var b = a + (.5 - a) * this._p;
                return a < this._p1 ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
            }, p.ease = new p(.7, .7), q.config = p.config = function(a, b, c) {
                return new p(a, b, c)
            }, b = i("easing.SteppedEase", function(a) {
                a = a || 1, this._p1 = 1 / a, this._p2 = a + 1
            }, !0), q = b.prototype = new a, q.constructor = b, q.getRatio = function(a) {
                return 0 > a ? a = 0 : a >= 1 && (a = .999999999), (this._p2 * a >> 0) * this._p1
            }, q.config = b.config = function(a) {
                return new b(a)
            }, c = i("easing.RoughEase", function(b) {
                b = b || {};
                for (var c, d, e, f, g, h, i = b.taper || "none", j = [], k = 0, l = 0 | (b.points || 20), n = l, o = b.randomize !== !1, p = b.clamp === !0, q = b.template instanceof a ? b.template : null, r = "number" == typeof b.strength ? .4 * b.strength : .4; --n > -1;) c = o ? Math.random() : 1 / l * n, d = q ? q.getRatio(c) : c, "none" === i ? e = r : "out" === i ? (f = 1 - c, e = f * f * r) : "in" === i ? e = c * c * r : .5 > c ? (f = 2 * c, e = f * f * .5 * r) : (f = 2 * (1 - c), e = f * f * .5 * r), o ? d += Math.random() * e - .5 * e : n % 2 ? d += .5 * e : d -= .5 * e, p && (d > 1 ? d = 1 : 0 > d && (d = 0)), j[k++] = {
                    x: c,
                    y: d
                };
                for (j.sort(function(a, b) {
                        return a.x - b.x
                    }), h = new m(1, 1, null), n = l; --n > -1;) g = j[n], h = new m(g.x, g.y, h);
                this._prev = new m(0, 0, 0 !== h.t ? h : h.next)
            }, !0), q = c.prototype = new a, q.constructor = c, q.getRatio = function(a) {
                var b = this._prev;
                if (a > b.t) {
                    for (; b.next && a >= b.t;) b = b.next;
                    b = b.prev
                } else
                    for (; b.prev && a <= b.t;) b = b.prev;
                return this._prev = b, b.v + (a - b.t) / b.gap * b.c
            }, q.config = function(a) {
                return new c(a)
            }, c.ease = new c, l("Bounce", j("BounceOut", function(a) {
                return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
            }), j("BounceIn", function(a) {
                return (a = 1 - a) < 1 / 2.75 ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
            }), j("BounceInOut", function(a) {
                var b = .5 > a;
                return a = b ? 1 - 2 * a : 2 * a - 1, a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375, b ? .5 * (1 - a) : .5 * a + .5
            })), l("Circ", j("CircOut", function(a) {
                return Math.sqrt(1 - (a -= 1) * a)
            }), j("CircIn", function(a) {
                return -(Math.sqrt(1 - a * a) - 1)
            }), j("CircInOut", function(a) {
                return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
            })), d = function(b, c, d) {
                var e = i("easing." + b, function(a, b) {
                        this._p1 = a >= 1 ? a : 1, this._p2 = (b || d) / (1 > a ? a : 1), this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0), this._p2 = g / this._p2
                    }, !0),
                    f = e.prototype = new a;
                return f.constructor = e, f.getRatio = c, f.config = function(a, b) {
                    return new e(a, b)
                }, e
            }, l("Elastic", d("ElasticOut", function(a) {
                return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1
            }, .3), d("ElasticIn", function(a) {
                return -(this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2))
            }, .3), d("ElasticInOut", function(a) {
                return (a *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2) * .5 + 1
            }, .45)), l("Expo", j("ExpoOut", function(a) {
                return 1 - Math.pow(2, -10 * a)
            }), j("ExpoIn", function(a) {
                return Math.pow(2, 10 * (a - 1)) - .001
            }), j("ExpoInOut", function(a) {
                return (a *= 2) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
            })), l("Sine", j("SineOut", function(a) {
                return Math.sin(a * h)
            }), j("SineIn", function(a) {
                return -Math.cos(a * h) + 1
            }), j("SineInOut", function(a) {
                return -.5 * (Math.cos(Math.PI * a) - 1)
            })), i("easing.EaseLookup", {
                find: function(b) {
                    return a.map[b]
                }
            }, !0), k(e.SlowMo, "SlowMo", "ease,"), k(c, "RoughEase", "ease,"), k(b, "SteppedEase", "ease,"), o
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function() {
        "use strict";
        var a = function() {
            return _gsScope.GreenSockGlobals || _gsScope
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], a) : "undefined" != typeof module && module.exports && (require("../TweenLite.html"), module.exports = a())
    }();


/* CSS PLUGIN */
/*!
 * VERSION: 1.19.1
 * DATE: 2017-01-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(a, b) {
            var c, d, e, f, g = function() {
                    a.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = g.prototype.setRatio
                },
                h = _gsScope._gsDefine.globals,
                i = {},
                j = g.prototype = new a("css");
            j.constructor = g, g.version = "1.19.1", g.API = 2, g.defaultTransformPerspective = 0, g.defaultSkewType = "compensated", g.defaultSmoothOrigin = !0, j = "px", g.suffixMap = {
                top: j,
                right: j,
                bottom: j,
                left: j,
                width: j,
                height: j,
                fontSize: j,
                padding: j,
                margin: j,
                perspective: j,
                lineHeight: ""
            };
            var k, l, m, n, o, p, q, r, s = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
                t = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                u = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                v = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                w = /(?:\d|\-|\+|=|#|\.)*/g,
                x = /opacity *= *([^)]*)/i,
                y = /opacity:([^;]*)/i,
                z = /alpha\(opacity *=.+?\)/i,
                A = /^(rgb|hsl)/,
                B = /([A-Z])/g,
                C = /-([a-z])/gi,
                D = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                E = function(a, b) {
                    return b.toUpperCase()
                },
                F = /(?:Left|Right|Width)/i,
                G = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                H = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                I = /,(?=[^\)]*(?:\(|$))/gi,
                J = /[\s,\(]/i,
                K = Math.PI / 180,
                L = 180 / Math.PI,
                M = {},
                N = {
                    style: {}
                },
                O = _gsScope.document || {
                    createElement: function() {
                        return N
                    }
                },
                P = function(a, b) {
                    return O.createElementNS ? O.createElementNS(b || "http://www.w3.org/1999/xhtml", a) : O.createElement(a)
                },
                Q = P("div"),
                R = P("img"),
                S = g._internals = {
                    _specialProps: i
                },
                T = (_gsScope.navigator || {}).userAgent || "",
                U = function() {
                    var a = T.indexOf("Android"),
                        b = P("a");
                    return m = -1 !== T.indexOf("Safari") && -1 === T.indexOf("Chrome") && (-1 === a || parseFloat(T.substr(a + 8, 2)) > 3), o = m && parseFloat(T.substr(T.indexOf("index.php") + 8, 2)) < 6, n = -1 !== T.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(T) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(T)) && (p = parseFloat(RegExp.$1)), b ? (b.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(b.style.opacity)) : !1
                }(),
                V = function(a) {
                    return x.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                },
                W = function(a) {
                    _gsScope.console && console.log(a)
                },
                X = "",
                Y = "",
                Z = function(a, b) {
                    b = b || Q;
                    var c, d, e = b.style;
                    if (void 0 !== e[a]) return a;
                    for (a = a.charAt(0).toUpperCase() + a.substr(1), c = ["O", "Moz", "ms", "Ms", "Webkit"], d = 5; --d > -1 && void 0 === e[c[d] + a];);
                    return d >= 0 ? (Y = 3 === d ? "ms" : c[d], X = "-" + Y.toLowerCase() + "-", Y + a) : null
                },
                $ = O.defaultView ? O.defaultView.getComputedStyle : function() {},
                _ = g.getStyle = function(a, b, c, d, e) {
                    var f;
                    return U || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || $(a)) ? f = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(B, "-$1").toLowerCase()) : a.currentStyle && (f = a.currentStyle[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : V(a)
                },
                aa = S.convertToPixels = function(a, c, d, e, f) {
                    if ("px" === e || !e) return d;
                    if ("auto" === e || !d) return 0;
                    var h, i, j, k = F.test(c),
                        l = a,
                        m = Q.style,
                        n = 0 > d,
                        o = 1 === d;
                    if (n && (d = -d), o && (d *= 100), "%" === e && -1 !== c.indexOf("border")) h = d / 100 * (k ? a.clientWidth : a.clientHeight);
                    else {
                        if (m.cssText = "border:0 solid red;position:" + _(a, "position") + ";line-height:0;", "%" !== e && l.appendChild && "v" !== e.charAt(0) && "rem" !== e) m[k ? "borderLeftWidth" : "borderTopWidth"] = d + e;
                        else {
                            if (l = a.parentNode || O.body, i = l._gsCache, j = b.ticker.frame, i && k && i.time === j) return i.width * d / 100;
                            m[k ? "width" : "height"] = d + e
                        }
                        l.appendChild(Q), h = parseFloat(Q[k ? "offsetWidth" : "offsetHeight"]), l.removeChild(Q), k && "%" === e && g.cacheWidths !== !1 && (i = l._gsCache = l._gsCache || {}, i.time = j, i.width = h / d * 100), 0 !== h || f || (h = aa(a, c, d, e, !0))
                    }
                    return o && (h /= 100), n ? -h : h
                },
                ba = S.calculateOffset = function(a, b, c) {
                    if ("absolute" !== _(a, "position", c)) return 0;
                    var d = "left" === b ? "Left" : "Top",
                        e = _(a, "margin" + d, c);
                    return a["offset" + d] - (aa(a, b, parseFloat(e), e.replace(w, "")) || 0)
                },
                ca = function(a, b) {
                    var c, d, e, f = {};
                    if (b = b || $(a, null))
                        if (c = b.length)
                            for (; --c > -1;) e = b[c], (-1 === e.indexOf("-transform") || Da === e) && (f[e.replace(C, E)] = b.getPropertyValue(e));
                        else
                            for (c in b)(-1 === c.indexOf("Transform") || Ca === c) && (f[c] = b[c]);
                    else if (b = a.currentStyle || a.style)
                        for (c in b) "string" == typeof c && void 0 === f[c] && (f[c.replace(C, E)] = b[c]);
                    return U || (f.opacity = V(a)), d = Ra(a, b, !1), f.rotation = d.rotation, f.skewX = d.skewX, f.scaleX = d.scaleX, f.scaleY = d.scaleY, f.x = d.x, f.y = d.y, Fa && (f.z = d.z, f.rotationX = d.rotationX, f.rotationY = d.rotationY, f.scaleZ = d.scaleZ), f.filters && delete f.filters, f
                },
                da = function(a, b, c, d, e) {
                    var f, g, h, i = {},
                        j = a.style;
                    for (g in c) "cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (f = c[g]) || e && e[g]) && -1 === g.indexOf("Origin") && ("number" == typeof f || "string" == typeof f) && (i[g] = "auto" !== f || "left" !== g && "top" !== g ? "" !== f && "auto" !== f && "none" !== f || "string" != typeof b[g] || "" === b[g].replace(v, "") ? f : 0 : ba(a, g), void 0 !== j[g] && (h = new sa(j, g, j[g], h)));
                    if (d)
                        for (g in d) "className" !== g && (i[g] = d[g]);
                    return {
                        difs: i,
                        firstMPT: h
                    }
                },
                ea = {
                    width: ["Left", "Right"],
                    height: ["Top", "Bottom"]
                },
                fa = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                ga = function(a, b, c) {
                    if ("svg" === (a.nodeName + "").toLowerCase()) return (c || $(a))[b] || 0;
                    if (a.getCTM && Oa(a)) return a.getBBox()[b] || 0;
                    var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight),
                        e = ea[b],
                        f = e.length;
                    for (c = c || $(a, null); --f > -1;) d -= parseFloat(_(a, "padding" + e[f], c, !0)) || 0, d -= parseFloat(_(a, "border" + e[f] + "Width", c, !0)) || 0;
                    return d
                },
                ha = function(a, b) {
                    if ("contain" === a || "auto" === a || "auto auto" === a) return a + " ";
                    (null == a || "" === a) && (a = "0 0");
                    var c, d = a.split(" "),
                        e = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : d[0],
                        f = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : d[1];
                    if (d.length > 3 && !b) {
                        for (d = a.split(", ").join(",").split(","), a = [], c = 0; c < d.length; c++) a.push(ha(d[c]));
                        return a.join(",")
                    }
                    return null == f ? f = "center" === e ? "50%" : "0" : "center" === f && (f = "50%"), ("center" === e || isNaN(parseFloat(e)) && -1 === (e + "").indexOf("=")) && (e = "50%"), a = e + " " + f + (d.length > 2 ? " " + d[2] : ""), b && (b.oxp = -1 !== e.indexOf("%"), b.oyp = -1 !== f.indexOf("%"), b.oxr = "=" === e.charAt(1), b.oyr = "=" === f.charAt(1), b.ox = parseFloat(e.replace(v, "")), b.oy = parseFloat(f.replace(v, "")), b.v = a), b || a
                },
                ia = function(a, b) {
                    return "function" == typeof a && (a = a(r, q)), "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b) || 0
                },
                ja = function(a, b) {
                    return "function" == typeof a && (a = a(r, q)), null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + b : parseFloat(a) || 0
                },
                ka = function(a, b, c, d) {
                    var e, f, g, h, i, j = 1e-6;
                    return "function" == typeof a && (a = a(r, q)), null == a ? h = b : "number" == typeof a ? h = a : (e = 360, f = a.split("_"), i = "=" === a.charAt(1), g = (i ? parseInt(a.charAt(0) + "1", 10) * parseFloat(f[0].substr(2)) : parseFloat(f[0])) * (-1 === a.indexOf("rad") ? 1 : L) - (i ? 0 : b), f.length && (d && (d[c] = b + g), -1 !== a.indexOf("short") && (g %= e, g !== g % (e / 2) && (g = 0 > g ? g + e : g - e)), -1 !== a.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * e) % e - (g / e | 0) * e : -1 !== a.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * e) % e - (g / e | 0) * e)), h = b + g), j > h && h > -j && (h = 0), h
                },
                la = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0]
                },
                ma = function(a, b, c) {
                    return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a, 255 * (1 > 6 * a ? b + (c - b) * a * 6 : .5 > a ? c : 2 > 3 * a ? b + (c - b) * (2 / 3 - a) * 6 : b) + .5 | 0
                },
                na = g.parseColor = function(a, b) {
                    var c, d, e, f, g, h, i, j, k, l, m;
                    if (a)
                        if ("number" == typeof a) c = [a >> 16, a >> 8 & 255, 255 & a];
                        else {
                            if ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), la[a]) c = la[a];
                            else if ("#" === a.charAt(0)) 4 === a.length && (d = a.charAt(1), e = a.charAt(2), f = a.charAt(3), a = "#" + d + d + e + e + f + f), a = parseInt(a.substr(1), 16), c = [a >> 16, a >> 8 & 255, 255 & a];
                            else if ("hsl" === a.substr(0, 3))
                                if (c = m = a.match(s), b) {
                                    if (-1 !== a.indexOf("=")) return a.match(t)
                                } else g = Number(c[0]) % 360 / 360, h = Number(c[1]) / 100, i = Number(c[2]) / 100, e = .5 >= i ? i * (h + 1) : i + h - i * h, d = 2 * i - e, c.length > 3 && (c[3] = Number(a[3])), c[0] = ma(g + 1 / 3, d, e), c[1] = ma(g, d, e), c[2] = ma(g - 1 / 3, d, e);
                            else c = a.match(s) || la.transparent;
                            c[0] = Number(c[0]), c[1] = Number(c[1]), c[2] = Number(c[2]), c.length > 3 && (c[3] = Number(c[3]))
                        }
                    else c = la.black;
                    return b && !m && (d = c[0] / 255, e = c[1] / 255, f = c[2] / 255, j = Math.max(d, e, f), k = Math.min(d, e, f), i = (j + k) / 2, j === k ? g = h = 0 : (l = j - k, h = i > .5 ? l / (2 - j - k) : l / (j + k), g = j === d ? (e - f) / l + (f > e ? 6 : 0) : j === e ? (f - d) / l + 2 : (d - e) / l + 4, g *= 60), c[0] = g + .5 | 0, c[1] = 100 * h + .5 | 0, c[2] = 100 * i + .5 | 0), c
                },
                oa = function(a, b) {
                    var c, d, e, f = a.match(pa) || [],
                        g = 0,
                        h = f.length ? "" : a;
                    for (c = 0; c < f.length; c++) d = f[c], e = a.substr(g, a.indexOf(d, g) - g), g += e.length + d.length, d = na(d, b), 3 === d.length && d.push(1), h += e + (b ? "hsla(" + d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : "rgba(" + d.join(",")) + ")";
                    return h + a.substr(g)
                },
                pa = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (j in la) pa += "|" + j + "\\b";
            pa = new RegExp(pa + ")", "gi"), g.colorStringFilter = function(a) {
                var b, c = a[0] + a[1];
                pa.test(c) && (b = -1 !== c.indexOf("hsl(") || -1 !== c.indexOf("hsla("), a[0] = oa(a[0], b), a[1] = oa(a[1], b)), pa.lastIndex = 0
            }, b.defaultStringFilter || (b.defaultStringFilter = g.colorStringFilter);
            var qa = function(a, b, c, d) {
                    if (null == a) return function(a) {
                        return a
                    };
                    var e, f = b ? (a.match(pa) || [""])[0] : "",
                        g = a.split(f).join("").match(u) || [],
                        h = a.substr(0, a.indexOf(g[0])),
                        i = ")" === a.charAt(a.length - 1) ? ")" : "",
                        j = -1 !== a.indexOf(" ") ? " " : ",",
                        k = g.length,
                        l = k > 0 ? g[0].replace(s, "") : "";
                    return k ? e = b ? function(a) {
                        var b, m, n, o;
                        if ("number" == typeof a) a += l;
                        else if (d && I.test(a)) {
                            for (o = a.replace(I, "|").split("|"), n = 0; n < o.length; n++) o[n] = e(o[n]);
                            return o.join(",")
                        }
                        if (b = (a.match(pa) || [f])[0], m = a.split(b).join("").match(u) || [], n = m.length, k > n--)
                            for (; ++n < k;) m[n] = c ? m[(n - 1) / 2 | 0] : g[n];
                        return h + m.join(j) + j + b + i + (-1 !== a.indexOf("inset") ? " inset" : "")
                    } : function(a) {
                        var b, f, m;
                        if ("number" == typeof a) a += l;
                        else if (d && I.test(a)) {
                            for (f = a.replace(I, "|").split("|"), m = 0; m < f.length; m++) f[m] = e(f[m]);
                            return f.join(",")
                        }
                        if (b = a.match(u) || [], m = b.length, k > m--)
                            for (; ++m < k;) b[m] = c ? b[(m - 1) / 2 | 0] : g[m];
                        return h + b.join(j) + i
                    } : function(a) {
                        return a
                    }
                },
                ra = function(a) {
                    return a = a.split(","),
                        function(b, c, d, e, f, g, h) {
                            var i, j = (c + "").split(" ");
                            for (h = {}, i = 0; 4 > i; i++) h[a[i]] = j[i] = j[i] || j[(i - 1) / 2 >> 0];
                            return e.parse(b, h, f, g)
                        }
                },
                sa = (S._setPluginRatio = function(a) {
                    this.plugin.setRatio(a);
                    for (var b, c, d, e, f, g = this.data, h = g.proxy, i = g.firstMPT, j = 1e-6; i;) b = h[i.v], i.r ? b = Math.round(b) : j > b && b > -j && (b = 0), i.t[i.p] = b, i = i._next;
                    if (g.autoRotate && (g.autoRotate.rotation = g.mod ? g.mod(h.rotation, this.t) : h.rotation), 1 === a || 0 === a)
                        for (i = g.firstMPT, f = 1 === a ? "e" : "b"; i;) {
                            if (c = i.t, c.type) {
                                if (1 === c.type) {
                                    for (e = c.xs0 + c.s + c.xs1, d = 1; d < c.l; d++) e += c["xn" + d] + c["xs" + (d + 1)];
                                    c[f] = e
                                }
                            } else c[f] = c.s + c.xs0;
                            i = i._next
                        }
                }, function(a, b, c, d, e) {
                    this.t = a, this.p = b, this.v = c, this.r = e, d && (d._prev = this, this._next = d)
                }),
                ta = (S._parseToProxy = function(a, b, c, d, e, f) {
                    var g, h, i, j, k, l = d,
                        m = {},
                        n = {},
                        o = c._transform,
                        p = M;
                    for (c._transform = null, M = b, d = k = c.parse(a, b, d, e), M = p, f && (c._transform = o, l && (l._prev = null, l._prev && (l._prev._next = null))); d && d !== l;) {
                        if (d.type <= 1 && (h = d.p, n[h] = d.s + d.c, m[h] = d.s, f || (j = new sa(d, "s", h, j, d.r), d.c = 0), 1 === d.type))
                            for (g = d.l; --g > 0;) i = "xn" + g, h = d.p + "_" + i, n[h] = d.data[i], m[h] = d[i], f || (j = new sa(d, i, h, j, d.rxp[i]));
                        d = d._next
                    }
                    return {
                        proxy: m,
                        end: n,
                        firstMPT: j,
                        pt: k
                    }
                }, S.CSSPropTween = function(a, b, d, e, g, h, i, j, k, l, m) {
                    this.t = a, this.p = b, this.s = d, this.c = e, this.n = i || b, a instanceof ta || f.push(this.n), this.r = j, this.type = h || 0, k && (this.pr = k, c = !0), this.b = void 0 === l ? d : l, this.e = void 0 === m ? d + e : m, g && (this._next = g, g._prev = this)
                }),
                ua = function(a, b, c, d, e, f) {
                    var g = new ta(a, b, c, d - c, e, -1, f);
                    return g.b = c, g.e = g.xs0 = d, g
                },
                va = g.parseComplex = function(a, b, c, d, e, f, h, i, j, l) {
                    c = c || f || "", "function" == typeof d && (d = d(r, q)), h = new ta(a, b, 0, 0, h, l ? 2 : 1, null, !1, i, c, d), d += "", e && pa.test(d + c) && (d = [c, d], g.colorStringFilter(d), c = d[0], d = d[1]);
                    var m, n, o, p, u, v, w, x, y, z, A, B, C, D = c.split(", ").join(",").split(" "),
                        E = d.split(", ").join(",").split(" "),
                        F = D.length,
                        G = k !== !1;
                    for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (D = D.join(" ").replace(I, ", ").split(" "), E = E.join(" ").replace(I, ", ").split(" "), F = D.length), F !== E.length && (D = (f || "").split(" "), F = D.length), h.plugin = j, h.setRatio = l, pa.lastIndex = 0, m = 0; F > m; m++)
                        if (p = D[m], u = E[m], x = parseFloat(p), x || 0 === x) h.appendXtra("", x, ia(u, x), u.replace(t, ""), G && -1 !== u.indexOf("px"), !0);
                        else if (e && pa.test(p)) B = u.indexOf(")") + 1, B = ")" + (B ? u.substr(B) : ""), C = -1 !== u.indexOf("hsl") && U, p = na(p, C), u = na(u, C), y = p.length + u.length > 6, y && !U && 0 === u[3] ? (h["xs" + h.l] += h.l ? " transparent" : "transparent", h.e = h.e.split(E[m]).join("transparent")) : (U || (y = !1), C ? h.appendXtra(y ? "hsla(" : "hsl(", p[0], ia(u[0], p[0]), ",", !1, !0).appendXtra("", p[1], ia(u[1], p[1]), "%,", !1).appendXtra("", p[2], ia(u[2], p[2]), y ? "%," : "%" + B, !1) : h.appendXtra(y ? "rgba(" : "rgb(", p[0], u[0] - p[0], ",", !0, !0).appendXtra("", p[1], u[1] - p[1], ",", !0).appendXtra("", p[2], u[2] - p[2], y ? "," : B, !0), y && (p = p.length < 4 ? 1 : p[3], h.appendXtra("", p, (u.length < 4 ? 1 : u[3]) - p, B, !1))), pa.lastIndex = 0;
                    else if (v = p.match(s)) {
                        if (w = u.match(t), !w || w.length !== v.length) return h;
                        for (o = 0, n = 0; n < v.length; n++) A = v[n], z = p.indexOf(A, o), h.appendXtra(p.substr(o, z - o), Number(A), ia(w[n], A), "", G && "px" === p.substr(z + A.length, 2), 0 === n), o = z + A.length;
                        h["xs" + h.l] += p.substr(o)
                    } else h["xs" + h.l] += h.l || h["xs" + h.l] ? " " + u : u;
                    if (-1 !== d.indexOf("=") && h.data) {
                        for (B = h.xs0 + h.data.s, m = 1; m < h.l; m++) B += h["xs" + m] + h.data["xn" + m];
                        h.e = B + h["xs" + m]
                    }
                    return h.l || (h.type = -1, h.xs0 = h.e), h.xfirst || h
                },
                wa = 9;
            for (j = ta.prototype, j.l = j.pr = 0; --wa > 0;) j["xn" + wa] = 0, j["xs" + wa] = "";
            j.xs0 = "", j._next = j._prev = j.xfirst = j.data = j.plugin = j.setRatio = j.rxp = null, j.appendXtra = function(a, b, c, d, e, f) {
                var g = this,
                    h = g.l;
                return g["xs" + h] += f && (h || g["xs" + h]) ? " " + a : a || "", c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new ta(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {
                    s: b + c
                }, g.rxp = {}, g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
            };
            var xa = function(a, b) {
                    b = b || {}, this.p = b.prefix ? Z(a) || a : a, i[a] = i[this.p] = this, this.format = b.formatter || qa(b.defaultValue, b.color, b.collapsible, b.multi), b.parser && (this.parse = b.parser), this.clrs = b.color, this.multi = b.multi, this.keyword = b.keyword, this.dflt = b.defaultValue, this.pr = b.priority || 0
                },
                ya = S._registerComplexSpecialProp = function(a, b, c) {
                    "object" != typeof b && (b = {
                        parser: c
                    });
                    var d, e, f = a.split(","),
                        g = b.defaultValue;
                    for (c = c || [g], d = 0; d < f.length; d++) b.prefix = 0 === d && b.prefix, b.defaultValue = c[d] || g, e = new xa(f[d], b)
                },
                za = S._registerPluginProp = function(a) {
                    if (!i[a]) {
                        var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                        ya(a, {
                            parser: function(a, c, d, e, f, g, j) {
                                var k = h.com.greensock.plugins[b];
                                return k ? (k._cssRegister(), i[d].parse(a, c, d, e, f, g, j)) : (W("Error: " + b + " js file not loaded."), f)
                            }
                        })
                    }
                };
            j = xa.prototype, j.parseComplex = function(a, b, c, d, e, f) {
                var g, h, i, j, k, l, m = this.keyword;
                if (this.multi && (I.test(c) || I.test(b) ? (h = b.replace(I, "|").split("|"), i = c.replace(I, "|").split("|")) : m && (h = [b], i = [c])), i) {
                    for (j = i.length > h.length ? i.length : h.length, g = 0; j > g; g++) b = h[g] = h[g] || this.dflt, c = i[g] = i[g] || this.dflt, m && (k = b.indexOf(m), l = c.indexOf(m), k !== l && (-1 === l ? h[g] = h[g].split(m).join("") : -1 === k && (h[g] += " " + m)));
                    b = h.join(", "), c = i.join(", ")
                }
                return va(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
            }, j.parse = function(a, b, c, d, f, g, h) {
                return this.parseComplex(a.style, this.format(_(a, this.p, e, !1, this.dflt)), this.format(b), f, g)
            }, g.registerSpecialProp = function(a, b, c) {
                ya(a, {
                    parser: function(a, d, e, f, g, h, i) {
                        var j = new ta(a, e, 0, 0, g, 2, e, !1, c);
                        return j.plugin = h, j.setRatio = b(a, d, f._tween, e), j
                    },
                    priority: c
                })
            }, g.useSVGTransformAttr = !0;
            var Aa, Ba = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                Ca = Z("transform"),
                Da = X + "transform",
                Ea = Z("transformOrigin"),
                Fa = null !== Z("perspective"),
                Ga = S.Transform = function() {
                    this.perspective = parseFloat(g.defaultTransformPerspective) || 0, this.force3D = g.defaultForce3D !== !1 && Fa ? g.defaultForce3D || "auto" : !1
                },
                Ha = _gsScope.SVGElement,
                Ia = function(a, b, c) {
                    var d, e = O.createElementNS("http://www.w3.org/2000/svg", a),
                        f = /([a-z])([A-Z])/g;
                    for (d in c) e.setAttributeNS(null, d.replace(f, "$1-$2").toLowerCase(), c[d]);
                    return b.appendChild(e), e
                },
                Ja = O.documentElement || {},
                Ka = function() {
                    var a, b, c, d = p || /Android/i.test(T) && !_gsScope.chrome;
                    return O.createElementNS && !d && (a = Ia("svg", Ja), b = Ia("rect", a, {
                        width: 100,
                        height: 50,
                        x: 100
                    }), c = b.getBoundingClientRect().width, b.style[Ea] = "50% 50%", b.style[Ca] = "scaleX(0.5)", d = c === b.getBoundingClientRect().width && !(n && Fa), Ja.removeChild(a)), d
                }(),
                La = function(a, b, c, d, e, f) {
                    var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = a._gsTransform,
                        w = Qa(a, !0);
                    v && (t = v.xOrigin, u = v.yOrigin), (!d || (h = d.split(" ")).length < 2) && (n = a.getBBox(), 0 === n.x && 0 === n.y && n.width + n.height === 0 && (n = {
                        x: parseFloat(a.hasAttribute("x") ? a.getAttribute("x") : a.hasAttribute("cx") ? a.getAttribute("cx") : 0) || 0,
                        y: parseFloat(a.hasAttribute("y") ? a.getAttribute("y") : a.hasAttribute("cy") ? a.getAttribute("cy") : 0) || 0,
                        width: 0,
                        height: 0
                    }), b = ha(b).split(" "), h = [(-1 !== b[0].indexOf("%") ? parseFloat(b[0]) / 100 * n.width : parseFloat(b[0])) + n.x, (-1 !== b[1].indexOf("%") ? parseFloat(b[1]) / 100 * n.height : parseFloat(b[1])) + n.y]), c.xOrigin = k = parseFloat(h[0]), c.yOrigin = l = parseFloat(h[1]), d && w !== Pa && (m = w[0], n = w[1], o = w[2], p = w[3], q = w[4], r = w[5], s = m * p - n * o, s && (i = k * (p / s) + l * (-o / s) + (o * r - p * q) / s, j = k * (-n / s) + l * (m / s) - (m * r - n * q) / s, k = c.xOrigin = h[0] = i, l = c.yOrigin = h[1] = j)), v && (f && (c.xOffset = v.xOffset, c.yOffset = v.yOffset, v = c), e || e !== !1 && g.defaultSmoothOrigin !== !1 ? (i = k - t, j = l - u, v.xOffset += i * w[0] + j * w[2] - i, v.yOffset += i * w[1] + j * w[3] - j) : v.xOffset = v.yOffset = 0), f || a.setAttribute("data-svg-origin", h.join(" "))
                },
                Ma = function(a) {
                    var b, c = P("svg", this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                        d = this.parentNode,
                        e = this.nextSibling,
                        f = this.style.cssText;
                    if (Ja.appendChild(c), c.appendChild(this), this.style.display = "block", a) try {
                        b = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = Ma
                    } catch (g) {} else this._originalGetBBox && (b = this._originalGetBBox());
                    return e ? d.insertBefore(this, e) : d.appendChild(this), Ja.removeChild(c), this.style.cssText = f, b
                },
                Na = function(a) {
                    try {
                        return a.getBBox()
                    } catch (b) {
                        return Ma.call(a, !0)
                    }
                },
                Oa = function(a) {
                    return !(!(Ha && a.getCTM && Na(a)) || a.parentNode && !a.ownerSVGElement)
                },
                Pa = [1, 0, 0, 1, 0, 0],
                Qa = function(a, b) {
                    var c, d, e, f, g, h, i = a._gsTransform || new Ga,
                        j = 1e5,
                        k = a.style;
                    if (Ca ? d = _(a, Da, null, !0) : a.currentStyle && (d = a.currentStyle.filter.match(G), d = d && 4 === d.length ? [d[0].substr(4), Number(d[2].substr(4)), Number(d[1].substr(4)), d[3].substr(4), i.x || 0, i.y || 0].join(",") : ""), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, c && Ca && ((h = "none" === $(a).display) || !a.parentNode) && (h && (f = k.display, k.display = "block"), a.parentNode || (g = 1, Ja.appendChild(a)), d = _(a, Da, null, !0), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, f ? k.display = f : h && Va(k, "display"), g && Ja.removeChild(a)), (i.svg || a.getCTM && Oa(a)) && (c && -1 !== (k[Ca] + "").indexOf("matrix") && (d = k[Ca], c = 0), e = a.getAttribute("transform"), c && e && (-1 !== e.indexOf("matrix") ? (d = e, c = 0) : -1 !== e.indexOf("translate") && (d = "matrix(1,0,0,1," + e.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", c = 0))), c) return Pa;
                    for (e = (d || "").match(s) || [], wa = e.length; --wa > -1;) f = Number(e[wa]), e[wa] = (g = f - (f |= 0)) ? (g * j + (0 > g ? -.5 : .5) | 0) / j + f : f;
                    return b && e.length > 6 ? [e[0], e[1], e[4], e[5], e[12], e[13]] : e
                },
                Ra = S.getTransform = function(a, c, d, e) {
                    if (a._gsTransform && d && !e) return a._gsTransform;
                    var f, h, i, j, k, l, m = d ? a._gsTransform || new Ga : new Ga,
                        n = m.scaleX < 0,
                        o = 2e-5,
                        p = 1e5,
                        q = Fa ? parseFloat(_(a, Ea, c, !1, "0 0 0").split(" ")[2]) || m.zOrigin || 0 : 0,
                        r = parseFloat(g.defaultTransformPerspective) || 0;
                    if (m.svg = !(!a.getCTM || !Oa(a)), m.svg && (La(a, _(a, Ea, c, !1, "50% 50%") + "", m, a.getAttribute("data-svg-origin")), Aa = g.useSVGTransformAttr || Ka), f = Qa(a), f !== Pa) {
                        if (16 === f.length) {
                            var s, t, u, v, w, x = f[0],
                                y = f[1],
                                z = f[2],
                                A = f[3],
                                B = f[4],
                                C = f[5],
                                D = f[6],
                                E = f[7],
                                F = f[8],
                                G = f[9],
                                H = f[10],
                                I = f[12],
                                J = f[13],
                                K = f[14],
                                M = f[11],
                                N = Math.atan2(D, H);
                            m.zOrigin && (K = -m.zOrigin, I = F * K - f[12], J = G * K - f[13], K = H * K + m.zOrigin - f[14]), m.rotationX = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), s = B * v + F * w, t = C * v + G * w, u = D * v + H * w, F = B * -w + F * v, G = C * -w + G * v, H = D * -w + H * v, M = E * -w + M * v, B = s, C = t, D = u), N = Math.atan2(-z, H), m.rotationY = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), s = x * v - F * w, t = y * v - G * w, u = z * v - H * w, G = y * w + G * v, H = z * w + H * v, M = A * w + M * v, x = s, y = t, z = u), N = Math.atan2(y, x), m.rotation = N * L, N && (v = Math.cos(-N), w = Math.sin(-N), x = x * v + B * w, t = y * v + C * w, C = y * -w + C * v, D = z * -w + D * v, y = t), m.rotationX && Math.abs(m.rotationX) + Math.abs(m.rotation) > 359.9 && (m.rotationX = m.rotation = 0, m.rotationY = 180 - m.rotationY), m.scaleX = (Math.sqrt(x * x + y * y) * p + .5 | 0) / p, m.scaleY = (Math.sqrt(C * C + G * G) * p + .5 | 0) / p, m.scaleZ = (Math.sqrt(D * D + H * H) * p + .5 | 0) / p, m.rotationX || m.rotationY ? m.skewX = 0 : (m.skewX = B || C ? Math.atan2(B, C) * L + m.rotation : m.skewX || 0, Math.abs(m.skewX) > 90 && Math.abs(m.skewX) < 270 && (n ? (m.scaleX *= -1, m.skewX += m.rotation <= 0 ? 180 : -180, m.rotation += m.rotation <= 0 ? 180 : -180) : (m.scaleY *= -1, m.skewX += m.skewX <= 0 ? 180 : -180))), m.perspective = M ? 1 / (0 > M ? -M : M) : 0, m.x = I, m.y = J, m.z = K, m.svg && (m.x -= m.xOrigin - (m.xOrigin * x - m.yOrigin * B), m.y -= m.yOrigin - (m.yOrigin * y - m.xOrigin * C))
                        } else if (!Fa || e || !f.length || m.x !== f[4] || m.y !== f[5] || !m.rotationX && !m.rotationY) {
                            var O = f.length >= 6,
                                P = O ? f[0] : 1,
                                Q = f[1] || 0,
                                R = f[2] || 0,
                                S = O ? f[3] : 1;
                            m.x = f[4] || 0, m.y = f[5] || 0, i = Math.sqrt(P * P + Q * Q), j = Math.sqrt(S * S + R * R), k = P || Q ? Math.atan2(Q, P) * L : m.rotation || 0, l = R || S ? Math.atan2(R, S) * L + k : m.skewX || 0, Math.abs(l) > 90 && Math.abs(l) < 270 && (n ? (i *= -1, l += 0 >= k ? 180 : -180, k += 0 >= k ? 180 : -180) : (j *= -1, l += 0 >= l ? 180 : -180)), m.scaleX = i, m.scaleY = j, m.rotation = k, m.skewX = l, Fa && (m.rotationX = m.rotationY = m.z = 0, m.perspective = r, m.scaleZ = 1), m.svg && (m.x -= m.xOrigin - (m.xOrigin * P + m.yOrigin * R), m.y -= m.yOrigin - (m.xOrigin * Q + m.yOrigin * S))
                        }
                        m.zOrigin = q;
                        for (h in m) m[h] < o && m[h] > -o && (m[h] = 0)
                    }
                    return d && (a._gsTransform = m, m.svg && (Aa && a.style[Ca] ? b.delayedCall(.001, function() {
                        Va(a.style, Ca)
                    }) : !Aa && a.getAttribute("transform") && b.delayedCall(.001, function() {
                        a.removeAttribute("transform")
                    }))), m
                },
                Sa = function(a) {
                    var b, c, d = this.data,
                        e = -d.rotation * K,
                        f = e + d.skewX * K,
                        g = 1e5,
                        h = (Math.cos(e) * d.scaleX * g | 0) / g,
                        i = (Math.sin(e) * d.scaleX * g | 0) / g,
                        j = (Math.sin(f) * -d.scaleY * g | 0) / g,
                        k = (Math.cos(f) * d.scaleY * g | 0) / g,
                        l = this.t.style,
                        m = this.t.currentStyle;
                    if (m) {
                        c = i, i = -j, j = -c, b = m.filter, l.filter = "";
                        var n, o, q = this.t.offsetWidth,
                            r = this.t.offsetHeight,
                            s = "absolute" !== m.position,
                            t = "progid:DXImageTransform.Microsoft.Matrix(M11=" + h + ", M12=" + i + ", M21=" + j + ", M22=" + k,
                            u = d.x + q * d.xPercent / 100,
                            v = d.y + r * d.yPercent / 100;
                        if (null != d.ox && (n = (d.oxp ? q * d.ox * .01 : d.ox) - q / 2, o = (d.oyp ? r * d.oy * .01 : d.oy) - r / 2, u += n - (n * h + o * i), v += o - (n * j + o * k)), s ? (n = q / 2, o = r / 2, t += ", Dx=" + (n - (n * h + o * i) + u) + ", Dy=" + (o - (n * j + o * k) + v) + ")") : t += ", sizingMethod='auto expand')", -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.filter = b.replace(H, t) : l.filter = t + " " + b, (0 === a || 1 === a) && 1 === h && 0 === i && 0 === j && 1 === k && (s && -1 === t.indexOf("Dx=0, Dy=0") || x.test(b) && 100 !== parseFloat(RegExp.$1) || -1 === b.indexOf(b.indexOf("Alpha")) && l.removeAttribute("filter")), !s) {
                            var y, z, A, B = 8 > p ? 1 : -1;
                            for (n = d.ieOffsetX || 0, o = d.ieOffsetY || 0, d.ieOffsetX = Math.round((q - ((0 > h ? -h : h) * q + (0 > i ? -i : i) * r)) / 2 + u), d.ieOffsetY = Math.round((r - ((0 > k ? -k : k) * r + (0 > j ? -j : j) * q)) / 2 + v), wa = 0; 4 > wa; wa++) z = fa[wa], y = m[z], c = -1 !== y.indexOf("px") ? parseFloat(y) : aa(this.t, z, parseFloat(y), y.replace(w, "")) || 0, A = c !== d[z] ? 2 > wa ? -d.ieOffsetX : -d.ieOffsetY : 2 > wa ? n - d.ieOffsetX : o - d.ieOffsetY, l[z] = (d[z] = Math.round(c - A * (0 === wa || 2 === wa ? 1 : B))) + "px"
                        }
                    }
                },
                Ta = S.set3DTransformRatio = S.setTransformRatio = function(a) {
                    var b, c, d, e, f, g, h, i, j, k, l, m, o, p, q, r, s, t, u, v, w, x, y, z = this.data,
                        A = this.t.style,
                        B = z.rotation,
                        C = z.rotationX,
                        D = z.rotationY,
                        E = z.scaleX,
                        F = z.scaleY,
                        G = z.scaleZ,
                        H = z.x,
                        I = z.y,
                        J = z.z,
                        L = z.svg,
                        M = z.perspective,
                        N = z.force3D,
                        O = z.skewY,
                        P = z.skewX;
                    if (O && (P += O, B += O), ((1 === a || 0 === a) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !J && !M && !D && !C && 1 === G || Aa && L || !Fa) return void(B || P || L ? (B *= K, x = P * K, y = 1e5, c = Math.cos(B) * E, f = Math.sin(B) * E, d = Math.sin(B - x) * -F, g = Math.cos(B - x) * F, x && "simple" === z.skewType && (b = Math.tan(x - O * K), b = Math.sqrt(1 + b * b), d *= b, g *= b, O && (b = Math.tan(O * K), b = Math.sqrt(1 + b * b), c *= b, f *= b)), L && (H += z.xOrigin - (z.xOrigin * c + z.yOrigin * d) + z.xOffset, I += z.yOrigin - (z.xOrigin * f + z.yOrigin * g) + z.yOffset, Aa && (z.xPercent || z.yPercent) && (q = this.t.getBBox(), H += .01 * z.xPercent * q.width, I += .01 * z.yPercent * q.height), q = 1e-6, q > H && H > -q && (H = 0), q > I && I > -q && (I = 0)), u = (c * y | 0) / y + "," + (f * y | 0) / y + "," + (d * y | 0) / y + "," + (g * y | 0) / y + "," + H + "," + I + ")", L && Aa ? this.t.setAttribute("transform", "matrix(" + u) : A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + u) : A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + E + ",0,0," + F + "," + H + "," + I + ")");
                    if (n && (q = 1e-4, q > E && E > -q && (E = G = 2e-5), q > F && F > -q && (F = G = 2e-5), !M || z.z || z.rotationX || z.rotationY || (M = 0)), B || P) B *= K, r = c = Math.cos(B), s = f = Math.sin(B), P && (B -= P * K, r = Math.cos(B), s = Math.sin(B), "simple" === z.skewType && (b = Math.tan((P - O) * K), b = Math.sqrt(1 + b * b), r *= b, s *= b, z.skewY && (b = Math.tan(O * K), b = Math.sqrt(1 + b * b), c *= b, f *= b))), d = -s, g = r;
                    else {
                        if (!(D || C || 1 !== G || M || L)) return void(A[Ca] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) translate3d(" : "translate3d(") + H + "px," + I + "px," + J + "px)" + (1 !== E || 1 !== F ? " scale(" + E + "," + F + ")" : ""));
                        c = g = 1, d = f = 0
                    }
                    k = 1, e = h = i = j = l = m = 0, o = M ? -1 / M : 0, p = z.zOrigin, q = 1e-6, v = ",", w = "0", B = D * K, B && (r = Math.cos(B), s = Math.sin(B), i = -s, l = o * -s, e = c * s, h = f * s, k = r, o *= r, c *= r, f *= r), B = C * K, B && (r = Math.cos(B), s = Math.sin(B), b = d * r + e * s, t = g * r + h * s, j = k * s, m = o * s, e = d * -s + e * r, h = g * -s + h * r, k *= r, o *= r, d = b, g = t), 1 !== G && (e *= G, h *= G, k *= G, o *= G), 1 !== F && (d *= F, g *= F, j *= F, m *= F), 1 !== E && (c *= E, f *= E, i *= E, l *= E), (p || L) && (p && (H += e * -p, I += h * -p, J += k * -p + p), L && (H += z.xOrigin - (z.xOrigin * c + z.yOrigin * d) + z.xOffset, I += z.yOrigin - (z.xOrigin * f + z.yOrigin * g) + z.yOffset), q > H && H > -q && (H = w), q > I && I > -q && (I = w), q > J && J > -q && (J = 0)), u = z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix3d(" : "matrix3d(", u += (q > c && c > -q ? w : c) + v + (q > f && f > -q ? w : f) + v + (q > i && i > -q ? w : i), u += v + (q > l && l > -q ? w : l) + v + (q > d && d > -q ? w : d) + v + (q > g && g > -q ? w : g), C || D || 1 !== G ? (u += v + (q > j && j > -q ? w : j) + v + (q > m && m > -q ? w : m) + v + (q > e && e > -q ? w : e), u += v + (q > h && h > -q ? w : h) + v + (q > k && k > -q ? w : k) + v + (q > o && o > -q ? w : o) + v) : u += ",0,0,0,0,1,0,", u += H + v + I + v + J + v + (M ? 1 + -J / M : 1) + ")", A[Ca] = u
                };
            j = Ga.prototype, j.x = j.y = j.z = j.skewX = j.skewY = j.rotation = j.rotationX = j.rotationY = j.zOrigin = j.xPercent = j.yPercent = j.xOffset = j.yOffset = 0, j.scaleX = j.scaleY = j.scaleZ = 1, ya("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                parser: function(a, b, c, d, f, h, i) {
                    if (d._lastParsedTransform === i) return f;
                    d._lastParsedTransform = i;
                    var j, k = i.scale && "function" == typeof i.scale ? i.scale : 0;
                    "function" == typeof i[c] && (j = i[c], i[c] = b), k && (i.scale = k(r, a));
                    var l, m, n, o, p, s, t, u, v, w = a._gsTransform,
                        x = a.style,
                        y = 1e-6,
                        z = Ba.length,
                        A = i,
                        B = {},
                        C = "transformOrigin",
                        D = Ra(a, e, !0, A.parseTransform),
                        E = A.transform && ("function" == typeof A.transform ? A.transform(r, q) : A.transform);
                    if (d._transform = D, E && "string" == typeof E && Ca) m = Q.style, m[Ca] = E, m.display = "block", m.position = "absolute", O.body.appendChild(Q), l = Ra(Q, null, !1), D.svg && (s = D.xOrigin, t = D.yOrigin, l.x -= D.xOffset, l.y -= D.yOffset, (A.transformOrigin || A.svgOrigin) && (E = {}, La(a, ha(A.transformOrigin), E, A.svgOrigin, A.smoothOrigin, !0), s = E.xOrigin, t = E.yOrigin, l.x -= E.xOffset - D.xOffset, l.y -= E.yOffset - D.yOffset), (s || t) && (u = Qa(Q, !0), l.x -= s - (s * u[0] + t * u[2]), l.y -= t - (s * u[1] + t * u[3]))), O.body.removeChild(Q), l.perspective || (l.perspective = D.perspective), null != A.xPercent && (l.xPercent = ja(A.xPercent, D.xPercent)), null != A.yPercent && (l.yPercent = ja(A.yPercent, D.yPercent));
                    else if ("object" == typeof A) {
                        if (l = {
                                scaleX: ja(null != A.scaleX ? A.scaleX : A.scale, D.scaleX),
                                scaleY: ja(null != A.scaleY ? A.scaleY : A.scale, D.scaleY),
                                scaleZ: ja(A.scaleZ, D.scaleZ),
                                x: ja(A.x, D.x),
                                y: ja(A.y, D.y),
                                z: ja(A.z, D.z),
                                xPercent: ja(A.xPercent, D.xPercent),
                                yPercent: ja(A.yPercent, D.yPercent),
                                perspective: ja(A.transformPerspective, D.perspective)
                            }, p = A.directionalRotation, null != p)
                            if ("object" == typeof p)
                                for (m in p) A[m] = p[m];
                            else A.rotation = p;
                        "string" == typeof A.x && -1 !== A.x.indexOf("%") && (l.x = 0, l.xPercent = ja(A.x, D.xPercent)), "string" == typeof A.y && -1 !== A.y.indexOf("%") && (l.y = 0, l.yPercent = ja(A.y, D.yPercent)), l.rotation = ka("rotation" in A ? A.rotation : "shortRotation" in A ? A.shortRotation + "_short" : "rotationZ" in A ? A.rotationZ : D.rotation, D.rotation, "rotation", B), Fa && (l.rotationX = ka("rotationX" in A ? A.rotationX : "shortRotationX" in A ? A.shortRotationX + "_short" : D.rotationX || 0, D.rotationX, "rotationX", B), l.rotationY = ka("rotationY" in A ? A.rotationY : "shortRotationY" in A ? A.shortRotationY + "_short" : D.rotationY || 0, D.rotationY, "rotationY", B)), l.skewX = ka(A.skewX, D.skewX), l.skewY = ka(A.skewY, D.skewY)
                    }
                    for (Fa && null != A.force3D && (D.force3D = A.force3D, o = !0), D.skewType = A.skewType || D.skewType || g.defaultSkewType, n = D.force3D || D.z || D.rotationX || D.rotationY || l.z || l.rotationX || l.rotationY || l.perspective, n || null == A.scale || (l.scaleZ = 1); --z > -1;) v = Ba[z], E = l[v] - D[v], (E > y || -y > E || null != A[v] || null != M[v]) && (o = !0, f = new ta(D, v, D[v], E, f), v in B && (f.e = B[v]), f.xs0 = 0, f.plugin = h, d._overwriteProps.push(f.n));
                    return E = A.transformOrigin, D.svg && (E || A.svgOrigin) && (s = D.xOffset, t = D.yOffset, La(a, ha(E), l, A.svgOrigin, A.smoothOrigin), f = ua(D, "xOrigin", (w ? D : l).xOrigin, l.xOrigin, f, C), f = ua(D, "yOrigin", (w ? D : l).yOrigin, l.yOrigin, f, C), (s !== D.xOffset || t !== D.yOffset) && (f = ua(D, "xOffset", w ? s : D.xOffset, D.xOffset, f, C), f = ua(D, "yOffset", w ? t : D.yOffset, D.yOffset, f, C)), E = "0px 0px"), (E || Fa && n && D.zOrigin) && (Ca ? (o = !0, v = Ea, E = (E || _(a, v, e, !1, "50% 50%")) + "", f = new ta(x, v, 0, 0, f, -1, C), f.b = x[v], f.plugin = h, Fa ? (m = D.zOrigin, E = E.split(" "), D.zOrigin = (E.length > 2 && (0 === m || "0px" !== E[2]) ? parseFloat(E[2]) : m) || 0, f.xs0 = f.e = E[0] + " " + (E[1] || "50%") + " 0px", f = new ta(D, "zOrigin", 0, 0, f, -1, f.n), f.b = m, f.xs0 = f.e = D.zOrigin) : f.xs0 = f.e = E) : ha(E + "", D)), o && (d._transformType = D.svg && Aa || !n && 3 !== this._transformType ? 2 : 3), j && (i[c] = j), k && (i.scale = k), f
                },
                prefix: !0
            }), ya("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: !0,
                color: !0,
                multi: !0,
                keyword: "inset"
            }), ya("borderRadius", {
                defaultValue: "0px",
                parser: function(a, b, c, f, g, h) {
                    b = this.format(b);
                    var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        z = a.style;
                    for (q = parseFloat(a.offsetWidth), r = parseFloat(a.offsetHeight), i = b.split(" "), j = 0; j < y.length; j++) this.p.indexOf("border") && (y[j] = Z(y[j])), m = l = _(a, y[j], e, !1, "0px"), -1 !== m.indexOf(" ") && (l = m.split(" "), m = l[0], l = l[1]), n = k = i[j], o = parseFloat(m), t = m.substr((o + "").length), u = "=" === n.charAt(1), u ? (p = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), p *= parseFloat(n), s = n.substr((p + "").length - (0 > p ? 1 : 0)) || "") : (p = parseFloat(n), s = n.substr((p + "").length)), "" === s && (s = d[c] || t), s !== t && (v = aa(a, "borderLeft", o, t), w = aa(a, "borderTop", o, t), "%" === s ? (m = v / q * 100 + "%", l = w / r * 100 + "%") : "em" === s ? (x = aa(a, "borderLeft", 1, "em"), m = v / x + "em", l = w / x + "em") : (m = v + "px", l = w + "px"), u && (n = parseFloat(m) + p + s, k = parseFloat(l) + p + s)), g = va(z, y[j], m + " " + l, n + " " + k, !1, "0px", g);
                    return g
                },
                prefix: !0,
                formatter: qa("0px 0px 0px 0px", !1, !0)
            }), ya("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                defaultValue: "0px",
                parser: function(a, b, c, d, f, g) {
                    return va(a.style, c, this.format(_(a, c, e, !1, "0px 0px")), this.format(b), !1, "0px", f)
                },
                prefix: !0,
                formatter: qa("0px 0px", !1, !0)
            }), ya("backgroundPosition", {
                defaultValue: "0 0",
                parser: function(a, b, c, d, f, g) {
                    var h, i, j, k, l, m, n = "background-position",
                        o = e || $(a, null),
                        q = this.format((o ? p ? o.getPropertyValue(n + "-x") + " " + o.getPropertyValue(n + "-y") : o.getPropertyValue(n) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"),
                        r = this.format(b);
                    if (-1 !== q.indexOf("%") != (-1 !== r.indexOf("%")) && r.split(",").length < 2 && (m = _(a, "backgroundImage").replace(D, ""), m && "none" !== m)) {
                        for (h = q.split(" "), i = r.split(" "), R.setAttribute("src", m), j = 2; --j > -1;) q = h[j], k = -1 !== q.indexOf("%"), k !== (-1 !== i[j].indexOf("%")) && (l = 0 === j ? a.offsetWidth - R.width : a.offsetHeight - R.height, h[j] = k ? parseFloat(q) / 100 * l + "px" : parseFloat(q) / l * 100 + "%");
                        q = h.join(" ")
                    }
                    return this.parseComplex(a.style, q, r, f, g)
                },
                formatter: ha
            }), ya("backgroundSize", {
                defaultValue: "0 0",
                formatter: function(a) {
                    return a += "", ha(-1 === a.indexOf(" ") ? a + " " + a : a)
                }
            }), ya("perspective", {
                defaultValue: "0px",
                prefix: !0
            }), ya("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: !0
            }), ya("transformStyle", {
                prefix: !0
            }), ya("backfaceVisibility", {
                prefix: !0
            }), ya("userSelect", {
                prefix: !0
            }), ya("margin", {
                parser: ra("marginTop,marginRight,marginBottom,marginLeft")
            }), ya("padding", {
                parser: ra("paddingTop,paddingRight,paddingBottom,paddingLeft")
            }), ya("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function(a, b, c, d, f, g) {
                    var h, i, j;
                    return 9 > p ? (i = a.currentStyle, j = 8 > p ? " " : ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")",
                        b = this.format(b).split(",").join(j)) : (h = this.format(_(a, this.p, e, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, h, b, f, g)
                }
            }), ya("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: !0,
                multi: !0
            }), ya("autoRound,strictUnits", {
                parser: function(a, b, c, d, e) {
                    return e
                }
            }), ya("border", {
                defaultValue: "0px solid #000",
                parser: function(a, b, c, d, f, g) {
                    var h = _(a, "borderTopWidth", e, !1, "0px"),
                        i = this.format(b).split(" "),
                        j = i[0].replace(w, "");
                    return "px" !== j && (h = parseFloat(h) / aa(a, "borderTopWidth", 1, j) + j), this.parseComplex(a.style, this.format(h + " " + _(a, "borderTopStyle", e, !1, "solid") + " " + _(a, "borderTopColor", e, !1, "#000")), i.join(" "), f, g)
                },
                color: !0,
                formatter: function(a) {
                    var b = a.split(" ");
                    return b[0] + " " + (b[1] || "solid") + " " + (a.match(pa) || ["#000"])[0]
                }
            }), ya("borderWidth", {
                parser: ra("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            }), ya("float,cssFloat,styleFloat", {
                parser: function(a, b, c, d, e, f) {
                    var g = a.style,
                        h = "cssFloat" in g ? "cssFloat" : "styleFloat";
                    return new ta(g, h, 0, 0, e, -1, c, !1, 0, g[h], b)
                }
            });
            var Ua = function(a) {
                var b, c = this.t,
                    d = c.filter || _(this.data, "filter") || "",
                    e = this.s + this.c * a | 0;
                100 === e && (-1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") && -1 === d.indexOf("oader(") ? (c.removeAttribute("filter"), b = !_(this.data, "filter")) : (c.filter = d.replace(z, ""), b = !0)), b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + e + ")"), -1 === d.indexOf("pacity") ? 0 === e && this.xn1 || (c.filter = d + " alpha(opacity=" + e + ")") : c.filter = d.replace(x, "opacity=" + e))
            };
            ya("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function(a, b, c, d, f, g) {
                    var h = parseFloat(_(a, "opacity", e, !1, "1")),
                        i = a.style,
                        j = "autoAlpha" === c;
                    return "string" == typeof b && "=" === b.charAt(1) && (b = ("-" === b.charAt(0) ? -1 : 1) * parseFloat(b.substr(2)) + h), j && 1 === h && "hidden" === _(a, "visibility", e) && 0 !== b && (h = 0), U ? f = new ta(i, "opacity", h, b - h, f) : (f = new ta(i, "opacity", 100 * h, 100 * (b - h), f), f.xn1 = j ? 1 : 0, i.zoom = 1, f.type = 2, f.b = "alpha(opacity=" + f.s + ")", f.e = "alpha(opacity=" + (f.s + f.c) + ")", f.data = a, f.plugin = g, f.setRatio = Ua), j && (f = new ta(i, "visibility", 0, 0, f, -1, null, !1, 0, 0 !== h ? "inherit" : "hidden", 0 === b ? "hidden" : "inherit"), f.xs0 = "inherit", d._overwriteProps.push(f.n), d._overwriteProps.push(c)), f
                }
            });
            var Va = function(a, b) {
                    b && (a.removeProperty ? (("ms" === b.substr(0, 2) || "webkit" === b.substr(0, 6)) && (b = "-" + b), a.removeProperty(b.replace(B, "-$1").toLowerCase())) : a.removeAttribute(b))
                },
                Wa = function(a) {
                    if (this.t._gsClassPT = this, 1 === a || 0 === a) {
                        this.t.setAttribute("class", 0 === a ? this.b : this.e);
                        for (var b = this.data, c = this.t.style; b;) b.v ? c[b.p] = b.v : Va(c, b.p), b = b._next;
                        1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                    } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
                };
            ya("className", {
                parser: function(a, b, d, f, g, h, i) {
                    var j, k, l, m, n, o = a.getAttribute("class") || "",
                        p = a.style.cssText;
                    if (g = f._classNamePT = new ta(a, d, 0, 0, g, 2), g.setRatio = Wa, g.pr = -11, c = !0, g.b = o, k = ca(a, e), l = a._gsClassPT) {
                        for (m = {}, n = l.data; n;) m[n.p] = 1, n = n._next;
                        l.setRatio(1)
                    }
                    return a._gsClassPT = g, g.e = "=" !== b.charAt(1) ? b : o.replace(new RegExp("(?:\\s|^)" + b.substr(2) + "(?![\\w-])"), "") + ("+" === b.charAt(0) ? " " + b.substr(2) : ""), a.setAttribute("class", g.e), j = da(a, k, ca(a), i, m), a.setAttribute("class", o), g.data = j.firstMPT, a.style.cssText = p, g = g.xfirst = f.parse(a, j.difs, g, h)
                }
            });
            var Xa = function(a) {
                if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var b, c, d, e, f, g = this.t.style,
                        h = i.transform.parse;
                    if ("all" === this.e) g.cssText = "", e = !0;
                    else
                        for (b = this.e.split(" ").join("").split(","), d = b.length; --d > -1;) c = b[d], i[c] && (i[c].parse === h ? e = !0 : c = "transformOrigin" === c ? Ea : i[c].p), Va(g, c);
                    e && (Va(g, Ca), f = this.t._gsTransform, f && (f.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
                }
            };
            for (ya("clearProps", {
                    parser: function(a, b, d, e, f) {
                        return f = new ta(a, d, 0, 0, f, 2), f.setRatio = Xa, f.e = b, f.pr = -10, f.data = e._tween, c = !0, f
                    }
                }), j = "bezier,throwProps,physicsProps,physics2D".split(","), wa = j.length; wa--;) za(j[wa]);
            j = g.prototype, j._firstPT = j._lastParsedTransform = j._transform = null, j._onInitTween = function(a, b, h, j) {
                if (!a.nodeType) return !1;
                this._target = q = a, this._tween = h, this._vars = b, r = j, k = b.autoRound, c = !1, d = b.suffixMap || g.suffixMap, e = $(a, ""), f = this._overwriteProps;
                var n, p, s, t, u, v, w, x, z, A = a.style;
                if (l && "" === A.zIndex && (n = _(a, "zIndex", e), ("auto" === n || "" === n) && this._addLazySet(A, "zIndex", 0)), "string" == typeof b && (t = A.cssText, n = ca(a, e), A.cssText = t + ";" + b, n = da(a, n, ca(a)).difs, !U && y.test(b) && (n.opacity = parseFloat(RegExp.$1)), b = n, A.cssText = t), b.className ? this._firstPT = p = i.className.parse(a, b.className, "className", this, null, null, b) : this._firstPT = p = this.parse(a, b, null), this._transformType) {
                    for (z = 3 === this._transformType, Ca ? m && (l = !0, "" === A.zIndex && (w = _(a, "zIndex", e), ("auto" === w || "" === w) && this._addLazySet(A, "zIndex", 0)), o && this._addLazySet(A, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (z ? "visible" : "hidden"))) : A.zoom = 1, s = p; s && s._next;) s = s._next;
                    x = new ta(a, "transform", 0, 0, null, 2), this._linkCSSP(x, null, s), x.setRatio = Ca ? Ta : Sa, x.data = this._transform || Ra(a, e, !0), x.tween = h, x.pr = -1, f.pop()
                }
                if (c) {
                    for (; p;) {
                        for (v = p._next, s = t; s && s.pr > p.pr;) s = s._next;
                        (p._prev = s ? s._prev : u) ? p._prev._next = p: t = p, (p._next = s) ? s._prev = p : u = p, p = v
                    }
                    this._firstPT = t
                }
                return !0
            }, j.parse = function(a, b, c, f) {
                var g, h, j, l, m, n, o, p, s, t, u = a.style;
                for (g in b) n = b[g], "function" == typeof n && (n = n(r, q)), h = i[g], h ? c = h.parse(a, n, g, this, c, f, b) : (m = _(a, g, e) + "", s = "string" == typeof n, "color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || s && A.test(n) ? (s || (n = na(n), n = (n.length > 3 ? "rgba(" : "rgb(") + n.join(",") + ")"), c = va(u, g, m, n, !0, "transparent", c, 0, f)) : s && J.test(n) ? c = va(u, g, m, n, !0, null, c, 0, f) : (j = parseFloat(m), o = j || 0 === j ? m.substr((j + "").length) : "", ("" === m || "auto" === m) && ("width" === g || "height" === g ? (j = ga(a, g, e), o = "px") : "left" === g || "top" === g ? (j = ba(a, g, e), o = "px") : (j = "opacity" !== g ? 0 : 1, o = "")), t = s && "=" === n.charAt(1), t ? (l = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), l *= parseFloat(n), p = n.replace(w, "")) : (l = parseFloat(n), p = s ? n.replace(w, "") : ""), "" === p && (p = g in d ? d[g] : o), n = l || 0 === l ? (t ? l + j : l) + p : b[g], o !== p && "" !== p && (l || 0 === l) && j && (j = aa(a, g, j, o), "%" === p ? (j /= aa(a, g, 100, "%") / 100, b.strictUnits !== !0 && (m = j + "%")) : "em" === p || "rem" === p || "vw" === p || "vh" === p ? j /= aa(a, g, 1, p) : "px" !== p && (l = aa(a, g, l, p), p = "px"), t && (l || 0 === l) && (n = l + j + p)), t && (l += j), !j && 0 !== j || !l && 0 !== l ? void 0 !== u[g] && (n || n + "" != "NaN" && null != n) ? (c = new ta(u, g, l || j || 0, 0, c, -1, g, !1, 0, m, n), c.xs0 = "none" !== n || "display" !== g && -1 === g.indexOf("Style") ? n : m) : W("invalid " + g + " tween value: " + b[g]) : (c = new ta(u, g, j, l - j, c, 0, g, k !== !1 && ("px" === p || "zIndex" === g), 0, m, n), c.xs0 = p))), f && c && !c.plugin && (c.plugin = f);
                return c
            }, j.setRatio = function(a) {
                var b, c, d, e = this._firstPT,
                    f = 1e-6;
                if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                    if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                        for (; e;) {
                            if (b = e.c * a + e.s, e.r ? b = Math.round(b) : f > b && b > -f && (b = 0), e.type)
                                if (1 === e.type)
                                    if (d = e.l, 2 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                                    else if (3 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                            else if (4 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                            else if (5 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                            else {
                                for (c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                e.t[e.p] = c
                            } else -1 === e.type ? e.t[e.p] = e.xs0 : e.setRatio && e.setRatio(a);
                            else e.t[e.p] = b + e.xs0;
                            e = e._next
                        } else
                            for (; e;) 2 !== e.type ? e.t[e.p] = e.b : e.setRatio(a), e = e._next;
                    else
                        for (; e;) {
                            if (2 !== e.type)
                                if (e.r && -1 !== e.type)
                                    if (b = Math.round(e.s + e.c), e.type) {
                                        if (1 === e.type) {
                                            for (d = e.l, c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                            e.t[e.p] = c
                                        }
                                    } else e.t[e.p] = b + e.xs0;
                            else e.t[e.p] = e.e;
                            else e.setRatio(a);
                            e = e._next
                        }
            }, j._enableTransforms = function(a) {
                this._transform = this._transform || Ra(this._target, e, !0), this._transformType = this._transform.svg && Aa || !a && 3 !== this._transformType ? 2 : 3
            };
            var Ya = function(a) {
                this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
            };
            j._addLazySet = function(a, b, c) {
                var d = this._firstPT = new ta(a, b, 0, 0, this._firstPT, 2);
                d.e = c, d.setRatio = Ya, d.data = this
            }, j._linkCSSP = function(a, b, c, d) {
                return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next, d = !0), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._next = b, a._prev = c), a
            }, j._mod = function(a) {
                for (var b = this._firstPT; b;) "function" == typeof a[b.p] && a[b.p] === Math.round && (b.r = 1), b = b._next
            }, j._kill = function(b) {
                var c, d, e, f = b;
                if (b.autoAlpha || b.alpha) {
                    f = {};
                    for (d in b) f[d] = b[d];
                    f.opacity = 1, f.autoAlpha && (f.visibility = 1)
                }
                for (b.className && (c = this._classNamePT) && (e = c.xfirst, e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) : e === this._firstPT && (this._firstPT = c._next), c._next && this._linkCSSP(c._next, c._next._next, e._prev), this._classNamePT = null), c = this._firstPT; c;) c.plugin && c.plugin !== d && c.plugin._kill && (c.plugin._kill(b), d = c.plugin), c = c._next;
                return a.prototype._kill.call(this, f)
            };
            var Za = function(a, b, c) {
                var d, e, f, g;
                if (a.slice)
                    for (e = a.length; --e > -1;) Za(a[e], b, c);
                else
                    for (d = a.childNodes, e = d.length; --e > -1;) f = d[e], g = f.type, f.style && (b.push(ca(f)), c && c.push(f)), 1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Za(f, b, c)
            };
            return g.cascadeTo = function(a, c, d) {
                var e, f, g, h, i = b.to(a, c, d),
                    j = [i],
                    k = [],
                    l = [],
                    m = [],
                    n = b._internals.reservedProps;
                for (a = i._targets || i.target, Za(a, k, m), i.render(c, !0, !0), Za(a, l), i.render(0, !0, !0), i._enabled(!0), e = m.length; --e > -1;)
                    if (f = da(m[e], k[e], l[e]), f.firstMPT) {
                        f = f.difs;
                        for (g in d) n[g] && (f[g] = d[g]);
                        h = {};
                        for (g in f) h[g] = k[e][g];
                        j.push(b.fromTo(m[e], c, h, f))
                    }
                return j
            }, a.activate([g]), g
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(a) {
        "use strict";
        var b = function() {
            return (_gsScope.GreenSockGlobals || _gsScope)[a]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("../TweenLite.html"), module.exports = b())
    }("CSSPlugin");


/* SPLIT TEXT UTIL */
/*!
 * VERSION: 0.5.6
 * DATE: 2017-01-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
! function(a) {
    "use strict";
    var b = a.GreenSockGlobals || a,
        c = function(a) {
            var c, d = a.split("."),
                e = b;
            for (c = 0; c < d.length; c++) e[d[c]] = e = e[d[c]] || {};
            return e
        },
        d = c("com.greensock.utils"),
        e = function(a) {
            var b = a.nodeType,
                c = "";
            if (1 === b || 9 === b || 11 === b) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
            } else if (3 === b || 4 === b) return a.nodeValue;
            return c
        },
        f = document,
        g = f.defaultView ? f.defaultView.getComputedStyle : function() {},
        h = /([A-Z])/g,
        i = function(a, b, c, d) {
            var e;
            return (c = c || g(a, null)) ? (a = c.getPropertyValue(b.replace(h, "-$1").toLowerCase()), e = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, e = c[b]), d ? e : parseInt(e, 10) || 0
        },
        j = function(a) {
            return a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1
        },
        k = function(a) {
            var b, c, d, e = [],
                f = a.length;
            for (b = 0; f > b; b++)
                if (c = a[b], j(c))
                    for (d = c.length, d = 0; d < c.length; d++) e.push(c[d]);
                else e.push(c);
            return e
        },
        l = /(?:\r|\n|\t\t)/g,
        m = /(?:\s\s+)/g,
        n = 55296,
        o = 56319,
        p = 56320,
        q = 127462,
        r = 127487,
        s = 127995,
        t = 127999,
        u = function(a) {
            return (a.charCodeAt(0) - n << 10) + (a.charCodeAt(1) - p) + 65536
        },
        v = f.all && !f.addEventListener,
        w = " style='position:relative;display:inline-block;" + (v ? "*display:inline;*zoom:1;'" : "'"),
        x = function(a, b) {
            a = a || "";
            var c = -1 !== a.indexOf("++"),
                d = 1;
            return c && (a = a.split("++").join("")),
                function() {
                    return "<" + b + w + (a ? " class='" + a + (c ? d++ : "") + "'>" : ">")
                }
        },
        y = d.SplitText = b.SplitText = function(a, b) {
            if ("string" == typeof a && (a = y.selector(a)), !a) throw "cannot split a null element.";
            this.elements = j(a) ? k(a) : [a], this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = b || {}, this.split(b)
        },
        z = function(a, b, c) {
            var d = a.nodeType;
            if (1 === d || 9 === d || 11 === d)
                for (a = a.firstChild; a; a = a.nextSibling) z(a, b, c);
            else(3 === d || 4 === d) && (a.nodeValue = a.nodeValue.split(b).join(c))
        },
        A = function(a, b) {
            for (var c = b.length; --c > -1;) a.push(b[c])
        },
        B = function(a) {
            var b, c = [],
                d = a.length;
            for (b = 0; b !== d; c.push(a[b++]));
            return c
        },
        C = function(a, b, c) {
            for (var d; a && a !== b;) {
                if (d = a._next || a.nextSibling) return d.textContent.charAt(0) === c;
                a = a.parentNode || a._parent
            }
            return !1
        },
        D = function(a) {
            var b, c, d = B(a.childNodes),
                e = d.length;
            for (b = 0; e > b; b++) c = d[b], c._isSplit ? D(c) : (b && 3 === c.previousSibling.nodeType ? c.previousSibling.nodeValue += 3 === c.nodeType ? c.nodeValue : c.firstChild.nodeValue : 3 !== c.nodeType && a.insertBefore(c.firstChild, c), a.removeChild(c))
        },
        E = function(a, b, c, d, e, h, j) {
            var k, l, m, n, o, p, q, r, s, t, u, v, w = g(a),
                x = i(a, "paddingLeft", w),
                y = -999,
                B = i(a, "borderBottomWidth", w) + i(a, "borderTopWidth", w),
                E = i(a, "borderLeftWidth", w) + i(a, "borderRightWidth", w),
                F = i(a, "paddingTop", w) + i(a, "paddingBottom", w),
                G = i(a, "paddingLeft", w) + i(a, "paddingRight", w),
                H = .2 * i(a, "fontSize"),
                I = i(a, "textAlign", w, !0),
                J = [],
                K = [],
                L = [],
                M = b.wordDelimiter || " ",
                N = b.span ? "span" : "div",
                O = b.type || b.split || "chars,words,lines",
                P = e && -1 !== O.indexOf("lines") ? [] : null,
                Q = -1 !== O.indexOf("words"),
                R = -1 !== O.indexOf("chars"),
                S = "absolute" === b.position || b.absolute === !0,
                T = b.linesClass,
                U = -1 !== (T || "").indexOf("++"),
                V = [];
            for (P && 1 === a.children.length && a.children[0]._isSplit && (a = a.children[0]), U && (T = T.split("++").join("")), l = a.getElementsByTagName("*"), m = l.length, o = [], k = 0; m > k; k++) o[k] = l[k];
            if (P || S)
                for (k = 0; m > k; k++) n = o[k], p = n.parentNode === a, (p || S || R && !Q) && (v = n.offsetTop, P && p && Math.abs(v - y) > H && "BR" !== n.nodeName && (q = [], P.push(q), y = v), S && (n._x = n.offsetLeft, n._y = v, n._w = n.offsetWidth, n._h = n.offsetHeight), P && ((n._isSplit && p || !R && p || Q && p || !Q && n.parentNode.parentNode === a && !n.parentNode._isSplit) && (q.push(n), n._x -= x, C(n, a, M) && (n._wordEnd = !0)), "BR" === n.nodeName && n.nextSibling && "BR" === n.nextSibling.nodeName && P.push([])));
            for (k = 0; m > k; k++) n = o[k], p = n.parentNode === a, "BR" !== n.nodeName ? (S && (s = n.style, Q || p || (n._x += n.parentNode._x, n._y += n.parentNode._y), s.left = n._x + "px", s.top = n._y + "px", s.position = "absolute", s.display = "block", s.width = n._w + 1 + "px", s.height = n._h + "px"), !Q && R ? n._isSplit ? (n._next = n.nextSibling, n.parentNode.appendChild(n)) : n.parentNode._isSplit ? (n._parent = n.parentNode, !n.previousSibling && n.firstChild && (n.firstChild._isFirst = !0), n.nextSibling && " " === n.nextSibling.textContent && !n.nextSibling.nextSibling && V.push(n.nextSibling), n._next = n.nextSibling && n.nextSibling._isFirst ? null : n.nextSibling, n.parentNode.removeChild(n), o.splice(k--, 1), m--) : p || (v = !n.nextSibling && C(n.parentNode, a, M), n.parentNode._parent && n.parentNode._parent.appendChild(n), v && n.parentNode.appendChild(f.createTextNode(" ")), b.span && (n.style.display = "inline"), J.push(n)) : n.parentNode._isSplit && !n._isSplit && "" !== n.innerHTML ? K.push(n) : R && !n._isSplit && (b.span && (n.style.display = "inline"), J.push(n))) : P || S ? (n.parentNode && n.parentNode.removeChild(n), o.splice(k--, 1), m--) : Q || a.appendChild(n);
            for (k = V.length; --k > -1;) V[k].parentNode.removeChild(V[k]);
            if (P) {
                for (S && (t = f.createElement(N), a.appendChild(t), u = t.offsetWidth + "px", v = t.offsetParent === a ? 0 : a.offsetLeft, a.removeChild(t)), s = a.style.cssText, a.style.cssText = "display:none;"; a.firstChild;) a.removeChild(a.firstChild);
                for (r = " " === M && (!S || !Q && !R), k = 0; k < P.length; k++) {
                    for (q = P[k], t = f.createElement(N), t.style.cssText = "display:block;text-align:" + I + ";position:" + (S ? "absolute;" : "relative;"), T && (t.className = T + (U ? k + 1 : "")), L.push(t), m = q.length, l = 0; m > l; l++) "BR" !== q[l].nodeName && (n = q[l], t.appendChild(n), r && n._wordEnd && t.appendChild(f.createTextNode(" ")), S && (0 === l && (t.style.top = n._y + "px", t.style.left = x + v + "px"), n.style.top = "0px", v && (n.style.left = n._x - v + "px")));
                    0 === m ? t.innerHTML = "&nbsp;" : Q || R || (D(t), z(t, String.fromCharCode(160), " ")), S && (t.style.width = u, t.style.height = n._h + "px"), a.appendChild(t)
                }
                a.style.cssText = s
            }
            S && (j > a.clientHeight && (a.style.height = j - F + "px", a.clientHeight < j && (a.style.height = j + B + "px")), h > a.clientWidth && (a.style.width = h - G + "px", a.clientWidth < h && (a.style.width = h + E + "px"))), A(c, J), A(d, K), A(e, L)
        },
        F = function(a, b, c, d) {
            var g, h, i, j, k, p, v, w, x, y = b.span ? "span" : "div",
                A = b.type || b.split || "chars,words,lines",
                B = (-1 !== A.indexOf("words"), -1 !== A.indexOf("chars")),
                C = "absolute" === b.position || b.absolute === !0,
                D = b.wordDelimiter || " ",
                E = " " !== D ? "" : C ? "&#173; " : " ",
                F = b.span ? "</span>" : "</div>",
                G = !0,
                H = f.createElement("div"),
                I = a.parentNode;
            for (I.insertBefore(H, a), H.textContent = a.nodeValue, I.removeChild(a), a = H, g = e(a), v = -1 !== g.indexOf("<"), b.reduceWhiteSpace !== !1 && (g = g.replace(m, " ").replace(l, "")), v && (g = g.split("<").join("{{LT}}")), k = g.length, h = (" " === g.charAt(0) ? E : "") + c(), i = 0; k > i; i++)
                if (p = g.charAt(i), p === D && g.charAt(i - 1) !== D && i) {
                    for (h += G ? F : "", G = !1; g.charAt(i + 1) === D;) h += E, i++;
                    i === k - 1 ? h += E : ")" !== g.charAt(i + 1) && (h += E + c(), G = !0)
                } else "{" === p && "{{LT}}" === g.substr(i, 6) ? (h += B ? d() + "{{LT}}</" + y + ">" : "{{LT}}", i += 5) : p.charCodeAt(0) >= n && p.charCodeAt(0) <= o || g.charCodeAt(i + 1) >= 65024 && g.charCodeAt(i + 1) <= 65039 ? (w = u(g.substr(i, 2)), x = u(g.substr(i + 2, 2)), j = w >= q && r >= w && x >= q && r >= x || x >= s && t >= x ? 4 : 2, h += B && " " !== p ? d() + g.substr(i, j) + "</" + y + ">" : g.substr(i, j), i += j - 1) : h += B && " " !== p ? d() + p + "</" + y + ">" : p;
            a.outerHTML = h + (G ? F : ""), v && z(I, "{{LT}}", "<")
        },
        G = function(a, b, c, d) {
            var e, f, g = B(a.childNodes),
                h = g.length,
                j = "absolute" === b.position || b.absolute === !0;
            if (3 !== a.nodeType || h > 1) {
                for (b.absolute = !1, e = 0; h > e; e++) f = g[e], (3 !== f.nodeType || /\S+/.test(f.nodeValue)) && (j && 3 !== f.nodeType && "inline" === i(f, "display", null, !0) && (f.style.display = "inline-block", f.style.position = "relative"), f._isSplit = !0, G(f, b, c, d));
                return b.absolute = j, void(a._isSplit = !0)
            }
            F(a, b, c, d)
        },
        H = y.prototype;
    H.split = function(a) {
        this.isSplit && this.revert(), this.vars = a = a || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
        for (var b, c, d, e = this.elements.length, f = a.span ? "span" : "div", g = ("absolute" === a.position || a.absolute === !0, x(a.wordsClass, f)), h = x(a.charsClass, f); --e > -1;) d = this.elements[e], this._originals[e] = d.innerHTML, b = d.clientHeight, c = d.clientWidth, G(d, a, g, h), E(d, a, this.chars, this.words, this.lines, c, b);
        return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this
    }, H.revert = function() {
        if (!this._originals) throw "revert() call wasn't scoped properly.";
        for (var a = this._originals.length; --a > -1;) this.elements[a].innerHTML = this._originals[a];
        return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
    }, y.selector = a.$ || a.jQuery || function(b) {
        var c = a.$ || a.jQuery;
        return c ? (y.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
    }, y.version = "0.5.6"
}(_gsScope),
function(a) {
    "use strict";
    var b = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[a]
    };
    "function" == typeof define && define.amd ? define([], b) : "undefined" != typeof module && module.exports && (module.exports = b())
}("SplitText");


try {
    window.GreenSockGlobals = null;
    window._gsQueue = null;
    window._gsDefine = null;

    delete(window.GreenSockGlobals);
    delete(window._gsQueue);
    delete(window._gsDefine);
} catch (e) {}

try {
    window.GreenSockGlobals = oldgs;
    window._gsQueue = oldgs_queue;
} catch (e) {}

if (window.tplogs == true)
    try {
        console.groupEnd();
    } catch (e) {}

(function(e, t) {
    e.waitForImages = {
        hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage"]
    };
    e.expr[":"].uncached = function(t) {
        var n = document.createElement("img");
        n.src = t.src;
        return e(t).is('img[src!=""]') && !n.complete
    };
    e.fn.waitForImages = function(t, n, r) {
        if (e.isPlainObject(arguments[0])) {
            n = t.each;
            r = t.waitForAll;
            t = t.finished
        }
        t = t || e.noop;
        n = n || e.noop;
        r = !!r;
        if (!e.isFunction(t) || !e.isFunction(n)) {
            throw new TypeError("An invalid callback was supplied.")
        }
        return this.each(function() {
            var i = e(this),
                s = [];
            if (r) {
                var o = e.waitForImages.hasImageProperties || [],
                    u = /url\((['"]?)(.*?)\1\)/g;
                i.find("*").each(function() {
                    var t = e(this);
                    if (t.is("img:uncached")) {
                        s.push({
                            src: t.attr("src"),
                            element: t[0]
                        })
                    }
                    e.each(o, function(e, n) {
                        var r = t.css(n);
                        if (!r) {
                            return true
                        }
                        var i;
                        while (i = u.exec(r)) {
                            s.push({
                                src: i[2],
                                element: t[0]
                            })
                        }
                    })
                })
            } else {
                i.find("img:uncached").each(function() {
                    s.push({
                        src: this.src,
                        element: this
                    })
                })
            }
            var f = s.length,
                l = 0;
            if (f == 0) {
                t.call(i[0])
            }
            e.each(s, function(r, s) {
                var o = new Image;
                e(o).bind("load error", function(e) {
                    l++;
                    n.call(s.element, l, f, e.type == "load");
                    if (l == f) {
                        t.call(i[0]);
                        return false
                    }
                });
                o.src = s.src
            })
        })
    };
})(jQuery)

;
/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 5.4.5 (17.05.2017)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
 **************************************************************************/
! function(jQuery, undefined) {
    "use strict";
    var version = {
        core: "5.4.5",
        "revolution.extensions.actions.min.js": "2.1.0",
        "revolution.extensions.carousel.min.js": "1.2.1",
        "revolution.extensions.kenburn.min.js": "1.3.1",
        "revolution.extensions.layeranimation.min.js": "3.6.1",
        "revolution.extensions.navigation.min.js": "1.3.3",
        "revolution.extensions.parallax.min.js": "2.2.0",
        "revolution.extensions.slideanims.min.js": "1.7",
        "revolution.extensions.video.min.js": "2.1.1"
    };
    jQuery.fn.extend({
        revolution: function(a) {
            var b = {
                delay: 1e2,
                responsiveLevels: 4064,
                visibilityLevels: [2048, 1024, 778, 480],
                gridwidth: 960,
                gridheight: 500,
                minHeight: 0,
                autoHeight: "off",
                sliderType: "standard",
                sliderLayout: "auto",
                fullScreenAutoWidth: "off",
                fullScreenAlignForce: "off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "0",
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLimit: 0,
                hideSliderAtLimit: 0,
                disableProgressBar: "off",
                stopAtSlide: -1,
                stopAfterLoops: -1,
                shadow: 0,
                dottedOverlay: "none",
                startDelay: 0,
                lazyType: "smart",
                spinner: "spinner0",
                shuffle: "off",
                viewPort: {
                    enable: !1,
                    outof: "wait",
                    visible_area: "60%",
                    presize: !1
                },
                fallbacks: {
                    isJoomla: !1,
                    panZoomDisableOnMobile: "off",
                    simplifyAll: "on",
                    nextSlideOnWindowFocus: "off",
                    disableFocusListener: !0,
                    ignoreHeightChanges: "off",
                    ignoreHeightChangesSize: 0,
                    allowHTML5AutoPlayOnAndroid: !0
                },
                parallax: {
                    type: "off",
                    levels: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
                    origo: "enterpoint",
                    speed: 400,
                    bgparallax: "off",
                    opacity: "on",
                    disable_onmobile: "off",
                    ddd_shadow: "on",
                    ddd_bgfreeze: "off",
                    ddd_overflow: "visible",
                    ddd_layer_overflow: "visible",
                    ddd_z_correction: 65,
                    ddd_path: "mouse"
                },
                scrolleffect: {
                    fade: "off",
                    blur: "off",
                    scale: "off",
                    grayscale: "off",
                    maxblur: 10,
                    on_layers: "off",
                    on_slidebg: "off",
                    on_static_layers: "off",
                    on_parallax_layers: "off",
                    on_parallax_static_layers: "off",
                    direction: "both",
                    multiplicator: 1.35,
                    multiplicator_layers: .5,
                    tilt: 30,
                    disable_on_mobile: "on"
                },
                carousel: {
                    easing: punchgs.Power3.easeInOut,
                    speed: 800,
                    showLayersAllTime: "off",
                    horizontal_align: "center",
                    vertical_align: "center",
                    infinity: "on",
                    space: 0,
                    maxVisibleItems: 3,
                    stretch: "off",
                    fadeout: "on",
                    maxRotation: 0,
                    minScale: 0,
                    vary_fade: "off",
                    vary_rotation: "on",
                    vary_scale: "off",
                    border_radius: "0px",
                    padding_top: 0,
                    padding_bottom: 0
                },
                navigation: {
                    keyboardNavigation: "off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation: "off",
                    onHoverStop: "on",
                    touch: {
                        touchenabled: "off",
                        touchOnDesktop: "off",
                        swipe_treshold: 75,
                        swipe_min_touches: 1,
                        drag_block_vertical: !1,
                        swipe_direction: "horizontal"
                    },
                    arrows: {
                        style: "",
                        enable: !1,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        tmp: "",
                        rtl: !1,
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0,
                            container: "slider"
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0,
                            container: "slider"
                        }
                    },
                    bullets: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        h_align: "left",
                        v_align: "center",
                        space: 0,
                        h_offset: 20,
                        v_offset: 0,
                        tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
                    },
                    thumbnails: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        width: 100,
                        height: 50,
                        min_width: 100,
                        wrapper_padding: 2,
                        wrapper_color: "#f5f5f5",
                        wrapper_opacity: 1,
                        tmp: '<span class="tp-thumb-image"></span><span class="tp-thumb-title"></span>',
                        visibleAmount: 5,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        span: !1,
                        position: "inner",
                        space: 2,
                        h_align: "left",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    },
                    tabs: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        width: 100,
                        min_width: 100,
                        height: 50,
                        wrapper_padding: 10,
                        wrapper_color: "#f5f5f5",
                        wrapper_opacity: 1,
                        tmp: '<span class="tp-tab-image"></span>',
                        visibleAmount: 5,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        span: !1,
                        space: 0,
                        position: "inner",
                        h_align: "left",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    }
                },
                extensions: "extensions/",
                extensions_suffix: ".min.js",
                debugMode: !1
            };
            return a = jQuery.extend(!0, {}, b, a), this.each(function() {
                var b = jQuery(this);
                a.minHeight = a.minHeight != undefined ? parseInt(a.minHeight, 0) : a.minHeight, a.scrolleffect.on = "on" === a.scrolleffect.fade || "on" === a.scrolleffect.scale || "on" === a.scrolleffect.blur || "on" === a.scrolleffect.grayscale, "hero" == a.sliderType && b.find(">ul>li").each(function(a) {
                    a > 0 && jQuery(this).remove()
                }), a.jsFileLocation = a.jsFileLocation || getScriptLocation("themepunch.revolution.min.js"), a.jsFileLocation = a.jsFileLocation + a.extensions, a.scriptsneeded = getNeededScripts(a, b), a.curWinRange = 0, a.rtl = !0, a.navigation != undefined && a.navigation.touch != undefined && (a.navigation.touch.swipe_min_touches = a.navigation.touch.swipe_min_touches > 5 ? 1 : a.navigation.touch.swipe_min_touches), jQuery(this).on("scriptsloaded", function() {
                    if (a.modulesfailing) return b.html('<div style="margin:auto;line-height:40px;font-size:14px;color:#fff;padding:15px;background:#e74c3c;margin:20px 0px;">!! Error at loading Slider Revolution 5.0 Extrensions.' + a.errorm + "</div>").show(), !1;
                    _R.migration != undefined && (a = _R.migration(b, a)), punchgs.force3D = !0, "on" !== a.simplifyAll && punchgs.TweenLite.lagSmoothing(1e3, 16), prepareOptions(b, a), initSlider(b, a)
                }), b[0].opt = a, waitForScripts(b, a)
            })
        },
        getRSVersion: function(a) {
            if (!0 === a) return jQuery("body").data("tp_rs_version");
            var b = jQuery("body").data("tp_rs_version"),
                c = "";
            c += "---------------------------------------------------------\n", c += "    Currently Loaded Slider Revolution & SR Modules :\n", c += "---------------------------------------------------------\n";
            for (var d in b) c += b[d].alias + ": " + b[d].ver + "\n";
            return c += "---------------------------------------------------------\n"
        },
        revremoveslide: function(a) {
            return this.each(function() {
                var b = jQuery(this),
                    c = b[0].opt;
                if (!(a < 0 || a > c.slideamount) && b != undefined && b.length > 0 && jQuery("body").find("#" + b.attr("id")).length > 0 && c && c.li.length > 0 && (a > 0 || a <= c.li.length)) {
                    var d = jQuery(c.li[a]),
                        e = d.data("index"),
                        f = !1;
                    c.slideamount = c.slideamount - 1, c.realslideamount = c.realslideamount - 1, removeNavWithLiref(".tp-bullet", e, c), removeNavWithLiref(".tp-tab", e, c), removeNavWithLiref(".tp-thumb", e, c), d.hasClass("active-revslide") && (f = !0), d.remove(), c.li = removeArray(c.li, a), c.carousel && c.carousel.slides && (c.carousel.slides = removeArray(c.carousel.slides, a)), c.thumbs = removeArray(c.thumbs, a), _R.updateNavIndexes && _R.updateNavIndexes(c), f && b.revnext(), punchgs.TweenLite.set(c.li, {
                        minWidth: "99%"
                    }), punchgs.TweenLite.set(c.li, {
                        minWidth: "100%"
                    })
                }
            })
        },
        revaddcallback: function(a) {
            return this.each(function() {
                this.opt && (this.opt.callBackArray === undefined && (this.opt.callBackArray = new Array), this.opt.callBackArray.push(a))
            })
        },
        revgetparallaxproc: function() {
            return jQuery(this)[0].opt.scrollproc
        },
        revdebugmode: function() {
            return this.each(function() {
                var a = jQuery(this);
                a[0].opt.debugMode = !0, containerResized(a, a[0].opt)
            })
        },
        revscroll: function(a) {
            return this.each(function() {
                var b = jQuery(this);
                jQuery("body,html").animate({
                    scrollTop: b.offset().top + b.height() - a + "px"
                }, {
                    duration: 400
                })
            })
        },
        revredraw: function(a) {
            return this.each(function() {
                var a = jQuery(this);
                containerResized(a, a[0].opt)
            })
        },
        revkill: function(a) {
            var b = this,
                c = jQuery(this);
            if (punchgs.TweenLite.killDelayedCallsTo(_R.showHideNavElements), c != undefined && c.length > 0 && jQuery("body").find("#" + c.attr("id")).length > 0) {
                c.data("conthover", 1), c.data("conthover-changed", 1), c.trigger("revolution.slide.onpause");
                var d = c.parent().find(".tp-bannertimer"),
                    e = c[0].opt;
                e.tonpause = !0, c.trigger("stoptimer");
                var f = "resize.revslider-" + c.attr("id");
                jQuery(window).unbind(f), punchgs.TweenLite.killTweensOf(c.find("*"), !1), punchgs.TweenLite.killTweensOf(c, !1), c.unbind("hover, mouseover, mouseenter,mouseleave, resize");
                var f = "resize.revslider-" + c.attr("id");
                jQuery(window).off(f), c.find("*").each(function() {
                    var a = jQuery(this);
                    a.unbind("on, hover, mouseenter,mouseleave,mouseover, resize,restarttimer, stoptimer"), a.off("on, hover, mouseenter,mouseleave,mouseover, resize"), a.data("mySplitText", null), a.data("ctl", null), a.data("tween") != undefined && a.data("tween").kill(), a.data("kenburn") != undefined && a.data("kenburn").kill(), a.data("timeline_out") != undefined && a.data("timeline_out").kill(), a.data("timeline") != undefined && a.data("timeline").kill(), a.remove(), a.empty(), a = null
                }), punchgs.TweenLite.killTweensOf(c.find("*"), !1), punchgs.TweenLite.killTweensOf(c, !1), d.remove();
                try {
                    c.closest(".forcefullwidth_wrapper_tp_banner").remove()
                } catch (a) {}
                try {
                    c.closest(".rev_slider_wrapper").remove()
                } catch (a) {}
                try {
                    c.remove()
                } catch (a) {}
                return c.empty(), c.html(), c = null, e = null, delete b.c, delete b.opt, delete b.container, !0
            }
            return !1
        },
        revpause: function() {
            return this.each(function() {
                var a = jQuery(this);
                a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0 && (a.data("conthover", 1), a.data("conthover-changed", 1), a.trigger("revolution.slide.onpause"), a[0].opt.tonpause = !0, a.trigger("stoptimer"))
            })
        },
        revresume: function() {
            return this.each(function() {
                var a = jQuery(this);
                a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0 && (a.data("conthover", 0), a.data("conthover-changed", 1), a.trigger("revolution.slide.onresume"), a[0].opt.tonpause = !1, a.trigger("starttimer"))
            })
        },
        revstart: function() {
            var a = jQuery(this);
            if (a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0 && a[0].opt !== undefined) return a[0].opt.sliderisrunning ? (console.log("Slider Is Running Already"), !1) : (runSlider(a, a[0].opt), !0)
        },
        revnext: function() {
            return this.each(function() {
                var a = jQuery(this);
                a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0 && _R.callingNewSlide(a, 1)
            })
        },
        revprev: function() {
            return this.each(function() {
                var a = jQuery(this);
                a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0 && _R.callingNewSlide(a, -1)
            })
        },
        revmaxslide: function() {
            return jQuery(this).find(".tp-revslider-mainul >li").length
        },
        revcurrentslide: function() {
            var a = jQuery(this);
            if (a != undefined && a.length > 0 && jQuery("body").find("#" + a.attr("id")).length > 0) return parseInt(a[0].opt.act, 0) + 1
        },
        revlastslide: function() {
            return jQuery(this).find(".tp-revslider-mainul >li").length
        },
        revshowslide: function(a) {
            return this.each(function() {
                var b = jQuery(this);
                b != undefined && b.length > 0 && jQuery("body").find("#" + b.attr("id")).length > 0 && _R.callingNewSlide(b, "to" + (a - 1))
            })
        },
        revcallslidewithid: function(a) {
            return this.each(function() {
                var b = jQuery(this);
                b != undefined && b.length > 0 && jQuery("body").find("#" + b.attr("id")).length > 0 && _R.callingNewSlide(b, a)
            })
        }
    });
    var _R = jQuery.fn.revolution;
    jQuery.extend(!0, _R, {
        getversion: function() {
            return version
        },
        compare_version: function(a) {
            var b = jQuery("body").data("tp_rs_version");
            return b = b === undefined ? new Object : b, b.Core === undefined && (b.Core = new Object, b.Core.alias = "Slider Revolution Core", b.Core.name = "jquery.themepunch.revolution.min.js", b.Core.ver = _R.getversion().core), "stop" != a.check && (_R.getversion().core < a.min_core ? (a.check === undefined && (console.log("%cSlider Revolution Warning (Core:" + _R.getversion().core + ")", "color:#c0392b;font-weight:bold;"), console.log("%c     Core is older than expected (" + a.min_core + ") from " + a.alias, "color:#333"), console.log("%c     Please update Slider Revolution to the latest version.", "color:#333"), console.log("%c     It might be required to purge and clear Server/Client side Caches.", "color:#333")), a.check = "stop") : _R.getversion()[a.name] != undefined && a.version < _R.getversion()[a.name] && (a.check === undefined && (console.log("%cSlider Revolution Warning (Core:" + _R.getversion().core + ")", "color:#c0392b;font-weight:bold;"), console.log("%c     " + a.alias + " (" + a.version + ") is older than requiered (" + _R.getversion()[a.name] + ")", "color:#333"), console.log("%c     Please update Slider Revolution to the latest version.", "color:#333"), console.log("%c     It might be required to purge and clear Server/Client side Caches.", "color:#333")), a.check = "stop")), b[a.alias] === undefined && (b[a.alias] = new Object, b[a.alias].alias = a.alias, b[a.alias].ver = a.version, b[a.alias].name = a.name), jQuery("body").data("tp_rs_version", b), a
        },
        currentSlideIndex: function(a) {
            var b = a.c.find(".active-revslide").index();
            return b = -1 == b ? 0 : b
        },
        simp: function(a, b, c) {
            var d = Math.abs(a) - Math.floor(Math.abs(a / b)) * b;
            return c ? d : a < 0 ? -1 * d : d
        },
        iOSVersion: function() {
            var a = !1;
            return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ? navigator.userAgent.match(/OS 4_\d like Mac OS X/i) && (a = !0) : a = !1, a
        },
        isIE: function(a, b) {
            var c = jQuery('<div style="display:none;"/>').appendTo(jQuery("body"));
            c.html("\x3c!--[if " + (b || "") + " IE " + (a || "") + "]><a>&nbsp;</a><![endif]--\x3e");
            var d = c.find("a").length;
            return c.remove(), d
        },
        is_mobile: function() {
            var a = ["android", "webos", "iphone", "ipad", "blackberry", "Android", "webos", , "iPod", "iPhone", "iPad", "Blackberry", "BlackBerry"],
                b = !1;
            for (var c in a) navigator.userAgent.split(a[c]).length > 1 && (b = !0);
            return b
        },
        is_android: function() {
            var a = ["android", "Android"],
                b = !1;
            for (var c in a) navigator.userAgent.split(a[c]).length > 1 && (b = !0);
            return b
        },
        callBackHandling: function(a, b, c) {
            try {
                a.callBackArray && jQuery.each(a.callBackArray, function(a, d) {
                    d && d.inmodule && d.inmodule === b && d.atposition && d.atposition === c && d.callback && d.callback.call()
                })
            } catch (a) {
                console.log("Call Back Failed")
            }
        },
        get_browser: function() {
            var c, a = navigator.appName,
                b = navigator.userAgent,
                d = b.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            return d && null != (c = b.match(/version\/([\.\d]+)/i)) && (d[2] = c[1]), d = d ? [d[1], d[2]] : [a, navigator.appVersion, "-?"], d[0]
        },
        get_browser_version: function() {
            var c, a = navigator.appName,
                b = navigator.userAgent,
                d = b.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            return d && null != (c = b.match(/version\/([\.\d]+)/i)) && (d[2] = c[1]), d = d ? [d[1], d[2]] : [a, navigator.appVersion, "-?"], d[1]
        },
        getHorizontalOffset: function(a, b) {
            var c = gWiderOut(a, ".outer-left"),
                d = gWiderOut(a, ".outer-right");
            switch (b) {
                case "left":
                    return c;
                case "right":
                    return d;
                case "both":
                    return c + d
            }
        },
        callingNewSlide: function(a, b) {
            var c = a.find(".next-revslide").length > 0 ? a.find(".next-revslide").index() : a.find(".processing-revslide").length > 0 ? a.find(".processing-revslide").index() : a.find(".active-revslide").index(),
                d = 0,
                e = a[0].opt;
            a.find(".next-revslide").removeClass("next-revslide"), a.find(".active-revslide").hasClass("tp-invisible-slide") && (c = e.last_shown_slide), b && jQuery.isNumeric(b) || b.match(/to/g) ? (1 === b || -1 === b ? (d = c + b, d = d < 0 ? e.slideamount - 1 : d >= e.slideamount ? 0 : d) : (b = jQuery.isNumeric(b) ? b : parseInt(b.split("to")[1], 0), d = b < 0 ? 0 : b > e.slideamount - 1 ? e.slideamount - 1 : b), a.find(".tp-revslider-slidesli:eq(" + d + ")").addClass("next-revslide")) : b && a.find(".tp-revslider-slidesli").each(function() {
                var a = jQuery(this);
                a.data("index") === b && a.addClass("next-revslide")
            }), d = a.find(".next-revslide").index(), a.trigger("revolution.nextslide.waiting"), c === d && c === e.last_shown_slide || d !== c && -1 != d ? swapSlide(a) : a.find(".next-revslide").removeClass("next-revslide")
        },
        slotSize: function(a, b) {
            b.slotw = Math.ceil(b.width / b.slots), "fullscreen" == b.sliderLayout ? b.sloth = Math.ceil(jQuery(window).height() / b.slots) : b.sloth = Math.ceil(b.height / b.slots), "on" == b.autoHeight && a !== undefined && "" !== a && (b.sloth = Math.ceil(a.height() / b.slots))
        },
        setSize: function(a) {
            var b = (a.top_outer || 0) + (a.bottom_outer || 0),
                c = parseInt(a.carousel.padding_top || 0, 0),
                d = parseInt(a.carousel.padding_bottom || 0, 0),
                e = a.gridheight[a.curWinRange],
                f = 0,
                g = -1 === a.nextSlide || a.nextSlide === undefined ? 0 : a.nextSlide;
            if (a.paddings = a.paddings === undefined ? {
                    top: parseInt(a.c.parent().css("paddingTop"), 0) || 0,
                    bottom: parseInt(a.c.parent().css("paddingBottom"), 0) || 0
                } : a.paddings, a.rowzones && a.rowzones.length > 0)
                for (var h = 0; h < a.rowzones[g].length; h++) f += a.rowzones[g][h][0].offsetHeight;
            if (e = e < a.minHeight ? a.minHeight : e, e = e < f ? f : e, "fullwidth" == a.sliderLayout && "off" == a.autoHeight && punchgs.TweenLite.set(a.c, {
                    maxHeight: e + "px"
                }), a.c.css({
                    marginTop: c,
                    marginBottom: d
                }), a.width = a.ul.width(), a.height = a.ul.height(), setScale(a), a.height = Math.round(a.gridheight[a.curWinRange] * (a.width / a.gridwidth[a.curWinRange])), a.height > a.gridheight[a.curWinRange] && "on" != a.autoHeight && (a.height = a.gridheight[a.curWinRange]), "fullscreen" == a.sliderLayout || a.infullscreenmode) {
                a.height = a.bw * a.gridheight[a.curWinRange];
                var j = (a.c.parent().width(), jQuery(window).height());
                if (a.fullScreenOffsetContainer != undefined) {
                    try {
                        var k = a.fullScreenOffsetContainer.split(",");
                        k && jQuery.each(k, function(a, b) {
                            j = jQuery(b).length > 0 ? j - jQuery(b).outerHeight(!0) : j
                        })
                    } catch (a) {}
                    try {
                        a.fullScreenOffset.split("%").length > 1 && a.fullScreenOffset != undefined && a.fullScreenOffset.length > 0 ? j -= jQuery(window).height() * parseInt(a.fullScreenOffset, 0) / 100 : a.fullScreenOffset != undefined && a.fullScreenOffset.length > 0 && (j -= parseInt(a.fullScreenOffset, 0))
                    } catch (a) {}
                }
                j = j < a.minHeight ? a.minHeight : j, j -= b, a.c.parent().height(j), a.c.closest(".rev_slider_wrapper").height(j), a.c.css({
                    height: "100%"
                }), a.height = j, a.minHeight != undefined && a.height < a.minHeight && (a.height = a.minHeight), a.height = parseInt(f, 0) > parseInt(a.height, 0) ? f : a.height
            } else a.minHeight != undefined && a.height < a.minHeight && (a.height = a.minHeight), a.height = parseInt(f, 0) > parseInt(a.height, 0) ? f : a.height, a.c.height(a.height);
            var l = {
                height: c + d + b + a.height + a.paddings.top + a.paddings.bottom
            };
            a.c.closest(".forcefullwidth_wrapper_tp_banner").find(".tp-fullwidth-forcer").css(l), a.c.closest(".rev_slider_wrapper").css(l), setScale(a)
        },
        enterInViewPort: function(a) {
            a.waitForCountDown && (countDown(a.c, a), a.waitForCountDown = !1), a.waitForFirstSlide && (swapSlide(a.c), a.waitForFirstSlide = !1, setTimeout(function() {
                a.c.removeClass("tp-waitforfirststart")
            }, 500)), "playing" != a.sliderlaststatus && a.sliderlaststatus != undefined || a.c.trigger("starttimer"), a.lastplayedvideos != undefined && a.lastplayedvideos.length > 0 && jQuery.each(a.lastplayedvideos, function(b, c) {
                _R.playVideo(c, a)
            })
        },
        leaveViewPort: function(a) {
            a.sliderlaststatus = a.sliderstatus, a.c.trigger("stoptimer"), a.playingvideos != undefined && a.playingvideos.length > 0 && (a.lastplayedvideos = jQuery.extend(!0, [], a.playingvideos), a.playingvideos && jQuery.each(a.playingvideos, function(b, c) {
                a.leaveViewPortBasedStop = !0, _R.stopVideo && _R.stopVideo(c, a)
            }))
        },
        unToggleState: function(a) {
            a != undefined && a.length > 0 && jQuery.each(a, function(a, b) {
                b.removeClass("rs-toggle-content-active")
            })
        },
        toggleState: function(a) {
            a != undefined && a.length > 0 && jQuery.each(a, function(a, b) {
                b.addClass("rs-toggle-content-active")
            })
        },
        swaptoggleState: function(a) {
            a != undefined && a.length > 0 && jQuery.each(a, function(a, b) {
                jQuery(b).hasClass("rs-toggle-content-active") ? jQuery(b).removeClass("rs-toggle-content-active") : jQuery(b).addClass("rs-toggle-content-active")
            })
        },
        lastToggleState: function(a) {
            var b = 0;
            return a != undefined && a.length > 0 && jQuery.each(a, function(a, c) {
                b = c.hasClass("rs-toggle-content-active")
            }), b
        }
    });
    var _ISM = _R.is_mobile(),
        _ANDROID = _R.is_android(),
        checkIDS = function(a, b) {
            if (a.anyid = a.anyid === undefined ? [] : a.anyid, -1 != jQuery.inArray(b.attr("id"), a.anyid)) {
                var d = b.attr("id") + "_" + Math.round(9999 * Math.random());
                b.attr("id", d)
            }
            a.anyid.push(b.attr("id"))
        },
        removeArray = function(a, b) {
            var c = [];
            return jQuery.each(a, function(a, d) {
                a != b && c.push(d)
            }), c
        },
        removeNavWithLiref = function(a, b, c) {
            c.c.find(a).each(function() {
                var a = jQuery(this);
                a.data("liref") === b && a.remove()
            })
        },
        lAjax = function(a, b) {
            return !jQuery("body").data(a) && (b.filesystem ? (b.errorm === undefined && (b.errorm = "<br>Local Filesystem Detected !<br>Put this to your header:"), console.warn("Local Filesystem detected !"), b.errorm = b.errorm + '<br>&lt;script type="text/javascript" src="' + b.jsFileLocation + a + b.extensions_suffix + '"&gt;&lt;/script&gt;', console.warn(b.jsFileLocation + a + b.extensions_suffix + " could not be loaded !"), console.warn("Please use a local Server or work online or make sure that you load all needed Libraries manually in your Document."), console.log(" "), b.modulesfailing = !0, !1) : (jQuery.ajax({
                url: b.jsFileLocation + a + b.extensions_suffix + "?version=" + version.core,
                dataType: "script",
                cache: !0,
                error: function(c) {
                    console.warn("Slider Revolution 5.0 Error !"), console.error("Failure at Loading:" + a + b.extensions_suffix + " on Path:" + b.jsFileLocation), console.info(c)
                }
            }), void jQuery("body").data(a, !0)))
        },
        getNeededScripts = function(a, b) {
            var c = new Object,
                d = a.navigation;
            return c.kenburns = !1, c.parallax = !1, c.carousel = !1, c.navigation = !1, c.videos = !1, c.actions = !1, c.layeranim = !1, c.migration = !1, b.data("version") && b.data("version").toString().match(/5./gi) ? (b.find("img").each(function() {
                "on" == jQuery(this).data("kenburns") && (c.kenburns = !0)
            }), ("carousel" == a.sliderType || "on" == d.keyboardNavigation || "on" == d.mouseScrollNavigation || "on" == d.touch.touchenabled || d.arrows.enable || d.bullets.enable || d.thumbnails.enable || d.tabs.enable) && (c.navigation = !0), b.find(".tp-caption, .tp-static-layer, .rs-background-video-layer").each(function() {
                var a = jQuery(this);
                (a.data("ytid") != undefined || a.find("iframe").length > 0 && a.find("iframe").attr("src").toLowerCase().indexOf("youtube") > 0) && (c.videos = !0), (a.data("vimeoid") != undefined || a.find("iframe").length > 0 && a.find("iframe").attr("src").toLowerCase().indexOf("vimeo") > 0) && (c.videos = !0), a.data("actions") !== undefined && (c.actions = !0), c.layeranim = !0
            }), b.find("li").each(function() {
                jQuery(this).data("link") && jQuery(this).data("link") != undefined && (c.layeranim = !0, c.actions = !0)
            }), !c.videos && (b.find(".rs-background-video-layer").length > 0 || b.find(".tp-videolayer").length > 0 || b.find(".tp-audiolayer").length > 0 || b.find("iframe").length > 0 || b.find("video").length > 0) && (c.videos = !0), "carousel" == a.sliderType && (c.carousel = !0), ("off" !== a.parallax.type || a.viewPort.enable || "true" == a.viewPort.enable || "true" === a.scrolleffect.on || a.scrolleffect.on) && (c.parallax = !0)) : (c.kenburns = !0, c.parallax = !0, c.carousel = !1, c.navigation = !0, c.videos = !0, c.actions = !0, c.layeranim = !0, c.migration = !0), "hero" == a.sliderType && (c.carousel = !1, c.navigation = !1), window.location.href.match(/file:/gi) && (c.filesystem = !0, a.filesystem = !0), c.videos && void 0 === _R.isVideoPlaying && lAjax("revolution.extension.video", a), c.carousel && void 0 === _R.prepareCarousel && lAjax("revolution.extension.carousel", a), c.carousel || void 0 !== _R.animateSlide || lAjax("revolution.extension.slideanims", a), c.actions && void 0 === _R.checkActions && lAjax("revolution.extension.actions", a), c.layeranim && void 0 === _R.handleStaticLayers && lAjax("revolution.extension.layeranimation", a), c.kenburns && void 0 === _R.stopKenBurn && lAjax("revolution.extension.kenburn", a), c.navigation && void 0 === _R.createNavigation && lAjax("revolution.extension.navigation", a), c.migration && void 0 === _R.migration && lAjax("revolution.extension.migration", a), c.parallax && void 0 === _R.checkForParallax && lAjax("revolution.extension.parallax", a), a.addons != undefined && a.addons.length > 0 && jQuery.each(a.addons, function(b, c) {
                "object" == typeof c && c.fileprefix != undefined && lAjax(c.fileprefix, a)
            }), c
        },
        waitForScripts = function(a, b) {
            var c = !0,
                d = b.scriptsneeded;
            b.addons != undefined && b.addons.length > 0 && jQuery.each(b.addons, function(a, b) {
                "object" == typeof b && b.init != undefined && _R[b.init] === undefined && (c = !1)
            }), d.filesystem || "undefined" != typeof punchgs && c && (!d.kenburns || d.kenburns && void 0 !== _R.stopKenBurn) && (!d.navigation || d.navigation && void 0 !== _R.createNavigation) && (!d.carousel || d.carousel && void 0 !== _R.prepareCarousel) && (!d.videos || d.videos && void 0 !== _R.resetVideo) && (!d.actions || d.actions && void 0 !== _R.checkActions) && (!d.layeranim || d.layeranim && void 0 !== _R.handleStaticLayers) && (!d.migration || d.migration && void 0 !== _R.migration) && (!d.parallax || d.parallax && void 0 !== _R.checkForParallax) && (d.carousel || !d.carousel && void 0 !== _R.animateSlide) ? a.trigger("scriptsloaded") : setTimeout(function() {
                waitForScripts(a, b)
            }, 50)
        },
        getScriptLocation = function(a) {
            var b = new RegExp("themepunch.revolution.min.js", "gi"),
                c = "";
            return jQuery("script").each(function() {
                var a = jQuery(this).attr("src");
                a && a.match(b) && (c = a)
            }), c = c.replace("jquery.themepunch.revolution.min.js", ""), c = c.replace("jquery.themepunch.revolution.js", ""), c = c.split("?")[0]
        },
        setCurWinRange = function(a, b) {
            var d = 9999,
                e = 0,
                f = 0,
                g = 0,
                h = jQuery(window).width(),
                i = b && 9999 == a.responsiveLevels ? a.visibilityLevels : a.responsiveLevels;
            i && i.length && jQuery.each(i, function(a, b) {
                h < b && (0 == e || e > b) && (d = b, g = a, e = b), h > b && e < b && (e = b, f = a)
            }), e < d && (g = f), b ? a.forcedWinRange = g : a.curWinRange = g
        },
        prepareOptions = function(a, b) {
            b.carousel.maxVisibleItems = b.carousel.maxVisibleItems < 1 ? 999 : b.carousel.maxVisibleItems, b.carousel.vertical_align = "top" === b.carousel.vertical_align ? "0%" : "bottom" === b.carousel.vertical_align ? "100%" : "50%"
        },
        gWiderOut = function(a, b) {
            var c = 0;
            return a.find(b).each(function() {
                var a = jQuery(this);
                !a.hasClass("tp-forcenotvisible") && c < a.outerWidth() && (c = a.outerWidth())
            }), c
        },
        initSlider = function(container, opt) {
            if (container == undefined) return !1;
            container.data("aimg") != undefined && ("enabled" == container.data("aie8") && _R.isIE(8) || "enabled" == container.data("amobile") && _ISM) && container.html('<img class="tp-slider-alternative-image" src="' + container.data("aimg") + '">'), container.find(">ul").addClass("tp-revslider-mainul"), opt.c = container, opt.ul = container.find(".tp-revslider-mainul"), opt.ul.find(">li").each(function(a) {
                var b = jQuery(this);
                "on" == b.data("hideslideonmobile") && _ISM && b.remove(), (b.data("invisible") || !0 === b.data("invisible")) && (b.addClass("tp-invisible-slide"), b.appendTo(opt.ul))
            }), opt.addons != undefined && opt.addons.length > 0 && jQuery.each(opt.addons, function(i, obj) {
                "object" == typeof obj && obj.init != undefined && _R[obj.init](eval(obj.params))
            }), opt.cid = container.attr("id"), opt.ul.css({
                visibility: "visible"
            }), opt.slideamount = opt.ul.find(">li").not(".tp-invisible-slide").length, opt.realslideamount = opt.ul.find(">li").length, opt.slayers = container.find(".tp-static-layers"), opt.slayers.data("index", "staticlayers"), 1 != opt.waitForInit && (container[0].opt = opt, runSlider(container, opt))
        },
        onFullScreenChange = function() {
            jQuery("body").data("rs-fullScreenMode", !jQuery("body").data("rs-fullScreenMode")), jQuery("body").data("rs-fullScreenMode") && setTimeout(function() {
                jQuery(window).trigger("resize")
            }, 200)
        },
        runSlider = function(a, b) {
            if (b.sliderisrunning = !0, b.ul.find(">li").each(function(a) {
                    jQuery(this).data("originalindex", a)
                }), b.allli = b.ul.find(">li"), jQuery.each(b.allli, function(a, b) {
                    var b = jQuery(b);
                    b.data("origindex", b.index())
                }), b.li = b.ul.find(">li").not(".tp-invisible-slide"), "on" == b.shuffle) {
                var c = new Object,
                    d = b.ul.find(">li:first-child");
                c.fstransition = d.data("fstransition"), c.fsmasterspeed = d.data("fsmasterspeed"), c.fsslotamount = d.data("fsslotamount");
                for (var e = 0; e < b.slideamount; e++) {
                    var f = Math.round(Math.random() * b.slideamount);
                    b.ul.find(">li:eq(" + f + ")").prependTo(b.ul)
                }
                var g = b.ul.find(">li:first-child");
                g.data("fstransition", c.fstransition), g.data("fsmasterspeed", c.fsmasterspeed), g.data("fsslotamount", c.fsslotamount), b.allli = b.ul.find(">li"), b.li = b.ul.find(">li").not(".tp-invisible-slide")
            }
            if (b.inli = b.ul.find(">li.tp-invisible-slide"), b.thumbs = new Array, b.slots = 4, b.act = -1, b.firststart = 1, b.loadqueue = new Array, b.syncload = 0, b.conw = a.width(), b.conh = a.height(), b.responsiveLevels.length > 1 ? b.responsiveLevels[0] = 9999 : b.responsiveLevels = 9999, jQuery.each(b.allli, function(a, c) {
                    var c = jQuery(c),
                        d = c.find(".rev-slidebg") || c.find("img").first(),
                        e = 0;
                    c.addClass("tp-revslider-slidesli"), c.data("index") === undefined && c.data("index", "rs-" + Math.round(999999 * Math.random()));
                    var f = new Object;
                    f.params = new Array, f.id = c.data("index"), f.src = c.data("thumb") !== undefined ? c.data("thumb") : d.data("lazyload") !== undefined ? d.data("lazyload") : d.attr("src"), c.data("title") !== undefined && f.params.push({
                        from: RegExp("\\{\\{title\\}\\}", "g"),
                        to: c.data("title")
                    }), c.data("description") !== undefined && f.params.push({
                        from: RegExp("\\{\\{description\\}\\}", "g"),
                        to: c.data("description")
                    });
                    for (var e = 1; e <= 10; e++) c.data("param" + e) !== undefined && f.params.push({
                        from: RegExp("\\{\\{param" + e + "\\}\\}", "g"),
                        to: c.data("param" + e)
                    });
                    if (b.thumbs.push(f), c.data("link") != undefined) {
                        var g = c.data("link"),
                            h = c.data("target") || "_self",
                            i = "back" === c.data("slideindex") ? 0 : 60,
                            j = c.data("linktoslide"),
                            k = j;
                        j != undefined && "next" != j && "prev" != j && b.allli.each(function() {
                            var a = jQuery(this);
                            a.data("origindex") + 1 == k && (j = a.data("index"))
                        }), "slide" != g && (j = "no");
                        var l = '<div class="tp-caption slidelink" style="cursor:pointer;width:100%;height:100%;z-index:' + i + ';" data-x="center" data-y="center" data-basealign="slide" ',
                            m = "scroll_under" === j ? '[{"event":"click","action":"scrollbelow","offset":"100px","delay":"0"}]' : "prev" === j ? '[{"event":"click","action":"jumptoslide","slide":"prev","delay":"0.2"}]' : "next" === j ? '[{"event":"click","action":"jumptoslide","slide":"next","delay":"0.2"}]' : '[{"event":"click","action":"jumptoslide","slide":"' + j + '","delay":"0.2"}]',
                            n = ' data-frames=\'[{"delay":0,"speed":100,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]\'';
                        l = "no" == j ? l + n + " >" : l + "data-actions='" + m + "'" + n + " >", l += '<a style="width:100%;height:100%;display:block"', l = "slide" != g ? l + ' target="' + h + '" href="' + g + '"' : l, l += '><span style="width:100%;height:100%;display:block"></span></a></div>', c.append(l)
                    }
                }), b.rle = b.responsiveLevels.length || 1, b.gridwidth = cArray(b.gridwidth, b.rle), b.gridheight = cArray(b.gridheight, b.rle), "on" == b.simplifyAll && (_R.isIE(8) || _R.iOSVersion()) && (a.find(".tp-caption").each(function() {
                    var a = jQuery(this);
                    a.removeClass("customin customout").addClass("fadein fadeout"), a.data("splitin", ""), a.data("speed", 400)
                }), b.allli.each(function() {
                    var a = jQuery(this);
                    a.data("transition", "fade"), a.data("masterspeed", 500), a.data("slotamount", 1), (a.find(".rev-slidebg") || a.find(">img").first()).data("kenburns", "off")
                })), b.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), b.autoHeight = "fullscreen" == b.sliderLayout ? "on" : b.autoHeight, "fullwidth" == b.sliderLayout && "off" == b.autoHeight && a.css({
                    maxHeight: b.gridheight[b.curWinRange] + "px"
                }), "auto" != b.sliderLayout && 0 == a.closest(".forcefullwidth_wrapper_tp_banner").length && ("fullscreen" !== b.sliderLayout || "on" != b.fullScreenAutoWidth)) {
                var h = a.parent(),
                    i = h.css("marginBottom"),
                    j = h.css("marginTop"),
                    k = a.attr("id") + "_forcefullwidth";
                i = i === undefined ? 0 : i, j = j === undefined ? 0 : j, h.wrap('<div class="forcefullwidth_wrapper_tp_banner" id="' + k + '" style="position:relative;width:100%;height:auto;margin-top:' + j + ";margin-bottom:" + i + '"></div>'), a.closest(".forcefullwidth_wrapper_tp_banner").append('<div class="tp-fullwidth-forcer" style="width:100%;height:' + a.height() + 'px"></div>'), a.parent().css({
                    marginTop: "0px",
                    marginBottom: "0px"
                }), a.parent().css({
                    position: "absolute"
                })
            }
            if (b.shadow !== undefined && b.shadow > 0 && (a.parent().addClass("tp-shadow" + b.shadow), a.parent().append('<div class="tp-shadowcover"></div>'), a.parent().find(".tp-shadowcover").css({
                    backgroundColor: a.parent().css("backgroundColor"),
                    backgroundImage: a.parent().css("backgroundImage")
                })), setCurWinRange(b), setCurWinRange(b, !0), !a.hasClass("revslider-initialised")) {
                a.addClass("revslider-initialised"), a.addClass("tp-simpleresponsive"), a.attr("id") == undefined && a.attr("id", "revslider-" + Math.round(1e3 * Math.random() + 5)), checkIDS(b, a), b.firefox13 = !1, b.ie = !jQuery.support.opacity, b.ie9 = 9 == document.documentMode, b.origcd = b.delay;
                var l = jQuery.fn.jquery.split("."),
                    m = parseFloat(l[0]),
                    n = parseFloat(l[1]);
                parseFloat(l[2] || "0");
                1 == m && n < 7 && a.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:' + l + " <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>"), m > 1 && (b.ie = !1);
                var p = new Object;
                p.addedyt = 0, p.addedvim = 0, p.addedvid = 0, b.scrolleffect.on && (b.scrolleffect.layers = new Array), a.find(".tp-caption, .rs-background-video-layer").each(function(a) {
                    var c = jQuery(this),
                        d = c.data(),
                        e = d.autoplayonlyfirsttime,
                        f = d.autoplay,
                        g = d.videomp4 !== undefined || d.videowebm !== undefined || d.videoogv !== undefined,
                        h = c.hasClass("tp-audiolayer"),
                        i = d.videoloop,
                        j = !0,
                        k = !1;
                    d.startclasses = c.attr("class"), d.isparallaxlayer = d.startclasses.indexOf("rs-parallax") >= 0, c.hasClass("tp-static-layer") && _R.handleStaticLayers && (_R.handleStaticLayers(c, b), b.scrolleffect.on && ("on" === b.scrolleffect.on_parallax_static_layers && d.isparallaxlayer || "on" === b.scrolleffect.on_static_layers && !d.isparallaxlayer) && (k = !0), j = !1);
                    var l = c.data("noposteronmobile") || c.data("noPosterOnMobile") || c.data("posteronmobile") || c.data("posterOnMobile") || c.data("posterOnMObile");
                    c.data("noposteronmobile", l);
                    var m = 0;
                    if (c.find("iframe").each(function() {
                            punchgs.TweenLite.set(jQuery(this), {
                                autoAlpha: 0
                            }), m++
                        }), m > 0 && c.data("iframes", !0), c.hasClass("tp-caption")) {
                        var n = c.hasClass("slidelink") ? "width:100% !important;height:100% !important;" : "",
                            o = c.data(),
                            q = "",
                            r = o.type,
                            s = "row" === r || "column" === r ? "relative" : "absolute",
                            t = "";
                        "row" === r ? (c.addClass("rev_row").removeClass("tp-resizeme"), t = "rev_row_wrap") : "column" === r ? (q = o.verticalalign === undefined ? " vertical-align:bottom;" : " vertical-align:" + o.verticalalign + ";", t = "rev_column", c.addClass("rev_column_inner").removeClass("tp-resizeme"), c.data("width", "auto"), punchgs.TweenLite.set(c, {
                            width: "auto"
                        })) : "group" === r && c.removeClass("tp-resizeme");
                        var u = "",
                            v = "";
                        "row" !== r && "group" !== r && "column" !== r ? (u = "display:" + c.css("display") + ";", c.closest(".rev_column").length > 0 ? (c.addClass("rev_layer_in_column"), j = !1) : c.closest(".rev_group").length > 0 && (c.addClass("rev_layer_in_group"), j = !1)) : "column" === r && (j = !1), o.wrapper_class !== undefined && (t = t + " " + o.wrapper_class), o.wrapper_id !== undefined && (v = 'id="' + o.wrapper_id + '"'), c.wrap("<div " + v + ' class="tp-parallax-wrap ' + t + '" style="' + q + " " + n + "position:" + s + ";" + u + ';visibility:hidden"><div class="tp-loop-wrap" style="' + n + "position:" + s + ";" + u + ';"><div class="tp-mask-wrap" style="' + n + "position:" + s + ";" + u + ';" ></div></div></div>'), j && b.scrolleffect.on && ("on" === b.scrolleffect.on_parallax_layers && d.isparallaxlayer || "on" === b.scrolleffect.on_layers && !d.isparallaxlayer) && b.scrolleffect.layers.push(c.parent()), k && b.scrolleffect.layers.push(c.parent()), "column" === r && (c.append('<div class="rev_column_bg rev_column_bg_man_sized" style="visibility:hidden"></div>'), c.closest(".tp-parallax-wrap").append('<div class="rev_column_bg rev_column_bg_auto_sized"></div>'));
                        var w = ["pendulum", "rotate", "slideloop", "pulse", "wave"],
                            x = c.closest(".tp-loop-wrap");
                        jQuery.each(w, function(a, b) {
                            var d = c.find(".rs-" + b),
                                e = d.data() || "";
                            "" != e && (x.data(e), x.addClass("rs-" + b), d.children(0).unwrap(), c.data("loopanimation", "on"))
                        }), c.attr("id") === undefined && c.attr("id", "layer-" + Math.round(999999999 * Math.random())), checkIDS(b, c), punchgs.TweenLite.set(c, {
                            visibility: "hidden"
                        })
                    }
                    var y = c.data("actions");
                    y !== undefined && _R.checkActions(c, b, y), checkHoverDependencies(c, b), _R.checkVideoApis && (p = _R.checkVideoApis(c, b, p)), !_ISM || b.fallbacks.allowHTML5AutoPlayOnAndroid && g || (1 != e && "true" != e || (d.autoplayonlyfirsttime = !1, e = !1), 1 != f && "true" != f && "on" != f && "1sttime" != f || (d.autoplay = "off", f = "off")), h || 1 != e && "true" != e && "1sttime" != f || "loopandnoslidestop" == i || c.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-once"), h || 1 != f && "true" != f && "on" != f && "no1sttime" != f || "loopandnoslidestop" == i || c.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-always")
                }), a[0].addEventListener("mouseenter", function() {
                    a.trigger("tp-mouseenter"), b.overcontainer = !0
                }, {
                    passive: !0
                }), a[0].addEventListener("mouseover", function() {
                    a.trigger("tp-mouseover"), b.overcontainer = !0
                }, {
                    passive: !0
                }), a[0].addEventListener("mouseleave", function() {
                    a.trigger("tp-mouseleft"), b.overcontainer = !1
                }, {
                    passive: !0
                }), a.find(".tp-caption video").each(function(a) {
                    var b = jQuery(this);
                    b.removeClass("video-js vjs-default-skin"), b.attr("preload", ""), b.css({
                        display: "none"
                    })
                }), "standard" !== b.sliderType && (b.lazyType = "all"), loadImages(a.find(".tp-static-layers"), b, 0, !0), waitForCurrentImages(a.find(".tp-static-layers"), b, function() {
                    a.find(".tp-static-layers img").each(function() {
                        var a = jQuery(this),
                            c = a.data("lazyload") != undefined ? a.data("lazyload") : a.attr("src"),
                            d = getLoadObj(b, c);
                        a.attr("src", d.src)
                    })
                }), b.rowzones = [], b.allli.each(function(a) {
                    var c = jQuery(this);
                    b.rowzones[a] = [], c.find(".rev_row_zone").each(function() {
                        b.rowzones[a].push(jQuery(this))
                    }), "all" != b.lazyType && ("smart" != b.lazyType || 0 != a && 1 != a && a != b.slideamount && a != b.slideamount - 1) || (loadImages(c, b, a), waitForCurrentImages(c, b, function() {}))
                });
                var q = getUrlVars("#")[0];
                if (q.length < 9 && q.split("slide").length > 1) {
                    var r = parseInt(q.split("slide")[1], 0);
                    r < 1 && (r = 1), r > b.slideamount && (r = b.slideamount), b.startWithSlide = r - 1
                }
                a.append('<div class="tp-loader ' + b.spinner + '"><div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'), b.loader = a.find(".tp-loader"), 0 === a.find(".tp-bannertimer").length && a.append('<div class="tp-bannertimer" style="visibility:hidden"></div>'), a.find(".tp-bannertimer").css({
                    width: "0%"
                }), b.ul.css({
                    display: "block"
                }), prepareSlides(a, b), ("off" !== b.parallax.type || b.scrolleffect.on) && _R.checkForParallax && _R.checkForParallax(a, b), _R.setSize(b), "hero" !== b.sliderType && _R.createNavigation && _R.createNavigation(a, b), _R.resizeThumbsTabs && _R.resizeThumbsTabs && _R.resizeThumbsTabs(b), contWidthManager(b);
                var s = b.viewPort;
                b.inviewport = !1, s != undefined && s.enable && (jQuery.isNumeric(s.visible_area) || -1 !== s.visible_area.indexOf("%") && (s.visible_area = parseInt(s.visible_area) / 100), _R.scrollTicker && _R.scrollTicker(b, a)), "carousel" === b.sliderType && _R.prepareCarousel && (punchgs.TweenLite.set(b.ul, {
                    opacity: 0
                }), _R.prepareCarousel(b, new punchgs.TimelineLite, undefined, 0), b.onlyPreparedSlide = !0), setTimeout(function() {
                    if (!s.enable || s.enable && b.inviewport || s.enable && !b.inviewport && "wait" == !s.outof) swapSlide(a);
                    else if (b.c.addClass("tp-waitforfirststart"), b.waitForFirstSlide = !0, s.presize) {
                        var c = jQuery(b.li[0]);
                        loadImages(c, b, 0, !0), waitForCurrentImages(c.find(".tp-layers"), b, function() {
                            _R.animateTheCaptions({
                                slide: c,
                                opt: b,
                                preset: !0
                            })
                        })
                    }
                    _R.manageNavigation && _R.manageNavigation(b), b.slideamount > 1 && (!s.enable || s.enable && b.inviewport ? countDown(a, b) : b.waitForCountDown = !0), setTimeout(function() {
                        a.trigger("revolution.slide.onloaded")
                    }, 100)
                }, b.startDelay), b.startDelay = 0, jQuery("body").data("rs-fullScreenMode", !1), window.addEventListener("fullscreenchange", onFullScreenChange, {
                    passive: !0
                }), window.addEventListener("mozfullscreenchange", onFullScreenChange, {
                    passive: !0
                }), window.addEventListener("webkitfullscreenchange", onFullScreenChange, {
                    passive: !0
                });
                var t = "resize.revslider-" + a.attr("id");
                jQuery(window).on(t, function() {
                    if (a == undefined) return !1;
                    0 != jQuery("body").find(a) && contWidthManager(b);
                    var c = !1;
                    if ("fullscreen" == b.sliderLayout) {
                        var d = jQuery(window).height();
                        "mobile" == b.fallbacks.ignoreHeightChanges && _ISM || "always" == b.fallbacks.ignoreHeightChanges ? (b.fallbacks.ignoreHeightChangesSize = b.fallbacks.ignoreHeightChangesSize == undefined ? 0 : b.fallbacks.ignoreHeightChangesSize, c = d != b.lastwindowheight && Math.abs(d - b.lastwindowheight) > b.fallbacks.ignoreHeightChangesSize) : c = d != b.lastwindowheight
                    }(a.outerWidth(!0) != b.width || a.is(":hidden") || c) && (b.lastwindowheight = jQuery(window).height(), containerResized(a, b))
                }), hideSliderUnder(a, b), contWidthManager(b), b.fallbacks.disableFocusListener || "true" == b.fallbacks.disableFocusListener || !0 === b.fallbacks.disableFocusListener || (a.addClass("rev_redraw_on_blurfocus"), tabBlurringCheck())
            }
        },
        cArray = function(a, b) {
            if (!jQuery.isArray(a)) {
                var c = a;
                a = new Array, a.push(c)
            }
            if (a.length < b)
                for (var c = a[a.length - 1], d = 0; d < b - a.length + 2; d++) a.push(c);
            return a
        },
        checkHoverDependencies = function(a, b) {
            var c = a.data();
            ("sliderenter" === c.start || c.frames !== undefined && c.frames[0] != undefined && "sliderenter" === c.frames[0].delay) && (b.layersonhover === undefined && (b.c.on("tp-mouseenter", function() {
                b.layersonhover && jQuery.each(b.layersonhover, function(a, c) {
                    var d = c.data("closestli") || c.closest(".tp-revslider-slidesli"),
                        e = c.data("staticli") || c.closest(".tp-static-layers");
                    c.data("closestli") === undefined && (c.data("closestli", d), c.data("staticli", e)), (d.length > 0 && d.hasClass("active-revslide") || d.hasClass("processing-revslide") || e.length > 0) && (c.data("animdirection", "in"), _R.playAnimationFrame && _R.playAnimationFrame({
                        caption: c,
                        opt: b,
                        frame: "frame_0",
                        triggerdirection: "in",
                        triggerframein: "frame_0",
                        triggerframeout: "frame_999"
                    }), c.data("triggerstate", "on"))
                })
            }), b.c.on("tp-mouseleft", function() {
                b.layersonhover && jQuery.each(b.layersonhover, function(a, c) {
                    c.data("animdirection", "out"), c.data("triggered", !0), c.data("triggerstate", "off"), _R.stopVideo && _R.stopVideo(c, b), _R.playAnimationFrame && _R.playAnimationFrame({
                        caption: c,
                        opt: b,
                        frame: "frame_999",
                        triggerdirection: "out",
                        triggerframein: "frame_0",
                        triggerframeout: "frame_999"
                    })
                })
            }), b.layersonhover = new Array), b.layersonhover.push(a))
        },
        contWidthManager = function(a) {
            var b = _R.getHorizontalOffset(a.c, "left");
            if ("auto" == a.sliderLayout || "fullscreen" === a.sliderLayout && "on" == a.fullScreenAutoWidth) "fullscreen" == a.sliderLayout && "on" == a.fullScreenAutoWidth ? punchgs.TweenLite.set(a.ul, {
                left: 0,
                width: a.c.width()
            }) : punchgs.TweenLite.set(a.ul, {
                left: b,
                width: a.c.width() - _R.getHorizontalOffset(a.c, "both")
            });
            else {
                var c = Math.ceil(a.c.closest(".forcefullwidth_wrapper_tp_banner").offset().left - b);
                punchgs.TweenLite.set(a.c.parent(), {
                    left: 0 - c + "px",
                    width: jQuery(window).width() - _R.getHorizontalOffset(a.c, "both")
                })
            }
            a.slayers && "fullwidth" != a.sliderLayout && "fullscreen" != a.sliderLayout && punchgs.TweenLite.set(a.slayers, {
                left: b
            })
        },
        cv = function(a, b) {
            return a === undefined ? b : a
        },
        hideSliderUnder = function(a, b, c) {
            var d = a.parent();
            jQuery(window).width() < b.hideSliderAtLimit ? (a.trigger("stoptimer"), "none" != d.css("display") && d.data("olddisplay", d.css("display")), d.css({
                display: "none"
            })) : a.is(":hidden") && c && (d.data("olddisplay") != undefined && "undefined" != d.data("olddisplay") && "none" != d.data("olddisplay") ? d.css({
                display: d.data("olddisplay")
            }) : d.css({
                display: "block"
            }), a.trigger("restarttimer"), setTimeout(function() {
                containerResized(a, b)
            }, 150)), _R.hideUnHideNav && _R.hideUnHideNav(b)
        },
        containerResized = function(a, b) {
            if (a.trigger("revolution.slide.beforeredraw"), 1 == b.infullscreenmode && (b.minHeight = jQuery(window).height()), setCurWinRange(b), setCurWinRange(b, !0), !_R.resizeThumbsTabs || !0 === _R.resizeThumbsTabs(b)) {
                if (hideSliderUnder(a, b, !0), contWidthManager(b), "carousel" == b.sliderType && _R.prepareCarousel(b, !0), a === undefined) return !1;
                _R.setSize(b), b.conw = b.c.width(), b.conh = b.infullscreenmode ? b.minHeight : b.c.height();
                var c = a.find(".active-revslide .slotholder"),
                    d = a.find(".processing-revslide .slotholder");
                removeSlots(a, b, a, 2), "standard" === b.sliderType && (punchgs.TweenLite.set(d.find(".defaultimg"), {
                    opacity: 0
                }), c.find(".defaultimg").css({
                    opacity: 1
                })), "carousel" === b.sliderType && b.lastconw != b.conw && (clearTimeout(b.pcartimer), b.pcartimer = setTimeout(function() {
                    _R.prepareCarousel(b, !0), "carousel" == b.sliderType && "on" === b.carousel.showLayersAllTime && jQuery.each(b.li, function(a) {
                        _R.animateTheCaptions({
                            slide: jQuery(b.li[a]),
                            opt: b,
                            recall: !0
                        })
                    })
                }, 100), b.lastconw = b.conw), _R.manageNavigation && _R.manageNavigation(b), _R.animateTheCaptions && a.find(".active-revslide").length > 0 && _R.animateTheCaptions({
                    slide: a.find(".active-revslide"),
                    opt: b,
                    recall: !0
                }), "on" == d.data("kenburns") && _R.startKenBurn(d, b, d.data("kbtl") !== undefined ? d.data("kbtl").progress() : 0), "on" == c.data("kenburns") && _R.startKenBurn(c, b, c.data("kbtl") !== undefined ? c.data("kbtl").progress() : 0), _R.animateTheCaptions && a.find(".processing-revslide").length > 0 && _R.animateTheCaptions({
                    slide: a.find(".processing-revslide"),
                    opt: b,
                    recall: !0
                }), _R.manageNavigation && _R.manageNavigation(b)
            }
            a.trigger("revolution.slide.afterdraw")
        },
        setScale = function(a) {
            a.bw = a.width / a.gridwidth[a.curWinRange], a.bh = a.height / a.gridheight[a.curWinRange], a.bh > a.bw ? a.bh = a.bw : a.bw = a.bh, (a.bh > 1 || a.bw > 1) && (a.bw = 1, a.bh = 1)
        },
        prepareSlides = function(a, b) {
            if (a.find(".tp-caption").each(function() {
                    var a = jQuery(this);
                    a.data("transition") !== undefined && a.addClass(a.data("transition"))
                }), b.ul.css({
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    maxHeight: a.parent().css("maxHeight")
                }), "on" == b.autoHeight && (b.ul.css({
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    maxHeight: "none"
                }), a.css({
                    maxHeight: "none"
                }), a.parent().css({
                    maxHeight: "none"
                })), b.allli.each(function(a) {
                    var c = jQuery(this),
                        d = c.data("originalindex");
                    (b.startWithSlide != undefined && d == b.startWithSlide || b.startWithSlide === undefined && 0 == a) && c.addClass("next-revslide"), c.css({
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                    })
                }), "carousel" === b.sliderType) {
                b.ul.css({
                    overflow: "visible"
                }).wrap('<div class="tp-carousel-wrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden;"></div>');
                var c = '<div style="clear:both;display:block;width:100%;height:1px;position:relative;margin-bottom:-1px"></div>';
                b.c.parent().prepend(c), b.c.parent().append(c), _R.prepareCarousel(b)
            }
            a.parent().css({
                overflow: "visible"
            }), b.allli.find(">img").each(function(a) {
                var c = jQuery(this),
                    d = c.closest("li"),
                    e = d.find(".rs-background-video-layer");
                e.addClass("defaultvid").css({
                    zIndex: 30
                }), c.addClass("defaultimg"), "on" == b.fallbacks.panZoomDisableOnMobile && _ISM && (c.data("kenburns", "off"), c.data("bgfit", "cover"));
                var f = d.data("mediafilter");
                f = "none" === f || f === undefined ? "" : f, c.wrap('<div class="slotholder" style="position:absolute; top:0px; left:0px; z-index:0;width:100%;height:100%;"></div>'), e.appendTo(d.find(".slotholder"));
                var g = c.data();
                c.closest(".slotholder").data(g), e.length > 0 && g.bgparallax != undefined && (e.data("bgparallax", g.bgparallax), e.data("showcoveronpause", "on")), "none" != b.dottedOverlay && b.dottedOverlay != undefined && c.closest(".slotholder").append('<div class="tp-dottedoverlay ' + b.dottedOverlay + '"></div>');
                var h = c.attr("src");
                g.src = h, g.bgfit = g.bgfit || "cover", g.bgrepeat = g.bgrepeat || "no-repeat", g.bgposition = g.bgposition || "center center";
                var j = (c.closest(".slotholder"), c.data("bgcolor")),
                    k = "";
                k = j !== undefined && j.indexOf("gradient") >= 0 ? '"background:' + j + ';width:100%;height:100%;"' : '"background-color:' + j + ";background-repeat:" + g.bgrepeat + ";background-image:url(' ');background-size:" + g.bgfit + ";background-position:" + g.bgposition + ';width:100%;height:100%;"', c.data("mediafilter", f), f = "on" === c.data("kenburns") ? "" : f;
                var l = jQuery('<div class="tp-bgimg defaultimg ' + f + '" data-bgcolor="' + j + '" style=' + k + "></div>");
                c.parent().append(l);
                var m = document.createComment("Runtime Modification - Img tag is Still Available for SEO Goals in Source - " + c.get(0).outerHTML);
                c.replaceWith(m), l.data(g), l.attr("src", h), "standard" !== b.sliderType && "undefined" !== b.sliderType || l.css({
                    opacity: 0
                })
            }), b.scrolleffect.on && "on" === b.scrolleffect.on_slidebg && (b.allslotholder = new Array, b.allli.find(".slotholder").each(function() {
                jQuery(this).wrap('<div style="display:block;position:absolute;top:0px;left:0px;width:100%;height:100%" class="slotholder_fadeoutwrap"></div>')
            }), b.allslotholder = b.c.find(".slotholder_fadeoutwrap"))
        },
        removeSlots = function(a, b, c, d) {
            b.removePrepare = b.removePrepare + d, c.find(".slot, .slot-circle-wrapper").each(function() {
                jQuery(this).remove()
            }), b.transition = 0, b.removePrepare = 0
        },
        cutParams = function(a) {
            var b = a;
            return a != undefined && a.length > 0 && (b = a.split("?")[0]), b
        },
        relativeRedir = function(a) {
            return location.pathname.replace(/(.*)\/[^\/]*/, "$1/" + a)
        },
        abstorel = function(a, b) {
            var c = a.split("/"),
                d = b.split("/");
            c.pop();
            for (var e = 0; e < d.length; e++) "." != d[e] && (".." == d[e] ? c.pop() : c.push(d[e]));
            return c.join("/")
        },
        imgLoaded = function(a, b, c) {
            b.syncload--, b.loadqueue && jQuery.each(b.loadqueue, function(b, d) {
                var e = d.src.replace(/\.\.\/\.\.\//gi, ""),
                    f = self.location.href,
                    g = document.location.origin,
                    h = f.substring(0, f.length - 1) + "/" + e,
                    i = g + "/" + e,
                    j = abstorel(self.location.href, d.src);
                f = f.substring(0, f.length - 1) + e, g += e, (cutParams(g) === cutParams(decodeURIComponent(a.src)) || cutParams(f) === cutParams(decodeURIComponent(a.src)) || cutParams(j) === cutParams(decodeURIComponent(a.src)) || cutParams(i) === cutParams(decodeURIComponent(a.src)) || cutParams(h) === cutParams(decodeURIComponent(a.src)) || cutParams(d.src) === cutParams(decodeURIComponent(a.src)) || cutParams(d.src).replace(/^.*\/\/[^\/]+/, "") === cutParams(decodeURIComponent(a.src)).replace(/^.*\/\/[^\/]+/, "") || "file://" === window.location.origin && cutParams(a.src).match(new RegExp(e))) && (d.progress = c, d.width = a.width, d.height = a.height)
            }), progressImageLoad(b)
        },
        progressImageLoad = function(a) {
            3 != a.syncload && a.loadqueue && jQuery.each(a.loadqueue, function(b, c) {
                if (c.progress.match(/prepared/g) && a.syncload <= 3) {
                    if (a.syncload++, "img" == c.type) {
                        var d = new Image;
                        d.onload = function() {
                            imgLoaded(this, a, "loaded"), c.error = !1
                        }, d.onerror = function() {
                            imgLoaded(this, a, "failed"), c.error = !0
                        }, d.src = c.src
                    } else jQuery.get(c.src, function(b) {
                        c.innerHTML = (new XMLSerializer).serializeToString(b.documentElement), c.progress = "loaded", a.syncload--, progressImageLoad(a)
                    }).fail(function() {
                        c.progress = "failed", a.syncload--, progressImageLoad(a)
                    });
                    c.progress = "inload"
                }
            })
        },
        addToLoadQueue = function(a, b, c, d, e) {
            var f = !1;
            if (b.loadqueue && jQuery.each(b.loadqueue, function(b, c) {
                    c.src === a && (f = !0)
                }), !f) {
                var g = new Object;
                g.src = a, g.starttoload = jQuery.now(), g.type = d || "img", g.prio = c, g.progress = "prepared", g.static = e, b.loadqueue.push(g)
            }
        },
        loadImages = function(a, b, c, d) {
            a.find("img,.defaultimg, .tp-svg-layer").each(function() {
                var a = jQuery(this),
                    e = a.data("lazyload") !== undefined && "undefined" !== a.data("lazyload") ? a.data("lazyload") : a.data("svg_src") != undefined ? a.data("svg_src") : a.attr("src"),
                    f = a.data("svg_src") != undefined ? "svg" : "img";
                a.data("start-to-load", jQuery.now()), addToLoadQueue(e, b, c, f, d)
            }), progressImageLoad(b)
        },
        getLoadObj = function(a, b) {
            var c = new Object;
            return a.loadqueue && jQuery.each(a.loadqueue, function(a, d) {
                d.src == b && (c = d)
            }), c
        },
        waitForCurrentImages = function(a, b, c) {
            var d = !1;
            a.find("img,.defaultimg, .tp-svg-layer").each(function() {
                var c = jQuery(this),
                    e = c.data("lazyload") != undefined ? c.data("lazyload") : c.data("svg_src") != undefined ? c.data("svg_src") : c.attr("src"),
                    f = getLoadObj(b, e);
                if (c.data("loaded") === undefined && f !== undefined && f.progress && f.progress.match(/loaded/g)) {
                    if (c.attr("src", f.src), "img" == f.type)
                        if (c.hasClass("defaultimg")) _R.isIE(8) ? defimg.attr("src", f.src) : -1 == f.src.indexOf("images/transparent.png") && -1 == f.src.indexOf("assets/transparent.png") || c.data("bgcolor") === undefined ? c.css({
                            backgroundImage: 'url("' + f.src + '")'
                        }) : c.data("bgcolor") !== undefined && c.css({
                            background: c.data("bgcolor")
                        }), a.data("owidth", f.width), a.data("oheight", f.height), a.find(".slotholder").data("owidth", f.width), a.find(".slotholder").data("oheight", f.height);
                        else {
                            var g = c.data("ww"),
                                h = c.data("hh");
                            c.data("owidth", f.width), c.data("oheight", f.height), g = g == undefined || "auto" == g || "" == g ? f.width : g, h = h == undefined || "auto" == h || "" == h ? f.height : h, !jQuery.isNumeric(g) && g.indexOf("%") > 0 && (h = g), c.data("ww", g), c.data("hh", h)
                        }
                    else "svg" == f.type && "loaded" == f.progress && (c.append('<div class="tp-svg-innercontainer"></div>'), c.find(".tp-svg-innercontainer").append(f.innerHTML));
                    c.data("loaded", !0)
                }
                if (f && f.progress && f.progress.match(/inprogress|inload|prepared/g) && (!f.error && jQuery.now() - c.data("start-to-load") < 5e3 ? d = !0 : (f.progress = "failed", f.reported_img || (f.reported_img = !0, console.warn(e + "  Could not be loaded !")))), 1 == b.youtubeapineeded && (!window.YT || YT.Player == undefined) && (d = !0, jQuery.now() - b.youtubestarttime > 5e3 && 1 != b.youtubewarning)) {
                    b.youtubewarning = !0;
                    var i = "YouTube Api Could not be loaded !";
                    "https:" === location.protocol && (i += " Please Check and Renew SSL Certificate !"), console.error(i), b.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>' + i + "</strong></div>")
                }
                if (1 == b.vimeoapineeded && !window.Froogaloop && (d = !0, jQuery.now() - b.vimeostarttime > 5e3 && 1 != b.vimeowarning)) {
                    b.vimeowarning = !0;
                    var i = "Vimeo Froogaloop Api Could not be loaded !";
                    "https:" === location.protocol && (i += " Please Check and Renew SSL Certificate !"), console.error(i), b.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>' + i + "</strong></div>")
                }
            }), !_ISM && b.audioqueue && b.audioqueue.length > 0 && jQuery.each(b.audioqueue, function(a, b) {
                b.status && "prepared" === b.status && jQuery.now() - b.start < b.waittime && (d = !0)
            }), jQuery.each(b.loadqueue, function(a, b) {
                !0 !== b.static || "loaded" == b.progress && "failed" !== b.progress || ("failed" == b.progress ? b.reported || (b.reported = !0, console.warn("Static Image " + b.src + "  Could not be loaded in time. Error Exists:" + b.error)) : !b.error && jQuery.now() - b.starttoload < 5e3 ? d = !0 : b.reported || (b.reported = !0, console.warn("Static Image " + b.src + "  Could not be loaded within 5s! Error Exists:" + b.error)))
            }), d ? punchgs.TweenLite.delayedCall(.18, waitForCurrentImages, [a, b, c]) : punchgs.TweenLite.delayedCall(.18, c)
        },
        swapSlide = function(a) {
            var b = a[0].opt;
            if (clearTimeout(b.waitWithSwapSlide), a.find(".processing-revslide").length > 0) return b.waitWithSwapSlide = setTimeout(function() {
                swapSlide(a)
            }, 150), !1;
            var c = a.find(".active-revslide"),
                d = a.find(".next-revslide"),
                e = d.find(".defaultimg");
            if ("carousel" !== b.sliderType || b.carousel.fadein || (punchgs.TweenLite.to(b.ul, 1, {
                    opacity: 1
                }), b.carousel.fadein = !0), d.index() === c.index() && !0 !== b.onlyPreparedSlide) return d.removeClass("next-revslide"), !1;
            !0 === b.onlyPreparedSlide && (b.onlyPreparedSlide = !1, jQuery(b.li[0]).addClass("processing-revslide")), d.removeClass("next-revslide").addClass("processing-revslide"), -1 === d.index() && "carousel" === b.sliderType && (d = jQuery(b.li[0])), d.data("slide_on_focus_amount", d.data("slide_on_focus_amount") + 1 || 1), "on" == b.stopLoop && d.index() == b.lastslidetoshow - 1 && (a.find(".tp-bannertimer").css({
                visibility: "hidden"
            }), a.trigger("revolution.slide.onstop"), b.noloopanymore = 1), d.index() === b.slideamount - 1 && (b.looptogo = b.looptogo - 1, b.looptogo <= 0 && (b.stopLoop = "on")), b.tonpause = !0, a.trigger("stoptimer"), b.cd = 0, "off" === b.spinner && (b.loader !== undefined ? b.loader.css({
                display: "none"
            }) : b.loadertimer = setTimeout(function() {
                b.loader !== undefined && b.loader.css({
                    display: "block"
                })
            }, 50)), loadImages(d, b, 1), _R.preLoadAudio && _R.preLoadAudio(d, b, 1), waitForCurrentImages(d, b, function() {
                d.find(".rs-background-video-layer").each(function() {
                    var a = jQuery(this);
                    a.hasClass("HasListener") || (a.data("bgvideo", 1), _R.manageVideoLayer && _R.manageVideoLayer(a, b)), 0 == a.find(".rs-fullvideo-cover").length && a.append('<div class="rs-fullvideo-cover"></div>')
                }), swapSlideProgress(e, a)
            })
        },
        swapSlideProgress = function(a, b) {
            var c = b.find(".active-revslide"),
                d = b.find(".processing-revslide"),
                e = c.find(".slotholder"),
                f = d.find(".slotholder"),
                g = b[0].opt;
            g.tonpause = !1, g.cd = 0, clearTimeout(g.loadertimer), g.loader !== undefined && g.loader.css({
                display: "none"
            }), _R.setSize(g), _R.slotSize(a, g), _R.manageNavigation && _R.manageNavigation(g);
            var h = {};
            h.nextslide = d, h.currentslide = c, b.trigger("revolution.slide.onbeforeswap", h), g.transition = 1, g.videoplaying = !1, d.data("delay") != undefined ? (g.cd = 0, g.delay = d.data("delay")) : g.delay = g.origcd, "true" == d.data("ssop") || !0 === d.data("ssop") ? g.ssop = !0 : g.ssop = !1, b.trigger("nulltimer");
            var i = c.index(),
                j = d.index();
            g.sdir = j < i ? 1 : 0, "arrow" == g.sc_indicator && (0 == i && j == g.slideamount - 1 && (g.sdir = 1), i == g.slideamount - 1 && 0 == j && (g.sdir = 0)), g.lsdir = g.lsdir === undefined ? g.sdir : g.lsdir, g.dirc = g.lsdir != g.sdir, g.lsdir = g.sdir, c.index() != d.index() && 1 != g.firststart && _R.removeTheCaptions && _R.removeTheCaptions(c, g), d.hasClass("rs-pause-timer-once") || d.hasClass("rs-pause-timer-always") ? g.videoplaying = !0 : b.trigger("restarttimer"), d.removeClass("rs-pause-timer-once");
            var k, m;
            if (g.currentSlide = c.index(), g.nextSlide = d.index(), "carousel" == g.sliderType) m = new punchgs.TimelineLite, _R.prepareCarousel(g, m), letItFree(b, f, e, d, c, m), g.transition = 0, g.firststart = 0;
            else {
                m = new punchgs.TimelineLite({
                    onComplete: function() {
                        letItFree(b, f, e, d, c, m)
                    }
                }), m.add(punchgs.TweenLite.set(f.find(".defaultimg"), {
                    opacity: 0
                })), m.pause(), _R.animateTheCaptions && _R.animateTheCaptions({
                    slide: d,
                    opt: g,
                    preset: !0
                }), 1 == g.firststart && (punchgs.TweenLite.set(c, {
                    autoAlpha: 0
                }), g.firststart = 0), punchgs.TweenLite.set(c, {
                    zIndex: 18
                }), punchgs.TweenLite.set(d, {
                    autoAlpha: 0,
                    zIndex: 20
                }), "prepared" == d.data("differentissplayed") && (d.data("differentissplayed", "done"), d.data("transition", d.data("savedtransition")), d.data("slotamount", d.data("savedslotamount")), d.data("masterspeed", d.data("savedmasterspeed"))), d.data("fstransition") != undefined && "done" != d.data("differentissplayed") && (d.data("savedtransition", d.data("transition")), d.data("savedslotamount", d.data("slotamount")), d.data("savedmasterspeed", d.data("masterspeed")), d.data("transition", d.data("fstransition")), d.data("slotamount", d.data("fsslotamount")), d.data("masterspeed", d.data("fsmasterspeed")), d.data("differentissplayed", "prepared")), d.data("transition") == undefined && d.data("transition", "random"), k = 0;
                var n = d.data("transition") !== undefined ? d.data("transition").split(",") : "fade",
                    o = d.data("nexttransid") == undefined ? -1 : d.data("nexttransid");
                "on" == d.data("randomtransition") ? o = Math.round(Math.random() * n.length) : o += 1, o == n.length && (o = 0), d.data("nexttransid", o);
                var p = n[o];
                g.ie && ("boxfade" == p && (p = "boxslide"), "slotfade-vertical" == p && (p = "slotzoom-vertical"), "slotfade-horizontal" == p && (p = "slotzoom-horizontal")), _R.isIE(8) && (p = 11), m = _R.animateSlide(k, p, b, d, c, f, e, m), "on" == f.data("kenburns") && (_R.startKenBurn(f, g), m.add(punchgs.TweenLite.set(f, {
                    autoAlpha: 0
                }))), m.pause()
            }
            _R.scrollHandling && (_R.scrollHandling(g, !0, 0), m.eventCallback("onUpdate", function() {
                _R.scrollHandling(g, !0, 0)
            })), "off" != g.parallax.type && g.parallax.firstgo == undefined && _R.scrollHandling && (g.parallax.firstgo = !0, g.lastscrolltop = -999, _R.scrollHandling(g, !0, 0), setTimeout(function() {
                g.lastscrolltop = -999, _R.scrollHandling(g, !0, 0)
            }, 210), setTimeout(function() {
                g.lastscrolltop = -999, _R.scrollHandling(g, !0, 0)
            }, 420)), _R.animateTheCaptions ? "carousel" === g.sliderType && "on" === g.carousel.showLayersAllTime ? (jQuery.each(g.li, function(a) {
                g.carousel.allLayersStarted ? _R.animateTheCaptions({
                    slide: jQuery(g.li[a]),
                    opt: g,
                    recall: !0
                }) : g.li[a] === d ? _R.animateTheCaptions({
                    slide: jQuery(g.li[a]),
                    maintimeline: m,
                    opt: g,
                    startslideanimat: 0
                }) : _R.animateTheCaptions({
                    slide: jQuery(g.li[a]),
                    opt: g,
                    startslideanimat: 0
                })
            }), g.carousel.allLayersStarted = !0) : _R.animateTheCaptions({
                slide: d,
                opt: g,
                maintimeline: m,
                startslideanimat: 0
            }) : m != undefined && setTimeout(function() {
                m.resume()
            }, 30), punchgs.TweenLite.to(d, .001, {
                autoAlpha: 1
            })
        },
        letItFree = function(a, b, c, d, e, f) {
            var g = a[0].opt;
            "carousel" === g.sliderType || (g.removePrepare = 0, punchgs.TweenLite.to(b.find(".defaultimg"), .001, {
                zIndex: 20,
                autoAlpha: 1,
                onComplete: function() {
                    removeSlots(a, g, d, 1)
                }
            }), d.index() != e.index() && punchgs.TweenLite.to(e, .2, {
                zIndex: 18,
                autoAlpha: 0,
                onComplete: function() {
                    removeSlots(a, g, e, 1)
                }
            })), a.find(".active-revslide").removeClass("active-revslide"), a.find(".processing-revslide").removeClass("processing-revslide").addClass("active-revslide"), g.act = d.index(), g.c.attr("data-slideactive", a.find(".active-revslide").data("index")), "scroll" != g.parallax.type && "scroll+mouse" != g.parallax.type && "mouse+scroll" != g.parallax.type || (g.lastscrolltop = -999, _R.scrollHandling(g)), f.clear(), c.data("kbtl") != undefined && (c.data("kbtl").reverse(), c.data("kbtl").timeScale(25)), "on" == b.data("kenburns") && (b.data("kbtl") != undefined ? (b.data("kbtl").timeScale(1), b.data("kbtl").play()) : _R.startKenBurn(b, g)), d.find(".rs-background-video-layer").each(function(a) {
                if (_ISM && !g.fallbacks.allowHTML5AutoPlayOnAndroid) return !1;
                var b = jQuery(this);
                _R.resetVideo(b, g), punchgs.TweenLite.fromTo(b, 1, {
                    autoAlpha: 0
                }, {
                    autoAlpha: 1,
                    ease: punchgs.Power3.easeInOut,
                    delay: .2,
                    onComplete: function() {
                        _R.animcompleted && _R.animcompleted(b, g)
                    }
                })
            }), e.find(".rs-background-video-layer").each(function(a) {
                if (_ISM) return !1;
                var b = jQuery(this);
                _R.stopVideo && (_R.resetVideo(b, g), _R.stopVideo(b, g)), punchgs.TweenLite.to(b, 1, {
                    autoAlpha: 0,
                    ease: punchgs.Power3.easeInOut,
                    delay: .2
                })
            });
            var h = {};
            if (h.slideIndex = d.index() + 1, h.slideLIIndex = d.index(), h.slide = d, h.currentslide = d, h.prevslide = e, g.last_shown_slide = e.index(), a.trigger("revolution.slide.onchange", h), a.trigger("revolution.slide.onafterswap", h), g.startWithSlide !== undefined && "done" !== g.startWithSlide && "carousel" === g.sliderType) {
                for (var i = g.startWithSlide, j = 0; j <= g.li.length - 1; j++) {
                    jQuery(g.li[j]).data("originalindex") === g.startWithSlide && (i = j)
                }
                0 !== i && _R.callingNewSlide(g.c, i), g.startWithSlide = "done"
            }
            g.duringslidechange = !1;
            var l = e.data("slide_on_focus_amount"),
                m = e.data("hideafterloop");
            0 != m && m <= l && g.c.revremoveslide(e.index());
            var n = -1 === g.nextSlide || g.nextSlide === undefined ? 0 : g.nextSlide;
            g.rowzones != undefined && (n = n > g.rowzones.length ? g.rowzones.length : n), g.rowzones != undefined && g.rowzones.length > 0 && g.rowzones[n] != undefined && n >= 0 && n <= g.rowzones.length && g.rowzones[n].length > 0 && _R.setSize(g)
        },
        removeAllListeners = function(a, b) {
            a.children().each(function() {
                try {
                    jQuery(this).die("click")
                } catch (a) {}
                try {
                    jQuery(this).die("mouseenter")
                } catch (a) {}
                try {
                    jQuery(this).die("mouseleave")
                } catch (a) {}
                try {
                    jQuery(this).unbind("hover")
                } catch (a) {}
            });
            try {
                a.die("click", "mouseenter", "mouseleave")
            } catch (a) {}
            clearInterval(b.cdint), a = null
        },
        countDown = function(a, b) {
            b.cd = 0, b.loop = 0, b.stopAfterLoops != undefined && b.stopAfterLoops > -1 ? b.looptogo = b.stopAfterLoops : b.looptogo = 9999999, b.stopAtSlide != undefined && b.stopAtSlide > -1 ? b.lastslidetoshow = b.stopAtSlide : b.lastslidetoshow = 999, b.stopLoop = "off", 0 == b.looptogo && (b.stopLoop = "on");
            var c = a.find(".tp-bannertimer");
            a.on("stoptimer", function() {
                var a = jQuery(this).find(".tp-bannertimer");
                a[0].tween.pause(), "on" == b.disableProgressBar && a.css({
                    visibility: "hidden"
                }), b.sliderstatus = "paused", _R.unToggleState(b.slidertoggledby)
            }), a.on("starttimer", function() {
                b.forcepause_viatoggle || (1 != b.conthover && 1 != b.videoplaying && b.width > b.hideSliderAtLimit && 1 != b.tonpause && 1 != b.overnav && 1 != b.ssop && (1 === b.noloopanymore || b.viewPort.enable && !b.inviewport || (c.css({
                    visibility: "visible"
                }), c[0].tween.resume(), b.sliderstatus = "playing")), "on" == b.disableProgressBar && c.css({
                    visibility: "hidden"
                }), _R.toggleState(b.slidertoggledby))
            }), a.on("restarttimer", function() {
                if (!b.forcepause_viatoggle) {
                    var a = jQuery(this).find(".tp-bannertimer");
                    if (b.mouseoncontainer && "on" == b.navigation.onHoverStop && !_ISM) return !1;
                    1 === b.noloopanymore || b.viewPort.enable && !b.inviewport || 1 == b.ssop || (a.css({
                        visibility: "visible"
                    }), a[0].tween.kill(), a[0].tween = punchgs.TweenLite.fromTo(a, b.delay / 1e3, {
                        width: "0%"
                    }, {
                        force3D: "auto",
                        width: "100%",
                        ease: punchgs.Linear.easeNone,
                        onComplete: d,
                        delay: 1
                    }), b.sliderstatus = "playing"), "on" == b.disableProgressBar && a.css({
                        visibility: "hidden"
                    }), _R.toggleState(b.slidertoggledby)
                }
            }), a.on("nulltimer", function() {
                c[0].tween.kill(), c[0].tween = punchgs.TweenLite.fromTo(c, b.delay / 1e3, {
                    width: "0%"
                }, {
                    force3D: "auto",
                    width: "100%",
                    ease: punchgs.Linear.easeNone,
                    onComplete: d,
                    delay: 1
                }), c[0].tween.pause(0), "on" == b.disableProgressBar && c.css({
                    visibility: "hidden"
                }), b.sliderstatus = "paused"
            });
            var d = function() {
                0 == jQuery("body").find(a).length && (removeAllListeners(a, b), clearInterval(b.cdint)), a.trigger("revolution.slide.slideatend"), 1 == a.data("conthover-changed") && (b.conthover = a.data("conthover"), a.data("conthover-changed", 0)), _R.callingNewSlide(a, 1)
            };
            c[0].tween = punchgs.TweenLite.fromTo(c, b.delay / 1e3, {
                width: "0%"
            }, {
                force3D: "auto",
                width: "100%",
                ease: punchgs.Linear.easeNone,
                onComplete: d,
                delay: 1
            }), b.slideamount > 1 && (0 != b.stopAfterLoops || 1 != b.stopAtSlide) ? a.trigger("starttimer") : (b.noloopanymore = 1, a.trigger("nulltimer")), a.on("tp-mouseenter", function() {
                b.mouseoncontainer = !0, "on" != b.navigation.onHoverStop || _ISM || (a.trigger("stoptimer"), a.trigger("revolution.slide.onpause"))
            }), a.on("tp-mouseleft", function() {
                b.mouseoncontainer = !1, 1 != a.data("conthover") && "on" == b.navigation.onHoverStop && (1 == b.viewPort.enable && b.inviewport || 0 == b.viewPort.enable) && (a.trigger("revolution.slide.onresume"), a.trigger("starttimer"))
            })
        },
        vis = function() {
            var a, b, c = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };
            for (a in c)
                if (a in document) {
                    b = c[a];
                    break
                }
            return function(c) {
                return c && document.addEventListener(b, c, {
                    pasive: !0
                }), !document[a]
            }
        }(),
        restartOnFocus = function() {
            jQuery(".rev_redraw_on_blurfocus").each(function() {
                var a = jQuery(this)[0].opt;
                if (a == undefined || a.c == undefined || 0 === a.c.length) return !1;
                1 != a.windowfocused && (a.windowfocused = !0, punchgs.TweenLite.delayedCall(.3, function() {
                    "on" == a.fallbacks.nextSlideOnWindowFocus && a.c.revnext(), a.c.revredraw(), "playing" == a.lastsliderstatus && a.c.revresume()
                }))
            })
        },
        lastStatBlur = function() {
            jQuery(".rev_redraw_on_blurfocus").each(function() {
                var a = jQuery(this)[0].opt;
                a.windowfocused = !1, a.lastsliderstatus = a.sliderstatus, a.c.revpause();
                var b = a.c.find(".active-revslide .slotholder"),
                    c = a.c.find(".processing-revslide .slotholder");
                "on" == c.data("kenburns") && _R.stopKenBurn(c, a), "on" == b.data("kenburns") && _R.stopKenBurn(b, a)
            })
        },
        tabBlurringCheck = function() {
            var a = document.documentMode === undefined,
                b = window.chrome;
            1 !== jQuery("body").data("revslider_focus_blur_listener") && (jQuery("body").data("revslider_focus_blur_listener", 1), a && !b ? jQuery(window).on("focusin", function() {
                restartOnFocus()
            }).on("focusout", function() {
                lastStatBlur()
            }) : window.addEventListener ? (window.addEventListener("focus", function(a) {
                restartOnFocus()
            }, {
                capture: !1,
                passive: !0
            }), window.addEventListener("blur", function(a) {
                lastStatBlur()
            }, {
                capture: !1,
                passive: !0
            })) : (window.attachEvent("focus", function(a) {
                restartOnFocus()
            }), window.attachEvent("blur", function(a) {
                lastStatBlur()
            })))
        },
        getUrlVars = function(a) {
            for (var c, b = [], d = window.location.href.slice(window.location.href.indexOf(a) + 1).split("_"), e = 0; e < d.length; e++) d[e] = d[e].replace("%3D", "="), c = d[e].split("="), b.push(c[0]), b[c[0]] = c[1];
            return b
        }
}(jQuery);


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
                                c: jQuery('#rev_slider_55_1'),
                                responsiveLevels: [1240, 1024, 778, 480],
                                gridwidth: [1280, 1024, 778, 480],
                                gridheight: [1165, 768, 960, 720],
                                sliderLayout: 'fullwidth'
                            });

                            var revapi55,
                                    tpj = jQuery;

                            tpj(document).ready(function () {
                                if (tpj("#rev_slider_55_1").revolution == undefined) {
                                    revslider_showDoubleJqueryError("#rev_slider_55_1");
                                } else {
                                    revapi55 = tpj("#rev_slider_55_1").show().revolution({
                                        sliderType: "standard",
                                        jsFileLocation: "//codex-themes.com/thegem/wp-content/plugins/revslider/public/assets/js/",
                                        sliderLayout: "fullwidth",
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
                                                enable: true,
                                                hide_onmobile: false,
                                                hide_onleave: true,
                                                hide_delay: 200,
                                                hide_delay_mobile: 1200,
                                                tmp: '',
                                                left: {
                                                    h_align: "left",
                                                    v_align: "center",
                                                    h_offset: 20,
                                                    v_offset: -100
                                                },
                                                right: {
                                                    h_align: "right",
                                                    v_align: "center",
                                                    h_offset: 20,
                                                    v_offset: -100
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
                                                space: 5,
                                                tmp: '<span class="tp-bullet-inner"></span>'
                                            }
                                        },
                                        responsiveLevels: [1240, 1024, 778, 480],
                                        visibilityLevels: [1240, 1024, 778, 480],
                                        gridwidth: [1280, 1024, 778, 480],
                                        gridheight: [1165, 768, 960, 720],
                                        lazyType: "none",
                                        parallax: {
                                            type: "3D",
                                            origo: "slidercenter",
                                            speed: 600,
                                            speedbg: 0,
                                            speedls: 0,
                                            levels: [-5, -3, -1, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 50, 0, -30],
                                            ddd_shadow: "on",
                                            ddd_bgfreeze: "on",
                                            ddd_overflow: "visible",
                                            ddd_layer_overflow: "visible",
                                            ddd_z_correction: 100,
                                            disable_onmobile: "on"
                                        },
                                        spinner: "spinner2",
                                        stopLoop: "off",
                                        stopAfterLoops: -1,
                                        stopAtSlide: -1,
                                        shuffle: "off",
                                        autoHeight: "off",
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
                            
                            
                             var htmlDivCss = ' #rev_slider_55_1_wrapper .tp-loader.spinner2{ background-color: #2c2e3d !important; } ';
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
                            
                             var htmlDivCss = unescape("%23rev_slider_55_1%20.uranus.tparrows%20%7B%0A%20%20width%3A50px%3B%0A%20%20height%3A50px%3B%0A%20%20background%3Argba%28255%2C255%2C255%2C0%29%3B%0A%20%7D%0A%20%23rev_slider_55_1%20.uranus.tparrows%3Abefore%20%7B%0A%20width%3A50px%3B%0A%20height%3A50px%3B%0A%20line-height%3A50px%3B%0A%20font-size%3A40px%3B%0A%20transition%3Aall%200.3s%3B%0A-webkit-transition%3Aall%200.3s%3B%0A%20%7D%0A%20%0A%20%20%23rev_slider_55_1%20.uranus.tparrows%3Ahover%3Abefore%20%7B%0A%20%20%20%20opacity%3A0.75%3B%0A%20%20%7D%0A%23rev_slider_55_1%20.uranus%20.tp-bullet%7B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20box-shadow%3A%200%200%200%202px%20rgba%28255%2C%20255%2C%20255%2C%200%29%3B%0A%20%20-webkit-transition%3A%20box-shadow%200.3s%20ease%3B%0A%20%20transition%3A%20box-shadow%200.3s%20ease%3B%0A%20%20background%3Atransparent%3B%0A%20%20width%3A15px%3B%0A%20%20height%3A15px%3B%0A%7D%0A%23rev_slider_55_1%20.uranus%20.tp-bullet.selected%2C%0A%23rev_slider_55_1%20.uranus%20.tp-bullet%3Ahover%20%7B%0A%20%20box-shadow%3A%200%200%200%202px%20rgba%28255%2C%20255%2C%20255%2C1%29%3B%0A%20%20border%3Anone%3B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20background%3Atransparent%3B%0A%7D%0A%0A%23rev_slider_55_1%20.uranus%20.tp-bullet-inner%20%7B%0A%20%20-webkit-transition%3A%20background-color%200.3s%20ease%2C%20-webkit-transform%200.3s%20ease%3B%0A%20%20transition%3A%20background-color%200.3s%20ease%2C%20transform%200.3s%20ease%3B%0A%20%20top%3A%200%3B%0A%20%20left%3A%200%3B%0A%20%20width%3A%20100%25%3B%0A%20%20height%3A%20100%25%3B%0A%20%20outline%3A%20none%3B%0A%20%20border-radius%3A%2050%25%3B%0A%20%20background-color%3A%20rgb%28255%2C%20255%2C%20255%29%3B%0A%20%20background-color%3A%20rgba%28255%2C%20255%2C%20255%2C%200.3%29%3B%0A%20%20text-indent%3A%20-999em%3B%0A%20%20cursor%3A%20pointer%3B%0A%20%20position%3A%20absolute%3B%0A%7D%0A%0A%23rev_slider_55_1%20.uranus%20.tp-bullet.selected%20.tp-bullet-inner%2C%0A%23rev_slider_55_1%20.uranus%20.tp-bullet%3Ahover%20.tp-bullet-inner%7B%0A%20transform%3A%20scale%280.4%29%3B%0A%20-webkit-transform%3A%20scale%280.4%29%3B%0A%20background-color%3Argb%28255%2C%20255%2C%20255%29%3B%0A%7D%0A");
                            var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
                            if (htmlDiv) {
                                htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
                            } else {
                                var htmlDiv = document.createElement('div');
                                htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
                                document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
                            }
                            
                            
                           
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
            var column_width = parseFloat(new_megamenu_width - columns * parseInt($(' > li:first', $item).css('margin-left'))) / columns;
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
                xhr.open('../product/get-hot-outside/index.html', url_root);
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
//                self.scrollHandler();
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
//        scrollHandler: function() {
//            var self = this,
//                scrollY = this.getScrollY();
//            if (scrollY >= this.options.startTop) {
//                if (!this.$el.hasClass('shrink')) {
//                    var shrinkClass = 'shrink fixed';
//                    if (window.gemSettings.fillTopArea) {
//                        shrinkClass += ' fill';
//                    }
//                    this.$el.addClass(shrinkClass)
//                }
//                var top = 0;
//                if (this.hasAdminBar) {
//                    top += this.adminBarOffset;
//                }
//                if (this.$page[0].scrollTop > 0) {
//                    top += this.$page[0].scrollTop;
//                }
//                this.$el.css({
//                    top: top != 0 ? top : ''
//                });
//            } else {
//                if (this.$el.hasClass('shrink')) {
//                    this.$el.removeClass('shrink fixed')
//                }
//                if (this.hasAdminBar) {
//                    this.$el.css({
//                        top: ''
//                    });
//                }
//            }
//            if (this.isResponsive && !this.$wrapper.hasClass('sticky-header-on-mobile')) {
//                if (!$('.mobile-menu-slide-wrapper.opened').length && !$('#primary-menu.dl-menuopen').length && !$('.menu-overlay.active').length) {
//                    if (scrollY - this.oldScrollY > 0 && scrollY > 300 && !this.$el.hasClass('hidden')) {
//                        self.$el.addClass('hidden');
//                    }
//                    if (scrollY - this.oldScrollY < 0 && this.$el.hasClass('hidden')) {
//                        self.$el.removeClass('hidden');
//                    }
//                } else {
//                    self.$el.removeClass('hidden');
//                }
//            }
//            this.oldScrollY = scrollY;
//        },
//        getScrollY: function() {
//            return window.pageYOffset || document.documentElement.scrollTop + this.$page[0].scrollTop;
//        },
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
/*
jQuery Waypoints - v2.0.2
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function() {
    var t = [].indexOf || function(t) {
            for (var e = 0, n = this.length; e < n; e++) {
                if (e in this && this[e] === t) return e
            }
            return -1
        },
        e = [].slice;
    (function(t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", ["jquery"], function(n) {
                return e(n, t)
            })
        } else {
            return e(t.jQuery, t)
        }
    })(this, function(n, r) {
        var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
        i = n(r);
        c = t.call(r, "ontouchstart") >= 0;
        s = {
            horizontal: {},
            vertical: {}
        };
        f = 1;
        a = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function() {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {
                    x: t.scrollLeft(),
                    y: t.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                t.data(u, this.id);
                a[this.id] = this;
                t.bind(y, function() {
                    var t;
                    if (!(e.didScroll || c)) {
                        e.didScroll = true;
                        t = function() {
                            e.doScroll();
                            return e.didScroll = false
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle)
                    }
                });
                t.bind(p, function() {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function() {
                            n[m]("refresh");
                            return e.didResize = false
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle)
                    }
                })
            }
            t.prototype.doScroll = function() {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh")
                }
                n.each(t, function(t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function(t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e)
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e)
                        }
                    });
                    l.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    if (!o) {
                        l.reverse()
                    }
                    return n.each(l, function(t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([i])
                        }
                    })
                });
                return this.oldScroll = {
                    x: t.horizontal.newScroll,
                    y: t.vertical.newScroll
                }
            };
            t.prototype.refresh = function() {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function(t, e) {
                    return n.each(i.waypoints[t], function(t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element)
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100)
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([e.backward])
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([e.forward])
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([e.forward])
                        }
                    })
                })
            };
            t.prototype.checkEmpty = function() {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([p, y].join(" "));
                    return delete a[this.id]
                }
            };
            return t
        }();
        l = function() {
            function t(t, e, r) {
                var i, o;
                r = n.extend({}, n.fn[g].defaults, r);
                if (r.offset === "bottom-in-view") {
                    r.offset = function() {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height()
                        }
                        return t - n(this).outerHeight()
                    }
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = t.data(w)) != null ? o : [];
                i.push(this.id);
                t.data(w, i)
            }
            t.prototype.trigger = function(t) {
                if (!this.enabled) {
                    return
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t)
                }
                if (this.options.triggerOnce) {
                    return this.destroy()
                }
            };
            t.prototype.disable = function() {
                return this.enabled = false
            };
            t.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true
            };
            t.prototype.destroy = function() {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty()
            };
            t.getWaypointsByElement = function(t) {
                var e, r;
                r = n(t).data(w);
                if (!r) {
                    return []
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function(t) {
                    return e[t]
                })
            };
            return t
        }();
        d = {
            init: function(t, e) {
                var r;
                if (e == null) {
                    e = {}
                }
                if ((r = e.handler) == null) {
                    e.handler = t
                }
                this.each(function() {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i)
                    }
                    i = n(i);
                    r = a[i.data(u)];
                    if (!r) {
                        r = new o(i)
                    }
                    return new l(t, r, e)
                });
                n[m]("refresh");
                return this
            },
            disable: function() {
                return d._invoke(this, "disable")
            },
            enable: function() {
                return d._invoke(this, "enable")
            },
            destroy: function() {
                return d._invoke(this, "destroy")
            },
            prev: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1])
                    }
                })
            },
            next: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1])
                    }
                })
            },
            _traverse: function(t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical"
                }
                if (e == null) {
                    e = r
                }
                l = h.aggregate(e);
                o = [];
                this.each(function() {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t])
                });
                return this.pushStack(o)
            },
            _invoke: function(t, e) {
                t.each(function() {
                    var t;
                    t = l.getWaypointsByElement(this);
                    return n.each(t, function(t, n) {
                        n[e]();
                        return true
                    })
                });
                return this
            }
        };
        n.fn[g] = function() {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t)
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments)
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [null, r])
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.")
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.")
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function() {
                return n.each(a, function(t, e) {
                    return e.refresh()
                })
            },
            viewportHeight: function() {
                var t;
                return (t = r.innerHeight) != null ? t : i.height()
            },
            aggregate: function(t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0
                }
                if (!e) {
                    return []
                }
                r = {
                    horizontal: [],
                    vertical: []
                };
                n.each(r, function(t, i) {
                    n.each(e[t], function(t, e) {
                        return i.push(e)
                    });
                    i.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    r[t] = n.map(i, function(t) {
                        return t.element
                    });
                    return r[t] = n.unique(r[t])
                });
                return r
            },
            above: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset <= t.oldScroll.y
                })
            },
            below: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset > t.oldScroll.y
                })
            },
            left: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset <= t.oldScroll.x
                })
            },
            right: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset > t.oldScroll.x
                })
            },
            enable: function() {
                return h._invoke("enable")
            },
            disable: function() {
                return h._invoke("disable")
            },
            destroy: function() {
                return h._invoke("destroy")
            },
            extendFn: function(t, e) {
                return d[t] = e
            },
            _invoke: function(t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function(e, n) {
                    n[t]();
                    return true
                })
            },
            _filter: function(t, e, r) {
                var i, o;
                i = a[n(t).data(u)];
                if (!i) {
                    return []
                }
                o = [];
                n.each(i.waypoints[e], function(t, e) {
                    if (r(i, e)) {
                        return o.push(e)
                    }
                });
                o.sort(function(t, e) {
                    return t.offset - e.offset
                });
                return n.map(o, function(t) {
                    return t.element
                })
            }
        };
        n[m] = function() {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t)
            } else {
                return h.aggregate.call(null, n)
            }
        };
        n[m].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return i.load(function() {
            return n[m]("refresh")
        })
    })
}).call(this);;
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
//                var itemsAnimations = $portfolio.itemsAnimations({
//                    itemSelector: '.portfolio-item',
//                    scrollMonitor: true
//                });
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
//                        itemsAnimations.show($(items));
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
                    auto: ($testimonialsElement.data('autoscroll') > 0 ? $testimonialsElement.data('autoscroll') : false),
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
})(jQuery);;
window.Yikes_Mailchimp_Ajax = window.Yikes_Mailchimp_Ajax || {},
    function(a, b, c, d, e) {
        "use strict";

        function f(a, b) {
            "undefined" != typeof a && c.each(a, function(a, d) {
                b === !0 ? c("span." + a + "-label").length > 0 ? c("span." + a + "-label").addClass("yikes-mc-required-field-not-filled") : c("." + a + "-label").addClass("yikes-mc-required-field-not-filled") : c('label[for="' + a + '"]').children("input").addClass("yikes-mc-required-field-not-filled")
            })
        }
        d.l10n = a.yikes_mailchimp_ajax || {}, c(b).ready(function() {
            var b = c("body");
            b.on("submit", ".yikes-easy-mc-form", function() {
                var b = c(this);
                b.addClass("yikes-mc-submitted-form-loading"), b.find("input, label, button").not(":hidden").fadeTo("fast", .5), b.append('<img src="' + d.l10n.preloader_url + '" class="yikes-mailchimp-preloader" />'), c(".yikes-mc-required-field-not-filled").removeClass("yikes-mc-required-field-not-filled"), c(".yikes-mailchimp-submit-button-span-text").hide(), b.find(".yikes-easy-mc-submit-button").append('<img src="' + d.l10n.loading_dots + '" class="loading-dots yikes-mc-loading-dots" />');
                var e = b.attr("data-attr-form-id"),
                    g = [];
                if (b.find(".yikes-interest-group-required").length > 0 && b.find(".yikes-interest-group-required").each(function() {
                        var a = jQuery(this).attr("name"),
                            c = a.replace("[]", "");
                        0 == b.find('input[name="' + c + '[]"]:checked').length && (g[c] = b.find("span." + c + "-label").text())
                    }), g.length > 0) {
                    if (b.find(".yikes-mailchimp-required-interest-group-error").length > 0) b.find(".yikes-mailchimp-required-interest-group-error").fadeOut("fast", function() {
                        b.find(".yikes-mailchimp-required-interest-group-error").remove();
                        for (var a in g) b.find("span." + a + "-label").after('<p class="yikes-mailchimp-required-interest-group-error">' + d.l10n.interest_group_checkbox_error + "</p>")
                    });
                    else
                        for (var h in g) b.find("span." + h + "-label").after('<p class="yikes-mailchimp-required-interest-group-error">' + d.l10n.interest_group_checkbox_error + "</p>");
                    return b.find(".yikes-easy-mc-submit-button").removeAttr("disabled", "disabled"), b.find("input, label, button").not(":hidden").fadeTo("fast", 1), b.find(".yikes-mailchimp-preloader").remove(), c(".yikes-mc-loading-dots").remove(), c(".yikes-mailchimp-submit-button-span-text").show(), b.removeClass("yikes-mc-submitted-form-loading"), !1
                }
                b.find(".yikes-easy-mc-submit-button").attr("disabled", "disabled"), c(".yikes-easy-mc-error-message").remove(), c(".yikes-easy-mc-success-message").remove();
                var i = {
                    action: "process_form_submission",
                    form_data: b.serialize(),
                    form_id: e,
                    page_data: d.l10n.page_data,
                    ajax_security_nonce: d.l10n.ajax_security_nonce
                };
                return c.ajax({
                    url: d.l10n.ajax_url,
                    type: "POST",
                    data: i,
                    success: function(g, h, i) {
                        if (b.find("input, label, button").not(":hidden").fadeTo("fast", 1), b.find(".yikes-mailchimp-preloader").remove(), c(".yikes-mc-loading-dots").remove(), c(".yikes-mailchimp-submit-button-span-text").show(), b.removeClass("yikes-mc-submitted-form-loading"), g.success) {
                            if (g = g.data, "function" == typeof yikes_mailchimp_google_analytics_success && yikes_mailchimp_google_analytics_success(g), 1 == g.hide && (c(".yikes-easy-mc-form-description-" + e).length > 0 && c(".yikes-easy-mc-form-description-" + e).hide(), b.hide()), c(".yikes-easy-mc-form-description-" + e).length > 0 ? c(".yikes-easy-mc-form-description-" + e).before('<p class="yikes-easy-mc-success-message yikes-easy-mc-success-message-' + e + ' yikes-easy-mc-hidden">' + g.response + "</p>") : b.before('<p class="yikes-easy-mc-success-message yikes-easy-mc-success-message-' + e + ' yikes-easy-mc-hidden">' + g.response + "</p>"), c(".yikes-easy-mc-success-message-" + e).fadeIn(), c(".yikes-mailchimp-required-interest-group-error").remove(), 1 === g.redirection) {
                                var j = g.redirect,
                                    k = g.redirect_timer,
                                    l = g.new_window,
                                    m = "1" === l ? "_blank" : "_self";
                                setTimeout(function() {
                                    a.open(j, m)
                                }, k)
                            }
                            b.find("input").not('.yikes-easy-mc-submit-button, input[type="radio"], input[type="select"], input[type="checkbox"], #yikes-mailchimp-associated-list-id, #yikes-mailchimp-submitted-form').val("");
                            var n = {
                                action: "increase_submission_count",
                                form_id: e
                            };
                            c.ajax({
                                url: d.l10n.ajax_url,
                                type: "POST",
                                data: n,
                                success: function(a, b, c) {},
                                error: function(a, b, c) {
                                    console.error(c)
                                }
                            })
                        } else {
                            if (g = g.data, "function" == typeof yikes_mailchimp_google_analytics_failure && yikes_mailchimp_google_analytics_failure(g), c(".yikes-easy-mc-form-description-" + e).length > 0) c(".yikes-easy-mc-form-description-" + e).before('<p class="yikes-easy-mc-error-message yikes-easy-mc-error-message-' + e + '" yikes-easy-mc-hidden"> ' + g.response + "</p>");
                            else {
                                var o = "undefined" != typeof g && "undefined" != typeof g.response ? g.response : "Error collecting the API response.";
                                b.before('<p class="yikes-easy-mc-error-message yikes-easy-mc-error-message-' + e + ' yikes-easy-mc-hidden">' + o + "</p>")
                            }
                            if ("undefined" != typeof g && "undefined" != typeof g.missing_required_field && g.missing_required_field === !0 && "undefined" != typeof g.missing_required_field_data) {
                                var p = g.missing_required_field_data,
                                    q = "undefined" != typeof g.is_interest_group && g.is_interest_group;
                                f(p, q)
                            }
                            c(".yikes-easy-mc-error-message").fadeIn()
                        }
                    },
                    error: function(a, b, c) {
                        console.error(c), console.log(a), console.log(b)
                    },
                    complete: function(a, c) {
                        b.find(".yikes-easy-mc-submit-button").removeAttr("disabled", "disabled")
                    }
                }), !1
            })
        })
    }(window, document, jQuery, Yikes_Mailchimp_Ajax);;

function yikes_mc_toggle_zip_field_visibility(a, b) {
    var c = form_submission_helpers.countries_with_zip;
    "undefined" != typeof c[b] ? jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="zip-input"]')).fadeIn() : jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="zip-input"]')).fadeOut()
}

function yikes_mc_toggle_state_field_visibility(a, b) {
    var c = yikes_mc_does_country_have_states(a, b);
    c === !0 ? jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="state-dropdown"]')).fadeIn() : jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="state-dropdown"]')).fadeOut()
}

function yikes_mc_toggle_state_fields_dropdown(a, b) {
    jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="state-dropdown"]')).children("select").children("option").each(function() {
        jQuery(this).data("country") === b ? jQuery(this).show() : jQuery(this).hide()
    })
}

function yikes_mc_does_country_have_states(a, b) {
    var c = !1;
    return jQuery(a).parents(".yikes-mailchimp-container").find(jQuery('label[data-attr-name="state-dropdown"]')).children("select").children("option").each(function() {
        if (jQuery(this).data("country") === b) return c = !0, !1
    }), c
}
jQuery(document).ready(function() {
    jQuery('select[data-country="true"]').change(function() {
        var a = jQuery(this).val();
        yikes_mc_toggle_state_fields_dropdown(this, a), yikes_mc_toggle_zip_field_visibility(this, a), yikes_mc_toggle_state_field_visibility(this, a)
    }), jQuery('select[data-country="true"]').trigger("change"), jQuery("body").on("click", ".send-update-email", function() {
        var a = {
            action: "easy_forms_send_email",
            user_email: jQuery(this).attr("data-user-email"),
            list_id: jQuery(this).attr("data-list-id"),
            form_id: jQuery(this).attr("data-form-id")
        };
        return jQuery(this).parent("p").fadeTo("fast", .75).append('<img src="' + form_submission_helpers.preloader_url + '" class="update-email-preloader" />'), jQuery.post(form_submission_helpers.ajax_url, a, function(a) {
            a.success ? jQuery(".yikes-easy-mc-error-message").removeClass("yikes-easy-mc-error-message").addClass("yikes-easy-mc-success-message").html(a.data.response_text) : jQuery(".yikes-easy-mc-error-message").fadeTo("fast", 1).html(a.data.response_text)
        }), !1
    })
});;
(function($) {
    $.updateParalaxFooter = function() {
        var $footer = $('.parallax-footer').first();
        if ($footer.size() == 0) return;
        $footer.thegemPreloader(function() {
            $('#page').css({
                marginBottom: ''
            });
            $footer.removeClass('parallax-footer-inited');
            if ($footer.outerHeight() + $('#site-header').outerHeight() > $(window).height()) return;
            $footer.addClass('parallax-footer-inited');
            $('#page').css({
                marginBottom: $footer.outerHeight() + 'px'
            });
        });
    }
    $(function() {
        $.updateParalaxFooter();
    });
    $(window).resize(function() {
        $.updateParalaxFooter();
    });
})(jQuery);;


