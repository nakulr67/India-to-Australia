const texts = [
    "Amazing experiences await you.",
    "Book now and enjoy great discounts!",
    "Get ready for your dream vacation!",
    "Travel with comfort and convenience."
];

let index = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = "";
const fixedText = "Easy booking, affordable prices. ";
const dynamicTextElement = document.getElementById("dynamic-text");

function type() {

    const fullText = texts[index];

    // Handle typing or deleting
    if (isDeleting) {
        currentText = fullText.substring(0, charIndex--); // Delete characters
    } else {
        currentText = fullText.substring(0, charIndex++); // Type characters
    }

    // Set the dynamic text content
    dynamicTextElement.textContent = currentText;

    // Determine the typing speed
    let typingSpeed = isDeleting ? 50 : 100;

    // When the full text has been typed, wait before starting to delete
    if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000; // Pause before deleting
        isDeleting = true;  // Start deleting after the pause
    }
    // When the text has been deleted, move to the next text
    else if (isDeleting && currentText === "") {
        isDeleting = false;
        index = (index + 1) % texts.length; // Loop through the texts array
        charIndex = 0; // Reset character index for typing the next text
        typingSpeed = 500; // Small pause before typing the next text
    }

    // Call the function again to continue typing
    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const oneWayButton = document.getElementById('oneWay');
    const roundTripButton = document.getElementById('roundTrip');
    const slider = document.getElementById('slider');
    const returnInput = document.getElementById('return-input');
    const returnGroup = document.getElementById('return-group');
    const fromInput = document.getElementById('from-input');
    const toInput = document.getElementById('to-input');
    const departureInput = document.getElementById('departure-input');
    const fromError = document.getElementById('from-alert');
    const toError = document.getElementById('to-alert');
    const departureError = document.getElementById('departure-error');
    const returnError = document.getElementById('return-error');

    function validateForm() {
        let valid = true;

        // Validate same airport
        if (fromInput.value === toInput.value && fromInput.value.trim() !== '') {
            fromError.style.display = 'block';
            toError.style.display = 'block';
            valid = false;
        } else {
            fromError.style.display = 'none';
            toError.style.display = 'none';
        }

        // Validate same date
        if (departureInput.value && returnInput.value && departureInput.value === returnInput.value) {
            departureError.style.display = 'block';
            returnError.style.display = 'block';
            valid = false;
        } else {
            departureError.style.display = 'none';
            returnError.style.display = 'none';
        }

        return valid;
    }

    // Trip Toggle Buttons
    oneWayButton.addEventListener('click', () => {
        slider.classList.remove('round-trip');
        slider.classList.add('one-way');
        oneWayButton.classList.add('active');
        roundTripButton.classList.remove('active');
        returnInput.disabled = true; // Disable return date for one-way
        returnGroup.style.opacity = '0.5'; // Visual indication
        validateForm(); // Validate form on trip type change
    });

    roundTripButton.addEventListener('click', () => {
        slider.classList.remove('one-way');
        slider.classList.add('round-trip');
        roundTripButton.classList.add('active');
        oneWayButton.classList.remove('active');
        returnInput.disabled = false; // Enable return date for round-trip
        returnGroup.style.opacity = '1'; // Restore opacity
        validateForm(); // Validate form on trip type change
    });

    // Real-time validation
    fromInput.addEventListener('input', () => {
        if (oneWayButton.classList.contains('active')) {
            // Skip same airport validation for one-way
            fromError.style.display = 'none';
            toError.style.display = 'none';
        } else {
            validateForm();
        }
    });
    toInput.addEventListener('input', validateForm);
    departureInput.addEventListener('input', validateForm);
    returnInput.addEventListener('input', () => {
        if (oneWayButton.classList.contains('active')) {
            // Skip same date validation for one-way
            departureError.style.display = 'none';
            returnError.style.display = 'none';
        } else {
            validateForm();
        }
    });
});


