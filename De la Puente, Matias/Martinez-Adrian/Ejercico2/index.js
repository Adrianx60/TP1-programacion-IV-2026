import express from 'express';

const app = express();
app.use(express.json());

// Arreglo interno para almacenar los alumnos
let alumnos = [];

// 1. GET: Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
    res.json(alumnos);
});

// 2. GET: Obtener un alumno por nombre con datos derivados (promedio y condición)
app.get('/alumnos/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.trim().toLowerCase();
    const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreParam);

    if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }

    // Cálculo del promedio (dato derivado)
    const sumaNotas = alumno.notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = Number((sumaNotas / alumno.notas.length).toFixed(2));

    // Determinación de la condición académica
    let condicion = "";
    if (promedio < 6) {
        condicion = "reprobado";
    } else if (promedio >= 6 && promedio < 8) {
        condicion = "aprobado";
    } else {
        condicion = "promocionado";
    }

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio,
        condicion
    });
});

//Crear un nuevo alumno
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // Validación nativa de tipos y estructura
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === "") {
        return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser un texto válido." });
    }

    if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number' && !isNaN(n) && n >= 1 && n <= 10)) {
        return res.status(400).json({ error: "El campo 'notas' debe ser un arreglo de exactamente 3 números entre 1 y 10." });
    }

    const nombreLimpio = nombre.trim();
    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombreLimpio.toLowerCase());

    if (existe) {
        return res.status(400).json({ error: "Ya existe un alumno registrado con ese nombre." });
    }

    const nuevoAlumno = {
        nombre: nombreLimpio,
        notas
    };

    alumnos.push(nuevoAlumno);
    res.status(201).json({ mensaje: "Alumno creado exitosamente", alumno: nuevoAlumno });
});

//Eliminar un alumno
app.delete('/alumnos/:nombre', (req, res) => {
    const nombreParam = req.params.nombre.trim().toLowerCase();
    const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreParam);

    if (index === -1) {
        return res.status(404).json({ error: "Alumno no encontrado para eliminar." });
    }

    alumnos.splice(index, 1);
    res.json({ mensaje: "Alumno eliminado correctamente" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 2 corriendo en http://localhost:${PORT}`);
});