import express from 'express';
import passport from '../controllers/passport';
import user from './user';
import authRoute from './auth';

import test from './test';

const route = express.Router();
import multer from 'multer';

// const upload = multer({ dest: "src/public/images/message/" });

// // google login
// route.get("/login/google", passport.authenticate("google", { scope: ["email", "profile"] }, { session: false }), (req, res, next) => {
//   console.log(req.user._id);
// });
// route.get("/oauth2/redirect/google", passport.authenticate("google", { failureRedirect: "/OauthFaild", session: false }), genToken);
route.use(authRoute);
route.use(test);
route.use(passport.authenticate('jwt', { session: false }), user);
export default route;
