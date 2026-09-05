// ============================================================
// 1. ĐỊNH NGHĨA BIẾN TOÀN CỤC
// ============================================================
let timeZones = []; // sẽ lưu toàn bộ dữ liệu từ JSON

// ============================================================
// 2. TẢI DỮ LIỆU TỪ JSON
// ============================================================
fetch('timezone.json')
    .then(response => {
        if (!response.ok) throw new Error('Không thể tải timezone.json');
        return response.json();
    })
    .then(data => {
        // Dữ liệu mới có cấu trúc: { "timezones": [ ... ] }
        if (data && Array.isArray(data.timezones)) {
            timeZones = data.timezones;
        } else if (Array.isArray(data)) {
            // fallback: nếu file là mảng trực tiếp (cấu trúc cũ)
            timeZones = data;
        } else {
            throw new Error('Dữ liệu JSON không đúng định dạng');
        }
        populateTimeZoneOptions();
        // Khởi tạo Select2 sau khi có dữ liệu
        initSelect2();
    })
    .catch(error => {
        console.error('Lỗi tải dữ liệu múi giờ:', error);
        alert('Không thể tải dữ liệu múi giờ. Vui lòng kiểm tra file timezone.json.');
    });

// ============================================================
// 3. HÀM ĐỔ DỮ LIỆU VÀO DROPDOWN
// ============================================================
function populateTimeZoneOptions() {
    const input1 = document.getElementById('input1');
    const input5 = document.getElementById('input5');

    input1.innerHTML = '';
    input5.innerHTML = '';

    // Sắp xếp theo city để dễ tìm
    const sorted = [...timeZones].sort((a, b) => {
        const cityA = (a.city || '').toLowerCase();
        const cityB = (b.city || '').toLowerCase();
        return cityA.localeCompare(cityB);
    });

    sorted.forEach(zone => {
        const iana = zone.iana || '';
        const city = zone.city || '';
        const country = zone.country || '';
        const offset = zone.offset || '';

        let displayText = city && country ? `${city}, ${country}` : (city || country || iana);
        if (offset) {
            const offsetDisplay = offset.startsWith('+') || offset.startsWith('-') ? offset : `+${offset}`;
            displayText += ` (GMT${offsetDisplay})`;
        }

        // Tạo option cho input1
        const opt1 = document.createElement('option');
        opt1.value = iana;
        opt1.textContent = displayText;
        opt1.dataset.offset = offset || '';
        opt1.dataset.city = city || '';
        opt1.dataset.country = country || '';
        input1.appendChild(opt1);

        // Tạo option cho input5
        const opt5 = document.createElement('option');
        opt5.value = iana;
        opt5.textContent = displayText;
        opt5.dataset.offset = offset || '';
        opt5.dataset.city = city || '';
        opt5.dataset.country = country || '';
        input5.appendChild(opt5);
    });
}

// ============================================================
// 4. KHỞI TẠO SELECT2
// ============================================================
function initSelect2() {
    // Huỷ select2 cũ nếu có
    if ($('#input1').data('select2')) {
        $('#input1').select2('destroy');
    }
    if ($('#input5').data('select2')) {
        $('#input5').select2('destroy');
    }

    const commonConfig = {
        placeholder: '🔍 Tìm thành phố hoặc quốc gia...',
        allowClear: false,
        width: '100%',
        language: {
            noResults: function() {
                return 'Không tìm thấy thành phố phù hợp';
            },
            searching: function() {
                return 'Đang tìm kiếm...';
            }
        },
        templateResult: function(state) {
            if (!state.id) return state.text;
            const el = $(state.element);
            const offset = el.data('offset') || '';
            let display = state.text;
            if (offset && !display.includes('GMT')) {
                const offsetDisplay = offset.startsWith('+') || offset.startsWith('-') ? offset : `+${offset}`;
                display += ` <span class="offset-badge">GMT${offsetDisplay}</span>`;
            }
            return $(`<span>${display}</span>`);
        },
        templateSelection: function(state) {
            if (!state.id) return state.text;
            const el = $(state.element);
            const offset = el.data('offset') || '';
            let display = state.text;
            if (offset && !display.includes('GMT')) {
                const offsetDisplay = offset.startsWith('+') || offset.startsWith('-') ? offset : `+${offset}`;
                display += ` <span class="offset-badge">GMT${offsetDisplay}</span>`;
            }
            return $(`<span>${display}</span>`);
        }
    };

    $('#input1').select2(commonConfig);
    $('#input5').select2(commonConfig);

    // Gắn sự kiện change để cập nhật description
    $('#input1').on('change', function() {
        updateDescriptionFromSelect2('input1', 'input2');
    });
    $('#input5').on('change', function() {
        updateDescriptionFromSelect2('input5', 'input6');
    });

    // Trigger change để hiển thị mô tả ban đầu
    if ($('#input1').val()) {
        $('#input1').trigger('change');
    }
    if ($('#input5').val()) {
        $('#input5').trigger('change');
    }
}

