import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getSummary,
  updateTaskStatus
} from "./task.controller.js";

const router = express.Router();

// Rutas
router.get("/summary", getSummary); // resumen primero
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus); // cambiar solo status
router.delete("/:id", deleteTask);

export default router;
