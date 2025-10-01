# 📌 Nurul Quran Qawmi Madrasa Management System

A complete digital management system for Nurul Quran Qawmi Madrasa with Google Sheets as a real-time database.

## 🎯 Project Overview

This project aims to digitize all daily operations of Nurul Quran Qawmi Madrasa - from student registration to fee collection, reporting, and data backup - all in one real-time platform.

## ✨ Key Features

### 👥 Student Management
- Student registration with detailed form
- Class-wise student listing
- Edit/Delete functionality
- Quick search with pagination
- One-click call feature to guardians

### 💰 Fee Management
- Monthly fee collection with auto-calculation
- Due fee tracking
- Today's payment list
- Auto receipt generation (PDF + Print)
- Payment history

### 📚 Exam Fee Management
- Separate tracking for 1st, 2nd, 3rd exams
- Fee collection system
- Exam fee reports

### 📊 Reports & Dashboard
- Comprehensive dashboard with total students, collections, and dues
- Class-wise analysis
- Visual charts (Chart.js)
- PDF reports for unpaid students (with Bangla font support)

### 💾 Data Management
- Export data (Excel/JSON)
- Import data (restore previous data)
- LocalStorage backup
- Auto-backup to Google Drive
- Real-time sync with Google Sheets

### 🎨 UI/UX
- Fully in Bengali language
- Responsive (Mobile + Desktop)
- Easy grid-based menu
- Smooth transitions and loading animations
- Online/Offline status indicator

## 🏫 Class & Fee Structure

| Class | Monthly Fee | Exam Fee (per exam) |
|-------|-------------|---------------------|
| শিশু জামাত | ১৫০ টাকা | ১৫০ টাকা |
| প্রথম জামাত | ২০০ টাকা | ২০০ টাকা |
| দ্বিতীয় জামাত | ২৫০ টাকা | ২৫০ টাকা |
| তৃতীয় জামাত | ৩০০ টাকা | ৩০০ টাকা |
| হিফজ বিভাগ | ৮০০ টাকা | ৫০০ টাকা |

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern gradients
- **JavaScript (ES6+)** - Core functionality
- **Bootstrap 5** - Responsive framework
- **Font Awesome** - Icons

### Libraries
- **Chart.js** - Data visualization
- **SheetJS (XLSX)** - Excel export
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - PDF tables

### Database
- **Google Sheets** - Main database
- **Google Apps Script** - Backend API
- **LocalStorage** - Offline support

## 📦 Installation & Setup

### Quick Start (3 Steps)

#### Step 1: Create Google Sheets
1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Copy the Spreadsheet ID from URL

#### Step 2: Setup Google Apps Script
1. In your Google Sheet: **Extensions** → **Apps Script**
2. Copy all code from `google-apps-script.js`
3. Replace `YOUR_SPREADSHEET_ID_HERE` with your Spreadsheet ID
4. Save the project

#### Step 3: Deploy Web App
1. Click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy and copy the Web App URL

#### Step 4: Configure HTML
1. Open `index.html` in text editor
2. Find `GOOGLE_SCRIPT_URL` in CONFIG object
3. Replace with your Web App URL
4. Save and open in browser

### Detailed Setup Guide
See [SETUP_GUIDE_BANGLA.md](SETUP_GUIDE_BANGLA.md) for complete step-by-step instructions in Bengali.

## 🚀 Usage

### Adding Students
1. Go to **ছাত্র ব্যবস্থাপনা** (Student Management)
2. Click **নতুন ছাত্র যোগ করুন** (Add New Student)
3. Fill in the form and submit

### Processing Payments
1. Go to **বেতন ব্যবস্থাপনা** (Fee Management)
2. Click **বেতন গ্রহণ করুন** (Collect Fee)
3. Select student and month
4. Submit to generate receipt

### Viewing Reports
1. Go to **রিপোর্ট** (Reports)
2. Click on desired report type
3. Download PDF or Excel

### Data Backup
1. Go to **ডেটা ব্যবস্থাপনা** (Data Management)
2. Click **Excel ডাউনলোড** or **JSON ডাউনলোড**
3. Save file securely

## 📱 Mobile Usage

### Android/iOS
1. Open website in browser
2. Menu → **Add to Home Screen**
3. Use as native app

## 🔐 Security Features

- Offline mode with LocalStorage
- Auto-sync to Google Sheets
- Daily automated backups
- Data validation (prevent duplicates)
- Secure Google Apps Script API

