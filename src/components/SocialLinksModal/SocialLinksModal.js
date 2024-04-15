import '../SocialLinksModal/SocialLinksModal.scss'
import { Link } from 'react-router-dom'

function SocialLinksModal({ closeModal }) {

    return (
        <>
            <section className='social-share'>
                <Link className="social-share__delete-close-link" to="/" onClick={closeModal}>
                    <p className='social-share__delete-close' alt='close button'>X</p>
                </Link>
                <div className="news-desktop__social-row">
                    
                </div>
            </section>
        </>
    )
}

export default SocialLinksModal