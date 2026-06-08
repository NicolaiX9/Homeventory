import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Lock, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  cart: CartItem[];
  allProducts: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (shippingCost: number) => void;
  onBackToCatalog: () => void;
}

export default function CartView({
  cart,
  allProducts,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBackToCatalog,
}: CartViewProps) {
  const [shippingMethod, setShippingMethod] = React.useState<'despacho' | 'retiro'>('despacho');

  // Compute products mapping
  const cartWithProducts = React.useMemo(() => {
    return cart.map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return {
        item,
        product,
      };
    }).filter((x) => x.product !== undefined) as Array<{ item: CartItem; product: Product }>;
  }, [cart, allProducts]);

  // Calculations
  const subtotal = React.useMemo(() => {
    return cartWithProducts.reduce((sum, item) => sum + item.product.price * item.item.quantity, 0);
  }, [cartWithProducts]);

  const totalItemsCount = React.useMemo(() => {
    return cartWithProducts.reduce((sum, item) => sum + item.item.quantity, 0);
  }, [cartWithProducts]);

  const tax = Math.round(subtotal * 0.19); // 19% IVA included
  const shippingCost = shippingMethod === 'despacho' ? 5990 : 0;
  const grandTotal = subtotal + shippingCost;

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleIncrement = (productId: string, currentQty: number, maxStock: number) => {
    if (currentQty < maxStock) {
      onUpdateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      onUpdateQuantity(productId, currentQty - 1);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-xl mx-auto space-y-6 shadow-sm animate-fade-in" id="cart-empty-state">
        <div className="w-16 h-16 bg-[#e8e2d9] rounded-full flex items-center justify-center mx-auto text-[#1a4d43]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-gray-900 tracking-tight">Tu carrito está vacío</h2>
          <p className="text-sm text-gray-500 font-sans max-w-sm mx-auto">
            Explora nuestro catálogo de muebles y añade artículos para empezar a decorar tu hogar.
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 bg-[#1a4d43] hover:bg-[#00362d] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors"
          id="cart-empty-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in" id="cart-view-container">
      {/* Title block */}
      <header className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Tu Carrito
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-sans">
          Revisa los artículos seleccionados antes de proceder al pago.
        </p>
      </header>

      {/* Cart details grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {cartWithProducts.map(({ item, product }) => (
            <article
              key={product.id}
              className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-level-1 border border-neutral-100 group relative"
              id={`cart-item-${product.id}`}
            >
              {/* Product Thumbnail */}
              <div className="w-24 h-24 shrink-0 bg-[#e9e8e6] rounded-lg overflow-hidden relative">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  src={product.image}
                />
              </div>

              {/* Product Info details */}
              <div className="flex-grow flex flex-col justify-between w-full">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-gray-900 leading-tight group-hover:text-[#1a4d43] transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 capitalize mt-1">
                      Material: {product.material} • Categoría: {product.category}
                    </p>
                  </div>

                  {/* Remove trigger button */}
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    aria-label="Quitar del carro"
                    id={`cart-remove-btn-${product.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Adjust quantities & price summary */}
                <div className="flex justify-between items-center mt-3 pt-2">
                  <div className="flex items-center bg-[#f4f3f1] border border-gray-200 rounded-lg shadow-sm">
                    <button
                      onClick={() => handleDecrement(product.id, item.quantity)}
                      disabled={item.quantity === 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-500 disabled:opacity-40 transition-colors"
                      aria-label="Restar uno"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-sans font-bold text-sm text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(product.id, item.quantity, product.stock)}
                      disabled={item.quantity === product.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-500 disabled:opacity-40 transition-colors"
                      id={`cart-add-qty-btn-${product.id}`}
                      aria-label="Sumar uno"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pricing */}
                  <span className="font-display text-base md:text-lg font-extrabold text-[#00362d]">
                    {formatCLP(product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right Side: Resumen Sidebar Summary */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-[#e8e2d9]/40 rounded-xl p-6 border border-gray-200/50 relative overflow-hidden shadow-sm flex flex-col gap-6">
            <h2 className="font-display text-lg font-bold text-gray-900 border-b border-gray-200/60 pb-3">
              Resumen de Compra
            </h2>

            {/* Calculations breakdown display */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-200/60 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal ({totalItemsCount} artículos)</span>
                <span className="font-medium text-gray-900">{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Impuestos incluidos (IVA 19%)</span>
                <span>{formatCLP(tax)}</span>
              </div>
            </div>

            {/* Shipping options container inputs */}
            <div className="space-y-4 pb-4 border-b border-gray-200/60">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                Método de Envío
              </h3>

              <div className="flex flex-col gap-2">
                <label 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                    shippingMethod === 'despacho'
                      ? 'border-[#1a4d43] bg-white'
                      : 'border-transparent hover:bg-white/40'
                  }`}
                  id="shipping-option-delivery"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'despacho'}
                    onChange={() => setShippingMethod('despacho')}
                    className="mt-1 text-[#1a4d43] focus:ring-[#1a4d43] w-4.5 h-4.5"
                  />
                  <div className="flex-grow text-xs font-sans">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Despacho a Domicilio</span>
                      <span>$5.990</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Región Metropolitana (2-3 días hábiles)</p>
                  </div>
                </label>

                <label 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                    shippingMethod === 'retiro'
                      ? 'border-[#1a4d43] bg-white'
                      : 'border-transparent hover:bg-white/40'
                  }`}
                  id="shipping-option-pickup"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'retiro'}
                    onChange={() => setShippingMethod('retiro')}
                    className="mt-1 text-[#1a4d43] focus:ring-[#1a4d43] w-4.5 h-4.5"
                  />
                  <div className="flex-grow text-xs font-sans">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Retiro en Tienda</span>
                      <span className="text-green-700 font-bold uppercase tracking-wide">Gratis</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Disponible hoy en Providencia</p>
                  </div>
                </label>
              </div>
            </div>

            {/* GRAND TOTAL */}
            <div className="flex justify-between items-end pt-2">
              <span className="font-display font-medium text-gray-700">Total</span>
              <div className="text-right">
                <span className="font-display text-2xl font-black text-[#1a4d43] leading-none mb-1 block">
                  {formatCLP(grandTotal)}
                </span>
                <p className="text-[10px] font-sans text-gray-400">Impuestos cobrados en pesos chilenos</p>
              </div>
            </div>

            {/* BUTTON TRIGGERS */}
            <div className="space-y-3 pt-3">
              <button
                onClick={() => onCheckout(shippingCost)}
                className="w-full bg-[#1a4d43] hover:bg-[#00362d] text-white font-display font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                id="cart-checkout-btn"
              >
                Proceder al pago
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <div className="relative flex items-center py-2 select-none">
                <div className="flex-grow border-t border-gray-300/40"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Pago rápido
                </span>
                <div className="flex-grow border-t border-gray-300/40"></div>
              </div>

              <button
                onClick={() => onCheckout(shippingCost)}
                className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-sans font-semibold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                id="cart-quickpay-btn"
              >
                <CreditCard className="w-5 h-5 text-gray-500" />
                Pagar Ahora
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center text-gray-400 text-xs py-2 select-none">
            <Lock className="w-4 h-4" />
            <span>Transacción segura y encriptada SSL</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
