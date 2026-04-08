import React, { useState, useMemo } from 'react';
import {
  Layout, Menu, Card, Row, Col, Rate, Tag, Button, Select, Slider, Input,
  Modal, InputNumber, Progress, Alert, Statistic,
  Badge,Tooltip, Divider, Space, Typography,
  Drawer, message, Empty,Timeline,
} from 'antd';
import {
  EnvironmentOutlined, PlusOutlined,
  DeleteOutlined, DollarOutlined, ClockCircleOutlined, CarOutlined,
  HomeOutlined, CoffeeOutlined, ShoppingOutlined, ThunderboltOutlined,
CalendarOutlined, HeartOutlined, SearchOutlined,
  MenuOutlined, 
} from '@ant-design/icons';
import Chart from 'react-apexcharts';

const { Header, Content, Footer } = Layout;
const { Title, Text} = Typography;
const { Option } = Select;

const destinations = [
  { 
    id: 1, 
    name: 'Đà Lạt', 
    location: 'Lâm Đồng', 
    type: 'mountain', 
    rating: 4.8, 
    price: 3500000, 
    image: 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-da-lat-2.jpg', 
    description: 'Thành phố ngàn hoa với khí hậu ôn hòa và kiến trúc Pháp cổ kính.', 
    duration: 3, 
    food: 1000000, 
    hotel: 1500000, 
    transport: 1000000, 
    popular: true 
  },
  { 
    id: 2, 
    name: 'Phú Quốc', 
    location: 'Kiên Giang', 
    type: 'beach', 
    rating: 4.9, 
    price: 6500000, 
    image: 'https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/23/phu-quoc-17506756503251936667562.jpg', 
    description: 'Đảo ngọc với những bãi cát trắng mịn và hoàng hôn tuyệt đẹp trên biển.', 
    duration: 4, 
    food: 2000000, 
    hotel: 3000000, 
    transport: 1500000, 
    popular: true 
  },
  { 
    id: 3, 
    name: 'Hội An', 
    location: 'Quảng Nam', 
    type: 'city', 
    rating: 4.7, 
    price: 2800000, 
    image: 'https://i1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g', 
    description: 'Khu phố cổ bình yên với ánh đèn lồng rực rỡ và di sản văn hóa thế giới.', 
    duration: 2, 
    food: 800000, 
    hotel: 1200000, 
    transport: 800000, 
    popular: true 
  },
  { 
    id: 4, 
    name: 'Sapa', 
    location: 'Lào Cai', 
    type: 'mountain', 
    rating: 4.6, 
    price: 4200000, 
    image: 'https://bizweb.dktcdn.net/100/474/438/files/tong-quan-ve-ninh-binh-2-ace0f918-c46f-4cc6-85c1-07414fc3a086.png?v=1760608769451', 
    description: 'Chinh phục đỉnh Fansipan và khám phá ruộng bậc thang kỳ vĩ.', 
    duration: 3, 
    food: 1200000, 
    hotel: 1800000, 
    transport: 1200000, 
    popular: true 
  },

  { 
    id: 5, 
    name: 'Ninh Bình', 
    location: 'Ninh Bình', 
    type: 'mountain', 
    rating: 4.5, 
    price: 3100000, 
    image: 'https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2022/12/1/tour-trekking-fansipan-1669866956572303961792.jpg', 
    description: 'Khám phá "Vịnh Hạ Long trên cạn" tại Tràng An và Tam Cốc.', 
    duration: 2, 
    food: 900000, 
    hotel: 1300000, 
    transport: 900000, 
    popular: false 
  },
  {
  id: 6,
  name: 'Nha Trang',
  location: 'Khánh Hòa',
  type: 'beach',
  rating: 4.6,
  price: 4800000,
  image: 'https://i1-dulich.vnecdn.net/2022/05/09/shutterstock-280926449-6744-15-3483-9174-1652070682.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=bGCo6Rv6DseMDE_07TT1Aw',
  description: 'Tắm biển trong xanh, trải nghiệm lặn ngắm san hô và vui chơi tại VinWonders Nha Trang.',
  duration: 3,
  food: 1300000,
  hotel: 2000000,
  transport: 1500000,
  popular: true
}
];

const typeLabels: Record<string, string> = { beach: 'Biển', mountain: 'Núi', city: 'Thành phố' };
const typeColors: Record<string, string> = { beach: 'blue', mountain: 'green', city: 'orange' };

