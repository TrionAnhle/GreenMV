import React, { useEffect, useState } from 'react';
import Layout from "../../components/common/Layout/Layout";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { navMenu } from "../../routes";
import API from '../utils/request'
import { useHistory } from "react-router-dom";

const getRoutes = () => {
    return navMenu.map(({ id, route, Comp, role }) => (
        role.includes(localStorage.getItem('role')) &&
        <Route key={id} exact path={route}>
            <Comp />
        </Route>
    ))
}

const Home = (props) => {

    const [active, setActive] = useState('');
    const history = useHistory();

    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    useEffect(() => {
        if(localStorage.getItem('token') === '' || localStorage.getItem('role') === 'ROLE_USER'){
            history.push("/login");
        }
        else{
            API.get('/api/admin/category', 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}).catch((error)=>{
                if(!error.response){
                    history.push("/page404");
                }
                else{
                    if(error.response.status === 401){
                        history.push("/login");
                    }
                }
            });
        }
    }, [])

    return (
        <Router>
            <Layout>
                {navMenu.map(({ id, route, name, subMenu, role }) => (
                    role.includes(localStorage.getItem('role')) &&
                    <Layout.Sidebar
                        key={id}
                        route={route}
                        title={name}
                        subMenu={subMenu}
                        to={route}
                        active={id === active}
                        onActive={() => setActive(id)} />
                ))}
                <Switch>{getRoutes()}</Switch>
            </Layout>
        </Router>
    )
}

export default Home;
