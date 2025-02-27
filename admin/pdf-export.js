window.jsPDF = window.jspdf.jsPDF;

function exportUserData() {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(22);
    doc.text('MobiCharge - User Report', 105, 20, { align: 'center' });
    
    // Add generated date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add user table
    doc.autoTable({
        startY: 40,
        head: [['User ID', 'Name', 'Phone', 'Plan', 'Status', 'Join Date']],
        body: [
            ['#USR001', 'John Doe', '+1 (555) 123-4567', 'Value Pack', 'Active', '2024-01-15'],
            ['#USR002', 'Jane Smith', '+1 (555) 987-6543', 'Annual Pack', 'Active', '2024-02-01'],
            ['#USR003', 'Mike Johnson', '+1 (555) 234-5678', 'Basic Pack', 'Inactive', '2024-01-20'],
            // Add more rows as needed
        ],
        theme: 'grid',
        headStyles: { fillColor: [52, 152, 219] }
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text('Summary', 20, finalY);
    doc.autoTable({
        startY: finalY + 10,
        head: [['Category', 'Count']],
        body: [
            ['Total Users', '15,847'],
            ['Active Users', '12,583'],
            ['Inactive Users', '3,264']
        ],
        theme: 'plain',
        headStyles: { fillColor: [52, 152, 219] }
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.text('© 2025 MobiCharge. All rights reserved.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save('MobiCharge_User_Report.pdf');
}

// Additional export functions for different types of reports
function exportTransactionReport() {
    // Similar structure for transaction report
}

function exportPlanReport() {
    // Similar structure for plan report
}

function exportTicketReport() {
    // Similar structure for support ticket report
}