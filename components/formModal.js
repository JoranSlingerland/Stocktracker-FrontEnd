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
import { ApiWithMessage } from '../utils/api-utils';

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
          buy_sell: 'buy',
        }}
      >
        <Form.Item
          name="symbol"
          label="symbol"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Cost"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value="buy">Buy</Radio>
            <Radio value="sell">Sell</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="transaction_cost"
          label="Transaction Cost"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Currency"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="domain"
          label="Domain"
          rules={[
            {
              required: true,
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
          deposit_withdrawal: 'deposit',
        }}
      >
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio value="deposit">Deposit</Radio>
            <Radio value="withdrawal">Withdrawal</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function AddXForm({form}) {
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    if (form === 'addStock') {
      var value = {
        type: 'stock',
        items: [values],
      };
    } else if (form === 'addTransaction') {
      var value = {
        type: 'transaction',
        items: [values],
      };
    }
    async function fetchData() {
      ApiWithMessage(
        `/api/add_item_to_input`,
        'Creating new items',
        'Items Created',
        'Post',
        value
      );
    }
    fetchData();
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
          className="float-right"
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
};