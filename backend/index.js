import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/horarios', (req, res) => {
  // Devuelve horarios permitidos de ejemplo
  res.json({
    1: [{ hora: '09:00', permitido: true }, { hora: '10:00', permitido: false }],
    2: [{ hora: '09:00', permitido: true }, { hora: '10:00', permitido: true }]
  });
});

app.post('/reservar', (req, res) => {
  console.log('Reserva recibida:', req.body);
  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Mock backend running on port ${PORT}`));
