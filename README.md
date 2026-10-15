# 🏢 Cloud GST Billing & Inventory Management System (GSTBilling PRO)

> **Academic Project Submission**  
> **Student Name**: Jigsi Karia  
> **Email**: Jigsi_karia@jigsikaria.com  
> **University**: Gujarat University  
> **Department**: Department of Computer Science & Information Technology  
> **Academic Year**: 2025 – 2026  

---

## 📌 Executive Overview

The **Cloud GST Billing & Inventory Management System (GSTBilling PRO)** is a full-stack, enterprise-grade enterprise resource and invoicing solution designed to simplify statutory Goods and Services Tax (GST) compliance for Indian micro, small, and medium businesses (MSMEs). 

Developed with a modern decoupled client-server architecture, the platform automates state-wise GST calculations (Intra-State CGST + SGST vs. Inter-State IGST), customer ledgers, inventory catalogs with HSN codes, downloadable statutory PDF tax invoices, team role-based access control (RBAC), and an embedded AI business strategist assistant.

---

## 🌟 Key Functional Highlights

### 1. 🔐 Role-Based Access Control (RBAC) & Authentication
- **Multi-Tier User Hierarchy**:
  - **OWNER**: Full administrative control over enterprise profile, GSTIN configuration, staff creation, catalog management, and revenue analytics.
  - **ADMIN**: Manages products, customers, and invoice generation with complete reporting visibility.
  - **STAFF**: Fast-access billing desk for creating invoices, registering customers, and viewing inventory.
- **Enterprise Security**:
  - Secure passwords salted and hashed via `bcryptjs` (cost factor 12).
  - Stateless JSON Web Tokens (JWT) transmitted via secure, HTTP-only cookie mechanisms.
  - Granular route guards (`ProtectedRoute`, `RoleRoute`) both on the client and Express server middleware.

### 2. 🧾 Intelligent Indian GST Invoicing Engine
- **Automated Intra-State vs. Inter-State Logic**:
  - **Intra-State** (Buyer State = Seller State): Tax is evenly divided into **Central GST (CGST)** and **State GST (SGST)**.
  - **Inter-State** (Buyer State ≠ Seller State): Tax is calculated as **Integrated GST (IGST)**.
- **Real-Time Interactive Math**:
  - Live item selection, custom quantities, price overrides, real-time taxable amount recalculation.
  - Currency representation adhering to the Indian Numbering System (e.g. `₹ 1,50,000.00`).
- **Statutory Compliant Tax Invoices**:
  - Sequential invoice number generation (`INV-2026-000001`).
  - High-precision PDF rendering using `PDFKit` with seller details, buyer details, GSTIN, HSN codes, and digital seals.
  - Direct customer email dispatch using automated SMTP email services.

### 3. 📦 Real-Time Inventory & HSN Catalog
- **HSN/SAC Code Directory**: Support for statutory 8-digit HSN codes across all GST tax brackets (0%, 5%, 12%, 18%, 28%).
- **Instant Product Search**: Debounced client-side filtering by name, product category, or HSN code.

### 4. 👥 Customer & Party Management
- **Party Ledger**: Manage corporate clients and retail buyers with full GSTIN validation, registered state jurisdiction, and billing addresses.
- **Historical Ledger**: Real-time sales transaction logs and lifetime billing counters for each party.

### 5. 🤖 Embedded AI Business Assistant
- **AI Business Strategist**: Built-in intelligent assistant providing real-time inventory insights, revenue optimization tips, and tax advisory guidance.

### 6. 📊 Analytics & Telemetry Dashboard
- **Executive KPIs**: Real-time cards displaying Today's Revenue, Monthly Sales, Total Invoices Generated, and GST Collections.
- **Visual Analytics**: Interactive area and bar charts powered by `Recharts` comparing taxable revenue and tax distribution.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
|:---|:---|
| **Frontend Architecture** | React 19, Vite 8, React Router v7, TanStack Query v5 |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons, Sonner Notifications, Glassmorphism UI |
| **Form Handling & Validation** | React Hook Form v7, Zod v3 Schema Validation |
| **Backend API Server** | Node.js (ES Modules), Express.js 4.x, Helmet, CORS, Express Rate Limit |
| **Database & ODM** | MongoDB, Mongoose 8.x (with automated In-Memory MongoDB fallback for zero-config evaluation) |
| **Document Generation** | PDFKit (Statutory A4 GST Invoices) |
| **Authentication & Encryption** | JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |

---

## 📁 Repository Structure

