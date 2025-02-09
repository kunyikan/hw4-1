// ฟังก์ชันเพื่อดึงข้อมูลค่าใช้จ่ายจาก localStorage
function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

// ฟังก์ชันเพื่อบันทึกค่าใช้จ่ายลง localStorage
function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// ฟังก์ชันเพื่อเพิ่มค่าใช้จ่าย
function addExpense(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!title || !amount || !date) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    const newExpense = { id: Date.now(), title, amount, category, date };
    const expenses = getExpenses();
    expenses.push(newExpense);
    saveExpenses(expenses);
    renderExpenses();
    renderSummary();
    document.getElementById('expenseForm').reset();
}

// ฟังก์ชันเพื่อลบค่าใช้จ่าย
function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(expense => expense.id !== id); // ลบรายการที่มี ID ตรงกัน
    saveExpenses(expenses);
    renderExpenses(); // อัปเดตรายการใหม่
    renderSummary(); // อัปเดตสรุปใหม่
}

// ฟังก์ชันกรองข้อมูลตามประเภท
function filterByCategory(expenses, category) {
    if (!category) return expenses;
    return expenses.filter(expense => expense.category === category);
}

// ฟังก์ชันกรองข้อมูลตามช่วงเวลา
function filterByDateRange(expenses, startDate, endDate) {
    if (!startDate && !endDate) return expenses;
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || expenseDate >= start) && (!end || expenseDate <= end);
    });
}

// ฟังก์ชันการกรองข้อมูลทั้งหมดตามประเภทและช่วงเวลา
function filterExpenses() {
    const expenses = getExpenses();
    const category = document.getElementById('categoryFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // กรองข้อมูลตามประเภทและช่วงเวลา
    let filteredExpenses = filterByCategory(expenses, category);
    filteredExpenses = filterByDateRange(filteredExpenses, startDate, endDate);
    renderExpenses(filteredExpenses);
    renderSummary(filteredExpenses);
}

// ฟังก์ชันการแสดงผลค่าใช้จ่ายในหน้าเว็บ
function renderExpenses(expenses = getExpenses()) {
    const list = document.getElementById('expenseList');
    list.innerHTML = expenses.map(expense => 
        `<li class="expense-item flex justify-between items-center bg-gray-200 p-2 rounded">
            <span>${expense.date} - ${expense.title} (${expense.amount} บาท)</span>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">ลบ</button>
        </li>`
    ).join('');
}

// ฟังก์ชันคำนวณสรุปค่าใช้จ่ายรายวัน
function getDailySummary(expenses) {
    const dailySummary = {};

    expenses.forEach(expense => {
        const date = expense.date;
        if (!dailySummary[date]) {
            dailySummary[date] = 0;
        }
        dailySummary[date] += expense.amount;
    });

    return dailySummary;
}

// ฟังก์ชันคำนวณสรุปค่าใช้จ่ายรายเดือน
function getMonthlySummary(expenses) {
    const monthlySummary = {};

    expenses.forEach(expense => {
        const month = expense.date.substring(0, 7); // ใช้ปี-เดือน
        if (!monthlySummary[month]) {
            monthlySummary[month] = 0;
        }
        monthlySummary[month] += expense.amount;
    });

    return monthlySummary;
}

// ฟังก์ชันการแสดงสรุปค่าใช้จ่าย
function renderSummary(expenses = getExpenses()) {
    const dailySummary = getDailySummary(expenses);
    const monthlySummary = getMonthlySummary(expenses);

    // แสดงสรุปค่าใช้จ่ายรายวัน
    let dailySummaryHtml = "<h3>สรุปค่าใช้จ่ายรายวัน</h3><ul>";
    for (const date in dailySummary) {
        dailySummaryHtml += `<li>${date}: ${dailySummary[date]} บาท</li>`;
    }
    dailySummaryHtml += "</ul>";

    // แสดงสรุปค่าใช้จ่ายรายเดือน
    let monthlySummaryHtml = "<h3>สรุปค่าใช้จ่ายรายเดือน</h3><ul>";
    for (const month in monthlySummary) {
        monthlySummaryHtml += `<li>${month}: ${monthlySummary[month]} บาท</li>`;
    }
    monthlySummaryHtml += "</ul>";

    // แสดงผลในหน้าเว็บ
    document.getElementById('dailySummary').innerHTML = dailySummaryHtml;
    document.getElementById('monthlySummary').innerHTML = monthlySummaryHtml;
}

// ฟังก์ชันกรองค่าใช้จ่ายตามประเภท
function applyCategoryFilter() {
    filterExpenses();
}

// ฟังก์ชันกรองค่าใช้จ่ายตามช่วงเวลา
function applyDateFilter() {
    filterExpenses();
}

// เพิ่ม event listeners
document.getElementById('expenseForm').addEventListener('submit', addExpense);
document.getElementById('categoryFilter').addEventListener('change', applyCategoryFilter);
document.getElementById('filterDateBtn').addEventListener('click', applyDateFilter);

// แสดงผลค่าใช้จ่ายและสรุป
renderExpenses();
renderSummary();
