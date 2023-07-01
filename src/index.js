require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authentication');
const app = express();
const {PORT} = process.env;
const port = 8000 || PORT;

app.use(express.json());
app.use(cors());
app.use(authRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message : "Success"});
});

app.listen(port, () => {
    console.log(`Server started listen to the port ${port}`);
})