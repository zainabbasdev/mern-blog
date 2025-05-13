const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserRouter = require("./Routes/UserRoutes.js");
const BlogRouter = require("./Routes/BlogRoutes.js");
const AdminRouter = require("./Routes/AdminRoutes.js");
const { register, login } = require("./Controllers/AuthController.js");

const AuthenticateUser = require("./Utils/Authenticate.js");
const CheckAdmin = require("./Utils/CheckAdmin.js");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});

app.post("/register", register);
app.post("/login", login);

app.use("/users", UserRouter);
app.use("/blogs", BlogRouter);
app.use("/admin", AuthenticateUser, CheckAdmin, AdminRouter);

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
