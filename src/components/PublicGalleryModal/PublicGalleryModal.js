import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PublicGalleryModal.scss';
import logo from '../../assets/images/OTDLogo.png';

function PublicGalleryModal({ image, prompt, isOpen, onClose }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    const [imageUrl, setImageUrl] = useState(null);

    // For future use to add imageId as route url
    useEffect(() => {
        if (image && image.image) {
            setImageUrl(image.image);
        }
    }, [image]);

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

    // Check if image is undefined
    if (!image || !image.image) {
        return null; // or render a placeholder, loading state, or error message
    }

    return (
        <>
            {isOpen && (
                <main>
                    <div className="overlay" onClick={closeModal}>
                        <article className='pg-modal' onClick={(e) => e.stopPropagation()}>
                            <div className='pg-modal__nav'>
                                <Link className="pg-modal__logo-link" to="/" onClick={closeModal}>
                                    <img className='pg-modal__logo' src={logo} alt="OTDNews Logo" />
                                </Link>
                                <Link className="pg-modal__delete-close-link" to="/" onClick={closeModal}>
                                    <p className='pg-modal__delete-close' alt='close button'>X</p>
                                </Link>
                            </div>
                            <figure className='pg-modal__image-container'>
                                <img src={imageUrl} className='pg-modal__image' alt="From the Public Gallery" />
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
                                    <h4 className='pg-modal__prompt-description'>{prompt}</h4>
                                </section>
                            </figure>
                        </article>
                    </div>
                </main>
            )}
        </>
    );
}

export default PublicGalleryModal;
