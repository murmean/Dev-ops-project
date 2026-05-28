const map = document.getElementById("map");
const addStageBtn = document.getElementById("addStageBtn");
const totalProcessTime = document.getElementById("totalProcessTime");
const totalWaitingTime = document.getElementById("totalWaitingTime");
const totalLeadTime = document.getElementById("totalLeadTime");
const flowEfficiency = document.getElementById("flowEfficiency");
const bottleneckList = document.getElementById("bottleneckList");
const improvementTable = document.getElementById("improvementTable");

let stages = [
  { title: "Idea / Feature Request", process: 0.125, waiting: 2 },
  { title: "Backlog Refinement", process: 0.25, waiting: 3 },
  { title: "Development", process: 2, waiting: 1 },
  { title: "Code Review", process: 0.375, waiting: 4 },
  { title: "QA Testing", process: 1, waiting: 3 },
  { title: "Deployment Approval", process: 0.125, waiting: 5 },
  { title: "Production Deployment", process: 0.25, waiting: 0.5 }
];

function formatDays(value) {
  const rounded = Number(value.toFixed(2));
  return `${rounded} ${rounded === 1 ? "day" : "days"}`;
}

function getStageLeadTime(stage) {
  return stage.process + stage.waiting;
}

function getStageEfficiency(stage) {
  const leadTime = getStageLeadTime(stage);
  return leadTime === 0 ? 0 : (stage.process / leadTime) * 100;
}

function getSeverity(stage) {
  if (stage.waiting <= stage.process || stage.waiting <= 0) {
    return {
      level: "none",
      label: "Healthy",
      explanation: "Waiting time is not higher than process time."
    };
  }

  const ratio = stage.process === 0 ? Number.POSITIVE_INFINITY : stage.waiting / stage.process;

  if (ratio >= 4) {
    return {
      level: "critical",
      label: "Critical",
      explanation: "Waiting time is at least four times higher than active work time."
    };
  }

  if (ratio >= 2) {
    return {
      level: "high",
      label: "High",
      explanation: "Waiting time is at least two times higher than active work time."
    };
  }

  return {
    level: "moderate",
    label: "Moderate",
    explanation: "Waiting time is higher than active work time."
  };
}

function getMiniChartWidths(stage) {
  const leadTime = getStageLeadTime(stage);

  if (leadTime === 0) {
    return { processWidth: 0, waitingWidth: 0 };
  }

  return {
    processWidth: (stage.process / leadTime) * 100,
    waitingWidth: (stage.waiting / leadTime) * 100
  };
}

function createStageElement(stage, index) {
  const card = document.createElement("article");
  const severity = getSeverity(stage);
  const efficiency = getStageEfficiency(stage);
  const { processWidth, waitingWidth } = getMiniChartWidths(stage);

  card.className = `stage severity-${severity.level}`;
  card.draggable = true;
  card.dataset.index = index;

  card.innerHTML = `
    <div class="stage-header">
      <h3 class="stage-title" contenteditable="true" spellcheck="false">${stage.title}</h3>
      <button class="delete-btn" type="button">Delete</button>
    </div>

    <div class="input-group">
      <label>Process Time (days)</label>
      <input class="process-input" type="number" min="0" step="0.125" value="${stage.process}">
    </div>

    <div class="input-group">
      <label>Waiting Time (days)</label>
      <input class="waiting-input" type="number" min="0" step="0.125" value="${stage.waiting}">
    </div>

    <div class="mini-chart" aria-label="Process time versus waiting time chart">
      <div class="chart-labels">
        <span>Process</span>
        <span>Waiting</span>
      </div>
      <div class="chart-row">
        <span class="chart-bar process-bar" style="width: ${processWidth}%"></span>
        <span class="chart-bar waiting-bar" style="width: ${waitingWidth}%"></span>
      </div>
      <div class="chart-values">
        <span>${formatDays(stage.process)}</span>
        <span>${formatDays(stage.waiting)}</span>
      </div>
    </div>

    <div class="stage-total">Stage Lead Time: <span>${formatDays(getStageLeadTime(stage))}</span></div>
    <div class="stage-efficiency">Stage Efficiency: <span>${efficiency.toFixed(1)}%</span></div>
    <div class="severity-badge">Severity: <span>${severity.label}</span></div>
    <div class="bottleneck-label">Bottleneck: ${severity.label} waiting time problem</div>
  `;

  const title = card.querySelector(".stage-title");
  const processInput = card.querySelector(".process-input");
  const waitingInput = card.querySelector(".waiting-input");
  const deleteBtn = card.querySelector(".delete-btn");

  title.addEventListener("input", () => {
    stages[index].title = title.textContent.trim() || "Untitled Stage";
    updateCalculations();
  });

  processInput.addEventListener("input", () => {
    stages[index].process = Number(processInput.value) || 0;
    render();
  });

  waitingInput.addEventListener("input", () => {
    stages[index].waiting = Number(waitingInput.value) || 0;
    render();
  });

  deleteBtn.addEventListener("click", () => {
    stages.splice(index, 1);
    render();
  });

  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    updateStageOrderFromDom();
  });

  return card;
}

