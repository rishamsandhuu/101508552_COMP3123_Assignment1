const express = require('express');
const { body, param } = require('express-validator');
const {
  createEmployee
  //getEmployees,
  //getEmployeeById,
  //updateEmployee,
  //deleteEmployee
} = require('../controller/employeeController');
const handleValidation = require('../middleware/handleValidation');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Create a new employee
router.post(
  '/employees',
  authMiddleware, 
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('position').notEmpty().withMessage('Position is required'),
    body('salary').notEmpty().withMessage('Salary is required').isNumeric().withMessage('Salary must be a number'),
    body('date_of_joining').notEmpty().withMessage('Date of joining is required').isISO8601().toDate(),
    body('department').notEmpty().withMessage('Department is required')
  ],
  handleValidation,
  createEmployee
);

// // Get all employees
// router.get('/', authMiddleware, getEmployees);

// // Get employee by ID
// router.get(
//   '/:id',
//   authMiddleware,
//   [param('id').isMongoId().withMessage('Invalid employee ID')],
//   handleValidation,
//   getEmployeeById
// );

// // Update employee
// router.put(
//   '/:id',
//   authMiddleware,
//   [
//     param('id').isMongoId().withMessage('Invalid employee ID'),
//     body('first_name').optional().notEmpty(),
//     body('last_name').optional().notEmpty(),
//     body('email').optional().isEmail(),
//     body('position').optional().notEmpty(),
//     body('salary').optional().isNumeric(),
//     body('date_of_joining').optional().isISO8601().toDate(),
//     body('department').optional().notEmpty()
//   ],
//   handleValidation,
//   updateEmployee
// );

// // Delete employee
// router.delete(
//   '/:id',
//   authMiddleware,
//   [param('id').isMongoId().withMessage('Invalid employee ID')],
//   handleValidation,
//   deleteEmployee
// );

module.exports = router;
