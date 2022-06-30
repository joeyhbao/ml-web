import React, {Component} from "react";
import axios from "axios"
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import Upload from './upload';
import ResultTable from './resultTable';
import {Button} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import { Col, Row } from 'antd';


class App extends Component{
    //upload multiple files
    render() {
        return (
            <>
            <Row>
                <Col span={24}>
                    <div style={{ margin: "20px" }}>
                        <h3>ML Web UI</h3>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <div style={{ margin: "20px" }}>
                    <h4>Upload Files</h4>
                    <Upload />
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ margin: "20px" }}> <h4>Result</h4>
                    <ResultTable />
                    </div>
                </Col>
            </Row>
        </>
        );
    }
}
export default App;