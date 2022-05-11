import { Outlet } from "react-router-dom";
import { memo } from 'react'

import NavBar from "../../components/NonAdminComponent/NavBar";
import Footer from "../../components/NonAdminComponent/Footer";
import styles from './nonAdminRoute.module.css'

function NonAdminRoute() {
    return (
        <div>
            <NavBar />
            <div className={styles.contentContainer}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default memo(NonAdminRoute)