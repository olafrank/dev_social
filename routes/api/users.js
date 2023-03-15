import express from "express";
import { check, validationResult } from "express-validator";
import gravitar from 'gravatar'
import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import config from 'config'

const router = express.Router();

// @route post api/users
// @desc register user
// @access public
router.post('/',
    [check('name', 'name is required')
        .not()
        .isEmpty(), check('email', 'enter a valid email')
            .isEmail(), check('password', 'please enter at least 6 or more character')
                .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const { name, email, password } = req.body

            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'user already exists' }] })
            }

            const avatar = gravitar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // password hashing

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            await user.save();

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

export default router;