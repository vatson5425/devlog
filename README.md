# DevLog — Full-Stack Blogging Platform

DevLog is a responsive full-stack blogging platform developed as part of my internship at **Codomax Digital Solutions**. It allows users to register, log in, create articles, upload cover images, view blog details, and manage their own content.

## Features

- User registration and login
- JWT-based authentication
- Create and manage blog articles
- Blog categories and article listings
- Individual blog details pages
- Article cover image support
- Creator dashboard
- User-specific article management
- Responsive interface for desktop and mobile
- MongoDB database integration

## Tech Stack

**Frontend:** HTML5, CSS3, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JSON Web Tokens (JWT)  
**Deployment:** Netlify (frontend), Render (backend)

## Project Links

- **GitHub Repository:** https://github.com/vatson5425/devlog
- **Live Website:** https://precious-douhua-ac6efe.netlify.app
- **Backend API:** https://devlog-api.onrender.com (deploy to Render — set env vars in dashboard)

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/vatson5425/devlog.git
cd devlog
```

### 2. Run the frontend

Serve the project root using a local static server, such as:

```bash
npx serve .
```

Open the local URL provided by the server.

### 3. Run the backend

Open a separate terminal:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with your own configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Start the backend using the available npm script:

```bash
npm run dev
```

Make sure your frontend API configuration points to your local backend when testing locally.

## Project Purpose

This project helped me gain practical experience in frontend development, REST API integration, authentication, database connectivity, and deployment.

## Internship

Developed as part of my internship at **Codomax Digital Solutions**.