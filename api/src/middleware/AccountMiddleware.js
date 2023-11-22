import { mailVerify } from '../controllers/authController';
// import { updateMyProfile } from '../controllers/userController';
import friendRequestModel from '../models/friendRequestModel';

// const checkEmailUpdate = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         // console.log(email);
//         if (!email) {
//             next();
//         } else {
//             const numberCode = Math.round(Math.random() * 1000000);
//             // await friendRequestModel.createUserPending(req.user._id.toString(), numberCode);
//             await mailVerify(email, numberCode, 'verifyMyEmail');
//             return res.status(206).json('code Pending');
//         }
//     } catch (error) {
//         return res.status(403).json('updated failed');
//     }
// };

const checkImageUpload = (req, res, next) => {
    console.log(req.file);
    // next();
    res.status(403).json(false);
    return;
};

const verifyMyEmail = async (req, res, next) => {
    try {
        const data = req.body;
        const checkUser = await friendRequestModel.findUserPending(data.id, data.numberCode);
        checkUser ? res.status(200).json(true) : res.status(403).json(false);
    } catch (error) {
        res.status(403).json(false);
    }
};

export { checkImageUpload };
