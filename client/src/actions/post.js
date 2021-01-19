import { POST_ACTIONS } from './types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazyload'
const contentful = require('contentful');

const client = contentful.createClient({
    space: 'mssz45ml30nj',
    accessToken: process.env.REACT_APP_CONTENTFUL_API_KEY
});

/**
 * Description:
 *  1. Queries the database to retreive all posts
 *  2. If region is not undefined it will retreive based on region
 */
export const fetchAllPosts = () => dispatch => {

    client.getEntries({
        content_type: 'blog'
    })
        .then((res) => {

            const posts = [];

            // update the state of the app with the blog entries
            for (let i=0; i < res.items.length; i++) {

                posts.push({
                    'id': res.items[i].sys.id,
                    'author':res.items[i].fields.author.fields,
                    'date':res.items[i].fields.date,
                    'hero': `https:${res.items[i].fields.hero.fields.file.url}`,
                    'category': res.items[i].fields.category,
                    'title':res.items[i].fields.title,
                    'tags':res.items[i].fields.tags,
                    'meta': res.items[i].fields.meta
                })
            }

            dispatch({
                type: POST_ACTIONS.FETCH_ALL,
                payload: posts 
            })
            console.log('dispatched');
        })
        .catch(console.error)
}

/**
 * Description:
 *  1. Queries the database to retreive based on title
 *  2. response contains 3 objects, post, prevPost, nextPost
 */
export const fetchPost = id => dispatch => {
    client.getEntry(id)
        .then((post) => {


            const rawRichTextField = post.fields.body;

            let options = {
                renderNode: {
                  'embedded-asset-block': (node) => 
                    <LazyLoad><img style={{width:'100%'}} src={node.data.target.fields.file.url}/></LazyLoad>,
                   [BLOCKS.PARAGRAPH]: (node, children) => {
                       if ( ( node.content[0].marks.length > 0 ) && ( node.content[0].marks[0].type === 'code' ) ) {
                           
                        return ( <pre class="prettyprint">{children[0].props.children}</pre> )
                       } else {
                           return ( <p>{children}</p> )
                       }
                   },
                   [BLOCKS.HEADING_3]: (node, _) => 
                    <h3 class="blog-heading" id={node.content[0].value.trim()}>{node.content[0].value}</h3>,
                   [BLOCKS.HEADING_1]: (node, _) => 
                    <h1 class="blog-heading" id={node.content[0].value.trim()}>{node.content[0].value}</h1>,
                }
            }

            const body = documentToReactComponents(rawRichTextField, options);
            
            let entry = {
                'id': post.sys.id,
                'author':post.fields.author.fields,
                'date':post.fields.date,
                'hero': `https:${post.fields.hero.fields.file.url}`,
                'category': post.fields.category,
                'title':post.fields.title,
                'tags':post.fields.tags,
                'meta': post.fields.meta,
                'body': body
            }

            dispatch({
                type: POST_ACTIONS.FETCH,
                payload: entry
            })
        })
    .catch((error) =>  {
            dispatch({
                type: POST_ACTIONS.FETCH,
                payload: { error: true }
            })
        }
    );
} 