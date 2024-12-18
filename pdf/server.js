const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" }); // Folder untuk file gambar

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint untuk form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "form.html")); // File HTML
});

// Endpoint untuk menghasilkan PDF
app.post("/generate-pdf", upload.single("queryResult"), (req, res) => {
    const { taskNumber, taskQuestion, sqlStatement, queryPurpose } = req.body;
    const queryResultPath = req.file ? req.file.path : null;

    if (!queryResultPath) {
        return res.status(400).send("File upload failed.");
    }

    const doc = new PDFDocument({ margin: 30 });
    const outputPath = path.join(__dirname, "output.pdf");
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Tabel Header
    const startX = 50; // Koordinat X awal
    const startY = 50; // Koordinat Y awal
    const tableWidth = 500; // Lebar tabel

    // Fungsi membuat cell dengan tinggi dinamis
    const drawCell = (x, y, width, text, options = {}) => {
        const { align = "left", fontSize = 12, padding = 5 } = options;
        doc.fontSize(fontSize);

        const textHeight = doc.heightOfString(text, { width: width - padding * 2 });
        const cellHeight = textHeight + padding * 2;

        doc.rect(x, y, width, cellHeight).stroke();
        doc.text(text, x + padding, y + padding, { width: width - padding * 2, align });

        return cellHeight; // Mengembalikan tinggi cell untuk mengatur posisi berikutnya
    };

    // Gambar Tabel
    let currentY = startY;

    // Baris 1: No. Tugas
    currentY += drawCell(startX, currentY, tableWidth, `No. Tugas: ${taskNumber}`);

    // Baris 2: Soal Tugas
    currentY += drawCell(startX, currentY, tableWidth, `Soal Tugas:\n${taskQuestion}`, { align: "left" });

// Baris 3: Statement SQL dan Tujuan/Penjelasan Query
const leftWidth = tableWidth / 2;
const rightWidth = tableWidth / 2;

// Hitung tinggi teks di kedua kolom terlebih dahulu
const sqlTextHeight = doc.heightOfString(`Statement SQL:\n${sqlStatement}`, { width: leftWidth - 10 });
const purposeTextHeight = doc.heightOfString(`Tujuan/Penjelasan Query:\n${queryPurpose}`, { width: rightWidth - 10 });

// Ambil tinggi terbesar
const maxHeight = Math.max(sqlTextHeight, purposeTextHeight) + 10;

// Gambar kedua kolom dengan tinggi yang sama
doc.rect(startX, currentY, leftWidth, maxHeight).stroke();
doc.text(`Statement SQL:\n${sqlStatement}`, startX + 5, currentY + 5, { width: leftWidth - 10 });

doc.rect(startX + leftWidth, currentY, rightWidth, maxHeight).stroke();
doc.text(`Tujuan/Penjelasan Query:\n${queryPurpose}`, startX + leftWidth + 5, currentY + 5, { width: rightWidth - 10 });

// Pindahkan posisi Y ke bawah
currentY += maxHeight;



    // Baris 4: Hasil Query/SQL
    currentY += drawCell(startX, currentY, tableWidth, "Hasil Query/SQL:", { align: "left" });

    // Tambahkan gambar jika tersedia
    if (queryResultPath) {
        try {
            // Muat gambar untuk mendapatkan dimensinya
            const image = doc.openImage(queryResultPath);
            const imageWidth = image.width;
            const imageHeight = image.height;

            // Tentukan ukuran maksimum untuk gambar di tabel
            const maxWidth = tableWidth; // Sama dengan lebar tabel
            const maxHeight = 250; // Tinggi maksimum gambar di tabel

            // Hitung dimensi gambar untuk mempertahankan rasio aspek
            let displayWidth = maxWidth;
            let displayHeight = (imageHeight / imageWidth) * maxWidth;

            if (displayHeight > maxHeight) {
                displayHeight = maxHeight;
                displayWidth = (imageWidth / imageHeight) * maxHeight;
            }

            doc.image(queryResultPath, startX, currentY, {
                fit: [displayWidth, displayHeight], // Ukuran gambar
                align: "center",
            });
            currentY += displayHeight;
        } catch (err) {
            console.error("Gagal memuat gambar:", err);
            currentY += drawCell(startX, currentY, tableWidth, "Gagal memuat gambar", { align: "center" });
        }
    } else {
        currentY += drawCell(startX, currentY, tableWidth, "Tidak ada gambar diunggah", { align: "center" });
    }

    doc.end();

    stream.on("finish", () => {
        res.download(outputPath, "output.pdf", (err) => {
            if (err) {
                console.error("Error downloading the file:", err);
                res.status(500).send("Error downloading the file.");
            }
        });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${(PORT)}`);
});