import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Header.css';
import { Avatar } from 'primereact/avatar';
function Header() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
  
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
  
    const showButton = () => {
      if (window.innerWidth <= 960) {
        setButton(false);
      } else {
        setButton(true);
      }
    };
  
    useEffect(() => {
      showButton();
    }, []);
  
    window.addEventListener('resize', showButton);
    
    const logout = () => {
      localStorage.clear();
    }

    const showButtonSigninOrUsername = () =>{
      if(localStorage.getItem('token')!==null){
        return (
          <div class="dropdown">
            <Button buttonStyle='btn--outline' class="dropbtn" >{localStorage.getItem('username')}</Button>
            <div class="dropdown-content">
              <Link to='/user/account/info' className='nav-links'>Tài khoản</Link>
              <Link to='/login' className='nav-links' onClick={logout}>Đăng xuất</Link>
            </div>
          </div>
        );
      }else{
        return (button && <Button buttonStyle='btn--outline' to={'/login'}>Đăng nhập</Button>);
      }
      
    }

    return (
      <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              GMOVIE
              <i class='fab fa-typo3' />
            </Link>
            <div className='menu-icon' onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Trang chủ
                </Link>
              </li>

              <li className='nav-item'>
                <Link
                  to='/movie/session'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Suất chiếu
                </Link>
              </li>
  
              <li>
                <Link
                  to={localStorage.getItem('token')!==null ? '/user/account/info' : '/login'}
                  className='nav-links-mobile'
                  onClick={closeMobileMenu}
                >
                  {localStorage.getItem('token')!==null ? localStorage.getItem('username') : 'Đăng nhập'}
                </Link>
              </li>
            </ul>
            {showButtonSigninOrUsername()}
          </div>
        </nav>
      </>
    );
}

export default Header
