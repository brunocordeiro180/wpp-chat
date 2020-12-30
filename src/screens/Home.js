import React, { useState } from 'react';
import Main from '../components/Main/Main';
import MainNavigation from '../components/MainNavigation/MainNavigation';

const Home = () => {

    return (
    <div id="home">
        <MainNavigation />
        <Main/>
    </div>
    )
}

export default Home;
