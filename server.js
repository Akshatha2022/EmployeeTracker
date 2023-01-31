// const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require('./javascript/validate');
const mysql = require('mysql2');

require('dotenv').config();
// console.log (process.env.DB_PASSWORD)
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employees'
});

// // Database Connect and Starter Title
connection.connect((error) => {
  if (error) throw error;
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log(`                                                          ` + chalk.greenBright.bold('Created By: Akshatha'));
  console.log(``);
  console.log(chalk.yellow.bold(`====================================================================================`));
  promptUser();
});

// Prompt User for Choices
const promptUser = () => {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'What would you like to do today?',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'View Department Budgets',
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Delete Employee',
          'Delete Role',
          'Delete Department',
          'Exit Menu'
          ]
      }
    ])
    .then((answers) => {
      // When we are selecting an option, if it matches it will run the below function
      const {choices} = answers;

        if (choices === 'View All Employees') {
            viewEmployees();
        }

        if (choices === 'View All Departments') {
          viewAllDepartments();
      }

        if (choices === 'View All Employees By Department') {
            viewEmployeesByDepartment();
        }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Remove Employee') {
            removeEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'Update Employee Manager') {
            updateEmployeeManager();
        }

        if (choices === 'View All Roles') {
            viewAllRoles();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Remove Role') {
            removeRole();
        }

        if (choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'View Department Budgets') {
            viewDepartmentBudget();
        }

        if (choices === 'Remove Department') {
            removeDepartment();
        }

        if (choices === 'Exit') {
            connection.end();
        }
  });
};

// ----------------------------------------------------- VIEW -----------------------------------------------------------------------

// View All Employees
const viewEmployees = () => {
  const sql =       `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

// View all Roles
const viewAllRoles = () => {
const sql =     `SELECT role.id, role.title, department.department_name AS department
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);  
    promptUser();
  });
};

// View all Departments
const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
       promptUser();
  });
};

// View all Employees by Department
const viewEmployeesByDepartment = () => {
  const sql =     `SELECT employee.first_name, 
                  employee.last_name, 
                  department.department_name AS department
                  FROM employee 
                  LEFT JOIN role ON employee.role_id = role.id 
                  LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);  
    promptUser();
    });
};

//View all Departments by Budget
const viewDepartmentBudget = () => {
    const sql =     `SELECT department_id AS id, 
                  department.department_name AS department,
                  SUM(salary) AS budget
                  FROM  role  
                  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
      promptUser();
  });
};

// --------------------------------------------------- ADD --------------------------------------------------------------------

// Add a New Employee
const addEmployee = () => {

  connection.query("SELECT * FROM role", roleSql, (error, data) => {
    if (error) throw error; 
    const roles = data.map(({ id, title }) =>
    
    ({ 
      name: title, 
      value: id 
    })
    );

  inquirer
  .prompt([
    {
      type: 'input', // it moves ahead with the appropriate questions based on the selection
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            return "I need input or an answer to continue"
        }
      }
    }, // it validates and will only continue if it gets an input
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
          return "I need input or an answer to continue"
        }
      }
    }
  ])
    .then(answer => {
      console.log(answer.role)
    connection.query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ 
        
        name: title, 
        value: id 
      
      })
      );

     [
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles,

              validate: (addRole) => {
                if(addRole) {
                  return true;}
                  else {
                    return "I need an answer or input to continue"
                  }
                }
              },
            ]
             .then(roleChoice => {
                          const role = roleChoice.role;
                          crit.push(role);
                          const managerSql =  `SELECT * FROM employee`;
                          connection.query(managerSql, (error, data) => {
                            if (error) throw error;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                            inquirer.prompt([
                              {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the employee's manager?",
                                choices: managers
                              }
                            ])
                              .then(managerChoice => {
                                const manager = managerChoice.manager;
                                crit.push(manager);
                                const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                              VALUES (?, ?, ?, ?)`;
                                connection.query(sql, crit, (error) => {
                                if (error) throw error;
                                console.log("Employee has been added!")
                                viewEmployees();
                          });
              });
            });
          });
        });
     });
  });
};
