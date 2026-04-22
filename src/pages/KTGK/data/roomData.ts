import { Room, RoomType } from '../types/room';

export const initialData: Room[] = [
  {
    key: 'P101',
    maPhong: 'P101',
    tenPhong: 'Phòng Lý thuyết A1',
    soCho: 60,
    loai: RoomType.LY_THUYET,
    nguoiPhuTrach: 'Nguyễn Minh Tuấn',
  },
  {
    key: 'P102',
    maPhong: 'P102',
    tenPhong: 'Phòng Lý thuyết B1',
    soCho: 45,
    loai: RoomType.LY_THUYET,
    nguoiPhuTrach: 'Trần Thị Hồng',
  },
  {
    key: 'P201',
    maPhong: 'P201',
    tenPhong: 'Phòng Lab CNTT 1',
    soCho: 30,
    loai: RoomType.THUC_HANH,
    nguoiPhuTrach: 'Lê Quang Huy',
  },
  {
    key: 'P202',
    maPhong: 'P202',
    tenPhong: 'Phòng Lab CNTT 2',
    soCho: 25,
    loai: RoomType.THUC_HANH,
    nguoiPhuTrach: 'Phạm Ngọc Anh',
  },
  {
    key: 'H301',
    maPhong: 'H301',
    tenPhong: 'Hội trường lớn',
    soCho: 150,
    loai: RoomType.HOI_TRUONG,
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