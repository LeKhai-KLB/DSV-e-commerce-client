import styles from './productList.module.css'
import {Link} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { memo } from 'react'

const dumpProductData = ['product1', 'product2', 'product3', 'product4', 'product5', 'product6']
const third_rank_categories = ['all short', 'jean short', 'kaki short']

function Products() {
    const params = useParams()
    console.log(`${params.fstRankCategory}/${params.seRankCategory}/${params.thrRankCaterogy}`)
    
    return (
        <div className = "wrapper">
        </div>  
    )
}

export default memo(Products)