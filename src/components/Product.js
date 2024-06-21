import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import Pagination from './Pagination';
import FilterPanel from './FilterPanel';
import ProductItem from './ProductItem';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [currency, setCurrency] = useState('TL');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 1, TL: 1 });
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    title: '',
    brand: '',
    barcode: '',
    stockCode: '',
    startDate: '',
    endDate: '',
    dateQueryType: '',
    productMainId: '',
    brandIds: '',
    approved: false,
    archived: false,
    onSale: false,
    rejected: false,
    blacklisted: false,
    inStock: false,
  });
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState('list'); // 'list' or 'grid'

  const fetchExchangeRates = () => {
    axios.get('http://127.0.0.1:5000/api/exchange_rates')
      .then(response => {
        setExchangeRates(response.data);
        console.log('Exchange rates:', response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the exchange rates!', error);
      });
  };

  const fetchAllProducts = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:5000/api/products')
      .then(response => {
        setProducts(response.data);
        applyFilters(response.data, filterValues);
        setTotalPages(Math.ceil(response.data.length / size));
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    axios.get('http://127.0.0.1:5000/api/categories')
      .then(response => {
        setCategories(response.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {}));
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  };

  useEffect(() => {
    fetchAllProducts();
    fetchExchangeRates();
    fetchCategories();
    const interval = setInterval(fetchExchangeRates, 1800000); // Update exchange rates every 30 minutes
    return () => clearInterval(interval);
  }, []);

  const applyFilters = (products, filters) => {
    let filtered = products;

    if (filters.title) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.barcode) {
      filtered = filtered.filter(product =>
        product.barcode.toLowerCase().includes(filters.barcode.toLowerCase())
      );
    }

    if (filters.stockCode) {
      filtered = filtered.filter(product =>
        product.stockCode.toLowerCase().includes(filters.stockCode.toLowerCase())
      );
    }

    applySorting(filtered);
  };

  const applySorting = (products) => {
    let sortedProducts = [...products];
    if (sortField) {
      sortedProducts.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    setFilteredProducts(sortedProducts);
    setTotalPages(Math.ceil(sortedProducts.length / size));
  };

  useEffect(() => {
    applyFilters(products, filterValues);
    setPage(0); // Reset page when filters change
  }, [filterValues, products]);

  useEffect(() => {
    applySorting(filteredProducts);
  }, [sortField, sortOrder]);

  useEffect(() => {
    applySorting(filteredProducts);
  }, [page, size]);

  const displayedProducts = filteredProducts.slice(page * size, (page + 1) * size);

  const handleCheckboxChange = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    const filteredProductIds = filteredProducts.map(product => product.id);
    if (selectedProducts.length === filteredProductIds.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProductIds);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on selected products:`, selectedProducts);
  };

  const handleActivation = (productId, marketplace) => {
    console.log(`Activate product ${productId} on ${marketplace}`);
  };

  const handleExport = (format) => {
    console.log(`Exporting selected products as ${format}`);
  };

  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(0);
  };

  const handleDoubleClick = (productId, currentPrice) => {
    setEditingPriceId(productId);
    setNewPrice(currentPrice);
  };

  const handleSavePrice = (productId) => {
    console.log(`Saving new price for product ${productId}: ${newPrice}`);
    setEditingPriceId(null);
  };

  const handleCurrencyClick = () => {
    const nextCurrency = currency === 'TL' ? 'USD' : currency === 'USD' ? 'EUR' : 'TL';
    setCurrency(nextCurrency);
  };

  const getConvertedPrice = (price) => {
    if (currency === 'TL') {
      return price.toFixed(2); // TL olarak fiyatı göster
    } else {
      return (price / exchangeRates[currency]).toFixed(2); // Seçilen para birimine göre fiyatı dönüştür
    }
  };
  

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilterValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({
      title: '',
      brand: '',
      barcode: '',
      stockCode: '',
      startDate: '',
      endDate: '',
      dateQueryType: '',
      productMainId: '',
      brandIds: '',
      approved: false,
      archived: false,
      onSale: false,
      rejected: false,
      blacklisted: false,
      inStock: false,
    });
    fetchAllProducts({});
  };

  const toggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen);
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  };

  return (
    <div className="products">
      <div className="sorting-panel">
        <label htmlFor="sortCriteria">Sırala:</label>
        <select
          id="sortCriteria"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="title">Ürün Adı (A-Z)</option>
          <option value="titleDesc">Ürün Adı (Z-A)</option>
          <option value="last_update_date">Güncellenme Tarihi (Artan)</option>
          <option value="last_update_date_desc">Güncellenme Tarihi (Azalan)</option>
        </select>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Artan</option>
          <option value="desc">Azalan</option>
        </select>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        changePage={changePage}
        size={size}
        handleSizeChange={handleSizeChange}
      />

      <div className="bulk-action-panel">
        <button onClick={handleSelectAll}>
          {selectedProducts.length === filteredProducts.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
        </button>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="filter-button">Filtre</button>
      </div>

      {isFilterOpen && (
        <FilterPanel
          filterValues={filterValues}
          handleFilterChange={handleFilterChange}
          handleClearFilters={handleClearFilters}
          toggleAdvancedFilters={toggleAdvancedFilters}
          isAdvancedFiltersOpen={isAdvancedFiltersOpen}
        />
      )}

      {selectedProducts.length > 0 && (
        <div className="active-action-panel">
          <button onClick={() => handleBulkAction('updatePrice')}>Toplu Fiyat Güncelle</button>
          <button onClick={() => handleBulkAction('marketplaceActions')}>Pazaryeri İşlemleri</button>
          <button onClick={() => handleBulkAction('delete')}>Ürünleri Sil</button>
          <button onClick={() => handleBulkAction('unlimitedStock')}>Sınırsız Stok Aktif Et</button>
          <button onClick={() => handleExport('csv')}>Dışa Aktar (CSV)</button>
          <button onClick={() => handleExport('xlsx')}>Dışa Aktar (XLSX)</button>
          <button onClick={() => handleBulkAction('inventoryReport')}>Hızlı Envanter Raporu Oluştur</button>
        </div>
      )}

      <h1 className="page-title">Ürünler</h1>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <ul className={`product-list ${displayMode}`}>
          {displayedProducts.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              selectedProducts={selectedProducts}
              handleCheckboxChange={handleCheckboxChange}
              handleDoubleClick={handleDoubleClick}
              handleSavePrice={handleSavePrice}
              handleCurrencyClick={handleCurrencyClick}
              getConvertedPrice={getConvertedPrice}
              handleActivation={handleActivation}
              editingPriceId={editingPriceId}
              newPrice={newPrice}
              setNewPrice={setNewPrice}
              currency={currency}
              exchangeRates={exchangeRates}
              categories={categories}
            />
          ))}
        </ul>
      )}

      {selectedProducts.length > 0 && (
        <div className="selection-popup">
          {selectedProducts.length} ürün seçildi
        </div>
      )}
    </div>
  );
};

export default Products;
