import {
  Form,
  InputNumber,
  Select,
  DatePicker,
  FormInstance,
  Input,
} from 'antd';
import { getCurrencySymbol } from '../utils/formatting';
import { currencyCodes } from '../constants/currencyCodes';

const TransactionForm = (
  currency: string,
  form: FormInstance<any>,
  initialValues: any
): JSX.Element => {
  return (
    <Form
      form={form}
      layout="vertical"
      name="add_transaction_form"
      initialValues={initialValues}
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
          prefix={getCurrencySymbol(currency)}
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
  );
};

const StockForm = ({
  currency,
  setTotalValue,
  setCurrency,
  form,
  initialValues,
}: {
  currency: string;
  setTotalValue: (value: number) => void;
  setCurrency: (value: string) => void;
  form: FormInstance<any>;
  initialValues: any;
}): JSX.Element => {
  const currencySelector = (
    <Form.Item name="currency" hasFeedback noStyle required={true}>
      <Select
        options={currencyCodes}
        showSearch={true}
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        className="min-w-[80]"
      />
    </Form.Item>
  );
  return (
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
      initialValues={initialValues}
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
          prefix={getCurrencySymbol(currency)}
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
  );
};

export { TransactionForm, StockForm };
