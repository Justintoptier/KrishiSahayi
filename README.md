<img width="1907" height="867" alt="image" src="https://github.com/user-attachments/assets/993899f4-2193-40b6-8ccf-41e88a0a6c85" />
# 🌾 KrishiSahayi

> **Bridging the gap between farmers and consumers — one harvest at a time.**

KrishiSahayi is a full-stack web platform that empowers farmers with a direct digital presence, eliminating the need for middlemen and enabling transparent, trustworthy connections with consumers.

---

## 🚩 The Problem

Farmers in many regions face significant barriers to fair trade:

- ❌ Limited or no digital presence
- ❌ Dependence on middlemen who cut into profit margins
- ❌ No direct connection or trust with end consumers
- ❌ No centralized platform to market their goods effectively

---

## ✅ The Solution

**KrishiSahayi** tackles these challenges head-on with a feature-rich marketplace:

| Feature | Description |
|---|---|
| 🌾 **Farmer Profiles** | Showcase farm products, location, and background |
| 🛒 **Consumer Dashboard** | Browse goods by category and farm |
| 📬 **Messaging System** | Real-time communication between farmers and consumers |
| 📦 **Order Requests** | Simple and secure order placement |
| ⚙️ **Admin Panel** | Manage users, listings, and categories |
| 🔐 **Role-Based Auth** | Secure JWT-based access control for each user type |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React JS, Tailwind CSS, Redux |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth** | JWT (JSON Web Token) |
| **Hosting** | Vercel |

---

## 👥 Roles & Permissions

| Role | Capabilities |
|---|---|
| 👨‍🌾 **Farmer** | Register, login, create profile, list & manage products, view & reply to messages |
| 🛒 **Consumer** | Browse listings, search by category, message farmers, place order requests |
| 🛠️ **Admin** | Manage users, products, order requests, and categories via dashboard |

---

## 📁 Project Structure

```
krishisahayi/
├── client/                        # Frontend (React)
│   ├── public/
│   │   └── logo.png
│   └── src/
│       ├── assets/                # Images and static assets
│       ├── components/            # Reusable UI components
│       ├── pages/                 # Application pages
│       ├── redux/                 # State management (Redux)
│       ├── App.jsx                # React Router setup
│       └── main.jsx               # Application entry point
│
└── api/                           # Backend (Node/Express)
    ├── controllers/               # Core business logic
    ├── db/                        # Database connection
    ├── models/                    # Mongoose schemas
    ├── routes/                    # API route definitions
    ├── utils/                     # Helper functions
    └── index.js                   # Server entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- VS Code or any code editor

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/krishisahayi.git
cd krishisahayi
```

---

### 2. Setup the Backend

```bash
cd api
```

Create a `.env` file in the `api/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=90d
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

The backend will run at `http://localhost:5000`.

---

### 3. Setup the Frontend

```bash
cd client
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### 4. Access the App

Open your browser and navigate to:

```
http://localhost:5173
```

Make sure the frontend is correctly communicating with the backend via the `VITE_BACKEND_URL` environment variable.

---

## 📸 Screenshots

### 🏠 Homepage
![KrishiSahayi Homepage](./screenshot-homepage.png)

> _Add more screenshots of the farmer dashboard, consumer browse page, and admin panel here._

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

Built with a mission to support the farming community through accessible technology. Special thanks to all contributors and open-source libraries that made this possible.
