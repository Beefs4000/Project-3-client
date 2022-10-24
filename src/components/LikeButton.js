import React, { useEffect, useState } from 'react';
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';



function LikeButton({ user, post: { id, likeCount, likes } }) {
    // checking if user has like post
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });

    const likeButton = user ? (
        // if user has liked, heart will be filled
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
        // if not liked, heart unfilled
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        // If user not logged in heart is unfilled and if clicked redirected to login page
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        
        <Popup
            content={liked ? "Unlove this Yak" : "Love this Yak"}
            inverted
            trigger={
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label as='a' basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
            }
            />
    )
}

const LIKE_POST_MUTATION =gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton