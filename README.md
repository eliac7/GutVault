# GutVault

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Dexie.js](https://img.shields.io/badge/Dexie.js-4.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)

<img src="public/og-image.png" alt="GutVault" width="500" />

**A privacy-first, offline-ready IBS tracker featuring AI voice logging and local-first architecture.**

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

</div>

---

## 📖 Overview

GutVault is a Progressive Web Application (PWA) designed to simplify the tracking of Irritable Bowel Syndrome (IBS) symptoms, meals, and bowel movements. Unlike traditional health trackers that store sensitive medical data on remote servers, GutVault utilizes a **local-first architecture**.

All user data is stored persistently within the user's browser using **IndexedDB** (via Dexie.js), ensuring complete privacy and offline functionality. The application leverages **AI Voice Logging** to reduce the friction of manual entry. Users can speak naturally to describe their meals or symptoms, and the application uses an LLM (via OpenRouter) to parse the speech into structured data points automatically.

---

## ✨ Features

- **🛡️ Local-First Storage:** 100% of health data is stored locally on the device using IndexedDB. No data is ever persisted to a backend database.
- **🎙️ AI Voice Logging:** Natural language processing to convert voice dictations into structured logs (Foods, Symptoms, Bristol Stool Scale, Pain Levels).
- **📶 Offline Support:** Fully functional PWA that works without an internet connection (syncing only required for AI processing).
- **🔐 Privacy Centric:** Zero-knowledge architecture regarding user health data.
- **📊 Dashboard Analytics:** Client-side computation of symptom trends and food correlations using Recharts.
- **💾 Data Management:** Full control to export (JSON), import, or wipe local data.
- **📱 Responsive Design:** Optimized for mobile and desktop usage with dark mode support.

---

## ⚡ Tech Stack

| Category       | Technology          | Description                                  |
| :------------- | :------------------ | :------------------------------------------- |
| **Framework**  | **Next.js 16**      | App Router, React 19, Server Actions.        |
| **Database**   | **Dexie.js**        | IndexedDB wrapper for local-first storage.   |
| **AI & API**   | **Vercel AI SDK**   | AI integration via OpenRouter.               |
| **Styling**    | **Tailwind CSS v4** | Next-gen utility CSS engine with shadcn/ui.  |
| **Animations** | **Framer Motion**   | Smooth transitions and interactive elements. |
| **Validation** | **Zod**             | Type-safe runtime schema validation.         |
| **Charts**     | **Recharts**        | client-side data visualization.              |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ or [Bun](https://bun.sh/)
- npm, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/gutvault.git
   cd gutvault
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your OpenRouter keys.

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## ⚙️ Configuration

The application requires the following environment variables for AI features:

| Variable             | Description                               | Default                        |
| :------------------- | :---------------------------------------- | :----------------------------- |
| `OPENROUTER_API_KEY` | API Key for OpenRouter to access LLMs.    | Required                       |
| `OPENROUTER_MODEL`   | The specific model ID to use for parsing. | `mistralai/devstral-2512:free` |

---

## 🛠️ Project Structure

```bash
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (app)/        # Main app routes (Dashboard, History)
│   ├── (marketing)/  # Landing page and marketing routes
│   └── api/          # API routes for AI processing
├── features/         # Feature-based architecture
│   ├── dashboard/    # Dashboard components (Charts, At-a-glance)
│   ├── history/      # History list and log rendering
│   ├── logging/      # Voice and manual logging logic
│   ├── settings/     # Settings and data management
│   └── theme-toggle/ # Dark/Light mode logic
├── sections/         # Marketing page sections
├── shared/           # Shared utilities
│   ├── db/           # Dexie.js database configuration
│   ├── lib/          # Utility functions
│   ├── providers/    # Context providers
│   └── ui/           # Reusable UI components
└── widgets/          # Composite UI blocks (Headers, Footers)
```

---

## 🤝 Contributing

Contributions are more than welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
