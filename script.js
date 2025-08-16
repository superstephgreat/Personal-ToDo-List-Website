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
const describeInput = document.getElementById('describe-input');

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

  // Show "No tasks" message if nothing matches
  const anyTasksVisible = document.querySelectorAll('.task:visible').length > 0;
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
function isTaskListEmpty() {
  const tasks = document.querySelectorAll('.task');
  noTasksMsg.style.display = tasks.length === 0 ? 'block' : 'none';
}
isTaskListEmpty();

// Open/close task form
add.addEventListener('click', () => {
  taskForm.style.display = 'block';
  add.style.display = 'none';
});

function closeForm(){
  taskForm.style.display = 'none';
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

    const sectionTitle = document.createElement('h2');
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
  
  const taskDescription = document.createElement('p');
  taskDescription.textContent = describeInput.value

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
  });

  const priorityCategory = document.createElement('span');
  priorityCategory.textContent = selectedPriority;
  priorityCategory.classList.add('priority', selectedPriority.toLowerCase());

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      taskText.style.textDecoration = 'line-through';
      checkbox.disabled = true;
    } else {
      taskText.style.textDecoration = 'none';
    }
  });

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskText);
  taskDiv.appendChild(taskDescription);
  taskDiv.appendChild(deleteTask);
  taskDiv.appendChild(priorityCategory);
  
  
  insertTaskSorted(sectionTasks, taskDiv, selectedPriority);

  // Reset form
  inputTask.value = '';
  describeInput.value =''
  selectedPriority = null;
  priorityBtn.textContent = 'Select Priority';
  selectedSection = null;
  sectionBtn.textContent = 'Select Section';
  saveBtn.disabled = true;

  isTaskListEmpty();
}
// Save button click
saveBtn.addEventListener('click', () => {
  
  addTask()
  closeForm()
});