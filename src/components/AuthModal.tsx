import React from 'react';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'Vendedor' | 'Administrador' | 'Cliente'>('Cliente');
  
  // Validation messages state
  const [error, setError] = React.useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation rules
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor ingrese un correo válido.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Process simulation
    const guestUser: User = {
      username: username || email.split('@')[0],
      email: email,
      role: 'Administrador', // Defecto para que puedan probar todas las funciones, o basándose en el toggle
      isAuthenticated: true,
    };
    onLoginSuccess(guestUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Registration validation rules
    if (!username || !email || !password) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor ingrese un correo válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres por seguridad.');
      return;
    }

    const newUser: User = {
      username: username,
      email: email,
      role: role,
      isAuthenticated: true,
    };
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="auth-modal-overlay">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-level-2 overflow-hidden relative border border-gray-100 flex flex-col max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal-content"
      >
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1a4d43]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
          id="auth-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto">
          {/* Logo & Info */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold text-[#00362d] tracking-tight">
              {isRegistering ? 'Crea tu Cuenta' : 'Inicia Sesión'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isRegistering 
                ? 'Regístrate en Homeventory y gestiona tu catálogo de hogar.'
                : 'Accede a tu cuenta para comprar, explorar y administrar.'
              }
            </p>
          </div>

          {/* Validation Feedback */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-bounce">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="reg-name">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="reg-name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                  placeholder="Ej: Nicolás Moyano"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="reg-email">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                  placeholder="nicolas@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="reg-role">
                  Rol de Usuario
                </label>
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full border border-gray-200 bg-white rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                >
                  <option value="Cliente">Cliente (Comprador)</option>
                  <option value="Administrador">Administrador (Gestión Total)</option>
                  <option value="Vendedor">Vendedor (Soporte)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="reg-pass">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="reg-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                id="reg-submit-btn"
              >
                <UserPlus className="w-4 h-4" />
                Registrarse & Acceder
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="login-email">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                  placeholder="nicolas@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1" htmlFor="login-pass">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="login-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#1a4d43] focus:ring-1 focus:ring-[#1a4d43] outline-none"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="rounded text-[#1a4d43] focus:ring-[#1a4d43] w-4 h-4" defaultChecked />
                  Recordarme
                </label>
                <a href="#forgot" className="text-[#1a4d43] hover:underline">¿Olvidaste tu contraseña?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                id="login-submit-btn"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
            {isRegistering ? (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError(null);
                  }}
                  className="text-[#1a4d43] hover:underline font-semibold"
                >
                  Inicia sesión aquí
                </button>
              </p>
            ) : (
              <p>
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError(null);
                  }}
                  className="text-[#1a4d43] hover:underline font-semibold"
                >
                  Regístrate ahora
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
