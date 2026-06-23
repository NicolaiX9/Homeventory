import React from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CatalogView from './components/CatalogView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import AdminView from './components/AdminView';
import { getStoredProducts, saveProducts } from './data';
import { Product, CartItem, User } from './types';
import { Sparkles, Check, CheckCircle, ShoppingBag, X, Home, AlertTriangle } from 'lucide-react';

export default function App() {
  // Products storage source of truth
  const [products, setProducts] = React.useState<Product[]>([]);
  
  // Custom navigation views
  const [currentView, setCurrentView] = React.useState<string>('catalog');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Cart state persisted
  const [cart, setCart] = React.useState<CartItem[]>([]);

  // Authenticated user state matching the design mockups
  const [user, setUser] = React.useState<User>({
    username: 'Nicolás Sobarzo',
    email: 'nicolas.sobarzo@homeventory.cl',
    role: 'Administrador',
    isAuthenticated: true,
  });

  // Modal displays
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = React.useState<{
    id: string;
    total: number;
    itemsCount: number;
  } | null>(null);

  const [criticalAlertOpen, setCriticalAlertOpen] = React.useState(false);
  const [hasShownCriticalAlert, setHasShownCriticalAlert] = React.useState(false);

  // Load products & cart on mount
  React.useEffect(() => {
    setProducts(getStoredProducts());
    
    const savedCart = localStorage.getItem('homeventory_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading saved cart', e);
      }
    }
  }, []);

  // Trigger low stock warning pop-up automatically for Admin users
  React.useEffect(() => {
    if (user && user.isAuthenticated && user.role === 'Administrador' && !hasShownCriticalAlert && products.length > 0) {
      const lowStockProducts = products.filter((p) => p.stock < 5);
      if (lowStockProducts.length > 0) {
        setCriticalAlertOpen(true);
        setHasShownCriticalAlert(true);
      }
    }
  }, [user, products, hasShownCriticalAlert]);

  // Save cart changes
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('homeventory_cart', JSON.stringify(updatedCart));
  };

  // Toast dynamic trigger helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add Product (Admin Action)
  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveProducts(updated);
    showToast('¡Item agregado al inventario exitosamente!');
  };

  // Update Product (Admin Action)
  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    saveProducts(updated);
    
    // Maintain sync for active detail page
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
    showToast('¡Cambios guardados exitosamente!');
  };

  // Delete Product (Admin Action)
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
    
    // Clear out from cart if deleted
    const filteredCart = cart.filter((item) => item.productId !== productId);
    saveCartToStorage(filteredCart);

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
      setCurrentView('catalog');
    }
    showToast('¡Producto eliminado del inventario!');
  };

  // Delete Multiple Products (Admin Action)
  const handleDeleteProducts = (productIds: string[]) => {
    const updated = products.filter((p) => !productIds.includes(p.id));
    setProducts(updated);
    saveProducts(updated);
    
    // Clear out from cart if deleted
    const filteredCart = cart.filter((item) => !productIds.includes(item.productId));
    saveCartToStorage(filteredCart);

    if (selectedProduct && productIds.includes(selectedProduct.id)) {
      setSelectedProduct(null);
      setCurrentView('catalog');
    }
    showToast('Producto eliminado del inventario');
  };

  // Add to Cart Action (with selective quantities)
  const handleAddToCart = (product: Product, qtyToAdd: number = 1) => {
    if (product.stock === 0) {
      showToast('¡No queda stock disponible de este producto!');
      return;
    }

    const existingCartIndex = cart.findIndex((item) => item.productId === product.id);
    const updatedCart = [...cart];

    let finalQuantityInCart = qtyToAdd;

    if (existingCartIndex > -1) {
      const currentQty = updatedCart[existingCartIndex].quantity;
      const proposedQty = currentQty + qtyToAdd;
      
      if (proposedQty > product.stock) {
        // Clamp to max available stock
        updatedCart[existingCartIndex].quantity = product.stock;
        showToast(`Carro ajustado al stock máximo disponible de ${product.name}`);
      } else {
        updatedCart[existingCartIndex].quantity = proposedQty;
        showToast(`Añadido al carrito: ${qtyToAdd} x ${product.name}`);
      }
    } else {
      updatedCart.push({
        productId: product.id,
        quantity: qtyToAdd,
      });
      showToast(`Añadido al carrito: ${qtyToAdd} x ${product.name}`);
    }

    saveCartToStorage(updatedCart);
  };

  // Direct Cart changes
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) => 
      item.productId === productId ? { ...item, quantity } : item
    );
    saveCartToStorage(updatedCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    saveCartToStorage(updatedCart);
    showToast('Artículo de decoración removido');
  };

  // Checkout purchase simulator
  const handleCheckout = (shippingCost: number) => {
    // Deduct stock of items from inventory!
    const updatedProductsList = [...products];
    let billTotal = shippingCost;
    let itemsCount = 0;

    for (const cartItem of cart) {
      const productIndex = updatedProductsList.findIndex((p) => p.id === cartItem.productId);
      if (productIndex > -1) {
        const product = updatedProductsList[productIndex];
        // Deduct quantities
        const originalStock = product.stock;
        const finalStock = Math.max(0, originalStock - cartItem.quantity);
        product.stock = finalStock;
        
        billTotal += product.price * cartItem.quantity;
        itemsCount += cartItem.quantity;
      }
    }

    // Save final inventory state and empty cart
    setProducts(updatedProductsList);
    saveProducts(updatedProductsList);
    saveCartToStorage([]);

    // Open confirmation order notification
    setCheckoutSuccessOrder({
      id: `HV-${Math.floor(100000 + Math.random() * 900000)}`,
      total: billTotal,
      itemsCount: itemsCount,
    });
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    showToast(`¡Bienvenido de vuelta, ${authenticatedUser.username}!`);
  };

  const handleLogout = () => {
    setUser({
      username: '',
      email: '',
      role: 'Cliente',
      isAuthenticated: false,
    });
    showToast('Sesión cerrada con éxito');
  };

  // Breadcrumbs click selector
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex flex-col font-sans selection:bg-[#1a4d43] selection:text-white">
      {/* Navbar segment */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedProduct(null);
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Floating dynamic status toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00362d] text-white py-3 px-5 rounded-2xl flex items-center gap-3 shadow-md border border-white/10 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-[#8abdb0] fill-current shrink-0 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Main Container canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12">
        {/* Render active layout view */}
        {currentView === 'catalog' && (
          <CatalogView
            products={products}
            onProductClick={handleProductSelect}
            onAddToCart={(product) => handleAddToCart(product, 1)}
          />
        )}

        {currentView === 'detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onBackToCatalog={() => {
              setCurrentView('catalog');
              setSelectedProduct(null);
            }}
            onProductSelect={handleProductSelect}
            onAddToCart={(product, qty) => handleAddToCart(product, qty)}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cart={cart}
            allProducts={products}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'admin' && (
          user.isAuthenticated && user.role === 'Administrador' ? (
            <AdminView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onDeleteProducts={handleDeleteProducts}
            />
          ) : (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md mx-auto space-y-4 shadow-level-1 relative animate-scale-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500 rounded-t-3xl"></div>
              <div className="w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <AlertTriangle className="w-8 h-8 font-black" />
              </div>
              <h2 className="font-display text-2xl font-black text-gray-900 leading-tight">Acceso Restringido</h2>
              <p className="font-sans text-xs md:text-sm text-gray-500">
                Dicha funcionalidad solo debe ser del administrador. Por favor, inicia sesión con una cuenta autorizada para acceder a estos controles.
              </p>
              <button
                onClick={() => setCurrentView('catalog')}
                className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Volver al Catálogo
              </button>
            </div>
          )
        )}
      </main>

      {/* Register & login authentication popover modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleAuthSuccess}
        />
      )}

      {/* Successful Purchase Simulation Modal */}
      {checkoutSuccessOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="checkout-success-overlay">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-level-2 p-6 md:p-8 text-center border border-gray-100 flex flex-col relative animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500 rounded-t-3xl"></div>
            
            <button
              onClick={() => setCheckoutSuccessOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal de éxito"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
              <Check className="w-8 h-8 font-black" />
            </div>

            <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight leading-tight">
              ¡Compra Exitosa!
            </h2>
            <p className="text-sm text-gray-500 font-sans mt-2">
              Tu orden ha sido registrada correctamente. El stock del inventario se ha actualizado en tiempo real.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#f4f3f1] rounded-2xl p-4 my-6 text-sm flex flex-col gap-2 border border-gray-150">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-sans">N° de Orden</span>
                <span className="font-mono font-bold text-gray-800">{checkoutSuccessOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Total Cobrado</span>
                <span className="font-bold text-[#1a4d43]">
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0,
                  }).format(checkoutSuccessOrder.total)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-sans">Artículos Adquiridos</span>
                <span className="text-gray-600 font-medium">{checkoutSuccessOrder.itemsCount} unidades</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutSuccessOrder(null);
                setCurrentView('catalog');
              }}
              className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-display font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
              id="success-modal-continue-btn"
            >
              Volver al Catálogo
            </button>
          </div>
        </div>
      )}

      {criticalAlertOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="low-stock-modal-overlay">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-level-2 p-6 md:p-8 text-center border border-gray-100 flex flex-col relative animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500 rounded-t-3xl"></div>
            
            <button
              onClick={() => setCriticalAlertOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle className="w-8 h-8 font-black text-red-600" />
            </div>

            <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Alerta de Stock Crítico
            </h2>
            <p className="text-sm text-gray-400 font-sans mt-2">
              Se han detectado productos con existencias bajo el límite de seguridad (stock &lt; 5).
            </p>

            <div className="bg-red-50/50 rounded-2xl p-4 my-6 text-sm text-left border border-red-100 max-h-[180px] overflow-y-auto space-y-2">
              <span className="text-xs font-bold text-red-800 uppercase tracking-widest block">Productos Afectados:</span>
              {products.filter(p => p.stock < 5).map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs border-b border-red-100/40 pb-1 last:border-0 last:pb-0">
                  <span className="font-semibold text-gray-800 truncate max-w-[200px]">{p.name}</span>
                  <span className="font-mono text-red-700 font-bold bg-white px-2 py-0.5 rounded border border-red-200">Stock: {p.stock}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#1a4d43]/5 text-[#1a4d43] p-3 rounded-xl text-xs font-medium text-left mb-6 flex items-start gap-2 border border-[#1a4d43]/10">
              <span className="text-base select-none">📧</span>
              <div>
                <p className="font-bold">Notificación enviada por email</p>
                <p className="text-gray-650 leading-relaxed">Se ha despachado un correo electrónico automático de reabastecimiento a <strong>{user.email || 'administrador@homeventory.cl'}</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setCriticalAlertOpen(false)}
              className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-display font-semibold py-3 px-4 rounded-xl transition-colors shadow-md text-sm"
              id="low-stock-modal-close-btn"
            >
              Entendido y Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Ambient Footer matching instructions and mockups */}
      <footer className="bg-[#efeeec] border-t border-neutral-300 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-[#1a4d43] shrink-0" />
            <span className="font-display text-lg font-bold text-[#1a4d43] tracking-tight">
              Homeventory
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-sans text-xs md:text-sm text-gray-500">
            <a className="hover:text-[#1a4d43] hover:underline" href="#tos">Términos de Servicio</a>
            <a className="hover:text-[#1a4d43] hover:underline" href="#privacy">Política de Privacidad</a>
            <a className="hover:text-[#1a4d43] hover:underline" href="#contact">Contáctanos</a>
          </div>

          <div className="font-sans text-xs md:text-sm text-gray-500 text-center md:text-right">
            © 2026 Homeventory. DUOC UC School of Informatics.
          </div>
        </div>
      </footer>
    </div>
  );
}
