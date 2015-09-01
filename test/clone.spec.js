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
        let d = source.d;

        expect(fn()).to.be.equal(5);
        expect(d).to.eql({e:3});

        fn = function() { return 0; };
        d = {
            e: 0
        };

        expect(target.c()).to.equal(5);
        expect(target.d).to.eql({e:3});

        let nullObject = null;
        let nullObjectClone = clone(nullObject);
        expect(nullObjectClone).to.eql({});

        let cloneString = function() {
            return clone('asd');
        }
        expect(cloneString).to.throw(Error);
    });
});
