import React from 'react';

import { Table, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Room } from '../types/room';

type Props = {
  data: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
};

const RoomTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns: ColumnsType<Room> = [
    { title: 'Mã phòng', dataIndex: 'maPhong' },
    { title: 'Tên phòng', dataIndex: 'tenPhong' },
    {
      title: 'Số chỗ ',
      dataIndex: 'soCho',
      sorter: (a, b) => a.soCho - b.soCho,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    { title: 'Loại', dataIndex: 'loai' },
    { title: 'Người phụ trách', dataIndex: 'nguoiPhuTrach' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(record)}>
            <Button danger type="link">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="maPhong" />;
};

export default RoomTable;