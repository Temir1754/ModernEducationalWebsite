import React from 'react';
import { UI_TEXT } from '../data';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <h1>{UI_TEXT.hero.title}</h1>
                <p>{UI_TEXT.hero.subtitle}</p>
                <a href="#catalog" className="btn btn-accent">{UI_TEXT.hero.cta}</a>
            </div>
        </section>
    );
};

export default Hero;
