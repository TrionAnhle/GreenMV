import React, { useState } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import './Sidebar.css';

function Sidebar({ title, active, subMenu, route, onActive }) {
    const history = useHistory();
    const [toggle, setToggle] = useState(false);

    return (
        <div className="sidebar-wrapper">
            <div onClick={() => { 
                if (subMenu) { setToggle(!toggle); } 
                else history.push(route); 
                onActive() }} 
                className={classNames('sidebar-item', { ['item-active']: active })}>{title}</div>
            {toggle && subMenu && subMenu.map(({ id, title: _title, route: r }) => (
                <div onClick={() => history.push(r)} className="sub-menu" key={id}>{_title}</div>
            ))}
        </div>

    )
}

export default Sidebar;
