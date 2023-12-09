import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const PageNotFound = () => {

    return (
        <div className="page__404">
            <h1 className="h1-heading text-align-center mb-30">404</h1>
            <div className="page__404-bg"></div>

            <div className="page__404-content">
                <h3 className='h3-heading mb-20'>Look like you're lost</h3>
                <p className='p-l-txt mb-0'>the page you are looking for not avaible!</p>
                <Link to="/" className="custom-btn back-btn">Go to Home</Link>
            </div>
        </div>
    );
};

export default PageNotFound;