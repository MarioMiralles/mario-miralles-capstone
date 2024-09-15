//===================//
// FEATURED HEADLINE //
//===================//
// mario-miralles-capstone/src/components/FeaturedHeadline/FeaturedHeadline.js

import React from 'react';
import './FeaturedHeadline.scss';

const FeaturedHeadline = ({ headline, onHeadlineClick, onLabelClick }) => {
    if (!headline) return null;

    const handleHeadlineClick = () => {
        const strippedExcerpt = headline.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
        onHeadlineClick({
            title: headline.title.rendered,
            excerpt: strippedExcerpt,
            storyUrl: headline.link
        });
    };

    return (
        <div className='featured-headline__container'>
            <h3 className="featured-headline__label" onClick={onLabelClick}>Breaking News</h3>
            <h4 className='featured-headline__title' onClick={handleHeadlineClick}>
                {headline.title.rendered}
            </h4>
        </div>
    );
};

export default FeaturedHeadline;