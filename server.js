// server.js
const express = require('express');
const csv = require("csv-parser");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const app = express();
const PORT = process.env.PORT || 3009;
const csvFilePath = "aquilegia.csv";

app.use(express.static("public"));
app.use(express.json());

// Function to convert the csv file to an array of objects
const csvToArray = async () => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results));
    });
}

// Function to get the data from the csv file
app.get("/get-plants", async (req, res) => {
  const data = await csvToArray();
  res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})