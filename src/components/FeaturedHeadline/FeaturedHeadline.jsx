//===================//
// FEATURED HEADLINE //
//===================//
// mario-miralles-capstone/src/components/FeaturedHeadline/FeaturedHeadline.js

import React from 'react';
import './FeaturedHeadline.scss';

const FeaturedHeadline = ({ headline, onHeadlineClick, onLabelClick }) => {
    if (!headline) return null;

    return (
        <div className='featured-headline__container'>
            <h3 className="featured-headline__label" onClick={onLabelClick}>Breaking News</h3>
            <h4 className='featured-headline__title' onClick={() => onHeadlineClick(headline)}>
                {headline.title.rendered}
            </h4>
        </div>
    );
};

export default FeaturedHeadline;