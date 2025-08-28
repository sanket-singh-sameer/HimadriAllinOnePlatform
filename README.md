# HBH - Himadri Boys Hostel All-in-One Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)

A comprehensive digital platform designed specifically for Himadri Boys Hostel at NIT Hamirpur, streamlining hostel management, student services, and administrative operations.

## 🏨 About

HBH Platform is a full-stack web application that serves as a centralized hub for hostel residents and administrators. It facilitates seamless communication, complaint management, academic tracking, and various hostel-related services.

## ✨ Features

### For Students
- *🔐 Secure Authentication*: College email-based registration and login system
- *📝 Complaint Management*: Submit and track maintenance/facility complaints
- *📋 Mess Menu*: Access daily meal schedules and menu information
- *📢 Notice Board*: Stay updated with hostel announcements
- *👤 Profile Management*: Update personal information and change passwords

### For Administrators
- *📊 Dashboard Analytics*: Comprehensive overview of hostel statistics
- *🎛 Complaint Resolution*: Manage and update complaint statuses
- *👥 Student Records*: Search and view student information
- *📝 Notice Management*: Create and manage hostel announcements
- *🍽 Mess Menu Control*: Update and maintain meal schedules
- *📊 CGPI Tracking*: View academic performance records
- *👨‍💼 Role Management*: Admin and committee member access controls

### Technical Features
- *📧 Email Integration*: Automated OTP verification and notifications
- *🔒 JWT Authentication*: Secure token-based authentication system
- *📱 Responsive Design*: Mobile-friendly interface with Tailwind CSS
- *🌓 Role-based Access*: Different access levels for students, committee members, and admins
- *🔄 Real-time Updates*: Live status updates for complaints and notices

## 🛠 Tech Stack

### Backend
- *Node.js* - Runtime environment
- *Express.js* - Web application framework
- *MongoDB* - NoSQL database
- *Mongoose* - ODM for MongoDB
- *JWT* - Authentication tokens
- *bcryptjs* - Password hashing
- *Nodemailer/Resend* - Email services
- *CORS* - Cross-origin resource sharing

### Frontend
- *React 19* - UI framework
- *Vite* - Build tool and development server
- *Tailwind CSS* - Utility-first CSS framework
- *Axios* - HTTP client
- *React Router DOM* - Client-side routing
- *Zustand* - State management
- *React Toaster* - Notifications

### Development Tools
- *Nodemon* - Auto-restart development server
- *Cross-env* - Environment variables

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Gmail/Email service credentials

### Installation

1. *Clone the repository*
   bash
   git clone https://github.com/sanket-singh-sameer/HimadriAllinOnePlatform.git
   cd HBH
   

2. *Install dependencies*
   bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd FRONTEND
   npm install
   cd ..
   

3. *Environment Setup*
   Create a .env file in the root directory:
   env
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Email Service (Choose one)
   # Gmail Configuration
   GMAIL_SMTP_USER=your_gmail@gmail.com
   GMAIL_SMTP_PASS=your_app_password
   
   # Resend Configuration
   RESEND_API_KEY=your_resend_api_key
   
   # Application URLs
   CLIENT_URL=http://localhost:5173
   SUPPORT_URL=https://your-support-url.com
   
   # Environment
   NODE_ENV=development
   PORT=3000
   

4. *Database Setup*
   Ensure MongoDB is running and accessible via the connection string in your .env file.

### Running the Application

#### Development Mode
bash
# Start backend server (from root directory)
npm run dev

# Start frontend development server (in a new terminal)
cd FRONTEND
npm run dev


#### Production Build
bash
# Build and start the application
npm run build
npm start


The application will be available at:
- *Frontend*: http://localhost:5173 (development)
- *Backend API*: http://localhost:3000
- *Production*: http://localhost:3000 (serves both frontend and backend)

## 📁 Project Structure


