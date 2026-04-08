import React, { useState } from 'react';
import {
  Layout, Menu, Table, Button, Modal, Form, Input, InputNumber, Select,
  Rate, Tag, Space, Popconfirm, Statistic, Row, Col, Card, 
  message, Typography, Badge, Avatar,
  Progress, Tooltip, Descriptions, Switch,
  Drawer,
} from 'antd';
import {
  DashboardOutlined, EnvironmentOutlined, BarChartOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined,EyeOutlined,
  DollarOutlined, CalendarOutlined, 
  FileImageOutlined, MenuOutlined,
  BellOutlined, StarOutlined,
} from '@ant-design/icons';
import Chart from 'react-apexcharts';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;


const COLORS = ['#1a237e', '#1565c0', '#0288d1', '#00838f', '#2e7d32', '#f57f17', '#e65100', '#c62828'];

const initialDestinations = [
  { 
    id: 1, 
    name: 'Đà Lạt', 
    location: 'Lâm Đồng', 
    type: 'mountain', 
    rating: 4.8, 
    price: 3500000, 
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', 
    description: 'Thành phố ngàn hoa với khí hậu ôn hòa và kiến trúc Pháp cổ kính.', 
    duration: 3, 
    food: 1000000, 
    hotel: 1500000, 
    transport: 1000000, 
    status: true 
  },
  { 
    id: 2, 
    name: 'Phú Quốc', 
    location: 'Kiên Giang', 
    type: 'beach', 
    rating: 4.9, 
    price: 6500000, 
    image: "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg",
    description: 'Đảo ngọc với những bãi cát trắng mịn và hoàng hôn tuyệt đẹp trên biển.', 
    duration: 4, 
    food: 2000000, 
    hotel: 3000000, 
    transport: 1500000, 
    status: true 
  },
  { 
    id: 3, 
    name: 'Hội An', 
    location: 'Quảng Nam', 
    type: 'city', 
    rating: 4.7, 
    price: 2800000, 
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400', 
    description: 'Khu phố cổ bình yên với ánh đèn lồng rực rỡ và di sản văn hóa thế giới.', 
    duration: 2, 
    food: 800000, 
    hotel: 1200000, 
    transport: 800000, 
    status: true 
  },
  { 
    id: 4, 
    name: 'Sapa', 
    location: 'Lào Cai', 
    type: 'mountain', 
    rating: 4.6, 
    price: 4200000, 
    image: 'https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2022/12/1/tour-trekking-fansipan-1669866956572303961792.jpg', 
    description: 'Chinh phục đỉnh Fansipan và khám phá ruộng bậc thang kỳ vĩ.', 
    duration: 3, 
    food: 1200000, 
    hotel: 1800000, 
    transport: 1200000, 
    status: true 
  },
  { 
    id: 5, 
    name: 'Ninh Bình', 
    location: 'Ninh Bình', 
    type: 'mountain', 
    rating: 4.5, 
    price: 3100000, 
    image: 'https://bizweb.dktcdn.net/100/474/438/files/tong-quan-ve-ninh-binh-2-ace0f918-c46f-4cc6-85c1-07414fc3a086.png?v=1760608769451', 
    description: 'Khám phá "Vịnh Hạ Long trên cạn" tại Tràng An và Tam Cốc.', 
    duration: 2, 
    food: 900000, 
    hotel: 1300000, 
    transport: 900000, 
    status: false 
  },
  {
  id: 6,
  name: 'Nha Trang',
  location: 'Khánh Hòa',
  type: 'beach',
  rating: 4.6,
  price: 4800000,
  image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Nha_Trang_beach.jpg',
  description: 'Tắm biển trong xanh, trải nghiệm lặn ngắm san hô và vui chơi tại VinWonders Nha Trang.',
  duration: 3,
  food: 1300000,
  hotel: 2000000,
  transport: 1500000,
  popular: true,
  status: true
}
];

