// Get elements
const taskList = document.getElementById('task-list');
const noTasksMsg = document.getElementById('no-tasks');
const add = document.getElementById('add');
const taskForm = document.getElementById('task-form');
const close = document.getElementById('close');
const saveBtn = document.getElementById('save');
const inputTask = document.getElementById('task-input');
const priorityBtn = document.getElementById('priority-btn');
const priorityOptions = document.getElementById('priority-options');

function saveTasksToLocalStorage() {
  const allTasks = [];

  document.querySelectorAll('.task-section').forEach(section => {
    const sectionName = section.getAttribute('data-section');
    section.querySelectorAll('.task').forEach(task => {
      allTasks.push({
        section: sectionName,
        text: task.querySelector('p').textContent,
        priority: task.querySelector('span').textContent,
        completed: task.querySelector('input[type="checkbox"]').checked
      });
    });
  });

  localStorage.setItem('tasks', JSON.stringify(allTasks));
}
let selectedPriority = null;
let selectedSection = null;

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();

  // Loop through all task sections
  const sections = document.querySelectorAll('.task-section');
  sections.forEach(section => {
    const tasks = section.querySelectorAll('.task');
    let anyVisible = false;

    tasks.forEach(task => {
      const taskText = task.querySelector('p').textContent.toLowerCase();
      if (taskText.includes(filter)) {
        task.style.display = 'flex'; // show matching task
        anyVisible = true;
      } else {
        task.style.display = 'none'; // hide non-matching task
      }
    });

    // Hide section if no tasks are visible
    section.style.display = anyVisible ? 'block' : 'none';
  });

isTaskListEmpty()
  // Show "No tasks" message if nothing matches
const anyTasksVisible = Array.from(document.querySelectorAll('.task')).some(task => task.offsetParent !== null);
noTasksMsg.style.display = anyTasksVisible ? 'none' : 'block';
});

const sectionBtn = document.getElementById('section-btn');
const sectionOptions = document.getElementById('section-options');

sectionBtn.addEventListener('click', () => {
  sectionOptions.classList.toggle('hidden');
});

sectionOptions.querySelectorAll('li').forEach(option => {
  option.addEventListener('click', () => {
    selectedSection = option.getAttribute('data-section');
    sectionBtn.textContent = `Section: ${selectedSection}`;
    sectionOptions.classList.add('hidden');

    // Enable save button if task text and priority exist
    updateSaveBtnState();
  });
});

// Show "No tasks" message if task list empty
// Update "No tasks" message and add/remove 'empty' class
function isTaskListEmpty() {
  // Check if any task is visible
  const tasksWrapper = document.querySelector('.tasks-wrapper');
  const tasks = document.querySelectorAll('.task');
  const anyVisible = Array.from(tasks).some(task => task.offsetParent !== null);

  if (anyVisible) {
    noTasksMsg.style.display = 'none';
    tasksWrapper.classList.remove('empty'); // remove empty class
  } else {
    noTasksMsg.style.display = 'flex';
    tasksWrapper.classList.add('empty'); // add empty class
  }
}

// Open/close task form
add.addEventListener('click', () => {
  
  taskForm.classList.add('active');
  add.style.display = 'none';
});

function closeForm(){
  taskForm.classList.remove('active');
  add.style.display = 'block';
}

close.addEventListener('click', () => {
  
  closeForm()
});

// Priority selection
priorityBtn.addEventListener('click', () => {
  priorityOptions.classList.toggle('hidden');
});

priorityOptions.querySelectorAll('li').forEach(option => {
  option.addEventListener('click', () => {
    selectedPriority = option.getAttribute('data-priority');
    priorityBtn.textContent = `Priority: ${selectedPriority}`;
    priorityOptions.classList.add('hidden');

    // Enable save button if task text exists
    updateSaveBtnState();
  });
});

// Enable/disable save button based on input and priority
function updateSaveBtnState() {
  saveBtn.disabled = inputTask.value === '' || !selectedPriority || !selectedSection;
}
inputTask.addEventListener('input', updateSaveBtnState);

function getSectionContainer(sectionName) {
  // Check if the section already exists
  let sectionDiv = document.querySelector(`.task-section[data-section="${sectionName}"]`);
  
  if (!sectionDiv) {
    // Create new section container
    sectionDiv = document.createElement('div');
    sectionDiv.classList.add('task-section');
    sectionDiv.setAttribute('data-section', sectionName);

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = sectionName;
    sectionDiv.appendChild(sectionTitle);

    const sectionTasks = document.createElement('div');
    sectionTasks.classList.add('tasks');
    sectionDiv.appendChild(sectionTasks);

    taskList.appendChild(sectionDiv);
  }

  // Return the container where tasks should go
  return sectionDiv.querySelector('.tasks');
}

// Insert task sorted by priority
function insertTaskSorted(sectionTasks, taskDiv, priority) {
  const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
  const tasks = sectionTasks.querySelectorAll('.task');

  let inserted = false;
  tasks.forEach(existingTask => {
    const existingPriority = existingTask.querySelector('span').textContent.trim();
    if (priorityOrder[priority] > priorityOrder[existingPriority] && !inserted) {
      sectionTasks.insertBefore(taskDiv, existingTask);
      inserted = true;
    }
  });

  if (!inserted) {
    sectionTasks.appendChild(taskDiv);
  }
}

// Add task function
function addTask() {
  if (!inputTask.value || !selectedPriority || !selectedSection) return;
  
  const sectionTasks = getSectionContainer(selectedSection);

  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  

  const taskText = document.createElement('p');
  taskText.textContent = inputTask.value;

  const deleteTask = document.createElement('button');
  deleteTask.textContent = '❌';
  deleteTask.addEventListener('click', () => {
    taskDiv.remove();
    // Remove section if empty
    if (sectionTasks.children.length === 0) {
      sectionTasks.parentElement.remove();
    }
    isTaskListEmpty();
    saveTasksToLocalStorage();
    
  });

  const priorityCategory = document.createElement('span');
  priorityCategory.textContent = selectedPriority;
  priorityCategory.classList.add('priority', selectedPriority.toLowerCase());

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      taskText.style.textDecoration = 'line-through';
      checkbox.classList.add('soft-disabled');
    } else {
      taskText.style.textDecoration = 'none';
      checkbox.classList.remove('soft-disabled')
    }
    saveTasksToLocalStorage();
  });

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskText);
  taskDiv.appendChild(deleteTask);
  taskDiv.appendChild(priorityCategory);
  
  
  insertTaskSorted(sectionTasks, taskDiv, selectedPriority);
  saveTasksToLocalStorage();

  // Reset form
  inputTask.value = '';
  selectedPriority = null;
  priorityBtn.textContent = 'Select Priority';
  selectedSection = null;
  sectionBtn.textContent = 'Select Section';
  saveBtn.disabled = true;

  isTaskListEmpty();
}
// Save button click
saveBtn.addEventListener('click', () => {
  console.log('clicked')
  addTask()
  closeForm()
});



function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    selectedSection = task.section;
    selectedPriority = task.priority;
    inputTask.value = task.text;
    addTask();

    const lastTask = document.querySelector(`.task-section[data-section="${task.section}"] .task:last-child input[type="checkbox"]`);
    if (task.completed) {
      lastTask.checked = true;
      lastTask.classList.add('soft-disabled');
      lastTask.nextElementSibling.style.textDecoration = 'line-through';
    }
  });
  inputTask.value = '';
  selectedSection = null;
  selectedPriority = null;
}

document.addEventListener('DOMContentLoaded', () => {
  isTaskListEmpty();
  loadTasksFromLocalStorage();
});