## 📊 Data Structure

### Students Collection
```javascript
{
  id: "STD1234567890",
  name: "Student Name",
  fatherName: "Father Name",
  class: "শিশু জামাত",
  mobile: "01712345678",
  address: "Address",
  admissionDate: "2025-01-01",
  createdAt: "2025-01-01T00:00:00.000Z"
}
```

### Payments Collection
```javascript
{
  id: "PAY1234567890",
  studentId: "STD1234567890",
  month: "2025-01",
  amount: 150,
  date: "2025-01-15",
  createdAt: "2025-01-15T00:00:00.000Z"
}
```

### Exam Payments Collection
```javascript
{
  id: "EXAM1234567890",
  studentId: "STD1234567890",
  examType: "১ম পরীক্ষা",
  amount: 150,
  date: "2025-01-20",
  createdAt: "2025-01-20T00:00:00.000Z"
}
```

## 🔧 Troubleshooting

### Issue: Shows "Offline"
**Solution:**
- Check internet connection
- Verify Google Script URL is correct
- Check Apps Script deployment

### Issue: Data not syncing to Google Sheets
**Solution:**
- Verify Spreadsheet ID is correct
- Check Apps Script permissions
- Open browser console (F12) for errors

### Issue: "Authorization required" error
**Solution:**
- Go to Apps Script Editor
- Run → manualSync
- Re-authorize when prompted

## 🌟 Advanced Features

### Auto Backup Setup
1. In Apps Script Editor, click **Triggers** (clock icon)
2. Add trigger for `dailyBackup` function
3. Set to run daily at 2 AM

### Email Notifications
1. Edit `sendUnpaidNotifications()` function
2. Add your email address
3. Uncomment email sending code

### SMS Integration
1. Get SMS Gateway API (e.g., bangladeshsms.com)
2. Add API code to Apps Script
3. Send auto SMS for due fees

## 📁 File Structure

```
/
├── index.html                 # Main web application (single file)
├── google-apps-script.js      # Backend API code for Google Sheets
├── README.md                  # English documentation
├── SETUP_GUIDE_BANGLA.md      # Bengali setup guide
└── .gitignore                 # Git ignore file
```

## 🤝 Contributing

This is a custom project for Nurul Quran Qawmi Madrasa. For customization or issues:
1. Fork the repository
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

© 2025 Nurul Quran Qawmi Madrasa. All rights reserved.

This project is for internal use only.

## 👨‍💻 Developer Notes

### Adding New Classes
1. Update `FEE_STRUCTURE` in `index.html`
2. Add option in all class dropdowns
3. Update reports accordingly

### Customizing Fee Structure
1. Edit `CONFIG.FEE_STRUCTURE` object
2. Update class fees as needed
3. Save and refresh

### Changing UI Colors
1. Edit CSS `:root` variables
2. Modify `--primary-color`, `--secondary-color`, etc.
3. Update gradient backgrounds

## 📞 Support

For technical support or queries:
- **Email**: support@example.com
- **Phone**: 01XXXXXXXXX

## 🙏 Acknowledgments

- Bootstrap team for responsive framework
- Chart.js for beautiful charts
- Google for Apps Script platform
- Font Awesome for icons

## 🔄 Version History

### Version 1.0.0 (2025-10-01)
- Initial release
- Student management
- Fee management
- Exam fee tracking
- Reports and dashboard
- Google Sheets integration
- Offline support
- Auto backup

---

**Made with ❤️ for Nurul Quran Qawmi Madrasa**

---

## 📚 Quick Links

- [Bengali Setup Guide](SETUP_GUIDE_BANGLA.md)
- [Google Sheets Template](#)
- [Video Tutorial](#)
- [FAQs](#)

---

## ⚡ Performance

- **Load Time**: < 2 seconds
- **Offline Support**: Yes
- **Mobile Responsive**: Yes
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest)

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Student Management
![Students](https://via.placeholder.com/800x400?text=Student+Management+Screenshot)

### Reports
![Reports](https://via.placeholder.com/800x400?text=Reports+Screenshot)

---

## 📝 TODO

- [ ] Teacher management module
- [ ] Multi-year support
- [ ] SMS notifications
- [ ] Firebase real-time sync
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Attendance tracking
- [ ] Result management

---

**Last Updated**: October 1, 2025
