import { memo, useState, useEffect } from 'react'
import styles from './FilterByWordBox.module.css'

// image assets
import blankIcon from '../../../../assets/general/icon/blank-box.png'
import checkBoxIcon from '../../../../assets/general/icon/check-box.png'

function FilterByWordBox({onChange, initData=null, title=null, value=null}) {
    const [list, setList] = useState(value ? value:[])

    const checked = (val) => {
        return list.findIndex(l => l === val)
    }

    const handleChangeCheckedBox = (val) => {
        const checkValue = checked(val)
        if(checkValue === -1){
            setList([...list, val])
        }
        else {
            const temp = list
            temp.splice(checkValue, 1)
            setList([...temp])
        }
    }

    useEffect(() => {
        if(list.length === initData.length || list.length === 0) 
            onChange(title, '')
        else {
            const temp = list.join('-')
            onChange(title, temp)
        }
    }, [list])

    return (
        initData &&
        <div className={styles.filterByWordBoxContainer} >
            {
                initData.map((l, i) => (
                    <div 
                        key={i} 
                        className={`${styles.filterBox}`}
                        onClick={() => handleChangeCheckedBox(l?._id ? l._id:l, i)}
                    >
                        <span style={{marginLeft: '10px'}}>{l?.name ? l.name:l}</span>
                        <img src={list.findIndex(v => v === (l?._id ? l._id:l)) !== -1 ? checkBoxIcon:blankIcon} className={styles.icon} al=' ' />
                    </div>
                ))
            }
        </div>
    )
}

export default memo(FilterByWordBox)