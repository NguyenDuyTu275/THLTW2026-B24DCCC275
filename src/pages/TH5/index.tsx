import React, { useState, useMemo } from 'react';
import {
  Layout, Menu, Table, Button, Modal, Form, Input, Select, Switch,
  Space, Tag, Card, Row, Col, Statistic, Typography, Popconfirm,
  DatePicker, message, Descriptions, Timeline, Avatar, Alert
} from 'antd';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Club {
  id: string;
  name: string;
  foundedDate: string;
  description: string;
  leader: string;
  active: boolean;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
  history: HistoryEntry[];
  createdAt: string;
}

interface HistoryEntry {
  action: 'Approved' | 'Rejected' | 'Pending';
  time: string;
  by: string;
  reason?: string;
}

const initClubs: Club[] = [
  {
    id: 'c1',
    name: 'CLB Trí Tuệ Nhân Tạo (AI)',
    foundedDate: '2022-01-20',
    description: '<p>Nơi khám phá <b>Machine Learning</b> và <b>Deep Learning</b></p>',
    leader: 'Đặng Hoàng Nam',
    active: true,
  },
  {
    id: 'c2',
    name: 'CLB Nghệ Thuật & Hội Họa',
    foundedDate: '2019-11-11',
    description: '<p>Tự do sáng tạo với <i>Digital Art</i> và sơn dầu</p>',
    leader: 'Ngô Mỹ Linh',
    active: true,
  },
  {
    id: 'c3',
    name: 'CLB Khởi Nghiệp Trẻ',
    foundedDate: '2021-05-30',
    description: '<p>Ươm mầm các dự án <b>Startup</b> tiềm năng</p>',
    leader: 'Bùi Quang Huy',
    active: true,
  },
  {
    id: 'c4',
    name: 'CLB Kỹ Năng Mềm',
    foundedDate: '2020-08-15',
    description: '<p>Cải thiện kỹ năng thuyết trình và làm việc nhóm</p>',
    leader: 'Trịnh Thu Hà',
    active: false,
  },
];

