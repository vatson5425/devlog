
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from local frontend (file://, localhost, 127.0.0.1)
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman, file://)
        if (!origin) return callback(null, true);
        const allowed = [
            "http://localhost:5000",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:5500",
            "http://127.0.0.1:5000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:5500",
        ];
        if (allowed.includes(origin)) {
            callback(null, true);
        } else {
            // Allow any origin in development for convenience
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "DevLog Backend API is running",
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "DevLog API healthy",
        timestamp: new Date().toISOString()
    });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`\n✅ DevLog backend running on http://localhost:${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
            console.log(`🔑 Auth routes: POST /api/auth/register, POST /api/auth/login`);
            console.log(`📝 Blog routes: GET/POST /api/blogs, PUT/DELETE /api/blogs/:id\n`);
        });
    } catch (error) {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
