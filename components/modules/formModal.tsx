import React from 'react';
import { Button, Tooltip, Divider, Typography } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formatting';
import { UserSettings_Type } from '../types/types';
import { addItemToInput } from '../services/add';
import { TransactionForm, StockForm } from '../elements/Forms';
import { FormModal } from '../elements/FormModal';
import useModal from '../hooks/useModal';

const { Text, Title } = Typography;

const StockFormModal = ({
  userSettings,
  parentCallback,
}: {
  userSettings: UserSettings_Type;
  parentCallback: () => Promise<void>;
}): JSX.Element => {
  const [totalValue, setTotalValue] = useState(0);
  const [currency, setCurrency] = useState(userSettings.currency);
  const { form, open, handleOpen, handleClose } = useModal();

  const handleCreate = async (values: any) => {
    handleClose();
    await addItemToInput({
      body: {
        type: 'stock',
        items: [values],
      },
    });
    parentCallback();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      handleCreate(values);
    });
  };

  const opener = (
    <Tooltip title="Add items">
      <Button icon={<PlusOutlined />} shape="circle" onClick={handleOpen} />
    </Tooltip>
  );

  return (
    <>
      <FormModal
        form={StockForm({
          currency: userSettings.currency,
          setTotalValue: setTotalValue,
          setCurrency: setCurrency,
          form: form,
        })}
        modalProps={{
          open,
          title: 'Add a stock to your portfolio',
          okText: 'Add',
          cancelText: 'Cancel',
          onCancel: handleClose,
          onOk: handleOk,
        }}
        footer={
          <>
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
          </>
        }
        opener={opener}
      />
    </>
  );
};

const TransactionsFormModal = ({
  userSettings,
  parentCallback,
}: {
  userSettings: UserSettings_Type;
  parentCallback: () => Promise<void>;
}): JSX.Element => {
  const { form, open, handleOpen, handleClose } = useModal();

  const handleCreate = async (values: any) => {
    handleClose();
    await addItemToInput({
      body: {
        type: 'transaction',
        items: [values],
      },
    });
    parentCallback();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      handleCreate(values);
    });
  };

  const opener = (
    <Tooltip title="Add items">
      <Button icon={<PlusOutlined />} shape="circle" onClick={handleOpen} />
    </Tooltip>
  );

  return (
    <FormModal
      form={TransactionForm(userSettings.currency, form)}
      modalProps={{
        open,
        title: 'Add a transaction to your portfolio',
        okText: 'Add',
        cancelText: 'Cancel',
        onCancel: handleClose,
        onOk: handleOk,
      }}
      opener={opener}
    />
  );
};

export { TransactionsFormModal, StockFormModal };
