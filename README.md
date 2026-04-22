# 🚰 IoT Water Monitoring Dashboard

A real-time industrial-style monitoring dashboard built with **Next.js
15 + TypeScript**.

------------------------------------------------------------------------

## 🔥 Features

-   🔋 Battery Health Monitoring with Charging Animation
-   ⚡ Lightning Icon when Charging
-   🚰 Animated Water Pump (ON/OFF)
-   💧 Main Tank & Sump Tank Level Visualization
-   🚨 Floating Switch LOW Alert Indicator
-   📡 Signal Strength Monitoring
-   🌐 Real-time updates using Firebase Realtime Database

------------------------------------------------------------------------

## 🛠 Tech Stack

-   Next.js 15 (App Router)
-   TypeScript
-   Firebase Realtime Database
-   Custom CSS Animations
-   WebSocket-based Real-time Updates

------------------------------------------------------------------------

## 📂 Project Structure

    app/
      layout.tsx
      page.tsx
      globals.css

    components/
      Dashboard.tsx
      BatteryCard.tsx
      WaterPumpCard.tsx
      WaterTankSystem.tsx

    lib/
      firebase.ts

    types/
      dashboard.ts

------------------------------------------------------------------------

## 🚀 Installation

``` bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔐 Environment Variables

Create a `.env.local` file:

    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL

------------------------------------------------------------------------

## 📊 Example Database Structure

``` json
{
  "battery": {
    "charging_mode": "Charging",
    "current": 7.35,
    "soc": 92
  },
  "control": {
    "vfd_command": "ON"
  },
  "water_system": {
    "communication": "Connected",
    "main_level": 87.4,
    "sump_level": 143.7,
    "floating_switch": "LOW",
    "signal_strength": -69
  }
}
```

------------------------------------------------------------------------

## 🏭 Use Cases

-   Smart Water Management Systems
-   IoT Tank Monitoring
-   Solar + Battery Monitoring
-   Remote Pump Automation
-   Lightweight SCADA-style Dashboard

------------------------------------------------------------------------

## 🚧 Future Improvements

-   📊 Historical Data Charts
-   🚨 SMS / Email Alerts
-   🔐 Authentication & Role-Based Access
-   🌍 Multi-site Monitoring
-   📱 Mobile Responsive Layout

------------------------------------------------------------------------

## 👨‍💻 Built With

Next.js + TypeScript + Firebase
