
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X, TrendingUp, Users, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const navItems = [
    { name: 'Dashboard', href: '#dashboard', icon: TrendingUp },
    { name: 'Markets', href: '/markets', icon: TrendingUp },
    { name: 'Buyers', href: '/buyers', icon: Users },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ];
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.emailAddresses[0]?.emailAddress?.includes('admin');

  return (
    <nav className="bg-bazaar-card border-b border-gray-700/30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bazaar-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">Bazaar</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <SignedIn>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
                            {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-bazaar-card border border-gray-700",
                    userButtonPopoverText: "text-white"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bazaar-button">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 mr-3",
                    userButtonPopoverCard: "bg-bazaar-card border border-gray-700",
                    userButtonPopoverText: "text-white"
                  }
                }}
              />
            </SignedIn>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-bazaar-card border-t border-gray-700/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <SignedIn>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
                {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bazaar-button w-full mt-4">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
