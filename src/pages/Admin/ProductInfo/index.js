import { memo, useState, useRef, useEffect } from "react";
import styles from './adminProductInfo.module.css'
import SelectBox from '../../../components/Admin/SelectBox'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom'
import { getImageURL } from '../../../services/uploadImageService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'
import { adminSelector } from '../../../redux/selector'

// image assets
import closeIcon from '../../../assets/shared/icon/close.png'
import addIcon from '../../../assets/shared/icon/add.png'

function AdminProductInfo() {
    const [photos, setPhotos] = useState([null, null, null, null])
    const [photoFiles, setPhotoFiles] = useState([null, null, null, null])
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState(0)
    const [colorList, setColorList] = useState([])
    const [sizeList, setSizeList] = useState([])
    const [quantity, setQuantity] = useState({s: 0, m: 0, l: 0})
    const [description, setDescription] = useState('')
    const currentId = useParams().id
    const [initData, setInitData] = useState({})
    const [showValidate, setShowValidate] = useState(false)
    const admin = useSelector(adminSelector)
    
    const nav = useNavigate()

    const input = useRef()

    const handleClickAddImage = (i) => {
        input.current.index = i
        input.current.click()
    }

    const handleChangeImageInput = (e) => {
        if(e.target.files[0]){
            const previewImage = URL.createObjectURL(e.target.files[0]) 
            setPhotos(prev => {
                const temp = [...prev]
                temp[input.current.index] = previewImage
                return temp
            })
            setPhotoFiles(prev => {
                const temp = [...prev]
                temp[input.current.index] = e.target.files[0]
                return temp
            })
        }
    }

    const handleCrashImage = (i) => {
        input.current.value = ''
        setPhotoFiles(prev => {
            const temp = [...prev]
            temp[i] = null
            return temp
        })
        setPhotos(prev => {
            const temp = [...prev]
            temp[i] = null
            return temp
        })
    }

    const handleLoadCategories = async () => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_CATEGORY_BY_TREE_LENGTH_API + '?length=3')
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

    const handleLoadColors = async () => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_ALL_COLORS_API)
            if(data.status === 200) {
                const newColors = data.resultData.map(c => {return {
                    _id: c._id,
                    name: c.title
                }})
                return newColors
            }
            else {
                throw new Error('')
            }
        }
        catch(err) {
            return null
        }
    }


    const handleLoadBrands = async () => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_ALL_BRANDS_API)
            if(data.status === 200) {
                const newBrands = data.resultData.map(c => {return {
                    _id: c._id,
                    name: c.name
                }})
                return newBrands
            }
            else {
                throw new Error('')
            }
        }
        catch(err) {
            return null
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(name === '' || categories.length === 0 || price === 0 || colorList.length === 0) {
            setShowValidate(true)
        }
        else {
            const loadingId = toast.loading('Loading...')
            setShowValidate(false)
            const newPhotoList = []
            photos.forEach((f, i) => {
                if(f !== null){
                    if(!f.includes(process.env.REACT_APP_DOMAIN_HEADER))
                        newPhotoList.push(photoFiles[i])
                    else
                        newPhotoList.push(f)
                }
            })

            if(newPhotoList.length !== 0) {
                Promise.all(newPhotoList.map(f => getImageURL(f)))
                    .then((values) => {
                        if(Object.keys(initData).length === 0)
                            handleUploadProductInfo(values, loadingId, null, process.env.REACT_APP_ADD_PRODUCT_API, 'add')
                        else 
                            handleUploadProductInfo(values, loadingId, null, process.env.REACT_APP_UPDATE_PRODUCT_API, 'update')
                    })
                    .catch((error) => {
                        if(Object.keys(initData).length === 0)
                            handleUploadProductInfo(null, loadingId, error.message, process.env.REACT_APP_ADD_PRODUCT_API, 'add')
                        else
                            handleUploadProductInfo(null, loadingId, error.message, process.env.REACT_APP_UPDATE_PRODUCT_API, 'update')
                    })
            }
            else {
                if(Object.keys(initData).length === 0)
                    handleUploadProductInfo(null, loadingId, null, process.env.REACT_APP_ADD_PRODUCT_API, 'add')
                else
                    handleUploadProductInfo(null, loadingId, null,process.env.REACT_APP_UPDATE_PRODUCT_API, 'update')
            }
        }
    }

    const handleUploadProductInfo = async (photoList, loadingId, error, api, action) => {
        if(error) {
            toast.error(error)
        }
        const newColorsList = colorList.map(c => {return c?.name ? c?.value:c})
        const uploadData = {
            name: name,
            description: description,
            brand:  brand === '' ? null:brand,
            categories: categories,
            price: price,
            colors: newColorsList,
            quantity: quantity,
            images: photoList ? photoList:[],
            previousQuantity: initData?.quantity ? initData.quantity:null,
            inStock: initData?.inStock ? initData.inStock:quantity
        }
        if(action === 'update') {
            uploadData._id = currentId
            uploadData.previousImages = initData?.images ? initData.images:null
        }
        try{
            const {data} = await axios.post(api, uploadData, {
                headers: {
                    authorization: admin.jwt
                }
            })
            if(data.status === 200) {
                toast.dismiss(loadingId)
                toast.success(`Successfully ${action} product`)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err) {
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    const handleSetupImage = (imageURL, index) => {
        setPhotos(prev => {
            const temp = [...prev]
            temp[index] = imageURL
            return temp
        })
    }

    const handleFirstLoad = async () => {
        try {
            const {data} = await axios.get(process.env.REACT_APP_GET_PRODUCT_BY_ID_API + '?id=' + currentId)
            if(data.status === 200) {
                if(data.resultData?.images?.length !== 0) {
                    data.resultData?.images?.forEach((url, i) => {
                        handleSetupImage(url, i)
                    })
                }
                setName(data.resultData?.name)

                const categoryData = data.resultData.categories.map(c => {
                    return {
                        _id: c._id,
                        name: c.name
                    }
                })

                const colorsData = data.resultData?.colors.map(c => {return {
                    _id: c._id,
                    name: c.title
                }})

                const sizeData = []
                    for(const [key, value] of Object.entries(data.resultData?.quantity)){
                        if(value !== 0)
                        sizeData.push({_id: key, name: key})
                    }
                setInitData(prev => {
                    const temp = {...prev}
                    temp.categories = categoryData
                    temp.brand = {_id: data.resultData?.brand?._id, name: data.resultData?.brand?.name}
                    temp.colors = colorsData
                    temp.sizeList = sizeData
                    temp.quantity = data.resultData.quantity
                    temp.inStock = data.resultData.inStock
                    temp.images = data.resultData.images
                    return temp
                })
                setPrice(data.resultData?.price)
                setQuantity(data.resultData?.quantity)
                setDescription(data.resultData?.description)
                setColorList(colorsData)
            }
        }
        catch(err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if(currentId) {
            handleFirstLoad()
        }
    }, [])

    return (
        <form className={styles.productInfoContainer} onSubmit={(e) => handleSubmit(e)} >
            <ToastContainer />

            {/* image field */}
            <div className={styles.imageField}>

                <span className={styles.label} style={{marginRight: '0px'}}>
                    photos
                </span>

                {/* image container */}
                {
                    [...Array(4)].map((e, i) => (
                        <div key={i} className={styles.imageContainer} >
                            <input id={'input ' + i} ref={input} style={{display: 'none'}} type="file" onChange={e => handleChangeImageInput(e)} />
                            <div 
                                id={'imageButton ' + i} 
                                className={`${styles.imageButton} ${photos[i] ? styles.sink:styles.rise}`} 
                            >
                                <div className={styles.clickEffectSide} onClick={() => handleClickAddImage(i)}>
                                    <img src={addIcon} className={styles.largeIcon} alt=' ' />
                                    <span className={styles.imageButtonTitle}>Add photo</span>
                                </div>
                            </div>
                            <div 
                                id={'image ' + i} 
                                className={`${styles.imageZIndex} ${photos[i] ? styles.rise:styles.sink}`} 
                            >
                                <img className={styles.imagePlaceholder} alt=' ' src={photos[i]} />
                                <img 
                                    src={closeIcon} 
                                    className={styles.largeIcon + ' ' + styles.crashImageButton} 
                                    alt = ' ' 
                                    onClick={() => handleCrashImage(i)}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            
            {/* note */}
            <p className={styles.note}>You can add up to 4 photos. The 1st photo will be set as cover (main photo).</p>

            {/* name */}
            <div className={styles.field}>
                <span className={styles.label}>
                    name
                </span>
                <input 
                    value={name} 
                    type="text" 
                    className={styles.input} 
                    placeholder="Enter product name" 
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* categories */}
            <SelectBox 
                title="categories" 
                onChange={setCategories} 
                handleLoad={handleLoadCategories} 
                initData={initData?.categories} 
            />

            {/* brand */}
            <SelectBox 
                title="brand" 
                only={true} 
                addMore={false} 
                onChange={setBrand} 
                handleLoad={handleLoadBrands}
                initData={initData?.brand}
            />

            {/* price */}
            <div className={styles.field}>
                <span className={styles.label}>
                    price ($)
                </span>
                <input 
                    value={price}
                    type="number" 
                    className={styles.input} 
                    placeholder="Enter product price"
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            {/* sizes */}
            <SelectBox 
                title="sizes" 
                data={[{_id: 's', name: 's'},{_id: 'm', name: 'm'},{_id: 'l', name: 'l'} ]} 
                addMore={false} 
                onChange={setSizeList} 
                initData={initData.sizeList} 
            />

            {/* color */}
            <SelectBox title="colors" addMore={false} onChange={setColorList} handleLoad={handleLoadColors} initData={initData.colors} />

            {/* quantity */}
            <div className={styles.field}>
                <span className={styles.label}>
                    quantity
                </span>
                <div className={styles.quantityBoxContainer}>
                    {
                        sizeList && sizeList.map((r, i) => 
                            <div key={i} className={styles.quantityBox}>
                                <span className={styles.label}>
                                    {r}
                                </span>
                                <input 
                                    value={quantity[r]}
                                    type="number" 
                                    className={styles.quantityInput} 
                                    onChange={(e) => setQuantity(prev => {
                                        const newQuantity = {...prev}
                                        newQuantity[r] = e.target.value
                                        return newQuantity
                                    })}
                                />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* description */}
            <div className={styles.field}>
                <span className={styles.label}>
                    description
                </span>
                <textarea spellCheck={false} value={description} className={styles.textarea} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* button */}
            <div className={styles.buttonContainer}>
                <div className={styles.cancelButton + ' ' + styles.activeClick} onClick={() => nav('../products')} >
                    Cancel
                </div>

                <button type="submit" className={styles.submitButton + ' ' + styles.activeClick}>
                    Complete
                </button>

                {/* validator */}
                {
                    showValidate &&
                    <span className={styles.validateMessage}>
                        Name, categoies, price, colors field must be filled
                    </span>
                }
                
            </div>
            
        </form>
    )
}

export default memo(AdminProductInfo)