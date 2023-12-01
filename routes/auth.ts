const { request: Req } = require("express");
const { response: Res } = require("express");
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authencateToken } = require("../middleware/auth");
const Invalidtoken = require("../models/Invailedtoken");

//checking for the user authencation with jwt token;
router.get(
  "/token_check",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const user = await User.findOne({ _id: req.body.user_id });
    res.status(200).send(user);
  }
);

//registering User;
router.post("/users/register", async (req: typeof Req, res: typeof Res) => {
  try {
    const { Name, username, bio, age, password } = req.body;
    console.log(Name);
    const user = await User.findOne({ username: username });
    //to count no. of calls;
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      const newuser = new User({
        Name,
        username,
        bio,
        age,
        password: newpassword,
      });
      await newuser.save((err: Error) => {
        if (err) return res.status(400).send(err);
        else {
          return res.status(200).json({
            message: "User Created Sucessfully",
            detail: newuser,
          });
        }
      });
    } else {
      return res.status(403).send({ message: "User Already Exists..." });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

// User Login
router.post("/users/login", async (req: typeof Req, res: typeof Res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Username Not found in the database" });
    }
    const check_pass = await bcrypt.compare(password, user.password);
    if (!check_pass) {
      return res.status(401).send({ message: "Password Does not match..." });
    }
    const token_content = {
      id: user._id,
    };
    const token = jwt.sign(token_content, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    //just sending jwt token in frontend;
    return res.status(200).send({
      message: "Login Sucessfull",
      token: token,
      detail: user,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// User Detain
router.get("/users/detail", authencateToken,async (req: typeof Req, res: typeof Res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id)
    const user = await User.findOne({ _id:user_id });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Username Not found in the database" });
    }
    return res.status(200).send({
      detail: {
        Name:user.Name,
        username:user.username,
        bio:user.bio,
        age:user.age
      },
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// User Detail update
router.put("/users/update", authencateToken,async (req: typeof Req, res: typeof Res) => {
  try {
    const { user_id ,...other} = req.body;
    console.log(user_id)
    const user = await User.findOne({ _id:user_id });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Username Not found in the database" });
    }
    await User.updateOne({_id:user_id},{$set:other});
    const updateduser=await User.findOne({ _id:user_id });
    return res.status(200).send({
      message: "User updated Successfully",
      detail: {
        Name: updateduser.Name,
        username: updateduser.username,
        bio: updateduser.bio,
        age: updateduser.age,
      },
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});
// User Delete
router.delete("/users/delete", authencateToken,async (req: typeof Req, res: typeof Res) => {
  try {
    const { user_id}=req.body;
    await User.deleteOne({ _id:user_id });
    return res.status(200).send({
      message: "User Deleted Successfully"
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});
// User logout
router.post("/users/logout", authencateToken,async (req: typeof Req, res: typeof Res) => {
  try {
    const authHeader = req.header("Authorization");

    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    const invalidatedToken = new Invalidtoken({ token });
    await invalidatedToken.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(400).send(err);
  }
});




module.exports = router;
