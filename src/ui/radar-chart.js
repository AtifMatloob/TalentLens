// ============================================
// TalentLens — Radar Chart (Canvas)
// ============================================

const CHART_COLORS = {
    excellent: { fill: 'rgba(52, 211, 153, 0.15)', stroke: '#34D399' },
    good: { fill: 'rgba(96, 165, 250, 0.15)', stroke: '#60A5FA' },
    average: { fill: 'rgba(251, 191, 36, 0.15)', stroke: '#FBBF24' },
    below: { fill: 'rgba(251, 146, 60, 0.15)', stroke: '#FB923C' },
    poor: { fill: 'rgba(251, 113, 133, 0.15)', stroke: '#FB7185' },
    default: { fill: 'rgba(129, 140, 248, 0.15)', stroke: '#818CF8' },
    compare1: { fill: 'rgba(52, 211, 153, 0.12)', stroke: '#34D399' },
    compare2: { fill: 'rgba(236, 72, 153, 0.12)', stroke: '#EC4899' },
    compare3: { fill: 'rgba(96, 165, 250, 0.12)', stroke: '#60A5FA' },
};

/**
 * Draw a radar chart on a canvas element
 */
export function drawRadarChart(canvas, dimensions, options = {}) {
    const {
        size = 220,
        labels = true,
        colorScheme = 'default',
        animate = true,
        overlays = null // Array of { dimensions, colorScheme } for comparison
    } = options;

    canvas.width = size * 2; // High DPI
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2); // High DPI scale

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - (labels ? 48 : 16);
    const dims = Object.entries(dimensions);
    const numDims = dims.length;
    const angleStep = (Math.PI * 2) / numDims;
    const startAngle = -Math.PI / 2; // Start from top

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw grid rings
    const rings = 4;
    for (let i = 1; i <= rings; i++) {
        const r = (radius / rings) * i;
        ctx.beginPath();
        for (let j = 0; j < numDims; j++) {
            const angle = startAngle + j * angleStep;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < numDims; i++) {
        const angle = startAngle + i * angleStep;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    // Helper to draw a data polygon
    function drawDataPolygon(dimEntries, scheme) {
        const colors = CHART_COLORS[scheme] || CHART_COLORS.default;

        ctx.beginPath();
        for (let i = 0; i < dimEntries.length; i++) {
            const [, value] = dimEntries[i];
            const angle = startAngle + i * angleStep;
            const r = (value / 100) * radius;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dots
        for (let i = 0; i < dimEntries.length; i++) {
            const [, value] = dimEntries[i];
            const angle = startAngle + i * angleStep;
            const r = (value / 100) * radius;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = colors.stroke;
            ctx.fill();
        }
    }

    // Draw overlays first (behind main)
    if (overlays && Array.isArray(overlays)) {
        for (const overlay of overlays) {
            const overlayDims = Object.entries(overlay.dimensions);
            drawDataPolygon(overlayDims, overlay.colorScheme || 'default');
        }
    }

    // Draw main data
    drawDataPolygon(dims, colorScheme);

    // Draw labels
    if (labels) {
        const labelMap = {
            skillMatch: 'Skills',
            experienceRelevance: 'Experience',
            careerTrajectory: 'Trajectory',
            educationFit: 'Education',
            behavioralSignals: 'Behavioral',
            culturalFit: 'Culture'
        };

        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = '#94A3B8';

        for (let i = 0; i < numDims; i++) {
            const [key, value] = dims[i];
            const angle = startAngle + i * angleStep;
            const labelRadius = radius + 22;
            let x = cx + labelRadius * Math.cos(angle);
            let y = cy + labelRadius * Math.sin(angle);

            const label = labelMap[key] || key;
            const textWidth = ctx.measureText(label).width;

            // Adjust position based on angle
            if (Math.cos(angle) < -0.1) x -= textWidth;
            else if (Math.abs(Math.cos(angle)) <= 0.1) x -= textWidth / 2;

            if (Math.sin(angle) < -0.1) y -= 2;
            else if (Math.sin(angle) > 0.1) y += 10;
            else y += 4;

            ctx.fillText(label, x, y);
        }
    }
}

/**
 * Create a canvas radar chart element
 */
export function createRadarChart(dimensions, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('radar-chart');
    drawRadarChart(canvas, dimensions, options);
    return canvas;
}
