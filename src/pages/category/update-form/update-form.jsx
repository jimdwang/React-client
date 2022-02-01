import React, { Component } from 'react'
import { Form, Input } from 'antd'

const { Item } = Form
export default class UpdateForm extends Component {
  
  myRef = React.createRef()

  componentDidUpdate() {
    this.myRef.current.setFieldsValue({
      categoryName: this.props.categoryName
    })
  }

  UNSAFE_componentWillMount() {
    const { setForm } = this.props
    setForm(this.myRef)
  }


  render() {
    return (
      <Form ref={this.myRef}>
        <Item
          name='categoryName'
          rules={[
            {required: true, message: '请输入分类名称！'}
          ]}
          initialValue={this.props.categoryName}
        >
          <Input  />
        </Item>
      </Form>
    )
  }
}
