# 📚 Nurul Quran Qawmi Madrasa - Complete Setup Guide

## 🎯 Step-by-Step Setup Process

---

## Step 1: Create Google Sheets

### 1.1 Open New Google Sheets
1. Go to: https://sheets.google.com
2. Click **+ Blank** button
3. Name the sheet: **"Nurul Quran Madrasa Database"**

### 1.2 Note the Spreadsheet ID
1. Copy the Spreadsheet ID from the URL
2. URL format will be: 
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit
   ```
3. Here `1a2b3c4d5e6f7g8h9i0` is your **Spreadsheet ID**
4. Save it somewhere safe

---

## Step 2: Setup Google Apps Script

### 2.1 Open Apps Script Editor
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. A new Apps Script project will open

### 2.2 Add Code
1. Go to default `Code.gs` file
2. Delete all existing code
3. Copy entire code from `google-apps-script.js` file
4. Paste in Apps Script Editor

### 2.3 Add Spreadsheet ID
1. Go to line 2 in the code:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
2. Replace `YOUR_SPREADSHEET_ID_HERE` with your Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = '1a2b3c4d5e6f7g8h9i0';
   ```

### 2.4 Save Project
1. Press **Ctrl + S** or click **Save** icon
2. Name the project: **"Madrasa Management API"**

---

## Step 3: Deploy Web App

### 3.1 Deploy
1. In Apps Script Editor, click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Configure settings:
   - **Description**: "Madrasa Management System v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy** button

### 3.2 Grant Permissions
1. Click **Authorize access**
2. Select your Google account
3. Click **Advanced** (if warning appears)
4. Click **Go to [Project Name] (unsafe)**
5. Click **Allow**

### 3.3 Copy Web App URL
1. After deployment, you'll get a **Web app URL**
2. URL format will be:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
3. Copy this **complete URL** and save it

---

## Step 4: Configure HTML Website

### 4.1 Open index.html File
1. Open `index.html` file in a text editor (Notepad, VS Code, etc.)

### 4.2 Add Google Script URL
1. Find the `CONFIG` object near the beginning (around line 250):
   ```javascript
   const CONFIG = {
       GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
       // ...
   };
   ```
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL:
   ```javascript
   const CONFIG = {
       GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby.../exec',
       // ...
   };
   ```

### 4.3 Save File
1. Press **Ctrl + S**
2. File is now saved

---

## Step 5: Test the Website

### 5.1 Test Locally
1. Double-click on `index.html` file
2. Website will open in your browser
3. Add a test student
4. Check if status shows "অনলাইন" (Online)

### 5.2 Check Google Sheets
1. Go back to your Google Sheets
2. You'll see new sheets created:
   - **Students** (student information)
   - **Payments** (fee payments)
   - **Exam Payments** (exam fees)
   - **Metadata** (last sync time)

---

## Step 6: Host Online (Optional)

### Method 1: GitHub Pages (Free)
1. Create a new repository on GitHub
2. Upload `index.html` file
3. Enable GitHub Pages from Settings → Pages
4. Your site will be at: `https://yourusername.github.io/repository-name`

### Method 2: As Google Apps Script Web App
1. In Apps Script Editor, create new HTML file: **File** → **New** → **HTML file**
2. Name it: `index`
3. Copy entire code from `index.html` and paste
4. Modify `doGet()` function:
   ```javascript
   function doGet(e) {
     return HtmlService.createHtmlOutputFromFile('index')
       .setTitle('Nurul Quran Madrasa');
   }
   ```
5. Deploy again (New version)
6. Web App URL is now your website

### Method 3: Netlify/Vercel (Free)
1. Create account on https://www.netlify.com or https://vercel.com
2. Drag and drop `index.html` file
3. Your site goes live instantly

---

## Step 7: Setup Auto Backup

### 7.1 Create Trigger
1. In Apps Script Editor, click **Triggers** icon (clock icon)
2. Click **+ Add Trigger**
3. Configure settings:
   - **Function**: `dailyBackup`
   - **Event source**: Time-driven
   - **Type**: Day timer
   - **Time**: 2am to 3am
4. Click **Save**

### 7.2 Weekly Report (Optional)
1. Add another trigger:
   - **Function**: `generateSummaryReport`
   - **Event source**: Time-driven
   - **Type**: Week timer
   - **Day**: Monday
   - **Time**: 9am to 10am
2. Click **Save**

---

## 📱 Mobile Usage

### Android/iOS
1. Open website in browser
2. Menu → **Add to Home Screen**
3. App icon will be created
4. Use like a mobile app

---

## 🔧 Common Troubleshooting

### Issue 1: Shows "Offline"
**Solution:**
- Check internet connection
- Verify Google Script URL is correct
- Check if Apps Script is deployed properly

### Issue 2: Data not going to Google Sheets
**Solution:**
- Verify Spreadsheet ID is correct
- Check all permissions granted in Apps Script
- Open Browser Console (F12) and check for errors

### Issue 3: "Authorization required" error
**Solution:**
- Go to Apps Script Editor
- Run → `manualSync`
- Grant permissions again

