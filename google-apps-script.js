// ==================== Google Apps Script Code ====================
// এই কোডটি Google Apps Script Editor-এ কপি করুন

// Global Variables
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // আপনার Google Sheets ID এখানে দিন

// Main function to handle web app requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'sync') {
      syncData(data);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'load') {
      const data = loadData();
      return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Return a simple HTML page for testing
    return HtmlService.createHtmlOutput('<h1>Nurul Quran Madrasa Management System API</h1><p>API is working!</p>');
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Sync data to Google Sheets
function syncData(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Sync Students
  if (data.students && data.students.length > 0) {
    let studentsSheet = ss.getSheetByName('Students');
    if (!studentsSheet) {
      studentsSheet = ss.insertSheet('Students');
      studentsSheet.appendRow(['ID', 'Name', 'Father Name', 'Class', 'Mobile', 'Address', 'Admission Date', 'Created At']);
    } else {
      studentsSheet.clear();
      studentsSheet.appendRow(['ID', 'Name', 'Father Name', 'Class', 'Mobile', 'Address', 'Admission Date', 'Created At']);
    }
    
    data.students.forEach(student => {
      studentsSheet.appendRow([
        student.id,
        student.name,
        student.fatherName,
        student.class,
        student.mobile,
        student.address,
        student.admissionDate,
        student.createdAt
      ]);
    });
  }
  
  // Sync Payments
  if (data.payments && data.payments.length > 0) {
    let paymentsSheet = ss.getSheetByName('Payments');
    if (!paymentsSheet) {
      paymentsSheet = ss.insertSheet('Payments');
      paymentsSheet.appendRow(['ID', 'Student ID', 'Month', 'Amount', 'Date', 'Created At']);
    } else {
      paymentsSheet.clear();
      paymentsSheet.appendRow(['ID', 'Student ID', 'Month', 'Amount', 'Date', 'Created At']);
    }
    
    data.payments.forEach(payment => {
      paymentsSheet.appendRow([
        payment.id,
        payment.studentId,
        payment.month,
        payment.amount,
        payment.date,
        payment.createdAt
      ]);
    });
  }
  
  // Sync Exam Payments
  if (data.examPayments && data.examPayments.length > 0) {
    let examPaymentsSheet = ss.getSheetByName('Exam Payments');
    if (!examPaymentsSheet) {
      examPaymentsSheet = ss.insertSheet('Exam Payments');
      examPaymentsSheet.appendRow(['ID', 'Student ID', 'Exam Type', 'Amount', 'Date', 'Created At']);
    } else {
      examPaymentsSheet.clear();
      examPaymentsSheet.appendRow(['ID', 'Student ID', 'Exam Type', 'Amount', 'Date', 'Created At']);
    }
    
    data.examPayments.forEach(payment => {
      examPaymentsSheet.appendRow([
        payment.id,
        payment.studentId,
        payment.examType,
        payment.amount,
        payment.date,
        payment.createdAt
      ]);
    });
  }
  
  // Update last sync timestamp
  updateLastSync();
  
  Logger.log('Data synced successfully at ' + new Date());
}

// Load data from Google Sheets
function loadData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const data = {
    students: [],
    payments: [],
    examPayments: []
  };
  
  // Load Students
  const studentsSheet = ss.getSheetByName('Students');
  if (studentsSheet) {
    const studentsData = studentsSheet.getDataRange().getValues();
    for (let i = 1; i < studentsData.length; i++) {
      data.students.push({
        id: studentsData[i][0],
        name: studentsData[i][1],
        fatherName: studentsData[i][2],
        class: studentsData[i][3],
        mobile: studentsData[i][4],
        address: studentsData[i][5],
        admissionDate: studentsData[i][6],
        createdAt: studentsData[i][7]
      });
    }
  }
  
  // Load Payments
  const paymentsSheet = ss.getSheetByName('Payments');
  if (paymentsSheet) {
    const paymentsData = paymentsSheet.getDataRange().getValues();
    for (let i = 1; i < paymentsData.length; i++) {
      data.payments.push({
        id: paymentsData[i][0],
        studentId: paymentsData[i][1],
        month: paymentsData[i][2],
        amount: paymentsData[i][3],
        date: paymentsData[i][4],
        createdAt: paymentsData[i][5]
      });
    }
  }
  
  // Load Exam Payments
  const examPaymentsSheet = ss.getSheetByName('Exam Payments');
  if (examPaymentsSheet) {
    const examPaymentsData = examPaymentsSheet.getDataRange().getValues();
    for (let i = 1; i < examPaymentsData.length; i++) {
      data.examPayments.push({
        id: examPaymentsData[i][0],
        studentId: examPaymentsData[i][1],
        examType: examPaymentsData[i][2],
        amount: examPaymentsData[i][3],
        date: examPaymentsData[i][4],
        createdAt: examPaymentsData[i][5]
      });
    }
  }
  
  return data;
}

