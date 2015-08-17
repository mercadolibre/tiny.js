import classList from '../modules/classList';

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
        expect(classList(container).contains('xxx')).to.be.false;
        classList(container).add('xxx');
        expect(classList(container).contains('xxx')).to.be.true;

        let child = container.querySelector('.child');
        expect(classList(child).contains('child')).to.be.true;
        classList(child).add('daughter');
        expect(child.className).to.equal('child daughter');

        // Would be nice to handle multiple classNames
        classList(child).remove('daughter');
        classList(child).remove('child');
        expect(child.className).to.be.empty;
    });
});
