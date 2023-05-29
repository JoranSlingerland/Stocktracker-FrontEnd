import React from 'react';
import { Button, Divider, Typography } from 'antd';
import { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formatting';
import { addItemToInput } from '../services/input/add';
import { TransactionForm, StockForm } from '../elements/Forms';
import { FormModal } from '../elements/FormModal';
import useModal from '../hooks/useModal';
import dayjs from 'dayjs';
import { InputTransactionData, InputInvestedData } from '../types/types';

const { Text, Title } = Typography;

const StockFormModal = ({
  currency,
  parentCallback,
  initialValues,
  isEdit = false,
}: {
  currency: string;
  parentCallback: () => void;
  initialValues?: InputTransactionData;
  isEdit?: boolean;
}): JSX.Element => {
  const [totalValue, setTotalValue] = useState(initialValues?.total_cost || 0);
  const [stockCurrency, setStockCurrency] = useState(
    initialValues?.currency || currency
  );
  const { form, open, handleOpen, handleClose, handleCloseAndReset } =
    useModal();

  const dayjsDate = initialValues?.date && dayjs(initialValues.date);

  const handleCreate = async (values: InputTransactionData) => {
    handleClose();
    if (isEdit) {
      values.id = initialValues ? initialValues.id : values.id;
    }
    await addItemToInput({
      body: {
        type: 'stock',
        items: [values],
      },
    });
    parentCallback();
  };

  const handleOk = async () => {
    await form.validateFields();
    handleCreate(form.getFieldsValue());
    setTimeout(() => {
      form.resetFields();
    }, 500);
  };

  const modalProps = {
    open,
    title: isEdit
      ? 'Edit a stock in your portfolio'
      : 'Add a stock to your portfolio',
    okText: isEdit ? 'Save' : 'Add',
    cancelText: 'Cancel',
    onCancel: isEdit ? handleCloseAndReset : handleClose,
    onOk: handleOk,
  };

  const opener = (
    <Button
      icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
      type="text"
      shape={isEdit ? undefined : 'circle'}
      onClick={handleOpen}
    />
  );

  return (
    <FormModal
      form={StockForm({
        currency: stockCurrency,
        setTotalValue,
        setCurrency: setStockCurrency,
        form: form,
        initialValues: {
          ...initialValues,
          date: dayjsDate,
        } || {
          transaction_type: 'Buy',
          currency: currency,
        },
      })}
      modalProps={modalProps}
      footer={
        <>
          <Divider />
          <div className="flex">
            <div>
              <Text strong>Total cost</Text>
            </div>
            <div className="mr-0 ml-auto">
              <Title level={5}>
                {formatCurrency({ value: totalValue, currency: stockCurrency })}
              </Title>
            </div>
          </div>
        </>
      }
      opener={opener}
    />
  );
};

const TransactionsFormModal = ({
  currency,
  parentCallback,
  initialValues,
  isEdit = false,
}: {
  currency: string;
  parentCallback: () => Promise<void> | void;
  initialValues?: InputInvestedData;
  isEdit?: boolean;
}): JSX.Element => {
  const { form, open, handleOpen, handleClose, handleCloseAndReset } =
    useModal();

  const dayjsDate = initialValues?.date && dayjs(initialValues.date);

  const handleCreate = async (values: InputInvestedData) => {
    handleClose();
    if (isEdit) {
      values.id = initialValues ? initialValues.id : values.id;
    }
    await addItemToInput({
      body: {
        type: 'transaction',
        items: [values],
      },
    });
    parentCallback();
  };

  const handleOk = async () => {
    await form.validateFields();
    handleCreate(form.getFieldsValue());
    setTimeout(() => {
      form.resetFields();
    }, 500);
  };

  const opener = (
    <Button
      icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
      type="text"
      shape={isEdit ? undefined : 'circle'}
      onClick={handleOpen}
    />
  );

  const modalProps = {
    open,
    title: isEdit
      ? 'Edit a transaction to your portfolio'
      : 'Add a transaction to your portfolio',
    okText: isEdit ? 'Save' : 'Add',
    cancelText: 'Cancel',
    onCancel: handleCloseAndReset,
    onOk: handleOk,
  };

  return (
    <FormModal
      form={TransactionForm(
        currency,
        form,
        { ...initialValues, date: dayjsDate } || {
          transaction_type: 'Deposit',
        }
      )}
      modalProps={modalProps}
      opener={opener}
    />
  );
};

export { TransactionsFormModal, StockFormModal };
