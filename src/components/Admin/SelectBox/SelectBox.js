import styles from './SelectBox.module.css';
import {memo, useState} from 'react';

import dropdownIcon from '../../../assets/admin/dropdown.png'
import addIcon from '../../../assets/shared/icon/add.png'
import closeIcon from '../../../assets/shared/icon/closeCircle.png'
import { useEffect } from 'react';

function SelectBox({
    reload=false, 
    title, 
    boxStyle=null, 
    data=null, 
    only=false, 
    addMore=true, 
    onChange, 
    handleLoad=null, 
    initData=null, 
    required=false, 
    style=null, 
    containerStyle=null,
    handleAdd=null,
    newValue=null,
    setNewValue=null
}) {
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

    useEffect(() => {
        if(newValue) {
            setdataList(prev => {return [...prev, newValue]})
            setOptionList(prev => {return [...prev, newValue]})
            setNewValue(null)
        }
    }, [newValue])

    const handleShowOptionsBox = async (e) => {
        if(e.target.id !== 'noDropdown'){
            if(!showBox) {
                if(reload) {
                    if(handleLoad) {
                        try {
                            const newData = await handleLoad()
                            setdataList(newData)
                        }
                        catch(err) {
                            setdataList(null)
                        }
                    }
                }
                else {
                    if(!dataList) {
                        if(handleLoad) {
                            try {
                                const newData = await handleLoad()
                                setdataList(newData)
                            }
                            catch(err) {
                                setdataList(null)
                            }
                        }
                    }
                }
                setShowBox(true)
            }
            else {
                setShowBox(false)
            }
        }
    }

    const handleReload = async () => {
        try {
            const newData = await handleLoad()
            setdataList(newData)
        }
        catch(err) {
            setdataList(null)
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
        if(only)
            if(Object.keys(selectedOption).length !== 0) {
                onChange(selectedOption?._id !== 'new' ? selectedOption._id:selectedOption.name)
            }
            else {
                onChange('')
            }
    }, [selectedOption])

    useEffect(() => {
        if(!only)
            if(optionList.length !== 0){
                const temp = optionList.map(o => o._id)
                onChange(temp)
            }
            else {
                onChange([])
            }
    }, [optionList])

    return (
        <div className={styles.field} style={containerStyle ? containerStyle:{}}>
            {
                title && 
                <span className={styles.label}>
                    {title}
                </span>
            }
            {
                title ? (required ? 
                <span style={{color: 'red', fontSize: '14px', margin: '0px 20px 0px 5px'}}> * </span> :
                <span style={{margin: '0px 20px 0px 14.5px'}} />):<></>
            }
            <div className={styles.dropdownBar} onClick={(e) => handleShowOptionsBox(e)} style={style ? style:{}}>
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
                                style={style ? style:{}}
                                id="noDropdown"
                                value={selectedOption?.name ? selectedOption.name:''}
                                className={styles.optionTitle} 
                                placeholder={'Enter or select '}
                                onChange={(e) => {
                                    if(e.target.value !== ''){
                                        setSelectedOption({
                                            _id: 'new',
                                            name: e.target.value
                                        })
                                    }
                                    else {
                                        setSelectedOption({})
                                    }
                                }}
                                autoComplete="false"
                            />
                        ):
                        (optionList.length === 0 ?
                            <span className={styles.optionTitle} style={boxStyle ? boxStyle:{}}>Select</span>:
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
                <div className={styles.optionsContainer} style={boxStyle ? boxStyle : {}}>
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
                        <div className={styles.addNewOption} onClick={handleAdd ? () => {
                            handleAdd(true)
                            setShowBox(false)
                        }: null} >
                            <img src={addIcon} className={styles.largeIcon} alt=" " />
                            <p className={styles.note} style={{margin: '0px 0px 0px 12px'}}>Add</p>
                        </div>
                    }
                </div>
            }
        </div>
        
    )
}

export default memo(SelectBox)