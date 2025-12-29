/* =============================================
   CALCULATOR PRO 3D - FULL JAVASCRIPT ENGINE
   Three.js 3D Background + Complete Calculator
============================================= */

// =============================================
// THREE.JS 3D PARTICLE BACKGROUND
// =============================================

class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });

        this.particles = null;
        this.geometricShapes = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Camera position
        this.camera.position.z = 50;

        // Create particles
        this.createParticles();

        // Create geometric shapes
        this.createGeometricShapes();

        // Add lighting
        this.addLighting();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Start animation
        this.animate();
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 1500 : 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            { r: 0, g: 0.83, b: 1 },      // Cyan
            { r: 0.48, g: 0.18, b: 1 },   // Purple
            { r: 0, g: 1, b: 0.8 },       // Turquoise
            { r: 1, g: 0.4, b: 0.7 }      // Pink
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Position (spread in 3D space)
            positions[i3] = (Math.random() - 0.5) * 150;
            positions[i3 + 1] = (Math.random() - 0.5) * 150;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for particles
        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometricShapes() {
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(3, 0), position: { x: -30, y: 20, z: -20 } },
            { geometry: new THREE.OctahedronGeometry(2.5, 0), position: { x: 35, y: -15, z: -15 } },
            { geometry: new THREE.TetrahedronGeometry(2, 0), position: { x: -25, y: -25, z: -25 } },
            { geometry: new THREE.IcosahedronGeometry(2, 0), position: { x: 40, y: 25, z: -30 } },
            { geometry: new THREE.DodecahedronGeometry(1.8, 0), position: { x: 0, y: 35, z: -20 } }
        ];

        shapes.forEach((shape, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: index % 2 === 0 ? 0x00d4ff : 0x7b2fff,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });

            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.set(shape.position.x, shape.position.y, shape.position.z);
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatOffset: Math.random() * Math.PI * 2
            };

            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        });
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x7b2fff, 1, 100);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.01;

        // Animate particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                // Wave motion
                positions[i + 1] += Math.sin(this.time + positions[i] * 0.01) * 0.02;

                // Mouse influence
                positions[i] += this.mouse.x * 0.01;
                positions[i + 1] += this.mouse.y * 0.01;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.rotation.y += 0.0005;
            this.particles.rotation.x += 0.0002;
        }

        // Animate geometric shapes
        this.geometricShapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Floating motion
            shape.position.y += Math.sin(this.time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
        });

        // Camera subtle movement
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// =============================================
// CALCULATOR ENGINE
// =============================================

class CalculatorEngine {
    constructor() {
        // DOM Elements
        this.mainDisplay = document.getElementById('mainDisplay');
        this.expressionDisplay = document.getElementById('expressionDisplay');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.programmerInfo = document.getElementById('programmerInfo');

        // Display values
        this.hexValue = document.getElementById('hexValue');
        this.decValue = document.getElementById('decValue');
        this.octValue = document.getElementById('octValue');
        this.binValue = document.getElementById('binValue');

        // Calculator state
        this.currentValue = '0';
        this.previousValue = '';
        this.currentOperator = null;
        this.waitingForOperand = false;
        this.expression = '';
        this.memory = 0;
        this.hasMemory = false;
        this.history = [];
        this.maxHistory = 50;

        // Mode state
        this.currentMode = 'basic';
        this.isDegrees = true;
        this.isSecondFunction = false;
        this.currentBase = 'dec';

        // Initialize
        this.init();
    }

