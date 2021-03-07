-- Departments
INSERT INTO department (d_id, name)
VALUES (1, "Sales");

INSERT INTO department (d_id, name)
VALUES (2, "Legal");

INSERT INTO department (d_id, name)
VALUES (3, "Engineering");

INSERT INTO department (d_id, name)
VALUES (4, "Finance");

-- Department Roles
INSERT INTO role (r_id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (2, "Salesperson", 80000, 1);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (3, "Legal Team Lead", 250000, 2);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (4, "Lawyer", 190000, 2);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (5, "Lead Engineer", 150000, 3);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (6, "Software Egineer", 120000, 3);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (7, "Accountant", 125000, 4);

