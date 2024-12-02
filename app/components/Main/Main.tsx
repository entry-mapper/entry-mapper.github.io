import React, { useState } from 'react';
import { Button, Card, Col, Dropdown, InputNumber, Layout, Row, Select, Table, Typography } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Key } from 'antd/es/table/interface';
import { useAuthContext } from '@/app/context/auth.context';

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
    const {logout} = useAuthContext();
    const [editingKey, setEditingKey] = useState<Key | null>(null);
    const regions = [
        {
            key: '1',
            label: 'United Kingdom'
        }
    ]
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
                                    <Select
                                        showSearch
                                        value={record.region}
                                        placeholder="Select a region"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map((value) => (
                                            { value: value.key, label: value.label }
                                        ))}
                                    />
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
                                    <Select
                                        showSearch
                                        value={record.L1}
                                        placeholder="Select a L1"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map((value) => (
                                            { value: value.key, label: value.label }
                                        ))}
                                    />
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
                                    <Select
                                        showSearch
                                        value={record.L1}
                                        placeholder="Select a L1"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map((value) => (
                                            { value: value.key, label: value.label }
                                        ))}
                                    />
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
                                    <Select
                                        showSearch
                                        value={record.L1}
                                        placeholder="Select a L1"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map((value) => (
                                            { value: value.key, label: value.label }
                                        ))}
                                    />
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
                                    <Select
                                        showSearch
                                        value={record.L1}
                                        placeholder="Select a L1"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map((value) => (
                                            { value: value.key, label: value.label }
                                        ))}
                                    />
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
        <Row className="w-full h-[100px] bg-zinc-600 justify-between items-center pl-[20px] pr-[20px]">
            <div className="text-[30px] font-['Inter']">Admin Portal</div>
            <Button className="text-[15px] font-['Inter'] text-white bg-black hover:!bg-zinc-600 hover:!text-white" onClick={logout}>Logout</Button>
          </Row>

            <Col className='pt-[20px] w-[90%] justify-center'>
                <Row className="w-full justify-center h-[20%]">
                    <Typography.Text className='text-[20px] underline'>
                        Country Data
                    </Typography.Text>
                </Row>
                <Table<DataType>
                    className="rounded-xl shadow overflow-hidden"
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                    rowHoverable={false}
                    rowClassName={(record) => editingKey === record.key ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl" : "rounded-xl"}
                    scroll={{ x: 'max-content' }}
                />
            </Col>
        </Layout>
    );
};

export default Main;