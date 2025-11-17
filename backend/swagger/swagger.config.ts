{
  "openapi": "3.0.0",
  "info": {
    "title": "Task API",
    "version": "1.0.0",
    "description": "API para gestionar tareas (todo, doing, done) usando Node y Express"
  },
  "servers": [
    {
      "url": "http://localhost:3000"
    }
  ],
  "tags": [
    {
      "name": "Tasks",
      "description": "Operaciones relacionadas con tareas"
    }
  ],
  "paths": {
    "/tasks": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Listar todas las tareas",
        "responses": {
          "200": {
            "description": "Lista de tareas",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Task" }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Tasks"],
        "summary": "Crear una nueva tarea",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateTaskDto" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tarea creada",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Task" }
              }
            }
          },
          "400": { "description": "Datos inválidos" }
        }
      }
    },
    "/tasks/{id}": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Obtener una tarea por ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "Tarea encontrada",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Task" }
              }
            }
          },
          "404": { "description": "Tarea no encontrada" }
        }
      },
      "put": {
        "tags": ["Tasks"],
        "summary": "Actualizar una tarea existente",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UpdateTaskDto" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tarea actualizada",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Task" }
              }
            }
          },
          "404": { "description": "Tarea no encontrada" },
          "400": { "description": "Datos inválidos" }
        }
      },
      "delete": {
        "tags": ["Tasks"],
        "summary": "Eliminar una tarea",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "204": { "description": "Tarea eliminada" },
          "404": { "description": "Tarea no encontrada" }
        }
      }
    },
    "/tasks/summary": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Resumen de tareas por estado",
        "responses": {
          "200": {
            "description": "Conteo de tareas por estado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "todo": { "type": "integer", "example": 3 },
                    "doing": { "type": "integer", "example": 1 },
                    "done": { "type": "integer", "example": 2 }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Task": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "a1b2c3d4" },
          "title": { "type": "string", "example": "Learn Node.js" },
          "description": { "type": "string", "example": "Read documentation", "nullable": true },
          "status": {
            "type": "string",
            "enum": ["todo", "doing", "done"],
            "example": "todo"
          },
          "createdAt": { "type": "string", "format": "date-time", "example": "2025-11-16T23:59:59Z" }
        }
      },
      "CreateTaskDto": {
        "type": "object",
        "required": ["title"],
        "properties": {
          "title": { "type": "string", "example": "Study Node.js" },
          "description": { "type": "string", "example": "Complete basics first", "nullable": true }
        }
      },
      "UpdateTaskDto": {
        "type": "object",
        "properties": {
          "title": { "type": "string", "example": "Updated Task Title" },
          "description": { "type": "string", "example": "Updated Task Description", "nullable": true },
          "status": { "type": "string", "enum": ["todo", "doing", "done"], "example": "doing" }
        }
      }
    }
  }
}
