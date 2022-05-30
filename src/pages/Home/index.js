import { memo } from "react"
import { useNavigate } from 'react-router-dom'
import styles from './home.module.css'

// image assets
import mainThumb from '../../assets/nonAdmin/main-thumb.jpg'
import menThumb from '../../assets/nonAdmin/men-thumb.jpg'
import ladiesThumb from '../../assets/nonAdmin/ladies-thumb.jpg'
import girlsThumb from '../../assets/nonAdmin/girls-thumb.jpg'
import boysThumb from '../../assets/nonAdmin/boys-thumb.jpg'

const tempNavigate = ['profile', 'cart']

function Home() {
    const nav = useNavigate()

    return (
        <div className={styles.homePageContainer} >
            <div className={styles.topContainer}>
                <img className={styles.mainImage} src={mainThumb} alt="Main thumb" />
                <span className={styles.largeTitle}>
                    Outfit of the week
                </span>
                <div 
                    className={styles.button + ' ' + styles.largeButton} 
                    onClick={() => nav('../products/ladies/jacket_628609157d8979f4ee873ef2')}
                >
                    Shop now
                </div>
            </div>
            <div className={styles.bottomContainer} >

                <div className={styles.subCard} >
                    <img className={styles.subImage} src={menThumb} alt=" Men thumbnail" />
                    <div className={styles.smallTitle} >
                        Men
                    </div>
                    <div 
                        className={styles.button + ' ' + styles.smallButton} 
                        onClick={() => nav('../products/men/t-shirt_628609b77d8979f4ee873ef3')}
                    >
                        Shop now
                    </div>
                </div>

                <div className={styles.subCard} >
                    <img className={styles.subImage} src={ladiesThumb} alt="Ladies thumbnail" />
                    <div className={styles.smallTitle} >
                        Ladies
                    </div>
                    <div 
                        className={styles.button + ' ' + styles.smallButton} 
                        onClick={() => nav('../products/ladies/dress_627f834268f077fbd73d233b')}
                    >
                        Shop now
                    </div>
                </div>

                <div className={styles.subCard} >
                    <img className={styles.subImage} src={girlsThumb} alt="Girls thumnail" />
                    <div className={styles.smallTitle} >
                        Girls
                    </div>
                    <div 
                        className={styles.button + ' ' + styles.smallButton} 
                    >
                        Shop now
                    </div>
                </div>

                <div className={styles.subCard} >
                    <img className={styles.subImage} src={boysThumb} alt="Boys thumbnail" />
                    <div className={styles.smallTitle} >
                        Boys
                    </div>
                    <div 
                        className={styles.button + ' ' + styles.smallButton} 
                    >
                        Shop now
                    </div>
                </div>

            </div>
        </div>
    )
}

export default memo(Home)