const steps = [
  {
    name: "Idea / Feature Request",
    processTime: 1,
    waitingTime: 16,
    description: "A new feature request is created by a stakeholder or product owner.",
    bottleneck: false
  },
  {
    name: "Backlog Refinement",
    processTime: 2,
    waitingTime: 24,
    description: "The team clarifies requirements and prepares the item for development.",
    bottleneck: false
  },
  {
    name: "Development",
    processTime: 16,
    waitingTime: 8,
    description: "Developers implement the feature and write the initial tests.",
    bottleneck: false
  },
  {
    name: "Code Review",
    processTime: 3,
    waitingTime: 32,
    description: "The code waits for another developer to review and approve it.",
    bottleneck: true
  },
  {
    name: "QA Testing",
    processTime: 8,
    waitingTime: 24,
    description: "The QA team validates the feature manually and reports defects if found.",
    bottleneck: true
  },
  {
    name: "Deployment Approval",
    processTime: 1,
    waitingTime: 40,
    description: "A manager or release owner approves the feature for production deployment.",
    bottleneck: true
  },
  {
    name: "Production Deployment",
    processTime: 2,
    waitingTime: 4,
    description: "The feature is deployed to the production environment.",
    bottleneck: false
  }
];

const improvements = [
  {
    bottleneck: "Code Review",
    problem: "The feature waits 32 hours for review, even though the review itself takes only 3 hours.",
    improvement: "Introduce review rotation, smaller pull requests, and a 24-hour review policy.",
    impact: "Expected reduction of waiting time by around 24 hours."
  },
  {
    bottleneck: "QA Testing",
    problem: "Manual testing creates a queue before release and slows down feedback.",
    improvement: "Add automated regression tests in the CI pipeline and run smoke tests on every pull request.",
    impact: "Expected reduction of waiting time by around 16 hours."
  },
  {
    bottleneck: "Deployment Approval",
    problem: "Manual approval creates the largest waiting time in the flow.",
    improvement: "Use CI/CD gates, automated checks, and approval only for high-risk releases.",
    impact: "Expected reduction of waiting time by around 32 hours."
  }
];

function formatHours(hours) {
  if (hours < 8) {
    return `${hours}h`;
  }

  const days = hours / 8;
  return `${days.toFixed(days % 1 === 0 ? 0 : 1)} working days`;
}

function calculateMetrics() {
  const totalProcessTime = steps.reduce((sum, step) => sum + step.processTime, 0);
  const totalWaitingTime = steps.reduce((sum, step) => sum + step.waitingTime, 0);
  const totalLeadTime = totalProcessTime + totalWaitingTime;
  const flowEfficiency = (totalProcessTime / totalLeadTime) * 100;

  document.getElementById("totalProcessTime").textContent = formatHours(totalProcessTime);
  document.getElementById("totalWaitingTime").textContent = formatHours(totalWaitingTime);
  document.getElementById("totalLeadTime").textContent = formatHours(totalLeadTime);
  document.getElementById("flowEfficiency").textContent = `${flowEfficiency.toFixed(1)}%`;
}

function renderValueStreamMap() {
  const container = document.getElementById("valueStreamMap");

  steps.forEach((step, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "step-wrapper";

    const card = document.createElement("div");
    card.className = `step-card ${step.bottleneck ? "bottleneck" : ""}`;

    card.innerHTML = `
      <h3>${step.name}</h3>
      <p><strong>Process Time:</strong> ${formatHours(step.processTime)}</p>
      <p><strong>Waiting Time:</strong> ${formatHours(step.waitingTime)}</p>
      <p><strong>Total:</strong> ${formatHours(step.processTime + step.waitingTime)}</p>
      <p>${step.description}</p>
    `;

    wrapper.appendChild(card);

    if (index < steps.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.textContent = "→";
      wrapper.appendChild(arrow);
    }

    container.appendChild(wrapper);
  });
}

function renderBottlenecks() {
  const container = document.getElementById("bottleneckList");
  const bottlenecks = steps.filter(step => step.bottleneck);

  bottlenecks.forEach(step => {
    const card = document.createElement("div");
    card.className = "bottleneck-card";
    card.innerHTML = `
      <h3>${step.name}</h3>
      <p><strong>Why it is a bottleneck:</strong> This step has high waiting time compared to the actual process time.</p>
      <p><strong>Waiting Time:</strong> ${formatHours(step.waitingTime)}</p>
    `;
    container.appendChild(card);
  });
}

function renderImprovementTable() {
  const table = document.getElementById("improvementTable");

  improvements.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.bottleneck}</td>
      <td>${item.problem}</td>
      <td>${item.improvement}</td>
      <td>${item.impact}</td>
    `;
    table.appendChild(row);
  });
}

calculateMetrics();
renderValueStreamMap();
renderBottlenecks();
renderImprovementTable();