const BUDGET_COLORS = ['#4096ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

export default function TravelPlannerUser() {
  const [activeTab, setActiveTab] = useState('explore');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [searchText, setSearchText] = useState('');

  const [itinerary, setItinerary] = useState<Array<{
    dayIndex: number; destinationId: number; date: string; notes: string;
  }>>([]);
  const [totalDays, setTotalDays] = useState(5);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const [totalBudget, setTotalBudget] = useState(10000000);
  const [budgetItems, setBudgetItems] = useState([
    { key: 'food', label: 'Ăn uống', amount: 2000000, icon: <CoffeeOutlined />, color: '#52c41a' },
    { key: 'hotel', label: 'Lưu trú', amount: 3000000, icon: <HomeOutlined />, color: '#4096ff' },
    { key: 'transport', label: 'Di chuyển', amount: 2000000, icon: <CarOutlined />, color: '#faad14' },
    { key: 'shopping', label: 'Mua sắm', amount: 1500000, icon: <ShoppingOutlined />, color: '#ff4d4f' },
    { key: 'other', label: 'Khác', amount: 500000, icon: <ThunderboltOutlined />, color: '#722ed1' },
  ]);

  const filteredDestinations = useMemo(() => {
    let list = [...destinations];
    if (filterType !== 'all') list = list.filter(d => d.type === filterType);
    if (filterRating > 0) list = list.filter(d => d.rating >= filterRating);
    list = list.filter(d => d.price >= priceRange[0] && d.price <= priceRange[1]);
    if (searchText) list = list.filter(d => d.name.toLowerCase().includes(searchText.toLowerCase()) || d.location.toLowerCase().includes(searchText.toLowerCase()));
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [filterType, filterRating, priceRange, sortBy, searchText]);

  const addToItinerary = (destinationId: number) => {
    const dest = destinations.find(d => d.id === destinationId);
    if (!dest) return;
    setItinerary(prev => [...prev, { dayIndex: selectedDay, destinationId, date: '', notes: '' }]);
    message.success(`Đã thêm ${dest.name} vào ngày ${selectedDay}!`);
    setAddModalVisible(false);
  };

  const removeFromItinerary = (index: number) => {
    setItinerary(prev => prev.filter((_, i) => i !== index));
    message.success('Đã xóa khỏi lịch trình!');
  };

  const itineraryByDay = useMemo(() => {
    const grouped: Record<number, typeof itinerary> = {};
    for (let i = 1; i <= totalDays; i++) grouped[i] = [];
    itinerary.forEach(item => {
      if (grouped[item.dayIndex]) grouped[item.dayIndex].push(item);
    });
    return grouped;
  }, [itinerary, totalDays]);

  const totalItineraryCost = useMemo(() => {
    return itinerary.reduce((sum, item) => {
      const dest = destinations.find(d => d.id === item.destinationId);
      return sum + (dest ? dest.food + dest.hotel + dest.transport : 0);
    }, 0);
  }, [itinerary]);

  const totalBudgetUsed = budgetItems.reduce((sum, b) => sum + b.amount, 0);
  const budgetOverrun = totalBudgetUsed > totalBudget;
  const budgetPercent = Math.min((totalBudgetUsed / totalBudget) * 100, 100);

  const pieData = budgetItems.map(b => ({ name: b.label, value: b.amount }));

  const navItems = [
    { key: 'explore', icon: <EnvironmentOutlined />, label: 'Khám phá' },
    { key: 'itinerary', icon: <CalendarOutlined />, label: 'Lịch trình' },
    { key: 'budget', icon: <DollarOutlined />, label: 'Ngân sách' },
  ];

  const styles: Record<string, React.CSSProperties> = {
    layout: { minHeight: '100vh', background: '#f5f5f5' },
    header: {
      background: '#2c3e50',
      padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    logo: { color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' },
    desktopMenu: { background: 'transparent', borderBottom: 'none', flex: 1, justifyContent: 'flex-end' },
    content: { padding: '20px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' },
    card: { borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' },
    filterBar: {
      background: '#fff', borderRadius: 8, padding: '16px', marginBottom: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    destCard: {
      borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none',
    },
    sectionTitle: { fontSize: 22, fontWeight: 700, color: '#2c3e50', marginBottom: 16 },
    dayCard: { background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    budgetCard: { background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    statCard: { background: 'linear-gradient(135deg, #34495e, #2c3e50)', borderRadius: 8, padding: 16, color: '#fff', textAlign: 'center' },
  };

  return (
    <Layout style={styles.layout}>
      <Header style={styles.header}>
        <div style={styles.logo}>TravelVN</div>
        <div className="desktop-nav" style={{ display: 'flex', gap: 8 }}>
          {navItems.map(item => (
            <Button
              key={item.key}
              type={activeTab === item.key ? 'primary' : 'text'}
              icon={item.icon}
              onClick={() => setActiveTab(item.key)}
              style={{ color: activeTab === item.key ? undefined : '#fff', fontWeight: 600 }}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button
          className="mobile-nav"
          type="text"
          icon={<MenuOutlined style={{ color: '#fff', fontSize: 20 }} />}
          onClick={() => setMobileMenuOpen(true)}
          style={{ display: 'none' }}
        />
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        visible={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={240}
      >
        <Menu
          mode="vertical"
          selectedKeys={[activeTab]}
          onClick={({ key }) => { setActiveTab(key); setMobileMenuOpen(false); }}
          items={navItems.map(item => ({ key: item.key, icon: item.icon, label: item.label }))}
        />
      </Drawer>

      <Content style={{ padding: '0 8px' }}>
        <div style={styles.content}>

          {activeTab === 'explore' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ color: '#2c3e50', margin: 0 }}>Khám phá điểm đến</Title>
                <Text type="secondary">Tìm kiếm địa điểm du lịch lý tưởng của bạn</Text>
              </div>

              {/* Filter Bar */}
              <div style={styles.filterBar}>
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} sm={8} md={6}>
                    <Input
                      placeholder="Tìm kiếm điểm đến..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Select value={filterType} onChange={setFilterType} style={{ width: '100%' }} placeholder="Loại hình">
                      <Option value="all">Tất cả</Option>
                      <Option value="beach"> Biển</Option>
                      <Option value="mountain">Núi</Option>
                      <Option value="city"> Thành phố</Option>
                    </Select>
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }} placeholder="Sắp xếp">
                      <Option value="rating"> Đánh giá cao</Option>
                      <Option value="price_asc"> Giá tăng dần</Option>
                      <Option value="price_desc"> Giá giảm dần</Option>
                    </Select>
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                    <div>
                      <Text style={{ fontSize: 12, color: '#666' }}>Đánh giá tối thiểu</Text>
                      <Select value={filterRating} onChange={setFilterRating} style={{ width: '100%' }}>
                        <Option value={0}>Tất cả</Option>
                        <Option value={4}>4+ ⭐</Option>
                        <Option value={4.5}>4.5+ ⭐</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col xs={12} sm={18} md={6}>
                    <div>
                      <Text style={{ fontSize: 12, color: '#666' }}>Giá: {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ</Text>
                      <Slider
                        range min={0} max={6000000} step={100000}
                        value={priceRange}
                        onChange={(v) => setPriceRange(v as [number, number])}
                        tipFormatter={v => `${(v || 0).toLocaleString()}đ`}
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Tìm thấy <b>{filteredDestinations.length}</b> điểm đến</Text>
                </div>
              </div>

              {filteredDestinations.length === 0 ? (
                <Empty description="Không tìm thấy điểm đến phù hợp" style={{ padding: 40 }} />
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredDestinations.map(dest => (
                    <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
                      <Card
                        style={styles.destCard}
                        hoverable
                        cover={
                          <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                            <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                              <Tag color={typeColors[dest.type]}>{typeLabels[dest.type]}</Tag>
                            </div>
                            {dest.popular && (
                              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                                <Tag color="gold">🔥 Hot</Tag>
                              </div>
                            )}
                          </div>
                        }
                        actions={[
                          <Tooltip title="Yêu thích"><HeartOutlined key="heart" /></Tooltip>,
                          <Button
                            type="primary" size="small" icon={<PlusOutlined />}
                            onClick={() => { setSelectedDay(1); setAddModalVisible(true); }}
                            style={{ fontSize: 12 }}
                          >
                            Thêm
                          </Button>,
                        ]}
                      >
                        <Card.Meta
                          title={<span style={{ fontWeight: 700, fontSize: 15 }}>{dest.name}</span>}
                          description={
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                <EnvironmentOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>{dest.location}</Text>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Rate disabled value={dest.rating} style={{ fontSize: 12 }} />
                                <Text strong style={{ color: '#34495e', fontSize: 13 }}>{dest.price.toLocaleString()}đ</Text>
                              </div>
                              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <Text style={{ fontSize: 11, color: '#666' }}><ClockCircleOutlined /> {dest.duration} ngày</Text>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <Title level={3} style={{ color: '#2c3e50', margin: 0 }}> Lịch trình du lịch</Title>
                  <Text type="secondary">Lên kế hoạch cho chuyến đi của bạn</Text>
                </div>
                <Space wrap>
                  <Text>Số ngày:</Text>
                  <InputNumber min={1} max={30} value={totalDays} onChange={v => setTotalDays(v || 1)} style={{ width: 80 }} />
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
                    Thêm điểm đến
                  </Button>
                </Space>
              </div>

              {/* Summary */}
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {[
                  { label: 'Tổng điểm đến', value: itinerary.length, icon: <EnvironmentOutlined />, color: '#34495e' },
                  { label: 'Tổng ngày', value: totalDays, icon: <CalendarOutlined />, color: '#7f8c8d' },
                  { label: 'Chi phí ước tính', value: `${(totalItineraryCost).toLocaleString()}đ`, icon: <DollarOutlined />, color: '#95a5a6' },
                ].map((stat, i) => (
                  <Col xs={8} key={i}>
                    <Card style={{ ...styles.card, background: `linear-gradient(135deg, ${stat.color}, ${stat.color}cc)`, border: 'none' }}>
                      <Statistic
                        title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{stat.label}</span>}
                        value={stat.value}
                        prefix={React.cloneElement(stat.icon as React.ReactElement, { style: { color: '#fff' } })}
                        valueStyle={{ color: '#fff', fontSize: 18, fontWeight: 700 }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Day-by-day */}
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <div key={day} style={styles.dayCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Title level={5} style={{ margin: 0, color: '#2c3e50' }}>
                       Ngày {day}
                      <Badge count={itineraryByDay[day]?.length || 0} style={{ marginLeft: 8, backgroundColor: '#34495e' }} />
                    </Title>
                    <Button
                      size="small" icon={<PlusOutlined />}
                      onClick={() => { setSelectedDay(day); setAddModalVisible(true); }}
                    >
                      Thêm
                    </Button>
                  </div>
                  {itineraryByDay[day]?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#aaa', borderRadius: 8, border: '2px dashed #e8e8e8' }}>
                      <CalendarOutlined style={{ fontSize: 24 }} />
                      <div>Chưa có điểm đến nào</div>
                    </div>
                  ) : (
                    <Timeline>
                      {itineraryByDay[day].map((item, idx) => {
                        const dest = destinations.find(d => d.id === item.destinationId);
                        if (!dest) return null;
                        const globalIdx = itinerary.findIndex(it => it === item);
                        return (
                          <Timeline.Item key={idx} color="blue">
                            <Card
                              size="small"
                              style={{ borderRadius: 8, border: '1px solid #e6f0ff' }}
                              extra={
                                <Button
                                  type="text" danger size="small" icon={<DeleteOutlined />}
                                  onClick={() => removeFromItinerary(globalIdx)}
                                />
                              }
                            >
                              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <img src={dest.image} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                  <Text strong>{dest.name}</Text>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <Tag color={typeColors[dest.type]}>{typeLabels[dest.type]}</Tag>
                                    <Text style={{ fontSize: 12 }}><ClockCircleOutlined /> {dest.duration} ngày</Text>
                                  </div>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    Chi phí: ~{(dest.food + dest.hotel + dest.transport).toLocaleString()}đ/người
                                  </Text>
                                </div>
                              </div>
                            </Card>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  )}
                </div>
              ))}
            </div>
          )}

          
          {activeTab === 'budget' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ color: '#2c3e50', margin: 0 }}> Quản lý ngân sách</Title>
                <Text type="secondary">Theo dõi và kiểm soát chi tiêu chuyến đi</Text>
              </div>

              {/* Budget Alert */}
              {budgetOverrun && (
                <Alert
                  message=" Cảnh báo vượt ngân sách!"
                  description={`Bạn đang vượt ngân sách ${(totalBudgetUsed - totalBudget).toLocaleString()}đ. Hãy điều chỉnh lại kế hoạch chi tiêu.`}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16, borderRadius: 12 }}
                />
              )}
              {!budgetOverrun && budgetPercent > 80 && (
                <Alert
                  message=" Gần đạt giới hạn ngân sách"
                  description={`Bạn đã sử dụng ${budgetPercent.toFixed(0)}% ngân sách. Hãy kiểm soát chi tiêu.`}
                  type="warning" showIcon style={{ marginBottom: 16, borderRadius: 12 }}
                />
              )}

              <Row gutter={[16, 16]}>
                {/* Total Budget Setting */}
                <Col xs={24} md={8}>
                  <div style={styles.budgetCard}>
                    <Title level={5} style={{ color: '#2c3e50' }}>Tổng ngân sách</Title>
                    <InputNumber
                      value={totalBudget}
                      onChange={v => setTotalBudget(v || 0)}
                      formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={v => v?.replace(/,/g, '') as any}
                      style={{ width: '100%', marginBottom: 12 }}
                      addonAfter="đ"
                    />
                    <div style={{ marginBottom: 8 }}>
                      <Text>Đã dùng: <b>{totalBudgetUsed.toLocaleString()}đ</b></Text>
                    </div>
                    <Progress
                      percent={budgetPercent}
                      status={budgetOverrun ? 'exception' : budgetPercent > 80 ? 'active' : 'normal'}
                      strokeColor={budgetOverrun ? '#e74c3c' : budgetPercent > 80 ? '#f39c12' : '#27ae60'}
                    />
                    <Divider />
                    <Row gutter={8}>
                      <Col span={12}>
                        <Statistic title="Còn lại" value={Math.max(0, totalBudget - totalBudgetUsed)} suffix="đ"
                          valueStyle={{ fontSize: 14, color: '#27ae60' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic title="Đã dùng" value={totalBudgetUsed} suffix="đ"
                          valueStyle={{ fontSize: 14, color: budgetOverrun ? '#e74c3c' : '#3498db' }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Pie Chart */}
                <Col xs={24} md={8}>
                  <div style={styles.budgetCard}>
                    <Title level={5} style={{ color: '#2c3e50' }}>Phân bổ ngân sách</Title>
                    <Chart
                      type="pie"
                      series={pieData.map(p => p.value)}
                      options={{
                        labels: pieData.map(p => p.name),
                        colors: BUDGET_COLORS,
                        legend: { position: 'bottom' },
                      }}
                      height={220}
                    />
                  </div>
                </Col>

                {/* Budget Items */}
                <Col xs={24} md={8}>
                  <div style={styles.budgetCard}>
                    <Title level={5} style={{ color: '#2c3e50' }}>Chi tiết từng hạng mục</Title>
                    {budgetItems.map((item, idx) => (
                      <div key={item.key} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Space>
                            <span style={{ color: item.color }}>{item.icon}</span>
                            <Text>{item.label}</Text>
                          </Space>
                          <InputNumber
                            value={item.amount}
                            size="small"
                            style={{ width: 120 }}
                            formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={v => v?.replace(/,/g, '') as any}
                            onChange={v => {
                              setBudgetItems(prev => prev.map((b, i) => i === idx ? { ...b, amount: v || 0 } : b));
                            }}
                          />
                        </div>
                        <Progress
                          percent={totalBudget > 0 ? Math.min((item.amount / totalBudget) * 100, 100) : 0}
                          strokeColor={item.color} showInfo={false} size="small"
                        />
                      </div>
                    ))}
                  </div>
                </Col>

                {/* Bar Chart */}
                <Col xs={24}>
                  <div style={styles.budgetCard}>
                    <Title level={5} style={{ color: '#2c3e50' }}>So sánh ngân sách theo hạng mục</Title>
                    <Chart
                      type="bar"
                      series={[
                        { name: 'Chi tiêu', data: budgetItems.map(b => b.amount) },
                        { name: 'Giới hạn', data: budgetItems.map(() => totalBudget / budgetItems.length) }
                      ]}
                      options={{
                        chart: { toolbar: { show: false } },
                        xaxis: { categories: budgetItems.map(b => b.label) },
                        colors: ['#4096ff', '#ffa940'],
                        yaxis: { labels: { formatter: v => `${(v / 1000000).toFixed(1)}M` } },
                      }}
                      height={250}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#2c3e50', color: 'rgba(255,255,255,0.6)', padding: '16px' }}>
        TravelVN © 2026 — Lập kế hoạch du lịch thông minh
      </Footer>

      {/* Add to itinerary Modal */}
      <Modal
        title="Thêm điểm đến vào lịch trình"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: 12 }}>
          <Text>Chọn ngày: </Text>
          <Select value={selectedDay} onChange={setSelectedDay} style={{ width: 120 }}>
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => (
              <Option key={d} value={d}>Ngày {d}</Option>
            ))}
          </Select>
        </div>
        <Row gutter={[12, 12]}>
          {destinations.map(dest => (
            <Col xs={24} sm={12} key={dest.id}>
              <Card
                size="small" hoverable style={{ borderRadius: 8 }}
                onClick={() => addToItinerary(dest.id)}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={dest.image} style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover' }} />
                  <div>
                    <Text strong>{dest.name}</Text>
                    <div><Tag color={typeColors[dest.type]} style={{ fontSize: 11 }}>{typeLabels[dest.type]}</Tag></div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{dest.price.toLocaleString()}đ</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        .ant-card-hoverable:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important; }
      `}</style>
    </Layout>
  );
}