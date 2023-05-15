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

  return { form, open, handleOpen, handleClose };
}

export default useModal;
