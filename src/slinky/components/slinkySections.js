import React, { PropTypes } from 'react';
import _ from 'lodash';

import Section from './section';

const SlinkySections = props => {
    const {
        sections,
        sectionStyle,
        headerStyle,
        handleHeaderClick,
    } = props;

    return _.map(sections, (section, num) => {
        const { header, content } = section;

        const boundHeaderClick = (handleHeaderClick) ? handleHeaderClick.bind(this, num) : () => {};

        return (
            <Section
              header={header}
              headerStyle={headerStyle}
              sectionStyle={sectionStyle}
              handleHeaderClick={boundHeaderClick}
              key={num}
            >
                {content}
            </Section>
        );
    });
};

SlinkySections.propTypes = {
    sections: PropTypes.array.isRequired,
    sectionStyle: PropTypes.object.isRequired,
    headerStyle: PropTypes.object.isRequired,
    handleHeaderClick: PropTypes.func.isRequired,
};

SlinkySections.defaultProps = { sections: [] };

export default SlinkySections;
