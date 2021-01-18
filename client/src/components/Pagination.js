import * as React from 'react';
import styles from '../css/blog.module.css';
import { NavLink, Link, BrowserRouter as Router } from "react-router-dom"; 

/**
 * Description: gets the query param name from url
 * @param { String } name 
 * @param { Window } url 
 */
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Pagination extends React.Component {
  render() {
    const props = this.props;
    const url = window.location.pathname;
    let currentPage = getParameterByName('page')
    let backDisabled = false;
    let forwardDisabled = false;

    const totalPages = Math.floor(props.total / 12) + 1;


    // on the first set of pages
    if ( Math.floor((currentPage-1) / 5) == 0 ) {
        backDisabled = true;
    }

    // on the last set of pages
    if ( totalPages - (Math.floor((currentPage-1) / 5) * 5) <= 5) {
        forwardDisabled = true;
    }

    console.log(Math.floor((totalPages - currentPage) / 5),forwardDisabled, backDisabled)

    const STARTING_INDEX = (Math.floor((currentPage-1) / 5) * 5);
    const END_INDEX = STARTING_INDEX + 5;
    const pageArray = [...Array(totalPages + 1).keys()].slice(1,).slice(STARTING_INDEX,END_INDEX)

    const pageElements = pageArray.map((pageNumber) => {
        if (pageNumber == currentPage) {
            return  <li><span className={[styles.pgnNum,styles.current].join(" ")}>{pageNumber}</span></li>
        } else {
            return <li><Link className={styles.pgnNum} to={`?page=${pageNumber}`}>{pageNumber}</Link></li>
  
        }
    })

    let back;
    if (!backDisabled) {
        back = <li><Link className={styles.pgnPrev} to={`?page=${(parseInt(currentPage) - 5)}`}>Prev</Link></li>
    }

    let forward;
    if (!forwardDisabled) {
        forward = <li><Link className={styles.pgnNext} to={`?page=${((totalPages - currentPage > 5) ? parseInt(currentPage) + 5 : totalPages)}`} >Next</Link></li>
    }

    return (
        <div className={[styles.row,styles.paginationWrap].join(" ")}>
            <div className={styles.colFull}>
                <nav className={styles.pgn}>
                    <ul>
                        {back}
                        {pageElements}
                        {forward}
                    </ul>
                    <div>showing elements {(parseInt(currentPage-1) * 12) + 1} - {(((parseInt(currentPage) * 12) + 1) > props.total) ? props.total : ((parseInt(currentPage) * 12) + 1)} out of {props.total}</div>
                </nav>
            </div>
        </div>
    );
  };
};

export default Pagination