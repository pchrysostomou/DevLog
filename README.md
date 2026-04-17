# DevLog 🚀

**DevLog** is a cinematic, gamified learning tracker designed to help developers record their daily progress, track study hours, and level up their skills. Turn your learning journey into a visual experience with rich analytics and a beautiful interface.

---

## 🌟 Features

*   **Secure Authentication**: Powered by Supabase, offering reliable email/password login and registration.
*   **Daily Logs**: Easily record what you learned each day. Keep detailed Markdown notes and track the hours spent.
*   **Skills Tracker (RPG Style)**: Create custom skills, set target hours, and watch your progress bars fill up as you log hours against them.
*   **Rich Analytics Dashboard**:
    *   **Activity Heatmap**: A GitHub-style 140-day contribution graph that glows brighter the more you study.
    *   **Study Hours Chart**: A visual breakdown of your daily dedication.
    *   **Skill Distribution**: A doughnut chart highlighting exactly where your time goes.
*   **Streak System**: Keep your momentum strong with automatic consecutive-day streak tracking.
*   **Mobile Fully Responsive**: Seamless, native-like experience on all devices with mobile-first bottom navigation and dynamic stack grids.

---

## 🛠️ Tech Stack

*   **Frontend**: React (v18), Vite
*   **Styling**: Tailwind CSS (Dark Cinematic Theme, Glassmorphism)
*   **Database & Auth**: Supabase (PostgreSQL)
*   **Charts & Visuals**: Recharts
*   **Routing**: React Router DOM (v6)
*   **Date Formatting**: date-fns

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16+)
*   npm or yarn
*   A [Supabase](https://supabase.com/) account and fresh project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pchrysostomou/DevLog.git
    cd DevLog
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    Execute the SQL schemas found in `supabase_setup.sql` in your Supabase SQL Editor to create the necessary `profiles`, `logs`, and `skills` tables.

4.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

5.  **Run the application locally:**
    ```bash
    npm run dev
    ```

---

