// Renders an A4 sheet element to a PDF file and downloads it.
// Content taller than one page is split across A4 pages.
export async function downloadElementAsPdf(el: HTMLElement, filename: string) {
  const [{ toPng }, { jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);

  const png = await toPng(el, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    style: { boxShadow: 'none' },
  });

  const img = new Image();
  img.src = png;
  await img.decode();

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const pageW = 210;
  const pageH = 297;
  const imgH = (img.height * pageW) / img.width;

  // Allow ~2mm of rounding slack before spilling onto a second page
  const pages = Math.max(1, Math.ceil((imgH - 2) / pageH));
  for (let i = 0; i < pages; i++) {
    if (i > 0) pdf.addPage();
    pdf.addImage(png, 'PNG', 0, -i * pageH, pageW, imgH);
  }

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

// Downloads rows as a CSV file (opens cleanly in Excel)
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '﻿' + rows.map((r) => r.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
