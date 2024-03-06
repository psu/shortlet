
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * Fuse.js v5.2.3 - Lightweight fuzzy-search (http://fusejs.io)
     *
     * Copyright (c) 2020 Kiro Risk (http://kiro.me)
     * All Rights Reserved. Apache Software License 2.0
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     */

    const INFINITY = 1 / 0;

    const isArray = (value) =>
      !Array.isArray
        ? Object.prototype.toString.call(value) === '[object Array]'
        : Array.isArray(value);

    // Adapted from:
    // https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js
    const baseToString = (value) => {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value
      }
      let result = value + '';
      return result == '0' && 1 / value == -INFINITY ? '-0' : result
    };

    const toString = (value) => (value == null ? '' : baseToString(value));

    const isString = (value) => typeof value === 'string';

    const isNumber = (value) => typeof value === 'number';

    const isDefined = (value) => value !== undefined && value !== null;

    const isBlank = (value) => !value.trim().length;

    function get(obj, path) {
      let list = [];
      let arr = false;

      const _get = (obj, path) => {
        if (!path) {
          // If there's no path left, we've gotten to the object we care about.
          list.push(obj);
        } else {
          const dotIndex = path.indexOf('.');

          let key = path;
          let remaining = null;

          if (dotIndex !== -1) {
            key = path.slice(0, dotIndex);
            remaining = path.slice(dotIndex + 1);
          }

          const value = obj[key];

          if (isDefined(value)) {
            if (!remaining && (isString(value) || isNumber(value))) {
              list.push(toString(value));
            } else if (isArray(value)) {
              arr = true;
              // Search each item in the array.
              for (let i = 0, len = value.length; i < len; i += 1) {
                _get(value[i], remaining);
              }
            } else if (remaining) {
              // An object. Recurse further.
              _get(value, remaining);
            }
          }
        }
      };

      _get(obj, path);

      if (arr) {
        return list
      }

      return list[0]
    }

    const MatchOptions = {
      // Whether the matches should be included in the result set. When true, each record in the result
      // set will include the indices of the matched characters.
      // These can consequently be used for highlighting purposes.
      includeMatches: false,
      // When true, the matching function will continue to the end of a search pattern even if
      // a perfect match has already been located in the string.
      findAllMatches: false,
      // Minimum number of characters that must be matched before a result is considered a match
      minMatchCharLength: 1
    };

    const BasicOptions = {
      // When true, the algorithm continues searching to the end of the input even if a perfect
      // match is found before the end of the same input.
      isCaseSensitive: false,
      // When true, the matching function will continue to the end of a search pattern even if
      includeScore: false,
      // List of properties that will be searched. This also supports nested properties.
      keys: [],
      // Whether to sort the result list, by score
      shouldSort: true,
      // Default sort function: sort by ascending score, ascending index
      sortFn: (a, b) =>
        a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
    };

    const FuzzyOptions = {
      // Approximately where in the text is the pattern expected to be found?
      location: 0,
      // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
      // (of both letters and location), a threshold of '1.0' would match anything.
      threshold: 0.6,
      // Determines how close the match must be to the fuzzy location (specified above).
      // An exact letter match which is 'distance' characters away from the fuzzy location
      // would score as a complete mismatch. A distance of '0' requires the match be at
      // the exact location specified, a threshold of '1000' would require a perfect match
      // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
      distance: 100
    };

    const AdvancedOptions = {
      // When true, it enables the use of unix-like search commands
      useExtendedSearch: false,
      // The get function to use when fetching an object's properties.
      // The default will search nested paths *ie foo.bar.baz*
      getFn: get
    };

    var Config = {
      ...BasicOptions,
      ...MatchOptions,
      ...FuzzyOptions,
      ...AdvancedOptions
    };

    function computeScore(
      pattern,
      {
        errors = 0,
        currentLocation = 0,
        expectedLocation = 0,
        distance = Config.distance
      } = {}
    ) {
      const accuracy = errors / pattern.length;
      const proximity = Math.abs(expectedLocation - currentLocation);

      if (!distance) {
        // Dodge divide by zero error.
        return proximity ? 1.0 : accuracy
      }

      return accuracy + proximity / distance
    }

    function convertMaskToIndices(
      matchmask = [],
      minMatchCharLength = Config.minMatchCharLength
    ) {
      let matchedIndices = [];
      let start = -1;
      let end = -1;
      let i = 0;

      for (let len = matchmask.length; i < len; i += 1) {
        let match = matchmask[i];
        if (match && start === -1) {
          start = i;
        } else if (!match && start !== -1) {
          end = i - 1;
          if (end - start + 1 >= minMatchCharLength) {
            matchedIndices.push([start, end]);
          }
          start = -1;
        }
      }

      // (i-1 - start) + 1 => i - start
      if (matchmask[i - 1] && i - start >= minMatchCharLength) {
        matchedIndices.push([start, i - 1]);
      }

      return matchedIndices
    }

    // Machine word size
    const MAX_BITS = 32;

    function search(
      text,
      pattern,
      patternAlphabet,
      {
        location = Config.location,
        distance = Config.distance,
        threshold = Config.threshold,
        findAllMatches = Config.findAllMatches,
        minMatchCharLength = Config.minMatchCharLength,
        includeMatches = Config.includeMatches
      } = {}
    ) {
      if (pattern.length > MAX_BITS) {
        throw new Error(`Pattern length exceeds max of ${MAX_BITS}.`)
      }

      const patternLen = pattern.length;
      // Set starting location at beginning text and initialize the alphabet.
      const textLen = text.length;
      // Handle the case when location > text.length
      const expectedLocation = Math.max(0, Math.min(location, textLen));
      // Highest score beyond which we give up.
      let currentThreshold = threshold;
      // Is there a nearby exact match? (speedup)
      let bestLocation = expectedLocation;

      // A mask of the matches, used for building the indices
      const matchMask = [];

      if (includeMatches) {
        for (let i = 0; i < textLen; i += 1) {
          matchMask[i] = 0;
        }
      }

      let index;

      // Get all exact matches, here for speed up
      while ((index = text.indexOf(pattern, bestLocation)) > -1) {
        let score = computeScore(pattern, {
          currentLocation: index,
          expectedLocation,
          distance
        });

        currentThreshold = Math.min(score, currentThreshold);
        bestLocation = index + patternLen;

        if (includeMatches) {
          let i = 0;
          while (i < patternLen) {
            matchMask[index + i] = 1;
            i += 1;
          }
        }
      }

      // Reset the best location
      bestLocation = -1;

      let lastBitArr = [];
      let finalScore = 1;
      let binMax = patternLen + textLen;

      const mask = 1 << (patternLen <= MAX_BITS - 1 ? patternLen - 1 : MAX_BITS - 2);

      for (let i = 0; i < patternLen; i += 1) {
        // Scan for the best match; each iteration allows for one more error.
        // Run a binary search to determine how far from the match location we can stray
        // at this error level.
        let binMin = 0;
        let binMid = binMax;

        while (binMin < binMid) {
          const score = computeScore(pattern, {
            errors: i,
            currentLocation: expectedLocation + binMid,
            expectedLocation,
            distance
          });

          if (score <= currentThreshold) {
            binMin = binMid;
          } else {
            binMax = binMid;
          }

          binMid = Math.floor((binMax - binMin) / 2 + binMin);
        }

        // Use the result from this iteration as the maximum for the next.
        binMax = binMid;

        let start = Math.max(1, expectedLocation - binMid + 1);
        let finish = findAllMatches
          ? textLen
          : Math.min(expectedLocation + binMid, textLen) + patternLen;

        // Initialize the bit array
        let bitArr = Array(finish + 2);

        bitArr[finish + 1] = (1 << i) - 1;

        for (let j = finish; j >= start; j -= 1) {
          let currentLocation = j - 1;
          let charMatch = patternAlphabet[text.charAt(currentLocation)];

          if (charMatch && includeMatches) {
            matchMask[currentLocation] = 1;
          }

          // First pass: exact match
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

          // Subsequent passes: fuzzy match
          if (i !== 0) {
            bitArr[j] |=
              ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
          }

          if (bitArr[j] & mask) {
            finalScore = computeScore(pattern, {
              errors: i,
              currentLocation,
              expectedLocation,
              distance
            });

            // This match will almost certainly be better than any existing match.
            // But check anyway.
            if (finalScore <= currentThreshold) {
              // Indeed it is
              currentThreshold = finalScore;
              bestLocation = currentLocation;

              // Already passed `loc`, downhill from here on in.
              if (bestLocation <= expectedLocation) {
                break
              }

              // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
              start = Math.max(1, 2 * expectedLocation - bestLocation);
            }
          }
        }

        // No hope for a (better) match at greater error levels.
        const score = computeScore(pattern, {
          errors: i + 1,
          currentLocation: expectedLocation,
          expectedLocation,
          distance
        });

        if (score > currentThreshold) {
          break
        }

        lastBitArr = bitArr;
      }

      let result = {
        isMatch: bestLocation >= 0,
        // Count exact matches (those with a score of 0) to be "almost" exact
        score: !finalScore ? 0.001 : finalScore
      };

      if (includeMatches) {
        result.matchedIndices = convertMaskToIndices(matchMask, minMatchCharLength);
      }

      return result
    }

    function createPatternAlphabet(pattern) {
      let mask = {};
      let len = pattern.length;

      for (let i = 0; i < len; i += 1) {
        mask[pattern.charAt(i)] = 0;
      }

      for (let i = 0; i < len; i += 1) {
        mask[pattern.charAt(i)] |= 1 << (len - i - 1);
      }

      return mask
    }

    class BitapSearch {
      constructor(
        pattern,
        {
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance,
          includeMatches = Config.includeMatches,
          findAllMatches = Config.findAllMatches,
          minMatchCharLength = Config.minMatchCharLength,
          isCaseSensitive = Config.isCaseSensitive
        } = {}
      ) {
        this.options = {
          location,
          threshold,
          distance,
          includeMatches,
          findAllMatches,
          minMatchCharLength,
          isCaseSensitive
        };

        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

        this.chunks = [];

        let index = 0;
        while (index < this.pattern.length) {
          let pattern = this.pattern.substring(index, index + MAX_BITS);
          this.chunks.push({
            pattern,
            alphabet: createPatternAlphabet(pattern)
          });
          index += MAX_BITS;
        }
      }

      searchIn(value) {
        let text = value.$;
        return this.searchInString(text)
      }

      searchInString(text) {
        const { isCaseSensitive, includeMatches } = this.options;

        if (!isCaseSensitive) {
          text = text.toLowerCase();
        }

        // Exact match
        if (this.pattern === text) {
          let result = {
            isMatch: true,
            score: 0
          };

          if (includeMatches) {
            result.matchedIndices = [[0, text.length - 1]];
          }

          return result
        }

        // Otherwise, use Bitap algorithm
        const {
          location,
          distance,
          threshold,
          findAllMatches,
          minMatchCharLength
        } = this.options;

        let allMatchedIndices = [];
        let totalScore = 0;
        let hasMatches = false;

        for (let i = 0, len = this.chunks.length; i < len; i += 1) {
          let { pattern, alphabet } = this.chunks[i];

          let result = search(text, pattern, alphabet, {
            location: location + MAX_BITS * i,
            distance,
            threshold,
            findAllMatches,
            minMatchCharLength,
            includeMatches
          });

          const { isMatch, score, matchedIndices } = result;

          if (isMatch) {
            hasMatches = true;
          }

          totalScore += score;

          if (isMatch && matchedIndices) {
            allMatchedIndices = [...allMatchedIndices, ...matchedIndices];
          }
        }

        let result = {
          isMatch: hasMatches,
          score: hasMatches ? totalScore / this.chunks.length : 1
        };

        if (hasMatches && includeMatches) {
          result.matchedIndices = allMatchedIndices;
        }

        return result
      }
    }

    class BaseMatch {
      constructor(pattern) {
        this.pattern = pattern;
      }
      static isMultiMatch(pattern) {
        return getMatch(pattern, this.multiRegex)
      }
      static isSingleMatch(pattern) {
        return getMatch(pattern, this.singleRegex)
      }
      search(/*text*/) {}
    }

    function getMatch(pattern, exp) {
      const matches = pattern.match(exp);
      return matches ? matches[1] : null
    }

    // Token: 'file

    class ExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'exact'
      }
      static get multiRegex() {
        return /^'"(.*)"$/
      }
      static get singleRegex() {
        return /^'(.*)$/
      }
      search(text) {
        let location = 0;
        let index;

        const matchedIndices = [];
        const patternLen = this.pattern.length;

        // Get all exact matches
        while ((index = text.indexOf(this.pattern, location)) > -1) {
          location = index + patternLen;
          matchedIndices.push([index, location - 1]);
        }

        const isMatch = !!matchedIndices.length;

        return {
          isMatch,
          score: isMatch ? 1 : 0,
          matchedIndices
        }
      }
    }

    // Token: !fire

    class InverseExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-exact'
      }
      static get multiRegex() {
        return /^!"(.*)"$/
      }
      static get singleRegex() {
        return /^!(.*)$/
      }
      search(text) {
        const index = text.indexOf(this.pattern);
        const isMatch = index === -1;

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          matchedIndices: [0, text.length - 1]
        }
      }
    }

    // Token: ^file

    class PrefixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'prefix-exact'
      }
      static get multiRegex() {
        return /^\^"(.*)"$/
      }
      static get singleRegex() {
        return /^\^(.*)$/
      }
      search(text) {
        const isMatch = text.startsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          matchedIndices: [0, this.pattern.length - 1]
        }
      }
    }

    // Token: !^fire

    class InversePrefixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-prefix-exact'
      }
      static get multiRegex() {
        return /^!\^"(.*)"$/
      }
      static get singleRegex() {
        return /^!\^(.*)$/
      }
      search(text) {
        const isMatch = !text.startsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          matchedIndices: [0, text.length - 1]
        }
      }
    }

    // Token: .file$

    class SuffixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'suffix-exact'
      }
      static get multiRegex() {
        return /^"(.*)"\$$/
      }
      static get singleRegex() {
        return /^(.*)\$$/
      }
      search(text) {
        const isMatch = text.endsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          matchedIndices: [text.length - this.pattern.length, text.length - 1]
        }
      }
    }

    // Token: !.file$

    class InverseSuffixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-suffix-exact'
      }
      static get multiRegex() {
        return /^!"(.*)"\$$/
      }
      static get singleRegex() {
        return /^!(.*)\$$/
      }
      search(text) {
        const isMatch = !text.endsWith(this.pattern);
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          matchedIndices: [0, text.length - 1]
        }
      }
    }

    class FuzzyMatch extends BaseMatch {
      constructor(
        pattern,
        {
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance,
          includeMatches = Config.includeMatches,
          findAllMatches = Config.findAllMatches,
          minMatchCharLength = Config.minMatchCharLength,
          isCaseSensitive = Config.isCaseSensitive
        } = {}
      ) {
        super(pattern);
        this._bitapSearch = new BitapSearch(pattern, {
          location,
          threshold,
          distance,
          includeMatches,
          findAllMatches,
          minMatchCharLength,
          isCaseSensitive
        });
      }
      static get type() {
        return 'fuzzy'
      }
      static get multiRegex() {
        return /^"(.*)"$/
      }
      static get singleRegex() {
        return /^(.*)$/
      }
      search(text) {
        return this._bitapSearch.searchInString(text)
      }
    }

    // ❗Order is important. DO NOT CHANGE.
    const searchers = [
      ExactMatch,
      PrefixExactMatch,
      InversePrefixExactMatch,
      InverseSuffixExactMatch,
      SuffixExactMatch,
      InverseExactMatch,
      FuzzyMatch
    ];

    const searchersLen = searchers.length;

    // Regex to split by spaces, but keep anything in quotes together
    const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
    const OR_TOKEN = '|';

    // Return a 2D array representation of the query, for simpler parsing.
    // Example:
    // "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
    function parseQuery(pattern, options = {}) {
      return pattern.split(OR_TOKEN).map((item) => {
        let query = item
          .trim()
          .split(SPACE_RE)
          .filter((item) => item && !!item.trim());

        let results = [];
        for (let i = 0, len = query.length; i < len; i += 1) {
          const queryItem = query[i];

          // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
          let found = false;
          let idx = -1;
          while (!found && ++idx < searchersLen) {
            const searcher = searchers[idx];
            let token = searcher.isMultiMatch(queryItem);
            if (token) {
              results.push(new searcher(token, options));
              found = true;
            }
          }

          if (found) {
            continue
          }

          // 2. Handle single query matches (i.e, once that are *not* quoted)
          idx = -1;
          while (++idx < searchersLen) {
            const searcher = searchers[idx];
            let token = searcher.isSingleMatch(queryItem);
            if (token) {
              results.push(new searcher(token, options));
              break
            }
          }
        }

        return results
      })
    }

    // These extended matchers can return an array of matches, as opposed
    // to a singl match
    const MultiMatchSet = new Set([FuzzyMatch.type, ExactMatch.type]);

    /**
     * Command-like searching
     * ======================
     *
     * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
     * search in a given text.
     *
     * Search syntax:
     *
     * | Token       | Match type                 | Description                            |
     * | ----------- | -------------------------- | -------------------------------------- |
     * | `jscript`   | fuzzy-match                | Items that match `jscript`             |
     * | `'python`   | exact-match                | Items that include `python`            |
     * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
     * | `^java`     | prefix-exact-match         | Items that start with `java`           |
     * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
     * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
     * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
     *
     * A single pipe character acts as an OR operator. For example, the following
     * query matches entries that start with `core` and end with either`go`, `rb`,
     * or`py`.
     *
     * ```
     * ^core go$ | rb$ | py$
     * ```
     */
    class ExtendedSearch {
      constructor(
        pattern,
        {
          isCaseSensitive = Config.isCaseSensitive,
          includeMatches = Config.includeMatches,
          minMatchCharLength = Config.minMatchCharLength,
          findAllMatches = Config.findAllMatches,
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance
        } = {}
      ) {
        this.query = null;
        this.options = {
          isCaseSensitive,
          includeMatches,
          minMatchCharLength,
          findAllMatches,
          location,
          threshold,
          distance
        };

        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        this.query = parseQuery(this.pattern, this.options);
      }

      static condition(_, options) {
        return options.useExtendedSearch
      }

      searchIn(value) {
        const query = this.query;

        if (!query) {
          return {
            isMatch: false,
            score: 1
          }
        }

        let text = value.$;

        const { includeMatches, isCaseSensitive } = this.options;

        text = isCaseSensitive ? text : text.toLowerCase();

        let numMatches = 0;
        let indices = [];
        let totalScore = 0;

        // ORs
        for (let i = 0, qLen = query.length; i < qLen; i += 1) {
          const searchers = query[i];

          // Reset indices
          indices.length = 0;
          numMatches = 0;

          // ANDs
          for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
            const searcher = searchers[j];
            const { isMatch, matchedIndices, score } = searcher.search(text);

            if (isMatch) {
              numMatches += 1;
              totalScore += score;
              if (includeMatches) {
                const type = searcher.constructor.type;
                if (MultiMatchSet.has(type)) {
                  indices = [...indices, ...matchedIndices];
                } else {
                  indices.push(matchedIndices);
                }
              }
            } else {
              totalScore = 0;
              numMatches = 0;
              indices.length = 0;
              break
            }
          }

          // OR condition, so if TRUE, return
          if (numMatches) {
            let result = {
              isMatch: true,
              score: totalScore / numMatches
            };

            if (includeMatches) {
              result.matchedIndices = indices;
            }

            return result
          }
        }

        // Nothing was matched
        return {
          isMatch: false,
          score: 1
        }
      }
    }

    const SPACE = /[^ ]+/g;

    function createIndex(keys, list, { getFn = Config.getFn } = {}) {
      let indexedList = [];

      // List is Array<String>
      if (isString(list[0])) {
        // Iterate over every string in the list
        for (let i = 0, len = list.length; i < len; i += 1) {
          const value = list[i];

          if (isDefined(value) && !isBlank(value)) {
            let record = {
              $: value,
              idx: i,
              t: value.match(SPACE).length
            };

            indexedList.push(record);
          }
        }
      } else {
        // List is Array<Object>
        const keysLen = keys.length;

        for (let i = 0, len = list.length; i < len; i += 1) {
          let item = list[i];

          let record = { idx: i, $: {} };

          // Iterate over every key (i.e, path), and fetch the value at that key
          for (let j = 0; j < keysLen; j += 1) {
            let key = keys[j];
            let value = getFn(item, key);

            if (!isDefined(value)) {
              continue
            }

            if (isArray(value)) {
              let subRecords = [];
              const stack = [{ arrayIndex: -1, value }];

              while (stack.length) {
                const { arrayIndex, value } = stack.pop();

                if (!isDefined(value)) {
                  continue
                }

                if (isString(value) && !isBlank(value)) {
                  let subRecord = {
                    $: value,
                    idx: arrayIndex,
                    t: value.match(SPACE).length
                  };
                  subRecords.push(subRecord);
                } else if (isArray(value)) {
                  for (let k = 0, arrLen = value.length; k < arrLen; k += 1) {
                    stack.push({
                      arrayIndex: k,
                      value: value[k]
                    });
                  }
                }
              }
              record.$[key] = subRecords;
            } else if (!isBlank(value)) {
              let subRecord = {
                $: value,
                t: value.match(SPACE).length
              };

              record.$[key] = subRecord;
            }
          }

          indexedList.push(record);
        }
      }

      return indexedList
    }

    class KeyStore {
      constructor(keys) {
        this._keys = {};
        this._keyNames = [];
        this._length = keys.length;

        // Iterate over every key
        if (keys.length && isString(keys[0])) {
          for (let i = 0; i < this._length; i += 1) {
            const key = keys[i];
            this._keys[key] = {
              weight: 1
            };
            this._keyNames.push(key);
          }
        } else {
          let totalWeight = 0;

          for (let i = 0; i < this._length; i += 1) {
            const key = keys[i];

            if (!Object.prototype.hasOwnProperty.call(key, 'name')) {
              throw new Error('Missing "name" property in key object')
            }

            const keyName = key.name;
            this._keyNames.push(keyName);

            if (!Object.prototype.hasOwnProperty.call(key, 'weight')) {
              throw new Error('Missing "weight" property in key object')
            }

            const weight = key.weight;

            if (weight <= 0 || weight >= 1) {
              throw new Error(
                '"weight" property in key must be in the range of (0, 1)'
              )
            }

            this._keys[keyName] = {
              weight
            };

            totalWeight += weight;
          }

          // Normalize weights so that their sum is equal to 1
          for (let i = 0; i < this._length; i += 1) {
            const keyName = this._keyNames[i];
            const keyWeight = this._keys[keyName].weight;
            this._keys[keyName].weight = keyWeight / totalWeight;
          }
        }
      }
      get(key, name) {
        return this._keys[key] ? this._keys[key][name] : -1
      }
      keys() {
        return this._keyNames
      }
      count() {
        return this._length
      }
      toJSON() {
        return JSON.stringify(this._keys)
      }
    }

    function transformMatches(result, data) {
      const matches = result.matches;
      data.matches = [];

      if (!isDefined(matches)) {
        return
      }

      for (let i = 0, len = matches.length; i < len; i += 1) {
        let match = matches[i];

        if (!isDefined(match.indices) || match.indices.length === 0) {
          continue
        }

        let obj = {
          indices: match.indices,
          value: match.value
        };

        if (match.key) {
          obj.key = match.key;
        }

        if (match.idx > -1) {
          obj.refIndex = match.idx;
        }

        data.matches.push(obj);
      }
    }

    function transformScore(result, data) {
      data.score = result.score;
    }

    const registeredSearchers = [];

    function register(...args) {
      registeredSearchers.push(...args);
    }

    class Fuse {
      constructor(list, options = {}, index = null) {
        this.options = { ...Config, ...options };

        this._processKeys(this.options.keys);
        this.setCollection(list, index);
      }

      setCollection(list, index = null) {
        this.list = list;
        this.listIsStringArray = isString(list[0]);

        if (index) {
          this.setIndex(index);
        } else {
          this.setIndex(this._createIndex());
        }
      }

      setIndex(listIndex) {
        this._indexedList = listIndex;
      }

      _processKeys(keys) {
        this._keyStore = new KeyStore(keys);
      }

      _createIndex() {
        return createIndex(this._keyStore.keys(), this.list, {
          getFn: this.options.getFn
        })
      }

      search(pattern, opts = { limit: false }) {
        pattern = pattern.trim();

        if (!pattern.length) {
          return []
        }

        const { shouldSort } = this.options;

        let searcher = null;

        for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
          let searcherClass = registeredSearchers[i];
          if (searcherClass.condition(pattern, this.options)) {
            searcher = new searcherClass(pattern, this.options);
            break
          }
        }

        if (!searcher) {
          searcher = new BitapSearch(pattern, this.options);
        }

        let results = this._searchUsing(searcher);

        this._computeScore(results);

        if (shouldSort) {
          this._sort(results);
        }

        if (opts.limit && isNumber(opts.limit)) {
          results = results.slice(0, opts.limit);
        }

        return this._format(results)
      }

      _searchUsing(searcher) {
        const list = this._indexedList;
        const results = [];
        const { includeMatches } = this.options;

        // List is Array<String>
        if (this.listIsStringArray) {
          // Iterate over every string in the list
          for (let i = 0, len = list.length; i < len; i += 1) {
            let value = list[i];
            let { $: text, idx, t } = value;

            if (!isDefined(text)) {
              continue
            }

            let searchResult = searcher.searchIn(value);

            const { isMatch, score } = searchResult;

            if (!isMatch) {
              continue
            }

            let match = { score, value: text, t };

            if (includeMatches) {
              match.indices = searchResult.matchedIndices;
            }

            results.push({
              item: text,
              idx,
              matches: [match]
            });
          }
        } else {
          // List is Array<Object>
          const keyNames = this._keyStore.keys();
          const keysLen = this._keyStore.count();

          for (let i = 0, len = list.length; i < len; i += 1) {
            let { $: item, idx } = list[i];

            if (!isDefined(item)) {
              continue
            }

            let matches = [];

            // Iterate over every key (i.e, path), and fetch the value at that key
            for (let j = 0; j < keysLen; j += 1) {
              let key = keyNames[j];
              let value = item[key];

              if (!isDefined(value)) {
                continue
              }

              if (isArray(value)) {
                for (let k = 0, len = value.length; k < len; k += 1) {
                  let arrItem = value[k];
                  const { $: text, idx, t } = arrItem;

                  if (!isDefined(text)) {
                    continue
                  }

                  let searchResult = searcher.searchIn(arrItem);

                  const { isMatch, score } = searchResult;

                  if (!isMatch) {
                    continue
                  }

                  let match = { score, key, value: text, idx, t };

                  if (includeMatches) {
                    match.indices = searchResult.matchedIndices;
                  }

                  matches.push(match);
                }
              } else {
                const { $: text, t } = value;

                let searchResult = searcher.searchIn(value);

                const { isMatch, score } = searchResult;

                if (!isMatch) {
                  continue
                }

                let match = { score, key, value: text, t };

                if (includeMatches) {
                  match.indices = searchResult.matchedIndices;
                }

                matches.push(match);
              }
            }

            if (matches.length) {
              results.push({
                idx,
                item,
                matches
              });
            }
          }
        }

        return results
      }

      // Practical scoring function
      _computeScore(results) {
        const resultsLen = results.length;

        for (let i = 0; i < resultsLen; i += 1) {
          const result = results[i];
          const matches = result.matches;
          const numMatches = matches.length;

          let totalScore = 1;

          for (let j = 0; j < numMatches; j += 1) {
            const match = matches[j];
            const { key, t } = match;

            const keyWeight = this._keyStore.get(key, 'weight');
            const weight = keyWeight > -1 ? keyWeight : 1;
            const score =
              match.score === 0 && keyWeight > -1 ? Number.EPSILON : match.score;

            // Field-length norm: the shorter the field, the higher the weight.
            const norm = 1 / Math.sqrt(t);

            totalScore *= Math.pow(score, weight * norm);
          }

          result.score = totalScore;
        }
      }

      _sort(results) {
        results.sort(this.options.sortFn);
      }

      _format(results) {
        const finalOutput = [];

        const { includeMatches, includeScore } = this.options;

        let transformers = [];

        if (includeMatches) transformers.push(transformMatches);
        if (includeScore) transformers.push(transformScore);

        for (let i = 0, len = results.length; i < len; i += 1) {
          const result = results[i];
          const { idx } = result;

          const data = {
            item: this.list[idx],
            refIndex: idx
          };

          if (transformers.length) {
            for (let j = 0, len = transformers.length; j < len; j += 1) {
              transformers[j](result, data);
            }
          }

          finalOutput.push(data);
        }

        return finalOutput
      }
    }

    register(ExtendedSearch);

    Fuse.version = '5.2.3';
    Fuse.createIndex = createIndex;
    Fuse.config = Config;

    /* src/PaletteContainer.svelte generated by Svelte v3.55.1 */

    const file$4 = "src/PaletteContainer.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-bvn01s", ".modal-container.svelte-bvn01s{max-width:400px;margin-top:0px;margin-left:auto;margin-right:auto;padding:0px;transition:all 0.3s ease;font-family:Helvetica, Arial, sans-serif}@media(max-width: 400px){.modal-container.svelte-bvn01s{max-width:100%}}.modal-mask.svelte-bvn01s{position:fixed;z-index:9998;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.5);display:table;transition:opacity 0.3s ease}.modal-wrapper.svelte-bvn01s{display:table-cell;width:100%}.hidden.svelte-bvn01s{display:none}.search-box.svelte-bvn01s{padding:7px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZUNvbnRhaW5lci5zdmVsdGUiLCJzb3VyY2VzIjpbIlBhbGV0dGVDb250YWluZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+ZXhwb3J0IGxldCBzaG93ID0gZmFsc2U7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAubW9kYWwtY29udGFpbmVyIHtcbiAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgcGFkZGluZzogMHB4O1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgZm9udC1mYW1pbHk6IEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG4gIH1cblxuICBAbWVkaWEgKG1heC13aWR0aDogNDAwcHgpIHtcbiAgICAubW9kYWwtY29udGFpbmVyIHtcbiAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICB9XG4gIH1cblxuICAubW9kYWwtbWFzayB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHotaW5kZXg6IDk5OTg7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICBkaXNwbGF5OiB0YWJsZTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZTtcbiAgfVxuXG4gIC5tb2RhbC13cmFwcGVyIHtcbiAgICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG4gIC5oaWRkZW4ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cblxuICAuc2VhcmNoLWJveCB7XG4gICAgcGFkZGluZzogN3B4O1xuICB9XG4gIC8qIC5zZWFyY2g6Zm9jdXMge1xuICBjb2xvcjogd2hpdGU7XG59ICovXG48L3N0eWxlPlxuXG48ZGl2IGNsYXNzPVwibW9kYWwtbWFza1wiIGNsYXNzOmhpZGRlbj17IXNob3d9PlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtYm94XCI+XG4gICAgICAgIDxzbG90IG5hbWU9XCJzZWFyY2hcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8c2xvdCBuYW1lPVwiaXRlbXNcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUUsZ0JBQWdCLGNBQUMsQ0FBQyxBQUNoQixTQUFTLENBQUUsS0FBSyxDQUNoQixVQUFVLENBQUUsR0FBRyxDQUNmLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLE9BQU8sQ0FBRSxHQUFHLENBQ1osVUFBVSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUN6QixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxBQUMzQyxDQUFDLEFBRUQsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUN6QixnQkFBZ0IsY0FBQyxDQUFDLEFBQ2hCLFNBQVMsQ0FBRSxJQUFJLEFBQ2pCLENBQUMsQUFDSCxDQUFDLEFBRUQsV0FBVyxjQUFDLENBQUMsQUFDWCxRQUFRLENBQUUsS0FBSyxDQUNmLE9BQU8sQ0FBRSxJQUFJLENBQ2IsR0FBRyxDQUFFLENBQUMsQ0FDTixJQUFJLENBQUUsQ0FBQyxDQUNQLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixnQkFBZ0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxPQUFPLENBQUUsS0FBSyxDQUNkLFVBQVUsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQUFDL0IsQ0FBQyxBQUVELGNBQWMsY0FBQyxDQUFDLEFBQ2QsT0FBTyxDQUFFLFVBQVUsQ0FDbkIsS0FBSyxDQUFFLElBQUksQUFDYixDQUFDLEFBQ0QsT0FBTyxjQUFDLENBQUMsQUFDUCxPQUFPLENBQUUsSUFBSSxBQUNmLENBQUMsQUFFRCxXQUFXLGNBQUMsQ0FBQyxBQUNYLE9BQU8sQ0FBRSxHQUFHLEFBQ2QsQ0FBQyJ9 */");
    }

    const get_items_slot_changes = dirty => ({});
    const get_items_slot_context = ctx => ({});
    const get_search_slot_changes = dirty => ({});
    const get_search_slot_context = ctx => ({});

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const search_slot_template = /*#slots*/ ctx[2].search;
    	const search_slot = create_slot(search_slot_template, ctx, /*$$scope*/ ctx[1], get_search_slot_context);
    	const items_slot_template = /*#slots*/ ctx[2].items;
    	const items_slot = create_slot(items_slot_template, ctx, /*$$scope*/ ctx[1], get_items_slot_context);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (search_slot) search_slot.c();
    			t = space();
    			div1 = element("div");
    			if (items_slot) items_slot.c();
    			attr_dev(div0, "class", "search-box svelte-bvn01s");
    			add_location(div0, file$4, 51, 6, 886);
    			add_location(div1, file$4, 54, 6, 961);
    			attr_dev(div2, "class", "modal-container svelte-bvn01s");
    			add_location(div2, file$4, 50, 4, 850);
    			attr_dev(div3, "class", "modal-wrapper svelte-bvn01s");
    			add_location(div3, file$4, 49, 2, 818);
    			attr_dev(div4, "class", "modal-mask svelte-bvn01s");
    			toggle_class(div4, "hidden", !/*show*/ ctx[0]);
    			add_location(div4, file$4, 48, 0, 770);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);

    			if (search_slot) {
    				search_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (items_slot) {
    				items_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (search_slot) {
    				if (search_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						search_slot,
    						search_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(search_slot_template, /*$$scope*/ ctx[1], dirty, get_search_slot_changes),
    						get_search_slot_context
    					);
    				}
    			}

    			if (items_slot) {
    				if (items_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						items_slot,
    						items_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(items_slot_template, /*$$scope*/ ctx[1], dirty, get_items_slot_changes),
    						get_items_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*show*/ 1) {
    				toggle_class(div4, "hidden", !/*show*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search_slot, local);
    			transition_in(items_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search_slot, local);
    			transition_out(items_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (search_slot) search_slot.d(detaching);
    			if (items_slot) items_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaletteContainer', slots, ['search','items']);
    	let { show = false } = $$props;
    	const writable_props = ['show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaletteContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ show });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, $$scope, slots];
    }

    class PaletteContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { show: 0 }, add_css$3);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaletteContainer",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get show() {
    		throw new Error("<PaletteContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<PaletteContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CommandList.svelte generated by Svelte v3.55.1 */
    const file$3 = "src/CommandList.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-132pd9f", ".item.svelte-132pd9f{display:flex;align-items:center;justify-content:space-between;margin:0px;padding:0px 7px;height:36px}.item.svelte-132pd9f:hover{cursor:pointer}kyb.svelte-132pd9f{padding:1px 4px;border-radius:6px;font-family:monospace}.items-list.svelte-132pd9f{overflow-y:auto;max-height:min(360px, 50vh);max-height:min(360px, 80dvh);overscroll-behavior:contain}.no-matches.svelte-132pd9f{margin:5px 0px;padding:0px 7px}.symbol.svelte-132pd9f{padding:0 1px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZExpc3Quc3ZlbHRlIiwic291cmNlcyI6WyJDb21tYW5kTGlzdC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBsYW5nPVwidHNcIj5pbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XG5jb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xuZXhwb3J0IGxldCBpdGVtcyA9IFtdO1xuZXhwb3J0IGxldCBzZWxlY3RlZEluZGV4ID0gMDtcbmV4cG9ydCBsZXQgbm9NYXRjaGVzID0gJyc7XG5sZXQgc2VsZWN0ZWRJbmRleExhc3QgPSAwO1xubGV0IGxpc3RFbDtcbmZ1bmN0aW9uIGNsaWNrZWRJbmRleChlLCBob3ZlckluZGV4KSB7XG4gICAgY29uc3QgaXNQcmltYXJ5QnV0dG9uID0gZS53aGljaCA9PT0gMTtcbiAgICBpZiAoIWlzUHJpbWFyeUJ1dHRvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRpc3BhdGNoKFwiY2xpY2tlZEluZGV4XCIsIGhvdmVySW5kZXgpO1xufVxuZnVuY3Rpb24gY2hlY2tTZWxlY3RlZEluZGV4SW5WaWV3KCkge1xuICAgIGlmICghbGlzdEVsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGlzdEl0ZW1FbCA9IGxpc3RFbC5xdWVyeVNlbGVjdG9yKFwiLml0ZW1zLWxpc3QgLnNlbGVjdGVkXCIpO1xuICAgIGlmICghbGlzdEl0ZW1FbCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzUHJlc3NpbmdEb3duQXJyb3cgPSAwIDwgc2VsZWN0ZWRJbmRleCAtIHNlbGVjdGVkSW5kZXhMYXN0O1xuICAgIHNlbGVjdGVkSW5kZXhMYXN0ID0gc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBpc1ByZXNzaW5nVXBBcnJvdyA9ICFpc1ByZXNzaW5nRG93bkFycm93O1xuICAgIGNvbnN0IHZpZXdUb3AgPSBsaXN0RWwuc2Nyb2xsVG9wICsgMzY7XG4gICAgY29uc3Qgdmlld0JvdHRvbSA9IGxpc3RFbC5zY3JvbGxUb3AgKyBsaXN0RWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IGl0ZW1Ub3AgPSBsaXN0SXRlbUVsLm9mZnNldFRvcCAtIDg7XG4gICAgY29uc3Qgdmlld1RvcElkZWFsUHJlc3NpbmdEb3duID0gaXRlbVRvcCAtIGxpc3RFbC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3Qgdmlld1RvcElkZWFsUHJlc3NpbmdVcCA9IGl0ZW1Ub3AgLSAzNjtcbiAgICBjb25zdCBpc1dpdGhpblZpZXcgPSBpdGVtVG9wIDw9IHZpZXdCb3R0b20gJiYgaXRlbVRvcCA+PSB2aWV3VG9wO1xuICAgIGlmIChpc1dpdGhpblZpZXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzc2luZ0Rvd25BcnJvdykge1xuICAgICAgICBsaXN0RWwuc2Nyb2xsVG9wID0gdmlld1RvcElkZWFsUHJlc3NpbmdEb3duO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzc2luZ1VwQXJyb3cpIHtcbiAgICAgICAgbGlzdEVsLnNjcm9sbFRvcCA9IHZpZXdUb3BJZGVhbFByZXNzaW5nVXA7XG4gICAgfVxufVxuJDoge1xuICAgIGlmIChzZWxlY3RlZEluZGV4TGFzdCAhPSBzZWxlY3RlZEluZGV4KVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNoZWNrU2VsZWN0ZWRJbmRleEluVmlldygpKTtcbn1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5pdGVtIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIG1hcmdpbjogMHB4O1xuICAgIHBhZGRpbmc6IDBweCA3cHg7XG4gICAgaGVpZ2h0OiAzNnB4O1xuICB9XG4gIC5pdGVtOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbiAga3liIHtcbiAgICBwYWRkaW5nOiAxcHggNHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICB9XG4gIC5pdGVtcy1saXN0IHtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIG1heC1oZWlnaHQ6IG1pbigzNjBweCwgNTB2aCk7XG4gICAgbWF4LWhlaWdodDogbWluKDM2MHB4LCA4MGR2aCk7XG4gICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcbiAgfVxuICAubm8tbWF0Y2hlcyB7XG4gICAgbWFyZ2luOiA1cHggMHB4O1xuICAgIHBhZGRpbmc6IDBweCA3cHg7XG4gIH1cbiAgLnN5bWJvbCB7XG4gICAgcGFkZGluZzogMCAxcHg7XG4gIH1cbjwvc3R5bGU+XG5cbjxkaXYgY2xhc3M9XCJpdGVtcy1saXN0XCIgYmluZDp0aGlzPXtsaXN0RWx9PlxuICB7I2lmICFpdGVtcy5sZW5ndGh9IFxuICAgIDxwIGNsYXNzPVwibm8tbWF0Y2hlc1wiPntub01hdGNoZXN9PC9wPlxuICB7L2lmfVxuICB7I2VhY2ggaXRlbXMgYXMgaXRlbSwgaW5kZXh9XG4gICAgPHBcbiAgICAgIGNsYXNzPVwiaXRlbVwiXG4gICAgICBjbGFzczpzZWxlY3RlZD17aW5kZXggPT0gc2VsZWN0ZWRJbmRleH1cbiAgICAgIG9uOm1vdXNlZG93bj17ZSA9PiBjbGlja2VkSW5kZXgoZSwgaW5kZXgpfT5cbiAgICAgIDxzcGFuPntpdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgeyNpZiAhIWl0ZW0uc2hvcnRjdXR9XG4gICAgICAgIDxreWI+XG4gICAgICAgICAgeyNpZiAhIWl0ZW0uc3ltYm9sc31cbiAgICAgICAgICAgIHsjZWFjaCBpdGVtLnN5bWJvbHMgYXMgc3ltYm9sfVxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN5bWJvbFwiPntzeW1ib2x9PC9zcGFuPlxuICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgIHtpdGVtLnNob3J0Y3V0fVxuICAgICAgICAgIHsvaWZ9XG4gICAgICAgIDwva3liPlxuICAgICAgezplbHNlfVxuICAgICAgICA8c3BhbiAvPlxuICAgICAgey9pZn1cbiAgICA8L3A+XG4gIHsvZWFjaH1cbjwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWdERSxLQUFLLGVBQUMsQ0FBQyxBQUNMLE9BQU8sQ0FBRSxJQUFJLENBQ2IsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsZUFBZSxDQUFFLGFBQWEsQ0FDOUIsTUFBTSxDQUFFLEdBQUcsQ0FDWCxPQUFPLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FDaEIsTUFBTSxDQUFFLElBQUksQUFDZCxDQUFDLEFBQ0Qsb0JBQUssTUFBTSxBQUFDLENBQUMsQUFDWCxNQUFNLENBQUUsT0FBTyxBQUNqQixDQUFDLEFBQ0QsR0FBRyxlQUFDLENBQUMsQUFDSCxPQUFPLENBQUUsR0FBRyxDQUFDLEdBQUcsQ0FDaEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsV0FBVyxDQUFFLFNBQVMsQUFDeEIsQ0FBQyxBQUNELFdBQVcsZUFBQyxDQUFDLEFBQ1gsVUFBVSxDQUFFLElBQUksQ0FDaEIsVUFBVSxDQUFFLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQzVCLFVBQVUsQ0FBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUM3QixtQkFBbUIsQ0FBRSxPQUFPLEFBQzlCLENBQUMsQUFDRCxXQUFXLGVBQUMsQ0FBQyxBQUNYLE1BQU0sQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQUMsR0FBRyxBQUNsQixDQUFDLEFBQ0QsT0FBTyxlQUFDLENBQUMsQUFDUCxPQUFPLENBQUUsQ0FBQyxDQUFDLEdBQUcsQUFDaEIsQ0FBQyJ9 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (81:2) {#if !items.length}
    function create_if_block_2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*noMatches*/ ctx[2]);
    			attr_dev(p, "class", "no-matches svelte-132pd9f");
    			add_location(p, file$3, 81, 4, 2049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*noMatches*/ 4) set_data_dev(t, /*noMatches*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(81:2) {#if !items.length}",
    		ctx
    	});

    	return block;
    }

    // (100:6) {:else}
    function create_else_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			add_location(span, file$3, 100, 8, 2565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(100:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:6) {#if !!item.shortcut}
    function create_if_block$1(ctx) {
    	let kyb;

    	function select_block_type_1(ctx, dirty) {
    		if (!!/*item*/ ctx[10].symbols) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			kyb = element("kyb");
    			if_block.c();
    			attr_dev(kyb, "class", "svelte-132pd9f");
    			add_location(kyb, file$3, 90, 8, 2315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, kyb, anchor);
    			if_block.m(kyb, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(kyb, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(kyb);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(90:6) {#if !!item.shortcut}",
    		ctx
    	});

    	return block;
    }

    // (96:10) {:else}
    function create_else_block(ctx) {
    	let t_value = /*item*/ ctx[10].shortcut + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 1 && t_value !== (t_value = /*item*/ ctx[10].shortcut + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(96:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (92:10) {#if !!item.symbols}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*item*/ ctx[10].symbols;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 1) {
    				each_value_1 = /*item*/ ctx[10].symbols;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(92:10) {#if !!item.symbols}",
    		ctx
    	});

    	return block;
    }

    // (93:12) {#each item.symbols as symbol}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*symbol*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "symbol svelte-132pd9f");
    			add_location(span, file$3, 93, 14, 2409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 1 && t_value !== (t_value = /*symbol*/ ctx[13] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(93:12) {#each item.symbols as symbol}",
    		ctx
    	});

    	return block;
    }

    // (84:2) {#each items as item, index}
    function create_each_block(ctx) {
    	let p;
    	let span;
    	let t0_value = /*item*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!!/*item*/ ctx[10].shortcut) return create_if_block$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function mousedown_handler(...args) {
    		return /*mousedown_handler*/ ctx[6](/*index*/ ctx[12], ...args);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			add_location(span, file$3, 88, 6, 2254);
    			attr_dev(p, "class", "item svelte-132pd9f");
    			toggle_class(p, "selected", /*index*/ ctx[12] == /*selectedIndex*/ ctx[1]);
    			add_location(p, file$3, 84, 4, 2130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span);
    			append_dev(span, t0);
    			append_dev(p, t1);
    			if_block.m(p, null);
    			append_dev(p, t2);

    			if (!mounted) {
    				dispose = listen_dev(p, "mousedown", mousedown_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[10].name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(p, t2);
    				}
    			}

    			if (dirty & /*selectedIndex*/ 2) {
    				toggle_class(p, "selected", /*index*/ ctx[12] == /*selectedIndex*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(84:2) {#each items as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t;
    	let if_block = !/*items*/ ctx[0].length && create_if_block_2(ctx);
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "items-list svelte-132pd9f");
    			add_location(div, file$3, 79, 0, 1978);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*items*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*selectedIndex, clickedIndex, items*/ 19) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommandList', slots, []);
    	const dispatch = createEventDispatcher();
    	let { items = [] } = $$props;
    	let { selectedIndex = 0 } = $$props;
    	let { noMatches = '' } = $$props;
    	let selectedIndexLast = 0;
    	let listEl;

    	function clickedIndex(e, hoverIndex) {
    		const isPrimaryButton = e.which === 1;

    		if (!isPrimaryButton) {
    			return;
    		}

    		dispatch("clickedIndex", hoverIndex);
    	}

    	function checkSelectedIndexInView() {
    		if (!listEl) {
    			return;
    		}

    		const listItemEl = listEl.querySelector(".items-list .selected");

    		if (!listItemEl) {
    			return;
    		}

    		const isPressingDownArrow = 0 < selectedIndex - selectedIndexLast;
    		$$invalidate(5, selectedIndexLast = selectedIndex);
    		const isPressingUpArrow = !isPressingDownArrow;
    		const viewTop = listEl.scrollTop + 36;
    		const viewBottom = listEl.scrollTop + listEl.clientHeight;
    		const itemTop = listItemEl.offsetTop - 8;
    		const viewTopIdealPressingDown = itemTop - listEl.clientHeight;
    		const viewTopIdealPressingUp = itemTop - 36;
    		const isWithinView = itemTop <= viewBottom && itemTop >= viewTop;

    		if (isWithinView) {
    			return;
    		}

    		if (isPressingDownArrow) {
    			$$invalidate(3, listEl.scrollTop = viewTopIdealPressingDown, listEl);
    		}

    		if (isPressingUpArrow) {
    			$$invalidate(3, listEl.scrollTop = viewTopIdealPressingUp, listEl);
    		}
    	}

    	const writable_props = ['items', 'selectedIndex', 'noMatches'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CommandList> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = (index, e) => clickedIndex(e, index);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			listEl = $$value;
    			$$invalidate(3, listEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('selectedIndex' in $$props) $$invalidate(1, selectedIndex = $$props.selectedIndex);
    		if ('noMatches' in $$props) $$invalidate(2, noMatches = $$props.noMatches);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		items,
    		selectedIndex,
    		noMatches,
    		selectedIndexLast,
    		listEl,
    		clickedIndex,
    		checkSelectedIndexInView
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('selectedIndex' in $$props) $$invalidate(1, selectedIndex = $$props.selectedIndex);
    		if ('noMatches' in $$props) $$invalidate(2, noMatches = $$props.noMatches);
    		if ('selectedIndexLast' in $$props) $$invalidate(5, selectedIndexLast = $$props.selectedIndexLast);
    		if ('listEl' in $$props) $$invalidate(3, listEl = $$props.listEl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedIndexLast, selectedIndex*/ 34) {
    			{
    				if (selectedIndexLast != selectedIndex) setTimeout(() => checkSelectedIndexInView());
    			}
    		}
    	};

    	return [
    		items,
    		selectedIndex,
    		noMatches,
    		listEl,
    		clickedIndex,
    		selectedIndexLast,
    		mousedown_handler,
    		div_binding
    	];
    }

    class CommandList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { items: 0, selectedIndex: 1, noMatches: 2 }, add_css$2);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommandList",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get items() {
    		throw new Error("<CommandList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<CommandList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedIndex() {
    		throw new Error("<CommandList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedIndex(value) {
    		throw new Error("<CommandList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noMatches() {
    		throw new Error("<CommandList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noMatches(value) {
    		throw new Error("<CommandList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * hotkeys-js v3.7.6
     * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
     * 
     * Copyright (c) 2020 kenny wong <wowohoo@qq.com>
     * http://jaywcjlove.github.io/hotkeys
     * 
     * Licensed under the MIT license.
     */

    var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

    function addEvent(object, event, method) {
      if (object.addEventListener) {
        object.addEventListener(event, method, false);
      } else if (object.attachEvent) {
        object.attachEvent("on".concat(event), function () {
          method(window.event);
        });
      }
    } // 修饰键转换成对应的键码


    function getMods(modifier, key) {
      var mods = key.slice(0, key.length - 1);

      for (var i = 0; i < mods.length; i++) {
        mods[i] = modifier[mods[i].toLowerCase()];
      }

      return mods;
    } // 处理传的key字符串转换成数组


    function getKeys(key) {
      if (typeof key !== 'string') key = '';
      key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

      var keys = key.split(','); // 同时设置多个快捷键，以','分割

      var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

      for (; index >= 0;) {
        keys[index - 1] += ',';
        keys.splice(index, 1);
        index = keys.lastIndexOf('');
      }

      return keys;
    } // 比较修饰键的数组


    function compareArray(a1, a2) {
      var arr1 = a1.length >= a2.length ? a1 : a2;
      var arr2 = a1.length >= a2.length ? a2 : a1;
      var isIndex = true;

      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
      }

      return isIndex;
    }

    var _keyMap = {
      backspace: 8,
      tab: 9,
      clear: 12,
      enter: 13,
      "return": 13,
      esc: 27,
      escape: 27,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      del: 46,
      "delete": 46,
      ins: 45,
      insert: 45,
      home: 36,
      end: 35,
      pageup: 33,
      pagedown: 34,
      capslock: 20,
      '⇪': 20,
      ',': 188,
      '.': 190,
      '/': 191,
      '`': 192,
      '-': isff ? 173 : 189,
      '=': isff ? 61 : 187,
      ';': isff ? 59 : 186,
      '\'': 222,
      '[': 219,
      ']': 221,
      '\\': 220
    }; // Modifier Keys

    var _modifier = {
      // shiftKey
      '⇧': 16,
      shift: 16,
      // altKey
      '⌥': 18,
      alt: 18,
      option: 18,
      // ctrlKey
      '⌃': 17,
      ctrl: 17,
      control: 17,
      // metaKey
      '⌘': 91,
      cmd: 91,
      command: 91
    };
    var modifierMap = {
      16: 'shiftKey',
      18: 'altKey',
      17: 'ctrlKey',
      91: 'metaKey',
      shiftKey: 16,
      ctrlKey: 17,
      altKey: 18,
      metaKey: 91
    };
    var _mods = {
      16: false,
      18: false,
      17: false,
      91: false
    };
    var _handlers = {}; // F1~F12 special key

    for (var k = 1; k < 20; k++) {
      _keyMap["f".concat(k)] = 111 + k;
    }

    var _downKeys = []; // 记录摁下的绑定键

    var _scope = 'all'; // 默认热键范围

    var elementHasBindEvent = []; // 已绑定事件的节点记录
    // 返回键码

    var code = function code(x) {
      return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
    }; // 设置获取当前范围（默认为'所有'）


    function setScope(scope) {
      _scope = scope || 'all';
    } // 获取当前范围


    function getScope() {
      return _scope || 'all';
    } // 获取摁下绑定键的键值


    function getPressedKeyCodes() {
      return _downKeys.slice(0);
    } // 表单控件控件判断 返回 Boolean
    // hotkey is effective only when filter return true


    function filter(event) {
      var target = event.target || event.srcElement;
      var tagName = target.tagName;
      var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

      if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA') && !target.readOnly) {
        flag = false;
      }

      return flag;
    } // 判断摁下的键是否为某个键，返回true或者false


    function isPressed(keyCode) {
      if (typeof keyCode === 'string') {
        keyCode = code(keyCode); // 转换成键码
      }

      return _downKeys.indexOf(keyCode) !== -1;
    } // 循环删除handlers中的所有 scope(范围)


    function deleteScope(scope, newScope) {
      var handlers;
      var i; // 没有指定scope，获取scope

      if (!scope) scope = getScope();

      for (var key in _handlers) {
        if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
          handlers = _handlers[key];

          for (i = 0; i < handlers.length;) {
            if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
          }
        }
      } // 如果scope被删除，将scope重置为all


      if (getScope() === scope) setScope(newScope || 'all');
    } // 清除修饰键


    function clearModifier(event) {
      var key = event.keyCode || event.which || event.charCode;

      var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


      if (i >= 0) {
        _downKeys.splice(i, 1);
      } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


      if (event.key && event.key.toLowerCase() === 'meta') {
        _downKeys.splice(0, _downKeys.length);
      } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


      if (key === 93 || key === 224) key = 91;

      if (key in _mods) {
        _mods[key] = false; // 将修饰键重置为false

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = false;
        }
      }
    }

    function unbind(keysInfo) {
      // unbind(), unbind all keys
      if (!keysInfo) {
        Object.keys(_handlers).forEach(function (key) {
          return delete _handlers[key];
        });
      } else if (Array.isArray(keysInfo)) {
        // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
        keysInfo.forEach(function (info) {
          if (info.key) eachUnbind(info);
        });
      } else if (typeof keysInfo === 'object') {
        // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
        if (keysInfo.key) eachUnbind(keysInfo);
      } else if (typeof keysInfo === 'string') {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // support old method
        // eslint-disable-line
        var scope = args[0],
            method = args[1];

        if (typeof scope === 'function') {
          method = scope;
          scope = '';
        }

        eachUnbind({
          key: keysInfo,
          scope: scope,
          method: method,
          splitKey: '+'
        });
      }
    } // 解除绑定某个范围的快捷键


    var eachUnbind = function eachUnbind(_ref) {
      var key = _ref.key,
          scope = _ref.scope,
          method = _ref.method,
          _ref$splitKey = _ref.splitKey,
          splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
      var multipleKeys = getKeys(key);
      multipleKeys.forEach(function (originKey) {
        var unbindKeys = originKey.split(splitKey);
        var len = unbindKeys.length;
        var lastKey = unbindKeys[len - 1];
        var keyCode = lastKey === '*' ? '*' : code(lastKey);
        if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

        if (!scope) scope = getScope();
        var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
        _handlers[keyCode] = _handlers[keyCode].map(function (record) {
          // 通过函数判断，是否解除绑定，函数相等直接返回
          var isMatchingMethod = method ? record.method === method : true;

          if (isMatchingMethod && record.scope === scope && compareArray(record.mods, mods)) {
            return {};
          }

          return record;
        });
      });
    }; // 对监听对应快捷键的回调函数进行处理


    function eventHandler(event, handler, scope) {
      var modifiersMatch; // 看它是否在当前范围

      if (handler.scope === scope || handler.scope === 'all') {
        // 检查是否匹配修饰符（如果有返回true）
        modifiersMatch = handler.mods.length > 0;

        for (var y in _mods) {
          if (Object.prototype.hasOwnProperty.call(_mods, y)) {
            if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
              modifiersMatch = false;
            }
          }
        } // 调用处理程序，如果是修饰键不做处理


        if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
          if (handler.method(event, handler) === false) {
            if (event.preventDefault) event.preventDefault();else event.returnValue = false;
            if (event.stopPropagation) event.stopPropagation();
            if (event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    } // 处理keydown事件


    function dispatch(event) {
      var asterisk = _handlers['*'];
      var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

      if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
      // Webkit左右 command 键值不一样

      if (key === 93 || key === 224) key = 91;
      /**
       * Collect bound keys
       * If an Input Method Editor is processing key input and the event is keydown, return 229.
       * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
       * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
       */

      if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
      /**
       * Jest test cases are required.
       * ===============================
       */

      ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
        var keyNum = modifierMap[keyName];

        if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
          _downKeys.push(keyNum);
        } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
          _downKeys.splice(_downKeys.indexOf(keyNum), 1);
        }
      });
      /**
       * -------------------------------
       */

      if (key in _mods) {
        _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = true;
        }

        if (!asterisk) return;
      } // 将 modifierMap 里面的修饰键绑定到 event 中


      for (var e in _mods) {
        if (Object.prototype.hasOwnProperty.call(_mods, e)) {
          _mods[e] = event[modifierMap[e]];
        }
      }
      /**
       * https://github.com/jaywcjlove/hotkeys/pull/129
       * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
       * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
       * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
       */


      if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
        if (_downKeys.indexOf(17) === -1) {
          _downKeys.push(17);
        }

        if (_downKeys.indexOf(18) === -1) {
          _downKeys.push(18);
        }

        _mods[17] = true;
        _mods[18] = true;
      } // 获取范围 默认为 `all`


      var scope = getScope(); // 对任何快捷键都需要做的处理

      if (asterisk) {
        for (var i = 0; i < asterisk.length; i++) {
          if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
            eventHandler(event, asterisk[i], scope);
          }
        }
      } // key 不在 _handlers 中返回


      if (!(key in _handlers)) return;

      for (var _i = 0; _i < _handlers[key].length; _i++) {
        if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
          if (_handlers[key][_i].key) {
            var record = _handlers[key][_i];
            var splitKey = record.splitKey;
            var keyShortcut = record.key.split(splitKey);
            var _downKeysCurrent = []; // 记录当前按键键值

            for (var a = 0; a < keyShortcut.length; a++) {
              _downKeysCurrent.push(code(keyShortcut[a]));
            }

            if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
              // 找到处理内容
              eventHandler(event, record, scope);
            }
          }
        }
      }
    } // 判断 element 是否已经绑定事件


    function isElementBind(element) {
      return elementHasBindEvent.indexOf(element) > -1;
    }

    function hotkeys(key, option, method) {
      _downKeys = [];
      var keys = getKeys(key); // 需要处理的快捷键列表

      var mods = [];
      var scope = 'all'; // scope默认为all，所有范围都有效

      var element = document; // 快捷键事件绑定节点

      var i = 0;
      var keyup = false;
      var keydown = true;
      var splitKey = '+'; // 对为设定范围的判断

      if (method === undefined && typeof option === 'function') {
        method = option;
      }

      if (Object.prototype.toString.call(option) === '[object Object]') {
        if (option.scope) scope = option.scope; // eslint-disable-line

        if (option.element) element = option.element; // eslint-disable-line

        if (option.keyup) keyup = option.keyup; // eslint-disable-line

        if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

        if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
      }

      if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

      for (; i < keys.length; i++) {
        key = keys[i].split(splitKey); // 按键列表

        mods = []; // 如果是组合快捷键取得组合快捷键

        if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

        key = key[key.length - 1];
        key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
        // 判断key是否在_handlers中，不在就赋一个空数组

        if (!(key in _handlers)) _handlers[key] = [];

        _handlers[key].push({
          keyup: keyup,
          keydown: keydown,
          scope: scope,
          mods: mods,
          shortcut: keys[i],
          method: method,
          key: keys[i],
          splitKey: splitKey
        });
      } // 在全局document上设置快捷键


      if (typeof element !== 'undefined' && !isElementBind(element) && window) {
        elementHasBindEvent.push(element);
        addEvent(element, 'keydown', function (e) {
          dispatch(e);
        });
        addEvent(window, 'focus', function () {
          _downKeys = [];
        });
        addEvent(element, 'keyup', function (e) {
          dispatch(e);
          clearModifier(e);
        });
      }
    }

    var _api = {
      setScope: setScope,
      getScope: getScope,
      deleteScope: deleteScope,
      getPressedKeyCodes: getPressedKeyCodes,
      isPressed: isPressed,
      filter: filter,
      unbind: unbind
    };

    for (var a in _api) {
      if (Object.prototype.hasOwnProperty.call(_api, a)) {
        hotkeys[a] = _api[a];
      }
    }

    if (typeof window !== 'undefined') {
      var _hotkeys = window.hotkeys;

      hotkeys.noConflict = function (deep) {
        if (deep && window.hotkeys === hotkeys) {
          window.hotkeys = _hotkeys;
        }

        return hotkeys;
      };

      window.hotkeys = hotkeys;
    }

    const asyncTimeout = ms => new Promise(res => setTimeout(res, ms));

    function initShortCuts(bindToInputsToo) {
      // create a closure over bindToInputsToo
      hotkeys.filter = function(event){
        // no filtering
        if ( bindToInputsToo ) { return true; }

        // .matches supported by all major browsers in 2017
        // document.activeElement.matches('[data-id=cp-SearchField]'
        // Replaced with dataset supported 2015 and maybe faster?
        if (document.activeElement.dataset['id'] === 'cp-SearchField' ) {
          // allow hotkey to always work in command-pal search input
          return true
        } else {
          // use hotkeys.js default filter rule
          // https://github.com/jaywcjlove/hotkeys/issues/321
          //   is not quite right: tagname = target.tagName not
          //   tagname = target. Corrected below.
          const target = event.target || event.srcElement;
          const tagName = target.tagName;
          // ignore: isContentEditable === 'true', <input> and
          // <textarea> when readOnly state is false, <select>
          return ! (target.isContentEditable ||
    		((tagName === 'INPUT' ||
    		  tagName === 'TEXTAREA' ||
    		  tagName === 'SELECT') && !target.readOnly))
        }
      };
    }

    function setMainShortCut(shortcutKey, onExecCallback) {
      hotkeys.unbind(shortcutKey);
      hotkeys(shortcutKey, function (e) {
        e.preventDefault();
        onExecCallback();
      });
    }
    function setAllShortCuts(items, onExecCallback) {
      items
        .filter((item) => item.shortcut)
        .map((item) => {
          hotkeys.unbind(item.shortcut);
          hotkeys(item.shortcut, async function (e) {
            e.preventDefault();
            onExecCallback(item);
          });
        });
    }

    /* src/SearchField.svelte generated by Svelte v3.55.1 */
    const file$2 = "src/SearchField.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1ary9cc", ".search.svelte-1ary9cc{width:100%;height:20px;outline:none;font-size:1.1em;margin:0;padding:14px;padding-left:6px;box-sizing:border-box;box-shadow:none;border-radius:0px}.search.svelte-1ary9cc::placeholder{opacity:1}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoRmllbGQuc3ZlbHRlIiwic291cmNlcyI6WyJTZWFyY2hGaWVsZC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBsYW5nPVwidHNcIj5pbXBvcnQgeyBfX2F3YWl0ZXIgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcbmNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5pbXBvcnQgeyBhc3luY1RpbWVvdXQgfSBmcm9tIFwiLi9zaG9ydGN1dHNcIjtcbmV4cG9ydCBsZXQgc2hvdztcbmV4cG9ydCBsZXQgaW5wdXRFbDtcbmV4cG9ydCBsZXQgcGxhY2Vob2xkZXJUZXh0O1xubGV0IGlucHV0VmFsdWU7XG5jb25zdCBnZXRVVUlEID0gKCkgPT4gTWF0aC5yYW5kb20oKVxuICAgIC50b1N0cmluZygzMilcbiAgICAuc2xpY2UoMik7XG5jb25zdCBpbnB1dE5hbWUgPSBnZXRVVUlEKCk7XG5mdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgZGlzcGF0Y2goXCJjbG9zZWRcIik7XG4gICAgaW5wdXRWYWx1ZSA9IFwiXCI7XG59XG5mdW5jdGlvbiBvbkZpZWxkQmx1cigpIHtcbiAgICBpZiAod2luZG93LmNvbW1hbmRQYWxJZ25vcmVCbHVyKVxuICAgICAgICByZXR1cm47XG4gICAgb25CbHVyKCk7XG59XG5mdW5jdGlvbiBvbktleURvd24oZSkge1xuICAgIGxldCBrZXlDb2RlID0gZS5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoa2V5Q29kZSA9PT0gXCJlbnRlclwiKSB7XG4gICAgICAgIGRpc3BhdGNoKFwiZW50ZXJcIiwgaW5wdXRWYWx1ZSk7XG4gICAgICAgIG9uQmx1cigpO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXlDb2RlID09PSBcImFycm93ZG93blwiKSB7XG4gICAgICAgIGRpc3BhdGNoKFwiYXJyb3dkb3duXCIpO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXlDb2RlID09PSBcImFycm93dXBcIikge1xuICAgICAgICBkaXNwYXRjaChcImFycm93dXBcIik7XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleUNvZGUgPT09IFwiZXNjYXBlXCIpIHtcbiAgICAgICAgb25CbHVyKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gb25UZXh0Q2hhbmdlZChlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgeWllbGQgYXN5bmNUaW1lb3V0KDEwKTtcbiAgICAgICAgZGlzcGF0Y2goXCJ0ZXh0Q2hhbmdlXCIsIGlucHV0VmFsdWUpO1xuICAgIH0pO1xufVxuJDoge1xuICAgIGlmICghIXNob3cgJiYgISFpbnB1dEVsKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuc2VhcmNoIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBmb250LXNpemU6IDEuMWVtO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAxNHB4O1xuICAgIHBhZGRpbmctbGVmdDogNnB4O1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gIH1cbiAgLnNlYXJjaDo6cGxhY2Vob2xkZXIge1xuICAgIG9wYWNpdHk6IDE7IC8qIEZpcmVmb3ggKi9cbiAgfVxuPC9zdHlsZT5cblxuPGlucHV0XG4gIGNsYXNzPVwic2VhcmNoXCJcbiAgYmluZDp0aGlzPXtpbnB1dEVsfVxuICBiaW5kOnZhbHVlPXtpbnB1dFZhbHVlfVxuICBpZD17aW5wdXROYW1lfVxuICBuYW1lPXtpbnB1dE5hbWV9XG4gIGRhdGEtaWQ9XCJjcC1TZWFyY2hGaWVsZFwiXG4gIG9uOmJsdXI9e29uRmllbGRCbHVyfVxuICBvbjprZXlkb3duPXtvbktleURvd259XG4gIG9uOmlucHV0PXtvblRleHRDaGFuZ2VkfVxuICBhdXRvY29tcGxldGU9XCJub1wiXG4gIGF1dG9jYXBpdGFsaXplPVwibm9uZVwiXG4gIHR5cGU9XCJ0ZXh0XCJcbiAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyVGV4dH0gLz5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxREUsT0FBTyxlQUFDLENBQUMsQUFDUCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osT0FBTyxDQUFFLElBQUksQ0FDYixTQUFTLENBQUUsS0FBSyxDQUNoQixNQUFNLENBQUUsQ0FBQyxDQUNULE9BQU8sQ0FBRSxJQUFJLENBQ2IsWUFBWSxDQUFFLEdBQUcsQ0FDakIsVUFBVSxDQUFFLFVBQVUsQ0FDdEIsVUFBVSxDQUFFLElBQUksQ0FDaEIsYUFBYSxDQUFFLEdBQUcsQUFDcEIsQ0FBQyxBQUNELHNCQUFPLGFBQWEsQUFBQyxDQUFDLEFBQ3BCLE9BQU8sQ0FBRSxDQUFDLEFBQ1osQ0FBQyJ9 */");
    }

    function create_fragment$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "search svelte-1ary9cc");
    			attr_dev(input, "id", /*inputName*/ ctx[3]);
    			attr_dev(input, "name", /*inputName*/ ctx[3]);
    			attr_dev(input, "data-id", "cp-SearchField");
    			attr_dev(input, "autocomplete", "no");
    			attr_dev(input, "autocapitalize", "none");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*placeholderText*/ ctx[1]);
    			add_location(input, file$2, 70, 0, 1492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[8](input);
    			set_input_value(input, /*inputValue*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    					listen_dev(input, "blur", /*onFieldBlur*/ ctx[4], false, false, false),
    					listen_dev(input, "keydown", /*onKeyDown*/ ctx[5], false, false, false),
    					listen_dev(input, "input", /*onTextChanged*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placeholderText*/ 2) {
    				attr_dev(input, "placeholder", /*placeholderText*/ ctx[1]);
    			}

    			if (dirty & /*inputValue*/ 4 && input.value !== /*inputValue*/ ctx[2]) {
    				set_input_value(input, /*inputValue*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchField', slots, []);
    	const dispatch = createEventDispatcher();
    	let { show } = $$props;
    	let { inputEl } = $$props;
    	let { placeholderText } = $$props;
    	let inputValue;
    	const getUUID = () => Math.random().toString(32).slice(2);
    	const inputName = getUUID();

    	function onBlur() {
    		dispatch("closed");
    		$$invalidate(2, inputValue = "");
    	}

    	function onFieldBlur() {
    		if (window.commandPalIgnoreBlur) return;
    		onBlur();
    	}

    	function onKeyDown(e) {
    		let keyCode = e.key.toLowerCase();

    		if (keyCode === "enter") {
    			dispatch("enter", inputValue);
    			onBlur();
    		} else if (keyCode === "arrowdown") {
    			dispatch("arrowdown");
    		} else if (keyCode === "arrowup") {
    			dispatch("arrowup");
    		} else if (keyCode === "escape") {
    			onBlur();
    		}
    	}

    	function onTextChanged(e) {
    		return __awaiter(this, void 0, void 0, function* () {
    			yield asyncTimeout(10);
    			dispatch("textChange", inputValue);
    		});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (show === undefined && !('show' in $$props || $$self.$$.bound[$$self.$$.props['show']])) {
    			console.warn("<SearchField> was created without expected prop 'show'");
    		}

    		if (inputEl === undefined && !('inputEl' in $$props || $$self.$$.bound[$$self.$$.props['inputEl']])) {
    			console.warn("<SearchField> was created without expected prop 'inputEl'");
    		}

    		if (placeholderText === undefined && !('placeholderText' in $$props || $$self.$$.bound[$$self.$$.props['placeholderText']])) {
    			console.warn("<SearchField> was created without expected prop 'placeholderText'");
    		}
    	});

    	const writable_props = ['show', 'inputEl', 'placeholderText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchField> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputEl = $$value;
    			$$invalidate(0, inputEl);
    		});
    	}

    	function input_input_handler() {
    		inputValue = this.value;
    		$$invalidate(2, inputValue);
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(7, show = $$props.show);
    		if ('inputEl' in $$props) $$invalidate(0, inputEl = $$props.inputEl);
    		if ('placeholderText' in $$props) $$invalidate(1, placeholderText = $$props.placeholderText);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		createEventDispatcher,
    		dispatch,
    		asyncTimeout,
    		show,
    		inputEl,
    		placeholderText,
    		inputValue,
    		getUUID,
    		inputName,
    		onBlur,
    		onFieldBlur,
    		onKeyDown,
    		onTextChanged
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(7, show = $$props.show);
    		if ('inputEl' in $$props) $$invalidate(0, inputEl = $$props.inputEl);
    		if ('placeholderText' in $$props) $$invalidate(1, placeholderText = $$props.placeholderText);
    		if ('inputValue' in $$props) $$invalidate(2, inputValue = $$props.inputValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*show, inputEl*/ 129) {
    			{
    				if (!!show && !!inputEl) {
    					setTimeout(() => {
    						inputEl.focus();
    					});
    				}
    			}
    		}
    	};

    	return [
    		inputEl,
    		placeholderText,
    		inputValue,
    		inputName,
    		onFieldBlur,
    		onKeyDown,
    		onTextChanged,
    		show,
    		input_binding,
    		input_input_handler
    	];
    }

    class SearchField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { show: 7, inputEl: 0, placeholderText: 1 }, add_css$1);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchField",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get show() {
    		throw new Error("<SearchField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<SearchField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputEl() {
    		throw new Error("<SearchField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputEl(value) {
    		throw new Error("<SearchField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderText() {
    		throw new Error("<SearchField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderText(value) {
    		throw new Error("<SearchField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MobileButton.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/MobileButton.svelte";

    function add_css(target) {
    	append_styles(target, "svelte-1qhguwm", ".mobile-button.svelte-1qhguwm.svelte-1qhguwm{position:fixed;left:5px;bottom:5px;margin:0px;padding:0px;background:none;border-radius:2px;backface-visibility:hidden}.mobile-button.svelte-1qhguwm.svelte-1qhguwm:focus{box-shadow:none;background:none}.mobile-button.svelte-1qhguwm.svelte-1qhguwm:hover{box-shadow:none;background:none}.mobile-button.svelte-1qhguwm.svelte-1qhguwm:active{box-shadow:none;background:none;transform:translateY(2px)}.mobile-button.svelte-1qhguwm>svg.svelte-1qhguwm{width:44px;height:44px;display:block}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9iaWxlQnV0dG9uLnN2ZWx0ZSIsInNvdXJjZXMiOlsiTW9iaWxlQnV0dG9uLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPmltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcbmNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAubW9iaWxlLWJ1dHRvbiB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDVweDtcbiAgICBib3R0b206IDVweDtcbiAgICBtYXJnaW46IDBweDtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG4gIC5tb2JpbGUtYnV0dG9uOmZvY3VzIHtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gIH1cbiAgLm1vYmlsZS1idXR0b246aG92ZXIge1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogbm9uZTtcbiAgfVxuICAubW9iaWxlLWJ1dHRvbjphY3RpdmUge1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMnB4KTtcbiAgfVxuICAubW9iaWxlLWJ1dHRvbiA+IHN2ZyB7XG4gICAgd2lkdGg6IDQ0cHg7XG4gICAgaGVpZ2h0OiA0NHB4O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICB9XG48L3N0eWxlPlxuXG48YnV0dG9uIGNsYXNzPVwibW9iaWxlLWJ1dHRvblwiIG9uOmNsaWNrPXtlID0+IGRpc3BhdGNoKCdjbGljaycpfVxuICAgIG9uOmZvY3VzPXtlPT5kaXNwYXRjaCgnZm9jdXMnLCBlKX1cbiAgICB0aXRsZT1cIkNsaWNrIGhlcmUgdG8gb3BlbiBjb21tYW5kIHBhbGV0dGUuXCI+XG4gIDxzdmdcbiAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICB2ZXJzaW9uPVwiMS4xXCI+XG4gICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAgLTEwMjguNClcIj5cbiAgICAgIDxwYXRoXG4gICAgICAgIGQ9XCJtMyAxMDMwLjRjLTEuMTA0NiAwLTIgMC45LTIgMnY3IDIgN2MwIDEuMSAwLjg5NTQgMiAyIDJoOSA5YzEuMTA1IDBcbiAgICAgICAgMi0wLjkgMi0ydi03LTItN2MwLTEuMS0wLjg5NS0yLTItMmgtOS05elwiXG4gICAgICAgIGZpbGw9XCIjMmMzZTUwXCIgLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGQ9XCJtMyAyYy0xLjEwNDYgMC0yIDAuODk1NC0yIDJ2MyAzIDEgMSAxIDMgM2MwIDEuMTA1IDAuODk1NCAyIDIgMmg5XG4gICAgICAgIDljMS4xMDUgMCAyLTAuODk1IDItMnYtMy00LTItMy0zYzAtMS4xMDQ2LTAuODk1LTItMi0yaC05LTl6XCJcbiAgICAgICAgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAgMTAyOC40KVwiXG4gICAgICAgIGZpbGw9XCIjMzQ0OTVlXCIgLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGQ9XCJtNCA1LjEyNXYxLjEyNWwzIDEuNzUtMyAxLjc1djEuMTI1bDUtMi44NzUtNS0yLjg3NXptNVxuICAgICAgICA0Ljg3NXYxaDV2LTFoLTV6XCJcbiAgICAgICAgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAgMTAyOC40KVwiXG4gICAgICAgIGZpbGw9XCIjZWNmMGYxXCIgLz5cbiAgICA8L2c+XG4gIDwvc3ZnPlxuPC9idXR0b24+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0UsY0FBYyw4QkFBQyxDQUFDLEFBQ2QsUUFBUSxDQUFFLEtBQUssQ0FDZixJQUFJLENBQUUsR0FBRyxDQUNULE1BQU0sQ0FBRSxHQUFHLENBQ1gsTUFBTSxDQUFFLEdBQUcsQ0FDWCxPQUFPLENBQUUsR0FBRyxDQUNaLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLG1CQUFtQixDQUFFLE1BQU0sQUFDN0IsQ0FBQyxBQUNELDRDQUFjLE1BQU0sQUFBQyxDQUFDLEFBQ3BCLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLFVBQVUsQ0FBRSxJQUFJLEFBQ2xCLENBQUMsQUFDRCw0Q0FBYyxNQUFNLEFBQUMsQ0FBQyxBQUNwQixVQUFVLENBQUUsSUFBSSxDQUNoQixVQUFVLENBQUUsSUFBSSxBQUNsQixDQUFDLEFBQ0QsNENBQWMsT0FBTyxBQUFDLENBQUMsQUFDckIsVUFBVSxDQUFFLElBQUksQ0FDaEIsVUFBVSxDQUFFLElBQUksQ0FDaEIsU0FBUyxDQUFFLFdBQVcsR0FBRyxDQUFDLEFBQzVCLENBQUMsQUFDRCw2QkFBYyxDQUFHLEdBQUcsZUFBQyxDQUFDLEFBQ3BCLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixPQUFPLENBQUUsS0FBSyxBQUNoQixDQUFDIn0= */");
    }

    function create_fragment$1(ctx) {
    	let button;
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "m3 1030.4c-1.1046 0-2 0.9-2 2v7 2 7c0 1.1 0.8954 2 2 2h9 9c1.105 0\n        2-0.9 2-2v-7-2-7c0-1.1-0.895-2-2-2h-9-9z");
    			attr_dev(path0, "fill", "#2c3e50");
    			add_location(path0, file$1, 43, 6, 951);
    			attr_dev(path1, "d", "m3 2c-1.1046 0-2 0.8954-2 2v3 3 1 1 1 3 3c0 1.105 0.8954 2 2 2h9\n        9c1.105 0 2-0.895 2-2v-3-4-2-3-3c0-1.1046-0.895-2-2-2h-9-9z");
    			attr_dev(path1, "transform", "translate(0 1028.4)");
    			attr_dev(path1, "fill", "#34495e");
    			add_location(path1, file$1, 47, 6, 1117);
    			attr_dev(path2, "d", "m4 5.125v1.125l3 1.75-3 1.75v1.125l5-2.875-5-2.875zm5\n        4.875v1h5v-1h-5z");
    			attr_dev(path2, "transform", "translate(0 1028.4)");
    			attr_dev(path2, "fill", "#ecf0f1");
    			add_location(path2, file$1, 52, 6, 1340);
    			attr_dev(g, "transform", "translate(0 -1028.4)");
    			add_location(g, file$1, 42, 4, 908);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", "svelte-1qhguwm");
    			add_location(svg, file$1, 38, 2, 817);
    			attr_dev(button, "class", "mobile-button svelte-1qhguwm");
    			attr_dev(button, "title", "Click here to open command palette.");
    			add_location(button, file$1, 35, 0, 663);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button, "focus", /*focus_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MobileButton', slots, []);
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MobileButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => dispatch('click');
    	const focus_handler = e => dispatch('focus', e);
    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch });
    	return [dispatch, click_handler, focus_handler];
    }

    class MobileButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MobileButton",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;

    const file = "src/App.svelte";

    // (172:2) {#if !hideButton}
    function create_if_block(ctx) {
    	let mobilebutton;
    	let current;
    	mobilebutton = new MobileButton({ $$inline: true });
    	mobilebutton.$on("click", /*onMobileClick*/ ctx[14]);
    	mobilebutton.$on("focus", /*onMobileFocus*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(mobilebutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mobilebutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobilebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobilebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mobilebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(172:2) {#if !hideButton}",
    		ctx
    	});

    	return block;
    }

    // (176:4) 
    function create_search_slot(ctx) {
    	let div;
    	let searchfield;
    	let updating_inputEl;
    	let current;

    	function searchfield_inputEl_binding(value) {
    		/*searchfield_inputEl_binding*/ ctx[22](value);
    	}

    	let searchfield_props = {
    		placeholderText: /*placeholderText*/ ctx[0],
    		show: /*showModal*/ ctx[4]
    	};

    	if (/*searchField*/ ctx[5] !== void 0) {
    		searchfield_props.inputEl = /*searchField*/ ctx[5];
    	}

    	searchfield = new SearchField({ props: searchfield_props, $$inline: true });
    	binding_callbacks.push(() => bind(searchfield, 'inputEl', searchfield_inputEl_binding));
    	searchfield.$on("closed", /*onClosed*/ ctx[13]);
    	searchfield.$on("enter", /*onKeyEnter*/ ctx[9]);
    	searchfield.$on("arrowup", /*onKeyUp*/ ctx[10]);
    	searchfield.$on("arrowdown", /*onKeyDown*/ ctx[11]);
    	searchfield.$on("textChange", /*onTextChange*/ ctx[12]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(searchfield.$$.fragment);
    			attr_dev(div, "slot", "search");
    			add_location(div, file, 175, 4, 5172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(searchfield, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchfield_changes = {};
    			if (dirty[0] & /*placeholderText*/ 1) searchfield_changes.placeholderText = /*placeholderText*/ ctx[0];
    			if (dirty[0] & /*showModal*/ 16) searchfield_changes.show = /*showModal*/ ctx[4];

    			if (!updating_inputEl && dirty[0] & /*searchField*/ 32) {
    				updating_inputEl = true;
    				searchfield_changes.inputEl = /*searchField*/ ctx[5];
    				add_flush_callback(() => updating_inputEl = false);
    			}

    			searchfield.$set(searchfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(searchfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_search_slot.name,
    		type: "slot",
    		source: "(176:4) ",
    		ctx
    	});

    	return block;
    }

    // (187:4) 
    function create_items_slot(ctx) {
    	let div;
    	let commandlist;
    	let current;

    	commandlist = new CommandList({
    			props: {
    				items: /*itemsFiltered*/ ctx[7],
    				selectedIndex: /*selectedIndex*/ ctx[6],
    				noMatches: /*emptyResultText*/ ctx[3]
    			},
    			$$inline: true
    		});

    	commandlist.$on("clickedIndex", /*onClickedIndex*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(commandlist.$$.fragment);
    			attr_dev(div, "slot", "items");
    			add_location(div, file, 186, 4, 5489);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(commandlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const commandlist_changes = {};
    			if (dirty[0] & /*itemsFiltered*/ 128) commandlist_changes.items = /*itemsFiltered*/ ctx[7];
    			if (dirty[0] & /*selectedIndex*/ 64) commandlist_changes.selectedIndex = /*selectedIndex*/ ctx[6];
    			if (dirty[0] & /*emptyResultText*/ 8) commandlist_changes.noMatches = /*emptyResultText*/ ctx[3];
    			commandlist.$set(commandlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(commandlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(commandlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(commandlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_items_slot.name,
    		type: "slot",
    		source: "(187:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let t;
    	let palettecontainer;
    	let updating_show;
    	let current;
    	let if_block = !/*hideButton*/ ctx[1] && create_if_block(ctx);

    	function palettecontainer_show_binding(value) {
    		/*palettecontainer_show_binding*/ ctx[23](value);
    	}

    	let palettecontainer_props = {
    		$$slots: {
    			items: [create_items_slot],
    			search: [create_search_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[4] !== void 0) {
    		palettecontainer_props.show = /*showModal*/ ctx[4];
    	}

    	palettecontainer = new PaletteContainer({
    			props: palettecontainer_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(palettecontainer, 'show', palettecontainer_show_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(palettecontainer.$$.fragment);
    			attr_dev(div, "id", /*paletteId*/ ctx[2]);
    			add_location(div, file, 170, 0, 5006);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(palettecontainer, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*hideButton*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*hideButton*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const palettecontainer_changes = {};

    			if (dirty[0] & /*itemsFiltered, selectedIndex, emptyResultText, placeholderText, showModal, searchField*/ 249 | dirty[1] & /*$$scope*/ 2) {
    				palettecontainer_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_show && dirty[0] & /*showModal*/ 16) {
    				updating_show = true;
    				palettecontainer_changes.show = /*showModal*/ ctx[4];
    				add_flush_callback(() => updating_show = false);
    			}

    			palettecontainer.$set(palettecontainer_changes);

    			if (!current || dirty[0] & /*paletteId*/ 4) {
    				attr_dev(div, "id", /*paletteId*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(palettecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(palettecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(palettecontainer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const dispatch = createEventDispatcher();
    	let { hotkey } = $$props;
    	let { inputData = [] } = $$props;
    	let { hotkeysGlobal } = $$props;
    	let { placeholderText } = $$props;
    	let { hideButton } = $$props;
    	let { paletteId } = $$props;
    	let { emptyResultText } = $$props;
    	let { displayShortcutSymbols } = $$props;
    	let { symbolMapping } = $$props;
    	let { shortcutOpenPalette } = $$props;

    	const optionsFuse = {
    		isCaseSensitive: false,
    		shouldSort: true,
    		keys: ["name", "description"]
    	};

    	let showModal = false;
    	let searchField;
    	let loadingChildren = false;
    	let selectedIndex = "";
    	let items, itemsFiltered, fuse;
    	let focusedElement;
    	setItems(inputData);

    	onMount(() => {
    		initShortCuts(hotkeysGlobal);

    		setMainShortCut(hotkey, () => __awaiter(void 0, void 0, void 0, function* () {
    			if (showModal) {
    				onClosed();
    			} else {
    				focusedElement = document.activeElement;
    				$$invalidate(4, showModal = true);
    				$$invalidate(6, selectedIndex = 0);
    				dispatch("opened");
    			}
    		}));

    		setAllShortCuts(inputData, command => __awaiter(void 0, void 0, void 0, function* () {
    			focusedElement = document.activeElement;

    			if (shortcutOpenPalette) {
    				$$invalidate(4, showModal = true);
    				dispatch("opened");
    				yield asyncTimeout(200);
    				$$invalidate(6, selectedIndex = inputData.findIndex(i => i.name === command.name));
    				yield asyncTimeout(100);
    			}

    			onHandleCommand(command);
    		}));
    	});

    	function setItems(newItems) {
    		items = newItems;

    		if (displayShortcutSymbols === true) {
    			items.forEach(i => {
    				if (!i.shortcut) return;

    				i.symbols = i.shortcut.split('+').map(c => {
    					const symbol = symbolMapping[c.toLowerCase()];
    					return typeof symbol === 'undefined' ? c.toUpperCase() : symbol;
    				});
    			});
    		}

    		$$invalidate(7, itemsFiltered = items);
    		fuse = new Fuse(items, optionsFuse);
    	}

    	function onHandleCommand(command) {
    		return __awaiter(this, void 0, void 0, function* () {
    			if (!command) {
    				return;
    			}

    			const hasChildren = Array.isArray(command.children) && command.children.length;

    			if (hasChildren) {
    				$$invalidate(4, showModal = true);
    				loadingChildren = true;
    				setItems(command.children);
    				$$invalidate(5, searchField.value = "", searchField);
    				yield asyncTimeout(200);
    				searchField.focus();
    				loadingChildren = false;
    			} else {
    				dispatch("exec", command);
    				$$invalidate(4, showModal = false);
    			}

    			$$invalidate(6, selectedIndex = 0);
    		});
    	}

    	function onClickedIndex(e) {
    		$$invalidate(6, selectedIndex = e.detail);
    		const command = itemsFiltered[selectedIndex];
    		onHandleCommand(command);
    	}

    	function onKeyEnter(e) {
    		const command = itemsFiltered[selectedIndex];
    		onHandleCommand(command);
    	}

    	function onKeyUp(e) {
    		$$invalidate(6, selectedIndex--, selectedIndex);
    		const minIndex = 0;
    		const maxIndex = itemsFiltered.length - 1;

    		if (selectedIndex < minIndex) {
    			$$invalidate(6, selectedIndex = maxIndex);
    		}
    	}

    	function onKeyDown(e) {
    		$$invalidate(6, selectedIndex++, selectedIndex);
    		const minIndex = 0;
    		const maxIndex = itemsFiltered.length - 1;

    		if (selectedIndex > maxIndex) {
    			$$invalidate(6, selectedIndex = minIndex);
    		}
    	}

    	function onTextChange(e) {
    		const text = e.detail;
    		dispatch("textChanged", text);
    		$$invalidate(6, selectedIndex = 0);

    		if (!text) {
    			$$invalidate(7, itemsFiltered = items);
    		} else {
    			const fuseResult = fuse.search(text);
    			$$invalidate(7, itemsFiltered = fuseResult.map(i => i.item));
    		}
    	}

    	function onClosed() {
    		return __awaiter(this, void 0, void 0, function* () {
    			yield asyncTimeout(10);

    			if (loadingChildren) {
    				return;
    			}

    			dispatch("closed");
    			$$invalidate(6, selectedIndex = 0);
    			setItems(inputData);
    			$$invalidate(4, showModal = false);

    			if (!focusedElement) {
    				console.error("focusedElement not set");
    			} else {
    				focusedElement.focus();
    			}
    		});
    	}

    	function onMobileClick(e) {
    		dispatch("opened");
    		$$invalidate(4, showModal = true);
    		$$invalidate(6, selectedIndex = 0);
    	}

    	function onMobileFocus(e) {
    		/* Store the item that had focus and assign it to focusedElement.
       This will allow us to set focus back to it when we exit. */
    		// Surprisingly event is defined and has the correct data
    		// even if I don't do this. But I'll explicity pass it via details.
    		// as having event magically defined scares me.
    		let event = e.detail;

    		if (event.relatedTarget && event.relatedTarget.focus) {
    			focusedElement = event.relatedTarget;
    		} else {
    			focusedElement = document.body;
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (hotkey === undefined && !('hotkey' in $$props || $$self.$$.bound[$$self.$$.props['hotkey']])) {
    			console_1.warn("<App> was created without expected prop 'hotkey'");
    		}

    		if (hotkeysGlobal === undefined && !('hotkeysGlobal' in $$props || $$self.$$.bound[$$self.$$.props['hotkeysGlobal']])) {
    			console_1.warn("<App> was created without expected prop 'hotkeysGlobal'");
    		}

    		if (placeholderText === undefined && !('placeholderText' in $$props || $$self.$$.bound[$$self.$$.props['placeholderText']])) {
    			console_1.warn("<App> was created without expected prop 'placeholderText'");
    		}

    		if (hideButton === undefined && !('hideButton' in $$props || $$self.$$.bound[$$self.$$.props['hideButton']])) {
    			console_1.warn("<App> was created without expected prop 'hideButton'");
    		}

    		if (paletteId === undefined && !('paletteId' in $$props || $$self.$$.bound[$$self.$$.props['paletteId']])) {
    			console_1.warn("<App> was created without expected prop 'paletteId'");
    		}

    		if (emptyResultText === undefined && !('emptyResultText' in $$props || $$self.$$.bound[$$self.$$.props['emptyResultText']])) {
    			console_1.warn("<App> was created without expected prop 'emptyResultText'");
    		}

    		if (displayShortcutSymbols === undefined && !('displayShortcutSymbols' in $$props || $$self.$$.bound[$$self.$$.props['displayShortcutSymbols']])) {
    			console_1.warn("<App> was created without expected prop 'displayShortcutSymbols'");
    		}

    		if (symbolMapping === undefined && !('symbolMapping' in $$props || $$self.$$.bound[$$self.$$.props['symbolMapping']])) {
    			console_1.warn("<App> was created without expected prop 'symbolMapping'");
    		}

    		if (shortcutOpenPalette === undefined && !('shortcutOpenPalette' in $$props || $$self.$$.bound[$$self.$$.props['shortcutOpenPalette']])) {
    			console_1.warn("<App> was created without expected prop 'shortcutOpenPalette'");
    		}
    	});

    	const writable_props = [
    		'hotkey',
    		'inputData',
    		'hotkeysGlobal',
    		'placeholderText',
    		'hideButton',
    		'paletteId',
    		'emptyResultText',
    		'displayShortcutSymbols',
    		'symbolMapping',
    		'shortcutOpenPalette'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function searchfield_inputEl_binding(value) {
    		searchField = value;
    		$$invalidate(5, searchField);
    	}

    	function palettecontainer_show_binding(value) {
    		showModal = value;
    		$$invalidate(4, showModal);
    	}

    	$$self.$$set = $$props => {
    		if ('hotkey' in $$props) $$invalidate(16, hotkey = $$props.hotkey);
    		if ('inputData' in $$props) $$invalidate(17, inputData = $$props.inputData);
    		if ('hotkeysGlobal' in $$props) $$invalidate(18, hotkeysGlobal = $$props.hotkeysGlobal);
    		if ('placeholderText' in $$props) $$invalidate(0, placeholderText = $$props.placeholderText);
    		if ('hideButton' in $$props) $$invalidate(1, hideButton = $$props.hideButton);
    		if ('paletteId' in $$props) $$invalidate(2, paletteId = $$props.paletteId);
    		if ('emptyResultText' in $$props) $$invalidate(3, emptyResultText = $$props.emptyResultText);
    		if ('displayShortcutSymbols' in $$props) $$invalidate(19, displayShortcutSymbols = $$props.displayShortcutSymbols);
    		if ('symbolMapping' in $$props) $$invalidate(20, symbolMapping = $$props.symbolMapping);
    		if ('shortcutOpenPalette' in $$props) $$invalidate(21, shortcutOpenPalette = $$props.shortcutOpenPalette);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		Fuse,
    		PaletteContainer,
    		CommandList,
    		SearchField,
    		MobileButton,
    		onMount,
    		createEventDispatcher,
    		asyncTimeout,
    		setMainShortCut,
    		setAllShortCuts,
    		initShortCuts,
    		dispatch,
    		hotkey,
    		inputData,
    		hotkeysGlobal,
    		placeholderText,
    		hideButton,
    		paletteId,
    		emptyResultText,
    		displayShortcutSymbols,
    		symbolMapping,
    		shortcutOpenPalette,
    		optionsFuse,
    		showModal,
    		searchField,
    		loadingChildren,
    		selectedIndex,
    		items,
    		itemsFiltered,
    		fuse,
    		focusedElement,
    		setItems,
    		onHandleCommand,
    		onClickedIndex,
    		onKeyEnter,
    		onKeyUp,
    		onKeyDown,
    		onTextChange,
    		onClosed,
    		onMobileClick,
    		onMobileFocus
    	});

    	$$self.$inject_state = $$props => {
    		if ('hotkey' in $$props) $$invalidate(16, hotkey = $$props.hotkey);
    		if ('inputData' in $$props) $$invalidate(17, inputData = $$props.inputData);
    		if ('hotkeysGlobal' in $$props) $$invalidate(18, hotkeysGlobal = $$props.hotkeysGlobal);
    		if ('placeholderText' in $$props) $$invalidate(0, placeholderText = $$props.placeholderText);
    		if ('hideButton' in $$props) $$invalidate(1, hideButton = $$props.hideButton);
    		if ('paletteId' in $$props) $$invalidate(2, paletteId = $$props.paletteId);
    		if ('emptyResultText' in $$props) $$invalidate(3, emptyResultText = $$props.emptyResultText);
    		if ('displayShortcutSymbols' in $$props) $$invalidate(19, displayShortcutSymbols = $$props.displayShortcutSymbols);
    		if ('symbolMapping' in $$props) $$invalidate(20, symbolMapping = $$props.symbolMapping);
    		if ('shortcutOpenPalette' in $$props) $$invalidate(21, shortcutOpenPalette = $$props.shortcutOpenPalette);
    		if ('showModal' in $$props) $$invalidate(4, showModal = $$props.showModal);
    		if ('searchField' in $$props) $$invalidate(5, searchField = $$props.searchField);
    		if ('loadingChildren' in $$props) loadingChildren = $$props.loadingChildren;
    		if ('selectedIndex' in $$props) $$invalidate(6, selectedIndex = $$props.selectedIndex);
    		if ('items' in $$props) items = $$props.items;
    		if ('itemsFiltered' in $$props) $$invalidate(7, itemsFiltered = $$props.itemsFiltered);
    		if ('fuse' in $$props) fuse = $$props.fuse;
    		if ('focusedElement' in $$props) focusedElement = $$props.focusedElement;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		placeholderText,
    		hideButton,
    		paletteId,
    		emptyResultText,
    		showModal,
    		searchField,
    		selectedIndex,
    		itemsFiltered,
    		onClickedIndex,
    		onKeyEnter,
    		onKeyUp,
    		onKeyDown,
    		onTextChange,
    		onClosed,
    		onMobileClick,
    		onMobileFocus,
    		hotkey,
    		inputData,
    		hotkeysGlobal,
    		displayShortcutSymbols,
    		symbolMapping,
    		shortcutOpenPalette,
    		searchfield_inputEl_binding,
    		palettecontainer_show_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				hotkey: 16,
    				inputData: 17,
    				hotkeysGlobal: 18,
    				placeholderText: 0,
    				hideButton: 1,
    				paletteId: 2,
    				emptyResultText: 3,
    				displayShortcutSymbols: 19,
    				symbolMapping: 20,
    				shortcutOpenPalette: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get hotkey() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hotkey(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputData() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputData(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hotkeysGlobal() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hotkeysGlobal(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderText() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderText(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideButton() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideButton(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paletteId() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paletteId(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyResultText() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyResultText(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayShortcutSymbols() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayShortcutSymbols(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get symbolMapping() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set symbolMapping(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shortcutOpenPalette() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shortcutOpenPalette(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*jslint nomen: true*/
    /*global module */
    // Modified from David Walsh's pubsub. http://davidwalsh.name/pubsub-javascript

    var PubSub = function () {
        this.topics = {};
    };

    PubSub.prototype.subscribe = function(topic, listener) {
        var me = this;

        // Create the topic's object if not yet created
        if(!me.topics.hasOwnProperty(topic)){
            me.topics[topic] = [];
        }

        // Add the listener to queue
        me.topics[topic].push(listener);
    };

    PubSub.prototype.unsubscribe = function(topic) {
        delete this.topics[topic];
    };

    PubSub.prototype.publish = function(topic, info) {
        var me = this;

        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!me.topics.hasOwnProperty(topic)){
            return;
        }

        // Cycle through topics queue, fire!
        me.topics[topic].forEach(function(listener) {
            listener(info != undefined ? info : {});
        });
    };

    var microPubsub = {
        create: function() {
            return new PubSub();
        }
    };

    class CommandPal {
      constructor(options) {
        if (options.debugOutput) { console.log("CommandPal", { options });}
        this.options = options || {};
        this.ps = microPubsub.create();
      }

      start() {
        this.app = new App({
          target: document.body,
          props: {
            hotkey: this.options.hotkey || "ctrl+space",
            hotkeysGlobal: this.options.hotkeysGlobal || false,
            inputData: this.options.commands || [],
            paletteId: this.options.id || "CommandPal",
            placeholderText: this.options.placeholder || "What are you looking for?",
            hotkeysGlobal: this.options.hotkeysGlobal || false,
            hideButton: this.options.hideButton || false,
            emptyResultText: this.options.emptyResultText || "No matching commands…",
            displayShortcutSymbols: this.options.displayShortcutSymbols || false,
            symbolMapping: this.options.symbolMapping || {"ctrl":"⌃","shift":"⇧","command":"⌘","cmd":"⌘","option":"⌥","alt":"⌥","space":"⎵","capslock":"⇪","return":"↩︎","enter":"↩︎","esc":"⎋","backspace":"⌫","delete":"⌫"},
            shortcutOpenPalette: typeof this.options.shortcutOpenPalette === "undefined"? true: this.options.shortcutOpenPalette,
          },
        });
        const ctx = this;
        function subTo(eventName) {
          ctx.app.$on(eventName, (e) => ctx.ps.publish(eventName, e.detail));
        }
        subTo("opened");
        subTo("closed");
        subTo("textChanged");
        subTo("exec");
        this.ps.subscribe("exec", (item) => {
          if (item.handler && typeof item.handler === "function") {
            item.handler();
          }
        });
      }

      subscribe(eventName, cb) {
        this.ps.subscribe(eventName, (e) => cb(e));
      }

      destroy() {
        this.app.$destroy();
      }
    }
    window.CommandPal = CommandPal;

    return CommandPal;

})();
//# sourceMappingURL=bundle.js.map
