import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './Header.scss';
import { HeaderImage } from '../components';

function Header() {

    return (
        <AppBar position='sticky'>
            <Toolbar variant='dense'>
                <Link to='/'><Typography variant='h4'>OS-VIS</Typography></Link>
                {/* <div className='header-image-div'>
                    <Link to='/'><HeaderImage /></Link>
                </div> */}
            </Toolbar>
        </AppBar>
    );
}

export default Header;