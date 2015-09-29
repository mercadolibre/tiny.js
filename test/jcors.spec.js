import jcors from '../modules/jcors';

describe('tiny.jcors', () => {

    after(() => {
        window.fn1 = null;
        window.fn2 = null;
    });

    it('should just to be defined', () => {
        expect(jcors).to.exist;
    });

    it('should load scripts in parallel with credentials', (done) => {
        let cb1 = function() {
            expect(callback1).to.be.called.once;
            expect(callback2).to.have.not.been.called();
            expect(window.fn1).to.exist;
            expect(window.fn2).to.not.exist;
            expect(window.fn1()).to.equal('fn1');
        };
        let cb2 = function() {
            expect(callback2).to.be.called.once;
            expect(window.fn2).to.exist;
            expect(window.fn2()).to.equal('fn2');
            done();
        };
        let callback1 = chai.spy(cb1);
        let callback2 = chai.spy(cb2);

        jcors('mock/jcors-1.js', callback1, 'mock/jcors-2.js', callback2);
    });
});
