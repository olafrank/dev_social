import express from "express";
import verifyToken from '../../middleware/auth.js';
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import config from 'config'
import bcrypt from 'bcryptjs'
import { check, validationResult } from "express-validator";

const authRouter = express.Router();

// @route GET api/auth
// @desc test route
// @access public
authRouter.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (error) {
        res.status(500).send('server error')

    }
})


// @route post api/auth
// @desc authenticate  user and get token
// @access public
authRouter.post('/',
    [check('email', 'enter a valid email')
        .isEmail(),
    check('password', 'password is required')
        .exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const { email, password } = req.body

            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
            }

            // checking password match with bcrpyt
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'invalid credentials' })
            }



            //  jwt token
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })

        } catch (error) {
            res.status(500).send('server error')
        }





    })


export default authRouter;