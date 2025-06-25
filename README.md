# Engineering Resource Management System - Frontend

A modern, responsive React frontend for managing engineering team assignments across projects. Built with React 18, TypeScript, Tailwind CSS, and modern development practices.

## 🚀 Features

### Authentication System
- **Login/Signup**: Secure authentication with JWT tokens
- **Role-based Access**: Manager and Engineer roles with different permissions
- **Protected Routes**: Automatic redirection for unauthorized access
- **Token Management**: Automatic token refresh and logout on expiry

### Manager Dashboard
- **Team Overview**: Visual capacity utilization for all engineers
- **Project Management**: Create, edit, and manage projects
- **Assignment Management**: Assign engineers to projects with capacity validation
- **Analytics**: Team utilization charts and project analytics
- **Engineer Search**: Find suitable engineers based on skills and availability

### Engineer Dashboard
- **Personal Overview**: Current assignments and workload
- **Capacity Tracking**: Visual representation of personal utilization
- **Assignment Timeline**: Upcoming projects and deadlines
- **Profile Management**: Update skills and personal information

### Key Components
- **Capacity Bars**: Color-coded progress bars showing utilization
- **Status Badges**: Visual indicators for project and assignment status
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and validation

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form components
│   ├── charts/          # Chart and analytics components
│   └── layout/          # Layout components (Sidebar, Header)
├── pages/
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   ├── projects/        # Project management pages
│   ├── assignments/     # Assignment management pages
│   └── profile/         # Profile management pages
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── context/             # React Context providers
├── utils/               # Utility functions and helpers
└── types/               # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:5000` (or update API_BASE_URL in `src/services/api.ts`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000'; // Your backend URL
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📊 API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /profile` - Get user profile

### Engineers
- `GET /getAllEngineers` - Get all engineers
- `GET /engineer/:id/capacity` - Get engineer capacity
- `PUT /engineerProfile/:id` - Update engineer profile
- `POST /getSuitableEngineer` - Find suitable engineers

### Projects
- `GET /getAllproject` - Get all projects
- `GET /getProject/:id` - Get specific project
- `POST /createProject` - Create new project
- `PUT /updateProject/:id` - Update project
- `DELETE /delete/:id` - Delete project

### Assignments
- `GET /getAllAssignment` - Get all assignments
- `POST /createAssignment` - Create assignment
- `PUT /updateAssignment/:id` - Update assignment
- `DELETE /deleteAssignment/:id` - Delete assignment

### Analytics
- `GET /analytics/utilization` - Get utilization analytics
- `GET /timeline` - Get assignment timeline

## 🎨 UI Components

### CapacityBar
Visual progress bar showing capacity utilization with color coding:
- Green: <50% utilization
- Yellow: 50-80% utilization  
- Orange: 80-100% utilization
- Red: >100% utilization (overallocated)

### StatusBadge
Status indicators for projects and assignments:
- Planning: Blue
- Active: Green
- Completed: Gray

### LoadingSpinner
Loading indicators for async operations with different sizes and colors.

## 🔐 Authentication Flow

1. **Login**: User enters credentials → JWT token stored in localStorage
2. **Protected Routes**: Token validated on each request
3. **Auto-logout**: Token expiry triggers automatic logout
4. **Role-based Access**: Different dashboards based on user role

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Collapsible Sidebar**: Hidden on mobile, toggleable
- **Touch-friendly**: Large touch targets and gestures
- **Adaptive Layout**: Responsive grids and flexible components

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 🚀 Deployment

### Build the Application
```bash
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

### Environment Variables for Production
Set the following environment variables:
- `VITE_API_BASE_URL` - Your production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for efficient engineering resource management**
