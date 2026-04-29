import { useState, useMemo } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Tag,
  Progress,
  Drawer,
  Segmented,
  Typography,
  Timeline,
  Space,
  message,
  Badge,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  HeartOutlined,
  TrophyOutlined,
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FireOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import moment, { Moment } from "moment";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

type ExerciseType = "Cardio" | "Strength" | "Yoga" | "HIIT" | "Other";
type WorkoutStatus = "Hoàn thành" | "Bỏ lỡ";
type GoalType = "Giảm cân" | "Tăng cơ" | "Cải thiện sức bền" | "Khác";
type GoalStatus = "Đang thực hiện" | "Đã đạt" | "Đã hủy";
type Difficulty = "Dễ" | "Trung bình" | "Khó";
type MuscleGroup = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Full Body";

interface Workout {
  id: number;
  date: string;
  type: ExerciseType;
  duration: number;
  calories: number;
  note: string;
  status: WorkoutStatus;
}

interface HealthMetric {
  id: number;
  date: string;
  weight: number;
  height: number;
  heartRate: number;
  sleepHours: number;
}

interface Goal {
  id: number;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

interface Exercise {
  id: number;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  caloriesPerHour: number;
  instructions: string;
}

const initialWorkouts: Workout[] = [
  { id: 1, date: "2025-04-01", type: "Cardio", duration: 45, calories: 380, note: "Chạy bộ buổi sáng", status: "Hoàn thành" },
  { id: 2, date: "2025-04-03", type: "Strength", duration: 60, calories: 420, note: "Ngực + vai", status: "Hoàn thành" },
  { id: 3, date: "2025-04-05", type: "HIIT", duration: 30, calories: 350, note: "", status: "Hoàn thành" },
  { id: 4, date: "2025-04-08", type: "Yoga", duration: 50, calories: 180, note: "Yoga buổi tối", status: "Hoàn thành" },
  { id: 5, date: "2025-04-10", type: "Cardio", duration: 40, calories: 300, note: "Đạp xe", status: "Hoàn thành" },
  { id: 6, date: "2025-04-12", type: "Strength", duration: 65, calories: 450, note: "Lưng + tay", status: "Hoàn thành" },
  { id: 7, date: "2025-04-14", type: "HIIT", duration: 25, calories: 300, note: "", status: "Bỏ lỡ" },
  { id: 8, date: "2025-04-16", type: "Cardio", duration: 50, calories: 420, note: "Chạy dài", status: "Hoàn thành" },
  { id: 9, date: "2025-04-18", type: "Yoga", duration: 45, calories: 160, note: "", status: "Hoàn thành" },
  { id: 10, date: "2025-04-20", type: "Strength", duration: 70, calories: 500, note: "Chân + mông", status: "Hoàn thành" },
];

const initialMetrics: HealthMetric[] = [
  { id: 1, date: "2025-03-01", weight: 72, height: 170, heartRate: 68, sleepHours: 7 },
  { id: 2, date: "2025-03-08", weight: 71.5, height: 170, heartRate: 67, sleepHours: 7.5 },
  { id: 3, date: "2025-03-15", weight: 71, height: 170, heartRate: 66, sleepHours: 8 },
  { id: 4, date: "2025-03-22", weight: 70.5, height: 170, heartRate: 65, sleepHours: 7 },
  { id: 5, date: "2025-04-01", weight: 70, height: 170, heartRate: 64, sleepHours: 7.5 },
  { id: 6, date: "2025-04-08", weight: 69.5, height: 170, heartRate: 63, sleepHours: 8 },
  { id: 7, date: "2025-04-15", weight: 69, height: 170, heartRate: 63, sleepHours: 7 },
  { id: 8, date: "2025-04-22", weight: 68.5, height: 170, heartRate: 62, sleepHours: 7.5 },
];

const initialGoals: Goal[] = [
  { id: 1, name: "Giảm 5kg trong 3 tháng", type: "Giảm cân", targetValue: 5, currentValue: 3.5, deadline: "2025-06-01", status: "Đang thực hiện" },
  { id: 2, name: "Chạy 5km liên tục", type: "Cải thiện sức bền", targetValue: 5, currentValue: 5, deadline: "2025-04-15", status: "Đã đạt" },
  { id: 3, name: "Tăng 2kg cơ bắp", type: "Tăng cơ", targetValue: 2, currentValue: 0.8, deadline: "2025-07-01", status: "Đang thực hiện" },
  { id: 4, name: "Tập 20 buổi/tháng", type: "Khác", targetValue: 20, currentValue: 10, deadline: "2025-04-30", status: "Đang thực hiện" },
];

const initialExercises: Exercise[] = [
  { id: 1, name: "Chạy bộ", muscleGroup: "Full Body", difficulty: "Dễ", description: "Bài tập cardio cơ bản", caloriesPerHour: 600, instructions: "1. Khởi động 5 phút\n2. Chạy với tốc độ vừa phải\n3. Giữ nhịp thở đều\n4. Hạ nhiệt 5 phút" },
  { id: 2, name: "Push-up", muscleGroup: "Chest", difficulty: "Trung bình", description: "Bài tập ngực không cần dụng cụ", caloriesPerHour: 400, instructions: "1. Nằm sấp, 2 tay rộng bằng vai\n2. Đẩy người lên thẳng\n3. Hạ xuống chậm\n4. Lặp lại 3x15 lần" },
  { id: 3, name: "Squat", muscleGroup: "Legs", difficulty: "Trung bình", description: "Bài tập chân toàn diện", caloriesPerHour: 500, instructions: "1. Đứng rộng bằng vai\n2. Hạ người xuống như ngồi ghế\n3. Giữ lưng thẳng\n4. Đứng lên 3x20 lần" },
  { id: 4, name: "Deadlift", muscleGroup: "Back", difficulty: "Khó", description: "Bài tập lưng và chân tổng hợp", caloriesPerHour: 550, instructions: "1. Đứng trước tạ\n2. Cúi xuống giữ tạ\n3. Đứng thẳng nâng tạ\n4. Hạ tạ xuống cẩn thận" },
  { id: 5, name: "Plank", muscleGroup: "Core", difficulty: "Dễ", description: "Bài tập cơ bụng tĩnh", caloriesPerHour: 300, instructions: "1. Chống tay và mũi chân\n2. Giữ người thẳng\n3. Giữ 30-60 giây\n4. Nghỉ 30 giây, lặp lại 3 lần" },
  { id: 6, name: "Burpee", muscleGroup: "Full Body", difficulty: "Khó", description: "Bài tập HIIT toàn thân", caloriesPerHour: 800, instructions: "1. Đứng thẳng\n2. Nhảy xuống plank\n3. Đẩy lên push-up\n4. Nhảy đứng lên, nhảy cao" },
  { id: 7, name: "Shoulder Press", muscleGroup: "Shoulders", difficulty: "Trung bình", description: "Bài tập vai với tạ đôi", caloriesPerHour: 350, instructions: "1. Ngồi thẳng lưng\n2. Tạ ngang vai\n3. Đẩy lên thẳng đầu\n4. Hạ xuống 3x12 lần" },
  { id: 8, name: "Bicep Curl", muscleGroup: "Arms", difficulty: "Dễ", description: "Bài tập tay trước với tạ đôi", caloriesPerHour: 280, instructions: "1. Đứng thẳng cầm tạ\n2. Cuộn tạ lên vai\n3. Giữ 1 giây\n4. Hạ xuống 3x15 lần" },
  { id: 9, name: "Yoga Sun Salutation", muscleGroup: "Full Body", difficulty: "Dễ", description: "Chuỗi tư thế yoga cơ bản", caloriesPerHour: 250, instructions: "1. Tadasana - đứng thẳng\n2. Urdhva Hastasana - tay lên cao\n3. Uttanasana - cúi gập\n4. Hoàn thành vòng lặp" },
];

const exerciseTypeColors: Record<ExerciseType, string> = {
  Cardio: "blue",
  Strength: "red",
  Yoga: "purple",
  HIIT: "orange",
  Other: "default",
};

const difficultyColors: Record<Difficulty, string> = {
  Dễ: "green",
  "Trung bình": "orange",
  Khó: "red",
};

const goalStatusColors: Record<GoalStatus, string> = {
  "Đang thực hiện": "processing",
  "Đã đạt": "success",
  "Đã hủy": "default",
};

function calcBMI(weight: number, height: number) {
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

function getBMITag(bmi: number) {
  if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
  if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
  if (bmi < 30) return <Tag color="gold">Thừa cân</Tag>;
  return <Tag color="red">Béo phì</Tag>;
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [metrics, setMetrics] = useState<HealthMetric[]>(initialMetrics);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutForm] = Form.useForm();

  const [metricModalVisible, setMetricModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [metricForm] = Form.useForm();

  const [goalDrawerVisible, setGoalDrawerVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalForm] = Form.useForm();
  const [goalFilter, setGoalFilter] = useState<string>("Tất cả");

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm] = Form.useForm();
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  const [workoutSearch, setWorkoutSearch] = useState("");
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState<string | undefined>(undefined);
  const [workoutDateRange, setWorkoutDateRange] = useState<[Moment, Moment] | null>(null);

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [exerciseMuscleFilter, setExerciseMuscleFilter] = useState<string | undefined>(undefined);
  const [exerciseDiffFilter, setExerciseDiffFilter] = useState<string | undefined>(undefined);

  const totalSessions = workouts.filter(w => w.status === "Hoàn thành").length;
  const totalCalories = workouts.filter(w => w.status === "Hoàn thành").reduce((a, b) => a + b.calories, 0);

  const streak = useMemo(() => {
    const sorted = [...workouts]
      .filter(w => w.status === "Hoàn thành")
      .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
    let count = 0;
    let current = moment().startOf("day");
    for (const w of sorted) {
      const d = moment(w.date).startOf("day");
      if (d.isSame(current) || d.isSame(current.clone().subtract(count, "days"))) {
        if (count === 0 && d.isSame(current)) count++;
        else if (d.isSame(current.clone().subtract(count, "days"))) count++;
        else break;
      }
    }
    return count;
  }, [workouts]);

  const goalCompletion = useMemo(() => {
    const active = goals.filter(g => g.status === "Đang thực hiện");
    if (!active.length) return 0;
    const pct = active.reduce((a, g) => a + Math.min(100, (g.currentValue / g.targetValue) * 100), 0);
    return Math.round(pct / active.length);
  }, [goals]);

  const weeklyData = useMemo(() => {
    const weeks: Record<string, number> = { "Tuần 1": 0, "Tuần 2": 0, "Tuần 3": 0, "Tuần 4": 0 };
    workouts.filter(w => w.status === "Hoàn thành").forEach(w => {
      const day = moment(w.date).date();
      if (day <= 7) weeks["Tuần 1"]++;
      else if (day <= 14) weeks["Tuần 2"]++;
      else if (day <= 21) weeks["Tuần 3"]++;
      else weeks["Tuần 4"]++;
    });
    return Object.entries(weeks).map(([name, value]) => ({ name, value }));
  }, [workouts]);

  const weightData = useMemo(() =>
    [...metrics].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
      .map(m => ({ name: moment(m.date).format("DD/MM"), weight: m.weight })),
    [metrics]);

  const recentWorkouts = useMemo(() =>
    [...workouts].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()).slice(0, 5),
    [workouts]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const matchSearch = w.type.toLowerCase().includes(workoutSearch.toLowerCase()) || w.note.toLowerCase().includes(workoutSearch.toLowerCase());
      const matchType = !workoutTypeFilter || w.type === workoutTypeFilter;
      const matchDate = !workoutDateRange || (moment(w.date).isSameOrAfter(workoutDateRange[0], "day") && moment(w.date).isSameOrBefore(workoutDateRange[1], "day"));
      return matchSearch && matchType && matchDate;
    });
  }, [workouts, workoutSearch, workoutTypeFilter, workoutDateRange]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(exerciseSearch.toLowerCase());
      const matchMuscle = !exerciseMuscleFilter || e.muscleGroup === exerciseMuscleFilter;
      const matchDiff = !exerciseDiffFilter || e.difficulty === exerciseDiffFilter;
      return matchSearch && matchMuscle && matchDiff;
    });
  }, [exercises, exerciseSearch, exerciseMuscleFilter, exerciseDiffFilter]);

  const filteredGoals = useMemo(() => {
    if (goalFilter === "Tất cả") return goals;
    return goals.filter(g => g.status === goalFilter);
  }, [goals, goalFilter]);

  function openAddWorkout() {
    setEditingWorkout(null);
    workoutForm.resetFields();
    setWorkoutModalVisible(true);
  }

  function openEditWorkout(w: Workout) {
    setEditingWorkout(w);
    workoutForm.setFieldsValue({ ...w, date: moment(w.date) });
    setWorkoutModalVisible(true);
  }

  function handleWorkoutOk() {
    workoutForm.validateFields().then(values => {
      const data: Workout = {
        id: editingWorkout ? editingWorkout.id : Date.now(),
        date: (values.date as Moment).format("YYYY-MM-DD"),
        type: values.type,
        duration: values.duration,
        calories: values.calories,
        note: values.note || "",
        status: values.status,
      };
      if (editingWorkout) {
        setWorkouts(prev => prev.map(w => w.id === data.id ? data : w));
        message.success("Đã cập nhật buổi tập");
      } else {
        setWorkouts(prev => [...prev, data]);
        message.success("Đã thêm buổi tập");
      }
      setWorkoutModalVisible(false);
    });
  }

  function deleteWorkout(id: number) {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    message.success("Đã xóa buổi tập");
  }

  function openAddMetric() {
    setEditingMetric(null);
    metricForm.resetFields();
    setMetricModalVisible(true);
  }

  function openEditMetric(m: HealthMetric) {
    setEditingMetric(m);
    metricForm.setFieldsValue({ ...m, date: moment(m.date) });
    setMetricModalVisible(true);
  }

  function handleMetricOk() {
    metricForm.validateFields().then(values => {
      const data: HealthMetric = {
        id: editingMetric ? editingMetric.id : Date.now(),
        date: (values.date as Moment).format("YYYY-MM-DD"),
        weight: values.weight,
        height: values.height,
        heartRate: values.heartRate,
        sleepHours: values.sleepHours,
      };
      if (editingMetric) {
        setMetrics(prev => prev.map(m => m.id === data.id ? data : m));
        message.success("Đã cập nhật chỉ số");
      } else {
        setMetrics(prev => [...prev, data]);
        message.success("Đã thêm chỉ số");
      }
      setMetricModalVisible(false);
    });
  }

  function deleteMetric(id: number) {
    setMetrics(prev => prev.filter(m => m.id !== id));
    message.success("Đã xóa chỉ số");
  }

  function openAddGoal() {
    setEditingGoal(null);
    goalForm.resetFields();
    setGoalDrawerVisible(true);
  }

  function openEditGoal(g: Goal) {
    setEditingGoal(g);
    goalForm.setFieldsValue({ ...g, deadline: moment(g.deadline) });
    setGoalDrawerVisible(true);
  }

  function handleGoalOk() {
    goalForm.validateFields().then(values => {
      const data: Goal = {
        id: editingGoal ? editingGoal.id : Date.now(),
        name: values.name,
        type: values.type,
        targetValue: values.targetValue,
        currentValue: editingGoal ? editingGoal.currentValue : 0,
        deadline: (values.deadline as Moment).format("YYYY-MM-DD"),
        status: values.status,
      };
      if (editingGoal) {
        setGoals(prev => prev.map(g => g.id === data.id ? data : g));
        message.success("Đã cập nhật mục tiêu");
      } else {
        setGoals(prev => [...prev, data]);
        message.success("Đã thêm mục tiêu");
      }
      setGoalDrawerVisible(false);
    });
  }

  function deleteGoal(id: number) {
    setGoals(prev => prev.filter(g => g.id !== id));
    message.success("Đã xóa mục tiêu");
  }

  function updateGoalCurrent(id: number, value: number) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentValue: value } : g));
  }

  function openAddExercise() {
    setEditingExercise(null);
    exerciseForm.resetFields();
    setExerciseModalVisible(true);
  }

  function openEditExercise(e: Exercise) {
    setEditingExercise(e);
    exerciseForm.setFieldsValue(e);
    setExerciseModalVisible(true);
  }

  function handleExerciseOk() {
    exerciseForm.validateFields().then(values => {
      const data: Exercise = {
        id: editingExercise ? editingExercise.id : Date.now(),
        ...values,
      };
      if (editingExercise) {
        setExercises(prev => prev.map(e => e.id === data.id ? data : e));
        message.success("Đã cập nhật bài tập");
      } else {
        setExercises(prev => [...prev, data]);
        message.success("Đã thêm bài tập");
      }
      setExerciseModalVisible(false);
    });
  }

  function deleteExercise(id: number) {
    setExercises(prev => prev.filter(e => e.id !== id));
    message.success("Đã xóa bài tập");
  }

  const primaryColor = "#cf1322";

  function renderDashboard() {
    return (
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>Tổng quan tháng này</Title>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng buổi tập" value={totalSessions} prefix={<CalendarOutlined />} valueStyle={{ color: primaryColor }} suffix="buổi" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng calo đốt" value={totalCalories} prefix={<FireOutlined />} valueStyle={{ color: "#fa8c16" }} suffix="kcal" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Streak hiện tại" value={streak} prefix={<ThunderboltOutlined />} valueStyle={{ color: "#52c41a" }} suffix="ngày" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Mục tiêu hoàn thành" value={goalCompletion} valueStyle={{ color: primaryColor }} suffix="%" />
              <Progress percent={goalCompletion} strokeColor={primaryColor} showInfo={false} size="small" style={{ marginTop: 8 }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="Buổi tập theo tuần">
              <ReactApexChart
                type="bar"
                height={220}
                series={[{ name: "Số buổi", data: weeklyData.map(d => d.value) }]}
                options={{
                  chart: { toolbar: { show: false } },
                  xaxis: { categories: weeklyData.map(d => d.name) },
                  colors: [primaryColor],
                  plotOptions: { bar: { borderRadius: 4 } },
                  dataLabels: { enabled: false },
                  grid: { borderColor: "#f0f0f0" },
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Thay đổi cân nặng (kg)">
              <ReactApexChart
                type="line"
                height={220}
                series={[{ name: "Cân nặng (kg)", data: weightData.map(d => d.weight) }]}
                options={{
                  chart: { toolbar: { show: false } },
                  xaxis: { categories: weightData.map(d => d.name) },
                  colors: [primaryColor],
                  stroke: { curve: "smooth", width: 2 },
                  markers: { size: 4 },
                  dataLabels: { enabled: false },
                  grid: { borderColor: "#f0f0f0" },
                  yaxis: { labels: { formatter: (v: number) => `${v} kg` } },
                }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="5 buổi tập gần nhất">
          <Timeline>
            {recentWorkouts.map(w => (
              <Timeline.Item
                key={w.id}
                color={w.status === "Hoàn thành" ? "green" : "red"}
              >
                <Space>
                  <Text strong>{moment(w.date).format("DD/MM/YYYY")}</Text>
                  <Tag color={exerciseTypeColors[w.type]}>{w.type}</Tag>
                  <Text>{w.duration} phút</Text>
                  <Text type="secondary"><FireOutlined /> {w.calories} kcal</Text>
                  {w.note && <Text type="secondary">— {w.note}</Text>}
                  <Badge status={w.status === "Hoàn thành" ? "success" : "error"} text={w.status} />
                </Space>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </div>
    );
  }

  const workoutColumns = [
    { title: "Ngày", dataIndex: "date", key: "date", render: (v: string) => moment(v).format("DD/MM/YYYY"), sorter: (a: Workout, b: Workout) => moment(a.date).valueOf() - moment(b.date).valueOf() },
    { title: "Loại bài tập", dataIndex: "type", key: "type", render: (v: ExerciseType) => <Tag color={exerciseTypeColors[v]}>{v}</Tag> },
    { title: "Thời lượng (phút)", dataIndex: "duration", key: "duration" },
    { title: "Calo đốt", dataIndex: "calories", key: "calories", render: (v: number) => <><FireOutlined style={{ color: "#fa8c16" }} /> {v}</> },
    { title: "Ghi chú", dataIndex: "note", key: "note", render: (v: string) => v || "—" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (v: WorkoutStatus) => <Badge status={v === "Hoàn thành" ? "success" : "error"} text={v} />
    },
    {
      title: "Thao tác", key: "action",
      render: (_: any, record: Workout) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditWorkout(record)} />
          <Popconfirm title="Xóa buổi tập này?" onConfirm={() => deleteWorkout(record.id)} okText="Xóa" cancelText="Hủy">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  function renderWorkoutLog() {
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Nhật ký tập luyện</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddWorkout} style={{ background: primaryColor, borderColor: primaryColor }}>Thêm buổi tập</Button>
        </Row>
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={12}>
            <Col span={8}>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm theo tên bài tập..." value={workoutSearch} onChange={e => setWorkoutSearch(e.target.value)} allowClear />
            </Col>
            <Col span={6}>
              <Select placeholder="Lọc theo loại" allowClear style={{ width: "100%" }} value={workoutTypeFilter} onChange={v => setWorkoutTypeFilter(v)}>
                {["Cardio", "Strength", "Yoga", "HIIT", "Other"].map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Col>
            <Col span={10}>
              <RangePicker style={{ width: "100%" }} onChange={(dates) => setWorkoutDateRange(dates as [Moment, Moment] | null)} />
            </Col>
          </Row>
        </Card>
        <Table dataSource={filteredWorkouts} columns={workoutColumns} rowKey="id" size="middle" />

        <Modal
          title={editingWorkout ? "Sửa buổi tập" : "Thêm buổi tập"}
          visible={workoutModalVisible}
          onOk={handleWorkoutOk}
          onCancel={() => setWorkoutModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          okButtonProps={{ style: { background: primaryColor, borderColor: primaryColor } }}
        >
          <Form form={workoutForm} layout="vertical">
            <Form.Item name="date" label="Ngày tập" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
              <Select placeholder="Chọn loại">
                {["Cardio", "Strength", "Yoga", "HIIT", "Other"].map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="calories" label="Calo đốt" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Bỏ lỡ">Bỏ lỡ</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  const metricColumns = [
    { title: "Ngày", dataIndex: "date", key: "date", render: (v: string) => moment(v).format("DD/MM/YYYY"), sorter: (a: HealthMetric, b: HealthMetric) => moment(a.date).valueOf() - moment(b.date).valueOf() },
    { title: "Cân nặng (kg)", dataIndex: "weight", key: "weight" },
    { title: "Chiều cao (cm)", dataIndex: "height", key: "height" },
    {
      title: "BMI", key: "bmi",
      render: (_: any, r: HealthMetric) => {
        const bmi = calcBMI(r.weight, r.height);
        return <Space>{bmi} {getBMITag(bmi)}</Space>;
      }
    },
    { title: "Nhịp tim (bpm)", dataIndex: "heartRate", key: "heartRate" },
    { title: "Giờ ngủ", dataIndex: "sleepHours", key: "sleepHours" },
    {
      title: "Thao tác", key: "action",
      render: (_: any, record: HealthMetric) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditMetric(record)} />
          <Popconfirm title="Xóa chỉ số này?" onConfirm={() => deleteMetric(record.id)} okText="Xóa" cancelText="Hủy">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  function renderHealthMetrics() {
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Nhật ký chỉ số sức khỏe</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddMetric} style={{ background: primaryColor, borderColor: primaryColor }}>Thêm chỉ số</Button>
        </Row>
        <Table dataSource={[...metrics].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())} columns={metricColumns} rowKey="id" size="middle" />

        <Modal
          title={editingMetric ? "Sửa chỉ số" : "Thêm chỉ số sức khỏe"}
          visible={metricModalVisible}
          onOk={handleMetricOk}
          onCancel={() => setMetricModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          okButtonProps={{ style: { background: primaryColor, borderColor: primaryColor } }}
        >
          <Form form={metricForm} layout="vertical">
            <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
              <InputNumber min={1} step={0.1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="heartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true }]}>
              <InputNumber min={30} max={200} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true }]}>
              <InputNumber min={0} max={24} step={0.5} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  function renderGoals() {
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Quản lý mục tiêu</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddGoal} style={{ background: primaryColor, borderColor: primaryColor }}>Thêm mục tiêu</Button>
        </Row>
        <div style={{ marginBottom: 16 }}>
          <Segmented
            options={["Tất cả", "Đang thực hiện", "Đã đạt", "Đã hủy"]}
            value={goalFilter}
            onChange={v => setGoalFilter(v as string)}
          />
        </div>
        <Row gutter={16}>
          {filteredGoals.map(g => {
            const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            return (
              <Col span={8} key={g.id} style={{ marginBottom: 16 }}>
                <Card
                  title={<Space><TrophyOutlined />{g.name}</Space>}
                  extra={
                    <Space>
                      <Button size="small" icon={<EditOutlined />} onClick={() => openEditGoal(g)} />
                      <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => deleteGoal(g.id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Tag color="blue">{g.type}</Tag>
                    <Badge status={goalStatusColors[g.status] as any} text={g.status} />
                    <div>
                      <Text type="secondary">Deadline: </Text>
                      <Text>{moment(g.deadline).format("DD/MM/YYYY")}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Giá trị hiện tại: </Text>
                      <InputNumber
                        size="small"
                        min={0}
                        step={0.1}
                        value={g.currentValue}
                        onChange={v => v !== null && updateGoalCurrent(g.id, v)}
                        style={{ width: 80 }}
                      />
                      <Text type="secondary"> / {g.targetValue}</Text>
                    </div>
                    <Progress percent={pct} strokeColor={pct >= 100 ? "#52c41a" : primaryColor} />
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Drawer
          title={editingGoal ? "Sửa mục tiêu" : "Thêm mục tiêu"}
          width={400}
          visible={goalDrawerVisible}
          onClose={() => setGoalDrawerVisible(false)}
          footer={
            <Row justify="end">
              <Space>
                <Button onClick={() => setGoalDrawerVisible(false)}>Hủy</Button>
                <Button type="primary" onClick={handleGoalOk} style={{ background: primaryColor, borderColor: primaryColor }}>Lưu</Button>
              </Space>
            </Row>
          }
        >
          <Form form={goalForm} layout="vertical">
            <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
              <Select>
                {["Giảm cân", "Tăng cơ", "Cải thiện sức bền", "Khác"].map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}>
              <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Option value="Đang thực hiện">Đang thực hiện</Option>
                <Option value="Đã đạt">Đã đạt</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }

  function renderExerciseLibrary() {
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Thư viện bài tập</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddExercise} style={{ background: primaryColor, borderColor: primaryColor }}>Thêm bài tập</Button>
        </Row>
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={12}>
            <Col span={8}>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm bài tập..." value={exerciseSearch} onChange={e => setExerciseSearch(e.target.value)} allowClear />
            </Col>
            <Col span={8}>
              <Select placeholder="Lọc theo nhóm cơ" allowClear style={{ width: "100%" }} value={exerciseMuscleFilter} onChange={v => setExerciseMuscleFilter(v)}>
                {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"].map(m => <Option key={m} value={m}>{m}</Option>)}
              </Select>
            </Col>
            <Col span={8}>
              <Select placeholder="Lọc theo độ khó" allowClear style={{ width: "100%" }} value={exerciseDiffFilter} onChange={v => setExerciseDiffFilter(v)}>
                {["Dễ", "Trung bình", "Khó"].map(d => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </Col>
          </Row>
        </Card>
        <Row gutter={16}>
          {filteredExercises.map(e => (
            <Col span={8} key={e.id} style={{ marginBottom: 16 }}>
              <Card
                hoverable
                onClick={() => setDetailExercise(e)}
                title={e.name}
                extra={
                  <Space onClick={ev => ev.stopPropagation()}>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEditExercise(e)} />
                    <Popconfirm title="Xóa bài tập này?" onConfirm={() => deleteExercise(e.id)} okText="Xóa" cancelText="Hủy">
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div><Tag>{e.muscleGroup}</Tag><Tag color={difficultyColors[e.difficulty]}>{e.difficulty}</Tag></div>
                  <Text type="secondary">{e.description}</Text>
                  <Text><FireOutlined style={{ color: "#fa8c16" }} /> {e.caloriesPerHour} kcal/giờ</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Chi tiết bài tập"
          visible={!!detailExercise}
          onCancel={() => setDetailExercise(null)}
          footer={<Button onClick={() => setDetailExercise(null)}>Đóng</Button>}
        >
          {detailExercise && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={4}>{detailExercise.name}</Title>
              <div><Tag>{detailExercise.muscleGroup}</Tag><Tag color={difficultyColors[detailExercise.difficulty]}>{detailExercise.difficulty}</Tag></div>
              <Text>{detailExercise.description}</Text>
              <Text><FireOutlined style={{ color: "#fa8c16" }} /> {detailExercise.caloriesPerHour} kcal/giờ</Text>
              <Title level={5}>Hướng dẫn thực hiện:</Title>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 12, borderRadius: 4 }}>{detailExercise.instructions}</pre>
            </Space>
          )}
        </Modal>

        <Modal
          title={editingExercise ? "Sửa bài tập" : "Thêm bài tập"}
          visible={exerciseModalVisible}
          onOk={handleExerciseOk}
          onCancel={() => setExerciseModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          okButtonProps={{ style: { background: primaryColor, borderColor: primaryColor } }}
        >
          <Form form={exerciseForm} layout="vertical">
            <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true }]}>
              <Select>
                {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"].map(m => <Option key={m} value={m}>{m}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true }]}>
              <Select>
                {["Dễ", "Trung bình", "Khó"].map(d => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả ngắn" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="caloriesPerHour" label="Calo đốt trung bình/giờ" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="instructions" label="Hướng dẫn thực hiện" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "workout", icon: <BookOutlined />, label: "Nhật ký tập luyện" },
    { key: "health", icon: <HeartOutlined />, label: "Nhật ký chỉ số" },
    { key: "goals", icon: <TrophyOutlined />, label: "Mục tiêu" },
    { key: "library", icon: <AppstoreOutlined />, label: "Thư viện bài tập" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: 16, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          PTIT FIT
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => setActiveMenu(key)}
          style={{ background: "#1a1a1a", flex: 1, borderBottom: "none" }}
          items={menuItems}
        />
      </Header>
      <Layout>
        <Content style={{ margin: 24, padding: 24, background: "#fff", borderRadius: 8, minHeight: 280 }}>
          {activeMenu === "dashboard" && renderDashboard()}
          {activeMenu === "workout" && renderWorkoutLog()}
          {activeMenu === "health" && renderHealthMetrics()}
          {activeMenu === "goals" && renderGoals()}
          {activeMenu === "library" && renderExerciseLibrary()}
        </Content>
      </Layout>
    </Layout>
  );
}