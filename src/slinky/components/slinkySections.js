import React, { PropTypes } from 'react';
import _ from 'lodash';

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
            <section className="slinky-section" style={sectionStyle} key={num}>
                <header
                  className="slinky-header"
                  style={{ overflow: 'hidden', cursor: 'pointer', ...headerStyle }}
                  onClick={boundHeaderClick}
                >
                    {header}
                </header>
                {content}
            </section>
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
