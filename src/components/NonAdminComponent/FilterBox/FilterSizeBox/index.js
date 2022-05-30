import { memo, useState, useEffect } from "react";
import styles from './filterSizeBox.module.css'

function FilterSizeBox({onChange, value, style=null, required=false}) {

    const handleClickSizeBox = (val) => {
        if(val === value) {
            if(!required)
                onChange('size', '')
        }
        else {
            onChange('size', val)
        }
    }

    return (
        <div className={styles.filterSizeBoxContainer} style={style ? style:{}}>
            {
                ['s', 'm', 'l'].map((s, i) => (
                    <div 
                        key={i} 
                        className={`${styles.sizeBox} ${value === s ? styles.highlight:''}`} 
                        onClick={() => handleClickSizeBox(s)}
                    >
                        {s}
                    </div>
                ))
            }
        </div>
    )
}

export default memo(FilterSizeBox)