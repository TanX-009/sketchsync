export default function generateTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[-:.]/g, ""); // Format: YYYYMMDDTHHMMSS
}
