import styles from './Pagination.module.css';
import { memo, useRef } from 'react'
import { useEffect, useState } from 'react'

// image assets
import lastPageIcon from '../../../assets/shared/icon/last-page.png'
import firstPageIcon from '../../../assets/shared/icon/first-page.png'
import nextIcon from '../../../assets/shared/icon/next.png'
import prevIcon from '../../../assets/shared/icon/prev.png'
import arrowIcon from '../../../assets/shared/icon/arrow.png'

function PaginationBar({entriesQty, onChangePage, maxShowEntries, onchangeMaxShow}) {

    const [maxPages, setMaxPages] = useState(Math.ceil(entriesQty / maxShowEntries))
    const [maxShow, setMaxShow] = useState(maxShowEntries)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLastShowPage, setCurrentLastShowPage] = useState(Math.ceil(entriesQty / maxShowEntries) < 5 ? Math.ceil(entriesQty / maxShowEntries):5)
    const nextBtn = useRef()
    const prevBtn = useRef()
    const firstPageBtn = useRef()
    const lastPageBtn = useRef()

    useEffect(() => onChangePage(currentPage), [currentPage])

    useEffect(() => {
        onchangeMaxShow(maxShow)
    }, [maxShow])

    useEffect(() => {
        if(currentPage > maxPages) {
            setCurrentPage(maxPages === 0 ? 1 : maxPages)
        }
    }, [currentLastShowPage, maxPages, maxShow, currentPage])

    useEffect(() => {
        const totalPage = Math.ceil(entriesQty / maxShow)
        setMaxPages(totalPage)
        setCurrentLastShowPage(totalPage < 5 ? (totalPage === 0 ? 1: totalPage):5)
    },[entriesQty])

    useEffect(() =>
        setCurrentPage(1)
    ,[])

    const handleOnlickRangeButton = (value) => {
        const pages = Math.ceil(entriesQty / value)
        setMaxShow(value)
        setMaxPages(pages)
        setCurrentPage(currentPage <= pages ? currentPage:pages)
        setCurrentLastShowPage(pages < 5 ? pages:5)
    }

    const handleClickNextButton = () => {
        if(currentPage + 1 === maxPages) {
            setCurrentLastShowPage(maxPages)
        }
        else {
            if(currentPage + 1 > currentLastShowPage) {
                setCurrentLastShowPage((currentLastShowPage + 5) < maxPages ? currentLastShowPage + 5 :maxPages)
            }
        }
        setCurrentPage(currentPage + 1)
    }

    const handleClickPrevButton = () => {
        if(currentPage - 1 === 1) {
            setCurrentLastShowPage(maxPages < 5 ? maxPages:5)
        }
        else {
            if(currentPage - 1 < currentLastShowPage - 4) {
                setCurrentLastShowPage(currentLastShowPage - 5 > 5 ? currentLastShowPage - 5:5)
            }
        }
        setCurrentPage(currentPage - 1)
    }

    const handleClickLastButton = () => {
        setCurrentLastShowPage(maxPages)
        setCurrentPage(maxPages)
    }

    const handleClickFirstButton = () => {
        setCurrentLastShowPage(maxPages < 5 ? maxPages:5)
        setCurrentPage(1)
    }   

    const handleShowRangeBox = () => {
        document.querySelector('.' + styles.rangeBox).classList.toggle(styles.hidden)
    }

    return (
        <div className={styles.paginationBarContainer}>
            <span className={styles.paginationTitle}>Show 1 to {maxShow} of {entriesQty} entries</span>
            <div className={styles.paginationControlContainer}>
                <div className={styles.selectionBox} onClick={() => handleShowRangeBox()}>
                    {maxShow}
                    <img className={styles.arrowIcon} src={arrowIcon} alt="dropdown menu" />
                    <div className={styles.rangeBox  + ' ' + styles.hidden}>
                        {
                            [10, 5, 1].map((e, i) => 
                                <div 
                                    key={i} 
                                    className={styles.rangeButton}
                                    onClick={() => handleOnlickRangeButton(e)}
                                >
                                    {e}
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={styles.controller}>
                    <img 
                        ref={firstPageBtn} 
                        className={`${styles.paginationIcon} ${currentPage === 1 ? styles.inactive:''}`} 
                        src={firstPageIcon} 
                        alt="first page" 
                        onClick={() => handleClickFirstButton()}
                    />
                    <img 
                        ref={prevBtn} 
                        className={`${styles.paginationIcon} ${currentPage === 1 ? styles.inactive:''}`}
                        src={prevIcon} 
                        alt="prev page" 
                        onClick={() => handleClickPrevButton()}
                    />

                    {
                        currentLastShowPage &&
                        [...Array(5)].map((e, i) => {
                            if(currentLastShowPage < 5) {
                                if(i + 1 <= currentLastShowPage) {
                                    return (
                                        <div 
                                            key={i} 
                                            className={`
                                                ${styles.numberBox} 
                                                ${(i + 1 === currentPage) ? styles.highlight:''}
                                            `}
                                            onClick={() => {setCurrentPage(i + 1)}}
                                        >  
                                            {i + 1}
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={i} className={styles.numberInactiveBox} />
                                    )
                                }
                            }
                            else {
                                return (
                                    <div 
                                        key={currentLastShowPage - 4 + i} 
                                        className={`${styles.numberBox} ${(currentLastShowPage - 4 + i === currentPage) ? styles.highlight:''}`}
                                        onClick={() => setCurrentPage(currentLastShowPage - 4 + i)}
                                    >  
                                        {currentLastShowPage - 4 + i}
                                    </div>
                                )
                            }
                        })
                    }

                    <img 
                        ref={nextBtn} 
                        className={`${styles.paginationIcon} ${currentPage === maxPages ? styles.inactive:''}`}
                        src={nextIcon} 
                        alt="next page" 
                        onClick={() => handleClickNextButton()}
                    />
                    <img 
                        ref={lastPageBtn} 
                        className={`${styles.paginationIcon} ${currentPage === maxPages ? styles.inactive:''}`}
                        src={lastPageIcon} 
                        alt="last page" 
                        onClick={() => handleClickLastButton()}
                    />
                </div>
            </div>
        </div> 
    )
}

export default memo(PaginationBar)