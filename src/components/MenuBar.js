import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function MenuBar() {
    // Each menu item has a name='', if set to true nav link will be highlighted
    const { user, logout } = useContext(AuthContext);
    const pathname = window.location.pathname;

    const path = pathname === '/' ? 'home' : pathname.substring(1);
    const [activeItem, setActiveItem] = useState(path);


    const handleItemClick = (e, { name }) => setActiveItem(name);

    // menubar, if user is logged in show user name and logout. Otherwise show Home, Login and register
    const menuBar = user ? (

        
        <Menu pointing secondary size='massive' color='teal'>

            <Menu.Item
                name={user.username}
                active
                as={Link}
                to="/"
            />

            <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    onClick={logout}
                />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary size='massive' color='teal'>

            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to="/"
            />

            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/login"
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/register"
                />
            </Menu.Menu>
        </Menu>
    )

    return menuBar;

}

export default MenuBar