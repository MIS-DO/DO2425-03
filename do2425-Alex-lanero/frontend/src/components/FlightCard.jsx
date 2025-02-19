export default function FlightCard({ flight, onUpdate, onDelete }) {
  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <p><strong>Origin:</strong> {flight.Origin}</p>
        <p><strong>Flight Number:</strong> {flight.FlightNumber}</p>
        <p><strong>On Time:</strong> {flight.OnTime ? "Yes" : "No"}</p>
      </div>
      <div className="space-x-2">
        <button onClick={() => onUpdate(flight)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
        <button onClick={() => onDelete(flight.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
      </div>
    </div>
  );
}
