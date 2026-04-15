import { Room } from '../types/room';

export const initialData: Room[] = [
  {
    key: 'P101',
    maPhong: 'P101',
    tenPhong: 'Phòng Lý thuyết A1',
    soCho: 60,
    loai: 'Lý thuyết',
    nguoiPhuTrach: 'Nguyễn Minh Tuấn',
  },
  {
    key: 'P102',
    maPhong: 'P102',
    tenPhong: 'Phòng Lý thuyết B1',
    soCho: 45,
    loai: 'Lý thuyết',
    nguoiPhuTrach: 'Trần Thị Hồng',
  },
  {
    key: 'P201',
    maPhong: 'P201',
    tenPhong: 'Phòng Lab CNTT 1',
    soCho: 30,
    loai: 'Thực hành',
    nguoiPhuTrach: 'Lê Quang Huy',
  },
  {
    key: 'P202',
    maPhong: 'P202',
    tenPhong: 'Phòng Lab CNTT 2',
    soCho: 25,
    loai: 'Thực hành',
    nguoiPhuTrach: 'Phạm Ngọc Anh',
  },
  {
    key: 'H301',
    maPhong: 'H301',
    tenPhong: 'Hội trường lớn',
    soCho: 150,
    loai: 'Hội trường',
    nguoiPhuTrach: 'Đỗ Thanh Bình',
  },
];

export const nguoiList = [
  'Nguyễn Minh Tuấn',
  'Trần Thị Hồng',
  'Lê Quang Huy',
  'Phạm Ngọc Anh',
  'Đỗ Thanh Bình',
];

export const loaiList = ['Lý thuyết', 'Thực hành', 'Hội trường'];