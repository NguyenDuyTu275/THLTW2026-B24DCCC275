import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Card,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Button,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
  message,
  Badge,
  Tooltip,
} from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ==================== TYPES ====================
type Priority = 'high' | 'medium' | 'low';
type Status = 'todo' | 'inprogress' | 'done';

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string; // ISO string
  priority: Priority;
  status: Status;
  tags: string[];
  createdAt: string;
}

// ==================== CONSTANTS ====================
const STORAGE_KEY = 'kanban_tasks_v1';

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
};

const STATUS_LABEL: Record<Status, string> = {
  todo: 'Cần làm',
  inprogress: 'Đang làm',
  done: 'Hoàn thành',
};

const STATUS_COLOR: Record<Status, string> = {
  todo: '#1890ff',
  inprogress: '#fa8c16',
  done: '#52c41a',
};

const COLUMN_ORDER: Status[] = ['todo', 'inprogress', 'done'];

// ==================== UTILS ====================
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch (_) {}
  return getInitialTasks();
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function isOverdue(task: Task): boolean {
  if (task.status === 'done') return false;
  return moment(task.deadline).isBefore(moment(), 'day');
}

// ==================== INITIAL DATA ====================
function getInitialTasks(): Task[] {
  return [
    {
      id: genId(),
      name: 'Thiết kế giao diện Dashboard',
      description: 'Vẽ wireframe và thiết kế UI cho trang tổng quan',
      deadline: moment().add(3, 'days').toISOString(),
      priority: 'high',
      status: 'todo',
      tags: ['UI', 'Design'],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      name: 'Viết API backend',
      description: 'Xây dựng REST API cho module người dùng',
      deadline: moment().add(5, 'days').toISOString(),
      priority: 'high',
      status: 'inprogress',
      tags: ['Backend', 'API'],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      name: 'Kiểm thử unit test',
      description: 'Viết unit test cho các service chính',
      deadline: moment().subtract(1, 'days').toISOString(),
      priority: 'medium',
      status: 'todo',
      tags: ['Testing'],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      name: 'Cập nhật tài liệu README',
      description: 'Viết hướng dẫn cài đặt và sử dụng',
      deadline: moment().add(7, 'days').toISOString(),
      priority: 'low',
      status: 'done',
      tags: ['Docs'],
      createdAt: new Date().toISOString(),
    },
    {
      id: genId(),
      name: 'Tối ưu truy vấn database',
      description: 'Phân tích và tối ưu các câu query chậm',
      deadline: moment().add(2, 'days').toISOString(),
      priority: 'medium',
      status: 'inprogress',
      tags: ['Database', 'Performance'],
      createdAt: new Date().toISOString(),
    },
  ];
}

