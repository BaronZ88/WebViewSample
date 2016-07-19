var SiteTracker = function(s, p, r, u) {
  if (s != undefined && s != null) {
    this.site = s;
  }

  if (p != undefined && p != null) {
    this.page = p;
  }

  if (r != undefined && r != null) {
    this.referer = r;
  }

  if (u != undefined && u != null) {
    this.uid = u;
  }
};

SiteTracker.prototype.getCookie = function(sKey) {
  if (!sKey || !this.hasItem(sKey)) {
    return null;
  }
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
};

SiteTracker.prototype.hasItem = function(sKey) {
  return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
};

SiteTracker.prototype.track = function(t_params) {
  this.buildParams();

  var src = "",
    script,
    params = [],
    content;

  if (typeof(t_params) == "undefined" || typeof(t_params.target_url) == "undefined") {
    src = "http://s.anjuke.com/st?__site=" + this.params['site'] + "&";
  } else {
    src = t_params.target_url + '?';
  }

  for (var k in this.params) {
    params.push(k + "=" + encodeURIComponent(this.params[k]));
  }
  src += params.join('&');
  script = document.createElement("script");
  script.src = src;
  script.async = true;
  content = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
  script.onload = function() {
    content.removeChild(script);
  }
  content.appendChild(script);
};

SiteTracker.prototype.buildParams = function() {
  var href = document.location.href;

  var guid = this.getCookie(this.nGuid || "aQQ_ajkguid");
  var ctid = this.getCookie(this.nCtid || "ctid");
  var luid = this.getCookie(this.nLiu || "lui");
  var ssid = this.getCookie(this.nSessid || "sessid");
  var uid = this.getCookie(this.nUid || "ajk_member_id");

  if (this.uid != undefined && this.uid != null) {
    uid = this.uid;
  }

  if (uid == undefined || uid == null | uid == "") {
    uid = 0;
  }

  var method = "";
  if (this.method != undefined && this.method != null) {
    method = this.method;
  }

  this.params = new Object();
  this.params.p = this.page;
  this.params.h = href;
  this.params.r = this.referer;
  this.params.site = this.site;
  this.params.guid = guid;
  this.params.ssid = ssid;
  this.params.uid = uid;
  this.params.t = new Date().getTime();
  this.params.ctid = ctid;
  this.params.luid = luid;
  this.params.m = method;

  if (this.screen != undefined) {
    this.params.sc = JSON.stringify(this.screen);
  }

  if (this.cst != undefined && /[0-9]{13}/.test(this.cst)) {
    this.params.lt = this.params.t - parseInt(this.cst);
  }

  if (this.pageName != undefined) {
    this.params.pn = this.pageName;
  }

  if (this.customParam != undefined) {
    this.params.cp = this.customParam;
  }

};

SiteTracker.prototype.setSite = function(s) {
  this.site = s;
};

SiteTracker.prototype.setPage = function(p) {
  this.page = p;
};

SiteTracker.prototype.setPageName = function(n) {
  this.pageName = n;
};

SiteTracker.prototype.setCookieNames = function(c) {
  this.cookNames = c;
};

SiteTracker.prototype.setReferer = function(r) {
  this.referer = r;
};

SiteTracker.prototype.setUid = function(u) {
  this.uid = u;
};

SiteTracker.prototype.setMethod = function(m) {
  this.method = m;
};

SiteTracker.prototype.setNGuid = function(n) {
  this.nGuid = n;
};

SiteTracker.prototype.setNCtid = function(n) {
  this.nCtid = n;
};

SiteTracker.prototype.setNLiu = function(n) {
  this.nLiu = n;
};

SiteTracker.prototype.setNSessid = function(n) {
  this.nSessid = n;
};

SiteTracker.prototype.setNUid = function(n) {
  this.nUid = n;
};

SiteTracker.prototype.setCst = function(n) {
  this.cst = n;
};

SiteTracker.prototype.setScreen = function(v) {
  this.screen = v;
}

