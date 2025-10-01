# Expense Tracker

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)]()
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)]()

## Description

Expense Tracker is a **full-stack MERN** application that helps you manage your expenses and income.  
You can add, edit and delete transactions, view reports and have a clear overview of your personal finances.

## Demo

🔗 [Expense Tracker - Manage your finances easily](https://expense-tracker-frontend-23la.onrender.com)

![Screenshot](/frontend/expense-tracker/public/dashboard.png)

## 🛠️ Tech Stack

**Frontend:**

- React + Vite
- Tailwind CSS
- React Icons
- Recharts (for graphic designers)
- Framer Motion

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (img DB)
- Nodemon
- Postman

## ⚙️ Install

Clone repository:

```bash
git clone https://github.com/giacomopirani/expense-tracker.git
cd expense-tracker

cd backend
npm install
npm run dev

cd frontend/expense-tracker
npm install
npm run dev

## 🔑 Environment variables

Creates a `.env` file in the `backend` folder with:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000


And in the `frontend` folder (if you use variables):

VITE_API_URL=http://localhost:5000/api/v1
```
