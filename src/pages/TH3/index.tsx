import React, { useState, useMemo } from 'react';
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Tag,
  Rate,
  Card,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Drawer,
  Space,
  Popconfirm,
  message,
  Typography,
  Progress,
  Descriptions,
  Empty,
  InputNumber,
  Alert,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  ShopOutlined,
  MessageOutlined,
  FileTextOutlined,
  ScheduleOutlined,

} from '@ant-design/icons';
import moment, { Moment } from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;


type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface WorkSchedule {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  specialization: string;
  maxClientsPerDay: number;
  workSchedules: WorkSchedule[];
  serviceIds: string[];
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description: string;
  active: boolean;
}

interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  employeeId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  note: string;
  createdAt: string;
  reviewId?: string;
}

interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  employeeId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

const TODAY    = moment().format('YYYY-MM-DD');
const YESTERDAY = moment().subtract(1, 'day').format('YYYY-MM-DD');
const DAY2_AGO  = moment().subtract(2, 'day').format('YYYY-MM-DD');
const DAY3_AGO  = moment().subtract(3, 'day').format('YYYY-MM-DD');
const TOMORROW  = moment().add(1, 'day').format('YYYY-MM-DD');

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; label: string }> = {
  pending:   { color: 'orange', label: 'Chờ duyệt' },
  confirmed: { color: 'blue',   label: 'Đã xác nhận' },
  completed: { color: 'green',  label: 'Hoàn thành' },
  cancelled: { color: 'red',    label: 'Đã hủy' },
};


const STATUS_BADGE: Record<AppointmentStatus, 'warning' | 'processing' | 'success' | 'error' | 'default'> = {
  pending:   'warning',
  confirmed: 'processing',
  completed: 'success',
  cancelled: 'error',
};

const AVATAR_COLORS = ['#1890ff', '#722ed1', '#eb2f96', '#52c41a', '#fa8c16'];
const STRIPE_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2'];

const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: 'SPa',     price: 80000,  duration: 30,  category: 'Spa', description: 'Spa Thái các loại',  active: true },
  { id: 's2', name: 'Cắt + Xả',   price: 120000, duration: 45,  category: 'Tóc', description: 'Cắt tóc ',        active: true },
  { id: 's3', name: 'Uốn tóc',         price: 350000, duration: 120, category: 'Tóc', description: 'Uốn tóc xoăn các kiểu',     active: true },
  { id: 's4', name: 'Nhuộm tóc',       price: 450000, duration: 150, category: 'Tóc', description: 'Nhuộm tóc màu theo yêu cầu',active: true },
  { id: 's5', name: 'Gội đầu thư giãn',price: 250000, duration: 60,  category: 'Spa', description: 'Massage da đầu và thư giãn', active: true },
  { id: 's6', name: 'Chăm sóc da mặt', price: 180000, duration: 60,  category: 'Spa', description: 'Làm sạch và dưỡng da mặt',   active: true },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'e1', name: 'NguyễnDuy Tư', phone: '0913937416', email: 'tu@salon.com',
    avatar: 'A', specialization: 'Stylist tóc', maxClientsPerDay: 10,
    workSchedules: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ],
    serviceIds: ['s1', 's2', 's3', 's4'], active: true,
  },
  {
    id: 'e2', name: 'Phạm Hải Đăng', phone: '0912345678', email: 'dang@salon.com',
    avatar: 'B', specialization: 'Chuyên viên spa', maxClientsPerDay: 8,
    workSchedules: [
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '17:00' },
    ],
    serviceIds: ['s5', 's6'], active: true,
  },
  {
    id: 'e3', name: 'Lê Đình Thành', phone: '0923456789', email: 'thanh@salon.com',
    avatar: 'C', specialization: 'Stylist tóc & Nail', maxClientsPerDay: 12,
    workSchedules: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 0, startTime: '09:00', endTime: '17:00' },
    ],
    serviceIds: ['s1', 's2', 's3', 's4', 's5'], active: true,
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Khánh',
    customerPhone: '0911111111',
    employeeId: 'e1',
    serviceId: 's1',
    date: TODAY,
    startTime: '08:30',
    endTime: '09:00',
    status: 'confirmed',
    note: 'Khách đặt online',
    createdAt: moment().subtract(3, 'hour').toISOString(),
  },
  {
    id: 'a2',
    customerId: 'c2',
    customerName: 'Trần Thu Hà',
    customerPhone: '0922222222',
    employeeId: 'e2',
    serviceId: 's5',
    date: TODAY,
    startTime: '10:30',
    endTime: '11:30',
    status: 'pending',
    note: 'Khách yêu cầu nhân viên nữ',
    createdAt: moment().subtract(1, 'hour').toISOString(),
  },
  {
    id: 'a3',
    customerId: 'c3',
    customerName: 'Lê Đức Anh',
    customerPhone: '0933333333',
    employeeId: 'e1',
    serviceId: 's2',
    date: YESTERDAY,
    startTime: '15:00',
    endTime: '15:45',
    status: 'completed',
    note: '',
    createdAt: moment().subtract(1, 'day').toISOString(),
    reviewId: 'r1',
  },
  {
    id: 'a4',
    customerId: 'c4',
    customerName: 'Phạm Thị Mai',
    customerPhone: '0944444444',
    employeeId: 'e3',
    serviceId: 's3',
    date: TOMORROW,
    startTime: '13:00',
    endTime: '15:00',
    status: 'confirmed',
    note: 'Muốn nhuộm màu sáng',
    createdAt: moment().toISOString(),
  },
  {
    id: 'a5',
    customerId: 'c5',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0955555555',
    employeeId: 'e2',
    serviceId: 's6',
    date: DAY2_AGO,
    startTime: '09:30',
    endTime: '10:30',
    status: 'completed',
    note: '',
    createdAt: moment().subtract(2, 'day').toISOString(),
    reviewId: 'r2',
  },
  {
    id: 'a6',
    customerId: 'c6',
    customerName: 'Đỗ Quang Huy',
    customerPhone: '0966666666',
    employeeId: 'e1',
    serviceId: 's4',
    date: DAY3_AGO,
    startTime: '14:00',
    endTime: '16:30',
    status: 'completed',
    note: 'Khách quen',
    createdAt: moment().subtract(3, 'day').toISOString(),
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    appointmentId: 'a3',
    customerId: 'c3',
    customerName: 'Lê Đức Anh',
    employeeId: 'e1',
    serviceId: 's2',
    rating: 5,
    comment: 'Cắt tóc rất đẹp và tư vấn nhiệt tình.',
    createdAt: moment().subtract(10, 'hour').toISOString(),
    reply: 'Salon cảm ơn anh đã ủng hộ, hẹn gặp lại.',
    repliedAt: moment().subtract(5, 'hour').toISOString(),
  },
  {
    id: 'r2',
    appointmentId: 'a5',
    customerId: 'c5',
    customerName: 'Hoàng Minh Tuấn',
    employeeId: 'e2',
    serviceId: 's6',
    rating: 4,
    comment: 'Dịch vụ tốt, không gian sạch sẽ.',
    createdAt: moment().subtract(1, 'day').toISOString(),
  },
];