HBH/
├── package.json                    # Root package configuration
├── README.md                       # Project documentation
├── BACKEND/                        # Backend application
│   ├── server.js                   # Express server entry point
│   ├── config/
│   │   └── connectDB.js           # MongoDB connection
│   ├── controllers/               # Route controllers
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── admin.controller.js    # Admin operations
│   │   ├── complaint.controller.js # Complaint management
│   │   ├── cgpi.controller.js     # Academic records
│   │   ├── messmenu.controller.js # Mess menu operations
│   │   └── notice.controller.js   # Notice management
│   ├── models/                    # Mongoose schemas
│   │   ├── user.model.js         # User schema
│   │   ├── complaint.model.js    # Complaint schema
│   │   ├── cgpi.model.js         # CGPI schema
│   │   ├── messmenu.model.js     # Mess menu schema
│   │   ├── notice.model.js       # Notice schema
│   │   └── rooms.model.js        # Room schema
│   ├── routes/                   # API routes
│   ├── middlewares/              # Custom middleware
│   ├── utils/                    # Utility functions
│   ├── gmail/                    # Email service configuration
│   └── data/                     # Data seeding scripts
└── FRONTEND/                     # React application
    ├── package.json              # Frontend dependencies
    ├── vite.config.js           # Vite configuration
    ├── src/
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   ├── index.css            # Global styles
    │   ├── Components/          # Reusable components
    │   ├── Pages/               # Page components
    │   ├── store/               # State management
    │   └── Utils/               # Utility functions
    └── public/                  # Static assets


## 🔧 API Endpoints

### Authentication
- POST /api/v1/auth/signup - User registration
- POST /api/v1/auth/login - User login
- POST /api/v1/auth/verify-email - Email verification
- POST /api/v1/auth/forgot-password - Password reset request
- POST /api/v1/auth/reset-password/:token - Password reset
- GET /api/v1/auth/logout - User logout

### Complaints
- POST /api/v1/complaints/new - Create complaint
- GET /api/v1/complaints/my - Get user complaints
- GET /api/v1/complaints/all - Get all complaints (admin)
- PUT /api/v1/complaints/:id - Update complaint status

### Admin
- POST /api/v1/admin/login - Admin login
- GET /api/v1/admin/check-auth - Verify admin authentication
- GET /api/v1/admin/ - Admin dashboard

### Additional APIs
- *CGPI*: /api/v1/cgpi/*
- *Mess Menu*: /api/v1/messmenu/*
- *Notices*: /api/v1/notice/*

## 🎯 Usage

### For Students
1. *Registration*: Use your NIT Hamirpur email (@nith.ac.in) to register
2. *Email Verification*: Check your email for OTP verification
3. *Login*: Access your dashboard with verified credentials
4. *Submit Complaints*: Report hostel issues through the complaint system
5. *View Information*: Mess menu, and notices

### For Administrators
1. *Admin Login*: Use admin credentials to access the admin panel
2. *Manage Complaints*: Review, update, and resolve student complaints
3. *Student Records*: Search and view student information
4. *Content Management*: Update notices and mess menus

## 🔒 Security Features

- *Email Verification*: Mandatory NIT Hamirpur email verification
- *Password Hashing*: bcryptjs for secure password storage
- *JWT Tokens*: Secure authentication with HTTP-only cookies
- *Role-based Access*: Different permission levels for users
- *Input Validation*: Server-side validation for all inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow existing code structure and naming conventions
- Add proper error handling and validation
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation when necessary

## 🐛 Known Issues

- Large file uploads may require additional configuration
- Email delivery may be delayed during high traffic
- Mobile responsiveness may need fine-tuning on certain devices

## 🔮 Future Enhancements

- [ ] Mobile application development
- [ ] Real-time chat functionality
- [ ] Room allocation system
- [ ] Fee payment integration
- [ ] Event management system
- [ ] Visitor management
- [ ] Laundry tracking system

## 📝 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 👥 Authors

- *SAM* - Initial Development - [sanket-singh-sameer](https://github.com/sanket-singh-sameer)

## 📞 Support

For support and queries:
- Email: sanketsinghsameer@proton.me
- Repository Issues: [GitHub Issues](https://github.com/sanket-singh-sameer/HimadriAllinOnePlatform/issues)

## 🙏 Acknowledgments

- NIT Hamirpur for providing the platform requirement
- All contributors and testers 
- Open source community for the amazing tools and libraries

---

*Made with ❤ for Himadri Boys Hostel, NIT Hamirpur*
