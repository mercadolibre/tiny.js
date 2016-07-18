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
            method: 'GET',
            data: 'a=1&b=2'
        });
    });

    it('is should make a POST request', (done) => {
        let successCallback = function(data, status) {
            expect(success).to.have.been.called.once;
            expect(success).to.have.been.called.with('success');
            expect(data[0]).to.eql({id: 'MLA', name: 'Argentina'});
        };

        let completeCallback = function(xhr, status) {
            expect(xhr.status).to.equal(200);
            expect(complete).to.have.been.called.with('success');
            expect(error).to.not.have.been.called();
            done();
        };

        let error = chai.spy();
        let success = chai.spy(successCallback);
        let complete = chai.spy(completeCallback);

        ajax('mock/sites.json', {
            success,
            error,
            complete,
            dataType: 'json',
            method: 'POST'
        });
    });
});
