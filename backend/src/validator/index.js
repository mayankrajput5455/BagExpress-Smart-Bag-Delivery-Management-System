import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLowercase()
            .withMessage("Username must be in Lowercase")
            .isLength({min: 3})
            .withMessage("Username must be of atleast 3 characters"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is Required"),

        body("fullname")
            .optional()
            .trim()
    ]
} 

const userLoginValidator = () =>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return [
        body("oldPassword").notEmpty().withMessage("Old Password is required"),
        body("newPassword").notEmpty().withMessage("New Password is required")
    ]
}

const userForgotPasswordValidator = () =>{
    return [
        body("email").notEmpty().withMessage("Email is Required").isEmail().withMessage("Email is Invalid"),
    ]
}

const userResetForgotPasswordValidator = () =>{
    return [
        body("newPassword").notEmpty().withMessage("Password is Required")
    ]
}

export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotPasswordValidator }