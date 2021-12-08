import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import {Checkbox} from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { useHistory } from "react-router-dom";

function Account() {
    const [sex, setSex] = useState(true);
    const history = useHistory();
    const toast = useRef(null);
    const [displayModal,setDisplayModal] = useState(false);
    const [password, setPassword] = useState(null);


    useEffect(() => {
        API.get('/api/admin/staff/'+localStorage.getItem("id"), 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                let data = res.data.data[0];
                formik.setFieldValue('id' , data.id);
                formik.setFieldValue('fullName' , data.fullName);
                formik.setFieldValue('username' , data.username);
                setSex(data.sex);
                formik.setFieldValue('phone' , data.phone);
                formik.setFieldValue('address' , data.address);
            })
            .catch((error)=>{
                console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            id : '',
            username : '',
            fullName : '',
            sex : '',
            phone : '',
            address : ''
        },
        validate: (data) => {
            const errors = {};
            if(!data.fullName.trim()){
                errors.fullName = 'Họ tên không được để trống';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            data.sex = sex;
            API.post('/api/admin/staff', data,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
            .then((res) =>{
                if(res.data.ok){
                    toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }else{
                    toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }
                
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    });

    const logout = () => {
        localStorage.clear();
        setTimeout(() => { window.location.href = "/login";; }, 3000);
    }

    const formikP = useFormik({
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
            API.post('/api/admin/staff/password', data, 
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
            <Button label={'Cập nhật'} icon="pi pi-check" onClick={formikP.handleSubmit}/>
            <Button label="Huỷ" icon="pi pi-times" onClick={() =>{setDisplayModal(false);setPassword(null);formikP.setFieldValue('password' , '');}}/>
        </div>
    );

    return (
        <div className="p-grid p-col-12">
            <Toast ref={toast} />
            <Dialog header={'Đổi mật khẩu'} onHide={() => {setDisplayModal(false);;setPassword(null);formikP.setFieldValue('password' , '');}} visible={displayModal} footer={footer}  
            breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                <form onSubmit={formikP.handleSubmit} className="p-fluid">
                    <div className="p-grid">
                        <div className="p-col-6">
                            <label htmlFor="password" class="p-mb-2">Password</label>
                            <Password id="password" name="password" value={formikP.values.password} onChange={formikP.handleChange} toggleMask/>
                            <small className="p-error p-d-block">{formikP.touched.password? formikP.errors.password: ''}</small>
                        </div>
                        <div className="p-col-6">
                            <label htmlFor="passwordA" class="p-mb-2">Nhập lại Password</label>
                            <Password id="passwordA" name="passwordA"  value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
                            <small className="p-error p-d-block">{formikP.touched.password? formikP.errors.password: ''}</small>
                        </div>
                    </div>
                </form>
            </Dialog>
            <div style={{display: 'flex', justifyContent: 'center', flex: 1}}>
            <div className="card">
                    <h2 className="p-text-center">Thông tin cá nhân</h2>
                    <form onSubmit={formik.handleSubmit} className="p-fluid p-col-12" style={{}}>
                        <div className="p-grid p-col-12">
                            <div className="p-col-12">
                                <label htmlFor="username" class="p-mb-2">Username</label>
                                <InputText id="username" value={formik.values.username} onChange={formik.handleChange} autoFocus disabled={true}/>
                                <small className="p-error p-d-block">{formik.touched.username? formik.errors.username: ''}</small>
                            </div>
                        </div>
                        <div className="p-grid p-col-12">
                            <div className="p-col-12">
                                <label htmlFor="fullName" class="p-mb-2">Họ tên</label>
                                <InputText id="fullName" value={formik.values.fullName} onChange={formik.handleChange} autoFocus />
                                <small className="p-error p-d-block">{formik.touched.fullName? formik.errors.fullName: ''}</small>
                            </div>
                            <div className="p-col-12">
                                <label htmlFor="phone" class="p-mb-2">Số điện thoại</label>
                                <InputText id="phone" value={formik.values.phone} onChange={formik.handleChange} keyfilter="num" autoFocus maxLength={10} minLength={6}/>
                                <small className="p-error p-d-block">{formik.touched.phone? formik.errors.phone: ''}</small>
                            </div>
                        </div>
                        <div className="p-grid p-col-12">
                            <div className="p-grid p-col-12">
                                <div className="p-ml-1 p-mt-2">Giới tính</div>
                                <div className="p-col-3">
                                    <Checkbox  id="sex" onChange={() => setSex(true)} checked={sex}></Checkbox>
                                    <label htmlFor="sex" className="p-checkbox-label">Nam</label>
                                </div>
                                <div className="p-col-3">
                                    <Checkbox  id="sex" onChange={() => setSex(false)} checked={!sex}></Checkbox>
                                    <label htmlFor="sex" className="p-checkbox-label">Nữ</label>
                                </div>
                                
                            </div>
                            <div className="p-col-12">
                                    <label htmlFor="address" class="p-mb-2">Địa chỉ</label>
                                    <InputTextarea value={formik.values.address}
                                    id="address" 
                                    onChange={formik.handleChange}
                                    rows={2} cols={30} autoResize />
                            </div>
                        </div>
                        <div className="p-grid p-col-12" style={{justifyContent:'center'}}>
                            <Button type="submit" label="Cập nhật" className="p-mt-2 p-button-rounded p-button-success" style={{width:'200px'}} onClick={formik.handleSubmit}/>
                        </div>
                        <div className="p-grid p-col-12" style={{justifyContent:'center'}}>
                            <Button type="button" label="Đổi mật khẩu" className="p-mt-2 p-button-rounded p-button-danger" style={{width:'200px'}} onClick={() => setDisplayModal(true)}/>
                        </div>
                    </form>
                </div>  
                </div>
        </div>
    )
}

export default Account
