import {memo, useState, useEffect} from 'react';
import styles from './filterPriceBox.module.css'
import Slider from '@mui/material/Slider'

function FilterPriceBox({onChange, value}) {
    const [range, setRange] = useState(value)

    const handleChangeCommittedRange = (e, newValue) => {
        onChange(newValue)
    }

    const handleChangeRange = (e, newValue) => {
        setRange(newValue)
    }

    return (
        <div className={styles.filterPriceBoxContainer}>

            <Slider 
                min={0}
                max={100}
                value={range}
                sx={{
                    color: "var(--pale-orange)"
                }}
                onChangeCommitted={handleChangeCommittedRange}
                onChange={handleChangeRange}
            />

            <div className={styles.priceTitleContainer} >
                <span className={styles.priceTitle} id="min">
                    {range[0]} $
                </span>
                <span className={styles.priceTitle} id="max">
                    {range[1]} $
                </span>
            </div>
        </div>
    )
}

export default memo(FilterPriceBox)