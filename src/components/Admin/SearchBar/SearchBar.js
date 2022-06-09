import { memo, useState } from 'react'
import styles from './SearchBar.module.css'

// image assets
import searchIcon from '../../../assets/shared/icon/search.png'

function SearchBar({onChangeValue}) {
    const [searchValue, setSearchValue] = useState('')

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.searchButton}>
                <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
            </div>
            <input 
                value={searchValue} 
                className={styles.searchInput} 
                placeholder="Search..."
                onChange={e => {
                    onChangeValue(e.target.value)
                    setSearchValue(e.target.value)
                }}
            />
        </div>
    )
}

export default memo(SearchBar)