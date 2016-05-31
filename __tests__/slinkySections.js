import React from 'react';
import reactDom from 'react-dom/server';
import dom from 'cheerio';
import expect from 'expect';

import slinkySectionsComponent from '../src/slinky/components/slinkySections';
const render = reactDom.renderToStaticMarkup;

describe('listBuilderActionsOnSelectedListItems component', () => {
    it('returns an html section for every section', () => {
        const header = (<h1>yo!</h1>);
        const content = (<div>lipsum orem</div>);
        const props = {
            sections: [{ header, content }]
        };
        const element = slinkySectionsComponent(props);
        expect(element).toNotEqual(null);
        const $ = dom.load(render(element));
        const greeting = $('h1').html();
        expect(greeting).toEqual('Hello!');
    });
});
