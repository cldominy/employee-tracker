// Setting up npm's and server connection
const mysql = require('mysql');
const inquirer = require('inquirer');
const ctable = require('console.table');

// Connect and starting the application
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "jordicakes24148",
    database: "employee_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    startApp();
  }); 

//   Lookup Function
  function lookup(sqlStatement){
    return new Promise((resolve, reject) => {
        connection.query(sqlStatement, function(err, data){
            resolve(data)
        })
    })
  }

//   Start App to run through inquirer prompts
  function startApp(){
      inquirer.prompt([
          {
            type: "list",
            name: "menu",
            message: "Please choose from the following selection",
            choices: ["Add Department", "Add Roles", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Roles", "Exit"]
          }
      ]).then(function(answer){
          switch(answer.menu){
              case "Add Department":
                  addDepartment();
                  break;
              case "Add Roles":
                  addRoles();
                  break;
              case "Add Employee":
                  addEmployee();
                  break;
              case "View Departments":
                  viewDepartments();
                  break;
              case "View Roles":
                  viewRoles();
                  break;
              case "View Employees":
                  viewEmployees();
                  break;
              case "Update Employee Roles":
                  updateRoles();
                  break;
              default:
                  console.log("Goodbye!")
                  connection.end();
          }
      })
  }

//   Viewing Functions
  function viewDepartments(){
    connection.query("SELECT * FROM department", function(err, data){
        if(err){
            throw err
        }
        console.table(data)
        startApp();
    })
  }

  function viewRoles(){
    connection.query("SELECT * FROM role", function(err, data){
        if(err){
            throw err
        }
        console.table(data)
        startApp();
    })
  }

  function viewEmployees(){
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name , title, name department, salary, 
    concat(employee2.first_name, " ", employee2.last_name) manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee employee2 ON employee.manager_id = employee2.id`, function(err, data){
        if(err){
            throw err
        }
        console.table(data)
        startApp();
    })
  }

//   Adding Functions
  function addDepartment(){
      inquirer.prompt([
          {
              type: "input",
              name: "department",
              message: "What department would you like to add?"
          }
      ]).then(function(answer){
          connection.query("INSERT INTO department (name) VALUES (?)", answer.department, function(err, data){
              if(err){
                  throw err
              }
              console.log("Department added successfully!")
              startApp();
          })
      })
  }

  function addRoles(){
    lookup("SELECT name FROM department").then(function(results){
          const departments = results.map(name => name)
          console.log(departments)
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of the role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "departmentName",
                message: "Select one of the following departments for the role",
                choices: departments
            }
        ]).then(function(answer){

            lookup(`SELECT id FROM department WHERE name = "${answer.departmentName}"` ).then(function(departmentResults){
                console.log(departmentResults)
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, answer.salary, departmentResults[0].id], function(err, data){
                    if(err){
                        throw err
                    }
                    console.log("Role added successfully!")
                    startApp();
                })
            })
        })
    })
}

function addEmployee(){
    connection.query(`SELECT role_id, title, employee.id employeeID, concat(first_name, " ", last_name) managerName FROM employee
    LEFT JOIN role ON employee.role_id = role.id`, (err, results) => {
        if (err) {
          throw err;
        }
      inquirer.prompt([
          {
              type: "input",
              name: "first",
              message: "What is the first name of the employee?"
          },
          {
              type: "input",
              name: "last",
              message: "What is the last name of the employee?"
          },
          {
            type: "list",
            name: "roles",
            message: "Select one of the following roles for the employee",
            choices: () => {
                let roleArray = [];
                for (let i = 0; i < results.length; i++) {
                    roleArray.push(results[i].title);
                }
                return roleArray;}
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the manager for the employee?",
            choices: () => {
                let managerArray = ["None"];
                for (let i = 0; i < results.length; i++) {
                    managerArray.push(results[i].managerName);
                }
                return managerArray;}
        }
      ]).then(function(answer){
          let role_id;
          for (let index = 0; index < results.length; index++) {
              if (results[index].title === answer.roles){
                  role_id = results[index].role_id
              }
          }
          let manager_id;
          for (let index = 0; index < results.length; index++) {
              if (results[index].managerName === answer.manager){
                manager_id = results[index].employeeID
              }
          }
              connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.first, answer.last, role_id, manager_id], function(err, data){
                  if(err){
                      throw err
                  }
                  console.log("Employee added successfully!")
                  startApp();
              })
            })
        })
  }

//   Updating Function
  function updateRoles(){
      inquirer.prompt([
          {
            type: "input",
            name: "updateEmployee",
            message: "Input the ID of the employee",
          },
      ]).then(function (answer){
          const id = answer.updateEmployee
          inquirer.prompt([
              {
                name: "roleInput",
                type: "input",
                message: "Enter ID of the role for the employee"
              }
          ]).then(function (answer){
              const roleID = answer.roleInput
              connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, id], function(err, data){
                  if (err) throw err;
                  console.log("Employee updated successfully!")
                  startApp();
              })
          })
      })
}