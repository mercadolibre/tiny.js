import inherits from '../modules/inherits';

describe('tiny.inherits', () => {
    it('is should just to be defined', () => {
        expect(inherits).to.exist;
    });

    it('is should inherits the prototype of parent constructor', () => {
        function target() {
            this.x = null;
        }

        function source() {
            this.z = 3;
        }
        source.prototype.a = function() {
            this.x = 1;
        }
        source.prototype.b = function() {
            this.y = 2;
        }

        expect(target.prototype).to.exist;
        expect(target.prototype.a).to.be.undefined;
        expect(target.prototype.b).to.be.undefined;

        inherits(target, source);

        expect(target.prototype.a).to.be.a('function');
        expect(target.prototype.b).to.be.a('function');

        let fn = new target();

        expect(fn.x).to.be.null;
        expect(fn.y).to.be.undefined;
        expect(fn.z).to.be.undefined;

        fn.a();
        fn.b();

        expect(fn.x).to.equal(1);
        expect(fn.y).to.equal(2);
    });

});
