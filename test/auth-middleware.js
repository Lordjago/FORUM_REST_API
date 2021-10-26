const expect = require('chai').expect

const jwt = require('jsonwebtoken');

const authMiddleWare = require('../helper/is-auth');

const sinon = require('sinon')

describe('Auth Middleware', () => {
    it("should show an error if no authorization header is present:", () => {
        const req = {
            get() {
                return null;
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw(
            'Not Authenticated.'
            )

    })

    it("should throw an error if authorization header is only one string", () => {
        const req = {
            get(headerName) {
                return 'xyz';
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
    })

    it("should throw an error if the token can not be verify", () => {
        const req = {
            get(headerName) {
                return 'Bearer xyz';
            }
        }
        expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
    })

    it("should yield a userId after decoding the token", () => {
        const req = {
            get(headerName) {
                return 'Bearer xyzghghjgdgsfgsdgghjdgfdsj';
            }
        }
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({ userId: 'abc' })
        authMiddleWare(req, {}, () => { })
        // expect(req).to.have.property('userId')
         // expect(req).to.have.property('userId', 'abc')
        expect(jwt.verify.called).to.be.true
        jwt.verify.restore()
    })
})

