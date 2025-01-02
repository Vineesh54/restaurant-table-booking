import { useState, useEffect } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    contact: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available slots based on the selected date
  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/availability?date=${date}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }
      const data = await response.json();
      setAvailableSlots(data.availableSlots);
    } catch (err) {
      console.error("Error fetching available slots:", err);
    }
  };

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      const data = await response.json();
      setConfirmation(data); // Save booking details for confirmation
      setFormData({ date: "", time: "", guests: "", name: "", contact: "" }); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {!confirmation ? (
        <>
          <form onSubmit={handleSubmit}>
            <h2>Book a Table</h2>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
            <select
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              disabled={!formData.date || availableSlots.length === 0}
            >
              <option value="">Select a time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Guests"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              required
            />
            <button type="submit" disabled={!formData.date || !formData.time}>
              Book Now
            </button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <div>
          <h2>Booking Confirmation</h2>
          <p>Your booking was successful! Here are the details:</p>
          <ul>
            <li>
              <strong>Date:</strong> {confirmation.date}
            </li>
            <li>
              <strong>Time:</strong> {confirmation.time}
            </li>
            <li>
              <strong>Guests:</strong> {confirmation.guests}
            </li>
            <li>
              <strong>Name:</strong> {confirmation.name}
            </li>
            <li>
              <strong>Contact:</strong> {confirmation.contact}
            </li>
          </ul>
          <button onClick={() => window.location.reload()}>
            Make Another Booking
          </button>
        </div>
      )}
    </div>
  );
}
