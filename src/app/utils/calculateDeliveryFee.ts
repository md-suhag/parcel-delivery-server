export const calculateDeliveryFee = (type: string, weight: number): number => {
  const baseFees: Record<string, number> = {
    DOCUMENT: 50,
    REGULAR: 70,
  };

  const perKgFees: Record<string, number> = {
    DOCUMENT: 10,
    REGULAR: 15,
  };

  const base = baseFees[type.toUpperCase()] ?? 70;
  const perKg = perKgFees[type.toUpperCase()] ?? 15;

  return base + weight * perKg;
};
