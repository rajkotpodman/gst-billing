# ⚙️ GST Billing System — Backend REST API Server

> **Academic Project Submission**  
> **Student Developer**: Jigsi Karia (`Jigsi_karia@jigsikaria.com`)  
> **University**: Gujarat University, Ahmedabad  
> **Project**: Cloud GST Billing & Inventory Management System  

---

## 🌟 Overview

The **GSTBilling PRO Backend** is a scalable Node.js & Express RESTful API server. It provides authentication, role-based access control (RBAC), statutory Indian GST tax calculations, PDF generation via `PDFKit`, email dispatch, and resilient MongoDB data management.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Verify `.env`:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gst-billing
JWT_SECRET=super-secure-jwt-secret-key-jigsi-karia-gst-billing-system-2026!
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```

> **Zero-Config Database Fallback**:  
> If local MongoDB is not running, the server automatically starts an internal In-Memory MongoDB instance and seeds demo data on the fly!

### 4. Seed Database (Optional Manual Run)
```bash
npm run seed
```

---

## 🔑 Pre-Configured Test Accounts

- **Owner**: `Jigsi_karia@jigsikaria.com` | Password: `Jigsi@karia`
- **Admin**: `karia_jigsi@jigsikaria.com` | Password: `Jigsi@karia`
- **Staff**: `staff@jigsikaria.com`       | Password: `Jigsi@karia`

---

## 📡 API Endpoint Summary

- **Health Check**: `GET /api/health`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Invoices**: `GET /api/bills`, `POST /api/bills`, `GET /api/bills/:id/pdf`, `POST /api/bills/:id/email`
- **Catalog**: `GET|POST|PUT|DELETE /api/items`
- **Customers**: `GET|POST|PUT|DELETE /api/parties`
- **Shop Profile**: `GET|PUT /api/shop`
- **Team**: `GET|POST|PUT|DELETE /api/users`
- **Dashboard Analytics**: `GET /api/dashboard/summary`
