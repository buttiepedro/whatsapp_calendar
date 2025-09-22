import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Función que genera horarios de 08:00 a 14:00
const generarHorarios = () => {
  const horas = [];
  for (let h = 8; h <= 14; h++) {
    const horaStr = h.toString().padStart(2, "0") + ":00";
    horas.push({ hora: horaStr, permitido: true }); // por defecto todos permitidos
  }
  return horas;
};

// Devuelve todos los días del mes con horarios
app.get('/horarios', (req, res) => {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  const diasMes = new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).getDate();

  const data = {};
  for (let d = 1; d <= diasMes; d++) {
    data[d] = generarHorarios();
  }

  // Opcional: simular algunos horarios ocupados
  // data[5][2].permitido = false; // por ejemplo el 5to día a las 10:00 no disponible

  res.json(data);
});

app.post('/reservar', (req, res) => {
  console.log('Reserva recibida:', req.body);
  // Aquí podrías marcar el horario como no disponible en una DB real
  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Mock backend running on port ${PORT}`));
