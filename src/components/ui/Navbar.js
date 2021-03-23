import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth'
import { eventLogout } from '../../actions/events';

export const Navbar = () => {

    const {name} = useSelector( state => state.auth );

    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.clear()
        dispatch( eventLogout() )
        dispatch( logout() )
    }
    
    return (
        <div className="navbar navbar-dark bg-dark mb-4">
            <span className="navbar-brand">
                {name}
            </span>
            <button className="btn btn-outline-danger">
                <i className="fas fa-sign-out-alt"> </i>
                <span
                    onClick={handleLogout}
                > Logout</span>
            </button>
        </div>
    )
}
