import { useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Tag,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Popconfirm,
  message,
  InputNumber,
  Divider,
  Badge,
  Descriptions,
  Empty,
  Alert,
  Tooltip,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TrophyOutlined,
  UserOutlined,
  CalendarOutlined,
  NumberOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import moment, { Moment } from "moment"; 

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type FieldType = "String" | "Number" | "Date";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
}

interface DiplomaBook {
  id: string;
  year: number;
  name: string;
  createdAt: string;
  currentSeq: number;
}

interface Decision {
  id: string;
  decisionNumber: string;
  issuedDate: string;
  summary: string;
  bookId: string;
  lookupCount: number;
}

interface Diploma {
  id: string;
  sequenceNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  birthDate: string;
  decisionId: string;
  bookId: string;
  customFields: Record<string, string | number>;
}

const INITIAL_BOOKS: DiplomaBook[] = [
  { id: "book-2024", year: 2024, name: "Sổ văn bằng 2024", createdAt: "2024-01-01", currentSeq: 3 },
  { id: "book-2025", year: 2025, name: "Sổ văn bằng 2025", createdAt: "2025-01-01", currentSeq: 2 },
];

const INITIAL_DECISIONS: Decision[] = [
  { id: "dec-1", decisionNumber: "45/QĐ-ĐHBK", issuedDate: "2024-06-15", summary: "Quyết định tốt nghiệp đợt tháng 6/2024", bookId: "book-2024", lookupCount: 12 },
  { id: "dec-2", decisionNumber: "102/QĐ-ĐHBK", issuedDate: "2024-12-20", summary: "Quyết định tốt nghiệp đợt tháng 12/2024", bookId: "book-2024", lookupCount: 8 },
  { id: "dec-3", decisionNumber: "30/QĐ-ĐHBK", issuedDate: "2025-06-10", summary: "Quyết định tốt nghiệp đợt tháng 6/2025", bookId: "book-2025", lookupCount: 3 },
];

const INITIAL_FIELDS: CustomField[] = [
  { id: "f1", name: "Dân tộc", type: "String", required: false },
  { id: "f2", name: "Nơi sinh", type: "String", required: false },
  { id: "f3", name: "Điểm trung bình", type: "Number", required: true },
  { id: "f4", name: "Xếp loại", type: "String", required: true },
  { id: "f5", name: "Hệ đào tạo", type: "String", required: true },
  { id: "f6", name: "Ngày nhập học", type: "Date", required: false },
];

const INITIAL_DIPLOMAS: Diploma[] = [
  { id: "d1", sequenceNumber: 1, diplomaNumber: "TN24/001", studentId: "SV001", fullName: "Nguyễn Văn An", birthDate: "2002-05-10", decisionId: "dec-1", bookId: "book-2024", customFields: { f1: "Kinh", f2: "Hà Nội", f3: 3.5, f4: "Giỏi", f5: "Chính quy", f6: "2020-09-01" } },
  { id: "d2", sequenceNumber: 2, diplomaNumber: "TN24/002", studentId: "SV002", fullName: "Trần Thị Bình", birthDate: "2001-11-22", decisionId: "dec-1", bookId: "book-2024", customFields: { f1: "Kinh", f2: "TP. Hồ Chí Minh", f3: 3.2, f4: "Khá", f5: "Chính quy", f6: "2020-09-01" } },
  { id: "d3", sequenceNumber: 3, diplomaNumber: "TN24/003", studentId: "SV003", fullName: "Lê Minh Cường", birthDate: "2002-03-15", decisionId: "dec-2", bookId: "book-2024", customFields: { f1: "Tày", f2: "Thái Nguyên", f3: 3.7, f4: "Giỏi", f5: "Chính quy", f6: "2020-09-01" } },
  { id: "d4", sequenceNumber: 1, diplomaNumber: "TN25/001", studentId: "SV004", fullName: "Phạm Thị Dung", birthDate: "2003-07-30", decisionId: "dec-3", bookId: "book-2025", customFields: { f1: "Kinh", f2: "Đà Nẵng", f3: 3.8, f4: "Xuất sắc", f5: "Chất lượng cao", f6: "2021-09-01" } },
  { id: "d5", sequenceNumber: 2, diplomaNumber: "TN25/002", studentId: "SV005", fullName: "Hoàng Văn Em", birthDate: "2003-01-05", decisionId: "dec-3", bookId: "book-2025", customFields: { f1: "Mường", f2: "Hòa Bình", f3: 3.0, f4: "Khá", f5: "Chính quy", f6: "2021-09-01" } },
];

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const fieldTypeIcon = (type: FieldType) => {
  if (type === "String") return <FontColorsOutlined style={{ color: "#1677ff" }} />;
  if (type === "Number") return <NumberOutlined style={{ color: "#52c41a" }} />;
  return <CalendarOutlined style={{ color: "#fa8c16" }} />;
};

