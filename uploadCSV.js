import express from "express";
import multer from "multer";
import unzipper from "unzipper";
import fs from "fs";
import csv from "csv-parser";
import Phytochemical from "./models/Phytochemical.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("file"), async (req, res) => {
    const zipPath = req.file.path;
    const extractPath = "uploads/extracted_" + Date.now();

    fs.mkdirSync(extractPath);

    // Step 1: Extract ZIP
    fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on("close", async () => {

            const csvFile = extractPath + "/data.csv";
            const imagesFolder = extractPath + "/images";

            const results = [];

            // Step 2: Read CSV
            fs.createReadStream(csvFile)
                .pipe(csv())
                .on("data", (row) => results.push(row))
                .on("end", async () => {

                    for (const row of results) {
                        const image = `${imagesFolder}/${row.imageName}`;

                        const saved = await Phytochemical.create({
                            plantname: row.plantname,
                            phytochemical: row.phytochemical,
                            Electrophilcity: row.Electrophilicty,
                            imagePath: image
                        });
                    }

                    res.json({
                        message: "CSV + Images Uploaded Successfully!",
                        count: results.length
                    });
                });
        });
});

export default router;
