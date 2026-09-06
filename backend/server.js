const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://mongodb:27017/applyflow";

const uploadDir = process.env.UPLOAD_DIR || "/app/uploads";

app.use(cors());
app.use(express.json());

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const applicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        dob: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        cv: {
            originalName: String,
            filename: String,
            path: String
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const extension =
            path.extname(file.originalname).toLowerCase();

        const filename =
            Date.now() +
            "-" +
            crypto.randomBytes(6).toString("hex") +
            extension;

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {
        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx"
        ];

        const extension =
            path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF, DOC and DOCX files are allowed."
                )
            );
        }
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "ApplyFlow API is running",
        database: mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected"
    });
});

app.post(
    "/api/applications",
    upload.single("cv"),
    async (req, res) => {
        try {
            const {
                name,
                dob,
                phone,
                gender,
                message
            } = req.body;

            if (
                !name ||
                !dob ||
                !phone ||
                !gender ||
                !message ||
                !req.file
            ) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(400).json({
                    message: "All fields are required."
                });
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    message:
                        "Phone number must contain 10 digits."
                });
            }

            if (!["Male", "Female"].includes(gender)) {
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    message: "Invalid gender."
                });
            }

            const application = await Application.create({
                name,
                dob,
                phone,
                gender,
                message,

                cv: {
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    path: req.file.path
                }
            });

            res.status(201).json({
                success: true,
                message:
                    "Application submitted successfully.",
                applicationId: application._id
            });

        } catch (error) {
            console.error(error);

            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                message: "Something went wrong."
            });
        }
    }
);

app.get("/api/applications", async (req, res) => {
    try {
        const applications =
            await Application.find().sort({
                createdAt: -1
            });

        res.json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to read applications."
        });
    }
});

app.get("/api/applications/:id", async (req, res) => {
    try {
        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        res.json(application);

    } catch (error) {
        res.status(400).json({
            message: "Invalid application ID."
        });
    }
});

app.delete("/api/applications/:id", async (req, res) => {
    try {
        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        if (
            application.cv &&
            application.cv.path &&
            fs.existsSync(application.cv.path)
        ) {
            fs.unlinkSync(application.cv.path);
        }

        await Application.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
            message: "Application deleted."
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid application ID."
        });
    }
});

app.use((error, req, res, next) => {
    console.error(error);

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "CV must be smaller than 5MB."
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            message: error.message
        });
    }

    next();
});

async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(
                `ApplyFlow API running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
}

startServer();
