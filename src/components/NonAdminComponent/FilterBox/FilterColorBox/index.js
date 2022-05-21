import { memo, useState, useEffect } from "react";
import styles from './filterColorBox.module.css'
import { getAllColorsAPI } from '../../../../APIs'
import axios from 'axios'

function FilterColorBox({onChange, value}) {
    
    const [colorPallete, setColorPallete] = useState([])
    const [color, setColor] = useState({title: 'black', value: '#000'})
    
    const handleLoadColor = async () => {
        try {
            const { data } = await axios.get(getAllColorsAPI)
            if(data.status === 200) {
                const newColorData = data.resultData.map(c => {return{title: c.title, value: c.value}})
                setColorPallete(newColorData)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err) {
            console.log(err.message)
        }
    }

    const handleSetColor = (c) => {
        if(c.title !== color.title) {
            setColor(c)
            onChange(c)
        }
    }

    useEffect(() => {
        handleLoadColor()
        if(value) {
            setColor(value)
        }
    }, [])

    return (
        <div className={styles.filterColorBoxContainer}>
            {
                colorPallete.map((c, i) => (
                    <div 
                        key={i}
                        className={`${styles.colorBox} ${Object.entries(color).toString() === Object.entries(c).toString() ? styles.highlight:''}`}
                        style={{backgroundColor: c.value}} 
                        onClick={() => handleSetColor(c)}
                    />
                ))
            }
        </div>
    )
}

export default memo(FilterColorBox)