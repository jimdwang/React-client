import React, { Component } from 'react'
import { Form, Input } from 'antd'

const { Item } = Form
export default class AddForm extends Component {
  myRef = React.createRef()

  UNSAFE_componentWillMount() {
    const { setForm } = this.props
    setForm(this.myRef)
  }


  render() {

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
          name='roleName'
          label='角色名称'
          rules={[
            {required: true, message: '请输入角色名称！'}
          ]}
        >
          <Input placeholder='请输入......' />
        </Item>
      </Form>
    )
  }
}