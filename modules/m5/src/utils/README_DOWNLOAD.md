# Report Download Functionality

## Overview
This utility provides functionality to download medical reports in multiple formats: PDF (HTML), CSV, and XLSX (Excel).

## Features

### 1. **PDF Download** (HTML format)
- Creates a nicely formatted HTML document styled to look like a professional medical report
- Includes all report metrics with proper styling
- Color-coded with the MediConnect theme (#1DB1A2)
- Downloads as `.html` file that can be opened in any browser and printed to PDF

### 2. **CSV Download**
- Creates a comma-separated values file
- Perfect for importing into spreadsheet applications
- Includes all report metadata and metrics
- Downloads as `.csv` file

### 3. **XLSX Download** (Excel format)
- Creates an Excel-compatible XML file
- Includes styling with headers and colors
- Can be opened directly in Microsoft Excel or LibreOffice Calc
- Downloads as `.xls` file

## Usage

### In ReportView Component

```jsx
import { downloadReport } from "../../utils/downloadReport";

// Call the function with report data and desired format
downloadReport(CurrentReport, format);
```

### Function Signature

```javascript
downloadReport(reportData, format)
```

**Parameters:**
- `reportData` (Object): The report object containing:
  - `reportId`: Unique identifier for the report
  - `period`: Time period covered by the report
  - `generatedDate`: When the report was generated
  - `rateRecovery`: Recovery rate percentage
  - `rateReadmission`: Readmission rate percentage
  - `inPatients`: Number of in-patients
  - `outPatients`: Number of out-patients

- `format` (String): The desired download format - 'PDF', 'CSV', or 'XLSX'

## File Naming

All downloaded files follow the naming convention:
```
Report_{reportId}_{timestamp}.{extension}
```

Example: `Report_MED-2024-001_1707753600000.csv`

## Browser Compatibility

This implementation uses:
- `Blob` API
- `URL.createObjectURL()`
- Programmatic `<a>` element clicks

These are supported in all modern browsers (Chrome, Firefox, Safari, Edge).

## Error Handling

The utility includes basic error handling:
- Validates that both `reportData` and `format` are provided
- Logs errors to the console if download fails
- Falls back gracefully on unsupported formats

## Future Enhancements

Possible improvements:
- Add true PDF generation using libraries like `jsPDF` or `pdfmake`
- Include charts/graphs in the exported reports
- Add more export formats (JSON, XML)
- Implement server-side report generation for larger datasets
- Add digital signatures for compliance
