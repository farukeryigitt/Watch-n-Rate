const express = require('express');
const mongoose = require('mongoose');
//routes import
const authRoute = require('./Routes/authRoutes.js');
const postRoute = require("./Routes/postRoutes.js");
const commentRoute = require('./Routes/commentRoutes.js')

require('dotenv').config();

const app = express();

//db connect
mongoose
  .connect(process.env.DB_LINK)
  .then(() => console.log('mongodb connected'))
  .catch(err => {
    console.log(err);
  });
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth" , authRoute);
app.use("/api/v1/post" , postRoute);
app.use("/api/v1/comment" , commentRoute);

app.listen(process.env.PORT, () => {
  console.log(`your app listening on ${process.env.PORT}`);
});
