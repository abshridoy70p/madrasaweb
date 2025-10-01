// নুরুল কোরআন কওমী মাদ্রাসা - Google Apps Script Backend
// এই কোড Google Apps Script Editor এ কপি করুন

// Google Sheets ID (আপনার Spreadsheet এর ID এখানে দিন)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Sheet Names
const STUDENTS_SHEET = 'Students';
const FEE_RECORDS_SHEET = 'FeeRecords';
const EXAM_FEE_SHEET = 'ExamFee';

/**
 * ওয়েব অ্যাপ - GET Request Handler
 * ডেটা পড়ার জন্য
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getData') {
      return getAllData();
    } else if (action === 'getStudents') {
      return getStudents();
    } else if (action === 'getFeeRecords') {
      return getFeeRecords();
    } else if (action === 'getExamFee') {
      return getExamFee();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ওয়েব অ্যাপ - POST Request Handler
 * ডেটা লেখার জন্য
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'syncData') {
      return syncAllData(data);
    } else if (action === 'addStudent') {
      return addStudent(data.student);
    } else if (action === 'updateStudent') {
      return updateStudent(data.student);
    } else if (action === 'deleteStudent') {
      return deleteStudent(data.studentId);
    } else if (action === 'addFeeRecord') {
      return addFeeRecord(data.feeRecord);
    } else if (action === 'addExamFee') {
      return addExamFee(data.examFee);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Spreadsheet খোলা
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Sheet খোলা বা তৈরি করা
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  
  return sheet;
}

/**
 * সকল ডেটা পড়া
 */
