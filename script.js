// دالة لإغلاق رسالة الترحيب بأبو روان
function closeWelcome() {
    document.getElementById('welcome-modal').classList.remove('active');
}

// دالة لتبديل التبويبات (الورق، الزبائن، الخ)
function openTab(tabId) {
    // 1. إخفاء جميع التبويبات
    let contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. إزالة التفعيل عن جميع الأزرار
    let buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. إظهار التبويبة المطلوبة وتفعيل زرها
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// دالة لإغلاق شريط سعر الصرف
function closeRateBar() {
    document.getElementById('exchange-rate-bar').style.display = 'none';
}

// دالة لإظهار/إخفاء حقول إضافة زبون جديد
function toggleAddCustomer() {
    let form = document.getElementById('add-customer-form');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

// دالة وهمية عند الضغط على اسم الزبون
function openCustomerDetails(customerName) {
    alert("سيتم هنا فتح تفاصيل الزبون: " + customerName + "\n(معاملات التسديد، الباقي، السلف.. الخ في الخطوة القادمة)");
}

// جلب سعر الدولار مقابل الدينار العراقي
// ملاحظة: قمنا بمحاكاة السعر لأن الواجهات البرمجية (APIs) المجانية لا تعطي سعر السوق الموازي بدقة.
function fetchExchangeRate() {
    let rateElement = document.getElementById('rate-text');
    
    // محاكاة جلب البيانات
    setTimeout(() => {
        let fakeMarketRate = "152,500"; // يمكنك تغيير هذا لاحقاً ليكون ديناميكياً
        rateElement.innerHTML = `سعر الدولار اليوم: 100$ = ${fakeMarketRate} دينار عراقي`;
    }, 1500);
}

// تشغيل جلب السعر عند فتح التطبيق
window.onload = function() {
    fetchExchangeRate();
};
