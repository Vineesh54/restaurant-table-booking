import BookingForm from "../components/BookingForm";
import BookingSummary from "../components/BookingSummary";

export default function Home() {
  return (
    <div>
      <h1>Restaurant Table Booking</h1>
      <BookingForm />
      <BookingSummary />
    </div>
  );
}
