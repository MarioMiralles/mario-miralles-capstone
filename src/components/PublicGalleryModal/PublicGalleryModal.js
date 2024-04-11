import { useEffect } from 'react';
import './PublicGalleryModal.scss';
import logo from '../../assets/images/OTDLogo.png';

function PublicGalleryModal({ toggleModal, image, prompt }) {
    const handleCancel = (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the overlay
        console.log("X button clicked"); // Log to see if X button is clicked
        toggleModal(); // Close the modal
    }

    // Effect to handle body overflow
    useEffect(() => {
        // Disable scrolling when the modal is opened
        document.body.style.overflow = 'hidden';

        // Enable scrolling when the modal is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="overlay" onClick={handleCancel}>
            <article className='pg-modal' onClick={(e) => e.stopPropagation()}>
                <div className='pg-modal__nav'>
                    <img className='pg-modal__logo' src={logo} />
                    <p className='pg-modal__delete-close' alt='close button' onClick={handleCancel}>X</p>
                </div>
                <figure className='pg-modal__image-container'>
                    <img src={image} className='pg-modal__image' alt="Public Gallery Image" />
                    <section className='pg-modal__prompt'>
                        <div className='pg-modal__prompt-nav'>
                            <h3 className='pg-modal__prompt-heading'>Prompt:</h3>
                            
                        </div>
                        <h4 className='pg-modal__prompt-description'>{prompt}</h4>
                    </section>
                </figure>
            </article>
        </div>
    );
}

export default PublicGalleryModal;
