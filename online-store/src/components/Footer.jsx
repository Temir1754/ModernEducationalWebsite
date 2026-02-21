import React from 'react';
import { UI_TEXT } from '../data';

const Footer = () => {
    return (
        <footer className="footer" id="contacts">
            <div className="container footer-content">
                <div className="footer-info">
                    <h3>STORE</h3>
                    <p>{UI_TEXT.footer.copy}</p>
                </div>
                <div className="footer-links">
                    {UI_TEXT.footer.links.map(link => (
                        <a key={link} href="#">{link}</a>
                    ))}
                </div>
                <div className="footer-social">
                    <a href="#">WhatsApp</a>
                    <a href="#">Instagram</a>
                    <a href="#">Telegram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
