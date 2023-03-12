import React from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Tooltip,
  InputNumber,
  DatePicker,
} from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ApiWithMessage, regularFetch } from '../utils/api-utils';

const AddStockForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Add a stock to your portfolio"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {});
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_stock_form"
        initialValues={{
          transaction_type: 'Buy',
        }}
      >
        <Form.Item
          name="symbol"
          label="symbol"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              pattern: new RegExp('^[A-Z]{1,5}$'),
              message: 'Symbol must be 1-5 capital letters',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          hasFeedback
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Cost"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              validator(rule, value) {
                if (value < 0) {
                  return Promise.reject('Value must be positive');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              validator(rule, value) {
                if (value < 0) {
                  return Promise.reject('Amount must be positive');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          hasFeedback
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value="Buy">Buy</Radio>
            <Radio value="Sell">Sell</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="transaction_cost"
          label="Transaction Cost"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              validator(rule, value) {
                if (value < 0) {
                  return Promise.reject('Amount must be positive');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Currency"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              pattern: new RegExp('^[A-Z]{3}$'),
              message: 'Currency must be 3 capital letters',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="domain"
          label="Domain"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              pattern: new RegExp(
                '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'
              ),
              message: 'Please enter a valid domain',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddTransactionForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Add a transaction to your portfolio"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {});
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_transaction_form"
        initialValues={{
          transaction_type: 'Deposit',
        }}
      >
        <Form.Item
          name="date"
          label="Date"
          hasFeedback
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              validator(rule, value) {
                if (value < 0) {
                  return Promise.reject('Value must be positive');
                }
                return Promise.resolve();
              },
            },
            {
              type: 'number',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          hasFeedback
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value="Deposit">Deposit</Radio>
            <Radio value="Withdrawal">Withdrawal</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function AddXForm({ form, parentCallback }) {
  const [open, setOpen] = useState(false);

  const onCreate = (values) => {
    setOpen(false);
    async function postData() {
      const data = await regularFetch('/.auth/me', undefined);
      values['userid'] = data.clientPrincipal.userId;
      let value;

      if (form === 'addStock') {
        value = {
          type: 'stock',
          items: [values],
        };
      } else if (form === 'addTransaction') {
        value = {
          type: 'transaction',
          items: [values],
        };
      }
      const response = ApiWithMessage(
        `/api/add/add_item_to_input`,
        'Creating new items',
        'Items Created',
        'POST',
        value
      );
      return response;
    }

    postData().then(() => {
      parentCallback();
    });
  };

  return (
    <div>
      <Tooltip title="Add items">
        <Button
          icon={<PlusOutlined />}
          shape="circle"
          onClick={() => {
            setOpen(true);
          }}
        />
      </Tooltip>
      {form === 'addStock' ? (
        <AddStockForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      ) : form === 'addTransaction' ? (
        <AddTransactionForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
