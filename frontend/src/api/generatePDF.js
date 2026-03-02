import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDocumentReport = (user, documents, lostReports) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // ── Header ──────────────────────────────────
  doc.setFillColor(10, 92, 54);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GovTrack Kenya', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Integrated Government Document Tracking System', 14, 20);
  doc.text('Machakos University · CS Project · Victor Mauti Cosmas', 14, 26);

  // ── Report Title ─────────────────────────────
  doc.setTextColor(15, 17, 23);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Status Report', 14, 44);

  // ── User Info ────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated for: ${user.name}`, 14, 52);
  doc.text(`National ID: ${user.nationalId}`, 14, 58);
  doc.text(`Email: ${user.email}`, 14, 64);
  doc.text(`Date: ${today}`, 14, 70);

  // ── Divider ──────────────────────────────────
  doc.setDrawColor(221, 225, 216);
  doc.line(14, 75, 196, 75);

  // ── Documents Table ──────────────────────────
  doc.setTextColor(15, 17, 23);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('My Documents', 14, 84);

  if (documents.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('No documents registered.', 14, 94);
  } else {
    autoTable(doc, {
      startY: 88,
      head: [['Document Type', 'Document No.', 'Status', 'Office', 'Applied Date', 'Last Updated']],
      body: documents.map(d => [
        d.type,
        d.docNumber,
        d.status,
        d.office,
        d.appliedDate,
        d.updatedDate,
      ]),
      headStyles: {
        fillColor: [10, 92, 54],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [232, 245, 239] },
      styles: { cellPadding: 4 },
    });
  }

  // ── Lost Reports Table ───────────────────────
  const afterDocsY = doc.lastAutoTable?.finalY || 100;

  doc.setTextColor(15, 17, 23);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Lost Document Reports', 14, afterDocsY + 14);

  if (lostReports.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('No lost reports submitted.', 14, afterDocsY + 24);
  } else {
    autoTable(doc, {
      startY: afterDocsY + 18,
      head: [['Document Type', 'Document No.', 'Lost Date', 'Location', 'Status']],
      body: lostReports.map(r => [
        r.docType,
        r.docNumber,
        r.lostDate,
        r.lostLocation,
        r.status,
      ]),
      headStyles: {
        fillColor: [200, 16, 46],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [253, 240, 242] },
      styles: { cellPadding: 4 },
    });
  }

  // ── Footer ───────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `GovTrack Kenya · Confidential · Page ${i} of ${pageCount}`,
      14, 287
    );
    doc.text(
      'Protected under Kenya Data Protection Act, 2019',
      120, 287
    );
  }

  // ── Save ─────────────────────────────────────
  doc.save(`GovTrack_Report_${user.name.replace(' ', '_')}_${Date.now()}.pdf`);
};