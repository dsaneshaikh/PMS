require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/connectDb");
const authRouters = require("./routes/auth");
const userRouters = require("./routes/user");
const roleRouters = require("./routes/roles");
const permissionRouters = require("./routes/permissions");

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDb();
    console.log("✅ MongoDB connected");

    const app = express();

    // 2. Middlewares
    // Parse JSON bodies for all request types, including DELETE
    app.use(express.json());
    // Parse URL-encoded bodies (for form submissions, if needed)
    app.use(express.urlencoded({ extended: true }));
    
    // Enable Express to parse request bodies for DELETE requests
    app.use((req, res, next) => {
      if (req.method === 'DELETE' && req.headers['content-type'] === 'application/json') {
        console.log('DELETE request body:', req.body);
      }
      next();
    });
    // Parse cookies
    app.use(cookieParser());
    // Enable CORS for your frontend origin
    app.use(
      cors({
        origin: function(origin, callback) {
          const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            "https://pms-danish.netlify.app"
          ];
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200
      })
    );

    // 3. Health check
    app.get("/", (req, res) => {
      res.send("🚀 Server is up and running");
    });

    // 4. Mount routers (all prefixed with /api)
    app.use("/api/permissions", permissionRouters);
    app.use("/api/roles", roleRouters);
    app.use("/api/users", userRouters);
    app.use("/api/auth", authRouters);

    // 5. Global error handler (optional)
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      res.status(500).json({ message: "Internal server error" });
    });

    // 6. Start listening
    app.listen(PORT, () => {
      console.log(`🌐 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
