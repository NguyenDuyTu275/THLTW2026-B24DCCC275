import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { Room } from '../types/room';
import { loaiList, nguoiList } from '../data/roomData';

type Props = {
  open: boolean;
  editing: Room | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  form: any;
};

const RoomModal: React.FC<Props> = ({ open, editing, onCancel, onSubmit, form }) => {
  return (
    <Modal
      title={editing ? 'Chỉnh sửa phòng' : 'Thêm phòng'}
      visible={open}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="maPhong" label="Mã phòng" rules={[{ required: true }]}>
          <Input disabled={!!editing} />
        </Form.Item>

        <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="soCho" label="Số chỗ" rules={[{ required: true }]}>
          <InputNumber min={10} max={200} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="loai" label="Loại phòng" rules={[{ required: true }]}>
          <Select>
            {loaiList.map((l) => (
              <Select.Option key={l} value={l}>{l}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="nguoiPhuTrach" label="Người phụ trách" rules={[{ required: true }]}>
          <Select>
            {nguoiList.map((n) => (
              <Select.Option key={n} value={n}>{n}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;