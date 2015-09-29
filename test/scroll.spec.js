import scroll from '../modules/scroll';

describe('tiny.scroll', () => {
    let container = document.createElement('div');

    before(() => {
        document.body.appendChild(container);
        container.style.height = '5000px';
    });

    after(() => {
        document.body.style.height = '';
    });

    it('should just to be defined', () => {
        expect(scroll).to.exist;
    });
    it('should have all expected keys', () => {
        expect(scroll()).to.have.all.keys('top', 'left');
    });
    it('should return the initial scroll position', () => {
        let s = scroll();

        expect(s).to.eql({left: 0, top: 0});
    });

    describe('after the scroll of document', () => {
        before(() => {
            document.body.scrollTop = 200;
        });

        // Skip in PhantomJS due to adaptive nature of its viewport height (requires additional configuration)
        (/PhantomJS/.test(navigator.userAgent) ? it.skip : it)('should return the current scroll position', () => {
            let s = scroll();
            expect(s).to.eql({left: 0, top: 200});
        });
    });
});
