(function () {
    var requirejs, require, define;
    (function (e) {
        function n(e, n) {
            if (e && "." === e.charAt(0) && n) {
                n = n.split("/"), n = n.slice(0, n.length - 1), e = n.concat(e.split("/"));
                var i, t;
                for (i = 0; t = e[i]; i++)
                    if ("." === t) e.splice(i, 1), i -= 1;
                    else if (".." === t) {
                    if (1 === i && (".." === e[2] || ".." === e[0])) break;
                    i > 0 && (e.splice(i - 1, 2), i -= 2)
                }
                e = e.join("/")
            }
            return e
        }

        function i(n, i) {
            return function () {
                return r.apply(e, u.call(arguments, 0).concat([n, i]))
            }
        }

        function t(e) {
            return function (i) {
                return n(i, e)
            }
        }

        function a(e) {
            return function (n) {
                d[e] = n
            }
        }

        function o(n) {
            if (p.hasOwnProperty(n)) {
                var i = p[n];
                delete p[n], s.apply(e, i)
            }
            return d[n]
        }

        function l(e, i) {
            var a, l, s = e.indexOf("!");
            return -1 !== s ? (a = n(e.slice(0, s), i), e = e.slice(s + 1), l = o(a), e = l && l.normalize ? l.normalize(e, t(i)) : n(e, i)) : e = n(e, i), {
                f: a ? a + "!" + e : e,
                n: e,
                p: l
            }
        }
        var s, r, d = {},
            p = {},
            u = [].slice;
        "function" != typeof define && (s = function (n, t, s, r) {
            var u, c, m, h, v, f, y = [];
            if (r || (r = n), "function" == typeof s) {
                for (!t.length && s.length && (t = ["require", "exports", "module"]), h = 0; t.length > h; h++)
                    if (f = l(t[h], r), m = f.f, "require" === m) y[h] = i(n);
                    else if ("exports" === m) y[h] = d[n] = {}, u = !0;
                else if ("module" === m) c = y[h] = {
                    id: n,
                    uri: "",
                    exports: d[n]
                };
                else if (d.hasOwnProperty(m) || p.hasOwnProperty(m)) y[h] = o(m);
                else {
                    if (!f.p) throw n + " missing " + m;
                    f.p.load(f.n, i(r, !0), a(m), {}), y[h] = d[m]
                }
                v = s.apply(d[n], y), n && (c && c.exports !== e ? d[n] = c.exports : u || (d[n] = v))
            } else n && (d[n] = s)
        }, requirejs = r = function (n, i, t, a) {
            return "string" == typeof n ? o(l(n, i).f) : (n.splice || (i.splice ? (n = i, i = arguments[2]) : n = []), a ? s(e, n, i, t) : setTimeout(function () {
                s(e, n, i, t)
            }, 15), r)
        }, r.config = function () {
            return r
        }, require || (require = r), define = function (e, n, i) {
            n.splice || (i = n, n = []), define.unordered ? p[e] = [e, n, i] : s(e, n, i)
        }, define.amd = {
            jQuery: !0
        })
    })(), define("dependencies/almond/almond", function () {}), define("core/lib/error", ["require", "exports", "module"], function (e, n, i) {
        i.exports = {
            wrap: function (e, n) {
                return function () {
                    try {
                        return e.apply(null, arguments)
                    } catch (i) {
                        var t = "";
                        void 0 !== n && (t = ' (during "' + (n >= 0 ? arguments[n] : n) + '")'), console.error(i.name + ": " + i.message + t), console.log(i && i.stack || i)
                    }
                }
            },
            wrapAll: function (e, n) {
                for (var t in e) "function" == typeof e[t] && (e[t] = i.exports.wrap(e[t], n ? n + t : t))
            }
        }
    }), define("core/lib/events", ["require", "exports", "module", "./error"], function (e, n, i) {
        function t(e, n, t, a) {
            if (a = a || [], !e) throw "type must be truthy";
            if (!n || null === n || "function" != typeof n) throw "Could not add listener for event '" + e + "' " + (n ? "this listener isn't a function" : "this listener is undefined");
            l[e] = l[e] || [];
            for (var s = 0; l[e].length > s; s++)
                if (l[e][s] && l[e][s].origFunc === n) return console.warn("Could not add listener for event '" + e + "' this listener is already registered on this event"), void 0;
            0 === l[e].length && i.exports.emit("event.type.added", [e], !0), l[e].push({
                origFunc: n,
                func: o.wrap(n, e),
                once: !!t,
                paramMatch: a
            })
        }

        function a(e, n, i) {
            i ? e.func.apply(void 0, n) : setTimeout(function () {
                e.func.apply(void 0, n)
            }, 1)
        }
        var o = e("./error"),
            l = {};
        i.exports = {
            on: function (e, n, i) {
                t(e, n, !1, i)
            },
            once: function (e, n, i) {
                t(e, n, !0, i)
            },
            emit: function (e, n, t) {
                n = n || [], t = t || void 0 === t, l[e] && l[e].forEach(function (e, o, l) {
                    var s = e.paramMatch.every(function (e, t) {
                        return n[t] && n[t].webviewId && e ? e.webviewId === n[t].webviewId : e === n[t] || e === i.exports.FILTER_ANY
                    });
                    s && (a(e, n, t), e.once && delete l[o])
                })
            },
            clear: function (e) {
                e && delete l[e]
            },
            un: function (e, n) {
                e && n && l[e] && (l[e] = l[e].filter(function (i) {
                    return !((i.func === n || i.origFunc === n) && -1 !== l[e].indexOf(i))
                }), 0 === l[e].length && i.exports.emit("event.type.removed", [e], !0))
            },
            isOn: function (e) {
                return l[e] ? l[e] !== void 0 && 0 !== l[e].length : !1
            },
            FILTER_ANY: {}
        }
    }), define("core/lib/webEvents", ["require", "exports", "module", "./events"], function (e, n, i) {
        function t(e, n, i) {
            var t = f[e] || [];
            if (!e) throw "id must be truthy";
            if (!n) throw "type must be truthy";
            return t = t[n], !t && i && (f[e] = f[e] || [], f[e][n] = [], t = f[e][n]), t
        }

        function a(e) {
            return v.reduce(function (n, i) {
                var a, o;
                return "string" == typeof n ? (o = t(e, n), a = Array.isArray(o) ? o.length : 0) : a = n, o = t(e, i), a += Array.isArray(o) ? o.length : 0
            })
        }

        function o(e, n, i) {
            var t, o, l = h.exec(n),
                s = l ? "webview.setPropertyChangedEventEnabled" : "webview.setWebEventEnabled",
                r = l ? l[1] : n,
                d = -1 !== v.indexOf(n);
            qnx.callExtensionMethod(s, e, r, i), l && (t = "1" === qnx.callExtensionMethod("webview.isAnyPropertyChangedEventsEnabled", e), qnx.callExtensionMethod("webview.setWebEventEnabled", e, "PropertyChanged", t)), d && (o = a(e), i && 1 === o && qnx.callExtensionMethod("webview.setEnableNetworkResourceRequestedEvents", e, !0), i || 0 !== o || qnx.callExtensionMethod("webview.setEnableNetworkResourceRequestedEvents", e, !1))
        }

        function l(e, n, i) {
            var a, l = t(i, e);
            if (l)
                for (m.un(e, n), a = 0; l.length > a; a++)
                    if (l[a].func === n) {
                        l.splice(a, 1), 0 === l.length && o(i, e, !1);
                        break
                    }
        }

        function s(e, n, i, a) {
            var l = t(i, e, !0);
            l.push({
                func: n,
                once: !!a
            }), o(i, e, !0)
        }

        function r(e, n, i) {
            s(e, n, i, !1), m.on(e, n, [{
                webviewId: i
            }])
        }

        function d(e, n, i) {
            s(e, n, i, !0), m.once(e, n, [{
                webviewId: i
            }])
        }

        function p(e, n, i, a) {
            var o = t(n, e);
            a = a || {}, i = i || [], a.webviewId = n, i.unshift(a), o && (m.emit(e, i, a.sync), o.some(function () {
                f[n][e] = o.filter(function (e) {
                    return !e.once
                })
            }))
        }

        function u(e) {
            e && delete f[e]
        }

        function c(e) {
            -1 === v.indexOf(e) && v.push(e)
        }
        var m = e("./events"),
            h = RegExp("^Property(.*)Event$"),
            v = ["NetworkResourceRequested", "NetworkResourceStatusReceived", "NetworkResourceHeaderReceived", "NetworkResourceDataReceived"],
            f = {};
        i.exports = {
            enableWebEvent: o,
            getNetworkListenerCount: a,
            clear: u,
            on: r,
            un: l,
            emit: p,
            once: d,
            defineNetworkEvent: c,
            listenersFor: t
        }
    }), define("core/lib/chrome", ["require", "exports", "module"], function (e, n, i) {
        var t;
        t = {
            id: 1
        }, i.exports = t
    }), define("wp2/lib/windowAnimations", ["require", "exports", "module"], function (e, n, i) {
        var t, a = {};
        t = {
            windowAnimationFinishedCallbacks: a,
            animateWindowLocation: function (e, n, i, t, o, l, s, r) {
                var d = qnx.callExtensionMethod("windowAnimations.animateWindowLocation", e, n, i, t, o, l, s);
                r && (a[d] = r), qnx.callExtensionMethod("windowAnimations.startAnimation")
            },
            animateWindowLocations: function (e, n, i, t) {
                var o = ["windowAnimations.animateWindowLocationMultiple", e, n].concat(i),
                    l = qnx.callExtensionMethod.apply(qnx, o);
                t && (a[l] = t), qnx.callExtensionMethod("windowAnimations.startAnimation")
            },
            animateGlobalAlpha: function (e, n, i, t, o, l) {
                var s = qnx.callExtensionMethod("windowAnimations.animateGlobalAlpha", e, n, i, t, o);
                l && (a[s] = l), qnx.callExtensionMethod("windowAnimations.startAnimation")
            },
            animateGlobalAlphas: function (e, n, i, t) {
                var o = ["windowAnimations.animateGlobalAlphaMultiple", e, n].concat(i),
                    l = qnx.callExtensionMethod.apply(qnx, o);
                t && (a[l] = t), qnx.callExtensionMethod("windowAnimations.startAnimation")
            }
        }, i.exports = t
    }), define("core/lib/rpc/rpc", ["require", "exports", "module"], function (require, exports, module) {
        function postMessage(e, n, i) {
            var t, a;
            return n && "string" == typeof n ? (t = void 0 === i ? "" : "object" == typeof i ? JSON.stringify(i) : "'" + i + "'", a = "wp.view.rpc.emit('" + n + "', [" + t + "])", e.executeJavaScript(a), void 0) : Error("Message type is required")
        }

        function handleJSCallback(webView, webViewOptions, value) {
            var args = eval(JSON.parse(value).args),
                command = args[0],
                info, eventOptions = {};
            "webplatform.rpc" === command && (info = JSON.parse(args[1]), webView.rpc.emit(info.messageType, [info.message], eventOptions))
        }

        function on(e, n, i) {
            e.on("rpc." + n, i)
        }

        function once(e, n, i) {
            e.once("rpc." + n, i)
        }

        function un(e, n, i) {
            e.un("rpc." + n, i)
        }

        function emit(e, n, i, t) {
            e.emit("rpc." + n, i, t)
        }

        function enableRpcOn(e) {
            e.isWebEventAllowed("JavaScriptCallback") || (e.allowQnxObject = !0, e.on("JavaScriptCallback", handleJSCallback.bind(null, e)))
        }

        function disableRpcOn(e) {
            e.isWebEventAllowed("JavaScriptCallback") && (e.allowQnxObject = !1, e.un("JavaScriptCallback", handleJSCallback.bind(null, e)))
        }
        var rpc;
        rpc = {
            postMessage: postMessage,
            on: on,
            un: un,
            once: once,
            emit: emit,
            enableRpcOn: enableRpcOn,
            disableRpcOn: disableRpcOn
        }, module.exports = rpc
    }), define("wp2/lib/rpc", ["require", "exports", "module"], function (require, exports, module) {
        function publish(e, n, i, t) {
            t = t || {}, _published[e] || (_published[e] = {}), _published[e][n] = {
                callback: i,
                scope: t.scope,
                once: t.once
            }
        }

        function unpublish(e, n) {
            delete _published[e][n]
        }

        function execute(e, n, i, t) {
            try {
                if (i) return e.callback.apply(e.scope, n);
                setTimeout(function () {
                    var i = [n, t];
                    e.callback.apply(e.scope, i)
                }, 1)
            } catch (a) {
                console.error(a && a.stack || a)
            }
        }

        function init() {
            var controller = window.wp.getController();
            controller.on("JavaScriptCallback", function (options, value, sourceWebViewId) {
                var args = eval(JSON.parse(value).args),
                    command = args[0],
                    name = args[1],
                    functionArgs = args[2],
                    callbackId = args[3];
                "webplatform.rpc" === command && rpc.runPublishedFunction(controller.id, name, functionArgs, !1, function (e) {
                    var n, i = callbackId;
                    e && (i += ", " + JSON.stringify(e)), n = "wp.getController().runRemoteExecCallback(" + i + ")", qnx.callExtensionMethod("webview.executeJavaScript", sourceWebViewId, n, "NormalWorld")
                })
            })
        }

        function allowRpc(e, n) {
            var i = wp.getController().id,
                t = n ? "enableWebEventRedirect" : "disableWebEventRedirect";
            e[t]("JavaScriptCallback", i), qnx.callExtensionMethod("webview.setWebEventEnabled", e.id, "JavaScriptCallback", n)
        }
        var rpc, _published = {},
            _pendingCallbacks = {},
            lastId = 0,
            hasBeenInit;
        rpc = {
            publish: function (e, n, i, t) {
                if (hasBeenInit || (hasBeenInit = !0, init()), !e) throw "WebView ID is invalid";
                if (!n) throw "Function name is invalid";
                publish(e, n, i, t)
            },
            unpublish: function (e, n) {
                if (!n) throw "Function name is invalid";
                unpublish(e, n)
            },
            runPublishedFunction: function (e, n, i, t, a) {
                var o, l = _published[e][n];
                if (i = i || [], !l) throw "WebView with ID " + e + " has not published a function named '" + n + "'";
                return o = execute(l, i, t, a), l.once && delete _published[e][n], t ? o : void 0
            },
            clear: function (e) {
                e && delete _published[e]
            },
            allowRpc: allowRpc,
            remoteExec: function (e, n, i, t) {
                _pendingCallbacks[lastId] = t, qnx.callExtensionMethod("webplatform.rpc", n, JSON.stringify(i), lastId++)
            },
            runRemoteExecCallback: function (e, n) {
                _pendingCallbacks[e](n), delete _pendingCallbacks[e]
            }
        }, module.exports = rpc
    }), define("core/lib/WebView", ["require", "exports", "module", "./events", "./webEvents", "./chrome", "../../wp2/lib/windowAnimations", "./rpc/rpc", "../../wp2/lib/rpc"], function (e, n, i) {
        function t(n) {
            var i, t, s, d = qnx.callExtensionMethod("webview.applicationWindowGroup", l),
                p = n && "number" == typeof n.processId ? n.processId : 0,
                u = n && n.defaultSendEventHandlers ? n.defaultSendEventHandlers : [],
                c = n && n.defaultWebEventHandlers ? n.defaultWebEventHandlers : [],
                m = n && n.WebViewId ? n.WebViewId : parseInt(qnx.callExtensionMethod("webview.create", d, p), 10),
                h = !1,
                v = !1,
                f = this,
                y = !1,
                g = !1,
                w = !1,
                b = !1,
                x = !1,
                T = !1;
            o.on("Created", function () {
                var n, i;
                f.autoDeferNetworkingAndJavaScript = !1, f.createTouchInputSession(), "1" === qnx.callExtensionMethod("webview.isEnableConsoleLogging", l) && (f.consoleLogEnabled = !0), i = u.concat(c), i.forEach(function (n) {
                    var i = n.replace(/^on/, "");
                    o.on(i, function () {
                        e("../../wp2/lib/defaultHandlers/" + n).handle(f).apply(null, Array.prototype.slice.apply(arguments))
                    }, m)
                }), f.on("SelectionChanged", function (e, n) {
                    n = JSON.parse(n), f.isSelectionVisible = 0 > n.startX && 0 > n.endX && 0 > n.startY && 0 > n.endY ? !1 : !0
                }), n = function (e, n, i) {
                    var t;
                    t = f.isContextmenuVisible ? function () {
                        f.emit("ContextMenuCancelEvent")
                    } : f.isTSMVisible ? function () {
                        qnx.callExtensionMethod("webview.cancelContextMenu", f.id, "HideTSM")
                    } : f.isSelectionVisible ? function () {
                        qnx.callExtensionMethod("webview.cancelSelection", f.id)
                    } : void 0, qnx.callExtensionMethod("application.systemKeyPress", e, !!t || i), t && t()
                }, a.on("application.systemKeyPress", n, [a.FILTER_ANY, "Back", a.FILTER_ANY]), f.on("PropertyTSMVisibleEvent", function (e, n) {
                    f.isTSMVisible = "true" === n
                })
            }, m), n && n.onCreate && o.on("Created", n.onCreate, m), this.__defineGetter__("id", function () {
                return m
            }), this.__defineGetter__("windowGroup", function () {
                return d
            }), this.__defineGetter__("visible", function () {
                return "1" === qnx.callExtensionMethod("webview.isVisible", this.id)
            }), this.__defineSetter__("visible", function (e) {
                qnx.callExtensionMethod("webview.setVisible", this.id, !!e)
            }), this.__defineGetter__("pluginsEnabled", function () {
                return "1" === qnx.callExtensionMethod("webview.isEnablePlugins", this.id)
            }), this.__defineSetter__("pluginsEnabled", function (e) {
                qnx.callExtensionMethod("webview.setEnablePlugins", this.id, e)
            }), this.__defineGetter__("active", function () {
                return "1" === qnx.callExtensionMethod("webview.isActive", this.id)
            }), this.__defineSetter__("active", function (e) {
                qnx.callExtensionMethod("webview.setActive", this.id, !!e)
            }), this.__defineGetter__("consoleLogEnabled", function () {
                return "1" === qnx.callExtensionMethod("webview.setEnableConsoleLogging", this.id)
            }), this.__defineSetter__("consoleLogEnabled", function (e) {
                qnx.callExtensionMethod("webview.setEnableConsoleLogging", this.id, e)
            }), this.__defineSetter__("backgroundColor", function (e) {
                qnx.callExtensionMethod("webview.setBackgroundColor", this.id, e)
            }), this.__defineGetter__("backgroundColor", function () {
                return parseInt(qnx.callExtensionMethod("webview.backgroundColor", this.id), 10)
            }), this.__defineSetter__("devicePixelRatio", function (e) {
                qnx.callExtensionMethod("webview.setDevicePixelRatio", this.id, e)
            }), this.__defineGetter__("devicePixelRatio", function () {
                return parseFloat(qnx.callExtensionMethod("webview.devicePixelRatio", this.id))
            }), this.__defineSetter__("sensitivity", function (e) {
                qnx.callExtensionMethod("webview.setSensitivity", this.id, e)
            }), this.__defineGetter__("sensitivity", function () {
                return qnx.callExtensionMethod("webview.sensitivity", this.id)
            }), this.__defineGetter__("zOrder", function () {
                return parseInt(qnx.callExtensionMethod("webview.zOrder", this.id), 10)
            }), this.__defineSetter__("zOrder", function (e) {
                qnx.callExtensionMethod("webview.setZOrder", this.id, parseInt(e, 10))
            }), this.__defineGetter__("url", function () {
                return qnx.callExtensionMethod("webview.location", this.id)
            }), this.__defineSetter__("url", function (e) {
                qnx.callExtensionMethod("webview.loadURL", this.id, e)
            }), this.__defineGetter__("originalLocation", function () {
                return qnx.callExtensionMethod("webview.originalLocation", this.id)
            }), this.__defineGetter__("enableCrossSiteXHR", function () {
                return "1" === qnx.callExtensionMethod("webview.isEnableCrossSiteXHR", this.id)
            }), this.__defineSetter__("enableCrossSiteXHR", function (e) {
                qnx.callExtensionMethod("webview.setEnableCrossSiteXHR", this.id, e)
            }), this.__defineGetter__("enableWebInspector", function () {
                return y
            }), this.__defineSetter__("enableWebInspector", function (e) {
                y = e, qnx.callExtensionMethod("webview.setEnabledOutOfProcessWebInspector", this.id, e), this.id === l && a.emit("inspector.statusChanged", [!0], !1)
            }), this.__defineGetter__("enableInProcessWebInspector", function () {
                return g
            }), this.__defineSetter__("enableInProcessWebInspector", function (e) {
                g = e, qnx.callExtensionMethod("webview.setWebInspectorEnabled", this.id, e), this.id === l && a.emit("inspector.statusChanged", [!0], !1)
            }), this.__defineGetter__("setFileSystemSandbox", function () {
                return "1" === qnx.callExtensionMethod("webview.fileSystemAPISandboxed", this.id)
            }), this.__defineSetter__("setFileSystemSandbox", function (e) {
                qnx.callExtensionMethod("webview.setFileSystemAPISandboxed", this.id, e)
            }), this.__defineGetter__("autoDeferNetworkingAndJavaScript", function () {
                return "1" === qnx.callExtensionMethod("webview.isAutoDeferNetworkingAndJavaScript", this.id)
            }), this.__defineSetter__("autoDeferNetworkingAndJavaScript", function (e) {
                qnx.callExtensionMethod("webview.setAutoDeferNetworkingAndJavaScript", this.id, e)
            }), this.__defineGetter__("allowQnxObject", function () {
                return h
            }), this.__defineSetter__("allowQnxObject", function (e) {
                h = e, qnx.callExtensionMethod("webview.enableQnxJavaScriptObject", this.id, e)
            }), this.__defineGetter__("uiWebView", function () {
                return s
            }), this.__defineSetter__("uiWebView", function (e) {
                s = e
            }), this.__defineGetter__("processId", function () {
                return p
            }), this.__defineSetter__("extraHttpHeaders", function (e) {
                var n = JSON.stringify(e);
                qnx.callExtensionMethod("webview.setExtraHttpHeaders", this.id, n)
            }), this.__defineGetter__("extraHttpHeaders", function () {
                return JSON.parse(qnx.callExtensionMethod("webview.extraHttpHeaders", this.id))
            }), this.__defineSetter__("defaultFontSize", function (e) {
                qnx.callExtensionMethod("webview.setDefaultFontSize", this.id, e)
            }), this.__defineGetter__("defaultFontSize", function () {
                return parseFloat(qnx.callExtensionMethod("webview.defaultFontSize", this.id))
            }), this.__defineSetter__("fullScreenVideoCapable", function (e) {
                qnx.callExtensionMethod("webview.setFullScreenVideoCapable", this.id, e)
            }), this.__defineGetter__("fullScreenVideoCapable", function () {
                return "1" === qnx.callExtensionMethod("webview.fullScreenVideoCapable", this.id)
            }), this.__defineSetter__("allowAllPropertyChangedEvents", function (e) {
                qnx.callExtensionMethod("webview.setAllPropertyChangedEventsEnabled", this.id, e)
            }), this.__defineGetter__("allowAllPropertyChangedEvents", function () {
                return "1" === qnx.callExtensionMethod("webview.isAllPropertyChangedEventsEnabled", this.id)
            }), this.__defineSetter__("allowAllWebEvents", function (e) {
                qnx.callExtensionMethod("webview.setAllWebEventsEnabled", this.id, e)
            }), this.__defineGetter__("allowAllWebEvents", function () {
                return "1" === qnx.callExtensionMethod("webview.isAllWebEventsEnabled", this.id)
            }), this.__defineGetter__("allowsAnyPropertyChangedEvents", function () {
                return "1" === qnx.callExtensionMethod("webview.isAnyPropertyChangedEventsEnabled", this.id)
            }), this.__defineGetter__("allowsAnyWebEvents", function () {
                return "1" === qnx.callExtensionMethod("webview.isAnyWebEventsEnabled", this.id)
            }), this.__defineSetter__("javaScriptInterruptTimeout", function (e) {
                qnx.callExtensionMethod("webview.setJavaScriptInterruptTimeout", this.id, e)
            }), this.__defineGetter__("javaScriptInterruptTimeout", function () {
                return parseInt(qnx.callExtensionMethod("webview.javaScriptInterruptTimeout", this.id), 10)
            }), this.__defineGetter__("jsScreenWindowHandle", function () {
                return qnx.callExtensionMethod("webview.jsScreenWindowHandle", this.id)
            }), this.__defineSetter__("allowWebInspection", function (e) {
                qnx.callExtensionMethod("webview.setAllowWebInspection", this.id, this.id, e)
            }), this.__defineSetter__("enableDialogRequestedEvents", function (e) {
                qnx.callExtensionMethod("webview.setEnableDialogRequestedEvents", this.id, e)
            }), this.__defineGetter__("enableDialogRequestedEvents", function () {
                return "1" === qnx.callExtensionMethod("webview.isEnableDialogRequestedEvents", this.id)
            }), this.__defineSetter__("enableJavaScript", function (e) {
                qnx.callExtensionMethod("webview.setEnableJavaScript", this.id, e)
            }), this.__defineGetter__("enableJavaScript", function () {
                return "1" === qnx.callExtensionMethod("webview.isEnableJavaScript", this.id)
            }), this.__defineSetter__("keyboardVisible", function (e) {
                w = e, qnx.callExtensionMethod("webview.setKeyboardVisible", this.id, e)
            }), this.__defineGetter__("keyboardVisible", function () {
                return w
            }), this.__defineSetter__("overScrollColor", function (e) {
                qnx.callExtensionMethod("webview.setOverScrollColor", this.id, e)
            }), this.__defineGetter__("overScrollColor", function () {
                return parseInt(qnx.callExtensionMethod("webview.overScrollColor", this.id), 10)
            }), this.__defineSetter__("userAgent", function (e) {
                qnx.callExtensionMethod("webview.setUserAgent", this.id, e)
            }), this.__defineGetter__("userAgent", function () {
                return qnx.callExtensionMethod("webview.userAgent", this.id)
            }), this.__defineGetter__("title", function () {
                return qnx.callExtensionMethod("webview.title", this.id)
            }), this.__defineGetter__("status", function () {
                return qnx.callExtensionMethod("webview.status", this.id)
            }), this.__defineGetter__("currentContext", function () {
                return qnx.callExtensionMethod("webview.currentContext", this.id)
            }), this.__defineSetter__("pointerInteractionMode", function (e) {
                t = e = !!e, qnx.callExtensionMethod("webview.setEnablePointerInteractionMode", this.id, e)
            }), this.__defineGetter__("pointerInteractionMode", function () {
                return void 0 !== t ? t : t = "1" === qnx.callExtensionMethod("webview.isEnablePointerInteractionMode", this.id)
            }), this.__defineSetter__("spatialNavigation", function (e) {
                i = e = !!e, qnx.callExtensionMethod("webview.setEnableSpatialNavigation", this.id, e)
            }), this.__defineGetter__("spatialNavigation", function () {
                return void 0 !== i ? i : i = "1" === qnx.callExtensionMethod("webview.isEnableSpatialNavigation", this.id)
            }), this.__defineSetter__("keyboardThemeColor", function (e) {
                "dark" === e ? e = 0 : "light" === e && (e = Math.pow(2, 32) - 1), qnx.callExtensionMethod("webview.setKeyboardThemeColor", this.id, e)
            }), this.__defineGetter__("keyboardThemeColor", function () {
                var e = qnx.callExtensionMethod("webview.getKeyboardThemeColor", this.id) - 0;
                return e = 0 === e ? "dark" : e === Math.pow(2, 32) - 1 ? "light" : "" + e
            }), this.__defineGetter__("isSelectionVisible", function () {
                return b
            }), this.__defineSetter__("isSelectionVisible", function (e) {
                b = e
            }), this.__defineGetter__("isContextmenuVisible", function () {
                return x
            }), this.__defineSetter__("isContextmenuVisible", function (e) {
                x = e
            }), this.__defineGetter__("isTSMVisible", function () {
                return T
            }), this.__defineSetter__("isTSMVisible", function (e) {
                T = e
            }), this.rpc = {
                on: r.on.bind(null, f),
                un: r.un.bind(null, f),
                once: r.once.bind(null, f),
                emit: r.emit.bind(null, f),
                postMessage: r.postMessage.bind(null, f),
                get enable() {
                    return v
                },
                set enable(e) {
                    var n = e === !0;
                    v = n, r[n ? "enableRpcOn" : "disableRpcOn"](f)
                }
            }
        }
        var t, a = e("./events"),
            o = e("./webEvents"),
            l = e("./chrome").id,
            s = e("../../wp2/lib/windowAnimations"),
            r = e("./rpc/rpc"),
            d = e("../../wp2/lib/rpc"),
            p = !1;
        t.prototype.on = function (e, n) {
            o.on(e, n, this.id)
        }, t.prototype.un = function (e, n) {
            o.un(e, n, this.id)
        }, t.prototype.emit = function (e, n, i) {
            o.emit(e, this.id, n, i)
        }, t.prototype.once = function (e, n) {
            o.once(e, n, this.id)
        }, t.prototype.setGeometry = function (e, n, i, t) {
            qnx.callExtensionMethod("webview.setGeometry", this.id, e, n, i, t)
        }, t.prototype.animateWindowLocation = function (e, n, i, t, a, o, l) {
            var r = qnx.callExtensionMethod("webview.jsScreenWindowHandle", this.id);
            s.animateWindowLocation(r, e, n, i, t, a, o, l)
        }, t.prototype.reload = function () {
            qnx.callExtensionMethod("webview.reload", this.id)
        }, t.prototype.stop = function (e) {
            qnx.callExtensionMethod("webview.stop", this.id), e && "function" == typeof e && e()
        }, t.prototype.destroy = function (e) {
            qnx.callExtensionMethod("webview.destroy", this.id), e && "function" == typeof e && e()
        }, t.prototype.syncProxyCredential = function (e, n) {
            qnx.callExtensionMethod("webview.syncProxyCredential", this.id, e, n)
        }, t.prototype.initialize = function (e) {
            qnx.callExtensionMethod("webview.initialize", this.id, this.windowGroup, e)
        }, t.prototype.delete = function (e) {
            qnx.callExtensionMethod("webview.delete", this.id), a.clear(this.id), d.clear(this.id), e && "function" == typeof e && e()
        }, t.prototype.isVideoFullScreen = function () {
            qnx.callExtensionMethod("webview.isVideoFullScreen", this.id)
        }, t.prototype.executeJavaScript = function (e, n, i) {
            qnx.callExtensionMethod("webview.executeJavaScript", this.id, e, n ? "IsolatedWorld" : "NormalWorld"), i && "function" == typeof i && i()
        }, t.prototype.setBackgroundColor = function (e) {
            qnx.callExtensionMethod("webview.setBackgroundColor", this.id, e)
        }, t.prototype.notifyOpen = function (e, n, i) {
            qnx.callExtensionMethod("webview.notifyOpen", this.id, e, n, i)
        }, t.prototype.notifySystemLowMemory = function () {
            qnx.callExtensionMethod("webview.notifySystemLowMemory", this.id)
        }, t.prototype.notifyHeaderReceived = function (e, n, i) {
            qnx.callExtensionMethod("webview.notifyHeaderReceived", this.id, e, n, i)
        }, t.prototype.notifyDataReceived = function (e, n, i) {
            qnx.callExtensionMethod("webview.notifyDataReceived", this.id, e, n, i)
        }, t.prototype.notifyApplicationOrientationDone = function () {
            qnx.callExtensionMethod("webview.notifyApplicationOrientationDone", this.id)
        }, t.prototype.notifyDone = function (e) {
            qnx.callExtensionMethod("webview.notifyDone", this.id, e)
        }, t.prototype.notifyContextMenuCancelled = function () {
            qnx.callExtensionMethod("webview.notifyContextMenuCancelled", this.id)
        }, t.prototype.publishRemoteFunction = function (e, n, i) {
            d.publish(this.id, e, n, i)
        }, t.prototype.unpublishRemoteFunction = function (e) {
            d.unpublish(this.id, e)
        }, t.prototype.remoteExec = function (e, n, i, t) {
            d.remoteExec(e, n, i, t)
        }, t.prototype.runRemoteExecCallback = function (e, n) {
            d.runRemoteExecCallback(e, n)
        }, t.prototype.setApplicationOrientation = function (e) {
            qnx.callExtensionMethod("webview.setApplicationOrientation", this.id, e)
        }, t.prototype.setExtraPluginDirectory = function (e) {
            qnx.callExtensionMethod("webview.setExtraPluginDirectory", this.id, e)
        }, t.prototype.continueSSLHandshaking = function (e, n) {
            qnx.callExtensionMethod("webview.continueSSLHandshaking", this.id, e, n)
        }, t.prototype.knownSSLCertificates = function () {
            return qnx.callExtensionMethod("webview.knownSSLCertificates", this.id)
        }, t.prototype.addKnownSSLCertificate = function (e, n) {
            return qnx.callExtensionMethod("webview.addKnownSSLCertificate", this.id, e, n)
        }, t.prototype.hasKnownSSLCertificate = function (e) {
            return qnx.callExtensionMethod("webview.knownSSLCertificate", this.id, e)
        }, t.prototype.addOriginAccessWhitelistEntry = function (e, n, i) {
            qnx.callExtensionMethod("webview.addOriginAccessWhitelistEntry", this.id, e, n, !!i)
        }, t.prototype.removeOriginAccessWhitelistEntry = function (e, n, i) {
            qnx.callExtensionMethod("webview.removeOriginAccessWhitelistEntry", this.id, e, n, !!i)
        }, t.prototype.downloadURL = function (e) {
            qnx.callExtensionMethod("webview.downloadURL", this.id, e)
        }, t.prototype.handleContextMenuResponse = function (e) {
            qnx.callExtensionMethod("webview.handleContextMenuResponse", this.id, e)
        }, t.prototype.allowGeolocation = function (e) {
            qnx.callExtensionMethod("webview.setAllowGeolocation", this.id, e, !0)
        }, t.prototype.disallowGeolocation = function (e) {
            qnx.callExtensionMethod("webview.setAllowGeolocation", this.id, e, !1)
        }, t.prototype.isGeolocationAllowed = function (e) {
            return qnx.callExtensionMethod("webview.isEnableGeolocation", this.id, e)
        }, t.prototype.allowNotifications = function (e) {
            qnx.callExtensionMethod("webview.setAllowNotification", this.id, e, !0)
        }, t.prototype.disallowNotifications = function (e) {
            qnx.callExtensionMethod("webview.setAllowNotification", this.id, e, !1)
        }, t.prototype.setPopupWebView = function (e) {
            qnx.callExtensionMethod("webview.setPopupWebView", this.id, e)
        }, t.prototype.allowUserMedia = function (e, n) {
            n && n.length > 0 && qnx.callExtensionMethod("webview.setAllowUserMedia", this.id, e, n)
        }, t.prototype.disallowUserMedia = function (e) {
            qnx.callExtensionMethod("webview.setAllowUserMedia", this.id, e, "")
        }, t.prototype.allowWebEvent = function (e) {
            qnx.callExtensionMethod("webview.setEnable" + e + "Events", this.id, !0)
        }, t.prototype.disallowWebEvent = function (e) {
            qnx.callExtensionMethod("webview.setEnable" + e + "Events", this.id, !1)
        }, t.prototype.isWebEventAllowed = function (e) {
            return "1" === qnx.callExtensionMethod("webview.isWebEventEnabled", this.id, e) || "1" === qnx.callExtensionMethod("webview.isEnable" + e + "Events", this.id) || !1
        }, t.prototype.enableStringPatternMatching = function (e) {
            qnx.callExtensionMethod("webview.setPatternMatchingEnabled", this.id, e)
        }, t.prototype.addMultipleSSLCertificates = function (e) {
            qnx.callExtensionMethod("webview.addKnownSSLCertificates", this.id, e)
        }, t.prototype.captureContents = function (e, n, i) {
            var t, a, o, l = 0;
            a = function (e, n) {
                n = JSON.parse(n), o = n.base64PNGImage, i && "function" == typeof i && (i(o), this.removeEventListener("CaptureContents", a), p = !1)
            }, p || "function" != typeof i || (this.on("CaptureContents", a), p = !0, t = l++), qnx.callExtensionMethod("webview.captureContents", this.id, t, e, n)
        }, t.prototype.log = function (e) {
            qnx.callExtensionMethod("webview.log", this.id, e)
        }, t.prototype.removeAllKnownSSLCertificates = function () {
            qnx.callExtensionMethod("webview.removeAllKnownSSLCertificates", this.id)
        }, t.prototype.removeKnownSSLCertificate = function (e, n) {
            qnx.callExtensionMethod("webview.removeKnownSSLCertificate", this.id, e, n)
        }, t.prototype.requestCurrentContextUpdate = function () {
            qnx.callExtensionMethod("webview.requestCurrentContextUpdate", this.id)
        }, t.prototype.dialogResponse = function (e, n, i, t) {
            qnx.callExtensionMethod("webview.dialogResponse", this.id, e, !0, n ? n : "", i ? encodeURIComponent(i) : "", t ? encodeURIComponent(t) : "")
        }, t.prototype.chooseFileResponse = function (e, n) {
            n = n || "", qnx.callExtensionMethod("webview.chooseFileResponse", this.id, e, n)
        }, t.prototype.createTouchInputSession = function () {
            qnx.callExtensionMethod("webview.createTouchInputSession", this.id)
        }, t.prototype.destroyTouchInputSession = function () {
            qnx.callExtensionMethod("webview.destroyTouchInputSession", this.id)
        }, t.prototype.setJoystickSessionSize = function (e, n) {
            qnx.callExtensionMethod("webview.setJoystickSessionSize", this.id, JSON.stringify({
                width: e,
                height: n
            }))
        }, i.exports = t
    }), define("wp2/lib/rotationHelper", ["require", "exports", "module"], function (e, n, i) {
        var t, a, o = {},
            l = function () {
                t.notifyRotateComplete()
            },
            s = function (e, n, i) {
                wp.getController().on("PropertyViewportEvent", l), window.screen.height === n && window.screen.width === e && wp.getController().emit("PropertyViewportEvent"), void 0 !== typeof e && void 0 !== typeof n && void 0 !== typeof i && qnx.callExtensionMethod("applicationWindow.setSize", e, n, i), t.setWindowOrientation(i), Object.keys(o).forEach(function (t) {
                    t = window.parseInt(t, 10), o[t].setApplicationOrientation(i), o[t].setGeometry(0, 0, e, n), o[t].notifyApplicationOrientationDone()
                })
            },
            r = function (e) {
                switch (e) {
                    case "right_up":
                        return 90;
                    case "left_up":
                        return 270;
                    case "bottom_up":
                        return 180;
                    default:
                        return 0
                }
            },
            d = function (e) {
                var n = r(e.edge);
                t.setWindowOrientation(n - 360), Object.keys(o).forEach(function (i) {
                    i = window.parseInt(i, 10), o[i].setApplicationOrientation(n), o[i].setGeometry(0, 0, e.width, e.height)
                })
            },
            p = function () {
                Object.keys(o).forEach(function (e) {
                    o[e].notifyApplicationOrientationDone()
                }), t.un("PropertyViewportEvent", l)
            };
        a = {
            addWebview: function (e) {
                o[e.id] = e
            },
            removeWebview: function (e) {
                delete o[e.id]
            },
            init: function (e, n) {
                t || (t = e, a.addWebview(n), t.on("application.rotate", s), t.on("application.rotateDone", p), n.on("invocation.cardResize", d))
            }
        }, i.exports = a
    }), define("core/lib/webviewManager", ["require", "exports", "module", "./WebView", "../../wp2/lib/rotationHelper", "./events"], function (e, n, i) {
        function t() {
            var e = window.wp.getApplication(),
                n = o(1);
            m.init(e, n), h.on("inspector.statusChanged", function (e) {
                v.forEach(function (n) {
                    n.consoleLogEnabled = e
                })
            })
        }

        function a(e, n) {
            var i, t = {};
            return e && "function" == typeof e ? t.onCreate = e : (t = e ? e : {}, t.onCreate = n), t && t.WebViewId && (i = o(t.WebViewId)), i || (i = new c(t), v.push(i), m.addWebview(i)), i.on("Destroyed", function () {
                var e = v.indexOf(i); - 1 !== e && v.splice(e, 1), m.removeWebview(i)
            }), i
        }

        function o(e) {
            var n, i;
            for (i = 0; v.length > i; i++)
                if (v[i].id === e) {
                    n = v[i];
                    break
                } return n
        }

        function l(e) {
            var n, i;
            for (i = 0; v.length > i; i++)
                if (v[i].name === e) {
                    n = v[i];
                    break
                } return n
        }

        function s(e, n) {
            v.forEach(function (i) {
                i.on(e, n)
            })
        }

        function r(e, n) {
            v.forEach(function (i) {
                i.un(e, n)
            })
        }

        function d(e, n) {
            v.forEach(function (i) {
                i.once(e, n)
            })
        }

        function p(e, n, i) {
            v.forEach(function (t) {
                t.emit(e, n, i)
            })
        }
        var u, o, c = e("./WebView"),
            m = e("../../wp2/lib/rotationHelper"),
            h = e("./events"),
            v = [];
        u = {
            init: t,
            createWebView: a,
            webViews: v,
            getWebViewById: o,
            getWebViewByName: l,
            on: s,
            un: r,
            once: d,
            emit: p
        }, i.exports = u
    }), define("wp1/lib/WebView", ["require", "exports", "module"], function (e, n, i) {
        function t(e, n) {
            e.prototype.__defineSetter__("on" + n, function (e) {
                s[n] && (this.un(n, s[n]), delete s[n]), s[n] = e, this.on(n, function (n, i) {
                    var t = e(i);
                    t && (n.returnValue = t)
                })
            }), e.prototype.__defineGetter__("on" + n, function (e) {
                return s[e]
            })
        }

        function a(e) {
            var n;
            e.prototype.addEventListener = function (e, n) {
                this.on(e, n.alteredFunc = function (e, i) {
                    n(i)
                })
            }, e.prototype.removeEventListener = function (e, n) {
                this.un(e, n.alteredFunc)
            }, e.prototype.dispatchEvent = function (e, n, i) {
                this.emit(e, n, i)
            };
            for (n in l) t(e, l[n])
        }
        var o, l = ["JavaScriptWindowObjectCleared", "LocationChanging", "ContextMenuRequestEvent", "ContextMenuCancelEvent", "PropertyCurrentContextEvent", "UnknownProtocol", "DialogRequested", "ChooseFile", "SSLHandshakingFailed", "GeolocationPermissionRequest", "NotificationPermissionRequest", "NetworkError", "NotificationPermissionCheck", "UserMediaRequest", "OpenWindow", "ChildWindowOpen", "ChildWebViewCreated", "NetworkResourceStatusReceived", "NetworkResourceHeaderReceived", "NetworkResourceDataReceived", "NetworkResourceRequested"],
            s = {};
        o = {
            extendPrototype: a
        }, i.exports = o
    }), define("wp2/lib/defaultHandlers/InvokeRequestEvent", ["require", "exports", "module"], function (e, n, i) {
        i.exports = {
            handle: function (e) {
                return function (n, i) {
                    var t = JSON.parse(i),
                        a = {
                            uri: t.uri
                        };
                    window.wp.core.invocation.invoke(a, function (n) {
                        n && e && e.uiWebView && window.wp.getController().emit("InvokeRequestEventError", [n])
                    })
                }
            }
        }
    }), define("wp2/lib/mimeTypes", ["require", "exports", "module"], function (e, n, i) {
        function t() {
            l.addMimeTypes("3g2", "video/3gpp2"), l.addMimeTypes("3gp", "video/3gpp"), l.addMimeTypes("aac", "audio/aac"), l.addMimeTypes("abs", "audio/x-mpeg"), l.addMimeTypes("ai", "application/postscript"), l.addMimeTypes("aif", "audio/x-aiff"), l.addMimeTypes("aifc", "audio/x-aiff"), l.addMimeTypes("aiff", "audio/x-aiff"), l.addMimeTypes("aim", "application/x-aim"), l.addMimeTypes("amr", "audio/amr"), l.addMimeTypes("art", "image/x-jg"), l.addMimeTypes("asc", "text/plain"), l.addMimeTypes("asf", "video/x-ms-asf"), l.addMimeTypes("asx", "video/x-ms-asf"), l.addMimeTypes("atom", "application/atom+xml"), l.addMimeTypes("au", "audio/basic"), l.addMimeTypes("avi", "video/x-msvideo"), l.addMimeTypes("avx", "video/x-rad-screenplay"), l.addMimeTypes("bcpio", "application/x-bcpio"), l.addMimeTypes("bin", "application/octet-stream"), l.addMimeTypes("bmp", "image/bmp"), l.addMimeTypes("body", "text/html"), l.addMimeTypes("cdf", "application/x-cdf"), l.addMimeTypes("cer", "application/x-x509-ca-cert"), l.addMimeTypes("cgm", "image/cgm"), l.addMimeTypes("class", "application/java"), l.addMimeTypes("cpio", "application/x-cpio"), l.addMimeTypes("csh", "application/x-csh"), l.addMimeTypes("css", "text/css"), l.addMimeTypes("dib", "image/bmp"), l.addMimeTypes("djv", "image/vnd.djvu"), l.addMimeTypes("djvu", "image/vnd.djvu"), l.addMimeTypes("dll", "application/octet-stream"), l.addMimeTypes("doc", "application/msword"), l.addMimeTypes("odt", "application/vnd.oasis.opendocument.text"), l.addMimeTypes("ods", "application/vnd.oasis.opendocument.spreadsheet"), l.addMimeTypes("docm", "application/vnd.ms-word.document.macroEnabled.12"), l.addMimeTypes("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"), l.addMimeTypes("dot", "application/msword"), l.addMimeTypes("dotm", "application/vnd.ms-word.template.macroEnabled.12"), l.addMimeTypes("dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"), l.addMimeTypes("dtd", "application/xml-dtd"), l.addMimeTypes("dv", "video/x-dv"), l.addMimeTypes("dvi", "application/x-dvi"), l.addMimeTypes("eps", "application/postscript"), l.addMimeTypes("etx", "text/x-setext"), l.addMimeTypes("exe", "application/octet-stream"), l.addMimeTypes("flac", "audio/flac"), l.addMimeTypes("gif", "image/gif"), l.addMimeTypes("gtar", "application/x-gtar"), l.addMimeTypes("gz", "application/x-gzip"), l.addMimeTypes("h264", "video/h264"), l.addMimeTypes("hdf", "application/x-hdf"), l.addMimeTypes("hqx", "application/mac-binhex40"), l.addMimeTypes("htc", "text/x-component"), l.addMimeTypes("htm", "text/html"), l.addMimeTypes("html", "text/html"), l.addMimeTypes("hqx", "application/mac-binhex40"), l.addMimeTypes("ico", "image/x-icon"), l.addMimeTypes("ics", "text/calendar"), l.addMimeTypes("ief", "image/ief"), l.addMimeTypes("ifb", "text/calendar"), l.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor"), l.addMimeTypes("jar", "application/java-archive"), l.addMimeTypes("java", "text/plain"), l.addMimeTypes("jnlp", "application/x-java-jnlp-file"), l.addMimeTypes("jpe", "image/jpeg"), l.addMimeTypes("jpeg", "image/jpeg"), l.addMimeTypes("jpg", "image/jpeg"), l.addMimeTypes("js", "text/javascript"), l.addMimeTypes("jsf", "text/plain"), l.addMimeTypes("jspf", "text/plain"), l.addMimeTypes("kar", "audio/x-midi"), l.addMimeTypes("latex", "application/x-latex"), l.addMimeTypes("m2ts", "video/MP2T"), l.addMimeTypes("m3u", "audio/x-mpegurl"), l.addMimeTypes("m4a", "audio/mp4a-latm"), l.addMimeTypes("m4b", "audio/mp4a-latm"), l.addMimeTypes("m4p", "audio/mp4a-latm"), l.addMimeTypes("m4u", "video/vnd.mpegurl"), l.addMimeTypes("m4v", "video/x-m4v"), l.addMimeTypes("mac", "image/x-macpaint"), l.addMimeTypes("man", "application/x-troff-man"), l.addMimeTypes("mathml", "application/mathml+xml"), l.addMimeTypes("me", "application/x-troff-me"), l.addMimeTypes("mid", "audio/x-midi"), l.addMimeTypes("midi", "audio/x-midi"), l.addMimeTypes("mif", "application/x-mif"), l.addMimeTypes("mka", "audio/x-matroska"), l.addMimeTypes("mkv", "video/x-matroska"), l.addMimeTypes("mk3d", "video/x-matroska-3d"), l.addMimeTypes("mov", "video/quicktime"), l.addMimeTypes("movie", "video/x-sgi-movie"), l.addMimeTypes("mp1", "audio/x-mpeg"), l.addMimeTypes("mp2", "audio/x-mpeg"), l.addMimeTypes("mp3", "audio/x-mpeg"), l.addMimeTypes("mp4", "video/mp4"), l.addMimeTypes("mpa", "audio/x-mpeg"), l.addMimeTypes("mpe", "video/mpeg"), l.addMimeTypes("mpeg", "video/mpeg"), l.addMimeTypes("mpega", "audio/x-mpeg"), l.addMimeTypes("mpg", "video/mpeg"), l.addMimeTypes("mpv2", "video/mpeg2"), l.addMimeTypes("ms", "application/x-wais-source"), l.addMimeTypes("nc", "application/x-netcdf"), l.addMimeTypes("oda", "application/oda"), l.addMimeTypes("ogg", "audio/ogg"), l.addMimeTypes("pbm", "image/x-portable-bitmap"), l.addMimeTypes("pct", "image/pict"), l.addMimeTypes("pdf", "application/pdf"), l.addMimeTypes("pgm", "image/x-portable-graymap"), l.addMimeTypes("pic", "image/pict"), l.addMimeTypes("pict", "image/pict"), l.addMimeTypes("pls", "audio/x-scpls"), l.addMimeTypes("png", "image/png"), l.addMimeTypes("pnm", "image/x-portable-anymap"), l.addMimeTypes("pnt", "image/x-macpaint"), l.addMimeTypes("pot", "application/vnd.ms-powerpoint"), l.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroEnabled.12"), l.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template"), l.addMimeTypes("ppm", "image/x-portable-pixmap"), l.addMimeTypes("ppt", "application/vnd.ms-powerpoint"), l.addMimeTypes("pps", "application/vnd.ms-powerpoint"), l.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"), l.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"), l.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12"), l.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"), l.addMimeTypes("ps", "application/postscript"), l.addMimeTypes("psd", "image/x-photoshop"), l.addMimeTypes("qcp", "audio/qcelp"), l.addMimeTypes("qt", "video/quicktime"), l.addMimeTypes("qti", "image/x-quicktime"), l.addMimeTypes("qtif", "image/x-quicktime"), l.addMimeTypes("ras", "image/x-cmu-raster"), l.addMimeTypes("rdf", "application/rdf+xml"), l.addMimeTypes("rgb", "image/x-rgb"), l.addMimeTypes("rm", "application/vnd.rn-realmedia"), l.addMimeTypes("roff", "application/x-troff"), l.addMimeTypes("rtf", "application/rtf"), l.addMimeTypes("rtx", "text/richtext"), l.addMimeTypes("sh", "application/x-sh"), l.addMimeTypes("shar", "application/x-shar"), l.addMimeTypes("smf", "audio/x-midi"), l.addMimeTypes("sit", "application/x-stuffit"), l.addMimeTypes("snd", "audio/basic"), l.addMimeTypes("src", "application/x-wais-source"), l.addMimeTypes("sv4cpio", "application/x-sv4cpio"), l.addMimeTypes("sv4crc", "application/x-sv4crc"), l.addMimeTypes("svg", "image/svg+xml"), l.addMimeTypes("svgz", "image/svg+xml"), l.addMimeTypes("swf", "application/x-shockwave-flash"), l.addMimeTypes("t", "application/x-troff"), l.addMimeTypes("tar", "application/x-tar"), l.addMimeTypes("tcl", "application/x-tcl"), l.addMimeTypes("tex", "application/x-tex"), l.addMimeTypes("texi", "application/x-texinfo"), l.addMimeTypes("texinfo", "application/x-texinfo"), l.addMimeTypes("tif", "image/tiff"), l.addMimeTypes("tiff", "image/tiff"), l.addMimeTypes("tr", "application/x-troff"), l.addMimeTypes("tsv", "text/tab-separated-values"), l.addMimeTypes("txt", "text/plain"), l.addMimeTypes("ulw", "audio/basic"), l.addMimeTypes("ustar", "application/x-ustar"), l.addMimeTypes("vsd", "application/x-visio"), l.addMimeTypes("vxml", "application/voicexml+xml"), l.addMimeTypes("wav", "audio/x-wav"), l.addMimeTypes("wma", "audio/x-ms-wma"), l.addMimeTypes("wml", "text/vnd.wap.wml"), l.addMimeTypes("wmlc", "application/vnd.wap.wmlc"), l.addMimeTypes("wmls", "text/vnd.wap.wmlscript"), l.addMimeTypes("wmlscriptc", "application/vnd.wap.wmlscriptc"), l.addMimeTypes("wmv", "video/x-ms-wmv"), l.addMimeTypes("wrl", "x-world/x-vrml"), l.addMimeTypes("wspolicy", "application/wspolicy+xml"), l.addMimeTypes("xbm", "image/x-xbitmap"), l.addMimeTypes("xht", "application/xhtml+xml"), l.addMimeTypes("xhtml", "application/xhtml+xml"), l.addMimeTypes("xls", "application/vnd.ms-excel"), l.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12"), l.addMimeTypes("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"), l.addMimeTypes("xlt", "application/vnd.ms-excel"), l.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroEnabled.12"), l.addMimeTypes("xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"), l.addMimeTypes("xml", "application/xml"), l.addMimeTypes("xpm", "image/x-xpixmap"), l.addMimeTypes("xsl", "application/xml"), l.addMimeTypes("xslt", "application/xslt+xml"), l.addMimeTypes("xul", "application/vnd.mozilla.xul+xml"), l.addMimeTypes("xwd", "image/x-xwindowdump"), l.addMimeTypes("Z", "application/x-compress"), l.addMimeTypes("z", "application/x-compress"), l.addMimeTypes("zip", "application/zip")
        }

        function a() {
            l.addMimeTypes("atomcat", "application/atomcat+xml"), l.addMimeTypes("atomsvc", "application/atomsvc+xml"), l.addMimeTypes("ccxml", "application/ccxml+xml"), l.addMimeTypes("cu", "application/cu-seeme"), l.addMimeTypes("davmount", "application/davmount+xml"), l.addMimeTypes("ecma", "application/ecmascript"), l.addMimeTypes("emma", "application/emma+xml"), l.addMimeTypes("epub", "application/epub+zip"), l.addMimeTypes("pfr", "application/font-tdpfr"), l.addMimeTypes("stk", "application/hyperstudio"), l.addMimeTypes("jar", "application/java-archive"), l.addMimeTypes("ser", "application/java-serialized-object"), l.addMimeTypes("class", "application/java-vm"), l.addMimeTypes("json", "application/json"), l.addMimeTypes("lostxml", "application/lost+xml"), l.addMimeTypes("hqx", "application/mac-binhex40"), l.addMimeTypes("cpt", "application/mac-compactpro"), l.addMimeTypes("mrc", "application/marc"), l.addMimeTypes("ma,nb,mb", "application/mathematica"), l.addMimeTypes("mathml", "application/mathml+xml"), l.addMimeTypes("mbox", "application/mbox"), l.addMimeTypes("mscml", "application/mediaservercontrol+xml"), l.addMimeTypes("mp4s", "application/mp4"), l.addMimeTypes("doc,dot", "application/msword"), l.addMimeTypes("mxf", "application/mxf"), l.addMimeTypes("oda", "application/oda"), l.addMimeTypes("opf", "application/oebps-package+xml"), l.addMimeTypes("ogx", "application/ogg"), l.addMimeTypes("onetoc,onetoc2,onetmp,onepkg", "application/onenote"), l.addMimeTypes("xer", "application/patch-ops-error+xml"), l.addMimeTypes("pgp", "application/pgp-encrypted"), l.addMimeTypes("asc,sig", "application/pgp-signature"), l.addMimeTypes("prf", "application/pics-rules"), l.addMimeTypes("p10", "application/pkcs10"), l.addMimeTypes("p7m,p7c", "application/pkcs7-mime"), l.addMimeTypes("p7s", "application/pkcs7-signature"), l.addMimeTypes("cer", "application/pkix-cert"), l.addMimeTypes("crl", "application/pkix-crl"), l.addMimeTypes("pkipath", "application/pkix-pkipath"), l.addMimeTypes("pki", "application/pkixcmp"), l.addMimeTypes("pls", "application/pls+xml"), l.addMimeTypes("ai,eps,ps", "application/postscript"), l.addMimeTypes("cww", "application/prs.cww"), l.addMimeTypes("rdf", "application/rdf+xml"), l.addMimeTypes("rif", "application/reginfo+xml"), l.addMimeTypes("rnc", "application/relax-ng-compact-syntax"), l.addMimeTypes("rl", "application/resource-lists+xml"), l.addMimeTypes("rld", "application/resource-lists-diff+xml"), l.addMimeTypes("rs", "application/rls-services+xml"), l.addMimeTypes("rsd", "application/rsd+xml"), l.addMimeTypes("rss", "application/rss+xml"), l.addMimeTypes("rtf", "application/rtf"), l.addMimeTypes("sbml", "application/sbml+xml"), l.addMimeTypes("scq", "application/scvp-cv-request"), l.addMimeTypes("scs", "application/scvp-cv-response"), l.addMimeTypes("spq", "application/scvp-vp-request"), l.addMimeTypes("spp", "application/scvp-vp-response"), l.addMimeTypes("sdp", "application/sdp"), l.addMimeTypes("setpay", "application/set-payment-initiation"), l.addMimeTypes("setreg", "application/set-registration-initiation"), l.addMimeTypes("shf", "application/shf+xml"), l.addMimeTypes("smi,smil", "application/smil+xml"), l.addMimeTypes("rq", "application/sparql-query"), l.addMimeTypes("srx", "application/sparql-results+xml"), l.addMimeTypes("gram", "application/srgs"), l.addMimeTypes("grxml", "application/srgs+xml"), l.addMimeTypes("ssml", "application/ssml+xml"), l.addMimeTypes("plb", "application/vnd.3gpp.pic-bw-large"), l.addMimeTypes("psb", "application/vnd.3gpp.pic-bw-small"), l.addMimeTypes("pvb", "application/vnd.3gpp.pic-bw-var"), l.addMimeTypes("tcap", "application/vnd.3gpp2.tcap"), l.addMimeTypes("pwn", "application/vnd.3m.post-it-notes"), l.addMimeTypes("aso", "application/vnd.accpac.simply.aso"), l.addMimeTypes("imp", "application/vnd.accpac.simply.imp"), l.addMimeTypes("acu", "application/vnd.acucobol"), l.addMimeTypes("atc,acutc", "application/vnd.acucorp"), l.addMimeTypes("air", "application/vnd.adobe.air-application-installer-package+zip"), l.addMimeTypes("xdp", "application/vnd.adobe.xdp+xml"), l.addMimeTypes("xfdf", "application/vnd.adobe.xfdf"), l.addMimeTypes("azf", "application/vnd.airzip.filesecure.azf"), l.addMimeTypes("azs", "application/vnd.airzip.filesecure.azs"), l.addMimeTypes("azw", "application/vnd.amazon.ebook"), l.addMimeTypes("acc", "application/vnd.americandynamics.acc"), l.addMimeTypes("ami", "application/vnd.amiga.ami"), l.addMimeTypes("apk", "application/vnd.android.package-archive"), l.addMimeTypes("cii", "application/vnd.anser-web-certificate-issue-initiation"), l.addMimeTypes("fti", "application/vnd.anser-web-funds-transfer-initiation"), l.addMimeTypes("atx", "application/vnd.antix.game-component"), l.addMimeTypes("mpkg", "application/vnd.apple.installer+xml"), l.addMimeTypes("swi", "application/vnd.arastra.swi"), l.addMimeTypes("aep", "application/vnd.audiograph"), l.addMimeTypes("mpm", "application/vnd.blueice.multipass"), l.addMimeTypes("bmi", "application/vnd.bmi"), l.addMimeTypes("rep", "application/vnd.businessobjects"), l.addMimeTypes("cdxml", "application/vnd.chemdraw+xml"), l.addMimeTypes("mmd", "application/vnd.chipnuts.karaoke-mmd"), l.addMimeTypes("cdy", "application/vnd.cinderella"), l.addMimeTypes("cla", "application/vnd.claymore"), l.addMimeTypes("c4g,c4d,c4f,c4p,c4u", "application/vnd.clonk.c4group"), l.addMimeTypes("csp", "application/vnd.commonspace"), l.addMimeTypes("cdbcmsg", "application/vnd.contact.cmsg"), l.addMimeTypes("cmc", "application/vnd.cosmocaller"), l.addMimeTypes("clkx", "application/vnd.crick.clicker"), l.addMimeTypes("clkk", "application/vnd.crick.clicker.keyboard"), l.addMimeTypes("clkp", "application/vnd.crick.clicker.palette"), l.addMimeTypes("clkt", "application/vnd.crick.clicker.template"), l.addMimeTypes("clkw", "application/vnd.crick.clicker.wordbank"), l.addMimeTypes("wbs", "application/vnd.criticaltools.wbs+xml"), l.addMimeTypes("pml", "application/vnd.ctc-posml"), l.addMimeTypes("ppd", "application/vnd.cups-ppd"), l.addMimeTypes("car", "application/vnd.curl.car"), l.addMimeTypes("pcurl", "application/vnd.curl.pcurl"), l.addMimeTypes("rdz", "application/vnd.data-vision.rdz"), l.addMimeTypes("fe_launch", "application/vnd.denovo.fcselayout-link"), l.addMimeTypes("dna", "application/vnd.dna"), l.addMimeTypes("mlp", "application/vnd.dolby.mlp"), l.addMimeTypes("dpg", "application/vnd.dpgraph"), l.addMimeTypes("dfac", "application/vnd.dreamfactory"), l.addMimeTypes("geo", "application/vnd.dynageo"), l.addMimeTypes("mag", "application/vnd.ecowin.chart"), l.addMimeTypes("nml", "application/vnd.enliven"), l.addMimeTypes("esf", "application/vnd.epson.esf"), l.addMimeTypes("msf", "application/vnd.epson.msf"), l.addMimeTypes("qam", "application/vnd.epson.quickanime"), l.addMimeTypes("slt", "application/vnd.epson.salt"), l.addMimeTypes("ssf", "application/vnd.epson.ssf"), l.addMimeTypes("es3,et3", "application/vnd.eszigno3+xml"), l.addMimeTypes("ez2", "application/vnd.ezpix-album"), l.addMimeTypes("ez3", "application/vnd.ezpix-package"), l.addMimeTypes("fdf", "application/vnd.fdf"), l.addMimeTypes("mseed", "application/vnd.fdsn.mseed"), l.addMimeTypes("seed,dataless", "application/vnd.fdsn.seed"), l.addMimeTypes("gph", "application/vnd.flographit"), l.addMimeTypes("ftc", "application/vnd.fluxtime.clip"), l.addMimeTypes("fm,frame,maker,book", "application/vnd.framemaker"), l.addMimeTypes("fnc", "application/vnd.frogans.fnc"), l.addMimeTypes("ltf", "application/vnd.frogans.ltf"), l.addMimeTypes("fsc", "application/vnd.fsc.weblaunch"), l.addMimeTypes("oas", "application/vnd.fujitsu.oasys"), l.addMimeTypes("oa2", "application/vnd.fujitsu.oasys2"), l.addMimeTypes("oa3", "application/vnd.fujitsu.oasys3"), l.addMimeTypes("fg5", "application/vnd.fujitsu.oasysgp"), l.addMimeTypes("bh2", "application/vnd.fujitsu.oasysprs"), l.addMimeTypes("ddd", "application/vnd.fujixerox.ddd"), l.addMimeTypes("xdw", "application/vnd.fujixerox.docuworks"), l.addMimeTypes("xbd", "application/vnd.fujixerox.docuworks.binder"), l.addMimeTypes("fzs", "application/vnd.fuzzysheet"), l.addMimeTypes("txd", "application/vnd.genomatix.tuxedo"), l.addMimeTypes("ggb", "application/vnd.geogebra.file"), l.addMimeTypes("ggt", "application/vnd.geogebra.tool"), l.addMimeTypes("gex,gre", "application/vnd.geometry-explorer"), l.addMimeTypes("gmx", "application/vnd.gmx"), l.addMimeTypes("kml", "application/vnd.google-earth.kml+xml"), l.addMimeTypes("kmz", "application/vnd.google-earth.kmz"), l.addMimeTypes("gqf,gqs", "application/vnd.grafeq"), l.addMimeTypes("gac", "application/vnd.groove-account"), l.addMimeTypes("ghf", "application/vnd.groove-help"), l.addMimeTypes("gim", "application/vnd.groove-identity-message"), l.addMimeTypes("grv", "application/vnd.groove-injector"), l.addMimeTypes("gtm", "application/vnd.groove-tool-message"), l.addMimeTypes("tpl", "application/vnd.groove-tool-template"), l.addMimeTypes("vcg", "application/vnd.groove-vcard"), l.addMimeTypes("zmm", "application/vnd.handheld-entertainment+xml"), l.addMimeTypes("hbci", "application/vnd.hbci"), l.addMimeTypes("les", "application/vnd.hhe.lesson-player"), l.addMimeTypes("hpgl", "application/vnd.hp-hpgl"), l.addMimeTypes("hpid", "application/vnd.hp-hpid"), l.addMimeTypes("hps", "application/vnd.hp-hps"), l.addMimeTypes("jlt", "application/vnd.hp-jlyt"), l.addMimeTypes("pcl", "application/vnd.hp-pcl"), l.addMimeTypes("pclxl", "application/vnd.hp-pclxl"), l.addMimeTypes("sfd-hdstx", "application/vnd.hydrostatix.sof-data"), l.addMimeTypes("x3d", "application/vnd.hzn-3d-crossword"), l.addMimeTypes("mpy", "application/vnd.ibm.minipay"), l.addMimeTypes("afp,listafp,list3820", "application/vnd.ibm.modcap"), l.addMimeTypes("irm", "application/vnd.ibm.rights-management"), l.addMimeTypes("sc", "application/vnd.ibm.secure-container"), l.addMimeTypes("icc,icm", "application/vnd.iccprofile"), l.addMimeTypes("igl", "application/vnd.igloader"), l.addMimeTypes("ivp", "application/vnd.immervision-ivp"), l.addMimeTypes("ivu", "application/vnd.immervision-ivu"), l.addMimeTypes("xpw,xpx", "application/vnd.intercon.formnet"), l.addMimeTypes("qbo", "application/vnd.intu.qbo"), l.addMimeTypes("qfx", "application/vnd.intu.qfx"), l.addMimeTypes("rcprofile", "application/vnd.ipunplugged.rcprofile"), l.addMimeTypes("irp", "application/vnd.irepository.package+xml"), l.addMimeTypes("xpr", "application/vnd.is-xpr"), l.addMimeTypes("jam", "application/vnd.jam"), l.addMimeTypes("rms", "application/vnd.jcp.javame.midlet-rms"), l.addMimeTypes("jisp", "application/vnd.jisp"), l.addMimeTypes("joda", "application/vnd.joost.joda-archive"), l.addMimeTypes("ktz,ktr", "application/vnd.kahootz"), l.addMimeTypes("karbon", "application/vnd.kde.karbon"), l.addMimeTypes("chrt", "application/vnd.kde.kchart"), l.addMimeTypes("kfo", "application/vnd.kde.kformula"), l.addMimeTypes("flw", "application/vnd.kde.kivio"), l.addMimeTypes("kon", "application/vnd.kde.kontour"), l.addMimeTypes("kpr,kpt", "application/vnd.kde.kpresenter"), l.addMimeTypes("ksp", "application/vnd.kde.kspread"), l.addMimeTypes("kwd,kwt", "application/vnd.kde.kword"), l.addMimeTypes("htke", "application/vnd.kenameaapp"), l.addMimeTypes("kia", "application/vnd.kidspiration"), l.addMimeTypes("kne,knp", "application/vnd.kinar"), l.addMimeTypes("skp,skd,skt,skm", "application/vnd.koan"), l.addMimeTypes("sse", "application/vnd.kodak-descriptor"), l.addMimeTypes("lbd", "application/vnd.llamagraphics.life-balance.desktop"), l.addMimeTypes("lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"), l.addMimeTypes("123", "application/vnd.lotus-1-2-3"), l.addMimeTypes("apr", "application/vnd.lotus-approach"), l.addMimeTypes("pre", "application/vnd.lotus-freelance"), l.addMimeTypes("nsf", "application/vnd.lotus-notes"), l.addMimeTypes("org", "application/vnd.lotus-organizer"), l.addMimeTypes("scm", "application/vnd.lotus-screencam"), l.addMimeTypes("lwp", "application/vnd.lotus-wordpro"), l.addMimeTypes("portpkg", "application/vnd.macports.portpkg"), l.addMimeTypes("mcd", "application/vnd.mcd"), l.addMimeTypes("mc1", "application/vnd.medcalcdata"), l.addMimeTypes("cdkey", "application/vnd.mediastation.cdkey"), l.addMimeTypes("mwf", "application/vnd.mfer"), l.addMimeTypes("mfm", "application/vnd.mfmp"), l.addMimeTypes("flo", "application/vnd.micrografx.flo"), l.addMimeTypes("igx", "application/vnd.micrografx.igx"), l.addMimeTypes("mif", "application/vnd.mif"), l.addMimeTypes("daf", "application/vnd.mobius.daf"), l.addMimeTypes("dis", "application/vnd.mobius.dis"), l.addMimeTypes("mbk", "application/vnd.mobius.mbk"), l.addMimeTypes("mqy", "application/vnd.mobius.mqy"), l.addMimeTypes("msl", "application/vnd.mobius.msl"), l.addMimeTypes("plc", "application/vnd.mobius.plc"), l.addMimeTypes("txf", "application/vnd.mobius.txf"), l.addMimeTypes("mpn", "application/vnd.mophun.application"), l.addMimeTypes("mpc", "application/vnd.mophun.certificate"), l.addMimeTypes("xul", "application/vnd.mozilla.xul+xml"), l.addMimeTypes("cil", "application/vnd.ms-artgalry"), l.addMimeTypes("cab", "application/vnd.ms-cab-compressed"), l.addMimeTypes("xls,xlm,xla,xlc,xlt,xlw", "application/vnd.ms-excel"), l.addMimeTypes("xlam", "application/vnd.ms-excel.addin.macroenabled.12"), l.addMimeTypes("xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12"), l.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroenabled.12"), l.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroenabled.12"), l.addMimeTypes("eot", "application/vnd.ms-fontobject"), l.addMimeTypes("chm", "application/vnd.ms-htmlhelp"), l.addMimeTypes("ims", "application/vnd.ms-ims"), l.addMimeTypes("lrm", "application/vnd.ms-lrm"), l.addMimeTypes("cat", "application/vnd.ms-pki.seccat"), l.addMimeTypes("stl", "application/vnd.ms-pki.stl"), l.addMimeTypes("ppt,pps,pot", "application/vnd.ms-powerpoint"), l.addMimeTypes("ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12"), l.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12"), l.addMimeTypes("sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"), l.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12"), l.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroenabled.12"), l.addMimeTypes("mpp,mpt", "application/vnd.ms-project"), l.addMimeTypes("docm", "application/vnd.ms-word.document.macroenabled.12"), l.addMimeTypes("dotm", "application/vnd.ms-word.template.macroenabled.12"), l.addMimeTypes("wps,wks,wcm,wdb", "application/vnd.ms-works"), l.addMimeTypes("wpl", "application/vnd.ms-wpl"), l.addMimeTypes("xps", "application/vnd.ms-xpsdocument"), l.addMimeTypes("mseq", "application/vnd.mseq"), l.addMimeTypes("mus", "application/vnd.musician"), l.addMimeTypes("msty", "application/vnd.muvee.style"), l.addMimeTypes("nlu", "application/vnd.neurolanguage.nlu"), l.addMimeTypes("nnd", "application/vnd.noblenet-directory"), l.addMimeTypes("nns", "application/vnd.noblenet-sealer"), l.addMimeTypes("nnw", "application/vnd.noblenet-web"), l.addMimeTypes("ngdat", "application/vnd.nokia.n-gage.data"), l.addMimeTypes("n-gage", "application/vnd.nokia.n-gage.symbian.install"), l.addMimeTypes("rpst", "application/vnd.nokia.radio-preset"), l.addMimeTypes("rpss", "application/vnd.nokia.radio-presets"), l.addMimeTypes("edm", "application/vnd.novadigm.edm"), l.addMimeTypes("edx", "application/vnd.novadigm.edx"), l.addMimeTypes("ext", "application/vnd.novadigm.ext"), l.addMimeTypes("odc", "application/vnd.oasis.opendocument.chart"), l.addMimeTypes("otc", "application/vnd.oasis.opendocument.chart-template"), l.addMimeTypes("odb", "application/vnd.oasis.opendocument.database"), l.addMimeTypes("odf", "application/vnd.oasis.opendocument.formula"), l.addMimeTypes("odft", "application/vnd.oasis.opendocument.formula-template"), l.addMimeTypes("odg", "application/vnd.oasis.opendocument.graphics"), l.addMimeTypes("otg", "application/vnd.oasis.opendocument.graphics-template"), l.addMimeTypes("odi", "application/vnd.oasis.opendocument.image"), l.addMimeTypes("oti", "application/vnd.oasis.opendocument.image-template"), l.addMimeTypes("odp", "application/vnd.oasis.opendocument.presentation"), l.addMimeTypes("ots", "application/vnd.oasis.opendocument.spreadsheet-template"), l.addMimeTypes("otm", "application/vnd.oasis.opendocument.text-master"), l.addMimeTypes("ott", "application/vnd.oasis.opendocument.text-template"), l.addMimeTypes("oth", "application/vnd.oasis.opendocument.text-web"), l.addMimeTypes("xo", "application/vnd.olpc-sugar"), l.addMimeTypes("dd2", "application/vnd.oma.dd2+xml"), l.addMimeTypes("oxt", "application/vnd.openofficeorg.extension"), l.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"), l.addMimeTypes("sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide"), l.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"), l.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template"), l.addMimeTypes("dp", "application/vnd.osgi.dp"), l.addMimeTypes("pdb,pqa,oprc", "application/vnd.palm"), l.addMimeTypes("str", "application/vnd.pg.format"), l.addMimeTypes("ei6", "application/vnd.pg.osasli"), l.addMimeTypes("efif", "application/vnd.picsel"), l.addMimeTypes("plf", "application/vnd.pocketlearn"), l.addMimeTypes("pbd", "application/vnd.powerbuilder6"), l.addMimeTypes("box", "application/vnd.previewsystems.box"), l.addMimeTypes("mgz", "application/vnd.proteus.magazine"), l.addMimeTypes("qps", "application/vnd.publishare-delta-tree"), l.addMimeTypes("ptid", "application/vnd.pvi.ptid1"), l.addMimeTypes("qxd,qxt,qwd,qwt,qxl,qxb", "application/vnd.quark.quarkxpress"), l.addMimeTypes("mxl", "application/vnd.recordare.musicxml"), l.addMimeTypes("musicxml", "application/vnd.recordare.musicxml+xml"), l.addMimeTypes("cod", "application/vnd.rim.cod"), l.addMimeTypes("rm", "application/vnd.rn-realmedia"), l.addMimeTypes("link66", "application/vnd.route66.link66+xml"), l.addMimeTypes("see", "application/vnd.seemail"), l.addMimeTypes("sema", "application/vnd.sema"), l.addMimeTypes("semd", "application/vnd.semd"), l.addMimeTypes("semf", "application/vnd.semf"), l.addMimeTypes("ifm", "application/vnd.shana.informed.formdata"), l.addMimeTypes("itp", "application/vnd.shana.informed.formtemplate"), l.addMimeTypes("iif", "application/vnd.shana.informed.interchange"), l.addMimeTypes("ipk", "application/vnd.shana.informed.package"), l.addMimeTypes("twd,twds", "application/vnd.simtech-mindmapper"), l.addMimeTypes("mmf", "application/vnd.smaf"), l.addMimeTypes("teacher", "application/vnd.smart.teacher"), l.addMimeTypes("sdkm,sdkd", "application/vnd.solent.sdkm+xml"), l.addMimeTypes("dxp", "application/vnd.spotfire.dxp"), l.addMimeTypes("sfs", "application/vnd.spotfire.sfs"), l.addMimeTypes("sdc", "application/vnd.stardivision.calc"), l.addMimeTypes("sda", "application/vnd.stardivision.draw"), l.addMimeTypes("sdd", "application/vnd.stardivision.impress"), l.addMimeTypes("smf", "application/vnd.stardivision.math"), l.addMimeTypes("sdw", "application/vnd.stardivision.writer"), l.addMimeTypes("vor", "application/vnd.stardivision.writer"), l.addMimeTypes("sgl", "application/vnd.stardivision.writer-global"), l.addMimeTypes("sxc", "application/vnd.sun.xml.calc"), l.addMimeTypes("stc", "application/vnd.sun.xml.calc.template"), l.addMimeTypes("sxd", "application/vnd.sun.xml.draw"), l.addMimeTypes("std", "application/vnd.sun.xml.draw.template"), l.addMimeTypes("sxi", "application/vnd.sun.xml.impress"), l.addMimeTypes("sti", "application/vnd.sun.xml.impress.template"), l.addMimeTypes("sxm", "application/vnd.sun.xml.math"), l.addMimeTypes("sxw", "application/vnd.sun.xml.writer"), l.addMimeTypes("sxg", "application/vnd.sun.xml.writer.global"), l.addMimeTypes("stw", "application/vnd.sun.xml.writer.template"), l.addMimeTypes("sus,susp", "application/vnd.sus-calendar"), l.addMimeTypes("svd", "application/vnd.svd"), l.addMimeTypes("sis,sisx", "application/vnd.symbian.install"), l.addMimeTypes("xsm", "application/vnd.syncml+xml"), l.addMimeTypes("bdm", "application/vnd.syncml.dm+wbxml"), l.addMimeTypes("xdm", "application/vnd.syncml.dm+xml"), l.addMimeTypes("tao", "application/vnd.tao.intent-module-archive"), l.addMimeTypes("tmo", "application/vnd.tmobile-livetv"), l.addMimeTypes("tpt", "application/vnd.trid.tpt"), l.addMimeTypes("mxs", "application/vnd.triscape.mxs"), l.addMimeTypes("tra", "application/vnd.trueapp"), l.addMimeTypes("ufd,ufdl", "application/vnd.ufdl"), l.addMimeTypes("utz", "application/vnd.uiq.theme"), l.addMimeTypes("umj", "application/vnd.umajin"), l.addMimeTypes("unityweb", "application/vnd.unity"), l.addMimeTypes("uoml", "application/vnd.uoml+xml"), l.addMimeTypes("vcx", "application/vnd.vcx"), l.addMimeTypes("vsd,vst,vss,vsw", "application/vnd.visio"), l.addMimeTypes("vis", "application/vnd.visionary"), l.addMimeTypes("vsf", "application/vnd.vsf"), l.addMimeTypes("wbxml", "application/vnd.wap.wbxml"), l.addMimeTypes("wmlc", "application/vnd.wap.wmlc"), l.addMimeTypes("wmlsc", "application/vnd.wap.wmlscriptc"), l.addMimeTypes("wtb", "application/vnd.webturbo"), l.addMimeTypes("wpd", "application/vnd.wordperfect"), l.addMimeTypes("wqd", "application/vnd.wqd"), l.addMimeTypes("stf", "application/vnd.wt.stf"), l.addMimeTypes("xar", "application/vnd.xara"), l.addMimeTypes("xfdl", "application/vnd.xfdl"), l.addMimeTypes("hvd", "application/vnd.yamaha.hv-dic"), l.addMimeTypes("hvs", "application/vnd.yamaha.hv-script"), l.addMimeTypes("hvp", "application/vnd.yamaha.hv-voice"), l.addMimeTypes("osf", "application/vnd.yamaha.openscoreformat"), l.addMimeTypes("osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"), l.addMimeTypes("saf", "application/vnd.yamaha.smaf-audio"), l.addMimeTypes("spf", "application/vnd.yamaha.smaf-phrase"), l.addMimeTypes("cmp", "application/vnd.yellowriver-custom-menu"), l.addMimeTypes("zir,zirz", "application/vnd.zul"), l.addMimeTypes("zaz", "application/vnd.zzazz.deck+xml"), l.addMimeTypes("vxml", "application/voicexml+xml"), l.addMimeTypes("hlp", "application/winhlp"), l.addMimeTypes("wsdl", "application/wsdl+xml"), l.addMimeTypes("wspolicy", "application/wspolicy+xml"), l.addMimeTypes("abw", "application/x-abiword"), l.addMimeTypes("ace", "application/x-ace-compressed"), l.addMimeTypes("aab,x32,u32,vox", "application/x-authorware-bin"), l.addMimeTypes("aam", "application/x-authorware-map"), l.addMimeTypes("aas", "application/x-authorware-seg"), l.addMimeTypes("torrent", "application/x-bittorrent"), l.addMimeTypes("bz", "application/x-bzip"), l.addMimeTypes("bz2,boz", "application/x-bzip2"), l.addMimeTypes("vcd", "application/x-cdlink"), l.addMimeTypes("chat", "application/x-chat"), l.addMimeTypes("pgn", "application/x-chess-pgn"), l.addMimeTypes("bdf", "application/x-font-bdf"), l.addMimeTypes("gsf", "application/x-font-ghostscript"), l.addMimeTypes("psf", "application/x-font-linux-psf"), l.addMimeTypes("otf", "application/x-font-otf"), l.addMimeTypes("pcf", "application/x-font-pcf"), l.addMimeTypes("snf", "application/x-font-snf"), l.addMimeTypes("ttf,ttc", "application/x-font-ttf"), l.addMimeTypes("pfa,pfb,pfm,afm", "application/x-font-type1"), l.addMimeTypes("spl", "application/x-futuresplash"), l.addMimeTypes("gnumeric", "application/x-gnumeric"), l.addMimeTypes("deb,udeb", "application/x-debian-package"), l.addMimeTypes("dir,dcr,dxr,cst,cct,cxt,w3d,fgd,swa", "application/x-director"), l.addMimeTypes("wad", "application/x-doom"), l.addMimeTypes("ncx", "application/x-dtbncx+xml"), l.addMimeTypes("dtb", "application/x-dtbook+xml"), l.addMimeTypes("res", "application/x-dtbresource+xml"), l.addMimeTypes("prc,mobi", "application/x-mobipocket-ebook"), l.addMimeTypes("application", "application/x-ms-application"), l.addMimeTypes("wmd", "application/x-ms-wmd"), l.addMimeTypes("wmz", "application/x-ms-wmz"), l.addMimeTypes("xbap", "application/x-ms-xbap"), l.addMimeTypes("mdb", "application/x-msaccess"), l.addMimeTypes("obd", "application/x-msbinder"), l.addMimeTypes("crd", "application/x-mscardfile"), l.addMimeTypes("clp", "application/x-msclip"), l.addMimeTypes("exe,dll,com,bat,msi", "application/x-msdownload"), l.addMimeTypes("mvb,m13,m14", "application/x-msmediaview"), l.addMimeTypes("wmf", "application/x-msmetafile"), l.addMimeTypes("mny", "application/x-msmoney"), l.addMimeTypes("pub", "application/x-mspublisher"), l.addMimeTypes("scd", "application/x-msschedule"), l.addMimeTypes("trm", "application/x-msterminal"), l.addMimeTypes("wri", "application/x-mswrite"), l.addMimeTypes("nc,cdf", "application/x-netcdf"), l.addMimeTypes("p12,pfx", "application/x-pkcs12"), l.addMimeTypes("p7b,spc", "application/x-pkcs7-certificates"), l.addMimeTypes("p7r", "application/x-pkcs7-certreqresp"), l.addMimeTypes("rar", "application/x-rar-compressed"), l.addMimeTypes("src", "application/x-wais-source"), l.addMimeTypes("der,crt", "application/x-x509-ca-cert"), l.addMimeTypes("fig", "application/x-xfig"), l.addMimeTypes("xpi", "application/x-xpinstall"), l.addMimeTypes("xenc", "application/xenc+xml"), l.addMimeTypes("xhtml,xht", "application/xhtml+xml"), l.addMimeTypes("xml,xsl", "application/xml"), l.addMimeTypes("dtd", "application/xml-dtd"), l.addMimeTypes("xop", "application/xop+xml"), l.addMimeTypes("xslt", "application/xslt+xml"), l.addMimeTypes("xspf", "application/xspf+xml"), l.addMimeTypes("mxml,xhvml,xvml,xvm", "application/xv+xml"), l.addMimeTypes("zip", "application/zip"), l.addMimeTypes("adp", "audio/adpcm"), l.addMimeTypes("au,snd", "audio/basic"), l.addMimeTypes("mid,midi,kar,rmi", "audio/midi"), l.addMimeTypes("mp4a", "audio/mp4"), l.addMimeTypes("m4a,m4p", "audio/mp4a-latm"), l.addMimeTypes("mpga,mp2,mp2a,mp3,m2a,m3a", "audio/mpeg"), l.addMimeTypes("oga,ogg,spx", "audio/ogg"), l.addMimeTypes("eol", "audio/vnd.digital-winds"), l.addMimeTypes("dts", "audio/vnd.dts"), l.addMimeTypes("dtshd", "audio/vnd.dts.hd"), l.addMimeTypes("lvp", "audio/vnd.lucent.voice"), l.addMimeTypes("pya", "audio/vnd.ms-playready.media.pya"), l.addMimeTypes("ecelp4800", "audio/vnd.nuera.ecelp4800"), l.addMimeTypes("ecelp7470", "audio/vnd.nuera.ecelp7470"), l.addMimeTypes("ecelp9600", "audio/vnd.nuera.ecelp9600"), l.addMimeTypes("aac", "audio/x-aac"), l.addMimeTypes("aif,aiff,aifc", "audio/x-aiff"), l.addMimeTypes("m3u", "audio/x-mpegurl"), l.addMimeTypes("wax", "audio/x-ms-wax"), l.addMimeTypes("wma", "audio/x-ms-wma"), l.addMimeTypes("ram,ra", "audio/x-pn-realaudio"), l.addMimeTypes("rmp", "audio/x-pn-realaudio-plugin"), l.addMimeTypes("vsd", "application/x-visio"), l.addMimeTypes("vxml", "application/voicexml+xml"), l.addMimeTypes("wav", "audio/x-wav"), l.addMimeTypes("cdx", "chemical/x-cdx"), l.addMimeTypes("cif", "chemical/x-cif"), l.addMimeTypes("cmdf", "chemical/x-cmdf"), l.addMimeTypes("cml", "chemical/x-cml"), l.addMimeTypes("csml", "chemical/x-csml"), l.addMimeTypes("xyz", "chemical/x-xyz"), l.addMimeTypes("bmp", "image/bmp"), l.addMimeTypes("cgm", "image/cgm"), l.addMimeTypes("g3", "image/g3fax"), l.addMimeTypes("gif", "image/gif"), l.addMimeTypes("ief", "image/ief"), l.addMimeTypes("jp2", "image/jp2"), l.addMimeTypes("pict,pic,pct", "image/pict"), l.addMimeTypes("png", "image/png"), l.addMimeTypes("btif", "image/prs.btif"), l.addMimeTypes("svg,svgz", "image/svg+xml"), l.addMimeTypes("tiff,tif", "image/tiff"), l.addMimeTypes("psd", "image/vnd.adobe.photoshop"), l.addMimeTypes("djvu,djv", "image/vnd.djvu"), l.addMimeTypes("dwg", "image/vnd.dwg"), l.addMimeTypes("dxf", "image/vnd.dxf"), l.addMimeTypes("fbs", "image/vnd.fastbidsheet"), l.addMimeTypes("fpx", "image/vnd.fpx"), l.addMimeTypes("fst", "image/vnd.fst"), l.addMimeTypes("mmr", "image/vnd.fujixerox.edmics-mmr"), l.addMimeTypes("rlc", "image/vnd.fujixerox.edmics-rlc"), l.addMimeTypes("mdi", "image/vnd.ms-modi"), l.addMimeTypes("npx", "image/vnd.net-fpx"), l.addMimeTypes("wbmp", "image/vnd.wap.wbmp"), l.addMimeTypes("xif", "image/vnd.xiff"), l.addMimeTypes("ras", "image/x-cmu-raster"), l.addMimeTypes("cmx", "image/x-cmx"), l.addMimeTypes("fh,fhc,fh4,fh5,fh7", "image/x-freehand"), l.addMimeTypes("ico", "image/x-icon"), l.addMimeTypes("pntg,pnt,mac", "image/x-macpaint"), l.addMimeTypes("pcx", "image/x-pcx"), l.addMimeTypes("pnm", "image/x-portable-anymap"), l.addMimeTypes("pbm", "image/x-portable-bitmap"), l.addMimeTypes("pgm", "image/x-portable-graymap"), l.addMimeTypes("ppm", "image/x-portable-pixmap"), l.addMimeTypes("qtif,qti", "image/x-quicktime"), l.addMimeTypes("rgb", "image/x-rgb"), l.addMimeTypes("xbm", "image/x-xbitmap"), l.addMimeTypes("xpm", "image/x-xpixmap"), l.addMimeTypes("xwd", "image/x-xwindowdump"), l.addMimeTypes("eml,mime", "message/rfc822"), l.addMimeTypes("igs,iges", "model/iges"), l.addMimeTypes("msh,mesh,silo", "model/mesh"), l.addMimeTypes("dwf", "model/vnd.dwf"), l.addMimeTypes("gdl", "model/vnd.gdl"), l.addMimeTypes("gtw", "model/vnd.gtw"), l.addMimeTypes("mts", "model/vnd.mts"), l.addMimeTypes("vtu", "model/vnd.vtu"), l.addMimeTypes("wrl,vrml", "model/vrml"), l.addMimeTypes("ics,ifb", "text/calendar"), l.addMimeTypes("css", "text/css"), l.addMimeTypes("csv", "text/csv"), l.addMimeTypes("html,htm", "text/html"), l.addMimeTypes("txt,text,conf,def,list,log,in", "text/plain"), l.addMimeTypes("dsc", "text/prs.lines.tag"), l.addMimeTypes("rtx", "text/richtext"), l.addMimeTypes("sgml,sgm", "text/sgml"), l.addMimeTypes("tsv", "text/tab-separated-values"), l.addMimeTypes("t,tr,roff,man,me,ms", "text/troff"), l.addMimeTypes("uri,uris,urls", "text/uri-list"), l.addMimeTypes("curl", "text/vnd.curl"), l.addMimeTypes("dcurl", "text/vnd.curl.dcurl"), l.addMimeTypes("scurl", "text/vnd.curl.scurl"), l.addMimeTypes("mcurl", "text/vnd.curl.mcurl"), l.addMimeTypes("fly", "text/vnd.fly"), l.addMimeTypes("flx", "text/vnd.fmi.flexstor"), l.addMimeTypes("gv", "text/vnd.graphviz"), l.addMimeTypes("3dml", "text/vnd.in3d.3dml"), l.addMimeTypes("spot", "text/vnd.in3d.spot"), l.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor"), l.addMimeTypes("s,asm", "text/x-asm"), l.addMimeTypes("c,cc,cxx,cpp,h,hh,dic", "text/x-c"), l.addMimeTypes("f,for,f77,f90", "text/x-fortran"), l.addMimeTypes("p,pas", "text/x-pascal"), l.addMimeTypes("java", "text/x-java-source"), l.addMimeTypes("etx", "text/x-setext"), l.addMimeTypes("uu", "text/x-uuencode"), l.addMimeTypes("vcs", "text/x-vcalendar"), l.addMimeTypes("vcf", "text/x-vcard"), l.addMimeTypes("3gp", "video/3gpp"), l.addMimeTypes("3g2", "video/3gpp2"), l.addMimeTypes("h261", "video/h261"), l.addMimeTypes("h263", "video/h263"), l.addMimeTypes("h264", "video/h264"), l.addMimeTypes("jpgv", "video/jpeg"), l.addMimeTypes("jpm,jpgm", "video/jpm"), l.addMimeTypes("mj2,mjp2", "video/mj2"), l.addMimeTypes("mp4,mp4v,mpg4,m4v", "video/mp4"), l.addMimeTypes("mpeg,mpg,mpe,m1v,m2v", "video/mpeg"), l.addMimeTypes("ogv", "video/ogg"), l.addMimeTypes("qt,mov", "video/quicktime"), l.addMimeTypes("fvt", "video/vnd.fvt"), l.addMimeTypes("mxu,m4u", "video/vnd.mpegurl"), l.addMimeTypes("pyv", "video/vnd.ms-playready.media.pyv"), l.addMimeTypes("viv", "video/vnd.vivo"), l.addMimeTypes("dv,dif", "video/x-dv"), l.addMimeTypes("f4v", "video/x-f4v"), l.addMimeTypes("fli", "video/x-fli"), l.addMimeTypes("flv", "video/x-flv"), l.addMimeTypes("asf,asx", "video/x-ms-asf"), l.addMimeTypes("wm", "video/x-ms-wm"), l.addMimeTypes("wmx", "video/x-ms-wmx"), l.addMimeTypes("wvx", "video/x-ms-wvx"), l.addMimeTypes("avi", "video/x-msvideo"), l.addMimeTypes("movie", "video/x-sgi-movie"), l.addMimeTypes("ice", "x-conference/x-cooltalk")
        }

        function o(e, n) {
            p === d.NONE ? (t(), p = d.INITIAL_LOAD) : p === d.INITIAL_LOAD && (s[n] || r[e] || (a(), p = d.FULLY_LOADED))
        }
        var l, s = {},
            r = {},
            d = {
                NONE: 0,
                INITIAL_LOAD: 1,
                FULLY_LOADED: 2
            },
            p = d.NONE;
        l = {
            lookupByFileEnding: function (e) {
                return o(null, e), s[e]
            },
            fileEndingbyMIME: function (e) {
                return o(e, null), r[e]
            },
            addMimeTypes: function (e, n) {
                var i = e.split(",");
                i.forEach(function (e) {
                    s[e] = n, r[n] || (r[n] = []), r[n].push(e)
                })
            }
        }, i.exports = l
    }), define("wp2/lib/utils", ["require", "exports", "module", "./mimeTypes", "./mimeTypes"], function (e, n, i) {
        var t, a;
        t = {
            inNode: function () {
                return !!e.resolve
            },
            getQnxNamespace: function () {
                return t.inNode() ? null : qnx
            },
            base64Encode: function (e) {
                return window.btoa(window.unescape(window.encodeURIComponent(e)))
            },
            base64Decode: function (e) {
                return window.decodeURIComponent(window.escape(window.atob(e)))
            },
            copy: function (e) {
                var n, i = e ? e.isArray ? [] : {} : !1;
                if ("number" == typeof e || "string" == typeof e || "boolean" == typeof e || null === e || void 0 === e) return e;
                if (e instanceof Date) return new Date(e);
                if (e instanceof RegExp) return RegExp(e);
                for (n in e) e.hasOwnProperty(n) && (i[n] = e[n] && "object" == typeof e[n] ? e[n] instanceof Date ? e[n] : t.copy(e[n]) : e[n]);
                return i
            },
            parseURI: function (e) {
                var n, i = {},
                    t = ["source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                    a = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(e);
                for (n = t.length - 1; n >= 0; n--) i[t[n]] = a[n] || "";
                return i
            },
            isLocalURI: function (e) {
                return e && e.scheme && -1 !== "local:///".indexOf(e.scheme.toLowerCase())
            },
            isFileURI: function (e) {
                return e && e.scheme && -1 !== "file://".indexOf(e.scheme.toLowerCase())
            },
            isHttpURI: function (e) {
                return e && e.scheme && -1 !== "http://".indexOf(e.scheme.toLowerCase())
            },
            isHttpsURI: function (e) {
                return e && e.scheme && -1 !== "https://".indexOf(e.scheme.toLowerCase())
            },
            isDataURI: function (e) {
                return e && e.scheme && -1 !== "data:".indexOf(e.scheme.toLowerCase())
            },
            isTelURI: function (e) {
                return e && e.scheme && -1 !== "tel:".indexOf(e.scheme.toLowerCase())
            },
            isLocalUrl: function (e) {
                return e && -1 !== e.indexOf("local:///") ? !0 : !1
            },
            isDataUrl: function (e) {
                return e && "data:" === e.substring(0, 5) ? !0 : void 0
            },
            startsWith: function (e, n) {
                return 0 === e.indexOf(n)
            },
            fileNameToMIME: function (n) {
                var i = n.split(".").pop();
                return a || (a = e("./mimeTypes")), a.lookupByFileEnding(i)
            },
            fileEndingByMIME: function (n) {
                return a || (a = e("./mimeTypes")), a.fileEndingbyMIME(n)
            },
            series: function (e, n) {
                var i = function () {
                    var t, a = [];
                    e.length ? (t = e.shift(), a = a.concat(t.args).concat(i), t.func.apply(this, a)) : n.func.apply(this, n.args)
                };
                i()
            },
            language: function () {
                return navigator.language
            },
            i18n: function () {
                var e = {
                    translate: function (e) {
                        return {
                            fetch: function () {
                                return e
                            }
                        }
                    },
                    format: function (e) {
                        return {
                            fetch: function () {
                                return e
                            }
                        }
                    },
                    reset: function () {}
                };
                return wp.i18n ? wp.i18n : e
            },
            mixin: function (e, n) {
                return Object.getOwnPropertyNames(e).forEach(function (i) {
                    Object.hasOwnProperty.call(e, i) && Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(e, i))
                }), n
            },
            translatePath: function (e) {
                var n = wp.getApplication().getEnv("HOME");
                return t.isLocalUrl(e) && (e = "file:///" + n.replace(/^\/*/, "") + "/../app/native/" + e.replace(/local:\/\/\//, "")), e
            },
            downloadFile: function (e, n, i, a, o) {
                var l, s = e.replace(/^.*[\\\/]/, ""),
                    r = t.fileNameToMIME(s);
                r ? r.length > 1 && r.isArray && (r = r[0]) : r = "text/plain", "object" == typeof n && (n = n[0]), o !== void 0 && (r = o.mimeType ? o.mimeType : r, s = o.fileName ? o.fileName : s), window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem, e = t.translatePath(e), l = new XMLHttpRequest, l.open("GET", e, !0), l.responseType = "blob", l.onload = function () {
                    window.requestFileSystem(window.TEMPORARY, 1048576, function (e) {
                        e.root.getFile(n, {
                            create: !0
                        }, function (e) {
                            e.createWriter(function (e) {
                                e.onerror = function () {
                                    console.log("Could not properly write " + s)
                                };
                                var t = new Blob([l.response], {
                                    type: r
                                });
                                e.write(t), i && i("file:///" + n.replace(/^\/*/, ""))
                            }, a)
                        }, a)
                    }, a)
                }, l.send()
            }
        }, i.exports = t
    }), define("wp2/lib/cards/capture", ["require", "exports", "module", "../utils"], function (e, n, i) {
        var t = e("../utils");
        i.exports = {
            MODE_PHOTO: "photo",
            MODE_VIDEO: "video",
            MODE_FULL: "full",
            open: function (e, n, i, a) {
                var o = function (e) {
                    wp.core.invocation.un("childCardClosed", o), "save" === e.reason ? "function" == typeof n && n(e.data) : ("done" === e.reason || "close" === e.reason) && "function" == typeof i && i(e.reason)
                };
                wp.core.invocation.on("childCardClosed", o), wp.core.invocation.invoke({
                    action: "bb.action.CAPTURE",
                    target: "sys.camera.card",
                    data: t.base64Encode(e)
                }, function (e) {
                    a(e)
                })
            }
        }
    }), define("core/lib/pps/pps", ["require", "exports", "module", "../error"], function (e, n, i) {
        function t() {
            var e = o++;
            return window.isFinite(e) || (o = 0, e = 0), e
        }
        var a, o = 0,
            l = {};
        a = {
            PPSMode: {
                FULL: 0,
                DELTA: 1,
                SERVER: 2,
                RAW: 3
            },
            FileMode: {
                RDONLY: 0,
                WRONLY: 1,
                RDWR: 2,
                CREATE: 256
            },
            create: function (e, n) {
                function i() {
                    return l.hasOwnProperty(u)
                }

                function a() {
                    delete l[u]
                }

                function o(e, n) {
                    var i = JSON.parse(qnx.callExtensionMethod("pps.open", u, c, m, e, n));
                    return i.result ? (l[u] = this, d = i.data, !0) : !1
                }

                function s(e) {
                    return i() ? "true" === qnx.callExtensionMethod("pps.write", u, JSON.stringify(e)) : !1
                }

                function r() {
                    i() && qnx.callExtensionMethod("pps.close", u)
                }
                var d, p, u = t(),
                    c = e,
                    m = n;
                return p = {
                    open: o,
                    write: s,
                    close: r,
                    onFirstReadComplete: void 0,
                    onNewData: void 0,
                    onOpenFailed: function (e) {
                        console.log("PPS Connection - open failed: " + e)
                    },
                    onWriteFailed: function (e) {
                        console.log("PPS Connection - write failed: " + e)
                    },
                    onClosed: a
                }, p.__defineGetter__("mode", function () {
                    return n
                }), p.__defineGetter__("data", function () {
                    return d
                }), p.__defineGetter__("path", function () {
                    return c
                }), p
            },
            onEvent: function (e, n, i) {
                if (n && l.hasOwnProperty(e)) {
                    var t = l[e],
                        a = "on" + n;
                    t.hasOwnProperty(a) && t[a] && (("FirstReadComplete" === n || "NewData" === n) && (i = JSON.parse(i), t._data = i), t[a](i))
                }
            }
        }, e("../error").wrapAll(a, "pps."), i.exports = a
    }), define("core/lib/pps/jpps", ["require", "exports", "module"], function (e, n, i) {
        var t, a = "libjpps",
            o = a + ".PPS";
        t = {
            create: function () {
                var e = {
                    m_strObjId: null,
                    ppsObj: {}
                };
                return JNEXT.require(a) ? (e.m_strObjId = JNEXT.createObject(o), "" === e.m_strObjId ? (console.error('JNext could not create the native PPS object "' + o + '". PPS is unavailable.'), !1) : (e.open = function (n, i, t) {
                    var a = n + " " + i + (t ? " " + t : ""),
                        o = JNEXT.invoke(e.m_strObjId, "Open", a),
                        l = o.split(" ");
                    return "Ok" !== l[0] ? (console.error(o), !1) : !0
                }, e.read = function () {
                    var n, i = JNEXT.invoke(e.m_strObjId, "Read"),
                        t = i.split(" ");
                    return "Ok" !== t[0] ? (console.error(i), !1) : (n = i.substr(t[0].length + 1), e.ppsObj = JSON.parse(n), !0)
                }, e.write = function (n) {
                    var i = JSON.stringify(n),
                        t = JNEXT.invoke(e.m_strObjId, "Write", i),
                        a = t.split(" ");
                    return "Ok" !== a[0] ? (console.error(t), !1) : !0
                }, e.close = function () {
                    var n = JNEXT.invoke(e.m_strObjId, "Close");
                    n = JNEXT.invoke(e.m_strObjId, "Dispose"), JNEXT.unregisterEvents(e)
                }, e.getId = function () {
                    return e.m_strObjId
                }, e.onEvent = function (n) {
                    var i, t, a = n.split(" "),
                        o = a[0];
                    switch (o) {
                        case "Error":
                            e.onError();
                            break;
                        case "OnChange":
                            i = n.substr(o.length + 1), t = JSON.parse(i), e.ppsObj = t.allData, e.ppsData = {}, e.ppsData[t.changeData.objName] = t.allData, null !== e.onChange && e.onChange(t.changeData)
                    }
                }, e.onError = function () {
                    console.error("PPS onError() handler.")
                }, JNEXT.registerEvents(e), e)) : (console.error('Unable to load "' + a + '". PPS is unavailable.'), !1)
            }
        }, i.exports = t
    }), define("core/lib/pps/ppsUtils", ["require", "exports", "module", "./pps", "./jpps"], function (e, n, i) {
        var t, a = e("./pps"),
            o = e("./jpps");
        t = {
            PPSMode: {
                FULL: 0,
                DELTA: 1,
                SERVER: 2,
                RAW: 4,
                WAIT: 8
            },
            FileMode: {
                RDONLY: 0,
                WRONLY: 1,
                RDWR: 2,
                CREATE: 256
            },
            create: function (e, n) {
                var i, l;
                return n === a.PPSMode.FULL ? (i = a.create(e, n), i.onOpenFailed = function (e) {
                    i.onError(e)
                }, i.onWriteFailed = function (e) {
                    i.onError(e)
                }) : (l = function () {
                    function i(e, n) {
                        var i = e,
                            a = [];
                        return n !== t.PPSMode.FULL && ((n | t.PPSMode.DELTA) === n && a.push("delta"), a.length >= 1 && (i += "?" + a.join(","))), i
                    }
                    var a, l, s, r = e.split("/").pop().split("?").shift(),
                        d = i(e, n);
                    return a = o.create(), s = {
                        open: function (e, n) {
                            var i = a.open(d, e, n);
                            return i && a.read() && (l = {}, l[r] = a.ppsObj, this.onFirstReadComplete && "function" == typeof this.onFirstReadComplete && this.onFirstReadComplete(l)), i
                        },
                        write: function (e) {
                            return a.write(e)
                        },
                        close: function () {
                            a.close()
                        },
                        onFirstReadComplete: void 0,
                        onNewData: void 0,
                        onClosed: void 0
                    }, s.__defineGetter__("mode", function () {
                        return n
                    }), s.__defineGetter__("data", function () {
                        return a.ppsData || l
                    }), s.__defineGetter__("path", function () {
                        return d
                    }), a.onChange = function (e) {
                        s.onNewData && "function" == typeof s.onNewData && s.onNewData(e)
                    }, s
                }, i = l()), i
            },
            read: function (e, n) {
                n = n || {};
                var i, t, o = n.ppsMode || a.PPSMode.FULL,
                    l = n.fileMode || a.FileMode.RDONLY,
                    s = this.create(e, o);
                if (s ? s.open(l) ? (s.close(), t = s.data) : i = "Failed to open PPS object with path " + e + " and with mode " + l : i = "Failed to create a PPS object with path " + e + " and with mode " + o, i) throw i;
                return t
            },
            write: function (e, n, i) {
                i = i || {};
                var o, l = i.ppsMode || a.PPSMode.FULL,
                    s = i.fileMode || a.FileMode.RDWR,
                    r = i.encode ? i.encode : !1,
                    d = this.create(n, l);
                if (d ? d.open(s) ? (e = r ? t.encode(e) : e, d.write(e) || (o = "Failed to write data to PPS object with path " + n), d.close()) : o = "Failed to open PPS object with path " + n + " and with mode " + s : o = "Failed to create a PPS object with path " + n + " and with mode " + l, o) throw o
            },
            encode: function (e) {
                var n, i, t = "";
                for (n in e) t += n + ":", i = e[n], "string" == typeof i ? t += ":" + i : "number" == typeof i ? t += "n:" + i : "boolean" == typeof i ? t += "b:" + i : "object" == typeof i && (t += "json:" + JSON.stringify(i)), t += "\n";
                return t
            },
            onEvent: a.onEvent
        }, i.exports = t
    }), define("wp2/lib/cards/file", ["require", "exports", "module", "../../../core/lib/pps/ppsUtils", "../utils"], function (e, n, i) {
        var t = e("../../../core/lib/pps/ppsUtils"),
            a = e("../utils");
        i.exports = {
            MODE_PICKER: "Picker",
            MODE_SAVER: "Saver",
            MODE_PICKER_MULTIPLE: "PickerMultiple",
            MODE_SAVER_MULTIPLE: "SaverMultiple",
            VIEWER_MODE_LIST: "ListView",
            VIEWER_MODE_GRID: "GridView",
            SORT_BY_NAME: "Name",
            SORT_BY_DATE: "Date",
            SORT_BY_SUFFIX: "Suffix",
            SORT_BY_SIZE: "Size",
            SORT_ORDER_ASCENDING: "Ascending",
            SORT_ORDER_DESCENDING: "Descending",
            TYPE_PICTURE: "picture",
            TYPE_DOCUMENT: "document",
            TYPE_MUSIC: "music",
            TYPE_VIDEO: "video",
            TYPE_OTHER: "other",
            open: function (e, n, i, o) {
                var l, s, r = {
                    Mode: e.mode,
                    Title: e.title,
                    ViewMode: e.viewMode,
                    SortBy: e.sortBy,
                    SortOrder: e.sortOrder,
                    ImageCrop: e.imageCrop,
                    AllowOverwrite: e.allowOverwrite,
                    Type: e.type ? e.type.join(",") : [],
                    DefaultType: e.defaultType,
                    Filter: e.filter ? e.filter.join(";") : [],
                    Directory: e.directory ? e.directory.join(",") : [],
                    DefaultFileNames: e.defaultSaveFileNames ? e.defaultSaveFileNames.join(",") : []
                };
                s = function (e) {
                    if (wp.core.invocation.un("childCardClosed", s), "save" === e.reason) {
                        var t, a = e.data,
                            o = [];
                        "function" == typeof n && (e && e.data && e.data.match("^dat:json") && (a = e.data.slice(9)), a = JSON.parse(a), a.forEach(function (e) {
                            t = e.uri, t.match("^file:///") && (t = t.slice(7)), t.match("file:") && (t = ""), "" !== t && o.push(t)
                        }), n(o))
                    } else "cancel" === e.reason && "function" == typeof i && i(e.reason)
                }, wp.core.invocation.on("childCardClosed", s), l = t.encode(r), wp.core.invocation.invoke({
                    action: "bb.action.OPEN",
                    target: "sys.filepicker.target",
                    data: a.base64Encode(l)
                }, function (e) {
                    o(e)
                })
            }
        }
    }), define("wp2/lib/defaultHandlers/onChooseFile", ["require", "exports", "module", "./../cards/capture", "./../utils", "./../cards/file", "./../utils"], function (e, n, i) {
        i.exports = {
            handle: function (n) {
                return function (i, t) {
                    var a, o, l, s, r, d, p, u = [],
                        c = [],
                        m = JSON.parse(t);
                    i.returnValue = JSON.stringify({
                        setWait: !0
                    }), "camera" === m.capture || "camcorder" === m.capture ? (a = e("./../cards/capture"), s = "camera" === m.capture ? a.MODE_PHOTO : a.MODE_VIDEO, a.open(s, function (e) {
                        n.chooseFileResponse(m.waitHandle, encodeURIComponent(e))
                    }, function () {
                        n.chooseFileResponse(m.waitHandle)
                    }, function (i) {
                        i && (wp.ui.toast.show(e("./../utils").i18n().translate("Unable to open the camera.").fetch(), {
                            translate: !0
                        }), n.chooseFileResponse(m.waitHandle))
                    })) : (o = e("./../cards/file"), m.acceptMIMETypes && m.acceptMIMETypes.forEach(function (e) {
                        "image/*" === e && -1 === u.indexOf(o.TYPE_PICTURE) ? u.push(o.TYPE_PICTURE) : "video/*" === e && -1 === u.indexOf(o.TYPE_VIDEO) ? u.push(o.TYPE_VIDEO) : "audio/*" === e && -1 === u.indexOf(o.TYPE_MUSIC) && u.push(o.TYPE_MUSIC), r = e.split("/"), 2 === r.length && "*" !== r[1] && (d = r[0], p = r[1], "image" === d && -1 === u.indexOf(o.TYPE_PICTURE) ? u.push(o.TYPE_PICTURE) : "video" === d && -1 === u.indexOf(o.TYPE_VIDEO) ? u.push(o.TYPE_VIDEO) : "audio" === d && -1 === u.indexOf(o.TYPE_MUSIC) && u.push(o.TYPE_MUSIC), 1 === m.acceptMIMETypes.length && c.push("*." + p))
                    }), l = {
                        mode: o.MODE_PICKER,
                        type: u,
                        filter: c
                    }, o.open(l, function (e) {
                        n.chooseFileResponse(m.waitHandle, encodeURIComponent(e[0]))
                    }, function () {
                        n.chooseFileResponse(m.waitHandle)
                    }, function (i) {
                        i && (n.chooseFileResponse(m.waitHandle), n && n.uiWebView && wp.ui.toast.show(e("./../utils").i18n().translate("Unable to select a file.").fetch(), {
                            translate: !0
                        }))
                    }))
                }
            }
        }
    }), define("wp2/lib/menuService", ["require", "exports", "module", "./../../core/lib/pps/pps"], function (e, n, i) {
        function t() {
            var e = p++;
            return window.isFinite(e) || (p = 0, e = 0), "" + e
        }

        function a() {
            for (var e in d) d[e](null, l.MENU_SERVICE_FAILURE_ERROR);
            d = {}
        }

        function o(e) {
            var n, i, t, o = e.control;
            o.hasOwnProperty("res") && "getMenuItems" === o.res ? (n = o.dat ? o.dat["inherited-target"] : void 0, i = o.id, t = d[i], delete d[i], t && t(n, o.dat, o.err)) : a()
        }
        var l, s, r = e("./../../core/lib/pps/pps"),
            d = {},
            p = 0;
        l = {
            MENU_SERVICE_FAILURE_ERROR: "MENU_SERVICE_FAILURE_ERROR",
            getMenuItems: function (e, n) {
                var i;
                s || (s = r.create("/pps/services/menu/control", r.PPSMode.FULL), s.onNewData = o, s.onFirstReadComplete = function () {
                    console.log("menu.service: First read complete")
                }, s.onReadFailed = a, s.onClosed = a, s.onOpenFailed = a, s.onWriteFailed = a, s.open(r.FileMode.RDWR)), i = t(), n && (d[i] = n), e["supports-inherited"] = !0, s.write({
                    msg: "getMenuItems",
                    id: i,
                    dat: e
                })
            }
        }, i.exports = l
    }), define("core/plugins/contextmenu/actions", ["require", "exports", "module", "./../../../wp2/lib/utils"], function (e, n, i) {
        function t(e) {
            T = e
        }

        function a(e) {
            var n = e[0];
            qnx.callExtensionMethod("webview.handleContextMenuResponse", C, n)
        }

        function o(e) {
            var n = e[0];
            qnx.callExtensionMethod("webview.loadURL", C, n)
        }

        function l() {
            if (T && T.url) {
                var e = T.url,
                    n = e.substring(e.lastIndexOf("/") + 1),
                    i = {
                        mode: k.cards.filePicker.MODE_SAVER,
                        allowOverwrite: !0
                    },
                    t = {
                        translate: !0
                    };
                0 !== n.length && (i.defaultSaveFileNames = [n]), k.cards.filePicker.open(i, function (n) {
                    n && z.downloadFile(e, n, function () {
                        S.toast.show(x.translate("File successfully saved.").fetch(), t)
                    }, function () {
                        S.toast.show(x.translate("File could not be saved.").fetch(), t)
                    })
                }, null, function (e) {
                    e ? S.toast.show(x.translate("Unable to select a file.").fetch(), t) : console.log("invoke success")
                })
            }
        }

        function s() {
            T && T.url && o([T.url])
        }

        function r(e, n) {
            var i, t = "image/png",
                a = "image";
            return -1 !== e.indexOf(";") ? t = e.substring(5, e.indexOf(";")) : -1 !== e.indexOf(",") && (t = e.substring(5, e.indexOf(","))), i = z.fileEndingByMIME(t), i = i ? i[0] : i, (n ? n : "") + a + "." + i
        }

        function d() {
            if (T && T.isImage && T.src) {
                var e, n = T.src,
                    i = {
                        mode: k.cards.filePicker.MODE_SAVER,
                        allowOverwrite: !0,
                        defaultType: k.cards.filePicker.TYPE_PICTURE,
                        defaultSaveFileNames: [n.substring(n.lastIndexOf("/") + 1)]
                    },
                    t = {
                        translate: !0
                    };
                z.isDataUrl(n) && (i.defaultSaveFileNames = [r(n)]), k.cards.filePicker.open(i, function (e) {
                    e && z.downloadFile(n, e, function () {
                        S.toast.show(x.translate("File successfully saved.").fetch(), t)
                    }, function () {
                        S.toast.show(x.translate("File could not be saved.").fetch(), t)
                    })
                }, null, function (n) {
                    n ? (e = {
                        dialogType: "JavaScriptAlert",
                        title: "File Picker Error",
                        message: "Could not open file picker."
                    }, S.rpc.postMessage("dialog.show", e)) : console.log("invoke success")
                })
            }
        }

        function p() {
            if (T && T.isImage && T.src) {
                var e = T.src,
                    n = "/" + k.getEnv("HOME").replace(/^\/*/, "") + "/../tmp/",
                    i = n + e.replace(/^.*[\\\/]/, ""),
                    t = {
                        action: "bb.action.VIEW",
                        uri: ""
                    };
                z.isDataUrl(e) && (i = r(e, n)), z.isLocalUrl(e) ? (t.uri = e, M.invoke(t, function (e) {
                    e && console.log(e)
                })) : z.downloadFile(e, i, function (e) {
                    t.uri = e, M.invoke(t, function (e) {
                        e && console.log(e)
                    })
                }, function (e) {
                    console.log(e)
                })
            }
        }

        function u(e) {
            e && a([e])
        }

        function c(e, n) {
            return e ? (_[e] = n, !0) : !1
        }

        function m(e) {
            _[e] && delete _[e]
        }

        function h() {
            P = {}
        }

        function v() {
            _ = {}
        }

        function f(e) {
            e.actionId && (P[e.actionId] = e)
        }

        function y(e) {
            var n = {};
            wp.ui && wp.ui.invocationlist && e.invoke && (n = e.invoke, n.target || (n.target = "sys.invokeTargetSelection"), M.invoke(n))
        }

        function g(e, n) {
            _[e] ? _[e](e, n) : A[e] ? A[e](e) : -1 !== e.indexOf("MenuService-") && P[e] && y(P[e])
        }

        function w(e) {
            S = e, k = wp.getApplication(), M = wp.core.invocation, x = z.i18n()
        }

        function b(e) {
            C = e
        }
        var x, T, M, k, S, C, E, I, z = e("./../../../wp2/lib/utils"),
            A = {},
            _ = {},
            P = {};
        A = {
            Cancel: u,
            ClearField: u,
            Cut: u,
            Copy: u,
            Paste: u,
            Select: u,
            SelectAll: u,
            CopyLink: u,
            OpenLink: s,
            SaveLinkAs: l,
            CopyImageLink: u,
            SaveImage: d,
            ViewImage: p,
            InspectElement: u
        }, I = {
            init: w,
            setClientWebView: b,
            handlers: A,
            addMenuServiceItem: f,
            clearMenuServiceItems: h,
            runHandler: g,
            clearCustomHandlers: v,
            setCurrentContext: t,
            addCustomItem: c,
            removeCustomItem: m
        }, I.__defineSetter__("invocationResults", function (e) {
            E = e
        }), i.exports = I
    }), define("core/plugins/contextmenu/api", ["require", "exports", "module", "./../../../wp2/lib/menuService", "./../../../wp2/lib/utils", "./actions"], function (e, n, i) {
        function t(e) {
            if (!e.webWorksContext) return {
                type: e.webWorksContext
            };
            try {
                return JSON.parse(e.webWorksContext)
            } catch (n) {
                return console.log("Not a valid WebWorks JSON context. Treating context as a string."), {
                    type: e.webWorksContext
                }
            }
        }

        function a(e, n) {
            var i, a = [],
                o = !1,
                l = [],
                s = function (e, n) {
                    a.push(e), n()
                };
            for (i = 0; e.length > i; i++) switch (e[i]) {
                case "ClearField":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Clear Field").fetch(),
                            actionId: "ClearField",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "SendLink":
                    break;
                case "SendImageLink":
                    break;
                case "FullMenu":
                    break;
                case "Delete":
                    break;
                case "Cancel":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Dismiss Selection").fetch(),
                            actionId: "Cancel",
                            icon: "platform:///ui/assets/contextmenu.png",
                            isPinned: !0
                        }]
                    }), o = !0;
                    break;
                case "Cut":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Cut").fetch(),
                            actionId: "Cut",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "Copy":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Copy").fetch(),
                            actionId: "Copy",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "Paste":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Paste").fetch(),
                            actionId: "Paste",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "SelectAll":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Select All").fetch(),
                            actionId: "SelectAll",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "Select":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Select").fetch(),
                            actionId: "Select",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "AddLinkToBookmarks":
                    break;
                case "CopyLink":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Copy Link").fetch(),
                            actionId: "CopyLink",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "OpenLinkInNewTab":
                    break;
                case "OpenLink":
                    break;
                case "SaveLinkAs":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Save Link As").fetch(),
                            actionId: "SaveLinkAs",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "SaveImage":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Save Image").fetch(),
                            actionId: "SaveImage",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "CopyImageLink":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Copy Image Link").fetch(),
                            actionId: "CopyImageLink",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "ViewImage":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("View Image").fetch(),
                            actionId: "ViewImage",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    });
                    break;
                case "Search":
                    break;
                case "ShareLink":
                    break;
                case "ShareImage":
                    break;
                case "InspectElement":
                    l.push({
                        func: s,
                        args: [{
                            label: D.translate("Inspect Element").fetch(),
                            actionId: "InspectElement",
                            icon: "platform:///ui/assets/contextmenu.png"
                        }]
                    })
            }
            o || l.push({
                func: s,
                args: [{
                    label: D.translate("Cancel").fetch(),
                    actionId: "Cancel",
                    icon: "platform:///ui/assets/contextmenu.png",
                    isPinned: !0
                }]
            }), L = void 0, R = void 0, _ && (_.isWebWorksContext && (P = t(_)), P && (P.header || P.subheader) ? (L = P.header, R = P.subheader, P = void 0) : _.url ? (L = _.text, R = _.url) : _.text ? R = _.text : _.alt ? R = _.alt : _.src && (R = _.src), L = L || "Selection"), N.series(l, {
                func: n,
                args: [a]
            })
        }

        function o(e, n, i) {
            var t, a, o = i.contexts,
                l = i.action,
                s = i.handler;
            if (!l.actionId && "" === l.actionId || "function" != typeof s) return n("You must provide a valid actionId");
            j.addCustomItem(l.actionId, s);
            for (t in o) o.hasOwnProperty(t) && (a = o[t], F[a] || (F[a] = {}), F[a][l.actionId] = l);
            e()
        }

        function l(e) {
            var n;
            for (n in F) F[n][e] && delete F[n][e]
        }

        function s(e, n, i) {
            var t, a, o = i.contexts,
                s = i.actionId;
            for (t in o) {
                if (a = o[t], a === K) {
                    l(s);
                    break
                }
                F[a] && delete F[a][s]
            }
            j.removeCustomItem(s), e()
        }

        function r(e, n) {
            e && n && (W[e] = n)
        }

        function d(e) {
            return e && e.text
        }

        function p(e) {
            return e && e.isImage
        }

        function u(e) {
            return e && e.isWebWorksContext
        }

        function c(e) {
            return e.url && !e.isImage ? G : e.url && e.isImage ? H : e.isImage ? Y : e.isInput ? Z : e.text ? Q : void 0
        }

        function m(e, n) {
            var i;
            return V[e] = V[e] || [], i = -1 === V[e].indexOf(n) ? V[e].push(n) : null, !!i
        }

        function h(e, n) {
            var i;
            return V[e] && (i = V[e].indexOf(n), -1 !== i) ? (V[e].splice(i, 1), !0) : !1
        }

        function v() {
            return V
        }

        function f(e, n) {
            var i = c(n),
                t = V[i] || [];
            return t = t.concat(V[K] || []), t.length > 0 && (e = e.filter(function (e) {
                return -1 !== t.indexOf(e.actionId) ? !1 : /^MenuService/.test(e.actionId) && -1 !== t.indexOf("MenuService") ? !1 : !0
            })), e
        }

        function y(e) {
            var n, i = t(_),
                a = {
                    headText: L,
                    subheadText: R
                },
                o = function (e) {
                    return e.some(function (e) {
                        return e && e.actionId && "Cancel" !== e.actionId
                    })
                };
            W[i.type] && (n = W[i.type].pinnedItemId), e && Array.isArray(e) && o(e) && (B = !0, wp.ui.default.showRenderingWebView(), A.rpc.postMessage("contextmenu.activate", {
                menuItems: e,
                _currentContext: _,
                header: a,
                pinnedItemId: n
            }))
        }

        function g(e, n, i) {
            var t = {},
                a = "tel:";
            p(n) ? t.uri = N.translatePath(n.src) : d(n) && (n.url ? (t.uri = N.translatePath(n.url), t.uri = n.url.replace(/ /g, "%20"), 0 === n.url.indexOf(a) && (t.metadata = JSON.stringify({
                subject: n.url.replace("tel:", "")
            }))) : (t.mime = "text/plain", t.data = N.base64Encode(n.text))), O.getMenuItems(t, function (a, o, l) {
                var s, r, d, p, u;
                if (l) console.log(l);
                else
                    for (s = o && o.hasOwnProperty("items") ? o.items : [], u = 0; s.length > u; u++) N.isLocalURI(N.parseURI(n.url)) || (r = {
                        label: s[u].label,
                        actionId: "MenuService-" + u,
                        icon: "file://" + s[u].icon
                    }, d = a ? N.copy(a) : {}, s[u].action && (d.action = s[u].action), s[u].children ? (r.children = s[u].children, r["inherited-target"] = d) : (r.invoke = N.mixin(d, s[u].invoke), r.invoke.type = r.invoke.mime, r.invoke.uri || (r.invoke.uri = N.translatePath(t.uri))), j.addMenuServiceItem(r), p = e.slice(-2), p && p[0].isPinned ? e.splice(-2, 0, r) : p && p[1].isPinned && e.splice(-1, 0, r));
                i(e)
            })
        }

        function w(e, n) {
            return U[e.actionId] = e, e.actionId && "" !== e.actionId && "function" == typeof n ? (j.addCustomItem(e.actionId, n), !0) : !1
        }

        function b(e) {
            return e && U[e] ? (j.removeCustomItem(e), delete U[e], !0) : !1
        }

        function x(e) {
            var n, i;
            for (n = 0; e.length > n; n++) i = e[n].actionId, U[i] && (e[n].label = U[i].label ? U[i].label : e[n].label, e[n].icon = U[i].icon ? U[i].icon : e[n].icon)
        }

        function T(e, n) {
            var i, t = F[n];
            if (t)
                for (i in t) t.hasOwnProperty(i) && e.unshift(t[i])
        }

        function M(e, n) {
            var i = t(_),
                a = function (e, t) {
                    if (u(n)) {
                        if (W[i.type]) {
                            var a = W[i.type].includeContextItems;
                            a && -1 !== a.indexOf(t) && T(e, t)
                        }
                    } else T(e, t)
                };
            T(e, K), u(n) && T(e, i.type), n && a(e, c(n))
        }

        function k() {
            F = {}, j.clearCustomHandlers(), V = {}
        }

        function S(e) {
            e = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e, j.setClientWebView(e.id), e.on("PropertyCurrentContextEvent", X.PropertyCurrentContextEvent = function (e, n) {
                _ = JSON.parse(n), j.setCurrentContext(_)
            }), e.on("ContextMenuCancelEvent", X.ContextMenuCancelEvent = function () {
                J && (A.rpc.postMessage("contextmenu.hide"), e.isContextmenuVisible = !1)
            }), e.on("ContextMenuRequestEvent", X.ContextMenuRequestEvent = function (n, i) {
                var o = JSON.parse(i),
                    l = t(_),
                    s = !u(_) || W[l.type] && W[l.type].includePlatformItems,
                    r = function (n) {
                        n = f(n, _), M(n, _), x(n), y(n), e.isContextmenuVisible = B
                    };
                j.invocationResults = [], J && !B && (s || (o.menuItems = []), a(o.menuItems, function (e) {
                    J && (!u(_) || W[l.type] && W[l.type].includeMenuServiceItems ? g(e, _, r) : r(e))
                })), n.returnValue = '{"setPreventDefault":true}'
            }), e.on("LocationChange", X.LocationChange = function () {
                k()
            }), e.on("TouchHoldReleased", X.TouchHoldReleased = function () {
                J && B && (A.rpc.postMessage("contextmenu.show"), e.isContextmenuVisible = !0, qnx.callExtensionMethod("application.setKeyboardFocus", A.jsScreenWindowHandle))
            }), A.rpc.on("webview.notifyContextMenuCancelled", X.notifyContextMenuCancelled = function () {
                e && (B = !1, e.isContextmenuVisible = !1, wp.core.events.emit("contextmenu.hidden"), e.notifyContextMenuCancelled(), wp.ui.default.hideRenderingWebView(), qnx.callExtensionMethod("application.setKeyboardFocus", e.jsScreenWindowHandle))
            })
        }

        function C(e) {
            e = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e, e.un("PropertyCurrentContextEvent", X.PropertyCurrentContextEvent), e.un("ContextMenuCancelEvent", X.ContextMenuCancelEvent), e.un("ContextMenuRequestEvent", X.ContextMenuRequestEvent), e.un("LocationChange", X.LocationChange), e.un("TouchHoldReleased", X.TouchHoldReleased), A.rpc.un("webview.notifyContextMenuCancelled", X.notifyContextMenuCancelled)
        }

        function E(e) {
            A = e, j.init(e), z = window.wp.getController(), $ = window.wp.getApplication(), q = $.invocation, D = N.i18n(), A.rpc.un("contextmenu.sensitivity", X.sensitivity), A.rpc.un("contextmenu.executeMenuAction", X.executeMenuAction), A.rpc.on("contextmenu.sensitivity", X.sensitivity = function (e, n) {
                A.sensitivity = n
            }), A.rpc.on("contextmenu.executeMenuAction", X.executeMenuAction = function (e, n) {
                var i = t(_);
                i = i.id, n && j.runHandler(n, i)
            }), e.spatialNavigation = !0, e.pointerInteractionMode = !1, B = !1
        }
        var I, z, A, _, P, q, $, D, L, R, O = e("./../../../wp2/lib/menuService"),
            N = e("./../../../wp2/lib/utils"),
            j = e("./actions"),
            F = {},
            U = {},
            V = {},
            J = !0,
            B = !1,
            W = {},
            K = "ALL",
            G = "LINK",
            H = "IMAGE_LINK",
            Y = "IMAGE",
            Q = "TEXT",
            Z = "INPUT",
            X = {};
        I = {
            renderOn: E,
            addItem: o,
            removeItem: s,
            overrideItem: w,
            clearOverride: b,
            disablePlatformItem: m,
            enablePlatformItem: h,
            listDisabledPlatformItems: v,
            defineCustomContext: r,
            activateContextMenu: y,
            subscribeTo: S,
            unsubscribeTo: C
        }, I.__defineGetter__("enabled", function () {
            return J
        }), I.__defineSetter__("enabled", function (e) {
            J = e
        }), i.exports = I
    }), define("wp2/lib/defaultHandlers/onOpenWindow", ["require", "exports", "module", "./../../../core/plugins/contextmenu/api"], function (e, n, i) {
        function t(e, n, i) {
            l = window.wp.createWebView({
                processId: n
            }, function () {
                l.backgroundColor = 16777215, l.devicePixelRatio = 1, l.zOrder = i, l.active = !0, l.setGeometry(0, 0, window.innerWidth, window.innerHeight), e.setPopupWebView(l.id), l.visible = !0
            }), l.on("Destroyed", function () {
                qnx.callExtensionMethod("webview.delete", l.id), l = void 0
            }), l.on("ProcessCrash", function () {
                l = void 0
            })
        }

        function a() {
            l && qnx.callExtensionMethod("webview.destroy", l.id)
        }

        function o(n) {
            r = !0, s = e("./../../../core/plugins/contextmenu/api"), n.on("CloseWindow", function () {
                l && (l.visible = !1, a()), s && (s.enabled = !0)
            })
        }
        var l, s, r, d = "ChildWindowOpen";
        i.exports = {
            handle: function (e) {
                return function (n, i) {
                    var a = JSON.parse(i),
                        p = e.processId ? e.processId : 0,
                        u = parseInt(e.zOrder, 10) + 5;
                    r || o(e), "CREATE" === a.action && a.isPopup ? (s && (s.enabled = !1), l ? (e.setPopupWebView(l.id), l.visible = !0) : t(e, p, u), n.returnValue = JSON.stringify({
                        setAction: "DISCARD"
                    })) : e.emit(d, [i], n)
                }
            }
        }
    }), define("dependencies/URI.js/src/URI", ["require", "exports", "module"], function (e, n, i) {
        (function (n) {
            function t(e) {
                return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
            }

            function a(e) {
                return "[object Array]" == Object.prototype.toString.call(e) + ""
            }

            function o(e, i) {
                var t, o, l = {};
                if (a(i))
                    for (t = 0, o = i.length; o > t; t++) l[i[t]] = !0;
                else l[i] = !0;
                for (t = 0, o = e.length; o > t; t++) l[e[t]] !== n && (e.splice(t, 1), o--, t--);
                return e
            }
            var l = i !== n && i.exports,
                s = function (n) {
                    return l ? e("./" + n) : window[n]
                },
                r = s("punycode"),
                d = s("IPv6"),
                p = s("SecondLevelDomains"),
                u = function (e, i) {
                    return this instanceof u ? (e === n && (e = location.href + ""), this.href(e), i !== n ? this.absoluteTo(i) : this) : new u(e)
                },
                c = u.prototype;
            u.idn_expression = /[^a-z0-9\.-]/i, u.punycode_expression = /(xn--)/i, u.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, u.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/, u.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi, u.defaultPorts = {
                http: "80",
                https: "443",
                ftp: "21"
            }, u.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/, u.encode = encodeURIComponent, u.decode = decodeURIComponent, u.iso8859 = function () {
                u.encode = escape, u.decode = unescape
            }, u.unicode = function () {
                u.encode = encodeURIComponent, u.decode = decodeURIComponent
            }, u.characters = {
                pathname: {
                    encode: {
                        expression: /%(24|26|2B|2C|3B|3D|3A|40)/gi,
                        map: {
                            "%24": "$",
                            "%26": "&",
                            "%2B": "+",
                            "%2C": ",",
                            "%3B": ";",
                            "%3D": "=",
                            "%3A": ":",
                            "%40": "@"
                        }
                    },
                    decode: {
                        expression: /[\/\?#]/g,
                        map: {
                            "/": "%2F",
                            "?": "%3F",
                            "#": "%23"
                        }
                    }
                }
            }, u.encodeQuery = function (e) {
                return u.encode(e + "").replace(/%20/g, "+")
            }, u.decodeQuery = function (e) {
                return u.decode((e + "").replace(/\+/g, "%20"))
            }, u.recodePath = function (e) {
                for (var n = (e + "").split("/"), i = 0, t = n.length; t > i; i++) n[i] = u.encodePathSegment(u.decode(n[i]));
                return n.join("/")
            }, u.decodePath = function (e) {
                for (var n = (e + "").split("/"), i = 0, t = n.length; t > i; i++) n[i] = u.decodePathSegment(n[i]);
                return n.join("/")
            };
            var m, h = {
                    encode: "encode",
                    decode: "decode"
                },
                v = function (e) {
                    return function (n) {
                        return u[e](n + "").replace(u.characters.pathname[e].expression, function (n) {
                            return u.characters.pathname[e].map[n]
                        })
                    }
                };
            for (m in h) u[m + "PathSegment"] = v(h[m]);
            u.parse = function (e) {
                var n, i = {};
                return n = e.indexOf("#"), n > -1 && (i.fragment = e.substring(n + 1) || null, e = e.substring(0, n)), n = e.indexOf("?"), n > -1 && (i.query = e.substring(n + 1) || null, e = e.substring(0, n)), "//" === e.substring(0, 2) ? (i.protocol = "", e = e.substring(2), e = u.parseAuthority(e, i)) : (n = e.indexOf(":"), n > -1 && (i.protocol = e.substring(0, n), "//" === e.substring(n + 1, n + 3) ? (e = e.substring(n + 3), e = u.parseAuthority(e, i)) : (e = e.substring(n + 1), i.urn = !0))), i.path = e, i
            }, u.parseHost = function (e, n) {
                var i, t = e.indexOf("/");
                if (-1 === t && (t = e.length), "[" === e[0]) {
                    var a = e.indexOf("]");
                    n.hostname = e.substring(1, a) || null, n.port = e.substring(a + 2, t) || null
                } else e.indexOf(":") !== e.lastIndexOf(":") ? (n.hostname = e.substring(0, t) || null, n.port = null) : (i = e.substring(0, t).split(":"), n.hostname = i[0] || null, n.port = i[1] || null);
                return n.hostname && "/" !== e.substring(t)[0] && (t++, e = "/" + e), e.substring(t) || "/"
            }, u.parseAuthority = function (e, n) {
                return e = u.parseUserinfo(e, n), u.parseHost(e, n)
            }, u.parseUserinfo = function (e, n) {
                var i, t = e.indexOf("@"),
                    a = e.indexOf("/");
                return t > -1 && (-1 === a || a > t) ? (i = e.substring(0, t).split(":"), n.username = i[0] ? u.decode(i[0]) : null, n.password = i[1] ? u.decode(i[1]) : null, e = e.substring(t + 1)) : (n.username = null, n.password = null), e
            }, u.parseQuery = function (e) {
                if (!e) return {};
                if (e = e.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""), !e) return {};
                for (var n = {}, i = e.split("&"), t = i.length, a = 0; t > a; a++) {
                    var o = i[a].split("="),
                        l = u.decodeQuery(o.shift()),
                        s = o.length ? u.decodeQuery(o.join("=")) : null;
                    n[l] ? ("string" == typeof n[l] && (n[l] = [n[l]]), n[l].push(s)) : n[l] = s
                }
                return n
            }, u.build = function (e) {
                var n = "";
                return e.protocol && (n += e.protocol + ":"), e.urn || !n && !e.hostname || (n += "//"), n += u.buildAuthority(e) || "", "string" == typeof e.path && ("/" !== e.path[0] && "string" == typeof e.hostname && (n += "/"), n += e.path), "string" == typeof e.query && (n += "?" + e.query), "string" == typeof e.fragment && (n += "#" + e.fragment), n
            }, u.buildHost = function (e) {
                var n = "";
                return e.hostname ? (u.ip6_expression.test(e.hostname) ? n += e.port ? "[" + e.hostname + "]:" + e.port : e.hostname : (n += e.hostname, e.port && (n += ":" + e.port)), n) : ""
            }, u.buildAuthority = function (e) {
                return u.buildUserinfo(e) + u.buildHost(e)
            }, u.buildUserinfo = function (e) {
                var n = "";
                return e.username && (n += u.encode(e.username), e.password && (n += ":" + u.encode(e.password)), n += "@"), n
            }, u.buildQuery = function (e, i) {
                var t = "";
                for (var o in e)
                    if (Object.hasOwnProperty.call(e, o) && o)
                        if (a(e[o]))
                            for (var l = {}, s = 0, r = e[o].length; r > s; s++) e[o][s] !== n && l[e[o][s] + ""] === n && (t += "&" + u.buildQueryParameter(o, e[o][s]), i !== !0 && (l[e[o][s] + ""] = !0));
                        else e[o] !== n && (t += "&" + u.buildQueryParameter(o, e[o]));
                return t.substring(1)
            }, u.buildQueryParameter = function (e, n) {
                return u.encodeQuery(e) + (null !== n ? "=" + u.encodeQuery(n) : "")
            }, u.addQuery = function (e, i, t) {
                if ("object" == typeof i)
                    for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && u.addQuery(e, o, i[o]);
                else {
                    if ("string" != typeof i) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
                    if (e[i] === n) return e[i] = t, n;
                    "string" == typeof e[i] && (e[i] = [e[i]]), a(t) || (t = [t]), e[i] = e[i].concat(t)
                }
            }, u.removeQuery = function (e, i, t) {
                if (a(i))
                    for (var l = 0, s = i.length; s > l; l++) e[i[l]] = n;
                else if ("object" == typeof i)
                    for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && u.removeQuery(e, r, i[r]);
                else {
                    if ("string" != typeof i) throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
                    t !== n ? e[i] === t ? e[i] = n : a(e[i]) && (e[i] = o(e[i], t)) : e[i] = n
                }
            }, u.commonPath = function (e, n) {
                var i, t = Math.min(e.length, n.length);
                for (i = 0; t > i; i++)
                    if (e[i] !== n[i]) {
                        i--;
                        break
                    } return 1 > i ? e[0] === n[0] && "/" === e[0] ? "/" : "" : ("/" !== e[i] && (i = e.substring(0, i).lastIndexOf("/")), e.substring(0, i + 1))
            }, u.withinString = function (e, n) {
                return e.replace(u.find_uri_expression, n)
            }, u.ensureValidHostname = function (e) {
                if (e.match(u.invalid_hostname_characters)) {
                    if (!r) throw new TypeError("Hostname '" + e + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
                    if (r.toASCII(e).match(u.invalid_hostname_characters)) throw new TypeError("Hostname '" + e + "' contains characters other than [A-Z0-9.-]")
                }
            }, c.build = function (e) {
                return e === !0 ? this._deferred_build = !0 : (e === n || this._deferred_build) && (this._string = u.build(this._parts), this._deferred_build = !1), this
            }, c.valueOf = c.toString = function () {
                return this.build(!1)._string
            }, h = {
                protocol: "protocol",
                username: "username",
                password: "password",
                hostname: "hostname",
                port: "port"
            }, v = function (e) {
                return function (i, t) {
                    return i === n ? this._parts[e] || "" : (this._parts[e] = i, this.build(!t), this)
                }
            };
            for (m in h) c[m] = v(h[m]);
            h = {
                query: "?",
                fragment: "#"
            }, v = function (e, i) {
                return function (t, a) {
                    return t === n ? this._parts[e] || "" : (null !== t && (t += "", t[0] === i && (t = t.substring(1))), this._parts[e] = t, this.build(!a), this)
                }
            };
            for (m in h) c[m] = v(m, h[m]);
            h = {
                search: ["?", "query"],
                hash: ["#", "fragment"]
            }, v = function (e, n) {
                return function (i, t) {
                    var a = this[e](i, t);
                    return "string" == typeof a && a.length ? n + a : a
                }
            };
            for (m in h) c[m] = v(h[m][1], h[m][0]);
            c.pathname = function (e, i) {
                if (e === n || e === !0) {
                    var t = this._parts.path || (this._parts.urn ? "" : "/");
                    return e ? u.decodePath(t) : t
                }
                return this._parts.path = e ? u.recodePath(e) : "/", this.build(!i), this
            }, c.path = c.pathname, c.href = function (e, i) {
                if (e === n) return "" + this;
                this._string = "", this._parts = {
                    protocol: null,
                    username: null,
                    password: null,
                    hostname: null,
                    urn: null,
                    port: null,
                    path: null,
                    query: null,
                    fragment: null
                };
                var t, a = e instanceof u,
                    o = "object" == typeof e && (e.hostname || e.path);
                if ("string" == typeof e) this._parts = u.parse(e);
                else {
                    if (!a && !o) throw new TypeError("invalid input");
                    var l = a ? e._parts : e;
                    for (t in l) Object.hasOwnProperty.call(this._parts, t) && (this._parts[t] = l[t])
                }
                return this.build(!i), this
            }, c.is = function (e) {
                var n = !1,
                    i = !1,
                    t = !1,
                    a = !1,
                    o = !1,
                    l = !1,
                    s = !1,
                    r = !this._parts.urn;
                switch (this._parts.hostname && (r = !1, i = u.ip4_expression.test(this._parts.hostname), t = u.ip6_expression.test(this._parts.hostname), n = i || t, a = !n, o = a && p && p.has(this._parts.hostname), l = a && u.idn_expression.test(this._parts.hostname), s = a && u.punycode_expression.test(this._parts.hostname)), e.toLowerCase()) {
                    case "relative":
                        return r;
                    case "absolute":
                        return !r;
                    case "domain":
                    case "name":
                        return a;
                    case "sld":
                        return o;
                    case "ip":
                        return n;
                    case "ip4":
                    case "ipv4":
                    case "inet4":
                        return i;
                    case "ip6":
                    case "ipv6":
                    case "inet6":
                        return t;
                    case "idn":
                        return l;
                    case "url":
                        return !this._parts.urn;
                    case "urn":
                        return !!this._parts.urn;
                    case "punycode":
                        return s
                }
                return null
            };
            var f = c.protocol,
                y = c.port,
                g = c.hostname;
            c.protocol = function (e, i) {
                if (e !== n && e && (e = e.replace(/:(\/\/)?$/, ""), e.match(/[^a-zA-z0-9\.+-]/))) throw new TypeError("Protocol '" + e + "' contains characters other than [A-Z0-9.+-]");
                return f.call(this, e, i)
            }, c.scheme = c.protocol, c.port = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e !== n && (0 === e && (e = null), e && (e += "", ":" === e[0] && (e = e.substring(1)), e.match(/[^0-9]/)))) throw new TypeError("Port '" + e + "' contains characters other than [0-9]");
                return y.call(this, e, i)
            }, c.hostname = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e !== n) {
                    var t = {};
                    u.parseHost(e, t), e = t.hostname
                }
                return g.call(this, e, i)
            }, c.host = function (e, i) {
                return this._parts.urn ? e === n ? "" : this : e === n ? this._parts.hostname ? u.buildHost(this._parts) : "" : (u.parseHost(e, this._parts), this.build(!i), this)
            }, c.authority = function (e, i) {
                return this._parts.urn ? e === n ? "" : this : e === n ? this._parts.hostname ? u.buildAuthority(this._parts) : "" : (u.parseAuthority(e, this._parts), this.build(!i), this)
            }, c.userinfo = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e === n) {
                    if (!this._parts.username) return "";
                    var t = u.buildUserinfo(this._parts);
                    return t.substring(0, t.length - 1)
                }
                return "@" !== e[e.length - 1] && (e += "@"), u.parseUserinfo(e, this._parts), this.build(!i), this
            }, c.subdomain = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e === n) {
                    if (!this._parts.hostname || this.is("IP")) return "";
                    var a = this._parts.hostname.length - this.domain().length - 1;
                    return this._parts.hostname.substring(0, a) || ""
                }
                var o = this._parts.hostname.length - this.domain().length,
                    l = this._parts.hostname.substring(0, o),
                    s = RegExp("^" + t(l));
                return e && "." !== e[e.length - 1] && (e += "."), e && u.ensureValidHostname(e), this._parts.hostname = this._parts.hostname.replace(s, e), this.build(!i), this
            }, c.domain = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if ("boolean" == typeof e && (i = e, e = n), e === n) {
                    if (!this._parts.hostname || this.is("IP")) return "";
                    var a = this._parts.hostname.match(/\./g);
                    if (a && 2 > a.length) return this._parts.hostname;
                    var o = this._parts.hostname.length - this.tld(i).length - 1;
                    return o = this._parts.hostname.lastIndexOf(".", o - 1) + 1, this._parts.hostname.substring(o) || ""
                }
                if (!e) throw new TypeError("cannot set domain empty");
                if (u.ensureValidHostname(e), !this._parts.hostname || this.is("IP")) this._parts.hostname = e;
                else {
                    var l = RegExp(t(this.domain()) + "$");
                    this._parts.hostname = this._parts.hostname.replace(l, e)
                }
                return this.build(!i), this
            }, c.tld = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if ("boolean" == typeof e && (i = e, e = n), e === n) {
                    if (!this._parts.hostname || this.is("IP")) return "";
                    var a = this._parts.hostname.lastIndexOf("."),
                        o = this._parts.hostname.substring(a + 1);
                    return i !== !0 && p && p.list[o.toLowerCase()] ? p.get(this._parts.hostname) || o : o
                }
                var l;
                if (!e) throw new TypeError("cannot set TLD empty");
                if (e.match(/[^a-zA-Z0-9-]/)) {
                    if (!p || !p.is(e)) throw new TypeError("TLD '" + e + "' contains characters other than [A-Z0-9]");
                    l = RegExp(t(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(l, e)
                } else {
                    if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host");
                    l = RegExp(t(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(l, e)
                }
                return this.build(!i), this
            }, c.directory = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e === n || e === !0) {
                    if (!this._parts.path || "/" === this._parts.path) return "/";
                    var a = this._parts.path.length - this.filename().length - 1,
                        o = this._parts.path.substring(0, a) || "/";
                    return e ? u.decodePath(o) : o
                }
                var l = this._parts.path.length - this.filename().length,
                    s = this._parts.path.substring(0, l),
                    r = RegExp("^" + t(s));
                return this.is("relative") || (e || (e = "/"), "/" !== e[0] && (e = "/" + e)), e && "/" !== e[e.length - 1] && (e += "/"), e = u.recodePath(e), this._parts.path = this._parts.path.replace(r, e), this.build(!i), this
            }, c.filename = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e === n || e === !0) {
                    if (!this._parts.path || "/" === this._parts.path) return "";
                    var a = this._parts.path.lastIndexOf("/"),
                        o = this._parts.path.substring(a + 1);
                    return e ? u.decodePathSegment(o) : o
                }
                var l = !1;
                "/" === e[0] && (e = e.substring(1)), e.match(/\.?\//) && (l = !0);
                var s = RegExp(t(this.filename()) + "$");
                return e = u.recodePath(e), this._parts.path = this._parts.path.replace(s, e), l ? this.normalizePath(i) : this.build(!i), this
            }, c.suffix = function (e, i) {
                if (this._parts.urn) return e === n ? "" : this;
                if (e === n || e === !0) {
                    if (!this._parts.path || "/" === this._parts.path) return "";
                    var a, o, l = this.filename(),
                        s = l.lastIndexOf(".");
                    return -1 === s ? "" : (a = l.substring(s + 1), o = /^[a-z0-9%]+$/i.test(a) ? a : "", e ? u.decodePathSegment(o) : o)
                }
                "." === e[0] && (e = e.substring(1));
                var r, d = this.suffix();
                if (d) r = e ? RegExp(t(d) + "$") : RegExp(t("." + d) + "$");
                else {
                    if (!e) return this;
                    this._parts.path += "." + u.recodePath(e)
                }
                return r && (e = u.recodePath(e), this._parts.path = this._parts.path.replace(r, e)), this.build(!i), this
            };
            var w = c.query;
            c.query = function (e, i) {
                return e === !0 ? u.parseQuery(this._parts.query) : e !== n && "string" != typeof e ? (this._parts.query = u.buildQuery(e), this.build(!i), this) : w.call(this, e, i)
            }, c.addQuery = function (e, n, i) {
                var t = u.parseQuery(this._parts.query);
                return u.addQuery(t, e, n), this._parts.query = u.buildQuery(t), "string" != typeof e && (i = n), this.build(!i), this
            }, c.removeQuery = function (e, n, i) {
                var t = u.parseQuery(this._parts.query);
                return u.removeQuery(t, e, n), this._parts.query = u.buildQuery(t), "string" != typeof e && (i = n), this.build(!i), this
            }, c.addSearch = c.addQuery, c.removeSearch = c.removeQuery, c.normalize = function () {
                return this._parts.urn ? this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()
            }, c.normalizeProtocol = function (e) {
                return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!e)), this
            }, c.normalizeHostname = function (e) {
                return this._parts.hostname && (this.is("IDN") && r ? this._parts.hostname = r.toASCII(this._parts.hostname) : this.is("IPv6") && d && (this._parts.hostname = d.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!e)), this
            }, c.normalizePort = function (e) {
                return "string" == typeof this._parts.protocol && this._parts.port === u.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!e)), this
            }, c.normalizePath = function (e) {
                if (this._parts.urn) return this;
                if (!this._parts.path || "/" === this._parts.path) return this;
                var n, i, t, a, o = this._parts.path;
                for ("/" !== o[0] && ("." === o[0] && (i = o.substring(0, o.indexOf("/"))), n = !0, o = "/" + o), o = o.replace(/(\/(\.\/)+)|\/{2,}/g, "/");;) {
                    if (t = o.indexOf("/../"), -1 === t) break;
                    if (0 === t) {
                        o = o.substring(3);
                        break
                    }
                    a = o.substring(0, t).lastIndexOf("/"), -1 === a && (a = t), o = o.substring(0, a) + o.substring(t + 3)
                }
                return n && this.is("relative") && (o = i ? i + o : o.substring(1)), o = u.recodePath(o), this._parts.path = o, this.build(!e), this
            }, c.normalizePathname = c.normalizePath, c.normalizeQuery = function (e) {
                return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(u.parseQuery(this._parts.query)) : this._parts.query = null, this.build(!e)), this
            }, c.normalizeFragment = function (e) {
                return this._parts.fragment || (this._parts.fragment = null, this.build(!e)), this
            }, c.normalizeSearch = c.normalizeQuery, c.normalizeHash = c.normalizeFragment, c.iso8859 = function () {
                var e = u.encode,
                    n = u.decode;
                return u.encode = escape, u.decode = decodeURIComponent, this.normalize(), u.encode = e, u.decode = n, this
            }, c.unicode = function () {
                var e = u.encode,
                    n = u.decode;
                return u.encode = encodeURIComponent, u.decode = unescape, this.normalize(), u.encode = e, u.decode = n, this
            }, c.readable = function () {
                var e = new u(this);
                e.username("").password("").normalize();
                var i = "";
                if (e._parts.protocol && (i += e._parts.protocol + "://"), e._parts.hostname && (e.is("punycode") && r ? (i += r.toUnicode(e._parts.hostname), e._parts.port && (i += ":" + e._parts.port)) : i += e.host()), e._parts.hostname && e._parts.path && "/" !== e._parts.path[0] && (i += "/"), i += e.path(!0), e._parts.query) {
                    for (var t = "", a = 0, o = e._parts.query.split("&"), l = o.length; l > a; a++) {
                        var s = (o[a] || "").split("=");
                        t += "&" + u.decodeQuery(s[0]).replace(/&/g, "%26"), s[1] !== n && (t += "=" + u.decodeQuery(s[1]).replace(/&/g, "%26"))
                    }
                    i += "?" + t.substring(1)
                }
                return i += e.hash()
            }, c.absoluteTo = function (e) {
                if (this._parts.urn) throw Error("URNs do not have any generally defined hierachical components");
                if (!this.is("relative")) throw Error("Cannot resolve non-relative URL");
                e instanceof u || (e = new u(e));
                for (var n, i = new u(this), t = ["protocol", "username", "password", "hostname", "port"], a = 0; n = t[a]; a++) i._parts[n] = e._parts[n];
                return "/" !== i.path()[0] && (i._parts.path = e.directory() + "/" + i._parts.path, i.normalizePath()), i.build(), i
            }, c.relativeTo = function (e) {
                if (this._parts.urn) throw Error("URNs do not have any generally defined hierachical components");
                if (e instanceof u || (e = new u(e)), "/" !== this.path()[0] || "/" !== e.path()[0]) throw Error("Cannot calculate common path from non-relative URLs");
                for (var n, i = new u(this), a = ["protocol", "username", "password", "hostname", "port"], o = u.commonPath(i.path(), e.path()), l = e.directory(), s = 0; n = a[s]; s++) i._parts[n] = null;
                if (!o || "/" === o) return i;
                if (l + "/" === o) i._parts.path = "./" + i.filename();
                else {
                    for (var r = "../", d = RegExp("^" + t(o)), p = l.replace(d, "/").match(/\//g).length - 1; p--;) r += "../";
                    i._parts.path = i._parts.path.replace(d, r)
                }
                return i.build(), i
            }, c.equals = function (e) {
                var n, i, t, o = new u(this),
                    l = new u(e),
                    s = {},
                    r = {},
                    d = {};
                if (o.normalize(), l.normalize(), "" + o == "" + l) return !0;
                if (n = o.query(), i = l.query(), o.query(""), l.query(""), "" + o != "" + l) return !1;
                if (n.length !== i.length) return !1;
                s = u.parseQuery(n), r = u.parseQuery(i);
                for (t in s)
                    if (Object.prototype.hasOwnProperty.call(s, t)) {
                        if (a(s[t])) {
                            if (!a(r[t])) return !1;
                            if (s[t].length !== r[t].length) return !1;
                            s[t].sort(), r[t].sort();
                            for (var p = 0, c = s[t].length; c > p; p++)
                                if (s[t][p] !== r[t][p]) return !1
                        } else if (s[t] !== r[t]) return !1;
                        d[t] = !0
                    } for (t in r)
                    if (Object.prototype.hasOwnProperty.call(r, t) && !d[t]) return !1;
                return !0
            }, i !== n && i.exports ? i.exports = u : window.URI = u
        })()
    }), define("core/lib/chrome/events/application", ["require", "exports", "module"], function (e, n, i) {
        function t(e) {
            switch (e) {
                case "right_up":
                    return 90;
                case "left_up":
                    return 270;
                case "bottom_up":
                    return 180;
                default:
                    return 0
            }
        }

        function a(e, n) {
            var i = n ? "ApplicationActivationStateActive" : "ApplicationActivationStateStandby";
            qnx.callExtensionMethod("webview.setApplicationActivationState", e, i)
        }

        function o(e) {
            return e
        }
        var l, s, r, d = window.orientation;
        r = {
            onExit: function () {
                l.emit("application.exit", [], !0)
            },
            onFontInfoChange: function (e, n) {
                l.emit("application.systemFontChange", [e, o(n)])
            },
            onKeyboardOpening: function () {
                s.setState(s.OPENING)
            },
            onKeyboardOpened: function () {
                s.setState(s.OPENED)
            },
            onKeyboardClosing: function () {
                s.setState(s.CLOSING)
            },
            onKeyboardClosed: function () {
                s.setState(s.CLOSED)
            },
            onKeyboardPosition: function (e) {
                s.setPosition(e)
            },
            onLanguageChange: function (e) {
                l.emit("application.systemLanguageChange", [e])
            },
            onLowMemory: function () {
                var e, n = wp.getWebViews();
                for (e = 0; n.length > e; e++) n[e].notifySystemLowMemory();
                l.emit("application.lowMemory")
            },
            onRegionChange: function (e) {
                l.emit("application.systemRegionChange", [e])
            },
            onRotate: function (e, n) {
                var i = screen.width,
                    a = screen.height,
                    o = t(n),
                    s = o - d,
                    r = i,
                    p = a;
                s % 180 && (r = a, p = i), l.emit("application.rotate", [r, p, o, e], !0), d = o
            },
            onRotateCheck: function () {
                return !0
            },
            onRotateDone: function (e) {
                var n = t(e);
                l.emit("application.rotateDone", [n])
            },
            onPropertyViewportEvent: function () {
                l.emit("application.propertyViewportEvent")
            },
            onSwipeDown: function () {
                l.emit("application.swipeDown")
            },
            onSwipeStart: function () {
                l.emit("application.swipeStart")
            },
            onWindowActive: function () {
                l.emit("application.active"), wp.getWebViews().forEach(function (e) {
                    a(e.id, !0)
                })
            },
            onWindowInactive: function () {
                l.emit("application.inactive"), wp.getWebViews().forEach(function (e) {
                    a(e.id)
                })
            },
            onWindowState: function (e) {
                wp.getApplication().windowState = e, l.emit("application.stateChange", [e])
            },
            onDeviceEdge: function (e) {
                l.emit("application.rotateWhenLocked", [e])
            },
            onPooled: function () {
                l.emit("application.pooled")
            },
            onIsDeviceLocked: function (e) {
                l.emit("application.isDeviceLocked", [e])
            },
            onDataLockStateChange: function (e, n) {
                wp.core.events.emit("application.dataLockStateChange", [e, 1e3 * n], !1)
            },
            onGetDataLockState: function (e) {
                wp.core.events.emit("application.getDataLockState", [e])
            },
            onGetDataLockTime: function (e) {
                wp.core.events.emit("application.getDataLockTime", [1e3 * e])
            },
            onWindowCovers: function (e) {
                var n = JSON.parse(e);
                wp.getApplication().coverSizes = n, l.emit("application.windowCovers", [n]), l.emit("application.windowCover", [n.fullSize])
            },
            onWindowCoverEnter: function () {
                l.emit("application.windowCoverEnter")
            },
            onWindowCoverExit: function () {
                l.emit("application.windowCoverExit")
            },
            onWindowLock: function () {
                l.emit("application.windowLock")
            },
            onWindowUnlock: function () {
                l.emit("application.windowUnlock")
            },
            onSystemKeyPress: function (e, n) {
                var i = "application.systemKeyPress-" + n;
                l.emit(i, [e, n]), l.emit("application.systemKeyPress", [e, n, l.isOn(i)])
            },
            systemKeyPressedHandled: function (e, n) {
                qnx.callExtensionMethod("application.systemKeyPress", e, n)
            }
        }, i.exports = r, l = {
            typeMap: {
                "application.systemFontChange": "application.fontchanged",
                "application.swipeDown": "application.swipedown",
                "application.swipeStart": "application.swipestart"
            },
            emit: function (e) {
                e = this.typeMap[e] || e, wp.core.events.emit.apply(wp.core.events, arguments)
            },
            isOn: function (e) {
                return e = this.typeMap[e] || e, wp.core.events.isOn.apply(wp.core.events, arguments)
            }
        }, s = {
            OPENING: "application.keyboardOpening",
            OPENED: "application.keyboardOpened",
            CLOSING: "application.keyboardClosing",
            CLOSED: "application.keyboardClosed",
            setState: function (e) {
                l.emit(e, [], !1)
            },
            setPosition: function (e) {
                l.emit("application.keyboardPosition", [e], !1)
            }
        }
    }), define("core/lib/chrome/events/windowAnimations", ["require", "exports", "module", "../../../../wp2/lib/windowAnimations"], function (e, n, i) {
        var t, a = e("../../../../wp2/lib/windowAnimations").windowAnimationFinishedCallbacks;
        t = {
            onWindowAnimationFinished: function (e) {
                a[e] && (a[e](), delete a[e])
            }
        }, i.exports = t
    }), define("core/lib/invocation", ["require", "exports", "module", "./error"], function (e, n, i) {
        function t() {
            var e = p++;
            return window.isFinite(e) || (p = 0, e = 0), e
        }

        function a(e) {
            return e && -1 !== e.indexOf("local:///") ? !0 : !1
        }

        function o(e) {
            return qnx.callExtensionMethod("application.getenv", e)
        }

        function l(e) {
            var n = o("HOME");
            return a(e) && (e = "file:///" + n.replace(/^\/*/, "") + "/../app/native/" + e.replace(/local:\/\/\//, "")), e
        }
        var s, r, d, p = 0,
            u = {},
            c = {};
        s = {
            INVOKE_NO_TARGET_ERROR: "INVOKE_NO_TARGET_ERROR",
            INVOKE_BAD_REQUEST_ERROR: "INVOKE_BAD_REQUEST_ERROR",
            INVOKE_INTERNAL_ERROR: "INVOKE_INTERNAL_ERROR",
            INVOKE_TARGET_ERROR: "INVOKE_TARGET_ERROR",
            INVOKE_TARGET_NOT_OWNED_ERROR: "INVOKE_TARGET_NOT_OWNED_ERROR",
            QUERY_TARGETS_INVALID_ARGUMENT: "invalid_argument",
            QUERY_TARGETS_RESPONSE_TOO_LARGE: "response_too_large",
            QUERY_TARGETS_SERVER_ERROR: "server_error",
            LAUNCH: 0,
            INVOKE: 1,
            VIEWER: 2,
            CARD: 3,
            STARTUP_MODES_MAP: ["launch", "invoke", "viewer", "card"],
            InvokeAction: {
                OPEN: "bb.action.OPEN",
                SHARE: "bb.action.SHARE",
                VIEW: "bb.action.VIEW"
            },
            TARGET_TYPE_MASK_APPLICATION: 1,
            TARGET_TYPE_MASK_CARD: 2,
            TARGET_TYPE_MASK_VIEWER: 0,
            TARGET_TYPE_MASK_SERVICE: 8,
            TARGET_TYPE_MASK_HEADLESS: 64,
            ACTION_TYPE_ALL: "ALL",
            ACTION_TYPE_MENU: "MENU",
            PERIMETER_TYPE_PERSONAL: "personal",
            PERIMETER_TYPE_ENTERPRISE: "enterprise",
            FILE_TRANSFER_PRESERVE: "PRESERVE",
            FILE_TRANSFER_COPY_RO: "COPY_RO",
            FILE_TRANSFER_COPY_RW: "COPY_RW",
            FILE_TRANSFER_LINK: "LINK",
            CARD_EDGE_TOP: "top_up",
            CARD_EDGE_BOTTOM: "bottom_up",
            CARD_EDGE_LEFT: "left_up",
            CARD_EDGE_RIGHT: "right_up",
            CARD_ORIENTATION_PORTRAIT: "portrait",
            CARD_ORIENTATION_LANDSCAPE: "landscape",
            CARD_PEEK_TYPE_CONTENT: "content",
            CARD_PEEK_TYPE_ROOT: "root",
            getStartupMode: function () {
                var e, n = o("uri");
                return "invoke://localhost" === n ? (e = o("MODE"), "card" === e ? s.CARD : "view" === e ? s.VIEWER : s.INVOKE) : s.LAUNCH
            },
            getRequest: function () {
                return qnx.callExtensionMethod("invocation.invokeRequest")
            },
            invoke: function (e, n, i) {
                var l = t(),
                    s = o("HOME") + "";
                a(e.uri) && (e.uri = "file:///" + s.replace(/^\/*/, "") + "/../app/native/" + e.uri.replace(/local:\/\/\//, "")), n && (u[l] = n), "function" == typeof d && i ? d(e, function (e) {
                    "object" == typeof e && qnx.callExtensionMethod("invocation.invoke", l, JSON.stringify(e))
                }) : qnx.callExtensionMethod("invocation.invoke", l, JSON.stringify(e))
            },
            invokeViewer: function (e, n) {
                var i, a = t();
                n && (u[a] = n), i = "viewer" + a, e.winid = i, qnx.callExtensionMethod("invocation.invokeViewer", a, i, JSON.stringify(e))
            },
            queryTargets: function (e, n) {
                var i = t(),
                    a = "viewer" + i;
                u[i] = n, e.winid = a, e.hasOwnProperty("uri") && (e.uri = l(e.uri)), qnx.callExtensionMethod("invocation.queryTargets", i, JSON.stringify(e))
            },
            cardResized: function () {
                r && qnx.callExtensionMethod("invocation.cardResize", r)
            },
            cardPeek: function (e) {
                qnx.callExtensionMethod("invocation.cardPeek", e)
            },
            closeChildCard: function () {
                qnx.callExtensionMethod("invocation.cardChildClose")
            },
            sendCardDone: function (e) {
                qnx.callExtensionMethod("invocation.cardClose", JSON.stringify(e))
            },
            getInvokeTargetFilters: function (e, n) {
                var i, a = t();
                u[a] = n, i = {
                    target: e
                }, qnx.callExtensionMethod("invocation.getInvokeTargetFilters", a, JSON.stringify(i))
            },
            setInvokeTargetFilters: function (e, n) {
                var i = t();
                n && (u[i] = n), qnx.callExtensionMethod("invocation.setInvokeTargetFilters", i, JSON.stringify(e))
            },
            onInvoked: function (e) {
                wp.core.events.emit("invocation.invoked", [e])
            },
            onInvokeResponse: function (e, n, i) {
                var t, a = u[e];
                if (a) {
                    delete u[e];
                    try {
                        t = JSON.parse(i)
                    } catch (o) {
                        t = null
                    }
                    a(n, t)
                }
            },
            onInvokeViewerResponse: function (e, n) {
                if (n) {
                    var i = u[e];
                    delete u[e], i && i(n)
                }
            },
            onQueryTargetsResponse: function (e, n, i) {
                var t, a = u[e];
                if (a) {
                    delete u[e];
                    try {
                        t = JSON.parse(i)
                    } catch (o) {
                        t = null
                    }
                    a(n, t)
                }
            },
            onViewerCreate: function (e, n) {
                var i, a = u[e];
                delete u[e], i = {
                    viewerId: n,
                    relayCallbacks: {},
                    close: function () {
                        qnx.callExtensionMethod("invocation.closeViewer", this.viewerId)
                    },
                    receive: function (e, n) {
                        var i = n.msg;
                        "viewerCloseRequest" === i ? (this.close(), this.hasOwnProperty("onClose") && this.onClose()) : "viewerCancelRequest" === i ? (this.close(), this.hasOwnProperty("onCancel") && this.onCancel()) : this.hasOwnProperty("onReceive") && this.onReceive(e, n.msg, n.dat)
                    },
                    receiveResponse: function (e, n) {
                        var i = this.relayCallbacks[e];
                        delete this.relayCallbacks[e], i && i(n.name, n.dat)
                    },
                    setSize: function (e, n) {
                        var i = {
                            msg: "resizeReqeust",
                            data: {
                                width: e,
                                height: n
                            }
                        };
                        this.send(JSON.stringify(i))
                    },
                    setPosition: function (e, n) {
                        qnx.callExtensionMethod("invocation.setViewerPosition", this.viewerId, e, n)
                    },
                    setVisibility: function (e) {
                        qnx.callExtensionMethod("invocation.setViewerVisibility", this.viewerId, e)
                    },
                    setZOrder: function (e) {
                        qnx.callExtensionMethod("invocation.setViewerZOrder", this.viewerId, e)
                    },
                    send: function (e, n) {
                        var i = t();
                        n && (this.relayCallbacks[i] = n), e.winid = this.viewerId, qnx.callExtensionMethod("invocation.viewerRelay", i, e)
                    },
                    update: function () {
                        qnx.callExtensionMethod("applicationWindow.flushContext")
                    }
                }, c[i.viewerId] = i, a(null, i)
            },
            onViewerRelay: function (e, n) {
                try {
                    var i = JSON.parse(n),
                        t = c[i.winId];
                    t && t.receive(e, i)
                } catch (a) {}
            },
            onViewerRelayResponse: function (e, n) {
                try {
                    var i = JSON.parse(n),
                        t = c[i.winId];
                    t && t.receiveResponse(e, i)
                } catch (a) {}
            },
            onViewerStopped: function (e) {
                delete c[e]
            },
            onCardResize: function (e, n) {
                var i = n.split(","),
                    t = {
                        width: i[0],
                        height: i[1],
                        orientation: i[2],
                        edge: i[3]
                    };
                r = e, wp.core.events.emit("invocation.cardResize", [t])
            },
            onCardStartPeek: function (e) {
                wp.core.events.emit("invocation.cardPeekStarted", [e])
            },
            onCardEndPeek: function () {
                wp.core.events.emit("invocation.cardPeekEnded")
            },
            onCardChildOpened: function () {
                wp.core.events.emit("invocation.childCardOpened")
            },
            onCardChildClosed: function (e) {
                var n;
                try {
                    n = JSON.parse(e)
                } catch (i) {
                    n = {
                        reason: "",
                        type: "",
                        data: ""
                    }
                }
                wp.core.events.emit("invocation.childCardClosed", [n])
            },
            onCardClosed: function (e) {
                var n;
                try {
                    n = JSON.parse(e)
                } catch (i) {
                    n = {
                        reason: "",
                        type: "",
                        data: ""
                    }
                }
                wp.core.events.emit("invocation.cardClosed", [n])
            },
            onGetInvokeTargetFiltersResponse: function (e, n, i) {
                var t, a = u[e];
                if (a) {
                    delete u[e];
                    try {
                        t = JSON.parse(i)
                    } catch (o) {
                        t = null
                    }
                    a(n, t)
                }
            },
            onSetInvokeTargetFiltersResponse: function (e, n, i) {
                var t, a = u[e];
                if (a) {
                    delete u[e];
                    try {
                        t = JSON.parse(i)
                    } catch (o) {
                        t = null
                    }
                    a(n, t)
                }
            },
            on: function (e, n) {
                var i = "invocation." + e.charAt(0).toLowerCase() + e.slice(1);
                wp.core.events.on(i, n)
            },
            un: function (e, n) {
                var i = "invocation." + e.charAt(0).toLowerCase() + e.slice(1);
                wp.core.events.un(i, n)
            }
        }, e("./error").wrapAll(s, "invocation."), s.__defineGetter__("startupMode", function () {
            return s.getStartupMode()
        }), s.__defineGetter__("invokeRequest", function () {
            var e = s.getRequest();
            if (e) try {
                return JSON.parse(e)
            } catch (n) {
                return null
            }
            return null
        }), s.__defineGetter__("interrupter", function () {
            return d
        }), s.__defineSetter__("interrupter", function (e) {
            d = e
        }), i.exports = s
    }), define("core/lib/webDriver", ["require", "exports", "module", "./events"], function (e, n, i) {
        var t, a = e("./events"),
            o = !0,
            l = 200,
            s = function () {
                setTimeout(window.wp.core.automation.init, 1)
            };
        t = {
            get enabled() {
                return qnx.callExtensionMethod("webDriver.enabled")
            },
            set enabled(e) {
                qnx.callExtensionMethod("webDriver.setEnabled", e), e && o ? a.once("automation.init", s) : e && !o ? s() : window.wp.core.automation.dinit()
            },
            get port() {
                return qnx.callExtensionMethod("webDriver.port")
            },
            exec: function (e, n, i, a) {
                window.seleniumCoreRequire("main").executeRestCommand(e, n, i, a, t.reply)
            },
            reply: function (e, n, i, t, a) {
                var o = {},
                    s = a || l;
                o.sessionId = e ? "" + e : "", o.status = n, o.value = i, qnx.callExtensionMethod("webDriver.reply", t, JSON.stringify(o), s)
            },
            error: function (e, n, i, a, o) {
                t.reply(e, n, i, a, o)
            }
        }, a.once("automation.init", function () {
            o = !1
        }), i.exports = t
    }), define("core/lib/chrome/internal", ["require", "exports", "module", "../chrome/events/application", "../chrome/events/windowAnimations", "../invocation", "../webEvents", "../pps/pps", "../webDriver"], function (e, n, i) {
        function t(e, n) {
            -1 === p.indexOf(e) && p.push(e), n && s.defineNetworkEvent(e)
        }
        var a = e("../chrome/events/application"),
            o = e("../chrome/events/windowAnimations"),
            l = e("../invocation"),
            s = e("../webEvents"),
            r = e("../pps/pps"),
            d = e("../webDriver"),
            p = ["JavaScriptWindowObjectCleared", "LocationChanging", "ContextMenuRequestEvent", "ContextMenuCancelEvent", "PropertyCurrentContextEvent", "UnknownProtocol", "DialogRequested", "ChooseFile", "SSLHandshakingFailed", "GeolocationPermissionRequest", "NotificationPermissionRequest", "NetworkError", "NotificationPermissionCheck", "UserMediaRequest", "OpenWindow", "ChildWindowOpen", "ChildWebViewCreated", "NetworkResourceStatusReceived", "NetworkResourceHeaderReceived", "NetworkResourceDataReceived", "NetworkResourceRequested"];
        i.exports = {
            sendEvents: p,
            defineSendEvent: t,
            windowAnimations: o,
            application: a,
            webDriver: d,
            invocation: {
                onInvoked: l.onInvoked,
                onInvokeResponse: l.onInvokeResponse,
                onInvokeViewerResponse: l.onInvokeViewerResponse,
                onQueryTargetsResponse: l.onQueryTargetsResponse,
                onViewerCreate: l.onViewerCreate,
                onViewerRelay: l.onViewerRelay,
                onViewerRelayResponse: l.onViewerRelayResponse,
                onViewerStopped: l.onViewerStopped,
                onCardResize: l.onCardResize,
                onCardStartPeek: l.onCardStartPeek,
                onCardEndPeek: l.onCardEndPeek,
                onCardChildClosed: l.onCardChildClosed,
                onCardClosed: l.onCardClosed,
                onGetInvokeTargetFiltersResponse: l.onGetInvokeTargetFiltersResponse,
                onSetInvokeTargetFiltersResponse: l.onSetInvokeTargetFiltersResponse
            },
            pps: {
                onEvent: r.onEvent
            },
            webEvent: function (e, n, i, t) {
                var a = {
                    webviewId: e,
                    returnValue: "",
                    sync: !1
                };
                return -1 !== p.indexOf(n) && -1 !== t && (a.sync = !0), s.emit(n, a.webviewId, [i], a), a.returnValue
            }
        }
    }), define("wp2/lib/cards/mediaplayer", ["require", "exports", "module", "./../utils", "../../../core/lib/pps/ppsUtils"], function (e, n, i) {
        var t = e("./../utils"),
            a = e("../../../core/lib/pps/ppsUtils");
        i.exports = {
            open: function (e, n, i, o) {
                var l, s, r;
                e = e || {}, r = t.translatePath(e.contentUri || ""), s = a.encode({
                    contentTitle: e.contentTitle,
                    imageUri: e.imageUri ? t.translatePath(e.imageUri) : void 0
                }), l = function (e) {
                    wp.core.invocation.un("childCardClosed", l), 0 === e.reason.toLowerCase().indexOf("cancel") ? "function" == typeof i && i(e.reason) : "function" == typeof n && n(e.data)
                }, wp.core.invocation.on("childCardClosed", l), wp.core.invocation.invoke({
                    action: "bb.action.VIEW",
                    target: "sys.mediaplayer.previewer",
                    uri: r,
                    data: t.base64Encode(s)
                }, function (e) {
                    o(e)
                })
            }
        }
    }), define("wp2/lib/cards/emailComposer", ["require", "exports", "module", "./../../../core/lib/pps/ppsUtils", "./../utils"], function (e, n, i) {
        function t(e) {
            var n, i = [];
            for (n = 0; e.length > n; n++) i.push(o.translatePath(e[n]));
            return i
        }
        var a = e("./../../../core/lib/pps/ppsUtils"),
            o = e("./../utils");
        i.exports = {
            open: function (e, n, i, l) {
                var s, r = void 0 !== typeof e ? {
                        from: e.from,
                        subject: e.subject,
                        body: e.body,
                        calendarevent: e.calendarevent,
                        to: e.to ? e.to : [],
                        cc: e.cc ? e.cc : [],
                        attachment: e.attachment ? t(e.attachment) : []
                    } : {},
                    d = a.encode({
                        data: r
                    });
                s = function (e) {
                    wp.core.invocation.un("childCardClosed", s), "cancel" === e.reason ? "function" == typeof i && i(e.reason) : "function" == typeof n && n(e.data)
                }, wp.core.invocation.on("childCardClosed", s), wp.core.invocation.invoke({
                    target: "sys.pim.uib.email.hybridcomposer",
                    action: "bb.action.COMPOSE",
                    data: o.base64Encode(d)
                }, l)
            }
        }
    }), define("wp2/lib/cards/calendarPicker", ["require", "exports", "module", "../../../core/lib/pps/ppsUtils", "./../utils"], function (e, n, i) {
        var t = e("../../../core/lib/pps/ppsUtils"),
            a = e("./../utils");
        i.exports = {
            open: function (e, n, i, o) {
                var l, s = void 0 !== typeof e ? {
                        filepath: a.translatePath(e.filepath)
                    } : {},
                    r = t.encode(s);
                l = function (e) {
                    wp.core.invocation.un("childCardClosed", l), "cancel" === e.reason ? "function" == typeof i && i(e.reason) : "function" == typeof n && n(e.data)
                }, wp.core.invocation.on("childCardClosed", l), wp.core.invocation.invoke({
                    target: "sys.pim.calendar.viewer.nav",
                    action: "bb.calendar.PICK",
                    data: a.base64Encode(r)
                }, o)
            }
        }
    }), define("wp2/lib/cards/calendarComposer", ["require", "exports", "module", "../../../core/lib/pps/ppsUtils", "../utils"], function (e, n, i) {
        var t = e("../../../core/lib/pps/ppsUtils"),
            a = e("../utils");
        i.exports = {
            open: function (e, n, i, o) {
                var l, s = e !== void 0 ? {
                        accountId: e.accountId,
                        syncId: e.syncId,
                        subject: e.subject,
                        startTime: e.startTime,
                        duration: e.duration,
                        body: e.body,
                        participants: e.participants ? e.participants : []
                    } : {},
                    r = t.encode(s);
                l = function (e) {
                    wp.core.invocation.un("childCardClosed", l), "cancel" === e.reason ? "function" == typeof i && i(e.reason) : "function" == typeof n && n(e.data)
                }, wp.core.invocation.on("childCardClosed", l), wp.core.invocation.invoke({
                    target: "sys.pim.calendar.viewer.eventcreate",
                    action: "bb.calendar.CREATE",
                    data: a.base64Encode(r)
                }, o)
            }
        }
    }), define("wp2/lib/cards/ics", ["require", "exports", "module", "./../../../core/lib/pps/ppsUtils", "./../utils"], function (e, n, i) {
        var t = e("./../../../core/lib/pps/ppsUtils"),
            a = e("./../utils");
        i.exports = {
            open: function (e, n, i, o) {
                var l, s, r = {
                    accountId: e.accountId
                };
                s = function (e) {
                    wp.core.invocation.un("childCardClosed", s), "Closed" === e.reason ? "function" == typeof n && n(e.data) : "function" == typeof i && i(e.reason)
                }, wp.core.invocation.on("childCardClosed", s), l = t.encode(r), wp.core.invocation.invoke({
                    action: "bb.action.OPEN",
                    target: "sys.pim.calendar.viewer.ics",
                    type: "text/calendar",
                    uri: a.translatePath(e.uri),
                    data: a.base64Encode(l)
                }, function (e) {
                    o(e)
                })
            }
        }
    }), define("wp2/lib/Application", ["require", "exports", "module", "../../core/lib/chrome/internal", "./cards/mediaplayer", "./cards/file", "./cards/capture", "./cards/emailComposer", "./cards/calendarPicker", "./cards/calendarComposer", "./cards/ics"], function (e, n, i) {
        var t, a = e("../../core/lib/chrome/internal");
        t = function () {
            var e = qnx.callExtensionMethod("application.coverSizes"),
                n = "1" === qnx.callExtensionMethod("application.isForeground") ? "fullscreen" : "thumbnail";
            this.__defineGetter__("coverSize", function () {
                return e.fullSize
            }), this.__defineSetter__("coverSize", function (n) {
                e.fullSize = n
            }), this.__defineGetter__("coverSizes", function () {
                return e
            }), this.__defineSetter__("coverSizes", function (n) {
                e = n
            }), this.__defineGetter__("windowState", function () {
                return n
            }), this.__defineSetter__("windowState", function (e) {
                n = e
            }), this.__defineGetter__("isForeground", function () {
                return "1" === qnx.callExtensionMethod("application.isForeground") ? !0 : !1
            }), this.__defineGetter__("windowVisible", function () {
                return "1" === qnx.callExtensionMethod("applicationWindow.isVisible")
            }), this.__defineSetter__("windowVisible", function (e) {
                qnx.callExtensionMethod("applicationWindow.setVisible", !!e)
            }), this.__defineGetter__("systemRegion", function () {
                return qnx.callExtensionMethod("application.systemRegion")
            }), this.__defineGetter__("webInspectorPort", function () {
                return qnx.callExtensionMethod("webInspector.port")
            }), this.getEnv = function (e) {
                return qnx.callExtensionMethod("application.getenv", e)
            }, this.setEnv = function (e, n) {
                return qnx.callExtensionMethod("application.setenv", e, n)
            }, this.unsetEnv = function (e) {
                return qnx.callExtensionMethod("application.unsetenv", e)
            }, this.notifyRotateComplete = function () {
                qnx.callExtensionMethod("application.notifyRotateComplete")
            }, this.getSystemFontFamily = function () {
                return qnx.callExtensionMethod("application.systemFontFamily")
            }, this.getSystemFontSize = function () {
                return parseInt(qnx.callExtensionMethod("application.systemFontSize"), 10)
            }, this.exit = function () {
                qnx.callExtensionMethod("application.requestExit")
            }, this.minimizeWindow = function () {
                qnx.callExtensionMethod("application.minimizeWindow")
            }, this.lockRotation = function (e) {
                e ? qnx.callExtensionMethod("application.lockRotation", "deviceTracking") : qnx.callExtensionMethod("application.lockRotation")
            }, this.unlockRotation = function () {
                qnx.callExtensionMethod("application.unlockRotation")
            }, this.newWallpaper = function (e) {
                qnx.callExtensionMethod("application.newWallpaper", e)
            }, this.rotate = function (e) {
                qnx.callExtensionMethod("application.rotate", e)
            }, this.on = function (e, n) {
                wp.core.events.on(e, n)
            }, this.un = function (e, n) {
                wp.core.events.un(e, n)
            }, this.defineSendEvent = a.defineSendEvent, this.setWindowOrientation = function (e) {
                qnx.callExtensionMethod("applicationWindow.setOrientation", e)
            }, this.extendTerminate = function () {
                qnx.callExtensionMethod("application.extendTerminate")
            }, this.setPooled = function () {
                qnx.callExtensionMethod("application.setPooled")
            }, this.isDeviceLocked = function (e) {
                var n = function (i) {
                    e(i), wp.core.events.un("application.isDeviceLocked", n)
                };
                wp.core.events.on("application.isDeviceLocked", n), qnx.callExtensionMethod("application.isDeviceLocked")
            }, this.getDataLockState = function (e) {
                var n = function (i) {
                    e(i), wp.core.events.un("application.getDataLockState", n)
                };
                wp.core.events.on("application.getDataLockState", n), qnx.callExtensionMethod("application.getDataLockState")
            }, this.getDataLockTime = function (e) {
                var n = function (i) {
                    e(i), wp.core.events.un("application.getDataLockTime", n)
                };
                wp.core.events.on("application.getDataLockTime", n), qnx.callExtensionMethod("application.getDataLockTime")
            }, this.updateCover = function (e) {
                var n = {
                    fullSize: e
                };
                this.updateCovers(n)
            }, this.updateCovers = function (e) {
                qnx.callExtensionMethod("application.updateCovers", JSON.stringify(e))
            }
        }, t.prototype.cards = {
            mediaplayerPreviewer: e("./cards/mediaplayer"),
            filePicker: e("./cards/file"),
            camera: e("./cards/capture"),
            email: {
                composer: e("./cards/emailComposer")
            },
            calendar: {
                picker: e("./cards/calendarPicker"),
                composer: e("./cards/calendarComposer")
            },
            icsViewer: e("./cards/ics")
        }, i.exports = t
    }), define("core/lib/pps/ppsNetwork", ["require", "exports", "module", "./ppsUtils"], function (e, n, i) {
        function t(e) {
            function n(e) {
                for (var n in e) e.hasOwnProperty(n) && s.push(n)
            }

            function i(e) {
                for (var n in e) e.hasOwnProperty(n) && s.push(n)
            }

            function t() {
                s = s.sort(function (e, n) {
                    var i = {
                        rndis0: 1,
                        ecm0: 2,
                        tiw_sta0: 3,
                        ppp0: 4
                    };
                    return (i[e] ? i[e] : 3) - (i[n] ? i[n] : 3)
                }), e()
            }
            var a = d.create(p + ".all", d.PPSMode.FULL);
            s = [], a.onNewData = n, a.onFirstReadComplete = i, a.onClosed = t, a.open(d.FileMode.RDONLY), a.close()
        }

        function a(e) {
            var n, i, t = e.ip_addresses,
                a = e.type;
            return "wifi" !== a && "usb" !== a || !t || 2 !== t.length ? void 0 : (t[0].match("^([0-9]{1,3}([.][0-9]{1,3}){3}).*") ? (n = t[0], i = t[1]) : (i = t[0], n = t[1]), {
                ipv4Address: n.substr(0, n.indexOf("/")),
                ipv6Address: i.substr(0, i.indexOf("%")),
                type: a,
                connected: e.connected
            })
        }

        function o(e, n) {
            if (s.length > e) {
                var i = d.read(p + s[e]),
                    t = a(i[s[e]]);
                r[s[e]] = t ? t : null, o(++e, n)
            } else n(r)
        }
        var l, s, r, d = e("./ppsUtils"),
            p = "/pps/services/networking/interfaces/",
            u = "/pps/services/networking/status_public",
            c = "/pps/services/cellular/radioctrl/status_cell_public";
        l = {
            getNetworkInfo: function (e) {
                e && t(function () {
                    r = {}, o(0, e)
                })
            },
            getActiveConnectionInfo: function () {
                var e, n, i, t, a, o = null,
                    l = d.read(u);
                return i = l.status_public, "" === i.default_interface ? null : (o = {}, e = i.default_interface, o.defaultInterface = e, o.ipv4 = "yes" === i.ip4_ok ? !0 : !1, o.ipv6 = "yes" === i.ip6_ok ? !0 : !1, o.defaultGateways = i.default_gateway, n = d.read(p + e), n && (o.type = n[e].type, o.up = n[e].up, "cellular" === n[e].type && (a = d.read(c), t = a.status_cell_public, o.technology = t.network_technology)), o)
            }
        }, i.exports = l
    }), define("wp2/lib/device", ["require", "exports", "module", "../../core/lib/pps/ppsUtils", "./utils", "../../core/lib/pps/ppsNetwork", "../../core/lib/events", "../../core/lib/chrome"], function (e, n, i) {
        function t(e, n, i) {
            Object.defineProperty(w, n, {
                get: function () {
                    try {
                        var n = r.read(e);
                        return i.reduce(function (e, n) {
                            return e[n]
                        }, n)
                    } catch (t) {
                        console.error(t)
                    }
                },
                enumerable: !0
            })
        }

        function a(e) {
            return 5 > e ? T.CRITICAL : e >= 5 && 15 > e ? T.LOW : T.NORMAL
        }

        function o(e) {
            var n, i, t = {
                statusChange: !1,
                chargeLow: !1,
                chargeCritical: !1
            };
            if (e.changed) {
                e.changed.BatteryInfo && e.data && e.data.BatteryInfo && e.data.BatteryInfo.BatteryStatus && (x.level = e.data.BatteryInfo.BatteryStatus.StateOfCharge, t.statusChange = !0), e.changed.ChargerInfo && e.data && (x.isPlugged = "NONE" !== e.data.ChargerInfo, t.statusChange = !0), n = a(x.level), n !== x.state && (n === T.LOW ? t.chargeLow = !0 : n === T.CRITICAL && (t.chargeCritical = !0), x.state = n);
                for (i in t) t.hasOwnProperty(i) && t[i] && wp.core.events.emit(h + i, [x])
            }
        }

        function l(e) {
            x.level = e.status.BatteryInfo.BatteryStatus.StateOfCharge, x.isPlugged = "NONE" !== e.status.ChargerInfo, x.state = a(x.level)
        }

        function s(e, n) {
            var i = r.create(n, r.PPSMode.DELTA);
            i.onFirstReadComplete = function (n) {
                wp.core.events.emit(e, [n])
            }, i.onNewData = function (n) {
                wp.core.events.emit(e, [n])
            }, i.open(r.FileMode.RDONLY), g[n] = i
        }
        var r = e("../../core/lib/pps/ppsUtils"),
            d = e("./utils"),
            p = e("../../core/lib/pps/ppsNetwork"),
            u = e("../../core/lib/events"),
            c = e("../../core/lib/chrome").id,
            m = "device.connectionChange",
            h = "device.battery.",
            v = {
                chargeLow: "chargeLow",
                chargeCritical: "chargeCritical",
                statusChange: "statusChange"
            },
            f = "/pps/services/BattMgr/status",
            y = "/pps/services/networking/status_public",
            g = {},
            w = {},
            b = null,
            x = {},
            T = {
                CRITICAL: 0,
                LOW: 1,
                NORMAL: 2
            },
            M = {
                L_SERIES: 0,
                N_SERIES: 1,
                R_SERIES: 2,
                A_SERIES: 3,
                W_SERIES: 4
            };
        t("/pps/services/private/deviceproperties", "devicePin", ["deviceproperties", "devicepin"]), t("/pps/services/private/deviceproperties", "IMEI", ["deviceproperties", "IMEI"]), t("/pps/services/deviceproperties", "defaultTheme", ["deviceproperties", "defaultTheme"]), t("/pps/services/deviceproperties", "deviceOS", ["deviceproperties", "device_os"]), t("/pps/services/deviceproperties", "deviceName", ["deviceproperties", "devicename"]), t("/pps/services/deviceproperties", "hardwareId", ["deviceproperties", "hardwareid"]), t("/pps/services/deviceproperties", "iconRes", ["deviceproperties", "icon_res"]), t("/pps/services/deviceproperties", "modelFullName", ["deviceproperties", "modelfullname"]), t("/pps/services/deviceproperties", "modelName", ["deviceproperties", "modelname"]), t("/pps/services/deviceproperties", "scmBundle", ["deviceproperties", "scmbundle"]), t("/pps/services/deviceproperties", "screenDPI", ["deviceproperties", "screen_dpi"]), t("/pps/services/deviceproperties", "screenRes", ["deviceproperties", "screen_res"]), t("/pps/services/cellular/uicc/card0/status_private", "mcc", ["status_private", "hplmn", "mcc"]), t("/pps/services/cellular/uicc/card0/status_private", "mnc", ["status_private", "hplmn", "mnc"]), t("/pps/services/cellular/uicc/card0/status_restricted", "IMSI", ["status_restricted", "imsi"]), t("/pps/services/confstr/_CS_TIMEZONE", "timezone", ["_CS_TIMEZONE", "_CS_TIMEZONE"]), w.on = function (e, n) {
            if (d.startsWith(e, h)) {
                if (wp.core.events.on(e, n), void 0 === g[f]) {
                    var i = r.create(f, r.PPSMode.DELTA);
                    i.onFirstReadComplete = l, i.onNewData = o, i.open(r.FileMode.RDONLY), g[f] = i
                }
            } else e === m && (wp.core.events.on(e, n), void 0 === g[y] && s(e, y))
        }, w.un = function (e, n) {
            var i, t;
            if (d.startsWith(e, h)) {
                wp.core.events.un(e, n);
                for (t in v)
                    if (v.hasOwnProperty(t) && u.isOn(h + t)) return;
                i = g[f], i.close(), delete g[f]
            } else e === m && (wp.getController().removeEventListener(e, n), u.isOn(c, e) || (i = g[y], i.close(), delete g[y]))
        }, w.getNetworkInterfaces = function (e) {
            p.getNetworkInfo(e)
        }, Object.defineProperty(w, "activeConnection", {
            get: function () {
                return p.getActiveConnectionInfo()
            },
            enumerable: !0
        }), w.getTimezones = function (e) {
            if (e && "function" == typeof e)
                if (b) e(b);
                else {
                    var n = wp.getController().setFileSystemSandbox,
                        i = function () {
                            e(null), wp.getController().setFileSystemSandbox = n
                        },
                        t = function (t) {
                            t.file(function (i) {
                                var t = new FileReader;
                                t.onloadend = function () {
                                    var i = this.result,
                                        t = i.split("\n"),
                                        a = [];
                                    t.forEach(function (e) {
                                        /^"/.test(e) && a.push(e.replace(/"/g, ""))
                                    }), e(a), b = a, wp.getController().setFileSystemSandbox = n
                                }, t.readAsText(i)
                            }, i)
                        },
                        a = function (e) {
                            wp.getController().setFileSystemSandbox = !1, e.root.getFile("/usr/share/zoneinfo/tzvalid", {
                                create: !1
                            }, t, i)
                        };
                    window.webkitRequestFileSystem(window.PERSISTENT, 1048576, a, i)
                }
        }, w.__defineGetter__("hasPhysicalKeyboard", function () {
            return window.matchMedia("(-blackberry-physical-keyboard)").matches
        }), w.__defineGetter__("hasOledScreen", function () {
            return window.matchMedia("(-blackberry-display-technology: -blackberry-display-oled)").matches
        }), w.__defineGetter__("type", function () {
            return 720 === window.screen.height && 720 === window.screen.width ? this.hasOledScreen ? M.N_SERIES : M.R_SERIES : 1280 === window.screen.height && 768 === window.screen.width || 768 === window.screen.height && 1280 === window.screen.width ? M.L_SERIES : 1280 === window.screen.height && 720 === window.screen.width || 720 === window.screen.height && 1280 === window.screen.width ? M.A_SERIES : 1440 === window.screen.height && 1440 === window.screen.width ? M.W_SERIES : void 0
        }), w.__defineGetter__("keyboardOffset", function () {
            return w.type === M.W_SERIES ? "72" : void 0
        }), w.__defineGetter__("keyboardHeight", function () {
            return w.type === M.W_SERIES ? "480" : void 0
        }), w.DEVICE_TYPE = M, i.exports = w
    }), define("wp2/lib/notification", ["require", "exports", "module", "../../core/lib/pps/ppsUtils"], function (e, n, i) {
        var t, a = e("../../core/lib/pps/ppsUtils");
        t = {
            TYPE_UIB_ONLY: "uib_only",
            TYPE_PREVIEW_ONLY: "preview_only",
            TYPE_UIB_SILENT: "uib_silent",
            notify: function (e, n) {
                try {
                    a.write({
                        msg: "delete",
                        dat: {
                            itemid: e.options.tag
                        }
                    }, "/pps/services/notify/control"), a.write({
                        msg: "notify",
                        dat: {
                            itemid: e.options.tag,
                            title: e.title,
                            subtitle: e.options.body,
                            target: e.options.target,
                            targetAction: e.options.targetAction,
                            payload: e.options.payload,
                            payloadType: e.options.payloadType,
                            payloadURI: e.options.payloadURI,
                            type: e.options.type
                        }
                    }, "/pps/services/notify/control"), n()
                } catch (i) {
                    n(i)
                }
            },
            remove: function (e) {
                a.write({
                    msg: "delete",
                    dat: {
                        itemid: e
                    }
                }, "/pps/services/notify/control")
            }
        }, i.exports = t
    }), define("core/lib/automation/main", ["require", "exports", "module", "./../events", "../pps/pps", "./../rpc/rpc"], function (e, n, i) {
        var t, a, o, l, s, r = e("./../events"),
            d = e("../pps/pps"),
            p = e("./../rpc/rpc"),
            u = !1,
            c = !1,
            m = !1,
            h = "webDriverCoreScript",
            v = function (e) {
                if (!m) {
                    var n = document.createElement("script");
                    n.type = "text/javascript", n.id = h, n.onload = function () {
                        o = seleniumCoreRequire("main"), o.init(), e && e()
                    }, n.src = "platform:///seleniumCore.js", document.getElementsByTagName("head")[0].appendChild(n), m = !0, c = !0
                }
            },
            f = function (e) {
                l = e
            },
            y = function () {
                if (t = d.create("/pps/browser/control", d.PPSMode.DELTA), a = d.create("/pps/browser/output", d.PPSMode.FULL), t.onFirstReadComplete = f, t.open(d.FileMode.RDONLY) && a.open(d.FileMode.WRONLY)) {
                    var e = function () {
                        u = !0, o.output = a.write, t.onNewData = o.ppsNewData, l ? o.ppsNewData(l) : t.onFirstReadComplete = o.ppsNewData, o.closePPS = s.close
                    };
                    v(e)
                }
            },
            g = function () {
                var e, n, i, t = d.create("/pps/services/automation/browser/output", d.PPSMode.FULL);
                t.open(d.FileMode.WRONLY) && (e = window.require("iris/tabs/controller"), r.on("webpage.load.progress", function (t, a) {
                    a >= 90 && (i = e.get(t), qnx.callExtensionMethod("webview.automationLog", window.iris.chromeId, "progressBarDisappears"), n = "Navigation Request: old url=" + i.oldUrl + " new url=" + i.url + " webviewId= " + i.webviewId, console.log(n))
                }), t.close())
            };
        s = {
            init: v,
            rpc: p,
            dinit: function () {
                var e = document.getElementById(h);
                e && e.parentNode.removeChild(e), u = !1, m = !1, c = !1, o = 0
            },
            close: function () {
                t.close(), a.close()
            }
        }, r.once("automation.init", y), r.once("automation.init", g), i.exports = s
    }), define("core/lib/core.js", ["require", "exports", "module", "./events", "./pps/ppsUtils", "./invocation", "./error", "./automation/main"], function (e, n, i) {
        i.exports = {
            events: e("./events"),
            pps: e("./pps/ppsUtils"),
            invocation: e("./invocation"),
            error: e("./error"),
            automation: e("./automation/main")
        }
    }), define("core/plugins/toast/api", ["require", "exports", "module", "../../lib/events"], function (e, n, i) {
        function t(e) {
            s = e, u = 0, s.rpc.on("toast.dismissed", function (e, n) {
                var i = n.toastId;
                void 0 !== i && p[i] && (p[i](i), delete p[i])
            }), s.rpc.on("toast.callback", function (e, n) {
                var i = n.toastId;
                void 0 !== i && d[i] && (d[i](i), delete d[i])
            }), s.rpc.on("toast.destroyed", function () {
                wp.ui.default.hideRenderingWebView(), r.emit("toast.destroyed")
            })
        }

        function a(e, n) {
            var i = {},
                t = u++;
            return n = n || {}, e ? (i.options = n, i.message = e, i.toastId = t, d[t] = n.callbackHandler, p[t] = n.dismissHandler, wp.ui.default.showRenderingWebView(), s.rpc.postMessage("toast.show", i), t) : -1
        }

        function o(e) {
            e = JSON.stringify(e), e && s.rpc.postMessage("toast.hide", e)
        }
        var l, s, r = e("../../lib/events"),
            d = [],
            p = [],
            u = 0;
        l = {
            renderOn: t,
            show: a,
            hide: o
        }, i.exports = l
    }), define("core/plugins/default/api", ["require", "exports", "module"], function (e, n, i) {
        function t(e) {
            var n, i;
            r = e, s = window.wp.getApplication();
            try {
                n = document.getElementsByTagName("title")[0], n.parentNode.removeChild(n)
            } catch (t) {}
            try {
                i = document.getElementsByTagName("body")[0], "I am the man behind the curtain." === i.firstChild.nodeValue.trim() && i.removeChild(i.firstChild)
            } catch (t) {}
            e.once("DocumentLoadFinished", function () {
                u = e.zOrder, e.zOrder = c
            }), s.on("application.fontchanged", function (e, n, i) {
                r.rpc.postMessage("default.setBodyFont", {
                    fontStyle: n,
                    fontSize: i
                })
            }), s.on("application.systemLanguageChange", function () {
                r.rpc.postMessage("default.updateBaseDirection")
            })
        }

        function a() {
            var e, n;
            e = s.getSystemFontSize(), n = s.getSystemFontFamily(), r.rpc.postMessage("default.setBodyFont", {
                fontStyle: n,
                fontSize: e
            })
        }

        function o() {
            r && p > 0 && 0 === --p && r.zOrder !== c && (u = parseInt(r.zOrder, 10), r.zOrder = c)
        }

        function l() {
            r && (p += 1, r.zOrder = u)
        }
        var s, r, d, p = 0,
            u = 0,
            c = -10;
        d = {
            renderOn: t,
            setDefaultFont: a,
            hideRenderingWebView: o,
            showRenderingWebView: l
        }, i.exports = d
    }), define("core/plugins/childwebviewcontrols/api", ["require", "exports", "module", "./../../lib/events"], function (e, n, i) {
        function t() {
            return S = !0, f.rpc.postMessage("childwebviewcontrols.show")
        }

        function a() {
            return S = !1, f.rpc.postMessage("childwebviewcontrols.hide")
        }

        function o(e) {
            return f.rpc.postMessage("childwebviewcontrols.setTitle", e)
        }

        function l() {
            w = window.screen.height > window.screen.width ? b.portrait : b.landscape
        }

        function s(e) {
            y = window.wp.createWebView({
                processId: v
            }, function () {
                y.zOrder = -10, y.backgroundColor = 4294967295, l(), y.setGeometry(0, screen.height, screen.width, screen.height - w), y.visible = !0, C = !0, y.allowWebEvent("DialogRequested"), y.on("PropertyTitleEvent", function (e, n) {
                    k = n, S && o(k)
                }), y.zOrder = 1, y.on("Destroyed", function () {
                    k = "", C = !1, a(), y.delete(function () {
                        y = null, wp.ui.default.hideRenderingWebView()
                    })
                }), wp.ui.default.showRenderingWebView(), x.on("application.rotateDone", function () {
                    l(), y.setGeometry(0, w, screen.width, screen.height - w), y.animateWindowLocation("Linear", 0, 0, screen.height, 0, w, function () {
                        y.active = !0
                    }, 650)
                }), setTimeout(function () {
                    t(), o(k), y.animateWindowLocation("Linear", .25, screen.width, w, 0, w, function () {
                        y.active = !0
                    }, 650)
                }, 250), e && "function" == typeof e && e()
            })
        }

        function r() {
            qnx.callExtensionMethod("webview.goBack", y.id)
        }

        function d() {
            y && (y.visible = !1, y.destroy())
        }

        function p(e, n) {
            var i = function () {
                "function" == typeof n && n()
            };
            C ? (y.url = e, i()) : s(function () {
                T.emit(M, [{
                    webviewId: v,
                    "return": !0
                }, y], !0), y.url = e, i()
            })
        }

        function u(e, n) {
            g = function (e, n) {
                var i = JSON.parse(n);
                p(i.url), e.returnValue = JSON.stringify({
                    setView: "" + y.id
                })
            }, v = e.processId, n ? e.on("OpenWindow", g) : e.on("ChildWindowOpen", g)
        }

        function c(e) {
            e.un("OpenWindow", g), e.un("ChildWindowOpen", g)
        }

        function m(e) {
            f = e, x = wp.getApplication(), b = 720 === window.screen.height && 720 === window.screen.width ? E.nSeries : 1280 === window.screen.height && 720 === window.screen.width || 720 === window.screen.height && 1280 === window.screen.width ? E.aSeries : E.lSeries, f.rpc.on("childwebviewcontrols.back", function () {
                r()
            }), f.rpc.on("childwebviewcontrols.destroy", function () {
                d()
            })
        }
        var h, v, f, y, g, w, b, x, T = e("./../../lib/events"),
            M = "ChildWebViewCreated",
            k = "",
            S = !1,
            C = !1,
            E = {
                lSeries: {
                    portrait: "111",
                    landscape: "101"
                },
                nSeries: {
                    portrait: "93",
                    landscape: "93"
                },
                aSeries: {
                    portrait: "93",
                    landscape: "84"
                }
            };
        h = {
            renderOn: m,
            open: p,
            destroy: d,
            subscribeTo: u,
            unsubscribeTo: c,
            getChildWebView: function () {
                return y
            }
        }, i.exports = h
    }), define("core/plugins/dialog/api", ["require", "exports", "module", "./../../../wp2/lib/utils"], function (e, n, i) {
        function t(e, n) {
            v ? f.push({
                description: e,
                callback: n
            }) : (v = !0, h = n, wp.ui.default.showRenderingWebView(), c.rpc.postMessage("dialog.show", e))
        }

        function a(e) {
            var n, i, a = 1,
                o = e.waitHandle;
            "function" == typeof h && ("CustomAsk" === e.dialogType ? h(e.buttonIndex, e) : h(e)), i = wp.getWebViewById(e.webviewId) || wp.getWebViewById(1), o && (e && e.ok || e.oktext ? i.dialogResponse(o, e.oktext, e.username, e.password) : e && e.cancel ? i.dialogResponse(o, "") : i.dialogResponse(o, !0)), v = !1, f.length > 0 ? (n = f.shift(), t(n.description, n.callback)) : wp.core.events.emit(a, "dialog.hide", [i.id]), wp.ui.default.hideRenderingWebView()
        }

        function o(e) {
            m = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e, e = m, e.on("DialogRequested", g.DialogRequested = function (e, n) {
                var i = JSON.parse(n),
                    a = {};
                switch (i.webviewId = e.webviewId ? e.webviewId : null, i.dialogType) {
                    case w:
                    case b:
                        return;
                    case x:
                    case T:
                    case M:
                        m.dialogResponse(i.waitHandle, !0);
                        break;
                    case k:
                        m.dialogResponse(i.waitHandle, !0), wp.core.events.emit("application.mediaError", [n]);
                        break;
                    default:
                        i.hasOwnProperty("waitHandle") && (t(i), a.setWait = !0)
                }
                a.setPreventDefault = !0, e.returnValue = JSON.stringify(a)
            }), e.on("SSLHandshakingFailed", g.SSLHandshakingFailed = function (n, i) {
                var a = JSON.parse(i),
                    o = a.url,
                    l = {
                        dialogType: "SSLCertificateException",
                        url: o,
                        webviewId: n.webviewId ? n.webviewId : null
                    };
                t(l, function (n) {
                    n.ok ? e.continueSSLHandshaking(a.streamId, "SSLActionTrust") : e.continueSSLHandshaking(a.streamId, "SSLActionReject")
                })
            }), e.on("GeolocationPermissionRequest", g.GeolocationPermissionRequest = function (n, i) {
                var a = JSON.parse(i),
                    o = {
                        dialogType: "GeolocationPermission",
                        url: a.origin,
                        waitHandle: n.waitHandle,
                        webviewId: n.webviewId ? n.webviewId : null
                    },
                    l = {
                        target: "sys.settings.card",
                        uri: "settings://location"
                    },
                    s = function () {
                        e.reload(), wp.core.invocation.un("childCardClosed", s)
                    };
                a.showGlobalPermissionRequest ? t(o, function (n) {
                    n.ok ? (wp.core.invocation.on("childCardClosed", s), wp.core.invocation.invoke(l), e.allowGeolocation(a.origin)) : e.disallowGeolocation(a.origin)
                }) : e.allowGeolocation(a.origin), n.returnValue = '{"setPreventDefault": true}'
            }), e.on("UserMediaRequest", g.UserMediaRequest = function (n, i) {
                function a(e) {
                    return "CAMERA_UNIT_FRONT" === e ? p.translate("Front").fetch() : p.translate("Rear").fetch()
                }
                var o, l, s = JSON.parse(i),
                    r = [];
                if (s.cameras && 0 !== s.cameras.length) {
                    if (1 === s.cameras.length) e.allowUserMedia(s.id, s.cameras[0]);
                    else {
                        for (l = 0; s.cameras.length > l; l++) r[l] = a(s.cameras[l]);
                        o = {
                            dialogType: "CameraSelection",
                            title: p.translate("Camera Selection").fetch(),
                            cameras: r,
                            webviewId: n.webviewId ? n.webviewId : null
                        }
                    }
                    t(o, function (n) {
                        n.ok && e.allowUserMedia(s.id, s.cameras[n.cameraSelectedIndex])
                    })
                }
            })
        }

        function l(e) {
            m = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e, e.un("DialogRequested", g.DialogRequested), e.un("SSLHandshakingFailed", g.SSLHandshakingFailed), e.un("GeolocationPermissionRequest", g.GeolocationPermissionRequest), e.un("UserMediaRequest", g.UserMediaRequest)
        }

        function s(e) {
            c = e, p = y.i18n(), v = !1, f = [], c.rpc.un("dialog.response", g.dialogResult), c.rpc.on("dialog.response", g.dialogResult = function (e, n) {
                a(n)
            })
        }

        function r() {
            return !!v
        }

        function d() {
            return c
        }
        var p, u, c, m, h, v, f, y = e("./../../../wp2/lib/utils"),
            g = {},
            w = "AuthenticationChallenge",
            b = "SaveCredential",
            x = "InsecureSubresourceLoadPolicyConfirm",
            T = "DatabaseQuotaExceeded",
            M = "WebFileSystemQuotaExceeded",
            k = "MediaError";
        u = {
            show: t,
            subscribeTo: o,
            unsubscribeTo: l,
            result: a,
            renderOn: s,
            isShowingDialog: r,
            getRenderingWebView: d
        }, i.exports = u
    }), define("core/plugins/invocationlist/api", ["require", "exports", "module", "../../lib/events", "../../../wp2/lib/menuService", "../../../wp2/lib/utils"], function (e, n, i) {
        function t(e) {
            s = e, r = wp.core.invocation
        }

        function a(e, n, i, t) {
            var a, o, l, s = wp.getApplication().getEnv("HOME") + "";
            d = i, o = function (e) {
                e && "function" == typeof t ? t(e) : i()
            }, c.isLocalUrl(e.uri) && (e.uri = "file:///" + s.replace(/^\/*/, "") + "/../app/native/" + e.uri.replace(/local:\/\/\//, "")), u.getMenuItems(e, function (e, n, i) {
                var t = {};
                if (i) console.log(i);
                else
                    for (a = n && n.hasOwnProperty("items") ? n.items : [], l = 0; a.length > l; l++) "uri" in e ? t.uri = e.uri : "uri" in n["inherited-target"] && (t.uri = n["inherited-target"].uri), "mime" in n["inherited-target"] && (t.mime = n["inherited-target"].mime), "data" in n["inherited-target"] && (t.data = n["inherited-target"].data), "action" in a[l] && (t.action = a[l].action), "icon" in a[l] && (t.icon = a[l].icon), "label" in a[l] && (t.label = a[l].label), "invoke" in a[l] && ("data" in a[l].invoke && !t.data && (t.data = a[l].invoke.data), t.type = a[l].invoke.mime, "metadata" in a[l].invoke && (t.metadata = a[l].invoke.metadata), "target" in a[l].invoke && (t.target = a[l].invoke.target), "uri" in a[l].invoke && (t.uri = a[l].invoke.uri)), r.invoke(t, o)
            })
        }

        function o() {
            r.closeChildCard(), p.emit("invocationlist.hide", [s.id])
        }
        var l, s, r, d, p = e("../../lib/events"),
            u = e("../../../wp2/lib/menuService"),
            c = e("../../../wp2/lib/utils");
        l = {
            show: a,
            hide: o,
            renderOn: t
        }, i.exports = l
    }), define("core/plugins/formcontrol/api", ["require", "exports", "module"], function (e, n, i) {
        function t() {
            u.rpc.postMessage("formcontrol.init"), h.enable = !1, m = !0
        }

        function a() {
            m && u.rpc.postMessage("formcontrol.update", h)
        }

        function o(e) {
            var n = wp.getApplication();
            u = e, m || t(), u.rpc.on("formcontrol.sensitivity", function (e, n) {
                u.sensitivity = n
            }), u.rpc.on("formcontrol.action", function (e, n) {
                c && -1 !== f.indexOf(n) && qnx.callExtensionMethod("webview." + n, c.id)
            }), u.rpc.on("formcontrol.hidden", function () {
                h.enable && (h.enable = !1, wp.ui.default.hideRenderingWebView())
            }), n.on("application.keyboardPosition", function (e) {
                u.rpc.postMessage("formcontrol.updateVerticalPosition", e)
            }), n.on("application.keyboardClosing", function () {
                h.enable && u.rpc.postMessage("formcontrol.hide")
            })
        }

        function l(e, n) {
            h.enable = !0, h.previousEnabled = e, h.nextEnabled = n, a()
        }

        function s() {
            h.enable = !1, a()
        }

        function r(e) {
            c = e, e.on("FormControlEvent", v.FormControlEvent = function (e, n) {
                n = JSON.parse(n), h.enable === !1 && n.isVisible === !0 && setTimeout(wp.ui.default.showRenderingWebView, 300), h.enable = n.isVisible, h.previousEnabled = n.isPreviousActive, h.nextEnabled = n.isNextActive, u.rpc.postMessage("formcontrol.update", h)
            })
        }

        function d(e) {
            c = e, e.un("FormControlEvent", v.FormControlEvent)
        }

        function s() {
            u.rpc.postMessage("formcontrol.hide")
        }
        var p, u, c, m, h = {},
            v = {},
            f = ["focusPreviousField", "focusNextField", "submitForm"];
        p = {
            renderOn: o,
            subscribeTo: r,
            unsubscribeTo: d,
            show: l,
            hide: s
        }, i.exports = p
    }), define("core/lib/ui.js", ["require", "exports", "module", "../plugins/toast/api", "../plugins/default/api", "../plugins/childwebviewcontrols/api", "../plugins/dialog/api", "../plugins/contextmenu/api", "../plugins/invocationlist/api", "../plugins/formcontrol/api"], function (e, n, i) {
        function t(e, n, i) {
            var t, o;
            i = i || {}, e.rpc.enable = !0, n.rpc.enable = !0;
            for (o in a) i.exclude && i.exclude.indexOf(o) > -1 || (t = a[o], t.renderOn(e), "function" == typeof t.subscribeTo && t.subscribeTo(n))
        }
        var a = {
            toast: e("../plugins/toast/api"),
            "default": e("../plugins/default/api"),
            childwebviewcontrols: e("../plugins/childwebviewcontrols/api"),
            dialog: e("../plugins/dialog/api"),
            contextmenu: e("../plugins/contextmenu/api"),
            invocationlist: e("../plugins/invocationlist/api"),
            formcontrol: e("../plugins/formcontrol/api")
        };
        i.exports = {
            "default": a.default,
            toast: a.toast,
            childwebviewcontrols: a.childwebviewcontrols,
            dialog: a.dialog,
            contextmenu: a.contextmenu,
            invocationlist: a.invocationlist,
            formcontrol: a.formcontrol,
            init: t
        }
    }), define("wp1/lib/main", ["require", "exports", "module", "../../core/lib/webviewManager", "./WebView", "../../wp2/lib/defaultHandlers/InvokeRequestEvent", "../../wp2/lib/defaultHandlers/onChooseFile", "../../wp2/lib/defaultHandlers/onOpenWindow", "../../dependencies/URI.js/src/URI", "../../core/lib/WebView", "../../wp2/lib/Application", "../../wp2/lib/device", "../../core/lib/chrome", "../../core/lib/chrome/internal", "../../core/lib/pps/ppsUtils", "../../wp2/lib/utils", "../../wp2/lib/notification", "../../core/lib/core.js", "../../core/lib/ui.js"], function (e) {
        var n, i, t, a = e("../../core/lib/webviewManager"),
            o = e("./WebView");
        n = e("../../wp2/lib/defaultHandlers/InvokeRequestEvent"), i = e("../../wp2/lib/defaultHandlers/onChooseFile"), t = e("../../wp2/lib/defaultHandlers/onOpenWindow"), window.URI = e("../../dependencies/URI.js/src/URI"), window.qnx.webplatform = function () {
            function n(e, n) {
                window.chrome.internal[e] ? (l = {}, Object.getOwnPropertyNames(n).forEach(function (i) {
                    l[i] = window.chrome.internal[e][i], window.chrome.internal[e][i] = function () {
                        n[i].apply(this, arguments), l[i] && l[i].apply(this, arguments)
                    }
                })) : window.chrome.internal[e] = n
            }
            var i, t, l, s, r, d = e("../../core/lib/WebView"),
                p = e("../../wp2/lib/Application"),
                u = e("../../wp2/lib/device"),
                c = e("../../core/lib/chrome"),
                m = e("../../core/lib/chrome/internal"),
                h = e("../../core/lib/pps/ppsUtils"),
                v = e("../../wp2/lib/utils"),
                f = e("../../wp2/lib/notification");
            return i = new d({
                WebViewId: c.id
            }), i.autoDeferNetworkingAndJavaScript = !1, a.webViews.push(i), t = new p, window.chrome || (window.chrome = {}), window.chrome.internal || (window.chrome.internal = {}), n("webEvent", m.webEvent), n("invocation", m.invocation), n("application", m.application), n("windowAnimations", m.windowAnimations), n("pps", m.pps), n("webDriver", m.webDriver), r = {
                getController: function () {
                    return i
                },
                getApplication: function () {
                    return t
                },
                notification: f,
                nativeCall: function () {
                    return qnx.callExtensionMethod.apply(qnx, Array.prototype.slice.apply(arguments))
                },
                device: u,
                pps: h,
                core: e("../../core/lib/core.js"),
                ui: e("../../core/lib/ui.js")
            }, r = v.mixin(a, r), r.createUIWebView = function (e, n) {
                var i, t, a, o = {
                    contextmenu: r.ui.contextmenu.subscribeTo,
                    dialog: r.ui.dialog.subscribeTo,
                    childwebviewcontrols: r.ui.childwebviewcontrols.subscribeTo,
                    formcontrol: r.ui.formcontrol.subscribeTo,
                    "default": r.ui.default.subscribeTo
                };
                i = r.createWebView(e, n), i = v.mixin(r.ui, i), i.contextMenu = i.contextmenu, r.ui.default.renderOn(i), r.ui.invocationlist.renderOn(i), r.ui.toast.renderOn(i), a = function (e, n) {
                    i.rpc.enable || (i.rpc.enable = !0), r.ui[e].renderOn(i), n = "function" == typeof n.getWebViewObj ? n.getWebViewObj() : n, o[e](n)
                };
                for (t in o) i[t].subscribeTo = a.bind(this, t);
                return i
            }, s = function (e) {
                var n, i = {
                        setFileSystemSandbox: "fileSystemAPISandboxed",
                        active: "isActive",
                        devicePixelRatio: "devicePixelRatio",
                        zOrder: "zOrder",
                        enableCrossSiteXHR: "isEnableCrossSiteXHR",
                        backgroundColor: "backgroundColor",
                        autoDeferNetworkingAndJavaScript: "isAutoDeferNetworkingAndJavaScript",
                        defaultFontSize: "defaultFontSize",
                        fullScreenVideoCapable: "fullScreenVideoCapable",
                        allowAllPropertyChangedEvents: "isAllPropertyChangedEventsEnabled",
                        allowAllWebEvents: "isAllWebEventsEnabled",
                        allowsAnyPropertyChangedEvents: "isAnyPropertyChangedEventsEnabled",
                        allowsAnyWebEvents: "isAnyWebEventsEnabled",
                        javaScriptInterruptTimeout: "javaScriptInterruptTimeout",
                        enableDialogRequestedEvents: "isEnableDialogRequestedEvents",
                        enableJavaScript: "isEnableJavaScript",
                        overScrollColor: "overScrollColor"
                    },
                    t = function (e, n) {
                        return qnx.callExtensionMethod("webview." + e, n)
                    };
                for (n in i) e.__defineGetter__(n, t.bind(e, i[n], e.id))
            }, r.createWebView = function (e, n) {
                var i = a.createWebView(e, n);
                return s(i), i
            }, s(i), r.getWebViews = function () {
                return r.webViews
            }, o.extendPrototype(d), t.invocation = r.core.invocation, t.invocation.addEventListener = r.core.invocation.on, t.invocation.removeEventListener = r.core.invocation.un, t.addEventListener = t.on, t.removeEventListener = t.un, r.device.addEventListener = r.device.on, r.device.removeEventListener = r.device.un, r
        }(), window.wp = window.qnx.webplatform, window.wp.core.events.emit("automation.init", [], !1), a.init()
    }), define("wwe/hook.wp-platform", ["require", "exports", "module"], function () {
        (function () {
            function e(e) {
                var n = wp.getApplication().getEnv("KEYBOARD_THEME");
                "" !== n && (e.keyboardThemeColor = n)
            }

            function n(e) {
                function n(e, n) {
                    n.pointerInteractionMode || n.spatialNavigation || (n.pointerInteractionMode = !0), n.setJoystickSessionSize(720, 717)
                }
                i.on(e, n)
            }
            var i = wp.getController();
            n("webview.initialized"), n("ChildWebViewCreated"), e(wp.webViews[0]), wp.core.events.on("Created", function (n) {
                e(wp.getWebViewById(n.webviewId))
            })
        })()
    }), require(["wp1/lib/main", "./wwe/hook.wp-platform"])
})();
