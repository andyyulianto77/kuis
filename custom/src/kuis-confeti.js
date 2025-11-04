
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3.1.4/+esm';

class ConfettiQuiz extends LitElement {
    static properties = {
        message: { type: String },
        isCorrect: { type: Boolean },
        isDisabled: { type: Boolean },
        currentQuestionIndex: { type: Number },
        showSummary: { type: Boolean },
        // JSON string attribute to supply questions dynamically
        questionsAttr: { type: String, attribute: 'questions' },
    };

    constructor() {
        super();
        this.message = '';
        this.isCorrect = false;
        this.isDisabled = false;
        this.currentQuestionIndex = 0;
        this.showSummary = false;
        this.questionsAttr = '';
        
        // Array pertanyaan default (fallback)
        this.questions = [
            { question: "Apa saja nama planet terbesar di tata surya kita?", answer: "jupiter" },
            { question: "Berapa jumlah planet dalam tata surya?", answer: "delapan" },
            { question: "Planet apa yang paling dekat dengan matahari?", answer: "merkurius" },
            { question: "Bulan adalah satelit alami planet apa?", answer: "bumi" },
            { question: "Apa nama bintang di pusat tata surya kita?", answer: "matahari" },
            { question: "Planet mana yang memiliki cincin?", answer: "saturnus" },
            { question: "Siapakah presiden pertama Indonesia?", answer: "soekarno" },

        ];
        
        // Menyimpan jawaban user untuk setiap soal
        this.userAnswers = [];
        this.correctAnswers = [];
    }

    updated(changed) {
        if (changed.has('questionsAttr')) {
            const parsed = this._parseQuestions(this.questionsAttr);
            if (parsed && parsed.length) {
                this.questions = parsed;
                // reset state when questions change
                this.currentQuestionIndex = 0;
                this.showSummary = false;
                this.message = '';
                this.isCorrect = false;
                this.isDisabled = false;
                this.userAnswers = [];
                this.correctAnswers = [];
            }
        }
    }

    _parseQuestions(str) {
        if (!str || typeof str !== 'string') return null;
        try {
            const data = JSON.parse(str);
            if (Array.isArray(data)) {
                return data
                    .map(x => ({
                        question: String(x.question || '').trim(),
                        answer: String(x.answer || '').trim().toLowerCase(),
                    }))
                    .filter(x => x.question && x.answer);
            }
        } catch (e) {
            // ignore parse errors, fallback to defaults
        }
        return null;
    }
    
