/**
 * NetSecure Elite - Modern Dashboard JavaScript
 * Advanced cybersecurity dashboard with real-time animations and interactions
 */

class ModernDashboard {
    constructor() {
        this.isLoaded = false;
        this.updateInterval = null;
        this.animationFrameId = null;
        this.charts = {};
        this.websocketConnection = null;
        this.particleSystem = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    async init() {
        console.log('🛡️ NetSecure Elite Dashboard Initializing...');
        
        // Initialize components with new geometric background
        await this.initializeGeometricBackground();
        this.initializeLoadingScreen();
        this.initializeEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates(); // ENABLED - keep data fetching
        this.initializeParticleSystem();
        
        console.log('✅ Dashboard loaded with geometric background');
        this.isLoaded = true;
    }
    
    // Geometric Background Animation System
    async initializeGeometricBackground() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Geometric elements
        const dots = [];
        const lines = [];
        const numDots = 50;
        
        // Create floating dots
        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const drawGeometric = () => {
            // Clear canvas with fade effect
            ctx.fillStyle = 'rgba(10, 14, 26, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid pattern
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.lineWidth = 0.5;
            const gridSize = 50;
            
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            // Update and draw dots
            dots.forEach(dot => {
                dot.x += dot.vx;
                dot.y += dot.vy;
                
                // Bounce off edges
                if (dot.x < 0 || dot.x > canvas.width) dot.vx = -dot.vx;
                if (dot.y < 0 || dot.y > canvas.height) dot.vy = -dot.vy;
                
                // Draw dot
                ctx.fillStyle = `rgba(0, 255, 136, ${dot.opacity})`;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw connections to nearby dots
                dots.forEach(otherDot => {
                    const distance = Math.sqrt(
                        Math.pow(dot.x - otherDot.x, 2) + 
                        Math.pow(dot.y - otherDot.y, 2)
                    );
                    
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(otherDot.x, otherDot.y);
                        ctx.stroke();
                    }
                });
            });
            
            // Draw floating hexagons
            const time = Date.now() * 0.001;
            for (let i = 0; i < 5; i++) {
                const x = (Math.sin(time * 0.3 + i) * 100) + canvas.width / 2;
                const y = (Math.cos(time * 0.2 + i) * 50) + canvas.height / 2;
                const size = 20 + Math.sin(time + i) * 5;
                
                ctx.strokeStyle = `rgba(255, 51, 102, ${0.2 + Math.sin(time + i) * 0.1})`;
                ctx.lineWidth = 1;
                this.drawHexagon(ctx, x, y, size);
            }
        };
        
        const animateGeometric = () => {
            drawGeometric();
            this.animationFrameId = requestAnimationFrame(animateGeometric);
        };
        
        animateGeometric();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Helper function to draw hexagon
    drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Loading Screen Animation
    initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingTexts = [
            'Initializing Threat Intelligence Systems...',
            'Scanning Network Perimeter...',
            'Loading Security Protocols...',
            'Establishing Secure Connection...',
            'Activating Defense Systems...',
            'System Ready - Welcome to NetSecure Elite'
        ];
        
        let textIndex = 0;
        const loadingText = document.querySelector('.loading-text');
        
        const updateLoadingText = () => {
            if (loadingText && textIndex < loadingTexts.length - 1) {
                loadingText.textContent = loadingTexts[textIndex];
                textIndex++;
                setTimeout(updateLoadingText, 500);
            }
        };
        
        updateLoadingText();
        
