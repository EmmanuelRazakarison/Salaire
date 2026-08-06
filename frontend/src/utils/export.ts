import { jsPDF } from "jspdf";
import type { SalaryResult } from "../types";

export function exportToPDF(result: SalaryResult, isNetToGross: boolean): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SALAIRE MADA - SIMULATION DE BULLETIN DE PAIE", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Réglementation Madagascar 2026 | Mode: ${isNetToGross ? "Net vers Brut" : "Brut vers Net"}`, margin, 24);

  let y = 38;

  // Helper pour dessiner des lignes de tableau
  const addRow = (label: string, valStr: string, isBold = false, isHeader = false) => {
    if (isHeader) {
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y - 4, contentWidth, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);
    } else if (isBold) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
    }

    doc.text(label, margin + 2, y);
    doc.text(valStr, pageWidth - margin - 2, y, { align: "right" });
    y += 7;
  };

  // Section 1: Gains
  addRow("REVENUS & ELEMENTS DU BRUT", "MONTANT (MGA)", false, true);
  addRow("Salaire de base (brut)", `${result.grossSalary.toLocaleString("fr-FR")} MGA`);
  if (result.bonuses > 0) addRow("Primes & Gratifications", `${result.bonuses.toLocaleString("fr-FR")} MGA`);
  if (result.allowances > 0) addRow("Indemnités non exonérées", `${result.allowances.toLocaleString("fr-FR")} MGA`);
  if (result.otherGains > 0) addRow("Autres avantages & gains", `${result.otherGains.toLocaleString("fr-FR")} MGA`);
  addRow("TOTAL REVENUS BRUTS (BRUT GLOBAL)", `${result.totalGains.toLocaleString("fr-FR")} MGA`, true);
  y += 2;

  // Section 2: Cotisations salariales
  addRow("COTISATIONS SOCIALES SALARIALES (RETENUES)", "RETENUE (MGA)", false, true);
  addRow("CNAPS Salarié (1% - Plafond 2 400 000 MGA)", `${result.cnapsEmployee.toLocaleString("fr-FR")} MGA`);
  addRow("OSTIE / Service Médical Salarié (1% - Plafond 2 400 000 MGA)", `${result.ostieEmployee.toLocaleString("fr-FR")} MGA`);
  addRow("TOTAL COTISATIONS SOCIALES SALARIALES", `${result.totalSocialContributions.toLocaleString("fr-FR")} MGA`, true);
  y += 2;

  // Section 3: IRSA
  addRow("IMPOT SUR LE REVENU (IRSA)", "IMPOT (MGA)", false, true);
  addRow("Salaire Net Imposable", `${result.taxableIncome.toLocaleString("fr-FR")} MGA`);
  result.irsaDetails.forEach((d) => {
    addRow(`  Tranche ${d.rate} (${d.bracket})`, `${d.tax.toLocaleString("fr-FR")} MGA`);
  });
  addRow("TOTAL IRSA A RETENIR", `${result.irsaTax.toLocaleString("fr-FR")} MGA`, true);
  y += 2;

  // Section 4: Charges Patronales
  addRow("COTISATIONS PATRONALES (EMPLOYEUR)", "CHARGE (MGA)", false, true);
  addRow("CNAPS Employeur (13% - Plafond 2 400 000 MGA)", `${result.cnapsEmployer.toLocaleString("fr-FR")} MGA`);
  addRow("OSTIE / Service Médical Employeur (5% - Plafond 2 400 000 MGA)", `${result.ostieEmployer.toLocaleString("fr-FR")} MGA`);
  addRow("TOTAL CHARGES PATRONALES", `${result.totalEmployerContributions.toLocaleString("fr-FR")} MGA`, true);
  y += 4;

  // Encadré Net à Payer & Coût Employeur
  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text("NET A PAYER AU SALARIE :", margin + 6, y + 11);
  doc.text(`${result.netPay.toLocaleString("fr-FR")} MGA`, pageWidth - margin - 6, y + 11, { align: "right" });

  y += 22;

  doc.setDrawColor(59, 130, 246);
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, y, contentWidth, 14, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text("COUT GLOBAL EMPLOYEUR :", margin + 6, y + 9);
  doc.text(`${result.totalEmployerCost.toLocaleString("fr-FR")} MGA`, pageWidth - margin - 6, y + 9, { align: "right" });

  // Footer
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Document généré automatiquement par Salaire Mada - Calculateur conforme au Code du Travail Malagasy", pageWidth / 2, 285, {
    align: "center",
  });

  doc.save(`bulletin-paie-${Date.now()}.pdf`);
}

export function copyToClipboard(result: SalaryResult): Promise<void> {
  const text = `
📊 SIMULATION SALAIRE MADAGASCAR (2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Salaire Brut : ${result.grossSalary.toLocaleString("fr-FR")} MGA
📉 CNAPS Salarié (1%) : -${result.cnapsEmployee.toLocaleString("fr-FR")} MGA
📉 OSTIE Salarié (1%) : -${result.ostieEmployee.toLocaleString("fr-FR")} MGA
📉 IRSA Net : -${result.irsaTax.toLocaleString("fr-FR")} MGA
📊 Total Retenues : -${result.totalDeductions.toLocaleString("fr-FR")} MGA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ NET À PAYER : ${result.netPay.toLocaleString("fr-FR")} MGA (${(result.netPay * 5).toLocaleString("fr-FR")} FMG)
🏢 COÛT TOTAL EMPLOYEUR : ${result.totalEmployerCost.toLocaleString("fr-FR")} MGA
  `.trim();

  return navigator.clipboard.writeText(text);
}
