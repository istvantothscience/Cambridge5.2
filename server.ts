import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { SessionState, Student, WSClientMessage, WSServerMessage, StudentSlideAnswer } from './src/types';

const PORT = 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());

// In-memory real-time state for the lesson session
const sessionState: SessionState = {
  currentSlideIndex: 0,
  isLocked: false,
  lessonId: 'cambridge-sci-stage5-l2',
  lessonTitle: 'Our Living World — Lesson 2: Flowers, Seeds & Fruits',
  totalSlides: 10,
  activeStudentsCount: 0,
  startedAt: Date.now(),
};

// Map of studentId -> Student
const studentsMap = new Map<string, Student>();

// Default demo students if session is empty so teacher dashboard can show realistic class preview if needed
function initSeedStudents() {
  const seeds: Array<{ id: string; name: string; avatar: string; points: number }> = [
    { id: 'demo_1', name: 'Emma Watson', avatar: '🌸', points: 3 },
    { id: 'demo_2', name: 'Oliver Green', avatar: '🌱', points: 2 },
    { id: 'demo_3', name: 'Zoe Botanist', avatar: '🌻', points: 4 },
  ];
  for (const s of seeds) {
    studentsMap.set(s.id, {
      id: s.id,
      name: s.name,
      avatar: s.avatar,
      points: s.points,
      lessonPoints: s.points,
      answers: {},
      connected: false,
      joinedAt: Date.now() - 60000,
      lastActive: Date.now(),
    });
  }
}
initSeedStudents();

// Map of WebSocket -> client metadata
interface ClientMeta {
  role: 'teacher' | 'student';
  studentId?: string;
}
const clientsMap = new Map<WebSocket, ClientMeta>();

// Broadcast helper
function broadcast(message: WSServerMessage, filter?: (client: WebSocket, meta: ClientMeta) => boolean) {
  const data = JSON.stringify(message);
  for (const [ws, meta] of clientsMap.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      if (!filter || filter(ws, meta)) {
        ws.send(data);
      }
    }
  }
}

function getStudentsList(): Student[] {
  return Array.from(studentsMap.values());
}

function updateActiveCount() {
  sessionState.activeStudentsCount = Array.from(studentsMap.values()).filter((s) => s.connected).length;
}

// WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  clientsMap.set(ws, { role: 'student' });

  // Send initial state
  const initMsg: WSServerMessage = {
    type: 'INIT_STATE',
    session: sessionState,
    students: getStudentsList(),
  };
  ws.send(JSON.stringify(initMsg));

  ws.on('message', (rawData) => {
    try {
      const msg: WSClientMessage = JSON.parse(rawData.toString());
      handleMessage(ws, msg);
    } catch (err) {
      console.error('Error parsing client message:', err);
    }
  });

  ws.on('close', () => {
    const meta = clientsMap.get(ws);
    if (meta?.studentId && studentsMap.has(meta.studentId)) {
      const student = studentsMap.get(meta.studentId)!;
      student.connected = false;
      student.lastActive = Date.now();
      updateActiveCount();
      broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });
    }
    clientsMap.delete(ws);
  });

  ws.on('error', (err) => {
    console.warn('WS client error:', err.message);
  });
});

