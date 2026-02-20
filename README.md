# Three-Tier-App
# 🌐 Three-Tier Web Application (React + Node.js + MSSQL) on Azure App Services

## 🧩 Overview
This project is a **three-tier web application** consisting of:
1. **Frontend:** React app served via Node.js Express server  
2. **Backend:** Node.js (Express) API server  
3. **Database:** MSSQL (Microsoft SQL Server or VM)

The app allows users to **sign up**, **log in**, and **view dashboard data**.

---

## ⚙️ Architecture Overview
```scss
Browser (User)
│
▼
**[Frontend App Service - React + Express Proxy]**
│
▼
**[Backend App Service - Node.js + Express API]**
│
▼
**[MSSQL Database]**
```

## ⚙️ Technologies Used
| Layer | Technology | Description |
|--------|-------------|-------------|
| Frontend | React + Express | React UI with Express proxy for backend API calls |
| Backend | Node.js + Express | REST APIs for authentication and DB communication |
| Database | MSSQL | Stores user info and credentials |

---

## 🗂️ Folder Structure
```scss
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
```

# 1.0 🗄️ Database Setup

### 1.1 Connect to SQL server

```sql
-- connect as sa using sqlcmd:
sqlcmd -S <Server-IP> -U sa -P <sa_password>

-- If you’re using Windows Authentication, use:
sqlcmd -S <Server-IP> -E

```

### 1.2 Create a SQL Server login user

```sql

-- Create a new SQL Server login called 'cluster_user'
CREATE LOGIN cluster_user WITH PASSWORD = 'Your_Strong_Password';
GO

-- Add the login to the sysadmin role
EXEC sp_addsrvrolemember 'cluster_user', 'sysadmin';
GO

```

### 1.3 Create test_db database

```sql

CREATE DATABASE test_db;
GO
-- Switch to the new database
USE test_db;
GO

```
### 1.4 Create Table

```sql

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,        -- Auto-incrementing ID
    username NVARCHAR(100) NOT NULL,         -- Username
    email NVARCHAR(100) UNIQUE NOT NULL,     -- Unique email
    password NVARCHAR(255) NOT NULL,         -- Password (hashed)
    created_at DATETIME DEFAULT GETDATE()    -- Current timestamp
);
GO
```

### 1.5 Insert sample data (optional)

```sql

INSERT INTO users (username, email, password)
VALUES 
('user1', 'user1@example.com', 'hashed_password_here'),
('user2', 'user2@example.com', 'hashed_password_here');
GO

```

### 1.6 Verify:

```sql
sqlcmd -S <DB_HOST> -U cluster_user -P <DB_PASSWORD>
```

```sql
-- List all databases in the SQL Server instance
SELECT name AS database_name
FROM sys.databases;
GO

-- Count total number of databases
SELECT COUNT(*) AS total_databases
FROM sys.databases;
GO

USE test_db;
GO

-- List all tables in the current database
SELECT TABLE_SCHEMA, TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Count total number of tables
SELECT COUNT(*) AS total_tables
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
GO


USE test_db;
GO

-- Count the number of rows in the 'users' table
SELECT COUNT(*) AS total_users
FROM users;
GO

-- Optionally, view the first few users
SELECT TOP 10 * FROM users;
GO

```

# 2.0 Backend Setup

### 2.1 Environment Variables (`.env`)

```bash
DB_HOST=xxx.xxx.xxx.xxx
DB_USER=<db-username>
DB_PASSWORD=<db_password>
DB_NAME=test_db
PORT=5000

```
### 2.2 Install & Run Locally

```bash
cd backend
npm install
npm start
```

### 2.3 Verify
```arduino
Visit:
http://localhost:5000

```
OR
```arduino
http://<Backend-server-IP>:5000
```

```json
Should return:

{ "message": "Backend running" }
```

### 2.4 Deploy backend to Azure

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

# 3.0 Frontend Setup
### 3.1 Environment Variables (.env)

```arduino
REACT_APP_BACKEND_URL=http://<Backend-server-IP>:5000
```
OR
```arduino
REACT_APP_BACKEND_URL=https://<backend-app>.centralindia-01.azurewebsites.net
```

### 3.2 Install & Build

```bash
cd frontend
npm install
npm run build
```

### 3.3 Run Locally

```bash
npm start
```

### 3.4 Verify
```arduino
Visit:
http://localhost

```
OR
```arduino
http://<Frontend-server-IP>
```

### 3.5 Deploy Frontend to Azure

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