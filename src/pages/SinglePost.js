import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Card, Grid, Form, Icon, Image, Label, Popup } from "semantic-ui-react";

import { AuthContext } from '../context/auth'
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    // blur comment box after input
    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('')

    const { data: { getPost } } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            // blur comment box after input
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading Yak....</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

        postMarkup = (
            <Grid>
            <Grid.Row>
                <Grid.Column width={2}>
                    <Image
                        src='https://www.publicdomainpictures.net/pictures/240000/velka/cartoon-yak.jpg'
                        size="small"
                        float="right" />
                </Grid.Column>
                <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{createdAt}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                        <Card.Content extra>
                            <LikeButton user={user} post={{ id, likeCount, likes }} />
                            <Popup
                                content="Yik on this Yak"
                                inverted
                                trigger={
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on Yak')}
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                }
                                />

                                {/* if logged in user matches user that created the post, render delete button */}
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                        </Card.Content>
                    </Card>
                    {user && <Card fluid>
                        <Card.Content>
                            <p>Post a Yak</p>
                            <Form>
                                <div className="ui action input fluid">
                                    <input
                                        type="text"
                                        placeholder="Yak It..."
                                        name="comment"
                                        value={comment}
                                        onChange={event => setComment(event.target.value)}
                                        ref={commentInputRef}
                                    />
                                    <button type='submit'
                                        className="ui button teal"
                                        disabled={comment.trim() === ''}
                                        onClick={submitComment}
                                    >
                                        Yak it!
                                    </button>
                                </div>
                            </Form>
                        </Card.Content>
                    </Card>}
                    {/* for each comment return an individual card */}
                    {comments.map((comment) => (
                        <Card fluid key={comment.id}>
                            <Card.Content>
                                {/* checking user is owner of comment */}
                                {user && user.username === comment.username && (
                                    <DeleteButton postId={id} commentId={comment.id} />
                                )}
                                <Card.Header>{comment.username}</Card.Header>
                                {/* TODO: find out why createdAt isnt showing */}
                                <Card.Meta>{comment.createdAt}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                    ))}
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
    return postMarkup;
}


const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id 
            comments{
                id 
                body 
                createdAt 
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id 
            body 
            createdAt 
            username 
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id 
                username 
                createdAt 
                body
            }
        }
    }
`

export default SinglePost;



