// helpers/summaryHelper.js

// Padding per zeri a sinistra (es. 7 -> "07")
function pad2(n) {
  return String(n).padStart(2, '0');
}

export function customSummary(data) {
  const now = new Date();

  // Estraggo i vari componenti
  const dd = pad2(now.getDate());
  const mm = pad2(now.getMonth() + 1);
  const yy = String(now.getFullYear()).slice(-2);
  const HH = pad2(now.getHours());
  const SS = pad2(now.getSeconds());

  // Nome file finale
  const fileBase = `Output/Summary/summary_${dd}${mm}${yy}_${HH}_${SS}`;

  // File JSON formattato bene
  const jsonContent = JSON.stringify(data, null, 2);

  return {
    [`${fileBase}.json`]: jsonContent
  };
}