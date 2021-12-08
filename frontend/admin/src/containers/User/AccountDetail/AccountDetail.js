import Header from '../../Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Button } from 'primereact/button';
import AccountDetailPage from '../AccountDetailPage/AccountDetailPage';
import AccountSessionPage from '../AccountSessionPage/AccountSessionPage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import API from '../../utils/request';
import { Password } from 'primereact/password';


function AccountDetail(props) {
    const history = useHistory();
    const [status, setStatus] = useState(0);
    const [displayModal,setDisplayModal] = useState(false);
    const toast = useRef(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        setStatus(props.status);
    }, [props.status])

    const logout = () => {
        localStorage.clear();
        setTimeout(() => { history.push("/login"); }, 3000);
    }


    const formik = useFormik({
        initialValues: {
            id : localStorage.getItem("id"),
            password : '',
        },
        validate: (data) => {
            const errors = {};
            if (!data.password || password == null) {
                errors.password = 'Password không được để trống';
                return errors;
            }
            if (data.password.trim() != password.trim()) {
                errors.password = 'Password và Password nhập lại chưa giống';
                return errors;
            }
            
        },
        onSubmit: (data) => {
            API.post('/api/user/customer/password', data, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    if(res.data.ok){
                        toast.current.show({severity:'success', summary: 'Thông báo', detail: "Đổi mật khẩu thành công, 3s sau sẽ tự động đăng xuất", life: 3000});
                        setDisplayModal(false);
                        logout();
                    }else{
                        toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                    }
                    
                })
                .catch((error)=>{
                    console.log(error);
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
            });
        }
    });

    const footer = (
        <div>
            <Button label={'Cập nhật'} icon="pi pi-check" onClick={formik.handleSubmit}/>
            <Button label="Huỷ" icon="pi pi-times" onClick={() =>{setDisplayModal(false);setPassword(null);formik.setFieldValue('password' , '');}}/>
        </div>
    );
    
    return (
        <div className="body-container">
            <Header/>
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-col-12 p-sm-2 p-md-2"/>
                <div className="p-col-12 p-sm-1">
                    <div className="p-grid p-mb-3"><Button icon="pi pi-user" label="Thông tin" onClick={() => history.push('/user/account/info')}
                    className="p-button-rounded p-button-info" style={{width:'100%'}}/></div>
                    <div className="p-grid p-mb-3"><Button icon="pi pi-wallet" label="Hoá đơn" onClick={() => history.push('/user/account/receipt')}
                    className="p-button-rounded p-button-info" style={{width:'100%'}}/></div>
                    <div className="p-grid p-mb-3"><Button icon="pi pi-key" label="Đổi mật khẩu" onClick={() => setDisplayModal(true)}
                    className="p-button-rounded p-button-info" style={{width:'100%'}}/></div>
                </div>
                <div className="p-col-12 p-sm-8 p-md-8" >
                    {status == 0 ? <AccountDetailPage/>:<AccountSessionPage/>}
                </div>
            </div>
            <Dialog header={'Đổi mật khẩu'} onHide={() => {setDisplayModal(false);;setPassword(null);formik.setFieldValue('password' , '');}} visible={displayModal} footer={footer}  
            breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                <form onSubmit={formik.handleSubmit} className="p-fluid">
                    <div className="p-grid">
                        <div className="p-col-6">
                            <label htmlFor="password" class="p-mb-2">Password</label>
                            <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask/>
                            <small className="p-error p-d-block">{formik.touched.password? formik.errors.password: ''}</small>
                        </div>
                        <div className="p-col-6">
                            <label htmlFor="passwordA" class="p-mb-2">Nhập lại Password</label>
                            <Password id="passwordA" name="passwordA"  value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
                            <small className="p-error p-d-block">{formik.touched.password? formik.errors.password: ''}</small>
                        </div>
                    </div>
                </form>
            </Dialog>
            <Footer/>
        </div>
    )
}

export default AccountDetail
