'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _CustomElement() {
    return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}

;
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);

var Slim = function (_CustomElement2) {
    _inherits(Slim, _CustomElement2);

    _createClass(Slim, null, [{
        key: 'polyfill',


        /**
         * Auto-detect if the browser supports web-components. If it does not,
         * it will add a script tag with the required url.
         * Best practice to call polyfill in <head> section of the HTML
         * @example
         *      <head>
         *          <script src="./path/to/slim/Slim.min.js></script>
         *          <script>
         *              Slim.polyfill('./path/to/web-components-polyfill.js');
         *          </script>
         *      </head>
         * @param url
         */
        value: function polyfill(url) {
            if (Slim.__isWCSupported) return;
            document.write('<script src="' + url + '"></script>');
        }

        /**
         * Declares a slim component
         *
         * @param {String} tag html tag name
         * @param {String|class|function} clazzOrTemplate the template string or the class itself
         * @param {class|function} clazz if not given as second argument, mandatory after the template
         */

    }, {
        key: 'tag',
        value: function tag(_tag, clazzOrTemplate, clazz) {
            if (clazz === undefined) {
                clazz = clazzOrTemplate;
            } else {
                Slim.__templateDict[_tag] = clazzOrTemplate;
            }
            Slim.__prototypeDict[_tag] = clazz;
            // window.customElements.define(tag, clazz);
            document.registerElement(_tag, clazz);
        }

        //noinspection JSUnusedGlobalSymbols
        /**
         *
         * @param {class|function} clazz returns the tag declared for a given class or constructor
         * @returns {string}
         */

    }, {
        key: 'getTag',
        value: function getTag(clazz) {
            for (var tag in Slim.__prototypeDict) {
                if (Slim.__prototypeDict[tag] === clazz) return tag;
            }
        }
    }, {
        key: '__createUqIndex',
        value: function __createUqIndex() {
            Slim.__uqIndex++;
            return Slim.__uqIndex.toString(16);
        }

        /**
         * Supported HTML events built-in on slim components
         * @returns {Array<String>}
         */

    }, {
        key: 'plugin',


        /**
         * Aspect oriented functions to handle lifecycle phases of elements. The plugin function should gets the element as an argument.
         * This is used to extend elements' capabilities or data injections across the application
         * @param {String} phase
         * @param {function} plugin
         */
        value: function plugin(phase, _plugin) {
            if (['create', 'beforeRender', 'beforeRemove', 'afterRender'].indexOf(phase) === -1) {
                throw "Supported phase can be create, beforeRemove, beforeRender or afterRender only";
            }
            Slim.__plugins[phase].push(_plugin);
        }

        //noinspection JSUnusedGlobalSymbols
        /**
         * This is used to extend Slim. All custom attributes handlers would recieve the function and the value of the attribute when relevant.
         * @param {String} attr attribute name
         * @param {function} fn
         */

    }, {
        key: 'registerCustomAttribute',
        value: function registerCustomAttribute(attr, fn) {
            Slim.__customAttributeProcessors[attr] = Slim.__customAttributeProcessors[attr] || [];
            Slim.__customAttributeProcessors[attr].push(fn);
        }

        /**
         * @param phase
         * @param element
         * @private
         */

    }, {
        key: '__runPlugins',
        value: function __runPlugins(phase, element) {
            Slim.__plugins[phase].forEach(function (fn) {
                fn(element);
            });
        }

        /**
         * Polyfill for IE11 support
         * @param target
         */

    }, {
        key: 'removeChild',
        value: function removeChild(target) {
            if (target.remove) {
                target.remove();
            }
            if (!target.remove && target.parentNode) {
                target.parentNode.removeChild(target);
                if (target._boundChildren) {
                    target._boundChildren.forEach(function (child) {
                        if (child.__ieClone) {
                            Slim.removeChild(child.__ieClone);
                        }
                    });
                }
            }
        }

        /**
         *
         * @param source
         * @param target
         * @param activate
         * @private
         */

    }, {
        key: '__moveChildrenBefore',
        value: function __moveChildrenBefore(source, target, activate) {
            while (source.firstChild) {
                target.parentNode.insertBefore(source.firstChild, target);
            }
            var children = Slim.selectorToArr(target, '*');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    if (activate && child.isSlim) {
                        child.createdCallback();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         *
         * @param source
         * @param target
         * @param activate
         * @private
         */

    }, {
        key: '__moveChildren',
        value: function __moveChildren(source, target, activate) {
            while (source.firstChild) {
                target.appendChild(source.firstChild);
            }
            var children = Slim.selectorToArr(target, '*');
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var child = _step2.value;

                    if (activate && child.isSlim) {
                        child.createdCallback();
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         *
         * @param obj
         * @param desc
         * @returns {{source: *, prop: *, obj: *}}
         * @private
         */

    }, {
        key: '__lookup',
        value: function __lookup(obj, desc) {
            var arr = desc.split(".");
            var prop = arr[0];
            while (arr.length && obj) {
                obj = obj[prop = arr.shift()];
            }
            return { source: desc, prop: prop, obj: obj };
        }

        /**
         *
         * @param descriptor
         * @private
         */

    }, {
        key: '__createRepeater',
        value: function __createRepeater(descriptor) {
            if (Slim.__prototypeDict['slim-repeat'] === undefined) {
                Slim.__initRepeater();
            }
            var repeater = void 0;
            repeater = document.createElement('slim-repeat');
            repeater.sourceNode = descriptor.target;
            descriptor.target.repeater = repeater;
            descriptor.target.parentNode.insertBefore(repeater, descriptor.target);
            descriptor.repeater = repeater;

            repeater._boundParent = descriptor.source;
            descriptor.target.parentNode.removeChild(descriptor.target);
            repeater._isAdjacentRepeater = descriptor.repeatAdjacent;
            repeater.setAttribute('source', descriptor.properties[0]);
            repeater.setAttribute('target-attr', descriptor.targetAttribute);
            descriptor.repeater = repeater;
        }

        /**
         *
         * @param dash
         * @returns {XML|void|string|*}
         * @private
         */

    }, {
        key: '__dashToCamel',
        value: function __dashToCamel(dash) {
            return dash.indexOf('-') < 0 ? dash : dash.replace(/-[a-z]/g, function (m) {
                return m[1].toUpperCase();
            });
        }

        //noinspection JSUnusedGlobalSymbols
        /**
         *
         * @param camel
         * @returns {string}
         * @private
         */

    }, {
        key: '__camelToDash',
        value: function __camelToDash(camel) {
            return camel.replace(/([A-Z])/g, '-$1').toLowerCase();
        }
    }, {
        key: 'interactionEventNames',
        get: function get() {
            return ['click', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'wheel', 'mouseleave', 'select', 'pointerlockchange', 'pointerlockerror', 'focus', 'blur', 'input', 'error', 'invalid', 'animationstart', 'animationend', 'animationiteration', 'reset', 'submit', 'resize', 'scroll', 'keydown', 'keypress', 'keyup', 'change'];
        }
    }]);

    function Slim() {
        _classCallCheck(this, Slim);

        var _this = _possibleConstructorReturn(this, (Slim.__proto__ || Object.getPrototypeOf(Slim)).call(this));

        _this.createdCallback();
        return _this;
    }

    _createClass(Slim, [{
        key: 'find',
        value: function find(selector) {
            return this.querySelector(selector);
        }

        //noinspection JSUnusedGlobalSymbols

    }, {
        key: 'findAll',
        value: function findAll(selector) {
            return Slim.selectorToArr(this, selector);
        }
    }, {
        key: 'watch',
        value: function watch(prop, executor) {
            var descriptor = {
                type: 'W',
                properties: [prop],
                executor: executor,
                target: this,
                source: this
            };
            this._bindings = this._bindings || {};
            this._boundParent = this._boundParent || this;
            this.__bind(descriptor);
        }

        /**
         * Function delegation in the DOM chain is supported by this function. All slim components are capable of triggering
         * delegated methods using callAttribute and send any payload as they define in their API.
         * @param {String} attributeName
         * @param {any} value
         */

    }, {
        key: 'callAttribute',
        value: function callAttribute(attributeName, value) {
            if (!this._boundParent) {
                throw 'Unable to call attribute-bound method when no bound parent available';
            }
            var fnName = this.getAttribute(attributeName);
            if (fnName === null) {
                console.warn && console.warn('Unable to call null attribute-bound method on bound parent ' + this._boundParent.outerHTML);
                return;
            }
            if (typeof this[fnName] === 'function') {
                this[fnName](value);
            } else if (typeof this._boundParent[fnName] === 'function') {
                this._boundParent[fnName](value);
            } else if (this._boundParent && this._boundParent._boundParent && typeof this._boundParent._boundParent[fnName] === 'function') {
                // safari, firefox
                this._boundParent._boundParent[fnName](value);
            } else if (this._boundRepeaterParent && typeof this._boundRepeaterParent[fnName] === 'function') {
                this._boundRepeaterParent[fnName](value);
            } else {
                throw "Unable to call attribute-bound method: " + fnName + ' on bound parent ' + this._boundParent.outerHTML + ' with value ' + value;
            }
            if (typeof this.update === 'function' && (this.isInteractive || Slim.autoAttachInteractionEvents || this.getAttribute('interactive'))) {
                this.update();
            }
        }
    }, {
        key: '__propertyChanged',
        value: function __propertyChanged(property, value) {
            if (typeof this[property + 'Changed'] === 'function') {
                this[property + 'Changed'](value);
            }
        }

        /**
         *
         * @param descriptor
         * @private
         */

    }, {
        key: '__bind',
        value: function __bind(descriptor) {
            descriptor.properties.forEach(function (prop) {
                var rootProp = void 0;
                if (prop.indexOf('.') > 0) {
                    rootProp = prop.split('.')[0];
                } else {
                    rootProp = prop;
                }
                var source = descriptor.source || descriptor.target._boundParent || descriptor.parentNode;
                source._bindings = source._bindings || {};
                source._bindings[rootProp] = source._bindings[rootProp] || {
                    value: source[rootProp],
                    executors: []
                };
                if (!source.__lookupGetter__(rootProp)) source.__defineGetter__(rootProp, function () {
                    return this._bindings[rootProp].value;
                });
                if (!source.__lookupSetter__(rootProp)) source.__defineSetter__(rootProp, function (x) {
                    this._bindings[rootProp].value = x;
                    if (descriptor.sourceText) {
                        descriptor.target.innerText = descriptor.sourceText;
                    }
                    this._executeBindings(rootProp);
                    this.__propertyChanged(rootProp, x);
                });
                var executor = void 0;
                if (descriptor.type === 'C') {
                    executor = function executor() {
                        descriptor.executor();
                    };
                } else if (descriptor.type === 'P') {
                    executor = function executor() {
                        var targets = void 0;
                        if (!descriptor.target.hasAttribute('slim-repeat')) {
                            targets = [descriptor.target];
                        } else {
                            targets = descriptor.target.repeater.clones;
                        }
                        if (targets) {
                            var sourceRef = descriptor.target._boundRepeaterParent;
                            var value = Slim.__lookup(sourceRef || source, prop).obj || Slim.__lookup(descriptor.target, prop).obj;
                            var attrName = Slim.__dashToCamel(descriptor.attribute);
                            targets.forEach(function (target) {
                                target[attrName] = value;
                                target.setAttribute(descriptor.attribute, value);
                            });
                        }
                    };
                } else if (descriptor.type === 'M') {
                    executor = function executor() {
                        var targets = [descriptor.target];
                        if (descriptor.target.hasAttribute('slim-repeat')) {
                            targets = descriptor.target.repeater.clones;
                        }
                        var sourceRef = descriptor.target._boundRepeaterParent || source;
                        var value = sourceRef[descriptor.method].apply(sourceRef, descriptor.properties.map(function (prop) {
                            return descriptor.target[prop] || sourceRef[prop];
                        }));
                        var attrName = Slim.__dashToCamel(descriptor.attribute);
                        targets.forEach(function (target) {
                            target[attrName] = value;
                            target.setAttribute(descriptor.attribute, value);
                        });
                    };
                } else if (descriptor.type === 'T') {
                    executor = function executor() {
                        var source = descriptor.target._boundParent;
                        descriptor.target._innerText = descriptor.target._innerText.replace('[[' + prop + ']]', Slim.__lookup(source, prop).obj);
                    };
                } else if (descriptor.type === 'TM') {
                    executor = function executor() {
                        var values = descriptor.properties.map(function (compoundProp) {
                            return Slim.__lookup(source, compoundProp).obj;
                        });
                        var value = source[descriptor.methodName].apply(source, values);
                        descriptor.target._innerText = descriptor.target._innerText.replace(descriptor.expression, value);
                    };
                } else if (descriptor.type === 'R') {
                    executor = function executor() {
                        descriptor.repeater.renderList();
                    };
                } else if (descriptor.type === 'W') {
                    executor = function executor() {
                        descriptor.executor(Slim.__lookup(source, prop).obj);
                    };
                } else if (descriptor.type === 'F') {
                    executor = function executor() {
                        var value = !!Slim.__lookup(descriptor.source, prop).obj;
                        if (descriptor.reversed) {
                            value = !value;
                        }
                        if (!value) {
                            if (descriptor.target.parentNode) {
                                descriptor.target.insertAdjacentElement('beforeBegin', descriptor.helper);
                                Slim.removeChild(descriptor.target);
                            }
                        } else {
                            if (!descriptor.target.parentNode) {
                                descriptor.helper.insertAdjacentElement('beforeBegin', descriptor.target);
                                if (descriptor.target.isSlim) {
                                    descriptor.target.createdCallback();
                                }
                                Slim.removeChild(descriptor.helper);
                            }
                        }
                    };
                }
                executor.descriptor = descriptor;
                source._bindings[rootProp].executors.push(executor);
            });
        }
    }, {
        key: 'createdCallback',


        /**
         * Part of the standard web-component lifecycle. Overriding it is not recommended.
         */
        value: function createdCallback() {
            // __createdCallbackRunOnce is required for babel louzy transpiling
            if (this.isVirtual) return;
            if (this.__createdCallbackRunOnce) return;
            this.__createdCallbackRunOnce = true;
            this.initialize();
            this.onBeforeCreated();
            this._captureBindings();
            Slim.__runPlugins('create', this);
            this.onCreated();
            this.__onCreatedComplete = true;
            this.onBeforeRender();
            Slim.__runPlugins('beforeRender', this);
            Slim.__moveChildren(this._virtualDOM, this.rootElement, true);
            this.onAfterRender();
            Slim.__runPlugins('afterRender', this);
            this.update();
        }

        //noinspection JSUnusedGlobalSymbols
        /**
         * Part of the standard web-component lifecycle. Overriding it is not recommended.
         */

    }, {
        key: 'detachedCallback',
        value: function detachedCallback() {
            Slim.__runPlugins('beforeRemove', this);
            this.onRemoved();
        }

        /**
         *
         * @private
         */

    }, {
        key: '_initInteractiveEvents',
        value: function _initInteractiveEvents() {
            var _this2 = this;

            if (!this.__eventsInitialized && (Slim.autoAttachInteractionEvents || this.isInteractive || this.hasAttribute('interactive'))) Slim.interactionEventNames.forEach(function (eventType) {
                _this2.addEventListener(eventType, function (e) {
                    _this2.handleEvent(e);
                });
            });
        }

        /**
         * Part of the non-standard slim web-component's lifecycle. Overriding it is not recommended.
         */

    }, {
        key: 'initialize',
        value: function initialize() {
            this.uq_index = Slim.__createUqIndex();
            this.setAttribute('slim-uq', this.uq_index);
            this._bindings = this._bindings || {};
            this._boundChildren = this._boundChildren || [];
            this._initInteractiveEvents();
            this.__eventsInitialized = true;
            this.alternateTemplate = this.alternateTemplate || null;
            this._virtualDOM = this._virtualDOM || document.createDocumentFragment();
        }

        /**
         * Simple test if an HTML element is a Slim elememnt.
         * @returns {boolean}
         */

    }, {
        key: 'handleEvent',


        /**
         * Handles interactive events, overriding this is not recommended.
         * @param e
         */
        value: function handleEvent(e) {
            if (this.hasAttribute('on' + e.type)) {
                this.callAttribute('on' + e.type, e);
            } else if (this.hasAttribute(e.type)) {
                this.callAttribute(e.type, e);
            }
        }

        /**
         * Part of the standard web-component lifecycle. Overriding it is not recommended.
         */

    }, {
        key: 'connectedCallback',
        value: function connectedCallback() {
            this.attachedCallback();
        }

        /**
         * Part of the standard web-component lifecycle. Overriding it is not recommended.
         */

    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            this.detachedCallback();
        }

        //noinspection JSUnusedGlobalSymbols
        /**
         * Part of the standard web-component lifecycle. Overriding it is not recommended.
         */

    }, {
        key: 'attachedCallback',
        value: function attachedCallback() {
            this.onAdded();
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attr, oldValue, newValue) {
            if (oldValue === newValue) return;
            if (!this._bindings) return;
            if (this._bindings[attr]) {
                this[Slim.__dashToCamel(attr)] = newValue;
            }
        }
    }, {
        key: 'onAdded',
        value: function onAdded() {/* abstract */}
    }, {
        key: 'onRemoved',
        value: function onRemoved() {/* abstract */}
    }, {
        key: 'onBeforeCreated',
        value: function onBeforeCreated() {/* abstract */}
    }, {
        key: 'onCreated',
        value: function onCreated() {/* abstract */}
    }, {
        key: 'onBeforeRender',
        value: function onBeforeRender() {/* abstract */}
    }, {
        key: 'onAfterRender',
        value: function onAfterRender() {/* abstract */}
    }, {
        key: 'onBeforeUpdate',
        value: function onBeforeUpdate() {/* abstract */}
    }, {
        key: 'onAfterUpdate',
        value: function onAfterUpdate() {} /* abstract */

        /**
         * Part of Slim's lifecycle, overriding is not recommended without calling super.update()
         */

    }, {
        key: 'update',
        value: function update() {
            this.onBeforeUpdate();
            this._executeBindings();
            this.onAfterUpdate();
        }

        /**
         * Part of Slim's lifecycle, overriding is not recommended without calling super.render()
         */

    }, {
        key: 'render',
        value: function render(template) {
            Slim.__runPlugins('beforeRender', this);
            this.onBeforeRender();
            this.alternateTemplate = template;
            this.initialize();
            this.rootElement.innerHTML = '';
            this._captureBindings();
            this._executeBindings();
            Slim.__moveChildren(this._virtualDOM, this.rootElement, true);
            this.onAfterRender();
            Slim.__runPlugins('afterRender', this);
        }

        /**
         *
         * @param prop
         * @private
         */

    }, {
        key: '_executeBindings',
        value: function _executeBindings(prop) {
            var _this3 = this;

            if (!this._bindings) return;
            // reset bound texts
            this._boundChildren.forEach(function (child) {
                // this._boundChildren.forEach( child => {
                if (child.hasAttribute('bind') && child.sourceText !== undefined) {
                    child._innerText = child.sourceText;
                }
            });

            // execute specific binding or all
            var properties = prop ? [prop] : Object.keys(this._bindings);
            properties.forEach(function (property) {
                _this3._bindings[property].executors.forEach(function (fn) {
                    if (fn.descriptor.type !== 'T' && fn.descriptor.type !== 'TM') fn();
                });
            });

            // execute text bindings always
            Object.keys(this._bindings).forEach(function (property) {
                _this3._bindings[property].executors.forEach(function (fn) {
                    if (fn.descriptor.type === 'T' || fn.descriptor.type === 'TM') {
                        fn();
                    }
                });
                _this3._bindings[property].executors.forEach(function (fn) {
                    if (fn.descriptor.type === 'T' || fn.descriptor.type === 'TM') {
                        fn.descriptor.target.innerText = fn.descriptor.target._innerText;
                        if (fn.descriptor.target.__ieClone) {
                            fn.descriptor.target.__ieClone.innerText = fn.descriptor.target.innerText;
                        }
                    }
                });
            });
        }

        /**
         *
         * @private
         */

    }, {
        key: '_captureBindings',
        value: function _captureBindings() {
            var _this4 = this;

            var self = this;
            var $tpl = this.alternateTemplate || this.template;
            if (!$tpl) {
                while (this.firstChild) {
                    // TODO: find why this line is needed for babel!!!
                    self._virtualDOM = this._virtualDOM || document.createDocumentFragment();
                    self._virtualDOM.appendChild(this.firstChild);
                }
            } else if (typeof $tpl === 'string') {
                var frag = document.createRange().createContextualFragment($tpl);
                while (frag.firstChild) {
                    this._virtualDOM.appendChild(frag.firstChild);
                }
                var virtualContent = this._virtualDOM.querySelector('slim-content');
                if (virtualContent) {
                    while (self.firstChild) {
                        self.firstChild._boundParent = this.firstChild._boundParent || this;
                        virtualContent.appendChild(this.firstChild);
                    }
                }
            }

            var allChildren = Slim.selectorToArr(this._virtualDOM, '*');
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = allChildren[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var child = _step3.value;

                    child._sourceOuterHTML = child.outerHTML;
                    child._boundParent = child._boundParent || this;
                    self._boundChildren = this._boundChildren || [];
                    self._boundChildren.push(child);
                    self._boundChildren.push(child);
                    if (child.localName === 'style' && this.useShadow) {
                        Slim.__processStyleNode(child, this.localName, this.uq_index);
                    }
                    if (child.getAttribute('slim-id')) {
                        child._boundParent[Slim.__dashToCamel(child.getAttribute('slim-id'))] = child;
                    }
                    var slimID = child.getAttribute('slim-id');
                    if (slimID) this[slimID] = child;
                    var descriptors = [];
                    if (child.attributes) for (var i = 0; i < child.attributes.length; i++) {
                        if (!child.isSlim && !child.__eventsInitialized && Slim.interactionEventNames.indexOf(child.attributes[i].nodeName) >= 0) {
                            child.isInteractive = true;
                            child.handleEvent = self.handleEvent.bind(child);
                            child.callAttribute = self.callAttribute.bind(child);
                            child.addEventListener(child.attributes[i].nodeName, child.handleEvent);
                            child.__eventsInitialized = true;
                        }
                        var desc = Slim.__processAttribute(child.attributes[i], child);
                        if (desc) descriptors.push(desc);
                        child[Slim.__dashToCamel(child.attributes[i].nodeName)] = child.attributes[i].nodeValue;
                        if (child.attributes[i].nodeName.indexOf('#') == '0') {
                            var refName = child.attributes[i].nodeName.slice(1);
                            this[refName] = child;
                        }
                    }

                    descriptors = descriptors.sort(function (a) {
                        if (a.type === 'I') {
                            return -1;
                        } else if (a.type === 'R') return 1;else if (a.type === 'C') return 2;
                        return 0;
                    });

                    descriptors.forEach(function (descriptor) {
                        if (descriptor.type === 'P' || descriptor.type === 'M' || descriptor.type === 'C') {
                            _this4.__bind(descriptor);
                        } else if (descriptor.type === 'I') {
                            Slim.__inject(descriptor);
                        } else if (descriptor.type === 'R') {
                            Slim.__createRepeater(descriptor);
                            _this4.__bind(descriptor);
                        } else if (descriptor.type === 'F') {
                            _this4.__bind(descriptor);
                        }
                    });
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            allChildren = Slim.selectorToArr(this._virtualDOM, '*[bind]');

            // bind method-based text binds

            var _loop = function _loop(_child) {
                var match = _child.innerText.match(/\[\[(\w+)\((.+)\)]\]/g);
                if (match) {
                    match.forEach(function (expression) {
                        // group 1 -> method
                        // group 2 -> propertie(s), separated by comma, may have space
                        var matches = expression.match(Slim.rxMethod);
                        var methodName = matches[1];
                        var props = matches[3].split(' ').join('').split(',');
                        var descriptor = {
                            type: 'TM',
                            properties: props,
                            target: _child,
                            expression: expression,
                            source: _child._boundParent,
                            sourceText: _child.innerText,
                            methodName: methodName
                        };
                        _child.sourceText = _child.innerText;
                        _this4.__bind(descriptor);
                    });
                }
            };

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = allChildren[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _child = _step4.value;

                    _loop(_child);
                }
                // bind property based text binds
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = allChildren[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _child2 = _step5.value;

                    var _match = _child2.innerText.match(/\[\[([\w|.]+)\]\]/g);
                    if (_match && _child2.children.firstChild) {
                        throw 'Bind Error: Illegal bind attribute use on element type ' + _child2.localName + ' with nested children.\n' + _child2.outerHTML;
                    }
                    if (_match) {
                        var properties = [];
                        for (var _i = 0; _i < _match.length; _i++) {
                            var lookup = _match[_i].match(/([^\[].+[^\]])/)[0];
                            properties.push(lookup);
                        }
                        var descriptor = {
                            type: 'T',
                            properties: properties,
                            target: _child2,
                            sourceText: _child2.innerText
                        };
                        _child2.sourceText = _child2.innerText;
                        this.__bind(descriptor);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: 'isVirtual',


        /**
         * Checks if the element is actually placed on the DOM or is a template element only
         * @returns {boolean}
         */
        get: function get() {
            var node = this;
            while (node) {
                node = node.parentNode;
                if (!node) {
                    return true;
                }
                if (node.nodeName === 'BODY' || node.host) {
                    return false;
                }
            }
            return true;
        }

        /**
         * By default, Slim components does not use shadow dom. Override and return true if you wish to use shadow dom.
         * @returns {boolean}
         */

    }, {
        key: 'useShadow',
        get: function get() {
            return false;
        }

        /**
         * Returns the element or it's shadow root, depends on the result from useShadow()
         * @returns {*}
         */

    }, {
        key: 'rootElement',
        get: function get() {
            if (this.useShadow && this.createShadowRoot) {
                this.__shadowRoot = this.__shadowRoot || this.createShadowRoot();
                return this.__shadowRoot;
            }
            return this;
        }
    }, {
        key: 'isSlim',
        get: function get() {
            return true;
        }

        /**
         * Override and provide a template, if not given in the tag creation process.
         * @returns {*|null}
         */

    }, {
        key: 'template',
        get: function get() {
            return Slim.__templateDict[this.nodeName.toLowerCase()] || null;
        }

        /**
         * By default, interactive events are registered only if returns true, or directly requested for.
         * @returns {boolean}
         */

    }, {
        key: 'isInteractive',
        get: function get() {
            return false;
        }
    }], [{
        key: '__processStyleNode',
        value: function __processStyleNode(node, tag, uqIndex) {
            if (Slim.__isWCSupported) return;
            var rxRules = /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g;
            var unique_index = node._boundParent.uq_index;
            var match = node.innerText.match(rxRules);
            if (match) {
                match.forEach(function (selector) {
                    if (selector.indexOf(':host') <= 0) {
                        node.innerText = node.innerText.replace(selector, ':host ' + selector);
                    }
                });
            }

            var customTagName = tag + '[slim-uq="' + uqIndex + '"]';
            node.innerText = node.innerText.replace(/\:host/g, customTagName);

            if (Slim.__isIE11) {
                var ieClone = document.createElement('style');
                node.__ieClone = ieClone;
                ieClone.innerText = node.innerText;
                document.head.appendChild(ieClone);
            }
        }

        /**
         *
         * @param attribute
         * @param child
         * @returns {{type: string, target: *, targetAttribute: *, repeatAdjacent: boolean, attribute: string, properties: [*], source: (*|Slim)}}
         * @private
         */

    }, {
        key: '__processRepeater',
        value: function __processRepeater(attribute, child) {
            return {
                type: 'R',
                target: child,
                targetAttribute: child.getAttribute('slim-repeat-as') ? child.getAttribute('slim-repeat-as') : 'data',
                repeatAdjacent: child.hasAttribute('slim-repeat-adjacent') || child.localName === 'option',
                attribute: attribute.nodeName,
                properties: [attribute.nodeValue],
                source: child._boundParent
            };
        }

        /**
         *
         * @param attribute
         * @param child
         * @returns {{type: string, target: *, properties: [*], executor: (function())}}
         * @private
         */

    }, {
        key: '__processCustomAttribute',
        value: function __processCustomAttribute(attribute, child) {
            return {
                type: "C",
                target: child,
                properties: [attribute.nodeValue],
                executor: function executor() {
                    Slim.__customAttributeProcessors[attribute.nodeName].forEach(function (customAttrProcessor) {
                        customAttrProcessor(child, attribute.nodeValue);
                    });
                }
            };
        }

        /**
         * Extracts a value by using dot-notation from a target
         * @param target
         * @param expression
         * @returns {*}
         */

    }, {
        key: 'extract',
        value: function extract(target, expression) {
            var rxInject = Slim.rxInject.exec(expression);
            var rxProp = Slim.rxProp.exec(expression);
            var rxMethod = Slim.rxMethod.exec(expression);

            if (rxProp) {
                return target[rxProp[1]];
            } else if (rxMethod) {
                return target[rxMethod[1]].apply(target, rxMethod[3].replace(' ', '').split(','));
            }
        }

        /**
         *
         * @param attribute
         * @param child
         * @returns {*}
         * @private
         */

    }, {
        key: '__processAttribute',
        value: function __processAttribute(attribute, child) {
            if (attribute.nodeName === 'slim-repeat') {
                return Slim.__processRepeater(attribute, child);
            }

            if (attribute.nodeName === 'slim-if') {
                var propertyName = attribute.nodeValue;
                var reverse = false;
                if (attribute.nodeValue.charAt(0) === '!') {
                    propertyName = propertyName.slice(1);
                    reverse = true;
                }
                return {
                    type: 'F',
                    target: child,
                    source: child._boundParent,
                    helper: document.createElement('slim-if-helper'),
                    reversed: reverse,
                    properties: [propertyName]
                };
            }

            if (Slim.__customAttributeProcessors[attribute.nodeName]) {
                return Slim.__processCustomAttribute(attribute, child);
            }

            var rxInject = Slim.rxInject.exec(attribute.nodeValue);
            var rxProp = Slim.rxProp.exec(attribute.nodeValue);
            var rxMethod = Slim.rxMethod.exec(attribute.nodeValue);

            if (rxMethod) {
                return {
                    type: 'M',
                    target: child,
                    attribute: attribute.nodeName,
                    method: rxMethod[1],
                    properties: rxMethod[3].replace(' ', '').split(',')
                };
            } else if (rxProp) {
                return {
                    type: 'P',
                    target: child,
                    attribute: attribute.nodeName,
                    properties: [rxProp[1]]
                };
            } else if (rxInject) {
                return {
                    type: 'I',
                    target: child,
                    attribute: attribute.nodeName,
                    factory: rxInject[1]
                };
            }
        }
    }]);

    return Slim;
}(_CustomElement);

Slim.rxInject = /\{(.+[^(\((.+)\))])\}/;
Slim.rxProp = /\[\[(.+[^(\((.+)\))])\]\]/;
Slim.rxMethod = /\[\[(.+)(\((.+)\)){1}\]\]/;
Slim.__customAttributeProcessors = {};
Slim.__prototypeDict = {};
Slim.__uqIndex = 0;
Slim.__templateDict = {};
Slim.__plugins = {
    'create': [],
    'beforeRender': [],
    'afterRender': [],
    'beforeRemove': []
};

try {
    Slim.__isWCSupported = function () {
        return 'registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template');
    }();
} catch (err) {
    Slim.__isWCSupported = false;
}

try {
    Slim.__isIE11 = function () {
        return !!window['MSInputMethodContext'] && !!document['documentMode'];
    }();
} catch (err) {
    Slim.__isIE11 = false;
}

if (Slim.__isWCSupported) {
    Slim.selectorToArr = function (target, selector) {
        return target.querySelectorAll(selector);
    };
} else {
    Slim.selectorToArr = function (target, selector) {
        return Array.prototype.slice.call(target.querySelectorAll(selector));
    };
}

/**
 *
 * @private
 */
Slim.__initRepeater = function () {
    var SlimRepeater = function (_Slim) {
        _inherits(SlimRepeater, _Slim);

        function SlimRepeater() {
            _classCallCheck(this, SlimRepeater);

            return _possibleConstructorReturn(this, (SlimRepeater.__proto__ || Object.getPrototypeOf(SlimRepeater)).apply(this, arguments));
        }

        _createClass(SlimRepeater, [{
            key: 'onAdded',
            value: function onAdded() {
                if (!this.uq_index) {
                    this.createdCallback();
                }
                this.renderList();
            }
        }, {
            key: 'onRemoved',
            value: function onRemoved() {
                this.sourceData.unregisterSlimRepeater(this);
            }
        }, {
            key: 'registerForRender',
            value: function registerForRender() {
                var _this6 = this;

                if (this.pendingRender) return;
                this.pendingRender = true;
                setTimeout(function () {
                    _this6.checkoutRender();
                }, 0);
            }
        }, {
            key: 'checkoutRender',
            value: function checkoutRender() {
                this.pendingRender = false;
                this.renderList();
            }
        }, {
            key: 'clearList',
            value: function clearList() {
                this.clones && this.clones.forEach(function (clone) {
                    Slim.removeChild(clone);
                });
                this.clones = [];
            }
        }, {
            key: 'renderList',
            value: function renderList() {
                var _this7 = this;

                var targetPropName = this.getAttribute('target-attr');
                if (!this.sourceNode) return;
                this.clearList();
                //noinspection JSUnusedGlobalSymbols

                this.sourceData.registerSlimRepeater(this);
                this.sourceData.forEach(function (dataItem, index) {
                    var clone = _this7.sourceNode.cloneNode(true);
                    clone.removeAttribute('slim-repeat');
                    clone.removeAttribute('slim-repeat-as');
                    clone.setAttribute('slim-repeat-index', index);
                    if (!Slim.__isWCSupported) {
                        _this7.insertAdjacentHTML('beforeEnd', clone.outerHTML);
                        clone = _this7.find('*[slim-repeat-index="' + index.toString() + '"]');
                    }
                    clone[targetPropName] = dataItem;
                    clone.data_index = index;
                    clone.data_source = _this7.sourceData;
                    clone.sourceText = clone.innerText;
                    if (Slim.__isWCSupported) {
                        _this7.insertAdjacentElement('beforeEnd', clone);
                    }
                    _this7.clones.push(clone);
                });
                if (this._virtualDOM) this._captureBindings();

                var _loop2 = function _loop2(clone) {
                    clone[targetPropName] = clone[targetPropName];
                    clone._boundRepeaterParent = _this7._boundParent;
                    if (Slim.__prototypeDict[clone.localName] !== undefined || clone.isSlim) {
                        clone._boundParent = _this7._boundParent;
                    } else {
                        clone._boundParent = clone;
                    }
                    Slim.selectorToArr(clone, '*').forEach(function (element) {
                        element._boundParent = clone._boundParent;
                        element._boundRepeaterParent = clone._boundRepeaterParent;
                        element[targetPropName] = clone[targetPropName];
                        element.data_index = clone.data_index;
                        element.data_source = clone.data_source;
                    });
                };

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.clones[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var clone = _step6.value;

                        _loop2(clone);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                this._executeBindings();
                if (this._isAdjacentRepeater) {
                    this._virtualDOM && Slim.__moveChildrenBefore(this._virtualDOM, this, true);
                } else {
                    this._virtualDOM && Slim.__moveChildren(this._virtualDOM, this, true);
                }
            }
        }, {
            key: 'useShadow',
            get: function get() {
                return false;
            }
        }, {
            key: 'sourceData',
            get: function get() {
                try {
                    var lookup = Slim.__lookup(this._boundParent, this.getAttribute('source'));
                    return lookup.obj || [];
                } catch (err) {
                    return [];
                }
            }
        }]);

        return SlimRepeater;
    }(Slim);

    Slim.tag('slim-repeat', SlimRepeater);

    window.SlimRepeater = SlimRepeater;
};
window.Slim = Slim

// monkey punching array to be observable by slim repeaters
;(function () {

    var originals = {};
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
        originals[method] = Array.prototype[method];
        Array.prototype[method] = function () {
            var result = originals[method].apply(this, arguments);
            if (this.registeredSlimRepeaters) {
                this.registeredSlimRepeaters.forEach(function (repeater) {
                    repeater.registerForRender();
                });
            }
            return result;
        };
    });

    Array.prototype.registerSlimRepeater = function (repeater) {
        if (this.registeredSlimRepeaters === undefined) {
            Object.defineProperty(this, 'registeredSlimRepeaters', {
                enumerable: false,
                configurable: false,
                value: []
            });
        }

        if (this.registeredSlimRepeaters.indexOf(repeater) < 0) {
            this.registeredSlimRepeaters.push(repeater);
        }
    };

    Array.prototype.unregisterSlimRepeater = function (repeater) {
        if (this.registeredSlimRepeaters && this.registeredSlimRepeaters.indexOf(repeater) >= 0) {
            this.registeredSlimRepeaters.splice(this.registeredSlimRepeaters.indexOf(repeater), 1);
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports.Slim = Slim;
}

