import express from "express";
import cors from "cors";
import tasksRoutes from "./tasks/task.routes.js";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Importar swagger.json de forma compatible
const swaggerPath = path.resolve("./swagger/openapi.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

import swaggerUi from "swagger-ui-express";

// Rutas
app.use("/tasks", tasksRoutes);

// Ruta de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Task API running. Usa /tasks para gestionar tareas.");
});

export default app;
