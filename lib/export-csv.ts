/**
 * Helper utility untuk mengekspor array objek data menjadi berkas CSV sungguhan.
 */
export function exportToCsv<T extends Record<string, unknown>>(
    filename: string,
    headers: { key: keyof T; label: string }[],
    data: T[],
) {
    if (!data || data.length === 0) {
        alert('Tidak ada data untuk diekspor.');
        return;
    }

    const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',');
    const dataRows = data.map((row) =>
        headers
            .map((h) => {
                const val = row[h.key];
                const strVal = val === null || val === undefined ? '' : String(val);
                return `"${strVal.replace(/"/g, '""')}"`;
            })
            .join(','),
    );

    const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
