document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. CUSTOM MOUSE CURSOR
    // ==========================================
    const cursor = document.querySelector(".custom-cursor");

    if (cursor) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        document.addEventListener("mousedown", () => {
            cursor.classList.add("click");
        });

        document.addEventListener("mouseup", () => {
            cursor.classList.remove("click");
        });

        // Add cursor hover scaling for interactive elements
        function updateCursorListeners() {
            const clickables = document.querySelectorAll("a, button, .suggest-btn, .mock-run-btn, .slide-btn, #menu-toggle");
            clickables.forEach(item => {
                // Remove previous listeners to prevent duplication
                item.removeEventListener("mouseenter", handleMouseEnter);
                item.removeEventListener("mouseleave", handleMouseLeave);
                
                item.addEventListener("mouseenter", handleMouseEnter);
                item.addEventListener("mouseleave", handleMouseLeave);
            });
        }

        function handleMouseEnter() {
            cursor.style.width = "40px";
            cursor.style.height = "40px";
            cursor.style.borderColor = "var(--color-text-primary)";
            cursor.style.backgroundColor = "rgba(17, 17, 17, 0.05)";
        }

        function handleMouseLeave() {
            cursor.style.width = "20px";
            cursor.style.height = "20px";
            cursor.style.borderColor = "var(--color-red)";
            cursor.style.backgroundColor = "transparent";
        }

        updateCursorListeners();
        // Periodically refresh listeners for dynamically injected content
        setInterval(updateCursorListeners, 1000);
    }

    // ==========================================
    // 2. MOBILE NAVIGATION
    // ==========================================
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            nav.classList.toggle("active");
        });
    }

    // Scroll active link highlight & header shrinking
    const sections = document.querySelectorAll(".section");
    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.padding = "1rem 8%";
            header.style.background = "rgba(243, 239, 233, 0.95)";
            header.style.borderBottom = "1px solid rgba(17, 17, 17, 0.1)";
        } else {
            header.style.padding = "1.5rem 8%";
            header.style.background = "rgba(243, 239, 233, 0.85)";
            header.style.borderBottom = "1px solid rgba(17, 17, 17, 0.05)";
        }

        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (menuToggle && nav) {
                menuToggle.classList.remove("active");
                nav.classList.remove("active");
            }
        });
    });

    // ==========================================
    // 3. CANVAS PARTICLES NETWORK
    // ==========================================
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 30 : 70;
    const connectionDistance = 140;

    let mouse = { x: null, y: null, radius: 180 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(17, 17, 17, 0.15)";
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    let opacity = 1 - (dist / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(17, 17, 17, ${opacity * 0.08})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 4. PROFILE SLIDESHOW
    // ==========================================
    const slides = document.querySelectorAll(".profile-slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const indicator = document.querySelector(".slide-indicator");
    let currentSlide = 0;

    function updateSlideshow() {
        slides.forEach((slide, idx) => {
            slide.classList.remove("active");
            if (idx === currentSlide) {
                slide.classList.add("active");
            }
        });
        if (indicator) {
            indicator.textContent = `${currentSlide + 1} / ${slides.length}`;
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideshow();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlideshow();
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);
        setInterval(nextSlide, 6000);
    }

    // ==========================================
    // 5. GITHUB LIVE STATS LOADER (AJAX)
    // ==========================================
    async function loadGitHubStats() {
        const repoEl = document.getElementById('github-repos');
        const starEl = document.getElementById('github-stars');
        const followEl = document.getElementById('github-followers');
        const langEl = document.getElementById('github-lang');

        try {
            const res = await fetch('/api/github');
            if (res.ok) {
                const data = await res.json();
                if (repoEl) repoEl.textContent = data.public_repos;
                if (starEl) starEl.textContent = data.stars;
                if (followEl) followEl.textContent = data.followers;
                if (langEl) langEl.textContent = data.primary_language;
            }
        } catch (e) {
            console.error('Error fetching live GitHub statistics:', e);
        }
    }
    loadGitHubStats();

    // ==========================================
    // 6. CONTACT FORM BACKEND POST SUBMISSION
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const message = document.getElementById("form-msg").value.trim();

            if (!name || !email || !message) return;

            printTerminalLine(`Sending secure telemetry to backend api...`);

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();
                if (data.success) {
                    printTerminalLine(`[OK] ${data.message}`, "cmd-success");
                    alert(data.message);
                    contactForm.reset();
                } else {
                    printTerminalLine(`[ERROR] ${data.error}`, "cmd-error");
                    alert(data.error);
                }
            } catch (err) {
                console.error('Error submitting form:', err);
                printTerminalLine(`[ERROR] Transmission failure. Check server status.`, "cmd-error");
                alert("Could not connect to the backend server. Message failed to log.");
            }
        });
    }

    // ==========================================
    // 7. INTERACTIVE BASH TERMINAL
    // ==========================================
    const termInput = document.getElementById("terminal-input");
    const termBody = document.getElementById("terminal-body");

    if (termInput && termBody) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const inputVal = termInput.value.trim();
                termInput.value = "";
                executeCommand(inputVal);
            }
        });

        const termCard = document.querySelector(".terminal-card");
        if (termCard) {
            termCard.addEventListener("click", () => termInput.focus());
        }
    }

    function printTerminalLine(text, className = "") {
        const line = document.createElement("div");
        line.className = "terminal-line " + className;
        line.innerHTML = text;
        
        const promptLine = termBody.querySelector(".terminal-prompt-line");
        termBody.insertBefore(line, promptLine);
        termBody.scrollTop = termBody.scrollHeight;
    }

    function executeCommand(cmdStr) {
        printTerminalLine(`<span class="prompt">guest@tamaldey:~$</span> ${cmdStr}`);
        
        const tokens = cmdStr.split(" ");
        const cmd = tokens[0].toLowerCase();
        
        if (cmd === "") return;

        switch (cmd) {
            case "help":
                printTerminalLine("Available Commands:<br>" +
                    "  <span class='cmd-text'>about</span>       - Print brief biography of Tamal Dey<br>" +
                    "  <span class='cmd-text'>skills</span>      - Print detailed developer skill stack<br>" +
                    "  <span class='cmd-text'>experience</span>  - Display professional intern history<br>" +
                    "  <span class='cmd-text'>projects</span>    - List verified blockchain and full-stack projects<br>" +
                    "  <span class='cmd-text'>contact</span>     - Render social channels and contract info<br>" +
                    "  <span class='cmd-text'>message</span>     - Send direct feedback: message &lt;msg_content&gt;<br>" +
                    "  <span class='cmd-text'>clear</span>      - Clear terminal logs");
                break;
            case "about":
                printTerminalLine("System profile: Tamal Dey<br>" +
                    "Status: Computer Science Student (B.Tech UEM Jaipur expected 2028)<br>" +
                    "Specialties: Smart contracts development, Full-Stack node frameworks, IoT controller logic, AWS architectures.<br>" +
                    "Bio: Passionate about Web3 decentralized ecosystems, Parametric Smart Contracts, and low-latency smart grid networks.");
                break;
            case "skills":
                printTerminalLine("Languages:       Solidity, Move, Clarity, JavaScript, Java, SQL, Python<br>" +
                    "Frameworks:      React.js, Node.js, Spring Boot, Hardhat, Truffle<br>" +
                    "Cloud / IoT:     AWS Elastic Beanstalk, IPFS, Raspberry Pi Automation, GenAI Analytics Tools");
                break;
            case "experience":
                printTerminalLine("Internship Records:<br>" +
                    " - <span class='cmd-success'>TEN</span>: Software Engineer Intern (Active software setups and integrations)<br>" +
                    " - <span class='cmd-success'>TCS</span>: Data Visualization Intern (Empowering executives with dashboards)<br>" +
                    " - <span class='cmd-success'>AWS</span>: Solutions Architect (Elastic Beanstalk container structures design)<br>" +
                    " - <span class='cmd-success'>Tata Group</span>: GenAI Powered Analytics Simulation (Exploratory Data Analysis)<br>" +
                    " - <span class='cmd-success'>HPE</span>: Software Engineering Simulation (Spring Boot API server creation & unit testing)");
                break;
            case "projects":
                printTerminalLine("Verified Repositories:<br>" +
                    " 1. <span class='cmd-success'>DeFi-Insurance-Protocol</span> (Solidity) - Parametric weather claims settlement.<br>" +
                    " 2. <span class='cmd-success'>NFT-Art-Marketplace-</span> (Move) - Resource ownership bidding index.<br>" +
                    " 3. <span class='cmd-success'>NFTStakingContract</span> (Clarity) - Staking locks and token payouts on Bitcoin.<br>" +
                    " 4. <span class='cmd-success'>college_complain_box_plan</span> (JS) - Crypto ticketing complain record portal.<br>" +
                    " 5. <span class='cmd-success'>Kissan Helper</span> (Python/IoT) - Agri-automation sensor tracking organization.");
                break;
            case "contact":
                printTerminalLine("Link signals:<br>" +
                    " Email:      <a href='mailto:tamaldey728@gmail.com' style='color:var(--color-red)'>tamaldey728@gmail.com</a><br>" +
                    " GitHub:     <a href='https://github.com/tamaldey21' target='_blank' style='color:var(--color-red)'>github.com/tamaldey21</a><br>" +
                    " LinkedIn:   <a href='https://www.linkedin.com/in/tamal-dey-4a41761b2/' target='_blank' style='color:var(--color-red)'>linkedin.com/in/tamal-dey-4a41761b2/</a>");
                break;
            case "message":
                if (tokens.length < 2) {
                    printTerminalLine("Error: Please provide message content. Syntax: message &lt;msg&gt;", "cmd-error");
                } else {
                    const messageContent = tokens.slice(1).join(" ");
                    printTerminalLine(`Sending signal...`);
                    setTimeout(() => {
                        printTerminalLine(`[OK] Signal dispatched successfully! Response code: 200`, "cmd-success");
                        printTerminalLine(`Thank you! Your feedback has been cached.`, "cmd-text");
                    }, 800);
                }
                break;
            case "clear":
                const promptLine = termBody.querySelector(".terminal-prompt-line");
                termBody.innerHTML = "";
                termBody.appendChild(promptLine);
                break;
            default:
                printTerminalLine(`bash: command not found: ${cmd}. Type <span class='cmd-text'>help</span> for valid operations.`, "cmd-error");
        }
    }

    // ==========================================
    // 8. PROJECTS SIMULATION TERMINAL MODAL
    // ==========================================
    const mockButtons = document.querySelectorAll(".mock-run-btn");
    const terminalModal = document.getElementById("terminal-modal");
    const simOutput = document.getElementById("simulation-output");
    const closeModalBtn = document.querySelector(".close-modal-btn");

    if (mockButtons && terminalModal && simOutput) {
        mockButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const projectKey = btn.getAttribute("data-project");
                terminalModal.classList.add("active");
                simOutput.innerHTML = "";
                runSimulation(projectKey);
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            terminalModal.classList.remove("active");
        });
    }

    if (terminalModal) {
        terminalModal.addEventListener("click", (e) => {
            if (e.target === terminalModal) {
                terminalModal.classList.remove("active");
            }
        });
    }

    const simLogs = {
        "nft-staking": [
            "Initializing Bitcoin sovereign stacks node connection...",
            "Loading Clarity compiler... OK (version 2.1)",
            "Checking local context contract: nft-staking-v1.clar",
            "Compiling Clarity contract... Done.",
            "Deploying on layer Stacks 2.4 testnet... TxId: 0x93bd2af9210c4... SUCCESS",
            "Initializing contract variables...",
            "Checking user balances: Guest wallet address initialized.",
            "Executing contract call: (take-nft-stake u42)...",
            " -> Checking ERC-721 token ownership of asset #42... VALID",
            " -> Locking NFT into staking custody register...",
            " -> Setting reward multiplier based on block height #834,102...",
            "Transaction broadcast: OK (Status: Pending block confirmation)",
            "Block #834,103 mined. Reward tracking active. Payout accrual speed: 0.004 tokens/block",
            "Accruing block rewards...",
            "Executing contract call: (get-rewards-accrued)...",
            " -> Returns: u16000 (16.000 micro-STX token rewards equivalent)",
            "Simulation finished. Assert checks passed."
        ],
        "nft-marketplace": [
            "Booting Move Virtual Machine (Aptos-VM v1.4)...",
            "Reading Move.toml definitions and resource accounts...",
            "Verifying source files: marketplace.move, art_listing.move",
            "Running compiler checks...",
            "Move Compiler Output: 0 warnings, 0 errors.",
            "Executing Move Prover formal check... Passed contract safety bounds.",
            "Publishing module 0x4a7e93ab21::NFTMarketplace to blockchain address...",
            " -> Resource creation call: initialize_marketplace()...",
            " -> Listing active items: TokenAddress 0xf221a... Price: 25.5 APT",
            "Simulating buy transaction: purchase_art(buyer_sig, listing_id: u1002)...",
            " -> Verifying resource owner signature... MATCH",
            " -> Re-entrancy guards check... OK",
            " -> Safe transfer protocol: Withdraw 25.5 APT -> Deposit to Seller -> Transferred resource ownership",
            "Event Emitted: ListingCompleted { listing_id: u1002, buyer: 0x8a92... }",
            "Simulation completed. Resource transfer validated."
        ],
        "defi-insurance": [
            "Initializing Hardhat local Solidity task manager...",
            "Compiling contracts using solc 0.8.20 (optimizations enabled)...",
            "Solidity compiler complete: ParametricInsurance.sol",
            "Deploying contract mock oracle node connectors...",
            "Deployed: ParametricInsurance at 0x5FbDB2315678afecb367f032d93F642f64180aa3",
            "Simulating Parametric Crop Insurance event setup...",
            " -> Insured: Tamal Dey | Coverage: 10 ETH | Trigger: Drought Index > 85",
            "Mocking Oracle Weather API request to Chainlink node...",
            "Chainlink Request sent. Awaiting job callback...",
            " -> Mock response received: Weather Index Drought Value = 92.0",
            "Condition Evaluation: 92.0 > 85.0. Parametric settlement criteria: TRUE.",
            "Executing auto-pay claim routine...",
            " -> Interfacing OpenZeppelin ERC-20 transfer...",
            " -> Disbursing 10 ETH to policy owner wallet 0x3c44... SUCCESS",
            "Payout event logged: ParametricInsurancePayout(policy_id: 104, amount: 10 ETH)",
            "Simulation finished. Parametric settlement completed."
        ],
        "kissan-helper": [
            "Raspberry Pi Controller booting. Linux kernel v6.1 loaded.",
            "Initializing I2C connection and GPIO pins mapping...",
            "GPIO Pin 18 (Input) -> Soil Moisture Sensor v1.2",
            "GPIO Pin 22 (Output) -> Solenoid Relay Water Valve",
            "Running soil moisture analyzer script...",
            " -> Soil moisture level read: 28% (Critical dry threshold: < 35%)",
            " -> Temperature: 32.4 C | Humidity: 42%",
            "Loading Agriculture recommendation ML classifier (Python NLTK)...",
            "Classifier recommendation: WATER_REQUIRED_IMMEDIATELY",
            "Activating relay logic: GPIO.output(22, GPIO.HIGH)",
            " -> Solenoid valve open. Irrigation system activated.",
            "Awaiting target moisture level (45%)...",
            "Reading moisture values: 32%... 38%... 45%. Target reached.",
            "Deactivating relay logic: GPIO.output(22, GPIO.LOW)",
            " -> Solenoid valve closed. Irrigation system shutdown.",
            "AI Assistant telemetry report sent to agricultural database.",
            "Simulation completed. Irrigation cycle finished."
        ]
    };

    function runSimulation(projectKey) {
        const logs = simLogs[projectKey] || ["No simulation available."];
        let idx = 0;

        function printNextLog() {
            if (idx < logs.length) {
                const line = document.createElement("div");
                line.className = "terminal-line";
                line.textContent = logs[idx];
                
                if (logs[idx].includes("SUCCESS") || logs[idx].includes("verified") || logs[idx].includes("completed") || logs[idx].includes("finished")) {
                    line.style.color = "#4ade80";
                } else if (logs[idx].includes("Error") || logs[idx].includes("Critical")) {
                    line.style.color = "#ef4444";
                }
                
                simOutput.appendChild(line);
                simOutput.scrollTop = simOutput.scrollHeight;
                idx++;
                setTimeout(printNextLog, 450);
            }
        }
        printNextLog();
    }

    // ==========================================
    // 9. AI PORTFOLIO ASSISTANT CHATBOT (BACKEND QUERY)
    // ==========================================
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotPanel = document.getElementById("chatbot-panel");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotSendBtn = document.getElementById("chatbot-send-btn");
    const chatbotChat = document.getElementById("chatbot-chat");
    const suggestButtons = document.querySelectorAll(".suggest-btn");

    if (chatbotToggle && chatbotPanel) {
        chatbotToggle.addEventListener("click", () => {
            chatbotPanel.classList.toggle("active");
            const badge = chatbotToggle.querySelector(".chat-notify");
            if (badge) badge.style.display = "none";
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener("click", () => {
            chatbotPanel.classList.remove("active");
        });
    }

    suggestButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const question = btn.getAttribute("data-q");
            handleUserMessage(question);
        });
    });

    if (chatbotSendBtn && chatbotInput) {
        chatbotSendBtn.addEventListener("click", () => {
            const msg = chatbotInput.value.trim();
            if (msg !== "") {
                chatbotInput.value = "";
                handleUserMessage(msg);
            }
        });

        chatbotInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const msg = chatbotInput.value.trim();
                if (msg !== "") {
                    chatbotInput.value = "";
                    handleUserMessage(msg);
                }
            }
        });
    }

    function appendChatBubble(text, sender) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${sender}`;
        bubble.innerHTML = text;
        
        const suggestionsDiv = chatbotChat.querySelector(".chat-suggestions");
        if (suggestionsDiv) {
            chatbotChat.insertBefore(bubble, suggestionsDiv);
        } else {
            chatbotChat.appendChild(bubble);
        }
        chatbotChat.scrollTop = chatbotChat.scrollHeight;
    }

    async function handleUserMessage(msgText) {
        appendChatBubble(msgText, "user");
        
        const typingBubble = document.createElement("div");
        typingBubble.className = "chat-bubble bot typing-indicator-bubble";
        typingBubble.innerHTML = "Thinking...";
        
        const suggestionsDiv = chatbotChat.querySelector(".chat-suggestions");
        if (suggestionsDiv) {
            chatbotChat.insertBefore(typingBubble, suggestionsDiv);
        } else {
            chatbotChat.appendChild(typingBubble);
        }
        chatbotChat.scrollTop = chatbotChat.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msgText })
            });
            
            const data = await response.json();
            
            setTimeout(() => {
                typingBubble.remove();
                appendChatBubble(data.reply, "bot");
            }, 550);
            
        } catch (e) {
            console.error('Chat error:', e);
            setTimeout(() => {
                typingBubble.remove();
                appendChatBubble("Sorry, I had trouble connecting to the backend pilot server.", "bot");
            }, 550);
        }
    }

    // ==========================================
    // 10. MULTI-GAME MANAGER (3D STACK & 3D SNAKE)
    // ==========================================
    const gameCanvas = document.getElementById("game-canvas");
    const restartBtn = document.getElementById("restart-game-btn");
    const gameOverlay = document.getElementById("game-overlay");
    const scoreVal = document.getElementById("game-score");
    const highScoreVal = document.getElementById("game-highscore");
    const canvasWrapper = document.querySelector(".game-canvas-wrapper");
    const gameButtons = document.querySelectorAll(".game-selector .game-btn");
    const gameTitle = document.querySelector(".game-info h3");
    const gameDescs = document.querySelectorAll(".game-info .serif-text");
    
    if (gameCanvas) {
        const ctx = gameCanvas.getContext("2d");
        
        let score = 0;
        let stackHighScore = localStorage.getItem("stack_highscore") || 0;
        let snakeHighScore = localStorage.getItem("snake_highscore") || 0;
        
        let activeGame = "stack"; // "stack" | "snake"
        let gameState = "menu"; // "menu" | "playing" | "gameover"
        
        // Stack game variables
        let stack = [];
        let activeBlock = null;
        let fallingBlocks = [];
        let ripples = [];
        let perfectStreak = 0;
        
        // Snake game variables
        let snake = [];
        let direction = { x: 1, z: 0 };
        let nextDirection = { x: 1, z: 0 };
        let food = { x: 8, z: 5 };
        const gridSize = 12;
        const cellSize = 18;
        const startX = -99;
        const startZ = -99;
        let lastTickTime = 0;
        let tickRate = 200;
        let snakeHueOffset = 0;
        
        // Shared rendering camera
        let cameraY = 0;
        let targetCameraY = 0;
        const h = 20; // Stack block height
        const centerX = 200;
        const centerY = 350;
        
        const gameMetadata = {
            stack: {
                title: "3D Isometric Stack",
                desc1: "An interactive 3D isometric tower stacking game. Click or tap inside the frame to align the moving slab exactly on top of the tower.",
                desc2: "Excess overhangs are sliced off automatically. Miss the block entirely, and the game is over. Build the tallest tower!",
                btn: "START STACKING"
            },
            snake: {
                title: "3D Isometric Snake",
                desc1: "Navigate the 3D isometric grid and consume red apples. Steer with Arrow Keys on desktop, or tap Left/Right halves of the screen.",
                desc2: "Grow the longest snake possible without crashing into walls or biting your tail. The snake body shifts with rainbow gradients!",
                btn: "START STEERING"
            }
        };
        
        // Load initial highscore
        if (highScoreVal) {
            highScoreVal.textContent = stackHighScore;
        }
        
        let audioCtx = null;
        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }
        
        function playSound(type) {
            if (!audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                const now = audioCtx.currentTime;
                
                if (type === 'drop') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                } else if (type === 'perfect') {
                    const baseFreq = 523.25; // C5
                    const pitchMultiplier = Math.pow(1.12, Math.min(perfectStreak, 10));
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, now);
                    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier * 1.25, now + 0.08); // Chord note
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                } else if (type === 'gameover') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(80, now + 0.5);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                } else if (type === 'eat') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(659.25, now); // E5
                    osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                } else if (type === 'crash') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(60, now + 0.4);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                }
            } catch (e) {
                console.error("Audio error:", e);
            }
        }
        
        function project(x, y, z) {
            return {
                x: centerX + (x - z) * 0.866,
                y: centerY + (x + z) * 0.5 - (y - cameraY)
            };
        }
        
        function drawBlock(x, y, z, w, hSize, d, hue) {
            const p0 = project(x, y, z);
            const p1 = project(x + w, y, z);
            const p2 = project(x + w, y, z + d);
            const p3 = project(x, y, z + d);
            
            const colorTop = `hsl(${hue}, 70%, 65%)`;
            const colorLeft = `hsl(${hue}, 70%, 50%)`;
            const colorRight = `hsl(${hue}, 70%, 38%)`;
            const borderColor = "#111111";
            
            // Draw Left Face
            ctx.fillStyle = colorLeft;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p3.x, p3.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p2.x, p2.y + hSize);
            ctx.lineTo(p3.x, p3.y + hSize);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw Right Face
            ctx.fillStyle = colorRight;
            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p1.x, p1.y + hSize);
            ctx.lineTo(p2.x, p2.y + hSize);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw Top Face
            ctx.fillStyle = colorTop;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        function drawRipple(r) {
            const centerX3d = r.x + r.w / 2;
            const centerZ3d = r.z + r.d / 2;
            
            const corners = [
                { x: r.x, z: r.z },
                { x: r.x + r.w, z: r.z },
                { x: r.x + r.w, z: r.z + r.d },
                { x: r.x, z: r.z + r.d }
            ];
            
            const projectedCorners = corners.map(c => {
                const dx = c.x - centerX3d;
                const dz = c.z - centerZ3d;
                const scaledX = centerX3d + dx * r.size;
                const scaledZ = centerZ3d + dz * r.size;
                return project(scaledX, r.y, scaledZ);
            });
            
            ctx.strokeStyle = `rgba(255, 59, 48, ${r.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
            for (let i = 1; i < 4; i++) {
                ctx.lineTo(projectedCorners[i].x, projectedCorners[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        function updateGameMeta() {
            const meta = gameMetadata[activeGame];
            if (gameTitle) gameTitle.textContent = meta.title;
            if (gameDescs.length >= 2) {
                gameDescs[0].textContent = meta.desc1;
                gameDescs[1].textContent = meta.desc2;
            }
            if (restartBtn) restartBtn.textContent = meta.btn;
            
            const currentHS = activeGame === "stack" ? stackHighScore : snakeHighScore;
            if (highScoreVal) highScoreVal.textContent = currentHS;
            
            if (scoreVal) scoreVal.textContent = "0";
        }
        
        function switchGame() {
            gameState = "menu";
            score = 0;
            perfectStreak = 0;
            cameraY = 0;
            targetCameraY = 0;
            
            fallingBlocks = [];
            ripples = [];
            snake = [];
            
            if (gameOverlay) {
                const overlayText = gameOverlay.querySelector(".overlay-text");
                if (overlayText) {
                    overlayText.innerHTML = "CLICK TO START";
                }
                gameOverlay.classList.remove("hide");
            }
            
            updateGameMeta();
            
            if (activeGame === "stack") {
                stack = [{
                    x: -75,
                    z: -75,
                    y: 0,
                    w: 150,
                    d: 150,
                    hue: 0
                }];
            } else {
                snake = [
                    { x: 5, z: 5 },
                    { x: 4, z: 5 },
                    { x: 3, z: 5 }
                ];
                direction = { x: 1, z: 0 };
                nextDirection = { x: 1, z: 0 };
                food = { x: 8, z: 5 };
            }
            render();
        }
        
        function startGame() {
            score = 0;
            if (scoreVal) scoreVal.textContent = "0";
            
            if (gameOverlay) {
                gameOverlay.classList.add("hide");
            }
            
            if (activeGame === "stack") {
                stack = [{
                    x: -75,
                    z: -75,
                    y: 0,
                    w: 150,
                    d: 150,
                    hue: 0
                }];
                fallingBlocks = [];
                ripples = [];
                perfectStreak = 0;
                cameraY = 0;
                targetCameraY = 0;
                gameState = "playing";
                spawnBlock();
            } else {
                snake = [
                    { x: 5, z: 5 },
                    { x: 4, z: 5 },
                    { x: 3, z: 5 }
                ];
                direction = { x: 1, z: 0 };
                nextDirection = { x: 1, z: 0 };
                tickRate = 200;
                spawnFood();
                gameState = "playing";
                lastTickTime = Date.now();
            }
        }
        
        function spawnBlock() {
            const topBlock = stack[stack.length - 1];
            const nextAxis = (stack.length % 2 === 1) ? "x" : "z";
            const nextY = stack.length * h;
            const currentSpeed = Math.min(6, 2.5 + score * 0.08);
            
            activeBlock = {
                x: (nextAxis === "x") ? topBlock.x - 180 : topBlock.x,
                y: nextY,
                z: (nextAxis === "z") ? topBlock.z - 180 : topBlock.z,
                w: topBlock.w,
                d: topBlock.d,
                hue: (stack.length * 8) % 360,
                axis: nextAxis,
                direction: 1,
                speed: currentSpeed
            };
        }
        
        function spawnFood() {
            let valid = false;
            let fx, fz;
            while (!valid) {
                fx = Math.floor(Math.random() * gridSize);
                fz = Math.floor(Math.random() * gridSize);
                valid = true;
                for (let i = 0; i < snake.length; i++) {
                    if (snake[i].x === fx && snake[i].z === fz) {
                        valid = false;
                        break;
                    }
                }
            }
            food = { x: fx, z: fz };
        }
        
        function turnSnake(isClockwise) {
            if (isClockwise) {
                nextDirection = { x: -direction.z, z: direction.x };
            } else {
                nextDirection = { x: direction.z, z: -direction.x };
            }
        }
        
        function handleDrop() {
            if (gameState !== "playing" || activeGame !== "stack") return;
            
            const topBlock = stack[stack.length - 1];
            let isPerfect = false;
            let newBlock = null;
            let overhangBlock = null;
            const currentHue = activeBlock.hue;
            
            if (activeBlock.axis === "x") {
                const diff = activeBlock.x - topBlock.x;
                const absDiff = Math.abs(diff);
                
                if (absDiff < 4) {
                    isPerfect = true;
                    newBlock = {
                        x: topBlock.x,
                        y: activeBlock.y,
                        z: topBlock.z,
                        w: activeBlock.w,
                        d: activeBlock.d,
                        hue: currentHue
                    };
                } else if (absDiff >= activeBlock.w) {
                    endGame();
                    return;
                } else {
                    const newW = activeBlock.w - absDiff;
                    const newX = Math.max(activeBlock.x, topBlock.x);
                    newBlock = {
                        x: newX,
                        y: activeBlock.y,
                        z: topBlock.z,
                        w: newW,
                        d: activeBlock.d,
                        hue: currentHue
                    };
                    
                    const overhangX = (diff > 0) ? activeBlock.x + newW : activeBlock.x;
                    overhangBlock = {
                        x: overhangX,
                        y: activeBlock.y,
                        z: topBlock.z,
                        w: absDiff,
                        h: h,
                        d: activeBlock.d,
                        hue: currentHue,
                        vy: 0,
                        vx: (diff > 0) ? 1.5 : -1.5,
                        vz: 0
                    };
                }
            } else {
                const diff = activeBlock.z - topBlock.z;
                const absDiff = Math.abs(diff);
                
                if (absDiff < 4) {
                    isPerfect = true;
                    newBlock = {
                        x: topBlock.x,
                        y: activeBlock.y,
                        z: topBlock.z,
                        w: activeBlock.w,
                        d: activeBlock.d,
                        hue: currentHue
                    };
                } else if (absDiff >= activeBlock.d) {
                    endGame();
                    return;
                } else {
                    const newD = activeBlock.d - absDiff;
                    const newZ = Math.max(activeBlock.z, topBlock.z);
                    newBlock = {
                        x: topBlock.x,
                        y: activeBlock.y,
                        z: newZ,
                        w: activeBlock.w,
                        d: newD,
                        hue: currentHue
                    };
                    
                    const overhangZ = (diff > 0) ? activeBlock.z + newD : activeBlock.z;
                    overhangBlock = {
                        x: topBlock.x,
                        y: activeBlock.y,
                        z: overhangZ,
                        w: activeBlock.w,
                        h: h,
                        d: absDiff,
                        hue: currentHue,
                        vy: 0,
                        vx: 0,
                        vz: (diff > 0) ? 1.5 : -1.5
                    };
                }
            }
            
            stack.push(newBlock);
            
            if (overhangBlock) {
                fallingBlocks.push(overhangBlock);
                perfectStreak = 0;
                playSound('drop');
            } else {
                perfectStreak++;
                playSound('perfect');
                
                ripples.push({
                    x: newBlock.x,
                    y: newBlock.y,
                    z: newBlock.z,
                    w: newBlock.w,
                    d: newBlock.d,
                    size: 1.0,
                    opacity: 1.0
                });
                
                if (perfectStreak > 0 && perfectStreak % 5 === 0) {
                    if (activeBlock.axis === "x") {
                        const oldW = newBlock.w;
                        newBlock.w = Math.min(150, newBlock.w + 10);
                        const added = newBlock.w - oldW;
                        newBlock.x -= added / 2;
                    } else {
                        const oldD = newBlock.d;
                        newBlock.d = Math.min(150, newBlock.d + 10);
                        const added = newBlock.d - oldD;
                        newBlock.z -= added / 2;
                    }
                }
            }
            
            score = stack.length - 1;
            if (scoreVal) scoreVal.textContent = score;
            
            if (score > stackHighScore) {
                stackHighScore = score;
                localStorage.setItem("stack_highscore", stackHighScore);
                if (highScoreVal) highScoreVal.textContent = stackHighScore;
            }
            
            const currentTopY = (stack.length - 1) * h;
            if (currentTopY > 150) {
                targetCameraY = currentTopY - 150;
            }
            
            spawnBlock();
        }
        
        function endGame() {
            gameState = "gameover";
            
            if (activeGame === "stack") {
                playSound('gameover');
                if (gameOverlay) {
                    const overlayText = gameOverlay.querySelector(".overlay-text");
                    if (overlayText) {
                        overlayText.innerHTML = `GAME OVER<br>Score: ${score}<br><br><span style="font-size:1.1rem; text-decoration:underline;">CLICK TO PLAY AGAIN</span>`;
                    }
                    gameOverlay.classList.remove("hide");
                }
            } else {
                playSound('crash');
                if (gameOverlay) {
                    const overlayText = gameOverlay.querySelector(".overlay-text");
                    if (overlayText) {
                        overlayText.innerHTML = `CRASHED!<br>Score: ${score}<br><br><span style="font-size:1.1rem; text-decoration:underline;">CLICK TO PLAY AGAIN</span>`;
                    }
                    gameOverlay.classList.remove("hide");
                }
            }
        }
        
        function update() {
            cameraY += (targetCameraY - cameraY) * 0.1;
            
            if (gameState === "playing") {
                if (activeGame === "stack" && activeBlock) {
                    const topBlock = stack[stack.length - 1];
                    const limit = 180;
                    
                    if (activeBlock.axis === "x") {
                        activeBlock.x += activeBlock.speed * activeBlock.direction;
                        if (activeBlock.x > topBlock.x + limit) {
                            activeBlock.x = topBlock.x + limit;
                            activeBlock.direction = -1;
                        } else if (activeBlock.x < topBlock.x - limit) {
                            activeBlock.x = topBlock.x - limit;
                            activeBlock.direction = 1;
                        }
                    } else {
                        activeBlock.z += activeBlock.speed * activeBlock.direction;
                        if (activeBlock.z > topBlock.z + limit) {
                            activeBlock.z = topBlock.z + limit;
                            activeBlock.direction = -1;
                        } else if (activeBlock.z < topBlock.z - limit) {
                            activeBlock.z = topBlock.z - limit;
                            activeBlock.direction = 1;
                        }
                    }
                } else if (activeGame === "snake") {
                    const now = Date.now();
                    if (now - lastTickTime > tickRate) {
                        lastTickTime = now;
                        direction = nextDirection;
                        
                        const head = snake[0];
                        const newHead = { x: head.x + direction.x, z: head.z + direction.z };
                        
                        // Wall checks
                        if (newHead.x < 0 || newHead.x >= gridSize || newHead.z < 0 || newHead.z >= gridSize) {
                            endGame();
                            return;
                        }
                        
                        // Self checks
                        for (let i = 0; i < snake.length; i++) {
                            if (snake[i].x === newHead.x && snake[i].z === newHead.z) {
                                endGame();
                                return;
                            }
                        }
                        
                        snake.unshift(newHead);
                        
                        // Food checks
                        if (newHead.x === food.x && newHead.z === food.z) {
                            playSound('eat');
                            score = snake.length - 3;
                            if (scoreVal) scoreVal.textContent = score;
                            
                            if (score > snakeHighScore) {
                                snakeHighScore = score;
                                localStorage.setItem("snake_highscore", snakeHighScore);
                                if (highScoreVal) highScoreVal.textContent = snakeHighScore;
                            }
                            
                            spawnFood();
                            tickRate = Math.max(90, 200 - score * 5);
                        } else {
                            snake.pop();
                        }
                    }
                    
                    snakeHueOffset = (snakeHueOffset + 1.2) % 360;
                }
            }
            
            if (activeGame === "stack") {
                // Update falling fragments
                for (let i = fallingBlocks.length - 1; i >= 0; i--) {
                    const fb = fallingBlocks[i];
                    fb.vy += 0.6;
                    fb.y -= fb.vy;
                    fb.x += fb.vx;
                    fb.z += fb.vz;
                    
                    if (fb.y < cameraY - 150) {
                        fallingBlocks.splice(i, 1);
                    }
                }
                
                // Update ripples
                for (let i = ripples.length - 1; i >= 0; i--) {
                    const r = ripples[i];
                    r.size += 0.04;
                    r.opacity -= 0.04;
                    if (r.opacity <= 0) {
                        ripples.splice(i, 1);
                    }
                }
            }
        }
        
        function render() {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            if (activeGame === "stack") {
                for (let i = 0; i < stack.length; i++) {
                    const b = stack[i];
                    drawBlock(b.x, b.y, b.z, b.w, h, b.d, b.hue);
                }
                
                for (let i = 0; i < fallingBlocks.length; i++) {
                    const fb = fallingBlocks[i];
                    drawBlock(fb.x, fb.y, fb.z, fb.w, fb.h, fb.d, fb.hue);
                }
                
                if (gameState === "playing" && activeBlock) {
                    drawBlock(activeBlock.x, activeBlock.y, activeBlock.z, activeBlock.w, h, activeBlock.d, activeBlock.hue);
                }
                
                for (let i = 0; i < ripples.length; i++) {
                    drawRipple(ripples[i]);
                }
            } else if (activeGame === "snake") {
                // Draw grid floor lines
                ctx.strokeStyle = "rgba(17, 17, 17, 0.07)";
                ctx.lineWidth = 1.0;
                for (let i = 0; i <= gridSize; i++) {
                    const xVal = startX - cellSize / 2 + i * cellSize;
                    const pStart = project(xVal, -8, startZ - cellSize / 2);
                    const pEnd = project(xVal, -8, startZ - cellSize / 2 + gridSize * cellSize);
                    ctx.beginPath();
                    ctx.moveTo(pStart.x, pStart.y);
                    ctx.lineTo(pEnd.x, pEnd.y);
                    ctx.stroke();
                }
                for (let j = 0; j <= gridSize; j++) {
                    const zVal = startZ - cellSize / 2 + j * cellSize;
                    const pStart = project(startX - cellSize / 2, -8, zVal);
                    const pEnd = project(startX - cellSize / 2 + gridSize * cellSize, -8, zVal);
                    ctx.beginPath();
                    ctx.moveTo(pStart.x, pStart.y);
                    ctx.lineTo(pEnd.x, pEnd.y);
                    ctx.stroke();
                }
                
                // Draw apple (red, floating)
                const bobOffset = Math.sin(Date.now() * 0.005) * 2;
                const appleX = startX + food.x * cellSize + 3;
                const appleZ = startZ + food.z * cellSize + 3;
                const appleY = -2 + bobOffset;
                drawBlock(appleX, appleY, appleZ, 12, 12, 12, 0); // Hue 0 (red)
                
                // Draw snake segments (sorted back-to-front depth)
                const sortedSegments = snake.map((s, idx) => ({ ...s, idx }))
                    .sort((a, b) => (a.x + a.z) - (b.x + b.z));
                
                for (let k = 0; k < sortedSegments.length; k++) {
                    const seg = sortedSegments[k];
                    const segX = startX + seg.x * cellSize + 1;
                    const segZ = startZ + seg.z * cellSize + 1;
                    const size = (seg.idx === 0) ? 16 : 14;
                    const sizeOffset = (18 - size) / 2;
                    const hue = (snakeHueOffset + seg.idx * 10) % 360;
                    drawBlock(segX + sizeOffset, -8 + size, segZ + sizeOffset, size, size, size, hue);
                }
            }
        }
        
        function gameTick() {
            update();
            render();
            requestAnimationFrame(gameTick);
        }
        
        // Initial setup setup
        switchGame();
        
        // Event Listeners
        if (canvasWrapper) {
            canvasWrapper.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                initAudio();
                
                if (gameState === "menu") {
                    startGame();
                } else if (gameState === "playing") {
                    if (activeGame === "stack") {
                        handleDrop();
                    } else if (activeGame === "snake") {
                        const rect = canvasWrapper.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const width = rect.width;
                        if (clickX < width / 2) {
                            turnSnake(false); // Left turn
                        } else {
                            turnSnake(true); // Right turn
                        }
                    }
                } else if (gameState === "gameover") {
                    startGame();
                }
            });
        }
        
        if (restartBtn) {
            restartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                initAudio();
                startGame();
            });
        }
        
        // Tab switcher clicks
        gameButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                gameButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const selected = btn.getAttribute("data-game");
                if (selected !== activeGame) {
                    activeGame = selected;
                    switchGame();
                }
            });
        });
        
        window.addEventListener("keydown", (e) => {
            if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
                return;
            }
            
            const playRoomSection = document.getElementById("play");
            if (!playRoomSection) return;
            const rect = playRoomSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible) return;
            
            if (e.key === " ") {
                e.preventDefault();
                initAudio();
                if (gameState === "playing") {
                    if (activeGame === "stack") {
                        handleDrop();
                    }
                } else {
                    startGame();
                }
            } else if (activeGame === "snake" && gameState === "playing") {
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (direction.x === 0) nextDirection = { x: -1, z: 0 };
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (direction.x === 0) nextDirection = { x: 1, z: 0 };
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    if (direction.z === 0) nextDirection = { x: 0, z: 1 };
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    if (direction.z === 0) nextDirection = { x: 0, z: -1 };
                }
            }
        });
        
        // Start animation loop
        requestAnimationFrame(gameTick);
    }
});
