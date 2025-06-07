
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface LLMModel {
    id: string;
    name: string;
    tokensPerSecondPerH100: number;
}

interface DiurnalPatternOption {
    id: string;
    name: string;
    pattern: number[];
}

interface HourlyBreakdown {
    totalDemand: number;
    reserved: number;
    fallback: number;
    flexSpot: number;
}

interface InitialEstimationResults {
    peakGpus: number;
    hourlyGpuDemand: number[];
    modelName: string;
}

interface RecommendedFallbackWindow {
    startHour: number;
    endHour: number;
}

const llmModels: LLMModel[] = [
    { id: 'llama-3-70b', name: 'Llama-3-70B Instruct', tokensPerSecondPerH100: 1500 },
    { id: 'mixtral-8x7b', name: 'Mixtral-8x7B Instruct', tokensPerSecondPerH100: 1200 },
    { id: 'falcon-180b', name: 'Falcon-180B Chat', tokensPerSecondPerH100: 800 },
    { id: 'gemma-7b', name: 'Gemma-7B Instruct', tokensPerSecondPerH100: 3000 },
    { id: 'claude-3-opus-hypo', name: 'Claude 3 Opus (Hypothetical H100)', tokensPerSecondPerH100: 1000 },
    { id: 'gpt-4-base-hypo', name: 'GPT-4 Base (Hypothetical H100)', tokensPerSecondPerH100: 900 },
    { id: 'deepseek-coder-33b', name: 'DeepSeek-Coder-33B-Instruct', tokensPerSecondPerH100: 1800 },
    { id: 'deepseek-llm-67b', name: 'DeepSeek-LLM-67B-Chat', tokensPerSecondPerH100: 1400 },
    { id: 'qwen1.5-14b', name: 'Qwen1.5-14B-Chat', tokensPerSecondPerH100: 2800 },
    { id: 'qwen1.5-72b', name: 'Qwen1.5-72B-Chat', tokensPerSecondPerH100: 1450 },
];

const diurnalPatternsOptions: DiurnalPatternOption[] = [
    {
        id: 'office-hours',
        name: 'Standard Office Hours (9am-5pm Peak)',
        pattern: [0.1, 0.1, 0.1, 0.1, 0.15, 0.25, 0.5, 0.75, 0.95, 1.0, 0.95, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.15, 0.2, 0.3, 0.4, 0.3, 0.2, 0.15]
    },
    {
        id: 'global-flat',
        name: 'Global 24/7 (Flatter Distribution)',
        pattern: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.6, 0.65, 0.7, 0.7, 0.65, 0.6]
    },
    {
        id: 'evening-peak',
        name: 'Evening Peak (B2C/Entertainment)',
        pattern: [0.2, 0.15, 0.1, 0.1, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.95, 0.8, 0.6, 0.4, 0.3, 0.25]
    },
    {
        id: 'dual-peak',
        name: 'Dual Peak (Commute + Evening)',
        pattern: [0.2, 0.15, 0.1, 0.1, 0.3, 0.6, 0.8, 0.9, 0.7, 0.5, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.7, 0.5, 0.3, 0.25, 0.2]
    },
    {
        id: 'early-bird',
        name: 'Early Bird Peak (AM Activity)',
        pattern: [0.7, 0.8, 0.9, 1.0, 0.9, 0.7, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.5]
    },
    {
        id: 'late-night',
        name: 'Late Night Peak (PM/Night Activity)',
        pattern: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.15, 0.2, 0.25, 0.3, 0.3, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.5]
    },
    {
        id: 'weekend-leisure',
        name: 'Weekend Leisure (Sustained High)',
        pattern: [0.4, 0.4, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.8, 0.85, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.4]
    },
    {
        id: 'event-spike',
        name: 'Event-Driven Spike (Sharp Peak)',
        pattern: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    }
];

const DEFAULT_RESERVED_GPUS = 20;
const DEFAULT_PRICE_RESERVED = 2.50;
const DEFAULT_PRICE_FALLBACK = 3.00;
const DEFAULT_PRICE_FLEXSPOT = 3.50;

const CHART_COLORS = {
    totalDemand: 'rgba(26, 115, 232, 1)', 
    reserved: 'rgba(52, 168, 83, 0.7)',
    fallback: 'rgba(251, 188, 5, 0.7)',
    flexSpot: 'rgba(234, 67, 53, 0.7)',
    grid: '#dadce0',
    text: '#5f6368'
};

let currentPeakEstimation: InitialEstimationResults | null = null;
let peakDemandCalculatedSuccessfully = false;
let lastRecommendedFallbackWindow: RecommendedFallbackWindow | null = null;
let lastCalculatedSavingsPer24h: number | null = null;
let lastCalculatedMixedModelCostPer24h: number | null = null;


