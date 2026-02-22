// قواعد البيانات المحلية (للحفظ حتى بعد إغلاق التطبيق)
let papers = JSON.parse(localStorage.getItem('papers')) || [];
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let currentCustomerIndex = -1;

// تشغيل الوظائف عند فتح التطبيق
window.onload = function() {
    fetchExchangeRate();
    renderPapers();
    renderCustomers();
};

// دالة لإغلاق رسالة الترحيب
function closeWelcome() {
    document.getElementById('welcome-modal').classList.remove('active');
}

// دالة لتبديل التبويبات
function openTab(tabId) {
    let contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    let buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// دالة لإغلاق شريط سعر الصرف
function closeRateBar() {
    document.getElementById('exchange-rate-bar').style.display = 'none';
}

// جلب سعر الدولار
function fetchExchangeRate() {
    let rateElement = document.getElementById('rate-text');
    setTimeout(() => {
        let fakeMarketRate = "152,500"; 
        rateElement.innerHTML = `سعر الدولار اليوم: 100$ = ${fakeMarketRate} دينار عراقي`;
    }, 1500);
}

// --- قسم الورق ---
function addPaper() {
    let buyPrice = document.getElementById('buy-price').value;
    let sellPrice = document.getElementById('sell-price').value;

    if(buyPrice === '' || sellPrice === '') {
        alert("يرجى إدخال سعر الشراء وسعر البيع");
        return;
    }

    papers.push({ buyPrice: buyPrice, sellPrice: sellPrice, date: new Date().toLocaleDateString() });
    localStorage.setItem('papers', JSON.stringify(papers));
    
    document.getElementById('buy-price').value = '';
    document.getElementById('sell-price').value = '';
    
    renderPapers();
}

function renderPapers() {
    let list = document.getElementById('paper-list');
    list.innerHTML = '';
    papers.forEach((paper, index) => {
        list.innerHTML += `
            <div class="paper-item neumorphic">
                <div>
                    <strong>شراء:</strong> ${paper.buyPrice} | <strong>بيع:</strong> ${paper.sellPrice} <br>
                    <small>${paper.date}</small>
                </div>
                <div class="actions">
                    <button class="btn neumorphic-btn" style="font-size: 12px;" onclick="editPaper(${index})">تعديل</button>
                    <button class="btn neumorphic-btn" style="color: red; font-size: 12px;" onclick="deletePaper(${index})">حذف</button>
                </div>
            </div>
        `;
    });
}

function deletePaper(index) {
    if(confirm('هل أنت متأكد من حذف هذا السعر؟')) {
        papers.splice(index, 1);
        localStorage.setItem('papers', JSON.stringify(papers));
        renderPapers();
    }
}

function editPaper(index) {
    let newBuy = prompt('سعر الشراء الجديد:', papers[index].buyPrice);
    let newSell = prompt('سعر البيع الجديد:', papers[index].sellPrice);
    if(newBuy !== null && newSell !== null) {
        papers[index].buyPrice = newBuy;
        papers[index].sellPrice = newSell;
        localStorage.setItem('papers', JSON.stringify(papers));
        renderPapers();
    }
}

// --- قسم الزبائن ---
function toggleAddCustomer() {
    let form = document.getElementById('add-customer-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addCustomer() {
    let name = document.getElementById('cust-name').value;
    let phone = document.getElementById('cust-phone').value;
    let guarName = document.getElementById('guar-name').value;
    let guarPhone = document.getElementById('guar-phone').value;

    if(name === '' || phone === '') {
        alert("يرجى إدخال اسم ورقم الزبون على الأقل.");
        return;
    }

    let newCustomer = {
        name: name,
        phone: phone,
        guarName: guarName,
        guarPhone: guarPhone,
        balance: 0,
        operations: []
    };

    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));

    document.getElementById('cust-name').value = '';
    document.getElementById('cust-phone').value = '';
    document.getElementById('guar-name').value = '';
    document.getElementById('guar-phone').value = '';
    toggleAddCustomer();

    renderCustomers();
}

function renderCustomers() {
    let list = document.getElementById('customers-list-container');
    list.innerHTML = '';
    customers.forEach((cust, index) => {
        list.innerHTML += `
            <div class="customer-item neumorphic">
                <div onclick="openCustomerDetails(${index})" style="flex-grow: 1;">
                    <h4>${cust.name}</h4>
                    <small style="color: ${cust.balance > 0 ? 'red' : 'green'};">الباقي: ${cust.balance} دينار</small>
                </div>
                <div class="actions">
                    <button class="btn neumorphic-btn" style="font-size: 12px;" onclick="editCustomer(${index})">تعديل</button>
                    <button class="btn neumorphic-btn" style="color: red; font-size: 12px;" onclick="deleteCustomer(${index})">حذف</button>
                </div>
            </div>
        `;
    });
}

