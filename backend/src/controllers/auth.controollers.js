import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/api-respone.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import {emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail} from '../utils/mail.js'
import jwt from 'jsonwebtoken'

const generateAccesAndResfreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccesToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(400,"Something went wrong while generating access token.")
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    const {email, username, password, role} = req.body;

    const existingUser = await User.findOne({
        $or : [{username}, {email}],
    });

    if(existingUser){
        throw new ApiError(409, "User with this username or email already exist", []);
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })



    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            ),
        }
    );

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user: createdUser},
                "User registered successfully and verification email has been sent to your registered email.",
            )
        )
        
});


const login = asyncHandler(async (req, res) =>{
    const {email, password, username} = req.body

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, "User not Found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Credentials");
    }

    const {accessToken, refreshToken} = await generateAccesAndResfreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res  
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
})


const logout = asyncHandler(async (req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        },
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})


const currentUser = asyncHandler(async (req, res) =>{
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current User fetched Successfully"
            )
        )
})


const verifyEmail = asyncHandler(async (req, res) =>{
    const { verificationToken } = req.params;

    if(!verificationToken){
        throw new ApiError(400,"Email Verification Token is missing");
    }

    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")
        
    const user = await User.findOne({
        emailVerificationToken : hashedToken,
        emailVerificationExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(400, "Token is Valid or Expired");
    }

    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined

    user.isEmailVerified = true
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified : true
                },
                "Email is Verified"
            )
        )
})

const resendEmailVerification = asyncHandler(async (req, res) =>{
    const user = await user.findById(req.user?._id);


    if(!user){
        throw new ApiError(404, "User does not exist");
    }
    if(user.isEmailVerified){
        throw new ApiError(409, "Email is already verified");
    }

    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            ),
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Email has ben sent to your registered Email"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Access");
    }

    try {
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN-SECRET);

        const user = await User.findById(decodedRefreshToken?._id);

        if(!user){
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is Expired");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken } = await generateAccesAndResfreshToken(user._id)

        user.refreshToken = newrefreshtoken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                200,
                {accessToken, refreshToken},
                "Access Token Refreshed"
            )


    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token")
    }
})

const forgotPasswordRequest = asyncHandler(async (req, res) =>{
    const {email} = req.body
    
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User Does not Exists");
    }

    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail(
        {
            email: user?.email,
            subject: "Password reset Request",
            mailgenContent: forgotPasswordMailgenContent(
                user.username,
                `${process.env.FORGET_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
            ),
        }
    ); 
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset mail has been sent to your registerd Email"
            )
        )
})

const resetForgotPassword = asyncHandler(async (req, res) =>{
    const {resetToken} = req.param;
    const {newPassword} = req.body;

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")


    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(489, "Token is Invalid or Expired");
    }

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.password = newPassword
    await user.save({validateBeforeSave: false})


    return res
        .status(200)
        .json(
            200,
            {},
            "Password Reset Successfully"
        )
})

const changeCurrentPassword = asyncHandler(async (req, res) =>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Old Password")
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password Changed Successfully")
        );
});


export { registerUser, login, logout, currentUser, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword };