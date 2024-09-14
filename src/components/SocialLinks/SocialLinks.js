import "../SocialLinks/SocialLinks.scss";
import { Link } from "react-router-dom";
import rumble from '../../../src/assets/icons/rumble.svg';
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
                                <Link className='news-desktop__social-website' to="https://onthedai.com" target='_blank'><lord-icon
                                    id="social__button"
                                    src="https://cdn.lordicon.com/trkmlure.json"
                                    trigger="hover"
                                    state="hover-rotate-up-to-down"
                                    colors="primary:#ef8e6d,secondary:#ffffff">
                                </lord-icon>Official Website</Link>
                            </div>
                        </div>
                        <div className='news-desktop__scan'>
                            <div className='news-desktop__social-column'>
                                <div className="news-desktop__social-row">
                                    <button className='news-desktop__scan-share' onClick={toggleModal}>
                                        <lord-icon
                                            id="social__button"
                                            src="https://cdn.lordicon.com/mqwitsmv.json"
                                            trigger="hover"
                                            state="hover-slide"
                                            colors="primary:#ef8e6d,secondary:#ffffff">
                                        </lord-icon>Share</button>
                                    <Link className='news-desktop__social-icon' to="https://discord.com/invite/J5RGSpeXHd" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/ypulwtep.json"
                                        trigger="hover"
                                        colors="primary:#EF8E6D,secondary:#ffffff"
                                        className='news-desktop__social-icon'>
                                    </lord-icon>Discord</Link>
                                    <Link className='news-desktop__social-icon' to="https://www.tiktok.com/@onthedai" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/wrcqrmcb.json"
                                        trigger="hover"
                                        colors="primary:#ef8e6d,secondary:#ffffff">
                                    </lord-icon>TikTok</Link>
                                    <Link className='news-desktop__social-icon' to="https://www.instagram.com/onthedai_news/" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/ewswvzmw.json"
                                        trigger="hover"
                                        state="hover-rotate"
                                        colors="primary:#ef8e6d,secondary:#ffffff">
                                    </lord-icon>Instagram</Link>
                                </div>
                                <div className='news-desktop__social-row'>
                                    <Link className='news-desktop__social-icon' to="https://twitter.com/onthedai" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/lhscugaw.json"
                                        trigger="hover"
                                        state="hover-draw"
                                        colors="primary:#ef8e6d,secondary:#ffffff">
                                    </lord-icon>Twitter</Link>
                                    <Link className='news-desktop__social-icon' to="https://youtube.com/@onthedai?sub_confirmation=1" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/gewhxiwb.json"
                                        trigger="morph"
                                        state="morph-logotype"
                                        colors="primary:#ef8e6d,secondary:#ffffff">
                                    </lord-icon>YouTube</Link>
                                    <Link className='news-desktop__social-icon' to="https://www.facebook.com/onthedai/" target='_blank'><lord-icon
                                        id="social__button"
                                        src="https://cdn.lordicon.com/iqagrlso.json"
                                        trigger="hover"
                                        state="hover-roll"
                                        colors="primary:#ef8e6d,secondary:#ffffff">
                                    </lord-icon>Facebook</Link>
                                    <Link className='news-desktop__social-icon' to="https://rumble.com/c/c-3329336" target='_blank'><img id="social__button--rumble" className='news-desktop__social-icon' src={rumble} alt="Rumble" />Rumble</Link>
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