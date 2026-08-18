import { jsPDF } from "jspdf";
import type { SalaryResult } from "../types";

function buildPDFDocument(result: SalaryResult, isNetToGross: boolean): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Registre Institutionnel
  doc.setFillColor(18, 24, 31); // #12181F Encre profonde
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.setTextColor(247, 245, 240);
  doc.text("SALAIRE MADA — BULLETIN OFFICIEL DE SIMULATION", margin, 14);

  doc.setFontSize(8.5);
  doc.setFont("courier", "normal");
  doc.setTextColor(180, 185, 190);
  doc.text(`Réglementation Sociale & Fiscale 2026 (Madagascar) | Mode: ${isNetToGross ? "Net vers Brut" : "Brut vers Net"} | Devise: MGA`, margin, 21);

  let y = 38;

  // Helper pour dessiner des lignes de registre
  const addRow = (label: string, valStr: string, isBold = false, isHeader = false, isDeduction = false) => {
    if (isHeader) {
      doc.setFillColor(244, 241, 234); // #F4F1EA ivoire doux
      doc.rect(margin, y - 4, contentWidth, 7, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(36, 34, 31); // #24221F
    } else if (isBold) {
      doc.setFont("courier", "bold");
      doc.setFontSize(9);
      doc.setTextColor(36, 34, 31);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(70, 68, 64);
    }

    doc.text(label, margin + 2, y);

    if (!isHeader) {
      doc.setFont("courier", isBold ? "bold" : "normal");
      if (isDeduction) {
        doc.setTextColor(163, 72, 60); // #A3483C
      }
    }
    doc.text(valStr, pageWidth - margin - 2, y, { align: "right" });

    // Filet fin sous la ligne
    doc.setDrawColor(226, 221, 213); // #E2DDD5
    doc.setLineWidth(0.2);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);

    y += 6.5;
  };

  // Section 1: Gains
  addRow("01. REVENUS & ÉLÉMENTS DU SALAIRE BRUT", "MONTANT (MGA)", false, true);
  addRow("01.01 Salaire de base (brut contractuel)", `${result.grossSalary.toLocaleString("fr-FR")} MGA`);
  if (result.bonuses > 0) addRow("01.02 Primes & gratifications", `${result.bonuses.toLocaleString("fr-FR")} MGA`);
  if (result.allowances > 0) addRow("01.03 Indemnités non exonérées", `${result.allowances.toLocaleString("fr-FR")} MGA`);
  if (result.otherGains > 0) addRow("01.04 Autres gains & avantages", `${result.otherGains.toLocaleString("fr-FR")} MGA`);
  addRow("01.00 TOTAL REVENUS BRUTS (BRUT GLOBAL)", `${result.totalGains.toLocaleString("fr-FR")} MGA`, true);
  y += 2;

  // Section 2: Cotisations salariales
  addRow("02. COTISATIONS SOCIALES SALARIALES (RETENUES 2%)", "RETENUE (MGA)", false, true);
  addRow("02.01 CNAPS Salarié (1% - Plafond 2 400 000 MGA)", `- ${result.cnapsEmployee.toLocaleString("fr-FR")} MGA`, false, false, true);
  addRow("02.02 OSTIE / Médical Salarié (1% - Plafond 2 400 000 MGA)", `- ${result.ostieEmployee.toLocaleString("fr-FR")} MGA`, false, false, true);
  addRow("02.00 TOTAL COTISATIONS SOCIALES SALARIALES", `- ${result.totalSocialContributions.toLocaleString("fr-FR")} MGA`, true, false, true);
  y += 2;

  // Section 3: IRSA
  addRow("03. IMPÔT SUR LE REVENU DES SALARIÉS (IRSA 2026)", "IMPÔT (MGA)", false, true);
  addRow("03.00 Assiette imposable (Net Imposable)", `${result.taxableIncome.toLocaleString("fr-FR")} MGA`);
  result.irsaDetails.forEach((d, i) => {
    addRow(
      `  03.0${i + 1} Tranche ${d.rate} (${d.bracket})`,
      d.tax < 0 ? `- ${Math.abs(d.tax).toLocaleString("fr-FR")} MGA` : `${d.tax.toLocaleString("fr-FR")} MGA`,
      false,
      false,
      d.tax > 0
    );
  });
  addRow("03.99 TOTAL IMPÔT IRSA NET À RETENIR", `- ${result.irsaTax.toLocaleString("fr-FR")} MGA`, true, false, true);
  y += 2;

  // Section 4: Charges Patronales
  addRow("04. COTISATIONS PATRONALES (CHARGES ENTREPRISE 18%)", "CHARGE (MGA)", false, true);
  addRow("04.01 CNAPS Employeur (13% - Plafond 2 400 000 MGA)", `${result.cnapsEmployer.toLocaleString("fr-FR")} MGA`);
  addRow("04.02 OSTIE Employeur (5% - Plafond 2 400 000 MGA)", `${result.ostieEmployer.toLocaleString("fr-FR")} MGA`);
  addRow("04.00 TOTAL CHARGES PATRONALES", `${result.totalEmployerContributions.toLocaleString("fr-FR")} MGA`, true);
  y += 4;

  // Encadré Net à Payer avec style de validation
  doc.setDrawColor(63, 125, 92); // #3F7D5C
  doc.setFillColor(235, 244, 239); // #EBF4EF
  doc.rect(margin, y, contentWidth, 18, "FD");

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(47, 99, 71); // #2F6347
  doc.text("NET À PAYER AU SALARIÉ (EN POCHE) :", margin + 5, y + 11);

  doc.setFont("courier", "bold");
  doc.setFontSize(13);
  doc.text(`${result.netPay.toLocaleString("fr-FR")} MGA`, pageWidth - margin - 5, y + 11, { align: "right" });

  y += 22;

  // Encadré Coût Total Employeur
  doc.setDrawColor(59, 100, 122); // #3B647A
  doc.setFillColor(244, 248, 250);
  doc.rect(margin, y, contentWidth, 13, "FD");

  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(59, 100, 122);
  doc.text("COÛT GLOBAL TOTAL EMPLOYEUR :", margin + 5, y + 8.5);

  doc.setFont("courier", "bold");
  doc.setFontSize(10.5);
  doc.text(`${result.totalEmployerCost.toLocaleString("fr-FR")} MGA`, pageWidth - margin - 5, y + 8.5, { align: "right" });

  // Tampon de validation en bas de page
  doc.setDrawColor(63, 125, 92);
  doc.rect(pageWidth - margin - 55, y + 20, 55, 14);
  doc.setFontSize(7.5);
  doc.setFont("courier", "bold");
  doc.setTextColor(63, 125, 92);
  doc.text("CONFORME CODE TRAVAIL MG", pageWidth - margin - 27.5, y + 25.5, { align: "center" });
  doc.text("VALIDÉ 2026", pageWidth - margin - 27.5, y + 30.5, { align: "center" });

  // Footer
  doc.setTextColor(130, 125, 118);
  doc.setFontSize(7.5);
  doc.setFont("times", "italic");
  doc.text("Document généré par Salaire Mada · Registre de paie conforme à la législation du travail à Madagascar.", pageWidth / 2, 287, {
    align: "center",
  });

  return doc;
}

