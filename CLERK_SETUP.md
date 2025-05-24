
# Clerk Authentication Setup for Bazaar

## Getting Started with Clerk

1. **Create a Clerk Account**
   - Visit https://go.clerk.com/lovable
   - Sign up for a free account
   - Create a new application

2. **Get Your Publishable Key**
   - In your Clerk dashboard, navigate to "API Keys"
   - Copy your "Publishable key" (starts with `pk_test_` or `pk_live_`)
   - Replace the demo key in `src/main.tsx` with your actual key

3. **Configure Authentication Methods**
   - In Clerk dashboard, go to "User & Authentication" > "Email, Phone, Username"
   - Enable Email + Password authentication
   - Enable Magic Links (recommended for rural users)
   - Optionally enable Phone/SMS for better rural access

4. **Set Up User Metadata**
   - Go to "User & Authentication" > "Metadata"
   - Add custom fields for user roles and farm/business information

## User Flow Configuration

### Sign-up Flow
```javascript
// In your sign-up component
<SignUp 
  appearance={{
    elements: {
      formButtonPrimary: 'bazaar-button',
      card: 'bazaar-card'
    }
  }}
  afterSignUpUrl="/onboarding"
  redirectUrl="/onboarding"
/>
```

### User Roles Implementation
After successful sign-up, users should be redirected to an onboarding flow where they:
1. Select their role (Farmer/Buyer)
2. Complete profile information
3. Set location preferences
4. Add crops (farmers) or business details (buyers)

### Webhook Configuration
Set up webhooks in Clerk to sync user data with Supabase:

```javascript
// Edge function: handle-clerk-webhook
export default async function handler(req) {
  const { type, data } = req.body;
  
  if (type === 'user.created') {
    // Insert user into Supabase profiles table
    await supabase.from('profiles').insert({
      id: data.id,
      email: data.email_addresses[0].email_address,
      first_name: data.first_name,
      last_name: data.last_name,
      role: 'farmer', // Default, to be updated in onboarding
    });
  }
}
```

## Custom Styling
Clerk components are styled to match Bazaar's dark theme using the appearance prop with custom CSS classes defined in the Tailwind config.

## Security Considerations
- Use environment variables for API keys
- Enable session management for better UX
- Set up proper CORS policies for production
- Consider implementing role-based access control (RBAC)

## Production Checklist
- [ ] Replace test keys with production keys
- [ ] Configure production domains in Clerk dashboard
- [ ] Set up webhook endpoints
- [ ] Enable two-factor authentication for admin users
- [ ] Configure email templates with Bazaar branding
