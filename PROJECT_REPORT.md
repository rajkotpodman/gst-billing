# 📄 ACADEMIC PROJECT REPORT

## CLOUD GST BILLING & INVENTORY MANAGEMENT SYSTEM (GSTBilling PRO)

---

### **A Project Report Submitted to**
### **GUJARAT UNIVERSITY, AHMEDABAD**
#### In Partial Fulfillment for the Academic Evaluation in  
#### **Computer Science & Information Technology**

---

### **Submitted By:**
**Name of Student**: Jigsi Karia  
**Enrollment / Student Email**: Jigsi_karia@jigsikaria.com  
**Institution**: Gujarat University, Ahmedabad, Gujarat, India  
**Academic Session**: 2025 – 2026  

---

## 📜 CANDIDATE DECLARATION

I, **Jigsi Karia**, hereby declare that the software project entitled **"Cloud GST Billing & Inventory Management System (GSTBilling PRO)"** is an original piece of software engineering and development undertaken by me as part of my curriculum evaluation at **Gujarat University**.

This software solution is designed to handle Indian statutory GST invoicing, inventory tracking, role-based access security, and customer telemetry. I confirm that all design patterns, frontend modules, backend controllers, and documentation have been structured and assembled by me, and this work has not been previously submitted to any other university or examining board for any degree or diploma.

**Date**: 15th October 2026  
**Place**: Ahmedabad, Gujarat  
**Signature**: *Jigsi Karia*  

---

## 🌟 ACKNOWLEDGEMENTS

I express my deepest gratitude to the faculty and mentors at **Gujarat University** for their continuous guidance, intellectual inspiration, and valuable insights throughout the duration of this software engineering project.

I am also thankful to the open-source software engineering community, particularly the maintainers of Node.js, Express, React, Vite, Tailwind CSS, and MongoDB, whose robust foundational frameworks made the development of this enterprise application possible.

---

## 📑 ABSTRACT

The implementation of the Goods and Services Tax (GST) in India consolidated numerous indirect taxes into a unified dual-tier tax regime (Intra-State CGST + SGST vs. Inter-State IGST). However, micro, small, and medium enterprises (MSMEs) often struggle with complicated, legacy desktop billing software that lacks mobile accessibility, modern security, automated state detection, and intuitive user interfaces.

This project, **GSTBilling PRO**, addresses these challenges by delivering a responsive, cloud-ready, full-stack GST Billing and Inventory Platform. The system features:
1. **Intelligent State-Wise Tax Calculation**: Dynamically differentiates between intra-state (CGST + SGST) and inter-state (IGST) sales in real-time.
2. **Strict Multi-Tier RBAC**: Three distinct user roles (`OWNER`, `ADMIN`, `STAFF`) with isolated permissions and secure cookie-based JWT sessions.
3. **Statutory Invoicing**: Automated sequential billing, instant A4 PDF invoice rendering via `PDFKit`, and automated customer email dispatch.
4. **Resilient Data Architecture**: Built on Node.js/Express and MongoDB, featuring a zero-configuration In-Memory MongoDB engine for evaluation environments.
5. **Modern Frontend UX**: Engineered using React 19, Vite, Tailwind CSS, TanStack Query, and Lucide React icons with full Dark/Light theme ergonomics.
6. **AI Business Strategist**: Embedded assistant offering sales intelligence, inventory insights, and tax recommendations.

---

## CHAPTER 1: INTRODUCTION & PROBLEM DEFINITION

### 1.1 Background of Goods & Services Tax (GST)
In the Indian taxation system, GST is a destination-based tax levied on the supply of goods and services. The tax architecture is divided into:
- **Intra-State Transactions**: Where the supplier location and place of supply are within the same state (e.g., Gujarat to Gujarat). The GST rate is halved into **Central GST (CGST)** and **State GST (SGST)**.
- **Inter-State Transactions**: Where supplier and buyer locations are in different states (e.g., Gujarat to Maharashtra). The full tax rate is levied as **Integrated GST (IGST)**.

### 1.2 Problem Statement
Many small Indian retail shops and trading houses still rely on manual billing or cumbersome legacy software. These systems suffer from:
- Prone to human mathematical errors when calculating split taxes.
- Lack of centralized customer records and ledger tracking.
- Absence of role-based security, allowing staff access to sensitive business margins.
- Inability to generate clean, printable digital invoices on standard A4 paper.
- Complex setup requiring dedicated database administration.

### 1.3 Project Objectives
- Develop an intuitive, web-based invoicing application requiring **zero technical expertise** from billing operators.
- Implement an automated tax calculation engine adhering strictly to Indian GST laws.
- Provide real-time sales and tax collection telemetry on an executive dashboard.
- Enforce role-based access control (RBAC) to protect sensitive administrative functions.
- Support instant PDF generation and customer email transmission.

