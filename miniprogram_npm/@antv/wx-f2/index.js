(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var dom = createCommonjsModule(function (module) {
	let DomUtil;
	/**
	 * Detects support for options object argument in addEventListener.
	 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
	 * @private
	 */
	const supportsEventListenerOptions = (function() {
	  let supports = false;
	  try {
	    const options = Object.defineProperty({}, 'passive', {
	      get() {
	        supports = true;
	      }
	    });
	    window.addEventListener('e', null, options);
	  } catch (e) {
	    // continue regardless of error
	  }
	  return supports;
	}());

	// Default passive to true as expected by Chrome for 'touchstart' and 'touchend' events.
	// https://github.com/chartjs/Chart.js/issues/4287
	const eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;

	function createEvent(type, chart, x, y, nativeEvent) {
	  return {
	    type,
	    chart,
	    native: nativeEvent || null,
	    x: x !== undefined ? x : null,
	    y: y !== undefined ? y : null
	  };
	}

	function fromNativeEvent(event, chart) {
	  const type = event.type;
	  let clientPoint;
	  // 说明是touch相关事件
	  if (event.touches) {
	    // https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/changedTouches
	    // 这里直接拿changedTouches就可以了，不管是touchstart, touchmove, touchend changedTouches 都是有的
	    // 为了以防万一，做个空判断
	    const touch = event.changedTouches[0] || {};
	    // x, y: 相对canvas原点的位置，clientX, clientY 相对于可视窗口的位置
	    const { x, y, clientX, clientY } = touch;
	    // 小程序环境会有x,y，这里就直接返回
	    if (x && y) {
	      return createEvent(type, chart, x, y, event);
	    }
	    clientPoint = { x: clientX, y: clientY };
	  } else {
	    // mouse相关事件
	    clientPoint = { x: event.clientX, y: event.clientY };
	  }
	  // 理论上应该是只有有在浏览器环境才会走到这里
	  const canvas = chart.get('canvas');
	  // 通过clientX, clientY 计算x, y
	  const point = DomUtil.getRelativePosition(clientPoint, canvas);
	  return createEvent(type, chart, point.x, point.y, event);
	}

	DomUtil = {
	  /* global wx, my */
	  isWx: (typeof wx === 'object') && (typeof wx.getSystemInfoSync === 'function'), // weixin miniprogram
	  isMy: (typeof my === 'object') && (typeof my.getSystemInfoSync === 'function'), // ant miniprogram
	  isNode:  ('object' !== 'undefined'), // in node
	  isBrowser: (typeof window !== 'undefined') && (typeof window.document !== 'undefined') && (typeof window.sessionStorage !== 'undefined'), // in browser
	  isCanvasElement(el) {
	    if (!el || typeof el !== 'object') return false;
	    if (el.nodeType === 1 && el.nodeName) {
	      // HTMLCanvasElement
	      return true;
	    }
	    // CanvasElement
	    return !!el.isCanvasElement;
	  },
	  getPixelRatio() {
	    return window && window.devicePixelRatio || 1;
	  },
	  getStyle(el, property) {
	    return el.currentStyle ?
	      el.currentStyle[property] :
	      document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
	  },
	  getWidth(el) {
	    let width = this.getStyle(el, 'width');
	    if (width === 'auto') {
	      width = el.offsetWidth;
	    }
	    return parseFloat(width);
	  },
	  getHeight(el) {
	    let height = this.getStyle(el, 'height');
	    if (height === 'auto') {
	      height = el.offsetHeight;
	    }
	    return parseFloat(height);
	  },
	  getDomById(id) {
	    if (!id) {
	      return null;
	    }
	    return document.getElementById(id);
	  },
	  getRelativePosition(point, canvas) {
	    const canvasDom = canvas.get('el');
	    const { top, right, bottom, left } = canvasDom.getBoundingClientRect();

	    const paddingLeft = parseFloat(this.getStyle(canvasDom, 'padding-left'));
	    const paddingTop = parseFloat(this.getStyle(canvasDom, 'padding-top'));
	    const paddingRight = parseFloat(this.getStyle(canvasDom, 'padding-right'));
	    const paddingBottom = parseFloat(this.getStyle(canvasDom, 'padding-bottom'));
	    const width = right - left - paddingLeft - paddingRight;
	    const height = bottom - top - paddingTop - paddingBottom;
	    const pixelRatio = canvas.get('pixelRatio');

	    const mouseX = (point.x - left - paddingLeft) / (width) * canvasDom.width / pixelRatio;
	    const mouseY = (point.y - top - paddingTop) / (height) * canvasDom.height / pixelRatio;

	    return {
	      x: mouseX,
	      y: mouseY
	    };
	  },
	  addEventListener(source, type, listener) {
	    source.addEventListener(type, listener, eventListenerOptions);
	  },
	  removeEventListener(source, type, listener) {
	    source.removeEventListener(type, listener, eventListenerOptions);
	  },
	  createEvent(event, chart) {
	    return fromNativeEvent(event, chart);
	  },
	  measureText(text, font, ctx) {
	    if (!ctx) {
	      ctx = document.createElement('canvas').getContext('2d');
	    }

	    ctx.font = font || '12px sans-serif';
	    return ctx.measureText(text);
	  }
	};

	module.exports = DomUtil;
	});

	// isFinite,
	var isNil = function isNil(value) {
	  /**
	   * isNil(null) => true
	   * isNil() => true
	   */
	  return value === null || value === undefined;
	};

	var isNil_1 = isNil;

	function toString(value) {
	  if (isNil_1(value)) return '';
	  return value.toString();
	}

	var toString_1 = toString;

	var upperFirst = function upperFirst(value) {
	  var str = toString_1(value);
	  return str.charAt(0).toUpperCase() + str.substring(1);
	};

	var upperFirst_1 = upperFirst;

	var lowerFirst = function lowerFirst(value) {
	  var str = toString_1(value);
	  return str.charAt(0).toLowerCase() + str.substring(1);
	};

	var lowerFirst_1 = lowerFirst;

	var toString$1 = {}.toString;
	var isType = function isType(value, type) {
	  return toString$1.call(value) === '[object ' + type + ']';
	};

	var isType_1 = isType;

	var isString = function isString(str) {
	  return isType_1(str, 'String');
	};

	var isString_1 = isString;

	/**
	 * 判断是否数字
	 * @return {Boolean} 是否数字
	 */


	var isNumber = function isNumber(value) {
	  return isType_1(value, 'Number');
	};
	var isNumber_1 = isNumber;

	/**
	 * 是否是布尔类型
	 *
	 * @param {Object} value 测试的值
	 * @return {Boolean}
	 */


	var isBoolean = function isBoolean(value) {
	  return isType_1(value, 'Boolean');
	};

	var isBoolean_1 = isBoolean;

	/**
	 * 是否为函数
	 * @param  {*} fn 对象
	 * @return {Boolean}  是否函数
	 */


	var isFunction = function isFunction(value) {
	  return isType_1(value, 'Function');
	};

	var isFunction_1 = isFunction;

	var isDate = function isDate(value) {
	  return isType_1(value, 'Date');
	};

	var isDate_1 = isDate;

	var isArray = Array.isArray ? Array.isArray : function (value) {
	  return isType_1(value, 'Array');
	};

	var isArray_1 = isArray;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isObject = function isObject(value) {
	  /**
	   * isObject({}) => true
	   * isObject([1, 2, 3]) => true
	   * isObject(Function) => true
	   * isObject(null) => false
	   */
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return value !== null && type === 'object' || type === 'function';
	};

	var isObject_1 = isObject;

	var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isObjectLike = function isObjectLike(value) {
	  /**
	   * isObjectLike({}) => true
	   * isObjectLike([1, 2, 3]) => true
	   * isObjectLike(Function) => false
	   * isObjectLike(null) => false
	   */
	  return (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) === 'object' && value !== null;
	};

	var isObjectLike_1 = isObjectLike;

	var isPlainObject = function isPlainObject(value) {
	  /**
	   * isObjectLike(new Foo) => false
	   * isObjectLike([1, 2, 3]) => false
	   * isObjectLike({ x: 0, y: 0 }) => true
	   * isObjectLike(Object.create(null)) => true
	   */
	  if (!isObjectLike_1(value) || !isType_1(value, 'Object')) {
	    return false;
	  }
	  if (Object.getPrototypeOf(value) === null) {
	    return true;
	  }
	  var proto = value;
	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }
	  return Object.getPrototypeOf(value) === proto;
	};

	var isPlainObject_1 = isPlainObject;

	var MAX_MIX_LEVEL = 5;

	function _deepMix(dist, src, level, maxLevel) {
	  level = level || 0;
	  maxLevel = maxLevel || MAX_MIX_LEVEL;
	  for (var key in src) {
	    if (src.hasOwnProperty(key)) {
	      var value = src[key];
	      if (value !== null && isPlainObject_1(value)) {
	        if (!isPlainObject_1(dist[key])) {
	          dist[key] = {};
	        }
	        if (level < maxLevel) {
	          _deepMix(dist[key], value, level + 1, maxLevel);
	        } else {
	          dist[key] = src[key];
	        }
	      } else if (isArray_1(value)) {
	        dist[key] = [];
	        dist[key] = dist[key].concat(value);
	      } else if (value !== undefined) {
	        dist[key] = value;
	      }
	    }
	  }
	}

	var deepMix = function deepMix() {
	  var args = new Array(arguments.length);
	  var length = args.length;
	  for (var i = 0; i < length; i++) {
	    args[i] = arguments[i];
	  }
	  var rst = args[0];
	  for (var _i = 1; _i < length; _i++) {
	    _deepMix(rst, args[_i]);
	  }
	  return rst;
	};

	var deepMix_1 = deepMix;

	function _mix(dist, obj) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
	      dist[key] = obj[key];
	    }
	  }
	}

	var mix = function mix(dist, src1, src2, src3) {
	  if (src1) _mix(dist, src1);
	  if (src2) _mix(dist, src2);
	  if (src3) _mix(dist, src3);
	  return dist;
	};

	var mix_1 = mix;

	var each = function each(elements, func) {
	  if (!elements) {
	    return;
	  }
	  var rst = void 0;
	  if (isArray_1(elements)) {
	    for (var i = 0, len = elements.length; i < len; i++) {
	      rst = func(elements[i], i);
	      if (rst === false) {
	        break;
	      }
	    }
	  } else if (isObject_1(elements)) {
	    for (var k in elements) {
	      if (elements.hasOwnProperty(k)) {
	        rst = func(elements[k], k);
	        if (rst === false) {
	          break;
	        }
	      }
	    }
	  }
	};

	var each_1 = each;

	var isArrayLike = function isArrayLike(value) {
	  /**
	   * isArrayLike([1, 2, 3]) => true
	   * isArrayLike(document.body.children) => true
	   * isArrayLike('abc') => true
	   * isArrayLike(Function) => false
	   */
	  return value !== null && typeof value !== 'function' && isFinite(value.length);
	};

	var isArrayLike_1 = isArrayLike;

	var indexOf = Array.prototype.indexOf;

	var contains = function contains(arr, value) {
	  if (!isArrayLike_1(arr)) {
	    return false;
	  }
	  return indexOf.call(arr, value) > -1;
	};

	var contains_1 = contains;

	var uniq = function uniq(arr) {
	  var resultArr = [];
	  each_1(arr, function (item) {
	    if (!contains_1(resultArr, item)) {
	      resultArr.push(item);
	    }
	  });
	  return resultArr;
	};

	var uniq_1 = uniq;

	/**
	 * @fileOverview Utility for F2
	 * @author dxq613 @gmail.com
	 * @author sima.zhang1990@gmail.com
	 */

	const Util = {
	  upperFirst: upperFirst_1,
	  lowerFirst: lowerFirst_1,
	  isString: isString_1,
	  isNumber: isNumber_1,
	  isBoolean: isBoolean_1,
	  isFunction: isFunction_1,
	  isDate: isDate_1,
	  isArray: isArray_1,
	  isNil: isNil_1,
	  isObject: isObject_1,
	  isPlainObject: isPlainObject_1,
	  deepMix: deepMix_1,
	  mix: mix_1,
	  each: each_1,
	  uniq: uniq_1,
	  isObjectValueEqual(a, b) {
	    // for vue.js
	    a = Object.assign({}, a);
	    b = Object.assign({}, b);
	    const aProps = Object.getOwnPropertyNames(a);
	    const bProps = Object.getOwnPropertyNames(b);

	    if (aProps.length !== bProps.length) {
	      return false;
	    }

	    for (let i = 0, len = aProps.length; i < len; i++) {
	      const propName = aProps[i];

	      if (a[propName] !== b[propName]) {
	        return false;
	      }
	    }
	    return true;
	  },
	  wrapBehavior(obj, action) {
	    if (obj['_wrap_' + action]) {
	      return obj['_wrap_' + action];
	    }
	    const method = e => {
	      obj[action](e);
	    };
	    obj['_wrap_' + action] = method;
	    return method;
	  },
	  getWrapBehavior(obj, action) {
	    return obj['_wrap_' + action];
	  },
	  parsePadding(padding) {
	    let top;
	    let right;
	    let bottom;
	    let left;

	    if (Util.isNumber(padding) || Util.isString(padding)) {
	      top = bottom = left = right = padding;
	    } else if (Util.isArray(padding)) {
	      top = padding[0];
	      right = !Util.isNil(padding[1]) ? padding[1] : padding[0];
	      bottom = !Util.isNil(padding[2]) ? padding[2] : padding[0];
	      left = !Util.isNil(padding[3]) ? padding[3] : right;
	    }

	    return [ top, right, bottom, left ];
	  },
	  directionEnabled(mode, dir) {
	    if (mode === undefined) {
	      return true;
	    } else if (typeof mode === 'string') {
	      return mode.indexOf(dir) !== -1;
	    }

	    return false;
	  }
	};

	Util.Array = {
	  merge(dataArray) {
	    let rst = [];
	    for (let i = 0, len = dataArray.length; i < len; i++) {
	      rst = rst.concat(dataArray[i]);
	    }
	    return rst;
	  },
	  values(data, name) {
	    const rst = [];
	    const tmpMap = {};
	    for (let i = 0, len = data.length; i < len; i++) {
	      const obj = data[i];
	      const value = obj[name];
	      if (!Util.isNil(value)) {
	        if (!Util.isArray(value)) {
	          if (!tmpMap[value]) {
	            rst.push(value);
	            tmpMap[value] = true;
	          }
	        } else {
	          Util.each(value, val => {
	            if (!tmpMap[val]) {
	              rst.push(val);
	              tmpMap[val] = true;
	            }
	          });
	        }
	      }
	    }
	    return rst;
	  },
	  firstValue(data, name) {
	    let rst = null;
	    for (let i = 0, len = data.length; i < len; i++) {
	      const obj = data[i];
	      const value = obj[name];
	      if (!Util.isNil(value)) {
	        if (Util.isArray(value)) {
	          rst = value[0];
	        } else {
	          rst = value;
	        }
	        break;
	      }
	    }
	    return rst;
	  },
	  group(data, fields, appendConditions = {}) {
	    if (!fields) {
	      return [ data ];
	    }
	    const groups = Util.Array.groupToMap(data, fields);
	    const array = [];
	    if (fields.length === 1 && appendConditions[fields[0]]) {
	      const values = appendConditions[fields[0]];
	      Util.each(values, value => {
	        value = '_' + value;
	        array.push(groups[value]);
	      });
	    } else {
	      for (const i in groups) {
	        array.push(groups[i]);
	      }
	    }

	    return array;
	  },
	  groupToMap(data, fields) {
	    if (!fields) {
	      return {
	        0: data
	      };
	    }

	    const callback = function(row) {
	      let unique = '_';
	      for (let i = 0, l = fields.length; i < l; i++) {
	        unique += row[fields[i]] && row[fields[i]].toString();
	      }
	      return unique;
	    };

	    const groups = {};
	    for (let i = 0, len = data.length; i < len; i++) {
	      const row = data[i];
	      const key = callback(row);
	      if (groups[key]) {
	        groups[key].push(row);
	      } else {
	        groups[key] = [ row ];
	      }
	    }

	    return groups;
	  },
	  remove(arr, obj) {
	    if (!arr) {
	      return;
	    }
	    const index = arr.indexOf(obj);
	    if (index !== -1) {
	      arr.splice(index, 1);
	    }
	  },
	  getRange(values) {
	    if (!values.length) {
	      return {
	        min: 0,
	        max: 0
	      };
	    }
	    const max = Math.max.apply(null, values);
	    const min = Math.min.apply(null, values);
	    return {
	      min,
	      max
	    };
	  }
	};

	Util.mix(Util, dom);

	var common = Util;

	/**
	 * @fileOverview default theme
	 * @author dxq613@gail.com
	 */

	const color1 = '#E8E8E8'; // color of axis-line and axis-grid
	const color2 = '#808080'; // color of axis label

	const defaultAxis = {
	  label: {
	    fill: color2,
	    fontSize: 10
	  },
	  line: {
	    stroke: color1,
	    lineWidth: 1
	  },
	  grid: {
	    type: 'line',
	    stroke: color1,
	    lineWidth: 1,
	    lineDash: [ 2 ]
	  },
	  tickLine: null,
	  labelOffset: 7.5
	};

	const Theme = {
	  fontFamily: '"Helvetica Neue", "San Francisco", Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", sans-serif',
	  defaultColor: '#1890FF',
	  pixelRatio: 1,
	  padding: 'auto',
	  appendPadding: 15,
	  colors: [
	    '#1890FF',
	    '#2FC25B',
	    '#FACC14',
	    '#223273',
	    '#8543E0',
	    '#13C2C2',
	    '#3436C7',
	    '#F04864'
	  ],
	  shapes: {
	    line: [ 'line', 'dash' ],
	    point: [ 'circle', 'hollowCircle' ]
	  },
	  sizes: [ 4, 10 ],
	  axis: {
	    common: defaultAxis, // common axis configuration
	    bottom: common.mix({}, defaultAxis, {
	      grid: null
	    }),
	    left: common.mix({}, defaultAxis, {
	      line: null
	    }),
	    right: common.mix({}, defaultAxis, {
	      line: null
	    }),
	    circle: common.mix({}, defaultAxis, {
	      line: null
	    }),
	    radius: common.mix({}, defaultAxis, {
	      labelOffset: 4
	    })
	  },
	  shape: {
	    line: {
	      lineWidth: 2,
	      lineJoin: 'round',
	      lineCap: 'round'
	    },
	    point: {
	      lineWidth: 0,
	      size: 3
	    },
	    area: {
	      fillOpacity: 0.1
	    }
	  },
	  _defaultAxis: defaultAxis
	};

	var theme = Theme;

	const Global = {
	  version: '3.5.0',
	  scales: {},
	  widthRatio: {
	    column: 1 / 2,
	    rose: 0.999999,
	    multiplePie: 3 / 4
	  },
	  lineDash: [ 4, 4 ]
	};

	Global.setTheme = function(theme) {
	  common.deepMix(this, theme);
	};

	Global.setTheme(theme);
	var global$1 = Global;

	/**
	 * @fileOverview Base class of chart and geometry
	 * @author dxq613@gmail.com
	 */



	class Base {

	  getDefaultCfg() {
	    return {};
	  }

	  constructor(cfg) {
	    const attrs = {};
	    const defaultCfg = this.getDefaultCfg();
	    this._attrs = attrs;
	    common.mix(attrs, defaultCfg, cfg);
	  }

	  get(name) {
	    return this._attrs[name];
	  }

	  set(name, value) {
	    this._attrs[name] = value;
	  }

	  destroy() {
	    this._attrs = {};
	    this.destroyed = true;
	  }

	}

	var base = Base;

	class Plot {
	  constructor(cfg) {
	    common.mix(this, cfg);
	    this._init();
	  }

	  _init() {
	    const self = this;
	    const start = self.start;
	    const end = self.end;
	    const xMin = Math.min(start.x, end.x);
	    const xMax = Math.max(start.x, end.x);
	    const yMin = Math.min(start.y, end.y);
	    const yMax = Math.max(start.y, end.y);

	    this.tl = {
	      x: xMin,
	      y: yMin
	    };
	    this.tr = {
	      x: xMax,
	      y: yMin
	    };
	    this.bl = {
	      x: xMin,
	      y: yMax
	    };
	    this.br = {
	      x: xMax,
	      y: yMax
	    };
	    this.width = xMax - xMin;
	    this.height = yMax - yMin;
	  }

	  /**
	   * reset
	   * @param  {Object} start start point
	   * @param  {Object} end end point
	   */
	  reset(start, end) {
	    this.start = start;
	    this.end = end;
	    this._init();
	  }

	  /**
	   * check the point is in the range of plot
	   * @param  {Nubmer}  x x value
	   * @param  {[type]}  y y value
	   * @return {Boolean} return the result
	   */
	  isInRange(x, y) {
	    if (common.isObject(x)) {
	      y = x.y;
	      x = x.x;
	    }
	    const tl = this.tl;
	    const br = this.br;
	    return tl.x <= x && x <= br.x && tl.y <= y && y <= br.y;
	  }
	}

	var plot = Plot;

	const Matrix = {
	  multiply(m1, m2) {
	    const m11 = m1[0] * m2[0] + m1[2] * m2[1];
	    const m12 = m1[1] * m2[0] + m1[3] * m2[1];

	    const m21 = m1[0] * m2[2] + m1[2] * m2[3];
	    const m22 = m1[1] * m2[2] + m1[3] * m2[3];

	    const dx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	    const dy = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];

	    return [ m11, m12, m21, m22, dx, dy ];
	  },
	  scale(out, m, v) {
	    out[0] = m[0] * v[0];
	    out[1] = m[1] * v[0];
	    out[2] = m[2] * v[1];
	    out[3] = m[3] * v[1];
	    out[4] = m[4];
	    out[5] = m[5];

	    return out;
	  },
	  rotate(out, m, radian) {
	    const c = Math.cos(radian);
	    const s = Math.sin(radian);
	    const m11 = m[0] * c + m[2] * s;
	    const m12 = m[1] * c + m[3] * s;
	    const m21 = m[0] * -s + m[2] * c;
	    const m22 = m[1] * -s + m[3] * c;
	    out[0] = m11;
	    out[1] = m12;
	    out[2] = m21;
	    out[3] = m22;
	    out[4] = m[4];
	    out[5] = m[5];

	    return out;
	  },
	  translate(out, m, v) {
	    out[0] = m[0];
	    out[1] = m[1];
	    out[2] = m[2];
	    out[3] = m[3];
	    out[4] = m[4] + m[0] * v[0] + m[2] * v[1];
	    out[5] = m[5] + m[1] * v[0] + m[3] * v[1];
	    return out;
	  },
	  transform(m, actions) {
	    const out = [].concat(m);
	    for (let i = 0, len = actions.length; i < len; i++) {
	      const action = actions[i];
	      switch (action[0]) {
	        case 't':
	          Matrix.translate(out, out, [ action[1], action[2] ]);
	          break;
	        case 's':
	          Matrix.scale(out, out, [ action[1], action[2] ]);
	          break;
	        case 'r':
	          Matrix.rotate(out, out, action[1]);
	          break;
	      }
	    }

	    return out;
	  }
	};

	var matrix = Matrix;

	/**
	 * 2 Dimensional Vector
	 * @module vector2
	 */
	var vector2 = {
	  /**
	   * Creates a new, empty vector2
	   *
	   * @return {vector2} a new 2D vector
	   */
	  create() {
	    return [ 0, 0 ];
	  },
	  /**
	   * Calculates the length of a vector2
	   *
	   * @param {vector2} v vector to calculate length of
	   * @return {Number} length of v
	   */
	  length(v) {
	    const x = v[0];
	    const y = v[1];
	    return Math.sqrt(x * x + y * y);
	  },
	  /**
	   * Normalize a vector2
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v vector to normalize
	   * @return {vector2} out
	   */
	  normalize(out, v) {
	    const len = this.length(v);
	    if (len === 0) {
	      out[0] = 0;
	      out[1] = 0;
	    } else {
	      out[0] = v[0] / len;
	      out[1] = v[1] / len;
	    }

	    return out;
	  },
	  /**
	   * Adds two vector2's
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {vector2} out
	   */
	  add(out, v1, v2) {
	    out[0] = v1[0] + v2[0];
	    out[1] = v1[1] + v2[1];
	    return out;
	  },
	  /**
	   * Subtracts vector v2 from vector v1
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {vector2} out
	   */
	  sub(out, v1, v2) {
	    out[0] = v1[0] - v2[0];
	    out[1] = v1[1] - v2[1];
	    return out;
	  },
	  /**
	   * Scales a vector2 by a scalar number
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v the vector to scale
	   * @param {Number} s amount to scale the vector by
	   * @return {vector2} out
	   */
	  scale(out, v, s) {
	    out[0] = v[0] * s;
	    out[1] = v[1] * s;
	    return out;
	  },
	  /**
	   * Calculates the dot product of two vector2's
	   *
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {Number} dot product of v1 and v2
	   */
	  dot(v1, v2) {
	    return v1[0] * v2[0] + v1[1] * v2[1];
	  },
	  /**
	   * Calculates the direction of two vector2's
	   *
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {Boolean} the direction of v1 and v2
	   */
	  direction(v1, v2) {
	    return v1[0] * v2[1] - v2[0] * v1[1];
	  },
	  /**
	   * Calculates the angle of two vector2's
	   *
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {Number} angle of v1 and v2
	   */
	  angle(v1, v2) {
	    const theta = this.dot(v1, v2) / (this.length(v1) * this.length(v2));
	    return Math.acos(theta);
	  },
	  /**
	   * Calculates the angle of two vector2's with direction
	   *
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @param {Boolean} direction the direction of two vector2's
	   * @return {Number} angle of v1 and v2
	   */
	  angleTo(v1, v2, direction) {
	    const angle = this.angle(v1, v2);
	    const angleLargeThanPI = this.direction(v1, v2) >= 0;
	    if (direction) {
	      if (angleLargeThanPI) {
	        return Math.PI * 2 - angle;
	      }

	      return angle;
	    }

	    if (angleLargeThanPI) {
	      return angle;
	    }
	    return Math.PI * 2 - angle;
	  },
	  /**
	   * whether a vector2 is zero vector
	   *
	   * @param  {vector2} v vector to calculate
	   * @return {Boolean}   is or not a zero vector
	   */
	  zero(v) {
	    return v[0] === 0 && v[1] === 0;
	  },
	  /**
	   * Calculates the euclidian distance between two vector2's
	   *
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {Number} distance between a and b
	   */
	  distance(v1, v2) {
	    const x = v2[0] - v1[0];
	    const y = v2[1] - v1[1];
	    return Math.sqrt(x * x + y * y);
	  },
	  /**
	   * Creates a new vector2 initialized with values from an existing vector
	   *
	   * @param {vector2} v vector to clone
	   * @return {Array} a new 2D vector
	   */
	  clone(v) {
	    return [ v[0], v[1] ];
	  },
	  /**
	   * Return the minimum of two vector2's
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {vector2} out
	   */
	  min(out, v1, v2) {
	    out[0] = Math.min(v1[0], v2[0]);
	    out[1] = Math.min(v1[1], v2[1]);
	    return out;
	  },
	  /**
	   * Return the maximum of two vector2's
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v1 the first operand
	   * @param {vector2} v2 the second operand
	   * @return {vector2} out
	   */
	  max(out, v1, v2) {
	    out[0] = Math.max(v1[0], v2[0]);
	    out[1] = Math.max(v1[1], v2[1]);
	    return out;
	  },
	  /**
	   * Transforms the vector2 with a mat2d
	   *
	   * @param {vector2} out the receiving vector
	   * @param {vector2} v the vector to transform
	   * @param {mat2d} m matrix to transform with
	   * @return {vector2} out
	   */
	  transformMat2d(out, v, m) {
	    const x = v[0];
	    const y = v[1];
	    out[0] = m[0] * x + m[2] * y + m[4];
	    out[1] = m[1] * x + m[3] * y + m[5];
	    return out;
	  }
	};

	const defaultMatrix = [ 1, 0, 0, 1, 0, 0 ];

	class Base$1 {
	  _initDefaultCfg() {}

	  constructor(cfg) {
	    this._initDefaultCfg();
	    common.mix(this, cfg);

	    let start;
	    let end;
	    if (this.plot) {
	      start = this.plot.bl;
	      end = this.plot.tr;
	      this.start = start;
	      this.end = end;
	    } else {
	      start = this.start;
	      end = this.end;
	    }
	    this.init(start, end);
	  }

	  _scale(s1, s2) {
	    const matrix$1 = this.matrix;
	    const center = this.center;
	    matrix.translate(matrix$1, matrix$1, [ center.x, center.y ]);
	    matrix.scale(matrix$1, matrix$1, [ s1, s2 ]);
	    matrix.translate(matrix$1, matrix$1, [ -center.x, -center.y ]);
	  }

	  init(start, end) {
	    this.matrix = [].concat(defaultMatrix);
	    // 设置中心点
	    this.center = {
	      x: ((end.x - start.x) / 2) + start.x,
	      y: (end.y - start.y) / 2 + start.y
	    };
	    if (this.scale) {
	      this._scale(this.scale[0], this.scale[1]);
	    }
	  }

	  convertPoint(point) {
	    const { x, y } = this._convertPoint(point);
	    const vector = [ x, y ];
	    vector2.transformMat2d(vector, vector, this.matrix);

	    return {
	      x: vector[0],
	      y: vector[1]
	    };
	  }

	  invertPoint(point) {
	    return this._invertPoint(point);
	  }

	  _convertPoint(point) {
	    return point;
	  }

	  _invertPoint(point) {
	    return point;
	  }

	  reset(plot) {
	    this.plot = plot;
	    const { bl, tr } = plot;
	    this.start = bl;
	    this.end = tr;
	    this.init(bl, tr);
	  }
	}

	var base$1 = Base$1;

	class Cartesian extends base$1 {
	  _initDefaultCfg() {
	    this.type = 'cartesian';
	    this.transposed = false;
	    this.isRect = true;
	  }

	  init(start, end) {
	    super.init(start, end);
	    this.x = {
	      start: start.x,
	      end: end.x
	    };

	    this.y = {
	      start: start.y,
	      end: end.y
	    };
	  }

	  _convertPoint(point) {
	    const self = this;
	    const transposed = self.transposed;
	    const xDim = transposed ? 'y' : 'x';
	    const yDim = transposed ? 'x' : 'y';
	    const x = self.x;
	    const y = self.y;
	    return {
	      x: x.start + (x.end - x.start) * point[xDim],
	      y: y.start + (y.end - y.start) * point[yDim]
	    };
	  }

	  _invertPoint(point) {
	    const self = this;
	    const transposed = self.transposed;
	    const xDim = transposed ? 'y' : 'x';
	    const yDim = transposed ? 'x' : 'y';
	    const x = self.x;
	    const y = self.y;
	    const rst = {};
	    rst[xDim] = (point.x - x.start) / (x.end - x.start);
	    rst[yDim] = (point.y - y.start) / (y.end - y.start);
	    return rst;
	  }
	}

	base$1.Cartesian = Cartesian;
	base$1.Rect = Cartesian;

	var coord = base$1;

	// isFinite,
	var isNil$1 = function isNil(value) {
	  /**
	   * isNil(null) => true
	   * isNil() => true
	   */
	  return value === null || value === undefined;
	};

	var isNil_1$1 = isNil$1;

	var toString$2 = {}.toString;
	var isType$1 = function isType(value, type) {
	  return toString$2.call(value) === '[object ' + type + ']';
	};

	var isType_1$1 = isType$1;

	var isArray$1 = Array.isArray ? Array.isArray : function (value) {
	  return isType_1$1(value, 'Array');
	};

	var isArray_1$1 = isArray$1;

	var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isObject$1 = function isObject(value) {
	  /**
	   * isObject({}) => true
	   * isObject([1, 2, 3]) => true
	   * isObject(Function) => true
	   * isObject(null) => false
	   */
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof$2(value);
	  return value !== null && type === 'object' || type === 'function';
	};

	var isObject_1$1 = isObject$1;

	var each$1 = function each(elements, func) {
	  if (!elements) {
	    return;
	  }
	  var rst = void 0;
	  if (isArray_1$1(elements)) {
	    for (var i = 0, len = elements.length; i < len; i++) {
	      rst = func(elements[i], i);
	      if (rst === false) {
	        break;
	      }
	    }
	  } else if (isObject_1$1(elements)) {
	    for (var k in elements) {
	      if (elements.hasOwnProperty(k)) {
	        rst = func(elements[k], k);
	        if (rst === false) {
	          break;
	        }
	      }
	    }
	  }
	};

	var each_1$1 = each$1;

	var isString$1 = function isString(str) {
	  return isType_1$1(str, 'String');
	};

	var isString_1$1 = isString$1;

	function _mix$1(dist, obj) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
	      dist[key] = obj[key];
	    }
	  }
	}

	var mix$1 = function mix(dist, src1, src2, src3) {
	  if (src1) _mix$1(dist, src1);
	  if (src2) _mix$1(dist, src2);
	  if (src3) _mix$1(dist, src3);
	  return dist;
	};

	var mix_1$1 = mix$1;

	/**
	 * @fileOverview the Attribute base class
	 */










	function toScaleString(scale, value) {
	  if (isString_1$1(value)) {
	    return value;
	  }

	  return scale.invert(scale.scale(value));
	}
	/**
	 * 所有视觉通道属性的基类
	 * @class Attr
	 */


	var AttributeBase =
	/*#__PURE__*/
	function () {
	  function AttributeBase(cfg) {
	    var _this = this;

	    /**
	     * 属性的类型
	     * @type {String}
	     */
	    this.type = 'base';
	    /**
	     * 属性的名称
	     * @type {String}
	     */

	    this.name = null;
	    /**
	     * 回调函数
	     * @type {Function}
	     */

	    this.method = null;
	    /**
	     * 备选的值数组
	     * @type {Array}
	     */

	    this.values = [];
	    /**
	     * 属性内部的度量
	     * @type {Array}
	     */

	    this.scales = [];
	    /**
	     * 是否通过线性取值, 如果未指定，则根据数值的类型判定
	     * @type {Boolean}
	     */

	    this.linear = null;
	    /**
	     * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
	     */

	    var mixedCallback = null;
	    var defaultCallback = this.callback;

	    if (cfg.callback) {
	      var userCallback = cfg.callback;

	      mixedCallback = function mixedCallback() {
	        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
	          params[_key] = arguments[_key];
	        }

	        var ret = userCallback.apply(void 0, params);

	        if (isNil_1$1(ret)) {
	          ret = defaultCallback.apply(_this, params);
	        }

	        return ret;
	      };
	    }

	    mix_1$1(this, cfg);

	    if (mixedCallback) {
	      mix_1$1(this, {
	        callback: mixedCallback
	      });
	    }
	  } // 获取属性值，将值映射到视觉通道


	  var _proto = AttributeBase.prototype;

	  _proto._getAttrValue = function _getAttrValue(scale, value) {
	    var values = this.values;

	    if (scale.isCategory && !this.linear) {
	      var index = scale.translate(value);
	      return values[index % values.length];
	    }

	    var percent = scale.scale(value);
	    return this.getLinearValue(percent);
	  };
	  /**
	   * 如果进行线性映射，返回对应的映射值
	   * @protected
	   * @param  {Number} percent 百分比
	   * @return {*}  颜色值、形状、大小等
	   */


	  _proto.getLinearValue = function getLinearValue(percent) {
	    var values = this.values;
	    var steps = values.length - 1;
	    var step = Math.floor(steps * percent);
	    var leftPercent = steps * percent - step;
	    var start = values[step];
	    var end = step === steps ? start : values[step + 1];
	    var rstValue = start + (end - start) * leftPercent;
	    return rstValue;
	  };
	  /**
	   * 默认的回调函数
	   * @param {*} value 回调函数的值
	   * @type {Function}
	   * @return {Array} 返回映射后的值
	   */


	  _proto.callback = function callback(value) {
	    var self = this;
	    var scale = self.scales[0];
	    var rstValue = null;

	    if (scale.type === 'identity') {
	      rstValue = scale.value;
	    } else {
	      rstValue = self._getAttrValue(scale, value);
	    }

	    return rstValue;
	  };
	  /**
	   * 根据度量获取属性名
	   * @return {Array} dims of this Attribute
	   */


	  _proto.getNames = function getNames() {
	    var scales = this.scales;
	    var names = this.names;
	    var length = Math.min(scales.length, names.length);
	    var rst = [];

	    for (var i = 0; i < length; i++) {
	      rst.push(names[i]);
	    }

	    return rst;
	  };
	  /**
	   * 根据度量获取维度名
	   * @return {Array} dims of this Attribute
	   */


	  _proto.getFields = function getFields() {
	    var scales = this.scales;
	    var rst = [];
	    each_1$1(scales, function (scale) {
	      rst.push(scale.field);
	    });
	    return rst;
	  };
	  /**
	   * 根据名称获取度量
	   * @param  {String} name the name of scale
	   * @return {Scale} scale
	   */


	  _proto.getScale = function getScale(name) {
	    var scales = this.scales;
	    var names = this.names;
	    var index = names.indexOf(name);
	    return scales[index];
	  };
	  /**
	   * 映射数据
	   * @param {*} param1...paramn 多个数值
	   * @return {Array} 映射的值组成的数组
	   */


	  _proto.mapping = function mapping() {
	    var scales = this.scales;
	    var callback = this.callback;

	    for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      params[_key2] = arguments[_key2];
	    }

	    var values = params;

	    if (callback) {
	      for (var i = 0, len = params.length; i < len; i++) {
	        params[i] = this._toOriginParam(params[i], scales[i]);
	      }

	      values = callback.apply(this, params);
	    }

	    values = [].concat(values);
	    return values;
	  }; // 原始的参数


	  _proto._toOriginParam = function _toOriginParam(param, scale) {
	    var rst = param;

	    if (!scale.isLinear) {
	      if (isArray_1$1(param)) {
	        rst = [];

	        for (var i = 0, len = param.length; i < len; i++) {
	          rst.push(toScaleString(scale, param[i]));
	        }
	      } else {
	        rst = toScaleString(scale, param);
	      }
	    }

	    return rst;
	  };

	  return AttributeBase;
	}();

	var base$2 = AttributeBase;

	function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }









	var Position =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose(Position, _Base);

	  function Position(cfg) {
	    var _this;

	    _this = _Base.call(this, cfg) || this;
	    _this.names = ['x', 'y'];
	    _this.type = 'position';
	    return _this;
	  }

	  var _proto = Position.prototype;

	  _proto.mapping = function mapping(x, y) {
	    var scales = this.scales;
	    var coord = this.coord;
	    var scaleX = scales[0];
	    var scaleY = scales[1];
	    var rstX;
	    var rstY;
	    var obj;

	    if (isNil_1$1(x) || isNil_1$1(y)) {
	      return [];
	    }

	    if (isArray_1$1(y) && isArray_1$1(x)) {
	      rstX = [];
	      rstY = [];

	      for (var i = 0, j = 0, xLen = x.length, yLen = y.length; i < xLen && j < yLen; i++, j++) {
	        obj = coord.convertPoint({
	          x: scaleX.scale(x[i]),
	          y: scaleY.scale(y[j])
	        });
	        rstX.push(obj.x);
	        rstY.push(obj.y);
	      }
	    } else if (isArray_1$1(y)) {
	      x = scaleX.scale(x);
	      rstY = [];
	      each_1$1(y, function (yVal) {
	        yVal = scaleY.scale(yVal);
	        obj = coord.convertPoint({
	          x: x,
	          y: yVal
	        });

	        if (rstX && rstX !== obj.x) {
	          if (!isArray_1$1(rstX)) {
	            rstX = [rstX];
	          }

	          rstX.push(obj.x);
	        } else {
	          rstX = obj.x;
	        }

	        rstY.push(obj.y);
	      });
	    } else if (isArray_1$1(x)) {
	      y = scaleY.scale(y);
	      rstX = [];
	      each_1$1(x, function (xVal) {
	        xVal = scaleX.scale(xVal);
	        obj = coord.convertPoint({
	          x: xVal,
	          y: y
	        });

	        if (rstY && rstY !== obj.y) {
	          if (!isArray_1$1(rstY)) {
	            rstY = [rstY];
	          }

	          rstY.push(obj.y);
	        } else {
	          rstY = obj.y;
	        }

	        rstX.push(obj.x);
	      });
	    } else {
	      x = scaleX.scale(x);
	      y = scaleY.scale(y);
	      var point = coord.convertPoint({
	        x: x,
	        y: y
	      });
	      rstX = point.x;
	      rstY = point.y;
	    }

	    return [rstX, rstY];
	  };

	  return Position;
	}(base$2);

	var position = Position;

	function _inheritsLoose$1(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }



	var Shape =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose$1(Shape, _Base);

	  function Shape(cfg) {
	    var _this;

	    _this = _Base.call(this, cfg) || this;
	    _this.names = ['shape'];
	    _this.type = 'shape';
	    _this.gradient = null;
	    return _this;
	  }
	  /**
	   * @override
	   */


	  var _proto = Shape.prototype;

	  _proto.getLinearValue = function getLinearValue(percent) {
	    var values = this.values;
	    var index = Math.round((values.length - 1) * percent);
	    return values[index];
	  };

	  return Shape;
	}(base$2);

	var shape = Shape;

	function _inheritsLoose$2(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }



	var Size =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose$2(Size, _Base);

	  function Size(cfg) {
	    var _this;

	    _this = _Base.call(this, cfg) || this;
	    _this.names = ['size'];
	    _this.type = 'size';
	    _this.gradient = null;
	    return _this;
	  }

	  return Size;
	}(base$2);

	var size = Size;

	// Get the interpolation between colors
	function getValue(start, end, percent, index) {
	  const value = start[index] + (end[index] - start[index]) * percent;
	  return value;
	}

	// convert to hex
	function arr2hex(arr) {
	  return '#' + toRGBValue(arr[0]) + toRGBValue(arr[1]) + toRGBValue(arr[2]);
	}

	function toRGBValue(value) {
	  value = Math.round(value);
	  value = value.toString(16);
	  if (value.length === 1) {
	    value = '0' + value;
	  }
	  return value;
	}

	function calColor(colors, percent) {
	  const steps = colors.length - 1;
	  const step = Math.floor(steps * percent);
	  const left = steps * percent - step;
	  const start = colors[step];
	  const end = step === steps ? start : colors[step + 1];
	  const rgb = arr2hex([
	    getValue(start, end, left, 0),
	    getValue(start, end, left, 1),
	    getValue(start, end, left, 2)
	  ]);
	  return rgb;
	}

	function hex2arr(str) {
	  const arr = [];
	  arr.push(parseInt(str.substr(1, 2), 16));
	  arr.push(parseInt(str.substr(3, 2), 16));
	  arr.push(parseInt(str.substr(5, 2), 16));
	  return arr;
	}

	const colorCache = {
	  black: '#000000',
	  blue: '#0000ff',
	  grey: '#808080',
	  green: '#008000',
	  orange: '#ffa500',
	  pink: '#ffc0cb',
	  purple: '#800080',
	  red: '#ff0000',
	  white: '#ffffff',
	  yellow: '#ffff00'
	};

	const ColorUtil = {
	  /**
	   * Returns a hexadecimal string representing this color in RGB space, such as #f7eaba.
	   * @param  {String} color color value
	   * @return {String} Returns a hexadecimal string
	   */
	  toHex(color) {
	    if (colorCache[color]) {
	      return colorCache[color];
	    }

	    if (color[0] === '#') {
	      if (color.length === 7) {
	        return color;
	      }

	      const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
	        return '#' + r + r + g + g + b + b;
	      }); // hex3 to hex6
	      colorCache[color] = hex;
	      return hex;
	    }

	    // rgb/rgba to hex
	    let rst = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	    rst.shift();
	    rst = arr2hex(rst);
	    colorCache[color] = rst;
	    return rst;
	  },

	  hex2arr,

	  /**
	   * handle the gradient color
	   * @param  {Array} colors the colors
	   * @return {String} return the color value
	   */
	  gradient(colors) {
	    const points = [];
	    if (common.isString(colors)) {
	      colors = colors.split('-');
	    }
	    common.each(colors, function(color) {
	      if (color.indexOf('#') === -1) {
	        color = ColorUtil.toHex(color);
	      }
	      points.push(hex2arr(color));
	    });
	    return function(percent) {
	      return calColor(points, percent);
	    };
	  }
	};

	var colorUtil = ColorUtil;

	class Color extends base$2 {

	  constructor(cfg) {
	    super(cfg);
	    this.names = [ 'color' ];
	    this.type = 'color';
	    this.gradient = null;
	    if (common.isString(this.values)) {
	      this.linear = true;
	    }
	  }

	  /**
	   * @override
	   */
	  getLinearValue(percent) {
	    let gradient = this.gradient;
	    if (!gradient) {
	      const values = this.values;
	      gradient = colorUtil.gradient(values);
	      this.gradient = gradient;
	    }
	    return gradient(percent);
	  }
	}

	var color = Color;

	var attr = {
	  Position: position,
	  Shape: shape,
	  Size: size,
	  Color: color
	};

	const Shape$1 = {};

	const ShapeBase = {
	  _coord: null,
	  /**
	   * draw the shape
	   * @param {Object} cfg options
	   * @param {Object} container container to store the shapes
	   */
	  draw(cfg, container) {
	    if (this.drawShape) {
	      this.drawShape(cfg, container);
	    }
	  },
	  /**
	   * set the coordinate instance
	   * @param {Coord} coord coordinate instance
	   */
	  setCoord(coord) {
	    this._coord = coord;
	  },
	  /**
	   * convert the normalized value to the canvas position
	   * @param  {point} point the point to convert
	   * @return {point} point return the result
	   */
	  parsePoint(point) {
	    const coord = this._coord;
	    if (coord.isPolar) {
	      if (point.x === 1) point.x = 0.9999999;
	      if (point.y === 1) point.y = 0.9999999;
	    }
	    return coord.convertPoint(point);
	  },
	  /**
	   * convert the normalized value to the canvas position
	   * @param  {points} points the array that store the points
	   * @return {points} points return the result
	   */
	  parsePoints(points) {
	    if (!points) return false;
	    const self = this;
	    const rst = [];
	    points.forEach(function(point) {
	      rst.push(self.parsePoint(point));
	    });
	    return rst;
	  }
	};

	const ShapeFactoryBase = {
	  defaultShapeType: null,
	  setCoord(coord) {
	    this._coord = coord;
	  },
	  getShape(type) {
	    const self = this;
	    if (common.isArray(type)) {
	      type = type[0];
	    }
	    const shape = self[type] || self[self.defaultShapeType];
	    shape._coord = self._coord;
	    return shape;
	  },
	  getShapePoints(type, cfg) {
	    const shape = this.getShape(type);
	    const fn = shape.getPoints || shape.getShapePoints || this.getDefaultPoints;
	    const points = fn(cfg);
	    return points;
	  },
	  getDefaultPoints(/* cfg */) {
	    return [];
	  },
	  drawShape(type, cfg, container) {
	    const shape = this.getShape(type);
	    if (!cfg.color) {
	      cfg.color = global$1.colors[0];
	    }
	    return shape.draw(cfg, container);
	  }
	};

	Shape$1.registerFactory = function(factoryName, cfg) {
	  const className = common.upperFirst(factoryName);
	  const geomObj = common.mix({}, ShapeFactoryBase, cfg);
	  Shape$1[className] = geomObj;
	  geomObj.name = factoryName;
	  return geomObj;
	};

	Shape$1.registerShape = function(factoryName, shapeType, cfg) {
	  const className = common.upperFirst(factoryName);
	  const factory = Shape$1[className];
	  const shapeObj = common.mix({}, ShapeBase, cfg);
	  factory[shapeType] = shapeObj;
	  return shapeObj;
	};

	Shape$1.registShape = Shape$1.registerShape;

	Shape$1.getShapeFactory = function(factoryName) {
	  const self = this;
	  factoryName = factoryName || 'point';
	  const className = common.upperFirst(factoryName);
	  return self[className];
	};

	var shape$1 = Shape$1;

	function _mix$2(dist, obj) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
	      dist[key] = obj[key];
	    }
	  }
	}

	var mix$2 = function mix(dist, src1, src2, src3) {
	  if (src1) _mix$2(dist, src1);
	  if (src2) _mix$2(dist, src2);
	  if (src3) _mix$2(dist, src3);
	  return dist;
	};

	var mix_1$2 = mix$2;

	var Adjust =
	/*#__PURE__*/
	function () {
	  var _proto = Adjust.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
	  };

	  function Adjust(cfg) {
	    this._initDefaultCfg();

	    mix_1$2(this, cfg);
	  }
	  /**
	   * @override
	   */


	  _proto.processAdjust = function processAdjust()
	  /* dataArray */
	  {};

	  return Adjust;
	}();

	var base$3 = Adjust;

	const GROUP_ATTRS = [ 'color', 'size', 'shape' ];
	const FIELD_ORIGIN = '_origin';
	const FIELD_ORIGIN_Y = '_originY';





	function parseFields(field) {
	  if (common.isArray(field)) {
	    return field;
	  }
	  if (common.isString(field)) {
	    return field.split('*');
	  }
	  return [ field ];
	}

	/**
	 * The parent class for Geometry
	 * @class Geom
	 */
	class Geom extends base {

	  getDefaultCfg() {
	    return {
	      /**
	       * geometry type
	       * @type {String}
	       */
	      type: null,
	      /**
	       * the data of geometry
	       * @type {Array}
	       */
	      data: null,
	      /**
	       * the attrs of geo,etry
	       * @type {Object}
	       */
	      attrs: {},

	      scales: {},

	      /**
	       * group for storing the shapes
	       * @type {Canvas}
	       */
	      container: null,
	      /**
	       * style options
	       * @type {Object}
	       */
	      styleOptions: null,

	      chart: null,

	      shapeType: '',

	      /**
	       * wether to generate key points for each shape
	       * @protected
	       * @type {Boolean}
	       */
	      generatePoints: false,

	      attrOptions: {},

	      sortable: false,
	      startOnZero: true,
	      visible: true,
	      connectNulls: false,
	      // 是否丢弃没有值的分组。
	      ignoreEmptyGroup: false
	    };
	  }

	  init() {
	    const self = this;
	    self._initAttrs();
	    const dataArray = self._processData();
	    if (self.get('adjust')) {
	      self._adjustData(dataArray);
	    }
	    self.set('dataArray', dataArray);
	  }

	  _getGroupScales() {
	    const self = this;
	    const scales = [];
	    common.each(GROUP_ATTRS, function(attrName) {
	      const attr = self.getAttr(attrName);
	      if (attr) {
	        const attrScales = attr.scales;
	        common.each(attrScales, function(scale) {
	          if (scale && scale.isCategory && scales.indexOf(scale) === -1) {
	            scales.push(scale);
	          }
	        });
	      }
	    });
	    return scales;
	  }

	  _groupData(data) {
	    const self = this;
	    const colDefs = self.get('colDefs');
	    const groupScales = self._getGroupScales();
	    if (groupScales.length) {
	      const appendConditions = {};
	      const names = [];
	      common.each(groupScales, scale => {
	        const field = scale.field;
	        names.push(field);
	        if (colDefs && colDefs[field] && colDefs[field].values) { // users have defined
	          appendConditions[scale.field] = colDefs[field].values;
	        }
	      });
	      return common.Array.group(data, names, appendConditions);
	    }
	    return [ data ];

	  }

	  _setAttrOptions(attrName, attrCfg) {
	    const options = this.get('attrOptions');
	    options[attrName] = attrCfg;
	  }

	  _createAttrOption(attrName, field, cfg, defaultValues) {
	    const attrCfg = {};
	    attrCfg.field = field;
	    if (cfg) {
	      if (common.isFunction(cfg)) {
	        attrCfg.callback = cfg;
	      } else {
	        attrCfg.values = cfg;
	      }
	    } else {
	      attrCfg.values = defaultValues;
	    }
	    this._setAttrOptions(attrName, attrCfg);
	  }

	  _initAttrs() {
	    const self = this;
	    const attrs = self.get('attrs');
	    const attrOptions = self.get('attrOptions');
	    const coord = self.get('coord');

	    for (const type in attrOptions) {
	      if (attrOptions.hasOwnProperty(type)) {
	        const option = attrOptions[type];
	        const className = common.upperFirst(type);
	        const fields = parseFields(option.field);
	        if (type === 'position') {
	          option.coord = coord;
	        }
	        const scales = [];
	        for (let i = 0, len = fields.length; i < len; i++) {
	          const field = fields[i];
	          const scale = self._createScale(field);
	          scales.push(scale);
	        }
	        if (type === 'position') {
	          const yScale = scales[1];
	          if (coord.type === 'polar' && coord.transposed && self.hasAdjust('stack')) {
	            if (yScale.values.length) {
	              yScale.change({
	                nice: false,
	                min: 0,
	                max: Math.max.apply(null, yScale.values)
	              });
	            }
	          }
	        }

	        option.scales = scales;
	        const attr$1 = new attr[className](option);
	        attrs[type] = attr$1;
	      }
	    }
	  }

	  _createScale(field) {
	    const scales = this.get('scales');
	    let scale = scales[field];
	    if (!scale) {
	      scale = this.get('chart').createScale(field);
	      scales[field] = scale;
	    }
	    return scale;
	  }

	  _processData() {
	    const self = this;
	    const data = this.get('data');
	    const dataArray = [];
	    let groupedArray = this._groupData(data);
	    if (this.get('ignoreEmptyGroup')) {
	      const yScale = this.getYScale();
	      groupedArray = groupedArray.filter(group =>
	        group.some(item => typeof item[yScale.field] !== 'undefined')
	      );
	    }
	    for (let i = 0, len = groupedArray.length; i < len; i++) {
	      const subData = groupedArray[i];
	      const tempData = self._saveOrigin(subData);
	      if (this.hasAdjust('dodge')) {
	        self._numberic(tempData);
	      }
	      dataArray.push(tempData);
	    }
	    return dataArray;
	  }

	  _saveOrigin(data) {
	    const rst = [];
	    for (let i = 0, len = data.length; i < len; i++) {
	      const origin = data[i];
	      const obj = {};
	      for (const k in origin) {
	        obj[k] = origin[k];
	      }
	      obj[FIELD_ORIGIN] = origin;
	      rst.push(obj);
	    }
	    return rst;
	  }

	  _numberic(data) {
	    const positionAttr = this.getAttr('position');
	    const scales = positionAttr.scales;
	    for (let j = 0, len = data.length; j < len; j++) {
	      const obj = data[j];
	      const count = Math.min(2, scales.length);
	      for (let i = 0; i < count; i++) {
	        const scale = scales[i];
	        if (scale.isCategory) {
	          const field = scale.field;
	          obj[field] = scale.translate(obj[field]);
	        }
	      }
	    }
	  }

	  _adjustData(dataArray) {
	    const self = this;
	    const adjust = self.get('adjust');
	    if (adjust) {
	      const adjustType = common.upperFirst(adjust.type);
	      if (!base$3[adjustType]) {
	        throw new Error('not support such adjust : ' + adjust);
	      }

	      const xScale = self.getXScale();
	      const yScale = self.getYScale();
	      const cfg = common.mix({
	        xField: xScale.field,
	        yField: yScale.field
	      }, adjust);
	      const adjustObject = new base$3[adjustType](cfg);
	      adjustObject.processAdjust(dataArray);
	      if (adjustType === 'Stack') {
	        self._updateStackRange(yScale.field, yScale, dataArray);
	      }
	    }
	  }

	  _updateStackRange(field, scale, dataArray) {
	    const mergeArray = common.Array.merge(dataArray);
	    let min = scale.min;
	    let max = scale.max;
	    for (let i = 0, len = mergeArray.length; i < len; i++) {
	      const obj = mergeArray[i];
	      const tmpMin = Math.min.apply(null, obj[field]);
	      const tmpMax = Math.max.apply(null, obj[field]);
	      if (tmpMin < min) {
	        min = tmpMin;
	      }
	      if (tmpMax > max) {
	        max = tmpMax;
	      }
	    }
	    if (min < scale.min || max > scale.max) {
	      scale.change({
	        min,
	        max
	      });
	    }
	  }

	  _sort(mappedArray) {
	    const self = this;
	    const xScale = self.getXScale();
	    const { field, type } = xScale;
	    if (type !== 'identity' && xScale.values.length > 1) {
	      common.each(mappedArray, itemArr => {
	        itemArr.sort((obj1, obj2) => {
	          if (type === 'timeCat') {
	            return xScale._toTimeStamp(obj1[FIELD_ORIGIN][field]) - xScale._toTimeStamp(obj2[FIELD_ORIGIN][field]);
	          }
	          return xScale.translate(obj1[FIELD_ORIGIN][field]) - xScale.translate(obj2[FIELD_ORIGIN][field]);
	        });
	      });
	    }

	    self.set('hasSorted', true);
	    self.set('dataArray', mappedArray);
	  }

	  paint() {
	    const self = this;
	    const dataArray = self.get('dataArray');
	    const mappedArray = [];
	    const shapeFactory = self.getShapeFactory();
	    shapeFactory.setCoord(self.get('coord'));
	    self._beforeMapping(dataArray);
	    for (let i = 0, len = dataArray.length; i < len; i++) {
	      let data = dataArray[i];
	      if (data.length) {
	        data = self._mapping(data);
	        mappedArray.push(data);
	        self.draw(data, shapeFactory);
	      }
	    }
	    self.set('dataArray', mappedArray);
	  }

	  getShapeFactory() {
	    let shapeFactory = this.get('shapeFactory');
	    if (!shapeFactory) {
	      const shapeType = this.get('shapeType');
	      shapeFactory = shape$1.getShapeFactory(shapeType);
	      this.set('shapeFactory', shapeFactory);
	    }
	    return shapeFactory;
	  }

	  _mapping(data) {
	    const self = this;
	    const attrs = self.get('attrs');
	    const yField = self.getYScale().field;
	    const mappedData = [];
	    for (let i = 0, len = data.length; i < len; i++) {
	      const record = data[i];
	      const newRecord = {};
	      newRecord[FIELD_ORIGIN] = record[FIELD_ORIGIN];
	      newRecord.points = record.points;
	      newRecord.nextPoints = record.nextPoints;
	      // 避免
	      newRecord[FIELD_ORIGIN_Y] = record[yField];
	      for (const k in attrs) {
	        if (attrs.hasOwnProperty(k)) {
	          const attr = attrs[k];
	          const names = attr.names;
	          const values = self._getAttrValues(attr, record);
	          if (names.length > 1) {
	            for (let j = 0, len = values.length; j < len; j++) {
	              const val = values[j];
	              const name = names[j];
	              newRecord[name] = (common.isArray(val) && val.length === 1) ? val[0] : val;
	            }
	          } else {
	            newRecord[names[0]] = values.length === 1 ? values[0] : values;
	          }
	        }
	      }
	      mappedData.push(newRecord);
	    }

	    return mappedData;
	  }

	  _getAttrValues(attr, record) {
	    const scales = attr.scales;
	    const params = [];
	    for (let i = 0, len = scales.length; i < len; i++) {
	      const scale = scales[i];
	      const field = scale.field;
	      if (scale.type === 'identity') {
	        params.push(scale.value);
	      } else {
	        params.push(record[field]);
	      }
	    }
	    const values = attr.mapping(...params);
	    return values;
	  }

	  getAttrValue(attrName, record) {
	    const attr = this.getAttr(attrName);
	    let rst = null;
	    if (attr) {
	      const values = this._getAttrValues(attr, record);
	      rst = values[0];
	    }
	    return rst;
	  }

	  _beforeMapping(dataArray) {
	    const self = this;
	    if (self.get('sortable')) {
	      self._sort(dataArray);
	    }
	    if (self.get('generatePoints')) {
	      common.each(dataArray, function(data) {
	        self._generatePoints(data);
	      });
	      // 添加nextPoints
	      common.each(dataArray, (data, index) => {
	        const nextData = dataArray[index + 1];
	        if (nextData) {
	          data[0].nextPoints = nextData[0].points;
	        }
	      });
	    }
	  }

	  isInCircle() {
	    const coord = this.get('coord');
	    return coord && coord.isPolar;
	  }

	  getCallbackCfg(fields, cfg, origin) {
	    if (!fields) {
	      return cfg;
	    }
	    const tmpCfg = {};
	    const params = fields.map(function(field) {
	      return origin[field];
	    });
	    common.each(cfg, function(v, k) {
	      if (common.isFunction(v)) {
	        tmpCfg[k] = v.apply(null, params);
	      } else {
	        tmpCfg[k] = v;
	      }
	    });
	    return tmpCfg;
	  }

	  getDrawCfg(obj) {
	    const self = this;
	    const isInCircle = self.isInCircle();
	    const cfg = {
	      origin: obj,
	      x: obj.x,
	      y: obj.y,
	      color: obj.color,
	      size: obj.size,
	      shape: obj.shape,
	      isInCircle,
	      opacity: obj.opacity
	    };
	    const styleOptions = self.get('styleOptions');
	    if (styleOptions && styleOptions.style) {
	      cfg.style = self.getCallbackCfg(styleOptions.fields, styleOptions.style, obj[FIELD_ORIGIN]);
	    }
	    if (self.get('generatePoints')) {
	      cfg.points = obj.points;
	      cfg.nextPoints = obj.nextPoints;
	    }
	    if (isInCircle) {
	      cfg.center = self.get('coord').center;
	    }
	    return cfg;
	  }

	  draw(data, shapeFactory) {
	    const self = this;
	    const container = self.get('container');
	    const yScale = self.getYScale();
	    common.each(data, function(obj, index) {
	      if (yScale && common.isNil(obj._origin[yScale.field])) {
	        return;
	      }
	      obj.index = index;
	      const cfg = self.getDrawCfg(obj);
	      const shape = obj.shape;
	      self.drawShape(shape, obj, cfg, container, shapeFactory);
	    });
	  }

	  drawShape(shape, shapeData, cfg, container, shapeFactory) {
	    const gShape = shapeFactory.drawShape(shape, cfg, container);

	    if (gShape) {
	      common.each([].concat(gShape), s => {
	        s.set('origin', shapeData);
	      });
	    }
	  }

	  _generatePoints(data) {
	    const self = this;
	    const shapeFactory = self.getShapeFactory();
	    const shapeAttr = self.getAttr('shape');
	    for (let i = 0, len = data.length; i < len; i++) {
	      const obj = data[i];
	      const cfg = self.createShapePointsCfg(obj);
	      const shape = shapeAttr ? self._getAttrValues(shapeAttr, obj) : null;
	      const points = shapeFactory.getShapePoints(shape, cfg);
	      obj.points = points;
	    }
	  }

	  /**
	   * get the info of each shape
	   * @protected
	   * @param  {Object} obj the data item
	   * @return {Object} cfg return the result
	   */
	  createShapePointsCfg(obj) {
	    const xScale = this.getXScale();
	    const yScale = this.getYScale();
	    const x = this._normalizeValues(obj[xScale.field], xScale);
	    let y;

	    if (yScale) {
	      y = this._normalizeValues(obj[yScale.field], yScale);
	    } else {
	      y = obj.y ? obj.y : 0.1;
	    }

	    return {
	      x,
	      y,
	      y0: yScale ? yScale.scale(this.getYMinValue()) : undefined
	    };
	  }

	  getYMinValue() {
	    const yScale = this.getYScale();
	    const { min, max } = yScale;
	    let value;

	    if (this.get('startOnZero')) {
	      if (max <= 0 && min <= 0) {
	        value = max;
	      } else {
	        value = min >= 0 ? min : 0;
	      }
	    } else {
	      value = min;
	    }

	    return value;
	  }

	  _normalizeValues(values, scale) {
	    let rst = [];
	    if (common.isArray(values)) {
	      for (let i = 0, len = values.length; i < len; i++) {
	        const v = values[i];
	        rst.push(scale.scale(v));
	      }
	    } else {
	      rst = scale.scale(values);
	    }
	    return rst;
	  }

	  getAttr(name) {
	    return this.get('attrs')[name];
	  }

	  getXScale() {
	    return this.getAttr('position').scales[0];
	  }

	  getYScale() {
	    return this.getAttr('position').scales[1];
	  }

	  hasAdjust(adjust) {
	    return this.get('adjust') && (this.get('adjust').type === adjust);
	  }

	  _getSnap(scale, item, arr) {
	    let i = 0;
	    let values;
	    const yField = this.getYScale().field; // 叠加的维度
	    if (this.hasAdjust('stack') && scale.field === yField) {
	      values = [];
	      arr.forEach(function(obj) {
	        values.push(obj[FIELD_ORIGIN_Y]);
	      });

	      for (let len = values.length; i < len; i++) {
	        if (values[0][0] > item) {
	          break;
	        }
	        if (values[values.length - 1][1] <= item) {
	          i = values.length - 1;
	          break;
	        }
	        if (values[i][0] <= item && values[i][1] > item) {
	          break;
	        }
	      }
	    } else {
	      values = scale.values;
	      values.sort((a, b) => {
	        return a - b;
	      });
	      for (let len = values.length; i < len; i++) {
	        // 如果只有1个点直接返回第1个点
	        if (len <= 1) {
	          break;
	        }
	        // 第1个点和第2个点之间
	        if ((values[0] + values[1]) / 2 > item) {
	          break;
	        }
	        // 中间的点
	        if ((values[i - 1] + values[i]) / 2 <= item && (values[i + 1] + values[i]) / 2 > item) {
	          break;
	        }
	        // 最后2个点
	        if ((values[values.length - 2] + values[values.length - 1]) / 2 <= item) {
	          i = values.length - 1;
	          break;
	        }
	      }
	    }
	    const result = values[i];
	    return result;
	  }

	  getSnapRecords(point) {
	    const self = this;
	    const coord = self.get('coord');
	    const xScale = self.getXScale();
	    const yScale = self.getYScale();
	    const xfield = xScale.field;

	    const dataArray = self.get('dataArray');
	    if (!this.get('hasSorted')) {
	      this._sort(dataArray);
	    }

	    let rst = [];
	    const invertPoint = coord.invertPoint(point);
	    let invertPointX = invertPoint.x;
	    if (self.isInCircle() && !coord.transposed && invertPointX > (1 + xScale.rangeMax()) / 2) {
	      invertPointX = xScale.rangeMin();
	    }

	    let xValue = xScale.invert(invertPointX);
	    if (!xScale.isCategory) {
	      xValue = self._getSnap(xScale, xValue);
	    }

	    const tmp = [];

	    dataArray.forEach(function(data) {
	      data.forEach(function(obj) {
	        const originValue = common.isNil(obj[FIELD_ORIGIN]) ? obj[xfield] : obj[FIELD_ORIGIN][xfield];
	        if (self._isEqual(originValue, xValue, xScale)) {
	          tmp.push(obj);
	        }
	      });
	    });

	    // special for pie chart
	    if (this.hasAdjust('stack') && coord.isPolar && coord.transposed) {
	      if (invertPointX >= 0 && invertPointX <= 1) {
	        let yValue = yScale.invert(invertPoint.y);
	        yValue = self._getSnap(yScale, yValue, tmp);
	        tmp.forEach(obj => {
	          if (common.isArray(yValue) ? obj[FIELD_ORIGIN_Y].toString() === yValue.toString() : obj[FIELD_ORIGIN_Y] === yValue) {
	            rst.push(obj);
	          }
	        });
	      }

	    } else {
	      rst = tmp;
	    }

	    return rst;
	  }

	  _isEqual(originValue, value, scale) {
	    if (scale.type === 'timeCat') {
	      return scale._toTimeStamp(originValue) === value;
	    }
	    return value === originValue;
	  }

	  position(field) {
	    this._setAttrOptions('position', {
	      field
	    });
	    return this;
	  }

	  color(field, values) {
	    this._createAttrOption('color', field, values, global$1.colors);
	    return this;
	  }

	  size(field, values) {
	    this._createAttrOption('size', field, values, global$1.sizes);
	    return this;
	  }

	  shape(field, values) {
	    const type = this.get('type');
	    const shapes = global$1.shapes[type] || [];
	    this._createAttrOption('shape', field, values, shapes);
	    return this;
	  }

	  style(field, cfg) {
	    let styleOptions = this.get('styleOptions');
	    if (!styleOptions) {
	      styleOptions = {};
	      this.set('styleOptions', styleOptions);
	    }
	    if (common.isObject(field)) {
	      cfg = field;
	      field = null;
	    }
	    let fields;
	    if (field) {
	      fields = parseFields(field);
	    }
	    styleOptions.fields = fields;
	    styleOptions.style = cfg;
	    return this;
	  }

	  adjust(type) {
	    if (common.isString(type)) {
	      type = { type };
	    }
	    this.set('adjust', type);
	    return this;
	  }

	  animate(cfg) {
	    this.set('animateCfg', cfg);
	    return this;
	  }

	  reset() {
	    this.set('attrOptions', {});
	    this.set('adjust', null);
	    this.clearInner();
	  }

	  clearInner() {
	    const container = this.get('container');
	    if (container) {
	      container.clear();
	      container.setMatrix([ 1, 0, 0, 1, 0, 0 ]);
	    }
	    container && container.clear();
	    this.set('attrs', {});
	    this.set('groupScales', null);
	    this.set('xDistance', null);
	    this.set('_width', null);
	  }

	  clear() {
	    this.clearInner();
	    this.set('scales', {});
	  }

	  destroy() {
	    this.clear();
	    super.destroy();
	  }

	  _display(visible) {
	    this.set('visible', visible);
	    const container = this.get('container');
	    const canvas = container.get('canvas');
	    container.set('visible', visible);
	    canvas.draw();
	  }

	  show() {
	    this._display(true);
	  }

	  hide() {
	    this._display(false);
	  }
	}

	var base$4 = Geom;

	function _mix$3(dist, obj) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
	      dist[key] = obj[key];
	    }
	  }
	}

	var mix$3 = function mix(dist, src1, src2, src3) {
	  if (src1) _mix$3(dist, src1);
	  if (src2) _mix$3(dist, src2);
	  if (src3) _mix$3(dist, src3);
	  return dist;
	};

	var mix_1$3 = mix$3;

	var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isObject$2 = function isObject(value) {
	  /**
	   * isObject({}) => true
	   * isObject([1, 2, 3]) => true
	   * isObject(Function) => true
	   * isObject(null) => false
	   */
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof$3(value);
	  return value !== null && type === 'object' || type === 'function';
	};

	var isObject_1$2 = isObject$2;

	var toString$3 = {}.toString;
	var isType$2 = function isType(value, type) {
	  return toString$3.call(value) === '[object ' + type + ']';
	};

	var isType_1$2 = isType$2;

	var isArray$2 = Array.isArray ? Array.isArray : function (value) {
	  return isType_1$2(value, 'Array');
	};

	var isArray_1$2 = isArray$2;

	var each$2 = function each(elements, func) {
	  if (!elements) {
	    return;
	  }
	  var rst = void 0;
	  if (isArray_1$2(elements)) {
	    for (var i = 0, len = elements.length; i < len; i++) {
	      rst = func(elements[i], i);
	      if (rst === false) {
	        break;
	      }
	    }
	  } else if (isObject_1$2(elements)) {
	    for (var k in elements) {
	      if (elements.hasOwnProperty(k)) {
	        rst = func(elements[k], k);
	        if (rst === false) {
	          break;
	        }
	      }
	    }
	  }
	};

	var each_1$2 = each$2;

	// isFinite,
	var isNil$2 = function isNil(value) {
	  /**
	   * isNil(null) => true
	   * isNil() => true
	   */
	  return value === null || value === undefined;
	};

	var isNil_1$2 = isNil$2;

	var Scale =
	/*#__PURE__*/
	function () {
	  var _proto = Scale.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    this.type = 'base';
	    /**
	     * 格式化函数,输出文本或者tick时的格式化函数
	     * @type {Function}
	     */

	    this.formatter = null;
	    /**
	     * 输出的值域
	     * @type {Array}
	     */

	    this.range = [0, 1];
	    /**
	     * 度量的标记
	     * @type {Array}
	     */

	    this.ticks = null;
	    /**
	     * 参与度量计算的值，可选项
	     * @type {Array}
	     */

	    this.values = [];
	  };

	  function Scale(cfg) {
	    this._initDefaultCfg();

	    mix_1$3(this, cfg);
	    this.init();
	  }
	  /**
	   * 度量初始化
	   * @protected
	   */


	  _proto.init = function init() {}
	  /**
	   * 获取该度量的ticks,返回的是多个对象，
	   *   - text: tick 的文本
	   *   - value: 对应的度量转换后的值
	   * <code>
	   *   [
	   *     {text: 0,value:0}
	   *     {text: 1,value:0.2}
	   *     {text: 2,value:0.4}
	   *     {text: 3,value:0.6}
	   *     {text: 4,value:0.8}
	   *     {text: 5,value:1}
	   *   ]
	   * </code>
	   * @param {Number} count 输出tick的个数的近似值，默认是 10
	   * @return {Array} 返回 ticks 数组
	   */
	  ;

	  _proto.getTicks = function getTicks() {
	    var self = this;
	    var ticks = self.ticks;
	    var rst = [];
	    each_1$2(ticks, function (tick) {
	      var obj;

	      if (isObject_1$2(tick)) {
	        obj = tick;
	      } else {
	        obj = {
	          text: self.getText(tick),
	          tickValue: tick,
	          value: self.scale(tick)
	        };
	      }

	      rst.push(obj);
	    });
	    return rst;
	  }
	  /**
	   * 获取格式化后的文本
	   * @param  {*} value 输入的数据
	   * @param  {*} key 字段的 key
	   * @return {String} 格式化的文本
	   */
	  ;

	  _proto.getText = function getText(value, key) {
	    var formatter = this.formatter;
	    value = formatter ? formatter(value, key) : value;

	    if (isNil_1$2(value) || !value.toString) {
	      value = '';
	    }

	    return value.toString();
	  }
	  /**
	   * 输出的值域最小值
	   * @protected
	   * @return {Number} 返回最小的值
	   */
	  ;

	  _proto.rangeMin = function rangeMin() {
	    return this.range[0];
	  }
	  /**
	   * 输出的值域最大值
	   * @protected
	   * @return {Number} 返回最大的值
	   */
	  ;

	  _proto.rangeMax = function rangeMax() {
	    var range = this.range;
	    return range[range.length - 1];
	  }
	  /**
	   * 度量转换后的结果，翻转回输入域
	   * @param  {Number} value 需要翻转的数值
	   * @return {*} 度量的输入值
	   */
	  ;

	  _proto.invert = function invert(value) {
	    return value;
	  }
	  /**
	   * 将传入的值从非数值转换成数值格式，如分类字符串、时间字符串等
	   * @param  {*} value 传入的值
	   * @return {Number} 转换的值
	   */
	  ;

	  _proto.translate = function translate(value) {
	    return value;
	  }
	  /**
	   * 进行度量转换
	   * @param  {*} value 输入值
	   * @return {Number} 输出值，在设定的输出值域之间，默认[0,1]
	   */
	  ;

	  _proto.scale = function scale(value) {
	    return value;
	  }
	  /**
	   * 克隆一个新的scale,拥有跟当前scale相同的输入域、输出域等
	   * @return {Scale} 克隆的度量
	   */
	  ;

	  _proto.clone = function clone() {
	    var self = this;
	    var constr = self.constructor;
	    var cfg = {};
	    each_1$2(self, function (v, k) {
	      cfg[k] = self[k];
	    });
	    return new constr(cfg);
	  }
	  /**
	   * 更改度量的属性信息
	   * @param  {Object} info 属性信息
	   * @chainable
	   * @return {Scale} 返回自身的引用
	   */
	  ;

	  _proto.change = function change(info) {
	    this.ticks = null;
	    mix_1$3(this, info);
	    this.init();
	    return this;
	  };

	  return Scale;
	}();

	var base$5 = Scale;

	/**
	 * 判断是否数字
	 * @return {Boolean} 是否数字
	 */


	var isNumber$1 = function isNumber(value) {
	  return isType_1$2(value, 'Number');
	};
	var isNumber_1$1 = isNumber$1;

	/**
	 * @fileOverview 计算方法
	 * @author dxq613@gmail.com
	 */
	// 如果小数点后面超过 10 位浮点数时进行一下处理
	var DECIMAL_LENGTH = 12; // 获取系数

	function getFactor(v) {
	  var factor = 1;

	  if (v === Infinity || v === -Infinity) {
	    throw new Error('Not support Infinity!');
	  }

	  if (v < 1) {
	    var count = 0;

	    while (v < 1) {
	      factor = factor / 10;
	      v = v * 10;
	      count++;
	    } // 浮点数计算出现问题


	    if (factor.toString().length > DECIMAL_LENGTH) {
	      factor = parseFloat(factor.toFixed(count));
	    }
	  } else {
	    while (v > 10) {
	      factor = factor * 10;
	      v = v / 10;
	    }
	  }

	  return factor;
	} // 取小于当前值的


	function arrayFloor(values, value) {
	  var length = values.length;

	  if (length === 0) {
	    return NaN;
	  }

	  var pre = values[0];

	  if (value < values[0]) {
	    return NaN;
	  }

	  if (value >= values[length - 1]) {
	    return values[length - 1];
	  }

	  for (var i = 1; i < values.length; i++) {
	    if (value < values[i]) {
	      break;
	    }

	    pre = values[i];
	  }

	  return pre;
	} // 大于当前值的第一个


	function arrayCeiling(values, value) {
	  var length = values.length;

	  if (length === 0) {
	    return NaN;
	  } // var pre = values[0];


	  var rst;

	  if (value > values[length - 1]) {
	    return NaN;
	  }

	  if (value < values[0]) {
	    return values[0];
	  }

	  for (var i = 1; i < values.length; i++) {
	    if (value <= values[i]) {
	      rst = values[i];
	      break;
	    }
	  }

	  return rst;
	}

	var Util$1 = {
	  // 获取逼近的数值
	  snapFactorTo: function snapFactorTo(v, arr, snapType) {
	    // 假设 v = -512,isFloor = true
	    if (isNaN(v)) {
	      return NaN;
	    }

	    var factor = 1; // 计算系数

	    if (v !== 0) {
	      if (v < 0) {
	        factor = -1;
	      }

	      v = v * factor; // v = 512

	      var tmpFactor = getFactor(v);
	      factor = factor * tmpFactor; // factor = -100

	      v = v / tmpFactor; // v = 5.12
	    }

	    if (snapType === 'floor') {
	      v = Util$1.snapFloor(arr, v); // v = 5
	    } else if (snapType === 'ceil') {
	      v = Util$1.snapCeiling(arr, v); // v = 6
	    } else {
	      v = Util$1.snapTo(arr, v); // 四舍五入 5
	    }

	    var rst = parseFloat((v * factor).toPrecision(DECIMAL_LENGTH)); // 如果出现浮点数计算问题，需要处理一下
	    // 如果出现浮点数计算问题，需要处理一下

	    if (Math.abs(factor) < 1 && rst.toString().length > DECIMAL_LENGTH) {
	      var decimalVal = parseInt(1 / factor);
	      var symbol = factor > 0 ? 1 : -1;
	      rst = v / decimalVal * symbol;
	    }

	    return rst;
	  },
	  // 获取逼近的倍数
	  snapMultiple: function snapMultiple(v, base, snapType) {
	    var div;

	    if (snapType === 'ceil') {
	      div = Math.ceil(v / base);
	    } else if (snapType === 'floor') {
	      div = Math.floor(v / base);
	    } else {
	      div = Math.round(v / base);
	    }

	    return div * base;
	  },

	  /**
	   * 获取逼近的值，用于对齐数据
	   * @param  {Array} values   数据集合
	   * @param  {Number} value   数值
	   * @return {Number} 逼近的值
	   */
	  snapTo: function snapTo(values, value) {
	    // 这里假定values是升序排列
	    var floorVal = arrayFloor(values, value);
	    var ceilingVal = arrayCeiling(values, value);

	    if (isNaN(floorVal) || isNaN(ceilingVal)) {
	      if (values[0] >= value) {
	        return values[0];
	      }

	      var last = values[values.length - 1];

	      if (last <= value) {
	        return last;
	      }
	    }

	    if (Math.abs(value - floorVal) < Math.abs(ceilingVal - value)) {
	      return floorVal;
	    }

	    return ceilingVal;
	  },

	  /**
	   * 获取逼近的最小值，用于对齐数据
	   * @param  {Array} values   数据集合
	   * @param  {Number} value   数值
	   * @return {Number} 逼近的最小值
	   */
	  snapFloor: function snapFloor(values, value) {
	    // 这里假定values是升序排列
	    return arrayFloor(values, value);
	  },

	  /**
	   * 获取逼近的最大值，用于对齐数据
	   * @param  {Array} values   数据集合
	   * @param  {Number} value   数值
	   * @return {Number} 逼近的最大值
	   */
	  snapCeiling: function snapCeiling(values, value) {
	    // 这里假定values是升序排列
	    return arrayCeiling(values, value);
	  },
	  fixedBase: function fixedBase(v, base) {
	    var str = base.toString();
	    var index = str.indexOf('.');
	    var indexOfExp = str.indexOf('e-'); // 判断是否带小数点，1.000001 1.23e-9

	    if (index < 0 && indexOfExp < 0) {
	      // base为整数
	      return Math.round(v);
	    }

	    var length = indexOfExp >= 0 ? parseInt(str.substr(indexOfExp + 2), 10) : str.substr(index + 1).length;

	    if (length > 20) {
	      length = 20;
	    }

	    return parseFloat(v.toFixed(length));
	  }
	};
	var util = Util$1;

	/**
	 * @fileOverview 自动计算数字坐标轴
	 * @author dxq613@gmail.com
	 */






	var MIN_COUNT = 5;
	var MAX_COUNT = 7;
	var SNAP_COUNT_ARRAY = [0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10];
	var SNAP_ARRAY = [0, 1, 2, 4, 5, 10];
	var EPS = 1e-12;

	var number = function (info) {
	  var min = info.min;
	  var max = info.max;
	  var interval = info.interval;
	  var minTickInterval = info.minTickInterval;
	  var ticks = [];
	  var minCount = info.minCount || MIN_COUNT;
	  var maxCount = info.maxCount || MAX_COUNT;
	  var isFixedCount = minCount === maxCount; // 是否限定死了个数

	  var minLimit = isNil_1$2(info.minLimit) ? -Infinity : info.minLimit; // 限定的最小值

	  var maxLimit = isNil_1$2(info.maxLimit) ? Infinity : info.maxLimit; // 限定最大值

	  var avgCount = (minCount + maxCount) / 2;
	  var count = avgCount; // 用户传入的逼近数组

	  var snapArray = info.snapArray ? info.snapArray : isFixedCount ? SNAP_COUNT_ARRAY : SNAP_ARRAY; // 如果限定大小范围，同时大小范围等于用户传入的范围，同时限定了个数，interval 按照个数均分

	  if (min === minLimit && max === maxLimit && isFixedCount) {
	    interval = (max - min) / (count - 1);
	  }

	  if (isNil_1$2(min)) {
	    min = 0;
	  }

	  if (isNil_1$2(max)) {
	    max = 0;
	  }

	  if (Math.abs(max - min) < EPS) {
	    if (min === 0) {
	      max = 1;
	    } else {
	      if (min > 0) {
	        min = 0;
	      } else {
	        max = 0;
	      }
	    }

	    if (max - min < 5 && !interval && max - min >= 1) {
	      interval = 1;
	    }
	  }

	  if (isNil_1$2(interval)) {
	    // 计算间距
	    var temp = (max - min) / (avgCount - 1);
	    interval = util.snapFactorTo(temp, snapArray, 'ceil');

	    if (maxCount !== minCount) {
	      count = parseInt((max - min) / interval, 10);

	      if (count > maxCount) {
	        count = maxCount;
	      }

	      if (count < minCount) {
	        count = minCount;
	      } // 不确定tick的个数时，使得tick偏小


	      interval = util.snapFactorTo((max - min) / (count - 1), snapArray, 'floor');
	    }
	  } // interval should not be less than minTickInterval


	  if (isNumber_1$1(minTickInterval) && interval < minTickInterval) {
	    interval = minTickInterval;
	  }

	  if (info.interval || maxCount !== minCount) {
	    // 校正 max 和 min
	    max = Math.min(util.snapMultiple(max, interval, 'ceil'), maxLimit); // 向上逼近

	    min = Math.max(util.snapMultiple(min, interval, 'floor'), minLimit); // 向下逼近

	    count = Math.round((max - min) / interval);
	    min = util.fixedBase(min, interval);
	    max = util.fixedBase(max, interval);
	  } else {
	    avgCount = parseInt(avgCount, 10); // 取整

	    var avg = (max + min) / 2;
	    var avgTick = util.snapMultiple(avg, interval, 'ceil');
	    var sideCount = Math.floor((avgCount - 2) / 2);
	    var maxTick = avgTick + sideCount * interval;
	    var minTick;

	    if (avgCount % 2 === 0) {
	      minTick = avgTick - sideCount * interval;
	    } else {
	      minTick = avgTick - (sideCount + 1) * interval;
	    }

	    var prevMaxTick = null; // 如果减去intervl, fixBase后，新的minTick没有大于之前的值，就退出，防止死循环

	    while (maxTick < max && (prevMaxTick === null || maxTick > prevMaxTick)) {
	      // 保证计算出来的刻度最大值 maxTick 不小于数据最大值 max
	      prevMaxTick = maxTick;
	      maxTick = util.fixedBase(maxTick + interval, interval);
	    }

	    var prevMinTick = null; // 如果减去intervl, fixBase后，新的minTick没有小于之前的值，就退出，防止死循环

	    while (minTick > min && (prevMinTick === null || minTick < prevMinTick)) {
	      // 保证计算出来的刻度最小值 minTick 不小于数据最大值 min
	      prevMinTick = minTick;
	      minTick = util.fixedBase(minTick - interval, interval); // 防止超常浮点数计算问题
	    }

	    max = maxTick;
	    min = minTick;
	  }

	  max = Math.min(max, maxLimit);
	  min = Math.max(min, minLimit);
	  ticks.push(min);

	  for (var i = 1; i < count; i++) {
	    var tickValue = util.fixedBase(interval * i + min, interval);

	    if (tickValue < max) {
	      ticks.push(tickValue);
	    }
	  }

	  if (ticks[ticks.length - 1] < max) {
	    ticks.push(max);
	  }

	  return {
	    min: min,
	    max: max,
	    interval: interval,
	    count: count,
	    ticks: ticks
	  };
	};

	function _inheritsLoose$3(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

	/**
	 * @fileOverview The measurement of linear data scale function
	 * @author dxq613@gmail.com
	 */







	/**
	 * 线性度量
	 * @class Scale.Linear
	 */


	var Linear =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose$3(Linear, _Base);

	  function Linear() {
	    return _Base.apply(this, arguments) || this;
	  }

	  var _proto = Linear.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    _Base.prototype._initDefaultCfg.call(this);

	    var self = this;
	    self.type = 'linear';
	    self.isLinear = true;
	    /**
	     * 是否为了用户习惯，优化min,max和ticks，如果进行优化，则会根据生成的ticks调整min,max，否则舍弃(min,max)范围之外的ticks
	     * @type {Boolean}
	     * @default false
	     */

	    self.nice = false;
	    /**
	     * min value of the scale
	     * @type {Number}
	     * @default null
	     */

	    self.min = null;
	    /**
	     * min value limitted of the scale
	     * @type {Number}
	     * @default null
	     */

	    self.minLimit = null;
	    /**
	     * max value of the scale
	     * @type {Number}
	     * @default null
	     */

	    self.max = null;
	    /**
	     * max value limitted of the scale
	     * @type {Number}
	     * @default null
	     */

	    self.maxLimit = null;
	    /**
	     * 自动生成标记时的个数
	     * @type {Number}
	     * @default null
	     */

	    self.tickCount = null;
	    /**
	     * 坐标轴点之间的间距，指的是真实数据的差值
	     * @type {Number}
	     * @default null
	     */

	    self.tickInterval = null;
	    /**
	     * 坐标轴点之间的最小间距，指的是真实数据的差值
	     * @type {Number}
	     * @default null
	     */

	    self.minTickInterval = null;
	    /**
	     * 用于计算坐标点时逼近的数组
	     * @type {Array}
	     */

	    self.snapArray = null;
	  }
	  /**
	   * @protected
	   * @override
	   */
	  ;

	  _proto.init = function init() {
	    var self = this;

	    if (!self.ticks) {
	      self.min = self.translate(self.min);
	      self.max = self.translate(self.max);
	      self.initTicks();
	    } else {
	      var ticks = self.ticks;
	      var firstValue = self.translate(ticks[0]);
	      var lastValue = self.translate(ticks[ticks.length - 1]);

	      if (isNil_1$2(self.min) || self.min > firstValue) {
	        self.min = firstValue;
	      }

	      if (isNil_1$2(self.max) || self.max < lastValue) {
	        self.max = lastValue;
	      }
	    }
	  }
	  /**
	   * 计算坐标点
	   * @protected
	   * @return {Array} 计算完成的坐标点
	   */
	  ;

	  _proto.calculateTicks = function calculateTicks() {
	    var min = this.min,
	        max = this.max,
	        minLimit = this.minLimit,
	        maxLimit = this.maxLimit,
	        tickCount = this.tickCount,
	        tickInterval = this.tickInterval,
	        minTickInterval = this.minTickInterval,
	        snapArray = this.snapArray;

	    if (tickCount === 1) {
	      throw new Error('linear scale\'tickCount should not be 1');
	    }

	    if (max < min) {
	      throw new Error("max: " + max + " should not be less than min: " + min);
	    }

	    var tmp = number({
	      min: min,
	      max: max,
	      minLimit: minLimit,
	      maxLimit: maxLimit,
	      minCount: tickCount,
	      maxCount: tickCount,
	      interval: tickInterval,
	      minTickInterval: minTickInterval,
	      snapArray: snapArray
	    });
	    return tmp.ticks;
	  } // 初始化ticks
	  ;

	  _proto.initTicks = function initTicks() {
	    var self = this;
	    var calTicks = self.calculateTicks();

	    if (self.nice) {
	      // 如果需要优化显示的tick
	      self.ticks = calTicks;
	      self.min = calTicks[0];
	      self.max = calTicks[calTicks.length - 1];
	    } else {
	      var ticks = [];
	      each_1$2(calTicks, function (tick) {
	        if (tick >= self.min && tick <= self.max) {
	          ticks.push(tick);
	        }
	      }); // 如果 ticks 为空，直接输入最小值、最大值

	      if (!ticks.length) {
	        ticks.push(self.min);
	        ticks.push(self.max);
	      }

	      self.ticks = ticks;
	    }
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.scale = function scale(value) {
	    if (isNil_1$2(value)) {
	      return NaN;
	    }

	    var max = this.max;
	    var min = this.min;

	    if (max === min) {
	      return 0;
	    }

	    var percent = (value - min) / (max - min);
	    var rangeMin = this.rangeMin();
	    var rangeMax = this.rangeMax();
	    return rangeMin + percent * (rangeMax - rangeMin);
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.invert = function invert(value) {
	    var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
	    return this.min + percent * (this.max - this.min);
	  };

	  return Linear;
	}(base$5);

	base$5.Linear = Linear;

	function _inheritsLoose$4(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }





	var Identity =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose$4(Identity, _Base);

	  function Identity() {
	    return _Base.apply(this, arguments) || this;
	  }

	  var _proto = Identity.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    _Base.prototype._initDefaultCfg.call(this);

	    this.isIdentity = true;
	    this.type = 'identity';
	    /**
	     * 常量值
	     * @type {*}
	     */

	    this.value = null;
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.getText = function getText() {
	    return this.value.toString();
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.scale = function scale(value) {
	    if (this.value !== value && isNumber_1$1(value)) {
	      return value;
	    }

	    return this.range[0];
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.invert = function invert() {
	    return this.value;
	  };

	  return Identity;
	}(base$5);

	base$5.Identity = Identity;

	/**
	 * @fileOverview 计算分类的的坐标点
	 * @author dxq613@gmail.com
	 */


	var MAX_COUNT$1 = 8;
	var SUB_COUNT = 4; // 控制个数不能过小

	function getSimpleArray(data) {
	  var arr = [];
	  each_1$2(data, function (sub) {
	    arr = arr.concat(sub);
	  });
	  return arr;
	}

	function getGreatestFactor(count, number) {
	  var i;

	  for (i = number; i > 0; i--) {
	    if (count % i === 0) {
	      break;
	    }
	  } // 如果是素数，没有可以整除的数字


	  if (i === 1) {
	    for (i = number; i > 0; i--) {
	      if ((count - 1) % i === 0) {
	        break;
	      }
	    }
	  }

	  return i;
	}

	var cat = function (info) {
	  var rst = {};
	  var ticks = [];
	  var isRounding = info.isRounding;
	  var categories = getSimpleArray(info.data);
	  var length = categories.length;
	  var maxCount = info.maxCount || MAX_COUNT$1;
	  var tickCount;

	  if (isRounding) {
	    // 取整操作
	    tickCount = getGreatestFactor(length - 1, maxCount - 1) + 1; // 如果计算出来只有两个坐标点，则直接使用传入的 maxCount

	    if (tickCount === 2) {
	      tickCount = maxCount;
	    } else if (tickCount < maxCount - SUB_COUNT) {
	      tickCount = maxCount - SUB_COUNT;
	    }
	  } else {
	    tickCount = maxCount;
	  }

	  if (!isRounding && length <= tickCount + tickCount / 2) {
	    ticks = [].concat(categories);
	  } else {
	    var step = parseInt(length / (tickCount - 1), 10);
	    var groups = categories.map(function (e, i) {
	      return i % step === 0 ? categories.slice(i, i + step) : null;
	    }).filter(function (e) {
	      return e;
	    });

	    for (var i = 1, groupLen = groups.length; i < groupLen && (isRounding ? i * step < length - step : i < tickCount - 1); i++) {
	      ticks.push(groups[i][0]);
	    }

	    if (categories.length) {
	      ticks.unshift(categories[0]);
	      var last = categories[length - 1];

	      if (ticks.indexOf(last) === -1) {
	        ticks.push(last);
	      }
	    }
	  }

	  rst.categories = categories;
	  rst.ticks = ticks;
	  return rst;
	};

	var isString$2 = function isString(str) {
	  return isType_1$2(str, 'String');
	};

	var isString_1$2 = isString$2;

	function _inheritsLoose$5(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }











	var Category =
	/*#__PURE__*/
	function (_Base) {
	  _inheritsLoose$5(Category, _Base);

	  function Category() {
	    return _Base.apply(this, arguments) || this;
	  }

	  var _proto = Category.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    _Base.prototype._initDefaultCfg.call(this);

	    this.type = 'cat';
	    /**
	     * 是否分类度量
	     * @type {Boolean}
	     */

	    this.isCategory = true;
	    this.isRounding = true; // 是否进行取整操作
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.init = function init() {
	    var self = this;
	    var values = self.values;
	    var tickCount = self.tickCount;
	    each_1$2(values, function (v, i) {
	      values[i] = v.toString();
	    });

	    if (!self.ticks) {
	      var ticks = values;

	      if (tickCount) {
	        var temp = cat({
	          maxCount: tickCount,
	          data: values,
	          isRounding: self.isRounding
	        });
	        ticks = temp.ticks;
	      }

	      this.ticks = ticks;
	    }
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.getText = function getText(value) {
	    if (this.values.indexOf(value) === -1 && isNumber_1$1(value)) {
	      value = this.values[Math.round(value)];
	    }

	    return _Base.prototype.getText.call(this, value);
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.translate = function translate(value) {
	    var index = this.values.indexOf(value);

	    if (index === -1 && isNumber_1$1(value)) {
	      index = value;
	    } else if (index === -1) {
	      index = NaN;
	    }

	    return index;
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.scale = function scale(value) {
	    var rangeMin = this.rangeMin();
	    var rangeMax = this.rangeMax();
	    var percent;

	    if (isString_1$2(value) || this.values.indexOf(value) !== -1) {
	      value = this.translate(value);
	    }

	    if (this.values.length > 1) {
	      percent = value / (this.values.length - 1);
	    } else {
	      percent = value;
	    }

	    return rangeMin + percent * (rangeMax - rangeMin);
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.invert = function invert(value) {
	    if (isString_1$2(value)) {
	      // 如果已经是字符串
	      return value;
	    }

	    var min = this.rangeMin();
	    var max = this.rangeMax(); // 归一到 范围内

	    if (value < min) {
	      value = min;
	    }

	    if (value > max) {
	      value = max;
	    }

	    var percent = (value - min) / (max - min);
	    var index = Math.round(percent * (this.values.length - 1)) % this.values.length;
	    index = index || 0;
	    return this.values[index];
	  };

	  return Category;
	}(base$5);

	base$5.Cat = Category;
	var category = Category;

	var scale = base$5;

	const SCALE_TYPES_MAP = {
	  linear: 'Linear',
	  cat: 'Cat',
	  timeCat: 'TimeCat',
	  identity: 'Identity'
	};

	class ScaleController {
	  constructor(cfg) {
	    // defs 列定义
	    this.defs = {};
	    common.mix(this, cfg);
	  }

	  _getDef(field) {
	    const defs = this.defs;
	    let def = null;
	    if (global$1.scales[field] || defs[field]) {
	      def = common.mix({}, global$1.scales[field]);
	      common.each(defs[field], function(v, k) {
	        if (common.isNil(v)) {
	          delete def[k];
	        } else {
	          def[k] = v;
	        }
	      });
	    }
	    return def;
	  }

	  _getDefaultType(field, data, def) {
	    if (def && def.type) {
	      return def.type;
	    }
	    let type = 'linear';
	    let value = common.Array.firstValue(data, field);
	    if (common.isArray(value)) {
	      value = value[0];
	    }
	    if (common.isString(value)) {
	      type = 'cat';
	    }
	    return type;
	  }

	  _getScaleCfg(type, field, data, def) {
	    let values;
	    if (def && def.values) {
	      values = def.values;
	    } else {
	      values = common.Array.values(data, field);
	    }
	    const cfg = {
	      field,
	      values
	    };

	    if (type !== 'cat' && type !== 'timeCat') {
	      if (!def || !(def.min && def.max)) {
	        const { min, max } = common.Array.getRange(values);
	        cfg.min = min;
	        cfg.max = max;
	        cfg.nice = true;
	      }
	    } else {
	      cfg.isRounding = false; // used for tickCount calculation
	    }

	    return cfg;
	  }

	  createScale(field, data) {
	    const self = this;
	    const def = self._getDef(field);
	    let scale$1;
	    if (!data || !data.length) {
	      if (def && def.type) {
	        def.field = field;
	        scale$1 = new scale[SCALE_TYPES_MAP[def.type]](def);
	      } else {
	        scale$1 = new scale.Identity({
	          value: field,
	          field: field.toString(),
	          values: [ field ]
	        });
	      }
	      return scale$1;
	    }
	    const firstObj = data[0];
	    let firstValue = firstObj[field];
	    if (firstValue === null) {
	      firstValue = common.Array.firstValue(data, field);
	    }

	    if (common.isNumber(field) || (common.isNil(firstValue)) && !def) {
	      scale$1 = new scale.Identity({
	        value: field,
	        field: field.toString(),
	        values: [ field ]
	      });
	    } else {
	      const type = self._getDefaultType(field, data, def);
	      const cfg = self._getScaleCfg(type, field, data, def);
	      def && common.mix(cfg, def);
	      scale$1 = new scale[SCALE_TYPES_MAP[type]](cfg);
	    }
	    return scale$1;
	  }
	}

	var scale$1 = ScaleController;

	class Abastract {
	  _initDefaultCfg() {
	    /**
	     * ticks
	     * @type {Array}
	     */
	    this.ticks = [];
	    /**
	     * the configuration for tickLine
	     * @type {Object}
	     */
	    this.tickLine = {};
	    /**
	     * the direction of ticks, 1 means clockwise
	     * @type {Number}
	     */
	    this.offsetFactor = 1;
	    /**
	     * the top container
	     * @type {container}
	     */
	    this.frontContainer = null;
	    /**
	     * the back container
	     * @type {[type]}
	     */
	    this.backContainer = null;
	    /**
	     * points for draw grid line
	     * @type {Array}
	     */
	    this.gridPoints = [];
	  }

	  constructor(cfg) {
	    this._initDefaultCfg();
	    common.mix(this, cfg);
	    this.draw();
	  }

	  draw() {
	    const { line, tickLine, label, grid } = this;

	    grid && this.drawGrid(grid); // draw the grid lines
	    tickLine && this.drawTicks(tickLine); // draw the tickLine
	    line && this.drawLine(line); // draw axis line
	    label && this.drawLabels(); // draw ticks
	  }

	  drawTicks(tickCfg) {
	    const self = this;
	    const ticks = self.ticks;
	    const length = tickCfg.length;
	    const container = self.getContainer(tickCfg.top);
	    common.each(ticks, function(tick) {
	      const start = self.getOffsetPoint(tick.value);
	      const end = self.getSidePoint(start, length);
	      const shape = container.addShape('line', {
	        className: 'axis-tick',
	        attrs: common.mix({
	          x1: start.x,
	          y1: start.y,
	          x2: end.x,
	          y2: end.y
	        }, tickCfg)
	      });
	      shape._id = self._id + '-ticks';
	    });
	  }

	  drawLabels() {
	    const self = this;
	    const labelOffset = self.labelOffset;
	    const labels = self.labels;
	    common.each(labels, labelShape => {
	      const container = self.getContainer(labelShape.get('top'));
	      const start = self.getOffsetPoint(labelShape.get('value'));
	      const { x, y } = self.getSidePoint(start, labelOffset);
	      labelShape.attr(common.mix({
	        x,
	        y
	      }, self.getTextAlignInfo(start, labelOffset), labelShape.get('textStyle')));
	      labelShape._id = self._id + '-' + labelShape.attr('text');
	      container.add(labelShape);
	    });
	  }

	  drawLine() {}

	  drawGrid(grid) {
	    const self = this;
	    const { gridPoints, ticks } = self;
	    let gridCfg = grid;
	    const count = gridPoints.length;

	    common.each(gridPoints, function(subPoints, index) {
	      if (common.isFunction(grid)) {
	        const tick = ticks[index] || {};
	        const executedGrid = grid(tick.text, index, count);
	        gridCfg = executedGrid ? common.mix({}, global$1._defaultAxis.grid, executedGrid) : null;
	      }

	      if (gridCfg) {
	        const type = gridCfg.type; // has two types: 'line' and 'arc'
	        const points = subPoints.points;
	        const container = self.getContainer(gridCfg.top);
	        let shape;

	        if (type === 'arc') {
	          const { center, startAngle, endAngle } = self;
	          const radius = vector2.length([ points[0].x - center.x, points[0].y - center.y ]);
	          shape = container.addShape('Arc', {
	            className: 'axis-grid',
	            attrs: common.mix({
	              x: center.x,
	              y: center.y,
	              startAngle,
	              endAngle,
	              r: radius
	            }, gridCfg)
	          });
	        } else {
	          shape = container.addShape('Polyline', {
	            className: 'axis-grid',
	            attrs: common.mix({
	              points
	            }, gridCfg)
	          });
	        }

	        shape._id = subPoints._id;
	      }
	    });
	  }

	  getOffsetPoint() {}
	  getAxisVector() {}

	  getOffsetVector(point, offset) {
	    const self = this;
	    const axisVector = self.getAxisVector(point);
	    const normal = vector2.normalize([], axisVector);
	    const factor = self.offsetFactor;
	    const verticalVector = [ normal[1] * -1 * factor, normal[0] * factor ];
	    return vector2.scale([], verticalVector, offset);
	  }

	  getSidePoint(point, offset) {
	    const self = this;
	    const offsetVector = self.getOffsetVector(point, offset);
	    return {
	      x: point.x + offsetVector[0],
	      y: point.y + offsetVector[1]
	    };
	  }

	  getTextAlignInfo(point, offset) {
	    const self = this;
	    const offsetVector = self.getOffsetVector(point, offset);
	    let align;
	    let baseLine;
	    if (offsetVector[0] > 0) {
	      align = 'left';
	    } else if (offsetVector[0] < 0) {
	      align = 'right';
	    } else {
	      align = 'center';
	    }
	    if (offsetVector[1] > 0) {
	      baseLine = 'top';
	    } else if (offsetVector[1] < 0) {
	      baseLine = 'bottom';
	    } else {
	      baseLine = 'middle';
	    }
	    return {
	      textAlign: align,
	      textBaseline: baseLine
	    };
	  }

	  getContainer(isTop) {
	    const { frontContainer, backContainer } = this;
	    return isTop ? frontContainer : backContainer;
	  }
	}

	var abstract_1 = Abastract;

	class Line extends abstract_1 {
	  _initDefaultCfg() {
	    super._initDefaultCfg();
	    this.start = null;
	    this.end = null;
	  }

	  getOffsetPoint(value) {
	    const { start, end } = this;
	    return {
	      x: start.x + (end.x - start.x) * value,
	      y: start.y + (end.y - start.y) * value
	    };
	  }

	  getAxisVector() {
	    const { start, end } = this;
	    return [ end.x - start.x, end.y - start.y ];
	  }

	  drawLine(lineCfg) {
	    const container = this.getContainer(lineCfg.top);
	    const { start, end } = this;
	    container.addShape('line', {
	      className: 'axis-line',
	      attrs: common.mix({
	        x1: start.x,
	        y1: start.y,
	        x2: end.x,
	        y2: end.y
	      }, lineCfg)
	    });
	  }
	}

	abstract_1.Line = Line;

	var axis = abstract_1;

	function _mod(n, m) {
	  return ((n % m) + m) % m;
	}

	function _addStop(steps, gradient) {
	  common.each(steps, item => {
	    item = item.split(':');
	    gradient.addColorStop(Number(item[0]), item[1]);
	  });
	}

	// the string format: 'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
	function _parseLineGradient(color, shape, context) {
	  const arr = color.split(' ');
	  let angle = arr[0].slice(2, arr[0].length - 1);
	  angle = _mod((parseFloat(angle) * Math.PI) / 180, Math.PI * 2);
	  const steps = arr.slice(1);

	  const { minX, minY, maxX, maxY } = shape.getBBox();
	  let start;
	  let end;

	  if (angle >= 0 && angle < 0.5 * Math.PI) {
	    start = {
	      x: minX,
	      y: minY
	    };
	    end = {
	      x: maxX,
	      y: maxY
	    };
	  } else if (0.5 * Math.PI <= angle && angle < Math.PI) {
	    start = {
	      x: maxX,
	      y: minY
	    };
	    end = {
	      x: minX,
	      y: maxY
	    };
	  } else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
	    start = {
	      x: maxX,
	      y: maxY
	    };
	    end = {
	      x: minX,
	      y: minY
	    };
	  } else {
	    start = {
	      x: minX,
	      y: maxY
	    };
	    end = {
	      x: maxX,
	      y: minY
	    };
	  }

	  const tanTheta = Math.tan(angle);
	  const tanTheta2 = tanTheta * tanTheta;

	  const x = ((end.x - start.x) + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
	  const y = tanTheta * ((end.x - start.x) + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.y;
	  const gradient = context.createLinearGradient(start.x, start.y, x, y);
	  _addStop(steps, gradient);
	  return gradient;
	}

	// the string format: 'r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff'
	function _parseRadialGradient(color, shape, context) {
	  const arr = color.split(' ');
	  let circleCfg = arr[0].slice(2, arr[0].length - 1);
	  circleCfg = circleCfg.split(',');
	  const fx = parseFloat(circleCfg[0]);
	  const fy = parseFloat(circleCfg[1]);
	  const fr = parseFloat(circleCfg[2]);
	  const steps = arr.slice(1);
	  // if radius is 0, no gradient, stroke with the last color
	  if (fr === 0) {
	    const color = steps[steps.length - 1];
	    return color.split(':')[1];
	  }
	  const { width, height, minX, minY } = shape.getBBox();
	  const r = Math.sqrt(width * width + height * height) / 2;
	  const gradient = context.createRadialGradient(minX + width * fx, minY + height * fy, fr * r, minX + width / 2, minY + height / 2, r);
	  _addStop(steps, gradient);
	  return gradient;
	}

	var styleParse = {
	  parseStyle(color, shape, context) {
	    if (color[1] === '(') {
	      try {
	        const firstCode = color[0];
	        if (firstCode === 'l') {
	          return _parseLineGradient(color, shape, context);
	        } else if (firstCode === 'r') {
	          return _parseRadialGradient(color, shape, context);
	        }
	      } catch (ev) {
	        console.error('error in parsing gradient string, please check if there are any extra whitespaces.');
	        console.error(ev);
	      }
	    }
	    return color;
	  }
	};

	function isUnchanged(m) {
	  return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
	}

	const ALIAS_ATTRS_MAP = {
	  stroke: 'strokeStyle',
	  fill: 'fillStyle',
	  opacity: 'globalAlpha'
	};

	const SHAPE_ATTRS = [
	  'fillStyle',
	  'font',
	  'globalAlpha',
	  'lineCap',
	  'lineWidth',
	  'lineJoin',
	  'miterLimit',
	  'shadowBlur',
	  'shadowColor',
	  'shadowOffsetX',
	  'shadowOffsetY',
	  'strokeStyle',
	  'textAlign',
	  'textBaseline',
	  'lineDash',
	  'shadow' // 兼容支付宝小程序
	];

	const CLIP_SHAPES = [ 'circle', 'sector', 'polygon', 'rect', 'polyline' ];

	class Element {
	  _initProperties() {
	    this._attrs = {
	      zIndex: 0,
	      visible: true,
	      destroyed: false
	    };
	  }

	  constructor(cfg) {
	    this._initProperties();
	    common.mix(this._attrs, cfg);

	    const attrs = this._attrs.attrs;
	    if (attrs) {
	      this.initAttrs(attrs);
	    }

	    this.initTransform();
	  }

	  get(name) {
	    return this._attrs[name];
	  }

	  set(name, value) {
	    this._attrs[name] = value;
	  }

	  isGroup() {
	    return this.get('isGroup');
	  }

	  isShape() {
	    return this.get('isShape');
	  }

	  initAttrs(attrs) {
	    this.attr(common.mix(this.getDefaultAttrs(), attrs));
	  }

	  getDefaultAttrs() {
	    return {};
	  }

	  _setAttr(name, value) {
	    const attrs = this._attrs.attrs;
	    if (name === 'clip') {
	      value = this._setAttrClip(value);
	    } else {
	      const alias = ALIAS_ATTRS_MAP[name];
	      if (alias) {
	        attrs[alias] = value;
	      }
	    }
	    attrs[name] = value;
	  }

	  _getAttr(name) {
	    return this._attrs.attrs[name];
	  }

	  // _afterAttrsSet() {}

	  _setAttrClip(clip) {
	    if (clip && (CLIP_SHAPES.indexOf(clip._attrs.type) > -1)) {
	      if (clip.get('canvas') === null) {
	        clip = Object.assign({}, clip);
	      }
	      clip.set('parent', this.get('parent'));
	      clip.set('context', this.get('context'));
	      return clip;
	    }
	    return null;
	  }

	  attr(name, value) {
	    const self = this;
	    if (self.get('destroyed')) return null;
	    const argumentsLen = arguments.length;
	    if (argumentsLen === 0) {
	      return self._attrs.attrs;
	    }

	    if (common.isObject(name)) {
	      this._attrs.bbox = null;
	      for (const k in name) {
	        self._setAttr(k, name[k]);
	      }
	      if (self._afterAttrsSet) {
	        self._afterAttrsSet();
	      }
	      return self;
	    }
	    if (argumentsLen === 2) {
	      this._attrs.bbox = null;
	      self._setAttr(name, value);
	      if (self._afterAttrsSet) {
	        self._afterAttrsSet();
	      }
	      return self;
	    }
	    return self._getAttr(name);
	  }

	  getParent() {
	    return this.get('parent');
	  }

	  draw(context) {
	    if (this.get('destroyed')) {
	      return;
	    }
	    if (this.get('visible')) {
	      this.setContext(context);
	      this.drawInner(context);
	      this.restoreContext(context);
	    }
	  }

	  setContext(context) {
	    const clip = this._attrs.attrs.clip;
	    context.save();
	    if (clip) {
	      clip.resetTransform(context);
	      clip.createPath(context);
	      context.clip();
	    }
	    this.resetContext(context);
	    this.resetTransform(context);
	  }

	  restoreContext(context) {
	    context.restore();
	  }

	  resetContext(context) {
	    const elAttrs = this._attrs.attrs;
	    if (!this._attrs.isGroup) {
	      for (const k in elAttrs) {
	        if (SHAPE_ATTRS.indexOf(k) > -1) {
	          let v = elAttrs[k];
	          if (k === 'fillStyle' || k === 'strokeStyle') {
	            v = styleParse.parseStyle(v, this, context);
	          }
	          if (k === 'lineDash' && context.setLineDash && common.isArray(v)) {
	            context.setLineDash(v);
	          } else {
	            context[k] = v;
	          }
	        }
	      }
	    }
	  }

	  hasFill() {
	    return this.get('canFill') && this._attrs.attrs.fillStyle;
	  }

	  hasStroke() {
	    return this.get('canStroke') && this._attrs.attrs.strokeStyle;
	  }

	  drawInner(/* context */) {

	  }

	  show() {
	    this.set('visible', true);
	    return this;
	  }

	  hide() {
	    this.set('visible', false);
	    return this;
	  }

	  isVisible() {
	    return this.get('visible');
	  }

	  _removeFromParent() {
	    const parent = this.get('parent');
	    if (parent) {
	      const children = parent.get('children');
	      common.Array.remove(children, this);
	    }

	    return this;
	  }

	  remove(destroy) {
	    if (destroy) {
	      this.destroy();
	    } else {
	      this._removeFromParent();
	    }
	  }

	  destroy() {
	    const destroyed = this.get('destroyed');

	    if (destroyed) {
	      return null;
	    }

	    this._removeFromParent();

	    this._attrs = {};
	    this.set('destroyed', true);
	  }

	  getBBox() {
	    return {
	      minX: 0,
	      maxX: 0,
	      minY: 0,
	      maxY: 0,
	      width: 0,
	      height: 0
	    };
	  }

	  initTransform() {
	    const attrs = this._attrs.attrs || {};
	    if (!attrs.matrix) {
	      attrs.matrix = [ 1, 0, 0, 1, 0, 0 ];
	    }
	    this._attrs.attrs = attrs;
	  }

	  getMatrix() {
	    return this._attrs.attrs.matrix;
	  }

	  setMatrix(m) {
	    this._attrs.attrs.matrix = [ m[0], m[1], m[2], m[3], m[4], m[5] ];
	  }

	  transform(actions) {
	    const matrix$1 = this._attrs.attrs.matrix;
	    this._attrs.attrs.matrix = matrix.transform(matrix$1, actions);
	    return this;
	  }

	  setTransform(actions) {
	    this._attrs.attrs.matrix = [ 1, 0, 0, 1, 0, 0 ];
	    return this.transform(actions);
	  }

	  translate(x, y) {
	    const matrix$1 = this._attrs.attrs.matrix;
	    matrix.translate(matrix$1, matrix$1, [ x, y ]);
	  }

	  rotate(rad) {
	    const matrix$1 = this._attrs.attrs.matrix;
	    matrix.rotate(matrix$1, matrix$1, rad);
	  }

	  scale(sx, sy) {
	    const matrix$1 = this._attrs.attrs.matrix;
	    matrix.scale(matrix$1, matrix$1, [ sx, sy ]);
	  }

	  moveTo(x, y) {
	    const cx = this._attrs.x || 0;
	    const cy = this._attrs.y || 0;
	    this.translate(x - cx, y - cy);
	    this.set('x', x);
	    this.set('y', y);
	  }

	  apply(v) {
	    const m = this._attrs.attrs.matrix;
	    vector2.transformMat2d(v, v, m);
	    return this;
	  }

	  resetTransform(context) {
	    const mo = this._attrs.attrs.matrix;
	    if (!isUnchanged(mo)) {
	      context.transform(mo[0], mo[1], mo[2], mo[3], mo[4], mo[5]);
	    }
	  }

	  isDestroyed() {
	    return this.get('destroyed');
	  }
	}

	var element = Element;

	class Shape$2 extends element {
	  _initProperties() {
	    this._attrs = {
	      zIndex: 0,
	      visible: true,
	      destroyed: false,
	      isShape: true,
	      attrs: {}
	    };
	  }

	  getType() {
	    return this._attrs.type;
	  }

	  drawInner(context) {
	    const self = this;
	    const attrs = self.get('attrs');
	    self.createPath(context);
	    const originOpacity = context.globalAlpha;
	    if (self.hasFill()) {
	      const fillOpacity = attrs.fillOpacity;
	      if (!common.isNil(fillOpacity) && fillOpacity !== 1) {
	        context.globalAlpha = fillOpacity;
	        context.fill();
	        context.globalAlpha = originOpacity;
	      } else {
	        context.fill();
	      }
	    }
	    if (self.hasStroke()) {
	      const lineWidth = attrs.lineWidth;
	      if (lineWidth > 0) {
	        const strokeOpacity = attrs.strokeOpacity;
	        if (!common.isNil(strokeOpacity) && strokeOpacity !== 1) {
	          context.globalAlpha = strokeOpacity;
	        }
	        context.stroke();
	      }
	    }
	  }

	  getBBox() {
	    let bbox = this._attrs.bbox;
	    if (!bbox) {
	      bbox = this.calculateBox();
	      if (bbox) {
	        bbox.x = bbox.minX;
	        bbox.y = bbox.minY;
	        bbox.width = bbox.maxX - bbox.minX;
	        bbox.height = bbox.maxY - bbox.minY;
	      }
	      this._attrs.bbox = bbox;
	    }
	    return bbox;
	  }

	  calculateBox() {
	    return null;
	  }

	  createPath() {}
	}

	var shape$2 = Shape$2;

	const SHAPE_MAP = {};
	const INDEX = '_INDEX';

	function getComparer(compare) {
	  return function(left, right) {
	    const result = compare(left, right);
	    return result === 0 ? left[INDEX] - right[INDEX] : result;
	  };
	}

	var container = {

	  getGroupClass() {},

	  getChildren() {
	    return this.get('children');
	  },

	  addShape(type, cfg = {}) {
	    const canvas = this.get('canvas');
	    let shapeType = SHAPE_MAP[type];
	    if (!shapeType) {
	      shapeType = common.upperFirst(type);
	      SHAPE_MAP[type] = shapeType;
	    }
	    cfg.canvas = canvas;
	    if (shapeType === 'Text' && canvas && canvas.get('fontFamily')) {
	      cfg.attrs.fontFamily = cfg.attrs.fontFamily || canvas.get('fontFamily');
	    }

	    const shape = new shape$2[shapeType](cfg);
	    this.add(shape);
	    return shape;
	  },

	  addGroup(cfg) {
	    const canvas = this.get('canvas');
	    const groupClass = this.getGroupClass();
	    cfg = common.mix({}, cfg);
	    cfg.canvas = canvas;
	    cfg.parent = this;
	    const rst = new groupClass(cfg);
	    this.add(rst);
	    return rst;
	  },

	  contain(item) {
	    const children = this.get('children');
	    return children.indexOf(item) > -1;
	  },

	  sort() {
	    const children = this.get('children');
	    for (let i = 0, len = children.length; i < len; i++) {
	      const child = children[i];
	      child[INDEX] = i;
	    }

	    children.sort(getComparer(function(obj1, obj2) {
	      return obj1.get('zIndex') - obj2.get('zIndex');
	    }));

	    return this;
	  },

	  clear() {
	    const children = this.get('children');

	    while (children.length !== 0) {
	      children[children.length - 1].remove(true);
	    }
	    return this;
	  },

	  add(items) {
	    const self = this;
	    const children = self.get('children');
	    if (!common.isArray(items)) {
	      items = [ items ];
	    }

	    for (let i = 0, len = items.length; i < len; i++) {
	      const item = items[i];
	      const parent = item.get('parent');
	      if (parent) {
	        const descendants = parent.get('children');
	        common.Array.remove(descendants, item);
	      }
	      self._setEvn(item);
	      children.push(item);
	    }

	    return self;
	  },

	  _setEvn(item) {
	    const self = this;
	    item._attrs.parent = self;
	    item._attrs.context = self._attrs.context;
	    item._attrs.canvas = self._attrs.canvas;
	    const clip = item._attrs.attrs.clip;
	    if (clip) {
	      clip.set('parent', self);
	      clip.set('context', self.get('context'));
	    }
	    if (item._attrs.isGroup) {
	      const children = item._attrs.children;
	      for (let i = 0, len = children.length; i < len; i++) {
	        item._setEvn(children[i]);
	      }
	    }
	  }
	};

	class Group extends element {
	  _initProperties() {
	    this._attrs = {
	      zIndex: 0,
	      visible: true,
	      destroyed: false,
	      isGroup: true,
	      children: []
	    };
	  }

	  drawInner(context) {
	    const children = this.get('children');
	    for (let i = 0, len = children.length; i < len; i++) {
	      const child = children[i];
	      child.draw(context);
	    }
	    return this;
	  }

	  getBBox() {
	    const self = this;
	    let minX = Infinity;
	    let maxX = -Infinity;
	    let minY = Infinity;
	    let maxY = -Infinity;
	    const children = self.get('children');
	    for (let i = 0, length = children.length; i < length; i++) {
	      const child = children[i];
	      if (child.get('visible')) {
	        const box = child.getBBox();
	        if (!box) {
	          continue;
	        }

	        const leftTop = [ box.minX, box.minY ];
	        const leftBottom = [ box.minX, box.maxY ];
	        const rightTop = [ box.maxX, box.minY ];
	        const rightBottom = [ box.maxX, box.maxY ];
	        const matrix = child.attr('matrix');

	        vector2.transformMat2d(leftTop, leftTop, matrix);
	        vector2.transformMat2d(leftBottom, leftBottom, matrix);
	        vector2.transformMat2d(rightTop, rightTop, matrix);
	        vector2.transformMat2d(rightBottom, rightBottom, matrix);

	        minX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], minX);
	        maxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], maxX);
	        minY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], minY);
	        maxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], maxY);
	      }
	    }

	    return {
	      minX,
	      minY,
	      maxX,
	      maxY,
	      x: minX,
	      y: minY,
	      width: maxX - minX,
	      height: maxY - minY
	    };
	  }

	  destroy() {
	    if (this.get('destroyed')) {
	      return;
	    }
	    this.clear();
	    super.destroy();
	  }
	}

	common.mix(Group.prototype, container, {
	  getGroupClass() {
	    return Group;
	  }
	});

	var group = Group;

	var requestAnimationFrame = {
	  requestAnimationFrame: typeof window === 'object' && window.requestAnimationFrame ? window.requestAnimationFrame : function(fn) {
	    return setTimeout(fn, 16);
	  }
	};

	class CanvasElement {
	  constructor(ctx) {
	    this.context = ctx;
	    // canvas实际的宽高 (width/height) * pixelRatio
	    this.width = 0;
	    this.height = 0;
	    this.style = {};
	    this.currentStyle = {};
	    // 用来标识是CanvasElement实例
	    this.isCanvasElement = true;

	    // 实现简单的事件机制
	    this.__events = {};
	  }

	  getContext(/* type */) {
	    return this.context;
	  }

	  getBoundingClientRect() {
	    const width = this.width;
	    const height = this.height;
	    // 默认都处理成可视窗口的顶部位置
	    return {
	      top: 0,
	      right: width,
	      bottom: height,
	      left: 0
	    };
	  }

	  addEventListener(type, listener) {
	    const events = this.__events[type] || [];
	    events.push(listener);
	    this.__events[type] = events;
	  }

	  removeEventListener(type) {
	    delete this.__events[type];
	  }

	  dispatchEvent(type, e) {
	    if (common.isObject(type)) {
	      e = type;
	      type = e && e.type;
	    }
	    if (!type) {
	      return;
	    }
	    const events = this.__events[type];
	    if (!events || !events.length) {
	      return;
	    }
	    events.forEach(listener => {
	      listener.call(this, e);
	    });
	  }
	}

	function supportEventListener(canvas) {
	  if (!canvas) {
	    return false;
	  }
	  // 非 HTMLCanvasElement
	  if (canvas.nodeType !== 1 || !canvas.nodeName || canvas.nodeName.toLowerCase() !== 'canvas') {
	    return false;
	  }
	  // 微信小程序canvas.getContext('2d')时也是CanvasRenderingContext2D
	  // 也会有ctx.canvas, 而且nodeType也是1，所以还要在看下是否支持addEventListener
	  let support = false;
	  try {
	    canvas.addEventListener('eventTest', () => {
	      support = true;
	    });
	    canvas.dispatchEvent(new Event('eventTest'));
	  } catch (error) {
	    support = false;
	  }
	  return support;
	}


	var canvasElement = {
	  create(ctx) {
	    if (!ctx) {
	      return null;
	    }
	    if (supportEventListener(ctx.canvas)) {
	      return ctx.canvas;
	    }
	    return new CanvasElement(ctx);
	  }
	};

	const { requestAnimationFrame: requestAnimationFrame$1 } = requestAnimationFrame;


	class Canvas {
	  get(name) {
	    return this._attrs[name];
	  }

	  set(name, value) {
	    this._attrs[name] = value;
	  }

	  constructor(cfg) {
	    this._attrs = common.mix({
	      type: 'canvas',
	      children: []
	    }, cfg);
	    this._initPixelRatio();
	    this._initCanvas();
	  }

	  _initPixelRatio() {
	    const pixelRatio = this.get('pixelRatio');
	    if (!pixelRatio) {
	      this.set('pixelRatio', common.getPixelRatio());
	    }
	  }

	  beforeDraw() {
	    const context = this._attrs.context;
	    const el = this._attrs.el;
	    context && context.clearRect && context.clearRect(0, 0, el.width, el.height);
	  }

	  _initCanvas() {
	    const self = this;
	    const el = self.get('el');
	    const context = self.get('context');
	    if (!el && !context) {
	      throw new Error('Please specify the id or el of the chart!');
	    }
	    let canvas;
	    if (el) {
	      // DOMElement or String
	      canvas = common.isString(el) ? common.getDomById(el) : el;
	    } else {
	      // 说明没有指定el
	      canvas = canvasElement.create(context);
	    }

	    if (context && canvas && !canvas.getContext) {
	      canvas.getContext = function() {
	        return context;
	      };
	    }

	    let width = self.get('width');
	    if (!width) {
	      width = common.getWidth(canvas);
	    }

	    let height = self.get('height');
	    if (!height) {
	      height = common.getHeight(canvas);
	    }

	    self.set('canvas', this);
	    self.set('el', canvas);
	    self.set('context', context || canvas.getContext('2d'));
	    self.changeSize(width, height);
	  }

	  changeSize(width, height) {
	    const pixelRatio = this.get('pixelRatio');
	    const canvasDOM = this.get('el'); // HTMLCanvasElement or canvasElement

	    // 浏览器环境设置style样式
	    if (canvasDOM.style) {
	      canvasDOM.style.width = width + 'px';
	      canvasDOM.style.height = height + 'px';
	    }

	    if (common.isCanvasElement(canvasDOM)) {
	      canvasDOM.width = width * pixelRatio;
	      canvasDOM.height = height * pixelRatio;

	      if (pixelRatio !== 1) {
	        const ctx = this.get('context');
	        ctx.scale(pixelRatio, pixelRatio);
	      }
	    }

	    this.set('width', width);
	    this.set('height', height);
	  }

	  getWidth() {
	    const pixelRatio = this.get('pixelRatio');
	    const width = this.get('width');
	    return width * pixelRatio;
	  }

	  getHeight() {
	    const pixelRatio = this.get('pixelRatio');
	    const height = this.get('height');
	    return height * pixelRatio;
	  }

	  getPointByClient(clientX, clientY) {
	    const el = this.get('el');
	    const bbox = el.getBoundingClientRect();
	    const width = bbox.right - bbox.left;
	    const height = bbox.bottom - bbox.top;
	    return {
	      x: (clientX - bbox.left) * (el.width / width),
	      y: (clientY - bbox.top) * (el.height / height)
	    };
	  }

	  _beginDraw() {
	    this._attrs.toDraw = true;
	  }
	  _endDraw() {
	    this._attrs.toDraw = false;
	  }

	  draw() {
	    const self = this;
	    function drawInner() {
	      self.set('animateHandler', requestAnimationFrame$1(() => {
	        self.set('animateHandler', undefined);
	        if (self.get('toDraw')) {
	          drawInner();
	        }
	      }));
	      self.beforeDraw();
	      try {
	        const context = self._attrs.context;
	        const children = self._attrs.children;
	        for (let i = 0, len = children.length; i < len; i++) {
	          const child = children[i];
	          child.draw(context);
	        }

	        // 支付宝，微信小程序，需要调context.draw才能完成绘制， 所以这里直接判断是否有.draw方法
	        if (context.draw) {
	          context.draw();
	        }
	      } catch (ev) {
	        console.warn('error in draw canvas, detail as:');
	        console.warn(ev);
	        self._endDraw();
	      }
	      self._endDraw();
	    }

	    if (self.get('destroyed')) {
	      return;
	    }
	    if (self.get('animateHandler')) {
	      this._beginDraw();
	    } else {
	      drawInner();
	    }
	  }

	  destroy() {
	    if (this.get('destroyed')) {
	      return;
	    }
	    this.clear();
	    this._attrs = {};
	    this.set('destroyed', true);
	  }

	  isDestroyed() {
	    return this.get('destroyed');
	  }
	}

	common.mix(Canvas.prototype, container, {
	  getGroupClass() {
	    return group;
	  }
	});

	var canvas = Canvas;

	class Rect extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'rect';
	  }

	  getDefaultAttrs() {
	    return {
	      x: 0,
	      y: 0,
	      width: 0,
	      height: 0,
	      radius: 0,
	      lineWidth: 0
	    };
	  }

	  createPath(context) {
	    const self = this;
	    const attrs = self.get('attrs');
	    const { x, y, width, height } = attrs;

	    context.beginPath();
	    let radius = attrs.radius;
	    if (!radius || !(width * height)) {
	      context.rect(x, y, width, height);
	    } else {
	      radius = common.parsePadding(radius);
	      context.moveTo(x + radius[0], y);
	      context.lineTo(x + width - radius[1], y);
	      context.arc(x + width - radius[1], y + radius[1], radius[1], -Math.PI / 2, 0, false);
	      context.lineTo(x + width, y + height - radius[2]);
	      context.arc(x + width - radius[2], y + height - radius[2], radius[2], 0, Math.PI / 2, false);
	      context.lineTo(x + radius[3], y + height);
	      context.arc(x + radius[3], y + height - radius[3], radius[3], Math.PI / 2, Math.PI, false);
	      context.lineTo(x, y + radius[0]);
	      context.arc(x + radius[0], y + radius[0], radius[0], Math.PI, Math.PI * 3 / 2, false);
	      context.closePath();
	    }
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x, y, width, height } = attrs;
	    return {
	      minX: x,
	      minY: y,
	      maxX: x + width,
	      maxY: y + height
	    };
	  }
	}

	shape$2.Rect = Rect;

	class Circle extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'circle';
	  }

	  getDefaultAttrs() {
	    return {
	      x: 0,
	      y: 0,
	      r: 0,
	      lineWidth: 0
	    };
	  }

	  createPath(context) {
	    const attrs = this.get('attrs');
	    const { x, y, r } = attrs;
	    context.beginPath();
	    context.arc(x, y, r, 0, Math.PI * 2, false);
	    context.closePath();
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x, y, r } = attrs;

	    return {
	      minX: x - r,
	      maxX: x + r,
	      minY: y - r,
	      maxY: y + r
	    };
	  }
	}
	shape$2.Circle = Circle;

	const start = vector2.create();
	const end = vector2.create();
	const extremity = vector2.create();

	function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
	  const x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
	  const y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
	  return ({
	    x,
	    y
	  });
	}
	// cubic helper formula at T distance
	function CubicN(T, a, b, c, d) {
	  const t2 = T * T;
	  const t3 = t2 * T;
	  return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
	}

	function cubicBezierBounds(c) {
	  let minX = Infinity;
	  let maxX = -Infinity;
	  let minY = Infinity;
	  let maxY = -Infinity;
	  const s = {
	    x: c[0],
	    y: c[1]
	  };
	  const c1 = {
	    x: c[2],
	    y: c[3]
	  };
	  const c2 = {
	    x: c[4],
	    y: c[5]
	  };
	  const e = {
	    x: c[6],
	    y: c[7]
	  };
	  for (let t = 0; t < 100; t++) {
	    const pt = getCubicBezierXYatT(s, c1, c2, e, t / 100);
	    if (pt.x < minX) {
	      minX = pt.x;
	    }
	    if (pt.x > maxX) {
	      maxX = pt.x;
	    }
	    if (pt.y < minY) {
	      minY = pt.y;
	    }
	    if (pt.y > maxY) {
	      maxY = pt.y;
	    }
	  }
	  return {
	    minX,
	    minY,
	    maxX,
	    maxY
	  };
	}

	var bbox = {
	  getBBoxFromPoints(points, lineWidth) {
	    if (points.length === 0) {
	      return;
	    }
	    let p = points[0];
	    let left = p.x;
	    let right = p.x;
	    let top = p.y;
	    let bottom = p.y;
	    const len = points.length;

	    for (let i = 1; i < len; i++) {
	      p = points[i];
	      left = Math.min(left, p.x);
	      right = Math.max(right, p.x);
	      top = Math.min(top, p.y);
	      bottom = Math.max(bottom, p.y);
	    }

	    lineWidth = (lineWidth / 2) || 0;

	    return {
	      minX: left - lineWidth,
	      minY: top - lineWidth,
	      maxX: right + lineWidth,
	      maxY: bottom + lineWidth
	    };
	  },
	  getBBoxFromLine(x0, y0, x1, y1, lineWidth) {
	    lineWidth = (lineWidth / 2) || 0;

	    return {
	      minX: Math.min(x0, x1) - lineWidth,
	      minY: Math.min(y0, y1) - lineWidth,
	      maxX: Math.max(x0, x1) + lineWidth,
	      maxY: Math.max(y0, y1) + lineWidth
	    };
	  },
	  getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise) {
	    const diff = Math.abs(startAngle - endAngle);
	    if (diff % (Math.PI * 2) < 1e-4 && diff > 1e-4) {
	      // Is a circle
	      return {
	        minX: x - r,
	        minY: y - r,
	        maxX: x + r,
	        maxY: y + r
	      };
	    }

	    start[0] = Math.cos(startAngle) * r + x;
	    start[1] = Math.sin(startAngle) * r + y;

	    end[0] = Math.cos(endAngle) * r + x;
	    end[1] = Math.sin(endAngle) * r + y;
	    const min = [ 0, 0 ];
	    const max = [ 0, 0 ];

	    vector2.min(min, start, end);
	    vector2.max(max, start, end);

	    // Thresh to [0, Math.PI * 2]
	    startAngle = startAngle % (Math.PI * 2);
	    if (startAngle < 0) {
	      startAngle = startAngle + Math.PI * 2;
	    }
	    endAngle = endAngle % (Math.PI * 2);
	    if (endAngle < 0) {
	      endAngle = endAngle + Math.PI * 2;
	    }

	    if (startAngle > endAngle && !anticlockwise) {
	      endAngle += Math.PI * 2;
	    } else if (startAngle < endAngle && anticlockwise) {
	      startAngle += Math.PI * 2;
	    }
	    if (anticlockwise) {
	      const tmp = endAngle;
	      endAngle = startAngle;
	      startAngle = tmp;
	    }

	    for (let angle = 0; angle < endAngle; angle += Math.PI / 2) {
	      if (angle > startAngle) {
	        extremity[0] = Math.cos(angle) * r + x;
	        extremity[1] = Math.sin(angle) * r + y;

	        vector2.min(min, extremity, min);
	        vector2.max(max, extremity, max);
	      }
	    }

	    return {
	      minX: min[0],
	      minY: min[1],
	      maxX: max[0],
	      maxY: max[1]
	    };
	  },
	  getBBoxFromBezierGroup(points, lineWidth) {
	    let minX = Infinity;
	    let maxX = -Infinity;
	    let minY = Infinity;
	    let maxY = -Infinity;
	    for (let i = 0, len = points.length; i < len; i++) {
	      const bbox = cubicBezierBounds(points[i]);
	      if (bbox.minX < minX) {
	        minX = bbox.minX;
	      }
	      if (bbox.maxX > maxX) {
	        maxX = bbox.maxX;
	      }
	      if (bbox.minY < minY) {
	        minY = bbox.minY;
	      }
	      if (bbox.maxY > maxY) {
	        maxY = bbox.maxY;
	      }
	    }

	    lineWidth = (lineWidth / 2) || 0;

	    return {
	      minX: minX - lineWidth,
	      minY: minY - lineWidth,
	      maxX: maxX + lineWidth,
	      maxY: maxY + lineWidth
	    };
	  }
	};

	class Line$1 extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canStroke = true;
	    this._attrs.type = 'line';
	  }

	  getDefaultAttrs() {
	    return {
	      x1: 0,
	      y1: 0,
	      x2: 0,
	      y2: 0,
	      lineWidth: 1
	    };
	  }

	  createPath(context) {
	    const attrs = this.get('attrs');
	    const { x1, y1, x2, y2 } = attrs;

	    context.beginPath();
	    context.moveTo(x1, y1);
	    context.lineTo(x2, y2);
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x1, y1, x2, y2, lineWidth } = attrs;
	    return bbox.getBBoxFromLine(x1, y1, x2, y2, lineWidth);
	  }
	}

	shape$2.Line = Line$1;

	class Polygon extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'polygon';
	  }

	  getDefaultAttrs() {
	    return {
	      points: null,
	      lineWidth: 0
	    };
	  }

	  createPath(context) {
	    const self = this;
	    const attrs = self.get('attrs');
	    const points = attrs.points;

	    context.beginPath();

	    for (let i = 0, len = points.length; i < len; i++) {
	      const point = points[i];
	      if (i === 0) {
	        context.moveTo(point.x, point.y);
	      } else {
	        context.lineTo(point.x, point.y);
	      }
	    }
	    context.closePath();
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { points } = attrs;
	    return bbox.getBBoxFromPoints(points);
	  }
	}

	shape$2.Polygon = Polygon;

	/**
	 * @fileOverview convert the line to curve
	 * @author dxq613@gmail.com
	 */


	function getPoint(v) {
	  return [ v.x, v.y ];
	}

	function smoothBezier(points, smooth, isLoop, constraint) {
	  const cps = [];

	  let prevPoint;
	  let nextPoint;
	  const hasConstraint = !!constraint;
	  let min;
	  let max;
	  let point;
	  let len;
	  let l;
	  let i;
	  if (hasConstraint) {
	    min = [ Infinity, Infinity ];
	    max = [ -Infinity, -Infinity ];

	    for (i = 0, l = points.length; i < l; i++) {
	      point = getPoint(points[i]);
	      vector2.min(min, min, point);
	      vector2.max(max, max, point);
	    }
	    vector2.min(min, min, constraint[0]);
	    vector2.max(max, max, constraint[1]);
	  }

	  for (i = 0, len = points.length; i < len; i++) {
	    point = getPoint(points[i]);
	    if (isLoop) {
	      prevPoint = getPoint(points[i ? i - 1 : len - 1]);
	      nextPoint = getPoint(points[(i + 1) % len]);
	    } else {
	      if (i === 0 || i === len - 1) {
	        cps.push([ point[0], point[1] ]);
	        continue;
	      } else {
	        prevPoint = getPoint(points[i - 1]);
	        nextPoint = getPoint(points[i + 1]);
	      }
	    }

	    const v = vector2.sub([], nextPoint, prevPoint);
	    vector2.scale(v, v, smooth);
	    let d0 = vector2.distance(point, prevPoint);
	    let d1 = vector2.distance(point, nextPoint);

	    const sum = d0 + d1;
	    if (sum !== 0) {
	      d0 /= sum;
	      d1 /= sum;
	    }

	    const v1 = vector2.scale([], v, -d0);
	    const v2 = vector2.scale([], v, d1);

	    const cp0 = vector2.add([], point, v1);
	    const cp1 = vector2.add([], point, v2);

	    if (hasConstraint) {
	      vector2.max(cp0, cp0, min);
	      vector2.min(cp0, cp0, max);
	      vector2.max(cp1, cp1, min);
	      vector2.min(cp1, cp1, max);
	    }

	    cps.push([ cp0[0], cp0[1] ]);
	    cps.push([ cp1[0], cp1[1] ]);
	  }

	  if (isLoop) {
	    cps.push(cps.shift());
	  }
	  return cps;
	}

	function catmullRom2bezier(pointList, z, constraint) {
	  const isLoop = !!z;

	  const controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
	  const len = pointList.length;
	  const d1 = [];

	  let cp1;
	  let cp2;
	  let p;

	  for (let i = 0; i < len - 1; i++) {
	    cp1 = controlPointList[i * 2];
	    cp2 = controlPointList[i * 2 + 1];
	    p = pointList[i + 1];
	    d1.push([ 'C',
	      cp1[0],
	      cp1[1],
	      cp2[0],
	      cp2[1],
	      p.x,
	      p.y
	    ]);
	  }

	  if (isLoop) {
	    cp1 = controlPointList[len];
	    cp2 = controlPointList[len + 1];
	    p = pointList[0];

	    d1.push([ 'C',
	      cp1[0],
	      cp1[1],
	      cp2[0],
	      cp2[1],
	      p.x,
	      p.y
	    ]);
	  }
	  return d1;
	}

	var smooth = {
	  smooth: catmullRom2bezier
	};

	// filter the point which x or y is NaN
	function _filterPoints(points) {
	  const filteredPoints = [];
	  for (let i = 0, len = points.length; i < len; i++) {
	    const point = points[i];
	    if (!isNaN(point.x) && !isNaN(point.y)) {
	      filteredPoints.push(point);
	    }
	  }

	  return filteredPoints;
	}

	class Polyline extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'polyline';
	  }

	  getDefaultAttrs() {
	    return {
	      points: null,
	      lineWidth: 1,
	      smooth: false
	    };
	  }

	  createPath(context) {
	    const self = this;
	    const attrs = self.get('attrs');
	    const { points, smooth: smooth$1 } = attrs;

	    const filteredPoints = _filterPoints(points);

	    context.beginPath();
	    if (filteredPoints.length) {
	      context.moveTo(filteredPoints[0].x, filteredPoints[0].y);
	      if (smooth$1) {
	        const constaint = [
	          [ 0, 0 ],
	          [ 1, 1 ]
	        ];
	        const sps = smooth.smooth(filteredPoints, false, constaint);
	        for (let i = 0, n = sps.length; i < n; i++) {
	          const sp = sps[i];
	          context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
	        }
	      } else {
	        let i;
	        let l;
	        for (i = 1, l = filteredPoints.length - 1; i < l; i++) {
	          context.lineTo(filteredPoints[i].x, filteredPoints[i].y);
	        }
	        context.lineTo(filteredPoints[l].x, filteredPoints[l].y);
	      }
	    }
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { points, smooth: smooth$1, lineWidth } = attrs;

	    const filteredPoints = _filterPoints(points);
	    if (smooth$1) {
	      const newPoints = [];
	      const constaint = [
	        [ 0, 0 ],
	        [ 1, 1 ]
	      ];
	      const sps = smooth.smooth(filteredPoints, false, constaint);
	      for (let i = 0, n = sps.length; i < n; i++) {
	        const sp = sps[i];
	        if (i === 0) {
	          newPoints.push([ filteredPoints[0].x, filteredPoints[0].y, sp[1], sp[2], sp[3], sp[4], sp[5], sp[6] ]);
	        } else {
	          const lastPoint = sps[ i - 1 ];
	          newPoints.push([ lastPoint[5], lastPoint[6], sp[1], sp[2], sp[3], sp[4], sp[5], sp[6] ]);
	        }
	      }
	      return bbox.getBBoxFromBezierGroup(newPoints, lineWidth);
	    }
	    return bbox.getBBoxFromPoints(filteredPoints, lineWidth);
	  }
	}

	shape$2.Polyline = Polyline;

	class Arc extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canStroke = true;
	    this._attrs.canFill = true;
	    this._attrs.type = 'arc';
	  }

	  getDefaultAttrs() {
	    return {
	      x: 0,
	      y: 0,
	      r: 0,
	      startAngle: 0,
	      endAngle: Math.PI * 2,
	      anticlockwise: false,
	      lineWidth: 1
	    };
	  }

	  createPath(context) {
	    const attrs = this.get('attrs');
	    const { x, y, r, startAngle, endAngle, anticlockwise } = attrs;

	    context.beginPath();
	    if (startAngle !== endAngle) {
	      context.arc(x, y, r, startAngle, endAngle, anticlockwise);
	    }
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x, y, r, startAngle, endAngle, anticlockwise } = attrs;

	    return bbox.getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise);
	  }
	}
	shape$2.Arc = Arc;

	class Sector extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'sector';
	  }

	  getDefaultAttrs() {
	    return {
	      x: 0,
	      y: 0,
	      lineWidth: 0,
	      r: 0,
	      r0: 0,
	      startAngle: 0,
	      endAngle: Math.PI * 2,
	      anticlockwise: false
	    };
	  }

	  createPath(context) {
	    const attrs = this.get('attrs');
	    const { x, y, startAngle, endAngle, r, r0, anticlockwise } = attrs;
	    context.beginPath();
	    const unitX = Math.cos(startAngle);
	    const unitY = Math.sin(startAngle);

	    context.moveTo(unitX * r0 + x, unitY * r0 + y);
	    context.lineTo(unitX * r + x, unitY * r + y);

	    // 当扇形的角度非常小的时候，就不进行弧线的绘制；或者整个只有1个扇形时，会出现end<0的情况不绘制
	    if (Math.abs(endAngle - startAngle) > 0.0001 || startAngle === 0 && endAngle < 0) {
	      context.arc(x, y, r, startAngle, endAngle, anticlockwise);
	      context.lineTo(Math.cos(endAngle) * r0 + x, Math.sin(endAngle) * r0 + y);
	      if (r0 !== 0) {
	        context.arc(x, y, r0, endAngle, startAngle, !anticlockwise);
	      }
	    }
	    context.closePath();
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x, y, r, r0, startAngle, endAngle, anticlockwise } = attrs;
	    const outerBBox = bbox.getBBoxFromArc(x, y, r, startAngle, endAngle, anticlockwise);
	    const innerBBox = bbox.getBBoxFromArc(x, y, r0, startAngle, endAngle, anticlockwise);
	    return {
	      minX: Math.min(outerBBox.minX, innerBBox.minX),
	      minY: Math.min(outerBBox.minY, innerBBox.minY),
	      maxX: Math.max(outerBBox.maxX, innerBBox.maxX),
	      maxY: Math.max(outerBBox.maxY, innerBBox.maxY)
	    };
	  }
	}

	shape$2.Sector = Sector;

	const Rect$1 = {
	  calcRotatedBox({ width, height, rotate }) {
	    const absRotate = Math.abs(rotate);
	    return {
	      width: Math.abs(width * Math.cos(absRotate) + height * Math.sin(absRotate)),
	      height: Math.abs(height * Math.cos(absRotate) + width * Math.sin(absRotate))
	    };
	  }
	};

	var rect = Rect$1;

	let textWidthCacheCounter = 0;
	let textWidthCache = {};
	const TEXT_CACHE_MAX = 5000;

	class Text extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'text';
	  }

	  getDefaultAttrs() {
	    return {
	      lineWidth: 0,
	      lineCount: 1,
	      fontSize: 12,
	      fontFamily: 'sans-serif',
	      fontStyle: 'normal',
	      fontWeight: 'normal',
	      fontVariant: 'normal',
	      textAlign: 'start',
	      textBaseline: 'bottom',
	      lineHeight: null,
	      textArr: null
	    };
	  }

	  _getFontStyle() {
	    const attrs = this._attrs.attrs;
	    const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = attrs;
	    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
	  }

	  _afterAttrsSet() {
	    const attrs = this._attrs.attrs;
	    attrs.font = this._getFontStyle();

	    if (attrs.text) {
	      const text = attrs.text;
	      let textArr = null;
	      let lineCount = 1;
	      if (common.isString(text) && (text.indexOf('\n') !== -1)) {
	        textArr = text.split('\n');
	        lineCount = textArr.length;
	      }
	      attrs.lineCount = lineCount;
	      attrs.textArr = textArr;
	    }
	    this.set('attrs', attrs);
	  }

	  _getTextHeight() {
	    const attrs = this._attrs.attrs;
	    if (attrs.height) {
	      return attrs.height;
	    }
	    const lineCount = attrs.lineCount;
	    const fontSize = attrs.fontSize * 1;
	    if (lineCount > 1) {
	      const spaceingY = this._getSpaceingY();
	      return fontSize * lineCount + spaceingY * (lineCount - 1);
	    }
	    return fontSize;
	  }

	  _getSpaceingY() {
	    const attrs = this._attrs.attrs;
	    const lineHeight = attrs.lineHeight;
	    const fontSize = attrs.fontSize * 1;
	    return lineHeight ? (lineHeight - fontSize) : fontSize * 0.14;
	  }

	  drawInner(context) {
	    const self = this;
	    const attrs = self._attrs.attrs;
	    const text = attrs.text;
	    let x = attrs.x;
	    let y = attrs.y;
	    if (common.isNil(text) || isNaN(x) || isNaN(y)) { // text will be 0
	      return;
	    }
	    const textArr = attrs.textArr;
	    const fontSize = attrs.fontSize * 1;
	    const spaceingY = self._getSpaceingY();

	    if (attrs.rotate) { // do rotation
	      context.translate(x, y);
	      context.rotate(attrs.rotate);
	      x = 0;
	      y = 0;
	    }

	    const textBaseline = attrs.textBaseline;
	    let height;
	    if (textArr) {
	      height = self._getTextHeight();
	    }
	    let subY;

	    // context.beginPath();
	    if (self.hasFill()) {
	      const fillOpacity = attrs.fillOpacity;
	      if (!common.isNil(fillOpacity) && fillOpacity !== 1) {
	        context.globalAlpha = fillOpacity;
	      }
	      if (textArr) {
	        for (let i = 0, len = textArr.length; i < len; i++) {
	          const subText = textArr[i];
	          subY = y + i * (spaceingY + fontSize) - height + fontSize; // bottom;
	          if (textBaseline === 'middle') {
	            subY += height - fontSize - (height - fontSize) / 2;
	          }
	          if (textBaseline === 'top') {
	            subY += height - fontSize;
	          }
	          context.fillText(subText, x, subY);
	        }
	      } else {
	        context.fillText(text, x, y);
	      }
	    }

	    if (self.hasStroke()) {
	      if (textArr) {
	        for (let i = 0, len = textArr.length; i < len; i++) {
	          const subText = textArr[i];
	          subY = y + i * (spaceingY + fontSize) - height + fontSize; // bottom;
	          if (textBaseline === 'middle') {
	            subY += height - fontSize - (height - fontSize) / 2;
	          }
	          if (textBaseline === 'top') {
	            subY += height - fontSize;
	          }
	          context.strokeText(subText, x, subY);
	        }
	      } else {
	        context.strokeText(text, x, y);
	      }
	    }
	  }

	  calculateBox() {
	    const self = this;
	    const attrs = self._attrs.attrs;
	    const { x, y, textAlign, textBaseline } = attrs;
	    let width = self._getTextWidth(); // attrs.width
	    if (!width) {
	      return {
	        minX: x,
	        minY: y,
	        maxX: x,
	        maxY: y
	      };
	    }
	    let height = self._getTextHeight(); // attrs.height

	    if (attrs.rotate) {
	      const rotatedBox = rect.calcRotatedBox({
	        width,
	        height,
	        rotate: attrs.rotate
	      });
	      width = rotatedBox.width;
	      height = rotatedBox.height;
	    }
	    const point = {
	      x,
	      y: y - height
	    }; // default textAlign: start, textBaseline: bottom

	    if (textAlign) {
	      if (textAlign === 'end' || textAlign === 'right') {
	        point.x -= width;
	      } else if (textAlign === 'center') {
	        point.x -= width / 2;
	      }
	    }

	    if (textBaseline) {
	      if (textBaseline === 'top') {
	        point.y += height;
	      } else if (textBaseline === 'middle') {
	        point.y += height / 2;
	      }
	    }

	    return {
	      minX: point.x,
	      minY: point.y,
	      maxX: point.x + width,
	      maxY: point.y + height
	    };
	  }

	  _getTextWidth() {
	    const attrs = this._attrs.attrs;
	    if (attrs.width) {
	      return attrs.width;
	    }
	    const text = attrs.text;
	    const context = this.get('context');

	    if (common.isNil(text)) return undefined;

	    const font = attrs.font;
	    const textArr = attrs.textArr;
	    const key = text + '' + font;
	    if (textWidthCache[key]) {
	      return textWidthCache[key];
	    }

	    let width = 0;
	    if (textArr) {
	      for (let i = 0, length = textArr.length; i < length; i++) {
	        const subText = textArr[i];
	        width = Math.max(width, common.measureText(subText, font, context).width);
	      }
	    } else {
	      width = common.measureText(text, font, context).width;
	    }

	    if (textWidthCacheCounter > TEXT_CACHE_MAX) {
	      textWidthCacheCounter = 0;
	      textWidthCache = {};
	    }
	    textWidthCacheCounter++;
	    textWidthCache[key] = width;

	    return width;
	  }
	}

	shape$2.Text = Text;

	class Custom extends shape$2 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.createPath = null;
	    this._attrs.type = 'custom';
	  }

	  createPath(context) {
	    const createPath = this.get('createPath');
	    createPath && createPath.call(this, context);
	  }

	  calculateBox() {
	    const calculateBox = this.get('calculateBox');
	    return calculateBox && calculateBox.call(this);
	  }
	}
	shape$2.Custom = Custom;

	const G = {
	  Canvas: canvas,
	  Group: group,
	  Shape: shape$2,
	  Matrix: matrix,
	  Vector2: vector2
	};











	var graphic = G;

	const { Shape: Shape$3 } = graphic;

	function formatTicks(ticks) {
	  const tmp = ticks.slice(0);
	  if (tmp.length > 0) {
	    const first = tmp[0];
	    const last = tmp[tmp.length - 1];
	    if (first.value !== 0) {
	      tmp.unshift({
	        value: 0
	      });
	    }
	    if (last.value !== 1) {
	      tmp.push({
	        value: 1
	      });
	    }
	  }

	  return tmp;
	}

	class AxisController {
	  constructor(cfg) {
	    this.axisCfg = {};
	    this.frontPlot = null;
	    this.backPlot = null;
	    this.axes = {}; // store the axes's options
	    common.mix(this, cfg);
	  }

	  _isHide(field) {
	    const axisCfg = this.axisCfg;
	    return !axisCfg || axisCfg[field] === false;
	  }

	  _getLinePosition(scale, dimType, index, transposed) {
	    let position = '';
	    const field = scale.field;
	    const axisCfg = this.axisCfg;
	    if (axisCfg[field] && axisCfg[field].position) {
	      position = axisCfg[field].position;
	    } else if (dimType === 'x') {
	      position = transposed ? 'left' : 'bottom';
	    } else if (dimType === 'y') {
	      position = index ? 'right' : 'left';
	      if (transposed) {
	        position = 'bottom';
	      }
	    }

	    return position;
	  }

	  _getLineCfg(coord, dimType, position) {
	    let start;
	    let end;
	    let factor = 1; // Mark clockwise or counterclockwise
	    if (dimType === 'x') {
	      start = {
	        x: 0,
	        y: 0
	      };
	      end = {
	        x: 1,
	        y: 0
	      };
	    } else {
	      if (position === 'right') { // there will be several y axes
	        start = {
	          x: 1,
	          y: 0
	        };
	        end = {
	          x: 1,
	          y: 1
	        };
	      } else {
	        start = {
	          x: 0,
	          y: 0
	        };
	        end = {
	          x: 0,
	          y: 1
	        };
	        factor = -1;
	      }
	    }
	    if (coord.transposed) {
	      factor *= -1;
	    }

	    return {
	      offsetFactor: factor,
	      start: coord.convertPoint(start),
	      end: coord.convertPoint(end)
	    };
	  }

	  _getCircleCfg(coord) {
	    return {
	      startAngle: coord.startAngle,
	      endAngle: coord.endAngle,
	      center: coord.center,
	      radius: coord.circleRadius
	    };
	  }

	  _getRadiusCfg(coord) {
	    const transposed = coord.transposed;
	    let start;
	    let end;
	    if (transposed) {
	      start = { x: 0, y: 0 };
	      end = { x: 1, y: 0 };
	    } else {
	      start = { x: 0, y: 0 };
	      end = { x: 0, y: 1 };
	    }
	    return {
	      offsetFactor: -1,
	      start: coord.convertPoint(start),
	      end: coord.convertPoint(end)
	    };
	  }

	  _getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg) {
	    const self = this;
	    const axisCfg = this.axisCfg;
	    const ticks = scale.getTicks();

	    const cfg = common.deepMix({
	      ticks,
	      frontContainer: this.frontPlot,
	      backContainer: this.backPlot
	    }, defaultCfg, axisCfg[scale.field]);

	    const labels = [];
	    const label = cfg.label;
	    const count = ticks.length;
	    let maxWidth = 0;
	    let maxHeight = 0;
	    let labelCfg = label;

	    common.each(ticks, (tick, index) => {
	      if (common.isFunction(label)) {
	        const executedLabel = label(tick.text, index, count);
	        labelCfg = executedLabel ? common.mix({}, global$1._defaultAxis.label, executedLabel) : null;
	      }
	      if (labelCfg) {
	        const textStyle = {};
	        if (labelCfg.textAlign) {
	          textStyle.textAlign = labelCfg.textAlign;
	        }
	        if (labelCfg.textBaseline) {
	          textStyle.textBaseline = labelCfg.textBaseline;
	        }
	        const axisLabel = new Shape$3.Text({
	          className: 'axis-label',
	          attrs: common.mix({
	            x: 0,
	            y: 0,
	            text: tick.text,
	            fontFamily: self.chart.get('canvas').get('fontFamily')
	          }, labelCfg),
	          value: tick.value,
	          textStyle,
	          top: labelCfg.top,
	          context: self.chart.get('canvas').get('context')
	        });
	        labels.push(axisLabel);
	        const { width, height } = axisLabel.getBBox();
	        maxWidth = Math.max(maxWidth, width);
	        maxHeight = Math.max(maxHeight, height);
	      }
	    });

	    cfg.labels = labels;
	    cfg.maxWidth = maxWidth;
	    cfg.maxHeight = maxHeight;
	    return cfg;
	  }

	  _createAxis(coord, scale, verticalScale, dimType, index = '') {
	    const self = this;
	    const coordType = coord.type;
	    const transposed = coord.transposed;
	    let type;
	    let key;
	    let defaultCfg;
	    if (coordType === 'cartesian' || coordType === 'rect') {
	      const position = self._getLinePosition(scale, dimType, index, transposed);
	      defaultCfg = global$1.axis[position];
	      defaultCfg.position = position;
	      type = 'Line';
	      key = position;
	    } else {
	      if ((dimType === 'x' && !transposed) || (dimType === 'y' && transposed)) {
	        defaultCfg = global$1.axis.circle;
	        type = 'Circle';
	        key = 'circle';
	      } else {
	        defaultCfg = global$1.axis.radius;
	        type = 'Line';
	        key = 'radius';
	      }
	    }
	    const cfg = self._getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg);
	    cfg.type = type;
	    cfg.dimType = dimType;
	    cfg.verticalScale = verticalScale;
	    cfg.index = index;
	    this.axes[key] = cfg;
	  }

	  createAxis(coord, xScale, yScales) {
	    const self = this;
	    if (xScale && !self._isHide(xScale.field)) {
	      self._createAxis(coord, xScale, yScales[0], 'x');
	    }
	    common.each(yScales, function(yScale, index) {
	      if (!self._isHide(yScale.field)) {
	        self._createAxis(coord, yScale, xScale, 'y', index);
	      }
	    });

	    const axes = this.axes;
	    const chart = self.chart;
	    if (chart._isAutoPadding()) {
	      const userPadding = common.parsePadding(chart.get('padding'));
	      const appendPadding = common.parsePadding(chart.get('appendPadding'));
	      const legendRange = chart.get('legendRange') || {
	        top: 0,
	        right: 0,
	        bottom: 0,
	        left: 0
	      };

	      const padding = [
	        userPadding[0] === 'auto' ? legendRange.top + appendPadding[0] * 2 : userPadding[0],
	        userPadding[1] === 'auto' ? legendRange.right + appendPadding[1] : userPadding[1],
	        userPadding[2] === 'auto' ? legendRange.bottom + appendPadding[2] : userPadding[2],
	        userPadding[3] === 'auto' ? legendRange.left + appendPadding[3] : userPadding[3]
	      ];

	      if (coord.isPolar) {
	        const circleAxis = axes.circle;
	        if (circleAxis) {
	          const { maxHeight, maxWidth, labelOffset } = circleAxis;
	          padding[0] += maxHeight + labelOffset;
	          padding[1] += maxWidth + labelOffset;
	          padding[2] += maxHeight + labelOffset;
	          padding[3] += maxWidth + labelOffset;
	        }
	      } else {
	        if (axes.right && userPadding[1] === 'auto') {
	          const { maxWidth, labelOffset } = axes.right;
	          padding[1] += maxWidth + labelOffset;
	        }

	        if (axes.left && userPadding[3] === 'auto') {
	          const { maxWidth, labelOffset } = axes.left;
	          padding[3] += maxWidth + labelOffset;
	        }

	        if (axes.bottom && userPadding[2] === 'auto') {
	          const { maxHeight, labelOffset } = axes.bottom;
	          padding[2] += maxHeight + labelOffset;
	        }
	      }
	      chart.set('_padding', padding);
	      chart._updateLayout(padding);
	    }

	    common.each(axes, axis$1 => {
	      const { type, grid, verticalScale, ticks, dimType, position, index } = axis$1;
	      let appendCfg;
	      if (coord.isPolar) {
	        if (type === 'Line') {
	          appendCfg = self._getRadiusCfg(coord);
	        } else if (type === 'Circle') {
	          appendCfg = self._getCircleCfg(coord);
	        }
	      } else {
	        appendCfg = self._getLineCfg(coord, dimType, position);
	      }

	      if (grid && verticalScale) {
	        const gridPoints = [];
	        const verticalTicks = formatTicks(verticalScale.getTicks());

	        common.each(ticks, tick => {
	          const subPoints = [];
	          common.each(verticalTicks, verticalTick => {
	            const x = dimType === 'x' ? tick.value : verticalTick.value;
	            const y = dimType === 'x' ? verticalTick.value : tick.value;

	            if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
	              const point = coord.convertPoint({
	                x,
	                y
	              });
	              subPoints.push(point);
	            }
	          });

	          gridPoints.push({
	            points: subPoints,
	            _id: 'axis-' + dimType + index + '-grid-' + tick.tickValue
	          });
	        });
	        axis$1.gridPoints = gridPoints;

	        if (coord.isPolar) {
	          axis$1.center = coord.center;
	          axis$1.startAngle = coord.startAngle;
	          axis$1.endAngle = coord.endAngle;
	        }
	      }
	      appendCfg._id = 'axis-' + dimType;
	      if (!common.isNil(index)) {
	        appendCfg._id = 'axis-' + dimType + index;
	      }

	      new axis[type](common.mix(axis$1, appendCfg));
	    });
	  }

	  clear() {
	    this.axes = {};
	    this.frontPlot.clear();
	    this.backPlot.clear();
	  }
	}

	var axis$1 = AxisController;

	const { Shape: Shape$4 } = graphic;
	var helper = {
	  getClip(coord) {
	    const start = coord.start;
	    const end = coord.end;
	    const width = end.x - start.x;
	    const height = Math.abs(end.y - start.y);
	    const margin = 10;
	    let clip;
	    if (coord.isPolar) {
	      const { circleRadius, center, startAngle, endAngle } = coord;
	      clip = new Shape$4.Sector({
	        attrs: {
	          x: center.x,
	          y: center.y,
	          r: circleRadius,
	          r0: 0,
	          startAngle,
	          endAngle
	        }
	      });
	    } else {
	      clip = new Shape$4.Rect({
	        attrs: {
	          x: start.x,
	          y: end.y - margin,
	          width,
	          height: height + 2 * margin
	        }
	      });
	    }
	    clip.isClip = true;
	    return clip;
	  },
	  isPointInPlot(point, plot) {
	    const { x, y } = point;
	    const { tl, tr, br } = plot;
	    return (x >= tl.x && x <= tr.x && y >= tl.y && y <= br.y);
	  }
	};

	const { Canvas: Canvas$1 } = graphic;


	function isFullCircle(coord) {
	  const startAngle = coord.startAngle;
	  const endAngle = coord.endAngle;
	  if (!common.isNil(startAngle) && !common.isNil(endAngle) && (endAngle - startAngle) < Math.PI * 2) {
	    return false;
	  }
	  return true;
	}

	function compare(a, b) {
	  return a - b;
	}

	function _isScaleExist(scales, compareScale) {
	  let flag = false;
	  common.each(scales, scale => {
	    const scaleValues = [].concat(scale.values);
	    const compareScaleValues = [].concat(compareScale.values);
	    if (scale.type === compareScale.type &&
	      scale.field === compareScale.field &&
	      scaleValues.sort(compare).toString() === compareScaleValues.sort(compare).toString()) {
	      flag = true;
	      return;
	    }
	  });

	  return flag;
	}

	class Chart extends base {
	  static initPlugins() {
	    return {
	      _plugins: [],
	      _cacheId: 0,
	      register(plugins) {
	        const p = this._plugins;
	        ([]).concat(plugins).forEach(plugin => {
	          if (p.indexOf(plugin) === -1) {
	            p.push(plugin);
	          }
	        });

	        this._cacheId++;
	      },
	      unregister(plugins) {
	        const p = this._plugins;
	        ([]).concat(plugins).forEach(plugin => {
	          const idx = p.indexOf(plugin);
	          if (idx !== -1) {
	            p.splice(idx, 1);
	          }
	        });

	        this._cacheId++;
	      },
	      clear() {
	        this._plugins = [];
	        this._cacheId++;
	      },
	      count() {
	        return this._plugins.length;
	      },
	      getAll() {
	        return this._plugins;
	      },
	      notify(chart, hook, args) {
	        const descriptors = this.descriptors(chart);
	        const ilen = descriptors.length;
	        let i;
	        let descriptor;
	        let plugin;
	        let params;
	        let method;

	        for (i = 0; i < ilen; ++i) {
	          descriptor = descriptors[i];
	          plugin = descriptor.plugin;
	          method = plugin[hook];
	          if (typeof method === 'function') {
	            params = [ chart ].concat(args || []);
	            if (method.apply(plugin, params) === false) {
	              return false;
	            }
	          }
	        }

	        return true;
	      },
	      descriptors(chart) {
	        const cache = chart._plugins || (chart._plugins = {});
	        if (cache.id === this._cacheId) {
	          return cache.descriptors;
	        }

	        const plugins = [];
	        const descriptors = [];

	        this._plugins.concat((chart && chart.get('plugins')) || []).forEach(plugin => {
	          const idx = plugins.indexOf(plugin);
	          if (idx !== -1) {
	            return;
	          }

	          plugins.push(plugin);
	          descriptors.push({
	            plugin
	          });
	        });

	        cache.descriptors = descriptors;
	        cache.id = this._cacheId;
	        return descriptors;
	      }
	    };
	  }

	  getDefaultCfg() {
	    return {
	      /**
	       * the id of canvas
	       * @type {String}
	       */
	      id: null,
	      /**
	       * padding
	       * @type {Array|Number}
	       */
	      padding: global$1.padding,

	      /**
	       * data
	       * @type {Array}
	       */
	      data: null,
	      /**
	       * scales of chart
	       * @type {Object}
	       */
	      scales: {},
	      /**
	       * @private
	       * geometry instances
	       * @type {Array}
	       */
	      geoms: null,
	      /**
	       * scale configuration
	       * @type {Object}
	       */
	      colDefs: null,
	      pixelRatio: global$1.pixelRatio,
	      /**
	       * filter options
	       * @type {Object}
	       */
	      filters: null,
	      appendPadding: global$1.appendPadding
	    };
	  }

	  _syncYScales() {
	    const geoms = this.get('geoms');
	    const syncScales = [];
	    let min = [];
	    let max = [];
	    common.each(geoms, geom => {
	      const yScale = geom.getYScale();
	      if (yScale.isLinear) {
	        syncScales.push(yScale);
	        min.push(yScale.min);
	        max.push(yScale.max);
	      }
	    });

	    min = Math.min.apply(null, min);
	    max = Math.max.apply(null, max);

	    common.each(syncScales, scale => {
	      scale.change({ min });
	      scale.change({ max });
	    });
	  }

	  _getFieldsForLegend() {
	    const fields = [];
	    const geoms = this.get('geoms');
	    common.each(geoms, geom => {
	      const attrOptions = geom.get('attrOptions');
	      const attrCfg = attrOptions.color;
	      if (attrCfg && attrCfg.field && common.isString(attrCfg.field)) {
	        const arr = attrCfg.field.split('*');

	        common.each(arr, item => {
	          if (fields.indexOf(item) === -1) {
	            fields.push(item);
	          }
	        });
	      }
	    });
	    return fields;
	  }

	  _createScale(field, data) {
	    const scaleController = this.get('scaleController');
	    return scaleController.createScale(field, data);
	  }

	  _adjustScale() {
	    const self = this;
	    const coord = self.get('coord');
	    const xScale = self.getXScale();
	    const yScales = self.getYScales();
	    let scales = [];

	    xScale && scales.push(xScale);
	    scales = scales.concat(yScales);
	    const inFullCircle = coord.isPolar && isFullCircle(coord);
	    const scaleController = self.get('scaleController');
	    const colDefs = scaleController.defs;
	    common.each(scales, function(scale) {
	      if ((scale.isCategory || scale.isIdentity) && scale.values && !(colDefs[scale.field] && colDefs[scale.field].range)) {
	        const count = scale.values.length;
	        let range;
	        if (count === 1) {
	          range = [ 0.5, 1 ];
	        } else {
	          let widthRatio = 1;
	          let offset = 0;
	          if (inFullCircle) {
	            if (!coord.transposed) {
	              range = [ 0, 1 - 1 / count ];
	            } else {
	              widthRatio = global$1.widthRatio.multiplePie;
	              offset = 1 / count * widthRatio;
	              range = [ offset / 2, 1 - offset / 2 ];
	            }
	          } else {
	            offset = 1 / count * 1 / 2;
	            range = [ offset, 1 - offset ];
	          }
	        }
	        scale.range = range;
	      }
	    });

	    const geoms = this.get('geoms');
	    for (let i = 0; i < geoms.length; i++) {
	      const geom = geoms[i];
	      if (geom.get('type') === 'interval') {
	        const yScale = geom.getYScale();
	        const { field, min, max, type } = yScale;
	        if (!(colDefs[field] && colDefs[field].min) && type !== 'time') {
	          if (min > 0) {
	            yScale.change({
	              min: 0
	            });
	          } else if (max <= 0) {
	            yScale.change({
	              max: 0
	            });
	          }
	        }
	      }
	    }
	  }

	  _removeGeoms() {
	    const geoms = this.get('geoms');
	    while (geoms.length > 0) {
	      const geom = geoms.shift();
	      geom.destroy();
	    }
	  }

	  _clearGeoms() {
	    const geoms = this.get('geoms');
	    for (let i = 0, length = geoms.length; i < length; i++) {
	      const geom = geoms[i];
	      geom.clear();
	    }
	  }

	  _clearInner() {
	    this.set('scales', {});
	    this.set('legendItems', null);
	    this._clearGeoms();

	    Chart.plugins.notify(this, 'clearInner');
	    this.get('axisController') && this.get('axisController').clear();
	  }

	  _execFilter(data) {
	    const filters = this.get('filters');
	    if (filters) {
	      data = data.filter(function(obj) {
	        let rst = true;
	        common.each(filters, function(fn, k) {
	          if (fn) {
	            rst = fn(obj[k], obj);
	            if (!rst) {
	              return false;
	            }
	          }
	        });
	        return rst;
	      });
	    }
	    return data;
	  }

	  _initGeoms(geoms) {
	    const coord = this.get('coord');
	    const data = this.get('filteredData');
	    const colDefs = this.get('colDefs');

	    for (let i = 0, length = geoms.length; i < length; i++) {
	      const geom = geoms[i];
	      geom.set('data', data);
	      geom.set('coord', coord);
	      geom.set('colDefs', colDefs);
	      geom.init();
	    }
	  }

	  _initCoord() {
	    const plot = this.get('plotRange');
	    const coordCfg = common.mix({
	      type: 'cartesian'
	    }, this.get('coordCfg'), {
	      plot
	    });
	    const type = coordCfg.type;
	    const C = coord[common.upperFirst(type)];
	    const coord$1 = new C(coordCfg);
	    this.set('coord', coord$1);
	  }

	  _initLayout() {
	    let padding = this.get('_padding');
	    if (!padding) {
	      padding = this.get('margin') || this.get('padding');
	      padding = common.parsePadding(padding);
	    }

	    const top = padding[0] === 'auto' ? 0 : padding[0];
	    const right = padding[1] === 'auto' ? 0 : padding[1];
	    const bottom = padding[2] === 'auto' ? 0 : padding[2];
	    const left = padding[3] === 'auto' ? 0 : padding[3];

	    const width = this.get('width');
	    const height = this.get('height');
	    const plot$1 = new plot({
	      start: {
	        x: left,
	        y: top
	      },
	      end: {
	        x: width - right,
	        y: height - bottom
	      }
	    });
	    this.set('plotRange', plot$1);
	    this.set('plot', plot$1);
	  }

	  _initCanvas() {
	    const self = this;
	    try {
	      const canvas = new Canvas$1({
	        el: self.get('el') || self.get('id'),
	        context: self.get('context'),
	        pixelRatio: self.get('pixelRatio'),
	        width: self.get('width'),
	        height: self.get('height'),
	        fontFamily: global$1.fontFamily
	      });
	      self.set('canvas', canvas);
	      self.set('el', canvas.get('el'));
	      self.set('width', canvas.get('width'));
	      self.set('height', canvas.get('height'));
	    } catch (error) {
	      throw error;
	    }
	    Chart.plugins.notify(self, 'afterCanvasInit');
	    self._initLayout();
	  }

	  _initLayers() {
	    const canvas = this.get('canvas');
	    this.set('backPlot', canvas.addGroup());
	    this.set('middlePlot', canvas.addGroup({
	      zIndex: 10
	    }));
	    this.set('frontPlot', canvas.addGroup({
	      zIndex: 20
	    }));
	  }

	  _init() {
	    const self = this;
	    self._initCanvas();
	    self._initLayers();
	    self.set('geoms', []);
	    self.set('scaleController', new scale$1());
	    self.set('axisController', new axis$1({
	      frontPlot: self.get('frontPlot').addGroup({
	        className: 'axisContainer'
	      }),
	      backPlot: self.get('backPlot').addGroup({
	        className: 'axisContainer'
	      }),
	      chart: self
	    }));
	    Chart.plugins.notify(self, 'init');
	  }

	  constructor(cfg) {
	    super(cfg);
	    const self = this;
	    common.each(base$4, function(geomConstructor, className) {
	      const methodName = common.lowerFirst(className);
	      self[methodName] = function(cfg) {
	        const geom = new geomConstructor(cfg);
	        self.addGeom(geom);
	        return geom;
	      };
	    });
	    self._init();
	  }

	  /**
	   * set data and some scale configuration
	   * @chainable
	   * @param  {Array} data the dataset to visualize
	   * @param  {Object} colDefs the configuration for scales
	   * @return {Chart} return the chart instance
	   */
	  source(data, colDefs) {
	    this.set('data', data);
	    if (colDefs) {
	      this.scale(colDefs);
	    }
	    return this;
	  }

	  scale(field, cfg) {
	    const colDefs = this.get('colDefs') || {};
	    if (common.isObject(field)) {
	      common.mix(colDefs, field);
	    } else {
	      colDefs[field] = cfg;
	    }

	    this.set('colDefs', colDefs);
	    const scaleController = this.get('scaleController');
	    scaleController.defs = colDefs;

	    return this;
	  }

	  /**
	   * configure the axis
	   * @chainable
	   * @param  {String|Boolean} field the field name of data
	   * @param  {Object} cfg configuration for axis
	   * @return {Chart} return the chart instance
	   */
	  axis(field, cfg) {
	    const axisController = this.get('axisController');
	    if (!field) {
	      axisController.axisCfg = null;
	    } else {
	      axisController.axisCfg = axisController.axisCfg || {};
	      axisController.axisCfg[field] = cfg;
	    }
	    return this;
	  }

	  /**
	   * configure the coordinate
	   * @chainable
	   * @param  {String} type set the type of coodinate
	   * @param  {Object} cfg configuration for coordinate
	   * @return {Chart} return the chart instance
	   */
	  coord(type, cfg) {
	    let coordCfg;
	    if (common.isObject(type)) {
	      coordCfg = type;
	    } else {
	      coordCfg = cfg || {};
	      coordCfg.type = type || 'cartesian';
	    }
	    this.set('coordCfg', coordCfg);

	    return this;
	  }

	  filter(field, condition) {
	    const filters = this.get('filters') || {};
	    filters[field] = condition;
	    this.set('filters', filters);
	  }

	  /**
	   * render the chart
	   * @chainable
	   * @return {Chart} return the chart instance
	   */
	  render() {
	    const canvas = this.get('canvas');
	    const geoms = this.get('geoms');
	    const data = this.get('data') || [];

	    const filteredData = this._execFilter(data); // filter data
	    this.set('filteredData', filteredData);
	    this._initCoord(); // initialization coordinate instance

	    Chart.plugins.notify(this, 'beforeGeomInit');

	    this._initGeoms(geoms); // init all geometry instances

	    this.get('syncY') && this._syncYScales();

	    this._adjustScale(); // do some adjust for data

	    Chart.plugins.notify(this, 'beforeGeomDraw');
	    this._renderAxis();

	    const middlePlot = this.get('middlePlot');
	    if (this.get('limitInPlot') && !middlePlot.attr('clip')) {
	      const coord = this.get('coord');
	      const clip = helper.getClip(coord);
	      clip.set('canvas', middlePlot.get('canvas'));
	      middlePlot.attr('clip', clip);
	    }

	    for (let i = 0, length = geoms.length; i < length; i++) {
	      const geom = geoms[i];
	      geom.paint();
	    }

	    Chart.plugins.notify(this, 'afterGeomDraw');
	    canvas.sort();
	    this.get('frontPlot').sort();
	    Chart.plugins.notify(this, 'beforeCanvasDraw');
	    canvas.draw();
	    return this;
	  }

	  /**
	   * clear the chart, include geometris and all the shapes
	   * @chainable
	   * @return {Chart} return the chart
	   */
	  clear() {
	    Chart.plugins.notify(this, 'clear');
	    this._removeGeoms();
	    this._clearInner();
	    this.set('filters', null);
	    this.set('isUpdate', false);
	    this.set('_padding', null);
	    const canvas = this.get('canvas');
	    canvas.draw();
	    return this;
	  }

	  repaint() {
	    this.set('isUpdate', true);
	    Chart.plugins.notify(this, 'repaint');
	    this._clearInner();
	    this.render();
	  }

	  changeData(data) {
	    this.set('data', data);
	    Chart.plugins.notify(this, 'changeData');
	    this.set('_padding', null);
	    this.repaint();
	  }

	  changeSize(width, height) {
	    if (width) {
	      this.set('width', width);
	    } else {
	      width = this.get('width');
	    }

	    if (height) {
	      this.set('height', height);
	    } else {
	      height = this.get('height');
	    }

	    const canvas = this.get('canvas');
	    canvas.changeSize(width, height);
	    this._initLayout();
	    this.repaint();
	    return this;
	  }

	  destroy() {
	    this.clear();
	    const canvas = this.get('canvas');
	    canvas.destroy();
	    Chart.plugins.notify(this, 'afterCanvasDestroyed');

	    if (this._interactions) {
	      common.each(this._interactions, interaction => {
	        interaction.destroy();
	      });
	    }

	    super.destroy();
	  }

	  /**
	   * calculate dataset's position on canvas
	   * @param  {Object} record the dataset
	   * @return {Object} return the position
	   */
	  getPosition(record) {
	    const self = this;
	    const coord = self.get('coord');
	    const xScale = self.getXScale();
	    const yScale = self.getYScales()[0];
	    const xField = xScale.field;
	    const x = xScale.scale(record[xField]);
	    const yField = yScale.field;
	    const y = yScale.scale(record[yField]);
	    return coord.convertPoint({
	      x,
	      y
	    });
	  }

	  /**
	   * get the data item of the point
	   * @param  {Object} point canvas position
	   * @return {Object} return the data item
	   */
	  getRecord(point) {
	    const self = this;
	    const coord = self.get('coord');
	    const xScale = self.getXScale();
	    const yScale = self.getYScales()[0];
	    const invertPoint = coord.invertPoint(point);
	    const record = {};
	    record[xScale.field] = xScale.invert(invertPoint.x);
	    record[yScale.field] = yScale.invert(invertPoint.y);
	    return record;
	  }
	  /**
	   * get the dataset of the point
	   * @param  {Object} point canvas position
	   * @return {Array} return the dataset
	  **/
	  getSnapRecords(point) {
	    const geom = this.get('geoms')[0];
	    let data = [];
	    if (geom) { // need to judge
	      data = geom.getSnapRecords(point);
	    }
	    return data;
	  }

	  /**
	   * creat scale instances
	   * @param  {String} field field name of data
	   * @return {Scale} return the scale
	   */
	  createScale(field) {
	    let data = this.get('data');
	    const filteredData = this.get('filteredData');
	    if (filteredData.length) {
	      const legendFields = this._getFieldsForLegend();
	      if (legendFields.indexOf(field) === -1) {
	        data = filteredData;
	      }
	    }

	    const scales = this.get('scales');
	    if (!scales[field]) {
	      scales[field] = this._createScale(field, data);
	    }
	    return scales[field];
	  }

	  /**
	   * @protected
	   * add geometry instance to geoms
	   * @param {Geom} geom geometry instance
	   */
	  addGeom(geom) {
	    const geoms = this.get('geoms');
	    const middlePlot = this.get('middlePlot');
	    geoms.push(geom);
	    geom.set('chart', this);
	    geom.set('container', middlePlot.addGroup());
	  }

	  /**
	   * get the scale of x axis
	   * @return {Scale} return the scale
	   */
	  getXScale() {
	    const self = this;
	    const geoms = self.get('geoms');
	    const xScale = geoms[0].getXScale();
	    return xScale;
	  }

	  /**
	   * get the scale of y axis
	   * @return {Array} return the scale
	   */
	  getYScales() {
	    const geoms = this.get('geoms');
	    const rst = [];

	    common.each(geoms, function(geom) {
	      const yScale = geom.getYScale();
	      if (rst.indexOf(yScale) === -1) {
	        rst.push(yScale);
	      }
	    });
	    return rst;
	  }

	  getLegendItems() {
	    if (this.get('legendItems')) {
	      return this.get('legendItems');
	    }
	    const legendItems = {};
	    const scales = [];

	    const geoms = this.get('geoms');
	    common.each(geoms, geom => {
	      const colorAttr = geom.getAttr('color');
	      if (colorAttr) {
	        const scale = colorAttr.getScale('color');
	        // 只支持分类图例
	        if (scale.isCategory && !_isScaleExist(scales, scale)) {
	          scales.push(scale);

	          const field = scale.field;
	          const ticks = scale.getTicks();
	          const items = [];
	          common.each(ticks, tick => {
	            const text = tick.text;
	            const name = text;
	            const scaleValue = tick.value;
	            const value = scale.invert(scaleValue);
	            const color = colorAttr.mapping(value).join('') || global$1.defaultColor;

	            const marker = {
	              fill: color,
	              radius: 3,
	              symbol: 'circle',
	              stroke: '#fff'
	            };

	            items.push({
	              name, // for display
	              dataValue: value, // the origin value
	              checked: true,
	              marker
	            });
	          });

	          legendItems[field] = items;
	        }
	      }
	    });

	    this.set('legendItems', legendItems);

	    return legendItems;
	  }

	  // register the plugins
	  registerPlugins(plugins) {
	    const self = this;
	    let chartPlugins = self.get('plugins') || [];
	    if (!common.isArray(chartPlugins)) {
	      chartPlugins = [ chartPlugins ];
	    }

	    ([]).concat(plugins).forEach(plugin => {
	      if (chartPlugins.indexOf(plugin) === -1) {
	        plugin.init && plugin.init(self); // init
	        chartPlugins.push(plugin);
	      }
	    });
	    Chart.plugins._cacheId++;
	    self.set('plugins', chartPlugins);
	  }

	  _renderAxis() {
	    const axisController = this.get('axisController');
	    const xScale = this.getXScale();
	    const yScales = this.getYScales();
	    const coord = this.get('coord');
	    Chart.plugins.notify(this, 'beforeRenderAxis');
	    axisController.createAxis(coord, xScale, yScales);
	  }

	  _isAutoPadding() {
	    if (this.get('_padding')) {
	      return false;
	    }
	    const padding = this.get('padding');
	    if (common.isArray(padding)) {
	      return padding.indexOf('auto') !== -1;
	    }
	    return padding === 'auto';
	  }

	  _updateLayout(padding) {
	    const width = this.get('width');
	    const height = this.get('height');
	    const start = {
	      x: padding[3],
	      y: padding[0]
	    };
	    const end = {
	      x: width - padding[1],
	      y: height - padding[2]
	    };

	    const plot = this.get('plot');
	    const coord = this.get('coord');
	    plot.reset(start, end);
	    coord.reset(plot);
	  }
	}

	Chart.plugins = Chart.initPlugins();

	var chart = Chart;

	const Core = {};


	Core.Global = global$1;
	Core.version = global$1.version;
	Core.Chart = chart;
	Core.Shape = shape$1;
	Core.G = graphic;
	Core.Util = common;

	// Core.track = function(enable) {
	//   Global.trackable = enable;
	// };
	// require('./track');

	// 2018-12-27 关闭打点
	Core.track = () => {
	  return null;
	};

	var core = Core;

	/**
	 * @fileOverview shape util
	 * @author dxq613@gmail.com
	 */



	const ShapeUtil = {
	  splitPoints(obj) {
	    const points = [];
	    const x = obj.x;
	    let y = obj.y;
	    y = common.isArray(y) ? y : [ y ];
	    y.forEach(function(yItem, index) {
	      const point = {
	        x: common.isArray(x) ? x[index] : x,
	        y: yItem
	      };
	      points.push(point);
	    });
	    return points;
	  },
	  splitArray(data, yField, connectNulls) {
	    if (!data.length) return [];
	    const arr = [];
	    let tmp = [];
	    let yValue;
	    common.each(data, function(obj) {
	      yValue = obj._origin ? obj._origin[yField] : obj[yField];
	      if (connectNulls) {
	        if (!common.isNil(yValue)) {
	          tmp.push(obj);
	        }
	      } else {
	        if ((common.isArray(yValue) && common.isNil(yValue[0])) || common.isNil(yValue)) {
	          if (tmp.length) {
	            arr.push(tmp);
	            tmp = [];
	          }
	        } else {
	          tmp.push(obj);
	        }
	      }
	    });

	    if (tmp.length) {
	      arr.push(tmp);
	    }

	    return arr;
	  }
	};

	var util$1 = ShapeUtil;

	const SHAPES = [ 'circle', 'hollowCircle', 'rect' ];

	const Point = shape$1.registerFactory('point', {
	  defaultShapeType: 'circle',
	  getDefaultPoints(pointInfo) {
	    return util$1.splitPoints(pointInfo);
	  }
	});

	function getPointsCfg(cfg) {
	  const style = {
	    lineWidth: 0,
	    stroke: cfg.color,
	    fill: cfg.color
	  };
	  if (cfg.size) {
	    style.size = cfg.size;
	  }

	  common.mix(style, cfg.style);
	  return common.mix({}, global$1.shape.point, style);
	}

	function drawShape(cfg, container, shape) {
	  if (cfg.size === 0) return;
	  const pointCfg = getPointsCfg(cfg);
	  const size = pointCfg.r || pointCfg.size;
	  const x = cfg.x;
	  const y = !common.isArray(cfg.y) ? [ cfg.y ] : cfg.y;
	  if (shape === 'hollowCircle') {
	    pointCfg.lineWidth = 1;
	    pointCfg.fill = null;
	  }
	  for (let i = 0, len = y.length; i < len; i++) {
	    if (shape === 'rect') {
	      return container.addShape('Rect', {
	        className: 'point',
	        attrs: common.mix({
	          x: x - size,
	          y: y[i] - size,
	          width: size * 2,
	          height: size * 2
	        }, pointCfg)
	      });
	    }

	    return container.addShape('Circle', {
	      className: 'point',
	      attrs: common.mix({
	        x,
	        y: y[i],
	        r: size
	      }, pointCfg)
	    });
	  }
	}

	common.each(SHAPES, function(shapeType) {
	  shape$1.registerShape('point', shapeType, {
	    draw(cfg, container) {
	      return drawShape(cfg, container, shapeType);
	    }
	  });
	});

	class Point$1 extends base$4 {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'point';
	    cfg.shapeType = 'point';
	    cfg.generatePoints = true;
	    return cfg;
	  }

	  draw(data, shapeFactory) {
	    const self = this;
	    const container = self.get('container');
	    common.each(data, obj => {
	      const shape = obj.shape;
	      const cfg = self.getDrawCfg(obj);
	      if (common.isArray(obj.y)) {
	        const hasStack = self.hasAdjust('stack');
	        common.each(obj.y, (y, idx) => {
	          cfg.y = y;
	          if (!hasStack || idx !== 0) {
	            self.drawShape(shape, obj, cfg, container, shapeFactory);
	          }
	        });
	      } else if (!common.isNil(obj.y)) {
	        self.drawShape(shape, obj, cfg, container, shapeFactory);
	      }
	    });
	  }
	}

	base$4.Point = Point$1;

	// register line geom
	const Line$2 = shape$1.registerFactory('line', {
	  defaultShapeType: 'line'
	});

	function getStyle(cfg) {
	  const style = {
	    strokeStyle: cfg.color
	  };
	  if (cfg.size >= 0) {
	    style.lineWidth = cfg.size;
	  }
	  common.mix(style, cfg.style);

	  return common.mix({}, global$1.shape.line, style);
	}

	function drawLines(cfg, container, style, smooth) {
	  const points = cfg.points;
	  if (points.length && common.isArray(points[0].y)) {
	    const topPoints = [];
	    const bottomPoints = [];
	    for (let i = 0, len = points.length; i < len; i++) {
	      const point = points[i];
	      const tmp = util$1.splitPoints(point);
	      bottomPoints.push(tmp[0]);
	      topPoints.push(tmp[1]);
	    }
	    if (cfg.isInCircle) {
	      topPoints.push(topPoints[0]);
	      bottomPoints.push(bottomPoints[0]);
	    }
	    if (cfg.isStack) {
	      return container.addShape('Polyline', {
	        className: 'line',
	        attrs: common.mix({
	          points: topPoints,
	          smooth
	        }, style)
	      });
	    }
	    const topShape = container.addShape('Polyline', {
	      className: 'line',
	      attrs: common.mix({
	        points: topPoints,
	        smooth
	      }, style)
	    });
	    const bottomShape = container.addShape('Polyline', {
	      className: 'line',
	      attrs: common.mix({
	        points: bottomPoints,
	        smooth
	      }, style)
	    });

	    return [ topShape, bottomShape ];
	  }
	  if (cfg.isInCircle) {
	    points.push(points[0]);
	  }
	  return container.addShape('Polyline', {
	    className: 'line',
	    attrs: common.mix({
	      points,
	      smooth
	    }, style)
	  });
	}

	const SHAPES$1 = [ 'line', 'smooth', 'dash' ];
	common.each(SHAPES$1, function(shapeType) {
	  shape$1.registerShape('line', shapeType, {
	    draw(cfg, container) {
	      const smooth = (shapeType === 'smooth');
	      const style = getStyle(cfg);
	      if (shapeType === 'dash') {
	        style.lineDash = global$1.lineDash;
	      }

	      return drawLines(cfg, container, style, smooth);
	    }
	  });
	});

	class Path extends base$4 {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'path';
	    cfg.shapeType = 'line';
	    return cfg;
	  }

	  getDrawCfg(obj) {
	    const cfg = super.getDrawCfg(obj);
	    cfg.isStack = this.hasAdjust('stack');
	    return cfg;
	  }

	  draw(data, shapeFactory) {
	    const self = this;
	    const container = self.get('container');
	    const yScale = self.getYScale();
	    const connectNulls = self.get('connectNulls');
	    const splitArray = util$1.splitArray(data, yScale.field, connectNulls);

	    const cfg = this.getDrawCfg(data[0]);
	    cfg.origin = data;

	    common.each(splitArray, function(subData, splitedIndex) {
	      cfg.splitedIndex = splitedIndex;
	      cfg.points = subData;
	      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
	    });
	  }
	}

	base$4.Path = Path;
	var path = Path;

	class Line$3 extends path {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'line';
	    cfg.sortable = true;
	    return cfg;
	  }
	}

	base$4.Line = Line$3;

	function equals(v1, v2) {
	  return Math.abs(v1 - v2) < 0.00001;
	}

	function notEmpty(value) {
	  return !isNaN(value) && !common.isNil(value);
	}

	function filterPoints(points) {
	  const filteredPoints = [];
	  // filter the point which x or y is NaN
	  for (let i = 0, len = points.length; i < len; i++) {
	    const point = points[i];
	    if (notEmpty(point.x) && notEmpty(point.y)) {
	      filteredPoints.push(point);
	    }
	  }

	  return filteredPoints;
	}

	function equalsCenter(points, center) {
	  let eqls = true;
	  common.each(points, function(point) {
	    if (!equals(point.x, center.x) || !equals(point.y, center.y)) {
	      eqls = false;
	      return false;
	    }
	  });
	  return eqls;
	}

	function drawRectShape(topPoints, bottomPoints, container, style, isSmooth) {
	  let shape;
	  const points = topPoints.concat(bottomPoints);
	  if (isSmooth) {
	    shape = container.addShape('Custom', {
	      className: 'area',
	      attrs: common.mix({
	        points
	      }, style),
	      createPath(context) {
	        const constaint = [
	          [ 0, 0 ],
	          [ 1, 1 ]
	        ];
	        const points = filterPoints(this._attrs.attrs.points);

	        const pointsLen = points.length;
	        const topPoints = points.slice(0, pointsLen / 2);
	        const bottomPoints = points.slice(pointsLen / 2, pointsLen);
	        const topSps = smooth.smooth(topPoints, false, constaint);
	        context.beginPath();
	        context.moveTo(topPoints[0].x, topPoints[0].y);
	        for (let i = 0, n = topSps.length; i < n; i++) {
	          const sp = topSps[i];
	          context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
	        }

	        if (bottomPoints.length) {
	          const bottomSps = smooth.smooth(bottomPoints, false, constaint);
	          context.lineTo(bottomPoints[0].x, bottomPoints[0].y);
	          for (let i = 0, n = bottomSps.length; i < n; i++) {
	            const sp = bottomSps[i];
	            context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
	          }
	        }
	        context.closePath();
	      },
	      calculateBox() {
	        const points = filterPoints(this._attrs.attrs.points);
	        return bbox.getBBoxFromPoints(points);
	      }
	    });
	  } else {
	    shape = container.addShape('Polyline', {
	      className: 'area',
	      attrs: common.mix({
	        points
	      }, style)
	    });
	  }
	  return shape;
	}

	function drawShape$1(cfg, container, isSmooth) {
	  const self = this;
	  const points = cfg.points;
	  let topPoints = [];
	  let bottomPoints = [];
	  common.each(points, function(point) {
	    bottomPoints.push(point[0]);
	    topPoints.push(point[1]);
	  });
	  const style = common.mix({
	    fillStyle: cfg.color
	  }, global$1.shape.area, cfg.style);

	  bottomPoints.reverse();
	  topPoints = self.parsePoints(topPoints);
	  bottomPoints = self.parsePoints(bottomPoints);
	  if (cfg.isInCircle) {
	    topPoints.push(topPoints[0]);
	    bottomPoints.unshift(bottomPoints[bottomPoints.length - 1]);
	    if (equalsCenter(bottomPoints, cfg.center)) {
	      bottomPoints = [];
	    }
	  }

	  return drawRectShape(topPoints, bottomPoints, container, style, isSmooth);
	}

	const Area = shape$1.registerFactory('area', {
	  defaultShapeType: 'area',
	  getDefaultPoints(obj) {
	    const x = obj.x;
	    let y = obj.y;
	    const y0 = obj.y0;
	    y = common.isArray(y) ? y : [ y0, y ];

	    const points = [];
	    points.push({
	      x,
	      y: y[0]
	    }, {
	      x,
	      y: y[1]
	    });
	    return points;
	  }
	});

	const SHAPES$2 = [ 'area', 'smooth' ];
	common.each(SHAPES$2, function(shapeType) {
	  shape$1.registerShape('area', shapeType, {
	    draw(cfg, container) {
	      const smooth = (shapeType === 'smooth');
	      return drawShape$1.call(this, cfg, container, smooth);
	    }
	  });
	});

	/**
	 * @fileOverview area geometry
	 * @author dxq613 @gmail.com
	 * @author sima.zhang1990@gmail.com
	 */






	class Area$1 extends base$4 {
	  /**
	   * get the default configuration
	   * @protected
	   * @return {Object} return the result
	   */
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'area';
	    cfg.shapeType = 'area';
	    cfg.generatePoints = true;
	    cfg.sortable = true;
	    return cfg;
	  }

	  draw(data, shapeFactory) {
	    const self = this;
	    const container = self.get('container');
	    const cfg = this.getDrawCfg(data[0]);
	    const yScale = self.getYScale();
	    const connectNulls = self.get('connectNulls');
	    const splitArray = util$1.splitArray(data, yScale.field, connectNulls);
	    cfg.origin = data;
	    common.each(splitArray, function(subData, splitedIndex) {
	      cfg.splitedIndex = splitedIndex;
	      const points = subData.map(obj => {
	        return obj.points;
	      });
	      cfg.points = points;
	      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
	    });
	  }
	}

	base$4.Area = Area$1;

	/**
	 * @fileOverview Utility for calculate the with ratui in x axis
	 * @author sima.zhang1990@gmail.com
	 * @author dxq613@gmail.com
	 */




	const SizeMixin = {
	  getDefalutSize() {
	    let defaultSize = this.get('defaultSize');
	    if (!defaultSize) {
	      const coord = this.get('coord');
	      const xScale = this.getXScale();
	      const dataArray = this.get('dataArray');
	      const values = common.uniq(xScale.values);
	      const count = values.length;
	      const range = xScale.range;
	      let normalizeSize = 1 / count;
	      let widthRatio = 1;

	      if (coord && coord.isPolar) {
	        if (coord.transposed && count > 1) {
	          widthRatio = global$1.widthRatio.multiplePie;
	        } else {
	          widthRatio = global$1.widthRatio.rose;
	        }
	      } else {
	        if (xScale.isLinear) {
	          normalizeSize *= (range[1] - range[0]);
	        }
	        widthRatio = global$1.widthRatio.column;
	      }
	      normalizeSize *= widthRatio;
	      if (this.hasAdjust('dodge')) {
	        normalizeSize = normalizeSize / dataArray.length;
	      }
	      defaultSize = normalizeSize;
	      this.set('defaultSize', defaultSize);
	    }
	    return defaultSize;
	  },
	  getDimWidth(dimName) {
	    const coord = this.get('coord');
	    const start = coord.convertPoint({
	      x: 0,
	      y: 0
	    });
	    const end = coord.convertPoint({
	      x: dimName === 'x' ? 1 : 0,
	      y: dimName === 'x' ? 0 : 1
	    });
	    let width = 0;
	    if (start && end) {
	      width = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
	    }
	    return width;
	  },
	  _getWidth() {
	    let width = this.get('_width');
	    if (!width) {
	      const coord = this.get('coord');
	      if (coord && coord.isPolar && !coord.transposed) {
	        width = (coord.endAngle - coord.startAngle) * coord.circleRadius;
	      } else {
	        width = this.getDimWidth('x');
	      }
	      this.set('_width', width);
	    }

	    return width;
	  },
	  _toNormalizedSize(size) {
	    const width = this._getWidth();
	    return size / width;
	  },
	  _toCoordSize(normalizeSize) {
	    const width = this._getWidth();
	    return width * normalizeSize;
	  },
	  getNormalizedSize(obj) {
	    let size = this.getAttrValue('size', obj);
	    if (common.isNil(size)) {
	      size = this.getDefalutSize();
	    } else {
	      size = this._toNormalizedSize(size);
	    }
	    return size;
	  },
	  getSize(obj) {
	    let size = this.getAttrValue('size', obj);
	    if (common.isNil(size)) {
	      const normalizeSize = this.getDefalutSize();
	      size = this._toCoordSize(normalizeSize);
	    }
	    return size;
	  }
	};

	var size$1 = SizeMixin;

	function getRectPoints(cfg) {
	  const { x, y, y0, size } = cfg;

	  let ymin = y0;
	  let ymax = y;
	  if (common.isArray(y)) {
	    ymax = y[1];
	    ymin = y[0];
	  }

	  let xmin;
	  let xmax;
	  if (common.isArray(x)) {
	    xmin = x[0];
	    xmax = x[1];
	  } else {
	    xmin = x - size / 2;
	    xmax = x + size / 2;
	  }

	  return [
	    { x: xmin, y: ymin },
	    { x: xmin, y: ymax },
	    { x: xmax, y: ymax },
	    { x: xmax, y: ymin }
	  ];
	}

	function getRectRange(points) {
	  const xValues = [];
	  const yValues = [];
	  for (let i = 0, len = points.length; i < len; i++) {
	    const point = points[i];
	    xValues.push(point.x);
	    yValues.push(point.y);
	  }
	  const xMin = Math.min.apply(null, xValues);
	  const yMin = Math.min.apply(null, yValues);
	  const xMax = Math.max.apply(null, xValues);
	  const yMax = Math.max.apply(null, yValues);

	  return {
	    x: xMin,
	    y: yMin,
	    width: xMax - xMin,
	    height: yMax - yMin
	  };
	}

	function getMiddlePoint(a, b) {
	  const x = (a.x - b.x) / 2 + b.x;
	  const y = (a.y - b.y) / 2 + b.y;
	  return { x, y };
	}

	const Interval = shape$1.registerFactory('interval', {
	  defaultShapeType: 'rect',
	  getDefaultPoints(cfg) {
	    return getRectPoints(cfg);
	  }
	});

	shape$1.registerShape('interval', 'rect', {
	  draw(cfg, container) {
	    const points = this.parsePoints(cfg.points);
	    const style = common.mix({
	      fill: cfg.color
	    }, global$1.shape.interval, cfg.style);
	    if (cfg.isInCircle) {
	      let newPoints = points.slice(0);
	      if (this._coord.transposed) {
	        newPoints = [ points[0], points[3], points[2], points[1] ];
	      }

	      const { x, y } = cfg.center;
	      const v = [ 1, 0 ];
	      const v0 = [ newPoints[0].x - x, newPoints[0].y - y ];
	      const v1 = [ newPoints[1].x - x, newPoints[1].y - y ];
	      const v2 = [ newPoints[2].x - x, newPoints[2].y - y ];

	      let startAngle = vector2.angleTo(v, v1);
	      let endAngle = vector2.angleTo(v, v2);
	      const r0 = vector2.length(v0);
	      const r = vector2.length(v1);

	      if (startAngle >= 1.5 * Math.PI) {
	        startAngle = startAngle - 2 * Math.PI;
	      }

	      if (endAngle >= 1.5 * Math.PI) {
	        endAngle = endAngle - 2 * Math.PI;
	      }

	      return container.addShape('Sector', {
	        className: 'interval',
	        attrs: common.mix({
	          x,
	          y,
	          r,
	          r0,
	          startAngle,
	          endAngle
	        }, style)
	      });
	    }

	    const rectCfg = getRectRange(points);

	    return container.addShape('rect', {
	      className: 'interval',
	      attrs: common.mix(rectCfg, style)
	    });
	  }
	});

	// 金字塔 和 漏斗图
	[ 'pyramid', 'funnel' ].forEach(shapeType => {
	  shape$1.registerShape('interval', shapeType, {
	    getPoints(cfg) {
	      cfg.size = cfg.size * 2; // 漏斗图的 size 是柱状图的两倍
	      return getRectPoints(cfg);
	    },
	    draw(cfg, container) {
	      const points = this.parsePoints(cfg.points);
	      const nextPoints = this.parsePoints(cfg.nextPoints);

	      let polygonPoints = null;
	      if (nextPoints) {
	        polygonPoints = [ points[0], points[1], nextPoints[1], nextPoints[0] ];
	      } else {
	        polygonPoints = [
	          points[0],
	          points[1]
	        ];
	        // pyramid 顶部是三角形，所以取中心点就好了，funnel顶部是长方形
	        if (shapeType === 'pyramid') {
	          polygonPoints.push(getMiddlePoint(points[2], points[3]));
	        } else {
	          polygonPoints.push(points[2], points[3]);
	        }
	      }

	      const attrs = common.mix({
	        fill: cfg.color,
	        points: polygonPoints
	      }, global$1.shape.interval, cfg.style);

	      return container.addShape('polygon', {
	        className: 'interval',
	        attrs
	      });
	    }
	  });
	});

	class Interval$1 extends base$4 {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'interval';
	    cfg.shapeType = 'interval';
	    cfg.generatePoints = true;
	    return cfg;
	  }

	  constructor(cfg) {
	    super(cfg);
	    common.mix(this, size$1);
	  }

	  createShapePointsCfg(obj) {
	    const cfg = super.createShapePointsCfg(obj);
	    cfg.size = this.getNormalizedSize(obj);
	    return cfg;
	  }

	  clearInner() {
	    super.clearInner();
	    this.set('defaultSize', null);
	  }
	}

	base$4.Interval = Interval$1;

	const Polygon$1 = shape$1.registerFactory('polygon', {
	  defaultShapeType: 'polygon',
	  getDefaultPoints(pointInfo) {
	    const points = [];
	    const { x, y } = pointInfo;
	    for (let i = 0, len = x.length; i < len; i++) {
	      points.push({
	        x: x[i],
	        y: y[i]
	      });
	    }
	    return points;
	  }
	});

	shape$1.registerShape('polygon', 'polygon', {
	  draw(cfg, container) {
	    const points = this.parsePoints(cfg.points);
	    const style = common.mix({
	      fill: cfg.color,
	      points
	    }, cfg.style);
	    return container.addShape('Polygon', {
	      className: 'polygon',
	      attrs: style
	    });
	  }
	});

	class Polygon$2 extends base$4 {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'polygon';
	    cfg.shapeType = 'polygon';
	    cfg.generatePoints = true;
	    return cfg;
	  }

	  createShapePointsCfg(obj) {
	    const cfg = super.createShapePointsCfg(obj);
	    const self = this;
	    let x = cfg.x;
	    let y = cfg.y;
	    let temp;
	    if (!(common.isArray(x) && common.isArray(y))) {
	      const xScale = self.getXScale();
	      const yScale = self.getYScale();
	      const xCount = xScale.values ? xScale.values.length : xScale.ticks.length;
	      const yCount = yScale.values ? yScale.values.length : yScale.ticks.length;
	      const xOffset = 0.5 * 1 / xCount;
	      const yOffset = 0.5 * 1 / yCount;
	      if (xScale.isCategory && yScale.isCategory) {
	        x = [ x - xOffset, x - xOffset, x + xOffset, x + xOffset ];
	        y = [ y - yOffset, y + yOffset, y + yOffset, y - yOffset ];
	      } else if (common.isArray(x)) {
	        temp = x;
	        x = [ temp[0], temp[0], temp[1], temp[1] ];
	        y = [ y - yOffset / 2, y + yOffset / 2, y + yOffset / 2, y - yOffset / 2 ];
	      } else if (common.isArray(y)) {
	        temp = y;
	        y = [ temp[0], temp[1], temp[1], temp[0] ];
	        x = [ x - xOffset / 2, x - xOffset / 2, x + xOffset / 2, x + xOffset / 2 ];
	      }
	      cfg.x = x;
	      cfg.y = y;
	    }
	    return cfg;
	  }
	}

	base$4.Polygon = Polygon$2;

	function _sortValue(value) {
	  const sorted = value.sort(function(a, b) {
	    return a < b ? 1 : -1;
	  });

	  const length = sorted.length;
	  if (length < 4) {
	    const min = sorted[length - 1];
	    for (let i = 0; i < (4 - length); i++) {
	      sorted.push(min);
	    }
	  }
	  return sorted;
	}

	// from left bottom corner, and clockwise
	function getCandlePoints(x, y, width) {
	  const yValues = _sortValue(y);
	  const points = [{
	    x,
	    y: yValues[0]
	  }, {
	    x,
	    y: yValues[1]
	  }, {
	    x: x - width / 2,
	    y: yValues[2]
	  }, {
	    x: x - width / 2,
	    y: yValues[1]
	  }, {
	    x: x + width / 2,
	    y: yValues[1]
	  }, {
	    x: x + width / 2,
	    y: yValues[2]
	  }, {
	    x,
	    y: yValues[2]
	  }, {
	    x,
	    y: yValues[3]
	  }];
	  return points;
	}

	const Schema = shape$1.registerFactory('schema', {});

	shape$1.registerShape('schema', 'candle', {
	  getPoints(cfg) {
	    return getCandlePoints(cfg.x, cfg.y, cfg.size);
	  },
	  draw(cfg, container) {
	    const points = this.parsePoints(cfg.points);
	    const style = common.mix({
	      stroke: cfg.color,
	      fill: cfg.color,
	      lineWidth: 1
	    }, cfg.style);
	    return container.addShape('Custom', {
	      className: 'schema',
	      attrs: style,
	      createPath(ctx) {
	        ctx.beginPath();
	        ctx.moveTo(points[0].x, points[0].y);
	        ctx.lineTo(points[1].x, points[1].y);

	        ctx.moveTo(points[2].x, points[2].y);
	        for (let i = 3; i < 6; i++) {
	          ctx.lineTo(points[i].x, points[i].y);
	        }
	        ctx.closePath();
	        ctx.moveTo(points[6].x, points[6].y);
	        ctx.lineTo(points[7].x, points[7].y);
	      }
	    });
	  }
	});

	class Schema$1 extends base$4 {
	  getDefaultCfg() {
	    const cfg = super.getDefaultCfg();
	    cfg.type = 'schema';
	    cfg.shapeType = 'schema';
	    cfg.generatePoints = true;
	    return cfg;
	  }

	  constructor(cfg) {
	    super(cfg);
	    common.mix(this, size$1);
	  }

	  createShapePointsCfg(obj) {
	    const cfg = super.createShapePointsCfg(obj);
	    cfg.size = this.getNormalizedSize(obj);
	    return cfg;
	  }

	  clearInner() {
	    super.clearInner();
	    this.set('defaultSize', null);
	  }
	}

	base$4.Schema = Schema$1;

	var toString$4 = {}.toString;
	var isType$3 = function isType(value, type) {
	  return toString$4.call(value) === '[object ' + type + ']';
	};

	var isType_1$3 = isType$3;

	var isArray$3 = Array.isArray ? Array.isArray : function (value) {
	  return isType_1$3(value, 'Array');
	};

	var isArray_1$3 = isArray$3;

	// isFinite,
	var isNil$3 = function isNil(value) {
	  /**
	   * isNil(null) => true
	   * isNil() => true
	   */
	  return value === null || value === undefined;
	};

	var isNil_1$3 = isNil$3;

	function _inheritsLoose$6(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }







	var Stack =
	/*#__PURE__*/
	function (_Adjust) {
	  _inheritsLoose$6(Stack, _Adjust);

	  function Stack() {
	    return _Adjust.apply(this, arguments) || this;
	  }

	  var _proto = Stack.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    this.xField = null; // 调整对应的 x 方向对应的字段名称

	    this.yField = null; // 调整对应的 y 方向对应的字段名称
	  };

	  _proto.processAdjust = function processAdjust(dataArray) {
	    this.processStack(dataArray);
	  };

	  _proto.processStack = function processStack(dataArray) {
	    var self = this;
	    var xField = self.xField;
	    var yField = self.yField;
	    var count = dataArray.length;
	    var stackCache = {
	      positive: {},
	      negative: {}
	    }; // 层叠顺序翻转

	    if (self.reverseOrder) {
	      dataArray = dataArray.slice(0).reverse();
	    }

	    for (var i = 0; i < count; i++) {
	      var data = dataArray[i];

	      for (var j = 0, len = data.length; j < len; j++) {
	        var item = data[j];
	        var x = item[xField] || 0;
	        var y = item[yField];
	        var xkey = x.toString();
	        y = isArray_1$3(y) ? y[1] : y;

	        if (!isNil_1$3(y)) {
	          var direction = y >= 0 ? 'positive' : 'negative';

	          if (!stackCache[direction][xkey]) {
	            stackCache[direction][xkey] = 0;
	          }

	          item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
	          stackCache[direction][xkey] += y;
	        }
	      }
	    }
	  };

	  return Stack;
	}(base$3);

	base$3.Stack = Stack;

	var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isObject$3 = function isObject(value) {
	  /**
	   * isObject({}) => true
	   * isObject([1, 2, 3]) => true
	   * isObject(Function) => true
	   * isObject(null) => false
	   */
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof$4(value);
	  return value !== null && type === 'object' || type === 'function';
	};

	var isObject_1$3 = isObject$3;

	var each$3 = function each(elements, func) {
	  if (!elements) {
	    return;
	  }
	  var rst = void 0;
	  if (isArray_1$3(elements)) {
	    for (var i = 0, len = elements.length; i < len; i++) {
	      rst = func(elements[i], i);
	      if (rst === false) {
	        break;
	      }
	    }
	  } else if (isObject_1$3(elements)) {
	    for (var k in elements) {
	      if (elements.hasOwnProperty(k)) {
	        rst = func(elements[k], k);
	        if (rst === false) {
	          break;
	        }
	      }
	    }
	  }
	};

	var each_1$3 = each$3;

	function _inheritsLoose$7(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }





	var MARGIN_RATIO = 1 / 2;
	var DODGE_RATIO = 1 / 2;

	var Dodge =
	/*#__PURE__*/
	function (_Adjust) {
	  _inheritsLoose$7(Dodge, _Adjust);

	  function Dodge() {
	    return _Adjust.apply(this, arguments) || this;
	  }

	  var _proto = Dodge.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    /**
	     * 调整过程中,2个数据的间距
	     * @type {Number}
	     */
	    this.marginRatio = MARGIN_RATIO;
	    /**
	     * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
	     * @type {Number}
	     */

	    this.dodgeRatio = DODGE_RATIO;
	    this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
	  };

	  _proto.getDodgeOffset = function getDodgeOffset(range, index, count) {
	    var self = this;
	    var pre = range.pre;
	    var next = range.next;
	    var tickLength = next - pre;
	    var width = tickLength * self.dodgeRatio / count;
	    var margin = self.marginRatio * width;
	    var offset = 1 / 2 * (tickLength - count * width - (count - 1) * margin) + ((index + 1) * width + index * margin) - 1 / 2 * width - 1 / 2 * tickLength;
	    return (pre + next) / 2 + offset;
	  };

	  _proto.processAdjust = function processAdjust(dataArray) {
	    var self = this;
	    var count = dataArray.length;
	    var xField = self.xField;
	    each_1$3(dataArray, function (data, index) {
	      for (var i = 0, len = data.length; i < len; i++) {
	        var obj = data[i];
	        var value = obj[xField];
	        var range = {
	          pre: len === 1 ? value - 1 : value - 0.5,
	          next: len === 1 ? value + 1 : value + 0.5
	        };
	        var dodgeValue = self.getDodgeOffset(range, index, count);
	        obj[xField] = dodgeValue;
	      }
	    });
	  };

	  return Dodge;
	}(base$3);

	base$3.Dodge = Dodge;

	/**
	 * 是否为函数
	 * @param  {*} fn 对象
	 * @return {Boolean}  是否函数
	 */


	var isFunction$1 = function isFunction(value) {
	  return isType_1$3(value, 'Function');
	};

	var isFunction_1$1 = isFunction$1;

	/**
	 * @param {Array} arr The array to iterate over.
	 * @param {Function} [fn] The iteratee invoked per element.
	 * @return {*} Returns the maximum value.
	 * @example
	 *
	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
	 *
	 * maxBy(objects, function(o) { return o.n; });
	 * // => { 'n': 2 }
	 *
	 * maxBy(objects, 'n');
	 * // => { 'n': 2 }
	 */
	var maxBy = function maxBy(arr, fn) {
	  if (!isArray_1$3(arr)) {
	    return undefined;
	  }
	  var max = arr[0];
	  var maxData = void 0;
	  if (isFunction_1$1(fn)) {
	    maxData = fn(arr[0]);
	  } else {
	    maxData = arr[0][fn];
	  }
	  var data = void 0;
	  each_1$3(arr, function (val) {
	    if (isFunction_1$1(fn)) {
	      data = fn(val);
	    } else {
	      data = val[fn];
	    }
	    if (data > maxData) {
	      max = val;
	      maxData = data;
	    }
	  });
	  return max;
	};

	var maxBy_1 = maxBy;

	var merge = function merge(dataArray) {
	  var rst = [];
	  for (var i = 0; i < dataArray.length; i++) {
	    rst = rst.concat(dataArray[i]);
	  }
	  return rst;
	};

	var merge_1 = merge;

	function _inheritsLoose$8(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }







	var ArrayUtil = {
	  merge: merge_1
	};



	var Symmetric =
	/*#__PURE__*/
	function (_Adjust) {
	  _inheritsLoose$8(Symmetric, _Adjust);

	  function Symmetric() {
	    return _Adjust.apply(this, arguments) || this;
	  }

	  var _proto = Symmetric.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    this.xField = null; // 调整对应的 x 方向对应的字段名称

	    this.yField = null; // 调整对应的 y 方向对应的字段名称

	    this.cacheMax = null; // 缓存的最大值

	    this.adjustNames = ['y']; // Only support stack y

	    this.groupFields = null; // 参与分组的数据维度
	  }; // 获取最大的y值


	  _proto._getMax = function _getMax(dim) {
	    var self = this;
	    var mergeData = self.mergeData;
	    var maxRecord = maxBy_1(mergeData, function (obj) {
	      var value = obj[dim];

	      if (isArray_1$3(value)) {
	        return Math.max.apply(null, value);
	      }

	      return value;
	    });
	    var maxValue = maxRecord[dim];
	    var max = isArray_1$3(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
	    return max;
	  }; // 获取每个字段最大的值


	  _proto._getXValuesMax = function _getXValuesMax() {
	    var self = this;
	    var yField = self.yField;
	    var xField = self.xField;
	    var cache = {};
	    var mergeData = self.mergeData;
	    each_1$3(mergeData, function (obj) {
	      var xValue = obj[xField];
	      var yValue = obj[yField];
	      var max = isArray_1$3(yValue) ? Math.max.apply(null, yValue) : yValue;
	      cache[xValue] = cache[xValue] || 0;

	      if (cache[xValue] < max) {
	        cache[xValue] = max;
	      }
	    });
	    return cache;
	  }; // 入口函数


	  _proto.processAdjust = function processAdjust(dataArray) {
	    var self = this;
	    var mergeData = ArrayUtil.merge(dataArray);
	    self.mergeData = mergeData;

	    self._processSymmetric(dataArray);

	    self.mergeData = null;
	  }; // 处理对称


	  _proto._processSymmetric = function _processSymmetric(dataArray) {
	    var self = this;
	    var xField = self.xField;
	    var yField = self.yField;

	    var max = self._getMax(yField);

	    var first = dataArray[0][0];
	    var cache;

	    if (first && isArray_1$3(first[yField])) {
	      cache = self._getXValuesMax();
	    }

	    each_1$3(dataArray, function (data) {
	      each_1$3(data, function (obj) {
	        var value = obj[yField];
	        var offset;

	        if (isArray_1$3(value)) {
	          var xValue = obj[xField];
	          var valueMax = cache[xValue];
	          offset = (max - valueMax) / 2;
	          var tmp = [];
	          /* eslint-disable no-loop-func */

	          each_1$3(value, function (subVal) {
	            // 多个字段
	            tmp.push(offset + subVal);
	          });
	          /* eslint-enable no-loop-func */

	          obj[yField] = tmp;
	        } else {
	          offset = (max - value) / 2;
	          obj[yField] = [offset, value + offset];
	        }
	      });
	    });
	  };

	  return Symmetric;
	}(base$3);

	base$3.Symmetric = Symmetric;

	class Polar extends base$1 {
	  _initDefaultCfg() {
	    this.type = 'polar';
	    this.startAngle = -Math.PI / 2;
	    this.endAngle = Math.PI * 3 / 2;
	    this.inner = 0;
	    this.innerRadius = 0; // alias
	    this.isPolar = true;
	    this.transposed = false;
	    this.center = null;
	    this.radius = null; // relative, 0 ~ 1
	  }

	  init(start, end) {
	    super.init(start, end);
	    const self = this;
	    const inner = self.inner || self.innerRadius;
	    const width = Math.abs(end.x - start.x);
	    const height = Math.abs(end.y - start.y);

	    let maxRadius;
	    let center;
	    if (self.startAngle === -Math.PI && self.endAngle === 0) {
	      maxRadius = Math.min(width / 2, height);
	      center = {
	        x: (start.x + end.x) / 2,
	        y: start.y
	      };
	    } else {
	      maxRadius = Math.min(width, height) / 2;
	      center = {
	        x: (start.x + end.x) / 2,
	        y: (start.y + end.y) / 2
	      };
	    }

	    const radius = self.radius;
	    if (radius > 0 && radius <= 1) {
	      maxRadius = maxRadius * radius;
	    }

	    this.x = {
	      start: self.startAngle,
	      end: self.endAngle
	    };

	    this.y = {
	      start: maxRadius * inner,
	      end: maxRadius
	    };
	    this.center = center;
	    this.circleRadius = maxRadius; // the radius value in px
	  }

	  _convertPoint(point) {
	    const self = this;
	    const center = self.center;
	    const transposed = self.transposed;
	    const xDim = transposed ? 'y' : 'x';
	    const yDim = transposed ? 'x' : 'y';

	    const x = self.x;
	    const y = self.y;

	    const angle = x.start + (x.end - x.start) * point[xDim];
	    const radius = y.start + (y.end - y.start) * point[yDim];

	    return {
	      x: center.x + Math.cos(angle) * radius,
	      y: center.y + Math.sin(angle) * radius
	    };
	  }

	  _invertPoint(point) {
	    const self = this;
	    const { center, transposed, x, y } = self;
	    const xDim = transposed ? 'y' : 'x';
	    const yDim = transposed ? 'x' : 'y';

	    const m = [ 1, 0, 0, 1, 0, 0 ];
	    matrix.rotate(m, m, x.start);

	    let startV = [ 1, 0 ];
	    vector2.transformMat2d(startV, startV, m);
	    startV = [ startV[0], startV[1] ];

	    const pointV = [ point.x - center.x, point.y - center.y ];
	    if (vector2.zero(pointV)) {
	      return {
	        x: 0,
	        y: 0
	      };
	    }

	    let theta = vector2.angleTo(startV, pointV, x.end < x.start);
	    if (Math.abs(theta - Math.PI * 2) < 0.001) {
	      theta = 0;
	    }
	    const l = vector2.length(pointV);
	    let percentX = theta / (x.end - x.start);
	    percentX = x.end - x.start > 0 ? percentX : -percentX;
	    const percentY = (l - y.start) / (y.end - y.start);
	    const rst = {};
	    rst[xDim] = percentX;
	    rst[yDim] = percentY;
	    return rst;
	  }
	}

	base$1.Polar = Polar;

	class Circle$1 extends abstract_1 {
	  _initDefaultCfg() {
	    super._initDefaultCfg();
	    this.startAngle = -Math.PI / 2; // start angle，in radian
	    this.endAngle = Math.PI * 3 / 2; // end angle, in radian
	    this.radius = null; // radius
	    this.center = null; // center
	  }

	  getOffsetPoint(value) {
	    const { startAngle, endAngle } = this;
	    const angle = startAngle + (endAngle - startAngle) * value;
	    return this._getCirclePoint(angle);
	  }

	  _getCirclePoint(angle, radius) {
	    const self = this;
	    const center = self.center;
	    radius = radius || self.radius;
	    return {
	      x: center.x + Math.cos(angle) * radius,
	      y: center.y + Math.sin(angle) * radius
	    };
	  }

	  getTextAlignInfo(point, offset) {
	    const self = this;
	    const offsetVector = self.getOffsetVector(point, offset);
	    let align;
	    let baseLine = 'middle';
	    if (offsetVector[0] > 0) {
	      align = 'left';
	    } else if (offsetVector[0] < 0) {
	      align = 'right';
	    } else {
	      align = 'center';
	      if (offsetVector[1] > 0) {
	        baseLine = 'top';
	      } else if (offsetVector[1] < 0) {
	        baseLine = 'bottom';
	      }
	    }
	    return {
	      textAlign: align,
	      textBaseline: baseLine
	    };
	  }

	  getAxisVector(point) {
	    const center = this.center;
	    const factor = this.offsetFactor;
	    return [ (point.y - center.y) * factor, (point.x - center.x) * -1 * factor ];
	  }

	  drawLine(lineCfg) {
	    const { center, radius, startAngle, endAngle } = this;
	    const container = this.getContainer(lineCfg.top);
	    container.addShape('arc', {
	      className: 'axis-line',
	      attrs: common.mix({
	        x: center.x,
	        y: center.y,
	        r: radius,
	        startAngle,
	        endAngle
	      }, lineCfg)
	    });
	  }
	}

	abstract_1.Circle = Circle$1;

	var fecha = createCommonjsModule(function (module) {
	(function (main) {

	  /**
	   * Parse or format dates
	   * @class fecha
	   */
	  var fecha = {};
	  var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
	  var twoDigits = /\d\d?/;
	  var threeDigits = /\d{3}/;
	  var fourDigits = /\d{4}/;
	  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
	  var literal = /\[([^]*?)\]/gm;
	  var noop = function () {
	  };

	  function shorten(arr, sLen) {
	    var newArr = [];
	    for (var i = 0, len = arr.length; i < len; i++) {
	      newArr.push(arr[i].substr(0, sLen));
	    }
	    return newArr;
	  }

	  function monthUpdate(arrName) {
	    return function (d, v, i18n) {
	      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
	      if (~index) {
	        d.month = index;
	      }
	    };
	  }

	  function pad(val, len) {
	    val = String(val);
	    len = len || 2;
	    while (val.length < len) {
	      val = '0' + val;
	    }
	    return val;
	  }

	  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  var monthNamesShort = shorten(monthNames, 3);
	  var dayNamesShort = shorten(dayNames, 3);
	  fecha.i18n = {
	    dayNamesShort: dayNamesShort,
	    dayNames: dayNames,
	    monthNamesShort: monthNamesShort,
	    monthNames: monthNames,
	    amPm: ['am', 'pm'],
	    DoFn: function DoFn(D) {
	      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
	    }
	  };

	  var formatFlags = {
	    D: function(dateObj) {
	      return dateObj.getDate();
	    },
	    DD: function(dateObj) {
	      return pad(dateObj.getDate());
	    },
	    Do: function(dateObj, i18n) {
	      return i18n.DoFn(dateObj.getDate());
	    },
	    d: function(dateObj) {
	      return dateObj.getDay();
	    },
	    dd: function(dateObj) {
	      return pad(dateObj.getDay());
	    },
	    ddd: function(dateObj, i18n) {
	      return i18n.dayNamesShort[dateObj.getDay()];
	    },
	    dddd: function(dateObj, i18n) {
	      return i18n.dayNames[dateObj.getDay()];
	    },
	    M: function(dateObj) {
	      return dateObj.getMonth() + 1;
	    },
	    MM: function(dateObj) {
	      return pad(dateObj.getMonth() + 1);
	    },
	    MMM: function(dateObj, i18n) {
	      return i18n.monthNamesShort[dateObj.getMonth()];
	    },
	    MMMM: function(dateObj, i18n) {
	      return i18n.monthNames[dateObj.getMonth()];
	    },
	    YY: function(dateObj) {
	      return String(dateObj.getFullYear()).substr(2);
	    },
	    YYYY: function(dateObj) {
	      return pad(dateObj.getFullYear(), 4);
	    },
	    h: function(dateObj) {
	      return dateObj.getHours() % 12 || 12;
	    },
	    hh: function(dateObj) {
	      return pad(dateObj.getHours() % 12 || 12);
	    },
	    H: function(dateObj) {
	      return dateObj.getHours();
	    },
	    HH: function(dateObj) {
	      return pad(dateObj.getHours());
	    },
	    m: function(dateObj) {
	      return dateObj.getMinutes();
	    },
	    mm: function(dateObj) {
	      return pad(dateObj.getMinutes());
	    },
	    s: function(dateObj) {
	      return dateObj.getSeconds();
	    },
	    ss: function(dateObj) {
	      return pad(dateObj.getSeconds());
	    },
	    S: function(dateObj) {
	      return Math.round(dateObj.getMilliseconds() / 100);
	    },
	    SS: function(dateObj) {
	      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
	    },
	    SSS: function(dateObj) {
	      return pad(dateObj.getMilliseconds(), 3);
	    },
	    a: function(dateObj, i18n) {
	      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
	    },
	    A: function(dateObj, i18n) {
	      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
	    },
	    ZZ: function(dateObj) {
	      var o = dateObj.getTimezoneOffset();
	      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
	    }
	  };

	  var parseFlags = {
	    D: [twoDigits, function (d, v) {
	      d.day = v;
	    }],
	    Do: [new RegExp(twoDigits.source + word.source), function (d, v) {
	      d.day = parseInt(v, 10);
	    }],
	    M: [twoDigits, function (d, v) {
	      d.month = v - 1;
	    }],
	    YY: [twoDigits, function (d, v) {
	      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
	      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
	    }],
	    h: [twoDigits, function (d, v) {
	      d.hour = v;
	    }],
	    m: [twoDigits, function (d, v) {
	      d.minute = v;
	    }],
	    s: [twoDigits, function (d, v) {
	      d.second = v;
	    }],
	    YYYY: [fourDigits, function (d, v) {
	      d.year = v;
	    }],
	    S: [/\d/, function (d, v) {
	      d.millisecond = v * 100;
	    }],
	    SS: [/\d{2}/, function (d, v) {
	      d.millisecond = v * 10;
	    }],
	    SSS: [threeDigits, function (d, v) {
	      d.millisecond = v;
	    }],
	    d: [twoDigits, noop],
	    ddd: [word, noop],
	    MMM: [word, monthUpdate('monthNamesShort')],
	    MMMM: [word, monthUpdate('monthNames')],
	    a: [word, function (d, v, i18n) {
	      var val = v.toLowerCase();
	      if (val === i18n.amPm[0]) {
	        d.isPm = false;
	      } else if (val === i18n.amPm[1]) {
	        d.isPm = true;
	      }
	    }],
	    ZZ: [/([\+\-]\d\d:?\d\d|Z)/, function (d, v) {
	      if (v === 'Z') v = '+00:00';
	      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

	      if (parts) {
	        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
	        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
	      }
	    }]
	  };
	  parseFlags.dd = parseFlags.d;
	  parseFlags.dddd = parseFlags.ddd;
	  parseFlags.DD = parseFlags.D;
	  parseFlags.mm = parseFlags.m;
	  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	  parseFlags.MM = parseFlags.M;
	  parseFlags.ss = parseFlags.s;
	  parseFlags.A = parseFlags.a;


	  // Some common format strings
	  fecha.masks = {
	    default: 'ddd MMM DD YYYY HH:mm:ss',
	    shortDate: 'M/D/YY',
	    mediumDate: 'MMM D, YYYY',
	    longDate: 'MMMM D, YYYY',
	    fullDate: 'dddd, MMMM D, YYYY',
	    shortTime: 'HH:mm',
	    mediumTime: 'HH:mm:ss',
	    longTime: 'HH:mm:ss.SSS'
	  };

	  /***
	   * Format a date
	   * @method format
	   * @param {Date|number} dateObj
	   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
	   */
	  fecha.format = function (dateObj, mask, i18nSettings) {
	    var i18n = i18nSettings || fecha.i18n;

	    if (typeof dateObj === 'number') {
	      dateObj = new Date(dateObj);
	    }

	    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
	      throw new Error('Invalid Date in fecha.format');
	    }

	    mask = fecha.masks[mask] || mask || fecha.masks['default'];

	    var literals = [];

	    // Make literals inactive by replacing them with ??
	    mask = mask.replace(literal, function($0, $1) {
	      literals.push($1);
	      return '??';
	    });
	    // Apply formatting rules
	    mask = mask.replace(token, function ($0) {
	      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
	    });
	    // Inline literal values back into the formatted value
	    return mask.replace(/\?\?/g, function() {
	      return literals.shift();
	    });
	  };

	  /**
	   * Parse a date string into an object, changes - into /
	   * @method parse
	   * @param {string} dateStr Date string
	   * @param {string} format Date parse format
	   * @returns {Date|boolean}
	   */
	  fecha.parse = function (dateStr, format, i18nSettings) {
	    var i18n = i18nSettings || fecha.i18n;

	    if (typeof format !== 'string') {
	      throw new Error('Invalid format in fecha.parse');
	    }

	    format = fecha.masks[format] || format;

	    // Avoid regular expression denial of service, fail early for really long strings
	    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
	    if (dateStr.length > 1000) {
	      return false;
	    }

	    var isValid = true;
	    var dateInfo = {};
	    format.replace(token, function ($0) {
	      if (parseFlags[$0]) {
	        var info = parseFlags[$0];
	        var index = dateStr.search(info[0]);
	        if (!~index) {
	          isValid = false;
	        } else {
	          dateStr.replace(info[0], function (result) {
	            info[1](dateInfo, result, i18n);
	            dateStr = dateStr.substr(index + result.length);
	            return result;
	          });
	        }
	      }

	      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
	    });

	    if (!isValid) {
	      return false;
	    }

	    var today = new Date();
	    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
	      dateInfo.hour = +dateInfo.hour + 12;
	    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
	      dateInfo.hour = 0;
	    }

	    var date;
	    if (dateInfo.timezoneOffset != null) {
	      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
	      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
	        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
	    } else {
	      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
	        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
	    }
	    return date;
	  };

	  /* istanbul ignore next */
	  if ( module.exports) {
	    module.exports = fecha;
	  } else {
	    main.fecha = fecha;
	  }
	})(commonjsGlobal);
	});

	var isDate$1 = function isDate(value) {
	  return isType_1$2(value, 'Date');
	};

	var isDate_1$1 = isDate$1;

	/**
	 * @fileOverview 提取公共代码到util方法
	 * @author dxq613@gmail.com
	 */




	var timeUtil = {
	  toTimeStamp: function toTimeStamp(value) {
	    if (isString_1$2(value)) {
	      if (value.indexOf('T') > 0) {
	        value = new Date(value).getTime();
	      } else {
	        value = new Date(value.replace(/-/ig, '/')).getTime();
	      }
	    }

	    if (isDate_1$1(value)) {
	      value = value.getTime();
	    }

	    return value;
	  }
	};

	function _inheritsLoose$9(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

	/**
	 * @fileOverview 时间数据作为分类类型
	 * @author dxq613@gmail.com
	 */

















	/**
	 * 度量的构造函数
	 * @class Scale.TimeCategory
	 */


	var TimeCategory =
	/*#__PURE__*/
	function (_Category) {
	  _inheritsLoose$9(TimeCategory, _Category);

	  function TimeCategory() {
	    return _Category.apply(this, arguments) || this;
	  }

	  var _proto = TimeCategory.prototype;

	  _proto._initDefaultCfg = function _initDefaultCfg() {
	    _Category.prototype._initDefaultCfg.call(this);

	    this.type = 'timeCat';
	    /**
	     * 是否需要排序，默认进行排序
	     * @type {Boolean}
	     */

	    this.sortable = true;
	    this.tickCount = 5;
	    /**
	     * 时间格式化
	     * @type {String}
	     */

	    this.mask = 'YYYY-MM-DD';
	  };

	  _proto.init = function init() {
	    var self = this;
	    var values = this.values; // 针对时间分类类型，会将时间统一转换为时间戳

	    each_1$2(values, function (v, i) {
	      values[i] = self._toTimeStamp(v);
	    });

	    if (this.sortable) {
	      // 允许排序
	      values.sort(function (v1, v2) {
	        return v1 - v2;
	      });
	    }

	    if (!self.ticks) {
	      self.ticks = this.calculateTicks();
	    }
	  }
	  /**
	   * 计算 ticks
	   * @return {array} 返回 ticks 数组
	   */
	  ;

	  _proto.calculateTicks = function calculateTicks() {
	    var self = this;
	    var count = self.tickCount;
	    var ticks;

	    if (count) {
	      var temp = cat({
	        maxCount: count,
	        data: self.values,
	        isRounding: self.isRounding
	      });
	      ticks = temp.ticks;
	    } else {
	      ticks = self.values;
	    }

	    return ticks;
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.translate = function translate(value) {
	    value = this._toTimeStamp(value);
	    var index = this.values.indexOf(value);

	    if (index === -1) {
	      if (isNumber_1$1(value) && value < this.values.length) {
	        index = value;
	      } else {
	        index = NaN;
	      }
	    }

	    return index;
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.scale = function scale(value) {
	    var rangeMin = this.rangeMin();
	    var rangeMax = this.rangeMax();
	    var index = this.translate(value);
	    var percent;

	    if (this.values.length === 1 || isNaN(index)) {
	      // is index is NAN should not be set as 0
	      percent = index;
	    } else if (index > -1) {
	      percent = index / (this.values.length - 1);
	    } else {
	      percent = 0;
	    }

	    return rangeMin + percent * (rangeMax - rangeMin);
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.getText = function getText(value) {
	    var result = '';
	    var index = this.translate(value);

	    if (index > -1) {
	      result = this.values[index];
	    } else {
	      result = value;
	    }

	    var formatter = this.formatter;
	    result = parseInt(result, 10);
	    result = formatter ? formatter(result) : fecha.format(result, this.mask);
	    return result;
	  }
	  /**
	   * @override
	   */
	  ;

	  _proto.getTicks = function getTicks() {
	    var self = this;
	    var ticks = this.ticks;
	    var rst = [];
	    each_1$2(ticks, function (tick) {
	      var obj;

	      if (isObject_1$2(tick)) {
	        obj = tick;
	      } else {
	        obj = {
	          text: isString_1$2(tick) ? tick : self.getText(tick),
	          value: self.scale(tick),
	          tickValue: tick // 用于坐标轴上文本动画时确定前后帧的对应关系

	        };
	      }

	      rst.push(obj);
	    });
	    return rst;
	  } // 将时间转换为时间戳
	  ;

	  _proto._toTimeStamp = function _toTimeStamp(value) {
	    return timeUtil.toTimeStamp(value);
	  };

	  return TimeCategory;
	}(category);

	base$5.TimeCat = TimeCategory;

	const KEYWORDS_PERCENT = {
	  min: 0,
	  median: 0.5,
	  max: 1
	};

	class GuideBase {
	  _initDefaultCfg() {}

	  constructor(cfg) {
	    this._initDefaultCfg();
	    common.deepMix(this, cfg);
	  }

	  _getNormalizedValue(val, scale) {
	    let rst;
	    if (common.isNil(KEYWORDS_PERCENT[val])) {
	      rst = scale.scale(val);
	    } else {
	      rst = KEYWORDS_PERCENT[val];
	    }
	    return rst;
	  }

	  parsePercentPoint(coord, position) {
	    const xPercent = parseFloat(position[0]) / 100;
	    const yPercent = parseFloat(position[1]) / 100;
	    const start = coord.start;
	    const end = coord.end;
	    const width = Math.abs(start.x - end.x);
	    const height = Math.abs(start.y - end.y);
	    const x = width * xPercent + Math.min(start.x, end.x);
	    const y = height * yPercent + Math.min(start.y, end.y);
	    return {
	      x,
	      y
	    };
	  }

	  parsePoint(coord, position) {
	    const self = this;
	    const xScale = self.xScale;
	    const yScales = self.yScales;
	    if (common.isFunction(position)) {
	      position = position(xScale, yScales); // position 必须是对象
	    }

	    // 如果数据格式是 ['50%', '50%'] 的格式
	    // fix: 原始数据中可能会包含 'xxx5%xxx' 这样的数据，需要判断下 https://github.com/antvis/f2/issues/590
	    if (common.isString(position[0]) && position[0].indexOf('%') !== -1 && !isNaN(position[0].slice(0, -1))) {
	      return this.parsePercentPoint(coord, position);
	    }

	    const x = self._getNormalizedValue(position[0], xScale);
	    const y = self._getNormalizedValue(position[1], yScales[0]);

	    const point = coord.convertPoint({ x, y });
	    if (self.limitInPlot) { // limit in chart plotRange
	      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
	        return point;
	      }
	      return null;
	    }
	    return point;
	  }

	  /**
	   * render the guide component
	   * @param  {Coord} coord  coordinate instance
	   * @param  {Canvas.Group} group the container
	   */
	  render(/* coord,group */) {}

	  repaint() {
	    this.remove();
	    const { coord, container, canvas } = this;
	    if (container && !container.isDestroyed()) {
	      this.render(coord, container);
	      canvas.draw();
	    }
	  }

	  remove() {
	    const { element } = this;
	    element && element.remove(true);
	  }

	  changeVisible(visible) {
	    const self = this;
	    self.visible = visible;
	    const element = self.element;

	    if (!element) return;
	    if (element.set) {
	      element.set('visible', visible);
	    } else {
	      element.style.display = visible ? '' : 'none';
	    }
	  }
	}

	var base$6 = GuideBase;

	class Arc$1 extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'arc';
	    /**
	     * start point
	     * @type {Array | Function}
	     */
	    this.start = [];
	    /**
	     * end point
	     * @type {Array | Function}
	     */
	    this.end = [];
	    /**
	     * style configuration
	     * @type {Object}
	     */
	    this.style = {
	      stroke: '#999',
	      lineWidth: 1
	    };
	  }

	  render(coord, container) {
	    const self = this;
	    const start = self.parsePoint(coord, self.start);
	    const end = self.parsePoint(coord, self.end);
	    if (!start || !end) {
	      return;
	    }
	    const coordCenter = coord.center;
	    const radius = Math.sqrt((start.x - coordCenter.x) * (start.x - coordCenter.x)
	      + (start.y - coordCenter.y) * (start.y - coordCenter.y));
	    const startAngle = Math.atan2(start.y - coordCenter.y, start.x - coordCenter.x);
	    const endAngle = Math.atan2(end.y - coordCenter.y, end.x - coordCenter.x);
	    const shape = container.addShape('arc', {
	      className: 'guide-arc',
	      attrs: common.mix({
	        x: coordCenter.x,
	        y: coordCenter.y,
	        r: radius,
	        startAngle,
	        endAngle
	      }, self.style)
	    });
	    self.element = shape;
	    return shape;
	  }
	}

	base$6.Arc = Arc$1;

	function getOffsetFromAlign(alignX, alignY, width, height) {
	  const result = [];

	  if (alignX === 'left' && alignY === 'top') {
	    result[0] = 0;
	    result[1] = 0;
	  } else if (alignX === 'right' && alignY === 'top') {
	    result[0] = -width;
	    result[1] = 0;
	  } else if (alignX === 'left' && alignY === 'bottom') {
	    result[0] = 0;
	    result[1] = Math.floor(-height);
	  } else if (alignX === 'right' && alignY === 'bottom') {
	    result[0] = Math.floor(-width);
	    result[1] = Math.floor(-height);
	  } else if (alignX === 'right' && alignY === 'middle') {
	    result[0] = Math.floor(-width);
	    result[1] = Math.floor(-height / 2);
	  } else if (alignX === 'left' && alignY === 'middle') {
	    result[0] = 0;
	    result[1] = Math.floor(-height / 2);
	  } else if (alignX === 'center' && alignY === 'bottom') {
	    result[0] = Math.floor(-width / 2);
	    result[1] = Math.floor(-height);
	  } else if (alignX === 'center' && alignY === 'top') {
	    result[0] = Math.floor(-width / 2);
	    result[1] = 0;
	  } else {
	    result[0] = Math.floor(-width / 2);
	    result[1] = Math.floor(-height / 2);
	  }

	  return result;
	}

	function modifyCSS(DOM, CSS) {
	  for (const key in CSS) {
	    if (CSS.hasOwnProperty(key)) {
	      DOM.style[key] = CSS[key];
	    }
	  }
	  return DOM;
	}

	function createDom(str) {
	  const container = document.createElement('div');
	  str = str.replace(/(^\s*)|(\s*$)/g, '');
	  container.innerHTML = '' + str;
	  return container.childNodes[0];
	}

	class Html extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'html';
	    /**
	     * dom position
	     * @type {Object | Array}
	     */
	    this.position = null;
	    /**
	      * alignment for horizontal direction，can be 'left','center','right'
	      * @type {String}
	      */
	    this.alignX = 'center';
	    /**
	      * alignment for vertical direction，can be 'top', 'middle', 'bottom'
	      * @type {String}
	      */
	    this.alignY = 'middle';
	    /**
	      * offset for horizontal direction
	      * @type {Number}
	      */
	    this.offsetX = null;
	    /**
	      * offset for vertical direction
	      * @type {Number}
	      */
	    this.offsetY = null;
	    /**
	    * the html string
	    *@type {String | Function}
	    */
	    this.html = null;
	  }

	  // override paint
	  render(coord, container) {
	    const self = this;
	    const position = self.parsePoint(coord, self.position);
	    if (!position) {
	      return;
	    }
	    let myNode = createDom(self.html);
	    myNode = modifyCSS(myNode, {
	      position: 'absolute',
	      top: Math.floor(position.y) + 'px',
	      left: Math.floor(position.x) + 'px',
	      visibility: 'hidden'
	    });

	    const canvasDom = container.get('canvas').get('el');
	    let parentNode = canvasDom.parentNode;
	    parentNode = modifyCSS(parentNode, {
	      position: 'relative'
	    });

	    const wrapperNode = createDom('<div class="guideWapper" style="position: absolute;top: 0; left: 0;"></div>');
	    parentNode.appendChild(wrapperNode);
	    wrapperNode.appendChild(myNode);

	    const canvasOffsetTop = canvasDom.offsetTop;
	    const canvasOffsetLeft = canvasDom.offsetLeft;
	    const { alignX, alignY, offsetX, offsetY } = self;
	    const width = common.getWidth(myNode);
	    const height = common.getHeight(myNode);
	    const newOffset = getOffsetFromAlign(alignX, alignY, width, height);
	    position.x = position.x + newOffset[0] + canvasOffsetLeft;
	    position.y = position.y + newOffset[1] + canvasOffsetTop;

	    if (offsetX) {
	      position.x += offsetX;
	    }

	    if (offsetY) {
	      position.y += offsetY;
	    }

	    modifyCSS(myNode, {
	      top: Math.floor(position.y) + 'px',
	      left: Math.floor(position.x) + 'px',
	      visibility: 'visible'
	    });
	    self.element = wrapperNode;
	  }

	  remove() {
	    const element = this.element;
	    element && element.parentNode && element.parentNode.removeChild(element);
	  }
	}

	base$6.Html = Html;

	class Line$4 extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'line';
	    this.start = [];
	    this.end = [];
	    this.style = {
	      stroke: '#000',
	      lineWidth: 1
	    };
	  }

	  render(coord, container) {
	    const points = [];
	    points[0] = this.parsePoint(coord, this.start);
	    points[1] = this.parsePoint(coord, this.end);
	    if (!points[0] || !points[1]) {
	      return;
	    }
	    const shape = container.addShape('Line', {
	      className: 'guide-line',
	      attrs: common.mix({
	        x1: points[0].x,
	        y1: points[0].y,
	        x2: points[1].x,
	        y2: points[1].y
	      }, this.style)
	    });
	    this.element = shape;
	    return shape;
	  }
	}

	base$6.Line = Line$4;

	class Rect$2 extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'rect';
	    this.start = [];
	    this.end = [];
	    this.style = {
	      fill: '#CCD7EB',
	      opacity: 0.4
	    };
	  }

	  render(coord, container) {
	    const start = this.parsePoint(coord, this.start);
	    const end = this.parsePoint(coord, this.end);
	    if (!start || !end) {
	      return;
	    }
	    const shape = container.addShape('rect', {
	      className: 'guide-rect',
	      attrs: common.mix({
	        x: Math.min(start.x, end.x),
	        y: Math.min(start.y, end.y),
	        width: Math.abs(end.x - start.x),
	        height: Math.abs(start.y - end.y)
	      }, this.style)
	    });
	    this.element = shape;
	    return shape;
	  }
	}

	base$6.Rect = Rect$2;

	class Text$1 extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'text';
	    /**
	     * the position of text
	     * @type {Function | Array}
	     */
	    this.position = null;
	    /**
	     * the display content
	     * @type {String}
	     */
	    this.content = null;
	    /**
	     * style configuration for text
	     * @type {Object}
	     */
	    this.style = {
	      fill: '#000'
	    };
	    /**
	     * offset of horizontal direction
	     * @type {Number}
	     */
	    this.offsetX = 0;
	    /**
	     * offset of vertical direction
	     * @type {Number}
	     */
	    this.offsetY = 0;
	  }

	  render(coord, container) {
	    const position = this.position;
	    const point = this.parsePoint(coord, position);
	    if (!point) {
	      return;
	    }
	    const { content, style, offsetX, offsetY } = this;

	    if (offsetX) {
	      point.x += offsetX;
	    }

	    if (offsetY) {
	      point.y += offsetY;
	    }

	    const shape = container.addShape('text', {
	      className: 'guide-text',
	      attrs: common.mix({
	        x: point.x,
	        y: point.y,
	        text: content
	      }, style)
	    });
	    this.element = shape;
	    return shape;
	  }
	}

	base$6.Text = Text$1;

	class Tag extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'tag';
	    this.position = null;
	    this.content = null;
	    this.direct = 'tl';
	    this.autoAdjust = true;
	    this.offsetX = 0;
	    this.offsetY = 0;
	    this.side = 4;
	    this.background = {
	      padding: 5,
	      radius: 2,
	      fill: '#1890FF'
	    };
	    this.textStyle = {
	      fontSize: 12,
	      fill: '#fff',
	      textAlign: 'center',
	      textBaseline: 'middle'
	    };
	    this.withPoint = true;
	    this.pointStyle = {
	      fill: '#1890FF',
	      r: 3,
	      lineWidth: 1,
	      stroke: '#fff'
	    };
	  }

	  _getDirect(container, point, tagWidth, tagHeight) {
	    let direct = this.direct;
	    const side = this.side;
	    const canvas = container.get('canvas');
	    const clientWidth = canvas.get('width');
	    const clientHeight = canvas.get('height');
	    const { x, y } = point;

	    let vertical = direct[0];
	    let horizontal = direct[1];

	    // adjust for vertical direction
	    if (vertical === 't' && (y - side - tagHeight) < 0) {
	      vertical = 'b';
	    } else if (vertical === 'b' && (y + side + tagHeight) > clientHeight) {
	      vertical = 't';
	    }
	    // adjust for horizontal direction
	    const diff = vertical === 'c' ? side : 0;
	    if (horizontal === 'l' && (x - diff - tagWidth) < 0) {
	      horizontal = 'r';
	    } else if (horizontal === 'r' && (x + diff + tagWidth) > clientWidth) {
	      horizontal = 'l';
	    } else if (horizontal === 'c') {
	      if (tagWidth / 2 + x + diff > clientWidth) {
	        horizontal = 'l';
	      } else if (x - (tagWidth / 2) - diff < 0) {
	        horizontal = 'r';
	      }
	    }

	    direct = vertical + horizontal;
	    return direct;
	  }

	  render(coord, container) {
	    const position = this.parsePoint(coord, this.position);
	    if (!position) {
	      return;
	    }
	    const { content, background, textStyle } = this;
	    const shapes = [];

	    const wrapperContainer = container.addGroup({
	      className: 'guide-tag'
	    });

	    if (this.withPoint) {
	      const pointShape = wrapperContainer.addShape('Circle', {
	        className: 'guide-tag-point',
	        attrs: common.mix({
	          x: position.x,
	          y: position.y
	        }, this.pointStyle)
	      });
	      shapes.push(pointShape);
	    }

	    const tagContainer = wrapperContainer.addGroup();
	    // create a text shape
	    const tagText = tagContainer.addShape('text', {
	      className: 'guide-tag-text',
	      zIndex: 1,
	      attrs: common.mix({
	        x: 0,
	        y: 0,
	        text: content
	      }, textStyle)
	    });
	    shapes.push(tagText);

	    // create background box
	    const textBBox = tagText.getBBox();
	    const padding = common.parsePadding(background.padding);
	    const tagWidth = textBBox.width + padding[1] + padding[3];
	    const tagHeight = textBBox.height + padding[0] + padding[2];
	    const yMin = textBBox.minY - padding[0];
	    const xMin = textBBox.minX - padding[3];
	    const tagBg = tagContainer.addShape('rect', {
	      className: 'guide-tag-bg',
	      zIndex: -1,
	      attrs: common.mix({
	        x: xMin,
	        y: yMin,
	        width: tagWidth,
	        height: tagHeight
	      }, background)
	    });
	    shapes.push(tagBg);
	    const direct = this.autoAdjust ? this._getDirect(container, position, tagWidth, tagHeight) : this.direct;
	    const side = this.side;
	    let x = position.x + this.offsetX;
	    let y = position.y + this.offsetY;
	    let arrowPoints;
	    const radius = common.parsePadding(background.radius);
	    if (direct === 'tl') {
	      arrowPoints = [
	        { x: tagWidth + xMin - side - 1, y: tagHeight + yMin - 1 }, // 这个 1 是为了防止出现白边
	        { x: tagWidth + xMin, y: tagHeight + yMin - 1 },
	        { x: tagWidth + xMin, y: tagHeight + side + yMin }
	      ];
	      radius[2] = 0;
	      x = x - tagWidth;
	      y = y - side - tagHeight;
	    } else if (direct === 'cl') {
	      arrowPoints = [
	        { x: tagWidth + xMin - 1, y: (tagHeight - side) / 2 + yMin - 1 },
	        { x: tagWidth + xMin - 1, y: (tagHeight + side) / 2 + yMin + 1 },
	        { x: tagWidth + side + xMin, y: tagHeight / 2 + yMin }
	      ];

	      x = x - tagWidth - side;
	      y = y - tagHeight / 2;
	    } else if (direct === 'bl') {
	      arrowPoints = [
	        { x: tagWidth + xMin, y: -side + yMin },
	        { x: tagWidth + xMin - side - 1, y: yMin + 1 },
	        { x: tagWidth + xMin, y: yMin + 1 }
	      ];
	      radius[1] = 0;

	      x = x - tagWidth;
	      y = y + side;
	    } else if (direct === 'bc') {
	      arrowPoints = [
	        { x: tagWidth / 2 + xMin, y: -side + yMin },
	        { x: (tagWidth - side) / 2 + xMin - 1, y: yMin + 1 },
	        { x: (tagWidth + side) / 2 + xMin + 1, y: yMin + 1 }
	      ];
	      x = x - tagWidth / 2;
	      y = y + side;
	    } else if (direct === 'br') {
	      arrowPoints = [
	        { x: xMin, y: yMin - side },
	        { x: xMin, y: yMin + 1 },
	        { x: xMin + side + 1, y: yMin + 1 }
	      ];
	      radius[0] = 0;
	      y = y + side;
	    } else if (direct === 'cr') {
	      arrowPoints = [
	        { x: xMin - side, y: tagHeight / 2 + yMin },
	        { x: xMin + 1, y: (tagHeight - side) / 2 + yMin - 1 },
	        { x: xMin + 1, y: (tagHeight + side) / 2 + yMin + 1 }
	      ];
	      x = x + side;
	      y = y - tagHeight / 2;
	    } else if (direct === 'tr') {
	      arrowPoints = [
	        { x: xMin, y: tagHeight + side + yMin },
	        { x: xMin, y: tagHeight + yMin - 1 },
	        { x: side + xMin + 1, y: tagHeight + yMin - 1 }
	      ];
	      radius[3] = 0;

	      y = y - tagHeight - side;
	    } else if (direct === 'tc') {
	      arrowPoints = [
	        { x: (tagWidth - side) / 2 + xMin - 1, y: tagHeight + yMin - 1 },
	        { x: (tagWidth + side) / 2 + xMin + 1, y: tagHeight + yMin - 1 },
	        { x: tagWidth / 2 + xMin, y: tagHeight + side + yMin }
	      ];
	      x = x - tagWidth / 2;
	      y = y - tagHeight - side;
	    }

	    const sideShape = tagContainer.addShape('Polygon', {
	      className: 'guide-tag-side',
	      zIndex: 0,
	      attrs: {
	        points: arrowPoints,
	        fill: background.fill
	      }
	    });
	    shapes.push(sideShape);

	    tagBg.attr('radius', radius);
	    tagContainer.moveTo(x - xMin, y - yMin);
	    tagContainer.sort();

	    this.element = wrapperContainer;
	    return shapes;
	  }
	}

	base$6.Tag = Tag;

	class Point$2 extends base$6 {
	  _initDefaultCfg() {
	    this.type = 'point';
	    this.position = null;
	    this.offsetX = 0;
	    this.offsetY = 0;
	    this.style = {
	      fill: '#1890FF',
	      r: 3,
	      lineWidth: 1,
	      stroke: '#fff'
	    };
	  }

	  render(coord, container) {
	    const position = this.parsePoint(coord, this.position);

	    if (!position) return null;

	    const shape = container.addShape('Circle', {
	      className: 'guide-point',
	      attrs: common.mix({
	        x: position.x + this.offsetX,
	        y: position.y + this.offsetY
	      }, this.style)
	    });
	    this.element = shape;
	    return shape;
	  }
	}

	base$6.Point = Point$2;

	/**
	 * marker shapes，used for tooltip and legend
	 */

	const { Shape: Shape$5 } = graphic;

	const SYMBOLS = {
	  circle(x, y, r, ctx) {
	    ctx.arc(x, y, r, 0, Math.PI * 2, false);
	  },
	  square(x, y, r, ctx) {
	    ctx.moveTo(x - r, y - r);
	    ctx.lineTo(x + r, y - r);
	    ctx.lineTo(x + r, y + r);
	    ctx.lineTo(x - r, y + r);
	    ctx.closePath();
	  }
	};

	class Marker extends Shape$5 {
	  _initProperties() {
	    super._initProperties();
	    this._attrs.canFill = true;
	    this._attrs.canStroke = true;
	    this._attrs.type = 'marker';
	  }

	  getDefaultAttrs() {
	    return {
	      x: 0,
	      y: 0,
	      lineWidth: 0
	    };
	  }

	  createPath(context) {
	    const attrs = this.get('attrs');
	    const { x, y, radius } = attrs;
	    const symbol = attrs.symbol || 'circle';
	    let method;
	    if (common.isFunction(symbol)) {
	      method = symbol;
	    } else {
	      method = SYMBOLS[symbol];
	    }
	    context.beginPath();
	    method(x, y, radius, context, this);
	  }

	  calculateBox() {
	    const attrs = this.get('attrs');
	    const { x, y, radius } = attrs;
	    return {
	      minX: x - radius,
	      minY: y - radius,
	      maxX: x + radius,
	      maxY: y + radius
	    };
	  }
	}

	var marker = Marker;

	const { Group: Group$1 } = graphic;

	const MARKER_RADIUS = 3;

	class List {
	  getDefaultCfg() {
	    return {
	      showTitle: false,
	      /**
	       * title string
	       * @type {?String}
	       */
	      title: null,
	      /**
	       * items array
	       * @type {?Array}
	       */
	      items: null,
	      /**
	       * offset between title and items
	       * @type {Number}
	       */
	      titleGap: 12,
	      /**
	       * offset between each item
	       * @type {Number}
	       */
	      itemGap: 10,
	      /**
	       * the offset between each item in vertical direaction
	       * @type {Number}
	       */
	      itemMarginBottom: 12,
	      /**
	       * the formatter for item text
	       * @type {[type]}
	       */
	      itemFormatter: null,
	      itemWidth: null,
	      /**
	       * offset between marker and text
	       * @type {Number}
	       */
	      wordSpace: 6,
	      x: 0,
	      y: 0,
	      layout: 'horizontal',
	      /**
	       * the join string of `name` and `value`
	       * @type {String}
	       */
	      joinString: ': '
	    };
	  }

	  constructor(cfg) {
	    common.deepMix(this, this.getDefaultCfg(), cfg);
	    this._init();
	    this._renderTitle();
	    this._renderItems();
	  }

	  _init() {
	    const container = new Group$1({
	      zIndex: this.zIndex || 0
	    });
	    this.container = container;
	    const wrapper = container.addGroup();
	    this.wrapper = wrapper;
	    const itemsGroup = wrapper.addGroup({
	      className: 'itemsGroup'
	    });
	    this.itemsGroup = itemsGroup;

	    if (this.parent) {
	      this.parent.add(container);
	    }
	  }

	  _renderTitle(title) {
	    title = title || this.title;
	    let titleShape = this.titleShape;
	    let titleHeight = 0;

	    if (this.showTitle && title) {
	      if (titleShape && !titleShape.get('destroyed')) {
	        titleShape.attr('text', title);
	      } else {
	        const { wrapper, titleStyle } = this;
	        titleShape = wrapper.addShape('text', {
	          className: 'title',
	          attrs: common.mix({
	            x: 0,
	            y: 0,
	            text: title
	          }, titleStyle)
	        });
	        this.titleShape = titleShape;
	      }
	      titleHeight = titleShape.getBBox().height + this.titleGap;
	    }
	    this._titleHeight = titleHeight;
	  }

	  _renderItems(items) {
	    const self = this;
	    items = items || self.items;

	    if (!items) {
	      return;
	    }

	    if (self.reversed) {
	      items.reverse();
	    }
	    common.each(items, (item, index) => {
	      self._addItem(item, index);
	    });
	    if (items.length > 1) {
	      this._adjustItems();
	    }
	    this._renderBackground();
	  }

	  _renderBackground() {
	    const background = this.background;
	    if (background) {
	      const container = this.container;
	      const wrapper = this.wrapper;
	      const { minX, minY, width, height } = wrapper.getBBox();
	      let padding = background.padding || [ 0, 0, 0, 0 ];
	      padding = common.parsePadding(padding);
	      const attrs = common.mix({
	        x: minX - padding[3],
	        y: minY - padding[0],
	        width: width + padding[1] + padding[3],
	        height: height + padding[0] + padding[2]
	      }, background);
	      let backShape = this.backShape;
	      if (backShape) {
	        backShape.attr(attrs);
	      } else {
	        backShape = container.addShape('Rect', {
	          zIndex: -1,
	          attrs
	        });
	      }
	      this.backShape = backShape;
	      container.sort();
	    }
	  }

	  _addItem(item) {
	    const itemsGroup = this.itemsGroup;
	    const itemGroup = itemsGroup.addGroup({
	      name: item.name,
	      value: item.value,
	      dataValue: item.dataValue,
	      checked: item.checked
	    });
	    const { unCheckStyle, unCheckColor, nameStyle, valueStyle, wordSpace } = this;
	    const { marker: marker$1, value } = item;
	    let startX = 0;

	    if (unCheckColor) {
	      unCheckStyle.fill = unCheckColor;
	    }

	    if (marker$1) {
	      const radius = marker$1.radius || MARKER_RADIUS;
	      const markerAttrs = common.mix({
	        x: radius,
	        y: this._titleHeight
	      }, marker$1);

	      if (item.checked === false) {
	        common.mix(markerAttrs, unCheckStyle);
	      }

	      const markerShape = new marker({
	        className: 'item-marker',
	        attrs: markerAttrs
	      });
	      itemGroup.add(markerShape);
	      startX += markerShape.getBBox().width + wordSpace;
	    }

	    let nameText;
	    let name = item.name;
	    if (name) {
	      const joinString = this.joinString || '';
	      name = value ? name + joinString : name;
	      nameText = itemGroup.addShape('text', {
	        className: 'name',
	        attrs: common.mix({
	          x: startX,
	          y: this._titleHeight,
	          text: this._formatItemValue(name)
	        }, nameStyle, item.checked === false ? unCheckStyle : null)
	      });
	    }

	    if (value) {
	      let valueX = startX;
	      if (nameText) {
	        valueX += nameText.getBBox().width;
	      }

	      itemGroup.addShape('text', {
	        className: 'value',
	        attrs: common.mix({
	          x: valueX,
	          y: this._titleHeight,
	          text: value
	        }, valueStyle, item.checked === false ? unCheckStyle : null)
	      });
	    }
	    return itemGroup;
	  }

	  _formatItemValue(value) {
	    const formatter = this.itemFormatter;
	    if (formatter) {
	      value = formatter.call(this, value);
	    }
	    return value;
	  }

	  _getMaxItemWidth() {
	    let width;
	    const itemWidth = this.itemWidth;

	    if (common.isNumber(itemWidth) || common.isNil(itemWidth)) {
	      return itemWidth;
	    }

	    if (itemWidth === 'auto') {
	      const itemsGroup = this.itemsGroup;
	      const children = itemsGroup.get('children');
	      const count = children.length;
	      let maxItemWidth = 0;
	      for (let i = 0; i < count; i++) {
	        const { width } = children[i].getBBox();
	        maxItemWidth = Math.max(maxItemWidth, width);
	      }
	      const maxLength = this.maxLength;
	      const itemGap = this.itemGap;
	      const twoAvgWidth = (maxLength - itemGap) / 2;
	      const threeAvgWidth = (maxLength - itemGap * 2) / 3;

	      if (count === 2) {
	        width = Math.max(maxItemWidth, twoAvgWidth);
	      } else {
	        // 1. max <= 3Avg, 3Avg
	        // 2. 3Avg < max && max < 2avg, 2avg
	        // 3. max > 2avg, max, one column
	        if (maxItemWidth <= threeAvgWidth) {
	          width = threeAvgWidth;
	        } else if (maxItemWidth <= twoAvgWidth) {
	          width = twoAvgWidth;
	        } else {
	          width = maxItemWidth;
	        }
	      }
	      return width;
	    }
	  }

	  _adjustHorizontal() {
	    const { maxLength, itemsGroup } = this;

	    const children = itemsGroup.get('children');
	    const { itemGap, itemMarginBottom } = this;
	    const titleHeight = this._titleHeight;

	    let row = 0;
	    let rowWidth = 0;
	    let width;
	    let height;
	    const itemWidth = this._getMaxItemWidth();
	    const legendHitBoxes = [];
	    for (let i = 0, len = children.length; i < len; i++) {
	      const child = children[i];
	      const box = child.getBBox();
	      const childHeight = box.height;
	      const childWidth = box.width;
	      width = itemWidth || childWidth;
	      height = childHeight + itemMarginBottom;

	      if (width - (maxLength - rowWidth) > 0.0001) {
	        row++;
	        rowWidth = 0;
	      }

	      child.moveTo(rowWidth, row * height);
	      legendHitBoxes.push({
	        x: rowWidth,
	        y: row * height + titleHeight - childHeight / 2,
	        width: childWidth * 1.375,
	        height: childHeight * 1.375
	      });
	      rowWidth += width + itemGap;
	    }
	    this.legendHitBoxes = legendHitBoxes;
	    return;
	  }

	  _adjustVertical() {
	    const { maxLength, itemsGroup } = this;
	    const { itemGap, itemMarginBottom, itemWidth } = this;
	    const titleHeight = this._titleHeight;
	    const children = itemsGroup.get('children');

	    let colHeight = 0;
	    let width;
	    let height;
	    let maxItemWidth = 0;
	    let totalWidth = 0;
	    const legendHitBoxes = [];

	    for (let i = 0, length = children.length; i < length; i++) {
	      const child = children[i];
	      const bbox = child.getBBox();
	      width = bbox.width;
	      height = bbox.height;

	      if (common.isNumber(itemWidth)) {
	        maxItemWidth = itemWidth + itemGap;
	      } else if (width > maxItemWidth) {
	        maxItemWidth = width + itemGap;
	      }

	      if (maxLength - colHeight < height) {
	        colHeight = 0;
	        totalWidth += maxItemWidth;
	        child.moveTo(totalWidth, 0);
	        legendHitBoxes.push({
	          x: totalWidth,
	          y: titleHeight - height / 2,
	          width: width * 1.375,
	          height: height * 1.375
	        });
	      } else {
	        child.moveTo(totalWidth, colHeight);
	        legendHitBoxes.push({
	          x: totalWidth,
	          y: colHeight - height / 2 + titleHeight,
	          width: width * 1.375,
	          height: height * 1.375
	        });
	      }

	      colHeight += height + itemMarginBottom;
	    }
	    this.legendHitBoxes = legendHitBoxes;
	    return;
	  }

	  _adjustItems() {
	    const layout = this.layout;
	    if (layout === 'horizontal') {
	      this._adjustHorizontal();
	    } else {
	      this._adjustVertical();
	    }
	  }

	  moveTo(x, y) {
	    this.x = x;
	    this.y = y;
	    const container = this.container;
	    container && container.moveTo(x, y);
	    return this;
	  }

	  setItems(items) {
	    this.clearItems();
	    this._renderItems(items);
	  }

	  setTitle(title) {
	    this._renderTitle(title);
	  }

	  clearItems() {
	    const itemsGroup = this.itemsGroup;
	    itemsGroup.clear();
	  }

	  getWidth() {
	    const container = this.container;
	    const bbox = container.getBBox();
	    return bbox.width;
	  }

	  getHeight() {
	    const container = this.container;
	    const bbox = container.getBBox();
	    return bbox.height;
	  }

	  show() {
	    const container = this.container;
	    container.show();
	  }

	  hide() {
	    const container = this.container;
	    container.hide();
	  }

	  clear() {
	    const container = this.container;
	    container.clear();
	    container.remove(true);
	  }
	}

	var list = List;

	const { Group: Group$2 } = graphic;

	class TextBox {
	  getDefaultCfg() {
	    return {
	      x: 0,
	      y: 0,
	      content: '',
	      textStyle: {
	        fontSize: 12,
	        fill: '#fff',
	        textAlign: 'center',
	        textBaseline: 'middle'
	      },
	      background: {
	        radius: 1,
	        fill: 'rgba(0, 0, 0, 0.65)',
	        padding: [ 3, 5 ]
	      },
	      width: 0,
	      height: 0,
	      className: ''
	    };
	  }

	  constructor(cfg) {
	    common.deepMix(this, this.getDefaultCfg(), cfg);
	    this._init();
	    const { content, x, y } = this;

	    if (!common.isNil(content)) {
	      this.updateContent(content);
	    }

	    this.updatePosition(x, y);
	  }

	  _init() {
	    const { content, textStyle, background, className, visible } = this;
	    const container = new Group$2({
	      className,
	      zIndex: 0,
	      visible
	    });
	    const text = container.addShape('Text', {
	      className: className + '-text',
	      zIndex: 1,
	      attrs: common.mix({
	        text: content,
	        x: 0,
	        y: 0
	      }, textStyle)
	    });
	    const backgroundShape = container.addShape('Rect', {
	      className: className + '-bg',
	      zIndex: -1,
	      attrs: common.mix({
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      }, background)
	    });
	    container.sort();
	    this.container = container;
	    this.textShape = text;
	    this.backgroundShape = backgroundShape;
	  }

	  _getBBox() {
	    const textShape = this.textShape;
	    const background = this.background;
	    const textBBox = textShape.getBBox();
	    const padding = common.parsePadding(background.padding);
	    const width = textBBox.width + padding[1] + padding[3];
	    const height = textBBox.height + padding[0] + padding[2];
	    const x = textBBox.minX - padding[3];
	    const y = textBBox.minY - padding[0];
	    return {
	      x,
	      y,
	      width,
	      height
	    };
	  }

	  updateContent(text) {
	    const { textShape, backgroundShape } = this;
	    if (!common.isNil(text)) {
	      if (!common.isObject(text)) {
	        text = { text };
	      }
	      textShape.attr(text);
	      // update box shape
	      const { x, y, width: tipWidth, height: tipHeight } = this._getBBox();
	      const width = this.width || tipWidth;
	      const height = this.height || tipHeight;
	      backgroundShape.attr({
	        x,
	        y,
	        width,
	        height
	      });
	      this._width = width;
	      this._height = height;
	      this.content = text.text;
	    }
	  }

	  updatePosition(x, y) {
	    const container = this.container;
	    const { x: xMin, y: yMin } = this._getBBox();
	    container.moveTo(x - xMin, y - yMin);
	    this.x = x - xMin;
	    this.y = y - yMin;
	  }

	  getWidth() {
	    return this._width;
	  }

	  getHeight() {
	    return this._height;
	  }

	  show() {
	    this.container.show();
	  }

	  hide() {
	    this.container.hide();
	  }

	  clear() {
	    const container = this.container;
	    container.clear();
	    container.remove(true);
	    this.container = null;
	    this.textShape = null;
	    this.backgroundShape = null;
	  }
	}

	var textBox = TextBox;

	const GAP = 4;

	/**
	 * TODOList：
	 * 1. 移除 fixed 参数
	 */
	class Tooltip {
	  getDefaultCfg() {
	    return {
	      /**
	       * wether show the crosshairs
	       * @type {Object}
	       */
	      showCrosshairs: false,
	      /**
	       * the style for crosshairs
	       * @type {Object}
	       */
	      crosshairsStyle: {
	        stroke: 'rgba(0, 0, 0, 0.25)',
	        lineWidth: 1
	      },
	      /**
	       * the type of crosshairs, optional value is 'x', 'y' or 'xy', default is 'y'
	       */
	      crosshairsType: 'y',
	      /**
	       * show or hide the x axis tip
	       */
	      showXTip: false,
	      /**
	       * show or hide the y axis tip
	       */
	      showYTip: false,
	      xTip: null,
	      xTipBackground: {
	        radius: 1,
	        fill: 'rgba(0, 0, 0, 0.65)',
	        padding: [ 3, 5 ]
	      },
	      yTip: null,
	      yTipBackground: {
	        radius: 1,
	        fill: 'rgba(0, 0, 0, 0.65)',
	        padding: [ 3, 5 ]
	      },
	      /**
	       * the style for tooltip container's background
	       * @type {Object}
	       */
	      background: null,
	      /**
	       * layout, can be horizontal or vertical
	       * @type {String}
	       */
	      layout: 'horizontal',
	      offsetX: 0,
	      offsetY: 0
	    };
	  }

	  constructor(cfg) {
	    common.deepMix(this, this.getDefaultCfg(), cfg);
	    const { frontPlot, custom } = this;

	    if (!custom) { // custom means user do customize
	      const container = new list(common.mix({
	        parent: frontPlot,
	        zIndex: 3
	      }, cfg));
	      this.container = container;
	      const { fixed, background } = this;
	      if (!fixed) {
	        this.tooltipArrow = frontPlot.addShape('Polygon', {
	          className: 'tooltip-arrow',
	          visible: false,
	          zIndex: 2,
	          attrs: common.mix({
	            points: []
	          }, background)
	        });
	      }
	    }
	    if (this.showXTip) {
	      const { xTipBackground } = this;
	      const xTipBox = new textBox({
	        className: 'xTip',
	        background: xTipBackground,
	        visible: false
	      });
	      frontPlot.add(xTipBox.container);
	      this.xTipBox = xTipBox;
	    }

	    if (this.showYTip) {
	      const { yTipBackground } = this;
	      const yTipBox = new textBox({
	        className: 'yTip',
	        background: yTipBackground,
	        visible: false
	      });
	      frontPlot.add(yTipBox.container);
	      this.yTipBox = yTipBox;
	    }

	    if (this.showCrosshairs) {
	      this._renderCrosshairs();
	    }

	    frontPlot.sort();
	  }

	  setContent(title, items) {
	    this.title = title;
	    this.items = items;
	    if (!this.custom) {
	      const container = this.container;
	      container.setTitle(title);
	      container.setItems(items);
	    }
	  }

	  setYTipContent(val) {
	    const yTip = this.yTip;
	    if (common.isFunction(yTip)) {
	      val = yTip(val);
	    } else {
	      val = common.mix({
	        text: val
	      }, yTip);
	    }
	    this.yTipBox && this.yTipBox.updateContent(val);
	  }

	  setYTipPosition(pos) {
	    const plotRange = this.plotRange;
	    const crosshairsShapeX = this.crosshairsShapeX;
	    if (this.showYTip) {
	      const yTipBox = this.yTipBox;
	      const yTipHeight = yTipBox.getHeight();
	      const yTipWidth = yTipBox.getWidth();
	      let posX = plotRange.tl.x - yTipWidth;
	      let posY = pos - (yTipHeight / 2);
	      if (posY <= plotRange.tl.y) {
	        posY = plotRange.tl.y;
	      }
	      if (posY + yTipHeight >= plotRange.br.y) {
	        posY = plotRange.br.y - yTipHeight;
	      }

	      if (posX < 0) {
	        posX = plotRange.tl.x;
	        crosshairsShapeX && crosshairsShapeX.attr('x1', plotRange.tl.x + yTipWidth);
	      }


	      yTipBox.updatePosition(posX, posY);
	    }
	  }

	  setXTipContent(val) {
	    const xTip = this.xTip;
	    if (common.isFunction(xTip)) {
	      val = xTip(val);
	    } else {
	      val = common.mix({
	        text: val
	      }, xTip);
	    }
	    this.xTipBox && this.xTipBox.updateContent(val);
	  }

	  setXTipPosition(pos) {
	    const { showXTip, canvas, plotRange, xTipBox, crosshairsShapeY } = this;
	    if (showXTip) {
	      // const el = canvas.get('el');
	      // const canvasHeight = Util.getHeight(el);
	      const canvasHeight = canvas.get('height');
	      const xTipWidth = xTipBox.getWidth();
	      const xTipHeight = xTipBox.getHeight();
	      let posX = pos - (xTipWidth / 2);
	      let posY = plotRange.br.y;
	      if (posX <= plotRange.tl.x) {
	        posX = plotRange.tl.x;
	      }
	      if (posX + xTipWidth >= plotRange.tr.x) {
	        posX = plotRange.tr.x - xTipWidth;
	      }

	      if (canvasHeight - posY < xTipHeight) {
	        posY -= xTipHeight;
	      }
	      xTipBox.updatePosition(posX, posY);
	      crosshairsShapeY && crosshairsShapeY.attr('y1', posY);
	    }
	  }

	  setXCrosshairPosition(pos) {
	    this.crosshairsShapeX && this.crosshairsShapeX.moveTo(0, pos);
	  }

	  setYCrosshairPosition(pos) {
	    this.crosshairsShapeY && this.crosshairsShapeY.moveTo(pos, 0);
	  }

	  setPosition(items) {
	    const { container, plotRange, offsetX, offsetY, fixed, tooltipArrow } = this;
	    if (!container) {
	      return;
	    }

	    const containerBBox = container.container.getBBox();
	    const { minX, minY, width, height } = containerBBox;

	    const { tl, tr } = plotRange;
	    let posX = 0;
	    const posY = tl.y - height - GAP + offsetY;

	    if (fixed) {
	      const x = (tl.x + tr.x) / 2;
	      posX = x - width / 2 + offsetX;
	    } else {
	      let x;
	      if (items.length > 1) {
	        x = (items[0].x + items[items.length - 1].x) / 2;
	      } else {
	        x = items[0].x;
	      }
	      posX = x - (width / 2) + offsetX;
	      if (posX < tl.x) {
	        posX = tl.x;
	      }
	      if (posX + width > tr.x) {
	        posX = tr.x - width;
	      }

	      if (tooltipArrow) {
	        tooltipArrow.attr('points', [
	          { x: x - 3, y: tl.y - GAP + offsetY },
	          { x: x + 3, y: tl.y - GAP + offsetY },
	          { x, y: tl.y + offsetY }
	        ]);
	        const backShape = container.backShape;
	        const radius = common.parsePadding(backShape.attr('radius'));
	        if (x === tl.x) {
	          radius[3] = 0;

	          tooltipArrow.attr('points', [
	            { x: tl.x, y: tl.y + offsetY },
	            { x: tl.x, y: tl.y - GAP + offsetY },
	            { x: tl.x + GAP, y: tl.y - GAP + offsetY }
	          ]);
	        } else if (x === tr.x) {
	          radius[2] = 0;

	          tooltipArrow.attr('points', [
	            { x: tr.x, y: tl.y + offsetY },
	            { x: tr.x - GAP, y: tl.y - GAP + offsetY },
	            { x: tr.x, y: tl.y - GAP + offsetY }
	          ]);
	        }
	        backShape.attr('radius', radius);
	      }
	    }

	    container.moveTo(posX - minX, posY - minY);
	  }

	  setMarkers(cfg = {}) {
	    const self = this;
	    const { items, style, type } = cfg;
	    const markerGroup = self._getMarkerGroup(type);
	    if (type === 'circle') {
	      for (let i = 0, length = items.length; i < length; i++) {
	        const item = items[i];
	        const marker$1 = new marker({
	          className: 'tooltip-circle-marker',
	          attrs: common.mix({
	            x: item.x,
	            y: item.y,
	            stroke: item.color
	          }, style)
	        });
	        markerGroup.add(marker$1);
	      }
	    } else {
	      markerGroup.addShape('rect', {
	        className: 'tooltip-rect-marker',
	        attrs: style
	      });
	    }
	  }

	  clearMarkers() {
	    const markerGroup = this.markerGroup;
	    markerGroup && markerGroup.clear();
	  }

	  show() {
	    const crosshairsShapeX = this.crosshairsShapeX;
	    const crosshairsShapeY = this.crosshairsShapeY;
	    const markerGroup = this.markerGroup;
	    const container = this.container;
	    const tooltipArrow = this.tooltipArrow;
	    const xTipBox = this.xTipBox;
	    const yTipBox = this.yTipBox;
	    const canvas = this.canvas;
	    crosshairsShapeX && crosshairsShapeX.show();
	    crosshairsShapeY && crosshairsShapeY.show();
	    markerGroup && markerGroup.show();
	    container && container.show();
	    tooltipArrow && tooltipArrow.show();
	    xTipBox && xTipBox.show();
	    yTipBox && yTipBox.show();
	    canvas.draw();
	  }

	  hide() {
	    const crosshairsShapeX = this.crosshairsShapeX;
	    const crosshairsShapeY = this.crosshairsShapeY;
	    const markerGroup = this.markerGroup;
	    const container = this.container;
	    const tooltipArrow = this.tooltipArrow;
	    const xTipBox = this.xTipBox;
	    const yTipBox = this.yTipBox;
	    crosshairsShapeX && crosshairsShapeX.hide();
	    crosshairsShapeY && crosshairsShapeY.hide();
	    markerGroup && markerGroup.hide();
	    container && container.hide();
	    tooltipArrow && tooltipArrow.hide();
	    xTipBox && xTipBox.hide();
	    yTipBox && yTipBox.hide();
	  }

	  destroy() {
	    const crosshairsShapeX = this.crosshairsShapeX;
	    const crosshairsShapeY = this.crosshairsShapeY;
	    const markerGroup = this.markerGroup;
	    const container = this.container;
	    const tooltipArrow = this.tooltipArrow;
	    const xTipBox = this.xTipBox;
	    const yTipBox = this.yTipBox;

	    crosshairsShapeX && crosshairsShapeX.remove(true);
	    crosshairsShapeY && crosshairsShapeY.remove(true);
	    markerGroup && markerGroup.remove(true);
	    tooltipArrow && tooltipArrow.remove(true);
	    container && container.clear();
	    xTipBox && xTipBox.clear();
	    yTipBox && yTipBox.clear();

	    this.destroyed = true;
	  }

	  _getMarkerGroup(type) {
	    let markerGroup = this.markerGroup;
	    if (!markerGroup) {
	      if (type === 'circle') {
	        markerGroup = this.frontPlot.addGroup({
	          zIndex: 1
	        });
	        this.frontPlot.sort();
	      } else {
	        markerGroup = this.backPlot.addGroup();
	      }
	      this.markerGroup = markerGroup;
	    } else {
	      markerGroup.clear();
	    }

	    return markerGroup;
	  }

	  _renderCrosshairs() {
	    const { crosshairsType, crosshairsStyle, frontPlot, plotRange } = this;
	    const { tl, br } = plotRange;
	    if (common.directionEnabled(crosshairsType, 'x')) {
	      this.crosshairsShapeX = frontPlot.addShape('Line', {
	        className: 'tooltip-crosshairs-x',
	        zIndex: 0,
	        visible: false,
	        attrs: common.mix({
	          x1: tl.x,
	          y1: 0,
	          x2: br.x,
	          y2: 0
	        }, crosshairsStyle)
	      });
	    }

	    if (common.directionEnabled(crosshairsType, 'y')) {
	      this.crosshairsShapeY = frontPlot.addShape('Line', {
	        className: 'tooltip-crosshairs-y',
	        zIndex: 0,
	        visible: false,
	        attrs: common.mix({
	          x1: 0,
	          y1: br.y,
	          x2: 0,
	          y2: tl.y
	        }, crosshairsStyle)
	      });
	    }

	  }
	}

	var tooltip = Tooltip;

	// Register the default configuration for Tooltip
	global$1.tooltip = common.deepMix({
	  triggerOn: [ 'touchstart', 'touchmove' ],
	  // triggerOff: 'touchend',
	  alwaysShow: false,
	  showTitle: false,
	  showCrosshairs: false,
	  crosshairsStyle: {
	    stroke: 'rgba(0, 0, 0, 0.25)',
	    lineWidth: 1
	  },
	  showTooltipMarker: true,
	  background: {
	    radius: 1,
	    fill: 'rgba(0, 0, 0, 0.65)',
	    padding: [ 3, 5 ]
	  },
	  titleStyle: {
	    fontSize: 12,
	    fill: '#fff',
	    textAlign: 'start',
	    textBaseline: 'top'
	  },
	  nameStyle: {
	    fontSize: 12,
	    fill: 'rgba(255, 255, 255, 0.65)',
	    textAlign: 'start',
	    textBaseline: 'middle'
	  },
	  valueStyle: {
	    fontSize: 12,
	    fill: '#fff',
	    textAlign: 'start',
	    textBaseline: 'middle'
	  },
	  showItemMarker: true,
	  itemMarkerStyle: {
	    radius: 3,
	    symbol: 'circle',
	    lineWidth: 1,
	    stroke: '#fff'
	  },
	  layout: 'horizontal',
	  snap: false
	}, global$1.tooltip || {});

	function _getTooltipValueScale(geom) {
	  const colorAttr = geom.getAttr('color');
	  if (colorAttr) {
	    const colorScale = colorAttr.getScale(colorAttr.type);
	    if (colorScale.isLinear) {
	      return colorScale;
	    }
	  }
	  const xScale = geom.getXScale();
	  const yScale = geom.getYScale();
	  if (yScale) {
	    return yScale;
	  }

	  return xScale;
	}

	function getTooltipName(geom, origin) {
	  let name;
	  let nameScale;
	  const groupScales = geom._getGroupScales();
	  if (groupScales.length) {
	    common.each(groupScales, function(scale) {
	      nameScale = scale;
	      return false;
	    });
	  }
	  if (nameScale) {
	    const field = nameScale.field;
	    name = nameScale.getText(origin[field]);
	  } else {
	    const valueScale = _getTooltipValueScale(geom);
	    name = valueScale.alias || valueScale.field;
	  }
	  return name;
	}

	function getTooltipValue(geom, origin) {
	  const scale = _getTooltipValueScale(geom);
	  return scale.getText(origin[scale.field]);
	}

	function getTooltipTitle(geom, origin) {
	  const position = geom.getAttr('position');
	  const field = position.getFields()[0];
	  const scale = geom.get('scales')[field];
	  return scale.getText(origin[scale.field]);
	}

	function _indexOfArray(items, item) {
	  let rst = -1;
	  common.each(items, function(sub, index) {
	    if (sub.title === item.title && sub.name === item.name && sub.value === item.value && sub.color === item.color) {
	      rst = index;
	      return false;
	    }
	  });
	  return rst;
	}

	function _uniqItems(items) {
	  const tmp = [];
	  common.each(items, function(item) {
	    const index = _indexOfArray(tmp, item);
	    if (index === -1) {
	      tmp.push(item);
	    } else {
	      tmp[index] = item;
	    }
	  });
	  return tmp;
	}

	function isEqual(arr1, arr2) {
	  return JSON.stringify(arr1) === JSON.stringify(arr2);
	}

	class TooltipController {
	  constructor(cfg) {
	    this.enable = true;
	    this.cfg = {};
	    this.tooltip = null;
	    this.chart = null;
	    this.timeStamp = 0;
	    common.mix(this, cfg);
	    const chart = this.chart;
	    this.canvasDom = chart.get('canvas').get('el');
	  }

	  _setCrosshairsCfg() {
	    const self = this;
	    const chart = self.chart;
	    const defaultCfg = common.mix({}, global$1.tooltip);
	    const geoms = chart.get('geoms');
	    const shapes = [];
	    common.each(geoms, geom => {
	      const type = geom.get('type');
	      if (shapes.indexOf(type) === -1) {
	        shapes.push(type);
	      }
	    });
	    const coordType = chart.get('coord').type;
	    if (geoms.length && (coordType === 'cartesian' || coordType === 'rect')) {
	      if (shapes.length === 1 && [ 'line', 'area', 'path', 'point' ].indexOf(shapes[0]) !== -1) {
	        common.mix(defaultCfg, {
	          showCrosshairs: true
	        });
	      }
	    }

	    return defaultCfg;
	  }

	  _getMaxLength(cfg = {}) {
	    const { layout, plotRange } = cfg;
	    return (layout === 'horizontal') ? plotRange.br.x - plotRange.bl.x : plotRange.bl.y - plotRange.tr.y;
	  }

	  render() {
	    const self = this;

	    if (self.tooltip) {
	      return;
	    }

	    const chart = self.chart;
	    const canvas = chart.get('canvas');
	    const frontPlot = chart.get('frontPlot').addGroup({
	      className: 'tooltipContainer',
	      zIndex: 10
	    });
	    const backPlot = chart.get('backPlot').addGroup({
	      className: 'tooltipContainer'
	    });
	    const plotRange = chart.get('plotRange');
	    const coord = chart.get('coord');

	    const defaultCfg = self._setCrosshairsCfg();
	    const cfg = self.cfg; // 通过 chart.tooltip() 接口传入的 tooltip 配置项
	    const tooltipCfg = common.deepMix({
	      plotRange,
	      frontPlot,
	      backPlot,
	      canvas,
	      fixed: coord.transposed || coord.isPolar
	    }, defaultCfg, cfg); // 创建 tooltip 实例需要的配置，不应该修改 this.cfg，即用户传入的配置
	    tooltipCfg.maxLength = self._getMaxLength(tooltipCfg);
	    this._tooltipCfg = tooltipCfg;
	    const tooltip$1 = new tooltip(tooltipCfg);
	    self.tooltip = tooltip$1;
	    self.bindEvents();
	  }

	  clear() {
	    const tooltip = this.tooltip;
	    if (tooltip) {
	      tooltip.destroy();
	      this.unBindEvents();
	    }
	    this.tooltip = null;
	    this.prePoint = null;
	    this._lastActive = null;
	  }

	  _getTooltipMarkerStyle(cfg = {}) {
	    const { type, items } = cfg;
	    const tooltipCfg = this._tooltipCfg;
	    if (type === 'rect') {
	      let x;
	      let y;
	      let width;
	      let height;
	      const chart = this.chart;
	      const { tl, br } = chart.get('plotRange');
	      const coord = chart.get('coord');
	      const firstItem = items[0];
	      const lastItem = items[items.length - 1];
	      const intervalWidth = firstItem.width;
	      if (coord.transposed) {
	        x = tl.x;
	        y = lastItem.y - intervalWidth * 0.75;
	        width = br.x - tl.x;
	        height = firstItem.y - lastItem.y + 1.5 * intervalWidth;
	      } else {
	        x = firstItem.x - intervalWidth * 0.75;
	        y = tl.y;
	        width = lastItem.x - firstItem.x + 1.5 * intervalWidth;
	        height = br.y - tl.y;
	      }

	      cfg.style = common.mix({
	        x,
	        y,
	        width,
	        height,
	        fill: '#CCD6EC',
	        opacity: 0.3
	      }, tooltipCfg.tooltipMarkerStyle);
	    } else {
	      cfg.style = common.mix({
	        radius: 4,
	        fill: '#fff',
	        lineWidth: 2
	      }, tooltipCfg.tooltipMarkerStyle);
	    }

	    return cfg;
	  }

	  _setTooltip(point, items, tooltipMarkerCfg = {}) {
	    const lastActive = this._lastActive;
	    const tooltip = this.tooltip;
	    const cfg = this._tooltipCfg;
	    items = _uniqItems(items);

	    const chart = this.chart;
	    const coord = chart.get('coord');
	    const yScale = chart.getYScales()[0];
	    const snap = cfg.snap;

	    if (snap === false && yScale.isLinear) {
	      const invertPoint = coord.invertPoint(point);
	      const plot = chart.get('plotRange');

	      let tip;
	      let pos;
	      if (helper.isPointInPlot(point, plot)) {
	        if (coord.transposed) {
	          tip = yScale.invert(invertPoint.x);
	          pos = point.x;
	          tooltip.setXTipContent(tip);
	          tooltip.setXTipPosition(pos);
	          tooltip.setYCrosshairPosition(pos);
	        } else {
	          tip = yScale.invert(invertPoint.y);
	          pos = point.y;
	          tooltip.setYTipContent(tip);
	          tooltip.setYTipPosition(pos);
	          tooltip.setXCrosshairPosition(pos);
	        }
	      }
	    }


	    if (cfg.onShow) {
	      cfg.onShow({
	        x: point.x,
	        y: point.y,
	        tooltip,
	        items,
	        tooltipMarkerCfg
	      });
	    }
	    if (isEqual(lastActive, items)) {
	      if (snap === false && (common.directionEnabled(cfg.crosshairsType, 'y') || cfg.showYTip)) {
	        const canvas = this.chart.get('canvas');
	        canvas.draw();
	      }
	      return;
	    }
	    this._lastActive = items;

	    const onChange = cfg.onChange;
	    if (onChange) {
	      onChange({
	        x: point.x,
	        y: point.y,
	        tooltip,
	        items,
	        tooltipMarkerCfg
	      });
	    }

	    const first = items[0];
	    const title = first.title || first.name;
	    let xTipPosX = first.x;
	    if (items.length > 1) {
	      xTipPosX = (items[0].x + items[items.length - 1].x) / 2;
	    }
	    tooltip.setContent(title, items, coord.transposed);
	    tooltip.setPosition(items, point);

	    if (coord.transposed) {
	      let yTipPosY = first.y;
	      if (items.length > 1) {
	        yTipPosY = (items[0].y + items[items.length - 1].y) / 2;
	      }
	      tooltip.setYTipContent(title);
	      tooltip.setYTipPosition(yTipPosY);
	      tooltip.setXCrosshairPosition(yTipPosY);

	      if (snap) {
	        tooltip.setXTipContent(first.value);
	        tooltip.setXTipPosition(xTipPosX);
	        tooltip.setYCrosshairPosition(xTipPosX);
	      }

	    } else {
	      tooltip.setXTipContent(title);
	      tooltip.setXTipPosition(xTipPosX);
	      tooltip.setYCrosshairPosition(xTipPosX);

	      if (snap) {
	        tooltip.setYTipContent(first.value);
	        tooltip.setYTipPosition(first.y);
	        tooltip.setXCrosshairPosition(first.y);
	      }
	    }

	    const markerItems = tooltipMarkerCfg.items;
	    if (cfg.showTooltipMarker && markerItems.length) {
	      tooltipMarkerCfg = this._getTooltipMarkerStyle(tooltipMarkerCfg);
	      tooltip.setMarkers(tooltipMarkerCfg);
	    } else {
	      tooltip.clearMarkers();
	    }

	    tooltip.show();
	  }

	  showTooltip(point) {
	    const self = this;
	    const chart = self.chart;

	    let tooltipMarkerType;
	    const tooltipMarkerItems = [];
	    const items = [];
	    const cfg = self._tooltipCfg;
	    let marker;
	    if (cfg.showItemMarker) {
	      marker = cfg.itemMarkerStyle;
	    }

	    const geoms = chart.get('geoms');
	    const coord = chart.get('coord');
	    common.each(geoms, geom => {
	      if (geom.get('visible')) {
	        const type = geom.get('type');
	        const records = geom.getSnapRecords(point);
	        const adjust = geom.get('adjust');
	        // 漏斗图和金子塔图tooltip位置有问题，暂时不开放显示
	        if (type === 'interval' && adjust && adjust.type === 'symmetric') {
	          return;
	        }
	        common.each(records, record => {
	          if (record.x && record.y) {
	            const { x, y, _origin, color } = record;
	            const tooltipItem = {
	              x,
	              y: common.isArray(y) ? y[1] : y,
	              color: color || global$1.defaultColor,
	              origin: _origin,
	              name: getTooltipName(geom, _origin),
	              value: getTooltipValue(geom, _origin),
	              title: getTooltipTitle(geom, _origin)
	            };
	            if (marker) {
	              tooltipItem.marker = common.mix({
	                fill: color || global$1.defaultColor
	              }, marker);
	            }
	            items.push(tooltipItem);

	            if ([ 'line', 'area', 'path' ].indexOf(type) !== -1) {
	              tooltipMarkerType = 'circle';
	              tooltipMarkerItems.push(tooltipItem);
	            } else if (type === 'interval' && (coord.type === 'cartesian' || coord.type === 'rect')) {
	              tooltipMarkerType = 'rect';
	              tooltipItem.width = geom.getSize(record._origin);
	              tooltipMarkerItems.push(tooltipItem);
	            }
	          }
	        });
	      }
	    });

	    if (items.length) {
	      const tooltipMarkerCfg = {
	        items: tooltipMarkerItems,
	        type: tooltipMarkerType
	      };
	      self._setTooltip(point, items, tooltipMarkerCfg);
	    } else {
	      self.hideTooltip();
	    }
	  }

	  hideTooltip() {
	    const cfg = this._tooltipCfg;
	    this._lastActive = null;
	    const tooltip = this.tooltip;
	    if (tooltip) {
	      tooltip.hide();
	      if (cfg.onHide) {
	        cfg.onHide({
	          tooltip
	        });
	      }
	      const canvas = this.chart.get('canvas');
	      canvas.draw();
	    }
	  }

	  handleShowEvent(ev) {
	    const chart = this.chart;
	    if (!this.enable || chart.get('_closeTooltip')) return;

	    const plot = chart.get('plotRange');
	    const point = common.createEvent(ev, chart);
	    if (!helper.isPointInPlot(point, plot) && !this._tooltipCfg.alwaysShow) { // not in chart plot
	      this.hideTooltip();
	      return;
	    }

	    const lastTimeStamp = this.timeStamp;
	    const timeStamp = +new Date();
	    if ((timeStamp - lastTimeStamp) > 16) {
	      this.showTooltip(point);
	      this.timeStamp = timeStamp;
	    }
	  }

	  handleHideEvent() {
	    const chart = this.chart;
	    if (!this.enable || chart.get('_closeTooltip')) return;

	    this.hideTooltip();
	  }

	  _handleEvent(methodName, method, action) {
	    const canvasDom = this.canvasDom;
	    common.each([].concat(methodName), aMethod => {
	      if (action === 'bind') {
	        common.addEventListener(canvasDom, aMethod, method);
	      } else {
	        common.removeEventListener(canvasDom, aMethod, method);
	      }
	    });
	  }

	  bindEvents() {
	    const cfg = this._tooltipCfg;
	    const canvasElement = this.canvasDom;
	    const { triggerOn, triggerOff, alwaysShow } = cfg;
	    const showMethod = common.wrapBehavior(this, 'handleShowEvent');
	    const hideMethod = common.wrapBehavior(this, 'handleHideEvent');

	    triggerOn && this._handleEvent(triggerOn, showMethod, 'bind');
	    triggerOff && this._handleEvent(triggerOff, hideMethod, 'bind');
	    // 如果 !alwaysShow, 则在手势离开后就隐藏
	    if (!alwaysShow && !triggerOff) {
	      common.addEventListener(canvasElement, 'touchend', hideMethod);
	    }
	  }

	  unBindEvents() {
	    const cfg = this._tooltipCfg;
	    const canvasElement = this.canvasDom;
	    const { triggerOn, triggerOff, alwaysShow } = cfg;
	    const showMethod = common.getWrapBehavior(this, 'handleShowEvent');
	    const hideMethod = common.getWrapBehavior(this, 'handleHideEvent');

	    triggerOn && this._handleEvent(triggerOn, showMethod, 'unBind');
	    triggerOff && this._handleEvent(triggerOff, hideMethod, 'unBind');

	    if (!alwaysShow) {
	      const docMethod = common.getWrapBehavior(this, 'handleDocEvent');
	      common.removeEventListener(canvasElement, 'touchend', docMethod);
	    }
	  }
	}

	var tooltip$1 = {
	  init(chart) {
	    const tooltipController = new TooltipController({
	      chart
	    });
	    chart.set('tooltipController', tooltipController);

	    chart.tooltip = function(enable, cfg) {
	      if (common.isObject(enable)) {
	        cfg = enable;
	        enable = true;
	      }
	      tooltipController.enable = enable;
	      if (cfg) {
	        tooltipController.cfg = cfg;
	      }
	      return this;
	    };
	  },
	  afterGeomDraw(chart) {
	    const tooltipController = chart.get('tooltipController');
	    tooltipController.render();

	    chart.showTooltip = function(point) {
	      tooltipController.showTooltip(point);
	      return this;
	    };

	    chart.hideTooltip = function() {
	      tooltipController.hideTooltip();
	      return this;
	    };
	  },
	  clearInner(chart) {
	    const tooltipController = chart.get('tooltipController');
	    tooltipController.clear();
	  }
	};

	// register the default configuration for Guide
	global$1.guide = common.deepMix({
	  line: {
	    style: {
	      stroke: '#a3a3a3',
	      lineWidth: 1
	    },
	    top: true
	  },
	  text: {
	    style: {
	      fill: '#787878',
	      textAlign: 'center',
	      textBaseline: 'middle'
	    },
	    offsetX: 0,
	    offsetY: 0,
	    top: true
	  },
	  rect: {
	    style: {
	      fill: '#fafafa'
	    },
	    top: false
	  },
	  arc: {
	    style: {
	      stroke: '#a3a3a3'
	    },
	    top: true
	  },
	  html: {
	    offsetX: 0,
	    offsetY: 0,
	    alignX: 'center',
	    alignY: 'middle'
	  },
	  tag: {
	    top: true,
	    offsetX: 0,
	    offsetY: 0,
	    side: 4,
	    background: {
	      padding: 5,
	      radius: 2,
	      fill: '#1890FF'
	    },
	    textStyle: {
	      fontSize: 12,
	      fill: '#fff',
	      textAlign: 'center',
	      textBaseline: 'middle'
	    }
	  },
	  point: {
	    top: true,
	    offsetX: 0,
	    offsetY: 0,
	    style: {
	      fill: '#fff',
	      r: 3,
	      lineWidth: 2,
	      stroke: '#1890ff'
	    }
	  }
	}, global$1.guide || {});

	class GuideController {
	  constructor(cfg) {
	    this.guides = [];
	    this.xScale = null;
	    this.yScales = null;
	    this.guideShapes = [];
	    common.mix(this, cfg);
	  }

	  _toString(position) {
	    if (common.isFunction(position)) {
	      position = position(this.xScale, this.yScales);
	    }
	    position = position.toString();
	    return position;
	  }

	  _getId(shape, guide) {
	    let id = guide.id;
	    if (!id) {
	      const type = guide.type;
	      if (type === 'arc' || type === 'line' || type === 'rect') {
	        id = this._toString(guide.start) + '-' + this._toString(guide.end);
	      } else {
	        id = this._toString(guide.position);
	      }
	    }

	    return id;
	  }

	  paint(coord) {
	    const self = this;
	    const { chart, guides, xScale, yScales } = self;
	    const guideShapes = [];
	    common.each(guides, function(guide, idx) {
	      guide.xScale = xScale;
	      guide.yScales = yScales;
	      let container;
	      if (guide.type === 'regionFilter') { // TODO: RegionFilter support animation
	        guide.chart = chart;
	      } else {
	        container = guide.top ? self.frontPlot : self.backPlot;
	      }
	      guide.coord = coord;
	      guide.container = container;
	      guide.canvas = chart.get('canvas');
	      const shape = guide.render(coord, container);
	      if (shape) {
	        const id = self._getId(shape, guide);
	        [].concat(shape).forEach(s => {
	          s._id = s.get('className') + '-' + id;
	          s.set('index', idx);
	          guideShapes.push(s);
	        });
	      }
	    });
	    self.guideShapes = guideShapes;
	  }

	  clear() {
	    this.reset();
	    this.guides = [];
	    return this;
	  }

	  reset() {
	    const guides = this.guides;
	    common.each(guides, guide => {
	      guide.remove();
	    });
	  }
	  _createGuide(type, cfg) {
	    const ClassName = common.upperFirst(type);
	    const guide = new base$6[ClassName](common.deepMix({}, global$1.guide[type], cfg));
	    this.guides.push(guide);
	    return guide;
	  }

	  line(cfg = {}) {
	    return this._createGuide('line', cfg);
	  }

	  text(cfg = {}) {
	    return this._createGuide('text', cfg);
	  }

	  arc(cfg = {}) {
	    return this._createGuide('arc', cfg);
	  }

	  html(cfg = {}) {
	    return this._createGuide('html', cfg);
	  }

	  rect(cfg = {}) {
	    return this._createGuide('rect', cfg);
	  }

	  tag(cfg = {}) {
	    return this._createGuide('tag', cfg);
	  }

	  point(cfg = {}) {
	    return this._createGuide('point', cfg);
	  }

	  regionFilter(cfg = {}) {
	    return this._createGuide('regionFilter', cfg);
	  }
	}

	var guide = {
	  init(chart) {
	    const guideController = new GuideController({
	      frontPlot: chart.get('frontPlot').addGroup({
	        zIndex: 20,
	        className: 'guideContainer'
	      }),
	      backPlot: chart.get('backPlot').addGroup({
	        className: 'guideContainer'
	      })
	    });
	    chart.set('guideController', guideController);
	    /**
	     * 为图表添加 guide
	     * @return {GuideController} 返回 guide 控制器
	     */
	    chart.guide = function() {
	      return guideController;
	    };
	  },
	  afterGeomDraw(chart) {
	    const guideController = chart.get('guideController');
	    if (!guideController.guides.length) {
	      return;
	    }
	    const xScale = chart.getXScale();
	    const yScales = chart.getYScales();
	    const coord = chart.get('coord');
	    guideController.xScale = xScale;
	    guideController.yScales = yScales;
	    guideController.chart = chart; // for regionFilter
	    guideController.paint(coord);
	  },
	  clear(chart) {
	    chart.get('guideController').clear();
	  },
	  repaint(chart) {
	    chart.get('guideController').reset();
	  }
	};

	const LEGEND_GAP = 12;
	const MARKER_SIZE = 3;

	const DEFAULT_CFG = {
	  itemMarginBottom: 12,
	  itemGap: 10,
	  showTitle: false,
	  titleStyle: {
	    fontSize: 12,
	    fill: '#808080',
	    textAlign: 'start',
	    textBaseline: 'top'
	  },
	  nameStyle: {
	    fill: '#808080',
	    fontSize: 12,
	    textAlign: 'start',
	    textBaseline: 'middle'
	  },
	  valueStyle: {
	    fill: '#000000',
	    fontSize: 12,
	    textAlign: 'start',
	    textBaseline: 'middle'
	  },
	  unCheckStyle: {
	    fill: '#bfbfbf'
	  },
	  itemWidth: 'auto',
	  wordSpace: 6,
	  selectedMode: 'multiple' // 'multiple' or 'single'
	};


	// Register the default configuration for Legend
	global$1.legend = common.deepMix({
	  common: DEFAULT_CFG, // common legend configuration
	  right: common.mix({
	    position: 'right',
	    layout: 'vertical'
	  }, DEFAULT_CFG),
	  left: common.mix({
	    position: 'left',
	    layout: 'vertical'
	  }, DEFAULT_CFG),
	  top: common.mix({
	    position: 'top',
	    layout: 'horizontal'
	  }, DEFAULT_CFG),
	  bottom: common.mix({
	    position: 'bottom',
	    layout: 'horizontal'
	  }, DEFAULT_CFG)
	}, global$1.legend || {});

	function getPaddingByPos(pos, appendPadding) {
	  let padding = 0;
	  appendPadding = common.parsePadding(appendPadding);
	  switch (pos) {
	    case 'top':
	      padding = appendPadding[0];
	      break;
	    case 'right':
	      padding = appendPadding[1];
	      break;
	    case 'bottom':
	      padding = appendPadding[2];
	      break;
	    case 'left':
	      padding = appendPadding[3];
	      break;
	  }

	  return padding;
	}

	class LegendController {
	  constructor(cfg) {
	    this.legendCfg = {};
	    this.enable = true;
	    this.position = 'top';
	    common.mix(this, cfg);
	    const chart = this.chart;
	    this.canvasDom = chart.get('canvas').get('el');
	    this.clear();
	  }

	  addLegend(scale, items, filteredVals) {
	    const self = this;
	    const legendCfg = self.legendCfg;
	    const field = scale.field;
	    const fieldCfg = legendCfg[field];

	    if (fieldCfg === false) {
	      return null;
	    }

	    if (fieldCfg && fieldCfg.custom) {
	      self.addCustomLegend(field);
	    } else {
	      let position = legendCfg.position || self.position;
	      if (fieldCfg && fieldCfg.position) {
	        position = fieldCfg.position;
	      }
	      if (scale.isCategory) {
	        self._addCategoryLegend(scale, items, position, filteredVals);
	      }
	    }
	  }

	  addCustomLegend(field) {
	    const self = this;

	    let legendCfg = self.legendCfg;
	    if (field && legendCfg[field]) {
	      legendCfg = legendCfg[field];
	    }

	    const position = legendCfg.position || self.position;
	    const legends = self.legends;
	    legends[position] = legends[position] || [];
	    const items = legendCfg.items;
	    if (!items) {
	      return null;
	    }

	    const container = self.container;
	    common.each(items, item => {
	      if (!common.isPlainObject(item.marker)) {
	        item.marker = {
	          symbol: item.marker || 'circle',
	          fill: item.fill,
	          radius: MARKER_SIZE
	        };
	      } else {
	        item.marker.radius = item.marker.radius || MARKER_SIZE;
	      }
	      item.checked = common.isNil(item.checked) ? true : item.checked;
	      item.name = item.name || item.value;
	    });
	    const legend = new list(common.deepMix({}, global$1.legend[position], legendCfg, {
	      maxLength: self._getMaxLength(position),
	      items,
	      parent: container
	    }));
	    legends[position].push(legend);
	  }

	  clear() {
	    const legends = this.legends;
	    common.each(legends, legendItems => {
	      common.each(legendItems, legend => {
	        legend.clear();
	      });
	    });

	    this.legends = {};
	    this.unBindEvents();
	  }

	  _isFiltered(scale, values, value) {
	    let rst = false;
	    common.each(values, val => {
	      rst = rst || scale.getText(val) === scale.getText(value);
	      if (rst) {
	        return false;
	      }
	    });
	    return rst;
	  }

	  _getMaxLength(position) {
	    const chart = this.chart;
	    const appendPadding = common.parsePadding(chart.get('appendPadding'));

	    return (position === 'right' || position === 'left') ?
	      chart.get('height') - (appendPadding[0] + appendPadding[2]) :
	      chart.get('width') - (appendPadding[1] + appendPadding[3]);
	  }

	  _addCategoryLegend(scale, items, position, filteredVals) {
	    const self = this;
	    const { legendCfg, legends, container, chart } = self;
	    const field = scale.field;
	    legends[position] = legends[position] || [];

	    let symbol = 'circle';
	    if (legendCfg[field] && legendCfg[field].marker) {
	      symbol = legendCfg[field].marker;
	    } else if (legendCfg.marker) {
	      symbol = legendCfg.marker;
	    }

	    common.each(items, item => {
	      if (common.isPlainObject(symbol)) {
	        common.mix(item.marker, symbol);
	      } else {
	        item.marker.symbol = symbol;
	      }

	      if (filteredVals) {
	        item.checked = !self._isFiltered(scale, filteredVals, item.dataValue);
	      }
	    });

	    const legendItems = chart.get('legendItems');
	    legendItems[field] = items;

	    const lastCfg = common.deepMix({}, global$1.legend[position], legendCfg[field] || legendCfg, {
	      maxLength: self._getMaxLength(position),
	      items,
	      field,
	      filteredVals,
	      parent: container
	    });
	    if (lastCfg.showTitle) {
	      common.deepMix(lastCfg, {
	        title: scale.alias || scale.field
	      });
	    }

	    const legend = new list(lastCfg);
	    legends[position].push(legend);
	    return legend;
	  }

	  _alignLegend(legend, pre, position) {
	    const self = this;
	    const { tl, bl } = self.plotRange;
	    const chart = self.chart;
	    let offsetX = legend.offsetX || 0;
	    let offsetY = legend.offsetY || 0;
	    const chartWidth = chart.get('width');
	    const chartHeight = chart.get('height');
	    const appendPadding = common.parsePadding(chart.get('appendPadding'));
	    const legendHeight = legend.getHeight();
	    const legendWidth = legend.getWidth();

	    let x = 0;
	    let y = 0;
	    if (position === 'left' || position === 'right') {
	      const verticalAlign = legend.verticalAlign || 'middle';
	      const height = Math.abs(tl.y - bl.y);
	      x = (position === 'left') ? appendPadding[3] : (chartWidth - legendWidth - appendPadding[1]);
	      y = (height - legendHeight) / 2 + tl.y;
	      if (verticalAlign === 'top') {
	        y = tl.y;
	      } else if (verticalAlign === 'bottom') {
	        y = bl.y - legendHeight;
	      }

	      if (pre) {
	        y = pre.get('y') - legendHeight - LEGEND_GAP;
	      }
	    } else {
	      const align = legend.align || 'left';
	      x = appendPadding[3];

	      if (align === 'center') {
	        x = chartWidth / 2 - legendWidth / 2;
	      } else if (align === 'right') {
	        x = chartWidth - (legendWidth + appendPadding[1]);
	      }
	      y = (position === 'top') ? appendPadding[0] + Math.abs(legend.container.getBBox().minY) : (chartHeight - legendHeight);
	      if (pre) {
	        const preWidth = pre.getWidth();
	        x = pre.x + preWidth + LEGEND_GAP;
	      }
	    }
	    if (position === 'bottom' && offsetY > 0) {
	      offsetY = 0;
	    }
	    if (position === 'right' && offsetX > 0) {
	      offsetX = 0;
	    }
	    legend.moveTo(x + offsetX, y + offsetY);
	  }

	  alignLegends() {
	    const self = this;
	    const legends = self.legends;
	    common.each(legends, (legendItems, position) => {
	      common.each(legendItems, (legend, index) => {
	        const pre = legendItems[index - 1];
	        self._alignLegend(legend, pre, position);
	      });
	    });

	    return self;
	  }

	  handleEvent(ev) {
	    const self = this;

	    function findItem(x, y) {
	      let result = null;
	      const legends = self.legends;
	      common.each(legends, legendItems => {
	        common.each(legendItems, legend => {
	          const { itemsGroup, legendHitBoxes } = legend;
	          const children = itemsGroup.get('children');
	          if (children.length) {
	            const legendPosX = legend.x;
	            const legendPosY = legend.y;
	            common.each(legendHitBoxes, (box, index) => {
	              if (x >= (box.x + legendPosX) && x <= (box.x + box.width + legendPosX) && y >= (box.y + legendPosY) && y <= (box.height + box.y + legendPosY)) { // inbox
	                result = {
	                  clickedItem: children[index],
	                  clickedLegend: legend
	                };
	                return false;
	              }
	            });
	          }
	        });
	      });
	      return result;
	    }

	    const chart = self.chart;
	    const { x, y } = common.createEvent(ev, chart);
	    const clicked = findItem(x, y);
	    if (clicked && clicked.clickedLegend.clickable !== false) {
	      const { clickedItem, clickedLegend } = clicked;
	      if (clickedLegend.onClick) {
	        ev.clickedItem = clickedItem;
	        clickedLegend.onClick(ev);
	      } else if (!clickedLegend.custom) {
	        const checked = clickedItem.get('checked');
	        const value = clickedItem.get('dataValue');
	        const { filteredVals, field, selectedMode } = clickedLegend;
	        const isSingeSelected = selectedMode === 'single';

	        if (isSingeSelected) {
	          chart.filter(field, val => {
	            return val === value;
	          });
	        } else {
	          if (checked) {
	            filteredVals.push(value);
	          } else {
	            common.Array.remove(filteredVals, value);
	          }

	          chart.filter(field, val => {
	            return filteredVals.indexOf(val) === -1;
	          });
	        }

	        chart.repaint();
	      }
	    }
	  }

	  bindEvents() {
	    const legendCfg = this.legendCfg;
	    const triggerOn = legendCfg.triggerOn || 'touchstart';
	    const method = common.wrapBehavior(this, 'handleEvent');
	    common.addEventListener(this.canvasDom, triggerOn, method);
	  }

	  unBindEvents() {
	    const legendCfg = this.legendCfg;
	    const triggerOn = legendCfg.triggerOn || 'touchstart';
	    const method = common.getWrapBehavior(this, 'handleEvent');
	    common.removeEventListener(this.canvasDom, triggerOn, method);
	  }
	}
	var legend = {
	  init(chart) {
	    const legendController = new LegendController({
	      container: chart.get('backPlot'),
	      plotRange: chart.get('plotRange'),
	      chart
	    });
	    chart.set('legendController', legendController);

	    chart.legend = function(field, cfg) {
	      let legendCfg = legendController.legendCfg;
	      legendController.enable = true;

	      if (common.isBoolean(field)) {
	        legendController.enable = field;
	        legendCfg = cfg || {};
	      } else if (common.isObject(field)) {
	        legendCfg = field;
	      } else {
	        legendCfg[field] = cfg;
	      }

	      legendController.legendCfg = legendCfg;

	      return this;
	    };
	  },
	  beforeGeomDraw(chart) {
	    const legendController = chart.get('legendController');
	    if (!legendController.enable) return null; // legend is not displayed

	    const legendCfg = legendController.legendCfg;

	    if (legendCfg && legendCfg.custom) {
	      legendController.addCustomLegend();
	    } else {
	      const legendItems = chart.getLegendItems();
	      const scales = chart.get('scales');
	      const filters = chart.get('filters');
	      common.each(legendItems, (items, field) => {
	        const scale = scales[field];
	        const values = scale.values;
	        let filteredVals;
	        if (filters && filters[field]) {
	          filteredVals = values.filter(v => !filters[field](v));
	        } else {
	          filteredVals = [];
	        }
	        legendController.addLegend(scale, items, filteredVals);
	      });
	    }

	    if (legendCfg && legendCfg.clickable !== false) {
	      legendController.bindEvents();
	    }

	    const legends = legendController.legends;
	    const legendRange = {
	      top: 0,
	      right: 0,
	      bottom: 0,
	      left: 0
	    };
	    common.each(legends, (legendItems, position) => {
	      let padding = 0;
	      common.each(legendItems, legend => {
	        const width = legend.getWidth();
	        const height = legend.getHeight();
	        if (position === 'top' || position === 'bottom') {
	          padding = Math.max(padding, height);
	          if (legend.offsetY > 0) {
	            padding += legend.offsetY;
	          }
	        } else {
	          padding = Math.max(padding, width);
	          if (legend.offsetX > 0) {
	            padding += legend.offsetX;
	          }
	        }
	      });
	      legendRange[position] = padding + getPaddingByPos(position, chart.get('appendPadding'));
	    });
	    chart.set('legendRange', legendRange);
	  },
	  afterGeomDraw(chart) {
	    const legendController = chart.get('legendController');
	    legendController.alignLegends();
	  },
	  clearInner(chart) {
	    const legendController = chart.get('legendController');
	    legendController.clear();
	    chart.set('legendRange', null);
	  }
	};

	const { requestAnimationFrame: requestAnimationFrame$2 } = requestAnimationFrame;
	const clock = typeof performance === 'object' && performance.now ? performance : Date;

	class Timeline {
	  constructor() {
	    this.anims = [];
	    this.time = null;
	    this.playing = false;
	    this.canvas = [];
	  }

	  play() {
	    const self = this;
	    self.time = clock.now();
	    self.playing = true;

	    function step() {
	      if (self.playing) {
	        requestAnimationFrame$2(step);
	        self.update();
	      }
	    }

	    requestAnimationFrame$2(step);
	  }

	  stop() {
	    this.playing = false;
	    this.time = null;
	    this.canvas = [];
	  }

	  update() {
	    const currentTime = clock.now();
	    this.canvas = [];

	    for (let i = 0; i < this.anims.length; i++) {
	      const propertyAnim = this.anims[i];
	      if (currentTime < propertyAnim.startTime || propertyAnim.hasEnded) {
	        continue;
	      }
	      const shape = propertyAnim.shape; // shape
	      if (shape.get('destroyed')) {
	        this.anims.splice(i, 1);
	        i--;
	        continue;
	      }

	      const { startState, endState, interpolate, duration } = propertyAnim;
	      if (currentTime >= propertyAnim.startTime && !propertyAnim.hasStarted) {
	        propertyAnim.hasStarted = true;
	        if (propertyAnim.onStart) {
	          propertyAnim.onStart();
	        }
	      }
	      let t = (currentTime - propertyAnim.startTime) / duration;
	      t = Math.max(0, Math.min(t, 1));
	      t = propertyAnim.easing(t);

	      if (propertyAnim.onFrame) {
	        propertyAnim.onFrame(t);
	      } else {
	        for (const key in interpolate) {
	          const diff = interpolate[key];
	          const value = diff(t);
	          let newValue;
	          if (key === 'points') {
	            newValue = [];
	            const aLen = Math.max(startState.points.length, endState.points.length);
	            for (let j = 0; j < aLen; j += 2) {
	              newValue.push({
	                x: value[j],
	                y: value[j + 1]
	              });
	            }
	          } else {
	            newValue = value;
	          }
	          shape._attrs.attrs[key] = newValue;
	          shape._attrs.bbox = null; // should clear calculated bbox
	        }
	      }

	      const canvas = shape.get('canvas');
	      if (this.canvas.indexOf(canvas) === -1) {
	        this.canvas.push(canvas);
	      }

	      if (propertyAnim.onUpdate) {
	        propertyAnim.onUpdate(t);
	      }

	      if (currentTime >= propertyAnim.endTime && !propertyAnim.hasEnded) {
	        propertyAnim.hasEnded = true;
	        if (propertyAnim.onEnd) {
	          propertyAnim.onEnd();
	        }
	      }

	      if (t === 1) { // end
	        this.anims.splice(i, 1);
	        i--;
	      }
	    }

	    this.canvas.map(c => {
	      c.draw();
	      return c;
	    });
	    this.time = clock.now();
	  }
	}

	var timeline = Timeline;

	const Easing = {
	  linear(k) {
	    return k;
	  },

	  quadraticIn(k) {
	    return k * k;
	  },

	  quadraticOut(k) {
	    return k * (2 - k);
	  },

	  quadraticInOut(k) {
	    if ((k *= 2) < 1) {
	      return 0.5 * k * k;
	    }
	    return -0.5 * (--k * (k - 2) - 1);
	  },

	  cubicIn(k) {
	    return k * k * k;
	  },

	  cubicOut(k) {
	    return --k * k * k + 1;
	  },

	  cubicInOut(k) {
	    if ((k *= 2) < 1) {
	      return 0.5 * k * k * k;
	    }
	    return 0.5 * ((k -= 2) * k * k + 2);
	  },

	  elasticIn(k) {
	    let s;
	    let a = 0.1;
	    let p = 0.4;
	    if (k === 0) return 0;
	    if (k === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(1 / a);
	    }
	    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
	  },

	  elasticOut(k) {
	    let s;
	    let a = 0.1;
	    let p = 0.4;
	    if (k === 0) return 0;
	    if (k === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(1 / a);
	    }
	    return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	  },

	  elasticInOut(k) {
	    let s;
	    let a = 0.1;
	    let p = 0.4;
	    if (k === 0) return 0;
	    if (k === 1) return 1;
	    if (!a || a < 1) {
	      a = 1;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(1 / a);
	    }
	    if ((k *= 2) < 1) {
	      return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
	    }
	    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
	  },

	  backIn(k) {
	    const s = 1.70158;
	    return k * k * ((s + 1) * k - s);
	  },

	  backOut(k) {
	    const s = 1.70158;
	    return (k = k - 1) * k * ((s + 1) * k + s) + 1;
	  },

	  backInOut(k) {
	    const s = 1.70158 * 1.525;
	    if ((k *= 2) < 1) {
	      return 0.5 * (k * k * ((s + 1) * k - s));
	    }
	    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
	  },

	  bounceIn(k) {
	    return 1 - Easing.bounceOut(1 - k);
	  },

	  bounceOut(k) {
	    if ((k /= 1) < (1 / 2.75)) {
	      return 7.5625 * k * k;
	    } else if (k < (2 / 2.75)) {
	      return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	    } else if (k < (2.5 / 2.75)) {
	      return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	    }

	    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	  },

	  bounceInOut(k) {
	    if (k < 0.5) {
	      return Easing.bounceIn(k * 2) * 0.5;
	    }
	    return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
	  }
	};

	var easing = Easing;

	function plainArray(arr) {
	  const result = [];
	  for (let i = 0, len = arr.length; i < len; i++) {
	    if (arr[i]) {
	      result.push(arr[i].x);
	      result.push(arr[i].y);
	    }
	  }
	  return result;
	}

	function interpolateNumber(a, b) {
	  a = +a;
	  b -= a;
	  return function(t) {
	    return a + b * t;
	  };
	}

	function interpolateArray(a, b) {
	  const nb = b ? b.length : 0;
	  const na = a ? Math.min(nb, a.length) : 0;
	  const x = new Array(na);
	  const c = new Array(nb);
	  let i;

	  for (i = 0; i < na; ++i) x[i] = interpolateNumber(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	}

	class Animator {
	  constructor(shape, source, timeline) {
	    this.hasStarted = false;
	    this.hasEnded = false;
	    this.shape = shape;
	    this.source = source;
	    this.timeline = timeline;
	    this.animate = null;
	  }

	  // delay, attrs, duration, easing
	  to(cfg = {}) {
	    const delay = cfg.delay || 0;
	    const attrs = cfg.attrs || {};
	    const duration = cfg.duration || 1000;

	    let easing$1; // 缓动函数
	    if (typeof (cfg.easing) === 'function') {
	      easing$1 = cfg.easing;
	    } else {
	      easing$1 = easing[cfg.easing] || easing.linear;
	    }

	    const animInfo = {
	      shape: this.shape,
	      startTime: this.timeline.time + delay,
	      duration,
	      easing: easing$1
	    };

	    const interpolate = {}; // 差值函数
	    for (const attrName in attrs) {
	      let startValue = this.source[attrName];
	      let endValue = attrs[attrName];
	      if (attrName === 'points') {
	        startValue = plainArray(startValue);
	        endValue = plainArray(endValue);
	        interpolate.points = interpolateArray(startValue, endValue);
	        this.source.points = startValue;
	        attrs.points = endValue;
	      } else if (attrName === 'matrix') {
	        interpolate.matrix = interpolateArray(startValue, endValue);
	      } else {
	        interpolate[attrName] = interpolateNumber(startValue, endValue);
	      }
	    }
	    animInfo.interpolate = interpolate;
	    animInfo.startState = this.source;
	    animInfo.endState = attrs;
	    animInfo.endTime = animInfo.startTime + duration;

	    this.timeline.anims.push(animInfo);
	    this.animate = animInfo;
	    return this;
	  }

	  onFrame(callback) { // 自定义每一帧动画的动作
	    if (this.animate) {
	      this.animate.onFrame = function(frame) {
	        callback(frame);
	      };
	    }

	    return this;
	  }

	  onStart(callback) {
	    if (this.animate) {
	      this.animate.onStart = function() {
	        callback();
	      };
	    }

	    return this;
	  }

	  onUpdate(callback) {
	    if (this.animate) {
	      this.animate.onUpdate = function(frame) {
	        callback(frame);
	      };
	    }

	    return this;
	  }

	  onEnd(callback) {
	    if (this.animate) {
	      this.animate.onEnd = function() {
	        callback();
	      };
	    }

	    return this;
	  }
	}

	var animator = Animator;

	/**
	 * Animate configuration and register
	 * @author sima.zhang1990@gmail.com
	 */

	const defaultAnimationCfg = {
	  appear: {
	    duration: 450,
	    easing: 'quadraticOut'
	  }, // 'appear' animation options
	  update: {
	    duration: 300,
	    easing: 'quadraticOut'
	  }, // 'update' animation options
	  enter: {
	    duration: 300,
	    easing: 'quadraticOut'
	  }, // 'enter' animation options
	  leave: {
	    duration: 350,
	    easing: 'quadraticIn'
	  } // 'leave' animation options
	};

	const Animate = {
	  defaultCfg: {},
	  Action: {},
	  getAnimation(geomType, coord, animationType) {
	    const geomAnimateCfg = this.defaultCfg[geomType];
	    if (geomAnimateCfg) {
	      const animation = geomAnimateCfg[animationType];
	      if (common.isFunction(animation)) {
	        return animation(coord);
	      }
	    }
	    return false;
	  },
	  getAnimateCfg(geomType, animationType) {
	    const defaultCfg = defaultAnimationCfg[animationType];
	    const geomConfig = this.defaultCfg[geomType];
	    if (geomConfig && geomConfig.cfg && geomConfig.cfg[animationType]) {
	      return common.deepMix({}, defaultCfg, geomConfig.cfg[animationType]);
	    }
	    return defaultCfg;
	  },
	  registerAnimation(animationName, animationFun) {
	    if (!this.Action) {
	      this.Action = {};
	    }
	    this.Action[animationName] = animationFun;
	  }
	};

	var animate = Animate;

	/**
	 * Utility
	 * @author sima.zhang1990@gmail.com
	 */
	const { Matrix: Matrix$1 } = graphic;


	const Helpers = {
	  getCoordInfo(coord) {
	    const start = coord.start;
	    const end = coord.end;
	    return {
	      start,
	      end,
	      width: end.x - start.x,
	      height: Math.abs(end.y - start.y)
	    };
	  },
	  getScaledMatrix(shape, v, direct) {
	    let scaledMatrix;

	    shape.apply(v);
	    const x = v[0];
	    const y = v[1];

	    if (direct === 'x') {
	      shape.transform([
	        [ 't', x, y ],
	        [ 's', 0.01, 1 ],
	        [ 't', -x, -y ]
	      ]);
	      const matrix = shape.getMatrix();
	      scaledMatrix = Matrix$1.transform(matrix, [
	        [ 't', x, y ],
	        [ 's', 100, 1 ],
	        [ 't', -x, -y ]
	      ]);
	    } else if (direct === 'y') {
	      shape.transform([
	        [ 't', x, y ],
	        [ 's', 1, 0.01 ],
	        [ 't', -x, -y ]
	      ]);
	      const matrix = shape.getMatrix();
	      scaledMatrix = Matrix$1.transform(matrix, [
	        [ 't', x, y ],
	        [ 's', 1, 100 ],
	        [ 't', -x, -y ]
	      ]);
	    } else if (direct === 'xy') {
	      shape.transform([
	        [ 't', x, y ],
	        [ 's', 0.01, 0.01 ],
	        [ 't', -x, -y ]
	      ]);
	      const matrix = shape.getMatrix();
	      scaledMatrix = Matrix$1.transform(matrix, [
	        [ 't', x, y ],
	        [ 's', 100, 100 ],
	        [ 't', -x, -y ]
	      ]);
	    }
	    return scaledMatrix;
	  },
	  getAnimateParam(animateCfg, index, id) {
	    const result = {};
	    if (animateCfg.delay) {
	      result.delay = common.isFunction(animateCfg.delay) ? animateCfg.delay(index, id) : animateCfg.delay;
	    }
	    result.easing = animateCfg.easing;
	    result.duration = animateCfg.duration;
	    result.delay = animateCfg.delay;
	    return result;
	  },
	  doAnimation(shape, endState, animateCfg, callback) {
	    const id = shape._id;
	    const index = shape.get('index');
	    const { easing, delay, duration } = Helpers.getAnimateParam(animateCfg, index, id);
	    const anim = shape.animate().to({
	      attrs: endState,
	      duration,
	      delay,
	      easing
	    });

	    if (callback) {
	      anim.onEnd(() => {
	        callback();
	      });
	    }
	  }
	};

	var util$2 = Helpers;

	/**
	 * Animation functions for shape
	 * @author sima.zhang1990@gmail.com
	 */



	/*
	function waveIn(shape, animateCfg, coord) {
	  const clip = Helpers.getClip(coord);
	  clip.set('canvas', shape.get('canvas'));
	  shape.attr('clip', clip);
	  const onEnd = function() {
	    shape.attr('clip', null);
	    clip.remove(true);
	  };
	  Helpers.doAnimation(clip, clip.endState, animateCfg, onEnd);
	}

	function scaleInX(shape, animateCfg) {
	  const box = shape.getBBox();
	  const points = shape.get('origin').points;
	  let x;
	  const y = (box.minY + box.maxY) / 2;

	  if (points[0].y - points[1].y > 0) { // 当顶点在零点之下
	    x = box.maxX;
	  } else {
	    x = box.minX;
	  }
	  const scaledMatrix = Helpers.getScaledMatrix(shape, [ x, y ], 'x');
	  Helpers.doAnimation(shape, { matrix: scaledMatrix }, animateCfg);
	}

	function scaleInY(shape, animateCfg) {
	  const box = shape.getBBox();
	  const points = shape.get('origin').points;
	  const x = (box.minX + box.maxX) / 2;
	  let y;

	  if (points[0].y - points[1].y <= 0) { // 当顶点在零点之下
	    y = box.maxY;
	  } else {
	    y = box.minY;
	  }
	  const scaledMatrix = Helpers.getScaledMatrix(shape, [ x, y ], 'x');
	  Helpers.doAnimation(shape, { matrix: scaledMatrix }, animateCfg);
	}
	*/

	function fadeIn(shape, animateCfg) {
	  const fillOpacity = common.isNil(shape.attr('fillOpacity')) ? 1 : shape.attr('fillOpacity');
	  const strokeOpacity = common.isNil(shape.attr('strokeOpacity')) ? 1 : shape.attr('strokeOpacity');
	  shape.attr('fillOpacity', 0);
	  shape.attr('strokeOpacity', 0);
	  const endState = {
	    fillOpacity,
	    strokeOpacity
	  };
	  util$2.doAnimation(shape, endState, animateCfg);
	}

	var shapeAction = {
	  // waveIn,
	  // scaleInX,
	  // scaleInY,
	  fadeIn
	};

	/**
	 * Group animate functions
	 * @author sima.zhang1990@gmail.com
	 */


	const { Shape: Shape$6 } = graphic;

	function _groupScaleIn(container, animateCfg, coord, zeroY, type) {
	  const { start, end, width, height } = util$2.getCoordInfo(coord);
	  let x;
	  let y;

	  const clip = new Shape$6.Rect({
	    attrs: {
	      x: start.x,
	      y: end.y,
	      width,
	      height
	    }
	  });

	  if (type === 'y') {
	    x = start.x + width / 2;
	    y = zeroY.y < start.y ? zeroY.y : start.y;
	  } else if (type === 'x') {
	    x = zeroY.x > start.x ? zeroY.x : start.x;
	    y = start.y + height / 2;
	  } else if (type === 'xy') {
	    if (coord.isPolar) {
	      x = coord.center.x;
	      y = coord.center.y;
	    } else {
	      x = (start.x + end.x) / 2;
	      y = (start.y + end.y) / 2;
	    }
	  }

	  const endMatrix = util$2.getScaledMatrix(clip, [ x, y ], type);
	  clip.isClip = true;
	  clip.endState = {
	    matrix: endMatrix
	  };

	  clip.set('canvas', container.get('canvas'));
	  container.attr('clip', clip);
	  const onEnd = function() {
	    container.attr('clip', null);
	    clip.remove(true);
	  };
	  util$2.doAnimation(clip, clip.endState, animateCfg, onEnd);
	}

	function _shapeScale(container, animateCfg, type) {
	  const shapes = container.get('children');
	  let x;
	  let y;
	  let endMatrix;

	  for (let i = 0, len = shapes.length; i < len; i++) {
	    const shape = shapes[i];
	    const box = shape.getBBox();
	    x = (box.minX + box.maxX) / 2;
	    y = (box.minY + box.maxY) / 2;
	    endMatrix = util$2.getScaledMatrix(shape, [ x, y ], type);
	    util$2.doAnimation(shape, { matrix: endMatrix }, animateCfg);
	  }
	}

	function groupScaleInX(container, animateCfg, coord, zeroY) {
	  _groupScaleIn(container, animateCfg, coord, zeroY, 'x');
	}

	function groupScaleInY(container, animateCfg, coord, zeroY) {
	  _groupScaleIn(container, animateCfg, coord, zeroY, 'y');
	}

	function groupScaleInXY(container, animateCfg, coord, zeroY) {
	  _groupScaleIn(container, animateCfg, coord, zeroY, 'xy');
	}

	function shapesScaleInX(container, animateCfg) {
	  _shapeScale(container, animateCfg, 'x');
	}

	function shapesScaleInY(container, animateCfg) {
	  _shapeScale(container, animateCfg, 'y');
	}

	function shapesScaleInXY(container, animateCfg) {
	  _shapeScale(container, animateCfg, 'xy');
	}

	function groupWaveIn(container, animateCfg, coord) {
	  const clip = helper.getClip(coord);
	  clip.set('canvas', container.get('canvas'));
	  container.attr('clip', clip);
	  const onEnd = function() {
	    container.attr('clip', null);
	    clip.remove(true);
	  };
	  const endState = {};
	  if (coord.isPolar) {
	    const { startAngle, endAngle } = coord;
	    endState.endAngle = endAngle;
	    clip.attr('endAngle', startAngle);
	  } else {
	    const { start, end } = coord;
	    const width = Math.abs(start.x - end.x);
	    const height = Math.abs(start.y - end.y);
	    if (coord.isTransposed) {
	      clip.attr('height', 0);
	      endState.height = height;
	    } else {
	      clip.attr('width', 0);
	      endState.width = width;
	    }
	  }
	  util$2.doAnimation(clip, endState, animateCfg, onEnd);
	}

	var groupAction = {
	  groupWaveIn,
	  groupScaleInX,
	  groupScaleInY,
	  groupScaleInXY,
	  shapesScaleInX,
	  shapesScaleInY,
	  shapesScaleInXY
	};

	/**
	 * Handle the detail animations
	 * @author sima.zhang1990@gmail.com
	 */









	let timeline$1;
	element.prototype.animate = function() {
	  const attrs = common.mix({}, this.get('attrs'));
	  return new animator(this, attrs, timeline$1);
	};

	chart.prototype.animate = function(cfg) {
	  this.set('animate', cfg);
	  return this;
	};

	animate.Action = shapeAction;
	animate.defaultCfg = {
	  interval: {
	    enter(coord) {
	      if (coord.isPolar && coord.transposed) { // for pie chart
	        return function(shape) {
	          shape.set('zIndex', -1);
	          const container = shape.get('parent');
	          container.sort();
	        };
	      }
	      return shapeAction.fadeIn;
	    }
	  },
	  area: {
	    enter(coord) {
	      if (coord.isPolar) return null;
	      return shapeAction.fadeIn;
	    }
	  },
	  line: {
	    enter(coord) {
	      if (coord.isPolar) return null;

	      return shapeAction.fadeIn;
	    }
	  },
	  path: {
	    enter(coord) {
	      if (coord.isPolar) return null;

	      return shapeAction.fadeIn;
	    }
	  }
	};

	const GROUP_ANIMATION = {
	  line(coord) {
	    if (coord.isPolar) {
	      return groupAction.groupScaleInXY;
	    }
	    return groupAction.groupWaveIn;
	  },
	  area(coord) {
	    if (coord.isPolar) {
	      return groupAction.groupScaleInXY;
	    }
	    return groupAction.groupWaveIn;
	  },
	  path(coord) {
	    if (coord.isPolar) {
	      return groupAction.groupScaleInXY;
	    }
	    return groupAction.groupWaveIn;
	  },
	  point() {
	    return groupAction.shapesScaleInXY;
	  },
	  interval(coord) {
	    let result;
	    if (coord.isPolar) { // polar coodinate
	      result = groupAction.groupScaleInXY;
	      if (coord.transposed) { // pie chart
	        result = groupAction.groupWaveIn;
	      }
	    } else {
	      result = coord.transposed ? groupAction.groupScaleInX : groupAction.groupScaleInY;
	    }
	    return result;
	  },
	  schema() {
	    return groupAction.groupWaveIn;
	  }
	};

	function diff(fromAttrs, toAttrs) {
	  const endState = {};
	  for (const k in toAttrs) {
	    if (common.isNumber(fromAttrs[k]) && fromAttrs[k] !== toAttrs[k]) {
	      endState[k] = toAttrs[k];
	    } else if (common.isArray(fromAttrs[k]) && JSON.stringify(fromAttrs[k]) !== JSON.stringify(toAttrs[k])) {
	      endState[k] = toAttrs[k];
	    }
	  }
	  return endState;
	}

	// Add a unique id identifier to each shape
	function _getShapeId(geom, dataObj, geomIdx) {
	  const type = geom.get('type');
	  let id = 'geom' + geomIdx + '-' + type;
	  const xScale = geom.getXScale();
	  const yScale = geom.getYScale();
	  const xField = xScale.field || 'x';
	  const yField = yScale.field || 'y';
	  const yVal = dataObj[yField];
	  let xVal;
	  if (xScale.isIdentity) {
	    xVal = xScale.value;
	  } else {
	    xVal = dataObj[xField];
	  }

	  if (type === 'interval' || type === 'schema') {
	    id += '-' + xVal;
	  } else if (type === 'line' || type === 'area' || type === 'path') {
	    id += '-' + type;
	  } else {
	    id += xScale.isCategory ? '-' + xVal : '-' + xVal + '-' + yVal;
	  }

	  const groupScales = geom._getGroupScales();
	  common.each(groupScales, groupScale => {
	    const field = groupScale.field;
	    if (groupScale.type !== 'identity') {
	      id += '-' + dataObj[field];
	    }
	  });

	  return id;
	}

	// get geometry's shapes
	function getShapes(geoms, chart, coord) {
	  const shapes = [];

	  common.each(geoms, (geom, geomIdx) => {
	    const geomContainer = geom.get('container');
	    const geomShapes = geomContainer.get('children');
	    const type = geom.get('type');
	    const animateCfg = common.isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');
	    if (animateCfg !== false) {
	      common.each(geomShapes, (shape, index) => {
	        if (shape.get('className') === type) {
	          shape._id = _getShapeId(geom, shape.get('origin')._origin, geomIdx);
	          shape.set('coord', coord);
	          shape.set('animateCfg', animateCfg);
	          shape.set('index', index);
	          shapes.push(shape);
	        }
	      });
	    }
	    geom.set('shapes', geomShapes);
	  });
	  return shapes;
	}

	function cache(shapes) {
	  const rst = {};
	  for (let i = 0, len = shapes.length; i < len; i++) {
	    const shape = shapes[i];
	    if (!shape._id || shape.isClip) continue;
	    const id = shape._id;
	    rst[id] = {
	      _id: id,
	      type: shape.get('type'), // the type of shape
	      attrs: common.mix({}, shape._attrs.attrs), // the graphics attributes of shape
	      className: shape.get('className'),
	      geomType: shape.get('className'),
	      index: shape.get('index'),
	      coord: shape.get('coord'),
	      animateCfg: shape.get('animateCfg')
	    };
	  }
	  return rst;
	}

	function getAnimate(geomType, coord, animationType, animationName) {
	  let result;

	  if (common.isFunction(animationName)) {
	    result = animationName;
	  } else if (common.isString(animationName)) {
	    result = animate.Action[animationName];
	  } else {
	    result = animate.getAnimation(geomType, coord, animationType);
	  }
	  return result;
	}

	function getAnimateCfg(geomType, animationType, animateCfg) {
	  if (animateCfg === false || (common.isObject(animateCfg) && (animateCfg[animationType] === false))) {
	    return false;
	  }

	  const defaultCfg = animate.getAnimateCfg(geomType, animationType);
	  if (animateCfg && animateCfg[animationType]) {
	    return common.deepMix({}, defaultCfg, animateCfg[animationType]);
	  }
	  return defaultCfg;
	}

	function addAnimate(cache, shapes, canvas) {
	  let animate;
	  let animateCfg;

	  // the order of animation: leave -> update -> enter
	  const updateShapes = [];
	  const newShapes = [];
	  common.each(shapes, shape => {
	    const result = cache[shape._id];
	    if (!result) {
	      newShapes.push(shape);
	    } else {
	      shape.set('cacheShape', result);
	      updateShapes.push(shape);
	      delete cache[shape._id];
	    }
	  });

	  // first do the leave animation
	  common.each(cache, deletedShape => {
	    const { className, coord, _id, attrs, index, type } = deletedShape;

	    animateCfg = getAnimateCfg(className, 'leave', deletedShape.animateCfg);
	    if (animateCfg === false) return true;

	    animate = getAnimate(className, coord, 'leave', animateCfg.animation);
	    if (common.isFunction(animate)) {
	      const tempShape = canvas.addShape(type, {
	        attrs,
	        index,
	        canvas,
	        className
	      });
	      tempShape._id = _id;
	      animate(tempShape, animateCfg, coord);
	    }
	  });

	  // then do the update animation
	  common.each(updateShapes, updateShape => {
	    const className = updateShape.get('className');

	    animateCfg = getAnimateCfg(className, 'update', updateShape.get('animateCfg'));
	    if (animateCfg === false) return true;
	    const coord = updateShape.get('coord');
	    const cacheAttrs = updateShape.get('cacheShape').attrs;
	    const endState = diff(cacheAttrs, updateShape._attrs.attrs); // 判断如果属性相同的话就不进行变换
	    if (Object.keys(endState).length) {
	      animate = getAnimate(className, coord, 'update', animateCfg.animation);
	      if (common.isFunction(animate)) {
	        animate(updateShape, animateCfg, coord);
	      } else {
	        updateShape.attr(cacheAttrs);
	        updateShape.animate().to({
	          attrs: endState,
	          duration: animateCfg.duration,
	          easing: animateCfg.easing,
	          delay: animateCfg.delay
	        }).onEnd(function() {
	          updateShape.set('cacheShape', null);
	        });
	      }
	    }
	  });

	  // last, enter animation
	  common.each(newShapes, newShape => {
	    // 新图形元素的进场元素
	    const className = newShape.get('className');
	    const coord = newShape.get('coord');

	    animateCfg = getAnimateCfg(className, 'enter', newShape.get('animateCfg'));
	    if (animateCfg === false) return true;

	    animate = getAnimate(className, coord, 'enter', animateCfg.animation);
	    if (common.isFunction(animate)) {
	      if (className === 'interval' && coord.isPolar && coord.transposed) {
	        const index = (newShape.get('index'));
	        const lastShape = updateShapes[index - 1];
	        animate(newShape, animateCfg, lastShape);
	      } else {
	        animate(newShape, animateCfg, coord);
	      }
	    }
	  });
	}

	function _getAnimateCfgByShapeType(type, chart) {
	  if (!type) {
	    return null;
	  }
	  const animateCfg = chart.get('animate');

	  if (type.indexOf('guide-tag') > -1) {
	    type = 'guide-tag';
	  }

	  if (common.isObject(animateCfg)) {
	    return animateCfg[type];
	  }

	  if (animateCfg === false) {
	    return false;
	  }

	  return null;
	}

	var detail = {
	  afterCanvasInit(/* chart */) {
	    timeline$1 = new timeline();
	    timeline$1.play();
	  },
	  beforeCanvasDraw(chart) {
	    if (chart.get('animate') === false) {
	      return;
	    }

	    let isUpdate = chart.get('isUpdate');
	    const canvas = chart.get('canvas');
	    const coord = chart.get('coord');
	    const geoms = chart.get('geoms');

	    const caches = canvas.get('caches') || [];
	    if (caches.length === 0) {
	      isUpdate = false;
	    }

	    const cacheShapes = getShapes(geoms, chart, coord);
	    const { frontPlot, backPlot } = chart.get('axisController');
	    const axisShapes = frontPlot.get('children').concat(backPlot.get('children'));
	    let guideShapes = [];
	    if (chart.get('guideController')) {
	      guideShapes = chart.get('guideController').guideShapes;
	    }
	    const componentShapes = [];
	    axisShapes.concat(guideShapes).forEach(s => {
	      const className = s.get('className');
	      const animateCfg = _getAnimateCfgByShapeType(className, chart);
	      s.set('coord', coord);
	      s.set('animateCfg', animateCfg);
	      componentShapes.push(s);
	      cacheShapes.push(s);
	    });
	    canvas.set('caches', cache(cacheShapes));

	    if (isUpdate) {
	      addAnimate(caches, cacheShapes, canvas);
	    } else { // do the appear animation
	      let animateCfg;
	      let animate$1;
	      common.each(geoms, geom => {
	        const type = geom.get('type');
	        const geomCfg = common.isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');
	        if (geomCfg !== false) {
	          animateCfg = getAnimateCfg(type, 'appear', geomCfg);
	          animate$1 = getAnimate(type, coord, 'appear', animateCfg.animation);
	          if (common.isFunction(animate$1)) {
	            const shapes = geom.get('shapes');
	            common.each(shapes, shape => {
	              animate$1(shape, animateCfg, coord);
	            });
	          } else if (GROUP_ANIMATION[type]) { // do the default animation
	            animate$1 = groupAction[animateCfg.animation] || GROUP_ANIMATION[type](coord);

	            const yScale = geom.getYScale();
	            const zeroY = coord.convertPoint({
	              x: 0,
	              y: yScale.scale(geom.getYMinValue())
	            });

	            const container = geom.get('container');
	            animate$1 && animate$1(container, animateCfg, coord, zeroY);
	          }
	        }
	      });

	      // do the animation of components
	      common.each(componentShapes, shape => {
	        const animateCfg = shape.get('animateCfg');
	        const className = shape.get('className');
	        if (animateCfg && animateCfg.appear) { // if user configure
	          const defaultCfg = animate.getAnimateCfg(className, 'appear');
	          const appearCfg = common.deepMix({}, defaultCfg, animateCfg.appear);
	          const animate$1 = getAnimate(className, coord, 'appear', appearCfg.animation);
	          if (common.isFunction(animate$1)) {
	            animate$1(shape, appearCfg, coord);
	          }
	        }
	      });
	    }
	  },
	  afterCanvasDestroyed(/* chart */) {
	    timeline$1.stop();
	  }
	};

	/**
	 * Default, without interactins
	 */





	 // polar coordinate
	 // the axis for polar coordinate

	 // timeCat scale














	core.Animate = animate;
	// register plugins
	core.Chart.plugins.register([ tooltip$1, legend, guide, detail ]);

	var src = core;

	Component({
	  /**
	   * 组件的属性列表
	   */
	  properties: {
	    onInit: {
	      type: 'Function',
	      value: () => {}
	    }
	  },

	  /**
	   * 组件的初始数据
	   */
	  data: {

	  },

	  ready() {
	    const query = wx.createSelectorQuery().in(this);
	    query.select('.f2-canvas')
	      .fields({
	        node: true,
	        size: true
	      })
	      .exec(res => {
	        const { node, width, height } = res[0];
	        const context = node.getContext('2d');
	        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
	        // 高清设置
	        node.width = width * pixelRatio;
	        node.height = height * pixelRatio;

	        const config = { context, width, height, pixelRatio };
	        this.chart = this.data.onInit(src, config);
	      });
	  },

	  /**
	   * 组件的方法列表
	   */
	  methods: {
	    touchStart(e) {
	      if (this.chart) {
	        this.chart.get('el').dispatchEvent('touchstart', e);
	      }
	    },
	    touchMove(e) {
	      if (this.chart) {
	        this.chart.get('el').dispatchEvent('touchmove', e);
	      }
	    },
	    touchEnd(e) {
	      if (this.chart) {
	        this.chart.get('el').dispatchEvent('touchend', e);
	      }
	    }
	  }
	});

})));
