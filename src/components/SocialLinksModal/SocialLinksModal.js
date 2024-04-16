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
    XIcon,
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
                    <WhatsappShareButton title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><WhatsappIcon className='social-share__icons' /><h3 className='social-share__text'>WhatsApp</h3></WhatsappShareButton>
                    <TwitterShareButton title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><XIcon className='social-share__icons' /><h3 className='social-share__text'>Twitter</h3></TwitterShareButton>
                    <FacebookShareButton title="Check out this AI Art Generator!" url={'https://otdnews.netlify.app'} className='social-share__icons'><FacebookIcon className='social-share__icons' /><h3 className='social-share__text'>Facebook</h3></FacebookShareButton>
                </div>
                <div className="social-share__row--links">
                    <LinkedinShareButton title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} summary={"Created by ON THE Dai News - a social platform that merges breaking world news with community-generated AI art."} source={"https://www.onthedai.com"} className='social-share__icons'><LinkedinIcon className='social-share__icons' /><h3 className='social-share__text'>LinkedIn</h3></LinkedinShareButton>
                    <RedditShareButton title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><RedditIcon className='social-share__icons' /><h3 className='social-share__text'>Reddit</h3></RedditShareButton>
                    <PinterestShareButton description={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><PinterestIcon className='social-share__icons' /><h3 className='social-share__text'>Pinterest</h3></PinterestShareButton>
                    <EmailShareButton title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><EmailIcon className='social-share__icons' /><h3 className='social-share__text'>Email</h3></EmailShareButton>
                </div>
            </section>
        </>
    )
}

export default SocialLinksModal