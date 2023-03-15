import express from "express";

const postRouter = express.Router();

// @route GET api/post
// @desc test route
// @access public
postRouter.get('/', (req, res) => {
    res.send({ message: 'post route' })
})

export default postRouter;