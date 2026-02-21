import React, { useState } from 'react';
import { UI_TEXT } from '../data';
import Checkout from './Checkout';

const Cart = ({ isOpen, onClose, items, onRemove, onUpdateQty }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const resetCart = () => {
        setIsCheckingOut(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={resetCart}>
            <div className="cart-panel" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>{isCheckingOut ? "Оформление" : UI_TEXT.cart.title}</h2>
                    <button className="close-btn" onClick={resetCart}>×</button>
                </div>

                <div className="cart-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {!isCheckingOut ? (
                        <>
                            <div className="cart-items" style={{ flex: 1 }}>
                                {items.length === 0 ? (
                                    <p className="empty-msg" style={{ padding: '30px', textAlign: 'center' }}>
                                        {UI_TEXT.cart.empty}
                                    </p>
                                ) : (
                                    items.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <img src={item.image} alt={item.name} className="item-img" />
                                            <div className="item-details">
                                                <h4>{item.name}</h4>
                                                <p>{item.price} ₸</p>
                                                <div className="qty-controls">
                                                    <button onClick={() => onUpdateQty(item.id, -1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => onUpdateQty(item.id, 1)}>+</button>
                                                </div>
                                            </div>
                                            <button className="remove-btn" onClick={() => onRemove(item.id)}>×</button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="cart-footer">
                                    <div className="total">
                                        <span>{UI_TEXT.cart.total}</span>
                                        <span>{total} ₸</span>
                                    </div>
                                    <button className="btn btn-primary w-full" onClick={() => setIsCheckingOut(true)}>
                                        {UI_TEXT.cart.checkout}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Checkout
                            items={items}
                            total={total}
                            onBack={() => setIsCheckingOut(false)}
                            onOrderSuccess={resetCart}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
