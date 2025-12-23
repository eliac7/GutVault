import jsPDF from "jspdf";
import autoTable, { type UserOptions } from "jspdf-autotable";
import { format } from "date-fns";
import { el, enUS } from "date-fns/locale";
import type { LogEntry } from "@/shared/db/types";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export interface DoctorReportOptions {
  dateRange: "30" | "60" | "90" | "all";
  anonymize: boolean;
  includeCharts: boolean;
}

type PdfLocale = "en" | "el";

type PdfLabels = {
  exportTitle: string;
  doctorTitle: string;
  allTime: string;
  generatedOn: string;
  lastDays: (days: number) => string;
  tableHead: [string, string, string, string, string];
  levelsLabel: (pain: string, stress: string) => string;
  bowelDetails: (bristol: string | number | undefined) => string;
  mealNoDetails: string;
  mealFoodsLabel: string;
  mealTriggersLabel: string;
  symptomNoDetails: string;
  symptomLabel: string;
  anxietyLabel: string;
  notesHidden: string;
  bristolTrendTitle: string;
  typeLabel: (type: number) => string;
  topSymptomsTitle: string;
};

export async function generatePDF(
  logs: LogEntry[],
  dateRange?: { start?: Date; end?: Date },
  doctorOptions?: DoctorReportOptions,
  locale: PdfLocale = "en"
) {
  const dfLocale = locale === "el" ? el : enUS;

  const messages =
    locale === "el"
      ? (await import("../../../messages/el.json")).default
      : (await import("../../../messages/en.json")).default;
  const symptomMessages = (messages.logging?.symptoms ?? {}) as Record<
    string,
    string
  >;
  const anxietyMessages = (messages.logging?.anxietyMarkers ?? {}) as Record<
    string,
    string
  >;

  const pdfMessages = messages.logging?.pdf ?? {};

  const labels: PdfLabels = {
    exportTitle: pdfMessages.exportTitle,
    doctorTitle: pdfMessages.doctorTitle,
    allTime: pdfMessages.allTime,
    generatedOn: pdfMessages.generatedOn,
    lastDays: (days: number) =>
      (pdfMessages.lastDays as string)?.replace("{days}", String(days)) ??
      `Last ${days} Days`,
    tableHead: [
      pdfMessages.tableHead?.date ?? "Date",
      pdfMessages.tableHead?.type ?? "Type",
      pdfMessages.tableHead?.details ?? "Details",
      pdfMessages.tableHead?.levels ?? "Levels",
      pdfMessages.tableHead?.notes ?? "Notes",
    ],
    levelsLabel: (pain: string, stress: string) =>
      `${pdfMessages.levels?.pain ?? "Pain"}: ${pain}\n${
        pdfMessages.levels?.stress ?? "Stress"
      }: ${stress}`,
    bowelDetails: (bristol: string | number | undefined) =>
      (pdfMessages.bowelDetails as string | undefined)?.replace(
        "{bristol}",
        bristol !== undefined ? String(bristol) : "-"
      ) ?? `Bristol: ${bristol ?? "-"}`,
    mealNoDetails: pdfMessages.mealNoDetails ?? "No food details",
    mealFoodsLabel: pdfMessages.mealFoodsLabel ?? "Foods",
    mealTriggersLabel: pdfMessages.mealTriggersLabel ?? "Triggers",
    symptomNoDetails: pdfMessages.symptomNoDetails ?? "No details",
    symptomLabel: pdfMessages.symptomLabel ?? "Symptoms",
    anxietyLabel: pdfMessages.anxietyLabel ?? "Anxiety",
    notesHidden: pdfMessages.notesHidden ?? "-",
    bristolTrendTitle:
      pdfMessages.bristolTrendTitle ?? "Bristol Stool Scale Trend",
    typeLabel: (type: number) =>
      (pdfMessages.typeLabel as string | undefined)?.replace(
        "{type}",
        String(type)
      ) ?? `Type ${type}`,
    topSymptomsTitle: pdfMessages.topSymptomsTitle ?? "Top Symptoms Frequency",
  };

  const doc = new jsPDF();

  // Filter logs if doctor mode
  let filteredLogs = [...logs];
  let reportTitle = labels.exportTitle;
  let reportSubtitle =
    dateRange?.start && dateRange?.end
      ? `${format(dateRange.start, "PPP", { locale: dfLocale })} - ${format(
          dateRange.end,
          "PPP",
          { locale: dfLocale }
        )}`
      : `${labels.allTime} (${labels.generatedOn} ${format(new Date(), "PPP", {
          locale: dfLocale,
        })})`;

  if (doctorOptions) {
    reportTitle = labels.doctorTitle;
    if (doctorOptions.dateRange !== "all") {
      const days = parseInt(doctorOptions.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filteredLogs = logs.filter((l) => new Date(l.timestamp) >= cutoff);
      reportSubtitle = `${labels.lastDays(days)} (${format(cutoff, "MMM d", {
        locale: dfLocale,
      })} - ${format(new Date(), "MMM d, yyyy", { locale: dfLocale })})`;
    } else {
      reportSubtitle = `${labels.allTime} (${labels.generatedOn} ${format(
        new Date(),
        "MMM d, yyyy",
        { locale: dfLocale }
      )})`;
    }
  }

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
  doc.text(reportTitle, 14, 22);

  // Subtitle (Date Range)
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(reportSubtitle, 14, 30);

  let startY = 36;

  // Draw Charts if requested
  if (doctorOptions?.includeCharts) {
    startY = drawCharts(doc, filteredLogs, startY);
    startY += 10;
  }

  // Table Data Preparation
  const tableData = filteredLogs.map((log) => {
    const date = format(new Date(log.timestamp), "yyyy-MM-dd HH:mm");

    let details = "";
    if (log.type === "bowel_movement") {
      details = labels.bowelDetails(log.bristolType);
    } else if (log.type === "meal") {
      const parts = [];
      if (log.foods && log.foods.length > 0) {
        parts.push(
          `${labels.mealFoodsLabel}: ${log.foods
            .map((f) => f.toString())
            .join(", ")}`
        );
      }
      if (log.triggerFoods && log.triggerFoods.length > 0) {
        parts.push(
          `${labels.mealTriggersLabel}: ${log.triggerFoods
            .map((t) => t.toString())
            .join(", ")}`
        );
      }
      details = parts.length > 0 ? parts.join("\n") : labels.mealNoDetails;
    } else if (log.type === "symptom") {
      const parts = [];
      if (log.symptoms && log.symptoms.length > 0) {
        const symptomLabels = log.symptoms
          .map((s) => symptomMessages[s] ?? s)
          .join(", ");
        parts.push(`${labels.symptomLabel}: ${symptomLabels}`);
      }
      if (log.anxietyMarkers && log.anxietyMarkers.length > 0) {
        const anxietyLabels = log.anxietyMarkers
          .map((m) => anxietyMessages[m] ?? m)
          .join(", ");
        parts.push(`${labels.anxietyLabel}: ${anxietyLabels}`);
      }
      details = parts.length > 0 ? parts.join("\n") : labels.symptomNoDetails;
    }

    return [
      date,
      log.type === "bowel_movement"
        ? "BOWEL MOVEMENT"
        : log.type.toUpperCase().replace("_", " "),
      details,
      labels.levelsLabel(
        String(log.painLevel ?? "-"),
        String(log.stressLevel ?? "-")
      ),
      doctorOptions?.anonymize ? labels.notesHidden : log.notes || "-",
    ];
  });

  // Table Config
  const tableOptions: UserOptions = {
    startY: startY,
    head: [labels.tableHead],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [16, 185, 129], // Emerald-500 equivalent
      fontStyle: "normal",
    },
    styles: {
      fontSize: 9,
      font: "Roboto",
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Date
      1: { cellWidth: 25 }, // Type
      2: { cellWidth: 50 }, // Details
      3: { cellWidth: 25 }, // Levels (Pain/Stress)
      4: { cellWidth: "auto" }, // Notes
    },
  };

  autoTable(doc, tableOptions);

  const datePart = format(new Date(), "yyyy-MM-dd");
  const fileName = doctorOptions
    ? `gutvault-doctor-report-${datePart}.pdf`
    : `gutvault-export-${datePart}.pdf`;
  doc.save(fileName);
}

