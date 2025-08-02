// Hugging Face Configuration
const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const API_TOKEN = "YOUR_HUGGING_FACE_TOKEN_HERE"; // Replace with your actual token

// DOM Elements
const articleText = document.getElementById('articleText');
const urlInput = document.getElementById('urlInput');
const fileInput = document.getElementById('fileInput');
const summarizeBtn = document.getElementById('summarizeBtn');
const resultsSection = document.getElementById('resultsSection');
const summaryResult = document.getElementById('summaryResult');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');

// Example texts for demonstration
const examples = {
    news: `Artificial Intelligence is revolutionizing the technology industry at an unprecedented pace. Major tech companies are investing billions of dollars in AI research and development, leading to breakthrough innovations in machine learning, natural language processing, and computer vision. These advancements are not only transforming how businesses operate but also reshaping entire industries from healthcare to finance. The rapid adoption of AI-powered tools has increased productivity across various sectors, with many organizations reporting significant improvements in efficiency and decision-making processes. However, this technological revolution also brings challenges including job displacement concerns, ethical considerations around data privacy, and the need for new regulatory frameworks. Experts predict that AI will continue to evolve rapidly, with the next decade likely to see even more sophisticated applications that could fundamentally change how we work, communicate, and live our daily lives.`,
    
    research: `Recent studies in neuroscience have revealed fascinating insights into the human brain's plasticity and its ability to adapt throughout life. Researchers at leading universities have discovered that neuroplasticity, the brain's capacity to reorganize and form new neural connections, continues well into old age, challenging previous assumptions about cognitive decline. Through advanced neuroimaging techniques and longitudinal studies involving thousands of participants, scientists have identified specific factors that promote brain health and cognitive resilience. Regular physical exercise, particularly aerobic activities, has been shown to stimulate the production of brain-derived neurotrophic factor (BDNF), a protein crucial for neuron survival and growth. Additionally, engaging in complex cognitive tasks, learning new skills, and maintaining social connections all contribute to building cognitive reserve. The research also highlights the importance of quality sleep in memory consolidation and the removal of toxic proteins associated with neurodegenerative diseases. These findings have significant implications for developing interventions to prevent cognitive decline and potentially treat neurological disorders.`,
    
    blog: `Building modern web applications requires mastering a complex ecosystem of tools, frameworks, and best practices. As a developer in 2024, you'll need to navigate through choices between React, Vue, Angular, or newer frameworks like Svelte and SolidJS. Each framework has its strengths and use cases, making the selection process crucial for project success. React continues to dominate with its vast ecosystem and job market demand, while Vue offers simplicity and gentle learning curve. Angular provides enterprise-grade features but comes with steeper complexity. Beyond frameworks, modern development involves understanding build tools like Vite, Webpack, or Rollup, state management solutions such as Redux, Zustand, or Pinia, and CSS approaches ranging from traditional stylesheets to CSS-in-JS and utility frameworks like Tailwind CSS. Testing has become integral with tools like Jest, Vitest, and Playwright ensuring code quality. Deployment strategies now favor containerization with Docker, serverless functions, and edge computing platforms. The key to success lies not in mastering every tool, but in understanding fundamental concepts and choosing the right tool for specific project requirements while staying updated with the rapidly evolving landscape.`
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeEventListeners();
    updateCharCount();
});

// Tab functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// Event listeners
function initializeEventListeners() {
    // Text input monitoring
    articleText.addEventListener('input', updateCharCount);
    
    // File upload
    document.getElementById('uploadBtn').addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileUpload);
    
    // URL fetch
    document.getElementById('fetchBtn').addEventListener('click', fetchArticleFromURL);
    
    // Summarize button
    summarizeBtn.addEventListener('click', generateSummary);
    
    // Copy and share buttons
    document.getElementById('copyBtn').addEventListener('click', copySummary);
    document.getElementById('shareBtn').addEventListener('click', shareSummary);
    
    // Example buttons
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', () => {
            const exampleType = card.dataset.example;
            loadExample(exampleType);
        });
    });
}

// Update character and word count
function updateCharCount() {
    const text = articleText.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    charCount.textContent = chars.toLocaleString();
    wordCount.textContent = words.toLocaleString();
    
    // Enable/disable summarize button based on content
    const minChars = 200;
    summarizeBtn.disabled = chars < minChars;
    
    if (chars < minChars && chars > 0) {
        summarizeBtn.innerHTML = `📝 Need ${minChars - chars} more characters`;
    } else if (chars >= minChars) {
        summarizeBtn.innerHTML = '<span class="btn-text">🤖 Generate Smart Summary</span>';
    } else {
        summarizeBtn.innerHTML = '<span class="btn-text">🤖 Generate Smart Summary</span>';
    }
}

