import {memo, useState, useEffect} from 'react'
import styles from './FilterDropdownBar.module.css'

// image assets
import dropdownIcon from '../../../../assets/general/icon/arrow.png'

function FilterDropdownBar({title, children, dependency=null}) {
    
    const [showChildren, setShowChildren] = useState(false)

    useEffect(() => {
        if(dependency) {
            setShowChildren(false)
        }
    }, dependency)

    return (
        <div className={styles.filterDropdownBarContainer}>
            <div 
                className={`${styles.dropdownBar} ${showChildren ? styles.dashBorder:''}`} 
                onClick={() => setShowChildren(!showChildren)}
            >
                <span>{title}</span>
                <img 
                    className={`${styles.dropdownIcon} ${showChildren ? styles.rotate180Deg:''}`} 
                    src={dropdownIcon} 
                    alt=' ' 
                />
            </div>
            {showChildren && children}
        </div>
    )
}

export default memo(FilterDropdownBar)