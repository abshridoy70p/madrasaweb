/**
 * Nurul Quran Qawmi Madrasa Management System
 * Backend: Google Apps Script for Google Sheets
 * Provides CRUD for students, payments, exams, reports, and backups.
 */

/** Sheet and Config Constants */
const SHEET_STUDENTS = 'Students';
const SHEET_PAYMENTS = 'Payments';
const SHEET_EXAMS = 'ExamFees';
const SHEET_CONFIG = 'Config';
const SHEET_META = 'Meta';

/** Default Class Fee Structure */
const DEFAULT_FEE_STRUCTURE = [
  { className: 'শিশু জামাত', monthlyFee: 150, examFee: 150 },
  { className: 'প্রথম জামাত', monthlyFee: 200, examFee: 200 },
  { className: 'দ্বিতীয় জামাত', monthlyFee: 250, examFee: 250 },
  { className: 'তৃতীয় জামাত', monthlyFee: 300, examFee: 300 },
  { className: 'হিফজ বিভাগ', monthlyFee: 800, examFee: 500 },
];

/** Entry point for Web App */
function doGet() {
  ensureAllSheets();
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('নুরুল কোরআন কওমী মাদ্রাসা - ম্যানেজমেন্ট')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** One-time setup: create sheets and headers if missing */
function setupSheets() {
  ensureAllSheets(true);
  return { ok: true };
}

/** Get initial data bundle for UI */
function getInitialData() {
  const students = getAllStudents();
  const feeStructure = getFeeStructureMap();
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const todayPayments = getPaymentsByDate(todayStr);
  return { students, feeStructure, today: todayStr, todayPayments };
}

/** Ping for online check */
function ping() {
  return { ok: true, ts: Date.now() };
}

// ===================== Students =====================

/**
 * Student object shape:
 * { id, name, className, guardianName, guardianPhone, address, admissionDate, status }
 */

function getAllStudents() {
  const sh = getSheet(SHEET_STUDENTS);
  const rows = getRows(sh);
  return rows.map(r => ({
    id: r[0],
    name: r[1],
    className: r[2],
    guardianName: r[3],
    guardianPhone: r[4],
    address: r[5],
    admissionDate: r[6],
    status: r[7],
  }));
}

function createStudent(student) {
  validateRequired(student, ['name', 'className']);
  const sh = getSheet(SHEET_STUDENTS);
  const id = student.id && String(student.id).trim() !== '' ? student.id : generateId('STD');
  // Prevent duplicate by (name + class + phone)
  const all = getAllStudents();
  const isDup = all.some(s =>
    normalize(s.name) === normalize(student.name) &&
    normalize(s.className) === normalize(student.className) &&
    String(s.guardianPhone || '') === String(student.guardianPhone || '')
  );
  if (isDup) {
    throw new Error('ডুপ্লিকেট ছাত্র তথ্য (নাম/ক্লাস/অভিভাবক নম্বর)');
  }
  const admissionDate = student.admissionDate || todayString();
  const status = student.status || 'Active';
  const row = [
    id,
    student.name,
    student.className,
    student.guardianName || '',
    student.guardianPhone || '',
    student.address || '',
    admissionDate,
    status,
    new Date(), // createdAt
    '', // updatedAt
  ];
  sh.appendRow(row);
  return { ok: true, id };
}

function updateStudent(student) {
  validateRequired(student, ['id']);
  const sh = getSheet(SHEET_STUDENTS);
  const idx = findRowIndexById(sh, student.id);
  if (idx < 2) throw new Error('Student not found');
  const values = sh.getRange(idx, 1, 1, sh.getLastColumn()).getValues()[0];
  const updated = [
    values[0],
    student.name != null ? student.name : values[1],
    student.className != null ? student.className : values[2],
    student.guardianName != null ? student.guardianName : values[3],
    student.guardianPhone != null ? student.guardianPhone : values[4],
    student.address != null ? student.address : values[5],
    student.admissionDate != null ? student.admissionDate : values[6],
    student.status != null ? student.status : values[7],
    values[8] || new Date(),
    new Date(),
  ];
  sh.getRange(idx, 1, 1, updated.length).setValues([updated]);
  return { ok: true };
}

function deleteStudent(studentId) {
  const sh = getSheet(SHEET_STUDENTS);
  const idx = findRowIndexById(sh, studentId);
  if (idx < 2) throw new Error('Student not found');
  sh.deleteRow(idx);
  return { ok: true };
}

// ===================== Payments =====================

/** Payment row: [id, studentId, year, month, amount, method, date, receiptNo, createdAt] */

function recordMonthlyPayment(payload) {
  validateRequired(payload, ['studentId', 'year', 'month']);
  const sh = getSheet(SHEET_PAYMENTS);
  const id = generateId('PAY');
  const method = payload.method || 'Cash';
  const dateStr = payload.date || todayString();
  const receiptNo = payload.receiptNo || ('RCPT-' + Utilities.getUuid().slice(0, 8).toUpperCase());
  const amount = Number(payload.amount) || getMonthlyFeeForStudent(payload.studentId);
  const row = [id, payload.studentId, Number(payload.year), Number(payload.month), amount, method, dateStr, receiptNo, new Date()];
  sh.appendRow(row);
  return { ok: true, id, receiptNo, amount, date: dateStr };
}

function getPaymentsByDate(dateStr) {
  const sh = getSheet(SHEET_PAYMENTS);
  const rows = getRows(sh);
  return rows
    .filter(r => r[6] === dateStr)
    .map(r => ({ id: r[0], studentId: r[1], year: r[2], month: r[3], amount: r[4], method: r[5], date: r[6], receiptNo: r[7] }));
}

function getUnpaidStudents(month, year) {
  const students = getAllStudents().filter(s => (s.status || 'Active') === 'Active');
  const sh = getSheet(SHEET_PAYMENTS);
  const rows = getRows(sh);
  const paidSet = new Set(rows.filter(r => r[2] == year && r[3] == month).map(r => r[1]));
  const feeMap = getFeeStructureMap();
  const result = [];
  students.forEach(s => {
    if (!paidSet.has(s.id)) {
      const fee = (feeMap[s.className] && feeMap[s.className].monthlyFee) || 0;
      result.push({ studentId: s.id, name: s.name, className: s.className, guardianPhone: s.guardianPhone, dueAmount: fee, month, year });
    }
  });
  return result;
}

// ===================== Exam Fees =====================

/** Exam fee row: [id, studentId, year, term, amount, method, date, receiptNo, createdAt] */

function recordExamFee(payload) {
  validateRequired(payload, ['studentId', 'year', 'term']);
  const sh = getSheet(SHEET_EXAMS);
  const id = generateId('EXM');
  const method = payload.method || 'Cash';
  const dateStr = payload.date || todayString();
  const receiptNo = payload.receiptNo || ('ER-' + Utilities.getUuid().slice(0, 8).toUpperCase());
  const amount = Number(payload.amount) || getExamFeeForStudent(payload.studentId);
  const row = [id, payload.studentId, Number(payload.year), String(payload.term), amount, method, dateStr, receiptNo, new Date()];
  sh.appendRow(row);
  return { ok: true, id, receiptNo, amount, date: dateStr };
}

function getExamFeesByTerm(year, term) {
  const sh = getSheet(SHEET_EXAMS);
  const rows = getRows(sh);
  return rows
    .filter(r => r[2] == year && String(r[3]) === String(term))
    .map(r => ({ id: r[0], studentId: r[1], year: r[2], term: r[3], amount: r[4], method: r[5], date: r[6], receiptNo: r[7] }));
}

// ===================== Reports & Dashboard =====================

function getDashboardSummary() {
  const tz = Session.getScriptTimeZone();
  const todayStr = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const students = getAllStudents();
  const totalStudents = students.length;
  const todayPayments = getPaymentsByDate(todayStr);
  const collectedToday = todayPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  // Month-to-date payments
  const sh = getSheet(SHEET_PAYMENTS);
  const rows = getRows(sh);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const mtd = rows
    .filter(r => r[2] == year && r[3] == month)
    .reduce((sum, r) => sum + Number(r[4] || 0), 0);
  // Estimated outstanding for current month
  const feeMap = getFeeStructureMap();
  const paidSet = new Set(rows.filter(r => r[2] == year && r[3] == month).map(r => r[1]));
  let estimatedOutstanding = 0;
  students.forEach(s => {
    if ((s.status || 'Active') === 'Active' && !paidSet.has(s.id)) {
      estimatedOutstanding += (feeMap[s.className] && feeMap[s.className].monthlyFee) || 0;
    }
  });
  return { totalStudents, collectedToday, monthToDate: mtd, estimatedOutstanding };
}

// ===================== Export / Import / Backup =====================

function exportAllData() {
  return {
    students: getAllStudents(),
    payments: getRows(getSheet(SHEET_PAYMENTS)).map(r => ({ id: r[0], studentId: r[1], year: r[2], month: r[3], amount: r[4], method: r[5], date: r[6], receiptNo: r[7] })),
    examFees: getRows(getSheet(SHEET_EXAMS)).map(r => ({ id: r[0], studentId: r[1], year: r[2], term: r[3], amount: r[4], method: r[5], date: r[6], receiptNo: r[7] })),
    feeStructure: getFeeStructureList(),
  };
}

function importAllData(data) {
  if (!data) throw new Error('No data provided');
  clearAndWrite(SHEET_STUDENTS, ['id','name','className','guardianName','guardianPhone','address','admissionDate','status','createdAt','updatedAt'], (data.students || []).map(s => [
    s.id || generateId('STD'), s.name, s.className, s.guardianName || '', s.guardianPhone || '', s.address || '', s.admissionDate || todayString(), s.status || 'Active', new Date(), ''
  ]));
  clearAndWrite(SHEET_PAYMENTS, ['id','studentId','year','month','amount','method','date','receiptNo','createdAt'], (data.payments || []).map(p => [
    p.id || generateId('PAY'), p.studentId, Number(p.year), Number(p.month), Number(p.amount)||0, p.method||'Cash', p.date||todayString(), p.receiptNo||('RCPT-'+Utilities.getUuid().slice(0,8)), new Date()
  ]));
  clearAndWrite(SHEET_EXAMS, ['id','studentId','year','term','amount','method','date','receiptNo','createdAt'], (data.examFees || []).map(e => [
    e.id || generateId('EXM'), e.studentId, Number(e.year), String(e.term), Number(e.amount)||0, e.method||'Cash', e.date||todayString(), e.receiptNo||('ER-'+Utilities.getUuid().slice(0,8)), new Date()
  ]));
  setFeeStructureList(data.feeStructure || DEFAULT_FEE_STRUCTURE);
  return { ok: true };
}

function createDriveBackup() {
  const data = exportAllData();
  const folder = getOrCreateBackupFolder();
  const blob = Utilities.newBlob(JSON.stringify(data, null, 2), 'application/json', 'backup-' + new Date().toISOString() + '.json');
  const file = folder.createFile(blob);
  return { ok: true, fileId: file.getId(), name: file.getName(), url: file.getUrl() };
}

/** Create a daily time-based trigger to auto backup to Drive */
function enableDailyBackupTrigger() {
  // Remove existing to avoid duplicates
  disableBackupTriggers();
  ScriptApp.newTrigger('createDriveBackup')
    .timeBased()
    .everyDays(1)
    .atHour(3) // 3 AM local time
    .create();
  return { ok: true };
}

/** Remove all triggers pointing to createDriveBackup */
function disableBackupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction && t.getHandlerFunction() === 'createDriveBackup') {
      ScriptApp.deleteTrigger(t);
    }
  });
  return { ok: true };
}