// ============================================================
// 5. CẬP NHẬT DESCRIPTION (input2 / input6) KHI CHỌN
// ============================================================
function updateDescriptionFromSelect2(selectId, descriptionId) {
    const selectEl = document.getElementById(selectId);
    const descEl = document.getElementById(descriptionId);
    const val = selectEl.value;

    if (!val) {
        descEl.value = '';
        return;
    }

    const zone = timeZones.find(z => z.iana === val);
    if (!zone) {
        descEl.value = '';
        return;
    }

    const offset = zone.offset || '';
    const city = zone.city || '';
    const country = zone.country || '';

    let display = '';
    if (offset) {
        const off = offset.startsWith('+') || offset.startsWith('-') ? offset : `+${offset}`;
        display = `GMT${off}`;
    }
    if (city || country) {
        const location = [city, country].filter(Boolean).join(', ');
        if (display) display += ` · ${location}`;
        else display = location;
    }
    descEl.value = display || val;
}

// ============================================================
// 6. HÀM CHUYỂN ĐỔI CHÍNH (gọi từ onclick)
// ============================================================
function convertTime() {
    const initialZone = document.getElementById('input1').value;
    const targetZone = document.getElementById('input5').value;
    const initialTime = document.getElementById('input3').value;
    const initialDate = document.getElementById('input4').value;

    if (!initialZone || !targetZone) {
        alert('Vui lòng chọn cả hai vị trí (thành phố).');
        return;
    }
    if (!initialTime) {
        alert('Vui lòng nhập giờ (hh:mm).');
        return;
    }
    if (!initialDate) {
        alert('Vui lòng chọn ngày.');
        return;
    }

    const fromZone = timeZones.find(z => z.iana === initialZone);
    const toZone = timeZones.find(z => z.iana === targetZone);

    if (!fromZone || !toZone) {
        alert('Không tìm thấy thông tin múi giờ cho vị trí đã chọn.');
        return;
    }

    try {
        const dateParts = initialDate.split('-');
        if (dateParts.length !== 3) {
            alert('Định dạng ngày không hợp lệ. Vui lòng sử dụng dd/mm/yyyy.');
            return;
        }
        const isoDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        const dateTimeStr = `${isoDate}T${initialTime}:00`;

        const initialLuxon = luxon.DateTime.fromISO(dateTimeStr, { zone: initialZone });
        if (!initialLuxon.isValid) {
            alert('Dữ liệu ngày/giờ không hợp lệ. Vui lòng kiểm tra lại.');
            return;
        }

        const targetLuxon = initialLuxon.setZone(targetZone);
        if (!targetLuxon.isValid) {
            alert('Không thể chuyển đổi sang múi giờ đích.');
            return;
        }

        const formatted = targetLuxon.toFormat('hh:mm a dd/MM/yyyy');
        document.getElementById('input7').value = formatted;

    } catch (e) {
        console.error('Lỗi chuyển đổi:', e);
        alert('Đã xảy ra lỗi khi chuyển đổi. Vui lòng kiểm tra dữ liệu nhập.');
    }
}

// ============================================================
// 7. SAO CHÉP KẾT QUẢ (gắn sự kiện click)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const input7 = document.getElementById('input7');
    if (input7) {
        input7.addEventListener('click', function() {
            if (!this.value) return;
            this.select();
            try {
                navigator.clipboard.writeText(this.value).then(() => {
                    const orig = this.style.background;
                    this.style.background = '#dbeafe';
                    setTimeout(() => { this.style.background = orig; }, 400);
                }).catch(() => {
                    document.execCommand('copy');
                    alert('Đã sao chép: ' + this.value);
                });
            } catch (e) {
                document.execCommand('copy');
                alert('Đã sao chép: ' + this.value);
            }
        });
    }

    // Đặt ngày mặc định là hôm nay
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('input4');
    if (dateInput) dateInput.value = today;
});

// ============================================================
// 8. HÀM HỖ TRỢ CHO onchange TRONG HTML (để tương thích)
// ============================================================
function updateDescription(selectId, descriptionId) {
    updateDescriptionFromSelect2(selectId, descriptionId);
}