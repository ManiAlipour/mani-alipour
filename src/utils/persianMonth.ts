export default function toPersianMonth(month: number): string {
  const months = [
    "ژانویه",
    "فوریه",
    "مارس",
    "آوریل",
    "مه",
    "ژوئن",
    "جولای",
    "اوت",
    "سپتامبر",
    "اکتبر",
    "نوامبر",
    "دسامبر",
  ];
  return months[month - 1] || String(month);
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fa-IR");
}

export function normalizeMonthlyStats(stats: MonthlyStat[], months = 6) {
  const now = new Date();
  const result = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const found = stats.find(
      (s) =>
        s._id.year === date.getFullYear() &&
        s._id.month === date.getMonth() + 1,
    );

    result.push({
      label: `${toPersianMonth(date.getMonth() + 1)} ${date.getFullYear()}`,
      count: found?.count || 0,
    });
  }

  return result;
}
