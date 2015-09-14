import {addClass, removeClass, hasClass} from '../modules/classList';

describe('tiny.classList', () => {
    let container = document.createElement('div');

    before(function() {
        container.innerHTML = '<div class="child"></div>';
        document.body.appendChild(container);
    });

    after(function(){
        document.body.removeChild(container);
    });

    it('is should handle Element\'s classes like a Element.classList', () => {
        expect(hasClass(container, 'xxx')).to.be.false;
        addClass(container, 'xxx');
        expect(hasClass(container, 'xxx')).to.be.true;

        let child = container.querySelector('.child');
        expect(hasClass(child, 'child')).to.be.true;
        addClass(child, 'daughter');
        expect(child.className).to.equal('child daughter');

        // Would be nice to handle multiple classNames
        removeClass(child, 'daughter');
        removeClass(child, 'child');
        expect(child.className).to.be.empty;
    });
});
