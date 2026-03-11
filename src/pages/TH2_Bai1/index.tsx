import React, { useState } from "react";
import { Button, Card, Table, Space, Typography } from "antd";

type Round = {
  player: string;
  computer: string;
  result: string;
};

const choices = ["Kéo", "Búa", "Bao"];

export default function App() {
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<Round[]>([]);

  const playGame = (playerChoice: string) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    let gameResult = "";

    if (playerChoice === computerChoice) {
      gameResult = "Hòa";
    } else if (
      (playerChoice === "Kéo" && computerChoice === "Bao") ||
      (playerChoice === "Búa" && computerChoice === "Kéo") ||
      (playerChoice === "Bao" && computerChoice === "Búa")
    ) {
      gameResult = "Bạn thắng";
    } else {
      gameResult = "Bạn thua";
    }

    const round: Round = {
      player: playerChoice,
      computer: computerChoice,
      result: gameResult,
    };

    setResult(
      `Bạn: ${playerChoice} | Máy: ${computerChoice} | Kết quả: ${gameResult}`
    );

    setHistory((prev) => [round, ...prev]);
  };

  const columns = [
    {
      title: "Ván",
      render: (_: any, __: any, index: number) => history.length - index,
    },
    {
      title: "Bạn",
      dataIndex: "player",
    },
    {
      title: "Máy",
      dataIndex: "computer",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
    },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "auto" }}>
      <Card title="Trò chơi Oẳn Tù Tì">
        <Space>
          <Button type="primary" onClick={() => playGame("Kéo")}>
            Kéo
          </Button>

          <Button type="primary" onClick={() => playGame("Búa")}>
            Búa
          </Button>

          <Button type="primary" onClick={() => playGame("Bao")}>
            Bao
          </Button>
        </Space>

        <Typography.Title level={4} style={{ marginTop: 20 }}>
          {result}
        </Typography.Title>
      </Card>

      <Card title="Lịch sử ván đấu" style={{ marginTop: 20 }}>
        <Table
          dataSource={history}
          columns={columns}
          pagination={false}
          rowKey={(_, index) => index!.toString()}
        />
      </Card>
    </div>
  );
}