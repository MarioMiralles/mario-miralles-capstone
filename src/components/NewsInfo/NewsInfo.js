import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsInfo.scss';
import copyIcon from '../../assets/images/copy-link.png';

function NewsInfo({ headlineTitle, onBackClick }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied

    const copyHeadline = () => {
        const headline = document.querySelector('.news-info__headline');
        if (headline) {
            navigator.clipboard.writeText(headline.textContent)
                .then(() => {
                    setCopied(true); // Set copied to true after successful copy
                    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
                })
                .catch((error) => console.error(error));
        }
    }

    // Render the component only if headlineTitle is provided
    if (!headlineTitle) {
        return null;
    }

    return (
        <article className='news-info'>
            <div className='news-info__nav'>
                <Link className='news-info__nav-back' onClick={onBackClick}>⯇ Back to Headlines</Link>
                <button className='news-info__nav-copy' onClick={copyHeadline}>{copied ? 'Copied!' : 'Copy Headline'} {/* Change text based on copied state */}
                    <img className="news-info__nav-copy--img" src={copyIcon} alt="Copy" />
                </button>
            </div>
            <h2 className='news-info__headline'>{headlineTitle}</h2>
            <section className='news-info__buttons'>
                <div className='news-info__button-container'>
                📰
                    <Link className='news-info__button'>View Story</Link>
                </div>
                <div className='news-info__button-container'>🌌
                    <button className='news-info__button'>Randomizer</button>
                </div>
                <div className='news-info__button-container'>🤖
                    <button className='news-info__button'>Prompt Generator</button>
                </div>
            </section>
        </article>
    )
}

export default NewsInfo