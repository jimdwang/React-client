import React, { Component } from 'react'
import { Select, Input, Button, Card, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select

export default class Home extends Component {

    state = {
        products: [],
        total: 0,
        isLoading: false,
        searchType: 'productName',
        searchName: ''
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'age',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: price => '￥' + price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width: 100,
                render: product => {
                    let { _id, status } = product
                    return (
                        <span>
                            <Button type='primary' onClick={() => this.updateStatus(_id, status = status === 1 ? 2 : 1)}>{ status === 1 ? '下架' : '上架' }</Button>
                            <span>{ status === 1 ? '在售' : '已下架' }</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: product => {
                    return (
                        <span>
                            <Button type='link' onClick={() => this.props.history.push('/product/detail', product) }>详情</Button>
                            <Button type='link' onClick={() => this.props.history.push('/product/addupdate', product) }>修改</Button>
                        </span>
                    )
                }
            },
        ]
    }

    getProducts = async pageNum => {
        this.pageNum = pageNum
        
        this.setState({ isLoading: true })

        const { searchType, searchName } = this.state

        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ isLoading: false })

        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({ total, products: list })
        }
    }

    updateStatus =  async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        const { products, total, isLoading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    value={searchName}
                    placeholder='关键字'
                    style={{ width: 150, margin: "0 10px" }}
                    onChange={e => this.setState({ searchName: e.target.value })}
                />
                <Button type='primary' onClick={ () => this.getProducts(1) }>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card
                title={title}
                extra={extra}>
                <Table
                    loading={isLoading}
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
