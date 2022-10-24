import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'


function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://www.publicdomainpictures.net/pictures/240000/velka/cartoon-yak.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{createdAt}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                    content="Yik on this Yak"
                    inverted
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comment' />
                            </Button>
                            <Label as='a' basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                />
                {/* if logged in user matches post, they can delete post */}
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )


}

export default PostCard