---

## CHAPTER 2: SYSTEM ARCHITECTURE & DESIGN

### 2.1 Architectural Pattern
The application follows a decoupled **Client-Server Architecture** communicating over a RESTful JSON API:

```
┌────────────────────────────────────────────────────────┐
│             REACT 19 CLIENT (Vite 8 SPA)              │
│  - Tailwind CSS Glassmorphism Design System            │
│  - React Hook Form + Zod Form Validations             │
│  - TanStack Query (Server State Cache & Hydration)     │
│  - AI Business Strategist Assistant Desk              │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP / REST API (JSON / Cookies)
                            │
┌───────────────────────────▼────────────────────────────┐
│             NODE.JS + EXPRESS API SERVER               │
│  - Security: Helmet, CORS, Express-Rate-Limit          │
│  - Authentication: JWT in HTTP-Only Cookies            │
│  - RBAC Middleware: Role Guards (OWNER, ADMIN, STAFF)  │
│  - PDF Engine: PDFKit Statutory Invoice Generator     │
│  - Tax Service: Pure Intra/Inter-state computation     │
└───────────────────────────┬────────────────────────────┘
                            │
                       Mongoose ODM
                            │
┌───────────────────────────▼────────────────────────────┐
│                    MONGODB DATABASE                    │
│  - Persistent Collections: Users, Shops, Parties,      │
│    Items, Bills, Counters                              │
│  - In-Memory Fallback: MongoMemoryServer for instant   │
│    zero-config testing and grading                    │
└────────────────────────────────────────────────────────┘
```

---

## CHAPTER 3: DATABASE SCHEMA & DATA DICTIONARY

The system utilizes six structured collections designed with Mongoose schemas:

### 3.1 `Shop` Collection
Represents the registered business enterprise:
- `businessName`: String (e.g., `Apex Tech Solutions Private Limited`)
- `ownerName`: String (e.g., `Jigsi Karia`)
- `address`: String (Street, building, city)
- `state`: String (e.g., `Gujarat`)
- `gstin`: String (15-character statutory alphanumeric code)
- `phone`: String (10-digit primary contact)
- `email`: String (Official billing email)
- `invoicePrefix`: String (Default: `INV-2026-`)
- `ownerId`: ObjectId (References `User`)

### 3.2 `User` Collection
Stores staff and administrative accounts:
- `shopId`: ObjectId (References `Shop`)
- `name`: String (e.g., `Jigsi Karia`, `Alexander Miller`, `Sarah Jenkins`)
- `email`: String (Unique index, e.g., `Jigsi_karia@jigsikaria.com`)
- `password`: String (Salted bcrypt hash)
- `role`: Enum (`['OWNER', 'ADMIN', 'STAFF']`)
- `isActive`: Boolean (Default: `true`)

### 3.3 `Party` Collection (Customers / Clients)
Stores customer directory information:
- `shopId`: ObjectId (Tenant isolation)
- `name`: String (Client business name)
- `mobile`: String (10 digits)
- `email`: String (For invoice delivery)
- `state`: String (Crucial for Intra vs. Inter-state determination)
- `gstin`: String (Optional for unregistered B2C clients)
- `address`: String

### 3.4 `Item` Collection (Product Catalog)
Stores goods and services for sale:
- `shopId`: ObjectId
- `name`: String (Product description)
- `hsnCode`: String (Harmonized System of Nomenclature)
- `price`: Number (Base unit price excluding tax)
- `gstPercent`: Number (Valid GST slabs: `0, 5, 12, 18, 28`)
- `description`: String

### 3.5 `Bill` Collection (Invoices)
Captures immutable historical tax transactions:
- `invoiceNumber`: String (Sequential, e.g. `INV-2026-000123`)
- `invoiceDate`: Date
- `partyId`: ObjectId
- `partySnapshot`: Object (Denormalized customer data at invoice time)
- `shopSnapshot`: Object (Denormalized business data at invoice time)
- `items`: Array of Line Items (item name, HSN, quantity, unit price, tax breakdowns)
- `intraState`: Boolean
- `subtotal`: Number (Total taxable amount)
- `totalCgst`: Number (Central tax amount)
- `totalSgst`: Number (State tax amount)
- `totalIgst`: Number (Integrated tax amount)
- `totalTax`: Number (Cumulative GST)
- `grandTotal`: Number (Subtotal + Total Tax)
- `status`: Enum (`['DRAFT', 'FINALIZED', 'CANCELLED']`)

---

## CHAPTER 4: CORE MODULES & IMPLEMENTATION

### 4.1 Authentication & Authorization Module
- Passwords are encrypted before database insertion using `bcrypt.hash(password, 12)`.
- Upon successful authentication, a signed JWT containing `{ id, role, shopId }` is issued with a 7-day expiration time.
- Protected API endpoints verify credentials via `authenticate` middleware, and role capabilities are validated via `authorize('OWNER')` decorators.