function render() {
  map.innerHTML = "";
  stages.forEach((stage, index) => {
    map.appendChild(createStageElement(stage, index));
  });
  updateCalculations();
}

function updateCalculations() {
  const processTotal = stages.reduce((sum, stage) => sum + stage.process, 0);
  const waitingTotal = stages.reduce((sum, stage) => sum + stage.waiting, 0);
  const leadTotal = processTotal + waitingTotal;
  const efficiency = leadTotal === 0 ? 0 : (processTotal / leadTotal) * 100;

  totalProcessTime.textContent = formatDays(processTotal);
  totalWaitingTime.textContent = formatDays(waitingTotal);
  totalLeadTime.textContent = formatDays(leadTotal);
  flowEfficiency.textContent = `${efficiency.toFixed(1)}%`;

  renderBottleneckAnalysis();
}

function getBottlenecks() {
  return stages
    .map(stage => ({ ...stage, severity: getSeverity(stage) }))
    .filter(stage => stage.severity.level !== "none");
}

function getImprovementSuggestion(stage) {
  const title = stage.title.toLowerCase();

  if (title.includes("review")) {
    return "Use smaller pull requests, rotating reviewers, and a 24-hour review target.";
  }

  if (title.includes("qa") || title.includes("test")) {
    return "Add automated tests, clear acceptance criteria, and earlier testing feedback.";
  }

  if (title.includes("deploy") || title.includes("approval") || title.includes("release")) {
    return "Use CI/CD automation, automated checks, and reduce manual approval steps for low-risk changes.";
  }

  if (title.includes("backlog") || title.includes("refinement")) {
    return "Improve backlog readiness, define clear requirements, and limit work waiting for clarification.";
  }

  return "Reduce waiting time through clearer ownership, WIP limits, automation, and faster feedback loops.";
}

function renderBottleneckAnalysis() {
  const bottlenecks = getBottlenecks();
  bottleneckList.innerHTML = "";
  improvementTable.innerHTML = "";

  if (bottlenecks.length === 0) {
    bottleneckList.innerHTML = "<li>No bottlenecks detected. Waiting time is not higher than process time in any stage.</li>";
    improvementTable.innerHTML = `
      <tr>
        <td>None</td>
        <td>No improvement required.</td>
        <td>No impact calculated.</td>
      </tr>
    `;
    return;
  }

  bottlenecks.forEach(stage => {
    const targetWaiting = Math.max(stage.process, 0);
    const impact = Math.max(stage.waiting - targetWaiting, 0);
    const ratio = stage.process === 0 ? "infinite" : `${(stage.waiting / stage.process).toFixed(1)}x`;

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>${stage.title}</strong> — ${stage.severity.label} severity. Waiting time (${formatDays(stage.waiting)}) is ${ratio} the process time (${formatDays(stage.process)}). ${stage.severity.explanation}
    `;
    bottleneckList.appendChild(listItem);

    const row = document.createElement("tr");
    row.className = `table-${stage.severity.level}`;
    row.innerHTML = `
      <td><strong>${stage.title}</strong><br><span class="table-severity">${stage.severity.label}</span></td>
      <td>${getImprovementSuggestion(stage)}</td>
      <td>Estimated lead time reduction: about ${formatDays(impact)} if waiting time is reduced to the process time level.</td>
    `;
    improvementTable.appendChild(row);
  });
}

function updateStageOrderFromDom() {
  const newOrder = [...map.querySelectorAll(".stage")].map(card => stages[Number(card.dataset.index)]);
  stages = newOrder;
  render();
}

map.addEventListener("dragover", event => {
  event.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(map, event.clientX);

  if (!dragging) return;

  if (afterElement == null) {
    map.appendChild(dragging);
  } else {
    map.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll(".stage:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }

    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

addStageBtn.addEventListener("click", () => {
  stages.push({
    title: "New Stage",
    process: 1,
    waiting: 1
  });
  render();
});

render();
