const express = require("express");
const cors = require("cors");
const routes = require("./route/routes");
const connectDB = require("./db/db");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://fastestcreators.com",
    "https://effortless-axolotl-520cbe.netlify.app",
  ],
  credentials: true, 
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Database connection
connectDB();

// Dynamically all routes
routes.forEach((route) => {
  app.use(`/api/v1${route.path}`, route.handler);
});

app.get("/", (req, res) => {
  res.send("API is working!");
});

// Undefined Route Handler (404)
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
