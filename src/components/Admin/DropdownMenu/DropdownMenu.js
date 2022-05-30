import styles from './DropDownMenu.module.css'
import { memo, useState } from 'react'

// image assets
import dropdownIcon from '../../../assets/admin/dropdown.png'

function DropdownMenu({list, onChange}) {  
    const [showMenu, setShowMenu] = useState(false)
    const [menuValue, setMenuValue] = useState(list[0].title)

    const handleClickMenu = (target) => {
        if(target.id !== "item") {
            setShowMenu(!showMenu)
        }
    }

    const handleClickItem = (l) => {
        setShowMenu(!showMenu)  
        setMenuValue(l.title)
        const {title, ...sortValue} = l 
        onChange(sortValue)
    }

    return (
        <div className={styles.dropBox} onClick={(e) => handleClickMenu(e.target)} >
            <span className={styles.memuValue}>
                {menuValue}
            </span>
            <img className={styles.arrowIcon} src={dropdownIcon} alt="dropdown" />
            {
                showMenu && 
                <div className={styles.listContainer}>
                    {list && list.map((l, index) => (
                        <div id="item" key={index} className={styles.item} onClick={() => handleClickItem(l)} >
                            {l.title}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default memo(DropdownMenu)