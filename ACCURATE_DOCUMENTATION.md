# CA Admin - Accurate Project Documentation

## Project Overview
CA Admin is a comprehensive administrative dashboard built with React.js, designed to manage company operations, HR functions, and employee management. The application features role-based access control, real-time data visualization, and comprehensive reporting capabilities.

## Technology Stack

### Core Technologies
- **React**: ^18.3.1
- **React DOM**: ^18.3.1
- **React Router DOM**: ^6.26.2
- **Redux Toolkit**: ^2.2.7 (State Management)
- **Axios**: ^1.7.7 (HTTP Client)
- **React Hook Form**: ^7.53.1 (Form Handling)
- **React Scripts**: 5.0.1 (Build Tooling)

### UI Components & Styling
- **Ant Design**: ^5.23.2 (UI Component Library)
- **React Bootstrap**: ^2.10.5
- **AdminLTE**: ^4.0.0-beta2 (Admin Template)
- **Tailwind CSS**: ^3.4.13 (Utility-first CSS)
- **Font Awesome**: ^6.7.2 (Icons)
- **Swiper**: ^11.2.0 (Touch Slider)

### Data Visualization
- **Chart.js**: ^4.4.6
- **React Chart.js 2**: ^5.2.0
- **Recharts**: ^3.1.2

### Date & Time
- **dayjs**: ^1.11.13
- **moment**: ^2.30.1
- **react-date-picker**: ^11.0.0
- **react-datepicker**: ^7.5.0

### Document Generation
- **jspdf**: ^2.5.2
- **jspdf-autotable**: ^5.0.2
- **exceljs**: ^4.4.0
- **file-saver**: ^2.0.5

### Other Key Dependencies
- **socket.io-client**: ^4.8.0 (Real-time updates)
- **sweetalert2**: ^11.21.0 (Beautiful alerts)
- **react-big-calendar**: ^1.18.0 (Calendar component)
- **react-otp-input**: ^3.1.1 (OTP verification)
- **crypto-js**: ^4.2.0 (Encryption)

## Project Structure

```
ca-admin/
├── public/                     # Static assets
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # Favicon
│   └── robots.txt              # Search engine instructions
│
├── src/                        # Source code
│   ├── GlobalContext/          # React context providers
│   │
│   ├── component/              # Reusable UI components
│   │   ├── AccessDenied/       # Access denied component
│   │   ├── AddressComponent/   # Address input component
│   │   ├── CustomPagination/   # Pagination controls
│   │   ├── CustomSelect/       # Custom select component
│   │   ├── HRMSComponent/      # HR Management System components
│   │   │   └── HRMSDashboard/  # HR Dashboard components
│   │   │       └── HRMSEventCalander/  # Event calendar
│   │   ├── InputBox/           # Form input components
│   │   ├── Label/              # Form label components
│   │   ├── LoginDetails/       # Login related components
│   │   ├── NoticeBoardModal/   # Notice board component
│   │   ├── PasswordInput/      # Password field component
│   │   ├── Profile/            # User profile components
│   │   ├── footer/             # Application footer
│   │   ├── header/             # Application header
│   │   └── sidebar/            # Navigation sidebar
│   │
│   ├── config/                 # Configuration files
│   │
│   ├── constents/              # Application constants
│   │
│   ├── global_layouts/         # Global layout components
│   │   ├── BankNamePicker/     # Bank selection component
│   │   ├── BreadCrumb/         # Navigation breadcrumbs
│   │   ├── Card/               # Card component
│   │   ├── CustomNotification/ # Notification system
│   │   ├── DatePicker/         # Date picker component
│   │   ├── GlobalLayout/       # Main layout wrapper
│   │   ├── ImageUploader/      # Image upload component
│   │   ├── ImageViewrModal/    # Image viewer
│   │   ├── Loader/             # Loading spinner
│   │   ├── MobileCode/         # Mobile verification
│   │   ├── Modal/              # Modal dialog
│   │   ├── TimerPicker/        # Time selection
│   │   ├── Tooltip/            # Tooltip component
│   │   └── pageHeader/         # Page header component
│   │
│   ├── pages/                  # Application pages
│   │   ├── Director/           # Director dashboard
│   │   │   └── director/
│   │   │       └── DirectorFeatures/  # Director features
│   │   ├── DyanmicSidebar/     # Dynamic sidebar pages
│   │   │   └── DyanmicSidebarFeatures/
│   │   ├── EmployeePenaltie/   # Employee penalties
│   │   │   └── employeePenaltyFeatures/
│   │   ├── Error/              # Error pages
│   │   ├── Holiday/            # Holiday management
│   │   └── PreSalesManagement/ # Pre-sales features
│   │       └── LeadsManagement/
│   │           └── LeadmanagementFeature/
│   │
│   ├── redux/                  # Redux store configuration
│   │
│   ├── routers/                # Application routes
│   │
│   ├── App.css                 # Global styles
│   ├── App.js                  # Root component
│   ├── App.test.js             # Test file
│   ├── formclasses.css         # Form styles
│   ├── index.css               # Global styles
│   ├── index.js                # Application entry point
│   ├── logo.svg                # Application logo
│   └── reportWebVitals.js      # Performance monitoring
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies
├── package-lock.json           # Dependency lock file
├── README.md                   # Project readme
└── tailwind.config.js          # Tailwind CSS configuration
```

