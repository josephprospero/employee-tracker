const inquirer = require('inquirer');
const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});
connection.connect(err => {
    if (err) throw err;
    console.log("Welcome!")
    console.log('connected as id ' + connection.threadId + '\n');
    mainMenu();
});

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "View all departments",
                "View all roles",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role"
            ]
        }
    ]).then(({ action }) => {
        console.log(data);
        switch (answer.action) {
            case "View all departments";
            viewAllDepartments();
            break;
        }
    });
    connection.end()
}