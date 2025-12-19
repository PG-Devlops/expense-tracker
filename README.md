# Finance Management Application

A personal finance management web application built with React, Vite, Tailwind CSS, Firebase, and Recharts.

## Features

- **Dashboard**: View financial summaries, analytics charts, and recent transactions
- **Transaction Management**: Add, view, and delete transactions
- **Authentication**: Secure user authentication with Firebase Auth
- **Real-time Data**: Live updates using Firestore
- **Analytics**: Visual charts for income/expense trends and category breakdowns

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Firebase (Firestore + Auth)
- Recharts
- React Router

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration
   - Create a `.env` file in the root directory:
     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

3. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /transactions/{transactionId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, Layout
│   ├── dashboard/        # Dashboard-specific components
│   └── common/           # Reusable components
├── pages/                # Page components
├── context/              # React Context (Auth)
├── hooks/                # Custom React hooks
├── services/             # Firebase services
└── utils/                # Utility functions
```

## Usage

1. Sign up for a new account or log in
2. Navigate to the Dashboard to see your financial overview
3. Add transactions from the Transactions page
4. View analytics and category breakdowns on the Dashboard

## License

MIT

