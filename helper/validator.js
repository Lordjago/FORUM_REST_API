const { check } = require('express-validator');

const User = require('../model/user')

let signup = [
    check("email").not().isEmpty().withMessage("Email is empty"),
    check("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
    check("email").isLength({ min: 5 }).withMessage("Email too short, < 5").trim(),
    check("email").custom((value) => {
        return User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    return Promise.reject("Email address already exist")
                }
            })
    })
        .normalizeEmail(),

    check("password").not().isEmpty().withMessage("password is empty"),
    check("password").isLength({ min: 5 }).withMessage("password too short < 5").trim(),

    // check("confirm_password").trim().custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         throw new Error("Password do not match!!!")
    //     }
    //     return true
    // })
];

let login = [
    check("email").not().isEmpty().withMessage("Email is empty"),
    check("email").isEmail().normalizeEmail().withMessage("Invalid Email").trim(),
    check("email").isLength({ min: 5 }).withMessage("Email too short, < 5"),

    check("password").not().isEmpty().withMessage("password is empty"),
    check("password").isLength({ min: 5 }).withMessage("password too short < 5").trim()
];

let create = [
    check("task").not().isEmpty().withMessage("Task is empty"),
    check("task").isLength({ min: 6 }).withMessage("Task too short"),

    check("day").not().isEmpty().withMessage("Day is empty"),
    check("day").isLength({ min: 6 }).withMessage("Day too short"),

    check("time").not().isEmpty().withMessage("Time is empty"),
    check("time").isLength({ min: 6 }).withMessage("Time too short")
];

let update = [
    check("task").not().isEmpty().withMessage("Task is empty"),
    check("task").isLength({ min: 6 }).withMessage("Task too short"),

    check("day").not().isEmpty().withMessage("Day is empty"),
    check("day").isLength({ min: 6 }).withMessage("Day too short"),

    check("time").not().isEmpty().withMessage("Time is empty"),
    check("time").isLength({ min: 6 }).withMessage("Time too short")

];

let forgetPassword = [
    check("email").not().isEmpty().withMessage("Email is empty"),
    check("email").isLength({ min: 5 }).withMessage("Email too short, < 5"),
    check("email").isEmail().normalizeEmail().withMessage("Invalid Email")
];

let resetPassword = [
    check("token").not().isEmpty().withMessage("Token cannot be empty"),
    check("password").not().isEmpty().withMessage("password is empty"),
    check("password").isLength({ min: 5 }).withMessage("password too short < 5")
];



module.exports = {
    signup: signup,
    login: login,
    create: create,
    update: update,
    forgetPassword: forgetPassword,
    resetPassword: resetPassword
}
