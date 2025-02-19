import { useEffect, useState } from "react";
import FlightForm from "../components/FlightForm";
import FlightCard from "../components/FlightCard";

const API_URL = import.meta.env.VITE_API_URL || "http://dev.do2425-flights.es/api/v1";

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);

  // Obtener vuelos (GET)
  useEffect(() => {
    fetch(`${API_URL}/flights`)
      .then((res) => res.json())
      .then((data) => setFlights(data))
      .catch((err) => console.error("Error fetching flights:", err));
  }, []);

  // Crear vuelo (POST)
  const handleCreate = (flight) => {
    fetch(`${API_URL}/flights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flight),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status} - ${errorText}`);
        }
        return res.json();
      })
      .then((newFlight) => setFlights([...flights, newFlight]))
      .catch((err) => console.error("Error creating flight:", err.message));
  };

  // Actualizar vuelo (PUT)
  const handleUpdate = (flight) => {
    fetch(`${API_URL}/flights/${flight.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flight),
    })
      .then((res) => res.json())
      .then((updatedFlight) => {
        setFlights(flights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f)));
        setEditingFlight(null);
      })
      .catch((err) => console.error("Error updating flight:", err));
  };

  // Eliminar vuelo (DELETE)
  const handleDelete = (id) => {
    fetch(`${API_URL}/flights/${id}`, { method: "DELETE" })
      .then(() => setFlights(flights.filter((flight) => flight.id !== id)))
      .catch((err) => console.error("Error deleting flight:", err));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Flights Management</h1>
      
      <FlightForm onSubmit={editingFlight ? handleUpdate : handleCreate} flight={editingFlight || {}} />

      <div className="grid gap-4 mt-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onUpdate={() => setEditingFlight(flight)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
