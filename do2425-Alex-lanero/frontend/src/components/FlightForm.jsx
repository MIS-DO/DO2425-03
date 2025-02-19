import { useState } from "react";

export default function FlightForm({ onSubmit, flight = {} }) {
  const [formData, setFormData] = useState({
    Origin: flight?.Origin || "",  // Debe coincidir con la API (Mayúscula)
    FlightNumber: flight?.FlightNumber || "", // Debe ser un número
    OnTime: flight?.OnTime ?? true, // Debe coincidir con la API
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Maneja booleanos correctamente
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Formatear correctamente antes de enviar
    const formattedFlight = {
      Origin: formData.Origin,
      FlightNumber: Number(formData.FlightNumber), // Convertir a número
      OnTime: Boolean(formData.OnTime), // Convertir a booleano explícitamente
    };

    onSubmit(formattedFlight);
    setFormData({ Origin: "", FlightNumber: "", OnTime: true });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4 border rounded">
      <input
        type="text"
        name="Origin"
        placeholder="Origin"
        value={formData.Origin}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="FlightNumber"
        placeholder="Flight Number"
        value={formData.FlightNumber}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="OnTime"
          checked={formData.OnTime}
          onChange={handleChange}
        />
        <span>On Time</span>
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save Flight</button>
    </form>
  );
}
