//===============//
// BREAKING NEWS //
//===============//
// mario-miralles-capstone/src/components/BreakingNews/BreakingNews.js

import React, { useState, useEffect } from 'react';
import './BreakingNews.scss';
import axios from 'axios';
import he from 'he';
import loadingNews from '../../assets/images/Loading_News2.gif';
import NewsInfo from '../NewsInfo/NewsInfo';

const wordpressPagesURL = "https://onthedai.com/wp-json/wp/v2/pages"
const excludePageIds = [873, 2663, 3676, 3700, 25455, 25458, 28770]; // Excludes certain pages from the OTD website

const BreakingNews = ({ setInputText, userInputVisible, promptGenerated, handleGenerate, inputText, setShowButtonAnimation, setPromptGenerated, handleButtonAnimation, isDesktopView, handleRandomArt, isTextareaVisible }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePaginationButton, setActivePaginationButton] = useState(0);
    const [selectedHeadline, setSelectedHeadline] = useState(null);
    const [showNewsInfo, setShowNewsInfo] = useState(false); // Track visibility of NewsInfo component

    //============//
    // PAGINATION //
    //============//
    const titlesPerPage = 5; // Max number of headlines to display per page
    const totalPages = Math.ceil(pages.length / titlesPerPage);
    const indexOfLastTitle = currentPage * titlesPerPage;
    const indexOfFirstTitle = indexOfLastTitle - titlesPerPage;
    const currentTitles = pages.slice(indexOfFirstTitle, indexOfLastTitle);

    useEffect(() => {
        breakingNewsPages();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setActivePaginationButton(pageNumber); // Update active button state
    }

    //===========//
    // HEADLINES //
    //===========//
    const breakingNewsPages = async () => {
        try {
            const excludePages = excludePageIds.join(',');
            const response = await axios.get(`${wordpressPagesURL}?per_page=33&exclude=${excludePages}`);
            const decodedPages = response.data.map(page => ({
                ...page,
                title: { rendered: he.decode(page.title.rendered) } // Decodes apostrophes and other symbols
            }));
            setPages(decodedPages);
            setError(null);
            setLoading(false); // Set loading to false after fetching data
        } catch (error) {
            setError('Error, please try again');
            setLoading(false);
        }
    }

    //======================================//
    // NEWSINFO NAV - BACK & NEWSINFO CLICK //
    //======================================//
    const handleBackClick = () => {
        setSelectedHeadline(null); // Clear selected headline
        setShowNewsInfo(false); // Hide NewsInfo component
    }

    const handleHeadlineClick = (page) => {
        const { link, title } = page; // Extract link and title from the page object
        setSelectedHeadline({ title: title.rendered, storyUrl: link }); // Pass both title and URL
        setShowNewsInfo(true); // Show NewsInfo component
    }

    return (
        <article className="news__container">
            {loading ? ( // Show the loadingNews gif while loading is true
                <div className='news__loading-container'>
                    <img src={loadingNews} className="news__loading" alt="Loading news..." />
                </div>
            ) : (
                <>
                    {isDesktopView && (
                        <h2 className="news__heading" id="news__heading--pad-bottom">Breaking News</h2>
                    )}
                    {!showNewsInfo && ( // Only render if no headline is selected
                        <section className='news__pagination-container'>
                            <div className='news__pages'>
                                {currentTitles.map((page, index) => {
                                    const truncatedTitle = page.title.rendered.split(' ').slice(0, 21).join(' '); // Get the first 21 words
                                    const displayTitle = page.title.rendered.length > 21 ? truncatedTitle + '...' : truncatedTitle; // Add ellipsis if title exceeds 21 words
                                    return (
                                        <h3 key={index} className='news__page-title' onClick={() => handleHeadlineClick(page)}>
                                            {isDesktopView ? page.title.rendered : displayTitle}
                                        </h3>
                                    );
                                })}
                            </div>
                            <div className='news__pagination'>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`news__pagination-button ${index + 1 === activePaginationButton ? "active" : ""} ${index === 0 ? "first-page" : ""}`}
                                        onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </>

            )}
            {error && <div className="error-message">{error}</div>} {/* Display error message if there's an error */}
            {showNewsInfo &&
                <NewsInfo
                    headlineTitle={selectedHeadline.title}
                    storyUrl={selectedHeadline.storyUrl}
                    onBackClick={handleBackClick}
                    setInputText={setInputText}
                    userInputVisible={userInputVisible}
                    promptGenerated={promptGenerated}
                    handleGenerate={handleGenerate}
                    inputText={inputText}
                    setShowButtonAnimation={setShowButtonAnimation}
                    setPromptGenerated={setPromptGenerated}
                    handleButtonAnimation={handleButtonAnimation}
                    handleRandomArt={handleRandomArt}
                    isTextareaVisible={isTextareaVisible}
                />}
        </article>
    );
};

export default BreakingNews;