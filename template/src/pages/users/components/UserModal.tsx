import React, { useEffect, FC } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import dayjs from 'dayjs';
import { SingleUserType, FormValues } from '../data';

interface UserModalProps {
    visible: boolean;
    onFinish: (values: FormValues) => void;
    handleClose: () => void;
    record: SingleUserType | undefined;
    confirmLoading: boolean;
}

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const UserModal: FC<UserModalProps> = ({
    visible,
    onFinish,
    handleClose,
    record,
    confirmLoading,
}) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    };

    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                ...record,
                create_time: dayjs(record.create_time),
                status: Boolean(record.status),
            });
        } else {
            form.resetFields();
        }
    }, [visible]);

    return (
        <Modal
            title={record ? `Edit ID: ${record.id}` : 'Add'}
            visible={visible}
            onOk={handleOk}
            onCancel={handleClose}
            confirmLoading={confirmLoading}
            forceRender
        >
            <Form
                {...layout}
                form={form}
                name="basic"
                onFinish={onFinish}
                initialValues={{ status: true }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="Create Time" name="create_time">
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Status" name="status" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModal;
