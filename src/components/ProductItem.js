import React, { useState } from 'react';
import EditProductModal from './EditProductModal';

const ProductItem = ({
  product,
  selectedProducts,
  handleCheckboxChange,
  handleDoubleClick,
  handleSavePrice,
  handleCurrencyClick,
  getConvertedPrice,
  handleActivation,
  editingPriceId,
  newPrice,
  setNewPrice,
  currency,
  viewMode,
  categories,
  exchangeRates,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductUrl = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.log('Product URL not available');
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (updatedProduct) => {
    console.log('Updated Product:', updatedProduct);
    setIsModalOpen(false);
    // TODO: Save the updated product to the backend
  };

  return (
    <li className={`product-item ${viewMode}`}>
      <input
        type="checkbox"
        checked={selectedProducts.includes(product.id)}
        onChange={() => handleCheckboxChange(product.id)}
      />
      {product.image_url && (
        <img src={product.image_url} alt={product.title} className="product-image" />
      )}
      <div className="product-details">
        <h2>{product.brand} - {product.title}</h2>
        {editingPriceId === product.id ? (
          <div className="price-editor">
            <input
              type="text"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="price-input"
            />
            <button onClick={() => handleSavePrice(product.id)} className="save-button">Kaydet</button>
          </div>
        ) : (
          <p
            className="product-price"
            onClick={handleCurrencyClick}
            onDoubleClick={() => handleDoubleClick(product.id, product.sale_price)}
          >
            {getConvertedPrice(product.sale_price)} {currency}
          </p>
        )}
        <p>Stok: {product.quantity} - Kategori: {categories[product.category_id]} - Barkod: {product.barcode}</p>
        <div className="marketplace-buttons">
          {Object.keys(product.marketplaces).map((marketplaceName) => (
            <button
              key={marketplaceName}
              className={`marketplace-button ${!product.marketplaces[marketplaceName].is_active ? 'not-on-sale' : ''}`}
              title={!product.marketplaces[marketplaceName].is_active ? `Bu ürün ${marketplaceName}'da aktif değildir, aktif etmek için tıklayınız` : `Bu ürün ${marketplaceName}'da aktiftir`}
              onClick={() => product.marketplaces[marketplaceName].is_active ? openProductUrl(product.marketplaces[marketplaceName].product_url) : handleActivation(product.id, marketplaceName)}
            >
              <img src={product.marketplaces[marketplaceName].logo_url} alt={marketplaceName} />
            </button>
          ))}
        </div>
        <button className="details-button" onClick={handleEditClick}>Düzenle</button>
      </div>
      <EditProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        exchangeRates={exchangeRates}
      />
    </li>
  );
};

export default ProductItem;
