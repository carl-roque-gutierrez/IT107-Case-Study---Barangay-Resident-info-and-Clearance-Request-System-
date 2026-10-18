// INITIAL SEED DATABASE JSON
const INITIAL_RESIDENTS = [
    { id: "RES-1001", firstName: "Carl Justin", middleName: "Roque", lastName: "Gutierrez", birthDate: "2006-11-01", age: 19, gender: "Male", civilStatus: "Single", address: "None of your Beewax", contact: "09676767667", emergencyContact: "Mother (097676767676)", status: "Active" },
    { id: "RES-1002", firstName: "John Vincent", middleName: "Abihay", lastName: "Peroramas", birthDate: "2007-04-14", age: 19, gender: "Male", civilStatus: "Single", address: "None of your Beewax", contact: "0969696969", emergencyContact: "Mother (099696966969)", status: "Active" },
];

const INITIAL_REQUESTS = [
    { reqId: "REQ-201", residentId: "RES-1001", residentName: "Carl Justin Roque Gutierrez", docType: "Certificate of Indigency", purpose: "Scholarship Application", dateRequested: "2026-10-18", status: "Approved" },
    { reqId: "REQ-202", residentId: "RES-1002", residentName: "John Vincent Abihay Peroramas", docType: "Certificate of Indigency", purpose: "Scholarship Application", dateRequested: "2026-10-18", status: "Approved" },
];

// STATE VARIABLES
let residents = [];
let requests = [];
let selectedResidentId = null;

// INITIALIZATION
window.onload = function() {
    loadFromLocalStorage();
    switchView('dashboard');
    renderAllViews();
};

// LOCAL STORAGE STORAGE MANAGEMENT (FIXED TO HANDLE EMPTY ARRAYS)
function loadFromLocalStorage() {
    const storedRes = localStorage.getItem('kalawaan_residents');
    const storedReq = localStorage.getItem('kalawaan_requests');

    if (storedRes) {
        try {
            const parsed = JSON.parse(storedRes);
            if (Array.isArray(parsed) && parsed.length > 0) {
                residents = parsed;
            } else {
                residents = [...INITIAL_RESIDENTS];
                saveToLocalStorage();
            }
        } catch (e) {
            residents = [...INITIAL_RESIDENTS];
            saveToLocalStorage();
        }
    } else {
        residents = [...INITIAL_RESIDENTS];
        saveToLocalStorage();
    }

    if (storedReq) {
        try {
            const parsedReq = JSON.parse(storedReq);
            if (Array.isArray(parsedReq) && parsedReq.length > 0) {
                requests = parsedReq;
            } else {
                requests = [...INITIAL_REQUESTS];
                saveToLocalStorage();
            }
        } catch (e) {
            requests = [...INITIAL_REQUESTS];
            saveToLocalStorage();
        }
    } else {
        requests = [...INITIAL_REQUESTS];
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('kalawaan_residents', JSON.stringify(residents));
    localStorage.setItem('kalawaan_requests', JSON.stringify(requests));
}

function resetToSampleData() {
    if (confirm("Reset all resident and request records back to default sample data?")) {
        residents = [...INITIAL_RESIDENTS];
        requests = [...INITIAL_REQUESTS];
        saveToLocalStorage();
        renderAllViews();
        closeModal('settingsModal');
        showToast("Database restored to default sample data");
    }
}

// VIEW NAVIGATION
function switchView(viewName) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-residents').classList.add('hidden');
    document.getElementById('view-requests').classList.add('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full h-11 px-3 bg-white rounded-xl border border-[#E5E7EB] hover:bg-gray-50 flex items-center gap-3 text-[#202725] font-normal text-sm transition-all text-left';
    });

    if (viewName === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('nav-dashboard').className = 'nav-btn w-full h-11 px-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] flex items-center gap-3 text-figmaBlue-600 font-semibold text-sm transition-all text-left';
    } else if (viewName === 'residents') {
        document.getElementById('view-residents').classList.remove('hidden');
        document.getElementById('nav-residents').className = 'nav-btn w-full h-11 px-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] flex items-center gap-3 text-figmaBlue-600 font-semibold text-sm transition-all text-left';
    } else if (viewName === 'requests') {
        document.getElementById('view-requests').classList.remove('hidden');
        document.getElementById('nav-requests').className = 'nav-btn w-full h-11 px-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] flex items-center gap-3 text-figmaBlue-600 font-semibold text-sm transition-all text-left';
    }
}

// RENDER ALL DATA & CHARTS
function renderAllViews() {
    renderDashboard();
    renderResidentsTable();
    renderRequestsTable();
}

