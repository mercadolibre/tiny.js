import cookies from '../modules/cookies';

describe('tiny.cookies', () => {
    // simple function to get a cookie value without the tiny.cookies module
    let getCookie = function(key) {
        var cookies = document.cookie.split(';');
        for (let i = 0, c = cookies.length; i < c; i++) {
            let cookie = cookies[i].split('=');
            let name = cookie[0].trim();
            let value = cookie[1];
            if (name == key) {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    // Shared cookie name
    let cookieName = 'testing';

    describe('.isEnabled()', () => {
        it('should just to be defined', () => {
            expect(cookies.isEnabled).to.exist;
        });
        it('should check that cookies are enabled in the browser', () => {
            expect(cookies.isEnabled()).to.be.a('boolean');
            expect(cookies.isEnabled()).to.be.true;
        });
    });

    describe('.set()', () => {
        let days = 1;

        it('should just to be defined', () => {
            expect(cookies.set).to.exist;
        });
        it('should set a string', () => {
            let value = 'string-value';
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.equal(value);
        });
        it('should set a numeric value', () => {
            let value = 1;
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.equal(value.toString());
        });
        it('should set an object', () => {
            let value = {a: 1};
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.equal(JSON.stringify(value));
        });
        it('should set an array', () => {
            let value = [1,2,3,4,5];
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.equal(JSON.stringify(value));
        });
        it('should set a value with not allowed symbols', () => {
            let value = '];. =\'"[';
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.equal(value);
        });
        it('should set a value with non plain objects', () => {
            let value = window;
            cookies.set(cookieName, value, days);
            expect(getCookie(cookieName)).to.be.empty;
        });
        it('should set a session cookie', () => {
            let value = 'string-value';
            cookies.set(cookieName, value);
            expect(getCookie(cookieName)).to.equal(value);
            cookies.set(cookieName, (value + value), {expires: null});
            expect(getCookie(cookieName)).to.equal(value + value);
        });
    });

    describe('.get()', () => {
        let days = 1;

        it('should just to be defined', () => {
            expect(cookies.get).to.exist;
        });
        it('should get a string', () => {
            let value = 'string-value';
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.equal(value);
        });
        it('should set a numeric value', () => {
            let value = 1;
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.equal(value.toString());
        });
        it('should set an object', () => {
            let value = {a: 1};
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.equal(JSON.stringify(value));
        });
        it('should set an array', () => {
            let value = [1,2,3,4,5];
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.equal(JSON.stringify(value));
        });
        it('should set a value with not allowed symbols', () => {
            let value = '];. =\'"[';
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.equal(value);
        });
        it('should set a value with non plain objects', () => {
            let value = window;
            cookies.set(cookieName, value, days);
            expect(cookies.get(cookieName)).to.be.empty;
        });
    });

    describe('.remove()', () => {
        let days = 1;

        it('should just to be defined', () => {
            expect(cookies.remove).to.exist;
        });
        it('should remove the cookie', () => {
            let value = 'string-value';

            cookies.set(cookieName, value, days);
            cookies.remove(cookieName);
            expect(cookies.get(cookieName)).to.be.null;
        });
    });
});