    init() {
        this.loadHistory();
        this.loadTheme();
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Calculator buttons
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });

        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchMode(e.currentTarget.dataset.mode));
        });

        // Base buttons (programmer mode)
        document.querySelectorAll('.base-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchBase(e.currentTarget.dataset.base));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // History toggle
        document.getElementById('historyToggle').addEventListener('click', () => this.toggleHistory());

        // Close history button
        const closeHistoryBtn = document.getElementById('closeHistory');
        if (closeHistoryBtn) {
            closeHistoryBtn.addEventListener('click', () => this.closeHistory());
        }

        // History backdrop click to close
        const historyBackdrop = document.getElementById('historyBackdrop');
        if (historyBackdrop) {
            historyBackdrop.addEventListener('click', () => this.closeHistory());
        }

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButtonClick(e) {
        const btn = e.currentTarget;
        const value = btn.dataset.value;
        const action = btn.dataset.action;
        const base = btn.dataset.base;

        // Animate button
        this.animateButton(btn);

        if (value !== undefined) {
            this.inputNumber(value);
        } else if (action !== undefined) {
            this.handleAction(action);
        } else if (base !== undefined) {
            this.switchBase(base);
        }
    }

    animateButton(btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }

    inputNumber(value) {
        // Handle hex digits in programmer mode
        if (this.currentMode === 'programmer') {
            const hexDigits = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (hexDigits.includes(value) && this.currentBase !== 'hex') {
                return;
            }

            // Validate based on current base
            if (!this.isValidDigitForBase(value)) {
                return;
            }
        }

        if (this.waitingForOperand) {
            this.currentValue = value === '.' ? '0.' : value;
            this.waitingForOperand = false;
        } else {
            // Prevent multiple decimals
            if (value === '.' && this.currentValue.includes('.')) {
                return;
            }

            // Replace initial 0 unless adding decimal
            if (this.currentValue === '0' && value !== '.') {
                this.currentValue = value;
            } else {
                this.currentValue += value;
            }
        }

        this.updateDisplay();
    }

    isValidDigitForBase(digit) {
        const baseValidDigits = {
            'bin': ['0', '1'],
            'oct': ['0', '1', '2', '3', '4', '5', '6', '7'],
            'dec': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
            'hex': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        };

        return baseValidDigits[this.currentBase].includes(digit);
    }

    handleAction(action) {
        switch (action) {
            // Clear operations
            case 'clear':
                this.clear();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;

            // Basic operators
            case '+':
            case '-':
            case '*':
            case '/':
                this.handleOperator(action);
                break;
            case '=':
                this.calculate();
                break;

            // Basic functions
            case 'negate':
                this.negate();
                break;
            case 'percent':
                this.percent();
                break;

            // Memory operations
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'm+':
                this.memoryAdd();
                break;
            case 'm-':
                this.memorySubtract();
                break;
            case 'ms':
                this.memoryStore();
                break;

            // Scientific functions
            case 'sin':
                this.scientificFunction('sin');
                break;
            case 'cos':
                this.scientificFunction('cos');
                break;
            case 'tan':
                this.scientificFunction('tan');
                break;
            case 'log':
                this.scientificFunction('log');
                break;
            case 'ln':
                this.scientificFunction('ln');
                break;
            case 'sqrt':
                this.scientificFunction('sqrt');
                break;
            case 'square':
                this.scientificFunction('square');
                break;
            case 'reciprocal':
                this.scientificFunction('reciprocal');
                break;
            case 'factorial':
                this.scientificFunction('factorial');
                break;
            case 'abs':
                this.scientificFunction('abs');
                break;
            case 'exp':
                this.scientificFunction('exp');
                break;
            case 'power':
                this.handleOperator('^');
                break;
            case '10x':
                this.scientificFunction('10x');
                break;
            case 'mod':
                this.handleOperator('%');
                break;

            // Constants
            case 'pi':
                this.insertConstant(Math.PI);
                break;
            case 'e':
                this.insertConstant(Math.E);
                break;

            // Parentheses
            case '(':
            case ')':
                this.handleParenthesis(action);
                break;

            // Degree/Radian toggle
            case 'deg':
                this.toggleDegrees();
                break;

            // Second function toggle
            case 'shift':
                this.toggleSecondFunction();
                break;

            // Programmer bitwise operations
            case 'and':
                this.handleOperator('&');
                break;
            case 'or':
                this.handleOperator('|');
                break;
            case 'xor':
                this.handleOperator('^');
                break;
            case 'not':
                this.bitwiseNot();
                break;
            case 'lsh':
                this.handleOperator('<<');
                break;
            case 'rsh':
                this.handleOperator('>>');
                break;
        }
    }

    handleOperator(operator) {
        const value = parseFloat(this.currentValue);

        if (this.previousValue !== '' && !this.waitingForOperand) {
            this.calculate(false);
        }

        this.expression = this.currentValue + ' ' + this.getOperatorSymbol(operator) + ' ';
        this.previousValue = this.currentValue;
        this.currentOperator = operator;
        this.waitingForOperand = true;

        this.updateDisplay();
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^',
            '%': 'mod',
            '&': 'AND',
            '|': 'OR',
            '<<': '<<',
            '>>': '>>'
        };
        return symbols[operator] || operator;
    }

    calculate(addToHistory = true) {
        if (this.previousValue === '' || this.currentOperator === null) {
            return;
        }

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        try {
            switch (this.currentOperator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Cannot divide by zero');
                    }
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                case '%':
                    result = prev % current;
                    break;
                case '&':
                    result = Math.floor(prev) & Math.floor(current);
                    break;
                case '|':
                    result = Math.floor(prev) | Math.floor(current);
                    break;
                case '<<':
                    result = Math.floor(prev) << Math.floor(current);
                    break;
                case '>>':
                    result = Math.floor(prev) >> Math.floor(current);
                    break;
                default:
                    return;
            }

            // Format result
            result = this.formatResult(result);

            // Add to history
            if (addToHistory) {
                const historyEntry = {
                    expression: `${this.previousValue} ${this.getOperatorSymbol(this.currentOperator)} ${this.currentValue}`,
                    result: result,
                    timestamp: Date.now()
                };
                this.addToHistory(historyEntry);
            }

            this.expression = '';
            this.currentValue = result.toString();
            this.previousValue = '';
            this.currentOperator = null;
            this.waitingForOperand = true;

        } catch (error) {
            this.showError(error.message);
            return;
        }

        this.updateDisplay();
    }

    formatResult(result) {
        // Handle very large or very small numbers
        if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
            return parseFloat(result.toExponential(10));
        }

        // Round to avoid floating point errors
        const rounded = Math.round(result * 1e12) / 1e12;

        // Convert to string and limit decimals
        let str = rounded.toString();
        if (str.includes('.') && str.split('.')[1].length > 12) {
            str = rounded.toFixed(12).replace(/\.?0+$/, '');
        }

        return parseFloat(str);
    }

    scientificFunction(func) {
        let value = parseFloat(this.currentValue);
        let result;
        let funcName = func;

        try {
            switch (func) {
                case 'sin':
                    result = this.isDegrees ? Math.sin(value * Math.PI / 180) : Math.sin(value);
                    break;
                case 'cos':
                    result = this.isDegrees ? Math.cos(value * Math.PI / 180) : Math.cos(value);
                    break;
                case 'tan':
                    const angle = this.isDegrees ? value * Math.PI / 180 : value;
                    if (Math.abs(Math.cos(angle)) < 1e-10) {
                        throw new Error('Undefined');
                    }
                    result = Math.tan(angle);
                    break;
                case 'log':
                    if (value <= 0) throw new Error('Invalid input');
                    result = Math.log10(value);
                    break;
                case 'ln':
                    if (value <= 0) throw new Error('Invalid input');
                    result = Math.log(value);
                    break;
                case 'sqrt':
                    if (value < 0) throw new Error('Invalid input');
                    result = Math.sqrt(value);
                    funcName = '√';
                    break;
                case 'square':
                    result = value * value;
                    funcName = 'sqr';
                    break;
                case 'reciprocal':
                    if (value === 0) throw new Error('Cannot divide by zero');
                    result = 1 / value;
                    funcName = '1/';
                    break;
                case 'factorial':
                    if (value < 0 || !Number.isInteger(value)) throw new Error('Invalid input');
                    if (value > 170) throw new Error('Overflow');
                    result = this.factorial(value);
                    funcName = 'fact';
                    break;
                case 'abs':
                    result = Math.abs(value);
                    break;
                case 'exp':
                    result = Math.exp(value);
                    break;
                case '10x':
                    result = Math.pow(10, value);
                    funcName = '10^';
                    break;
                default:
                    return;
            }

            result = this.formatResult(result);

            // Add to history
            const historyEntry = {
                expression: `${funcName}(${this.currentValue})`,
                result: result,
                timestamp: Date.now()
            };
            this.addToHistory(historyEntry);

            this.currentValue = result.toString();
            this.waitingForOperand = true;

        } catch (error) {
            this.showError(error.message);
            return;
        }

        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    insertConstant(value) {
        this.currentValue = value.toString();
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    handleParenthesis(paren) {
        // Simple parenthesis handling - in real implementation would use expression parser
        this.expression += paren;
        this.updateDisplay();
    }

    negate() {
        if (this.currentValue !== '0') {
            if (this.currentValue.startsWith('-')) {
                this.currentValue = this.currentValue.substring(1);
            } else {
                this.currentValue = '-' + this.currentValue;
            }
            this.updateDisplay();
        }
    }

    percent() {
        const value = parseFloat(this.currentValue);
        this.currentValue = (value / 100).toString();
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.currentOperator = null;
        this.waitingForOperand = false;
        this.expression = '';
        this.updateDisplay();
    }

    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    // Memory functions
    memoryClear() {
        this.memory = 0;
        this.hasMemory = false;
        this.updateMemoryIndicator();
    }

    memoryRecall() {
        if (this.hasMemory) {
            this.currentValue = this.memory.toString();
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.hasMemory = true;
        this.updateMemoryIndicator();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.hasMemory = true;
        this.updateMemoryIndicator();
    }

    memoryStore() {
        this.memory = parseFloat(this.currentValue);
        this.hasMemory = true;
        this.updateMemoryIndicator();
    }

    updateMemoryIndicator() {
        this.memoryIndicator.classList.toggle('active', this.hasMemory);
    }

    // Programmer mode functions
    bitwiseNot() {
        const value = Math.floor(parseFloat(this.currentValue));
        this.currentValue = (~value >>> 0).toString();
        this.updateDisplay();
    }

    switchBase(base) {
        // Update active button
        document.querySelectorAll('.base-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.base === base);
        });

        // Convert current value to new base
        const decValue = this.currentBase === 'dec'
            ? parseInt(this.currentValue)
            : parseInt(this.currentValue, this.getBaseRadix(this.currentBase));

        this.currentBase = base;

        // Update hex button availability
        this.updateHexButtons();

        // Convert and display
        this.currentValue = this.convertToBase(decValue, base);
        this.updateDisplay();
    }

    getBaseRadix(base) {
        const radix = { 'bin': 2, 'oct': 8, 'dec': 10, 'hex': 16 };
        return radix[base];
    }

    convertToBase(value, base) {
        if (isNaN(value)) return '0';
        const radix = this.getBaseRadix(base);
        return value.toString(radix).toUpperCase();
    }

    updateHexButtons() {
        const hexBtns = document.querySelectorAll('.hex-btn');
        hexBtns.forEach(btn => {
            btn.classList.toggle('disabled', this.currentBase !== 'hex');
        });
    }

    updateProgrammerDisplay() {
        const value = this.currentBase === 'dec'
            ? parseInt(this.currentValue)
            : parseInt(this.currentValue, this.getBaseRadix(this.currentBase));

        if (!isNaN(value)) {
            this.hexValue.textContent = value.toString(16).toUpperCase();
            this.decValue.textContent = value.toString(10);
            this.octValue.textContent = value.toString(8);
            this.binValue.textContent = value.toString(2);
        }
    }

    // Mode switching
    switchMode(mode) {
        this.currentMode = mode;

        // Update tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        // Update grids
        document.querySelectorAll('.button-grid').forEach(grid => {
            grid.classList.remove('active');
        });

        document.getElementById(`${mode}Grid`).classList.add('active');

        // Toggle programmer info
        this.programmerInfo.classList.toggle('active', mode === 'programmer');

        if (mode === 'programmer') {
            this.updateHexButtons();
            this.updateProgrammerDisplay();
        }

        // Reset to clean state
        this.clear();
    }

    toggleDegrees() {
        this.isDegrees = !this.isDegrees;
        const degBtn = document.getElementById('degBtn');
        degBtn.textContent = this.isDegrees ? 'DEG' : 'RAD';
    }

    toggleSecondFunction() {
        this.isSecondFunction = !this.isSecondFunction;
        document.getElementById('shiftBtn').classList.toggle('active', this.isSecondFunction);
        // Would update button labels for inverse functions
    }

    // Display update
    updateDisplay() {
        // Format display value with thousand separators for large numbers
        let displayValue = this.currentValue;

        if (this.currentMode !== 'programmer' && !displayValue.includes('e')) {
            const parts = displayValue.split('.');
            if (parts[0].length > 3 && !parts[0].includes('e')) {
                parts[0] = parseInt(parts[0]).toLocaleString('en-US');
                displayValue = parts.join('.');
            }
        }

        this.mainDisplay.textContent = displayValue;
        this.expressionDisplay.textContent = this.expression;

        // Update programmer display if in that mode
        if (this.currentMode === 'programmer') {
            this.updateProgrammerDisplay();
        }

        // Auto-scroll display
        this.mainDisplay.scrollLeft = this.mainDisplay.scrollWidth;
    }

    showError(message) {
        this.mainDisplay.classList.add('display-error');
        this.mainDisplay.textContent = message || 'Error';

        setTimeout(() => {
            this.mainDisplay.classList.remove('display-error');
            this.clear();
        }, 1500);
    }

    // Keyboard support
    handleKeyboard(e) {
        const key = e.key;

        // Prevent default for calculator keys
        if (/^[0-9+\-*/.=]$/.test(key) || ['Enter', 'Escape', 'Backspace', 'Delete'].includes(key)) {
            e.preventDefault();
        }

        // Numbers
        if (/^[0-9.]$/.test(key)) {
            this.inputNumber(key);
            this.highlightButton(`[data-value="${key}"]`);
        }

        // Operators
        const operatorMap = {
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            'x': '*',
            'X': '*'
        };

        if (operatorMap[key]) {
            this.handleAction(operatorMap[key]);
            this.highlightButton(`[data-action="${operatorMap[key]}"]`);
        }

        // Enter/Equals
        if (key === 'Enter' || key === '=') {
            this.calculate();
            this.highlightButton('[data-action="="]');
        }

        // Escape/Clear
        if (key === 'Escape') {
            this.clear();
            this.highlightButton('[data-action="clear"]');
        }

        // Backspace
        if (key === 'Backspace') {
            this.backspace();
            this.highlightButton('[data-action="backspace"]');
        }

        // Delete = Clear Entry
        if (key === 'Delete') {
            this.clearEntry();
            this.highlightButton('[data-action="ce"]');
        }
    }

    highlightButton(selector) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('keyboard-active');
            setTimeout(() => btn.classList.remove('keyboard-active'), 150);
        }
    }

    // History
    addToHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }
        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        try {
            localStorage.setItem('calcHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Could not save history to localStorage');
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('calcHistory');
            if (saved) {
                this.history = JSON.parse(saved);
                this.renderHistory();
            }
        } catch (e) {
            console.warn('Could not load history from localStorage');
        }
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');

        if (this.history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-calculator"></i>
                    <p>No calculations yet</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `).join('');

        // Add click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.currentValue = this.history[index].result.toString();
                this.waitingForOperand = true;
                this.updateDisplay();
            });
        });
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    toggleHistory() {
        const panel = document.getElementById('historyPanel');
        const backdrop = document.getElementById('historyBackdrop');
        const isActive = panel.classList.toggle('active');

        if (backdrop) {
            backdrop.classList.toggle('active', isActive);
        }

        // Prevent body scroll when panel is open on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = isActive ? 'hidden' : '';
        }
    }

    closeHistory() {
        const panel = document.getElementById('historyPanel');
        const backdrop = document.getElementById('historyBackdrop');

        panel.classList.remove('active');
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    // Theme
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');

        // Update icon
        const icon = document.querySelector('#themeToggle i');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';

        // Save preference
        localStorage.setItem('calcTheme', isLight ? 'light' : 'dark');
    }

    loadTheme() {
        const saved = localStorage.getItem('calcTheme');
        if (saved === 'light') {
            document.body.classList.add('light-theme');
            document.querySelector('#themeToggle i').className = 'fas fa-sun';
        }
    }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    const particleBg = new ParticleBackground();

    // Initialize calculator
    const calculator = new CalculatorEngine();

    // Set initial active grid
    document.getElementById('basicGrid').classList.add('active');

    // Add keyboard active styles
    const style = document.createElement('style');
    style.textContent = `
            .calc - btn.keyboard - active {
            transform: scale(0.95);
            filter: brightness(1.2);
        }
        `;
    document.head.appendChild(style);

    console.log('Calculator Pro 3D initialized successfully!');
});