// 1. DASHBOARD CALCULATION & CHARTS RENDER
function renderDashboard() {
    const total = residents.length;
    document.getElementById('dashTotalResidents').innerText = total;
    document.getElementById('dashTotalResidents2').innerText = total;

    if (total === 0) return;

    // Gender Metrics
    const males = residents.filter(r => r.gender === 'Male').length;
    const females = residents.filter(r => r.gender === 'Female').length;
    const malePct = Math.round((males / total) * 100) || 0;
    const femalePct = 100 - malePct;

    document.getElementById('dashMenPct').innerText = `${malePct}%`;
    document.getElementById('dashWomenPct').innerText = `${femalePct}%`;
    
    document.getElementById('genderDonut').style.background = `conic-gradient(#1D4ED8 0% ${malePct}%, #60A5FA ${malePct}% 100%)`;

    // Status Metrics
    const active = residents.filter(r => r.status === 'Active').length;
    const pending = residents.filter(r => r.status === 'Pending').length;
    const inactive = residents.filter(r => r.status === 'Inactive').length;
    const archived = residents.filter(r => r.status === 'Archived').length;

    const actPct = Math.round((active / total) * 100) || 0;
    const penPct = Math.round((pending / total) * 100) || 0;
    const inaPct = Math.round((inactive / total) * 100) || 0;
    const arcPct = Math.max(0, 100 - (actPct + penPct + inaPct));

    document.getElementById('dashActivePct').innerText = `${actPct}%`;
    document.getElementById('dashPendingPct').innerText = `${penPct}%`;
    document.getElementById('dashInactivePct').innerText = `${inaPct}%`;
    document.getElementById('dashArchivedPct').innerText = `${arcPct}%`;

    const p1 = actPct;
    const p2 = p1 + penPct;
    const p3 = p2 + inaPct;
    document.getElementById('statusDonut').style.background = `conic-gradient(#1D4ED8 0% ${p1}%, #60A5FA ${p1}% ${p2}%, #93C5FD ${p2}% ${p3}%, #BFDBFE ${p3}% 100%)`;

    // Age Group Distribution Bar Calculation
    const ageGroups = [
        { label: '18–24', min: 18, max: 24, m: 0, f: 0 },
        { label: '25–34', min: 25, max: 34, m: 0, f: 0 },
        { label: '35–44', min: 35, max: 44, m: 0, f: 0 },
        { label: '45–54', min: 45, max: 54, m: 0, f: 0 },
        { label: '55+',   min: 55, max: 150, m: 0, f: 0 }
    ];

    residents.forEach(r => {
        const group = ageGroups.find(g => r.age >= g.min && r.age <= g.max) || ageGroups[4];
        if (r.gender === 'Male') group.m++;
        else group.f++;
    });

    const maxCount = Math.max(...ageGroups.map(g => g.m + g.f), 1);
    const ageContainer = document.getElementById('ageBarContainer');
    ageContainer.innerHTML = '';

    ageGroups.forEach(g => {
        const mHeight = Math.round((g.m / maxCount) * 100);
        const fHeight = Math.round((g.f / maxCount) * 100);

        const col = document.createElement('div');
        col.className = 'flex-1 flex flex-col items-center gap-2 h-full justify-end';
        col.innerHTML = `
            <div class="w-8 flex flex-col justify-end items-center gap-0.5 h-32" title="${g.label}: ${g.m} Male, ${g.f} Female">
                <div style="height: ${mHeight}px" class="w-full bg-figmaBlue-600 rounded-t-sm transition-all duration-300"></div>
                <div style="height: ${fHeight}px" class="w-full bg-figmaBlue-400 rounded-b-sm transition-all duration-300"></div>
            </div>
            <span class="text-[10px] font-semibold text-gray-700">${g.label}</span>
        `;
        ageContainer.appendChild(col);
    });
}

