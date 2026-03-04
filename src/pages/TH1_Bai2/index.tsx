import React, { useEffect, useState } from "react";
import {
  Layout,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  List,
  Card,
  Select,
  Progress,
} from "antd";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const { Header, Content } = Layout;

interface Subject {
  id: string;
  name: string;
}

interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  content: string;
}

interface Goal {
  subjectId?: string;
  month: string;
  targetHours: number;
}

const LOCAL_KEY = "study_app_data";

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [subjectModal, setSubjectModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [subjectForm] = Form.useForm();
  const [sessionForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setSubjects(parsed.subjects || []);
      setSessions(parsed.sessions || []);
      setGoals(parsed.goals || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ subjects, sessions, goals })
    );
  }, [subjects, sessions, goals]);

  
  const addSubject = (values: any) => {
    const newSubject: Subject = {
      id: uuidv4(),
      name: values.name,
    };
    setSubjects([...subjects, newSubject]);
    subjectForm.resetFields();
    setSubjectModal(false);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setSessions(sessions.filter((s) => s.subjectId !== id));
  };

  const addSession = (values: any) => {
    const newSession: StudySession = {
      id: uuidv4(),
      subjectId: values.subjectId,
      date: values.date.format("YYYY-MM-DD"),
      duration: values.duration,
      content: values.content,
    };
    setSessions([...sessions, newSession]);
    sessionForm.resetFields();
    setSessionModal(false);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

 
  const addGoal = (values: any) => {
    const newGoal: Goal = {
      subjectId: values.subjectId,
      month: values.month.format("YYYY-MM"),
      targetHours: values.targetHours,
    };

    const filtered = goals.filter(
      (g) =>
        !(g.month === newGoal.month && g.subjectId === newGoal.subjectId)
    );

    setGoals([...filtered, newGoal]);
    goalForm.resetFields();
    setGoalModal(false);
  };

  const calculateHours = (month: string, subjectId?: string) => {
    return sessions
      .filter(
        (s) =>
          dayjs(s.date).format("YYYY-MM") === month &&
          (!subjectId || s.subjectId === subjectId)
      )
      .reduce((sum, s) => sum + s.duration, 0);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#fff", fontSize: 20 }}>
        Study Manager
      </Header>

      <Content style={{ padding: 24 }}>
        <Tabs defaultActiveKey="1">
     
          <Tabs.TabPane tab="Môn học" key="1">
            <Button type="primary" onClick={() => setSubjectModal(true)}>
              Thêm môn
            </Button>

            <List
              style={{ marginTop: 20 }}
              dataSource={subjects}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button danger onClick={() => deleteSubject(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
            />
          </Tabs.TabPane>

         
          <Tabs.TabPane tab="Tiến độ học" key="2">
            <Button type="primary" onClick={() => setSessionModal(true)}>
              Thêm lịch học
            </Button>

            <List
              style={{ marginTop: 20 }}
              dataSource={sessions}
              renderItem={(item) => {
                const subject = subjects.find(
                  (s) => s.id === item.subjectId
                );
                return (
                  <Card style={{ marginBottom: 12 }}>
                    <p><b>Môn:</b> {subject?.name}</p>
                    <p><b>Ngày:</b> {item.date}</p>
                    <p><b>Thời lượng:</b> {item.duration} giờ</p>
                    <p><b>Nội dung:</b> {item.content}</p>
                    <Button danger onClick={() => deleteSession(item.id)}>
                      Xóa
                    </Button>
                  </Card>
                );
              }}
            />
          </Tabs.TabPane>

       
          <Tabs.TabPane tab="Mục tiêu tháng" key="3">
            <Button type="primary" onClick={() => setGoalModal(true)}>
              Đặt mục tiêu
            </Button>

            <List
              style={{ marginTop: 20 }}
              dataSource={goals}
              renderItem={(goal) => {
                const actual = calculateHours(
                  goal.month,
                  goal.subjectId
                );
                const percent = Math.min(
                  (actual / goal.targetHours) * 100,
                  100
                );

                const subject = subjects.find(
                  (s) => s.id === goal.subjectId
                );

                return (
                  <Card style={{ marginBottom: 12 }}>
                    <p><b>Tháng:</b> {goal.month}</p>
                    <p>
                      <b>Môn:</b>{" "}
                      {subject ? subject.name : "Tất cả môn"}
                    </p>
                    <p>
                      {actual} / {goal.targetHours} giờ
                    </p>
                    <Progress percent={percent} />
                  </Card>
                );
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Content>

      
      <Modal
        open={subjectModal}
        footer={null}
        onCancel={() => setSubjectModal(false)}
        title="Thêm môn học"
      >
        <Form form={subjectForm} onFinish={addSubject}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Tên môn học" />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Lưu
          </Button>
        </Form>
      </Modal>

      {/* ===== SESSION MODAL ===== */}
      <Modal
        open={sessionModal}
        footer={null}
        onCancel={() => setSessionModal(false)}
        title="Thêm lịch học"
      >
        <Form form={sessionForm} onFinish={addSession}>
          <Form.Item name="subjectId" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn">
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item name="duration" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="content">
            <Input placeholder="Nội dung học" />
          </Form.Item>

          <Button htmlType="submit" type="primary">
            Lưu
          </Button>
        </Form>
      </Modal>

      {/* ===== GOAL MODAL ===== */}
      <Modal
        open={goalModal}
        footer={null}
        onCancel={() => setGoalModal(false)}
        title="Đặt mục tiêu tháng"
      >
        <Form form={goalForm} onFinish={addGoal}>
          <Form.Item name="subjectId">
            <Select placeholder="Chọn môn (bỏ trống = tất cả)">
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="month" rules={[{ required: true }]}>
            <DatePicker picker="month" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="targetHours" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Button htmlType="submit" type="primary">
            Lưu
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;