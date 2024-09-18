//================//
// PUBLIC GALLERY //
//================//
// mario-miralles-capstone/src/components/PublicGallery/PublicGallery.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loadingNews from '../../../src/assets/images/Loading_News2.gif';
import PublicGalleryModal from '../PublicGalleryModal/PublicGalleryModal';
import CommunityCreations from '../CommunityCreations/CommunityCreations';
import './PublicGallery.scss';

const PublicGallery = ({ isDesktopView }) => {
    const [publicGalleryImages, setPublicGalleryImages] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommunityCreationsOpen, setIsCommunityCreationsOpen] = useState(false);

    const apiKey = process.env.REACT_APP_API_KEY;

    // Fetch images when component mounts
    useEffect(() => {
        fetchPublicGalleryImages();
    }, []);

    const fetchPublicGalleryImages = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${apiKey}`
                }
            };

            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations/user/5fc49543-399b-4eb1-ab31-ca611e89df0e?offset=0&limit=30', options);
            if (!response.ok) {
                throw new Error('Failed to fetch gallery images');
            }
            const responseData = await response.json();

            // Check if responseData contains the generations array
            if (responseData && responseData.generations) {
                const images = responseData.generations.map((generation) => ({
                    image: generation.generated_images[0].url,
                    prompt: generation.prompt,
                    imageId: generation.id
                }));
                setPublicGalleryImages(images);
                setError(null);
            } else {
                throw new Error('Invalid response data format');
            }
        } catch (error) {
            setError('Error fetching gallery images. Please try again.');
        } finally {
            setIsLoading(false); // Set loading to false after fetching images
        }
    };

    // Function to handle image click and open modal
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setPrompt(image.prompt);
        setImageId(image.imageId);
        setIsModalOpen(true); // Update state to open the modal
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleViewMoreClick = () => {
        setIsCommunityCreationsOpen(true);
    };

    const renderGalleryImages = () => {
        const imagesToShow = isDesktopView ? publicGalleryImages.slice(0, 4) : publicGalleryImages;
        return imagesToShow.map((image, index) => (
            <Link
                className='gallery__link'
                key={index}
                to={`/gallery/${image.imageId}`}
                onClick={(event) => {
                    event.preventDefault();
                    handleImageClick(image);
                }}>
                <img
                    src={image.image}
                    className='gallery__image'
                    alt={`From Community Creations number ${index}`}
                />
            </Link>
        ));
    };

    return (
        <section className="gallery__container">
            {isLoading ? ( // Show loading GIF while fetching images
                <div className='news__loading-container'>
                    <img src={loadingNews} className="news__loading" alt="Loading news..." />
                </div>
            ) : (
                <div className="gallery">
                    {renderGalleryImages()}
                    {isDesktopView &&(
                        <button
                            className="gallery__view-more"
                            onClick={handleViewMoreClick}>
                            View More
                        </button>
                    )}
                    {selectedImage && isModalOpen && (
                        <PublicGalleryModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            image={selectedImage} // Ensure the prop name matches what PublicGalleryModal expects
                            prompt={prompt} />
                    )}
                    {isCommunityCreationsOpen && (
                        <CommunityCreations
                            isOpen={isCommunityCreationsOpen}
                            onClose={() => setIsCommunityCreationsOpen(false)}
                            images={publicGalleryImages}
                        />
                    )}
                </div>
            )}
        </section>
    );
};

export default PublicGallery;