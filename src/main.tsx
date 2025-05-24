
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Demo key for development - user needs to replace with their actual key
const PUBLISHABLE_KEY = "pk_test_cmVmaW5lZC1kb3ZlLTY0LmNsZXJrLmFjY291bnRzLmRldiQ"

// Check if we have a valid Clerk key
const isValidClerkKey = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes('demo-key-replace')

const ClerkSetupMessage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
    <div className="max-w-md text-center space-y-6">
      <h1 className="text-2xl font-bold text-orange-500">Bazaar Setup Required</h1>
      <div className="space-y-4 text-gray-300">
        <p>To use Bazaar, you need to set up Clerk authentication:</p>
        <ol className="text-left space-y-2 text-sm">
          <li>1. Visit <a href="https://go.clerk.com/lovable" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">https://go.clerk.com/lovable</a></li>
          <li>2. Create a free Clerk account</li>
          <li>3. Create a new application</li>
          <li>4. Copy your publishable key from the API Keys section</li>
          <li>5. Replace the demo key in <code className="bg-gray-800 px-1 rounded">src/main.tsx</code></li>
        </ol>
        <p className="text-xs text-gray-400 mt-4">
          Look for: <code className="bg-gray-800 px-1 rounded">pk_test_demo-key-replace-with-actual-clerk-key</code>
        </p>
      </div>
    </div>
  </div>
)

createRoot(document.getElementById("root")!).render(
  isValidClerkKey ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  ) : (
    <ClerkSetupMessage />
  )
);
