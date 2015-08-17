import extend from '../modules/extend';

describe('tiny.extend', () => {
    it('is should just to be defined', () => {
        expect(extend).to.exist;
    });

    it('is should extend multiple sources', () => {
        let result = extend({}, {a: 1}, {b: 2});

        expect(Object.keys(result).length).to.be.equal(2);
        expect(result).to.have.all.keys(['a', 'b']);
        expect(result).to.deep.equal({ a:1, b:2 });
    });

    it('is should deeply extend the objects', () => {
        let result = extend(true,
            {
                a: {
                    b: 0
                },
                c: {
                    d: 1
                }
            }, {
                a: {
                    b: 1
                }
            }, {
                c: {
                    d: 2
                },
                e: 3
            }, {
                c: {
                    f: 4
                }
            });

        expect(Object.keys(result).length).to.be.equal(3);
        expect(result).to.have.all.keys(['a', 'c', 'e']);
        expect(result).to.deep.equal({a: {b: 1}, c: {d: 2, f: 4}, e: 3});
    });
});
