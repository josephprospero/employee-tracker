const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const consoleTable = require('console.table');

let departmentArr = [];
let employeeArr = [];
let roleArr = [];


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

// Main Menu selection
function mainMenu() {
    makeDepartmentArr();
    makeRoleArr();
    makeEmployeeArr();
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

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "Update employee role":
                updateRole();
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
                break;
        }
    });
}

// View all Departments
function viewAllDepartments() {
    connection.query(
        `SELECT * FROM department
        ORDER BY d_id ASC`,
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
        ORDER BY r_id ASC
        `,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
        }
    )
}

// View all employees
function viewAllEmployees() {
    connection.query(
        `SELECT e_id AS ID, first_name AS First_Name, last_name AS Last_Name, title AS Job_Title, name AS Department, salary AS Annual_Income, manager_id AS Manager_Employee_ID
        FROM employee
        INNER JOIN role
        ON employee.role_id = role.r_id
        INNER JOIN department
        ON role.department_id = department.d_id
        ORDER BY e_id ASC;
        `,
        function (err, results) {
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
    ]).then(({ newDepartment }) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: newDepartment
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Department inserted!\n');
                backMenu();
            }
        )
    })
}

// Add a role functions
function makeDepartmentArr() {
    departmentArr = [];
    connection.query(
        'SELECT * FROM department',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                departmentArr.push(element.name);
            });
            return;
        }
    )
}

function indexFinder(matchName, arrName) {
    let index = -1
    for (let i = 0; i < arrName.length; i++) {
        if (arrName[i] === matchName) {
            index = i + 1;
        }
    }
    return index;
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new role?',
            name: 'newRole'
        },
        {
            type: 'input',
            message: 'What is the salary for the new role?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Under which department is this new role?',
            name: 'department',
            choices: departmentArr
        }
    ]).then(({ newRole, salary, department }) => {
        let index = indexFinder(department, departmentArr)
        connection.query(
            'INSERT INTO role set ?',
            {
                title: newRole,
                salary: salary,
                department_id: index
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Role succesfully added\n');
                backMenu();
            }
        )
    })
}
// End add role functions


// Adding employee functions
function makeRoleArr() {
    roleArr = [];
    connection.query(
        'SELECT * FROM role',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                roleArr.push(element.title);
            });
            return;
        }
    )
}

function makeEmployeeArr() {
    employeeArr = [];
    connection.query(
        'SELECT * FROM employee',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                let name = element.first_name + ' ' + element.last_name;
                employeeArr.push(name);
            });
            return;
        }
    )
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "What's the employee's title?",
            name: 'title',
            choices: roleArr
        },
        {
            type: 'list',
            message: "Who is this employee's manager?",
            name: 'manager',
            choices: employeeArr
        }
    ]).then(({ firstName, lastName, title, manager }) => {
        let index = indexFinder(title, roleArr)
        let index2 = indexFinder(manager, employeeArr)
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: firstName,
                last_name: lastName,
                role_id: index,
                manager_id: index2
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Employee succesfully added\n');
                backMenu();
            }
        )
    })
}

function updateRole() {
    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee's info would you like to update?",
            name: 'employee',
            choices: employeeArr
        },
        {
            type: 'list',
            message: "What new role would you like to give this employee?",
            name: 'title',
            choices: roleArr
        }
    ]).then(({ employee, title }) => {
        let index = indexFinder(title, roleArr)
        let index2 = indexFinder(employee, employeeArr)
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [{
                role_id: index
            },
            {
                e_id: index2
            }],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Employee role successfully updated\n');
                backMenu();
            }
        )
    })
}
// End Add Employee functions