const initApps: Application[] = [
  {
    id: 'a1',
    fullName: 'Chu Đình Trọng',
    email: 'trongcd@outlook.com',
    phone: '0389221100',
    gender: 'male',
    address: 'Hà Nội',
    skills: 'PyTorch, Scikit-learn',
    clubId: 'c1',
    reason: 'Muốn nghiên cứu về Generative AI',
    status: 'Pending',
    history: [],
    createdAt: '2026-03-10 09:30',
  },
  {
    id: 'a2',
    fullName: 'Lương Mỹ Duyên',
    email: 'duyenlm@gmail.com',
    phone: '0977665544',
    gender: 'female',
    address: 'Đà Nẵng',
    skills: 'Photoshop, Procreate',
    clubId: 'c2',
    reason: 'Muốn học cách vẽ minh họa sách thiếu nhi',
    status: 'Approved',
    history: [{ action: 'Approved', time: '2026-03-12 14:00', by: 'Ngô Mỹ Linh' }],
    createdAt: '2026-03-11 10:15',
  },
  {
    id: 'a3',
    fullName: 'Tạ Minh Đức',
    email: 'ductm@fpt.edu.vn',
    phone: '0912009988',
    gender: 'male',
    address: 'TP.HCM',
    skills: 'Lập kế hoạch, Quản trị rủi ro',
    clubId: 'c3',
    reason: 'Tìm kiếm đồng đội cho dự án Fintech',
    status: 'Pending',
    history: [],
    createdAt: '2026-03-15 16:45',
  },
  {
    id: 'a4',
    fullName: 'Vương Thu Trang',
    email: 'trangvt@yahoo.com',
    phone: '0888333222',
    gender: 'female',
    address: 'Hải Phòng',
    skills: 'Giao tiếp tiếng Anh tốt',
    clubId: 'c4',
    reason: 'Muốn tự tin hơn khi nói trước đám đông',
    status: 'Rejected',
    note: 'CLB đang trong giai đoạn tái cấu trúc, không nhận thành viên mới.',
    history: [
      {
        action: 'Rejected',
        time: '2026-03-16 08:00',
        by: 'Admin',
        reason: 'CLB tạm dừng hoạt động',
      },
    ],
    createdAt: '2026-03-14 11:20',
  },
  {
    id: 'a5',
    fullName: 'Đỗ Hữu Phước',
    email: 'phuocdh@gmail.com',
    phone: '0905112233',
    gender: 'male',
    address: 'Cần Thơ',
    skills: 'Data Analysis, SQL',
    clubId: 'c1',
    reason: 'Ứng dụng AI vào phân tích dữ liệu kinh doanh',
    status: 'Approved',
    history: [{ action: 'Approved', time: '2026-03-20 15:30', by: 'Đặng Hoàng Nam' }],
    createdAt: '2026-03-18 13:00',
  },
  {
    id: 'a6',
    fullName: 'Phan Bảo Ngọc',
    email: 'ngocpb@gmail.com',
    phone: '0355443322',
    gender: 'female',
    address: 'Huế',
    skills: 'Sáng tác nhạc, Design',
    clubId: 'c2',
    reason: 'Kết hợp âm nhạc và mỹ thuật số',
    status: 'Pending',
    history: [],
    createdAt: '2026-03-25 20:00',
  },
];
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => moment().format('YYYY-MM-DD HH:mm');
const statusColor: Record<string, string> = { Pending: 'gold', Approved: 'green', Rejected: 'red' };
const statusLabel: Record<string, string> = { Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' };
const genderLabel: Record<string, string> = { male: 'Nam', female: 'Nữ', other: 'Khác' };

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('clubs');
  const [clubs, setClubs] = useState<Club[]>(initClubs);
  const [applications, setApplications] = useState<Application[]>(initApps);

  const [clubModal, setClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubSearch, setClubSearch] = useState('');
  const [clubForm] = Form.useForm();

  const [appModal, setAppModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [historyApp, setHistoryApp] = useState<Application | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectTargets, setRejectTargets] = useState<string[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('');
  const [appClubFilter, setAppClubFilter] = useState<string>('');
  const [appForm] = Form.useForm();

  const [memberClubFilter, setMemberClubFilter] = useState<string>(initClubs[0].id);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [changeClubModal, setChangeClubModal] = useState(false);
  const [targetClubId, setTargetClubId] = useState('');

  const clubMap = useMemo(() => Object.fromEntries(clubs.map(c => [c.id, c])), [clubs]);

  const openAddClub = () => { setEditingClub(null); clubForm.resetFields(); setClubModal(true); };
  const openEditClub = (c: Club) => {
    setEditingClub(c);
    clubForm.setFieldsValue({ ...c, foundedDate: moment(c.foundedDate) });
    setClubModal(true);
  };
  const saveClub = () => {
    clubForm.validateFields().then(vals => {
      const data: Club = {
        id: editingClub?.id || uid(),
        name: vals.name,
        foundedDate: vals.foundedDate.format('YYYY-MM-DD'),
        description: vals.description || '',
        leader: vals.leader,
        active: vals.active ?? true,
      };
      setClubs(prev => editingClub ? prev.map(c => c.id === editingClub.id ? data : c) : [...prev, data]);
      setClubModal(false);
      message.success(editingClub ? 'Cập nhật thành công' : 'Thêm CLB thành công');
    });
  };
  const deleteClub = (id: string) => {
    setClubs(prev => prev.filter(c => c.id !== id));
    message.success('Đã xóa CLB');
  };

  const filteredClubs = useMemo(() =>
    clubs.filter(c =>
      c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.leader.toLowerCase().includes(clubSearch.toLowerCase())
    ), [clubs, clubSearch]);

  const clubColumns = [
    {
      title: 'Ảnh', width: 60,
      render: (_: any, r: Club) => <Avatar style={{ background: r.active ? '#1890ff' : '#999' }}>{r.name[4]}</Avatar>
    },
    { title: 'Tên CLB', dataIndex: 'name', sorter: (a: Club, b: Club) => a.name.localeCompare(b.name), render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Ngày thành lập', dataIndex: 'foundedDate', sorter: (a: Club, b: Club) => a.foundedDate.localeCompare(b.foundedDate) },
    { title: 'Chủ nhiệm', dataIndex: 'leader', sorter: (a: Club, b: Club) => a.leader.localeCompare(b.leader) },
    { title: 'Mô tả', dataIndex: 'description', render: (v: string) => <span dangerouslySetInnerHTML={{ __html: v }} /> },
    {
      title: 'Hoạt động', dataIndex: 'active',
      render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Có' : 'Không'}</Tag>,
      filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }],
      onFilter: (val: any, r: Club) => r.active === val,
    },
    {
      title: 'Thao tác', width: 180,
      render: (_: any, r: Club) => (
        <Space>
          <Button size="small" onClick={() => openEditClub(r)}>Sửa</Button>
          <Button size="small" onClick={() => { setActiveMenu('members'); setMemberClubFilter(r.id); }}>Thành viên</Button>
          <Popconfirm title="Xóa CLB này?" onConfirm={() => deleteClub(r.id)} okText="Xóa" cancelText="Hủy">
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const openAddApp = () => { setEditingApp(null); appForm.resetFields(); setAppModal(true); };
  const openEditApp = (a: Application) => { setEditingApp(a); appForm.setFieldsValue(a); setAppModal(true); };
  const saveApp = () => {
    appForm.validateFields().then(vals => {
      const data: Application = {
        id: editingApp?.id || uid(),
        ...vals,
        status: editingApp?.status || 'Pending',
        history: editingApp?.history || [],
        createdAt: editingApp?.createdAt || now(),
      };
      setApplications(prev => editingApp ? prev.map(a => a.id === editingApp.id ? data : a) : [...prev, data]);
      setAppModal(false);
      message.success(editingApp ? 'Cập nhật thành công' : 'Thêm đơn thành công');
    });
  };
  const deleteApp = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    message.success('Đã xóa đơn');
  };
  const approveApps = (ids: string[]) => {
    setApplications(prev => prev.map(a =>
      ids.includes(a.id)
        ? { ...a, status: 'Approved' as const, history: [...a.history, { action: 'Approved' as const, time: now(), by: 'Admin' }] }
        : a
    ));
    setSelectedAppIds([]);
    message.success(`Đã duyệt ${ids.length} đơn`);
  };
  const openRejectModal = (ids: string[]) => { setRejectTargets(ids); setRejectNote(''); setRejectModal(true); };
  const confirmReject = () => {
    if (!rejectNote.trim()) { message.error('Vui lòng nhập lý do từ chối'); return; }
    setApplications(prev => prev.map(a =>
      rejectTargets.includes(a.id)
        ? { ...a, status: 'Rejected' as const, note: rejectNote, history: [...a.history, { action: 'Rejected' as const, time: now(), by: 'Admin', reason: rejectNote }] }
        : a
    ));
    setRejectModal(false);
    setSelectedAppIds([]);
    message.success(`Đã từ chối ${rejectTargets.length} đơn`);
  };

  const filteredApps = useMemo(() =>
    applications.filter(a => {
      const s = appSearch.toLowerCase();
      return (a.fullName.toLowerCase().includes(s) || a.email.toLowerCase().includes(s))
        && (appStatusFilter ? a.status === appStatusFilter : true)
        && (appClubFilter ? a.clubId === appClubFilter : true);
    }), [applications, appSearch, appStatusFilter, appClubFilter]);

  const appColumns = [
    { title: 'Họ tên', dataIndex: 'fullName', sorter: (a: Application, b: Application) => a.fullName.localeCompare(b.fullName) },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', render: (v: string) => genderLabel[v] },
    { title: 'CLB', dataIndex: 'clubId', render: (v: string) => clubMap[v]?.name || v },
    {
      title: 'Trạng thái', dataIndex: 'status',
      sorter: (a: Application, b: Application) => a.status.localeCompare(b.status),
      render: (v: string) => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag>,
    },
    {
      title: 'Thao tác', width: 260,
      render: (_: any, r: Application) => (
        <Space size={4}>
          <Button size="small" onClick={() => setViewApp(r)}>Xem</Button>
          <Button size="small" onClick={() => openEditApp(r)}>Sửa</Button>
          <Button size="small" onClick={() => setHistoryApp(r)}>Lịch sử</Button>
          {r.status !== 'Approved' && <Button size="small" type="primary" onClick={() => approveApps([r.id])}>Duyệt</Button>}
          {r.status !== 'Rejected' && <Button size="small" danger onClick={() => openRejectModal([r.id])}>Từ chối</Button>}
          <Popconfirm title="Xóa đơn này?" onConfirm={() => deleteApp(r.id)} okText="Xóa" cancelText="Hủy">
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const members = useMemo(() =>
    applications.filter(a => a.status === 'Approved' && (memberClubFilter ? a.clubId === memberClubFilter : true)),
    [applications, memberClubFilter]);

  const confirmChangeClub = () => {
    if (!targetClubId) { message.error('Chọn CLB muốn chuyển'); return; }
    setApplications(prev => prev.map(a => selectedMemberIds.includes(a.id) ? { ...a, clubId: targetClubId } : a));
    setChangeClubModal(false);
    setSelectedMemberIds([]);
    message.success('Đã đổi CLB thành công');
  };

  const memberColumns = [
    { title: 'Họ tên', dataIndex: 'fullName', sorter: (a: Application, b: Application) => a.fullName.localeCompare(b.fullName) },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', render: (v: string) => genderLabel[v] },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'Sở trường', dataIndex: 'skills' },
    { title: 'CLB', dataIndex: 'clubId', render: (v: string) => <Tag color="blue">{clubMap[v]?.name || v}</Tag> },
  ];

  const totalPending = applications.filter(a => a.status === 'Pending').length;
  const totalApproved = applications.filter(a => a.status === 'Approved').length;
  const totalRejected = applications.filter(a => a.status === 'Rejected').length;

  const apexSeries = useMemo(() => [
    { name: 'Chờ duyệt', data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Pending').length) },
    { name: 'Đã duyệt', data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Approved').length) },
    { name: 'Từ chối', data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Rejected').length) },
  ], [clubs, applications]);

  const apexOptions = useMemo((): ApexCharts.ApexOptions => ({
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    colors: ['#faad14', '#52c41a', '#ff4d4f'],
    dataLabels: { enabled: false },
    xaxis: { categories: clubs.map(c => c.name) },
    yaxis: { min: 0, tickAmount: 5, labels: { formatter: (v: number) => String(Math.round(v)) } },
    legend: { position: 'top' },
    tooltip: { shared: true, intersect: false },
    grid: { borderColor: '#f0f0f0' },
  }), [clubs]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'clubs':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Danh sách Câu lạc bộ</Title>
              <Space>
                <Input.Search
                  placeholder="Tìm tên CLB, chủ nhiệm..."
                  style={{ width: 260 }}
                  value={clubSearch}
                  onChange={e => setClubSearch(e.target.value)}
                  allowClear
                />
                <Button type="primary" onClick={openAddClub}>+ Thêm CLB</Button>
              </Space>
            </div>
            <Table dataSource={filteredClubs} columns={clubColumns} rowKey="id" size="middle" bordered pagination={{ pageSize: 8 }} />
          </div>
        );

      case 'applications':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Quản lý Đơn đăng ký</Title>
              <Space wrap>
                <Input.Search
                  placeholder="Tìm họ tên, email..."
                  style={{ width: 220 }}
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  allowClear
                />
                <Select placeholder="Lọc trạng thái" style={{ width: 140 }} allowClear value={appStatusFilter || undefined} onChange={v => setAppStatusFilter(v || '')}>
                  <Option value="Pending">Chờ duyệt</Option>
                  <Option value="Approved">Đã duyệt</Option>
                  <Option value="Rejected">Từ chối</Option>
                </Select>
                <Select placeholder="Lọc CLB" style={{ width: 160 }} allowClear value={appClubFilter || undefined} onChange={v => setAppClubFilter(v || '')}>
                  {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                </Select>
                <Button type="primary" onClick={openAddApp}>+ Thêm đơn</Button>
              </Space>
            </div>

            {selectedAppIds.length > 0 && (
              <Alert
                style={{ marginBottom: 12 }}
                message={
                  <Space>
                    <Text>Đã chọn <b>{selectedAppIds.length}</b> đơn</Text>
                    <Button size="small" type="primary" onClick={() => approveApps(selectedAppIds)}>
                      Duyệt {selectedAppIds.length} đơn đã chọn
                    </Button>
                    <Button size="small" danger onClick={() => openRejectModal(selectedAppIds)}>
                      Từ chối {selectedAppIds.length} đơn đã chọn
                    </Button>
                  </Space>
                }
                type="info"
                showIcon
              />
            )}

            <Table
              dataSource={filteredApps}
              columns={appColumns}
              rowKey="id"
              size="middle"
              bordered
              rowSelection={{ selectedRowKeys: selectedAppIds, onChange: keys => setSelectedAppIds(keys as string[]) }}
              pagination={{ pageSize: 8 }}
            />
          </div>
        );

      case 'members':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Quản lý Thành viên</Title>
              <Space>
                <Select style={{ width: 200 }} value={memberClubFilter} onChange={v => { setMemberClubFilter(v); setSelectedMemberIds([]); }}>
                  <Option value="">Tất cả CLB</Option>
                  {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                </Select>
                {selectedMemberIds.length > 0 && (
                  <Button onClick={() => { setTargetClubId(''); setChangeClubModal(true); }}>
                    Đổi CLB cho {selectedMemberIds.length} thành viên
                  </Button>
                )}
              </Space>
            </div>
            <Table
              dataSource={members}
              columns={memberColumns}
              rowKey="id"
              size="middle"
              bordered
              rowSelection={{ selectedRowKeys: selectedMemberIds, onChange: keys => setSelectedMemberIds(keys as string[]) }}
              pagination={{ pageSize: 8 }}
            />
          </div>
        );

      case 'statistics':
        return (
          <div>
            <Title level={4}>Báo cáo & Thống kê</Title>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card><Statistic title="Tổng số CLB" value={clubs.length} valueStyle={{ color: '#1890ff' }} /></Card>
              </Col>
              <Col span={6}>
                <Card><Statistic title="Chờ duyệt" value={totalPending} valueStyle={{ color: '#faad14' }} /></Card>
              </Col>
              <Col span={6}>
                <Card><Statistic title="Đã duyệt" value={totalApproved} valueStyle={{ color: '#52c41a' }} /></Card>
              </Col>
              <Col span={6}>
                <Card><Statistic title="Từ chối" value={totalRejected} valueStyle={{ color: '#ff4d4f' }} /></Card>
              </Col>
            </Row>
            <Card title="Số đơn đăng ký theo từng CLB">
              <ReactApexChart type="bar" series={apexSeries} options={apexOptions} height={340} />
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0', display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, padding: '0 24px', whiteSpace: 'nowrap' }}>
          Quản lý CLB
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => setActiveMenu(key as string)}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Menu.Item key="clubs">Câu lạc bộ</Menu.Item>
          <Menu.Item key="applications">Đơn đăng ký</Menu.Item>
          <Menu.Item key="members">Thành viên</Menu.Item>
          <Menu.Item key="statistics">Thống kê</Menu.Item>
        </Menu>
      </Header>

      <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 360 }}>
        {renderContent()}
      </Content>

      {/* Modal thêm/sửa CLB */}
      <Modal
        title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm CLB mới'}
        visible={clubModal}
        onOk={saveClub}
        onCancel={() => setClubModal(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={clubForm} layout="vertical">
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true, message: 'Nhập tên CLB' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="leader" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Nhập tên chủ nhiệm' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (HTML)">
            <TextArea rows={3} placeholder="<p>Mô tả CLB...</p>" />
          </Form.Item>
          <Form.Item name="active" label="Hoạt động" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm/sửa đơn đăng ký */}
      <Modal
        title={editingApp ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
        visible={appModal}
        onOk={saveApp}
        onCancel={() => setAppModal(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={640}
      >
        <Form form={appForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại' }]}><Input /></Form.Item></Col>
            <Col span={12}>
              <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Chọn giới tính' }]}>
                <Select>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item name="address" label="Địa chỉ"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="skills" label="Sở trường"><Input /></Form.Item></Col>
            <Col span={24}>
              <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true, message: 'Chọn CLB' }]}>
                <Select placeholder="Chọn CLB">
                  {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}><Form.Item name="reason" label="Lý do đăng ký"><TextArea rows={2} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal xem chi tiết đơn */}
      <Modal
        title="Chi tiết đơn đăng ký"
        visible={!!viewApp}
        onCancel={() => setViewApp(null)}
        footer={<Button onClick={() => setViewApp(null)}>Đóng</Button>}
        width={600}
      >
        {viewApp && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Họ tên" span={2}>{viewApp.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewApp.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{viewApp.phone}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{genderLabel[viewApp.gender]}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{viewApp.address}</Descriptions.Item>
            <Descriptions.Item label="Sở trường" span={2}>{viewApp.skills}</Descriptions.Item>
            <Descriptions.Item label="CLB" span={2}>{clubMap[viewApp.clubId]?.name}</Descriptions.Item>
            <Descriptions.Item label="Lý do" span={2}>{viewApp.reason}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={statusColor[viewApp.status]}>{statusLabel[viewApp.status]}</Tag>
            </Descriptions.Item>
            {viewApp.note && <Descriptions.Item label="Ghi chú" span={2}>{viewApp.note}</Descriptions.Item>}
            <Descriptions.Item label="Ngày tạo" span={2}>{viewApp.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal lịch sử thao tác */}
      <Modal
        title={`Lịch sử thao tác — ${historyApp?.fullName}`}
        visible={!!historyApp}
        onCancel={() => setHistoryApp(null)}
        footer={<Button onClick={() => setHistoryApp(null)}>Đóng</Button>}
        width={500}
      >
        {historyApp && (
          historyApp.history.length === 0
            ? <Text type="secondary">Chưa có lịch sử thao tác.</Text>
            : <Timeline>
              {historyApp.history.map((h, i) => (
                <Timeline.Item
                  key={i}
                  color={h.action === 'Approved' ? 'green' : h.action === 'Rejected' ? 'red' : 'blue'}
                >
                  <Text strong>Admin</Text> đã <Tag color={statusColor[h.action]}>{statusLabel[h.action]}</Tag>
                  vào lúc <Text code>{h.time}</Text>
                  {h.reason && <div><Text type="secondary">Lý do: {h.reason}</Text></div>}
                </Timeline.Item>
              ))}
            </Timeline>
        )}
      </Modal>

      {/* Modal từ chối đơn */}
      <Modal
        title={`Từ chối ${rejectTargets.length} đơn đăng ký`}
        visible={rejectModal}
        onOk={confirmReject}
        onCancel={() => setRejectModal(false)}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Lý do từ chối" required>
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối (bắt buộc)..."
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal đổi CLB cho thành viên */}
      <Modal
        title={`Đổi CLB cho ${selectedMemberIds.length} thành viên`}
        visible={changeClubModal}
        onOk={confirmChangeClub}
        onCancel={() => setChangeClubModal(false)}
        okText="Xác nhận đổi CLB"
        cancelText="Hủy"
      >
        <Alert
          message={`Bạn đang đổi CLB cho ${selectedMemberIds.length} thành viên. Vui lòng chọn CLB muốn chuyển đến.`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form layout="vertical">
          <Form.Item label="CLB muốn chuyển đến" required>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn CLB"
              value={targetClubId || undefined}
              onChange={v => setTargetClubId(v)}
            >
              {clubs.filter(c => c.id !== memberClubFilter).map(c => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;