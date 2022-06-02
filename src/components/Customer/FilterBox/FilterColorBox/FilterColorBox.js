import { memo, useState, useEffect } from "react";
import styles from './FilterColorBox.module.css'

function FilterColorBox({onChange, value, initData=null, style=null, required=false, multiChoice=false}) {

    const [list, setList] = useState(value ? value:[])

    const handleSetColor = (id) => {
        if(id === value) {
            if(!required) {
                onChange('color', '')
            }
        }
        else {
            onChange('color', id)
        }
    }

    const checkValue = (id) => {
        return list.findIndex(l => l === id)
    }

    const handleSetColorList = (id) => {
        const index = checkValue(id)
        if(index !== -1) {
            const temp = list
            temp.splice(index, 1)
            setList([...temp])
        }   
        else {
            setList([...list, id])
        }
    }

    useEffect(() => {
        if(list.length === initData.length) {
            onChange('colors', '')
        }
        else {
            const queryString = list.join('-')
            onChange('colors', queryString)
        }
    }, [list])

    return (
        initData &&
        <div className={styles.filterColorBoxContainer} style={style !== null ? style:{margin: '0px'}}>
            {
                initData.map((c, i) => (
                    <div 
                        title={c.title}
                        key={i}
                        className={`${styles.colorBox}`}
                        style={{backgroundColor: c.value}} 
                        onClick={() => {
                            if(multiChoice){
                                handleSetColorList(c._id)
                            }
                            else {
                                handleSetColor(c._id)
                            }
                        }}
                    >
                        {
                            (c._id === value || list.findIndex(l => l === c._id) !== -1)
                            &&
                            <div className={styles.checked} />
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default memo(FilterColorBox)