SiteTracker.prototype.setCustomParam = function(v) {
  this.customParam = v;
}
SiteTracker.prototype.getParams = function() {
  return this.params;
};
(function(win, doc, $) {

    var apf = win.APF || {};

    apf.Config = { // 各种url
        devLogURL: 'http://s.anjuke.test/ts.html?',
        logURL: 'http://m.anjuke.com/ts.html?',
        devSojURL: 'http://s.anjuke.test/stb',
        isDev: /dev|test/.test(doc.domain),
        blackList: ['Player', 'baiduboxapphomepagetag', 'onTouchMoveInPage']
    };

    function isblack(str) {
        var i,
            reg,
            length,
            blackList = apf.Config.blackList;
        if (typeof str !== 'string') { // 对于非字符串默认黑名单
            return true;
        }
        for (i = 0, length = blackList.length; i < length; i++) {
            reg = new RegExp(blackList[i], 'g');
            if (reg.test(str)) {
                return true;
            }
        };
    }

    function log(params) {
        var errorinfo = 'tp=error&site=touch&msg=',
            key,
            url,
            arr = [],
            image,
            msg;
        if (typeof params === 'string') {
            msg = params;
        }
        if (typeof params === 'object') {
            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    arr.push(key + ':' + encodeURIComponent(JSON.stringify(params[key])));
                }
            }
            msg = arr.join(',');
        }
        if (isblack(msg)) {
            return false;
        }
        image = new Image();
        if (apf.Config.isDev) {
            url = apf.Config.devLogURL + errorinfo + msg;
        } else {
            url = apf.Config.logURL + errorinfo + msg;
        }
        image.src = url;
        return true;
    }

    win.onerror = function(msg, url, line) {
        log({
            message: msg,
            url: url,
            line: line
        });
    }

    function preventDefault(event) {
        event.preventDefault();
    }

    function sendSoj(page, customparam, site) {
        var _site = site || 'm_anjuke',
            soj = new SiteTracker(),
            t_params;
        if (customparam) {
            soj.setCustomParam(customparam);
        }
        if (apf.Config.isDev) {
            t_params = {
                'target_url': apf.Config.devSojURL
            }
        }
        soj.setPage(page);
        soj.setPageName(page);
        soj.setSite(_site);
        soj.setScreen(getScreen());
        soj.setReferer(doc.referrer);
        soj.track(t_params);
        if (!/npv/.test(_site)) {
            var _trackURL = soj.getParams();
            delete _trackURL.cp;
            delete _trackURL.sc;
            window._trackURL = JSON.stringify(_trackURL);
            var _ckurl = window._trackURL = JSON.stringify(_trackURL);
            loadTrackjs();
        }

        function loadTrackjs() {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'http://tracklog.58.com/referrer_anjuke_m.js?_=' + Math.random();
            var b = document.body;
            s.onload = function() {
                T.trackEvent(page + "_tracklog");
            }
            s.onerror = function() {
                T.trackEvent(page + "_tracklog_error");
            }
            b.appendChild(s);
        }
    }

    function pad(source) {
        return ('00' + source).match(/\d{2}$/)[0];
    }

    var getScreen = function() {
        var sinfo = {};
        sinfo.w = (win.screen.width).toString();
        sinfo.h = (win.screen.height).toString();
        sinfo.r = (win.devicePixelRatio >= 2 ? 1 : 0).toString();
        getScreen = function() {
            return sinfo;
        };
        return sinfo;
    };

    apf.Namespace = {
        register: function(ns) {
            var nsParts = ns.split("."),
                root = win,
                length,
                i;
            for (i = 0, length = nsParts.length; i < length; i++) {
                if (typeof root[nsParts[i]] == "undefined") {
                    root[nsParts[i]] = {};
                }
                root = root[nsParts[i]];
            }
            return root;
        }
    };
    apf.Utils = {

        // http://techpatterns.com/downloads/javascript_cookies.php
        setCookie: function(name, value, expires, path, domain, secure) {
            // set time, it's in milliseconds
            var today = new Date();
            today.setTime(today.getTime());
            /*
                if the expires variable is set, make the correct
                expires time, the current script below will set
                it for x number of days, to make it for hours,
                delete * 24, for minutes, delete * 60 * 24
            */
            if (expires) {
                expires = expires * 1000 * 60 * 60 * 24;
            }
            var expires_date = new Date(today.getTime() + (expires));

            doc.cookie = name + "=" + escape(value) +
                ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
                ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ((secure) ? ";secure" : "");
        },

        // this fixes an issue with the old method, ambiguous values
        // with this test document.cookie.indexOf( name + "=" );
        getCookie: function(check_name) {
            // first we'll split this cookie up into name/value pairs
            // note: document.cookie only returns name=value, not the other components
            var a_all_cookies = doc.cookie.split(';'),
                a_temp_cookie = '',
                cookie_name = '',
                cookie_value = '',
                length,
                b_cookie_found = false; // set boolean t/f default f

            for (i = 0, length = a_all_cookies.length; i < length; i++) {
                // now we'll split apart each name=value pair
                a_temp_cookie = a_all_cookies[i].split('=');
                // and trim left/right whitespace while we're at it
                cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

                // if the extracted name matches passed check_name
                if (cookie_name == check_name) {
                    b_cookie_found = true;
                    // we need to handle case where cookie has no value but exists (no = sign, that is):
                    if (a_temp_cookie.length > 1) {
                        cookie_value = decodeURIComponent(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                    }
                    // note that in cases where cookie is initialized but no value, null is returned
                    return cookie_value;
                    break;
                }
                a_temp_cookie = null;
                cookie_name = '';
            }
            if (!b_cookie_found) {
                return null;
            }
        },

        // this deletes the cookie when called
        deleteCookie: function(name, path, domain) {
            if (this.getCookie(name)) {
                doc.cookie = name + "=" +
                    ((path) ? ";path=" + path : "") +
                    ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
            }
        },
        touchClick: function() {
            var status = true;
            $(doc).on('touchmove', function() {
                if (status) {
                    doc.addEventListener('click', preventDefault, true);
                    status = false;
                }
            });

            $(doc).on('touchend', function() {
                doc.removeEventListener('click', preventDefault, true);
                status = true;
            });
        },
        checkPhone: function(val) {
            var telpattern = /^1[3|4|5|7|8][0-9]\d{8}$/;
            if (telpattern.test(val)) {
                return true;
            }
            return false;
        },
        trackEvent: function(page, customparam) {
            sendSoj(page, customparam, 'm_anjuke-npv');
        },
        /**
         * [getGuid 在统计电话时长的时候为了保持唯一关联性，防止用户间隔时间长或者清除cookie后两个soj无法关联起来]
         * @param  {[String]} sType
         * @return {[String]}
         */
        getGuid: function(sType) {
            sType = sType || 'T';
            var date = new Date(),
                month = date.getMonth() + 1,
                date2 = date.getDate(),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                d = date.getTime();
            var uuid = ('xxxxxxxx-yxxx-yxxx-yxxx-' + sType + 'xxx').replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 0x3);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return (uuid + pad(month) + pad(date2) + pad(hours) + pad(minutes)).toUpperCase();
        },
        log: function(params) {
            return log(params);
        },
        getCookieGuid: function() {
            return this.getCookie('aQQ_ajkguid');
        },
        addLinkSoj: function(selector, attr, param) {
            $('body').on('click', selector, function(e) {
                e.preventDefault();
                e.stopPropagation();
                var soj = $(this).data(attr || 'soj') || $(this).attr(attr || 'soj'), // 默认使用data，如果取不到，使用attr
                    _soj = $.trim(soj), // 去空格
                    href = $.trim($(this).attr('href')),
                    _param = param || 'from'; // 默认是from

                if (!href) { // 此处链接不做合法性检查
                    return;
                }
                if (href.toLowerCase().indexOf('javascript') === 0) {
                    return;
                }
                if (!_soj) { // 如果无soj,直接跳转
                    location.href = href;
                    return;
                }
                if (href.indexOf('?') !== -1) {
                    location.href = href + '&' + _param + '=' + _soj;
                } else {
                    location.href = href + '?' + _param + '=' + _soj;
                }
            });
        },
        replaceImg: function(v, attrName, watermark) {
            attrName = attrName ? attrName : 'data-src';
            watermark = watermark === false ? false : true;
            if (!v) return false;
            var s = v.getAttribute(attrName);
            if (s != "" && s != null) {
                var re = s.split('/').pop().match(/\d+x\d+/g);
                if (re) {
                    var w = parseInt(v.clientWidth),
                        h = parseInt(v.clientHeight),
                        ratio = 0,
                        suffix = '';
                    if (window.devicePixelRatio && window.devicePixelRatio != 1) {
                        w = parseInt(w * window.devicePixelRatio);
                        h = parseInt(h * window.devicePixelRatio);
                    }
                    if (!watermark) {
                        if (w > 220 || h > 220) { //宽或高大于220px将设置水印
                            var wRatio = w / 220,
                                hRatio = h / 220,
                                ratio = wRatio > hRatio ? wRatio : hRatio;
                            ratio = Math.ceil(ratio);
                            w = Math.floor(w / ratio);
                            h = Math.floor(h / ratio);
                        }
                        if (ratio !== 0) {
                            s = s.replace(/(\.\w+)$/g, '@' + ratio + 'x$1');
                        }
                    }
                    size = w + 'x' + h;
                    if (w && h) {
                        s = s.replace(re, w + 'x' + h);
                    }
                }
                var pic = new Image();
                pic.src = s;

                pic.onerror = function(e) {
                    v.setAttribute(attrName, '');
                    return false;
                }
                pic.onload = function() {
                    v.setAttribute('src', s);
                    // v.setAttribute(attrName, '');
                }
            }
        },
        LocalStorageHelper: function(action, key, val) {
            try {
                if (action == "setItem") {
                    localStorage[action](key, val);
                    return true;
                } else {
                    var result = localStorage[action](key);
                    return result;
                }
            } catch (e) {
                return false;
            }
        },
        sendSoj: sendSoj
    };
    (function() { // 初始化发送soj
        var pageName,
            cp,
            ppc,
            url,
            head = $('head');
        pageName = head.data('page');
        ppc = head.data('ppc');
        cp = head.data('new-ppc'); // 如果是json格式，会自动转化
        if (!cp) {
            cp = {};
            if (ppc) {
                (new Image()).src = ppc + '&userid=' + APF.Utils.getCookie('ajk_member_id');
            }
        }
        if (head.data('kw')) { // 租房列表搜索关键字统计
            cp.kw = head.data('kw');
        }
        if (head.data('soj-php')) { // 二手房单页 php 测试
            cp.test = head.data('soj-php');
        }

        // 房源单页,发soj时增加datappc,以统计ppc与soj的数据差异
        if (pageName == 'Anjuke_Prop_View') {
            cp.datappc = ppc;
        }
        url = location.href;
        if ((url.indexOf("lat") != -1) && (url.indexOf("lng") != -1) && (url.indexOf("map") == -1)) {
            cp.locate = 'locate';
        }
        sendSoj(pageName, JSON.stringify(cp));
    })();

    win.APF = apf;
    win.T = apf.Utils;

    APF.Utils.addLinkSoj('a'); // soj from 加码
})(window, document, Zepto);
;
(function($, common) {

    common.BackTopBar = function(ops) {
        this.data={
            listDomIcon:$('#showitem'),
            listItemDom:$('#allItem'),
            listTitle:$('#list_title')
        };
        this.ops = $.extend({},ops||{})
        this.init();
    }
    common.BackTopBar.prototype = {
        constructor:common.BackTopBar,
        init: function(){
            var appCookie = APF.Utils.getCookie("app");
            if(appCookie === 'i-ajk' || appCookie === 'a-ajk' || appCookie === '1'){
                $('.list_header_container').hide();
            }
            //简单的返回栏是不需要下拉框的,所以通过不绑定事件阻止下拉框的显示
            // 使用示例可查看/app-user-touch/page/user/touch/tools/Xiangou.phtml 文件底部
            if (!this.ops.isSingle) {
                this.bindEvent();
            }
        },
        bindEvent: function(){
            var _this = this;
            $(this.data.listDomIcon).on('click',function(){
                $(_this.data.listItemDom).toggle();
            })

            $(this.data.listTitle).on('click',function(){
                $(_this.data.listItemDom).toggle();
                $(this).find('i').toggleClass('arrow_up');
            })
        }
    }
})(Zepto, APF.Namespace.register('touch.component.header'));;
(function($, C, win, apf) {

    C.Exposure = function(op) {
        var defaults = {
            trackTag: 'data-trace',
            delay: 50,
            pageName: apf.info.pageName,
            prefix: 'Exp_'
        };
        this.ops = $.extend(defaults, op);
        this.domCache = []; // 保存内容
        this.pageViewHeight = $(win).height(); // 页面可视区域高度
        this.timer = null;
        this.dataCache = [];
        this.expStatus = false;
        this.init();
    };
    C.Exposure.prototype = {
        constructor: C.Exposure,
        add: function(list) {
            var _this = this;
            this.expStatus = true;
            list.each(function(index, el) {
                _this.domCache.push($(el));
            });
            $(win).scroll();
        },
        init: function() {
            var wd = $(win);
            wd.resize($.proxy(this.resize, this)); // resize
            wd.on('beforeunload', $.proxy(this.beforeunload, this));
            $(win).scroll($.proxy(this.scroll, this));
        },
        resize: function() {
            this.pageViewHeight = $(win).height();
        },
        beforeunload: function() {
            this.buildData();
        },
        scroll: function() {
            if (!this.expStatus) {
                return;
            }
            clearTimeout(this.timer);
            if (this.domCache.length === 0) {
                this.expStatus = false;
                this.buildData();
                return;
            }
            this.timer = setTimeout($.proxy(this.addData, this), this.ops.delay);
        },
        sendExp: function(result) {
            apf.Utils.trackEvent(this.ops.prefix + this.ops.pageName, result);
        },
        addData: function() {
            var pageViewHeight = this.pageViewHeight,
                topY = $(win).scrollTop(),
                botY = topY + pageViewHeight,
                _this = this;
            if (this.domCache.length === 0) {
                return;
            }
            $.each(this.domCache, function(index, val) {
                var _topY,
                    attr;
                if (!val) {
                    return;
                }
                _topY = val.offset ? val.offset().top : 0;
                if (_topY > topY && _topY < botY) {
                    attr = val.attr(_this.ops.trackTag);
                    if (attr) {
                        _this.dataCache.push(attr);
                    }
                    delete _this.domCache[index];
                }
            });
            this.buildData();
        },
        buildData: function() {
            var _this = this,
                result = {},
                r = [],
                exp,
                key,
                length,
                i;
            /**
             * "{aa:'123'}"
             * 这种格式的数据JSON.parse解析不了，必须用eval才能转成json
             */
            if (this.dataCache.length === 0) { // 如果没有数据就不发送
                return;
            }
            exp = eval('([' + this.dataCache.join(',') + '])');
            this.dataCache = []; // 清除要发送的数据
            for (i = 0, length = exp.length; i < length; i++) {
                for (key in exp[i]) {
                    if (!result[key]) {
                        result[key] = [];
                    }
                    result[key].push(exp[i][key]);
                }
            }
            for (key in result) { // 不考虑兼容pc 此循环可以用JSON.stringify替换
                var arrString = JSON.stringify(result[key]);
                r.push('"' + key + '"' + ':' + arrString);
            }
            this.sendExp('{"exposure":{' + r.join(',') + '}}');
            $.each(this.domCache, function(index, val) {
                if (!val) {
                    _this.domCache.splice(index, 1); // 删除已统计过的dom
                }
            });
        }
    };
})(Zepto, APF.Namespace.register('touch.component.module'), window, APF);(function($, module) {
    module.Observer = {
        listener: {
            defaults: []
        },
        data_status: {},
        on: function(type, fn) {
            if ($.type(type) === 'function') {
                type = 'defaults';
                fn = type;
            }
            if ($.type(fn) !== 'function') {
                return;
            }
            if (!this.listener[type]) {
                this.listener[type] = [];
            }
            this.listener[type].push(fn);
        },
        off: function(type, fn) {
            var sub,
                i,
                max;
            if ($.type(type) === 'function') {
                fn = type;
                type = 'defaults';
            }
            if (!type) {
                return;
            }
            sub = this.listener[type];
            max = sub ? sub.length : 0;
            if ($.type(fn) === 'function') {
                for (i = 0; i < max; i++) {
                    if (sub[i] === fn) {
                        sub.splice(i, 1);
                    }
                }
                this.listener[type] = sub;
                return;
            }
            this.listener[type] = [];
        },
        trigger: function() {
            var length = arguments.length,
                type,
                sub,
                args = [],
                max,
                result,
                i;
            if (length <= 1) {
                type = $.type(arguments[0]);
                if (type === 'array') {
                    type = 'defaults';
                    args = type;
                } else if (type !== 'string') {
                    return;
                } else {
                    type = arguments[0];
                }
            } else {
                args = [].concat.apply([],arguments); // 保证apply参数为数组
                type = args.splice(0, 1);
            }
            sub = this.listener[type];
            max = sub ? sub.length : 0;
            for (i = 0; i < max; i++) {
                result = sub[i].apply(null, args);
                if (result === false) {
                    break;
                }
            }
        },
        get_data: function(key) {
            return this.data_status[key];
        },
        set_data: function(key, data) {
            this.data_status[key] = data;
        }
    };

    module.Observer.addPublisher = function(o) {
        $.extend(true, o, module.Observer);
    };
})(Zepto, APF.Namespace.register('touch.component.module'));;
(function(module) {
    module.Dialog = function(opt) {
        var defaults = {
            clazz: 'g-d-dialog',
            action: 'click',
            target: '',
            bgClose: false
        };
        this.ops = $.extend(defaults, opt);
        this.dom = {};
        this.init();
    };

    module.Dialog.prototype = $.extend({}, module.Observer, {
        constructor: module.Dialog,
        init: function() {
            var frame = $(document.createDocumentFragment()),
                _this = this,
                content,
                div = $('<div></div>');
            div.addClass(this.ops.clazz);
            frame.append(div);
            if (this.ops.select) {
                content = $(this.ops.select);
            }
            div.append(content || '');
            $('body').append(frame);
            this.dom.dialog = div;

            // 禁止弹层上面的touchmove
            this.dom.dialog.on('touchmove', function(e) {
                e.preventDefault();
            });

            // 关闭按钮
            $(this.ops.closeSelect).click(function(event) { // 初始化关闭按钮
                event.stopPropagation();
                _this.trigger('dialogClose');
                _this.close();
            });

            // 点击背景关闭
            if (this.ops.bgClose) {
                div.click(function(event) { // 点击背景关闭
                    if (event.target === this) {
                        event.stopPropagation();
                        _this.trigger('bgClose');
                        _this.close();
                    }
                });
            }
            // 输入框
            div.find('input').blur(function(event) {
                event.stopPropagation();
                _this.fixDrawSlow();
            });

            // 打开弹框
            if (this.ops.target) {
                $(this.ops.target).on(this.ops.action, function(event) {
                    event.stopPropagation();
                    var arr = [].slice.call(arguments);
                    _this.open(arr.slice(1));
                });
            }
        },
        open: function(arg) {
            this.trigger('open', arg);
            this.dom.dialog.css('display', '-webkit-box');
            this.trigger('afteropen', arg);
        },
        close: function(arg) {
            this.dom.dialog.hide();
            this.trigger('close', arg);
        },
        getDialog: function() {
            return this.dom.dialog;
        },
        fixDrawSlow: function() {
            var top = $(window).scrollTop();
            setTimeout(function() {
                $(window).scrollTop(top + 1);
                setTimeout(function() {
                    $(window).scrollTop(top);
                }, 10);
            }, 1);
        },
    });
})(APF.Namespace.register('touch.component.module'));
/**
* 用于检索小区的autocomplete
* @author： yaohuiwang@anjuke.com 2016-06-12
* 组件需位于body子层
* 同一页面多次调用时需把组件的父节点的选择器@wrapperSlter传入(最好在页面唯一)
* 点击“取消”会触发@cancleCallback
* 点击“第一条”会触发@iptedClickCallback
* 点击“联想到的li节点”会触发@autodClickCallback
*/
(function($, module) {
    module.CommonAutocomplete = function(op) {
        this.defaults = {
            limit         : 10, // 一次性最多返回的房源数
            heightLightEM : true, // 是否高亮输入值
            openSlter     : ".commonAutocompleteOpenSlter" // 让组件显示的节点（或选择器）
        };
        this.opts = $.extend({}, this.defaults, op);
        this.node = {
            cancleBtn : $(".cancleBtn"),
            component : $(".CommonAutocompleteComponent"),
            commonIpt : $(".commonIpt"),
            ipted     : $(".ipted"),
            iptedWrap : $(".iptedWrap"),
            list      : $(".list"),
            openSlter : $(this.opts.openSlter)
        };
        this.init();
    };
    module.CommonAutocomplete.prototype = {
        constructor: module.CommonAutocomplete,
        init: function() {
            var self = this;
            self.setNode();
            self.bindEvent();
        },
        setNode : function() {
            var self = this;
            if( !self.opts.wrapperSlter ) {
                return;
            } else {
                $.each( self.node, function(k, v) {
                    self.node[k] = $(self.wrapperSlter).find(k);
                } );
            }
        },
        bindEvent: function() {
            var self = this;

            // 绑定： 显示组件
            $(document).on("click", self.opts.openSlter, function(e) {
                var iptedVal = $(this).val();
                self.doOneSearch(iptedVal);
                self.node.ipted.html(iptedVal);
                self.node.component.show();
                self.node.commonIpt.val(iptedVal).focus();
                $(window).scrollTop(-50); // 显示输入框
            });

            // 绑定： 点击取消
            self.node.cancleBtn.on("click", function(e) {
                self.node.component.hide();
                self.opts.cancleCallback && self.opts.cancleCallback(self);
            });

            // 绑定： 输入时autocomplete
            self.node.commonIpt.on("input", function(e) {
                var kw = $(this).val();

                // 填充第0条结果
                if($.trim(kw).length === 0) {
                    self.node.iptedWrap.hide();
                } else {
                    self.node.ipted.html(kw);
                    self.node.iptedWrap.show();
                }

                // 联想词下拉
                self.doOneSearch(kw);
            });

            // 绑定： 点击默认li
            self.node.ipted.on("click", function(e) {
                var name = $(this).html();
                self.setInputed(name);
                self.node.component.hide();
                self.opts.iptedClickCallback && self.opts.iptedClickCallback(this);
            });

            // 绑定： 点击联想li
            self.node.list.on("click", "li", function(e) {
                var id   = $(this).attr("data-commonid");
                var name = $(this).find(".common-name").html().replace(/\<em\>|\<\/em\>/g, "");
                var addr = $(this).find(".common-address").html();
                self.setInputed(name, addr, id);
                self.node.component.hide();
                self.opts.autodClickCallback && self.opts.autodClickCallback(this);
            });
        },
        setInputed : function(name, addr, commId) {
            var self = this;
            self.node.openSlter.val(name);
            self.node.openSlter.attr("data-addr", addr || "");
            self.node.openSlter.attr("data-commid", commId || "");
        },
        doOneSearch : function(kw) {
            var self = this;
            var data = {
                    q : kw,
                    limit : self.opts.limit
                };
                if($.trim(kw).length === 0) {
                    self.node.list.empty();
                    return;
                }
                $.ajax({
                    type     : "get",
                    url      : self.opts.autoCommonApi,
                    data     : data,
                    dataType : "json",
                    success  : function(r) {
                        self.node.list.empty();

                        // 填充结果列表
                        if(r) {
                            self.node.list.append( self.getFragment(r, kw) );
                            if( self.node.commonIpt.val().length === 0 ) { // 每次异步结束都判断是否应该清空结果
                                self.node.list.empty();
                            }
                        }
                    },
                    error : function(e) {
                        console.log("网络异常，请刷新重试");
                    }
                });
        },
        getFragment : function(r, kw) {
            var self = this;
            var fg = document.createDocumentFragment(),
                t  = null;
            $.each(r, function(k, v) {
                var name = v.name;
                if( self.opts.heightLightEM ) {
                    name = name.replace(kw, "<em>" + kw + "</em>");
                }
                t  = self.getLi();
                t.attr("data-commonid", v.id); // 小区id
                t.children(".common-name").html( name );
                t.find(".common-address").html(v.address); // 小区地址
                fg.appendChild(t[0]);
            });
            return fg;
        },
        getLi : function() {
            return $('<li data-commonid="">' +
                        '<p class="common-name"></p>' +
                        '<address class="common-addr">' +
                            '<p class="common-address"></p>' +
                        '</address>' +
                    '</li>');
        }
    };
})(Zepto, APF.Namespace.register('touch.component.module'));/**
 * Mega pixel image rendering library for iOS6 Safari
 *
 * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
 * which causes unexpected subsampling when drawing it in canvas.
 * By using this library, you can safely render the image with proper stretching.
 *
 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
 * Released under the MIT license
 */
