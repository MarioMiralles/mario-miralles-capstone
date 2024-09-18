import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PublicGalleryModal.scss';
import logo from '../../assets/images/OTDLogo.png';

function PublicGalleryModal({ images, initialIndex = 0, prompt, isOpen, onClose, isTabletView, isDesktopView }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    // const [imageUrl, setImageUrl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // // For future use to add imageId as route url
    // useEffect(() => {
    //     if (image && image.image) {
    //         setImageUrl(image.image);
    //     }
    // }, [image]);

    // Effect to handle body overflow scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    //=====================//
    // COPY PROMPT FEATURE //
    //=====================//
    const copyPrompt = () => {
        navigator.clipboard.writeText(prompt)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => console.error(error));
    };

    // Function to close the modal
    const closeModal = () => {
        onClose();
    };

    /*=========================
       CAROUSEL FUNCTIONALITY
    =========================*/
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Check if image is undefined
    if (!images || !images.length === 0 || !isOpen) {
        return null;
    }

    const renderImages = () => {
        if (isTabletView || isDesktopView) {
            return (
                <section className='pg-modal__carousel'>
                    <button className='pg-modal__carousel-button pg-modal__carousel-button--left' onClick={prevImage}>&lt;</button>
                    <img src={images[currentIndex].image} className='pg-modal__carousel-image' alt={`Gallery image ${currentIndex + 1}`} />
                    <button className='pg-modal__carousel-button pg-modal__carousel-button--right' onClick={nextImage}>&gt;</button>
                </section>
            );
        } else {
            return images.map((image, index) => (
                <figure key={index} className='pg-modal__image-container'>
                    <img src={image.image} className='pg-modal__image' alt={`Gallery image ${index + 1}`} />
                    <section className='pg-modal__prompt'>
                        <div className='pg-modal__prompt-nav'>
                            <h3 className='pg-modal__prompt-heading'>Prompt:</h3>
                            <button className='pg-modal__prompt-nav-copy' onClick={() => copyPrompt(image.prompt)}>
                                {copied ? 'Copied!' : 'Copy Prompt'}
                                <lord-icon
                                    id="news-info__img"
                                    src="https://cdn.lordicon.com/pcllgpqm.json"
                                    trigger="click"
                                    stroke="bold"
                                    colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                                </lord-icon>
                            </button>
                        </div>
                        <h4 className='pg-modal__prompt-description'>{image.prompt}</h4>
                    </section>
                </figure>
            ));
        }
    };

    return (
        <>
            {isOpen && (
                <main>
                    <div className="overlay" onClick={closeModal}>
                        <article className='pg-modal' onClick={(e) => e.stopPropagation()}>
                            <div className='pg-modal__nav'>
                                <Link className="pg-modal__delete-close-link" to="/" onClick={closeModal}>
                                    <p className='pg-modal__delete-close' alt='close button'>X</p>
                                </Link>
                            </div>
                            <article className='pg-modal__images'>
                                {renderImages()}
                            </article>
                            {(isTabletView || isDesktopView) && (
                                <section className='pg-modal__prompt'>
                                    <div className='pg-modal__prompt-nav'>
                                        <h3 className='pg-modal__prompt-heading'>Prompt:</h3>
                                        <button className='pg-modal__prompt-nav-copy' onClick={copyPrompt}>{copied ? 'Copied!' : 'Copy Prompt'}
                                            <lord-icon
                                                id="news-info__img"
                                                src="https://cdn.lordicon.com/pcllgpqm.json"
                                                trigger="click"
                                                stroke="bold"
                                                colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                                            </lord-icon>
                                        </button>
                                    </div>
                                    <h4 className='pg-modal__prompt-description'>{images[currentIndex].prompt}</h4>
                                </section>
                            )}
                        </article>
                    </div>
                </main>
            )}
        </>
    );
}

export default PublicGalleryModal;
