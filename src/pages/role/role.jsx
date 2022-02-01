import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import dateFormat from '../../utils/dateUtils'
import user from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


export default class Role extends Component {

    myRef = React.createRef()

    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false
    }

    initColumns() {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: create_time => dateFormat(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: auth_time => dateFormat(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    onRow = role => {
        return {
            onClick: e => {
                this.setState({ role })
            }
        }
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    addRole = () => {
        this.addForm.current.validateFields()
            .then(async values => {
                this.addForm.current.resetFields()
                this.setState({ isShowAdd: false })
                const { roleName } = values
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                    message.success('角色添加成功')
                } else {
                    message.error('角色添加失败')
                }
            })
    }

    updateRole = async () => {
        this.setState({ isShowAuth: false })

        const { role } = this.state
        const menus = this.myRef.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = user.user.username

        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (user.user.role_id === role._id) {
                user.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户的权限修改成功，请重新登录')
            } else {
                message.success('角色权限修改成功')
                this.setState({ roles: [...this.state.roles] })
            }
        } else {
            message.error('角色权限修改失败')
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
        
        
    }

    render() {
        // console.log(this.state.role)
        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type='primary' style={{ marginRight: 10 }} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{ 
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: role => {
                            this.setState({ role }) 
                        }
                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.addForm.current.resetFields()
                    }}>
                    <AddForm
                        setForm={form => this.addForm = form}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}>
                    <AuthForm
                        role={role}
                        ref={this.myRef}
                    />
                </Modal>
            </Card>
        )
    }
}
