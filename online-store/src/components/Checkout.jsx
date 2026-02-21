import React, { useState } from 'react';
import { UI_TEXT } from '../data';

const Checkout = ({ items, total, onBack, onOrderSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        payment: 'Kaspi'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = `Новый заказ! \n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nДоставка: ${formData.address}\nОплата: ${formData.payment}\n\nТовары:\n${items.map(item => `- ${item.name} (${item.quantity} шт.)`).join('\n')}\n\nИтого: ${total} ₸`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/+7XXXXXXXXXX?text=${encodedMessage}`, '_blank');
        onOrderSuccess();
    };

    return (
        <div className="checkout-view">
            <h3>Оформление заказа</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                    />
                </div>
                <div className="form-group">
                    <label>Телефон</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                    />
                </div>
                <div className="form-group">
                    <label>Адрес доставки</label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Город, улица, дом, кв"
                    />
                </div>
                <div className="form-group">
                    <label>Способ оплаты</label>
                    <select
                        value={formData.payment}
                        onChange={e => setFormData({ ...formData, payment: e.target.value })}
                    >
                        <option value="Kaspi">Kaspi QR / Перевод</option>
                        <option value="Card">Картой на сайте</option>
                        <option value="Cash">Наличными при получении</option>
                    </select>
                </div>

                <div className="checkout-actions">
                    <button type="button" className="btn btn-outline" onClick={onBack}>Назад</button>
                    <button type="submit" className="btn btn-primary">Заказать</button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
