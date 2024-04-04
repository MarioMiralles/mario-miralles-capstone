import './UserInput.scss'
import logo from '../../../src/assets/images/Logo2024.png';
import loadingGif from '../../assets/images/Loading_GIF.gif'
import React, { useState, useEffect } from "react";
import PublicGallery from '../PublicGallery/PublicGallery';
import BreakingNews from '../BreakingNews/BreakingNews';

const apiKey = process.env.REACT_APP_API_KEY;

function UserInput() {

    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generationId, setGenerationId] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track fetching image state
    const [imageLoaded, setImageLoaded] = useState(false); // Track whether the image has been successfully loaded
    const [publicGalleryKey, setPublicGalleryKey] = useState(0); // Key to force re-render PublicGallery component

    useEffect(() => {
        if (generationId) {
            handleFetchImage();
        }
    }, [generationId]);

    const handleGenerate = async (inputText) => {
        setIsLoading(true); // Set loading to true when generating image
        setGeneratedImage(null); // Reset generated image when generating new image
        try {
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
            setIsLoading(false); // Set loading to false if error occurs
        }
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setImageLoaded(false); // Reset the imageLoaded state when submitting a new request
        handleGenerate(inputText);
    };

    const handleCreateNew = () => {
        setInputText(''); // Reset input text
        setGeneratedImage(null); // Reset generated image
        setPublicGalleryKey(prevKey => prevKey + 1);
    };

    return (
        <>
            <article className='form__article'>
                {!isLoading && !generatedImage && (
                    <form className='form' onSubmit={handleSubmit}>
                        <fieldset>
                            <legend><img src={logo} className='logo' alt="ON THE Dai AI Art Generator Logo" /></legend>
                            <textarea
                                className='form__input'
                                placeholder='What would you like to create?'
                                value={inputText}
                                onChange={(event) => setInputText(event.target.value)}>
                            </textarea>
                            <button type='submit' className='form__button'>GENERATE</button>
                        </fieldset>
                    </form>
                )}
                {error && <div>{error}</div>}
                {isLoading && <img className="generated__loading" src={loadingGif} alt="generating image..." />} {/* Loading indicator */}
                {generatedImage && imageLoaded && (
                    <section className="generated__container">
                        <img src={generatedImage} className='generated__image' alt="Generated Artwork" />
                        <button onClick={handleCreateNew} className='generated__create-new-button'>CREATE NEW ART</button>
                    </section>
                )}
            </article>
            <PublicGallery key={publicGalleryKey} />
            <BreakingNews />
        </>
    );

}

export default UserInput;