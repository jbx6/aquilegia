const { program } = require('commander');
const { version, description } = require('./package.json');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const DB_PATH = 'aquilegia.csv';

program
.version(version)
.description(description)

// Command to add a new aquilegia entry to database
// Arguments: id (app-generated), color, flower_type, location
program
    .command('add <color> <flower_type> <location>')
    .description('Add a new aquilegia entry to the database')
    .action((color, flower_type, location) => {
        // Check if database exists
        checkDatabase(DB_PATH)
        fs.createReadStream(DB_PATH)
        .pipe(csv())
        .on('data', (row) => {
            if (row.color === color && row.flower_type === flower_type && row.location === location) {
                console.log('This entry already exists in the database');
                process.exit(1);
            }
        })
        .on('end', () => {
            const csvWriter = createCsvWriter({
                path: DB_PATH,
                header: [
                    {id: 'id', title: 'ID'},
                    {id: 'color', title: 'Color'},
                    {id: 'flower_type', title: 'Flower Type'},
                    {id: 'location', title: 'Location'}
                ],
                append: true
            });
            csvWriter.writeRecords([{id: Math.floor(Math.random() * 1000000), color: color, flower_type: flower_type, location: location}])
            .then(() => {
                console.log('New entry added to database');
            });
        });
    });

// Command to list all aquilegia entries in the database
program
    .command('list')
    .description('List all aquilegia entries in the database')
    .action(() => {
        checkDatabase(DB_PATH)
        fs.createReadStream(DB_PATH)
        .pipe(csv())
        .on('data', (row) => {
            console.log(row);
        })
        .on('end', () => {
            console.log('End of database');
        });
    });

// Command to delete an aquilegia entry from the database
// Arguments: id


// Function to check if database exists
function checkDatabase(DB_PATH) {
    if (!fs.existsSync(DB_PATH)) {
        console.log('Database does not exist. Creating database...');
        createDatabase(DB_PATH);
    }
    console.log('Database exists')
}

// Function to create a database if it does not exist
function createDatabase(DB_PATH) {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, 'id,color,flower_type,location\n');
        console.log('Database created');
    }
}

program.parse(process.argv);