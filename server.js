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

// endpoint to add a new entry to the csv file
app.post("/add-plant", async (req, res) => {
  const { colour, flower, location } = req.body;
  const data = await csvToArray();
  const id = data.length + 1;
  const newData = { id, colour, flower, location };

  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: "id", title: "ID" },
      { id: "colour", title: "Color" },
      { id: "flower", title: "Flower" },
      { id: "location", title: "Location" }
    ],
    append: true
  });

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
        if (row.colour === colour && row.flower === flower && row.location === location) {
            console.log("This entry already exists in the database");
            res.status(400).send("This entry already exists in the database");
            return;
        }
    })
    .on("end", () => {
        csvWriter.writeRecords([newData])
        .then(() => {
            console.log("New aquilegia entry added to database");
            res.status(201).send("New aquilegia entry added to database");
        });
    });
});