export function exportToPDF(result: SalaryResult, isNetToGross: boolean): void {
  const doc = buildPDFDocument(result, isNetToGross);
  doc.save(`bulletin-paie-mada-${Date.now().toString().slice(-6)}.pdf`);
}

export async function shareOrExportPDF(result: SalaryResult, isNetToGross: boolean): Promise<void> {
  const doc = buildPDFDocument(result, isNetToGross);
  const fileName = `bulletin-paie-mada-${Date.now().toString().slice(-6)}.pdf`;

  if (navigator.canShare) {
    try {
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

      if (navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: "Bulletin de Paie — Salaire Mada",
          text: `Décompte de salaire (Madagascar 2026) : Net à payer ${result.netPay.toLocaleString("fr-FR")} MGA`,
        });
        return;
      }
    } catch {
      // User cancelled or sharing failed, proceed to fallback download
    }
  }

  doc.save(fileName);
}

export function getSummaryText(result: SalaryResult): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║         SALAIRE MADA — BULLETIN DE DÉCOMPTE (2026)             ║
╚════════════════════════════════════════════════════════════════╝
01. SALAIRE BRUT CONTRACTUEL : ${result.grossSalary.toLocaleString("fr-FR")} MGA
    Total Revenus Bruts     : ${result.totalGains.toLocaleString("fr-FR")} MGA
------------------------------------------------------------------
02. DÉDUCTIONS SOCIALES SALARIALES (2%) :
    - CNAPS Salarié (1%)    : -${result.cnapsEmployee.toLocaleString("fr-FR")} MGA
    - OSTIE Salarié (1%)    : -${result.ostieEmployee.toLocaleString("fr-FR")} MGA
    Total Cotisations       : -${result.totalSocialContributions.toLocaleString("fr-FR")} MGA
------------------------------------------------------------------
03. IMPÔT SUR LE REVENU (IRSA 2026) :
    - Net Imposable         : ${result.taxableIncome.toLocaleString("fr-FR")} MGA
    - IRSA Net Déduit       : -${result.irsaTax.toLocaleString("fr-FR")} MGA
------------------------------------------------------------------
04. TOTAL RETENUES SALARIALES : -${result.totalDeductions.toLocaleString("fr-FR")} MGA
==================================================================
>>> NET À PAYER AU SALARIÉ  : ${result.netPay.toLocaleString("fr-FR")} MGA
    (Équivalent FMG          : ${(result.netPay * 5).toLocaleString("fr-FR")} FMG)
==================================================================
05. CHARGES PATRONALES (18%) :
    - CNAPS Employeur (13%) : +${result.cnapsEmployer.toLocaleString("fr-FR")} MGA
    - OSTIE Employeur (5%)  : +${result.ostieEmployer.toLocaleString("fr-FR")} MGA
>>> COÛT TOTAL ENTREPRISE    : ${result.totalEmployerCost.toLocaleString("fr-FR")} MGA
==================================================================
[✓] Simulation conforme au Code du Travail & Barème Fiscal Malagasy.
  `.trim();
}

export async function copyToClipboard(result: SalaryResult): Promise<void> {
  const text = getSummaryText(result);
  return navigator.clipboard.writeText(text);
}

export async function shareSummaryText(result: SalaryResult): Promise<boolean> {
  const text = getSummaryText(result);
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Simulation Salaire Mada 2026",
        text,
      });
      return true;
    } catch {
      // fallback to clipboard
    }
  }
  await navigator.clipboard.writeText(text);
  return true;
}
