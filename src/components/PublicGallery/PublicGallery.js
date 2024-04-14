import '../PublicGallery/PublicGallery.scss'
import React, { useState, useEffect } from 'react';
import PublicGalleryModal from '../PublicGalleryModal/PublicGalleryModal';
import { Link } from 'react-router-dom';

const PublicGallery = ({ handleFetchImage }) => {
    const [publicGalleryImages, setPublicGalleryImages] = useState([]); // State to hold gallery images
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
    const [prompt, setPrompt] = useState(null);
    const [imageId, setImageId] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        fetchPublicGalleryImages(); // Fetch gallery images when component mounts
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
            console.error('Error fetching gallery images:', error);
            setError('Error fetching gallery images. Please try again.');
        }
    };

    // Function to handle image click and open modal
    const handleImageClick = (event, image, prompt, imageId) => {
        event.preventDefault(); // Prevent default behavior of Link
        toggleModal(image, prompt, imageId); // Open modal
        console.log(imageId)
    };

    // Function to set image attributes in the modal
    const toggleModal = (image, prompt, imageId) => {
        setSelectedImage(image);
        setPrompt(prompt);
        setImageId(imageId);
    };

    // Function to close modal
    const closeModal = () => {
        setSelectedImage(null);
        setPrompt(null);
        setImageId(null);
    };

    return (
        <section className="gallery__container">
            <div className="gallery">
                {publicGalleryImages.map((image, index) => (
                    <Link
                        className='gallery__link'
                        key={index}
                        to={`/${image.imageId}`}
                        onClick={(event) => handleImageClick(event, image.image, image.prompt, image.imageId)}>
                        <img
                            src={image.image}
                            className='gallery__image'
                            alt={`Public Gallery Image ${index}`}
                        />
                    </Link>
                ))}
                {selectedImage &&
                    <PublicGalleryModal closeModal={closeModal} handleFetchImage={handleFetchImage} imageUrl={selectedImage.image} prompt={prompt} imageId={imageId} />}
            </div>
        </section>
    );
};

export default PublicGallery;