(function() {

  /**
   * Detect subsampling in loaded image.
   * In iOS, larger images than 2M pixels may be subsampled in rendering.
   */
  function detectSubsampling(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, -iw + 1, 0);
      // subsampled image becomes half smaller in rendering size.
      // check alpha channel value to confirm image is covering edge pixel or not.
      // if alpha value is 0 image is not covering, hence subsampled.
      return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
    } else {
      return false;
    }
  }

  /**
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   */
  function detectVerticalSquash(img, iw, ih) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
  }

  /**
   * Rendering image element (with resizing) and get its data URL
   */
  function renderImageToDataURL(img, options, doSquash) {
    var canvas = document.createElement('canvas');
    renderImageToCanvas(img, canvas, options, doSquash);
    return canvas.toDataURL("image/jpeg", options.quality || 0.8);
  }

  /**
   * Rendering image element (with resizing) into the canvas element
   */
  function renderImageToCanvas(img, canvas, options, doSquash) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var width = options.width, height = options.height;
    var ctx = canvas.getContext('2d');
    ctx.save();
    transformCoordinate(canvas, width, height, options.orientation);
    var subsampled = detectSubsampling(img);
    if (subsampled) {
      iw /= 2;
      ih /= 2;
    }
    var d = 1024; // size of tiling canvas
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = tmpCanvas.height = d;
    var tmpCtx = tmpCanvas.getContext('2d');
    var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
    var dw = Math.ceil(d * width / iw);
    var dh = Math.ceil(d * height / ih / vertSquashRatio);
    var sy = 0;
    var dy = 0;
    while (sy < ih) {
      var sx = 0;
      var dx = 0;
      while (sx < iw) {
        tmpCtx.clearRect(0, 0, d, d);
        tmpCtx.drawImage(img, -sx, -sy);
        ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
        sx += d;
        dx += dw;
      }
      sy += d;
      dy += dh;
    }
    ctx.restore();
    tmpCanvas = tmpCtx = null;
  }

  /**
   * Transform canvas coordination according to specified frame size and orientation
   * Orientation value is from EXIF tag
   */
  function transformCoordinate(canvas, width, height, orientation) {
    switch (orientation) {
      case 5:
      case 6:
      case 7:
      case 8:
        canvas.width = height;
        canvas.height = width;
        break;
      default:
        canvas.width = width;
        canvas.height = height;
    }
    var ctx = canvas.getContext('2d');
    switch (orientation) {
      case 2:
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        // 180 rotate left
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
      case 4:
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        // 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break;
      case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        // 90 rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break;
      default:
        break;
    }
  }


  /**
   * MegaPixImage class
   */
  function MegaPixImage(srcImage) {
    if (window.Blob && srcImage instanceof Blob) {
      var img = new Image();
      var URL = window.URL && window.URL.createObjectURL ? window.URL :
                window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
                null;
      if (!URL) { throw Error("No createObjectURL function found to create blob url"); }
      img.src = URL.createObjectURL(srcImage);
      this.blob = srcImage;
      srcImage = img;
    }
    if (!srcImage.naturalWidth && !srcImage.naturalHeight) {
      var _this = this;
      srcImage.onload = function() {
        var listeners = _this.imageLoadListeners;
        if (listeners) {
          _this.imageLoadListeners = null;
          for (var i=0, len=listeners.length; i<len; i++) {
            listeners[i]();
          }
        }
      };
      this.imageLoadListeners = [];
    }
    this.srcImage = srcImage;
  }

  /**
   * Rendering megapix image into specified target element
   */
  MegaPixImage.prototype.render = function(target, options) {
    if (this.imageLoadListeners) {
      var _this = this;
      this.imageLoadListeners.push(function() { _this.render(target, options) });
      return;
    }
    options = options || {};
    var imgWidth = this.srcImage.naturalWidth, imgHeight = this.srcImage.naturalHeight,
        width = options.width, height = options.height,
        maxWidth = options.maxWidth, maxHeight = options.maxHeight,
        doSquash = !this.blob || this.blob.type === 'image/jpeg';
    if (width && !height) {
      height = (imgHeight * width / imgWidth) << 0;
    } else if (height && !width) {
      width = (imgWidth * height / imgHeight) << 0;
    } else {
      width = imgWidth;
      height = imgHeight;
    }
    if (maxWidth && width > maxWidth) {
      width = maxWidth;
      height = (imgHeight * width / imgWidth) << 0;
    }
    if (maxHeight && height > maxHeight) {
      height = maxHeight;
      width = (imgWidth * height / imgHeight) << 0;
    }
    var opt = { width : width, height : height };
    for (var k in options) opt[k] = options[k];

    var tagName = target.tagName.toLowerCase();
    if (tagName === 'img') {
      target.src = renderImageToDataURL(this.srcImage, opt, doSquash);
    } else if (tagName === 'canvas') {
      renderImageToCanvas(this.srcImage, target, opt, doSquash);
    }
    if (typeof this.onrender === 'function') {
      this.onrender(target);
    }
  };

  /**
   * Export class to global
   */
  if (typeof define === 'function' && define.amd) {
    define([], function() { return MegaPixImage; }); // for AMD loader
  } else {
    this.MegaPixImage = MegaPixImage;
  }

})();
function JPEGEncoder(quality) {
    var self = this;
    var fround = Math.round;
    var ffloor = Math.floor;
    var YTable = new Array(64);
    var UVTable = new Array(64);
    var fdtbl_Y = new Array(64);
    var fdtbl_UV = new Array(64);
    var YDC_HT;
    var UVDC_HT;
    var YAC_HT;
    var UVAC_HT;

    var bitcode = new Array(65535);
    var category = new Array(65535);
    var outputfDCTQuant = new Array(64);
    var DU = new Array(64);
    var byteout = [];
    var bytenew = 0;
    var bytepos = 7;

    var YDU = new Array(64);
    var UDU = new Array(64);
    var VDU = new Array(64);
    var clt = new Array(256);
    var RGB_YUV_TABLE = new Array(2048);
    var currentQuality;

    var ZigZag = [
        0, 1, 5, 6,14,15,27,28,
        2, 4, 7,13,16,26,29,42,
        3, 8,12,17,25,30,41,43,
        9,11,18,24,31,40,44,53,
        10,19,23,32,39,45,52,54,
        20,22,33,38,46,51,55,60,
        21,34,37,47,50,56,59,61,
        35,36,48,49,57,58,62,63
    ];

    var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
    var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
    var std_ac_luminance_values = [
        0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
        0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
        0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
        0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
        0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
        0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
        0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
        0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
        0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
        0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
        0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
        0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
        0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
        0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
        0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
        0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
        0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
        0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
        0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
        0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
        0xf9,0xfa
    ];

    var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
    var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
    var std_ac_chrominance_values = [
        0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
        0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
        0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
        0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
        0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
        0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
        0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
        0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
        0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
        0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
        0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
        0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
        0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
        0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
        0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
        0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
        0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
        0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
        0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
        0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
        0xf9,0xfa
    ];

    function initQuantTables(sf){
        var YQT = [
            16, 11, 10, 16, 24, 40, 51, 61,
            12, 12, 14, 19, 26, 58, 60, 55,
            14, 13, 16, 24, 40, 57, 69, 56,
            14, 17, 22, 29, 51, 87, 80, 62,
            18, 22, 37, 56, 68,109,103, 77,
            24, 35, 55, 64, 81,104,113, 92,
            49, 64, 78, 87,103,121,120,101,
            72, 92, 95, 98,112,100,103, 99
        ];

        for (var i = 0; i < 64; i++) {
            var t = ffloor((YQT[i]*sf+50)/100);
            if (t < 1) {
                t = 1;
            } else if (t > 255) {
                t = 255;
            }
            YTable[ZigZag[i]] = t;
        }
        var UVQT = [
            17, 18, 24, 47, 99, 99, 99, 99,
            18, 21, 26, 66, 99, 99, 99, 99,
            24, 26, 56, 99, 99, 99, 99, 99,
            47, 66, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99
        ];
        for (var j = 0; j < 64; j++) {
            var u = ffloor((UVQT[j]*sf+50)/100);
            if (u < 1) {
                u = 1;
            } else if (u > 255) {
                u = 255;
            }
            UVTable[ZigZag[j]] = u;
        }
        var aasf = [
            1.0, 1.387039845, 1.306562965, 1.175875602,
            1.0, 0.785694958, 0.541196100, 0.275899379
        ];
        var k = 0;
        for (var row = 0; row < 8; row++)
        {
            for (var col = 0; col < 8; col++)
            {
                fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                k++;
            }
        }
    }

    function computeHuffmanTbl(nrcodes, std_table){
        var codevalue = 0;
        var pos_in_table = 0;
        var HT = new Array();
        for (var k = 1; k <= 16; k++) {
            for (var j = 1; j <= nrcodes[k]; j++) {
                HT[std_table[pos_in_table]] = [];
                HT[std_table[pos_in_table]][0] = codevalue;
                HT[std_table[pos_in_table]][1] = k;
                pos_in_table++;
                codevalue++;
            }
            codevalue*=2;
        }
        return HT;
    }

    function initHuffmanTbl()
    {
        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
    }

    function initCategoryNumber()
    {
        var nrlower = 1;
        var nrupper = 2;
        for (var cat = 1; cat <= 15; cat++) {
            //Positive numbers
            for (var nr = nrlower; nr<nrupper; nr++) {
                category[32767+nr] = cat;
                bitcode[32767+nr] = [];
                bitcode[32767+nr][1] = cat;
                bitcode[32767+nr][0] = nr;
            }
            //Negative numbers
            for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
                category[32767+nrneg] = cat;
                bitcode[32767+nrneg] = [];
                bitcode[32767+nrneg][1] = cat;
                bitcode[32767+nrneg][0] = nrupper-1+nrneg;
            }
            nrlower <<= 1;
            nrupper <<= 1;
        }
    }

    function initRGBYUVTable() {
        for(var i = 0; i < 256;i++) {
            RGB_YUV_TABLE[i]      		=  19595 * i;
            RGB_YUV_TABLE[(i+ 256)>>0] 	=  38470 * i;
            RGB_YUV_TABLE[(i+ 512)>>0] 	=   7471 * i + 0x8000;
            RGB_YUV_TABLE[(i+ 768)>>0] 	= -11059 * i;
            RGB_YUV_TABLE[(i+1024)>>0] 	= -21709 * i;
            RGB_YUV_TABLE[(i+1280)>>0] 	=  32768 * i + 0x807FFF;
            RGB_YUV_TABLE[(i+1536)>>0] 	= -27439 * i;
            RGB_YUV_TABLE[(i+1792)>>0] 	= - 5329 * i;
        }
    }

    // IO functions
    function writeBits(bs)
    {
        var value = bs[0];
        var posval = bs[1]-1;
        while ( posval >= 0 ) {
            if (value & (1 << posval) ) {
                bytenew |= (1 << bytepos);
            }
            posval--;
            bytepos--;
            if (bytepos < 0) {
                if (bytenew == 0xFF) {
                    writeByte(0xFF);
                    writeByte(0);
                }
                else {
                    writeByte(bytenew);
                }
                bytepos=7;
                bytenew=0;
            }
        }
    }

    function writeByte(value)
    {
        byteout.push(clt[value]); // write char directly instead of converting later
    }

    function writeWord(value)
    {
        writeByte((value>>8)&0xFF);
        writeByte((value   )&0xFF);
    }

    // DCT & quantization core
    function fDCTQuant(data, fdtbl)
    {
        var d0, d1, d2, d3, d4, d5, d6, d7;
        /* Pass 1: process rows. */
        var dataOff=0;
        var i;
        const I8 = 8;
        const I64 = 64;
        for (i=0; i<I8; ++i)
        {
            d0 = data[dataOff];
            d1 = data[dataOff+1];
            d2 = data[dataOff+2];
            d3 = data[dataOff+3];
            d4 = data[dataOff+4];
            d5 = data[dataOff+5];
            d6 = data[dataOff+6];
            d7 = data[dataOff+7];

            var tmp0 = d0 + d7;
            var tmp7 = d0 - d7;
            var tmp1 = d1 + d6;
            var tmp6 = d1 - d6;
            var tmp2 = d2 + d5;
            var tmp5 = d2 - d5;
            var tmp3 = d3 + d4;
            var tmp4 = d3 - d4;

            /* Even part */
            var tmp10 = tmp0 + tmp3;	/* phase 2 */
            var tmp13 = tmp0 - tmp3;
            var tmp11 = tmp1 + tmp2;
            var tmp12 = tmp1 - tmp2;

            data[dataOff] = tmp10 + tmp11; /* phase 3 */
            data[dataOff+4] = tmp10 - tmp11;

            var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
            data[dataOff+2] = tmp13 + z1; /* phase 5 */
            data[dataOff+6] = tmp13 - z1;

            /* Odd part */
            tmp10 = tmp4 + tmp5; /* phase 2 */
            tmp11 = tmp5 + tmp6;
            tmp12 = tmp6 + tmp7;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
            var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
            var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
            var z3 = tmp11 * 0.707106781; /* c4 */

            var z11 = tmp7 + z3;	/* phase 5 */
            var z13 = tmp7 - z3;

            data[dataOff+5] = z13 + z2;	/* phase 6 */
            data[dataOff+3] = z13 - z2;
            data[dataOff+1] = z11 + z4;
            data[dataOff+7] = z11 - z4;

            dataOff += 8; /* advance pointer to next row */
        }

        /* Pass 2: process columns. */
        dataOff = 0;
        for (i=0; i<I8; ++i)
        {
            d0 = data[dataOff];
            d1 = data[dataOff + 8];
            d2 = data[dataOff + 16];
            d3 = data[dataOff + 24];
            d4 = data[dataOff + 32];
            d5 = data[dataOff + 40];
            d6 = data[dataOff + 48];
            d7 = data[dataOff + 56];

            var tmp0p2 = d0 + d7;
            var tmp7p2 = d0 - d7;
            var tmp1p2 = d1 + d6;
            var tmp6p2 = d1 - d6;
            var tmp2p2 = d2 + d5;
            var tmp5p2 = d2 - d5;
            var tmp3p2 = d3 + d4;
            var tmp4p2 = d3 - d4;

            /* Even part */
            var tmp10p2 = tmp0p2 + tmp3p2;	/* phase 2 */
            var tmp13p2 = tmp0p2 - tmp3p2;
            var tmp11p2 = tmp1p2 + tmp2p2;
            var tmp12p2 = tmp1p2 - tmp2p2;

            data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
            data[dataOff+32] = tmp10p2 - tmp11p2;

            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
            data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
            data[dataOff+48] = tmp13p2 - z1p2;

            /* Odd part */
            tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
            tmp11p2 = tmp5p2 + tmp6p2;
            tmp12p2 = tmp6p2 + tmp7p2;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
            var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
            var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
            var z3p2 = tmp11p2 * 0.707106781; /* c4 */

            var z11p2 = tmp7p2 + z3p2;	/* phase 5 */
            var z13p2 = tmp7p2 - z3p2;

            data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
            data[dataOff+24] = z13p2 - z2p2;
            data[dataOff+ 8] = z11p2 + z4p2;
            data[dataOff+56] = z11p2 - z4p2;

            dataOff++; /* advance pointer to next column */
        }

        // Quantize/descale the coefficients
        var fDCTQuant;
        for (i=0; i<I64; ++i)
        {
            // Apply the quantization and scaling factor & Round to nearest integer
            fDCTQuant = data[i]*fdtbl[i];
            outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
            //outputfDCTQuant[i] = fround(fDCTQuant);

        }
        return outputfDCTQuant;
    }

    function writeAPP0()
    {
        writeWord(0xFFE0); // marker
        writeWord(16); // length
        writeByte(0x4A); // J
        writeByte(0x46); // F
        writeByte(0x49); // I
        writeByte(0x46); // F
        writeByte(0); // = "JFIF",'\0'
        writeByte(1); // versionhi
        writeByte(1); // versionlo
        writeByte(0); // xyunits
        writeWord(1); // xdensity
        writeWord(1); // ydensity
        writeByte(0); // thumbnwidth
        writeByte(0); // thumbnheight
    }

    function writeSOF0(width, height)
    {
        writeWord(0xFFC0); // marker
        writeWord(17);   // length, truecolor YUV JPG
        writeByte(8);    // precision
        writeWord(height);
        writeWord(width);
        writeByte(3);    // nrofcomponents
        writeByte(1);    // IdY
        writeByte(0x11); // HVY
        writeByte(0);    // QTY
        writeByte(2);    // IdU
        writeByte(0x11); // HVU
        writeByte(1);    // QTU
        writeByte(3);    // IdV
        writeByte(0x11); // HVV
        writeByte(1);    // QTV
    }

    function writeDQT()
    {
        writeWord(0xFFDB); // marker
        writeWord(132);	   // length
        writeByte(0);
        for (var i=0; i<64; i++) {
            writeByte(YTable[i]);
        }
        writeByte(1);
        for (var j=0; j<64; j++) {
            writeByte(UVTable[j]);
        }
    }

    function writeDHT()
    {
        writeWord(0xFFC4); // marker
        writeWord(0x01A2); // length

        writeByte(0); // HTYDCinfo
        for (var i=0; i<16; i++) {
            writeByte(std_dc_luminance_nrcodes[i+1]);
        }
        for (var j=0; j<=11; j++) {
            writeByte(std_dc_luminance_values[j]);
        }

        writeByte(0x10); // HTYACinfo
        for (var k=0; k<16; k++) {
            writeByte(std_ac_luminance_nrcodes[k+1]);
        }
        for (var l=0; l<=161; l++) {
            writeByte(std_ac_luminance_values[l]);
        }

        writeByte(1); // HTUDCinfo
        for (var m=0; m<16; m++) {
            writeByte(std_dc_chrominance_nrcodes[m+1]);
        }
        for (var n=0; n<=11; n++) {
            writeByte(std_dc_chrominance_values[n]);
        }

        writeByte(0x11); // HTUACinfo
        for (var o=0; o<16; o++) {
            writeByte(std_ac_chrominance_nrcodes[o+1]);
        }
        for (var p=0; p<=161; p++) {
            writeByte(std_ac_chrominance_values[p]);
        }
    }

    function writeSOS()
    {
        writeWord(0xFFDA); // marker
        writeWord(12); // length
        writeByte(3); // nrofcomponents
        writeByte(1); // IdY
        writeByte(0); // HTY
        writeByte(2); // IdU
        writeByte(0x11); // HTU
        writeByte(3); // IdV
        writeByte(0x11); // HTV
        writeByte(0); // Ss
        writeByte(0x3f); // Se
        writeByte(0); // Bf
    }

    function processDU(CDU, fdtbl, DC, HTDC, HTAC){
        var EOB = HTAC[0x00];
        var M16zeroes = HTAC[0xF0];
        var pos;
        const I16 = 16;
        const I63 = 63;
        const I64 = 64;
        var DU_DCT = fDCTQuant(CDU, fdtbl);
        //ZigZag reorder
        for (var j=0;j<I64;++j) {
            DU[ZigZag[j]]=DU_DCT[j];
        }
        var Diff = DU[0] - DC; DC = DU[0];
        //Encode DC
        if (Diff==0) {
            writeBits(HTDC[0]); // Diff might be 0
        } else {
            pos = 32767+Diff;
            writeBits(HTDC[category[pos]]);
            writeBits(bitcode[pos]);
        }
        //Encode ACs
        var end0pos = 63; // was const... which is crazy
        for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
        //end0pos = first element in reverse order !=0
        if ( end0pos == 0) {
            writeBits(EOB);
            return DC;
        }
        var i = 1;
        var lng;
        while ( i <= end0pos ) {
            var startpos = i;
            for (; (DU[i]==0) && (i<=end0pos); ++i) {}
            var nrzeroes = i-startpos;
            if ( nrzeroes >= I16 ) {
                lng = nrzeroes>>4;
                for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
                    writeBits(M16zeroes);
                nrzeroes = nrzeroes&0xF;
            }
            pos = 32767+DU[i];
            writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
            writeBits(bitcode[pos]);
            i++;
        }
        if ( end0pos != I63 ) {
            writeBits(EOB);
        }
        return DC;
    }

    function initCharLookupTable(){
        var sfcc = String.fromCharCode;
        for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
            clt[i] = sfcc(i);
        }
    }

    this.encode = function(image,quality) // image data object
    {
        var time_start = new Date().getTime();

        if(quality) setQuality(quality);

        // Initialize bit writer
        byteout = new Array();
        bytenew=0;
        bytepos=7;

        // Add JPEG headers
        writeWord(0xFFD8); // SOI
        writeAPP0();
        writeDQT();
        writeSOF0(image.width,image.height);
        writeDHT();
        writeSOS();


        // Encode 8x8 macroblocks
        var DCY=0;
        var DCU=0;
        var DCV=0;

        bytenew=0;
        bytepos=7;


        this.encode.displayName = "_encode_";

        var imageData = image.data;
        var width = image.width;
        var height = image.height;

        var quadWidth = width*4;
        var tripleWidth = width*3;

        var x, y = 0;
        var r, g, b;
        var start,p, col,row,pos;
        while(y < height){
            x = 0;
            while(x < quadWidth){
                start = quadWidth * y + x;
                p = start;
                col = -1;
                row = 0;

                for(pos=0; pos < 64; pos++){
                    row = pos >> 3;// /8
                    col = ( pos & 7 ) * 4; // %8
                    p = start + ( row * quadWidth ) + col;

                    if(y+row >= height){ // padding bottom
                        p-= (quadWidth*(y+1+row-height));
                    }

                    if(x+col >= quadWidth){ // padding right
                        p-= ((x+col) - quadWidth +4)
                    }

                    r = imageData[ p++ ];
                    g = imageData[ p++ ];
                    b = imageData[ p++ ];


                    /* // calculate YUV values dynamically
                     YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                     UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                     VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                     */

                    // use lookup table (slightly faster)
                    YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
                    UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
                    VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;

                }

                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                x+=32;
            }
            y+=8;
        }


        ////////////////////////////////////////////////////////////////

        // Do the bit alignment of the EOI marker
        if ( bytepos >= 0 ) {
            var fillbits = [];
            fillbits[1] = bytepos+1;
            fillbits[0] = (1<<(bytepos+1))-1;
            writeBits(fillbits);
        }

        writeWord(0xFFD9); //EOI

        var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

        byteout = [];

        // benchmarking
        var duration = new Date().getTime() - time_start;
        // console.log('Encoding time: '+ duration + 'ms');
        //

        return jpegDataUri
    }

    function setQuality(quality){
        if (quality <= 0) {
            quality = 1;
        }
        if (quality > 100) {
            quality = 100;
        }

        if(currentQuality == quality) return // don't recalc if unchanged

        var sf = 0;
        if (quality < 50) {
            sf = Math.floor(5000 / quality);
        } else {
            sf = Math.floor(200 - quality*2);
        }

        initQuantTables(sf);
        currentQuality = quality;
        // console.log('Quality set to: '+quality +'%');
    }

    function init(){
        var time_start = new Date().getTime();
        if(!quality) quality = 50;
        // Create tables
        initCharLookupTable()
        initHuffmanTbl();
        initCategoryNumber();
        initRGBYUVTable();

        setQuality(quality);
        var duration = new Date().getTime() - time_start;
        // console.log('Initialization '+ duration + 'ms');
    }

    init();

};

