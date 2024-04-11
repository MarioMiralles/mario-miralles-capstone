import '../PublicGallery/PublicGallery.scss'
import React, { useState, useEffect } from 'react';
import PublicGalleryModal from '../PublicGalleryModal/PublicGalleryModal';

const PublicGallery = () => {
    const [publicGalleryImages, setPublicGalleryImages] = useState([]); // State to hold gallery images
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
    const [prompt, setPrompt] = useState(null);
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
                const images = [];
                const prompt = [];
                // Iterate over each generation
                responseData.generations.forEach((generation, index) => {
                    // Iterate over each generated image within the generation
                    const obj = { image: generation.generated_images[0].url, prompt: generation.prompt }
                    images.push(obj)
                });
                setPublicGalleryImages(images);
                setPrompt(prompt);
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
    const toggleModal = (image, prompt) => {
        setSelectedImage(image);
        setPrompt(prompt)
    };

    // Function to close modal
    const closeModal = () => {
        setSelectedImage(null);
        setPrompt(null)
    };

    return (
        <section className="gallery__container">
            <div className="gallery">
                {publicGalleryImages.map((image, index) => (
                    <img key={index} src={image.image} className='gallery__image' alt={`Public Gallery Image ${index}`} onClick={() => toggleModal(image.image, image.prompt)} /> // Need to find the url for each image
                ))}
                {selectedImage &&
                    <PublicGalleryModal
                        toggleModal={closeModal}
                        image={selectedImage}
                        prompt={prompt}
                    />}
            </div>
        </section>
    );
};

export default PublicGallery;
