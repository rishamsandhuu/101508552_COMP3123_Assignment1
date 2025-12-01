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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const employeeValidation = [
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('email').isEmail(),
  body('position').notEmpty(),
  body('salary').isNumeric(),
  body('date_of_joining').notEmpty(),
  body('department').notEmpty()
];

router.post(
  '/employees',
  authMiddleware,
  upload.single('profilePicture'),
  employeeValidation,
  handleValidation,
  createEmployee
);

router.get('/employees', authMiddleware, getEmployees);

router.get(
  '/employees/:id',
  authMiddleware,
  [param('id').isMongoId()],
  handleValidation,
  getEmployeeById
);

router.put(
  '/employees/:id',
  authMiddleware,
  upload.single('profilePicture'),
  [
    param('id').isMongoId(),
    body('email').optional().isEmail(),
    body('salary').optional().isNumeric()
  ],
  handleValidation,
  updateEmployee
);

router.delete(
  '/employees/:id',
  authMiddleware,
  [param('id').isMongoId()],
  handleValidation,
  deleteEmployee
);

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