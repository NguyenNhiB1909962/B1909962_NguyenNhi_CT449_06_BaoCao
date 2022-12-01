const express = require("express");
const cors = require("cors");
const req = require("express/lib/request");
const res = require("express/lib/response");

const moviesRouter = require("./app/routes/movie.route");
const usersRouter = require("./app/routes/user.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRouter);
app.use("/api/users", usersRouter);

// Xử lý phản hồi 404
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});

// Xác định phần mềm trung gian xử lý lỗi cuối cùng, sau các lệnh gọi app.use() và định tuyến khác
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the movie review app." });
});

module.exports = app;