let uploadedImage = null;
let uploadedData = null;

// Page Switching Function
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.page-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Check if user is logged in
window.addEventListener('load', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
    // Load tasks on page load
    updateTasksList();
    // Load available therapeutic tasks
    loadAvailableTasks();
});

// Handle Medical Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedImage = file;
        document.getElementById('imageFileName').textContent = file.name;
        
        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewContent').innerHTML = 
                `<img src="${e.target.result}" alt="Medical Image">`;
        };
        reader.readAsDataURL(file);
    }
}

// Handle Therapeutic Data Upload
function handleDataUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedData = file;
        document.getElementById('dataFileName').textContent = file.name;
        
        // Preview text data
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = e.target.result.substring(0, 500);
            document.getElementById('therapeuticPreviewContent').innerHTML = 
                `<div style="text-align: left; white-space: pre-wrap;"><strong>File: ${file.name}</strong><br><br>${preview}...</div>`;
        };
        reader.readAsText(file);
    }
}

// Analyze Data
function analyzeData() {
    if (!uploadedImage) {
        alert('Please upload a medical image first!');
        return;
    }
    
    // Show loading spinner
    document.getElementById('resultsContent').innerHTML = 
        '<div class="loading"><div class="spinner"></div><p>Analyzing medical image...</p></div>';
    
    // Simulate analysis (replace with actual API call later)
    setTimeout(() => {
        const results = generateMockResults();
        document.getElementById('resultsContent').innerHTML = results;
    }, 3000);
}

// Analyze Therapeutic Data
function analyzeTherapeuticData() {
    if (!uploadedData) {
        alert('Please upload therapeutic data first!');
        return;
    }
    
    // Show loading message
    alert('Analyzing therapeutic data: ' + uploadedData.name);
    // You can add analysis results logic here
}

// Generate Mock Results
function generateMockResults() {
    const imageAnalysis = uploadedImage ? 
        `<h3>Medical Image Analysis:</h3>
         <ul>
             <li><strong>File:</strong> ${uploadedImage.name}</li>
             <li><strong>Size:</strong> ${(uploadedImage.size / 1024).toFixed(2)} KB</li>
             <li><strong>Scan Type:</strong> X-Ray / CT Scan</li>
             <li><strong>Confidence:</strong> 94.2%</li>
             <li><strong>Status:</strong> Analysis Complete</li>
         </ul>` : '';
    
    return `${imageAnalysis}<p style="margin-top: 20px; color: #667eea;"><strong>✓ Analysis completed successfully!</strong></p>`;
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Task Management Functions
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Update Tasks List Display
function updateTasksList() {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999; border: 1px solid #ddd;">No tasks assigned yet. Select tasks from above to get started!</td></tr>';
        return;
    }

    let html = '';
    tasks.forEach(task => {
        const statusClass = task.status === 'completed' ? 'style="text-decoration: line-through; color: #999;"' : '';
        const statusBadge = task.status === 'completed' 
            ? '<span style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 3px;">Completed</span>'
            : '<span style="background-color: #ff9800; color: white; padding: 5px 10px; border-radius: 3px;">Pending</span>';
        
        const categoryBadge = `<span style="background-color: #2196F3; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">${task.category || 'General'}</span>`;
        
        html += `
            <tr ${statusClass}>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${task.title}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${task.description || '-'}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${categoryBadge}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${statusBadge}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    <button onclick="toggleTaskStatus(${task.id})" style="padding: 5px 10px; margin-right: 5px; background-color: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        ${task.status === 'completed' ? 'Undo' : 'Complete'}
                    </button>
                    <button onclick="deleteTask(${task.id})" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </td>
            </tr>
        `;
    });

    tasksList.innerHTML = html;
}

// Toggle Task Status
function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasksList();
    }
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasksList();
    }
}

// Suggest Condition for Analysis
function suggestCondition() {
    const conditionInput = document.getElementById('conditionInput').value.trim();

    if (!conditionInput) {
        alert('Please enter a condition to suggest!');
        return;
    }

    // Store suggested conditions
    let suggestedConditions = JSON.parse(localStorage.getItem('suggestedConditions')) || [];
    
    const condition = {
        id: Date.now(),
        name: conditionInput,
        suggestedBy: localStorage.getItem('currentUser') || 'User',
        suggestedAt: new Date().toLocaleString(),
        status: 'pending'
    };

    suggestedConditions.push(condition);
    localStorage.setItem('suggestedConditions', JSON.stringify(suggestedConditions));

    // Clear input
    document.getElementById('conditionInput').value = '';
    alert('Condition suggested successfully! Admins will review your suggestion.');
}

// Load Available Tasks from Task.json
let availableTasks = [];

function loadAvailableTasks() {
    fetch('Task.json')
        .then(response => response.json())
        .then(data => {
            availableTasks = data.tasks;
            populateTaskDropdown();
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
            document.getElementById('taskDropdown').innerHTML = '<option value="">Error loading tasks</option>';
        });
}

// Populate Task Dropdown
function populateTaskDropdown() {
    const dropdown = document.getElementById('taskDropdown');
    
    // Keep the default option
    let html = '<option value="">-- Select a task --</option>';
    
    availableTasks.forEach(task => {
        html += `<option value="${task.id}" data-name="${task.name}" data-desc="${task.description}" data-category="${task.category}">
            ${task.name} (${task.category})
        </option>`;
    });
    
    dropdown.innerHTML = html;
}

// Add Selected Task
function addSelectedTask() {
    const dropdown = document.getElementById('taskDropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    
    if (!selectedOption.value) {
        alert('Please select a task!');
        return;
    }

    const taskId = parseInt(selectedOption.value);
    const taskName = selectedOption.getAttribute('data-name');
    const taskDesc = selectedOption.getAttribute('data-desc');
    const taskCategory = selectedOption.getAttribute('data-category');

    // Check if task already assigned
    if (tasks.some(t => t.taskId === taskId)) {
        alert('This task is already assigned!');
        return;
    }

    const task = {
        id: Date.now(),
        taskId: taskId,
        title: taskName,
        description: taskDesc,
        category: taskCategory,
        status: 'pending',
        createdAt: new Date().toLocaleString()
    };
    
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Reset dropdown
    dropdown.value = '';
    
    updateTasksList();
    alert('Task assigned successfully!');
}
