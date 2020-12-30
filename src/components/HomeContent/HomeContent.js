import React, { Fragment } from 'react'
import LineGraph from '../Charts/LineGraph';
import ListCards from '../DataCards/ListCards';

const HomeContent = ({ clientsLength,contactsLength, hostDevice }) => {

    return(
        <Fragment>
            <ListCards clientsLength={clientsLength} contactsLength={contactsLength} hostDevice={ hostDevice }/>
            <LineGraph hostDevice={ hostDevice }/>
        </Fragment>
    );
}

export default HomeContent;