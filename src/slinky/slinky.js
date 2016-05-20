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
        this.handleHeaderClick = this.handleHeaderClick.bind(this);
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
        const offsetParent = el.offsetParent;
        return el.getBoundingClientRect().top - offsetParent.getBoundingClientRect().top;
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
    handleHeaderClick(headerIndex) {
        const stateHeader = this.state.headers[headerIndex];

        let scrollTo = stateHeader.scrollTo;

        const currentScrollTop = this.slinkyScrollingContainer.scrollTop;

        const collapseTolerance = 5;

        if (Math.abs(currentScrollTop - scrollTo) < collapseTolerance) {
            if (headerIndex < this.state.headers.length) {
                const nextStateHeader = this.state.headers[headerIndex + 1];
                scrollTo = nextStateHeader.scrollTo;
            }
        }

        this.slinkyScrollingContainer.scrollTop = scrollTo;
    }
    refresh() {
        const scrollerHeight = this.slinkyContainer.offsetHeight;
        const specifiedHeaderWidth = _.get(this, 'props.headerStyle.width');
        const fullWidthHeader = (!specifiedHeaderWidth || specifiedHeaderWidth === '100%');

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
                    if (fullWidthHeader) {
                        // Make sure the header doesn't overlap the scrollbar if
                        // the header will be full width
                        const parentWidth = newHeader.parent.getBoundingClientRect().width;
                        newHeader.header.style.width = `${parentWidth}px`;
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
                const previousSection = previousHeader.parent;
                header.scrollTo = (previousHeader.scrollTo +
                    (previousSection.scrollHeight - previousHeader.height)
                );
            } else {
                header.top = 0;
                header.scrollTo = 0;
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

        if (this.props.defaultSectionIndex && headers.length > this.props.defaultSectionIndex) {
            const header = headers[this.props.defaultSectionIndex];
            this.slinkyScrollingContainer.scrollTop = header.scrollTo;
        }
    }
    render() {
        const { sections, headerStyle, sectionStyle, innerContainerStyle, style } = this.props;

        const styles = {
            mainContainer: {
                position: 'relative'
            },
            innerContainer: {
                overflow: 'auto'
            }
        };

        const slinkySections = _.map(sections, (section, num) => {
            const { header, content } = section;

            const boundHeaderClick = this.handleHeaderClick.bind(this, num);

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

        return (
            <div
              ref={(ref) => { this.slinkyContainer = ref; }}
              className="slinky-container"
              {...this.props}
              style={{ ...styles.mainContainer, ...style }}
            >
                <div
                  ref={(ref) => { this.slinkyScrollingContainer = ref; }}
                  style={{ ...styles.innerContainer, ...innerContainerStyle }}
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
    innerContainerStyle: PropTypes.object,
    style: PropTypes.object,
    defaultSectionIndex: PropTypes.number
};

export default Slinky;
