import { useState, useEffect } from "react"

function App() {
  const [horariosDisponibles, setHorariosDisponibles] = useState({})
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState(null)
  const [formData, setFormData] = useState({ nombre: "", telefono: "" })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Obtener horarios del backend
  useEffect(() => {
    fetch("/api/horarios")
      .then((res) => res.json())
      .then((data) => setHorariosDisponibles(data))
      .catch(() => {
        // fallback: horarios 8-14
        const hoy = new Date()
        const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
        const diasMes = new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).getDate()
        const defaultData = {}
        for (let d = 1; d <= diasMes; d++) {
          const horas = []
          for (let h = 8; h <= 14; h++) {
            const horaStr = h.toString().padStart(2, "0") + ":00"
            horas.push({ hora: horaStr, permitido: true })
          }
          defaultData[d] = horas
        }
        setHorariosDisponibles(defaultData)
      })
  }, [])

  const hoy = new Date()
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
  const diasEnMes = new Date(proximoMes.getFullYear(), proximoMes.getMonth() + 1, 0).getDate()
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1)

  const handleReservar = () => {
    const payload = { dia: diaSeleccionado, hora: horaSeleccionada, ...formData }
    fetch("/api/reservar", {
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reservar Turno</h1>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {dias.map((d) => (
          <button
            key={d}
            className={`p-3 rounded-full border transition-colors font-medium
              ${diaSeleccionado === d ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-100"}
            `}
            onClick={() => {
              setDiaSeleccionado(d)
              setHoraSeleccionada(null)
              setMostrarFormulario(false)
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Horarios */}
      {diaSeleccionado && (
        <div className="mb-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-3">
            Horarios para el {diaSeleccionado}/{proximoMes.getMonth() + 1}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(horariosDisponibles[diaSeleccionado] || []).map((h) => (
              <button
                key={h.hora}
                disabled={!h.permitido}
                className={`px-4 py-2 rounded-md font-medium border transition-colors
                  ${!h.permitido ? "bg-gray-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"}
                  ${horaSeleccionada === h.hora ? "bg-blue-500 text-white" : ""}
                `}
                onClick={() => {
                  if (h.permitido) {
                    setHoraSeleccionada(h.hora)
                    setMostrarFormulario(true)
                  }
                }}
              >
                {h.hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && horaSeleccionada && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Datos de la reserva</h3>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          <button
            onClick={handleReservar}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  )
}

export default App
