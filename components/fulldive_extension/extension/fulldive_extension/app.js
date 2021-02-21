(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _Blocker = require('../lib/Blocker');

var _Blocker2 = _interopRequireDefault(_Blocker);

var _utils = require('../lib/utils');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Tabs = new _helpers.CrTabs(); /**
                                     * Chrome extension example
                                     */


const config = require('../config/local.json');
const redirectTable = config.redirect;

const chrome = window.chrome;
const storage = chrome.storage.local;
const insertCSS = (tabId, detail) => {
  chrome.tabs.insertCSS(tabId, detail, () => {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message, tabId, Tabs.get(tabId));
    }
  });
};

class Manager {
  constructor() {
    this.blockers = new Map();
    this.whitelist = [];
  }

  add(name, content) {
    const blocker = new _Blocker2.default();
    blocker.add(content);
    this.blockers.set(name, blocker);
  }

  addRemote(name, url) {
    return new Promise((resolve, reject) => {
      storage.get(url, info => {
        if (info[url]) {
          this.add(url, info[url].content);
        } else {
          this.add(url, ''); // as a placeholder
        }
        if (!info[url] || Date.now() - info[url].lastFetched > 86400e3) {
          window.fetch(url).then(res => res.text()).then(content => {
            if (!this.blockers.has(url)) return;
            this.add(url, content);
            storage.set({
              [url]: {
                lastFetched: Date.now(),
                content
              }
            });
          }).then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
    });
  }

  delete(name) {
    this.blockers.delete(name);
  }

  *selectors(domain) {
    if (this.isInWhitelist(domain)) return;
    for (const blocker of this.blockers.values()) {
      yield* blocker.selectors(domain);
    }
  }

  match(url, type, documentHost) {
    if (this.isInWhitelist(documentHost)) return;
    let ret = false;
    for (const blocker of this.blockers.values()) {
      const code = blocker.matchStatus(url, type, documentHost);
      if (code === 1) ret = true;
      if (code === -1) return false;
    }
    return ret;
  }

  isInWhitelist(domain) {
    return domain && this.whitelist.some(whitelisted => !(0, _utils.isThirdParty)(domain, whitelisted));
  }
}

const adManager = new Manager();
const refManager = new Manager();
const optionKeys = ['subscriptions', 'additional', 'whitelist', 'referrer'];
storage.set({ version: '1' });
storage.get(optionKeys, options => {
  let needInit = false;
  const initConf = {};
  optionKeys.forEach(key => {
    if (typeof options[key] === 'undefined') {
      needInit = true;
      initConf[key] = config[key];
    } else {
      config[key] = options[key];
    }
  });

  adManager.whitelist = config.whitelist;
  adManager.add('additional', config.additional);
  config.subscriptions.forEach(url => adManager.addRemote(url, url));
  refManager.add('additional', config.referrer);

  if (needInit) {
    storage.set(initConf, () => {
      if (!window.navigator.language.startsWith('zh')) {
        chrome.runtime.openOptionsPage();
      }
    });
  }
});
chrome.storage.onChanged.addListener(changes => {
  if (changes.whitelist) {
    adManager.whitelist = changes.whitelist.newValue;
  }
  if (changes.additional) {
    adManager.add('additional', changes.additional.newValue);
  }
  if (changes.subscriptions) {
    const { oldValue, newValue } = changes.subscriptions;
    newValue.forEach(url => {
      if (oldValue && oldValue.includes(url)) return;
      adManager.addRemote(url, url);
    });
    if (Array.isArray(oldValue)) {
      oldValue.forEach(url => {
        if (changes.subscriptions.newValue.includes(url)) return;
        adManager.delete(url);
      });
    }
  }
  if (changes.referrer) {
    refManager.add('additional', changes.referrer.newValue);
  }
});

setInterval(() => {
  for (const name of adManager.blockers.keys()) {
    if (/^https?:\/\//.test(name)) {
      adManager.addRemote(name, name);
    }
  }
}, 86400e3);

chrome.tabs.onRemoved.addListener(id => Tabs.delete(id));
chrome.webNavigation.onCommitted.addListener(onCommitted);
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, { urls: ['http://*/*', 'https://*/*'] }, ['blocking']);
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, { urls: ['http://*/*', 'https://*/*'] }, ['blocking', 'requestHeaders']);

function onCommitted(details) {
  if (details.frameId) return;
  let domain = (0, _utils.extractDomain)(details.url);
  if (!domain) return;
  insertXstyle(details.tabId, adManager.selectors(domain));
}

function insertXstyle(tabId, xstyle) {
  for (let selectors of xstyle) {
    if (!selectors.length) continue;
    insertCSS(tabId, {
      code: selectors.join(',') + '{display:none!important}',
      runAt: 'document_start'
    });
  }
}

function onBeforeRequest(details) {
  let url = details.url.toLowerCase();
  let tabId = details.tabId;
  let type = details.type;

  if (type === 'main_frame') {
    Tabs.set(tabId, 0, url); // (details.frameId===0) for a main frame
    return;
  }

  let frameId = details.frameId;
  let topUrl = Tabs.get(tabId, 0);
  let documentUrl = Tabs.get(tabId, frameId) || topUrl;
  let documentHost = (0, _utils.extractDomain)(documentUrl);

  if (type === 'sub_frame') {
    type = 'SUBDOCUMENT';
    Tabs.set(tabId, frameId, url);
    documentUrl = Tabs.get(tabId, details.parentFrameId) || topUrl;
    documentHost = (0, _utils.extractDomain)(documentUrl);
  } else {
    type = type.toUpperCase();
  }

  if (!documentHost) return;

  if (adManager.match(url, type, documentHost)) {
    switch (type) {
      case 'IMAGE':
      case 'OBJECT':
      case 'SUBDOCUMENT':
        {
          let prless = url.substr(url.indexOf('//'));
          let selector = `[src="${url}"],[src="${prless}"]`;
          if ((0, _utils.extractDomain)(url) === documentHost) {
            let relSrc = url.substr(url.indexOf('//') + 2);
            relSrc = relSrc.substr(relSrc.indexOf('/'));
            selector += `, [src="${relSrc}"]`;
          }
          insertCSS(tabId, {
            code: selector + '{display: none !important}',
            allFrames: frameId !== 0,
            runAt: 'document_start'
          });
        }
    }
    return {
      redirectUrl: redirectTable[type] || redirectTable.OTHER
    };
  }
}

function onBeforeSendHeaders(details) {
  let url = details.url.toLowerCase();
  let type = details.type;

  if (type === 'main_frame') {
    type = 'DOCUMENT';
  } else if (type === 'sub_frame') {
    type = 'SUBDOCUMENT';
  } else {
    type = type.toUpperCase();
  }

  if (refManager.match(url, type)) {
    for (let i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Referer') {
        details.requestHeaders.splice(i, 1);
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  }
}

},{"../config/local.json":3,"../lib/Blocker":4,"../lib/utils":6,"./helpers":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class CrTabs {
  constructor() {
    this.map = new Map();
    this.fmapPool = [];
  }
  set(tabid, frameid, url) {
    let map = this.map;
    let pool = this.fmapPool;
    if (!map.has(tabid)) {
      map.set(tabid, pool.length ? pool.pop() : new Map());
    }
    map.get(tabid).set(frameid, url);
  }
  get(tabid, frameid) {
    let fmap = this.map.get(tabid);
    if (fmap) {
      return fmap.get(frameid || 0);
    }
  }
  delete(tabid) {
    let map = this.map;
    let fmap = map.get(tabid);
    if (fmap) {
      fmap.clear();
      this.fmapPool.push(fmap);
      map.delete(tabid);
    }
  }
}

exports.CrTabs = CrTabs;

},{}],3:[function(require,module,exports){
module.exports={
  "subscriptions": [
    "https://easylist.to/easylist/easyprivacy.txt",
    "https://easylist.to/easylist/easylist.txt",
    "https://easylist.to/easylist/fanboy-annoyance.txt",
    "https://easylist-downloads.adblockplus.org/antiadblockfilters.txt",
    "https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt"
  ],
  "additional": [
    "youtube.com##.ad-div"
  ],
  "whitelist": [
    "localhost",
    "127.0.0.1"
  ],
  "referrer": [
    "||static.cnbetacdn.com^$document,image"
  ],
  "redirect": {
    "IMAGE": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "OTHER": "about:blank"
  }
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hider = exports.Matcher = undefined;

var _FilterClasses = require('./FilterClasses');

const isWhitelistFilter = _FilterClasses.Filter.isWhitelistFilter;

class Matcher {
  constructor() {
    /**
     * @type {Map.<string, Array.<ActiveFilter>>}
     */
    this.filterByKeyword = new Map();
  }

  /**
   * @param {ActiveFilter} filter
   */
  add(filter) {
    let keyword = this.findKeyword(filter);
    let map = this.filterByKeyword;
    if (map.has(keyword)) {
      // Make sure the white-lists are always at first
      if (isWhitelistFilter(filter)) {
        map.get(keyword).unshift(filter);
      } else {
        map.get(keyword).push(filter);
      }
    } else {
      map.set(keyword, [filter]);
    }
  }

  clear() {
    this.filterByKeyword.clear();
  }

  /**
   * @param {ActiveFilter} filter
   */
  findKeyword(filter) {
    let text = filter.regexpSrc;
    let defaultResult = '';

    if (text.length > 2 && text.startsWith('/') && text.endsWith('/')) {
      return defaultResult;
    }

    let candidates = text.toLowerCase().match(/[^a-z0-9%*][a-z0-9%]{3,}(?=[^a-z0-9%*])/g);
    if (!candidates) {
      return defaultResult;
    }

    let map = this.filterByKeyword;
    let result = defaultResult;
    let resultCount = 0xFFFFFF;
    let resultLength = 0;

    candidates.forEach(function (candidate) {
      candidate = candidate.substr(1);
      let count = 0;
      if (map.has(candidate)) {
        count = map.get(candidate).length;
      }
      if (count < resultCount || count === resultCount && candidate.length > resultLength) {
        result = candidate;
        resultCount = count;
        resultLength = candidate.length;
      }
    });

    return result;
  }

  checkEntryMatch(word, location, contentType, docDomain) {
    let array = this.filterByKeyword.get(word);
    for (let i = 0, l = array.length, filter; i < l; i++) {
      filter = array[i];
      if (filter.matches(location, contentType, docDomain)) {
        return filter;
      }
    }
    return null;
  }

  match(...args) {
    return this.matchStatus(...args) === 1;
  }

  matchStatus(...args) {
    const filter = this.matchFilter(...args);
    if (!filter) return 0;
    if (isWhitelistFilter(filter)) return -1;
    return 1;
  }

  matchFilter(location, contentType, docDomain) {
    let keywords = location.toLowerCase().match(/[a-z0-9%]{3,}/g) || [];
    keywords.unshift('');

    let map = this.filterByKeyword;
    let afterall = null;
    for (let substr, result, i = keywords.length; i--;) {
      substr = keywords[i];
      if (map.has(substr)) {
        result = this.checkEntryMatch(substr, location, contentType, docDomain);
        if (!result) continue;
        if (isWhitelistFilter(result)) return result;else afterall = result;
      }
    }
    return afterall;
  }
}

class Hider {
  constructor() {
    this.hotFilters = [];
    this.generalSelectors = [];
    this.filterSet = new Set();
  }

  add(filter) {
    if (!filter.domains) {
      this.generalSelectors.push(filter.selector);
    } else {
      this.filterSet.add(filter);
    }
  }

  clear() {
    this.hotFilters.length = 0;
    this.filterSet.clear();
  }

  *selectors(domain) {
    const hotSelectors = this._getSelectorsInHotfilters(domain);
    if (hotSelectors.length) {
      yield hotSelectors;
    }

    if (this.generalSelectors.length) {
      yield this.generalSelectors;
    }

    let filter;
    let ret3 = [];
    for (filter of this.filterSet) {
      if (filter.isActiveOnDomain(domain)) {
        this.hotFilters.push(filter);
        this.filterSet.delete(filter);
        ret3.push(filter.selector);
      }
    }
    if (ret3.length) {
      yield ret3;
    }
  }

  _getSelectorsInHotfilters(domain) {
    let ret = [];
    this.hotFilters.forEach(function (filter) {
      if (filter.isActiveOnDomain(domain)) {
        ret.push(filter.selector);
      }
    });
    return ret;
  }
}

class Blocker {
  constructor() {
    const matcher = this.matcher = new Matcher();
    const hider = this.hider = new Hider();
    this.add = this.add.bind(this);
    this.clear = this.clear.bind(this);
    this.match = matcher.match.bind(matcher);
    this.matchStatus = matcher.matchStatus.bind(matcher);
    this.selectors = hider.selectors.bind(hider);
  }

  add(text) {
    if (typeof text === 'string' && /\n|\r/.test(text)) {
      text = text.split(/[\n\r]+/);
    }

    if (Array.isArray(text)) {
      return text.map(item => this.add(item));
    }

    let filterObj = _FilterClasses.Filter.fromText(text);

    if (_FilterClasses.Filter.isRegExpFilter(filterObj)) {
      this.matcher.add(filterObj);
    } else if (_FilterClasses.Filter.isElemHideFilter(filterObj)) {
      this.hider.add(filterObj);
    }
  }

  clear() {
    this.matcher.clear();
    this.hider.clear();
  }
}

exports.default = Blocker;
exports.Matcher = Matcher;
exports.Hider = Hider;

},{"./FilterClasses":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElemHideFilter = exports.WhitelistFilter = exports.BlockingFilter = exports.RegExpFilter = exports.ActiveFilter = exports.Filter = undefined;

var _utils = require('./utils');

const Filter = {
  elemhideRegExp: /^([^/*|@"!]*?)##(.+)$/, // whitelist elementHide filter is not supported
  optionsRegExp: /\$(~?[\w-]+(?:=[^,\s]+)?(?:,~?[\w-]+(?:=[^,\s]+)?)*)$/,

  fromText(text = '') {
    text = text.trim();
    if (!text || text.startsWith('!') || text.includes('#@#')) return;
    if (/^\[Adblock Plus/i.test(text)) return;

    if (text.includes('##') && this.elemhideRegExp.test(text)) {
      let domainStr = RegExp.$1;
      let selectorStr = RegExp.$2;
      return new ElemHideFilter(domainStr.replace(/\s/g, ''), selectorStr.trim());
    } else {
      return RegExpFilter.fromText(text.replace(/\s/g, ''));
    }
  },
  isRegExpFilter(filter) {
    return filter instanceof RegExpFilter;
  },
  isElemHideFilter(filter) {
    return filter instanceof ElemHideFilter;
  },
  isWhitelistFilter(filter) {
    return filter instanceof WhitelistFilter;
  },
  isBlockingFilter(filter) {
    return filter instanceof BlockingFilter;
  }
};

class ActiveFilter {
  constructor(domainSource) {
    this.domains = null;
    this.domainSource = domainSource;
  }
  /* make it possible to lazy-calc `.domains`,
   * cuz most RegExpFilter won't even need it */
  calcDomains() {
    if (this.domainSource) {
      this.domains = new Map();
      let domains = this.domainSource.split(this.domainSeparator);
      if (domains.length === 1 && domains[0][0] !== '~') {
        this.domains.set('', false);
        this.domains.set(domains[0], true);
      } else {
        let hasIncludes = false;
        let i = 0;
        for (let l = domains.length, domain, include; i < l; i++) {
          domain = domains[i];
          if (domain === '') continue;

          if (domain[0] === '~') {
            include = false;
            domain = domain.substr(1);
          } else {
            include = true;
            hasIncludes = true;
          }
          this.domains.set(domain, include);
        }
        this.domains.set('', !hasIncludes);
      }
    }
    this.domainSource = '';
  }
  isActiveOnDomain(docDomain = '') {
    if (this.domainSource) this.calcDomains();
    if (!this.domains) return true;
    docDomain = docDomain.toUpperCase();
    let nextDot;
    do {
      if (this.domains.has(docDomain)) {
        return this.domains.get(docDomain);
      }
      nextDot = docDomain.indexOf('.');
      if (nextDot < 0) break;
      docDomain = docDomain.substr(nextDot + 1);
    } while (true);

    return this.domains.get('');
  }
}

class RegExpFilter extends ActiveFilter {
  constructor(regexpSrc, contentType, domains, thirdParty) {
    super(domains);
    this.regexpSrc = regexpSrc;
    this.regexp = null; // lazy generate from @regexpSrc
    this.contentType = contentType || this.contentType;
    this.thirdParty = thirdParty;
  }
  genRegexp() {
    const regexpSrc = this.regexpSrc;
    if (!regexpSrc) {
      this.regexp = /./;
    } else if (regexpSrc.length > 2 && regexpSrc.startsWith('/') && regexpSrc.endsWith('/')) {
      // The filter is a regular expression - convert it immediately.
      this.regexp = new RegExp(regexpSrc.substr(1, regexpSrc.length - 2));
    } else {
      this.regexp = new RegExp(RegExpFilter.convert(regexpSrc));
    }
  }
  matches(location, contentType, docDomain) {
    if (!this.regexp) this.genRegexp();
    if (typeof contentType === 'string') {
      contentType = contentType.toUpperCase();
    }
    return !!(this.isActiveOnDomain(docDomain) && RegExpFilter.typeMap.get(contentType || 'OTHER') & this.contentType && this.regexp.test(location) && (typeof this.thirdParty === 'undefined' || this.thirdParty === (0, _utils.isThirdParty)((0, _utils.extractDomain)(location), docDomain)));
  }
  /* convert abpexp to regexp */
  static convert(abpexp) {
    return abpexp.replace(/\*+/g, '*').replace(/^\*|\*$/g, '').replace(/\^\|$/, '^').replace(/\W/g, '\\$&').replace(/\\\*/g, '.*').replace(/\\\^/g, '(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x7F]|$)').replace(/^\\\|\\\|/, '^[\\w\\-]+:\\/+(?!\\/)(?:[^.\\/]+\\.)?').replace(/^\\\|/, '^').replace(/\\\|$/, '$');
  }

  static fromText(text) {
    let blocking = true;

    if (text.indexOf('@@') === 0) {
      blocking = false;
      text = text.substr(2);
    }

    let contentType, domains, thirdParty, options;

    if (text.includes('$') && Filter.optionsRegExp.test(text)) {
      options = RegExp.$1.toUpperCase().split(',');
      text = RegExp.leftContext;
      for (let i = options.length, option, value, separatorIndex; i--;) {
        option = options[i];
        value = null;
        separatorIndex = option.indexOf('=');
        if (separatorIndex >= 0) {
          value = option.substr(separatorIndex + 1);
          option = option.substr(0, separatorIndex);
        }
        option = option.replace('-', '_');
        if (RegExpFilter.typeMap.has(option)) {
          contentType = contentType || 0;
          contentType |= RegExpFilter.typeMap.get(option);
        } else if (option[0] === '~' && RegExpFilter.typeMap.has(option.substr(1))) {
          contentType = contentType || RegExpFilter.prototype.contentType;
          contentType &= ~RegExpFilter.typeMap.get(option.substr(1));
        } else if (option === 'DOMAIN' && value) {
          domains = value;
        } else if (option === 'THIRD_PARTY') {
          thirdParty = true;
        } else if (option === '~THIRD_PARTY') {
          thirdParty = false;
        } else {
          return;
        }
      }
    }

    let Constructor = blocking ? BlockingFilter : WhitelistFilter;
    return new Constructor(text, contentType, domains, thirdParty);
  }
}
Object.assign(RegExpFilter.prototype, {
  domainSeparator: '|',
  contentType: (1 << 10) - 1
});
RegExpFilter.typeMap = new Map([['OTHER', 1 << 0], ['SCRIPT', 1 << 1], ['IMAGE', 1 << 2], ['STYLESHEET', 1 << 3], ['OBJECT', 1 << 4], ['OBJECT_SUBREQUEST', 1 << 4], // same as OBJECT
['SUBDOCUMENT', 1 << 5], ['DOCUMENT', 1 << 6], ['XMLHTTPREQUEST', 1 << 7]]);

class BlockingFilter extends RegExpFilter {}
class WhitelistFilter extends RegExpFilter {}

class ElemHideFilter extends ActiveFilter {
  constructor(domains, selector) {
    super(domains ? domains.toUpperCase() : null);
    this.selector = selector;
    this.calcDomains();
  }
}
Object.assign(ElemHideFilter.prototype, {
  domainSeparator: ','
});

exports.Filter = Filter;
exports.ActiveFilter = ActiveFilter;
exports.RegExpFilter = RegExpFilter;
exports.BlockingFilter = BlockingFilter;
exports.WhitelistFilter = WhitelistFilter;
exports.ElemHideFilter = ElemHideFilter;

},{"./utils":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractDomain = exports.isThirdParty = undefined;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string} requestHost
 * @param {string} documentHost
 * @return {boolean}
 * @nosideeffects
 */
function isThirdParty(requestHost, documentHost) {
  if (!/^\d+(\.\d+)*$/.test(documentHost) && /([^.]+\.(?:com|edu|gov|org|net)\.[^.]{2,3}|[^.]+\.[^.]+)$/.test(documentHost)) {
    documentHost = RegExp.$1;
  }
  if (requestHost.length > documentHost.length) {
    return requestHost.substr(requestHost.length - documentHost.length - 1) !== '.' + documentHost;
  } else {
    return requestHost !== documentHost;
  }
}

/**
 * @param {string} url
 * @return {string}
 * @nosideeffects
 */
function extractDomain(str) {
  if (!str) return '';
  const parsed = _url2.default.parse(str);
  if (!/^https?:$/i.test(parsed.protocol)) return '';
  return parsed.hostname;
}

exports.isThirdParty = isThirdParty;
exports.extractDomain = extractDomain;

},{"url":"url"}]},{},[1]);
