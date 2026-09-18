# ASP.NET Core Web API (MVC) + React JS + MySQL User Auth Project

Full-stack user signup and login system built with **ASP.NET Core Web API (MVC Architecture)**, **React JS (Vite)**, and **MySQL Database**.

---

## 🌟 Features

- **MVC Architecture**: Decoupled Model (User, DTOs), View (React SPA), and Controller (`AuthController`).
- **MySQL Database**: Integrated with Entity Framework Core (`Pomelo.EntityFrameworkCore.MySql`) and automatic schema creation.
- **Secure Authentication**: Password hashing using **BCrypt** and **JWT Bearer Token** authorization.
- **React Frontend**: Glassmorphism UI design, live password strength meter, client-side input validation, and automatic JWT header injection via Axios.
- **User Dashboard**: Protected profile view showing user details, role badge, and session state.

---

## 🚀 How to Run the Application

### Prerequisites
1. **.NET 10 SDK** (or .NET 8 / .NET 9)
2. **Node.js** (v18+)
3. **MySQL Server** (via MySQL Installer, XAMPP, or Docker)

---

### Step 1: Start MySQL Database
Ensure your MySQL server is running locally on port `3306`.
By default, the connection string in `server/appsettings.json` is:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=UserAuthDb;User=root;Password=;"
}
```
> Adjust the `Password` or `User` if your local MySQL setup requires it.

---

### Step 2: Start the Backend (.NET Web API)
Open a terminal in the project directory:

```bash
cd server
dotnet run --urls "http://localhost:5000"
```
The API will start at: `http://localhost:5000`  
Swagger Documentation is available at: `http://localhost:5000/swagger`

---

### Step 3: Start the Frontend (React JS)
Open a second terminal window:

```bash
cd client
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 📁 Project Structure

```
dotnetproject/
├── server/                        # ASP.NET Core Backend (MVC Web API)
│   ├── Controllers/
│   │   └── AuthController.cs      # Auth API endpoints (Register, Login, Me)
│   ├── Models/
│   │   └── User.cs                # User domain entity for MySQL
│   ├── DTOs/
│   │   └── AuthDTOs.cs            # Request & Response DTOs
│   ├── Data/
│   │   └── AppDbContext.cs        # EF Core DbContext for MySQL
│   ├── Services/
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs        # Password hashing & JWT generation logic
│   ├── appsettings.json           # MySQL connection string & JWT key
│   └── Program.cs                 # App setup, CORS, DbContext & JWT configuration
│
└── client/                        # React JS Frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx          # Login card component
    │   │   ├── Signup.jsx         # Signup card component with strength meter
    │   │   ├── Dashboard.jsx      # Protected user dashboard
    │   │   └── Navbar.jsx         # Navigation bar with user badge
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global user & JWT state provider
    │   ├── services/
    │   │   └── api.js             # Axios client with JWT interceptor
    │   ├── App.jsx                # Layout & view switcher
    │   └── index.css              # Glassmorphic dark theme CSS system
    ├── package.json
    └── vite.config.js
```
