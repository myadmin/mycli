import request, { extend } from 'umi-request';
import { message } from 'antd';
import { FormValues } from './data';

const errorHandler = function (error: any) {
    if (error.response) {
        if (error.response.status >= 400) {
            message.error(error.data.message ? error.data.message : error.data);
        }
    } else {
        // console.log(error.message);
        message.error('Network error.');
    }
    throw error; // If throw. The error will continue to be thrown.
};

const extendRequest = extend({ errorHandler });

export const getRemoteList = async ({
    page = 1,
    per_page = 20,
}: {
    page: number;
    per_page: number;
}) => {
    return extendRequest(
        `https://public-api-v1.aspirantzhang.com/users?page=${page}&per_page=${per_page}`,
    )
        .then((response) => {
            return response;
        })
        .catch((err) => {
            return false;
        });
};

export const editRecord = async ({
    id,
    values,
}: {
    id: number | undefined;
    values: FormValues;
}) => {
    return extendRequest(
        `https://public-api-v1.aspirantzhang.com/users/${id}`,
        {
            method: 'PUT',
            data: values,
        },
    )
        .then((response) => {
            return true;
        })
        .catch((err) => {
            return false;
        });
};

export const addRecord = async ({ values }: { values: FormValues }) => {
    return extendRequest(`https://public-api-v1.aspirantzhang.com/users`, {
        method: 'POST',
        data: values,
    })
        .then((response) => {
            return true;
        })
        .catch((err) => {
            return false;
        });
};

export const deleteRecord = async ({ id }: { id: string | undefined }) => {
    return extendRequest(
        `https://public-api-v1.aspirantzhang.com/users/${id}`,
        {
            method: 'DELETE',
        },
    )
        .then((response) => {
            return true;
        })
        .catch((err) => {
            return false;
        });
};
