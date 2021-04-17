import React, { useState, FC } from 'react';
import { Space, Popconfirm, Button, Pagination, message } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { connect, Dispatch, Loading, UserState } from 'umi';
import UserModal from './components/UserModal';
import { SingleUserType, FormValues } from './data';
import { editRecord, addRecord, getRemoteList } from './service';

interface UserPageProps {
    users: UserState;
    dispatch: Dispatch;
    userListLoading: boolean;
}

const UserListPage: FC<UserPageProps> = ({
    users,
    dispatch,
    userListLoading,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [record, setRecord] = useState<SingleUserType | undefined>(undefined);

    const columns: ProColumns<SingleUserType>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            valueType: 'text',
            key: 'id',
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            valueType: 'text',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            valueType: 'text',
            key: 'email',
        },
        {
            title: 'CREATE_TIME',
            dataIndex: 'create_time',
            valueType: 'dateTime',
            key: 'create_time',
        },
        {
            title: 'Action',
            key: 'action',
            valueType: 'option',
            render: (text: any, record: SingleUserType) => [
                <Space size="middle" key={text}>
                    <a onClick={() => handleEdit(record)}>Edit</a>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleConfirm(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>,
            ],
        },
    ];

    // 点击删除
    const handleConfirm = (record: SingleUserType) => {
        const { id } = record as SingleUserType;
        dispatch({
            type: 'users/delete',
            payload: { id },
        });
    };

    // 点击编辑
    const handleEdit = (record: SingleUserType) => {
        setModalVisible(true);
        setRecord(record);
    };

    // 点击关闭弹窗
    const handleClose = () => {
        setModalVisible(false);
    };

    // 点击保存
    const onFinish = async (values: FormValues) => {
        setConfirmLoading(true);

        const result = record?.id
            ? await editRecord({ id: record?.id, values })
            : await addRecord({ values });

        if (result) {
            setModalVisible(false);
            message.success(
                record?.id ? 'Edit Successful.' : 'Add Successful.',
            );
            handleReset();
            setConfirmLoading(false);
        } else {
            message.error(record?.id ? 'Edit Failed.' : 'Add Failed.');
            setConfirmLoading(false);
        }
    };

    // 点击添加
    const handleClickAdd = () => {
        setModalVisible(true);
        setRecord(undefined);
    };

    // 点击刷新
    const handleReset = () => {
        dispatch({
            type: 'users/getRemote',
            payload: {
                page: users.meta.page,
                per_page: users.meta.per_page,
            },
        });
    };

    const handlePagination = (page: number, pageSize?: number) => {
        dispatch({
            type: 'users/getRemote',
            payload: {
                page,
                per_page: pageSize ? pageSize : users.meta.page,
            },
        });
    };

    const handlePageSize = (current: number, size: number) => {
        // console.log(current, size);
        dispatch({
            type: 'users/getRemote',
            payload: {
                page: current,
                per_page: size,
            },
        });
    };

    return (
        <div className="list-table">
            <ProTable
                rowKey={'id'}
                columns={columns}
                dataSource={users.data}
                loading={userListLoading}
                search={false}
                pagination={false}
                options={{
                    density: true,
                    reload: handleReset,
                    setting: true,
                    search: false,
                }}
                headerTitle={'User List'}
                toolBarRender={() => [
                    <Button type="primary" onClick={handleClickAdd}>
                        Add
                    </Button>,
                    <Button onClick={handleReset}>Reload</Button>,
                ]}
            />
            <Pagination
                className="list-page"
                total={users.meta.total}
                current={users.meta.page}
                pageSize={users.meta.per_page}
                pageSizeOptions={['5', '10', '20', '50', '100']}
                onChange={handlePagination}
                onShowSizeChange={handlePageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} items`}
            />
            <UserModal
                confirmLoading={confirmLoading}
                visible={modalVisible}
                handleClose={handleClose}
                onFinish={onFinish}
                record={record}
            />
        </div>
    );
};

const mapStateToProps = ({
    users,
    loading,
}: {
    users: UserState;
    loading: Loading;
}) => {
    return {
        users,
        userListLoading: loading.models.users,
    };
};

// UserListPage.title = '用户列表';

export default connect(mapStateToProps)(UserListPage);

// https://www.bilibili.com/video/BV1qz411z7s3?p=17&spm_id_from=pageDriver

// https://juejin.cn/post/6844903802001162248

// https://jelly.jd.com/article/6006b1045b6c6a01506c87b4
