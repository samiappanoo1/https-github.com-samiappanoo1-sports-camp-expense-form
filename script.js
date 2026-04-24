// ============================================
// STEP MANAGEMENT
// ============================================

let currentStep = 1;
const totalSteps = 6;

function changeStep(direction) {
    const step = document.getElementById(`step-${currentStep}`);
    
    if (direction === 1 && !validateStep(currentStep)) {
        alert('Please fill all required fields correctly!');
        return;
    }
    
    currentStep += direction;
    
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;
    
    updateStepDisplay();
}

function goToStep(stepNumber) {
    // Validate all previous steps before jumping
    for (let i = 1; i < stepNumber; i++) {
        if (!validateStep(i)) {
            alert(`Please complete Step ${i} first!`);
            return;
        }
    }
    
    currentStep = stepNumber;
    updateStepDisplay();
}

function updateStepDisplay() {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step-${i}`).classList.remove('active');
        document.querySelector(`[data-step="${i}"]`).classList.remove('active');
    }
    
    // Show current step
    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    
    // Update buttons
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = currentStep === totalSteps ? 'inline-block' : 'none';
    
    // Update progress bar
    const progress = (currentStep / totalSteps) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    
    // Update step on Step 4
    if (currentStep === 4) {
        updateDAFields();
    }
    
    // Update review on Step 6
    if (currentStep === 6) {
        updateReview();
    }
}

// ============================================
// VALIDATION
// ============================================

function validateStep(stepNumber) {
    if (stepNumber === 1) {
        const institution = document.getElementById('institution').value.trim();
        const coach = document.getElementById('coach').value.trim();
        const manager = document.getElementById('manager').value.trim();
        const players = document.getElementById('players').value;
        const venue = document.getElementById('venue').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!institution || !coach || !manager || !players || !venue || !startDate || !endDate) {
            return false;
        }
        
        if (new Date(endDate) <= new Date(startDate)) {
            alert('End date must be after start date!');
            return false;
        }
        
        return true;
    }
    
    return true;
}

// ============================================
// CAMP EXPENSES
// ============================================

let campRowCount = 0;

function addCampRow() {
    campRowCount++;
    const container = document.getElementById('campRows');
    const row = document.createElement('div');
    row.className = 'row camp-row';
    row.id = `camp-row-${campRowCount}`;
    row.innerHTML = `
        <div>
            <div class="row-title">Bill Type</div>
            <input type="text" placeholder="e.g., Facility Rental" class="camp-bill-type">
        </div>
        <div>
            <div class="row-title">Description</div>
            <input type="text" placeholder="Description" class="camp-description">
        </div>
        <div>
            <div class="row-title">Amount (₹)</div>
            <input type="number" placeholder="0" class="camp-amount" oninput="calculateCampTotal()">
        </div>
        <button type="button" class="btn-remove" onclick="removeCampRow(${campRowCount})">✕</button>
    `;
    container.appendChild(row);
}

function removeCampRow(rowNumber) {
    document.getElementById(`camp-row-${rowNumber}`).remove();
    calculateCampTotal();
}

function calculateCampTotal() {
    const amounts = document.querySelectorAll('.camp-amount');
    let total = 0;
    amounts.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('campSubtotal').textContent = total;
    calculateTotals();
}

// ============================================
// TRAVEL EXPENSES
// ============================================

let travelRowCount = 0;

function addTravelRow() {
    travelRowCount++;
    const container = document.getElementById('travelRows');
    const row = document.createElement('div');
    row.className = 'row travel-row';
    row.id = `travel-row-${travelRowCount}`;
    row.innerHTML = `
        <div>
            <div class="row-title">Route</div>
            <input type="text" placeholder="e.g., Delhi → Goa" class="travel-route">
        </div>
        <div>
            <div class="row-title">Mode</div>
            <select class="travel-mode">
                <option value="">Select Mode</option>
                <option value="Flight">✈️ Flight</option>
                <option value="Bus">🚌 Bus</option>
                <option value="Train">🚆 Train</option>
                <option value="Auto">🚗 Auto</option>
            </select>
        </div>
        <div>
            <div class="row-title">Distance (km)</div>
            <input type="number" placeholder="0" class="travel-distance">
        </div>
        <div>
            <div class="row-title">Amount (₹)</div>
            <input type="number" placeholder="0" class="travel-amount" oninput="calculateTravelTotal()">
        </div>
        <button type="button" class="btn-remove" onclick="removeTravelRow(${travelRowCount})">✕</button>
    `;
    container.appendChild(row);
}

function removeTravelRow(rowNumber) {
    document.getElementById(`travel-row-${rowNumber}`).remove();
    calculateTravelTotal();
}

function calculateTravelTotal() {
    const amounts = document.querySelectorAll('.travel-amount');
    let total = 0;
    amounts.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('travelSubtotal').textContent = total;
    calculateTotals();
}

// ============================================
// DAILY ALLOWANCE
// ============================================

function updateDAFields() {
    const players = parseFloat(document.getElementById('players').value) || 0;
    const staff = 2;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    document.getElementById('daPlayers').value = players;
    document.getElementById('daStaff').value = staff;
    document.getElementById('daTotal').value = players + staff;
    document.getElementById('daDays').value = days;
    
    calculateDA();
}

function calculateDA() {
    const total = parseFloat(document.getElementById('daTotal').value) || 0;
    const days = parseFloat(document.getElementById('daDays').value) || 0;
    const rate = parseFloat(document.getElementById('dailyRate').value) || 0;
    
    const daTotal = total * days * rate;
    document.getElementById('daSubtotal').textContent = daTotal;
    calculateTotals();
}

// ============================================
// OTHER EXPENSES
// ============================================

function calculateOthersTotal() {
    const uniform = parseFloat(document.getElementById('uniform').value) || 0;
    const registration = parseFloat(document.getElementById('registration').value) || 0;
    const officiating = parseFloat(document.getElementById('officiating').value) || 0;
    const equipment = parseFloat(document.getElementById('equipment').value) || 0;
    const miscellaneous = parseFloat(document.getElementById('miscellaneous').value) || 0;
    
    const total = uniform + registration + officiating + equipment + miscellaneous;
    document.getElementById('othersSubtotal').textContent = total;
    return total;
}

// ============================================
// TOTALS & CALCULATIONS
// ============================================

function calculateTotals() {
    const campTotal = parseFloat(document.getElementById('campSubtotal').textContent) || 0;
    const travelTotal = parseFloat(document.getElementById('travelSubtotal').textContent) || 0;
    const daTotal = parseFloat(document.getElementById('daSubtotal').textContent) || 0;
    const othersTotal = calculateOthersTotal();
    
    const grandTotal = campTotal + travelTotal + daTotal + othersTotal;
    document.getElementById('grandTotal').textContent = grandTotal;
}

function updateReview() {
    const campTotal = parseFloat(document.getElementById('campSubtotal').textContent) || 0;
    const travelTotal = parseFloat(document.getElementById('travelSubtotal').textContent) || 0;
    const daTotal = parseFloat(document.getElementById('daSubtotal').textContent) || 0;
    const othersTotal = parseFloat(document.getElementById('othersSubtotal').textContent) || 0;
    
    document.getElementById('reviewCamp').textContent = campTotal;
    document.getElementById('reviewTravel').textContent = travelTotal;
    document.getElementById('reviewDA').textContent = daTotal;
    document.getElementById('reviewOthers').textContent = othersTotal;
    
    calculateTotals();
}

// ============================================
// FORM SUBMISSION
// ============================================

document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const confirm = document.getElementById('confirm').checked;
    if (!confirm) {
        alert('Please confirm the details!');
        return;
    }
    
    // Generate reference number
    const refNumber = generateReferenceNumber();
    
    // Hide form, show success message
    document.getElementById('expenseForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('refNumber').textContent = refNumber;
    
    // Save data to localStorage
    saveFormData(refNumber);
});

function generateReferenceNumber() {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 10000);
    return `CAMP-${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${random}`;
}

function saveFormData(refNumber) {
    const formData = {
        refNumber: refNumber,
        institution: document.getElementById('institution').value,
        coach: document.getElementById('coach').value,
        manager: document.getElementById('manager').value,
        players: document.getElementById('players').value,
        venue: document.getElementById('venue').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        campTotal: document.getElementById('campSubtotal').textContent,
        travelTotal: document.getElementById('travelSubtotal').textContent,
        daTotal: document.getElementById('daSubtotal').textContent,
        othersTotal: document.getElementById('othersSubtotal').textContent,
        grandTotal: document.getElementById('grandTotal').textContent,
        timestamp: new Date().toLocaleString()
    };
    
    localStorage.setItem(`form-${refNumber}`, JSON.stringify(formData));
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function downloadPDF() {
    alert('PDF export coming soon! You can print to PDF using your browser.');
}

function downloadWord() {
    alert('Word export coming soon!');
}

function printForm() {
    window.print();
}

function resetForm() {
    document.getElementById('expenseForm').reset();
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('expenseForm').style.display = 'block';
    currentStep = 1;
    campRowCount = 0;
    travelRowCount = 0;
    document.getElementById('campRows').innerHTML = '';
    document.getElementById('travelRows').innerHTML = '';
    updateStepDisplay();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to dots
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function() {
            goToStep(parseInt(this.dataset.step));
        });
    });
    
    // Initialize
    updateStepDisplay();
    addCampRow();
    addTravelRow();
});
