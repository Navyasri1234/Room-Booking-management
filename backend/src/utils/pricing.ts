/**
 * Dynamic Pricing Calculator
 * Calculates booking price based on peak/off-peak hours
 */

/**
 * Check if a given time falls within peak hours
 * Peak hours: 10:00-13:00 and 16:00-19:00 on Monday-Friday
 */
export function isPeakHour(date: Date): boolean {
  const hour = date.getHours();
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Weekend is always off-peak
  if (day === 0 || day === 6) {
    return false;
  }

  // Peak hours: 10:00-13:00 (10, 11, 12) and 16:00-19:00 (16, 17, 18)
  return (hour >= 10 && hour < 13) || (hour >= 16 && hour < 19);
}

/**
 * Calculate price for a booking
 * Breaks booking into hourly slots and applies peak/off-peak rates
 */
export function calculateBookingPrice(
  startTime: Date,
  endTime: Date,
  baseHourlyRate: number
): number {
  let totalPrice = 0;
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Break into hourly slots
  let current = new Date(start);

  while (current < end) {
    // Calculate end of current hour slot
    const slotEnd = new Date(current);
    slotEnd.setHours(slotEnd.getHours() + 1, 0, 0, 0);

    // If slot extends beyond booking end, cap it
    if (slotEnd > end) {
      slotEnd.setTime(end.getTime());
    }

    // Calculate duration in hours (can be fractional)
    const durationHours = (slotEnd.getTime() - current.getTime()) / (1000 * 60 * 60);

    // Determine rate for this slot
    const rate = isPeakHour(current) ? baseHourlyRate * 1.5 : baseHourlyRate;

    // Add to total
    totalPrice += rate * durationHours;

    // Move to next hour
    current = new Date(slotEnd);
  }

  // Round to 2 decimal places
  return Math.round(totalPrice * 100) / 100;
}

