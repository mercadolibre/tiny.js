import next from '../modules/next';

describe('tiny.next', () => {
    let container = document.createElement('div');
    let list,
        listItems;

    before(function() {
        container.innerHTML = '<ul class="list"><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li><li class="list-item"></li></ul>';
        document.body.appendChild(container);

        list = document.querySelector('.list');
        listItems = list.querySelectorAll('.list-item');
    });

    after(function(){
        document.body.removeChild(container);
    });

    it('should just to be defined', () => {
        expect(next).to.exist;
        expect(next).to.be.a('function');
    });

    it('should find the next element sibling', () => {
        expect(next(listItems[0])).to.eql(listItems[1]);
    });

    it('should return null when the next sibling is not exist', () => {
        expect(next(listItems[4])).to.be.null;
    });
});