// ===================== Fee Structure =====================

function getFeeStructureMap() {
  const list = getFeeStructureList();
  const map = {};
  list.forEach(it => { map[it.className] = { monthlyFee: it.monthlyFee, examFee: it.examFee }; });
  return map;
}

function getFeeStructureList() {
  const sh = getSheet(SHEET_CONFIG);
  const rows = getRows(sh);
  const result = rows
    .filter(r => r[0] === 'fee' && r[1])
    .map(r => ({ className: r[1], monthlyFee: Number(r[2]) || 0, examFee: Number(r[3]) || 0 }));
  if (result.length === 0) {
    setFeeStructureList(DEFAULT_FEE_STRUCTURE);
    return DEFAULT_FEE_STRUCTURE;
  }
  return result;
}

function setFeeStructureList(list) {
  const sh = getSheet(SHEET_CONFIG);
  // Clear only fee section
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  const filtered = values.filter(r => r[0] !== 'fee');
  const out = filtered.concat(list.map(it => ['fee', it.className, Number(it.monthlyFee)||0, Number(it.examFee)||0]));
  sh.clearContents();
  sh.getRange(1, 1, 1, 4).setValues([headers]);
  if (out.length) sh.getRange(2, 1, out.length, 4).setValues(out);
}

function getMonthlyFeeForStudent(studentId) {
  const s = getAllStudents().find(x => x.id === studentId);
  if (!s) return 0;
  const map = getFeeStructureMap();
  return (map[s.className] && map[s.className].monthlyFee) || 0;
}

