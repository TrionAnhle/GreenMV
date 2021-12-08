import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toDateTimeString } from "../utils/date";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import QrReader from 'react-qr-reader'

export default function Receipt() {
    const [result, setResult] = useState('Not Found');
    
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [tickets,setTickets] = useState([]);
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);

 
   

    useEffect(() => {
        reloadData();
    }, [])


    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };

    const reloadData =  () =>{
        API.get('/api/admin/receipt', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setData(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
        setSelectedList({});
    }
    
    

    const statusBodyTemplate = (rowData) => {
        return ( rowData.isGetTicket == 0 ?
            <Button label="CHƯA LẤY" className="p-button-warning" /> : 
            <Button label="ĐÃ LẤY" className="p-button-success" />);
    }

    const statusPaymentType = (rowData) => {
        return (rowData.paymentType == 0 ? 'Tiền mặt' : 'Qua Thẻ');
    }

    const handleScan = data => {
        if (data) {
          setResult(data);
        }
      }
    const handleError = err => {
        console.error(err)
    }

    const getListTicket = async () =>{
        API.get('/api/admin/receipt/'+result, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setTickets(res.data.data[0]);
            })
            .catch((error)=>{
                console.log(error);
        });
    }

    const showListTicket = () =>{

        console.log(tickets);
        if(JSON.stringify(tickets) === '{}' || !tickets.tickets)
            return <h2 style={{textAlign:'center'}}>Chưa có dữ liệu</h2>
            console.log(tickets.tickets);

        let elmItem = tickets.tickets.map((ele, key)=>{
            return(
                <div className='p-grid' >
                    <div className='p-col-2'>{ele.seatId}</div>
                    <div className='p-col-3'>{ele.movie}</div>
                    <div className='p-col-2'>{ele.cinema}</div>
                    <div className='p-col-5'>{toDateTimeString(ele.showTime)}</div>
                </div>)
            
        });
        
        const getTickets = () =>{
            setTickets({
                ...tickets,
                isGetTicket : true
            });
            API.post('/api/admin/receipt/status', { id  : result}, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    if(res.data.ok){
                        toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                        reloadData();
                        setDisplayModal(false);
                    }else{
                        toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                    }
                    
                })
                .catch((error)=>{
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
            });
        }

        return ( 
            <div className='p-gird'>
                <div className='p-grid'>{tickets.isGetTicket  ? <Button label="ĐÃ LẤY" className="p-button-success"/> :
                                                                <Button label="CHƯA LẤY" className="p-button-warning" onClick={getTickets}/>}</div>
                <div className='p-grid p-mt-2' >
                    <div className='p-col-2'>Ghế</div>
                    <div className='p-col-3'>Tên Phim</div>
                    <div className='p-col-2'>Rạp số</div>
                    <div className='p-col-5'>Ngày giờ</div>
                </div>
                {elmItem}
            </div>
        );
    }

    return (
        <Panel header="Danh sách các phim">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Quét mã" icon="pi pi-print" className="p-button-success" onClick={() => {setDisplayModal(true);setResult('Not Found');setTickets({});}}/>

                   
                

                </div>
            </div>
            <div className="p-grid">
                <Dialog header={'Quét mã'} maximizable onHide={() => {setDisplayModal(false);setResult('Not Found');setTickets({});
                    }} visible={displayModal}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <div className="p-grid">    
                        <div className="p-col-6">
                            <QrReader
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="p-col-6">
                            <div className='p-grid'>
                                <div className="p-col-8"><h3>Mã Hoá Đơn: {result}</h3></div>
                                <div className="p-col-4 p-mt-3"><Button label="Nhận vé" className="p-button-success" onClick={() => getListTicket()}/></div>
                            </div>
                            {showListTicket()}
                        </div>
                    </div>
                    
                </Dialog>
            </div>
            <div className="datatable-templating-demo">
                <div className="card">
                    <DataTable value={data} paginator rows={10} scrollable scrollHeight="500px"
                        selection={selectedList} 
                        onSelectionChange={setSelectedRowCustomize} 
                        selectionMode="single" 
                        dataKey="id"
                        stateStorage="local" 
                        stateKey="dt-state-demo-local"
                        emptyMessage="Không có hoá đơn nào">
                        <Column field="id" header="Mã hoá đơn" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="customerName" header="Tên người đặt" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="customerPhone" header="Số điện thoại" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="paymentType" header="Hình thức thanh toán" body={statusPaymentType} sortable ></Column>
                        <Column field="isGetTicket" header="Trạng thái" sortable body={statusBodyTemplate}></Column>
                        <Column field="paymentDate" header="Ngày thanh toán" body={(rowData) => toDateTimeString(rowData.paymentDate)} sortable ></Column>

                        <Column field="createdDate" header="Ngày tạo" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable ></Column>
                        <Column field="createdBy" header="Người tạo" sortable  filterPlaceholder="Search by name"></Column>
                        <Column field="updateDate" header="Ngày cập nhật" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable  ></Column>
                        <Column field="updateBy" header="Người cập nhật" sortable  filterPlaceholder="Search by name"></Column>
                    </DataTable>
                </div>
            </div>
        </Panel>
    )
}
