const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const old1 = \  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(() => {
    const saved = localStorage.getItem('pomodorosCompleted');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('pomodorosCompleted', pomodorosCompleted.toString());
  }, [pomodorosCompleted]);\;

const new1 = \  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(() => {
    const todayDate = new Date().toDateString();
    const savedDate = localStorage.getItem('pomodoroDate');
    if (savedDate !== todayDate) {
      return 0;
    }
    const saved = localStorage.getItem('pomodorosCompleted');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('pomodorosCompleted', pomodorosCompleted.toString());
    localStorage.setItem('pomodoroDate', new Date().toDateString());
  }, [pomodorosCompleted]);\;

const old2 = \      if (mode.id === MODES.POMODORO.id) {
        const newPomodorosCompleted = pomodorosCompleted + 1;
        setPomodorosCompleted(newPomodorosCompleted);
        
        if (newPomodorosCompleted % 4 === 0) {
          handleModeChange(MODES.LONG_BREAK);
        } else {
          handleModeChange(MODES.SHORT_BREAK);
        }\;

const new2 = \      if (mode.id === MODES.POMODORO.id) {
        const todayDate = new Date().toDateString();
        const savedDate = localStorage.getItem('pomodoroDate');
        const currentCompleted = savedDate !== todayDate ? 0 : pomodorosCompleted;
        
        const newPomodorosCompleted = currentCompleted + 1;
        setPomodorosCompleted(newPomodorosCompleted);
        
        if (newPomodorosCompleted % 4 === 0) {
          handleModeChange(MODES.LONG_BREAK);
        } else {
          handleModeChange(MODES.SHORT_BREAK);
        }\;

fs.writeFileSync('src/App.jsx', content.replace(old1, new1).replace(old2, new2));
