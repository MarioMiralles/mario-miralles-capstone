//===================//
// FEATURED HEADLINE //
//===================//
// mario-miralles-capstone/src/components/FeaturedHeadline/FeaturedHeadline.js

import React, { useEffect, useState } from 'react';
import './FeaturedHeadline.scss';

const FeaturedHeadline = React.memo(({ headline, onHeadlineClick, onLabelClick, isSelected }) => {
    const [isHeadlineClicked, setIsHeadlineClicked] = useState(false);

    useEffect(() => {
        if (headline) {
            setIsHeadlineClicked(false);
            console.log('Headline title:', JSON.stringify(headline.title));
        }
    }, [headline]);

    if (!headline) return null;

    const handleHeadlineClick = () => {
        const strippedExcerpt = headline.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
        onHeadlineClick({
            title: headline.title.rendered,
            excerpt: strippedExcerpt,
            storyUrl: headline.link
        });
        setIsHeadlineClicked(true);
    };

    const handleLabelClick = () => {
        onLabelClick();
        setIsHeadlineClicked(false);
    };

    const title = headline.title?.rendered || headline.title;

    return (
        <div className={`featured-headline__container ${isSelected ? 'featured-headline__container--selected' : ''}`}>
            {isHeadlineClicked || isSelected ? (
                <section className='featured-headline__section'>
                    <h5 className='featured-headline__label--selected'>Breaking News</h5>
                    <h4 className="featured-headline__title--selected">
                        {title}
                    </h4>
                    <div></div>
                </section>
            ) : (
                <>
                    <h3 className="featured-headline__label" onClick={handleLabelClick}>Breaking News</h3>
                    <h4 className='featured-headline__title' onClick={handleHeadlineClick}>
                        {title}
                    </h4>
                </>
            )}
        </div>
    );
});

export default FeaturedHeadline;