import { useState } from 'react';
import '../SocialLinksModal/SocialLinksModal.scss'
import { Link } from 'react-router-dom'
import {
    // Buttons
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    RedditShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    // Icons
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TwitterIcon,
    WhatsappIcon
} from "react-share";

function SocialLinksModal({ closeModal }) {
    const [copyText, setCopyText] = useState('Copy');

    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText('https://onthedai.com/create-art')
            .then(() => {
                setCopyText('Copied!');
                setTimeout(() => setCopyText('Copy'), 2000);
            })
            .catch((error) => console.error(error));
    };

    return (
        <>
            <section className='social-share'>
                <div className='social-share__nav'>
                    <h2 className='social-share__heading'>SHARE ==========</h2>
                    <Link className="social-share__delete-close-link" to="/" onClick={closeModal}>
                        <p className='social-share__delete-close' alt='close button'>X</p>
                    </Link>
                </div>
                <div className="social-share__row--links">
                    <Link className='news-desktop__scan-share' id="copy__button" onClick={copyUrlToClipboard}>
                        <lord-icon
                            id="share__button"
                            src="https://cdn.lordicon.com/cbigqefp.json"
                            trigger="morph"
                            state="morph-link"
                            colors="primary:#fff,secondary:#b4b4b4">
                        </lord-icon>{copyText}
                    </Link>
                    <EmailShareButton url={"https://onthedai.com/create-art"} className='social-share__icons'><EmailIcon className='social-share__icons' /><h3 className='social-share__text'>Email</h3></EmailShareButton>
                    <FacebookShareButton className='social-share__icons'><FacebookIcon className='social-share__icons' /><h3 className='social-share__text'>Facebook</h3></FacebookShareButton>
                    <LinkedinShareButton className='social-share__icons'><LinkedinIcon className='social-share__icons' /><h3 className='social-share__text'>LinkedIn</h3></LinkedinShareButton>
                </div>
                <div className="social-share__row--links">
                    <PinterestShareButton className='social-share__icons'><PinterestIcon className='social-share__icons' /><h3 className='social-share__text'>Pinterest</h3></PinterestShareButton>
                    <RedditShareButton className='social-share__icons'><RedditIcon className='social-share__icons' /><h3 className='social-share__text'>Reddit</h3></RedditShareButton>
                    <TwitterShareButton className='social-share__icons'><TwitterIcon className='social-share__icons' /><h3 className='social-share__text'>Twitter</h3></TwitterShareButton>
                    <WhatsappShareButton className='social-share__icons'><WhatsappIcon className='social-share__icons' /><h3 className='social-share__text'>WhatsApp</h3></WhatsappShareButton>
                </div>
            </section>
        </>
    )
}

export default SocialLinksModal