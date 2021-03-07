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
                "View all employees",
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
            
            case "View all employees":
            viewAllEmployees(); 
            break;

            case "Add a department":
            addDepartment();
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

// View all employees
function viewAllEmployees() {
    connection.query(
        `SELECT e_id, first_name, last_name, title, name, salary, manager_id
        FROM employee
        INNER JOIN role
        ON employee.role_id = role.r_id
        INNER JOIN department
        ON role.department_id = department.d_id
        ORDER BY e_id ASC;
        `,
        function(err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
        }
    )
}

// Add a Department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What department would you like to add?',
            name: 'newDepartment'
        }
    ]).then(({newDepartment}) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name:newDepartment
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Department inserted!\n');
                backMenu();
            }
        )
    })
}


