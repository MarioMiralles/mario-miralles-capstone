//===================//
// FEATURED HEADLINE //
//===================//
// mario-miralles-capstone/src/components/FeaturedHeadline/FeaturedHeadline.js

import React from 'react';
import './FeaturedHeadline.scss';

const FeaturedHeadline = ({ headline, onHeadlineClick }) => {
    if (!headline) return null;

    return (
            <div className='featured-headline__container'>
                <h2 className="featured-headline__label">Breaking News</h2>
                <h3 className='featured-headline__title' onClick={() => onHeadlineClick(headline)}>
                    {headline.title.rendered}
                </h3>
            </div>
    );
};

export default FeaturedHeadline;