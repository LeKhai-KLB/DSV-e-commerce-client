import { memo } from "react"
import { useParams } from 'react-router-dom'

function Product() {
    const params = useParams()
    console.log(params.slug)
    return (
        <h1>{params.slug}</h1>
    )
}

export default memo(Product)