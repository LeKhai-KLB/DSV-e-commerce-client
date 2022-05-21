import {memo} from 'react'
import styles from './sortBox.module.css'

import dropdownIcon from '../../../assets/general/icon/arrow.png'

function SortBox({value, onChange, list}) {  
    const handleClickMenu = () => {
        document.querySelector('.' + styles.listContainer)?.classList?.toggle(styles.hidden)
    }

    const handleClickItem = (l) => {
        document.querySelector('.' + styles.memuValue).innerText = l
        onChange(l)
    }

    return (
        <div className={styles.dropBox} onClick={() => handleClickMenu()} >
            <span className={styles.memuValue}>
                {value}
            </span>
            <img className={styles.arrowIcon} src={dropdownIcon} alt="dropdown" />
            <div className={styles.listContainer + ' ' + styles.hidden}>
                {list && list.map((l, index) => (
                    <div key={index} className={styles.item} onClick={() => handleClickItem(l)} >
                        {l}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(SortBox)