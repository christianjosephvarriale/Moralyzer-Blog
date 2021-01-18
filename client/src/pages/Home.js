import React, { Component, Suspense } from 'react';

import styles from '../css/blog.module.css';

import Card from '../components/Card';
import { connect } from 'react-redux';
import { fetchAllPosts } from '../actions/post';

import Pagniation from '../components/Pagination';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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

class Home extends Component {

    componentDidMount() {

        if ( !getParameterByName('page') ) { // redirect to ?page=1
            window.location.href = '?page=1'
        }
        this.props.fetchAllPosts()
    }

    render() {
        
        const { props } = this;
        const length = props.state.posts.length || 0;
        let posts = props.state.posts || [];
        var mappedPosts;
        var schemaData

        if ( length > 0 ) {

            let page = getParameterByName('page')

            posts.sort(function(a, b) {
                return (a.date > b.date) ? -1 : ((a.date > b.date) ? 1 : 0);
            });

            if (page > (Math.floor( length / 12 ) + 1)) { /* throw 404 */ 
                return <Redirect to="/404" />
            }

            const paginatedPosts = posts.slice( (page-1) * 12, page * 12 );

            mappedPosts = paginatedPosts.map((post, index) =>  
                <Card  
                    index={index} 
                    title={post.title} 
                    hero={post.hero} 
                    id={post.id} 
                    date={post.date} 
                    author={post.author}
                    meta={post.meta}
                    category={post.category}
                /> 
            );

            schemaData = paginatedPosts.map((post) =>  
            { 
                let title = post.title;
                if ( post.title.length > 80 ) { /* truncate the length for readability */
                    title = title.slice(0, 80) + '...'
                } 

                const escaped_title = post.title.replace(/\./g,'&#46;').replace(/\//g,'&#47;')

                return (
                    `{
                        "@type":"BlogPosting",
                        "headline": "${post.title}",
                        "datePublished": "${post.date}",
                        "image":"${post.headerImg}",
                        "url": "https://demo.moralyzer.com/blog/${encodeURI(escaped_title)}",
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
                    }`
                )
            })
        } 

        
        return (
            <>
                <div style={{ marginTop: 160, padding: '0 30px' }}class="section-header">
                    <h3 style={{ fontWeight:300,padding:0 }}class="section-title">Moralyzer's Blog</h3>
                    <span class="section-divider"></span>
                    <p style={{ padding:0 }}class="section-description">
                        Social Activism. Social Media<br/>
                    </p>
                </div>

                <Helmet>
                <script type="application/ld+json">{`
                    {
                        "@context":"http://schema.org",
                        "@type":"Blog",
                        "@id":"${window.location.href}",
                        "headline":"Social Justice Educational Blog",
                        "description":"Here are some blog posts relating to Social Justice, Racism, Environmentalism, Feminism and Mental Health",
                        "blogPost": [${schemaData}]
                    }  
                `}</script>
                </Helmet>

                <section className={styles.sContent}>
                    <div className={[styles.row,styles.entriesWrap,styles.wide].join(" ")}>
                        <div className={styles.entries}>
                            { mappedPosts }
                        </div> 
                    </div>

                    <Pagniation total={length}/>

                </section> 
            </>
        ) 
    }
}

const mapStateToProps = state => ({
    state: state.BlogReducer,
})

export default connect(mapStateToProps, { fetchAllPosts })(Home);