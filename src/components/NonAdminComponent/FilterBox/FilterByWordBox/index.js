import { memo, useState, useEffect } from 'react'
import styles from './filterByWordBox.module.css'

// image assets
import blankIcon from '../../../../assets/general/icon/blank-box.png'
import checkBoxIcon from '../../../../assets/general/icon/check-box.png'

function FilterByWordBox({onChange, handleLoad=null, initData=null, value}) {
    const [list, setList] = useState([])
    const [checkedValue, setCheckedValue] = useState()

    const handleFirstMount = async () => {
        if(handleLoad) {
            try {
                const newList = await handleLoad()
                setList([...newList])
            }
            catch(err){
                console.error(err.message)
            }
        }
        else {
            if(initData) {
                setList([...initData])
            }
        }
    } 

    const handleChangeCheckedValue = (v) => {
        if(v !== checkedValue){
            setCheckedValue(v)
            onChange(v)
        }
    }

    useEffect(() => {
        handleFirstMount()
        if(value) {
            setCheckedValue(value)
        }
    }, [])

    return (
        <div className={styles.filterByWordBoxContainer} >
            <div 
                className={`${styles.filterBox} ${checkedValue === 'All' ? styles.highlight:''}`}
                onClick={() => handleChangeCheckedValue('All')}
            >
                <span style={{marginLeft: '10px'}}>All</span>
                <img src={checkedValue === 'All' ? checkBoxIcon:blankIcon} className={styles.icon} al=' ' />
            </div>
            {
                list.map((l, i) => (
                    <div 
                        key={i} 
                        className={`${styles.filterBox} ${checkedValue === l ? styles.highlight:''}`}
                        onClick={() => handleChangeCheckedValue(l)}
                    >
                        <span style={{marginLeft: '10px'}}>{l}</span>
                        <img src={checkedValue === l ? checkBoxIcon:blankIcon} className={styles.icon} al=' ' />
                    </div>
                ))
            }
        </div>
    )
}

export default memo(FilterByWordBox)