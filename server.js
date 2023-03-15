import express from "express";
import connectDB from "./config/db.js"
import router from "./routes/api/users.js";
import authRouter from "./routes/api/auth.js";
import profileRouter from "./routes/api/profile.js";
import postRouter from "./routes/api/posts.js";

const app = express();

// coonect database
connectDB()

// init middleware....this allows us get data from req.body
app.use(express.json({extended:false}))

const PORT = process.env.PORT || 5001

app.listen(PORT, () =>
    console.log(`App is running on ${PORT} successfully`)
)

app.get('/', (req, res) => {
    res.send({ message: 'hello world' });
})

// define route
app.use('/api/users', router)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/post', postRouter)  