const fieldTypeColor = (type: FieldType): string => {
  if (type === "String") return "blue";
  if (type === "Number") return "green";
  return "orange";
};

export default function App() {
  const [activeMenu, setActiveMenu] = useState("books");
  const [books, setBooks] = useState<DiplomaBook[]>(INITIAL_BOOKS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [customFields, setCustomFields] = useState<CustomField[]>(INITIAL_FIELDS);
  const [diplomas, setDiplomas] = useState<Diploma[]>(INITIAL_DIPLOMAS);

  const menuItems = [
    { key: "books", icon: <BookOutlined />, label: "Sổ văn bằng" },
    { key: "decisions", icon: <FileTextOutlined />, label: "Quyết định tốt nghiệp" },
    { key: "fields", icon: <SettingOutlined />, label: "Cấu hình biểu mẫu" },
    { key: "diplomas", icon: <TrophyOutlined />, label: "Thông tin văn bằng" },
    { key: "lookup", icon: <SearchOutlined />, label: "Tra cứu văn bằng" },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "books":
        return <BooksModule books={books} setBooks={setBooks} decisions={decisions} diplomas={diplomas} />;
      case "decisions":
        return <DecisionsModule decisions={decisions} setDecisions={setDecisions} books={books} />;
      case "fields":
        return <FieldsModule fields={customFields} setFields={setCustomFields} />;
      case "diplomas":
        return (
          <DiplomasModule
            diplomas={diplomas}
            setDiplomas={setDiplomas}
            decisions={decisions}
            books={books}
            customFields={customFields}
            setBooks={setBooks}
          />
        );
      case "lookup":
        return (
          <LookupModule
            diplomas={diplomas}
            decisions={decisions}
            books={books}
            customFields={customFields}
            setDecisions={setDecisions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="dark" style={{ background: "#001529" }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TrophyOutlined style={{ fontSize: 24, color: "#faad14" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>HỆ THỐNG QUẢN LÝ</div>
              <div style={{ color: "#faad14", fontWeight: 700, fontSize: 11 }}>SỔ VĂN BẰNG TỐT NGHIỆP</div>
            </div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeMenu]}
          items={menuItems}
          onClick={({ key }) => setActiveMenu(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#001529" }}>
            {menuItems.find((m) => m.key === activeMenu)?.label}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Phòng Quản lý Đào tạo
          </Text>
        </Header>
        <Content style={{ margin: "24px", background: "transparent" }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
}

function BooksModule({
  books,
  setBooks,
  decisions,
  diplomas,
}: {
  books: DiplomaBook[];
  setBooks: (b: DiplomaBook[]) => void;
  decisions: Decision[];
  diplomas: Diploma[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DiplomaBook | null>(null);
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      const year = values.year;
      if (!editItem && books.find((b) => b.year === year)) {
        message.error("Đã tồn tại sổ văn bằng cho năm này!");
        return;
      }
      if (editItem) {
        setBooks(books.map((b) => (b.id === editItem.id ? { ...b, name: values.name } : b)));
        message.success("Cập nhật sổ thành công");
      } else {
        const newBook: DiplomaBook = {
          id: `book-${year}`,
          year,
          name: values.name,
          createdAt: moment().format("YYYY-MM-DD"), 
          currentSeq: 0,
        };
        setBooks([...books, newBook]);
        message.success("Tạo sổ văn bằng mới thành công");
      }
      setModalOpen(false);
    });
  };

  const cols: ColumnsType<DiplomaBook> = [
    { title: "Năm", dataIndex: "year", key: "year", width: 80 },
    { title: "Tên sổ", dataIndex: "name", key: "name" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => moment(v).format("DD/MM/YYYY"), 
    },
    {
      title: "Số vào sổ hiện tại",
      key: "seq",
      render: (_, r) => <Tag color="blue">{r.currentSeq}</Tag>,
    },
    {
      title: "Số quyết định",
      key: "decs",
      render: (_, r) => decisions.filter((d) => d.bookId === r.id).length,
    },
    {
      title: "Số văn bằng",
      key: "dips",
      render: (_, r) => diplomas.filter((d) => d.bookId === r.id).length,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditItem(r);
              form.setFieldsValue(r);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sổ này?"
            onConfirm={() => {
              setBooks(books.filter((b) => b.id !== r.id));
              message.success("Đã xóa");
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditItem(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Tạo sổ mới
          </Button>
        }
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {books.map((b) => (
            <Col span={8} key={b.id}>
              <Card size="small" style={{ background: "#f0f7ff", border: "1px solid #91caff" }}>
                <Statistic
                  title={b.name}
                  value={diplomas.filter((d) => d.bookId === b.id).length}
                  suffix="văn bằng"
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Table dataSource={books} columns={cols} rowKey="id" size="middle" />
      </Card>
      <Modal
        open={modalOpen}
        title={editItem ? "Chỉnh sửa sổ văn bằng" : "Tạo sổ văn bằng mới"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: "Vui lòng nhập năm" }]}>
            <InputNumber
              disabled={!!editItem}
              placeholder="VD: 2025"
              style={{ width: "100%" }}
              min={2000}
              max={2100}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên sổ văn bằng"
            rules={[{ required: true, message: "Vui lòng nhập tên sổ" }]}
          >
            <Input placeholder="VD: Sổ văn bằng tốt nghiệp năm 2025" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function DecisionsModule({
  decisions,
  setDecisions,
  books,
}: {
  decisions: Decision[];
  setDecisions: (d: Decision[]) => void;
  books: DiplomaBook[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Decision | null>(null);
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        issuedDate: (values.issuedDate as Moment).format("YYYY-MM-DD"), 
      };
      if (editItem) {
        setDecisions(decisions.map((d) => (d.id === editItem.id ? { ...d, ...payload } : d)));
        message.success("Cập nhật quyết định thành công");
      } else {
        setDecisions([...decisions, { ...payload, id: genId(), lookupCount: 0 }]);
        message.success("Thêm quyết định thành công");
      }
      setModalOpen(false);
    });
  };

  const cols: ColumnsType<Decision> = [
    {
      title: "Số QĐ",
      dataIndex: "decisionNumber",
      key: "decisionNumber",
      width: 160,
    },
    {
      title: "Ngày ban hành",
      dataIndex: "issuedDate",
      key: "issuedDate",
      render: (v) => moment(v).format("DD/MM/YYYY"), 
      width: 140,
    },
    { title: "Trích yếu", dataIndex: "summary", key: "summary" },
    {
      title: "Sổ văn bằng",
      dataIndex: "bookId",
      key: "bookId",
      render: (v) => books.find((b) => b.id === v)?.name || v,
      width: 180,
    },
    {
      title: "Lượt tra cứu",
      dataIndex: "lookupCount",
      key: "lookupCount",
      render: (v) => <Badge count={v} color="blue" showZero />,
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditItem(r);
              form.setFieldsValue({ ...r, issuedDate: moment(r.issuedDate) }); 
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa quyết định này?"
            onConfirm={() => {
              setDecisions(decisions.filter((d) => d.id !== r.id));
              message.success("Đã xóa");
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditItem(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Thêm quyết định
          </Button>
        }
      >
        <Table dataSource={decisions} columns={cols} rowKey="id" size="middle" />
      </Card>
      <Modal
        open={modalOpen}
        title={editItem ? "Chỉnh sửa quyết định" : "Thêm quyết định tốt nghiệp"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        width={560}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="decisionNumber"
            label="Số quyết định"
            rules={[{ required: true, message: "Vui lòng nhập số QĐ" }]}
          >
            <Input placeholder="VD: 45/QĐ-ĐHBK" />
          </Form.Item>
          <Form.Item
            name="issuedDate"
            label="Ngày ban hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="summary"
            label="Trích yếu"
            rules={[{ required: true, message: "Vui lòng nhập trích yếu" }]}
          >
            <Input.TextArea rows={2} placeholder="Nội dung trích yếu quyết định" />
          </Form.Item>
          <Form.Item
            name="bookId"
            label="Thuộc sổ văn bằng"
            rules={[{ required: true, message: "Vui lòng chọn sổ văn bằng" }]}
          >
            <Select placeholder="Chọn sổ văn bằng">
              {books.map((b) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function FieldsModule({
  fields,
  setFields,
}: {
  fields: CustomField[];
  setFields: (f: CustomField[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CustomField | null>(null);
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editItem) {
        setFields(fields.map((f) => (f.id === editItem.id ? { ...f, ...values } : f)));
        message.success("Cập nhật trường thông tin thành công");
      } else {
        setFields([...fields, { ...values, id: genId() }]);
        message.success("Thêm trường thông tin thành công");
      }
      setModalOpen(false);
    });
  };

  const cols: ColumnsType<CustomField> = [
    { title: "Tên trường", dataIndex: "name", key: "name" },
    {
      title: "Kiểu dữ liệu",
      dataIndex: "type",
      key: "type",
      render: (v: FieldType) => (
        <Tag icon={fieldTypeIcon(v)} color={fieldTypeColor(v)}>
          {v}
        </Tag>
      ),
    },
    {
      title: "Bắt buộc",
      dataIndex: "required",
      key: "required",
      render: (v) => (v ? <Tag color="red">Bắt buộc</Tag> : <Tag color="default">Không bắt buộc</Tag>),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditItem(r);
              form.setFieldsValue(r);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa trường này?"
            onConfirm={() => {
              setFields(fields.filter((f) => f.id !== r.id));
              message.success("Đã xóa");
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Alert
        message="Các trường thông tin được cấu hình ở đây sẽ xuất hiện trong biểu mẫu nhập liệu văn bằng tốt nghiệp."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Card
        title={
          <Space>
            <SettingOutlined />
            Danh sách trường thông tin tùy chỉnh
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditItem(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Thêm trường
          </Button>
        }
      >
        <Table dataSource={fields} columns={cols} rowKey="id" size="middle" />
      </Card>
      <Modal
        open={modalOpen}
        title={editItem ? "Chỉnh sửa trường thông tin" : "Thêm trường thông tin mới"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Tên trường" rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}>
            <Input placeholder="VD: Dân tộc, Điểm trung bình..." />
          </Form.Item>
          <Form.Item
            name="type"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: "Vui lòng chọn kiểu dữ liệu" }]}
          >
            <Select>
              <Select.Option value="String">
                <FontColorsOutlined /> String (Văn bản)
              </Select.Option>
              <Select.Option value="Number">
                <NumberOutlined /> Number (Số)
              </Select.Option>
              <Select.Option value="Date">
                <CalendarOutlined /> Date (Ngày tháng)
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="required" label="Bắt buộc nhập" rules={[{ required: true }]} initialValue={false}>
            <Select>
              <Select.Option value={true}>Bắt buộc</Select.Option>
              <Select.Option value={false}>Không bắt buộc</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function DiplomasModule({
  diplomas,
  setDiplomas,
  decisions,
  books,
  customFields,
  setBooks,
}: {
  diplomas: Diploma[];
  setDiplomas: (d: Diploma[]) => void;
  decisions: Decision[];
  books: DiplomaBook[];
  customFields: CustomField[];
  setBooks: (b: DiplomaBook[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<Diploma | null>(null);
  const [form] = Form.useForm();
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const handleSave = () => {
    form.validateFields().then((values) => {
      const book = books.find((b) => b.id === values.bookId);
      if (!book) return;
      const nextSeq = book.currentSeq + 1;
      const cfValues: Record<string, string | number> = {};
      customFields.forEach((f) => {
        const raw = values[`cf_${f.id}`];
        if (f.type === "Date" && raw) {
          cfValues[f.id] = (raw as Moment).format("YYYY-MM-DD"); 
        } else {
          cfValues[f.id] = raw ?? "";
        }
      });
      const newDiploma: Diploma = {
        id: genId(),
        sequenceNumber: nextSeq,
        diplomaNumber: values.diplomaNumber,
        studentId: values.studentId,
        fullName: values.fullName,
        birthDate: (values.birthDate as Moment).format("YYYY-MM-DD"), 
        decisionId: values.decisionId,
        bookId: values.bookId,
        customFields: cfValues,
      };
      setDiplomas([...diplomas, newDiploma]);
      setBooks(books.map((b) => (b.id === values.bookId ? { ...b, currentSeq: nextSeq } : b)));
      setModalOpen(false);
      form.resetFields();
      setSelectedBookId("");
      message.success(`Thêm văn bằng thành công! Số vào sổ: ${nextSeq}`);
    });
  };

  const filteredDecisions = decisions.filter((d) => d.bookId === selectedBookId);

  const getNextSeq = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.currentSeq + 1 : 1;
  };

  const cols: ColumnsType<Diploma> = [
    {
      title: "Số vào sổ",
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      width: 100,
      render: (v) => <Tag color="blue">#{v}</Tag>,
    },
    {
      title: "Số hiệu VB",
      dataIndex: "diplomaNumber",
      key: "diplomaNumber",
      width: 130,
    },
    { title: "MSV", dataIndex: "studentId", key: "studentId", width: 100 },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (v) => moment(v).format("DD/MM/YYYY"), 
      width: 120,
    },
    {
      title: "Quyết định",
      dataIndex: "decisionId",
      key: "decisionId",
      render: (v) => decisions.find((d) => d.id === v)?.decisionNumber || v,
    },
    {
      title: "Sổ VB",
      dataIndex: "bookId",
      key: "bookId",
      render: (v) => books.find((b) => b.id === v)?.year,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setViewItem(r)}>
            Xem
          </Button>
          <Popconfirm
            title="Xóa văn bằng này?"
            onConfirm={() => {
              setDiplomas(diplomas.filter((d) => d.id !== r.id));
              message.success("Đã xóa");
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setSelectedBookId("");
              setModalOpen(true);
            }}
          >
            Thêm văn bằng
          </Button>
        }
      >
        <Table dataSource={diplomas} columns={cols} rowKey="id" size="middle" />
      </Card>

      {/* ADD MODAL */}
      <Modal
        open={modalOpen}
        title="Thêm thông tin văn bằng tốt nghiệp"
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        width={680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Divider orientation="left" orientationMargin={0}>
            <Text strong>Thông tin cơ bản</Text>
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bookId" label="Sổ văn bằng" rules={[{ required: true, message: "Vui lòng chọn sổ" }]}>
                <Select
                  placeholder="Chọn sổ văn bằng"
                  onChange={(v) => {
                    setSelectedBookId(v);
                    form.setFieldValue("decisionId", undefined);
                  }}
                >
                  {books.map((b) => (
                    <Select.Option key={b.id} value={b.id}>
                      {b.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số vào sổ (tự động)">
                <Input
                  disabled
                  value={selectedBookId ? `#${getNextSeq(selectedBookId)} (tự động)` : "—"}
                  style={{ background: "#f5f5f5" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="diplomaNumber"
                label="Số hiệu văn bằng"
                rules={[{ required: true, message: "Vui lòng nhập số hiệu" }]}
              >
                <Input placeholder="VD: TN25/003" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="decisionId"
                label="Quyết định tốt nghiệp"
                rules={[{ required: true, message: "Vui lòng chọn quyết định" }]}
              >
                <Select placeholder="Chọn quyết định" disabled={!selectedBookId}>
                  {filteredDecisions.map((d) => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.decisionNumber} – {moment(d.issuedDate).format("DD/MM/YYYY")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="Mã sinh viên"
                rules={[{ required: true, message: "Vui lòng nhập MSV" }]}
              >
                <Input placeholder="VD: SV006" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="birthDate" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          {customFields.length > 0 && (
            <>
              <Divider orientation="left" orientationMargin={0}>
                <Text strong>Thông tin bổ sung</Text>
              </Divider>
              <Row gutter={16}>
                {customFields.map((f) => (
                  <Col span={12} key={f.id}>
                    <Form.Item
                      name={`cf_${f.id}`}
                      label={f.name}
                      rules={f.required ? [{ required: true, message: `Vui lòng nhập ${f.name}` }] : []}
                    >
                      {f.type === "String" ? (
                        <Input placeholder={f.name} />
                      ) : f.type === "Number" ? (
                        <InputNumber style={{ width: "100%" }} placeholder="0.0" step={0.1} />
                      ) : (
                        <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                      )}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Form>
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        open={!!viewItem}
        title={
          <Space>
            <TrophyOutlined style={{ color: "#faad14" }} />
            Chi tiết văn bằng
          </Space>
        }
        onCancel={() => setViewItem(null)}
        footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
        width={640}
      >
        {viewItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Số vào sổ" span={1}>
              <Tag color="blue">#{viewItem.sequenceNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số hiệu VB" span={1}>
              <Text strong>{viewItem.diplomaNumber}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{viewItem.studentId}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              <Text strong>{viewItem.fullName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{moment(viewItem.birthDate).format("DD/MM/YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Sổ văn bằng">{books.find((b) => b.id === viewItem.bookId)?.name}</Descriptions.Item>
            <Descriptions.Item label="Quyết định TN" span={2}>
              {(() => {
                const d = decisions.find((d) => d.id === viewItem.decisionId);
                return d ? `${d.decisionNumber} – ${moment(d.issuedDate).format("DD/MM/YYYY")}` : "—";
              })()}
            </Descriptions.Item>
            {customFields.map((f) => (
              <Descriptions.Item key={f.id} label={f.name}>
                {f.type === "Date" && viewItem.customFields[f.id]
                  ? moment(viewItem.customFields[f.id] as string).format("DD/MM/YYYY")
                  : String(viewItem.customFields[f.id] ?? "—")}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>
    </>
  );
}

function LookupModule({
  diplomas,
  decisions,
  books,
  customFields,
  setDecisions,
}: {
  diplomas: Diploma[];
  decisions: Decision[];
  books: DiplomaBook[];
  customFields: CustomField[];
  setDecisions: (d: Decision[]) => void;
}) {
  const [params, setParams] = useState({
    diplomaNumber: "",
    sequenceNumber: "",
    studentId: "",
    fullName: "",
    birthDate: null as Moment | null, 
  });
  const [results, setResults] = useState<Diploma[] | null>(null);
  const [viewItem, setViewItem] = useState<Diploma | null>(null);

  const filledCount = [
    params.diplomaNumber,
    params.sequenceNumber,
    params.studentId,
    params.fullName,
    params.birthDate,
  ].filter(Boolean).length;

  const handleSearch = () => {
    if (filledCount < 2) {
      message.warning("Vui lòng nhập ít nhất 2 tham số tìm kiếm!");
      return;
    }
    const filtered = diplomas.filter((d) => {
      if (params.diplomaNumber && !d.diplomaNumber.toLowerCase().includes(params.diplomaNumber.toLowerCase()))
        return false;
      if (params.sequenceNumber && String(d.sequenceNumber) !== params.sequenceNumber) return false;
      if (params.studentId && !d.studentId.toLowerCase().includes(params.studentId.toLowerCase())) return false;
      if (params.fullName && !d.fullName.toLowerCase().includes(params.fullName.toLowerCase())) return false;
      if (params.birthDate && d.birthDate !== params.birthDate.format("YYYY-MM-DD")) return false; 
      return true;
    });
    setResults(filtered);
    message.info(`Tìm thấy ${filtered.length} kết quả`);
  };

  const handleView = (diploma: Diploma) => {
    setViewItem(diploma);
    setDecisions(
      decisions.map((d) => (d.id === diploma.decisionId ? { ...d, lookupCount: d.lookupCount + 1 } : d))
    );
  };

  const cols: ColumnsType<Diploma> = [
    { title: "Số hiệu VB", dataIndex: "diplomaNumber", key: "diplomaNumber" },
    {
      title: "Số vào sổ",
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      render: (v) => <Tag color="blue">#{v}</Tag>,
    },
    { title: "MSV", dataIndex: "studentId", key: "studentId" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (v) => moment(v).format("DD/MM/YYYY"), 
    },
    {
      title: "Quyết định",
      dataIndex: "decisionId",
      key: "decisionId",
      render: (v) => decisions.find((d) => d.id === v)?.decisionNumber || v,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Button icon={<EyeOutlined />} type="primary" size="small" onClick={() => handleView(r)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <Space>
            <SearchOutlined />
            Tra cứu thông tin văn bằng
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Alert
          message={
            <>
              Vui lòng nhập ít nhất <Text strong>2 tham số</Text> để tra cứu. Hiện tại:{" "}
              <Text strong style={{ color: filledCount >= 2 ? "#52c41a" : "#ff4d4f" }}>
                {filledCount}/5
              </Text>
            </>
          }
          type={filledCount >= 2 ? "success" : "warning"}
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Row gutter={[16, 12]}>
          <Col span={8}>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Số hiệu văn bằng
            </Text>
            <Input
              prefix={<TrophyOutlined />}
              value={params.diplomaNumber}
              onChange={(e) => setParams((p) => ({ ...p, diplomaNumber: e.target.value }))}
              placeholder="VD: TN24/001"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Số vào sổ
            </Text>
            <Input
              prefix={<NumberOutlined />}
              value={params.sequenceNumber}
              onChange={(e) => setParams((p) => ({ ...p, sequenceNumber: e.target.value }))}
              placeholder="VD: 1"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Mã sinh viên
            </Text>
            <Input
              prefix={<UserOutlined />}
              value={params.studentId}
              onChange={(e) => setParams((p) => ({ ...p, studentId: e.target.value }))}
              placeholder="VD: SV001"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Họ và tên
            </Text>
            <Input
              prefix={<UserOutlined />}
              value={params.fullName}
              onChange={(e) => setParams((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="VD: Nguyễn Văn An"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
              Ngày sinh
            </Text>
            <DatePicker
              style={{ width: "100%" }}
              value={params.birthDate}
              onChange={(v) => setParams((p) => ({ ...p, birthDate: v }))}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Col>
          <Col span={8} style={{ display: "flex", alignItems: "flex-end" }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{ width: "100%", height: 32 }}
              disabled={filledCount < 2}
            >
              Tra cứu
            </Button>
          </Col>
        </Row>
      </Card>

      {results !== null && (
        <Card title={`Kết quả tra cứu (${results.length} văn bằng)`} style={{ marginBottom: 16 }}>
          {results.length === 0 ? (
            <Empty description="Không tìm thấy văn bằng phù hợp" />
          ) : (
            <Table dataSource={results} columns={cols} rowKey="id" size="middle" />
          )}
        </Card>
      )}

      {/* LOOKUP STATS */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            Thống kê lượt tra cứu theo quyết định
          </Space>
        }
      >
        <Row gutter={[12, 12]}>
          {decisions.map((d) => (
            <Col span={8} key={d.id}>
              <Card size="small" style={{ border: "1px solid #d9d9d9" }}>
                <Statistic
                  title={
                    <Tooltip title={d.summary}>
                      <Text ellipsis style={{ maxWidth: 180 }}>
                        {d.decisionNumber}
                      </Text>
                    </Tooltip>
                  }
                  value={d.lookupCount}
                  suffix="lượt"
                  prefix={<SearchOutlined />}
                  valueStyle={{ color: "#1677ff" }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {moment(d.issuedDate).format("DD/MM/YYYY")} · {books.find((b) => b.id === d.bookId)?.name}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* VIEW DETAIL */}
      <Modal
        open={!!viewItem}
        title={
          <Space>
            <TrophyOutlined style={{ color: "#faad14" }} />
            Thông tin chi tiết văn bằng
          </Space>
        }
        onCancel={() => setViewItem(null)}
        footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
        width={680}
      >
        {viewItem &&
          (() => {
            const decision = decisions.find((d) => d.id === viewItem.decisionId);
            const book = books.find((b) => b.id === viewItem.bookId);
            return (
              <>
                <Divider orientation="left" orientationMargin={0}>
                  Thông tin văn bằng
                </Divider>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Số vào sổ">
                    <Tag color="blue">#{viewItem.sequenceNumber}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số hiệu văn bằng">
                    <Text strong>{viewItem.diplomaNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã sinh viên">{viewItem.studentId}</Descriptions.Item>
                  <Descriptions.Item label="Họ và tên">
                    <Text strong>{viewItem.fullName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh" span={2}>
                    {moment(viewItem.birthDate).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                  {customFields.map((f) => (
                    <Descriptions.Item key={f.id} label={f.name}>
                      {f.type === "Date" && viewItem.customFields[f.id]
                        ? moment(viewItem.customFields[f.id] as string).format("DD/MM/YYYY")
                        : String(viewItem.customFields[f.id] ?? "—")}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
                {decision && (
                  <>
                    <Divider orientation="left" orientationMargin={0}>
                      Thông tin quyết định tốt nghiệp
                    </Divider>
                    <Descriptions bordered column={2} size="small">
                      <Descriptions.Item label="Số quyết định">
                        <Text strong>{decision.decisionNumber}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày ban hành">
                        {moment(decision.issuedDate).format("DD/MM/YYYY")}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trích yếu" span={2}>
                        {decision.summary}
                      </Descriptions.Item>
                      <Descriptions.Item label="Sổ văn bằng" span={2}>
                        {book?.name}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                )}
              </>
            );
          })()}
      </Modal>
    </>
  );
}