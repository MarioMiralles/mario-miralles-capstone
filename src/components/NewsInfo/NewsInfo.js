import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsInfo.scss';
import copyIcon from '../../assets/images/copy-link.png';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

function NewsInfo({ headlineTitle, onBackClick, storyUrl }) {
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
                    <lord-icon
                        id="news-info__img"
                        src="https://cdn.lordicon.com/pcllgpqm.json"
                        trigger="click"
                        stroke="bold"
                        colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                    </lord-icon>
                </button>
            </div>
            <h2 className='news-info__headline'>{headlineTitle}</h2>
            <section className='news-info__buttons'>
                <a href={storyUrl} className='news-info__button' target="_blank" rel="noopener noreferrer">
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/xahuqqcs.json"
                        trigger="hover"
                        stroke="bold"
                        state="hover-rotate-up-to-down"
                        colors="primary:#121331,secondary:#ef8e6d">
                    </lord-icon>
                    <p className='news-info__p'>View Story</p>
                </a>
                <a className='news-info__button--randomize'>
                    <lord-icon
                        id="news-info__img-button--randomize"
                        src="https://cdn.lordicon.com/pbhjpofq.json"
                        trigger="morph"
                        state="morph-sea"
                        colors="primary:#121331,secondary:#08a88a,tertiary:#4bb3fd,quaternary:#ffc738,quinary:#d59f80,senary:#242424,septenary:#f4f19c">
                    </lord-icon>
                    <p className='news-info__p'>Create a Random Artwork</p>
                </a>
                <a className='news-info__button'>
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        delay="1500"
                        state="hover-line">
                    </lord-icon>
                    <p className='news-info__p'>Prompt with AI</p>
                </a>
            </section>
        </article>
    )
}

export default NewsInfo