// ==================== TASK FORM MODAL ====================
interface TaskFormProps {
  visible: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (values: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskFormModal: React.FC<TaskFormProps> = ({ visible, editingTask, onClose, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingTask) {
        form.setFieldsValue({
          ...editingTask,
          deadline: editingTask.deadline ? moment(editingTask.deadline) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ priority: 'medium', status: 'todo', tags: [] });
      }
    }
  }, [visible, editingTask]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : '',
        tags: values.tags || [],
      });
    });
  };

  return (
    <Modal
      title={
        <span style={{ fontWeight: 700, fontSize: 16 }}>
          {editingTask ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
        </span>
      }
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText={editingTask ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item
          name="name"
          label="Tên task"
          rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
        >
          <Input placeholder="Nhập tên công việc..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} placeholder="Mô tả chi tiết công việc..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="priority" label="Mức độ ưu tiên">
              <Select>
                <Option value="high">
                  <span style={{ color: PRIORITY_COLOR.high, fontWeight: 600 }}>● Cao</span>
                </Option>
                <Option value="medium">
                  <span style={{ color: PRIORITY_COLOR.medium, fontWeight: 600 }}>● Trung bình</span>
                </Option>
                <Option value="low">
                  <span style={{ color: PRIORITY_COLOR.low, fontWeight: 600 }}>● Thấp</span>
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            {COLUMN_ORDER.map((s) => (
              <Option key={s} value={s}>
                <span style={{ color: STATUS_COLOR[s], fontWeight: 600 }}>
                  {STATUS_LABEL[s]}
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Nhập tag rồi nhấn Enter..." style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ==================== DASHBOARD ====================
interface DashboardProps {
  tasks: Task[];
  onAddTask: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onAddTask }) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter(isOverdue).length;
  const inprogress = tasks.filter((t) => t.status === 'inprogress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const statCards = [
    {
      label: 'Tổng số task',
      value: total,
      bg: '#e6f7ff',
      border: '#91d5ff',
      valueColor: '#1890ff',
    },
    {
      label: 'Hoàn thành',
      value: done,
      bg: '#f6ffed',
      border: '#b7eb8f',
      valueColor: '#52c41a',
    },
    {
      label: 'Đang làm',
      value: inprogress,
      bg: '#fff7e6',
      border: '#ffd591',
      valueColor: '#fa8c16',
    },
    {
      label: 'Quá hạn',
      value: overdue,
      bg: '#fff1f0',
      border: '#ffa39e',
      valueColor: '#ff4d4f',
    },
  ];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Tổng quan
          </Title>
          <Text type="secondary">Xin chào! Đây là tóm tắt công việc của bạn.</Text>
        </div>
        <Button type="primary" size="large" onClick={onAddTask}>
          + Thêm task mới
        </Button>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card) => (
          <Col key={card.label} xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: 8,
                textAlign: 'center',
              }}
              bodyStyle={{ padding: '20px 16px' }}
            >
              <div
                style={{ fontSize: 40, fontWeight: 700, color: card.valueColor, lineHeight: 1.2 }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 14, color: '#595959', marginTop: 6 }}>{card.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Progress bar */}
        <Col xs={24} lg={10}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Tiến độ hoàn thành</span>}
            style={{ borderRadius: 8, height: '100%' }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text>Tỷ lệ hoàn thành</Text>
                <Text strong>{completionRate}%</Text>
              </div>
              <div
                style={{
                  background: '#f0f0f0',
                  borderRadius: 100,
                  height: 12,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${completionRate}%`,
                    background:
                      completionRate >= 80
                        ? '#52c41a'
                        : completionRate >= 50
                        ? '#faad14'
                        : '#1890ff',
                    borderRadius: 100,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              {COLUMN_ORDER.map((s) => {
                const count = tasks.filter((t) => t.status === s).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={s} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: STATUS_COLOR[s], fontWeight: 600 }}>
                        {STATUS_LABEL[s]}
                      </Text>
                      <Text>
                        {count} task ({pct}%)
                      </Text>
                    </div>
                    <div
                      style={{ background: '#f0f0f0', borderRadius: 100, height: 8, overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: STATUS_COLOR[s],
                          borderRadius: 100,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Recent tasks */}
        <Col xs={24} lg={14}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Task gần đây</span>}
            style={{ borderRadius: 8 }}
          >
            {recentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#bfbfbf' }}>
                Chưa có task nào
              </div>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      strong
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        color: task.status === 'done' ? '#8c8c8c' : undefined,
                      }}
                    >
                      {task.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Hạn: {moment(task.deadline).format('DD/MM/YYYY')}
                      {isOverdue(task) && (
                        <span style={{ color: '#ff4d4f', marginLeft: 6 }}>Quá hạn!</span>
                      )}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: STATUS_COLOR[task.status] + '22',
                        color: STATUS_COLOR[task.status],
                      }}
                    >
                      {STATUS_LABEL[task.status]}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: PRIORITY_COLOR[task.priority] + '22',
                        color: PRIORITY_COLOR[task.priority],
                      }}
                    >
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>

      {/* Priority breakdown */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={<span style={{ fontWeight: 700 }}>Phân bố theo mức độ ưu tiên</span>} style={{ borderRadius: 8 }}>
            <Row gutter={16}>
              {(['high', 'medium', 'low'] as Priority[]).map((p) => {
                const count = tasks.filter((t) => t.priority === p && t.status !== 'done').length;
                return (
                  <Col key={p} span={8}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 8,
                        background: PRIORITY_COLOR[p] + '15',
                        border: `2px solid ${PRIORITY_COLOR[p]}40`,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 28, fontWeight: 700, color: PRIORITY_COLOR[p] }}>
                        {count}
                      </div>
                      <div style={{ color: '#595959', marginTop: 4 }}>
                        Ưu tiên {PRIORITY_LABEL[p]}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// ==================== KANBAN BOARD ====================
interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAdd: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove, onEdit, onDelete, onAdd }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as Status;
    onTaskMove(taskId, newStatus);
  };

  const columns = COLUMN_ORDER.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  const columnBg: Record<Status, string> = {
    todo: '#e6f7ff',
    inprogress: '#fff7e6',
    done: '#f6ffed',
  };

  const columnHeaderBg: Record<Status, string> = {
    todo: '#1890ff',
    inprogress: '#fa8c16',
    done: '#52c41a',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Kanban Board</Title>
          <Text type="secondary">Kéo thả task để thay đổi trạng thái</Text>
        </div>
        <Button type="primary" size="large" onClick={onAdd}>
          + Thêm task mới
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Row gutter={16} style={{ alignItems: 'flex-start' }}>
          {columns.map(({ status, tasks: colTasks }) => (
            <Col key={status} xs={24} md={8}>
              <div
                style={{
                  background: columnBg[status],
                  borderRadius: 8,
                  border: `2px solid ${columnHeaderBg[status]}40`,
                  minHeight: 500,
                  overflow: 'hidden',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    background: columnHeaderBg[status],
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.3)',
                      color: '#fff',
                      borderRadius: 12,
                      padding: '1px 10px',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 450,
                        padding: 12,
                        background: snapshot.isDraggingOver
                          ? columnHeaderBg[status] + '20'
                          : undefined,
                        transition: 'background 0.2s',
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                ...prov.draggableProps.style,
                                marginBottom: 10,
                              }}
                            >
                              <div
                                style={{
                                  background: '#fff',
                                  borderRadius: 6,
                                  padding: 12,
                                  boxShadow: snap.isDragging
                                    ? '0 8px 24px rgba(0,0,0,0.18)'
                                    : '0 1px 4px rgba(0,0,0,0.08)',
                                  border: `1px solid ${
                                    isOverdue(task) ? '#ffa39e' : '#e8e8e8'
                                  }`,
                                  borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
                                  cursor: 'grab',
                                  transform: snap.isDragging ? 'rotate(2deg)' : undefined,
                                  transition: 'box-shadow 0.2s',
                                }}
                              >
                                {/* Task name */}
                                <div
                                  style={{
                                    fontWeight: 700,
                                    fontSize: 14,
                                    marginBottom: 6,
                                    color: task.status === 'done' ? '#8c8c8c' : '#262626',
                                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                                  }}
                                >
                                  {task.name}
                                </div>

                                {/* Description */}
                                {task.description && (
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: '#8c8c8c',
                                      marginBottom: 8,
                                      overflow: 'hidden',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {task.description}
                                  </div>
                                )}

                                {/* Tags */}
                                {task.tags.length > 0 && (
                                  <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {task.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        style={{
                                          display: 'inline-block',
                                          padding: '1px 7px',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          background: '#f0f0f0',
                                          color: '#595959',
                                        }}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Footer */}
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 8,
                                    paddingTop: 8,
                                    borderTop: '1px solid #f0f0f0',
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: PRIORITY_COLOR[task.priority],
                                        background: PRIORITY_COLOR[task.priority] + '18',
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                      }}
                                    >
                                      {PRIORITY_LABEL[task.priority]}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: isOverdue(task) ? '#ff4d4f' : '#8c8c8c',
                                        marginLeft: 6,
                                        fontWeight: isOverdue(task) ? 700 : 400,
                                      }}
                                    >
                                      {isOverdue(task) ? 'Quá hạn! ' : ''}
                                      {moment(task.deadline).format('DD/MM')}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 4 }}>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                                      style={{
                                        border: 'none',
                                        background: '#e6f7ff',
                                        color: '#1890ff',
                                        borderRadius: 4,
                                        padding: '2px 8px',
                                        cursor: 'pointer',
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    >
                                      Sửa
                                    </button>
                                    <Popconfirm
                                      title="Xóa task này?"
                                      onConfirm={(e) => { e?.stopPropagation(); onDelete(task.id); }}
                                      okText="Xóa"
                                      cancelText="Hủy"
                                    >
                                      <button
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          border: 'none',
                                          background: '#fff1f0',
                                          color: '#ff4d4f',
                                          borderRadius: 4,
                                          padding: '2px 8px',
                                          cursor: 'pointer',
                                          fontSize: 11,
                                          fontWeight: 600,
                                        }}
                                      >
                                        Xóa
                                      </button>
                                    </Popconfirm>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div
                          style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            color: '#bfbfbf',
                            fontSize: 13,
                          }}
                        >
                          Kéo task vào đây
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </div>
  );
};

// ==================== TASK LIST ====================
interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAdd: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onAdd }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const filtered = tasks.filter((t) => {
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchSearch = t.name.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Tên task',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Task) => (
        <span
          style={{
            fontWeight: 600,
            textDecoration: record.status === 'done' ? 'line-through' : 'none',
            color: record.status === 'done' ? '#8c8c8c' : '#262626',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: Status) => (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 600,
            background: STATUS_COLOR[status] + '20',
            color: STATUS_COLOR[status],
          }}
        >
          {STATUS_LABEL[status]}
        </span>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      render: (priority: Priority) => (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 600,
            background: PRIORITY_COLOR[priority] + '20',
            color: PRIORITY_COLOR[priority],
          }}
        >
          {PRIORITY_LABEL[priority]}
        </span>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 130,
      sorter: (a: Task, b: Task) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      render: (deadline: string, record: Task) => {
        const over = isOverdue(record);
        return (
          <span style={{ color: over ? '#ff4d4f' : '#595959', fontWeight: over ? 700 : 400 }}>
            {moment(deadline).format('DD/MM/YYYY')}
            {over && <span style={{ marginLeft: 4, fontSize: 11 }}>(Quá hạn)</span>}
          </span>
        );
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags.map((tag) => (
            <Tag key={tag} style={{ fontSize: 11, margin: 0 }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Task) => (
        <Space size="small">
          <Button size="small" type="primary" ghost onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa task này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger ghost>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Danh sách Task
          </Title>
          <Text type="secondary">Quản lý tất cả công việc của bạn</Text>
        </div>
        <Button type="primary" size="large" onClick={onAdd}>
          + Thêm task mới
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }} bodyStyle={{ padding: '12px 16px' }}>
        <Row gutter={12} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input.Search
              placeholder="Tìm kiếm theo tên task..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              {COLUMN_ORDER.map((s) => (
                <Option key={s} value={s}>
                  <span style={{ color: STATUS_COLOR[s], fontWeight: 600 }}>
                    {STATUS_LABEL[s]}
                  </span>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Text type="secondary">
              Hiển thị <strong>{filtered.length}</strong> / {tasks.length} task
            </Text>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        style={{ background: '#fff', borderRadius: 8 }}
        rowClassName={(record) => (isOverdue(record) ? 'overdue-row' : '')}
      />

      <style>{`
        .overdue-row td { background: #fff1f0 !important; }
        .ant-table { border-radius: 8px; overflow: hidden; }
      `}</style>
    </div>
  );
};

// ==================== MAIN APP ====================
type PageKey = 'dashboard' | 'kanban' | 'list';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleSaveTask = useCallback(
    (values: Omit<Task, 'id' | 'createdAt'>) => {
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...t, ...values } : t
          )
        );
        message.success('Đã cập nhật task!');
      } else {
        const newTask: Task = {
          id: genId(),
          createdAt: new Date().toISOString(),
          ...values,
        };
        setTasks((prev) => [newTask, ...prev]);
        message.success('Đã thêm task mới!');
      }
      setModalVisible(false);
      setEditingTask(null);
    },
    [editingTask]
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    message.success('Đã xóa task!');
  }, []);

  const handleTaskMove = useCallback((taskId: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  const openAdd = useCallback(() => {
    setEditingTask(null);
    setModalVisible(true);
  }, []);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inprogressCount = tasks.filter((t) => t.status === 'inprogress').length;
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Top Navbar */}
      <Header
        style={{
          background: '#001529',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: 56,
          lineHeight: '56px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginRight: 32,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: '#1890ff',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            T
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
              Task Manager
            </div>
            <div style={{ color: '#8c8c8c', fontSize: 11 }}>Quản lý công việc</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPage]}
          onClick={({ key }) => setCurrentPage(key as PageKey)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            lineHeight: '54px',
          }}
        >
          <Menu.Item key="dashboard">
            <span style={{ fontWeight: currentPage === 'dashboard' ? 700 : 400 }}>
              Tổng quan
            </span>
          </Menu.Item>
          <Menu.Item key="kanban">
            <span style={{ fontWeight: currentPage === 'kanban' ? 700 : 400 }}>
              Kanban Board
              {inprogressCount > 0 && (
                <Badge
                  count={inprogressCount}
                  style={{ marginLeft: 8, background: '#fa8c16' }}
                />
              )}
            </span>
          </Menu.Item>
          <Menu.Item key="list">
            <span style={{ fontWeight: currentPage === 'list' ? 700 : 400 }}>
              Danh sách Task
              {todoCount > 0 && (
                <Badge count={todoCount} style={{ marginLeft: 8 }} />
              )}
            </span>
          </Menu.Item>
        </Menu>

        {/* Right side: overdue alert + add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {overdueCount > 0 && (
            <div
              style={{
                background: '#ff4d4f22',
                border: '1px solid #ff4d4f66',
                borderRadius: 6,
                padding: '3px 12px',
                color: '#ff7875',
                fontWeight: 700,
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              {overdueCount} task quá hạn!
            </div>
          )}
          <span style={{ fontSize: 12, color: '#8c8c8c', whiteSpace: 'nowrap' }}>
            {tasks.length} task
          </span>
          <Button type="primary" size="small" onClick={openAdd}>
            + Thêm mới
          </Button>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ padding: 24, overflow: 'auto' }}>
        {currentPage === 'dashboard' && (
          <Dashboard tasks={tasks} onAddTask={openAdd} />
        )}
        {currentPage === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={openAdd}
          />
        )}
        {currentPage === 'list' && (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={openAdd}
          />
        )}
      </Content>

      {/* Task Form Modal */}
      <TaskFormModal
        visible={modalVisible}
        editingTask={editingTask}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </Layout>
  );
};

export default App;