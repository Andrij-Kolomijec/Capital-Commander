export default function dateFormatter(input: { date: Date }) {
  const formattedDate = new Date(input.date).toLocaleDateString("en-GB", {
    // year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: false,
  });
  return formattedDate;
}