    get currentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }
    
    get totalQuestions() {
        return this.questions.length;
    }

    static styles = css`
        :host {
            display: block;
            color: #1f2937;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .card {
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            padding: 2rem;
            box-sizing: border-box;
            color: #1f2937;
        }
        .card h1 {
            color: #1e40af;
            font-size: 1.875rem;
            font-weight: 700;
            text-align: center;
            margin: 0 0 1.5rem 0;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: #3b82f6;
            transition: width 0.3s ease;
        }
        .question-number {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .card p {
            color: #1f2937;
            font-size: 1.125rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }
        .correct-answer {
            background-color: #d1fae5;
            color: #065f46;
            padding: 0.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
        }
        .wrong-answer {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 0.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
        }
        .check-button, .nav-button {
            transition: all 0.15s;
        }
        .check-button:not([disabled]):hover, .nav-button:not([disabled]):hover {
            background-color: #1d4ed8;
            transform: scale(1.01);
        }
        .check-button[disabled], .nav-button[disabled] {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
        .nav-buttons {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .nav-button {
            flex: 1;
            padding: 0.75rem;
            font-weight: 600;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            background-color: #6b7280;
            color: white;
            font-size: 0.875rem;
        }
        .nav-button.primary {
            background-color: #3b82f6;
            color: white;
        }
        .nav-button:disabled {
            color: white;
            opacity: 0.7;
        }
        #answer-input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            color: #1f2937;
            background-color: white;
            box-sizing: border-box;
        }
        #answer-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        #answer-input:disabled {
            background-color: #f3f4f6;
            color: #6b7280;
            cursor: not-allowed;
        }
        #check-button {
            width: 100%;
            margin-top: 1rem;
            padding: 0.75rem;
            font-weight: 600;
            border-radius: 0.5rem;
            border: none;
            font-size: 1rem;
        }
        .summary {
            text-align: center;
        }
        .summary-score {
            font-size: 3rem;
            font-weight: bold;
            color: #3b82f6;
            margin: 1rem 0;
        }
        .summary-item {
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 0.5rem;
            text-align: left;
        }
        .summary-item.correct {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
        }
        .summary-item.incorrect {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #991b1b;
        }
        .summary-item.correct {
            color: #065f46;
        }
        .summary h1 {
            color: #1e40af;
            font-size: 1.875rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1rem;
        }
        .summary h2 {
            color: #1f2937;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
    `;

    launchConfetti() {
        // Gunakan overlay DDD jika tersedia
        const overlay = document.querySelector('kuis-confeti');
        if (overlay && typeof overlay.fire === 'function') {
            overlay.fire({ duration: 2000, particleCount: 220 });
            return;
        }
        // Fallback ke window.confetti jika ada
        if (window.confetti) {
            window.confetti({
                particleCount: 200,
                spread: 150, 
                angle: 90,
                startVelocity: 60,
                origin: { x: 0.5, y: 0.7 },
                colors: ['#4ade80', '#22c55e', '#10b981', '#1a73e8', '#f97316']
            });
        }
    }

    checkAnswer() {
        const inputElement = this.shadowRoot.getElementById('answer-input');
        const userAnswer = inputElement.value.trim().toLowerCase();
        const correctAnswer = this.currentQuestion.answer.toLowerCase();
        
        this.message = ''; 
        
        // Simpan jawaban user
        this.userAnswers[this.currentQuestionIndex] = userAnswer;
        
        if (userAnswer === correctAnswer) {
            this.isCorrect = true;
            this.correctAnswers[this.currentQuestionIndex] = true;
            this.message = '🎉 Benar! Jawaban Anda tepat. Selamat!';
            this.isDisabled = true;
            this.launchConfetti();
        } else {
            this.isCorrect = false;
            this.correctAnswers[this.currentQuestionIndex] = false;
            this.message = `❌ Salah. Jawaban yang benar adalah: "${this.currentQuestion.answer}"`;
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.currentQuestionIndex++;
            this.message = '';
            this.isCorrect = false;
            this.isDisabled = false;
            // Reset input
            const inputElement = this.shadowRoot.getElementById('answer-input');
            if (inputElement) {
                inputElement.value = this.userAnswers[this.currentQuestionIndex] || '';
            }
        } else {
            // Menampilkan summary
            this.showSummary = true;
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.message = '';
            this.isCorrect = this.correctAnswers[this.currentQuestionIndex] || false;
            this.isDisabled = this.userAnswers[this.currentQuestionIndex] ? true : false;
            // Set input value
            const inputElement = this.shadowRoot.getElementById('answer-input');
            if (inputElement) {
                inputElement.value = this.userAnswers[this.currentQuestionIndex] || '';
            }
            // Tampilkan pesan jika sudah dijawab
            if (this.userAnswers[this.currentQuestionIndex]) {
                if (this.isCorrect) {
                    this.message = '✅ Jawaban Anda benar!';
                } else {
                    this.message = `❌ Jawaban yang benar: "${this.questions[this.currentQuestionIndex].answer}"`;
                }
            }
        }
    }
    
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.showSummary = false;
        this.message = '';
        this.isCorrect = false;
        this.isDisabled = false;
        this.userAnswers = [];
        this.correctAnswers = [];
        const inputElement = this.shadowRoot.getElementById('answer-input');
        if (inputElement) {
            inputElement.value = '';
        }
    }
    
    getScore() {
        return this.correctAnswers.filter(c => c === true).length;
    }
    
    getPercentage() {
        return Math.round((this.getScore() / this.totalQuestions) * 100);
    }

    // Menggunakan keypress untuk deteksi tombol Enter
    handleKeyPress(e) {
        if (e.key === 'Enter' && !this.isDisabled) {
            this.checkAnswer();
        }
    }

    render() {
        if (this.showSummary) {
            return this.renderSummary();
        }
        
        const messageClass = this.isCorrect ? 'correct-answer' : 'wrong-answer';
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        const isLastQuestion = this.currentQuestionIndex === this.totalQuestions - 1;
        const hasAnswered = this.userAnswers[this.currentQuestionIndex] !== undefined;

        return html`
            <div class="card">
                <h1>Kuis Pengetahuan Umum</h1>
                
                <!-- Progress Bar -->
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                
                <div id="quiz-area">
                    <!-- Question Number -->
                    <div class="question-number">
                        Soal ${this.currentQuestionIndex + 1} dari ${this.totalQuestions}
                    </div>
                    
                    <!-- SOAL -->
                    <p>
                        ${this.currentQuestionIndex + 1}. ${this.currentQuestion.question}
                    </p>
                    
                    <!-- INPUT JAWABAN -->
                    <input 
                        type="text" 
                        id="answer-input" 
                        placeholder="Tulis jawaban Anda di sini..."
                        ?disabled=${this.isDisabled}
                        @keypress=${this.handleKeyPress}
                        .value=${this.userAnswers[this.currentQuestionIndex] || ''}
                    >
                    
                    <!-- TOMBOL CEK -->
                    <button 
                        id="check-button" 
                        @click=${this.checkAnswer}
                        ?disabled=${this.isDisabled}
                        style="background-color: ${this.isDisabled ? '#9ca3af' : '#2563eb'}; color: white; cursor: ${this.isDisabled ? 'not-allowed' : 'pointer'};"
                    >
                        Cek Jawaban
                    </button>

                    <!-- AREA PESAN -->
                    <div id="message-box" style="margin-top: 1rem; text-align: center; min-height: 40px;">
                        ${this.message ? html`<div class=${messageClass}>${this.message}</div>` : ''}
                    </div>
                    
                    <!-- Navigation Buttons -->
                    <div class="nav-buttons">
                        <button 
                            class="nav-button"
                            @click=${this.previousQuestion}
                            ?disabled=${this.currentQuestionIndex === 0}
                            style="background-color: ${this.currentQuestionIndex === 0 ? '#9ca3af' : '#6b7280'}; color: white;"
                        >
                            ← Sebelumnya
                        </button>
                        <button 
                            class="nav-button primary"
                            @click=${this.nextQuestion}
                            ?disabled=${!hasAnswered || !this.isDisabled}
                            style="background-color: ${hasAnswered && this.isDisabled ? '#2563eb' : '#9ca3af'}; color: white;"
                        >
                            ${isLastQuestion ? 'Lihat Hasil' : 'Selanjutnya →'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSummary() {
        const score = this.getScore();
        const percentage = this.getPercentage();
        const isPerfect = score === this.totalQuestions;
        
        return html`
            <div class="card">
                <div class="summary">
                    <h1>Hasil Kuis</h1>
                    
                    <div class="summary-score">
                        ${score} / ${this.totalQuestions}
                    </div>
                    
                    <div style="font-size: 1.5rem; color: #6b7280; margin-bottom: 2rem;">
                        ${percentage}% Benar
                    </div>
                    
                    ${isPerfect ? html`
                        <div style="color: #10b981; font-size: 1.25rem; margin-bottom: 1rem;">
                            🎉 Sempurna! Semua jawaban benar!
                        </div>
                    ` : ''}
                    
                    <!-- Detail Jawaban -->
                    <div style="margin-top: 2rem; text-align: left;">
                        <h2>Detail Jawaban:</h2>
                        ${this.questions.map((q, index) => {
                            const userAnswer = this.userAnswers[index] || '(tidak dijawab)';
                            const isCorrect = this.correctAnswers[index];
                            return html`
                                <div class="summary-item ${isCorrect ? 'correct' : 'incorrect'}">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem; color: ${isCorrect ? '#065f46' : '#991b1b'};">
                                        Soal ${index + 1}: ${q.question}
                                    </div>
                                    <div style="font-size: 0.875rem; color: ${isCorrect ? '#065f46' : '#991b1b'};">
                                        <strong>Jawaban Anda:</strong> ${userAnswer}<br>
                                        <strong>Jawaban Benar:</strong> ${q.answer}
                                    </div>
                                </div>
                            `;
                        })}
                    </div>
                    
                    <button 
                        class="nav-button primary"
                        @click=${this.restartQuiz}
                        style="margin-top: 2rem; width: 100%; padding: 1rem; font-size: 1.125rem; color: white;"
                    >
                        Ulangi Kuis
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('confetti-quiz', ConfettiQuiz);

// DDD-integrated confetti overlay component
class KuisConfeti extends LitElement {
  static properties = {
    running: { type: Boolean, reflect: true },
    duration: { type: Number },
    particleCount: { type: Number },
  };
  static styles = css`
    :host { position: fixed; inset: 0; pointer-events: none; display: block; z-index: 9999; }
    canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  `;
  constructor() {
    super();
    this.running = false;
    this.duration = 1500;
    this.particleCount = 180;
    this._particles = [];
    this._endAt = 0;
  }
  render() { return html`<canvas part="canvas" aria-hidden="true"></canvas>`; }
  firstUpdated() {
    this._canvas = this.renderRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      this._canvas.width = Math.floor(this.clientWidth * dpr);
      this._canvas.height = Math.floor(this.clientHeight * dpr);
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    this._resize = resize;
    resize();
    window.addEventListener('resize', resize, { passive: true });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resize);
    cancelAnimationFrame(this._raf);
  }
  fire(opts = {}) {
    const cs = getComputedStyle(document.documentElement);
    const colors = [
      cs.getPropertyValue('--ddd-theme-default-skyBlue')?.trim() || '#3da9fc',
      cs.getPropertyValue('--ddd-theme-default-accent')?.trim() || '#ef4565',
      cs.getPropertyValue('--ddd-theme-default-link')?.trim() || '#6246ea',
      cs.getPropertyValue('--ddd-theme-default-lime')?.trim() || '#84cc16',
      cs.getPropertyValue('--ddd-theme-default-warning')?.trim() || '#f59e0b',
    ];
    const width = this.clientWidth || window.innerWidth;
    const height = this.clientHeight || window.innerHeight;
    const count = opts.particleCount ?? this.particleCount;
    const spread = Math.PI / 2; // 90deg
    const angle = -Math.PI / 2; // up
    const speed = 6;
    this._particles = new Array(count).fill(0).map(() => {
      const theta = angle + (Math.random() - 0.5) * spread;
      const vx = Math.cos(theta) * (speed * (0.6 + Math.random() * 0.8));
      const vy = Math.sin(theta) * (speed * (0.6 + Math.random() * 0.8));
      return { x: width / 2, y: height * 0.85, vx, vy, g: 0.18 + Math.random() * 0.22, w: 6 + Math.random() * 6, h: 8 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, color: colors[Math.floor(Math.random() * colors.length)], alpha: 1 };
    });
    this._endAt = performance.now() + (opts.duration ?? this.duration);
    if (!this.running) { this.running = true; this._tick(); }
  }
  _tick = () => {
    this._raf = requestAnimationFrame(this._tick);
    const now = performance.now();
    if (now >= this._endAt && this._particles.length === 0) { this.running = false; cancelAnimationFrame(this._raf); return; }
    const ctx = this._ctx; if (!ctx) return;
    const w = this._canvas.width; const h = this._canvas.height;
    ctx.clearRect(0, 0, w, h);
    const still = [];
    for (const p of this._particles) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.alpha -= 0.008;
      if (p.alpha <= 0 || p.y > h + 20) continue;
      still.push(p);
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha)); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
    }
    this._particles = still;
  }
}
customElements.define('kuis-confeti', KuisConfeti);
export { KuisConfeti };
