// HOSPITAL MANAGEMENT SYSTEM

// 1. DEMO LOGIN
const DEMO_USERNAME = "mukesh";
const DEMO_PASSWORD = "mukesh123";

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");


// 2. DOCTOR DATA
const doctors = [
    {
        id: 1,
        name: "Dr. Amit Sharma",
        specialization: "Cardiologist",
        experience: "10 years",
        availability: "Available",
        icon: "👨‍⚕️"
    },
    {
        id: 2,
        name: "Dr. Priya Verma",
        specialization: "Neurologist",
        experience: "8 years",
        availability: "Available",
        icon: "👩‍⚕️"
    },
    {
        id: 3,
        name: "Dr. Rahul Singh",
        specialization: "Orthopedic",
        experience: "7 years",
        availability: "Available",
        icon: "👨‍⚕️"
    },
    {
        id: 4,
        name: "Dr. Neha Gupta",
        specialization: "Pediatrician",
        experience: "6 years",
        availability: "Available",
        icon: "👩‍⚕️"
    },
    {
        id: 5,
        name: "Dr. Shyam Gupta",
        specialization: "Generalmedicine",
        experience: "6 years",
        availability: "Available",
        icon: "👩‍⚕️"
    }
];


// 3. LOCAL STORAGE FUNCTIONS
function getData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// 4. LOAD SAVED RECORDS
let patients = getData("careplus_patients");
let appointments = getData("careplus_appointments");
let bills = getData("careplus_bills");


// 5. HELPER FUNCTIONS
function formatCurrency(amount) {
    return Number(amount).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function generateId(prefix, records) {
    const maxId = records.reduce(function (max, record) {
        const match = String(record.id).match(/(\d+)$/);

        return match
            ? Math.max(max, Number(match[1]))
            : max;
    }, 0);

    return prefix + String(maxId + 1).padStart(3, "0");
}

function getLocalDate() {
    const date = new Date();

    date.setMinutes(
        date.getMinutes() - date.getTimezoneOffset()
    );

    return date.toISOString().split("T")[0];
}

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// ==========================================
// 6. LOGIN AND LOGOUT
// ==========================================

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {
        sessionStorage.setItem("careplus_logged_in", "true");

        loginError.textContent = "";

        showApplication();
    } else {
        loginError.textContent =
            "Invalid username or password. Please try again.";
    }
});


function showApplication() {
    loginPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");

    renderDoctors();
    renderPatients();
    renderAppointments();
    renderBills();

    updatePatientDropdowns();
    updateDashboard();

    showPage("dashboard");
}


function logout() {
    sessionStorage.removeItem("careplus_logged_in");

    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

    loginForm.reset();
    loginError.textContent = "";

    document.getElementById("username").focus();
}

document.getElementById("logoutBtn").addEventListener(
    "click",
    logout
);


// Restore the demo login after a browser refresh.
if (sessionStorage.getItem("careplus_logged_in") === "true") {
    showApplication();
} else {
    loginPage.classList.remove("hidden");
    dashboardPage.classList.add("hidden");
}


// ==========================================
// 7. PAGE NAVIGATION
// ==========================================

const pageNames = {
    dashboard: "Dashboard",
    patients: "Patients",
    doctors: "Doctors",
    appointments: "Appointments",
    billing: "Billing"
};


function showPage(pageName) {
    document.querySelectorAll(".page-section").forEach(
        function (section) {
            section.classList.add("hidden");
        }
    );

    const section = document.getElementById(
        pageName + "Section"
    );

    if (!section) {
        return;
    }

    section.classList.remove("hidden");

    document.getElementById("pageTitle").textContent =
        pageNames[pageName] || "Dashboard";

    document.querySelectorAll(".nav-link").forEach(
        function (link) {
            link.classList.toggle(
                "active",
                link.dataset.page === pageName
            );
        }
    );
}


// Sidebar navigation
document.querySelectorAll(".nav-link").forEach(
    function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            showPage(link.dataset.page);
        });
    }
);


// Dashboard quick actions
document.querySelectorAll("[data-go]").forEach(
    function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.go);
        });
    }
);


// ==========================================
// 8. PATIENT MANAGEMENT
// ==========================================

const patientForm = document.getElementById("patientForm");


patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name =
        document.getElementById("patientName").value.trim();

    const age =
        Number(document.getElementById("patientAge").value);

    const gender =
        document.getElementById("patientGender").value;

    const phone =
        document.getElementById("patientPhone").value.trim();

    const disease =
        document.getElementById("patientDisease").value.trim();

    if (!name || !gender || !disease) {
        alert("Please enter all patient details.");
        return;
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
        alert("Please enter a valid age.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const patient = {
        id: generateId("P", patients),
        name: name,
        age: age,
        gender: gender,
        phone: phone,
        disease: disease,
        registeredAt: new Date().toISOString()
    };

    patients.push(patient);

    saveData("careplus_patients", patients);

    patientForm.reset();

    renderPatients();
    updatePatientDropdowns();
    updateDashboard();

    alert("Patient registered successfully!");

    showPage("patients");
});


// Display patients and recent patient records
function renderPatients() {
    const tableBody =
        document.getElementById("patientsTableBody");

    const recentBody =
        document.getElementById("recentPatientsBody");

    const searchText =
        document.getElementById("patientSearch")
            .value.trim().toLowerCase();

    const filteredPatients = patients.filter(
        function (patient) {
            return [
                patient.id,
                patient.name,
                patient.phone,
                patient.disease,
                patient.gender
            ].some(function (value) {
                return String(value)
                    .toLowerCase()
                    .includes(searchText);
            });
        }
    );

    tableBody.innerHTML = filteredPatients.map(
        function (patient) {
            return `
                <tr>
                    <td>${escapeHTML(patient.id)}</td>
                    <td>${escapeHTML(patient.name)}</td>
                    <td>${escapeHTML(patient.age)}</td>
                    <td>${escapeHTML(patient.gender)}</td>
                    <td>${escapeHTML(patient.phone)}</td>
                    <td>${escapeHTML(patient.disease)}</td>
                    <td>
                        <button
                            class="delete-btn"
                            data-delete-patient="${escapeHTML(patient.id)}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }
    ).join("");

    document.getElementById("patientsEmpty").classList.toggle(
        "hidden",
        filteredPatients.length > 0
    );

    const recentPatients = [...patients].slice(-5).reverse();

    recentBody.innerHTML = recentPatients.map(
        function (patient) {
            return `
                <tr>
                    <td>${escapeHTML(patient.id)}</td>
                    <td>${escapeHTML(patient.name)}</td>
                    <td>${escapeHTML(patient.age)}</td>
                    <td>${escapeHTML(patient.gender)}</td>
                    <td>${escapeHTML(patient.phone)}</td>
                </tr>
            `;
        }
    ).join("");

    document.getElementById("recentEmpty").classList.toggle(
        "hidden",
        recentPatients.length > 0
    );
}


// Patient search
document.getElementById("patientSearch").addEventListener(
    "input",
    renderPatients
);


// Delete a patient and associated records
document.getElementById("patientsTableBody").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest(
            "[data-delete-patient]"
        );

        if (!button) {
            return;
        }

        const patientId = button.dataset.deletePatient;

        if (!confirm("Are you sure you want to delete this patient?")) {
            return;
        }

        patients = patients.filter(function (patient) {
            return patient.id !== patientId;
        });

        appointments = appointments.filter(
            function (appointment) {
                return appointment.patientId !== patientId;
            }
        );

        bills = bills.filter(function (bill) {
            return bill.patientId !== patientId;
        });

        saveData("careplus_patients", patients);
        saveData("careplus_appointments", appointments);
        saveData("careplus_bills", bills);

        renderPatients();
        renderAppointments();
        renderBills();

        updatePatientDropdowns();
        updateDashboard();
    }
);


// ==========================================
// 9. DOCTOR MANAGEMENT

function renderDoctors() {
    const doctorsGrid = document.getElementById("doctorsGrid");

    doctorsGrid.innerHTML = doctors.map(
        function (doctor) {
            return `
                <div class="doctor-card">
                    <div class="doctor-avatar">
                        ${doctor.icon}
                    </div>
                    <div class="doctor-info">
                        <h3>${escapeHTML(doctor.name)}</h3>
                        <p>
                            Specialization:
                            ${escapeHTML(doctor.specialization)}
                        </p>
                        <p>
                            Experience:
                            ${escapeHTML(doctor.experience)}
                        </p>
                        <p class="availability">
                            ● ${escapeHTML(doctor.availability)}
                        </p>
                    </div>
                </div>
            `;
        }
    ).join("");

    const doctorDropdown =document.getElementById("appointmentDoctor");

    doctorDropdown.innerHTML =
        '<option value="">Select doctor</option>' +
        doctors.map(function (doctor) {
            return `
                <option value="${doctor.id}">
                    ${escapeHTML(doctor.name)} -
                    ${escapeHTML(doctor.specialization)}
                </option>
            `;
        }).join("");
}
// 10. PATIENT DROPDOWNS

function updatePatientDropdowns() {
    const appointmentDropdown =
        document.getElementById("appointmentPatient");

    const billDropdown =
        document.getElementById("billPatient");

    const patientOptions = patients.map(
        function (patient) {
            return `
                <option value="${escapeHTML(patient.id)}">
                    ${escapeHTML(patient.name)}
                    (${escapeHTML(patient.id)})
                </option>
            `;
        }
    ).join("");

    appointmentDropdown.innerHTML =
        '<option value="">Select patient</option>' +
        patientOptions;

    billDropdown.innerHTML ='<option value="">Select patient</option>' + patientOptions;
}
// ==========================================
// 11. APPOINTMENT MANAGEMENT
const appointmentForm = document.getElementById("appointmentForm");

const appointmentDateInput = document.getElementById("appointmentDate");
appointmentDateInput.min = getLocalDate();


appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientId = document.getElementById("appointmentPatient").value;

    const doctorId = Number(document.getElementById("appointmentDoctor").value);

    const date = appointmentDateInput.value;
    const time =document.getElementById("appointmentTime").value;
    const patient = patients.find(function (item) {
        return item.id === patientId;
    });
    const doctor = doctors.find(function (item) {
        return item.id === doctorId;
    });
    if (!patient || !doctor) {
        alert("Please register a patient and select a valid doctor.");
        return;
    }
    if (!date || !time) {
        alert("Please select an appointment date and time.");
        return;
    }
    if (date < getLocalDate()) {
        alert("Please select today or a future date.");
        return;
    }
    const appointment = {
        id: generateId("A", appointments),
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: date,
        time: time
    };
    appointments.push(appointment);
    saveData("careplus_appointments", appointments);
    appointmentForm.reset();
    renderAppointments();
    updateDashboard();
    alert("Appointment booked successfully!");
});


function renderAppointments() {
    const tableBody =document.getElementById("appointmentsTableBody");
    tableBody.innerHTML = appointments.map(
        function (appointment) {
            return `
                <tr>
                    <td>${escapeHTML(appointment.id)}</td>
                    <td>${escapeHTML(appointment.patientName)}</td>
                    <td>${escapeHTML(appointment.doctorName)}</td>
                    <td>${escapeHTML(appointment.date)}</td>
                    <td>${escapeHTML(appointment.time)}</td>
                    <td>
                        <button
                            class="delete-btn"
                            data-delete-appointment="${escapeHTML(appointment.id)}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }
    ).join("");

    document.getElementById("appointmentsEmpty").classList.toggle(
        "hidden",
        appointments.length > 0
    );
}
// Delete appointment
document.getElementById("appointmentsTableBody").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest(
            "[data-delete-appointment]"
        );
        if (!button) {
            return;
        }
        const appointmentId = button.dataset.deleteAppointment;
        if (!confirm("Delete this appointment?")) {
            return;
        }
        appointments = appointments.filter(
            function (appointment) {
                return appointment.id !== appointmentId;
            }
        );
        saveData("careplus_appointments", appointments);
        renderAppointments();
        updateDashboard();
    }
);
// ==========================================
// 12. BILLING MANAGEMENT
const billingForm =document.getElementById("billingForm");
const medicineFeeInput = document.getElementById("medicineFee");
const bedChargesInput =document.getElementById("bedCharges");
const doctorFeeInput = document.getElementById("doctorFee");
const billTotalPreview =document.getElementById("billTotalPreview");

