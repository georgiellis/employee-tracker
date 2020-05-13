DROP DATABASE IF EXISTS mycompany;
CREATE DATABASE mycompany;
USE mycompany;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES department (id)
   
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, 
    manager_id INT ,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY(role_id) REFERENCES role(id)
);

INSERT INTO department (name) 
VALUES ("Sales"), ("Engineering"),("HR"), ("Finance"),("Marketing");

INSERT into role (title, salary, department_id) VALUES ("Sales Lead", 100000, 1);
INSERT into role (title, salary, department_id) VALUES ("Software Engineer", 50000, 1);
INSERT into role (title, salary, department_id) VALUES ("Lawyer", 100000, 2);
INSERT into role (title, salary, department_id) VALUES ("Accountant", 900000, 2);
INSERT into role (title, salary, department_id) VALUES ("Salesperson", 100000, 3);
INSERT into role (title, salary, department_id) VALUES ("Lead Engineer", 30000, 3);
INSERT into role (title, salary, department_id) VALUES ("HR Team Lead", 30000, 3);


INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", 2, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Scott", 2, 1);