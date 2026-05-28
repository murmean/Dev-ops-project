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

function createStageElement(stage, index) {
  const card = document.createElement("article");
  card.className = "stage";
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

    <div class="stage-total">Stage Lead Time: <span>${formatDays(stage.process + stage.waiting)}</span></div>
    <div class="bottleneck-label">Bottleneck: high waiting time</div>
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

  highlightBottlenecks();
  renderBottleneckAnalysis();
}

function getBottlenecks() {
  if (stages.length === 0) return [];

  // A bottleneck is any stage where waiting time is bigger than active work time.
  // This shows every problem, not only the stage with the biggest waiting time.
  return stages.filter(stage => stage.waiting > stage.process && stage.waiting > 0);
}

function highlightBottlenecks() {
  const bottlenecks = getBottlenecks();

  document.querySelectorAll(".stage").forEach((card, index) => {
    card.classList.toggle("bottleneck", bottlenecks.includes(stages[index]));

    const total = stages[index].process + stages[index].waiting;
    card.querySelector(".stage-total span").textContent = formatDays(total);
  });
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
    const excessWaiting = stage.waiting - stage.process;
    const targetWaiting = Math.max(stage.process, 0);
    const impact = Math.max(stage.waiting - targetWaiting, 0);

    const listItem = document.createElement("li");
    listItem.textContent = `${stage.title}: waiting time (${formatDays(stage.waiting)}) is higher than process time (${formatDays(stage.process)}).`;
    bottleneckList.appendChild(listItem);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stage.title}</td>
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