function deleteCustomer(index) {
    if(confirm('هل أنت متأكد من حذف الزبون وكل بياناته؟')) {
        customers.splice(index, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
    }
}

function editCustomer(index) {
    let newName = prompt('اسم الزبون:', customers[index].name);
    let newPhone = prompt('رقم الهاتف:', customers[index].phone);
    if(newName !== null && newPhone !== null) {
        customers[index].name = newName;
        customers[index].phone = newPhone;
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
    }
}

// --- قسم تفاصيل وعمليات الزبون ---
function openCustomerDetails(index) {
    currentCustomerIndex = index;
    let cust = customers[index];
    
    document.getElementById('modal-customer-name').innerText = cust.name;
    document.getElementById('modal-customer-balance').innerText = `الباقي علي: ${cust.balance} دينار`;
    
    renderTransactions();
    document.getElementById('customer-details-modal').classList.add('active');
}

function closeCustomerDetails() {
    document.getElementById('customer-details-modal').classList.remove('active');
    currentCustomerIndex = -1;
    renderCustomers(); // لتحديث الرصيد في القائمة الرئيسية
}

function addCustomerOperation(type) {
    if(currentCustomerIndex === -1) return;
    
    let cust = customers[currentCustomerIndex];
    let date = new Date().toLocaleDateString();
    let op = {};

    if(type === 'سلفة') {
        let paperCount = document.getElementById('paper-count-input').value;
        let amount = parseInt(document.getElementById('total-amount-input').value);
        
        if(!paperCount || isNaN(amount)) { alert("يرجى ملء الحقول بشكل صحيح"); return; }
        
        op = { type: 'سلفة', details: `ورق: ${paperCount}`, amount: amount, date: date };
        cust.balance += amount; // زيادة الديون
        
        document.getElementById('paper-count-input').value = '';
        document.getElementById('total-amount-input').value = '';
    } 
    else if(type === 'تسديد') {
        let amount = parseInt(document.getElementById('payment-amount-input').value);
        
        if(isNaN(amount)) { alert("يرجى كتابة مبلغ التسديد"); return; }
        
        op = { type: 'تسديد', details: 'دفعة نقدية', amount: amount, date: date };
        cust.balance -= amount; // تنقيص الديون
        
        document.getElementById('payment-amount-input').value = '';
    }

    cust.operations.push(op);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    document.getElementById('modal-customer-balance').innerText = `الباقي علي: ${cust.balance} دينار`;
    renderTransactions();
}

function renderTransactions() {
    if(currentCustomerIndex === -1) return;
    let cust = customers[currentCustomerIndex];
    let list = document.getElementById('transactions-list');
    list.innerHTML = '';
    
    // عرض العمليات من الأحدث للأقدم
    let ops = [...cust.operations].reverse();
    ops.forEach(op => {
        let color = op.type === 'تسديد' ? 'green' : 'red';
        list.innerHTML += `
            <div class="transaction-item">
                <strong style="color: ${color};">${op.type}</strong>: ${op.amount} دينار <br>
                <small>${op.details} | التاريخ: ${op.date}</small>
            </div>
        `;
    });
}

function shareWhatsApp() {
    if(currentCustomerIndex === -1) return;
    let cust = customers[currentCustomerIndex];
    
    if(!cust.phone) {
        alert("لا يوجد رقم هاتف مسجل لهذا الزبون.");
        return;
    }

    // جلب آخر تسديد إذا وجد
    let lastPayment = cust.operations.slice().reverse().find(op => op.type === 'تسديد');
    let lastPaymentText = lastPayment ? `${lastPayment.amount} دينار (بتاريخ ${lastPayment.date})` : 'لا يوجد تسديدات بعد';

    let message = `مرحباً ${cust.name}،\n\n`;
    message += `*كشف حساب من منفذ نوكه*\n`;
    message += `------------------------\n`;
    message += `الباقي الكلي عليك: *${cust.balance} دينار*\n`;
    message += `آخر تسديد: ${lastPaymentText}\n\n`;
    message += `*تفاصيل جميع العمليات:*\n`;
    
    cust.operations.forEach(op => {
        message += `- ${op.date} | ${op.type} | ${op.amount} دينار | (${op.details})\n`;
    });

    message += `\nنتمنى لك يوماً سعيداً!`;

    // تحويل النص ليكون مناسباً للرابط
    let encodedMessage = encodeURIComponent(message);
    
    // إزالة الصفر الأول من رقم الهاتف وإضافة رمز العراق إذا لم يكن موجوداً
    let phoneNum = cust.phone.startsWith('0') ? '964' + cust.phone.substring(1) : cust.phone;
    
    let whatsappUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}
