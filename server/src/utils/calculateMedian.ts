export default function calculateMedian(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);

  if (sorted.length % 2 === 0) {
    return (
      Math.round(
        ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) * 100
      ) / 100
    );
  }

  return sorted[Math.floor(sorted.length / 2)];
}
