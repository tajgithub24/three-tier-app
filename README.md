# three-tier-app
# 🌐 Three-Tier Web Application (React + Node.js + MySQL) on Azure App Services

## 🧩 Overview
This project is a **three-tier web application** consisting of:
1. **Frontend:** React app served via Node.js Express server  
2. **Backend:** Node.js (Express) API server  
3. **Database:** MySQL (Azure Flexible Server or VM)

The app allows users to **sign up**, **log in**, and **view dashboard data**.

---

## ⚙️ Architecture Overview

Browser (User)
│
▼
**[Frontend App Service - React + Express Proxy]**
│
▼
**[Backend App Service - Node.js + Express API]**
│
▼
**[Azure MySQL Database]**

---

## ⚙️ Technologies Used
| Layer | Technology | Description |
|--------|-------------|-------------|
| Frontend | React + Express | React UI with Express proxy for backend API calls |
| Backend | Node.js + Express | REST APIs for authentication and DB communication |
| Database | MySQL | Stores user info and credentials |

---

## 🗂️ Folder Structure

root/
│
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── components/
│ │ │ └── Dashboard.js
│ │ └── api.js
│ ├── build/
│ ├── server.js # Express proxy + static React build server
│ ├── package.json
│ └── .env
│
└── backend/
├── index.js # Express API
├── package.json
└── .env

### 🗄️ Database Setup
Create test_db database
```sql
CREATE DATABASE test_db;
USE test_db;
```
Create Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Verify:
```bash
mysql -h <DB_HOST> -u <DB_USER> -p
USE test_db;
SELECT * FROM users;
```

## 🔧 Backend Setup

### Environment Variables (`.env`)
```bash
DB_HOST=xxx.xxx.xxx.xxx
DB_USER=<db-username>
DB_PASSWORD=<db_password>
DB_NAME=test_db
PORT=5000
```
### Install & Run Locally
```bash
cd backend
npm install
npm start
```

### Verify
```arduino
Visit:

http://localhost:5000

```

```json
Should return:

{ "message": "Backend running" }
```

### Deploy backend to Azure

Zip backend folder and deploy to a Node.js App Service.

```bash
cd backend
zip -r backend.zip .
az webapp deploy --resource-group <resource-group-name> --name <backend-app-name> --src-path backend.zip
```

Access:

```bash
https://<backend-app>.azurewebsites.net
```

## 💻 Frontend Setup
### Environment Variables (.env)

```bash
REACT_APP_BACKEND_URL=https://<backend-app>.centralindia-01.azurewebsites.net
```

### Install & Build

```bash
cd frontend
npm install
npm run build
```
### Deploy Frontend to Azure

Zip frontend folder and deploy to a Node.js App Service.

```bash
cd frontend
zip -r frontend.zip .
az webapp deploy --resource-group <resource-group-name> --name <frontend-app-name> --src-path frontend.zip
```

Access:

```bash
https://<frontend-app>.azurewebsites.net
```

Note:
Backend should have CORS enabled if directly accessed by browser.