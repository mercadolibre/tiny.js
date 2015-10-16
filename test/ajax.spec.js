import ajax from '../modules/ajax';

describe('tiny.ajax', () => {
    it('is should just to be defined', () => {
        expect(ajax).to.exist;
    });

    it('is should make a GET request', (done) => {
        let completeCallback = function(xhr, status) {
            expect(typeof xhr).to.equal('object');
            expect(typeof status).to.equal('string');
            expect(success).to.have.been.called.once;
            expect(complete).to.have.been.called.with('success');
            expect(error).to.not.have.been.called();
            done();
        };

        let success = chai.spy();
        let error = chai.spy();
        let complete = chai.spy(completeCallback);

        ajax('mock/sites.json', {
            success,
            error,
            complete,
            dataType: 'json',
            method: 'GET'
        });
    });

    it.skip('is should make a POST request', (done) => {
        let completeCallback = function(xhr, status) {
            expect(complete).to.have.been.called.with('error');
            expect(error).to.have.been.called.once;
            expect(success).to.not.have.been.called();
            done();
        };

        let success = chai.spy();
        let error = chai.spy();
        let complete = chai.spy(completeCallback);

        ajax('mock/sites.json', {
            success,
            error,
            complete,
            method: 'POST'
        });
    });
});
