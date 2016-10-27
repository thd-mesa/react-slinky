'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SlinkySections = function SlinkySections(props) {
    var sections = props.sections;
    var sectionStyle = props.sectionStyle;
    var headerStyle = props.headerStyle;
    var handleHeaderClick = props.handleHeaderClick;

    return _lodash2.default.map(sections, function (section, num) {
        var header = section.header;
        var content = section.content;


        var boundHeaderClick = handleHeaderClick ? handleHeaderClick.bind(undefined, num) : function () {};

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
};

SlinkySections.propTypes = {
    sections: _react.PropTypes.array.isRequired,
    sectionStyle: _react.PropTypes.object.isRequired,
    headerStyle: _react.PropTypes.object.isRequired,
    handleHeaderClick: _react.PropTypes.func.isRequired
};

SlinkySections.defaultProps = { sections: [] };

exports.default = SlinkySections;