### Issue 4: Showing old data
**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Hard refresh (Ctrl + F5)

---

## 📊 Data Backup Guide

### Manual Backup
1. Go to **Data Management** section
2. Click **Excel Download** or **JSON Download**
3. Save file in secure location

### Backup from Google Sheets
1. Open Google Sheets
2. **File** → **Download** → **Microsoft Excel (.xlsx)**
3. All sheets will download

### Auto Backup
- Runs automatically daily at 2 AM
- Backup stored in Google Drive
- Naming format: `Backup_YYYY-MM-DD_HHMMSS`

---

## 🔐 Security Tips

1. **Keep Apps Script URL confidential**: Anyone with this can access your data
2. **Regular backups**: At least weekly
3. **Use strong Google password**
4. **Enable 2-Factor Authentication**: On Google account

---

## 📞 Support

### Contact
- **Email**: support@example.com
- **Mobile**: 01XXXXXXXXX

### Video Tutorials
- Search on YouTube: "Google Apps Script Web App Tutorial"
- Bengali Tutorial: "গুগল অ্যাপস স্ক্রিপ্ট শিখুন"

---

## ✅ Setup Checklist

Verify everything is set up correctly:

- [ ] Created Google Sheets
- [ ] Copied Spreadsheet ID
- [ ] Pasted code in Apps Script
- [ ] Added Spreadsheet ID to code
- [ ] Deployed Web App
- [ ] Granted all permissions
- [ ] Copied Web App URL
- [ ] Added Web App URL to index.html
- [ ] Tested website
- [ ] Data visible in Google Sheets
- [ ] Setup auto backup trigger

---

## 🎉 Congratulations!

Your **Nurul Quran Qawmi Madrasa Management System** is now fully ready!

---

## 📚 Adding Extra Features

### To Add SMS Notifications:
1. Use an SMS Gateway service (e.g., bangladeshsms.com)
2. Add their API code to Apps Script
3. Send auto SMS for due fees

### To Email Reports:
1. Use `sendUnpaidNotifications()` function in Apps Script
2. Replace `YOUR_EMAIL@example.com` with your email
3. Uncomment the function

### To Add More Classes:
1. Add new class to `FEE_STRUCTURE` object in `index.html`
2. Add new `<option>` in all dropdowns

---

## 🌟 Advanced Configuration

### Custom Fee Structure
Edit in `index.html`:
```javascript
FEE_STRUCTURE: {
    'New Class Name': { monthly: 500, exam: 300 }
}
```

### Change UI Colors
Edit CSS variables in `index.html`:
```css
:root {
    --primary-color: #2c5f2d;
    --secondary-color: #97bc62;
}
```

### Modify Items Per Page
```javascript
ITEMS_PER_PAGE: 20  // Change from 10 to 20
```

---

## 📖 Understanding the Code Structure

### Main Sections in index.html
1. **Configuration** (Line ~250): All settings
2. **Data Storage** (Line ~270): Student, payment data
3. **Navigation** (Line ~290): Section switching
4. **Student Management** (Line ~310): Add, edit, delete
5. **Fee Management** (Line ~450): Payment processing
6. **Reports** (Line ~600): Report generation
7. **Google Sheets Sync** (Line ~750): Database operations

### Apps Script Functions
- `doPost()`: Handle incoming data
- `doGet()`: Send data to web app
- `syncData()`: Save to Google Sheets
- `loadData()`: Load from Google Sheets
- `dailyBackup()`: Auto backup
- `sendUnpaidNotifications()`: Email alerts

---

## 🚀 Performance Optimization

### Speed Tips
1. **Cache data**: Use LocalStorage
2. **Lazy loading**: Load images on demand
3. **Minify code**: Remove comments and whitespace
4. **CDN**: Use CDN for libraries

### Data Limits
- **Google Sheets**: 10 million cells max
- **Apps Script**: 6 min execution time
- **LocalStorage**: 5-10 MB limit

---

## 🔄 Update Guide

### Updating the Web App
1. Make changes to `index.html`
2. Save file
3. If hosted online, re-upload
4. Clear browser cache

### Updating Apps Script
1. Edit code in Apps Script Editor
2. Save changes
3. **Deploy** → **Manage deployments**
4. Click **Edit** (pencil icon)
5. Change version: **New version**
6. Click **Deploy**

---

## 📝 Best Practices

1. **Backup before major changes**
2. **Test with dummy data first**
3. **Keep records of all IDs and URLs**
4. **Regular data validation**
5. **Monitor Apps Script quota**
6. **Document custom changes**

---

**Note**: Read this guide carefully for any issues. 99% of problems have solutions in this guide!

---

## 🆘 Emergency Recovery

### If you lose all data:
1. Check Google Sheets backup
2. Check Google Drive for auto-backups
3. Use browser localStorage (inspect → Application → Local Storage)
4. Restore from JSON/Excel export

### If Apps Script stops working:
1. Check quota limits
2. Re-deploy with new version
3. Check trigger settings
4. Verify permissions

---

**Last Updated**: October 1, 2025

**Version**: 1.0.0
