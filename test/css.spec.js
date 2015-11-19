import css from '../modules/css';

describe('tiny.css', () => {
    let container = document.createElement('div');

    before(function() {
        container.innerHTML = '<ul class="list"><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li></ul>';
        document.body.appendChild(container);
    });

    after(function(){
        document.body.removeChild(container);
    });

    it('should get the element style', () => {
        expect(css(container, 'display')).to.equal('block');
        container.style.display = 'inline-block';
        expect(css(container, 'display')).to.equal('inline-block');
    });

    it('should set the element style', () => {
        css(container, 'display', 'block');
        css(container, 'width', '300px');
        css(container, 'backgroundColor', '#cc0000');

        css(container, {
            position: 'fixed',
            top: '100px',
            left: '200px'
        });

        expect(container.style.display).to.equal('block');
        expect(container.style.width).to.equal('300px');
        expect(container.style.backgroundColor).to.match(/(#cc0000|rgb\(204, 0, 0\))/i);
        expect(container.style.position).to.equal('fixed');
        expect(container.style.top).to.equal('100px');
        expect(container.style.left).to.equal('200px');
    });

    it('should set the style to an array of elements', () => {
        let children = container.querySelectorAll('.list-item');

        css(children, 'display', 'inline-block');
        expect(children[0].style.display).to.equal('inline-block');
        expect(children[1].style.display).to.equal('inline-block');
    });
});
