// requirements
// a function to get the data from the csv file
// a function to add a new entry to the csv file
// a function to render the data in the csv file as a html table
// a function to delete an entry from the csv file via the html table
// a function to update an entry in the csv file via the html table
// a function to search for an entry in the csv file via the html table
// a function to sort the entries in the csv file via the html table
// a function to filter the entries in the csv file via the html table
// a function to convert the csv file to an array of objects

async function loadAquilegias() {
    const response = await fetch("/get-plants");
    const results = await response.json();

    return results;
}

async function renderTable() {
    const aquilegias = await loadAquilegias()
    const app = document.querySelector("#app")
    const table = document.createElement("table")
    const header = table.createTHead()
    const headerRow = header.insertRow()
    const tbody = table.createTBody()
    const tableHeadingsArray = ["ID", "Colour", "Flower", "Location"];

    tableHeadingsArray.map((tableHeading) => {
        const th = document.createElement("th");
        th.textContent = tableHeading;
        headerRow.appendChild(th);
    })

    aquilegias.map((aquilegia) => {
        const row = tbody.insertRow();
        const { id, colour, flower, location } = aquilegia;

        [id, colour, flower, location].map((value, index) => {
            const cell = row.insertCell();

            if (index === 1) {
                const colourElement = document.createElement("div");
                colourElement.classList.add("colour-element")
                const colours = [{colour: "purple", value: "#fcf"}, {colour: "white", value: "#ffffff"}, {colour: "mauve", value: "#ccf"}]
                colours.map((colourObj) => {
                    if (colour === colourObj.colour) {
                        colourElement.style.backgroundColor = colourObj.value;
                    }
                })
                cell.appendChild(colourElement)
            } else {
                cell.textContent = value;
            }

        })
    })

    app.appendChild(table);
}

document.addEventListener("DOMContentLoaded", renderTable);