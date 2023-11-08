require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const i18next = require("i18next");
const Backend = require("i18next-node-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + "/../resources/locales/{{lng}}/{{ns}}.json",
    },
    fallbackLng: "en",
    preload: ["en", "hi", "or"],
  });

const app = express();
const { PORT } = process.env;
const port = 8000 || PORT;
const authRouter = require("./routes/authentication");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const examRouter = require("./routes/exam");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(cors());
app.use(i18nextMiddleware.handle(i18next));
app.use(authRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(examRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: req.t('welcomeToLearnWithFun') });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started listen to the port ${port}`);
});
