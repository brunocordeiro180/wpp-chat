import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import './MainNavigation.css';
import { BiHomeAlt } from 'react-icons/bi';
import { MdShowChart, MdChatBubbleOutline } from 'react-icons/md';
import { FiInbox, FiBox } from 'react-icons/fi';
import { BsBarChartFill, BsBook } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

const MainNavigation = ( ) => {

  const [collapse, setCollapse] = useState(false)

  let className = 'ember-view sidenav';
  let classNameSideItem ='side-text';
  className = collapse ? className += ' collapse' : className;
  classNameSideItem = !collapse ? classNameSideItem += ' hide' : classNameSideItem;

  return (
    <div id="main-nav" className={className}>
          <a className="side-item" onClick={ () => setCollapse(!collapse) }>
            <GiHamburgerMenu className="side-icon"/>
          </a>
          <div style={{ marginTop: "100px"}}>
            <Link className="side-item" to="/">
              <BiHomeAlt className="side-icon" />
              <span className={classNameSideItem}>Home</span>
            </Link>
            <a className="side-item">
              <MdShowChart className="side-icon"/>
              <span className={classNameSideItem}>Monitoramento</span>
            </a>
            <a className="side-item">
              <MdChatBubbleOutline className="side-icon" />
              <span className={classNameSideItem}>Bate-papos ativos</span>
            </a>
            <a className="side-item">
              <FiInbox className="side-icon"/>
              <span className={classNameSideItem}>Mensagens</span>
            </a>
            <a className="side-item">
              <BsBook className="side-icon"/>
              <span className={classNameSideItem}>Base</span>
            </a>
            <a className="side-item">
              <BsBarChartFill className="side-icon"/>
              <span className={classNameSideItem}>Relatórios</span>
            </a>
            <a className="side-item">
              <FiBox className="side-icon"/>
              <span className={classNameSideItem}>Complementos</span>
            </a>
          </div>
    </div>
  )
}

export default MainNavigation;