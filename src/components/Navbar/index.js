import styles from './navbar.module.css'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'

function NavBar(){
    const nav = useNavigate()
    const handleClickLogo = () => {
        nav('')
    }

    return (
        <div className = {styles.navBarContainer}>
            <h1 
                onClick = {() => handleClickLogo()}
                className = {styles.navBarLogo}>
                    Logo
            </h1>
        </div>
    )
}

export default memo(NavBar)