# Face2Face Frontend

Frontend part of a fullstack SPA application for online cosmetology booking.

The project was developed independently using Vue 3, TypeScript and Django REST API backend.

## Demo

https://face2face-vue.onrender.com

## Backend Repository

https://github.com/kiqiou/face2face_backend

---

# Features

## Authentication

* Telegram-based authentication
* JWT authorization
* Role-based access
* Persistent user session

## Client functionality

* Browse cosmetologists
* Browse procedures
* Add procedures to cart
* Create bookings
* View personal bookings
* Cancel bookings

## Cosmetologist functionality

* Manage procedures
* Configure work schedule
* Create and edit work days
* View bookings
* Manage appointment calendar

## Booking system

* Dynamic free slot generation
* Automatic duration calculation
* Booking conflict handling
* Time grouping by hours
* Existing booking validation

## UI/UX

* SPA architecture
* Responsive component structure
* Reusable UI components
* Toast notifications
* Modal windows
* Animated interface
* Role-based navigation

---

# Tech Stack

## Frontend

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Pinia
* Vue Router
* FullCalendar

## Backend Integration

* Django REST Framework
* REST API
* JWT Authentication

## Infrastructure

* Docker
* Render

---

# Architecture

The project uses SPA architecture with separation between:

* client area;
* admin area;
* reusable UI components;
* API composables;
* centralized state management.

## Project structure

```bash
src/
├── admin/
├── client/
├── components/
├── composables/
├── models/
├── router/
├── stores/
├── utils/
└── views/
```

## State management

Pinia is used for:

* cart management;
* shared application state;
* reactive booking updates.

## API layer

Reusable composables are used for:

* GET requests;
* POST requests;
* booking management;
* procedures management;
* workday management.

---

# Technical Challenges

One of the most complex parts of the project was implementing dynamic booking logic:

* calculating free intervals;
* generating slots every 5 minutes;
* validating booking duration;
* preventing booking overlaps;
* grouping available time slots.

---

# Screenshots

## Main Page

<img width="1641" height="895" alt="image" src="https://github.com/user-attachments/assets/fa2c5600-1b60-4f08-98a6-82106f83986f" />

## Booking System

<img width="641" height="469" alt="image" src="https://github.com/user-attachments/assets/9121ec5a-bfae-4379-afbe-3cef82bd9960" />


## Calendar
<img width="974" height="477" alt="image" src="https://github.com/user-attachments/assets/b40f05f2-76ed-49f8-9739-beab6e73aeae" />


## Procedures Management

<img width="636" height="477" alt="image" src="https://github.com/user-attachments/assets/9e5f9da8-1b22-4334-84d7-252719797b97" />


---

# Video Demo

https://youtu.be/lD3mAK-VXSg

---

# Installation

## Clone repository

```bash
git clone https://github.com/kiqiou/face2face-vue
```

## Install dependencies

```bash
npm install
```

## Run development server

```bash
npm run dev
```

---

# Author

Ekaterina Kuksar

GitHub:
https://github.com/kiqiou
