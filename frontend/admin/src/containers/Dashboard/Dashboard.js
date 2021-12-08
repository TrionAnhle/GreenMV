import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';
import React, { useState,useEffect } from 'react';
import { numberFormat } from "../utils/number";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import API from '../utils/request';
function Dashboard() {
    const [data, setData] = useState({});
    const { promiseInProgress } = usePromiseTracker();
    const [multiAxisData, setMultiAxisData] =useState({});

    useEffect(() => {
        trackPromise(API.get('/api/admin/dashboard',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }}))
        .then((res) =>{
            setData(res.data);
            addDataLineChart(res.data);
        });
        
    }, [])

    const addDataLineChart = (data) =>{
        let label = [];
        for(let i = 1 ; i <= data?.newCustomerEachMonth?.length ; i++)
            label.push('Tháng '+i);
        let datasets = [{
            label: 'Doanh thu',
            fill: false,
            borderColor: '#42A5F5',
            yAxisID: 'y',
            tension: .4,
            data: data?.profitEachMonth
        }, {
            label: 'Người dùng',
            fill: false,
            borderColor: '#00bb7e',
            yAxisID: 'y1',
            tension: .4,
            data: data?.newCustomerEachMonth
        }]
        setMultiAxisData({
            labels : label,
            datasets : datasets
        });
    }


    const getLightTheme = () => {
        let multiAxisOptions = {
            stacked: false,
            maintainAspectRatio: false,
            aspectRatio: .6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: '#ebedef'
                    }
                }
            }
        };

        return {
            multiAxisOptions
        }
    }

    const { multiAxisOptions} = getLightTheme();

    return (
        <>
        {promiseInProgress ? <h2>Loading</h2> : 
        <Panel header="Thống kê" style={{width:'100%', justifyContent:'center'}}>
            <div className="p-grid" style={{justifyContent:'center'}} >
                <div className="p-col">
                    <Card title="Doanh thu" style={{ width: '30rem', marginBottom: '2em' }}>
                        {numberFormat(data?.profitMonth)} VND
                    </Card>
                </div>
                <div className="p-col">
                    <Card title="Số vé bán" style={{ width: '30rem', marginBottom: '2em' }}>
                        {numberFormat(data?.ticketBookedMonth)}
                    </Card>
                </div>
                <div className="p-col">
                    <Card title="Người dùng" style={{ width: '30rem', marginBottom: '2em' }}>
                        {numberFormat(data?.newCustomer)}
                    </Card>
                </div>
            </div>    
            <div className="p-grid p-col-12" style={{width:'100%'}}>
                <div className="card" style={{width:'100%'}}>
                    <h5>Thống kê</h5>
                    <Chart type="line" data={multiAxisData}  options={multiAxisOptions} />
                </div>
            </div>
        </Panel>}
        </>
    )
}

export default Dashboard
