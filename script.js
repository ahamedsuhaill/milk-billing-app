// State management
let currentBillItems = [];
let generatedBills = [];
let dailyStats = {
    totalBills: 0,
    totalRevenue: 0
};

// Reporting state
let currentReport = { type: null, rows: [], columns: [] };

// Static UPI ID (can be changed)
const UPI_ID = 'yourstore@upi';

// Product database with images and default prices
const PRODUCTS = {
    milk: [
        { name: 'Full Cream Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop', price: 60 },
        { name: 'Toned Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop', price: 55 },
        { name: 'Skimmed Milk', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop', price: 50 },
        { name: 'Buffalo Milk', image: 'https://images.unsplash.com/photo-1618164436249-4473940d1f5c?w=400&auto=format&fit=crop', price: 70 },
        { name: 'Organic Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop', price: 80 },
        { name: 'Flavored Milk (Strawberry)', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop', price: 65 },
        { name: 'Flavored Milk (Chocolate)', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop', price: 65 },
        { name: 'Almond Milk', image: 'https://images.unsplash.com/photo-1618164436249-4473940d1f5c?w=400&auto=format&fit=crop', price: 90 }
    ],
    iceCream: [
        { name: 'Vanilla Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 80 },
        { name: 'Chocolate Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 90 },
        { name: 'Strawberry Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 85 },
        { name: 'Butterscotch Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 95 },
        { name: 'Pista Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 100 },
        { name: 'Kesar Pista Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 110 },
        { name: 'Choco Chip Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 105 },
        { name: 'Black Currant Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 95 },
        { name: 'Mango Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 85 },
        { name: 'Tutti Frutti Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 90 },
        { name: 'Caramel Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 95 },
        { name: 'Cookies & Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop', price: 110 }
    ],
    riceIceCream: [
        { name: 'Kulfi (Plain)', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 60 },
        { name: 'Kulfi (Pista)', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 70 },
        { name: 'Kulfi (Mango)', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 65 },
        { name: 'Rice Pudding Ice Cream', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 75 },
        { name: 'Falooda Ice Cream', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 80 },
        { name: 'Kesar Kulfi', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop', price: 75 }
    ]
};

// Initialize products on page load
function initializeProducts() {
    // Populate select dropdown
    const selectElement = document.getElementById('productName');
    Object.values(PRODUCTS).flat().forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        selectElement.appendChild(option);
    });

    // Render product cards
    renderProductCards('milkProducts', PRODUCTS.milk);
    renderProductCards('iceCreamProducts', PRODUCTS.iceCream);
    renderProductCards('riceIceCreamProducts', PRODUCTS.riceIceCream);
}

// Render product cards
function renderProductCards(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => quickAddProduct(product.name, product.price);
        card.innerHTML = `
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-info">
                <h4>${product.name}</h4>
                <p class="product-price">₹${product.price}/unit</p>
                <button class="quick-add-btn" onclick="event.stopPropagation(); quickAddProduct('${product.name}', ${product.price})">
                    Quick Add
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Quick add product with default price
function quickAddProduct(productName, defaultPrice, quantity = 1) {
    // Check if user wants to customize quantity
    const customQuantity = prompt(`Add "${productName}" to bill.\nEnter quantity (default: ${quantity}):`, quantity);
    
    if (customQuantity === null) return; // User cancelled
    
    const qty = parseFloat(customQuantity) || quantity;
    
    if (qty <= 0) {
        alert('Quantity must be greater than 0');
        return;
    }

    // Check if user wants to change price
    const customPrice = prompt(`Enter price for "${productName}" (default: ₹${defaultPrice}):`, defaultPrice);
    
    if (customPrice === null) return; // User cancelled
    
    const price = parseFloat(customPrice) || defaultPrice;
    
    if (price < 0) {
        alert('Price cannot be negative');
        return;
    }

    // Add item to current bill
    const item = {
        id: Date.now(),
        name: productName,
        quantity: qty,
        price: price,
        total: qty * price
    };

    currentBillItems.push(item);

    // Update UI
    renderBillItems();
    updateBillTotal();
    updateGenerateButton();
    
    showToast(`${qty}x ${productName} added to bill!`);
}

// Load data from localStorage on page load
function loadData() {
    const savedBills = localStorage.getItem('generatedBills');
    const savedStats = localStorage.getItem('dailyStats');
    const savedUPI = localStorage.getItem('upiId');
    
    if (savedBills) {
        generatedBills = JSON.parse(savedBills);
        // Add timestamp to existing bills if missing for reliable reporting
        let mutated = false;
        generatedBills.forEach(bill => {
            if (!bill.timestamp) {
                const parsed = Date.parse(bill.date);
                bill.timestamp = Number.isNaN(parsed) ? Date.now() : parsed;
                mutated = true;
            }
        });
        if (mutated) {
            saveData();
        }
        renderBillsHistory();
    }
    
    if (savedStats) {
        dailyStats = JSON.parse(savedStats);
        updateDailySummary();
    }
    
    if (savedUPI) {
        document.getElementById('upiId').textContent = savedUPI;
    } else {
        document.getElementById('upiId').textContent = UPI_ID;
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('generatedBills', JSON.stringify(generatedBills));
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Add product to current bill
function addProduct() {
    const productName = document.getElementById('productName').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    // Validation
    if (!productName || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    if (quantity <= 0 || price < 0) {
        alert('Quantity and price must be positive numbers');
        return;
    }

    // Add item to current bill
    const item = {
        id: Date.now(),
        name: productName,
        quantity: quantity,
        price: price,
        total: quantity * price
    };

    currentBillItems.push(item);
    
    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';

    // Focus back on product name
    document.getElementById('productName').focus();

    // Update UI
    renderBillItems();
    updateBillTotal();
    updateGenerateButton();
}

// Render bill items
function renderBillItems() {
    const billItemsContainer = document.getElementById('billItems');
    
    if (currentBillItems.length === 0) {
        billItemsContainer.innerHTML = '<p class="empty-state">No items added yet. Add products to generate bill.</p>';
        return;
    }

    let html = `
        <div class="bill-item bill-item-header">
            <div class="item-name">Product</div>
            <div class="item-quantity">Quantity</div>
            <div class="item-price">Price</div>
            <div class="item-total">Total</div>
            <div></div>
        </div>
    `;

    currentBillItems.forEach(item => {
        html += `
            <div class="bill-item">
                <div>
                    <span class="mobile-label">Product:</span>
                    <span class="item-name">${item.name}</span>
                </div>
                <div>
                    <span class="mobile-label">Quantity:</span>
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <div>
                    <span class="mobile-label">Price:</span>
                    <span class="item-price">₹${item.price.toFixed(2)}</span>
                </div>
                <div>
                    <span class="mobile-label">Total:</span>
                    <span class="item-total">₹${item.total.toFixed(2)}</span>
                </div>
                <button class="delete-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    });

    billItemsContainer.innerHTML = html;
}

// Remove item from current bill
function removeItem(itemId) {
    currentBillItems = currentBillItems.filter(item => item.id !== itemId);
    renderBillItems();
    updateBillTotal();
    updateGenerateButton();
}

// Update bill total
function updateBillTotal() {
    const total = currentBillItems.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('billTotal').textContent = `₹${total.toFixed(2)}`;
}

// Update generate button state
function updateGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = currentBillItems.length === 0;
}

// Clear current bill
function clearBill() {
    if (confirm('Are you sure you want to clear the current bill?')) {
        currentBillItems = [];
        renderBillItems();
        updateBillTotal();
        updateGenerateButton();
    }
}

// Generate bill
function generateBill() {
    if (currentBillItems.length === 0) {
        alert('Please add items to the bill first');
        return;
    }

    const total = currentBillItems.reduce((sum, item) => sum + item.total, 0);
    const bill = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        items: [...currentBillItems],
        total: total
    };

    // Add to generated bills
    generatedBills.unshift(bill); // Add to beginning for newest first

    // Update daily stats
    dailyStats.totalBills++;
    dailyStats.totalRevenue += total;

    // Save data
    saveData();

    // Update UI
    renderBillsHistory();
    updateDailySummary();

    // Clear current bill
    currentBillItems = [];
    renderBillItems();
    updateBillTotal();
    updateGenerateButton();

    // Show success message
    showToast('Bill generated successfully!');
}

// Render bills history
function renderBillsHistory() {
    const billsHistoryContainer = document.getElementById('billsHistory');
    
    if (generatedBills.length === 0) {
        billsHistoryContainer.innerHTML = '<p class="empty-state">No bills generated yet.</p>';
        return;
    }

    let html = '';
    generatedBills.forEach(bill => {
        html += `
            <div class="bill-card">
                <div class="bill-card-header">
                    <div>
                        <span class="bill-number">Bill #${bill.id}</span>
                    </div>
                    <div class="bill-date">${bill.date}</div>
                </div>
                <div class="bill-card-items">
                    <div class="bill-card-item bill-card-header-row" style="font-weight: 600; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
                        <div>Product</div>
                        <div class="header-center">Qty</div>
                        <div class="header-center">Price</div>
                        <div class="header-center">Total</div>
                    </div>
        `;
        
        bill.items.forEach(item => {
            html += `
                <div class="bill-card-item">
                    <div>
                        <span class="mobile-label">Product:</span>
                        <span>${item.name}</span>
                    </div>
                    <div>
                        <span class="mobile-label">Qty:</span>
                        <span>${item.quantity}</span>
                    </div>
                    <div>
                        <span class="mobile-label">Price:</span>
                        <span>₹${item.price.toFixed(2)}</span>
                    </div>
                    <div>
                        <span class="mobile-label">Total:</span>
                        <span>₹${item.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="bill-card-total">
                    Total: ₹${bill.total.toFixed(2)}
                </div>
            </div>
        `;
    });

    billsHistoryContainer.innerHTML = html;
}

// Update daily summary
function updateDailySummary() {
    document.getElementById('totalBills').textContent = dailyStats.totalBills;
    document.getElementById('totalRevenue').textContent = `₹${dailyStats.totalRevenue.toFixed(2)}`;
}

// =========================
// Reports
// =========================
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function initializeReports() {
    populateReportSelectors();

    const typeEl = document.getElementById('reportType');
    const yearGroup = document.getElementById('reportYearGroup');
    const monthGroup = document.getElementById('reportMonthGroup');
    const yearEl = document.getElementById('reportYear');
    const monthEl = document.getElementById('reportMonth');

    typeEl.addEventListener('change', () => {
        const isMonth = typeEl.value === 'month';
        yearGroup.style.display = 'block';
        monthGroup.style.display = isMonth ? 'block' : 'none';
    });

    document.getElementById('generateReportBtn').addEventListener('click', () => {
        generateReport();
    });

    document.getElementById('downloadExcelBtn').addEventListener('click', () => {
        downloadExcel();
    });

    // Default view: current year month-wise
    if (yearEl.options.length > 0) {
        const currentYear = new Date().getFullYear().toString();
        if ([...yearEl.options].some(o => o.value === currentYear)) {
            yearEl.value = currentYear;
        }
    }
    populateMonths(monthEl);
}

function populateReportSelectors() {
    const years = getAvailableYears();
    const yearEl = document.getElementById('reportYear');
    yearEl.innerHTML = '';
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y.toString();
        opt.textContent = y.toString();
        yearEl.appendChild(opt);
    });
    const monthEl = document.getElementById('reportMonth');
    populateMonths(monthEl);
}

function populateMonths(selectEl) {
    selectEl.innerHTML = '';
    MONTHS.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = (idx + 1).toString();
        opt.textContent = m;
        selectEl.appendChild(opt);
    });
}

function getAvailableYears() {
    const years = new Set();
    generatedBills.forEach(b => {
        const d = getBillDate(b);
        if (d) years.add(d.getFullYear());
    });
    const arr = Array.from(years).sort();
    if (arr.length === 0) {
        arr.push(new Date().getFullYear());
    }
    return arr;
}

function getBillDate(bill) {
    if (bill.timestamp) return new Date(bill.timestamp);
    const parsed = Date.parse(bill.date);
    return Number.isNaN(parsed) ? null : new Date(parsed);
}

function generateReport() {
    const type = document.getElementById('reportType').value;
    const yearVal = document.getElementById('reportYear').value;
    const monthVal = document.getElementById('reportMonth').value;

    if (type === 'year') {
        const rows = buildYearlyReport();
        currentReport = { type: 'year', rows, columns: ['Year','Total Bills','Total Revenue (₹)'] };
        renderReportTable(rows, currentReport.columns);
    } else {
        const year = parseInt(yearVal, 10) || new Date().getFullYear();
        const rows = buildMonthlyReport(year);
        currentReport = { type: 'month', rows, columns: ['Month','Total Bills','Total Revenue (₹)'] };
        renderReportTable(rows, currentReport.columns);
    }
    document.getElementById('downloadExcelBtn').disabled = currentReport.rows.length === 0;
}

function buildYearlyReport() {
    const yearMap = new Map();
    generatedBills.forEach(b => {
        const d = getBillDate(b);
        if (!d) return;
        const y = d.getFullYear();
        if (!yearMap.has(y)) yearMap.set(y, { totalBills: 0, totalRevenue: 0 });
        const agg = yearMap.get(y);
        agg.totalBills += 1;
        agg.totalRevenue += b.total;
    });
    const rows = Array.from(yearMap.entries())
        .sort((a,b) => a[0]-b[0])
        .map(([year, agg]) => ({
            'Year': year,
            'Total Bills': agg.totalBills,
            'Total Revenue (₹)': Number(agg.totalRevenue.toFixed(2))
        }));
    return rows;
}

function buildMonthlyReport(year) {
    const months = Array.from({ length: 12 }, (_, i) => ({ totalBills: 0, totalRevenue: 0 }));
    generatedBills.forEach(b => {
        const d = getBillDate(b);
        if (!d) return;
        if (d.getFullYear() !== year) return;
        const m = d.getMonth(); // 0-11
        months[m].totalBills += 1;
        months[m].totalRevenue += b.total;
    });
    const rows = months.map((agg, idx) => ({
        'Month': `${MONTHS[idx]} ${year}`,
        'Total Bills': agg.totalBills,
        'Total Revenue (₹)': Number(agg.totalRevenue.toFixed(2))
    }));
    return rows;
}

function renderReportTable(rows, columns) {
    const container = document.getElementById('reportsTable');
    if (!rows || rows.length === 0) {
        container.innerHTML = '<p class="empty-state">No data available for the selected period.</p>';
        return;
    }
    let html = '<table class="report-table"><thead><tr>';
    columns.forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr></thead><tbody>';
    rows.forEach(r => {
        html += '<tr>';
        columns.forEach(col => { html += `<td>${r[col]}</td>`; });
        html += '</tr>';
    });
    html += '</tbody>';
    const totals = rows.reduce((acc, r) => {
        acc.bills += (r['Total Bills'] || 0);
        acc.revenue += (r['Total Revenue (₹)'] || 0);
        return acc;
    }, { bills: 0, revenue: 0 });
    html += `<tfoot><tr><td><strong>Total</strong></td><td>${totals.bills}</td><td>₹${totals.revenue.toFixed(2)}</td></tr></tfoot>`;
    html += '</table>';
    container.innerHTML = html;
}

function downloadExcel() {
    if (!currentReport || !currentReport.rows || currentReport.rows.length === 0) return;
    try {
        const ws = XLSX.utils.json_to_sheet(currentReport.rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, currentReport.type === 'year' ? 'Yearly' : 'Monthly');
        const fname = currentReport.type === 'year'
            ? `report_years_${new Date().toISOString().slice(0,10)}.xlsx`
            : `report_months_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fname);
    } catch (e) {
        alert('Excel export failed. Please try again.');
        // eslint-disable-next-line no-console
        console.error(e);
    }
}

// =========================
// Theme
// =========================
function initializeTheme() {
    const mode = localStorage.getItem('themeMode') || 'default';
    if (mode === 'calm') document.body.classList.add('calm');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.textContent = document.body.classList.contains('calm') ? 'Default Theme' : 'Calm Theme';
        btn.addEventListener('click', () => {
            document.body.classList.toggle('calm');
            const isCalm = document.body.classList.contains('calm');
            localStorage.setItem('themeMode', isCalm ? 'calm' : 'default');
            btn.textContent = isCalm ? 'Default Theme' : 'Calm Theme';
        });
    }
}

// Copy UPI ID to clipboard
function copyUPI() {
    const upiId = document.getElementById('upiId').textContent;
    
    // Create temporary textarea element
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = upiId;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showToast('UPI ID copied to clipboard!');
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(upiId).then(() => {
            showToast('UPI ID copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy UPI ID. Please copy manually: ' + upiId);
        });
    }
    
    document.body.removeChild(tempTextarea);
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Allow Enter key to add product
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeProducts();
    initializeReports();
    initializeTheme();
    
    // Enter key support for form fields
    document.getElementById('quantity').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('price').focus();
        }
    });
    
    document.getElementById('price').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addProduct();
        }
    });
    
    // Update price when product is selected
    document.getElementById('productName').addEventListener('change', function() {
        const selectedProduct = Object.values(PRODUCTS).flat().find(p => p.name === this.value);
        if (selectedProduct) {
            document.getElementById('price').value = selectedProduct.price;
        }
    });
});