#### Google Maps API Access
- **Gmail:** vieasyprivatelimited@gmail.com  
- **Password:** India22@ 

> 📌 *Note: Ensure API key restrictions are configured in the Google Cloud Console for security.*


### User Roles and Access
1. **Admin**
   - Full system access
   - User management
   - System configuration

2. **Director**
   - Company-wide overview
   - Performance metrics
   - High-level reporting

3. **HR Manager**
   - Employee management
   - Attendance tracking
   - Leave management

4. **Employee**
   - Personal dashboard
   - Leave requests
   - Profile management

### Admin Accounts
1. **Admin 1**
   - Email: easymyoffice@mailinator.com
   - Password: 123456

2. **Admin 2**
   - Email: admin@vigorous.com
   - Password: 123456

### Company Accounts
1. **Company 1**
   - Email: vipinsinghal22@yahoo.com
   - Password: India22@

2. **Company 2**
   - Email: vigorousittech@gmail.com
   - Password: hiteshshubham

### Branch Account
- Email: vigorousitheadoffice@gmail.com
- Password: hiteshshubham

### Employee Accounts
1. **HR**
   - Email: SJE_KS_0081
   - Password: wMeBv0Gk1H5U

2. **Manager 1**
   - Email: SJC_AT_0011
   - Password: Aparna@1510

3. **Manager 2**
   - Email: SJC_EJ_0035
   - Password: sakshi@12345

## Key Features

### 1. HR Management System
- Employee onboarding
- Attendance tracking
- Leave management
- Performance reviews

### 2. Document Management
- File upload/download
- Document templates
- Version control

### 3. Reporting
- Custom report generation
- Data export (PDF, Excel)
- Analytics dashboard

### 4. Real-time Updates
- Socket.io integration
- Live notifications
- Activity feeds

## Development Setup

### Prerequisites
- Node.js (v16+)
- npm (v8+)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the development server:
   ```bash
   npm start
   ```

## Build & Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Required environment variables (`.env`):
```
REACT_APP_API_URL=your_api_url
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```




## State Management

The application uses Redux Toolkit for state management with the following slices:

### Auth Slice
- Manages authentication state
- Handles login/logout
- Stores user session

### Employee Slice
- Manages employee data
- Handles CRUD operations
- Manages employee state

### UI Slice
- Manages UI state
- Handles loading states
- Manages notifications

## Security Considerations

### Authentication
- JWT-based authentication
- Secure token storage
- Token refresh mechanism

### Data Protection
- Input validation
- XSS protection
- CSRF protection

## Performance Optimization

### Code Splitting
- React.lazy for route-based code splitting
- Dynamic imports for large components

### Image Optimization
- Lazy loading of images
- Responsive images
- Image compression

### Bundle Optimization
- Tree shaking
- Code splitting
- Minification

## Troubleshooting

### Common Issues
1. **API Connection Issues**
   - Verify API URL in .env
   - Check network connectivity
   - Verify CORS configuration

2. **Authentication Problems**
   - Clear browser storage
   - Verify token validity
   - Check session expiration


