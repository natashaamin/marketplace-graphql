import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Col, Modal, Row, Statistic } from 'antd';
import styles from './index.less'

export interface IBidItems {
  quantity: string;
  startTime: string;
  closeTime: string;
  price: string;
  title: string;
  onButtonClicked: () => void;
  onSubmit: () => void;
}

export interface CustomizeModalHandles {
  openModal: () => void;
  closeModal: () => void;
}


const CustomizeModal = forwardRef<CustomizeModalHandles,IBidItems>((props, ref) => {
  const { quantity, startTime, closeTime, price, onSubmit, onButtonClicked, title } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onSubmit()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openModal: () => {
      showModal()
    },
    closeModal: () => {
      handleCancel();
    }
  }))

  return (
    <>
      <Button type="primary" onClick={onButtonClicked}>
        {title}
      </Button>
      <Modal title="Order Summary" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Trade Value" value={price} suffix={"MWh"}/>
          </Col>
          <Col span={12}>
            <Statistic title="Quantity" value={quantity} precision={2} />
          </Col>
          <Col span={12}>
            <Statistic title="Order Price" value={price} suffix="EUR" />
          </Col>
          <Col span={12}>
            <Statistic title="Start Time" value={startTime} />
          </Col>
          <Col span={12}>
            <Statistic title="Close Time" value={closeTime} />
          </Col>
        </Row>
      </Modal>
    </>
  );
});

export default CustomizeModal