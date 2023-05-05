import React from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Tooltip,
  InputNumber,
  DatePicker,
  Divider,
  Typography,
  Select,
} from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ApiWithMessage } from '../utils/api-utils';
import { formatCurrency, getCurrencySymbol } from '../utils/formatting';
import { UserSettings_Type, UserInfo_Type } from '../types/types';
import currencyCodes from '../../shared/currency_codes.json';

const { Text, Title } = Typography;

const AddStockForm = ({
  open,
  onCreate,
  onCancel,
  userSettings,
}: {
  open: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  userSettings: UserSettings_Type;
}): JSX.Element => {
  const [form] = Form.useForm();
  const [totalValue, setTotalValue] = useState(0);
  const [currency, setCurrency] = useState(userSettings.currency);

  const currencySelector = (
    <Form.Item name="currency" hasFeedback noStyle required={true}>
      <Select
        options={currencyCodes}
        showSearch={true}
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Form.Item>
  );

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
        onFieldsChange={() => {
          const cost_per_share = form.getFieldValue('cost_per_share');
          const quantity = form.getFieldValue('quantity');
          if (cost_per_share === undefined || quantity === undefined) {
            setTotalValue(0);
          } else {
            setTotalValue(cost_per_share * quantity);
          }
          setCurrency(form.getFieldValue('currency'));
        }}
        form={form}
        layout="vertical"
        name="add_stock_form"
        initialValues={{
          transaction_type: 'Buy',
          currency: userSettings.currency,
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
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="cost_per_share"
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
          <InputNumber
            addonAfter={currencySelector}
            controls={false}
            className="w-full"
          />
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
          <InputNumber className="w-full" controls={false} />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          label="Transaction Type"
          hasFeedback
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            <Select.Option value="Buy">Buy</Select.Option>
            <Select.Option value="Sell">Sell</Select.Option>
          </Select>
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
          <InputNumber
            className="w-full"
            prefix={getCurrencySymbol(userSettings.currency)}
            controls={false}
          />
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
      <Divider />
      <div className="flex">
        <div>
          <Text strong>Total cost</Text>
        </div>
        <div className="mr-0 ml-auto">
          <Title level={5}>
            {formatCurrency({ value: totalValue, currency: currency })}
          </Title>
        </div>
      </div>
    </Modal>
  );
};

const AddTransactionForm = ({
  open,
  onCreate,
  onCancel,
  userSettings,
}: {
  open: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  userSettings: UserSettings_Type;
}): JSX.Element => {
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
          <DatePicker className="w-full" />
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
          <InputNumber
            className="w-full"
            prefix={getCurrencySymbol(userSettings.currency)}
            controls={false}
          />
        </Form.Item>
        <Form.Item
          name="transaction_type"
          label="Transaction Type"
          hasFeedback
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            <Select.Option value="Deposit">Deposit</Select.Option>
            <Select.Option value="Withdrawal">Withdrawal</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function AddXForm({
  form,
  parentCallback,
  userSettings,
  userInfo,
}: {
  form: 'addStock' | 'addTransaction';
  parentCallback: (
    container: 'input_invested' | 'input_transactions'
  ) => Promise<void>;
  userSettings: UserSettings_Type;
  userInfo: UserInfo_Type;
}) {
  const [open, setOpen] = useState(false);

  const onCreate = (values: any) => {
    setOpen(false);
    async function postData() {
      values['userid'] = userInfo.clientPrincipal.userId;
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
      if (form === 'addStock') {
        parentCallback('input_transactions');
      }
      if (form === 'addTransaction') {
        parentCallback('input_invested');
      }
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
          userSettings={userSettings}
        />
      ) : form === 'addTransaction' ? (
        <AddTransactionForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
          userSettings={userSettings}
        />
      ) : null}
    </div>
  );
}