// 2. RESIDENT TABLE DISPLAY & SEARCH FILTER
function renderResidentsTable(data = residents) {
    const tbody = document.getElementById('residentTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400">No resident records found matching criteria.</td></tr>`;
        document.getElementById('tableRecordCount').innerText = `Showing 0 entries`;
        return;
    }

    data.forEach(r => {
        const tr = document.createElement('tr');
        tr.className = `hover:bg-gray-50 transition-colors cursor-pointer ${selectedResidentId === r.id ? 'bg-blue-50/60' : ''}`;
        tr.onclick = (e) => {
            if (e.target.closest('button')) return;
            selectedResidentId = r.id;
            renderResidentsTable(data);
        };

        let statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (r.status === 'Pending') statusBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        if (r.status === 'Inactive') statusBadgeClass = 'bg-gray-100 text-gray-600 border-gray-200';
        if (r.status === 'Archived') statusBadgeClass = 'bg-purple-50 text-purple-700 border-purple-200';

        tr.innerHTML = `
            <td class="p-3.5 pl-5 font-medium text-gray-900">
                <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-[10px] border border-brand-200">
                        ${r.firstName.charAt(0)}${r.lastName.charAt(0)}
                    </div>
                    <div>
                        <div class="font-semibold text-gray-900">${r.firstName} ${r.middleName ? r.middleName + ' ' : ''}${r.lastName}</div>
                        <div class="text-[10px] text-gray-400 font-mono">${r.id}</div>
                    </div>
                </div>
            </td>
            <td class="p-3.5 text-gray-600">${r.age} yrs (${r.birthDate})</td>
            <td class="p-3.5 text-gray-600">${r.gender}</td>
            <td class="p-3.5 text-gray-600 max-w-[180px] truncate">${r.address}</td>
            <td class="p-3.5 text-gray-600">${r.contact || 'N/A'}</td>
            <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass}">${r.status}</span>
            </td>
            <td class="p-3.5 pr-5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                    <button onclick="viewResidentDetails('${r.id}')" title="View Profile" class="p-1.5 hover:bg-gray-200 rounded text-gray-600"><i class="fa-regular fa-eye"></i></button>
                    <button onclick="openEditResidentModal('${r.id}')" title="Edit Record" class="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteResident('${r.id}')" title="Delete Record" class="p-1.5 hover:bg-red-100 text-red-600 rounded"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('tableRecordCount').innerText = `Showing ${data.length} of ${residents.length} residents`;
}

function filterResidents() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const gender = document.getElementById('filterGender').value;

    const filtered = residents.filter(r => {
        const fullName = `${r.firstName} ${r.middleName || ''} ${r.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(search) || r.address.toLowerCase().includes(search) || r.id.toLowerCase().includes(search);
        const matchesStatus = !status || r.status === status;
        const matchesGender = !gender || r.gender === gender;
        return matchesSearch && matchesStatus && matchesGender;
    });

    renderResidentsTable(filtered);
}

// 3. CREATE / EDIT RESIDENT CRUD LOGIC
function openAddResidentModal() {
    document.getElementById('modalTitle').innerText = 'Add New Resident';
    document.getElementById('residentForm').reset();
    document.getElementById('residentId').value = '';
    document.getElementById('status').value = 'Active';
    openModal('residentModal');
}

function openEditResidentModal(id) {
    const res = residents.find(r => r.id === id);
    if (!res) return;

    document.getElementById('modalTitle').innerText = 'Edit Resident Details';
    document.getElementById('residentId').value = res.id;
    document.getElementById('firstName').value = res.firstName;
    document.getElementById('middleName').value = res.middleName || '';
    document.getElementById('lastName').value = res.lastName;
    document.getElementById('birthDate').value = res.birthDate;
    document.getElementById('age').value = res.age;
    document.getElementById('gender').value = res.gender;
    document.getElementById('civilStatus').value = res.civilStatus;
    document.getElementById('status').value = res.status;
    document.getElementById('address').value = res.address;
    document.getElementById('contact').value = res.contact || '';
    document.getElementById('emergencyContact').value = res.emergencyContact || '';

    openModal('residentModal');
}

function calculateAgeFromDate() {
    const dateVal = document.getElementById('birthDate').value;
    if (!dateVal) return;
    const today = new Date();
    const birth = new Date(dateVal);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    document.getElementById('age').value = age;
}

function handleResidentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('residentId').value;
    
    const residentObj = {
        id: id || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        age: parseInt(document.getElementById('age').value) || 0,
        gender: document.getElementById('gender').value,
        civilStatus: document.getElementById('civilStatus').value,
        status: document.getElementById('status').value,
        address: document.getElementById('address').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        emergencyContact: document.getElementById('emergencyContact').value.trim()
    };

    if (id) {
        const idx = residents.findIndex(r => r.id === id);
        if (idx !== -1) residents[idx] = residentObj;
        showToast("Resident updated successfully");
    } else {
        residents.unshift(residentObj);
        showToast("New resident added to database");
    }

    saveToLocalStorage();
    renderAllViews();
    closeModal('residentModal');
}

function deleteResident(id) {
    const res = residents.find(r => r.id === id);
    if (!res) return;

    if (confirm(`Are you sure you want to delete resident record for ${res.firstName} ${res.lastName}?`)) {
        residents = residents.filter(r => r.id !== id);
        if (selectedResidentId === id) selectedResidentId = null;
        saveToLocalStorage();
        renderAllViews();
        showToast("Resident record deleted");
    }
}

function triggerQuickEdit() {
    if (!selectedResidentId) {
        alert("Please select a resident from 'Display Residents Info' table first.");
        switchView('residents');
        return;
    }
    openEditResidentModal(selectedResidentId);
}

function triggerQuickDelete() {
    if (!selectedResidentId) {
        alert("Please select a resident from 'Display Residents Info' table first.");
        switchView('residents');
        return;
    }
    deleteResident(selectedResidentId);
}

