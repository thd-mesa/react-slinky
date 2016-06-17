import React, { PropTypes } from 'react';

import SectionHeader from './sectionHeader';
import * as classNames from '../consts/classNames';

const Section = props => {
    const {
        header,
        children,
        sectionStyle,
        handleHeaderClick,
        headerStyle
    } = props;

    return (
        <section className={classNames.SLINKY_SECTION} style={sectionStyle}>
            <SectionHeader
              onClick={handleHeaderClick}
              style={headerStyle}
            >
                {header}
            </SectionHeader>
            {children}
        </section>
    );
};

Section.propTypes = {
    header: PropTypes.object.isRequired,
    sectionStyle: PropTypes.object.isRequired,
    headerStyle: PropTypes.object.isRequired,
    handleHeaderClick: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
};

Section.defaultProps = { };

export default Section;
