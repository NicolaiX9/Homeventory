import React from 'react';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import { Product, Category, Material } from '../types';

interface CatalogViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function CatalogView({
  products,
  onProductClick,
  onAddToCart,
}: CatalogViewProps) {
  // Filters state
  const [search, setSearch] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<Category[]>([
    'Living', 'Comedor', 'Dormitorio', 'Jardín'
  ]);
  const [minPrice, setMinPrice] = React.useState<string>('');
  const [maxPrice, setMaxPrice] = React.useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = React.useState<Material | null>(null);

  // Toggle category helper
  const handleCategoryToggle = (category: Category) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      } else {
        // Reset to all if checking off last one
        setSelectedCategories(['Living', 'Comedor', 'Dormitorio', 'Jardín']);
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filtered products list
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Search matches name or description
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      // Category matches
      const matchesCategory = selectedCategories.includes(product.category);

      // Price matches
      const minNum = minPrice !== '' ? parseFloat(minPrice) : 0;
      const maxNum = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = product.price >= minNum && product.price <= maxNum;

      // Material matches
      const matchesMaterial =
        selectedMaterial === null || product.material === selectedMaterial;

      return matchesSearch && matchesCategory && matchesPrice && matchesMaterial;
    });
  }, [products, search, selectedCategories, minPrice, maxPrice, selectedMaterial]);

  // Format Helper
  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-12" id="catalog-container">
      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-[#e3e2e0] shadow-level-1 flex items-center px-6 md:px-16">
        <img
          alt="Interior del living"
          className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-multiply z-0 filter brightness-95"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcuIubhMU4u8ZVsLopAGdrJcp2HsDmwxY6APdn-vF6r6N4i1RrdPFcc6TlbkkUirFOt6rJSwt3CNg1YKPvX4M7epXIpYRoW9HX6cC6O9TRtruwKpvQ1BnxN9uu7LEp2AU0Gvq_GiqwSv6qxpk-PhcR2GDeoEj_itWL9vSvmRimFBBGJW_JJuUZ9TPp9h5_sqiDRfL5iAVuWsVhE7c-k3k9XnXUPOO9ToTAPZY4yXJCpMXNznq9KymmP2yjWOTI3jKqVpSzY8XwetJ9"
        />
        <div className="relative z-10 max-w-2xl bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/20 shadow-sm animate-fade-in text-[#00362d] md:bg-transparent md:backdrop-blur-none md:p-0 md:shadow-none">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 select-none leading-tight md:text-[#00362d]">
            Muebles que cuentan tu historia.
          </h1>
          <p className="font-sans text-base md:text-lg text-gray-700 max-w-lg leading-relaxed">
            Descubre piezas diseñadas con precisión geométrica y calidez residencial. Organiza tu espacio con elegancia y confort hogareño.
          </p>
        </div>
      </section>

      {/* Main filter & catalog grid layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-8 sticky top-24 z-10">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Filter className="w-5 h-5 text-[#1a4d43]" />
            <h2 className="font-display text-[#00362d] font-bold text-lg">Filtros de Búsqueda</h2>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 font-sans text-sm text-gray-800 placeholder-gray-400 focus:outline-[#1a4d43]"
              placeholder="Buscar en catálogo..."
              id="catalog-search"
            />
          </div>

          {/* Categories select checklist */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Categorías
            </h3>
            <div className="flex flex-col gap-3">
              {(['Living', 'Comedor', 'Dormitorio', 'Jardín'] as Category[]).map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer group select-none text-sm text-gray-700 hover:text-[#00362d] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="w-4.5 h-4.5 text-[#1a4d43] border-gray-200 rounded focus:ring-1 focus:ring-[#1a4d43]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Boundaries */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Rango de Precio
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                placeholder="Mínimo"
                id="price-min"
              />
              <span className="text-gray-400 font-sans">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                placeholder="Máximo"
                id="price-max"
              />
            </div>
          </div>

          {/* Material Select buttons */}
          <div className="space-y-4 pb-2">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Material Predominante
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMaterial(selectedMaterial === 'Madera' ? null : 'Madera')}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  selectedMaterial === 'Madera'
                    ? 'border-[#1a4d43] bg-[#e8e2d9] text-[#1a4d43]'
                    : 'border-gray-200 bg-[#f4f3f1] text-gray-600 hover:border-gray-400'
                }`}
                id="material-filter-madera"
              >
                Madera
              </button>
              <button
                onClick={() => setSelectedMaterial(selectedMaterial === 'Metal' ? null : 'Metal')}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  selectedMaterial === 'Metal'
                    ? 'border-[#1a4d43] bg-[#e8e2d9] text-[#1a4d43]'
                    : 'border-gray-200 bg-[#f4f3f1] text-gray-600 hover:border-gray-400'
                }`}
                id="material-filter-metal"
              >
                Metal
              </button>
              <button
                onClick={() => setSelectedMaterial(selectedMaterial === 'Tela' ? null : 'Tela')}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                  selectedMaterial === 'Tela'
                    ? 'border-[#1a4d43] bg-[#e8e2d9] text-[#1a4d43]'
                    : 'border-gray-200 bg-[#f4f3f1] text-gray-600 hover:border-gray-400'
                }`}
                id="material-filter-tela"
              >
                Tela
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="w-full lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
              <p className="text-gray-500 font-sans mb-1 text-lg">No encontramos productos que coincidan.</p>
              <p className="text-gray-400 text-sm">Prueba ajustando tus filtros o ingresando otro término de búsqueda.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategories(['Living', 'Comedor', 'Dormitorio', 'Jardín']);
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedMaterial(null);
                }}
                className="mt-6 px-4 py-2 border border-gray-200 hover:border-[#1a4d43] hover:text-[#1a4d43] rounded-lg text-sm font-medium transition-all"
                id="reset-filters-btn"
              >
                Limpiar todo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="catalog-grid">
              {filteredProducts.map((product) => {
                const isCritical = product.stock <= 5;
                const outOfStock = product.stock === 0;

                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-xl p-3 shadow-level-1 border border-neutral-100 flex flex-col group hover:shadow-level-2 transition-all duration-300 transform hover:-translate-y-0.5"
                    id={`product-card-${product.id}`}
                  >
                    {/* Visual container & thumbnail */}
                    <div 
                      onClick={() => onProductClick(product)}
                      className="w-full h-48 rounded-lg overflow-hidden bg-[#e9e8e6] relative cursor-pointer"
                    >
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                      />
                      {/* Highlight Labels */}
                      {outOfStock ? (
                        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Agotado
                        </div>
                      ) : isCritical ? (
                        <div className="absolute top-2 right-2 bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Últimas unidades
                        </div>
                      ) : null}
                    </div>

                    {/* Metadata detail summary inside card */}
                    <div className="p-2 flex-grow flex flex-col justify-between mt-3">
                      <div className="cursor-pointer" onClick={() => onProductClick(product)}>
                        <h2 className="font-display text-lg font-bold text-gray-900 leading-tight group-hover:text-[#1a4d43] transition-colors line-clamp-1">
                          {product.name}
                        </h2>
                        <p className="font-sans text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
                          {product.description}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium select-none">
                            {product.category}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium select-none">
                            {product.material}
                          </span>
                        </div>
                      </div>

                      {/* Action purchase trigger box */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <span className="font-display text-lg text-[#00362d] font-extrabold">
                          {formatCLP(product.price)}
                        </span>
                        <button
                          onClick={() => !outOfStock && onAddToCart(product)}
                          disabled={outOfStock}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            outOfStock
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#1a4d43] text-white hover:bg-[#00362d] active:scale-95 shadow-sm'
                          }`}
                          aria-label="Añadir un artículo al carro"
                          id={`add-to-cart-btn-${product.id}`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
