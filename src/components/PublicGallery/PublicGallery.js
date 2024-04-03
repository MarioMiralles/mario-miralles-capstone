import '../PublicGallery/PublicGallery.scss'
import React, { useState, useEffect } from 'react';

const PublicGallery = ({ refreshPublicGallery }) => {
    const [publicGalleryImages, setPublicGalleryImages] = useState([]); // State to hold gallery images
    const [error, setError] = useState(null);
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
                // Iterate over each generation
                responseData.generations.forEach(generation => {
                    // Iterate over each generated image within the generation
                    generation.generated_images.forEach(image => {
                        images.push(image.url);
                    });
                });
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

    return (
        <section className="gallery__container">
            <h2 className="gallery__heading">Public Gallery</h2>
            <div className="gallery">
                {publicGalleryImages.map((image, index) => (
                    <img key={index} src={image} className='gallery__image' alt={`Public Gallery Image ${index}`} />
                ))}
            </div>
            {/* No need for a button to refresh the gallery */}
        </section>
    );
};

export default PublicGallery;
