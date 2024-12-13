export function normalizeEventDate(date?: Date | string): Date | null {
  if (!date) {
    return null;
  }
  const dateObj = new Date(date);
  dateObj.setUTCHours(dateObj.getUTCHours(), dateObj.getUTCMinutes(), 0, 0);
  return dateObj;
}
