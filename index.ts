import express from "express";
const { request: Req } = require("express");
const { response: Res } = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const port =process.env.PORT || 9000;

//importig routing routes;
const auth = require("./routes/auth");
const cors = require('cors');

//middleware;
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_LINK, { useNewUrlParser: true,useUnifiedTopology:true},
    (err:{err:Error}) => {
        if (err) console.log(err);
        else console.log("Connected to MongoDB");
})

app.get("/", (req: typeof Req, res: typeof Res) => {
  return res.status(200).json({message:"testing"});
});
app.use("/api", auth);

app.listen(port, () => {
    console.log(`Server is live at ${port} !!`);
})

