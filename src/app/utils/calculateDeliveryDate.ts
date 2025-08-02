export const calculateDeliveryDate = (type: string) => {
  const now = new Date();

  const deliveryDays: Record<string, number> = {
    DOCUMENT: 1,
    REGULAR: 2,
  };

  const hour = now.getHours();

  // If created after 5 PM, shift to next day
  if (hour >= 17) {
    now.setDate(now.getDate() + 1);
  }

  const daysToAdd = deliveryDays[type.toUpperCase()] ?? 2;
  now.setDate(now.getDate() + daysToAdd);

  return now;
};
