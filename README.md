# Value Stream Map – The First Way: Flow

## Project Description

This practical DevOps project visualises a Value Stream Map for a simulated software delivery process. The process starts with a feature idea and ends when the feature is deployed to production.

The project is based on **The First Way – Flow**, one of the main DevOps principles. The First Way focuses on improving the flow of work from development to operations and eventually to the customer.

The goal of this implementation is to identify delays, bottlenecks, and opportunities for improving delivery speed and flow efficiency.

## What Problem Does This Project Solve?

Software teams often spend more time waiting than actually working on a feature. A feature may be delayed by unclear requirements, slow code reviews, manual testing, or manual deployment approvals.

This project makes those delays visible by showing:

- each step in the software delivery process;
- the process time for each step;
- the waiting time for each step;
- the total lead time;
- the flow efficiency;
- the main bottlenecks;
- proposed improvements and their expected impact.

## Software Delivery Process

The simulated process contains the following steps:

1. Idea / Feature Request
2. Backlog Refinement
3. Development
4. Code Review
5. QA Testing
6. Deployment Approval
7. Production Deployment

## Metrics Used

### Process Time

Process time is the time during which active work is being done on the feature.

### Waiting Time

Waiting time is the time during which the feature is blocked or waiting for someone or something.

### Lead Time

Lead time is the total time needed for the feature to move from idea to production.

Formula:

```text
Lead Time = Total Process Time + Total Waiting Time
```

### Flow Efficiency

Flow efficiency shows how much of the total lead time is actual active work.

Formula:

```text
Flow Efficiency = Total Process Time / Total Lead Time × 100
```

## Identified Bottlenecks

### 1. Code Review

Code review has a high waiting time compared to the actual review time. The feature waits in a queue before another developer reviews it.

**Improvement:**

Introduce review rotation, smaller pull requests, and a 24-hour review policy.

**Expected impact:**

Reduce waiting time by approximately 24 hours.

### 2. QA Testing

Manual QA testing creates a delay before release. The feature waits for testers to become available.

**Improvement:**

Add automated regression tests in the CI pipeline and run smoke tests for every pull request.

**Expected impact:**

Reduce waiting time by approximately 16 hours.

### 3. Deployment Approval

Manual deployment approval creates the largest delay in the flow.

**Improvement:**

Use CI/CD gates, automated checks, and manual approval only for high-risk releases.

**Expected impact:**

Reduce waiting time by approximately 32 hours.

## How the Implementation Works

The project is implemented as a simple web application using:

- HTML for the structure;
- CSS for the layout and visual design;
- JavaScript for rendering the value stream map and calculating metrics.

The data for the value stream is stored in a JavaScript array. The application calculates total process time, total waiting time, total lead time, and flow efficiency automatically.

Bottlenecks are visually highlighted in red.

## How to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/your-username/value-stream-map.git
```

2. Open the project folder:

```bash
cd value-stream-map
```

3. Open `index.html` in a browser.

No installation is required.

## Expected Result

The final application displays a visual Value Stream Map from idea to production. It helps explain where delays happen in the software delivery process and how DevOps practices can reduce lead time and improve flow.

## Conclusion

This project demonstrates how Value Stream Mapping can be used in DevOps to make the software delivery process visible. By identifying bottlenecks such as code review delays, manual QA queues, and deployment approvals, a team can improve flow, reduce lead time, and deliver value to users faster.