function getExamFeeForStudent(studentId) {
  const s = getAllStudents().find(x => x.id === studentId);
  if (!s) return 0;
  const map = getFeeStructureMap();
  return (map[s.className] && map[s.className].examFee) || 0;
}

// ===================== Utilities =====================

function ensureAllSheets(forceHeaders) {
  ensureSheetWithHeaders(SHEET_STUDENTS, ['id','name','className','guardianName','guardianPhone','address','admissionDate','status','createdAt','updatedAt'], forceHeaders);
  ensureSheetWithHeaders(SHEET_PAYMENTS, ['id','studentId','year','month','amount','method','date','receiptNo','createdAt'], forceHeaders);
  ensureSheetWithHeaders(SHEET_EXAMS, ['id','studentId','year','term','amount','method','date','receiptNo','createdAt'], forceHeaders);
  ensureSheetWithHeaders(SHEET_CONFIG, ['type','key','value1','value2'], forceHeaders);
  ensureSheetWithHeaders(SHEET_META, ['key','value'], forceHeaders);
  // Preload default fees if not present
  if (getFeeStructureList().length === 0) setFeeStructureList(DEFAULT_FEE_STRUCTURE);
}

function ensureSheetWithHeaders(name, headers, force) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const lastRow = sh.getLastRow();
  const headerRange = sh.getRange(1, 1, 1, headers.length);
  const existing = headerRange.getValues()[0];
  const needs = force || existing.some((v, i) => String(v).trim() !== headers[i]);
  if (needs) headerRange.setValues([headers]);
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing sheet: ' + name);
  return sh;
}

function getRows(sh) {
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 2 || lastCol === 0) return [];
  return sh.getRange(2, 1, lastRow - 1, lastCol).getValues();
}

function findRowIndexById(sh, id) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return -1;
  const values = sh.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function clearAndWrite(sheetName, headers, rows) {
  const sh = getSheet(sheetName);
  sh.clearContents();
  if (headers && headers.length) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows && rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function getOrCreateBackupFolder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ssFile = DriveApp.getFileById(ss.getId());
  const parent = ssFile.getParents().hasNext() ? ssFile.getParents().next() : DriveApp.getRootFolder();
  const name = ss.getName() + ' Backups';
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function todayString() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function generateId(prefix) {
  const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  return prefix + '-' + ts + '-' + Utilities.getUuid().slice(0, 6);
}

function validateRequired(obj, keys) {
  keys.forEach(k => {
    if (obj[k] === undefined || obj[k] === null || String(obj[k]).trim() === '') {
      throw new Error('Missing required: ' + k);
    }
  });
}

function normalize(s) {
  return String(s || '').trim().toLowerCase();
}

