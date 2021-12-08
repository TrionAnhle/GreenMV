import React, { useState,useRef } from 'react';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import './Login.css';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Redirect } from 'react-router';
import API from '../utils/request'
import { useHistory } from "react-router-dom";

const Login = () =>{
    const [formData, setFormData] = useState({});
    const toast = useRef(null);
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validate: (data) => {
            let errors = {};

            if (!data.username) {
                errors.username = 'Username không được để trống.';
            }

            if (!data.password) {
                errors.password = 'Password không được để trống';
            }
            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            formik.resetForm();
            API.post('/api/auth/signin', data).then((res) => {
                localStorage.setItem('username',res.data.username);
                localStorage.setItem('id',res.data.id);
                localStorage.setItem('token',res.data.token);
                localStorage.setItem('role',res.data.roles[0]);
                if(res.data.roles[0] ==='ROLE_ADMIN' || res.data.roles[0] === 'ROLE_STAFF'){
                    history.push("/admin");
                }else{
                    history.push("/");
                }
            })
            .catch((error) => {
                if(error.response.status === 401){
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Username hoặc Password không đúng', life: 3000});
                }else if(error.response.status === 400){
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Tài khoản bị khoá', life: 3000});
                }else{
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống đăng nhập lại', life: 3000});
                }
            });
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    return (
        <div>
        <Toast ref={toast} />
        <div className="form" style={{backgroundColor:"black"}}>
            <div className="p-d-flex p-jc-center">
                <div className="card">
                    <h2 className="p-text-center" style={{color:'white'}}>Đăng nhập</h2>
                    <form onSubmit={formik.handleSubmit} className="p-fluid" style={{backgroundColor:'black'}}>
                        <div className="p-field">
                            <span className="p-float-label">
                                <InputText id="username" name="username" value={formik.values.username} onChange={formik.handleChange} autoFocus />
                                <label htmlFor="username" className={classNames({ 'p-error': isFormFieldValid('username') })}>Username</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="p-field">
                            <span className="p-float-label">
                                <InputText type="password" id="password" name="password" value={formik.values.password} onChange={formik.handleChange} autoFocus />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button type="submit" label="Đăng nhập" className="p-mt-2" />
                        <div className="p-grid p-mt-3" style={{justifyContent:'center'}}>
                            <a href="/register" style={{color:'white'}}>Chưa có tài khoản, Đăng ký</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Login;
