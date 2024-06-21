import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">EIDEA</h2>
      <ul className="sidebar-menu">
        <NavLink activeClassName="active" exact to="/products" className="sidebar-menu-item">Ürünler</NavLink>
      
        <li className="sidebar-menu-item">Siparişler</li>
        <li className="sidebar-menu-item">Müşteriler</li>
        <li className="sidebar-menu-item">Raporlar</li>
        <li className="sidebar-menu-item">Ayarlar</li>
       
      </ul>
    </div>
  );
};
 // <li className="sidebar-menu-item">Tedarikciler</li>
export default Sidebar;