
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "DevLog Backend API is running"
    });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`DevLog backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    }
};

startServer();