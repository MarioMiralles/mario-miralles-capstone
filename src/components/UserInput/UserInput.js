import './UserInput.scss'
import logo from '../../../src/assets/images/Logo2024.png';
import otdLogo from '../../../src/assets/images/OTDLogo.png';
import loadingGif from '../../../src/assets/images/Loading_GIF.gif'
import React, { useState, useEffect } from "react";
import PublicGallery from '../PublicGallery/PublicGallery';
import BreakingNews from '../BreakingNews/BreakingNews';
import { useNavigate } from 'react-router-dom';
import SocialLinks from '../SocialLinks/SocialLinks';
const icons = require.context('../../../src/assets/icons', true);
const getIcon = (iconName) => icons(`./${iconName}`).default;

const apiKey = process.env.REACT_APP_API_KEY;

function UserInput() {
    const navigate = useNavigate()
    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generationId, setGenerationId] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track fetching image state
    const [imageLoaded, setImageLoaded] = useState(false); // Track whether the image has been successfully loaded
    const [publicGalleryKey, setPublicGalleryKey] = useState(0); // Key to force re-render PublicGallery component
    const [showPublicGallery, setShowPublicGallery] = useState(true);
    const [promptGenerated, setPromptGenerated] = useState(false);
    const [showButtonAnimation, setShowButtonAnimation] = useState(false);
    const [showButtonAnimationTimeout, setShowButtonAnimationTimeout] = useState(null);
    const [generateButtonClicked, setGenerateButtonClicked] = useState(false); // State to track whether the textarea has been touched
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 1280);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktopView(window.innerWidth >= 1280);
        };

        window.addEventListener('resize', handleResize);

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

    const toggleComponent = (section) => {
        if ((section === 'Public Gallery' && showPublicGallery) || (section === 'Breaking News' && !showPublicGallery)) {
            return;
        }
        setShowPublicGallery((prev) => !prev);
    };

    useEffect(() => {
        if (generationId) {
            handleFetchImage();
        }
    }, [generationId]);

    //=========================//
    // LEONARDO AI API REQUEST //
    //=========================//
    const handleGenerate = async (inputText) => {
        try {
            setIsLoading(true); // Set loading to true when generating image

            // Check if a generation is already in progress
            if (generationId) {
                console.log('Generation already in progress. Waiting for previous generation to complete.');
                // Reset the generationId state variable
                setGenerationId(null);
            }

            // Initiate a new generation
            const requestData = {
                height: 576,
                modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
                prompt: inputText,
                width: 1024,
                alchemy: false,
                guidance_scale: 7,
                nsfw: true,
                highResolution: true,
                num_images: 1,
                photoReal: false,
                presetStyle: 'NONE',
                promptMagic: false,
                public: false,
                sd_version: 'v2'
            };

            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestData)
            };

            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', options);
            if (!response.ok) {
                throw new Error('Failed to generate image');
            }
            const responseData = await response.json();
            setGenerationId(responseData.sdGenerationJob.generationId);
            setError(null);
        } catch (error) {
            console.error('Error generating image:', error);
            setError('Error generating image. Please try again.');
        } finally {
            setIsLoading(false); // Set loading to false after the generation process
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputText) {
            handleButtonAnimation(); // Trigger the button animation
            setGenerateButtonClicked(true); // Set the generateButtonClicked state
            return;
        }
        setImageLoaded(false);
        handleGenerate(inputText);
    };

    const handleFetchImage = async () => {
        setIsLoading(true); // Set loading to true when fetching image
        try {
            // Use a flag to prevent recursive calls
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
                    setImageLoaded(true); // Set imageLoaded to true when image is successfully loaded
                    fetching = false; // Stop fetching loop
                } else {
                    // If image is not generated yet, wait for 3 seconds and try again
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            setError('Error fetching image. Please try again.');
        } finally {
            setIsLoading(false); // Set loading to false after fetching image URL
        }
    };

    // Create New Art Button
    const handleCreateNew = () => {
        setInputText(''); // Reset input text
        setGeneratedImage(null); // Reset generated image
        setPublicGalleryKey(prevKey => prevKey + 1);
        setPromptGenerated(false); // Reset promptGenerated state
    };

    // Validation glow animation
    const handleButtonAnimation = () => {
        setShowButtonAnimation(true);
        if (showButtonAnimationTimeout) {
            clearTimeout(showButtonAnimationTimeout); // Clear the previous timeout if it exists
        }
        setShowButtonAnimationTimeout(
            setTimeout(() => {
                setShowButtonAnimation(false);
                setGenerateButtonClicked(false); // Reset generateButtonClicked state
            }, 3000)
        );
    }

    // Logo Link Refreshes App to Homepage
    const handleRefreshBrowser = () => {
        navigate(0);
    }

    return (
        <>
            <main className='main'>
                <article className='form__left'>
                    <section className='form__article'>
                        {!isLoading && !generatedImage && (
                            <form className='form' onSubmit={handleSubmit}>
                                <fieldset>
                                    <legend><img src={logo} className='logo' alt="ON THE Dai AI Art Generator Logo" /></legend>
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
                            {/* Show the otdLogo only when isLoading and generatedImage are both true */}
                            {(isLoading || generatedImage) && (
                                <img onClick={handleRefreshBrowser} className='generated__logo' src={otdLogo} alt='OTDNews' />
                            )}
                            {error && <div>{error}</div>}
                            {isLoading && <img className="generated__loading" src={loadingGif} alt="Loading..." />} {/* Loading indicator */}
                            {generatedImage && imageLoaded && (
                                <section className="generated__container">
                                    <img src={generatedImage} className='generated__image' alt="Generated Artwork" />
                                    <button onClick={handleCreateNew} className={`generated__create-new-button ${showButtonAnimation ? 'glowing' : ''}`}>CREATE NEW ART</button>
                                </section>
                            )}
                        </figure>
                    </section>
                    <section className='gallery__news'>
                        <div className="gallery__heading-container">
                            {isDesktopView && (
                                <h2 className="gallery__heading">PUBLIC GALLERY</h2>
                            )}
                            {!isDesktopView && (
                                <>
                                    <h2
                                        className={showPublicGallery ? "gallery__heading" : "gallery__heading--inactive"}
                                        onClick={() => toggleComponent('Public Gallery')}>
                                        Public Gallery
                                    </h2>
                                    <h2
                                        className={showPublicGallery ? "gallery__heading--inactive" : "gallery__heading"}
                                        onClick={() => toggleComponent('Breaking News')}>
                                        Breaking News
                                    </h2>
                                </>
                            )}

                        </div>
                        {showPublicGallery ?
                            <PublicGallery
                                key={publicGalleryKey} inputText={inputText}
                                handleFetchImage={handleFetchImage} /> :
                            <BreakingNews
                                setInputText={setInputText}
                                userInputVisible={!isLoading && !generatedImage}
                                promptGenerated={promptGenerated}
                                handleGenerate={handleGenerate}
                                inputText={inputText}
                                setShowButtonAnimation={setShowButtonAnimation}
                                setPromptGenerated={setPromptGenerated}
                                handleButtonAnimation={handleButtonAnimation} />}
                    </section>
                </article>
                <section className='form__right'>
                    {isDesktopView && (
                        <article className='news-desktop'>
                            <SocialLinks />
                            <section className='news-desktop__news'>
                                <BreakingNews
                                    setInputText={setInputText}
                                    userInputVisible={!isLoading && !generatedImage}
                                    promptGenerated={promptGenerated}
                                    handleGenerate={handleGenerate}
                                    inputText={inputText}
                                    setShowButtonAnimation={setShowButtonAnimation}
                                    setPromptGenerated={setPromptGenerated}
                                    handleButtonAnimation={handleButtonAnimation}
                                    isDesktopView={isDesktopView}
                                />
                            </section>
                        </article>
                    )}
                </section>
            </main >
        </>
    );

}

export default UserInput;