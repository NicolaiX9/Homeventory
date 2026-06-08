import React from 'react';
import { Home, ShoppingCart, LogIn, LogOut, User, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  cartCount: number;
  user: UserType;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  cartCount,
  user,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 w-full border-b border-neutral-200">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => {
            onViewChange('catalog');
            setProfileOpen(false);
          }}
          id="navbar-logo"
        >
          <Home className="w-8 h-8 text-[#1a4d43]" />
          <span className="font-display text-xl md:text-2xl font-bold text-[#00362d] tracking-tight">
            Homeventory
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => {
              onViewChange('catalog');
              setProfileOpen(false);
            }}
            className={`font-sans font-medium text-sm transition-all pb-1 hover:text-[#1a4d43] ${
              currentView === 'catalog' || currentView === 'detail'
                ? 'text-[#1a4d43] border-b-2 border-[#1a4d43] font-semibold'
                : 'text-gray-500'
            }`}
            id="nav-btn-catalog"
          >
            Catálogo
          </button>
          
          <button
            onClick={() => {
              onViewChange('admin');
              setProfileOpen(false);
            }}
            className={`font-sans font-medium text-sm transition-all pb-1 hover:text-[#1a4d43] ${
              currentView === 'admin'
                ? 'text-[#1a4d43] border-b-2 border-[#1a4d43] font-semibold'
                : 'text-gray-500'
            }`}
            id="nav-btn-admin"
          >
            Administración
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6 relative">
          {/* Cart Icon */}
          <button
            onClick={() => {
              onViewChange('cart');
              setProfileOpen(false);
            }}
            className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${
              currentView === 'cart' ? 'text-[#1a4d43] bg-gray-100' : 'text-gray-600'
            }`}
            aria-label="Ver carrito"
            id="navbar-cart-btn"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-semibold text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            {user.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden cursor-pointer hover:border-[#1a4d43] transition-colors focus:outline-none"
                  aria-label="Abrir menú usuario"
                  id="navbar-profile-btn"
                >
                  <img
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcL5vFDfFR-2S8DJIdGvZa4AO_kLpXeW6E4L7E7Qqr8QOFFb7iZGKwnsioSG6UrzGFNu0pnozqCggdJAWGEs7MAulAKRYhWTeC2Mk8SnIirDPA2hp1MvJcFbln9EpfNJ2NdiTOAyF_ucnZYidPR0YXTixXPY8uWzUdj8i0izqmoq0ImK5y-aJosyDoAKZ8z96FX7OGsRVL-xAny-mBGdOLIHANDS4oiCu1F4D76zukfOTeDrVaTGtApYigJ9OJ2GFUvai2S7ApA3Zg"
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#1a4d43] hover:text-[#1a4d43] transition-all font-medium"
                id="navbar-login-btn"
              >
                <LogIn className="w-4 h-4" />
                Ingresar
              </button>
            )}

            {/* Profile Menu dropdown */}
            {profileOpen && user.isAuthenticated && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onViewChange('admin');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Panel administración
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
