import * as events from '../modules/events';

describe('tiny.events', () => {
    it('is should be defined', () => {
        expect(events).to.exist;
    });
    it('is should be an object', () => {
        expect(events).to.be.an('object');
        expect(events).to.have.all.keys('onlayoutchange', 'onresize', 'onscroll',
            'onpointerdown', 'onpointerup', 'onpointermove', 'onpointertap',
            'onpointerenter', 'onpointerleave', 'onkeyinput');
    });
});
