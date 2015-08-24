import { domEvents } from '../modules/domEvents';

describe('domEvents', () => {
    let container = document.createElement('div');
    let button = document.createElement('button');

    function click(el) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
        el.dispatchEvent(event);
    }

    before(() => {
        container.innerHTML = '<div class="child"></div>';
        document.body.appendChild(container);
        container.appendChild(button);
    });

    after(() => {
        document.body.removeChild(container);
    });

    it('should just to be defined', () => {
        expect(domEvents).to.exist;
        expect(domEvents).to.have.all.keys('Event', 'on', 'one', 'off', 'trigger', 'triggerHandler');
    });

    describe('#on', () => {
        let cb11 = chai.spy();
        let cb12 = chai.spy();

        it('should add event listener to an element', () => {
            domEvents.on('button', 'click', cb11);
            domEvents.on(button, 'click.special', cb11);
            domEvents.on('body', 'click', 'button', cb12);
            domEvents.on(document.body, 'click', 'button', cb12);
            click(button);
            expect(cb11).to.have.been.called.twice;
            expect(cb12).to.have.been.called.twice;
        });
    });

    describe('#off', () => {
        let cb21 = chai.spy();
        let cb22 = chai.spy();
        let cb23 = chai.spy();

        it('should remove event listener from an element', () => {
            domEvents.on(button, 'click', cb21);
            domEvents.on('button', 'click', cb22);
            domEvents.on(document.body, 'click', 'button', cb23);
            domEvents.on(document.body, 'click.special', 'button', cb23);

            domEvents.off(button, 'click');
            domEvents.off(document.body, 'click.special', 'button', cb23);

            click(button);

            expect(cb21).to.have.not.been.called();
            expect(cb22).to.have.not.been.called();
            expect(cb23).to.have.been.called.once;
        });
    });

    describe('#one', () => {
        let cb31 = chai.spy();
        let cb32 = chai.spy();

        it('should add event listener to an element that fires only once', () => {
            domEvents.one(button, 'click', cb31);
            domEvents.one(document.body, 'click', 'button', cb32);
            click(button);
            click(button);
            click(button);
            expect(cb31).to.have.been.called.once;
            expect(cb32).to.have.been.called.once;
        });
    });

    describe('#trigger', () => {
        let cb41 = chai.spy();
        let cb42 = chai.spy();
        let cb43 = chai.spy();

        it('should trigger a handler by firing an event', () => {
            domEvents.on(button, 'click', cb41);
            domEvents.on('button', 'click', cb42);
            domEvents.trigger(button, 'click');

            expect(cb41).to.have.been.called.once;
            expect(cb42).to.have.been.called.once;

            domEvents.on(document.body, 'layoutchange', cb43);
            domEvents.trigger(document.body, 'layoutchange');
            domEvents.trigger(document.body, 'layoutchange');

            expect(cb43).to.have.been.called.twice;
        });
    });

    describe('#triggerHandler', () => {
        let cb51 = chai.spy();
        let cb52 = chai.spy();

        it('should trigger an event handler without the triggering of an actual event', () => {
            domEvents.on(button, 'click', cb51);
            domEvents.on(button, 'click', cb52);
            domEvents.triggerHandler(button, 'click');

            expect(cb51).to.have.been.called.once;
            expect(cb52).to.have.been.called.once;
        });
    });

});
