const expect = require('chai').expect

const sinon = require('sinon')

const User = require('../model/user');

const mongoose = require('mongoose')

const AuthController = require('../controllers/auth');

//When testing an async function like login and singup we make use of (done) 
//because it will wait for mocha to execute the expect part before treat the test case as done

describe('Auth Controller', () => {
    before(function(done) {
        mongoose.connect('mongodb+srv://user:user@cluster0.nhgmh.mongodb.net/test-messages?retryWrites=true&w=majority').
            then(() => {
                const user = new User({
                    email: "test@test.com",
                    password: "pass111",
                    name: "Test",
                    posts: [],
                    _id: "5c0f66b979af55031b34728a"
                });
                return user.save()
            })
            .then(() => {
                done()
            })
    })
    describe('Login', () => {
         it('should throw an error with status code 500 if accessing the database fails', (done) => {
        sinon.stub(User, 'findOne');
        User.findOne.throws()

        const req = {
            body: {
                email: "adegokeabdulazeez653@gmail.com",
                password: "pass111"
            }
        };
        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500)
            done()
        })
        
        User.findOne.restore()
    })
    })
   describe('Status', () => {
       it('should send a valid user status for existing user', (done) => {
                const req = {
                    userId: '5c0f66b979af55031b34728a'
                }
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status(code) {
                        this.statusCode = code;
                        return this
                    },
                    json(data) {
                        this.userStatus = data.status
                    }     
                }
                AuthController.getStatus(req, res, () => {}).then(() => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userStatus).to.be.equal("I am new");
                    done()
                    
                })
       })
   })

    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect()
            })
            .then(() => {
                done();
            })
    } )
})
// const expect = require('chai').expect

// const sinon = require('sinon')

// const mongoose = require('mongoose')

// const User = require('../model/user');
// const AuthController = require('../controllers/auth');


// describe('Auth Controller', function () {
//     before(function (done) {
//         mongoose
//             .connect(
//                 'mongodb+srv://user:user@cluster0.nhgmh.mongodb.net/test-messages?retryWrites=true&w=majority'
//             )
//             .then(result => {
//                 const user = new User({
//                     email: 'test@test.com',
//                     password: 'tester',
//                     name: 'Test',
//                     posts: [],
//                     _id: '5c0f66b979af55031b34728a'
//                 });
//                 return user.save();
//             })
//             .then(() => {
//                 done();
//             });
//     });

//     beforeEach(function () { });

//     afterEach(function () { });

//     it('should throw an error with code 500 if accessing the database fails', function (done) {
//         sinon.stub(User, 'findOne');
//         User.findOne.throws();

//         const req = {
//             body: {
//                 email: 'test@test.com',
//                 password: 'tester'
//             }
//         };

//         AuthController.login(req, {}, () => { }).then(result => {
//             expect(result).to.be.an('error');
//             expect(result).to.have.property('statusCode', 500);
//             done();
//         });

//         User.findOne.restore();
//     });

//     it('should send a response with a valid user status for an existing user', function (done) {
//         const req = { userId: '5c0f66b979af55031b34728a' };
//         const res = {
//             statusCode: 500,
//             userStatus: null,
//             status: function (code) {
//                 this.statusCode = code;
//                 return this;
//             },
//             json: function (data) {
//                 this.userStatus = data.status;
//             }
//         };
//         AuthController.getUserStatus(req, res, () => { }).then(() => {
//             expect(res.statusCode).to.be.equal(200);
//             expect(res.userStatus).to.be.equal('I am new!');
//             done();
//         });
//     });

//     after(function (done) {
//         User.deleteMany({})
//             .then(() => {
//                 return mongoose.disconnect();
//             })
//             .then(() => {
//                 done();
//             });
//     });
// });
