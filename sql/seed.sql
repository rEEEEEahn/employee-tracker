USE employee_db;
INSERT INTO department (name)
VALUES ('Department 1');

USE employee_db;
INSERT INTO role (title, salary, department_id)
VALUES ('title', 100000, 1);

USE employee_db;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('firstname', 'lastname', 1, 1);