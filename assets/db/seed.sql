USE employee_db;

INSERT INTO department (name)
VALUES 
("Sales"), 
("Finances"), 
("Human Resources"), 
("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Managers", 50000, 1),
("Sales Associate", 30000, 1),
("Consultant", 70000, 2),
("Accountant", 50000, 2),
("HR Managers", 100000, 3),
("Benefits Coordinator", 45000, 3),
("Software Engingeer", 150000, 4),
("Junior Developer", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Smith", 1, NULL),
("Jane", "Smith", 2, 1),
("Malik", "Jones", 3, NULL),
("Raul", "Perez", 4, NULL),
("Niki", "Hassan", 5, NULL),
("Lily", "Ngyuen", 6, 5),
("Allison", "Brown", 7, NULL),
("David", "Lowe", 8, NULL);