import isPlainObject from '../modules/isPlainObject';

describe('tiny.isPlainObject', () => {
    it('is should determine the plain nature of the object', () => {
        function fn () {}

        // The use case that we want to match
        expect(isPlainObject({})).to.be.true;
        expect(isPlainObject({a: 1})).to.be.true;

        // Not objects shouldn't be matched
        expect(isPlainObject('')).to.be.false;
        expect(isPlainObject(0)).to.be.false;
        expect(isPlainObject(true)).to.be.false;
        expect(isPlainObject(null)).to.be.false;
        expect(isPlainObject(undefined)).to.be.false;

        // Arrays shouldn't be matched
        expect(isPlainObject([])).to.be.false;

        // Functions shouldn't be matched
        expect(isPlainObject(fn)).to.be.false;
        expect(isPlainObject(fn.prototype)).to.be.false;

        // Instantiated objects shouldn't be matched
        expect(isPlainObject(new Date())).to.be.false;
        expect(isPlainObject(new fn())).to.be.false;

        // DOM nodes shouldn't be matched
        expect(isPlainObject(document.body)).to.be.false;

        // window shouldn't be matched
        expect(isPlainObject(window)).to.be.false;
    });
});
