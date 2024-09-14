import { useState } from 'react';
import '../SocialLinksModal/SocialLinksModal.scss'
import { Link } from 'react-router-dom'
import qrCode from '../../../src/assets/icons/qr-code.png'
import {
    // Buttons
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    RedditShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    // Icons
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    TelegramIcon,
    RedditIcon,
    XIcon,
    WhatsappIcon
} from "react-share";

function SocialLinksModal({ closeModal }) {
    const [copyText, setCopyText] = useState('Copy');

    //=================//
    // COPY URL BUTTON //
    //=================//
    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText('https://otdnews.netlify.app')
            .then(() => {
                setCopyText('Copied!');
                setTimeout(() => setCopyText('Copy'), 2000);
            })
            .catch((error) => console.error(error));
    };

    return (
        <>
            <article className='social-share'>
                <section className='social-share__nav'>
                    {/* <div className='social-share__delete-close'></div> */}
                    <h2 className='social-share__heading'>===== SHARE =====</h2>
                    <Link className="social-share__delete-close-link" to="/" onClick={closeModal}>
                        <p className='social-share__delete-close' alt='close button'>X</p>
                    </Link>
                </section>
                <section className="social-share__article">
                    <div className="social-share__row">
                        <img className='news-desktop__scan-qr' src={qrCode} alt="QR code to try the Art Generator" />
                        <div className="social-share__row-social">
                            <TwitterShareButton id="share-button__x" title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><XIcon className='social-share__icons' /><h3 className='social-share__text'>Twitter</h3></TwitterShareButton>
                            <FacebookShareButton id="share-button__facebook" title="Check out this AI Art Generator!" url={'https://otdnews.netlify.app'} className='social-share__icons'><FacebookIcon className='social-share__icons' /><h3 className='social-share__text'>Facebook</h3></FacebookShareButton>
                        </div>
                        <div className="social-share__row-social">
                            <LinkedinShareButton id="share-button__linkedin" title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} summary={"Created by ON THE Dai News - a social platform that merges breaking world news with community-generated AI art."} source={"https://www.onthedai.com"} className='social-share__icons'><LinkedinIcon className='social-share__icons' /><h3 className='social-share__text'>LinkedIn</h3></LinkedinShareButton>
                            <RedditShareButton id="share-button__reddit" title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><RedditIcon className='social-share__icons' /><h3 className='social-share__text'>Reddit</h3></RedditShareButton>
                        </div>
                    </div>
                    <div className="social-share__row--links">
                        <div className="social-share__row-social">
                            <Link className='news-desktop__scan-share' id="copy__button" onClick={copyUrlToClipboard}>
                                <lord-icon
                                    id="social__button"
                                    src="https://cdn.lordicon.com/cbigqefp.json"
                                    trigger="morph"
                                    state="morph-link"
                                    colors="primary:#fff,secondary:#b4b4b4">
                                </lord-icon>{copyText}
                            </Link>
                            <WhatsappShareButton id="share-button__whatsapp" title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><WhatsappIcon className='social-share__icons' /><h3 className='social-share__text'>WhatsApp</h3></WhatsappShareButton>
                        </div>
                        <div className="social-share__row-social">
                            <EmailShareButton id="share-button__email" title={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><EmailIcon className='social-share__icons' /><h3 className='social-share__text'>Email</h3></EmailShareButton>
                            <TelegramShareButton id="share-button__telegram" title={"Check out this AI Art Generator!"} description={"Check out this AI Art Generator!"} url={'https://otdnews.netlify.app'} className='social-share__icons'><TelegramIcon className='social-share__icons' /><h3 className='social-share__text'>Telegram</h3></TelegramShareButton>
                        </div>
                    </div>
                </section>
            </article>
        </>
    )
}

export default SocialLinksModal