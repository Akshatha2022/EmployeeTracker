//const connection = require('./config/connection');
const inquirer = require('inquirer');
const aTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require("./javascript/validate");
const mysql = require("mysql2");


require("dotenv").config();
//console.log (process.env.DB_PASSWORD)
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
  inquirer.prompt([
          {
              type: 'list',
              message: 'What would you like to do?',
              name: 'selection',
              default: (0),
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
                 'Remove Employee',
                'Remove Role',
              'Remove Department',
          'Exit'
                  ]
          }
      ])
      .then((reply) => {
        const {selection} = reply;
  
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
              addNewRole();
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

// View Functions

// View All Employees
const viewAllEmployees = () => {
  let sql =       `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
  connection.query(sql, (error, reply) => {
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
  connection.query(sql, (error, reply) => {
    if (error) throw error;
      reply.forEach((role) => {console.log(role.title);});
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
  });
};

// View all Departments
const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
  connection.query(sql, (error, selection) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`All Departments:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(selection);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

//View all Departments by Budget
const viewDepartmentBudget = () => {
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
  console.log(chalk.yellow.bold(`====================================================================================`));
  const sql =     `SELECT department_id AS id, 
                  department.department_name AS department,
                  SUM(salary) AS budget
                  FROM  role  
                  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  connection.query(sql, (error, selection) => {
    if (error) throw error;
      console.table(selection);
      console.log(chalk.red.bold(`====================================================================================`));
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
  connection.query(sql, (error, reply) => {
    if (error) throw error;
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.table(reply);
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
};

// ----------------------------- ADD ------------------------------------------------

// Add a New Employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const crit = [answer.firstName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (error, details) => {
      if (error) throw error; 
      const roles = details.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleSelection => {
              const position = roleSelection.role;
              crit.push(position);
              const managerSql =  `SELECT * FROM employee`;
              connection.query(managerSql, (error, details) => {
                if (error) throw error;
                const managers = details.map(({ id, firstname, lastname }) => ({ name: firstname + " "+ lastname, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerSelection => {
                    const manager = managerSelection.manager;
                    crit.push(manager);
                    const sql =   `INSERT INTO employee (firstname, lastname, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};


// Add a New Role
const addNewRole = () => {
  const sql = 'SELECT * FROM department'
  connection.query(sql, (error, reply) => {
      if (error) throw error;
      let deptNamesArray = [];
      reply.forEach((department) => {deptNamesArray.push(department.department_name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            this.addDepartment();
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: validate.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: validate.validateSalary
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            reply.forEach((department) => {
              if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
            });

            let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let crit = [createdRole, answer.salary, departmentId];

            connection.query(sql, crit, (error) => {
              if (error) throw error;
              console.log(chalk.red.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(chalk.red.bold(`====================================================================================`));
              viewAllRoles();
            });
          });
      };
    });
  };
  
// Adding a New Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
        validate: validate.validateString
      }
    ])
    .then((answer) => {
      let sql =     `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, reply) => {
        if (error) throw error;
        console.log(``);
        console.log(chalk.greenBright(reply.newDepartment + ` Department successfully created!`));
        console.log(``);
        viewAllDepartments();
      });
    });
};

// ------------------------------------------------- UPDATE -------------------------------------------------------------------------

// Update an Employee's Role
const updateEmployeeRole = () => {
  let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                  FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.query(sql, (error, reply) => {
    if (error) throw error;
    let employeeNamesArray = [];
    reply.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    let sql =     `SELECT role.id, role.title FROM role`;
    connection.query(sql, (error, reply) => {
      if (error) throw error;
      let rolesArray = [];
      reply.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          reply.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          reply.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(
            sqls,
            [newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(chalk.green.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Employee Role Updated`));
              console.log(chalk.green.bold(`====================================================================================`));
              promptUser();
            }
          );
        });
    });
  });
};

// Update an Employee's Manager
const updateEmployeeManager = () => {
  let sql =       `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                  FROM employee`;
   connection.query(sql, (error, reply) => {
    if (error) throw error;
    let employeeNamesArray = [];
    reply.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId, managerId;
        reply.forEach((employee) => {
          if (
            answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.red(`Invalid Manager Selection`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          promptUser();
        } else {
          let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

          connection.query(
            sql,
            [managerId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`====================================================================================`));
              console.log(chalk.green(`Employee Manager Updated`));
              console.log(chalk.greenBright.bold(`====================================================================================`));
              promptUser();
            }
          );
        }
      });
  });
};


// -------------------------------------- REMOVE --------------------------------------------------------

// Delete an Employee
const removeEmployee = () => {
  let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

  connection.query(sql, (error, reply) => {
    if (error) throw error;
    let employeeNamesArray = [];
    reply.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee would you like to remove?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId;

        reply.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        let sql = `DELETE FROM employee WHERE employee.id = ?`;
        connection.query(sql, [employeeId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.redBright(`Employee Successfully Removed`));
          console.log(chalk.RedBright.bold(`====================================================================================`));
          viewAllEmployees();
        });
      });
  });
};

// Delete a Role
const removeRole = () => {
  let sql = `SELECT role.id, role.title FROM role`;

  connection.query(sql, (error, reply) => {
    if (error) throw error;
    let roleNamesArray = [];
    reply.forEach((role) => {roleNamesArray.push(role.title);});

    inquirer
      .prompt([
        {
          name: 'chosenRole',
          type: 'list',
          message: 'Which role would you like to remove?',
          choices: roleNamesArray
        }
      ])
      .then((answer) => {
        let roleId;

        reply.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });

        let sql =   `DELETE FROM role WHERE role.id = ?`;
        connection.query(sql, [roleId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.greenBright(`Role Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllRoles();
        });
      });
  });
};


// Delete a Department
const removeDepartment = () => {
let sql =   `SELECT department.id, department.department_name FROM department`;
connection.query(sql, (error, reply) => {
  if (error) throw error;
  let departmentNamesArray = [];
  reply.forEach((department) => {departmentNamesArray.push(department.department_name);});

  inquirer
    .prompt([
      {
        name: 'chosenDept',
        type: 'list',
        message: 'Which department would you like to remove?',
        choices: departmentNamesArray
      }
    ])
    .then((answer) => {
      let departmentId;

      reply.forEach((department) => {
        if (answer.chosenDept === department.department_name) {
          departmentId = department.id;
        }
      });

      let sql =     `DELETE FROM department WHERE department.id = ?`;
      connection.query(sql, [departmentId], (error) => {
        if (error) throw error;
        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(chalk.redBright(`Department Successfully Removed`));
        console.log(chalk.redBright.bold(`====================================================================================`));
        viewAllDepartments();
      });
    });
});
};