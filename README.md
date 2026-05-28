# Interactive Value Stream Map

This is a practical DevOps project that visualises a Value Stream Map for a simulated software delivery process.

The project is based on **The First Way: Flow**, a DevOps principle focused on improving how work moves from idea to production.

## Project Goal

The goal of this project is to show how a software feature moves through a delivery pipeline and to identify where delays happen.

The application helps visualise:

- process time
- waiting time
- total lead time
- flow efficiency
- bottlenecks
- possible improvements

## Features

- Interactive Value Stream Map
- Editable stage titles
- Editable process time and waiting time
- Live recalculation of total process time
- Live recalculation of total waiting time
- Live recalculation of total lead time
- Live recalculation of flow efficiency
- Drag and drop stage reordering
- Add new stages dynamically
- Delete stages
- Automatic bottleneck highlighting
- Improvement suggestions based on detected bottlenecks

## Technologies Used

- HTML
- CSS
- JavaScript

## How to Run

Open `index.html` in a browser.

No installation is required.

## Example Software Delivery Flow

The default map contains these stages:

1. Idea / Feature Request
2. Backlog Refinement
3. Development
4. Code Review
5. QA Testing
6. Deployment Approval
7. Production Deployment

Each stage has two values:

- **Process Time**: the time spent actively working
- **Waiting Time**: the time spent waiting before the next step

## Formulas

### Lead Time

```text
Lead Time = Process Time + Waiting Time
```

### Flow Efficiency

```text
Flow Efficiency = Total Process Time / Total Lead Time × 100
```

## Bottlenecks

A bottleneck is a stage that slows down the entire delivery process.

In this project, bottlenecks are detected when a stage has more waiting time than process time.

For example, if Code Review has only a few hours of actual work but several days of waiting, it becomes a bottleneck. The application displays all stages with this problem, not only the stage with the highest waiting time.

## Proposed Improvements

Common improvements include:

- smaller pull requests
- rotating code reviewers
- work in progress limits
- CI/CD automation
- automated testing
- reducing manual approval steps
- faster feedback loops

## Conclusion

This project demonstrates how Value Stream Mapping can be used to identify inefficiencies in software delivery.

It shows that the biggest delays are often not caused by development work itself, but by waiting time between stages.
