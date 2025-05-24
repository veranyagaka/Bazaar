
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Demo key for development - user needs to replace with their actual key
const PUBLISHABLE_KEY = "pk_test_demo-key-replace-with-actual-clerk-key"

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
