require('dotenv').config();
const express = require('express');
const mongoose= require("mongoose");
const cors = require('cors');
const app = express();
const {PORT} = process.env;
const port = 8000 || PORT;
const authRouter = require('./routes/authentication');
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const examRouter = require('./routes/exam');


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to DB");
}).catch((e)=>{
    console.log(e)
});

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(examRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message : "Hello Welcome to LearnWithFun Backend API"});
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started listen to the port ${port}`);
})

