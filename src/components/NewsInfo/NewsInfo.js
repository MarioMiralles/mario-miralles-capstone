//===========//
// NEWS INFO //
//===========//
// /mario-miralles-capstone/src/components/NewsInfo/NewsInfo.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsInfo.scss';
import axios from 'axios'; // Import axios for API calls
import leftArrow from '../../assets/icons/left-arrow.png';

function NewsInfo({ newsTitle, newsExcerpt, onBackClick, storyUrl, setInputText, setPromptGenerated, handleButtonAnimation, handleRandomArt, isTextareaVisible, onResetFeaturedHeadline }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    const [isLoading, setIsLoading] = useState(false);

    //=======================//
    // COPY HEADLINE FEATURE //
    //=======================//
    const copyHeadline = () => {
        const headline = document.querySelector('.news-info__headline');
        if (headline) {
            navigator.clipboard.writeText(headline.textContent)
                .then(() => {
                    setCopied(true); // Set copied to true after copy is successful
                    setTimeout(() => setCopied(false), 2000); // Reset Copy Headline after 2 seconds
                })
                .catch((error) => console.error(error));
        }
    };

    //=============================//
    // HANDLE AI PROMPT FUNCTION //
    //=============================//
    const handleAIPrompt = async () => {
        if (!isTextareaVisible) {
            handleButtonAnimation();
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5000/api/art/prompt', { newsExcerpt });
            setIsLoading(false);

            if (response.data && response.data.success) {
                let promptData;
                if (typeof response.data.prompt === 'string') {
                    try {
                        promptData = JSON.parse(response.data.prompt);
                    } catch (error) {
                        console.error('Error parsing prompt data:', error);
                        return;
                    }
                } else {
                    promptData = response.data.prompt;
                }

                const { style, prompt } = promptData;
                console.log(style);
                setInputText(prompt);
                setPromptGenerated(true);
                handleButtonAnimation();
            } else {
                console.error('Error from server:', response.data.message);
            }
        } catch (error) {
            console.error('Error prompting with AI:', error);
            setIsLoading(false);
        }
    };

    const handleBackToHeadlines = () => {
        onBackClick();
        onResetFeaturedHeadline();
    }

    // Render the component only if newsTitle is provided
    if (!newsTitle) {
        return null;
    }

    return (
        <article className='news-info'>
            <div className='news-info__nav'>
                <Link className='news-info__nav-back' onClick={handleBackToHeadlines}><img className='news-info__nav-back--arrow' src={leftArrow} alt="Back arrow" />Back to Headlines</Link>
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
            <p className='news-info__headline'>{newsExcerpt}</p>
            <section className='news-info__buttons'>
                <a href={storyUrl} className='news-info__button' target="_blank" rel="noopener noreferrer">
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/ijahpotn.json"
                        trigger="hover">
                    </lord-icon>
                    <p className='news-info__p'>View Story</p>
                </a>
                <button className='news-info__button--randomize' onClick={() => {
                    if (isTextareaVisible) {
                        handleRandomArt(newsExcerpt);
                    } else {
                        handleButtonAnimation();
                    }
                }}>
                    <lord-icon
                        id="news-info__img-button--randomize"
                        src="https://cdn.lordicon.com/pbhjpofq.json"
                        trigger="morph"
                        state="morph-sea"
                        colors="primary:#121331,secondary:#08a88a,tertiary:#4bb3fd,quaternary:#ffc738,quinary:#d59f80,senary:#242424,septenary:#f4f19c">
                    </lord-icon>
                    <p className='news-info__p'>Create a Random Artwork</p>
                </button>
                <button className='news-info__button' onClick={() => {
                    if (isTextareaVisible) {
                        handleAIPrompt();
                    } else {
                        handleButtonAnimation();
                    }
                }}>
                    <lord-icon
                        id="news-info__img-button"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="hover"
                        delay="1500"
                        state="hover-line">
                    </lord-icon>
                    <p className='news-info__p'>AI Prompt</p>
                </button>
            </section>
            {isLoading && (
                <div className="overlay">
                    <lord-icon
                        id="loading-icon"
                        src="https://cdn.lordicon.com/zfzufhzk.json"
                        trigger="in"
                        state="in-dynamic"
                        delay="500"
                    />
                </div>
            )}
        </article>
    )
}

export default NewsInfo;