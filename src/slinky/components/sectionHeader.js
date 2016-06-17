import React, { PropTypes } from 'react';

import * as classNames from '../consts/classNames';

const SectionHeader = props => {
    const {
        style,
        onClick,
        children
    } = props;

    const defaultStyle = {
        overflow: 'hidden',
        cursor: 'pointer'
    };

    return (
        <header
          className={classNames.SLINKY_HEADER}
          style={{ ...defaultStyle, ...style }}
          onClick={onClick}
        >
            {children}
        </header>
    );
};

SectionHeader.propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func,
    children: PropTypes.element.isRequired
};

SectionHeader.defaultProps = {
};

export default SectionHeader;
