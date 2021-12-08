import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Login from './containers/Login/Login';
import Register from "./containers/Register/Register"
import Home from './containers/Home/Home';
import Page404 from './containers/Page404/Page404'
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import React, { useState,useEffect } from 'react';
import UserHome from './containers/User/UserHome/UserHome';
import UserMovieDetail from './containers/User/UserMovieDetail/UserMovieDetail'
import UserSession from './containers/User/UserSession/UserSession';
import UserSessionDetail from './containers/User/UserSessionDetail/UserSessionDetail';
import AccountDetail from './containers/User/AccountDetail/AccountDetail';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isChose, setIsChose] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token === null){
      setIsLogin(false);
    }else{
      setIsLogin(true);
    }
  }, [localStorage.getItem('token')]);

   

  return (
    <Router>
      <Switch>
        {/* Route Public */}
        <Route exact path={'/'}><UserHome/> </Route>
        <Route exact path={'/movie/detail/:id'}><UserMovieDetail /> </Route>
        <Route exact path={'/movie/session'}><UserSession /> </Route>
        <Route exact path={'/movie/session/:id'}><UserSessionDetail /> </Route>
        <Route exact path={'/user/account/info'}><AccountDetail  status={0}/> </Route>
        <Route exact path={'/user/account/receipt'}><AccountDetail status={1} /> </Route>
        <Route exact path={'/page404'}><Page404 /></Route>
        {/* Router Admin */}
        <Route exact path={'/login'}><Login/></Route>
        <Route exact path={'/register'}><Register/></Route>
        <Route exact path={'/admin'}><Home active={1}/></Route>
        <Route exact path={'/staff'}><Home active={2}/></Route>
        <Route exact path={'/receipt'}><Home active={3}/></Route>
        <Route exact path={'/movie'}><Home active={4}/></Route>
        <Route exact path={'/session'}><Home active={5}/></Route>
        <Route exact path={'/cateogry'}><Home active={6}/></Route>
        <Route exact path={'/cinema'}><Home active={7}/></Route>
        <Route exact path={'/account'}><Home active={8}/></Route>
      </Switch>
    </Router>
  );
}

export default App;
