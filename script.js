let scenes = {};
let currentSceneId = "scene1";
let gameHistory = [];
let playerStats = {
    skill: 70,
    mentality: 75,
    popularity: 50,
    age: 17,
    experience: 0
};
let playerInfo = {
    currentClub: "Kartalspor U17",
    achievements: []
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    loadScenes();
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
    
    // Simulate loading progress
    const progressBar = document.querySelector('.loading-progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 200);
}

async function loadScenes() {
    try {
        const response = await fetch("scenes.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid JSON data format');
        }
        
        scenes = data;
        console.log('Scenes loaded successfully:', Object.keys(scenes).length, 'scenes');
        
        // Initialize UI
        updateStatsDisplay();
        updatePlayerInfo();
        loadScene(currentSceneId);
    } catch (error) {
        console.error('Error loading scenes:', error);
        document.getElementById("scene-title").innerText = "Hata!";
        document.getElementById("scene-text").innerText = "Oyun yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.";
    }
}

function loadScene(id) {
    const scene = scenes[id];
    if (!scene) {
        console.error('Scene not found:', id);
        document.getElementById("scene-title").innerText = "Hata!";
        document.getElementById("scene-text").innerText = `Sahne bulunamadı: ${id}`;
        return;
    }
    
    currentSceneId = id;
    
    // Add to history
    gameHistory.push({
        sceneId: id,
        title: scene.title,
        timestamp: new Date().toLocaleTimeString()
    });

    // Update scene display
    if (scene.image) {
        if (!scene.image.includes('.')) {
            document.getElementById("scene-image").innerText = scene.image;
        } else {
            document.getElementById("scene-image").innerHTML = `<img src="images/${scene.image}" alt="Sahne Görseli" />`;
        }
    }

    document.getElementById("scene-title").innerText = scene.title || "";
    document.getElementById("scene-text").innerText = scene.text || "";
    document.getElementById("player-thoughts").innerText = scene.playerThoughts || "";

    // Handle achievements
    if (scene.achievements && scene.achievements.length > 0) {
        scene.achievements.forEach(achievement => {
            if (!playerInfo.achievements.includes(achievement)) {
                playerInfo.achievements.push(achievement);
                showAchievementNotification(achievement);
            }
        });
        updateAchievementsDisplay();
    }

    // Handle choices
    const optionsContainer = document.getElementById("choices-container");
    optionsContainer.innerHTML = "";

    if (scene.options && scene.options.length > 0) {
        scene.options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option.text;
            button.className = "choice-btn";
            button.onclick = () => makeChoice(option);
            optionsContainer.appendChild(button);
        });
    } else {
        // Game ending
        const endText = document.createElement("div");
        endText.className = "game-ending";
        endText.innerHTML = `
            <h3>🏁 Oyun Sonu</h3>
            <p>Hikayeniz burada sona eriyor.</p>
        `;
        optionsContainer.appendChild(endText);
        
        // Show final stats
        showFinalStats();
        
        // Show restart button
        document.getElementById("restart-container").style.display = "block";
    }
}

function makeChoice(option) {
    // Apply effects to stats
    if (option.effects) {
        Object.keys(option.effects).forEach(stat => {
            if (playerStats.hasOwnProperty(stat)) {
                playerStats[stat] += option.effects[stat];
                // Ensure stats stay within reasonable bounds
                if (stat === 'age') {
                    playerStats[stat] = Math.max(17, Math.min(40, playerStats[stat]));
                } else {
                    playerStats[stat] = Math.max(0, Math.min(100, playerStats[stat]));
                }
            }
        });
        updateStatsDisplay();
    }
    
    // Load next scene
    loadScene(option.nextScene);
}

function updateStatsDisplay() {
    document.getElementById("skill-value").innerText = playerStats.skill;
    document.getElementById("mentality-value").innerText = playerStats.mentality;
    document.getElementById("popularity-value").innerText = playerStats.popularity;
    document.getElementById("age-value").innerText = playerStats.age;
    document.getElementById("experience-value").innerText = playerStats.experience + " XP";
}

function updatePlayerInfo() {
    document.getElementById("current-club").innerText = playerInfo.currentClub;
}

function updateAchievementsDisplay() {
    const achievementsList = document.getElementById("achievements-list");
    if (playerInfo.achievements.length === 0) {
        achievementsList.innerHTML = '<span class="no-achievements">Henüz başarı yok</span>';
    } else {
        achievementsList.innerHTML = playerInfo.achievements
            .map(achievement => `<div class="achievement-item">🏆 ${achievement}</div>`)
            .join('');
    }
}

function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <i class="fas fa-trophy"></i>
        <span>Başarı Kazanıldı: ${achievement}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function showFinalStats() {
    const finalStatsContainer = document.getElementById("final-stats");
    finalStatsContainer.innerHTML = `
        <h3>Final İstatistikleriniz</h3>
        <div class="final-stats-grid">
            <div class="final-stat">
                <span class="stat-name">Yetenek:</span>
                <span class="stat-value">${playerStats.skill}</span>
            </div>
            <div class="final-stat">
                <span class="stat-name">Mentalite:</span>
                <span class="stat-value">${playerStats.mentality}</span>
            </div>
            <div class="final-stat">
                <span class="stat-name">Popülerlik:</span>
                <span class="stat-value">${playerStats.popularity}</span>
            </div>
            <div class="final-stat">
                <span class="stat-name">Yaş:</span>
                <span class="stat-value">${playerStats.age}</span>
            </div>
            <div class="final-stat">
                <span class="stat-name">Deneyim:</span>
                <span class="stat-value">${playerStats.experience} XP</span>
            </div>
        </div>
        <div class="achievements-summary">
            <h4>Kazanılan Başarılar: ${playerInfo.achievements.length}</h4>
            ${playerInfo.achievements.map(a => `<span class="achievement-badge">${a}</span>`).join('')}
        </div>
    `;
    finalStatsContainer.style.display = "block";
}

function restartGame() {
    // Reset all game state
    currentSceneId = "scene1";
    gameHistory = [];
    playerStats = {
        skill: 70,
        mentality: 75,
        popularity: 50,
        age: 17,
        experience: 0
    };
    playerInfo = {
        currentClub: "Kartalspor U17",
        achievements: []
    };
    
    // Hide ending elements
    document.getElementById("final-stats").style.display = "none";
    document.getElementById("restart-container").style.display = "none";
    
    // Update displays
    updateStatsDisplay();
    updatePlayerInfo();
    updateAchievementsDisplay();
    
    // Load first scene
    loadScene(currentSceneId);
}

function toggleHistory() {
    const historyContent = document.getElementById("history-content");
    const historyPanel = document.getElementById("history-panel");
    
    if (historyContent.style.display === "none" || historyContent.style.display === "") {
        // Show history
        historyContent.innerHTML = gameHistory.map(entry => 
            `<div class="history-entry">
                <span class="history-time">${entry.timestamp}</span>
                <span class="history-title">${entry.title}</span>
            </div>`
        ).join('');
        historyContent.style.display = "block";
        historyPanel.classList.add('expanded');
    } else {
        // Hide history
        historyContent.style.display = "none";
        historyPanel.classList.remove('expanded');
    }
}

// Initialize the game
loadScenes();
