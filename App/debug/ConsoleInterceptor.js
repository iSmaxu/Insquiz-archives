// App/debug/ConsoleInterceptor.js
// =====================================================
// INSQUIZ — Console Interceptor
// Captura console.log / warn / error / info
// Mantiene buffer FIFO en memoria
// =====================================================

const MAX_LOGS = 400;

let logs = [];
let subscribers = [];

function notify() {
  subscribers.forEach((cb) => cb([...logs]));
}

function pushLog(level, args) {
  const entry = {
    id: Date.now() + Math.random(),
    time: new Date().toISOString(),
    level,
    message: args
      .map((a) => {
        try {
          if (typeof a === "string") return a;
          return JSON.stringify(a, null, 2);
        } catch {
          return String(a);
        }
      })
      .join(" "),
  };

  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift(); // FIFO
  }
  notify();
}

export function subscribeLogs(callback) {
  subscribers.push(callback);
  callback([...logs]);
  return () => {
    subscribers = subscribers.filter((c) => c !== callback);
  };
}

export function clearLogs() {
  logs = [];
  notify();
}

// --- Monkey patch console ---

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
const originalInfo = console.info;

console.log = (...args) => {
  pushLog("LOG", args);
  originalLog(...args);
};

console.warn = (...args) => {
  pushLog("WARN", args);
  originalWarn(...args);
};

console.error = (...args) => {
  pushLog("ERROR", args);
  originalError(...args);
};

console.info = (...args) => {
  pushLog("INFO", args);
  originalInfo(...args);
};
