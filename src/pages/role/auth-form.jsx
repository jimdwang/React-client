import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'

const { Item } = Form

export default class AddForm extends Component {

  state = {
    checkedKeys: this.props.role.menus
  }

  

  myRef = React.createRef()

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
  }

  getMenus = () => this.state.checkedKeys

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ checkedKeys: nextProps.role.menus })
  }

  componentDidUpdate() {
    this.myRef.current.setFieldsValue({'roleName': this.props.role.name})
  }

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
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
        {...formItemLayout}
        ref={this.myRef}
      >
        <Item
          name='roleName'
          label='角色名称'
          rules={[
            { required: true, message: '请输入角色名称！' }
          ]}
          initialValue={role.name}
        >
          <Input disabled  />
        </Item>

        <Tree
          checkable
          treeData={menuList}
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </Form>
    )
  }
}