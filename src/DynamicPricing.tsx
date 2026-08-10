export function calculatePrice(
  basePrice: number,
  weekend: boolean,
  holiday: boolean,
  vip: boolean
) {
  let total = basePrice;

  if (weekend) {
    total *= 1.15;
  }

  if (holiday) {
    total *= 1.25;
  }

  if (vip) {
    total *= 0.9;
  }

  return Math.round(total);
}
