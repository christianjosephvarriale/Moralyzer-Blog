import React, { Component } from 'react';
import styles from '../css/blog.module.css';
import '../css/slick-slider.css';
import LazyLoad from 'react-lazyload'
import { Link } from "react-router-dom"; 
import '../css/style.css';

/**
 * Description: Truncates text if over 80 characters and adds ...
 * @param { String } text  
 */
const ellipsisify = (text) => {

    return 
}

class Card extends Component {

    
    render() {
        const props = this.props;
        const date = new Date(props.date);

        let title = props.title       
        let meta = props.meta 
        if ( title?.length > 80 ) { /* truncate the length for readability */
            title = title.slice(0, 80) + '...'
        } 

        if ( meta?.length > 80 ) { /* truncate the length for readability */
            meta = meta.slice(0, 80) + '...'
        } 

        const escaped_title = props.title.replace(/\./g,'&#46;').replace(/\//g,'&#47;')

        return (
            <article itemscope itemtype={"http://schema.org/Blog"} data-wow-duration="1s" data-wow-delay="1s" className={`${styles.colBlock} fadeInUp wow`}>  
                <meta itemprop="position" content={props.index} />
                <meta itemprop="keywords" content={props.tags} />
                <div className={`${styles.itemEntry}`}>
                    <div className={styles.itemEntryThumb}>
                        <Link to={`/${encodeURI(escaped_title)}?id=${props.id}`} className={styles.itemEntryThumbLink}>
                            <LazyLoad><img itemprop="thumbnailUrl" src={props.hero} alt={title}/></LazyLoad>
                        </Link>
                    </div> 
                    <div className={styles.itemEntryText}>
                        <div className={styles.itemEntryCat}>{props.category}</div>
                        <h1 itemprop="headline" className={styles.itemEntryTitle}><Link to={`/${encodeURI(escaped_title)}?id=${props.id}`}>{title}</Link></h1>
                        <div style={{ marginBottom: 40 }} className={styles.itemEntryText}>{meta}</div>
                        <div className={styles.itemEntryDate}>
                            <Link itemprop="datePublished" to={`/${encodeURI(escaped_title)}?id=${props.id}`} role="menuitem">{date.toDateString()}</Link>
                        </div>
                    </div>
                </div> 
            </article> 
        )
    }
}

export default Card;