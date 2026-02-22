IOT WATER MONITORING DASHBOARD

A real-time industrial-style monitoring dashboard built with Next.js and
TypeScript.

FEATURES

-   Battery Health Monitoring
-   Animated Charging Effect with Lightning Icon
-   Water Pump Animation (ON/OFF)
-   Main Tank & Sump Tank Water Level Visualization
-   Floating Switch LOW Alert Indicator
-   Signal Strength Monitoring
-   Real-time updates using Firebase Realtime Database

TECH STACK

-   Next.js 15 (App Router)
-   TypeScript
-   Firebase Realtime Database
-   Custom CSS Animations
-   WebSocket-based Real-time Updates

PROJECT STRUCTURE

app/ layout.tsx page.tsx globals.css

components/ Dashboard.tsx BatteryCard.tsx WaterPumpCard.tsx
WaterTankSystem.tsx

lib/ firebase.ts

types/ dashboard.ts

INSTALLATION

1.  Clone the repository
2.  Run: npm install
3.  Run: npm run dev

ENVIRONMENT VARIABLES

Create a .env.local file:

NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL

EXAMPLE DATABASE STRUCTURE

{ “battery”: { “charging_mode”: “Charging”, “current”: 7.35, “soc”: 92
}, “control”: { “vfd_command”: “ON” }, “water_system”: {
“communication”: “Connected”, “main_level”: 87.4, “sump_level”: 143.7,
“floating_switch”: “LOW”, “signal_strength”: -69 } }

USE CASES

-   Smart Water Management Systems
-   IoT Tank Monitoring
-   Solar + Battery Monitoring
-   Remote Pump Automation
-   Lightweight SCADA-style Dashboard

FUTURE IMPROVEMENTS

-   Historical Data Charts
-   SMS / Email Alerts
-   Authentication & Role-Based Access
-   Multi-site Monitoring
-   Mobile Responsive Enhancements

Built with Next.js and Firebase.
