import { memo, useState } from 'react'
import styles from './AddCategoryModal.module.css'
import SelectBox from '../SelectBox'
import axios from 'axios'
import { toast } from 'react-toastify'

import crossIcon from '../../../assets/shared/icon/cross.png'

function AddCategoryModal({handleShowBox, admin, setValue}) {
    const [forValue, setForValue] = useState('')
    const [typeValue, setTypeValue] = useState('')
    const [specificType, setSpecificType] = useState('')
    const [showError, setShowError] = useState(false)

    const handleLoadCategories = async () => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_CATEGORY_BY_TREE_LENGTH_API + '?length=' + 1)
            if(data.status === 200) {
                const newCategories = data.resultData.map(c => {return{
                    _id: c._id,
                    name: c.name
                }})
                return newCategories
            }
            else {
                throw new Error('')
            }
        }
        catch(err) {
            return null
        }
    }

    const handleLoadSubCategories = async (parent) => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_CATEGORY_PASS_BY_PARENT_VALUE_API + '?parent=' + parent)
            if(data.status === 200) {
                const newCategories = data.resultData.map(c => {return{
                    _id: c._id,
                    name: c.name
                }})
                return newCategories
            }
            else {
                throw new Error('')
            }
        }
        catch(err) {
            return null
        }
    }

    const handleAddCategory = async () => {
        if(forValue === '' || typeValue === '' || specificType === '')
            setShowError(true)
        else {
            const loadingId = toast.loading('Loading')
            try {
                const { data } = await axios.post('http://localhost:5000/api/general/addCategory', {
                    list: [forValue, typeValue, specificType].join('_')
                }, {
                    headers: {
                        authorization: admin.jwt
                    }
                })
                if(data.status === 200) {
                    toast.dismiss(loadingId)
                    toast.success('Successfully added')
                    setValue(data.resultData)
                    handleShowBox(false)
                }
                else {
                    throw new Error(data.errorMessage)
                }
            }
            catch(err) {
                toast.dismiss(loadingId)
                toast.error(err)
                console.log(err)
            }
        }
    }

    return (
        <div className={styles.AddCategoryModalContainer} >
            <div className={styles.overlay} onClick={() => handleShowBox(false)}/>

            <div className={styles.form} >

                <img className={styles.cancelIcon} src={crossIcon} alt=" " onClick={() => handleShowBox(false)}/>
                
                {/* title */}
                <span className={styles.title} >Add category</span>

                <span className={`${styles.validateMessage} ${showError ? styles.showValidate:''}`}>
                    Don't leave any blank fields
                </span>

                <div className={styles.wrapper} >

                    {/* forvalue */}
                    <div style={{float: 'left'}}>
                        <span className={styles.label}>
                            For
                        </span>
                        <SelectBox 
                            only={true} 
                            addMore={false} 
                            onChange={setForValue} 
                            handleLoad={() => handleLoadCategories()}
                            style={{backgroundColor: 'var(--white-two'}}
                            containerStyle={{margin: '5px 0px 24px 0px', width: '300px'}}
                            boxStyle={{width: '270px'}}
                        />
                    </div>

                    {/* forvalue */}
                    <div style={{float: 'left'}}>
                        <span className={styles.label}>
                            Type
                        </span>
                        <SelectBox 
                            only={true} 
                            addMore={false} 
                            onChange={setTypeValue} 
                            handleLoad={() => handleLoadSubCategories(forValue)}
                            style={{backgroundColor: 'var(--white-two'}}
                            containerStyle={{margin: '5px 0px 24px 0px', width: '300px'}}
                            boxStyle={{width: '270px'}}
                            reload={true}
                        />
                    </div>

                    {/* specific type */}
                    <div style={{float: 'left'}}>
                        <span className={styles.label}>
                                Specific type
                            </span>
                        <div className={styles.field}>
                            <input 
                                value={specificType}
                                className={styles.input} 
                                placeholder="Enter specific type"
                                onChange={(e) => setSpecificType(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* button */}
                    <button type="submit" className={styles.submitButton + ' ' + styles.activeClick} onClick={() => handleAddCategory()} >
                        Add
                    </button>
                </div>

            </div>

        </div>
    )
}

export default memo(AddCategoryModal)