### 4.2 The Indian GST Calculation Service (`gst.service.js`)
```javascript
export function calculateInvoiceTotals(shopState, partyState, items) {
  const isIntraState = shopState.trim().toLowerCase() === partyState.trim().toLowerCase();
  
  let subtotal = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const calculatedItems = items.map((item) => {
    const itemSubtotal = item.price * item.quantity;
    const gstRate = item.gstPercent;
    let cgstRate = 0, sgstRate = 0, igstRate = 0;
    let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

    if (isIntraState) {
      cgstRate = gstRate / 2;
      sgstRate = gstRate / 2;
      cgstAmount = (itemSubtotal * cgstRate) / 100;
      sgstAmount = (itemSubtotal * sgstRate) / 100;
    } else {
      igstRate = gstRate;
      igstAmount = (itemSubtotal * igstRate) / 100;
    }

    const itemTotalTax = cgstAmount + sgstAmount + igstAmount;
    const itemGrandTotal = itemSubtotal + itemTotalTax;

    subtotal += itemSubtotal;
    totalCgst += cgstAmount;
    totalSgst += sgstAmount;
    totalIgst += igstAmount;

    return { ...item, itemSubtotal, cgstAmount, sgstAmount, igstAmount, itemTotalTax, itemGrandTotal };
  });

  return {
    intraState: isIntraState,
    subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax: totalCgst + totalSgst + totalIgst,
    grandTotal: subtotal + totalCgst + totalSgst + totalIgst,
    items: calculatedItems,
  };
}
```

### 4.3 Automated PDF Invoice Generation Engine (`pdf.service.js`)
Using the Node.js `pdfkit` library, invoices are dynamically rendered into binary PDF streams:
- Formatted with 40pt margins adhering to statutory ISO A4 proportions.
- Incorporates dynamic currency conversions converting total numeric amounts into formal written English words (e.g., `₹ 48,250.00` ➔ *"Rupees Forty-Eight Thousand Two Hundred Fifty Only"*).
- Includes structured item tables with borders, HSN columns, tax summaries, and authorized sign-off boxes.

### 4.4 Embedded AI Business Strategist Assistant
An integrated AI intelligence agent assists shop owners by:
- Analyzing catalog inventory performance and identifying high-tax-margin goods.
- Answering regulatory GST compliance queries in simple natural language.
- Recommending seasonal pricing and restocking priorities.

---

## CHAPTER 5: TESTING & VALIDATION

The system underwent rigorous functional verification:

| Test Case | Scenario / Input | Expected Result | Actual Result | Status |
|:---|:---|:---|:---|:---|
| **TC-01** | Login with `Jigsi_karia@jigsikaria.com` & `Jigsi@karia` | Successful JWT generation & redirect to Dashboard | Authenticated HTTP 200, cookie set, redirected | **PASS** |
| **TC-02** | Login with incorrect password | Informative 401 Unauthorized error alert | `"Invalid email or password"` returned | **PASS** |
| **TC-03** | Intra-State Sale (Gujarat shop, Surat customer) | Split tax into equal CGST (9%) and SGST (9%), IGST = 0 | 50/50 tax split verified | **PASS** |
| **TC-04** | Inter-State Sale (Gujarat shop, Mumbai customer) | 100% tax assigned to IGST, CGST/SGST = 0 | Full IGST applied, CGST/SGST = 0 | **PASS** |
| **TC-05** | Staff user attempting to access `/users` | Route guard blocks access and displays 403 Forbidden | Access restricted screen displayed | **PASS** |
| **TC-06** | In-Memory MongoDB Fallback | Server boots without external MongoDB installed | Memory server created & seeded with demo data | **PASS** |
| **TC-07** | PDF Invoice Generation | Stream `/api/bills/:id/pdf` | Valid binary A4 PDF downloaded | **PASS** |

---

## CHAPTER 6: CONCLUSION & FUTURE ENHANCEMENTS

### 6.1 Conclusion
The **Cloud GST Billing & Inventory Management System (GSTBilling PRO)** successfully achieves all designed objectives. It combines an intuitive user interface with robust, statutory tax logic, providing Indian small business owners and staff with a reliable, error-free platform for daily commercial billing.

### 6.2 Future Scope
Future enhancements planned for the platform include:
- Direct Integration with the Government GSTN e-Invoice and e-Way Bill API.
- Direct barcode/QR code hardware scanner integration for high-speed supermarket checkout.
- Multi-currency support for international export invoices.
- WhatsApp Business API integration for automatic invoice dispatch.

---

### **Student Sign-off:**
**Project Developer**: Jigsi Karia  
**Department**: Computer Science & Information Technology  
**Gujarat University, Ahmedabad**
