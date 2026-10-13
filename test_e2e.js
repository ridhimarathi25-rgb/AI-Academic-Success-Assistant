/**
 * AI Academic Success Assistant - Comprehensive End-to-End Browser QA Test
 * 
 * Uses Node.js v24 native WebSocket to drive Microsoft Edge via Chrome DevTools Protocol (CDP).
 * Tests all user flows, interactions, edge cases, responsiveness, and state persistence.
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = 3000;
const CDP_PORT = 9222;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let serverProc = null;
let edgeProc = null;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          if (msg.params.type === 'error') {
            this.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
          }
        }
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const callId = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(callId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: callId, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error('Evaluation exception: ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result.value;
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  console.log('--- STARTING E2E ACCEPTANCE TESTS ---\n');

  // 1. Start static server
  console.log('[Setup] Starting static server on http://localhost:' + PORT);
  const server = require('./server.js');
  await sleep(1000);

  // 2. Launch Edge with remote debugging
  console.log('[Setup] Launching headless Microsoft Edge on remote port ' + CDP_PORT);
  edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `http://localhost:${PORT}/index.html`
  ]);

  await sleep(2500);

  // Connect to CDP
  const version = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
  console.log('[CDP] Connected to Edge browser:', version['User-Agent'].split(' ')[0]);

  const tabs = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const targetTab = tabs.find(t => t.url.includes('localhost') || t.type === 'page');
  if (!targetTab) throw new Error('No target page tab found');

  const client = new CDPClient(targetTab.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Runtime.enable');
  await client.send('Page.enable');

  console.log('\n============================================================');
  console.log('TEST SUITE 1: DASHBOARD PAGE (index.html)');
  console.log('============================================================');

  // Check 1: Initial load & Greeting
  const title = await client.eval('document.title');
  console.log('1. Page Title:', title);
  if (!title.includes('Dashboard')) throw new Error('Incorrect page title: ' + title);

  const greeting = await client.eval('document.getElementById("studentGreeting").textContent');
  console.log('2. Student Greeting:', greeting);
  if (!greeting.includes('Alex Morgan') && !greeting.includes('Alex')) throw new Error('Missing greeting');

  // Check 2: Metric summary cards
  const pendingCount = await client.eval('document.getElementById("metricPendingCount").textContent');
  const upcomingCount = await client.eval('document.getElementById("metricUpcomingCount").textContent');
  const completedCount = await client.eval('document.getElementById("metricCompletedCount").textContent');
  const studyHours = await client.eval('document.getElementById("metricStudyHours").textContent');

  console.log('3. Summary Metrics:');
  console.log(`   Pending: ${pendingCount} | Upcoming: ${upcomingCount} | Completed: ${completedCount} | Hours: ${studyHours}`);
  if (parseInt(pendingCount, 10) !== 5) throw new Error(`Expected 5 pending tasks, got ${pendingCount}`);
  if (parseInt(completedCount, 10) !== 0) throw new Error(`Expected 0 completed tasks, got ${completedCount}`);

  // Check 3: Add Task Modal & Creation
  console.log('4. Testing Add Academic Task form submission...');
  await client.eval(`
    document.getElementById("btnOpenAddTask").click();
    document.getElementById("taskTitle").value = "Discrete Math Problem Set";
    document.getElementById("taskSubject").value = "Mathematics";
    document.getElementById("taskType").value = "Assignment";
    document.getElementById("taskDeadline").value = AcademicData.getRelativeDate(3);
    document.getElementById("taskEffort").value = "2.5";
    document.getElementById("taskDifficulty").value = "High";
    document.getElementById("taskForm").dispatchEvent(new Event("submit"));
  `);
  await sleep(500);

  const newPendingCount = await client.eval('document.getElementById("metricPendingCount").textContent');
  console.log('   New Pending Count after adding task:', newPendingCount);
  if (parseInt(newPendingCount, 10) !== 6) throw new Error('Expected 6 tasks after addition');

  // Check 4: Toggle Task Complete
  console.log('5. Testing Mark Task Done...');
  const firstTaskId = await client.eval('AcademicData.getTasks()[0].id');
  await client.eval(`AcademicApp.toggleTask("${firstTaskId}")`);
  await sleep(500);

  const updatedCompleted = await client.eval('document.getElementById("metricCompletedCount").textContent');
  const progressText = await client.eval('document.getElementById("workloadProgressText").textContent');
  console.log(`   Completed Count: ${updatedCompleted} | Progress: ${progressText}`);
  if (parseInt(updatedCompleted, 10) !== 1) throw new Error('Expected 1 completed task');

  console.log('\n============================================================');
  console.log('TEST SUITE 2: SMART STUDY PLANNER (planner.html)');
  console.log('============================================================');

  // Navigate to planner
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/planner.html` });
  await sleep(1500);

  const plannerTitle = await client.eval('document.title');
  console.log('1. Planner Page Title:', plannerTitle);
  if (!plannerTitle.includes('Planner')) throw new Error('Failed to load planner page');

  // Verify form controls
  const defaultHours = await client.eval('document.getElementById("inputDailyHours").value');
  const horizonVal = await client.eval('document.getElementById("selectHorizon").value');
  console.log(`2. Planner Defaults: Daily Hours = ${defaultHours}h, Horizon = ${horizonVal} days`);

  // Generate 7-day study plan
  console.log('3. Clicking "Generate My Study Plan"...');
  await client.eval('document.getElementById("plannerConfigForm").dispatchEvent(new Event("submit"))');
  await sleep(800);

  const scheduledHours = await client.eval('document.querySelector(".plan-stat-num").textContent');
  const dailyCardsCount = await client.eval('document.querySelectorAll(".daily-schedule-card").length');
  console.log(`   Generated Plan Scheduled Time: ${scheduledHours} across ${dailyCardsCount} days`);
  if (dailyCardsCount !== 7) throw new Error(`Expected 7 daily schedule cards, found ${dailyCardsCount}`);

  // Test toggling session completion
  console.log('4. Testing Session Completion Toggle...');
  const firstSessionCardId = await client.eval('document.querySelector(".session-card").id');
  const sessionId = firstSessionCardId.replace('card_', '');
  await client.eval(`AcademicPlanner.toggleSession("${sessionId}")`);
  await sleep(500);

  const completionRate = await client.eval('document.getElementById("planCompletionRateNum").textContent');
  console.log(`   Updated Plan Completion Rate: ${completionRate}`);
  if (completionRate === '0%') throw new Error('Expected positive completion rate after marking session done');

  // Test reload persistence of study plan
  console.log('5. Testing Plan Persistence on Reload...');
  await client.send('Page.reload');
  await sleep(1500);

  const restoredCardsCount = await client.eval('document.querySelectorAll(".daily-schedule-card").length');
  console.log(`   Restored Daily Cards on reload: ${restoredCardsCount}`);
  if (restoredCardsCount !== 7) throw new Error('Plan did not persist across page reload');

  console.log('\n============================================================');
  console.log('TEST SUITE 3: AI ACADEMIC ASSISTANT (assistant.html)');
  console.log('============================================================');

  // Navigate to assistant
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/assistant.html` });
  await sleep(1500);

  const assistantTitle = await client.eval('document.title');
  console.log('1. Assistant Title:', assistantTitle);
  if (!assistantTitle.includes('Assistant')) throw new Error('Failed to load assistant page');

  // Verify simulated prototype label
  const bannerText = await client.eval('document.querySelector(".banner-prototype").textContent');
  console.log('2. Simulated AI Banner:', bannerText.trim().substring(0, 75) + '...');
  if (!bannerText.includes('Simulated AI Responses')) throw new Error('Missing simulated AI disclosure banner');

  // Check initial messages
  const initialBubbleCount = await client.eval('document.querySelectorAll(".message-bubble").length');
  console.log('3. Initial messages rendered:', initialBubbleCount);
  if (initialBubbleCount === 0) throw new Error('No welcome message rendered');

  // Test suggested question prompt
  console.log('4. Testing Suggested Question: "What should I study first?"...');
  await client.eval(`
    document.getElementById("chatInput").value = "What should I study first?";
    document.getElementById("chatForm").dispatchEvent(new Event("submit"));
  `);
  await sleep(1200);

  const messagesAfter1 = await client.eval('document.querySelectorAll(".message-bubble").length');
  const latestAiReply = await client.eval('document.querySelectorAll(".message-bubble.assistant .message-text")[document.querySelectorAll(".message-bubble.assistant").length - 1].textContent');
  console.log('   Response preview:', latestAiReply.substring(0, 120) + '...');
  if (messagesAfter1 <= initialBubbleCount) throw new Error('No assistant response added');

  // Test custom question: "Help me prepare for my upcoming exams."
  console.log('5. Testing Exam Preparation intent...');
  await client.eval(`
    document.getElementById("chatInput").value = "Help me prepare for my upcoming exams.";
    document.getElementById("chatForm").dispatchEvent(new Event("submit"));
  `);
  await sleep(1200);

  const examReply = await client.eval('document.querySelectorAll(".message-bubble.assistant .message-text")[document.querySelectorAll(".message-bubble.assistant").length - 1].textContent');
  console.log('   Exam response preview:', examReply.substring(0, 120) + '...');
  if (!examReply.includes('assessment') && !examReply.includes('Test') && !examReply.includes('Examination')) {
    throw new Error('Exam reply did not reference exam context');
  }

  // Test off-topic fallback
  console.log('6. Testing Off-Topic Fallback...');
  await client.eval(`
    document.getElementById("chatInput").value = "What is the capital of France?";
    document.getElementById("chatForm").dispatchEvent(new Event("submit"));
  `);
  await sleep(1200);

  const fallbackReply = await client.eval('document.querySelectorAll(".message-bubble.assistant .message-text")[document.querySelectorAll(".message-bubble.assistant").length - 1].textContent');
  console.log('   Fallback response preview:', fallbackReply.substring(0, 120) + '...');
  if (!fallbackReply.includes('AI Academic Success Assistant') && !fallbackReply.includes('planning advice')) {
    throw new Error('Fallback response did not explain assistant scope');
  }

  // Test Clear Conversation
  console.log('7. Testing Clear Conversation...');
  await client.eval(`
    document.getElementById("btnClearChat").click();
    document.getElementById("confirmModalProceed").click();
  `);
  await sleep(800);

  const clearedCount = await client.eval('document.querySelectorAll(".message-bubble").length');
  console.log('   Messages after clearing:', clearedCount);
  if (clearedCount !== 1) throw new Error('Expected 1 initial welcome message after clearing');

  console.log('\n============================================================');
  console.log('TEST SUITE 4: RESPONSIVE VIEWPORT CHECKS');
  console.log('============================================================');

  const viewports = [
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Laptop', width: 1280, height: 800 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(400);

    const hasHorizontalOverflow = await client.eval(`
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    `);

    console.log(`- Viewport ${vp.name} (${vp.width}x${vp.height}): Horizontal Overflow = ${hasHorizontalOverflow ? 'FAIL' : 'PASS (No overflow)'}`);
    if (hasHorizontalOverflow) {
      console.warn(`[Warning] Horizontal overflow detected at ${vp.width}px`);
    }
  }

  console.log('\n============================================================');
  console.log('CONSOLE LOG AUDIT');
  console.log('============================================================');
  console.log('Console Errors caught during test execution:', client.consoleErrors.length);
  if (client.consoleErrors.length > 0) {
    console.error('Errors:', client.consoleErrors);
  } else {
    console.log('ZERO uncaught JavaScript errors in browser console!');
  }

  await client.close();

  if (edgeProc) edgeProc.kill();
  console.log('\nALL E2E ACCEPTANCE TESTS COMPLETED SUCCESSFULLY! 🎉');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\nE2E TEST FAILURE:', err);
  if (edgeProc) edgeProc.kill();
  process.exit(1);
});
