import styles from './selectBox.module.css';
import {memo, useState} from 'react';

import dropdownIcon from '../../../assets/admin/dropdown.png'
import addIcon from '../../../assets/general/icon/add.png'
import closeIcon from '../../../assets/general/icon/closeCircle.png'
import { useEffect } from 'react';

function SelectBox({title, data=null, only=false, addMore=true, onChange, handleLoad=null, initData=null}) {
    const [dataList, setdataList] = useState(data)
    const [optionList, setOptionList] = useState([])
    const [selectedOption, setSelectedOption] = useState('')
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
        if(selectedOption !== '')
            onChange(selectedOption)
    }, [selectedOption])

    useEffect(() => {
        if(optionList.length !== 0)
            if(typeof optionList === 'object'){
                if(optionList?.value){
                    const temp = optionList.map(o => o.value)
                    onChange(temp)
                }
                else{
                    onChange(optionList)
                }
            }
            else{
                onChange(optionList)
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
                                value={selectedOption} 
                                className={styles.optionTitle} 
                                placeholder={'Enter or select ' + title}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            />
                        ):
                        (optionList.length === 0 ?
                            <span className={styles.optionTitle}>Select {title}</span>:
                            optionList.map((e, i) => (
                                <div key={i} className={styles.tagBox}>
                                    {typeof e === 'object' ? Object.values(e)[0]:e}
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
                                            handleSetOptionList(d?.value ? d?.value:(d?.name ? d?.name:d))
                                        }
                                        else {
                                            setSelectedOption(d?.name ? d?.name:d)
                                        }
                                    }}
                                >
                                    {d?.name ? d?.name:d}
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