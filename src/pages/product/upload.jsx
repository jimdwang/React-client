import React, { Component } from 'react'
import { message, Modal, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    // state = {
    //     previewVisible: false,
    //     previewImage: '',
    //     previewTitle: '',
    //     fileList: [
    //         {
    //             uid: '-1',
    //             name: 'image.png',
    //             status: 'done',
    //             url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //         }
    //     ],
    // };

    constructor(props) {
        super(props)

        let fileList = []

        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img,
            }))
        }

        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const result = file.response
            console.log(fileList)
            if (result.status === 0) {
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
                message.success('上传成功')
            } else {
                message.error('上传失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
                console.log(fileList)
            } else {
                message.error('删除图片失败')
            }
        }
        this.setState({ fileList })
    }

    getImgs = () => {
        const { fileList } = this.state
        return fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"
                    accept='image/*'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}