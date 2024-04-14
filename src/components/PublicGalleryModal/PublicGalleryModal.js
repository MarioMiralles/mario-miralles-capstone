import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PublicGalleryModal.scss';
import logo from '../../assets/images/OTDLogo.png';

function PublicGalleryModal({ handleFetchImage, imageUrl: propImageUrl, prompt, imageId }) {
    const [copied, setCopied] = useState(false); // State variable to track whether the headline has been copied
    const [promptState, setPrompt] = useState(null); // State to hold prompt
    const [isModalOpen, setIsModalOpen] = useState(true); // State to track whether the modal is open
    const navigate = useNavigate();

    // Fetch image and prompt based on imageId
    useEffect(() => {
        if (imageId) {
            navigate(`/${imageId}`);
            handleFetchImage(imageId)
                .then(data => {
                    if (data && data.imageUrl && data.prompt) {
                        setImageUrl(data.imageUrl);
                        setPrompt(data.prompt);
                    } else {
                        console.error('Invalid data format:', data);
                        // Handle the case where the data is not as expected
                    }
                })
                .catch(error => {
                    console.error('Error fetching image data:', error);
                    // Handle fetch error
                });
        }
    }, [imageId, navigate, handleFetchImage]);

    // Set the imageUrl state with the prop value
    const [imageUrl, setImageUrl] = useState(propImageUrl);

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
        <>
            {isModalOpen && (
                <main>
                    <div className="overlay">
                        <article className='pg-modal' onClick={(e) => e.stopPropagation()}>
                            <div className='pg-modal__nav'>
                                <Link className="pg-modal__logo-link" to=".." relative="path">
                                    <img className='pg-modal__logo' src={logo} />
                                </Link>
                                <Link className="pg-modal__delete-close-link" to=".." relative="path">
                                    <p className='pg-modal__delete-close' alt='close button'>X</p>
                                </Link>
                            </div>
                            <figure className='pg-modal__image-container'>
                                <img src={imageUrl} className='pg-modal__image' alt="Public Gallery Image" />
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
