import React from 'react';
import { UI_TEXT } from '../data';

const Catalog = ({ products, onAddToCart, onViewProduct, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) => {
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === "Все" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="catalog" className="catalog">
            <div className="container">
                <div className="catalog-header">
                    <h2>{UI_TEXT.catalog.title}</h2>
                    <div className="filters">
                        <input
                            type="text"
                            placeholder={UI_TEXT.catalog.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <div className="category-tabs">
                            {UI_TEXT.catalog.categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`tab ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-img" onClick={() => onViewProduct(product)} style={{ cursor: 'pointer' }}>
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3 onClick={() => onViewProduct(product)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                                <p className="price">{product.price} ₸</p>
                                <button className="btn btn-outline" onClick={() => onAddToCart(product)}>
                                    {UI_TEXT.catalog.buy}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Catalog;
