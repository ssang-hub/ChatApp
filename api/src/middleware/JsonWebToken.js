import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import refreshTokens from '../models/refreshTokenModel';

const refreshToken = async (req, res) => {
    //take the refresh token from the user
    const refreshToken = req.body.token;

    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json('You are not authenticated!');
    const tokens = await refreshTokens.findRefreshToken(refreshToken);
    // const tokens = await refreshTokens.find({ info: refreshToken });
    console.log(tokens);
    if (!tokens) {
        return res.status(403).json('Refresh token is not valid!');
    }
    // if (!refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json("Refresh token is not valid!");
    // }
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        err && console.log(err);
        console.log(user);
        const deleteResult = await refreshTokens.findAndDeleteRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await refreshTokens.createRefreshToken(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
};

const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: '30m',
    });
};

const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
};

const logout = (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json('You logged out successfully.');
};

const authVerify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                res.redirect(307, '/api/refresh');
                // return res.status(403).json("Token is not valid!");
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json('You are not authenticated!');
    }
};

const deleteToken = (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json('User has been deleted.');
    } else {
        res.status(403).json('You are not allowed to delete this user!');
    }
};
const createNewToken = (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

export { authVerify, logout, refreshToken, deleteToken, generateRefreshToken, generateAccessToken, createNewToken };
