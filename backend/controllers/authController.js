import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkEmail = await User.findOne({email})

        if (checkEmail) {
            res.status(400).json({ success: false, message: 'Email already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword
        })

        res.status(201).json({ message: 'user registered', userId: user._id })

    }

    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkUser = await User.findOne({email});

        if (!checkUser) {
            res.status(400).json({ success: false, message: 'Invalid email or passwod' });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (!checkPassword) {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {id: checkUser._id , email: checkUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.status(200).json({message: 'login success', token});
       
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }
}