function handleMessage(ws: WebSocket, msg: WSClientMessage) {
  const meta = clientsMap.get(ws) || { role: 'student' };

  switch (msg.type) {
    case 'JOIN': {
      meta.role = msg.role;
      if (msg.role === 'student' && msg.name) {
        const studentId = msg.studentId || 'student_' + Math.random().toString(36).substring(2, 9);
        meta.studentId = studentId;

        let student = studentsMap.get(studentId);
        if (!student) {
          student = {
            id: studentId,
            name: msg.name.trim(),
            avatar: msg.avatar || '🌱',
            points: 0,
            lessonPoints: 0,
            answers: {},
            connected: true,
            joinedAt: Date.now(),
            lastActive: Date.now(),
          };
          studentsMap.set(studentId, student);
        } else {
          student.name = msg.name.trim();
          if (msg.avatar) student.avatar = msg.avatar;
          student.connected = true;
          student.lastActive = Date.now();
        }

        clientsMap.set(ws, meta);
        updateActiveCount();

        // Send confirmation back to this specific student
        ws.send(
          JSON.stringify({
            type: 'INIT_STATE',
            session: sessionState,
            students: getStudentsList(),
            currentStudent: student,
          } as WSServerMessage)
        );

        // Broadcast to all (especially teacher)
        broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });
      } else {
        clientsMap.set(ws, meta);
      }
      break;
    }

    case 'SET_SLIDE': {
      if (typeof msg.slideIndex === 'number' && msg.slideIndex >= 0 && msg.slideIndex < sessionState.totalSlides) {
        sessionState.currentSlideIndex = msg.slideIndex;
        broadcast({ type: 'SLIDE_CHANGED', slideIndex: sessionState.currentSlideIndex });
      }
      break;
    }

    case 'NEXT_SLIDE': {
      if (sessionState.currentSlideIndex < sessionState.totalSlides - 1) {
        sessionState.currentSlideIndex += 1;
        broadcast({ type: 'SLIDE_CHANGED', slideIndex: sessionState.currentSlideIndex });
      }
      break;
    }

    case 'PREV_SLIDE': {
      if (sessionState.currentSlideIndex > 0) {
        sessionState.currentSlideIndex -= 1;
        broadcast({ type: 'SLIDE_CHANGED', slideIndex: sessionState.currentSlideIndex });
      }
      break;
    }

    case 'SUBMIT_ANSWER': {
      if (sessionState.isLocked) return;
      const studentId = meta.studentId;
      if (!studentId || !studentsMap.has(studentId)) return;

      const student = studentsMap.get(studentId)!;
      const answerRecord: StudentSlideAnswer = {
        slideId: msg.slideId,
        slideIndex: msg.slideIndex,
        submittedAt: Date.now(),
        data: msg.data,
        scoreEarned: msg.scoreEarned || 0,
      };

      // Check if previous answer had score
      const previousAnswer = student.answers[msg.slideId];
      const prevScore = previousAnswer ? previousAnswer.scoreEarned || 0 : 0;
      const scoreDiff = (msg.scoreEarned || 0) - prevScore;

      student.answers[msg.slideId] = answerRecord;
      student.points = Math.max(0, student.points + scoreDiff);
      student.lessonPoints = Math.max(0, student.lessonPoints + scoreDiff);
      student.lastActive = Date.now();

      // Notify teacher of the specific answer
      broadcast({
        type: 'ANSWER_RECEIVED',
        studentId,
        slideId: msg.slideId,
        answer: answerRecord,
      });

      // Update student list / leaderboard
      broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });

      // Notify points updated
      if (scoreDiff > 0) {
        broadcast({
          type: 'POINTS_AWARDED',
          studentId,
          points: scoreDiff,
          reason: `Task completed (+${scoreDiff} Gardener Points)`,
          totalPoints: student.points,
        });
      }
      break;
    }

    case 'AWARD_BONUS': {
      const student = studentsMap.get(msg.studentId);
      if (student) {
        student.points += msg.points;
        student.lessonPoints += msg.points;
        broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });
        broadcast({
          type: 'POINTS_AWARDED',
          studentId: student.id,
          points: msg.points,
          reason: msg.reason || 'Teacher Bonus Point Award!',
          totalPoints: student.points,
        });
      }
      break;
    }

    case 'AWARD_CLASS_BONUS': {
      const pts = msg.points || 1;
      for (const student of studentsMap.values()) {
        if (student.connected) {
          student.points += pts;
          student.lessonPoints += pts;
        }
      }
      broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });
      broadcast({
        type: 'CELEBRATION',
        message: `🌟 Whole Class Award! +${pts} Gardener Points awarded to all active students!`,
      });
      break;
    }

    case 'TOGGLE_LOCK': {
      sessionState.isLocked = !!msg.isLocked;
      broadcast({ type: 'LOCK_UPDATED', isLocked: sessionState.isLocked });
      break;
    }

    case 'TRIGGER_CONFETTI': {
      broadcast({
        type: 'CELEBRATION',
        message: '🎉 Congratulations on your amazing plant science work!',
      });
      break;
    }

    case 'RESET_SESSION': {
      sessionState.currentSlideIndex = 0;
      sessionState.isLocked = false;
      for (const student of studentsMap.values()) {
        student.answers = {};
        student.lessonPoints = 0;
      }
      broadcast({ type: 'SLIDE_CHANGED', slideIndex: 0 });
      broadcast({ type: 'LOCK_UPDATED', isLocked: false });
      broadcast({ type: 'STUDENTS_UPDATED', students: getStudentsList() });
      break;
    }
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

app.get('/api/session', (req, res) => {
  res.json({
    session: sessionState,
    students: getStudentsList(),
  });
});

app.post('/api/action', (req, res) => {
  const msg: WSClientMessage = req.body;
  // Handle action synchronously via fallback
  if (msg) {
    // If from REST, we can apply directly
    if (msg.type === 'SET_SLIDE') {
      sessionState.currentSlideIndex = msg.slideIndex;
      broadcast({ type: 'SLIDE_CHANGED', slideIndex: msg.slideIndex });
    } else if (msg.type === 'TOGGLE_LOCK') {
      sessionState.isLocked = msg.isLocked;
      broadcast({ type: 'LOCK_UPDATED', isLocked: msg.isLocked });
    }
  }
  res.json({ success: true, session: sessionState });
});

// Vite middleware or Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
