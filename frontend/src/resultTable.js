import 'antd/dist/antd.css';
import './index.css';

import axios from "axios";
import { Button, Form, Input, Popconfirm, Table, Space } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Excel from 'exceljs';
import * as FileSaver from 'file-saver';



const App = () => {
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(0);

    const columns = [
        {title: 'name', dataIndex: 'name', key: 'name'},
        {title: 'Img', dataIndex: 'dir', key: 'dir', render: (record) =>
                <img src={record} width="40px" alt=""/> },
        {title: '1st Pred', dataIndex: 'pred1', key: 'pred1'},
        {title: '1st Confi', dataIndex: 'confi1', key: 'confi1'},
        {title: '2nd Pred', dataIndex: 'pred2', key: 'pred2'},
        {title: '2nd Confi', dataIndex: 'confi2', key: 'confi2'},
        {title: '3rd Pred', dataIndex: 'pred3', key: 'pred3'},
        {title: '3rd Confi', dataIndex: 'confi3', key: 'confi3'},
    ];

    // const handleAdd = () => {
    //     const newData = {
    //         key: count,
    //         name: `Edward King ${count}`,
    //         age: '32',
    //         address: `London, Park Lane no. ${count}`,
    //     };
    //     setDataSource([...dataSource, newData]);
    //     setCount(count + 1);
    // };
    //
    // const handleSave = (row) => {
    //     const newData = [...dataSource];
    //     const index = newData.findIndex((item) => row.key === item.key);
    //     const item = newData[index];
    //     newData.splice(index, 1, { ...item, ...row });
    //     setDataSource(newData);
    // };

    const handleUpdate = async () => {
        await axios.get('api/result')
            .then(res => {
                console.log(res.data);
                setDataSource(res.data);
            }
        )
    }
    // const handleDownload = async () => {
    //     await axios.get('http://localhost:8000/download_result')
    //         .then(res => {
    //             console.log(res.data);
    //         }
    //     )
    // }
    const handleDownload = async () => {
        await axios.get('api/result').then(
            res => {
                const workbook = new Excel.Workbook();
                workbook.creator = 'Web';
                workbook.lastModifiedBy = 'Web';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.lastPrinted = new Date();
                const worksheet = workbook.addWorksheet('Sheet 1');
                worksheet.columns = [
                    {header: 'name', key: 'name', width: 10},
                    {header: 'pred1', key: 'pred1', width: 10},
                    {header: 'confi1', key: 'confi1', width: 10},
                    {header: 'pred2', key: 'pred2', width: 10},
                    {header: 'confi2', key: 'confi2', width: 10},
                    {header: 'pred3', key: 'pred3', width: 10},
                    {header: 'confi3', key: 'confi3', width: 10},
                ];
                worksheet.addRows(res.data);
                console.log(workbook.xlsx)
                workbook.xlsx.writeBuffer().then((data) => {
                    const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
                    // Given name
                    FileSaver.saveAs(blob, 'download.xlsx');
                });
            }
        )
    }

    return (
        <div>
            <Space>
                <Button
                    onClick={handleUpdate}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    get result
                </Button>
                <Button
                    onClick={handleDownload}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    download result
                </Button>
            </Space>
            <Table
                dataSource={dataSource}
                columns={columns}
                scroll={{
                    y: 400,
                }}
            />
        </div>
    );
};

export default App;

