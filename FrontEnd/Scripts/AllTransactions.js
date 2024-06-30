let tableEntries = [];

// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8000/api/getexpense');
        const data = await response.json();

        if (response.ok) {
            tableEntries = data.result.map(entry => ({
                id: entry.id,
                type: entry.type === 'income' ? 1 : 0, 
                name: entry.name,
                amount: entry.amount
            }));
            updateTable();
        } else {
            console.error('Error fetching data:', data.error);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to load all entries in the expense table 
function loadItems(e, i) {
    let cls;

    let table = document.getElementById("table");
    let row = table.insertRow(i + 1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let c3 = row.insertCell(3);
    let c4 = row.insertCell(4);
    cell0.innerHTML = i + 1;
    cell1.innerHTML = e.name;
    cell2.innerHTML = e.amount;
    c4.innerHTML = "☒";
    c4.classList.add("zoom");
    c4.addEventListener("click", () => del(e));
    if (e.type == 0) {
        cls = "red";
        c3.innerHTML = "Expense";
    } else {
        cls = "green";
        c3.innerHTML = "Income";
    }
    c3.style.color = cls;
}

// Clear the table before updation
function remove() {
    while (table.rows.length > 1) table.deleteRow(-1);
}

// Delete an entry
async function del(el) {
    try {
        const response = await fetch(`http://localhost:8000/api/deleteexpense/${el.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tableEntries = tableEntries.filter(e => e.id !== el.id);
            updateTable();
        } else {
            const result = await response.json();
            console.error('Error deleting expense:', result.error);
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// To render all entries 
function updateTable() {
    remove();
    tableEntries.forEach((e, i) => {
        loadItems(e, i);
    });
}

// Function to generate PDF and download it
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('All Transactions', 10, 10);
    const headers = [["S.no.", "Name", "Amount", "Type"]];
    const data = tableEntries.map((e, i) => [
        i + 1,
        e.name,
        e.amount,
        e.type === 1 ? 'Income' : 'Expense'
    ]);

    doc.autoTable({
        head: headers,
        body: data,
    });

    doc.save('expenses.pdf');
}

// Fetch data when the page loads
window.onload = fetchData;
