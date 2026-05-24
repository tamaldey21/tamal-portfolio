const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static portfolio files
app.use(express.static(path.join(__dirname)));

// ==========================================
// 1. API: HANDLE CONTACT FORM SUBMISSIONS
// ==========================================
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.json({ success: false, error: 'All fields are required.' });
    }

    const messageData = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    const messagesFile = path.join(__dirname, 'messages.json');
    let messages = [];

    if (fs.existsSync(messagesFile)) {
        try {
            const rawData = fs.readFileSync(messagesFile, 'utf8');
            messages = JSON.parse(rawData);
        } catch (e) {
            console.error('Error reading messages file:', e);
        }
    }

    messages.push(messageData);

    try {
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 4), 'utf8');
        return res.json({ success: true, message: 'Your signal has been recorded in the database!' });
    } catch (e) {
        console.error('Error writing message to file:', e);
        return res.json({ success: false, error: 'Database write error. Signal failed to cache.' });
    }
});

// ==========================================
// 2. API: LIVE CHATBOT ALGORITHMS
// ==========================================
const chatbotQA = [
    {
        keywords: ["skills", "languages", "frameworks", "technologies", "coding", "can you code", "stack"],
        answer: "Tamal is fluent in <strong>Solidity, Move, Clarity, JavaScript, Java, SQL, and Python</strong>. For framework layers, he uses <strong>React.js, Spring Boot, Hardhat, and Truffle</strong>. He is also highly skilled in AWS cloud deployment, IPFS, and IoT automation."
    },
    {
        keywords: ["experience", "intern", "internship", "work", "simulations", "job", "ten"],
        answer: "Tamal has completed several simulation and internship sessions:<br>" +
            "1. <strong>TEN Software Intern</strong> (Active software creations & implementations)<br>" +
            "2. <strong>TCS Forage Intern</strong> (Synthesizing dashboard data visuals for executives)<br>" +
            "3. <strong>AWS Forage Solutions Architect</strong> (Elastic Beanstalk container setups)<br>" +
            "4. <strong>Tata Group simulation</strong> (GenAI-powered analytics and data quality auditing)<br>" +
            "5. <strong>HPE Software simulation</strong> (Java Spring Boot server APIs development & unit tests)"
    },
    {
        keywords: ["projects", "what did he build", "repos", "smart contract", "contract"],
        answer: "His major smart contract projects include:<br>" +
            " - <strong>NFTStakingContract</strong> (Clarity): Yield staker contract on Bitcoin layer.<br>" +
            " - <strong>NFT-Art-Marketplace-</strong> (Move): Aptos object auction platform.<br>" +
            " - <strong>DeFi-Insurance-Protocol</strong> (Solidity): Crop drought/flight delay parametric insurance.<br>" +
            " - <strong>Kissan Helper</strong>: Agricultural AI support and IoT moisture triggers.<br>" +
            " - <strong>college_complain_box_plan</strong>: Grievance management portal."
    },
    {
        keywords: ["farming", "agricultural", "kissan", "smart farming", "crop", "drought", "raspberry"],
        answer: "Tamal worked on the <strong>Kissan Helper</strong> agricultural AI project. Using soil sensors and weather monitors connected to a Raspberry Pi, the system tracks humidity levels and applies ML classifiers locally to automatically cycle irrigation solenoids when soil goes dry."
    },
    {
        keywords: ["contact", "email", "github", "linkedin", "phone", "hire", "resume"],
        answer: "You can reach Tamal directly via email: <a href='mailto:tamaldey728@gmail.com' style='color:var(--color-red)'>tamaldey728@gmail.com</a>.<br>" +
            "GitHub: <a href='https://github.com/tamaldey21' target='_blank' style='color:var(--color-red)'>github.com/tamaldey21</a><br>" +
            "LinkedIn: <a href='https://www.linkedin.com/in/tamal-dey-4a41761b2/' target='_blank' style='color:var(--color-red)'>linkedin.com/in/tamal-dey-4a41761b2/</a><br>" +
            "Resume: <a href='assets/tamal_dey_resume.pdf' target='_blank' style='color:var(--color-red)'>View Resume (PDF)</a>"
    },
    {
        keywords: ["college", "university", "education", "degree", "study", "gpa"],
        answer: "Tamal is pursuing his <strong>Bachelor of Technology in Computer Science</strong> at the <strong>University of Engineering & Management, Jaipur</strong> (expected completion July 2028). Previously, he scored 67.8% in Higher Secondary (NIOS) and 68.7% in Secondary boards."
    },
    {
        keywords: ["cert", "certification", "certifications"],
        answer: "He holds certifications in <strong>GenAI Powered Data Analytics</strong>, <strong>Solutions Architecture</strong>, <strong>Software Engineering</strong>, and <strong>Data Visualisation</strong>."
    }
];

app.post('/api/chat', (req, res) => {
    const userMessage = (req.body.message || '').toLowerCase();
    
    if (!userMessage) {
        return res.json({ reply: "Hello! Ask me about Tamal's skills, experience, or projects." });
    }

    let reply = "I'm sorry, I didn't quite catch that. Try asking about his 'skills', 'experience', 'projects', 'education', or how to 'contact' him.";

    for (let i = 0; i < chatbotQA.length; i++) {
        const entry = chatbotQA[i];
        const match = entry.keywords.some(kw => userMessage.includes(kw));
        if (match) {
            reply = entry.answer;
            break;
        }
    }

    return res.json({ reply });
});

// ==========================================
// 3. API: LIVE GITHUB METRICS INTEGRATION (CACHED)
// ==========================================
let githubCache = null;
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in ms

app.get('/api/github', async (req, res) => {
    const now = Date.now();
    
    // Serve cached data if valid
    if (githubCache && (now - cacheTime < CACHE_DURATION)) {
        return res.json(githubCache);
    }

    try {
        console.log("Fetching live GitHub metrics for tamaldey21...");
        
        // 1. Fetch User Info
        const userRes = await fetch('https://api.github.com/users/tamaldey21', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!userRes.ok) {
            throw new Error(`GitHub User API returned status ${userRes.status}`);
        }
        
        const userData = await userRes.json();
        
        // 2. Fetch User Repos (max 100)
        const reposRes = await fetch('https://api.github.com/users/tamaldey21/repos?per_page=100', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        let reposData = [];
        if (reposRes.ok) {
            reposData = await reposRes.json();
        }

        // 3. Compute Metrics
        const public_repos = userData.public_repos || reposData.length;
        const followers = userData.followers || 0;
        
        let totalStars = 0;
        const languages = {};
        
        reposData.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        // Determine primary language
        let primary_language = 'Solidity'; // Default fallback
        let maxCount = 0;
        for (const lang in languages) {
            if (languages[lang] > maxCount) {
                maxCount = languages[lang];
                primary_language = lang;
            }
        }

        githubCache = {
            public_repos,
            stars: totalStars,
            followers,
            primary_language
        };
        cacheTime = now;

        return res.json(githubCache);
        
    } catch (error) {
        console.error('Error fetching GitHub API:', error);
        
        // Return fallback mockup data if offline or API limit hit
        return res.json({
            public_repos: 12,
            stars: 5,
            followers: 8,
            primary_language: 'Solidity'
        });
    }
});

// Start Express Listener
app.listen(PORT, () => {
    console.log(`Portfolio Express Server running at http://localhost:${PORT}`);
});
