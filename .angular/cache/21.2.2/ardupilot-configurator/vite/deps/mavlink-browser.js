import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-KWSTWQNB.js";

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events2 = this._events;
      if (events2 !== void 0)
        doError = doError && events2.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events2[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events2;
      var existing;
      checkListener(listener);
      events2 = target._events;
      if (events2 === void 0) {
        events2 = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events2.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events2 = target._events;
        }
        existing = events2[type];
      }
      if (existing === void 0) {
        existing = events2[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events2, position, i, originalListener;
      checkListener(listener);
      events2 = this._events;
      if (events2 === void 0)
        return this;
      list = events2[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events2[type];
          if (events2.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events2[type] = list[0];
        if (events2.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events2, i;
      events2 = this._events;
      if (events2 === void 0)
        return this;
      if (events2.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events2[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events2[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys2 = Object.keys(events2);
        var key;
        for (i = 0; i < keys2.length; ++i) {
          key = keys2[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events2[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events2 = target._events;
      if (events2 === void 0)
        return [];
      var evlistener = events2[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events2 = this._events;
      if (events2 !== void 0) {
        var evlistener = events2[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret2 = new Array(arr.length);
      for (var i = 0; i < ret2.length; ++i) {
        ret2[i] = arr[i].listener || arr[i];
      }
      return ret2;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject2) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject2(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_3, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/mavlink-browser/mavlink/jspack.js
var DEBUG = false;
function JSPack() {
  var el;
  var booleanIsBigEndian = false;
  var m = this;
  m._DeChar = function(octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz3");
    return String.fromCharCode(octet_array_a[offset_p]);
  };
  m._DeInt = function(octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz5");
    var lsb = booleanIsBigEndian ? el.len - 1 : 0;
    var nsb = booleanIsBigEndian ? -1 : 1;
    var stop = lsb + nsb * el.len;
    var rv;
    var i;
    var f;
    rv = 0;
    i = lsb;
    f = 1;
    for (; i != stop; rv = rv + octet_array_a[offset_p + i] * f, i = i + nsb, f = f * 256) {
    }
    if (el.bSigned && rv & Math.pow(2, el.len * 8 - 1)) {
      rv = rv - Math.pow(2, el.len * 8);
    }
    return rv;
  };
  m._EnInt = function(octet_array_a, offset_p, val) {
    if (DEBUG) console.log("chunk-from: " + val);
    var lsb = booleanIsBigEndian ? el.len - 1 : 0;
    var nsb = booleanIsBigEndian ? -1 : 1;
    var stop = lsb + nsb * el.len;
    var i;
    if (val < el.min) {
      val = el.min;
      console.log("value limited to MIN:" + val);
    }
    if (val > el.max) {
      val = el.max;
      console.log("value limited to MAX:" + val);
    }
    i = lsb;
    if (DEBUG) console.log("booleanIsBigEndian:" + booleanIsBigEndian);
    if (DEBUG) console.log("el.len:" + el.len);
    if (DEBUG) console.log("lsb:" + lsb);
    if (DEBUG) console.log("nsb:" + nsb);
    if (DEBUG) console.log("i:" + i);
    if (DEBUG) console.log("stop:" + stop);
    for (; i != stop; ) {
      var to = JSON.stringify(val & 255);
      if (DEBUG) console.log("chunk as bytes: " + to);
      octet_array_a[offset_p + i] = val & 255;
      i = i + nsb;
      val = val >> 8;
    }
  };
  m._DeString = function(octet_array_a, offset_p, len) {
    if (DEBUG) console.log("zzz7");
    var retval = new Array(len);
    var i = 0;
    for (; i < len; retval[i] = String.fromCharCode(octet_array_a[offset_p + i]), i++) {
    }
    return retval.join("");
  };
  m._EnString = function(octet_array_a, offset_p, len, strval) {
    if (DEBUG) console.log("zzz8");
    var t;
    if (DEBUG) console.log("strencode before: " + octet_array_a + "\np:" + offset_p + " len:" + len + " strval:" + strval);
    var i = 0;
    if (typeof strval.charCodeAt === "function") {
      for (; i < len; octet_array_a[offset_p + i] = (t = strval.charCodeAt(i)) ? t : 0, i++) {
        if (t > 255) console.log("ERROR ERROR ERROR ERROR ERROR ERROR - It seems u passed unicode/utf-8/etc to jspack, not 8 bit ascii. please use .toString('binary'); not .toString();");
      }
      if (DEBUG) console.log("strencode from CHAR-string.");
    } else if (Array.isArray(strval)) {
      for (; i < len; octet_array_a[offset_p + i] = (t = strval[i]) ? t : 0, i++) {
        if (strval[i] > 255) console.log("ERROR ERROR ERROR ERROR ERROR ERROR - It seems u passed unicode/utf-8/etc, or array data with values > 255, to jspack, not 8 bit ascii.\n(bad Array data)" + strval[i]);
      }
      if (DEBUG) console.log("strencode from ARRAY.");
    } else if (Buffer.isBuffer(strval)) {
      for (; i < len; octet_array_a[offset_p + i] = (t = strval[i]) ? t : 0, i++) {
        if (strval[i] > 255) console.log("ERROR ERROR ERROR ERROR ERROR ERROR - It seems u passed unicode/utf-8/etc to jspack, not 8 bit ascii. \n(bad Buffer data)" + strval[i]);
      }
      if (DEBUG) console.log("strencode from Buffer.");
    } else {
      console.log("ERROR encoding string _EnString:  array:" + octet_array_a + " p:" + offset_p + " len:" + len + " strval:" + JSON.stringify(strval));
    }
  };
  m._De754 = function(octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz9");
    var bool_s;
    var exponent;
    var mantissa;
    var i;
    var d;
    var nBits;
    var mantissaLen;
    var exponentLen;
    var eBias;
    var eMax;
    mantissaLen = el.mLen;
    exponentLen = el.len * 8 - el.mLen - 1;
    eMax = (1 << exponentLen) - 1;
    eBias = eMax >> 1;
    i = booleanIsBigEndian ? 0 : el.len - 1;
    d = booleanIsBigEndian ? 1 : -1;
    bool_s = octet_array_a[offset_p + i];
    i = i + d;
    nBits = -7;
    exponent = bool_s & (1 << -nBits) - 1;
    bool_s = bool_s >> -nBits;
    nBits = nBits + exponentLen;
    for (; nBits > 0; exponent = exponent * 256 + octet_array_a[offset_p + i], i = i + d, nBits = nBits - 8) {
    }
    mantissa = exponent & (1 << -nBits) - 1;
    exponent = exponent >> -nBits;
    nBits = nBits + mantissaLen;
    for (; nBits > 0; mantissa = mantissa * 256 + octet_array_a[offset_p + i], i = i + d, nBits = nBits - 8) {
    }
    switch (exponent) {
      case 0:
        exponent = 1 - eBias;
        break;
      case eMax:
        return mantissa ? NaN : (bool_s ? -1 : 1) * Infinity;
      default:
        mantissa = mantissa + Math.pow(2, mantissaLen);
        exponent = exponent - eBias;
        break;
    }
    return (bool_s ? -1 : 1) * mantissa * Math.pow(2, exponent - mantissaLen);
  };
  m._En754 = function(octet_array_a, offset_p, v) {
    if (DEBUG) console.log("zzz_10");
    var bool_s;
    var exponent;
    var mantissa;
    var i;
    var d;
    var c;
    var mantissaLen;
    var exponentLen;
    var eBias;
    var eMax;
    mantissaLen = el.mLen;
    exponentLen = el.len * 8 - el.mLen - 1;
    eMax = (1 << exponentLen) - 1;
    eBias = eMax >> 1;
    bool_s = v < 0 ? 1 : 0;
    v = Math.abs(v);
    if (isNaN(v) || v == Infinity) {
      mantissa = isNaN(v) ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = Math.floor(Math.log(v) / Math.LN2);
      if (v * (c = Math.pow(2, -exponent)) < 1) {
        exponent--;
        c = c * 2;
      }
      if (exponent + eBias >= 1) {
        v = v + el.rt / c;
      } else {
        v = v + el.rt * Math.pow(2, 1 - eBias);
      }
      if (v * c >= 2) {
        exponent++;
        c = c / 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else {
        if (exponent + eBias >= 1) {
          mantissa = (v * c - 1) * Math.pow(2, mantissaLen);
          exponent = exponent + eBias;
        } else {
          mantissa = v * Math.pow(2, eBias - 1) * Math.pow(2, mantissaLen);
          exponent = 0;
        }
      }
    }
    i = booleanIsBigEndian ? el.len - 1 : 0;
    d = booleanIsBigEndian ? -1 : 1;
    for (; mantissaLen >= 8; octet_array_a[offset_p + i] = mantissa & 255, i = i + d, mantissa = mantissa / 256, mantissaLen = mantissaLen - 8) {
    }
    exponent = exponent << mantissaLen | mantissa;
    exponentLen = exponentLen + mantissaLen;
    for (; exponentLen > 0; octet_array_a[offset_p + i] = exponent & 255, i = i + d, exponent = exponent / 256, exponentLen = exponentLen - 8) {
    }
    octet_array_a[offset_p + i - d] |= bool_s * 128;
  };
  m._DeInt64 = function(octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz_11");
    var lsb = booleanIsBigEndian ? 0 : 7;
    var nsb = booleanIsBigEndian ? 1 : -1;
    var stop = lsb + nsb * 8;
    var nextIdLookup = [0, 0, !el.bSigned];
    var i;
    var f;
    var indexLookupKey;
    i = lsb;
    indexLookupKey = 1;
    f = 0;
    for (; i != stop; nextIdLookup[indexLookupKey] = (nextIdLookup[indexLookupKey] << 8 >>> 0) + octet_array_a[offset_p + i], i = i + nsb, f++, indexLookupKey = f < 4 ? 1 : 0) {
      if (DEBUG) console.log("jsPacking int64:" + octet_array_a[offset_p + i]);
    }
    return nextIdLookup;
  };
  m._EnInt64 = function(octet_array_a, offset_p, v) {
    if (v.length != 2) {
      console.log("ERROR ERROR: jspack needs an array of at least length TWO to pack an int64 " + v + " len:" + v.length);
    }
    var lsb = booleanIsBigEndian ? 0 : 7;
    var nsb = booleanIsBigEndian ? 1 : -1;
    var stop = lsb + nsb * 8;
    var i;
    var f;
    var j;
    var shift;
    i = lsb;
    j = 1;
    f = 0;
    shift = 24;
    for (; i != stop; octet_array_a[offset_p + i] = v[j] >> shift & 255, i = i + nsb, f++, j = f < 4 ? 1 : 0, shift = 24 - 8 * (f % 4)) {
      var x = v[j] >> shift & 255;
      var vj = v[j];
      if (DEBUG) console.log("js qqqq  vj:" + vj + " j:" + j + " x:" + x + " a:" + octet_array_a + " i:" + i + " offset_p:" + offset_p + " v:" + v);
    }
  };
  m._sPattern = "(\\d+)?([AxcbBhHsfdiIlLqQ])";
  m._lenLut = { "A": 1, "x": 1, "c": 1, "b": 1, "B": 1, "h": 2, "H": 2, "s": 1, "f": 4, "d": 8, "i": 4, "I": 4, "l": 4, "L": 4, "q": 8, "Q": 8 };
  m._elLookUpTable = {
    "A": { en: m._EnArray, de: m._DeArray },
    "s": { en: m._EnString, de: m._DeString },
    "c": { en: m._EnChar, de: m._DeChar },
    "b": { en: m._EnInt, de: m._DeInt, len: 1, bSigned: true, min: -Math.pow(2, 7), max: Math.pow(2, 7) - 1 },
    "B": { en: m._EnInt, de: m._DeInt, len: 1, bSigned: false, min: 0, max: Math.pow(2, 8) - 1 },
    "h": { en: m._EnInt, de: m._DeInt, len: 2, bSigned: true, min: -Math.pow(2, 15), max: Math.pow(2, 15) - 1 },
    "H": { en: m._EnInt, de: m._DeInt, len: 2, bSigned: false, min: 0, max: Math.pow(2, 16) - 1 },
    "i": { en: m._EnInt, de: m._DeInt, len: 4, bSigned: true, min: -Math.pow(2, 31), max: Math.pow(2, 31) - 1 },
    "I": { en: m._EnInt, de: m._DeInt, len: 4, bSigned: false, min: 0, max: Math.pow(2, 32) - 1 },
    "l": { en: m._EnInt, de: m._DeInt, len: 4, bSigned: true, min: -Math.pow(2, 31), max: Math.pow(2, 31) - 1 },
    "L": { en: m._EnInt, de: m._DeInt, len: 4, bSigned: false, min: 0, max: Math.pow(2, 32) - 1 },
    "f": { en: m._En754, de: m._De754, len: 4, mLen: 23, rt: Math.pow(2, -24) - Math.pow(2, -77) },
    "d": { en: m._En754, de: m._De754, len: 8, mLen: 52, rt: 0 },
    "q": { en: m._EnInt64, de: m._DeInt64, bSigned: true, len: 8 },
    // 64bit fields need 8 bytes..
    "Q": { en: m._EnInt64, de: m._DeInt64, bSigned: false, len: 8 }
  };
  m._UnpackSeries = function(num_elements_n, size_s, octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz_13");
    var fxn = el.de;
    var rv = [];
    var o = 0;
    for (; o < num_elements_n; rv.push(fxn(octet_array_a, offset_p + o * size_s)), o++) {
    }
    return rv;
  };
  m._PackSeries = function(num_elements_n, size_s, to_octet_array_a, array_a_offset_p, from_array_v, array_v_offset_i) {
    if (DEBUG) console.log("pack-series: ");
    if (DEBUG) console.log("js before  0:0 num_elements_n:" + num_elements_n + " size_s:" + size_s + " to_a:" + to_octet_array_a + " i:" + array_v_offset_i + " offset_p:" + array_a_offset_p + " v:" + from_array_v);
    var fxn = el.en;
    var o = 0;
    for (; o < num_elements_n; o++) {
      var z = from_array_v[array_v_offset_i + o];
      var to = JSON.stringify(z);
      var too = JSON.stringify(from_array_v);
      if (DEBUG) console.log("js pre-ffff  z:" + z + " to:" + to + " too:" + too);
      try {
        if (z.length == void 0) {
          if (DEBUG) console.log("Z FIX");
        }
      } catch (e) {
      }
      var z = from_array_v[array_v_offset_i + o];
      var to = JSON.stringify(z);
      var too = JSON.stringify(from_array_v);
      if (num_elements_n == 1 && size_s == 8 && from_array_v.length == 2) {
        z = from_array_v;
        if (DEBUG) console.log("js handling Q 64bit array");
      }
      if (DEBUG) console.log("js partial  z:" + z + " to:" + to + " too:" + too + " num_elements_n:" + num_elements_n + " size_s:" + size_s + " to_a:" + to_octet_array_a + " v_offset_i:" + array_v_offset_i + " a_offset_p:" + array_a_offset_p + " from_v:" + from_array_v);
      fxn(to_octet_array_a, array_a_offset_p + o * size_s, z);
    }
    if (DEBUG) console.log("js after  to_a:" + to_octet_array_a);
  };
  m.Unpack = function(fmt, octet_array_a, offset_p) {
    if (DEBUG) console.log("zzz_15");
    booleanIsBigEndian = fmt.charAt(0) != "<";
    offset_p = offset_p ? offset_p : 0;
    var re = new RegExp(this._sPattern, "g");
    var re_match;
    var repeat_count_n;
    var element_size_s;
    var rv = [];
    for (; re_match = re.exec(fmt); ) {
      repeat_count_n = re_match[1] == void 0 || re_match[1] == "" ? 1 : parseInt(re_match[1]);
      element_size_s = this._lenLut[re_match[2]];
      if (offset_p + repeat_count_n * element_size_s > octet_array_a.length) {
        return void 0;
      }
      switch (re_match[2]) {
        case "A":
        case "s":
          rv.push(this._elLookUpTable[re_match[2]].de(octet_array_a, offset_p, repeat_count_n));
          break;
        case "c":
        case "b":
        case "B":
        case "h":
        case "H":
        case "i":
        case "I":
        case "l":
        case "L":
        case "f":
        case "d":
        case "q":
        case "Q":
          el = this._elLookUpTable[re_match[2]];
          if (repeat_count_n > 1) {
            var arr = [];
            arr.push(this._UnpackSeries(repeat_count_n, element_size_s, octet_array_a, offset_p));
            rv.push(arr);
          } else {
            rv.push(this._UnpackSeries(repeat_count_n, element_size_s, octet_array_a, offset_p));
          }
          break;
      }
      offset_p = offset_p + repeat_count_n * element_size_s;
    }
    return Array.prototype.concat.apply([], rv);
  };
  m.WouldPack = function(fmt, octet_array_a, offset_p, values2) {
    booleanIsBigEndian = fmt.charAt(0) != "<";
    var re = new RegExp(this._sPattern, "g");
    var m2;
    var n;
    var s;
    var values_i = 0;
    var j;
    for (; m2 = re.exec(fmt); ) {
      n = m2[1] == void 0 || m2[1] == "" ? 1 : parseInt(m2[1]);
      s = this._lenLut[m2[2]];
      if (DEBUG) console.log("character: " + m2[2] + "  how many(n)?: " + n);
      el = this._elLookUpTable[m2[2]];
      var bytes_consumed_per_element = el["len"];
      bytes_consumed_per_element = bytes_consumed_per_element == void 0 ? 1 : bytes_consumed_per_element;
      if (DEBUG) console.log("bytes_consumed_per_element:" + JSON.stringify(bytes_consumed_per_element));
      if (DEBUG) console.log("current_values_idx:" + JSON.stringify(values_i) + " values:" + JSON.stringify(values2[values_i]));
      switch (m2[2]) {
        //------------------------------------------
        case "A":
        case "s":
          if (values_i + 1 > values2.length) {
            console.log("JSPACK-ERROR: values_i + 1 > values.length  values_i:" + values_i + " values.length:" + values2.length);
          }
          if (DEBUG) console.log("all values:" + JSON.stringify(values2));
          this._elLookUpTable[m2[2]].en(octet_array_a, offset_p, n, values2[values_i]);
          values_i = values_i + 1;
          break;
        //------------------------------------------
        case "x":
          j = 0;
          for (; j < n; j++) {
            octet_array_a[offset_p + j] = 0;
          }
          break;
        //------------------------------------------
        // everything else
        default:
          if (n > 1) {
            if (Array.isArray(values2[values_i])) {
              if (values_i + 1 > values2.length) {
                if (DEBUG) console.log("JSPACK-ERROR: value series is array but (values_i + 1) > values.length. i:" + values_i + " values.length:" + values2.length);
              }
              if (DEBUG) console.log("(dst IS array) (source IS array)");
              this._PackSeries(n, s, octet_array_a, offset_p, values2[values_i], 0);
              values_i += 1;
            } else {
              if (DEBUG) console.log("ERROR: (dst IS array) (source is not array)");
            }
          }
          if (n == 1) {
            if (Array.isArray(values2[values_i])) {
              if (m2[2] == "Q" || m2[2] == "q") {
                this._PackSeries(n, s, octet_array_a, offset_p, values2[values_i], 0);
                values_i += 1;
              }
              if (DEBUG) console.log("(dst is not array) (source IS array)");
            } else {
              if (values_i + n > values2.length) {
                if (DEBUG) console.log("JSPACK-ERROR: value series NOT array but (values_i + n ) > values.length. i:" + values_i + " n:" + n + " values.length:" + values2.length + " values:" + JSON.stringify(values2));
              }
              if (DEBUG) console.log("(dst is not array)  (source is not array)");
              this._PackSeries(n, s, octet_array_a, offset_p, values2, values_i);
              values_i += n;
            }
          }
          if (DEBUG) console.log("");
          break;
      }
      offset_p = offset_p + n * s;
    }
    if (DEBUG) console.log("wouldpack completed, result array_a is:" + JSON.stringify(octet_array_a));
    return octet_array_a;
  };
  m.Pack = function(fmt, values2) {
    if (DEBUG) console.log("\n\n------------------------------------------------------------------------------------------------------------\n\n");
    if (DEBUG) console.log("initial unpacked values:" + JSON.stringify(values2));
    if (DEBUG) console.log("initial   format string:" + JSON.stringify(fmt));
    if (DEBUG) console.log("\n\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\n\n");
    return this.WouldPack(fmt, new Array(this.CalcLength(fmt)), 0, values2);
  };
  m.oldPack = function(fmt, values2) {
    if (DEBUG) console.log("\n\n------------------------------------------------------------------------------------------------------------\n\n");
    if (DEBUG) console.log("initial unpacked values:" + JSON.stringify(values2));
    if (DEBUG) console.log("initial   format string:" + JSON.stringify(fmt));
    return this.PackTo(fmt, new Array(this.CalcLength(fmt)), 0, values2);
  };
  m.CalcLength = function(fmt) {
    var re = new RegExp(this._sPattern, "g");
    var m2;
    var value = 0;
    for (; m2 = re.exec(fmt); ) {
      value = value + (m2[1] == void 0 || m2[1] == "" ? 1 : parseInt(m2[1])) * this._lenLut[m2[2]];
    }
    if (DEBUG) console.log("number of bytes in format string?: " + value + "\n");
    return value;
  };
}
var jspack = new JSPack();

// node_modules/underscore/modules/index.js
var modules_exports = {};
__export(modules_exports, {
  VERSION: () => VERSION,
  after: () => after,
  all: () => every,
  allKeys: () => allKeys,
  any: () => some,
  assign: () => extendOwn_default,
  before: () => before,
  bind: () => bind_default,
  bindAll: () => bindAll_default,
  chain: () => chain,
  chunk: () => chunk,
  clone: () => clone,
  collect: () => map,
  compact: () => compact,
  compose: () => compose,
  constant: () => constant,
  contains: () => contains,
  countBy: () => countBy_default,
  create: () => create,
  debounce: () => debounce,
  default: () => underscore_array_methods_default,
  defaults: () => defaults_default,
  defer: () => defer_default,
  delay: () => delay_default,
  detect: () => find,
  difference: () => difference_default,
  drop: () => rest,
  each: () => each,
  escape: () => escape_default,
  every: () => every,
  extend: () => extend_default,
  extendOwn: () => extendOwn_default,
  filter: () => filter,
  find: () => find,
  findIndex: () => findIndex_default,
  findKey: () => findKey,
  findLastIndex: () => findLastIndex_default,
  findWhere: () => findWhere,
  first: () => first,
  flatten: () => flatten2,
  foldl: () => reduce_default,
  foldr: () => reduceRight_default,
  forEach: () => each,
  functions: () => functions,
  get: () => get,
  groupBy: () => groupBy_default,
  has: () => has2,
  head: () => first,
  identity: () => identity,
  include: () => contains,
  includes: () => contains,
  indexBy: () => indexBy_default,
  indexOf: () => indexOf_default,
  initial: () => initial,
  inject: () => reduce_default,
  intersection: () => intersection,
  invert: () => invert,
  invoke: () => invoke_default,
  isArguments: () => isArguments_default,
  isArray: () => isArray_default,
  isArrayBuffer: () => isArrayBuffer_default,
  isBoolean: () => isBoolean,
  isDataView: () => isDataView_default,
  isDate: () => isDate_default,
  isElement: () => isElement,
  isEmpty: () => isEmpty,
  isEqual: () => isEqual,
  isError: () => isError_default,
  isFinite: () => isFinite2,
  isFunction: () => isFunction_default,
  isMap: () => isMap_default,
  isMatch: () => isMatch,
  isNaN: () => isNaN2,
  isNull: () => isNull,
  isNumber: () => isNumber_default,
  isObject: () => isObject,
  isRegExp: () => isRegExp_default,
  isSet: () => isSet_default,
  isString: () => isString_default,
  isSymbol: () => isSymbol_default,
  isTypedArray: () => isTypedArray_default,
  isUndefined: () => isUndefined,
  isWeakMap: () => isWeakMap_default,
  isWeakSet: () => isWeakSet_default,
  iteratee: () => iteratee,
  keys: () => keys,
  last: () => last,
  lastIndexOf: () => lastIndexOf_default,
  map: () => map,
  mapObject: () => mapObject,
  matcher: () => matcher,
  matches: () => matcher,
  max: () => max,
  memoize: () => memoize,
  methods: () => functions,
  min: () => min,
  mixin: () => mixin,
  negate: () => negate,
  noop: () => noop,
  now: () => now_default,
  object: () => object,
  omit: () => omit_default,
  once: () => once_default,
  pairs: () => pairs,
  partial: () => partial_default,
  partition: () => partition_default,
  pick: () => pick_default,
  pluck: () => pluck,
  property: () => property,
  propertyOf: () => propertyOf,
  random: () => random,
  range: () => range,
  reduce: () => reduce_default,
  reduceRight: () => reduceRight_default,
  reject: () => reject,
  rest: () => rest,
  restArguments: () => restArguments,
  result: () => result,
  sample: () => sample,
  select: () => filter,
  shuffle: () => shuffle,
  size: () => size,
  some: () => some,
  sortBy: () => sortBy,
  sortedIndex: () => sortedIndex,
  tail: () => rest,
  take: () => first,
  tap: () => tap,
  template: () => template,
  templateSettings: () => templateSettings_default,
  throttle: () => throttle,
  times: () => times,
  toArray: () => toArray,
  toPath: () => toPath,
  transpose: () => unzip,
  unescape: () => unescape_default,
  union: () => union_default,
  uniq: () => uniq,
  unique: () => uniq,
  uniqueId: () => uniqueId,
  unzip: () => unzip,
  values: () => values,
  where: () => where,
  without: () => without_default,
  wrap: () => wrap,
  zip: () => zip_default
});

// node_modules/underscore/modules/_setup.js
var VERSION = "1.13.8";
var root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
var push = ArrayProto.push;
var slice = ArrayProto.slice;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;
var supportsArrayBuffer = typeof ArrayBuffer !== "undefined";
var supportsDataView = typeof DataView !== "undefined";
var nativeIsArray = Array.isArray;
var nativeKeys = Object.keys;
var nativeCreate = Object.create;
var nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
var _isNaN = isNaN;
var _isFinite = isFinite;
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
var nonEnumerableProps = [
  "valueOf",
  "isPrototypeOf",
  "toString",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "toLocaleString"
];
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// node_modules/underscore/modules/restArguments.js
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0), rest2 = Array(length), index = 0;
    for (; index < length; index++) {
      rest2[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest2);
      case 1:
        return func.call(this, arguments[0], rest2);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest2);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest2;
    return func.apply(this, args);
  };
}

// node_modules/underscore/modules/isObject.js
function isObject(obj) {
  var type = typeof obj;
  return type === "function" || type === "object" && !!obj;
}

// node_modules/underscore/modules/isNull.js
function isNull(obj) {
  return obj === null;
}

// node_modules/underscore/modules/isUndefined.js
function isUndefined(obj) {
  return obj === void 0;
}

// node_modules/underscore/modules/isBoolean.js
function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
}

// node_modules/underscore/modules/isElement.js
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// node_modules/underscore/modules/_tagTester.js
function tagTester(name) {
  var tag = "[object " + name + "]";
  return function(obj) {
    return toString.call(obj) === tag;
  };
}

// node_modules/underscore/modules/isString.js
var isString_default = tagTester("String");

// node_modules/underscore/modules/isNumber.js
var isNumber_default = tagTester("Number");

// node_modules/underscore/modules/isDate.js
var isDate_default = tagTester("Date");

// node_modules/underscore/modules/isRegExp.js
var isRegExp_default = tagTester("RegExp");

// node_modules/underscore/modules/isError.js
var isError_default = tagTester("Error");

// node_modules/underscore/modules/isSymbol.js
var isSymbol_default = tagTester("Symbol");

// node_modules/underscore/modules/isArrayBuffer.js
var isArrayBuffer_default = tagTester("ArrayBuffer");

// node_modules/underscore/modules/isFunction.js
var isFunction = tagTester("Function");
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") {
  isFunction = function(obj) {
    return typeof obj == "function" || false;
  };
}
var isFunction_default = isFunction;

// node_modules/underscore/modules/_hasObjectTag.js
var hasObjectTag_default = tagTester("Object");

// node_modules/underscore/modules/_stringTagBug.js
var hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag_default(new DataView(new ArrayBuffer(8))));
var isIE11 = typeof Map !== "undefined" && hasObjectTag_default(/* @__PURE__ */ new Map());

// node_modules/underscore/modules/isDataView.js
var isDataView = tagTester("DataView");
function alternateIsDataView(obj) {
  return obj != null && isFunction_default(obj.getInt8) && isArrayBuffer_default(obj.buffer);
}
var isDataView_default = hasDataViewBug ? alternateIsDataView : isDataView;

// node_modules/underscore/modules/isArray.js
var isArray_default = nativeIsArray || tagTester("Array");

// node_modules/underscore/modules/_has.js
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}

// node_modules/underscore/modules/isArguments.js
var isArguments = tagTester("Arguments");
(function() {
  if (!isArguments(arguments)) {
    isArguments = function(obj) {
      return has(obj, "callee");
    };
  }
})();
var isArguments_default = isArguments;

// node_modules/underscore/modules/isFinite.js
function isFinite2(obj) {
  return !isSymbol_default(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}

// node_modules/underscore/modules/isNaN.js
function isNaN2(obj) {
  return isNumber_default(obj) && _isNaN(obj);
}

// node_modules/underscore/modules/constant.js
function constant(value) {
  return function() {
    return value;
  };
}

// node_modules/underscore/modules/_createSizePropertyCheck.js
function createSizePropertyCheck(getSizeProperty) {
  return function(collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
  };
}

// node_modules/underscore/modules/_shallowProperty.js
function shallowProperty(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}

// node_modules/underscore/modules/_getByteLength.js
var getByteLength_default = shallowProperty("byteLength");

// node_modules/underscore/modules/_isBufferLike.js
var isBufferLike_default = createSizePropertyCheck(getByteLength_default);

// node_modules/underscore/modules/isTypedArray.js
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  return nativeIsView ? nativeIsView(obj) && !isDataView_default(obj) : isBufferLike_default(obj) && typedArrayPattern.test(toString.call(obj));
}
var isTypedArray_default = supportsArrayBuffer ? isTypedArray : constant(false);

// node_modules/underscore/modules/_getLength.js
var getLength_default = shallowProperty("length");

// node_modules/underscore/modules/_collectNonEnumProps.js
function emulatedSet(keys2) {
  var hash = {};
  for (var l = keys2.length, i = 0; i < l; ++i) hash[keys2[i]] = true;
  return {
    contains: function(key) {
      return hash[key] === true;
    },
    push: function(key) {
      hash[key] = true;
      return keys2.push(key);
    }
  };
}
function collectNonEnumProps(obj, keys2) {
  keys2 = emulatedSet(keys2);
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction_default(constructor) && constructor.prototype || ObjProto;
  var prop = "constructor";
  if (has(obj, prop) && !keys2.contains(prop)) keys2.push(prop);
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys2.contains(prop)) {
      keys2.push(prop);
    }
  }
}

// node_modules/underscore/modules/keys.js
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys2 = [];
  for (var key in obj) if (has(obj, key)) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}

// node_modules/underscore/modules/isEmpty.js
function isEmpty(obj) {
  if (obj == null) return true;
  var length = getLength_default(obj);
  if (typeof length == "number" && (isArray_default(obj) || isString_default(obj) || isArguments_default(obj))) return length === 0;
  return getLength_default(keys(obj)) === 0;
}

// node_modules/underscore/modules/isMatch.js
function isMatch(object2, attrs) {
  var _keys = keys(attrs), length = _keys.length;
  if (object2 == null) return !length;
  var obj = Object(object2);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

// node_modules/underscore/modules/underscore.js
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
_.VERSION = VERSION;
_.prototype.value = function() {
  return this._wrapped;
};
_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
_.prototype.toString = function() {
  return String(this._wrapped);
};

// node_modules/underscore/modules/_toBufferView.js
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    getByteLength_default(bufferSource)
  );
}

// node_modules/underscore/modules/isEqual.js
var tagDataView = "[object DataView]";
function isEqual(a, b) {
  var todo = [{ a, b }];
  var aStack = [], bStack = [];
  while (todo.length) {
    var frame = todo.pop();
    if (frame === true) {
      aStack.pop();
      bStack.pop();
      continue;
    }
    a = frame.a;
    b = frame.b;
    if (a === b) {
      if (a !== 0 || 1 / a === 1 / b) continue;
      return false;
    }
    if (a == null || b == null) return false;
    if (a !== a) {
      if (b !== b) continue;
      return false;
    }
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object") return false;
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    if (hasDataViewBug && className == "[object Object]" && isDataView_default(a)) {
      if (!isDataView_default(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case "[object RegExp]":
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case "[object String]":
        if ("" + a === "" + b) continue;
        return false;
      case "[object Number]":
        todo.push({ a: +a, b: +b });
        continue;
      case "[object Date]":
      case "[object Boolean]":
        if (+a === +b) continue;
        return false;
      case "[object Symbol]":
        if (SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b)) continue;
        return false;
      case "[object ArrayBuffer]":
      case tagDataView:
        todo.push({ a: toBufferView(a), b: toBufferView(b) });
        continue;
    }
    var areArrays = className === "[object Array]";
    if (!areArrays && isTypedArray_default(a)) {
      var byteLength2 = getByteLength_default(a);
      if (byteLength2 !== getByteLength_default(b)) return false;
      if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) continue;
      areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != "object" || typeof b != "object") return false;
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction_default(aCtor) && aCtor instanceof aCtor && isFunction_default(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
        return false;
      }
    }
    var length = aStack.length;
    while (length--) {
      if (aStack[length] === a) {
        if (bStack[length] === b) break;
        return false;
      }
    }
    if (length >= 0) continue;
    aStack.push(a);
    bStack.push(b);
    todo.push(true);
    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        todo.push({ a: a[length], b: b[length] });
      }
    } else {
      var _keys = keys(a), key;
      length = _keys.length;
      if (keys(b).length !== length) return false;
      while (length--) {
        key = _keys[length];
        if (!has(b, key)) return false;
        todo.push({ a: a[key], b: b[key] });
      }
    }
  }
  return true;
}

// node_modules/underscore/modules/allKeys.js
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys2 = [];
  for (var key in obj) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}

// node_modules/underscore/modules/_methodFingerprint.js
function ie11fingerprint(methods) {
  var length = getLength_default(methods);
  return function(obj) {
    if (obj == null) return false;
    var keys2 = allKeys(obj);
    if (getLength_default(keys2)) return false;
    for (var i = 0; i < length; i++) {
      if (!isFunction_default(obj[methods[i]])) return false;
    }
    return methods !== weakMapMethods || !isFunction_default(obj[forEachName]);
  };
}
var forEachName = "forEach";
var hasName = "has";
var commonInit = ["clear", "delete"];
var mapTail = ["get", hasName, "set"];
var mapMethods = commonInit.concat(forEachName, mapTail);
var weakMapMethods = commonInit.concat(mapTail);
var setMethods = ["add"].concat(commonInit, forEachName, hasName);

// node_modules/underscore/modules/isMap.js
var isMap_default = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");

// node_modules/underscore/modules/isWeakMap.js
var isWeakMap_default = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");

// node_modules/underscore/modules/isSet.js
var isSet_default = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");

// node_modules/underscore/modules/isWeakSet.js
var isWeakSet_default = tagTester("WeakSet");

// node_modules/underscore/modules/values.js
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values2 = Array(length);
  for (var i = 0; i < length; i++) {
    values2[i] = obj[_keys[i]];
  }
  return values2;
}

// node_modules/underscore/modules/pairs.js
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs2 = Array(length);
  for (var i = 0; i < length; i++) {
    pairs2[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs2;
}

// node_modules/underscore/modules/invert.js
function invert(obj) {
  var result2 = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result2[obj[_keys[i]]] = _keys[i];
  }
  return result2;
}

// node_modules/underscore/modules/functions.js
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction_default(obj[key])) names.push(key);
  }
  return names.sort();
}

// node_modules/underscore/modules/_createAssigner.js
function createAssigner(keysFunc, defaults) {
  return function(obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index], keys2 = keysFunc(source), l = keys2.length;
      for (var i = 0; i < l; i++) {
        var key = keys2[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

// node_modules/underscore/modules/extend.js
var extend_default = createAssigner(allKeys);

// node_modules/underscore/modules/extendOwn.js
var extendOwn_default = createAssigner(keys);

// node_modules/underscore/modules/defaults.js
var defaults_default = createAssigner(allKeys, true);

// node_modules/underscore/modules/_baseCreate.js
function ctor() {
  return function() {
  };
}
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result2 = new Ctor();
  Ctor.prototype = null;
  return result2;
}

// node_modules/underscore/modules/create.js
function create(prototype, props) {
  var result2 = baseCreate(prototype);
  if (props) extendOwn_default(result2, props);
  return result2;
}

// node_modules/underscore/modules/clone.js
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray_default(obj) ? obj.slice() : extend_default({}, obj);
}

// node_modules/underscore/modules/tap.js
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

// node_modules/underscore/modules/toPath.js
function toPath(path) {
  return isArray_default(path) ? path : [path];
}
_.toPath = toPath;

// node_modules/underscore/modules/_toPath.js
function toPath2(path) {
  return _.toPath(path);
}

// node_modules/underscore/modules/_deepGet.js
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}

// node_modules/underscore/modules/get.js
function get(object2, path, defaultValue) {
  var value = deepGet(object2, toPath2(path));
  return isUndefined(value) ? defaultValue : value;
}

// node_modules/underscore/modules/has.js
function has2(obj, path) {
  path = toPath2(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!has(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}

// node_modules/underscore/modules/identity.js
function identity(value) {
  return value;
}

// node_modules/underscore/modules/matcher.js
function matcher(attrs) {
  attrs = extendOwn_default({}, attrs);
  return function(obj) {
    return isMatch(obj, attrs);
  };
}

// node_modules/underscore/modules/property.js
function property(path) {
  path = toPath2(path);
  return function(obj) {
    return deepGet(obj, path);
  };
}

// node_modules/underscore/modules/_optimizeCb.js
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function(value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.
    case 3:
      return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function() {
    return func.apply(context, arguments);
  };
}

// node_modules/underscore/modules/_baseIteratee.js
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction_default(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray_default(value)) return matcher(value);
  return property(value);
}

// node_modules/underscore/modules/iteratee.js
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
_.iteratee = iteratee;

// node_modules/underscore/modules/_cb.js
function cb(value, context, argCount) {
  if (_.iteratee !== iteratee) return _.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}

// node_modules/underscore/modules/mapObject.js
function mapObject(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = keys(obj), length = _keys.length, results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}

// node_modules/underscore/modules/noop.js
function noop() {
}

// node_modules/underscore/modules/propertyOf.js
function propertyOf(obj) {
  if (obj == null) return noop;
  return function(path) {
    return get(obj, path);
  };
}

// node_modules/underscore/modules/times.js
function times(n, iteratee2, context) {
  var accum = Array(Math.max(0, n));
  iteratee2 = optimizeCb(iteratee2, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee2(i);
  return accum;
}

// node_modules/underscore/modules/random.js
function random(min2, max2) {
  if (max2 == null) {
    max2 = min2;
    min2 = 0;
  }
  return min2 + Math.floor(Math.random() * (max2 - min2 + 1));
}

// node_modules/underscore/modules/now.js
var now_default = Date.now || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};

// node_modules/underscore/modules/_createEscaper.js
function createEscaper(map2) {
  var escaper = function(match) {
    return map2[match];
  };
  var source = "(?:" + keys(map2).join("|") + ")";
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, "g");
  return function(string) {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

// node_modules/underscore/modules/_escapeMap.js
var escapeMap_default = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

// node_modules/underscore/modules/escape.js
var escape_default = createEscaper(escapeMap_default);

// node_modules/underscore/modules/_unescapeMap.js
var unescapeMap_default = invert(escapeMap_default);

// node_modules/underscore/modules/unescape.js
var unescape_default = createEscaper(unescapeMap_default);

// node_modules/underscore/modules/templateSettings.js
var templateSettings_default = _.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};

// node_modules/underscore/modules/template.js
var noMatch = /(.)^/;
var escapes = {
  "'": "'",
  "\\": "\\",
  "\r": "r",
  "\n": "n",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
function escapeChar(match) {
  return "\\" + escapes[match];
}
var bareIdentifier = /^\s*(\w|\$)+\s*$/;
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults_default({}, settings, _.templateSettings);
  var matcher2 = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join("|") + "|$", "g");
  var index = 0;
  var source = "__p+='";
  text.replace(matcher2, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;
    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }
    return match;
  });
  source += "';\n";
  var argument = settings.variable;
  if (argument) {
    if (!bareIdentifier.test(argument)) throw new Error(
      "variable is not a bare identifier: " + argument
    );
  } else {
    source = "with(obj||{}){\n" + source + "}\n";
    argument = "obj";
  }
  source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
  var render;
  try {
    render = new Function(argument, "_", source);
  } catch (e) {
    e.source = source;
    throw e;
  }
  var template2 = function(data) {
    return render.call(this, data, _);
  };
  template2.source = "function(" + argument + "){\n" + source + "}";
  return template2;
}

// node_modules/underscore/modules/result.js
function result(obj, path, fallback) {
  path = toPath2(path);
  var length = path.length;
  if (!length) {
    return isFunction_default(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length;
    }
    obj = isFunction_default(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

// node_modules/underscore/modules/uniqueId.js
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + "";
  return prefix ? prefix + id : id;
}

// node_modules/underscore/modules/chain.js
function chain(obj) {
  var instance = _(obj);
  instance._chain = true;
  return instance;
}

// node_modules/underscore/modules/_executeBound.js
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self2 = baseCreate(sourceFunc.prototype);
  var result2 = sourceFunc.apply(self2, args);
  if (isObject(result2)) return result2;
  return self2;
}

// node_modules/underscore/modules/partial.js
var partial = restArguments(function(func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function() {
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});
partial.placeholder = _;
var partial_default = partial;

// node_modules/underscore/modules/bind.js
var bind_default = restArguments(function(func, context, args) {
  if (!isFunction_default(func)) throw new TypeError("Bind must be called on a function");
  var bound = restArguments(function(callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// node_modules/underscore/modules/_isArrayLike.js
var isArrayLike_default = createSizePropertyCheck(getLength_default);

// node_modules/underscore/modules/_flatten.js
function flatten(input, depth, strict) {
  if (!depth && depth !== 0) depth = Infinity;
  var output = [], idx = 0, i = 0, length = getLength_default(input) || 0, stack = [];
  while (true) {
    if (i >= length) {
      if (!stack.length) break;
      var frame = stack.pop();
      i = frame.i;
      input = frame.v;
      length = getLength_default(input);
      continue;
    }
    var value = input[i++];
    if (stack.length >= depth) {
      output[idx++] = value;
    } else if (isArrayLike_default(value) && (isArray_default(value) || isArguments_default(value))) {
      stack.push({ i, v: input });
      i = 0;
      input = value;
      length = getLength_default(input);
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

// node_modules/underscore/modules/bindAll.js
var bindAll_default = restArguments(function(obj, keys2) {
  keys2 = flatten(keys2, false, false);
  var index = keys2.length;
  if (index < 1) throw new Error("bindAll must be passed function names");
  while (index--) {
    var key = keys2[index];
    obj[key] = bind_default(obj[key], obj);
  }
  return obj;
});

// node_modules/underscore/modules/memoize.js
function memoize(func, hasher) {
  var memoize2 = function(key) {
    var cache = memoize2.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    if (!has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize2.cache = {};
  return memoize2;
}

// node_modules/underscore/modules/delay.js
var delay_default = restArguments(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});

// node_modules/underscore/modules/defer.js
var defer_default = partial_default(delay_default, _, 1);

// node_modules/underscore/modules/throttle.js
function throttle(func, wait, options) {
  var timeout, context, args, result2;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : now_default();
    timeout = null;
    result2 = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function() {
    var _now = now_default();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result2 = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result2;
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}

// node_modules/underscore/modules/debounce.js
function debounce(func, wait, immediate) {
  var timeout, previous, args, result2, context;
  var later = function() {
    var passed = now_default() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result2 = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };
  var debounced = restArguments(function(_args) {
    context = this;
    args = _args;
    previous = now_default();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result2 = func.apply(context, args);
    }
    return result2;
  });
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}

// node_modules/underscore/modules/wrap.js
function wrap(func, wrapper) {
  return partial_default(wrapper, func);
}

// node_modules/underscore/modules/negate.js
function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}

// node_modules/underscore/modules/compose.js
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result2 = args[start].apply(this, arguments);
    while (i--) result2 = args[i].call(this, result2);
    return result2;
  };
}

// node_modules/underscore/modules/after.js
function after(times2, func) {
  return function() {
    if (--times2 < 1) {
      return func.apply(this, arguments);
    }
  };
}

// node_modules/underscore/modules/before.js
function before(times2, func) {
  var memo;
  return function() {
    if (--times2 > 0) {
      memo = func.apply(this, arguments);
    }
    if (times2 <= 1) func = null;
    return memo;
  };
}

// node_modules/underscore/modules/once.js
var once_default = partial_default(before, 2);

// node_modules/underscore/modules/findKey.js
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

// node_modules/underscore/modules/_createPredicateIndexFinder.js
function createPredicateIndexFinder(dir) {
  return function(array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength_default(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}

// node_modules/underscore/modules/findIndex.js
var findIndex_default = createPredicateIndexFinder(1);

// node_modules/underscore/modules/findLastIndex.js
var findLastIndex_default = createPredicateIndexFinder(-1);

// node_modules/underscore/modules/sortedIndex.js
function sortedIndex(array, obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context, 1);
  var value = iteratee2(obj);
  var low = 0, high = getLength_default(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee2(array[mid]) < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

// node_modules/underscore/modules/_createIndexFinder.js
function createIndexFinder(dir, predicateFind, sortedIndex2) {
  return function(array, item, idx) {
    var i = 0, length = getLength_default(array);
    if (typeof idx == "number") {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex2 && idx && length) {
      idx = sortedIndex2(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN2);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

// node_modules/underscore/modules/indexOf.js
var indexOf_default = createIndexFinder(1, findIndex_default, sortedIndex);

// node_modules/underscore/modules/lastIndexOf.js
var lastIndexOf_default = createIndexFinder(-1, findLastIndex_default);

// node_modules/underscore/modules/find.js
function find(obj, predicate, context) {
  var keyFinder = isArrayLike_default(obj) ? findIndex_default : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

// node_modules/underscore/modules/findWhere.js
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}

// node_modules/underscore/modules/each.js
function each(obj, iteratee2, context) {
  iteratee2 = optimizeCb(iteratee2, context);
  var i, length;
  if (isArrayLike_default(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee2(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee2(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}

// node_modules/underscore/modules/map.js
function map(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}

// node_modules/underscore/modules/_createReduce.js
function createReduce(dir) {
  var reducer = function(obj, iteratee2, memo, initial2) {
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
    if (!initial2) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee2(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
  return function(obj, iteratee2, memo, context) {
    var initial2 = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee2, context, 4), memo, initial2);
  };
}

// node_modules/underscore/modules/reduce.js
var reduce_default = createReduce(1);

// node_modules/underscore/modules/reduceRight.js
var reduceRight_default = createReduce(-1);

// node_modules/underscore/modules/filter.js
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

// node_modules/underscore/modules/reject.js
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}

// node_modules/underscore/modules/every.js
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}

// node_modules/underscore/modules/some.js
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}

// node_modules/underscore/modules/contains.js
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike_default(obj)) obj = values(obj);
  if (typeof fromIndex != "number" || guard) fromIndex = 0;
  return indexOf_default(obj, item, fromIndex) >= 0;
}

// node_modules/underscore/modules/invoke.js
var invoke_default = restArguments(function(obj, path, args) {
  var contextPath, func;
  if (isFunction_default(path)) {
    func = path;
  } else {
    path = toPath2(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return map(obj, function(context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
});

// node_modules/underscore/modules/pluck.js
function pluck(obj, key) {
  return map(obj, property(key));
}

// node_modules/underscore/modules/where.js
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}

// node_modules/underscore/modules/max.js
function max(obj, iteratee2, context) {
  var result2 = -Infinity, lastComputed = -Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike_default(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function(v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result2 === -Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}

// node_modules/underscore/modules/min.js
function min(obj, iteratee2, context) {
  var result2 = Infinity, lastComputed = Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike_default(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function(v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed < lastComputed || computed === Infinity && result2 === Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}

// node_modules/underscore/modules/toArray.js
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (isArray_default(obj)) return slice.call(obj);
  if (isString_default(obj)) {
    return obj.match(reStrSymbol);
  }
  if (isArrayLike_default(obj)) return map(obj, identity);
  return values(obj);
}

// node_modules/underscore/modules/sample.js
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike_default(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample2 = toArray(obj);
  var length = getLength_default(sample2);
  n = Math.max(Math.min(n, length), 0);
  var last2 = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last2);
    var temp = sample2[index];
    sample2[index] = sample2[rand];
    sample2[rand] = temp;
  }
  return sample2.slice(0, n);
}

// node_modules/underscore/modules/shuffle.js
function shuffle(obj) {
  return sample(obj, Infinity);
}

// node_modules/underscore/modules/sortBy.js
function sortBy(obj, iteratee2, context) {
  var index = 0;
  iteratee2 = cb(iteratee2, context);
  return pluck(map(obj, function(value, key, list) {
    return {
      value,
      index: index++,
      criteria: iteratee2(value, key, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), "value");
}

// node_modules/underscore/modules/_group.js
function group(behavior, partition) {
  return function(obj, iteratee2, context) {
    var result2 = partition ? [[], []] : {};
    iteratee2 = cb(iteratee2, context);
    each(obj, function(value, index) {
      var key = iteratee2(value, index, obj);
      behavior(result2, value, key);
    });
    return result2;
  };
}

// node_modules/underscore/modules/groupBy.js
var groupBy_default = group(function(result2, value, key) {
  if (has(result2, key)) result2[key].push(value);
  else result2[key] = [value];
});

// node_modules/underscore/modules/indexBy.js
var indexBy_default = group(function(result2, value, key) {
  result2[key] = value;
});

// node_modules/underscore/modules/countBy.js
var countBy_default = group(function(result2, value, key) {
  if (has(result2, key)) result2[key]++;
  else result2[key] = 1;
});

// node_modules/underscore/modules/partition.js
var partition_default = group(function(result2, value, pass) {
  result2[pass ? 0 : 1].push(value);
}, true);

// node_modules/underscore/modules/size.js
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike_default(obj) ? obj.length : keys(obj).length;
}

// node_modules/underscore/modules/_keyInObj.js
function keyInObj(value, key, obj) {
  return key in obj;
}

// node_modules/underscore/modules/pick.js
var pick_default = restArguments(function(obj, keys2) {
  var result2 = {}, iteratee2 = keys2[0];
  if (obj == null) return result2;
  if (isFunction_default(iteratee2)) {
    if (keys2.length > 1) iteratee2 = optimizeCb(iteratee2, keys2[1]);
    keys2 = allKeys(obj);
  } else {
    iteratee2 = keyInObj;
    keys2 = flatten(keys2, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys2.length; i < length; i++) {
    var key = keys2[i];
    var value = obj[key];
    if (iteratee2(value, key, obj)) result2[key] = value;
  }
  return result2;
});

// node_modules/underscore/modules/omit.js
var omit_default = restArguments(function(obj, keys2) {
  var iteratee2 = keys2[0], context;
  if (isFunction_default(iteratee2)) {
    iteratee2 = negate(iteratee2);
    if (keys2.length > 1) context = keys2[1];
  } else {
    keys2 = map(flatten(keys2, false, false), String);
    iteratee2 = function(value, key) {
      return !contains(keys2, key);
    };
  }
  return pick_default(obj, iteratee2, context);
});

// node_modules/underscore/modules/initial.js
function initial(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

// node_modules/underscore/modules/first.js
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}

// node_modules/underscore/modules/rest.js
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}

// node_modules/underscore/modules/last.js
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}

// node_modules/underscore/modules/compact.js
function compact(array) {
  return filter(array, Boolean);
}

// node_modules/underscore/modules/flatten.js
function flatten2(array, depth) {
  return flatten(array, depth, false);
}

// node_modules/underscore/modules/difference.js
var difference_default = restArguments(function(array, rest2) {
  rest2 = flatten(rest2, true, true);
  return filter(array, function(value) {
    return !contains(rest2, value);
  });
});

// node_modules/underscore/modules/without.js
var without_default = restArguments(function(array, otherArrays) {
  return difference_default(array, otherArrays);
});

// node_modules/underscore/modules/uniq.js
function uniq(array, isSorted, iteratee2, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee2;
    iteratee2 = isSorted;
    isSorted = false;
  }
  if (iteratee2 != null) iteratee2 = cb(iteratee2, context);
  var result2 = [];
  var seen = [];
  for (var i = 0, length = getLength_default(array); i < length; i++) {
    var value = array[i], computed = iteratee2 ? iteratee2(value, i, array) : value;
    if (isSorted && !iteratee2) {
      if (!i || seen !== computed) result2.push(value);
      seen = computed;
    } else if (iteratee2) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result2.push(value);
      }
    } else if (!contains(result2, value)) {
      result2.push(value);
    }
  }
  return result2;
}

// node_modules/underscore/modules/union.js
var union_default = restArguments(function(arrays) {
  return uniq(flatten(arrays, true, true));
});

// node_modules/underscore/modules/intersection.js
function intersection(array) {
  var result2 = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength_default(array); i < length; i++) {
    var item = array[i];
    if (contains(result2, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result2.push(item);
  }
  return result2;
}

// node_modules/underscore/modules/unzip.js
function unzip(array) {
  var length = array && max(array, getLength_default).length || 0;
  var result2 = Array(length);
  for (var index = 0; index < length; index++) {
    result2[index] = pluck(array, index);
  }
  return result2;
}

// node_modules/underscore/modules/zip.js
var zip_default = restArguments(unzip);

// node_modules/underscore/modules/object.js
function object(list, values2) {
  var result2 = {};
  for (var i = 0, length = getLength_default(list); i < length; i++) {
    if (values2) {
      result2[list[i]] = values2[i];
    } else {
      result2[list[i][0]] = list[i][1];
    }
  }
  return result2;
}

// node_modules/underscore/modules/range.js
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range2 = Array(length);
  for (var idx = 0; idx < length; idx++, start += step) {
    range2[idx] = start;
  }
  return range2;
}

// node_modules/underscore/modules/chunk.js
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result2 = [];
  var i = 0, length = array.length;
  while (i < length) {
    result2.push(slice.call(array, i, i += count));
  }
  return result2;
}

// node_modules/underscore/modules/_chainResult.js
function chainResult(instance, obj) {
  return instance._chain ? _(obj).chain() : obj;
}

// node_modules/underscore/modules/mixin.js
function mixin(obj) {
  each(functions(obj), function(name) {
    var func = _[name] = obj[name];
    _.prototype[name] = function() {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_, args));
    };
  });
  return _;
}

// node_modules/underscore/modules/underscore-array-methods.js
each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
  var method = ArrayProto[name];
  _.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === "shift" || name === "splice") && obj.length === 0) {
        delete obj[0];
      }
    }
    return chainResult(this, obj);
  };
});
each(["concat", "join", "slice"], function(name) {
  var method = ArrayProto[name];
  _.prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return chainResult(this, obj);
  };
});
var underscore_array_methods_default = _;

// node_modules/underscore/modules/index-default.js
var _2 = mixin(modules_exports);
_2._ = _2;
var index_default_default = _2;

// node_modules/mavlink-browser/mavlink/mavlink.js
var import_events = __toESM(require_events());

// node_modules/mavlink-browser/mavlink/process/dist/index.js
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var browser = { exports: {} };
var process = browser.exports = {};
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    if (typeof setTimeout === "function") {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === "function") {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = "";
process.versions = {};
function noop2() {
}
process.on = noop2;
process.addListener = noop2;
process.once = noop2;
process.off = noop2;
process.removeListener = noop2;
process.removeAllListeners = noop2;
process.emit = noop2;
process.prependListener = noop2;
process.prependOnceListener = noop2;
process.listeners = function(name) {
  return [];
};
process.binding = function(name) {
  throw new Error("process.binding is not supported");
};
process.cwd = function() {
  return "/";
};
process.chdir = function(dir) {
  throw new Error("process.chdir is not supported");
};
process.umask = function() {
  return 0;
};
var browserExports = browser.exports;
var process$1 = getDefaultExportFromCjs(browserExports);

// node_modules/mavlink-browser/mavlink/inherits.js
var inherits;
if (typeof Object.create === "function") {
  inherits = function inherits2(ctor2, superCtor) {
    ctor2.super_ = superCtor;
    ctor2.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor2,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits2(ctor2, superCtor) {
    ctor2.super_ = superCtor;
    var TempCtor = function() {
    };
    TempCtor.prototype = superCtor.prototype;
    ctor2.prototype = new TempCtor();
    ctor2.prototype.constructor = ctor2;
  };
}
var inherits_default = inherits;

// node_modules/mavlink-browser/mavlink/util.js
var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(" ");
  }
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x2) {
    if (x2 === "%%") return "%";
    if (i >= len) return x2;
    switch (x2) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_3) {
          return "[Circular]";
        }
      default:
        return x2;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull2(x) || !isObject2(x)) {
      str += " " + x;
    } else {
      str += " " + inspect(x);
    }
  }
  return str;
}
function deprecate(fn, msg) {
  if (isUndefined2(global.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }
  if (process$1.noDeprecation === true) {
    return fn;
  }
  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process$1.throwDeprecation) {
        throw new Error(msg);
      } else if (process$1.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}
var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined2(debugEnviron))
    debugEnviron = process$1.env.NODE_DEBUG || "";
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error("%s %d: %s", set, pid, msg);
      };
    } else {
      debugs[set] = function() {
      };
    }
  }
  return debugs[set];
}
function inspect(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean2(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    _extend(ctx, opts);
  }
  if (isUndefined2(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined2(ctx.depth)) ctx.depth = 2;
  if (isUndefined2(ctx.colors)) ctx.colors = false;
  if (isUndefined2(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
inspect.colors = {
  "bold": [1, 22],
  "italic": [3, 23],
  "underline": [4, 24],
  "inverse": [7, 27],
  "white": [37, 39],
  "grey": [90, 39],
  "black": [30, 39],
  "blue": [34, 39],
  "cyan": [36, 39],
  "green": [32, 39],
  "magenta": [35, 39],
  "red": [31, 39],
  "yellow": [33, 39]
};
inspect.styles = {
  "special": "cyan",
  "number": "yellow",
  "boolean": "yellow",
  "undefined": "grey",
  "null": "bold",
  "string": "green",
  "date": "magenta",
  // "name": intentionally not styling
  "regexp": "red"
};
function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];
  if (style) {
    return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
  } else {
    return str;
  }
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  array.forEach(function(val, idx) {
    hash[val] = true;
  });
  return hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction2(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret2 = value.inspect(recurseTimes, ctx);
    if (!isString(ret2)) {
      ret2 = formatValue(ctx, ret2, recurseTimes);
    }
    return ret2;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  var keys2 = Object.keys(value);
  var visibleKeys = arrayToHash(keys2);
  if (ctx.showHidden) {
    keys2 = Object.getOwnPropertyNames(value);
  }
  if (isError(value) && (keys2.indexOf("message") >= 0 || keys2.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys2.length === 0) {
    if (isFunction2(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (isError(value)) {
      return formatError(value);
    }
  }
  var base = "", array = false, braces = ["{", "}"];
  if (isArray(value)) {
    array = true;
    braces = ["[", "]"];
  }
  if (isFunction2(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys2.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys2);
  } else {
    output = keys2.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined2(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean2(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull2(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys2) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty2(value, String(i))) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        String(i),
        true
      ));
    } else {
      output.push("");
    }
  }
  keys2.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        key,
        true
      ));
    }
  });
  return output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwnProperty2(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull2(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined2(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf("\n") >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60) {
    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
  }
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isBoolean2(arg) {
  return typeof arg === "boolean";
}
function isNull2(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isSymbol(arg) {
  return typeof arg === "symbol";
}
function isUndefined2(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject2(re) && objectToString(re) === "[object RegExp]";
}
function isObject2(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject2(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject2(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction2(arg) {
  return typeof arg === "function";
}
function isPrimitive(arg) {
  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
  typeof arg === "undefined";
}
function isBuffer(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function pad(n) {
  return n < 10 ? "0" + n.toString(10) : n.toString(10);
}
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function timestamp() {
  var d = /* @__PURE__ */ new Date();
  var time = [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(":");
  return [d.getDate(), months[d.getMonth()], time].join(" ");
}
function log() {
  console.log("%s - %s", timestamp(), format.apply(null, arguments));
}
function _extend(origin, add) {
  if (!add || !isObject2(add)) return origin;
  var keys2 = Object.keys(add);
  var i = keys2.length;
  while (i--) {
    origin[keys2[i]] = add[keys2[i]];
  }
  return origin;
}
function hasOwnProperty2(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var util_default = {
  inherits: inherits_default,
  _extend,
  log,
  isBuffer,
  isPrimitive,
  isFunction: isFunction2,
  isError,
  isDate,
  isObject: isObject2,
  isRegExp,
  isUndefined: isUndefined2,
  isSymbol,
  isString,
  isNumber,
  isNullOrUndefined,
  isNull: isNull2,
  isBoolean: isBoolean2,
  isArray,
  inspect,
  deprecate,
  format,
  debuglog
};

// node_modules/mavlink-browser/mavlink/buffer/dist/index.js
var buffer = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
var i;
var len;
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var ieee754 = {};
ieee754.read = function(buffer2, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer2[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
ieee754.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer2[offset + i - d] |= s * 128;
};
(function(exports) {
  const base64 = base64Js;
  const ieee754$1 = ieee754;
  const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer3;
  exports.SlowBuffer = SlowBuffer2;
  exports.INSPECT_MAX_BYTES = 50;
  const K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  const { Uint8Array: GlobalUint8Array, ArrayBuffer: GlobalArrayBuffer, SharedArrayBuffer: GlobalSharedArrayBuffer } = globalThis;
  Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      const arr = new GlobalUint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, GlobalUint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer3.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this)) return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer3.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this)) return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf2 = new GlobalUint8Array(length);
    Object.setPrototypeOf(buf2, Buffer3.prototype);
    return buf2;
  }
  function Buffer3(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer3.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (GlobalArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    if (isInstance(value, GlobalArrayBuffer) || value && isInstance(value.buffer, GlobalArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof GlobalSharedArrayBuffer !== "undefined" && (isInstance(value, GlobalSharedArrayBuffer) || value && isInstance(value.buffer, GlobalSharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer3.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
    );
  }
  Buffer3.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer3.prototype, GlobalUint8Array.prototype);
  Object.setPrototypeOf(Buffer3, GlobalUint8Array);
  function assertSize(size2) {
    if (typeof size2 !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size2 < 0) {
      throw new RangeError('The value "' + size2 + '" is invalid for option "size"');
    }
  }
  function alloc(size2, fill, encoding) {
    assertSize(size2);
    if (size2 <= 0) {
      return createBuffer(size2);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size2).fill(fill, encoding) : createBuffer(size2).fill(fill);
    }
    return createBuffer(size2);
  }
  Buffer3.alloc = function(size2, fill, encoding) {
    return alloc(size2, fill, encoding);
  };
  function allocUnsafe(size2) {
    assertSize(size2);
    return createBuffer(size2 < 0 ? 0 : checked(size2) | 0);
  }
  Buffer3.allocUnsafe = function(size2) {
    return allocUnsafe(size2);
  };
  Buffer3.allocUnsafeSlow = function(size2) {
    return allocUnsafe(size2);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer3.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength2(string, encoding) | 0;
    let buf2 = createBuffer(length);
    const actual = buf2.write(string, encoding);
    if (actual !== length) {
      buf2 = buf2.slice(0, actual);
    }
    return buf2;
  }
  function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf2 = createBuffer(length);
    for (let i = 0; i < length; i += 1) {
      buf2[i] = array[i] & 255;
    }
    return buf2;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, GlobalUint8Array)) {
      const copy = new GlobalUint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf2;
    if (byteOffset === void 0 && length === void 0) {
      buf2 = new GlobalUint8Array(array);
    } else if (length === void 0) {
      buf2 = new GlobalUint8Array(array, byteOffset);
    } else {
      buf2 = new GlobalUint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf2, Buffer3.prototype);
    return buf2;
  }
  function fromObject(obj) {
    if (Buffer3.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf2 = createBuffer(len);
      if (buf2.length === 0) {
        return buf2;
      }
      obj.copy(buf2, 0, 0, len);
      return buf2;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer2(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer3.alloc(+length);
  }
  Buffer3.isBuffer = function isBuffer2(b) {
    return b != null && b._isBuffer === true && b !== Buffer3.prototype;
  };
  Buffer3.compare = function compare(a, b) {
    if (isInstance(a, GlobalUint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
    if (isInstance(b, GlobalUint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
    if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b) return 0;
    let x = a.length;
    let y = b.length;
    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  Buffer3.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer3.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer3.alloc(0);
    }
    let i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer2 = Buffer3.allocUnsafe(length);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
      let buf2 = list[i];
      if (isInstance(buf2, GlobalUint8Array)) {
        if (pos + buf2.length > buffer2.length) {
          if (!Buffer3.isBuffer(buf2)) buf2 = Buffer3.from(buf2);
          buf2.copy(buffer2, pos);
        } else {
          GlobalUint8Array.prototype.set.call(
            buffer2,
            buf2,
            pos
          );
        }
      } else if (!Buffer3.isBuffer(buf2)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf2.copy(buffer2, pos);
      }
      pos += buf2.length;
    }
    return buffer2;
  };
  function byteLength2(string, encoding) {
    if (Buffer3.isBuffer(string)) {
      return string.length;
    }
    if (GlobalArrayBuffer.isView(string) || isInstance(string, GlobalArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
      );
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding) encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.prototype._isBuffer = true;
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer3.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer3.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer3.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer3.prototype.toString = function toString2() {
    const length = this.length;
    if (length === 0) return "";
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
  Buffer3.prototype.equals = function equals(b) {
    if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
    if (this === b) return true;
    return Buffer3.compare(this, b) === 0;
  };
  Buffer3.prototype.inspect = function inspect2() {
    let str = "";
    const max2 = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max2).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max2) str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
  }
  Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, GlobalUint8Array)) {
      target = Buffer3.from(target, target.offset, target.byteLength);
    }
    if (!Buffer3.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0) return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir) return -1;
      else byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1;
    }
    if (typeof val === "string") {
      val = Buffer3.from(val, encoding);
    }
    if (Buffer3.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof GlobalUint8Array.prototype.indexOf === "function") {
        if (dir) {
          return GlobalUint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return GlobalUint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf2, i2) {
      if (indexSize === 1) {
        return buf2[i2];
      } else {
        return buf2.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        let found = true;
        for (let j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found) return i;
      }
    }
    return -1;
  }
  Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf2, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf2.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    const strLen = string.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    let i;
    for (i = 0; i < length; ++i) {
      const parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed)) return i;
      buf2[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf2, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf2.length - offset), buf2, offset, length);
  }
  function asciiWrite(buf2, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf2, offset, length);
  }
  function base64Write(buf2, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf2, offset, length);
  }
  function ucs2Write(buf2, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf2.length - offset), buf2, offset, length);
  }
  Buffer3.prototype.write = function write(string, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0) encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    const remaining = this.length - offset;
    if (length === void 0 || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding) encoding = "utf8";
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer3.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf2, start, end) {
    if (start === 0 && end === buf2.length) {
      return base64.fromByteArray(buf2);
    } else {
      return base64.fromByteArray(buf2.slice(start, end));
    }
  }
  function utf8Slice(buf2, start, end) {
    end = Math.min(buf2.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf2[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf2[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf2[i + 1];
            thirdByte = buf2[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf2[i + 1];
            thirdByte = buf2[i + 2];
            fourthByte = buf2[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  const MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf2, start, end) {
    let ret2 = "";
    end = Math.min(buf2.length, end);
    for (let i = start; i < end; ++i) {
      ret2 += String.fromCharCode(buf2[i] & 127);
    }
    return ret2;
  }
  function latin1Slice(buf2, start, end) {
    let ret2 = "";
    end = Math.min(buf2.length, end);
    for (let i = start; i < end; ++i) {
      ret2 += String.fromCharCode(buf2[i]);
    }
    return ret2;
  }
  function hexSlice(buf2, start, end) {
    const len = buf2.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = "";
    for (let i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf2[i]];
    }
    return out;
  }
  function utf16leSlice(buf2, start, end) {
    const bytes = buf2.slice(start, end);
    let res = "";
    for (let i = 0; i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer3.prototype.slice = function slice2(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start) end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer3.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    let val = this[offset + --byteLength3];
    let mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first2 = this[offset];
    const last2 = this[offset + 7];
    if (first2 === void 0 || last2 === void 0) {
      boundsError(offset, this.length - 8);
    }
    const lo = first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last2 * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  });
  Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first2 = this[offset];
    const last2 = this[offset + 7];
    if (first2 === void 0 || last2 === void 0) {
      boundsError(offset, this.length - 8);
    }
    const hi = first2 * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last2;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
  });
  Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let i = byteLength3;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128)) return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first2 = this[offset];
    const last2 = this[offset + 7];
    if (first2 === void 0 || last2 === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last2 << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first2 = this[offset];
    const last2 = this[offset + 7];
    if (first2 === void 0 || last2 === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = (first2 << 24) + // Overflow
    this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last2);
  });
  Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, true, 23, 4);
  };
  Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, false, 23, 4);
  };
  Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, true, 52, 8);
  };
  Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, false, 52, 8);
  };
  function checkInt(buf2, value, offset, ext, max2, min2) {
    if (!Buffer3.isBuffer(buf2)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max2 || value < min2) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf2.length) throw new RangeError("Index out of range");
  }
  Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function wrtBigUInt64LE(buf2, value, offset, min2, max2) {
    checkIntBI(value, min2, max2, buf2, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf2[offset++] = lo;
    lo = lo >> 8;
    buf2[offset++] = lo;
    lo = lo >> 8;
    buf2[offset++] = lo;
    lo = lo >> 8;
    buf2[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf2[offset++] = hi;
    hi = hi >> 8;
    buf2[offset++] = hi;
    hi = hi >> 8;
    buf2[offset++] = hi;
    hi = hi >> 8;
    buf2[offset++] = hi;
    return offset;
  }
  function wrtBigUInt64BE(buf2, value, offset, min2, max2) {
    checkIntBI(value, min2, max2, buf2, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf2[offset + 7] = lo;
    lo = lo >> 8;
    buf2[offset + 6] = lo;
    lo = lo >> 8;
    buf2[offset + 5] = lo;
    lo = lo >> 8;
    buf2[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf2[offset + 3] = hi;
    hi = hi >> 8;
    buf2[offset + 2] = hi;
    hi = hi >> 8;
    buf2[offset + 1] = hi;
    hi = hi >> 8;
    buf2[offset] = hi;
    return offset + 8;
  }
  Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
    if (value < 0) value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0) value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf2, value, offset, ext, max2, min2) {
    if (offset + ext > buf2.length) throw new RangeError("Index out of range");
    if (offset < 0) throw new RangeError("Index out of range");
  }
  function writeFloat(buf2, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf2, value, offset, 4);
    }
    ieee754$1.write(buf2, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf2, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf2, value, offset, 8);
    }
    ieee754$1.write(buf2, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
    if (end < 0) throw new RangeError("sourceEnd out of bounds");
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof GlobalUint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      GlobalUint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      );
    }
    return len;
  };
  Buffer3.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  const errors = {};
  function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  E(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }
      return "Attempt to access memory outside buffer bounds";
    },
    RangeError
  );
  E(
    "ERR_INVALID_ARG_TYPE",
    function(name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    },
    TypeError
  );
  E(
    "ERR_OUT_OF_RANGE",
    function(str, range2, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      }
      msg += ` It must be ${range2}. Received ${received}`;
      return msg;
    },
    RangeError
  );
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf2, offset, byteLength3) {
    validateNumber(offset, "offset");
    if (buf2[offset] === void 0 || buf2[offset + byteLength3] === void 0) {
      boundsError(offset, buf2.length - (byteLength3 + 1));
    }
  }
  function checkIntBI(value, min2, max2, buf2, offset, byteLength3) {
    if (value > max2 || value < min2) {
      const n = typeof min2 === "bigint" ? "n" : "";
      let range2;
      if (byteLength3 > 3) {
        if (min2 === 0 || min2 === BigInt(0)) {
          range2 = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
        } else {
          range2 = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
        }
      } else {
        range2 = `>= ${min2}${n} and <= ${max2}${n}`;
      }
      throw new errors.ERR_OUT_OF_RANGE("value", range2, value);
    }
    checkBounds(buf2, offset, byteLength3);
  }
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors.ERR_OUT_OF_RANGE(
      type || "offset",
      `>= ${type ? 1 : 0} and <= ${length}`,
      value
    );
  }
  const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2) return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for (let i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1) bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0) break;
        bytes.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0) break;
        bytes.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0) break;
        bytes.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    let i;
    for (i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  const hexSliceLookupTable = (function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0; i < 16; ++i) {
      const i16 = i * 16;
      for (let j = 0; j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }
    return table;
  })();
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
})(buffer);
var Buffer2 = buffer.Buffer;
var Blob = buffer.Blob;
var BlobOptions = buffer.BlobOptions;
var Buffer$1 = buffer.Buffer;
var File = buffer.File;
var FileOptions = buffer.FileOptions;
var INSPECT_MAX_BYTES = buffer.INSPECT_MAX_BYTES;
var SlowBuffer = buffer.SlowBuffer;
var TranscodeEncoding = buffer.TranscodeEncoding;
var atob = buffer.atob;
var btoa = buffer.btoa;
var constants = buffer.constants;
var isAscii = buffer.isAscii;
var isUtf8 = buffer.isUtf8;
var kMaxLength = buffer.kMaxLength;
var kStringMaxLength = buffer.kStringMaxLength;
var resolveObjectURL = buffer.resolveObjectURL;
var transcode = buffer.transcode;

// node_modules/mavlink-browser/mavlink/mavlink.js
Buffer2.prototype.toByteArray = function() {
  return Array.prototype.slice.call(this, 0);
};
var mavlink20 = function() {
};
mavlink20.x25Crc = function(buffer2, crcIN) {
  var bytes = buffer2;
  var crcOUT = crcIN || 65535;
  index_default_default.each(bytes, function(e) {
    var tmp = e ^ crcOUT & 255;
    tmp = (tmp ^ tmp << 4) & 255;
    crcOUT = crcOUT >> 8 ^ tmp << 8 ^ tmp << 3 ^ tmp >> 4;
    crcOUT = crcOUT & 65535;
  });
  return crcOUT;
};
mavlink20.WIRE_PROTOCOL_VERSION = "2.0";
mavlink20.PROTOCOL_MARKER_V1 = 254;
mavlink20.PROTOCOL_MARKER_V2 = 253;
mavlink20.HEADER_LEN_V1 = 6;
mavlink20.HEADER_LEN_V2 = 10;
mavlink20.HEADER_LEN = 10;
mavlink20.MAVLINK_TYPE_CHAR = 0;
mavlink20.MAVLINK_TYPE_UINT8_T = 1;
mavlink20.MAVLINK_TYPE_INT8_T = 2;
mavlink20.MAVLINK_TYPE_UINT16_T = 3;
mavlink20.MAVLINK_TYPE_INT16_T = 4;
mavlink20.MAVLINK_TYPE_UINT32_T = 5;
mavlink20.MAVLINK_TYPE_INT32_T = 6;
mavlink20.MAVLINK_TYPE_UINT64_T = 7;
mavlink20.MAVLINK_TYPE_INT64_T = 8;
mavlink20.MAVLINK_TYPE_FLOAT = 9;
mavlink20.MAVLINK_TYPE_DOUBLE = 10;
mavlink20.MAVLINK_IFLAG_SIGNED = 1;
mavlink20.MAVLINK_SIGNATURE_BLOCK_LEN = 13;
mavlink20.header = function(msgId, mlen, seq, srcSystem, srcComponent, incompat_flags = 0, compat_flags = 0) {
  this.mlen = typeof mlen === "undefined" ? 0 : mlen;
  this.seq = typeof seq === "undefined" ? 0 : seq;
  this.srcSystem = typeof srcSystem === "undefined" ? 0 : srcSystem;
  this.srcComponent = typeof srcComponent === "undefined" ? 0 : srcComponent;
  this.msgId = msgId;
  this.incompat_flags = incompat_flags;
  this.compat_flags = compat_flags;
};
mavlink20.header.prototype.pack = function() {
  return jspack.Pack("BBBBBBBHB", [253, this.mlen, this.incompat_flags, this.compat_flags, this.seq, this.srcSystem, this.srcComponent, (this.msgId & 255) << 8 | this.msgId >> 8 & 255, this.msgId >> 16]);
};
mavlink20.message = function() {
};
mavlink20.message.prototype.set = function(args, verbose) {
  index_default_default.each(this.fieldnames, function(e, i) {
    var num = parseInt(i, 10);
    if (this.hasOwnProperty(e) && isNaN(num)) {
      if (verbose >= 1) {
        console.log("WARNING, overwriting an existing property is DANGEROUS:" + e + " ==>" + i + "==>" + args[i] + " -> " + JSON.stringify(this));
      }
    }
  }, this);
  index_default_default.each(this.fieldnames, function(e, i) {
    this[e] = args[i];
  }, this);
};
mavlink20.message.prototype.sign_packet = function(mav) {
  var crypto = require_crypto();
  var h = crypto.createHash("sha256");
  function shift(number, shift2) {
    return number * Math.pow(2, shift2);
  }
  var thigh = shift(mav.signing.timestamp, -32);
  var tlow = mav.signing.timestamp & 268435455;
  this._msgbuf = this._msgbuf.concat(jspack.Pack("<BIH", [mav.signing.link_id, tlow, thigh]));
  h.update(mav.signing.secret_key);
  h.update(new Buffer2.from(this._msgbuf));
  var hashDigest = h.digest();
  sig = hashDigest.slice(0, 6);
  this._msgbuf = this._msgbuf.concat(...sig);
  mav.signing.timestamp += 1;
};
mavlink20.message.prototype.pack = function(mav, crc_extra, payload) {
  this._payload = payload;
  var plen = this._payload.length;
  while (plen > 1 && (this._payload[plen - 1] == 0 || this._payload[plen - 1] == null)) {
    plen = plen - 1;
  }
  this._payload = this._payload.slice(0, plen);
  var incompat_flags = 0;
  if (mav.signing.sign_outgoing) {
    incompat_flags |= mavlink20.MAVLINK_IFLAG_SIGNED;
  }
  this._header = new mavlink20.header(this._id, this._payload.length, mav.seq, mav.srcSystem, mav.srcComponent, incompat_flags, 0);
  this._msgbuf = this._header.pack().concat(this._payload);
  var crc = mavlink20.x25Crc(this._msgbuf.slice(1));
  crc = mavlink20.x25Crc([crc_extra], crc);
  this._msgbuf = this._msgbuf.concat(jspack.Pack("<H", [crc]));
  this._signed = false;
  this._link_id = void 0;
  if (mav.signing.sign_outgoing) {
    this.sign_packet(mav);
  }
  return this._msgbuf;
};
mavlink20.ACCELCAL_VEHICLE_POS_LEVEL = 1;
mavlink20.ACCELCAL_VEHICLE_POS_LEFT = 2;
mavlink20.ACCELCAL_VEHICLE_POS_RIGHT = 3;
mavlink20.ACCELCAL_VEHICLE_POS_NOSEDOWN = 4;
mavlink20.ACCELCAL_VEHICLE_POS_NOSEUP = 5;
mavlink20.ACCELCAL_VEHICLE_POS_BACK = 6;
mavlink20.ACCELCAL_VEHICLE_POS_SUCCESS = 16777215;
mavlink20.ACCELCAL_VEHICLE_POS_FAILED = 16777216;
mavlink20.ACCELCAL_VEHICLE_POS_ENUM_END = 16777217;
mavlink20.HEADING_TYPE_COURSE_OVER_GROUND = 0;
mavlink20.HEADING_TYPE_HEADING = 1;
mavlink20.HEADING_TYPE_ENUM_END = 2;
mavlink20.MAV_CMD_NAV_WAYPOINT = 16;
mavlink20.MAV_CMD_NAV_LOITER_UNLIM = 17;
mavlink20.MAV_CMD_NAV_LOITER_TURNS = 18;
mavlink20.MAV_CMD_NAV_LOITER_TIME = 19;
mavlink20.MAV_CMD_NAV_RETURN_TO_LAUNCH = 20;
mavlink20.MAV_CMD_NAV_LAND = 21;
mavlink20.MAV_CMD_NAV_TAKEOFF = 22;
mavlink20.MAV_CMD_NAV_LAND_LOCAL = 23;
mavlink20.MAV_CMD_NAV_TAKEOFF_LOCAL = 24;
mavlink20.MAV_CMD_NAV_FOLLOW = 25;
mavlink20.MAV_CMD_NAV_CONTINUE_AND_CHANGE_ALT = 30;
mavlink20.MAV_CMD_NAV_LOITER_TO_ALT = 31;
mavlink20.MAV_CMD_DO_FOLLOW = 32;
mavlink20.MAV_CMD_DO_FOLLOW_REPOSITION = 33;
mavlink20.MAV_CMD_NAV_ROI = 80;
mavlink20.MAV_CMD_NAV_PATHPLANNING = 81;
mavlink20.MAV_CMD_NAV_SPLINE_WAYPOINT = 82;
mavlink20.MAV_CMD_NAV_ALTITUDE_WAIT = 83;
mavlink20.MAV_CMD_NAV_VTOL_TAKEOFF = 84;
mavlink20.MAV_CMD_NAV_VTOL_LAND = 85;
mavlink20.MAV_CMD_NAV_GUIDED_ENABLE = 92;
mavlink20.MAV_CMD_NAV_DELAY = 93;
mavlink20.MAV_CMD_NAV_PAYLOAD_PLACE = 94;
mavlink20.MAV_CMD_NAV_LAST = 95;
mavlink20.MAV_CMD_CONDITION_DELAY = 112;
mavlink20.MAV_CMD_CONDITION_CHANGE_ALT = 113;
mavlink20.MAV_CMD_CONDITION_DISTANCE = 114;
mavlink20.MAV_CMD_CONDITION_YAW = 115;
mavlink20.MAV_CMD_CONDITION_LAST = 159;
mavlink20.MAV_CMD_DO_SET_MODE = 176;
mavlink20.MAV_CMD_DO_JUMP = 177;
mavlink20.MAV_CMD_DO_CHANGE_SPEED = 178;
mavlink20.MAV_CMD_DO_SET_HOME = 179;
mavlink20.MAV_CMD_DO_SET_PARAMETER = 180;
mavlink20.MAV_CMD_DO_SET_RELAY = 181;
mavlink20.MAV_CMD_DO_REPEAT_RELAY = 182;
mavlink20.MAV_CMD_DO_SET_SERVO = 183;
mavlink20.MAV_CMD_DO_REPEAT_SERVO = 184;
mavlink20.MAV_CMD_DO_FLIGHTTERMINATION = 185;
mavlink20.MAV_CMD_DO_CHANGE_ALTITUDE = 186;
mavlink20.MAV_CMD_DO_LAND_START = 189;
mavlink20.MAV_CMD_DO_RALLY_LAND = 190;
mavlink20.MAV_CMD_DO_GO_AROUND = 191;
mavlink20.MAV_CMD_DO_REPOSITION = 192;
mavlink20.MAV_CMD_DO_PAUSE_CONTINUE = 193;
mavlink20.MAV_CMD_DO_SET_REVERSE = 194;
mavlink20.MAV_CMD_DO_SET_ROI_LOCATION = 195;
mavlink20.MAV_CMD_DO_SET_ROI_WPNEXT_OFFSET = 196;
mavlink20.MAV_CMD_DO_SET_ROI_NONE = 197;
mavlink20.MAV_CMD_DO_SET_ROI_SYSID = 198;
mavlink20.MAV_CMD_DO_CONTROL_VIDEO = 200;
mavlink20.MAV_CMD_DO_SET_ROI = 201;
mavlink20.MAV_CMD_DO_DIGICAM_CONFIGURE = 202;
mavlink20.MAV_CMD_DO_DIGICAM_CONTROL = 203;
mavlink20.MAV_CMD_DO_MOUNT_CONFIGURE = 204;
mavlink20.MAV_CMD_DO_MOUNT_CONTROL = 205;
mavlink20.MAV_CMD_DO_SET_CAM_TRIGG_DIST = 206;
mavlink20.MAV_CMD_DO_FENCE_ENABLE = 207;
mavlink20.MAV_CMD_DO_PARACHUTE = 208;
mavlink20.MAV_CMD_DO_MOTOR_TEST = 209;
mavlink20.MAV_CMD_DO_INVERTED_FLIGHT = 210;
mavlink20.MAV_CMD_DO_GRIPPER = 211;
mavlink20.MAV_CMD_DO_AUTOTUNE_ENABLE = 212;
mavlink20.MAV_CMD_NAV_SET_YAW_SPEED = 213;
mavlink20.MAV_CMD_DO_SET_CAM_TRIGG_INTERVAL = 214;
mavlink20.MAV_CMD_DO_SET_RESUME_REPEAT_DIST = 215;
mavlink20.MAV_CMD_DO_SPRAYER = 216;
mavlink20.MAV_CMD_DO_SEND_SCRIPT_MESSAGE = 217;
mavlink20.MAV_CMD_DO_AUX_FUNCTION = 218;
mavlink20.MAV_CMD_DO_MOUNT_CONTROL_QUAT = 220;
mavlink20.MAV_CMD_DO_GUIDED_MASTER = 221;
mavlink20.MAV_CMD_DO_GUIDED_LIMITS = 222;
mavlink20.MAV_CMD_DO_ENGINE_CONTROL = 223;
mavlink20.MAV_CMD_DO_SET_MISSION_CURRENT = 224;
mavlink20.MAV_CMD_DO_LAST = 240;
mavlink20.MAV_CMD_PREFLIGHT_CALIBRATION = 241;
mavlink20.MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS = 242;
mavlink20.MAV_CMD_PREFLIGHT_UAVCAN = 243;
mavlink20.MAV_CMD_PREFLIGHT_STORAGE = 245;
mavlink20.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN = 246;
mavlink20.MAV_CMD_OVERRIDE_GOTO = 252;
mavlink20.MAV_CMD_OBLIQUE_SURVEY = 260;
mavlink20.MAV_CMD_MISSION_START = 300;
mavlink20.MAV_CMD_COMPONENT_ARM_DISARM = 400;
mavlink20.MAV_CMD_RUN_PREARM_CHECKS = 401;
mavlink20.MAV_CMD_GET_HOME_POSITION = 410;
mavlink20.MAV_CMD_START_RX_PAIR = 500;
mavlink20.MAV_CMD_GET_MESSAGE_INTERVAL = 510;
mavlink20.MAV_CMD_SET_MESSAGE_INTERVAL = 511;
mavlink20.MAV_CMD_REQUEST_MESSAGE = 512;
mavlink20.MAV_CMD_REQUEST_PROTOCOL_VERSION = 519;
mavlink20.MAV_CMD_REQUEST_AUTOPILOT_CAPABILITIES = 520;
mavlink20.MAV_CMD_REQUEST_CAMERA_INFORMATION = 521;
mavlink20.MAV_CMD_REQUEST_CAMERA_SETTINGS = 522;
mavlink20.MAV_CMD_REQUEST_STORAGE_INFORMATION = 525;
mavlink20.MAV_CMD_STORAGE_FORMAT = 526;
mavlink20.MAV_CMD_REQUEST_CAMERA_CAPTURE_STATUS = 527;
mavlink20.MAV_CMD_REQUEST_FLIGHT_INFORMATION = 528;
mavlink20.MAV_CMD_RESET_CAMERA_SETTINGS = 529;
mavlink20.MAV_CMD_SET_CAMERA_MODE = 530;
mavlink20.MAV_CMD_SET_CAMERA_ZOOM = 531;
mavlink20.MAV_CMD_SET_CAMERA_FOCUS = 532;
mavlink20.MAV_CMD_SET_STORAGE_USAGE = 533;
mavlink20.MAV_CMD_SET_CAMERA_SOURCE = 534;
mavlink20.MAV_CMD_JUMP_TAG = 600;
mavlink20.MAV_CMD_DO_JUMP_TAG = 601;
mavlink20.MAV_CMD_DO_SET_SYS_CMP_ID = 610;
mavlink20.MAV_CMD_DO_GIMBAL_MANAGER_PITCHYAW = 1e3;
mavlink20.MAV_CMD_DO_GIMBAL_MANAGER_CONFIGURE = 1001;
mavlink20.MAV_CMD_IMAGE_START_CAPTURE = 2e3;
mavlink20.MAV_CMD_IMAGE_STOP_CAPTURE = 2001;
mavlink20.MAV_CMD_DO_TRIGGER_CONTROL = 2003;
mavlink20.MAV_CMD_CAMERA_TRACK_POINT = 2004;
mavlink20.MAV_CMD_CAMERA_TRACK_RECTANGLE = 2005;
mavlink20.MAV_CMD_CAMERA_STOP_TRACKING = 2010;
mavlink20.MAV_CMD_VIDEO_START_CAPTURE = 2500;
mavlink20.MAV_CMD_VIDEO_STOP_CAPTURE = 2501;
mavlink20.MAV_CMD_VIDEO_START_STREAMING = 2502;
mavlink20.MAV_CMD_VIDEO_STOP_STREAMING = 2503;
mavlink20.MAV_CMD_REQUEST_VIDEO_STREAM_INFORMATION = 2504;
mavlink20.MAV_CMD_REQUEST_VIDEO_STREAM_STATUS = 2505;
mavlink20.MAV_CMD_LOGGING_START = 2510;
mavlink20.MAV_CMD_LOGGING_STOP = 2511;
mavlink20.MAV_CMD_AIRFRAME_CONFIGURATION = 2520;
mavlink20.MAV_CMD_CONTROL_HIGH_LATENCY = 2600;
mavlink20.MAV_CMD_PANORAMA_CREATE = 2800;
mavlink20.MAV_CMD_DO_VTOL_TRANSITION = 3e3;
mavlink20.MAV_CMD_ARM_AUTHORIZATION_REQUEST = 3001;
mavlink20.MAV_CMD_SET_GUIDED_SUBMODE_STANDARD = 4e3;
mavlink20.MAV_CMD_SET_GUIDED_SUBMODE_CIRCLE = 4001;
mavlink20.MAV_CMD_NAV_FENCE_RETURN_POINT = 5e3;
mavlink20.MAV_CMD_NAV_FENCE_POLYGON_VERTEX_INCLUSION = 5001;
mavlink20.MAV_CMD_NAV_FENCE_POLYGON_VERTEX_EXCLUSION = 5002;
mavlink20.MAV_CMD_NAV_FENCE_CIRCLE_INCLUSION = 5003;
mavlink20.MAV_CMD_NAV_FENCE_CIRCLE_EXCLUSION = 5004;
mavlink20.MAV_CMD_NAV_RALLY_POINT = 5100;
mavlink20.MAV_CMD_UAVCAN_GET_NODE_INFO = 5200;
mavlink20.MAV_CMD_DO_SET_SAFETY_SWITCH_STATE = 5300;
mavlink20.MAV_CMD_DO_ADSB_OUT_IDENT = 10001;
mavlink20.MAV_CMD_LOWEHEISER_SET_STATE = 10151;
mavlink20.MAV_CMD_PAYLOAD_PREPARE_DEPLOY = 30001;
mavlink20.MAV_CMD_PAYLOAD_CONTROL_DEPLOY = 30002;
mavlink20.MAV_CMD_WAYPOINT_USER_1 = 31e3;
mavlink20.MAV_CMD_WAYPOINT_USER_2 = 31001;
mavlink20.MAV_CMD_WAYPOINT_USER_3 = 31002;
mavlink20.MAV_CMD_WAYPOINT_USER_4 = 31003;
mavlink20.MAV_CMD_WAYPOINT_USER_5 = 31004;
mavlink20.MAV_CMD_SPATIAL_USER_1 = 31005;
mavlink20.MAV_CMD_SPATIAL_USER_2 = 31006;
mavlink20.MAV_CMD_SPATIAL_USER_3 = 31007;
mavlink20.MAV_CMD_SPATIAL_USER_4 = 31008;
mavlink20.MAV_CMD_SPATIAL_USER_5 = 31009;
mavlink20.MAV_CMD_USER_1 = 31010;
mavlink20.MAV_CMD_USER_2 = 31011;
mavlink20.MAV_CMD_USER_3 = 31012;
mavlink20.MAV_CMD_USER_4 = 31013;
mavlink20.MAV_CMD_USER_5 = 31014;
mavlink20.MAV_CMD_CAN_FORWARD = 32e3;
mavlink20.MAV_CMD_RESET_MPPT = 40001;
mavlink20.MAV_CMD_PAYLOAD_CONTROL = 40002;
mavlink20.MAV_CMD_POWER_OFF_INITIATED = 42e3;
mavlink20.MAV_CMD_SOLO_BTN_FLY_CLICK = 42001;
mavlink20.MAV_CMD_SOLO_BTN_FLY_HOLD = 42002;
mavlink20.MAV_CMD_SOLO_BTN_PAUSE_CLICK = 42003;
mavlink20.MAV_CMD_FIXED_MAG_CAL = 42004;
mavlink20.MAV_CMD_FIXED_MAG_CAL_FIELD = 42005;
mavlink20.MAV_CMD_FIXED_MAG_CAL_YAW = 42006;
mavlink20.MAV_CMD_SET_EKF_SOURCE_SET = 42007;
mavlink20.MAV_CMD_DO_START_MAG_CAL = 42424;
mavlink20.MAV_CMD_DO_ACCEPT_MAG_CAL = 42425;
mavlink20.MAV_CMD_DO_CANCEL_MAG_CAL = 42426;
mavlink20.MAV_CMD_SET_FACTORY_TEST_MODE = 42427;
mavlink20.MAV_CMD_DO_SEND_BANNER = 42428;
mavlink20.MAV_CMD_ACCELCAL_VEHICLE_POS = 42429;
mavlink20.MAV_CMD_GIMBAL_RESET = 42501;
mavlink20.MAV_CMD_GIMBAL_AXIS_CALIBRATION_STATUS = 42502;
mavlink20.MAV_CMD_GIMBAL_REQUEST_AXIS_CALIBRATION = 42503;
mavlink20.MAV_CMD_GIMBAL_FULL_RESET = 42505;
mavlink20.MAV_CMD_DO_WINCH = 42600;
mavlink20.MAV_CMD_FLASH_BOOTLOADER = 42650;
mavlink20.MAV_CMD_BATTERY_RESET = 42651;
mavlink20.MAV_CMD_DEBUG_TRAP = 42700;
mavlink20.MAV_CMD_SCRIPTING = 42701;
mavlink20.MAV_CMD_NAV_SCRIPT_TIME = 42702;
mavlink20.MAV_CMD_NAV_ATTITUDE_TIME = 42703;
mavlink20.MAV_CMD_GUIDED_CHANGE_SPEED = 43e3;
mavlink20.MAV_CMD_GUIDED_CHANGE_ALTITUDE = 43001;
mavlink20.MAV_CMD_GUIDED_CHANGE_HEADING = 43002;
mavlink20.MAV_CMD_EXTERNAL_POSITION_ESTIMATE = 43003;
mavlink20.MAV_CMD_STORM32_DO_GIMBAL_MANAGER_CONTROL_PITCHYAW = 60002;
mavlink20.MAV_CMD_STORM32_DO_GIMBAL_MANAGER_SETUP = 60010;
mavlink20.MAV_CMD_STORM32_DO_GIMBAL_ACTION = 60011;
mavlink20.MAV_CMD_QSHOT_DO_CONFIGURE = 60020;
mavlink20.MAV_CMD_PRS_SET_ARM = 60050;
mavlink20.MAV_CMD_PRS_GET_ARM = 60051;
mavlink20.MAV_CMD_PRS_GET_BATTERY = 60052;
mavlink20.MAV_CMD_PRS_GET_ERR = 60053;
mavlink20.MAV_CMD_PRS_SET_ARM_ALTI = 60070;
mavlink20.MAV_CMD_PRS_GET_ARM_ALTI = 60071;
mavlink20.MAV_CMD_PRS_SHUTDOWN = 60072;
mavlink20.MAV_CMD_ENUM_END = 60073;
mavlink20.SCRIPTING_CMD_REPL_START = 0;
mavlink20.SCRIPTING_CMD_REPL_STOP = 1;
mavlink20.SCRIPTING_CMD_STOP = 2;
mavlink20.SCRIPTING_CMD_STOP_AND_RESTART = 3;
mavlink20.SCRIPTING_CMD_ENUM_END = 4;
mavlink20.SECURE_COMMAND_GET_SESSION_KEY = 0;
mavlink20.SECURE_COMMAND_GET_REMOTEID_SESSION_KEY = 1;
mavlink20.SECURE_COMMAND_REMOVE_PUBLIC_KEYS = 2;
mavlink20.SECURE_COMMAND_GET_PUBLIC_KEYS = 3;
mavlink20.SECURE_COMMAND_SET_PUBLIC_KEYS = 4;
mavlink20.SECURE_COMMAND_GET_REMOTEID_CONFIG = 5;
mavlink20.SECURE_COMMAND_SET_REMOTEID_CONFIG = 6;
mavlink20.SECURE_COMMAND_FLASH_BOOTLOADER = 7;
mavlink20.SECURE_COMMAND_OP_ENUM_END = 8;
mavlink20.LIMITS_INIT = 0;
mavlink20.LIMITS_DISABLED = 1;
mavlink20.LIMITS_ENABLED = 2;
mavlink20.LIMITS_TRIGGERED = 3;
mavlink20.LIMITS_RECOVERING = 4;
mavlink20.LIMITS_RECOVERED = 5;
mavlink20.LIMITS_STATE_ENUM_END = 6;
mavlink20.LIMIT_GPSLOCK = 1;
mavlink20.LIMIT_GEOFENCE = 2;
mavlink20.LIMIT_ALTITUDE = 4;
mavlink20.LIMIT_MODULE_ENUM_END = 5;
mavlink20.FAVORABLE_WIND = 1;
mavlink20.LAND_IMMEDIATELY = 2;
mavlink20.ALT_FRAME_VALID = 4;
mavlink20.ALT_FRAME = 24;
mavlink20.RALLY_FLAGS_ENUM_END = 25;
mavlink20.CAMERA_STATUS_TYPE_HEARTBEAT = 0;
mavlink20.CAMERA_STATUS_TYPE_TRIGGER = 1;
mavlink20.CAMERA_STATUS_TYPE_DISCONNECT = 2;
mavlink20.CAMERA_STATUS_TYPE_ERROR = 3;
mavlink20.CAMERA_STATUS_TYPE_LOWBATT = 4;
mavlink20.CAMERA_STATUS_TYPE_LOWSTORE = 5;
mavlink20.CAMERA_STATUS_TYPE_LOWSTOREV = 6;
mavlink20.CAMERA_STATUS_TYPES_ENUM_END = 7;
mavlink20.CAMERA_FEEDBACK_PHOTO = 0;
mavlink20.CAMERA_FEEDBACK_VIDEO = 1;
mavlink20.CAMERA_FEEDBACK_BADEXPOSURE = 2;
mavlink20.CAMERA_FEEDBACK_CLOSEDLOOP = 3;
mavlink20.CAMERA_FEEDBACK_OPENLOOP = 4;
mavlink20.CAMERA_FEEDBACK_FLAGS_ENUM_END = 5;
mavlink20.MAV_MODE_GIMBAL_UNINITIALIZED = 0;
mavlink20.MAV_MODE_GIMBAL_CALIBRATING_PITCH = 1;
mavlink20.MAV_MODE_GIMBAL_CALIBRATING_ROLL = 2;
mavlink20.MAV_MODE_GIMBAL_CALIBRATING_YAW = 3;
mavlink20.MAV_MODE_GIMBAL_INITIALIZED = 4;
mavlink20.MAV_MODE_GIMBAL_ACTIVE = 5;
mavlink20.MAV_MODE_GIMBAL_RATE_CMD_TIMEOUT = 6;
mavlink20.MAV_MODE_GIMBAL_ENUM_END = 7;
mavlink20.GIMBAL_AXIS_YAW = 0;
mavlink20.GIMBAL_AXIS_PITCH = 1;
mavlink20.GIMBAL_AXIS_ROLL = 2;
mavlink20.GIMBAL_AXIS_ENUM_END = 3;
mavlink20.GIMBAL_AXIS_CALIBRATION_STATUS_IN_PROGRESS = 0;
mavlink20.GIMBAL_AXIS_CALIBRATION_STATUS_SUCCEEDED = 1;
mavlink20.GIMBAL_AXIS_CALIBRATION_STATUS_FAILED = 2;
mavlink20.GIMBAL_AXIS_CALIBRATION_STATUS_ENUM_END = 3;
mavlink20.GIMBAL_AXIS_CALIBRATION_REQUIRED_UNKNOWN = 0;
mavlink20.GIMBAL_AXIS_CALIBRATION_REQUIRED_TRUE = 1;
mavlink20.GIMBAL_AXIS_CALIBRATION_REQUIRED_FALSE = 2;
mavlink20.GIMBAL_AXIS_CALIBRATION_REQUIRED_ENUM_END = 3;
mavlink20.GOPRO_HEARTBEAT_STATUS_DISCONNECTED = 0;
mavlink20.GOPRO_HEARTBEAT_STATUS_INCOMPATIBLE = 1;
mavlink20.GOPRO_HEARTBEAT_STATUS_CONNECTED = 2;
mavlink20.GOPRO_HEARTBEAT_STATUS_ERROR = 3;
mavlink20.GOPRO_HEARTBEAT_STATUS_ENUM_END = 4;
mavlink20.GOPRO_FLAG_RECORDING = 1;
mavlink20.GOPRO_HEARTBEAT_FLAGS_ENUM_END = 2;
mavlink20.GOPRO_REQUEST_SUCCESS = 0;
mavlink20.GOPRO_REQUEST_FAILED = 1;
mavlink20.GOPRO_REQUEST_STATUS_ENUM_END = 2;
mavlink20.GOPRO_COMMAND_POWER = 0;
mavlink20.GOPRO_COMMAND_CAPTURE_MODE = 1;
mavlink20.GOPRO_COMMAND_SHUTTER = 2;
mavlink20.GOPRO_COMMAND_BATTERY = 3;
mavlink20.GOPRO_COMMAND_MODEL = 4;
mavlink20.GOPRO_COMMAND_VIDEO_SETTINGS = 5;
mavlink20.GOPRO_COMMAND_LOW_LIGHT = 6;
mavlink20.GOPRO_COMMAND_PHOTO_RESOLUTION = 7;
mavlink20.GOPRO_COMMAND_PHOTO_BURST_RATE = 8;
mavlink20.GOPRO_COMMAND_PROTUNE = 9;
mavlink20.GOPRO_COMMAND_PROTUNE_WHITE_BALANCE = 10;
mavlink20.GOPRO_COMMAND_PROTUNE_COLOUR = 11;
mavlink20.GOPRO_COMMAND_PROTUNE_GAIN = 12;
mavlink20.GOPRO_COMMAND_PROTUNE_SHARPNESS = 13;
mavlink20.GOPRO_COMMAND_PROTUNE_EXPOSURE = 14;
mavlink20.GOPRO_COMMAND_TIME = 15;
mavlink20.GOPRO_COMMAND_CHARGING = 16;
mavlink20.GOPRO_COMMAND_ENUM_END = 17;
mavlink20.GOPRO_CAPTURE_MODE_VIDEO = 0;
mavlink20.GOPRO_CAPTURE_MODE_PHOTO = 1;
mavlink20.GOPRO_CAPTURE_MODE_BURST = 2;
mavlink20.GOPRO_CAPTURE_MODE_TIME_LAPSE = 3;
mavlink20.GOPRO_CAPTURE_MODE_MULTI_SHOT = 4;
mavlink20.GOPRO_CAPTURE_MODE_PLAYBACK = 5;
mavlink20.GOPRO_CAPTURE_MODE_SETUP = 6;
mavlink20.GOPRO_CAPTURE_MODE_UNKNOWN = 255;
mavlink20.GOPRO_CAPTURE_MODE_ENUM_END = 256;
mavlink20.GOPRO_RESOLUTION_480p = 0;
mavlink20.GOPRO_RESOLUTION_720p = 1;
mavlink20.GOPRO_RESOLUTION_960p = 2;
mavlink20.GOPRO_RESOLUTION_1080p = 3;
mavlink20.GOPRO_RESOLUTION_1440p = 4;
mavlink20.GOPRO_RESOLUTION_2_7k_17_9 = 5;
mavlink20.GOPRO_RESOLUTION_2_7k_16_9 = 6;
mavlink20.GOPRO_RESOLUTION_2_7k_4_3 = 7;
mavlink20.GOPRO_RESOLUTION_4k_16_9 = 8;
mavlink20.GOPRO_RESOLUTION_4k_17_9 = 9;
mavlink20.GOPRO_RESOLUTION_720p_SUPERVIEW = 10;
mavlink20.GOPRO_RESOLUTION_1080p_SUPERVIEW = 11;
mavlink20.GOPRO_RESOLUTION_2_7k_SUPERVIEW = 12;
mavlink20.GOPRO_RESOLUTION_4k_SUPERVIEW = 13;
mavlink20.GOPRO_RESOLUTION_ENUM_END = 14;
mavlink20.GOPRO_FRAME_RATE_12 = 0;
mavlink20.GOPRO_FRAME_RATE_15 = 1;
mavlink20.GOPRO_FRAME_RATE_24 = 2;
mavlink20.GOPRO_FRAME_RATE_25 = 3;
mavlink20.GOPRO_FRAME_RATE_30 = 4;
mavlink20.GOPRO_FRAME_RATE_48 = 5;
mavlink20.GOPRO_FRAME_RATE_50 = 6;
mavlink20.GOPRO_FRAME_RATE_60 = 7;
mavlink20.GOPRO_FRAME_RATE_80 = 8;
mavlink20.GOPRO_FRAME_RATE_90 = 9;
mavlink20.GOPRO_FRAME_RATE_100 = 10;
mavlink20.GOPRO_FRAME_RATE_120 = 11;
mavlink20.GOPRO_FRAME_RATE_240 = 12;
mavlink20.GOPRO_FRAME_RATE_12_5 = 13;
mavlink20.GOPRO_FRAME_RATE_ENUM_END = 14;
mavlink20.GOPRO_FIELD_OF_VIEW_WIDE = 0;
mavlink20.GOPRO_FIELD_OF_VIEW_MEDIUM = 1;
mavlink20.GOPRO_FIELD_OF_VIEW_NARROW = 2;
mavlink20.GOPRO_FIELD_OF_VIEW_ENUM_END = 3;
mavlink20.GOPRO_VIDEO_SETTINGS_TV_MODE = 1;
mavlink20.GOPRO_VIDEO_SETTINGS_FLAGS_ENUM_END = 2;
mavlink20.GOPRO_PHOTO_RESOLUTION_5MP_MEDIUM = 0;
mavlink20.GOPRO_PHOTO_RESOLUTION_7MP_MEDIUM = 1;
mavlink20.GOPRO_PHOTO_RESOLUTION_7MP_WIDE = 2;
mavlink20.GOPRO_PHOTO_RESOLUTION_10MP_WIDE = 3;
mavlink20.GOPRO_PHOTO_RESOLUTION_12MP_WIDE = 4;
mavlink20.GOPRO_PHOTO_RESOLUTION_ENUM_END = 5;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_AUTO = 0;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_3000K = 1;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_5500K = 2;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_6500K = 3;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_RAW = 4;
mavlink20.GOPRO_PROTUNE_WHITE_BALANCE_ENUM_END = 5;
mavlink20.GOPRO_PROTUNE_COLOUR_STANDARD = 0;
mavlink20.GOPRO_PROTUNE_COLOUR_NEUTRAL = 1;
mavlink20.GOPRO_PROTUNE_COLOUR_ENUM_END = 2;
mavlink20.GOPRO_PROTUNE_GAIN_400 = 0;
mavlink20.GOPRO_PROTUNE_GAIN_800 = 1;
mavlink20.GOPRO_PROTUNE_GAIN_1600 = 2;
mavlink20.GOPRO_PROTUNE_GAIN_3200 = 3;
mavlink20.GOPRO_PROTUNE_GAIN_6400 = 4;
mavlink20.GOPRO_PROTUNE_GAIN_ENUM_END = 5;
mavlink20.GOPRO_PROTUNE_SHARPNESS_LOW = 0;
mavlink20.GOPRO_PROTUNE_SHARPNESS_MEDIUM = 1;
mavlink20.GOPRO_PROTUNE_SHARPNESS_HIGH = 2;
mavlink20.GOPRO_PROTUNE_SHARPNESS_ENUM_END = 3;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_5_0 = 0;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_4_5 = 1;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_4_0 = 2;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_3_5 = 3;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_3_0 = 4;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_2_5 = 5;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_2_0 = 6;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_1_5 = 7;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_1_0 = 8;
mavlink20.GOPRO_PROTUNE_EXPOSURE_NEG_0_5 = 9;
mavlink20.GOPRO_PROTUNE_EXPOSURE_ZERO = 10;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_0_5 = 11;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_1_0 = 12;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_1_5 = 13;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_2_0 = 14;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_2_5 = 15;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_3_0 = 16;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_3_5 = 17;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_4_0 = 18;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_4_5 = 19;
mavlink20.GOPRO_PROTUNE_EXPOSURE_POS_5_0 = 20;
mavlink20.GOPRO_PROTUNE_EXPOSURE_ENUM_END = 21;
mavlink20.GOPRO_CHARGING_DISABLED = 0;
mavlink20.GOPRO_CHARGING_ENABLED = 1;
mavlink20.GOPRO_CHARGING_ENUM_END = 2;
mavlink20.GOPRO_MODEL_UNKNOWN = 0;
mavlink20.GOPRO_MODEL_HERO_3_PLUS_SILVER = 1;
mavlink20.GOPRO_MODEL_HERO_3_PLUS_BLACK = 2;
mavlink20.GOPRO_MODEL_HERO_4_SILVER = 3;
mavlink20.GOPRO_MODEL_HERO_4_BLACK = 4;
mavlink20.GOPRO_MODEL_ENUM_END = 5;
mavlink20.GOPRO_BURST_RATE_3_IN_1_SECOND = 0;
mavlink20.GOPRO_BURST_RATE_5_IN_1_SECOND = 1;
mavlink20.GOPRO_BURST_RATE_10_IN_1_SECOND = 2;
mavlink20.GOPRO_BURST_RATE_10_IN_2_SECOND = 3;
mavlink20.GOPRO_BURST_RATE_10_IN_3_SECOND = 4;
mavlink20.GOPRO_BURST_RATE_30_IN_1_SECOND = 5;
mavlink20.GOPRO_BURST_RATE_30_IN_2_SECOND = 6;
mavlink20.GOPRO_BURST_RATE_30_IN_3_SECOND = 7;
mavlink20.GOPRO_BURST_RATE_30_IN_6_SECOND = 8;
mavlink20.GOPRO_BURST_RATE_ENUM_END = 9;
mavlink20.MAV_CMD_DO_AUX_FUNCTION_SWITCH_LEVEL_LOW = 0;
mavlink20.MAV_CMD_DO_AUX_FUNCTION_SWITCH_LEVEL_MIDDLE = 1;
mavlink20.MAV_CMD_DO_AUX_FUNCTION_SWITCH_LEVEL_HIGH = 2;
mavlink20.MAV_CMD_DO_AUX_FUNCTION_SWITCH_LEVEL_ENUM_END = 3;
mavlink20.LED_CONTROL_PATTERN_OFF = 0;
mavlink20.LED_CONTROL_PATTERN_FIRMWAREUPDATE = 1;
mavlink20.LED_CONTROL_PATTERN_CUSTOM = 255;
mavlink20.LED_CONTROL_PATTERN_ENUM_END = 256;
mavlink20.EKF_ATTITUDE = 1;
mavlink20.EKF_VELOCITY_HORIZ = 2;
mavlink20.EKF_VELOCITY_VERT = 4;
mavlink20.EKF_POS_HORIZ_REL = 8;
mavlink20.EKF_POS_HORIZ_ABS = 16;
mavlink20.EKF_POS_VERT_ABS = 32;
mavlink20.EKF_POS_VERT_AGL = 64;
mavlink20.EKF_CONST_POS_MODE = 128;
mavlink20.EKF_PRED_POS_HORIZ_REL = 256;
mavlink20.EKF_PRED_POS_HORIZ_ABS = 512;
mavlink20.EKF_UNINITIALIZED = 1024;
mavlink20.EKF_STATUS_FLAGS_ENUM_END = 1025;
mavlink20.PID_TUNING_ROLL = 1;
mavlink20.PID_TUNING_PITCH = 2;
mavlink20.PID_TUNING_YAW = 3;
mavlink20.PID_TUNING_ACCZ = 4;
mavlink20.PID_TUNING_STEER = 5;
mavlink20.PID_TUNING_LANDING = 6;
mavlink20.PID_TUNING_AXIS_ENUM_END = 7;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_STOP = 2147483645;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_START = 2147483646;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_COMMANDS_ENUM_END = 2147483647;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_NACK = 0;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_ACK = 1;
mavlink20.MAV_REMOTE_LOG_DATA_BLOCK_STATUSES_ENUM_END = 2;
mavlink20.DEVICE_OP_BUSTYPE_I2C = 0;
mavlink20.DEVICE_OP_BUSTYPE_SPI = 1;
mavlink20.DEVICE_OP_BUSTYPE_ENUM_END = 2;
mavlink20.DEEPSTALL_STAGE_FLY_TO_LANDING = 0;
mavlink20.DEEPSTALL_STAGE_ESTIMATE_WIND = 1;
mavlink20.DEEPSTALL_STAGE_WAIT_FOR_BREAKOUT = 2;
mavlink20.DEEPSTALL_STAGE_FLY_TO_ARC = 3;
mavlink20.DEEPSTALL_STAGE_ARC = 4;
mavlink20.DEEPSTALL_STAGE_APPROACH = 5;
mavlink20.DEEPSTALL_STAGE_LAND = 6;
mavlink20.DEEPSTALL_STAGE_ENUM_END = 7;
mavlink20.PLANE_MODE_MANUAL = 0;
mavlink20.PLANE_MODE_CIRCLE = 1;
mavlink20.PLANE_MODE_STABILIZE = 2;
mavlink20.PLANE_MODE_TRAINING = 3;
mavlink20.PLANE_MODE_ACRO = 4;
mavlink20.PLANE_MODE_FLY_BY_WIRE_A = 5;
mavlink20.PLANE_MODE_FLY_BY_WIRE_B = 6;
mavlink20.PLANE_MODE_CRUISE = 7;
mavlink20.PLANE_MODE_AUTOTUNE = 8;
mavlink20.PLANE_MODE_AUTO = 10;
mavlink20.PLANE_MODE_RTL = 11;
mavlink20.PLANE_MODE_LOITER = 12;
mavlink20.PLANE_MODE_TAKEOFF = 13;
mavlink20.PLANE_MODE_AVOID_ADSB = 14;
mavlink20.PLANE_MODE_GUIDED = 15;
mavlink20.PLANE_MODE_INITIALIZING = 16;
mavlink20.PLANE_MODE_QSTABILIZE = 17;
mavlink20.PLANE_MODE_QHOVER = 18;
mavlink20.PLANE_MODE_QLOITER = 19;
mavlink20.PLANE_MODE_QLAND = 20;
mavlink20.PLANE_MODE_QRTL = 21;
mavlink20.PLANE_MODE_QAUTOTUNE = 22;
mavlink20.PLANE_MODE_QACRO = 23;
mavlink20.PLANE_MODE_THERMAL = 24;
mavlink20.PLANE_MODE_ENUM_END = 25;
mavlink20.COPTER_MODE_STABILIZE = 0;
mavlink20.COPTER_MODE_ACRO = 1;
mavlink20.COPTER_MODE_ALT_HOLD = 2;
mavlink20.COPTER_MODE_AUTO = 3;
mavlink20.COPTER_MODE_GUIDED = 4;
mavlink20.COPTER_MODE_LOITER = 5;
mavlink20.COPTER_MODE_RTL = 6;
mavlink20.COPTER_MODE_CIRCLE = 7;
mavlink20.COPTER_MODE_LAND = 9;
mavlink20.COPTER_MODE_DRIFT = 11;
mavlink20.COPTER_MODE_SPORT = 13;
mavlink20.COPTER_MODE_FLIP = 14;
mavlink20.COPTER_MODE_AUTOTUNE = 15;
mavlink20.COPTER_MODE_POSHOLD = 16;
mavlink20.COPTER_MODE_BRAKE = 17;
mavlink20.COPTER_MODE_THROW = 18;
mavlink20.COPTER_MODE_AVOID_ADSB = 19;
mavlink20.COPTER_MODE_GUIDED_NOGPS = 20;
mavlink20.COPTER_MODE_SMART_RTL = 21;
mavlink20.COPTER_MODE_FLOWHOLD = 22;
mavlink20.COPTER_MODE_FOLLOW = 23;
mavlink20.COPTER_MODE_ZIGZAG = 24;
mavlink20.COPTER_MODE_SYSTEMID = 25;
mavlink20.COPTER_MODE_AUTOROTATE = 26;
mavlink20.COPTER_MODE_AUTO_RTL = 27;
mavlink20.COPTER_MODE_ENUM_END = 28;
mavlink20.SUB_MODE_STABILIZE = 0;
mavlink20.SUB_MODE_ACRO = 1;
mavlink20.SUB_MODE_ALT_HOLD = 2;
mavlink20.SUB_MODE_AUTO = 3;
mavlink20.SUB_MODE_GUIDED = 4;
mavlink20.SUB_MODE_CIRCLE = 7;
mavlink20.SUB_MODE_SURFACE = 9;
mavlink20.SUB_MODE_POSHOLD = 16;
mavlink20.SUB_MODE_MANUAL = 19;
mavlink20.SUB_MODE_ENUM_END = 20;
mavlink20.ROVER_MODE_MANUAL = 0;
mavlink20.ROVER_MODE_ACRO = 1;
mavlink20.ROVER_MODE_STEERING = 3;
mavlink20.ROVER_MODE_HOLD = 4;
mavlink20.ROVER_MODE_LOITER = 5;
mavlink20.ROVER_MODE_FOLLOW = 6;
mavlink20.ROVER_MODE_SIMPLE = 7;
mavlink20.ROVER_MODE_AUTO = 10;
mavlink20.ROVER_MODE_RTL = 11;
mavlink20.ROVER_MODE_SMART_RTL = 12;
mavlink20.ROVER_MODE_GUIDED = 15;
mavlink20.ROVER_MODE_INITIALIZING = 16;
mavlink20.ROVER_MODE_ENUM_END = 17;
mavlink20.TRACKER_MODE_MANUAL = 0;
mavlink20.TRACKER_MODE_STOP = 1;
mavlink20.TRACKER_MODE_SCAN = 2;
mavlink20.TRACKER_MODE_SERVO_TEST = 3;
mavlink20.TRACKER_MODE_AUTO = 10;
mavlink20.TRACKER_MODE_INITIALIZING = 16;
mavlink20.TRACKER_MODE_ENUM_END = 17;
mavlink20.OSD_PARAM_NONE = 0;
mavlink20.OSD_PARAM_SERIAL_PROTOCOL = 1;
mavlink20.OSD_PARAM_SERVO_FUNCTION = 2;
mavlink20.OSD_PARAM_AUX_FUNCTION = 3;
mavlink20.OSD_PARAM_FLIGHT_MODE = 4;
mavlink20.OSD_PARAM_FAILSAFE_ACTION = 5;
mavlink20.OSD_PARAM_FAILSAFE_ACTION_1 = 6;
mavlink20.OSD_PARAM_FAILSAFE_ACTION_2 = 7;
mavlink20.OSD_PARAM_NUM_TYPES = 8;
mavlink20.OSD_PARAM_CONFIG_TYPE_ENUM_END = 9;
mavlink20.OSD_PARAM_SUCCESS = 0;
mavlink20.OSD_PARAM_INVALID_SCREEN = 1;
mavlink20.OSD_PARAM_INVALID_PARAMETER_INDEX = 2;
mavlink20.OSD_PARAM_INVALID_PARAMETER = 3;
mavlink20.OSD_PARAM_CONFIG_ERROR_ENUM_END = 4;
mavlink20.GSM_LINK_TYPE_NONE = 0;
mavlink20.GSM_LINK_TYPE_UNKNOWN = 1;
mavlink20.GSM_LINK_TYPE_2G = 2;
mavlink20.GSM_LINK_TYPE_3G = 3;
mavlink20.GSM_LINK_TYPE_4G = 4;
mavlink20.GSM_LINK_TYPE_ENUM_END = 5;
mavlink20.GSM_MODEM_TYPE_UNKNOWN = 0;
mavlink20.GSM_MODEM_TYPE_HUAWEI_E3372 = 1;
mavlink20.GSM_MODEM_TYPE_ENUM_END = 2;
mavlink20.FIRMWARE_VERSION_TYPE_DEV = 0;
mavlink20.FIRMWARE_VERSION_TYPE_ALPHA = 64;
mavlink20.FIRMWARE_VERSION_TYPE_BETA = 128;
mavlink20.FIRMWARE_VERSION_TYPE_RC = 192;
mavlink20.FIRMWARE_VERSION_TYPE_OFFICIAL = 255;
mavlink20.FIRMWARE_VERSION_TYPE_ENUM_END = 256;
mavlink20.HL_FAILURE_FLAG_GPS = 1;
mavlink20.HL_FAILURE_FLAG_DIFFERENTIAL_PRESSURE = 2;
mavlink20.HL_FAILURE_FLAG_ABSOLUTE_PRESSURE = 4;
mavlink20.HL_FAILURE_FLAG_3D_ACCEL = 8;
mavlink20.HL_FAILURE_FLAG_3D_GYRO = 16;
mavlink20.HL_FAILURE_FLAG_3D_MAG = 32;
mavlink20.HL_FAILURE_FLAG_TERRAIN = 64;
mavlink20.HL_FAILURE_FLAG_BATTERY = 128;
mavlink20.HL_FAILURE_FLAG_RC_RECEIVER = 256;
mavlink20.HL_FAILURE_FLAG_OFFBOARD_LINK = 512;
mavlink20.HL_FAILURE_FLAG_ENGINE = 1024;
mavlink20.HL_FAILURE_FLAG_GEOFENCE = 2048;
mavlink20.HL_FAILURE_FLAG_ESTIMATOR = 4096;
mavlink20.HL_FAILURE_FLAG_MISSION = 8192;
mavlink20.HL_FAILURE_FLAG_ENUM_END = 8193;
mavlink20.MAV_GOTO_DO_HOLD = 0;
mavlink20.MAV_GOTO_DO_CONTINUE = 1;
mavlink20.MAV_GOTO_HOLD_AT_CURRENT_POSITION = 2;
mavlink20.MAV_GOTO_HOLD_AT_SPECIFIED_POSITION = 3;
mavlink20.MAV_GOTO_ENUM_END = 4;
mavlink20.MAV_MODE_PREFLIGHT = 0;
mavlink20.MAV_MODE_MANUAL_DISARMED = 64;
mavlink20.MAV_MODE_TEST_DISARMED = 66;
mavlink20.MAV_MODE_STABILIZE_DISARMED = 80;
mavlink20.MAV_MODE_GUIDED_DISARMED = 88;
mavlink20.MAV_MODE_AUTO_DISARMED = 92;
mavlink20.MAV_MODE_MANUAL_ARMED = 192;
mavlink20.MAV_MODE_TEST_ARMED = 194;
mavlink20.MAV_MODE_STABILIZE_ARMED = 208;
mavlink20.MAV_MODE_GUIDED_ARMED = 216;
mavlink20.MAV_MODE_AUTO_ARMED = 220;
mavlink20.MAV_MODE_ENUM_END = 221;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_GYRO = 1;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_ACCEL = 2;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_MAG = 4;
mavlink20.MAV_SYS_STATUS_SENSOR_ABSOLUTE_PRESSURE = 8;
mavlink20.MAV_SYS_STATUS_SENSOR_DIFFERENTIAL_PRESSURE = 16;
mavlink20.MAV_SYS_STATUS_SENSOR_GPS = 32;
mavlink20.MAV_SYS_STATUS_SENSOR_OPTICAL_FLOW = 64;
mavlink20.MAV_SYS_STATUS_SENSOR_VISION_POSITION = 128;
mavlink20.MAV_SYS_STATUS_SENSOR_LASER_POSITION = 256;
mavlink20.MAV_SYS_STATUS_SENSOR_EXTERNAL_GROUND_TRUTH = 512;
mavlink20.MAV_SYS_STATUS_SENSOR_ANGULAR_RATE_CONTROL = 1024;
mavlink20.MAV_SYS_STATUS_SENSOR_ATTITUDE_STABILIZATION = 2048;
mavlink20.MAV_SYS_STATUS_SENSOR_YAW_POSITION = 4096;
mavlink20.MAV_SYS_STATUS_SENSOR_Z_ALTITUDE_CONTROL = 8192;
mavlink20.MAV_SYS_STATUS_SENSOR_XY_POSITION_CONTROL = 16384;
mavlink20.MAV_SYS_STATUS_SENSOR_MOTOR_OUTPUTS = 32768;
mavlink20.MAV_SYS_STATUS_SENSOR_RC_RECEIVER = 65536;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_GYRO2 = 131072;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_ACCEL2 = 262144;
mavlink20.MAV_SYS_STATUS_SENSOR_3D_MAG2 = 524288;
mavlink20.MAV_SYS_STATUS_GEOFENCE = 1048576;
mavlink20.MAV_SYS_STATUS_AHRS = 2097152;
mavlink20.MAV_SYS_STATUS_TERRAIN = 4194304;
mavlink20.MAV_SYS_STATUS_REVERSE_MOTOR = 8388608;
mavlink20.MAV_SYS_STATUS_LOGGING = 16777216;
mavlink20.MAV_SYS_STATUS_SENSOR_BATTERY = 33554432;
mavlink20.MAV_SYS_STATUS_SENSOR_PROXIMITY = 67108864;
mavlink20.MAV_SYS_STATUS_SENSOR_SATCOM = 134217728;
mavlink20.MAV_SYS_STATUS_PREARM_CHECK = 268435456;
mavlink20.MAV_SYS_STATUS_OBSTACLE_AVOIDANCE = 536870912;
mavlink20.MAV_SYS_STATUS_SENSOR_PROPULSION = 1073741824;
mavlink20.MAV_SYS_STATUS_SENSOR_ENUM_END = 1073741825;
mavlink20.MAV_FRAME_GLOBAL = 0;
mavlink20.MAV_FRAME_LOCAL_NED = 1;
mavlink20.MAV_FRAME_MISSION = 2;
mavlink20.MAV_FRAME_GLOBAL_RELATIVE_ALT = 3;
mavlink20.MAV_FRAME_LOCAL_ENU = 4;
mavlink20.MAV_FRAME_GLOBAL_INT = 5;
mavlink20.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT = 6;
mavlink20.MAV_FRAME_LOCAL_OFFSET_NED = 7;
mavlink20.MAV_FRAME_BODY_NED = 8;
mavlink20.MAV_FRAME_BODY_OFFSET_NED = 9;
mavlink20.MAV_FRAME_GLOBAL_TERRAIN_ALT = 10;
mavlink20.MAV_FRAME_GLOBAL_TERRAIN_ALT_INT = 11;
mavlink20.MAV_FRAME_BODY_FRD = 12;
mavlink20.MAV_FRAME_RESERVED_13 = 13;
mavlink20.MAV_FRAME_RESERVED_14 = 14;
mavlink20.MAV_FRAME_RESERVED_15 = 15;
mavlink20.MAV_FRAME_RESERVED_16 = 16;
mavlink20.MAV_FRAME_RESERVED_17 = 17;
mavlink20.MAV_FRAME_RESERVED_18 = 18;
mavlink20.MAV_FRAME_RESERVED_19 = 19;
mavlink20.MAV_FRAME_LOCAL_FRD = 20;
mavlink20.MAV_FRAME_LOCAL_FLU = 21;
mavlink20.MAV_FRAME_ENUM_END = 22;
mavlink20.MAVLINK_DATA_STREAM_IMG_JPEG = 0;
mavlink20.MAVLINK_DATA_STREAM_IMG_BMP = 1;
mavlink20.MAVLINK_DATA_STREAM_IMG_RAW8U = 2;
mavlink20.MAVLINK_DATA_STREAM_IMG_RAW32U = 3;
mavlink20.MAVLINK_DATA_STREAM_IMG_PGM = 4;
mavlink20.MAVLINK_DATA_STREAM_IMG_PNG = 5;
mavlink20.MAVLINK_DATA_STREAM_TYPE_ENUM_END = 6;
mavlink20.FENCE_ACTION_NONE = 0;
mavlink20.FENCE_ACTION_GUIDED = 1;
mavlink20.FENCE_ACTION_REPORT = 2;
mavlink20.FENCE_ACTION_GUIDED_THR_PASS = 3;
mavlink20.FENCE_ACTION_RTL = 4;
mavlink20.FENCE_ACTION_ENUM_END = 5;
mavlink20.FENCE_BREACH_NONE = 0;
mavlink20.FENCE_BREACH_MINALT = 1;
mavlink20.FENCE_BREACH_MAXALT = 2;
mavlink20.FENCE_BREACH_BOUNDARY = 3;
mavlink20.FENCE_BREACH_ENUM_END = 4;
mavlink20.FENCE_MITIGATE_UNKNOWN = 0;
mavlink20.FENCE_MITIGATE_NONE = 1;
mavlink20.FENCE_MITIGATE_VEL_LIMIT = 2;
mavlink20.FENCE_MITIGATE_ENUM_END = 3;
mavlink20.FENCE_TYPE_ALL = 0;
mavlink20.FENCE_TYPE_ALT_MAX = 1;
mavlink20.FENCE_TYPE_CIRCLE = 2;
mavlink20.FENCE_TYPE_POLYGON = 4;
mavlink20.FENCE_TYPE_ALT_MIN = 8;
mavlink20.FENCE_TYPE_ENUM_END = 9;
mavlink20.MAV_MOUNT_MODE_RETRACT = 0;
mavlink20.MAV_MOUNT_MODE_NEUTRAL = 1;
mavlink20.MAV_MOUNT_MODE_MAVLINK_TARGETING = 2;
mavlink20.MAV_MOUNT_MODE_RC_TARGETING = 3;
mavlink20.MAV_MOUNT_MODE_GPS_POINT = 4;
mavlink20.MAV_MOUNT_MODE_SYSID_TARGET = 5;
mavlink20.MAV_MOUNT_MODE_HOME_LOCATION = 6;
mavlink20.MAV_MOUNT_MODE_ENUM_END = 7;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_RETRACT = 1;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_NEUTRAL = 2;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_AXIS = 4;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_FOLLOW = 8;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_LOCK = 16;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_AXIS = 32;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_FOLLOW = 64;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_LOCK = 128;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_AXIS = 256;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_FOLLOW = 512;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_LOCK = 1024;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_SUPPORTS_INFINITE_YAW = 2048;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_SUPPORTS_YAW_IN_EARTH_FRAME = 4096;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_HAS_RC_INPUTS = 8192;
mavlink20.GIMBAL_DEVICE_CAP_FLAGS_ENUM_END = 8193;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_RETRACT = 1;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_NEUTRAL = 2;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_ROLL_AXIS = 4;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_ROLL_FOLLOW = 8;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_ROLL_LOCK = 16;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_PITCH_AXIS = 32;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_PITCH_FOLLOW = 64;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_PITCH_LOCK = 128;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_YAW_AXIS = 256;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_YAW_FOLLOW = 512;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_YAW_LOCK = 1024;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_SUPPORTS_INFINITE_YAW = 2048;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_SUPPORTS_YAW_IN_EARTH_FRAME = 4096;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_HAS_RC_INPUTS = 8192;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_CAN_POINT_LOCATION_LOCAL = 65536;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_CAN_POINT_LOCATION_GLOBAL = 131072;
mavlink20.GIMBAL_MANAGER_CAP_FLAGS_ENUM_END = 131073;
mavlink20.GIMBAL_DEVICE_FLAGS_RETRACT = 1;
mavlink20.GIMBAL_DEVICE_FLAGS_NEUTRAL = 2;
mavlink20.GIMBAL_DEVICE_FLAGS_ROLL_LOCK = 4;
mavlink20.GIMBAL_DEVICE_FLAGS_PITCH_LOCK = 8;
mavlink20.GIMBAL_DEVICE_FLAGS_YAW_LOCK = 16;
mavlink20.GIMBAL_DEVICE_FLAGS_YAW_IN_VEHICLE_FRAME = 32;
mavlink20.GIMBAL_DEVICE_FLAGS_YAW_IN_EARTH_FRAME = 64;
mavlink20.GIMBAL_DEVICE_FLAGS_ACCEPTS_YAW_IN_EARTH_FRAME = 128;
mavlink20.GIMBAL_DEVICE_FLAGS_RC_EXCLUSIVE = 256;
mavlink20.GIMBAL_DEVICE_FLAGS_RC_MIXED = 512;
mavlink20.GIMBAL_DEVICE_FLAGS_ENUM_END = 513;
mavlink20.GIMBAL_MANAGER_FLAGS_RETRACT = 1;
mavlink20.GIMBAL_MANAGER_FLAGS_NEUTRAL = 2;
mavlink20.GIMBAL_MANAGER_FLAGS_ROLL_LOCK = 4;
mavlink20.GIMBAL_MANAGER_FLAGS_PITCH_LOCK = 8;
mavlink20.GIMBAL_MANAGER_FLAGS_YAW_LOCK = 16;
mavlink20.GIMBAL_MANAGER_FLAGS_YAW_IN_VEHICLE_FRAME = 32;
mavlink20.GIMBAL_MANAGER_FLAGS_YAW_IN_EARTH_FRAME = 64;
mavlink20.GIMBAL_MANAGER_FLAGS_ACCEPTS_YAW_IN_EARTH_FRAME = 128;
mavlink20.GIMBAL_MANAGER_FLAGS_RC_EXCLUSIVE = 256;
mavlink20.GIMBAL_MANAGER_FLAGS_RC_MIXED = 512;
mavlink20.GIMBAL_MANAGER_FLAGS_ENUM_END = 513;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_AT_ROLL_LIMIT = 1;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_AT_PITCH_LIMIT = 2;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_AT_YAW_LIMIT = 4;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_ENCODER_ERROR = 8;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_POWER_ERROR = 16;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_MOTOR_ERROR = 32;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_SOFTWARE_ERROR = 64;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_COMMS_ERROR = 128;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_CALIBRATION_RUNNING = 256;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_NO_MANAGER = 512;
mavlink20.GIMBAL_DEVICE_ERROR_FLAGS_ENUM_END = 513;
mavlink20.GRIPPER_ACTION_RELEASE = 0;
mavlink20.GRIPPER_ACTION_GRAB = 1;
mavlink20.GRIPPER_ACTIONS_ENUM_END = 2;
mavlink20.WINCH_RELAXED = 0;
mavlink20.WINCH_RELATIVE_LENGTH_CONTROL = 1;
mavlink20.WINCH_RATE_CONTROL = 2;
mavlink20.WINCH_LOCK = 3;
mavlink20.WINCH_DELIVER = 4;
mavlink20.WINCH_HOLD = 5;
mavlink20.WINCH_RETRACT = 6;
mavlink20.WINCH_LOAD_LINE = 7;
mavlink20.WINCH_ABANDON_LINE = 8;
mavlink20.WINCH_ACTIONS_ENUM_END = 9;
mavlink20.UAVCAN_NODE_HEALTH_OK = 0;
mavlink20.UAVCAN_NODE_HEALTH_WARNING = 1;
mavlink20.UAVCAN_NODE_HEALTH_ERROR = 2;
mavlink20.UAVCAN_NODE_HEALTH_CRITICAL = 3;
mavlink20.UAVCAN_NODE_HEALTH_ENUM_END = 4;
mavlink20.UAVCAN_NODE_MODE_OPERATIONAL = 0;
mavlink20.UAVCAN_NODE_MODE_INITIALIZATION = 1;
mavlink20.UAVCAN_NODE_MODE_MAINTENANCE = 2;
mavlink20.UAVCAN_NODE_MODE_SOFTWARE_UPDATE = 3;
mavlink20.UAVCAN_NODE_MODE_OFFLINE = 7;
mavlink20.UAVCAN_NODE_MODE_ENUM_END = 8;
mavlink20.STORAGE_STATUS_EMPTY = 0;
mavlink20.STORAGE_STATUS_UNFORMATTED = 1;
mavlink20.STORAGE_STATUS_READY = 2;
mavlink20.STORAGE_STATUS_NOT_SUPPORTED = 3;
mavlink20.STORAGE_STATUS_ENUM_END = 4;
mavlink20.STORAGE_TYPE_UNKNOWN = 0;
mavlink20.STORAGE_TYPE_USB_STICK = 1;
mavlink20.STORAGE_TYPE_SD = 2;
mavlink20.STORAGE_TYPE_MICROSD = 3;
mavlink20.STORAGE_TYPE_CF = 4;
mavlink20.STORAGE_TYPE_CFE = 5;
mavlink20.STORAGE_TYPE_XQD = 6;
mavlink20.STORAGE_TYPE_HD = 7;
mavlink20.STORAGE_TYPE_OTHER = 254;
mavlink20.STORAGE_TYPE_ENUM_END = 255;
mavlink20.STORAGE_USAGE_FLAG_SET = 1;
mavlink20.STORAGE_USAGE_FLAG_PHOTO = 2;
mavlink20.STORAGE_USAGE_FLAG_VIDEO = 4;
mavlink20.STORAGE_USAGE_FLAG_LOGS = 8;
mavlink20.STORAGE_USAGE_FLAG_ENUM_END = 9;
mavlink20.AUTOTUNE_AXIS_DEFAULT = 0;
mavlink20.AUTOTUNE_AXIS_ROLL = 1;
mavlink20.AUTOTUNE_AXIS_PITCH = 2;
mavlink20.AUTOTUNE_AXIS_YAW = 4;
mavlink20.AUTOTUNE_AXIS_ENUM_END = 5;
mavlink20.MAV_DATA_STREAM_ALL = 0;
mavlink20.MAV_DATA_STREAM_RAW_SENSORS = 1;
mavlink20.MAV_DATA_STREAM_EXTENDED_STATUS = 2;
mavlink20.MAV_DATA_STREAM_RC_CHANNELS = 3;
mavlink20.MAV_DATA_STREAM_RAW_CONTROLLER = 4;
mavlink20.MAV_DATA_STREAM_POSITION = 6;
mavlink20.MAV_DATA_STREAM_EXTRA1 = 10;
mavlink20.MAV_DATA_STREAM_EXTRA2 = 11;
mavlink20.MAV_DATA_STREAM_EXTRA3 = 12;
mavlink20.MAV_DATA_STREAM_ENUM_END = 13;
mavlink20.MAV_ROI_NONE = 0;
mavlink20.MAV_ROI_WPNEXT = 1;
mavlink20.MAV_ROI_WPINDEX = 2;
mavlink20.MAV_ROI_LOCATION = 3;
mavlink20.MAV_ROI_TARGET = 4;
mavlink20.MAV_ROI_ENUM_END = 5;
mavlink20.MAV_PARAM_TYPE_UINT8 = 1;
mavlink20.MAV_PARAM_TYPE_INT8 = 2;
mavlink20.MAV_PARAM_TYPE_UINT16 = 3;
mavlink20.MAV_PARAM_TYPE_INT16 = 4;
mavlink20.MAV_PARAM_TYPE_UINT32 = 5;
mavlink20.MAV_PARAM_TYPE_INT32 = 6;
mavlink20.MAV_PARAM_TYPE_UINT64 = 7;
mavlink20.MAV_PARAM_TYPE_INT64 = 8;
mavlink20.MAV_PARAM_TYPE_REAL32 = 9;
mavlink20.MAV_PARAM_TYPE_REAL64 = 10;
mavlink20.MAV_PARAM_TYPE_ENUM_END = 11;
mavlink20.MAV_PARAM_EXT_TYPE_UINT8 = 1;
mavlink20.MAV_PARAM_EXT_TYPE_INT8 = 2;
mavlink20.MAV_PARAM_EXT_TYPE_UINT16 = 3;
mavlink20.MAV_PARAM_EXT_TYPE_INT16 = 4;
mavlink20.MAV_PARAM_EXT_TYPE_UINT32 = 5;
mavlink20.MAV_PARAM_EXT_TYPE_INT32 = 6;
mavlink20.MAV_PARAM_EXT_TYPE_UINT64 = 7;
mavlink20.MAV_PARAM_EXT_TYPE_INT64 = 8;
mavlink20.MAV_PARAM_EXT_TYPE_REAL32 = 9;
mavlink20.MAV_PARAM_EXT_TYPE_REAL64 = 10;
mavlink20.MAV_PARAM_EXT_TYPE_CUSTOM = 11;
mavlink20.MAV_PARAM_EXT_TYPE_ENUM_END = 12;
mavlink20.MAV_RESULT_ACCEPTED = 0;
mavlink20.MAV_RESULT_TEMPORARILY_REJECTED = 1;
mavlink20.MAV_RESULT_DENIED = 2;
mavlink20.MAV_RESULT_UNSUPPORTED = 3;
mavlink20.MAV_RESULT_FAILED = 4;
mavlink20.MAV_RESULT_IN_PROGRESS = 5;
mavlink20.MAV_RESULT_COMMAND_LONG_ONLY = 7;
mavlink20.MAV_RESULT_COMMAND_INT_ONLY = 8;
mavlink20.MAV_RESULT_ENUM_END = 9;
mavlink20.MAV_MISSION_ACCEPTED = 0;
mavlink20.MAV_MISSION_ERROR = 1;
mavlink20.MAV_MISSION_UNSUPPORTED_FRAME = 2;
mavlink20.MAV_MISSION_UNSUPPORTED = 3;
mavlink20.MAV_MISSION_NO_SPACE = 4;
mavlink20.MAV_MISSION_INVALID = 5;
mavlink20.MAV_MISSION_INVALID_PARAM1 = 6;
mavlink20.MAV_MISSION_INVALID_PARAM2 = 7;
mavlink20.MAV_MISSION_INVALID_PARAM3 = 8;
mavlink20.MAV_MISSION_INVALID_PARAM4 = 9;
mavlink20.MAV_MISSION_INVALID_PARAM5_X = 10;
mavlink20.MAV_MISSION_INVALID_PARAM6_Y = 11;
mavlink20.MAV_MISSION_INVALID_PARAM7 = 12;
mavlink20.MAV_MISSION_INVALID_SEQUENCE = 13;
mavlink20.MAV_MISSION_DENIED = 14;
mavlink20.MAV_MISSION_OPERATION_CANCELLED = 15;
mavlink20.MAV_MISSION_RESULT_ENUM_END = 16;
mavlink20.MAV_SEVERITY_EMERGENCY = 0;
mavlink20.MAV_SEVERITY_ALERT = 1;
mavlink20.MAV_SEVERITY_CRITICAL = 2;
mavlink20.MAV_SEVERITY_ERROR = 3;
mavlink20.MAV_SEVERITY_WARNING = 4;
mavlink20.MAV_SEVERITY_NOTICE = 5;
mavlink20.MAV_SEVERITY_INFO = 6;
mavlink20.MAV_SEVERITY_DEBUG = 7;
mavlink20.MAV_SEVERITY_ENUM_END = 8;
mavlink20.MAV_POWER_STATUS_BRICK_VALID = 1;
mavlink20.MAV_POWER_STATUS_SERVO_VALID = 2;
mavlink20.MAV_POWER_STATUS_USB_CONNECTED = 4;
mavlink20.MAV_POWER_STATUS_PERIPH_OVERCURRENT = 8;
mavlink20.MAV_POWER_STATUS_PERIPH_HIPOWER_OVERCURRENT = 16;
mavlink20.MAV_POWER_STATUS_CHANGED = 32;
mavlink20.MAV_POWER_STATUS_ENUM_END = 33;
mavlink20.SERIAL_CONTROL_DEV_TELEM1 = 0;
mavlink20.SERIAL_CONTROL_DEV_TELEM2 = 1;
mavlink20.SERIAL_CONTROL_DEV_GPS1 = 2;
mavlink20.SERIAL_CONTROL_DEV_GPS2 = 3;
mavlink20.SERIAL_CONTROL_DEV_SHELL = 10;
mavlink20.SERIAL_CONTROL_SERIAL0 = 100;
mavlink20.SERIAL_CONTROL_SERIAL1 = 101;
mavlink20.SERIAL_CONTROL_SERIAL2 = 102;
mavlink20.SERIAL_CONTROL_SERIAL3 = 103;
mavlink20.SERIAL_CONTROL_SERIAL4 = 104;
mavlink20.SERIAL_CONTROL_SERIAL5 = 105;
mavlink20.SERIAL_CONTROL_SERIAL6 = 106;
mavlink20.SERIAL_CONTROL_SERIAL7 = 107;
mavlink20.SERIAL_CONTROL_SERIAL8 = 108;
mavlink20.SERIAL_CONTROL_SERIAL9 = 109;
mavlink20.SERIAL_CONTROL_DEV_ENUM_END = 110;
mavlink20.SERIAL_CONTROL_FLAG_REPLY = 1;
mavlink20.SERIAL_CONTROL_FLAG_RESPOND = 2;
mavlink20.SERIAL_CONTROL_FLAG_EXCLUSIVE = 4;
mavlink20.SERIAL_CONTROL_FLAG_BLOCKING = 8;
mavlink20.SERIAL_CONTROL_FLAG_MULTI = 16;
mavlink20.SERIAL_CONTROL_FLAG_ENUM_END = 17;
mavlink20.MAV_DISTANCE_SENSOR_LASER = 0;
mavlink20.MAV_DISTANCE_SENSOR_ULTRASOUND = 1;
mavlink20.MAV_DISTANCE_SENSOR_INFRARED = 2;
mavlink20.MAV_DISTANCE_SENSOR_RADAR = 3;
mavlink20.MAV_DISTANCE_SENSOR_UNKNOWN = 4;
mavlink20.MAV_DISTANCE_SENSOR_ENUM_END = 5;
mavlink20.MAV_SENSOR_ROTATION_NONE = 0;
mavlink20.MAV_SENSOR_ROTATION_YAW_45 = 1;
mavlink20.MAV_SENSOR_ROTATION_YAW_90 = 2;
mavlink20.MAV_SENSOR_ROTATION_YAW_135 = 3;
mavlink20.MAV_SENSOR_ROTATION_YAW_180 = 4;
mavlink20.MAV_SENSOR_ROTATION_YAW_225 = 5;
mavlink20.MAV_SENSOR_ROTATION_YAW_270 = 6;
mavlink20.MAV_SENSOR_ROTATION_YAW_315 = 7;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180 = 8;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_45 = 9;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_90 = 10;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_135 = 11;
mavlink20.MAV_SENSOR_ROTATION_PITCH_180 = 12;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_225 = 13;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_270 = 14;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_YAW_315 = 15;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90 = 16;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_YAW_45 = 17;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_YAW_90 = 18;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_YAW_135 = 19;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270 = 20;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_YAW_45 = 21;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_YAW_90 = 22;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_YAW_135 = 23;
mavlink20.MAV_SENSOR_ROTATION_PITCH_90 = 24;
mavlink20.MAV_SENSOR_ROTATION_PITCH_270 = 25;
mavlink20.MAV_SENSOR_ROTATION_PITCH_180_YAW_90 = 26;
mavlink20.MAV_SENSOR_ROTATION_PITCH_180_YAW_270 = 27;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_90 = 28;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_PITCH_90 = 29;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_PITCH_90 = 30;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_180 = 31;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_PITCH_180 = 32;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_270 = 33;
mavlink20.MAV_SENSOR_ROTATION_ROLL_180_PITCH_270 = 34;
mavlink20.MAV_SENSOR_ROTATION_ROLL_270_PITCH_270 = 35;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_180_YAW_90 = 36;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_YAW_270 = 37;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_68_YAW_293 = 38;
mavlink20.MAV_SENSOR_ROTATION_PITCH_315 = 39;
mavlink20.MAV_SENSOR_ROTATION_ROLL_90_PITCH_315 = 40;
mavlink20.MAV_SENSOR_ROTATION_CUSTOM = 100;
mavlink20.MAV_SENSOR_ORIENTATION_ENUM_END = 101;
mavlink20.MAV_PROTOCOL_CAPABILITY_MISSION_FLOAT = 1;
mavlink20.MAV_PROTOCOL_CAPABILITY_PARAM_FLOAT = 2;
mavlink20.MAV_PROTOCOL_CAPABILITY_MISSION_INT = 4;
mavlink20.MAV_PROTOCOL_CAPABILITY_COMMAND_INT = 8;
mavlink20.MAV_PROTOCOL_CAPABILITY_PARAM_UNION = 16;
mavlink20.MAV_PROTOCOL_CAPABILITY_FTP = 32;
mavlink20.MAV_PROTOCOL_CAPABILITY_SET_ATTITUDE_TARGET = 64;
mavlink20.MAV_PROTOCOL_CAPABILITY_SET_POSITION_TARGET_LOCAL_NED = 128;
mavlink20.MAV_PROTOCOL_CAPABILITY_SET_POSITION_TARGET_GLOBAL_INT = 256;
mavlink20.MAV_PROTOCOL_CAPABILITY_TERRAIN = 512;
mavlink20.MAV_PROTOCOL_CAPABILITY_SET_ACTUATOR_TARGET = 1024;
mavlink20.MAV_PROTOCOL_CAPABILITY_FLIGHT_TERMINATION = 2048;
mavlink20.MAV_PROTOCOL_CAPABILITY_COMPASS_CALIBRATION = 4096;
mavlink20.MAV_PROTOCOL_CAPABILITY_MAVLINK2 = 8192;
mavlink20.MAV_PROTOCOL_CAPABILITY_MISSION_FENCE = 16384;
mavlink20.MAV_PROTOCOL_CAPABILITY_MISSION_RALLY = 32768;
mavlink20.MAV_PROTOCOL_CAPABILITY_FLIGHT_INFORMATION = 65536;
mavlink20.MAV_PROTOCOL_CAPABILITY_ENUM_END = 65537;
mavlink20.MAV_MISSION_TYPE_MISSION = 0;
mavlink20.MAV_MISSION_TYPE_FENCE = 1;
mavlink20.MAV_MISSION_TYPE_RALLY = 2;
mavlink20.MAV_MISSION_TYPE_ALL = 255;
mavlink20.MAV_MISSION_TYPE_ENUM_END = 256;
mavlink20.MAV_ESTIMATOR_TYPE_UNKNOWN = 0;
mavlink20.MAV_ESTIMATOR_TYPE_NAIVE = 1;
mavlink20.MAV_ESTIMATOR_TYPE_VISION = 2;
mavlink20.MAV_ESTIMATOR_TYPE_VIO = 3;
mavlink20.MAV_ESTIMATOR_TYPE_GPS = 4;
mavlink20.MAV_ESTIMATOR_TYPE_GPS_INS = 5;
mavlink20.MAV_ESTIMATOR_TYPE_MOCAP = 6;
mavlink20.MAV_ESTIMATOR_TYPE_LIDAR = 7;
mavlink20.MAV_ESTIMATOR_TYPE_AUTOPILOT = 8;
mavlink20.MAV_ESTIMATOR_TYPE_ENUM_END = 9;
mavlink20.MAV_BATTERY_TYPE_UNKNOWN = 0;
mavlink20.MAV_BATTERY_TYPE_LIPO = 1;
mavlink20.MAV_BATTERY_TYPE_LIFE = 2;
mavlink20.MAV_BATTERY_TYPE_LION = 3;
mavlink20.MAV_BATTERY_TYPE_NIMH = 4;
mavlink20.MAV_BATTERY_TYPE_ENUM_END = 5;
mavlink20.MAV_BATTERY_FUNCTION_UNKNOWN = 0;
mavlink20.MAV_BATTERY_FUNCTION_ALL = 1;
mavlink20.MAV_BATTERY_FUNCTION_PROPULSION = 2;
mavlink20.MAV_BATTERY_FUNCTION_AVIONICS = 3;
mavlink20.MAV_BATTERY_TYPE_PAYLOAD = 4;
mavlink20.MAV_BATTERY_FUNCTION_ENUM_END = 5;
mavlink20.MAV_BATTERY_CHARGE_STATE_UNDEFINED = 0;
mavlink20.MAV_BATTERY_CHARGE_STATE_OK = 1;
mavlink20.MAV_BATTERY_CHARGE_STATE_LOW = 2;
mavlink20.MAV_BATTERY_CHARGE_STATE_CRITICAL = 3;
mavlink20.MAV_BATTERY_CHARGE_STATE_EMERGENCY = 4;
mavlink20.MAV_BATTERY_CHARGE_STATE_FAILED = 5;
mavlink20.MAV_BATTERY_CHARGE_STATE_UNHEALTHY = 6;
mavlink20.MAV_BATTERY_CHARGE_STATE_CHARGING = 7;
mavlink20.MAV_BATTERY_CHARGE_STATE_ENUM_END = 8;
mavlink20.MAV_BATTERY_MODE_UNKNOWN = 0;
mavlink20.MAV_BATTERY_MODE_AUTO_DISCHARGING = 1;
mavlink20.MAV_BATTERY_MODE_HOT_SWAP = 2;
mavlink20.MAV_BATTERY_MODE_ENUM_END = 3;
mavlink20.MAV_BATTERY_FAULT_DEEP_DISCHARGE = 1;
mavlink20.MAV_BATTERY_FAULT_SPIKES = 2;
mavlink20.MAV_BATTERY_FAULT_CELL_FAIL = 4;
mavlink20.MAV_BATTERY_FAULT_OVER_CURRENT = 8;
mavlink20.MAV_BATTERY_FAULT_OVER_TEMPERATURE = 16;
mavlink20.MAV_BATTERY_FAULT_UNDER_TEMPERATURE = 32;
mavlink20.MAV_BATTERY_FAULT_INCOMPATIBLE_VOLTAGE = 64;
mavlink20.MAV_BATTERY_FAULT_INCOMPATIBLE_FIRMWARE = 128;
mavlink20.BATTERY_FAULT_INCOMPATIBLE_CELLS_CONFIGURATION = 256;
mavlink20.MAV_BATTERY_FAULT_ENUM_END = 257;
mavlink20.MAV_GENERATOR_STATUS_FLAG_OFF = 1;
mavlink20.MAV_GENERATOR_STATUS_FLAG_READY = 2;
mavlink20.MAV_GENERATOR_STATUS_FLAG_GENERATING = 4;
mavlink20.MAV_GENERATOR_STATUS_FLAG_CHARGING = 8;
mavlink20.MAV_GENERATOR_STATUS_FLAG_REDUCED_POWER = 16;
mavlink20.MAV_GENERATOR_STATUS_FLAG_MAXPOWER = 32;
mavlink20.MAV_GENERATOR_STATUS_FLAG_OVERTEMP_WARNING = 64;
mavlink20.MAV_GENERATOR_STATUS_FLAG_OVERTEMP_FAULT = 128;
mavlink20.MAV_GENERATOR_STATUS_FLAG_ELECTRONICS_OVERTEMP_WARNING = 256;
mavlink20.MAV_GENERATOR_STATUS_FLAG_ELECTRONICS_OVERTEMP_FAULT = 512;
mavlink20.MAV_GENERATOR_STATUS_FLAG_ELECTRONICS_FAULT = 1024;
mavlink20.MAV_GENERATOR_STATUS_FLAG_POWERSOURCE_FAULT = 2048;
mavlink20.MAV_GENERATOR_STATUS_FLAG_COMMUNICATION_WARNING = 4096;
mavlink20.MAV_GENERATOR_STATUS_FLAG_COOLING_WARNING = 8192;
mavlink20.MAV_GENERATOR_STATUS_FLAG_POWER_RAIL_FAULT = 16384;
mavlink20.MAV_GENERATOR_STATUS_FLAG_OVERCURRENT_FAULT = 32768;
mavlink20.MAV_GENERATOR_STATUS_FLAG_BATTERY_OVERCHARGE_CURRENT_FAULT = 65536;
mavlink20.MAV_GENERATOR_STATUS_FLAG_OVERVOLTAGE_FAULT = 131072;
mavlink20.MAV_GENERATOR_STATUS_FLAG_BATTERY_UNDERVOLT_FAULT = 262144;
mavlink20.MAV_GENERATOR_STATUS_FLAG_START_INHIBITED = 524288;
mavlink20.MAV_GENERATOR_STATUS_FLAG_MAINTENANCE_REQUIRED = 1048576;
mavlink20.MAV_GENERATOR_STATUS_FLAG_WARMING_UP = 2097152;
mavlink20.MAV_GENERATOR_STATUS_FLAG_IDLE = 4194304;
mavlink20.MAV_GENERATOR_STATUS_FLAG_ENUM_END = 4194305;
mavlink20.MAV_VTOL_STATE_UNDEFINED = 0;
mavlink20.MAV_VTOL_STATE_TRANSITION_TO_FW = 1;
mavlink20.MAV_VTOL_STATE_TRANSITION_TO_MC = 2;
mavlink20.MAV_VTOL_STATE_MC = 3;
mavlink20.MAV_VTOL_STATE_FW = 4;
mavlink20.MAV_VTOL_STATE_ENUM_END = 5;
mavlink20.MAV_LANDED_STATE_UNDEFINED = 0;
mavlink20.MAV_LANDED_STATE_ON_GROUND = 1;
mavlink20.MAV_LANDED_STATE_IN_AIR = 2;
mavlink20.MAV_LANDED_STATE_TAKEOFF = 3;
mavlink20.MAV_LANDED_STATE_LANDING = 4;
mavlink20.MAV_LANDED_STATE_ENUM_END = 5;
mavlink20.ADSB_ALTITUDE_TYPE_PRESSURE_QNH = 0;
mavlink20.ADSB_ALTITUDE_TYPE_GEOMETRIC = 1;
mavlink20.ADSB_ALTITUDE_TYPE_ENUM_END = 2;
mavlink20.ADSB_EMITTER_TYPE_NO_INFO = 0;
mavlink20.ADSB_EMITTER_TYPE_LIGHT = 1;
mavlink20.ADSB_EMITTER_TYPE_SMALL = 2;
mavlink20.ADSB_EMITTER_TYPE_LARGE = 3;
mavlink20.ADSB_EMITTER_TYPE_HIGH_VORTEX_LARGE = 4;
mavlink20.ADSB_EMITTER_TYPE_HEAVY = 5;
mavlink20.ADSB_EMITTER_TYPE_HIGHLY_MANUV = 6;
mavlink20.ADSB_EMITTER_TYPE_ROTOCRAFT = 7;
mavlink20.ADSB_EMITTER_TYPE_UNASSIGNED = 8;
mavlink20.ADSB_EMITTER_TYPE_GLIDER = 9;
mavlink20.ADSB_EMITTER_TYPE_LIGHTER_AIR = 10;
mavlink20.ADSB_EMITTER_TYPE_PARACHUTE = 11;
mavlink20.ADSB_EMITTER_TYPE_ULTRA_LIGHT = 12;
mavlink20.ADSB_EMITTER_TYPE_UNASSIGNED2 = 13;
mavlink20.ADSB_EMITTER_TYPE_UAV = 14;
mavlink20.ADSB_EMITTER_TYPE_SPACE = 15;
mavlink20.ADSB_EMITTER_TYPE_UNASSGINED3 = 16;
mavlink20.ADSB_EMITTER_TYPE_EMERGENCY_SURFACE = 17;
mavlink20.ADSB_EMITTER_TYPE_SERVICE_SURFACE = 18;
mavlink20.ADSB_EMITTER_TYPE_POINT_OBSTACLE = 19;
mavlink20.ADSB_EMITTER_TYPE_ENUM_END = 20;
mavlink20.ADSB_FLAGS_VALID_COORDS = 1;
mavlink20.ADSB_FLAGS_VALID_ALTITUDE = 2;
mavlink20.ADSB_FLAGS_VALID_HEADING = 4;
mavlink20.ADSB_FLAGS_VALID_VELOCITY = 8;
mavlink20.ADSB_FLAGS_VALID_CALLSIGN = 16;
mavlink20.ADSB_FLAGS_VALID_SQUAWK = 32;
mavlink20.ADSB_FLAGS_SIMULATED = 64;
mavlink20.ADSB_FLAGS_VERTICAL_VELOCITY_VALID = 128;
mavlink20.ADSB_FLAGS_BARO_VALID = 256;
mavlink20.ADSB_FLAGS_SOURCE_UAT = 32768;
mavlink20.ADSB_FLAGS_ENUM_END = 32769;
mavlink20.MAV_DO_REPOSITION_FLAGS_CHANGE_MODE = 1;
mavlink20.MAV_DO_REPOSITION_FLAGS_ENUM_END = 2;
mavlink20.SPEED_TYPE_AIRSPEED = 0;
mavlink20.SPEED_TYPE_GROUNDSPEED = 1;
mavlink20.SPEED_TYPE_CLIMB_SPEED = 2;
mavlink20.SPEED_TYPE_DESCENT_SPEED = 3;
mavlink20.SPEED_TYPE_ENUM_END = 4;
mavlink20.ESTIMATOR_ATTITUDE = 1;
mavlink20.ESTIMATOR_VELOCITY_HORIZ = 2;
mavlink20.ESTIMATOR_VELOCITY_VERT = 4;
mavlink20.ESTIMATOR_POS_HORIZ_REL = 8;
mavlink20.ESTIMATOR_POS_HORIZ_ABS = 16;
mavlink20.ESTIMATOR_POS_VERT_ABS = 32;
mavlink20.ESTIMATOR_POS_VERT_AGL = 64;
mavlink20.ESTIMATOR_CONST_POS_MODE = 128;
mavlink20.ESTIMATOR_PRED_POS_HORIZ_REL = 256;
mavlink20.ESTIMATOR_PRED_POS_HORIZ_ABS = 512;
mavlink20.ESTIMATOR_GPS_GLITCH = 1024;
mavlink20.ESTIMATOR_ACCEL_ERROR = 2048;
mavlink20.ESTIMATOR_STATUS_FLAGS_ENUM_END = 2049;
mavlink20.MOTOR_TEST_ORDER_DEFAULT = 0;
mavlink20.MOTOR_TEST_ORDER_SEQUENCE = 1;
mavlink20.MOTOR_TEST_ORDER_BOARD = 2;
mavlink20.MOTOR_TEST_ORDER_ENUM_END = 3;
mavlink20.MOTOR_TEST_THROTTLE_PERCENT = 0;
mavlink20.MOTOR_TEST_THROTTLE_PWM = 1;
mavlink20.MOTOR_TEST_THROTTLE_PILOT = 2;
mavlink20.MOTOR_TEST_COMPASS_CAL = 3;
mavlink20.MOTOR_TEST_THROTTLE_TYPE_ENUM_END = 4;
mavlink20.GPS_INPUT_IGNORE_FLAG_ALT = 1;
mavlink20.GPS_INPUT_IGNORE_FLAG_HDOP = 2;
mavlink20.GPS_INPUT_IGNORE_FLAG_VDOP = 4;
mavlink20.GPS_INPUT_IGNORE_FLAG_VEL_HORIZ = 8;
mavlink20.GPS_INPUT_IGNORE_FLAG_VEL_VERT = 16;
mavlink20.GPS_INPUT_IGNORE_FLAG_SPEED_ACCURACY = 32;
mavlink20.GPS_INPUT_IGNORE_FLAG_HORIZONTAL_ACCURACY = 64;
mavlink20.GPS_INPUT_IGNORE_FLAG_VERTICAL_ACCURACY = 128;
mavlink20.GPS_INPUT_IGNORE_FLAGS_ENUM_END = 129;
mavlink20.MAV_COLLISION_ACTION_NONE = 0;
mavlink20.MAV_COLLISION_ACTION_REPORT = 1;
mavlink20.MAV_COLLISION_ACTION_ASCEND_OR_DESCEND = 2;
mavlink20.MAV_COLLISION_ACTION_MOVE_HORIZONTALLY = 3;
mavlink20.MAV_COLLISION_ACTION_MOVE_PERPENDICULAR = 4;
mavlink20.MAV_COLLISION_ACTION_RTL = 5;
mavlink20.MAV_COLLISION_ACTION_HOVER = 6;
mavlink20.MAV_COLLISION_ACTION_ENUM_END = 7;
mavlink20.MAV_COLLISION_THREAT_LEVEL_NONE = 0;
mavlink20.MAV_COLLISION_THREAT_LEVEL_LOW = 1;
mavlink20.MAV_COLLISION_THREAT_LEVEL_HIGH = 2;
mavlink20.MAV_COLLISION_THREAT_LEVEL_ENUM_END = 3;
mavlink20.MAV_COLLISION_SRC_ADSB = 0;
mavlink20.MAV_COLLISION_SRC_MAVLINK_GPS_GLOBAL_INT = 1;
mavlink20.MAV_COLLISION_SRC_ENUM_END = 2;
mavlink20.GPS_FIX_TYPE_NO_GPS = 0;
mavlink20.GPS_FIX_TYPE_NO_FIX = 1;
mavlink20.GPS_FIX_TYPE_2D_FIX = 2;
mavlink20.GPS_FIX_TYPE_3D_FIX = 3;
mavlink20.GPS_FIX_TYPE_DGPS = 4;
mavlink20.GPS_FIX_TYPE_RTK_FLOAT = 5;
mavlink20.GPS_FIX_TYPE_RTK_FIXED = 6;
mavlink20.GPS_FIX_TYPE_STATIC = 7;
mavlink20.GPS_FIX_TYPE_PPP = 8;
mavlink20.GPS_FIX_TYPE_ENUM_END = 9;
mavlink20.RTK_BASELINE_COORDINATE_SYSTEM_ECEF = 0;
mavlink20.RTK_BASELINE_COORDINATE_SYSTEM_NED = 1;
mavlink20.RTK_BASELINE_COORDINATE_SYSTEM_ENUM_END = 2;
mavlink20.LANDING_TARGET_TYPE_LIGHT_BEACON = 0;
mavlink20.LANDING_TARGET_TYPE_RADIO_BEACON = 1;
mavlink20.LANDING_TARGET_TYPE_VISION_FIDUCIAL = 2;
mavlink20.LANDING_TARGET_TYPE_VISION_OTHER = 3;
mavlink20.LANDING_TARGET_TYPE_ENUM_END = 4;
mavlink20.VTOL_TRANSITION_HEADING_VEHICLE_DEFAULT = 0;
mavlink20.VTOL_TRANSITION_HEADING_NEXT_WAYPOINT = 1;
mavlink20.VTOL_TRANSITION_HEADING_TAKEOFF = 2;
mavlink20.VTOL_TRANSITION_HEADING_SPECIFIED = 3;
mavlink20.VTOL_TRANSITION_HEADING_ANY = 4;
mavlink20.VTOL_TRANSITION_HEADING_ENUM_END = 5;
mavlink20.CAMERA_CAP_FLAGS_CAPTURE_VIDEO = 1;
mavlink20.CAMERA_CAP_FLAGS_CAPTURE_IMAGE = 2;
mavlink20.CAMERA_CAP_FLAGS_HAS_MODES = 4;
mavlink20.CAMERA_CAP_FLAGS_CAN_CAPTURE_IMAGE_IN_VIDEO_MODE = 8;
mavlink20.CAMERA_CAP_FLAGS_CAN_CAPTURE_VIDEO_IN_IMAGE_MODE = 16;
mavlink20.CAMERA_CAP_FLAGS_HAS_IMAGE_SURVEY_MODE = 32;
mavlink20.CAMERA_CAP_FLAGS_HAS_BASIC_ZOOM = 64;
mavlink20.CAMERA_CAP_FLAGS_HAS_BASIC_FOCUS = 128;
mavlink20.CAMERA_CAP_FLAGS_HAS_VIDEO_STREAM = 256;
mavlink20.CAMERA_CAP_FLAGS_HAS_TRACKING_POINT = 512;
mavlink20.CAMERA_CAP_FLAGS_HAS_TRACKING_RECTANGLE = 1024;
mavlink20.CAMERA_CAP_FLAGS_HAS_TRACKING_GEO_STATUS = 2048;
mavlink20.CAMERA_CAP_FLAGS_ENUM_END = 2049;
mavlink20.VIDEO_STREAM_STATUS_FLAGS_RUNNING = 1;
mavlink20.VIDEO_STREAM_STATUS_FLAGS_THERMAL = 2;
mavlink20.VIDEO_STREAM_STATUS_FLAGS_ENUM_END = 3;
mavlink20.VIDEO_STREAM_TYPE_RTSP = 0;
mavlink20.VIDEO_STREAM_TYPE_RTPUDP = 1;
mavlink20.VIDEO_STREAM_TYPE_TCP_MPEG = 2;
mavlink20.VIDEO_STREAM_TYPE_MPEG_TS_H264 = 3;
mavlink20.VIDEO_STREAM_TYPE_ENUM_END = 4;
mavlink20.CAMERA_TRACKING_STATUS_FLAGS_IDLE = 0;
mavlink20.CAMERA_TRACKING_STATUS_FLAGS_ACTIVE = 1;
mavlink20.CAMERA_TRACKING_STATUS_FLAGS_ERROR = 2;
mavlink20.CAMERA_TRACKING_STATUS_FLAGS_ENUM_END = 3;
mavlink20.CAMERA_TRACKING_MODE_NONE = 0;
mavlink20.CAMERA_TRACKING_MODE_POINT = 1;
mavlink20.CAMERA_TRACKING_MODE_RECTANGLE = 2;
mavlink20.CAMERA_TRACKING_MODE_ENUM_END = 3;
mavlink20.CAMERA_TRACKING_TARGET_DATA_NONE = 0;
mavlink20.CAMERA_TRACKING_TARGET_DATA_EMBEDDED = 1;
mavlink20.CAMERA_TRACKING_TARGET_DATA_RENDERED = 2;
mavlink20.CAMERA_TRACKING_TARGET_DATA_IN_STATUS = 4;
mavlink20.CAMERA_TRACKING_TARGET_DATA_ENUM_END = 5;
mavlink20.ZOOM_TYPE_STEP = 0;
mavlink20.ZOOM_TYPE_CONTINUOUS = 1;
mavlink20.ZOOM_TYPE_RANGE = 2;
mavlink20.ZOOM_TYPE_FOCAL_LENGTH = 3;
mavlink20.CAMERA_ZOOM_TYPE_ENUM_END = 4;
mavlink20.FOCUS_TYPE_STEP = 0;
mavlink20.FOCUS_TYPE_CONTINUOUS = 1;
mavlink20.FOCUS_TYPE_RANGE = 2;
mavlink20.FOCUS_TYPE_METERS = 3;
mavlink20.FOCUS_TYPE_AUTO = 4;
mavlink20.FOCUS_TYPE_AUTO_SINGLE = 5;
mavlink20.FOCUS_TYPE_AUTO_CONTINUOUS = 6;
mavlink20.SET_FOCUS_TYPE_ENUM_END = 7;
mavlink20.CAMERA_SOURCE_DEFAULT = 0;
mavlink20.CAMERA_SOURCE_RGB = 1;
mavlink20.CAMERA_SOURCE_IR = 2;
mavlink20.CAMERA_SOURCE_NDVI = 3;
mavlink20.CAMERA_SOURCE_ENUM_END = 4;
mavlink20.PARAM_ACK_ACCEPTED = 0;
mavlink20.PARAM_ACK_VALUE_UNSUPPORTED = 1;
mavlink20.PARAM_ACK_FAILED = 2;
mavlink20.PARAM_ACK_IN_PROGRESS = 3;
mavlink20.PARAM_ACK_ENUM_END = 4;
mavlink20.CAMERA_MODE_IMAGE = 0;
mavlink20.CAMERA_MODE_VIDEO = 1;
mavlink20.CAMERA_MODE_IMAGE_SURVEY = 2;
mavlink20.CAMERA_MODE_ENUM_END = 3;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_GENERIC = 0;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_NONE = 1;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_INVALID_WAYPOINT = 2;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_TIMEOUT = 3;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_AIRSPACE_IN_USE = 4;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_BAD_WEATHER = 5;
mavlink20.MAV_ARM_AUTH_DENIED_REASON_ENUM_END = 6;
mavlink20.RC_TYPE_SPEKTRUM_DSM2 = 0;
mavlink20.RC_TYPE_SPEKTRUM_DSMX = 1;
mavlink20.RC_TYPE_ENUM_END = 2;
mavlink20.ENGINE_CONTROL_OPTIONS_ALLOW_START_WHILE_DISARMED = 1;
mavlink20.ENGINE_CONTROL_OPTIONS_ENUM_END = 2;
mavlink20.POSITION_TARGET_TYPEMASK_X_IGNORE = 1;
mavlink20.POSITION_TARGET_TYPEMASK_Y_IGNORE = 2;
mavlink20.POSITION_TARGET_TYPEMASK_Z_IGNORE = 4;
mavlink20.POSITION_TARGET_TYPEMASK_VX_IGNORE = 8;
mavlink20.POSITION_TARGET_TYPEMASK_VY_IGNORE = 16;
mavlink20.POSITION_TARGET_TYPEMASK_VZ_IGNORE = 32;
mavlink20.POSITION_TARGET_TYPEMASK_AX_IGNORE = 64;
mavlink20.POSITION_TARGET_TYPEMASK_AY_IGNORE = 128;
mavlink20.POSITION_TARGET_TYPEMASK_AZ_IGNORE = 256;
mavlink20.POSITION_TARGET_TYPEMASK_FORCE_SET = 512;
mavlink20.POSITION_TARGET_TYPEMASK_YAW_IGNORE = 1024;
mavlink20.POSITION_TARGET_TYPEMASK_YAW_RATE_IGNORE = 2048;
mavlink20.POSITION_TARGET_TYPEMASK_ENUM_END = 2049;
mavlink20.ATTITUDE_TARGET_TYPEMASK_BODY_ROLL_RATE_IGNORE = 1;
mavlink20.ATTITUDE_TARGET_TYPEMASK_BODY_PITCH_RATE_IGNORE = 2;
mavlink20.ATTITUDE_TARGET_TYPEMASK_BODY_YAW_RATE_IGNORE = 4;
mavlink20.ATTITUDE_TARGET_TYPEMASK_THROTTLE_IGNORE = 64;
mavlink20.ATTITUDE_TARGET_TYPEMASK_ATTITUDE_IGNORE = 128;
mavlink20.ATTITUDE_TARGET_TYPEMASK_ENUM_END = 129;
mavlink20.UTM_FLIGHT_STATE_UNKNOWN = 1;
mavlink20.UTM_FLIGHT_STATE_GROUND = 2;
mavlink20.UTM_FLIGHT_STATE_AIRBORNE = 3;
mavlink20.UTM_FLIGHT_STATE_EMERGENCY = 16;
mavlink20.UTM_FLIGHT_STATE_NOCTRL = 32;
mavlink20.UTM_FLIGHT_STATE_ENUM_END = 33;
mavlink20.UTM_DATA_AVAIL_FLAGS_TIME_VALID = 1;
mavlink20.UTM_DATA_AVAIL_FLAGS_UAS_ID_AVAILABLE = 2;
mavlink20.UTM_DATA_AVAIL_FLAGS_POSITION_AVAILABLE = 4;
mavlink20.UTM_DATA_AVAIL_FLAGS_ALTITUDE_AVAILABLE = 8;
mavlink20.UTM_DATA_AVAIL_FLAGS_RELATIVE_ALTITUDE_AVAILABLE = 16;
mavlink20.UTM_DATA_AVAIL_FLAGS_HORIZONTAL_VELO_AVAILABLE = 32;
mavlink20.UTM_DATA_AVAIL_FLAGS_VERTICAL_VELO_AVAILABLE = 64;
mavlink20.UTM_DATA_AVAIL_FLAGS_NEXT_WAYPOINT_AVAILABLE = 128;
mavlink20.UTM_DATA_AVAIL_FLAGS_ENUM_END = 129;
mavlink20.PRECISION_LAND_MODE_DISABLED = 0;
mavlink20.PRECISION_LAND_MODE_OPPORTUNISTIC = 1;
mavlink20.PRECISION_LAND_MODE_REQUIRED = 2;
mavlink20.PRECISION_LAND_MODE_ENUM_END = 3;
mavlink20.PARACHUTE_DISABLE = 0;
mavlink20.PARACHUTE_ENABLE = 1;
mavlink20.PARACHUTE_RELEASE = 2;
mavlink20.PARACHUTE_ACTION_ENUM_END = 3;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_UNKNOWN = 0;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED0 = 200;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED1 = 201;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED2 = 202;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED3 = 203;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED4 = 204;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED5 = 205;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED6 = 206;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED7 = 207;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED8 = 208;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED9 = 209;
mavlink20.MAV_TUNNEL_PAYLOAD_TYPE_ENUM_END = 210;
mavlink20.MAV_ODID_ID_TYPE_NONE = 0;
mavlink20.MAV_ODID_ID_TYPE_SERIAL_NUMBER = 1;
mavlink20.MAV_ODID_ID_TYPE_CAA_REGISTRATION_ID = 2;
mavlink20.MAV_ODID_ID_TYPE_UTM_ASSIGNED_UUID = 3;
mavlink20.MAV_ODID_ID_TYPE_SPECIFIC_SESSION_ID = 4;
mavlink20.MAV_ODID_ID_TYPE_ENUM_END = 5;
mavlink20.MAV_ODID_UA_TYPE_NONE = 0;
mavlink20.MAV_ODID_UA_TYPE_AEROPLANE = 1;
mavlink20.MAV_ODID_UA_TYPE_HELICOPTER_OR_MULTIROTOR = 2;
mavlink20.MAV_ODID_UA_TYPE_GYROPLANE = 3;
mavlink20.MAV_ODID_UA_TYPE_HYBRID_LIFT = 4;
mavlink20.MAV_ODID_UA_TYPE_ORNITHOPTER = 5;
mavlink20.MAV_ODID_UA_TYPE_GLIDER = 6;
mavlink20.MAV_ODID_UA_TYPE_KITE = 7;
mavlink20.MAV_ODID_UA_TYPE_FREE_BALLOON = 8;
mavlink20.MAV_ODID_UA_TYPE_CAPTIVE_BALLOON = 9;
mavlink20.MAV_ODID_UA_TYPE_AIRSHIP = 10;
mavlink20.MAV_ODID_UA_TYPE_FREE_FALL_PARACHUTE = 11;
mavlink20.MAV_ODID_UA_TYPE_ROCKET = 12;
mavlink20.MAV_ODID_UA_TYPE_TETHERED_POWERED_AIRCRAFT = 13;
mavlink20.MAV_ODID_UA_TYPE_GROUND_OBSTACLE = 14;
mavlink20.MAV_ODID_UA_TYPE_OTHER = 15;
mavlink20.MAV_ODID_UA_TYPE_ENUM_END = 16;
mavlink20.MAV_ODID_STATUS_UNDECLARED = 0;
mavlink20.MAV_ODID_STATUS_GROUND = 1;
mavlink20.MAV_ODID_STATUS_AIRBORNE = 2;
mavlink20.MAV_ODID_STATUS_EMERGENCY = 3;
mavlink20.MAV_ODID_STATUS_REMOTE_ID_SYSTEM_FAILURE = 4;
mavlink20.MAV_ODID_STATUS_ENUM_END = 5;
mavlink20.MAV_ODID_HEIGHT_REF_OVER_TAKEOFF = 0;
mavlink20.MAV_ODID_HEIGHT_REF_OVER_GROUND = 1;
mavlink20.MAV_ODID_HEIGHT_REF_ENUM_END = 2;
mavlink20.MAV_ODID_HOR_ACC_UNKNOWN = 0;
mavlink20.MAV_ODID_HOR_ACC_10NM = 1;
mavlink20.MAV_ODID_HOR_ACC_4NM = 2;
mavlink20.MAV_ODID_HOR_ACC_2NM = 3;
mavlink20.MAV_ODID_HOR_ACC_1NM = 4;
mavlink20.MAV_ODID_HOR_ACC_0_5NM = 5;
mavlink20.MAV_ODID_HOR_ACC_0_3NM = 6;
mavlink20.MAV_ODID_HOR_ACC_0_1NM = 7;
mavlink20.MAV_ODID_HOR_ACC_0_05NM = 8;
mavlink20.MAV_ODID_HOR_ACC_30_METER = 9;
mavlink20.MAV_ODID_HOR_ACC_10_METER = 10;
mavlink20.MAV_ODID_HOR_ACC_3_METER = 11;
mavlink20.MAV_ODID_HOR_ACC_1_METER = 12;
mavlink20.MAV_ODID_HOR_ACC_ENUM_END = 13;
mavlink20.MAV_ODID_VER_ACC_UNKNOWN = 0;
mavlink20.MAV_ODID_VER_ACC_150_METER = 1;
mavlink20.MAV_ODID_VER_ACC_45_METER = 2;
mavlink20.MAV_ODID_VER_ACC_25_METER = 3;
mavlink20.MAV_ODID_VER_ACC_10_METER = 4;
mavlink20.MAV_ODID_VER_ACC_3_METER = 5;
mavlink20.MAV_ODID_VER_ACC_1_METER = 6;
mavlink20.MAV_ODID_VER_ACC_ENUM_END = 7;
mavlink20.MAV_ODID_SPEED_ACC_UNKNOWN = 0;
mavlink20.MAV_ODID_SPEED_ACC_10_METERS_PER_SECOND = 1;
mavlink20.MAV_ODID_SPEED_ACC_3_METERS_PER_SECOND = 2;
mavlink20.MAV_ODID_SPEED_ACC_1_METERS_PER_SECOND = 3;
mavlink20.MAV_ODID_SPEED_ACC_0_3_METERS_PER_SECOND = 4;
mavlink20.MAV_ODID_SPEED_ACC_ENUM_END = 5;
mavlink20.MAV_ODID_TIME_ACC_UNKNOWN = 0;
mavlink20.MAV_ODID_TIME_ACC_0_1_SECOND = 1;
mavlink20.MAV_ODID_TIME_ACC_0_2_SECOND = 2;
mavlink20.MAV_ODID_TIME_ACC_0_3_SECOND = 3;
mavlink20.MAV_ODID_TIME_ACC_0_4_SECOND = 4;
mavlink20.MAV_ODID_TIME_ACC_0_5_SECOND = 5;
mavlink20.MAV_ODID_TIME_ACC_0_6_SECOND = 6;
mavlink20.MAV_ODID_TIME_ACC_0_7_SECOND = 7;
mavlink20.MAV_ODID_TIME_ACC_0_8_SECOND = 8;
mavlink20.MAV_ODID_TIME_ACC_0_9_SECOND = 9;
mavlink20.MAV_ODID_TIME_ACC_1_0_SECOND = 10;
mavlink20.MAV_ODID_TIME_ACC_1_1_SECOND = 11;
mavlink20.MAV_ODID_TIME_ACC_1_2_SECOND = 12;
mavlink20.MAV_ODID_TIME_ACC_1_3_SECOND = 13;
mavlink20.MAV_ODID_TIME_ACC_1_4_SECOND = 14;
mavlink20.MAV_ODID_TIME_ACC_1_5_SECOND = 15;
mavlink20.MAV_ODID_TIME_ACC_ENUM_END = 16;
mavlink20.MAV_ODID_AUTH_TYPE_NONE = 0;
mavlink20.MAV_ODID_AUTH_TYPE_UAS_ID_SIGNATURE = 1;
mavlink20.MAV_ODID_AUTH_TYPE_OPERATOR_ID_SIGNATURE = 2;
mavlink20.MAV_ODID_AUTH_TYPE_MESSAGE_SET_SIGNATURE = 3;
mavlink20.MAV_ODID_AUTH_TYPE_NETWORK_REMOTE_ID = 4;
mavlink20.MAV_ODID_AUTH_TYPE_SPECIFIC_AUTHENTICATION = 5;
mavlink20.MAV_ODID_AUTH_TYPE_ENUM_END = 6;
mavlink20.MAV_ODID_DESC_TYPE_TEXT = 0;
mavlink20.MAV_ODID_DESC_TYPE_EMERGENCY = 1;
mavlink20.MAV_ODID_DESC_TYPE_EXTENDED_STATUS = 2;
mavlink20.MAV_ODID_DESC_TYPE_ENUM_END = 3;
mavlink20.MAV_ODID_OPERATOR_LOCATION_TYPE_TAKEOFF = 0;
mavlink20.MAV_ODID_OPERATOR_LOCATION_TYPE_LIVE_GNSS = 1;
mavlink20.MAV_ODID_OPERATOR_LOCATION_TYPE_FIXED = 2;
mavlink20.MAV_ODID_OPERATOR_LOCATION_TYPE_ENUM_END = 3;
mavlink20.MAV_ODID_CLASSIFICATION_TYPE_UNDECLARED = 0;
mavlink20.MAV_ODID_CLASSIFICATION_TYPE_EU = 1;
mavlink20.MAV_ODID_CLASSIFICATION_TYPE_ENUM_END = 2;
mavlink20.MAV_ODID_CATEGORY_EU_UNDECLARED = 0;
mavlink20.MAV_ODID_CATEGORY_EU_OPEN = 1;
mavlink20.MAV_ODID_CATEGORY_EU_SPECIFIC = 2;
mavlink20.MAV_ODID_CATEGORY_EU_CERTIFIED = 3;
mavlink20.MAV_ODID_CATEGORY_EU_ENUM_END = 4;
mavlink20.MAV_ODID_CLASS_EU_UNDECLARED = 0;
mavlink20.MAV_ODID_CLASS_EU_CLASS_0 = 1;
mavlink20.MAV_ODID_CLASS_EU_CLASS_1 = 2;
mavlink20.MAV_ODID_CLASS_EU_CLASS_2 = 3;
mavlink20.MAV_ODID_CLASS_EU_CLASS_3 = 4;
mavlink20.MAV_ODID_CLASS_EU_CLASS_4 = 5;
mavlink20.MAV_ODID_CLASS_EU_CLASS_5 = 6;
mavlink20.MAV_ODID_CLASS_EU_CLASS_6 = 7;
mavlink20.MAV_ODID_CLASS_EU_ENUM_END = 8;
mavlink20.MAV_ODID_OPERATOR_ID_TYPE_CAA = 0;
mavlink20.MAV_ODID_OPERATOR_ID_TYPE_ENUM_END = 1;
mavlink20.MAV_ODID_ARM_STATUS_GOOD_TO_ARM = 0;
mavlink20.MAV_ODID_ARM_STATUS_PRE_ARM_FAIL_GENERIC = 1;
mavlink20.MAV_ODID_ARM_STATUS_ENUM_END = 2;
mavlink20.AIS_TYPE_UNKNOWN = 0;
mavlink20.AIS_TYPE_RESERVED_1 = 1;
mavlink20.AIS_TYPE_RESERVED_2 = 2;
mavlink20.AIS_TYPE_RESERVED_3 = 3;
mavlink20.AIS_TYPE_RESERVED_4 = 4;
mavlink20.AIS_TYPE_RESERVED_5 = 5;
mavlink20.AIS_TYPE_RESERVED_6 = 6;
mavlink20.AIS_TYPE_RESERVED_7 = 7;
mavlink20.AIS_TYPE_RESERVED_8 = 8;
mavlink20.AIS_TYPE_RESERVED_9 = 9;
mavlink20.AIS_TYPE_RESERVED_10 = 10;
mavlink20.AIS_TYPE_RESERVED_11 = 11;
mavlink20.AIS_TYPE_RESERVED_12 = 12;
mavlink20.AIS_TYPE_RESERVED_13 = 13;
mavlink20.AIS_TYPE_RESERVED_14 = 14;
mavlink20.AIS_TYPE_RESERVED_15 = 15;
mavlink20.AIS_TYPE_RESERVED_16 = 16;
mavlink20.AIS_TYPE_RESERVED_17 = 17;
mavlink20.AIS_TYPE_RESERVED_18 = 18;
mavlink20.AIS_TYPE_RESERVED_19 = 19;
mavlink20.AIS_TYPE_WIG = 20;
mavlink20.AIS_TYPE_WIG_HAZARDOUS_A = 21;
mavlink20.AIS_TYPE_WIG_HAZARDOUS_B = 22;
mavlink20.AIS_TYPE_WIG_HAZARDOUS_C = 23;
mavlink20.AIS_TYPE_WIG_HAZARDOUS_D = 24;
mavlink20.AIS_TYPE_WIG_RESERVED_1 = 25;
mavlink20.AIS_TYPE_WIG_RESERVED_2 = 26;
mavlink20.AIS_TYPE_WIG_RESERVED_3 = 27;
mavlink20.AIS_TYPE_WIG_RESERVED_4 = 28;
mavlink20.AIS_TYPE_WIG_RESERVED_5 = 29;
mavlink20.AIS_TYPE_FISHING = 30;
mavlink20.AIS_TYPE_TOWING = 31;
mavlink20.AIS_TYPE_TOWING_LARGE = 32;
mavlink20.AIS_TYPE_DREDGING = 33;
mavlink20.AIS_TYPE_DIVING = 34;
mavlink20.AIS_TYPE_MILITARY = 35;
mavlink20.AIS_TYPE_SAILING = 36;
mavlink20.AIS_TYPE_PLEASURE = 37;
mavlink20.AIS_TYPE_RESERVED_20 = 38;
mavlink20.AIS_TYPE_RESERVED_21 = 39;
mavlink20.AIS_TYPE_HSC = 40;
mavlink20.AIS_TYPE_HSC_HAZARDOUS_A = 41;
mavlink20.AIS_TYPE_HSC_HAZARDOUS_B = 42;
mavlink20.AIS_TYPE_HSC_HAZARDOUS_C = 43;
mavlink20.AIS_TYPE_HSC_HAZARDOUS_D = 44;
mavlink20.AIS_TYPE_HSC_RESERVED_1 = 45;
mavlink20.AIS_TYPE_HSC_RESERVED_2 = 46;
mavlink20.AIS_TYPE_HSC_RESERVED_3 = 47;
mavlink20.AIS_TYPE_HSC_RESERVED_4 = 48;
mavlink20.AIS_TYPE_HSC_UNKNOWN = 49;
mavlink20.AIS_TYPE_PILOT = 50;
mavlink20.AIS_TYPE_SAR = 51;
mavlink20.AIS_TYPE_TUG = 52;
mavlink20.AIS_TYPE_PORT_TENDER = 53;
mavlink20.AIS_TYPE_ANTI_POLLUTION = 54;
mavlink20.AIS_TYPE_LAW_ENFORCEMENT = 55;
mavlink20.AIS_TYPE_SPARE_LOCAL_1 = 56;
mavlink20.AIS_TYPE_SPARE_LOCAL_2 = 57;
mavlink20.AIS_TYPE_MEDICAL_TRANSPORT = 58;
mavlink20.AIS_TYPE_NONECOMBATANT = 59;
mavlink20.AIS_TYPE_PASSENGER = 60;
mavlink20.AIS_TYPE_PASSENGER_HAZARDOUS_A = 61;
mavlink20.AIS_TYPE_PASSENGER_HAZARDOUS_B = 62;
mavlink20.AIS_TYPE_AIS_TYPE_PASSENGER_HAZARDOUS_C = 63;
mavlink20.AIS_TYPE_PASSENGER_HAZARDOUS_D = 64;
mavlink20.AIS_TYPE_PASSENGER_RESERVED_1 = 65;
mavlink20.AIS_TYPE_PASSENGER_RESERVED_2 = 66;
mavlink20.AIS_TYPE_PASSENGER_RESERVED_3 = 67;
mavlink20.AIS_TYPE_AIS_TYPE_PASSENGER_RESERVED_4 = 68;
mavlink20.AIS_TYPE_PASSENGER_UNKNOWN = 69;
mavlink20.AIS_TYPE_CARGO = 70;
mavlink20.AIS_TYPE_CARGO_HAZARDOUS_A = 71;
mavlink20.AIS_TYPE_CARGO_HAZARDOUS_B = 72;
mavlink20.AIS_TYPE_CARGO_HAZARDOUS_C = 73;
mavlink20.AIS_TYPE_CARGO_HAZARDOUS_D = 74;
mavlink20.AIS_TYPE_CARGO_RESERVED_1 = 75;
mavlink20.AIS_TYPE_CARGO_RESERVED_2 = 76;
mavlink20.AIS_TYPE_CARGO_RESERVED_3 = 77;
mavlink20.AIS_TYPE_CARGO_RESERVED_4 = 78;
mavlink20.AIS_TYPE_CARGO_UNKNOWN = 79;
mavlink20.AIS_TYPE_TANKER = 80;
mavlink20.AIS_TYPE_TANKER_HAZARDOUS_A = 81;
mavlink20.AIS_TYPE_TANKER_HAZARDOUS_B = 82;
mavlink20.AIS_TYPE_TANKER_HAZARDOUS_C = 83;
mavlink20.AIS_TYPE_TANKER_HAZARDOUS_D = 84;
mavlink20.AIS_TYPE_TANKER_RESERVED_1 = 85;
mavlink20.AIS_TYPE_TANKER_RESERVED_2 = 86;
mavlink20.AIS_TYPE_TANKER_RESERVED_3 = 87;
mavlink20.AIS_TYPE_TANKER_RESERVED_4 = 88;
mavlink20.AIS_TYPE_TANKER_UNKNOWN = 89;
mavlink20.AIS_TYPE_OTHER = 90;
mavlink20.AIS_TYPE_OTHER_HAZARDOUS_A = 91;
mavlink20.AIS_TYPE_OTHER_HAZARDOUS_B = 92;
mavlink20.AIS_TYPE_OTHER_HAZARDOUS_C = 93;
mavlink20.AIS_TYPE_OTHER_HAZARDOUS_D = 94;
mavlink20.AIS_TYPE_OTHER_RESERVED_1 = 95;
mavlink20.AIS_TYPE_OTHER_RESERVED_2 = 96;
mavlink20.AIS_TYPE_OTHER_RESERVED_3 = 97;
mavlink20.AIS_TYPE_OTHER_RESERVED_4 = 98;
mavlink20.AIS_TYPE_OTHER_UNKNOWN = 99;
mavlink20.AIS_TYPE_ENUM_END = 100;
mavlink20.UNDER_WAY = 0;
mavlink20.AIS_NAV_ANCHORED = 1;
mavlink20.AIS_NAV_UN_COMMANDED = 2;
mavlink20.AIS_NAV_RESTRICTED_MANOEUVERABILITY = 3;
mavlink20.AIS_NAV_DRAUGHT_CONSTRAINED = 4;
mavlink20.AIS_NAV_MOORED = 5;
mavlink20.AIS_NAV_AGROUND = 6;
mavlink20.AIS_NAV_FISHING = 7;
mavlink20.AIS_NAV_SAILING = 8;
mavlink20.AIS_NAV_RESERVED_HSC = 9;
mavlink20.AIS_NAV_RESERVED_WIG = 10;
mavlink20.AIS_NAV_RESERVED_1 = 11;
mavlink20.AIS_NAV_RESERVED_2 = 12;
mavlink20.AIS_NAV_RESERVED_3 = 13;
mavlink20.AIS_NAV_AIS_SART = 14;
mavlink20.AIS_NAV_UNKNOWN = 15;
mavlink20.AIS_NAV_STATUS_ENUM_END = 16;
mavlink20.AIS_FLAGS_POSITION_ACCURACY = 1;
mavlink20.AIS_FLAGS_VALID_COG = 2;
mavlink20.AIS_FLAGS_VALID_VELOCITY = 4;
mavlink20.AIS_FLAGS_HIGH_VELOCITY = 8;
mavlink20.AIS_FLAGS_VALID_TURN_RATE = 16;
mavlink20.AIS_FLAGS_TURN_RATE_SIGN_ONLY = 32;
mavlink20.AIS_FLAGS_VALID_DIMENSIONS = 64;
mavlink20.AIS_FLAGS_LARGE_BOW_DIMENSION = 128;
mavlink20.AIS_FLAGS_LARGE_STERN_DIMENSION = 256;
mavlink20.AIS_FLAGS_LARGE_PORT_DIMENSION = 512;
mavlink20.AIS_FLAGS_LARGE_STARBOARD_DIMENSION = 1024;
mavlink20.AIS_FLAGS_VALID_CALLSIGN = 2048;
mavlink20.AIS_FLAGS_VALID_NAME = 4096;
mavlink20.AIS_FLAGS_ENUM_END = 4097;
mavlink20.MAV_WINCH_STATUS_HEALTHY = 1;
mavlink20.MAV_WINCH_STATUS_FULLY_RETRACTED = 2;
mavlink20.MAV_WINCH_STATUS_MOVING = 4;
mavlink20.MAV_WINCH_STATUS_CLUTCH_ENGAGED = 8;
mavlink20.MAV_WINCH_STATUS_FLAG_ENUM_END = 9;
mavlink20.MAG_CAL_NOT_STARTED = 0;
mavlink20.MAG_CAL_WAITING_TO_START = 1;
mavlink20.MAG_CAL_RUNNING_STEP_ONE = 2;
mavlink20.MAG_CAL_RUNNING_STEP_TWO = 3;
mavlink20.MAG_CAL_SUCCESS = 4;
mavlink20.MAG_CAL_FAILED = 5;
mavlink20.MAG_CAL_BAD_ORIENTATION = 6;
mavlink20.MAG_CAL_BAD_RADIUS = 7;
mavlink20.MAG_CAL_STATUS_ENUM_END = 8;
mavlink20.CAN_FILTER_REPLACE = 0;
mavlink20.CAN_FILTER_ADD = 1;
mavlink20.CAN_FILTER_REMOVE = 2;
mavlink20.CAN_FILTER_OP_ENUM_END = 3;
mavlink20.NAV_VTOL_LAND_OPTIONS_DEFAULT = 0;
mavlink20.NAV_VTOL_LAND_OPTIONS_FW_SPIRAL_APPROACH = 1;
mavlink20.NAV_VTOL_LAND_OPTIONS_FW_APPROACH = 2;
mavlink20.NAV_VTOL_LAND_OPTIONS_ENUM_END = 3;
mavlink20.MISSION_STATE_UNKNOWN = 0;
mavlink20.MISSION_STATE_NO_MISSION = 1;
mavlink20.MISSION_STATE_NOT_STARTED = 2;
mavlink20.MISSION_STATE_ACTIVE = 3;
mavlink20.MISSION_STATE_PAUSED = 4;
mavlink20.MISSION_STATE_COMPLETE = 5;
mavlink20.MISSION_STATE_ENUM_END = 6;
mavlink20.SAFETY_SWITCH_STATE_SAFE = 0;
mavlink20.SAFETY_SWITCH_STATE_DANGEROUS = 1;
mavlink20.SAFETY_SWITCH_STATE_ENUM_END = 2;
mavlink20.AIRSPEED_SENSOR_UNHEALTHY = 0;
mavlink20.AIRSPEED_SENSOR_USING = 1;
mavlink20.AIRSPEED_SENSOR_FLAGS_ENUM_END = 2;
mavlink20.RADIO_RC_CHANNELS_FLAGS_FAILSAFE = 1;
mavlink20.RADIO_RC_CHANNELS_FLAGS_OUTDATED = 2;
mavlink20.RADIO_RC_CHANNELS_FLAGS_ENUM_END = 3;
mavlink20.ICAROUS_TRACK_BAND_TYPE_NONE = 0;
mavlink20.ICAROUS_TRACK_BAND_TYPE_NEAR = 1;
mavlink20.ICAROUS_TRACK_BAND_TYPE_RECOVERY = 2;
mavlink20.ICAROUS_TRACK_BAND_TYPES_ENUM_END = 3;
mavlink20.ICAROUS_FMS_STATE_IDLE = 0;
mavlink20.ICAROUS_FMS_STATE_TAKEOFF = 1;
mavlink20.ICAROUS_FMS_STATE_CLIMB = 2;
mavlink20.ICAROUS_FMS_STATE_CRUISE = 3;
mavlink20.ICAROUS_FMS_STATE_APPROACH = 4;
mavlink20.ICAROUS_FMS_STATE_LAND = 5;
mavlink20.ICAROUS_FMS_STATE_ENUM_END = 6;
mavlink20.MAV_AUTOPILOT_GENERIC = 0;
mavlink20.MAV_AUTOPILOT_RESERVED = 1;
mavlink20.MAV_AUTOPILOT_SLUGS = 2;
mavlink20.MAV_AUTOPILOT_ARDUPILOTMEGA = 3;
mavlink20.MAV_AUTOPILOT_OPENPILOT = 4;
mavlink20.MAV_AUTOPILOT_GENERIC_WAYPOINTS_ONLY = 5;
mavlink20.MAV_AUTOPILOT_GENERIC_WAYPOINTS_AND_SIMPLE_NAVIGATION_ONLY = 6;
mavlink20.MAV_AUTOPILOT_GENERIC_MISSION_FULL = 7;
mavlink20.MAV_AUTOPILOT_INVALID = 8;
mavlink20.MAV_AUTOPILOT_PPZ = 9;
mavlink20.MAV_AUTOPILOT_UDB = 10;
mavlink20.MAV_AUTOPILOT_FP = 11;
mavlink20.MAV_AUTOPILOT_PX4 = 12;
mavlink20.MAV_AUTOPILOT_SMACCMPILOT = 13;
mavlink20.MAV_AUTOPILOT_AUTOQUAD = 14;
mavlink20.MAV_AUTOPILOT_ARMAZILA = 15;
mavlink20.MAV_AUTOPILOT_AEROB = 16;
mavlink20.MAV_AUTOPILOT_ASLUAV = 17;
mavlink20.MAV_AUTOPILOT_SMARTAP = 18;
mavlink20.MAV_AUTOPILOT_AIRRAILS = 19;
mavlink20.MAV_AUTOPILOT_REFLEX = 20;
mavlink20.MAV_AUTOPILOT_ENUM_END = 21;
mavlink20.MAV_TYPE_GENERIC = 0;
mavlink20.MAV_TYPE_FIXED_WING = 1;
mavlink20.MAV_TYPE_QUADROTOR = 2;
mavlink20.MAV_TYPE_COAXIAL = 3;
mavlink20.MAV_TYPE_HELICOPTER = 4;
mavlink20.MAV_TYPE_ANTENNA_TRACKER = 5;
mavlink20.MAV_TYPE_GCS = 6;
mavlink20.MAV_TYPE_AIRSHIP = 7;
mavlink20.MAV_TYPE_FREE_BALLOON = 8;
mavlink20.MAV_TYPE_ROCKET = 9;
mavlink20.MAV_TYPE_GROUND_ROVER = 10;
mavlink20.MAV_TYPE_SURFACE_BOAT = 11;
mavlink20.MAV_TYPE_SUBMARINE = 12;
mavlink20.MAV_TYPE_HEXAROTOR = 13;
mavlink20.MAV_TYPE_OCTOROTOR = 14;
mavlink20.MAV_TYPE_TRICOPTER = 15;
mavlink20.MAV_TYPE_FLAPPING_WING = 16;
mavlink20.MAV_TYPE_KITE = 17;
mavlink20.MAV_TYPE_ONBOARD_CONTROLLER = 18;
mavlink20.MAV_TYPE_VTOL_DUOROTOR = 19;
mavlink20.MAV_TYPE_VTOL_QUADROTOR = 20;
mavlink20.MAV_TYPE_VTOL_TILTROTOR = 21;
mavlink20.MAV_TYPE_VTOL_RESERVED2 = 22;
mavlink20.MAV_TYPE_VTOL_RESERVED3 = 23;
mavlink20.MAV_TYPE_VTOL_RESERVED4 = 24;
mavlink20.MAV_TYPE_VTOL_RESERVED5 = 25;
mavlink20.MAV_TYPE_GIMBAL = 26;
mavlink20.MAV_TYPE_ADSB = 27;
mavlink20.MAV_TYPE_PARAFOIL = 28;
mavlink20.MAV_TYPE_DODECAROTOR = 29;
mavlink20.MAV_TYPE_CAMERA = 30;
mavlink20.MAV_TYPE_CHARGING_STATION = 31;
mavlink20.MAV_TYPE_FLARM = 32;
mavlink20.MAV_TYPE_SERVO = 33;
mavlink20.MAV_TYPE_ODID = 34;
mavlink20.MAV_TYPE_DECAROTOR = 35;
mavlink20.MAV_TYPE_BATTERY = 36;
mavlink20.MAV_TYPE_PARACHUTE = 37;
mavlink20.MAV_TYPE_LOG = 38;
mavlink20.MAV_TYPE_OSD = 39;
mavlink20.MAV_TYPE_IMU = 40;
mavlink20.MAV_TYPE_GPS = 41;
mavlink20.MAV_TYPE_WINCH = 42;
mavlink20.MAV_TYPE_ENUM_END = 43;
mavlink20.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED = 1;
mavlink20.MAV_MODE_FLAG_TEST_ENABLED = 2;
mavlink20.MAV_MODE_FLAG_AUTO_ENABLED = 4;
mavlink20.MAV_MODE_FLAG_GUIDED_ENABLED = 8;
mavlink20.MAV_MODE_FLAG_STABILIZE_ENABLED = 16;
mavlink20.MAV_MODE_FLAG_HIL_ENABLED = 32;
mavlink20.MAV_MODE_FLAG_MANUAL_INPUT_ENABLED = 64;
mavlink20.MAV_MODE_FLAG_SAFETY_ARMED = 128;
mavlink20.MAV_MODE_FLAG_ENUM_END = 129;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_CUSTOM_MODE = 1;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_TEST = 2;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_AUTO = 4;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_GUIDED = 8;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_STABILIZE = 16;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_HIL = 32;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_MANUAL = 64;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_SAFETY = 128;
mavlink20.MAV_MODE_FLAG_DECODE_POSITION_ENUM_END = 129;
mavlink20.MAV_STATE_UNINIT = 0;
mavlink20.MAV_STATE_BOOT = 1;
mavlink20.MAV_STATE_CALIBRATING = 2;
mavlink20.MAV_STATE_STANDBY = 3;
mavlink20.MAV_STATE_ACTIVE = 4;
mavlink20.MAV_STATE_CRITICAL = 5;
mavlink20.MAV_STATE_EMERGENCY = 6;
mavlink20.MAV_STATE_POWEROFF = 7;
mavlink20.MAV_STATE_FLIGHT_TERMINATION = 8;
mavlink20.MAV_STATE_ENUM_END = 9;
mavlink20.MAV_COMP_ID_ALL = 0;
mavlink20.MAV_COMP_ID_AUTOPILOT1 = 1;
mavlink20.MAV_COMP_ID_USER1 = 25;
mavlink20.MAV_COMP_ID_USER2 = 26;
mavlink20.MAV_COMP_ID_USER3 = 27;
mavlink20.MAV_COMP_ID_USER4 = 28;
mavlink20.MAV_COMP_ID_USER5 = 29;
mavlink20.MAV_COMP_ID_USER6 = 30;
mavlink20.MAV_COMP_ID_USER7 = 31;
mavlink20.MAV_COMP_ID_USER8 = 32;
mavlink20.MAV_COMP_ID_USER9 = 33;
mavlink20.MAV_COMP_ID_USER10 = 34;
mavlink20.MAV_COMP_ID_USER11 = 35;
mavlink20.MAV_COMP_ID_USER12 = 36;
mavlink20.MAV_COMP_ID_USER13 = 37;
mavlink20.MAV_COMP_ID_USER14 = 38;
mavlink20.MAV_COMP_ID_USER15 = 39;
mavlink20.MAV_COMP_ID_USER16 = 40;
mavlink20.MAV_COMP_ID_USER17 = 41;
mavlink20.MAV_COMP_ID_USER18 = 42;
mavlink20.MAV_COMP_ID_USER19 = 43;
mavlink20.MAV_COMP_ID_USER20 = 44;
mavlink20.MAV_COMP_ID_USER21 = 45;
mavlink20.MAV_COMP_ID_USER22 = 46;
mavlink20.MAV_COMP_ID_USER23 = 47;
mavlink20.MAV_COMP_ID_USER24 = 48;
mavlink20.MAV_COMP_ID_USER25 = 49;
mavlink20.MAV_COMP_ID_USER26 = 50;
mavlink20.MAV_COMP_ID_USER27 = 51;
mavlink20.MAV_COMP_ID_USER28 = 52;
mavlink20.MAV_COMP_ID_USER29 = 53;
mavlink20.MAV_COMP_ID_USER30 = 54;
mavlink20.MAV_COMP_ID_USER31 = 55;
mavlink20.MAV_COMP_ID_USER32 = 56;
mavlink20.MAV_COMP_ID_USER33 = 57;
mavlink20.MAV_COMP_ID_USER34 = 58;
mavlink20.MAV_COMP_ID_USER35 = 59;
mavlink20.MAV_COMP_ID_USER36 = 60;
mavlink20.MAV_COMP_ID_USER37 = 61;
mavlink20.MAV_COMP_ID_USER38 = 62;
mavlink20.MAV_COMP_ID_USER39 = 63;
mavlink20.MAV_COMP_ID_USER40 = 64;
mavlink20.MAV_COMP_ID_USER41 = 65;
mavlink20.MAV_COMP_ID_USER42 = 66;
mavlink20.MAV_COMP_ID_USER43 = 67;
mavlink20.MAV_COMP_ID_TELEMETRY_RADIO = 68;
mavlink20.MAV_COMP_ID_USER45 = 69;
mavlink20.MAV_COMP_ID_USER46 = 70;
mavlink20.MAV_COMP_ID_USER47 = 71;
mavlink20.MAV_COMP_ID_USER48 = 72;
mavlink20.MAV_COMP_ID_USER49 = 73;
mavlink20.MAV_COMP_ID_USER50 = 74;
mavlink20.MAV_COMP_ID_USER51 = 75;
mavlink20.MAV_COMP_ID_USER52 = 76;
mavlink20.MAV_COMP_ID_USER53 = 77;
mavlink20.MAV_COMP_ID_USER54 = 78;
mavlink20.MAV_COMP_ID_USER55 = 79;
mavlink20.MAV_COMP_ID_USER56 = 80;
mavlink20.MAV_COMP_ID_USER57 = 81;
mavlink20.MAV_COMP_ID_USER58 = 82;
mavlink20.MAV_COMP_ID_USER59 = 83;
mavlink20.MAV_COMP_ID_USER60 = 84;
mavlink20.MAV_COMP_ID_USER61 = 85;
mavlink20.MAV_COMP_ID_USER62 = 86;
mavlink20.MAV_COMP_ID_USER63 = 87;
mavlink20.MAV_COMP_ID_USER64 = 88;
mavlink20.MAV_COMP_ID_USER65 = 89;
mavlink20.MAV_COMP_ID_USER66 = 90;
mavlink20.MAV_COMP_ID_USER67 = 91;
mavlink20.MAV_COMP_ID_USER68 = 92;
mavlink20.MAV_COMP_ID_USER69 = 93;
mavlink20.MAV_COMP_ID_USER70 = 94;
mavlink20.MAV_COMP_ID_USER71 = 95;
mavlink20.MAV_COMP_ID_USER72 = 96;
mavlink20.MAV_COMP_ID_USER73 = 97;
mavlink20.MAV_COMP_ID_USER74 = 98;
mavlink20.MAV_COMP_ID_USER75 = 99;
mavlink20.MAV_COMP_ID_CAMERA = 100;
mavlink20.MAV_COMP_ID_CAMERA2 = 101;
mavlink20.MAV_COMP_ID_CAMERA3 = 102;
mavlink20.MAV_COMP_ID_CAMERA4 = 103;
mavlink20.MAV_COMP_ID_CAMERA5 = 104;
mavlink20.MAV_COMP_ID_CAMERA6 = 105;
mavlink20.MAV_COMP_ID_SERVO1 = 140;
mavlink20.MAV_COMP_ID_SERVO2 = 141;
mavlink20.MAV_COMP_ID_SERVO3 = 142;
mavlink20.MAV_COMP_ID_SERVO4 = 143;
mavlink20.MAV_COMP_ID_SERVO5 = 144;
mavlink20.MAV_COMP_ID_SERVO6 = 145;
mavlink20.MAV_COMP_ID_SERVO7 = 146;
mavlink20.MAV_COMP_ID_SERVO8 = 147;
mavlink20.MAV_COMP_ID_SERVO9 = 148;
mavlink20.MAV_COMP_ID_SERVO10 = 149;
mavlink20.MAV_COMP_ID_SERVO11 = 150;
mavlink20.MAV_COMP_ID_SERVO12 = 151;
mavlink20.MAV_COMP_ID_SERVO13 = 152;
mavlink20.MAV_COMP_ID_SERVO14 = 153;
mavlink20.MAV_COMP_ID_GIMBAL = 154;
mavlink20.MAV_COMP_ID_LOG = 155;
mavlink20.MAV_COMP_ID_ADSB = 156;
mavlink20.MAV_COMP_ID_OSD = 157;
mavlink20.MAV_COMP_ID_PERIPHERAL = 158;
mavlink20.MAV_COMP_ID_QX1_GIMBAL = 159;
mavlink20.MAV_COMP_ID_FLARM = 160;
mavlink20.MAV_COMP_ID_PARACHUTE = 161;
mavlink20.MAV_COMP_ID_GIMBAL2 = 171;
mavlink20.MAV_COMP_ID_GIMBAL3 = 172;
mavlink20.MAV_COMP_ID_GIMBAL4 = 173;
mavlink20.MAV_COMP_ID_GIMBAL5 = 174;
mavlink20.MAV_COMP_ID_GIMBAL6 = 175;
mavlink20.MAV_COMP_ID_BATTERY = 180;
mavlink20.MAV_COMP_ID_BATTERY2 = 181;
mavlink20.MAV_COMP_ID_MAVCAN = 189;
mavlink20.MAV_COMP_ID_MISSIONPLANNER = 190;
mavlink20.MAV_COMP_ID_ONBOARD_COMPUTER = 191;
mavlink20.MAV_COMP_ID_ONBOARD_COMPUTER2 = 192;
mavlink20.MAV_COMP_ID_ONBOARD_COMPUTER3 = 193;
mavlink20.MAV_COMP_ID_ONBOARD_COMPUTER4 = 194;
mavlink20.MAV_COMP_ID_PATHPLANNER = 195;
mavlink20.MAV_COMP_ID_OBSTACLE_AVOIDANCE = 196;
mavlink20.MAV_COMP_ID_VISUAL_INERTIAL_ODOMETRY = 197;
mavlink20.MAV_COMP_ID_PAIRING_MANAGER = 198;
mavlink20.MAV_COMP_ID_IMU = 200;
mavlink20.MAV_COMP_ID_IMU_2 = 201;
mavlink20.MAV_COMP_ID_IMU_3 = 202;
mavlink20.MAV_COMP_ID_GPS = 220;
mavlink20.MAV_COMP_ID_GPS2 = 221;
mavlink20.MAV_COMP_ID_ODID_TXRX_1 = 236;
mavlink20.MAV_COMP_ID_ODID_TXRX_2 = 237;
mavlink20.MAV_COMP_ID_ODID_TXRX_3 = 238;
mavlink20.MAV_COMP_ID_UDP_BRIDGE = 240;
mavlink20.MAV_COMP_ID_UART_BRIDGE = 241;
mavlink20.MAV_COMP_ID_TUNNEL_NODE = 242;
mavlink20.MAV_COMP_ID_SYSTEM_CONTROL = 250;
mavlink20.MAV_COMPONENT_ENUM_END = 251;
mavlink20.MODE_MANUAL_DIRECT = 1;
mavlink20.MODE_MANUAL_SCALED = 2;
mavlink20.MODE_AUTO_PID_ATT = 3;
mavlink20.MODE_AUTO_PID_VEL = 4;
mavlink20.MODE_AUTO_PID_POS = 5;
mavlink20.UALBERTA_AUTOPILOT_MODE_ENUM_END = 6;
mavlink20.NAV_AHRS_INIT = 1;
mavlink20.NAV_AHRS = 2;
mavlink20.NAV_INS_GPS_INIT = 3;
mavlink20.NAV_INS_GPS = 4;
mavlink20.UALBERTA_NAV_MODE_ENUM_END = 5;
mavlink20.PILOT_MANUAL = 1;
mavlink20.PILOT_AUTO = 2;
mavlink20.PILOT_ROTO = 3;
mavlink20.UALBERTA_PILOT_MODE_ENUM_END = 4;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_INTENT_CHANGE = 1;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_AUTOPILOT_ENABLED = 2;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_NICBARO_CROSSCHECKED = 4;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_ON_GROUND = 8;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_IDENT = 16;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_STATE_ENUM_END = 17;
mavlink20.UAVIONIX_ADSB_OUT_RF_SELECT_STANDBY = 0;
mavlink20.UAVIONIX_ADSB_OUT_RF_SELECT_RX_ENABLED = 1;
mavlink20.UAVIONIX_ADSB_OUT_RF_SELECT_TX_ENABLED = 2;
mavlink20.UAVIONIX_ADSB_OUT_RF_SELECT_ENUM_END = 3;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_NONE_0 = 0;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_NONE_1 = 1;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_2D = 2;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_3D = 3;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_DGPS = 4;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_RTK = 5;
mavlink20.UAVIONIX_ADSB_OUT_DYNAMIC_GPS_FIX_ENUM_END = 6;
mavlink20.UAVIONIX_ADSB_RF_HEALTH_INITIALIZING = 0;
mavlink20.UAVIONIX_ADSB_RF_HEALTH_OK = 1;
mavlink20.UAVIONIX_ADSB_RF_HEALTH_FAIL_TX = 2;
mavlink20.UAVIONIX_ADSB_RF_HEALTH_FAIL_RX = 16;
mavlink20.UAVIONIX_ADSB_RF_HEALTH_ENUM_END = 17;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_NO_DATA = 0;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L15M_W23M = 1;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L25M_W28P5M = 2;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L25_34M = 3;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L35_33M = 4;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L35_38M = 5;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L45_39P5M = 6;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L45_45M = 7;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L55_45M = 8;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L55_52M = 9;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L65_59P5M = 10;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L65_67M = 11;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L75_W72P5M = 12;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L75_W80M = 13;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L85_W80M = 14;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_L85_W90M = 15;
mavlink20.UAVIONIX_ADSB_OUT_CFG_AIRCRAFT_SIZE_ENUM_END = 16;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_NO_DATA = 0;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_LEFT_2M = 1;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_LEFT_4M = 2;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_LEFT_6M = 3;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_RIGHT_0M = 4;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_RIGHT_2M = 5;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_RIGHT_4M = 6;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_RIGHT_6M = 7;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LAT_ENUM_END = 8;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LON_NO_DATA = 0;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LON_APPLIED_BY_SENSOR = 1;
mavlink20.UAVIONIX_ADSB_OUT_CFG_GPS_OFFSET_LON_ENUM_END = 2;
mavlink20.UAVIONIX_ADSB_OUT_NO_EMERGENCY = 0;
mavlink20.UAVIONIX_ADSB_OUT_GENERAL_EMERGENCY = 1;
mavlink20.UAVIONIX_ADSB_OUT_LIFEGUARD_EMERGENCY = 2;
mavlink20.UAVIONIX_ADSB_OUT_MINIMUM_FUEL_EMERGENCY = 3;
mavlink20.UAVIONIX_ADSB_OUT_NO_COMM_EMERGENCY = 4;
mavlink20.UAVIONIX_ADSB_OUT_UNLAWFUL_INTERFERANCE_EMERGENCY = 5;
mavlink20.UAVIONIX_ADSB_OUT_DOWNED_AIRCRAFT_EMERGENCY = 6;
mavlink20.UAVIONIX_ADSB_OUT_RESERVED = 7;
mavlink20.UAVIONIX_ADSB_EMERGENCY_STATUS_ENUM_END = 8;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_EXTERNAL_BARO_CROSSCHECKED = 1;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_ON_GROUND = 4;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_IDENT_BUTTON_ACTIVE = 8;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_MODE_A_ENABLED = 16;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_MODE_C_ENABLED = 32;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_MODE_S_ENABLED = 64;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_1090ES_TX_ENABLED = 128;
mavlink20.UAVIONIX_ADSB_OUT_CONTROL_STATE_ENUM_END = 129;
mavlink20.UAVIONIX_ADSB_XBIT_ENABLED = 128;
mavlink20.UAVIONIX_ADSB_XBIT_ENUM_END = 129;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_ON_GROUND = 1;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_INTERROGATED_SINCE_LAST = 2;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_XBIT_ENABLED = 4;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_IDENT_ACTIVE = 8;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_MODE_A_ENABLED = 16;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_MODE_C_ENABLED = 32;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_MODE_S_ENABLED = 64;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_1090ES_TX_ENABLED = 128;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_STATE_ENUM_END = 129;
mavlink20.UAVIONIX_ADSB_NIC_CR_20_NM = 1;
mavlink20.UAVIONIX_ADSB_NIC_CR_8_NM = 2;
mavlink20.UAVIONIX_ADSB_NIC_CR_4_NM = 3;
mavlink20.UAVIONIX_ADSB_NIC_CR_2_NM = 4;
mavlink20.UAVIONIX_ADSB_NIC_CR_1_NM = 5;
mavlink20.UAVIONIX_ADSB_NIC_CR_0_3_NM = 6;
mavlink20.UAVIONIX_ADSB_NIC_CR_0_2_NM = 7;
mavlink20.UAVIONIX_ADSB_NIC_CR_0_1_NM = 8;
mavlink20.UAVIONIX_ADSB_NIC_CR_75_M = 9;
mavlink20.UAVIONIX_ADSB_NIC_CR_25_M = 10;
mavlink20.UAVIONIX_ADSB_NIC_CR_7_5_M = 11;
mavlink20.UAVIONIX_ADSB_NACP_EPU_10_NM = 16;
mavlink20.UAVIONIX_ADSB_NACP_EPU_4_NM = 32;
mavlink20.UAVIONIX_ADSB_NACP_EPU_2_NM = 48;
mavlink20.UAVIONIX_ADSB_NACP_EPU_1_NM = 64;
mavlink20.UAVIONIX_ADSB_NACP_EPU_0_5_NM = 80;
mavlink20.UAVIONIX_ADSB_NACP_EPU_0_3_NM = 96;
mavlink20.UAVIONIX_ADSB_NACP_EPU_0_1_NM = 112;
mavlink20.UAVIONIX_ADSB_NACP_EPU_0_05_NM = 128;
mavlink20.UAVIONIX_ADSB_NACP_EPU_30_M = 144;
mavlink20.UAVIONIX_ADSB_NACP_EPU_10_M = 160;
mavlink20.UAVIONIX_ADSB_NACP_EPU_3_M = 176;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_NIC_NACP_ENUM_END = 177;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_STATUS_MESSAGE_UNAVAIL = 8;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_GPS_NO_POS = 16;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_GPS_UNAVAIL = 32;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_TX_SYSTEM_FAIL = 64;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_MAINT_REQ = 128;
mavlink20.UAVIONIX_ADSB_OUT_STATUS_FAULT_ENUM_END = 129;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH1_IN = 200;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH1_OUT = 201;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH2_IN = 202;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH2_OUT = 203;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH3_IN = 204;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_CH3_OUT = 205;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED6 = 206;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED7 = 207;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED8 = 208;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_STORM32_RESERVED9 = 209;
mavlink20.MAV_STORM32_TUNNEL_PAYLOAD_TYPE_ENUM_END = 210;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_IS_NORMAL = 1;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_IMUS_WORKING = 2;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_MOTORS_WORKING = 4;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_ENCODERS_WORKING = 8;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_VOLTAGE_OK = 16;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_VIRTUALCHANNELS_RECEIVING = 32;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_MAVLINK_RECEIVING = 64;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_STORM32LINK_QFIX = 128;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_STORM32LINK_WORKING = 256;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_CAMERA_CONNECTED = 512;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_AUX0_LOW = 1024;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_AUX1_LOW = 2048;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_NTLOGGER_WORKING = 4096;
mavlink20.MAV_STORM32_GIMBAL_PREARM_FLAGS_ENUM_END = 4097;
mavlink20.MAV_STORM32_CAMERA_PREARM_FLAGS_CONNECTED = 1;
mavlink20.MAV_STORM32_CAMERA_PREARM_FLAGS_ENUM_END = 2;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_RETRACT = 1;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_NEUTRAL = 2;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_AXIS = 4;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_FOLLOW = 8;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_ROLL_LOCK = 16;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_AXIS = 32;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_FOLLOW = 64;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_PITCH_LOCK = 128;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_AXIS = 256;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_FOLLOW = 512;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_YAW_LOCK = 1024;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_INFINITE_YAW = 2048;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_ABSOLUTE_YAW = 65536;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_HAS_RC = 131072;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_CAP_FLAGS_ENUM_END = 131073;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_RETRACT = 1;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_NEUTRAL = 2;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_ROLL_LOCK = 4;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_PITCH_LOCK = 8;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_YAW_LOCK = 16;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_CAN_ACCEPT_YAW_ABSOLUTE = 256;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE = 512;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_RC_EXCLUSIVE = 1024;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_RC_MIXED = 2048;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_NONE = 65535;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_FLAGS_ENUM_END = 65536;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_AT_ROLL_LIMIT = 1;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_AT_PITCH_LIMIT = 2;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_AT_YAW_LIMIT = 4;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_ENCODER_ERROR = 8;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_POWER_ERROR = 16;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_MOTOR_ERROR = 32;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_SOFTWARE_ERROR = 64;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_COMMS_ERROR = 128;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_CALIBRATION_RUNNING = 256;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_NO_MANAGER = 32768;
mavlink20.MAV_STORM32_GIMBAL_DEVICE_ERROR_FLAGS_ENUM_END = 32769;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CAP_FLAGS_HAS_PROFILES = 1;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CAP_FLAGS_SUPPORTS_CHANGE = 2;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CAP_FLAGS_ENUM_END = 3;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_NONE = 0;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_RC_ACTIVE = 1;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_ONBOARD_ACTIVE = 2;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_AUTOPILOT_ACTIVE = 4;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_GCS_ACTIVE = 8;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_CAMERA_ACTIVE = 16;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_GCS2_ACTIVE = 32;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_CAMERA2_ACTIVE = 64;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_CUSTOM_ACTIVE = 128;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_CLIENT_CUSTOM2_ACTIVE = 256;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_SET_SUPERVISON = 512;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_SET_RELEASE = 1024;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_FLAGS_ENUM_END = 1025;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_NONE = 0;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_ONBOARD = 1;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_AUTOPILOT = 2;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_GCS = 3;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_CAMERA = 4;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_GCS2 = 5;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_CAMERA2 = 6;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_CUSTOM = 7;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_CUSTOM2 = 8;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_CLIENT_ENUM_END = 9;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_SETUP_FLAGS_ENABLE = 16384;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_SETUP_FLAGS_DISABLE = 32768;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_SETUP_FLAGS_ENUM_END = 32769;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_DEFAULT = 0;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_CUSTOM = 1;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_COOPERATIVE = 2;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_EXCLUSIVE = 3;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_PRIORITY_COOPERATIVE = 4;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_PRIORITY_EXCLUSIVE = 5;
mavlink20.MAV_STORM32_GIMBAL_MANAGER_PROFILE_ENUM_END = 6;
mavlink20.MAV_STORM32_GIMBAL_ACTION_RECENTER = 1;
mavlink20.MAV_STORM32_GIMBAL_ACTION_CALIBRATION = 2;
mavlink20.MAV_STORM32_GIMBAL_ACTION_DISCOVER_MANAGER = 3;
mavlink20.MAV_STORM32_GIMBAL_ACTION_ENUM_END = 4;
mavlink20.MAV_QSHOT_MODE_UNDEFINED = 0;
mavlink20.MAV_QSHOT_MODE_DEFAULT = 1;
mavlink20.MAV_QSHOT_MODE_GIMBAL_RETRACT = 2;
mavlink20.MAV_QSHOT_MODE_GIMBAL_NEUTRAL = 3;
mavlink20.MAV_QSHOT_MODE_GIMBAL_MISSION = 4;
mavlink20.MAV_QSHOT_MODE_GIMBAL_RC_CONTROL = 5;
mavlink20.MAV_QSHOT_MODE_POI_TARGETING = 6;
mavlink20.MAV_QSHOT_MODE_SYSID_TARGETING = 7;
mavlink20.MAV_QSHOT_MODE_CABLECAM_2POINT = 8;
mavlink20.MAV_QSHOT_MODE_HOME_TARGETING = 9;
mavlink20.MAV_QSHOT_MODE_ENUM_END = 10;
mavlink20.PRS_NOT_STEADY = 1;
mavlink20.PRS_DTM_NOT_ARMED = 2;
mavlink20.PRS_OTM_NOT_ARMED = 3;
mavlink20.MAV_AVSS_COMMAND_FAILURE_REASON_ENUM_END = 4;
mavlink20.MODE_M300_MANUAL_CTRL = 0;
mavlink20.MODE_M300_ATTITUDE = 1;
mavlink20.MODE_M300_P_GPS = 6;
mavlink20.MODE_M300_HOTPOINT_MODE = 9;
mavlink20.MODE_M300_ASSISTED_TAKEOFF = 10;
mavlink20.MODE_M300_AUTO_TAKEOFF = 11;
mavlink20.MODE_M300_AUTO_LANDING = 12;
mavlink20.MODE_M300_NAVI_GO_HOME = 15;
mavlink20.MODE_M300_NAVI_SDK_CTRL = 17;
mavlink20.MODE_M300_S_SPORT = 31;
mavlink20.MODE_M300_FORCE_AUTO_LANDING = 33;
mavlink20.MODE_M300_T_TRIPOD = 38;
mavlink20.MODE_M300_SEARCH_MODE = 40;
mavlink20.MODE_M300_ENGINE_START = 41;
mavlink20.AVSS_M300_OPERATION_MODE_ENUM_END = 42;
mavlink20.MODE_HORSEFLY_MANUAL_CTRL = 0;
mavlink20.MODE_HORSEFLY_AUTO_TAKEOFF = 1;
mavlink20.MODE_HORSEFLY_AUTO_LANDING = 2;
mavlink20.MODE_HORSEFLY_NAVI_GO_HOME = 3;
mavlink20.MODE_HORSEFLY_DROP = 4;
mavlink20.AVSS_HORSEFLY_OPERATION_MODE_ENUM_END = 5;
mavlink20.AIRLINK_ERROR_LOGIN_OR_PASS = 0;
mavlink20.AIRLINK_AUTH_OK = 1;
mavlink20.AIRLINK_AUTH_RESPONSE_TYPE_ENUM_END = 2;
mavlink20.MAVLINK_MSG_ID_BAD_DATA = -1;
mavlink20.MAVLINK_MSG_ID_SENSOR_OFFSETS = 150;
mavlink20.MAVLINK_MSG_ID_SET_MAG_OFFSETS = 151;
mavlink20.MAVLINK_MSG_ID_MEMINFO = 152;
mavlink20.MAVLINK_MSG_ID_AP_ADC = 153;
mavlink20.MAVLINK_MSG_ID_DIGICAM_CONFIGURE = 154;
mavlink20.MAVLINK_MSG_ID_DIGICAM_CONTROL = 155;
mavlink20.MAVLINK_MSG_ID_MOUNT_CONFIGURE = 156;
mavlink20.MAVLINK_MSG_ID_MOUNT_CONTROL = 157;
mavlink20.MAVLINK_MSG_ID_MOUNT_STATUS = 158;
mavlink20.MAVLINK_MSG_ID_FENCE_POINT = 160;
mavlink20.MAVLINK_MSG_ID_FENCE_FETCH_POINT = 161;
mavlink20.MAVLINK_MSG_ID_AHRS = 163;
mavlink20.MAVLINK_MSG_ID_SIMSTATE = 164;
mavlink20.MAVLINK_MSG_ID_HWSTATUS = 165;
mavlink20.MAVLINK_MSG_ID_RADIO = 166;
mavlink20.MAVLINK_MSG_ID_LIMITS_STATUS = 167;
mavlink20.MAVLINK_MSG_ID_WIND = 168;
mavlink20.MAVLINK_MSG_ID_DATA16 = 169;
mavlink20.MAVLINK_MSG_ID_DATA32 = 170;
mavlink20.MAVLINK_MSG_ID_DATA64 = 171;
mavlink20.MAVLINK_MSG_ID_DATA96 = 172;
mavlink20.MAVLINK_MSG_ID_RANGEFINDER = 173;
mavlink20.MAVLINK_MSG_ID_AIRSPEED_AUTOCAL = 174;
mavlink20.MAVLINK_MSG_ID_RALLY_POINT = 175;
mavlink20.MAVLINK_MSG_ID_RALLY_FETCH_POINT = 176;
mavlink20.MAVLINK_MSG_ID_COMPASSMOT_STATUS = 177;
mavlink20.MAVLINK_MSG_ID_AHRS2 = 178;
mavlink20.MAVLINK_MSG_ID_CAMERA_STATUS = 179;
mavlink20.MAVLINK_MSG_ID_CAMERA_FEEDBACK = 180;
mavlink20.MAVLINK_MSG_ID_BATTERY2 = 181;
mavlink20.MAVLINK_MSG_ID_AHRS3 = 182;
mavlink20.MAVLINK_MSG_ID_AUTOPILOT_VERSION_REQUEST = 183;
mavlink20.MAVLINK_MSG_ID_REMOTE_LOG_DATA_BLOCK = 184;
mavlink20.MAVLINK_MSG_ID_REMOTE_LOG_BLOCK_STATUS = 185;
mavlink20.MAVLINK_MSG_ID_LED_CONTROL = 186;
mavlink20.MAVLINK_MSG_ID_MAG_CAL_PROGRESS = 191;
mavlink20.MAVLINK_MSG_ID_EKF_STATUS_REPORT = 193;
mavlink20.MAVLINK_MSG_ID_PID_TUNING = 194;
mavlink20.MAVLINK_MSG_ID_DEEPSTALL = 195;
mavlink20.MAVLINK_MSG_ID_GIMBAL_REPORT = 200;
mavlink20.MAVLINK_MSG_ID_GIMBAL_CONTROL = 201;
mavlink20.MAVLINK_MSG_ID_GIMBAL_TORQUE_CMD_REPORT = 214;
mavlink20.MAVLINK_MSG_ID_GOPRO_HEARTBEAT = 215;
mavlink20.MAVLINK_MSG_ID_GOPRO_GET_REQUEST = 216;
mavlink20.MAVLINK_MSG_ID_GOPRO_GET_RESPONSE = 217;
mavlink20.MAVLINK_MSG_ID_GOPRO_SET_REQUEST = 218;
mavlink20.MAVLINK_MSG_ID_GOPRO_SET_RESPONSE = 219;
mavlink20.MAVLINK_MSG_ID_RPM = 226;
mavlink20.MAVLINK_MSG_ID_DEVICE_OP_READ = 11e3;
mavlink20.MAVLINK_MSG_ID_DEVICE_OP_READ_REPLY = 11001;
mavlink20.MAVLINK_MSG_ID_DEVICE_OP_WRITE = 11002;
mavlink20.MAVLINK_MSG_ID_DEVICE_OP_WRITE_REPLY = 11003;
mavlink20.MAVLINK_MSG_ID_SECURE_COMMAND = 11004;
mavlink20.MAVLINK_MSG_ID_SECURE_COMMAND_REPLY = 11005;
mavlink20.MAVLINK_MSG_ID_ADAP_TUNING = 11010;
mavlink20.MAVLINK_MSG_ID_VISION_POSITION_DELTA = 11011;
mavlink20.MAVLINK_MSG_ID_AOA_SSA = 11020;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_1_TO_4 = 11030;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_5_TO_8 = 11031;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_9_TO_12 = 11032;
mavlink20.MAVLINK_MSG_ID_OSD_PARAM_CONFIG = 11033;
mavlink20.MAVLINK_MSG_ID_OSD_PARAM_CONFIG_REPLY = 11034;
mavlink20.MAVLINK_MSG_ID_OSD_PARAM_SHOW_CONFIG = 11035;
mavlink20.MAVLINK_MSG_ID_OSD_PARAM_SHOW_CONFIG_REPLY = 11036;
mavlink20.MAVLINK_MSG_ID_OBSTACLE_DISTANCE_3D = 11037;
mavlink20.MAVLINK_MSG_ID_WATER_DEPTH = 11038;
mavlink20.MAVLINK_MSG_ID_MCU_STATUS = 11039;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_13_TO_16 = 11040;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_17_TO_20 = 11041;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_21_TO_24 = 11042;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_25_TO_28 = 11043;
mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_29_TO_32 = 11044;
mavlink20.MAVLINK_MSG_ID_COMMAND_INT_STAMPED = 223;
mavlink20.MAVLINK_MSG_ID_COMMAND_LONG_STAMPED = 224;
mavlink20.MAVLINK_MSG_ID_SENS_POWER = 8002;
mavlink20.MAVLINK_MSG_ID_SENS_MPPT = 8003;
mavlink20.MAVLINK_MSG_ID_ASLCTRL_DATA = 8004;
mavlink20.MAVLINK_MSG_ID_ASLCTRL_DEBUG = 8005;
mavlink20.MAVLINK_MSG_ID_ASLUAV_STATUS = 8006;
mavlink20.MAVLINK_MSG_ID_EKF_EXT = 8007;
mavlink20.MAVLINK_MSG_ID_ASL_OBCTRL = 8008;
mavlink20.MAVLINK_MSG_ID_SENS_ATMOS = 8009;
mavlink20.MAVLINK_MSG_ID_SENS_BATMON = 8010;
mavlink20.MAVLINK_MSG_ID_FW_SOARING_DATA = 8011;
mavlink20.MAVLINK_MSG_ID_SENSORPOD_STATUS = 8012;
mavlink20.MAVLINK_MSG_ID_SENS_POWER_BOARD = 8013;
mavlink20.MAVLINK_MSG_ID_GSM_LINK_STATUS = 8014;
mavlink20.MAVLINK_MSG_ID_SATCOM_LINK_STATUS = 8015;
mavlink20.MAVLINK_MSG_ID_SENSOR_AIRFLOW_ANGLES = 8016;
mavlink20.MAVLINK_MSG_ID_SYS_STATUS = 1;
mavlink20.MAVLINK_MSG_ID_SYSTEM_TIME = 2;
mavlink20.MAVLINK_MSG_ID_PING = 4;
mavlink20.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL = 5;
mavlink20.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL_ACK = 6;
mavlink20.MAVLINK_MSG_ID_AUTH_KEY = 7;
mavlink20.MAVLINK_MSG_ID_SET_MODE = 11;
mavlink20.MAVLINK_MSG_ID_PARAM_REQUEST_READ = 20;
mavlink20.MAVLINK_MSG_ID_PARAM_REQUEST_LIST = 21;
mavlink20.MAVLINK_MSG_ID_PARAM_VALUE = 22;
mavlink20.MAVLINK_MSG_ID_PARAM_SET = 23;
mavlink20.MAVLINK_MSG_ID_GPS_RAW_INT = 24;
mavlink20.MAVLINK_MSG_ID_GPS_STATUS = 25;
mavlink20.MAVLINK_MSG_ID_SCALED_IMU = 26;
mavlink20.MAVLINK_MSG_ID_RAW_IMU = 27;
mavlink20.MAVLINK_MSG_ID_RAW_PRESSURE = 28;
mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE = 29;
mavlink20.MAVLINK_MSG_ID_ATTITUDE = 30;
mavlink20.MAVLINK_MSG_ID_ATTITUDE_QUATERNION = 31;
mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED = 32;
mavlink20.MAVLINK_MSG_ID_GLOBAL_POSITION_INT = 33;
mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_SCALED = 34;
mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_RAW = 35;
mavlink20.MAVLINK_MSG_ID_SERVO_OUTPUT_RAW = 36;
mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_PARTIAL_LIST = 37;
mavlink20.MAVLINK_MSG_ID_MISSION_WRITE_PARTIAL_LIST = 38;
mavlink20.MAVLINK_MSG_ID_MISSION_ITEM = 39;
mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST = 40;
mavlink20.MAVLINK_MSG_ID_MISSION_SET_CURRENT = 41;
mavlink20.MAVLINK_MSG_ID_MISSION_CURRENT = 42;
mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_LIST = 43;
mavlink20.MAVLINK_MSG_ID_MISSION_COUNT = 44;
mavlink20.MAVLINK_MSG_ID_MISSION_CLEAR_ALL = 45;
mavlink20.MAVLINK_MSG_ID_MISSION_ITEM_REACHED = 46;
mavlink20.MAVLINK_MSG_ID_MISSION_ACK = 47;
mavlink20.MAVLINK_MSG_ID_SET_GPS_GLOBAL_ORIGIN = 48;
mavlink20.MAVLINK_MSG_ID_GPS_GLOBAL_ORIGIN = 49;
mavlink20.MAVLINK_MSG_ID_PARAM_MAP_RC = 50;
mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_INT = 51;
mavlink20.MAVLINK_MSG_ID_SAFETY_SET_ALLOWED_AREA = 54;
mavlink20.MAVLINK_MSG_ID_SAFETY_ALLOWED_AREA = 55;
mavlink20.MAVLINK_MSG_ID_ATTITUDE_QUATERNION_COV = 61;
mavlink20.MAVLINK_MSG_ID_NAV_CONTROLLER_OUTPUT = 62;
mavlink20.MAVLINK_MSG_ID_GLOBAL_POSITION_INT_COV = 63;
mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED_COV = 64;
mavlink20.MAVLINK_MSG_ID_RC_CHANNELS = 65;
mavlink20.MAVLINK_MSG_ID_REQUEST_DATA_STREAM = 66;
mavlink20.MAVLINK_MSG_ID_DATA_STREAM = 67;
mavlink20.MAVLINK_MSG_ID_MANUAL_CONTROL = 69;
mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_OVERRIDE = 70;
mavlink20.MAVLINK_MSG_ID_MISSION_ITEM_INT = 73;
mavlink20.MAVLINK_MSG_ID_VFR_HUD = 74;
mavlink20.MAVLINK_MSG_ID_COMMAND_INT = 75;
mavlink20.MAVLINK_MSG_ID_COMMAND_LONG = 76;
mavlink20.MAVLINK_MSG_ID_COMMAND_ACK = 77;
mavlink20.MAVLINK_MSG_ID_MANUAL_SETPOINT = 81;
mavlink20.MAVLINK_MSG_ID_SET_ATTITUDE_TARGET = 82;
mavlink20.MAVLINK_MSG_ID_ATTITUDE_TARGET = 83;
mavlink20.MAVLINK_MSG_ID_SET_POSITION_TARGET_LOCAL_NED = 84;
mavlink20.MAVLINK_MSG_ID_POSITION_TARGET_LOCAL_NED = 85;
mavlink20.MAVLINK_MSG_ID_SET_POSITION_TARGET_GLOBAL_INT = 86;
mavlink20.MAVLINK_MSG_ID_POSITION_TARGET_GLOBAL_INT = 87;
mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED_SYSTEM_GLOBAL_OFFSET = 89;
mavlink20.MAVLINK_MSG_ID_HIL_STATE = 90;
mavlink20.MAVLINK_MSG_ID_HIL_CONTROLS = 91;
mavlink20.MAVLINK_MSG_ID_HIL_RC_INPUTS_RAW = 92;
mavlink20.MAVLINK_MSG_ID_HIL_ACTUATOR_CONTROLS = 93;
mavlink20.MAVLINK_MSG_ID_OPTICAL_FLOW = 100;
mavlink20.MAVLINK_MSG_ID_GLOBAL_VISION_POSITION_ESTIMATE = 101;
mavlink20.MAVLINK_MSG_ID_VISION_POSITION_ESTIMATE = 102;
mavlink20.MAVLINK_MSG_ID_VISION_SPEED_ESTIMATE = 103;
mavlink20.MAVLINK_MSG_ID_VICON_POSITION_ESTIMATE = 104;
mavlink20.MAVLINK_MSG_ID_HIGHRES_IMU = 105;
mavlink20.MAVLINK_MSG_ID_OPTICAL_FLOW_RAD = 106;
mavlink20.MAVLINK_MSG_ID_HIL_SENSOR = 107;
mavlink20.MAVLINK_MSG_ID_SIM_STATE = 108;
mavlink20.MAVLINK_MSG_ID_RADIO_STATUS = 109;
mavlink20.MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL = 110;
mavlink20.MAVLINK_MSG_ID_TIMESYNC = 111;
mavlink20.MAVLINK_MSG_ID_CAMERA_TRIGGER = 112;
mavlink20.MAVLINK_MSG_ID_HIL_GPS = 113;
mavlink20.MAVLINK_MSG_ID_HIL_OPTICAL_FLOW = 114;
mavlink20.MAVLINK_MSG_ID_HIL_STATE_QUATERNION = 115;
mavlink20.MAVLINK_MSG_ID_SCALED_IMU2 = 116;
mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_LIST = 117;
mavlink20.MAVLINK_MSG_ID_LOG_ENTRY = 118;
mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_DATA = 119;
mavlink20.MAVLINK_MSG_ID_LOG_DATA = 120;
mavlink20.MAVLINK_MSG_ID_LOG_ERASE = 121;
mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_END = 122;
mavlink20.MAVLINK_MSG_ID_GPS_INJECT_DATA = 123;
mavlink20.MAVLINK_MSG_ID_GPS2_RAW = 124;
mavlink20.MAVLINK_MSG_ID_POWER_STATUS = 125;
mavlink20.MAVLINK_MSG_ID_SERIAL_CONTROL = 126;
mavlink20.MAVLINK_MSG_ID_GPS_RTK = 127;
mavlink20.MAVLINK_MSG_ID_GPS2_RTK = 128;
mavlink20.MAVLINK_MSG_ID_SCALED_IMU3 = 129;
mavlink20.MAVLINK_MSG_ID_DATA_TRANSMISSION_HANDSHAKE = 130;
mavlink20.MAVLINK_MSG_ID_ENCAPSULATED_DATA = 131;
mavlink20.MAVLINK_MSG_ID_DISTANCE_SENSOR = 132;
mavlink20.MAVLINK_MSG_ID_TERRAIN_REQUEST = 133;
mavlink20.MAVLINK_MSG_ID_TERRAIN_DATA = 134;
mavlink20.MAVLINK_MSG_ID_TERRAIN_CHECK = 135;
mavlink20.MAVLINK_MSG_ID_TERRAIN_REPORT = 136;
mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE2 = 137;
mavlink20.MAVLINK_MSG_ID_ATT_POS_MOCAP = 138;
mavlink20.MAVLINK_MSG_ID_SET_ACTUATOR_CONTROL_TARGET = 139;
mavlink20.MAVLINK_MSG_ID_ACTUATOR_CONTROL_TARGET = 140;
mavlink20.MAVLINK_MSG_ID_ALTITUDE = 141;
mavlink20.MAVLINK_MSG_ID_RESOURCE_REQUEST = 142;
mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE3 = 143;
mavlink20.MAVLINK_MSG_ID_FOLLOW_TARGET = 144;
mavlink20.MAVLINK_MSG_ID_CONTROL_SYSTEM_STATE = 146;
mavlink20.MAVLINK_MSG_ID_BATTERY_STATUS = 147;
mavlink20.MAVLINK_MSG_ID_AUTOPILOT_VERSION = 148;
mavlink20.MAVLINK_MSG_ID_LANDING_TARGET = 149;
mavlink20.MAVLINK_MSG_ID_FENCE_STATUS = 162;
mavlink20.MAVLINK_MSG_ID_MAG_CAL_REPORT = 192;
mavlink20.MAVLINK_MSG_ID_EFI_STATUS = 225;
mavlink20.MAVLINK_MSG_ID_ESTIMATOR_STATUS = 230;
mavlink20.MAVLINK_MSG_ID_WIND_COV = 231;
mavlink20.MAVLINK_MSG_ID_GPS_INPUT = 232;
mavlink20.MAVLINK_MSG_ID_GPS_RTCM_DATA = 233;
mavlink20.MAVLINK_MSG_ID_HIGH_LATENCY = 234;
mavlink20.MAVLINK_MSG_ID_HIGH_LATENCY2 = 235;
mavlink20.MAVLINK_MSG_ID_VIBRATION = 241;
mavlink20.MAVLINK_MSG_ID_HOME_POSITION = 242;
mavlink20.MAVLINK_MSG_ID_SET_HOME_POSITION = 243;
mavlink20.MAVLINK_MSG_ID_MESSAGE_INTERVAL = 244;
mavlink20.MAVLINK_MSG_ID_EXTENDED_SYS_STATE = 245;
mavlink20.MAVLINK_MSG_ID_ADSB_VEHICLE = 246;
mavlink20.MAVLINK_MSG_ID_COLLISION = 247;
mavlink20.MAVLINK_MSG_ID_V2_EXTENSION = 248;
mavlink20.MAVLINK_MSG_ID_MEMORY_VECT = 249;
mavlink20.MAVLINK_MSG_ID_DEBUG_VECT = 250;
mavlink20.MAVLINK_MSG_ID_NAMED_VALUE_FLOAT = 251;
mavlink20.MAVLINK_MSG_ID_NAMED_VALUE_INT = 252;
mavlink20.MAVLINK_MSG_ID_STATUSTEXT = 253;
mavlink20.MAVLINK_MSG_ID_DEBUG = 254;
mavlink20.MAVLINK_MSG_ID_SETUP_SIGNING = 256;
mavlink20.MAVLINK_MSG_ID_BUTTON_CHANGE = 257;
mavlink20.MAVLINK_MSG_ID_PLAY_TUNE = 258;
mavlink20.MAVLINK_MSG_ID_CAMERA_INFORMATION = 259;
mavlink20.MAVLINK_MSG_ID_CAMERA_SETTINGS = 260;
mavlink20.MAVLINK_MSG_ID_STORAGE_INFORMATION = 261;
mavlink20.MAVLINK_MSG_ID_CAMERA_CAPTURE_STATUS = 262;
mavlink20.MAVLINK_MSG_ID_CAMERA_IMAGE_CAPTURED = 263;
mavlink20.MAVLINK_MSG_ID_FLIGHT_INFORMATION = 264;
mavlink20.MAVLINK_MSG_ID_MOUNT_ORIENTATION = 265;
mavlink20.MAVLINK_MSG_ID_LOGGING_DATA = 266;
mavlink20.MAVLINK_MSG_ID_LOGGING_DATA_ACKED = 267;
mavlink20.MAVLINK_MSG_ID_LOGGING_ACK = 268;
mavlink20.MAVLINK_MSG_ID_VIDEO_STREAM_INFORMATION = 269;
mavlink20.MAVLINK_MSG_ID_VIDEO_STREAM_STATUS = 270;
mavlink20.MAVLINK_MSG_ID_CAMERA_FOV_STATUS = 271;
mavlink20.MAVLINK_MSG_ID_CAMERA_TRACKING_IMAGE_STATUS = 275;
mavlink20.MAVLINK_MSG_ID_CAMERA_TRACKING_GEO_STATUS = 276;
mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_INFORMATION = 280;
mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_STATUS = 281;
mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_ATTITUDE = 282;
mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_INFORMATION = 283;
mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_SET_ATTITUDE = 284;
mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_ATTITUDE_STATUS = 285;
mavlink20.MAVLINK_MSG_ID_AUTOPILOT_STATE_FOR_GIMBAL_DEVICE = 286;
mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_PITCHYAW = 287;
mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_MANUAL_CONTROL = 288;
mavlink20.MAVLINK_MSG_ID_WIFI_CONFIG_AP = 299;
mavlink20.MAVLINK_MSG_ID_AIS_VESSEL = 301;
mavlink20.MAVLINK_MSG_ID_UAVCAN_NODE_STATUS = 310;
mavlink20.MAVLINK_MSG_ID_UAVCAN_NODE_INFO = 311;
mavlink20.MAVLINK_MSG_ID_PARAM_EXT_REQUEST_READ = 320;
mavlink20.MAVLINK_MSG_ID_PARAM_EXT_REQUEST_LIST = 321;
mavlink20.MAVLINK_MSG_ID_PARAM_EXT_VALUE = 322;
mavlink20.MAVLINK_MSG_ID_PARAM_EXT_SET = 323;
mavlink20.MAVLINK_MSG_ID_PARAM_EXT_ACK = 324;
mavlink20.MAVLINK_MSG_ID_OBSTACLE_DISTANCE = 330;
mavlink20.MAVLINK_MSG_ID_ODOMETRY = 331;
mavlink20.MAVLINK_MSG_ID_ISBD_LINK_STATUS = 335;
mavlink20.MAVLINK_MSG_ID_RAW_RPM = 339;
mavlink20.MAVLINK_MSG_ID_UTM_GLOBAL_POSITION = 340;
mavlink20.MAVLINK_MSG_ID_DEBUG_FLOAT_ARRAY = 350;
mavlink20.MAVLINK_MSG_ID_SMART_BATTERY_INFO = 370;
mavlink20.MAVLINK_MSG_ID_GENERATOR_STATUS = 373;
mavlink20.MAVLINK_MSG_ID_ACTUATOR_OUTPUT_STATUS = 375;
mavlink20.MAVLINK_MSG_ID_RELAY_STATUS = 376;
mavlink20.MAVLINK_MSG_ID_TUNNEL = 385;
mavlink20.MAVLINK_MSG_ID_CAN_FRAME = 386;
mavlink20.MAVLINK_MSG_ID_CANFD_FRAME = 387;
mavlink20.MAVLINK_MSG_ID_CAN_FILTER_MODIFY = 388;
mavlink20.MAVLINK_MSG_ID_WHEEL_DISTANCE = 9e3;
mavlink20.MAVLINK_MSG_ID_WINCH_STATUS = 9005;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_BASIC_ID = 12900;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_LOCATION = 12901;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_AUTHENTICATION = 12902;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SELF_ID = 12903;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SYSTEM = 12904;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_OPERATOR_ID = 12905;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_ARM_STATUS = 12918;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_MESSAGE_PACK = 12915;
mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SYSTEM_UPDATE = 12919;
mavlink20.MAVLINK_MSG_ID_HYGROMETER_SENSOR = 12920;
mavlink20.MAVLINK_MSG_ID_MISSION_CHECKSUM = 53;
mavlink20.MAVLINK_MSG_ID_AIRSPEED = 295;
mavlink20.MAVLINK_MSG_ID_RADIO_RC_CHANNELS = 420;
mavlink20.MAVLINK_MSG_ID_ICAROUS_HEARTBEAT = 42e3;
mavlink20.MAVLINK_MSG_ID_ICAROUS_KINEMATIC_BANDS = 42001;
mavlink20.MAVLINK_MSG_ID_HEARTBEAT = 0;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_0 = 17150;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_1 = 17151;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_3 = 17153;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_4 = 17154;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_5 = 17155;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_6 = 17156;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_7 = 17157;
mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_8 = 17158;
mavlink20.MAVLINK_MSG_ID_TEST_TYPES = 17e3;
mavlink20.MAVLINK_MSG_ID_NAV_FILTER_BIAS = 220;
mavlink20.MAVLINK_MSG_ID_RADIO_CALIBRATION = 221;
mavlink20.MAVLINK_MSG_ID_UALBERTA_SYS_STATUS = 222;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG = 10001;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_DYNAMIC = 10002;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_TRANSCEIVER_HEALTH_REPORT = 10003;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG_REGISTRATION = 10004;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG_FLIGHTID = 10005;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_GET = 10006;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CONTROL = 10007;
mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_STATUS = 10008;
mavlink20.MAVLINK_MSG_ID_LOWEHEISER_GOV_EFI = 10151;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_DEVICE_STATUS = 60001;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_DEVICE_CONTROL = 60002;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_INFORMATION = 60010;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_STATUS = 60011;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CONTROL = 60012;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CONTROL_PITCHYAW = 60013;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CORRECT_ROLL = 60014;
mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_PROFILE = 60015;
mavlink20.MAVLINK_MSG_ID_QSHOT_STATUS = 60020;
mavlink20.MAVLINK_MSG_ID_COMPONENT_PREARM_STATUS = 60025;
mavlink20.MAVLINK_MSG_ID_AVSS_PRS_SYS_STATUS = 60050;
mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_POSITION = 60051;
mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_IMU = 60052;
mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_OPERATION_MODE = 60053;
mavlink20.MAVLINK_MSG_ID_CUBEPILOT_RAW_RC = 50001;
mavlink20.MAVLINK_MSG_ID_HERELINK_VIDEO_STREAM_INFORMATION = 50002;
mavlink20.MAVLINK_MSG_ID_HERELINK_TELEM = 50003;
mavlink20.MAVLINK_MSG_ID_CUBEPILOT_FIRMWARE_UPDATE_START = 50004;
mavlink20.MAVLINK_MSG_ID_CUBEPILOT_FIRMWARE_UPDATE_RESP = 50005;
mavlink20.MAVLINK_MSG_ID_AIRLINK_AUTH = 52e3;
mavlink20.MAVLINK_MSG_ID_AIRLINK_AUTH_RESPONSE = 52001;
mavlink20.messages = {};
mavlink20.messages.sensor_offsets = function(...moreargs) {
  [this.mag_ofs_x, this.mag_ofs_y, this.mag_ofs_z, this.mag_declination, this.raw_press, this.raw_temp, this.gyro_cal_x, this.gyro_cal_y, this.gyro_cal_z, this.accel_cal_x, this.accel_cal_y, this.accel_cal_z] = moreargs;
  this._format = "<fiiffffffhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SENSOR_OFFSETS;
  this.order_map = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 134;
  this._name = "SENSOR_OFFSETS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["mag_ofs_x", "mag_ofs_y", "mag_ofs_z", "mag_declination", "raw_press", "raw_temp", "gyro_cal_x", "gyro_cal_y", "gyro_cal_z", "accel_cal_x", "accel_cal_y", "accel_cal_z"];
};
mavlink20.messages.sensor_offsets.prototype = new mavlink20.message();
mavlink20.messages.sensor_offsets.prototype.pack = function(mav) {
  var orderedfields = [this.mag_declination, this.raw_press, this.raw_temp, this.gyro_cal_x, this.gyro_cal_y, this.gyro_cal_z, this.accel_cal_x, this.accel_cal_y, this.accel_cal_z, this.mag_ofs_x, this.mag_ofs_y, this.mag_ofs_z];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_mag_offsets = function(...moreargs) {
  [this.target_system, this.target_component, this.mag_ofs_x, this.mag_ofs_y, this.mag_ofs_z] = moreargs;
  this._format = "<hhhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_MAG_OFFSETS;
  this.order_map = [3, 4, 0, 1, 2];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 219;
  this._name = "SET_MAG_OFFSETS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "mag_ofs_x", "mag_ofs_y", "mag_ofs_z"];
};
mavlink20.messages.set_mag_offsets.prototype = new mavlink20.message();
mavlink20.messages.set_mag_offsets.prototype.pack = function(mav) {
  var orderedfields = [this.mag_ofs_x, this.mag_ofs_y, this.mag_ofs_z, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.meminfo = function(...moreargs) {
  [this.brkval, this.freemem, this.freemem32] = moreargs;
  this._format = "<HHI";
  this._id = mavlink20.MAVLINK_MSG_ID_MEMINFO;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 208;
  this._name = "MEMINFO";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["brkval", "freemem", "freemem32"];
};
mavlink20.messages.meminfo.prototype = new mavlink20.message();
mavlink20.messages.meminfo.prototype.pack = function(mav) {
  var orderedfields = [this.brkval, this.freemem, this.freemem32];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ap_adc = function(...moreargs) {
  [this.adc1, this.adc2, this.adc3, this.adc4, this.adc5, this.adc6] = moreargs;
  this._format = "<HHHHHH";
  this._id = mavlink20.MAVLINK_MSG_ID_AP_ADC;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 188;
  this._name = "AP_ADC";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["adc1", "adc2", "adc3", "adc4", "adc5", "adc6"];
};
mavlink20.messages.ap_adc.prototype = new mavlink20.message();
mavlink20.messages.ap_adc.prototype.pack = function(mav) {
  var orderedfields = [this.adc1, this.adc2, this.adc3, this.adc4, this.adc5, this.adc6];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.digicam_configure = function(...moreargs) {
  [this.target_system, this.target_component, this.mode, this.shutter_speed, this.aperture, this.iso, this.exposure_type, this.command_id, this.engine_cut_off, this.extra_param, this.extra_value] = moreargs;
  this._format = "<fHBBBBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_DIGICAM_CONFIGURE;
  this.order_map = [2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 0];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 84;
  this._name = "DIGICAM_CONFIGURE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "mode", "shutter_speed", "aperture", "iso", "exposure_type", "command_id", "engine_cut_off", "extra_param", "extra_value"];
};
mavlink20.messages.digicam_configure.prototype = new mavlink20.message();
mavlink20.messages.digicam_configure.prototype.pack = function(mav) {
  var orderedfields = [this.extra_value, this.shutter_speed, this.target_system, this.target_component, this.mode, this.aperture, this.iso, this.exposure_type, this.command_id, this.engine_cut_off, this.extra_param];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.digicam_control = function(...moreargs) {
  [this.target_system, this.target_component, this.session, this.zoom_pos, this.zoom_step, this.focus_lock, this.shot, this.command_id, this.extra_param, this.extra_value] = moreargs;
  this._format = "<fBBBBbBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_DIGICAM_CONTROL;
  this.order_map = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 22;
  this._name = "DIGICAM_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "session", "zoom_pos", "zoom_step", "focus_lock", "shot", "command_id", "extra_param", "extra_value"];
};
mavlink20.messages.digicam_control.prototype = new mavlink20.message();
mavlink20.messages.digicam_control.prototype.pack = function(mav) {
  var orderedfields = [this.extra_value, this.target_system, this.target_component, this.session, this.zoom_pos, this.zoom_step, this.focus_lock, this.shot, this.command_id, this.extra_param];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mount_configure = function(...moreargs) {
  [this.target_system, this.target_component, this.mount_mode, this.stab_roll, this.stab_pitch, this.stab_yaw] = moreargs;
  this._format = "<BBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MOUNT_CONFIGURE;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 19;
  this._name = "MOUNT_CONFIGURE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "mount_mode", "stab_roll", "stab_pitch", "stab_yaw"];
};
mavlink20.messages.mount_configure.prototype = new mavlink20.message();
mavlink20.messages.mount_configure.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.mount_mode, this.stab_roll, this.stab_pitch, this.stab_yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mount_control = function(...moreargs) {
  [this.target_system, this.target_component, this.input_a, this.input_b, this.input_c, this.save_position] = moreargs;
  this._format = "<iiiBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MOUNT_CONTROL;
  this.order_map = [3, 4, 0, 1, 2, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 21;
  this._name = "MOUNT_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "input_a", "input_b", "input_c", "save_position"];
};
mavlink20.messages.mount_control.prototype = new mavlink20.message();
mavlink20.messages.mount_control.prototype.pack = function(mav) {
  var orderedfields = [this.input_a, this.input_b, this.input_c, this.target_system, this.target_component, this.save_position];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mount_status = function(...moreargs) {
  [this.target_system, this.target_component, this.pointing_a, this.pointing_b, this.pointing_c, this.mount_mode] = moreargs;
  this._format = "<iiiBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MOUNT_STATUS;
  this.order_map = [3, 4, 0, 1, 2, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 134;
  this._name = "MOUNT_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "pointing_a", "pointing_b", "pointing_c", "mount_mode"];
};
mavlink20.messages.mount_status.prototype = new mavlink20.message();
mavlink20.messages.mount_status.prototype.pack = function(mav) {
  var orderedfields = [this.pointing_a, this.pointing_b, this.pointing_c, this.target_system, this.target_component, this.mount_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.fence_point = function(...moreargs) {
  [this.target_system, this.target_component, this.idx, this.count, this.lat, this.lng] = moreargs;
  this._format = "<ffBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_FENCE_POINT;
  this.order_map = [2, 3, 4, 5, 0, 1];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 78;
  this._name = "FENCE_POINT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "idx", "count", "lat", "lng"];
};
mavlink20.messages.fence_point.prototype = new mavlink20.message();
mavlink20.messages.fence_point.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lng, this.target_system, this.target_component, this.idx, this.count];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.fence_fetch_point = function(...moreargs) {
  [this.target_system, this.target_component, this.idx] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_FENCE_FETCH_POINT;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 68;
  this._name = "FENCE_FETCH_POINT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "idx"];
};
mavlink20.messages.fence_fetch_point.prototype = new mavlink20.message();
mavlink20.messages.fence_fetch_point.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.idx];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ahrs = function(...moreargs) {
  [this.omegaIx, this.omegaIy, this.omegaIz, this.accel_weight, this.renorm_val, this.error_rp, this.error_yaw] = moreargs;
  this._format = "<fffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_AHRS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 127;
  this._name = "AHRS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["omegaIx", "omegaIy", "omegaIz", "accel_weight", "renorm_val", "error_rp", "error_yaw"];
};
mavlink20.messages.ahrs.prototype = new mavlink20.message();
mavlink20.messages.ahrs.prototype.pack = function(mav) {
  var orderedfields = [this.omegaIx, this.omegaIy, this.omegaIz, this.accel_weight, this.renorm_val, this.error_rp, this.error_yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.simstate = function(...moreargs) {
  [this.roll, this.pitch, this.yaw, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.lat, this.lng] = moreargs;
  this._format = "<fffffffffii";
  this._id = mavlink20.MAVLINK_MSG_ID_SIMSTATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 154;
  this._name = "SIMSTATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["roll", "pitch", "yaw", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "lat", "lng"];
};
mavlink20.messages.simstate.prototype = new mavlink20.message();
mavlink20.messages.simstate.prototype.pack = function(mav) {
  var orderedfields = [this.roll, this.pitch, this.yaw, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.lat, this.lng];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hwstatus = function(...moreargs) {
  [this.Vcc, this.I2Cerr] = moreargs;
  this._format = "<HB";
  this._id = mavlink20.MAVLINK_MSG_ID_HWSTATUS;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 21;
  this._name = "HWSTATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["Vcc", "I2Cerr"];
};
mavlink20.messages.hwstatus.prototype = new mavlink20.message();
mavlink20.messages.hwstatus.prototype.pack = function(mav) {
  var orderedfields = [this.Vcc, this.I2Cerr];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.radio = function(...moreargs) {
  [this.rssi, this.remrssi, this.txbuf, this.noise, this.remnoise, this.rxerrors, this.fixed] = moreargs;
  this._format = "<HHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RADIO;
  this.order_map = [2, 3, 4, 5, 6, 0, 1];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 21;
  this._name = "RADIO";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rssi", "remrssi", "txbuf", "noise", "remnoise", "rxerrors", "fixed"];
};
mavlink20.messages.radio.prototype = new mavlink20.message();
mavlink20.messages.radio.prototype.pack = function(mav) {
  var orderedfields = [this.rxerrors, this.fixed, this.rssi, this.remrssi, this.txbuf, this.noise, this.remnoise];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.limits_status = function(...moreargs) {
  [this.limits_state, this.last_trigger, this.last_action, this.last_recovery, this.last_clear, this.breach_count, this.mods_enabled, this.mods_required, this.mods_triggered] = moreargs;
  this._format = "<IIIIHBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_LIMITS_STATUS;
  this.order_map = [5, 0, 1, 2, 3, 4, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 144;
  this._name = "LIMITS_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["limits_state", "last_trigger", "last_action", "last_recovery", "last_clear", "breach_count", "mods_enabled", "mods_required", "mods_triggered"];
};
mavlink20.messages.limits_status.prototype = new mavlink20.message();
mavlink20.messages.limits_status.prototype.pack = function(mav) {
  var orderedfields = [this.last_trigger, this.last_action, this.last_recovery, this.last_clear, this.breach_count, this.limits_state, this.mods_enabled, this.mods_required, this.mods_triggered];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.wind = function(...moreargs) {
  [this.direction, this.speed, this.speed_z] = moreargs;
  this._format = "<fff";
  this._id = mavlink20.MAVLINK_MSG_ID_WIND;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 1;
  this._name = "WIND";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["direction", "speed", "speed_z"];
};
mavlink20.messages.wind.prototype = new mavlink20.message();
mavlink20.messages.wind.prototype.pack = function(mav) {
  var orderedfields = [this.direction, this.speed, this.speed_z];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data16 = function(...moreargs) {
  [this.type, this.len, this.data] = moreargs;
  this._format = "<BB16s";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA16;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 16];
  this.array_len_map = [0, 0, 16];
  this.crc_extra = 234;
  this._name = "DATA16";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "len", "data"];
};
mavlink20.messages.data16.prototype = new mavlink20.message();
mavlink20.messages.data16.prototype.pack = function(mav) {
  var orderedfields = [this.type, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data32 = function(...moreargs) {
  [this.type, this.len, this.data] = moreargs;
  this._format = "<BB32s";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA32;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 32];
  this.array_len_map = [0, 0, 32];
  this.crc_extra = 73;
  this._name = "DATA32";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "len", "data"];
};
mavlink20.messages.data32.prototype = new mavlink20.message();
mavlink20.messages.data32.prototype.pack = function(mav) {
  var orderedfields = [this.type, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data64 = function(...moreargs) {
  [this.type, this.len, this.data] = moreargs;
  this._format = "<BB64s";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA64;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 64];
  this.array_len_map = [0, 0, 64];
  this.crc_extra = 181;
  this._name = "DATA64";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "len", "data"];
};
mavlink20.messages.data64.prototype = new mavlink20.message();
mavlink20.messages.data64.prototype.pack = function(mav) {
  var orderedfields = [this.type, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data96 = function(...moreargs) {
  [this.type, this.len, this.data] = moreargs;
  this._format = "<BB96s";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA96;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 96];
  this.array_len_map = [0, 0, 96];
  this.crc_extra = 22;
  this._name = "DATA96";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "len", "data"];
};
mavlink20.messages.data96.prototype = new mavlink20.message();
mavlink20.messages.data96.prototype.pack = function(mav) {
  var orderedfields = [this.type, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rangefinder = function(...moreargs) {
  [this.distance, this.voltage] = moreargs;
  this._format = "<ff";
  this._id = mavlink20.MAVLINK_MSG_ID_RANGEFINDER;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 83;
  this._name = "RANGEFINDER";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["distance", "voltage"];
};
mavlink20.messages.rangefinder.prototype = new mavlink20.message();
mavlink20.messages.rangefinder.prototype.pack = function(mav) {
  var orderedfields = [this.distance, this.voltage];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.airspeed_autocal = function(...moreargs) {
  [this.vx, this.vy, this.vz, this.diff_pressure, this.EAS2TAS, this.ratio, this.state_x, this.state_y, this.state_z, this.Pax, this.Pby, this.Pcz] = moreargs;
  this._format = "<ffffffffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_AIRSPEED_AUTOCAL;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 167;
  this._name = "AIRSPEED_AUTOCAL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["vx", "vy", "vz", "diff_pressure", "EAS2TAS", "ratio", "state_x", "state_y", "state_z", "Pax", "Pby", "Pcz"];
};
mavlink20.messages.airspeed_autocal.prototype = new mavlink20.message();
mavlink20.messages.airspeed_autocal.prototype.pack = function(mav) {
  var orderedfields = [this.vx, this.vy, this.vz, this.diff_pressure, this.EAS2TAS, this.ratio, this.state_x, this.state_y, this.state_z, this.Pax, this.Pby, this.Pcz];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rally_point = function(...moreargs) {
  [this.target_system, this.target_component, this.idx, this.count, this.lat, this.lng, this.alt, this.break_alt, this.land_dir, this.flags] = moreargs;
  this._format = "<iihhHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RALLY_POINT;
  this.order_map = [5, 6, 7, 8, 0, 1, 2, 3, 4, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 138;
  this._name = "RALLY_POINT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "idx", "count", "lat", "lng", "alt", "break_alt", "land_dir", "flags"];
};
mavlink20.messages.rally_point.prototype = new mavlink20.message();
mavlink20.messages.rally_point.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lng, this.alt, this.break_alt, this.land_dir, this.target_system, this.target_component, this.idx, this.count, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rally_fetch_point = function(...moreargs) {
  [this.target_system, this.target_component, this.idx] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RALLY_FETCH_POINT;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 234;
  this._name = "RALLY_FETCH_POINT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "idx"];
};
mavlink20.messages.rally_fetch_point.prototype = new mavlink20.message();
mavlink20.messages.rally_fetch_point.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.idx];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.compassmot_status = function(...moreargs) {
  [this.throttle, this.current, this.interference, this.CompensationX, this.CompensationY, this.CompensationZ] = moreargs;
  this._format = "<ffffHH";
  this._id = mavlink20.MAVLINK_MSG_ID_COMPASSMOT_STATUS;
  this.order_map = [4, 0, 5, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 240;
  this._name = "COMPASSMOT_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["throttle", "current", "interference", "CompensationX", "CompensationY", "CompensationZ"];
};
mavlink20.messages.compassmot_status.prototype = new mavlink20.message();
mavlink20.messages.compassmot_status.prototype.pack = function(mav) {
  var orderedfields = [this.current, this.CompensationX, this.CompensationY, this.CompensationZ, this.throttle, this.interference];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ahrs2 = function(...moreargs) {
  [this.roll, this.pitch, this.yaw, this.altitude, this.lat, this.lng] = moreargs;
  this._format = "<ffffii";
  this._id = mavlink20.MAVLINK_MSG_ID_AHRS2;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 47;
  this._name = "AHRS2";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["roll", "pitch", "yaw", "altitude", "lat", "lng"];
};
mavlink20.messages.ahrs2.prototype = new mavlink20.message();
mavlink20.messages.ahrs2.prototype.pack = function(mav) {
  var orderedfields = [this.roll, this.pitch, this.yaw, this.altitude, this.lat, this.lng];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_status = function(...moreargs) {
  [this.time_usec, this.target_system, this.cam_idx, this.img_idx, this.event_id, this.p1, this.p2, this.p3, this.p4] = moreargs;
  this._format = "<QffffHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_STATUS;
  this.order_map = [0, 6, 7, 5, 8, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 189;
  this._name = "CAMERA_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "target_system", "cam_idx", "img_idx", "event_id", "p1", "p2", "p3", "p4"];
};
mavlink20.messages.camera_status.prototype = new mavlink20.message();
mavlink20.messages.camera_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.p1, this.p2, this.p3, this.p4, this.img_idx, this.target_system, this.cam_idx, this.event_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_feedback = function(...moreargs) {
  [this.time_usec, this.target_system, this.cam_idx, this.img_idx, this.lat, this.lng, this.alt_msl, this.alt_rel, this.roll, this.pitch, this.yaw, this.foc_len, this.flags, this.completed_captures] = moreargs;
  this._format = "<QiiffffffHBBBH";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_FEEDBACK;
  this.order_map = [0, 10, 11, 9, 1, 2, 3, 4, 5, 6, 7, 8, 12, 13];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 52;
  this._name = "CAMERA_FEEDBACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "target_system", "cam_idx", "img_idx", "lat", "lng", "alt_msl", "alt_rel", "roll", "pitch", "yaw", "foc_len", "flags", "completed_captures"];
};
mavlink20.messages.camera_feedback.prototype = new mavlink20.message();
mavlink20.messages.camera_feedback.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.lat, this.lng, this.alt_msl, this.alt_rel, this.roll, this.pitch, this.yaw, this.foc_len, this.img_idx, this.target_system, this.cam_idx, this.flags, this.completed_captures];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.battery2 = function(...moreargs) {
  [this.voltage, this.current_battery] = moreargs;
  this._format = "<Hh";
  this._id = mavlink20.MAVLINK_MSG_ID_BATTERY2;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 174;
  this._name = "BATTERY2";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["voltage", "current_battery"];
};
mavlink20.messages.battery2.prototype = new mavlink20.message();
mavlink20.messages.battery2.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current_battery];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ahrs3 = function(...moreargs) {
  [this.roll, this.pitch, this.yaw, this.altitude, this.lat, this.lng, this.v1, this.v2, this.v3, this.v4] = moreargs;
  this._format = "<ffffiiffff";
  this._id = mavlink20.MAVLINK_MSG_ID_AHRS3;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 229;
  this._name = "AHRS3";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["roll", "pitch", "yaw", "altitude", "lat", "lng", "v1", "v2", "v3", "v4"];
};
mavlink20.messages.ahrs3.prototype = new mavlink20.message();
mavlink20.messages.ahrs3.prototype.pack = function(mav) {
  var orderedfields = [this.roll, this.pitch, this.yaw, this.altitude, this.lat, this.lng, this.v1, this.v2, this.v3, this.v4];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.autopilot_version_request = function(...moreargs) {
  [this.target_system, this.target_component] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_AUTOPILOT_VERSION_REQUEST;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 85;
  this._name = "AUTOPILOT_VERSION_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component"];
};
mavlink20.messages.autopilot_version_request.prototype = new mavlink20.message();
mavlink20.messages.autopilot_version_request.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.remote_log_data_block = function(...moreargs) {
  [this.target_system, this.target_component, this.seqno, this.data] = moreargs;
  this._format = "<IBB200s";
  this._id = mavlink20.MAVLINK_MSG_ID_REMOTE_LOG_DATA_BLOCK;
  this.order_map = [1, 2, 0, 3];
  this.len_map = [1, 1, 1, 200];
  this.array_len_map = [0, 0, 0, 200];
  this.crc_extra = 159;
  this._name = "REMOTE_LOG_DATA_BLOCK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seqno", "data"];
};
mavlink20.messages.remote_log_data_block.prototype = new mavlink20.message();
mavlink20.messages.remote_log_data_block.prototype.pack = function(mav) {
  var orderedfields = [this.seqno, this.target_system, this.target_component, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.remote_log_block_status = function(...moreargs) {
  [this.target_system, this.target_component, this.seqno, this.status] = moreargs;
  this._format = "<IBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_REMOTE_LOG_BLOCK_STATUS;
  this.order_map = [1, 2, 0, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 186;
  this._name = "REMOTE_LOG_BLOCK_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seqno", "status"];
};
mavlink20.messages.remote_log_block_status.prototype = new mavlink20.message();
mavlink20.messages.remote_log_block_status.prototype.pack = function(mav) {
  var orderedfields = [this.seqno, this.target_system, this.target_component, this.status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.led_control = function(...moreargs) {
  [this.target_system, this.target_component, this.instance, this.pattern, this.custom_len, this.custom_bytes] = moreargs;
  this._format = "<BBBBB24s";
  this._id = mavlink20.MAVLINK_MSG_ID_LED_CONTROL;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 24];
  this.array_len_map = [0, 0, 0, 0, 0, 24];
  this.crc_extra = 72;
  this._name = "LED_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "instance", "pattern", "custom_len", "custom_bytes"];
};
mavlink20.messages.led_control.prototype = new mavlink20.message();
mavlink20.messages.led_control.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.instance, this.pattern, this.custom_len, this.custom_bytes];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mag_cal_progress = function(...moreargs) {
  [this.compass_id, this.cal_mask, this.cal_status, this.attempt, this.completion_pct, this.completion_mask, this.direction_x, this.direction_y, this.direction_z] = moreargs;
  this._format = "<fffBBBBB10s";
  this._id = mavlink20.MAVLINK_MSG_ID_MAG_CAL_PROGRESS;
  this.order_map = [3, 4, 5, 6, 7, 8, 0, 1, 2];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 10];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 10];
  this.crc_extra = 92;
  this._name = "MAG_CAL_PROGRESS";
  this._instance_field = "compass_id";
  this._instance_offset = 12;
  this.fieldnames = ["compass_id", "cal_mask", "cal_status", "attempt", "completion_pct", "completion_mask", "direction_x", "direction_y", "direction_z"];
};
mavlink20.messages.mag_cal_progress.prototype = new mavlink20.message();
mavlink20.messages.mag_cal_progress.prototype.pack = function(mav) {
  var orderedfields = [this.direction_x, this.direction_y, this.direction_z, this.compass_id, this.cal_mask, this.cal_status, this.attempt, this.completion_pct, this.completion_mask];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ekf_status_report = function(...moreargs) {
  [this.flags, this.velocity_variance, this.pos_horiz_variance, this.pos_vert_variance, this.compass_variance, this.terrain_alt_variance, this.airspeed_variance] = moreargs;
  this._format = "<fffffHf";
  this._id = mavlink20.MAVLINK_MSG_ID_EKF_STATUS_REPORT;
  this.order_map = [5, 0, 1, 2, 3, 4, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 71;
  this._name = "EKF_STATUS_REPORT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["flags", "velocity_variance", "pos_horiz_variance", "pos_vert_variance", "compass_variance", "terrain_alt_variance", "airspeed_variance"];
};
mavlink20.messages.ekf_status_report.prototype = new mavlink20.message();
mavlink20.messages.ekf_status_report.prototype.pack = function(mav) {
  var orderedfields = [this.velocity_variance, this.pos_horiz_variance, this.pos_vert_variance, this.compass_variance, this.terrain_alt_variance, this.flags, this.airspeed_variance];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.pid_tuning = function(...moreargs) {
  [this.axis, this.desired, this.achieved, this.FF, this.P, this.I, this.D, this.SRate, this.PDmod] = moreargs;
  this._format = "<ffffffBff";
  this._id = mavlink20.MAVLINK_MSG_ID_PID_TUNING;
  this.order_map = [6, 0, 1, 2, 3, 4, 5, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 98;
  this._name = "PID_TUNING";
  this._instance_field = "axis";
  this._instance_offset = 24;
  this.fieldnames = ["axis", "desired", "achieved", "FF", "P", "I", "D", "SRate", "PDmod"];
};
mavlink20.messages.pid_tuning.prototype = new mavlink20.message();
mavlink20.messages.pid_tuning.prototype.pack = function(mav) {
  var orderedfields = [this.desired, this.achieved, this.FF, this.P, this.I, this.D, this.axis, this.SRate, this.PDmod];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.deepstall = function(...moreargs) {
  [this.landing_lat, this.landing_lon, this.path_lat, this.path_lon, this.arc_entry_lat, this.arc_entry_lon, this.altitude, this.expected_travel_distance, this.cross_track_error, this.stage] = moreargs;
  this._format = "<iiiiiifffB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEEPSTALL;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 120;
  this._name = "DEEPSTALL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["landing_lat", "landing_lon", "path_lat", "path_lon", "arc_entry_lat", "arc_entry_lon", "altitude", "expected_travel_distance", "cross_track_error", "stage"];
};
mavlink20.messages.deepstall.prototype = new mavlink20.message();
mavlink20.messages.deepstall.prototype.pack = function(mav) {
  var orderedfields = [this.landing_lat, this.landing_lon, this.path_lat, this.path_lon, this.arc_entry_lat, this.arc_entry_lon, this.altitude, this.expected_travel_distance, this.cross_track_error, this.stage];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_report = function(...moreargs) {
  [this.target_system, this.target_component, this.delta_time, this.delta_angle_x, this.delta_angle_y, this.delta_angle_z, this.delta_velocity_x, this.delta_velocity_y, this.delta_velocity_z, this.joint_roll, this.joint_el, this.joint_az] = moreargs;
  this._format = "<ffffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_REPORT;
  this.order_map = [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 134;
  this._name = "GIMBAL_REPORT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "delta_time", "delta_angle_x", "delta_angle_y", "delta_angle_z", "delta_velocity_x", "delta_velocity_y", "delta_velocity_z", "joint_roll", "joint_el", "joint_az"];
};
mavlink20.messages.gimbal_report.prototype = new mavlink20.message();
mavlink20.messages.gimbal_report.prototype.pack = function(mav) {
  var orderedfields = [this.delta_time, this.delta_angle_x, this.delta_angle_y, this.delta_angle_z, this.delta_velocity_x, this.delta_velocity_y, this.delta_velocity_z, this.joint_roll, this.joint_el, this.joint_az, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_control = function(...moreargs) {
  [this.target_system, this.target_component, this.demanded_rate_x, this.demanded_rate_y, this.demanded_rate_z] = moreargs;
  this._format = "<fffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_CONTROL;
  this.order_map = [3, 4, 0, 1, 2];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 205;
  this._name = "GIMBAL_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "demanded_rate_x", "demanded_rate_y", "demanded_rate_z"];
};
mavlink20.messages.gimbal_control.prototype = new mavlink20.message();
mavlink20.messages.gimbal_control.prototype.pack = function(mav) {
  var orderedfields = [this.demanded_rate_x, this.demanded_rate_y, this.demanded_rate_z, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_torque_cmd_report = function(...moreargs) {
  [this.target_system, this.target_component, this.rl_torque_cmd, this.el_torque_cmd, this.az_torque_cmd] = moreargs;
  this._format = "<hhhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_TORQUE_CMD_REPORT;
  this.order_map = [3, 4, 0, 1, 2];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 69;
  this._name = "GIMBAL_TORQUE_CMD_REPORT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "rl_torque_cmd", "el_torque_cmd", "az_torque_cmd"];
};
mavlink20.messages.gimbal_torque_cmd_report.prototype = new mavlink20.message();
mavlink20.messages.gimbal_torque_cmd_report.prototype.pack = function(mav) {
  var orderedfields = [this.rl_torque_cmd, this.el_torque_cmd, this.az_torque_cmd, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gopro_heartbeat = function(...moreargs) {
  [this.status, this.capture_mode, this.flags] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GOPRO_HEARTBEAT;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 101;
  this._name = "GOPRO_HEARTBEAT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["status", "capture_mode", "flags"];
};
mavlink20.messages.gopro_heartbeat.prototype = new mavlink20.message();
mavlink20.messages.gopro_heartbeat.prototype.pack = function(mav) {
  var orderedfields = [this.status, this.capture_mode, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gopro_get_request = function(...moreargs) {
  [this.target_system, this.target_component, this.cmd_id] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GOPRO_GET_REQUEST;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 50;
  this._name = "GOPRO_GET_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "cmd_id"];
};
mavlink20.messages.gopro_get_request.prototype = new mavlink20.message();
mavlink20.messages.gopro_get_request.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.cmd_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gopro_get_response = function(...moreargs) {
  [this.cmd_id, this.status, this.value] = moreargs;
  this._format = "<BB4s";
  this._id = mavlink20.MAVLINK_MSG_ID_GOPRO_GET_RESPONSE;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 4];
  this.array_len_map = [0, 0, 4];
  this.crc_extra = 202;
  this._name = "GOPRO_GET_RESPONSE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["cmd_id", "status", "value"];
};
mavlink20.messages.gopro_get_response.prototype = new mavlink20.message();
mavlink20.messages.gopro_get_response.prototype.pack = function(mav) {
  var orderedfields = [this.cmd_id, this.status, this.value];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gopro_set_request = function(...moreargs) {
  [this.target_system, this.target_component, this.cmd_id, this.value] = moreargs;
  this._format = "<BBB4s";
  this._id = mavlink20.MAVLINK_MSG_ID_GOPRO_SET_REQUEST;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 4];
  this.array_len_map = [0, 0, 0, 4];
  this.crc_extra = 17;
  this._name = "GOPRO_SET_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "cmd_id", "value"];
};
mavlink20.messages.gopro_set_request.prototype = new mavlink20.message();
mavlink20.messages.gopro_set_request.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.cmd_id, this.value];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gopro_set_response = function(...moreargs) {
  [this.cmd_id, this.status] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_GOPRO_SET_RESPONSE;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 162;
  this._name = "GOPRO_SET_RESPONSE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["cmd_id", "status"];
};
mavlink20.messages.gopro_set_response.prototype = new mavlink20.message();
mavlink20.messages.gopro_set_response.prototype.pack = function(mav) {
  var orderedfields = [this.cmd_id, this.status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rpm = function(...moreargs) {
  [this.rpm1, this.rpm2] = moreargs;
  this._format = "<ff";
  this._id = mavlink20.MAVLINK_MSG_ID_RPM;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 207;
  this._name = "RPM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rpm1", "rpm2"];
};
mavlink20.messages.rpm.prototype = new mavlink20.message();
mavlink20.messages.rpm.prototype.pack = function(mav) {
  var orderedfields = [this.rpm1, this.rpm2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.device_op_read = function(...moreargs) {
  [this.target_system, this.target_component, this.request_id, this.bustype, this.bus, this.address, this.busname, this.regstart, this.count, this.bank] = moreargs;
  this._format = "<IBBBBB40sBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEVICE_OP_READ;
  this.order_map = [1, 2, 0, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 40, 0, 0, 0];
  this.crc_extra = 134;
  this._name = "DEVICE_OP_READ";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "request_id", "bustype", "bus", "address", "busname", "regstart", "count", "bank"];
};
mavlink20.messages.device_op_read.prototype = new mavlink20.message();
mavlink20.messages.device_op_read.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.target_system, this.target_component, this.bustype, this.bus, this.address, this.busname, this.regstart, this.count, this.bank];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.device_op_read_reply = function(...moreargs) {
  [this.request_id, this.result, this.regstart, this.count, this.data, this.bank] = moreargs;
  this._format = "<IBBB128sB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEVICE_OP_READ_REPLY;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 128, 1];
  this.array_len_map = [0, 0, 0, 0, 128, 0];
  this.crc_extra = 15;
  this._name = "DEVICE_OP_READ_REPLY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["request_id", "result", "regstart", "count", "data", "bank"];
};
mavlink20.messages.device_op_read_reply.prototype = new mavlink20.message();
mavlink20.messages.device_op_read_reply.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.result, this.regstart, this.count, this.data, this.bank];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.device_op_write = function(...moreargs) {
  [this.target_system, this.target_component, this.request_id, this.bustype, this.bus, this.address, this.busname, this.regstart, this.count, this.data, this.bank] = moreargs;
  this._format = "<IBBBBB40sBB128sB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEVICE_OP_WRITE;
  this.order_map = [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 128, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 40, 0, 0, 128, 0];
  this.crc_extra = 234;
  this._name = "DEVICE_OP_WRITE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "request_id", "bustype", "bus", "address", "busname", "regstart", "count", "data", "bank"];
};
mavlink20.messages.device_op_write.prototype = new mavlink20.message();
mavlink20.messages.device_op_write.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.target_system, this.target_component, this.bustype, this.bus, this.address, this.busname, this.regstart, this.count, this.data, this.bank];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.device_op_write_reply = function(...moreargs) {
  [this.request_id, this.result] = moreargs;
  this._format = "<IB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEVICE_OP_WRITE_REPLY;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 64;
  this._name = "DEVICE_OP_WRITE_REPLY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["request_id", "result"];
};
mavlink20.messages.device_op_write_reply.prototype = new mavlink20.message();
mavlink20.messages.device_op_write_reply.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.result];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.secure_command = function(...moreargs) {
  [this.target_system, this.target_component, this.sequence, this.operation, this.data_length, this.sig_length, this.data] = moreargs;
  this._format = "<IIBBBB220s";
  this._id = mavlink20.MAVLINK_MSG_ID_SECURE_COMMAND;
  this.order_map = [2, 3, 0, 1, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 220];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 220];
  this.crc_extra = 11;
  this._name = "SECURE_COMMAND";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "sequence", "operation", "data_length", "sig_length", "data"];
};
mavlink20.messages.secure_command.prototype = new mavlink20.message();
mavlink20.messages.secure_command.prototype.pack = function(mav) {
  var orderedfields = [this.sequence, this.operation, this.target_system, this.target_component, this.data_length, this.sig_length, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.secure_command_reply = function(...moreargs) {
  [this.sequence, this.operation, this.result, this.data_length, this.data] = moreargs;
  this._format = "<IIBB220s";
  this._id = mavlink20.MAVLINK_MSG_ID_SECURE_COMMAND_REPLY;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 220];
  this.array_len_map = [0, 0, 0, 0, 220];
  this.crc_extra = 93;
  this._name = "SECURE_COMMAND_REPLY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["sequence", "operation", "result", "data_length", "data"];
};
mavlink20.messages.secure_command_reply.prototype = new mavlink20.message();
mavlink20.messages.secure_command_reply.prototype.pack = function(mav) {
  var orderedfields = [this.sequence, this.operation, this.result, this.data_length, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.adap_tuning = function(...moreargs) {
  [this.axis, this.desired, this.achieved, this.error, this.theta, this.omega, this.sigma, this.theta_dot, this.omega_dot, this.sigma_dot, this.f, this.f_dot, this.u] = moreargs;
  this._format = "<ffffffffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_ADAP_TUNING;
  this.order_map = [12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 46;
  this._name = "ADAP_TUNING";
  this._instance_field = "axis";
  this._instance_offset = 48;
  this.fieldnames = ["axis", "desired", "achieved", "error", "theta", "omega", "sigma", "theta_dot", "omega_dot", "sigma_dot", "f", "f_dot", "u"];
};
mavlink20.messages.adap_tuning.prototype = new mavlink20.message();
mavlink20.messages.adap_tuning.prototype.pack = function(mav) {
  var orderedfields = [this.desired, this.achieved, this.error, this.theta, this.omega, this.sigma, this.theta_dot, this.omega_dot, this.sigma_dot, this.f, this.f_dot, this.u, this.axis];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vision_position_delta = function(...moreargs) {
  [this.time_usec, this.time_delta_usec, this.angle_delta, this.position_delta, this.confidence] = moreargs;
  this._format = "<QQ3f3ff";
  this._id = mavlink20.MAVLINK_MSG_ID_VISION_POSITION_DELTA;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 3, 3, 1];
  this.array_len_map = [0, 0, 3, 3, 0];
  this.crc_extra = 106;
  this._name = "VISION_POSITION_DELTA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "time_delta_usec", "angle_delta", "position_delta", "confidence"];
};
mavlink20.messages.vision_position_delta.prototype = new mavlink20.message();
mavlink20.messages.vision_position_delta.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.time_delta_usec, this.angle_delta, this.position_delta, this.confidence];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.aoa_ssa = function(...moreargs) {
  [this.time_usec, this.AOA, this.SSA] = moreargs;
  this._format = "<Qff";
  this._id = mavlink20.MAVLINK_MSG_ID_AOA_SSA;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 205;
  this._name = "AOA_SSA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "AOA", "SSA"];
};
mavlink20.messages.aoa_ssa.prototype = new mavlink20.message();
mavlink20.messages.aoa_ssa.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.AOA, this.SSA];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_1_to_4 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_1_TO_4;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 144;
  this._name = "ESC_TELEMETRY_1_TO_4";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_1_to_4.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_1_to_4.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_5_to_8 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_5_TO_8;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 133;
  this._name = "ESC_TELEMETRY_5_TO_8";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_5_to_8.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_5_to_8.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_9_to_12 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_9_TO_12;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 85;
  this._name = "ESC_TELEMETRY_9_TO_12";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_9_to_12.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_9_to_12.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.osd_param_config = function(...moreargs) {
  [this.target_system, this.target_component, this.request_id, this.osd_screen, this.osd_index, this.param_id, this.config_type, this.min_value, this.max_value, this.increment] = moreargs;
  this._format = "<IfffBBBB16sB";
  this._id = mavlink20.MAVLINK_MSG_ID_OSD_PARAM_CONFIG;
  this.order_map = [4, 5, 0, 6, 7, 8, 9, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 16, 0];
  this.crc_extra = 195;
  this._name = "OSD_PARAM_CONFIG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "request_id", "osd_screen", "osd_index", "param_id", "config_type", "min_value", "max_value", "increment"];
};
mavlink20.messages.osd_param_config.prototype = new mavlink20.message();
mavlink20.messages.osd_param_config.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.min_value, this.max_value, this.increment, this.target_system, this.target_component, this.osd_screen, this.osd_index, this.param_id, this.config_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.osd_param_config_reply = function(...moreargs) {
  [this.request_id, this.result] = moreargs;
  this._format = "<IB";
  this._id = mavlink20.MAVLINK_MSG_ID_OSD_PARAM_CONFIG_REPLY;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 79;
  this._name = "OSD_PARAM_CONFIG_REPLY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["request_id", "result"];
};
mavlink20.messages.osd_param_config_reply.prototype = new mavlink20.message();
mavlink20.messages.osd_param_config_reply.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.result];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.osd_param_show_config = function(...moreargs) {
  [this.target_system, this.target_component, this.request_id, this.osd_screen, this.osd_index] = moreargs;
  this._format = "<IBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OSD_PARAM_SHOW_CONFIG;
  this.order_map = [1, 2, 0, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 128;
  this._name = "OSD_PARAM_SHOW_CONFIG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "request_id", "osd_screen", "osd_index"];
};
mavlink20.messages.osd_param_show_config.prototype = new mavlink20.message();
mavlink20.messages.osd_param_show_config.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.target_system, this.target_component, this.osd_screen, this.osd_index];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.osd_param_show_config_reply = function(...moreargs) {
  [this.request_id, this.result, this.param_id, this.config_type, this.min_value, this.max_value, this.increment] = moreargs;
  this._format = "<IfffB16sB";
  this._id = mavlink20.MAVLINK_MSG_ID_OSD_PARAM_SHOW_CONFIG_REPLY;
  this.order_map = [0, 4, 5, 6, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 16, 0];
  this.crc_extra = 177;
  this._name = "OSD_PARAM_SHOW_CONFIG_REPLY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["request_id", "result", "param_id", "config_type", "min_value", "max_value", "increment"];
};
mavlink20.messages.osd_param_show_config_reply.prototype = new mavlink20.message();
mavlink20.messages.osd_param_show_config_reply.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.min_value, this.max_value, this.increment, this.result, this.param_id, this.config_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.obstacle_distance_3d = function(...moreargs) {
  [this.time_boot_ms, this.sensor_type, this.frame, this.obstacle_id, this.x, this.y, this.z, this.min_distance, this.max_distance] = moreargs;
  this._format = "<IfffffHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OBSTACLE_DISTANCE_3D;
  this.order_map = [0, 7, 8, 6, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 130;
  this._name = "OBSTACLE_DISTANCE_3D";
  this._instance_field = "obstacle_id";
  this._instance_offset = 24;
  this.fieldnames = ["time_boot_ms", "sensor_type", "frame", "obstacle_id", "x", "y", "z", "min_distance", "max_distance"];
};
mavlink20.messages.obstacle_distance_3d.prototype = new mavlink20.message();
mavlink20.messages.obstacle_distance_3d.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.x, this.y, this.z, this.min_distance, this.max_distance, this.obstacle_id, this.sensor_type, this.frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.water_depth = function(...moreargs) {
  [this.time_boot_ms, this.id, this.healthy, this.lat, this.lng, this.alt, this.roll, this.pitch, this.yaw, this.distance, this.temperature] = moreargs;
  this._format = "<IiiffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_WATER_DEPTH;
  this.order_map = [0, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 47;
  this._name = "WATER_DEPTH";
  this._instance_field = "id";
  this._instance_offset = 36;
  this.fieldnames = ["time_boot_ms", "id", "healthy", "lat", "lng", "alt", "roll", "pitch", "yaw", "distance", "temperature"];
};
mavlink20.messages.water_depth.prototype = new mavlink20.message();
mavlink20.messages.water_depth.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat, this.lng, this.alt, this.roll, this.pitch, this.yaw, this.distance, this.temperature, this.id, this.healthy];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mcu_status = function(...moreargs) {
  [this.id, this.MCU_temperature, this.MCU_voltage, this.MCU_voltage_min, this.MCU_voltage_max] = moreargs;
  this._format = "<hHHHB";
  this._id = mavlink20.MAVLINK_MSG_ID_MCU_STATUS;
  this.order_map = [4, 0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 142;
  this._name = "MCU_STATUS";
  this._instance_field = "id";
  this._instance_offset = 8;
  this.fieldnames = ["id", "MCU_temperature", "MCU_voltage", "MCU_voltage_min", "MCU_voltage_max"];
};
mavlink20.messages.mcu_status.prototype = new mavlink20.message();
mavlink20.messages.mcu_status.prototype.pack = function(mav) {
  var orderedfields = [this.MCU_temperature, this.MCU_voltage, this.MCU_voltage_min, this.MCU_voltage_max, this.id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_13_to_16 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_13_TO_16;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 132;
  this._name = "ESC_TELEMETRY_13_TO_16";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_13_to_16.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_13_to_16.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_17_to_20 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_17_TO_20;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 208;
  this._name = "ESC_TELEMETRY_17_TO_20";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_17_to_20.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_17_to_20.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_21_to_24 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_21_TO_24;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 201;
  this._name = "ESC_TELEMETRY_21_TO_24";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_21_to_24.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_21_to_24.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_25_to_28 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_25_TO_28;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 193;
  this._name = "ESC_TELEMETRY_25_TO_28";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_25_to_28.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_25_to_28.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.esc_telemetry_29_to_32 = function(...moreargs) {
  [this.temperature, this.voltage, this.current, this.totalcurrent, this.rpm, this.count] = moreargs;
  this._format = "<4H4H4H4H4H4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ESC_TELEMETRY_29_TO_32;
  this.order_map = [5, 0, 1, 2, 3, 4];
  this.len_map = [4, 4, 4, 4, 4, 4];
  this.array_len_map = [4, 4, 4, 4, 4, 4];
  this.crc_extra = 189;
  this._name = "ESC_TELEMETRY_29_TO_32";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["temperature", "voltage", "current", "totalcurrent", "rpm", "count"];
};
mavlink20.messages.esc_telemetry_29_to_32.prototype = new mavlink20.message();
mavlink20.messages.esc_telemetry_29_to_32.prototype.pack = function(mav) {
  var orderedfields = [this.voltage, this.current, this.totalcurrent, this.rpm, this.count, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.command_int_stamped = function(...moreargs) {
  [this.utc_time, this.vehicle_timestamp, this.target_system, this.target_component, this.frame, this.command, this.current, this.autocontinue, this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z] = moreargs;
  this._format = "<QIffffiifHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMMAND_INT_STAMPED;
  this.order_map = [1, 0, 10, 11, 12, 9, 13, 14, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 119;
  this._name = "COMMAND_INT_STAMPED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["utc_time", "vehicle_timestamp", "target_system", "target_component", "frame", "command", "current", "autocontinue", "param1", "param2", "param3", "param4", "x", "y", "z"];
};
mavlink20.messages.command_int_stamped.prototype = new mavlink20.message();
mavlink20.messages.command_int_stamped.prototype.pack = function(mav) {
  var orderedfields = [this.vehicle_timestamp, this.utc_time, this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.command, this.target_system, this.target_component, this.frame, this.current, this.autocontinue];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.command_long_stamped = function(...moreargs) {
  [this.utc_time, this.vehicle_timestamp, this.target_system, this.target_component, this.command, this.confirmation, this.param1, this.param2, this.param3, this.param4, this.param5, this.param6, this.param7] = moreargs;
  this._format = "<QIfffffffHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMMAND_LONG_STAMPED;
  this.order_map = [1, 0, 10, 11, 9, 12, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 102;
  this._name = "COMMAND_LONG_STAMPED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["utc_time", "vehicle_timestamp", "target_system", "target_component", "command", "confirmation", "param1", "param2", "param3", "param4", "param5", "param6", "param7"];
};
mavlink20.messages.command_long_stamped.prototype = new mavlink20.message();
mavlink20.messages.command_long_stamped.prototype.pack = function(mav) {
  var orderedfields = [this.vehicle_timestamp, this.utc_time, this.param1, this.param2, this.param3, this.param4, this.param5, this.param6, this.param7, this.command, this.target_system, this.target_component, this.confirmation];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sens_power = function(...moreargs) {
  [this.adc121_vspb_volt, this.adc121_cspb_amp, this.adc121_cs1_amp, this.adc121_cs2_amp] = moreargs;
  this._format = "<ffff";
  this._id = mavlink20.MAVLINK_MSG_ID_SENS_POWER;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 218;
  this._name = "SENS_POWER";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["adc121_vspb_volt", "adc121_cspb_amp", "adc121_cs1_amp", "adc121_cs2_amp"];
};
mavlink20.messages.sens_power.prototype = new mavlink20.message();
mavlink20.messages.sens_power.prototype.pack = function(mav) {
  var orderedfields = [this.adc121_vspb_volt, this.adc121_cspb_amp, this.adc121_cs1_amp, this.adc121_cs2_amp];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sens_mppt = function(...moreargs) {
  [this.mppt_timestamp, this.mppt1_volt, this.mppt1_amp, this.mppt1_pwm, this.mppt1_status, this.mppt2_volt, this.mppt2_amp, this.mppt2_pwm, this.mppt2_status, this.mppt3_volt, this.mppt3_amp, this.mppt3_pwm, this.mppt3_status] = moreargs;
  this._format = "<QffffffHHHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SENS_MPPT;
  this.order_map = [0, 1, 2, 7, 10, 3, 4, 8, 11, 5, 6, 9, 12];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 231;
  this._name = "SENS_MPPT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["mppt_timestamp", "mppt1_volt", "mppt1_amp", "mppt1_pwm", "mppt1_status", "mppt2_volt", "mppt2_amp", "mppt2_pwm", "mppt2_status", "mppt3_volt", "mppt3_amp", "mppt3_pwm", "mppt3_status"];
};
mavlink20.messages.sens_mppt.prototype = new mavlink20.message();
mavlink20.messages.sens_mppt.prototype.pack = function(mav) {
  var orderedfields = [this.mppt_timestamp, this.mppt1_volt, this.mppt1_amp, this.mppt2_volt, this.mppt2_amp, this.mppt3_volt, this.mppt3_amp, this.mppt1_pwm, this.mppt2_pwm, this.mppt3_pwm, this.mppt1_status, this.mppt2_status, this.mppt3_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.aslctrl_data = function(...moreargs) {
  [this.timestamp, this.aslctrl_mode, this.h, this.hRef, this.hRef_t, this.PitchAngle, this.PitchAngleRef, this.q, this.qRef, this.uElev, this.uThrot, this.uThrot2, this.nZ, this.AirspeedRef, this.SpoilersEngaged, this.YawAngle, this.YawAngleRef, this.RollAngle, this.RollAngleRef, this.p, this.pRef, this.r, this.rRef, this.uAil, this.uRud] = moreargs;
  this._format = "<QffffffffffffffffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_ASLCTRL_DATA;
  this.order_map = [0, 23, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 172;
  this._name = "ASLCTRL_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "aslctrl_mode", "h", "hRef", "hRef_t", "PitchAngle", "PitchAngleRef", "q", "qRef", "uElev", "uThrot", "uThrot2", "nZ", "AirspeedRef", "SpoilersEngaged", "YawAngle", "YawAngleRef", "RollAngle", "RollAngleRef", "p", "pRef", "r", "rRef", "uAil", "uRud"];
};
mavlink20.messages.aslctrl_data.prototype = new mavlink20.message();
mavlink20.messages.aslctrl_data.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.h, this.hRef, this.hRef_t, this.PitchAngle, this.PitchAngleRef, this.q, this.qRef, this.uElev, this.uThrot, this.uThrot2, this.nZ, this.AirspeedRef, this.YawAngle, this.YawAngleRef, this.RollAngle, this.RollAngleRef, this.p, this.pRef, this.r, this.rRef, this.uAil, this.uRud, this.aslctrl_mode, this.SpoilersEngaged];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.aslctrl_debug = function(...moreargs) {
  [this.i32_1, this.i8_1, this.i8_2, this.f_1, this.f_2, this.f_3, this.f_4, this.f_5, this.f_6, this.f_7, this.f_8] = moreargs;
  this._format = "<IffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_ASLCTRL_DEBUG;
  this.order_map = [0, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 251;
  this._name = "ASLCTRL_DEBUG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["i32_1", "i8_1", "i8_2", "f_1", "f_2", "f_3", "f_4", "f_5", "f_6", "f_7", "f_8"];
};
mavlink20.messages.aslctrl_debug.prototype = new mavlink20.message();
mavlink20.messages.aslctrl_debug.prototype.pack = function(mav) {
  var orderedfields = [this.i32_1, this.f_1, this.f_2, this.f_3, this.f_4, this.f_5, this.f_6, this.f_7, this.f_8, this.i8_1, this.i8_2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.asluav_status = function(...moreargs) {
  [this.LED_status, this.SATCOM_status, this.Servo_status, this.Motor_rpm] = moreargs;
  this._format = "<fBB8s";
  this._id = mavlink20.MAVLINK_MSG_ID_ASLUAV_STATUS;
  this.order_map = [1, 2, 3, 0];
  this.len_map = [1, 1, 1, 8];
  this.array_len_map = [0, 0, 0, 8];
  this.crc_extra = 97;
  this._name = "ASLUAV_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["LED_status", "SATCOM_status", "Servo_status", "Motor_rpm"];
};
mavlink20.messages.asluav_status.prototype = new mavlink20.message();
mavlink20.messages.asluav_status.prototype.pack = function(mav) {
  var orderedfields = [this.Motor_rpm, this.LED_status, this.SATCOM_status, this.Servo_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ekf_ext = function(...moreargs) {
  [this.timestamp, this.Windspeed, this.WindDir, this.WindZ, this.Airspeed, this.beta, this.alpha] = moreargs;
  this._format = "<Qffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_EKF_EXT;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 64;
  this._name = "EKF_EXT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "Windspeed", "WindDir", "WindZ", "Airspeed", "beta", "alpha"];
};
mavlink20.messages.ekf_ext.prototype = new mavlink20.message();
mavlink20.messages.ekf_ext.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.Windspeed, this.WindDir, this.WindZ, this.Airspeed, this.beta, this.alpha];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.asl_obctrl = function(...moreargs) {
  [this.timestamp, this.uElev, this.uThrot, this.uThrot2, this.uAilL, this.uAilR, this.uRud, this.obctrl_status] = moreargs;
  this._format = "<QffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_ASL_OBCTRL;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 234;
  this._name = "ASL_OBCTRL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "uElev", "uThrot", "uThrot2", "uAilL", "uAilR", "uRud", "obctrl_status"];
};
mavlink20.messages.asl_obctrl.prototype = new mavlink20.message();
mavlink20.messages.asl_obctrl.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.uElev, this.uThrot, this.uThrot2, this.uAilL, this.uAilR, this.uRud, this.obctrl_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sens_atmos = function(...moreargs) {
  [this.timestamp, this.TempAmbient, this.Humidity] = moreargs;
  this._format = "<Qff";
  this._id = mavlink20.MAVLINK_MSG_ID_SENS_ATMOS;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 144;
  this._name = "SENS_ATMOS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "TempAmbient", "Humidity"];
};
mavlink20.messages.sens_atmos.prototype = new mavlink20.message();
mavlink20.messages.sens_atmos.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.TempAmbient, this.Humidity];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sens_batmon = function(...moreargs) {
  [this.batmon_timestamp, this.temperature, this.voltage, this.current, this.SoC, this.batterystatus, this.serialnumber, this.safetystatus, this.operationstatus, this.cellvoltage1, this.cellvoltage2, this.cellvoltage3, this.cellvoltage4, this.cellvoltage5, this.cellvoltage6] = moreargs;
  this._format = "<QfIIHhHHHHHHHHB";
  this._id = mavlink20.MAVLINK_MSG_ID_SENS_BATMON;
  this.order_map = [0, 1, 4, 5, 14, 6, 7, 2, 3, 8, 9, 10, 11, 12, 13];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 155;
  this._name = "SENS_BATMON";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["batmon_timestamp", "temperature", "voltage", "current", "SoC", "batterystatus", "serialnumber", "safetystatus", "operationstatus", "cellvoltage1", "cellvoltage2", "cellvoltage3", "cellvoltage4", "cellvoltage5", "cellvoltage6"];
};
mavlink20.messages.sens_batmon.prototype = new mavlink20.message();
mavlink20.messages.sens_batmon.prototype.pack = function(mav) {
  var orderedfields = [this.batmon_timestamp, this.temperature, this.safetystatus, this.operationstatus, this.voltage, this.current, this.batterystatus, this.serialnumber, this.cellvoltage1, this.cellvoltage2, this.cellvoltage3, this.cellvoltage4, this.cellvoltage5, this.cellvoltage6, this.SoC];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.fw_soaring_data = function(...moreargs) {
  [this.timestamp, this.timestampModeChanged, this.xW, this.xR, this.xLat, this.xLon, this.VarW, this.VarR, this.VarLat, this.VarLon, this.LoiterRadius, this.LoiterDirection, this.DistToSoarPoint, this.vSinkExp, this.z1_LocalUpdraftSpeed, this.z2_DeltaRoll, this.z1_exp, this.z2_exp, this.ThermalGSNorth, this.ThermalGSEast, this.TSE_dot, this.DebugVar1, this.DebugVar2, this.ControlMode, this.valid] = moreargs;
  this._format = "<QQfffffffffffffffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_FW_SOARING_DATA;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 20;
  this._name = "FW_SOARING_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "timestampModeChanged", "xW", "xR", "xLat", "xLon", "VarW", "VarR", "VarLat", "VarLon", "LoiterRadius", "LoiterDirection", "DistToSoarPoint", "vSinkExp", "z1_LocalUpdraftSpeed", "z2_DeltaRoll", "z1_exp", "z2_exp", "ThermalGSNorth", "ThermalGSEast", "TSE_dot", "DebugVar1", "DebugVar2", "ControlMode", "valid"];
};
mavlink20.messages.fw_soaring_data.prototype = new mavlink20.message();
mavlink20.messages.fw_soaring_data.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.timestampModeChanged, this.xW, this.xR, this.xLat, this.xLon, this.VarW, this.VarR, this.VarLat, this.VarLon, this.LoiterRadius, this.LoiterDirection, this.DistToSoarPoint, this.vSinkExp, this.z1_LocalUpdraftSpeed, this.z2_DeltaRoll, this.z1_exp, this.z2_exp, this.ThermalGSNorth, this.ThermalGSEast, this.TSE_dot, this.DebugVar1, this.DebugVar2, this.ControlMode, this.valid];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sensorpod_status = function(...moreargs) {
  [this.timestamp, this.visensor_rate_1, this.visensor_rate_2, this.visensor_rate_3, this.visensor_rate_4, this.recording_nodes_count, this.cpu_temp, this.free_space] = moreargs;
  this._format = "<QHBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SENSORPOD_STATUS;
  this.order_map = [0, 2, 3, 4, 5, 6, 7, 1];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 54;
  this._name = "SENSORPOD_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "visensor_rate_1", "visensor_rate_2", "visensor_rate_3", "visensor_rate_4", "recording_nodes_count", "cpu_temp", "free_space"];
};
mavlink20.messages.sensorpod_status.prototype = new mavlink20.message();
mavlink20.messages.sensorpod_status.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.free_space, this.visensor_rate_1, this.visensor_rate_2, this.visensor_rate_3, this.visensor_rate_4, this.recording_nodes_count, this.cpu_temp];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sens_power_board = function(...moreargs) {
  [this.timestamp, this.pwr_brd_status, this.pwr_brd_led_status, this.pwr_brd_system_volt, this.pwr_brd_servo_volt, this.pwr_brd_digital_volt, this.pwr_brd_mot_l_amp, this.pwr_brd_mot_r_amp, this.pwr_brd_analog_amp, this.pwr_brd_digital_amp, this.pwr_brd_ext_amp, this.pwr_brd_aux_amp] = moreargs;
  this._format = "<QfffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SENS_POWER_BOARD;
  this.order_map = [0, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 222;
  this._name = "SENS_POWER_BOARD";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "pwr_brd_status", "pwr_brd_led_status", "pwr_brd_system_volt", "pwr_brd_servo_volt", "pwr_brd_digital_volt", "pwr_brd_mot_l_amp", "pwr_brd_mot_r_amp", "pwr_brd_analog_amp", "pwr_brd_digital_amp", "pwr_brd_ext_amp", "pwr_brd_aux_amp"];
};
mavlink20.messages.sens_power_board.prototype = new mavlink20.message();
mavlink20.messages.sens_power_board.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.pwr_brd_system_volt, this.pwr_brd_servo_volt, this.pwr_brd_digital_volt, this.pwr_brd_mot_l_amp, this.pwr_brd_mot_r_amp, this.pwr_brd_analog_amp, this.pwr_brd_digital_amp, this.pwr_brd_ext_amp, this.pwr_brd_aux_amp, this.pwr_brd_status, this.pwr_brd_led_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gsm_link_status = function(...moreargs) {
  [this.timestamp, this.gsm_modem_type, this.gsm_link_type, this.rssi, this.rsrp_rscp, this.sinr_ecio, this.rsrq] = moreargs;
  this._format = "<QBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GSM_LINK_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 200;
  this._name = "GSM_LINK_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "gsm_modem_type", "gsm_link_type", "rssi", "rsrp_rscp", "sinr_ecio", "rsrq"];
};
mavlink20.messages.gsm_link_status.prototype = new mavlink20.message();
mavlink20.messages.gsm_link_status.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.gsm_modem_type, this.gsm_link_type, this.rssi, this.rsrp_rscp, this.sinr_ecio, this.rsrq];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.satcom_link_status = function(...moreargs) {
  [this.timestamp, this.last_heartbeat, this.failed_sessions, this.successful_sessions, this.signal_quality, this.ring_pending, this.tx_session_pending, this.rx_session_pending] = moreargs;
  this._format = "<QQHHBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SATCOM_LINK_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 23;
  this._name = "SATCOM_LINK_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "last_heartbeat", "failed_sessions", "successful_sessions", "signal_quality", "ring_pending", "tx_session_pending", "rx_session_pending"];
};
mavlink20.messages.satcom_link_status.prototype = new mavlink20.message();
mavlink20.messages.satcom_link_status.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.last_heartbeat, this.failed_sessions, this.successful_sessions, this.signal_quality, this.ring_pending, this.tx_session_pending, this.rx_session_pending];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sensor_airflow_angles = function(...moreargs) {
  [this.timestamp, this.angleofattack, this.angleofattack_valid, this.sideslip, this.sideslip_valid] = moreargs;
  this._format = "<QffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SENSOR_AIRFLOW_ANGLES;
  this.order_map = [0, 1, 3, 2, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 149;
  this._name = "SENSOR_AIRFLOW_ANGLES";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "angleofattack", "angleofattack_valid", "sideslip", "sideslip_valid"];
};
mavlink20.messages.sensor_airflow_angles.prototype = new mavlink20.message();
mavlink20.messages.sensor_airflow_angles.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.angleofattack, this.sideslip, this.angleofattack_valid, this.sideslip_valid];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sys_status = function(...moreargs) {
  [this.onboard_control_sensors_present, this.onboard_control_sensors_enabled, this.onboard_control_sensors_health, this.load, this.voltage_battery, this.current_battery, this.battery_remaining, this.drop_rate_comm, this.errors_comm, this.errors_count1, this.errors_count2, this.errors_count3, this.errors_count4] = moreargs;
  this._format = "<IIIHHhHHHHHHb";
  this._id = mavlink20.MAVLINK_MSG_ID_SYS_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 12, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 124;
  this._name = "SYS_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["onboard_control_sensors_present", "onboard_control_sensors_enabled", "onboard_control_sensors_health", "load", "voltage_battery", "current_battery", "battery_remaining", "drop_rate_comm", "errors_comm", "errors_count1", "errors_count2", "errors_count3", "errors_count4"];
};
mavlink20.messages.sys_status.prototype = new mavlink20.message();
mavlink20.messages.sys_status.prototype.pack = function(mav) {
  var orderedfields = [this.onboard_control_sensors_present, this.onboard_control_sensors_enabled, this.onboard_control_sensors_health, this.load, this.voltage_battery, this.current_battery, this.drop_rate_comm, this.errors_comm, this.errors_count1, this.errors_count2, this.errors_count3, this.errors_count4, this.battery_remaining];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.system_time = function(...moreargs) {
  [this.time_unix_usec, this.time_boot_ms] = moreargs;
  this._format = "<QI";
  this._id = mavlink20.MAVLINK_MSG_ID_SYSTEM_TIME;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 137;
  this._name = "SYSTEM_TIME";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_unix_usec", "time_boot_ms"];
};
mavlink20.messages.system_time.prototype = new mavlink20.message();
mavlink20.messages.system_time.prototype.pack = function(mav) {
  var orderedfields = [this.time_unix_usec, this.time_boot_ms];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ping = function(...moreargs) {
  [this.time_usec, this.seq, this.target_system, this.target_component] = moreargs;
  this._format = "<QIBB";
  this._id = mavlink20.MAVLINK_MSG_ID_PING;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 237;
  this._name = "PING";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "seq", "target_system", "target_component"];
};
mavlink20.messages.ping.prototype = new mavlink20.message();
mavlink20.messages.ping.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.seq, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.change_operator_control = function(...moreargs) {
  [this.target_system, this.control_request, this.version, this.passkey] = moreargs;
  this._format = "<BBB25s";
  this._id = mavlink20.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 25];
  this.crc_extra = 217;
  this._name = "CHANGE_OPERATOR_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "control_request", "version", "passkey"];
};
mavlink20.messages.change_operator_control.prototype = new mavlink20.message();
mavlink20.messages.change_operator_control.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.control_request, this.version, this.passkey];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.change_operator_control_ack = function(...moreargs) {
  [this.gcs_system_id, this.control_request, this.ack] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL_ACK;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 104;
  this._name = "CHANGE_OPERATOR_CONTROL_ACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["gcs_system_id", "control_request", "ack"];
};
mavlink20.messages.change_operator_control_ack.prototype = new mavlink20.message();
mavlink20.messages.change_operator_control_ack.prototype.pack = function(mav) {
  var orderedfields = [this.gcs_system_id, this.control_request, this.ack];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.auth_key = function(...moreargs) {
  [this.key] = moreargs;
  this._format = "<32s";
  this._id = mavlink20.MAVLINK_MSG_ID_AUTH_KEY;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [32];
  this.crc_extra = 119;
  this._name = "AUTH_KEY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["key"];
};
mavlink20.messages.auth_key.prototype = new mavlink20.message();
mavlink20.messages.auth_key.prototype.pack = function(mav) {
  var orderedfields = [this.key];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_mode = function(...moreargs) {
  [this.target_system, this.base_mode, this.custom_mode] = moreargs;
  this._format = "<IBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_MODE;
  this.order_map = [1, 2, 0];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 89;
  this._name = "SET_MODE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "base_mode", "custom_mode"];
};
mavlink20.messages.set_mode.prototype = new mavlink20.message();
mavlink20.messages.set_mode.prototype.pack = function(mav) {
  var orderedfields = [this.custom_mode, this.target_system, this.base_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_request_read = function(...moreargs) {
  [this.target_system, this.target_component, this.param_id, this.param_index] = moreargs;
  this._format = "<hBB16s";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_REQUEST_READ;
  this.order_map = [1, 2, 3, 0];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 16];
  this.crc_extra = 214;
  this._name = "PARAM_REQUEST_READ";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "param_id", "param_index"];
};
mavlink20.messages.param_request_read.prototype = new mavlink20.message();
mavlink20.messages.param_request_read.prototype.pack = function(mav) {
  var orderedfields = [this.param_index, this.target_system, this.target_component, this.param_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_request_list = function(...moreargs) {
  [this.target_system, this.target_component] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_REQUEST_LIST;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 159;
  this._name = "PARAM_REQUEST_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component"];
};
mavlink20.messages.param_request_list.prototype = new mavlink20.message();
mavlink20.messages.param_request_list.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_value = function(...moreargs) {
  [this.param_id, this.param_value, this.param_type, this.param_count, this.param_index] = moreargs;
  this._format = "<fHH16sB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_VALUE;
  this.order_map = [3, 0, 4, 1, 2];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 16, 0];
  this.crc_extra = 220;
  this._name = "PARAM_VALUE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["param_id", "param_value", "param_type", "param_count", "param_index"];
};
mavlink20.messages.param_value.prototype = new mavlink20.message();
mavlink20.messages.param_value.prototype.pack = function(mav) {
  var orderedfields = [this.param_value, this.param_count, this.param_index, this.param_id, this.param_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_set = function(...moreargs) {
  [this.target_system, this.target_component, this.param_id, this.param_value, this.param_type] = moreargs;
  this._format = "<fBB16sB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_SET;
  this.order_map = [1, 2, 3, 0, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 16, 0];
  this.crc_extra = 168;
  this._name = "PARAM_SET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "param_id", "param_value", "param_type"];
};
mavlink20.messages.param_set.prototype = new mavlink20.message();
mavlink20.messages.param_set.prototype.pack = function(mav) {
  var orderedfields = [this.param_value, this.target_system, this.target_component, this.param_id, this.param_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_raw_int = function(...moreargs) {
  [this.time_usec, this.fix_type, this.lat, this.lon, this.alt, this.eph, this.epv, this.vel, this.cog, this.satellites_visible, this.alt_ellipsoid, this.h_acc, this.v_acc, this.vel_acc, this.hdg_acc, this.yaw] = moreargs;
  this._format = "<QiiiHHHHBBiIIIIH";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_RAW_INT;
  this.order_map = [0, 8, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 24;
  this._name = "GPS_RAW_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "fix_type", "lat", "lon", "alt", "eph", "epv", "vel", "cog", "satellites_visible", "alt_ellipsoid", "h_acc", "v_acc", "vel_acc", "hdg_acc", "yaw"];
};
mavlink20.messages.gps_raw_int.prototype = new mavlink20.message();
mavlink20.messages.gps_raw_int.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.lat, this.lon, this.alt, this.eph, this.epv, this.vel, this.cog, this.fix_type, this.satellites_visible, this.alt_ellipsoid, this.h_acc, this.v_acc, this.vel_acc, this.hdg_acc, this.yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_status = function(...moreargs) {
  [this.satellites_visible, this.satellite_prn, this.satellite_used, this.satellite_elevation, this.satellite_azimuth, this.satellite_snr] = moreargs;
  this._format = "<B20s20s20s20s20s";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 20, 20, 20, 20, 20];
  this.array_len_map = [0, 20, 20, 20, 20, 20];
  this.crc_extra = 23;
  this._name = "GPS_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["satellites_visible", "satellite_prn", "satellite_used", "satellite_elevation", "satellite_azimuth", "satellite_snr"];
};
mavlink20.messages.gps_status.prototype = new mavlink20.message();
mavlink20.messages.gps_status.prototype.pack = function(mav) {
  var orderedfields = [this.satellites_visible, this.satellite_prn, this.satellite_used, this.satellite_elevation, this.satellite_azimuth, this.satellite_snr];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_imu = function(...moreargs) {
  [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature] = moreargs;
  this._format = "<Ihhhhhhhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_IMU;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 170;
  this._name = "SCALED_IMU";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "temperature"];
};
mavlink20.messages.scaled_imu.prototype = new mavlink20.message();
mavlink20.messages.scaled_imu.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.raw_imu = function(...moreargs) {
  [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.id, this.temperature] = moreargs;
  this._format = "<QhhhhhhhhhBh";
  this._id = mavlink20.MAVLINK_MSG_ID_RAW_IMU;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 144;
  this._name = "RAW_IMU";
  this._instance_field = "id";
  this._instance_offset = 26;
  this.fieldnames = ["time_usec", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "id", "temperature"];
};
mavlink20.messages.raw_imu.prototype = new mavlink20.message();
mavlink20.messages.raw_imu.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.id, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.raw_pressure = function(...moreargs) {
  [this.time_usec, this.press_abs, this.press_diff1, this.press_diff2, this.temperature] = moreargs;
  this._format = "<Qhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_RAW_PRESSURE;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 67;
  this._name = "RAW_PRESSURE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "press_abs", "press_diff1", "press_diff2", "temperature"];
};
mavlink20.messages.raw_pressure.prototype = new mavlink20.message();
mavlink20.messages.raw_pressure.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.press_abs, this.press_diff1, this.press_diff2, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_pressure = function(...moreargs) {
  [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff] = moreargs;
  this._format = "<Iffhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 115;
  this._name = "SCALED_PRESSURE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "press_abs", "press_diff", "temperature", "temperature_press_diff"];
};
mavlink20.messages.scaled_pressure.prototype = new mavlink20.message();
mavlink20.messages.scaled_pressure.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.attitude = function(...moreargs) {
  [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.rollspeed, this.pitchspeed, this.yawspeed] = moreargs;
  this._format = "<Iffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_ATTITUDE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 39;
  this._name = "ATTITUDE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "roll", "pitch", "yaw", "rollspeed", "pitchspeed", "yawspeed"];
};
mavlink20.messages.attitude.prototype = new mavlink20.message();
mavlink20.messages.attitude.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.rollspeed, this.pitchspeed, this.yawspeed];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.attitude_quaternion = function(...moreargs) {
  [this.time_boot_ms, this.q1, this.q2, this.q3, this.q4, this.rollspeed, this.pitchspeed, this.yawspeed, this.repr_offset_q] = moreargs;
  this._format = "<Ifffffff4f";
  this._id = mavlink20.MAVLINK_MSG_ID_ATTITUDE_QUATERNION;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 4];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 4];
  this.crc_extra = 246;
  this._name = "ATTITUDE_QUATERNION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "q1", "q2", "q3", "q4", "rollspeed", "pitchspeed", "yawspeed", "repr_offset_q"];
};
mavlink20.messages.attitude_quaternion.prototype = new mavlink20.message();
mavlink20.messages.attitude_quaternion.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q1, this.q2, this.q3, this.q4, this.rollspeed, this.pitchspeed, this.yawspeed, this.repr_offset_q];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.local_position_ned = function(...moreargs) {
  [this.time_boot_ms, this.x, this.y, this.z, this.vx, this.vy, this.vz] = moreargs;
  this._format = "<Iffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 185;
  this._name = "LOCAL_POSITION_NED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "x", "y", "z", "vx", "vy", "vz"];
};
mavlink20.messages.local_position_ned.prototype = new mavlink20.message();
mavlink20.messages.local_position_ned.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.x, this.y, this.z, this.vx, this.vy, this.vz];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.global_position_int = function(...moreargs) {
  [this.time_boot_ms, this.lat, this.lon, this.alt, this.relative_alt, this.vx, this.vy, this.vz, this.hdg] = moreargs;
  this._format = "<IiiiihhhH";
  this._id = mavlink20.MAVLINK_MSG_ID_GLOBAL_POSITION_INT;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 104;
  this._name = "GLOBAL_POSITION_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "lat", "lon", "alt", "relative_alt", "vx", "vy", "vz", "hdg"];
};
mavlink20.messages.global_position_int.prototype = new mavlink20.message();
mavlink20.messages.global_position_int.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat, this.lon, this.alt, this.relative_alt, this.vx, this.vy, this.vz, this.hdg];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rc_channels_scaled = function(...moreargs) {
  [this.time_boot_ms, this.port, this.chan1_scaled, this.chan2_scaled, this.chan3_scaled, this.chan4_scaled, this.chan5_scaled, this.chan6_scaled, this.chan7_scaled, this.chan8_scaled, this.rssi] = moreargs;
  this._format = "<IhhhhhhhhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_SCALED;
  this.order_map = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 237;
  this._name = "RC_CHANNELS_SCALED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "port", "chan1_scaled", "chan2_scaled", "chan3_scaled", "chan4_scaled", "chan5_scaled", "chan6_scaled", "chan7_scaled", "chan8_scaled", "rssi"];
};
mavlink20.messages.rc_channels_scaled.prototype = new mavlink20.message();
mavlink20.messages.rc_channels_scaled.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.chan1_scaled, this.chan2_scaled, this.chan3_scaled, this.chan4_scaled, this.chan5_scaled, this.chan6_scaled, this.chan7_scaled, this.chan8_scaled, this.port, this.rssi];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rc_channels_raw = function(...moreargs) {
  [this.time_boot_ms, this.port, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.rssi] = moreargs;
  this._format = "<IHHHHHHHHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_RAW;
  this.order_map = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 244;
  this._name = "RC_CHANNELS_RAW";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "port", "chan1_raw", "chan2_raw", "chan3_raw", "chan4_raw", "chan5_raw", "chan6_raw", "chan7_raw", "chan8_raw", "rssi"];
};
mavlink20.messages.rc_channels_raw.prototype = new mavlink20.message();
mavlink20.messages.rc_channels_raw.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.port, this.rssi];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.servo_output_raw = function(...moreargs) {
  [this.time_usec, this.port, this.servo1_raw, this.servo2_raw, this.servo3_raw, this.servo4_raw, this.servo5_raw, this.servo6_raw, this.servo7_raw, this.servo8_raw, this.servo9_raw, this.servo10_raw, this.servo11_raw, this.servo12_raw, this.servo13_raw, this.servo14_raw, this.servo15_raw, this.servo16_raw] = moreargs;
  this._format = "<IHHHHHHHHBHHHHHHHH";
  this._id = mavlink20.MAVLINK_MSG_ID_SERVO_OUTPUT_RAW;
  this.order_map = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 222;
  this._name = "SERVO_OUTPUT_RAW";
  this._instance_field = "port";
  this._instance_offset = 20;
  this.fieldnames = ["time_usec", "port", "servo1_raw", "servo2_raw", "servo3_raw", "servo4_raw", "servo5_raw", "servo6_raw", "servo7_raw", "servo8_raw", "servo9_raw", "servo10_raw", "servo11_raw", "servo12_raw", "servo13_raw", "servo14_raw", "servo15_raw", "servo16_raw"];
};
mavlink20.messages.servo_output_raw.prototype = new mavlink20.message();
mavlink20.messages.servo_output_raw.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.servo1_raw, this.servo2_raw, this.servo3_raw, this.servo4_raw, this.servo5_raw, this.servo6_raw, this.servo7_raw, this.servo8_raw, this.port, this.servo9_raw, this.servo10_raw, this.servo11_raw, this.servo12_raw, this.servo13_raw, this.servo14_raw, this.servo15_raw, this.servo16_raw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_request_partial_list = function(...moreargs) {
  [this.target_system, this.target_component, this.start_index, this.end_index, this.mission_type] = moreargs;
  this._format = "<hhBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_PARTIAL_LIST;
  this.order_map = [2, 3, 0, 1, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 212;
  this._name = "MISSION_REQUEST_PARTIAL_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "start_index", "end_index", "mission_type"];
};
mavlink20.messages.mission_request_partial_list.prototype = new mavlink20.message();
mavlink20.messages.mission_request_partial_list.prototype.pack = function(mav) {
  var orderedfields = [this.start_index, this.end_index, this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_write_partial_list = function(...moreargs) {
  [this.target_system, this.target_component, this.start_index, this.end_index, this.mission_type] = moreargs;
  this._format = "<hhBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_WRITE_PARTIAL_LIST;
  this.order_map = [2, 3, 0, 1, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 9;
  this._name = "MISSION_WRITE_PARTIAL_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "start_index", "end_index", "mission_type"];
};
mavlink20.messages.mission_write_partial_list.prototype = new mavlink20.message();
mavlink20.messages.mission_write_partial_list.prototype.pack = function(mav) {
  var orderedfields = [this.start_index, this.end_index, this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_item = function(...moreargs) {
  [this.target_system, this.target_component, this.seq, this.frame, this.command, this.current, this.autocontinue, this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.mission_type] = moreargs;
  this._format = "<fffffffHHBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_ITEM;
  this.order_map = [9, 10, 7, 11, 8, 12, 13, 0, 1, 2, 3, 4, 5, 6, 14];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 254;
  this._name = "MISSION_ITEM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seq", "frame", "command", "current", "autocontinue", "param1", "param2", "param3", "param4", "x", "y", "z", "mission_type"];
};
mavlink20.messages.mission_item.prototype = new mavlink20.message();
mavlink20.messages.mission_item.prototype.pack = function(mav) {
  var orderedfields = [this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.seq, this.command, this.target_system, this.target_component, this.frame, this.current, this.autocontinue, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_request = function(...moreargs) {
  [this.target_system, this.target_component, this.seq, this.mission_type] = moreargs;
  this._format = "<HBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST;
  this.order_map = [1, 2, 0, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 230;
  this._name = "MISSION_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seq", "mission_type"];
};
mavlink20.messages.mission_request.prototype = new mavlink20.message();
mavlink20.messages.mission_request.prototype.pack = function(mav) {
  var orderedfields = [this.seq, this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_set_current = function(...moreargs) {
  [this.target_system, this.target_component, this.seq] = moreargs;
  this._format = "<HBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_SET_CURRENT;
  this.order_map = [1, 2, 0];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 28;
  this._name = "MISSION_SET_CURRENT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seq"];
};
mavlink20.messages.mission_set_current.prototype = new mavlink20.message();
mavlink20.messages.mission_set_current.prototype.pack = function(mav) {
  var orderedfields = [this.seq, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_current = function(...moreargs) {
  [this.seq, this.total, this.mission_state, this.mission_mode] = moreargs;
  this._format = "<HHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_CURRENT;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 28;
  this._name = "MISSION_CURRENT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["seq", "total", "mission_state", "mission_mode"];
};
mavlink20.messages.mission_current.prototype = new mavlink20.message();
mavlink20.messages.mission_current.prototype.pack = function(mav) {
  var orderedfields = [this.seq, this.total, this.mission_state, this.mission_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_request_list = function(...moreargs) {
  [this.target_system, this.target_component, this.mission_type] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_LIST;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 132;
  this._name = "MISSION_REQUEST_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "mission_type"];
};
mavlink20.messages.mission_request_list.prototype = new mavlink20.message();
mavlink20.messages.mission_request_list.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_count = function(...moreargs) {
  [this.target_system, this.target_component, this.count, this.mission_type] = moreargs;
  this._format = "<HBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_COUNT;
  this.order_map = [1, 2, 0, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 221;
  this._name = "MISSION_COUNT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "count", "mission_type"];
};
mavlink20.messages.mission_count.prototype = new mavlink20.message();
mavlink20.messages.mission_count.prototype.pack = function(mav) {
  var orderedfields = [this.count, this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_clear_all = function(...moreargs) {
  [this.target_system, this.target_component, this.mission_type] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_CLEAR_ALL;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 232;
  this._name = "MISSION_CLEAR_ALL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "mission_type"];
};
mavlink20.messages.mission_clear_all.prototype = new mavlink20.message();
mavlink20.messages.mission_clear_all.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_item_reached = function(...moreargs) {
  [this.seq] = moreargs;
  this._format = "<H";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_ITEM_REACHED;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [0];
  this.crc_extra = 11;
  this._name = "MISSION_ITEM_REACHED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["seq"];
};
mavlink20.messages.mission_item_reached.prototype = new mavlink20.message();
mavlink20.messages.mission_item_reached.prototype.pack = function(mav) {
  var orderedfields = [this.seq];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_ack = function(...moreargs) {
  [this.target_system, this.target_component, this.type, this.mission_type] = moreargs;
  this._format = "<BBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_ACK;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 153;
  this._name = "MISSION_ACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "type", "mission_type"];
};
mavlink20.messages.mission_ack.prototype = new mavlink20.message();
mavlink20.messages.mission_ack.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.type, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_gps_global_origin = function(...moreargs) {
  [this.target_system, this.latitude, this.longitude, this.altitude, this.time_usec] = moreargs;
  this._format = "<iiiBQ";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_GPS_GLOBAL_ORIGIN;
  this.order_map = [3, 0, 1, 2, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 41;
  this._name = "SET_GPS_GLOBAL_ORIGIN";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "latitude", "longitude", "altitude", "time_usec"];
};
mavlink20.messages.set_gps_global_origin.prototype = new mavlink20.message();
mavlink20.messages.set_gps_global_origin.prototype.pack = function(mav) {
  var orderedfields = [this.latitude, this.longitude, this.altitude, this.target_system, this.time_usec];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_global_origin = function(...moreargs) {
  [this.latitude, this.longitude, this.altitude, this.time_usec] = moreargs;
  this._format = "<iiiQ";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_GLOBAL_ORIGIN;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 39;
  this._name = "GPS_GLOBAL_ORIGIN";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["latitude", "longitude", "altitude", "time_usec"];
};
mavlink20.messages.gps_global_origin.prototype = new mavlink20.message();
mavlink20.messages.gps_global_origin.prototype.pack = function(mav) {
  var orderedfields = [this.latitude, this.longitude, this.altitude, this.time_usec];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_map_rc = function(...moreargs) {
  [this.target_system, this.target_component, this.param_id, this.param_index, this.parameter_rc_channel_index, this.param_value0, this.scale, this.param_value_min, this.param_value_max] = moreargs;
  this._format = "<ffffhBB16sB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_MAP_RC;
  this.order_map = [5, 6, 7, 4, 8, 0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 16, 0];
  this.crc_extra = 78;
  this._name = "PARAM_MAP_RC";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "param_id", "param_index", "parameter_rc_channel_index", "param_value0", "scale", "param_value_min", "param_value_max"];
};
mavlink20.messages.param_map_rc.prototype = new mavlink20.message();
mavlink20.messages.param_map_rc.prototype.pack = function(mav) {
  var orderedfields = [this.param_value0, this.scale, this.param_value_min, this.param_value_max, this.param_index, this.target_system, this.target_component, this.param_id, this.parameter_rc_channel_index];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_request_int = function(...moreargs) {
  [this.target_system, this.target_component, this.seq, this.mission_type] = moreargs;
  this._format = "<HBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_REQUEST_INT;
  this.order_map = [1, 2, 0, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 196;
  this._name = "MISSION_REQUEST_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seq", "mission_type"];
};
mavlink20.messages.mission_request_int.prototype = new mavlink20.message();
mavlink20.messages.mission_request_int.prototype.pack = function(mav) {
  var orderedfields = [this.seq, this.target_system, this.target_component, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.safety_set_allowed_area = function(...moreargs) {
  [this.target_system, this.target_component, this.frame, this.p1x, this.p1y, this.p1z, this.p2x, this.p2y, this.p2z] = moreargs;
  this._format = "<ffffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SAFETY_SET_ALLOWED_AREA;
  this.order_map = [6, 7, 8, 0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 15;
  this._name = "SAFETY_SET_ALLOWED_AREA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "frame", "p1x", "p1y", "p1z", "p2x", "p2y", "p2z"];
};
mavlink20.messages.safety_set_allowed_area.prototype = new mavlink20.message();
mavlink20.messages.safety_set_allowed_area.prototype.pack = function(mav) {
  var orderedfields = [this.p1x, this.p1y, this.p1z, this.p2x, this.p2y, this.p2z, this.target_system, this.target_component, this.frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.safety_allowed_area = function(...moreargs) {
  [this.frame, this.p1x, this.p1y, this.p1z, this.p2x, this.p2y, this.p2z] = moreargs;
  this._format = "<ffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_SAFETY_ALLOWED_AREA;
  this.order_map = [6, 0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 3;
  this._name = "SAFETY_ALLOWED_AREA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["frame", "p1x", "p1y", "p1z", "p2x", "p2y", "p2z"];
};
mavlink20.messages.safety_allowed_area.prototype = new mavlink20.message();
mavlink20.messages.safety_allowed_area.prototype.pack = function(mav) {
  var orderedfields = [this.p1x, this.p1y, this.p1z, this.p2x, this.p2y, this.p2z, this.frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.attitude_quaternion_cov = function(...moreargs) {
  [this.time_usec, this.q, this.rollspeed, this.pitchspeed, this.yawspeed, this.covariance] = moreargs;
  this._format = "<Q4ffff9f";
  this._id = mavlink20.MAVLINK_MSG_ID_ATTITUDE_QUATERNION_COV;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 4, 1, 1, 1, 9];
  this.array_len_map = [0, 4, 0, 0, 0, 9];
  this.crc_extra = 167;
  this._name = "ATTITUDE_QUATERNION_COV";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "q", "rollspeed", "pitchspeed", "yawspeed", "covariance"];
};
mavlink20.messages.attitude_quaternion_cov.prototype = new mavlink20.message();
mavlink20.messages.attitude_quaternion_cov.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.q, this.rollspeed, this.pitchspeed, this.yawspeed, this.covariance];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.nav_controller_output = function(...moreargs) {
  [this.nav_roll, this.nav_pitch, this.nav_bearing, this.target_bearing, this.wp_dist, this.alt_error, this.aspd_error, this.xtrack_error] = moreargs;
  this._format = "<fffffhhH";
  this._id = mavlink20.MAVLINK_MSG_ID_NAV_CONTROLLER_OUTPUT;
  this.order_map = [0, 1, 5, 6, 7, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 183;
  this._name = "NAV_CONTROLLER_OUTPUT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["nav_roll", "nav_pitch", "nav_bearing", "target_bearing", "wp_dist", "alt_error", "aspd_error", "xtrack_error"];
};
mavlink20.messages.nav_controller_output.prototype = new mavlink20.message();
mavlink20.messages.nav_controller_output.prototype.pack = function(mav) {
  var orderedfields = [this.nav_roll, this.nav_pitch, this.alt_error, this.aspd_error, this.xtrack_error, this.nav_bearing, this.target_bearing, this.wp_dist];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.global_position_int_cov = function(...moreargs) {
  [this.time_usec, this.estimator_type, this.lat, this.lon, this.alt, this.relative_alt, this.vx, this.vy, this.vz, this.covariance] = moreargs;
  this._format = "<Qiiiifff36fB";
  this._id = mavlink20.MAVLINK_MSG_ID_GLOBAL_POSITION_INT_COV;
  this.order_map = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 36, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 36, 0];
  this.crc_extra = 119;
  this._name = "GLOBAL_POSITION_INT_COV";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "estimator_type", "lat", "lon", "alt", "relative_alt", "vx", "vy", "vz", "covariance"];
};
mavlink20.messages.global_position_int_cov.prototype = new mavlink20.message();
mavlink20.messages.global_position_int_cov.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.lat, this.lon, this.alt, this.relative_alt, this.vx, this.vy, this.vz, this.covariance, this.estimator_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.local_position_ned_cov = function(...moreargs) {
  [this.time_usec, this.estimator_type, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.ax, this.ay, this.az, this.covariance] = moreargs;
  this._format = "<Qfffffffff45fB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED_COV;
  this.order_map = [0, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 45, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 0];
  this.crc_extra = 191;
  this._name = "LOCAL_POSITION_NED_COV";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "estimator_type", "x", "y", "z", "vx", "vy", "vz", "ax", "ay", "az", "covariance"];
};
mavlink20.messages.local_position_ned_cov.prototype = new mavlink20.message();
mavlink20.messages.local_position_ned_cov.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.ax, this.ay, this.az, this.covariance, this.estimator_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rc_channels = function(...moreargs) {
  [this.time_boot_ms, this.chancount, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.chan13_raw, this.chan14_raw, this.chan15_raw, this.chan16_raw, this.chan17_raw, this.chan18_raw, this.rssi] = moreargs;
  this._format = "<IHHHHHHHHHHHHHHHHHHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RC_CHANNELS;
  this.order_map = [0, 19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 118;
  this._name = "RC_CHANNELS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "chancount", "chan1_raw", "chan2_raw", "chan3_raw", "chan4_raw", "chan5_raw", "chan6_raw", "chan7_raw", "chan8_raw", "chan9_raw", "chan10_raw", "chan11_raw", "chan12_raw", "chan13_raw", "chan14_raw", "chan15_raw", "chan16_raw", "chan17_raw", "chan18_raw", "rssi"];
};
mavlink20.messages.rc_channels.prototype = new mavlink20.message();
mavlink20.messages.rc_channels.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.chan13_raw, this.chan14_raw, this.chan15_raw, this.chan16_raw, this.chan17_raw, this.chan18_raw, this.chancount, this.rssi];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.request_data_stream = function(...moreargs) {
  [this.target_system, this.target_component, this.req_stream_id, this.req_message_rate, this.start_stop] = moreargs;
  this._format = "<HBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_REQUEST_DATA_STREAM;
  this.order_map = [1, 2, 3, 0, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 148;
  this._name = "REQUEST_DATA_STREAM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "req_stream_id", "req_message_rate", "start_stop"];
};
mavlink20.messages.request_data_stream.prototype = new mavlink20.message();
mavlink20.messages.request_data_stream.prototype.pack = function(mav) {
  var orderedfields = [this.req_message_rate, this.target_system, this.target_component, this.req_stream_id, this.start_stop];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data_stream = function(...moreargs) {
  [this.stream_id, this.message_rate, this.on_off] = moreargs;
  this._format = "<HBB";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA_STREAM;
  this.order_map = [1, 0, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 21;
  this._name = "DATA_STREAM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["stream_id", "message_rate", "on_off"];
};
mavlink20.messages.data_stream.prototype = new mavlink20.message();
mavlink20.messages.data_stream.prototype.pack = function(mav) {
  var orderedfields = [this.message_rate, this.stream_id, this.on_off];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.manual_control = function(...moreargs) {
  [this.target, this.x, this.y, this.z, this.r, this.buttons, this.buttons2, this.enabled_extensions, this.s, this.t, this.aux1, this.aux2, this.aux3, this.aux4, this.aux5, this.aux6] = moreargs;
  this._format = "<hhhhHBHBhhhhhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_MANUAL_CONTROL;
  this.order_map = [5, 0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 243;
  this._name = "MANUAL_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target", "x", "y", "z", "r", "buttons", "buttons2", "enabled_extensions", "s", "t", "aux1", "aux2", "aux3", "aux4", "aux5", "aux6"];
};
mavlink20.messages.manual_control.prototype = new mavlink20.message();
mavlink20.messages.manual_control.prototype.pack = function(mav) {
  var orderedfields = [this.x, this.y, this.z, this.r, this.buttons, this.target, this.buttons2, this.enabled_extensions, this.s, this.t, this.aux1, this.aux2, this.aux3, this.aux4, this.aux5, this.aux6];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.rc_channels_override = function(...moreargs) {
  [this.target_system, this.target_component, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.chan13_raw, this.chan14_raw, this.chan15_raw, this.chan16_raw, this.chan17_raw, this.chan18_raw] = moreargs;
  this._format = "<HHHHHHHHBBHHHHHHHHHH";
  this._id = mavlink20.MAVLINK_MSG_ID_RC_CHANNELS_OVERRIDE;
  this.order_map = [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 124;
  this._name = "RC_CHANNELS_OVERRIDE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "chan1_raw", "chan2_raw", "chan3_raw", "chan4_raw", "chan5_raw", "chan6_raw", "chan7_raw", "chan8_raw", "chan9_raw", "chan10_raw", "chan11_raw", "chan12_raw", "chan13_raw", "chan14_raw", "chan15_raw", "chan16_raw", "chan17_raw", "chan18_raw"];
};
mavlink20.messages.rc_channels_override.prototype = new mavlink20.message();
mavlink20.messages.rc_channels_override.prototype.pack = function(mav) {
  var orderedfields = [this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.target_system, this.target_component, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.chan13_raw, this.chan14_raw, this.chan15_raw, this.chan16_raw, this.chan17_raw, this.chan18_raw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_item_int = function(...moreargs) {
  [this.target_system, this.target_component, this.seq, this.frame, this.command, this.current, this.autocontinue, this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.mission_type] = moreargs;
  this._format = "<ffffiifHHBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_ITEM_INT;
  this.order_map = [9, 10, 7, 11, 8, 12, 13, 0, 1, 2, 3, 4, 5, 6, 14];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 38;
  this._name = "MISSION_ITEM_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "seq", "frame", "command", "current", "autocontinue", "param1", "param2", "param3", "param4", "x", "y", "z", "mission_type"];
};
mavlink20.messages.mission_item_int.prototype = new mavlink20.message();
mavlink20.messages.mission_item_int.prototype.pack = function(mav) {
  var orderedfields = [this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.seq, this.command, this.target_system, this.target_component, this.frame, this.current, this.autocontinue, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vfr_hud = function(...moreargs) {
  [this.airspeed, this.groundspeed, this.heading, this.throttle, this.alt, this.climb] = moreargs;
  this._format = "<ffffhH";
  this._id = mavlink20.MAVLINK_MSG_ID_VFR_HUD;
  this.order_map = [0, 1, 4, 5, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 20;
  this._name = "VFR_HUD";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["airspeed", "groundspeed", "heading", "throttle", "alt", "climb"];
};
mavlink20.messages.vfr_hud.prototype = new mavlink20.message();
mavlink20.messages.vfr_hud.prototype.pack = function(mav) {
  var orderedfields = [this.airspeed, this.groundspeed, this.alt, this.climb, this.heading, this.throttle];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.command_int = function(...moreargs) {
  [this.target_system, this.target_component, this.frame, this.command, this.current, this.autocontinue, this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z] = moreargs;
  this._format = "<ffffiifHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMMAND_INT;
  this.order_map = [8, 9, 10, 7, 11, 12, 0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 158;
  this._name = "COMMAND_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "frame", "command", "current", "autocontinue", "param1", "param2", "param3", "param4", "x", "y", "z"];
};
mavlink20.messages.command_int.prototype = new mavlink20.message();
mavlink20.messages.command_int.prototype.pack = function(mav) {
  var orderedfields = [this.param1, this.param2, this.param3, this.param4, this.x, this.y, this.z, this.command, this.target_system, this.target_component, this.frame, this.current, this.autocontinue];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.command_long = function(...moreargs) {
  [this.target_system, this.target_component, this.command, this.confirmation, this.param1, this.param2, this.param3, this.param4, this.param5, this.param6, this.param7] = moreargs;
  this._format = "<fffffffHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMMAND_LONG;
  this.order_map = [8, 9, 7, 10, 0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 152;
  this._name = "COMMAND_LONG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "command", "confirmation", "param1", "param2", "param3", "param4", "param5", "param6", "param7"];
};
mavlink20.messages.command_long.prototype = new mavlink20.message();
mavlink20.messages.command_long.prototype.pack = function(mav) {
  var orderedfields = [this.param1, this.param2, this.param3, this.param4, this.param5, this.param6, this.param7, this.command, this.target_system, this.target_component, this.confirmation];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.command_ack = function(...moreargs) {
  [this.command, this.result, this.progress, this.result_param2, this.target_system, this.target_component] = moreargs;
  this._format = "<HBBiBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMMAND_ACK;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 143;
  this._name = "COMMAND_ACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["command", "result", "progress", "result_param2", "target_system", "target_component"];
};
mavlink20.messages.command_ack.prototype = new mavlink20.message();
mavlink20.messages.command_ack.prototype.pack = function(mav) {
  var orderedfields = [this.command, this.result, this.progress, this.result_param2, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.manual_setpoint = function(...moreargs) {
  [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.thrust, this.mode_switch, this.manual_override_switch] = moreargs;
  this._format = "<IffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_MANUAL_SETPOINT;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 106;
  this._name = "MANUAL_SETPOINT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "roll", "pitch", "yaw", "thrust", "mode_switch", "manual_override_switch"];
};
mavlink20.messages.manual_setpoint.prototype = new mavlink20.message();
mavlink20.messages.manual_setpoint.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.thrust, this.mode_switch, this.manual_override_switch];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_attitude_target = function(...moreargs) {
  [this.time_boot_ms, this.target_system, this.target_component, this.type_mask, this.q, this.body_roll_rate, this.body_pitch_rate, this.body_yaw_rate, this.thrust] = moreargs;
  this._format = "<I4fffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_ATTITUDE_TARGET;
  this.order_map = [0, 6, 7, 8, 1, 2, 3, 4, 5];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 49;
  this._name = "SET_ATTITUDE_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "target_system", "target_component", "type_mask", "q", "body_roll_rate", "body_pitch_rate", "body_yaw_rate", "thrust"];
};
mavlink20.messages.set_attitude_target.prototype = new mavlink20.message();
mavlink20.messages.set_attitude_target.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q, this.body_roll_rate, this.body_pitch_rate, this.body_yaw_rate, this.thrust, this.target_system, this.target_component, this.type_mask];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.attitude_target = function(...moreargs) {
  [this.time_boot_ms, this.type_mask, this.q, this.body_roll_rate, this.body_pitch_rate, this.body_yaw_rate, this.thrust] = moreargs;
  this._format = "<I4fffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_ATTITUDE_TARGET;
  this.order_map = [0, 6, 1, 2, 3, 4, 5];
  this.len_map = [1, 4, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0];
  this.crc_extra = 22;
  this._name = "ATTITUDE_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "type_mask", "q", "body_roll_rate", "body_pitch_rate", "body_yaw_rate", "thrust"];
};
mavlink20.messages.attitude_target.prototype = new mavlink20.message();
mavlink20.messages.attitude_target.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q, this.body_roll_rate, this.body_pitch_rate, this.body_yaw_rate, this.thrust, this.type_mask];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_position_target_local_ned = function(...moreargs) {
  [this.time_boot_ms, this.target_system, this.target_component, this.coordinate_frame, this.type_mask, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate] = moreargs;
  this._format = "<IfffffffffffHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_POSITION_TARGET_LOCAL_NED;
  this.order_map = [0, 13, 14, 15, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 143;
  this._name = "SET_POSITION_TARGET_LOCAL_NED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "target_system", "target_component", "coordinate_frame", "type_mask", "x", "y", "z", "vx", "vy", "vz", "afx", "afy", "afz", "yaw", "yaw_rate"];
};
mavlink20.messages.set_position_target_local_ned.prototype = new mavlink20.message();
mavlink20.messages.set_position_target_local_ned.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate, this.type_mask, this.target_system, this.target_component, this.coordinate_frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.position_target_local_ned = function(...moreargs) {
  [this.time_boot_ms, this.coordinate_frame, this.type_mask, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate] = moreargs;
  this._format = "<IfffffffffffHB";
  this._id = mavlink20.MAVLINK_MSG_ID_POSITION_TARGET_LOCAL_NED;
  this.order_map = [0, 13, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 140;
  this._name = "POSITION_TARGET_LOCAL_NED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "coordinate_frame", "type_mask", "x", "y", "z", "vx", "vy", "vz", "afx", "afy", "afz", "yaw", "yaw_rate"];
};
mavlink20.messages.position_target_local_ned.prototype = new mavlink20.message();
mavlink20.messages.position_target_local_ned.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.x, this.y, this.z, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate, this.type_mask, this.coordinate_frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_position_target_global_int = function(...moreargs) {
  [this.time_boot_ms, this.target_system, this.target_component, this.coordinate_frame, this.type_mask, this.lat_int, this.lon_int, this.alt, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate] = moreargs;
  this._format = "<IiifffffffffHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_POSITION_TARGET_GLOBAL_INT;
  this.order_map = [0, 13, 14, 15, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 5;
  this._name = "SET_POSITION_TARGET_GLOBAL_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "target_system", "target_component", "coordinate_frame", "type_mask", "lat_int", "lon_int", "alt", "vx", "vy", "vz", "afx", "afy", "afz", "yaw", "yaw_rate"];
};
mavlink20.messages.set_position_target_global_int.prototype = new mavlink20.message();
mavlink20.messages.set_position_target_global_int.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat_int, this.lon_int, this.alt, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate, this.type_mask, this.target_system, this.target_component, this.coordinate_frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.position_target_global_int = function(...moreargs) {
  [this.time_boot_ms, this.coordinate_frame, this.type_mask, this.lat_int, this.lon_int, this.alt, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate] = moreargs;
  this._format = "<IiifffffffffHB";
  this._id = mavlink20.MAVLINK_MSG_ID_POSITION_TARGET_GLOBAL_INT;
  this.order_map = [0, 13, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 150;
  this._name = "POSITION_TARGET_GLOBAL_INT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "coordinate_frame", "type_mask", "lat_int", "lon_int", "alt", "vx", "vy", "vz", "afx", "afy", "afz", "yaw", "yaw_rate"];
};
mavlink20.messages.position_target_global_int.prototype = new mavlink20.message();
mavlink20.messages.position_target_global_int.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat_int, this.lon_int, this.alt, this.vx, this.vy, this.vz, this.afx, this.afy, this.afz, this.yaw, this.yaw_rate, this.type_mask, this.coordinate_frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.local_position_ned_system_global_offset = function(...moreargs) {
  [this.time_boot_ms, this.x, this.y, this.z, this.roll, this.pitch, this.yaw] = moreargs;
  this._format = "<Iffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_LOCAL_POSITION_NED_SYSTEM_GLOBAL_OFFSET;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 231;
  this._name = "LOCAL_POSITION_NED_SYSTEM_GLOBAL_OFFSET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "x", "y", "z", "roll", "pitch", "yaw"];
};
mavlink20.messages.local_position_ned_system_global_offset.prototype = new mavlink20.message();
mavlink20.messages.local_position_ned_system_global_offset.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.x, this.y, this.z, this.roll, this.pitch, this.yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_state = function(...moreargs) {
  [this.time_usec, this.roll, this.pitch, this.yaw, this.rollspeed, this.pitchspeed, this.yawspeed, this.lat, this.lon, this.alt, this.vx, this.vy, this.vz, this.xacc, this.yacc, this.zacc] = moreargs;
  this._format = "<Qffffffiiihhhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_STATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 183;
  this._name = "HIL_STATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "roll", "pitch", "yaw", "rollspeed", "pitchspeed", "yawspeed", "lat", "lon", "alt", "vx", "vy", "vz", "xacc", "yacc", "zacc"];
};
mavlink20.messages.hil_state.prototype = new mavlink20.message();
mavlink20.messages.hil_state.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.roll, this.pitch, this.yaw, this.rollspeed, this.pitchspeed, this.yawspeed, this.lat, this.lon, this.alt, this.vx, this.vy, this.vz, this.xacc, this.yacc, this.zacc];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_controls = function(...moreargs) {
  [this.time_usec, this.roll_ailerons, this.pitch_elevator, this.yaw_rudder, this.throttle, this.aux1, this.aux2, this.aux3, this.aux4, this.mode, this.nav_mode] = moreargs;
  this._format = "<QffffffffBB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_CONTROLS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 63;
  this._name = "HIL_CONTROLS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "roll_ailerons", "pitch_elevator", "yaw_rudder", "throttle", "aux1", "aux2", "aux3", "aux4", "mode", "nav_mode"];
};
mavlink20.messages.hil_controls.prototype = new mavlink20.message();
mavlink20.messages.hil_controls.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.roll_ailerons, this.pitch_elevator, this.yaw_rudder, this.throttle, this.aux1, this.aux2, this.aux3, this.aux4, this.mode, this.nav_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_rc_inputs_raw = function(...moreargs) {
  [this.time_usec, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.rssi] = moreargs;
  this._format = "<QHHHHHHHHHHHHB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_RC_INPUTS_RAW;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 54;
  this._name = "HIL_RC_INPUTS_RAW";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "chan1_raw", "chan2_raw", "chan3_raw", "chan4_raw", "chan5_raw", "chan6_raw", "chan7_raw", "chan8_raw", "chan9_raw", "chan10_raw", "chan11_raw", "chan12_raw", "rssi"];
};
mavlink20.messages.hil_rc_inputs_raw.prototype = new mavlink20.message();
mavlink20.messages.hil_rc_inputs_raw.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.chan1_raw, this.chan2_raw, this.chan3_raw, this.chan4_raw, this.chan5_raw, this.chan6_raw, this.chan7_raw, this.chan8_raw, this.chan9_raw, this.chan10_raw, this.chan11_raw, this.chan12_raw, this.rssi];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_actuator_controls = function(...moreargs) {
  [this.time_usec, this.controls, this.mode, this.flags] = moreargs;
  this._format = "<QQ16fB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_ACTUATOR_CONTROLS;
  this.order_map = [0, 2, 3, 1];
  this.len_map = [1, 1, 16, 1];
  this.array_len_map = [0, 0, 16, 0];
  this.crc_extra = 47;
  this._name = "HIL_ACTUATOR_CONTROLS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "controls", "mode", "flags"];
};
mavlink20.messages.hil_actuator_controls.prototype = new mavlink20.message();
mavlink20.messages.hil_actuator_controls.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.flags, this.controls, this.mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.optical_flow = function(...moreargs) {
  [this.time_usec, this.sensor_id, this.flow_x, this.flow_y, this.flow_comp_m_x, this.flow_comp_m_y, this.quality, this.ground_distance, this.flow_rate_x, this.flow_rate_y] = moreargs;
  this._format = "<QfffhhBBff";
  this._id = mavlink20.MAVLINK_MSG_ID_OPTICAL_FLOW;
  this.order_map = [0, 6, 4, 5, 1, 2, 7, 3, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 175;
  this._name = "OPTICAL_FLOW";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "sensor_id", "flow_x", "flow_y", "flow_comp_m_x", "flow_comp_m_y", "quality", "ground_distance", "flow_rate_x", "flow_rate_y"];
};
mavlink20.messages.optical_flow.prototype = new mavlink20.message();
mavlink20.messages.optical_flow.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.flow_comp_m_x, this.flow_comp_m_y, this.ground_distance, this.flow_x, this.flow_y, this.sensor_id, this.quality, this.flow_rate_x, this.flow_rate_y];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.global_vision_position_estimate = function(...moreargs) {
  [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance, this.reset_counter] = moreargs;
  this._format = "<Qffffff21fB";
  this._id = mavlink20.MAVLINK_MSG_ID_GLOBAL_VISION_POSITION_ESTIMATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 21, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 21, 0];
  this.crc_extra = 102;
  this._name = "GLOBAL_VISION_POSITION_ESTIMATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["usec", "x", "y", "z", "roll", "pitch", "yaw", "covariance", "reset_counter"];
};
mavlink20.messages.global_vision_position_estimate.prototype = new mavlink20.message();
mavlink20.messages.global_vision_position_estimate.prototype.pack = function(mav) {
  var orderedfields = [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance, this.reset_counter];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vision_position_estimate = function(...moreargs) {
  [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance, this.reset_counter] = moreargs;
  this._format = "<Qffffff21fB";
  this._id = mavlink20.MAVLINK_MSG_ID_VISION_POSITION_ESTIMATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 21, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 21, 0];
  this.crc_extra = 158;
  this._name = "VISION_POSITION_ESTIMATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["usec", "x", "y", "z", "roll", "pitch", "yaw", "covariance", "reset_counter"];
};
mavlink20.messages.vision_position_estimate.prototype = new mavlink20.message();
mavlink20.messages.vision_position_estimate.prototype.pack = function(mav) {
  var orderedfields = [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance, this.reset_counter];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vision_speed_estimate = function(...moreargs) {
  [this.usec, this.x, this.y, this.z, this.covariance, this.reset_counter] = moreargs;
  this._format = "<Qfff9fB";
  this._id = mavlink20.MAVLINK_MSG_ID_VISION_SPEED_ESTIMATE;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 9, 1];
  this.array_len_map = [0, 0, 0, 0, 9, 0];
  this.crc_extra = 208;
  this._name = "VISION_SPEED_ESTIMATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["usec", "x", "y", "z", "covariance", "reset_counter"];
};
mavlink20.messages.vision_speed_estimate.prototype = new mavlink20.message();
mavlink20.messages.vision_speed_estimate.prototype.pack = function(mav) {
  var orderedfields = [this.usec, this.x, this.y, this.z, this.covariance, this.reset_counter];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vicon_position_estimate = function(...moreargs) {
  [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance] = moreargs;
  this._format = "<Qffffff21f";
  this._id = mavlink20.MAVLINK_MSG_ID_VICON_POSITION_ESTIMATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 21];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 21];
  this.crc_extra = 56;
  this._name = "VICON_POSITION_ESTIMATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["usec", "x", "y", "z", "roll", "pitch", "yaw", "covariance"];
};
mavlink20.messages.vicon_position_estimate.prototype = new mavlink20.message();
mavlink20.messages.vicon_position_estimate.prototype.pack = function(mav) {
  var orderedfields = [this.usec, this.x, this.y, this.z, this.roll, this.pitch, this.yaw, this.covariance];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.highres_imu = function(...moreargs) {
  [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.abs_pressure, this.diff_pressure, this.pressure_alt, this.temperature, this.fields_updated, this.id] = moreargs;
  this._format = "<QfffffffffffffHB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIGHRES_IMU;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 93;
  this._name = "HIGHRES_IMU";
  this._instance_field = "id";
  this._instance_offset = 62;
  this.fieldnames = ["time_usec", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "abs_pressure", "diff_pressure", "pressure_alt", "temperature", "fields_updated", "id"];
};
mavlink20.messages.highres_imu.prototype = new mavlink20.message();
mavlink20.messages.highres_imu.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.abs_pressure, this.diff_pressure, this.pressure_alt, this.temperature, this.fields_updated, this.id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.optical_flow_rad = function(...moreargs) {
  [this.time_usec, this.sensor_id, this.integration_time_us, this.integrated_x, this.integrated_y, this.integrated_xgyro, this.integrated_ygyro, this.integrated_zgyro, this.temperature, this.quality, this.time_delta_distance_us, this.distance] = moreargs;
  this._format = "<QIfffffIfhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OPTICAL_FLOW_RAD;
  this.order_map = [0, 10, 1, 2, 3, 4, 5, 6, 9, 11, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 138;
  this._name = "OPTICAL_FLOW_RAD";
  this._instance_field = "sensor_id";
  this._instance_offset = 42;
  this.fieldnames = ["time_usec", "sensor_id", "integration_time_us", "integrated_x", "integrated_y", "integrated_xgyro", "integrated_ygyro", "integrated_zgyro", "temperature", "quality", "time_delta_distance_us", "distance"];
};
mavlink20.messages.optical_flow_rad.prototype = new mavlink20.message();
mavlink20.messages.optical_flow_rad.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.integration_time_us, this.integrated_x, this.integrated_y, this.integrated_xgyro, this.integrated_ygyro, this.integrated_zgyro, this.time_delta_distance_us, this.distance, this.temperature, this.sensor_id, this.quality];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_sensor = function(...moreargs) {
  [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.abs_pressure, this.diff_pressure, this.pressure_alt, this.temperature, this.fields_updated, this.id] = moreargs;
  this._format = "<QfffffffffffffIB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_SENSOR;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 108;
  this._name = "HIL_SENSOR";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "abs_pressure", "diff_pressure", "pressure_alt", "temperature", "fields_updated", "id"];
};
mavlink20.messages.hil_sensor.prototype = new mavlink20.message();
mavlink20.messages.hil_sensor.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.abs_pressure, this.diff_pressure, this.pressure_alt, this.temperature, this.fields_updated, this.id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.sim_state = function(...moreargs) {
  [this.q1, this.q2, this.q3, this.q4, this.roll, this.pitch, this.yaw, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.lat, this.lon, this.alt, this.std_dev_horz, this.std_dev_vert, this.vn, this.ve, this.vd, this.lat_int, this.lon_int] = moreargs;
  this._format = "<fffffffffffffffffffffii";
  this._id = mavlink20.MAVLINK_MSG_ID_SIM_STATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 32;
  this._name = "SIM_STATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["q1", "q2", "q3", "q4", "roll", "pitch", "yaw", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "lat", "lon", "alt", "std_dev_horz", "std_dev_vert", "vn", "ve", "vd", "lat_int", "lon_int"];
};
mavlink20.messages.sim_state.prototype = new mavlink20.message();
mavlink20.messages.sim_state.prototype.pack = function(mav) {
  var orderedfields = [this.q1, this.q2, this.q3, this.q4, this.roll, this.pitch, this.yaw, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.lat, this.lon, this.alt, this.std_dev_horz, this.std_dev_vert, this.vn, this.ve, this.vd, this.lat_int, this.lon_int];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.radio_status = function(...moreargs) {
  [this.rssi, this.remrssi, this.txbuf, this.noise, this.remnoise, this.rxerrors, this.fixed] = moreargs;
  this._format = "<HHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_RADIO_STATUS;
  this.order_map = [2, 3, 4, 5, 6, 0, 1];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 185;
  this._name = "RADIO_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rssi", "remrssi", "txbuf", "noise", "remnoise", "rxerrors", "fixed"];
};
mavlink20.messages.radio_status.prototype = new mavlink20.message();
mavlink20.messages.radio_status.prototype.pack = function(mav) {
  var orderedfields = [this.rxerrors, this.fixed, this.rssi, this.remrssi, this.txbuf, this.noise, this.remnoise];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.file_transfer_protocol = function(...moreargs) {
  [this.target_network, this.target_system, this.target_component, this.payload] = moreargs;
  this._format = "<BBB251s";
  this._id = mavlink20.MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 251];
  this.array_len_map = [0, 0, 0, 251];
  this.crc_extra = 84;
  this._name = "FILE_TRANSFER_PROTOCOL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_network", "target_system", "target_component", "payload"];
};
mavlink20.messages.file_transfer_protocol.prototype = new mavlink20.message();
mavlink20.messages.file_transfer_protocol.prototype.pack = function(mav) {
  var orderedfields = [this.target_network, this.target_system, this.target_component, this.payload];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.timesync = function(...moreargs) {
  [this.tc1, this.ts1] = moreargs;
  this._format = "<qq";
  this._id = mavlink20.MAVLINK_MSG_ID_TIMESYNC;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 34;
  this._name = "TIMESYNC";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["tc1", "ts1"];
};
mavlink20.messages.timesync.prototype = new mavlink20.message();
mavlink20.messages.timesync.prototype.pack = function(mav) {
  var orderedfields = [this.tc1, this.ts1];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_trigger = function(...moreargs) {
  [this.time_usec, this.seq] = moreargs;
  this._format = "<QI";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_TRIGGER;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 174;
  this._name = "CAMERA_TRIGGER";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "seq"];
};
mavlink20.messages.camera_trigger.prototype = new mavlink20.message();
mavlink20.messages.camera_trigger.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.seq];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_gps = function(...moreargs) {
  [this.time_usec, this.fix_type, this.lat, this.lon, this.alt, this.eph, this.epv, this.vel, this.vn, this.ve, this.vd, this.cog, this.satellites_visible, this.id, this.yaw] = moreargs;
  this._format = "<QiiiHHHhhhHBBBH";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_GPS;
  this.order_map = [0, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 124;
  this._name = "HIL_GPS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "fix_type", "lat", "lon", "alt", "eph", "epv", "vel", "vn", "ve", "vd", "cog", "satellites_visible", "id", "yaw"];
};
mavlink20.messages.hil_gps.prototype = new mavlink20.message();
mavlink20.messages.hil_gps.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.lat, this.lon, this.alt, this.eph, this.epv, this.vel, this.vn, this.ve, this.vd, this.cog, this.fix_type, this.satellites_visible, this.id, this.yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_optical_flow = function(...moreargs) {
  [this.time_usec, this.sensor_id, this.integration_time_us, this.integrated_x, this.integrated_y, this.integrated_xgyro, this.integrated_ygyro, this.integrated_zgyro, this.temperature, this.quality, this.time_delta_distance_us, this.distance] = moreargs;
  this._format = "<QIfffffIfhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_OPTICAL_FLOW;
  this.order_map = [0, 10, 1, 2, 3, 4, 5, 6, 9, 11, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 237;
  this._name = "HIL_OPTICAL_FLOW";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "sensor_id", "integration_time_us", "integrated_x", "integrated_y", "integrated_xgyro", "integrated_ygyro", "integrated_zgyro", "temperature", "quality", "time_delta_distance_us", "distance"];
};
mavlink20.messages.hil_optical_flow.prototype = new mavlink20.message();
mavlink20.messages.hil_optical_flow.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.integration_time_us, this.integrated_x, this.integrated_y, this.integrated_xgyro, this.integrated_ygyro, this.integrated_zgyro, this.time_delta_distance_us, this.distance, this.temperature, this.sensor_id, this.quality];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hil_state_quaternion = function(...moreargs) {
  [this.time_usec, this.attitude_quaternion, this.rollspeed, this.pitchspeed, this.yawspeed, this.lat, this.lon, this.alt, this.vx, this.vy, this.vz, this.ind_airspeed, this.true_airspeed, this.xacc, this.yacc, this.zacc] = moreargs;
  this._format = "<Q4ffffiiihhhHHhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_HIL_STATE_QUATERNION;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 4;
  this._name = "HIL_STATE_QUATERNION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "attitude_quaternion", "rollspeed", "pitchspeed", "yawspeed", "lat", "lon", "alt", "vx", "vy", "vz", "ind_airspeed", "true_airspeed", "xacc", "yacc", "zacc"];
};
mavlink20.messages.hil_state_quaternion.prototype = new mavlink20.message();
mavlink20.messages.hil_state_quaternion.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.attitude_quaternion, this.rollspeed, this.pitchspeed, this.yawspeed, this.lat, this.lon, this.alt, this.vx, this.vy, this.vz, this.ind_airspeed, this.true_airspeed, this.xacc, this.yacc, this.zacc];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_imu2 = function(...moreargs) {
  [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature] = moreargs;
  this._format = "<Ihhhhhhhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_IMU2;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 76;
  this._name = "SCALED_IMU2";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "temperature"];
};
mavlink20.messages.scaled_imu2.prototype = new mavlink20.message();
mavlink20.messages.scaled_imu2.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_request_list = function(...moreargs) {
  [this.target_system, this.target_component, this.start, this.end] = moreargs;
  this._format = "<HHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_LIST;
  this.order_map = [2, 3, 0, 1];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 128;
  this._name = "LOG_REQUEST_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "start", "end"];
};
mavlink20.messages.log_request_list.prototype = new mavlink20.message();
mavlink20.messages.log_request_list.prototype.pack = function(mav) {
  var orderedfields = [this.start, this.end, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_entry = function(...moreargs) {
  [this.id, this.num_logs, this.last_log_num, this.time_utc, this.size] = moreargs;
  this._format = "<IIHHH";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_ENTRY;
  this.order_map = [2, 3, 4, 0, 1];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 56;
  this._name = "LOG_ENTRY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["id", "num_logs", "last_log_num", "time_utc", "size"];
};
mavlink20.messages.log_entry.prototype = new mavlink20.message();
mavlink20.messages.log_entry.prototype.pack = function(mav) {
  var orderedfields = [this.time_utc, this.size, this.id, this.num_logs, this.last_log_num];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_request_data = function(...moreargs) {
  [this.target_system, this.target_component, this.id, this.ofs, this.count] = moreargs;
  this._format = "<IIHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_DATA;
  this.order_map = [3, 4, 2, 0, 1];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 116;
  this._name = "LOG_REQUEST_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id", "ofs", "count"];
};
mavlink20.messages.log_request_data.prototype = new mavlink20.message();
mavlink20.messages.log_request_data.prototype.pack = function(mav) {
  var orderedfields = [this.ofs, this.count, this.id, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_data = function(...moreargs) {
  [this.id, this.ofs, this.count, this.data] = moreargs;
  this._format = "<IHB90s";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_DATA;
  this.order_map = [1, 0, 2, 3];
  this.len_map = [1, 1, 1, 90];
  this.array_len_map = [0, 0, 0, 90];
  this.crc_extra = 134;
  this._name = "LOG_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["id", "ofs", "count", "data"];
};
mavlink20.messages.log_data.prototype = new mavlink20.message();
mavlink20.messages.log_data.prototype.pack = function(mav) {
  var orderedfields = [this.ofs, this.id, this.count, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_erase = function(...moreargs) {
  [this.target_system, this.target_component] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_ERASE;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 237;
  this._name = "LOG_ERASE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component"];
};
mavlink20.messages.log_erase.prototype = new mavlink20.message();
mavlink20.messages.log_erase.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.log_request_end = function(...moreargs) {
  [this.target_system, this.target_component] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOG_REQUEST_END;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 203;
  this._name = "LOG_REQUEST_END";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component"];
};
mavlink20.messages.log_request_end.prototype = new mavlink20.message();
mavlink20.messages.log_request_end.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_inject_data = function(...moreargs) {
  [this.target_system, this.target_component, this.len, this.data] = moreargs;
  this._format = "<BBB110s";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_INJECT_DATA;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 110];
  this.array_len_map = [0, 0, 0, 110];
  this.crc_extra = 250;
  this._name = "GPS_INJECT_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "len", "data"];
};
mavlink20.messages.gps_inject_data.prototype = new mavlink20.message();
mavlink20.messages.gps_inject_data.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps2_raw = function(...moreargs) {
  [this.time_usec, this.fix_type, this.lat, this.lon, this.alt, this.eph, this.epv, this.vel, this.cog, this.satellites_visible, this.dgps_numch, this.dgps_age, this.yaw, this.alt_ellipsoid, this.h_acc, this.v_acc, this.vel_acc, this.hdg_acc] = moreargs;
  this._format = "<QiiiIHHHHBBBHiIIII";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS2_RAW;
  this.order_map = [0, 9, 1, 2, 3, 5, 6, 7, 8, 10, 11, 4, 12, 13, 14, 15, 16, 17];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 87;
  this._name = "GPS2_RAW";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "fix_type", "lat", "lon", "alt", "eph", "epv", "vel", "cog", "satellites_visible", "dgps_numch", "dgps_age", "yaw", "alt_ellipsoid", "h_acc", "v_acc", "vel_acc", "hdg_acc"];
};
mavlink20.messages.gps2_raw.prototype = new mavlink20.message();
mavlink20.messages.gps2_raw.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.lat, this.lon, this.alt, this.dgps_age, this.eph, this.epv, this.vel, this.cog, this.fix_type, this.satellites_visible, this.dgps_numch, this.yaw, this.alt_ellipsoid, this.h_acc, this.v_acc, this.vel_acc, this.hdg_acc];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.power_status = function(...moreargs) {
  [this.Vcc, this.Vservo, this.flags] = moreargs;
  this._format = "<HHH";
  this._id = mavlink20.MAVLINK_MSG_ID_POWER_STATUS;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 203;
  this._name = "POWER_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["Vcc", "Vservo", "flags"];
};
mavlink20.messages.power_status.prototype = new mavlink20.message();
mavlink20.messages.power_status.prototype.pack = function(mav) {
  var orderedfields = [this.Vcc, this.Vservo, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.serial_control = function(...moreargs) {
  [this.device, this.flags, this.timeout, this.baudrate, this.count, this.data] = moreargs;
  this._format = "<IHBBB70s";
  this._id = mavlink20.MAVLINK_MSG_ID_SERIAL_CONTROL;
  this.order_map = [2, 3, 1, 0, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 70];
  this.array_len_map = [0, 0, 0, 0, 0, 70];
  this.crc_extra = 220;
  this._name = "SERIAL_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["device", "flags", "timeout", "baudrate", "count", "data"];
};
mavlink20.messages.serial_control.prototype = new mavlink20.message();
mavlink20.messages.serial_control.prototype.pack = function(mav) {
  var orderedfields = [this.baudrate, this.timeout, this.device, this.flags, this.count, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_rtk = function(...moreargs) {
  [this.time_last_baseline_ms, this.rtk_receiver_id, this.wn, this.tow, this.rtk_health, this.rtk_rate, this.nsats, this.baseline_coords_type, this.baseline_a_mm, this.baseline_b_mm, this.baseline_c_mm, this.accuracy, this.iar_num_hypotheses] = moreargs;
  this._format = "<IIiiiIiHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_RTK;
  this.order_map = [0, 8, 7, 1, 9, 10, 11, 12, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 25;
  this._name = "GPS_RTK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_last_baseline_ms", "rtk_receiver_id", "wn", "tow", "rtk_health", "rtk_rate", "nsats", "baseline_coords_type", "baseline_a_mm", "baseline_b_mm", "baseline_c_mm", "accuracy", "iar_num_hypotheses"];
};
mavlink20.messages.gps_rtk.prototype = new mavlink20.message();
mavlink20.messages.gps_rtk.prototype.pack = function(mav) {
  var orderedfields = [this.time_last_baseline_ms, this.tow, this.baseline_a_mm, this.baseline_b_mm, this.baseline_c_mm, this.accuracy, this.iar_num_hypotheses, this.wn, this.rtk_receiver_id, this.rtk_health, this.rtk_rate, this.nsats, this.baseline_coords_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps2_rtk = function(...moreargs) {
  [this.time_last_baseline_ms, this.rtk_receiver_id, this.wn, this.tow, this.rtk_health, this.rtk_rate, this.nsats, this.baseline_coords_type, this.baseline_a_mm, this.baseline_b_mm, this.baseline_c_mm, this.accuracy, this.iar_num_hypotheses] = moreargs;
  this._format = "<IIiiiIiHBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS2_RTK;
  this.order_map = [0, 8, 7, 1, 9, 10, 11, 12, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 226;
  this._name = "GPS2_RTK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_last_baseline_ms", "rtk_receiver_id", "wn", "tow", "rtk_health", "rtk_rate", "nsats", "baseline_coords_type", "baseline_a_mm", "baseline_b_mm", "baseline_c_mm", "accuracy", "iar_num_hypotheses"];
};
mavlink20.messages.gps2_rtk.prototype = new mavlink20.message();
mavlink20.messages.gps2_rtk.prototype.pack = function(mav) {
  var orderedfields = [this.time_last_baseline_ms, this.tow, this.baseline_a_mm, this.baseline_b_mm, this.baseline_c_mm, this.accuracy, this.iar_num_hypotheses, this.wn, this.rtk_receiver_id, this.rtk_health, this.rtk_rate, this.nsats, this.baseline_coords_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_imu3 = function(...moreargs) {
  [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature] = moreargs;
  this._format = "<Ihhhhhhhhhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_IMU3;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 46;
  this._name = "SCALED_IMU3";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro", "xmag", "ymag", "zmag", "temperature"];
};
mavlink20.messages.scaled_imu3.prototype = new mavlink20.message();
mavlink20.messages.scaled_imu3.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro, this.xmag, this.ymag, this.zmag, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.data_transmission_handshake = function(...moreargs) {
  [this.type, this.size, this.width, this.height, this.packets, this.payload, this.jpg_quality] = moreargs;
  this._format = "<IHHHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_DATA_TRANSMISSION_HANDSHAKE;
  this.order_map = [4, 0, 1, 2, 3, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 29;
  this._name = "DATA_TRANSMISSION_HANDSHAKE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "size", "width", "height", "packets", "payload", "jpg_quality"];
};
mavlink20.messages.data_transmission_handshake.prototype = new mavlink20.message();
mavlink20.messages.data_transmission_handshake.prototype.pack = function(mav) {
  var orderedfields = [this.size, this.width, this.height, this.packets, this.type, this.payload, this.jpg_quality];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.encapsulated_data = function(...moreargs) {
  [this.seqnr, this.data] = moreargs;
  this._format = "<H253s";
  this._id = mavlink20.MAVLINK_MSG_ID_ENCAPSULATED_DATA;
  this.order_map = [0, 1];
  this.len_map = [1, 253];
  this.array_len_map = [0, 253];
  this.crc_extra = 223;
  this._name = "ENCAPSULATED_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["seqnr", "data"];
};
mavlink20.messages.encapsulated_data.prototype = new mavlink20.message();
mavlink20.messages.encapsulated_data.prototype.pack = function(mav) {
  var orderedfields = [this.seqnr, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.distance_sensor = function(...moreargs) {
  [this.time_boot_ms, this.min_distance, this.max_distance, this.current_distance, this.type, this.id, this.orientation, this.covariance, this.horizontal_fov, this.vertical_fov, this.quaternion, this.signal_quality] = moreargs;
  this._format = "<IHHHBBBBff4fB";
  this._id = mavlink20.MAVLINK_MSG_ID_DISTANCE_SENSOR;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0];
  this.crc_extra = 85;
  this._name = "DISTANCE_SENSOR";
  this._instance_field = "id";
  this._instance_offset = 11;
  this.fieldnames = ["time_boot_ms", "min_distance", "max_distance", "current_distance", "type", "id", "orientation", "covariance", "horizontal_fov", "vertical_fov", "quaternion", "signal_quality"];
};
mavlink20.messages.distance_sensor.prototype = new mavlink20.message();
mavlink20.messages.distance_sensor.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.min_distance, this.max_distance, this.current_distance, this.type, this.id, this.orientation, this.covariance, this.horizontal_fov, this.vertical_fov, this.quaternion, this.signal_quality];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.terrain_request = function(...moreargs) {
  [this.lat, this.lon, this.grid_spacing, this.mask] = moreargs;
  this._format = "<QiiH";
  this._id = mavlink20.MAVLINK_MSG_ID_TERRAIN_REQUEST;
  this.order_map = [1, 2, 3, 0];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 6;
  this._name = "TERRAIN_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["lat", "lon", "grid_spacing", "mask"];
};
mavlink20.messages.terrain_request.prototype = new mavlink20.message();
mavlink20.messages.terrain_request.prototype.pack = function(mav) {
  var orderedfields = [this.mask, this.lat, this.lon, this.grid_spacing];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.terrain_data = function(...moreargs) {
  [this.lat, this.lon, this.grid_spacing, this.gridbit, this.data] = moreargs;
  this._format = "<iiH16hB";
  this._id = mavlink20.MAVLINK_MSG_ID_TERRAIN_DATA;
  this.order_map = [0, 1, 2, 4, 3];
  this.len_map = [1, 1, 1, 16, 1];
  this.array_len_map = [0, 0, 0, 16, 0];
  this.crc_extra = 229;
  this._name = "TERRAIN_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["lat", "lon", "grid_spacing", "gridbit", "data"];
};
mavlink20.messages.terrain_data.prototype = new mavlink20.message();
mavlink20.messages.terrain_data.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lon, this.grid_spacing, this.data, this.gridbit];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.terrain_check = function(...moreargs) {
  [this.lat, this.lon] = moreargs;
  this._format = "<ii";
  this._id = mavlink20.MAVLINK_MSG_ID_TERRAIN_CHECK;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 203;
  this._name = "TERRAIN_CHECK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["lat", "lon"];
};
mavlink20.messages.terrain_check.prototype = new mavlink20.message();
mavlink20.messages.terrain_check.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lon];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.terrain_report = function(...moreargs) {
  [this.lat, this.lon, this.spacing, this.terrain_height, this.current_height, this.pending, this.loaded] = moreargs;
  this._format = "<iiffHHH";
  this._id = mavlink20.MAVLINK_MSG_ID_TERRAIN_REPORT;
  this.order_map = [0, 1, 4, 2, 3, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 1;
  this._name = "TERRAIN_REPORT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["lat", "lon", "spacing", "terrain_height", "current_height", "pending", "loaded"];
};
mavlink20.messages.terrain_report.prototype = new mavlink20.message();
mavlink20.messages.terrain_report.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lon, this.terrain_height, this.current_height, this.spacing, this.pending, this.loaded];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_pressure2 = function(...moreargs) {
  [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff] = moreargs;
  this._format = "<Iffhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE2;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 195;
  this._name = "SCALED_PRESSURE2";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "press_abs", "press_diff", "temperature", "temperature_press_diff"];
};
mavlink20.messages.scaled_pressure2.prototype = new mavlink20.message();
mavlink20.messages.scaled_pressure2.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.att_pos_mocap = function(...moreargs) {
  [this.time_usec, this.q, this.x, this.y, this.z, this.covariance] = moreargs;
  this._format = "<Q4ffff21f";
  this._id = mavlink20.MAVLINK_MSG_ID_ATT_POS_MOCAP;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 4, 1, 1, 1, 21];
  this.array_len_map = [0, 4, 0, 0, 0, 21];
  this.crc_extra = 109;
  this._name = "ATT_POS_MOCAP";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "q", "x", "y", "z", "covariance"];
};
mavlink20.messages.att_pos_mocap.prototype = new mavlink20.message();
mavlink20.messages.att_pos_mocap.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.q, this.x, this.y, this.z, this.covariance];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_actuator_control_target = function(...moreargs) {
  [this.time_usec, this.group_mlx, this.target_system, this.target_component, this.controls] = moreargs;
  this._format = "<Q8fBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_ACTUATOR_CONTROL_TARGET;
  this.order_map = [0, 2, 3, 4, 1];
  this.len_map = [1, 8, 1, 1, 1];
  this.array_len_map = [0, 8, 0, 0, 0];
  this.crc_extra = 168;
  this._name = "SET_ACTUATOR_CONTROL_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "group_mlx", "target_system", "target_component", "controls"];
};
mavlink20.messages.set_actuator_control_target.prototype = new mavlink20.message();
mavlink20.messages.set_actuator_control_target.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.controls, this.group_mlx, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.actuator_control_target = function(...moreargs) {
  [this.time_usec, this.group_mlx, this.controls] = moreargs;
  this._format = "<Q8fB";
  this._id = mavlink20.MAVLINK_MSG_ID_ACTUATOR_CONTROL_TARGET;
  this.order_map = [0, 2, 1];
  this.len_map = [1, 8, 1];
  this.array_len_map = [0, 8, 0];
  this.crc_extra = 181;
  this._name = "ACTUATOR_CONTROL_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "group_mlx", "controls"];
};
mavlink20.messages.actuator_control_target.prototype = new mavlink20.message();
mavlink20.messages.actuator_control_target.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.controls, this.group_mlx];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.altitude = function(...moreargs) {
  [this.time_usec, this.altitude_monotonic, this.altitude_amsl, this.altitude_local, this.altitude_relative, this.altitude_terrain, this.bottom_clearance] = moreargs;
  this._format = "<Qffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_ALTITUDE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 47;
  this._name = "ALTITUDE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "altitude_monotonic", "altitude_amsl", "altitude_local", "altitude_relative", "altitude_terrain", "bottom_clearance"];
};
mavlink20.messages.altitude.prototype = new mavlink20.message();
mavlink20.messages.altitude.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.altitude_monotonic, this.altitude_amsl, this.altitude_local, this.altitude_relative, this.altitude_terrain, this.bottom_clearance];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.resource_request = function(...moreargs) {
  [this.request_id, this.uri_type, this.uri, this.transfer_type, this.storage] = moreargs;
  this._format = "<BB120sB120s";
  this._id = mavlink20.MAVLINK_MSG_ID_RESOURCE_REQUEST;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 120, 1, 120];
  this.array_len_map = [0, 0, 120, 0, 120];
  this.crc_extra = 72;
  this._name = "RESOURCE_REQUEST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["request_id", "uri_type", "uri", "transfer_type", "storage"];
};
mavlink20.messages.resource_request.prototype = new mavlink20.message();
mavlink20.messages.resource_request.prototype.pack = function(mav) {
  var orderedfields = [this.request_id, this.uri_type, this.uri, this.transfer_type, this.storage];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.scaled_pressure3 = function(...moreargs) {
  [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff] = moreargs;
  this._format = "<Iffhh";
  this._id = mavlink20.MAVLINK_MSG_ID_SCALED_PRESSURE3;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 131;
  this._name = "SCALED_PRESSURE3";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "press_abs", "press_diff", "temperature", "temperature_press_diff"];
};
mavlink20.messages.scaled_pressure3.prototype = new mavlink20.message();
mavlink20.messages.scaled_pressure3.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.press_abs, this.press_diff, this.temperature, this.temperature_press_diff];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.follow_target = function(...moreargs) {
  [this.timestamp, this.est_capabilities, this.lat, this.lon, this.alt, this.vel, this.acc, this.attitude_q, this.rates, this.position_cov, this.custom_state] = moreargs;
  this._format = "<QQiif3f3f4f3f3fB";
  this._id = mavlink20.MAVLINK_MSG_ID_FOLLOW_TARGET;
  this.order_map = [0, 10, 2, 3, 4, 5, 6, 7, 8, 9, 1];
  this.len_map = [1, 1, 1, 1, 1, 3, 3, 4, 3, 3, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 3, 3, 4, 3, 3, 0];
  this.crc_extra = 127;
  this._name = "FOLLOW_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "est_capabilities", "lat", "lon", "alt", "vel", "acc", "attitude_q", "rates", "position_cov", "custom_state"];
};
mavlink20.messages.follow_target.prototype = new mavlink20.message();
mavlink20.messages.follow_target.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.custom_state, this.lat, this.lon, this.alt, this.vel, this.acc, this.attitude_q, this.rates, this.position_cov, this.est_capabilities];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.control_system_state = function(...moreargs) {
  [this.time_usec, this.x_acc, this.y_acc, this.z_acc, this.x_vel, this.y_vel, this.z_vel, this.x_pos, this.y_pos, this.z_pos, this.airspeed, this.vel_variance, this.pos_variance, this.q, this.roll_rate, this.pitch_rate, this.yaw_rate] = moreargs;
  this._format = "<Qffffffffff3f3f4ffff";
  this._id = mavlink20.MAVLINK_MSG_ID_CONTROL_SYSTEM_STATE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 4, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 0, 0, 0];
  this.crc_extra = 103;
  this._name = "CONTROL_SYSTEM_STATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "x_acc", "y_acc", "z_acc", "x_vel", "y_vel", "z_vel", "x_pos", "y_pos", "z_pos", "airspeed", "vel_variance", "pos_variance", "q", "roll_rate", "pitch_rate", "yaw_rate"];
};
mavlink20.messages.control_system_state.prototype = new mavlink20.message();
mavlink20.messages.control_system_state.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.x_acc, this.y_acc, this.z_acc, this.x_vel, this.y_vel, this.z_vel, this.x_pos, this.y_pos, this.z_pos, this.airspeed, this.vel_variance, this.pos_variance, this.q, this.roll_rate, this.pitch_rate, this.yaw_rate];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.battery_status = function(...moreargs) {
  [this.id, this.battery_function, this.type, this.temperature, this.voltages, this.current_battery, this.current_consumed, this.energy_consumed, this.battery_remaining, this.time_remaining, this.charge_state, this.voltages_ext, this.mode, this.fault_bitmask] = moreargs;
  this._format = "<iih10HhBBBbiB4HBI";
  this._id = mavlink20.MAVLINK_MSG_ID_BATTERY_STATUS;
  this.order_map = [5, 6, 7, 2, 3, 4, 0, 1, 8, 9, 10, 11, 12, 13];
  this.len_map = [1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1];
  this.array_len_map = [0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0];
  this.crc_extra = 154;
  this._name = "BATTERY_STATUS";
  this._instance_field = "id";
  this._instance_offset = 32;
  this.fieldnames = ["id", "battery_function", "type", "temperature", "voltages", "current_battery", "current_consumed", "energy_consumed", "battery_remaining", "time_remaining", "charge_state", "voltages_ext", "mode", "fault_bitmask"];
};
mavlink20.messages.battery_status.prototype = new mavlink20.message();
mavlink20.messages.battery_status.prototype.pack = function(mav) {
  var orderedfields = [this.current_consumed, this.energy_consumed, this.temperature, this.voltages, this.current_battery, this.id, this.battery_function, this.type, this.battery_remaining, this.time_remaining, this.charge_state, this.voltages_ext, this.mode, this.fault_bitmask];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.autopilot_version = function(...moreargs) {
  [this.capabilities, this.flight_sw_version, this.middleware_sw_version, this.os_sw_version, this.board_version, this.flight_custom_version, this.middleware_custom_version, this.os_custom_version, this.vendor_id, this.product_id, this.uid, this.uid2] = moreargs;
  this._format = "<QQIIIIHH8s8s8s18s";
  this._id = mavlink20.MAVLINK_MSG_ID_AUTOPILOT_VERSION;
  this.order_map = [0, 2, 3, 4, 5, 8, 9, 10, 6, 7, 1, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 8, 18];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 18];
  this.crc_extra = 178;
  this._name = "AUTOPILOT_VERSION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["capabilities", "flight_sw_version", "middleware_sw_version", "os_sw_version", "board_version", "flight_custom_version", "middleware_custom_version", "os_custom_version", "vendor_id", "product_id", "uid", "uid2"];
};
mavlink20.messages.autopilot_version.prototype = new mavlink20.message();
mavlink20.messages.autopilot_version.prototype.pack = function(mav) {
  var orderedfields = [this.capabilities, this.uid, this.flight_sw_version, this.middleware_sw_version, this.os_sw_version, this.board_version, this.vendor_id, this.product_id, this.flight_custom_version, this.middleware_custom_version, this.os_custom_version, this.uid2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.landing_target = function(...moreargs) {
  [this.time_usec, this.target_num, this.frame, this.angle_x, this.angle_y, this.distance, this.size_x, this.size_y, this.x, this.y, this.z, this.q, this.type, this.position_valid] = moreargs;
  this._format = "<QfffffBBfff4fBB";
  this._id = mavlink20.MAVLINK_MSG_ID_LANDING_TARGET;
  this.order_map = [0, 6, 7, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0];
  this.crc_extra = 200;
  this._name = "LANDING_TARGET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "target_num", "frame", "angle_x", "angle_y", "distance", "size_x", "size_y", "x", "y", "z", "q", "type", "position_valid"];
};
mavlink20.messages.landing_target.prototype = new mavlink20.message();
mavlink20.messages.landing_target.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.angle_x, this.angle_y, this.distance, this.size_x, this.size_y, this.target_num, this.frame, this.x, this.y, this.z, this.q, this.type, this.position_valid];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.fence_status = function(...moreargs) {
  [this.breach_status, this.breach_count, this.breach_type, this.breach_time, this.breach_mitigation] = moreargs;
  this._format = "<IHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_FENCE_STATUS;
  this.order_map = [2, 1, 3, 0, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 189;
  this._name = "FENCE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["breach_status", "breach_count", "breach_type", "breach_time", "breach_mitigation"];
};
mavlink20.messages.fence_status.prototype = new mavlink20.message();
mavlink20.messages.fence_status.prototype.pack = function(mav) {
  var orderedfields = [this.breach_time, this.breach_count, this.breach_status, this.breach_type, this.breach_mitigation];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mag_cal_report = function(...moreargs) {
  [this.compass_id, this.cal_mask, this.cal_status, this.autosaved, this.fitness, this.ofs_x, this.ofs_y, this.ofs_z, this.diag_x, this.diag_y, this.diag_z, this.offdiag_x, this.offdiag_y, this.offdiag_z, this.orientation_confidence, this.old_orientation, this.new_orientation, this.scale_factor] = moreargs;
  this._format = "<ffffffffffBBBBfBBf";
  this._id = mavlink20.MAVLINK_MSG_ID_MAG_CAL_REPORT;
  this.order_map = [10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 36;
  this._name = "MAG_CAL_REPORT";
  this._instance_field = "compass_id";
  this._instance_offset = 40;
  this.fieldnames = ["compass_id", "cal_mask", "cal_status", "autosaved", "fitness", "ofs_x", "ofs_y", "ofs_z", "diag_x", "diag_y", "diag_z", "offdiag_x", "offdiag_y", "offdiag_z", "orientation_confidence", "old_orientation", "new_orientation", "scale_factor"];
};
mavlink20.messages.mag_cal_report.prototype = new mavlink20.message();
mavlink20.messages.mag_cal_report.prototype.pack = function(mav) {
  var orderedfields = [this.fitness, this.ofs_x, this.ofs_y, this.ofs_z, this.diag_x, this.diag_y, this.diag_z, this.offdiag_x, this.offdiag_y, this.offdiag_z, this.compass_id, this.cal_mask, this.cal_status, this.autosaved, this.orientation_confidence, this.old_orientation, this.new_orientation, this.scale_factor];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.efi_status = function(...moreargs) {
  [this.health, this.ecu_index, this.rpm, this.fuel_consumed, this.fuel_flow, this.engine_load, this.throttle_position, this.spark_dwell_time, this.barometric_pressure, this.intake_manifold_pressure, this.intake_manifold_temperature, this.cylinder_head_temperature, this.ignition_timing, this.injection_time, this.exhaust_gas_temperature, this.throttle_out, this.pt_compensation, this.ignition_voltage, this.fuel_pressure] = moreargs;
  this._format = "<ffffffffffffffffBff";
  this._id = mavlink20.MAVLINK_MSG_ID_EFI_STATUS;
  this.order_map = [16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 208;
  this._name = "EFI_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["health", "ecu_index", "rpm", "fuel_consumed", "fuel_flow", "engine_load", "throttle_position", "spark_dwell_time", "barometric_pressure", "intake_manifold_pressure", "intake_manifold_temperature", "cylinder_head_temperature", "ignition_timing", "injection_time", "exhaust_gas_temperature", "throttle_out", "pt_compensation", "ignition_voltage", "fuel_pressure"];
};
mavlink20.messages.efi_status.prototype = new mavlink20.message();
mavlink20.messages.efi_status.prototype.pack = function(mav) {
  var orderedfields = [this.ecu_index, this.rpm, this.fuel_consumed, this.fuel_flow, this.engine_load, this.throttle_position, this.spark_dwell_time, this.barometric_pressure, this.intake_manifold_pressure, this.intake_manifold_temperature, this.cylinder_head_temperature, this.ignition_timing, this.injection_time, this.exhaust_gas_temperature, this.throttle_out, this.pt_compensation, this.health, this.ignition_voltage, this.fuel_pressure];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.estimator_status = function(...moreargs) {
  [this.time_usec, this.flags, this.vel_ratio, this.pos_horiz_ratio, this.pos_vert_ratio, this.mag_ratio, this.hagl_ratio, this.tas_ratio, this.pos_horiz_accuracy, this.pos_vert_accuracy] = moreargs;
  this._format = "<QffffffffH";
  this._id = mavlink20.MAVLINK_MSG_ID_ESTIMATOR_STATUS;
  this.order_map = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 163;
  this._name = "ESTIMATOR_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "flags", "vel_ratio", "pos_horiz_ratio", "pos_vert_ratio", "mag_ratio", "hagl_ratio", "tas_ratio", "pos_horiz_accuracy", "pos_vert_accuracy"];
};
mavlink20.messages.estimator_status.prototype = new mavlink20.message();
mavlink20.messages.estimator_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.vel_ratio, this.pos_horiz_ratio, this.pos_vert_ratio, this.mag_ratio, this.hagl_ratio, this.tas_ratio, this.pos_horiz_accuracy, this.pos_vert_accuracy, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.wind_cov = function(...moreargs) {
  [this.time_usec, this.wind_x, this.wind_y, this.wind_z, this.var_horiz, this.var_vert, this.wind_alt, this.horiz_accuracy, this.vert_accuracy] = moreargs;
  this._format = "<Qffffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_WIND_COV;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 105;
  this._name = "WIND_COV";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "wind_x", "wind_y", "wind_z", "var_horiz", "var_vert", "wind_alt", "horiz_accuracy", "vert_accuracy"];
};
mavlink20.messages.wind_cov.prototype = new mavlink20.message();
mavlink20.messages.wind_cov.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.wind_x, this.wind_y, this.wind_z, this.var_horiz, this.var_vert, this.wind_alt, this.horiz_accuracy, this.vert_accuracy];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_input = function(...moreargs) {
  [this.time_usec, this.gps_id, this.ignore_flags, this.time_week_ms, this.time_week, this.fix_type, this.lat, this.lon, this.alt, this.hdop, this.vdop, this.vn, this.ve, this.vd, this.speed_accuracy, this.horiz_accuracy, this.vert_accuracy, this.satellites_visible, this.yaw] = moreargs;
  this._format = "<QIiifffffffffHHBBBH";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_INPUT;
  this.order_map = [0, 15, 13, 1, 14, 16, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 151;
  this._name = "GPS_INPUT";
  this._instance_field = "gps_id";
  this._instance_offset = 60;
  this.fieldnames = ["time_usec", "gps_id", "ignore_flags", "time_week_ms", "time_week", "fix_type", "lat", "lon", "alt", "hdop", "vdop", "vn", "ve", "vd", "speed_accuracy", "horiz_accuracy", "vert_accuracy", "satellites_visible", "yaw"];
};
mavlink20.messages.gps_input.prototype = new mavlink20.message();
mavlink20.messages.gps_input.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.time_week_ms, this.lat, this.lon, this.alt, this.hdop, this.vdop, this.vn, this.ve, this.vd, this.speed_accuracy, this.horiz_accuracy, this.vert_accuracy, this.ignore_flags, this.time_week, this.gps_id, this.fix_type, this.satellites_visible, this.yaw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gps_rtcm_data = function(...moreargs) {
  [this.flags, this.len, this.data] = moreargs;
  this._format = "<BB180s";
  this._id = mavlink20.MAVLINK_MSG_ID_GPS_RTCM_DATA;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 180];
  this.array_len_map = [0, 0, 180];
  this.crc_extra = 35;
  this._name = "GPS_RTCM_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["flags", "len", "data"];
};
mavlink20.messages.gps_rtcm_data.prototype = new mavlink20.message();
mavlink20.messages.gps_rtcm_data.prototype.pack = function(mav) {
  var orderedfields = [this.flags, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.high_latency = function(...moreargs) {
  [this.base_mode, this.custom_mode, this.landed_state, this.roll, this.pitch, this.heading, this.throttle, this.heading_sp, this.latitude, this.longitude, this.altitude_amsl, this.altitude_sp, this.airspeed, this.airspeed_sp, this.groundspeed, this.climb_rate, this.gps_nsat, this.gps_fix_type, this.battery_remaining, this.temperature, this.temperature_air, this.failsafe, this.wp_num, this.wp_distance] = moreargs;
  this._format = "<IiihhHhhhHBBbBBBbBBBbbBB";
  this._id = mavlink20.MAVLINK_MSG_ID_HIGH_LATENCY;
  this.order_map = [10, 0, 11, 3, 4, 5, 12, 6, 1, 2, 7, 8, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 150;
  this._name = "HIGH_LATENCY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["base_mode", "custom_mode", "landed_state", "roll", "pitch", "heading", "throttle", "heading_sp", "latitude", "longitude", "altitude_amsl", "altitude_sp", "airspeed", "airspeed_sp", "groundspeed", "climb_rate", "gps_nsat", "gps_fix_type", "battery_remaining", "temperature", "temperature_air", "failsafe", "wp_num", "wp_distance"];
};
mavlink20.messages.high_latency.prototype = new mavlink20.message();
mavlink20.messages.high_latency.prototype.pack = function(mav) {
  var orderedfields = [this.custom_mode, this.latitude, this.longitude, this.roll, this.pitch, this.heading, this.heading_sp, this.altitude_amsl, this.altitude_sp, this.wp_distance, this.base_mode, this.landed_state, this.throttle, this.airspeed, this.airspeed_sp, this.groundspeed, this.climb_rate, this.gps_nsat, this.gps_fix_type, this.battery_remaining, this.temperature, this.temperature_air, this.failsafe, this.wp_num];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.high_latency2 = function(...moreargs) {
  [this.timestamp, this.type, this.autopilot, this.custom_mode, this.latitude, this.longitude, this.altitude, this.target_altitude, this.heading, this.target_heading, this.target_distance, this.throttle, this.airspeed, this.airspeed_sp, this.groundspeed, this.windspeed, this.wind_heading, this.eph, this.epv, this.temperature_air, this.climb_rate, this.battery, this.wp_num, this.failure_flags, this.custom0, this.custom1, this.custom2] = moreargs;
  this._format = "<IiiHhhHHHBBBBBBBBBBBBbbbbbb";
  this._id = mavlink20.MAVLINK_MSG_ID_HIGH_LATENCY2;
  this.order_map = [0, 9, 10, 3, 1, 2, 4, 5, 11, 12, 6, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 7, 8, 24, 25, 26];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 179;
  this._name = "HIGH_LATENCY2";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "type", "autopilot", "custom_mode", "latitude", "longitude", "altitude", "target_altitude", "heading", "target_heading", "target_distance", "throttle", "airspeed", "airspeed_sp", "groundspeed", "windspeed", "wind_heading", "eph", "epv", "temperature_air", "climb_rate", "battery", "wp_num", "failure_flags", "custom0", "custom1", "custom2"];
};
mavlink20.messages.high_latency2.prototype = new mavlink20.message();
mavlink20.messages.high_latency2.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.latitude, this.longitude, this.custom_mode, this.altitude, this.target_altitude, this.target_distance, this.wp_num, this.failure_flags, this.type, this.autopilot, this.heading, this.target_heading, this.throttle, this.airspeed, this.airspeed_sp, this.groundspeed, this.windspeed, this.wind_heading, this.eph, this.epv, this.temperature_air, this.climb_rate, this.battery, this.custom0, this.custom1, this.custom2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.vibration = function(...moreargs) {
  [this.time_usec, this.vibration_x, this.vibration_y, this.vibration_z, this.clipping_0, this.clipping_1, this.clipping_2] = moreargs;
  this._format = "<QfffIII";
  this._id = mavlink20.MAVLINK_MSG_ID_VIBRATION;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 90;
  this._name = "VIBRATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "vibration_x", "vibration_y", "vibration_z", "clipping_0", "clipping_1", "clipping_2"];
};
mavlink20.messages.vibration.prototype = new mavlink20.message();
mavlink20.messages.vibration.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.vibration_x, this.vibration_y, this.vibration_z, this.clipping_0, this.clipping_1, this.clipping_2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.home_position = function(...moreargs) {
  [this.latitude, this.longitude, this.altitude, this.x, this.y, this.z, this.q, this.approach_x, this.approach_y, this.approach_z, this.time_usec] = moreargs;
  this._format = "<iiifff4ffffQ";
  this._id = mavlink20.MAVLINK_MSG_ID_HOME_POSITION;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0];
  this.crc_extra = 104;
  this._name = "HOME_POSITION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["latitude", "longitude", "altitude", "x", "y", "z", "q", "approach_x", "approach_y", "approach_z", "time_usec"];
};
mavlink20.messages.home_position.prototype = new mavlink20.message();
mavlink20.messages.home_position.prototype.pack = function(mav) {
  var orderedfields = [this.latitude, this.longitude, this.altitude, this.x, this.y, this.z, this.q, this.approach_x, this.approach_y, this.approach_z, this.time_usec];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.set_home_position = function(...moreargs) {
  [this.target_system, this.latitude, this.longitude, this.altitude, this.x, this.y, this.z, this.q, this.approach_x, this.approach_y, this.approach_z, this.time_usec] = moreargs;
  this._format = "<iiifff4ffffBQ";
  this._id = mavlink20.MAVLINK_MSG_ID_SET_HOME_POSITION;
  this.order_map = [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0];
  this.crc_extra = 85;
  this._name = "SET_HOME_POSITION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "latitude", "longitude", "altitude", "x", "y", "z", "q", "approach_x", "approach_y", "approach_z", "time_usec"];
};
mavlink20.messages.set_home_position.prototype = new mavlink20.message();
mavlink20.messages.set_home_position.prototype.pack = function(mav) {
  var orderedfields = [this.latitude, this.longitude, this.altitude, this.x, this.y, this.z, this.q, this.approach_x, this.approach_y, this.approach_z, this.target_system, this.time_usec];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.message_interval = function(...moreargs) {
  [this.message_id, this.interval_us] = moreargs;
  this._format = "<iH";
  this._id = mavlink20.MAVLINK_MSG_ID_MESSAGE_INTERVAL;
  this.order_map = [1, 0];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 95;
  this._name = "MESSAGE_INTERVAL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["message_id", "interval_us"];
};
mavlink20.messages.message_interval.prototype = new mavlink20.message();
mavlink20.messages.message_interval.prototype.pack = function(mav) {
  var orderedfields = [this.interval_us, this.message_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.extended_sys_state = function(...moreargs) {
  [this.vtol_state, this.landed_state] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_EXTENDED_SYS_STATE;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 130;
  this._name = "EXTENDED_SYS_STATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["vtol_state", "landed_state"];
};
mavlink20.messages.extended_sys_state.prototype = new mavlink20.message();
mavlink20.messages.extended_sys_state.prototype.pack = function(mav) {
  var orderedfields = [this.vtol_state, this.landed_state];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.adsb_vehicle = function(...moreargs) {
  [this.ICAO_address, this.lat, this.lon, this.altitude_type, this.altitude, this.heading, this.hor_velocity, this.ver_velocity, this.callsign, this.emitter_type, this.tslc, this.flags, this.squawk] = moreargs;
  this._format = "<IiiiHHhHHB9sBB";
  this._id = mavlink20.MAVLINK_MSG_ID_ADSB_VEHICLE;
  this.order_map = [0, 1, 2, 9, 3, 4, 5, 6, 10, 11, 12, 7, 8];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0];
  this.crc_extra = 184;
  this._name = "ADSB_VEHICLE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ICAO_address", "lat", "lon", "altitude_type", "altitude", "heading", "hor_velocity", "ver_velocity", "callsign", "emitter_type", "tslc", "flags", "squawk"];
};
mavlink20.messages.adsb_vehicle.prototype = new mavlink20.message();
mavlink20.messages.adsb_vehicle.prototype.pack = function(mav) {
  var orderedfields = [this.ICAO_address, this.lat, this.lon, this.altitude, this.heading, this.hor_velocity, this.ver_velocity, this.flags, this.squawk, this.altitude_type, this.callsign, this.emitter_type, this.tslc];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.collision = function(...moreargs) {
  [this.src, this.id, this.action, this.threat_level, this.time_to_minimum_delta, this.altitude_minimum_delta, this.horizontal_minimum_delta] = moreargs;
  this._format = "<IfffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COLLISION;
  this.order_map = [4, 0, 5, 6, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 81;
  this._name = "COLLISION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["src", "id", "action", "threat_level", "time_to_minimum_delta", "altitude_minimum_delta", "horizontal_minimum_delta"];
};
mavlink20.messages.collision.prototype = new mavlink20.message();
mavlink20.messages.collision.prototype.pack = function(mav) {
  var orderedfields = [this.id, this.time_to_minimum_delta, this.altitude_minimum_delta, this.horizontal_minimum_delta, this.src, this.action, this.threat_level];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.v2_extension = function(...moreargs) {
  [this.target_network, this.target_system, this.target_component, this.message_type, this.payload] = moreargs;
  this._format = "<HBBB249s";
  this._id = mavlink20.MAVLINK_MSG_ID_V2_EXTENSION;
  this.order_map = [1, 2, 3, 0, 4];
  this.len_map = [1, 1, 1, 1, 249];
  this.array_len_map = [0, 0, 0, 0, 249];
  this.crc_extra = 8;
  this._name = "V2_EXTENSION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_network", "target_system", "target_component", "message_type", "payload"];
};
mavlink20.messages.v2_extension.prototype = new mavlink20.message();
mavlink20.messages.v2_extension.prototype.pack = function(mav) {
  var orderedfields = [this.message_type, this.target_network, this.target_system, this.target_component, this.payload];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.memory_vect = function(...moreargs) {
  [this.address, this.ver, this.type, this.value] = moreargs;
  this._format = "<HBB32s";
  this._id = mavlink20.MAVLINK_MSG_ID_MEMORY_VECT;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 32];
  this.array_len_map = [0, 0, 0, 32];
  this.crc_extra = 204;
  this._name = "MEMORY_VECT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["address", "ver", "type", "value"];
};
mavlink20.messages.memory_vect.prototype = new mavlink20.message();
mavlink20.messages.memory_vect.prototype.pack = function(mav) {
  var orderedfields = [this.address, this.ver, this.type, this.value];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.debug_vect = function(...moreargs) {
  [this.name, this.time_usec, this.x, this.y, this.z] = moreargs;
  this._format = "<Qfff10s";
  this._id = mavlink20.MAVLINK_MSG_ID_DEBUG_VECT;
  this.order_map = [4, 0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 10];
  this.crc_extra = 49;
  this._name = "DEBUG_VECT";
  this._instance_field = "name";
  this._instance_offset = 20;
  this.fieldnames = ["name", "time_usec", "x", "y", "z"];
};
mavlink20.messages.debug_vect.prototype = new mavlink20.message();
mavlink20.messages.debug_vect.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.x, this.y, this.z, this.name];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.named_value_float = function(...moreargs) {
  [this.time_boot_ms, this.name, this.value] = moreargs;
  this._format = "<If10s";
  this._id = mavlink20.MAVLINK_MSG_ID_NAMED_VALUE_FLOAT;
  this.order_map = [0, 2, 1];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 10];
  this.crc_extra = 170;
  this._name = "NAMED_VALUE_FLOAT";
  this._instance_field = "name";
  this._instance_offset = 8;
  this.fieldnames = ["time_boot_ms", "name", "value"];
};
mavlink20.messages.named_value_float.prototype = new mavlink20.message();
mavlink20.messages.named_value_float.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.value, this.name];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.named_value_int = function(...moreargs) {
  [this.time_boot_ms, this.name, this.value] = moreargs;
  this._format = "<Ii10s";
  this._id = mavlink20.MAVLINK_MSG_ID_NAMED_VALUE_INT;
  this.order_map = [0, 2, 1];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 10];
  this.crc_extra = 44;
  this._name = "NAMED_VALUE_INT";
  this._instance_field = "name";
  this._instance_offset = 8;
  this.fieldnames = ["time_boot_ms", "name", "value"];
};
mavlink20.messages.named_value_int.prototype = new mavlink20.message();
mavlink20.messages.named_value_int.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.value, this.name];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.statustext = function(...moreargs) {
  [this.severity, this.text, this.id, this.chunk_seq] = moreargs;
  this._format = "<B50sHB";
  this._id = mavlink20.MAVLINK_MSG_ID_STATUSTEXT;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 50, 0, 0];
  this.crc_extra = 83;
  this._name = "STATUSTEXT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["severity", "text", "id", "chunk_seq"];
};
mavlink20.messages.statustext.prototype = new mavlink20.message();
mavlink20.messages.statustext.prototype.pack = function(mav) {
  var orderedfields = [this.severity, this.text, this.id, this.chunk_seq];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.debug = function(...moreargs) {
  [this.time_boot_ms, this.ind, this.value] = moreargs;
  this._format = "<IfB";
  this._id = mavlink20.MAVLINK_MSG_ID_DEBUG;
  this.order_map = [0, 2, 1];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 46;
  this._name = "DEBUG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "ind", "value"];
};
mavlink20.messages.debug.prototype = new mavlink20.message();
mavlink20.messages.debug.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.value, this.ind];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.setup_signing = function(...moreargs) {
  [this.target_system, this.target_component, this.secret_key, this.initial_timestamp] = moreargs;
  this._format = "<QBB32s";
  this._id = mavlink20.MAVLINK_MSG_ID_SETUP_SIGNING;
  this.order_map = [1, 2, 3, 0];
  this.len_map = [1, 1, 1, 32];
  this.array_len_map = [0, 0, 0, 32];
  this.crc_extra = 71;
  this._name = "SETUP_SIGNING";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "secret_key", "initial_timestamp"];
};
mavlink20.messages.setup_signing.prototype = new mavlink20.message();
mavlink20.messages.setup_signing.prototype.pack = function(mav) {
  var orderedfields = [this.initial_timestamp, this.target_system, this.target_component, this.secret_key];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.button_change = function(...moreargs) {
  [this.time_boot_ms, this.last_change_ms, this.state] = moreargs;
  this._format = "<IIB";
  this._id = mavlink20.MAVLINK_MSG_ID_BUTTON_CHANGE;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 131;
  this._name = "BUTTON_CHANGE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "last_change_ms", "state"];
};
mavlink20.messages.button_change.prototype = new mavlink20.message();
mavlink20.messages.button_change.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.last_change_ms, this.state];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.play_tune = function(...moreargs) {
  [this.target_system, this.target_component, this.tune, this.tune2] = moreargs;
  this._format = "<BB30s200s";
  this._id = mavlink20.MAVLINK_MSG_ID_PLAY_TUNE;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 30, 200];
  this.crc_extra = 187;
  this._name = "PLAY_TUNE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "tune", "tune2"];
};
mavlink20.messages.play_tune.prototype = new mavlink20.message();
mavlink20.messages.play_tune.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.tune, this.tune2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_information = function(...moreargs) {
  [this.time_boot_ms, this.vendor_name, this.model_name, this.firmware_version, this.focal_length, this.sensor_size_h, this.sensor_size_v, this.resolution_h, this.resolution_v, this.lens_id, this.flags, this.cam_definition_version, this.cam_definition_uri, this.gimbal_device_id] = moreargs;
  this._format = "<IIfffIHHH32s32sB140sB";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_INFORMATION;
  this.order_map = [0, 9, 10, 1, 2, 3, 4, 6, 7, 11, 5, 8, 12, 13];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 32, 32, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 0, 140, 0];
  this.crc_extra = 92;
  this._name = "CAMERA_INFORMATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "vendor_name", "model_name", "firmware_version", "focal_length", "sensor_size_h", "sensor_size_v", "resolution_h", "resolution_v", "lens_id", "flags", "cam_definition_version", "cam_definition_uri", "gimbal_device_id"];
};
mavlink20.messages.camera_information.prototype = new mavlink20.message();
mavlink20.messages.camera_information.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.firmware_version, this.focal_length, this.sensor_size_h, this.sensor_size_v, this.flags, this.resolution_h, this.resolution_v, this.cam_definition_version, this.vendor_name, this.model_name, this.lens_id, this.cam_definition_uri, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_settings = function(...moreargs) {
  [this.time_boot_ms, this.mode_id, this.zoomLevel, this.focusLevel] = moreargs;
  this._format = "<IBff";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_SETTINGS;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 146;
  this._name = "CAMERA_SETTINGS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "mode_id", "zoomLevel", "focusLevel"];
};
mavlink20.messages.camera_settings.prototype = new mavlink20.message();
mavlink20.messages.camera_settings.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.mode_id, this.zoomLevel, this.focusLevel];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storage_information = function(...moreargs) {
  [this.time_boot_ms, this.storage_id, this.storage_count, this.status, this.total_capacity, this.used_capacity, this.available_capacity, this.read_speed, this.write_speed, this.type, this.name] = moreargs;
  this._format = "<IfffffBBBB32s";
  this._id = mavlink20.MAVLINK_MSG_ID_STORAGE_INFORMATION;
  this.order_map = [0, 6, 7, 8, 1, 2, 3, 4, 5, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32];
  this.crc_extra = 179;
  this._name = "STORAGE_INFORMATION";
  this._instance_field = "storage_id";
  this._instance_offset = 24;
  this.fieldnames = ["time_boot_ms", "storage_id", "storage_count", "status", "total_capacity", "used_capacity", "available_capacity", "read_speed", "write_speed", "type", "name"];
};
mavlink20.messages.storage_information.prototype = new mavlink20.message();
mavlink20.messages.storage_information.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.total_capacity, this.used_capacity, this.available_capacity, this.read_speed, this.write_speed, this.storage_id, this.storage_count, this.status, this.type, this.name];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_capture_status = function(...moreargs) {
  [this.time_boot_ms, this.image_status, this.video_status, this.image_interval, this.recording_time_ms, this.available_capacity, this.image_count] = moreargs;
  this._format = "<IfIfBBi";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_CAPTURE_STATUS;
  this.order_map = [0, 4, 5, 1, 2, 3, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 12;
  this._name = "CAMERA_CAPTURE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "image_status", "video_status", "image_interval", "recording_time_ms", "available_capacity", "image_count"];
};
mavlink20.messages.camera_capture_status.prototype = new mavlink20.message();
mavlink20.messages.camera_capture_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.image_interval, this.recording_time_ms, this.available_capacity, this.image_status, this.video_status, this.image_count];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_image_captured = function(...moreargs) {
  [this.time_boot_ms, this.time_utc, this.camera_id, this.lat, this.lon, this.alt, this.relative_alt, this.q, this.image_index, this.capture_result, this.file_url] = moreargs;
  this._format = "<QIiiii4fiBb205s";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_IMAGE_CAPTURED;
  this.order_map = [1, 0, 8, 2, 3, 4, 5, 6, 7, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 205];
  this.crc_extra = 133;
  this._name = "CAMERA_IMAGE_CAPTURED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "time_utc", "camera_id", "lat", "lon", "alt", "relative_alt", "q", "image_index", "capture_result", "file_url"];
};
mavlink20.messages.camera_image_captured.prototype = new mavlink20.message();
mavlink20.messages.camera_image_captured.prototype.pack = function(mav) {
  var orderedfields = [this.time_utc, this.time_boot_ms, this.lat, this.lon, this.alt, this.relative_alt, this.q, this.image_index, this.camera_id, this.capture_result, this.file_url];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.flight_information = function(...moreargs) {
  [this.time_boot_ms, this.arming_time_utc, this.takeoff_time_utc, this.flight_uuid] = moreargs;
  this._format = "<QQQI";
  this._id = mavlink20.MAVLINK_MSG_ID_FLIGHT_INFORMATION;
  this.order_map = [3, 0, 1, 2];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 49;
  this._name = "FLIGHT_INFORMATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "arming_time_utc", "takeoff_time_utc", "flight_uuid"];
};
mavlink20.messages.flight_information.prototype = new mavlink20.message();
mavlink20.messages.flight_information.prototype.pack = function(mav) {
  var orderedfields = [this.arming_time_utc, this.takeoff_time_utc, this.flight_uuid, this.time_boot_ms];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mount_orientation = function(...moreargs) {
  [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.yaw_absolute] = moreargs;
  this._format = "<Iffff";
  this._id = mavlink20.MAVLINK_MSG_ID_MOUNT_ORIENTATION;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 26;
  this._name = "MOUNT_ORIENTATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "roll", "pitch", "yaw", "yaw_absolute"];
};
mavlink20.messages.mount_orientation.prototype = new mavlink20.message();
mavlink20.messages.mount_orientation.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.roll, this.pitch, this.yaw, this.yaw_absolute];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.logging_data = function(...moreargs) {
  [this.target_system, this.target_component, this.sequence, this.length, this.first_message_offset, this.data] = moreargs;
  this._format = "<HBBBB249s";
  this._id = mavlink20.MAVLINK_MSG_ID_LOGGING_DATA;
  this.order_map = [1, 2, 0, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 249];
  this.array_len_map = [0, 0, 0, 0, 0, 249];
  this.crc_extra = 193;
  this._name = "LOGGING_DATA";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "sequence", "length", "first_message_offset", "data"];
};
mavlink20.messages.logging_data.prototype = new mavlink20.message();
mavlink20.messages.logging_data.prototype.pack = function(mav) {
  var orderedfields = [this.sequence, this.target_system, this.target_component, this.length, this.first_message_offset, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.logging_data_acked = function(...moreargs) {
  [this.target_system, this.target_component, this.sequence, this.length, this.first_message_offset, this.data] = moreargs;
  this._format = "<HBBBB249s";
  this._id = mavlink20.MAVLINK_MSG_ID_LOGGING_DATA_ACKED;
  this.order_map = [1, 2, 0, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 249];
  this.array_len_map = [0, 0, 0, 0, 0, 249];
  this.crc_extra = 35;
  this._name = "LOGGING_DATA_ACKED";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "sequence", "length", "first_message_offset", "data"];
};
mavlink20.messages.logging_data_acked.prototype = new mavlink20.message();
mavlink20.messages.logging_data_acked.prototype.pack = function(mav) {
  var orderedfields = [this.sequence, this.target_system, this.target_component, this.length, this.first_message_offset, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.logging_ack = function(...moreargs) {
  [this.target_system, this.target_component, this.sequence] = moreargs;
  this._format = "<HBB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOGGING_ACK;
  this.order_map = [1, 2, 0];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 14;
  this._name = "LOGGING_ACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "sequence"];
};
mavlink20.messages.logging_ack.prototype = new mavlink20.message();
mavlink20.messages.logging_ack.prototype.pack = function(mav) {
  var orderedfields = [this.sequence, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.video_stream_information = function(...moreargs) {
  [this.stream_id, this.count, this.type, this.flags, this.framerate, this.resolution_h, this.resolution_v, this.bitrate, this.rotation, this.hfov, this.name, this.uri] = moreargs;
  this._format = "<fIHHHHHBBB32s160s";
  this._id = mavlink20.MAVLINK_MSG_ID_VIDEO_STREAM_INFORMATION;
  this.order_map = [7, 8, 9, 2, 0, 3, 4, 1, 5, 6, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 160];
  this.crc_extra = 109;
  this._name = "VIDEO_STREAM_INFORMATION";
  this._instance_field = "stream_id";
  this._instance_offset = 18;
  this.fieldnames = ["stream_id", "count", "type", "flags", "framerate", "resolution_h", "resolution_v", "bitrate", "rotation", "hfov", "name", "uri"];
};
mavlink20.messages.video_stream_information.prototype = new mavlink20.message();
mavlink20.messages.video_stream_information.prototype.pack = function(mav) {
  var orderedfields = [this.framerate, this.bitrate, this.flags, this.resolution_h, this.resolution_v, this.rotation, this.hfov, this.stream_id, this.count, this.type, this.name, this.uri];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.video_stream_status = function(...moreargs) {
  [this.stream_id, this.flags, this.framerate, this.resolution_h, this.resolution_v, this.bitrate, this.rotation, this.hfov] = moreargs;
  this._format = "<fIHHHHHB";
  this._id = mavlink20.MAVLINK_MSG_ID_VIDEO_STREAM_STATUS;
  this.order_map = [7, 2, 0, 3, 4, 1, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 59;
  this._name = "VIDEO_STREAM_STATUS";
  this._instance_field = "stream_id";
  this._instance_offset = 18;
  this.fieldnames = ["stream_id", "flags", "framerate", "resolution_h", "resolution_v", "bitrate", "rotation", "hfov"];
};
mavlink20.messages.video_stream_status.prototype = new mavlink20.message();
mavlink20.messages.video_stream_status.prototype.pack = function(mav) {
  var orderedfields = [this.framerate, this.bitrate, this.flags, this.resolution_h, this.resolution_v, this.rotation, this.hfov, this.stream_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_fov_status = function(...moreargs) {
  [this.time_boot_ms, this.lat_camera, this.lon_camera, this.alt_camera, this.lat_image, this.lon_image, this.alt_image, this.q, this.hfov, this.vfov] = moreargs;
  this._format = "<Iiiiiii4fff";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_FOV_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 4, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 4, 0, 0];
  this.crc_extra = 22;
  this._name = "CAMERA_FOV_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "lat_camera", "lon_camera", "alt_camera", "lat_image", "lon_image", "alt_image", "q", "hfov", "vfov"];
};
mavlink20.messages.camera_fov_status.prototype = new mavlink20.message();
mavlink20.messages.camera_fov_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat_camera, this.lon_camera, this.alt_camera, this.lat_image, this.lon_image, this.alt_image, this.q, this.hfov, this.vfov];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_tracking_image_status = function(...moreargs) {
  [this.tracking_status, this.tracking_mode, this.target_data, this.point_x, this.point_y, this.radius, this.rec_top_x, this.rec_top_y, this.rec_bottom_x, this.rec_bottom_y] = moreargs;
  this._format = "<fffffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_TRACKING_IMAGE_STATUS;
  this.order_map = [7, 8, 9, 0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 126;
  this._name = "CAMERA_TRACKING_IMAGE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["tracking_status", "tracking_mode", "target_data", "point_x", "point_y", "radius", "rec_top_x", "rec_top_y", "rec_bottom_x", "rec_bottom_y"];
};
mavlink20.messages.camera_tracking_image_status.prototype = new mavlink20.message();
mavlink20.messages.camera_tracking_image_status.prototype.pack = function(mav) {
  var orderedfields = [this.point_x, this.point_y, this.radius, this.rec_top_x, this.rec_top_y, this.rec_bottom_x, this.rec_bottom_y, this.tracking_status, this.tracking_mode, this.target_data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.camera_tracking_geo_status = function(...moreargs) {
  [this.tracking_status, this.lat, this.lon, this.alt, this.h_acc, this.v_acc, this.vel_n, this.vel_e, this.vel_d, this.vel_acc, this.dist, this.hdg, this.hdg_acc] = moreargs;
  this._format = "<iiffffffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_CAMERA_TRACKING_GEO_STATUS;
  this.order_map = [12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 18;
  this._name = "CAMERA_TRACKING_GEO_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["tracking_status", "lat", "lon", "alt", "h_acc", "v_acc", "vel_n", "vel_e", "vel_d", "vel_acc", "dist", "hdg", "hdg_acc"];
};
mavlink20.messages.camera_tracking_geo_status.prototype = new mavlink20.message();
mavlink20.messages.camera_tracking_geo_status.prototype.pack = function(mav) {
  var orderedfields = [this.lat, this.lon, this.alt, this.h_acc, this.v_acc, this.vel_n, this.vel_e, this.vel_d, this.vel_acc, this.dist, this.hdg, this.hdg_acc, this.tracking_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_manager_information = function(...moreargs) {
  [this.time_boot_ms, this.cap_flags, this.gimbal_device_id, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max] = moreargs;
  this._format = "<IIffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_INFORMATION;
  this.order_map = [0, 1, 8, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 70;
  this._name = "GIMBAL_MANAGER_INFORMATION";
  this._instance_field = "gimbal_device_id";
  this._instance_offset = 32;
  this.fieldnames = ["time_boot_ms", "cap_flags", "gimbal_device_id", "roll_min", "roll_max", "pitch_min", "pitch_max", "yaw_min", "yaw_max"];
};
mavlink20.messages.gimbal_manager_information.prototype = new mavlink20.message();
mavlink20.messages.gimbal_manager_information.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.cap_flags, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_manager_status = function(...moreargs) {
  [this.time_boot_ms, this.flags, this.gimbal_device_id, this.primary_control_sysid, this.primary_control_compid, this.secondary_control_sysid, this.secondary_control_compid] = moreargs;
  this._format = "<IIBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 48;
  this._name = "GIMBAL_MANAGER_STATUS";
  this._instance_field = "gimbal_device_id";
  this._instance_offset = 8;
  this.fieldnames = ["time_boot_ms", "flags", "gimbal_device_id", "primary_control_sysid", "primary_control_compid", "secondary_control_sysid", "secondary_control_compid"];
};
mavlink20.messages.gimbal_manager_status.prototype = new mavlink20.message();
mavlink20.messages.gimbal_manager_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.flags, this.gimbal_device_id, this.primary_control_sysid, this.primary_control_compid, this.secondary_control_sysid, this.secondary_control_compid];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_manager_set_attitude = function(...moreargs) {
  [this.target_system, this.target_component, this.flags, this.gimbal_device_id, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z] = moreargs;
  this._format = "<I4ffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_ATTITUDE;
  this.order_map = [5, 6, 0, 7, 1, 2, 3, 4];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 123;
  this._name = "GIMBAL_MANAGER_SET_ATTITUDE";
  this._instance_field = "gimbal_device_id";
  this._instance_offset = 34;
  this.fieldnames = ["target_system", "target_component", "flags", "gimbal_device_id", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z"];
};
mavlink20.messages.gimbal_manager_set_attitude.prototype = new mavlink20.message();
mavlink20.messages.gimbal_manager_set_attitude.prototype.pack = function(mav) {
  var orderedfields = [this.flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.target_system, this.target_component, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_device_information = function(...moreargs) {
  [this.time_boot_ms, this.vendor_name, this.model_name, this.custom_name, this.firmware_version, this.hardware_version, this.uid, this.cap_flags, this.custom_cap_flags, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max, this.gimbal_device_id] = moreargs;
  this._format = "<QIIIffffffHH32s32s32sB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_INFORMATION;
  this.order_map = [1, 12, 13, 14, 2, 3, 0, 10, 11, 4, 5, 6, 7, 8, 9, 15];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 0];
  this.crc_extra = 74;
  this._name = "GIMBAL_DEVICE_INFORMATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "vendor_name", "model_name", "custom_name", "firmware_version", "hardware_version", "uid", "cap_flags", "custom_cap_flags", "roll_min", "roll_max", "pitch_min", "pitch_max", "yaw_min", "yaw_max", "gimbal_device_id"];
};
mavlink20.messages.gimbal_device_information.prototype = new mavlink20.message();
mavlink20.messages.gimbal_device_information.prototype.pack = function(mav) {
  var orderedfields = [this.uid, this.time_boot_ms, this.firmware_version, this.hardware_version, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max, this.cap_flags, this.custom_cap_flags, this.vendor_name, this.model_name, this.custom_name, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_device_set_attitude = function(...moreargs) {
  [this.target_system, this.target_component, this.flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z] = moreargs;
  this._format = "<4ffffHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_SET_ATTITUDE;
  this.order_map = [5, 6, 4, 0, 1, 2, 3];
  this.len_map = [4, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [4, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 99;
  this._name = "GIMBAL_DEVICE_SET_ATTITUDE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "flags", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z"];
};
mavlink20.messages.gimbal_device_set_attitude.prototype = new mavlink20.message();
mavlink20.messages.gimbal_device_set_attitude.prototype.pack = function(mav) {
  var orderedfields = [this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.flags, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_device_attitude_status = function(...moreargs) {
  [this.target_system, this.target_component, this.time_boot_ms, this.flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.failure_flags, this.delta_yaw, this.delta_yaw_velocity, this.gimbal_device_id] = moreargs;
  this._format = "<I4ffffIHBBffB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_DEVICE_ATTITUDE_STATUS;
  this.order_map = [7, 8, 0, 6, 1, 2, 3, 4, 5, 9, 10, 11];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 137;
  this._name = "GIMBAL_DEVICE_ATTITUDE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "time_boot_ms", "flags", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z", "failure_flags", "delta_yaw", "delta_yaw_velocity", "gimbal_device_id"];
};
mavlink20.messages.gimbal_device_attitude_status.prototype = new mavlink20.message();
mavlink20.messages.gimbal_device_attitude_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.failure_flags, this.flags, this.target_system, this.target_component, this.delta_yaw, this.delta_yaw_velocity, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.autopilot_state_for_gimbal_device = function(...moreargs) {
  [this.target_system, this.target_component, this.time_boot_us, this.q, this.q_estimated_delay_us, this.vx, this.vy, this.vz, this.v_estimated_delay_us, this.feed_forward_angular_velocity_z, this.estimator_status, this.landed_state, this.angular_velocity_z] = moreargs;
  this._format = "<Q4fIfffIfHBBBf";
  this._id = mavlink20.MAVLINK_MSG_ID_AUTOPILOT_STATE_FOR_GIMBAL_DEVICE;
  this.order_map = [9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 210;
  this._name = "AUTOPILOT_STATE_FOR_GIMBAL_DEVICE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "time_boot_us", "q", "q_estimated_delay_us", "vx", "vy", "vz", "v_estimated_delay_us", "feed_forward_angular_velocity_z", "estimator_status", "landed_state", "angular_velocity_z"];
};
mavlink20.messages.autopilot_state_for_gimbal_device.prototype = new mavlink20.message();
mavlink20.messages.autopilot_state_for_gimbal_device.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_us, this.q, this.q_estimated_delay_us, this.vx, this.vy, this.vz, this.v_estimated_delay_us, this.feed_forward_angular_velocity_z, this.estimator_status, this.target_system, this.target_component, this.landed_state, this.angular_velocity_z];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_manager_set_pitchyaw = function(...moreargs) {
  [this.target_system, this.target_component, this.flags, this.gimbal_device_id, this.pitch, this.yaw, this.pitch_rate, this.yaw_rate] = moreargs;
  this._format = "<IffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_PITCHYAW;
  this.order_map = [5, 6, 0, 7, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 1;
  this._name = "GIMBAL_MANAGER_SET_PITCHYAW";
  this._instance_field = "gimbal_device_id";
  this._instance_offset = 22;
  this.fieldnames = ["target_system", "target_component", "flags", "gimbal_device_id", "pitch", "yaw", "pitch_rate", "yaw_rate"];
};
mavlink20.messages.gimbal_manager_set_pitchyaw.prototype = new mavlink20.message();
mavlink20.messages.gimbal_manager_set_pitchyaw.prototype.pack = function(mav) {
  var orderedfields = [this.flags, this.pitch, this.yaw, this.pitch_rate, this.yaw_rate, this.target_system, this.target_component, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.gimbal_manager_set_manual_control = function(...moreargs) {
  [this.target_system, this.target_component, this.flags, this.gimbal_device_id, this.pitch, this.yaw, this.pitch_rate, this.yaw_rate] = moreargs;
  this._format = "<IffffBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_GIMBAL_MANAGER_SET_MANUAL_CONTROL;
  this.order_map = [5, 6, 0, 7, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 20;
  this._name = "GIMBAL_MANAGER_SET_MANUAL_CONTROL";
  this._instance_field = "gimbal_device_id";
  this._instance_offset = 22;
  this.fieldnames = ["target_system", "target_component", "flags", "gimbal_device_id", "pitch", "yaw", "pitch_rate", "yaw_rate"];
};
mavlink20.messages.gimbal_manager_set_manual_control.prototype = new mavlink20.message();
mavlink20.messages.gimbal_manager_set_manual_control.prototype.pack = function(mav) {
  var orderedfields = [this.flags, this.pitch, this.yaw, this.pitch_rate, this.yaw_rate, this.target_system, this.target_component, this.gimbal_device_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.wifi_config_ap = function(...moreargs) {
  [this.ssid, this.password] = moreargs;
  this._format = "<32s64s";
  this._id = mavlink20.MAVLINK_MSG_ID_WIFI_CONFIG_AP;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [32, 64];
  this.crc_extra = 19;
  this._name = "WIFI_CONFIG_AP";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ssid", "password"];
};
mavlink20.messages.wifi_config_ap.prototype = new mavlink20.message();
mavlink20.messages.wifi_config_ap.prototype.pack = function(mav) {
  var orderedfields = [this.ssid, this.password];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ais_vessel = function(...moreargs) {
  [this.MMSI, this.lat, this.lon, this.COG, this.heading, this.velocity, this.turn_rate, this.navigational_status, this.type, this.dimension_bow, this.dimension_stern, this.dimension_port, this.dimension_starboard, this.callsign, this.name, this.tslc, this.flags] = moreargs;
  this._format = "<IiiHHHHHHHbBBBB7s20s";
  this._id = mavlink20.MAVLINK_MSG_ID_AIS_VESSEL;
  this.order_map = [0, 1, 2, 3, 4, 5, 10, 11, 12, 6, 7, 13, 14, 15, 16, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 20];
  this.crc_extra = 243;
  this._name = "AIS_VESSEL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["MMSI", "lat", "lon", "COG", "heading", "velocity", "turn_rate", "navigational_status", "type", "dimension_bow", "dimension_stern", "dimension_port", "dimension_starboard", "callsign", "name", "tslc", "flags"];
};
mavlink20.messages.ais_vessel.prototype = new mavlink20.message();
mavlink20.messages.ais_vessel.prototype.pack = function(mav) {
  var orderedfields = [this.MMSI, this.lat, this.lon, this.COG, this.heading, this.velocity, this.dimension_bow, this.dimension_stern, this.tslc, this.flags, this.turn_rate, this.navigational_status, this.type, this.dimension_port, this.dimension_starboard, this.callsign, this.name];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavcan_node_status = function(...moreargs) {
  [this.time_usec, this.uptime_sec, this.health, this.mode, this.sub_mode, this.vendor_specific_status_code] = moreargs;
  this._format = "<QIHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVCAN_NODE_STATUS;
  this.order_map = [0, 1, 3, 4, 5, 2];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 28;
  this._name = "UAVCAN_NODE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "uptime_sec", "health", "mode", "sub_mode", "vendor_specific_status_code"];
};
mavlink20.messages.uavcan_node_status.prototype = new mavlink20.message();
mavlink20.messages.uavcan_node_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.uptime_sec, this.vendor_specific_status_code, this.health, this.mode, this.sub_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavcan_node_info = function(...moreargs) {
  [this.time_usec, this.uptime_sec, this.name, this.hw_version_major, this.hw_version_minor, this.hw_unique_id, this.sw_version_major, this.sw_version_minor, this.sw_vcs_commit] = moreargs;
  this._format = "<QII80sBB16sBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVCAN_NODE_INFO;
  this.order_map = [0, 1, 3, 4, 5, 6, 7, 8, 2];
  this.len_map = [1, 1, 1, 1, 1, 1, 16, 1, 1];
  this.array_len_map = [0, 0, 0, 80, 0, 0, 16, 0, 0];
  this.crc_extra = 95;
  this._name = "UAVCAN_NODE_INFO";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "uptime_sec", "name", "hw_version_major", "hw_version_minor", "hw_unique_id", "sw_version_major", "sw_version_minor", "sw_vcs_commit"];
};
mavlink20.messages.uavcan_node_info.prototype = new mavlink20.message();
mavlink20.messages.uavcan_node_info.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.uptime_sec, this.sw_vcs_commit, this.name, this.hw_version_major, this.hw_version_minor, this.hw_unique_id, this.sw_version_major, this.sw_version_minor];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_ext_request_read = function(...moreargs) {
  [this.target_system, this.target_component, this.param_id, this.param_index] = moreargs;
  this._format = "<hBB16s";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_EXT_REQUEST_READ;
  this.order_map = [1, 2, 3, 0];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 16];
  this.crc_extra = 243;
  this._name = "PARAM_EXT_REQUEST_READ";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "param_id", "param_index"];
};
mavlink20.messages.param_ext_request_read.prototype = new mavlink20.message();
mavlink20.messages.param_ext_request_read.prototype.pack = function(mav) {
  var orderedfields = [this.param_index, this.target_system, this.target_component, this.param_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_ext_request_list = function(...moreargs) {
  [this.target_system, this.target_component] = moreargs;
  this._format = "<BB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_EXT_REQUEST_LIST;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 88;
  this._name = "PARAM_EXT_REQUEST_LIST";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component"];
};
mavlink20.messages.param_ext_request_list.prototype = new mavlink20.message();
mavlink20.messages.param_ext_request_list.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_ext_value = function(...moreargs) {
  [this.param_id, this.param_value, this.param_type, this.param_count, this.param_index] = moreargs;
  this._format = "<HH16s128sB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_EXT_VALUE;
  this.order_map = [2, 3, 4, 0, 1];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 16, 128, 0];
  this.crc_extra = 243;
  this._name = "PARAM_EXT_VALUE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["param_id", "param_value", "param_type", "param_count", "param_index"];
};
mavlink20.messages.param_ext_value.prototype = new mavlink20.message();
mavlink20.messages.param_ext_value.prototype.pack = function(mav) {
  var orderedfields = [this.param_count, this.param_index, this.param_id, this.param_value, this.param_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_ext_set = function(...moreargs) {
  [this.target_system, this.target_component, this.param_id, this.param_value, this.param_type] = moreargs;
  this._format = "<BB16s128sB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_EXT_SET;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 16, 128, 0];
  this.crc_extra = 78;
  this._name = "PARAM_EXT_SET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "param_id", "param_value", "param_type"];
};
mavlink20.messages.param_ext_set.prototype = new mavlink20.message();
mavlink20.messages.param_ext_set.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.param_id, this.param_value, this.param_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.param_ext_ack = function(...moreargs) {
  [this.param_id, this.param_value, this.param_type, this.param_result] = moreargs;
  this._format = "<16s128sBB";
  this._id = mavlink20.MAVLINK_MSG_ID_PARAM_EXT_ACK;
  this.order_map = [0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [16, 128, 0, 0];
  this.crc_extra = 132;
  this._name = "PARAM_EXT_ACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["param_id", "param_value", "param_type", "param_result"];
};
mavlink20.messages.param_ext_ack.prototype = new mavlink20.message();
mavlink20.messages.param_ext_ack.prototype.pack = function(mav) {
  var orderedfields = [this.param_id, this.param_value, this.param_type, this.param_result];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.obstacle_distance = function(...moreargs) {
  [this.time_usec, this.sensor_type, this.distances, this.increment, this.min_distance, this.max_distance, this.increment_f, this.angle_offset, this.frame] = moreargs;
  this._format = "<Q72HHHBBffB";
  this._id = mavlink20.MAVLINK_MSG_ID_OBSTACLE_DISTANCE;
  this.order_map = [0, 4, 1, 5, 2, 3, 6, 7, 8];
  this.len_map = [1, 72, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 72, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 23;
  this._name = "OBSTACLE_DISTANCE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "sensor_type", "distances", "increment", "min_distance", "max_distance", "increment_f", "angle_offset", "frame"];
};
mavlink20.messages.obstacle_distance.prototype = new mavlink20.message();
mavlink20.messages.obstacle_distance.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.distances, this.min_distance, this.max_distance, this.sensor_type, this.increment, this.increment_f, this.angle_offset, this.frame];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.odometry = function(...moreargs) {
  [this.time_usec, this.frame_id, this.child_frame_id, this.x, this.y, this.z, this.q, this.vx, this.vy, this.vz, this.rollspeed, this.pitchspeed, this.yawspeed, this.pose_covariance, this.velocity_covariance, this.reset_counter, this.estimator_type, this.quality] = moreargs;
  this._format = "<Qfff4fffffff21f21fBBBBb";
  this._id = mavlink20.MAVLINK_MSG_ID_ODOMETRY;
  this.order_map = [0, 13, 14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17];
  this.len_map = [1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 21, 21, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 21, 21, 0, 0, 0, 0, 0];
  this.crc_extra = 91;
  this._name = "ODOMETRY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "frame_id", "child_frame_id", "x", "y", "z", "q", "vx", "vy", "vz", "rollspeed", "pitchspeed", "yawspeed", "pose_covariance", "velocity_covariance", "reset_counter", "estimator_type", "quality"];
};
mavlink20.messages.odometry.prototype = new mavlink20.message();
mavlink20.messages.odometry.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.x, this.y, this.z, this.q, this.vx, this.vy, this.vz, this.rollspeed, this.pitchspeed, this.yawspeed, this.pose_covariance, this.velocity_covariance, this.frame_id, this.child_frame_id, this.reset_counter, this.estimator_type, this.quality];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.isbd_link_status = function(...moreargs) {
  [this.timestamp, this.last_heartbeat, this.failed_sessions, this.successful_sessions, this.signal_quality, this.ring_pending, this.tx_session_pending, this.rx_session_pending] = moreargs;
  this._format = "<QQHHBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_ISBD_LINK_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 225;
  this._name = "ISBD_LINK_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["timestamp", "last_heartbeat", "failed_sessions", "successful_sessions", "signal_quality", "ring_pending", "tx_session_pending", "rx_session_pending"];
};
mavlink20.messages.isbd_link_status.prototype = new mavlink20.message();
mavlink20.messages.isbd_link_status.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.last_heartbeat, this.failed_sessions, this.successful_sessions, this.signal_quality, this.ring_pending, this.tx_session_pending, this.rx_session_pending];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.raw_rpm = function(...moreargs) {
  [this.index, this.frequency] = moreargs;
  this._format = "<fB";
  this._id = mavlink20.MAVLINK_MSG_ID_RAW_RPM;
  this.order_map = [1, 0];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 199;
  this._name = "RAW_RPM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["index", "frequency"];
};
mavlink20.messages.raw_rpm.prototype = new mavlink20.message();
mavlink20.messages.raw_rpm.prototype.pack = function(mav) {
  var orderedfields = [this.frequency, this.index];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.utm_global_position = function(...moreargs) {
  [this.time, this.uas_id, this.lat, this.lon, this.alt, this.relative_alt, this.vx, this.vy, this.vz, this.h_acc, this.v_acc, this.vel_acc, this.next_lat, this.next_lon, this.next_alt, this.update_rate, this.flight_state, this.flags] = moreargs;
  this._format = "<QiiiiiiihhhHHHH18sBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UTM_GLOBAL_POSITION;
  this.order_map = [0, 15, 1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 5, 6, 7, 14, 16, 17];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0];
  this.crc_extra = 99;
  this._name = "UTM_GLOBAL_POSITION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time", "uas_id", "lat", "lon", "alt", "relative_alt", "vx", "vy", "vz", "h_acc", "v_acc", "vel_acc", "next_lat", "next_lon", "next_alt", "update_rate", "flight_state", "flags"];
};
mavlink20.messages.utm_global_position.prototype = new mavlink20.message();
mavlink20.messages.utm_global_position.prototype.pack = function(mav) {
  var orderedfields = [this.time, this.lat, this.lon, this.alt, this.relative_alt, this.next_lat, this.next_lon, this.next_alt, this.vx, this.vy, this.vz, this.h_acc, this.v_acc, this.vel_acc, this.update_rate, this.uas_id, this.flight_state, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.debug_float_array = function(...moreargs) {
  [this.time_usec, this.name, this.array_id, this.data] = moreargs;
  this._format = "<QH10s58f";
  this._id = mavlink20.MAVLINK_MSG_ID_DEBUG_FLOAT_ARRAY;
  this.order_map = [0, 2, 1, 3];
  this.len_map = [1, 1, 1, 58];
  this.array_len_map = [0, 0, 10, 58];
  this.crc_extra = 232;
  this._name = "DEBUG_FLOAT_ARRAY";
  this._instance_field = "array_id";
  this._instance_offset = 8;
  this.fieldnames = ["time_usec", "name", "array_id", "data"];
};
mavlink20.messages.debug_float_array.prototype = new mavlink20.message();
mavlink20.messages.debug_float_array.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.array_id, this.name, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.smart_battery_info = function(...moreargs) {
  [this.id, this.battery_function, this.type, this.capacity_full_specification, this.capacity_full, this.cycle_count, this.serial_number, this.device_name, this.weight, this.discharge_minimum_voltage, this.charging_minimum_voltage, this.resting_minimum_voltage, this.charging_maximum_voltage, this.cells_in_series, this.discharge_maximum_current, this.discharge_maximum_burst_current, this.manufacture_date] = moreargs;
  this._format = "<iiHHHHHBBB16s50sHBII11s";
  this._id = mavlink20.MAVLINK_MSG_ID_SMART_BATTERY_INFO;
  this.order_map = [7, 8, 9, 0, 1, 2, 10, 11, 3, 4, 5, 6, 12, 13, 14, 15, 16];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 50, 0, 0, 0, 0, 11];
  this.crc_extra = 75;
  this._name = "SMART_BATTERY_INFO";
  this._instance_field = "id";
  this._instance_offset = 18;
  this.fieldnames = ["id", "battery_function", "type", "capacity_full_specification", "capacity_full", "cycle_count", "serial_number", "device_name", "weight", "discharge_minimum_voltage", "charging_minimum_voltage", "resting_minimum_voltage", "charging_maximum_voltage", "cells_in_series", "discharge_maximum_current", "discharge_maximum_burst_current", "manufacture_date"];
};
mavlink20.messages.smart_battery_info.prototype = new mavlink20.message();
mavlink20.messages.smart_battery_info.prototype.pack = function(mav) {
  var orderedfields = [this.capacity_full_specification, this.capacity_full, this.cycle_count, this.weight, this.discharge_minimum_voltage, this.charging_minimum_voltage, this.resting_minimum_voltage, this.id, this.battery_function, this.type, this.serial_number, this.device_name, this.charging_maximum_voltage, this.cells_in_series, this.discharge_maximum_current, this.discharge_maximum_burst_current, this.manufacture_date];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.generator_status = function(...moreargs) {
  [this.status, this.generator_speed, this.battery_current, this.load_current, this.power_generated, this.bus_voltage, this.rectifier_temperature, this.bat_current_setpoint, this.generator_temperature, this.runtime, this.time_until_maintenance] = moreargs;
  this._format = "<QfffffIiHhh";
  this._id = mavlink20.MAVLINK_MSG_ID_GENERATOR_STATUS;
  this.order_map = [0, 8, 1, 2, 3, 4, 9, 5, 10, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 117;
  this._name = "GENERATOR_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["status", "generator_speed", "battery_current", "load_current", "power_generated", "bus_voltage", "rectifier_temperature", "bat_current_setpoint", "generator_temperature", "runtime", "time_until_maintenance"];
};
mavlink20.messages.generator_status.prototype = new mavlink20.message();
mavlink20.messages.generator_status.prototype.pack = function(mav) {
  var orderedfields = [this.status, this.battery_current, this.load_current, this.power_generated, this.bus_voltage, this.bat_current_setpoint, this.runtime, this.time_until_maintenance, this.generator_speed, this.rectifier_temperature, this.generator_temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.actuator_output_status = function(...moreargs) {
  [this.time_usec, this.active, this.actuator] = moreargs;
  this._format = "<QI32f";
  this._id = mavlink20.MAVLINK_MSG_ID_ACTUATOR_OUTPUT_STATUS;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 32];
  this.array_len_map = [0, 0, 32];
  this.crc_extra = 251;
  this._name = "ACTUATOR_OUTPUT_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "active", "actuator"];
};
mavlink20.messages.actuator_output_status.prototype = new mavlink20.message();
mavlink20.messages.actuator_output_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.active, this.actuator];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.relay_status = function(...moreargs) {
  [this.time_boot_ms, this.on, this.present] = moreargs;
  this._format = "<IHH";
  this._id = mavlink20.MAVLINK_MSG_ID_RELAY_STATUS;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 199;
  this._name = "RELAY_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "on", "present"];
};
mavlink20.messages.relay_status.prototype = new mavlink20.message();
mavlink20.messages.relay_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.on, this.present];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.tunnel = function(...moreargs) {
  [this.target_system, this.target_component, this.payload_type, this.payload_length, this.payload] = moreargs;
  this._format = "<HBBB128s";
  this._id = mavlink20.MAVLINK_MSG_ID_TUNNEL;
  this.order_map = [1, 2, 0, 3, 4];
  this.len_map = [1, 1, 1, 1, 128];
  this.array_len_map = [0, 0, 0, 0, 128];
  this.crc_extra = 147;
  this._name = "TUNNEL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "payload_type", "payload_length", "payload"];
};
mavlink20.messages.tunnel.prototype = new mavlink20.message();
mavlink20.messages.tunnel.prototype.pack = function(mav) {
  var orderedfields = [this.payload_type, this.target_system, this.target_component, this.payload_length, this.payload];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.can_frame = function(...moreargs) {
  [this.target_system, this.target_component, this.bus, this.len, this.id, this.data] = moreargs;
  this._format = "<IBBBB8s";
  this._id = mavlink20.MAVLINK_MSG_ID_CAN_FRAME;
  this.order_map = [1, 2, 3, 4, 0, 5];
  this.len_map = [1, 1, 1, 1, 1, 8];
  this.array_len_map = [0, 0, 0, 0, 0, 8];
  this.crc_extra = 132;
  this._name = "CAN_FRAME";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "bus", "len", "id", "data"];
};
mavlink20.messages.can_frame.prototype = new mavlink20.message();
mavlink20.messages.can_frame.prototype.pack = function(mav) {
  var orderedfields = [this.id, this.target_system, this.target_component, this.bus, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.canfd_frame = function(...moreargs) {
  [this.target_system, this.target_component, this.bus, this.len, this.id, this.data] = moreargs;
  this._format = "<IBBBB64s";
  this._id = mavlink20.MAVLINK_MSG_ID_CANFD_FRAME;
  this.order_map = [1, 2, 3, 4, 0, 5];
  this.len_map = [1, 1, 1, 1, 1, 64];
  this.array_len_map = [0, 0, 0, 0, 0, 64];
  this.crc_extra = 4;
  this._name = "CANFD_FRAME";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "bus", "len", "id", "data"];
};
mavlink20.messages.canfd_frame.prototype = new mavlink20.message();
mavlink20.messages.canfd_frame.prototype.pack = function(mav) {
  var orderedfields = [this.id, this.target_system, this.target_component, this.bus, this.len, this.data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.can_filter_modify = function(...moreargs) {
  [this.target_system, this.target_component, this.bus, this.operation, this.num_ids, this.ids] = moreargs;
  this._format = "<16HBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CAN_FILTER_MODIFY;
  this.order_map = [1, 2, 3, 4, 5, 0];
  this.len_map = [16, 1, 1, 1, 1, 1];
  this.array_len_map = [16, 0, 0, 0, 0, 0];
  this.crc_extra = 8;
  this._name = "CAN_FILTER_MODIFY";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "bus", "operation", "num_ids", "ids"];
};
mavlink20.messages.can_filter_modify.prototype = new mavlink20.message();
mavlink20.messages.can_filter_modify.prototype.pack = function(mav) {
  var orderedfields = [this.ids, this.target_system, this.target_component, this.bus, this.operation, this.num_ids];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.wheel_distance = function(...moreargs) {
  [this.time_usec, this.count, this.distance] = moreargs;
  this._format = "<Q16dB";
  this._id = mavlink20.MAVLINK_MSG_ID_WHEEL_DISTANCE;
  this.order_map = [0, 2, 1];
  this.len_map = [1, 16, 1];
  this.array_len_map = [0, 16, 0];
  this.crc_extra = 113;
  this._name = "WHEEL_DISTANCE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "count", "distance"];
};
mavlink20.messages.wheel_distance.prototype = new mavlink20.message();
mavlink20.messages.wheel_distance.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.distance, this.count];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.winch_status = function(...moreargs) {
  [this.time_usec, this.line_length, this.speed, this.tension, this.voltage, this.current, this.temperature, this.status] = moreargs;
  this._format = "<QfffffIh";
  this._id = mavlink20.MAVLINK_MSG_ID_WINCH_STATUS;
  this.order_map = [0, 1, 2, 3, 4, 5, 7, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 117;
  this._name = "WINCH_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_usec", "line_length", "speed", "tension", "voltage", "current", "temperature", "status"];
};
mavlink20.messages.winch_status.prototype = new mavlink20.message();
mavlink20.messages.winch_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_usec, this.line_length, this.speed, this.tension, this.voltage, this.current, this.status, this.temperature];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_basic_id = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.id_type, this.ua_type, this.uas_id] = moreargs;
  this._format = "<BB20sBB20s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_BASIC_ID;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 20, 1, 1, 20];
  this.array_len_map = [0, 0, 20, 0, 0, 20];
  this.crc_extra = 114;
  this._name = "OPEN_DRONE_ID_BASIC_ID";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "id_type", "ua_type", "uas_id"];
};
mavlink20.messages.open_drone_id_basic_id.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_basic_id.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.id_or_mac, this.id_type, this.ua_type, this.uas_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_location = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.status, this.direction, this.speed_horizontal, this.speed_vertical, this.latitude, this.longitude, this.altitude_barometric, this.altitude_geodetic, this.height_reference, this.height, this.horizontal_accuracy, this.vertical_accuracy, this.barometer_accuracy, this.speed_accuracy, this.timestamp, this.timestamp_accuracy] = moreargs;
  this._format = "<iiffffHHhBB20sBBBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_LOCATION;
  this.order_map = [9, 10, 11, 12, 6, 7, 8, 0, 1, 2, 3, 13, 4, 14, 15, 16, 17, 5, 18];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 254;
  this._name = "OPEN_DRONE_ID_LOCATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "status", "direction", "speed_horizontal", "speed_vertical", "latitude", "longitude", "altitude_barometric", "altitude_geodetic", "height_reference", "height", "horizontal_accuracy", "vertical_accuracy", "barometer_accuracy", "speed_accuracy", "timestamp", "timestamp_accuracy"];
};
mavlink20.messages.open_drone_id_location.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_location.prototype.pack = function(mav) {
  var orderedfields = [this.latitude, this.longitude, this.altitude_barometric, this.altitude_geodetic, this.height, this.timestamp, this.direction, this.speed_horizontal, this.speed_vertical, this.target_system, this.target_component, this.id_or_mac, this.status, this.height_reference, this.horizontal_accuracy, this.vertical_accuracy, this.barometer_accuracy, this.speed_accuracy, this.timestamp_accuracy];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_authentication = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.authentication_type, this.data_page, this.last_page_index, this.length, this.timestamp, this.authentication_data] = moreargs;
  this._format = "<IBB20sBBBB23s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_AUTHENTICATION;
  this.order_map = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  this.len_map = [1, 1, 1, 20, 1, 1, 1, 1, 23];
  this.array_len_map = [0, 0, 0, 20, 0, 0, 0, 0, 23];
  this.crc_extra = 140;
  this._name = "OPEN_DRONE_ID_AUTHENTICATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "authentication_type", "data_page", "last_page_index", "length", "timestamp", "authentication_data"];
};
mavlink20.messages.open_drone_id_authentication.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_authentication.prototype.pack = function(mav) {
  var orderedfields = [this.timestamp, this.target_system, this.target_component, this.id_or_mac, this.authentication_type, this.data_page, this.last_page_index, this.length, this.authentication_data];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_self_id = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.description_type, this.description] = moreargs;
  this._format = "<BB20sB23s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SELF_ID;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 20, 1, 1];
  this.array_len_map = [0, 0, 20, 0, 23];
  this.crc_extra = 249;
  this._name = "OPEN_DRONE_ID_SELF_ID";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "description_type", "description"];
};
mavlink20.messages.open_drone_id_self_id.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_self_id.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.id_or_mac, this.description_type, this.description];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_system = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.operator_location_type, this.classification_type, this.operator_latitude, this.operator_longitude, this.area_count, this.area_radius, this.area_ceiling, this.area_floor, this.category_eu, this.class_eu, this.operator_altitude_geo, this.timestamp] = moreargs;
  this._format = "<iifffIHHBB20sBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SYSTEM;
  this.order_map = [8, 9, 10, 11, 12, 0, 1, 6, 7, 2, 3, 13, 14, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0];
  this.crc_extra = 77;
  this._name = "OPEN_DRONE_ID_SYSTEM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "operator_location_type", "classification_type", "operator_latitude", "operator_longitude", "area_count", "area_radius", "area_ceiling", "area_floor", "category_eu", "class_eu", "operator_altitude_geo", "timestamp"];
};
mavlink20.messages.open_drone_id_system.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_system.prototype.pack = function(mav) {
  var orderedfields = [this.operator_latitude, this.operator_longitude, this.area_ceiling, this.area_floor, this.operator_altitude_geo, this.timestamp, this.area_count, this.area_radius, this.target_system, this.target_component, this.id_or_mac, this.operator_location_type, this.classification_type, this.category_eu, this.class_eu];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_operator_id = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.operator_id_type, this.operator_id] = moreargs;
  this._format = "<BB20sB20s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_OPERATOR_ID;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 20, 1, 1];
  this.array_len_map = [0, 0, 20, 0, 20];
  this.crc_extra = 49;
  this._name = "OPEN_DRONE_ID_OPERATOR_ID";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "operator_id_type", "operator_id"];
};
mavlink20.messages.open_drone_id_operator_id.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_operator_id.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.id_or_mac, this.operator_id_type, this.operator_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_arm_status = function(...moreargs) {
  [this.status, this.error] = moreargs;
  this._format = "<B50s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_ARM_STATUS;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 50];
  this.crc_extra = 139;
  this._name = "OPEN_DRONE_ID_ARM_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["status", "error"];
};
mavlink20.messages.open_drone_id_arm_status.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_arm_status.prototype.pack = function(mav) {
  var orderedfields = [this.status, this.error];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_message_pack = function(...moreargs) {
  [this.target_system, this.target_component, this.id_or_mac, this.single_message_size, this.msg_pack_size, this.messages] = moreargs;
  this._format = "<BB20sBB225s";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_MESSAGE_PACK;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 20, 1, 1, 225];
  this.array_len_map = [0, 0, 20, 0, 0, 225];
  this.crc_extra = 94;
  this._name = "OPEN_DRONE_ID_MESSAGE_PACK";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "id_or_mac", "single_message_size", "msg_pack_size", "messages"];
};
mavlink20.messages.open_drone_id_message_pack.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_message_pack.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.id_or_mac, this.single_message_size, this.msg_pack_size, this.messages];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.open_drone_id_system_update = function(...moreargs) {
  [this.target_system, this.target_component, this.operator_latitude, this.operator_longitude, this.operator_altitude_geo, this.timestamp] = moreargs;
  this._format = "<iifIBB";
  this._id = mavlink20.MAVLINK_MSG_ID_OPEN_DRONE_ID_SYSTEM_UPDATE;
  this.order_map = [4, 5, 0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 7;
  this._name = "OPEN_DRONE_ID_SYSTEM_UPDATE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "operator_latitude", "operator_longitude", "operator_altitude_geo", "timestamp"];
};
mavlink20.messages.open_drone_id_system_update.prototype = new mavlink20.message();
mavlink20.messages.open_drone_id_system_update.prototype.pack = function(mav) {
  var orderedfields = [this.operator_latitude, this.operator_longitude, this.operator_altitude_geo, this.timestamp, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.hygrometer_sensor = function(...moreargs) {
  [this.id, this.temperature, this.humidity] = moreargs;
  this._format = "<hHB";
  this._id = mavlink20.MAVLINK_MSG_ID_HYGROMETER_SENSOR;
  this.order_map = [2, 0, 1];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 20;
  this._name = "HYGROMETER_SENSOR";
  this._instance_field = "id";
  this._instance_offset = 4;
  this.fieldnames = ["id", "temperature", "humidity"];
};
mavlink20.messages.hygrometer_sensor.prototype = new mavlink20.message();
mavlink20.messages.hygrometer_sensor.prototype.pack = function(mav) {
  var orderedfields = [this.temperature, this.humidity, this.id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.mission_checksum = function(...moreargs) {
  [this.mission_type, this.checksum] = moreargs;
  this._format = "<IB";
  this._id = mavlink20.MAVLINK_MSG_ID_MISSION_CHECKSUM;
  this.order_map = [1, 0];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 3;
  this._name = "MISSION_CHECKSUM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["mission_type", "checksum"];
};
mavlink20.messages.mission_checksum.prototype = new mavlink20.message();
mavlink20.messages.mission_checksum.prototype.pack = function(mav) {
  var orderedfields = [this.checksum, this.mission_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.airspeed = function(...moreargs) {
  [this.id, this.airspeed, this.temperature, this.raw_press, this.flags] = moreargs;
  this._format = "<ffhBB";
  this._id = mavlink20.MAVLINK_MSG_ID_AIRSPEED;
  this.order_map = [3, 0, 2, 1, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 234;
  this._name = "AIRSPEED";
  this._instance_field = "id";
  this._instance_offset = 10;
  this.fieldnames = ["id", "airspeed", "temperature", "raw_press", "flags"];
};
mavlink20.messages.airspeed.prototype = new mavlink20.message();
mavlink20.messages.airspeed.prototype.pack = function(mav) {
  var orderedfields = [this.airspeed, this.raw_press, this.temperature, this.id, this.flags];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.radio_rc_channels = function(...moreargs) {
  [this.target_system, this.target_component, this.time_last_update_ms, this.flags, this.count, this.channels] = moreargs;
  this._format = "<IHBBB32h";
  this._id = mavlink20.MAVLINK_MSG_ID_RADIO_RC_CHANNELS;
  this.order_map = [2, 3, 0, 1, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 32];
  this.array_len_map = [0, 0, 0, 0, 0, 32];
  this.crc_extra = 20;
  this._name = "RADIO_RC_CHANNELS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "time_last_update_ms", "flags", "count", "channels"];
};
mavlink20.messages.radio_rc_channels.prototype = new mavlink20.message();
mavlink20.messages.radio_rc_channels.prototype.pack = function(mav) {
  var orderedfields = [this.time_last_update_ms, this.flags, this.target_system, this.target_component, this.count, this.channels];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.icarous_heartbeat = function(...moreargs) {
  [this.status] = moreargs;
  this._format = "<B";
  this._id = mavlink20.MAVLINK_MSG_ID_ICAROUS_HEARTBEAT;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [0];
  this.crc_extra = 227;
  this._name = "ICAROUS_HEARTBEAT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["status"];
};
mavlink20.messages.icarous_heartbeat.prototype = new mavlink20.message();
mavlink20.messages.icarous_heartbeat.prototype.pack = function(mav) {
  var orderedfields = [this.status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.icarous_kinematic_bands = function(...moreargs) {
  [this.numBands, this.type1, this.min1, this.max1, this.type2, this.min2, this.max2, this.type3, this.min3, this.max3, this.type4, this.min4, this.max4, this.type5, this.min5, this.max5] = moreargs;
  this._format = "<ffffffffffbBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_ICAROUS_KINEMATIC_BANDS;
  this.order_map = [10, 11, 0, 1, 12, 2, 3, 13, 4, 5, 14, 6, 7, 15, 8, 9];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 239;
  this._name = "ICAROUS_KINEMATIC_BANDS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["numBands", "type1", "min1", "max1", "type2", "min2", "max2", "type3", "min3", "max3", "type4", "min4", "max4", "type5", "min5", "max5"];
};
mavlink20.messages.icarous_kinematic_bands.prototype = new mavlink20.message();
mavlink20.messages.icarous_kinematic_bands.prototype.pack = function(mav) {
  var orderedfields = [this.min1, this.max1, this.min2, this.max2, this.min3, this.max3, this.min4, this.max4, this.min5, this.max5, this.numBands, this.type1, this.type2, this.type3, this.type4, this.type5];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.heartbeat = function(...moreargs) {
  [this.type, this.autopilot, this.base_mode, this.custom_mode, this.system_status, this.mavlink_version] = moreargs;
  this._format = "<IBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_HEARTBEAT;
  this.order_map = [1, 2, 3, 0, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 50;
  this._name = "HEARTBEAT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["type", "autopilot", "base_mode", "custom_mode", "system_status", "mavlink_version"];
};
mavlink20.messages.heartbeat.prototype = new mavlink20.message();
mavlink20.messages.heartbeat.prototype.pack = function(mav) {
  var orderedfields = [this.custom_mode, this.type, this.autopilot, this.base_mode, this.system_status, this.mavlink_version];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_0 = function(...moreargs) {
  [this.v1, this.ar_i8, this.ar_u8, this.ar_u16, this.ar_u32] = moreargs;
  this._format = "<4I4HB4s4s";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_0;
  this.order_map = [2, 3, 4, 1, 0];
  this.len_map = [4, 4, 1, 4, 4];
  this.array_len_map = [4, 4, 0, 4, 4];
  this.crc_extra = 26;
  this._name = "ARRAY_TEST_0";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["v1", "ar_i8", "ar_u8", "ar_u16", "ar_u32"];
};
mavlink20.messages.array_test_0.prototype = new mavlink20.message();
mavlink20.messages.array_test_0.prototype.pack = function(mav) {
  var orderedfields = [this.ar_u32, this.ar_u16, this.v1, this.ar_i8, this.ar_u8];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_1 = function(...moreargs) {
  [this.ar_u32] = moreargs;
  this._format = "<4I";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_1;
  this.order_map = [0];
  this.len_map = [4];
  this.array_len_map = [4];
  this.crc_extra = 72;
  this._name = "ARRAY_TEST_1";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ar_u32"];
};
mavlink20.messages.array_test_1.prototype = new mavlink20.message();
mavlink20.messages.array_test_1.prototype.pack = function(mav) {
  var orderedfields = [this.ar_u32];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_3 = function(...moreargs) {
  [this.v, this.ar_u32] = moreargs;
  this._format = "<4IB";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_3;
  this.order_map = [1, 0];
  this.len_map = [4, 1];
  this.array_len_map = [4, 0];
  this.crc_extra = 19;
  this._name = "ARRAY_TEST_3";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["v", "ar_u32"];
};
mavlink20.messages.array_test_3.prototype = new mavlink20.message();
mavlink20.messages.array_test_3.prototype.pack = function(mav) {
  var orderedfields = [this.ar_u32, this.v];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_4 = function(...moreargs) {
  [this.ar_u32, this.v] = moreargs;
  this._format = "<4IB";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_4;
  this.order_map = [0, 1];
  this.len_map = [4, 1];
  this.array_len_map = [4, 0];
  this.crc_extra = 89;
  this._name = "ARRAY_TEST_4";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ar_u32", "v"];
};
mavlink20.messages.array_test_4.prototype = new mavlink20.message();
mavlink20.messages.array_test_4.prototype.pack = function(mav) {
  var orderedfields = [this.ar_u32, this.v];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_5 = function(...moreargs) {
  [this.c1, this.c2] = moreargs;
  this._format = "<5s5s";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_5;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [5, 5];
  this.crc_extra = 27;
  this._name = "ARRAY_TEST_5";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["c1", "c2"];
};
mavlink20.messages.array_test_5.prototype = new mavlink20.message();
mavlink20.messages.array_test_5.prototype.pack = function(mav) {
  var orderedfields = [this.c1, this.c2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_6 = function(...moreargs) {
  [this.v1, this.v2, this.v3, this.ar_u32, this.ar_i32, this.ar_u16, this.ar_i16, this.ar_u8, this.ar_i8, this.ar_c, this.ar_d, this.ar_f] = moreargs;
  this._format = "<2dI2I2i2fH2H2hB2s2s32s";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_6;
  this.order_map = [8, 5, 1, 2, 3, 6, 7, 9, 10, 11, 0, 4];
  this.len_map = [2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1];
  this.array_len_map = [2, 0, 2, 2, 2, 0, 2, 2, 0, 2, 2, 32];
  this.crc_extra = 14;
  this._name = "ARRAY_TEST_6";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["v1", "v2", "v3", "ar_u32", "ar_i32", "ar_u16", "ar_i16", "ar_u8", "ar_i8", "ar_c", "ar_d", "ar_f"];
};
mavlink20.messages.array_test_6.prototype = new mavlink20.message();
mavlink20.messages.array_test_6.prototype.pack = function(mav) {
  var orderedfields = [this.ar_d, this.v3, this.ar_u32, this.ar_i32, this.ar_f, this.v2, this.ar_u16, this.ar_i16, this.v1, this.ar_u8, this.ar_i8, this.ar_c];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_7 = function(...moreargs) {
  [this.ar_d, this.ar_f, this.ar_u32, this.ar_i32, this.ar_u16, this.ar_i16, this.ar_u8, this.ar_i8, this.ar_c] = moreargs;
  this._format = "<2d2f2I2i2H2h2s2s32s";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_7;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.len_map = [2, 2, 2, 2, 2, 2, 2, 2, 1];
  this.array_len_map = [2, 2, 2, 2, 2, 2, 2, 2, 32];
  this.crc_extra = 187;
  this._name = "ARRAY_TEST_7";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ar_d", "ar_f", "ar_u32", "ar_i32", "ar_u16", "ar_i16", "ar_u8", "ar_i8", "ar_c"];
};
mavlink20.messages.array_test_7.prototype = new mavlink20.message();
mavlink20.messages.array_test_7.prototype.pack = function(mav) {
  var orderedfields = [this.ar_d, this.ar_f, this.ar_u32, this.ar_i32, this.ar_u16, this.ar_i16, this.ar_u8, this.ar_i8, this.ar_c];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.array_test_8 = function(...moreargs) {
  [this.v3, this.ar_d, this.ar_u16] = moreargs;
  this._format = "<2dI2H";
  this._id = mavlink20.MAVLINK_MSG_ID_ARRAY_TEST_8;
  this.order_map = [1, 0, 2];
  this.len_map = [2, 1, 2];
  this.array_len_map = [2, 0, 2];
  this.crc_extra = 106;
  this._name = "ARRAY_TEST_8";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["v3", "ar_d", "ar_u16"];
};
mavlink20.messages.array_test_8.prototype = new mavlink20.message();
mavlink20.messages.array_test_8.prototype.pack = function(mav) {
  var orderedfields = [this.ar_d, this.v3, this.ar_u16];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.test_types = function(...moreargs) {
  [this.c, this.s, this.u8, this.u16, this.u32, this.u64, this.s8, this.s16, this.s32, this.s64, this.f, this.d, this.u8_array, this.u16_array, this.u32_array, this.u64_array, this.s8_array, this.s16_array, this.s32_array, this.s64_array, this.f_array, this.d_array] = moreargs;
  this._format = "<Qqd3Q3q3dIif3I3i3fHh3H3hc10sBb3s3s";
  this._id = mavlink20.MAVLINK_MSG_ID_TEST_TYPES;
  this.order_map = [16, 17, 18, 12, 6, 0, 19, 13, 7, 1, 8, 2, 20, 14, 9, 3, 21, 15, 10, 4, 11, 5];
  this.len_map = [1, 1, 1, 3, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 3, 3];
  this.array_len_map = [0, 0, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 0, 10, 0, 0, 3, 3];
  this.crc_extra = 103;
  this._name = "TEST_TYPES";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["c", "s", "u8", "u16", "u32", "u64", "s8", "s16", "s32", "s64", "f", "d", "u8_array", "u16_array", "u32_array", "u64_array", "s8_array", "s16_array", "s32_array", "s64_array", "f_array", "d_array"];
};
mavlink20.messages.test_types.prototype = new mavlink20.message();
mavlink20.messages.test_types.prototype.pack = function(mav) {
  var orderedfields = [this.u64, this.s64, this.d, this.u64_array, this.s64_array, this.d_array, this.u32, this.s32, this.f, this.u32_array, this.s32_array, this.f_array, this.u16, this.s16, this.u16_array, this.s16_array, this.c, this.s, this.u8, this.s8, this.u8_array, this.s8_array];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.nav_filter_bias = function(...moreargs) {
  [this.usec, this.accel_0, this.accel_1, this.accel_2, this.gyro_0, this.gyro_1, this.gyro_2] = moreargs;
  this._format = "<Qffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_NAV_FILTER_BIAS;
  this.order_map = [0, 1, 2, 3, 4, 5, 6];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 34;
  this._name = "NAV_FILTER_BIAS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["usec", "accel_0", "accel_1", "accel_2", "gyro_0", "gyro_1", "gyro_2"];
};
mavlink20.messages.nav_filter_bias.prototype = new mavlink20.message();
mavlink20.messages.nav_filter_bias.prototype.pack = function(mav) {
  var orderedfields = [this.usec, this.accel_0, this.accel_1, this.accel_2, this.gyro_0, this.gyro_1, this.gyro_2];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.radio_calibration = function(...moreargs) {
  [this.aileron, this.elevator, this.rudder, this.gyro, this.pitch, this.throttle] = moreargs;
  this._format = "<3H3H3H2H5H5H";
  this._id = mavlink20.MAVLINK_MSG_ID_RADIO_CALIBRATION;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [3, 3, 3, 2, 5, 5];
  this.array_len_map = [3, 3, 3, 2, 5, 5];
  this.crc_extra = 71;
  this._name = "RADIO_CALIBRATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["aileron", "elevator", "rudder", "gyro", "pitch", "throttle"];
};
mavlink20.messages.radio_calibration.prototype = new mavlink20.message();
mavlink20.messages.radio_calibration.prototype.pack = function(mav) {
  var orderedfields = [this.aileron, this.elevator, this.rudder, this.gyro, this.pitch, this.throttle];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.ualberta_sys_status = function(...moreargs) {
  [this.mode, this.nav_mode, this.pilot] = moreargs;
  this._format = "<BBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UALBERTA_SYS_STATUS;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 15;
  this._name = "UALBERTA_SYS_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["mode", "nav_mode", "pilot"];
};
mavlink20.messages.ualberta_sys_status.prototype = new mavlink20.message();
mavlink20.messages.ualberta_sys_status.prototype.pack = function(mav) {
  var orderedfields = [this.mode, this.nav_mode, this.pilot];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_cfg = function(...moreargs) {
  [this.ICAO, this.callsign, this.emitterType, this.aircraftSize, this.gpsOffsetLat, this.gpsOffsetLon, this.stallSpeed, this.rfSelect] = moreargs;
  this._format = "<IH9sBBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG;
  this.order_map = [0, 2, 3, 4, 5, 6, 1, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 9, 0, 0, 0, 0, 0];
  this.crc_extra = 209;
  this._name = "UAVIONIX_ADSB_OUT_CFG";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ICAO", "callsign", "emitterType", "aircraftSize", "gpsOffsetLat", "gpsOffsetLon", "stallSpeed", "rfSelect"];
};
mavlink20.messages.uavionix_adsb_out_cfg.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_cfg.prototype.pack = function(mav) {
  var orderedfields = [this.ICAO, this.stallSpeed, this.callsign, this.emitterType, this.aircraftSize, this.gpsOffsetLat, this.gpsOffsetLon, this.rfSelect];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_dynamic = function(...moreargs) {
  [this.utcTime, this.gpsLat, this.gpsLon, this.gpsAlt, this.gpsFix, this.numSats, this.baroAltMSL, this.accuracyHor, this.accuracyVert, this.accuracyVel, this.velVert, this.velNS, this.VelEW, this.emergencyStatus, this.state, this.squawk] = moreargs;
  this._format = "<IiiiiIHHhhhHHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_DYNAMIC;
  this.order_map = [0, 1, 2, 3, 13, 14, 4, 5, 6, 7, 8, 9, 10, 15, 11, 12];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 186;
  this._name = "UAVIONIX_ADSB_OUT_DYNAMIC";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["utcTime", "gpsLat", "gpsLon", "gpsAlt", "gpsFix", "numSats", "baroAltMSL", "accuracyHor", "accuracyVert", "accuracyVel", "velVert", "velNS", "VelEW", "emergencyStatus", "state", "squawk"];
};
mavlink20.messages.uavionix_adsb_out_dynamic.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_dynamic.prototype.pack = function(mav) {
  var orderedfields = [this.utcTime, this.gpsLat, this.gpsLon, this.gpsAlt, this.baroAltMSL, this.accuracyHor, this.accuracyVert, this.accuracyVel, this.velVert, this.velNS, this.VelEW, this.state, this.squawk, this.gpsFix, this.numSats, this.emergencyStatus];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_transceiver_health_report = function(...moreargs) {
  [this.rfHealth] = moreargs;
  this._format = "<B";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_TRANSCEIVER_HEALTH_REPORT;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [0];
  this.crc_extra = 4;
  this._name = "UAVIONIX_ADSB_TRANSCEIVER_HEALTH_REPORT";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rfHealth"];
};
mavlink20.messages.uavionix_adsb_transceiver_health_report.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_transceiver_health_report.prototype.pack = function(mav) {
  var orderedfields = [this.rfHealth];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_cfg_registration = function(...moreargs) {
  [this.registration] = moreargs;
  this._format = "<9s";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG_REGISTRATION;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [9];
  this.crc_extra = 133;
  this._name = "UAVIONIX_ADSB_OUT_CFG_REGISTRATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["registration"];
};
mavlink20.messages.uavionix_adsb_out_cfg_registration.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_cfg_registration.prototype.pack = function(mav) {
  var orderedfields = [this.registration];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_cfg_flightid = function(...moreargs) {
  [this.flight_id] = moreargs;
  this._format = "<9s";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CFG_FLIGHTID;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [9];
  this.crc_extra = 103;
  this._name = "UAVIONIX_ADSB_OUT_CFG_FLIGHTID";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["flight_id"];
};
mavlink20.messages.uavionix_adsb_out_cfg_flightid.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_cfg_flightid.prototype.pack = function(mav) {
  var orderedfields = [this.flight_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_get = function(...moreargs) {
  [this.ReqMessageId] = moreargs;
  this._format = "<I";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_GET;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [0];
  this.crc_extra = 193;
  this._name = "UAVIONIX_ADSB_GET";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["ReqMessageId"];
};
mavlink20.messages.uavionix_adsb_get.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_get.prototype.pack = function(mav) {
  var orderedfields = [this.ReqMessageId];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_control = function(...moreargs) {
  [this.state, this.baroAltMSL, this.squawk, this.emergencyStatus, this.flight_id, this.x_bit] = moreargs;
  this._format = "<iHBB8sB";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_CONTROL;
  this.order_map = [2, 0, 1, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 8, 0];
  this.crc_extra = 71;
  this._name = "UAVIONIX_ADSB_OUT_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["state", "baroAltMSL", "squawk", "emergencyStatus", "flight_id", "x_bit"];
};
mavlink20.messages.uavionix_adsb_out_control.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_control.prototype.pack = function(mav) {
  var orderedfields = [this.baroAltMSL, this.squawk, this.state, this.emergencyStatus, this.flight_id, this.x_bit];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.uavionix_adsb_out_status = function(...moreargs) {
  [this.state, this.squawk, this.NIC_NACp, this.boardTemp, this.fault, this.flight_id] = moreargs;
  this._format = "<HBBBB8s";
  this._id = mavlink20.MAVLINK_MSG_ID_UAVIONIX_ADSB_OUT_STATUS;
  this.order_map = [1, 0, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 8];
  this.crc_extra = 240;
  this._name = "UAVIONIX_ADSB_OUT_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["state", "squawk", "NIC_NACp", "boardTemp", "fault", "flight_id"];
};
mavlink20.messages.uavionix_adsb_out_status.prototype = new mavlink20.message();
mavlink20.messages.uavionix_adsb_out_status.prototype.pack = function(mav) {
  var orderedfields = [this.squawk, this.state, this.NIC_NACp, this.boardTemp, this.fault, this.flight_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.loweheiser_gov_efi = function(...moreargs) {
  [this.volt_batt, this.curr_batt, this.curr_gen, this.curr_rot, this.fuel_level, this.throttle, this.runtime, this.until_maintenance, this.rectifier_temp, this.generator_temp, this.efi_batt, this.efi_rpm, this.efi_pw, this.efi_fuel_flow, this.efi_fuel_consumed, this.efi_baro, this.efi_mat, this.efi_clt, this.efi_tps, this.efi_exhaust_gas_temperature, this.efi_index, this.generator_status, this.efi_status] = moreargs;
  this._format = "<ffffffIiffffffffffffHHB";
  this._id = mavlink20.MAVLINK_MSG_ID_LOWEHEISER_GOV_EFI;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 20, 21];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 195;
  this._name = "LOWEHEISER_GOV_EFI";
  this._instance_field = "efi_index";
  this._instance_offset = 84;
  this.fieldnames = ["volt_batt", "curr_batt", "curr_gen", "curr_rot", "fuel_level", "throttle", "runtime", "until_maintenance", "rectifier_temp", "generator_temp", "efi_batt", "efi_rpm", "efi_pw", "efi_fuel_flow", "efi_fuel_consumed", "efi_baro", "efi_mat", "efi_clt", "efi_tps", "efi_exhaust_gas_temperature", "efi_index", "generator_status", "efi_status"];
};
mavlink20.messages.loweheiser_gov_efi.prototype = new mavlink20.message();
mavlink20.messages.loweheiser_gov_efi.prototype.pack = function(mav) {
  var orderedfields = [this.volt_batt, this.curr_batt, this.curr_gen, this.curr_rot, this.fuel_level, this.throttle, this.runtime, this.until_maintenance, this.rectifier_temp, this.generator_temp, this.efi_batt, this.efi_rpm, this.efi_pw, this.efi_fuel_flow, this.efi_fuel_consumed, this.efi_baro, this.efi_mat, this.efi_clt, this.efi_tps, this.efi_exhaust_gas_temperature, this.generator_status, this.efi_status, this.efi_index];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_device_status = function(...moreargs) {
  [this.target_system, this.target_component, this.time_boot_ms, this.flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.yaw_absolute, this.failure_flags] = moreargs;
  this._format = "<I4fffffHHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_DEVICE_STATUS;
  this.order_map = [8, 9, 0, 6, 1, 2, 3, 4, 5, 7];
  this.len_map = [1, 4, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 4, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 186;
  this._name = "STORM32_GIMBAL_DEVICE_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "time_boot_ms", "flags", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z", "yaw_absolute", "failure_flags"];
};
mavlink20.messages.storm32_gimbal_device_status.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_device_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.yaw_absolute, this.flags, this.failure_flags, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_device_control = function(...moreargs) {
  [this.target_system, this.target_component, this.flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z] = moreargs;
  this._format = "<4ffffHBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_DEVICE_CONTROL;
  this.order_map = [5, 6, 4, 0, 1, 2, 3];
  this.len_map = [4, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [4, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 69;
  this._name = "STORM32_GIMBAL_DEVICE_CONTROL";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "flags", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z"];
};
mavlink20.messages.storm32_gimbal_device_control.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_device_control.prototype.pack = function(mav) {
  var orderedfields = [this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.flags, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_information = function(...moreargs) {
  [this.gimbal_id, this.device_cap_flags, this.manager_cap_flags, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max] = moreargs;
  this._format = "<IIffffffB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_INFORMATION;
  this.order_map = [8, 0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 208;
  this._name = "STORM32_GIMBAL_MANAGER_INFORMATION";
  this._instance_field = "gimbal_id";
  this._instance_offset = 32;
  this.fieldnames = ["gimbal_id", "device_cap_flags", "manager_cap_flags", "roll_min", "roll_max", "pitch_min", "pitch_max", "yaw_min", "yaw_max"];
};
mavlink20.messages.storm32_gimbal_manager_information.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_information.prototype.pack = function(mav) {
  var orderedfields = [this.device_cap_flags, this.manager_cap_flags, this.roll_min, this.roll_max, this.pitch_min, this.pitch_max, this.yaw_min, this.yaw_max, this.gimbal_id];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_status = function(...moreargs) {
  [this.gimbal_id, this.supervisor, this.device_flags, this.manager_flags, this.profile] = moreargs;
  this._format = "<HHBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_STATUS;
  this.order_map = [2, 3, 0, 1, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 183;
  this._name = "STORM32_GIMBAL_MANAGER_STATUS";
  this._instance_field = "gimbal_id";
  this._instance_offset = 4;
  this.fieldnames = ["gimbal_id", "supervisor", "device_flags", "manager_flags", "profile"];
};
mavlink20.messages.storm32_gimbal_manager_status.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_status.prototype.pack = function(mav) {
  var orderedfields = [this.device_flags, this.manager_flags, this.gimbal_id, this.supervisor, this.profile];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_control = function(...moreargs) {
  [this.target_system, this.target_component, this.gimbal_id, this.client, this.device_flags, this.manager_flags, this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z] = moreargs;
  this._format = "<4ffffHHBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CONTROL;
  this.order_map = [6, 7, 8, 9, 4, 5, 0, 1, 2, 3];
  this.len_map = [4, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 99;
  this._name = "STORM32_GIMBAL_MANAGER_CONTROL";
  this._instance_field = "gimbal_id";
  this._instance_offset = 34;
  this.fieldnames = ["target_system", "target_component", "gimbal_id", "client", "device_flags", "manager_flags", "q", "angular_velocity_x", "angular_velocity_y", "angular_velocity_z"];
};
mavlink20.messages.storm32_gimbal_manager_control.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_control.prototype.pack = function(mav) {
  var orderedfields = [this.q, this.angular_velocity_x, this.angular_velocity_y, this.angular_velocity_z, this.device_flags, this.manager_flags, this.target_system, this.target_component, this.gimbal_id, this.client];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_control_pitchyaw = function(...moreargs) {
  [this.target_system, this.target_component, this.gimbal_id, this.client, this.device_flags, this.manager_flags, this.pitch, this.yaw, this.pitch_rate, this.yaw_rate] = moreargs;
  this._format = "<ffffHHBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CONTROL_PITCHYAW;
  this.order_map = [6, 7, 8, 9, 4, 5, 0, 1, 2, 3];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 129;
  this._name = "STORM32_GIMBAL_MANAGER_CONTROL_PITCHYAW";
  this._instance_field = "gimbal_id";
  this._instance_offset = 22;
  this.fieldnames = ["target_system", "target_component", "gimbal_id", "client", "device_flags", "manager_flags", "pitch", "yaw", "pitch_rate", "yaw_rate"];
};
mavlink20.messages.storm32_gimbal_manager_control_pitchyaw.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_control_pitchyaw.prototype.pack = function(mav) {
  var orderedfields = [this.pitch, this.yaw, this.pitch_rate, this.yaw_rate, this.device_flags, this.manager_flags, this.target_system, this.target_component, this.gimbal_id, this.client];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_correct_roll = function(...moreargs) {
  [this.target_system, this.target_component, this.gimbal_id, this.client, this.roll] = moreargs;
  this._format = "<fBBBB";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_CORRECT_ROLL;
  this.order_map = [1, 2, 3, 4, 0];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 134;
  this._name = "STORM32_GIMBAL_MANAGER_CORRECT_ROLL";
  this._instance_field = "gimbal_id";
  this._instance_offset = 6;
  this.fieldnames = ["target_system", "target_component", "gimbal_id", "client", "roll"];
};
mavlink20.messages.storm32_gimbal_manager_correct_roll.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_correct_roll.prototype.pack = function(mav) {
  var orderedfields = [this.roll, this.target_system, this.target_component, this.gimbal_id, this.client];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.storm32_gimbal_manager_profile = function(...moreargs) {
  [this.target_system, this.target_component, this.gimbal_id, this.profile, this.priorities, this.profile_flags, this.rc_timeout, this.timeouts] = moreargs;
  this._format = "<BBBB8sBB8s";
  this._id = mavlink20.MAVLINK_MSG_ID_STORM32_GIMBAL_MANAGER_PROFILE;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7];
  this.len_map = [1, 1, 1, 1, 8, 1, 1, 8];
  this.array_len_map = [0, 0, 0, 0, 8, 0, 0, 8];
  this.crc_extra = 78;
  this._name = "STORM32_GIMBAL_MANAGER_PROFILE";
  this._instance_field = "gimbal_id";
  this._instance_offset = 2;
  this.fieldnames = ["target_system", "target_component", "gimbal_id", "profile", "priorities", "profile_flags", "rc_timeout", "timeouts"];
};
mavlink20.messages.storm32_gimbal_manager_profile.prototype = new mavlink20.message();
mavlink20.messages.storm32_gimbal_manager_profile.prototype.pack = function(mav) {
  var orderedfields = [this.target_system, this.target_component, this.gimbal_id, this.profile, this.priorities, this.profile_flags, this.rc_timeout, this.timeouts];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.qshot_status = function(...moreargs) {
  [this.mode, this.shot_state] = moreargs;
  this._format = "<HH";
  this._id = mavlink20.MAVLINK_MSG_ID_QSHOT_STATUS;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [0, 0];
  this.crc_extra = 202;
  this._name = "QSHOT_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["mode", "shot_state"];
};
mavlink20.messages.qshot_status.prototype = new mavlink20.message();
mavlink20.messages.qshot_status.prototype.pack = function(mav) {
  var orderedfields = [this.mode, this.shot_state];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.component_prearm_status = function(...moreargs) {
  [this.target_system, this.target_component, this.enabled_flags, this.fail_flags] = moreargs;
  this._format = "<IIBB";
  this._id = mavlink20.MAVLINK_MSG_ID_COMPONENT_PREARM_STATUS;
  this.order_map = [2, 3, 0, 1];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 20;
  this._name = "COMPONENT_PREARM_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "enabled_flags", "fail_flags"];
};
mavlink20.messages.component_prearm_status.prototype = new mavlink20.message();
mavlink20.messages.component_prearm_status.prototype.pack = function(mav) {
  var orderedfields = [this.enabled_flags, this.fail_flags, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.avss_prs_sys_status = function(...moreargs) {
  [this.time_boot_ms, this.error_status, this.battery_status, this.arm_status, this.charge_status] = moreargs;
  this._format = "<IIIBB";
  this._id = mavlink20.MAVLINK_MSG_ID_AVSS_PRS_SYS_STATUS;
  this.order_map = [0, 1, 2, 3, 4];
  this.len_map = [1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0];
  this.crc_extra = 220;
  this._name = "AVSS_PRS_SYS_STATUS";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "error_status", "battery_status", "arm_status", "charge_status"];
};
mavlink20.messages.avss_prs_sys_status.prototype = new mavlink20.message();
mavlink20.messages.avss_prs_sys_status.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.error_status, this.battery_status, this.arm_status, this.charge_status];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.avss_drone_position = function(...moreargs) {
  [this.time_boot_ms, this.lat, this.lon, this.alt, this.ground_alt, this.barometer_alt] = moreargs;
  this._format = "<Iiiiff";
  this._id = mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_POSITION;
  this.order_map = [0, 1, 2, 3, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0];
  this.crc_extra = 245;
  this._name = "AVSS_DRONE_POSITION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "lat", "lon", "alt", "ground_alt", "barometer_alt"];
};
mavlink20.messages.avss_drone_position.prototype = new mavlink20.message();
mavlink20.messages.avss_drone_position.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.lat, this.lon, this.alt, this.ground_alt, this.barometer_alt];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.avss_drone_imu = function(...moreargs) {
  [this.time_boot_ms, this.q1, this.q2, this.q3, this.q4, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro] = moreargs;
  this._format = "<Iffffffffff";
  this._id = mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_IMU;
  this.order_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 101;
  this._name = "AVSS_DRONE_IMU";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "q1", "q2", "q3", "q4", "xacc", "yacc", "zacc", "xgyro", "ygyro", "zgyro"];
};
mavlink20.messages.avss_drone_imu.prototype = new mavlink20.message();
mavlink20.messages.avss_drone_imu.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.q1, this.q2, this.q3, this.q4, this.xacc, this.yacc, this.zacc, this.xgyro, this.ygyro, this.zgyro];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.avss_drone_operation_mode = function(...moreargs) {
  [this.time_boot_ms, this.M300_operation_mode, this.horsefly_operation_mode] = moreargs;
  this._format = "<IBB";
  this._id = mavlink20.MAVLINK_MSG_ID_AVSS_DRONE_OPERATION_MODE;
  this.order_map = [0, 1, 2];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 45;
  this._name = "AVSS_DRONE_OPERATION_MODE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["time_boot_ms", "M300_operation_mode", "horsefly_operation_mode"];
};
mavlink20.messages.avss_drone_operation_mode.prototype = new mavlink20.message();
mavlink20.messages.avss_drone_operation_mode.prototype.pack = function(mav) {
  var orderedfields = [this.time_boot_ms, this.M300_operation_mode, this.horsefly_operation_mode];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.cubepilot_raw_rc = function(...moreargs) {
  [this.rc_raw] = moreargs;
  this._format = "<32s";
  this._id = mavlink20.MAVLINK_MSG_ID_CUBEPILOT_RAW_RC;
  this.order_map = [0];
  this.len_map = [32];
  this.array_len_map = [32];
  this.crc_extra = 246;
  this._name = "CUBEPILOT_RAW_RC";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rc_raw"];
};
mavlink20.messages.cubepilot_raw_rc.prototype = new mavlink20.message();
mavlink20.messages.cubepilot_raw_rc.prototype.pack = function(mav) {
  var orderedfields = [this.rc_raw];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.herelink_video_stream_information = function(...moreargs) {
  [this.camera_id, this.status, this.framerate, this.resolution_h, this.resolution_v, this.bitrate, this.rotation, this.uri] = moreargs;
  this._format = "<fIHHHBB230s";
  this._id = mavlink20.MAVLINK_MSG_ID_HERELINK_VIDEO_STREAM_INFORMATION;
  this.order_map = [5, 6, 0, 2, 3, 1, 4, 7];
  this.len_map = [1, 1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0, 230];
  this.crc_extra = 181;
  this._name = "HERELINK_VIDEO_STREAM_INFORMATION";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["camera_id", "status", "framerate", "resolution_h", "resolution_v", "bitrate", "rotation", "uri"];
};
mavlink20.messages.herelink_video_stream_information.prototype = new mavlink20.message();
mavlink20.messages.herelink_video_stream_information.prototype.pack = function(mav) {
  var orderedfields = [this.framerate, this.bitrate, this.resolution_h, this.resolution_v, this.rotation, this.camera_id, this.status, this.uri];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.herelink_telem = function(...moreargs) {
  [this.rssi, this.snr, this.rf_freq, this.link_bw, this.link_rate, this.cpu_temp, this.board_temp] = moreargs;
  this._format = "<IIIhhhB";
  this._id = mavlink20.MAVLINK_MSG_ID_HERELINK_TELEM;
  this.order_map = [6, 3, 0, 1, 2, 4, 5];
  this.len_map = [1, 1, 1, 1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0, 0, 0, 0];
  this.crc_extra = 62;
  this._name = "HERELINK_TELEM";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["rssi", "snr", "rf_freq", "link_bw", "link_rate", "cpu_temp", "board_temp"];
};
mavlink20.messages.herelink_telem.prototype = new mavlink20.message();
mavlink20.messages.herelink_telem.prototype.pack = function(mav) {
  var orderedfields = [this.rf_freq, this.link_bw, this.link_rate, this.snr, this.cpu_temp, this.board_temp, this.rssi];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.cubepilot_firmware_update_start = function(...moreargs) {
  [this.target_system, this.target_component, this.size, this.crc] = moreargs;
  this._format = "<IIBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CUBEPILOT_FIRMWARE_UPDATE_START;
  this.order_map = [2, 3, 0, 1];
  this.len_map = [1, 1, 1, 1];
  this.array_len_map = [0, 0, 0, 0];
  this.crc_extra = 240;
  this._name = "CUBEPILOT_FIRMWARE_UPDATE_START";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "size", "crc"];
};
mavlink20.messages.cubepilot_firmware_update_start.prototype = new mavlink20.message();
mavlink20.messages.cubepilot_firmware_update_start.prototype.pack = function(mav) {
  var orderedfields = [this.size, this.crc, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.cubepilot_firmware_update_resp = function(...moreargs) {
  [this.target_system, this.target_component, this.offset] = moreargs;
  this._format = "<IBB";
  this._id = mavlink20.MAVLINK_MSG_ID_CUBEPILOT_FIRMWARE_UPDATE_RESP;
  this.order_map = [1, 2, 0];
  this.len_map = [1, 1, 1];
  this.array_len_map = [0, 0, 0];
  this.crc_extra = 152;
  this._name = "CUBEPILOT_FIRMWARE_UPDATE_RESP";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["target_system", "target_component", "offset"];
};
mavlink20.messages.cubepilot_firmware_update_resp.prototype = new mavlink20.message();
mavlink20.messages.cubepilot_firmware_update_resp.prototype.pack = function(mav) {
  var orderedfields = [this.offset, this.target_system, this.target_component];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.airlink_auth = function(...moreargs) {
  [this.login, this.password] = moreargs;
  this._format = "<50s50s";
  this._id = mavlink20.MAVLINK_MSG_ID_AIRLINK_AUTH;
  this.order_map = [0, 1];
  this.len_map = [1, 1];
  this.array_len_map = [50, 50];
  this.crc_extra = 13;
  this._name = "AIRLINK_AUTH";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["login", "password"];
};
mavlink20.messages.airlink_auth.prototype = new mavlink20.message();
mavlink20.messages.airlink_auth.prototype.pack = function(mav) {
  var orderedfields = [this.login, this.password];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.messages.airlink_auth_response = function(...moreargs) {
  [this.resp_type] = moreargs;
  this._format = "<B";
  this._id = mavlink20.MAVLINK_MSG_ID_AIRLINK_AUTH_RESPONSE;
  this.order_map = [0];
  this.len_map = [1];
  this.array_len_map = [0];
  this.crc_extra = 239;
  this._name = "AIRLINK_AUTH_RESPONSE";
  this._instance_field = void 0;
  this._instance_offset = -1;
  this.fieldnames = ["resp_type"];
};
mavlink20.messages.airlink_auth_response.prototype = new mavlink20.message();
mavlink20.messages.airlink_auth_response.prototype.pack = function(mav) {
  var orderedfields = [this.resp_type];
  var j = jspack.Pack(this._format, orderedfields);
  if (j === false) throw new Error("jspack unable to handle this packet");
  return mavlink20.message.prototype.pack.call(this, mav, this.crc_extra, j);
};
mavlink20.map = {
  150: { format: "<fiiffffffhhh", type: mavlink20.messages.sensor_offsets, order_map: [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 134 },
  151: { format: "<hhhBB", type: mavlink20.messages.set_mag_offsets, order_map: [3, 4, 0, 1, 2], crc_extra: 219 },
  152: { format: "<HHI", type: mavlink20.messages.meminfo, order_map: [0, 1, 2], crc_extra: 208 },
  153: { format: "<HHHHHH", type: mavlink20.messages.ap_adc, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 188 },
  154: { format: "<fHBBBBBBBBB", type: mavlink20.messages.digicam_configure, order_map: [2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 0], crc_extra: 84 },
  155: { format: "<fBBBBbBBBB", type: mavlink20.messages.digicam_control, order_map: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], crc_extra: 22 },
  156: { format: "<BBBBBB", type: mavlink20.messages.mount_configure, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 19 },
  157: { format: "<iiiBBB", type: mavlink20.messages.mount_control, order_map: [3, 4, 0, 1, 2, 5], crc_extra: 21 },
  158: { format: "<iiiBBB", type: mavlink20.messages.mount_status, order_map: [3, 4, 0, 1, 2, 5], crc_extra: 134 },
  160: { format: "<ffBBBB", type: mavlink20.messages.fence_point, order_map: [2, 3, 4, 5, 0, 1], crc_extra: 78 },
  161: { format: "<BBB", type: mavlink20.messages.fence_fetch_point, order_map: [0, 1, 2], crc_extra: 68 },
  163: { format: "<fffffff", type: mavlink20.messages.ahrs, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 127 },
  164: { format: "<fffffffffii", type: mavlink20.messages.simstate, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 154 },
  165: { format: "<HB", type: mavlink20.messages.hwstatus, order_map: [0, 1], crc_extra: 21 },
  166: { format: "<HHBBBBB", type: mavlink20.messages.radio, order_map: [2, 3, 4, 5, 6, 0, 1], crc_extra: 21 },
  167: { format: "<IIIIHBBBB", type: mavlink20.messages.limits_status, order_map: [5, 0, 1, 2, 3, 4, 6, 7, 8], crc_extra: 144 },
  168: { format: "<fff", type: mavlink20.messages.wind, order_map: [0, 1, 2], crc_extra: 1 },
  169: { format: "<BB16s", type: mavlink20.messages.data16, order_map: [0, 1, 2], crc_extra: 234 },
  170: { format: "<BB32s", type: mavlink20.messages.data32, order_map: [0, 1, 2], crc_extra: 73 },
  171: { format: "<BB64s", type: mavlink20.messages.data64, order_map: [0, 1, 2], crc_extra: 181 },
  172: { format: "<BB96s", type: mavlink20.messages.data96, order_map: [0, 1, 2], crc_extra: 22 },
  173: { format: "<ff", type: mavlink20.messages.rangefinder, order_map: [0, 1], crc_extra: 83 },
  174: { format: "<ffffffffffff", type: mavlink20.messages.airspeed_autocal, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 167 },
  175: { format: "<iihhHBBBBB", type: mavlink20.messages.rally_point, order_map: [5, 6, 7, 8, 0, 1, 2, 3, 4, 9], crc_extra: 138 },
  176: { format: "<BBB", type: mavlink20.messages.rally_fetch_point, order_map: [0, 1, 2], crc_extra: 234 },
  177: { format: "<ffffHH", type: mavlink20.messages.compassmot_status, order_map: [4, 0, 5, 1, 2, 3], crc_extra: 240 },
  178: { format: "<ffffii", type: mavlink20.messages.ahrs2, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 47 },
  179: { format: "<QffffHBBB", type: mavlink20.messages.camera_status, order_map: [0, 6, 7, 5, 8, 1, 2, 3, 4], crc_extra: 189 },
  180: { format: "<QiiffffffHBBBH", type: mavlink20.messages.camera_feedback, order_map: [0, 10, 11, 9, 1, 2, 3, 4, 5, 6, 7, 8, 12, 13], crc_extra: 52 },
  181: { format: "<Hh", type: mavlink20.messages.battery2, order_map: [0, 1], crc_extra: 174 },
  182: { format: "<ffffiiffff", type: mavlink20.messages.ahrs3, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], crc_extra: 229 },
  183: { format: "<BB", type: mavlink20.messages.autopilot_version_request, order_map: [0, 1], crc_extra: 85 },
  184: { format: "<IBB200s", type: mavlink20.messages.remote_log_data_block, order_map: [1, 2, 0, 3], crc_extra: 159 },
  185: { format: "<IBBB", type: mavlink20.messages.remote_log_block_status, order_map: [1, 2, 0, 3], crc_extra: 186 },
  186: { format: "<BBBBB24s", type: mavlink20.messages.led_control, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 72 },
  191: { format: "<fffBBBBB10s", type: mavlink20.messages.mag_cal_progress, order_map: [3, 4, 5, 6, 7, 8, 0, 1, 2], crc_extra: 92 },
  193: { format: "<fffffHf", type: mavlink20.messages.ekf_status_report, order_map: [5, 0, 1, 2, 3, 4, 6], crc_extra: 71 },
  194: { format: "<ffffffBff", type: mavlink20.messages.pid_tuning, order_map: [6, 0, 1, 2, 3, 4, 5, 7, 8], crc_extra: 98 },
  195: { format: "<iiiiiifffB", type: mavlink20.messages.deepstall, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], crc_extra: 120 },
  200: { format: "<ffffffffffBB", type: mavlink20.messages.gimbal_report, order_map: [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], crc_extra: 134 },
  201: { format: "<fffBB", type: mavlink20.messages.gimbal_control, order_map: [3, 4, 0, 1, 2], crc_extra: 205 },
  214: { format: "<hhhBB", type: mavlink20.messages.gimbal_torque_cmd_report, order_map: [3, 4, 0, 1, 2], crc_extra: 69 },
  215: { format: "<BBB", type: mavlink20.messages.gopro_heartbeat, order_map: [0, 1, 2], crc_extra: 101 },
  216: { format: "<BBB", type: mavlink20.messages.gopro_get_request, order_map: [0, 1, 2], crc_extra: 50 },
  217: { format: "<BB4s", type: mavlink20.messages.gopro_get_response, order_map: [0, 1, 2], crc_extra: 202 },
  218: { format: "<BBB4s", type: mavlink20.messages.gopro_set_request, order_map: [0, 1, 2, 3], crc_extra: 17 },
  219: { format: "<BB", type: mavlink20.messages.gopro_set_response, order_map: [0, 1], crc_extra: 162 },
  226: { format: "<ff", type: mavlink20.messages.rpm, order_map: [0, 1], crc_extra: 207 },
  11e3: { format: "<IBBBBB40sBBB", type: mavlink20.messages.device_op_read, order_map: [1, 2, 0, 3, 4, 5, 6, 7, 8, 9], crc_extra: 134 },
  11001: { format: "<IBBB128sB", type: mavlink20.messages.device_op_read_reply, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 15 },
  11002: { format: "<IBBBBB40sBB128sB", type: mavlink20.messages.device_op_write, order_map: [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 234 },
  11003: { format: "<IB", type: mavlink20.messages.device_op_write_reply, order_map: [0, 1], crc_extra: 64 },
  11004: { format: "<IIBBBB220s", type: mavlink20.messages.secure_command, order_map: [2, 3, 0, 1, 4, 5, 6], crc_extra: 11 },
  11005: { format: "<IIBB220s", type: mavlink20.messages.secure_command_reply, order_map: [0, 1, 2, 3, 4], crc_extra: 93 },
  11010: { format: "<ffffffffffffB", type: mavlink20.messages.adap_tuning, order_map: [12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 46 },
  11011: { format: "<QQ3f3ff", type: mavlink20.messages.vision_position_delta, order_map: [0, 1, 2, 3, 4], crc_extra: 106 },
  11020: { format: "<Qff", type: mavlink20.messages.aoa_ssa, order_map: [0, 1, 2], crc_extra: 205 },
  11030: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_1_to_4, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 144 },
  11031: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_5_to_8, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 133 },
  11032: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_9_to_12, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 85 },
  11033: { format: "<IfffBBBB16sB", type: mavlink20.messages.osd_param_config, order_map: [4, 5, 0, 6, 7, 8, 9, 1, 2, 3], crc_extra: 195 },
  11034: { format: "<IB", type: mavlink20.messages.osd_param_config_reply, order_map: [0, 1], crc_extra: 79 },
  11035: { format: "<IBBBB", type: mavlink20.messages.osd_param_show_config, order_map: [1, 2, 0, 3, 4], crc_extra: 128 },
  11036: { format: "<IfffB16sB", type: mavlink20.messages.osd_param_show_config_reply, order_map: [0, 4, 5, 6, 1, 2, 3], crc_extra: 177 },
  11037: { format: "<IfffffHBB", type: mavlink20.messages.obstacle_distance_3d, order_map: [0, 7, 8, 6, 1, 2, 3, 4, 5], crc_extra: 130 },
  11038: { format: "<IiiffffffBB", type: mavlink20.messages.water_depth, order_map: [0, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 47 },
  11039: { format: "<hHHHB", type: mavlink20.messages.mcu_status, order_map: [4, 0, 1, 2, 3], crc_extra: 142 },
  11040: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_13_to_16, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 132 },
  11041: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_17_to_20, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 208 },
  11042: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_21_to_24, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 201 },
  11043: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_25_to_28, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 193 },
  11044: { format: "<4H4H4H4H4H4s", type: mavlink20.messages.esc_telemetry_29_to_32, order_map: [5, 0, 1, 2, 3, 4], crc_extra: 189 },
  223: { format: "<QIffffiifHBBBBB", type: mavlink20.messages.command_int_stamped, order_map: [1, 0, 10, 11, 12, 9, 13, 14, 2, 3, 4, 5, 6, 7, 8], crc_extra: 119 },
  224: { format: "<QIfffffffHBBB", type: mavlink20.messages.command_long_stamped, order_map: [1, 0, 10, 11, 9, 12, 2, 3, 4, 5, 6, 7, 8], crc_extra: 102 },
  8002: { format: "<ffff", type: mavlink20.messages.sens_power, order_map: [0, 1, 2, 3], crc_extra: 218 },
  8003: { format: "<QffffffHHHBBB", type: mavlink20.messages.sens_mppt, order_map: [0, 1, 2, 7, 10, 3, 4, 8, 11, 5, 6, 9, 12], crc_extra: 231 },
  8004: { format: "<QffffffffffffffffffffffBB", type: mavlink20.messages.aslctrl_data, order_map: [0, 23, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], crc_extra: 172 },
  8005: { format: "<IffffffffBB", type: mavlink20.messages.aslctrl_debug, order_map: [0, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 251 },
  8006: { format: "<fBB8s", type: mavlink20.messages.asluav_status, order_map: [1, 2, 3, 0], crc_extra: 97 },
  8007: { format: "<Qffffff", type: mavlink20.messages.ekf_ext, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 64 },
  8008: { format: "<QffffffB", type: mavlink20.messages.asl_obctrl, order_map: [0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 234 },
  8009: { format: "<Qff", type: mavlink20.messages.sens_atmos, order_map: [0, 1, 2], crc_extra: 144 },
  8010: { format: "<QfIIHhHHHHHHHHB", type: mavlink20.messages.sens_batmon, order_map: [0, 1, 4, 5, 14, 6, 7, 2, 3, 8, 9, 10, 11, 12, 13], crc_extra: 155 },
  8011: { format: "<QQfffffffffffffffffffffBB", type: mavlink20.messages.fw_soaring_data, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], crc_extra: 20 },
  8012: { format: "<QHBBBBBB", type: mavlink20.messages.sensorpod_status, order_map: [0, 2, 3, 4, 5, 6, 7, 1], crc_extra: 54 },
  8013: { format: "<QfffffffffBB", type: mavlink20.messages.sens_power_board, order_map: [0, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9], crc_extra: 222 },
  8014: { format: "<QBBBBBB", type: mavlink20.messages.gsm_link_status, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 200 },
  8015: { format: "<QQHHBBBB", type: mavlink20.messages.satcom_link_status, order_map: [0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 23 },
  8016: { format: "<QffBB", type: mavlink20.messages.sensor_airflow_angles, order_map: [0, 1, 3, 2, 4], crc_extra: 149 },
  1: { format: "<IIIHHhHHHHHHb", type: mavlink20.messages.sys_status, order_map: [0, 1, 2, 3, 4, 5, 12, 6, 7, 8, 9, 10, 11], crc_extra: 124 },
  2: { format: "<QI", type: mavlink20.messages.system_time, order_map: [0, 1], crc_extra: 137 },
  4: { format: "<QIBB", type: mavlink20.messages.ping, order_map: [0, 1, 2, 3], crc_extra: 237 },
  5: { format: "<BBB25s", type: mavlink20.messages.change_operator_control, order_map: [0, 1, 2, 3], crc_extra: 217 },
  6: { format: "<BBB", type: mavlink20.messages.change_operator_control_ack, order_map: [0, 1, 2], crc_extra: 104 },
  7: { format: "<32s", type: mavlink20.messages.auth_key, order_map: [0], crc_extra: 119 },
  11: { format: "<IBB", type: mavlink20.messages.set_mode, order_map: [1, 2, 0], crc_extra: 89 },
  20: { format: "<hBB16s", type: mavlink20.messages.param_request_read, order_map: [1, 2, 3, 0], crc_extra: 214 },
  21: { format: "<BB", type: mavlink20.messages.param_request_list, order_map: [0, 1], crc_extra: 159 },
  22: { format: "<fHH16sB", type: mavlink20.messages.param_value, order_map: [3, 0, 4, 1, 2], crc_extra: 220 },
  23: { format: "<fBB16sB", type: mavlink20.messages.param_set, order_map: [1, 2, 3, 0, 4], crc_extra: 168 },
  24: { format: "<QiiiHHHHBBiIIIIH", type: mavlink20.messages.gps_raw_int, order_map: [0, 8, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15], crc_extra: 24 },
  25: { format: "<B20s20s20s20s20s", type: mavlink20.messages.gps_status, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 23 },
  26: { format: "<Ihhhhhhhhhh", type: mavlink20.messages.scaled_imu, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 170 },
  27: { format: "<QhhhhhhhhhBh", type: mavlink20.messages.raw_imu, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 144 },
  28: { format: "<Qhhhh", type: mavlink20.messages.raw_pressure, order_map: [0, 1, 2, 3, 4], crc_extra: 67 },
  29: { format: "<Iffhh", type: mavlink20.messages.scaled_pressure, order_map: [0, 1, 2, 3, 4], crc_extra: 115 },
  30: { format: "<Iffffff", type: mavlink20.messages.attitude, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 39 },
  31: { format: "<Ifffffff4f", type: mavlink20.messages.attitude_quaternion, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 246 },
  32: { format: "<Iffffff", type: mavlink20.messages.local_position_ned, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 185 },
  33: { format: "<IiiiihhhH", type: mavlink20.messages.global_position_int, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 104 },
  34: { format: "<IhhhhhhhhBB", type: mavlink20.messages.rc_channels_scaled, order_map: [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10], crc_extra: 237 },
  35: { format: "<IHHHHHHHHBB", type: mavlink20.messages.rc_channels_raw, order_map: [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10], crc_extra: 244 },
  36: { format: "<IHHHHHHHHBHHHHHHHH", type: mavlink20.messages.servo_output_raw, order_map: [0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17], crc_extra: 222 },
  37: { format: "<hhBBB", type: mavlink20.messages.mission_request_partial_list, order_map: [2, 3, 0, 1, 4], crc_extra: 212 },
  38: { format: "<hhBBB", type: mavlink20.messages.mission_write_partial_list, order_map: [2, 3, 0, 1, 4], crc_extra: 9 },
  39: { format: "<fffffffHHBBBBBB", type: mavlink20.messages.mission_item, order_map: [9, 10, 7, 11, 8, 12, 13, 0, 1, 2, 3, 4, 5, 6, 14], crc_extra: 254 },
  40: { format: "<HBBB", type: mavlink20.messages.mission_request, order_map: [1, 2, 0, 3], crc_extra: 230 },
  41: { format: "<HBB", type: mavlink20.messages.mission_set_current, order_map: [1, 2, 0], crc_extra: 28 },
  42: { format: "<HHBB", type: mavlink20.messages.mission_current, order_map: [0, 1, 2, 3], crc_extra: 28 },
  43: { format: "<BBB", type: mavlink20.messages.mission_request_list, order_map: [0, 1, 2], crc_extra: 132 },
  44: { format: "<HBBB", type: mavlink20.messages.mission_count, order_map: [1, 2, 0, 3], crc_extra: 221 },
  45: { format: "<BBB", type: mavlink20.messages.mission_clear_all, order_map: [0, 1, 2], crc_extra: 232 },
  46: { format: "<H", type: mavlink20.messages.mission_item_reached, order_map: [0], crc_extra: 11 },
  47: { format: "<BBBB", type: mavlink20.messages.mission_ack, order_map: [0, 1, 2, 3], crc_extra: 153 },
  48: { format: "<iiiBQ", type: mavlink20.messages.set_gps_global_origin, order_map: [3, 0, 1, 2, 4], crc_extra: 41 },
  49: { format: "<iiiQ", type: mavlink20.messages.gps_global_origin, order_map: [0, 1, 2, 3], crc_extra: 39 },
  50: { format: "<ffffhBB16sB", type: mavlink20.messages.param_map_rc, order_map: [5, 6, 7, 4, 8, 0, 1, 2, 3], crc_extra: 78 },
  51: { format: "<HBBB", type: mavlink20.messages.mission_request_int, order_map: [1, 2, 0, 3], crc_extra: 196 },
  54: { format: "<ffffffBBB", type: mavlink20.messages.safety_set_allowed_area, order_map: [6, 7, 8, 0, 1, 2, 3, 4, 5], crc_extra: 15 },
  55: { format: "<ffffffB", type: mavlink20.messages.safety_allowed_area, order_map: [6, 0, 1, 2, 3, 4, 5], crc_extra: 3 },
  61: { format: "<Q4ffff9f", type: mavlink20.messages.attitude_quaternion_cov, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 167 },
  62: { format: "<fffffhhH", type: mavlink20.messages.nav_controller_output, order_map: [0, 1, 5, 6, 7, 2, 3, 4], crc_extra: 183 },
  63: { format: "<Qiiiifff36fB", type: mavlink20.messages.global_position_int_cov, order_map: [0, 9, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 119 },
  64: { format: "<Qfffffffff45fB", type: mavlink20.messages.local_position_ned_cov, order_map: [0, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 191 },
  65: { format: "<IHHHHHHHHHHHHHHHHHHBB", type: mavlink20.messages.rc_channels, order_map: [0, 19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], crc_extra: 118 },
  66: { format: "<HBBBB", type: mavlink20.messages.request_data_stream, order_map: [1, 2, 3, 0, 4], crc_extra: 148 },
  67: { format: "<HBB", type: mavlink20.messages.data_stream, order_map: [1, 0, 2], crc_extra: 21 },
  69: { format: "<hhhhHBHBhhhhhhhh", type: mavlink20.messages.manual_control, order_map: [5, 0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], crc_extra: 243 },
  70: { format: "<HHHHHHHHBBHHHHHHHHHH", type: mavlink20.messages.rc_channels_override, order_map: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], crc_extra: 124 },
  73: { format: "<ffffiifHHBBBBBB", type: mavlink20.messages.mission_item_int, order_map: [9, 10, 7, 11, 8, 12, 13, 0, 1, 2, 3, 4, 5, 6, 14], crc_extra: 38 },
  74: { format: "<ffffhH", type: mavlink20.messages.vfr_hud, order_map: [0, 1, 4, 5, 2, 3], crc_extra: 20 },
  75: { format: "<ffffiifHBBBBB", type: mavlink20.messages.command_int, order_map: [8, 9, 10, 7, 11, 12, 0, 1, 2, 3, 4, 5, 6], crc_extra: 158 },
  76: { format: "<fffffffHBBB", type: mavlink20.messages.command_long, order_map: [8, 9, 7, 10, 0, 1, 2, 3, 4, 5, 6], crc_extra: 152 },
  77: { format: "<HBBiBB", type: mavlink20.messages.command_ack, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 143 },
  81: { format: "<IffffBB", type: mavlink20.messages.manual_setpoint, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 106 },
  82: { format: "<I4fffffBBB", type: mavlink20.messages.set_attitude_target, order_map: [0, 6, 7, 8, 1, 2, 3, 4, 5], crc_extra: 49 },
  83: { format: "<I4fffffB", type: mavlink20.messages.attitude_target, order_map: [0, 6, 1, 2, 3, 4, 5], crc_extra: 22 },
  84: { format: "<IfffffffffffHBBB", type: mavlink20.messages.set_position_target_local_ned, order_map: [0, 13, 14, 15, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 143 },
  85: { format: "<IfffffffffffHB", type: mavlink20.messages.position_target_local_ned, order_map: [0, 13, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 140 },
  86: { format: "<IiifffffffffHBBB", type: mavlink20.messages.set_position_target_global_int, order_map: [0, 13, 14, 15, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 5 },
  87: { format: "<IiifffffffffHB", type: mavlink20.messages.position_target_global_int, order_map: [0, 13, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 150 },
  89: { format: "<Iffffff", type: mavlink20.messages.local_position_ned_system_global_offset, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 231 },
  90: { format: "<Qffffffiiihhhhhh", type: mavlink20.messages.hil_state, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], crc_extra: 183 },
  91: { format: "<QffffffffBB", type: mavlink20.messages.hil_controls, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 63 },
  92: { format: "<QHHHHHHHHHHHHB", type: mavlink20.messages.hil_rc_inputs_raw, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], crc_extra: 54 },
  93: { format: "<QQ16fB", type: mavlink20.messages.hil_actuator_controls, order_map: [0, 2, 3, 1], crc_extra: 47 },
  100: { format: "<QfffhhBBff", type: mavlink20.messages.optical_flow, order_map: [0, 6, 4, 5, 1, 2, 7, 3, 8, 9], crc_extra: 175 },
  101: { format: "<Qffffff21fB", type: mavlink20.messages.global_vision_position_estimate, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 102 },
  102: { format: "<Qffffff21fB", type: mavlink20.messages.vision_position_estimate, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 158 },
  103: { format: "<Qfff9fB", type: mavlink20.messages.vision_speed_estimate, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 208 },
  104: { format: "<Qffffff21f", type: mavlink20.messages.vicon_position_estimate, order_map: [0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 56 },
  105: { format: "<QfffffffffffffHB", type: mavlink20.messages.highres_imu, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], crc_extra: 93 },
  106: { format: "<QIfffffIfhBB", type: mavlink20.messages.optical_flow_rad, order_map: [0, 10, 1, 2, 3, 4, 5, 6, 9, 11, 7, 8], crc_extra: 138 },
  107: { format: "<QfffffffffffffIB", type: mavlink20.messages.hil_sensor, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], crc_extra: 108 },
  108: { format: "<fffffffffffffffffffffii", type: mavlink20.messages.sim_state, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], crc_extra: 32 },
  109: { format: "<HHBBBBB", type: mavlink20.messages.radio_status, order_map: [2, 3, 4, 5, 6, 0, 1], crc_extra: 185 },
  110: { format: "<BBB251s", type: mavlink20.messages.file_transfer_protocol, order_map: [0, 1, 2, 3], crc_extra: 84 },
  111: { format: "<qq", type: mavlink20.messages.timesync, order_map: [0, 1], crc_extra: 34 },
  112: { format: "<QI", type: mavlink20.messages.camera_trigger, order_map: [0, 1], crc_extra: 174 },
  113: { format: "<QiiiHHHhhhHBBBH", type: mavlink20.messages.hil_gps, order_map: [0, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14], crc_extra: 124 },
  114: { format: "<QIfffffIfhBB", type: mavlink20.messages.hil_optical_flow, order_map: [0, 10, 1, 2, 3, 4, 5, 6, 9, 11, 7, 8], crc_extra: 237 },
  115: { format: "<Q4ffffiiihhhHHhhh", type: mavlink20.messages.hil_state_quaternion, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], crc_extra: 4 },
  116: { format: "<Ihhhhhhhhhh", type: mavlink20.messages.scaled_imu2, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 76 },
  117: { format: "<HHBB", type: mavlink20.messages.log_request_list, order_map: [2, 3, 0, 1], crc_extra: 128 },
  118: { format: "<IIHHH", type: mavlink20.messages.log_entry, order_map: [2, 3, 4, 0, 1], crc_extra: 56 },
  119: { format: "<IIHBB", type: mavlink20.messages.log_request_data, order_map: [3, 4, 2, 0, 1], crc_extra: 116 },
  120: { format: "<IHB90s", type: mavlink20.messages.log_data, order_map: [1, 0, 2, 3], crc_extra: 134 },
  121: { format: "<BB", type: mavlink20.messages.log_erase, order_map: [0, 1], crc_extra: 237 },
  122: { format: "<BB", type: mavlink20.messages.log_request_end, order_map: [0, 1], crc_extra: 203 },
  123: { format: "<BBB110s", type: mavlink20.messages.gps_inject_data, order_map: [0, 1, 2, 3], crc_extra: 250 },
  124: { format: "<QiiiIHHHHBBBHiIIII", type: mavlink20.messages.gps2_raw, order_map: [0, 9, 1, 2, 3, 5, 6, 7, 8, 10, 11, 4, 12, 13, 14, 15, 16, 17], crc_extra: 87 },
  125: { format: "<HHH", type: mavlink20.messages.power_status, order_map: [0, 1, 2], crc_extra: 203 },
  126: { format: "<IHBBB70s", type: mavlink20.messages.serial_control, order_map: [2, 3, 1, 0, 4, 5], crc_extra: 220 },
  127: { format: "<IIiiiIiHBBBBB", type: mavlink20.messages.gps_rtk, order_map: [0, 8, 7, 1, 9, 10, 11, 12, 2, 3, 4, 5, 6], crc_extra: 25 },
  128: { format: "<IIiiiIiHBBBBB", type: mavlink20.messages.gps2_rtk, order_map: [0, 8, 7, 1, 9, 10, 11, 12, 2, 3, 4, 5, 6], crc_extra: 226 },
  129: { format: "<Ihhhhhhhhhh", type: mavlink20.messages.scaled_imu3, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 46 },
  130: { format: "<IHHHBBB", type: mavlink20.messages.data_transmission_handshake, order_map: [4, 0, 1, 2, 3, 5, 6], crc_extra: 29 },
  131: { format: "<H253s", type: mavlink20.messages.encapsulated_data, order_map: [0, 1], crc_extra: 223 },
  132: { format: "<IHHHBBBBff4fB", type: mavlink20.messages.distance_sensor, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 85 },
  133: { format: "<QiiH", type: mavlink20.messages.terrain_request, order_map: [1, 2, 3, 0], crc_extra: 6 },
  134: { format: "<iiH16hB", type: mavlink20.messages.terrain_data, order_map: [0, 1, 2, 4, 3], crc_extra: 229 },
  135: { format: "<ii", type: mavlink20.messages.terrain_check, order_map: [0, 1], crc_extra: 203 },
  136: { format: "<iiffHHH", type: mavlink20.messages.terrain_report, order_map: [0, 1, 4, 2, 3, 5, 6], crc_extra: 1 },
  137: { format: "<Iffhh", type: mavlink20.messages.scaled_pressure2, order_map: [0, 1, 2, 3, 4], crc_extra: 195 },
  138: { format: "<Q4ffff21f", type: mavlink20.messages.att_pos_mocap, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 109 },
  139: { format: "<Q8fBBB", type: mavlink20.messages.set_actuator_control_target, order_map: [0, 2, 3, 4, 1], crc_extra: 168 },
  140: { format: "<Q8fB", type: mavlink20.messages.actuator_control_target, order_map: [0, 2, 1], crc_extra: 181 },
  141: { format: "<Qffffff", type: mavlink20.messages.altitude, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 47 },
  142: { format: "<BB120sB120s", type: mavlink20.messages.resource_request, order_map: [0, 1, 2, 3, 4], crc_extra: 72 },
  143: { format: "<Iffhh", type: mavlink20.messages.scaled_pressure3, order_map: [0, 1, 2, 3, 4], crc_extra: 131 },
  144: { format: "<QQiif3f3f4f3f3fB", type: mavlink20.messages.follow_target, order_map: [0, 10, 2, 3, 4, 5, 6, 7, 8, 9, 1], crc_extra: 127 },
  146: { format: "<Qffffffffff3f3f4ffff", type: mavlink20.messages.control_system_state, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], crc_extra: 103 },
  147: { format: "<iih10HhBBBbiB4HBI", type: mavlink20.messages.battery_status, order_map: [5, 6, 7, 2, 3, 4, 0, 1, 8, 9, 10, 11, 12, 13], crc_extra: 154 },
  148: { format: "<QQIIIIHH8s8s8s18s", type: mavlink20.messages.autopilot_version, order_map: [0, 2, 3, 4, 5, 8, 9, 10, 6, 7, 1, 11], crc_extra: 178 },
  149: { format: "<QfffffBBfff4fBB", type: mavlink20.messages.landing_target, order_map: [0, 6, 7, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13], crc_extra: 200 },
  162: { format: "<IHBBB", type: mavlink20.messages.fence_status, order_map: [2, 1, 3, 0, 4], crc_extra: 189 },
  192: { format: "<ffffffffffBBBBfBBf", type: mavlink20.messages.mag_cal_report, order_map: [10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17], crc_extra: 36 },
  225: { format: "<ffffffffffffffffBff", type: mavlink20.messages.efi_status, order_map: [16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18], crc_extra: 208 },
  230: { format: "<QffffffffH", type: mavlink20.messages.estimator_status, order_map: [0, 9, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 163 },
  231: { format: "<Qffffffff", type: mavlink20.messages.wind_cov, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 105 },
  232: { format: "<QIiifffffffffHHBBBH", type: mavlink20.messages.gps_input, order_map: [0, 15, 13, 1, 14, 16, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18], crc_extra: 151 },
  233: { format: "<BB180s", type: mavlink20.messages.gps_rtcm_data, order_map: [0, 1, 2], crc_extra: 35 },
  234: { format: "<IiihhHhhhHBBbBBBbBBBbbBB", type: mavlink20.messages.high_latency, order_map: [10, 0, 11, 3, 4, 5, 12, 6, 1, 2, 7, 8, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 9], crc_extra: 150 },
  235: { format: "<IiiHhhHHHBBBBBBBBBBBBbbbbbb", type: mavlink20.messages.high_latency2, order_map: [0, 9, 10, 3, 1, 2, 4, 5, 11, 12, 6, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 7, 8, 24, 25, 26], crc_extra: 179 },
  241: { format: "<QfffIII", type: mavlink20.messages.vibration, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 90 },
  242: { format: "<iiifff4ffffQ", type: mavlink20.messages.home_position, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 104 },
  243: { format: "<iiifff4ffffBQ", type: mavlink20.messages.set_home_position, order_map: [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], crc_extra: 85 },
  244: { format: "<iH", type: mavlink20.messages.message_interval, order_map: [1, 0], crc_extra: 95 },
  245: { format: "<BB", type: mavlink20.messages.extended_sys_state, order_map: [0, 1], crc_extra: 130 },
  246: { format: "<IiiiHHhHHB9sBB", type: mavlink20.messages.adsb_vehicle, order_map: [0, 1, 2, 9, 3, 4, 5, 6, 10, 11, 12, 7, 8], crc_extra: 184 },
  247: { format: "<IfffBBB", type: mavlink20.messages.collision, order_map: [4, 0, 5, 6, 1, 2, 3], crc_extra: 81 },
  248: { format: "<HBBB249s", type: mavlink20.messages.v2_extension, order_map: [1, 2, 3, 0, 4], crc_extra: 8 },
  249: { format: "<HBB32s", type: mavlink20.messages.memory_vect, order_map: [0, 1, 2, 3], crc_extra: 204 },
  250: { format: "<Qfff10s", type: mavlink20.messages.debug_vect, order_map: [4, 0, 1, 2, 3], crc_extra: 49 },
  251: { format: "<If10s", type: mavlink20.messages.named_value_float, order_map: [0, 2, 1], crc_extra: 170 },
  252: { format: "<Ii10s", type: mavlink20.messages.named_value_int, order_map: [0, 2, 1], crc_extra: 44 },
  253: { format: "<B50sHB", type: mavlink20.messages.statustext, order_map: [0, 1, 2, 3], crc_extra: 83 },
  254: { format: "<IfB", type: mavlink20.messages.debug, order_map: [0, 2, 1], crc_extra: 46 },
  256: { format: "<QBB32s", type: mavlink20.messages.setup_signing, order_map: [1, 2, 3, 0], crc_extra: 71 },
  257: { format: "<IIB", type: mavlink20.messages.button_change, order_map: [0, 1, 2], crc_extra: 131 },
  258: { format: "<BB30s200s", type: mavlink20.messages.play_tune, order_map: [0, 1, 2, 3], crc_extra: 187 },
  259: { format: "<IIfffIHHH32s32sB140sB", type: mavlink20.messages.camera_information, order_map: [0, 9, 10, 1, 2, 3, 4, 6, 7, 11, 5, 8, 12, 13], crc_extra: 92 },
  260: { format: "<IBff", type: mavlink20.messages.camera_settings, order_map: [0, 1, 2, 3], crc_extra: 146 },
  261: { format: "<IfffffBBBB32s", type: mavlink20.messages.storage_information, order_map: [0, 6, 7, 8, 1, 2, 3, 4, 5, 9, 10], crc_extra: 179 },
  262: { format: "<IfIfBBi", type: mavlink20.messages.camera_capture_status, order_map: [0, 4, 5, 1, 2, 3, 6], crc_extra: 12 },
  263: { format: "<QIiiii4fiBb205s", type: mavlink20.messages.camera_image_captured, order_map: [1, 0, 8, 2, 3, 4, 5, 6, 7, 9, 10], crc_extra: 133 },
  264: { format: "<QQQI", type: mavlink20.messages.flight_information, order_map: [3, 0, 1, 2], crc_extra: 49 },
  265: { format: "<Iffff", type: mavlink20.messages.mount_orientation, order_map: [0, 1, 2, 3, 4], crc_extra: 26 },
  266: { format: "<HBBBB249s", type: mavlink20.messages.logging_data, order_map: [1, 2, 0, 3, 4, 5], crc_extra: 193 },
  267: { format: "<HBBBB249s", type: mavlink20.messages.logging_data_acked, order_map: [1, 2, 0, 3, 4, 5], crc_extra: 35 },
  268: { format: "<HBB", type: mavlink20.messages.logging_ack, order_map: [1, 2, 0], crc_extra: 14 },
  269: { format: "<fIHHHHHBBB32s160s", type: mavlink20.messages.video_stream_information, order_map: [7, 8, 9, 2, 0, 3, 4, 1, 5, 6, 10, 11], crc_extra: 109 },
  270: { format: "<fIHHHHHB", type: mavlink20.messages.video_stream_status, order_map: [7, 2, 0, 3, 4, 1, 5, 6], crc_extra: 59 },
  271: { format: "<Iiiiiii4fff", type: mavlink20.messages.camera_fov_status, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], crc_extra: 22 },
  275: { format: "<fffffffBBB", type: mavlink20.messages.camera_tracking_image_status, order_map: [7, 8, 9, 0, 1, 2, 3, 4, 5, 6], crc_extra: 126 },
  276: { format: "<iiffffffffffB", type: mavlink20.messages.camera_tracking_geo_status, order_map: [12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], crc_extra: 18 },
  280: { format: "<IIffffffB", type: mavlink20.messages.gimbal_manager_information, order_map: [0, 1, 8, 2, 3, 4, 5, 6, 7], crc_extra: 70 },
  281: { format: "<IIBBBBB", type: mavlink20.messages.gimbal_manager_status, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 48 },
  282: { format: "<I4ffffBBB", type: mavlink20.messages.gimbal_manager_set_attitude, order_map: [5, 6, 0, 7, 1, 2, 3, 4], crc_extra: 123 },
  283: { format: "<QIIIffffffHH32s32s32sB", type: mavlink20.messages.gimbal_device_information, order_map: [1, 12, 13, 14, 2, 3, 0, 10, 11, 4, 5, 6, 7, 8, 9, 15], crc_extra: 74 },
  284: { format: "<4ffffHBB", type: mavlink20.messages.gimbal_device_set_attitude, order_map: [5, 6, 4, 0, 1, 2, 3], crc_extra: 99 },
  285: { format: "<I4ffffIHBBffB", type: mavlink20.messages.gimbal_device_attitude_status, order_map: [7, 8, 0, 6, 1, 2, 3, 4, 5, 9, 10, 11], crc_extra: 137 },
  286: { format: "<Q4fIfffIfHBBBf", type: mavlink20.messages.autopilot_state_for_gimbal_device, order_map: [9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12], crc_extra: 210 },
  287: { format: "<IffffBBB", type: mavlink20.messages.gimbal_manager_set_pitchyaw, order_map: [5, 6, 0, 7, 1, 2, 3, 4], crc_extra: 1 },
  288: { format: "<IffffBBB", type: mavlink20.messages.gimbal_manager_set_manual_control, order_map: [5, 6, 0, 7, 1, 2, 3, 4], crc_extra: 20 },
  299: { format: "<32s64s", type: mavlink20.messages.wifi_config_ap, order_map: [0, 1], crc_extra: 19 },
  301: { format: "<IiiHHHHHHHbBBBB7s20s", type: mavlink20.messages.ais_vessel, order_map: [0, 1, 2, 3, 4, 5, 10, 11, 12, 6, 7, 13, 14, 15, 16, 8, 9], crc_extra: 243 },
  310: { format: "<QIHBBB", type: mavlink20.messages.uavcan_node_status, order_map: [0, 1, 3, 4, 5, 2], crc_extra: 28 },
  311: { format: "<QII80sBB16sBB", type: mavlink20.messages.uavcan_node_info, order_map: [0, 1, 3, 4, 5, 6, 7, 8, 2], crc_extra: 95 },
  320: { format: "<hBB16s", type: mavlink20.messages.param_ext_request_read, order_map: [1, 2, 3, 0], crc_extra: 243 },
  321: { format: "<BB", type: mavlink20.messages.param_ext_request_list, order_map: [0, 1], crc_extra: 88 },
  322: { format: "<HH16s128sB", type: mavlink20.messages.param_ext_value, order_map: [2, 3, 4, 0, 1], crc_extra: 243 },
  323: { format: "<BB16s128sB", type: mavlink20.messages.param_ext_set, order_map: [0, 1, 2, 3, 4], crc_extra: 78 },
  324: { format: "<16s128sBB", type: mavlink20.messages.param_ext_ack, order_map: [0, 1, 2, 3], crc_extra: 132 },
  330: { format: "<Q72HHHBBffB", type: mavlink20.messages.obstacle_distance, order_map: [0, 4, 1, 5, 2, 3, 6, 7, 8], crc_extra: 23 },
  331: { format: "<Qfff4fffffff21f21fBBBBb", type: mavlink20.messages.odometry, order_map: [0, 13, 14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17], crc_extra: 91 },
  335: { format: "<QQHHBBBB", type: mavlink20.messages.isbd_link_status, order_map: [0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 225 },
  339: { format: "<fB", type: mavlink20.messages.raw_rpm, order_map: [1, 0], crc_extra: 199 },
  340: { format: "<QiiiiiiihhhHHHH18sBB", type: mavlink20.messages.utm_global_position, order_map: [0, 15, 1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 5, 6, 7, 14, 16, 17], crc_extra: 99 },
  350: { format: "<QH10s58f", type: mavlink20.messages.debug_float_array, order_map: [0, 2, 1, 3], crc_extra: 232 },
  370: { format: "<iiHHHHHBBB16s50sHBII11s", type: mavlink20.messages.smart_battery_info, order_map: [7, 8, 9, 0, 1, 2, 10, 11, 3, 4, 5, 6, 12, 13, 14, 15, 16], crc_extra: 75 },
  373: { format: "<QfffffIiHhh", type: mavlink20.messages.generator_status, order_map: [0, 8, 1, 2, 3, 4, 9, 5, 10, 6, 7], crc_extra: 117 },
  375: { format: "<QI32f", type: mavlink20.messages.actuator_output_status, order_map: [0, 1, 2], crc_extra: 251 },
  376: { format: "<IHH", type: mavlink20.messages.relay_status, order_map: [0, 1, 2], crc_extra: 199 },
  385: { format: "<HBBB128s", type: mavlink20.messages.tunnel, order_map: [1, 2, 0, 3, 4], crc_extra: 147 },
  386: { format: "<IBBBB8s", type: mavlink20.messages.can_frame, order_map: [1, 2, 3, 4, 0, 5], crc_extra: 132 },
  387: { format: "<IBBBB64s", type: mavlink20.messages.canfd_frame, order_map: [1, 2, 3, 4, 0, 5], crc_extra: 4 },
  388: { format: "<16HBBBBB", type: mavlink20.messages.can_filter_modify, order_map: [1, 2, 3, 4, 5, 0], crc_extra: 8 },
  9e3: { format: "<Q16dB", type: mavlink20.messages.wheel_distance, order_map: [0, 2, 1], crc_extra: 113 },
  9005: { format: "<QfffffIh", type: mavlink20.messages.winch_status, order_map: [0, 1, 2, 3, 4, 5, 7, 6], crc_extra: 117 },
  12900: { format: "<BB20sBB20s", type: mavlink20.messages.open_drone_id_basic_id, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 114 },
  12901: { format: "<iiffffHHhBB20sBBBBBBB", type: mavlink20.messages.open_drone_id_location, order_map: [9, 10, 11, 12, 6, 7, 8, 0, 1, 2, 3, 13, 4, 14, 15, 16, 17, 5, 18], crc_extra: 254 },
  12902: { format: "<IBB20sBBBB23s", type: mavlink20.messages.open_drone_id_authentication, order_map: [1, 2, 3, 4, 5, 6, 7, 0, 8], crc_extra: 140 },
  12903: { format: "<BB20sB23s", type: mavlink20.messages.open_drone_id_self_id, order_map: [0, 1, 2, 3, 4], crc_extra: 249 },
  12904: { format: "<iifffIHHBB20sBBBB", type: mavlink20.messages.open_drone_id_system, order_map: [8, 9, 10, 11, 12, 0, 1, 6, 7, 2, 3, 13, 14, 4, 5], crc_extra: 77 },
  12905: { format: "<BB20sB20s", type: mavlink20.messages.open_drone_id_operator_id, order_map: [0, 1, 2, 3, 4], crc_extra: 49 },
  12918: { format: "<B50s", type: mavlink20.messages.open_drone_id_arm_status, order_map: [0, 1], crc_extra: 139 },
  12915: { format: "<BB20sBB225s", type: mavlink20.messages.open_drone_id_message_pack, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 94 },
  12919: { format: "<iifIBB", type: mavlink20.messages.open_drone_id_system_update, order_map: [4, 5, 0, 1, 2, 3], crc_extra: 7 },
  12920: { format: "<hHB", type: mavlink20.messages.hygrometer_sensor, order_map: [2, 0, 1], crc_extra: 20 },
  53: { format: "<IB", type: mavlink20.messages.mission_checksum, order_map: [1, 0], crc_extra: 3 },
  295: { format: "<ffhBB", type: mavlink20.messages.airspeed, order_map: [3, 0, 2, 1, 4], crc_extra: 234 },
  420: { format: "<IHBBB32h", type: mavlink20.messages.radio_rc_channels, order_map: [2, 3, 0, 1, 4, 5], crc_extra: 20 },
  42e3: { format: "<B", type: mavlink20.messages.icarous_heartbeat, order_map: [0], crc_extra: 227 },
  42001: { format: "<ffffffffffbBBBBB", type: mavlink20.messages.icarous_kinematic_bands, order_map: [10, 11, 0, 1, 12, 2, 3, 13, 4, 5, 14, 6, 7, 15, 8, 9], crc_extra: 239 },
  0: { format: "<IBBBBB", type: mavlink20.messages.heartbeat, order_map: [1, 2, 3, 0, 4, 5], crc_extra: 50 },
  17150: { format: "<4I4HB4s4s", type: mavlink20.messages.array_test_0, order_map: [2, 3, 4, 1, 0], crc_extra: 26 },
  17151: { format: "<4I", type: mavlink20.messages.array_test_1, order_map: [0], crc_extra: 72 },
  17153: { format: "<4IB", type: mavlink20.messages.array_test_3, order_map: [1, 0], crc_extra: 19 },
  17154: { format: "<4IB", type: mavlink20.messages.array_test_4, order_map: [0, 1], crc_extra: 89 },
  17155: { format: "<5s5s", type: mavlink20.messages.array_test_5, order_map: [0, 1], crc_extra: 27 },
  17156: { format: "<2dI2I2i2fH2H2hB2s2s32s", type: mavlink20.messages.array_test_6, order_map: [8, 5, 1, 2, 3, 6, 7, 9, 10, 11, 0, 4], crc_extra: 14 },
  17157: { format: "<2d2f2I2i2H2h2s2s32s", type: mavlink20.messages.array_test_7, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8], crc_extra: 187 },
  17158: { format: "<2dI2H", type: mavlink20.messages.array_test_8, order_map: [1, 0, 2], crc_extra: 106 },
  17e3: { format: "<Qqd3Q3q3dIif3I3i3fHh3H3hc10sBb3s3s", type: mavlink20.messages.test_types, order_map: [16, 17, 18, 12, 6, 0, 19, 13, 7, 1, 8, 2, 20, 14, 9, 3, 21, 15, 10, 4, 11, 5], crc_extra: 103 },
  220: { format: "<Qffffff", type: mavlink20.messages.nav_filter_bias, order_map: [0, 1, 2, 3, 4, 5, 6], crc_extra: 34 },
  221: { format: "<3H3H3H2H5H5H", type: mavlink20.messages.radio_calibration, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 71 },
  222: { format: "<BBB", type: mavlink20.messages.ualberta_sys_status, order_map: [0, 1, 2], crc_extra: 15 },
  10001: { format: "<IH9sBBBBB", type: mavlink20.messages.uavionix_adsb_out_cfg, order_map: [0, 2, 3, 4, 5, 6, 1, 7], crc_extra: 209 },
  10002: { format: "<IiiiiIHHhhhHHBBB", type: mavlink20.messages.uavionix_adsb_out_dynamic, order_map: [0, 1, 2, 3, 13, 14, 4, 5, 6, 7, 8, 9, 10, 15, 11, 12], crc_extra: 186 },
  10003: { format: "<B", type: mavlink20.messages.uavionix_adsb_transceiver_health_report, order_map: [0], crc_extra: 4 },
  10004: { format: "<9s", type: mavlink20.messages.uavionix_adsb_out_cfg_registration, order_map: [0], crc_extra: 133 },
  10005: { format: "<9s", type: mavlink20.messages.uavionix_adsb_out_cfg_flightid, order_map: [0], crc_extra: 103 },
  10006: { format: "<I", type: mavlink20.messages.uavionix_adsb_get, order_map: [0], crc_extra: 193 },
  10007: { format: "<iHBB8sB", type: mavlink20.messages.uavionix_adsb_out_control, order_map: [2, 0, 1, 3, 4, 5], crc_extra: 71 },
  10008: { format: "<HBBBB8s", type: mavlink20.messages.uavionix_adsb_out_status, order_map: [1, 0, 2, 3, 4, 5], crc_extra: 240 },
  10151: { format: "<ffffffIiffffffffffffHHB", type: mavlink20.messages.loweheiser_gov_efi, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 20, 21], crc_extra: 195 },
  60001: { format: "<I4fffffHHBB", type: mavlink20.messages.storm32_gimbal_device_status, order_map: [8, 9, 0, 6, 1, 2, 3, 4, 5, 7], crc_extra: 186 },
  60002: { format: "<4ffffHBB", type: mavlink20.messages.storm32_gimbal_device_control, order_map: [5, 6, 4, 0, 1, 2, 3], crc_extra: 69 },
  60010: { format: "<IIffffffB", type: mavlink20.messages.storm32_gimbal_manager_information, order_map: [8, 0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 208 },
  60011: { format: "<HHBBB", type: mavlink20.messages.storm32_gimbal_manager_status, order_map: [2, 3, 0, 1, 4], crc_extra: 183 },
  60012: { format: "<4ffffHHBBBB", type: mavlink20.messages.storm32_gimbal_manager_control, order_map: [6, 7, 8, 9, 4, 5, 0, 1, 2, 3], crc_extra: 99 },
  60013: { format: "<ffffHHBBBB", type: mavlink20.messages.storm32_gimbal_manager_control_pitchyaw, order_map: [6, 7, 8, 9, 4, 5, 0, 1, 2, 3], crc_extra: 129 },
  60014: { format: "<fBBBB", type: mavlink20.messages.storm32_gimbal_manager_correct_roll, order_map: [1, 2, 3, 4, 0], crc_extra: 134 },
  60015: { format: "<BBBB8sBB8s", type: mavlink20.messages.storm32_gimbal_manager_profile, order_map: [0, 1, 2, 3, 4, 5, 6, 7], crc_extra: 78 },
  60020: { format: "<HH", type: mavlink20.messages.qshot_status, order_map: [0, 1], crc_extra: 202 },
  60025: { format: "<IIBB", type: mavlink20.messages.component_prearm_status, order_map: [2, 3, 0, 1], crc_extra: 20 },
  60050: { format: "<IIIBB", type: mavlink20.messages.avss_prs_sys_status, order_map: [0, 1, 2, 3, 4], crc_extra: 220 },
  60051: { format: "<Iiiiff", type: mavlink20.messages.avss_drone_position, order_map: [0, 1, 2, 3, 4, 5], crc_extra: 245 },
  60052: { format: "<Iffffffffff", type: mavlink20.messages.avss_drone_imu, order_map: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], crc_extra: 101 },
  60053: { format: "<IBB", type: mavlink20.messages.avss_drone_operation_mode, order_map: [0, 1, 2], crc_extra: 45 },
  50001: { format: "<32s", type: mavlink20.messages.cubepilot_raw_rc, order_map: [0], crc_extra: 246 },
  50002: { format: "<fIHHHBB230s", type: mavlink20.messages.herelink_video_stream_information, order_map: [5, 6, 0, 2, 3, 1, 4, 7], crc_extra: 181 },
  50003: { format: "<IIIhhhB", type: mavlink20.messages.herelink_telem, order_map: [6, 3, 0, 1, 2, 4, 5], crc_extra: 62 },
  50004: { format: "<IIBB", type: mavlink20.messages.cubepilot_firmware_update_start, order_map: [2, 3, 0, 1], crc_extra: 240 },
  50005: { format: "<IBB", type: mavlink20.messages.cubepilot_firmware_update_resp, order_map: [1, 2, 0], crc_extra: 152 },
  52e3: { format: "<50s50s", type: mavlink20.messages.airlink_auth, order_map: [0, 1], crc_extra: 13 },
  52001: { format: "<B", type: mavlink20.messages.airlink_auth_response, order_map: [0], crc_extra: 239 }
};
mavlink20.messages.bad_data = function(data, reason) {
  this._id = mavlink20.MAVLINK_MSG_ID_BAD_DATA;
  this._data = data;
  this._reason = reason;
  this._msgbuf = data;
};
mavlink20.messages.bad_data.prototype = new mavlink20.message();
var MAVLinkSigning = function MAVLinkSigning2(object2) {
  this.secret_key = new Buffer2.from([]);
  this.timestamp = 1;
  this.link_id = 0;
  this.sign_outgoing = false;
  this.allow_unsigned_callback = void 0;
  this.stream_timestamps = {};
  this.sig_count = 0;
  this.badsig_count = 0;
  this.goodsig_count = 0;
  this.unsigned_count = 0;
  this.reject_count = 0;
};
var MAVLink20Processor = function(logger, srcSystem, srcComponent) {
  this.logger = logger;
  this.seq = 0;
  this.buf = new Buffer2.from([]);
  this.bufInError = new Buffer2.from([]);
  this.srcSystem = typeof srcSystem === "undefined" ? 0 : srcSystem;
  this.srcComponent = typeof srcComponent === "undefined" ? 0 : srcComponent;
  this.have_prefix_error = false;
  this.protocol_marker = 253;
  this.expected_length = mavlink20.HEADER_LEN;
  this.little_endian = true;
  this.crc_extra = true;
  this.sort_fields = true;
  this.total_packets_sent = 0;
  this.total_bytes_sent = 0;
  this.total_packets_received = 0;
  this.total_bytes_received = 0;
  this.total_receive_errors = 0;
  this.startup_time = Date.now();
  this.signing = new MAVLinkSigning();
};
util_default.inherits(MAVLink20Processor, import_events.default.EventEmitter);
MAVLink20Processor.prototype.log = function(message) {
  if (this.logger) {
    this.logger.info(message);
  }
};
MAVLink20Processor.prototype.log = function(level, message) {
  if (this.logger) {
    this.logger.log(level, message);
  }
};
MAVLink20Processor.prototype.send = function(mavmsg) {
  buf = mavmsg.pack(this);
  this.file.write(buf);
  this.seq = (this.seq + 1) % 256;
  this.total_packets_sent += 1;
  this.total_bytes_sent += buf.length;
};
MAVLink20Processor.prototype.bytes_needed = function() {
  ret = this.expected_length - this.buf.length;
  return ret <= 0 ? 1 : ret;
};
MAVLink20Processor.prototype.pushBuffer = function(data) {
  if (data) {
    this.buf = Buffer2.concat([this.buf, data]);
    this.total_bytes_received += data.length;
  }
};
MAVLink20Processor.prototype.parsePrefix = function() {
  if (this.buf.length >= 1 && this.buf[0] != this.protocol_marker) {
    var badPrefix = this.buf[0];
    this.bufInError = this.buf.slice(0, 1);
    this.buf = this.buf.slice(1);
    this.expected_length = mavlink20.HEADER_LEN;
    throw new Error("Bad prefix (" + badPrefix + ")");
  }
};
MAVLink20Processor.prototype.parseLength = function() {
  if (this.buf.length >= 3) {
    var unpacked = jspack.Unpack("BBB", this.buf.slice(0, 3));
    var magic = unpacked[0];
    this.expected_length = unpacked[1] + mavlink20.HEADER_LEN + 2;
    this.incompat_flags = unpacked[2];
    if (magic == mavlink20.PROTOCOL_MARKER_V2 && this.incompat_flags & mavlink20.MAVLINK_IFLAG_SIGNED) {
      this.expected_length += mavlink20.MAVLINK_SIGNATURE_BLOCK_LEN;
    }
  }
};
MAVLink20Processor.prototype.parseChar = function(c) {
  var m = null;
  try {
    this.pushBuffer(c);
    this.parsePrefix();
    this.parseLength();
    m = this.parsePayload();
  } catch (e) {
    this.log("error", e.message);
    this.total_receive_errors += 1;
    m = new mavlink20.messages.bad_data(this.bufInError, e.message);
    this.bufInError = new Buffer2.from([]);
  }
  if (null != m) {
    this.emit(m._name, m);
    this.emit("message", m);
  }
  return m;
};
MAVLink20Processor.prototype.parsePayload = function() {
  var m = null;
  if (this.expected_length >= mavlink20.HEADER_LEN + 2 && this.buf.length >= this.expected_length) {
    var mbuf = this.buf.slice(0, this.expected_length);
    this.buf = this.buf.slice(this.expected_length);
    this.expected_length = mavlink20.HEADER_LEN;
    try {
      m = this.decode(mbuf);
      this.total_packets_received += 1;
    } catch (e) {
      this.bufInError = mbuf;
      throw e;
    }
  }
  return m;
};
MAVLink20Processor.prototype.parseBuffer = function(s) {
  var m = this.parseChar(s);
  if (null === m) {
    return null;
  }
  var ret2 = [m];
  while (true) {
    m = this.parseChar();
    if (null === m) {
      return ret2;
    }
    ret2.push(m);
  }
};
function toArrayBuffer(buf2) {
  var ab = new ArrayBuffer(buf2.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf2.length; ++i) {
    view[i] = buf2[i];
  }
  return ab;
}
MAVLink20Processor.prototype.check_signature = function(msgbuf, srcSystem, srcComponent) {
  if (Buffer2.isBuffer(msgbuf)) {
    msgbuf = toArrayBuffer(msgbuf);
  }
  var timestamp_buf = msgbuf.slice(-12, -6);
  var link_id = new Buffer2.from(msgbuf.slice(-13, -12));
  link_id = link_id[0];
  var t = jspack.Unpack("<IH", new Buffer2.from(timestamp_buf));
  const [tlow, thigh] = t;
  function shift(number, shift2) {
    return number * Math.pow(2, shift2);
  }
  var thigh_shifted = shift(thigh, 32);
  var timestamp2 = tlow + thigh_shifted;
  stream_key = new Array(link_id, srcSystem, srcComponent).toString();
  if (stream_key in this.signing.stream_timestamps) {
    if (timestamp2 <= this.signing.stream_timestamps[stream_key]) {
      return false;
    }
  } else {
    if (timestamp2 + 6e3 * 1e3 < this.signing.timestamp) {
      return false;
    }
    this.signing.stream_timestamps[stream_key] = timestamp2;
  }
  var crypto = require_crypto();
  var h = crypto.createHash("sha256");
  var sigpart = msgbuf.slice(-6);
  sigpart = new Buffer2.from(sigpart);
  var notsigpart = msgbuf.slice(0, -6);
  notsigpart = new Buffer2.from(notsigpart);
  h.update(this.signing.secret_key);
  h.update(notsigpart);
  var hashDigest = h.digest();
  sig1 = hashDigest.slice(0, 6);
  if (Buffer2.compare(sig1, sigpart)) {
    return false;
  }
  this.signing.timestamp = Math.max(this.signing.timestamp, timestamp2);
  return true;
};
MAVLink20Processor.prototype.decode = function(msgbuf) {
  var magic, incompat_flags, compat_flags, mlen, seq, srcSystem, srcComponent, unpacked, msgId, signature_len;
  try {
    unpacked = jspack.Unpack("cBBBBBBHB", msgbuf.slice(0, 10));
    magic = unpacked[0];
    mlen = unpacked[1];
    incompat_flags = unpacked[2];
    compat_flags = unpacked[3];
    seq = unpacked[4];
    srcSystem = unpacked[5];
    srcComponent = unpacked[6];
    var msgIDlow = (unpacked[7] & 255) << 8 | unpacked[7] >> 8 & 255;
    var msgIDhigh = unpacked[8];
    msgId = msgIDlow | msgIDhigh << 16;
  } catch (e) {
    throw new Error("Unable to unpack MAVLink header: " + e.message);
  }
  if (magic == mavlink20.PROTOCOL_MARKER_V1) {
    seq1 = incompat_flags;
    srcSystem1 = compat_flags;
    srcComponent1 = seq;
    msgId1 = srcSystem;
    seq = seq1;
    srcSystem = srcSystem1;
    srcComponent = srcComponent1;
    msgId = msgId1;
    incompat_flags = 0;
    compat_flags = 0;
    signature_len = 0;
    return;
  }
  if (magic.charCodeAt(0) != this.protocol_marker) {
    throw new Error("Invalid MAVLink prefix (" + magic.charCodeAt(0) + ")");
  }
  if (incompat_flags & mavlink20.MAVLINK_IFLAG_SIGNED) {
    signature_len = mavlink20.MAVLINK_SIGNATURE_BLOCK_LEN;
  } else {
    signature_len = 0;
  }
  var actual_len = msgbuf.length - (mavlink20.HEADER_LEN + 2 + signature_len);
  var actual_len_nosign = msgbuf.length - (mavlink20.HEADER_LEN + 2);
  if (mlen == actual_len && signature_len > 0) {
    var len_if_signed = mlen + signature_len;
  } else if (mlen == actual_len_nosign && signature_len > 0) {
    var len_if_signed = mlen + signature_len;
    throw new Error("Packet appears unsigned when labeled as signed. Got actual_len " + actual_len_nosign + " expected " + len_if_signed + ", msgId=" + msgId);
  } else if (mlen != actual_len) {
    throw new Error("Invalid MAVLink message length.  Got " + (msgbuf.length - (mavlink20.HEADER_LEN + 2)) + " expected " + mlen + ", msgId=" + msgId);
  }
  if (false === index_default_default.has(mavlink20.map, msgId)) {
    throw new Error("Unknown MAVLink message ID (" + msgId + ")");
  }
  var headerBuf = msgbuf.slice(mavlink20.HEADER_LEN);
  var sigBuf = msgbuf.slice(-signature_len);
  var crcBuf1 = msgbuf.slice(-2);
  var crcBuf2 = msgbuf.slice(-15, -13);
  var payloadBuf = msgbuf.slice(mavlink20.HEADER_LEN, -(signature_len + 2));
  var crcCheckBuf = msgbuf.slice(1, -(signature_len + 2));
  var decoder = mavlink20.map[msgId];
  var receivedChecksum = void 0;
  if (signature_len == 0) {
    try {
      receivedChecksum = jspack.Unpack("<H", crcBuf1);
    } catch (e) {
      throw new Error("Unable to unpack MAVLink unsigned CRC: " + e.message);
    }
  } else {
    try {
      receivedChecksum = jspack.Unpack("<H", crcBuf2);
    } catch (e) {
      throw new Error("Unable to unpack MAVLink signed CRC: " + e.message);
    }
  }
  receivedChecksum = receivedChecksum[0];
  var messageChecksum = mavlink20.x25Crc(crcCheckBuf);
  var messageChecksum2 = mavlink20.x25Crc([decoder.crc_extra], messageChecksum);
  if (receivedChecksum != messageChecksum2) {
    throw new Error("invalid MAVLink CRC in msgID " + msgId + ", got 0x" + receivedChecksum + " checksum, calculated payload checksum as 0x" + messageChecksum2);
  }
  var sig_ok = false;
  if (signature_len == mavlink20.MAVLINK_SIGNATURE_BLOCK_LEN) {
    this.signing.sig_count += 1;
  }
  if (this.signing.secret_key.length != 0) {
    var accept_signature = false;
    if (signature_len == mavlink20.MAVLINK_SIGNATURE_BLOCK_LEN) {
      sig_ok = this.check_signature(msgbuf, srcSystem, srcComponent);
      accept_signature = sig_ok;
      if (sig_ok) {
        this.signing.goodsig_count += 1;
      } else {
        this.signing.badsig_count += 1;
      }
      if (!accept_signature && this.signing.allow_unsigned_callback != void 0) {
        accept_signature = this.signing.allow_unsigned_callback(this, msgId);
        if (accept_signature) {
          this.signing.unsigned_count += 1;
        } else {
          this.signing.reject_count += 1;
        }
      }
    } else if (this.signing.allow_unsigned_callback != void 0) {
      accept_signature = this.signing.allow_unsigned_callback(this, msgId);
      if (accept_signature) {
        this.signing.unsigned_count += 1;
      } else {
        this.signing.reject_count += 1;
      }
    }
    if (!accept_signature) throw new Error("Invalid signature");
  }
  var paylen = jspack.CalcLength(decoder.format);
  if (paylen > payloadBuf.length) {
    payloadBuf = Buffer2.concat([payloadBuf, Buffer2.alloc(paylen - payloadBuf.length)]);
  }
  try {
    var t = jspack.Unpack(decoder.format, payloadBuf);
  } catch (e) {
    throw new Error("Unable to unpack MAVLink payload type=" + decoder.type + " format=" + decoder.format + " payloadLength=" + payloadBuf + ": " + e.message);
  }
  var args = {};
  const elementsInMsg = decoder.order_map.length;
  const actualElementsInMsg = JSON.parse(JSON.stringify(t)).length;
  if (elementsInMsg == actualElementsInMsg) {
    index_default_default.each(t, function(e, i2, l) {
      args[i2] = t[decoder.order_map[i2]];
    });
  } else {
    var typeIndex = 1;
    var orderIndex = 0;
    var memberIndex = 0;
    var tempArgs = {};
    for (var i = 0, size2 = decoder.format.length - 1; i <= size2; ++i) {
      var order = decoder.order_map[orderIndex];
      var currentType = decoder.format[typeIndex];
      if (isNaN(parseInt(currentType))) {
        tempArgs[orderIndex] = t[memberIndex];
        memberIndex++;
      } else {
        var arraySize = "";
        var newArray = [];
        while (!isNaN(decoder.format[typeIndex])) {
          arraySize = arraySize + decoder.format[typeIndex];
          typeIndex++;
        }
        for (var j = 0, size2 = parseInt(arraySize); j < size2; ++j) {
          newArray.push(t[j + orderIndex]);
          memberIndex++;
        }
        arraySize = arraySize + decoder.format[typeIndex];
        currentType = arraySize;
        tempArgs[orderIndex] = newArray;
      }
      orderIndex++;
      typeIndex++;
    }
    index_default_default.each(t, function(e, i2, l) {
      args[i2] = tempArgs[decoder.order_map[i2]];
    });
  }
  try {
    var m = new decoder.type();
    m.set(args, false);
  } catch (e) {
    throw new Error("Unable to instantiate MAVLink message of type " + decoder.type + " : " + e.message);
  }
  m._signed = sig_ok;
  if (m._signed) {
    m._link_id = msgbuf[-13];
  }
  m._msgbuf = msgbuf;
  m._payload = payloadBuf;
  m.crc = receivedChecksum;
  m._header = new mavlink20.header(msgId, mlen, seq, srcSystem, srcComponent, incompat_flags, compat_flags);
  this.log(m);
  return m;
};
export {
  Buffer2 as Buffer,
  MAVLink20Processor,
  mavlink20
};
//# sourceMappingURL=mavlink-browser.js.map
