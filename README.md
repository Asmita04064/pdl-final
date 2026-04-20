#  ResQNet – Offline Emergency Communication System

##  Problem

During natural disasters (floods, earthquakes, cyclones), **internet connectivity often collapses**.
This leaves people unable to:

* Send SOS alerts
* Share their location
* Request or coordinate help

Existing apps **completely fail without internet**, making them unreliable in real emergency scenarios.

---

##  Why Existing Solutions Fail

* Depend entirely on cloud/internet
* No offline communication mechanism
* No real-time peer-to-peer alerting
* High latency in critical situations

---

##  Our Solution

**ResQNet** is an **offline-first emergency communication platform** that ensures people can still send and receive alerts even when the internet is unavailable.

###  Key Idea:

* Use **local communication (Bluetooth / mesh-ready architecture)**
* Sync data to cloud when internet becomes available
* Provide **real-time alert visualization using maps**

---

##  Core Features

###  SOS Alert System

* Instantly broadcast emergency alerts
* Categorized alerts (fire, flood, medical, etc.)

###  Location Tracking

* Share live location of affected users
* Visualized using **Google Maps Platform**

###  Offline-First Design

* Alerts stored locally when offline
* Auto-sync when connection is restored

###  Real-Time Updates

* Immediate notification to nearby users
* Designed for low-latency communication

---

##  System Architecture

```
User Device
   ↓
Frontend (React)
   ↓
Local Storage (Offline Support)
   ↓
Backend (API / Firebase)
   ↓
Cloud Sync + Map Visualization
```

---

##  Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js / Express

### Cloud & Services

* Firebase (Auth / Database)
* Google Maps Platform (Location Services)

### Deployment

* Vercel

---

##  Testing Strategy

We implemented testing across multiple layers:

###  Unit Testing

* Core functions (alert creation, location parsing)

###  Integration Testing

* Alert flow: User → Backend → Other Users

###  Edge Case Handling

* No internet scenario
* GPS failure fallback
* Duplicate alert prevention

---

##  Live Demo

🔗 https://pdl-final.vercel.app/

---

##  Demo Flow

1. User logs in
2. Sends an SOS alert
3. Location is marked on map
4. Nearby users receive notification

---

##  Security Measures

* Input validation for all APIs
* Secure authentication (Firebase Auth)
* Environment-based configuration

---

##  Performance Optimization

* Lightweight frontend
* Efficient API calls
* Minimal load time even on low bandwidth

---

##  Accessibility

* Semantic HTML structure
* Screen-reader friendly labels
* Improved contrast and navigation

---

##  Impact

ResQNet ensures:

* Faster emergency response
* Communication even without internet
* Scalable disaster management solution

---

##  Future Scope

* Full Bluetooth mesh communication
* Radio-based long-range alerting
* AI-based disaster prediction
* Government integration APIs

---

##  Author

Asmita J

---

##  Final Note

This project is built with a focus on **real-world impact**, solving a critical problem where traditional systems fail — **communication during disasters without internet**.