function populateModelDropdown(): void {
    const selectElement = document.getElementById('llmModel') as HTMLSelectElement;
    if (!selectElement) return;
    llmModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} (~${model.tokensPerSecondPerH100} Tok/s/GPU)`;
        selectElement.appendChild(option);
    });
}

function populateDiurnalPatternDropdown(): void {
    const selectElement = document.getElementById('diurnalPatternSelect') as HTMLSelectElement;
    if (!selectElement) return;
    diurnalPatternsOptions.forEach(patternOpt => {
        const option = document.createElement('option');
        option.value = patternOpt.id;
        option.textContent = patternOpt.name;
        selectElement.appendChild(option);
    });
    if (diurnalPatternsOptions.length > 0) {
        selectElement.value = diurnalPatternsOptions[0].id;
    }
}

function calculateInitialGPUNeeds(
    modelId: string,
    peakConcurrentUsers: number,
    avgRequestsPerUserPeakHour: number,
    avgTokensPerRequest: number,
    activeDiurnalPattern: number[]
): { peakGpus: number; hourlyGpuDemand: number[] } | null {
    const selectedModel = llmModels.find(m => m.id === modelId);
    if (!selectedModel) return null;
    if (peakConcurrentUsers <= 0 || avgRequestsPerUserPeakHour <= 0 || avgTokensPerRequest <= 0) return null;

    const modelTPSPerGPU = selectedModel.tokensPerSecondPerH100;
    const totalPeakRequestsDuringPeakHour = peakConcurrentUsers * avgRequestsPerUserPeakHour;
    const peakRequestsPerSecond = totalPeakRequestsDuringPeakHour / 3600;
    const totalPeakTokensPerSecond = peakRequestsPerSecond * avgTokensPerRequest;
    const peakGpus = Math.ceil(totalPeakTokensPerSecond / modelTPSPerGPU);
    const hourlyGpuDemand = activeDiurnalPattern.map(multiplier => Math.ceil(peakGpus * multiplier));
    return { peakGpus, hourlyGpuDemand };
}

function calculateConsumptionBreakdown(hourlyGpuDemand: number[], reservedGpus: number): HourlyBreakdown[] {
    const fallbackOnDemandCapacity = reservedGpus * 0.5; 

    return hourlyGpuDemand.map(demand => {
        let currentDemand = demand;
        
        const gpusFromReservation = Math.min(currentDemand, reservedGpus);
        currentDemand -= gpusFromReservation;

        const gpusFromFallback = Math.min(currentDemand, fallbackOnDemandCapacity);
        currentDemand -= gpusFromFallback;

        const gpusFromFlexSpot = currentDemand;

        return {
            totalDemand: demand,
            reserved: gpusFromReservation,
            fallback: gpusFromFallback,
            flexSpot: gpusFromFlexSpot,
        };
    });
}

function calculateRecommendedFallbackWindow(hourlyGpuDemand: number[], reservedGpus: number): RecommendedFallbackWindow {
    let firstOverrunHour = -1;
    let lastOverrunHour = -1;

    for (let i = 0; i < hourlyGpuDemand.length; i++) {
        if (hourlyGpuDemand[i] > reservedGpus) {
            if (firstOverrunHour === -1) {
                firstOverrunHour = i;
            }
            lastOverrunHour = i;
        }
    }

    if (firstOverrunHour !== -1) {
        // Window is from the start of the first overrun hour to the end of the last overrun hour
        return { startHour: firstOverrunHour, endHour: lastOverrunHour + 1 };
    } else {
        // Default window if no overrun (e.g., standard business hours)
        return { startHour: 9, endHour: 17 };
    }
}


function displayResultsSummary(peakGpus: number | null, modelName: string | null, error?: string): void {
    const resultsDisplay = document.getElementById('resultsDisplay');
    if (!resultsDisplay) return;

    if (error) {
        resultsDisplay.innerHTML = `<p class="error-message">${error}</p>`;
        return;
    }
    
    if (peakGpus === null || modelName === null) {
         resultsDisplay.innerHTML = `<p>Configure workload details and click "Calculate Peak Demand".</p>`;
        return;
    }

     resultsDisplay.innerHTML = `
        <p>For <strong>${modelName}</strong>, your workload has an estimated peak demand of:</p>
        <p><strong aria-live="assertive">${peakGpus} H100 GPU(s)</strong>.</p>
    `;
    if (peakGpus <= 0) {
         resultsDisplay.innerHTML = `
            <p>For <strong>${modelName}</strong>, the estimated load is very low or zero.</p>
            <p><strong aria-live="assertive">Peak demand: ${peakGpus} H100 GPU(s)</strong>.</p>
            <p>Review inputs if this is unexpected.</p>
        `;
    }
}

function displayAnalysis(
    hourlyBreakdowns: HourlyBreakdown[] | null,
    reservedGpusConfig: number,
    peakTotalDemand: number | null,
    prices: { reserved: number; fallback: number; flexSpot: number } | null,
    error?: string
): void {
    const analysisDisplay = document.getElementById('analysisDisplay');
    const costAnalysisParentCard = document.getElementById('costAnalysisParentCard');
    if (!analysisDisplay || !costAnalysisParentCard) return;

    const existingProceedButton = document.getElementById('proceedToBookingButton');
    if (existingProceedButton) {
        existingProceedButton.remove();
    }

    if (error) {
        analysisDisplay.innerHTML = `<p class="error-message">${error}</p>`;
        lastCalculatedSavingsPer24h = null;
        lastCalculatedMixedModelCostPer24h = null;
        return;
    }

    if (!peakDemandCalculatedSuccessfully || !hourlyBreakdowns || peakTotalDemand === null || !prices) {
        analysisDisplay.innerHTML = `<p class="placeholder-text">Configure capacity details and click 'Analyze Capacity & Costs'.</p>`;
        lastCalculatedSavingsPer24h = null;
        lastCalculatedMixedModelCostPer24h = null;
        return;
    }

    let totalReservedUsed = 0;
    let totalFallbackUsed = 0;
    let totalFlexSpotUsed = 0;

    hourlyBreakdowns.forEach(hour => {
        totalReservedUsed += hour.reserved;
        totalFallbackUsed += hour.fallback;
        totalFlexSpotUsed += hour.flexSpot;
    });

    const totalReservedPaidHours = reservedGpusConfig * 24;
    const totalIdleReservedHours = Math.max(0, totalReservedPaidHours - totalReservedUsed);

    const costAllReservedPeak = peakTotalDemand * 24 * prices.reserved;
    const costMixedModel = (totalReservedPaidHours * prices.reserved) +
                           (totalFallbackUsed * prices.fallback) +
                           (totalFlexSpotUsed * prices.flexSpot);
    const savings = costAllReservedPeak - costMixedModel;
    const anyPriceSet = prices.reserved > 0 || prices.fallback > 0 || prices.flexSpot > 0;

    if (anyPriceSet) {
        lastCalculatedSavingsPer24h = savings;
        lastCalculatedMixedModelCostPer24h = costMixedModel;
    } else {
        lastCalculatedSavingsPer24h = null;
        lastCalculatedMixedModelCostPer24h = null;
    }

    analysisDisplay.innerHTML = `
        <h4>GPU Hours Breakdown (24h):</h4>
        <ul>
            <li>Reserved GPUs (Utilized): <strong aria-label="Reserved GPUs Utilized">${totalReservedUsed.toLocaleString()} GPU-hours</strong></li>
            <li>Reserved GPUs (Idle): <strong aria-label="Reserved GPUs Idle">${totalIdleReservedHours.toLocaleString()} GPU-hours</strong></li>
            <li>Fallback On-Demand GPUs (Utilized): <strong aria-label="Fallback On-Demand GPUs Utilized">${totalFallbackUsed.toLocaleString()} GPU-hours</strong></li>
            <li>Flex-start GPUs (Utilized): <strong aria-label="Flex-start GPUs Utilized">${totalFlexSpotUsed.toLocaleString()} GPU-hours</strong></li>
        </ul>
        <h4>Cost Comparison (24h Estimate):</h4>
        <div class="cost-comparison-container">
            <div class="cost-column">
                <p class="cost-label">Scenario 1: 100% Reservation for Peak</p>
                <p class="cost-value">${anyPriceSet && prices.reserved > 0 ? '$' + costAllReservedPeak.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'}</p>
            </div>
            <div class="cost-column">
                <p class="cost-label">Scenario 2: Reservation + Fallback + Flex-start</p>
                <p class="cost-value">${anyPriceSet ? '$' + costMixedModel.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'}</p>
            </div>
        </div>
        <div class="savings-summary">
            Potential Savings (Scenario 2 vs 1): 
            <strong class="${savings >= 0 ? 'savings' : 'loss'}" aria-label="Potential savings">
                ${anyPriceSet ? '$' + savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A (Set Prices)'}
            </strong>
        </div>
    `;

    if (!error && peakDemandCalculatedSuccessfully) {
        const proceedButton = document.createElement('button');
        proceedButton.type = 'button';
        proceedButton.id = 'proceedToBookingButton';
        proceedButton.className = 'cta-button secondary-button calculate-button';
        proceedButton.textContent = 'Proceed to Book Capacity';
        proceedButton.addEventListener('click', () => displayBookingTool(lastRecommendedFallbackWindow));
        costAnalysisParentCard.appendChild(proceedButton);
    }
}

function drawDiurnalChart(
    hourlyBreakdowns: HourlyBreakdown[] | null, 
    peakDemandValue: number | null, 
    showOnlyTotalDemandLine: boolean = false
): void {
    const canvas = document.getElementById('diurnalChart') as HTMLCanvasElement;
    const legendDiv = document.getElementById('chartLegend');
    const chartPlaceholder = document.getElementById('chartPlaceholder');

    if (!canvas || !legendDiv || !chartPlaceholder) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const chartWidth = canvas.clientWidth; 
    const chartHeight = canvas.clientHeight;
    const padding = 50;

    ctx.clearRect(0, 0, chartWidth, chartHeight);
    legendDiv.innerHTML = '';
    chartPlaceholder.style.display = 'none';

    if (!peakDemandCalculatedSuccessfully || peakDemandValue === null || peakDemandValue < 0 || (!hourlyBreakdowns && !showOnlyTotalDemandLine)) {
        chartPlaceholder.style.display = 'block';
        chartPlaceholder.textContent = peakDemandCalculatedSuccessfully ? "Configure capacity and click 'Analyze Capacity & Costs' to see full chart." : "Chart will appear after calculations.";
        return;
    }
    
    ctx.lineWidth = 1;
    ctx.font = '11px Roboto, Noto Sans, sans-serif';

    const maxVal = Math.max(peakDemandValue, 5); 
    const numDataPoints = showOnlyTotalDemandLine && currentPeakEstimation ? currentPeakEstimation.hourlyGpuDemand.length : (hourlyBreakdowns ? hourlyBreakdowns.length : 0);
    if(numDataPoints === 0) {
        chartPlaceholder.style.display = 'block';
        chartPlaceholder.textContent = "Not enough data to draw chart.";
        return;
    }

    const stepX = (chartWidth - 2 * padding) / (numDataPoints > 1 ? numDataPoints - 1 : 1);
    const stepY = (maxVal > 0) ? (chartHeight - 2 * padding) / maxVal : (chartHeight - 2 * padding);

    // Y-axis and Gridlines
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, chartHeight - padding);
    ctx.strokeStyle = CHART_COLORS.grid;
    ctx.stroke();

    const numYLabels = 5;
    for (let i = 0; i <= numYLabels; i++) {
        const val = Math.ceil((maxVal / numYLabels) * i);
        const y = chartHeight - padding - (val * stepY);
        ctx.fillStyle = CHART_COLORS.text;
        ctx.textAlign = 'right';
        ctx.fillText(String(val), padding - 8, y + 4); 
        if (i > 0) { 
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(chartWidth - padding, y);
            ctx.strokeStyle = CHART_COLORS.grid;
            ctx.stroke();
        }
    }
    ctx.fillStyle = CHART_COLORS.text;
    ctx.save();
    ctx.translate(padding / 3 - 5, chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '12px Roboto, Noto Sans, sans-serif';
    ctx.fillText('Est. GPUs', 0, 0); 
    ctx.restore();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, chartHeight - padding);
    ctx.lineTo(chartWidth - padding, chartHeight - padding);
    ctx.strokeStyle = CHART_COLORS.grid;
    ctx.stroke();

    for (let i = 0; i < numDataPoints; i++) { 
        const x = padding + i * stepX;
        if (i % 2 === 0) { 
            ctx.fillStyle = CHART_COLORS.text;
            ctx.textAlign = 'center';
            ctx.fillText(String(i).padStart(2, '0'), x, chartHeight - padding + 18);
        }
    }
    ctx.fillStyle = CHART_COLORS.text;
    ctx.textAlign = 'center';
    ctx.font = '12px Roboto, Noto Sans, sans-serif';
    ctx.fillText('Hour of Day', chartWidth / 2, chartHeight - padding + 35);

    const totalDemandHourlyData = showOnlyTotalDemandLine && currentPeakEstimation ? currentPeakEstimation.hourlyGpuDemand : (hourlyBreakdowns ? hourlyBreakdowns.map(h => h.totalDemand) : []);

    if (!showOnlyTotalDemandLine && hourlyBreakdowns) {
        const drawArea = (data: number[], color: string, baseData: number[] | null = null) => {
            ctx.beginPath();
            const firstDataY = baseData ? baseData[0] + data[0] : data[0];
            ctx.moveTo(padding, chartHeight - padding - (firstDataY * stepY));

            for (let i = 0; i < numDataPoints; i++) {
                const yValue = baseData ? baseData[i] + data[i] : data[i];
                ctx.lineTo(padding + i * stepX, chartHeight - padding - (yValue * stepY));
            }
            
            if (baseData) { 
                for (let i = numDataPoints - 1; i >= 0; i--) {
                     ctx.lineTo(padding + i * stepX, chartHeight - padding - (baseData[i] * stepY));
                }
            } else { 
                ctx.lineTo(padding + (numDataPoints - 1) * stepX, chartHeight - padding);
                ctx.lineTo(padding, chartHeight - padding);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };

        const reservedHourly = hourlyBreakdowns.map(h => h.reserved);
        const fallbackHourly = hourlyBreakdowns.map(h => h.fallback);
        const flexSpotHourly = hourlyBreakdowns.map(h => h.flexSpot);
        const reservedAndFallbackHourly = reservedHourly.map((r, i) => r + fallbackHourly[i]);

        drawArea(reservedHourly, CHART_COLORS.reserved);
        drawArea(fallbackHourly, CHART_COLORS.fallback, reservedHourly);
        drawArea(flexSpotHourly, CHART_COLORS.flexSpot, reservedAndFallbackHourly);
    }
    
    if (totalDemandHourlyData.length > 0) {
        ctx.beginPath();
        ctx.moveTo(padding, chartHeight - padding - (totalDemandHourlyData[0] * stepY));
        totalDemandHourlyData.forEach((point, i) => {
            ctx.lineTo(padding + i * stepX, chartHeight - padding - (point * stepY));
        });
        ctx.strokeStyle = CHART_COLORS.totalDemand;
        ctx.lineWidth = 2.5; 
        ctx.stroke();
    }

    const legendItemsConfig = [
        { label: 'Total Demand', color: CHART_COLORS.totalDemand, isLine: true },
        { label: 'Reserved', color: CHART_COLORS.reserved },
        { label: 'Fallback On-Demand', color: CHART_COLORS.fallback },
        { label: 'Flex-start', color: CHART_COLORS.flexSpot },
    ];
    
    const itemsToShowInLegend = showOnlyTotalDemandLine ? [legendItemsConfig[0]] : legendItemsConfig;

    itemsToShowInLegend.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'legend-item';
        const colorBox = document.createElement('span');
        colorBox.className = 'legend-color-box';
        colorBox.style.backgroundColor = item.color;
        if (item.isLine) { 
            colorBox.style.height = '3px';
            colorBox.style.width = '20px';
            colorBox.style.border = 'none'; 
        }
        itemDiv.appendChild(colorBox);
        itemDiv.appendChild(document.createTextNode(item.label));
        legendDiv.appendChild(itemDiv);
    });
}

function handlePeakDemandCalculation(): void {
    const form = document.getElementById('gpuForm') as HTMLFormElement;
    if (!form) return;

    const modelId = (form.elements.namedItem('llmModel') as HTMLSelectElement).value;
    const peakConcurrentUsers = parseInt((form.elements.namedItem('peakConcurrentUsers') as HTMLInputElement).value, 10);
    const avgRequestsPerUserPeakHour = parseInt((form.elements.namedItem('avgRequestsPerUserPeakHour') as HTMLInputElement).value, 10);
    const avgTokensPerRequest = parseInt((form.elements.namedItem('avgTokensPerRequest') as HTMLInputElement).value, 10);
    const selectedPatternId = (form.elements.namedItem('diurnalPatternSelect') as HTMLSelectElement).value;

    const resultsDisplay = document.getElementById('resultsDisplay');
    const analyzeButton = document.getElementById('analyzeCapacityCostsButton') as HTMLButtonElement;
    const analysisDisplay = document.getElementById('analysisDisplay');
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const bookingToolSection = document.getElementById('bookingToolSection') as HTMLDivElement;

    if (!resultsDisplay || !analyzeButton || !analysisDisplay || !chartPlaceholder || !bookingToolSection) return;

    resultsDisplay.innerHTML = '<p>Calculating Peak Demand...</p>';
    chartPlaceholder.textContent = 'Calculating Peak Demand...';
    chartPlaceholder.style.display = 'block';
    drawDiurnalChart(null, null, false); 
    analysisDisplay.innerHTML = `<p class="placeholder-text">Configure capacity details and click 'Analyze Capacity & Costs'.</p>`; 
    bookingToolSection.style.display = 'none';
    bookingToolSection.innerHTML = '';
    lastCalculatedSavingsPer24h = null; 
    lastCalculatedMixedModelCostPer24h = null;
    const existingProceedButton = document.getElementById('proceedToBookingButton');
    if (existingProceedButton) {
        existingProceedButton.remove();
    }

    let errorMessages = [];
    if (isNaN(peakConcurrentUsers) || peakConcurrentUsers <= 0) errorMessages.push("Peak Concurrent Users must be positive.");
    if (isNaN(avgRequestsPerUserPeakHour) || avgRequestsPerUserPeakHour <= 0) errorMessages.push("Avg. Requests per User (peak hour) must be positive.");
    if (isNaN(avgTokensPerRequest) || avgTokensPerRequest <= 0) errorMessages.push("Avg. Tokens per Request must be positive.");
    
    const selectedModelInfo = llmModels.find(m => m.id === modelId);
    const activePattern = diurnalPatternsOptions.find(p => p.id === selectedPatternId);

    if (!selectedModelInfo) errorMessages.push("Select a valid LLM model.");
    if (!activePattern) errorMessages.push("Select a valid diurnal pattern.");

    if (errorMessages.length > 0) {
        displayResultsSummary(null, null, errorMessages.join(' '));
        currentPeakEstimation = null;
        peakDemandCalculatedSuccessfully = false;
        analyzeButton.disabled = true;
        return;
    }

    const initialNeeds = calculateInitialGPUNeeds(modelId, peakConcurrentUsers, avgRequestsPerUserPeakHour, avgTokensPerRequest, activePattern!.pattern);

    if (initialNeeds) {
        currentPeakEstimation = { ...initialNeeds, modelName: selectedModelInfo!.name };
        peakDemandCalculatedSuccessfully = true;
        displayResultsSummary(currentPeakEstimation.peakGpus, currentPeakEstimation.modelName);
        drawDiurnalChart(null, currentPeakEstimation.peakGpus, true); 
        analyzeButton.disabled = false;
        chartPlaceholder.textContent = "Now, configure capacity and click 'Analyze Capacity & Costs'.";
    } else {
        displayResultsSummary(null, null, "Could not calculate peak GPU needs. Check inputs.");
        currentPeakEstimation = null;
        peakDemandCalculatedSuccessfully = false;
        analyzeButton.disabled = true;
    }
}

function handleCapacityCostAnalysis(): void {
    const form = document.getElementById('gpuForm') as HTMLFormElement;
    if (!form || !currentPeakEstimation) {
        displayAnalysis(null, 0, null, null, "Calculate peak demand first.");
        return;
    }

    let reservedGpus = parseInt((form.elements.namedItem('reservedGpus') as HTMLInputElement).value, 10);
    const priceReserved = parseFloat((form.elements.namedItem('priceReserved') as HTMLInputElement).value);
    const priceFallbackOnDemand = parseFloat((form.elements.namedItem('priceFallbackOnDemand') as HTMLInputElement).value);
    const priceFlexSpot = parseFloat((form.elements.namedItem('priceFlexSpot') as HTMLInputElement).value);
    
    const analysisDisplay = document.getElementById('analysisDisplay');
    if(!analysisDisplay) return;
    analysisDisplay.innerHTML = '<p>Analyzing Capacity & Costs...</p>';
    drawDiurnalChart(null, currentPeakEstimation.peakGpus, true); 
    
    const bookingToolSection = document.getElementById('bookingToolSection') as HTMLDivElement;
    if (bookingToolSection) {
        bookingToolSection.style.display = 'none';
        bookingToolSection.innerHTML = '';
    }

    let errorMessages = [];
    if (isNaN(reservedGpus) || reservedGpus < 0) errorMessages.push("Reserved H100 GPUs must be non-negative.");
    if (reservedGpus > 512) {
        (form.elements.namedItem('reservedGpus') as HTMLInputElement).value = '512';
        reservedGpus = 512;
    }
    if (isNaN(priceReserved) || priceReserved < 0) errorMessages.push("Price for Reserved GPU must be non-negative.");
    if (isNaN(priceFallbackOnDemand) || priceFallbackOnDemand < 0) errorMessages.push("Price for Fallback On-Demand GPU must be non-negative.");
    if (isNaN(priceFlexSpot) || priceFlexSpot < 0) errorMessages.push("Price for Flex-start GPU must be non-negative.");

    if (errorMessages.length > 0) {
        displayAnalysis(null, 0, null, null, errorMessages.join(' '));
        return;
    }
    
    lastRecommendedFallbackWindow = calculateRecommendedFallbackWindow(currentPeakEstimation.hourlyGpuDemand, reservedGpus);

    const hourlyBreakdowns = calculateConsumptionBreakdown(currentPeakEstimation.hourlyGpuDemand, reservedGpus);
    drawDiurnalChart(hourlyBreakdowns, currentPeakEstimation.peakGpus, false); 
    displayAnalysis(hourlyBreakdowns, reservedGpus, currentPeakEstimation.peakGpus, {
        reserved: priceReserved,
        fallback: priceFallbackOnDemand,
        flexSpot: priceFlexSpot
    });
}

function displayBookingTool(recommendedWindow: RecommendedFallbackWindow | null) {
    const bookingToolSection = document.getElementById('bookingToolSection') as HTMLDivElement;
    const form = document.getElementById('gpuForm') as HTMLFormElement;
    if (!bookingToolSection || !form || !currentPeakEstimation) return;

    const reservedGpusInput = form.elements.namedItem('reservedGpus') as HTMLInputElement;
    const reservedGpusValue = parseInt(reservedGpusInput.value, 10);
    if (isNaN(reservedGpusValue) || reservedGpusValue < 0) {
        alert("Invalid number of reserved GPUs. Please correct it in the configuration.");
        return;
    }
    const fallbackCapacity = reservedGpusValue * 0.5;

    const defaultStartTime = recommendedWindow ? `${String(recommendedWindow.startHour).padStart(2, '0')}:00` : "09:00";
    const defaultEndTime = recommendedWindow ? `${String(recommendedWindow.endHour).padStart(2, '0')}:00` : "17:00";


    bookingToolSection.innerHTML = `
        <h2>Inference Capacity Booking</h2>
        <div class="booking-summary">
            <p>Reserved H100 GPUs: <strong>${reservedGpusValue}</strong></p>
            <p>Daily Fallback On-Demand Capacity (50% of reserved): <strong>${fallbackCapacity.toLocaleString()} GPUs</strong></p>
        </div>

        <div class="form-group">
            <label for="reservationStartDate">Reservation Start Date:</label>
            <input type="date" id="reservationStartDate" name="reservationStartDate" required>
        </div>
        <div class="form-group">
            <label for="reservationEndDate">Reservation End Date:</label>
            <input type="date" id="reservationEndDate" name="reservationEndDate" required>
        </div>
        <div id="reservationDurationDisplay" class="reservation-duration-display">Selected Reservation Duration: 0 days</div>


        <div class="form-group">
            <label for="fallbackStartTime">Daily Fallback Start Time:</label>
            <input type="time" id="fallbackStartTime" name="fallbackStartTime" value="${defaultStartTime}" required>
        </div>
        <div class="form-group">
            <label for="fallbackEndTime">Daily Fallback End Time:</label>
            <input type="time" id="fallbackEndTime" name="fallbackEndTime" value="${defaultEndTime}" required>
        </div>
        <p class="recommendation-note">Recommended fallback window: ${defaultStartTime} - ${defaultEndTime}. You can adjust this.</p>
        
        <div class="form-group">
             <label>Visual Fallback Window (24h):</label>
            <div class="fallback-timeline-container">
                <div id="fallbackTimelineHighlight" class="fallback-timeline-highlight"></div>
            </div>
        </div>

        <p class="info-text">Flex-start capacity will automatically address any demand exceeding your Reserved and Fallback On-Demand capacity.</p>
        <button type="button" id="confirmBookingButton" class="cta-button primary-button calculate-button">Confirm Booking</button>
        <div id="bookingConfirmationMessage"></div>
    `;
    bookingToolSection.style.display = 'block';

    const confirmBookingButton = document.getElementById('confirmBookingButton');
    const reservationStartDateInput = document.getElementById('reservationStartDate') as HTMLInputElement;
    const reservationEndDateInput = document.getElementById('reservationEndDate') as HTMLInputElement;
    const fallbackStartTimeInput = document.getElementById('fallbackStartTime') as HTMLInputElement;
    const fallbackEndTimeInput = document.getElementById('fallbackEndTime') as HTMLInputElement;

    function updateReservationDuration() {
        const startDate = reservationStartDateInput.value;
        const endDate = reservationEndDateInput.value;
        const durationDisplay = document.getElementById('reservationDurationDisplay');
        if (durationDisplay && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) +1; // Inclusive of start and end day
                durationDisplay.textContent = `Selected Reservation Duration: ${diffDays} day(s)`;
            } else {
                durationDisplay.textContent = `Selected Reservation Duration: Invalid dates`;
            }
        } else if (durationDisplay) {
            durationDisplay.textContent = `Selected Reservation Duration: 0 days`;
        }
    }

    function updateFallbackTimeline() {
        const timelineHighlight = document.getElementById('fallbackTimelineHighlight');
        if (!timelineHighlight) return;

        const startTime = fallbackStartTimeInput.value; // "HH:MM"
        const endTime = fallbackEndTimeInput.value;   // "HH:MM"

        if (startTime && endTime) {
            const startHour = parseInt(startTime.split(':')[0], 10);
            const startMinute = parseInt(startTime.split(':')[1], 10);
            const endHour = parseInt(endTime.split(':')[0], 10);
            const endMinute = parseInt(endTime.split(':')[1], 10);

            if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return;
            
            const totalStartMinutes = startHour * 60 + startMinute;
            const totalEndMinutes = endHour * 60 + endMinute;
            const minutesInDay = 24 * 60;

            if (totalEndMinutes <= totalStartMinutes) {
                timelineHighlight.style.width = '0%';
                return;
            }

            const leftPercent = (totalStartMinutes / minutesInDay) * 100;
            const widthPercent = ((totalEndMinutes - totalStartMinutes) / minutesInDay) * 100;

            timelineHighlight.style.left = `${leftPercent}%`;
            timelineHighlight.style.width = `${widthPercent}%`;
        } else {
            timelineHighlight.style.width = '0%';
        }
    }


    if (confirmBookingButton) {
        confirmBookingButton.addEventListener('click', handleConfirmBooking);
    }
    if (reservationStartDateInput && reservationEndDateInput) {
        reservationStartDateInput.addEventListener('change', updateReservationDuration);
        reservationEndDateInput.addEventListener('change', updateReservationDuration);
    }
    if (fallbackStartTimeInput && fallbackEndTimeInput) {
        fallbackStartTimeInput.addEventListener('change', updateFallbackTimeline);
        fallbackEndTimeInput.addEventListener('change', updateFallbackTimeline);
        updateFallbackTimeline(); // Initial draw
    }
    
    bookingToolSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleConfirmBooking() {
    const reservedGpusValue = parseInt((document.getElementById('reservedGpus') as HTMLInputElement).value, 10);
    const fallbackCapacity = reservedGpusValue * 0.5;
    const startDate = (document.getElementById('reservationStartDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('reservationEndDate') as HTMLInputElement).value;
    const fallbackStartTime = (document.getElementById('fallbackStartTime') as HTMLInputElement).value;
    const fallbackEndTime = (document.getElementById('fallbackEndTime') as HTMLInputElement).value;
    const confirmationMessageDiv = document.getElementById('bookingConfirmationMessage');

    if (!confirmationMessageDiv) return;

    let errors = [];
    if (!startDate) errors.push("Reservation Start Date is required.");
    if (!endDate) errors.push("Reservation End Date is required.");
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        errors.push("Reservation End Date cannot be before Start Date.");
    }
    if (!fallbackStartTime) errors.push("Daily Fallback Start Time is required.");
    if (!fallbackEndTime) errors.push("Daily Fallback End Time is required.");
    if (fallbackStartTime && fallbackEndTime && fallbackStartTime >= fallbackEndTime) {
        errors.push("Fallback End Time must be after Start Time.");
    }
    
    if (errors.length > 0) {
        confirmationMessageDiv.innerHTML = `<p class="error-message">${errors.join('<br>')}</p>`;
        confirmationMessageDiv.className = 'error';
        return;
    }
    
    let reservationDurationDays = 0;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end >= start) { 
            const diffTime = Math.abs(end.getTime() - start.getTime());
            reservationDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
        }
    }

    let totalSavingsMessage = '';
    if (lastCalculatedSavingsPer24h !== null && reservationDurationDays > 0) {
        const totalSavings = lastCalculatedSavingsPer24h * reservationDurationDays;
        totalSavingsMessage = `<li>Estimated Total Savings for this Period: <strong class="${totalSavings >= 0 ? 'savings' : 'loss'}">${'$' + totalSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></li>`;
    } else if (lastCalculatedSavingsPer24h === null) {
        totalSavingsMessage = `<li>Estimated Total Savings for this Period: <strong>N/A (Set prices for 24h savings)</strong></li>`;
    }

    let totalBookingCostMessage = '';
    if (lastCalculatedMixedModelCostPer24h !== null && reservationDurationDays > 0) {
        const totalCost = lastCalculatedMixedModelCostPer24h * reservationDurationDays;
        totalBookingCostMessage = `<li>Estimated Total Cost for this Booking: <strong>${'$' + totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></li>`;
    } else if (lastCalculatedMixedModelCostPer24h === null) {
        totalBookingCostMessage = `<li>Estimated Total Cost for this Booking: <strong>N/A (Set prices for 24h cost)</strong></li>`;
    }


    confirmationMessageDiv.innerHTML = `
        <p><strong>Booking Confirmed (Simulated):</strong></p>
        <ul>
            <li>Reserved H100 GPUs: <strong>${reservedGpusValue}</strong></li>
            <li>Reservation Period: <strong>${startDate} to ${endDate}</strong> (${reservationDurationDays} day(s))</li>
            <li>Daily Fallback On-Demand Window: <strong>${fallbackStartTime} - ${fallbackEndTime}</strong> (for ${fallbackCapacity} GPUs)</li>
            ${totalBookingCostMessage}
            ${totalSavingsMessage}
            <li>Flex-start capacity will cover further needs.</li>
        </ul>
    `;
    confirmationMessageDiv.className = 'success';
}


document.addEventListener('DOMContentLoaded', () => {
    populateModelDropdown();
    populateDiurnalPatternDropdown();
    
    const form = document.getElementById('gpuForm') as HTMLFormElement;
    const calculatePeakDemandButton = document.getElementById('calculatePeakDemandButton');
    const analyzeCapacityCostsButton = document.getElementById('analyzeCapacityCostsButton');

    if (form && calculatePeakDemandButton && analyzeCapacityCostsButton) {
        (document.getElementById('peakConcurrentUsers') as HTMLInputElement).value = '100';
        (document.getElementById('avgRequestsPerUserPeakHour') as HTMLInputElement).value = '10';
        (document.getElementById('avgTokensPerRequest') as HTMLInputElement).value = '2000';
        (document.getElementById('reservedGpus') as HTMLInputElement).value = String(DEFAULT_RESERVED_GPUS);
        (document.getElementById('priceReserved') as HTMLInputElement).value = String(DEFAULT_PRICE_RESERVED.toFixed(2));
        (document.getElementById('priceFallbackOnDemand') as HTMLInputElement).value = String(DEFAULT_PRICE_FALLBACK.toFixed(2));
        (document.getElementById('priceFlexSpot') as HTMLInputElement).value = String(DEFAULT_PRICE_FLEXSPOT.toFixed(2));
        
        calculatePeakDemandButton.addEventListener('click', handlePeakDemandCalculation);
        analyzeCapacityCostsButton.addEventListener('click', handleCapacityCostAnalysis);
        
        handlePeakDemandCalculation(); // Perform initial calculation on load
    } else {
        console.error("Required form elements or buttons not found.");
    }
});
