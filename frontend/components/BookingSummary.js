import { useEffect, useState } from "react";

export default function BookingSummary() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`
      );
      const data = await response.json();
      setBookings(data);
    }
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.date} {booking.time} - {booking.name} ({booking.guests}{" "}
            guests)
          </li>
        ))}
      </ul>
    </div>
  );
}
