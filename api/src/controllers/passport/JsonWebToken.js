import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: '30m',
    });
};

const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
};

const createNewToken = (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

export { generateRefreshToken, generateAccessToken, createNewToken };
