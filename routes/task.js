const express = require("express");
const {
  addTask,
  updateTask,
  deleteTask,
  getAllTask,
} = require("../controllers/task");
const { validate } = require("../middleware/isAuthorized");

const router = express.Router();

//Getting all tasks of User
router.get("/", validate, getAllTask);

//For Adding Tasks
router.post("/", validate, addTask);

// For Updating a Tasks
router.put("/", validate, updateTask);

// For Deleting a Task
router.delete("/", validate, deleteTask);

module.exports = router;
