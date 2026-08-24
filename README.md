# Kaam Connect — Daily Labour Marketplace

A two-sided marketplace: **workers** list their trade, rate, and city; **employers**
search and send booking requests; workers accept/reject; you (the admin) oversee
everything from a dashboard.

Built with: React + Vite, Tailwind CSS, Firebase (Auth, Firestore, Storage, Hosting).

---

## 1. What this actually is (read this first)

This is **not** a single HTML file. It's a small project made of many JavaScript
files that get combined ("built") into a website by a tool called Vite. You need
Node.js installed on your computer to run it. This is completely normal for any
real web app — it's how professional sites are built.

---

## 2. One-time computer setup

1. Install **Node.js** (version 18 or newer) from https://nodejs.org — this gives
   you the `node` and `npm` commands. Download the "LTS" version, run the installer,
   click through with defaults.
2. Unzip the project folder you downloaded, anywhere on your computer (e.g. Desktop).
3. Open a terminal (Mac: Terminal app. Windows: search "cmd" or use PowerShell)
   and navigate into the folder:
   ```
   cd path/to/labour-connect
   ```
4. Install the project's dependencies (downloads all the packages it needs — only
   needed once, or after you pull new code):
   ```
   npm install
   ```

---

## 3. Create your Firebase project (one-time)

1. Go to https://console.firebase.google.com → **Add project** → name it (e.g.
   "kaam-connect") → you can skip Google Analytics.
2. Once created, click the **web icon `</>`** to register a web app. Skip the
   Hosting setup checkbox for now. Firebase will show you a `firebaseConfig`
   object — keep this tab open, you'll need the values in step 4.
3. In the left sidebar: **Build → Authentication → Get started** → enable
   **Email/Password** sign-in.
4. **Build → Firestore Database → Create database** → start in **production
   mode** (not test mode — we have real security rules for this app, see step 6).
5. **Build → Storage → Get started** → same, production mode.

---

## 4. Connect the project to your Firebase project

1. In the project folder, copy `.env.example` to a new file named `.env`.
2. Open `.env` and fill in the values from the `firebaseConfig` object Firebase
   showed you in step 3.2:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=kaam-connect.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=kaam-connect
   VITE_FIREBASE_STORAGE_BUCKET=kaam-connect.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
   (These are safe to have in frontend code — they're not secret keys, just
   identifiers. `.env` is already excluded from git via `.gitignore`.)

---

## 5. Run it locally

```
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`) in your browser.
You now have a live, working local copy. Sign up, create a worker profile,
try booking — everything works against your real Firebase project.

---

## 6. Deploy your security rules (important — do this before real users touch it)

The project includes `firestore.rules` and `storage.rules` — these are what stop
users from editing each other's data, setting themselves as admin, etc. They are
**not applied automatically**; you have to push them:

```
npm install -g firebase-tools
firebase login
firebase init
```
When `firebase init` asks: choose **Firestore** and **Storage**, pick your
existing project, and when it asks whether to overwrite `firestore.rules` /
`storage.rules` — say **No** (keep the ones already in this folder).

Then deploy the rules:
```
firebase deploy --only firestore:rules,storage:rules
```

---

## 7. Make yourself admin

Nobody can make themselves admin from the app (on purpose — that's a security
rule, see `firestore.rules`). To promote your own account:

1. Sign up normally in the app (as "I need to hire," it doesn't matter, you'll
   overwrite the role).
2. Go to Firebase Console → **Firestore Database** → `users` collection → find
   your document (matches your email) → edit the `role` field → change it from
   `employer` or `worker` to `admin`.
3. Refresh the app, log out and back in. You'll now see an **Admin** link in
   the nav bar.

---

## 8. Deploy the live website (optional, when ready to share it)

```
npm run build
firebase deploy --only hosting
```
(First run `firebase init` → choose **Hosting** → set `dist` as the public
directory → say yes to "configure as single-page app.")

You'll get a live `https://kaam-connect.web.app` URL you can share with anyone.

---

## Project structure

```
src/
  firebase.js                Firebase setup (reads .env)
  context/AuthContext.jsx    Login state, signup/login/logout logic
  components/                Reusable UI: navbar, route guards, status badges, loading/error states
  pages/                     One file per screen (Landing, Login, Signup, Browse, WorkerDetail, MyProfile, Bookings, AdminDashboard)
firestore.rules              Database security rules (who can read/write what)
storage.rules                Photo upload rules (size/type limits)
```

## Data model

```
users/{uid}            name, email, role (worker|employer|admin), city, phone
workerProfiles/{uid}   skills[], dailyRate, availability, bio, photoUrl
bookings/{id}          employerId, workerId, date, address, notes, status
```

`status` moves through: `pending → accepted/rejected → completed`, or
`pending/accepted → cancelled` (by the employer).
