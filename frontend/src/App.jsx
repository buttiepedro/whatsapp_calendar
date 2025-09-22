import { useState, useEffect } from "react"

function App() {
  const [horariosDisponibles, setHorariosDisponibles] = useState({})
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState(null)
  const [formData, setFormData] = useState({ nombre: "", telefono: "" })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Obtener horarios del backend
  useEffect(() => {
    fetch("https://tuapi.com/horarios")
      .then((res) => res.json())
      .then((data) => setHorariosDisponibles(data))
      .catch(() => setHorariosDisponibles({}))
  }, [])

  // Generar calendario del próximo mes
  const hoy = new Date()
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
  const diasEnMes = new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).getDate()
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1)

  const handleReservar = () => {
    const payload = {
      dia: diaSeleccionado,
      hora: horaSeleccionada,
      ...formData,
    }

    fetch("https://tuapi.com/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      alert("Reserva guardada con éxito ✅")
      setMostrarFormulario(false)
      setFormData({ nombre: "", telefono: "" })
      setDiaSeleccionado(null)
      setHoraSeleccionada(null)
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Reservar Turno</h1>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia) => (
          <button
            key={dia}
            className={`p-2 rounded border ${
              diaSeleccionado === dia ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => {
              setDiaSeleccionado(dia)
              setHoraSeleccionada(null)
              setMostrarFormulario(false)
            }}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Horarios */}
      {diaSeleccionado && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Horarios para el {diaSeleccionado}/{proximoMes.getMonth() + 1}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(horariosDisponibles[diaSeleccionado] || []).map((hora) => (
              <button
                key={hora.hora}
                disabled={!hora.permitido}
                className={`px-3 py-2 rounded border ${
                  horaSeleccionada === hora.hora
                    ? "bg-blue-600 text-white"
                    : hora.permitido
                    ? "bg-gray-100"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={() => {
                  setHoraSeleccionada(hora.hora)
                  setMostrarFormulario(true)
                }}
              >
                {hora.hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && horaSeleccionada && (
        <div className="mt-6 border rounded p-4 shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-3">Datos de la reserva</h3>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 border rounded mb-2"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            className="w-full p-2 border rounded mb-3"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          <button
            onClick={handleReservar}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  )
}

export default App
