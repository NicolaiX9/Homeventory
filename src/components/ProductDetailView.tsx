import React from 'react';
import { ChevronRight, Heart, ShoppingCart, Ruler, Plus, Minus, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBackToCatalog: () => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailView({
  product,
  allProducts,
  onBackToCatalog,
  onProductSelect,
  onAddToCart,
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [favorite, setFavorite] = React.useState(false);
  
  // Keep track of quantity boundary matches product stock
  React.useEffect(() => {
    setQuantity(1);
  }, [product]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const relatedProducts = React.useMemo(() => {
    // Recommend items of same category or random ones excluding current
    const matches = allProducts.filter((p) => p.id !== product.id);
    const categoryMatches = matches.filter((p) => p.category === product.category);
    if (categoryMatches.length >= 3) {
      return categoryMatches.slice(0, 4);
    }
    return matches.slice(0, 4);
  }, [product, allProducts]);

  const isCriticalStock = product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <div className="space-y-12" id="detail-view-container">
      {/* Breadcrumbs navigation trail */}
      <nav className="flex items-center gap-1 text-xs md:text-sm text-gray-500 font-sans">
        <button
          onClick={onBackToCatalog}
          className="hover:text-[#1a4d43] transition-colors"
          id="detail-breadcrumb-catalog"
        >
          Catálogo
        </button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400">Muebles</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="font-semibold text-gray-800 truncate max-w-[180px] md:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main product setup block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative group shadow-sm">
            <img
              alt="Vista de producto"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-in-out"
              src={product.image}
            />
            {/* Wishlist triggers */}
            <button
              onClick={() => setFavorite(!favorite)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-[#1a4d43] active:scale-95 shadow-sm transition-all"
              aria-label="Añadir a deseados"
              id="detail-wishlist-btn"
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Dummy thumbnails for design high fidelity */}
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-video rounded-lg overflow-hidden border-2 border-[#1a4d43] cursor-pointer shadow-sm">
              <img alt="Thumbnail principal" className="w-full h-full object-cover" src={product.image} />
            </div>
            {/* Synthesizing auxiliary detail photos */}
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-[#faf9f7] opacity-75 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-xs text-gray-400 font-medium select-none">
              <img alt="Auxiliar 1" className="w-full h-full object-cover opacity-80" src={product.image} />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-[#faf9f7] opacity-75 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-xs text-gray-400 font-medium select-none">
              <img alt="Auxiliar 2" className="w-full h-full object-cover opacity-60 filter saturate-50" src={product.image} />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold select-none cursor-pointer">
              <span className="text-sm font-sans">360°</span>
              <span>INTERIOR</span>
            </div>
          </div>
        </div>

        {/* Right column: Details and purchase parameters */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1">
          {/* Title header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {outOfStock ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wide">
                  Sin Stock
                </span>
              ) : isCriticalStock ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Stock Crítico
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide">
                  Disponible
                </span>
              )}
              <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="font-display text-2xl md:text-3xl text-[#00362d] font-black">
              {formatCLP(product.price)}
            </p>

            <div className="border-t border-gray-100 pt-4">
              <p className="font-sans text-sm text-gray-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
          </div>

          {/* Specifications dimensions card */}
          <div className="bg-[#e8e2d9]/40 border border-gray-200/50 rounded-xl p-5 my-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a4d43]/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
            
            <h3 className="font-display text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Ruler className="w-4.5 h-4.5 text-[#1a4d43]" />
              Dimensiones Técnicas
            </h3>

            <div className="grid grid-cols-3 gap-3 divide-x divide-gray-200 text-center">
              <div>
                <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Largo
                </span>
                <span className="font-sans text-sm font-semibold text-gray-800">
                  {product.dimensions?.largo || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Ancho
                </span>
                <span className="font-sans text-sm font-semibold text-gray-800">
                  {product.dimensions?.ancho || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Alto
                </span>
                <span className="font-sans text-sm font-semibold text-gray-800">
                  {product.dimensions?.alto || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & controls list block */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-gray-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-gray-400' : isCriticalStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                {outOfStock ? 'No quedan unidades disponibles' : `${product.stock} unidades disponibles`}
              </p>

              {/* Quantity selector buttons */}
              {!outOfStock && (
                <div className="flex items-center bg-[#f4f3f1] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity === 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 text-gray-500 disabled:opacity-40 transition-colors"
                    aria-label="Disminuir unidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-sans font-bold text-sm text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity === product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 text-gray-500 disabled:opacity-40 transition-colors"
                    aria-label="Aumentar unidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Solid deep evergreen button */}
            <button
              onClick={() => onAddToCart(product, quantity)}
              disabled={outOfStock}
              className={`w-full font-display font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                outOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-[#1a4d43] hover:bg-[#00362d] text-white active:scale-99 shadow-md'
              }`}
              id="detail-add-to-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {outOfStock ? 'Sin stock disponible' : 'Añadir al Carrito'}
            </button>
          </div>
        </div>
      </div>

      {/* Recommended complete space section */}
      <hr className="border-gray-200" />

      <section className="space-y-6" id="detail-related-space">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1a4d43] fill-current" />
            Completa el Espacio
          </h2>
          <button
            onClick={onBackToCatalog}
            className="text-xs md:text-sm font-semibold text-[#1a4d43] hover:text-[#00362d] flex items-center gap-1 hover:underline font-sans"
            id="detail-view-all-btn"
          >
            Ver catálogo entero
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onProductSelect(p)}
              className="bg-white hover:bg-gray-50/50 rounded-xl p-3 border border-gray-100 hover:border-[#1a4d43]/20 shadow-sm cursor-pointer group transition-all duration-300"
              id={`related-card-${p.id}`}
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3">
                <img
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={p.image}
                />
              </div>
              <h4 className="font-display text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#1a4d43] transition-colors">
                {p.name}
              </h4>
              <p className="text-[11px] font-sans text-gray-400 capitalize mt-0.5">{p.category}</p>
              <p className="font-display text-sm text-[#1a4d43] font-extrabold mt-2">
                {formatCLP(p.price)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
