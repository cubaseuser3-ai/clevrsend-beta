const metals = [
  "Gold",
  "Silber",
  "Platin",
  "Titan",
  "Chrom",
  "Stahl",
  "Bronze",
  "Messing",
  "Zinn",
  "Eisen",
];

export function generateRandomAlias(): string {
  const metal = metals[Math.floor(Math.random() * metals.length)];
  return metal;
}
