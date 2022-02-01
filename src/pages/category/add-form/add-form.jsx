import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'

const { Item } = Form
const { Option } = Select
export default class AddForm extends Component {
  myRef = React.createRef()

  UNSAFE_componentWillMount() {
    const { setForm } = this.props
    setForm(this.myRef)
  }

  componentDidUpdate() {
    this.myRef.current.setFieldsValue({
      parentId: this.props.parentId
    })
  }

  render() {
    const {categories, parentId} = this.props
    return (
      <Form ref={this.myRef}>
        <Item
          name='parentId'
          initialValue={parentId}
        >
          <Select>
            <Option value='0'>一级分类</Option>
            {
              categories.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
            }
              
          </Select>
        </Item>
        <Item
          name='categoryName'
          rules={[
            {required: true, message: '请输入分类名称！'}
          ]}
        >
          <Input placeholder='请输入......' />
        </Item>
      </Form>
    )
  }
}
