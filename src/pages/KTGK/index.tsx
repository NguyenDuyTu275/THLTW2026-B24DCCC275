import React, { useState } from 'react';
import { Input, Select, Button, Form, message } from 'antd';
import { Room } from './types/room';
import { initialData } from './data/roomData';
import RoomTable from './components/RoomTable.tsx';
import RoomModal from './components/RoomModal.tsx';
import { loaiList, nguoiList } from './data/roomData';
import { RoomType } from './types/room';

const ClassroomPage: React.FC = () => {
  const [data, setData] = useState<Room[]>(initialData);
  const [search, setSearch] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>();
  const [filterNguoi, setFilterNguoi] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const [form] = Form.useForm();

  const filteredData = data
    .filter(
      (item) =>
        item.maPhong.toLowerCase().includes(search.toLowerCase()) ||
        item.tenPhong.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => (filterLoai ? item.loai === filterLoai : true))
    .filter((item) => (filterNguoi ? item.nguoiPhuTrach === filterNguoi : true));

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const isDuplicate = data.some(
      (item) =>
        item.maPhong === values.maPhong &&
        (!editing || editing.maPhong !== values.maPhong)
    );

    if (isDuplicate) {
      message.error('Mã phòng bị trùng!');
      return;
    }

    if (editing) {
      setData((prev) =>
        prev.map((item) =>
          item.maPhong === editing.maPhong ? { ...values, key: values.maPhong } : item
        )
      );
    } else {
      setData((prev) => [...prev, { ...values, key: values.maPhong }]);
    }

    setModalOpen(false);
    form.resetFields();
    setEditing(null);
  };

  const handleDelete = (record: Room) => {
    if (record.soCho >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ!');
      return;
    }
    setData((prev) => prev.filter((item) => item.maPhong !== record.maPhong));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý phòng học</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <Input placeholder="Tìm kiếm" onChange={(e) => setSearch(e.target.value)} />

  <Select
  placeholder="Loại phòng"
  allowClear
  style={{ width: 150 }}
  onChange={(value) => setFilterLoai(value)}
  options={Object.values(RoomType).map((l) => ({
    label: l,
    value: l,
  }))}
/>
        <Select
  placeholder="Người phụ trách"
  allowClear
  style={{ width: 180 }}
  onChange={setFilterNguoi}
  options={nguoiList.map((n) => ({
    label: n,
    value: n,
  }))}
/>

        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            setEditing(null);
            form.resetFields();
          }}
        >
          + Thêm phòng
        </Button>
      </div>

      <RoomTable
        data={filteredData}
        onEdit={(room) => {
          setEditing(room);
          setModalOpen(true);
          form.setFieldsValue(room);
        }}
        onDelete={handleDelete}
      />

      <RoomModal
        open={modalOpen}
        editing={editing}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
      />
    </div>
  );
};

export default ClassroomPage;