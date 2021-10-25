const expect = require('chai').expect

const authMiddleWare = require('../helper/is-auth');

describe('Auth Middleware', function () {
    it("should show an error if no authorization header is present:", function () {
        const req = {
            get: function () {
                return null;
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => { })).to.throw(
            'Not Authenticated.'
            )

    })

    it("should throw an error if authorization header is only one string", function () {
        const req = {
            get: function (headerName) {
                return 'xyz';
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
    })

    it("should throw an error if the token can not be verify", function () {
        const req = {
            get: function (headerName) {
                return 'Bearer xyz';
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => { })).to.throw();
    })
})

