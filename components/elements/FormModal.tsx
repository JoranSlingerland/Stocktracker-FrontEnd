import { Modal, ModalProps } from 'antd';

export const FormModal = ({
  form,
  modalProps,
  footer,
  opener,
}: {
  form: JSX.Element;
  modalProps: ModalProps;
  footer?: JSX.Element;
  opener: JSX.Element;
}): JSX.Element => {
  return (
    <>
      {opener}
      <Modal {...modalProps}>
        {form}
        {footer}
      </Modal>
    </>
  );
};
