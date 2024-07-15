document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    const quizSection = document.getElementById('quiz');
    const quizWelcome = document.querySelector('.quiz-welcome');
    const quizArea = document.querySelector('.quiz-area');
    const footer = document.querySelector('.footer');
    const user = document.getElementById('user');
    const cards = document.querySelectorAll('.card');
    const info = document.querySelector('.info');
    const scoreDisplay = document.getElementById('score');
    
    let username = localStorage.getItem('username') || '';
    let score = parseInt(localStorage.getItem('score') || '0', 10);
    scoreDisplay.innerHTML = score;

    function displayQuiz() {
        nameForm.style.display = 'none';
        info.style.display = 'none';
        quizSection.style.display = 'block';
        user.textContent = `${username}'s quiz`;
        quizWelcome.style.opacity = '1';
        quizWelcome.style.transform = 'translateY(0)';
        footer.style.display = 'none';

        setTimeout(() => {
            quizWelcome.innerHTML = '';
            quizWelcome.style.display = 'none';

            const randomIndex = Math.floor(Math.random() * cards.length);
            showCard(randomIndex);
            quizArea.style.display = 'block';
        }, 500);
    }

    if (username) {
        displayQuiz();
    }

    nameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        username = nameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            displayQuiz();
        }
    });

    function showCard(index) {
        cards.forEach(card => {
            card.style.display = 'none';
        });

        cards[index].style.display = 'block';

        const choices = cards[index].querySelectorAll('.choice');
        choices.forEach(choice => {
            choice.addEventListener('click', () => {
                if (!choice.dataset.clicked) {
                    choice.dataset.clicked = true;
                    if (choice.classList.contains('correct')) {
                        score++;
                        localStorage.setItem('score', score);
                        scoreDisplay.innerHTML = score;
                    }
                }

                choices.forEach(c => {
                    if (c.classList.contains('correct')) {
                        c.style.backgroundColor = '#5cb85c';
                    } else {
                        c.style.backgroundColor = '#d9534f';
                    }
                });

                setTimeout(() => {
                    resetCard(cards[index]);
                    const newIndex = getRandomCardIndex(index);
                    showCard(newIndex);
                }, 1500);
            });
        });
    }

    function resetCard(card) {
        const choices = card.querySelectorAll('.choice');
        choices.forEach(choice => {
            choice.style.backgroundColor = '#eee';
            delete choice.dataset.clicked;
        });
    }

    function getRandomCardIndex(currentIndex) {
        let newIndex = Math.floor(Math.random() * cards.length);
        while (newIndex === currentIndex) {
            newIndex = Math.floor(Math.random() * cards.length);
        }
        return newIndex;
    }

    // Save player data when the page unloads
    window.addEventListener('beforeunload', () => {
        const player = {
            name: username,
            score: score
        };
        localStorage.setItem(`player_${username}`, JSON.stringify(player));
    });
});
// Function to update the leaderboard
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');

    // Fetch all players from localStorage
    let players = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('player_')) {
            const playerData = JSON.parse(localStorage.getItem(key));
            players.push(playerData);
        }
    }

    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    // Display the top 10 players
    leaderboardList.innerHTML = ''; // Clear the list first
    for (let i = 0; i < Math.min(10, players.length); i++) {
        const player = players[i];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${i + 1}. ${player.name} /Score: </span><span>${player.score}</span>`;
        leaderboardList.appendChild(listItem);
    }
}

// Call updateLeaderboard when the page loads
document.addEventListener('DOMContentLoaded', updateLeaderboard);
