import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from 'antd'
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from '../../api'
import dateFormat from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import UserForm from './user-form'



export default class User extends Component {

    state = {
        users: [],
        roles: [],
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: dateFormat
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: role_id => this.state.roles.find(role => role_id === role._id).name
                render: role_id => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: user => (
                    <span>
                        <Button type='link' onClick={() => this.showUpdate(user)}>修改</Button>
                        <Button type='link' onClick={() => this.deleteUser(user)}>删除</Button>
                    </span>
                )
            },
        ]
    }

    initRoles = roles => {
        const roleNames = roles.reduce((prev, role) => {
            prev[role._id] = role.name
            return prev
        }, {})
        this.roleNames = roleNames
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoles(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    showAdd = () => {
        this.user = null
        this.setState({ isShow: true })
    }

    showUpdate = user => {
        this.setState({ isShow: true })
        this.user = user
    }

    addOrUpdateUser = async () => {
        const user = this.form.current.getFieldsValue()
        this.setState({ isShow: false })
        this.form.current.resetFields()

        if (this.user) {
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
            message.success((this.user ? '修改' : '添加') + '用户成功')
            this.getUsers()
        }
    }

    deleteUser = user => {
        Modal.confirm({
            title: `确定删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })

    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}

        const title = (
            <Button
                type='primary'
                onClick={this.showAdd}
            >
                创建用户
            </Button>
        )

        return (
            <Card title={title} >
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />

                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false })
                        this.form.current.resetFields()
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