// ====================input seggestion================
const airports = [
    { name: "Indira Gandhi International Airport, Delhi", code: "DEL" },
    { name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai", code: "BOM" },
    { name: "Kempegowda International Airport, Bengaluru", code: "BLR" },
    { name: "Netaji Subhash Chandra Bose International Airport, Kolkata", code: "CCU" },
    { name: "Rajiv Gandhi International Airport, Hyderabad", code: "HYD" },
    { name: "Chennai International Airport, Chennai", code: "MAA" },
    { name: "Cochin International Airport, Kerala", code: "COK" },
    { name: "Dabolim Airport, Goa", code: "GOI" },
    { name: "Trivandrum International Airport, Kerala", code: "TRV" },
    { name: "Lokpriya Gopinath Bordoloi International Airport, Guwahati", code: "GAU" },
    { name: "Swami Vivekananda Airport, Raipur", code: "RPR" },
    { name: "Jaipur International Airport, Jaipur", code: "JAI" }
];

const inputFrom = document.getElementById('from-input');
const inputTo = document.getElementById('to-input');
const suggestionsListFrom = document.getElementById('from-suggestions-list');
const suggestionsListTo = document.getElementById('to-suggestions-list');
const alertFrom = document.getElementById('from-alert');
const alertTo = document.getElementById('to-alert');

let lastInputFrom = '';
let lastInputTo = '';

function filterSuggestions(input, suggestionsList) {
    const query = input.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query) {
        const filteredAirports = airports.filter(airport => {
            return airport.name.toLowerCase().includes(query) || airport.code.toLowerCase().includes(query);
        });

        filteredAirports.forEach(airport => {
            const li = document.createElement('li');
            li.textContent = airport.name;
            li.dataset.code = airport.code;
            li.addEventListener('click', function() {
                input.value = this.textContent;
                suggestionsList.innerHTML = '';
                checkForDuplicateSelection();
            });
            suggestionsList.appendChild(li);
        });
    }
}

function checkForDuplicateSelection() {
    if (inputFrom.value === inputTo.value) {
        alertTo.style.display = 'block';
    } else {
        alertTo.style.display = 'none';
    }
    if (inputTo.value === inputFrom.value) {
        alertFrom.style.display = 'block';
    } else {
        alertFrom.style.display = 'none';
    }
}

inputFrom.addEventListener('input', function() {
    if (this.value === lastInputFrom) {
        alertFrom.style.display = 'block';
        return;
    }
    lastInputFrom = this.value;
    filterSuggestions(this, suggestionsListFrom);
    checkForDuplicateSelection();
});

inputTo.addEventListener('input', function() {
    if (this.value === lastInputTo) {
        alertTo.style.display = 'block';
        return;
    }
    lastInputTo = this.value;
    filterSuggestions(this, suggestionsListTo);
    checkForDuplicateSelection();
});

// ===================form pop===============


// ================return input===================
// function selectTrip(tripType) {
//     const roundTripButton = document.querySelector('.btn-trip.round-trip');
//     const oneWayButton = document.querySelector('.btn-trip.one-way');
//     const returnBox = document.querySelector('.return-box');
    
//     if (tripType === 'one') {
//         roundTripButton.classList.remove('selected');
//         oneWayButton.classList.add('selected');
//         returnBox.style.visibility = 'hidden';  // Hide return date input
//     } else {
//         oneWayButton.classList.remove('selected');
//         roundTripButton.classList.add('selected');
//         returnBox.style.visibility = 'visible';  // Show return date input
//     }
// }
document.addEventListener('DOMContentLoaded', function () {
    const tripInputs = document.querySelectorAll('input[name="trip"]');
    const toggleBtn = document.querySelector('.toggle-btn');
    const roundtripLabel = document.querySelector('.roundtrip-label');
    const onewayLabel = document.querySelector('.oneway-label');
    const returnDateInput = document.getElementById('return');

    tripInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (document.getElementById('oneway').checked) {
                toggleBtn.classList.remove('toggle-roundtrip');
                toggleBtn.classList.add('toggle-oneway');
                roundtripLabel.style.color = '#007bff';
                onewayLabel.style.color = 'white';
                returnDateInput.disabled = true; // Disable return date input
            } else {
                toggleBtn.classList.remove('toggle-oneway');
                toggleBtn.classList.add('toggle-roundtrip');
                onewayLabel.style.color = '#007bff';
                roundtripLabel.style.color = 'white';
                returnDateInput.disabled = false; // Enable return date input
            }
        });
    });
});

// Start the typing effect
document.addEventListener("DOMContentLoaded", function () {
    type();
});

// Function to handle trip selection
// function selectTrip(type) {
//     const oneWayButton = document.querySelector('.btn-trip.one-way');
//     const roundTripButton = document.querySelector('.btn-trip.round-trip');
//     const returnDateField = document.querySelector('.return-date');
//     const returnDateDummy = document.querySelector('.return-date-dummy');
    
//     if (type === 'one') {
//         oneWayButton.classList.add('selected');
//         roundTripButton.classList.remove('selected');
//         returnDateField.style.display = 'none';
//         returnDateDummy.style.display = 'block';
//     } else {
//         oneWayButton.classList.remove('selected');
//         roundTripButton.classList.add('selected');
//         returnDateField.style.display = 'block';
//         returnDateDummy.style.display = 'none';
//     }
// }

// ===============new one btn=================



$(document).ready(function(){
    document.getElementById("heart").onclick = function(){
        document.querySelector(".fa-gratipay").style.color = "#E74C3C";
    };
});

// =====================flight blog-detail section================
