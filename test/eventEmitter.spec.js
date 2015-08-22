import EventEmitter from '../modules/eventEmitter';

describe('tiny.EventEmitter', () => {
    let eventName = 'some:event',
        anotherEventName = 'another:event',
        wrongEventName = 'wrong:event';

    it('should just to be defined', () => {
        expect(EventEmitter).to.exist;
    });

    describe('#on', () => {
        it('is aliased as addListener', () => {
            expect(EventEmitter.prototype.on).to.eql(EventEmitter.prototype.addListener);
        });

        it('should add a handler for a specified event', () => {
            let emitter = new EventEmitter,
                fn = function() {};

            emitter.on(eventName, fn);

            expect(!!~emitter.listeners(eventName).indexOf(fn)).to.be.true;
            expect(!!~emitter.listeners(wrongEventName).indexOf(fn)).to.be.false;
            expect(EventEmitter.listenerCount(emitter, eventName)).to.equal(1);
        });
    });

    describe('#emit', () => {
        it('should invoke all handlers for a given event', () => {
            let emitter = new EventEmitter,
                spy1 = chai.spy(),
                spy2 = chai.spy(),
                spy3 = chai.spy();

            emitter.on(eventName, spy1);
            emitter.on(eventName, spy2);
            emitter.on(wrongEventName, spy3);

            emitter.emit(eventName);

            expect(spy1).to.have.been.called.once;
            expect(spy2).to.have.been.called.once;
            expect(spy3).to.not.have.been.called();
        });
    });

    describe('#removeListener', () => {
        it('should remove a given handler for a given event', () => {
            var emitter = new EventEmitter,
                spy1 = chai.spy(),
                spy2 = chai.spy();

            emitter.on(eventName, spy1);
            emitter.on(eventName, spy2);

            emitter.removeListener(eventName, spy1);
            emitter.emit(eventName);

            expect(spy1).to.not.have.been.called();
            expect(spy2).to.have.been.called.once;
        });
    });


    describe('#removeAllListeners', () => {
        it('should remove all listeners for a given event', () => {
            var emitter = new EventEmitter,
                spy1 = chai.spy(),
                spy2 = chai.spy(),
                spy3 = chai.spy();

            emitter.on(eventName, spy1);
            emitter.on(eventName, spy2);
            emitter.on(anotherEventName, spy3);

            emitter.removeAllListeners(eventName);
            emitter.emit(eventName);
            emitter.emit(anotherEventName);

            expect(spy1).to.not.have.been.called();
            expect(spy2).to.not.have.been.called();
            expect(spy3).to.have.been.called.once;
        });

        it('should remove just all listeners', () => {
            var emitter = new EventEmitter,
                spy1 = chai.spy(),
                spy2 = chai.spy(),
                spy3 = chai.spy();

            emitter.on(eventName, spy1);
            emitter.on(eventName, spy2);
            emitter.on(anotherEventName, spy3);

            emitter.removeAllListeners();
            emitter.emit(eventName);
            emitter.emit(anotherEventName);

            expect(spy1).to.not.have.been.called();
            expect(spy2).to.not.have.been.called();
            expect(spy3).to.not.have.been.called();
        });
    });

});
