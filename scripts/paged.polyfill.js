/**
 * @license Paged.js v0.4.3 | MIT | https://gitlab.coko.foundation/pagedjs/pagedjs
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PagedPolyfill = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var eventEmitter = {exports: {}};

	var d$2 = {exports: {}};

	var isImplemented$6 = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
	};

	var isImplemented$5;
	var hasRequiredIsImplemented$1;

	function requireIsImplemented$1 () {
		if (hasRequiredIsImplemented$1) return isImplemented$5;
		hasRequiredIsImplemented$1 = 1;

		isImplemented$5 = function () {
			try {
				Object.keys("primitive");
				return true;
			} catch (e) {
		 return false;
		}
		};
		return isImplemented$5;
	}

	// eslint-disable-next-line no-empty-function
	var noop$4 = function () {};

	var _undefined = noop$4(); // Support ES3 engines

	var isValue$3 = function (val) {
	 return (val !== _undefined) && (val !== null);
	};

	var shim$5;
	var hasRequiredShim$5;

	function requireShim$5 () {
		if (hasRequiredShim$5) return shim$5;
		hasRequiredShim$5 = 1;

		var isValue = isValue$3;

		var keys = Object.keys;

		shim$5 = function (object) {
			return keys(isValue(object) ? Object(object) : object);
		};
		return shim$5;
	}

	var keys;
	var hasRequiredKeys;

	function requireKeys () {
		if (hasRequiredKeys) return keys;
		hasRequiredKeys = 1;

		keys = requireIsImplemented$1()()
			? Object.keys
			: requireShim$5();
		return keys;
	}

	var isValue$2 = isValue$3;

	var validValue = function (value) {
		if (!isValue$2(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};

	var shim$4;
	var hasRequiredShim$4;

	function requireShim$4 () {
		if (hasRequiredShim$4) return shim$4;
		hasRequiredShim$4 = 1;

		var keys  = requireKeys()
		  , value = validValue
		  , max   = Math.max;

		shim$4 = function (dest, src /*, …srcn*/) {
			var error, i, length = max(arguments.length, 2), assign;
			dest = Object(value(dest));
			assign = function (key) {
				try {
					dest[key] = src[key];
				} catch (e) {
					if (!error) error = e;
				}
			};
			for (i = 1; i < length; ++i) {
				src = arguments[i];
				keys(src).forEach(assign);
			}
			if (error !== undefined) throw error;
			return dest;
		};
		return shim$4;
	}

	var assign$2 = isImplemented$6()
		? Object.assign
		: requireShim$4();

	var isValue$1 = isValue$3;

	var forEach$1 = Array.prototype.forEach, create$5 = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	// eslint-disable-next-line no-unused-vars
	var normalizeOptions = function (opts1 /*, …options*/) {
		var result = create$5(null);
		forEach$1.call(arguments, function (options) {
			if (!isValue$1(options)) return;
			process(Object(options), result);
		});
		return result;
	};

	var isCallable$1 = function (obj) {
	 return typeof obj === "function";
	};

	var str = "razdwatrzy";

	var isImplemented$4 = function () {
		if (typeof str.contains !== "function") return false;
		return (str.contains("dwa") === true) && (str.contains("foo") === false);
	};

	var shim$3;
	var hasRequiredShim$3;

	function requireShim$3 () {
		if (hasRequiredShim$3) return shim$3;
		hasRequiredShim$3 = 1;

		var indexOf = String.prototype.indexOf;

		shim$3 = function (searchString/*, position*/) {
			return indexOf.call(this, searchString, arguments[1]) > -1;
		};
		return shim$3;
	}

	var contains$1 = isImplemented$4()
		? String.prototype.contains
		: requireShim$3();

	var assign$1        = assign$2
	  , normalizeOpts = normalizeOptions
	  , isCallable    = isCallable$1
	  , contains      = contains$1

	  , d$1;

	d$1 = d$2.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign$1(normalizeOpts(options), desc);
	};

	d$1.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign$1(normalizeOpts(options), desc);
	};

	var dExports = d$2.exports;

	var validCallable = function (fn) {
		if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
		return fn;
	};

	(function (module, exports) {

		var d        = dExports
		  , callable = validCallable

		  , apply = Function.prototype.apply, call = Function.prototype.call
		  , create = Object.create, defineProperty = Object.defineProperty
		  , defineProperties = Object.defineProperties
		  , hasOwnProperty = Object.prototype.hasOwnProperty
		  , descriptor = { configurable: true, enumerable: false, writable: true }

		  , on, once, off, emit, methods, descriptors, base;

		on = function (type, listener) {
			var data;

			callable(listener);

			if (!hasOwnProperty.call(this, '__ee__')) {
				data = descriptor.value = create(null);
				defineProperty(this, '__ee__', descriptor);
				descriptor.value = null;
			} else {
				data = this.__ee__;
			}
			if (!data[type]) data[type] = listener;
			else if (typeof data[type] === 'object') data[type].push(listener);
			else data[type] = [data[type], listener];

			return this;
		};

		once = function (type, listener) {
			var once, self;

			callable(listener);
			self = this;
			on.call(this, type, once = function () {
				off.call(self, type, once);
				apply.call(listener, this, arguments);
			});

			once.__eeOnceListener__ = listener;
			return this;
		};

		off = function (type, listener) {
			var data, listeners, candidate, i;

			callable(listener);

			if (!hasOwnProperty.call(this, '__ee__')) return this;
			data = this.__ee__;
			if (!data[type]) return this;
			listeners = data[type];

			if (typeof listeners === 'object') {
				for (i = 0; (candidate = listeners[i]); ++i) {
					if ((candidate === listener) ||
							(candidate.__eeOnceListener__ === listener)) {
						if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
						else listeners.splice(i, 1);
					}
				}
			} else {
				if ((listeners === listener) ||
						(listeners.__eeOnceListener__ === listener)) {
					delete data[type];
				}
			}

			return this;
		};

		emit = function (type) {
			var i, l, listener, listeners, args;

			if (!hasOwnProperty.call(this, '__ee__')) return;
			listeners = this.__ee__[type];
			if (!listeners) return;

			if (typeof listeners === 'object') {
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

				listeners = listeners.slice();
				for (i = 0; (listener = listeners[i]); ++i) {
					apply.call(listener, this, args);
				}
			} else {
				switch (arguments.length) {
				case 1:
					call.call(listeners, this);
					break;
				case 2:
					call.call(listeners, this, arguments[1]);
					break;
				case 3:
					call.call(listeners, this, arguments[1], arguments[2]);
					break;
				default:
					l = arguments.length;
					args = new Array(l - 1);
					for (i = 1; i < l; ++i) {
						args[i - 1] = arguments[i];
					}
					apply.call(listeners, this, args);
				}
			}
		};

		methods = {
			on: on,
			once: once,
			off: off,
			emit: emit
		};

		descriptors = {
			on: d(on),
			once: d(once),
			off: d(off),
			emit: d(emit)
		};

		base = defineProperties({}, descriptors);

		module.exports = exports = function (o) {
			return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
		};
		exports.methods = methods; 
	} (eventEmitter, eventEmitter.exports));

	var eventEmitterExports = eventEmitter.exports;
	var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventEmitterExports);

	/**
	 * Hooks allow for injecting functions that must all complete in order before finishing
	 * They will execute in parallel but all must finish before continuing
	 * Functions may return a promise if they are asycn.
	 * From epubjs/src/utils/hooks
	 * @param {any} context scope of this
	 * @example this.content = new Hook(this);
	 */
	class Hook {
		constructor(context){
			this.context = context || this;
			this.hooks = [];
		}

		/**
		 * Adds a function to be run before a hook completes
		 * @example this.content.register(function(){...});
		 * @return {undefined} void
		 */
		register(){
			for(var i = 0; i < arguments.length; ++i) {
				if (typeof arguments[i]  === "function") {
					this.hooks.push(arguments[i]);
				} else {
					// unpack array
					for(var j = 0; j < arguments[i].length; ++j) {
						this.hooks.push(arguments[i][j]);
					}
				}
			}
		}

		/**
		 * Triggers a hook to run all functions
		 * @example this.content.trigger(args).then(function(){...});
		 * @return {Promise} results
		 */
		trigger(){
			var args = arguments;
			var context = this.context;
			var promises = [];

			this.hooks.forEach(function(task) {
				var executing = task.apply(context, args);

				if(executing && typeof executing["then"] === "function") {
					// Task is a function that returns a promise
					promises.push(executing);
				} else {
					// Otherwise Task resolves immediately, add resolved promise with result
					promises.push(new Promise((resolve, reject) => {
						resolve(executing);
					}));
				}
			});


			return Promise.all(promises);
		}

		/**
	   * Triggers a hook to run all functions synchronously
	   * @example this.content.trigger(args).then(function(){...});
	   * @return {Array} results
	   */
		triggerSync(){
			var args = arguments;
			var context = this.context;
			var results = [];

			this.hooks.forEach(function(task) {
				var executing = task.apply(context, args);

				results.push(executing);
			});


			return results;
		}

		// Adds a function to be run before a hook completes
		list(){
			return this.hooks;
		}

		clear(){
			return this.hooks = [];
		}
	}

	function getBoundingClientRect(element) {
		if (!element) {
			return;
		}
		let rect;
		if (typeof element.getBoundingClientRect !== "undefined") {
			rect = element.getBoundingClientRect();
		} else {
			let range = document.createRange();
			range.selectNode(element);
			rect = range.getBoundingClientRect();
		}
		return rect;
	}

	function getClientRects(element) {
		if (!element) {
			return;
		}
		let rect;
		if (typeof element.getClientRects !== "undefined") {
			rect = element.getClientRects();
		} else {
			let range = document.createRange();
			range.selectNode(element);
			rect = range.getClientRects();
		}
		return rect;
	}

	/**
	 * Generates a UUID
	 * based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	 * @returns {string} uuid
	 */
	function UUID() {
		var d = new Date().getTime();
		if (typeof performance !== "undefined" && typeof performance.now === "function") {
			d += performance.now(); //use high-precision timer if available
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	function attr(element, attributes) {
		for (var i = 0; i < attributes.length; i++) {
			if (element.hasAttribute(attributes[i])) {
				return element.getAttribute(attributes[i]);
			}
		}
	}

	/* Based on by https://mths.be/cssescape v1.5.1 by @mathias | MIT license
	 * Allows # and .
	 */
	function querySelectorEscape(value) {
		if (arguments.length == 0) {
			throw new TypeError("`CSS.escape` requires an argument.");
		}
		var string = String(value);

		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = "";
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);



			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
			// (U+FFFD).
			if (codeUnit == 0x0000) {
				result += "\uFFFD";
				continue;
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index == 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit == 0x002D
				)
			) {
				// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
				result += "\\" + codeUnit.toString(16) + " ";
				continue;
			}

			if (
				// If the character is the first character and is a `-` (U+002D), and
				// there is no second character, […]
				index == 0 &&
				length == 1 &&
				codeUnit == 0x002D
			) {
				result += "\\" + string.charAt(index);
				continue;
			}

			// support for period character in id
			if (codeUnit == 0x002E) {
				if (string.charAt(0) == "#") {
					result += "\\.";
					continue;
				}
			}


			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit == 0x002D ||
				codeUnit == 0x005F ||
				codeUnit == 35 || // Allow #
				codeUnit == 46 || // Allow .
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// https://drafts.csswg.org/cssom/#escape-a-character
			result += "\\" + string.charAt(index);

		}
		return result;
	}

	/**
	 * Creates a new pending promise and provides methods to resolve or reject it.
	 * From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
	 * @returns {object} defered
	 */
	function defer() {
		this.resolve = null;

		this.reject = null;

		this.id = UUID();

		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
		Object.freeze(this);
	}

	const requestIdleCallback = typeof window !== "undefined" && ("requestIdleCallback" in window ? window.requestIdleCallback : window.requestAnimationFrame);

	function CSSValueToString(obj) {
		return obj.value + (obj.unit || "");
	}

	function isElement(node) {
		return node && node.nodeType === 1;
	}

	function isText(node) {
		return node && node.nodeType === 3;
	}

	function* walk$2(start, limiter) {
		let node = start;

		while (node) {

			yield node;

			if (node.childNodes.length) {
				node = node.firstChild;
			} else if (node.nextSibling) {
				if (limiter && node === limiter) {
					node = undefined;
					break;
				}
				node = node.nextSibling;
			} else {
				while (node) {
					node = node.parentNode;
					if (limiter && node === limiter) {
						node = undefined;
						break;
					}
					if (node && node.nextSibling) {
						node = node.nextSibling;
						break;
					}

				}
			}
		}
	}

	function nodeAfter(node, limiter) {
		if (limiter && node === limiter) {
			return;
		}
		let significantNode = nextSignificantNode(node);
		if (significantNode) {
			return significantNode;
		}
		if (node.parentNode) {
			while ((node = node.parentNode)) {
				if (limiter && node === limiter) {
					return;
				}
				significantNode = nextSignificantNode(node);
				if (significantNode) {
					return significantNode;
				}
			}
		}
	}

	function nodeBefore(node, limiter) {
		if (limiter && node === limiter) {
			return;
		}
		let significantNode = previousSignificantNode(node);
		if (significantNode) {
			return significantNode;
		}
		if (node.parentNode) {
			while ((node = node.parentNode)) {
				if (limiter && node === limiter) {
					return;
				}
				significantNode = previousSignificantNode(node);
				if (significantNode) {
					return significantNode;
				}
			}
		}
	}

	function elementAfter(node, limiter) {
		let after = nodeAfter(node, limiter);

		while (after && after.nodeType !== 1) {
			after = nodeAfter(after, limiter);
		}

		return after;
	}

	function elementBefore(node, limiter) {
		let before = nodeBefore(node, limiter);

		while (before && before.nodeType !== 1) {
			before = nodeBefore(before, limiter);
		}

		return before;
	}

	function displayedElementAfter(node, limiter) {
		let after = elementAfter(node, limiter);

		while (after && after.dataset.undisplayed) {
			after = elementAfter(after, limiter);
		}

		return after;
	}

	function displayedElementBefore(node, limiter) {
		let before = elementBefore(node, limiter);

		while (before && before.dataset.undisplayed) {
			before = elementBefore(before, limiter);
		}

		return before;
	}

	function rebuildAncestors(node) {
		let parent, ancestor;
		let ancestors = [];
		let added = [];

		let fragment = document.createDocumentFragment();

		// Handle rowspan on table
		if (node.nodeName === "TR") {
			let previousRow = node.previousElementSibling;
			let previousRowDistance = 1;
			while (previousRow) {
				// previous row has more columns, might indicate a rowspan.
				if (previousRow.childElementCount > node.childElementCount) {
					const initialColumns = Array.from(node.children);
					while (node.firstChild) {
						node.firstChild.remove();
					}
					let k = 0;
					for (let j = 0; j < previousRow.children.length; j++) {
						let column = previousRow.children[j];
						if (column.rowSpan && column.rowSpan > previousRowDistance) {
							const duplicatedColumn = column.cloneNode(true);
							// Adjust rowspan value
							duplicatedColumn.rowSpan = column.rowSpan - previousRowDistance;
							// Add the column to the row
							node.appendChild(duplicatedColumn);
						} else {
							// Fill the gap with the initial columns (if exists)
							const initialColumn = initialColumns[k++];
							// The initial column can be undefined if the newly created table has less columns than the original table
							if (initialColumn) {
								node.appendChild(initialColumn);
							}
						}
					}
				}
				previousRow = previousRow.previousElementSibling;
				previousRowDistance++;
			}
		}

		// Gather all ancestors
		let element = node;
		while(element.parentNode && element.parentNode.nodeType === 1) {
			ancestors.unshift(element.parentNode);
			element = element.parentNode;
		}

		for (var i = 0; i < ancestors.length; i++) {
			ancestor = ancestors[i];
			parent = ancestor.cloneNode(false);
		
			parent.setAttribute("data-split-from", parent.getAttribute("data-ref"));
			// ancestor.setAttribute("data-split-to", parent.getAttribute("data-ref"));

			if (parent.hasAttribute("id")) {
				let dataID = parent.getAttribute("id");
				parent.setAttribute("data-id", dataID);
				parent.removeAttribute("id");
			}

			// This is handled by css :not, but also tidied up here
			if (parent.hasAttribute("data-break-before")) {
				parent.removeAttribute("data-break-before");
			}

			if (parent.hasAttribute("data-previous-break-after")) {
				parent.removeAttribute("data-previous-break-after");
			}

			if (added.length) {
				let container = added[added.length-1];
				container.appendChild(parent);
			} else {
				fragment.appendChild(parent);
			}
			added.push(parent);

			// rebuild table rows
			if (parent.nodeName === "TD" && ancestor.parentElement.contains(ancestor)) {
				let td = ancestor;
				let prev = parent;
				while ((td = td.previousElementSibling)) {
					let sib = td.cloneNode(false);
					parent.parentElement.insertBefore(sib, prev);
					prev = sib;
				}
				
			}
		}

		added = undefined;
		return fragment;
	}
	/*
	export function split(bound, cutElement, breakAfter) {
			let needsRemoval = [];
			let index = indexOf(cutElement);

			if (!breakAfter && index === 0) {
				return;
			}

			if (breakAfter && index === (cutElement.parentNode.children.length - 1)) {
				return;
			}

			// Create a fragment with rebuilt ancestors
			let fragment = rebuildAncestors(cutElement);

			// Clone cut
			if (!breakAfter) {
				let clone = cutElement.cloneNode(true);
				let ref = cutElement.parentNode.getAttribute('data-ref');
				let parent = fragment.querySelector("[data-ref='" + ref + "']");
				parent.appendChild(clone);
				needsRemoval.push(cutElement);
			}

			// Remove all after cut
			let next = nodeAfter(cutElement, bound);
			while (next) {
				let clone = next.cloneNode(true);
				let ref = next.parentNode.getAttribute('data-ref');
				let parent = fragment.querySelector("[data-ref='" + ref + "']");
				parent.appendChild(clone);
				needsRemoval.push(next);
				next = nodeAfter(next, bound);
			}

			// Remove originals
			needsRemoval.forEach((node) => {
				if (node) {
					node.remove();
				}
			});

			// Insert after bounds
			bound.parentNode.insertBefore(fragment, bound.nextSibling);
			return [bound, bound.nextSibling];
	}
	*/

	function needsBreakBefore(node) {
		if( typeof node !== "undefined" &&
				typeof node.dataset !== "undefined" &&
				typeof node.dataset.breakBefore !== "undefined" &&
				(node.dataset.breakBefore === "always" ||
				 node.dataset.breakBefore === "page" ||
				 node.dataset.breakBefore === "left" ||
				 node.dataset.breakBefore === "right" ||
				 node.dataset.breakBefore === "recto" ||
				 node.dataset.breakBefore === "verso")
			 ) {
			return true;
		}

		return false;
	}

	function needsPreviousBreakAfter(node) {
		if( typeof node !== "undefined" &&
				typeof node.dataset !== "undefined" &&
				typeof node.dataset.previousBreakAfter !== "undefined" &&
				(node.dataset.previousBreakAfter === "always" ||
				 node.dataset.previousBreakAfter === "page" ||
				 node.dataset.previousBreakAfter === "left" ||
				 node.dataset.previousBreakAfter === "right" ||
				 node.dataset.previousBreakAfter === "recto" ||
				 node.dataset.previousBreakAfter === "verso")
			 ) {
			return true;
		}

		return false;
	}

	function needsPageBreak(node, previousSignificantNode) {
		if (typeof node === "undefined" || !previousSignificantNode || isIgnorable(node)) {
			return false;
		}
		if (node.dataset && node.dataset.undisplayed) {
			return false;
		}
		let previousSignificantNodePage = previousSignificantNode.dataset ? previousSignificantNode.dataset.page : undefined;
		if (typeof previousSignificantNodePage === "undefined") {
			const nodeWithNamedPage = getNodeWithNamedPage(previousSignificantNode);
			if (nodeWithNamedPage) {
				previousSignificantNodePage = nodeWithNamedPage.dataset.page;
			}
		}
		let currentNodePage = node.dataset ? node.dataset.page : undefined;
		if (typeof currentNodePage === "undefined") {
			const nodeWithNamedPage = getNodeWithNamedPage(node, previousSignificantNode);
			if (nodeWithNamedPage) {
				currentNodePage = nodeWithNamedPage.dataset.page;
			}
		}
		return currentNodePage !== previousSignificantNodePage;
	}

	function *words(node) {
		let currentText = node.nodeValue;
		let max = currentText.length;
		let currentOffset = 0;
		let currentLetter;

		let range;
		const significantWhitespaces = node.parentElement && node.parentElement.nodeName === "PRE";

		while (currentOffset < max) {
			currentLetter = currentText[currentOffset];
			if (/^[\S\u202F\u00A0]$/.test(currentLetter) || significantWhitespaces) {
				if (!range) {
					range = document.createRange();
					range.setStart(node, currentOffset);
				}
			} else {
				if (range) {
					range.setEnd(node, currentOffset);
					yield range;
					range = undefined;
				}
			}

			currentOffset += 1;
		}

		if (range) {
			range.setEnd(node, currentOffset);
			yield range;
		}
	}

	function *letters(wordRange) {
		let currentText = wordRange.startContainer;
		let max = currentText.length;
		let currentOffset = wordRange.startOffset;
		// let currentLetter;

		let range;

		while(currentOffset < max) {
			 // currentLetter = currentText[currentOffset];
			 range = document.createRange();
			 range.setStart(currentText, currentOffset);
			 range.setEnd(currentText, currentOffset+1);

			 yield range;

			 currentOffset += 1;
		}
	}

	function isContainer(node) {
		let container;

		if (typeof node.tagName === "undefined") {
			return true;
		}

		if (node.style && node.style.display === "none") {
			return false;
		}

		switch (node.tagName) {
			// Inline
			case "A":
			case "ABBR":
			case "ACRONYM":
			case "B":
			case "BDO":
			case "BIG":
			case "BR":
			case "BUTTON":
			case "CITE":
			case "CODE":
			case "DFN":
			case "EM":
			case "I":
			case "IMG":
			case "INPUT":
			case "KBD":
			case "LABEL":
			case "MAP":
			case "OBJECT":
			case "Q":
			case "SAMP":
			case "SCRIPT":
			case "SELECT":
			case "SMALL":
			case "SPAN":
			case "STRONG":
			case "SUB":
			case "SUP":
			case "TEXTAREA":
			case "TIME":
			case "TT":
			case "VAR":
			case "P":
			case "H1":
			case "H2":
			case "H3":
			case "H4":
			case "H5":
			case "H6":
			case "FIGCAPTION":
			case "BLOCKQUOTE":
			case "PRE":
			case "LI":
			case "TD":
			case "DT":
			case "DD":
			case "VIDEO":
			case "CANVAS":
				container = false;
				break;
			default:
				container = true;
		}

		return container;
	}

	function cloneNode(n, deep=false) {
		return n.cloneNode(deep);
	}

	function findElement(node, doc, forceQuery) {
		const ref = node.getAttribute("data-ref");
		return findRef(ref, doc, forceQuery);
	}

	function findRef(ref, doc, forceQuery) {
		if (!forceQuery && doc.indexOfRefs && doc.indexOfRefs[ref]) {
			return doc.indexOfRefs[ref];
		} else {
			return doc.querySelector(`[data-ref='${ref}']`);
		}
	}

	function validNode(node) {
		if (isText(node)) {
			return true;
		}

		if (isElement(node) && node.dataset.ref) {
			return true;
		}

		return false;
	}

	function prevValidNode(node) {
		while (!validNode(node)) {
			if (node.previousSibling) {
				node = node.previousSibling;
			} else {
				node = node.parentNode;
			}

			if (!node) {
				break;
			}
		}

		return node;
	}


	function indexOf$2(node) {
		let parent = node.parentNode;
		if (!parent) {
			return 0;
		}
		return Array.prototype.indexOf.call(parent.childNodes, node);
	}

	function child(node, index) {
		return node.childNodes[index];
	}

	function hasContent(node) {
		if (isElement(node)) {
			return true;
		} else if (isText(node) &&
				node.textContent.trim().length) {
			return true;
		}
		return false;
	}

	function indexOfTextNode(node, parent) {
		if (!isText(node)) {
			return -1;
		}
		let nodeTextContent = node.textContent;
		let child;
		let index = -1;
		for (var i = 0; i < parent.childNodes.length; i++) {
			child = parent.childNodes[i];
			if (child.nodeType === 3) {
				let text = parent.childNodes[i].textContent;
				if (text.includes(nodeTextContent)) {
					index = i;
					break;
				}
			}
		}

		return index;
	}


	/**
	 * Throughout, whitespace is defined as one of the characters
	 *  "\t" TAB \u0009
	 *  "\n" LF  \u000A
	 *  "\r" CR  \u000D
	 *  " "  SPC \u0020
	 *
	 * This does not use Javascript's "\s" because that includes non-breaking
	 * spaces (and also some other characters).
	 */

	/**
	 * Determine if a node should be ignored by the iterator functions.
	 * taken from https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace#Whitespace_helper_functions
	 *
	 * @param {Node} node An object implementing the DOM1 |Node| interface.
	 * @return {boolean} true if the node is:
	 *  1) A |Text| node that is all whitespace
	 *  2) A |Comment| node
	 *  and otherwise false.
	 */
	function isIgnorable(node) {
		return (node.nodeType === 8) || // A comment node
			((node.nodeType === 3) && isAllWhitespace(node)); // a text node, all whitespace
	}

	/**
	 * Determine whether a node's text content is entirely whitespace.
	 *
	 * @param {Node} node  A node implementing the |CharacterData| interface (i.e., a |Text|, |Comment|, or |CDATASection| node
	 * @return {boolean} true if all of the text content of |nod| is whitespace, otherwise false.
	 */
	function isAllWhitespace(node) {
		return !(/[^\t\n\r ]/.test(node.textContent));
	}

	/**
	 * Version of |previousSibling| that skips nodes that are entirely
	 * whitespace or comments.  (Normally |previousSibling| is a property
	 * of all DOM nodes that gives the sibling node, the node that is
	 * a child of the same parent, that occurs immediately before the
	 * reference node.)
	 *
	 * @param {ChildNode} sib  The reference node.
	 * @return {Node|null} Either:
	 *  1) The closest previous sibling to |sib| that is not ignorable according to |is_ignorable|, or
	 *  2) null if no such node exists.
	 */
	function previousSignificantNode(sib) {
		while ((sib = sib.previousSibling)) {
			if (!isIgnorable(sib)) return sib;
		}
		return null;
	}

	function getNodeWithNamedPage(node, limiter) {
		if (node && node.dataset && node.dataset.page) {
			return node;
		}
		if (node.parentNode) {
			while ((node = node.parentNode)) {
				if (limiter && node === limiter) {
					return;
				}
				if (node.dataset && node.dataset.page) {
					return node;
				}
			}
		}
		return null;
	}

	function breakInsideAvoidParentNode(node) {
		while ((node = node.parentNode)) {
			if (node && node.dataset && node.dataset.breakInside === "avoid") {
				return node;
			}
		}
		return null;
	}

	/**
	 * Find a parent with a given node name.
	 * @param {Node} node - initial Node
	 * @param {string} nodeName - node name (eg. "TD", "TABLE", "STRONG"...)
	 * @param {Node} limiter - go up to the parent until there's no more parent or the current node is equals to the limiter
	 * @returns {Node|undefined} - Either:
	 *  1) The closest parent for a the given node name, or
	 *  2) undefined if no such node exists.
	 */
	function parentOf(node, nodeName, limiter) {
		if (limiter && node === limiter) {
			return;
		}
		if (node.parentNode) {
			while ((node = node.parentNode)) {
				if (limiter && node === limiter) {
					return;
				}
				if (node.nodeName === nodeName) {
					return node;
				}
			}
		}
	}

	/**
	 * Version of |nextSibling| that skips nodes that are entirely
	 * whitespace or comments.
	 *
	 * @param {ChildNode} sib  The reference node.
	 * @return {Node|null} Either:
	 *  1) The closest next sibling to |sib| that is not ignorable according to |is_ignorable|, or
	 *  2) null if no such node exists.
	 */
	function nextSignificantNode(sib) {
		while ((sib = sib.nextSibling)) {
			if (!isIgnorable(sib)) return sib;
		}
		return null;
	}

	function filterTree(content, func, what) {
		const treeWalker = document.createTreeWalker(
			content || this.dom,
			what || NodeFilter.SHOW_ALL,
			func ? { acceptNode: func } : null,
			false
		);

		let node;
		let current;
		node = treeWalker.nextNode();
		while(node) {
			current = node;
			node = treeWalker.nextNode();
			current.parentNode.removeChild(current);
		}
	}

	/**
	 * BreakToken
	 * @class
	 */
	class BreakToken {

		constructor(node, offset) {
			this.node = node;
			this.offset = offset;
		}

		equals(otherBreakToken) {
			if (!otherBreakToken) {
				return false;
			}
			if (this["node"] && otherBreakToken["node"] &&
				this["node"] !== otherBreakToken["node"]) {
				return false;
			}
			if (this["offset"] && otherBreakToken["offset"] &&
				this["offset"] !== otherBreakToken["offset"]) {
				return false;
			}
			return true;
		}

		toJSON(hash) {
			let node;
			let index = 0;
			if (!this.node) {
				return {};
			}
			if (isElement(this.node) && this.node.dataset.ref) {
				node = this.node.dataset.ref;
			} else if (hash) {
				node = this.node.parentElement.dataset.ref;
			}

			if (this.node.parentElement) {
				const children = Array.from(this.node.parentElement.childNodes);
				index = children.indexOf(this.node);
			}

			return JSON.stringify({
				"node": node,
				"index" : index,
				"offset": this.offset
			});
		}

	}

	/**
	 * Render result.
	 * @class
	 */
	class RenderResult {

		constructor(breakToken, error) {
			this.breakToken = breakToken;
			this.error = error;
		}
	}

	class OverflowContentError extends Error {
		constructor(message, items) {
			super(message);
			this.items = items;
		}
	}

	const MAX_CHARS_PER_BREAK = 1500;

	/**
	 * Layout
	 * @class
	 */
	class Layout {

		constructor(element, hooks, options) {
			this.element = element;

			this.bounds = this.element.getBoundingClientRect();
			this.parentBounds = this.element.offsetParent.getBoundingClientRect();
			let gap = parseFloat(window.getComputedStyle(this.element).columnGap);
		
			if (gap) {
				let leftMargin = this.bounds.left - this.parentBounds.left;
				this.gap =  gap - leftMargin;	
			} else {
				this.gap = 0;
			}

			if (hooks) {
				this.hooks = hooks;
			} else {
				this.hooks = {};
				this.hooks.onPageLayout = new Hook();
				this.hooks.layout = new Hook();
				this.hooks.renderNode = new Hook();
				this.hooks.layoutNode = new Hook();
				this.hooks.beforeOverflow = new Hook();
				this.hooks.onOverflow = new Hook();
				this.hooks.afterOverflowRemoved = new Hook();
				this.hooks.onBreakToken = new Hook();
				this.hooks.beforeRenderResult = new Hook();
			}

			this.settings = options || {};

			this.maxChars = this.settings.maxChars || MAX_CHARS_PER_BREAK;
			this.forceRenderBreak = false;
		}

		async renderTo(wrapper, source, breakToken, bounds = this.bounds) {
			let start = this.getStart(source, breakToken);
			let walker = walk$2(start, source);

			let node;
			let prevNode;
			let done;
			let next;

			let hasRenderedContent = false;
			let newBreakToken;

			let length = 0;

			let prevBreakToken = breakToken || new BreakToken(start);

			this.hooks && this.hooks.onPageLayout.trigger(wrapper, prevBreakToken, this);

			while (!done && !newBreakToken) {
				next = walker.next();
				prevNode = node;
				node = next.value;
				done = next.done;

				if (!node) {
					this.hooks && this.hooks.layout.trigger(wrapper, this);

					let imgs = wrapper.querySelectorAll("img");
					if (imgs.length) {
						await this.waitForImages(imgs);
					}

					newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken);

					if (newBreakToken && newBreakToken.equals(prevBreakToken)) {
						console.warn("Unable to layout item: ", prevNode);
						this.hooks && this.hooks.beforeRenderResult.trigger(undefined, wrapper, this);
						return new RenderResult(undefined, new OverflowContentError("Unable to layout item", [prevNode]));
					}

					this.rebuildTableFromBreakToken(newBreakToken, wrapper);

					this.hooks && this.hooks.beforeRenderResult.trigger(newBreakToken, wrapper, this);
					return new RenderResult(newBreakToken);
				}

				this.hooks && this.hooks.layoutNode.trigger(node);

				// Check if the rendered element has a break set
				if (hasRenderedContent && this.shouldBreak(node, start)) {
					this.hooks && this.hooks.layout.trigger(wrapper, this);

					let imgs = wrapper.querySelectorAll("img");
					if (imgs.length) {
						await this.waitForImages(imgs);
					}

					newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken);

					if (!newBreakToken) {
						newBreakToken = this.breakAt(node);
					} else {
						this.rebuildTableFromBreakToken(newBreakToken, wrapper);
					}

					if (newBreakToken && newBreakToken.equals(prevBreakToken)) {
						console.warn("Unable to layout item: ", node);
						let after = newBreakToken.node && nodeAfter(newBreakToken.node);
						if (after) {
							newBreakToken = new BreakToken(after);
						} else {
							return new RenderResult(undefined, new OverflowContentError("Unable to layout item", [node]));
						}
					}

					length = 0;

					break;
				}

				if (node.dataset && node.dataset.page) {
					let named = node.dataset.page;
					let page = this.element.closest(".pagedjs_page");
					page.classList.add("pagedjs_named_page");
					page.classList.add("pagedjs_" + named + "_page");

					if (!node.dataset.splitFrom) {
						page.classList.add("pagedjs_" + named + "_first_page");
					}
				}

				// Should the Node be a shallow or deep clone
				let shallow = isContainer(node);

				let rendered = this.append(node, wrapper, breakToken, shallow);

				length += rendered.textContent.length;

				// Check if layout has content yet
				if (!hasRenderedContent) {
					hasRenderedContent = hasContent(node);
				}

				// Skip to the next node if a deep clone was rendered
				if (!shallow) {
					walker = walk$2(nodeAfter(node, source), source);
				}

				if (this.forceRenderBreak) {
					this.hooks && this.hooks.layout.trigger(wrapper, this);

					newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken);

					if (!newBreakToken) {
						newBreakToken = this.breakAt(node);
					} else {
						this.rebuildTableFromBreakToken(newBreakToken, wrapper);
					}

					length = 0;
					this.forceRenderBreak = false;

					break;
				}

				// Only check x characters
				if (length >= this.maxChars) {

					this.hooks && this.hooks.layout.trigger(wrapper, this);

					let imgs = wrapper.querySelectorAll("img");
					if (imgs.length) {
						await this.waitForImages(imgs);
					}

					newBreakToken = this.findBreakToken(wrapper, source, bounds, prevBreakToken);

					if (newBreakToken) {
						length = 0;
						this.rebuildTableFromBreakToken(newBreakToken, wrapper);
					}

					if (newBreakToken && newBreakToken.equals(prevBreakToken)) {
						console.warn("Unable to layout item: ", node);
						let after = newBreakToken.node && nodeAfter(newBreakToken.node);
						if (after) {
							newBreakToken = new BreakToken(after);
						} else {
							this.hooks && this.hooks.beforeRenderResult.trigger(undefined, wrapper, this);
							return new RenderResult(undefined, new OverflowContentError("Unable to layout item", [node]));
						}
					}
				}

			}

			this.hooks && this.hooks.beforeRenderResult.trigger(newBreakToken, wrapper, this);
			return new RenderResult(newBreakToken);
		}

		breakAt(node, offset = 0) {
			let newBreakToken = new BreakToken(
				node,
				offset
			);
			let breakHooks = this.hooks.onBreakToken.triggerSync(newBreakToken, undefined, node, this);
			breakHooks.forEach((newToken) => {
				if (typeof newToken != "undefined") {
					newBreakToken = newToken;
				}
			});

			return newBreakToken;
		}

		shouldBreak(node, limiter) {
			let previousNode = nodeBefore(node, limiter);
			let parentNode = node.parentNode;
			let parentBreakBefore = needsBreakBefore(node) && parentNode && !previousNode && needsBreakBefore(parentNode);
			let doubleBreakBefore;

			if (parentBreakBefore) {
				doubleBreakBefore = node.dataset.breakBefore === parentNode.dataset.breakBefore;
			}

			return !doubleBreakBefore && needsBreakBefore(node) || needsPreviousBreakAfter(node) || needsPageBreak(node, previousNode);
		}

		forceBreak() {
			this.forceRenderBreak = true;
		}

		getStart(source, breakToken) {
			let start;
			let node = breakToken && breakToken.node;

			if (node) {
				start = node;
			} else {
				start = source.firstChild;
			}

			return start;
		}

		append(node, dest, breakToken, shallow = true, rebuild = true) {

			let clone = cloneNode(node, !shallow);

			if (node.parentNode && isElement(node.parentNode)) {
				let parent = findElement(node.parentNode, dest);
				// Rebuild chain
				if (parent) {
					parent.appendChild(clone);
				} else if (rebuild) {
					let fragment = rebuildAncestors(node);
					parent = findElement(node.parentNode, fragment);
					if (!parent) {
						dest.appendChild(clone);
					} else if (breakToken && isText(breakToken.node) && breakToken.offset > 0) {
						clone.textContent = clone.textContent.substring(breakToken.offset);
						parent.appendChild(clone);
					} else {
						parent.appendChild(clone);
					}

					dest.appendChild(fragment);
				} else {
					dest.appendChild(clone);
				}


			} else {
				dest.appendChild(clone);
			}

			if (clone.dataset && clone.dataset.ref) {
				if (!dest.indexOfRefs) {
					dest.indexOfRefs = {};
				}
				dest.indexOfRefs[clone.dataset.ref] = clone;
			}

			let nodeHooks = this.hooks.renderNode.triggerSync(clone, node, this);
			nodeHooks.forEach((newNode) => {
				if (typeof newNode != "undefined") {
					clone = newNode;
				}
			});

			return clone;
		}

		rebuildTableFromBreakToken(breakToken, dest) {
			if (!breakToken || !breakToken.node) {
				return;
			}
			let node = breakToken.node;
			let td = isElement(node) ? node.closest("td") : node.parentElement.closest("td");
			if (td) {
				let rendered = findElement(td, dest, true);
				if (!rendered) {
					return;
				}
				while ((td = td.nextElementSibling)) {
					this.append(td, dest, null, true);
				}
			}
		}

		async waitForImages(imgs) {
			let results = Array.from(imgs).map(async (img) => {
				return this.awaitImageLoaded(img);
			});
			await Promise.all(results);
		}

		async awaitImageLoaded(image) {
			return new Promise(resolve => {
				if (image.complete !== true) {
					image.onload = function () {
						let {width, height} = window.getComputedStyle(image);
						resolve(width, height);
					};
					image.onerror = function (e) {
						let {width, height} = window.getComputedStyle(image);
						resolve(width, height, e);
					};
				} else {
					let {width, height} = window.getComputedStyle(image);
					resolve(width, height);
				}
			});
		}

		avoidBreakInside(node, limiter) {
			let breakNode;

			if (node === limiter) {
				return;
			}

			while (node.parentNode) {
				node = node.parentNode;

				if (node === limiter) {
					break;
				}

				if (window.getComputedStyle(node)["break-inside"] === "avoid") {
					breakNode = node;
					break;
				}

			}
			return breakNode;
		}

		createBreakToken(overflow, rendered, source) {
			let container = overflow.startContainer;
			let offset = overflow.startOffset;
			let node, renderedNode, parent, index, temp;

			if (isElement(container)) {
				temp = child(container, offset);

				if (isElement(temp)) {
					renderedNode = findElement(temp, rendered);

					if (!renderedNode) {
						// Find closest element with data-ref
						let prevNode = prevValidNode(temp);
						if (!isElement(prevNode)) {
							prevNode = prevNode.parentElement;
						}
						renderedNode = findElement(prevNode, rendered);
						// Check if temp is the last rendered node at its level.
						if (!temp.nextSibling) {
							// We need to ensure that the previous sibling of temp is fully rendered.
							const renderedNodeFromSource = findElement(renderedNode, source);
							const walker = document.createTreeWalker(renderedNodeFromSource, NodeFilter.SHOW_ELEMENT);
							const lastChildOfRenderedNodeFromSource = walker.lastChild();
							const lastChildOfRenderedNodeMatchingFromRendered = findElement(lastChildOfRenderedNodeFromSource, rendered);
							// Check if we found that the last child in source
							if (!lastChildOfRenderedNodeMatchingFromRendered) {
								// Pending content to be rendered before virtual break token
								return;
							}
							// Otherwise we will return a break token as per below
						}
						// renderedNode is actually the last unbroken box that does not overflow.
						// Break Token is therefore the next sibling of renderedNode within source node.
						node = findElement(renderedNode, source).nextSibling;
						offset = 0;
					} else {
						node = findElement(renderedNode, source);
						offset = 0;
					}
				} else {
					renderedNode = findElement(container, rendered);

					if (!renderedNode) {
						renderedNode = findElement(prevValidNode(container), rendered);
					}

					parent = findElement(renderedNode, source);
					index = indexOfTextNode(temp, parent);
					// No seperatation for the first textNode of an element
					if(index === 0) {
						node = parent;
						offset = 0;
					} else {
						node = child(parent, index);
						offset = 0;
					}
				}
			} else {
				renderedNode = findElement(container.parentNode, rendered);

				if (!renderedNode) {
					renderedNode = findElement(prevValidNode(container.parentNode), rendered);
				}

				parent = findElement(renderedNode, source);
				index = indexOfTextNode(container, parent);

				if (index === -1) {
					return;
				}

				node = child(parent, index);

				offset += node.textContent.indexOf(container.textContent);
			}

			if (!node) {
				return;
			}

			return new BreakToken(
				node,
				offset
			);

		}

		findBreakToken(rendered, source, bounds = this.bounds, prevBreakToken, extract = true) {
			let overflow = this.findOverflow(rendered, bounds);
			let breakToken, breakLetter;

			let overflowHooks = this.hooks.onOverflow.triggerSync(overflow, rendered, bounds, this);
			overflowHooks.forEach((newOverflow) => {
				if (typeof newOverflow != "undefined") {
					overflow = newOverflow;
				}
			});

			if (overflow) {
				breakToken = this.createBreakToken(overflow, rendered, source);
				// breakToken is nullable
				let breakHooks = this.hooks.onBreakToken.triggerSync(breakToken, overflow, rendered, this);
				breakHooks.forEach((newToken) => {
					if (typeof newToken != "undefined") {
						breakToken = newToken;
					}
				});

				// Stop removal if we are in a loop
				if (breakToken && breakToken.equals(prevBreakToken)) {
					return breakToken;
				}

				if (breakToken && breakToken["node"] && breakToken["offset"] && breakToken["node"].textContent) {
					breakLetter = breakToken["node"].textContent.charAt(breakToken["offset"]);
				} else {
					breakLetter = undefined;
				}

				if (breakToken && breakToken.node && extract) {
					let removed = this.removeOverflow(overflow, breakLetter);
					this.hooks && this.hooks.afterOverflowRemoved.trigger(removed, rendered, this);
				}

			}
			return breakToken;
		}

		hasOverflow(element, bounds = this.bounds) {
			let constrainingElement = element && element.parentNode; // this gets the element, instead of the wrapper for the width workaround
			let {width, height} = element.getBoundingClientRect();
			let scrollWidth = constrainingElement ? constrainingElement.scrollWidth : 0;
			let scrollHeight = constrainingElement ? constrainingElement.scrollHeight : 0;
			return Math.max(Math.floor(width), scrollWidth) > Math.round(bounds.width) ||
				Math.max(Math.floor(height), scrollHeight) > Math.round(bounds.height);
		}

		findOverflow(rendered, bounds = this.bounds, gap = this.gap) {
			if (!this.hasOverflow(rendered, bounds)) return;

			let start = Math.floor(bounds.left);
			let end = Math.round(bounds.right + gap);
			let vStart = Math.round(bounds.top);
			let vEnd = Math.round(bounds.bottom);
			let range;

			let walker = walk$2(rendered.firstChild, rendered);

			// Find Start
			let next, done, node, offset, skip, breakAvoid, prev, br;
			while (!done) {
				next = walker.next();
				done = next.done;
				node = next.value;
				skip = false;
				breakAvoid = false;
				prev = undefined;
				br = undefined;

				if (node) {
					let pos = getBoundingClientRect(node);
					let left = Math.round(pos.left);
					let right = Math.floor(pos.right);
					let top = Math.round(pos.top);
					let bottom = Math.floor(pos.bottom);

					if (!range && (left >= end || top >= vEnd)) {
						// Check if it is a float
						let isFloat = false;

						// Check if the node is inside a break-inside: avoid table cell
						const insideTableCell = parentOf(node, "TD", rendered);
						if (insideTableCell && window.getComputedStyle(insideTableCell)["break-inside"] === "avoid") {
							// breaking inside a table cell produces unexpected result, as a workaround, we forcibly avoid break inside in a cell.
							// But we take the whole row, not just the cell that is causing the break.
							prev = insideTableCell.parentElement;
						} else if (isElement(node)) {
							let styles = window.getComputedStyle(node);
							isFloat = styles.getPropertyValue("float") !== "none";
							skip = styles.getPropertyValue("break-inside") === "avoid";
							breakAvoid = node.dataset.breakBefore === "avoid" || node.dataset.previousBreakAfter === "avoid";
							prev = breakAvoid && nodeBefore(node, rendered);
							br = node.tagName === "BR" || node.tagName === "WBR";
						}

						let tableRow;
						if (node.nodeName === "TR") {
							tableRow = node;
						} else {
							tableRow = parentOf(node, "TR", rendered);
						}
						if (tableRow) {
							// honor break-inside="avoid" in parent tbody/thead
							let container = tableRow.parentElement;
							if (["T
