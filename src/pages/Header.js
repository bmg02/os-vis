import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './Header.scss';
import { HeaderImage } from '../components';

function Header() {

    return (
        <AppBar position='sticky'>
            <Toolbar variant='dense'>
                <div className='header-image-div'>
                    <HeaderImage />
                </div>
                <Typography variant='h4'>OS-VIS</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;