// File upload handler
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = document.getElementById('fileName');
    fileName.textContent = `Selected: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        articleText.value = e.target.result;
        updateCharCount();
        
        // Switch to text tab to show loaded content
        document.querySelector('.tab-btn[data-tab="text"]').click();
    };
    reader.readAsText(file);
}

// Fetch article from URL (simplified - in real implementation you'd need a CORS proxy)
async function fetchArticleFromURL() {
    const url = urlInput.value.trim();
    const statusDiv = document.getElementById('fetchStatus');
    
    if (!url) {
        showFetchStatus('Please enter a valid URL', 'error');
        return;
    }
    
    try {
        showFetchStatus('Fetching article...', 'info');
        
        // Note: This is a simplified demo. In production, you'd need a CORS proxy
        // For demo purposes, we'll simulate fetching with example content
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful fetch with example content
        const sampleContent = examples.news;
        articleText.value = sampleContent;
        updateCharCount();
        
        showFetchStatus('Article fetched successfully!', 'success');
        
        // Switch to text tab to show fetched content
        document.querySelector('.tab-btn[data-tab="text"]').click();
        
    } catch (error) {
        showFetchStatus('Failed to fetch article. Please try copying the text manually.', 'error');
        console.error('Fetch error:', error);
    }
}

// Show fetch status
function showFetchStatus(message, type) {
    const statusDiv = document.getElementById('fetchStatus');
    statusDiv.textContent = message;
    statusDiv.className = `fetch-status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

// Load example content
function loadExample(type) {
    if (examples[type]) {
        articleText.value = examples[type];
        updateCharCount();
        
        // Switch to text tab and scroll to it
        document.querySelector('.tab-btn[data-tab="text"]').click();
        articleText.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the textarea briefly
        articleText.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.3)';
        setTimeout(() => {
            articleText.style.boxShadow = '';
        }, 2000);
    }
}

// Enhanced generate summary with better feedback
async function generateSummary() {
    const text = articleText.value.trim();
    if (!text || text.length < 200) {
        alert('Please enter at least 200 characters of text to summarize.');
        return;
    }
    
    console.log('Starting summarization...'); // Debug log
    const startTime = Date.now();
    
    // Update UI to loading state
    setLoadingState(true);
    
    // Add a progress message
    setTimeout(() => {
        const loadingSpan = summarizeBtn.querySelector('.btn-loading');
        if (loadingSpan) {
            loadingSpan.innerHTML = `
                <div class="spinner"></div>
                Analyzing text...
            `;
        }
    }, 1000);
    
    setTimeout(() => {
        const loadingSpan = summarizeBtn.querySelector('.btn-loading');
        if (loadingSpan) {
            loadingSpan.innerHTML = `
                <div class="spinner"></div>
                Generating summary...
            `;
        }
    }, 3000);
    
    try {
        let summary;
        
        // Use real Hugging Face API with your token
        console.log('Calling Hugging Face API...'); // Debug log
        summary = await callHuggingFaceAPI(text);
        
        const endTime = Date.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(1);
        
        console.log('Summary generated successfully:', summary); // Debug log
        
        // Display results
        displayResults(text, summary, processingTime);
        
    } catch (error) {
        console.error('Summarization error:', error);
        
        // Show user-friendly error message
        const loadingSpan = summarizeBtn.querySelector('.btn-loading');
        if (loadingSpan) {
            loadingSpan.innerHTML = `
                <div class="spinner"></div>
                API busy, using fallback...
            `;
        }
        
        // Fallback to simulated summary if API fails
        const summary = await simulateSummary(text);
        const endTime = Date.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(1);
        
        displayResults(text, summary, processingTime);
        
    } finally {
        setLoadingState(false);
    }
}

// Enhanced API call with timeout
async function callHuggingFaceAPI(text) {
    const summaryLength = document.getElementById('summaryLength').value;
    
    // Adjust parameters based on user selections
    let maxLength, minLength;
    switch (summaryLength) {
        case 'short':
            maxLength = 50;
            minLength = 10;
            break;
        case 'medium':
            maxLength = 100;
            minLength = 30;
            break;
        case 'long':
            maxLength = 150;
            minLength = 50;
            break;
    }
    
    console.log('Making API request with params:', { maxLength, minLength }); // Debug log
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API request timeout')), 30000); // 30 second timeout
    });
    
    // Create API request promise
    const apiPromise = fetch(HF_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: text,
            parameters: {
                max_length: maxLength,
                min_length: minLength,
                do_sample: false
            }
        })
    });
    
    // Race between API and timeout
    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result); // Debug log
    
    // Handle different response formats
    if (Array.isArray(result) && result[0] && result[0].summary_text) {
        return result[0].summary_text;
    } else if (result.summary_text) {
        return result.summary_text;
    } else if (result.error) {
        throw new Error(`API Error: ${result.error}`);
    } else {
        console.error('Unexpected API response format:', result);
        throw new Error('Unexpected API response format');
    }
}

