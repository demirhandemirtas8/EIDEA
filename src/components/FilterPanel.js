import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterPanel = ({ filterValues, handleFilterChange, handleClearFilters, toggleAdvancedFilters, isAdvancedFiltersOpen }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Kategorileri API'den çekin
    axios.get('http://127.0.0.1:5000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Kategoriler alınırken bir hata oluştu:', error);
      });
  }, []);

  return (
    <div className="filter-panel">
      <div className="basic-filters">
        <input
          type="text"
          name="title"
          placeholder="Ürün Adı"
          value={filterValues.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="brand"
          placeholder="Marka"
          value={filterValues.brand}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="barcode"
          placeholder="Barkod"
          value={filterValues.barcode}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="stockCode"
          placeholder="Stok Kodu"
          value={filterValues.stockCode}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          value={filterValues.category}
          onChange={handleFilterChange}
        >
          <option value="">Kategori Seçin</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <button onClick={toggleAdvancedFilters} className="toggle-advanced-filters">
        {isAdvancedFiltersOpen ? 'Gelişmiş Filtreleri Gizle' : 'Gelişmiş Filtreleri Göster'}
      </button>
      {isAdvancedFiltersOpen && (
        <div className="advanced-filters">
          <input
            type="number"
            name="startDate"
            placeholder="Başlangıç Tarihi"
            value={filterValues.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="endDate"
            placeholder="Bitiş Tarihi"
            value={filterValues.endDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="dateQueryType"
            placeholder="Tarih Tipi"
            value={filterValues.dateQueryType}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="productMainId"
            placeholder="Ürün Ana Kodu"
            value={filterValues.productMainId}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="brandIds"
            placeholder="Marka ID'leri (virgülle ayrılmış)"
            value={filterValues.brandIds}
            onChange={handleFilterChange}
          />
          <div className="filter-checkboxes">
            <label>
              <input
                type="checkbox"
                name="approved"
                checked={filterValues.approved}
                onChange={handleFilterChange}
              />
              Onaylı
            </label>
            <label>
              <input
                type="checkbox"
                name="archived"
                checked={filterValues.archived}
                onChange={handleFilterChange}
              />
              Arşivlenmiş
            </label>
            <label>
              <input
                type="checkbox"
                name="onSale"
                checked={filterValues.onSale}
                onChange={handleFilterChange}
              />
              Satışta
            </label>
            <label>
              <input
                type="checkbox"
                name="rejected"
                checked={filterValues.rejected}
                onChange={handleFilterChange}
              />
              Reddedilmiş
            </label>
            <label>
              <input
                type="checkbox"
                name="blacklisted"
                checked={filterValues.blacklisted}
                onChange={handleFilterChange}
              />
              Kara Listede
            </label>
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={filterValues.inStock}
                onChange={handleFilterChange}
              />
              Stokta
            </label>
          </div>
        </div>
      )}
      <button onClick={handleClearFilters} className="clear-filters-button">Filtreleri Temizle</button>
    </div>
  );
};

export default FilterPanel;
