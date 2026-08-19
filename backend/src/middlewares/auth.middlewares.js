const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const AppError = require('../utils/app-error.js');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      return next(new AppError('User not found', 401));
    }

    if (!req.user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized for this route`, 403));
    }
    next();
  };
};