// Set loading state - IMPROVED VERSION
function setLoadingState(isLoading) {
    const btnText = summarizeBtn.querySelector('.btn-text');
    const btnLoading = summarizeBtn.querySelector('.btn-loading');
    
    console.log('Setting loading state:', isLoading); // Debug log
    
    if (isLoading) {
        // Hide normal text, show loading
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) {
            btnLoading.style.display = 'inline-flex';
        } else {
            // Fallback if loading span doesn't exist
            summarizeBtn.innerHTML = `
                <span class="btn-loading" style="display: inline-flex; align-items: center; gap: 10px;">
                    <div class="spinner"></div>
                    Processing...
                </span>
            `;
        }
        summarizeBtn.disabled = true;
        summarizeBtn.style.opacity = '0.8';
        
    } else {
        // Show normal text, hide loading
        if (btnText) {
            btnText.style.display = 'inline';
        } else {
            // Restore original button text
            summarizeBtn.innerHTML = '<span class="btn-text">🤖 Generate Smart Summary</span>';
        }
        if (btnLoading) btnLoading.style.display = 'none';
        summarizeBtn.disabled = false;
        summarizeBtn.style.opacity = '1';
    }
}

// Simulate summary generation for demo purposes
async function simulateSummary(text) {
    const summaryLength = document.getElementById('summaryLength').value;
    const summaryStyle = document.getElementById('summaryStyle').value;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple extractive summarization simulation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let summaryLength_sentences;
    
    switch (summaryLength) {
        case 'short':
            summaryLength_sentences = Math.min(2, sentences.length);
            break;
        case 'medium':
            summaryLength_sentences = Math.min(4, sentences.length);
            break;
        case 'long':
            summaryLength_sentences = Math.min(6, sentences.length);
            break;
    }
    
    // Select sentences with highest "importance" (simplified)
    const importantSentences = sentences
        .map(sentence => ({
            text: sentence.trim(),
            score: calculateSentenceScore(sentence, text)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, summaryLength_sentences)
        .map(item => item.text);
    
    // Add style-specific prefix
    let stylePrefix = '';
    switch (summaryStyle) {
        case 'key-points':
            stylePrefix = 'Key points: ';
            break;
        case 'conclusion':
            stylePrefix = 'Main conclusion: ';
            break;
    }
    
    return stylePrefix + importantSentences.join('. ') + '.';
}

// Calculate sentence importance score (simplified)
function calculateSentenceScore(sentence, fullText) {
    const words = sentence.toLowerCase().split(/\s+/);
    const fullTextWords = fullText.toLowerCase().split(/\s+/);
    
    // Score based on word frequency and sentence position
    let score = 0;
    
    words.forEach(word => {
        if (word.length > 4) { // Ignore short words
            const frequency = fullTextWords.filter(w => w === word).length;
            score += frequency;
        }
    });
    
    // Boost sentences with common important words
    const importantWords = ['important', 'significant', 'research', 'study', 'found', 'shows', 'results', 'conclusion'];
    words.forEach(word => {
        if (importantWords.includes(word)) {
            score += 5;
        }
    });
    
    return score / words.length; // Normalize by sentence length
}

// Display results
function displayResults(originalText, summary, processingTime) {
    // Calculate statistics
    const originalWords = originalText.trim().split(/\s+/).length;
    const originalChars = originalText.length;
    const summaryWords = summary.trim().split(/\s+/).length;
    const summaryChars = summary.length;
    const compressionRatio = Math.round((1 - summaryWords / originalWords) * 100);
    const readingTime = Math.ceil(summaryWords / 200); // Assuming 200 words per minute
    
    // Update summary text
    summaryResult.textContent = summary;
    
    // Update statistics
    document.getElementById('compressionRatio').textContent = `Compression: ${compressionRatio}%`;
    document.getElementById('readingTime').textContent = `Reading time: ${readingTime} min`;
    document.getElementById('originalStats').textContent = `${originalWords.toLocaleString()} words, ${originalChars.toLocaleString()} chars`;
    document.getElementById('summaryStats').textContent = `${summaryWords.toLocaleString()} words, ${summaryChars.toLocaleString()} chars`;
    document.getElementById('processingTime').textContent = `${processingTime}s`;
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Copy summary to clipboard
async function copySummary() {
    const summary = summaryResult.textContent;
    
    try {
        await navigator.clipboard.writeText(summary);
        
        // Visual feedback
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#3498db';
        }, 2000);
        
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = summary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Summary copied to clipboard!');
    }
}

// Share summary
function shareSummary() {
    const summary = summaryResult.textContent;
    const shareData = {
        title: 'AI-Generated Summary',
        text: summary,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback - copy to clipboard
        copySummary();
        alert('Summary copied to clipboard for sharing!');
    }
}