import React, {useState} from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Upload, Space, Row, Col} from 'antd';
import axios from "axios";
import {updateFileList} from "antd/lib/upload/utils";


// const SERVER_URL = 'http://localhost:8000';
// const UPLOAD_URL = '${SERVER_URL}/upload';

const App = () => {
    const [fileList, setFileList] = useState([]);
    const props = {
        action: 'api/upload',
        multiple: true,
        onChange({ file, fileList, event }) {
            // if (file.status === 'uploading') {
            //     console.log(file, fileList);
            //     // file.status = 'done';
            // }
            file.status ='done';
            let newFileList = [...fileList];
            setFileList(newFileList);
        },
    }
    const handleClear = async () => {
        await axios.get('api/clear')
            .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        setFileList([]);
                    }
                }
            )
    }


    return (
        // <Space align="start" size={'large'}>
        <Row>
            <Col span={6}>
                <Upload {...props} fileList={fileList}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Col>
            <Col span={4}>
                <Button icon={<DeleteOutlined />} onClick={handleClear}>Clear all</Button>
            </Col>
        </Row>
        // </Space>

);
}




export default App;