// helper function to get the imageData of an existing image on the current page.
function getImageDataFromImage(idOrElement){
    var theImg = (typeof(idOrElement)=='string')? document.getElementById(idOrElement):idOrElement;
    var cvs = document.createElement('canvas');
    cvs.width = theImg.width;
    cvs.height = theImg.height;
    var ctx = cvs.getContext("2d");
    ctx.drawImage(theImg,0,0);

    return (ctx.getImageData(0, 0, cvs.width, cvs.height));
}
var BinaryFile = function(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;

	this.getRawData = function() {
		return data;
	}

	if (typeof strData == "string") {
		dataLength = iDataLength || data.length;

		this.getByteAt = function(iOffset) {
			return data.charCodeAt(iOffset + dataOffset) & 0xFF;
		}

		this.getBytesAt = function(iOffset, iLength) {
			var aBytes = [];

			for (var i = 0; i < iLength; i++) {
				aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
			};

			return aBytes;
		}
	} else if (typeof strData == "unknown") {
		dataLength = iDataLength || IEBinary_getLength(data);

		this.getByteAt = function(iOffset) {
			return IEBinary_getByteAt(data, iOffset + dataOffset);
		}

		this.getBytesAt = function(iOffset, iLength) {
			return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
		}
	}

	this.getLength = function() {
		return dataLength;
	}

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	}

	this.getShortAt = function(iOffset, bBigEndian) {
		var iShort = bBigEndian ?
			(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
			: (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
		if (iShort < 0) iShort += 65536;
		return iShort;
	}
	this.getSShortAt = function(iOffset, bBigEndian) {
		var iUShort = this.getShortAt(iOffset, bBigEndian);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	}
	this.getLongAt = function(iOffset, bBigEndian) {
		var iByte1 = this.getByteAt(iOffset),
			iByte2 = this.getByteAt(iOffset + 1),
			iByte3 = this.getByteAt(iOffset + 2),
			iByte4 = this.getByteAt(iOffset + 3);

		var iLong = bBigEndian ?
			(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
			: (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
		if (iLong < 0) iLong += 4294967296;
		return iLong;
	}
	this.getSLongAt = function(iOffset, bBigEndian) {
		var iULong = this.getLongAt(iOffset, bBigEndian);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	}

	this.getStringAt = function(iOffset, iLength) {
		var aStr = [];

		var aBytes = this.getBytesAt(iOffset, iLength);
		for (var j=0; j < iLength; j++) {
			aStr[j] = String.fromCharCode(aBytes[j]);
		}
		return aStr.join("");
	}

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	}
	this.toBase64 = function() {
		return window.btoa(data);
	}
	this.fromBase64 = function(strBase64) {
		data = window.atob(strBase64);
	}
}


var BinaryAjax = (function() {

	function createRequest() {
		var oHTTP = null;
		if (window.ActiveXObject) {
			oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			oHTTP = new XMLHttpRequest();
		}
		return oHTTP;
	}

	function getHead(strURL, fncCallback, fncError) {
		var oHTTP = createRequest();
		if (oHTTP) {
			if (fncCallback) {
				if (typeof(oHTTP.onload) != "undefined") {
					oHTTP.onload = function() {
						if (oHTTP.status == "200") {
							fncCallback(this);
						} else {
							if (fncError) fncError();
						}
						oHTTP = null;
					};
				} else {
					oHTTP.onreadystatechange = function() {
						if (oHTTP.readyState == 4) {
							if (oHTTP.status == "200") {
								fncCallback(this);
							} else {
								if (fncError) fncError();
							}
							oHTTP = null;
						}
					};
				}
			}
			oHTTP.open("HEAD", strURL, true);
			oHTTP.send(null);
		} else {
			if (fncError) fncError();
		}
	}

	function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
		var oHTTP = createRequest();
		if (oHTTP) {

			var iDataOffset = 0;
			if (aRange && !bAcceptRanges) {
				iDataOffset = aRange[0];
			}
			var iDataLen = 0;
			if (aRange) {
				iDataLen = aRange[1]-aRange[0]+1;
			}

			if (fncCallback) {
				if (typeof(oHTTP.onload) != "undefined") {
					oHTTP.onload = function() {
						if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
							oHTTP.binaryResponse = new BinaryFile(oHTTP.responseText, iDataOffset, iDataLen);
							oHTTP.fileSize = iFileSize || oHTTP.getResponseHeader("Content-Length");
							fncCallback(oHTTP);
						} else {
							if (fncError) fncError();
						}
						oHTTP = null;
					};
				} else {
					oHTTP.onreadystatechange = function() {
						if (oHTTP.readyState == 4) {
							if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
								// IE6 craps if we try to extend the XHR object
								var oRes = {
									status : oHTTP.status,
									// IE needs responseBody, Chrome/Safari needs responseText
									binaryResponse : new BinaryFile(
										typeof oHTTP.responseBody == "unknown" ? oHTTP.responseBody : oHTTP.responseText, iDataOffset, iDataLen
									),
									fileSize : iFileSize || oHTTP.getResponseHeader("Content-Length")
								};
								fncCallback(oRes);
							} else {
								if (fncError) fncError();
							}
							oHTTP = null;
						}
					};
				}
			}
			oHTTP.open("GET", strURL, true);

			if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

			if (aRange && bAcceptRanges) {
				oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
			}

			oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

			oHTTP.send(null);
		} else {
			if (fncError) fncError();
		}
	}

	return function(strURL, fncCallback, fncError, aRange) {

		if (aRange) {
			getHead(
				strURL,
				function(oHTTP) {
					var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"),10);
					var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

					var iStart, iEnd;
					iStart = aRange[0];
					if (aRange[0] < 0)
						iStart += iLength;
					iEnd = iStart + aRange[1] - 1;

					sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
				}
			);

		} else {
			sendRequest(strURL, fncCallback, fncError);
		}
	}

}());

