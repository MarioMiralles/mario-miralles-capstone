import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './PublicGalleryModal.scss';

function PublicGalleryModal({ images, initialIndex = 0, isOpen, onClose, isTabletView, isDesktopView }) {
    const [copied, setCopied] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [expandedPrompts, setExpandedPrompts] = useState({});
    const selectedImageRef = useRef(null);

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

    useEffect(() => {
        if (!isTabletView && !isDesktopView && selectedImageRef.current) {
            selectedImageRef.current.scrollIntoView();
        }
    }, [currentIndex, isTabletView, isDesktopView]);

    //=====================//
    // COPY PROMPT FEATURE //
    //=====================//
    const copyPrompt = (promptText, index) => {
        navigator.clipboard.writeText(promptText)
            .then(() => {
                setCopied((prev) => ({ ...prev, [index]: true }));
                setTimeout(() => setCopied((prev) => ({ ...prev, [index]: false })), 2000);
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

    const togglePromptExpansion = (index) => {
        setExpandedPrompts((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const renderPrompt = (promptText, index) => {
        let maxWords = 10;
        const words = promptText.split(' ');
        const truncatedPrompt = words.slice(0, maxWords).join(' ') + (words.length > maxWords ? ' ' : ' ');

        const isExpanded = expandedPrompts[index] || false;

        if (isDesktopView) {
            return (
                <h4 className='pg-modal__prompt-description full'>
                    {promptText}
                </h4>
            );
        }

        return (
            <h4 className={`pg-modal__prompt-description ${isExpanded ? 'full' : 'clamped'}`}>
                {isExpanded ? promptText : truncatedPrompt}
                {words.length > maxWords && (
                    <button className='pg-modal__more-button' onClick={() => togglePromptExpansion(index)}>
                        {isExpanded ? ' ⇪collapse' : '...more⤵'}
                    </button>
                )}
            </h4>
        );
    };

    const renderImages = () => {
        if (isTabletView || isDesktopView) {
            return (
                <section className='pg-modal__carousel'>
                    <button className='pg-modal__carousel-button pg-modal__carousel-button--left' onClick={prevImage}>⯇</button>
                    <img src={images[currentIndex].image} className='pg-modal__carousel-image' alt={`Gallery ${currentIndex + 1}`} />
                    <button className='pg-modal__carousel-button pg-modal__carousel-button--right' onClick={nextImage}>⯈</button>
                </section>
            );
        } else {
            return (
                <section className='pg-modal__vertical-list'>
                    {images.map((image, index) => (
                        <figure key={index} className={`pg-modal__image-container ${currentIndex === index ? 'selected' : ''}`}
                            ref={currentIndex === index ? selectedImageRef : null} >
                            <img src={image.image} className='pg-modal__image' alt={`Gallery ${index + 1}`} />
                            <section className='pg-modal__prompt'>
                                <div className='pg-modal__prompt-nav'>
                                    <h3 className='pg-modal__prompt-heading'>Prompt:</h3>
                                    <button className='pg-modal__prompt-nav-copy' onClick={() => copyPrompt(image.prompt, index)}>
                                        {copied[index] ? 'Copied!' : 'Copy Prompt'}
                                        <lord-icon
                                            id="news-info__img"
                                            src="https://cdn.lordicon.com/pcllgpqm.json"
                                            trigger="click"
                                            stroke="bold"
                                            colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                                        </lord-icon>
                                    </button>
                                </div>
                                {renderPrompt(image.prompt, index)}
                            </section>
                        </figure >
                    ))}
                </section>
            );
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
                            <figure className='pg-modal__container'>
                                <section className='pg-modal__images'>
                                    {renderImages()}
                                </section>
                                {(isTabletView || isDesktopView) && (
                                    <section className='pg-modal__prompt'>
                                        <div className='pg-modal__prompt-nav'>
                                            <h3 className='pg-modal__prompt-heading'>Prompt:</h3>
                                            <button className='pg-modal__prompt-nav-copy' onClick={() => copyPrompt(images[currentIndex].prompt, currentIndex)}>
                                                {copied[currentIndex] ? 'Copied!' : 'Copy Prompt'}
                                                <lord-icon
                                                    id="news-info__img"
                                                    src="https://cdn.lordicon.com/pcllgpqm.json"
                                                    trigger="click"
                                                    stroke="bold"
                                                    colors="primary:#121331,secondary:#ef8e6d,tertiary:#ffffff">
                                                </lord-icon>
                                            </button>
                                        </div>
                                        {renderPrompt(images[currentIndex].prompt, currentIndex)}
                                    </section>
                                )}
                            </figure>
                        </article>
                    </div>
                </main>
            )}
        </>
    );
}

export default PublicGalleryModal;