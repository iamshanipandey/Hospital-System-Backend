# Hospital Management System - Backend API

This is the backend API for the Hospital Management System, a web application for managing hospital operations including patients, doctors, and appointments.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Features
- Patient Management
- Doctor Management
- Appointment Scheduling
- User Authentication and Authorization

## Frontend
The frontend is deployed at: [https://hosptial-system-frontend.vercel.app/](https://hosptial-system-frontend.vercel.app/)

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/iamshanipandey/Hospital-System-Backend.git
cd Hospital-System-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=https://hosptial-system-frontend.vercel.app
CORS_ORIGIN=https://hosptial-system-frontend.vercel.app
```

4. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a specific patient
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor
- `POST /api/doctors` - Create a new doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get a specific appointment
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

## Deployment
This backend is configured for deployment on Vercel using the `vercel.json` configuration.

## License
MIT 