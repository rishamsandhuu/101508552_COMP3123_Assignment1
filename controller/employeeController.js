// controller/employeeController.js
const Employee = require('../model/employee');

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.profilePicture = `/uploads/${req.file.filename}`;
    }

    const employee = new Employee(data);
    await employee.save();
    res
      .status(201)
      .json({ message: 'Employee created successfully', employee_id: employee._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.profilePicture = `/uploads/${req.file.filename}`;
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};