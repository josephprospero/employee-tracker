const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const consoleTable = require('console.table');

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

// Main Menu
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
                "Update employee role",
                "End session"
            ]
        }
    ]).then(({ action }) => {
        console.log(action);
        switch (action) {
            case "View all departments":
            viewAllDepartments();
            break;
        
            case "View all roles":
            viewAllRoles();
            break;
            
            case "End session":
            connection.end();
            break;
        }
    });
}

// Return menu and End session
function backMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
            "Go back to main menu",
            "End session"
        ]
        }
    ]).then(({ action }) => {
        console.log(action);
        switch (action) {
        case "Go back to main menu":
            mainMenu();
            break;

        case "End session":
            connection.end();
            break;}
    });
}

// All Departments
function viewAllDepartments() {
    connection.query(
        'SELECT * FROM department',
        function (err, results) {
            if (err) throw (err);
            console.table(results);
            backMenu();
        }
    );
}

// View all roles
function viewAllRoles() {
    connection.query(
        `SELECT r_id AS role_id, title AS job_title, name AS department_name, salary
        FROM role
        INNER JOIN department
        ON role.department_id = department.d_id
        `,
        function(err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
        }
    )
}