# 🔧 সমস্যা সমাধান গাইড (Troubleshooting Guide)

## 📋 সূচিপত্র

1. [সংযোগ সমস্যা](#সংযোগ-সমস্যা)
2. [ডেটা সিঙ্ক সমস্যা](#ডেটা-সিঙ্ক-সমস্যা)
3. [অনুমতি সমস্যা](#অনুমতি-সমস্যা)
4. [ব্রাউজার সমস্যা](#ব্রাউজার-সমস্যা)
5. [পারফরম্যান্স সমস্যা](#পারফরম্যান্স-সমস্যা)
6. [Apps Script সমস্যা](#apps-script-সমস্যা)

---

## সংযোগ সমস্যা

### সমস্যা: "অফলাইন" স্ট্যাটাস দেখাচ্ছে

#### কারণ ১: ইন্টারনেট সংযোগ নেই
**সমাধান:**
```
✓ Wi-Fi/মোবাইল ডেটা চেক করুন
✓ অন্য ওয়েবসাইট খুলে দেখুন
✓ রাউটার রিস্টার্ট করুন
```

#### কারণ ২: Google Script URL ভুল
**সমাধান:**
```javascript
// index.html এ চেক করুন:
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/...',
    // URL সঠিক আছে কিনা নিশ্চিত করুন
};
```

#### কারণ ৩: Apps Script Deploy হয়নি
**সমাধান:**
1. Apps Script Editor খুলুন
2. Deploy → Manage deployments চেক করুন
3. Status: Active আছে কিনা দেখুন

---

## ডেটা সিঙ্ক সমস্যা

### সমস্যা: ডেটা Google Sheets-এ যাচ্ছে না

#### ডায়াগনসিস: Browser Console চেক করুন
```
1. F12 চাপুন (অথবা Right Click → Inspect)
2. Console ট্যাব খুলুন
3. Error মেসেজ পড়ুন
```

#### সমাধান ১: CORS Error
```javascript
// Apps Script-এ doPost ফাংশন চেক করুন:
function doPost(e) {
  // mode: 'no-cors' ব্যবহার করতে হবে
}
```

#### সমাধান ২: Spreadsheet ID ভুল
```javascript
// google-apps-script.js এ চেক করুন:
const SPREADSHEET_ID = 'আপনার_সঠিক_ID';
// ভুল ID = ডেটা সেভ হবে না
```

#### সমাধান ৩: Manual Sync চালান
```javascript
// Apps Script Editor-এ:
1. manualSync ফাংশন সিলেক্ট করুন
2. Run বাটন ক্লিক করুন
3. Logs চেক করুন
```

### সমস্যা: পুরানো ডেটা দেখাচ্ছে

**সমাধান:**
```
1. Ctrl + Shift + Delete (Cache Clear)
2. Ctrl + F5 (Hard Refresh)
3. Browser রিস্টার্ট করুন
4. LocalStorage ক্লিয়ার করুন:
   - F12 → Application → Local Storage → Clear All
```

---

## অনুমতি সমস্যা

### সমস্যা: "Authorization Required" Error

#### সমাধান ধাপে ধাপে:
```
1. Apps Script Editor খুলুন
2. manualSync ফাংশন চালান
3. Review Permissions ক্লিক করুন
4. আপনার Google Account নির্বাচন করুন
5. Advanced → Go to [Project] ক্লিক করুন
6. Allow সব permissions দিন
```

### সমস্যা: "Access Denied" to Spreadsheet

**সমাধান:**
```
1. Google Sheets খুলুন
2. Share বাটনে ক্লিক করুন
3. নিজের email যোগ করুন (Editor access)
4. Apps Script থেকে আবার চেষ্টা করুন
```

---

## ব্রাউজার সমস্যা

### সমস্যা: পেজ লোড হচ্ছে না

#### Chrome এ সমাধান:
```
1. Extensions Disable করুন (Ctrl+Shift+E)
2. Incognito Mode-এ চালান (Ctrl+Shift+N)
3. Chrome Update করুন
```

#### Firefox এ সমাধান:
```
1. about:config → dom.storage.enabled = true
2. Privacy Settings → Accept Cookies সক্রিয় করুন
3. Firefox Update করুন
```

### সমস্যা: LocalStorage কাজ করছে না

**সমাধান:**
```javascript
// Browser Console-এ টেস্ট করুন:
localStorage.setItem('test', 'hello');
console.log(localStorage.getItem('test'));

// Error আসলে:
1. Private/Incognito mode বন্ধ করুন
2. Cookie settings চেক করুন
3. Browser cache clear করুন
```

---

## পারফরম্যান্স সমস্যা

### সমস্যা: ওয়েবসাইট স্লো চলছে

#### বড় ডেটাসেট (১০০০+ ছাত্র)
**সমাধান:**
```javascript
// index.html এ pagination বাড়ান:
CONFIG.ITEMS_PER_PAGE = 20  // 10 থেকে 20
```

#### অনেক ছবি/ফাইল
**সমাধান:**
```
1. ছবি compress করুন
2. Lazy loading ব্যবহার করুন
3. CDN ব্যবহার করুন libraries-এর জন্য
```

### সমস্যা: Apps Script Timeout

**লক্ষণ:**
```
Error: Exceeded maximum execution time
```

**সমাধান:**
```javascript
// ডেটা chunks-এ প্রসেস করুন:
function syncDataInBatches() {
  const BATCH_SIZE = 100;
  // Process 100 rows at a time
}
```

---

## Apps Script সমস্যা

### সমস্যা: Script Won't Save

**সমাধান:**
```
1. Check Gmail storage quota
2. Sign out and sign in to Google
3. Use different browser
4. Check Apps Script service status
```

### সমস্যা: Trigger Not Running

**ডায়াগনসিস:**
```
1. Apps Script → Triggers (clock icon)
2. Executions ট্যাব চেক করুন
3. Failed runs দেখুন
```

**সমাধান:**
```
1. Trigger delete করে আবার তৈরি করুন
2. Function name সঠিক আছে কিনা চেক করুন
3. Script authorization চেক করুন
```

### সমস্যা: Quota Exceeded

**লক্ষণ:**
```
Error: Service invoked too many times in one day
```

**সমাধান:**
```
1. Apps Script Dashboard → Quotas দেখুন
2. Sync frequency কমান (প্রতি ৫ মিনিট → প্রতি ১৫ মিনিট)
3. LocalStorage বেশি ব্যবহার করুন
4. Manual sync করুন গুরুত্বপূর্ণ ডেটার জন্য
```

---

## সাধারণ Error Messages

### Error: "Cannot read property 'id' of undefined"

**কারণ:** Student data লোড হয়নি

**সমাধান:**
```javascript
// Check if students array is populated:
console.log(students.length);

// If 0, load from localStorage:
students = JSON.parse(localStorage.getItem('students') || '[]');
```

### Error: "Failed to fetch"

**কারণ:** Network request failed

**সমাধান:**
```
1. Internet connection check করুন
2. Google Apps Script URL verify করুন
3. CORS settings check করুন
```

### Error: "JSON.parse: unexpected character"

**কারণ:** Invalid JSON data

**সমাধান:**
```javascript
// Data validate করুন:
try {
  JSON.parse(data);
} catch(e) {
  console.error('Invalid JSON:', e);
  // Clear corrupted data
  localStorage.removeItem('students');
}
```

---

## Emergency Recovery

### সব ডেটা হারিয়ে গেলে:

#### পদ্ধতি ১: Google Sheets থেকে পুনরুদ্ধার
```
1. Google Sheets খুলুন
2. Students sheet থেকে ডেটা কপি করুন
3. Website → Data Management → Import করুন
```

#### পদ্ধতি ২: LocalStorage থেকে
```
1. F12 → Application → Local Storage
2. 'students' key খুঁজুন
3. Value কপি করে save করুন
4. Import feature ব্যবহার করুন
```

#### পদ্ধতি ৩: Auto Backup থেকে
```
1. Google Drive খুলুন
2. "Backup_" দিয়ে search করুন
3. সবচেয়ে নতুন backup খুলুন
4. Data copy করুন
```

---

## Debug Mode চালু করুন

### Step 1: Console Logging Enable করুন
```javascript
// index.html এ যোগ করুন:
const DEBUG = true;

function log(message) {
  if (DEBUG) console.log(message);
}

// ব্যবহার:
log('Student added:', student);
```

### Step 2: Network Monitoring
```
1. F12 → Network tab
2. Filter: XHR
3. প্রতিটি sync request দেখুন
4. Response check করুন
```

### Step 3: Apps Script Logging
```javascript
// Apps Script-এ:
Logger.log('Data received:', data);

// Logs দেখার জন্য:
View → Logs (Ctrl+Enter)
```

---

## Performance Checklist

```
✓ Browser cache clear করেছেন?
✓ Latest browser version ব্যবহার করছেন?
✓ Internet speed test করেছেন?
✓ LocalStorage quota check করেছেন?
✓ Apps Script quota check করেছেন?
✓ Too many browser tabs open নেই তো?
✓ Background apps close করেছেন?
```

---

## পরীক্ষিত সমাধান

### সমস্যা: Bangla Font দেখাচ্ছে না

**সমাধান:**
```html
<!-- index.html এ এই font import আছে কিনা চেক করুন: -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali" rel="stylesheet">
```

### সমস্যা: PDF Generation Failed

**সমাধান:**
```javascript
// jsPDF library ঠিকমতো load হয়েছে কিনা:
console.log(typeof jsPDF);  // Should be 'function'

// CDN link check করুন:
// https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

### সমস্যা: Export না হচ্ছে

**সমাধান:**
```javascript
// XLSX library check:
console.log(typeof XLSX);  // Should be 'object'

// Pop-up blocker disable করুন
// Download folder permission check করুন
```

---

## যোগাযোগ

এখনও সমাধান পাচ্ছেন না?

📧 **Email**: support@example.com  
📱 **Mobile**: 01XXXXXXXXX  
📖 **Documentation**: [README.md](README.md)

---

## Useful Commands

### Browser Console Commands:
```javascript
// সব students দেখুন:
console.table(students);

// LocalStorage দেখুন:
console.log(localStorage);

// Clear করুন:
localStorage.clear();

// Specific key মুছুন:
localStorage.removeItem('students');
```

### Apps Script Debug:
```javascript
// Manual test:
function testSync() {
  const testData = {
    action: 'sync',
    students: [{id: 'TEST', name: 'Test Student'}],
    payments: [],
    examPayments: []
  };
  
  syncData(testData);
  Logger.log('Test completed');
}
```

---

**শেষ আপডেট**: অক্টোবর ১, ২০২৫

**মনে রাখবেন**: বেশিরভাগ সমস্যার সমাধান এই গাইডে আছে। ধৈর্য ধরে প্রতিটি ধাপ অনুসরণ করুন।
