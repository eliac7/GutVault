import jsPDF from "jspdf";
import autoTable, { type UserOptions } from "jspdf-autotable";
import { format } from "date-fns";
import type { LogEntry } from "@/shared/db/types";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export async function generatePDF(
  logs: LogEntry[],
  dateRange?: { start?: Date; end?: Date }
) {
  const doc = new jsPDF();

  // Load font that supports Greek coverage
  const fontUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
  try {
    const response = await fetch(fontUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    await new Promise((resolve) => {
      reader.onloadend = resolve;
      reader.readAsDataURL(blob);
    });

    const base64data = (reader.result as string).split(",")[1];

    doc.addFileToVFS("Roboto-Regular.ttf", base64data);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
  } catch (e) {
    console.error("Failed to load custom font, falling back to default.", e);
  }

  // Title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("GutVault Export", 14, 22);

  // Subtitle (Date Range)
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const rangeText =
    dateRange?.start && dateRange?.end
      ? `${format(dateRange.start, "MMM d, yyyy")} - ${format(
          dateRange.end,
          "MMM d, yyyy"
        )}`
      : `All Time (Generated on ${format(new Date(), "MMM d, yyyy")})`;
  doc.text(rangeText, 14, 30);

  // Table Data Preparation
  const tableData = logs.map((log) => {
    const date = format(new Date(log.timestamp), "yyyy-MM-dd HH:mm");

    let details = "";
    if (log.type === "bowel_movement") {
      details = `Bristol: ${log.bristolType ?? "-"}`;
    } else if (log.type === "meal") {
      details = `Triggers: ${log.triggerFoods?.join(", ") ?? "None"}`;
    } else if (log.type === "symptom") {
      details = `Symptoms: ${log.symptoms?.join(", ") ?? "None"}`;
    }

    return [
      date,
      log.type.replace("_", " ").toUpperCase(),
      details,
      `Pain: ${log.painLevel}`,
      log.notes || "-",
    ];
  });

  // Table Config
  const tableOptions: UserOptions = {
    startY: 40,
    head: [["Date", "Type", "Details", "Pain", "Notes"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] }, // Emerald-500 equivalent
    styles: {
      fontSize: 9,
      font: "Roboto",
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Date
      1: { cellWidth: 25 }, // Type
      2: { cellWidth: 50 }, // Details
      3: { cellWidth: 20 }, // Pain
      4: { cellWidth: "auto" }, // Notes
    },
  };

  autoTable(doc, tableOptions);

  const fileName = `gutvault-export-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
