import { memo } from "react"
import {Link} from 'react-router-dom'
import styles from './home.module.css'

const tempNavigate = ['profile', 'cart']

function Home() {
    console.log('home')
    return (
        <div className={styles.homePageContainer} >
            <h1>Home</h1>
            <ul>
                {
                    tempNavigate.map((e, i) => {
                        return (
                            <li
                                key = {i}
                            >
                                <Link to = {`/${e}`}>{e}</Link>
                                <br></br>
                            </li>
                        )
                    })
                }
                <li>
                    product list
                    <ul>
                        <li>
                            men
                            <ul>
                                <Link to = "/products/men/short/all_short">short</Link>
                            </ul>
                        </li>
                        <li>lady</li>
                        <li>boy</li>
                        <li>girl</li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default memo(Home)