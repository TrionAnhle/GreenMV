import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toDateTimeString } from "../utils/date";
import { numberFormat } from "../utils/number";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { APPCONFIG } from '../utils/constants';
import { FileUpload } from 'primereact/fileupload';
import './Movie.css'; 
import {Checkbox} from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';

function Movies() {
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [listCategories, setListCategories] = useState([]);
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [isInsert, setIsInsert] = useState(true);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        reloadData();
        getAllCateogries();
    }, [])

    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };
    const getAllCateogries = () =>{
        API.get('/api/admin/category', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setListCategories(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
    }
    const wait= (ms) => {
        return new Promise( (resolve) => {setTimeout(resolve, ms)});
    }

    const reloadData = async () =>{
        API.get('/api/admin/movie', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then( await  wait(1000))
            .then((res) =>{
                setData(res.data.data);
                console.log(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
        setSelectedList({});
    }
    
    const deleteItem = () => {
        API.post('/api/admin/movie/delete', [selectedList.id], 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                if(res.data.ok){
                    toast.current.show({severity:'success', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                }else{
                    toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                }
                reloadData();
            })
            .catch((error)=>{
                console.log(error);
                toast.current.show({severity:'error', summary: 'Th??ng b??o', detail:'L???i h??? th???ng', life: 3000});
        });
    }
    const rejectFunc = () =>{

    }

    const confirm = () => {
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: 'B???n ch??a ch???n d??ng c???n xo??.', life: 3000});
        }else
            confirmDialog({
                message: 'B???n c?? mu???n xo?? - Phim: '+selectedList.name+' ? ',
                header: 'Th??ng b??o',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteItem(),
                reject: () => rejectFunc()
            });
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            description: '',
            pathVideo: '',
            screenTime: 0,
            isShowing: true,
            categoryId: '',
            pathThumbnail : '',
            base64: ''
        },
        validate: (data) => {
            const errors = {};
            if (!data.name) {
                errors.name = 'T??n phim kh??ng ???????c ????? tr???ng.';
            }
            if(isInsert && !data.base64){
                errors.pathThumbnail = '???nh ch??a ???????c upload.';
            }
            if (!data.categoryId) {
                errors.categoryId = 'Lo???i phim kh??ng ???????c thi???u.';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            data.isShowing = checked;
            API.post('/api/admin/movie', data, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    if(res.data.ok){
                        toast.current.show({severity:'success', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                        reloadData();
                        setDisplayModal(false);
                    }else{
                        toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                    }
                    
                })
                .catch((error)=>{
                    console.log(error);
                    toast.current.show({severity:'error', summary: 'Th??ng b??o', detail:'L???i h??? th???ng', life: 3000});
            });
        }
    });

    const footer = (
        <div>
            <Button label={isInsert ? 'Th??m': 'C???p nh???t'} icon="pi pi-check" onClick={formik.handleSubmit}/>
            <Button label="Hu???" icon="pi pi-times" onClick={() =>setDisplayModal(false)}/>
        </div>
    );

    const create = () =>{
        setDisplayModal(true);
        setIsInsert(true);
        formik.setFieldValue('id' , '');
        formik.setFieldValue('name' , '');
        formik.setFieldValue('description' , '');
        formik.setFieldValue('pathVideo' , '');
        formik.setFieldValue('screenTime' , 1);
        setChecked(false);
        formik.setFieldValue('categoryId' , '');

        formik.setFieldValue('pathThumbnail' , '');
        formik.setFieldValue('base64' , '');
        
    };

    const update = () =>{
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: 'B???n ch??a ch???n d??ng c???n c???p nh???t.', life: 3000});
        }else{
            setDisplayModal(true);
            setIsInsert(false);
            formik.resetForm();

            API.get('/api/admin/movie/'+selectedList.id, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    console.log(res.data.data);
                    formik.setFieldValue('id' , res.data.data[0].id);
                    formik.setFieldValue('name' , res.data.data[0].name);
                    formik.setFieldValue('description' , res.data.data[0].description);
                    formik.setFieldValue('pathVideo' , res.data.data[0].pathVideo);
                    formik.setFieldValue('screenTime' , res.data.data[0].screenTime);
                    setChecked(res.data.data[0].isShowing);
                    formik.setFieldValue('categoryId' , res.data.data[0].category[0].id);
                })
                .catch((error)=>{
                    console.log(error);
            });

            formik.setFieldValue('pathThumbnail' , '');
            formik.setFieldValue('base64' , '');
        }
    };
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };
    

    const onUpload = async (e) =>{
        

        const file = e.files[0];
        const base64 = await convertBase64(file);
        toast.current.show({severity:'success', summary: 'Th??ng b??o', detail: 'Upload ???nh th??nh c??ng', life: 3000});

        formik.setFieldValue('pathThumbnail' , e.files[0].name);
        formik.setFieldValue('base64' , base64);
    }
    
    

    const imageBodyTemplate = (rowData) => {
        return <img src={`${APPCONFIG.BASE_URL_IMAGE}${rowData.pathThumbnail}`} 
                onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                alt={rowData.pathThumbnail} style={{width: '100px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'}} />;
    }

    const statusBodyTemplate = (rowData) => {
        return ( rowData.isShowing ?
            <Button label="??ang c??ng chi???u" className="p-button-warning" /> : 
            <Button label="Kh??ng chi???u" className="p-button-info" />);
    }

    return (
        <Panel header="Danh s??ch c??c phim">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Th??m" icon="pi pi-plus" className="p-button-success" onClick={create}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="S???a" icon="pi pi-pencil" className="p-button-info" onClick={update}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Xo??" icon="pi pi-times" className="p-button-danger" onClick={confirm}/>
                </div>
            </div>
            <div className="p-grid">
                <Dialog header={isInsert ? 'Th??m m???i' : 'C???p nh???t'} maximizable onHide={() => setDisplayModal(false)} visible={displayModal} footer={footer}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-grid">
                            <div className="p-field p-mt-4 p-col-6 ">
                                { !isInsert ?(
                                    <div className="p-grid p-mb-5" >
                                        <img src={`${APPCONFIG.BASE_URL_IMAGE}${selectedList.pathThumbnail}`}  className="p-mt-3 p-mb-3 center-image"
                                            alt={selectedList.pathThumbnail} style={{width: '200px', height: 'auto', 
                                                                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'}} />
                                    </div>
                                ): ""}
                                <div className="p-grid p-mr-1 p-ml-1">
                                    <small className="p-error p-d-block">{formik.touched.pathThumbnail? formik.errors.pathThumbnail: ''}</small>
                                    <FileUpload name="demo" url="https://primefaces.org/primereact/showcase/upload.php" 
                                        uploadOptions={false}  style={{width: '100%'}}
                                        onUpload={onUpload}  accept="image/*" maxFileSize={1000000}
                                        emptyTemplate={<p className="p-m-0">K??o th??? ???nh v??o ????y ????? upload</p>} />
                                </div>
                            </div>
                            <div className="p-field p-mt-4 p-col-6">
                                <div className="p-grid">
                                    <div className='p-col-12'>
                                        <label htmlFor="name" class="p-mb-2">T??n phim</label>
                                        <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus />
                                        <small className="p-error p-d-block">{formik.touched.name? formik.errors.name: ''}</small>
                                    </div>
                                </div>
                                <div className="p-grid p-mt-3">
                                    <div className='p-col-12'>
                                        <label htmlFor="pathVideo" class="p-mb-2">Link video youtube</label>
                                        <InputText id="pathVideo" value={formik.values.pathVideo} onChange={formik.handleChange} autoFocus />
                                    </div>
                                </div>
                                <div className="p-grid p-mt-3">
                                    <div className='p-col-12'>
                                        <label htmlFor="categoryId" class="p-mb-2">Th??? lo???i</label>
                                        <Dropdown
                                            id="categoryId"
                                            name="categoryId"
                                            placeholder={'Ch???n lo???i phim'}
                                            options={listCategories}
                                            optionLabel="name"
                                            optionValue="id"
                                            {...formik.getFieldProps('categoryId')}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                            }}
                                            className="p-inputtext-sm"
                                        />
                                        
                                        <small className="p-error p-d-block">{formik.touched.categoryId? formik.errors.categoryId: ''}</small>
                                    </div>
                                </div>
                                <div className="p-grid p-mt-3">
                                    <div className='p-col-6'>
                                        <label htmlFor="screenTime" class="p-mb-2">Th???i l?????ng phim(ph??t)</label>
                                        <InputNumber id="screenTime" name="screenTime" value={formik.values.screenTime} 
                                        onValueChange={formik.handleChange} mode="decimal" autoFocus showButtons min={1}/>
                                    </div>
                                    <div className='p-col-6 p-mt-5'>
                                        <Checkbox  id="isShowing" onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                                        <label htmlFor="isShowing" className="p-checkbox-label"> ??ang c??ng chi???u</label>
                                    </div>
                                </div>
                                <div className="p-grid p-mt-3">
                                    <div className="p-col-12">
                                        <label htmlFor="description" className="p-checkbox-label">M?? t???</label>
                                        <InputTextarea value={formik.values.description}
                                        id="description" 
                                        onChange={formik.handleChange}
                                        rows={5} cols={30} autoResize />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
            <div className="datatable-templating-demo">
                <div className="card">
                    <DataTable value={data} paginator rows={3} scrollable scrollHeight="500px"
                        selection={selectedList} 
                        onSelectionChange={setSelectedRowCustomize} 
                        selectionMode="single" 
                        dataKey="id"
                        stateStorage="local" 
                        stateKey="dt-state-demo-local"
                        emptyMessage="Kh??ng c?? phim n??o n??o">
                        <Column header="???nh" body={imageBodyTemplate}></Column>    
                        <Column field="name" header="T??n phim" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="screenTime" header="Th???i l?????ng" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="isShowing" header="Tr???ng th??i" sortable body={statusBodyTemplate}></Column>
                       
                        <Column field="createdDate" header="Ng??y t???o" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="createdBy" header="Ng?????i t???o" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateDate" header="Ng??y c???p nh???t" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateBy" header="Ng?????i c???p nh???t" sortable filter filterPlaceholder="Search by name"></Column>
                    </DataTable>
                </div>
            </div>
        </Panel>
    )
}

export default Movies
