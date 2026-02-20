# TopCart E-Commerce Platform

## About this project

TopCart is a comprehensive, full-stack e-commerce application designed to provide a seamless shopping experience for users. It features user authentication through Spring Security, a dynamic product catalog, advanced product search and filtering, user wishlists, integrated product reviews with star ratings, and a simulated checkout/payment gateway system. 

The platform additionally includes a responsive, intelligent chatbot assistant built-in to the interface that navigates users through different product categories effectively. The project emphasizes modern software development practices including RESTful API design, complex JPA database relationship mappings, global component state management using React Context, and a fully Dockerized deployment strategy.

## Technical Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS, React Icons

### Backend
- **Framework:** Spring Boot 3.5.4 (Java 21)
- **Data Access:** Spring Data JPA, Hibernate ORM
- **Security:** Spring Security
- **Build Tool:** Maven

### Database
- **Primary Database:** MySQL

### Deployment & DevOps
- **Containerization:** Docker (Multi-stage builds)
- **Hosting Platform:** Render (PaaS)

---

## Project Setup and Commands

This project consists of a Spring Boot backend and a React/Vite frontend.

## Prerequisites

- **Java JDK 17+** (Ensure `JAVA_HOME` is set)
- **Node.js** (LTS version recommended)

## Starting the Project

You will need two separate terminal windows.

### 1. Start the Backend (Spring Boot)

Open a terminal in the project root (`d:\learn\ecommerce\topcart`) and run:

```powershell
.\mvnw.cmd spring-boot:run
```

The server will start on `http://localhost:8080`.

### 2. Start the Frontend (React/Vite)

Open a **separate** terminal, navigate to the frontend directory, and start the dev server:

```powershell
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`.

> **Note:** on some systems with restrictive PowerShell policies, you might need to use `cmd /c npm run dev` or run from Command Prompt.

---

## Stopping the Project

### gracefully

In each terminal window where a service is running:
- Press `Ctrl + C`
- If prompted "Terminate batch job (Y/N)?", type `Y` and press Enter.

### Force Stop (If port is stuck)

If a service won't stop or you get a "Port already in use" error, you can find and kill the process.

**Find the process ID (PID) using the port:**
```powershell
netstat -ano | findstr :8080   # For Backend
netstat -ano | findstr :5173   # For Frontend
```

**Kill the process using the PID found:**
```powershell
taskkill /F /PID <PID>
```
Example: `taskkill /F /PID 12345`
