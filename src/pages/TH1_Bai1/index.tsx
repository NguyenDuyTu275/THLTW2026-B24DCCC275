import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Typography, Space, Progress, message, Alert } from 'antd';
import { ReloadOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


type GameStatus = 'playing' | 'won' | 'lost';

const GuessingGame: React.FC = () => {
  
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]); 
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

  const MAX_ATTEMPTS: number = 10;

  const startNewGame = (): void => {
    const randomNum: number = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setAttempts(0);
    setGuess(null);
    setHistory([]);
    setGameOver(false);
    setGameStatus('playing');
    message.success('Trò chơi mới bắt đầu!');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = (): void => {
    if (guess === null) {
      message.warning('Hãy nhập một con số!');
      return;
    }

    const currentAttempt: number = attempts + 1;
    let hint: string = "";
    let newStatus: GameStatus = 'playing';

    if (guess === targetNumber) {
      hint = "Chúc mừng! Bạn đã đoán đúng!";
      newStatus = 'won';
      setGameOver(true);
    } else if (guess < targetNumber) {
      hint = "Bạn đoán quá thấp!";
    } else {
      hint = "Bạn đoán quá cao!";
    }

    
    const logEntry: string = `Lượt ${currentAttempt}: ${guess} -> ${hint}`;
    setHistory((prev: string[]) => [logEntry, ...prev]);
    setAttempts(currentAttempt);
    setGameStatus(newStatus);

    if (newStatus !== 'won' && currentAttempt >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      setGameOver(true);
    } else if (newStatus === 'playing') {
      message.info(hint);
    }
    
    setGuess(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#ececec' }}>
      <Card title={<Title level={3}>Đoán Số (1-100)</Title>} style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <Progress 
            percent={(attempts / MAX_ATTEMPTS) * 100} 
            status={gameStatus === 'lost' ? 'exception' : 'active'}
            format={() => `${attempts}/${MAX_ATTEMPTS} `}
          />

          {gameStatus === 'won' && <Alert message="Thắng cuộc!" type="success" showIcon />}
          {gameStatus === 'lost' && <Alert message={`Thua rồi! Số là: ${targetNumber}`} type="error" showIcon />}

          <InputNumber<number>
            size="large"
            min={1}
            max={100}
            style={{ width: '100%' }}
            value={guess}
            onChange={(val: number | null) => setGuess(val)}
            disabled={gameOver}
            onPressEnter={() => { if(!gameOver) handleGuess(); }}
            placeholder="Nhập số..."
          />

          <Button 
            type="primary" 
            block 
            size="large" 
            icon={gameOver ? <ReloadOutlined /> : <SendOutlined />}
            onClick={gameOver ? startNewGame : handleGuess}
          >
            {gameOver ? "Chơi lại" : "Gửi kết quả"}
          </Button>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
            <Text strong>Nhật ký:</Text>
            <div style={{ height: 120, overflowY: 'auto', marginTop: 8 }}>
              {history.map((item, index) => (
                <div key={index} style={{ fontSize: '13px', color: index === 0 ? '#1890ff' : '#888' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default GuessingGame;