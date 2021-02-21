(function(modules) {
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];
        var moreModules = data[1];
        var executeModules = data[2];
        var moduleId, chunkId, i = 0, resolves = [];
        for (;i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
        deferredModules.push.apply(deferredModules, executeModules || []);
        return checkDeferredModules();
    }
    function checkDeferredModules() {
        var result;
        for (var i = 0; i < deferredModules.length; i++) {
            var deferredModule = deferredModules[i];
            var fulfilled = true;
            for (var j = 1; j < deferredModule.length; j++) {
                var depId = deferredModule[j];
                if (installedChunks[depId] !== 0) fulfilled = false;
            }
            if (fulfilled) {
                deferredModules.splice(i--, 1);
                result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
            }
        }
        return result;
    }
    var installedModules = {};
    var installedChunks = {
        1: 0
    };
    var deferredModules = [];
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.r = function(exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    };
    __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value
        });
        if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;
    deferredModules.push([ 355, 0 ]);
    return checkDeferredModules();
})({
    0: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, "d", function() {
            return getStorageData;
        });
        __webpack_require__.d(__webpack_exports__, "f", function() {
            return setStorageData;
        });
        __webpack_require__.d(__webpack_exports__, "e", function() {
            return sendContentMessage;
        });
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return findMentions;
        });
        __webpack_require__.d(__webpack_exports__, "c", function() {
            return getCommentText;
        });
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return findSuggestedUsers;
        });
        var getStorageData = function getStorageData(keys) {
            var promise = new Promise(function(resolve, reject) {
                chrome.storage.local.get(keys, function(items) {
                    if (chrome.runtime.lastError) {
                        reject(new Error("Error in storage.get: ".concat(chrome.runtime.lastError)));
                    } else {
                        resolve(items);
                    }
                });
            });
            return promise;
        };
        var setStorageData = function setStorageData(items) {
            chrome.storage.local.set(items);
        };
        var sendContentMessage = function sendContentMessage(params) {
            var promise = new Promise(function(resolve) {
                chrome.runtime.sendMessage(params, function(response) {
                    resolve(response);
                });
            });
            return promise;
        };
        var sendBackgroundMessage = function sendBackgroundMessage(tabId, params) {
            var promise = new Promise(function(resolve) {
                chrome.tabs.sendMessage(tabId, params, function(response) {
                    resolve(response);
                });
            });
            return promise;
        };
        var findMentions = function findMentions(str) {
            var userRegex = new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)");
            var result = [];
            function next() {
                var arrMatch = str.match(userRegex);
                if (!arrMatch) {
                    result.push(str);
                    return result;
                }
                result.push(str.slice(0, arrMatch.index));
                result.push(arrMatch[0]);
                str = str.slice(arrMatch.index + arrMatch[0].length);
                return next();
            }
            return next();
        };
        var getCommentText = function getCommentText(input, mentionedUsers) {
            var text;
            if (mentionedUsers.length > 0) {
                var html = [];
                input.innerHTML.split("&nbsp;").join("").split("<span>").join("").split("</span>").join("").split("<br>").join("").split("<div>").join("\n").split("</div>").join("").split("<input ").forEach(function(item) {
                    item.trim().split('">').forEach(function(element) {
                        html.push(element);
                    });
                });
                html.forEach(function(item, i) {
                    mentionedUsers.forEach(function(user) {
                        var nameRegex = new RegExp("".concat(user.username), "i");
                        var nameMatch = item.match(nameRegex);
                        if (nameMatch) {
                            html[i] = user.username;
                        }
                    });
                });
                text = html.join("");
                var result = "";
                mentionedUsers.forEach(function(user) {
                    var nameRegex = new RegExp("".concat(user.username), "i");
                    var nameMatch = text.match(nameRegex);
                    if (nameMatch !== null) {
                        result += "".concat(text.slice(0, nameMatch.index), " [").concat(user.username, "](evry://user/").concat(user._id, ") ");
                        text = text.slice(nameMatch.index + user.username.length);
                    }
                });
                text = (result + text).trim();
            } else {
                text = input.innerText.trim();
            }
            return text;
        };
        var findSuggestedUsers = function findSuggestedUsers(str) {
            var userRegex = new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)");
            var result = [];
            function next() {
                var arrMatch = str.match(userRegex);
                if (!arrMatch) {
                    return result;
                }
                var userString = str.slice(arrMatch.index, arrMatch.index + arrMatch[0].length);
                var username = userString.split("]")[0];
                var _id = userString.split("/")[3];
                result.push({
                    username: username.slice(1),
                    _id: _id.slice(0, _id.length - 1)
                });
                str = str.slice(arrMatch.index + arrMatch[0].length);
                return next();
            }
            return next();
        };
    },
    10: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        var lodash_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
        var lodash_assign__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(lodash_assign__WEBPACK_IMPORTED_MODULE_0__);
        var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
        var menuStatePlugin = function menuStatePlugin(store) {
            store.subscribe(function(mutation, state) {
                console.log(mutation, state);
            });
        };
        __webpack_exports__["a"] = {
            state: {
                user: null,
                showMenu: null,
                currentSection: "Comments",
                previousSection: null,
                resource: null,
                comments: {},
                resources: [],
                following: [],
                followers: [],
                friends: [],
                bookmarks: [],
                events: [],
                otherUser: null,
                filterId: null,
                eventCommentInfo: {},
                currentUrl: null,
                freshEvents: null,
                pushNotifications: null,
                stealthMode: null,
                screenButtonShown: true,
                activitiesComments: null,
                activitiesResources: null,
                activityFilterPeriod: {},
                coins: 0,
                onboarding: null,
                onboardingSection: "Welcome"
            },
            getters: {
                commentsCount: function commentsCount(state) {
                    return Object.keys(state.comments).length;
                }
            },
            mutations: {
                set: function set(state, data) {
                    lodash_assign__WEBPACK_IMPORTED_MODULE_0___default()(state, data);
                }
            },
            actions: {
                getUser: function getUser(_ref) {
                    var commit = _ref.commit;
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "auth",
                        action: "get-user"
                    }).then(function(user) {
                        commit("set", {
                            user: user
                        });
                    });
                },
                logout: function logout(_ref2) {
                    var commit = _ref2.commit;
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "auth",
                        action: "logout"
                    }).then(function() {
                        var user = null;
                        commit("set", {
                            user: user
                        });
                    });
                },
                getSections: function getSections() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-sections"
                    });
                },
                getOnboardingSections: function getOnboardingSections() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-onboarding-section"
                    });
                },
                getOnboarding: function getOnboarding() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-onboarding"
                    });
                },
                getShowMenu: function getShowMenu() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-showMenu"
                    });
                },
                getPushNotifications: function getPushNotifications() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-pushNotifications"
                    });
                },
                getStealthMode: function getStealthMode() {
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "state",
                        action: "get-stealthMode"
                    });
                },
                getCoins: function getCoins(_ref3) {
                    var commit = _ref3.commit;
                    return Object(_common__WEBPACK_IMPORTED_MODULE_1__["e"])({
                        module: "coins",
                        action: "get-coins"
                    }).then(function(coins) {
                        commit("set", {
                            coins: coins
                        });
                    });
                }
            },
            plugins: [ menuStatePlugin ]
        };
    },
    18: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "API_URL", function() {
            return API_URL;
        });
        var API_URL = "https://api.fdvr.co/";
    },
    217: function(module, exports) {
        module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkZGMjU3QUE1OTI4MTFFOUI3MUNGNUU5QTZGNDYyOEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkZGMjU3QUI1OTI4MTFFOUI3MUNGNUU5QTZGNDYyOEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RkYyNTdBODU5MjgxMUU5QjcxQ0Y1RTlBNkY0NjI4RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RkYyNTdBOTU5MjgxMUU5QjcxQ0Y1RTlBNkY0NjI4RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhZETS4AAVT2SURBVHja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";
    },
    3: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, "j", function() {
            return RESOURCES_URL_V4;
        });
        __webpack_require__.d(__webpack_exports__, "d", function() {
            return COMMENTS_URL_V4;
        });
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return AUTH_URL;
        });
        __webpack_require__.d(__webpack_exports__, "m", function() {
            return USERS_URL_V4;
        });
        __webpack_require__.d(__webpack_exports__, "h", function() {
            return REACTIONS_URL_V4;
        });
        __webpack_require__.d(__webpack_exports__, "i", function() {
            return RESOURCES_URL_V2;
        });
        __webpack_require__.d(__webpack_exports__, "l", function() {
            return USERS_URL_V2;
        });
        __webpack_require__.d(__webpack_exports__, "c", function() {
            return BOOKMARKS_URL_V2;
        });
        __webpack_require__.d(__webpack_exports__, "e", function() {
            return EVENTS_URL_V4;
        });
        __webpack_require__.d(__webpack_exports__, "g", function() {
            return NOTIFICATIONS_URL_V2;
        });
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return API_URL_SLEEP_MONEY;
        });
        __webpack_require__.d(__webpack_exports__, "k", function() {
            return SENDERS_ID;
        });
        __webpack_require__.d(__webpack_exports__, "f", function() {
            return FD_SEARCH_URL;
        });
        var _require = __webpack_require__(18), API_URL = _require.API_URL;
        var API_URL_V2 = "".concat(API_URL, "v2/");
        var API_URL_V4 = "".concat(API_URL, "v4/");
        var API_URL_SLEEP_MONEY = "".concat(API_URL, "sleep-money/");
        var AUTH_URL = API_URL === "https://api-staging.fulldive.com/" ? "".concat(API_URL_V2, "auth/") : "https://api.fulldive.com/v2/auth/";
        var REACTIONS_URL_V4 = "".concat(API_URL_V4, "reactions/resources");
        var RESOURCES_URL_V4 = "".concat(API_URL_V4, "resources");
        var COMMENTS_URL_V4 = "".concat(API_URL_V4, "comments");
        var USERS_URL_V4 = "".concat(API_URL_V4, "users");
        var USERS_URL_V2 = "".concat(API_URL_V2, "users");
        var RESOURCES_URL_V2 = "".concat(API_URL_V2, "resources");
        var BOOKMARKS_URL_V2 = "".concat(API_URL_V2, "bookmarks");
        var EVENTS_URL_V4 = "".concat(API_URL_V4, "events");
        var NOTIFICATIONS_URL_V2 = "".concat(API_URL_V2, "notifications");
        var SENDERS_ID = API_URL === "https://api-staging.fulldive.com/" ? "20840289600" : "254410647594";
        var FD_SEARCH_URL = "http://localhost:8080/";
    },
    355: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var each = __webpack_require__(8);
        var each_default = __webpack_require__.n(each);
        var constants = __webpack_require__(3);
        var common = __webpack_require__(0);
        var merge = __webpack_require__(216);
        var merge_default = __webpack_require__.n(merge);
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var module_Module = function() {
            function Module(_ref) {
                var name = _ref.name;
                _classCallCheck(this, Module);
                if (!name) {
                    throw new TypeError("Name argument is undefined.");
                }
                this.name = name;
                this.setEvents();
                this.state = {};
            }
            _createClass(Module, [ {
                key: "setEvents",
                value: function setEvents() {
                    var _this = this;
                    chrome.runtime.onMessage.addListener(function(_ref2, sender, sendResponse) {
                        var module = _ref2.module, action = _ref2.action, data = _ref2.data;
                        if (!sender.tab || module !== _this.name || typeof _this[action] !== "function") {
                            return false;
                        }
                        _this[action]({
                            data: data,
                            sender: sender,
                            sendResponse: sendResponse
                        });
                        return true;
                    });
                    chrome.tabs.onRemoved.addListener(function(tabId) {
                        delete _this.state[tabId];
                    });
                }
            } ], [ {
                key: "updateStore",
                value: function updateStore(ids, data) {
                    var message = {
                        action: "updateStore",
                        data: data
                    };
                    chrome.tabs.query({}, function(tabs) {
                        each_default()(tabs, function(tab) {
                            if (ids) {
                                return each_default()(ids, function(id) {
                                    chrome.tabs.sendMessage(id, message);
                                });
                            }
                            return chrome.tabs.sendMessage(tab.id, message);
                        });
                    });
                }
            }, {
                key: "fetch",
                value: function(_fetch) {
                    function fetch(_x) {
                        return _fetch.apply(this, arguments);
                    }
                    fetch.toString = function() {
                        return _fetch.toString();
                    };
                    return fetch;
                }(function(url) {
                    var _this2 = this;
                    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var headers = {
                        Authorization: "Bearer ".concat(window.auth.data.authToken)
                    };
                    return fetch(url, merge_default()(options, {
                        headers: headers
                    })).then(function(response) {
                        if (response.status === 404) {
                            return null;
                        }
                        if (response.status === 204) {
                            return null;
                        }
                        var activityFilterPeriod = {
                            earliest: response.headers.get("x-earliest-ts"),
                            latest: response.headers.get("x-latest-ts")
                        };
                        if (activityFilterPeriod.earliest) {
                            _this2.updateStore(null, {
                                activityFilterPeriod: activityFilterPeriod
                            });
                        }
                        var data = response.json();
                        return data;
                    });
                })
            }, {
                key: "setBadge",
                value: function setBadge(freshEvents) {
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: "#ff9900"
                    });
                    chrome.browserAction.setBadgeText({
                        text: "".concat(freshEvents)
                    });
                }
            } ]);
            return Module;
        }();
        function auth_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function auth_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function auth_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) auth_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) auth_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var auth_Auth = function() {
            function Auth() {
                auth_classCallCheck(this, Auth);
                this.data = {};
                this.setEvents();
                this.init();
            }
            auth_createClass(Auth, [ {
                key: "init",
                value: function init() {
                    var _this = this;
                    return Object(common["d"])([ "auth.data" ]).then(function(items) {
                        if (!items["auth.data"]) {
                            return false;
                        }
                        _this.data = items["auth.data"];
                        return _this.getUserInfo();
                    }).then(function(user) {
                        _this.data.user = user;
                        Auth.updateStore(null, {
                            user: _this.data.user
                        });
                    });
                }
            }, {
                key: "setEvents",
                value: function setEvents() {
                    var _this2 = this;
                    chrome.runtime.onMessage.addListener(function(_ref, sender, sendResponse) {
                        var module = _ref.module, action = _ref.action, data = _ref.data;
                        if (!sender.tab || module !== "auth" || typeof _this2[action] !== "function") {
                            return false;
                        }
                        _this2[action]({
                            data: data,
                            sender: sender,
                            sendResponse: sendResponse
                        });
                        return true;
                    });
                    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
                        _this2.checkAuthPage(tabId, changeInfo);
                    });
                }
            }, {
                key: "checkAuthPage",
                value: function checkAuthPage(tabId, _ref2) {
                    var _this3 = this;
                    var url = _ref2.url;
                    if (!url || url && url.indexOf("".concat(constants["b"], "result?success")) === -1) {
                        return false;
                    }
                    chrome.tabs.remove(tabId);
                    var authToken = new URL(url).searchParams.get("success");
                    this.data = {
                        authToken: authToken,
                        uid: Auth.parseJWT(authToken).id
                    };
                    Object(common["f"])({
                        "auth.data": this.data
                    });
                    return this.getUserInfo().then(function(user) {
                        _this3.data.user = user;
                        Auth.updateStore(null, {
                            user: _this3.data.user
                        });
                    });
                }
            }, {
                key: "getUserInfo",
                value: function getUserInfo() {
                    return fetch("".concat(constants["l"], "/me"), {
                        headers: {
                            Authorization: "Bearer ".concat(this.data.authToken)
                        }
                    }).then(function(response) {
                        if (response.status === 404) {
                            return null;
                        }
                        return response.json();
                    });
                }
            }, {
                key: "get-user",
                value: function getUser(_ref3) {
                    var sendResponse = _ref3.sendResponse;
                    sendResponse(this.data.authToken && this.data.user);
                }
            }, {
                key: "logout",
                value: function logout() {
                    window.auth.data.authToken = null;
                    this.data.authToken = null;
                    this.data.user = null;
                    Object(common["f"])({
                        "auth.data": null
                    });
                    Auth.updateStore(null, {
                        user: this.data.user
                    });
                    Auth.updateStore(null, {
                        freshEvents: null
                    });
                    module_Module.setBadge("");
                }
            } ], [ {
                key: "parseJWT",
                value: function parseJWT(token) {
                    if (!token) {
                        return false;
                    }
                    return JSON.parse(window.atob(token.split(".")[1].replace("-", "+").replace("_", "/")));
                }
            }, {
                key: "openAuthPage",
                value: function openAuthPage(_ref4) {
                    var data = _ref4.data;
                    chrome.tabs.create({
                        url: "".concat(constants["b"]).concat(data.name)
                    });
                }
            }, {
                key: "updateStore",
                value: function updateStore(ids, data) {
                    var message = {
                        action: "updateStore",
                        data: data
                    };
                    if (ids) {
                        each_default()(ids, function(id) {
                            chrome.tabs.sendMessage(id, message);
                        });
                    }
                    chrome.tabs.query({}, function(tabs) {
                        each_default()(tabs, function(tab) {
                            chrome.tabs.sendMessage(tab.id, message);
                        });
                    });
                }
            } ]);
            return Auth;
        }();
        function _typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return _typeof(obj);
        }
        function _toConsumableArray(arr) {
            return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
        }
        function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
        function _iterableToArray(iter) {
            if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
        }
        function _arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        }
        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }
        function resources_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function resources_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function resources_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) resources_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) resources_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }
        function _setPrototypeOf(o, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return _setPrototypeOf(o, p);
        }
        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return _possibleConstructorReturn(this, result);
            };
        }
        function _possibleConstructorReturn(self, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return _assertThisInitialized(self);
        }
        function _assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function _isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return _getPrototypeOf(o);
        }
        var resources_Resources = function(_Module) {
            _inherits(Resources, _Module);
            var _super = _createSuper(Resources);
            function Resources() {
                resources_classCallCheck(this, Resources);
                return _super.apply(this, arguments);
            }
            resources_createClass(Resources, [ {
                key: "send-stop-watch",
                value: function sendStopWatch(_ref) {
                    var sender = _ref.sender, data = _ref.data, sendResponse = _ref.sendResponse;
                    return Resources.getResource(data.url).then(function(responseData) {
                        if (responseData.resource === null) {
                            return Resources.createResource({
                                data: data
                            }).then(function() {
                                Resources.getResource(data.url).then(function(responseData) {
                                    Resources.updateStore([ sender.tab.id ], responseData);
                                    chrome.storage.local.get("stealth", function(result) {
                                        if (result.stealth) {
                                            return sendResponse(responseData.resource.id);
                                        }
                                        Resources.sendStopWatch(responseData.resource.id, {
                                            data: data
                                        });
                                        return sendResponse(responseData.resource.id);
                                    });
                                });
                            });
                        }
                        return Resources.updateResource({
                            data: data,
                            responseData: responseData
                        }).then(function() {
                            Resources.getResource(data.url).then(function(responseData) {
                                Resources.updateStore([ sender.tab.id ], responseData);
                                Resources.sendStopWatch(responseData.resource.id, {
                                    data: data
                                });
                                return sendResponse(responseData.resource.id);
                            });
                        });
                    })["catch"](function(error) {
                        var responseData = {
                            resource: null
                        };
                        Resources.updateStore([ sender.tab.id ], responseData);
                        console.log(error);
                        return sendResponse(false);
                    });
                }
            }, {
                key: "get-resources-reacted-by-user",
                value: function getResourcesReactedByUser(_ref2) {
                    var data = _ref2.data, sendResponse = _ref2.sendResponse, sender = _ref2.sender;
                    return Resources.getResourcesReactedBy({
                        data: data
                    }).then(function(responseData) {
                        Resources.updateStore([ sender.tab.id ], responseData);
                        return sendResponse(responseData.resources.length);
                    })["catch"](function() {
                        var responseData = {
                            resources: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-friends-feed",
                value: function getFriendsFeed(_ref3) {
                    var data = _ref3.data, sendResponse = _ref3.sendResponse, sender = _ref3.sender;
                    return Resources.getFeedRecources({
                        data: data
                    }).then(function(responseData) {
                        Resources.updateStore([ sender.tab.id ], responseData);
                        return sendResponse(responseData.resources.length);
                    })["catch"](function() {
                        var responseData = {
                            resources: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-resources-reacted-by-user-filtered",
                value: function getResourcesReactedByUserFiltered(_ref4) {
                    var data = _ref4.data, sendResponse = _ref4.sendResponse, sender = _ref4.sender;
                    return Resources.getResourcesReactedByFiltered({
                        data: data
                    }).then(function(responseData) {
                        Resources.updateStore([ sender.tab.id ], responseData);
                        return sendResponse(responseData.resources.length);
                    })["catch"](function() {
                        var responseData = {
                            resources: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-resource",
                value: function getResource(_ref5) {
                    var data = _ref5.data, sendResponse = _ref5.sendResponse, sender = _ref5.sender;
                    Resources.getResource(data.url).then(function(responseData) {
                        Resources.updateStore([ sender.tab.id ], responseData);
                        return sendResponse(true);
                    });
                }
            } ], [ {
                key: "createResource",
                value: function createResource(_ref6) {
                    var data = _ref6.data;
                    var title = data.title, description = data.description, previewUrl = data.previewUrl, url = data.url;
                    var body = {
                        title: title,
                        previewUrl: previewUrl,
                        url: url,
                        type: "web",
                        typeData: {
                            contentMeta: {
                                article: {
                                    description: description
                                }
                            }
                        },
                        aliasUrls: []
                    };
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    };
                    return Resources.fetch("".concat(constants["j"], "/"), options);
                }
            }, {
                key: "updateResource",
                value: function updateResource(_ref7) {
                    var data = _ref7.data, responseData = _ref7.responseData;
                    var response = {
                        resource: null
                    };
                    var title = data.title, description = data.description, previewUrl = data.previewUrl, url = data.url;
                    var id = responseData.resource.id;
                    var body = {
                        title: title,
                        previewUrl: previewUrl,
                        url: url,
                        type: "web",
                        typeData: {
                            contentMeta: {
                                article: {
                                    description: description
                                }
                            }
                        },
                        aliasUrls: []
                    };
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    };
                    return Resources.fetch("".concat(constants["j"], "/").concat(id, "/info"), options).then(function(recource) {
                        response.resource = recource;
                        return response;
                    });
                }
            }, {
                key: "sendStopWatch",
                value: function sendStopWatch(id, _ref8) {
                    var data = _ref8.data;
                    var title = data.title, metaTags = data.metaTags, url = data.url;
                    var body = {
                        metaTags: metaTags,
                        title: title,
                        url: url
                    };
                    if (data.previewUrl !== "") {
                        body.icon = data.previewUrl;
                    }
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    };
                    return Resources.fetch("".concat(constants["i"], "/").concat(id, "/stop-watch"), options);
                }
            }, {
                key: "getResourcesReactedBy",
                value: function getResourcesReactedBy(_ref9) {
                    var data = _ref9.data;
                    var userId = data.userId, skip = data.skip, resources = data.resources;
                    var responseData = {
                        resources: resources
                    };
                    return Resources.fetch("".concat(constants["i"], "/reacted-by/").concat(userId, "?skip=").concat(skip)).then(function(newResources) {
                        if (!newResources) {
                            return null;
                        }
                        responseData.resources = [].concat(_toConsumableArray(responseData.resources), _toConsumableArray(newResources));
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getFeedRecources",
                value: function getFeedRecources(_ref10) {
                    var data = _ref10.data;
                    var skip = data.skip, resources = data.resources;
                    var responseData = {
                        resources: resources
                    };
                    return Resources.fetch("".concat(constants["j"], "/feed?skip=").concat(skip)).then(function(newResources) {
                        if (!newResources) {
                            return null;
                        }
                        responseData.resources = [].concat(_toConsumableArray(responseData.resources), _toConsumableArray(newResources));
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getResourcesReactedByFiltered",
                value: function getResourcesReactedByFiltered(_ref11) {
                    var data = _ref11.data;
                    var userId = data.userId, skip = data.skip, resources = data.resources, reactionsTypes = data.reactionsTypes;
                    var responseData = {
                        resources: resources
                    };
                    return Resources.fetch("".concat(constants["i"], "/reacted-by/").concat(userId, "?skip=").concat(skip, "&filter=reaction.type:$in:").concat(reactionsTypes)).then(function(newResources) {
                        if (!newResources) {
                            return null;
                        }
                        responseData.resources = [].concat(_toConsumableArray(responseData.resources), _toConsumableArray(newResources));
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getResource",
                value: function getResource(url) {
                    var responseData = {
                        resource: null
                    };
                    return Resources.fetch("".concat(constants["j"], "/lookup?url=").concat(encodeURIComponent(url))).then(function(resourceData) {
                        if (!resourceData) {
                            return responseData;
                        }
                        responseData.resource = resourceData;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getActivityFollowed",
                value: function getActivityFollowed(resourceId) {
                    return Resources.fetch("".concat(constants["j"], "/").concat(resourceId, "/activity/followed"));
                }
            } ]);
            return Resources;
        }(module_Module);
        var ignoreUrlsList = __webpack_require__(7);
        function comments_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                comments_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                comments_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return comments_typeof(obj);
        }
        function comments_toConsumableArray(arr) {
            return comments_arrayWithoutHoles(arr) || comments_iterableToArray(arr) || comments_unsupportedIterableToArray(arr) || comments_nonIterableSpread();
        }
        function comments_nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function comments_unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return comments_arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return comments_arrayLikeToArray(o, minLen);
        }
        function comments_iterableToArray(iter) {
            if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
        }
        function comments_arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) return comments_arrayLikeToArray(arr);
        }
        function comments_arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }
        function comments_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function comments_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function comments_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) comments_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) comments_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function comments_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) comments_setPrototypeOf(subClass, superClass);
        }
        function comments_setPrototypeOf(o, p) {
            comments_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return comments_setPrototypeOf(o, p);
        }
        function comments_createSuper(Derived) {
            var hasNativeReflectConstruct = comments_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = comments_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = comments_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return comments_possibleConstructorReturn(this, result);
            };
        }
        function comments_possibleConstructorReturn(self, call) {
            if (call && (comments_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return comments_assertThisInitialized(self);
        }
        function comments_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function comments_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function comments_getPrototypeOf(o) {
            comments_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return comments_getPrototypeOf(o);
        }
        var comments_Comments = function(_Module) {
            comments_inherits(Comments, _Module);
            var _super = comments_createSuper(Comments);
            function Comments() {
                comments_classCallCheck(this, Comments);
                return _super.apply(this, arguments);
            }
            comments_createClass(Comments, [ {
                key: "get-comments",
                value: function getComments(_ref) {
                    var sender = _ref.sender, data = _ref.data, sendResponse = _ref.sendResponse;
                    if (ignoreUrlsList["a"].indexOf(sender.url) !== -1) {
                        return null;
                    }
                    Comments.getComments({
                        data: data
                    }).then(function(responseData) {
                        Comments.updateStore([ sender.tab.id ], responseData);
                        return sendResponse(Object.keys(responseData.comments).length);
                    })["catch"](function() {
                        var responseData = {
                            comments: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-activities",
                value: function getActivities(_ref2) {
                    var data = _ref2.data, sendResponse = _ref2.sendResponse;
                    Comments.getActivities({
                        data: data
                    }).then(function(responseData) {
                        Comments.updateStore(null, responseData);
                        return sendResponse(Object.keys(responseData.activitiesComments).length);
                    })["catch"](function() {
                        var responseData = {
                            comments: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-replies",
                value: function getReplies(_ref3) {
                    var sender = _ref3.sender, data = _ref3.data;
                    return Comments.getReplies({
                        data: data
                    }).then(function(responseData) {
                        Comments.updateStore([ sender.tab.id ], responseData);
                        return responseData;
                    })["catch"](function(e) {
                        console.log("GET REPLIES: ".concat(e));
                    });
                }
            }, {
                key: "post-comment",
                value: function postComment(_ref4) {
                    var sender = _ref4.sender, data = _ref4.data;
                    var comments = data.comments, fakeId = data.fakeId;
                    Comments.updateStore([ sender.tab.id ], {
                        comments: comments
                    });
                    return Comments.postComment({
                        data: data
                    }).then(function(responseData) {
                        comments[fakeId].id = responseData.id;
                        Comments.updateStore([ sender.tab.id ], {
                            comments: comments
                        });
                    });
                }
            }, {
                key: "post-reply",
                value: function postReply(_ref5) {
                    var sender = _ref5.sender, data = _ref5.data;
                    var fakeId = data.fakeId, comments = data.comments;
                    Comments.updateStore([ sender.tab.id ], {
                        comments: comments
                    });
                    return Comments.postReply({
                        data: data
                    }).then(function(responseData) {
                        comments[fakeId].id = responseData.id;
                        comments[responseData.id] = comments[fakeId];
                        delete comments[fakeId];
                        Comments.updateStore([ sender.tab.id ], {
                            comments: comments
                        });
                    });
                }
            }, {
                key: "update-vote",
                value: function updateVote(_ref6) {
                    var sender = _ref6.sender, data = _ref6.data;
                    var comments = data.comments, replies = data.replies;
                    Comments.updateStore([ sender.tab.id ], {
                        comments: comments
                    });
                    Comments.updateStore([ sender.tab.id ], {
                        replies: replies
                    });
                    return Comments.updateVote({
                        data: data
                    });
                }
            } ], [ {
                key: "getComments",
                value: function getComments(_ref7) {
                    var data = _ref7.data;
                    var comments = data.comments, skip = data.skip, resourceId = data.resourceId;
                    var responseData = {
                        comments: comments
                    };
                    return Comments.fetch("".concat(constants["d"], "/resources/").concat(resourceId, "?skip=").concat(skip, "&replyLevels=2")).then(function(newComments) {
                        var objTmp = Object.assign(responseData.comments, newComments.commentsById);
                        responseData.comments = objTmp;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getActivities",
                value: function getActivities(_ref8) {
                    var data = _ref8.data;
                    var skip = data.skip, userId = data.userId, activitiesComments = data.activitiesComments, activitiesResources = data.activitiesResources, fromTs = data.fromTs, toTs = data.toTs;
                    var responseData = {
                        activitiesComments: activitiesComments,
                        activitiesResources: activitiesResources
                    };
                    return Comments.fetch("".concat(constants["d"], "/by/").concat(userId, "?skip=").concat(skip, "&fromTs=").concat(fromTs, "&toTs=").concat(toTs)).then(function(newActivities) {
                        responseData.activitiesComments = [].concat(comments_toConsumableArray(responseData.activitiesComments), comments_toConsumableArray(newActivities.comments));
                        var objActivityResources = Object.assign(responseData.activitiesResources, newActivities.resourcesById);
                        responseData.activitiesResources = objActivityResources;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getReplies",
                value: function getReplies(_ref9) {
                    var data = _ref9.data;
                    var parentId = data.parentId, comments = data.comments;
                    var responseData = {
                        comments: comments
                    };
                    return Comments.fetch("".concat(constants["d"], "/replies/").concat(parentId, "?replyLevels=2")).then(function(newComments) {
                        var objTmp = Object.assign(responseData.comments, newComments.commentsById);
                        responseData.comments = objTmp;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "postComment",
                value: function postComment(_ref10) {
                    var data = _ref10.data;
                    var resourceId = data.resourceId, text = data.text, reactionType = data.reactionType;
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            text: text,
                            reactionType: reactionType
                        })
                    };
                    return Comments.fetch("".concat(constants["d"], "/resources/").concat(resourceId), options);
                }
            }, {
                key: "postReply",
                value: function postReply(_ref11) {
                    var data = _ref11.data;
                    var parentId = data.parentId, text = data.text, reactionType = data.reactionType;
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            text: text,
                            reactionType: reactionType
                        })
                    };
                    return Comments.fetch("".concat(constants["d"], "/replies/").concat(parentId), options);
                }
            }, {
                key: "updateVote",
                value: function updateVote(_ref12) {
                    var data = _ref12.data;
                    var commentId = data.commentId, type = data.type, method = data.method;
                    var options = {
                        method: method,
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    };
                    return Comments.fetch("".concat(constants["d"], "/").concat(commentId, "/vote/?type=").concat(type), options);
                }
            } ]);
            return Comments;
        }(module_Module);
        function users_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                users_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                users_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return users_typeof(obj);
        }
        function users_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function users_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function users_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) users_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) users_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function users_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) users_setPrototypeOf(subClass, superClass);
        }
        function users_setPrototypeOf(o, p) {
            users_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return users_setPrototypeOf(o, p);
        }
        function users_createSuper(Derived) {
            var hasNativeReflectConstruct = users_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = users_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = users_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return users_possibleConstructorReturn(this, result);
            };
        }
        function users_possibleConstructorReturn(self, call) {
            if (call && (users_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return users_assertThisInitialized(self);
        }
        function users_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function users_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function users_getPrototypeOf(o) {
            users_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return users_getPrototypeOf(o);
        }
        var users_Users = function(_Module) {
            users_inherits(Users, _Module);
            var _super = users_createSuper(Users);
            function Users() {
                users_classCallCheck(this, Users);
                return _super.apply(this, arguments);
            }
            users_createClass(Users, [ {
                key: "get-follower-info",
                value: function getFollowerInfo(_ref) {
                    var data = _ref.data, sendResponse = _ref.sendResponse;
                    return Users.getFollowerInfo(data.userId).then(function(responseData) {
                        return sendResponse(responseData);
                    })["catch"](function() {
                        return sendResponse(null);
                    });
                }
            }, {
                key: "get-user",
                value: function getUser(_ref2) {
                    var data = _ref2.data, sendResponse = _ref2.sendResponse;
                    return Users.getUser(data.userId).then(function(responseData) {
                        return sendResponse(responseData);
                    })["catch"](function() {
                        return sendResponse(null);
                    });
                }
            }, {
                key: "get-suggested-followed",
                value: function getSuggestedFollowed(_ref3) {
                    var data = _ref3.data, sendResponse = _ref3.sendResponse;
                    return Users.getSuggested(data.value).then(function(responseData) {
                        return sendResponse(responseData);
                    })["catch"](function() {
                        return sendResponse(null);
                    });
                }
            }, {
                key: "get-following",
                value: function getFollowing() {
                    return Users.getFollowing().then(function(responseData) {
                        Users.updateStore(null, responseData);
                        return responseData.following;
                    })["catch"](function() {
                        var responseData = {
                            following: null
                        };
                        return responseData.following;
                    });
                }
            }, {
                key: "get-followers",
                value: function getFollowers() {
                    return Users.getFollowers().then(function(responseData) {
                        Users.updateStore(null, responseData);
                        return responseData;
                    })["catch"](function() {
                        var responseData = {
                            followers: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "get-friends",
                value: function getFriends() {
                    return Users.getFriends().then(function(responseData) {
                        Users.updateStore(null, responseData);
                        return responseData;
                    })["catch"](function() {
                        var responseData = {
                            friends: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "update-relation",
                value: function updateRelation(_ref4) {
                    var _this = this;
                    var data = _ref4.data;
                    return Users.updateRelation({
                        data: data
                    }).then(function() {
                        _this["get-friends"]();
                        _this["get-following"]();
                        _this["get-followers"]();
                    });
                }
            }, {
                key: "update-topFriend",
                value: function updateTopFriend(_ref5) {
                    var _this2 = this;
                    var data = _ref5.data;
                    return Users.updateTopFriend({
                        data: data
                    }).then(function() {
                        _this2["get-friends"]();
                        _this2["get-following"]();
                        _this2["get-followers"]();
                    });
                }
            } ], [ {
                key: "getFollowerInfo",
                value: function getFollowerInfo(userId) {
                    return Users.fetch("".concat(constants["l"], "/me/following?filter=_id:$regex:").concat(userId, "&fields=avatar,username,firstName,connectionCount")).then(function(users) {
                        return users[0];
                    });
                }
            }, {
                key: "getUser",
                value: function getUser(id) {
                    return Users.fetch("".concat(constants["l"], "/").concat(id));
                }
            }, {
                key: "getSuggested",
                value: function getSuggested(value) {
                    return Users.fetch("".concat(constants["l"], "/me/following?sort=-connectionCount&filter=username:$regex:").concat(value, "&fields=avatar,username"));
                }
            }, {
                key: "getFollowing",
                value: function getFollowing() {
                    var responseData = {
                        following: null
                    };
                    return Users.fetch("".concat(constants["l"], "/me/following?fields=avatar,username,firstName,connectionCount")).then(function(resourcesList) {
                        if (!resourcesList) {
                            return null;
                        }
                        responseData.following = resourcesList;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getFollowers",
                value: function getFollowers() {
                    var responseData = {
                        followers: null
                    };
                    return Users.fetch("".concat(constants["l"], "/me/followers?fields=avatar,username,firstName,connectionCount")).then(function(resourcesList) {
                        if (!resourcesList) {
                            return null;
                        }
                        responseData.followers = resourcesList;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "getFriends",
                value: function getFriends() {
                    var responseData = {
                        friends: null
                    };
                    return Users.fetch("".concat(constants["l"], "/me/buddies?fields=avatar,username,firstName,connectionCount")).then(function(resourcesList) {
                        if (!resourcesList) {
                            return null;
                        }
                        responseData.friends = resourcesList;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "updateRelation",
                value: function updateRelation(_ref6) {
                    var data = _ref6.data;
                    var userId = data.userId, method = data.method;
                    var options = {
                        method: method,
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    };
                    return Users.fetch("".concat(constants["m"], "/").concat(userId, "/follow"), options);
                }
            }, {
                key: "updateTopFriend",
                value: function updateTopFriend(_ref7) {
                    var data = _ref7.data;
                    var userId = data.userId, method = data.method;
                    var options = {
                        method: method,
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    };
                    return Users.fetch("".concat(constants["l"], "/").concat(userId, "/top-friend"), options);
                }
            } ]);
            return Users;
        }(module_Module);
        function reactions_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                reactions_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                reactions_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return reactions_typeof(obj);
        }
        function reactions_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function reactions_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function reactions_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) reactions_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) reactions_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function reactions_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) reactions_setPrototypeOf(subClass, superClass);
        }
        function reactions_setPrototypeOf(o, p) {
            reactions_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return reactions_setPrototypeOf(o, p);
        }
        function reactions_createSuper(Derived) {
            var hasNativeReflectConstruct = reactions_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = reactions_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = reactions_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return reactions_possibleConstructorReturn(this, result);
            };
        }
        function reactions_possibleConstructorReturn(self, call) {
            if (call && (reactions_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return reactions_assertThisInitialized(self);
        }
        function reactions_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function reactions_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function reactions_getPrototypeOf(o) {
            reactions_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return reactions_getPrototypeOf(o);
        }
        var reactions_Reactions = function(_Module) {
            reactions_inherits(Reactions, _Module);
            var _super = reactions_createSuper(Reactions);
            function Reactions() {
                reactions_classCallCheck(this, Reactions);
                return _super.apply(this, arguments);
            }
            reactions_createClass(Reactions, [ {
                key: "update-reaction",
                value: function updateReaction(_ref) {
                    var data = _ref.data;
                    return Reactions.updateReaction({
                        data: data
                    });
                }
            } ], [ {
                key: "updateReaction",
                value: function updateReaction(_ref2) {
                    var data = _ref2.data;
                    var resourceId = data.resourceId, reactionType = data.reactionType, method = data.method;
                    var options = {
                        method: method,
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            reactionType: reactionType
                        })
                    };
                    return Reactions.fetch("".concat(constants["h"], "/").concat(resourceId), options);
                }
            } ]);
            return Reactions;
        }(module_Module);
        function bookmarks_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                bookmarks_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                bookmarks_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return bookmarks_typeof(obj);
        }
        function bookmarks_toConsumableArray(arr) {
            return bookmarks_arrayWithoutHoles(arr) || bookmarks_iterableToArray(arr) || bookmarks_unsupportedIterableToArray(arr) || bookmarks_nonIterableSpread();
        }
        function bookmarks_nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function bookmarks_unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return bookmarks_arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return bookmarks_arrayLikeToArray(o, minLen);
        }
        function bookmarks_iterableToArray(iter) {
            if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
        }
        function bookmarks_arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) return bookmarks_arrayLikeToArray(arr);
        }
        function bookmarks_arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }
        function bookmarks_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function bookmarks_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function bookmarks_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) bookmarks_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) bookmarks_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function bookmarks_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) bookmarks_setPrototypeOf(subClass, superClass);
        }
        function bookmarks_setPrototypeOf(o, p) {
            bookmarks_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return bookmarks_setPrototypeOf(o, p);
        }
        function bookmarks_createSuper(Derived) {
            var hasNativeReflectConstruct = bookmarks_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = bookmarks_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = bookmarks_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return bookmarks_possibleConstructorReturn(this, result);
            };
        }
        function bookmarks_possibleConstructorReturn(self, call) {
            if (call && (bookmarks_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return bookmarks_assertThisInitialized(self);
        }
        function bookmarks_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function bookmarks_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function bookmarks_getPrototypeOf(o) {
            bookmarks_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return bookmarks_getPrototypeOf(o);
        }
        var bookmarks_Bookmarks = function(_Module) {
            bookmarks_inherits(Bookmarks, _Module);
            var _super = bookmarks_createSuper(Bookmarks);
            function Bookmarks() {
                bookmarks_classCallCheck(this, Bookmarks);
                return _super.apply(this, arguments);
            }
            bookmarks_createClass(Bookmarks, [ {
                key: "get-bookmarks",
                value: function getBookmarks(_ref) {
                    var data = _ref.data, sendResponse = _ref.sendResponse;
                    return Bookmarks.getBookmarks({
                        data: data
                    }).then(function(responseData) {
                        Bookmarks.updateStore(null, responseData);
                        return sendResponse(responseData.bookmarks.length);
                    })["catch"](function() {
                        var responseData = {
                            bookmarks: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "post-bookmark",
                value: function postBookmark(_ref2) {
                    var _this = this;
                    var data = _ref2.data, sendResponse = _ref2.sendResponse;
                    return Bookmarks.postBookmark({
                        data: data
                    }).then(function() {
                        _this["get-bookmarks"]({
                            data: data
                        });
                        return sendResponse(true);
                    });
                }
            }, {
                key: "delete-bookmark",
                value: function deleteBookmark(_ref3) {
                    var _this2 = this;
                    var data = _ref3.data;
                    return Bookmarks.deleteBookmark({
                        data: data
                    }).then(function() {
                        return _this2["get-bookmarks"]({
                            data: data
                        });
                    });
                }
            } ], [ {
                key: "getBookmarks",
                value: function getBookmarks(_ref4) {
                    var data = _ref4.data;
                    var skip = data.skip, bookmarks = data.bookmarks;
                    var responseData = {
                        bookmarks: bookmarks
                    };
                    return Bookmarks.fetch("".concat(constants["c"], "?type=resource&sort=-created_ts&skip=").concat(skip)).then(function(newBookmarks) {
                        if (!newBookmarks) {
                            return null;
                        }
                        responseData.bookmarks = [].concat(bookmarks_toConsumableArray(responseData.bookmarks), bookmarks_toConsumableArray(newBookmarks));
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "postBookmark",
                value: function postBookmark(_ref5) {
                    var data = _ref5.data;
                    var resourceId = data.resourceId, metaTags = data.metaTags, method = data.method;
                    var options = {
                        method: method,
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            metaTags: metaTags
                        })
                    };
                    return Bookmarks.fetch("".concat(constants["c"], "?type=resource&id=").concat(resourceId), options);
                }
            }, {
                key: "deleteBookmark",
                value: function deleteBookmark(_ref6) {
                    var data = _ref6.data;
                    var resourceId = data.resourceId;
                    var options = {
                        method: "delete",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    };
                    return Bookmarks.fetch("".concat(constants["c"], "?type=resource&id=").concat(resourceId), options);
                }
            } ]);
            return Bookmarks;
        }(module_Module);
        function events_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                events_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                events_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return events_typeof(obj);
        }
        function events_toConsumableArray(arr) {
            return events_arrayWithoutHoles(arr) || events_iterableToArray(arr) || events_unsupportedIterableToArray(arr) || events_nonIterableSpread();
        }
        function events_nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function events_unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return events_arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return events_arrayLikeToArray(o, minLen);
        }
        function events_iterableToArray(iter) {
            if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
        }
        function events_arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) return events_arrayLikeToArray(arr);
        }
        function events_arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }
        function events_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function events_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function events_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) events_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) events_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function events_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) events_setPrototypeOf(subClass, superClass);
        }
        function events_setPrototypeOf(o, p) {
            events_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return events_setPrototypeOf(o, p);
        }
        function events_createSuper(Derived) {
            var hasNativeReflectConstruct = events_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = events_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = events_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return events_possibleConstructorReturn(this, result);
            };
        }
        function events_possibleConstructorReturn(self, call) {
            if (call && (events_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return events_assertThisInitialized(self);
        }
        function events_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function events_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function events_getPrototypeOf(o) {
            events_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return events_getPrototypeOf(o);
        }
        var events_Events = function(_Module) {
            events_inherits(Events, _Module);
            var _super = events_createSuper(Events);
            function Events() {
                events_classCallCheck(this, Events);
                return _super.apply(this, arguments);
            }
            events_createClass(Events, [ {
                key: "get-events",
                value: function getEvents(_ref) {
                    var data = _ref.data, sendResponse = _ref.sendResponse;
                    return Events.getEvents({
                        data: data
                    }).then(function(responseData) {
                        Events.updateStore(null, responseData);
                        return sendResponse(responseData.events.length);
                    })["catch"](function() {
                        var responseData = {
                            events: null
                        };
                        return responseData;
                    });
                }
            }, {
                key: "post-mark-event",
                value: function postMarkEvent(_ref2) {
                    var _this = this;
                    var data = _ref2.data;
                    return Events.postMarkEvent({
                        data: data
                    }).then(function() {
                        return _this["get-events"]({
                            data: data
                        });
                    });
                }
            }, {
                key: "get-fresh-events",
                value: function getFreshEvents(_ref3) {
                    var sendResponse = _ref3.sendResponse;
                    return Events.getFreshEvents().then(function(responseData) {
                        if (responseData.freshEvents) {
                            Events.setBadge(responseData.freshEvents);
                            Events.updateStore(null, responseData);
                            return sendResponse(true);
                        }
                        return false;
                    })["catch"](function() {
                        return sendResponse(false);
                    });
                }
            }, {
                key: "reset-fresh-events",
                value: function resetFreshEvents() {
                    return Events.deleteFreshEvents().then(function(responseData) {
                        Events.setBadge("");
                        Events.updateStore(null, responseData);
                        return responseData;
                    })["catch"](function() {
                        var responseData = {
                            freshEvents: null
                        };
                        return responseData;
                    });
                }
            } ], [ {
                key: "getEvents",
                value: function getEvents(_ref4) {
                    var data = _ref4.data;
                    var events = data.events, skip = data.skip;
                    var responseData = {
                        events: events
                    };
                    return Events.fetch("".concat(constants["e"], "?skip=").concat(skip)).then(function(newEvents) {
                        if (!newEvents) {
                            return null;
                        }
                        responseData.events = [].concat(events_toConsumableArray(responseData.events), events_toConsumableArray(newEvents));
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "postMarkEvent",
                value: function postMarkEvent(_ref5) {
                    var data = _ref5.data;
                    var eventId = data.eventId, isRead = data.isRead;
                    var options = {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            isRead: isRead
                        })
                    };
                    return Events.fetch("".concat(constants["e"], "/").concat(eventId, "/mark"), options);
                }
            }, {
                key: "getFreshEvents",
                value: function getFreshEvents() {
                    var responseData = {
                        freshEvents: null
                    };
                    return Events.fetch("".concat(constants["e"], "/fresh/count")).then(function(eventsCount) {
                        if (!eventsCount) {
                            return null;
                        }
                        responseData.freshEvents = eventsCount.total;
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            }, {
                key: "deleteFreshEvents",
                value: function deleteFreshEvents() {
                    var responseData = {
                        freshEvents: null
                    };
                    var options = {
                        method: "delete",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    };
                    return Events.fetch("".concat(constants["e"], "/fresh/count"), options).then(function() {
                        return responseData;
                    })["catch"](function() {
                        return responseData;
                    });
                }
            } ]);
            return Events;
        }(module_Module);
        var config = __webpack_require__(10);
        function state_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                state_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                state_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return state_typeof(obj);
        }
        function state_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function state_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function state_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) state_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) state_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function state_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) state_setPrototypeOf(subClass, superClass);
        }
        function state_setPrototypeOf(o, p) {
            state_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return state_setPrototypeOf(o, p);
        }
        function state_createSuper(Derived) {
            var hasNativeReflectConstruct = state_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = state_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = state_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return state_possibleConstructorReturn(this, result);
            };
        }
        function state_possibleConstructorReturn(self, call) {
            if (call && (state_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return state_assertThisInitialized(self);
        }
        function state_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function state_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function state_getPrototypeOf(o) {
            state_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return state_getPrototypeOf(o);
        }
        var state_State = function(_Module) {
            state_inherits(State, _Module);
            var _super = state_createSuper(State);
            function State() {
                state_classCallCheck(this, State);
                return _super.apply(this, arguments);
            }
            state_createClass(State, [ {
                key: "get-sections",
                value: function getSections(_ref) {
                    var sender = _ref.sender;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            currentSection: "Comments",
                            previousSection: "Comments"
                        };
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-sections",
                value: function setSections(_ref2) {
                    var sender = _ref2.sender, data = _ref2.data;
                    var currentSection = data.currentSection, previousSection = data.previousSection;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            currentSection: previousSection,
                            previousSection: currentSection
                        };
                    } else {
                        this.state[sender.tab.id].previousSection = previousSection;
                        this.state[sender.tab.id].currentSection = currentSection;
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "get-onboarding-section",
                value: function getOnboardingSection(_ref3) {
                    var sender = _ref3.sender;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            onboardingSection: "Welcome"
                        };
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-onboarding-sections",
                value: function setOnboardingSections(_ref4) {
                    var sender = _ref4.sender, data = _ref4.data;
                    var onboardingSection = data.onboardingSection;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            onboardingSection: onboardingSection
                        };
                    } else {
                        this.state[sender.tab.id].onboardingSection = onboardingSection;
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "get-onboarding",
                value: function getOnboarding() {
                    chrome.storage.local.get("onboarding", function(result) {
                        if (result.onboarding === undefined) {
                            chrome.storage.local.set({
                                onboarding: false
                            });
                        }
                        var onboarding = result.onboarding ? result.onboarding : false;
                        State.updateStore(null, {
                            onboarding: onboarding
                        });
                    });
                }
            }, {
                key: "set-onboarding",
                value: function setOnboarding(_ref5) {
                    var data = _ref5.data;
                    var onboarding = data.onboarding;
                    chrome.storage.local.set({
                        onboarding: onboarding
                    });
                    State.updateStore(null, {
                        onboarding: onboarding
                    });
                }
            }, {
                key: "get-showMenu",
                value: function getShowMenu(_ref6) {
                    var sender = _ref6.sender;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            showMenu: false
                        };
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-showMenu",
                value: function setShowMenu(_ref7) {
                    var sender = _ref7.sender, data = _ref7.data;
                    var showMenu = data.showMenu;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            showMenu: false
                        };
                    } else {
                        this.state[sender.tab.id].showMenu = showMenu;
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-comment-id-from-event",
                value: function setCommentIdFromEvent(_ref8) {
                    var sender = _ref8.sender, data = _ref8.data;
                    var eventCommentInfo = data.eventCommentInfo;
                    this.state[sender.tab.id].eventCommentInfo = eventCommentInfo;
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "get-other-user",
                value: function getOtherUser(_ref9) {
                    var sender = _ref9.sender;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            otherUser: null
                        };
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-other-user",
                value: function setOtherUser(_ref10) {
                    var sender = _ref10.sender, data = _ref10.data;
                    var otherUser = data.otherUser;
                    if (!this.state[sender.tab.id]) {
                        this.state[sender.tab.id] = {
                            otherUser: null
                        };
                    } else {
                        this.state[sender.tab.id].otherUser = otherUser;
                    }
                    var state = this.state[sender.tab.id];
                    State.updateStore([ sender.tab.id ], state);
                }
            }, {
                key: "set-pushNotifications",
                value: function setPushNotifications(_ref11) {
                    var data = _ref11.data, sendResponse = _ref11.sendResponse;
                    var pushNotifications = data.pushNotifications;
                    chrome.storage.local.set({
                        push: pushNotifications
                    });
                    var state = {
                        pushNotifications: pushNotifications
                    };
                    State.updateStore(null, state);
                    return sendResponse(true);
                }
            }, {
                key: "get-pushNotifications",
                value: function getPushNotifications() {
                    var state = {};
                    chrome.storage.local.get("push", function(result) {
                        if (result.push === undefined) {
                            chrome.storage.local.set({
                                push: true
                            });
                            state.pushNotifications = true;
                        } else {
                            state.pushNotifications = result.push;
                        }
                        State.updateStore(null, state);
                    });
                }
            }, {
                key: "set-stealthMode",
                value: function setStealthMode(_ref12) {
                    var data = _ref12.data, sendResponse = _ref12.sendResponse;
                    var stealthMode = data.stealthMode;
                    chrome.storage.local.set({
                        stealth: stealthMode
                    });
                    var state = {
                        stealthMode: stealthMode
                    };
                    State.updateStore(null, state);
                    return sendResponse(true);
                }
            }, {
                key: "get-stealthMode",
                value: function getStealthMode() {
                    var state = {};
                    chrome.storage.local.get("stealth", function(result) {
                        if (result.stealth === undefined) {
                            chrome.storage.local.set({
                                stealth: false
                            });
                            state.stealthMode = false;
                        } else {
                            state.stealthMode = result.stealth;
                        }
                        State.updateStore(null, state);
                    });
                }
            }, {
                key: "get-comment",
                value: function getComment(_ref13) {
                    var data = _ref13.data, sendResponse = _ref13.sendResponse;
                    var resourceUrl = data.resourceUrl;
                    if (this.state[resourceUrl] && this.state[resourceUrl].commentText) {
                        return sendResponse(this.state[resourceUrl].commentText);
                    }
                    return sendResponse(false);
                }
            }, {
                key: "set-comment",
                value: function setComment(_ref14) {
                    var data = _ref14.data;
                    var commentText = data.commentText, resourceUrl = data.resourceUrl;
                    if (!commentText) {
                        delete this.state[resourceUrl];
                        return false;
                    }
                    if (!this.state[resourceUrl]) {
                        this.state[resourceUrl] = {
                            commentText: commentText
                        };
                        return true;
                    }
                    this.state[resourceUrl].commentText = commentText;
                    return true;
                }
            }, {
                key: "delete-state",
                value: function deleteState() {
                    this.state = {};
                    var state = config["a"].state;
                    State.updateStore(null, state);
                }
            } ]);
            return State;
        }(module_Module);
        var _5_ic_browser = __webpack_require__(217);
        var _5_ic_browser_default = __webpack_require__.n(_5_ic_browser);
        function pushNotifications_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                pushNotifications_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                pushNotifications_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return pushNotifications_typeof(obj);
        }
        function pushNotifications_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function pushNotifications_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function pushNotifications_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) pushNotifications_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) pushNotifications_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function pushNotifications_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) pushNotifications_setPrototypeOf(subClass, superClass);
        }
        function pushNotifications_setPrototypeOf(o, p) {
            pushNotifications_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return pushNotifications_setPrototypeOf(o, p);
        }
        function pushNotifications_createSuper(Derived) {
            var hasNativeReflectConstruct = pushNotifications_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = pushNotifications_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = pushNotifications_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return pushNotifications_possibleConstructorReturn(this, result);
            };
        }
        function pushNotifications_possibleConstructorReturn(self, call) {
            if (call && (pushNotifications_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return pushNotifications_assertThisInitialized(self);
        }
        function pushNotifications_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function pushNotifications_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function pushNotifications_getPrototypeOf(o) {
            pushNotifications_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return pushNotifications_getPrototypeOf(o);
        }
        var pushNotifications_PushNotifications = function(_Module) {
            pushNotifications_inherits(PushNotifications, _Module);
            var _super = pushNotifications_createSuper(PushNotifications);
            function PushNotifications() {
                pushNotifications_classCallCheck(this, PushNotifications);
                return _super.apply(this, arguments);
            }
            pushNotifications_createClass(PushNotifications, [ {
                key: "register",
                value: function register() {
                    chrome.storage.local.get([ "registered", "push" ], function(result) {
                        if (result.push) {
                            if (!result.registered) {
                                chrome.instanceID.getToken({
                                    authorizedEntity: constants["k"],
                                    scope: "GCM"
                                }, PushNotifications.registerCallback);
                            } else {
                                chrome.gcm.onMessage.addListener(function(message) {
                                    chrome.storage.local.get("registered", function(result) {
                                        if (result.registered) {
                                            PushNotifications.sendNotification(message.data);
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            }, {
                key: "unregister",
                value: function unregister() {
                    chrome.instanceID.deleteToken(PushNotifications.unregisterCallback);
                }
            } ], [ {
                key: "registerCallback",
                value: function registerCallback(registrationId) {
                    if (!chrome.runtime.lastError) {
                        var options = {
                            method: "put",
                            headers: {
                                Accept: "application/json, text/plain, */*",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                token: registrationId
                            })
                        };
                        PushNotifications.fetch("".concat(constants["g"], "/register-device"), options);
                        chrome.storage.local.set({
                            registered: true
                        });
                        chrome.gcm.onMessage.addListener(function(message) {
                            chrome.storage.local.get("registered", function(result) {
                                if (result.registered) {
                                    PushNotifications.sendNotification(message.data);
                                }
                            });
                        });
                    } else {
                        console.log(chrome.runtime.lastError);
                    }
                }
            }, {
                key: "sendNotification",
                value: function sendNotification(message) {
                    var previewUrl = message.previewUrl, body = message.body, data = message.data, title = message.title;
                    var iconUrl = _5_ic_browser_default.a;
                    if (previewUrl && previewUrl !== "") {
                        iconUrl = previewUrl;
                    }
                    chrome.notifications.create(data, {
                        type: "basic",
                        iconUrl: iconUrl,
                        title: title,
                        message: body.split("\n").join(" ")
                    }, function(notificationId) {
                        console.log(notificationId);
                    });
                }
            }, {
                key: "unregisterCallback",
                value: function unregisterCallback() {
                    if (!chrome.runtime.lastError) {
                        chrome.storage.local.set({
                            registered: false
                        });
                    }
                    console.log(chrome.runtime.lastError);
                }
            } ]);
            return PushNotifications;
        }(module_Module);
        function coins_typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                coins_typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                coins_typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return coins_typeof(obj);
        }
        function coins_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function coins_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function coins_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) coins_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) coins_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function coins_inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) coins_setPrototypeOf(subClass, superClass);
        }
        function coins_setPrototypeOf(o, p) {
            coins_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return coins_setPrototypeOf(o, p);
        }
        function coins_createSuper(Derived) {
            var hasNativeReflectConstruct = coins_isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = coins_getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = coins_getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return coins_possibleConstructorReturn(this, result);
            };
        }
        function coins_possibleConstructorReturn(self, call) {
            if (call && (coins_typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return coins_assertThisInitialized(self);
        }
        function coins_assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        }
        function coins_isNativeReflectConstruct() {
            if (typeof Reflect === "undefined" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function coins_getPrototypeOf(o) {
            coins_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return coins_getPrototypeOf(o);
        }
        var coins_Coins = function(_Module) {
            coins_inherits(Coins, _Module);
            var _super = coins_createSuper(Coins);
            function Coins() {
                coins_classCallCheck(this, Coins);
                return _super.apply(this, arguments);
            }
            coins_createClass(Coins, [ {
                key: "get-coins",
                value: function getCoins(_ref) {
                    var sendResponse = _ref.sendResponse;
                    return Coins.getCoins().then(function(responseData) {
                        return sendResponse(responseData);
                    })["catch"](function() {
                        return sendResponse(null);
                    });
                }
            } ], [ {
                key: "getCoins",
                value: function getCoins() {
                    return Coins.fetch("".concat(constants["a"], "status"));
                }
            } ]);
            return Coins;
        }(module_Module);
        function app_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function app_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function app_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) app_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) app_defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var Background = function() {
            function Background() {
                app_classCallCheck(this, Background);
                Background.setEvents();
            }
            app_createClass(Background, null, [ {
                key: "setEvents",
                value: function setEvents() {
                    chrome.runtime.onInstalled.addListener(function() {
                        chrome.tabs.create({
                            url: "https://www.extension.fulldive.co/how-to-use"
                        }, function() {});
                    });
                    chrome.browserAction.onClicked.addListener(function(tab) {
                        chrome.tabs.sendMessage(tab.id, {
                            action: "toggleMenu"
                        });
                    });
                }
            } ]);
            return Background;
        }();
        window.auth = new auth_Auth();
        window.background = new Background();
        window.resources = new resources_Resources({
            name: "resources"
        });
        window.comments = new comments_Comments({
            name: "comments"
        });
        window.users = new users_Users({
            name: "users"
        });
        window.reactions = new reactions_Reactions({
            name: "reactions"
        });
        window.bookmarks = new bookmarks_Bookmarks({
            name: "bookmarks"
        });
        window.events = new events_Events({
            name: "events"
        });
        window.state = new state_State({
            name: "state"
        });
        window.pushNotifications = new pushNotifications_PushNotifications({
            name: "pushNotifications"
        });
        window.coins = new coins_Coins({
            name: "coins"
        });
    },
    7: function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return IGNORE_URLS_LIST;
        });
        var IGNORE_URLS_LIST = [ "https://www.google.com/", "https://yandex.ru/", "https://ya.ru/", "https://www.facebook.com/", "https://ru.linkedin.com/", "https://vk.com/feed", "https://myspace.com/", "https://twitter.com/", "https://www.pinterest.ru/", "https://www.tumblr.com/dashboard", "https://www.flickr.com/", "https://www.meetup.com/en-AU/en-EN/", "https://www.meetup.com/en-EN/", "https://www.meetup.com/ru-RU/en-EN/", "https://www.meetup.com/ru-RU/", "https://secure.tagged.com/home.html", "https://ask.fm/account/wall", "https://github.com/", "https://www.reddit.com/", "https://en.wikipedia.org/wiki/Main_Page", "https://www.last.fm/", "https://www.netflix.com/ru/", "https://www.netflix.com/nl-en/", "https://www.buzzfeed.com/" ];
    }
});