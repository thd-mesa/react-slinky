import React from 'react';
import _ from 'lodash';

import Slinky from '../../slinky/slinky';

export default function App() {
    const headerStyle = {
        width: '100%',
        maxWidth: '400px',
        color: '#212121',
        padding: '.5em 1rem',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#ECEEEF'
    };

    const sectionStyle = {
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto'
    };

    const slinkySections = _.map(_.range(8), (num) =>
        ({
            header: (
                <h4>section {num}</h4>
            ),
            content: (
                <div style={{ margin: '10px 0' }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                    aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </div>
            )
        })
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div>header</div>
            <Slinky
              sections={slinkySections}
              headerStyle={headerStyle}
              sectionStyle={sectionStyle}
              innerContainerStyle={{ flex: '1' }}
              style={{ flex: '1', overflow: 'auto', display: 'flex', width: '100%' }}
            />
            <div>Footer</div>
        </div>
    );
}

App.propTypes = {
};
