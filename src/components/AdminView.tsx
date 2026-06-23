import React from 'react';
import { Search, Edit, Trash2, Plus, Save, BarChart3, TrendingUp, AlertTriangle, Download, X } from 'lucide-react';
import { Product, Category, Material } from '../types';

interface AdminViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDeleteProducts?: (productIds: string[]) => void;
}

export default function AdminView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteProducts,
}: AdminViewProps) {
  const [search, setSearch] = React.useState('');
  
  // Form states
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState<Category>('Living');
  const [material, setMaterial] = React.useState<Material>('Madera');
  const [stock, setStock] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [image, setImage] = React.useState('');
  const [largo, setLargo] = React.useState('');
  const [ancho, setAncho] = React.useState('');
  const [alto, setAlto] = React.useState('');

  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Toggle selection for single item
  const handleToggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Toggle selection for all queried items
  const handleToggleSelectAll = () => {
    const allQueriedIds = queriedProducts.map((p) => p.id);
    const areAllSelected = allQueriedIds.length > 0 && allQueriedIds.every((id) => selectedIds.includes(id));

    if (areAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allQueriedIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const uniqueIds = new Set([...prev, ...allQueriedIds]);
        return Array.from(uniqueIds);
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = selectedIds.length === 1 
      ? '¿Está seguro de eliminar el producto seleccionado de la base de datos?' 
      : `¿Está seguro de eliminar los ${selectedIds.length} productos seleccionados del catálogo?`;
    if (window.confirm(confirmMsg)) {
      if (onDeleteProducts) {
        onDeleteProducts(selectedIds);
      } else {
        // Fallback
        selectedIds.forEach((id) => onDeleteProduct(id));
      }
      setSelectedIds([]);
    }
  };

  // Filter products by name or SKU
  const queriedProducts = React.useMemo(() => {
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [products, search]);

  const criticalStockItemsCount = React.useMemo(() => {
    return products.filter((p) => p.stock <= 5).length;
  }, [products]);

  const totalCatalogWorth = React.useMemo(() => {
    return products.reduce((acc, p) => acc + p.price * p.stock, 0);
  }, [products]);

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Switch to editing mode helper
  const handleEditSelect = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setMaterial(product.material);
    setStock(product.stock.toString());
    setSku(product.sku);
    setImage(product.image);
    
    // Extract numbers if they end with ' cm'
    const parseDim = (str: string) => {
      const parsed = parseFloat(str);
      return isNaN(parsed) ? '' : parsed.toString();
    };
    setLargo(parseDim(product.dimensions?.largo || ''));
    setAncho(parseDim(product.dimensions?.ancho || ''));
    setAlto(parseDim(product.dimensions?.alto || ''));
    
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Living');
    setMaterial('Madera');
    setStock('');
    setSku('');
    setImage('');
    setLargo('');
    setAncho('');
    setAlto('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!name || !sku || !price || !stock || !description || !largo || !ancho || !alto) {
      setFormError('Por favor llene todos los campos obligatorios indicados (*)');
      return;
    }
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('El precio debe ser un número mayor a cero.');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormError('La cantidad en stock debe ser cero o superior.');
      return;
    }

    // Dimension numbers validation: must be string parseable to positive num > 0
    const numLargo = parseFloat(largo);
    const numAncho = parseFloat(ancho);
    const numAlto = parseFloat(alto);

    if (isNaN(numLargo) || numLargo <= 0) {
      setFormError('El largo de la dimensión debe ser un valor numérico y superior a 0.');
      return;
    }
    if (isNaN(numAncho) || numAncho <= 0) {
      setFormError('El ancho de la dimensión debe ser un valor numérico y superior a 0.');
      return;
    }
    if (isNaN(numAlto) || numAlto <= 0) {
      setFormError('El alto de la dimensión debe ser un valor numérico y superior a 0.');
      return;
    }

    const defaultImage = image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600';

    const productPayload: Product = {
      id: editingId || Date.now().toString(),
      name,
      sku,
      category,
      material,
      price: parsedPrice,
      stock: parsedStock,
      description,
      image: defaultImage,
      dimensions: {
        largo: `${numLargo} cm`,
        ancho: `${numAncho} cm`,
        alto: `${numAlto} cm`
      }
    };

    if (editingId) {
      onUpdateProduct(productPayload);
      setFormSuccess('¡Producto actualizado exitosamente!');
      setEditingId(null);
    } else {
      // Check SKU uniqueness
      if (products.some((p) => p.sku.toLowerCase() === sku.toLowerCase())) {
        setFormError('Ya existe un producto con el mismo código SKU.');
        return;
      }
      onAddProduct(productPayload);
      setFormSuccess('¡Producto ingresado al catálogo exitosamente!');
    }

    // Reset fields
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Living');
    setMaterial('Madera');
    setStock('');
    setSku('');
    setImage('');
    setLargo('');
    setAncho('');
    setAlto('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in" id="admin-container">
      {/* Dashboard Header block */}
      <div className="col-span-1 lg:col-span-12 space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Panel de Administración
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-sans">
          Gestión integral de stock, inventario, reportes ejecutivos y nuevos ingresos de artículos.
        </p>
      </div>

      {/* Main Table: Left column */}
      <section className="col-span-1 lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl text-gray-800">
              Inventario Actual
            </h2>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all animate-scale-in"
                id="admin-bulk-delete-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar seleccionados ({selectedIds.length})
              </button>
            )}
          </div>
          {/* Quick inline search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="lg:w-full bg-[#f4f3f1] border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
              placeholder="Buscar por SKU o Nombre..."
              id="admin-inventory-search"
            />
          </div>
        </div>

        {/* Inventory listing table element */}
        <div className="overflow-x-auto rounded-lg border border-gray-200/60 bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#f4f3f1] text-[#615e57] border-b border-gray-200">
              <tr>
                <th className="p-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={queriedProducts.length > 0 && queriedProducts.every((p) => selectedIds.includes(p.id))}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#1a4d43] focus:ring-[#1a4d43] w-4 h-4 cursor-pointer"
                    id="checkbox-select-all"
                  />
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans">Nombre del Mueble</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans">SKU</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans">Categoría</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans text-right">Precio</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans text-center">Stock</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] font-sans text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queriedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No se encontraron productos en el inventario actual.
                  </td>
                </tr>
              ) : (
                queriedProducts.map((product) => {
                  const isCritical = product.stock <= 5;
                  const outOfStock = product.stock === 0;
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        isSelected
                          ? 'bg-[#1a4d43]/10'
                          : outOfStock 
                            ? 'bg-gray-100/45' 
                            : isCritical 
                              ? 'bg-red-50/15' 
                              : ''
                      }`}
                      id={`row-${product.id}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded text-[#1a4d43] focus:ring-[#1a4d43] w-4 h-4 cursor-pointer"
                          id={`checkbox-select-${product.id}`}
                        />
                      </td>
                      <td className="p-3.5 font-sans font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                        </div>
                        <span className="truncate max-w-[150px] md:max-w-none">{product.name}</span>
                      </td>
                      <td className="p-3.5 text-gray-500 font-mono text-xs">{product.sku}</td>
                      <td className="p-3.5 text-gray-500">{product.category}</td>
                      <td className="p-3.5 text-right font-medium text-gray-900">{formatCLP(product.price)}</td>
                      <td className="p-3.5 text-center">
                        {outOfStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold shadow-sm">
                            Agotado
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold gap-1 shadow-sm border border-red-200 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {product.stock}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e8e2d9]/40 text-gray-700 text-xs font-semibold">
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditSelect(product)}
                            className="p-1 rounded text-gray-500 hover:text-[#1a4d43] hover:bg-gray-100 transition-colors"
                            aria-label="Editar producto"
                            id={`action-edit-${product.id}`}
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Está seguro de eliminar el producto "${product.name}" del catálogo?`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Eliminar producto"
                            id={`action-delete-${product.id}`}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Showing counts & standard pagination display */}
        <div className="flex justify-between items-center text-xs font-sans text-gray-500 pb-1 border-t border-gray-100 pt-4">
          <span>{`Mostrando ${queriedProducts.length} de ${products.length} productos registrados`}</span>
          <div className="flex gap-1.5">
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40" disabled>Ant</button>
            <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40" disabled>Sig</button>
          </div>
        </div>
      </section>

      {/* Right column: Forms and reports module */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
        {/* New / Edit Form */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a4d43]"></div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-gray-900 leading-tight">
              {editingId ? 'Editar Producto' : 'Ingresar Nuevo Producto'}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                id="cancel-edit-cross"
                aria-label="Cancelar edición"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Form validation responses feedback */}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs flex items-center gap-2">
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-name">
                Nombre del Mueble <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                placeholder="Ej: Silla de Oficina Ergo"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-sku">
                Código SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="prod-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono focus:outline-[#1a4d43]"
                placeholder="Ej: SIL-105-BL"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-category">
                  Categoría
                </label>
                <select
                  id="prod-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                >
                  <option value="Living">Living</option>
                  <option value="Comedor">Comedor</option>
                  <option value="Dormitorio">Dormitorio</option>
                  <option value="Jardín">Jardín</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-material">
                  Material
                </label>
                <select
                  id="prod-material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as Material)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                >
                  <option value="Madera">Madera</option>
                  <option value="Metal">Metal</option>
                  <option value="Tela">Tela</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-price">
                  Precio CLP ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="prod-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-stock">
                  Stock Inicial <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="prod-stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Dimensions Specifications inputs */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Dimensiones (cm) <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={largo}
                    onChange={(e) => setLargo(e.target.value)}
                    className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-[#1a4d43]"
                    placeholder="Largo (cm)"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={ancho}
                    onChange={(e) => setAncho(e.target.value)}
                    className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-[#1a4d43]"
                    placeholder="Ancho (cm)"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={alto}
                    onChange={(e) => setAlto(e.target.value)}
                    className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-[#1a4d43]"
                    placeholder="Alto (cm)"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-image">
                URL de Imagen
              </label>
              <input
                type="url"
                id="prod-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43]"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="prod-description">
                Descripción del Mueble <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prod-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f4f3f1] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-[#1a4d43] resize-none"
                placeholder="Detalle de materiales, terminaciones, diseño..."
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/2 border border-gray-200 hover:bg-gray-50 font-sans font-semibold py-2.5 rounded-lg text-xs"
                >
                  CANCELAR
                </button>
              )}
              <button
                type="submit"
                className={`flex justify-center items-center gap-1.5 bg-[#1a4d43] hover:bg-[#00362d] text-white font-display font-medium py-3 rounded-lg text-xs tracking-wider uppercase transition-colors ${
                  editingId ? 'w-1/2' : 'w-full'
                }`}
                id="submit-product-btn"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Guardar' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </section>

        {/* Executive summary analytics reports */}
        <section className="bg-[#f4f3f1] rounded-xl p-5 border border-gray-200/55 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-gray-800">
            <BarChart3 className="w-5 h-5 text-[#1a4d43]" />
            <h2 className="font-display font-bold text-[15px] uppercase tracking-wide">
              Módulo de Reportes
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200/50 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[11px] font-sans font-semibold text-gray-500">Valor de Catálogo</span>
              <span className="font-display text-base font-black text-[#1a4d43] truncate leading-none">
                {formatCLP(totalCatalogWorth)}
              </span>
              <span className="text-[10px] text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% vs mes anterior
              </span>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200/50 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[11px] font-sans font-semibold text-gray-500">Salud del Stock</span>
              {criticalStockItemsCount > 0 ? (
                <>
                  <span className="font-display text-base font-black text-amber-600 leading-none">
                    Crítico
                  </span>
                  <span className="text-[10px] text-red-500 flex items-center gap-1 font-semibold">
                    {criticalStockItemsCount} artículos con stock crítico
                  </span>
                </>
              ) : (
                <>
                  <span className="font-display text-base font-black text-green-600 leading-none">
                    Óptimo
                  </span>
                  <span className="text-[10px] text-gray-400">Totalmente cargado</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              // Simulates download report
              const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Homeventory_Reporte_${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              alert('Reporte descargado exitosamente como JSON de inventario móvil!');
            }}
            className="w-full bg-[#faf9f7] hover:bg-neutral-200/60 border border-gray-200 hover:border-gray-400 text-gray-700 font-sans font-semibold text-xs py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all"
            id="download-full-report-btn"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Descargar Reporte Completo
          </button>
        </section>
      </div>
    </div>
  );
}
