## COMP3123 – Assignment 1

### **Student Name:** Rishamnoor Kaur

### **Student ID:** 101508552

### **Course:** COMP 3123 – Full Stack Development

### **Instructor:** Pritesh Patel, Akansha Mandhana

---

## Project Overview

This project is a **RESTful API** built using **Node.js**, **Express**, and **MongoDB**, implementing **user** and **employee** management with **CRUD operations**, **validation**, and optional **JWT authentication**.

The API allows users to **sign up**, **log in**, and manage **employee records** via secure endpoints that communicate using **JSON**.

---

## 🧰 Technologies Used

* **Node.js** – JavaScript runtime for backend
* **Express.js** – Framework for building RESTful APIs
* **MongoDB & Mongoose** – Database and ODM
* **bcrypt** – Password hashing
* **jsonwebtoken (JWT)** – Authentication (optional)
* **express-validator** – Request validation
* **dotenv** – Environment variable management

---

## 👥 API Endpoints

### **User Routes** (Base path: `/api/v1/user`)

| Method   | Endpoint  | Status | Description                             |
| -------- | --------- | ------ | --------------------------------------- |
| **POST** | `/signup` | 201    | Register a new user                     |
| **POST** | `/login`  | 200    | Log in with username/email and password |

#### 🧾 Sample User for Testing

```json
{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
}
```

---

### **Employee Routes** (Base path: `/api/v1/emp`)

| Method     | Endpoint             | Status | Description                    |
| ---------- | -------------------- | ------ | ------------------------------ |
| **GET**    | `/employees`         | 200    | Get all employees              |
| **POST**   | `/employees`         | 201    | Create a new employee          |
| **GET**    | `/employees/:eid`    | 200    | Get employee by ID             |
| **PUT**    | `/employees/:eid`    | 200    | Update employee details        |
| **DELETE** | `/employees?eid=xxx` | 204    | Delete employee by query param |


---

## Author

**Rishamnoor Kaur**
Student ID: **101508552**
Email: **[rishamnoor.kaur@georgebrown.ca](mailto:rishamnoor.kaur@georgebrown.ca)**


