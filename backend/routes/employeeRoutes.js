// routes/employeeRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const multer = require('multer');
const path = require('path');

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require('../controller/employeeController');
const handleValidation = require('../middleware/handleValidation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Validation for common employee fields
const employeeValidation = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('date_of_joining').notEmpty().withMessage('Date of joining is required'),
  body('department').notEmpty().withMessage('Department is required')
];

// Create a new employee (with optional picture)
router.post(
  '/employees',
  authMiddleware,
  upload.single('profilePicture'),
  employeeValidation,
  handleValidation,
  createEmployee
);

// Get all employees
router.get('/employees', authMiddleware, getEmployees);

// Get employee by ID
router.get(
  '/employees/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid employee ID')],
  handleValidation,
  getEmployeeById
);

// Update employee (with optional picture)
router.put(
  '/employees/:id',
  authMiddleware,
  upload.single('profilePicture'),
  [
    param('id').isMongoId().withMessage('Invalid employee ID'),
    // optional validation: fields can be optional on update
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number')
  ],
  handleValidation,
  updateEmployee
);

// Delete employee
router.delete(
  '/employees/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid employee ID')],
  handleValidation,
  deleteEmployee
);

// Search employee by department/position
router.get(
  '/employees/search',
  authMiddleware,
  [
    query('department').optional().isString(),
    query('position').optional().isString()
  ],
  handleValidation,
  searchEmployees
);

module.exports = router;