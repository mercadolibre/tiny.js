import support from '../modules/support';

describe('tiny.support', () => {
    describe('.touch', () => {
        it('is should check is the browser supports touch events', () => {
            expect(typeof support.touch).to.equal('boolean');
        });
    });
    describe('.animation', () => {
        it('is should check is the browser supports CSS animations', () => {
            expect(support.animation).to.exist;
        });
    });
    describe('.transition', () => {
        it('is should check is the browser supports CSS transitions', () => {
            expect(support.transition).to.exist;
        });
    });
});
