//=======================//
// USER INPUT (HOMEPAGE) //
//=======================//
// /mario-miralles-capstone/src/components/UserInput/UserInput.js

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import './UserInput.scss';
import logo from '../../../src/assets/images/Logo2024.png';
import otdLogo from '../../../src/assets/images/OTDLogo.png';
import desktopLogo from '../../../src/assets/images/artGeneratorLabel.png';
import loadingGif from '../../../src/assets/images/Loading_GIF.gif';
import PublicGallery from '../PublicGallery/PublicGallery';
import BreakingNews from '../BreakingNews/BreakingNews';
import { useNavigate } from 'react-router-dom';
import SocialLinks from '../SocialLinks/SocialLinks';
import FeaturedHeadline from '../FeaturedHeadline/FeaturedHeadline';

const apiKey = process.env.REACT_APP_API_KEY;
const wordpressPagesURL = "https://onthedai.com/wp-json/wp/v2/pages";
const excludePageIds = [873, 2663, 3676, 3700, 25455, 25458, 28770];

function UserInput() {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generationId, setGenerationId] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const [imageLoaded, setImageLoaded] = useState(false);
    const [publicGalleryKey, setPublicGalleryKey] = useState(0);
    const [showPublicGallery, setShowPublicGallery] = useState(true);
    const [promptGenerated, setPromptGenerated] = useState(false);
    const [showButtonAnimation, setShowButtonAnimation] = useState(false);
    const [showButtonAnimationTimeout, setShowButtonAnimationTimeout] = useState(null);
    const [generateButtonClicked, setGenerateButtonClicked] = useState(false);
    const [isTabletView, setIsTabletView] = useState(window.innerWidth >= 768 && window.innerWidth < 1280);
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 1280);
    const [isTextareaVisible, setIsTextareaVisible] = useState(true);
    const [featuredHeadline, setFeaturedHeadline] = useState(null);

    const breakingNewsRef = useRef();

    useEffect(() => {
        fetchFeaturedHeadline();
    }, []);

    const fetchFeaturedHeadline = async () => {
        try {
            const excludePages = excludePageIds.join(',');
            const response = await axios.get(`${wordpressPagesURL}?per_page=1&exclude=${excludePages}`);
            if (response.data && response.data.length > 0) {
                setFeaturedHeadline(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching featured headline:', error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsTabletView(window.innerWidth >= 768 && window.innerWidth < 1280);
            setIsDesktopView(window.innerWidth >= 1280);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (showButtonAnimationTimeout) {
                clearTimeout(showButtonAnimationTimeout);
            }
        };
    }, [showButtonAnimationTimeout]);

    //===========================//
    // HANDLE RANDOM ART FUNCTION //
    //===========================//
    const handleRandomArt = async (headlineTitle) => {
        if (!isTextareaVisible) {
            handleButtonAnimation();
            return;
        }
        try {
            setIsLoading(true);
            setGeneratedImage(null); // Clear any existing generated image
            console.log('isLoading set to true');
            const response = await axios.post('http://localhost:5000/api/art/random-art', { headlineTitle });
            if (response.data.success) {
                setGenerationId(response.data.generationId);
                setInputText(response.data.prompt);
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            console.error('Error generating random art:', error);
            setError('Failed to generate random art. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonAnimation = () => {
        setShowButtonAnimation(true);
        if (showButtonAnimationTimeout) {
            clearTimeout(showButtonAnimationTimeout);
        }
        setShowButtonAnimationTimeout(
            setTimeout(() => {
                setShowButtonAnimation(false);
                setGenerateButtonClicked(false);
            }, 3000)
        );
    };

    const toggleComponent = (section) => {
        if ((section === 'Public Gallery' && showPublicGallery) || (section === 'Breaking News' && !showPublicGallery)) {
            return;
        }
        setShowPublicGallery((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!inputText) {
            handleButtonAnimation();
            setGenerateButtonClicked(true);
            return;
        }
        setImageLoaded(false);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/art/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputText }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const responseData = await response.json();
            setGenerationId(responseData.generationId);
            setError(null);
        } catch (error) {
            setError('Error generating image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchImage = useCallback(async () => {
        setIsLoading(true);
        try {
            let fetching = true;
            while (fetching) {
                const options = {
                    headers: {
                        accept: 'application/json',
                        authorization: `Bearer ${apiKey}`
                    }
                };

                const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, options);
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const responseData = await response.json();

                if (responseData && responseData.generations_by_pk && responseData.generations_by_pk.generated_images && responseData.generations_by_pk.generated_images.length > 0) {
                    setGeneratedImage(responseData.generations_by_pk.generated_images[0].url);
                    setError(null);
                    setImageLoaded(true);
                    fetching = false;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        } catch (error) {
            setError('Error fetching image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [generationId, setIsLoading, setError]);

    useEffect(() => {
        if (generationId) {
            handleFetchImage();
        }
    }, [generationId]);

    useEffect(() => {
        setIsTextareaVisible(!isLoading && !generatedImage);
    }, [isLoading, generatedImage]);

    const handleCreateNew = () => {
        setInputText('');
        setGeneratedImage(null);
        setPublicGalleryKey(prevKey => prevKey + 1);
        setPromptGenerated(false);
    };

    const handleRefreshBrowser = () => {
        navigate(0);
    }

    const handleLabelClick = () => {
        if (breakingNewsRef.current && breakingNewsRef.current.resetPagination) {
            breakingNewsRef.current.resetPagination();
        }
    };

    // const handleHeadlineClick = (headline) => {
    //     // Implement the logic for handling headline click
    //     // When headline is clicked it will show the NewsInfo in BreakingNews section
    //     console.log("Headline clicked:", headline.title.rendered);
    // };

    return (
        <>
            <main className='main'>
                <article className="featured-headline">
                    {isDesktopView && (
                        <FeaturedHeadline
                            headline={featuredHeadline}
                            // onHeadlineClick={handleHeadlineClick}
                            onLabelClick={handleLabelClick} />
                    )}
                </article>
                <div className="form__container">
                    <section className='form__article'>
                        {!isLoading && !generatedImage && (
                            <form className='form' onSubmit={handleSubmit}>
                                <fieldset>
                                    <legend>
                                        <img
                                            src={isDesktopView ? desktopLogo : logo}
                                            className='logo'
                                            alt={isDesktopView ? "Art Generator" : "ON THE Dai News AI Art Generator"}
                                        /></legend>
                                    <textarea
                                        className={`form__input ${generateButtonClicked && !inputText ? 'form__input--invalid' : ''}`}
                                        placeholder='What would you like to create?'
                                        value={inputText}
                                        onChange={(event) => setInputText(event.target.value)}
                                    />
                                    <button type='submit' className='form__button'>GENERATE</button>
                                </fieldset>
                            </form>
                        )}
                        <figure className='generated__section'>
                            {(!isDesktopView && isLoading || !isDesktopView && generatedImage) && (
                                <img onClick={handleRefreshBrowser} className='generated__logo' src={otdLogo} alt='OTDNews' />
                            )}
                            {error && <div>{error}</div>}
                            {isLoading && <img className="generated__loading" src={loadingGif} alt="Loading..." />}
                            {generatedImage && !isLoading && (
                                <section className="generated__container">
                                    <img src={generatedImage} className='generated__image' alt="Generated Artwork" />
                                    <button onClick={handleCreateNew} className={`generated__create-new-button ${showButtonAnimation ? 'glowing' : ''}`}>CREATE NEW ART</button>
                                </section>
                            )}
                        </figure>
                    </section>
                    {(isTabletView || isDesktopView) && (
                        <aside className='news-desktop'>
                            {isTabletView && (
                                <FeaturedHeadline
                                    headline={featuredHeadline}
                                    onLabelClick={handleLabelClick}
                                />
                            )}
                            <section className='news-desktop__news'>
                                <BreakingNews
                                    ref={breakingNewsRef}
                                    setInputText={setInputText}
                                    userInputVisible={!isLoading && !generatedImage}
                                    promptGenerated={promptGenerated}
                                    inputText={inputText}
                                    setIsLoading={setIsLoading}
                                    setShowButtonAnimation={setShowButtonAnimation}
                                    setPromptGenerated={setPromptGenerated}
                                    handleButtonAnimation={handleButtonAnimation}
                                    isTabletView={isTabletView}
                                    isDesktopView={isDesktopView}
                                    handleRandomArt={handleRandomArt}
                                    isTextareaVisible={isTextareaVisible}
                                    excludeFeaturedHeadline={true}
                                />
                            </section>
                        </aside>
                    )}
                </div>
                <section className='gallery__news'>
                    <div className="gallery__heading-container">
                        {isDesktopView && (
                            <h2 className="gallery__heading">COMMUNITY CREATIONS</h2>
                        )}
                        {!isDesktopView && (
                            <>
                                <h2
                                    className={showPublicGallery ? "gallery__heading" : "gallery__heading--inactive"}
                                    onClick={() => toggleComponent('Public Gallery')}>
                                    Community Creations
                                </h2>
                                {!isTabletView && (
                                    <h2
                                        className={showPublicGallery ? "gallery__heading--inactive" : "gallery__heading gallery__heading--breaking-news"}
                                        onClick={() => toggleComponent('Breaking News')}>
                                        Breaking News
                                    </h2>
                                )}
                            </>
                        )}
                    </div>
                    {(showPublicGallery || isTabletView) && (
                        <PublicGallery
                            key={publicGalleryKey}
                            inputText={inputText}
                            handleFetchImage={handleFetchImage} />
                    )}
                    {!isTabletView && !showPublicGallery && (
                        <BreakingNews
                            ref={breakingNewsRef}
                            setInputText={setInputText}
                            userInputVisible={!isLoading && !generatedImage}
                            promptGenerated={promptGenerated}
                            inputText={inputText}
                            setIsLoading={setIsLoading}
                            setShowButtonAnimation={setShowButtonAnimation}
                            setPromptGenerated={setPromptGenerated}
                            handleButtonAnimation={handleButtonAnimation}
                            handleRandomArt={handleRandomArt}
                            isTextareaVisible={isTextareaVisible}
                        />
                    )}
                </section>
                {/* {!isDesktopView && <SocialLinks />} */}
            </main >
            <footer className="footer">
                <SocialLinks />
            </footer>
        </>
    );
}

export default UserInput;