function getAllData() {
  const students = getStudentsData();
  const feeRecords = getFeeRecordsData();
  const examFeeRecords = getExamFeeData();
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    students: students,
    feeRecords: feeRecords,
    examFeeRecords: examFeeRecords
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ছাত্র ডেটা পড়া
 */
function getStudentsData() {
  const headers = ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At'];
  const sheet = getOrCreateSheet(STUDENTS_SHEET, headers);
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  
  return data.map(row => ({
    id: row[0],
    roll: row[1],
    name: row[2],
    fatherName: row[3],
    class: row[4],
    phone: row[5],
    address: row[6],
    createdAt: row[7]
  }));
}

function getStudents() {
  const students = getStudentsData();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: students
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ফি রেকর্ড ডেটা পড়া
 */
function getFeeRecordsData() {
  const headers = ['ID', 'Student ID', 'Month', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(FEE_RECORDS_SHEET, headers);
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  
  return data.map(row => ({
    id: row[0],
    studentId: row[1],
    month: row[2],
    amount: row[3],
    paid: row[4],
    paymentDate: row[5],
    type: row[6]
  }));
}

function getFeeRecords() {
  const feeRecords = getFeeRecordsData();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: feeRecords
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * পরীক্ষার ফি ডেটা পড়া
 */
function getExamFeeData() {
  const headers = ['ID', 'Student ID', 'Exam', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(EXAM_FEE_SHEET, headers);
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  
  return data.map(row => ({
    id: row[0],
    studentId: row[1],
    exam: row[2],
    amount: row[3],
    paid: row[4],
    paymentDate: row[5],
    type: row[6]
  }));
}

function getExamFee() {
  const examFeeRecords = getExamFeeData();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: examFeeRecords
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * সকল ডেটা সিঙ্ক করা
 */
function syncAllData(data) {
  try {
    // Students সিঙ্ক
    if (data.students && data.students.length > 0) {
      syncStudents(data.students);
    }
    
    // Fee Records সিঙ্ক
    if (data.feeRecords && data.feeRecords.length > 0) {
      syncFeeRecords(data.feeRecords);
    }
    
    // Exam Fee সিঙ্ক
    if (data.examFeeRecords && data.examFeeRecords.length > 0) {
      syncExamFee(data.examFeeRecords);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data synced successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ছাত্র ডেটা সিঙ্ক
 */
function syncStudents(students) {
  const headers = ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At'];
  const sheet = getOrCreateSheet(STUDENTS_SHEET, headers);
  
  // পুরনো ডেটা মুছে ফেলুন (হেডার রাখুন)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  
  // নতুন ডেটা যোগ করুন
  const rows = students.map(s => [
    s.id,
    s.roll,
    s.name,
    s.fatherName,
    s.class,
    s.phone,
    s.address,
    s.createdAt
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * ফি রেকর্ড সিঙ্ক
 */
function syncFeeRecords(feeRecords) {
  const headers = ['ID', 'Student ID', 'Month', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(FEE_RECORDS_SHEET, headers);
  
  // পুরনো ডেটা মুছে ফেলুন
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  
  // নতুন ডেটা যোগ করুন
  const rows = feeRecords.map(f => [
    f.id,
    f.studentId,
    f.month,
    f.amount,
    f.paid,
    f.paymentDate,
    f.type
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * পরীক্ষার ফি সিঙ্ক
 */
function syncExamFee(examFeeRecords) {
  const headers = ['ID', 'Student ID', 'Exam', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(EXAM_FEE_SHEET, headers);
  
  // পুরনো ডেটা মুছে ফেলুন
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  
  // নতুন ডেটা যোগ করুন
  const rows = examFeeRecords.map(e => [
    e.id,
    e.studentId,
    e.exam,
    e.amount,
    e.paid,
    e.paymentDate,
    e.type
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * একটি ছাত্র যোগ করা
 */
function addStudent(student) {
  const headers = ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At'];
  const sheet = getOrCreateSheet(STUDENTS_SHEET, headers);
  
  const row = [
    student.id,
    student.roll,
    student.name,
    student.fatherName,
    student.class,
    student.phone,
    student.address,
    student.createdAt
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Student added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ছাত্র আপডেট করা
 */
function updateStudent(student) {
  const headers = ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At'];
  const sheet = getOrCreateSheet(STUDENTS_SHEET, headers);
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.id) {
      const row = [
        student.id,
        student.roll,
        student.name,
        student.fatherName,
        student.class,
        student.phone,
        student.address,
        student.createdAt
      ];
      
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Student updated successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Student not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ছাত্র ডিলিট করা
 */
function deleteStudent(studentId) {
  const sheet = getOrCreateSheet(STUDENTS_SHEET, ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At']);
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === studentId) {
      sheet.deleteRow(i + 1);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Student deleted successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Student not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ফি রেকর্ড যোগ করা
 */
function addFeeRecord(feeRecord) {
  const headers = ['ID', 'Student ID', 'Month', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(FEE_RECORDS_SHEET, headers);
  
  const row = [
    feeRecord.id,
    feeRecord.studentId,
    feeRecord.month,
    feeRecord.amount,
    feeRecord.paid,
    feeRecord.paymentDate,
    feeRecord.type
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Fee record added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * পরীক্ষার ফি যোগ করা
 */
function addExamFee(examFee) {
  const headers = ['ID', 'Student ID', 'Exam', 'Amount', 'Paid', 'Payment Date', 'Type'];
  const sheet = getOrCreateSheet(EXAM_FEE_SHEET, headers);
  
  const row = [
    examFee.id,
    examFee.studentId,
    examFee.exam,
    examFee.amount,
    examFee.paid,
    examFee.paymentDate,
    examFee.type
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Exam fee added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * টেস্ট ফাংশন - Apps Script Editor থেকে রান করতে পারবেন
 */
function testSetup() {
  Logger.log('Testing setup...');
  
  // Sheets তৈরি করুন
  getOrCreateSheet(STUDENTS_SHEET, ['ID', 'Roll', 'Name', 'Father Name', 'Class', 'Phone', 'Address', 'Created At']);
  getOrCreateSheet(FEE_RECORDS_SHEET, ['ID', 'Student ID', 'Month', 'Amount', 'Paid', 'Payment Date', 'Type']);
  getOrCreateSheet(EXAM_FEE_SHEET, ['ID', 'Student ID', 'Exam', 'Amount', 'Paid', 'Payment Date', 'Type']);
  
  Logger.log('Setup complete!');
}

/**
 * স্যাম্পল ডেটা তৈরি করুন (টেস্টিং এর জন্য)
 */
function createSampleData() {
  const sampleStudent = {
    id: Date.now().toString(),
    roll: '001',
    name: 'মোহাম্মদ আব্দুল্লাহ',
    fatherName: 'মোহাম্মদ রহিম',
    class: 'প্রথম জামাত',
    phone: '01712345678',
    address: 'ঢাকা',
    createdAt: new Date().toISOString()
  };
  
  addStudent(sampleStudent);
  Logger.log('Sample data created!');
}
