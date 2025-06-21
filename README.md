# JSON Firestore Manager

A modern web application for managing JSON data with Firebase authentication and Firestore storage. Features a beautiful UI for inputting JSON data, storing it in Firestore, and viewing/searching through stored records.

## Features

- 🔐 **Firebase Authentication** - Secure email/password authentication
- 📊 **JSON Input & Validation** - Easy JSON input with format validation
- 🔍 **Search & Filter** - Search through stored JSON data
- 📱 **Responsive Design** - Modern, mobile-friendly UI with Tailwind CSS
- ⚡ **Real-time Updates** - Live data updates using Firestore
- 🗑️ **CRUD Operations** - Create, read, and delete JSON records

## Technologies Used

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Aiassistent
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (see FIREBASE_SETUP.md for detailed instructions):
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update `src/firebase.ts` with your configuration

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Add JSON Data**: Use the left panel to input and validate JSON data
3. **View Data**: Browse stored records in the right panel with search functionality
4. **Search**: Use the search bar to filter through JSON content
5. **Manage Records**: View full JSON data or delete records as needed

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx       # Main dashboard layout
│   ├── Header.tsx         # Navigation header
│   ├── LoginForm.tsx      # Authentication form
│   ├── JsonInput.tsx      # JSON input component
│   └── DataTable.tsx      # Data display and search
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── firebase.ts            # Firebase configuration
├── types.ts              # TypeScript type definitions
├── App.tsx               # Main app component
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