```
gst/
├── Backend/                            # Node.js + Express REST API Server
│   ├── config/                         # Environment & Database (with In-Memory fallback)
│   ├── constants/                      # Roles, permissions, system configuration
│   ├── controllers/                    # Handlers (Auth, Shop, Party, Item, Bill, Dashboard, User)
│   ├── middleware/                     # JWT Auth, Role RBAC, Error Handling, Rate Limiter
│   ├── models/                         # Mongoose Models (Shop, User, Party, Item, Bill, Counter)
│   ├── routes/                         # Express Route Definitions
│   ├── services/                       # Tax Math, PDF Generator, Email Dispatcher
│   ├── templates/                      # Responsive HTML email templates
│   ├── utils/                          # ApiError, ApiResponse, Currency, NumberToWords
│   ├── validators/                     # Zod Request Validation Schemas
│   ├── app.js                          # Express App initialization & CORS setup
│   └── seed.js                         # Database Seeder with pre-configured accounts
│
├── Frontend/                           # React 19 + Vite Enterprise Client
│   ├── src/
│   │   ├── api/                        # Centralized Axios Client & Interceptors
│   │   ├── components/                 # Reusable UI Library (Buttons, Modals, Inputs, Cards)
│   │   ├── constants/                  # Routes, Indian States, GST Slabs, Roles
│   │   ├── context/                    # AuthContext, ThemeContext, AIAgentContext
│   │   ├── features/                   # Modular Features (Auth, Dashboard, Bills, Items, Parties, Users)
│   │   ├── layouts/                    # AppShell, Topbar, Sidebar, AuthLayout
│   │   ├── pages/                      # Page Components matching Application Routes
│   │   ├── routes/                     # AppRouter, ProtectedRoute, RoleRoute
│   │   ├── services/                   # Axios API services & fallback client persistence
│   │   ├── styles/                     # Design tokens & CSS Variables
│   │   └── utils/                      # GST Calculation, Currency Formatting, Date Helpers
│   ├── index.html                      # HTML5 Entry Point
│   └── vite.config.js                  # Vite Build Configuration
│
├── HOWTOUSE.md                         # Comprehensive Non-Technical User Manual
├── PROJECT_REPORT.md                   # Academic Project Report for Gujarat University
└── README.md                           # Master Project Documentation
```

---

## ⚡ Quick Start & Setup Guide

### System Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge

> **Note for Evaluator / University Examiner**:  
> The project includes an **automatic in-memory MongoDB fallback**. You **do not** need to install or configure an external MongoDB database. If local MongoDB is not detected, an in-memory database automatically starts and seeds all demo data within seconds!

---

### Step 1: Start the Backend Server

1. Open a terminal in the project directory:
   ```bash
   cd Backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   *The backend will boot on `http://localhost:5001`. If local MongoDB is offline, it will automatically launch the in-memory database and seed all demo records.*

---

### Step 2: Start the Frontend Application

1. Open a second terminal window in the project directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

---

## 🔑 Pre-Configured Demo Accounts

For immediate evaluation, the application comes with one-click **"Demo Quick Fill"** buttons on the login screen:

| Role | Email Address | Password | Permissions & Scope |
|:---|:---|:---|:---|
| **OWNER** | `Jigsi_karia@jigsikaria.com` | `Jigsi@karia` | Complete system control, Shop Settings, User Management, Invoices & Analytics |
| **ADMIN** | `karia_jigsi@jigsikaria.com` | `Jigsi@karia` | Customer & Inventory management, Invoicing, Sales Reports |
| **STAFF** | `staff@jigsikaria.com` | `Jigsi@karia` | Billing desk, customer registration, catalog search |

*(All accounts share the secure password: `Jigsi@karia`)*

---

## 📚 Complete Project Documentation

- **[HOWTOUSE.md](file:///e:/gst/HOWTOUSE.md)**: Easy-to-follow, step-by-step user manual written specifically so that any non-technical user, clerk, or shop owner can operate the system without coding knowledge.
- **[PROJECT_REPORT.md](file:///e:/gst/PROJECT_REPORT.md)**: Comprehensive academic report structured for Gujarat University assignment submission (system design, ER diagrams, data dictionary, test suites).

---

## 👤 Author & Academic Declaration

**Student Name**: Jigsi Karia  
**Academic Degree**: Master / Bachelor in Computer Applications & Information Technology  
**Affiliation**: Gujarat University, Ahmedabad, Gujarat, India  
**Declaration**: This project was developed as an original academic software engineering project for evaluation at Gujarat University. All rights reserved.
