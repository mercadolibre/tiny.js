import offset from '../modules/offset';

describe('tiny.offset', () => {

    let container = document.createElement('div'),
        child;

    before(() => {
        document.body.style.padding = '0px';
        document.body.style.margin = '0px';
        container.innerHTML = '<div class="child"></div>';
        document.body.appendChild(container);

        child = container.querySelector('.child');
    });

    after(() => {
        document.body.style.padding = '';
        document.body.style.margin = '';
        document.body.removeChild(container);
    });

    it('should just to be defined', () => {
        expect(offset).to.exist;
    });

    it('should return the initial offset of an element', () => {
        expect(offset(child)).to.eql({left: 0, top: 0});
    });

    describe('after the redimension of elements', () => {
        before(() => {
            container.style.padding = '100px';
            container.style.margin = '100px';
        });

        after(() => {
            container.style.padding = '';
            container.style.margin = '';
        });

        it('should return the current offset of an element', () => {
            expect(offset(child)).to.eql({left: 200, top: 200});
        });
    });

    describe('after the reposition of the parents', () => {
        before(() => {
            container.style.position = 'absolute';
            container.style.top = '50px';
            container.style.left = '50px';
        });

        after(() => {
            container.style.position = '';
            container.style.top = '';
            container.style.left = '';
        });

        it('should return the current offset of an element', () => {
            expect(offset(child)).to.eql({left: 50, top: 50});
        });
    });

    describe('after the reposition of all elements', () => {
        before(() => {
            document.body.style.padding = '20px';

            container.style.position = 'fixed';
            container.style.top = '200px';
            container.style.left = '200px';

            child.style.position = 'absolute';
            child.style.top = '200px';
            child.style.left = '200px';
        });

        after(() => {
            container.style.position = '';
            container.style.top = '';
            container.style.left = '';

            child.style.position = '';
            child.style.top = '';
            child.style.left = '';
        });

        it('should return the current offset of an element that stays in a fixed parent', () => {
            expect(offset(child)).to.eql({left: 400, top: 400});
        });
    });

});