/*
document.write(
	"<script type='text/vbscript'>\r\n"
	+ "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
	+ "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
	+ "End Function\r\n"
	+ "Function IEBinary_getLength(strBinary)\r\n"
	+ "	IEBinary_getLength = LenB(strBinary)\r\n"
	+ "End Function\r\n"
	+ "</script>\r\n"
);
*/

document.write(
	"<script type='text/vbscript'>\r\n"
	+ "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
	+ "	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n"
	+ "End Function\r\n"
	+ "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n"
	+ "  Dim aBytes()\r\n"
	+ "  ReDim aBytes(iLength - 1)\r\n"
	+ "  For i = 0 To iLength - 1\r\n"
	+ "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n"
	+ "  Next\r\n"
	+ "  IEBinary_getBytesAt = aBytes\r\n"
	+ "End Function\r\n"
	+ "Function IEBinary_getLength(strBinary)\r\n"
	+ "	IEBinary_getLength = LenB(strBinary)\r\n"
	+ "End Function\r\n"
	+ "</script>\r\n"
);
var EXIF = (function() {

    var debug = false;

    var ExifTags = {

        // version tags
        0x9000 : "ExifVersion",			// EXIF version
        0xA000 : "FlashpixVersion",		// Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",			// Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",		// Valid width of meaningful image
        0xA003 : "PixelYDimension",		// Valid height of meaningful image
        0x9101 : "ComponentsConfiguration",	// Information about channels
        0x9102 : "CompressedBitsPerPixel",	// Compressed bits per pixel

        // user information
        0x927C : "MakerNote",			// Any desired information written by the manufacturer
        0x9286 : "UserComment",			// Comments by user

        // related file
        0xA004 : "RelatedSoundFile",		// Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",		// Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",		// Date and time when the image was stored digitally
        0x9290 : "SubsecTime",			// Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",		// Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",		// Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",		// Exposure time (in seconds)
        0x829D : "FNumber",			// F number
        0x8822 : "ExposureProgram",		// Exposure program
        0x8824 : "SpectralSensitivity",		// Spectral sensitivity
        0x8827 : "ISOSpeedRatings",		// ISO speed rating
        0x8828 : "OECF",			// Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",		// Shutter speed
        0x9202 : "ApertureValue",		// Lens aperture
        0x9203 : "BrightnessValue",		// Value of brightness
        0x9204 : "ExposureBias",		// Exposure bias
        0x9205 : "MaxApertureValue",		// Smallest F number of lens
        0x9206 : "SubjectDistance",		// Distance to subject in meters
        0x9207 : "MeteringMode", 		// Metering mode
        0x9208 : "LightSource",			// Kind of light source
        0x9209 : "Flash",			// Flash status
        0x9214 : "SubjectArea",			// Location and area of main subject
        0x920A : "FocalLength",			// Focal length of the lens in mm
        0xA20B : "FlashEnergy",			// Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",	//
        0xA20E : "FocalPlaneXResolution", 	// Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution", 	// Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit", 	// Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",		// Location of subject in image
        0xA215 : "ExposureIndex",		// Exposure index selected on camera
        0xA217 : "SensingMethod", 		// Image sensor type
        0xA300 : "FileSource", 			// Image source (3 == DSC)
        0xA301 : "SceneType", 			// Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",			// Color filter array geometric pattern
        0xA401 : "CustomRendered",		// Special processing
        0xA402 : "ExposureMode",		// Exposure mode
        0xA403 : "WhiteBalance",		// 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",		// Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",	// Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",		// Type of scene
        0xA407 : "GainControl",			// Degree of overall image gain adjustment
        0xA408 : "Contrast",			// Direction of contrast processing applied by camera
        0xA409 : "Saturation", 			// Direction of saturation processing applied by camera
        0xA40A : "Sharpness",			// Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",	//
        0xA40C : "SubjectDistanceRange",	// Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"		// Identifier assigned uniquely to each image
    };

    var TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

    var StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            img.exifdata = data || {};
            if (callback) {
                callback.call(img)
            }
        }

        if (img instanceof Image || img instanceof HTMLImageElement) {
            BinaryAjax(img.src, function(http) {
                handleBinaryFile(http.binaryResponse);
            });
        } else if (window.FileReader && img instanceof window.File) {
            var fileReader = new FileReader();

            fileReader.onload = function(e) {
				if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

	function findEXIFinJPEG(file) {
		var dataView = new DataView(file);

		if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + file.getByteAt(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
			if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }


    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (var n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:	// rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

	function getStringFromDB(buffer, start, length) {
		var outstr = "";
		for (n = start; n < start+length; n++) {
			outstr += String.fromCharCode(buffer.getUint8(n));
		}
		return outstr;
	}

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

		if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        if (file.getUint32(tiffOffset+4, !bigEnd) != 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset not 8)", file.getUint16(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset+8, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]]
                            + StringValues.Components[exifData[tag][1]]
                            + StringValues.Components[exifData[tag][2]]
                            + StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0]
                            + "." + gpsData[tag][1]
                            + "." + gpsData[tag][2]
                            + "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }


    function getData(img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;
        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    function getTag(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }

    function getAllTags(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    function pretty(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    function readFromBinaryFile(file) {
        return findEXIFinJPEG(file);
    }


    return {
        readFromBinaryFile : readFromBinaryFile,
        pretty : pretty,
        getTag : getTag,
        getAllTags : getAllTags,
        getData : getData,

        Tags : ExifTags,
        TiffTags : TiffTags,
        GPSTags : GPSTags,
        StringValues : StringValues
    };

})();

/**
 * 多图压缩上传功能，兼容ios&android,同是可以用作多文件上传
 * compress.upload.images
 * @package src/
 * @author rockywu wjl19890427@hotmail.com
 * @created 09-09-2014
 * @site www.rockywu.com
 */
;(function() {
    var prefix = 'debug-';
    function getNowTimeStamp() {
        return +new Date();
    }
    var debugTime = {
        begin : function(name) {
            this.list[prefix + name] = {};
            this.list[prefix + name]['begin'] = getNowTimeStamp();
        },
        end : function(name) {
            if(this.list[prefix + name] === undefined) {
                return;
            }
            this.list[prefix + name]['end'] = getNowTimeStamp();
            this.list[prefix + name]['time'] = this.list[prefix + name].end - this.list[prefix + name].begin;
        },
        all : function() {
            var key,
                result = {};
            for(var k in this.list) {
                key = k.split(prefix)[1];
                if(!key) {
                    continue;
                }
                if(typeof this.list[k].time !== 'undefined') {
                    result[key] = this.list[k].time;
                }
            }
            return result;
        },
        list : {}
    }
    window.debugTime = debugTime;
}).call(this);
;APF.Namespace.register("userTouch.plugin");
;(function(T) {
    "use strict";
    var CUI,
        Tools = {
            extend : function(a,b) {
                var k;
                for(k in b) {
                    a[k] = b[k];
                }
                return a;
            },
            rotate : function (canvasTarget, image, w, h,orientation){
                if(orientation==6 || orientation==8){
                    canvasTarget.width = h;
                    canvasTarget.height = w;
                }else{
                    canvasTarget.width = w;
                    canvasTarget.height = h;
                }
                var ctxtarget = canvasTarget.getContext("2d");
                if(orientation==6){
                    ctxtarget.translate(h, 0);
                    ctxtarget.rotate(Math.PI / 2);
                }else if(orientation==8){
                    ctxtarget.translate(0,w);
                    ctxtarget.rotate(270*Math.PI/180 );
                }else if(orientation==3){
                    ctxtarget.translate(w,h);
                    ctxtarget.rotate(Math.PI );
                }
                ctxtarget.drawImage(image, 0, 0);
            }
        };
    CUI = function(params) {
        this.callbackFuns = [
            'onSelect',     //文件选择后
            'onDelete',     //文件删除后
            'onProgress',   //文件上传进度
            'onSuccess',    //文件上传成功时
            'onFailure',    //文件上传失败时,
            'onComplete',   //文件全部上传完毕时
            'onMessage',    //文件上传时出现报错提示
            'onCheckFile',  //自定义验证是否多次上传
            'onRepeat',     //重复上传判断
            'onShowImg'     //展示图片
        ];
        this.defParams = {
            file : null,        //input file dom对象
            uploadUrl : null,   //上传地址
            maxWidth : 0,       //图片压缩最大宽度像素默认为0，不压缩
            maxHeight : 0,      //图片压缩最大高度像素默认为0，不压缩
            inputName : 'file', //设置默认提交的input name 为file
            imageQuality : 100,  //默认图片压缩质量为100%
        };
        this.ListIndex = 0;
        this.params = Tools.extend(this.defParams, params);   //统一参数
        this.params.maxWidth = parseInt(this.params.maxWidth);
        this.params.maxHeight = parseInt(this.params.maxHeight);
        this.filesFilter = [];   //文件过滤器
        this.filesName = [];    //文件名保存器
        this.defBoundary = "--image-someboundary--";
        this.init();            //初始化回调方法
    }
    CUI.prototype = {
        constructor : CUI,
        init : function(p) {
            var k,fun;
            for(k in this.callbackFuns) {
                fun = this.callbackFuns[k];
                if(typeof this.params[fun] === 'function') {
                    this[fun] = this.params[fun];
                } else if( typeof this[fun] !== 'function') {
                    this[fun] = function() {};
                }
            }
        },
        onMessage : function(msg) {
            // console.log(msg);
        },
        upload : function() {
            var files, k;
            if(typeof this.params.file === 'string') {
                this.params.file = document.querySelector(this.params.file);
            }
            if(typeof this.params.file.files === 'undefined') {
                this.onMessage('请输入input file对象');
                return false;
            }
            files = this.params.file.files;
            if(files.length < 1 ) {
                this.onMessage('请选择上传的文件');
                return false;
            }
            if(!this.onCheckFile(files)) {
                return false;
            }
            for(k = 0; k < files.length; k++) {
                if(!this.checkFile(files[k])) {
                    continue;
                }
                this.onSelect(this.ListIndex, files[k]);
                if(files[k].type  === "image/jpeg") {
                    if(this.params.maxWidth > 0 && this.params.maxHeight > 0) {
                        this.compressUpload(this.ListIndex, files[k]);
                    } else {
                        this.doUpload(this.ListIndex, files[k]);
                    }
                } else {
                    this.doUpload(this.ListIndex, files[k]);
                }
                this.ListIndex++;
            }
        },
        checkFile : function(file) {
            var k, tmp;
            for(k=0; k <= this.filesName.length; k++) {
                if(this.filesName[k] === file.name + file.size) {
                    this.onRepeat(file);
                    return false;
                }
            }
            this.filesName.push(file.name + file.size);
            this.filesFilter.push(file.name + file.size);
            return true;
        },
        deleteFile : function(index, file) {
            var k, tmp = this.filesFilter;
            for(k=0; k <= tmp.length; k++) {
                if(tmp[k] === file.name + file.size) {
                    this.filesFilter.splice(k, 1);
                    return true;
                }
            }
        },
        deleteFileName : function(file) {
            var k;
            for(k=0; k <= this.filesName.length; k++) {
                if(this.filesName[k] === file.name + file.size) {
                    this.filesName.splice(k, 1);
                }
            }
        },
        onCheckFile :function(file) {
            return true;
        },
        doUpload :function(index, file, data, boundary) {
            var self = this,
                formData,
                xhr = new XMLHttpRequest();    //初始化xhr对象
            if(!xhr.upload) {
                this.onMessage('浏览器无法使用xhr.upload对象');
                return false;
            }
            // 文件上传中
            xhr.upload.addEventListener("progress", function(e) {
                self.onProgress(index, file, e.loaded, e.total);
            });
            // 文件上传成功或是失败
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        debugTime.end('uploadTime');
                        debugTime.begin("fileSize:"+file.size);
                        debugTime.end("fileSize:"+file.size);
                        self.onSuccess(index, file, xhr.responseText);
                        self.deleteFile(index, file);
                        if (!self.filesFilter.length) {
                            //全部完毕
                            self.onComplete();
                            var runtime = JSON.stringify(debugTime.all());
                            self.params.file.value='';
                        }
                    } else {
                        self.onFailure(index, file, xhr.responseText);
                    }
                }
            };
            // 开始上传
            xhr.open("POST", this.params.uploadUrl, true);
            if(typeof data === 'undefined' || data === '') {
                formData = new FormData();
                formData.append('file', file);
                xhr.send(formData);
            } else {
                boundary = boundary || this.params.defBoundary;
                if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                    XMLHttpRequest.prototype.sendAsBinary = function(string) {
                        var bytes = Array.prototype.map.call(string, function(c) {
                            return c.charCodeAt(0) & 0xff;
                        });
                        this.send(new Uint8Array(bytes).buffer);
                    };
                }
                debugTime.begin('base64Time');
                var myEncoder = new JPEGEncoder(this.params.imageQuality),//实例化一个jpeg的转码器
                    JPEGImage = myEncoder.encode(data, this.params.imageQuality);//将图片位图保存为用JPEG编码的格式的字节数组
                    data = JPEGImage.substr(23);
                      //删除base64头
                debugTime.end('base64Time');
                debugTime.begin('uploadTime');
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + this.params.inputName + '"; filename="' + encodeURI(file.name) + '"', 'Content-Type: ' + file.type, '', atob(data), '--' + boundary + '--'].join('\r\n'));
            }
        },
        base64Upload : function(data, boundary) {
            var xhr = new XMLHttpRequest(),
                index = this.ListIndex,
                file = {},
                self = this;    //初始化xhr对象
            file = {
                name : "cordova.jpg",
                size : data.length,
            }
            if(!this.onCheckFile(data)) {
                return false;
            }
            if(!xhr.upload) {
                this.onMessage('浏览器无法使用xhr.upload对象');
                return false;
            }
            if(!this.checkFile(file)) {
                return false;
            }
            this.onSelect(index, data);
            this.onShowImg(index, file, "data:image/jpeg;base64," + data);
            // 文件上传中
            xhr.upload.addEventListener("progress", function(e) {
                self.onProgress(index, e.loaded, e.total);
            });
            // 文件上传成功或是失败
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        self.onSuccess(index, file, xhr.responseText);
                        self.onComplete();
                    } else {
                        self.onFailure(index);
                    }
                }
            };
            // 开始上传
            xhr.open("POST", this.params.uploadUrl, true);
            boundary = boundary || this.params.defBoundary;
            if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
                XMLHttpRequest.prototype.sendAsBinary = function(string) {
                    var bytes = Array.prototype.map.call(string, function(c) {
                        return c.charCodeAt(0) & 0xff;
                    });
                    this.send(new Uint8Array(bytes).buffer);
                };
            }
            //删除base64头
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            var ss = [
                '--' + boundary,
                'Content-Disposition: form-data; name="' + this.params.inputName + '"; filename="' + encodeURI(file.name) + '"',
                'Content-Type: image/jpeg',
                '',
                atob(data),
                '--' + boundary + '--'
            ];
            xhr.sendAsBinary(ss.join('\r\n'));
            this.ListIndex++;
        },
        compressUpload : function(index, file) {
            var self = this,
                reader = new FileReader(),
                img = document.createElement('img');
            reader.readAsDataURL(file);
            debugTime.begin('fileReadertime');
            reader.onload = function(e) {
                img.src = this.result;
                self.onShowImg(index, file, this.result);
                debugTime.end('fileReadertime');
            }
            img.onload = function() {
                var width = 0,
                    height = 0,
                    base64 = '',
                    mpImg = new MegaPixImage(file),
                    orientation = 1, //照片方向值
                    tmpImg = document.createElement('img');
                if(img.width < self.params.maxWidth && img.height < self.params.maxHeight) {
                    width = img.width;
                    height = img.height;
                } else {
                    if(img.width / self.params.maxWidth > img.height / self.params.maxHeight ) {
                        width = self.params.maxWidth;
                        height = parseInt(img.height * self.params.maxWidth / img.width);
                    } else {
                        width = parseInt(img.width * self.params.maxHeight / img.height);
                        height = self.params.maxHeight;
                    }
                }
                var isMobile = {
                    Android: function() {
                        return /Android/i.test(navigator.userAgent);
                    },
                    iOS: function() {
                        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    },
                    Windows: function() {
                        return /IEMobile/i.test(navigator.userAgent);
                    },
                    any: function() {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
                    }
                };
                if(isMobile.iOS()){
                    debugTime.begin('iosRenderTime');
                    mpImg.render(tmpImg, {maxWidth: width, maxHeight: height });
                    EXIF.getData(file, function() {
                        orientation=EXIF.getTag(this,'Orientation');
                        tmpImg.onload=function(){
                            debugTime.end('iosRenderTime');
                            var tmpCvs = document.createElement("canvas"),
                                tmpCtx = tmpCvs.getContext('2d'),
                                data = '';
                            Tools.rotate(tmpCvs, tmpImg, width, height, orientation);
                            if(orientation == 6 || orientation == 8){
                                data = tmpCtx.getImageData(0, 0, height, width);
                            } else {
                                data = tmpCtx.getImageData(0, 0, width, height);
                            }
                            self.doUpload(index, file, data, "userTouch-someboundary");
                        }
                    });
                }else{
                    debugTime.begin('androidRenderTime');
                    var cvs = document.createElement("canvas"),
                    ctx = cvs.getContext('2d');
                    cvs.width = width;
                    cvs.height = height;
                    ctx.drawImage(img,0,0,width,height);
                    tmpImg.src = cvs.toDataURL("image/jpeg",0.4);
                    tmpImg.onload = function(){
                        debugTime.end('androidRenderTime');
                        EXIF.getData(file, function() {
                            orientation=EXIF.getTag(this,'Orientation');
                            var tmpCvs = document.createElement("canvas"),
                                tmpCtx = tmpCvs.getContext('2d'),
                                data = '';
                            Tools.rotate(tmpCvs, tmpImg, width, height, orientation);
                            if(orientation == 6 || orientation == 8){
                                data = tmpCtx.getImageData(0, 0, height, width);
                            } else {
                                data = tmpCtx.getImageData(0, 0, width, height);
                            }
                            self.doUpload(index, file, data, "userTouch-someboundary");
                        });
                    }
                }
            }
        }
    };

    window.CUI = CUI;
    userTouch.plugin.CUI = CUI;
})(window.T || {});
/**
* 基于kfstouch、compress.upload.images的图片上传组件
* 改为同一页面上可以引用多次，@wrapperSlter参数为从业务传入的上传组件的外层选择器
* 引用组件会生成实例：userTouch.compressUpload["" || "0"]
* 可调用的方法：1.getUploadedHash 返回已成功上传的hash数组 2.getSltedName返回所有图片的名字组成的数组（包括已上传、未上传）
* modified by yaohuiwang 2016.06.02
*/
;APF.Namespace.register('userTouch');
;APF.Namespace.register('userTouch.compressUpload');
(function($) {
  userTouch.CompressUpload = function(p){
    this.maxNum     = p.maxNum || 10;
    this.onceMaxNum = p.onceMaxNum || 10;
    this.maxWidth  = p.maxWidth;
    this.maxHeight = p.maxHeight;
    this.init(p);
    this.events();
  }

  userTouch.CompressUpload.prototype = {
    constructor: userTouch.CompressUpload,
    init : function (p) {
        var self = this;
        this.p = {
            fileInput  : '.uploadBtn',
            upImgBox   : '.upImgBox',
            errorMsg   : '.errorMsg',
            imgMsg     : '.imgmsg',
            wrapImg    : '.wrapImg',
            picPopu    : '.picpopu',
            fileButton : '.file-button',
            swipeImg   : '.swipeImg',
            pdCurrent  : '.p_current',
            pTotal     : '.p_total'
        };
        this.errorMessage = {
            'repeatUpload' : '请勿重复上传',
            'maxNumber'    : '上传图片不能超过' + self.maxNum + '张',
            'onceMaxNum'   : '一次最多上传' + self.onceMaxNum + '张'
        };

        // 支持引用多次
        if(p.wrapperSlter) {
            self.p.upImgBox   = p.wrapperSlter;
            self.p.fileInput  = $(p.wrapperSlter).find(".uploadBtn");
            self.p.upImgList  = $(p.wrapperSlter).find(".up-img-list");
            self.p.errorMsg   = $(p.wrapperSlter).find(".errorMsg");
            self.p.wrapImg    = $(p.wrapperSlter).find(".wrapImg");
            self.p.fileButton = $(p.wrapperSlter).find(".fileButton");
            self.p.swipeImg   = $(p.wrapperSlter).find(".swipeImg");
            self.p.imgMsg     = $(p.wrapperSlter).find(".imgMsg");
            self.p.picPopu    = $(p.wrapperSlter).find(".picpopu");
            self.p.pdCurrent  = $(p.wrapperSlter).find(".p_current");
            self.p.pTotal     = $(p.wrapperSlter).find(".p_total");
        }
        this.uploadUrl = p.uploadUrl;
        this.postUrl = p.postUrl;
        this.defImgSrc = p.defImgSrc;
        this.dpListUrl = p.dpListUrl;
        this.loginProcess = p.login_process;
        this.thirdPartyLogin = p.third_party_login;
        this.pushLock = true;
        this.swipe = {};
        this.file = [];
    },
    events : function () {
        var self = this;
        //添加多图上传功能
        this.multiImageUpload();
        //上传图片限制
        this.imgController();
        this.deleteImg();
    },
    imgController: function(){
        var self = this,
            numClick = true,
            areaClick = true;
        $(self.p.fileButton).on('click',function(){
            if(numClick){
                numClick = false;
            }
        })
    },
    //swipe绑定
    bindSwipe: function(swipe, index, op) {
        var self = this,
        defaults = {
            startSlide: index,
            speed: 400,
            continuous: false,
            disableScroll: false,
            stopPropagation: false,
            callback: function(index, elem) {},
            transitionEnd: function(index, elem) {}
        };
        self.swipe.kill && self.swipe.kill();
        self.swipe = new Swipe(swipe, $.extend(defaults, op));
    },
    //查看大图
    viewPicBind : function(file, lg) {
        var self = this,
            father;
        $(self.p.upImgBox).find('.upload-img-'+lg).on('click',function(){
            $(self.p.picPopu).css({'display':'-webkit-box'});
            $(".upload-wrap").find(".picpopu").hide();
            $(this).parents(".upload-wrap").children(".picpopu").css({'display':'-webkit-box'});
            // T.replaceImg(this,'data-src');
            var index,
                that = this;
            $.each( self.boxBig.find(".up-img"), function(k, v) {
                if( $(v).attr("data-hash") === $(that).attr("data-hash") ) {
                    index = $(v).index();
                }
            } );

            self.bindSwipe($(self.p.swipeImg).get(0), index , {
                callback: function(index, elem) {
                    $(self.p.pdCurrent).text(index+1);
                    // T.replaceImg(elem,'data-src');
                }
            });
            $(self.p.pdCurrent).text(self.swipe.getPos()+1);
            $(self.p.pTotal).text(self.swipe.getNumSlides());
        })
    },
    //图片删除
    deleteImg:function(){
        var self = this;
        $(self.p.picPopu).find('.i-detele').on('click', function(e) {
            var pos = self.swipe.getPos();
            var wrapimg =  $(self.p.wrapImg).find('.up-img').eq(pos);
            var filename = wrapimg.find('img').attr('data-filename');
            for(i in self.file){
                if(self.file[i].name == filename){
                    if(typeof self.file[i] !== 'undefined') {
                        self.CUI.deleteFileName(self.file[i]);
                        delete self.file[i];
                    }
                }
            }
            wrapimg.remove();
            var upImgWraps = $(self.p.upImgBox).find('.upImgBox .up-img');
            $.each(upImgWraps, function(k, v) {
                if( $(wrapimg).data("hash") === $(v).data("hash") ) {
                    $(v).remove();
                }
            });

            $(self.p.picPopu).hide();
            var imglen = $(self.p.upImgBox).find('.upImgBox img').length;
            if(imglen <= self.maxNum){
                $(self.p.fileButton).show();
            }
        });
        $('.i_close').click(function(){
            $(self.p.picPopu).hide();
        })
        $(self.p.upImgBox).on("click", ".deleteFailBtn", function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            var filename = $(this).parent().find("img").data("filename");
            for(i in self.file){
                if(self.file[i].name == filename){
                    if(typeof self.file[i] !== 'undefined') {
                        self.CUI.deleteFileName(self.file[i]);
                        delete self.file[i];
                    }
                }
            }
            $(this).parent().remove();
            var imglen = $(self.p.upImgBox).find('.upImgBox img').length;
            if(imglen <= self.maxNum){
                $(self.p.fileButton).show();
            }
        });
    },
    //文件上传是否成功
    xmlhttprequest: function(url, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        if(typeof success !== 'function') {
            success = function() {}
        }
        if(typeof fail !== 'function') {
            fail = function() {}
        }
        // 文件上传成功或是失败
        xhr.onreadystatechange = function(e) {
           if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    success(xhr.responseText);
                } else {
                    fail();
                }
            }
        };
    },
    //多图上传
    multiImageUpload : function() {
        var self = this;
        self.CUI = new userTouch.plugin.CUI({
            maxWidth : self.maxWidth,
            maxHeight : self.maxHeight,
            uploadUrl : self.uploadUrl,
            inputName : 'file',
            file : $(self.p.fileInput).get(0),
            onSuccess : function(index, file, response) {

                //动态进度条
                var box = $(self.p.upImgBox).find('.upload-img-' + index),
                    data;
                if(box.length < 1) {
                    return false;
                }
                box.find('.i-line').css({'width' : '100%'});
                setTimeout(function() {
                    box.find('.i-shade,.i-progress').remove();
                }, 1000);

                data = $.parseJSON(response);
                box.data('hash', data.image.hash);
                box.data('host', data.image.host);
                $(self.p.imgMsg).hide();

                $(box).attr("data-failed", "0"); // 去掉失败标记
                self.boxBig.empty();
                $.each($(self.p.upImgBox).find('.up-img'), function(k, v) {
                    if( $(v).attr("data-failed") === "0" ) {
                        var $v = $(v).clone();
                        $v.find(".i-shade").remove();
                        $v.find(".i-progress").remove();
                        self.boxBig.append($v);
                        self.boxBig.find(".deleteFailBtn").remove();
                        self.boxBig.find(".fail-doc").remove();
                    }
                });

                //绑定删除图片功能
                self.viewPicBind(file, index);

                self.pushLock = true;

                // 如果是上传错误后完成的，去掉覆盖在图片上的错误信息
                box.find(".deleteFailBtn").remove();
                box.find(".fail-doc").remove();
            },
            onProgress : function(index, file, loaded, total) {
                //动态进度条
                var box = $(self.p.upImgBox).find('.upload-img-' + index),
                    ratio = parseInt(loaded/total*100),
                    k;
                box.find('.i-line').css({'width' : ratio + '%'});
            },
            onSelect : function(index, file) {

                var imglen = $(self.p.upImgBox).find('.upImgBox img').length;
                if( imglen + 1 > self.maxNum ) {
                    $(self.p.fileButton).hide();
                    return;
                }

                //插入缩略图
                var box = $(self.p.upImgBox),
                    boxBig = $(self.p.wrapImg),
                    reader = new FileReader(),
                    imglen = $(self.p.upImgBox).find('.upImgBox img').length,
                    img = document.createElement('img'),
                    img2 = document.createElement('img'),
                    html2,
                    shtml,
                    html;
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    img.src = this.result;
                    img.setAttribute('data-filename', file.name);
                    img2.src = this.result;
                    img2.setAttribute('data-filename', file.name);
                }
                shtml= '<div class="up-img upload-img-'+index+'" data-index='+ index +'>'
                html = shtml + '<div class="i-shade"></div><div class="i-progress"><div class="B-60AD00 i-line"></div></div></div>';
                html2 = shtml + '</div>';
                self.uploadedImgItem = $(html).append($(img));
                self.uploadedImgItemBig = $(html2).append($(img2));
                self.boxBig = boxBig;
                $(self.p.fileButton).before(self.uploadedImgItem);

                setTimeout(function() {
                    box.find('.upload-img-' + index).find('.i-line').css({'width' : '20%'});
                }, 200);
                $(self.p.imgMsg).show();
                if(imglen >= self.maxNum - 1){
                    $(self.p.fileButton).hide();
                }
                self.file.push(file);
                self.pushLock = false;
            },
            onComplete : function() {},
            onCheckFile : function(files) {

                // 超出同时上传张数限制则返回
                if( files.length > self.onceMaxNum ) {
                    self.showError(self.errorMessage.onceMaxNum);
                    return false;
                } else {
                    self.hideError();
                    return true;
                }
            },
            onMessage : function(msg) {},
            onRepeat : function(file) {
                self.showError(self.errorMessage.repeatUpload);
                self.hideError(2000);
            },
            onFailure : function(index, file, XHRresponseText) {
                var failNode;
                var upImgs = $(self.p.upImgBox).find(".up-img");
                $.each(upImgs, function(k, v) {
                    if( +$(v).data("index") === +index ) {
                        failNode = $(v);
                    }
                });

                // 添加删除按钮及提示文字
                if(!failNode) {
                    return;
                }
                failNode.append($('<i class="fail-icon deleteFailBtn"></i>'));
                failNode.append($('<div class="fail-doc"><p>上传失败</p><p>点击重新上传</p></div>'));

                failNode.attr("data-failed", "1");
                failNode.on("click.reupload", function() {
                    self.CUI.doUpload(index,file);
                    failNode.off("click.reupload");
                });
            }
        });
        $(self.p.fileInput).on('change', function(){
            self.CUI.upload();
        });
    },
    //展示错误提示
    showError : function(msg) {
        $(this.p.errorMsg).find('span').html(msg);
        $(this.p.errorMsg).removeClass('msg-hide');
    },
    //隐藏错误提示
    hideError : function(time) {
        var self = this;
        if(time !== 'undefined' && time > 0) {
            setTimeout(function() {
                $(self.p.errorMsg).addClass('msg-hide');
            }, time);
        } else {
            $(self.p.errorMsg).addClass('msg-hide');
        }
    },
    // 获取上传成功图片的hash数组
    getUploadedHash : function() {
        var self = this;
        var uploadedAry = [];
        $.each($(self.p.upImgList).find(".up-img"), function(k, v) {
            var obj = {};
            if($(v).data("failed") === "0") {
                obj.host = $(v).data("host");
                obj.hash = $(v).data("hash");
                uploadedAry.push(obj);
            }
        });
        return uploadedAry;
    },
    // 获取上传成功图片的name数组
    getSltedName : function() {
        var self = this;
        var result = [];
        $.each($(self.p.upImgList).find("img"), function(k, v) {
            result.push($(v).data("filename"));
        });
        return result;
    }
  }
})(Zepto);;(function(entrust, win) {
    entrust.Noauth = function(op) {
        this.ops = op;
        this.flag = true;
        this.init();
    };
    entrust.Noauth.prototype = {
        constructor: entrust.Noauth,
        init: function() {
            var self = this;
            this.dialog = new touch.component.module.Dialog({
                select : $('.confirm-box'),
            });

            /***如果是app**/
            var successBoxDom = $('#success_wrap');
            var appCookie = APF.Utils.getCookie("app");
            if(appCookie === 'i-ajk' || appCookie === 'a-ajk' || appCookie === '1'){
                // $('.list_header_container').hide();
                $('.app-manage').css('display','block');
                successBoxDom = $('#success_app_wrap');
            }

            // 初始化 dom
            this.doms = {
                'inputs'      : $('input'),
                'select'      : $('select'),
                'step1Box'    : $('#step-1'),
                'step2Box'    : $('#step-2'),
                'nextBtn'     : $('#next-btn'),
                'subBtn'      : $('#submit_btn'),
                'msgBtn'      : $('.getcode'),
                'codeImg'     : $('.vimg'),
                'codeBox'     : $('#code-box'),
                'formBox'     : $('#form'),
                'successBox'     : successBoxDom,
                'otherBox'     : $('#other_wrap'),
                'breakBtn'      : $('#break_btn'),
                'finishBtn'      : $('#finish_btn'),

                'phoneInput'        : $('input[name="phone"]'),
                'codeInput'         : $('input[name="code"]'),
                'propIdInput'         : $('input[name="prop_id"]'),//发房后返回的房源ID
                'safeCodeInput'       : $('input[name="safe_code"]')//发房后返回的房源安全码


            };
            this.browser = {
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return { //移动终端浏览器版本信息
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        isWx : u.indexOf('MicroMessenger') > -1, //是微信游览器
                    };
                }(),
            }
            this.formVals = {}
            self.isSend = true;
            self.isSub = true;
            // 初始化验证方法
            this.validates();
            this.bindEvent();
            this.changeDownloadLink();


        },
        bindEvent:function(){
            var self = this;
            /**第一步***/
            // 下一步输入验证
            self.doms.step1Box.find('input.required').on('input',function(){
                self.checkStep1();
            });
            $('input[name="hx-room"]').on('input',function(){
                if($(this).val()) $('input[name="hx-hall"]').focus();
            });
            $('input[name="hx-hall"]').on('input',function(){
                if($(this).val()) $('input[name="hx-toilet"]').focus();
            });
            $('#huxing').find('input').focus(function(){
                $(this).val('');
            });
            // 下一步提交
            $('#next-btn').on('click',function(){
                if(!$(this).hasClass("dis-btn")){
                    self.nextFun();
                }
            });

            /**第二步***/
            // select选择
            self.doms.select.on('change',function(){
                var errMsg = $(this).attr('data-err');
                $(this).prev('span').text($(this).find('option').not(function(){ return !this.selected }).text());
                $(this).next('input').val($(this).val());
                $(this).prev('span').removeClass('disabled');
                if($(this).val() == ''){
                    $(this).prev('span').addClass('disabled');
                    $(this).prev('span').text($(this).attr('data-err'));
                    self.showMsg(errMsg);
                    return false;
                }
                self.checkStep2();
            });
            //验证提交按钮可点击状态
            self.doms.step2Box.find('input.required').on('input',function(){
                self.checkStep2();
            });
            // 刷新图片
            self.doms.codeImg.on('click',function(){
                self.refreshCodeImg();
            });
            //发送验证码
            self.doms.msgBtn.click(function(){
                self.sendMsgCode();
            });
            //判断发送验证码状态按钮
            self.doms.codeInput.on('input',function(){
                self.checkSendCode();
                self.checkStep2();
            });
            //手机号码输入并验证
            self.doms.phoneInput.on("input", function(e) {
                if($(this).val().length === 11) {
                    self.doms.codeBox.addClass('none');

                     $.ajax({
                        type     : "GET",
                        url      : self.ops.ajaxUrl,
                        data     : {'user_mobile':self.doms.phoneInput.val(),'action':'checkUserPhone'},
                        dataType : "json",
                        success : function(r) {
                            if(!r.status) {// 是经纪人的号码
                                self.showMsg(r.msg);
                                return false;
                            } else {// 不是经纪人的号码
                                if(r.is_upper){//超过三次
                                     self.doms.codeBox.removeClass('none');
                                }
                                self.checkSendCode();
                                return true;
                            }
                        },
                        error : function(r) {
                           return false;
                        }
                    });


                }
                self.checkStep2();
            });

            //委托房源提交
            self.doms.subBtn.on('click',function(){
                if(!$(this).hasClass("dis-btn")){
                    self.submitFun();
                }
            });
            //控制业主说字数不能超过300
            $('.other_wrap textarea').on({
                'input':function () {
                    var curLength = $.trim($(this).val()).length,
                        tipsMsg = $(this).siblings('.l-tip');
                    if(curLength >= 300){
                        self.showMsg('不能超过300个字');
                    }else{
                        tipsMsg.find('em').addClass('red-text').html(curLength);
                    }
                }
            });
            //点击返回弹出提示层
            $('#comBack').click(function(){
                if(!$(this).hasClass('notConfirm')){
                    $('.confirm-box').show();
                    self.dialog.open();
                    return false;
                }
            });
            $('.confirm-box').find('.ok-btn').click(function(){
                var backUrl = $('#comBack').attr('href');
                location.href = backUrl;
            });
            $('.confirm-box .qx-btn,.confirm-box .close-btn').click(function(){
                 self.dialog.close();
            });

            // 业主说房源图 跳过
            self.doms.breakBtn.on('click',function(){
                self.doms.otherBox.hide();
                self.doms.successBox.show();
                $(window).scrollTop(0);
            });
            // 业主说房源图 提交
            self.doms.finishBtn.on('click',function(){
                var landlord_note = $('#landlord-note').val(),
                    upload = userTouch.compressUpload["#roomImgWrap"],
                    images = upload.getUploadedHash(),
                    prop_id = self.doms.propIdInput.val(),
                    safe_code = self.doms.safeCodeInput.val();
                if(!images == "[]" || landlord_note){
                    $.ajax({
                        type     : "post",
                        url      : self.ops.ajaxUrl,
                        data     : {'prop_id':prop_id,'safe_code':safe_code,'landlord_note':landlord_note,'images':images,'action':'saveHouseOptionalInfo'},
                        dataType : "json",
                        success : function(r) {
                            if(r.status) {// 保存成功
                                self.doms.otherBox.hide();
                                self.doms.successBox.show();
                                $(window).scrollTop(0);
                            } else {
                                self.showMsg(r.msg);
                                return false;
                            }
                        },
                        error : function(r) {
                           return false;
                        }
                    });
                }else{
                    $(window).scrollTop(0);
                    self.doms.otherBox.hide();
                    self.doms.successBox.show();
                }
            });
        },
        checkStep1 : function(){

            var self = this;
                self.formVals.area = self.getVal('area');
                self.formVals.price = self.getVal('price');
                self.formVals.commId = self.getVal('comm_id');
                self.formVals.commAddr = self.getVal('address');
                self.formVals.commName = self.getVal('comm_name');

                self.formVals.hxRoom = self.getVal('hx-room');//室
                self.formVals.hxHall = self.getVal('hx-hall');//厅
                self.formVals.hxToilet = self.getVal('hx-toilet');//卫

            if(self.formVals.hxRoom && self.formVals.hxToilet && self.formVals.hxHall && self.formVals.area && self.formVals.price && (self.formVals.commId || self.formVals.commAddr)){
                self.doms.nextBtn.addClass('next-btn').removeClass('dis-btn');
            }else{
                self.doms.nextBtn.removeClass('next-btn').addClass('dis-btn');
            }
        },
        checkStep2 : function(){
            var self = this;
                self.formVals.building = self.getVal('building');//楼栋
                self.formVals.unit = self.getVal('unit');//单元
                self.formVals.room = self.getVal('room');//号


                self.formVals.myFloor = self.getVal('myfloor');//楼层
                self.formVals.allFloor = self.getVal('allfloor');//总楼层
                self.formVals.roomType = self.getVal('room_type');//房屋类型
                self.formVals.roomDecor = self.getVal('room_decorate');//房屋装修
                self.formVals.roomToward = self.getVal('room_toward');//房屋朝向
                self.formVals.phone = self.getVal('phone');
                self.formVals.code = self.getVal('code');
                self.formVals.vcode = self.getVal('vcode');

            if( self.formVals.myFloor && self.formVals.allFloor && self.formVals.roomType &&
                self.formVals.roomDecor && self.formVals.roomToward && self.formVals.phone && self.formVals.vcode){
                if(!self.doms.codeBox.hasClass('none') && !self.formVals.code){
                    self.doms.subBtn.removeClass('sub-btn').addClass('dis-btn');
                }else{
                    self.doms.subBtn.addClass('sub-btn').removeClass('dis-btn');
                }

            }else{
                self.doms.subBtn.removeClass('sub-btn').addClass('dis-btn');
            }

        },
        checkSendCode : function(){
            var self = this;
            if(self.getVal('phone')){
                if(!this.doms.codeBox.hasClass('none') && self.getVal('code').length<4){
                    this.doms.msgBtn.addClass('getcode-dis');
                }else{
                    this.doms.msgBtn.removeClass('getcode-dis');
                }
            }else{
                this.doms.nextBtn.addClass('getcode-dis');
            }
        },
        sendMsgCode : function(){
            var self = this;
            var ajaxData = {};
                ajaxData.action = 'getSMSCode';
                ajaxData.user_mobile = self.getVal('phone');
                ajaxData.captcha = self.getVal('code');
                if(self.validate.checkPhone()){
                    if(self.isSend){
                        self.isSend = false;
                        // self.verfiyCountdown(self.doms.msgBtn,60);
                        // return;
                        $.ajax({
                            url: self.ops.ajaxUrl,
                            type: 'post',
                            dataType: 'json',
                            data: ajaxData,
                            success : function(data){
                                if(data.status){//成功
                                    self.verfiyCountdown(self.doms.msgBtn,60);
                                } else {//图片验证码错误
                                    self.isSend = true;
                                    self.showMsg(data.msg);
                                }
                            }
                        });
                    }
                }


        },
        nextFun : function(){
            var self = this;
            if(!self.formVals.commName){
                self.showMsg('请输选择小区');
                return false;
            }

            if(!self.formVals.commId && !self.formVals.commAddr){
                self.showMsg('请输入小区地址');
                return false;
            }

            // 验证户型
            var hxErr = 0;
            $('#huxing').find('input').each(function(){
                if(!self.validate.checkHuXing($(this))){
                    hxErr++;
                }
            });
            if(hxErr > 0){
                return false;
            }

            if(self.validate.checkArea() && self.validate.checkPrice()){
                self.doms.step1Box.hide();
                self.doms.step2Box.show();
                return true;
            }

        },
        checkSubmit : function(){
            var self = this;
            if(!self.formVals.myFloor){
                self.showMsg('请选择楼层');
                return false;
            }
            if(!self.formVals.allFloor){
                self.showMsg('请选择总楼层');
                return false;
            }
            if(self.formVals.myFloor-0 > self.formVals.allFloor-0){
                self.showMsg('楼层不能大于总楼层');
                return false;
            }

            if(!self.formVals.roomType){
                self.showMsg('请选择房屋类型');
                return false;
            }
            if(!self.formVals.roomDecor){
                self.showMsg('请选择房屋装修');
                return false;
            }
            if(!self.formVals.roomToward){
                self.showMsg('请选择房屋朝向');
                return false;
            }
            return self.validate.checkPhone() && self.validate.checkVcode();
        },
        submitFun : function(){
            var self = this;
            if(self.checkSubmit()){
                 $.ajax({
                    url: self.ops.ajaxUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        action  : 'saveHouseInfo',
                        city_id : self.ops.cityId,
                        comm_id : self.getVal('comm_id'),
                        comm_name : self.getVal('comm_name'),
                        address : self.getVal('comm_id') ? self.getVal('comm_addr') : self.getVal('address'),
                        building    : self.getVal('building'),//栋
                        unit    : self.getVal('unit'),//单元
                        room_number    : self.getVal('room'),//室
                        build_area    : self.getVal('area'),//面积
                        room    : self.getVal('hx-room'),
                        hall    : self.getVal('hx-hall'),
                        toilet  :self.getVal('hx-toilet'),
                        price    : self.getVal('price'),//价格
                        prop_floor    : self.getVal('myfloor'),//楼层
                        all_floor    : self.getVal('allfloor'),//总楼层
                        prop_type    : self.getVal('room_type'),//类型
                        fitment    : self.getVal('room_decorate'),//装修
                        drawing_exposure    : self.getVal('room_toward'),//朝向
                        user_mobile : self.getVal('phone'),//联系电话
                        'security_code' : self.getVal('vcode'),//短信验证码
                        // agent_ip : '',//来源ip［后端？］
                        // guid : '',//用户唯一标识［后端？］
                        from_type : 2 //1：PC; 2：TW
                    },
                    success : function(data){
                        if(data.status){//成功
                            self.doms.formBox.hide();
                            self.doms.otherBox.show();
                            $('#comBack').addClass('notConfirm');
                            self.doms.propIdInput.val(data.prop_id);
                            self.doms.safeCodeInput.val(data.safe_code);
                            // self.doms.successBox.show();
                        }else{//已经提交申请，请勿重复提交
                            // self.item.formBox.hide();
                            // self.item.failBox.show();
                            self.showMsg(data.msg);
                            return false;
                        }
                    }
                });
            }
        },
        validates : function(){
            var self = this;
            var rules = {
                required:function(value){
                    var val = value;
                    return val.length > 0;
                },
                maxLength:function(value,maxlength){
                    var val = value;
                    return val.length <= maxlength;
                },
                max:function(value,_max){
                    var val = value-0;
                    return val - _max <= 0
                },
                min:function(value,min){
                    return value-0-min >= 0
                },
                mobile:function(value){
                    var val = value;
                    return /^1[3|4|5|7|8]\d{9}$/.test(val);
                },
                number: function (value) {
                    var val = value;
                    return !isNaN(val);
                },
                decimal:function(value, arg){
                    var val = value;
                    var arr = value.split('.');
                    if( arr[1] ){
                        return arr[1].length <= arg;
                    }else{
                        return true;
                    }
                }
            };
           self.validate = {
                checkPrice : function(){
                     var val = self.getVal('price');
                     if(!rules.required(val)){
                        self.showMsg('请输入价格');
                        return false;
                     }
                     if(!rules.number(val) || !rules.max(val,9999) || !rules.min(val,10) ){
                        self.showMsg('请输入正确价格');
                        return false;
                     }
                     return true;
                },
                checkArea : function(){
                     var val = self.getVal('area');
                     if(!rules.required(val)){
                        self.showMsg('请输入面积');
                        return false;
                     }
                     if(!rules.number(val) || !rules.decimal(val,2) || !rules.max(val,2000) || !rules.min(val,10) ){
                        self.showMsg('请输入正确面积');
                        return false;
                     }
                     return true;
                },
                checkHuXing : function(obj){
                     var val = obj.val();
                     if(!rules.required(val)){
                        self.showMsg('请输入户型');
                        return false;
                     }
                     if(!rules.number(val) || !rules.max(val,10)){
                        self.showMsg('请输入正确的户型');
                        return false;
                     }
                     return true;
                },
                checkCode : function(){
                     var val = self.getVal('code');
                     if(!rules.required(val)){
                        self.showMsg('请输入图片验证码');
                        return false;
                     }
                     if(!rules.number(val) || !rules.maxLength(val,6)){
                        self.showMsg('请输入正确图片验证码');
                        return false;
                     }
                     return true;
                },
                checkVcode : function(){
                     var val = self.getVal('vcode');
                     if(!rules.required(val)){
                        self.showMsg('请输入手机验证码');
                        return false;
                     }
                     if(!rules.number(val) || !rules.maxLength(val,6)){
                        self.showMsg('请输入正确手机验证码');
                        return false;
                     }
                     return true;
                },
                checkPhone : function(){
                     var val = self.getVal('phone');
                     if(!rules.required(val)){
                        self.showMsg('请输入手机号码');
                        return false;
                     }
                     if(!rules.mobile(val) || !rules.maxLength(val,11)){
                        self.showMsg('请输入正确的手机号码');
                        return false;
                     }
                     return true;
                }
            }
        },
        showMsg : function(msg){
            $('.error-box').find('span').html(msg);
            $('.error-box').show();
            setTimeout(function(){$('.error-box').hide();},3000);
        },
        getVal : function(name){
            return $('[name="'+name+'"]').val();
        },
        refreshCodeImg:function(){
            var newStamp = Date.now(), newSrc,
                codeImg  = $(this.doms.codeImg);
            newSrc = codeImg.attr('src').substr(0,codeImg.attr('src').length-13) + newStamp;
            codeImg.attr('src',newSrc);
        },
        verfiyCountdown:function(obj, time) {
            var self = this;
            if (time == 0) {
                self.isSend = true;
                obj.removeAttr('disabled');
                obj.removeClass('getcode-dis');
                obj.text('重新获取');
                time = time;
            } else {
                obj.attr('disabled', 'disabled');
                obj.addClass('getcode-dis');
                obj.text(time + '秒后重发');
                time--;
                setTimeout(function() {
                    self.verfiyCountdown(obj, time);
                }, 1000);
            }
        },
        changeDownloadLink : function() {
            var browser = {
                versions: function () {
                    var u = navigator.userAgent;
                    return { //移动终端浏览器版本信息
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        isWx : u.indexOf('MicroMessenger') > -1, //是微信游览器
                    };
                }(),
            }
            var self = this;
            $('#success_wrap .down-btn').click(function(){
               //临时调整微信中下载逻辑
                if(browser.versions.isWx) {
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.anjuke.android.app";
                    return;
                }
                //安卓
                if(browser.versions.anjuke) {
                    window.location.href = self.ops.androidAPPUrl;
                    return;
                }
                //ios
                if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    window.location.href = self.ops.iphoneAPPUrl;
                    return;
                }

            });

        }

    };
})(APF.Namespace.register('touch.entrust'), window);
