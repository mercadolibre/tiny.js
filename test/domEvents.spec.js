import DOMEvents from '../modules/domEvents';

describe('DOMEvents', () => {
    let container = document.createElement('div');
    let button = document.createElement('button');
    var form;
    var input;
    var submit;

    function click(el) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
        el.dispatchEvent(event);
    }

    before(() => {
        container.innerHTML = '<div class="child"><form id="form" action="mock/sites.json"><input id="input" value=""/><input type="submit" id="submitBtn" value="Submit"></form></div>';
        document.body.appendChild(container);
        container.appendChild(button);
        form = document.querySelector('#form');
        input = document.querySelector('#input');
        submit = document.querySelector('#submitBtn');
    });

    after(() => {
        document.body.removeChild(container);
    });

    it('should just to be defined', () => {
        expect(DOMEvents).to.exist;
        expect(DOMEvents).to.have.all.keys('on', 'once', 'off', 'trigger');
    });

    describe('#on', () => {
        let cb11 = chai.spy();
        let cb12 = chai.spy();
        let cb13 = chai.spy();
        let cb14 = chai.spy(function(e){
            e.preventDefault();
        });
        let cb15 = chai.spy();

        it('should add event listener to an element', () => {
            DOMEvents.on('button', 'click', cb11);
            DOMEvents.on(button, 'click', cb12);
            DOMEvents.on('#input', 'click', cb13);
            DOMEvents.on(form, 'submit', cb14);
            DOMEvents.on(document.querySelectorAll('.non-existent-element'), 'click', cb15);
            click(button);
            click(input);
            click(submit);
            expect(cb11).to.have.been.called.once;
            expect(cb12).to.have.been.called.once;
            expect(cb13).to.have.been.called.once;
            expect(cb14).to.have.been.called.once;
            expect(cb15).to.have.not.been.called();
        });
    });

    describe('#off', () => {
        let cb21 = chai.spy();
        let cb22 = chai.spy();
        let cb23 = chai.spy();

        it('should remove event listener from an element', () => {
            DOMEvents.on('button', 'click', cb21);
            DOMEvents.on(button, 'click', cb22);
            DOMEvents.on('#input', 'click', cb23);

            DOMEvents.off('button', 'click', cb21);
            DOMEvents.off(button, 'click', cb22);
            DOMEvents.off('#input', 'click', cb23);

            click(button);
            click(input);

            expect(cb21).to.have.not.been.called();
            expect(cb22).to.have.not.been.called();
            expect(cb23).to.have.not.been.called();
        });
    });

    describe('#once', () => {
        let cb31 = chai.spy();
        let cb32 = chai.spy();

        it('should add event listener to an element that fires only once', () => {
            DOMEvents.once(button, 'click', cb31);
            DOMEvents.once(input, 'click', cb32);
            click(button);
            click(input);
            click(button);
            click(input);
            expect(cb31).to.have.been.called.once;
            expect(cb32).to.have.been.called.once;
        });
    });

    describe('#trigger', () => {
        let cb41 = chai.spy();
        let cb42 = chai.spy();
        let cb43 = chai.spy();

        it('should trigger a handler by firing an event', () => {
            DOMEvents.on(button, 'click', cb41);
            DOMEvents.on('button', 'click', cb42);
            DOMEvents.trigger(button, 'click');

            expect(cb41).to.have.been.called.once;
            expect(cb42).to.have.been.called.once;

            DOMEvents.on(document.body, 'layoutchange', cb43);
            DOMEvents.trigger(document.body, 'layoutchange');
            DOMEvents.trigger(document.body, 'layoutchange');

            expect(cb43).to.have.been.called.twice;
        });
    });

});
