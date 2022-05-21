import { memo, useState, useEffect } from "react";
import styles from './filterSizeBox.module.css'

function FilterSizeBox({onChange, value}) {
    
    const [size, setSize] = useState('s')

    const handleChangeSize = (s) => {
        if(s !== size) {
            setSize(s)
            onChange(s)
        }
    }

    useEffect(() => {
        if(value) {
            setSize(value)
        }
    }, [])

    return (
        <div className={styles.filterSizeBoxContainer}>
            {
                ['s', 'm', 'l'].map((s, i) => (
                    <div 
                        key={i} 
                        className={`${styles.sizeBox} ${size === s ? styles.highlight:''}`} 
                        onClick={() => handleChangeSize(s)}
                    >
                        {s}
                    </div>
                ))
            }
        </div>
    )
}

export default memo(FilterSizeBox)