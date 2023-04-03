// const connection = require('./config/connection');
const inquirer = require("inquirer");
require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");
//const validate = require("./javascript/validate");
const mysql = require("mysql2");
//const data = require('./queries');

require("dotenv").config();
// console.log (process.env.DB_PASSWORD)
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employees"
});

// // Database Connect and Starter Title
connection.connect((error) => {
  if (error) throw error;
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(`                                                          ` + chalk.greenBright.bold('Created By: Akshatha'));
  console.log(``);
  console.log(chalk.yellow.bold(`====================================================================================`));
  promptUser();
});

// Prompt User for Choices
const promptUser = () => {
  inquirer.prompt({
      
        name: "choices",
        type: "list",
        message: "What would you like to do today?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Delete Employee",
          "Delete Role",
          "Delete Department",
          "Exit Menu"
          ],
      
})
function mainMenu() {
  inquirer
      .prompt([
          {
              type: 'list',
              message: 'What would you like to do?',
              name: 'mainMenuChoice',
              default: (0),
              choices: [
                  'View all departments',
                  'View all roles',
                  'View all employees',
                  'View all employees by manager',
                  'View all employees by department',
                  'View department budget utilization',
                  "Add a new Department",
                  "Add a new Role",
                  "Add an Employee",
                  "Update an Employees Title and Manager",
                  "Delete a Department, Role, or Employee",
                  "Quit Employee Management Application"]
          }
      ])
      .then((response) => {
        const {selection} = response;
  
          if (selection === 'View All Employees') {
              viewAllEmployees();
          }
  
          if (selection === 'View All Departments') {
            viewAllDepartments();
        }
  
          if (selection === 'View All Employees By Department') {
              viewEmployeesByDepartment();
          }
  
          if (selection === 'Add Employee') {
              addEmployee();
          }
  
          if (selection === 'Remove Employee') {
              removeEmployee();
          }
  
          if (selection === 'Update Employee Role') {
              updateEmployeeRole();
          }
  
          if (selection === 'Update Employee Manager') {
              updateEmployeeManager();
          }
  
          if (selection === 'View All Roles') {
              viewAllRoles();
          }
  
          if (selection === 'Add Role') {
              addRole();
          }
  
          if (selection === 'Remove Role') {
              removeRole();
          }
  
          if (selection === 'Add Department') {
              addDepartment();
          }
  
          if (selection === 'View Department Budgets') {
              viewDepartmentBudget();
          }
  
          if (selection === 'Remove Department') {
              removeDepartment();
          }
  
          if (selection === 'Exit') {
              connection.end();
          }
    });
  };
}

// View Functions

// View All Employees
const viewAllEmployees = () => {
  let sql =       `SELECT employee.id, 
                  employee.firstname, 
                  employee.lastname, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
  connection.promise().query(sql, (error, reply) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Current Employees:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(reply);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// View all Roles
const viewAllRoles = () => {
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
  console.log(chalk.yellow.bold(`====================================================================================`));
  const sql =     `SELECT role.id, role.title, department.department_name AS department
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
  connection.promise().query(sql, (error, reply) => {
    if (error) throw error;
      reply.forEach((role) => {console.log(role.title);});
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
  });
};

// View all Departments
const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
  connection.promise().query(sql, (error, selection) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`All Departments:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(selection);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};
