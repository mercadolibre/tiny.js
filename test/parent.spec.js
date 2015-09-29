import parent from '../modules/parent';

describe('tiny.parent', () => {
    let container = document.createElement('div');
    let list,
        listItem;

    before(function() {
        container.innerHTML = '<ul class="list"><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li></ul>';
        document.body.appendChild(container);

        list = document.querySelector('.list');
        listItem = list.querySelector('.list-item');
    });

    after(function(){
        document.body.removeChild(container);
    });

    it('should just to be defined', () => {
        expect(parent).to.exist;
    });

    it('should find the parent element', () => {
        expect(parent(listItem)).to.exist;
        expect(parent(listItem).tagName).to.equal('UL');
        expect(parent(listItem, 'div').tagName).to.equal('DIV');
        expect(parent(listItem, 'html')).to.eql(document.documentElement);
        expect(parent(list).tagName).to.equal('DIV');
    });

    it('should return null when parent is not exist', () => {
        expect(parent(container, 'header')).to.be.null;
    });
});
