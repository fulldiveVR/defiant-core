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
        2: 0
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
    deferredModules.push([ 354, 0 ]);
    return checkDeferredModules();
})([ function(module, __webpack_exports__, __webpack_require__) {
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
}, , , function(module, __webpack_exports__, __webpack_require__) {
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
}, , function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#868C93" fill-rule="nonzero" d="M7.8 11l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"></path></svg>';
}, , function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return IGNORE_URLS_LIST;
    });
    var IGNORE_URLS_LIST = [ "https://www.google.com/", "https://yandex.ru/", "https://ya.ru/", "https://www.facebook.com/", "https://ru.linkedin.com/", "https://vk.com/feed", "https://myspace.com/", "https://twitter.com/", "https://www.pinterest.ru/", "https://www.tumblr.com/dashboard", "https://www.flickr.com/", "https://www.meetup.com/en-AU/en-EN/", "https://www.meetup.com/en-EN/", "https://www.meetup.com/ru-RU/en-EN/", "https://www.meetup.com/ru-RU/", "https://secure.tagged.com/home.html", "https://ask.fm/account/wall", "https://github.com/", "https://www.reddit.com/", "https://en.wikipedia.org/wiki/Main_Page", "https://www.last.fm/", "https://www.netflix.com/ru/", "https://www.netflix.com/nl-en/", "https://www.buzzfeed.com/" ];
}, , , function(module, __webpack_exports__, __webpack_require__) {
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
}, function(module, exports) {
    module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOTVweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgOTUgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjUgKDY3NDY5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19mdWxsZGl2ZV9sb2dvPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ilh0ZW5zaW9uLW1vbmV5LWNob29zZS1jYXJkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE1Mi4wMDAwMDAsIC0xMDIuMDAwMDAwKSIgZmlsbD0iI0ZGOTkwMCI+CiAgICAgICAgICAgIDxnIGlkPSJpY19mdWxsZGl2ZV9sb2dvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTUyLjAwMDAwMCwgMTAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkZpbGwtMSIgcG9pbnRzPSIwIDIuMjc0OCAwIDIwLjgxNDQ2NDUgMy4zNzA0Nzg0OCAyMC44MTQ0NjQ1IDMuMzcwNDc4NDggMTIuNzM0OTgzNSAxMC43ODA5MjMzIDEyLjczNDk4MzUgMTAuNzgwOTIzMyA5Ljg3MjI2Nzc4IDMuMzcwNDc4NDggOS44NzIyNjc3OCAzLjM3MDQ3ODQ4IDUuMTM3NTE1NzQgMTEuNzE3ODQ1IDUuMTM3NTE1NzQgMTEuNzE3ODQ1IDIuMjc0OCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTIyLjQwMDY3MjUsMTguMzE2MjQyNiBDMjIuMTg2NTQ0OCwxOC4zNjk1NDg2IDIxLjg2MDgzNTgsMTguNDE0NzIzMyAyMS40MjM5OTcyLDE4LjQ0OTk1OTUgQzIwLjk4NzE1ODYsMTguNDg1NjQ3NCAyMC41NzIwMDM5LDE4LjUwMzI2NTUgMjAuMTc5ODg4MiwxOC41MDMyNjU1IEMxOS4wOTIwODMzLDE4LjUwMzI2NTUgMTguMzI5NTM1NywxOC4xODI1MjU3IDE3Ljg5MjY5NzEsMTcuNTQwMTQyNiBDMTcuNDU1ODU4NSwxNi44OTgyMTEyIDE3LjIzNzIxMzMsMTUuODI4MDI0NSAxNy4yMzcyMTMzLDE0LjMzMDAzNCBMMTcuMjM3MjEzMyw3IEwxNCw3IEwxNCwxNC44MzgyNDg1IEMxNCwxNS43ODM3NTMzIDE0LjA5ODAyODksMTYuNjUyOTEzIDE0LjI5NDUzODUsMTcuNDQ2NjMxMSBDMTQuNDkwNTk2NCwxOC4yNDAzNDkyIDE0LjgxNTg1MzcsMTguOTIyNDg2IDE1LjI3MTIxMzgsMTkuNDkzMDQxNSBDMTUuNzI1NjcwNSwyMC4wNjQwNDg3IDE2LjMzMTkxMzksMjAuNTA5NDcwNCAxNy4wOTAzOTU4LDIwLjgzMDY2MiBDMTcuODQ3OTc0MiwyMS4xNTE4NTM1IDE4Ljc4ODk2MTYsMjEuMzEyMjIzNSAxOS45MTI5MDYyLDIxLjMxMjIyMzUgQzIxLjEwNzMyMzEsMjEuMzEyMjIzNSAyMi4yMDM3MTEyLDIxLjIyNzI5NTIgMjMuMjAyOTczOCwyMS4wNTgzNDIxIEMyNC4yMDE3ODQ3LDIwLjg4ODkzNzMgMjUuMDEzMTIwOSwyMC43MjQwNDk5IDI1LjYzNzg4NTksMjAuNTYzNjggTDI1LjYzNzg4NTksNyBMMjIuNDAwNjcyNSw3IEwyMi40MDA2NzI1LDE4LjMxNjI0MjYgWiIgaWQ9IkZpbGwtMiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkZpbGwtNCIgcG9pbnRzPSIzMCAyMC43NTk5OTcxIDMzLjIzNzIxMzMgMjAuNzU5OTk3MSAzMy4yMzcyMTMzIDAgMzAgMC41MzQ4Njc1MTQiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTYiIHBvaW50cz0iMzggMjAuNzU5OTk3MSA0MS4yMzcyMTMzIDIwLjc1OTk5NzEgNDEuMjM3MjEzMyAwIDM4IDAuNTM0ODY3NTE0Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTMuMzYzMzQzNywxOC4wODQ3NTYxIEM1My4xMzExNDYyLDE4LjEzODA2MjEgNTIuODMyNTQxOSwxOC4xODczMDI1IDUyLjQ2NzA3OTIsMTguMjMxNTczNiBDNTIuMTAxMTY0OCwxOC4yNzY3NDgyIDUxLjY1OTgwODgsMTguMjk4NDMyIDUxLjE0MzAxMTEsMTguMjk4NDMyIEM0OS45NDc2OTA2LDE4LjI5ODQzMiA0OS4wMTE2NzI1LDE3Ljg5Mjc2MzkgNDguMzM0MDUzMSwxNy4wODE0Mjc3IEM0Ny42NTU1MzAzLDE2LjI3MDA5MTUgNDcuMzE3MTcyNCwxNS4xNTExMTYyIDQ3LjMxNzE3MjQsMTMuNzI0MDQ5OSBDNDcuMzE3MTcyNCwxMi4zNTExOTMyIDQ3LjU4OTEyMzYsMTEuMjYyNDg0OCA0OC4xMzM0Nzc4LDEwLjQ2MDE4MzUgQzQ4LjY3NzM4MDMsOS42NTc0MzA1IDQ5LjUzNzUwNTEsOS4yNTYyNzk4NiA1MC43MTUyMDc0LDkuMjU2Mjc5ODYgQzUxLjI1MDA3NDksOS4yNTYyNzk4NiA1MS43NTM3NzIsOS4zNDEyMDgxNSA1Mi4yMjYyOTg1LDkuNTEwNjEyOTggQzUyLjY5ODgyNSw5LjY4MDAxNzgxIDUzLjA3Nzg0MDEsOS44NjI5NzUwMiA1My4zNjMzNDM3LDEwLjA1ODU4MTEgTDUzLjM2MzM0MzcsMTguMDg0NzU2MSBaIE01My4zNjMzNDM3LDcuMjQ5NjIzMTkgQzUyLjk4ODg0NjEsNy4wNTM1NjUzNCA1Mi41NDI5NzI2LDYuODc1MTI1NTggNTIuMDI1NzIzMiw2LjcxNDc1NTY4IEM1MS41MDg0NzM4LDYuNTU0Mzg1NzcgNTAuOTEwODEzNSw2LjQ3Mzk3NDk1IDUwLjIzMzE5NDIsNi40NzM5NzQ5NSBDNDkuMjMzOTMxNiw2LjQ3Mzk3NDk1IDQ4LjM1MTIxOTUsNi42NDc4OTcyNCA0Ny41ODQ2MDYyLDYuOTk1NzQxODIgQzQ2LjgxNzU0MTEsNy4zNDMxMzQ2NiA0Ni4xNjcwMjY2LDcuODM4MjQ4NTEgNDUuNjMxNzA3Myw4LjQ4MDYzMTYyIEM0NS4wOTY4Mzk4LDkuMTIyNTYyOTggNDQuNjkxMTcxNyw5Ljg5NDE0NTUxIDQ0LjQxNDI1MTMsMTAuNzk0NDc1NyBDNDQuMTM4MjM0MywxMS42OTQ4MDU5IDQ0LDEyLjY5ODEzNDIgNDQsMTMuODA0MDA5IEM0NCwxNC45Mjc5NTM1IDQ0LjE2NDQzNTYsMTUuOTQwMzE2OCA0NC40OTUxMTM4LDE2Ljg0MDY0NyBDNDQuODI0ODg4NiwxNy43NDE0Mjg5IDQ1LjI5NzQxNTEsMTguNTA4NDk0IDQ1LjkxMjY5MzUsMTkuMTQxMzkwNCBDNDYuNTI3OTcxOCwxOS43NzQyODY5IDQ3LjI3MjQ0OTYsMjAuMjYwMzY1OCA0OC4xNDY1Nzg1LDIwLjU5OTE3NTUgQzQ5LjAyMDI1NTYsMjAuOTM3OTg1MSA1MC4wMTAwMzE2LDIxLjEwNzM5IDUxLjExNTkwNjMsMjEuMTA3MzkgQzUyLjE4NjU0NDgsMjEuMTA3MzkgNTMuMjA3MDM5NSwyMS4wMjc0MzA5IDU0LjE3OTE5NzQsMjAuODY2NjA5MiBDNTUuMTUwOTAzNSwyMC43MDYyMzkzIDU1Ljk1ODE3MzksMjAuNTI4MjUxMyA1Ni42MDA1NTcxLDIwLjMzMjE5MzUgTDU2LjYwMDU1NzEsMCBMNTMuMzYzMzQzNywwLjUzNDg2NzUxNCBMNTMuMzYzMzQzNyw3LjI0OTYyMzE5IFoiIGlkPSJGaWxsLTgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTEwIiBwb2ludHM9IjYxIDIwLjk5MTQ4MzYgNjQuMjM3MjEzMyAyMC45OTE0ODM2IDY0LjIzNzIxMzMgNyA2MSA3Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjMuMDA2NjU2NywxIEM2Mi40NTMyNjc2LDEgNjEuOTgwNzQxLDEuMTc4NDM5NzUgNjEuNTg4MTczNiwxLjUzNTMxOTI2IEM2MS4xOTYwNTc5LDEuODkyMTk4NzcgNjEsMi4zODIzNDM0MSA2MSwzLjAwNjIwNDkyIEM2MSwzLjYxMjkwMDA4IDYxLjE5NjA1NzksNC4wOTQ0NjE1NCA2MS41ODgxNzM2LDQuNDUwODg5MzEgQzYxLjk4MDc0MSw0LjgwODIyMDU2IDYyLjQ1MzI2NzYsNC45ODYyMDg1NyA2My4wMDY2NTY3LDQuOTg2MjA4NTcgQzYzLjU0MTk3NTksNC45ODYyMDg1NyA2NC4wMDUwMTU4LDQuODA4MjIwNTYgNjQuMzk3NTgzMyw0LjQ1MDg4OTMxIEM2NC43ODk2OTksNC4wOTQ0NjE1NCA2NC45ODYyMDg2LDMuNjEyOTAwMDggNjQuOTg2MjA4NiwzLjAwNjIwNDkyIEM2NC45ODYyMDg2LDIuMzgyMzQzNDEgNjQuNzg5Njk5LDEuODkyMTk4NzcgNjQuMzk3NTgzMywxLjUzNTMxOTI2IEM2NC4wMDUwMTU4LDEuMTc4NDM5NzUgNjMuNTQxOTc1OSwxIDYzLjAwNjY1NjcsMSIgaWQ9IkZpbGwtMTIiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03Ni4zNjE1MzY3LDkuNTI3OTcxOCBDNzYuMDkyNzQ3NywxMC40Mjg3NTM3IDc1LjgxMDQwNjQsMTEuMzI5MDgzOSA3NS41MTU4Njc4LDEyLjIyOTQxNDEgQzc1LjIxOTk3NDEsMTMuMTMwNjQ3OCA3NC45MjAwMTQ2LDE0LjAwNDc3NjcgNzQuNjE1OTg5NCwxNC44NTEzNDkxIEM3NC4zMTE1MTI0LDE1LjY5ODgyNSA3NC4wMjQyMDE4LDE2LjQ2MTM3MjYgNzMuNzU2MzE2MywxNy4xMzk0NDM3IEM3My40ODc1MjczLDE2LjQ2MTM3MjYgNzMuMTk2MTUxLDE1LjY5ODgyNSA3Mi44ODMwOTA5LDE0Ljg1MTM0OTEgQzcyLjU2OTU3OSwxNC4wMDQ3NzY3IDcyLjI2NTU1MzgsMTMuMTMwNjQ3OCA3MS45NjkyMDgzLDEyLjIyOTQxNDEgQzcxLjY3NDIxOCwxMS4zMjkwODM5IDcxLjM5Njg0NTksMTAuNDI4NzUzNyA3MS4xMzcwOTE4LDkuNTI3OTcxOCBDNzAuODc3MzM3Nyw4LjYyNzY0MTYgNzAuNjQ4NzU0MSw3Ljc4NTEzNDkxIDcwLjQ1MjY5NjMsNyBMNjcsNyBDNjcuNzY5Nzc1NSw5LjcyODA5NTM3IDY4LjYyNDkzMTEsMTIuMjgzNjIzNyA2OS41NjU0NjY3LDE0LjY2NDMyNjIgQzcwLjUwNTA5ODksMTcuMDQ1NDgwNSA3MS40MjMwNDcyLDE5LjE1NDY4MzYgNzIuMzE4ODU5OSwyMC45OTE0ODM2IEw3NS4wODYyNTcyLDIwLjk5MTQ4MzYgQzc1Ljk4MTYxODIsMTkuMTU0NjgzNiA3Ni44OTkxMTQ3LDE3LjA0NTQ4MDUgNzcuODM5MTk4NiwxNC42NjQzMjYyIEM3OC43ODAxODU5LDEyLjI4MzYyMzcgNzkuNjM1MzQxNSw5LjcyODA5NTM3IDgwLjQwNTExNzEsNyBMNzcuMDU5OTM2NCw3IEM3Ni44NjI5NzUsNy43ODUxMzQ5MSA3Ni42Mjk4NzQsOC42Mjc2NDE2IDc2LjM2MTUzNjcsOS41Mjc5NzE4IiBpZD0iRmlsbC0xMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTg1LjM3MDkzMDIsMTEuOTY1NzYwNSBDODUuNDI0Njg4LDExLjU1NTU3NDkgODUuNTIyMjY1MiwxMS4xNTQ0MjQzIDg1LjY2NTQ2ODgsMTAuNzYxODU2OCBDODUuODA4MjIwNiwxMC4zNjk3NDExIDg2LjAwODM0NDEsMTAuMDIxODk2NSA4Ni4yNjcxOTQ3LDkuNzE4MzIzMDYgQzg2LjUyNTU5MzUsOS40MTUyMDEzNSA4Ni44NDI3MTk0LDkuMTcwMzU0OTEgODcuMjE2NzY1Miw4Ljk4MjQyODQ4IEM4Ny41OTEyNjI5LDguNzk1NDA1NTUgODguMDI4MTAxNCw4LjcwMTg5NDA5IDg4LjUyNzczMjcsOC43MDE4OTQwOSBDODkuMDA5NzQ2LDguNzAxODk0MDkgODkuNDIzOTk3Miw4Ljc4NjgyMjM4IDg5Ljc3MTg0MTgsOC45NTU3NzU0NiBDOTAuMTE5Njg2NCw5LjEyNTYzMjAzIDkwLjQxMzc3MzIsOS4zNTczNzc4NCA5MC42NTQ1NTM5LDkuNjUxNDY0NjIgQzkwLjg5NTMzNDYsOS45NDU1NTE0MSA5MS4wNzgyOTE5LDEwLjI5Mzg0NzcgOTEuMjAyOTczOCwxMC42OTQ5OTg0IEM5MS4zMjgxMDc1LDExLjA5NjE0OSA5MS4zOTA0NDg1LDExLjUyMDMzODcgOTEuMzkwNDQ4NSwxMS45NjU3NjA1IEw4NS4zNzA5MzAyLDExLjk2NTc2MDUgWiBNOTMuMDA4NjAzNCw3Ljc5MjA3NzIyIEM5MS45Mjk4MzM1LDYuNTk3NjYwMjQgOTAuNDI2ODczOCw2IDg4LjUwMTA3OTcsNiBDODcuNjgwNzA4Niw2IDg2Ljg3Nzk1NTYsNi4xNTYzMDQxOSA4Ni4wOTM3MjQyLDYuNDY4MDA5MDcgQzg1LjMwODEzNzUsNi43ODAxNjU3MSA4NC42MTI0NDgzLDcuMjQ0MTA5MDYgODQuMDA2MjA0OSw3Ljg1OTM4NzQgQzgzLjQwMDQxMzMsOC40NzQyMTQgODIuOTE0MzM0Myw5LjI0NTc5NjUzIDgyLjU0ODg3MTYsMTAuMTczMjMxNSBDODIuMTgyOTU3MiwxMS4xMDExMTgyIDgyLDEyLjE3OTg4ODIgODIsMTMuNDEwNDQ0OCBDODIsMTQuNDYyNTYxOCA4Mi4xNDI3NTE4LDE1LjQzMDIwMjIgODIuNDI3ODAzNywxNi4zMTI5MTQyIEM4Mi43MTMzMDczLDE3LjE5NjA3ODEgODMuMTUwNTk3NiwxNy45NjI2OTE0IDgzLjczOTIyMjksMTguNjEzNjU3NyBDODQuMzI3Mzk2NSwxOS4yNjUwNzU3IDg1LjA3Njg0MzQsMTkuNzczMjkwMiA4NS45ODYyMDg2LDIwLjEzODc1MjkgQzg2Ljg5NjAyNTQsMjAuNTAzNzYzOCA4Ny45NjU3NjA1LDIwLjY4NzE3MjggODkuMTk2NzY4OSwyMC42ODcxNzI4IEM4OS42NzgzMzAzLDIwLjY4NzE3MjggOTAuMTUwNDA1MSwyMC42NjAwNjggOTAuNjE0MzQ4NSwyMC42MDY3NjIgQzkxLjA3ODI5MTksMjAuNTUzNDU1OSA5MS41MTA2MTMsMjAuNDg2MTQ1NyA5MS45MTE3NjM2LDIwLjQwNjYzODQgQzkyLjMxMzM2NiwyMC4zMjU3NzU4IDkyLjY2OTc5MzgsMjAuMjM3MjMzNiA5Mi45ODI0MDIxLDIwLjEzODc1MjkgQzkzLjI5NDEwNywyMC4wNDA3MjQgOTMuNTM5NDA1MiwxOS45NDcyMTI1IDkzLjcxNzg0NSwxOS44NTc3NjY4IEw5My4yODk1ODk2LDE3LjIwODcyNyBDOTIuOTE1MDkxOSwxNy4zNjk1NDg2IDkyLjQwMjM2LDE3LjUyMTc4NzEgOTEuNzUxMzkzNywxNy42NjQwODcyIEM5MS4xMDA0Mjc0LDE3LjgwNjgzOSA5MC4zODI2MDI3LDE3Ljg3Nzc2MzEgODkuNTk3NDY3OCwxNy44Nzc3NjMxIEM4OC4yNjAyOTksMTcuODc3NzYzMSA4Ny4yMzkzNTI2LDE3LjU3MDEyNCA4Ni41MzQ2Mjg1LDE2Ljk1NTI5NzQgQzg1LjgzMDM1NjEsMTYuMzQwMDE5IDg1LjQzMzcyMjksMTUuNDcwNDA3NiA4NS4zNDM4MjU1LDE0LjM0NjkxNDcgTDk0LjU3MzkwNCwxNC4zNDY5MTQ3IEM5NC41OTEwNzA0LDE0LjE2ODkyNjcgOTQuNjA0NjIyOCwxMy45NjgzNTE0IDk0LjYxNDEwOTQsMTMuNzQ0NzM3IEM5NC42MjI2OTI2LDEzLjUyMTU3NDQgOTQuNjI3MjEwMSwxMy4zMjA5OTkxIDk0LjYyNzIxMDEsMTMuMTQyNTU5MyBDOTQuNjI3MjEwMSwxMC43NzA4OTE3IDk0LjA4NzgyNTEsOC45ODczOTc2OSA5My4wMDg2MDM0LDcuNzkyMDc3MjIgWiIgaWQ9IkZpbGwtMTQiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
}, function(module, exports) {
    module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNSI+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIGlkPSJhIiB3aWR0aD0iMTIwLjglIiBoZWlnaHQ9IjEyMC44JSIgeD0iLTEwLjQlIiB5PSItMTAuNCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeT0iMSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSIvPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEwMjg2NDU4MyAwIi8+CiAgICAgICAgICAgIDxmZU1lcmdlPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJzaGFkb3dNYXRyaXhPdXRlcjEiLz4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPgogICAgICAgICAgICA8L2ZlTWVyZ2U+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZFRjE1MyIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGQkMxMUUiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjMuMjI3JSIgeTI9IjEwMCUiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjVDOTAwIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGREQxQiIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPHBhdGggaWQ9ImQiIGQ9Ik0xLjg5NSAxMkMxLjg5NSA2LjQxOSA2LjQxOCAxLjg5NSAxMiAxLjg5NWM1LjU4MSAwIDEwLjEwNSA0LjUyMyAxMC4xMDUgMTAuMTA1IDAgNS41ODEtNC41MjMgMTAuMTA1LTEwLjEwNSAxMC4xMDUtNS41ODEgMC0xMC4xMDUtNC41MjMtMTAuMTA1LTEwLjEwNXoiLz4KICAgICAgICA8ZmlsdGVyIGlkPSJlIiB3aWR0aD0iMTA0LjklIiBoZWlnaHQ9IjEwNC45JSIgeD0iLTIuNSUiIHk9Ii0yLjUlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHk9IjEiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRJbm5lcjEiLz4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dPZmZzZXRJbm5lcjEiIGluMj0iU291cmNlQWxwaGEiIGsyPSItMSIgazM9IjEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiByZXN1bHQ9InNoYWRvd0lubmVySW5uZXIxIi8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJzaGFkb3dJbm5lcklubmVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjAzNTYwOTE0ODYgMCIvPgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaCIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGMzVGIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8cGF0aCBpZD0iZyIgZD0iTTEyLjY0NCAxMy44OTNMOS43ODkgMTUuNzl2LTIuMjE1YzAtLjA5OC4wNDktLjE5LjEyOC0uMjQ0bDEuNDktLjk5NWEuMjQ1LjI0NSAwIDAgMCAwLS40MDJsLTEuNDktLjk5NWEuMjkzLjI5MyAwIDAgMS0uMTI4LS4yNDRWOS4yNmMwLS4zMjMuMzM1LS41MjQuNjAyLS4zNjFsLjU2Ny4zNDYgMy42NTEgMi40MzdhLjUzOS41MzkgMCAwIDEtLjAxMy44OTlsLS44ODcuNjAzLTEuMDY1LjcwOHptNC45MDItMy4yMjVhMi4zODMgMi4zODMgMCAwIDAtLjY1My0uNjA1bC0xLjAyMS0uNjQzLTUuNjEtMy41M2ExLjM1IDEuMzUgMCAwIDAtMS4zODMtLjAzbC0xLjAzNC41ODhjLS4zNi4yMDUtLjU4Mi41ODMtLjU4Mi45OTN2OS4wMDNjMCAuMzUuMTkuNjcyLjQ5OC44NDVsMS42Mi45MTFhLjkwNC45MDQgMCAwIDAgLjkyLS4wMjFsNC45NC0zLjA5NS40ODQtLjMwMi4wMDctLjAwNSAxLjE2MS0uNzNhMi4zNDQgMi4zNDQgMCAwIDAgLjY1My0zLjM4eiIvPgogICAgICAgIDxmaWx0ZXIgaWQ9ImYiIHdpZHRoPSIxMTguNiUiIGhlaWdodD0iMTE0LjclIiB4PSItOS4zJSIgeT0iLTQlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHk9Ii41IiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iLjI1Ii8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJzaGFkb3dCbHVyT3V0ZXIxIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDc5MjI4OTQwMiAwIi8+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbHRlcj0idXJsKCNhKSI+CiAgICAgICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9InVybCgjYikiLz4KICAgICAgICA8dXNlIGZpbGw9InVybCgjYykiIHhsaW5rOmhyZWY9IiNkIi8+CiAgICAgICAgPHVzZSBmaWxsPSIjMDAwIiBmaWx0ZXI9InVybCgjZSkiIHhsaW5rOmhyZWY9IiNkIi8+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2YpIiB4bGluazpocmVmPSIjZyIvPgogICAgICAgICAgICA8dXNlIGZpbGw9InVybCgjaCkiIHhsaW5rOmhyZWY9IiNnIi8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K";
}, , , , , , function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "API_URL", function() {
        return API_URL;
    });
    var API_URL = "https://api.fdvr.co/";
}, , , function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#f68b20" fill-rule="nonzero" d="M6.948 14.173c.86 0 1.556.434 1.556.97v3.888c0 .535.696.969 1.552.969h3.889c.857 0 1.552-.433 1.552-.969v-3.889c0-.535.702-.969 1.556-.969h1.937c.86 0 1.242-.393.865-.865l-7.162-8.952c-.383-.478-1.007-.472-1.385 0l-7.161 8.952c-.383.478.01.865.864.865h1.937z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M6.948 14.173c.86 0 1.556.434 1.556.97v3.888c0 .535.696.969 1.552.969h3.889c.857 0 1.552-.433 1.552-.969v-3.889c0-.535.702-.969 1.556-.969h1.937c.86 0 1.242-.393.865-.865l-7.162-8.952c-.383-.478-1.007-.472-1.385 0l-7.161 8.952c-.383.478.01.865.864.865h1.937z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f68b20" fill-rule="nonzero" d="M17.052 9.827c-.86 0-1.556-.434-1.556-.97V4.97c0-.535-.696-.969-1.552-.969h-3.889c-.857 0-1.552.433-1.552.969v3.889c0 .535-.702.969-1.556.969H5.01c-.86 0-1.242.393-.865.865l7.162 8.952c.383.478 1.007.472 1.385 0l7.161-8.952c.383-.478-.01-.865-.864-.865h-1.937z"></path></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#0d182688" fill-rule="nonzero" d="M17.052 9.827c-.86 0-1.556-.434-1.556-.97V4.97c0-.535-.696-.969-1.552-.969h-3.889c-.857 0-1.552.433-1.552.969v3.889c0 .535-.702.969-1.556.969H5.01c-.86 0-1.242.393-.865.865l7.162 8.952c.383.478 1.007.472 1.385 0l7.161-8.952c.383-.478-.01-.865-.864-.865h-1.937z"></path></svg>';
}, , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    var content = __webpack_require__(263);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("ca8f1caa", content, false, {});
    if (false) {}
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    var content = __webpack_require__(272);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("16ab522a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(275);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("6b774d55", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(277);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("fc169c9e", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(279);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("c81482d2", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(281);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("c3952d5e", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(283);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("53abb196", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(286);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("6e3c633b", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(288);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("087a2e4b", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(290);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("1622120a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(292);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("30d4cc36", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(294);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("6d3b1883", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(296);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("1375ca17", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(298);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("804900c6", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(300);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("b1bcc80a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(302);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("3eb6d356", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(305);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("3475e6fb", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(307);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("4dcf595a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(309);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("c8800696", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(311);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("15c9b5f7", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(313);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("62691bd2", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(315);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("2b63d2f9", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(317);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("a6125d4a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(319);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("8a4f9aae", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(321);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("8f499fd2", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(323);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("35365ed5", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(328);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("03ad475b", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(330);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("1b41957b", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(332);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("1ddd745e", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(334);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("6b8f2c5d", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(336);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("1c4d4a4e", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(338);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("8ac5350a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(340);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("18599c4a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(342);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("7e3bf69b", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(345);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("33cc065d", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(347);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("b9fd2b0a", content, false, {});
    if (false) {}
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(349);
    if (typeof content === "string") content = [ [ module.i, content, "" ] ];
    if (content.locals) module.exports = content.locals;
    var add = __webpack_require__(4).default;
    var update = add("5827ca9b", content, false, {});
    if (false) {}
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28"><defs><circle id="a" cx="13" cy="13" r="13"></circle></defs><g fill="none" fill-rule="evenodd"><use stroke="#868C93" transform="translate(1 1)" xlink:href="#a"></use><path fill="#868C93" fill-rule="nonzero" d="M14 20c.688 0 1.25-.554 1.25-1.23h-2.5c0 .676.556 1.23 1.25 1.23zm3.75-3.692V13.23c0-1.89-1.025-3.471-2.813-3.89v-.418A.93.93 0 0 0 14 8a.93.93 0 0 0-.938.923v.419c-1.793.418-2.812 1.993-2.812 3.889v3.077L9 17.538v.616h10v-.616l-1.25-1.23z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M16 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 2.99 1.34 2.99 3-1.33 3-2.99 3zm-8 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 2.99 1.34 2.99 3S9.66 11 8 11zm0 2c2.33 0 7 1.17 7 3.5V19H1v-2.5C1 14.17 5.67 13 8 13zm8 0c2.33 0 7 1.17 7 3.5V19h-6v-2.5c0-1.48-.81-2.61-1.97-3.45.35-.03.68-.05.97-.05z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-4.894-4.553a1 1 0 0 1 1.788-.894c.065.13.261.39.606.666.607.486 1.419.781 2.5.781s1.893-.295 2.5-.78c.345-.277.54-.538.606-.667a1 1 0 0 1 1.788.894c-.185.37-.551.86-1.144 1.334C14.794 17.545 13.544 18 12 18s-2.794-.455-3.75-1.22c-.593-.473-.96-.962-1.144-1.333zM7 10.25C7 9.56 7.555 9 8.25 9c.69 0 1.25.555 1.25 1.25 0 .69-.555 1.25-1.25 1.25-.69 0-1.25-.555-1.25-1.25zm8 0c0-.69.555-1.25 1.25-1.25.69 0 1.25.555 1.25 1.25 0 .69-.555 1.25-1.25 1.25-.69 0-1.25-.555-1.25-1.25z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" d="M10 12H8v1h2v2h1v-2h2v2h1v-2h2v-1h-2V9h2V8h-2V6h-1v2h-2V6h-1v2H8v1h2v3zm1 0V9h2v3h-2zm8-5.692v14.513c0 .17-.181.23-.403.133l-6.194-2.69a1.16 1.16 0 0 0-.806 0l-6.194 2.69c-.222.096-.403.036-.403-.133V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1.308z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><style type="text/css"> .st0{fill:#0d182688;} </style><path class="st0" d="M10,0C4.47717,0,0,4.47711,0,10c0,5.52283,4.47717,10,10,10s10-4.47717,10-10C20,4.47711,15.52283,0,10,0z M7.34918,14.19409c-0.85059-0.00574-1.54279-0.70123-1.54205-1.54944c0.00073-0.85767,0.70355-1.55328,1.56195-1.54614 c0.85321,0.0072,1.54016,0.70203,1.53442,1.55194C8.89771,13.50879,8.2019,14.19983,7.34918,14.19409z M11.8385,14.1994 c-0.01154,0.00177-0.02234,0.00928-0.03339,0.0141c-0.03754,0-0.07507,0-0.11255,0c-0.1626-0.0332-0.31897-0.07837-0.44714-0.1936 c-0.15845-0.14227-0.25647-0.31543-0.26483-0.52899c-0.01703-0.43475-0.05029-0.86713-0.18396-1.28424 c-0.52039-1.62366-1.60687-2.65247-3.25946-3.0705C7.26422,9.06714,6.97583,9.02991,6.69458,9.03003 c-0.44482,0.00018-0.80579-0.1972-0.90991-0.68689c0-0.0625,0-0.125,0-0.1875c0.04352-0.19232,0.11853-0.36584,0.2757-0.49652 c0.15363-0.12775,0.32892-0.18811,0.52661-0.18463c1.79437,0.03174,3.28967,0.71991,4.47589,2.06372 c0.76074,0.86182,1.21771,1.87305,1.39032,3.0083c0.04346,0.28595,0.0575,0.57794,0.0639,0.86755 C12.52631,13.82867,12.24976,14.13782,11.8385,14.1994z M15.05872,14.05878c-0.11322,0.07416-0.25513,0.10455-0.38409,0.15472 c-0.03748,0-0.07501,0-0.11255,0c-0.01447-0.00494-0.02869-0.0127-0.04352-0.01453 c-0.26825-0.03271-0.46222-0.17285-0.59064-0.40771c-0.09381-0.17151-0.09241-0.35999-0.09546-0.5473 c-0.00909-0.56171-0.08911-1.11401-0.2326-1.65607c-0.29755-1.12427-0.83417-2.12238-1.60883-2.98962 c-0.81445-0.91168-1.79736-1.57941-2.94611-1.9986c-0.78107-0.28503-1.58881-0.42902-2.42096-0.4339 c-0.33704-0.00201-0.60132-0.1358-0.75092-0.44666c-0.0473-0.09827-0.05988-0.2132-0.08838-0.3205c0-0.00629,0-0.01251,0-0.0188 c0.00537-0.02045,0.0141-0.04065,0.01562-0.0614C5.828,4.93219,6.16479,4.59528,6.62384,4.61621 c0.33997,0.01556,0.68048,0.03333,1.01862,0.06958c0.81866,0.08795,1.60828,0.29926,2.36151,0.62854 c2.10327,0.91931,3.6441,2.42084,4.60455,4.50781c0.52185,1.13391,0.76819,2.33154,0.77802,3.57849 C15.38867,13.6745,15.28955,13.90753,15.05872,14.05878z"></path></svg>';
}, function(module, exports) {
    module.exports = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 21" style="enable-background:new 0 0 24 21;" xml:space="preserve"><style type="text/css"> .st0{fill:#0d182688;} </style><path class="st0" d="M23.96845,8.08875C23.58216,3.55261,19.55011,0,14.78839,0H9.25006c-4.86993,0-8.92407,3.62842-9.2301,8.26001 c-0.17535,2.66266,0.80902,5.14429,2.77142,6.99017c1.67572,1.57654,3.98114,2.44421,6.49066,2.44421h1.67078l5.29181,3.08179 C16.50153,20.92511,16.78998,21,17.07886,21c0.28259,0,0.56525-0.07135,0.81805-0.2149 c0.51831-0.2934,0.82794-0.82129,0.82794-1.41248v-2.47809C22.15479,15.35895,24.28803,11.82776,23.96845,8.08875z M6.87769,10.72296c-0.98029,0-1.7749-0.78607-1.7749-1.75574c0-0.96973,0.79462-1.7558,1.7749-1.7558 c0.98022,0,1.77484,0.78607,1.77484,1.7558C8.65253,9.93689,7.85791,10.72296,6.87769,10.72296z M12.00037,10.72296 c-0.98022,0-1.77484-0.78607-1.77484-1.75574c0-0.96973,0.79462-1.7558,1.77484-1.7558s1.7749,0.78607,1.7749,1.7558 C13.77527,9.93689,12.98059,10.72296,12.00037,10.72296z M17.12311,10.72296c-0.98029,0-1.7749-0.78607-1.7749-1.75574 c0-0.96973,0.79462-1.7558,1.7749-1.7558c0.98022,0,1.7749,0.78607,1.7749,1.7558 C18.89801,9.93689,18.10333,10.72296,17.12311,10.72296z"></path></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M23 13.374l-2.972.496a8.202 8.202 0 0 1-1.032 2.484l1.757 2.451-1.948 1.945L16.354 19a8.15 8.15 0 0 1-2.486 1.027L13.372 23h-2.749l-.499-2.974a8.189 8.189 0 0 1-2.478-1.027L5.195 20.75 3.25 18.805 5 16.354a8.27 8.27 0 0 1-1.032-2.484L1 13.374v-2.751l2.969-.496c.21-.894.56-1.727 1.032-2.483L3.25 5.194l1.945-1.947 2.451 1.754a8.337 8.337 0 0 1 2.478-1.032L10.623 1h2.749l.496 2.969c.894.21 1.73.562 2.486 1.032l2.451-1.754 1.948 1.948-1.757 2.449c.473.758.826 1.589 1.032 2.483l2.972.496v2.751zm-11.003 4.123c3.04 0 5.5-2.462 5.5-5.5a5.496 5.496 0 0 0-5.5-5.497 5.499 5.499 0 0 0 0 10.997z"></path></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_profile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_profile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_profile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, , , , function(module, exports) {
    module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iIzZBNkE2QSIgZD0iTTExLjgyOSAxMi4wOTVjLTEuMzU5IDAtNS4wOS44NzktNS4wOSAzLjcwNyAwIC40ODQuMTczLjg4NC41MjcgMS4yMjIgMS4wOTMgMS4wNDIgMy42NCAxLjE4NCA0LjU0NSAxLjE1LjA2My4wMDIgMy4yNjcuMTAyIDQuNTgtMS4xNTFhMS42MSAxLjYxIDAgMCAwIC41MjctMS4yMjFjMC0yLjgyOC0zLjczMS0zLjcwNy01LjA5LTMuNzA3bS4yNCA2Ljk4NGMtLjE0NSAwLS4yMzYtLjAwMy0uMjU3LS4wMDQtLjExNi4wMDctMy41ODEuMTItNS4xNzctMS40MDFhMi41MDIgMi41MDIgMCAwIDEtLjgwNS0xLjg3MmMwLTMuNDQ4IDQuMTItNC42MDggNi00LjYwOCAxLjg3OSAwIDYgMS4xNiA2IDQuNjA4IDAgLjczMi0uMjcyIDEuMzYyLS44MDYgMS44NzItMS4zNjQgMS4yOTgtNC4xIDEuNDA1LTQuOTU1IDEuNDA1Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzZBNkE2QSIgZD0iTTEyIDYuMTA4Yy0xLjQgMC0yLjU0IDEuMTQtMi41NCAyLjUzOSAwIDEuNCAxLjE0IDIuNTQgMi41NCAyLjU0IDEuNCAwIDIuNTQtMS4xNCAyLjU0LTIuNTQgMC0xLjQtMS4xNC0yLjUzOS0yLjU0LTIuNTM5bTAgNS45NjhhMy40MzMgMy40MzMgMCAwIDEtMy40MjktMy40MjlBMy40MzIgMy40MzIgMCAwIDEgMTIgNS4yMTlhMy40MzIgMy40MzIgMCAwIDEgMy40MjkgMy40MjhBMy40MzMgMy40MzMgMCAwIDEgMTIgMTIuMDc2Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzc4Nzg3OCIgZD0iTTExLjg1IDEuMTk5QzUuODEzIDEuMTk5LjkgNi4xMTIuOSAxMi4xNDljMCA2LjAzOCA0LjkxMiAxMC45NSAxMC45NSAxMC45NSA2LjAzOSAwIDEwLjk1LTQuOTEyIDEwLjk1LTEwLjk1QzIyLjggNi4xMTIgMTcuODkgMS4yIDExLjg1IDEuMm0wIDIyLjhDNS4zMTcgMjQgMCAxOC42ODUgMCAxMi4xNSAwIDUuNjE1IDUuMzE2LjMgMTEuODUuM2M2LjUzNSAwIDExLjg1MSA1LjMxNiAxMS44NTEgMTEuODUgMCA2LjUzNS01LjMxNiAxMS44NS0xMS44NSAxMS44NSIvPgogICAgPC9nPgo8L3N2Zz4K";
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0D1826" fill-rule="nonzero" d="M10 8V4l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path fill="#0D1826" fill-opacity=".5" fill-rule="nonzero" d="M7 10l5 5 5-5z"></path></g></svg>';
}, function(module, exports, __webpack_require__) {
    var map = {
        "./af": 45,
        "./af.js": 45,
        "./ar": 46,
        "./ar-dz": 47,
        "./ar-dz.js": 47,
        "./ar-kw": 48,
        "./ar-kw.js": 48,
        "./ar-ly": 49,
        "./ar-ly.js": 49,
        "./ar-ma": 50,
        "./ar-ma.js": 50,
        "./ar-sa": 51,
        "./ar-sa.js": 51,
        "./ar-tn": 52,
        "./ar-tn.js": 52,
        "./ar.js": 46,
        "./az": 53,
        "./az.js": 53,
        "./be": 54,
        "./be.js": 54,
        "./bg": 55,
        "./bg.js": 55,
        "./bm": 56,
        "./bm.js": 56,
        "./bn": 57,
        "./bn-bd": 58,
        "./bn-bd.js": 58,
        "./bn.js": 57,
        "./bo": 59,
        "./bo.js": 59,
        "./br": 60,
        "./br.js": 60,
        "./bs": 61,
        "./bs.js": 61,
        "./ca": 62,
        "./ca.js": 62,
        "./cs": 63,
        "./cs.js": 63,
        "./cv": 64,
        "./cv.js": 64,
        "./cy": 65,
        "./cy.js": 65,
        "./da": 66,
        "./da.js": 66,
        "./de": 67,
        "./de-at": 68,
        "./de-at.js": 68,
        "./de-ch": 69,
        "./de-ch.js": 69,
        "./de.js": 67,
        "./dv": 70,
        "./dv.js": 70,
        "./el": 71,
        "./el.js": 71,
        "./en-au": 72,
        "./en-au.js": 72,
        "./en-ca": 73,
        "./en-ca.js": 73,
        "./en-gb": 74,
        "./en-gb.js": 74,
        "./en-ie": 75,
        "./en-ie.js": 75,
        "./en-il": 76,
        "./en-il.js": 76,
        "./en-in": 77,
        "./en-in.js": 77,
        "./en-nz": 78,
        "./en-nz.js": 78,
        "./en-sg": 79,
        "./en-sg.js": 79,
        "./eo": 80,
        "./eo.js": 80,
        "./es": 81,
        "./es-do": 82,
        "./es-do.js": 82,
        "./es-mx": 83,
        "./es-mx.js": 83,
        "./es-us": 84,
        "./es-us.js": 84,
        "./es.js": 81,
        "./et": 85,
        "./et.js": 85,
        "./eu": 86,
        "./eu.js": 86,
        "./fa": 87,
        "./fa.js": 87,
        "./fi": 88,
        "./fi.js": 88,
        "./fil": 89,
        "./fil.js": 89,
        "./fo": 90,
        "./fo.js": 90,
        "./fr": 91,
        "./fr-ca": 92,
        "./fr-ca.js": 92,
        "./fr-ch": 93,
        "./fr-ch.js": 93,
        "./fr.js": 91,
        "./fy": 94,
        "./fy.js": 94,
        "./ga": 95,
        "./ga.js": 95,
        "./gd": 96,
        "./gd.js": 96,
        "./gl": 97,
        "./gl.js": 97,
        "./gom-deva": 98,
        "./gom-deva.js": 98,
        "./gom-latn": 99,
        "./gom-latn.js": 99,
        "./gu": 100,
        "./gu.js": 100,
        "./he": 101,
        "./he.js": 101,
        "./hi": 102,
        "./hi.js": 102,
        "./hr": 103,
        "./hr.js": 103,
        "./hu": 104,
        "./hu.js": 104,
        "./hy-am": 105,
        "./hy-am.js": 105,
        "./id": 106,
        "./id.js": 106,
        "./is": 107,
        "./is.js": 107,
        "./it": 108,
        "./it-ch": 109,
        "./it-ch.js": 109,
        "./it.js": 108,
        "./ja": 110,
        "./ja.js": 110,
        "./jv": 111,
        "./jv.js": 111,
        "./ka": 112,
        "./ka.js": 112,
        "./kk": 113,
        "./kk.js": 113,
        "./km": 114,
        "./km.js": 114,
        "./kn": 115,
        "./kn.js": 115,
        "./ko": 116,
        "./ko.js": 116,
        "./ku": 117,
        "./ku.js": 117,
        "./ky": 118,
        "./ky.js": 118,
        "./lb": 119,
        "./lb.js": 119,
        "./lo": 120,
        "./lo.js": 120,
        "./lt": 121,
        "./lt.js": 121,
        "./lv": 122,
        "./lv.js": 122,
        "./me": 123,
        "./me.js": 123,
        "./mi": 124,
        "./mi.js": 124,
        "./mk": 125,
        "./mk.js": 125,
        "./ml": 126,
        "./ml.js": 126,
        "./mn": 127,
        "./mn.js": 127,
        "./mr": 128,
        "./mr.js": 128,
        "./ms": 129,
        "./ms-my": 130,
        "./ms-my.js": 130,
        "./ms.js": 129,
        "./mt": 131,
        "./mt.js": 131,
        "./my": 132,
        "./my.js": 132,
        "./nb": 133,
        "./nb.js": 133,
        "./ne": 134,
        "./ne.js": 134,
        "./nl": 135,
        "./nl-be": 136,
        "./nl-be.js": 136,
        "./nl.js": 135,
        "./nn": 137,
        "./nn.js": 137,
        "./oc-lnc": 138,
        "./oc-lnc.js": 138,
        "./pa-in": 139,
        "./pa-in.js": 139,
        "./pl": 140,
        "./pl.js": 140,
        "./pt": 141,
        "./pt-br": 142,
        "./pt-br.js": 142,
        "./pt.js": 141,
        "./ro": 143,
        "./ro.js": 143,
        "./ru": 144,
        "./ru.js": 144,
        "./sd": 145,
        "./sd.js": 145,
        "./se": 146,
        "./se.js": 146,
        "./si": 147,
        "./si.js": 147,
        "./sk": 148,
        "./sk.js": 148,
        "./sl": 149,
        "./sl.js": 149,
        "./sq": 150,
        "./sq.js": 150,
        "./sr": 151,
        "./sr-cyrl": 152,
        "./sr-cyrl.js": 152,
        "./sr.js": 151,
        "./ss": 153,
        "./ss.js": 153,
        "./sv": 154,
        "./sv.js": 154,
        "./sw": 155,
        "./sw.js": 155,
        "./ta": 156,
        "./ta.js": 156,
        "./te": 157,
        "./te.js": 157,
        "./tet": 158,
        "./tet.js": 158,
        "./tg": 159,
        "./tg.js": 159,
        "./th": 160,
        "./th.js": 160,
        "./tk": 161,
        "./tk.js": 161,
        "./tl-ph": 162,
        "./tl-ph.js": 162,
        "./tlh": 163,
        "./tlh.js": 163,
        "./tr": 164,
        "./tr.js": 164,
        "./tzl": 165,
        "./tzl.js": 165,
        "./tzm": 166,
        "./tzm-latn": 167,
        "./tzm-latn.js": 167,
        "./tzm.js": 166,
        "./ug-cn": 168,
        "./ug-cn.js": 168,
        "./uk": 169,
        "./uk.js": 169,
        "./ur": 170,
        "./ur.js": 170,
        "./uz": 171,
        "./uz-latn": 172,
        "./uz-latn.js": 172,
        "./uz.js": 171,
        "./vi": 173,
        "./vi.js": 173,
        "./x-pseudo": 174,
        "./x-pseudo.js": 174,
        "./yo": 175,
        "./yo.js": 175,
        "./zh-cn": 176,
        "./zh-cn.js": 176,
        "./zh-hk": 177,
        "./zh-hk.js": 177,
        "./zh-mo": 178,
        "./zh-mo.js": 178,
        "./zh-tw": 179,
        "./zh-tw.js": 179
    };
    function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
    }
    function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
            var e = new Error("Cannot find module '" + req + "'");
            e.code = "MODULE_NOT_FOUND";
            throw e;
        }
        return map[req];
    }
    webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
    };
    webpackContext.resolve = webpackContextResolve;
    module.exports = webpackContext;
    webpackContext.id = 270;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_votes_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(180);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_votes_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_votes_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#000" d="M21 11.023c0 1.047-.167 2.003-.502 2.87-.334.867-.804 1.542-1.41 2.025a3.273 3.273 0 0 1-2.1.725c-.587 0-1.096-.154-1.527-.461a2.233 2.233 0 0 1-.87-1.252h-.133c-.365.571-.814 1-1.349 1.285-.535.285-1.137.428-1.806.428-1.21 0-2.164-.384-2.858-1.153-.695-.768-1.043-1.807-1.043-3.117 0-1.507.461-2.73 1.383-3.671.92-.94 2.158-1.41 3.711-1.41.565 0 1.19.049 1.878.148.687.098 1.298.236 1.833.411l-.245 5.104v.263c0 1.171.387 1.756 1.16 1.756.586 0 1.053-.373 1.398-1.12.346-.745.518-1.697.518-2.853 0-1.251-.26-2.35-.78-3.298a5.357 5.357 0 0 0-2.218-2.19c-.958-.512-2.058-.768-3.299-.768-1.582 0-2.959.322-4.13.966a6.457 6.457 0 0 0-2.68 2.76c-.616 1.197-.925 2.585-.925 4.166 0 2.122.576 3.753 1.728 4.895 1.151 1.141 2.805 1.712 4.96 1.712 1.642 0 3.354-.33 5.138-.988v1.8c-1.56.63-3.259.944-5.094.944-2.75 0-4.893-.73-6.43-2.19C3.768 17.35 3 15.315 3 12.702c0-1.91.416-3.609 1.248-5.098.832-1.489 1.986-2.628 3.461-3.419C9.184 3.395 10.854 3 12.719 3c1.612 0 3.048.33 4.308.988a7.076 7.076 0 0 1 2.93 2.815C20.654 8.021 21 9.428 21 11.023zM9.542 12.417c0 1.705.68 2.557 2.04 2.557 1.434 0 2.218-1.072 2.352-3.215l.133-2.624a5.84 5.84 0 0 0-1.504-.186c-.951 0-1.692.31-2.224.933-.531.622-.797 1.467-.797 2.535z"></path></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_suggested_users_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_suggested_users_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_suggested_users_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_commentArea_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(182);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_commentArea_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_commentArea_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_likeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(185);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_likeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_likeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28"><defs><circle id="a" cx="13" cy="13" r="13"></circle><path id="c" d="M0 0h10v11H0z"></path></defs><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><mask id="b" fill="#fff"><use xlink:href="#a"></use></mask><use stroke="#868C93" xlink:href="#a"></use><g mask="url(#b)"><g transform="translate(8 8)"><mask id="d" fill="#fff"><use xlink:href="#c"></use></mask><path fill="#868C93" d="M6.901 4.853H5.457V6.38h-.914V4.853H3.098v-.967h1.445V2.36h.914v1.526H6.9v.967zM8.724 0H1.276C.57 0 0 .604 0 1.35V11h.44L5 8.828 9.677 11H10V1.35C10 .603 9.429 0 8.724 0z" mask="url(#d)"></path></g></g></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comments_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(186);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comments_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comments_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_authorization_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(187);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_authorization_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_authorization_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_navigation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(188);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_navigation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_navigation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_usersList_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(189);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_usersList_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_usersList_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(190);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_share_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(191);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_share_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_share_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reactionsFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(192);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reactionsFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reactionsFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resource_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(193);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resource_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resource_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_myReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(194);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_myReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_myReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M6 19V7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm2.46-7.12L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12-1.41-1.41L12 12.59l-2.13-2.12-1.41 1.41zM15.5 4H19v2H5V4h3.5l1-1h5l1 1z"></path></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmark_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(195);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmark_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmark_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmarks_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(196);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmarks_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_bookmarks_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_comment_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reaction_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(198);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reaction_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_reaction_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_relation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(199);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_relation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_relation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceWatch_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(200);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceWatch_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resourceWatch_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notification_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(201);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notification_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notification_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notifications_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notifications_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_notifications_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(203);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userReactions_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userProfile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(204);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userProfile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_userProfile_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" d="M10.212 15.222l-1.753 1.45-2.553-2.936-3.485 2.527L0 13.69 12 5l12 8.691-2.42 2.572-3.486-2.527-2.553 2.936-1.753-1.45L12 17z"></path></g></svg>';
}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#0d182688" fill-rule="nonzero" d="M19 3H5c-1.11 0-2 .89-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-8.92 12.58L11.5 17l5-5-5-5-1.42 1.41L12.67 11H3v2h9.67l-2.59 2.58z"></path></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(205);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_feed_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(206);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_feed_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_feed_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_onboardingHeader_vue_vue_type_style_index_0_id_78332336_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_onboardingHeader_vue_vue_type_style_index_0_id_78332336_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_onboardingHeader_vue_vue_type_style_index_0_id_78332336_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_welcome_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(208);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_welcome_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_welcome_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_discuss_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(209);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_discuss_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_discuss_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_loginAfterOnboarding_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(210);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_loginAfterOnboarding_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_loginAfterOnboarding_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(211);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_activity_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_periodFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(212);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_periodFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_periodFilter_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, exports) {
    module.exports = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 20"><defs><path id="a" d="M0 0h23v20H0z"></path></defs><g fill="none" fill-rule="evenodd">\x3c!-- <mask id="b" fill="#fff"><use xlink:href="#a"></use></mask> --\x3e<path fill="#0d182688" d="M18.221 9.026c-.074.198-.19.367-.337.513a1.689 1.689 0 0 1-.518.345 1.63 1.63 0 0 1-1.211 0 1.625 1.625 0 0 1-.506-.345 1.598 1.598 0 0 1-.349-.513 1.439 1.439 0 0 1-.115-.596c0-.105.01-.211.03-.304.023-.105.043-.2.085-.294.043-.094.095-.188.149-.272a1.39 1.39 0 0 1 .2-.242 2.21 2.21 0 0 1 .23-.199c.085-.05.18-.104.276-.135a1.522 1.522 0 0 1 .917-.094c.105.02.2.052.294.094.095.03.191.084.274.135.085.063.169.127.244.2.074.073.137.158.188.241.065.084.107.178.15.272a1.456 1.456 0 0 1 .126.598c0 .209-.043.407-.127.596m-5.26 0a1.46 1.46 0 0 1-.35.513 1.567 1.567 0 0 1-1.117.461c-.21 0-.41-.041-.6-.116a1.684 1.684 0 0 1-.517-.345 1.42 1.42 0 0 1-.339-.513 1.465 1.465 0 0 1-.094-.9c.022-.105.052-.2.094-.294.043-.094.085-.188.15-.272.052-.083.114-.168.189-.242a2.35 2.35 0 0 1 .242-.199c.085-.05.18-.104.274-.135a1.33 1.33 0 0 1 .296-.094 1.576 1.576 0 0 1 1.624.67c.053.084.106.178.148.272.042.095.062.19.084.294.02.093.032.199.032.304 0 .209-.032.407-.116.596m-5.262 0a1.58 1.58 0 0 1-.349.513 1.633 1.633 0 0 1-.505.345 1.632 1.632 0 0 1-1.212 0 1.593 1.593 0 0 1-.518-.345 1.4 1.4 0 0 1-.336-.513 1.449 1.449 0 0 1-.095-.9c.021-.105.053-.2.095-.294.03-.094.084-.188.137-.272.062-.083.127-.168.2-.242a2.48 2.48 0 0 1 .243-.199c.084-.05.18-.104.274-.135a1.503 1.503 0 0 1 1.2 0c.107.03.192.084.276.135.095.063.169.127.241.2.075.073.137.158.202.241.052.084.105.178.147.272.032.095.063.19.085.294.02.093.031.199.031.304 0 .209-.042.407-.116.596M22.97 7.564C22.61 3.323 18.844 0 14.394 0h-5.75C4.093 0 .304 3.393.019 7.726c-.162 2.47.758 4.815 2.582 6.538 1.622 1.532 3.838 2.287 6.077 2.287h1.997l5.718 3.345a.751.751 0 0 0 1.131-.643V16.03c3.53-1.289 5.764-4.747 5.447-8.466" mask="url(#b)"></path></g></svg>';
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenLikeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(213);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenLikeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenLikeDislike_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenButton_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(214);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenButton_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_screenButton_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_app_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(215);
    var _node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_app_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_app_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
}, function(module, exports, __webpack_require__) {}, , , , , function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var vue_common = __webpack_require__(25);
    var vue_common_default = __webpack_require__.n(vue_common);
    var vuex_esm = __webpack_require__(26);
    var config = __webpack_require__(10);
    var appvue_type_template_id_4caa6658_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("transition", {
            attrs: {
                name: "slide"
            }
        }, [ _c("div", [ _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.showMenu,
                expression: "showMenu"
            } ],
            staticClass: "fulldive-menu"
        }, [ !_vm.onboarding ? _c("div", [ _c("keep-alive", [ _c(_vm.onboardingSection, {
            tag: "component"
        }) ], 1) ], 1) : _c("div", [ _vm.isAuthorized ? _c("div", {
            staticClass: "fulldive-menu__logo"
        }) : _vm._e(), _vm._v(" "), _c("span", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isAuthorized && _vm.freshEvents > 0,
                expression: "isAuthorized && freshEvents > 0"
            } ],
            staticClass: "fulldive-menu__fresh"
        }, [ _vm._v("\n            " + _vm._s(_vm.freshEvents) + "\n        ") ]), _vm._v(" "), _c("button", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isAuthorized,
                expression: "isAuthorized"
            } ],
            staticClass: "menu-button",
            class: [ _vm.freshEvents > 0 ? "menu-button active" : "menu-button" ],
            attrs: {
                id: "notif-button"
            },
            domProps: {
                innerHTML: _vm._s("" + __webpack_require__(255))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Notifications");
                }
            }
        }), _vm._v(" "), _vm.isAuthorized && _vm.currentSection === "Comments" ? _c("a", {
            staticClass: "fulldive-menu__profile",
            on: {
                click: function($event) {
                    return _vm.showSection("Profile");
                }
            }
        }, [ _c("img", {
            staticClass: "avatar",
            attrs: {
                src: _vm.user.avatar.size.normal
            }
        }) ]) : _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isAuthorized,
                expression: "isAuthorized"
            } ],
            staticClass: "fulldive-menu__icon",
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }), _vm._v(" "), _vm.isAuthorized ? _c("div", {
            staticClass: "fulldive-menu__body"
        }, [ _c("keep-alive", [ _c(_vm.currentSection, {
            tag: "component"
        }) ], 1) ], 1) : _c("div", {
            staticClass: "fulldive-menu__body"
        }, [ _c("Authorization") ], 1) ]) ]), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.showMenu && _vm.screenButtonShown,
                expression: "!showMenu && screenButtonShown"
            } ]
        }, [ _c("ScreenButton") ], 1) ]) ]);
    };
    var staticRenderFns = [];
    appvue_type_template_id_4caa6658_render._withStripped = true;
    var profilevue_type_template_id_431112dc_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "profile fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("div", {
            staticClass: "profile-header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Profile") ]), _vm._v(" "), _c("div", {
            staticClass: "scroll-wrapper"
        }, [ _c("div", {
            staticClass: "profile__image"
        }, [ _c("img", {
            staticClass: "profile__image",
            attrs: {
                src: _vm.user.avatar.size.normal,
                alt: "avatar"
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "profile__name"
        }, [ _vm._v(_vm._s(_vm.user.username)) ]), _vm._v(" "), _vm.user.connectionCount > 0 ? _c("div", {
            staticClass: "profile__connections__self"
        }, [ _vm._v(_vm._s(_vm.user.connectionCount) + " connections") ]) : _vm._e(), _vm._v(" "), _vm.quote ? _c("div", {
            staticClass: "profile__quote"
        }, [ _vm._v(_vm._s(_vm.quote)) ]) : _vm._e(), _vm._v(" "), _c("div", {
            staticClass: "profile__navigation"
        }, [ _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(256) + " My Circle")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Friends");
                }
            }
        }), _vm._v(" "), _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(257) + " Reactions")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("MyReactions");
                }
            }
        }), _vm._v(" "), _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(258) + " Bookmarks")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Bookmarks");
                }
            }
        }), _vm._v(" "), _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(259) + " Feed")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Feed");
                }
            }
        }), _vm._v(" "), _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(260) + " Commenting Activity")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("CommentActivity");
                }
            }
        }), _vm._v(" "), _c("a", {
            staticClass: "profile__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(261) + " Settings")
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Settings");
                }
            }
        }) ]) ]) ]);
    };
    var profilevue_type_template_id_431112dc_staticRenderFns = [];
    profilevue_type_template_id_431112dc_render._withStripped = true;
    var common = __webpack_require__(0);
    var profilevue_type_script_lang_js_ = {
        computed: {
            user: function user() {
                return this.$store.state.user;
            }
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            }
        }
    };
    var components_profilevue_type_script_lang_js_ = profilevue_type_script_lang_js_;
    var profilevue_type_style_index_0_lang_less_ = __webpack_require__(262);
    var componentNormalizer = __webpack_require__(2);
    var component = Object(componentNormalizer["a"])(components_profilevue_type_script_lang_js_, profilevue_type_template_id_431112dc_render, profilevue_type_template_id_431112dc_staticRenderFns, false, null, null, null);
    if (false) {
        var api;
    }
    component.options.__file = "source/content/components/profile.vue";
    var profile = component.exports;
    var commentsvue_type_template_id_093606d1_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "comments fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "top"
        }, [ _c("div", {
            staticClass: "comments-header "
        }, [ _c("LikeDislike", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.resource,
                expression: "resource"
            } ],
            attrs: {
                resource: _vm.resource
            }
        }), _vm._v(" "), _c("AddBookmark", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.resource,
                expression: "resource"
            } ],
            attrs: {
                resource: _vm.resource
            }
        }) ], 1) ]), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.resource,
                expression: "resource"
            } ],
            staticClass: "comments__header"
        }, [ _c("CommentArea", {
            attrs: {
                resource: _vm.resource,
                activeSendButton: _vm.activeSendButton
            }
        }) ], 1), _vm._v(" "), _vm.idToFilterOn || _vm.filterId ? _c("a", {
            staticClass: "show-all",
            on: {
                click: _vm.showAllComments
            }
        }, [ _vm._v("Show all comments") ]) : _vm._e(), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.resource,
                expression: "resource"
            } ],
            staticClass: "comments__list"
        }, _vm._l(_vm.comments, function(comment) {
            return _c("Comment", _vm._b({
                key: comment.id
            }, "Comment", comment, false));
        }), 1) ]);
    };
    var commentsvue_type_template_id_093606d1_staticRenderFns = [];
    commentsvue_type_template_id_093606d1_render._withStripped = true;
    var filter = __webpack_require__(6);
    var filter_default = __webpack_require__.n(filter);
    var commentvue_type_template_id_9449a6dc_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "comment"
        }, [ _c("div", {
            staticClass: "comment__body"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            staticClass: "comment__avatar",
            attrs: {
                src: _vm.avatar
            },
            on: {
                load: _vm.loaded
            }
        }) ]), _vm._v(" "), _c("a", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.isLoad,
                expression: "!isLoad"
            } ]
        }, [ _c("img", {
            staticClass: "comment__avatar",
            attrs: {
                src: __webpack_require__(267)
            }
        }) ]), _vm._v(" "), _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile");
                }
            }
        }, [ _c("span", {
            staticClass: "comment__user"
        }, [ _vm._v(_vm._s(_vm.user.displayName)) ]) ]), _vm._v(" "), _vm.reactionType ? _c("span", {
            class: [ "main-reaction", "main-reaction_" + _vm.reactionType ],
            staticStyle: {
                opacity: "1"
            }
        }) : _vm._e(), _vm._v(" "), _c("br"), _vm._v(" "), _vm._l(_vm.commentText, function(item) {
            return _c("span", _vm._b({
                key: item,
                staticClass: "comment__text",
                class: {
                    highlighted: _vm.highlighted
                }
            }, "span", item, false), [ item.search(_vm.userRegex) !== -1 ? _c("span", {
                staticClass: "comment__mention",
                on: {
                    click: function($event) {
                        _vm.showUserProfile("UserProfile", item.split("/")[3].slice(0, -1));
                    }
                }
            }, [ _vm._v("@" + _vm._s(item.split("]")[0].slice(1))) ]) : _c("pre", [ _vm._v(_vm._s(item)) ]) ]);
        }), _vm._v(" "), _c("span", {
            staticClass: "comment__time"
        }, [ _vm._v(_vm._s(_vm.createdFromNow())) ]) ], 2), _vm._v(" "), _c("div", {
            staticClass: "comment__footer"
        }, [ _c("Votes", {
            attrs: {
                score: _vm.score,
                type: "comment",
                commentId: _vm.id,
                socialData: _vm.socialData,
                fakeId: _vm.fakeId
            }
        }), _vm._v(" "), _c("span", {
            staticClass: "comment__reply-cta",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(268))
            },
            on: {
                click: function($event) {
                    _vm.reply();
                    _vm.setShowRepliesByRepling();
                }
            }
        }), _vm._v(" "), _vm.replyCount > 0 ? _c("span", [ _vm.replyCount === 1 ? _c("span", {
            staticClass: "comment__replies-num"
        }, [ _vm._v("\n              1 reply\n          ") ]) : _c("span", {
            staticClass: "comment__replies-num"
        }, [ _vm._v("\n              " + _vm._s(_vm.replyCount) + " replies\n          ") ]) ]) : _vm._e(), _vm._v(" "), _vm.replyCount ? _c("span", {
            class: [ "comment__replies-toggle", _vm.showReplies && "comment__replies-toggle_active" ],
            domProps: {
                innerHTML: _vm._s(__webpack_require__(269))
            },
            on: {
                click: function($event) {
                    return _vm.setShowReplies();
                }
            }
        }) : _vm._e() ], 1), _vm._v(" "), _vm.showReplies ? _c("span", {
            staticClass: "comment__replies"
        }, _vm._l(_vm.replies, function(reply) {
            return _c("Comment", _vm._b({
                key: reply.id
            }, "Comment", reply, false));
        }), 1) : _vm._e(), _vm._v(" "), _vm.replyingTo ? _c("span", [ _c("CommentArea", {
            attrs: {
                showReplies: _vm.showReplies,
                replyingTo: _vm.replyingTo,
                fakeId: _vm.fakeId
            },
            on: {
                "update:showReplies": function($event) {
                    _vm.showReplies = $event;
                },
                "update:show-replies": function($event) {
                    _vm.showReplies = $event;
                },
                "update:replyingTo": function($event) {
                    _vm.replyingTo = $event;
                },
                "update:replying-to": function($event) {
                    _vm.replyingTo = $event;
                }
            }
        }) ], 1) : _vm._e() ]);
    };
    var commentvue_type_template_id_9449a6dc_staticRenderFns = [];
    commentvue_type_template_id_9449a6dc_render._withStripped = true;
    var moment = __webpack_require__(1);
    var moment_default = __webpack_require__.n(moment);
    var votesvue_type_template_id_0d100ebc_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "votes",
            class: _vm.type === "comment" && "votes_small"
        }, [ _vm.socialData.myVote === "upvote" ? _c("a", {
            staticClass: "cta cta_vote-up",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(21))
            },
            on: {
                click: function($event) {
                    return _vm.updateVote("upvote");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-up ",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(22))
            },
            on: {
                click: function($event) {
                    return _vm.updateVote("upvote");
                }
            }
        }), _vm._v(" "), _vm.score > 0 ? _c("div", {
            staticClass: "votes__count active"
        }, [ _vm._v(_vm._s(_vm.score)) ]) : _vm._e(), _vm._v(" "), _vm.score <= 0 ? _c("div", {
            staticClass: "votes__count"
        }, [ _vm._v(" - ") ]) : _vm._e(), _vm._v(" "), _vm.socialData.myVote === "downvote" ? _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(23))
            },
            on: {
                click: function($event) {
                    return _vm.updateVote("downvote");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(24))
            },
            on: {
                click: function($event) {
                    return _vm.updateVote("downvote");
                }
            }
        }) ]);
    };
    var votesvue_type_template_id_0d100ebc_staticRenderFns = [];
    votesvue_type_template_id_0d100ebc_render._withStripped = true;
    var votesvue_type_script_lang_js_ = {
        props: [ "score", "type", "commentId", "socialData", "fakeId" ],
        methods: {
            updateVote: function updateVote(vote) {
                var comments = this.$store.state.comments;
                var data = {
                    commentId: this.commentId,
                    skip: 0,
                    type: vote,
                    method: "",
                    comments: comments
                };
                if (this.socialData.myVote === vote && vote === "upvote") {
                    data.method = "delete";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "";
                        data.comments[this.commentId].score -= 1;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "";
                        data.comments[this.fakeId].score -= 1;
                    }
                } else if (this.socialData.myVote === vote && vote === "downvote") {
                    data.method = "delete";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "";
                        data.comments[this.commentId].score += 1;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "";
                        data.comments[this.fakeId].score += 1;
                    }
                } else if (this.socialData.myVote === "" && vote === "upvote") {
                    data.method = "post";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "upvote";
                        data.comments[this.commentId].score += 1;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "upvote";
                        data.comments[this.fakeId].score += 1;
                    }
                } else if (this.socialData.myVote === "" && vote === "downvote") {
                    data.method = "post";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "downvote";
                        data.comments[this.commentId].score -= 1;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "downvote";
                        data.comments[this.fakeId].score -= 1;
                    }
                } else if (this.socialData.myVote === "upvote" && vote === "downvote") {
                    data.method = "post";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "downvote";
                        data.comments[this.commentId].score -= 2;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "downvote";
                        data.comments[this.fakeId].score -= 2;
                    }
                } else if (this.socialData.myVote === "downvote" && vote === "upvote") {
                    data.method = "post";
                    if (data.comments[this.commentId]) {
                        data.comments[this.commentId].socialData.myVote = "upvote";
                        data.comments[this.commentId].score += 2;
                    } else if (data.comments[this.fakeId]) {
                        data.comments[this.fakeId].socialData.myVote = "upvote";
                        data.comments[this.fakeId].score += 2;
                    }
                }
                data.comments = comments;
                Object(common["e"])({
                    module: "comments",
                    action: "update-vote",
                    data: data
                });
            }
        }
    };
    var components_votesvue_type_script_lang_js_ = votesvue_type_script_lang_js_;
    var votesvue_type_style_index_0_lang_less_ = __webpack_require__(271);
    var votes_component = Object(componentNormalizer["a"])(components_votesvue_type_script_lang_js_, votesvue_type_template_id_0d100ebc_render, votesvue_type_template_id_0d100ebc_staticRenderFns, false, null, null, null);
    if (false) {
        var votes_api;
    }
    votes_component.options.__file = "source/content/components/votes.vue";
    var votes = votes_component.exports;
    var commentAreavue_type_template_id_e9c67482_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "comment-area"
        }, [ _c("div", {
            staticClass: "comment-area__input",
            attrs: {
                contenteditable: ""
            },
            on: {
                focus: _vm.stopPropagation,
                input: function($event) {
                    _vm.checkTagging();
                    _vm.check();
                },
                keypress: function($event) {
                    if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
                        return null;
                    }
                    if (!$event.ctrlKey) {
                        return null;
                    }
                    return _vm.sendComment($event);
                }
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "comment-area__toolbox"
        }, [ _c("a", {
            staticClass: "comment-area__tag",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(273))
            },
            on: {
                click: function($event) {
                    return _vm.toggleSuggestedUsers();
                }
            }
        }), _vm._v(" "), _c("Reactions", {
            attrs: {
                activeReaction: _vm.activeReaction
            },
            on: {
                "update:activeReaction": function($event) {
                    _vm.activeReaction = $event;
                },
                "update:active-reaction": function($event) {
                    _vm.activeReaction = $event;
                }
            }
        }), _vm._v(" "), _c("div", {
            class: [ _vm.activeSendButton ? "comment-area__cta__active" : "comment-area__cta" ],
            on: {
                click: _vm.sendComment
            }
        }, [ _c("div", [ _vm._v("Send") ]) ]) ], 1), _vm._v(" "), _vm.suggestedUsers.length > 0 || _vm.toggledSuggested ? _c("div", {
            staticClass: "scroll-wrapper suggested-users"
        }, [ _c("SuggestedUsers", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.suggestedUsers.length > 0 || _vm.toggledSuggested,
                expression: "suggestedUsers.length > 0 || toggledSuggested"
            } ],
            attrs: {
                users: _vm.suggestedUsers,
                toggledSuggested: _vm.toggledSuggested
            },
            on: {
                getSuggestedUsers: _vm.getSuggestedUsers,
                changeInput: _vm.changeInput,
                "update:users": function($event) {
                    _vm.suggestedUsers = $event;
                }
            }
        }) ], 1) : _vm._e() ]);
    };
    var commentAreavue_type_template_id_e9c67482_staticRenderFns = [];
    commentAreavue_type_template_id_e9c67482_render._withStripped = true;
    var reactionsvue_type_template_id_401c5d46_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "reactions"
        }, _vm._l(_vm.$options.constants.reactions, function(value, key) {
            return _c("div", {
                key: key,
                class: [ "reaction", "reaction_" + value, value === _vm.activeReaction ? "reaction_active" : null ],
                on: {
                    click: function($event) {
                        return _vm.updateReactions(value);
                    }
                }
            });
        }), 0);
    };
    var reactionsvue_type_template_id_401c5d46_staticRenderFns = [];
    reactionsvue_type_template_id_401c5d46_render._withStripped = true;
    var reactionsvue_type_script_lang_js_ = {
        props: [ "activeReaction" ],
        constants: {
            reactions: [ "lol", "wow", "love", "scary", "win", "wtf", "sad", "angry" ]
        },
        methods: {
            updateReactions: function updateReactions(value) {
                if (this.activeReactions === value) {
                    this.activeReactions = "";
                    this.$emit("update:activeReaction", "");
                } else {
                    this.activeReactions = value;
                    this.$emit("update:activeReaction", value);
                }
            }
        }
    };
    var components_reactionsvue_type_script_lang_js_ = reactionsvue_type_script_lang_js_;
    var reactions_component = Object(componentNormalizer["a"])(components_reactionsvue_type_script_lang_js_, reactionsvue_type_template_id_401c5d46_render, reactionsvue_type_template_id_401c5d46_staticRenderFns, false, null, null, null);
    if (false) {
        var reactions_api;
    }
    reactions_component.options.__file = "source/content/components/reactions.vue";
    var reactions = reactions_component.exports;
    var suggested_usersvue_type_template_id_80c87ade_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "suggested-users-list"
        }, [ _vm.toggledSuggested ? _c("div", {
            staticClass: "user-search",
            attrs: {
                contenteditable: ""
            },
            on: {
                input: function($event) {
                    return _vm.checkTagging();
                }
            }
        }) : _vm._e(), _vm._v(" "), _vm._l(_vm.users, function(user, key) {
            return _c("div", {
                key: key,
                staticClass: "user"
            }, [ _c("div", {
                staticClass: "user__extras"
            }, [ _c("a", {
                on: {
                    click: function($event) {
                        return _vm.mentionUser(user.username, user._id);
                    }
                }
            }, [ _c("img", {
                staticClass: "user__avatar-suggested",
                attrs: {
                    src: user.avatar.size.small
                }
            }) ]), _vm._v(" "), _c("a", {
                on: {
                    click: function($event) {
                        return _vm.mentionUser(user.username, user._id);
                    }
                }
            }, [ _c("span", {
                staticClass: "user__name"
            }, [ _vm._v(_vm._s(user.username)) ]) ]) ]) ]);
        }) ], 2);
    };
    var suggested_usersvue_type_template_id_80c87ade_staticRenderFns = [];
    suggested_usersvue_type_template_id_80c87ade_render._withStripped = true;
    var suggested_usersvue_type_script_lang_js_ = {
        props: [ "users", "toggledSuggested" ],
        methods: {
            mentionUser: function mentionUser(username, _id) {
                var mentionedUser = {
                    username: username,
                    _id: _id
                };
                this.$emit("changeInput", mentionedUser);
            },
            checkTagging: function checkTagging() {
                var input = this.$el.querySelector(".user-search");
                var text = input.innerText;
                var query = "@".concat(text.match(/\w{0,}$/gi));
                this.$emit("getSuggestedUsers", query);
            }
        }
    };
    var components_suggested_usersvue_type_script_lang_js_ = suggested_usersvue_type_script_lang_js_;
    var suggested_usersvue_type_style_index_0_lang_less_ = __webpack_require__(274);
    var suggested_users_component = Object(componentNormalizer["a"])(components_suggested_usersvue_type_script_lang_js_, suggested_usersvue_type_template_id_80c87ade_render, suggested_usersvue_type_template_id_80c87ade_staticRenderFns, false, null, null, null);
    if (false) {
        var suggested_users_api;
    }
    suggested_users_component.options.__file = "source/content/components/suggested-users.vue";
    var suggested_users = suggested_users_component.exports;
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    var commentAreavue_type_script_lang_js_ = {
        props: [ "replyingTo", "fakeId", "showReplies", "activeSendButton" ],
        components: {
            Reactions: reactions,
            SuggestedUsers: suggested_users
        },
        data: function data() {
            return {
                activeReaction: "",
                suggestedUsers: [],
                mentionedUsers: [],
                toggledSuggested: false
            };
        },
        methods: {
            changeInput: function changeInput(user) {
                this.mentionedUsers.push(user);
                var username = user.username;
                if (this.toggledSuggested) {
                    var input = "".concat(this.$el.querySelector(".comment-area__input").innerHTML, ' \n                <input disabled class="mention" style="width: ').concat((username.length + 1) * 7.2, 'px;" value="').concat(username, '"> </input><span></span>');
                    this.$el.querySelector(".comment-area__input").innerHTML = input;
                    this.suggestedUsers = [];
                    this.toggledSuggested = false;
                } else {
                    var _input = this.$el.querySelector(".comment-area__input").innerHTML.split("@");
                    _input.splice(_input.length - 1, 1, '<input disabled class="mention" style="width: '.concat((username.length + 1) * 7.2, 'px;" value="').concat(username, '" /><span></span>'));
                    this.$el.querySelector(".comment-area__input").innerHTML = "".concat(_input.join(" "));
                    this.suggestedUsers = [];
                }
                var editable = this.$el.querySelector(".comment-area__input");
                var range = document.createRange();
                range.setStart(editable.lastChild, 0);
                var sel = document.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                this.check();
            },
            stopPropagation: function stopPropagation() {
                this.$el.querySelector(".comment-area__input").addEventListener("keydown", function(e) {
                    e.stopPropagation();
                });
                this.$el.querySelector(".comment-area__input").addEventListener("keypress", function(e) {
                    e.stopPropagation();
                });
                this.$el.querySelector(".comment-area__input").addEventListener("keyup", function(e) {
                    e.stopPropagation();
                });
            },
            check: function check() {
                var input = this.$el.querySelector(".comment-area__input");
                var html = input.innerHTML;
                var imgRegexp = new RegExp("<img", "i");
                var imgMatch = html.match(imgRegexp);
                if (imgMatch) {
                    html = html.slice(0, imgMatch.index);
                    this.$el.querySelector(".comment-area__input").innerHTML = html;
                }
                var inputRegexp = new RegExp('<div class="comment', "i");
                var inputMatch = html.match(inputRegexp);
                if (inputMatch) {
                    html = html.slice(0, inputMatch.index);
                    this.$el.querySelector(".comment-area__input").innerHTML = html;
                }
                var reactionRegexp = new RegExp('<div class="reaction', "i");
                var reactionMatch = html.match(reactionRegexp);
                if (reactionMatch) {
                    html = html.slice(0, reactionMatch.index);
                    this.$el.querySelector(".comment-area__input").innerHTML = html;
                }
                if (html.trim().length === 0) {
                    this.activeSendButton = false;
                }
                var text = Object(common["c"])(input, this.mentionedUsers);
                var data = {
                    resourceUrl: document.location.href,
                    commentText: text
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-comment",
                    data: data
                });
            },
            checkTagging: function checkTagging() {
                var input = this.$el.querySelector(".comment-area__input");
                this.toggledSuggested = false;
                var text = input.innerText;
                if (text.trim().length > 0) {
                    this.activeSendButton = true;
                }
                if (text.trim().length === 0) {
                    this.activeSendButton = false;
                    this.suggestedUsers = [];
                }
                var query = text.match(/@\w{0,}$/gi);
                if (query) {
                    this.getSuggestedUsers(query[0]);
                }
            },
            toggleSuggestedUsers: function toggleSuggestedUsers() {
                var _this = this;
                if (this.suggestedUsers.length === 0) {
                    this.toggledSuggested = true;
                    var data = {
                        value: ""
                    };
                    Object(common["e"])({
                        module: "users",
                        action: "get-suggested-followed",
                        data: data
                    }).then(function(users) {
                        _this.suggestedUsers = users;
                    });
                } else {
                    this.toggledSuggested = false;
                    this.suggestedUsers = [];
                }
            },
            getSuggestedUsers: function getSuggestedUsers(val) {
                var _this2 = this;
                if (!val) {
                    this.suggestedUsers = [];
                    return false;
                }
                var data = {
                    value: val.substring(1)
                };
                Object(common["e"])({
                    module: "users",
                    action: "get-suggested-followed",
                    data: data
                }).then(function(users) {
                    _this2.suggestedUsers = users;
                });
                return true;
            },
            sendComment: function sendComment() {
                var input = this.$el.querySelector(".comment-area__input");
                var text = Object(common["c"])(input, this.mentionedUsers);
                if (!text) {
                    return;
                }
                var fakeId = new Date().getTime();
                var newComment = _defineProperty({}, fakeId, {
                    id: fakeId,
                    fakeId: fakeId,
                    text: text,
                    parentId: this.replyingTo ? this.replyingTo : "",
                    reactionType: this.activeReaction,
                    replyCount: 0,
                    user: {
                        id: this.$store.state.user._id,
                        displayName: this.$store.state.user.username
                    },
                    createdTs: new Date().getTime() / 1e3,
                    score: 0,
                    socialData: {
                        myVote: ""
                    }
                });
                var currentComments = this.$store.state.comments;
                var comments = Object.assign(newComment, currentComments);
                if (comments[this.replyingTo]) {
                    comments[this.replyingTo].replyCount += 1;
                } else if (comments[this.fakeId]) {
                    comments[this.fakeId].replyCount += 1;
                }
                var data = {
                    resourceId: this.$store.state.resource.id,
                    text: text,
                    comments: comments,
                    fakeId: fakeId,
                    parentId: this.replyingTo ? this.replyingTo : "",
                    resourceUrl: document.location.href,
                    commentText: false
                };
                if (this.activeReaction) {
                    data.reactionType = this.activeReaction;
                }
                if (this.replyingTo) {
                    Object(common["e"])({
                        module: "comments",
                        action: "post-reply",
                        data: data
                    });
                    this.replyingTo = null;
                    this.$emit("update:replyingTo", false);
                    this.$emit("update:showReplies", true);
                } else {
                    Object(common["e"])({
                        module: "comments",
                        action: "post-comment",
                        data: data
                    });
                }
                input.innerHTML = "";
                this.activeReaction = "";
                this.mentionedUsers = [];
                Object(common["e"])({
                    module: "state",
                    action: "set-comment",
                    data: data
                });
            }
        }
    };
    var components_commentAreavue_type_script_lang_js_ = commentAreavue_type_script_lang_js_;
    var commentAreavue_type_style_index_0_lang_less_ = __webpack_require__(276);
    var commentArea_component = Object(componentNormalizer["a"])(components_commentAreavue_type_script_lang_js_, commentAreavue_type_template_id_e9c67482_render, commentAreavue_type_template_id_e9c67482_staticRenderFns, false, null, null, null);
    if (false) {
        var commentArea_api;
    }
    commentArea_component.options.__file = "source/content/components/commentArea.vue";
    var commentArea = commentArea_component.exports;
    var commentvue_type_script_lang_js_ = {
        name: "Comment",
        components: {
            Votes: votes,
            CommentArea: commentArea
        },
        props: [ "id", "text", "user", "reactionType", "replyCount", "score", "socialData", "createdTs", "fakeId" ],
        data: function data() {
            return {
                showReplies: true,
                avatar: null,
                replyingTo: null,
                commentText: [],
                userRegex: new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)"),
                highlighted: false,
                isLoad: false
            };
        },
        computed: {
            replies: function replies() {
                var _this = this;
                var replies = filter_default()(this.$store.state.comments, function(reply) {
                    return reply.parentId === _this.id;
                }).sort(function(reply1, reply2) {
                    return reply2.createdTs - reply1.createdTs;
                });
                return replies;
            }
        },
        methods: {
            setShowReplies: function setShowReplies() {
                this.showReplies = !this.showReplies;
                if (this.replyCount > 0 && Object.keys(this.replies).length === 0) {
                    var filterId = this.id;
                    this.$store.commit("set", {
                        filterId: filterId
                    });
                    var data = {
                        comments: this.$store.state.comments,
                        skip: 0,
                        parentId: this.id
                    };
                    Object(common["e"])({
                        module: "comments",
                        action: "get-replies",
                        data: data
                    });
                }
            },
            setShowRepliesByRepling: function setShowRepliesByRepling() {
                if (!this.showReplies) {
                    this.showReplies = !this.showReplies;
                }
            },
            createdFromNow: function createdFromNow() {
                return moment_default()(this.createdTs * 1e3).fromNow();
            },
            reply: function reply() {
                if (!this.replyingTo) {
                    this.replyingTo = this.id;
                } else {
                    this.replyingTo = null;
                }
                this.$el.querySelector("div").addEventListener("keydown", function(e) {
                    e.stopPropagation();
                });
                this.$el.querySelector("div").addEventListener("keypress", function(e) {
                    e.stopPropagation();
                });
                this.$el.querySelector("div").addEventListener("keyup", function(e) {
                    e.stopPropagation();
                });
            },
            showUserProfile: function showUserProfile(currentSection, mentionedUserId) {
                var _this2 = this;
                var data = {
                    skip: 0,
                    resources: [],
                    currentSection: currentSection,
                    previousSection: "Comments"
                };
                if (mentionedUserId) {
                    data.userId = mentionedUserId;
                } else {
                    data.userId = this.user.id;
                }
                Object(common["e"])({
                    module: "users",
                    action: "get-user",
                    data: data
                }).then(function(user) {
                    if (user.username === "Hidden User") {
                        return;
                    }
                    if (user.following) {
                        user.isFollower = !(user.following.indexOf(_this2.$store.state.user._id) === -1);
                    }
                    if (user.followers) {
                        user.isFollowed = !(user.followers.indexOf(_this2.$store.state.user._id) === -1);
                    }
                    data.otherUser = user;
                    Object(common["e"])({
                        module: "state",
                        action: "set-other-user",
                        data: data
                    });
                    Object(common["e"])({
                        module: "state",
                        action: "set-sections",
                        data: data
                    });
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: data
                    });
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        },
        created: function created() {
            var _this3 = this;
            if (this.$store.state.eventCommentInfo.showReplies) {
                this.showReplies = true;
            }
            if (this.$store.state.eventCommentInfo.commentIdFromEvent === this.id) {
                this.highlighted = true;
            }
            this.commentText = Object(common["a"])(this.text);
            var data = {
                userId: this.user.id
            };
            Object(common["e"])({
                module: "users",
                action: "get-user",
                data: data
            }).then(function(user) {
                _this3.avatar = user.avatar.size.small;
            });
        }
    };
    var components_commentvue_type_script_lang_js_ = commentvue_type_script_lang_js_;
    var commentvue_type_style_index_0_lang_less_ = __webpack_require__(278);
    var comment_component = Object(componentNormalizer["a"])(components_commentvue_type_script_lang_js_, commentvue_type_template_id_9449a6dc_render, commentvue_type_template_id_9449a6dc_staticRenderFns, false, null, null, null);
    if (false) {
        var comment_api;
    }
    comment_component.options.__file = "source/content/components/comment.vue";
    var comment = comment_component.exports;
    var likeDislikevue_type_template_id_640ec6c1_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", [ _vm.resource ? _c("div", {
            staticClass: "votes"
        }, [ _vm.resource.socialData.myReaction !== "dislike" && _vm.resource.socialData.myReaction !== "" ? _c("a", {
            staticClass: "cta cta_vote-up",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(21))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("like");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-up",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(22))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("like");
                },
                mouseenter: _vm.toggleAllReactions
            }
        }), _vm._v(" "), _vm.count() > 0 ? _c("div", {
            staticClass: "votes__count active"
        }, [ _vm._v(_vm._s(_vm.count())) ]) : _c("div", {
            staticClass: "votes__count"
        }, [ _vm._v(" - ") ]), _vm._v(" "), _vm.resource.socialData.myReaction === "dislike" ? _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(23))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("dislike");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(24))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("dislike");
                }
            }
        }) ]) : _vm._e(), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.showAllReactions,
                expression: "showAllReactions"
            } ],
            on: {
                mouseleave: _vm.toggleAllReactions
            }
        }, [ _c("ResourceReactions", {
            attrs: {
                showAllReactions: _vm.showAllReactions
            },
            on: {
                updateReaction: _vm.updateReaction,
                "update:showAllReactions": function($event) {
                    _vm.showAllReactions = $event;
                },
                "update:show-all-reactions": function($event) {
                    _vm.showAllReactions = $event;
                }
            }
        }) ], 1) ]);
    };
    var likeDislikevue_type_template_id_640ec6c1_staticRenderFns = [];
    likeDislikevue_type_template_id_640ec6c1_render._withStripped = true;
    var resourceReactionsvue_type_template_id_60a038ef_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "resource-reactions"
        }, _vm._l(_vm.$options.constants.reactions, function(value, key) {
            return _c("a", {
                key: key,
                class: [ "reaction", "reaction_" + value, value === _vm.activeReaction ? "reaction_active" : null ],
                on: {
                    click: function($event) {
                        return _vm.setReaction(value);
                    }
                }
            });
        }), 0);
    };
    var resourceReactionsvue_type_template_id_60a038ef_staticRenderFns = [];
    resourceReactionsvue_type_template_id_60a038ef_render._withStripped = true;
    var resourceReactionsvue_type_script_lang_js_ = {
        props: [ "showAllReactions" ],
        constants: {
            reactions: [ "lol", "wow", "love", "scary", "win", "wtf", "sad", "angry" ]
        },
        methods: {
            setReaction: function setReaction(value) {
                this.$emit("updateReaction", value);
                this.$emit("update:showAllReactions", !this.showAllReactions);
            }
        }
    };
    var components_resourceReactionsvue_type_script_lang_js_ = resourceReactionsvue_type_script_lang_js_;
    var resourceReactionsvue_type_style_index_0_lang_less_ = __webpack_require__(280);
    var resourceReactions_component = Object(componentNormalizer["a"])(components_resourceReactionsvue_type_script_lang_js_, resourceReactionsvue_type_template_id_60a038ef_render, resourceReactionsvue_type_template_id_60a038ef_staticRenderFns, false, null, null, null);
    if (false) {
        var resourceReactions_api;
    }
    resourceReactions_component.options.__file = "source/content/components/resourceReactions.vue";
    var resourceReactions = resourceReactions_component.exports;
    var likeDislikevue_type_script_lang_js_ = {
        props: [ "resource" ],
        components: {
            ResourceReactions: resourceReactions
        },
        data: function data() {
            return {
                showAllReactions: false,
                activeReaction: ""
            };
        },
        methods: {
            toggleAllReactions: function toggleAllReactions() {
                this.showAllReactions = !this.showAllReactions;
            },
            updateReaction: function updateReaction(reactionType) {
                var resource = this.$store.state.resource;
                var data = {
                    method: "",
                    resourceId: resource.id,
                    reactionType: reactionType
                };
                if (resource.socialData.myReaction === reactionType) {
                    data.method = "delete";
                    resource.stats.reactionCount -= 1;
                    resource.socialData.myReaction = "";
                    if (reactionType === "dislike") {
                        resource.stats.reactions.dislike -= 1;
                    }
                } else if (resource.socialData.myReaction === "") {
                    resource.stats.reactionCount += 1;
                    resource.socialData.myReaction = reactionType;
                    if (reactionType === "dislike") {
                        if (resource.stats.reactions.dislike) {
                            resource.stats.reactions.dislike += 1;
                        } else {
                            resource.stats.reactions.dislike = 1;
                        }
                    }
                    data.method = "post";
                } else if (resource.socialData.myReaction === "dislike") {
                    resource.socialData.myReaction = reactionType;
                    resource.stats.reactions.dislike -= 1;
                    data.method = "post";
                } else {
                    resource.socialData.myReaction = reactionType;
                    if (reactionType === "dislike") {
                        if (resource.stats.reactions.dislike) {
                            resource.stats.reactions.dislike += 1;
                        } else {
                            resource.stats.reactions.dislike = 1;
                        }
                    }
                    data.method = "post";
                }
                Object(common["e"])({
                    module: "reactions",
                    action: "update-reaction",
                    data: data
                });
                this.$store.commit("set", {
                    resource: resource
                });
            },
            count: function count() {
                var reactionsCount = this.resource.stats.reactionCount;
                var dislikeCount = this.resource.stats.reactions.dislike;
                if (!reactionsCount) {
                    return "-";
                }
                if (!dislikeCount) {
                    return reactionsCount;
                }
                return reactionsCount - 2 * dislikeCount;
            }
        }
    };
    var components_likeDislikevue_type_script_lang_js_ = likeDislikevue_type_script_lang_js_;
    var likeDislikevue_type_style_index_0_lang_less_ = __webpack_require__(282);
    var likeDislike_component = Object(componentNormalizer["a"])(components_likeDislikevue_type_script_lang_js_, likeDislikevue_type_template_id_640ec6c1_render, likeDislikevue_type_template_id_640ec6c1_staticRenderFns, false, null, null, null);
    if (false) {
        var likeDislike_api;
    }
    likeDislike_component.options.__file = "source/content/components/likeDislike.vue";
    var likeDislike = likeDislike_component.exports;
    var addBookmarkvue_type_template_id_72627daa_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _vm.resource ? _c("div", [ _c("button", {
            staticClass: "menu-button",
            class: [ _vm.resource.socialData.myTags[0] === "save" ? "menu-button active" : "menu-button" ],
            domProps: {
                innerHTML: _vm._s(__webpack_require__(284))
            },
            on: {
                click: _vm.updateBookmark
            }
        }) ]) : _vm._e();
    };
    var addBookmarkvue_type_template_id_72627daa_staticRenderFns = [];
    addBookmarkvue_type_template_id_72627daa_render._withStripped = true;
    var addBookmarkvue_type_script_lang_js_ = {
        props: [ "resource" ],
        data: function data() {},
        methods: {
            updateBookmark: function updateBookmark() {
                var data = {
                    resourceId: this.$store.state.resource.id,
                    metaTags: [ "text" ],
                    skip: 0,
                    bookmarks: [],
                    url: document.location.href
                };
                if (this.$store.state.resource.socialData.myTags[0] === "save") {
                    data.method = "delete";
                } else {
                    data.method = "post";
                }
                Object(common["e"])({
                    module: "bookmarks",
                    action: "post-bookmark",
                    data: data
                }).then(function() {
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resource",
                        data: data
                    });
                });
            }
        }
    };
    var components_addBookmarkvue_type_script_lang_js_ = addBookmarkvue_type_script_lang_js_;
    var addBookmark_component = Object(componentNormalizer["a"])(components_addBookmarkvue_type_script_lang_js_, addBookmarkvue_type_template_id_72627daa_render, addBookmarkvue_type_template_id_72627daa_staticRenderFns, false, null, null, null);
    if (false) {
        var addBookmark_api;
    }
    addBookmark_component.options.__file = "source/content/components/addBookmark.vue";
    var addBookmark = addBookmark_component.exports;
    var ignoreUrlsList = __webpack_require__(7);
    var resourceData_getResourceData = function getResourceData() {
        var data = {
            title: document.querySelector("head > title").innerText,
            url: document.location.href,
            metaTags: [ "text" ]
        };
        if (data.title === "" || data.url === "" || !data.title || !data.url) {
            return null;
        }
        if (document.location.href.match("^https://drive.google.com/") || document.location.href.match("^https://docs.google")) {
            return null;
        }
        if (document.location.href.match("^https://www.youtube.com/watch")) {
            var videoId = document.location.href.split("=")[1];
            data.description = document.querySelector('[property = "og:description"]') ? document.querySelector('[property = "og:description"]').getAttribute("content") : "";
            data.previewUrl = "https://img.youtube.com/vi/".concat(videoId, "/mqdefault.jpg");
            return data;
        }
        if (document.location.href.match("^https://www.youtube.com/")) {
            return null;
        }
        if (document.location.href.match("^https://www.instagram.com/p/")) {
            data.previewUrl = document.querySelector('[property = "og:image"]') ? document.querySelector('[property = "og:image"]').getAttribute("content") : "";
            return data;
        }
        if (document.location.href.match("^https://www.instagram.com/")) {
            return null;
        }
        if (ignoreUrlsList["a"].indexOf(document.location.href) !== -1) {
            return null;
        }
        if (document.location.href.match("^https://api-staging.fulldive.com/")) {
            return null;
        }
        data.description = document.querySelector('[property = "og:description"]') ? document.querySelector('[property = "og:description"]').getAttribute("content") : "";
        data.previewUrl = document.querySelector('[property = "og:image"]') ? document.querySelector('[property = "og:image"]').getAttribute("content") : "";
        return data;
    };
    var commentsvue_type_script_lang_js_ = {
        components: {
            Comment: comment,
            Votes: votes,
            CommentArea: commentArea,
            LikeDislike: likeDislike,
            AddBookmark: addBookmark
        },
        data: function data() {
            return {
                likeDislikeCount: null,
                taggingQuery: null,
                mention: null,
                skip: 0,
                showReplies: false,
                activeSendButton: false
            };
        },
        computed: {
            comments: function comments() {
                var _this = this;
                var comments;
                if (this.filterId) {
                    comments = filter_default()(this.$store.state.comments, function(comment) {
                        return comment.parentId === _this.filterId;
                    }).sort(function(comment1, comment2) {
                        return comment2.createdTs - comment1.createdTs;
                    });
                } else {
                    comments = filter_default()(this.$store.state.comments, function(comment) {
                        return comment.parentId === "";
                    }).sort(function(comment1, comment2) {
                        return comment2.createdTs - comment1.createdTs;
                    });
                }
                return comments;
            },
            commentsCount: function commentsCount() {
                var resource = this.$store.state.resource;
                return resource ? resource.stats.commentCount : 0;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            },
            resource: function resource() {
                return this.$store.state.resource;
            },
            user: function user() {
                return this.$store.state.user;
            },
            filterId: function filterId() {
                return this.$store.state.filterId;
            }
        },
        methods: {
            showAllComments: function showAllComments() {
                var data = {
                    comments: {},
                    skip: 0,
                    resourceId: this.$store.state.resource.id
                };
                Object(common["e"])({
                    module: "comments",
                    action: "get-comments",
                    data: data
                });
                this.idToFilterOn = null;
                var filterId = null;
                this.$store.commit("set", {
                    filterId: filterId
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Comments",
                    eventCommentInfo: {}
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-comment-id-from-event",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this2 = this;
                var list = this.$el.querySelector(".comments__list");
                if (list.scrollTop > .5 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var length = Object.keys(this.comments).length;
                    var data = {
                        skip: length,
                        comments: this.$store.state.comments,
                        resourceId: this.$store.state.resource.id
                    };
                    Object(common["e"])({
                        module: "comments",
                        action: "get-comments",
                        data: data
                    }).then(function(response) {
                        if (length < response) {
                            setTimeout(function() {
                                list.addEventListener("scroll", _this2.showMoreOnScroll);
                            }, 1e3);
                        }
                    });
                }
            }
        },
        activated: function activated() {
            var _this3 = this;
            this.$el.querySelector(".comments__list").addEventListener("scroll", this.showMoreOnScroll);
            Object(common["e"])({
                module: "pushNotifications",
                action: "register"
            });
            setInterval(function() {
                if (_this3.$store.state.currentUrl !== document.location.href) {
                    var currentUrl = document.location.href;
                    _this3.$store.commit("set", {
                        currentUrl: currentUrl
                    });
                    setTimeout(function() {
                        var data = resourceData_getResourceData();
                        if (!data) {
                            var resource = null;
                            _this3.$store.commit("set", {
                                resource: resource
                            });
                            return null;
                        }
                        return Object(common["e"])({
                            module: "resources",
                            action: "send-stop-watch",
                            data: data
                        }).then(function(resourceId) {
                            if (resourceId) {
                                var _data = {
                                    comments: {},
                                    skip: 0,
                                    resourceId: resourceId,
                                    eventCommentInfo: {}
                                };
                                if (!_this3.$store.state.eventCommentInfo.parentIdFromEvent) {
                                    Object(common["e"])({
                                        module: "comments",
                                        action: "get-comments",
                                        data: _data
                                    });
                                } else if (_this3.$store.state.eventCommentInfo.parentIdFromEvent) {
                                    var filterId = _this3.$store.state.eventCommentInfo.parentIdFromEvent;
                                    _this3.$store.commit("set", {
                                        filterId: filterId
                                    });
                                    _data.parentId = _this3.$store.state.eventCommentInfo.parentIdFromEvent;
                                    Object(common["e"])({
                                        module: "comments",
                                        action: "get-replies",
                                        data: _data
                                    });
                                }
                                setTimeout(function() {
                                    Object(common["e"])({
                                        module: "state",
                                        action: "set-comment-id-from-event",
                                        data: _data
                                    });
                                }, 3e3);
                            }
                        });
                    }, 1e3);
                    var data = {
                        resourceUrl: document.location.href
                    };
                    Object(common["e"])({
                        module: "state",
                        action: "get-comment",
                        data: data
                    }).then(function(input) {
                        if (input) {
                            var mentions = Object(common["a"])(input);
                            _this3.mentionedUsers = Object(common["b"])(input);
                            if (_this3.mentionedUsers.length > 0) {
                                mentions.forEach(function(mention, i) {
                                    _this3.mentionedUsers.forEach(function(user) {
                                        var nameRegex = new RegExp("".concat(user.username), "i");
                                        var nameMatch = mention.match(nameRegex);
                                        if (nameMatch) {
                                            mentions[i] = '<input disabled class="mention" style="width: '.concat((user.username.length + 1) * 7.2, 'px;" value="').concat(user.username, '"> </input><span></span>');
                                        }
                                    });
                                });
                            }
                            _this3.$el.querySelector(".comment-area__input").innerHTML = mentions.join("");
                            _this3.activeSendButton = true;
                        } else {
                            _this3.$el.querySelector(".comment-area__input").innerHTML = "";
                        }
                    });
                }
            }, 500);
            Object(common["e"])({
                module: "events",
                action: "get-fresh-events"
            });
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".comments__list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_commentsvue_type_script_lang_js_ = commentsvue_type_script_lang_js_;
    var commentsvue_type_style_index_0_lang_less_ = __webpack_require__(285);
    var comments_component = Object(componentNormalizer["a"])(components_commentsvue_type_script_lang_js_, commentsvue_type_template_id_093606d1_render, commentsvue_type_template_id_093606d1_staticRenderFns, false, null, null, null);
    if (false) {
        var comments_api;
    }
    comments_component.options.__file = "source/content/components/comments.vue";
    var components_comments = comments_component.exports;
    var authorizationvue_type_template_id_a73afd28_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "authorization fulldive-menu__section"
        }, [ _vm._m(0), _vm._v(" "), !_vm.onboarding ? _c("div", {
            staticClass: "welcome__info"
        }, [ _c("p", [ _vm._v("Sign in to exchange your coins for money") ]), _vm._v(" "), _c("p", [ _vm._v("and enjoy all our features") ]) ]) : _vm._e(), _vm._v(" "), _c("div", {
            staticClass: "authorization__image"
        }), _vm._v(" "), _c("div", {
            staticClass: "authorization__buttons"
        }, _vm._l(_vm.$options.constants.urls, function(value, key) {
            return _c("a", {
                key: key,
                class: [ "button", "button_" + key ],
                on: {
                    click: function($event) {
                        _vm.openAuthPage(value);
                        _vm.setOnboardingDone();
                    }
                }
            }, [ _vm._v("Login with " + _vm._s(_vm._f("capitalize")(key)) + "\n        ") ]);
        }), 0) ]);
    };
    var authorizationvue_type_template_id_a73afd28_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__title"
        }, [ _c("p", [ _vm._v("Sign in") ]), _vm._v(" "), _c("p") ]);
    } ];
    authorizationvue_type_template_id_a73afd28_render._withStripped = true;
    var constants = __webpack_require__(3);
    var authorizationvue_type_script_lang_js_ = {
        constants: {
            urls: {
                facebook: "".concat(constants["b"], "facebook")
            }
        },
        computed: {
            onboarding: function onboarding() {
                return this.$store.state.onboarding;
            }
        },
        filters: {
            capitalize: function capitalize(value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        methods: {
            openAuthPage: function openAuthPage(url) {
                if (!url) {
                    return false;
                }
                window.open(url, "_blank");
                return true;
            },
            setOnboardingDone: function setOnboardingDone() {
                var data = {
                    onboarding: true
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-onboarding",
                    data: data
                });
            }
        }
    };
    var components_authorizationvue_type_script_lang_js_ = authorizationvue_type_script_lang_js_;
    var authorizationvue_type_style_index_0_lang_less_ = __webpack_require__(287);
    var authorization_component = Object(componentNormalizer["a"])(components_authorizationvue_type_script_lang_js_, authorizationvue_type_template_id_a73afd28_render, authorizationvue_type_template_id_a73afd28_staticRenderFns, false, null, null, null);
    if (false) {
        var authorization_api;
    }
    authorization_component.options.__file = "source/content/components/authorization.vue";
    var authorization = authorization_component.exports;
    var friendsvue_type_template_id_e7780670_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "circle fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Profile");
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("My Circle") ]), _vm._v(" "), _c("Navigation", {
            attrs: {
                tabs: _vm.$options.constants.tabs,
                currentTab: _vm.currentTab
            },
            on: {
                "update:currentTab": function($event) {
                    _vm.currentTab = $event;
                },
                "update:current-tab": function($event) {
                    _vm.currentTab = $event;
                }
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "tabs scroll-wrapper"
        }, [ _vm._l(_vm.$options.constants.tabs, function(value, key) {
            return _c("div", {
                directives: [ {
                    name: "show",
                    rawName: "v-show",
                    value: value === _vm.currentTab,
                    expression: "value === currentTab"
                } ],
                key: key,
                staticClass: "tab"
            });
        }), _vm._v(" "), _c("div", [ _vm.currentTab === "Following" ? _c("UserList", {
            attrs: {
                users: _vm.following
            }
        }) : _vm.currentTab === "Friends" ? _c("UserList", {
            attrs: {
                users: _vm.friends
            }
        }) : _vm.currentTab === "Followers" ? _c("UserList", {
            attrs: {
                users: _vm.followers
            }
        }) : _vm._e() ], 1) ], 2) ], 1);
    };
    var friendsvue_type_template_id_e7780670_staticRenderFns = [];
    friendsvue_type_template_id_e7780670_render._withStripped = true;
    var navigationvue_type_template_id_2563b49e_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "navigation"
        }, [ _c("div", {
            staticClass: "navigation__tabs"
        }, _vm._l(_vm.tabs, function(value, key) {
            return _c("div", {
                key: key,
                staticClass: "navigation__tab",
                class: value === _vm.currentTab ? "navigation__tab_active" : "",
                on: {
                    click: function($event) {
                        return _vm.openTab({
                            value: value,
                            key: key
                        });
                    }
                }
            }, [ _vm._v(_vm._s(value) + "\n        ") ]);
        }), 0) ]);
    };
    var navigationvue_type_template_id_2563b49e_staticRenderFns = [];
    navigationvue_type_template_id_2563b49e_render._withStripped = true;
    var navigationvue_type_script_lang_js_ = {
        props: [ "currentTab", "tabs" ],
        data: function data() {
            return {
                linePosition: 0
            };
        },
        computed: {
            lineWidth: function lineWidth() {
                return Math.floor(100 / this.tabs.length);
            }
        },
        methods: {
            openTab: function openTab(_ref) {
                var value = _ref.value, key = _ref.key;
                this.currentTab = value;
                this.setLinePosition(key);
                this.$emit("update:currentTab", value);
            },
            setLinePosition: function setLinePosition(key) {
                this.linePosition = key * this.lineWidth;
            },
            initialize: function initialize() {
                var tabs = this.$el.querySelector(".navigation__tabs").childNodes;
                var current = this.$el.querySelector(".navigation__tab_active");
                this.setLinePosition(Array.prototype.indexOf.call(tabs, current));
            }
        },
        mounted: function mounted() {
            this.initialize();
        }
    };
    var components_navigationvue_type_script_lang_js_ = navigationvue_type_script_lang_js_;
    var navigationvue_type_style_index_0_lang_less_ = __webpack_require__(289);
    var navigation_component = Object(componentNormalizer["a"])(components_navigationvue_type_script_lang_js_, navigationvue_type_template_id_2563b49e_render, navigationvue_type_template_id_2563b49e_staticRenderFns, false, null, null, null);
    if (false) {
        var navigation_api;
    }
    navigation_component.options.__file = "source/content/components/navigation.vue";
    var navigation = navigation_component.exports;
    var usersListvue_type_template_id_2d7cc6b9_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "user-list"
        }, _vm._l(_vm.users, function(user, key) {
            return _c("div", {
                key: key,
                staticClass: "user"
            }, [ _c("div", {
                staticClass: "user__extras"
            }, [ _c("div", {
                on: {
                    click: function($event) {
                        return _vm.createRemoveTopFriend(user._id, user.isTopFriend);
                    }
                }
            }, [ _c("div", {
                class: [ "user__favorite", user.isTopFriend ? "user__favorite_favorite" : null ]
            }) ]), _vm._v(" "), _c("a", {
                on: {
                    click: function($event) {
                        return _vm.showSection("UserProfile", user);
                    }
                }
            }, [ _c("img", {
                staticClass: "user__avatar",
                attrs: {
                    src: user.avatar.size.small,
                    alt: "avatar"
                }
            }) ]), _vm._v(" "), _c("a", {
                on: {
                    click: function($event) {
                        return _vm.showSection("UserProfile", user);
                    }
                }
            }, [ _c("div", {
                staticClass: "user__name"
            }, [ _vm._v(_vm._s(user.username)) ]) ]) ]), _vm._v(" "), _c("div", {
                on: {
                    click: function($event) {
                        return _vm.changeRelationType(user._id, user.isFollowed);
                    }
                }
            }, [ user.isBuddy ? _c("button", {
                staticClass: "relation-button friends"
            }, [ _vm._v("\n                    Friends\n                ") ]) : _vm._e(), _vm._v(" "), !user.isFollower ? _c("button", {
                staticClass: "relation-button unfollow"
            }, [ _vm._v("\n                    Unfollow\n                ") ]) : _vm._e(), _vm._v(" "), !user.isFollowed ? _c("button", {
                staticClass: "relation-button follow"
            }, [ _vm._v("\n                    Follow\n                ") ]) : _vm._e() ]) ]);
        }), 0);
    };
    var usersListvue_type_template_id_2d7cc6b9_staticRenderFns = [];
    usersListvue_type_template_id_2d7cc6b9_render._withStripped = true;
    var usersListvue_type_script_lang_js_ = {
        props: [ "users" ],
        data: function data() {
            return {
                currentTab: "Followers"
            };
        },
        methods: {
            changeRelationType: function changeRelationType(userId, followed) {
                var data = {
                    userId: userId,
                    method: ""
                };
                if (!followed) {
                    data.method = "post";
                } else if (followed) {
                    data.method = "delete";
                }
                Object(common["e"])({
                    module: "users",
                    action: "update-relation",
                    data: data
                });
            },
            createRemoveTopFriend: function createRemoveTopFriend(userId, isTopFriend) {
                var data = {
                    userId: userId,
                    method: ""
                };
                if (!isTopFriend) {
                    data.method = "post";
                } else if (isTopFriend) {
                    data.method = "delete";
                }
                Object(common["e"])({
                    module: "users",
                    action: "update-topFriend",
                    data: data
                });
            },
            showSection: function showSection(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Friends",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            }
        }
    };
    var components_usersListvue_type_script_lang_js_ = usersListvue_type_script_lang_js_;
    var usersListvue_type_style_index_0_lang_less_ = __webpack_require__(291);
    var usersList_component = Object(componentNormalizer["a"])(components_usersListvue_type_script_lang_js_, usersListvue_type_template_id_2d7cc6b9_render, usersListvue_type_template_id_2d7cc6b9_staticRenderFns, false, null, null, null);
    if (false) {
        var usersList_api;
    }
    usersList_component.options.__file = "source/content/components/usersList.vue";
    var usersList = usersList_component.exports;
    var friendsvue_type_script_lang_js_ = {
        components: {
            Navigation: navigation,
            UserList: usersList
        },
        computed: {
            following: function following() {
                return this.$store.state.following;
            },
            followers: function followers() {
                return this.$store.state.followers;
            },
            friends: function friends() {
                return this.$store.state.friends;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        data: function data() {
            return {
                currentTab: "Followers"
            };
        },
        constants: {
            tabs: [ "Friends", "Followers", "Following" ]
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            }
        },
        activated: function activated() {
            if (this.$store.state.following.length === 0) {
                Object(common["e"])({
                    module: "users",
                    action: "get-following"
                });
            }
            if (this.$store.state.followers.length === 0) {
                Object(common["e"])({
                    module: "users",
                    action: "get-followers"
                });
            }
            if (this.$store.state.friends.length === 0) {
                Object(common["e"])({
                    module: "users",
                    action: "get-friends"
                });
            }
        }
    };
    var components_friendsvue_type_script_lang_js_ = friendsvue_type_script_lang_js_;
    var friendsvue_type_style_index_0_lang_less_ = __webpack_require__(293);
    var friends_component = Object(componentNormalizer["a"])(components_friendsvue_type_script_lang_js_, friendsvue_type_template_id_e7780670_render, friendsvue_type_template_id_e7780670_staticRenderFns, false, null, null, null);
    if (false) {
        var friends_api;
    }
    friends_component.options.__file = "source/content/components/friends.vue";
    var friends = friends_component.exports;
    var sharevue_type_template_id_bd244e5c_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "share"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Profile");
                }
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Share") ]) ]), _vm._v(" "), _c("h4", [ _vm._v("Post to Social Media") ]), _vm._v(" "), _c("textarea", {
            staticClass: "share__input",
            attrs: {
                placeholder: "Add a Message"
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "share__toolbox"
        }, _vm._l(_vm.networks, function(value, key) {
            return _c("label", {
                key: key,
                class: [ "checkbox", "checkbox_" + key ]
            }, [ _vm._v("\n            " + _vm._s(_vm._f("capitalize")(key)) + "\n            "), _c("input", {
                directives: [ {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.networks[key],
                    expression: "networks[key]"
                } ],
                attrs: {
                    type: "checkbox"
                },
                domProps: {
                    checked: Array.isArray(_vm.networks[key]) ? _vm._i(_vm.networks[key], null) > -1 : _vm.networks[key]
                },
                on: {
                    change: function($event) {
                        var $$a = _vm.networks[key], $$el = $event.target, $$c = $$el.checked ? true : false;
                        if (Array.isArray($$a)) {
                            var $$v = null, $$i = _vm._i($$a, $$v);
                            if ($$el.checked) {
                                $$i < 0 && _vm.$set(_vm.networks, key, $$a.concat([ $$v ]));
                            } else {
                                $$i > -1 && _vm.$set(_vm.networks, key, $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                            }
                        } else {
                            _vm.$set(_vm.networks, key, $$c);
                        }
                    }
                }
            }), _vm._v(" "), _c("span", {
                staticClass: "checkbox__slider"
            }) ]);
        }), 0), _vm._v(" "), _c("a", {
            staticClass: "button button_big"
        }, [ _vm._v("Share") ]) ]);
    };
    var sharevue_type_template_id_bd244e5c_staticRenderFns = [];
    sharevue_type_template_id_bd244e5c_render._withStripped = true;
    var sharevue_type_script_lang_js_ = {
        data: function data() {
            return {
                networks: {
                    facebook: false,
                    twitter: false
                }
            };
        },
        filters: {
            capitalize: function capitalize(value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        }
    };
    var components_sharevue_type_script_lang_js_ = sharevue_type_script_lang_js_;
    var sharevue_type_style_index_0_lang_less_ = __webpack_require__(295);
    var share_component = Object(componentNormalizer["a"])(components_sharevue_type_script_lang_js_, sharevue_type_template_id_bd244e5c_render, sharevue_type_template_id_bd244e5c_staticRenderFns, false, null, null, null);
    if (false) {
        var share_api;
    }
    share_component.options.__file = "source/content/components/share.vue";
    var share = share_component.exports;
    var myReactionsvue_type_template_id_5514e051_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section my-reactions"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection(_vm.previousSection);
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Reactions") ]), _vm._v(" "), _c("ReactionsFilter", {
            attrs: {
                activeReactions: _vm.activeReactions
            },
            on: {
                getResourcesFilteredByReaction: _vm.getResourcesFilteredByReaction,
                "update:activeReactions": function($event) {
                    _vm.activeReactions = $event;
                },
                "update:active-reactions": function($event) {
                    _vm.activeReactions = $event;
                },
                activateOnScroll: _vm.activateOnScroll
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "resource__list scroll-wrapper"
        }, _vm._l(_vm.resources, function(resource) {
            return _c("Resource", _vm._b({
                key: resource.id
            }, "Resource", resource, false));
        }), 1) ], 1);
    };
    var myReactionsvue_type_template_id_5514e051_staticRenderFns = [];
    myReactionsvue_type_template_id_5514e051_render._withStripped = true;
    var reactionsFiltervue_type_template_id_19e71535_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "reactions"
        }, _vm._l(_vm.$options.constants.reactions, function(value, key) {
            return _c("a", {
                key: key,
                class: [ "reaction", "reaction_" + value, _vm.activeReactions.includes(value) ? "reaction_active" : null ],
                on: {
                    click: function($event) {
                        return _vm.updateReaction(value);
                    }
                }
            });
        }), 0);
    };
    var reactionsFiltervue_type_template_id_19e71535_staticRenderFns = [];
    reactionsFiltervue_type_template_id_19e71535_render._withStripped = true;
    var reactionsFiltervue_type_script_lang_js_ = {
        props: [ "activeReactions" ],
        constants: {
            reactions: [ "lol", "wow", "love", "scary", "win", "wtf", "like", "sad", "angry" ]
        },
        methods: {
            updateReaction: function updateReaction(value) {
                var index = this.activeReactions.indexOf(value);
                if (index === -1) {
                    this.activeReactions.push(value);
                } else {
                    this.activeReactions.splice(index, 1);
                }
                var resources = [];
                this.$store.commit("set", {
                    resources: resources
                });
                this.$emit("update:activeReactions", this.activeReactions);
                this.$emit("getResourcesFilteredByReaction");
                this.$emit("activateOnScroll");
            }
        }
    };
    var components_reactionsFiltervue_type_script_lang_js_ = reactionsFiltervue_type_script_lang_js_;
    var reactionsFiltervue_type_style_index_0_lang_less_ = __webpack_require__(297);
    var reactionsFilter_component = Object(componentNormalizer["a"])(components_reactionsFiltervue_type_script_lang_js_, reactionsFiltervue_type_template_id_19e71535_render, reactionsFiltervue_type_template_id_19e71535_staticRenderFns, false, null, null, null);
    if (false) {
        var reactionsFilter_api;
    }
    reactionsFilter_component.options.__file = "source/content/components/reactionsFilter.vue";
    var reactionsFilter = reactionsFilter_component.exports;
    var resourcevue_type_template_id_7c55602a_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "resource"
        }, [ _c("a", {
            attrs: {
                href: _vm.resourceUrl
            }
        }, [ _vm.icon ? _c("div", {
            staticClass: "resource__preview"
        }, [ _c("div", {
            staticClass: "resource__preview",
            style: {
                "background-image": "url(" + _vm.icon + ")"
            }
        }), _vm._v(" "), _vm.duration ? _c("div", {
            staticClass: "resource__duration"
        }, [ _vm._v(_vm._s(_vm._f("duration")(_vm.duration))) ]) : _vm._e(), _vm._v(" "), _vm.typeData && _vm.typeData.contentMeta.video ? _c("div", {
            staticClass: "resource__duration"
        }, [ _vm._v("\n                " + _vm._s(_vm._f("duration")(_vm.typeData.contentMeta.video.durationMs)) + "\n            ") ]) : _vm._e() ]) : _vm._e(), _vm._v(" "), _vm.previewUrl ? _c("div", {
            staticClass: "resource__preview"
        }, [ _c("div", {
            staticClass: "resource__preview",
            style: {
                "background-image": "url(" + _vm.previewUrl + ")"
            }
        }), _vm._v(" "), _vm.duration ? _c("div", {
            staticClass: "resource__duration"
        }, [ _vm._v(_vm._s(_vm._f("duration")(_vm.duration))) ]) : _vm._e(), _vm._v(" "), _vm.typeData && _vm.typeData.contentMeta.video ? _c("div", {
            staticClass: "resource__duration"
        }, [ _vm._v("\n                " + _vm._s(_vm._f("duration")(_vm.typeData.contentMeta.video.durationMs)) + "\n            ") ]) : _vm._e() ]) : _vm._e() ]), _vm._v(" "), _c("div", {
            staticClass: "resource__extras"
        }, [ _c("a", {
            attrs: {
                href: _vm.resourceUrl
            }
        }, [ _vm.title.length > 50 ? _c("span", {
            staticClass: "resource__title"
        }, [ _vm._v(_vm._s(_vm.title.slice(0, 45)) + "...") ]) : _c("span", {
            staticClass: "resource__title"
        }, [ _vm._v(_vm._s(_vm.title)) ]) ]), _vm._v(" "), _vm.myReaction ? _c("span", {
            class: [ "main-reaction", "main-reaction_" + _vm.myReaction ]
        }) : _vm._e(), _vm._v(" "), _vm.socialData ? _c("span", {
            class: [ "main-reaction", "main-reaction_" + _vm.socialData.myReaction ]
        }) : _c("span", [ _vm._v("\n                reacted: \n            "), _c("span", {
            class: [ "main-reaction", "main-reaction_" + _vm.reaction.type ]
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "resource__info"
        }, [ _vm.source ? _c("div", {
            staticClass: "resource__favicon"
        }, [ _c("img", {
            attrs: {
                src: _vm.source.iconUrl,
                alt: ""
            }
        }) ]) : _vm._e(), _vm._v(" "), _vm.typeData ? _c("div", {
            staticClass: "resource__favicon"
        }, [ _c("img", {
            attrs: {
                src: _vm.typeData.domain.iconUrl,
                alt: ""
            }
        }) ]) : _vm._e(), _vm._v(" "), _vm.viewCount ? _c("div", {
            staticClass: "resource__counts"
        }, [ _vm._v(_vm._s(_vm.viewCount) + " views | 1h") ]) : _vm._e(), _vm._v(" "), _vm.stats ? _c("div", {
            staticClass: "resource__counts"
        }, [ _vm._v(_vm._s(_vm.stats.viewCount) + " views | 1h") ]) : _vm._e() ]), _vm._v(" "), _vm.connections ? _c("div", _vm._l(_vm.connectionsAvatars, function(value, key) {
            return _c("img", {
                key: key,
                staticClass: "avatar",
                attrs: {
                    src: value
                }
            });
        }), 0) : _vm._e(), _vm._v(" "), _vm.avatars.length > 0 ? _c("div", _vm._l(_vm.avatars, function(value, key) {
            return _c("img", {
                key: key,
                staticClass: "avatar",
                attrs: {
                    src: value
                }
            });
        }), 0) : _vm._e() ]) ]);
    };
    var resourcevue_type_template_id_7c55602a_staticRenderFns = [];
    resourcevue_type_template_id_7c55602a_render._withStripped = true;
    var resourcevue_type_script_lang_js_ = {
        props: [ "_id", "id", "icon", "reaction", "previewUrl", "duration", "typeData", "title", "viewCount", "stats", "url", "myReaction", "socialData", "source", "connections" ],
        data: function data() {
            var connectionsAvatars = [];
            var connections = this.connections;
            if (connections) {
                connections.forEach(function(connection) {
                    connectionsAvatars.push(connection.avatar.size.small);
                });
            }
            var resourceUrl = "";
            var type;
            if (this._id !== undefined) {
                type = this._id.split(":")[0];
                if (type === "article") {
                    resourceUrl = this.url;
                } else if (type === "youtube") {
                    resourceUrl = "https://www.youtube.com/watch?v=".concat(this._id.split(":")[1]);
                } else if (type === "youku") {
                    resourceUrl = "http://v.youku.com/v_show/id_".concat(this._id.split(":")[1]);
                }
            } else {
                type = this.id.split(":")[0];
                if (type === "article") {
                    resourceUrl = this.url;
                } else if (type === "youtube") {
                    resourceUrl = "https://www.youtube.com/watch?v=".concat(this.id.split(":")[1]);
                } else if (type === "youku") {
                    resourceUrl = "http://v.youku.com/v_show/id_".concat(this.id.split(":")[1]);
                }
            }
            return {
                connectionsAvatars: connectionsAvatars,
                resourceUrl: resourceUrl,
                avatars: []
            };
        },
        filters: {
            duration: function duration(ms) {
                var seconds = ms / 1e3;
                var hours = parseInt(seconds / 3600, 10);
                seconds %= 3600;
                var minutes = parseInt(seconds / 60, 10);
                seconds = parseInt(seconds % 60, 10);
                return "".concat(hours ? "".concat(hours, ":") : "").concat(minutes, ":").concat(seconds > 10 ? seconds : "0".concat(seconds));
            }
        },
        created: function created() {
            var _this = this;
            this.avatars = [];
            if (this.socialData) {
                this.socialData.followedActivities.forEach(function(item) {
                    var data = {};
                    if (item.type === "comment") {
                        data.userId = item.comment.user.id;
                    } else if (item.type === "view") {
                        data.userId = item.view.user.id;
                    } else if (item.type === "reaction") {
                        data.userId = item.reaction.user.id;
                    }
                    Object(common["e"])({
                        module: "users",
                        action: "get-user",
                        data: data
                    }).then(function(user) {
                        _this.avatars.push(user.avatar.size.small);
                    });
                });
            }
        }
    };
    var components_resourcevue_type_script_lang_js_ = resourcevue_type_script_lang_js_;
    var resourcevue_type_style_index_0_lang_less_ = __webpack_require__(299);
    var resource_component = Object(componentNormalizer["a"])(components_resourcevue_type_script_lang_js_, resourcevue_type_template_id_7c55602a_render, resourcevue_type_template_id_7c55602a_staticRenderFns, false, null, null, null);
    if (false) {
        var resource_api;
    }
    resource_component.options.__file = "source/content/components/resource.vue";
    var components_resource = resource_component.exports;
    var myReactionsvue_type_script_lang_js_ = {
        components: {
            ReactionsFilter: reactionsFilter,
            Resource: components_resource
        },
        computed: {
            resources: function resources() {
                return this.$store.state.resources;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        data: function data() {
            return {
                activeReactions: []
            };
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this = this;
                var list = this.$el.querySelector(".resource__list");
                if (list.scrollTop > .7 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var resourcesLength = this.$store.state.resources.length;
                    if (this.activeReactions.length > 0) {
                        var data = {
                            userId: this.$store.state.user._id,
                            skip: resourcesLength,
                            resources: this.$store.state.resources,
                            reactionsTypes: this.activeReactions.join(":")
                        };
                        Object(common["e"])({
                            module: "resources",
                            action: "get-resources-reacted-by-user-filtered",
                            data: data
                        }).then(function(response) {
                            if (resourcesLength < response) {
                                setTimeout(function() {
                                    list.addEventListener("scroll", _this.showMoreOnScroll);
                                }, 3e3);
                            }
                        });
                    } else {
                        var _data = {
                            userId: this.$store.state.user._id,
                            skip: resourcesLength,
                            resources: this.$store.state.resources
                        };
                        Object(common["e"])({
                            module: "resources",
                            action: "get-resources-reacted-by-user",
                            data: _data
                        }).then(function(response) {
                            if (resourcesLength < response) {
                                setTimeout(function() {
                                    list.addEventListener("scroll", _this.showMoreOnScroll);
                                }, 3e3);
                            }
                        });
                    }
                }
            },
            getResourcesFilteredByReaction: function getResourcesFilteredByReaction() {
                if (this.activeReactions.length > 0) {
                    var data = {
                        userId: this.$store.state.user._id,
                        skip: 0,
                        resources: [],
                        reactionsTypes: this.activeReactions.join(":")
                    };
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user-filtered",
                        data: data
                    });
                } else {
                    var _data2 = {
                        userId: this.$store.state.user._id,
                        skip: 0,
                        resources: []
                    };
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: _data2
                    });
                }
            },
            activateOnScroll: function activateOnScroll() {
                this.$el.querySelector(".resource__list").addEventListener("scroll", this.showMoreOnScroll);
            }
        },
        activated: function activated() {
            this.activeReactions = [];
            this.$el.querySelector(".resource__list").addEventListener("scroll", this.showMoreOnScroll);
            var data = {
                userId: this.$store.state.user._id,
                skip: 0,
                resources: []
            };
            Object(common["e"])({
                module: "resources",
                action: "get-resources-reacted-by-user",
                data: data
            });
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".resource__list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_myReactionsvue_type_script_lang_js_ = myReactionsvue_type_script_lang_js_;
    var myReactionsvue_type_style_index_0_lang_less_ = __webpack_require__(301);
    var myReactions_component = Object(componentNormalizer["a"])(components_myReactionsvue_type_script_lang_js_, myReactionsvue_type_template_id_5514e051_render, myReactionsvue_type_template_id_5514e051_staticRenderFns, false, null, null, null);
    if (false) {
        var myReactions_api;
    }
    myReactions_component.options.__file = "source/content/components/myReactions.vue";
    var myReactions = myReactions_component.exports;
    var bookmarksvue_type_template_id_582ae670_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "circle fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("div", {
            staticClass: "menu-buttons"
        }, [ _c("a", {
            staticClass: "menu-button",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection(_vm.previousSection);
                }
            }
        }), _vm._v(" "), _c("AddBookmark") ], 1) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Bookmarks") ]), _vm._v(" "), _c("div", {
            staticClass: "list scroll-wrapper"
        }, _vm._l(_vm.bookmarks, function(bookmark) {
            return _c("Bookmark", _vm._b({
                key: bookmark.id
            }, "Bookmark", bookmark, false));
        }), 1) ]);
    };
    var bookmarksvue_type_template_id_582ae670_staticRenderFns = [];
    bookmarksvue_type_template_id_582ae670_render._withStripped = true;
    var bookmarkvue_type_template_id_4d0c5d13_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "bookmark"
        }, [ _c("div", {
            staticClass: "bookmark__extras"
        }, [ _c("a", {
            attrs: {
                href: _vm.resourceUrl
            }
        }, [ _vm.title.length > 60 ? _c("span", {
            staticClass: "bookmark__title"
        }, [ _vm._v(_vm._s(_vm.title.slice(0, 60)) + "...") ]) : _c("span", {
            staticClass: "bookmark__title"
        }, [ _vm._v(_vm._s(_vm.title)) ]), _vm._v(" "), _vm.mainReaction ? _c("span", {
            class: [ "main-reaction ", "main-reaction_" + _vm.mainReaction ]
        }) : _vm._e() ]), _vm._v(" "), _c("div", {
            staticClass: "bookmark__info"
        }, [ _vm.source ? _c("div", {
            staticClass: "bookmark__favicon"
        }, [ _c("img", {
            attrs: {
                src: _vm.source.iconUrl,
                alt: ""
            }
        }) ]) : _vm._e(), _vm._v(" "), _c("div", {
            staticClass: "bookmark__counts"
        }, [ _vm._v(_vm._s(_vm.viewCount) + " views | 1h") ]), _vm._v(" "), _c("div", {
            staticClass: "menu-button",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(303))
            },
            on: {
                click: _vm.updateBookmark
            }
        }) ]), _vm._v(" "), _vm.connections ? _c("div", _vm._l(_vm.connections, function(value, key) {
            return _c("img", {
                key: key,
                staticClass: "avatar",
                attrs: {
                    src: value.avatar.size.small
                }
            });
        }), 0) : _vm._e() ]), _vm._v(" "), _c("a", {
            attrs: {
                href: _vm.resourceUrl
            }
        }, [ _c("div", {
            staticClass: "bookmark__preview"
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            staticClass: "bookmark__preview",
            attrs: {
                src: _vm.icon
            },
            on: {
                load: _vm.loaded
            }
        }), _vm._v(" "), _vm.duration ? _c("div", {
            staticClass: "bookmark__duration"
        }, [ _vm._v(_vm._s(_vm._f("duration")(_vm.duration))) ]) : _vm._e() ]) ]) ]);
    };
    var bookmarkvue_type_template_id_4d0c5d13_staticRenderFns = [];
    bookmarkvue_type_template_id_4d0c5d13_render._withStripped = true;
    var bookmarkvue_type_script_lang_js_ = {
        props: [ "_id", "url", "title", "icon", "duration", "connections", "viewCount", "source", "mainReaction" ],
        data: function data() {
            var resourceUrl = "";
            var type = this._id.split(":")[0];
            if (type === "article") {
                resourceUrl = this.url;
            } else if (type === "youtube") {
                resourceUrl = "https://www.youtube.com/watch?v=".concat(this._id.split(":")[1]);
            } else if (type === "youku") {
                resourceUrl = "http://v.youku.com/v_show/id_".concat(this._id.split(":")[1]);
            }
            return {
                resourceUrl: resourceUrl,
                isLoad: false
            };
        },
        methods: {
            updateBookmark: function updateBookmark() {
                var data = {
                    resourceId: this._id,
                    metaTags: [ "text" ],
                    skip: 0,
                    bookmarks: [],
                    url: document.location.href
                };
                data.method = "delete";
                Object(common["e"])({
                    module: "bookmarks",
                    action: "post-bookmark",
                    data: data
                }).then(function() {
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resource",
                        data: data
                    });
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        },
        filters: {
            duration: function duration(ms) {
                var seconds = ms / 1e3;
                var hours = parseInt(seconds / 3600, 10);
                seconds %= 3600;
                var minutes = parseInt(seconds / 60, 10);
                seconds = parseInt(seconds % 60, 10);
                return "".concat(hours ? "".concat(hours, ":") : "").concat(minutes, ":").concat(seconds > 10 ? seconds : "0".concat(seconds));
            }
        }
    };
    var components_bookmarkvue_type_script_lang_js_ = bookmarkvue_type_script_lang_js_;
    var bookmarkvue_type_style_index_0_lang_less_ = __webpack_require__(304);
    var bookmark_component = Object(componentNormalizer["a"])(components_bookmarkvue_type_script_lang_js_, bookmarkvue_type_template_id_4d0c5d13_render, bookmarkvue_type_template_id_4d0c5d13_staticRenderFns, false, null, null, null);
    if (false) {
        var bookmark_api;
    }
    bookmark_component.options.__file = "source/content/components/bookmark.vue";
    var bookmark = bookmark_component.exports;
    var bookmarksvue_type_script_lang_js_ = {
        components: {
            Bookmark: bookmark,
            AddBookmark: addBookmark
        },
        computed: {
            bookmarks: function bookmarks() {
                return this.$store.state.bookmarks;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this = this;
                var list = this.$el.querySelector(".list");
                if (list.scrollTop > .7 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var length = this.$store.state.bookmarks.length;
                    var data = {
                        skip: length,
                        bookmarks: this.$store.state.bookmarks
                    };
                    Object(common["e"])({
                        module: "bookmarks",
                        action: "get-bookmarks",
                        data: data
                    }).then(function(response) {
                        if (length < response) {
                            setTimeout(function() {
                                list.addEventListener("scroll", _this.showMoreOnScroll);
                            }, 1e3);
                        }
                    });
                }
            }
        },
        activated: function activated() {
            this.$el.querySelector(".list").addEventListener("scroll", this.showMoreOnScroll);
            if (this.$store.state.bookmarks.length === 0) {
                var data = {
                    skip: 0,
                    bookmarks: []
                };
                Object(common["e"])({
                    module: "bookmarks",
                    action: "get-bookmarks",
                    data: data
                });
            }
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_bookmarksvue_type_script_lang_js_ = bookmarksvue_type_script_lang_js_;
    var bookmarksvue_type_style_index_0_lang_less_ = __webpack_require__(306);
    var bookmarks_component = Object(componentNormalizer["a"])(components_bookmarksvue_type_script_lang_js_, bookmarksvue_type_template_id_582ae670_render, bookmarksvue_type_template_id_582ae670_staticRenderFns, false, null, null, null);
    if (false) {
        var bookmarks_api;
    }
    bookmarks_component.options.__file = "source/content/components/bookmarks.vue";
    var bookmarks = bookmarks_component.exports;
    var notificationsvue_type_template_id_2371665b_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "notifications-page fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Notifications") ]), _vm._v(" "), _c("div", {
            staticClass: "notifications list scroll-wrapper"
        }, _vm._l(_vm.events, function(event) {
            return _c("div", _vm._b({
                key: event,
                staticClass: "notification__extras"
            }, "div", event, false), [ _c("Notification", {
                attrs: {
                    event: event
                }
            }) ], 1);
        }), 0) ]);
    };
    var notificationsvue_type_template_id_2371665b_staticRenderFns = [];
    notificationsvue_type_template_id_2371665b_render._withStripped = true;
    var notificationvue_type_template_id_2a50b3c8_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "notificaion-types"
        }, [ _vm.event.type === "comment" ? _c("Comment", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "mention" ? _c("Mention", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "reply" ? _c("Reply", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "reaction" ? _c("Reaction", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "friendship" || _vm.event.type === "follower" ? _c("Relation", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "achievement" ? _c("Achievement", {
            attrs: {
                event: _vm.event,
                otherUser: _vm.otherUser
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "resourceWatch" ? _c("ResourceWatch", {
            attrs: {
                event: _vm.event
            }
        }) : _vm._e(), _vm._v(" "), _vm.event.type === "deckStatusChange" ? _c("DeckStatusChange", {
            attrs: {
                event: _vm.event
            }
        }) : _vm._e() ], 1);
    };
    var notificationvue_type_template_id_2a50b3c8_staticRenderFns = [];
    notificationvue_type_template_id_2a50b3c8_render._withStripped = true;
    var commentvue_type_template_id_98f6913a_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("div", [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.normal
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.event.creator.displayName)) ]) ]), _vm._v(" "), _c("span", {
            staticClass: "action"
        }, [ _vm._v("commented:") ]), _vm._v('\n                      \n                      "'), _vm._l(_vm.commentText, function(item) {
            return _c("span", _vm._b({
                key: item,
                staticClass: "notification__text"
            }, "span", item, false), [ item.search(_vm.userRegex) !== -1 ? _c("span", {
                staticClass: "notification__mention",
                on: {
                    click: function($event) {
                        _vm.showUserProfileFromMention("UserProfile", item.split("/")[3].slice(0, -1));
                    }
                }
            }, [ _vm._v("\n                          @" + _vm._s(item.split("]")[0].slice(1))) ]) : _c("a", {
                attrs: {
                    href: _vm.event.data.resource.url
                },
                on: {
                    click: function($event) {
                        return _vm.showSection("Comments");
                    }
                }
            }, [ _vm._v(" " + _vm._s(item) + " ") ]) ]);
        }), _vm._v('"\n\n                      '), _c("a", {
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                          on " + _vm._s(_vm.event.data.resource.typeData.domain.title) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ], 2) ]), _vm._v(" "), _vm.event.data.resource.previewUrl !== "" ? _c("a", {
            staticClass: "notification__preview",
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.event.data.resource.previewUrl
            },
            on: {
                load: _vm.loaded
            }
        }) ]) : _vm._e() ]) ]) ]);
    };
    var commentvue_type_template_id_98f6913a_staticRenderFns = [];
    commentvue_type_template_id_98f6913a_render._withStripped = true;
    var eventsTypes_commentvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        data: function data() {
            return {
                commentText: [],
                userRegex: new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)"),
                isLoad: false
            };
        },
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            },
            showUserProfileFromMention: function showUserProfileFromMention(currentSection, mentionedUserId) {
                var _this = this;
                var data = {
                    skip: 0,
                    resources: [],
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    userId: mentionedUserId
                };
                Object(common["e"])({
                    module: "users",
                    action: "get-user",
                    data: data
                }).then(function(user) {
                    user.isFollower = !(user.following.indexOf(_this.$store.state.user._id) === -1);
                    user.isFollowed = !(user.followers.indexOf(_this.$store.state.user._id) === -1);
                    data.otherUser = user;
                    Object(common["e"])({
                        module: "state",
                        action: "set-other-user",
                        data: data
                    });
                    Object(common["e"])({
                        module: "state",
                        action: "set-sections",
                        data: data
                    });
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: data
                    });
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    eventCommentInfo: {
                        commentIdFromEvent: this.event.data.comment.id,
                        parentIdFromEvent: this.event.data.comment.parentId,
                        showReplies: true
                    }
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-comment-id-from-event",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        },
        created: function created() {
            var text = Object(common["a"])(this.event.data.comment.text);
            var length = 0;
            text.forEach(function(item, i) {
                if (item.length + length > 60) {
                    text[i] = item.slice(0, 60);
                }
                length += item.length;
                if (length > 60) {
                    text = text.slice(0, i + 1);
                    text[i + 1] = "...";
                }
            });
            this.commentText = text;
        }
    };
    var components_eventsTypes_commentvue_type_script_lang_js_ = eventsTypes_commentvue_type_script_lang_js_;
    var eventsTypes_commentvue_type_style_index_0_lang_less_ = __webpack_require__(308);
    var eventsTypes_comment_component = Object(componentNormalizer["a"])(components_eventsTypes_commentvue_type_script_lang_js_, commentvue_type_template_id_98f6913a_render, commentvue_type_template_id_98f6913a_staticRenderFns, false, null, null, null);
    if (false) {
        var eventsTypes_comment_api;
    }
    eventsTypes_comment_component.options.__file = "source/content/components/eventsTypes/comment.vue";
    var eventsTypes_comment = eventsTypes_comment_component.exports;
    var mentionvue_type_template_id_39fb296e_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("div", [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.normal
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.event.creator.displayName)) ]) ]), _vm._v(" "), _c("span", [ _vm._v("mentioned you in a comment:") ]), _vm._v('\n                      "'), _vm._l(_vm.commentText, function(item) {
            return _c("span", _vm._b({
                key: item,
                staticClass: "notification__text"
            }, "span", item, false), [ item.search(_vm.userRegex) !== -1 ? _c("span", {
                staticClass: "notification__mention",
                on: {
                    click: function($event) {
                        _vm.showUserProfileFromMention("UserProfile", item.split("/")[3].slice(0, -1));
                    }
                }
            }, [ _vm._v("\n                          @" + _vm._s(item.split("]")[0].slice(1))) ]) : _c("a", {
                attrs: {
                    href: _vm.event.data.resource.url
                },
                on: {
                    click: function($event) {
                        return _vm.showSection("Comments");
                    }
                }
            }, [ _vm._v(" " + _vm._s(item) + " ") ]) ]);
        }), _vm._v(' "\n                      '), _c("a", {
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                      on " + _vm._s(_vm.event.data.resource.typeData.domain.title) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ], 2) ]), _vm._v(" "), _vm.event.data.resource.previewUrl !== "" ? _c("a", {
            staticClass: "notification__preview",
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.event.data.resource.previewUrl
            },
            on: {
                load: _vm.loaded
            }
        }) ]) : _vm._e() ]) ]) ]);
    };
    var mentionvue_type_template_id_39fb296e_staticRenderFns = [];
    mentionvue_type_template_id_39fb296e_render._withStripped = true;
    var mentionvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        data: function data() {
            return {
                commentText: [],
                userRegex: new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)"),
                isLoad: false
            };
        },
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            },
            showUserProfileFromMention: function showUserProfileFromMention(currentSection, mentionedUserId) {
                var _this = this;
                var data = {
                    skip: 0,
                    resources: [],
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    userId: mentionedUserId
                };
                Object(common["e"])({
                    module: "users",
                    action: "get-user",
                    data: data
                }).then(function(user) {
                    user.isFollower = !(user.following.indexOf(_this.$store.state.user._id) === -1);
                    user.isFollowed = !(user.followers.indexOf(_this.$store.state.user._id) === -1);
                    data.otherUser = user;
                    Object(common["e"])({
                        module: "state",
                        action: "set-other-user",
                        data: data
                    });
                    Object(common["e"])({
                        module: "state",
                        action: "set-sections",
                        data: data
                    });
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: data
                    });
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    eventCommentInfo: {
                        commentIdFromEventn: this.event.data.comment.id,
                        parentIdFromEvent: this.event.data.comment.parentId,
                        showReplies: true
                    }
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-comment-id-from-event",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        },
        created: function created() {
            var text = Object(common["a"])(this.event.data.comment.text);
            var length = 0;
            text.forEach(function(item, i) {
                if (item.length + length > 60) {
                    text[i] = item.slice(0, 60);
                }
                length += item.length;
                if (length > 60) {
                    text = text.slice(0, i + 1);
                    text[i + 1] = "...";
                }
            });
            this.commentText = text;
        }
    };
    var eventsTypes_mentionvue_type_script_lang_js_ = mentionvue_type_script_lang_js_;
    var mention_component = Object(componentNormalizer["a"])(eventsTypes_mentionvue_type_script_lang_js_, mentionvue_type_template_id_39fb296e_render, mentionvue_type_template_id_39fb296e_staticRenderFns, false, null, null, null);
    if (false) {
        var mention_api;
    }
    mention_component.options.__file = "source/content/components/eventsTypes/mention.vue";
    var mention = mention_component.exports;
    var replyvue_type_template_id_4360296e_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("div", [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.normal
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.event.creator.displayName)) ]) ]), _vm._v(" "), _c("span", [ _vm._v("replies you in a comment:") ]), _vm._v('\n                      "'), _vm._l(_vm.commentText, function(item) {
            return _c("span", _vm._b({
                key: item,
                staticClass: "notification__text"
            }, "span", item, false), [ item.search(_vm.userRegex) !== -1 ? _c("span", {
                staticClass: "notification__mention",
                on: {
                    click: function($event) {
                        _vm.showUserProfileFromMention("UserProfile", item.split("/")[3].slice(0, -1));
                    }
                }
            }, [ _vm._v("\n                          @" + _vm._s(item.split("]")[0].slice(1))) ]) : _c("a", {
                attrs: {
                    href: _vm.event.data.resource.url
                },
                on: {
                    click: function($event) {
                        return _vm.showSection("Comments");
                    }
                }
            }, [ _vm._v(" " + _vm._s(item) + " ") ]) ]);
        }), _vm._v('"\n                      '), _c("a", {
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                       on " + _vm._s(_vm.event.data.resource.typeData.domain.title) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ], 2) ]), _vm._v(" "), _vm.event.data.resource.previewUrl !== "" ? _c("a", {
            staticClass: "notification__preview",
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.event.data.resource.previewUrl
            },
            on: {
                load: _vm.loaded
            }
        }) ]) : _vm._e() ]) ]) ]);
    };
    var replyvue_type_template_id_4360296e_staticRenderFns = [];
    replyvue_type_template_id_4360296e_render._withStripped = true;
    var replyvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        data: function data() {
            return {
                commentText: [],
                userRegex: new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)"),
                isLoad: false
            };
        },
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: [],
                    isLoad: false
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            },
            showUserProfileFromMention: function showUserProfileFromMention(currentSection, mentionedUserId) {
                var _this = this;
                var data = {
                    skip: 0,
                    resources: [],
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    userId: mentionedUserId
                };
                Object(common["e"])({
                    module: "users",
                    action: "get-user",
                    data: data
                }).then(function(user) {
                    user.isFollower = !(user.following.indexOf(_this.$store.state.user._id) === -1);
                    user.isFollowed = !(user.followers.indexOf(_this.$store.state.user._id) === -1);
                    data.otherUser = user;
                    Object(common["e"])({
                        module: "state",
                        action: "set-other-user",
                        data: data
                    });
                    Object(common["e"])({
                        module: "state",
                        action: "set-sections",
                        data: data
                    });
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: data
                    });
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    eventCommentInfo: {
                        commentIdFromEvent: this.event.data.comment.id,
                        parentIdFromEvent: this.event.data.comment.parentId,
                        showReplies: true
                    }
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-comment-id-from-event",
                    data: data
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        },
        created: function created() {
            var text = Object(common["a"])(this.event.data.comment.text);
            var length = 0;
            text.forEach(function(item, i) {
                if (item.length + length > 60) {
                    text[i] = item.slice(0, 60);
                }
                length += item.length;
                if (length > 60) {
                    text = text.slice(0, i + 1);
                    text[i + 1] = "...";
                }
            });
            this.commentText = text;
        }
    };
    var eventsTypes_replyvue_type_script_lang_js_ = replyvue_type_script_lang_js_;
    var reply_component = Object(componentNormalizer["a"])(eventsTypes_replyvue_type_script_lang_js_, replyvue_type_template_id_4360296e_render, replyvue_type_template_id_4360296e_staticRenderFns, false, null, null, null);
    if (false) {
        var reply_api;
    }
    reply_component.options.__file = "source/content/components/eventsTypes/reply.vue";
    var reply = reply_component.exports;
    var reactionvue_type_template_id_29fdafd5_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("div", [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.small
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.event.creator.displayName)) ]) ]), _vm._v(" "), _c("span", {
            staticClass: "action"
        }, [ _vm._v("reacted:") ]), _vm._v(" "), _c("a", {
            class: [ "main-reaction", "main-reaction_" + _vm.event.data.reactionType ],
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }), _vm._v(" "), _c("a", {
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                          for \n                          "), _vm.event.data.resource.title.length > 60 ? _c("span", [ _vm._v("\n                              " + _vm._s(_vm.event.data.resource.title.slice(0, 60)) + "...\n                          ") ]) : _c("span", [ _vm._v("\n                              " + _vm._s(_vm.event.data.resource.title) + "\n                          ") ]), _vm._v("\n                          on\n                      " + _vm._s(_vm.event.data.resource.typeData.domain.title)) ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ]) ]), _vm._v(" "), _vm.event.data.resource.previewUrl !== "" ? _c("a", {
            staticClass: "notification__preview",
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.event.data.resource.previewUrl
            },
            on: {
                load: _vm.loaded
            }
        }) ]) : _vm._e() ]) ]) ]);
    };
    var reactionvue_type_template_id_29fdafd5_staticRenderFns = [];
    reactionvue_type_template_id_29fdafd5_render._withStripped = true;
    var reactionvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        data: function data() {
            return {
                isLoad: false
            };
        },
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        }
    };
    var eventsTypes_reactionvue_type_script_lang_js_ = reactionvue_type_script_lang_js_;
    var reactionvue_type_style_index_0_lang_less_ = __webpack_require__(310);
    var reaction_component = Object(componentNormalizer["a"])(eventsTypes_reactionvue_type_script_lang_js_, reactionvue_type_template_id_29fdafd5_render, reactionvue_type_template_id_29fdafd5_staticRenderFns, false, null, null, null);
    if (false) {
        var reaction_api;
    }
    reaction_component.options.__file = "source/content/components/eventsTypes/reaction.vue";
    var reaction = reaction_component.exports;
    var relationvue_type_template_id_fec6a3b0_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.small
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.otherUser.username)) ]) ]), _vm._v(" "), _c("br"), _vm._v(" "), _c("span", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.otherUser.isFollowed,
                expression: "otherUser.isFollowed"
            } ]
        }, [ _vm._v("\n                  is now your friend") ]), _vm._v(" "), _c("span", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.otherUser.isFollowed,
                expression: "!otherUser.isFollowed"
            } ]
        }, [ _vm._v("\n                  is following you now") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                  " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ]) ]), _vm._v(" "), _c("a", {
            staticClass: "change-relation-link",
            on: {
                click: function($event) {
                    return _vm.changeRelationType(_vm.otherUser._id, _vm.otherUser.isFollowed);
                }
            }
        }, [ _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.otherUser.isFollower && _vm.otherUser.isFollowed,
                expression: "otherUser.isFollower && otherUser.isFollowed"
            } ],
            staticClass: "relation-button friends"
        }, [ _vm._v("\n              Friends\n              ") ]), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.otherUser.isFollowed && !_vm.otherUser.isFollowed,
                expression: "!otherUser.isFollowed && !otherUser.isFollowed"
            } ],
            staticClass: "relation-button follow"
        }, [ _vm._v("\n                  Follow\n              ") ]) ]) ]) ]) ]);
    };
    var relationvue_type_template_id_fec6a3b0_staticRenderFns = [];
    relationvue_type_template_id_fec6a3b0_render._withStripped = true;
    var relationvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            changeRelationType: function changeRelationType(userId, followed) {
                var data = {
                    userId: userId,
                    method: ""
                };
                if (!followed) {
                    data.method = "post";
                } else if (followed) {
                    data.method = "delete";
                }
                this.otherUser.isFollowed = !this.otherUser.isFollowed;
                Object(common["e"])({
                    module: "users",
                    action: "update-relation",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            }
        }
    };
    var eventsTypes_relationvue_type_script_lang_js_ = relationvue_type_script_lang_js_;
    var relationvue_type_style_index_0_lang_less_ = __webpack_require__(312);
    var relation_component = Object(componentNormalizer["a"])(eventsTypes_relationvue_type_script_lang_js_, relationvue_type_template_id_fec6a3b0_render, relationvue_type_template_id_fec6a3b0_staticRenderFns, false, null, null, null);
    if (false) {
        var relation_api;
    }
    relation_component.options.__file = "source/content/components/eventsTypes/relation.vue";
    var relation = relation_component.exports;
    var resourceWatchvue_type_template_id_28f4c065_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _vm._m(0), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _c("a", {
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                      " + _vm._s(_vm.event.data.watchCount) + " of your friends watched:\n                      " + _vm._s(_vm.event.data.resource.title) + "\n                      on " + _vm._s(_vm.event.data.resource.typeData.domain.title) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ]) ]), _vm._v(" "), _vm.event.data.resource.previewUrl !== "" ? _c("a", {
            staticClass: "notification__preview",
            attrs: {
                href: _vm.event.data.resource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.event.data.resource.previewUrl
            },
            on: {
                load: _vm.loaded
            }
        }) ]) : _vm._e() ]) ]) ]);
    };
    var resourceWatchvue_type_template_id_28f4c065_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "point"
        }, [ _c("div", {
            staticClass: "point__orange"
        }) ]);
    } ];
    resourceWatchvue_type_template_id_28f4c065_render._withStripped = true;
    var resourceWatchvue_type_script_lang_js_ = {
        props: [ "event" ],
        data: function data() {
            return {
                isLoad: false
            };
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications"
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            loaded: function loaded() {
                this.isLoad = true;
            }
        }
    };
    var eventsTypes_resourceWatchvue_type_script_lang_js_ = resourceWatchvue_type_script_lang_js_;
    var resourceWatchvue_type_style_index_0_lang_less_ = __webpack_require__(314);
    var resourceWatch_component = Object(componentNormalizer["a"])(eventsTypes_resourceWatchvue_type_script_lang_js_, resourceWatchvue_type_template_id_28f4c065_render, resourceWatchvue_type_template_id_28f4c065_staticRenderFns, false, null, null, null);
    if (false) {
        var resourceWatch_api;
    }
    resourceWatch_component.options.__file = "source/content/components/eventsTypes/resourceWatch.vue";
    var resourceWatch = resourceWatch_component.exports;
    var achievementvue_type_template_id_4cb39a33_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _c("div", {
            staticClass: "notification__extras"
        }, [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("div", [ _c("img", {
            staticClass: "notification__avatar",
            attrs: {
                src: _vm.otherUser.avatar.size.small
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", [ _c("a", {
            on: {
                click: function($event) {
                    return _vm.showUserProfile("UserProfile", _vm.otherUser);
                }
            }
        }, [ _c("span", {
            staticClass: "name"
        }, [ _vm._v(_vm._s(_vm.event.creator.displayName)) ]) ]), _vm._v(" "), _c("span", {
            staticClass: "action"
        }, [ _vm._v("got an achievement") ]), _vm._v(" "), _c("span", [ _vm._v("\n                          " + _vm._s(_vm.event.data.achievement.title) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                      " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ]) ]) ]) ]) ]);
    };
    var achievementvue_type_template_id_4cb39a33_staticRenderFns = [];
    achievementvue_type_template_id_4cb39a33_render._withStripped = true;
    var achievementvue_type_script_lang_js_ = {
        props: [ "event", "otherUser" ],
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            },
            showUserProfile: function showUserProfile(currentSection, otherUser) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications",
                    otherUser: otherUser,
                    skip: 0,
                    resources: [],
                    userId: otherUser._id
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-other-user",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
                Object(common["e"])({
                    module: "resources",
                    action: "get-resources-reacted-by-user",
                    data: data
                });
            }
        }
    };
    var eventsTypes_achievementvue_type_script_lang_js_ = achievementvue_type_script_lang_js_;
    var achievement_component = Object(componentNormalizer["a"])(eventsTypes_achievementvue_type_script_lang_js_, achievementvue_type_template_id_4cb39a33_render, achievementvue_type_template_id_4cb39a33_staticRenderFns, false, null, null, null);
    if (false) {
        var achievement_api;
    }
    achievement_component.options.__file = "source/content/components/eventsTypes/achievement.vue";
    var achievement = achievement_component.exports;
    var deckStatusChangevue_type_template_id_bca4a392_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            class: [ "notification", !!_vm.event.isRead ? "notification__read" : "notification" ]
        }, [ _c("a", {
            on: {
                click: _vm.markAsRead
            }
        }, [ _vm._m(0), _vm._v(" "), _c("div", {
            staticClass: "notification__extras"
        }, [ _c("div", {
            staticClass: "notification__content"
        }, [ _c("p", {
            staticClass: "main-info"
        }, [ _vm.event.data.deck.status === "public" ? _c("span", [ _vm._v("\n                      " + _vm._s(_vm.event.data.deck.title) + " is now public!") ]) : _c("span", [ _vm._v(" " + _vm._s(_vm.event.data.deck.title) + " is rejected.\n                      Your deck has been rejected: " + _vm._s(_vm.event.date.deck.reason) + "\n                      ") ]), _vm._v(" "), _c("span", {
            staticClass: "notification__time"
        }, [ _vm._v("\n                     " + _vm._s(_vm.createdFromNow(_vm.event.createdTs))) ]) ]) ]) ]) ]) ]);
    };
    var deckStatusChangevue_type_template_id_bca4a392_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "poit"
        }, [ _c("div", {
            staticClass: "poit__grey"
        }) ]);
    } ];
    deckStatusChangevue_type_template_id_bca4a392_render._withStripped = true;
    var deckStatusChangevue_type_script_lang_js_ = {
        props: [ "event" ],
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            },
            markAsRead: function markAsRead() {
                if (this.event.isRead) {
                    return;
                }
                var data = {
                    eventId: this.event.id,
                    isRead: true,
                    skip: 0,
                    events: []
                };
                Object(common["e"])({
                    module: "events",
                    action: "post-mark-event",
                    data: data
                });
            }
        }
    };
    var eventsTypes_deckStatusChangevue_type_script_lang_js_ = deckStatusChangevue_type_script_lang_js_;
    var deckStatusChange_component = Object(componentNormalizer["a"])(eventsTypes_deckStatusChangevue_type_script_lang_js_, deckStatusChangevue_type_template_id_bca4a392_render, deckStatusChangevue_type_template_id_bca4a392_staticRenderFns, false, null, null, null);
    if (false) {
        var deckStatusChange_api;
    }
    deckStatusChange_component.options.__file = "source/content/components/eventsTypes/deckStatusChange.vue";
    var deckStatusChange = deckStatusChange_component.exports;
    var notificationvue_type_script_lang_js_ = {
        props: [ "event" ],
        components: {
            Comment: eventsTypes_comment,
            Mention: mention,
            Reply: reply,
            Reaction: reaction,
            Relation: relation,
            Achievement: achievement,
            ResourceWatch: resourceWatch,
            DeckStatusChange: deckStatusChange
        },
        computed: {
            otherUser: function otherUser() {
                var _this = this;
                var otherUser = null;
                try {
                    this.$store.state.following.forEach(function(user) {
                        if (user._id === _this.event.creator.id) {
                            otherUser = user;
                        }
                    });
                    this.$store.state.followers.forEach(function(user) {
                        if (user._id === _this.event.creator.id) {
                            otherUser = user;
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                return otherUser;
            }
        },
        data: function data() {
            return {
                user: null
            };
        },
        methods: {
            createdFromNow: function createdFromNow(createdTs) {
                return moment_default()(createdTs).fromNow();
            }
        }
    };
    var components_notificationvue_type_script_lang_js_ = notificationvue_type_script_lang_js_;
    var notificationvue_type_style_index_0_lang_less_ = __webpack_require__(316);
    var notification_component = Object(componentNormalizer["a"])(components_notificationvue_type_script_lang_js_, notificationvue_type_template_id_2a50b3c8_render, notificationvue_type_template_id_2a50b3c8_staticRenderFns, false, null, null, null);
    if (false) {
        var notification_api;
    }
    notification_component.options.__file = "source/content/components/notification.vue";
    var notification = notification_component.exports;
    var notificationsvue_type_script_lang_js_ = {
        components: {
            Notification: notification
        },
        computed: {
            events: function events() {
                var events = this.$store.state.events;
                return events;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Notifications"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this = this;
                var list = this.$el.querySelector(".notifications.list");
                if (list.scrollTop > .6 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var length = this.$store.state.events.length;
                    var data = {
                        skip: length,
                        events: this.$store.state.events
                    };
                    Object(common["e"])({
                        module: "events",
                        action: "get-events",
                        data: data
                    }).then(function(response) {
                        if (length < response) {
                            setTimeout(function() {
                                list.addEventListener("scroll", _this.showMoreOnScroll);
                            }, 1e3);
                        }
                    });
                }
            }
        },
        activated: function activated() {
            this.$el.querySelector(".notifications.list").addEventListener("scroll", this.showMoreOnScroll);
            var data = {
                skip: 0,
                events: []
            };
            Object(common["e"])({
                module: "events",
                action: "get-events",
                data: data
            });
            Object(common["e"])({
                module: "users",
                action: "get-followers"
            });
            Object(common["e"])({
                module: "users",
                action: "get-following"
            });
            Object(common["e"])({
                module: "events",
                action: "reset-fresh-events"
            });
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".notifications.list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_notificationsvue_type_script_lang_js_ = notificationsvue_type_script_lang_js_;
    var notificationsvue_type_style_index_0_lang_less_ = __webpack_require__(318);
    var notifications_component = Object(componentNormalizer["a"])(components_notificationsvue_type_script_lang_js_, notificationsvue_type_template_id_2371665b_render, notificationsvue_type_template_id_2371665b_staticRenderFns, false, null, null, null);
    if (false) {
        var notifications_api;
    }
    notifications_component.options.__file = "source/content/components/notifications.vue";
    var notifications = notifications_component.exports;
    var userProfilevue_type_template_id_01e7e6de_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "profile fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection(_vm.previousSection);
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "profile__info"
        }, [ _c("div", {
            staticClass: "profile__image"
        }, [ _c("img", {
            staticClass: "profile__image",
            attrs: {
                src: _vm.otherUser.avatar.size.normal,
                alt: "avatar"
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "profile__content"
        }, [ _c("div", {
            staticClass: "profile__name"
        }, [ _vm._v(_vm._s(_vm.otherUser.username)) ]), _vm._v(" "), _vm.otherUser.connectionCount > 0 ? _c("div", {
            staticClass: "profile__connections"
        }, [ _vm._v(_vm._s(_vm.otherUser.connectionCount) + " connections") ]) : _vm._e(), _vm._v(" "), _c("button", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.otherUser.isFollower && _vm.otherUser.isFollowed,
                expression: "otherUser.isFollower && otherUser.isFollowed"
            } ],
            staticClass: "relation-button friends",
            on: {
                click: function($event) {
                    return _vm.changeRelationType(_vm.otherUser._id, _vm.otherUser.isFollowed);
                }
            }
        }, [ _vm._v("\n                Friends\n            ") ]), _vm._v(" "), _c("button", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.otherUser.isFollower && _vm.otherUser.isFollowed,
                expression: "!otherUser.isFollower && otherUser.isFollowed"
            } ],
            staticClass: "relation-button unfollow",
            on: {
                click: function($event) {
                    return _vm.changeRelationType(_vm.otherUser._id, _vm.otherUser.isFollowed);
                }
            }
        }, [ _vm._v("\n                Unfollow\n            ") ]), _vm._v(" "), _c("button", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.otherUser.isFollowed && !_vm.otherUser.isFollowed,
                expression: "!otherUser.isFollowed && !otherUser.isFollowed"
            } ],
            staticClass: "relation-button follow",
            on: {
                click: function($event) {
                    return _vm.changeRelationType(_vm.otherUser._id, _vm.otherUser.isFollowed);
                }
            }
        }, [ _vm._v("\n                Follow\n            ") ]) ]) ]), _vm._v(" "), _vm.quote ? _c("div", {
            staticClass: "profile__quote"
        }, [ _vm._v(_vm._s(_vm.quote)) ]) : _vm._e(), _vm._v(" "), _c("UserReactions", {
            attrs: {
                otherUser: _vm.otherUser
            }
        }) ], 1);
    };
    var userProfilevue_type_template_id_01e7e6de_staticRenderFns = [];
    userProfilevue_type_template_id_01e7e6de_render._withStripped = true;
    var userReactionsvue_type_template_id_edd59c5c_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section my-reactions"
        }, [ _c("div", {
            staticClass: "title"
        }, [ _vm._v("Reactions") ]), _vm._v(" "), _c("ReactionsFilter", {
            attrs: {
                activeReactions: _vm.activeReactions
            },
            on: {
                getResourcesFilteredByReaction: _vm.getResourcesFilteredByReaction,
                "update:activeReactions": function($event) {
                    _vm.activeReactions = $event;
                },
                "update:active-reactions": function($event) {
                    _vm.activeReactions = $event;
                },
                activateOnScroll: _vm.activateOnScroll
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "resource__list scroll-wrapper"
        }, _vm._l(_vm.resources, function(resource) {
            return _c("Resource", _vm._b({
                key: resource.id
            }, "Resource", resource, false));
        }), 1) ], 1);
    };
    var userReactionsvue_type_template_id_edd59c5c_staticRenderFns = [];
    userReactionsvue_type_template_id_edd59c5c_render._withStripped = true;
    var userReactionsvue_type_script_lang_js_ = {
        props: [ "otherUser" ],
        components: {
            ReactionsFilter: reactionsFilter,
            Resource: components_resource
        },
        computed: {
            resources: function resources() {
                return this.$store.state.resources;
            }
        },
        data: function data() {
            return {
                activeReactions: []
            };
        },
        methods: {
            showMoreOnScroll: function showMoreOnScroll() {
                var _this = this;
                var list = this.$el.querySelector(".resource__list");
                if (list.scrollTop > .7 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var resourcesLength = this.$store.state.resources.length;
                    if (this.activeReactions.length > 0) {
                        var data = {
                            userId: this.otherUser._id,
                            skip: resourcesLength,
                            resources: this.$store.state.resources,
                            reactionsTypes: this.activeReactions.join(":")
                        };
                        Object(common["e"])({
                            module: "resources",
                            action: "get-resources-reacted-by-user-filtered",
                            data: data
                        }).then(function(response) {
                            if (resourcesLength < response) {
                                setTimeout(function() {
                                    list.addEventListener("scroll", _this.showMoreOnScroll);
                                }, 3e3);
                            }
                        });
                    } else {
                        var _data = {
                            userId: this.otherUser._id,
                            skip: resourcesLength,
                            resources: this.$store.state.resources
                        };
                        Object(common["e"])({
                            module: "resources",
                            action: "get-resources-reacted-by-user",
                            data: _data
                        }).then(function(response) {
                            if (resourcesLength < response) {
                                setTimeout(function() {
                                    list.addEventListener("scroll", _this.showMoreOnScroll);
                                }, 3e3);
                            }
                        });
                    }
                }
            },
            activateOnScroll: function activateOnScroll() {
                this.$el.querySelector(".resource__list").addEventListener("scroll", this.showMoreOnScroll);
            },
            getResourcesFilteredByReaction: function getResourcesFilteredByReaction() {
                if (this.activeReactions.length > 0) {
                    var data = {
                        userId: this.otherUser._id,
                        skip: 0,
                        resources: [],
                        reactionsTypes: this.activeReactions.join(":")
                    };
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user-filtered",
                        data: data
                    });
                } else {
                    var _data2 = {
                        userId: this.otherUser._id,
                        skip: 0,
                        resources: []
                    };
                    Object(common["e"])({
                        module: "resources",
                        action: "get-resources-reacted-by-user",
                        data: _data2
                    });
                }
            }
        },
        activated: function activated() {
            var resources = [];
            this.$store.commit("set", {
                resources: resources
            });
            this.activeReactions = [];
            this.$el.querySelector(".resource__list").addEventListener("scroll", this.showMoreOnScroll);
            var data = {
                userId: this.otherUser._id,
                skip: 0,
                resources: resources
            };
            Object(common["e"])({
                module: "resources",
                action: "get-resources-reacted-by-user",
                data: data
            });
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".resource__list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_userReactionsvue_type_script_lang_js_ = userReactionsvue_type_script_lang_js_;
    var userReactionsvue_type_style_index_0_lang_less_ = __webpack_require__(320);
    var userReactions_component = Object(componentNormalizer["a"])(components_userReactionsvue_type_script_lang_js_, userReactionsvue_type_template_id_edd59c5c_render, userReactionsvue_type_template_id_edd59c5c_staticRenderFns, false, null, null, null);
    if (false) {
        var userReactions_api;
    }
    userReactions_component.options.__file = "source/content/components/userReactions.vue";
    var userReactions = userReactions_component.exports;
    var userProfilevue_type_script_lang_js_ = {
        components: {
            UserReactions: userReactions
        },
        computed: {
            otherUser: function otherUser() {
                return this.$store.state.otherUser;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            changeRelationType: function changeRelationType(userId, followed) {
                var otherUser = this.$store.state.otherUser;
                var data = {
                    userId: userId,
                    method: ""
                };
                if (!followed) {
                    data.method = "post";
                } else if (followed) {
                    data.method = "delete";
                }
                otherUser.isFollowed = !otherUser.isFollowed;
                Object(common["e"])({
                    module: "users",
                    action: "update-relation",
                    data: data
                });
                this.$store.commit("set", {
                    otherUser: otherUser
                });
            }
        }
    };
    var components_userProfilevue_type_script_lang_js_ = userProfilevue_type_script_lang_js_;
    var userProfilevue_type_style_index_0_lang_less_ = __webpack_require__(322);
    var userProfile_component = Object(componentNormalizer["a"])(components_userProfilevue_type_script_lang_js_, userProfilevue_type_template_id_01e7e6de_render, userProfilevue_type_template_id_01e7e6de_staticRenderFns, false, null, null, null);
    if (false) {
        var userProfile_api;
    }
    userProfile_component.options.__file = "source/content/components/userProfile.vue";
    var userProfile = userProfile_component.exports;
    var settingsvue_type_template_id_0ecf9500_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "settings fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Profile");
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Settings") ]), _vm._v(" "), _c("div", {
            staticClass: "scroll-wrapper"
        }, [ _c("div", {
            staticClass: "settings__navigation"
        }, [ _c("div", {
            staticClass: "settings__switch"
        }, [ _c("a", {
            staticClass: "settings__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(324) + " \n                  Push Notifications")
            }
        }), _vm._v(" "), _c("div", {
            class: [ _vm.pushNotifications ? "switch-active" : "switch" ],
            on: {
                click: _vm.switchPushNotifications
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "settings__switch"
        }, [ _c("a", {
            staticClass: "settings__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(325) + " Stealth mode")
            }
        }), _vm._v(" "), _c("div", {
            class: [ _vm.stealthMode ? "switch-active" : "switch" ],
            on: {
                click: _vm.switchStealthMode
            }
        }) ]), _vm._v(" "), _c("a", {
            staticClass: "settings__section",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(326) + " Logout")
            },
            on: {
                click: function($event) {
                    return _vm.logout();
                }
            }
        }) ]) ]) ]);
    };
    var settingsvue_type_template_id_0ecf9500_staticRenderFns = [];
    settingsvue_type_template_id_0ecf9500_render._withStripped = true;
    var settingsvue_type_script_lang_js_ = {
        computed: {
            pushNotifications: function pushNotifications() {
                return this.$store.state.pushNotifications;
            },
            stealthMode: function stealthMode() {
                return this.$store.state.stealthMode;
            }
        },
        methods: {
            switchStealthMode: function switchStealthMode() {
                var data = {
                    stealthMode: !this.stealthMode
                };
                if (this.stealthMode) {
                    Object(common["e"])({
                        module: "state",
                        action: "set-stealthMode",
                        data: data
                    });
                } else {
                    Object(common["e"])({
                        module: "state",
                        action: "set-stealthMode",
                        data: data
                    });
                }
            },
            switchPushNotifications: function switchPushNotifications() {
                var data = {
                    pushNotifications: !this.pushNotifications
                };
                if (this.pushNotifications) {
                    Object(common["e"])({
                        module: "state",
                        action: "set-pushNotifications",
                        data: data
                    }).then(function() {
                        Object(common["e"])({
                            module: "pushNotifications",
                            action: "unregister"
                        });
                    });
                } else {
                    Object(common["e"])({
                        module: "state",
                        action: "set-pushNotifications",
                        data: data
                    }).then(function() {
                        Object(common["e"])({
                            module: "pushNotifications",
                            action: "register"
                        });
                    });
                }
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Settings"
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            logout: function logout() {
                document.location.reload();
                var user = null;
                this.$store.commit("set", {
                    user: user
                });
                this.$store.dispatch("logout");
                Object(common["e"])({
                    module: "pushNotifications",
                    action: "unregister"
                });
                Object(common["e"])({
                    module: "state",
                    action: "delete-state"
                });
            }
        }
    };
    var components_settingsvue_type_script_lang_js_ = settingsvue_type_script_lang_js_;
    var settingsvue_type_style_index_0_lang_less_ = __webpack_require__(327);
    var settings_component = Object(componentNormalizer["a"])(components_settingsvue_type_script_lang_js_, settingsvue_type_template_id_0ecf9500_render, settingsvue_type_template_id_0ecf9500_staticRenderFns, false, null, null, null);
    if (false) {
        var settings_api;
    }
    settings_component.options.__file = "source/content/components/settings.vue";
    var settings = settings_component.exports;
    var feedvue_type_template_id_0d4313fb_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section my-reactions"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("a", {
            staticClass: "shape",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection(_vm.previousSection);
                }
            }
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Feed") ]), _vm._v(" "), _c("div", {
            staticClass: "resource__list scroll-wrapper"
        }, _vm._l(_vm.resources, function(resource) {
            return _c("Resource", _vm._b({
                key: resource.id
            }, "Resource", resource, false));
        }), 1) ]);
    };
    var feedvue_type_template_id_0d4313fb_staticRenderFns = [];
    feedvue_type_template_id_0d4313fb_render._withStripped = true;
    var feedvue_type_script_lang_js_ = {
        components: {
            ReactionsFilter: reactionsFilter,
            Resource: components_resource
        },
        computed: {
            resources: function resources() {
                return this.$store.state.resources;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            }
        },
        data: function data() {
            return {
                activeReactions: []
            };
        },
        methods: {
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this = this;
                var list = this.$el.querySelector(".resource__list");
                if (list.scrollTop > .7 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var resourcesLength = this.$store.state.resources.length;
                    var data = {
                        skip: resourcesLength,
                        resources: this.$store.state.resources
                    };
                    Object(common["e"])({
                        module: "resources",
                        action: "get-friends-feed",
                        data: data
                    }).then(function(response) {
                        if (resourcesLength < response) {
                            setTimeout(function() {
                                list.addEventListener("scroll", _this.showMoreOnScroll);
                            }, 3e3);
                        }
                    });
                }
            }
        },
        activated: function activated() {
            this.activeReactions = [];
            this.$el.querySelector(".resource__list").addEventListener("scroll", this.showMoreOnScroll);
            var data = {
                skip: 0,
                resources: []
            };
            Object(common["e"])({
                module: "resources",
                action: "get-friends-feed",
                data: data
            });
        },
        destroyed: function destroyed() {
            this.$el.querySelector(".resource__list").removeEventListener("scroll", this.showMoreOnScroll);
        }
    };
    var components_feedvue_type_script_lang_js_ = feedvue_type_script_lang_js_;
    var feedvue_type_style_index_0_lang_less_ = __webpack_require__(329);
    var feed_component = Object(componentNormalizer["a"])(components_feedvue_type_script_lang_js_, feedvue_type_template_id_0d4313fb_render, feedvue_type_template_id_0d4313fb_staticRenderFns, false, null, null, null);
    if (false) {
        var feed_api;
    }
    feed_component.options.__file = "source/content/components/feed.vue";
    var feed = feed_component.exports;
    var welcomevue_type_template_id_3840a015_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section"
        }, [ _c("OnboardingHeader"), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("div", {
            staticClass: "welcome__image"
        }), _vm._v(" "), _c("div", {
            staticClass: "onboarding-button",
            on: {
                click: function($event) {
                    return _vm.showSection("Discuss");
                }
            }
        }, [ _vm._v("START EARNING") ]), _vm._v(" "), _c("div", {
            staticClass: "welcome__signin",
            on: {
                click: function($event) {
                    return _vm.showSection("Authorization");
                }
            }
        }, [ _vm._v("\n        Already have an account? Sign in!\n    ") ]) ], 1);
    };
    var welcomevue_type_template_id_3840a015_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__title"
        }, [ _c("p", [ _vm._v("Welcome to Fulldive!") ]), _vm._v(" "), _c("p", [ _vm._v("Earn money while browsing the Internet") ]) ]);
    }, function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__info"
        }, [ _c("p", [ _vm._v("Get redeemable coins for browsing") ]), _vm._v(" "), _c("p") ]);
    } ];
    welcomevue_type_template_id_3840a015_render._withStripped = true;
    var onboardingHeadervue_type_template_id_78332336_scoped_true_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "header"
        }, [ _c("div", {
            staticClass: "skip",
            on: {
                click: function($event) {
                    return _vm.showSection("Authorization");
                }
            }
        }, [ _vm._v("skip") ]), _vm._v(" "), _c("div", {
            staticClass: "coins"
        }, [ _vm._v("10 coins") ]) ]);
    };
    var onboardingHeadervue_type_template_id_78332336_scoped_true_staticRenderFns = [];
    onboardingHeadervue_type_template_id_78332336_scoped_true_render._withStripped = true;
    var onboardingHeadervue_type_script_lang_js_ = {
        methods: {
            showSection: function showSection(onboardingSection) {
                var data = {
                    onboardingSection: onboardingSection
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-onboarding-sections",
                    data: data
                });
            }
        }
    };
    var components_onboardingHeadervue_type_script_lang_js_ = onboardingHeadervue_type_script_lang_js_;
    var onboardingHeadervue_type_style_index_0_id_78332336_lang_less_scoped_true_ = __webpack_require__(331);
    var onboardingHeader_component = Object(componentNormalizer["a"])(components_onboardingHeadervue_type_script_lang_js_, onboardingHeadervue_type_template_id_78332336_scoped_true_render, onboardingHeadervue_type_template_id_78332336_scoped_true_staticRenderFns, false, null, "78332336", null);
    if (false) {
        var onboardingHeader_api;
    }
    onboardingHeader_component.options.__file = "source/content/components/onboardingHeader.vue";
    var onboardingHeader = onboardingHeader_component.exports;
    var welcomevue_type_script_lang_js_ = {
        components: {
            OnboardingHeader: onboardingHeader
        },
        methods: {
            showSection: function showSection(onboardingSection) {
                var data = {
                    onboardingSection: onboardingSection
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-onboarding-sections",
                    data: data
                });
            }
        }
    };
    var components_welcomevue_type_script_lang_js_ = welcomevue_type_script_lang_js_;
    var welcomevue_type_style_index_0_lang_less_ = __webpack_require__(333);
    var welcome_component = Object(componentNormalizer["a"])(components_welcomevue_type_script_lang_js_, welcomevue_type_template_id_3840a015_render, welcomevue_type_template_id_3840a015_staticRenderFns, false, null, null, null);
    if (false) {
        var welcome_api;
    }
    welcome_component.options.__file = "source/content/components/welcome.vue";
    var welcome = welcome_component.exports;
    var discussvue_type_template_id_52b3e993_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section"
        }, [ _c("OnboardingHeader"), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("div", {
            staticClass: "discuss__image"
        }), _vm._v(" "), _c("div", {
            staticClass: "onboarding-button",
            on: {
                click: function($event) {
                    return _vm.showSection("Authorization");
                }
            }
        }, [ _vm._v("COOL") ]) ], 1);
    };
    var discussvue_type_template_id_52b3e993_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__title"
        }, [ _c("p", [ _vm._v("Discull and comment on any page") ]), _vm._v(" "), _c("p") ]);
    }, function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__info"
        }, [ _c("p", [ _vm._v("Sign in, add friends, and start chatting - right") ]), _vm._v(" "), _c("p", [ _vm._v("on the web page") ]) ]);
    } ];
    discussvue_type_template_id_52b3e993_render._withStripped = true;
    var discussvue_type_script_lang_js_ = {
        components: {
            OnboardingHeader: onboardingHeader
        },
        methods: {
            showSection: function showSection(onboardingSection) {
                var data = {
                    onboardingSection: onboardingSection
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-onboarding-sections",
                    data: data
                });
            }
        }
    };
    var components_discussvue_type_script_lang_js_ = discussvue_type_script_lang_js_;
    var discussvue_type_style_index_0_lang_less_ = __webpack_require__(335);
    var discuss_component = Object(componentNormalizer["a"])(components_discussvue_type_script_lang_js_, discussvue_type_template_id_52b3e993_render, discussvue_type_template_id_52b3e993_staticRenderFns, false, null, null, null);
    if (false) {
        var discuss_api;
    }
    discuss_component.options.__file = "source/content/components/discuss.vue";
    var discuss = discuss_component.exports;
    var loginAfterOnboardingvue_type_template_id_63950a6a_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "fulldive-menu__section"
        }, [ _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("div", {
            staticClass: "login_onboarding__image"
        }), _vm._v(" "), _c("div", {
            staticClass: "onboarding-button",
            on: {
                click: function($event) {
                    return _vm.showSection("Authorization");
                }
            }
        }, [ _vm._v("COOL") ]) ]);
    };
    var loginAfterOnboardingvue_type_template_id_63950a6a_staticRenderFns = [ function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__title"
        }, [ _c("p", [ _vm._v("Sign in") ]), _vm._v(" "), _c("p") ]);
    }, function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "welcome__info"
        }, [ _c("p", [ _vm._v("Sign in to exchange your coins for money") ]), _vm._v(" "), _c("p", [ _vm._v("and enjoy all our features") ]) ]);
    } ];
    loginAfterOnboardingvue_type_template_id_63950a6a_render._withStripped = true;
    var loginAfterOnboardingvue_type_script_lang_js_ = {
        methods: {
            showSection: function showSection(onboardingSection) {
                var data = {
                    onboardingSection: onboardingSection
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-onboarding-sections",
                    data: data
                });
            }
        },
        destroyed: function destroyed() {
            var data = {
                onboarding: true
            };
            Object(common["e"])({
                module: "state",
                action: "set-onboarding",
                data: data
            });
        }
    };
    var components_loginAfterOnboardingvue_type_script_lang_js_ = loginAfterOnboardingvue_type_script_lang_js_;
    var loginAfterOnboardingvue_type_style_index_0_lang_less_ = __webpack_require__(337);
    var loginAfterOnboarding_component = Object(componentNormalizer["a"])(components_loginAfterOnboardingvue_type_script_lang_js_, loginAfterOnboardingvue_type_template_id_63950a6a_render, loginAfterOnboardingvue_type_template_id_63950a6a_staticRenderFns, false, null, null, null);
    if (false) {
        var loginAfterOnboarding_api;
    }
    loginAfterOnboarding_component.options.__file = "source/content/components/loginAfterOnboarding.vue";
    var loginAfterOnboarding = loginAfterOnboarding_component.exports;
    var commentActivityvue_type_template_id_3fdfba41_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "comments fulldive-menu__section"
        }, [ _c("div", {
            staticClass: "header"
        }, [ _c("div", {
            staticClass: "menu-buttons"
        }, [ _c("a", {
            staticClass: "menu-button",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(5))
            },
            on: {
                click: function($event) {
                    return _vm.showSection(_vm.previousSection);
                }
            }
        }) ]) ]), _vm._v(" "), _c("div", {
            staticClass: "title"
        }, [ _vm._v("Comment Activity") ]), _vm._v(" "), _c("PeriodFilter", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.firstYear,
                expression: "firstYear"
            } ],
            attrs: {
                firstYear: _vm.firstYear,
                lastYear: _vm.lastYear,
                firstMonth: _vm.firstMonth,
                lastMonth: _vm.lastMonth
            },
            on: {
                activateOnScroll: _vm.activateOnScroll,
                getActivityFiltered: _vm.getActivityFiltered
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "list scroll-wrapper"
        }, _vm._l(_vm.activitiesComments, function(activityComment) {
            return _c("Activity", _vm._b({
                key: activityComment.id
            }, "Activity", activityComment, false));
        }), 1) ], 1);
    };
    var commentActivityvue_type_template_id_3fdfba41_staticRenderFns = [];
    commentActivityvue_type_template_id_3fdfba41_render._withStripped = true;
    var activityvue_type_template_id_39d4166c_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "activity"
        }, [ _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.activityDate,
                expression: "activityDate"
            } ],
            staticClass: "activity__date"
        }, [ _vm._v("\n         " + _vm._s(_vm.activityDate) + "            \n     ") ]), _vm._v(" "), _c("div", {
            staticClass: "activity__extras"
        }, [ _c("div", [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.activityResource.typeData.domain.iconUrl && _vm.isLoadIcon,
                expression: "activityResource.typeData.domain.iconUrl && isLoadIcon"
            } ],
            staticClass: "activity__icon__img",
            attrs: {
                src: _vm.activityResource.typeData.domain.iconUrl
            },
            on: {
                load: function($event) {
                    return _vm.loaded("icon");
                }
            }
        }), _vm._v(" "), _c("div", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: !_vm.isLoadIcon,
                expression: "!isLoadIcon"
            } ],
            staticClass: "activity__icon"
        }) ]), _vm._v(" "), _c("div", {
            staticClass: "activity__content"
        }, [ _c("div", {
            staticClass: "main-info"
        }, _vm._l(_vm.commentText(_vm.comment.text), function(item) {
            return _c("a", _vm._b({
                key: item,
                staticClass: "activity__text",
                attrs: {
                    href: _vm.activityResource.url
                },
                on: {
                    click: function($event) {
                        return _vm.showSection("Comments");
                    }
                }
            }, "a", item, false), [ item.search(_vm.userRegex) !== -1 ? _c("span", {
                staticClass: "activity__mention"
            }, [ _vm._v("\n                         @" + _vm._s(item.split("]")[0].slice(1)) + "\n                     ") ]) : _c("span", [ _vm._v(" \n                         " + _vm._s(item) + "\n                     ") ]) ]);
        }), 0), _vm._v(" "), _c("div", {
            staticClass: "activity__info"
        }, [ _c("a", {
            attrs: {
                href: _vm.activityResource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _vm._v("\n                     " + _vm._s(_vm.activityResource.typeData.domain.domain) + "\n                 ") ]), _vm._v(" "), _c("a", {
            attrs: {
                "f-iv": "comment.replyCount > 0",
                href: _vm.comment.replyCount
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ (_vm.comment.replyCount = 1) ? _c("span", [ _vm._v("1 reply") ]) : _c("span", [ _vm._v(_vm._s(_vm.comment.replyCount) + "replies") ]) ]) ]) ]), _vm._v(" "), _vm.activityResource.previewUrl !== "" ? _c("a", {
            staticClass: "activity__preview",
            attrs: {
                href: _vm.activityResource.url
            },
            on: {
                click: function($event) {
                    return _vm.showSection("Comments");
                }
            }
        }, [ _c("img", {
            directives: [ {
                name: "show",
                rawName: "v-show",
                value: _vm.isLoad,
                expression: "isLoad"
            } ],
            attrs: {
                src: _vm.activityResource.isLoadPreView
            },
            on: {
                load: function($event) {
                    return _vm.loaded("preView");
                }
            }
        }) ]) : _vm._e() ]) ]);
    };
    var activityvue_type_template_id_39d4166c_staticRenderFns = [];
    activityvue_type_template_id_39d4166c_render._withStripped = true;
    var activityvue_type_script_lang_js_ = {
        props: [ "comment", "resourceId" ],
        data: function data() {
            return {
                userRegex: new RegExp("\\[([\\w\\d_#\\-\\s]+)\\]\\(evry:\\/\\/user\\/([a-zA-Z0-9_-]{7,14})\\)"),
                isLoadPreView: false,
                isLoadIcon: false
            };
        },
        computed: {
            activityResource: function activityResource() {
                return this.$store.state.activitiesResources[this.resourceId];
            },
            activityDate: function activityDate() {
                var checkDate = this.$store.state.checkDate;
                moment_default.a.locale("en", {
                    calendar: {
                        lastDay: "[Yesterday]",
                        sameDay: "[Today]",
                        nextDay: "[Tomorrow]",
                        lastWeek: "L",
                        nextWeek: "L",
                        sameElse: "L"
                    }
                });
                var activityDate = moment_default()(new Date(this.comment.createdTs * 1e3)).calendar();
                if (activityDate === checkDate) {
                    return null;
                }
                checkDate = activityDate;
                if (this.$store.state.activitiesResources[this.resourceId]) {
                    this.$store.commit("set", {
                        checkDate: checkDate
                    });
                }
                return activityDate;
            }
        },
        methods: {
            commentText: function commentText(activityText) {
                var text = Object(common["a"])(activityText);
                var length = 0;
                text.forEach(function(item, i) {
                    if (item.length + length > 60) {
                        text[i] = item.slice(0, 60);
                    }
                    length += item.length;
                    if (length > 60) {
                        text = text.slice(0, i + 1);
                        text[i + 1] = "...";
                    }
                });
                return text;
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "CommentActivity",
                    eventCommentInfo: {
                        commentIdFromEvent: this.comment.id,
                        parentIdFromEvent: this.comment.parentId,
                        showReplies: true
                    }
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-comment-id-from-event",
                    data: data
                });
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            loaded: function loaded(element) {
                if (element === "preView") {
                    this.isLoadPreView = true;
                } else if (element === "icon") {
                    this.isLoadIcon = true;
                }
            }
        }
    };
    var components_activityvue_type_script_lang_js_ = activityvue_type_script_lang_js_;
    var activityvue_type_style_index_0_lang_less_ = __webpack_require__(339);
    var activity_component = Object(componentNormalizer["a"])(components_activityvue_type_script_lang_js_, activityvue_type_template_id_39d4166c_render, activityvue_type_template_id_39d4166c_staticRenderFns, false, null, null, null);
    if (false) {
        var activity_api;
    }
    activity_component.options.__file = "source/content/components/activity.vue";
    var activity = activity_component.exports;
    var periodFiltervue_type_template_id_207a8714_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "filter-buttons"
        }, [ _c("button", {
            class: [ _vm.filterOnYear ? "filter-button-active" : "filter-button" ],
            on: {
                click: _vm.setShowYears
            }
        }, [ _vm.periodToFilter.year !== "" ? _c("span", [ _vm._v(_vm._s(_vm.periodToFilter.year)) ]) : _c("span", [ _vm._v("Year") ]) ]), _vm._v(" "), _vm.showYears ? _c("div", {
            staticClass: "date-filter-list"
        }, _vm._l(_vm.years, function(year, key) {
            return _c("div", {
                key: key,
                on: {
                    click: function($event) {
                        return _vm.setYearToFilter(year);
                    }
                }
            }, [ _vm._v("\n            " + _vm._s(year) + "\n        ") ]);
        }), 0) : _vm._e(), _vm._v(" "), _c("button", {
            class: [ _vm.filterOnMonth ? "filter-button-active" : "filter-button" ],
            attrs: {
                disabled: !_vm.filterOnYear
            },
            on: {
                click: _vm.setShowMonths
            }
        }, [ _vm.periodToFilter.month !== "" ? _c("span", [ _vm._v("\n            " + _vm._s(_vm.$options.constants.months[_vm.periodToFilter.month - 1])) ]) : _c("span", [ _vm._v("Month") ]) ]), _vm._v(" "), _vm.showMonths ? _c("div", {
            staticClass: "date-filter-list"
        }, _vm._l(_vm.months, function(value, key) {
            return _c("div", {
                key: key,
                on: {
                    click: function($event) {
                        return _vm.setMonthToFilter(value);
                    }
                }
            }, [ _vm._v(_vm._s(value)) ]);
        }), 0) : _vm._e() ]);
    };
    var periodFiltervue_type_template_id_207a8714_staticRenderFns = [];
    periodFiltervue_type_template_id_207a8714_render._withStripped = true;
    var periodFiltervue_type_script_lang_js_ = {
        props: [ "firstYear", "lastYear", "firstMonth", "lastMonth" ],
        constants: {
            months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
        },
        computed: {
            resource: function resource() {
                return this.$store.state.resource;
            },
            years: function years() {
                var _this = this;
                return filter_default()([ "2016", "2017", "2018", "2019", "2020" ], function(year) {
                    return _this.firstYear <= +year && +year <= _this.lastYear;
                });
            },
            months: function months() {
                var months = this.$options.constants.months;
                if (this.firstYear === this.lastYear) {
                    return months.slice(this.firstMonth, this.lastMonth + 1);
                } else if (+this.periodToFilter.year === this.firstYear) {
                    return months.sclice(this.firstMonth, months.length);
                } else if (+this.periodToFilter.year === this.lastYear) {
                    return months.slice(0, this.lastMonth + 1);
                }
                return months;
            }
        },
        data: function data() {
            return {
                showMonths: false,
                showYears: false,
                periodToFilter: {
                    year: "",
                    month: ""
                },
                filterOnMonth: false,
                filterOnYear: false
            };
        },
        methods: {
            setShowMonths: function setShowMonths() {
                if (!this.showMonths && this.filterOnMonth) {
                    this.periodToFilter.month = "";
                    this.$emit("getActivityFiltered", this.periodToFilter);
                    this.filterOnMonth = false;
                    this.$emit("activateOnScroll");
                } else if (!this.filterOnMonth) {
                    this.showMonths = !this.showMonths;
                }
            },
            setShowYears: function setShowYears() {
                if (!this.showYears && this.filterOnYear) {
                    this.periodToFilter.year = "";
                    this.periodToFilter.year = "";
                    this.$emit("getActivityFiltered", this.periodToFilter);
                    this.filterOnYear = false;
                    this.filterOnMonth = false;
                    this.$emit("activateOnScroll");
                } else if (!this.filterOnYear) {
                    this.showYears = !this.showYears;
                }
            },
            setYearToFilter: function setYearToFilter(value) {
                this.filterOnYear = true;
                this.periodToFilter.year = value;
                this.$emit("getActivityFiltered", this.periodToFilter);
                this.showYears = false;
            },
            setMonthToFilter: function setMonthToFilter(value) {
                this.filterOnMonth = true;
                this.periodToFilter.month = this.$options.constants.months.indexOf(value) + 1;
                this.$emit("getActivityFiltered", this.periodToFilter);
                this.showMonths = false;
            }
        }
    };
    var components_periodFiltervue_type_script_lang_js_ = periodFiltervue_type_script_lang_js_;
    var periodFiltervue_type_style_index_0_lang_less_ = __webpack_require__(341);
    var periodFilter_component = Object(componentNormalizer["a"])(components_periodFiltervue_type_script_lang_js_, periodFiltervue_type_template_id_207a8714_render, periodFiltervue_type_template_id_207a8714_staticRenderFns, false, null, null, null);
    if (false) {
        var periodFilter_api;
    }
    periodFilter_component.options.__file = "source/content/components/periodFilter.vue";
    var periodFilter = periodFilter_component.exports;
    var commentActivityvue_type_script_lang_js_ = {
        components: {
            Activity: activity,
            PeriodFilter: periodFilter
        },
        data: function data() {
            return {
                fromTs: moment_default()("01/01/2017").unix(),
                toTs: moment_default()(new Date()).unix()
            };
        },
        computed: {
            firstYear: function firstYear() {
                return new Date(this.$store.state.activityFilterPeriod.earliest * 1e3).getFullYear();
            },
            lastYear: function lastYear() {
                return new Date(this.$store.state.activityFilterPeriod.latest * 1e3).getFullYear();
            },
            firstMonth: function firstMonth() {
                return new Date(this.$store.state.activityFilterPeriod.earliest * 1e3).getMonth();
            },
            lastMonth: function lastMonth() {
                return new Date(this.$store.state.activityFilterPeriod.latest * 1e3).getMonth();
            },
            activitiesComments: function activitiesComments() {
                var _this = this;
                var activitiesComments = filter_default()(this.$store.state.activitiesComments, function(activity) {
                    return _this.$store.state.activitiesResources[activity.resourceId];
                });
                return activitiesComments;
            },
            previousSection: function previousSection() {
                return this.$store.state.previousSection;
            },
            activitiesResources: function activitiesResources() {
                return this.$store.state.activitiesResources;
            }
        },
        methods: {
            getActivityFiltered: function getActivityFiltered(period) {
                var year = period.year, month = period.month;
                if (year === "") {
                    this.fromTs = moment_default()("01/01/2017").unix();
                    this.toTs = moment_default()(new Date()).unix();
                } else if (month === "") {
                    this.fromTs = moment_default()("01/01/".concat(year)).unix();
                    this.toTs = moment_default()("12/31/".concat(year)).unix();
                } else {
                    this.fromTs = moment_default()("".concat(month, "/01/").concat(year)).unix();
                    this.toTs = moment_default()("".concat(month, "/31/").concat(year)).unix();
                }
                var data = {
                    skip: 0,
                    userId: this.$store.state.user._id,
                    activitiesComments: [],
                    activitiesResources: {},
                    fromTs: this.fromTs,
                    toTs: this.toTs
                };
                Object(common["e"])({
                    module: "comments",
                    action: "get-activities",
                    data: data
                });
            },
            showMoreOnScroll: function showMoreOnScroll() {
                var _this2 = this;
                var list = this.$el.querySelector(".list");
                if (list.scrollTop > 0 * list.scrollHeight) {
                    list.removeEventListener("scroll", this.showMoreOnScroll);
                    var length = this.$store.state.activitiesComments.length;
                    var data = {
                        skip: length,
                        userId: this.$store.state.user._id,
                        activitiesComments: this.$store.state.activitiesComments,
                        activitiesResources: this.$store.state.activitiesResources,
                        fromTs: this.fromTs,
                        toTs: this.toTs
                    };
                    Object(common["e"])({
                        module: "comments",
                        action: "get-activities",
                        data: data
                    }).then(function(response) {
                        if (length < response) {
                            setTimeout(function() {
                                list.addEventListener("scroll", _this2.showMoreOnScroll);
                            }, 1e3);
                        }
                    });
                }
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Profile"
                };
                Object(common["e"])({
                    module: "state",
                    action: [ "set-sections" ],
                    data: data
                });
            },
            activateOnScroll: function activateOnScroll() {
                this.$el.querySelector(".list").addEventListener("scroll", this.showMoreOnScroll);
            }
        },
        activated: function activated() {
            this.$el.querySelector(".list").addEventListener("scroll", this.showMoreOnScroll);
            var data = {
                skip: 0,
                userId: this.$store.state.user._id,
                activitiesComments: [],
                activitiesResources: {},
                fromTs: this.fromTs,
                toTs: this.toTs
            };
            Object(common["e"])({
                module: "comments",
                action: "get-activities",
                data: data
            });
        }
    };
    var components_commentActivityvue_type_script_lang_js_ = commentActivityvue_type_script_lang_js_;
    var commentActivity_component = Object(componentNormalizer["a"])(components_commentActivityvue_type_script_lang_js_, commentActivityvue_type_template_id_3fdfba41_render, commentActivityvue_type_template_id_3fdfba41_staticRenderFns, false, null, null, null);
    if (false) {
        var commentActivity_api;
    }
    commentActivity_component.options.__file = "source/content/components/commentActivity.vue";
    var commentActivity = commentActivity_component.exports;
    var screenButtonvue_type_template_id_1ca4dc1b_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "screen-button"
        }, [ _vm.resource ? _c("ScreenLikeDislike", {
            attrs: {
                resource: _vm.resource
            }
        }) : _vm._e(), _vm._v(" "), _c("a", {
            staticClass: "cta comment-button",
            domProps: {
                innerHTML: _vm._s("" + __webpack_require__(343))
            },
            on: {
                click: _vm.toggleMenu
            }
        }), _vm._v(" "), _c("div", {
            staticClass: "exit",
            on: {
                click: function($event) {
                    return _vm.close();
                }
            }
        }) ], 1);
    };
    var screenButtonvue_type_template_id_1ca4dc1b_staticRenderFns = [];
    screenButtonvue_type_template_id_1ca4dc1b_render._withStripped = true;
    var screenLikeDislikevue_type_template_id_e5b50f16_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", {
            staticClass: "screen-reactions"
        }, [ _vm.resource.socialData.myReaction !== "dislike" && _vm.resource.socialData.myReaction !== "" ? _c("a", {
            staticClass: "cta cta_vote-up",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(21))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("like");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-up",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(22))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("like");
                }
            }
        }), _vm._v(" "), _vm.count() > 0 ? _c("div", {
            staticClass: "votes__count active"
        }, [ _vm._v(_vm._s(_vm.count())) ]) : _c("div", {
            staticClass: "votes__count"
        }, [ _vm._v(" - ") ]), _vm._v(" "), _vm.resource.socialData.myReaction === "dislike" ? _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(23))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("dislike");
                }
            }
        }) : _c("a", {
            staticClass: "cta cta_vote-down",
            domProps: {
                innerHTML: _vm._s(__webpack_require__(24))
            },
            on: {
                click: function($event) {
                    return _vm.updateReaction("dislike");
                }
            }
        }) ]);
    };
    var screenLikeDislikevue_type_template_id_e5b50f16_staticRenderFns = [];
    screenLikeDislikevue_type_template_id_e5b50f16_render._withStripped = true;
    var screenLikeDislikevue_type_script_lang_js_ = {
        props: [ "resource" ],
        methods: {
            updateReaction: function updateReaction(reactionType) {
                var resource = this.$store.state.resource;
                var data = {
                    method: "",
                    resourceId: resource.id,
                    reactionType: reactionType
                };
                if (resource.socialData.myReaction === reactionType) {
                    data.method = "delete";
                    resource.stats.reactionCount -= 1;
                    resource.socialData.myReaction = "";
                    if (reactionType === "dislike") {
                        resource.stats.reactions.dislike -= 1;
                    }
                } else if (resource.socialData.myReaction === "") {
                    resource.stats.reactionCount += 1;
                    resource.socialData.myReaction = reactionType;
                    if (reactionType === "dislike") {
                        if (resource.stats.reactions.dislike) {
                            resource.stats.reactions.dislike += 1;
                        } else {
                            resource.stats.reactions.dislike = 1;
                        }
                    }
                    data.method = "post";
                } else if (resource.socialData.myReaction === "dislike") {
                    resource.socialData.myReaction = reactionType;
                    resource.stats.reactions.dislike -= 1;
                    data.method = "post";
                } else {
                    resource.socialData.myReaction = reactionType;
                    if (reactionType === "dislike") {
                        if (resource.stats.reactions.dislike) {
                            resource.stats.reactions.dislike += 1;
                        } else {
                            resource.stats.reactions.dislike = 1;
                        }
                    }
                    data.method = "post";
                }
                Object(common["e"])({
                    module: "reactions",
                    action: "update-reaction",
                    data: data
                });
                this.$store.commit("set", {
                    resource: resource
                });
            },
            count: function count() {
                var reactionsCount = this.resource.stats.reactionCount;
                var dislikeCount = this.resource.stats.reactions.dislike;
                if (!reactionsCount) {
                    return "-";
                }
                if (!dislikeCount) {
                    return reactionsCount;
                }
                return reactionsCount - 2 * dislikeCount;
            }
        }
    };
    var components_screenLikeDislikevue_type_script_lang_js_ = screenLikeDislikevue_type_script_lang_js_;
    var screenLikeDislikevue_type_style_index_0_lang_less_ = __webpack_require__(344);
    var screenLikeDislike_component = Object(componentNormalizer["a"])(components_screenLikeDislikevue_type_script_lang_js_, screenLikeDislikevue_type_template_id_e5b50f16_render, screenLikeDislikevue_type_template_id_e5b50f16_staticRenderFns, false, null, null, null);
    if (false) {
        var screenLikeDislike_api;
    }
    screenLikeDislike_component.options.__file = "source/content/components/screenLikeDislike.vue";
    var screenLikeDislike = screenLikeDislike_component.exports;
    var screenButtonvue_type_script_lang_js_ = {
        components: {
            ScreenLikeDislike: screenLikeDislike
        },
        computed: {
            resource: function resource() {
                return this.$store.state.resource;
            }
        },
        methods: {
            close: function close() {
                var screenButtonShown = false;
                this.$store.commit("set", {
                    screenButtonShown: screenButtonShown
                });
            },
            toggleMenu: function toggleMenu() {
                var showMenu = !this.$store.state.showMenu;
                var data = {
                    showMenu: showMenu
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-showMenu",
                    data: data
                });
            }
        }
    };
    var components_screenButtonvue_type_script_lang_js_ = screenButtonvue_type_script_lang_js_;
    var screenButtonvue_type_style_index_0_lang_less_ = __webpack_require__(346);
    var screenButton_component = Object(componentNormalizer["a"])(components_screenButtonvue_type_script_lang_js_, screenButtonvue_type_template_id_1ca4dc1b_render, screenButtonvue_type_template_id_1ca4dc1b_staticRenderFns, false, null, null, null);
    if (false) {
        var screenButton_api;
    }
    screenButton_component.options.__file = "source/content/components/screenButton.vue";
    var screenButton = screenButton_component.exports;
    var ic_fulldive_logo = __webpack_require__(11);
    var ic_fulldive_logo_default = __webpack_require__.n(ic_fulldive_logo);
    var coin = __webpack_require__(12);
    var coin_default = __webpack_require__.n(coin);
    var appvue_type_script_lang_js_ = {
        components: {
            Comments: components_comments,
            Profile: profile,
            Authorization: authorization,
            Friends: friends,
            Share: share,
            MyReactions: myReactions,
            Bookmarks: bookmarks,
            Notifications: notifications,
            UserProfile: userProfile,
            Settings: settings,
            ScreenButton: screenButton,
            Feed: feed,
            CommentActivity: commentActivity,
            Welcome: welcome,
            Discuss: discuss,
            LoginOnboarding: loginAfterOnboarding
        },
        created: function created() {
            var _this = this;
            setInterval(function() {
                if (document.location.href.startsWith("".concat(constants["f"]))) {
                    _this.changeElements();
                }
                if (_this.isAuthorized) {
                    if (document.location.href === "".concat(constants["f"])) {
                        _this.setHomePageHeader();
                    }
                    if (document.referrer.startsWith("".concat(constants["f"]))) {
                        if (document.location.href.startsWith("https://www.google.com/search")) {
                            _this.setGoogleResultsPageHeader();
                        } else if (document.location.href.startsWith("https://search.yahoo.com/search")) {
                            _this.setYahooResultsPageHeader();
                        } else if (document.location.href.startsWith("https://www.bing.com/search")) {
                            _this.setBingResultsPageHeader();
                        } else if (document.location.href.startsWith("https://duckduckgo.com/?q")) {
                            _this.setDuckResultsPageHeader();
                        }
                    }
                }
                _this.setShowMenuOnAvatarFDSearchClick();
                if (_this.$store.state.currentUrl !== document.location.href) {
                    if (_this.isAuthorized) {
                        var data = {
                            currentSection: "Comments",
                            currentUrl: document.location.href
                        };
                        Object(common["e"])({
                            module: "state",
                            action: "set-sections",
                            data: data
                        });
                    }
                }
            }, 500);
            setInterval(function() {
                if (_this.isAuthorized) {
                    Object(common["e"])({
                        module: "events",
                        action: "get-fresh-events"
                    }).then(function(resopse) {
                        if (resopse && _this.$store.state.currentSection === "Notifications") {
                            var data = {
                                skip: 0,
                                events: []
                            };
                            Object(common["e"])({
                                module: "events",
                                action: "get-events",
                                data: data
                            });
                            Object(common["e"])({
                                module: "events",
                                action: "reset-fresh-events"
                            });
                        }
                    });
                }
            }, 5e3);
            this.$store.dispatch("getUser");
            this.$store.dispatch("getSections");
            this.$store.dispatch("getShowMenu");
            this.$store.dispatch("getPushNotifications");
            this.$store.dispatch("getStealthMode");
            this.$store.dispatch("getOnboardingSections");
            this.$store.dispatch("getOnboarding");
            if (this.isAuthorized) {
                this.$store.dispatch("getCoins");
            }
            window.addEventListener("load", this.getOtherUser);
        },
        computed: {
            user: function user() {
                return this.$store.state.user;
            },
            coins: function coins() {
                return this.$store.state.coins;
            },
            showMenu: function showMenu() {
                return this.$store.state.showMenu;
            },
            onboardingSection: function onboardingSection() {
                return this.$store.state.onboardingSection;
            },
            currentSection: function currentSection() {
                return this.$store.state.currentSection;
            },
            isAuthorized: function isAuthorized() {
                return !!(this.$store.state.user && this.$store.state.user._id);
            },
            freshEvents: function freshEvents() {
                return this.$store.state.freshEvents;
            },
            stealthMode: function stealthMode() {
                return this.$store.state.stealthMode;
            },
            screenButtonShown: function screenButtonShown() {
                return this.$store.state.screenButtonShown;
            },
            onboarding: function onboarding() {
                return this.$store.state.onboarding;
            }
        },
        methods: {
            getOtherUser: function getOtherUser() {
                Object(common["e"])({
                    module: "state",
                    action: "get-other-user"
                });
            },
            showSection: function showSection(currentSection) {
                var data = {
                    currentSection: currentSection,
                    previousSection: "Comments"
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-sections",
                    data: data
                });
            },
            toggleMenu: function toggleMenu() {
                var showMenu = !this.$store.state.showMenu;
                var data = {
                    showMenu: showMenu
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-showMenu",
                    data: data
                });
            },
            setHomePageHeader: function setHomePageHeader() {
                if (document.getElementById("fdAvatar").getAttribute("src").startsWith("/img/questionAvatar")) {
                    document.getElementById("fdAvatar").outerHTML = "<img src=".concat(this.user.avatar.size.normal, ' \n                id="fdAvatar" style="margin: -5px 30px 0 20px; width: 32px; height: 32px;\n                border-radius: 20px; object-fit: cover;">');
                }
                if (this.coins.total || this.coins.total === 0) {
                    document.querySelector(".coins_value").textContent = "".concat(this.coins.total);
                } else if (this.isAuthorized) {
                    this.$store.dispatch("getCoins");
                }
            },
            setGoogleResultsPageHeader: function setGoogleResultsPageHeader() {
                if (document.querySelector("div.gb_Da.gb_Pc.gb_ag.gb_f > div.gb_if.gb_Ha.gb_ag.gb_f")) {
                    document.querySelector("div.gb_Da.gb_Pc.gb_ag.gb_f > div.gb_if.gb_Ha.gb_ag.gb_f").innerHTML = "<img src=".concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                style="width: 32px; height: 32px; background-color: grey;\n                border-radius: 20px; object-fit: cover;">');
                } else if (document.querySelector("div > div > div > div.gb_Uf.gb_f")) {
                    document.querySelector("div > div > div > div.gb_Uf.gb_f").innerHTML = "<img src=".concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                style="width: 32px; height: 32px; background-color: grey;\n                border-radius: 20px; object-fit: cover;">');
                } else if (document.querySelector("div.gb_Fa.gb_Qc.gb_bg.gb_f > div.gb_jf.gb_Ja.gb_bg.gb_f")) {
                    document.querySelector("div.gb_Fa.gb_Qc.gb_bg.gb_f > div.gb_jf.gb_Ja.gb_bg.gb_f").innerHTML = "<img src=".concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                style="width: 32px; height: 32px; background-color: grey;\n                border-radius: 20px; object-fit: cover;">');
                }
                document.querySelector("div:nth-child(2) > div.A8SBwf > div.logo").innerHTML = '<img src="'.concat(ic_fulldive_logo_default.a, '">');
                if (this.coins.total || this.coins.total === 0) {
                    console.log("in coins set if");
                    var parentElement = document.querySelector("#gbw > div > div > div");
                    var theFirstChild = parentElement.firstChild;
                    if (!document.getElementById("fdCoins")) {
                        var newElement = document.createElement("div");
                        newElement.innerHTML = '<div id="fdCoins" style="display: flex; margin: -3px 0 0 0;\n                        width: 80px; max-height: 30px; min-height: 30px;padding-top: 7px;\n                        background-color: #f4f5f7; border-radius: 20px;\n                        justify-content: space-between; flex-direction: row;">\n                        <img src="'.concat(coin_default.a, '" style="margin: -6px 5px 0 5px;\n                        min-width:24px; min-height: 24px;" alt="">\n                        <div style="margin: 5px 15px 0 0; color: #787878;">\n                        ').concat(this.coins.total, "</div></div>");
                        parentElement.insertBefore(newElement, theFirstChild);
                    }
                } else if (this.isAuthorized) {
                    this.$store.dispatch("getCoins");
                }
            },
            setYahooResultsPageHeader: function setYahooResultsPageHeader() {
                if (document.querySelector("#yucs-mail_link_id")) {
                    document.querySelector("#yucs-mail_link_id").outerHTML = "<img src=".concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                style="width: 32px; height: 32px; background-color: grey;\n                border-radius: 20px; object-fit: cover; margin: 5px -7px 0 0;">');
                }
                if (!document.getElementById("hhhh")) {
                    document.querySelector("#logo").outerHTML = '<img style="background-color: #F1F1F1; position: fixed;\n                top: 23px; right: 10px;" id="hhhh" src="'.concat(ic_fulldive_logo_default.a, '">');
                }
                if (this.coins.total || this.coins.total === 0) {
                    if (!document.getElementById("fdCoins")) {
                        document.getElementById("yucs-profile").innerHTML = '<div id="fdCoins" \n                        style="    display: flex; width: 80px; max-height: 30px;\n                        min-height: 30px; padding-top: 7px; background-color: #fff;\n                        border-radius: 20px; justify-content: space-between; flex-direction: row;\n                        position: fixed; top: 18px; left: 17px;">\n                        <img src="'.concat(coin_default.a, '" style="margin: -6px 5px 0 5px;\n                        min-width:24px; min-height: 24px;" alt="">\n                        <div style="margin: 5px 15px 0 0; color: #787878;">\n                        ').concat(this.coins.total, "</div></div>");
                    }
                } else if (this.isAuthorized) {
                    this.$store.dispatch("getCoins");
                }
            },
            setBingResultsPageHeader: function setBingResultsPageHeader() {
                if (!document.getElementById("hhhh")) {
                    document.querySelector("#sb_form > a").outerHTML = '<img style="position: fixed;\n                top: 27px; right: 172px;" id="hhhh" src="'.concat(ic_fulldive_logo_default.a, '">');
                }
                if (this.coins.total || this.coins.total === 0) {
                    if (!document.getElementById("fdCoins")) {
                        document.querySelector("#id_h").outerHTML = '<div id="fdCoins" \n                    style="display: flex; width: 80px; max-height: 30px;\n                    min-height: 30px; padding-top: 7px; background-color: #f4f5f7;\n                    border-radius: 20px; justify-content: space-between; flex-direction: row;\n                    position: fixed; top: 21px; right: 71px;">\n                    <img src="'.concat(coin_default.a, '" style="margin: -6px 5px 0 5px;\n                    min-width:24px; min-height: 24px;" alt="">\n                    <div style="margin: 5px 15px 0 0; color: #787878;">\n                    ').concat(this.coins.total, "</div></div>            \n                    <img src=").concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                    style="width: 32px; height: 32px; background-color: grey;\n                    border-radius: 20px; object-fit: cover; position: fixed;\n                    top: 23px; right: 20px;">');
                    }
                } else if (this.isAuthorized) {
                    this.$store.dispatch("getCoins");
                }
            },
            setDuckResultsPageHeader: function setDuckResultsPageHeader() {
                if (!document.getElementById("hhhh")) {
                    document.querySelector("div.header__search-wrap > a").outerHTML = '<img style="position: absolute; left: 9px;\n                top: 9px; width: 80px;" id="hhhh" src="'.concat(ic_fulldive_logo_default.a, '">');
                }
                if (this.coins.total || this.coins.total === 0) {
                    if (!document.getElementById("fdCoins")) {
                        document.querySelector("#header_wrapper > div.header--aside.js-header-aside").outerHTML = '<div id="fdCoins" \n                        style="display: flex; width: 80px; max-height: 30px;\n                        min-height: 30px; padding-top: 7px; background-color: #f4f5f7;\n                        border-radius: 20px; justify-content: space-between; flex-direction: row;\n                        position: fixed; top: 20px; right: 67px;">\n                        <img src="'.concat(coin_default.a, '" style="margin: -6px 5px 0 5px;\n                        min-width:24px; min-height: 24px;" alt="">\n                        <div style="margin: 0 15px 0 0; color: #787878;">\n                        ').concat(this.coins.total, "</div></div>            \n                        <img src=").concat(this.user.avatar.size.normal, ' id="fdAvatar"\n                        style="width: 32px; height: 32px; background-color: grey;\n                        border-radius: 20px; object-fit: cover;\n                        position: fixed; top: 23px; right: 19px;">');
                    }
                } else if (this.isAuthorized) {
                    this.$store.dispatch("getCoins");
                }
            },
            changeElements: function changeElements() {
                if (!this.isAuthorized) {
                    if (document.querySelector(".add_fulldive").textContent === "Add Fulldive to Chome") {
                        document.querySelector(".add_fulldive").textContent = "Log in to Fulldive";
                        document.querySelector(".add_fulldive").setAttribute("href", "");
                        document.querySelector(".add_fulldive").setAttribute("target", "");
                        document.querySelector(".add_fulldive").addEventListener("click", this.toggleMenu);
                    }
                } else {
                    if (document.querySelector(".add_fulldive")) {
                        document.querySelector(".add_fulldive").outerHTML = "";
                        if (document.getElementById("skip")) {
                            document.getElementById("skip").click();
                        }
                    }
                }
                if (document.querySelector(".adblock")) {
                    document.querySelector(".adblock").outerHTML = "";
                }
            },
            setShowMenuOnAvatarFDSearchClick: function setShowMenuOnAvatarFDSearchClick() {
                if (document.getElementById("fdAvatar")) {
                    document.getElementById("fdAvatar").addEventListener("click", this.toggleMenu);
                }
            }
        }
    };
    var components_appvue_type_script_lang_js_ = appvue_type_script_lang_js_;
    var appvue_type_style_index_0_lang_less_ = __webpack_require__(348);
    var app_component = Object(componentNormalizer["a"])(components_appvue_type_script_lang_js_, appvue_type_template_id_4caa6658_render, staticRenderFns, false, null, null, null);
    if (false) {
        var app_api;
    }
    app_component.options.__file = "source/content/components/app.vue";
    var app = app_component.exports;
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
    vue_common_default.a.use(vuex_esm["a"]);
    var app_Content = function() {
        function Content() {
            _classCallCheck(this, Content);
            this.vueMain = new vue_common_default.a({
                el: Content.createShadowRoot().querySelector("#fulldive"),
                store: new vuex_esm["a"].Store(config["a"]),
                render: function render(h) {
                    return h(app);
                }
            });
            this.setEvents();
        }
        _createClass(Content, [ {
            key: "setEvents",
            value: function setEvents() {
                var _this = this;
                chrome.runtime.onMessage.addListener(function(_ref, sender, sendResponse) {
                    var action = _ref.action, data = _ref.data;
                    if (!action || typeof _this[action] !== "function") {
                        return false;
                    }
                    _this[action]({
                        data: data,
                        sender: sender,
                        sendResponse: sendResponse
                    });
                    return true;
                });
            }
        }, {
            key: "updateStore",
            value: function updateStore(_ref2) {
                var data = _ref2.data;
                this.vueMain.$store.commit("set", data);
            }
        }, {
            key: "toggleMenu",
            value: function toggleMenu() {
                var showMenu = !this.vueMain.$store.state.showMenu;
                var data = {
                    showMenu: showMenu
                };
                Object(common["e"])({
                    module: "state",
                    action: "set-showMenu",
                    data: data
                });
                var screenButtonShown = true;
                this.vueMain.$store.commit("set", {
                    screenButtonShown: screenButtonShown
                });
            }
        } ], [ {
            key: "createShadowRoot",
            value: function createShadowRoot() {
                var wrapper = document.createElement("div");
                document.body.append(wrapper);
                var shadowroot = wrapper.attachShadow({
                    mode: "open"
                });
                shadowroot.innerHTML = '\n            <style>@import url("'.concat(chrome.extension.getURL("content/styles.css"), '");</style>\n            <div id="fulldive"></div>');
                return shadowroot;
            }
        } ]);
        return Content;
    }();
    window.content = new app_Content();
} ]);