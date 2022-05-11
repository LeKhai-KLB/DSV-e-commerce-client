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
            <h2 className = {styles.header}>{`${params.fstRankCategory}/${params.seRankCategory}`}</h2>
            <div className = {styles.container}>
                <div className = {styles.categoriesContainer}>
                    <h3> cartegories </h3>
                    <ul>
                        {third_rank_categories.map((e, i) => (
                            <Link key = {i} to = {`../products/${params.fstRankCategory}/${params.seRankCategory}/${e.replace(' ', '_')}`}>{e}<br></br></Link>

                        ))}
                    </ul>
                </div>
                <div className = {styles.productsContainer}>
                    {dumpProductData.map((e, i) => (
                        <Link to = {`../product/${e}`} key = {i} className = {styles.productItem}>{e}</Link>
                    ))}
                </div>
            </div>
        </div>  
    )
}

export default memo(Products)