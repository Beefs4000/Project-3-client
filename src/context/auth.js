import React, { useReducer, createContext } from "react";
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
};

// decoding token to get the expiration date
if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    // checks if expiration on token is less than current time it will be removed from local storage
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken')
        // if not expired set user to this token which is valid
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { }
})

function authReducer(state, action) {
    switch (action.type) {
        // When logging in set user data
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        // When logging out clear user data
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // when logging in, this will dispatch the data to createContext 
    function login(userData) {
        localStorage.setItem("jwtToken", userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    };

    function logout() {
        localStorage.removeItem('jwtToken');
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }