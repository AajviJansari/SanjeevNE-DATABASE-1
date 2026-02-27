const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const csv = require("csv-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose.connect('mongodb+srv://mc24ms5066_db_user:aajvi161202@sanjeevne-db.nljallf.mongodb.net/test')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const ImageSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    Phytochemicals: String,
    Molecularweight: Number,
    NHD: Number,
    NHA: Number,
    LogP: Number,
    NRB: Number,
    Electrophilicity: Number,
    uploadedAt: { type: Date, default: Date.now }
});

const ImageModel = mongoose.model("Image", ImageSchema);

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// UPLOAD ZIP
app.post("/upload-zip", upload.single("zipFile"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No ZIP uploaded" });

        let zip;
        try {
            zip = new AdmZip(file.path);
        } catch (e) {
            return res.status(400).json({ error: "Invalid ZIP file" });
        }

        const tempDir = "uploads/temp";
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        zip.extractAllTo(tempDir, true);

        // ---- FIX 1: AUTO-DETECT CSV FILE ----
        const csvFile = fs.readdirSync(tempDir).find(f => f.endsWith(".csv"));
        if (!csvFile) {
            return res.status(400).json({ error: "No CSV file found in ZIP" });
        }
        const csvPath = path.join(tempDir, csvFile);
        console.log("CSV found:", csvPath);

        // Read CSV
        const csvData = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", row => csvData.push(row))
            .on("end", async () => {

                const entries = zip.getEntries();
                const savedFiles = [];

                for (const entry of entries) {
                    if (entry.entryName.startsWith("images/") && !entry.isDirectory) {

                        const imageName = path.basename(entry.entryName);

                        // ---- FIX 2: Match exact CSV column "Image" ----
                        const details = csvData.find(r => r.Image === imageName);

                        if (!details) {
                            console.warn(`Image ${imageName} not found in CSV`);
                            continue;
                        }

                        const newFile = Date.now() + "-" + imageName;
                        const destPath = path.join("uploads", newFile);

                        // Save extracted image
                        fs.writeFileSync(destPath, entry.getData());

                        // ---- FIX 3: Save all CSV fields correctly ----
                        const saved = await ImageModel.create({
                            filename: newFile,
                            filepath: `/uploads/${newFile}`,
                            Phytochemicals: details.Phytochemicals,
                            Molecularweight: parseFloat(details.Molecularweight),
                            NHD: parseFloat(details.NHD),
                            NHA: parseFloat(details.NHA),
                            LogP: parseFloat(details.LogP),
                            NRB: parseFloat(details.NRB),
                            Electrophilicity: parseFloat(details.Electrophilicity)
                        });

                        savedFiles.push(saved);
                    }
                }

                return res.json({
                    message: "Upload completed successfully",
                    totalSaved: savedFiles.length,
                    data: savedFiles
                });
            });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.use("/images", express.static("uploads"));

// GET all images
app.get("/images", async (req, res) => {
    try {
        const images = await ImageModel.find(); // fetch all documents
        res.json(images); // return as JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Serve all static HTML, CSS, JS files
app.use(express.static(__dirname));

// Explicit homepage route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
