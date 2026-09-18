import express from 'express';

const app = express();

// Middleware obligatorio para parsear el body en formato JSON
app.use(express.json());

// Arreglo en memoria para almacenar las tareas
let tareas = [];

// Obtener todas las tareas o filtrar por estado usando query params (?completada=true/false)
app.get('/tareas', (req, res) => {
    const { completada } = req.query;

    if (completada !== undefined) {
        const esCompletada = completada === 'true';
        const tareasFiltradas = tareas.filter(t => t.completada === esCompletada);
        return res.json(tareasFiltradas);
    }

    res.json(tareas);
});

// Crear una nueva tarea con validación nativa y unicidad
app.post('/tareas', (req, res) => {
    const { nombre, completada } = req.body;

    // Validación nativa de que el nombre exista y sea texto válido
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === "") {
        return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser un texto válido." });
    }

    const nombreLimpio = nombre.trim();

    // Validar que no exista otra tarea con el mismo nombre (ignorando mayúsculas/minúsculas)
    const existe = tareas.some(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (existe) {
        return res.status(400).json({ error: "Ya existe una tarea registrada con ese nombre." });
    }

    // Por defecto, si no se envía 'completada', se asume que es false (pendiente)
    const estadoCompletada = completada !== undefined ? Boolean(completada) : false;

    const nuevaTarea = {
        nombre: nombreLimpio,
        completada: estadoCompletada
    };

    tareas.push(nuevaTarea);
    res.status(201).json({ mensaje: "Tarea creada exitosamente", tarea: nuevaTarea });
});

// Actualizar una tarea existente
app.put('/tareas/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.trim().toLowerCase();
    const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreParam);

    if (!tarea) {
        return res.status(404).json({ error: "Tarea no encontrada." });
    }

    const { nuevoNombre, completada } = req.body;

    if (nuevoNombre !== undefined) {
        if (typeof nuevoNombre !== 'string' || nuevoNombre.trim() === "") {
            return res.status(400).json({ error: "El nuevo nombre debe ser un texto válido." });
        }
        const nombreLimpio = nuevoNombre.trim();
        const existe = tareas.some(t => t.nombre.toLowerCase() === nombreLimpio.toLowerCase() && t.nombre.toLowerCase() !== nombreParam);
        if (existe) {
            return res.status(400).json({ error: "Ya existe otra tarea con ese nombre." });
        }
        tarea.nombre = nombreLimpio;
    }

    if (completada !== undefined) {
        if (typeof completada !== 'boolean') {
            return res.status(400).json({ error: "El campo 'completada' debe ser un valor booleano (true o false)." });
        }
        tarea.completada = completada;
    }

    res.json({ mensaje: "Tarea actualizada exitosamente", tarea });
});

// 4. DELETE: Eliminar una tarea por nombre
app.delete('/tareas/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.trim().toLowerCase();
    const index = tareas.findIndex(t => t.nombre.toLowerCase() === nombreParam);

    if (index === -1) {
        return res.status(404).json({ error: "Tarea no encontrada para eliminar." });
    }

    tareas.splice(index, 1);
    res.json({ mensaje: "Tarea eliminada correctamente" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 3 corriendo en http://localhost:${PORT}`);
});