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

// Function to update data expense summary 
function updateSummary() {
    let totalIncome = tableEntries.reduce((t, e) => {
        if (e.type === 1) t += e.amount;
        return t;
    }, 0);
    let totalExpense = tableEntries.reduce((ex, e) => {
        if (e.type === 0) ex += e.amount;
        return ex;
    }, 0);
    document.getElementById('updatedInc').innerText = totalIncome;
    document.getElementById('updatedExp').innerText = totalExpense;
    document.getElementById('updatedBal').innerText = totalIncome - totalExpense;
    let balance  = totalIncome - totalExpense;
    if(balance<=1000){
        alert("WARNING:Your balance dropped below 1000");
    }
}

// Function to add new entry to the dataset and expense table  
async function addItem() {
    let type = document.getElementById('itemType').value;
    let name = document.getElementById("name");
    let amount = document.getElementById("amount");

    // Input validation 
    if (name.value === "" || Number(amount.value) === 0)
        return alert("Incorrect Input");
    if (Number(amount.value) <= 0)
        return alert(
            "Incorrect amount! can't add negative"
        );

    const newEntry = {
        user_id: 1, 
        type: type === '1' ? 'income' : 'expense',
        name: name.value,
        amount: Number(amount.value)
    };

    try {
        const response = await fetch('http://localhost:8000/api/addexpense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEntry)
        });

        const result = await response.json();

        if (response.ok) {
            fetchData();
            newEntry.id = result.id; // Get the ID from the response
            tableEntries.push(newEntry);
            updateTable();
            name.value = "";
            amount.value = 0;
        } else {
            console.error('Error adding expense:', result.error);
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

// Function to load all entry in the expense table 
function loadItems(e) {
    let cls;

    let table = document.getElementById("table");
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = e.name;
    cell2.innerHTML = e.amount;
    cell3.innerHTML = e.type === 0 ? "Expense" : "Income";
    cell3.style.color = e.type === 0 ? "red" : "green";
    cell4.innerHTML = "☒";
    cell4.classList.add("zoom");
    cell4.addEventListener("click", () => del(e));
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
    tableEntries.slice(-3).map((e, i) => {
        loadItems(e, i);
    });
    updateSummary();
}

// Redirect to the all-transactions page
function viewAll() {
    window.location.href = 'all-transactions.html';
}

// Fetch data when the page loads
window.onload = fetchData;