import React from 'react';

const Navbar = ({ cartCount, onOpenCart }) => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo">STORE</div>
                <div className="nav-links">
                    <a href="#catalog">Каталог</a>
                    <a href="#about">О нас</a>
                    <a href="#contacts">Контакты</a>
                </div>
                <div className="nav-actions">
                    <button className="cart-btn" onClick={onOpenCart}>
                        Корзина ({cartCount})
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
