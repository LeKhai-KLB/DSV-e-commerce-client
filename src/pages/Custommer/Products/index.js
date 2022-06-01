import styles from './products.module.css'
import {Link, useNavigate} from 'react-router-dom'
import { useParams, useSearchParams } from 'react-router-dom'
import { memo, useState, useEffect } from 'react'
import FilterDropdownBar from '../../../components/Custommer/FilterBox/FilterDropdownBar' 
import FilterSizeBox from '../../../components/Custommer/FilterBox/FilterSizeBox'
import FilterColorBox from '../../../components/Custommer/FilterBox/FilterColorBox'
import FilterByWordBox from '../../../components/Custommer/FilterBox/FilterByWordBox'
import FilterPriceBox from '../../../components/Custommer/FilterBox/FilterPriceBox'
import SortBox from '../../../components/Custommer/SortBox'
import Pagination from '@mui/material/Pagination';

import axios from 'axios'

// image assets
import dumpImage  from '../../../assets/shared/dump/dump1.png'

function Products() {
    const params = useParams()
    const [queries, setQueries] = useSearchParams()
    const [categoryList, setCategoryList] = useState([])
    const [colorList, setColorList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [totalLength, setTotalLength] = useState(0)
    const [productList, setProductList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const nav = useNavigate()

    const handleLoadProductList = async () => {
        setIsLoading(true)
        try {
            const queryObject = Object.fromEntries([...queries])
            let queryString = Object.keys(queryObject).map(key => {
                return `${key}=${queryObject[key]}`
            }).join('&')

            if(!queryObject?.category)
                queryString += '&category=' + params.seRankCategory.split('_')[1]
            
            const { data } = await axios.get(process.env.REACT_APP_GET_PRODUCT_BY_FILTER_AND_SORT_VALUE_API + '?' + queryString)
            if(data.status === 200) {
                setProductList(data.resultData.products)
                setTotalLength(data.resultData.remainingLength)
                setTimeout(() =>
                    setIsLoading(false), 300)
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch (err) {
            setProductList([])
            setTimeout(() =>
                setIsLoading(false), 300)
            console.log(err.message)
        }
    }

    const handleLoadBrandList = async () => {
        try {
            const categoryId = queries.get('category') ? queries.get('category'):params.seRankCategory.split('_')[1]
            const brandData = await axios.get(process.env.REACT_APP_GET_ALL_BRANDS_PASS_CATEGORY_API + '?category=' + categoryId)
            if(brandData.data.status === 200) {
                setBrandList(brandData.data.resultData)
            }
        }
        catch{}
    }
    
    const handleFirstLoad = async () => {
        try {
            const parentId = params.seRankCategory.split('_')[1]
            const categoryData = await axios.get(process.env.REACT_APP_GET_CATEGORY_PASS_BY_PARENT_VALUE_API + '?parent=' + parentId)
            if(categoryData.data.status === 200) {
                setCategoryList([{name: 'All ' + params.seRankCategory.split('_')[0], _id:parentId}, ...categoryData.data.resultData])
                
            }
            const colorData = await axios.get(process.env.REACT_APP_GET_ALL_COLORS_API)
            if(colorData.data.status === 200) {
                setColorList(colorData.data.resultData)
            }
            const categoryId = queries.get('category') ? queries.get('category'):params.seRankCategory.split('_')[1]
            const brandData = await axios.get(process.env.REACT_APP_GET_ALL_BRANDS_PASS_CATEGORY_API + '?category=' + categoryId)
            if(brandData.data.status === 200) {
                setBrandList(brandData.data.resultData)
            }
            queries.set('sortValue', '{"title": "Popularity", "key": "sold", "option":"asc"}')
            queries.set('page', 1)
            queries.set('limit', 20)
            setQueries(queries)
        }
        catch(err) {
        }
    }

    const handleChangeSortValue = (value) => {
        queries.set('sortValue', value)
        setQueries(queries)
    }

    const handleChangeQueryValue = (title ,value) => {
        if(value === ''){
            queries.delete(title)
        }
        else {
            queries.set(title, value)
        }
        setQueries(queries)
    }

    const handleChangeCategory = (id) => {
        {
            const parentId = params.seRankCategory.split('_')[1]
            if(id === parentId) {
                queries.delete('category')
                setQueries(queries)
                handleLoadBrandList()
            }
            else{
                queries.set('category', id)
                setQueries(queries)
                handleLoadBrandList()
            }
        }
    }

    const handleChangePage = (p) => {
        queries.set('page', p)
        setQueries(queries)
    }

    const handleClickProductCard = (id) => {
        nav('../product/' + id)
    }

    useEffect(() => {
        const temp = Object.fromEntries([...queries])
        if(Object.keys(temp).length !== 0)
            handleLoadProductList()
    }, [queries])

    useEffect(() => {
        console.log(params.seRankCategory)
        handleFirstLoad()
    }, [params.seRankCategory])
    
    return (
        <div className={styles.productsPageContainer}>
            <div className={styles.pageTitleContainer}>
                {params.fstRankCategory + ' / ' + params.seRankCategory.split('_')[0].replace('+', ' ')}
            </div>
            <div className={styles.contentContainer}>

                {/* handle side container */}
                <div className={styles.handleSideContainer}>

                    {/* category box */}
                    <div className={styles.categoryBox}>
                        <span className={styles.boxTitle}>Category</span>
                        {
                            categoryList.length !== 0 &&
                            categoryList.map((e, i) => (
                                <span 
                                    key={i} 
                                    className={`${styles.categorySubTitle} ${
                                        queries.get('category') ?
                                        (queries.get('category') === e._id ? styles.highlight:''):
                                        (params.seRankCategory.split('_')[1] === e._id ? styles.highlight:'')
                                    }`}
                                    onClick={() => handleChangeCategory(e._id)}
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
                            <FilterSizeBox 
                                onChange={handleChangeQueryValue} 
                                value={queries.get('size')}
                            />   
                        </FilterDropdownBar>

                        {/* color filter */}
                        <FilterDropdownBar title={'Color'} >
                            <FilterColorBox 
                                onChange={handleChangeQueryValue} 
                                value={queries.get('colors') ? queries.get('colors').split('-'):null} 
                                initData={colorList} 
                                multiChoice={true}
                            />
                        </FilterDropdownBar>

                        {/* brand filter */}
                        <FilterDropdownBar title={'Brand'} >
                            <FilterByWordBox 
                                initData={brandList} 
                                onChange={handleChangeQueryValue} 
                                title="brands" value={queries.get('brands') ? queries.get('brands').split('-') :null} 
                            />
                        </FilterDropdownBar>

                        {/* price filter */}
                        <FilterDropdownBar title={'Price'} >
                            <FilterPriceBox 
                                value={queries.get('price') ? queries.get('price').split('-').map(p => Number(p)):null} 
                                onChange={handleChangeQueryValue}
                            />
                        </FilterDropdownBar>

                        {/* availabel filter */}
                        <FilterDropdownBar title={'Available'} >
                            <FilterByWordBox 
                            onChange={handleChangeQueryValue} 
                            title="available" 
                            value={queries.get('available') ? queries.get('available').split('-'):null} 
                            initData={['In store', 'Out of stock']}/>
                        </FilterDropdownBar>

                    </div>

                </div>

                {/* product container */}
                <div className={styles.productsContainer}>

                    {/* Top products container */}
                    <div className={styles.topProductsContainer}>
                        <SortBox value={queries.get('sortValue')} onChange={handleChangeSortValue} list={[
                            '{"title": "Popularity", "key": "sold", "option":"asc"}',
                            '{"title":"Latest", "key": "_id", "option":"desc"}', 
                            '{"title":"A - Z", "key": "name", "option":"asc"}', 
                            '{"title":"Z - A", "key": "name", "option":"desc"}',
                            '{"title":"Price: highest", "key": "price", "option":"desc"}',
                            '{"title":"Price: lowest", "key": "price", "option":"asc"}'
                        ]} />
                        <Pagination count={Math.ceil(Number(totalLength)/20) === 0 ? 1:Math.ceil(Number(totalLength)/20)} boundaryCount={1} page={queries.get('page') ? Number(queries.get('page')):1} onChange={(e, p) => handleChangePage(p)} />
                    </div>

                    {/* middle products container */}
                    <div className={styles.middleProductsContainer}>
                        <div className={styles.gridContainer} >
                            {
                                
                                productList.length !== 0 ?
                                productList.map((p, i) => (
                                    <div key={i} className={styles.productCard} onClick={() => handleClickProductCard(p._id)}>
                                        <img className={styles.cardImage} src={p.images[0]} alt={p.name} />
                                        <div title={p.name} className={styles.cardTitle}>{p.name}</div>
                                        <p className={styles.cardPrice}>${p.price}</p>
                                    </div>
                                )):
                                <div className={styles.overlayBox}> No result found </div>
                            }
                        </div>
                        {
                            isLoading &&
                            <div className={styles.gridContainer + ' ' + styles.overLayContainer}>
                                <div className={styles.overlayBox}> Loading... </div>
                            </div>
                        }
                    </div>

                    {/* bottom products container */}
                    <div className={styles.bottomProductsContainer}>
                        <Pagination count={Math.ceil(Number(totalLength)/20) === 0 ? 1:Math.ceil(Number(totalLength)/20)} boundaryCount={1} page={queries.get('page') ? Number(queries.get('page')):1} onChange={(e, p) => handleChangePage(p)} />
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default memo(Products)