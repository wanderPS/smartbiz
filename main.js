// SmartBiz Analytics - Main JavaScript File

let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParticleSystem();
    initializeDashboard();
    initializePrivacySlider();
    initializeROICalculator();
    initializeDemoBooking();
    initializeScrollAnimations();
    initializeMobileMenu();
});

// Анимации
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in').forEach(el => observer.observe(el));

    if (typeof Splitting !== 'undefined') {
        Splitting();
    }
}

// Частицы в герое
function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    let particles = [];

    function setup() {
        const p5Canvas = createCanvas(canvas.offsetWidth, canvas.offsetHeight);
        p5Canvas.parent('particle-canvas');
        
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: random(width),
                y: random(height),
                vx: random(-0.5, 0.5),
                vy: random(-0.5, 0.5),
                size: random(2, 4),
                opacity: random(0.3, 0.8)
            });
        }
    }

    function draw() {
        clear();
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            fill(43, 182, 163, particle.opacity * 255);
            noStroke();
            ellipse(particle.x, particle.y, particle.size);
        });
        
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = dist(particle.x, particle.y, otherParticle.x, otherParticle.y);
                if (distance < 100) {
                    const opacity = map(distance, 0, 100, 0.3, 0);
                    stroke(43, 182, 163, opacity * 255);
                    strokeWeight(1);
                    line(particle.x, particle.y, otherParticle.x, otherParticle.y);
                }
            });
        });
    }

    function windowResized() {
        resizeCanvas(canvas.offsetWidth, canvas.offsetHeight);
    }

    window.setup = setup;
    window.draw = draw;
    window.windowResized = windowResized;
}

// Панель
function initializeDashboard() {
    const industrySelector = document.getElementById('industry-selector');
    if (!industrySelector) return;

    const industryData = {
        retail: {
            revenue: '₽240 млн',
            customers: '1,847',
            efficiency: '94.2%',
            forecast: '+18.7%',
            recommendation: 'На основе текущих трендов рекомендуем увеличить запасы хитов продаж и запустить таргетированную маркетинговую кампанию для сегмента 25-34 лет.'
        },
        service: {
            revenue: '₽180 млн',
            customers: '892',
            efficiency: '91.5%',
            forecast: '+15.2%',
            recommendation: 'Ваши бронирования услуг растут. Рассмотрите расширение штата и внедрение автоматического планирования для обработки повышенного спроса.'
        },
        manufacturing: {
            revenue: '₽320 млн',
            customers: '234',
            efficiency: '96.8%',
            forecast: '+22.1%',
            recommendation: 'Эффективность производства отличная. Сфокусируйтесь на оптимизации цепочки поставок и предиктивном обслуживании для сохранения конкурентного преимущества.'
        }
    };

    industrySelector.addEventListener('change', function() {
        const industry = this.value;
        const data = industryData[industry];
        
        if (data) {
            updateMetrics(data);
            updateCharts(industry);
            updateRecommendation(data.recommendation);
        }
    });

    initializeCharts();

    function updateMetrics(data) {
        document.getElementById('revenue-metric').textContent = data.revenue;
        document.getElementById('customers-metric').textContent = data.customers;
        document.getElementById('efficiency-metric').textContent = data.efficiency;
        document.getElementById('forecast-metric').textContent = data.forecast;
    }

    function updateRecommendation(text) {
        document.getElementById('ai-recommendation').textContent = text;
    }

    function initializeCharts() {
        const revenueChart = echarts.init(document.getElementById('revenue-chart'));
        const revenueOption = {
            color: ['#2BB6A3', '#0F2747'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'Выручка',
                type: 'line',
                smooth: true,
                data: [180000, 210000, 230000, 240000, 260000, 280000],
                areaStyle: {
                    opacity: 0.3
                }
            }]
        };
        revenueChart.setOption(revenueOption);

        const segmentChart = echarts.init(document.getElementById('segment-chart'));
        const segmentOption = {
            color: ['#2BB6A3', '#0F2747', '#6B7280', '#10B981'],
            tooltip: {
                trigger: 'item'
            },
            series: [{
                name: 'Сегменты клиентов',
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { value: 35, name: '25-34 лет' },
                    { value: 28, name: '35-44 лет' },
                    { value: 22, name: '18-24 лет' },
                    { value: 15, name: '45+ лет' }
                ]
            }]
        };
        segmentChart.setOption(segmentOption);

        window.addEventListener('resize', function() {
            revenueChart.resize();
            segmentChart.resize();
        });
    }

    function updateCharts(industry) {
        console.log('Обновление графиков для отрасли:', industry);
    }
}

