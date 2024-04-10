import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './BreakingNews.scss';
import axios from 'axios';
import he from 'he';
import loadingNews from '../../assets/images/Loading_News2.gif';
import NewsInfo from '../NewsInfo/NewsInfo';

const wordpressPagesURL = "https://onthedai.com/wp-json/wp/v2/pages"
const excludePageIds = [873, 2663, 3676, 3700, 25455, 25458];
const titlesPerPage = 5;

const BreakingNews = ({ setInputText, userInputVisible, promptGenerated, handleGenerate, inputText }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePaginationButton, setActivePaginationButton] = useState(0);
    const [selectedHeadline, setSelectedHeadline] = useState(null); // Track selected headline
    const [showNewsInfo, setShowNewsInfo] = useState(false); // Track visibility of NewsInfo component

    useEffect(() => {
        breakingNewsPages();
    }, []);

    const breakingNewsPages = async () => {
        try {
            const excludePages = excludePageIds.join(',');
            const response = await axios.get(`${wordpressPagesURL}?per_page=33&exclude=${excludePages}`);
            const decodedPages = response.data.map(page => ({
                ...page,
                title: { rendered: he.decode(page.title.rendered) }
            }));
            setPages(decodedPages);
            setError(null);
            setLoading(false); // Set loading to false after fetching data
        } catch (error) {
            console.error(error);
            setError('Error, please try again');
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(pages.length / titlesPerPage);
    const indexOfLastTitle = currentPage * titlesPerPage;
    const indexOfFirstTitle = indexOfLastTitle - titlesPerPage;
    const currentTitles = pages.slice(indexOfFirstTitle, indexOfLastTitle);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setActivePaginationButton(pageNumber); // Update active button state
    }

    const handleHeadlineClick = (page) => {
        const { link, title } = page; // Extract link and title from the page object
        setSelectedHeadline({ title: title.rendered, storyUrl: link }); // Pass both title and URL
        setShowNewsInfo(true); // Show NewsInfo component
    }

    const handleBackClick = () => {
        setSelectedHeadline(null); // Clear selected headline
        setShowNewsInfo(false); // Hide NewsInfo component
    }

    return (
        <article className="news__container">
            {loading ? ( // Show the loadingNews gif while loading is true
                <div className='news__loading-container'>
                    <img src={loadingNews} className="news__loading" alt="Loading news..." />
                </div>
            ) : (
                <>
                    {!showNewsInfo && ( // Only render if no headline is selected
                        <section className='news__pagination-container'>
                            <div className='news__pages'>
                                {currentTitles.map((page, index) => (
                                    <h3 key={index} className='news__page-title' onClick={() => handleHeadlineClick(page)}>
                                        {page.title.rendered.split(' ').slice(0, 21).join(' ')} {/* Display only the first 21 words */}
                                        {page.title.rendered.split(' ').length > 21 ? '...' : ''} {/* Add ellipsis if the title exceeds 21 words */}
                                    </h3>
                                ))}
                            </div>
                            <div className='news__pagination'>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <NavLink
                                        key={index + 1}
                                        to={`/${index + 1}`}
                                        activeClassName="active"
                                        className={`news__pagination-button ${index + 1 === activePaginationButton ? "active" : ""} ${index === 0 ? "first-page" : ""}`}
                                        onClick={() => handlePageChange(index + 1, index)}>
                                        {index + 1}
                                    </NavLink>
                                ))}
                            </div>
                        </section>
                    )}
                </>

            )}
            {error && <div className="error-message">{error}</div>} {/* Display error message if there's an error */}
            {showNewsInfo && <NewsInfo headlineTitle={selectedHeadline.title} storyUrl={selectedHeadline.storyUrl} onBackClick={handleBackClick} setInputText={setInputText} userInputVisible={userInputVisible} promptGenerated={promptGenerated} handleGenerate={handleGenerate} inputText={inputText} />}
        </article>
    );
};

export default BreakingNews;