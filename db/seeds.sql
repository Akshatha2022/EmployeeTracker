INSERT INTO department(department_name)
VALUES("IT"), ("Marketing"), ("Finance"), ("Sales"), ("HR");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 95000, 1), ("Senior Engineer", 125000, 1), ("CFO", 350000, 3), ("Chief Counsel", 300000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Aadhrith', 'Ajay', 1, 2), ('Akshatha', 'Krishnamurthy', 1, 2), ('Abhishek', 'Krishnamurthy', 1, 2), ('Girija', 'Nagaraj', 2, 2), ('Krishnamurthy', 'Narasimhamurthy', 4, null);