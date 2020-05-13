// Packages 
const inquirer = require("inquirer");
const mysql = require("mysql");
const questions = require("./questions");
const consoleTable = require('console.table');

// Connection with the DB
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Northstead136",
    database: "mycompany"
});

connection.connect(function (err) {
    if (err) throw err;

});

// Gives user options on what to do next 
determineAction()
async function determineAction() {
    const results = await inquirer.prompt(questions.actions);
    switch (results.actions) {
        case 'Add New Employee':
            addEmployee();
            break;
        case 'View All Employees':
            viewAll();
            break;
        case 'Update Role':
            updateRole();
            break;
        case 'View All Roles':
            viewAllRoles(); 
            break;
        case "Add Role":
            addRole(); 
            break;
        case 'View All Departments':
            viewAllDept(); 
            break;
        case 'Add Department':
            addDpt(); 
            break;

        default:
            connection.end();
            break;

    }
}

// Add employee function
function addEmployee() {

    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;

        inquirer.prompt([

            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }

                    return choiceArray;
                },
                message: "What is the employee's role?"
            }

        ]).then(function (res) {


            for (var i = 0; i < results.length; i++) {
                if (results[i].title === res.choice) {
                    res.role_id = results[i].id;
                }
            }
            var query = "INSERT INTO employee SET ?"
            const VALUES = {
                first_name: res.firstname,
                last_name: res.lastname,
                role_id: res.role_id
                // manager_id: employee(id)
            }
            connection.query(query, VALUES, function (err) {
                if (err) throw err;
                console.log("Employee successfully added!");
                determineAction()
            }

            )
        })
    })

}

// View all employees function
function viewAll() {
    connection.query("SELECT first_name AS FirstName , last_name as LastName , role.title as Role, role.salary AS Salary, department.name AS Department FROM employee INNER JOIN department ON department.id = employee.role_id left JOIN role ON role.id = employee.role_id", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}

// View all deptartments function
function viewAllDept() {
    connection.query("SELECT name AS Departments FROM department ", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}

// View all roles function
function viewAllRoles() {
    connection.query("Select title as Roles from role ", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}

// Add department function
function addDpt() {
    inquirer
        .prompt({
            name: "newDpt",
            type: "input",
            message: "Which Department would you like to add?"
        })
        .then(function (result) {


            var query = "INSERT INTO department SET?"
            console.log(query)
            var query1 = connection.query(query, [{ name: result.newDpt }], function (err) {
                if (err) throw err;
                console.table("Department Created Successfully!");
                determineAction()
            });


        })
}

// Add role function
function addRole() {
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;


            inquirer.prompt([

                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which Role would you like to add?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the salary you would like to add?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which department does this role belongs to?"
                },

            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "INSERT INTO role SET ?"
                const VALUES = {

                    title: result.newRole,
                    salary: result.newSalary,
                    department_id: result.department_id
                }
                connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly created!");
                    determineAction()
                });

            })
        })
    })
}

// Update role function
function updateRole() {
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;
            inquirer.prompt([

                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which role would you like to update?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the new salary for this role?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }
                        return arrayOfChoices;
                    },
                    message: "Which department does this role belongs to?"
                },
            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
                const VALUES = [

                    { title: result.newRole },
                    { salary: result.newSalary },
                    { department_id: result.department_id }
                ]
                let query1 = connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly Updated!");
                    determineAction()
                });

            })
        })
    })
}
