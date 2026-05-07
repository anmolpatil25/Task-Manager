const Task = require('../models/Task');

exports.createTask = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTasks = async (
  req,
  res
) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo')
      .populate('project');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    console.log(req.params.id);
    const task = await Task.findById(req.params.id)
      .populate("assignedTo")
      .populate("project");
 
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
 
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTask = async (
  req,
  res
) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteTask = async (
  req,
  res
) => {
  try {
    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
