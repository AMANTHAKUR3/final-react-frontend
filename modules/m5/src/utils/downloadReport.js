/**
 * Utility functions for downloading reports in various formats
 */

/**
 * Download report as CSV
 * @param {Object} reportData - The report data to download
 */
export function downloadAsCSV(reportData) {
  const { reportId, period, generatedDate, rateRecovery, rateReadmission, inPatients, outPatients } = reportData;
  
  // Create CSV content
  const csvContent = [
    ['Report Summary'],
    ['Report ID', reportId],
    ['Period', period],
    ['Generated Date', generatedDate],
    [''],
    ['Metric', 'Value'],
    ['Recovery Rate', `${rateRecovery}%`],
    ['Readmission Rate', `${rateReadmission}%`],
    ['In-Patients', inPatients],
    ['Out-Patients', outPatients],
    [''],
    ['Export Date', new Date().toLocaleString()]
  ]
    .map(row => row.join(','))
    .join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Report_${reportId}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download report as XLSX (Excel-compatible XML format)
 * @param {Object} reportData - The report data to download
 */
export function downloadAsXLSX(reportData) {
  const { reportId, period, generatedDate, rateRecovery, rateReadmission, inPatients, outPatients } = reportData;
  
  // Create XML content for Excel
  const xlsxContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Size="14" ss:Color="#1DB1A2"/>
  </Style>
  <Style ss:ID="SubHeader">
   <Font ss:Bold="1" ss:Size="11"/>
   <Interior ss:Color="#f6fbfc" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Data">
   <Alignment ss:Horizontal="Left"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Report Summary">
  <Table>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
   <Row>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Medical Report Summary</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Report ID</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${reportId}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Period</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${period}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Generated Date</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${generatedDate}</Data></Cell>
   </Row>
   <Row></Row>
   <Row>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Metric</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Value</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Recovery Rate</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${rateRecovery}%</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Readmission Rate</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${rateReadmission}%</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">In-Patients</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="Number">${inPatients}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Out-Patients</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="Number">${outPatients}</Data></Cell>
   </Row>
   <Row></Row>
   <Row>
    <Cell ss:StyleID="Data"><Data ss:Type="String">Export Date</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${new Date().toLocaleString()}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  // Create blob and download
  const blob = new Blob([xlsxContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Report_${reportId}_${Date.now()}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Main download function that routes to the appropriate format handler
 * @param {Object} reportData - The report data to download
 * @param {string} format - The format to download (PDF, CSV, XLSX)
 */
export function downloadReport(reportData, format) {
  if (!reportData || !format) {
    console.error('Invalid parameters for download');
    return;
  }

  switch (format.toUpperCase()) {
    case 'CSV':
      downloadAsCSV(reportData);
      break;
    case 'XLSX':
      downloadAsXLSX(reportData);
      break;
    default:
      console.error('Unsupported format:', format);
  }
}
