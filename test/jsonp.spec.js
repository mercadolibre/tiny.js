import jsonp from '../modules/jsonp';

describe('tiny.jsonp', () => {
    it('should just to be defined', () => {
        expect(jsonp).to.exist;
    });

    it('should get jsonp data with default parameters', (done) => {
        let successCallback = function(data) {
            expect(success).to.be.called.once;
            expect(error).to.have.not.been.called();
            expect(data).to.be.an('array');
            expect(data).to.eql([{a:1,b:2,c:3}]);
            done();
        };
        let error = chai.spy();
        let success = chai.spy(successCallback);

        jsonp('mock/jsonp-defaults.jsonp', {
            success: success,
            error: error
        });
    });

    it('should get jsonp data with custom parameters', (done) => {
        let successCallback = function(data) {
            expect(success).to.be.called.once;
            expect(error).to.have.not.been.called();
            expect(data).to.be.an('array');
            expect(data).to.eql([{x:1,y:2,z:3}]);
            done();
        };
        let error = chai.spy();
        let success = chai.spy(successCallback);

        jsonp('mock/jsonp-name.jsonp', {
            success: success,
            error: error,
            name: function(/* prefix, counter */) {
                return 'xxx';
            }
        });
    });

    it('should return an error when files is not found', (done) => {
        let errorCallback = function(err) {
            expect(error).to.be.called.once;
            expect(success).to.have.not.been.called();
            expect(err instanceof Error).to.be.true;
            done();
        };
        let error = chai.spy(errorCallback);
        let success = chai.spy();

        jsonp('mock/jsonp-wrong.jsonp', {
            success: success,
            error: error
        });
    });

    it('should cancel the jsonp request', (done) => {
        let error = chai.spy();
        let success = chai.spy();
        let cancel = jsonp('mock/jsonp-defaults.jsonp', {
            success: success,
            error: error
        });
        cancel();

        expect(success).to.have.not.been.called();
        expect(error).to.have.not.been.called();

        done();
    });
});
