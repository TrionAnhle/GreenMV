import Staffs from "./containers/Staffs/Staff";
import Movies from "./containers/Movies/Movies";
import Receipts from "./containers/Receipts/Receipt";
import Sesions from "./containers/Sessions/Session";
import Categories from "./containers/Categories/Category";
import Cinemas from "./containers/Cinemas/Cinema";
import Dashboard from "./containers/Dashboard/Dashboard";
import Account from "./containers/Account/Account"
export const navMenu = [
    {
        id: '1',
        name: 'Tổng quan',
        route: '/admin',
        Comp: Dashboard,
        role: ['ROLE_ADMIN']
    },
    {
        id: '2',
        name: 'Nhân viên',
        route: '/staff',
        Comp: Staffs,
        role: ['ROLE_ADMIN']
    },
    {
        id: '3',
        name: 'Hoá đơn',
        route: '/receipt',
        Comp: Receipts,
        role: ['ROLE_ADMIN','ROLE_STAFF']
    },
    {
        id: '4',
        name: 'Phim',
        route: '/movie',
        Comp: Movies,
        role: ['ROLE_ADMIN']
    },
    {
        id: '5',
        name: 'Suất chiếu',
        route: '/session',
        Comp: Sesions,
        role: ['ROLE_ADMIN','ROLE_STAFF']
    },
    {
        id: '6',
        name: 'Thể loại phim',
        route: '/cateogry',
        Comp: Categories,
        role: ['ROLE_ADMIN']
    },
    {
        id: '7',
        name: 'Rạp phim',
        route: '/cinema',
        Comp: Cinemas,
        role: ['ROLE_ADMIN']
    },
    {
        id: '8',
        name: '',
        route: '/account',
        Comp: Account,
        role: ['ROLE_ADMIN','ROLE_STAFF']
    }
]