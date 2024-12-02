import React, { useState } from 'react';
import { Button, Col, Dropdown, InputNumber, Layout, Row, Table, Typography } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Key } from 'antd/es/table/interface';

interface DataType {
    key: React.Key;
    countryName: string;
    region: string;
    L1: string;
    L2: string;
    metric: string;
    unit: string;
    value: number;
}


const Main: React.FC = () => {
    const [editingKey, setEditingKey] = useState<Key | null>(null);
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            ),
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Country Name',
            width: 150,
            dataIndex: 'countryName',
            key: 'countryName',
            fixed: 'left',
            render: (_, record) => {
                return (
                    <div>{record.countryName}</div>
                )
            }
        },
        {
            title: 'Region',
            width: 150,
            dataIndex: 'region',
            key: 'region',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            record.key === editingKey ?
                                (
                                    <Dropdown className='shadow-inner rounded'
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {React.cloneElement(menu as React.ReactElement)}
                                                <Row className='bg-[#ffff00]'>Add L2</Row>
                                            </div>
                                        )}
                                    >
                                        <div className='p-3'>{record.region}</div>
                                    </Dropdown>
                                ) :
                                (
                                    <div className='p-3'>{record.region}</div>
                                )

                        }
                    </Row>
                )
            }
        },
        {
            title: 'L1',
            dataIndex: 'L1',
            key: '1',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            record.key === editingKey ?
                                (
                                    <Dropdown className='shadow-inner rounded'
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {React.cloneElement(menu as React.ReactElement)}
                                                <Row className='bg-[#ffff00]'>Add L1</Row>
                                            </div>
                                        )}
                                    >
                                        <div className='p-3'>{record.L1}</div>
                                    </Dropdown>
                                ) :
                                (
                                    <div className='p-3'>{record.L1}</div>
                                )

                        }
                    </Row>
                )
            }
        },
        {
            title: 'L2',
            dataIndex: 'L2',
            key: '2',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            record.key === editingKey ?
                                (
                                    <Dropdown className='shadow-inner rounded'
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {React.cloneElement(menu as React.ReactElement)}
                                                <Row className='bg-[#ffff00]'>Add L2</Row>
                                            </div>
                                        )}
                                    >
                                        <div className='p-3'>{record.L2}</div>
                                    </Dropdown>
                                ) :
                                (
                                    <div className='p-3'>{record.L2}</div>
                                )

                        }
                    </Row>
                )
            }
        },
        {
            title: 'metric',
            dataIndex: 'metric',
            key: '3',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            record.key === editingKey ?
                                (
                                    <Dropdown className='shadow-inner rounded'
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {React.cloneElement(menu as React.ReactElement)}
                                                <Row className='bg-[#ffff00]'>Add Metric</Row>
                                            </div>
                                        )}
                                    >
                                        <div className='p-3'>{record.metric}</div>
                                    </Dropdown>
                                ) :
                                (
                                    <div className='p-3'>{record.metric}</div>
                                )

                        }
                    </Row>
                )
            }
        },
        {
            title: 'unit',
            dataIndex: 'unit',
            key: '3',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            record.key === editingKey ?
                                (
                                    <Dropdown className='shadow-inner rounded'
                                        menu={{ items }}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {React.cloneElement(menu as React.ReactElement)}
                                                <Row className='bg-[#ffff00]'>Add Unit</Row>
                                            </div>
                                        )}
                                    >
                                        <div className='p-3'>{record.unit}</div>
                                    </Dropdown>
                                ) :
                                (
                                    <div className='p-3'>{record.unit}</div>
                                )

                        }
                    </Row>
                )
            }
        },
        {
            title: 'value',
            dataIndex: 'value',
            width: 120,
            key: '4',
            render: (_, record) => {
                return (
                    <Row>
                        {
                            editingKey === record.key ? 
                            <InputNumber value={record.value} onChange={(e) => e?.valueOf() ? record.value = JSON.parse(e.toString()) : null}></InputNumber>
                            : <div>{record.value}</div>
                        }
                    </Row>
                )
            },
            sorter: (a, b) => a.value - b.value,

        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 140,
            render: (_, record) => {
                return (
                    <Row className='gap-1 w-full'>
                        {
                            editingKey === record.key ? (
                                <Row className='gap-1'>
                                <Button className='w-[30px]'>
                                    <CheckOutlined className='text-[#00ff00]'></CheckOutlined>
                                </Button>
                                <Button className='w-[30px]' onClick={() => setEditingKey(null)}>
                                    <CloseOutlined className='text-[#ff1a1a]'></CloseOutlined>
                                </Button>
                                </Row>
                            ) : (
                                <Button className='w-[30px]' onClick={() => setEditingKey(record.key)}>
                                    <EditOutlined></EditOutlined>
                                </Button>
                            )
                        }
                        <Button className='w-[30px]'>
                            <DeleteOutlined></DeleteOutlined>
                        </Button>
                    </Row>
                )
            },
        },
    ];

    const dataSource: DataType[] = [
        { key: '1', countryName: 'UK', region: "United Kingdom", L1: "Industry Size", L2: "Acommodation", metric: "Industry Turnover", unit: 'unit', value: 31 },
        { key: '2', countryName: 'US', region: "United States", L1: "Industry Size", L2: "Acommodation", metric: "Industry Turnover", unit: 'unit', value: 32 },
    ];

    return (
        <Layout className='h-screen items-center bg-transparent'>
            <Col className='pt-[20px] w-[90%] justify-center'>
                <Row className="w-full justify-center h-[20%]">
                    <Typography.Text className='text-4xl underline'>
                        Country Data
                    </Typography.Text>
                </Row>
                <Table<DataType>
                    className="rounded-xl shadow"
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                    rowHoverable={false}
                    rowClassName={(record) => editingKey === record.key ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc]" : ""}
                    scroll={{ x: 'max-content' }}
                />
            </Col>
        </Layout>
    );
};

export default Main;