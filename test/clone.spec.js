import clone from '../modules/clone';

describe('tiny.clone', () => {
    it('is should clone all enumerable properties of an object', () => {
        let source = {
            a: 1,
            b: 2,
            c() {
                let x = 4;
                return ++x;
            },
            d: {
                e: 3
            }
        };

        let target = clone(source);

        expect(target).to.be.eql(target);
        let fn = source.c;
        expect(fn()).to.be.equal(5);
        fn = function() { return 0; };
        expect(target.c()).to.be.equal(5);
    });
});