        // Remove loading screen after animation
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 4000);
    }
    
    // Event Listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });
        
        // Modal handling
        this.initializeModal();
        
        // Stat card interactions
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => this.showStatDetails(card));
            card.addEventListener('mouseenter', () => this.animateStatCard(card, true));
            card.addEventListener('mouseleave', () => this.animateStatCard(card, false));
        });
        
        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleControlAction(btn);
            });
        });
    }
    
    // Navigation Handler
    handleNavigation(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Add click animation
        navItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            navItem.style.transform = '';
        }, 150);
        
        // Get section name from nav item text
        const sectionName = navItem.querySelector('span')?.textContent.toLowerCase();
        this.showSection(sectionName);
        
        console.log('Navigation:', sectionName);
    }
    
    // Section Switching
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the requested section
        let targetSection;
        switch(sectionName) {
            case 'dashboard':
                targetSection = document.getElementById('dashboard-section');
                break;
            case 'threats':
                targetSection = document.getElementById('threats-section');
                this.initializeThreatsSection();
                break;
            case 'network':
                targetSection = document.getElementById('network-section');
                this.initializeNetworkSection();
                break;
            case 'alerts':
                targetSection = document.getElementById('alerts-section');
                this.initializeAlertsSection();
                break;
            default:
                targetSection = document.getElementById('dashboard-section');
        }
        
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    // Initialize Threats Section
    initializeThreatsSection() {
        console.log('Initializing Threats Section');
        this.loadThreatsData();
    }
    
    // Initialize Network Section  
    initializeNetworkSection() {
        console.log('Initializing Network Section');
        this.loadNetworkData();
        this.initializeNetworkTopology();
    }
    
    // Initialize Alerts Section
    initializeAlertsSection() {
        console.log('Initializing Alerts Section');
        this.loadAlertsData();
    }
    
    // Load Threats Data
    async loadThreatsData() {
        try {
            const response = await fetch('/api/threats');
            const threats = await response.json();
            
            // Update threat statistics
            const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
            threats.forEach(threat => {
                severityCounts[threat.severity.toLowerCase()]++;
            });
            
            document.getElementById('critical-threats').textContent = severityCounts.critical;
            document.getElementById('high-threats').textContent = severityCounts.high;
            document.getElementById('medium-threats').textContent = severityCounts.medium;
            document.getElementById('low-threats').textContent = severityCounts.low;
            
            // Populate threats table
            this.populateThreatsTable(threats);
            
        } catch (error) {
            console.error('Failed to load threats data:', error);
        }
    }
    
    // Load Network Data
    async loadNetworkData() {
        try {
            const response = await fetch('/api/connections');
            const connections = await response.json();
            
            document.getElementById('total-connections').textContent = connections.length;
            document.getElementById('secure-connections').textContent = 
                connections.filter(c => c.protocol === 'HTTPS').length;
            
            this.populateConnectionsTable(connections);
            
        } catch (error) {
            console.error('Failed to load network data:', error);
        }
    }
    
    // Load Alerts Data
    async loadAlertsData() {
        try {
            const response = await fetch('/api/alerts');
            const alerts = await response.json();
            
            const today = new Date().toDateString();
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const unreadAlerts = alerts.filter(a => !a.acknowledged).length;
            const todayAlerts = alerts.filter(a => 
                new Date(a.timestamp).toDateString() === today
            ).length;
            const weekAlerts = alerts.filter(a => 
                new Date(a.timestamp) >= weekAgo
            ).length;
            
            document.getElementById('unread-alerts').textContent = unreadAlerts;
            document.getElementById('today-alerts').textContent = todayAlerts;
            document.getElementById('week-alerts').textContent = weekAlerts;
            
            this.populateAlertFeed(alerts);
            
        } catch (error) {
            console.error('Failed to load alerts data:', error);
        }
    }
    
    // Populate Tables and Lists
    populateThreatsTable(threats) {
        const tbody = document.getElementById('threats-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        threats.slice(0, 20).forEach(threat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="severity-badge ${threat.severity.toLowerCase()}">${threat.severity}</span></td>
                <td>${threat.type}</td>
                <td>${threat.source}</td>
                <td>${threat.target || 'N/A'}</td>
                <td>${new Date(threat.timestamp).toLocaleString()}</td>
                <td><span class="status-badge ${threat.status.toLowerCase()}">${threat.status}</span></td>
                <td>
                    <button class="action-btn">Block</button>
                    <button class="action-btn">Investigate</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    populateConnectionsTable(connections) {
        const tbody = document.getElementById('connections-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        connections.slice(0, 20).forEach(conn => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conn.protocol}</td>
                <td>${conn.local_address}</td>
                <td>${conn.remote_address}</td>
                <td><span class="status-badge ${conn.status.toLowerCase()}">${conn.status}</span></td>
                <td>${conn.duration || 'N/A'}</td>
                <td>${conn.bytes_sent || 0} / ${conn.bytes_received || 0}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    populateAlertFeed(alerts) {
        const feed = document.getElementById('alert-feed');
        if (!feed) return;
        
        feed.innerHTML = '';
        alerts.slice(0, 50).forEach(alert => {
            const item = this.createAlertItem(alert);
            feed.appendChild(item);
        });
    }
    
    // Initialize Network Topology
    initializeNetworkTopology() {
        const canvas = document.getElementById('network-topology');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;
        
        // Simple network topology visualization
        const drawTopology = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw network nodes and connections
            const nodes = [
                { x: canvas.width * 0.5, y: canvas.height * 0.2, label: 'Router', type: 'router' },
                { x: canvas.width * 0.2, y: canvas.height * 0.6, label: 'Server', type: 'server' },
                { x: canvas.width * 0.8, y: canvas.height * 0.6, label: 'Firewall', type: 'firewall' },
                { x: canvas.width * 0.5, y: canvas.height * 0.8, label: 'Switch', type: 'switch' }
            ];
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
            ctx.lineWidth = 2;
            nodes.forEach((node, i) => {
                nodes.slice(i + 1).forEach(otherNode => {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                });
            });
            
            // Draw nodes
            nodes.forEach(node => {
                ctx.fillStyle = this.getNodeColor(node.type);
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw labels
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + 35);
            });
        };
        
        drawTopology();
    }
    
    getNodeColor(type) {
        const colors = {
            'router': '#00d4ff',
            'server': '#00ff88',
            'firewall': '#ff3366',
            'switch': '#ff8800'
        };
        return colors[type] || '#ffffff';
    }
    
    // Chart Initialization
    initializeCharts() {
        this.initializeMiniCharts();
        this.initializeThreatRadar();
        this.initializePerformanceChart();
        this.initializeNetworkMap();
    }
    
    // Mini Charts for Stat Cards
    initializeMiniCharts() {
        const chartConfigs = [
            { id: 'threat-chart', color: '#ff3366', data: this.generateSparklineData() },
            { id: 'alert-chart', color: '#ff8800', data: this.generateSparklineData() },
            { id: 'network-chart', color: '#00ff88', data: this.generateSparklineData() },
            { id: 'uptime-chart', color: '#00d4ff', data: this.generateSparklineData() }
        ];
        
        chartConfigs.forEach(config => {
            const canvas = document.getElementById(config.id);
            if (canvas) {
                this.drawSparkline(canvas, config.data, config.color);
            }
        });
    }
    
    // Sparkline Chart Drawing
    drawSparkline(canvas, data, color) {
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 40;
        
        const width = canvas.width;
        const height = canvas.height;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.stroke();
    }
    
    // Generate Sample Data
    generateSparklineData() {
        return Array.from({ length: 20 }, () => Math.random() * 100);
    }
    
    // Threat Radar Initialization
    initializeThreatRadar() {
        const canvas = document.getElementById('threat-radar');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const drawRadar = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw radar circles
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
            ctx.lineWidth = 1;
            
            for (let i = 1; i <= 4; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, (radius / 4) * i, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
            // Draw radar lines
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * radius,
                    centerY + Math.sin(angle) * radius
                );
                ctx.stroke();
            }
            
            // Draw threat points
            this.drawThreatPoints(ctx, centerX, centerY, radius);
            
            // Draw scanning line
            this.drawScanningLine(ctx, centerX, centerY, radius);
        };
        
        // Animate radar
        let scanAngle = 0;
        const animateRadar = () => {
            drawRadar();
            scanAngle += 0.02;
            requestAnimationFrame(animateRadar);
        };
        
        animateRadar();
    }
    
    // Draw Threat Points on Radar
    drawThreatPoints(ctx, centerX, centerY, radius) {
        const threats = [
            { angle: 0.5, distance: 0.7, severity: 'critical' },
            { angle: 1.2, distance: 0.4, severity: 'high' },
            { angle: 2.1, distance: 0.8, severity: 'medium' },
            { angle: 3.8, distance: 0.3, severity: 'high' },
            { angle: 4.7, distance: 0.6, severity: 'critical' },
            { angle: 5.9, distance: 0.5, severity: 'medium' }
        ];
        
        threats.forEach(threat => {
            const x = centerX + Math.cos(threat.angle) * (radius * threat.distance);
            const y = centerY + Math.sin(threat.angle) * (radius * threat.distance);
            
            let color;
            switch (threat.severity) {
                case 'critical': color = '#ff3366'; break;
                case 'high': color = '#ff8800'; break;
                case 'medium': color = '#00d4ff'; break;
                default: color = '#00ff88';
            }
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    // Draw Scanning Line
    drawScanningLine(ctx, centerX, centerY, radius) {
        const time = Date.now() * 0.001;
        const angle = time % (Math.PI * 2);
        
        const gradient = ctx.createLinearGradient(
            centerX,
            centerY,
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
    }
    
    // Performance Chart
    initializePerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 150;
        
        const drawPerformanceChart = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const data = {
                cpu: this.generateTimeSeriesData(),
                memory: this.generateTimeSeriesData(),
                network: this.generateTimeSeriesData()
            };
            
            this.drawTimeSeriesLine(ctx, data.cpu, '#00d4ff', canvas.width, canvas.height);
            this.drawTimeSeriesLine(ctx, data.memory, '#ff8800', canvas.width, canvas.height);
            this.drawTimeSeriesLine(ctx, data.network, '#00ff88', canvas.width, canvas.height);
        };
        
        drawPerformanceChart();
        
        // Update chart periodically
        setInterval(drawPerformanceChart, 5000);
    }
    
    // Network Map
    initializeNetworkMap() {
        const canvas = document.getElementById('network-map');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 200;
        
        const nodes = this.generateNetworkNodes();
        
        const drawNetworkMap = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
            ctx.lineWidth = 1;
            
            nodes.forEach((node, i) => {
                nodes.forEach((otherNode, j) => {
                    if (i !== j && Math.random() > 0.7) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.stroke();
                    }
                });
            });
            
            // Draw nodes
            nodes.forEach(node => {
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // Animate nodes
                node.x += node.dx;
                node.y += node.dy;
                
                if (node.x <= 0 || node.x >= canvas.width) node.dx *= -1;
                if (node.y <= 0 || node.y >= canvas.height) node.dy *= -1;
            });
        };
        
        const animateNetwork = () => {
            drawNetworkMap();
            requestAnimationFrame(animateNetwork);
        };
        
        animateNetwork();
    }
    
    // Generate Network Nodes
    generateNetworkNodes() {
        const nodes = [];
        const colors = ['#00d4ff', '#00ff88', '#ff8800', '#ff3366'];
        
        for (let i = 0; i < 15; i++) {
            nodes.push({
                x: Math.random() * 400,
                y: Math.random() * 180,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5
            });
        }
        
        return nodes;
    }
    
    // Real-time Data Updates - ENABLED
    startRealTimeUpdates() {
        console.log('� Starting real-time data updates');
        
        this.updateInterval = setInterval(() => {
            this.updateStatistics();
            this.updateThreatList();
            this.updateAlertStream();
            this.updateConnectionList();
            this.updateSystemLogs();
            this.updatePerformanceMetrics();
        }, 5000);
        
        // Initial update
        this.updateStatistics();
        this.updateThreatList();
        this.updateAlertStream();
        this.updateConnectionList();
        this.updateSystemLogs();
    }
    
    // Update Statistics
    async updateStatistics() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            // Update stat values with animation
            this.animateValue('threat-count', data.threats_detected);
            this.animateValue('alert-count', data.alerts);
            this.animateValue('connection-count', data.active_connections);
            
        } catch (error) {
            console.error('Failed to update statistics:', error);
        }
    }
    
    // Animate Value Changes - FIXED VERSION
    animateValue(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Ensure targetValue is positive
        targetValue = Math.max(0, Math.abs(targetValue));
        
        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        
        // If values are the same, no animation needed
        if (currentValue === targetValue) return;
        
        const difference = targetValue - currentValue;
        const steps = 20; // Number of animation steps
        const stepValue = difference / steps;
        const stepDuration = 50; // ms per step
        
        let current = currentValue;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            if (step >= steps) {
                current = targetValue;
                clearInterval(timer);
            } else {
                current += stepValue;
            }
            
            // Ensure current is never negative
            current = Math.max(0, Math.round(current));
            element.textContent = current.toLocaleString();
            
        }, stepDuration);
    }
    
    // Update Threat List
    async updateThreatList() {
        try {
            const response = await fetch('/api/threats');
            const threats = await response.json();
            
            const threatList = document.getElementById('threat-list');
            if (!threatList) return;
            
            threatList.innerHTML = '';
            
            threats.slice(0, 5).forEach((threat, index) => {
                const threatItem = this.createThreatItem(threat);
                threatItem.style.animationDelay = `${index * 0.1}s`;
                threatList.appendChild(threatItem);
            });
            
        } catch (error) {
            console.error('Failed to update threat list:', error);
        }
    }
    
    // Create Threat Item
    createThreatItem(threat) {
        const item = document.createElement('div');
        item.className = 'threat-item fade-in';
        item.innerHTML = `
            <div class="threat-indicator ${threat.severity.toLowerCase()}"></div>
            <div class="threat-info">
                <div class="threat-type">${threat.type}</div>
                <div class="threat-source">${threat.source}</div>
                <div class="threat-time">${new Date(threat.timestamp).toLocaleTimeString()}</div>
            </div>
            <div class="threat-status ${threat.status.toLowerCase()}">${threat.status}</div>
        `;
        
        item.addEventListener('click', () => this.showThreatDetails(threat));
        
        return item;
    }
    
    // Update Alert Stream
    async updateAlertStream() {
        try {
            const response = await fetch('/api/alerts');
            const alerts = await response.json();
            
            const alertStream = document.getElementById('alert-stream');
            const alertCount = document.getElementById('live-alert-count');
            
            if (alertCount) {
                alertCount.textContent = alerts.length;
            }
            
            if (!alertStream) return;
            
            alertStream.innerHTML = '';
            
            alerts.slice(0, 10).forEach((alert, index) => {
                const alertItem = this.createAlertItem(alert);
                alertItem.style.animationDelay = `${index * 0.05}s`;
                alertStream.appendChild(alertItem);
            });
            
        } catch (error) {
            console.error('Failed to update alert stream:', error);
        }
    }
    
    // Create Alert Item
    createAlertItem(alert) {
        const item = document.createElement('div');
        item.className = `alert-item fade-in severity-${alert.severity.toLowerCase()}`;
        item.innerHTML = `
            <div class="alert-icon">
                <i class="fas ${this.getAlertIcon(alert.severity)}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${new Date(alert.timestamp).toLocaleString()}</div>
            </div>
            <div class="alert-actions">
                ${!alert.acknowledged ? '<button class="btn-acknowledge">ACK</button>' : '<span class="acknowledged">✓</span>'}
            </div>
        `;
        
        return item;
    }
    
    // Get Alert Icon
    getAlertIcon(severity) {
        const icons = {
            critical: 'fa-exclamation-circle',
            high: 'fa-exclamation-triangle',
            medium: 'fa-info-circle',
            low: 'fa-check-circle'
        };
        return icons[severity.toLowerCase()] || 'fa-info-circle';
    }
    
    // Update Connection List
    async updateConnectionList() {
        try {
            const response = await fetch('/api/connections');
            const connections = await response.json();
            
            const connectionList = document.getElementById('connection-list');
            if (!connectionList) return;
            
            connectionList.innerHTML = '';
            
            connections.slice(0, 8).forEach((conn, index) => {
                const connItem = this.createConnectionItem(conn);
                connItem.style.animationDelay = `${index * 0.02}s`;
                connectionList.appendChild(connItem);
            });
            
        } catch (error) {
            console.error('Failed to update connection list:', error);
        }
    }
    
    // Create Connection Item
    createConnectionItem(connection) {
        const item = document.createElement('div');
        item.className = 'connection-item fade-in';
        item.innerHTML = `
            <div class="connection-info">
                <span class="connection-source">${connection.source}</span>
                <span class="connection-arrow">→</span>
                <span class="connection-destination">${connection.destination}:${connection.port}</span>
            </div>
            <div class="connection-status ${connection.status.toLowerCase()}">${connection.status}</div>
            <div class="connection-data">
                <span class="data-sent">${this.formatBytes(connection.bytes_sent)}</span>
                <span class="data-received">${this.formatBytes(connection.bytes_received)}</span>
            </div>
        `;
        
        return item;
    }
    
    // Update System Logs
    async updateSystemLogs() {
        try {
            const response = await fetch('/api/logs');
            const logs = await response.json();
            
            const logContainer = document.getElementById('log-container');
            if (!logContainer) return;
            
            logContainer.innerHTML = '';
            
            logs.forEach((log, index) => {
                const logItem = this.createLogItem(log);
                logItem.style.animationDelay = `${index * 0.01}s`;
                logContainer.appendChild(logItem);
            });
            
        } catch (error) {
            console.error('Failed to update system logs:', error);
        }
    }
    
    // Create Log Item
    createLogItem(log) {
        const item = document.createElement('div');
        item.className = `log-item fade-in log-${log.level.toLowerCase()}`;
        item.innerHTML = `
            <div class="log-time">${new Date(log.timestamp).toLocaleString()}</div>
            <div class="log-level ${log.level.toLowerCase()}">${log.level}</div>
            <div class="log-source">${log.source}</div>
            <div class="log-message">${log.message}</div>
        `;
        
        return item;
    }
    
    // Update Performance Metrics
    updatePerformanceMetrics() {
        const metrics = {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 100,
            disk: Math.random() * 100
        };
        
        Object.entries(metrics).forEach(([key, value]) => {
            const bar = document.getElementById(`${key}-usage`);
            const valueElement = bar?.parentElement?.querySelector('.metric-value');
            
            if (bar) {
                bar.style.width = `${value}%`;
                // Update color based on value
                if (value > 80) {
                    bar.style.background = 'linear-gradient(45deg, #ff3366, #ff6b3d)';
                } else if (value > 60) {
                    bar.style.background = 'linear-gradient(45deg, #ff8800, #ffaa00)';
                } else {
                    bar.style.background = 'linear-gradient(45deg, #00d4ff, #00ffff)';
                }
            }
            
            if (valueElement) {
                valueElement.textContent = `${Math.round(value)}%`;
            }
        });
        
        // Update network speeds
        const uploadSpeed = document.getElementById('upload-speed');
        const downloadSpeed = document.getElementById('download-speed');
        
        if (uploadSpeed) {
            uploadSpeed.textContent = `${(Math.random() * 100).toFixed(1)} MB/s`;
        }
        
        if (downloadSpeed) {
            downloadSpeed.textContent = `${(Math.random() * 500).toFixed(1)} MB/s`;
        }
    }
    
    // Utility Functions
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
    }
    
    generateTimeSeriesData() {
        return Array.from({ length: 50 }, (_, i) => ({
            x: i,
            y: Math.random() * 100
        }));
    }
    
    drawTimeSeriesLine(ctx, data, color, width, height) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = (point.x / (data.length - 1)) * width;
            const y = height - (point.y / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
    
    // Modal System
    initializeModal() {
        const modal = document.getElementById('detail-modal');
        const closeBtn = document.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }
    }
    
    showModal(title, content) {
        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            modal.style.display = 'block';
        }
    }
    
    hideModal() {
        const modal = document.getElementById('detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Stat Card Animation
    animateStatCard(card, hover) {
        const icon = card.querySelector('.stat-icon');
        const value = card.querySelector('.stat-value');
        
        if (hover) {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.opacity = '0.8';
            }
            if (value) {
                value.style.textShadow = '0 0 30px currentColor';
            }
        } else {
            if (icon) {
                icon.style.transform = '';
                icon.style.opacity = '';
            }
            if (value) {
                value.style.textShadow = '';
            }
        }
    }
    
    // Show Stat Details
    showStatDetails(card) {
        const statLabel = card.querySelector('.stat-label')?.textContent || 'Statistics';
        const statValue = card.querySelector('.stat-value')?.textContent || '0';
        
        const content = `
            <div class="stat-detail">
                <h3>${statLabel}</h3>
                <div class="stat-detail-value">${statValue}</div>
                <div class="stat-detail-chart">
                    <canvas id="detail-chart" width="400" height="200"></canvas>
                </div>
                <div class="stat-detail-info">
                    <p>Detailed analytics and trends for ${statLabel.toLowerCase()}.</p>
                    <p>Real-time monitoring and historical data analysis.</p>
                </div>
            </div>
        `;
        
        this.showModal(`${statLabel} Details`, content);
        
        // Initialize detail chart
        setTimeout(() => {
            const detailCanvas = document.getElementById('detail-chart');
            if (detailCanvas) {
                this.drawDetailChart(detailCanvas);
            }
        }, 100);
    }
    
    drawDetailChart(canvas) {
        const ctx = canvas.getContext('2d');
        const data = this.generateTimeSeriesData();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (canvas.height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        for (let i = 0; i <= 20; i++) {
            const x = (canvas.width / 20) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw data line
        this.drawTimeSeriesLine(ctx, data, '#00d4ff', canvas.width, canvas.height);
    }
    
    // Handle Control Actions
    handleControlAction(button) {
        const action = button.title || 'Unknown Action';
        
        // Add click animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        console.log('Control Action:', action);
        
        // Handle specific actions
        if (action === 'Refresh') {
            this.refreshData();
        }
    }
    
    // Refresh All Data
    refreshData() {
        console.log('🔄 Refreshing all data...');
        
        // Show loading animation on all panels
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.style.opacity = '0.5';
        });
        
        // Refresh data
        this.updateStatistics();
        this.updateThreatList();
        this.updateAlertStream();
        this.updateConnectionList();
        this.updateSystemLogs();
        this.updatePerformanceMetrics();
        
        // Remove loading animation
        setTimeout(() => {
            document.querySelectorAll('.panel-content').forEach(panel => {
                panel.style.opacity = '';
            });
        }, 1000);
    }
    
    // Cleanup on page unload
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.websocketConnection) {
            this.websocketConnection.close();
        }
    }
}

