import React, { useState, useEffect } from 'react';
import './EditProductModal.css';
import axios from 'axios';

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState(product.title);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState(product.sale_price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [barcode, setBarcode] = useState(product.barcode);
  const [description, setDescription] = useState(product.description);
  const [listPrice, setListPrice] = useState(product.list_price);
  const [vatRate, setVatRate] = useState(product.vat_rate);
  const [image, setImage] = useState(product.image_url || '');
  const [selectedCurrency, setSelectedCurrency] = useState(product.fixed_currency || 'TL');
  const [quickActionField, setQuickActionField] = useState('listPrice');
  const [quickActionType, setQuickActionType] = useState('addPercentage');
  const [quickActionValue, setQuickActionValue] = useState('');
  const [allMarketplaces, setAllMarketplaces] = useState([]);
  const [marketplaceStates, setMarketplaceStates] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/marketplaces')
      .then(response => {
        setAllMarketplaces(response.data);
        const initialStates = response.data.reduce((acc, marketplace) => {
          acc[marketplace.id] = product.marketplaces?.[marketplace.id]?.is_active || false;
          return acc;
        }, {});
        setMarketplaceStates(initialStates);
      })
      .catch(error => {
        console.error('Error fetching marketplaces:', error);
      });

    axios.get('http://127.0.0.1:5000/api/exchange_rates')
      .then(response => {
        setExchangeRates({ TL: 1, ...response.data }); // TL'yi sabit olarak ekleyelim
      })
      .catch(error => {
        console.error('Error fetching exchange rates:', error);
      });
  }, [product]);

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      title,
      brand,
      sale_price: price,
      quantity,
      barcode,
      description,
      list_price: listPrice,
      vat_rate: vatRate,
      image_url: image,
      fixed_currency: selectedCurrency,
      marketplaces: marketplaceStates,
    };
    onSave(updatedProduct);
  };

  const handleQuickAction = () => {
    let updatedPrice;
    const value = parseFloat(quickActionValue);

    if (quickActionType === 'addPercentage') {
      updatedPrice = price * (1 + value / 100);
    } else if (quickActionType === 'subtractPercentage') {
      updatedPrice = price * (1 - value / 100);
    } else if (quickActionType === 'addFixed') {
      updatedPrice = price + value;
    } else if (quickActionType === 'subtractFixed') {
      updatedPrice = price - value;
    }

    if (quickActionField === 'listPrice') {
      setListPrice(updatedPrice);
    } else if (quickActionField === 'salePrice') {
      setPrice(updatedPrice);
    }
  };

  const handleMarketplaceToggle = (marketplaceId) => {
    setMarketplaceStates(prevStates => ({
      ...prevStates,
      [marketplaceId]: !prevStates[marketplaceId],
    }));
  };

  const getCurrencyInTL = (currency) => {
    return exchangeRates[currency] || 1;
  };

  const previewInTL = (price * getCurrencyInTL(selectedCurrency)).toFixed(2);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ürünü Düzenle</h2>
        <div className="modal-body">
          <div className="modal-field">
            {image && <img src={image} alt={product.title} className="product-image" />}
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <button className='image-edit-button' onClick={() => setImage('')}>Fotografı Değiştir</button>
          </div>
          <div className="modal-field">
            <label>Ürün Adı:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Açıklama:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Marka:</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Fiyat:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Stok Miktarı:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Barkod:</label>
            <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Liste Fiyatı:</label>
            <input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>KDV Oranı:</label>
            <input type="number" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className='currency-label'>Kur:</label>
            <select className='currency-select' value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
              {Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <div className="currency-preview">TL Karşılığı: {previewInTL} TL</div>
          </div>
          <div className="modal-field">
            <label>Pazaryerleri:</label>
            {allMarketplaces && allMarketplaces.map((marketplace) => (
              <div key={marketplace.id} className="marketplace-item">
                <img src={marketplace.logo_url} alt={marketplace.name} className="marketplace-logo" />
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={marketplaceStates[marketplace.id] || false}
                    onChange={() => handleMarketplaceToggle(marketplace.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={onClose}>İptal</button>
          <div className="quick-operation">
            <select  value={quickActionField} onChange={(e) => setQuickActionField(e.target.value)}>
              <option value="listPrice">Liste Fiyatına</option>
              <option value="salePrice">Satış Fiyatına</option>
            </select>
            <select value={quickActionType} onChange={(e) => setQuickActionType(e.target.value)}>
              <option value="addPercentage">% Ekle</option>
              <option value="subtractPercentage">% Çıkar</option>
              <option value="addFixed">Sabit Fiyat Ekle</option>
              <option value="subtractFixed">Sabit Fiyat Çıkar</option>
            </select>
            <input
              type="number"
              placeholder="Değer Girin"
              value={quickActionValue}
              onChange={(e) => setQuickActionValue(e.target.value)}
            />
            <button onClick={handleQuickAction}>Uygula</button>
          </div>
          <button onClick={handleSave}>Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
