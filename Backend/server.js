require("dotenv").config();
const express = require("express");
const app = express();
const authRouters = require("./routes/auth");
const userRouters = require("./routes/user");
const roleRouters = require("./routes/roles");
const permissionRouters = require("./routes/permissions");
const connectDb = require("./config/connectDb");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();

    // ← add JSON body parsing
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Server Running");
    });

    // Mount your routers:
    app.use("/api/permissions", permissionRouters);
    app.use("/api/roles", roleRouters);

    app.use("/api/users", userRouters);
    app.use("/api/auth", authRouters);

    app.listen(PORT, () => {
      console.log("Server running on " + PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
