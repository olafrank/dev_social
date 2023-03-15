import express from "express";

const authRouter = express.Router();

// @route GET api/auth
// @desc test route
// @access public
authRouter.get('/',(req,res) =>{
    res.send({message:'auth route'})
})

export default authRouter;