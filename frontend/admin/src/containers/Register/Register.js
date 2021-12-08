import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';

import {Checkbox} from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { useHistory } from "react-router-dom";

function Register() {
    const toast = useRef(null);
    const [sex, setSex] = useState(true);
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            username : '',
            password : '',
            fullName : '',
            name : '',
            sex : '',
            phone : '',
            email :'',
            address : ''
        },
        validate: (data) => {
            const errors = {};
            if(!data.username.trim()){
                errors.username = 'Username không được để trống';
            }
            if(!data.password.trim()){
                errors.password = 'Password không được để trống';
            }
            if(!data.fullName.trim()){
                errors.fullName = 'Họ tên không được để trống';
            }
            if(!data.phone.trim()){
                errors.phone = 'Số điện thoại không được để trống';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            data.sex = sex;
            API.post('/api/auth/signup', data)
            .then((res) =>{
                if(res.data.ok){
                    toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message+", 3s sau sẽ được chuyển về trang đăng nhập", life: 3000});
                    setTimeout(() => { history.push("/login"); }, 3000);
                }else{
                    toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }
                
            })
            .catch((error)=>{
                if(error.response.status === 400){
                    toast.current.show({severity:'error', summary: 'Thông báo', detail: error.response.data.message, life: 3000});
                }else toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
            });
        }
    });

    return (
        <div>
        <Toast ref={toast} />
        <div className="form" style={{backgroundColor:"black"}}>
            <div className="p-d-flex">
                <div className="card">
                    <h2 className="p-text-center" style={{color:'white'}}>Đăng ký</h2>
                    <form onSubmit={formik.handleSubmit} className="p-fluid" style={{backgroundColor:"white", borderRadius: '5%'}}>
                        <div className="p-grid p-col-12">
                            <div className="p-col-12">
                                <label htmlFor="username" class="p-mb-2">Username</label>
                                <InputText id="username" value={formik.values.username} onChange={formik.handleChange} autoFocus />
                                <small className="p-error p-d-block">{formik.touched.username? formik.errors.username: ''}</small>
                            </div>
                            <div className="p-col-12">
                                <label htmlFor="password" class="p-mb-2">Password</label>
                                <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask />
                                <small className="p-error p-d-block">{formik.touched.password? formik.errors.password: ''}</small>
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
                            <div className="p-col-12">
                                <label htmlFor="email" class="p-mb-2">Email</label>
                                <InputText id="email" value={formik.values.email} onChange={formik.handleChange} autoFocus />
                                <small className="p-error p-d-block">{formik.touched.email? formik.errors.email: ''}</small>
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
                            <Button type="submit" label="Đăng ký" className="p-mt-2" style={{width:'200px'}}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Register