// Update last sync timestamp
function updateLastSync() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let metaSheet = ss.getSheetByName('Metadata');
  
  if (!metaSheet) {
    metaSheet = ss.insertSheet('Metadata');
    metaSheet.appendRow(['Last Sync', new Date()]);
  } else {
    metaSheet.getRange('B1').setValue(new Date());
  }
}

// Manual sync function (can be triggered from Apps Script)
function manualSync() {
  Logger.log('Manual sync initiated');
  const data = loadData();
  Logger.log('Loaded ' + data.students.length + ' students');
  Logger.log('Loaded ' + data.payments.length + ' payments');
  Logger.log('Loaded ' + data.examPayments.length + ' exam payments');
}

// Create backup
function createBackup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const backupName = 'Backup_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmmss');
  
  const backup = ss.copy(backupName);
  
  Logger.log('Backup created: ' + backupName);
  return backup.getId();
}

// Auto backup (trigger this daily)
function dailyBackup() {
  createBackup();
  Logger.log('Daily backup completed');
}

// Generate summary report
function generateSummaryReport() {
  const data = loadData();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  let reportSheet = ss.getSheetByName('Summary Report');
  if (!reportSheet) {
    reportSheet = ss.insertSheet('Summary Report');
  } else {
    reportSheet.clear();
  }
  
  // Add headers
  reportSheet.appendRow(['Nurul Quran Qawmi Madrasa - Summary Report']);
  reportSheet.appendRow(['Generated on: ' + new Date()]);
  reportSheet.appendRow([]);
  
  // Total students
  reportSheet.appendRow(['Total Students:', data.students.length]);
  
  // Students by class
  reportSheet.appendRow([]);
  reportSheet.appendRow(['Class Distribution:']);
  const classCounts = {};
  data.students.forEach(s => {
    classCounts[s.class] = (classCounts[s.class] || 0) + 1;
  });
  
  Object.keys(classCounts).forEach(className => {
    reportSheet.appendRow([className, classCounts[className]]);
  });
  
  // Total collection
  const totalCollection = data.payments.reduce((sum, p) => sum + p.amount, 0);
  reportSheet.appendRow([]);
  reportSheet.appendRow(['Total Collection:', totalCollection + ' Tk']);
  
  // Monthly collection
  const now = new Date();
  const currentMonth = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM');
  const monthlyCollection = data.payments.filter(p => p.month === currentMonth).reduce((sum, p) => sum + p.amount, 0);
  reportSheet.appendRow(['This Month Collection:', monthlyCollection + ' Tk']);
  
  Logger.log('Summary report generated');
}

// Send email notification for unpaid students
function sendUnpaidNotifications() {
  const data = loadData();
  const now = new Date();
  const currentMonth = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM');
  
  const unpaidStudents = data.students.filter(s => 
    !data.payments.some(p => p.studentId === s.id && p.month === currentMonth)
  );
  
  if (unpaidStudents.length > 0) {
    const emailBody = 'Unpaid students for ' + currentMonth + ':\n\n' +
      unpaidStudents.map((s, i) => (i+1) + '. ' + s.name + ' - ' + s.class + ' - ' + s.mobile).join('\n');
    
    // Configure email settings
    const recipient = 'YOUR_EMAIL@example.com'; // Replace with admin email
    const subject = 'Unpaid Students Report - ' + currentMonth;
    
    // Uncomment to send email
    // MailApp.sendEmail(recipient, subject, emailBody);
    
    Logger.log('Unpaid students count: ' + unpaidStudents.length);
    Logger.log(emailBody);
  }
}

// Setup time-based triggers
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Daily backup at 2 AM
  ScriptApp.newTrigger('dailyBackup')
    .timeBased()
    .atHour(2)
    .everyDays(1)
    .create();
  
  // Weekly summary report on Monday 9 AM
  ScriptApp.newTrigger('generateSummaryReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
  
  Logger.log('Triggers setup completed');
}
