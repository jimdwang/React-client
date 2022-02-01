import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import Logo from '../../assets/images/logo.png'
import './login.less'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {

    onFinish = async values => {
        // console.log('Received values of form: ', values);
        // reqLogin(values.username, values.password).then(response => console.log(response.data), error => console.log(error))

        const result = await reqLogin(values.username, values.password)
        // console.log(response.data)
        if (result.status === 0) {

            message.success('登陆成功')

            storageUtils.saveUser(result.data)
            memoryUtils.user = result.data

            this.props.history.replace('/')

            
        }else {
            message.error(result.msg)
        }
    };

    render() {
        if(memoryUtils.user && memoryUtils.user._id){
            return <Redirect to='/' />
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={Logo} alt="" />
                    <h1>后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名！',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '请输入数字、字母、下划线！'
                                },
                                {
                                    type: 'string',
                                    max: 10,
                                    min: 4,
                                    message: '请输入4-10位！'
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '请输入数字、字母、下划线！'
                                },
                                {
                                    type: 'string',
                                    max: 10,
                                    min: 4,
                                    message: '请输入4-10位！'
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