const AppointmentApp: React.FC = () => {
  const [activeMenu, setActiveMenu]         = useState('dashboard');
  const [employees, setEmployees]           = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [services, setServices]             = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments]     = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [reviews, setReviews]               = useState<Review[]>(INITIAL_REVIEWS);

  const [empModal, setEmpModal]             = useState(false);
  const [svcModal, setSvcModal]             = useState(false);
  const [aptModal, setAptModal]             = useState(false);
  const [reviewDrawer, setReviewDrawer]     = useState<string | null>(null);
  const [replyModal, setReplyModal]         = useState<Review | null>(null);
  const [editEmployee, setEditEmployee]     = useState<Employee | null>(null);
  const [editService, setEditService]       = useState<Service | null>(null);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [aptDetailDrawer, setAptDetailDrawer] = useState<Appointment | null>(null);
  const [reviewModal, setReviewModal]       = useState<Appointment | null>(null);

  const [empForm]    = Form.useForm();
  const [svcForm]    = Form.useForm();
  const [aptForm]    = Form.useForm();
  const [replyForm]  = Form.useForm();
  const [reviewForm] = Form.useForm();

  const getEmployee = (id: string) => employees.find(e => e.id === id);
  const getService  = (id: string) => services.find(s => s.id === id);
  const getReview   = (id: string) => reviews.find(r => r.id === id);

  const getEmployeeRating = (empId: string) => {
    const list = reviews.filter(r => r.employeeId === empId);
    return list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  };

  const checkConflict = (empId: string, date: string, start: string, end: string, excludeId?: string) =>
    appointments.filter(
      a =>
        a.id !== excludeId &&
        a.employeeId === empId &&
        a.date === date &&
        a.status !== 'cancelled' &&
        !(end <= a.startTime || start >= a.endTime),
    );

  const checkMaxClients = (empId: string, date: string, excludeId?: string) => {
    const emp = getEmployee(empId);
    if (!emp) return false;
    return (
      appointments.filter(a => a.id !== excludeId && a.employeeId === empId && a.date === date && a.status !== 'cancelled').length >=
      emp.maxClientsPerDay
    );
  };

  const isEmployeeWorking = (emp: Employee, date: string) => {
    const dow = moment(date).day() as DayOfWeek;
    return emp.workSchedules.some(s => s.dayOfWeek === dow);
  };
  const stats = useMemo(() => {
    const thisMonth  = moment().format('YYYY-MM');
    const todayApts  = appointments.filter(a => a.date === TODAY);
    const monthApts  = appointments.filter(a => a.date.startsWith(thisMonth));
    const completed  = appointments.filter(a => a.status === 'completed');
    const totalRevenue = completed.reduce((s, a) => s + (getService(a.serviceId)?.price || 0), 0);
    const monthRevenue = monthApts
      .filter(a => a.status === 'completed')
      .reduce((s, a) => s + (getService(a.serviceId)?.price || 0), 0);
    return {
      todayCount:   todayApts.length,
      monthCount:   monthApts.length,
      totalRevenue,
      monthRevenue,
      pendingCount: appointments.filter(a => a.status === 'pending').length,
    };
  }, [appointments]);
  const openEmpModal = (emp?: Employee) => {
    setEditEmployee(emp || null);
    empForm.resetFields();
    if (emp) {
      const days      = emp.workSchedules.map(s => String(s.dayOfWeek));
      const firstSched = emp.workSchedules[0];
      empForm.setFieldsValue({
        name:             emp.name,
        phone:            emp.phone,
        email:            emp.email,
        specialization:   emp.specialization,
        maxClientsPerDay: emp.maxClientsPerDay,
        serviceIds:       emp.serviceIds,
        days,
        workStart: firstSched ? moment(firstSched.startTime, 'HH:mm') : null,
        workEnd:   firstSched ? moment(firstSched.endTime,   'HH:mm') : null,
      });
    }
    setEmpModal(true);
  };

  const saveEmployee = (vals: any) => {
    const schedules: WorkSchedule[] = (vals.days || []).map((d: string) => ({
      dayOfWeek: parseInt(d, 10) as DayOfWeek,
      startTime: vals.workStart ? (vals.workStart as Moment).format('HH:mm') : '09:00',
      endTime:   vals.workEnd   ? (vals.workEnd   as Moment).format('HH:mm') : '17:00',
    }));
    if (editEmployee) {
      setEmployees(prev => prev.map(e => e.id === editEmployee.id ? { ...e, ...vals, workSchedules: schedules } : e));
      message.success('Cập nhật nhân viên thành công!');
    } else {
      setEmployees(prev => [
        ...prev,
        { id: `e${Date.now()}`, avatar: (vals.name as string)[0].toUpperCase(), workSchedules: schedules, active: true, ...vals },
      ]);
      message.success('Thêm nhân viên thành công!');
    }
    setEmpModal(false);
  };

  const openSvcModal = (svc?: Service) => {
    setEditService(svc || null);
    svcForm.resetFields();
    if (svc) svcForm.setFieldsValue(svc);
    setSvcModal(true);
  };

  const saveService = (vals: any) => {
    if (editService) {
      setServices(prev => prev.map(s => s.id === editService.id ? { ...s, ...vals } : s));
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      setServices(prev => [...prev, { id: `s${Date.now()}`, active: true, ...vals }]);
      message.success('Thêm dịch vụ thành công!');
    }
    setSvcModal(false);
  };

  const openAptModal = (apt?: Appointment) => {
    setEditAppointment(apt || null);
    aptForm.resetFields();
    if (apt) {
      aptForm.setFieldsValue({
        customerName:  apt.customerName,
        customerPhone: apt.customerPhone,
        serviceId:     apt.serviceId,
        employeeId:    apt.employeeId,
        note:          apt.note,
        date:      moment(apt.date, 'YYYY-MM-DD'),
        startTime: moment(apt.startTime, 'HH:mm'),
      });
    }
    setAptModal(true);
  };

  const saveAppointment = (vals: any) => {
    const date      = (vals.date as Moment).format('YYYY-MM-DD');
    const svc       = getService(vals.serviceId)!;
    const startTime = (vals.startTime as Moment).format('HH:mm');
    const endTime   = moment(startTime, 'HH:mm').add(svc.duration, 'minute').format('HH:mm');

    if (checkConflict(vals.employeeId, date, startTime, endTime, editAppointment?.id).length) {
      message.error('Nhân viên đã có lịch hẹn trong thời gian này!');
      return;
    }
    if (checkMaxClients(vals.employeeId, date, editAppointment?.id)) {
      message.error('Nhân viên đã đạt số khách tối đa trong ngày!');
      return;
    }
    const emp = getEmployee(vals.employeeId)!;
    if (!isEmployeeWorking(emp, date)) {
      message.error('Nhân viên không làm việc vào ngày này!');
      return;
    }

    if (editAppointment) {
      setAppointments(prev =>
        prev.map(a => a.id === editAppointment.id ? { ...a, ...vals, date, startTime, endTime } : a),
      );
      message.success('Cập nhật lịch hẹn thành công!');
    } else {
      setAppointments(prev => [
        ...prev,
        {
          id: `a${Date.now()}`, customerId: `c${Date.now()}`, status: 'pending' as AppointmentStatus,
          date, startTime, endTime, createdAt: new Date().toISOString(),
          customerName: vals.customerName, customerPhone: vals.customerPhone,
          serviceId: vals.serviceId, employeeId: vals.employeeId, note: vals.note || '',
        },
      ]);
      message.success('Đặt lịch hẹn thành công!');
    }
    setAptModal(false);
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    message.success('Đã cập nhật trạng thái lịch hẹn!');
  };
  const saveReview = (vals: any) => {
    if (!reviewModal) return;
    const newRv: Review = {
      id: `r${Date.now()}`, appointmentId: reviewModal.id,
      customerId: reviewModal.customerId, customerName: reviewModal.customerName,
      employeeId: reviewModal.employeeId, serviceId: reviewModal.serviceId,
      rating: vals.rating, comment: vals.comment, createdAt: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newRv]);
    setAppointments(prev => prev.map(a => a.id === reviewModal.id ? { ...a, reviewId: newRv.id } : a));
    message.success('Cảm ơn bạn đã đánh giá!');
    setReviewModal(null);
    reviewForm.resetFields();
  };

  const saveReply = (vals: any) => {
    if (!replyModal) return;
    setReviews(prev =>
      prev.map(r => r.id === replyModal.id ? { ...r, reply: vals.reply, repliedAt: new Date().toISOString() } : r),
    );
    message.success('Đã phản hồi đánh giá!');
    setReplyModal(null);
    replyForm.resetFields();
  };

  const renderDashboard = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}> Tổng quan hôm nay</Title>
      <Row gutter={[16, 16]}>
        {[
          { title: 'Lịch hẹn hôm nay', value: stats.todayCount,   icon: <CalendarOutlined />, bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
          { title: 'Chờ duyệt',         value: stats.pendingCount,  icon: <ClockCircleOutlined />, bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
          { title: 'Lịch hẹn tháng này',value: stats.monthCount,   icon: <ScheduleOutlined />, bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
          { title: 'Doanh thu tháng',   value: stats.monthRevenue, icon: <DollarOutlined />, bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', suffix: 'đ', fmt: true },
        ].map((item, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} style={{ background: item.bg }}>
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>{item.title}</span>}
                value={item.value}
                suffix={item.suffix}
                valueStyle={{ color: '#fff', fontSize: 28 }}
                formatter={item.fmt ? (v: any) => Number(v).toLocaleString('vi-VN') : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title=" Lịch hẹn sắp tới" bordered={false}
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => openAptModal()}>Đặt lịch</Button>}
          >
            <Table
              dataSource={appointments.filter(a => a.date >= TODAY && a.status !== 'cancelled').slice(0, 5)}
              rowKey="id" size="small" pagination={false}
              columns={[
                { title: 'Khách hàng', dataIndex: 'customerName', render: (n: string) => <><UserOutlined style={{ marginRight: 6 }} />{n}</> },
                { title: 'Ngày giờ', render: (_: any, r: Appointment) => <span>{moment(r.date).format('DD/MM')} {r.startTime}</span> },
                { title: 'Nhân viên', dataIndex: 'employeeId', render: (id: string) => <Tag color="blue">{getEmployee(id)?.name}</Tag> },
                { title: 'Trạng thái', dataIndex: 'status', render: (s: AppointmentStatus) => <Badge status={STATUS_BADGE[s]} text={STATUS_CONFIG[s].label} /> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Nhân viên xuất sắc" bordered={false}>
            {employees.map((emp, idx) => {
              const rating  = getEmployeeRating(emp.id);
              const empApts = appointments.filter(a => a.employeeId === emp.id && a.status === 'completed').length;
              return (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, padding: '8px 12px', background: '#fafafa', borderRadius: 8 }}>
                  <Avatar style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length], marginRight: 12 }}>{emp.avatar}</Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{emp.specialization}</div>
                    <Rate disabled value={rating} style={{ fontSize: 12 }} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#1890ff' }}>{empApts}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>lịch hẹn</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Đánh giá gần đây" bordered={false}>
            {reviews.length === 0 && <Empty description="Chưa có đánh giá" />}
            {[...reviews].reverse().slice(0, 3).map(rv => (
              <div key={rv.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Text strong>{rv.customerName}</Text>
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                      → {getEmployee(rv.employeeId)?.name} | {getService(rv.serviceId)?.name}
                    </Text>
                    <div><Rate disabled value={rv.rating} style={{ fontSize: 14 }} /></div>
                    <div style={{ color: '#555', marginTop: 4 }}>{rv.comment}</div>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                    {moment(rv.createdAt).format('DD/MM')}
                  </Text>
                </div>
                {rv.reply && (
                  <Alert message={<><MessageOutlined style={{ marginRight: 6 }} />Phản hồi: {rv.reply}</>} type="info" style={{ marginTop: 8 }} />
                )}
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
  const renderEmployees = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý nhân viên</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEmpModal()}>Thêm nhân viên</Button>
      </div>
      <Row gutter={[16, 16]}>
        {employees.map((emp, idx) => {
          const rating    = getEmployeeRating(emp.id);
          const empRevs   = reviews.filter(r => r.employeeId === emp.id);
          const todayApts = appointments.filter(a => a.employeeId === emp.id && a.date === TODAY && a.status !== 'cancelled').length;
          return (
            <Col xs={24} md={12} lg={8} key={emp.id}>
              <Card
                bordered={false} hoverable
                actions={[
                  <EditOutlined key="edit" onClick={() => openEmpModal(emp)} />,
                  <Popconfirm key="del" title="Xác nhận xóa nhân viên?" okText="Xóa" cancelText="Hủy"
                    onConfirm={() => { setEmployees(prev => prev.filter(e => e.id !== emp.id)); message.success('Đã xóa!'); }}>
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>,
                  <Button key="rv" type="link" size="small" style={{ padding: 0 }} onClick={() => setReviewDrawer(emp.id)}>
                    <StarOutlined /> Đánh giá
                  </Button>,
                ]}
              >
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar size={64} style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length], fontSize: 24 }}>{emp.avatar}</Avatar>
                  <div style={{ marginTop: 8 }}>
                    <Title level={5} style={{ margin: 0 }}>{emp.name}</Title>
                    <Tag color="purple">{emp.specialization}</Tag>
                    {emp.active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Nghỉ</Tag>}
                  </div>
                  <Rate disabled value={rating} allowHalf style={{ fontSize: 14, marginTop: 8 }} />
                  <div style={{ fontSize: 12, color: '#888' }}>{empRevs.length} đánh giá</div>
                </div>
                <Descriptions size="small" column={1} bordered>
                  <Descriptions.Item label="SĐT">{emp.phone}</Descriptions.Item>
                  <Descriptions.Item label="Max/ngày">{emp.maxClientsPerDay} khách</Descriptions.Item>
                  <Descriptions.Item label="Hôm nay">
                    <Progress percent={Math.round((todayApts / emp.maxClientsPerDay) * 100)}
                      format={() => `${todayApts}/${emp.maxClientsPerDay}`} size="small" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Lịch làm việc">
                    {emp.workSchedules.map(s => (
                      <Tag key={s.dayOfWeek} style={{ marginBottom: 2 }}>
                        {DAY_NAMES[s.dayOfWeek]} {s.startTime}-{s.endTime}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dịch vụ">
                    {emp.serviceIds.map(id => (
                      <Tag key={id} color="blue" style={{ marginBottom: 2 }}>{getService(id)?.name}</Tag>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer title={`Đánh giá — ${getEmployee(reviewDrawer || '')?.name || ''}`}
        visible={!!reviewDrawer} onClose={() => setReviewDrawer(null)} width={500}>
        {reviewDrawer && reviews.filter(r => r.employeeId === reviewDrawer).length === 0 && <Empty description="Chưa có đánh giá" />}
        {reviewDrawer && reviews.filter(r => r.employeeId === reviewDrawer).map(rv => (
          <Card key={rv.id} style={{ marginBottom: 16 }} size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>{rv.customerName}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{moment(rv.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
            </div>
            <Rate disabled value={rv.rating} style={{ fontSize: 14 }} />
            <div style={{ color: '#555', margin: '8px 0' }}>{rv.comment}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{getService(rv.serviceId)?.name}</Text>
            {rv.reply
              ? <Alert message={<><MessageOutlined style={{ marginRight: 6 }} />{rv.reply}</>} type="info" style={{ marginTop: 8 }} />
              : <Button size="small" icon={<MessageOutlined />} style={{ marginTop: 8 }}
                  onClick={() => { setReplyModal(rv); replyForm.resetFields(); }}>Phản hồi</Button>
            }
          </Card>
        ))}
      </Drawer>
    </div>
  );

  const renderServices = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}> Quản lý dịch vụ</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openSvcModal()}>Thêm dịch vụ</Button>
      </div>
      <Table
        dataSource={services} rowKey="id" bordered
        columns={[
          { title: 'Tên dịch vụ', dataIndex: 'name', render: (n: string) => <Text strong>{n}</Text> },
          {
            title: 'Danh mục', dataIndex: 'category',
            render: (c: string) => <Tag color="geekblue">{c}</Tag>,
            filters: ['Tóc', 'Spa', 'Nail', 'Khác'].map(v => ({ text: v, value: v })),
            onFilter: (val: any, r: Service) => r.category === val,
          },
          {
            title: 'Giá', dataIndex: 'price',
            render: (p: number) => <Text type="success" strong>{p.toLocaleString('vi-VN')}đ</Text>,
            sorter: (a: Service, b: Service) => a.price - b.price,
          },
          { title: 'Thời gian', dataIndex: 'duration', render: (d: number) => <><ClockCircleOutlined style={{ marginRight: 4 }} />{d} phút</> },
          { title: 'Mô tả', dataIndex: 'description', ellipsis: true },
          { title: 'Trạng thái', dataIndex: 'active', render: (a: boolean) => a ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Dừng</Tag> },
          {
            title: 'Thao tác',
            render: (_: any, r: Service) => (
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openSvcModal(r)} />
                <Popconfirm title="Xóa dịch vụ này?" okText="Xóa" cancelText="Hủy"
                  onConfirm={() => setServices(prev => prev.filter(s => s.id !== r.id))}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );

  const renderAppointments = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý lịch hẹn</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openAptModal()}>Đặt lịch hẹn</Button>
      </div>
      <Table
        dataSource={[...appointments].sort((a, b) => b.createdAt.localeCompare(a.createdAt))}
        rowKey="id" bordered
        columns={[
          {
            title: 'Khách hàng',
            render: (_: any, r: Appointment) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{r.customerPhone}</div>
              </div>
            ),
          },
          { title: 'Dịch vụ', dataIndex: 'serviceId', render: (id: string) => <Tag color="blue">{getService(id)?.name}</Tag> },
          { title: 'Nhân viên', dataIndex: 'employeeId', render: (id: string) => getEmployee(id)?.name },
          {
            title: 'Ngày & Giờ',
            render: (_: any, r: Appointment) => (
              <div>
                <div style={{ fontWeight: 600 }}>{moment(r.date).format('DD/MM/YYYY')}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{r.startTime} - {r.endTime}</div>
              </div>
            ),
            sorter: (a: Appointment, b: Appointment) => (a.date + a.startTime).localeCompare(b.date + b.startTime),
          },
          {
            title: 'Trạng thái', dataIndex: 'status',
            render: (s: AppointmentStatus) => <Badge status={STATUS_BADGE[s]} text={STATUS_CONFIG[s].label} />,
            filters: (Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map(k => ({ text: STATUS_CONFIG[k].label, value: k })),
            onFilter: (val: any, r: Appointment) => r.status === val,
          },
          {
            title: 'Thao tác',
            render: (_: any, r: Appointment) => (
              <Space wrap>
                <Button size="small" onClick={() => setAptDetailDrawer(r)}>Chi tiết</Button>
                {r.status === 'pending' && (
                  <>
                    <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => updateStatus(r.id, 'confirmed')}>Duyệt</Button>
                    <Button size="small" danger icon={<CloseOutlined />} onClick={() => updateStatus(r.id, 'cancelled')}>Hủy</Button>
                  </>
                )}
                {r.status === 'confirmed' && (
                  <Button size="small" style={{ background: '#52c41a', color: '#fff', border: 'none' }} onClick={() => updateStatus(r.id, 'completed')}>Hoàn thành</Button>
                )}
                {r.status === 'completed' && !r.reviewId && (
                  <Button size="small" icon={<StarOutlined />} onClick={() => { setReviewModal(r); reviewForm.resetFields(); }}>Đánh giá</Button>
                )}
                {r.status !== 'completed' && r.status !== 'cancelled' && (
                  <Button size="small" icon={<EditOutlined />} onClick={() => openAptModal(r)} />
                )}
              </Space>
            ),
          },
        ]}
      />

      <Drawer title="Chi tiết lịch hẹn" visible={!!aptDetailDrawer} onClose={() => setAptDetailDrawer(null)} width={450}>
        {aptDetailDrawer && (() => {
          const emp = getEmployee(aptDetailDrawer.employeeId);
          const svc = getService(aptDetailDrawer.serviceId);
          const rv  = aptDetailDrawer.reviewId ? getReview(aptDetailDrawer.reviewId) : null;
          return (
            <>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Khách hàng">{aptDetailDrawer.customerName}</Descriptions.Item>
                <Descriptions.Item label="SĐT">{aptDetailDrawer.customerPhone}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ"><Tag color="blue">{svc?.name}</Tag></Descriptions.Item>
                <Descriptions.Item label="Giá"><Text type="success" strong>{svc?.price.toLocaleString('vi-VN')}đ</Text></Descriptions.Item>
                <Descriptions.Item label="Nhân viên">{emp?.name}</Descriptions.Item>
                <Descriptions.Item label="Ngày">{moment(aptDetailDrawer.date).format('dddd, DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Giờ">{aptDetailDrawer.startTime} → {aptDetailDrawer.endTime}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={STATUS_CONFIG[aptDetailDrawer.status].color}>{STATUS_CONFIG[aptDetailDrawer.status].label}</Tag>
                </Descriptions.Item>
                {aptDetailDrawer.note && <Descriptions.Item label="Ghi chú">{aptDetailDrawer.note}</Descriptions.Item>}
              </Descriptions>
              {rv && (
                <Card title=" Đánh giá" style={{ marginTop: 16 }} size="small">
                  <Rate disabled value={rv.rating} />
                  <div style={{ marginTop: 8 }}>{rv.comment}</div>
                  {rv.reply && <Alert message={rv.reply} type="info" style={{ marginTop: 8 }} />}
                </Card>
              )}
            </>
          );
        })()}
      </Drawer>
    </div>
  );

  const renderReviews = () => (
    <div>
      <Title level={4} style={{ marginBottom: 20 }}>Đánh giá & Phản hồi</Title>
      <Row gutter={[16, 16]}>
        {employees.map(emp => {
          const empRevs = reviews.filter(r => r.employeeId === emp.id);
          const avg     = empRevs.length ? empRevs.reduce((s, r) => s + r.rating, 0) / empRevs.length : 0;
          const dist    = [5, 4, 3, 2, 1].map(star => ({ star, count: empRevs.filter(r => r.rating === star).length }));
          return (
            <Col xs={24} key={emp.id}>
              <Card
                bordered={false}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar style={{ background: '#1890ff' }}>{emp.avatar}</Avatar>
                    <div>
                      <Text strong>{emp.name}</Text>
                      <div>
                        <Rate disabled value={avg} allowHalf style={{ fontSize: 16 }} />
                        <Text type="secondary" style={{ marginLeft: 8 }}>({avg.toFixed(1)}) — {empRevs.length} đánh giá</Text>
                      </div>
                    </div>
                  </div>
                }
              >
                <Row gutter={[16, 8]}>
                  <Col xs={24} md={8}>
                    {dist.map(d => (
                      <div key={d.star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Text style={{ width: 14 }}>{d.star}</Text>
                        <StarOutlined style={{ color: '#faad14', fontSize: 12 }} />
                        <Progress percent={empRevs.length ? Math.round((d.count / empRevs.length) * 100) : 0}
                          size="small" showInfo={false} style={{ flex: 1, marginBottom: 0 }} />
                        <Text type="secondary" style={{ width: 20, fontSize: 12 }}>{d.count}</Text>
                      </div>
                    ))}
                  </Col>
                  <Col xs={24} md={16}>
                    {empRevs.length === 0 && <Empty description="Chưa có đánh giá" />}
                    {empRevs.map(rv => (
                      <div key={rv.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Space>
                            <Text strong>{rv.customerName}</Text>
                            <Rate disabled value={rv.rating} style={{ fontSize: 12 }} />
                            <Tag color="blue" style={{ fontSize: 11 }}>{getService(rv.serviceId)?.name}</Tag>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 11 }}>{moment(rv.createdAt).format('DD/MM/YYYY')}</Text>
                        </div>
                        <div style={{ color: '#555', margin: '6px 0' }}>{rv.comment}</div>
                        {rv.reply
                          ? <Alert message={<><MessageOutlined style={{ marginRight: 6 }} /><Text italic>{rv.reply}</Text></>} type="info" style={{ marginTop: 6 }} />
                          : <Button size="small" icon={<MessageOutlined />} onClick={() => { setReplyModal(rv); replyForm.resetFields(); }}>Phản hồi</Button>
                        }
                      </div>
                    ))}
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );

  const renderStats = () => {
    const byService = services.map(svc => {
      const apts = appointments.filter(a => a.serviceId === svc.id && a.status === 'completed');
      return { ...svc, count: apts.length, revenue: apts.length * svc.price };
    }).sort((a, b) => b.revenue - a.revenue);

    const byEmployee = employees.map(emp => {
      const apts    = appointments.filter(a => a.employeeId === emp.id && a.status === 'completed');
      const revenue = apts.reduce((s, a) => s + (getService(a.serviceId)?.price || 0), 0);
      return { ...emp, count: apts.length, revenue };
    }).sort((a, b) => b.revenue - a.revenue);

    const byStatus = (Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map(k => ({
      key: k, label: STATUS_CONFIG[k].label, count: appointments.filter(a => a.status === k).length,
    }));

    const borderColors: Record<string, string> = {
      pending: '#fa8c16', confirmed: '#1890ff', completed: '#52c41a', cancelled: '#ff4d4f',
    };

    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d   = moment().subtract(6 - i, 'day');
      const str = d.format('YYYY-MM-DD');
      return {
        date:    d.format('DD/MM'),
        count:   appointments.filter(a => a.date === str).length,
        revenue: appointments.filter(a => a.date === str && a.status === 'completed').reduce((s, a) => s + (getService(a.serviceId)?.price || 0), 0),
      };
    });

    const maxRev    = Math.max(...byService.map(s => s.revenue),  1);
    const maxEmpRev = Math.max(...byEmployee.map(e => e.revenue), 1);

    return (
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>Thống kê & Báo cáo</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Lịch hẹn 7 ngày gần đây" bordered={false}>
              {last7.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Text style={{ width: 50, fontSize: 12 }}>{d.date}</Text>
                  <Progress percent={d.count ? Math.min(100, d.count * 10) : 0} format={() => `${d.count} lịch`}
                    strokeColor="#1890ff" style={{ flex: 1, marginBottom: 0 }} />
                  <Text type="success" style={{ width: 110, fontSize: 12, textAlign: 'right' }}>
                    {d.revenue.toLocaleString('vi-VN')}đ
                  </Text>
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Phân bổ theo trạng thái" bordered={false}>
              <Row gutter={[12, 12]}>
                {byStatus.map(s => (
                  <Col span={12} key={s.key}>
                    <Card size="small" style={{ borderLeft: `4px solid ${borderColors[s.key]}` }}>
                      <Statistic title={s.label} value={s.count} valueStyle={{ fontSize: 24 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo dịch vụ" bordered={false}>
              {byService.map((svc, i) => (
                <div key={svc.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <Tag color="blue">{svc.name}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>{svc.count} lịch hẹn</Text>
                    </Space>
                    <Text strong type="success">{svc.revenue.toLocaleString('vi-VN')}đ</Text>
                  </div>
                  <Progress percent={Math.round((svc.revenue / maxRev) * 100)} showInfo={false} strokeColor={STRIPE_COLORS[i % STRIPE_COLORS.length]} />
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo nhân viên" bordered={false}>
              {byEmployee.map((emp, i) => (
                <div key={emp.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <Avatar size="small" style={{ background: '#1890ff' }}>{emp.avatar}</Avatar>
                      <Text strong>{emp.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{emp.count} lịch hẹn</Text>
                    </Space>
                    <Text strong type="success">{emp.revenue.toLocaleString('vi-VN')}đ</Text>
                  </div>
                  <Progress percent={Math.round((emp.revenue / maxEmpRev) * 100)} showInfo={false} strokeColor={STRIPE_COLORS[i % 3]} />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Card title="Tổng kết" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}><Statistic title="Tổng lịch hẹn" value={appointments.length} prefix={<CalendarOutlined />} /></Col>
                <Col xs={12} md={6}><Statistic title="Hoàn thành" value={appointments.filter(a => a.status === 'completed').length} prefix={<CheckOutlined />} valueStyle={{ color: '#52c41a' }} /></Col>
                <Col xs={12} md={6}>
                  <Statistic title="Tổng doanh thu" value={stats.totalRevenue}
                    formatter={(v: any) => Number(v).toLocaleString('vi-VN')} suffix="đ"
                    prefix={<DollarOutlined />} valueStyle={{ color: '#1890ff' }} />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic title="Đánh giá TB"
                    value={(reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                    prefix={<StarOutlined />} suffix="/5" valueStyle={{ color: '#faad14' }} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };
  const menuItems = [
    { key: 'dashboard',    icon: <BarChartOutlined />, label: 'Tổng quan' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
    { key: 'employees',    icon: <TeamOutlined />,     label: 'Nhân viên' },
    { key: 'services',     icon: <ShopOutlined />,     label: 'Dịch vụ' },
    { key: 'reviews',      icon: <StarOutlined />,     label: 'Đánh giá' },
    { key: 'stats',        icon: <FileTextOutlined />, label: 'Thống kê' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':    return renderDashboard();
      case 'appointments': return renderAppointments();
      case 'employees':    return renderEmployees();
      case 'services':     return renderServices();
      case 'reviews':      return renderReviews();
      case 'stats':        return renderStats();
      default:             return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        
        <div style={{ width: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.1)', height: '100%', flexShrink: 0 }}>
        Hair SALON
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeMenu]}
          style={{ background: '#001529', flex: 1, borderBottom: 'none', lineHeight: '64px' }}
          onClick={({ key }) => setActiveMenu(key as string)}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>{item.label}</Menu.Item>
          ))}
        </Menu>

        <Space style={{ paddingRight: 24, flexShrink: 0 }}>
          <Badge count={stats.pendingCount} showZero={false}>
            <Button icon={<ClockCircleOutlined />} onClick={() => setActiveMenu('appointments')}
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Chờ duyệt
            </Button>
          </Badge>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openAptModal()}>
            Đặt lịch nhanh
          </Button>
        </Space>
      </Header>

      <Layout>
        <Content style={{ margin: 24, padding: 24, background: '#f0f2f5', borderRadius: 8, minHeight: 'calc(100vh - 112px)' }}>
          {renderContent()}
        </Content>
      </Layout>
      <Modal title={editEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        visible={empModal} onCancel={() => setEmpModal(false)} onOk={() => empForm.submit()}
        okText="Lưu" cancelText="Hủy" width={600} destroyOnClose>
        <Form form={empForm} layout="vertical" onFinish={saveEmployee}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}><Input /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specialization" label="Chuyên môn" rules={[{ required: true, message: 'Nhập chuyên môn' }]}><Input /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="maxClientsPerDay" label="Số khách tối đa/ngày" rules={[{ required: true }]}>
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="serviceIds" label="Dịch vụ phục vụ" rules={[{ required: true, message: 'Chọn ít nhất 1 dịch vụ' }]}>
            <Select mode="multiple" placeholder="Chọn dịch vụ">
              {services.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="days" label="Ngày làm việc">
            <Select mode="multiple" placeholder="Chọn ngày làm việc">
              {DAY_NAMES.map((d, i) => <Option key={i} value={String(i)}>{d}</Option>)}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="workStart" label="Giờ bắt đầu"><TimePicker format="HH:mm" style={{ width: '100%' }} /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workEnd" label="Giờ kết thúc"><TimePicker format="HH:mm" style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal title={editService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
        visible={svcModal} onCancel={() => setSvcModal(false)} onOk={() => svcForm.submit()}
        okText="Lưu" cancelText="Hủy" destroyOnClose>
        <Form form={svcForm} layout="vertical" onFinish={saveService}>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}><Input /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                <Select>
                  <Option value="Tóc">Tóc</Option>
                  <Option value="Spa">Spa</Option>
                  <Option value="Nail">Nail</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>
                <InputNumber min={0} step={10000} style={{ width: '100%' }}
                  formatter={(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v: any) => v!.replace(/,/g, '')} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="duration" label="Thời gian thực hiện (phút)" rules={[{ required: true }]}>
            <InputNumber min={5} max={480} step={5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="active" label="Trạng thái" initialValue={true}>
            <Select>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Dừng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={editAppointment ? 'Sửa lịch hẹn' : 'Đặt lịch hẹn mới'}
        visible={aptModal} onCancel={() => setAptModal(false)} onOk={() => aptForm.submit()}
        okText="Xác nhận" cancelText="Hủy" width={560} destroyOnClose>
        <Form form={aptForm} layout="vertical" onFinish={saveAppointment}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Nhập tên khách' }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}><Input /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
            <Select placeholder="Chọn dịch vụ">
              {services.filter(s => s.active).map(s => (
                <Option key={s.id} value={s.id}>{s.name} — {s.price.toLocaleString('vi-VN')}đ ({s.duration} phút)</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="employeeId" label="Nhân viên phục vụ" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
            <Select placeholder="Chọn nhân viên">
              {employees.filter(e => e.active).map(e => (
                <Option key={e.id} value={e.id}>{e.name} — {e.specialization} (max {e.maxClientsPerDay}/ngày)</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true, message: 'Chọn ngày' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY"
                  disabledDate={(d: Moment) => d && d.isBefore(moment().startOf('day'))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Chọn giờ' }]}>
                <TimePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Đánh giá dịch vụ" visible={!!reviewModal}
        onCancel={() => setReviewModal(null)} onOk={() => reviewForm.submit()}
        okText="Gửi đánh giá" cancelText="Hủy" destroyOnClose>
        {reviewModal && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">{getService(reviewModal.serviceId)?.name}</Tag>
            <Tag>NV: {getEmployee(reviewModal.employeeId)?.name}</Tag>
          </div>
        )}
        <Form form={reviewForm} layout="vertical" onFinish={saveReview}>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét" rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}>
            <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title=" Phản hồi đánh giá" visible={!!replyModal}
        onCancel={() => setReplyModal(null)} onOk={() => replyForm.submit()}
        okText="Gửi phản hồi" cancelText="Hủy" destroyOnClose>
        {replyModal && (
          <Alert
            message={<><Text strong>{replyModal.customerName}</Text> ({replyModal.rating}⭐): {replyModal.comment}</>}
            style={{ marginBottom: 16 }}
          />
        )}
        <Form form={replyForm} layout="vertical" onFinish={saveReply}>
          <Form.Item name="reply" label="Phản hồi của bạn" rules={[{ required: true, message: 'Nhập nội dung phản hồi' }]}>
            <Input.TextArea rows={3} placeholder="Nhập phản hồi..." />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AppointmentApp;