# 📈 CSE Market Intelligence Agent — Frontend

A modern React + Vite dashboard for the **Colombo Stock Exchange (CSE) Market Intelligence Agent**. This interface visualizes daily CSE market statistics, AI-classified financial news stories, deterministic sector evidence scores, and archived daily intelligence briefs powered by the FastAPI + LangGraph backend.

---

## ✨ Key Features

- **Market Overview Cards:** Tracks daily CSE market turnover, companies traded, and index movements.
- **Sector Evidence Matrix:** Displays bullish ("In Favour") and bearish ("Against") evidence drivers, sentiment intensity bars, confidence ratings, and story counts per CSE sector.
- **Top Market Stories Feed:** Real-time feed of deduplicated and AI-classified Sri Lankan financial news.
- **Historical Archive Drawer:** Browse and inspect market briefs across previous trading dates.

---

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API Integration:** Fetch REST Service (`src/services/api.js`)

---

## 🚀 Getting Started

Follow these steps in order to set up and run the frontend locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/AkilaKasun/cse-news-agent-frontend.git](https://github.com/AkilaKasun/cse-news-agent-frontend.git)
cd cse-news-agent-frontend
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed, then run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project:

```bash
# On Windows (PowerShell)
New-Item .env

# On macOS / Linux
touch .env
```

Open the `.env` file and add the following configuration (replace `backendurl` with your running FastAPI backend URL, e.g., `http://localhost:8000`):

```env
VITE_API_BASE_URL=backendurl/api
VITE_APP_TITLE="CSE Market Intelligence Agent"
VITE_REFRESH_INTERVAL=60000
```

> **Example for local development:**
> ```env
> VITE_API_BASE_URL=http://localhost:8000/api
> VITE_APP_TITLE="CSE Market Intelligence Agent"
> VITE_REFRESH_INTERVAL=60000
> ```

### 4. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:
👉 `http://localhost:5173`

---

## 📦 Build for Production

To create an optimized production build inside the `dist/` folder:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Structure

```text
cse-news-agent-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # UI Components
│   │   ├── ArchiveModal.jsx # Historical report viewer
│   │   ├── Header.jsx       # Date selector & app title bar
│   │   ├── MarketStats.jsx  # Top-level CSE market KPIs
│   │   ├── SectorCard.jsx   # Individual sector display
│   │   ├── SectorGrid.jsx   # Sector Evidence Matrix grid
│   │   └── StoriesFeed.jsx  # Classified financial news feed
│   ├── services/
│   │   └── api.js           # Centralized API client using VITE_API_BASE_URL
│   ├── App.jsx              # Main dashboard layout & state
│   └── main.jsx             # React entry point
├── .env                     # Local environment variables (git-ignored)
├── .gitignore               # Ignored files (node_modules, .env, dist)
├── package.json             # Project dependencies and scripts
└── vite.config.js           # Vite configuration
```