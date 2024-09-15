//===============//
// BREAKING NEWS //
//===============//
// mario-miralles-capstone/src/components/BreakingNews/BreakingNews.js

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './BreakingNews.scss';
import axios from 'axios';
import he from 'he';
import loadingNews from '../../assets/images/Loading_News.gif';
import NewsInfo from '../NewsInfo/NewsInfo';

const wordpressPagesURL = "https://onthedai.com/wp-json/wp/v2/pages"
const excludePageIds = [873, 2663, 3676, 3700, 25455, 25458, 28770]; // Excludes certain pages from the OTD website

const BreakingNews = forwardRef(({ setInputText, userInputVisible, promptGenerated, handleGenerate, inputText, setShowButtonAnimation, setPromptGenerated, handleButtonAnimation, isTabletView, isDesktopView, handleRandomArt, isTextareaVisible, excludeFeaturedHeadline, onHeadlineClick, onResetFeaturedHeadline }, ref) => {
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePaginationButton, setActivePaginationButton] = useState(0);
    const [selectedHeadline, setSelectedHeadline] = useState(null);
    const [showNewsInfo, setShowNewsInfo] = useState(false);

    //============//
    // PAGINATION //
    //============//
    const titlesPerPage = isTabletView || isDesktopView ? 3 : 5; // Set titlesPerPage to 3 for tablet/desktop view, 5 for others
    const actualPages = excludeFeaturedHeadline ? pages.slice(1) : pages;
    const totalPages = Math.ceil(actualPages.length / titlesPerPage);
    const indexOfLastTitle = currentPage * titlesPerPage;
    const indexOfFirstTitle = indexOfLastTitle - titlesPerPage;
    const currentTitles = actualPages.slice(indexOfFirstTitle, indexOfLastTitle);

    useEffect(() => {
        breakingNewsPages();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setActivePaginationButton(pageNumber); // Update active button state
    }

    useImperativeHandle(ref, () => ({
        resetPagination: () => {
            setCurrentPage(1);
            setActivePaginationButton(0);
        },
        showNewsInfo: (headline) => {
            setSelectedHeadline(headline);
            setShowNewsInfo(true);
        }
    }));

    //===========//
    // HEADLINES //
    //===========//
    const breakingNewsPages = async () => {
        try {
            const excludePages = excludePageIds.join(',');
            const response = await axios.get(`${wordpressPagesURL}?per_page=33&exclude=${excludePages}`);
            const decodedPages = response.data.map(page => ({
                ...page,
                title: { rendered: he.decode(page.title.rendered) }, // Decodes apostrophes and other symbols
                excerpt: { rendered: he.decode(page.excerpt.rendered) }
            }));
            setPages(decodedPages);
            setError(null);
            setIsLoading(false); // Set loading to false after fetching data
        } catch (error) {
            setError('Error, please try again');
            setIsLoading(false);
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
        const { link, title, excerpt } = page; // Extract link and title from the page object
        const strippedExcerpt = excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
        const headlineData = { title: title.rendered, storyUrl: link, excerpt: strippedExcerpt };
        setSelectedHeadline(headlineData); // Pass both title and URL
        setShowNewsInfo(true); // Show NewsInfo component
        onHeadlineClick(headlineData);
    }

    return (
        <article className="news__container">
            {isLoading ? ( // Show the loadingNews gif while loading is true
                <div className='news__loading-container'>
                    <img src={loadingNews} className="news__loading" alt="Loading news..." />
                </div>
            ) : (
                <>
                    {!showNewsInfo && ( // Only render if no headline is selected
                        <section className='news__pagination-container'>
                            <div className='news__pages'>
                                {currentTitles.map((page, index) => (
                                    <h3 key={index}
                                        className='news__page-title' onClick={() => handleHeadlineClick(page)}>
                                        {page.title.rendered}
                                    </h3>
                                ))}
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
                    newsTitle={selectedHeadline.title}
                    newsExcerpt={selectedHeadline.excerpt}
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
                    onResetFeaturedHeadline={onResetFeaturedHeadline}
                />}
        </article>
    );
});

export default BreakingNews;