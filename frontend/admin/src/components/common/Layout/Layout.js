import React from "react";
import Sidebar from "../../Sidebar/Sidebar";
import "./Layout.css";
import logo from '../../../assets/icon-web.jpg';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
function Layout(props) {
    const leftChildren = [];
    const rightChildren = [];
    const history = useHistory();

    React.Children.forEach(props.children, (child) => {
        if (child?.type === Sidebar) {
            leftChildren.push(child);
        } else {
            rightChildren.push(child);
        }
    });

    const signout = () => {
        localStorage.clear();
        window.location.href = "/login";
    }

    return (
        <div className="layout">
            <div className="layout-sidebar" style={{backgroundColor:'MenuText', color: 'white'}}>
                <div className="flex-top">
                    <div className="sidebar-head">
                        <img src={logo} style={{ width: 200, height: 50 }} />
                    </div>
                    <div className="sidebar-list"> {leftChildren}</div>
                </div>
                <div className="sidebar-bottom">
                    
                    <span className="sidebar-name">
                        <Link to='/account' style={{color:'white', textDecoration: 'none'}}>
                        <Avatar label="P" shape="circle" className='p-mr-1'/>
                            {localStorage.getItem('username')}
                        </Link>
                    </span>
                </div>
                <div className="sidebar-bottom p-mt-2" >
                    <Button label="Đăng xuất" icon="pi pi-sign-in" className="p-button-danger" style={{width:'100%'}} onClick={() => signout()}/>
                </div>
            </div>
            <div className="layout-content">{rightChildren}</div>
        </div>
    )
}

Layout.Sidebar = Sidebar;

export default Layout;
