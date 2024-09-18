/*========================
   COMMUNITY CREATIONS 
========================*/
// mario-miralles-capstone/src/components/CommunityCreations/CommunityCreations.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicGalleryModal from "../PublicGalleryModal/PublicGalleryModal";
import './CommunityCreations.scss';

const CommunityCreations = ({ isOpen, onClose, images }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imagesPerPage = 30;
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

    const totalPages = Math.ceil(images.length / imagesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    if (!isOpen) return null;

    return (
        <article className="community-creations">
            <section className="community-creations__header">
                <h2>Community Creations</h2>
                <button className="community-creations__close-button" onClick={onClose}>X</button>
            </section>
            <section className="community-creations__gallery">
                {currentImages.map((image, index) => (
                    <Link
                        className="community-creations__link"
                        key={index}
                        to={`/gallery/${image.imageId}`}
                        onClick={(event) => {
                            event.preventDefault();
                            handleImageClick(image); }}>
                            <img
                            src={image.image}
                            className="community-creations__image"
                            alt={`Community Creation ${indexOfFirstImage + index + 1}`} />
                    </Link>
                ))}
            </section>
            <div className="community-creations__pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`community-creations__pagination-button ${index + 1 === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
            {selectedImage && isModalOpen && (
                <PublicGalleryModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    image={selectedImage}
                    prompt={selectedImage.prompt} />
            )}
        </article>
    );
};

export default CommunityCreations;