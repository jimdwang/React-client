import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { reqCategories, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form/add-form'
import UpdateForm from './update-form/update-form'
import { PAGE_SIZE } from '../../utils/constants'

export default class Category extends Component {
    state = {
        categories: [],
        subCategories: [],
        isLoading: false,
        parentId: '0',
        parentName: '',
        showStatus: 0,
    }

    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <Button type='link' onClick={() => this.showUpdate(category)}>修改分类</Button>
                        {
                            this.state.parentId === '0' ? <Button type='link' onClick={() => this.showSubCategories(category)}>查看子分类</Button> : null
                        }

                    </span>
                )
            },
        ]
    }

    getCategories = async (parentId) => {
        this.setState({ isLoading: true })

        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)

        this.setState({ isLoading: false })

        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                this.setState({ categories })
            } else {
                this.setState({ subCategories: categories })
            }
        } else {
            message.alert('数据获取失败！')
        }
    }

    //获取二级分类列表
    showSubCategories = category => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            /* console.log(this.state.parentId, typeof this.state.parentId) */
            this.getCategories()
        })
    }

    //返回一级分类
    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    //取消 添加/更新 商品分类模态框
    cancelAdd = () => {
        this.setState({ showStatus: 0 })
        this.addForm.current.resetFields()
    }
    cancelUpdate = () => {
        this.setState({ showStatus: 0 })
        this.updateForm.current.resetFields()
    }

    //添加商品分类
    addCategory = () => {
        this.setState({ showStatus: 0 })

        this.addForm.current.validateFields()
            .then(async values => {
                const { parentId, categoryName } = values

                this.addForm.current.resetFields()

                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategories()
                    } else if (parentId === '0') {
                        this.getCategories('0')
                    }
                }
            })

            .catch(err => {
                message.error('输入不能为空！')
            })

    }

    //更新商品分类
    updateCategory = () => {
        this.setState({ showStatus: 0 })

        this.updateForm.current.validateFields()
            .then(async values => {
                const categoryId = this.category._id
                const { categoryName } = values

                this.updateForm.current.resetFields()

                const result = await reqUpdateCategory(categoryName, categoryId)
                if (result.status === 0) {
                    this.getCategories()
                }
            })
            .catch(err => {
                message.error('输入不能为空')
            })


    }

    //显示添加模态框
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }

    //显示更新模态框
    showUpdate = (category) => {
        this.setState({ showStatus: 2 })

        this.category = category

    }


    UNSAFE_componentWillMount() {
        //初始化table的列
        this.initColumns()
    }

    componentDidMount() {
        //获取一级分类列表
        this.getCategories()
    }
    render() {
        const { isLoading, categories, subCategories, parentId, parentName, showStatus } = this.state
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <Button type='link' onClick={this.showCategories}>一级分类列表</Button>
                <RightOutlined style={{ marginRight: 5 }} />
                <span>{parentName}</span>

            </span>
        )
        const category = this.category || {}
        return (
            <Card title={title} extra={<Button type='primary' onClick={this.showAdd}><PlusOutlined />添加</Button>} >
                <Table
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    bordered rowKey='_id'
                    loading={isLoading}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.cancelAdd}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={form => this.addForm = form}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.cancelUpdate}
                >

                    <UpdateForm
                        categoryName={category.name}
                        setForm={form => this.updateForm = form}
                    />
                </Modal>
            </Card>
        )
    }
}
