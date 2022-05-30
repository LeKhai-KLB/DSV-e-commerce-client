import styles from './dropDownMenu.module.css'
import { memo } from 'react'

// image assets
import dropdownIcon from '../../../assets/admin/dropdown.png'

function DropdownMenu({list, onChange}) {  
    const handleClickMenu = () => {
        document.querySelector('.' + styles.listContainer)?.classList?.toggle(styles.hidden)
    }

    const handleClickItem = (l) => {
        document.querySelector('.' + styles.memuValue).innerText = l.title
        const {title, ...sortValue} = l 
        onChange(sortValue)
    }

    return (
        <div className={styles.dropBox} onClick={() => handleClickMenu()} >
            <span className={styles.memuValue}>
                {list[0].title}
            </span>
            <img className={styles.arrowIcon} src={dropdownIcon} alt="dropdown" />
            <div className={styles.listContainer + ' ' + styles.hidden}>
                {list && list.map((l, index) => (
                    <div key={index} className={styles.item} onClick={() => handleClickItem(l)} >
                        {l.title}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(DropdownMenu)