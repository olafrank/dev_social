import express from "express";

const profileRouter = express.Router();

// @route GET api/profile
// @desc test route
// @access public
profileRouter.get('/', (req, res) => {
    res.send({ message: 'profile route' })
})

export default profileRouter;