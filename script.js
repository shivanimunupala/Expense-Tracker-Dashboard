// =========================
// Expense Tracker Dashboard
// =========================

const form = document.getElementById("transactionForm");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const savingsEl = document.getElementById("savings");
const transactionList = document.getElementById("transactionList");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// =========================
// Chart
// =========================

const ctx = document.getElementById("expenseChart");

const expenseChart = new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: ["Income", "Expense", "Savings"],

        datasets: [{

            data: [0, 0, 0],

            backgroundColor: [

                "#22c55e",

                "#ef4444",

                "#38bdf8"

            ],

            borderWidth: 0

        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {

                    color: "white"

                }

            }

        }

    }

});

// =========================
// Add Transaction
// =========================

form.addEventListener("submit", function(e){

    e.preventDefault();

    const description = document.getElementById("description").value;

    const amount = Number(document.getElementById("amount").value);

    const date = document.getElementById("date").value;

    const category = document.getElementById("category").value;

    const type = document.getElementById("type").value;

    if(description==="" || amount<=0){

        alert("Please enter valid details");

        return;

    }

    transactions.push({

    description,

    amount,

    category,

    type,

    date

});

    saveTransactions();

    updateDashboard();

    form.reset();

});

function saveTransactions(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// =========================
// Update Dashboard
// =========================

function updateDashboard(){

    let income = 0;
    let expense = 0;

    transactionList.innerHTML = "";

    transactions.forEach((transaction,index)=>{

        if(transaction.type==="Income"){

            income += transaction.amount;

        }else{

            expense += transaction.amount;

        }

        transactionList.innerHTML += `

        <tr>

            <td>${new Date(transaction.date).toLocaleDateString("en-GB")}</td>

<td>${transaction.description}</td>

            <td>${transaction.category}</td>

            <td>${transaction.type}</td>

            <td>₹${transaction.amount}</td>

            <td>

                <button class="delete-btn" onclick="deleteTransaction(${index})">

                    🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

    const balance = income-expense;

    const savings = income===0 ? 0 : ((balance/income)*100).toFixed(1);

    balanceEl.textContent=`₹${balance}`;
    incomeEl.textContent=`₹${income}`;
    expenseEl.textContent=`₹${expense}`;
    savingsEl.textContent=`${savings}%`;

    expenseChart.data.datasets[0].data=[
        income,
        expense,
        balance>0 ? balance : 0
    ];

    expenseChart.update();

}
function deleteTransaction(index){

    transactions.splice(index,1);

    saveTransactions();

    updateDashboard();

}
updateDashboard();