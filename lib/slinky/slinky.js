'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slinky = function (_React$Component) {
    _inherits(Slinky, _React$Component);

    function Slinky(props) {
        _classCallCheck(this, Slinky);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Slinky).call(this, props));

        _this.setPointerEvents = _this.setPointerEvents.bind(_this);
        _this.enablePointerEvents = _this.enablePointerEvents.bind(_this);
        _this.disablePointerEvents = _this.disablePointerEvents.bind(_this);
        _this.handleWheel = _this.handleWheel.bind(_this);
        _this.handleResize = _this.handleResize.bind(_this);
        _this.handleHeaderClick = _this.handleHeaderClick.bind(_this);
        _this.refresh = _lodash2.default.throttle(_this.refresh.bind(_this), 100);
        _this.initializeSections = _this.initializeSections.bind(_this);

        _this.state = {
            headers: []
        };
        return _this;
    }

    _createClass(Slinky, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            window.addEventListener('resize', this.handleResize);
            this.initializeSections(function () {
                _this2.refresh();
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize);
        }
    }, {
        key: 'getSections',
        value: function getSections(container) {
            return container.getElementsByClassName('slinky-section');
        }
    }, {
        key: 'getSectionHeader',
        value: function getSectionHeader(section) {
            return _lodash2.default.first(section.getElementsByClassName('slinky-header'));
        }
    }, {
        key: 'getElementsTop',
        value: function getElementsTop(el) {
            var offsetParent = el.offsetParent;
            return el.getBoundingClientRect().top - offsetParent.getBoundingClientRect().top;
        }
    }, {
        key: 'setPointerEvents',
        value: function setPointerEvents(val) {
            var sections = this.getSections(this.slinkyContainer);
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                section.style.pointerEvents = val;
            }
        }
    }, {
        key: 'enablePointerEvents',
        value: function enablePointerEvents() {
            this.setPointerEvents('');
            this.timer = undefined;
        }
    }, {
        key: 'disablePointerEvents',
        value: function disablePointerEvents() {
            this.setPointerEvents('none');
        }
    }, {
        key: 'handleWheel',
        value: function handleWheel() {
            if (this.timer) {
                clearTimeout(this.timer);
            } else {
                this.disablePointerEvents();
            }
            this.timer = setTimeout(this.enablePointerEvents, 100);
        }
    }, {
        key: 'handleResize',
        value: function handleResize() {
            this.initializeSections();
        }
    }, {
        key: 'handleHeaderClick',
        value: function handleHeaderClick(headerIndex) {
            var stateHeader = this.state.headers[headerIndex];

            var scrollTo = stateHeader.scrollTo;

            var currentScrollTop = this.slinkyScrollingContainer.scrollTop;

            var collapseTolerance = 5;

            if (Math.abs(currentScrollTop - scrollTo) < collapseTolerance) {
                if (headerIndex < this.state.headers.length) {
                    var nextStateHeader = this.state.headers[headerIndex + 1];
                    scrollTo = nextStateHeader.scrollTo;
                }
            }

            this.slinkyScrollingContainer.scrollTop = scrollTo;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this3 = this;

            var scrollerHeight = this.slinkyContainer.offsetHeight;
            var specifiedHeaderWidth = _lodash2.default.get(this, 'props.headerStyle.width');
            var fullWidthHeader = !specifiedHeaderWidth || specifiedHeaderWidth === '100%';

            var headers = _lodash2.default.map(this.state.headers, function (header) {
                var newHeader = _lodash2.default.cloneDeep(header);
                var position = '';

                var top = _this3.getElementsTop(newHeader.parent);

                if (top < newHeader.top) {
                    position = 'top';
                } else if (top + newHeader.height >= scrollerHeight - newHeader.bottom) {
                    position = 'bottom';
                }

                if (position) {
                    // Don’t do anything if the header is already positioned properly.
                    if (newHeader.position !== position) {
                        newHeader.parent.style.paddingTop = newHeader.height + 'px';
                        newHeader.header.style.position = 'absolute';
                        newHeader.header.style[position] = newHeader[position] + 'px';
                        newHeader.header.style[position === 'top' ? 'bottom' : 'top'] = '';
                        newHeader.position = position;
                        if (fullWidthHeader) {
                            // Make sure the header doesn't overlap the scrollbar if
                            // the header will be full width
                            var parentWidth = newHeader.parent.getBoundingClientRect().width;
                            newHeader.header.style.width = parentWidth + 'px';
                        }
                    }
                } else {
                    newHeader.parent.style.paddingTop = '';
                    newHeader.header.style.position = '';
                    if (fullWidthHeader) {
                        newHeader.header.style.width = specifiedHeaderWidth;
                    }
                    newHeader.position = '';
                }

                return newHeader;
            });

            this.setState({
                headers: headers
            });
        }
    }, {
        key: 'initializeSections',
        value: function initializeSections(cb) {
            var _this4 = this;

            var sections = this.getSections(this.slinkyContainer);
            var headers = _lodash2.default.map(sections, function (section) {
                var header = _this4.getSectionHeader(section);

                return {
                    header: header,
                    parent: section,
                    height: header.offsetHeight,
                    position: '' // can be 'top' or 'bottom'
                };
            });

            // Pre-calculate the offsets that the headers would have
            // from the top or bottom of the scroller.
            for (var i = 0; i < headers.length; i++) {
                var header = headers[i];
                if (i > 0) {
                    var previousHeader = headers[i - 1];
                    header.top = previousHeader.top + previousHeader.height;
                    var previousSection = previousHeader.parent;
                    header.scrollTo = previousHeader.scrollTo + (previousSection.scrollHeight - previousHeader.height);
                } else {
                    header.top = 0;
                    header.scrollTo = 0;
                }
            }

            for (var _i = headers.length - 1; _i >= 0; _i--) {
                var _header = headers[_i];
                if (_i < headers.length - 1) {
                    var _previousHeader = headers[_i + 1];
                    _header.bottom = _previousHeader.bottom + _previousHeader.height;
                } else {
                    _header.bottom = 0;
                }
            }

            this.setState({
                headers: headers
            }, cb);

            if (this.props.defaultSectionIndex && headers.length > this.props.defaultSectionIndex) {
                var _header2 = headers[this.props.defaultSectionIndex];
                this.slinkyScrollingContainer.scrollTop = _header2.scrollTo;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _props = this.props;
            var sections = _props.sections;
            var headerStyle = _props.headerStyle;
            var sectionStyle = _props.sectionStyle;
            var innerContainerStyle = _props.innerContainerStyle;
            var style = _props.style;


            var styles = {
                mainContainer: {
                    position: 'relative'
                },
                innerContainer: {
                    overflow: 'auto'
                }
            };

            var slinkySections = _lodash2.default.map(sections, function (section, num) {
                var header = section.header;
                var content = section.content;


                var boundHeaderClick = _this5.handleHeaderClick.bind(_this5, num);

                return _react2.default.createElement(
                    'section',
                    { className: 'slinky-section', style: sectionStyle, key: num },
                    _react2.default.createElement(
                        'header',
                        {
                            className: 'slinky-header',
                            style: _extends({ overflow: 'hidden', cursor: 'pointer' }, headerStyle),
                            onClick: boundHeaderClick
                        },
                        header
                    ),
                    content
                );
            });

            return _react2.default.createElement(
                'div',
                _extends({
                    ref: function ref(_ref2) {
                        _this5.slinkyContainer = _ref2;
                    },
                    className: 'slinky-container'
                }, this.props, {
                    style: _extends({}, styles.mainContainer, style)
                }),
                _react2.default.createElement(
                    'div',
                    {
                        ref: function ref(_ref) {
                            _this5.slinkyScrollingContainer = _ref;
                        },
                        style: _extends({}, styles.innerContainer, innerContainerStyle),
                        onScroll: this.refresh,
                        onWheel: this.handleWheel
                    },
                    slinkySections
                )
            );
        }
    }]);

    return Slinky;
}(_react2.default.Component);

Slinky.propTypes = {
    sections: _react.PropTypes.array.isRequired,
    headerStyle: _react.PropTypes.object,
    sectionStyle: _react.PropTypes.object,
    innerContainerStyle: _react.PropTypes.object,
    style: _react.PropTypes.object,
    defaultSectionIndex: _react.PropTypes.number
};

exports.default = Slinky;