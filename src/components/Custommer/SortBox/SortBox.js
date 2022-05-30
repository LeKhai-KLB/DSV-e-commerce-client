import {memo, useState} from 'react'
import styles from './SortBox.module.css'

import dropdownIcon from '../../../assets/general/icon/arrow.png'

function SortBox({value, onChange, list}) {  
    const [showMenu, setShowMenu] = useState(false)
    const [menuValue, setMenuValue] = useState(value ? JSON.parse(value).title : JSON.parse(list[0]).title)

    const handleClickMenu = (target) => {
        if(target.id !== 'item')
            setShowMenu(!showMenu)
    }

    const handleClickItem = (l) => {
        setShowMenu(!showMenu)
        setMenuValue(JSON.parse(l).title)
        onChange(l)
    }
    
    return (
        <div className={styles.dropBox} onClick={(e) => handleClickMenu(e.target)} >
            <span className={`${styles.memuValue}`}>
                {menuValue}
            </span>
            <img className={styles.arrowIcon} src={dropdownIcon} alt="dropdown" />
            {
                showMenu && 
                <div className={styles.listContainer}>
                    {list && list.map((l, index) => {
                        const parseValue = JSON.parse(l)
                        return (
                            <div id="item" key={index} className={styles.item} onClick={() => handleClickItem(l)} >
                                {parseValue.title}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default memo(SortBox)