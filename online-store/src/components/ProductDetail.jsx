import React from 'react';

const ProductDetail = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;

    return (
        <div className="product-modal-overlay" onClick={onClose}>
            <div className="product-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="modal-content">
                    <div className="modal-img">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="modal-info">
                        <h2>{product.name}</h2>
                        <p className="modal-price">{product.price} ₸</p>
                        <p className="description">{product.description}</p>

                        <div className="options">
                            <h4>Доступные размеры:</h4>
                            <div className="size-chips">
                                {product.sizes.map(size => (
                                    <span key={size} className="size-chip">{size}</span>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-primary w-full" onClick={() => {
                            onAddToCart(product);
                            onClose();
                        }}>
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
