import styles from './products.module.css'
import {Link} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { memo, useState, useEffect } from 'react'
import FilterDropdownBar from '../../components/NonAdminComponent/FilterDropdownBar' 
import FilterSizeBox from '../../components/NonAdminComponent/FilterBox/FilterSizeBox'
import FilterColorBox from '../../components/NonAdminComponent/FilterBox/FilterColorBox'
import FilterByWordBox from '../../components/NonAdminComponent/FilterBox/FilterByWordBox'
import FilterPriceBox from '../../components/NonAdminComponent/FilterBox/FilterPriceBox'
import SortBox from '../../components/NonAdminComponent/SortBox'
import Pagination from '@mui/material/Pagination';
import { 
getAllBrandsAPI, 
getCategoriesPassByParentAPI, 
getAllBrandPassByCategoryAPI, 
getProductsByFilterAndSortValue,
} from '../../APIs'
import axios from 'axios'

// image assets
import dumpImage  from '../../assets/general/dump/dump1.png'

function Products() {
    const params = useParams()
    const [categoryList, setCategoryList] = useState([])
    const [currentCategory, setCurrentCategory] = useState(0)
    const [size, setSize] = useState('s')
    const [color, setColor] = useState({title: 'black',value: '#000'})
    const [brand, setBrand] = useState('All')
    const [available, setAvailable] = useState('All')
    const [priceRange, setPriceRange] = useState([0, 100])
    const [sortValue, setSortValue] = useState('Date added')
    const [page, setPage] = useState(1)
    const [totalLength, setTotalLength] = useState(0)
    const [productList, setProductList] = useState([
    ])

    console.log(available)

    const handleClickCategory = (i) => {
        setCurrentCategory(i)
    }

    const handleChangePage = (e, p) => {
        setPage(p)
    }

    const handleLoadBrandList = async () => {
        try{
            console.log(categoryList)
            const {data} = await axios.get(
                getAllBrandPassByCategoryAPI + '?category=' + categoryList[currentCategory]?.name.replace(' ', '+')
            )
            if(data?.status === 200) {
                const newBrandList = data.resultData.map(b => b.name)
                return newBrandList
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err) {
            throw new Error(err.message)
        }
    }
    
    const handleLoadProductList = async () => {
        try {
            const {data} = await axios.post(getProductsByFilterAndSortValue, 
            {
                category: categoryList[currentCategory].name,
                size: size,
                color: color.title,
                brand: brand,
                available: available,
                price: `${priceRange[0]}-${priceRange[1]}`,
                sortValue: sortValue,
                slice: `${page*20-20}-20`
            })

            if(data.status === 200) {
                setProductList(data.resultData.products)
                setTotalLength(data.resultData.remainingLength)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err) {
            setProductList([])
            setTotalLength(0)
        }
    }

    const handleFirstLoad = async () => {
        try {
            const { data } = await axios.get(getCategoriesPassByParentAPI + '?parent=' + params.seRankCategory)
            if(data.status === 200) {
                setCategoryList([{name: 'All ' + params.seRankCategory}, ...data.resultData])
                setBrand('All')
            }
        }
        catch(err) {

        }
    }

    useEffect(() => {
        handleLoadProductList()
    }, [categoryList, currentCategory, color, brand, priceRange, available, sortValue]);

    useEffect(() => {
        handleFirstLoad()
    }, [params.seRankCategory])
    
    return (
        <div className={styles.productPageContainer}>
            <div className={styles.pageTitleContainer}>
                {params.fstRankCategory + ' / ' + params.seRankCategory.replace('_', ' ')}
            </div>
            <div className={styles.contentContainer}>

                {/* handle side container */}
                <div className={styles.handleSideContainer}>

                    {/* category box */}
                    <div className={styles.categoryBox}>
                        <span className={styles.boxTitle}>Category</span>
                        {
                            categoryList.map((e, i) => (
                                <span 
                                    key={i} 
                                    className={`${styles.categorySubTitle} ${currentCategory === i ? styles.highlight:''}`}
                                    onClick={() => handleClickCategory(i)}
                                >
                                    {e.name}
                                </span>
                            ))
                        }
                    </div>

                    {/* filter box */}
                    <div className={styles.filterBox}>
                        <span className={styles.boxTitle + ' ' + styles.mtb_5}>
                            Filter
                        </span>

                        {/* size filter */}
                        <FilterDropdownBar title={'Size'} >
                            <FilterSizeBox onChange={setSize} value={size}/>   
                        </FilterDropdownBar>

                        {/* color filter */}
                        <FilterDropdownBar title={'Color'} >
                            <FilterColorBox onChange={setColor} value={color} />
                        </FilterDropdownBar>

                        {/* brand filter */}
                        <FilterDropdownBar title={'Brand'} dependency={[params.seRankCategory, currentCategory]}>
                            <FilterByWordBox onChange={setBrand} value={brand} handleLoad={handleLoadBrandList} />
                        </FilterDropdownBar>

                        {/* price filter */}
                        <FilterDropdownBar title={'Price'} >
                            <FilterPriceBox value={priceRange} onChange={setPriceRange}/>
                        </FilterDropdownBar>

                        {/* availabel filter */}
                        <FilterDropdownBar title={'Available'} >
                            <FilterByWordBox onChange={setAvailable} value={available} initData={['In-store', 'Out of stock']}/>
                        </FilterDropdownBar>

                    </div>

                </div>

                {/* product container */}
                <div className={styles.productsContainer}>

                    {/* Top products container */}
                    <div className={styles.topProductsContainer}>
                        <SortBox value={sortValue} onChange={setSortValue} list={['Date added', 'A - Z', 'Z - A']} />
                        <Pagination count={Math.ceil(totalLength/20)} boundaryCount={1} page={page} onChange={handleChangePage}/>
                    </div>

                    {/* middle products container */}
                    <div className={styles.middleProductsContainer}>
                        <div className={styles.gridContainer} >
                            {
                                productList.length !== 0 ?
                                productList.map((p, i) => (
                                    <div key={i} className={styles.productCard} >
                                        <img className={styles.cardImage} src={p.images[0]} alt={p.name} />
                                        <div title={p.name} className={styles.cardTitle}>{p.name}</div>
                                        <p className={styles.cardPrice}>${p.price}</p>
                                    </div>
                                )):
                                <div className={styles.NofoundMessage}> No result found </div>
                            }
                        </div>
                    </div>

                    {/* bottom products container */}
                    <div className={styles.bottomProductsContainer}>
                        <Pagination count={Math.ceil(totalLength/20)} boundaryCount={1} page={page} onChange={handleChangePage}/>
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default memo(Products)