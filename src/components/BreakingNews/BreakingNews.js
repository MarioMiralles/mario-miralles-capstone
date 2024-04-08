import { useState, useEffect } from 'react';
import './BreakingNews.scss';
import axios from 'axios';
import he from 'he';
import loadingNews from '../../assets/images/Loading_News2.gif';

const wordpressPagesURL = "https://onthedai.com/wp-json/wp/v2/pages"
const excludePageIds = [873, 2663, 3676, 3700, 25455, 25458];
const titlesPerPage = 5;

const BreakingNews = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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
    }

    return (
        <article className="news__container">
            {loading ? ( // Show the loadingNews gif while loading is true
                <div className='news__loading-container'>
                    <img src={loadingNews} className="news__loading" alt="Loading news..." />
                </div>
            ) : (
                <section className='news__pagination-container'>
                    <div className='news__pages'>
                        {currentTitles.map((page, index) => (
                            <h3 key={index} className='news__page-title'>{page.title.rendered}</h3>
                        ))}
                    </div>
                    <div className='news__pagination'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} id="pagination__button" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </section>
            )}
            {error && <div className="error-message">{error}</div>} {/* Display error message if there's an error */}
        </article>
    );
};

export default BreakingNews;