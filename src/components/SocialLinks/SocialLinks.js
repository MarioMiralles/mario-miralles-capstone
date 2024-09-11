import "../SocialLinks/SocialLinks.scss";
import { Link } from "react-router-dom";
import discord from '../../../src/assets/icons/discord.png';
import tiktok from '../../../src/assets/icons/tiktok.png';
import website from '../../../src/assets/icons/Website_GIF.gif';
import instagram from '../../../src/assets/icons/instagram.png';
import twitter from '../../../src/assets/icons/twitter.png';
import youtube from '../../../src/assets/icons/youtube.png';
import facebook from '../../../src/assets/icons/facebook.png';
import rumble from '../../../src/assets/icons/rumble.png';
import otdPromoVideo from '../../../src/assets/videos/promo.mp4';
import poster from '../../../src/assets/icons/poster.png';
import footerLogo from '../../../src/assets/images/otdlogogiftransparent.gif';
import footerMotto from '../../../src/assets/images/otdMotto.png';
import SocialLinksModal from "../SocialLinksModal/SocialLinksModal";
import { useState, useRef } from "react";

function SocialLinks() {
    const [modalOpen, setModalOpen] = useState(false);
    const videoRef = useRef(null);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    //=============//
    // PROMO VIDEO //
    //=============//
    const handlePlay = () => {
        // Show controls when the video starts playing
        videoRef.current.controls = true;
    };

    const handlePause = () => {
        // Hide controls when the video pauses
        videoRef.current.controls = false;
    };

    return (
        <>
            <section className='news-desktop__social'>
                <div className="news-desktop__social-container">
                    <div className='news-desktop__footer'>
                        <img className='news-desktop__footer-logo' src={footerLogo} alt="ON THE Dai News" />
                        <img className='news-desktop__footer-motto' src={footerMotto} alt="ON THE Dai News" />
                    </div>
                    {modalOpen && <SocialLinksModal closeModal={toggleModal} />}
                    <article className="news-desktop__social-tablet">
                        <div className='news-desktop__social-row--container' style={{ display: modalOpen ? 'none' : 'flex' }}>
                            <div className='news-desktop__social-column-website'>
                                <video
                                    ref={videoRef}
                                    poster={poster}
                                    className='news-desktop__video-mp4'
                                    onMouseEnter={handlePlay}
                                    onMouseLeave={handlePause}
                                    onClick={handlePlay}>
                                    <source src={otdPromoVideo} type='video/mp4'></source>
                                </video>
                                <Link className='news-desktop__social-website' to="https://onthedai.com" target='_blank'><img className='news-desktop__social-website--icon' src={website} alt="Official Website" /></Link>
                            </div>
                        </div>
                        <div className='news-desktop__scan'>
                            <div className='news-desktop__social-column'>
                                <div className="news-desktop__social-row">
                                    <button className='news-desktop__scan-share' onClick={toggleModal}>
                                        <lord-icon
                                            id="share__button"
                                            src="https://cdn.lordicon.com/qpvtavng.json"
                                            trigger="hover"
                                            state="hover-slide"
                                            colors="primary:#ef8e6d,secondary:#fff,tertiary:#000">
                                        </lord-icon>SHARE</button>
                                    <Link className='news-desktop__social-icon' to="https://discord.com/invite/J5RGSpeXHd" target='_blank'><img className='news-desktop__social-icon' src={discord} alt="Discord" /></Link>
                                    <Link className='news-desktop__social-icon' to="https://www.tiktok.com/@onthedai" target='_blank'><img className='news-desktop__social-icon' src={tiktok} alt="TikTok" /></Link>
                                    <Link className='news-desktop__social-icon' to="https://www.instagram.com/onthedai_news/" target='_blank'><img className='news-desktop__social-icon' src={instagram} alt="Instagram" /></Link>
                                </div>
                                <div className='news-desktop__social-row'>
                                    <Link className='news-desktop__social-icon' to="https://twitter.com/onthedai" target='_blank'><img className='news-desktop__social-icon' src={twitter} alt="Twitter" /></Link>
                                    <Link className='news-desktop__social-icon' to="https://youtube.com/@onthedai?sub_confirmation=1" target='_blank'><img className='news-desktop__social-icon' src={youtube} alt="YouTube" /></Link>
                                    <Link className='news-desktop__social-icon' to="https://www.facebook.com/onthedai/" target='_blank'><img className='news-desktop__social-icon' src={facebook} alt="Facebook" /></Link>
                                    <Link className='news-desktop__social-icon' to="https://rumble.com/c/c-3329336" target='_blank'><img className='news-desktop__social-icon' src={rumble} alt="Rumble" /></Link>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </>
    )
}

export default SocialLinks;