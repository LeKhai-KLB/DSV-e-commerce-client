import styles from './SelectBox.module.css';
import {memo, useState} from 'react';

import dropdownIcon from '../../../assets/admin/dropdown.png'
import addIcon from '../../../assets/general/icon/add.png'
import closeIcon from '../../../assets/general/icon/closeCircle.png'
import { useEffect } from 'react';

function SelectBox({title, data=null, only=false, addMore=true, onChange, handleLoad=null, initData=null}) {
    const [dataList, setdataList] = useState(data)
    const [optionList, setOptionList] = useState([])
    const [selectedOption, setSelectedOption] = useState({})
    const [showBox, setShowBox] = useState(false)

    useEffect(() => {
        if(initData) {
            if(only) {
                setSelectedOption(initData)
            }
            else {
                setOptionList(initData)
            }
        }
    }, [initData])

    const handleShowOptionsBox = async (e) => {
        if(e.target.id !== 'noDropdown'){
            if(!showBox) {
                if(handleLoad) {
                    try {
                        const newData = await handleLoad()
                        setdataList(newData)
                    }
                    catch(err) {
                        setdataList(null)
                    }
                }
                setShowBox(true)
            }
            else {
                if(handleLoad) {
                    setdataList(null)
                }
                setShowBox(false)
            }
        }
    }

    const handleDeleteTag = (i) => {
        const newList = [...optionList]
        newList.splice(i, 1)
        setOptionList(newList)
    }

    const handleSetOptionList = (d) => {
        if(optionList.findIndex(o => o === d) === -1)
            setOptionList([...optionList, d])
    }

    useEffect(() => {
        if(selectedOption !== {}) {
            onChange(selectedOption?._id !== 'new' ? selectedOption._id:selectedOption.name)
        }
        else {
            onChange('')
        }
    }, [selectedOption])

    useEffect(() => {
        if(optionList.length !== 0){
            const temp = optionList.map(o => o._id)
            onChange(temp)
        }
        else {
            onChange([])
        }
    }, [optionList])

    return (
        <div className={styles.field}>
            <span className={styles.label}>
                {title}
            </span>
            <div className={styles.dropdownBar}  onClick={(e) => handleShowOptionsBox(e)}>
                <img 
                    className={styles.largeIcon + ' ' + styles.absoluteEffectIcon} 
                    src={dropdownIcon} 
                    alt= ' ' 
                />
                <div className={styles.tagsContainer}>
                    {
                        only ?
                        (
                            <input 
                                id="noDropdown"
                                value={selectedOption?.name ? selectedOption.name:''}
                                className={styles.optionTitle} 
                                placeholder={'Enter or select ' + title}
                                onChange={(e) => {
                                    if(e.target.value !== ''){
                                        setSelectedOption({
                                            _id: 'new',
                                            name: e.target.value
                                        })
                                    }
                                    else {
                                        console.log('ooo')
                                        setSelectedOption({})
                                    }
                                }}
                            />
                        ):
                        (optionList.length === 0 ?
                            <span className={styles.optionTitle}>Select {title}</span>:
                            optionList.map((e, i) => (
                                <div key={i} className={styles.tagBox}>
                                    {e.name}
                                    <img 
                                        id="noDropdown"
                                        className={styles.smallIcon} 
                                        src={closeIcon}
                                        onClick={() => handleDeleteTag(i)}
                                    />
                                </div>
                        )))
                    }
                </div>
            </div>

            {
                showBox && dataList &&
                <div className={styles.optionsContainer}>
                    <div className={styles.optionsContent}>
                        {
                            dataList.map((d, i) => (
                                <span 
                                    key={i} 
                                    className={styles.option}
                                    onClick={() => {
                                        if(!only) {
                                            handleSetOptionList(d)
                                        }
                                        else {
                                            setSelectedOption(d)
                                        }
                                    }}
                                >
                                    {d?.name}
                                </span>  
                            ))
                        }
                    </div>
                    {addMore && 
                        <div className={styles.addNewOption}>
                            <img src={addIcon} className={styles.largeIcon} alt=" " />
                            <p className={styles.note} style={{margin: '0px 0px 0px 12px'}}>Add icon</p>
                        </div>
                    }
                </div>
            }
        </div>
        
    )
}

export default memo(SelectBox)