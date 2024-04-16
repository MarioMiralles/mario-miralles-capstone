import '../PublicGallery/PublicGallery.scss'
import React, { useState, useEffect } from 'react';
import PublicGalleryModal from '../PublicGalleryModal/PublicGalleryModal';
import { Link } from 'react-router-dom';

const PublicGallery = () => {
    const [publicGalleryImages, setPublicGalleryImages] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const apiKey = process.env.REACT_APP_API_KEY; // Leonardo AI

    //==============//
    // FETCH IMAGES //
    //==============//
    useEffect(() => {
        fetchPublicGalleryImages(); // Fetch gallery images when component mounts
    });

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
            console.error('Error fetching gallery images:', error);
            setError('Error fetching gallery images. Please try again.');
        }
    };

    //========================//
    // OPEN/CLOSE IMAGE MODAL //
    //========================//
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

    return (
        <section className="gallery__container">
            <div className="gallery">
                {publicGalleryImages.map((image, index) => (
                    <Link
                        className='gallery__link'
                        key={index}
                        to={`/gallery/${image.imageId}`}
                        onClick={(event) => {
                            event.preventDefault(); // Prevent default link behavior
                            handleImageClick(image); // Open modal instead
                        }}>
                        <img
                            src={image.image}
                            className='gallery__image'
                            alt={`From Public Gallery number ${index}`}
                        />
                    </Link>
                ))}
                {selectedImage && isModalOpen && (
                    <PublicGalleryModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        image={selectedImage} // Ensure the prop name matches what PublicGalleryModal expects
                        prompt={prompt} />
                )}
            </div>
        </section>
    );
};

export default PublicGallery;
