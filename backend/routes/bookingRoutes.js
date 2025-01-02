const express = require("express");

module.exports = (bookings) => {
  const router = express.Router();

  // Create a new booking
  router.post("/", (req, res) => {
    const { date, time, guests, name, contact } = req.body;

    if (!date || !time || !guests || !name || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent double bookings
    const isSlotBooked = bookings.some(
      (booking) => booking.date === date && booking.time === time
    );

    if (isSlotBooked) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    const newBooking = { id: Date.now(), date, time, guests, name, contact };
    bookings.push(newBooking);

    res.status(201).json(newBooking);
  });

  // Get all bookings
  router.get("/", (req, res) => {
    res.json(bookings);
  });

  // Delete a booking
  router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    bookings.splice(index, 1);
    res.status(204).send();
  });

  // Get available time slots for a specific date
  router.get("/availability", (req, res) => {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const allSlots = [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ]; // Example time slots

    // Find booked slots for the given date
    const bookedSlots = bookings
      .filter((booking) => booking.date === date)
      .map((booking) => booking.time);

    // Calculate available slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots });
  });

  return router;
};
