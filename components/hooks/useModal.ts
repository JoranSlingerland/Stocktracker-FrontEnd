import { Form } from 'antd';
import { useState } from 'react';

function useModal() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndReset = () => {
    setOpen(false);
    setTimeout(() => {
      form.resetFields();
    }, 500);
  };

  return { form, open, handleOpen, handleClose, handleCloseAndReset };
}

export default useModal;
