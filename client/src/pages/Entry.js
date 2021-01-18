/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { Link, BrowserRouter as Router } from "react-router-dom"; 
import styles from '../css/blog.module.css';
import '../css/slick-slider.css';
import { connect } from 'react-redux';
import { fetchPost } from '../actions/post';
import '../css/code.css';
import '../css/style.css';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
// import Snackbar from '../components/snackbar';

import SideNav from '../components/SideNav.js'
import _ from 'underscore';

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

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: '',
            openSuccess: false,
            openError: false,
            emailError:false,
            nameError: false,
            messageError: false,
            sectionIds: {}, /* holds the IDs of the h tags */
            sectionsExist: false
        };
        // bindings
    }

    formatCodeSnippets = () => {
        // apply custom styles to all code blocks

        setTimeout(() => {

            var addScript = document.createElement('script');
            addScript.setAttribute('src', 'https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js');
            document.body.appendChild(addScript);

        }, 100);
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({
            openSuccess: false,
            openError: false
        })
    }

    getTitles = () => { /* sets the state for all title tags */

        setTimeout(() => {
            const titles = document.getElementsByClassName('blog-heading');
            const sectionIds = {};
            for ( let i=0; i < titles.length; i++ ) { /* setState */ 
                sectionIds[`${titles[i].id}`] = titles[i].id;
            }
            this.setState({ sectionIds });
        }, 500);
    }

    componentDidMount() {
        this.props.fetchPost(getParameterByName('id'));

        setTimeout(() => {
            
            var script = document.createElement("script");
            script.innerHTML = `var disqus_config = function () {
                this.page.url = "${window.location.href}";  // Replace PAGE_URL with your page's canonical URL variable
                this.page.identifier = "${unescape(this.props.title)}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
                };
                
                (function() { // DON'T EDIT BELOW THIS LINE
                var d = document, s = d.createElement('script');
                s.src = 'https://moralyzer-com.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
                })();
            ` 
            const el = document.getElementById('disqus_thread')
            el.parentElement.appendChild(script);

        }, 1000)
    }
    handleChange = name => event => {

        this.setState({
            [name]: event.target.value
        });
    };

    render() {
        const { post } = this.props.state;
        const { mobile } = this.props;
        let { title } = post;
        const { body } = post;

        if ( post.error ) { /* Not found */
            return <Redirect to="/404" />
        }

        if ( !title ) {
            return (
                null
            )
        } else {

        var tags = post.tags.map((tag) => {
            return <a>{tag}</a>
        });

        //add body and format code
        setTimeout(() => {
            window.PR.prettyPrint()
        }, 1000)

        let sideNav;
        if ( !mobile && Object.keys(this.state.sectionIds).length > 0 ) {
            sideNav = <SideNav sectionIds={this.state.sectionIds} />
        }

        if ( title.length > 80 ) { /* truncate the length for readability */
            title = title.slice(0, 80) + '...'
        } 

        let desBody = body;
        if ( body.length > 80 ) { /* truncate the length for readability */
            desBody = body.slice(0, 80) + '...'
        } 

        const date = new Date(post.date)
    
        return (
                <section style={{backgroundColor: 'white'}} className={[styles.sContent,styles.sContentTopPadding,styles.sContentNarrow].join(" ")}>
                    {sideNav}
                    <Helmet>
                        <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
                        <script type="application/ld+json">{`
                            {
                            "@type":"BlogPosting",
                            "headline": "${title}",
                            "datePublished": "${post.date}",
                            "articleBody": "${escape(desBody)}",
                            "image":"${post.headerImg}",
                            "wordcount": "${body.length}",
                            "url": "https://moralyzer.com/${post.title}",
                            "pageStart":"1",
                            "pageEnd":"1",
                            "keywords": "${post.tags.join(' ')}",
                            "genre":"${post.category}", 
                            "publisher": {
                                "@type": "Organization",
                                "name": "moralyzer",
                                "url": "http://www.moralyzer.com",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://moralyzer-img-server-1.s3.us-east-2.amazonaws.com/logo.png",
                                    "width":"40",
                                    "height":"40"
                                }
                            },
                            "author": {
                                "@type": "Person",
                                "name": "${post.author.name}"
                            }
                        }
                        `}</script>
                        <title>{post.title}</title>
                        <meta name="description" content={post.meta} />
                    </Helmet>

                    {/* <Snackbar handleClose={this.handleClose} open={this.state.openSuccess} variant={'success'} message={"Thanks for posting the comment"} />
                    <Snackbar handleClose={this.handleClose} open={this.state.openError} variant={'error'} message={"You've got some errors on the comment form"} /> */}

                    <article className={[styles.row,styles.entry,styles.formatStandard].join(" ")}>
                        <div className={[styles.entryMedia,styles.colFull].join(" ")}>
                            <div className={styles.entryPostThumb}>
                                <img src={post.hero} alt="" />
                            </div>
                        </div>
    
                        <div className={[styles.entryHeader,styles.colFull].join(" ")}>
                            <h1 className={[styles.entryHeaderTitle,styles.display1].join(" ")}>
                                {post.title}
                            </h1>
                            <ul className={styles.entryHeaderMeta}>
                                <li className={styles.date}>{date.toDateString()}</li>
                                <li className={styles.byline}>
                                    By {post.author.name}
                                </li>
                            </ul>
                        </div>
    
                        <div id="body" style={{ padding: 20 }} className={[styles.colFull,styles.entryMain].join(" ")} >   
                            {body}
                        </div>
    
                        <div style={{ padding: 20 }} className={styles.entryTaxonomies}>
                                <div className={styles.entryCat}>
                                    <h5>Posted In: </h5>
                                    <span className={styles.entryTaxList}>
                                        <span>{post.category}</span>
                                    </span>
                                </div> 
    
                                <div className={styles.entryTags}>
                                    <h5>Tags: </h5>
                                    <span className={[styles.entryTaxList,styles.entryTaxListPill].join(" ")}>
                                        {tags}
                                    </span>
                                </div> 
                            </div> 
    
                            <div className={styles.entryAuthor}>

                                <img src={`https:${post.author.picture.fields.file.url}`} />

                                <div style={{}} className={styles.entryAuthorAbout}>
                                    <h5 className={styles.entryAuthorName}>
                                        <span>Posted by</span>
                                        <h2 style={{marginTop:0}}>{post.author.name}</h2>
                                    </h5>
    
                                    <div className={styles.entryAuthorDesc}>
                                        {post.author.description}
                                    </div>
                                </div>
                            </div>
                        </article>     
                    <div style={{padding:40}} id="disqus_thread"></div>
                </section> 
            )
        }
    }
}

const mapStateToProps = state => (
    { 
        state: state.BlogReducer,
        mobile: state.AppReducer.mobile
    }
)

export default connect(mapStateToProps, { fetchPost })(Entry);