function drawCharts(doc: jsPDF, logs: LogEntry[], startY: number): number {
  let currentY = startY;

  // Bristol Chart
  // Filter for bowel movements with bristol type
  const bmLogs = logs
    .filter((l) => l.type === "bowel_movement" && l.bristolType)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  if (bmLogs.length > 1) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Bristol Stool Scale Trend", 14, currentY + 10);
    currentY += 20;

    const chartHeight = 40;
    const chartWidth = 170;
    const chartX = 14;

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    // Y Axis line
    doc.line(chartX, currentY, chartX, currentY + chartHeight);
    // X Axis line
    doc.line(
      chartX,
      currentY + chartHeight,
      chartX + chartWidth,
      currentY + chartHeight
    );

    doc.setFillColor(240, 253, 244);

    // Ideal zone (3-5)
    const getY = (val: number) =>
      currentY + chartHeight - ((val - 1) / 6) * chartHeight;

    const y5 = getY(5);
    const y3 = getY(3);

    doc.setFillColor(220, 252, 231); // emerald-100
    doc.rect(chartX, y5, chartWidth, y3 - y5, "F");

    // Labels
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Type 7", chartX - 10, getY(7) + 2);
    doc.text("Type 4", chartX - 10, getY(4) + 2);
    doc.text("Type 1", chartX - 10, getY(1) + 2);

    // Plot points
    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.setLineWidth(1.5);

    if (bmLogs.length > 0) {
      const timeMin = new Date(bmLogs[0].timestamp).getTime();
      const timeMax = new Date(bmLogs[bmLogs.length - 1].timestamp).getTime();
      const timeRange = timeMax - timeMin || 1;

      let prevX = 0;
      let prevY = 0;

      bmLogs.forEach((log, i) => {
        if (!log.bristolType) return;
        const t = new Date(log.timestamp).getTime();
        const x = chartX + ((t - timeMin) / timeRange) * chartWidth;
        const y = getY(log.bristolType);

        if (i > 0) {
          doc.line(prevX, prevY, x, y);
        }
        doc.setFillColor(16, 185, 129);
        doc.circle(x, y, 1, "F");

        prevX = x;
        prevY = y;
      });
    }
    currentY += chartHeight + 10;
  }

  // Symptom Frequency
  const symptoms: Record<string, number> = {};
  logs.forEach((l) => {
    if (l.type === "symptom" && l.symptoms) {
      l.symptoms.forEach((s) => (symptoms[s] = (symptoms[s] || 0) + 1));
    }
  });
  const topSymptoms = Object.entries(symptoms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topSymptoms.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Top Symptoms Frequency", 14, currentY + 10);
    currentY += 20;

    const maxCount = Math.max(...topSymptoms.map((s) => s[1]));
    const barHeight = 8;
    const barGap = 6;
    const startX = 50;

    topSymptoms.forEach((s, i) => {
      const y = currentY + i * (barHeight + barGap);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(s[0].charAt(0).toUpperCase() + s[0].slice(1), 14, y + 6);

      const width = (s[1] / maxCount) * 100;
      doc.setFillColor(248, 113, 113); // red-400
      doc.rect(startX, y, width, barHeight, "F");

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(s[1].toString(), startX + width + 2, y + 6);
    });

    currentY += topSymptoms.length * (barHeight + barGap) + 10;
  }

  return currentY;
}
