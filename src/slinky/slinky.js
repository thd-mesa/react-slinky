import React, { PropTypes } from 'react';
import _ from 'lodash';

class Slinky extends React.Component {
    constructor(props) {
        super(props);
        this.setPointerEvents = this.setPointerEvents.bind(this);
        this.enablePointerEvents = this.enablePointerEvents.bind(this);
        this.disablePointerEvents = this.disablePointerEvents.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.refresh = _.throttle(this.refresh.bind(this), 100);
        this.initializeSections = this.initializeSections.bind(this);

        this.state = {
            headers: []
        };
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.initializeSections(() => {
            this.refresh();
        });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    getSections(container) {
        return container.getElementsByClassName('slinky-section');
    }
    getSectionHeader(section) {
        return _.first(section.getElementsByClassName('slinky-header'));
    }
    getElementsTop(el) {
        return el.getBoundingClientRect().top;
    }
    setPointerEvents(val) {
        const sections = this.getSections(this.slinkyContainer);
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            section.style.pointerEvents = val;
        }
    }
    enablePointerEvents() {
        this.setPointerEvents('');
        this.timer = undefined;
    }
    disablePointerEvents() {
        this.setPointerEvents('none');
    }
    handleWheel() {
        if (this.timer) {
            clearTimeout(this.timer);
        } else {
            this.disablePointerEvents();
        }
        this.timer = setTimeout(this.enablePointerEvents, 100);
    }
    handleResize() {
        this.initializeSections();
    }
    refresh() {
        const scrollerHeight = this.slinkyContainer.offsetHeight;

        const headers = _.map(this.state.headers, (header) => {
            const newHeader = _.cloneDeep(header);
            let position = '';

            const top = this.getElementsTop(newHeader.parent);

            if (top < newHeader.top) {
                position = 'top';
            } else if (top + newHeader.height >= scrollerHeight - newHeader.bottom) {
                position = 'bottom';
            }

            if (position) {
                // Don’t do anything if the header is already positioned properly.
                if (newHeader.position !== position) {
                    newHeader.parent.style.paddingTop = `${newHeader.height}px`;
                    newHeader.header.style.position = 'absolute';
                    newHeader.header.style[position] = `${newHeader[position]}px`;
                    newHeader.header.style[position === 'top' ? 'bottom' : 'top'] = '';
                    newHeader.position = position;
                }
            } else {
                newHeader.parent.style.paddingTop = '';
                newHeader.header.style.position = '';
                newHeader.position = '';
            }

            return newHeader;
        });

        this.setState({
            headers
        });
    }
    initializeSections(cb) {
        const sections = this.getSections(this.slinkyContainer);
        const headers = _.map(sections, (section) => {
            const header = this.getSectionHeader(section);

            return {
                header,
                parent: section,
                height: header.offsetHeight,
                position: '' // can be 'top' or 'bottom'
            };
        });

        // Pre-calculate the offsets that the headers would have
        // from the top or bottom of the scroller.
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (i > 0) {
                const previousHeader = headers[i - 1];
                header.top = (previousHeader.top + previousHeader.height);
            } else {
                header.top = 0;
            }
        }

        for (let i = headers.length - 1; i >= 0; i--) {
            const header = headers[i];
            if (i < headers.length - 1) {
                const previousHeader = headers[i + 1];
                header.bottom = (previousHeader.bottom + previousHeader.height);
            } else {
                header.bottom = 0;
            }
        }

        this.setState({
            headers
        }, cb);
    }
    render() {
        const { sections, headerStyle, sectionStyle, style } = this.props;

        const styles = {
            mainContainer: {
                position: 'relative'
            },
            innerContainer: {
                height: '100%',
                overflow: 'auto'
            }
        };

        const slinkySections = _.map(sections, (section, num) => {
            const { header, content } = section;

            return (
                <section className="slinky-section" style={sectionStyle} key={num}>
                    <header
                      className="slinky-header"
                      style={{ overflow: 'hidden', ...headerStyle }}
                    >
                        {header}
                    </header>
                    {content}
                </section>
            );
        });

        return (
            <div
              ref={(ref) => { this.slinkyContainer = ref; }}
              className="slinky-container"
              {...this.props}
              style={{ ...styles.mainContainer, ...style }}
            >
                <div style={styles.innerContainer}
                  onScroll={this.refresh}
                  onWheel={this.handleWheel}
                >
                    {slinkySections}
                </div>
            </div>
        );
    }
}

Slinky.propTypes = {
    sections: PropTypes.array.isRequired,
    headerStyle: PropTypes.object,
    sectionStyle: PropTypes.object,
    style: PropTypes.object
};

export default Slinky;
