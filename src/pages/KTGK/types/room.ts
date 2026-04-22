export type Room = {
  key: string;
  maPhong: string;
  tenPhong: string;
  soCho: number;
  loai: RoomType;
  nguoiPhuTrach: string;
};
export enum RoomType {
  LY_THUYET = 'Lý thuyết',
  THUC_HANH = 'Thực hành',
  HOI_TRUONG = 'Hội trường',
}