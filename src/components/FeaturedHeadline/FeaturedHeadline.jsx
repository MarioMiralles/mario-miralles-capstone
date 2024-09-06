//===================//
// FEATURED HEADLINE //
//===================//
// mario-miralles-capstone/src/components/FeaturedHeadline/FeaturedHeadline.js

import React from 'react';
import './FeaturedHeadline.scss';

const FeaturedHeadline = ({ headline, onHeadlineClick }) => {
    if (!headline) return null;

    return (
        <article className="featured-headline">
            <div className='featured-headline__container'>
                <h3 className="featured-headline__label">Breaking News</h3>
                <h2 className='featured-headline__title' onClick={() => onHeadlineClick(headline)}>
                    {headline.title.rendered}
                </h2>
            </div>
        </article>
    );
};

export default FeaturedHeadline;