// Calculate the total from the three charges
function calculateBillTotal() {
    const medicineFee = Number(medicineFeeInput.value) || 0;
    const bedCharges = Number(bedChargesInput.value) || 0;
    const doctorFee = Number(doctorFeeInput.value) || 0;
    const total = medicineFee + bedCharges + doctorFee;
    billTotalPreview.textContent = formatCurrency(total);
    return total;
}

// Automatically update the preview
medicineFeeInput.addEventListener(
    "input",
    calculateBillTotal
);

bedChargesInput.addEventListener(
    "input",
    calculateBillTotal
);

doctorFeeInput.addEventListener(
    "input",
    calculateBillTotal
);

// Generate a new bill
billingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientId =
        document.getElementById("billPatient").value;

    const medicineFee = Number(medicineFeeInput.value);
    const bedCharges = Number(bedChargesInput.value);
    const doctorFee = Number(doctorFeeInput.value);

    const patient = patients.find(function (item) {
        return item.id === patientId;
    });

    if (!patient) {
        alert("Please select a valid patient.");
        return;
    }
    const fees = [medicineFee, bedCharges, doctorFee];
    const invalidFee = fees.some(function (fee) {
        return !Number.isFinite(fee) || fee < 0;
    });

    if (invalidFee) {
        alert("Charges cannot be negative. Enter valid amounts.");
        return;
    }
    const totalAmount = calculateBillTotal();
    if (totalAmount <= 0) {
        alert("Please enter at least one charge greater than zero.");
        return;
    }

    // Create bill record
    const bill = {
        id: generateId("B", bills),
        patientId: patient.id,
        patientName: patient.name,
        medicineFee: medicineFee,
        bedCharges: bedCharges,
        doctorFee: doctorFee,
        amount: totalAmount,
        date: getLocalDate()
    };

    // Save bill
    bills.push(bill);
    saveData("careplus_bills", bills);
    // Update records and dashboard
    renderBills();
    updateDashboard();
    // Show bill confirmation
    alert(
        "BILL GENERATED SUCCESSFULLY!\n\n" +
        "Bill ID: " + bill.id + "\n" +
        "Patient: " + patient.name + "\n\n" +
        "Medicine Fee: " + formatCurrency(medicineFee) + "\n" +
        "Bed Charges: " + formatCurrency(bedCharges) + "\n" +
        "Doctor Fee: " + formatCurrency(doctorFee) + "\n\n" +
        "TOTAL BILL: " + formatCurrency(totalAmount)
    );
    billingForm.reset();
    calculateBillTotal();
});
// Display all billing records
function renderBills() {
    const tableBody =document.getElementById("billingTableBody");

    tableBody.innerHTML = bills.map(function (bill) {
        // Supports older bills created before fee breakdown existed.
        const medicineFee = Number(bill.medicineFee) || 0;
        const bedCharges = Number(bill.bedCharges) || 0;
        const doctorFee = Number(bill.doctorFee) || 0;
        const total = Number(bill.amount) || 0;
        return `
            <tr>
                <td>${escapeHTML(bill.id)}</td>
                <td>${escapeHTML(bill.patientName)}</td>
                <td>${formatCurrency(medicineFee)}</td>
                <td>${formatCurrency(bedCharges)}</td>
                <td>${formatCurrency(doctorFee)}</td>
                <td>
                    <strong>${formatCurrency(total)}</strong>
                </td>
                <td>${escapeHTML(bill.date)}</td>
                <td>
                    <button
                        class="delete-btn"
                        data-delete-bill="${escapeHTML(bill.id)}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    document.getElementById("billingEmpty").classList.toggle(
        "hidden",
        bills.length > 0
    );
}
// Delete a bill
document.getElementById("billingTableBody").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest("[data-delete-bill]");
        if (!button) {
            return;
        }
        const billId = button.dataset.deleteBill;
        if (!confirm("Are you sure you want to delete this bill?")) {
            return;
        }
        bills = bills.filter(function (bill) {
            return bill.id !== billId;
        });
        saveData("careplus_bills", bills);
        renderBills();
        updateDashboard();
    }
);

// 13. DASHBOARD STATISTICS

function updateDashboard() {
    document.getElementById("patientCount").textContent =patients.length;
    document.getElementById("doctorCount").textContent = doctors.length;
    document.getElementById("appointmentCount").textContent =
        appointments.length;

    const total = bills.reduce(function (sum, bill) {
        return sum + (Number(bill.amount) || 0);
    }, 0);

    document.getElementById("totalBilling").textContent =formatCurrency(total);
}

// 14. INITIAL BILL TOTAL
// ==========================================
calculateBillTotal();