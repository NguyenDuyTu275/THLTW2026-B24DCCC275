import { Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, message } from "antd"
import { useState, useEffect } from "react"

interface Subject{
  id:number
  name:string
}

interface Knowledge{
  id:number
  name:string
}

interface Question{
  id:number
  subject:string
  knowledge:string
  level:string
  content:string
}

interface Exam{
  id:number
  subject:string
  level:string
  count:number
  questions:Question[]
}

export default function App(){

  const [subjects,setSubjects] = useState<Subject[]>([])
  const [knowledges,setKnowledges] = useState<Knowledge[]>([])
  const [questions,setQuestions] = useState<Question[]>([])
  const [exam,setExam] = useState<Question[]>([])
  const [savedExams,setSavedExams] = useState<Exam[]>([])

  const [openSubject,setOpenSubject] = useState(false)
  const [openKnowledge,setOpenKnowledge] = useState(false)
  const [openQuestion,setOpenQuestion] = useState(false)

  const [formSubject] = Form.useForm()
  const [formKnowledge] = Form.useForm()
  const [formQuestion] = Form.useForm()
  const [formExam] = Form.useForm()

  useEffect(()=>{
    const s = localStorage.getItem("subjects")
    const k = localStorage.getItem("knowledges")
    const q = localStorage.getItem("questions")
    const e = localStorage.getItem("exams")

    if(s) setSubjects(JSON.parse(s))
    if(k) setKnowledges(JSON.parse(k))
    if(q) setQuestions(JSON.parse(q))
    if(e) setSavedExams(JSON.parse(e))
  },[])

  const addSubject=()=>{
    formSubject.validateFields().then(v=>{
      const list=[...subjects,{id:Date.now(),...v}]
      setSubjects(list)
      localStorage.setItem("subjects",JSON.stringify(list))
      setOpenSubject(false)
      formSubject.resetFields()
    })
  }

  const addKnowledge=()=>{
    formKnowledge.validateFields().then(v=>{
      const list=[...knowledges,{id:Date.now(),...v}]
      setKnowledges(list)
      localStorage.setItem("knowledges",JSON.stringify(list))
      setOpenKnowledge(false)
      formKnowledge.resetFields()
    })
  }

  const addQuestion=()=>{
    formQuestion.validateFields().then(v=>{
      const list=[...questions,{id:Date.now(),...v}]
      setQuestions(list)
      localStorage.setItem("questions",JSON.stringify(list))
      setOpenQuestion(false)
      formQuestion.resetFields()
    })
  }

  const generateExam=()=>{

    const v=formExam.getFieldsValue()

    const filtered=questions.filter(q=>q.level===v.level && q.subject===v.subject)

    if(filtered.length < v.count){
      message.error("Không đủ câu hỏi")
      return
    }

    const shuffled=[...filtered].sort(()=>Math.random()-0.5)

    const result=shuffled.slice(0,v.count)

    setExam(result)
  }

  const saveExam=()=>{

    const v=formExam.getFieldsValue()

    const newExam:Exam={
      id:Date.now(),
      subject:v.subject,
      level:v.level,
      count:v.count,
      questions:exam
    }

    const list=[...savedExams,newExam]

    setSavedExams(list)

    localStorage.setItem("exams",JSON.stringify(list))

    message.success("Đã lưu đề thi")
  }

  return(

    <Tabs
      items={[

        {
          key:"1",
          label:"Môn học",
          children:(
            <>
              <Button type="primary" onClick={()=>setOpenSubject(true)}>Thêm môn</Button>

              <Table
                rowKey="id"
                dataSource={subjects}
                columns={[
                  {title:"Tên môn",dataIndex:"name"}
                ]}
                style={{marginTop:20}}
              />

              <Modal open={openSubject} onOk={addSubject} onCancel={()=>setOpenSubject(false)}>
                <Form form={formSubject}>
                  <Form.Item name="name" label="Tên môn">
                    <Input/>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )
        },

        {
          key:"2",
          label:"Khối kiến thức",
          children:(
            <>
              <Button type="primary" onClick={()=>setOpenKnowledge(true)}>Thêm khối</Button>

              <Table
                rowKey="id"
                dataSource={knowledges}
                columns={[
                  {title:"Tên khối",dataIndex:"name"}
                ]}
                style={{marginTop:20}}
              />

              <Modal open={openKnowledge} onOk={addKnowledge} onCancel={()=>setOpenKnowledge(false)}>
                <Form form={formKnowledge}>
                  <Form.Item name="name" label="Tên khối">
                    <Input/>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )
        },

        {
          key:"3",
          label:"Câu hỏi",
          children:(
            <>
              <Button type="primary" onClick={()=>setOpenQuestion(true)}>Thêm câu hỏi</Button>

              <Table
                rowKey="id"
                dataSource={questions}
                columns={[
                  {title:"Môn",dataIndex:"subject"},
                  {title:"Khối",dataIndex:"knowledge"},
                  {title:"Độ khó",dataIndex:"level"},
                  {title:"Nội dung",dataIndex:"content"}
                ]}
                style={{marginTop:20}}
              />

              <Modal open={openQuestion} onOk={addQuestion} onCancel={()=>setOpenQuestion(false)}>

                <Form form={formQuestion} layout="vertical">

                  <Form.Item name="subject" label="Môn">

                    <Select
                      options={subjects.map(s=>({
                        value:s.name,
                        label:s.name
                      }))}
                    />

                  </Form.Item>

                  <Form.Item name="knowledge" label="Khối">

                    <Select
                      options={knowledges.map(k=>({
                        value:k.name,
                        label:k.name
                      }))}
                    />

                  </Form.Item>

                  <Form.Item name="level" label="Độ khó">

                    <Select
                      options={[
                        {value:"Dễ"},
                        {value:"Trung bình"},
                        {value:"Khó"},
                        {value:"Rất khó"}
                      ]}
                    />

                  </Form.Item>

                  <Form.Item name="content" label="Nội dung">
                    <Input.TextArea/>
                  </Form.Item>

                </Form>

              </Modal>
            </>
          )
        },

        {
          key:"4",
          label:"Tạo đề thi",
          children:(
            <>
              <Form layout="inline" form={formExam}>

                <Form.Item name="subject">

                  <Select
                    placeholder="Môn"
                    style={{width:150}}
                    options={subjects.map(s=>({
                      value:s.name,
                      label:s.name
                    }))}
                  />

                </Form.Item>

                <Form.Item name="level">

                  <Select
                    placeholder="Độ khó"
                    style={{width:150}}
                    options={[
                      {value:"Dễ"},
                      {value:"Trung bình"},
                      {value:"Khó"},
                      {value:"Rất khó"}
                    ]}
                  />

                </Form.Item>

                <Form.Item name="count">
                  <InputNumber placeholder="Số câu"/>
                </Form.Item>

                <Button type="primary" onClick={generateExam}>
                  Tạo đề
                </Button>

                <Button onClick={saveExam}>
                  Lưu đề
                </Button>

              </Form>

              <Table
                rowKey="id"
                dataSource={exam}
                columns={[
                  {title:"Môn",dataIndex:"subject"},
                  {title:"Nội dung",dataIndex:"content"},
                  {title:"Độ khó",dataIndex:"level"}
                ]}
                style={{marginTop:20}}
              />

              <Table
                rowKey="id"
                dataSource={savedExams}
                columns={[
                  {title:"Môn",dataIndex:"subject"},
                  {title:"Độ khó",dataIndex:"level"},
                  {title:"Số câu",dataIndex:"count"}
                ]}
                style={{marginTop:20}}
              />

            </>
          )
        }

      ]}
    />

  )
}