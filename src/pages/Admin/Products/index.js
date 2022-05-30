import { memo, useEffect, useState } from 'react'
import styles from './adminProducts.module.css'
import DropdownMenu from '../../../components/Admin/DropdownMenu'
import SearchBar from '../../../components/Admin/SearchBar'
import PaginationBar from '../../../components/Admin/PaginationBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { adminSelector } from '../../../redux/selector'
import { 
getProductsByFilterAndSortValue,
deleteProductAPI
} from '../../../APIs'

// image assets 
import addIcon from '../../../assets/admin/plus-white.png'
import exportIcon from '../../../assets/admin/export-orange.png'
import dropdownIcon from '../../../assets/admin/dropdown.png'
import removeIcon from '../../../assets/admin/remove.png'
import editIcon from '../../../assets/admin/edit.png'
import placeholder from '../../../assets/general/placeholder/placeholder.png'

function AdminProducts() {
    const [sortValue, setSortValue] = useState({key: '_id', option:'desc'})
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [currentMaxShow, setCurrentMaxShow] = useState(9)
    const [showActionsBox, setShowActionsBox] = useState(0)
    const [productListSlice, setProductListSlice] = useState(null)
    const [recordCount, setRecordCount] = useState(0)
    const admin = useSelector(adminSelector)
    const nav = useNavigate()

    const handleFirstLoad = async () => {
        try {
            const queryString = `?searchValue=${searchValue}&sortValue=${JSON.stringify(sortValue)}&slice=0-${currentMaxShow}`
            const {data} = await axios.get(getProductsByFilterAndSortValue + queryString)
            if(data.status === 200) {
                setProductListSlice(data.resultData.products)
                setRecordCount(data.resultData.remainingLength)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err) {
            console.log(err.message)
        }
    }

    const reLoadProductList = async () => {
        const last = currentPage * currentMaxShow
        const first = last-currentMaxShow <= 0 ? 0:last-currentMaxShow
        const queryString = `?searchValue=${searchValue}&sortValue=${JSON.stringify(sortValue)}&slice=${first}-${last}`
        try {
            const {data} = await axios.get(getProductsByFilterAndSortValue + queryString)
            if(data.status === 200) {
                setProductListSlice(data.resultData.products)
                setRecordCount(data.resultData.remainingLength)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch (err) {
            setProductListSlice(null)
            setRecordCount(0)
            console.log(err.message)
        }
    }

    const handleDelete = async (id) => {
        setShowActionsBox(0)
        try {
            const {data} = await axios.post(deleteProductAPI, {id: id}, {
                headers: {
                    authorization: admin.jwt
                }
            })
            if(data.status === 200) {
                if(recordCount === 1) {
                    setProductListSlice([])
                    setRecordCount(0)
                }
                else {
                    reLoadProductList()
                }
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        reLoadProductList()
    }, [sortValue, searchValue, currentMaxShow, currentPage])

    useEffect(() => {
        handleFirstLoad()
    }, [])

    return (
        <div className={styles.adminProductsContainer} >

            {/* Control container */}
            <div className={styles.controlContainer}>

                {/* left container */}
                <div className={styles.leftContainer}>
                    <span className={styles.labelStyle} >sort by</span>
                    <div className={styles.mtl20}>
                        <DropdownMenu list={[
                            {title: 'Date added', key: '_id', option:'desc'}, 
                            {title:'A - Z', key: 'name', option:'asc'}, 
                            {title:'Z - A', key: 'name', option:'desc'},
                        ]} onChange={setSortValue}/>
                    </div>
                </div>

                {/* right container */}
                <div className={styles.rightContainer}>
                    {/* search bar */}
                    <SearchBar onChangeValue={setSearchValue}/>
                    {/* add button */}
                    <div className={styles.addProductButton} onClick={() => nav('./add_product')}>
                        <img className={styles.icon} src={addIcon} alt="add product" />
                        Add product
                    </div>
                    {/* export button */}
                    <div className={styles.exportButton}>
                        <img className={styles.icon} src={exportIcon} alt="export product list" />
                        Export
                    </div>
                </div>
            </div>

            {/* entries container */}
            <div className={styles.entriesContainer} >
                <div className={styles.tableLine}/>
                <table className={styles.table}>
                    
                    <thead >
                        <tr className={styles.tableTitleContainer + ' '+ styles.labelStyle}>
                            <th >products</th>
                            <th >sold</th>
                            <th >date added</th>
                            <th >profit ($)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            productListSlice &&
                            productListSlice.map((e, i) => {
                                return (
                                    <tr key={i} className={`${styles.tableEntry} ${i%2!==0 ? styles.grayBackground:''}`} >
            
                                        <td style={{width: '352px'}}>
                                            <div className={styles.displayFlexEffect}>
                                                <img src={e?.images.length !== 0 ? e?.images[0]:placeholder} alt="product" className={styles.productImageEntry} />
                                                <div className={styles.textEntry}>
                                                    <span className={styles.textEntryTite} title={e?.name}>{e?.name}</span>
                                                    <span className={styles.textEntryCategory}>{e?.categories?.map(c => c.name).join(', ')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{width: '200px'}} >
                                            {Object.values(e.quantity).reduce((a, b) => a + b) - Object.values(e.inStock).reduce((a, b) => a + b)}/ 
                                            {Object.values(e.quantity).reduce((a, b) => a + b)}
                                        </td>
                                        <td style={{width: '260px'}}>{
                                            (new Date(e?.createdAt)).toDateString().split(' ').slice(0, 4).join(', ')
                                        }</td>
                                        <td style={{width: '200px'}}>{e?.price}.00</td>
            
                                        <td style={{paddingRight: '24px'}}>
                                            <div 
                                                className={styles.actionsContainer}
                                                onClick={() => {
                                                    if(i + 1 === showActionsBox){
                                                        setShowActionsBox(0)
                                                    }
                                                    else{
                                                        setShowActionsBox(i + 1)
                                                    }
                                                }}
                                                >
                                                Actions
                                                <img className={styles.dropdownIcon} src={dropdownIcon} alt="drop down" />
                                                
                                            </div>
                                        </td>
                                        {
                                            showActionsBox === i + 1 &&   
                                            <td className={styles.actionsBox}>
                                                <div 
                                                    className={styles.actionsButton} 
                                                    onClick={() => nav('./edit_product/' + e._id, {state: e})}
                                                >
                                                    <img src={editIcon} className={styles.actionsIcon} alt="edit" />
                                                    Edit
                                                </div>
                                                <div id="deleteBtn" className={styles.actionsButton} onClick={() => handleDelete(e._id)}>  
                                                    <img src={removeIcon} className={styles.actionsIcon} alt="remove" />
                                                    Delete  
                                                </div>
                                            </td>
                                        }
            
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/* pagination */}
                <PaginationBar entriesQty={recordCount} maxShowEntries={9} onChangePage={setCurrentPage} onchangeMaxShow={setCurrentMaxShow}/>
            </div>
        </div>
    )
}

export default memo(AdminProducts)