const monthlyData = [
  { month: 'T1', itineraries: 150, revenue: 520000000 },
  { month: 'T2', itineraries: 180, revenue: 680000000 },
  { month: 'T3', itineraries: 130, revenue: 450000000 },
  { month: 'T4', itineraries: 240, revenue: 890000000 },
  { month: 'T5', itineraries: 210, revenue: 750000000 },
  { month: 'T6', itineraries: 320, revenue: 1100000000 },
  { month: 'T7', itineraries: 350, revenue: 1250000000 },
  { month: 'T8', itineraries: 310, revenue: 1080000000 },
  { month: 'T9', itineraries: 190, revenue: 620000000 },
  { month: 'T10', itineraries: 160, revenue: 550000000 },
  { month: 'T11', itineraries: 140, revenue: 480000000 },
  { month: 'T12', itineraries: 230, revenue: 820000000 },
];

const popularDestinations = [
  { name: 'Phú Quốc', count: 425, revenue: 2762500000 },
  { name: 'Đà Lạt', count: 389, revenue: 1361500000 },
  { name: 'Đà Nẵng', count: 312, revenue: 1560000000 },
  { name: 'Hội An', count: 256, revenue: 716800000 },
  { name: 'Sapa', count: 198, revenue: 831600000 },
  { name: 'Nha Trang', count: 300, revenue: 600000000 },
];

const categoryRevenue = [
  { name: 'Lưu trú', value: 4500000000, color: '#1a237e' },
  { name: 'Vé máy bay', value: 3200000000, color: '#0288d1' },
  { name: 'Ăn uống', value: 1800000000, color: '#2e7d32' },
  { name: 'Tour tham quan', value: 1200000000, color: '#f57f17' },
  { name: 'Bảo hiểm/Khác', value: 450000000, color: '#c62828' },
];

const typeLabels: Record<string, string> = { 
  beach: 'Du lịch Biển', 
  mountain: 'Núi', 
  city: 'Đô thị' 
};

const typeColors: Record<string, string> = { 
  beach: '#0288d1', 
  mountain: '#2e7d32', 
  city: '#f57f17' 
};

