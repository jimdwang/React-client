import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'

const { Item } = Form
const { Option } = Select


export default class UserForm extends Component {
  myRef = React.createRef()

  UNSAFE_componentWillMount() {
    const { setForm } = this.props
    setForm(this.myRef)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps
    this.myRef.current.setFieldsValue(
      { 
        'username': user.username,
        'phone': user.phone,
        'email': user.email,
        'role_id': user.role_id
     }
    )
  }


  render() {

    const { roles, user } = this.props

    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      }
    }

    return (
      <Form
        ref={this.myRef}
        {...formItemLayout}
      >
        <Item
          name='username'
          label='用户名'
          initialValue={user.username}
          rules={[
            { required: true, message: '请输入用户名！' }
          ]}
        >
          <Input placeholder='请输入......' />
        </Item>
        {
          user._id ? null : (
            <Item
              name='password'
              label='密码'
              rules={[
                { required: true, message: '请输入密码！' }
              ]}
            >
              <Input type='password' placeholder='请输入......' />
            </Item>
          )
        }
        <Item
          name='phone'
          label='手机号'
          initialValue={user.phone}
          rules={[
            { required: true, message: '请输入手机号！' }
          ]}
        >
          <Input placeholder='请输入......' />
        </Item>
        <Item
          name='email'
          label='邮箱'
          initialValue={user.email}
          rules={[
            { required: true, message: '请输入邮箱！' }
          ]}
        >
          <Input placeholder='请输入......' />
        </Item>
        <Item
          name='role_id'
          label='角色'
          initialValue={user.role_id}
          rules={[
            { required: true, message: '请输入角色名称！' }
          ]}
        >
          <Select placeholder='请选择角色'>
            {
              roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
            }
          </Select>
        </Item>
      </Form>
    )
  }
}