// VIEW DETAILS MODAL
function viewResidentDetails(id) {
    const r = residents.find(res => res.id === id);
    if (!r) return;

    const body = document.getElementById('residentDetailsBody');
    body.innerHTML = `
        <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
            <div>
                <div class="text-base font-bold text-gray-900">${r.firstName} ${r.middleName || ''} ${r.lastName}</div>
                <div class="text-xs text-gray-500 font-mono">ID: ${r.id}</div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-200">${r.status}</span>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2">
            <div><span class="text-gray-400">Birthdate:</span> <p class="font-semibold text-gray-800">${r.birthDate}</p></div>
            <div><span class="text-gray-400">Age:</span> <p class="font-semibold text-gray-800">${r.age} yrs old</p></div>
            <div><span class="text-gray-400">Gender:</span> <p class="font-semibold text-gray-800">${r.gender}</p></div>
            <div><span class="text-gray-400">Civil Status:</span> <p class="font-semibold text-gray-800">${r.civilStatus}</p></div>
        </div>
        <div class="pt-2 border-t border-gray-100">
            <span class="text-gray-400">Address:</span>
            <p class="font-semibold text-gray-800 mt-0.5">${r.address}</p>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div><span class="text-gray-400">Contact Number:</span> <p class="font-semibold text-gray-800">${r.contact || 'None'}</p></div>
            <div><span class="text-gray-400">Emergency Contact:</span> <p class="font-semibold text-gray-800">${r.emergencyContact || 'None'}</p></div>
        </div>
    `;
    openModal('viewResidentModal');
}

// 4. REQUEST MANAGEMENT LOGIC
function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = '';

    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-400">No document requests registered.</td></tr>`;
        return;
    }

    requests.forEach(req => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50";

        let statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
        if (req.status === 'Approved') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (req.status === 'Rejected') statusBadge = 'bg-red-50 text-red-700 border-red-200';

        tr.innerHTML = `
            <td class="p-3.5 pl-5 font-mono text-gray-500">${req.reqId}</td>
            <td class="p-3.5 font-semibold text-gray-900">${req.residentName}</td>
            <td class="p-3.5 text-gray-700">${req.docType}</td>
            <td class="p-3.5 text-gray-600 max-w-[150px] truncate">${req.purpose}</td>
            <td class="p-3.5 text-gray-500">${req.dateRequested}</td>
            <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge}">${req.status}</span>
            </td>
            <td class="p-3.5 pr-5 text-right">
                ${req.status === 'Pending' ? `
                    <button onclick="approveRequest('${req.reqId}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium mr-1">Approve</button>
                    <button onclick="rejectRequest('${req.reqId}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-medium">Reject</button>
                ` : `<span class="text-xs text-gray-400 italic">Completed</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openNewRequestModal() {
    const select = document.getElementById('reqResidentId');
    select.innerHTML = '';

    if (residents.length === 0) {
        alert("Please add at least one resident record first.");
        return;
    }

    residents.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.innerText = `${r.firstName} ${r.lastName} (${r.id})`;
        select.appendChild(opt);
    });

    document.getElementById('requestForm').reset();
    openModal('requestModal');
}

function handleRequestSubmit(e) {
    e.preventDefault();
    const resId = document.getElementById('reqResidentId').value;
    const resident = residents.find(r => r.id === resId);

    const newReq = {
        reqId: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        residentId: resId,
        residentName: resident ? `${resident.firstName} ${resident.lastName}` : 'Unknown',
        docType: document.getElementById('reqDocType').value,
        purpose: document.getElementById('reqPurpose').value.trim(),
        dateRequested: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };

    requests.unshift(newReq);
    saveToLocalStorage();
    renderRequestsTable();
    closeModal('requestModal');
    showToast("Document request added");
}

function approveRequest(reqId) {
    const r = requests.find(req => req.reqId === reqId);
    if (r) {
        r.status = 'Approved';
        saveToLocalStorage();
        renderRequestsTable();
        showToast("Request approved");
    }
}

function rejectRequest(reqId) {
    const r = requests.find(req => req.reqId === reqId);
    if (r) {
        r.status = 'Rejected';
        saveToLocalStorage();
        renderRequestsTable();
        showToast("Request rejected");
    }
}

// 5. JSON IMPORT / EXPORT
function exportDatabaseJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(residents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `barangay_kalawaan_residents_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Database exported to JSON file");
}

function importDatabaseJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (Array.isArray(parsed)) {
                residents = parsed;
                saveToLocalStorage();
                renderAllViews();
                showToast("JSON Database successfully imported!");
            } else {
                alert("Invalid JSON format. Expected an array of resident objects.");
            }
        } catch (err) {
            alert("Failed to parse JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
}

// HELPER UTILITIES & UI CONTROLS
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function logoutAction() {
    showToast("Logged out from Barangay Admin session");
}