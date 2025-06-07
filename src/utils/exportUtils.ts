import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TaxCalculationResult } from './taxCalculations';
import type { CostOfLivingComparison } from './costOfLivingCalculations';

export interface ExportData {
  calculationDate: string;
  hourlyRate?: number;
  annualSalary?: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  state: string;
  filingStatus: string;
  taxResults: TaxCalculationResult;
  costOfLivingComparison?: CostOfLivingComparison;
}

export function exportToCSV(data: ExportData): void {
  const csvContent = generateCSVContent(data);
  downloadFile(csvContent, 'wagecrunch-calculation.csv', 'text/csv');
}

export function exportToJSON(data: ExportData): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, 'wagecrunch-calculation.json', 'application/json');
}

export async function exportToPDF(elementId: string, filename = 'wagecrunch-report.pdf'): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}

function generateCSVContent(data: ExportData): string {
  const headers = [
    'Calculation Date',
    'Hourly Rate',
    'Annual Salary',
    'Hours Per Week',
    'Weeks Per Year',
    'State',
    'Filing Status',
    'Gross Income',
    'Federal Tax',
    'State Tax',
    'Social Security',
    'Medicare',
    'Total Tax',
    'Net Income',
    'Effective Tax Rate'
  ];

  const values = [
    data.calculationDate,
    data.hourlyRate || '',
    data.annualSalary || '',
    data.hoursPerWeek,
    data.weeksPerYear,
    data.state,
    data.filingStatus,
    data.taxResults.grossIncome,
    data.taxResults.federalTax,
    data.taxResults.stateTax,
    data.taxResults.socialSecurity,
    data.taxResults.medicare,
    data.taxResults.totalTax,
    data.taxResults.netIncome,
    data.taxResults.effectiveTaxRate
  ];

  let csvContent = `${headers.join(',')}\\n`;
  csvContent += `${values.map(value => `"${value}"`).join(',')}\\n`;

  // Add cost of living comparison if available
  if (data.costOfLivingComparison) {
    csvContent += '\\n\\nCost of Living Comparison\\n';
    csvContent += 'Current State,Target State,Current Salary,Equivalent Salary,Purchasing Power Change,Cost Difference\\n';
    const col = data.costOfLivingComparison;
    csvContent += `"${col.currentState}","${col.targetState}","${col.currentSalary}","${col.equivalentSalary}","${col.purchasingPowerChange}%","${col.costDifference}"\\n`;
  }

  return csvContent;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function generateShareableURL(data: Partial<ExportData>): string {
  const params = new URLSearchParams();

  if (data.hourlyRate) params.set('hourly', data.hourlyRate.toString());
  if (data.annualSalary) params.set('salary', data.annualSalary.toString());
  if (data.hoursPerWeek) params.set('hours', data.hoursPerWeek.toString());
  if (data.weeksPerYear) params.set('weeks', data.weeksPerYear.toString());
  if (data.state) params.set('state', data.state);
  if (data.filingStatus) params.set('filing', data.filingStatus);

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}
