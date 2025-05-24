
import RoleOnboarding from '@/components/RoleOnboarding';
import { RedirectToSignIn } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const Onboarding = () => {
  return (
    <>
      <SignedIn>
        <RoleOnboarding />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Onboarding;