export default function TravelPlannerAdmin() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false);

  const [destinations, setDestinations] = useState(initialDestinations);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string>('');

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalItineraries = monthlyData.reduce((sum, m) => sum + m.itineraries, 0);
  const thisMonthRevenue = monthlyData[monthlyData.length - 1].revenue;
  const lastMonthRevenue = monthlyData[monthlyData.length - 2].revenue;
  const revenueGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);

  const openEdit = (record?: any) => {
    setEditingRecord(record || null);
    if (record) {
      form.setFieldsValue(record);
      setImagePreview(record.image || '');
    } else {
      form.resetFields();
      setImagePreview('');
    }
    setEditModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setDestinations(prev => prev.map(d => d.id === editingRecord.id ? { ...d, ...values, image: imagePreview || d.image } : d));
        message.success('Đã cập nhật điểm đến!');
      } else {
        const newId = Math.max(...destinations.map(d => d.id)) + 1;
        setDestinations(prev => [...prev, { ...values, id: newId, image: imagePreview || 'https://images.unsplash.com/photo-1506461883276-594a12b5bca3?w=100', status: true }]);
        message.success('Đã thêm điểm đến mới!');
      }
      setEditModalVisible(false);
    });
  };

  const handleDelete = (id: number) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
    message.success('Đã xóa điểm đến!');
  };

  const toggleStatus = (id: number) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, status: !d.status } : d));
  };

  const destColumns = [
    {
      title: 'Điểm đến',
      dataIndex: 'name',
      render: (_: any, r: any) => (
        <Space>
          <img src={r.image} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            <Text strong>{r.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>📍 {r.location}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (t: string) => <Tag color={typeColors[t]}>{typeLabels[t]}</Tag>,
      filters: [{ text: 'Biển', value: 'beach' }, { text: 'Núi', value: 'mountain' }, { text: 'Thành phố', value: 'city' }],
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      render: (v: number) => <Rate disabled value={v} style={{ fontSize: 12 }} />,
      sorter: (a: any, b: any) => a.rating - b.rating,
    },
    {
      title: 'Giá (đ)',
      dataIndex: 'price',
      render: (v: number) => <Text strong style={{ color: '#34495e' }}>{v.toLocaleString()}</Text>,
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      render: (v: number) => `${v} ngày`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (v: boolean, r: any) => (
        <Switch checked={v} onChange={() => toggleStatus(r.id)} checkedChildren="Active" unCheckedChildren="Off" />
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" onClick={() => { setEditingRecord(r); setViewModalVisible(true); }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" type="primary" onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm title="Xóa điểm đến?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const styles: Record<string, React.CSSProperties> = {
    layout: { minHeight: '100vh', background: '#f5f5f5' },
    sider: { background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)', boxShadow: '2px 0 8px rgba(0,0,0,0.2)' },
    header: {
      background: '#2c3e50', padding: '0 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, height: 64,
    },
    content: { padding: '20px 24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' },
    statCard: { borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    chartCard: { borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: '#fff' },
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'destinations', icon: <EnvironmentOutlined />, label: 'Quản lý điểm đến' },
    { key: 'statistics', icon: <BarChartOutlined />, label: 'Thống kê' },
  ];

  const renderDashboard = () => (
    <div>
      <Title level={3} style={{ color: '#2c3e50', marginBottom: 16 }}>📊 Tổng quan hệ thống</Title>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          {
            title: 'Tổng doanh thu', value: `${(totalRevenue / 1000000).toFixed(0)}M đ`,
            icon: <DollarOutlined />, gradient: 'linear-gradient(135deg, #2c3e50, #34495e)',
            sub: `+${revenueGrowth}% so với tháng trước`,
          },
          {
            title: 'Lịch trình đã tạo', value: totalItineraries,
            icon: <CalendarOutlined />, gradient: 'linear-gradient(135deg, #34495e, #7f8c8d)',
            sub: `${monthlyData[monthlyData.length - 1].itineraries} trong tháng này`,
          },
          {
            title: 'Điểm đến hoạt động', value: destinations.filter(d => d.status).length,
            icon: <EnvironmentOutlined />, gradient: 'linear-gradient(135deg, #7f8c8d, #95a5a6)',
            sub: `/ ${destinations.length} tổng số`,
          },
          {
            title: 'Điểm đánh giá TB', value: (destinations.reduce((s, d) => s + d.rating, 0) / destinations.length).toFixed(1),
            icon: <StarOutlined />, gradient: 'linear-gradient(135deg, #34495e, #2c3e50)',
            sub: 'Trung bình tất cả điểm đến',
          },
        ].map((kpi, i) => (
          <Col xs={12} sm={12} md={6} key={i}>
            <Card style={{ ...styles.statCard, background: kpi.gradient, border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{kpi.title}</Text>
                  <div style={{ color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{kpi.value}</div>
                  <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{kpi.sub}</Text>
                </div>
                <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.4)' }}>{kpi.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>📈 Lịch trình theo tháng</span>}>
            <Chart
              type="area"
              series={[{ name: 'Lịch trình', data: monthlyData.map(m => m.itineraries) }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: monthlyData.map(m => m.month) },
                colors: ['#34495e'],
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0 } },
                stroke: { curve: 'smooth', width: 2 },
              }}
              height={250}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>🏆 Top điểm đến</span>}>
            {popularDestinations.map((dest, i) => (
              <div key={dest.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Avatar style={{ background: COLORS[i], width: 24, height: 24, fontSize: 11 }}>{i + 1}</Avatar>
                <div style={{ flex: 1, margin: '0 8px' }}>
                  <Text strong style={{ fontSize: 13 }}>{dest.name}</Text>
                  <Progress percent={Math.round(dest.count / popularDestinations[0].count * 100)} showInfo={false} strokeColor={COLORS[i]} size="small" />
                </div>
                <Text style={{ fontSize: 12, color: '#666' }}>{dest.count} lịch</Text>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>💰 Doanh thu theo tháng</span>}>
            <Chart
              type="bar"
              series={[{ name: 'Doanh thu', data: monthlyData.map(m => m.revenue) }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: monthlyData.map(m => m.month) },
                colors: ['#34495e'],
                yaxis: { labels: { formatter: v => `${(v / 1000000).toFixed(0)}M` } },
              }}
              height={220}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>📊 Doanh thu theo hạng mục</span>}>
            <Chart
              type="pie"
              series={categoryRevenue.map(c => c.value)}
              options={{
                labels: categoryRevenue.map(c => c.name),
                colors: categoryRevenue.map(c => c.color),
                legend: { position: 'bottom' },
              }}
              height={220}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderDestinations = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <Title level={3} style={{ color: '#2c3e50', margin: 0 }}>🗺️ Quản lý điểm đến</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()} style={{ background: '#34495e', borderColor: '#34495e' }}>
          Thêm điểm đến
        </Button>
      </div>

      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {[
          { label: 'Tổng điểm đến', value: destinations.length, color: '#34495e' },
          { label: 'Đang hoạt động', value: destinations.filter(d => d.status).length, color: '#27ae60' },
          { label: 'Tạm dừng', value: destinations.filter(d => !d.status).length, color: '#e74c3c' },
        ].map((s, i) => (
          <Col xs={8} key={i}>
            <Card size="small" style={{ borderRadius: 10, borderLeft: `4px solid ${s.color}` }}>
              <Statistic title={s.label} value={s.value} valueStyle={{ fontSize: 20, color: s.color, fontWeight: 700 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <Table
          columns={destColumns}
          dataSource={destinations}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Card>
    </div>
  );

  const renderStatistics = () => (
    <div>
      <Title level={3} style={{ color: '#2c3e50', marginBottom: 16 }}>📈 Thống kê chi tiết</Title>

      <Row gutter={[16, 16]}>
         <Col xs={24}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>Lịch trình & Doanh thu theo tháng</span>}>
            <Chart
              type="bar"
              series={[
                { name: 'Lịch trình', data: monthlyData.map(m => m.itineraries) },
                { name: 'Doanh thu (M)', data: monthlyData.map(m => m.revenue / 1000000) }
              ]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: monthlyData.map(m => m.month) },
                colors: ['#7f8c8d', '#34495e'],
              }}
              height={300}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>Điểm đến phổ biến</span>}>
            <Chart
              type="bar"
              series={[{ name: 'Lượt lịch trình', data: popularDestinations.map(d => d.count) }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: popularDestinations.map(d => d.name) },
                colors: ['#34495e'],
                plotOptions: { bar: { horizontal: true } },
              }}
              height={250}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>Doanh thu từng hạng mục</span>}>
            <Chart
              type="donut"
              series={categoryRevenue.map(c => c.value)}
              options={{
                labels: categoryRevenue.map(c => c.name),
                colors: categoryRevenue.map(c => c.color),
                legend: { position: 'bottom' },
              }}
              height={250}
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card style={styles.chartCard} title={<span style={{ color: '#2c3e50', fontWeight: 700 }}>Doanh thu chi tiết theo điểm đến</span>}>
            <Table
              dataSource={popularDestinations}
              rowKey="name"
              pagination={false}
              columns={[
                { title: 'Điểm đến', dataIndex: 'name', render: (v: string) => <Text strong>{v}</Text> },
                { title: 'Số lịch trình', dataIndex: 'count', sorter: (a: any, b: any) => a.count - b.count },
                { title: 'Doanh thu', dataIndex: 'revenue', render: (v: number) => <Text style={{ color: '#2c3e50', fontWeight: 700 }}>{v.toLocaleString()}đ</Text>, sorter: (a: any, b: any) => a.revenue - b.revenue },
                { title: 'Tỷ lệ', render: (_: any, r: any) => <Progress percent={Math.round(r.count / popularDestinations[0].count * 100)} strokeColor="#34495e" /> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout style={styles.layout}>
      {/* Header với Horizontal Menu */}
      <Header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>TravelVN</Text>
          <Menu
            mode="horizontal"
            selectedKeys={[activeMenu]}
            theme="dark"
            style={{ background: 'transparent', border: 'none', flex: 1, minHeight: 'auto' }}
            onClick={({ key }) => setActiveMenu(key)}
            items={menuItems}
            className="desktop-nav"
          />
        </div>
        <Space>
          <Badge count={3}>
            <Button icon={<BellOutlined />} type="text" style={{ color: '#fff' }} />
          </Badge>
          <Avatar style={{ background: '#fff', cursor: 'pointer', color: '#2c3e50' }}>A</Avatar>
        </Space>
      </Header>

      {/* Mobile Menu Button */}
      <Button
        icon={<MenuOutlined style={{ color: '#fff', fontSize: 20 }} />}
        type="text"
        onClick={() => setMobileSiderOpen(true)}
        className="mobile-menu-btn"
        style={{ display: 'none', position: 'fixed', top: 16, right: 16, zIndex: 101 }}
      />

      {/* Mobile Drawer Menu */}
      <Drawer
        title={<span style={{ fontSize: 16, fontWeight: 700 }}>✈️ Menu</span>}
        placement="left"
        onClose={() => setMobileSiderOpen(false)}
        visible={mobileSiderOpen}
        width={240}
      >
        <Menu
          mode="vertical"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => { setActiveMenu(key); setMobileSiderOpen(false); }}
          items={menuItems}
        />
      </Drawer>

      <Content style={styles.content}>
          {activeMenu === 'dashboard' && renderDashboard()}
          {activeMenu === 'destinations' && renderDestinations()}
          {activeMenu === 'statistics' && renderStatistics()}
        </Content>

      {/* Edit/Add Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
        okButtonProps={{ style: { background: '#34495e', borderColor: '#34495e' } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
                <Input placeholder="VD: Đà Lạt" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                <Input placeholder="VD: Lâm Đồng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại">
                  <Option value="beach"> Biển</Option>
                  <Option value="mountain"> Núi</Option>
                  <Option value="city"> Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="price" label="Giá ước tính (đ)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="duration" label="Thời gian tham quan (ngày)" rules={[{ required: true }]}>
                <InputNumber min={1} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="food" label="Chi phí ăn uống/ngày (đ)">
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="hotel" label="Chi phí lưu trú/đêm (đ)">
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="transport" label="Chi phí di chuyển (đ)">
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} placeholder="Mô tả về điểm đến..." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Hình ảnh (URL)">
                <Input
                  value={imagePreview}
                  onChange={e => setImagePreview(e.target.value)}
                  placeholder="https://..."
                  prefix={<FileImageOutlined />}
                />
                {imagePreview && (
                  <img src={imagePreview} style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} onError={() => setImagePreview('')} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        title="📍 Chi tiết điểm đến"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={<Button onClick={() => setViewModalVisible(false)}>Đóng</Button>}
        width={600}
      >
        {editingRecord && (
          <div>
            <img src={editingRecord.image} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên">{editingRecord.name}</Descriptions.Item>
              <Descriptions.Item label="Địa điểm">{editingRecord.location}</Descriptions.Item>
              <Descriptions.Item label="Loại"><Tag color={typeColors[editingRecord.type]}>{typeLabels[editingRecord.type]}</Tag></Descriptions.Item>
              <Descriptions.Item label="Đánh giá"><Rate disabled value={editingRecord.rating} style={{ fontSize: 12 }} /></Descriptions.Item>
              <Descriptions.Item label="Giá">{editingRecord.price?.toLocaleString()}đ</Descriptions.Item>
              <Descriptions.Item label="Thời gian">{editingRecord.duration} ngày</Descriptions.Item>
              <Descriptions.Item label="Ăn uống">{editingRecord.food?.toLocaleString()}đ/ngày</Descriptions.Item>
              <Descriptions.Item label="Lưu trú">{editingRecord.hotel?.toLocaleString()}đ/đêm</Descriptions.Item>
              <Descriptions.Item label="Di chuyển">{editingRecord.transport?.toLocaleString()}đ</Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><Badge status={editingRecord.status ? 'success' : 'error'} text={editingRecord.status ? 'Hoạt động' : 'Tạm dừng'} /></Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>{editingRecord.description}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        .ant-menu-dark .ant-menu-item-selected { background: rgba(255,255,255,0.15) !important; border-radius: 4px; }
        .ant-menu-dark .ant-menu-item:hover { background: rgba(255,255,255,0.1) !important; border-radius: 4px; }
        .ant-menu-horizontal { border-bottom: none !important; }
        .ant-menu-horizontal .ant-menu-item-selected { background: rgba(255,255,255,0.2) !important; border-bottom: 3px solid #ffd700 !important; }
      `}</style>
    </Layout>
  );
}