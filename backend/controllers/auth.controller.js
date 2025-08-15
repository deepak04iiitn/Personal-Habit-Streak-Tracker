import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req , res , next) => {
    
    const { username, email, password } = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '') 
    {
        return next(errorHandler(400, 'All fields are required!'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)) 
    {
        return next(errorHandler(400, 'Invalid email format.'));
    }

    if(password.length < 8) 
    {
        return next(errorHandler(400, 'Password must be at least 8 characters long.'));
    }

    if(!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) 
    {
        return next(errorHandler(400, 'Password must contain at least one letter and one number.'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ success: true, message: 'Signup successful!' });
    } catch (error) {
        next(error);
    }
}


export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password || email === '' || password === '') 
    {
        return next(errorHandler(400, 'All fields are required!'));
    }

    try {
        const validUser = await User.findOne({ email });

        if(!validUser) 
        {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if(!validPassword) 
        {
            return next(errorHandler(400, 'Invalid credentials!'));
        }

        const expiresInSeconds = 60 * 60; 
        const token = jwt.sign(
            { 
                id: validUser._id,
            },

            process.env.JWT_SECRET,
            { expiresIn: expiresInSeconds } 
        );

        const expiresAt = Date.now() + expiresInSeconds * 1000;
        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true
           })
           .json({ ...rest, token, expiresAt });

    } catch (error) {
        next(error);
    }
}


export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  res.status(200).json({ success: true, message: 'Signed out successfully.' });

};


export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    res.status(200).json({ success: true, message: 'Account deleted successfully.' });

  } catch (err) {
    next(err);
  }
};


export const getMe = async (req, res, next) => {
    try {
        
      const user = await User.findById(req.user.id).select('-password');
      if(!user) 
      {
        return next(errorHandler(404, 'User not found'));
      }

      res.status(200).json({ success: true, data: user });

    } catch (error) {
      next(error);
    }
};
