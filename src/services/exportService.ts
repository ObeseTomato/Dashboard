// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/services/exportService.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { DashboardData, DigitalAsset, Task } from '../types/dashboard';
import { geminiService } from './geminiService'; // Import geminiService
import { AiContext } from './geminiService'; // Import AiContext type

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

class ExportService {
  // Export assets to CSV
  exportAssetsToCSV(assets: DigitalAsset[], options: ExportOptions = {}) {
    const { filename = 'assets-export', includeHeaders = true } = options;
    
    const csvData = assets.map(asset => ({
      Name: asset.name,
      Type: asset.type.replace('_', ' ').toUpperCase(),
      Status: asset.status,
      Priority: asset.priority,
      'Last Updated': asset.lastUpdated,
      URL: asset.url || 'N/A'
    }));

    const csv = Papa.unparse(csvData, {
      header: includeHeaders
    });

    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  // Export tasks to CSV
  exportTasksToCSV(tasks: Task[], options: ExportOptions = {}) {
    const { filename = 'tasks-export', includeHeaders = true } = options;
    
    const csvData = tasks.map(task => ({
      Title: task.title,
      Description: task.description,
      Type: task.type.replace('_', ' ').toUpperCase(),
      Priority: task.priority,
      Status: task.completed ? 'Completed' : 'Pending',
      'Due Date': new Date(task.dueDate).toLocaleDateString(),
      'AI Generated': task.aiGenerated ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(csvData, {
      header: includeHeaders
    });

    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  // Export dashboard summary to PDF
  async exportDashboardToPDF(data: DashboardData, options: ExportOptions = {}) { // Made async
    const { filename = 'dashboard-report' } = options;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20; // Y position for content

    // Set font for titles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text('Digital Ecosystem Dashboard Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    doc.text(`Last Data Updated: ${data.lastUpdated}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 20; // Space after header

    // Clinic Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('Clinic Information', 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${data.clinic.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Location: ${data.clinic.location}`, 20, yPos);
    yPos += 7;
    doc.text(`Specialties: ${data.clinic.specialties.join(', ')}`, 20, yPos);
    yPos += 7;
    doc.text(`Overall Data Quality: ${data.dataQuality}%`, 20, yPos);
    yPos += 15; // Space after clinic info

    // AI-Generated Strategic Briefing
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('AI-Generated Strategic Briefing', 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Prepare context for AI briefing (using actual data from dashboardData)
    const aiContext: AiContext = {
      clinicName: data.clinic.name,
      assets: data.assets,
      tasks: data.tasks,
      analytics: data.analytics,
      competitors: data.competitors
    };

    // Call AI service to generate briefing
    const briefingText = await geminiService.generateStrategicBriefing(aiContext);

    // Split text into lines to fit page width
    const splitText = doc.splitTextToSize(briefingText, pageWidth - 40); // 20 units margin on each side
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 5; // Adjust yPos based on number of lines
    yPos += 15; // Space after briefing

    // Ensure enough space for next section or add new page
    if (yPos + 50 > doc.internal.pageSize.height) { // If less than 50 units remaining
        doc.addPage();
        yPos = 20;
    }


    // Assets Summary Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('Assets Summary', 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");

    const assetStats = this.calculateAssetStats(data.assets);
    autoTable(doc, {
      startY: yPos,
      head: [['Status', 'Count', 'Percentage']],
      body: [
        ['Active', assetStats.active.toString(), `${assetStats.activePercent}%`],
        ['Warning', assetStats.warning.toString(), `${assetStats.warningPercent}%`],
        ['Critical', assetStats.critical.toString(), `${assetStats.criticalPercent}%`],
        ['Inactive', assetStats.inactive.toString(), `${assetStats.inactivePercent}%`]
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Light grey header
      alternateRowStyles: { fillColor: [250, 250, 250] } // Lighter alternating rows
    });
    yPos = (doc as any).lastAutoTable.finalY + 15; // Update yPos after table

    // Ensure enough space for next section or add new page
    if (yPos + 50 > doc.internal.pageSize.height) { 
        doc.addPage();
        yPos = 20;
    }

    // Tasks Summary Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('Tasks Summary', 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    
    const taskStats = this.calculateTaskStats(data.tasks);
    autoTable(doc, {
      startY: yPos,
      head: [['Priority', 'Total', 'Completed', 'Pending']],
      body: [
        ['High', taskStats.high.total.toString(), taskStats.high.completed.toString(), taskStats.high.pending.toString()],
        ['Medium', taskStats.medium.total.toString(), taskStats.medium.completed.toString(), taskStats.medium.pending.toString()],
        ['Low', taskStats.low.total.toString(), taskStats.low.completed.toString(), taskStats.low.pending.toString()]
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] }
    });
    yPos = (doc as any).lastAutoTable.finalY + 15; // Update yPos after table

    doc.save(`${filename}.pdf`);
  }

  // Export assets to PDF
  exportAssetsToPDF(assets: DigitalAsset[], options: ExportOptions = {}) {
    const { filename = 'assets-report' } = options;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Assets Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Assets Table
    const tableData = assets.map(asset => [
      asset.name,
      asset.type.replace('_', ' ').toUpperCase(),
      asset.status,
      asset.priority,
      asset.lastUpdated
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Name', 'Type', 'Status', 'Priority', 'Last Updated']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 }
      }
    });

    doc.save(`${filename}.pdf`);
  }

  // Export tasks to PDF
  exportTasksToPDF(tasks: Task[], options: ExportOptions = {}) {
    const { filename = 'tasks-report' = options;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Tasks Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Tasks Table
    const tableData = tasks.map(task => [
      task.title,
      task.type.replace('_', ' ').toUpperCase(),
      task.priority,
      task.completed ? 'Completed' : 'Pending',
      new Date(task.dueDate).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Title', 'Type', 'Priority', 'Status', 'Due Date']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 }
      }
    });

    doc.save(`${filename}.pdf`);
  }

  private calculateAssetStats(assets: DigitalAsset[]) {
    const total = assets.length;
    const active = assets.filter(a => a.status === 'active').length;
    const warning = assets.filter(a => a.status === 'warning').length;
    const critical = assets.filter(a => a.status === 'critical').length;
    const inactive = assets.filter(a => a.status === 'inactive').length;

    return {
      active,
      warning,
      critical,
      inactive,
      activePercent: Math.round((active / total) * 100),
      warningPercent: Math.round((warning / total) * 100),
      criticalPercent: Math.round((critical / total) * 100),
      inactivePercent: Math.round((inactive / total) * 100)
    };
  }

  private calculateTaskStats(tasks: Task[]) {
    const high = {
      total: tasks.filter(t => t.priority === 'high').length,
      completed: tasks.filter(t => t.priority === 'high' && t.completed).length,
      pending: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };

    const medium = {
      total: tasks.filter(t => t.priority === 'medium').length,
      completed: tasks.filter(t => t.priority === 'medium' && t.completed).length,
      pending: tasks.filter(t => t.priority === 'medium' && !t.completed).length
    };

    const low = {
      total: tasks.filter(t => t.priority === 'low').length,
      completed: tasks.filter(t => t.priority === 'low' && t.completed).length,
      pending: tasks.filter(t => t.priority === 'low' && !t.completed).length
    };

    return { high, medium, low };
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
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
}

export const exportService = new ExportService();