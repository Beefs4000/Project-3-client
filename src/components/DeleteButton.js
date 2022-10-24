import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/grapgql';

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Dynamic Mutation, if we have postId and commentId use COMMENT_MUTATION, else only postId use POST_MUTATION
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    // TODO: delete comment not working
    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            // If not comment Id do this function
            if(!commentId){
                // getting post data
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                // remove a post by filtering and keeping all posts that do not match this id
                data.getPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            }
            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    });
    return (
        <>
            <Popup
            content="Un-Yak with shame"
            inverted
            trigger={
                <Button 
            as="div" 
            color="red" 
            floated='right' 
            onClick={() => setConfirmOpen(true)}
            >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            }
            />
            {/* This askes the user to confirm deletion, clicks no closes the model without changing anything. 
            Clicking confirm runs the delete post mutation */}
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </>

    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;