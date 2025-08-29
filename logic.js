// --- DOM Element References ---
const toggleSubjectsBtn = document.getElementById('toggle-subjects');
const toggleTotalBtn = document.getElementById('toggle-total');
const subjectsContainer = document.getElementById('subjects-container');
const totalCgpaContainer = document.getElementById('total-cgpa-container');
const addSubjectBtn = document.getElementById('add-subject-btn');
const subjectsList = document.getElementById('subjects-list');
const calculateBtn = document.getElementById('calculate-btn');
const totalCgpaInput = document.getElementById('total-cgpa-input');
const errorContainer = document.getElementById('error-message');
const resultContainer = document.getElementById('result-container');

// --- State Variable ---
let inputType = 'subjects'; // 'subjects' or 'total'

// --- Data and Logic ---
const nsuPolicy = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
};
const nsuGradeOptions = Object.keys(nsuPolicy);

/**
 * Converts NSU CGPA to AIUB CGPA based on a predefined mapping.
 * @param {number} cgpa - The CGPA from NSU.
 * @returns {number} The equivalent CGPA on the AIUB scale.
 */
function convertCgpa(cgpa) {
    let percentage;
    if (cgpa > 4.0) percentage = 95;
    else if (cgpa >= 4.0) percentage = 95;
    else if (cgpa >= 3.7) percentage = 91;
    else if (cgpa >= 3.3) percentage = 88;
    else if (cgpa >= 3.0) percentage = 84;
    else if (cgpa >= 2.7) percentage = 81;
    else if (cgpa >= 2.3) percentage = 78;
    else if (cgpa >= 2.0) percentage = 74;
    else if (cgpa >= 1.7) percentage = 71;
    else if (cgpa >= 1.3) percentage = 68;
    else if (cgpa >= 1.0) percentage = 63;
    else percentage = 55;

    let aiub;
    if (percentage >= 90) aiub = 4.00;
    else if (percentage >= 85) aiub = 3.75;
    else if (percentage >= 80) aiub = 3.50;
    else if (percentage >= 75) aiub = 3.25;
    else if (percentage >= 70) aiub = 3.00;
    else if (percentage >= 65) aiub = 2.75;
    else if (percentage >= 60) aiub = 2.50;
    else if (percentage >= 50) aiub = 2.25;
    else aiub = 0.00;

    return aiub;
}

/**
 * Creates the HTML for a new subject input row.
 */
function createSubjectRow() {
    const div = document.createElement('div');
    div.className = 'subject-row grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-center gap-3';
    
    const selectOptions = nsuGradeOptions.map(grade => `<option value="${grade}">${grade}</option>`).join('');

    div.innerHTML = `
        <select class="subject-grade w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Select Grade</option>
            ${selectOptions}
        </select>
        <input type="number" placeholder="Credits (e.g., 3)" class="subject-credits w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button class="remove-subject-btn p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors justify-self-center md:justify-self-end" aria-label="Remove Subject">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    subjectsList.appendChild(div);
}

/**
 * Displays an error message.
 * @param {string} message - The error message to show.
 */
function showError(message) {
    errorContainer.innerHTML = `<p class="font-bold">Error</p><p>${message}</p>`;
    errorContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

/**
 * Main function to handle calculation and conversion.
 */
function handleCalculateAndConvert() {
    errorContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');

    try {
        let nsuCgpaToConvert;

        if (inputType === 'subjects') {
            const subjectRows = document.querySelectorAll('.subject-row');
            if (subjectRows.length === 0) {
                showError('Please add at least one subject.');
                return;
            }
            let totalWeightedPoints = 0;
            let totalCredits = 0;
            
            for (const row of subjectRows) {
                const grade = row.querySelector('.subject-grade').value;
                const credits = parseFloat(row.querySelector('.subject-credits').value);

                if (grade === '' || isNaN(credits) || credits <= 0) {
                    showError('Please fill all subject fields with valid grades and positive credit hours.');
                    return;
                }
                totalWeightedPoints += nsuPolicy[grade] * credits;
                totalCredits += credits;
            }
            if (totalCredits === 0) {
                showError('Total credit hours cannot be zero.');
                return;
            }
            nsuCgpaToConvert = totalWeightedPoints / totalCredits;
        } else {
            const cgpaValue = parseFloat(totalCgpaInput.value);
            if (isNaN(cgpaValue) || totalCgpaInput.value.trim() === '') {
                showError('Please enter a valid CGPA.');
                return;
            }
            if (cgpaValue < 0 || cgpaValue > 4.0) {
                showError('Please enter an NSU CGPA between 0.00 and 4.00.');
                return;
            }
            nsuCgpaToConvert = cgpaValue;
        }

        const convertedAiubCgpa = convertCgpa(nsuCgpaToConvert);

        resultContainer.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <p class="text-lg font-medium text-gray-600">NSU CGPA</p>
                    <p class="text-5xl font-bold text-gray-800 my-2">${nsuCgpaToConvert.toFixed(2)}</p>
                </div>
                <div class="bg-green-100 p-4 rounded-lg">
                    <p class="text-lg font-medium text-green-700">Equivalent AIUB CGPA</p>
                    <p class="text-5xl font-bold text-green-600 my-2">${convertedAiubCgpa.toFixed(2)}</p>
                </div>
            </div>
        `;
        resultContainer.classList.remove('hidden');

    } catch (e) {
        showError('An error occurred during calculation.');
        console.error(e);
    }
}

// --- Event Listeners ---
toggleSubjectsBtn.addEventListener('click', () => {
    inputType = 'subjects';
    subjectsContainer.classList.remove('hidden');
    totalCgpaContainer.classList.add('hidden');
    toggleSubjectsBtn.className = 'w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-200 bg-blue-600 text-white shadow';
    toggleTotalBtn.className = 'w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300';
});

toggleTotalBtn.addEventListener('click', () => {
    inputType = 'total';
    subjectsContainer.classList.add('hidden');
    totalCgpaContainer.classList.remove('hidden');
    toggleTotalBtn.className = 'w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-200 bg-blue-600 text-white shadow';
    toggleSubjectsBtn.className = 'w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300';
});

addSubjectBtn.addEventListener('click', createSubjectRow);

// Event delegation for remove buttons
subjectsList.addEventListener('click', function(e) {
    if (e.target.closest('.remove-subject-btn')) {
        e.target.closest('.subject-row').remove();
    }
});

calculateBtn.addEventListener('click', handleCalculateAndConvert);

// --- Initial Setup ---
createSubjectRow(); // Start with one subject row by default
