const questions = [
  {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2
  },
  {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1
  },
  {
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correct: 1
  },
  {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: 1
  },
  {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2
  },
  {
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3
  },
  {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correct: 1
  },
  {
      question: "What is the fastest land animal?",
      options: ["Lion", "Cheetah", "Leopard", "Tiger"],
      correct: 1
  },
  {
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2
  },
  {
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1
  }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let timer = 30;
let timerInterval;
let currentUser = null;
let users = {}; // In-memory user storage

// Authentication Functions
function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  clearAuthMessage();
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  clearAuthMessage();
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
      showAuthMessage('Please fill in all fields', 'error');
      return;
  }

  // Check if user exists and password matches
  if (users[username] && users[username].password === password) {
      currentUser = users[username];
      showAuthMessage('Login successful!', 'success');
      setTimeout(() => {
          showMainScreen();
      }, 1000);
  } else {
      showAuthMessage('Invalid username or password', 'error');
  }
}

function signup() {
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
      showAuthMessage('Please fill in all fields', 'error');
      return;
  }

  if (username.length < 3) {
      showAuthMessage('Username must be at least 3 characters long', 'error');
      return;
  }

  if (password.length < 6) {
      showAuthMessage('Password must be at least 6 characters long', 'error');
      return;
  }

  if (password !== confirmPassword) {
      showAuthMessage('Passwords do not match', 'error');
      return;
  }

  if (!isValidEmail(email)) {
      showAuthMessage('Please enter a valid email address', 'error');
      return;
  }

  // Check if username already exists
  if (users[username]) {
      showAuthMessage('Username already exists', 'error');
      return;
  }

  // Create new user
  users[username] = {
      username: username,
      email: email,
      password: password,
      highScore: 0,
      gamesPlayed: 0
  };

  showAuthMessage('Account created successfully! Please login.', 'success');
  setTimeout(() => {
      showLogin();
      clearAuthMessage();
  }, 1500);
}

function logout() {
  currentUser = null;
  showScreen('authScreen');
  clearForms();
  clearAuthMessage();
}

function showMainScreen() {
  document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.username}! 🎯`;
  showScreen('startScreen');
  clearForms();
}

function showAuthMessage(message, type) {
  const authMessage = document.getElementById('authMessage');
  authMessage.innerHTML = `<div class="${type}-message">${message}</div>`;
}

function clearAuthMessage() {
  document.getElementById('authMessage').innerHTML = '';
}

function clearForms() {
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('signupUsername').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Initialize with demo account
function initializeDemoAccount() {
  users['demo'] = {
      username: 'demo',
      email: 'demo@quizmaster.com',
      password: 'demo123',
      highScore: 70,
      gamesPlayed: 5
  };
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
      particlesContainer.appendChild(particle);
  }
}

function showScreen(screenId) {
  document.querySelectorAll('.game-screen').forEach(screen => {
      screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  showScreen('quizScreen');
  displayQuestion();
  startTimer();
}

function displayQuestion() {
  const question = questions[currentQuestion];
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('questionNumber').textContent = `${currentQuestion + 1}/10`;
  document.getElementById('currentScore').textContent = score;
  
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.textContent = option;
      optionElement.onclick = () => selectAnswer(index);
      optionsContainer.appendChild(optionElement);
  });
  
  document.getElementById('nextBtn').style.display = 'none';
  updateProgressBar();
  resetTimer();
}

function selectAnswer(answerIndex) {
  if (selectedAnswer !== null) return;
  
  selectedAnswer = answerIndex;
  const options = document.querySelectorAll('.option');
  const correctAnswer = questions[currentQuestion].correct;
  
  clearInterval(timerInterval);
  
  options[answerIndex].classList.add('selected');
  
  setTimeout(() => {
      options[correctAnswer].classList.add('correct');
      
      if (answerIndex !== correctAnswer) {
          options[answerIndex].classList.add('incorrect');
      } else {
          score += 10;
          document.getElementById('currentScore').textContent = score;
      }
      
      document.getElementById('nextBtn').style.display = 'block';
  }, 500);
}

function nextQuestion() {
  currentQuestion++;
  selectedAnswer = null;
  
  if (currentQuestion < questions.length) {
      displayQuestion();
      startTimer();
  } else {
      showResults();
  }
}

function startTimer() {
  timer = 30;
  document.getElementById('timer').textContent = timer;
  
  timerInterval = setInterval(() => {
      timer--;
      document.getElementById('timer').textContent = timer;
      
      if (timer <= 0) {
          clearInterval(timerInterval);
          if (selectedAnswer === null) {
              selectAnswer(-1); // Auto-select wrong answer when time runs out
          }
      }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timer = 30;
  document.getElementById('timer').textContent = timer;
}

function updateProgressBar() {
  const progress = ((currentQuestion) / questions.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
}

function showResults() {
  showScreen('resultScreen');
  document.getElementById('finalScore').textContent = `${score}/100`;
  
  // Update user stats
  if (currentUser) {
      currentUser.gamesPlayed++;
      if (score > currentUser.highScore) {
          currentUser.highScore = score;
      }
  }
  
  let message = '';
  let details = '';
  
  if (score >= 80) {
      message = "🏆 Outstanding! You're a Quiz Master!";
      details = "Incredible knowledge! You got most questions right!";
  } else if (score >= 60) {
      message = "🎉 Great Job! Well Done!";
      details = "Good performance! Keep up the great work!";
  } else if (score >= 40) {
      message = "👍 Not Bad! Room for Improvement";
      details = "You're getting there! Practice makes perfect!";
  } else {
      message = "📚 Keep Learning! You Can Do Better!";
      details = "Don't give up! Every expert was once a beginner!";
  }
  
  document.getElementById('resultMessage').textContent = message;
  document.getElementById('resultDetails').textContent = details;
}

function restartQuiz() {
  showScreen('startScreen');
  clearInterval(timerInterval);
}

// Initialize the app
function initializeApp() {
  initializeDemoAccount();
  createParticles();
  
  // Add enter key support for forms
  document.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          const activeScreen = document.querySelector('.game-screen.active');
          if (activeScreen.id === 'authScreen') {
              const loginVisible = document.getElementById('loginForm').style.display !== 'none';
              if (loginVisible) {
                  login();
              } else {
                  signup();
              }
          }
      }
  });
}

// Initialize on page load
initializeApp();