// Слайдер конфиденциальности
function initializePrivacySlider() {
    const slider = document.getElementById('privacy-slider');
    const scoreDisplay = document.getElementById('privacy-score');
    
    if (!slider || !scoreDisplay) return;

    slider.addEventListener('input', function() {
        const value = this.value;
        scoreDisplay.textContent = value + '%';
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: scoreDisplay,
                scale: [1, 1.1, 1],
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    });
}

// Калькулятор ROI (с рублями)
function initializeROICalculator() {
    const calculateBtn = document.getElementById('calculate-roi');
    const resultsContainer = document.getElementById('roi-results');
    const chartContainer = document.getElementById('roi-chart');
    
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        const companySize = document.getElementById('company-size').value;
        const industry = document.getElementById('industry-type').value;
        const challenges = Array.from(document.querySelectorAll('.challenge-checkbox:checked')).map(cb => cb.value);
        
        const roiData = calculateROI(companySize, industry, challenges);
        
        displayROIResults(roiData);
        
        showROIChart(roiData);
    });

    function calculateROI(size, industry, challenges) {
        let baseROI = {
            annualSavings: 5000000, // ₽5 млн (примерно $50k * 100)
            efficiencyGains: 25,
            timeSaved: 15,
            implementationTime: 30
        };

        const sizeMultiplier = {
            small: 0.7,
            medium: 1.0,
            large: 1.5
        };

        const challengeBonus = challenges.length * 0.1;

        const multiplier = (sizeMultiplier[size] || 1) * (1 + challengeBonus);
        
        return {
            annualSavings: Math.round(baseROI.annualSavings * multiplier),
            efficiencyGains: Math.round(baseROI.efficiencyGains * multiplier),
            timeSaved: Math.round(baseROI.timeSaved * multiplier),
            implementationTime: baseROI.implementationTime,
            monthlyBreakdown: generateMonthlyBreakdown(baseROI.annualSavings * multiplier)
        };
    }

    function generateMonthlyBreakdown(annualSavings) {
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        return months.map((month, index) => ({
            month,
            savings: Math.round(annualSavings / 12 * (index + 1) / 12)
        }));
    }

    function displayROIResults(data) {
        resultsContainer.innerHTML = `
            <div class="space-y-4">
                <div class="text-center p-6 bg-gradient-to-br from-turquoise/10 to-deep-blue/10 rounded-lg">
                    <div class="text-3xl font-bold text-turquoise mb-1">₽${data.annualSavings.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">Прогнозируемая годовая экономия</div>
                </div>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold text-deep-blue">+${data.efficiencyGains}%</div>
                        <div class="text-sm text-gray-600">Прирост эффективности</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-deep-blue">${data.timeSaved} ч/нед</div>
                        <div class="text-sm text-gray-600">Экономия времени</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-deep-blue">${data.implementationTime} дней</div>
                        <div class="text-sm text-gray-600">Время внедрения</div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.classList.remove('hidden');
    }

    function showROIChart(data) {
        const chart = echarts.init(chartContainer);
        const option = {
            color: ['#2BB6A3', '#0F2747'],
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].name + '<br/>Экономия: ₽' + params[0].value.toLocaleString();
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.monthlyBreakdown.map(item => item.month)
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(value) {
                        return '₽' + (value / 1000) + 'K';
                    }
                }
            },
            series: [{
                name: 'Накопленная экономия',
                type: 'bar',
                data: data.monthlyBreakdown.map(item => item.savings),
                itemStyle: {
                    borderRadius: [4, 4, 0, 0]
                }
            }]
        };
        
        chart.setOption(option);
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: chartContainer,
                opacity: [0, 1],
                duration: 800,
                delay: 300,
                easing: 'easeOutQuad'
            });
        }
        chartContainer.classList.remove('hidden');
    }
}

// Запись на демо
function initializeDemoBooking() {
    const steps = ['step-1', 'step-2', 'step-3'];
    let currentStep = 0;
    
    initializeCalendar();
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
            checkStep1Completion();
        });
    });
    
    document.getElementById('next-step-1')?.addEventListener('click', () => goToStep(1));
    document.getElementById('prev-step-2')?.addEventListener('click', () => goToStep(0));
    document.getElementById('next-step-2')?.addEventListener('click', () => goToStep(2));
    document.getElementById('schedule-another')?.addEventListener('click', () => goToStep(0));
    document.getElementById('back-to-site')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    const step2Inputs = ['first-name', 'last-name', 'email', 'company'];
    step2Inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', checkStep2Completion);
        }
    });
    
    function goToStep(stepIndex) {
        document.getElementById(steps[currentStep]).classList.remove('active');
        currentStep = stepIndex;
        document.getElementById(steps[currentStep]).classList.add('active');
        updateProgressIndicators();
        if (currentStep === 2) {
            populateConfirmationDetails();
        }
    }
    
    function updateProgressIndicators() {
        document.getElementById('step-indicator').textContent = currentStep + 1;
        for (let i = 1; i <= 3; i++) {
            const progress = document.getElementById(`progress-${i}`);
            if (i <= currentStep + 1) {
                progress.classList.remove('bg-gray-300');
                progress.classList.add('bg-turquoise');
            } else {
                progress.classList.remove('bg-turquoise');
                progress.classList.add('bg-gray-300');
            }
        }
        const titles = ['Выберите дату и время', 'Контактные данные', 'Подтверждение'];
        const subtitles = [
            'Выберите удобное время для демо',
            'Расскажите о вашем бизнесе',
            'Проверьте и подтвердите демо'
        ];
        document.getElementById('step-title').textContent = titles[currentStep];
        document.getElementById('step-subtitle').textContent = subtitles[currentStep];
    }
    
    function checkStep1Completion() {
        const nextBtn = document.getElementById('next-step-1');
        nextBtn.disabled = !(selectedDate && selectedTime);
    }
    
    function checkStep2Completion() {
        const nextBtn = document.getElementById('next-step-2');
        const requiredFields = ['first-name', 'last-name', 'email', 'company'];
        const allFilled = requiredFields.every(id => document.getElementById(id).value.trim() !== '');
        nextBtn.disabled = !allFilled;
    }
    
    function populateConfirmationDetails() {
        const date = selectedDate.toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const time = document.querySelector('.time-slot.selected')?.textContent || selectedTime;
        document.getElementById('confirm-date').textContent = date;
        document.getElementById('confirm-time').textContent = time;
    }
    
    function initializeCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const currentMonthElement = document.getElementById('current-month');
        const prevButton = document.getElementById('prev-month');
        const nextButton = document.getElementById('next-month');
        
        if (!calendarGrid) return;
        
        function renderCalendar() {
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());
            
            const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                               'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
            
            currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            calendarGrid.innerHTML = '';
            
            // Дни недели
            const dayHeaders = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            dayHeaders.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'text-xs font-medium text-gray-500 text-center py-2';
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });
            
            const today = new Date();
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = date.getDate();
                
                if (date < today || date.getMonth() !== currentMonth) {
                    dayElement.classList.add('disabled');
                } else {
                    dayElement.addEventListener('click', function() {
                        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                        this.classList.add('selected');
                        selectedDate = date;
                        checkStep1Completion();
                    });
                }
                
                calendarGrid.appendChild(dayElement);
            }
        }
        
        prevButton?.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextButton?.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        renderCalendar();
    }
}

// Скролл-анимации
function initializeScrollAnimations() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Мобильное меню
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenuBtn) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        console.log('Мобильное меню открыто');
    });
}

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Ресайз
window.addEventListener('resize', debounce(function() {
    const charts = document.querySelectorAll('[id$="-chart"]');
    charts.forEach(chartElement => {
        const chart = echarts.getInstanceByDom(chartElement);
        if (chart) {
            chart.resize();
        }
    });
}, 250));