// Initialize the dashboard when the script loads
const dashboard = new ModernDashboard();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    dashboard.destroy();
});

// Add some additional CSS dynamically for complex animations
const additionalStyles = `
<style>
.threat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    margin-bottom: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border-left: 3px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
}

.threat-item:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
}

.threat-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: threatPulse 2s ease-in-out infinite;
}

.threat-indicator.critical {
    background: #ff3366;
    box-shadow: 0 0 15px #ff3366;
}

.threat-indicator.high {
    background: #ff8800;
    box-shadow: 0 0 15px #ff8800;
}

.threat-indicator.medium {
    background: #00d4ff;
    box-shadow: 0 0 15px #00d4ff;
}

.threat-info {
    flex: 1;
}

.threat-type {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
}

.threat-source {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-family: monospace;
}

.threat-time {
    font-size: 0.7rem;
    color: var(--text-muted);
}

.threat-status {
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
}

.threat-status.active {
    background: rgba(255, 51, 102, 0.2);
    color: #ff3366;
}

.threat-status.blocked {
    background: rgba(255, 136, 0, 0.2);
    color: #ff8800;
}

.threat-status.monitoring {
    background: rgba(0, 212, 255, 0.2);
    color: #00d4ff;
}

.alert-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.8rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border-left: 3px solid transparent;
    transition: all 0.3s ease;
}

.alert-item.severity-critical {
    border-left-color: #ff3366;
}

.alert-item.severity-high {
    border-left-color: #ff8800;
}

.alert-item.severity-medium {
    border-left-color: #00d4ff;
}

.alert-item.severity-low {
    border-left-color: #00ff88;
}

.alert-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
}

.severity-critical .alert-icon {
    background: rgba(255, 51, 102, 0.2);
    color: #ff3366;
}

.severity-high .alert-icon {
    background: rgba(255, 136, 0, 0.2);
    color: #ff8800;
}

.severity-medium .alert-icon {
    background: rgba(0, 212, 255, 0.2);
    color: #00d4ff;
}

.severity-low .alert-icon {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
}

.alert-content {
    flex: 1;
}

.alert-message {
    font-size: 0.9rem;
    color: var(--text-primary);
    margin-bottom: 0.3rem;
    line-height: 1.4;
}

.alert-time {
    font-size: 0.7rem;
    color: var(--text-muted);
}

.btn-acknowledge {
    background: rgba(0, 255, 136, 0.2);
    border: 1px solid rgba(0, 255, 136, 0.3);
    color: #00ff88;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-acknowledge:hover {
    background: rgba(0, 255, 136, 0.3);
}

.acknowledged {
    color: #00ff88;
    font-size: 1rem;
}

.connection-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem;
    margin-bottom: 0.3rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 6px;
    font-size: 0.8rem;
}

.connection-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.connection-source,
.connection-destination {
    font-family: monospace;
    color: var(--text-secondary);
}

.connection-arrow {
    color: var(--accent-cyan);
}

.connection-status {
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
}

.connection-status.established {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
}

.connection-status.listening {
    background: rgba(0, 212, 255, 0.2);
    color: #00d4ff;
}

.connection-status.time_wait {
    background: rgba(255, 136, 0, 0.2);
    color: #ff8800;
}

.connection-data {
    display: flex;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: var(--text-muted);
}

.log-item {
    display: grid;
    grid-template-columns: 120px 60px 80px 1fr;
    gap: 1rem;
    padding: 0.6rem;
    margin-bottom: 0.2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    font-size: 0.8rem;
    align-items: center;
}

.log-time {
    color: var(--text-muted);
    font-size: 0.7rem;
    font-family: monospace;
}

.log-level {
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    font-size: 0.6rem;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
}

.log-level.info {
    background: rgba(0, 212, 255, 0.2);
    color: #00d4ff;
}

.log-level.warning {
    background: rgba(255, 136, 0, 0.2);
    color: #ff8800;
}

.log-level.error {
    background: rgba(255, 51, 102, 0.2);
    color: #ff3366;
}

.log-level.critical {
    background: rgba(255, 51, 102, 0.3);
    color: #ff3366;
    animation: logCritical 1s ease-in-out infinite alternate;
}

.log-source {
    color: var(--text-secondary);
    font-size: 0.7rem;
}

.log-message {
    color: var(--text-primary);
    line-height: 1.3;
}

@keyframes threatPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.9); }
}

@keyframes logCritical {
    from { background: rgba(255, 51, 102, 0.3); }
    to { background: rgba(255, 51, 102, 0.5); }
}

.stat-detail {
    text-align: center;
}

.stat-detail-value {
    font-family: 'Orbitron', monospace;
    font-size: 3rem;
    font-weight: 900;
    color: var(--accent-cyan);
    text-shadow: 0 0 20px var(--accent-cyan);
    margin: 1rem 0;
}

.stat-detail-chart {
    margin: 2rem 0;
}

.stat-detail-info {
    text-align: left;
    color: var(--text-secondary);
    line-height: 1.6;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
