import express from 'express';
const app = express();

// Middleware nativo de Express para leer JSON
app.use(express.json());

app.post('/rectangulos', (req, res) => {
    const { base, altura } = req.body;

    // Validación nativa (sin librerías externas)
    if (
        typeof base !== 'number' || isNaN(base) || base <= 0 ||
        typeof altura !== 'number' || isNaN(altura) || altura <= 0
    ) {
        return res.status(400).json({ 
            error: "Los valores de 'base' y 'altura' deben ser estrictamente números mayores a 0." 
        });
    }

    const superficie = base * altura;
    const perimetro = 2 * (base + altura);
    const esCuadrado = base === altura;

    res.json({
        figura: esCuadrado ? "Cuadrado" : "Rectángulo",
        base,
        altura,
        superficie,
        perimetro,
        esCuadrado
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});