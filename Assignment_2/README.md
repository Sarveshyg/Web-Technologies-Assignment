# World Clock Dashboard

A modern and responsive **World Clock Dashboard** developed as part of the Web Technologies Assignment. The application provides a collection of time-related utilities including a digital clock, world clock, stopwatch, countdown timer, and alarm manager.

The project is built using **React, TypeScript, and Vite**, with a component-based architecture for maintainability and reusability.

## Features

- Digital real-time clock
- World clock with multiple time zones
- Stopwatch
- Countdown timer
- Alarm management
- Light and dark theme support
- Persistent data using browser Local Storage
- Sound support for alarms and timers
- Responsive dashboard interface
- Reusable React components
- Type-safe development using TypeScript
- Modern icons using Lucide React

## Technologies Used

### Frontend

- React
- TypeScript
- HTML5
- CSS3

### Build Tool

- Vite

### Libraries

- React DOM
- Lucide React
- Nanoid

## Project Structure

```text
Assignment_2/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── app/
│   │   └── AppProviders.tsx
│   │
│   ├── components/
│   │   ├── alarm/
│   │   ├── clock/
│   │   ├── countdown/
│   │   ├── layout/
│   │   ├── stopwatch/
│   │   ├── ui/
│   │   └── worldclock/
│   │
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   │   ├── localStorageService.ts
│   │   ├── soundService.ts
│   │   └── themeService.ts
│   │
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
