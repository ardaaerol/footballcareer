// Oyun durumu
let scenes = {};
let currentSceneId = "scene1";
let stats = {
    skill: 70,
    mentality: 75,
    popularity: 50,
    age: 17,
    experience: 0,
    club: "Kartalspor U17"
};
let achievements = [];

// DOM elementleri
const elements = {
    sceneTitle: document.getElementById("scene-title"),
    sceneText: document.getElementById("scene-text"),
    playerThoughts: document.getElementById("player-thoughts"),
    choicesContainer: document.getElementById("choices-container"),
    finalStats: document.getElementById("final-stats"),
    restartContainer: document.getElementById("restart-container"),
    restartBtn: document.getElementById("restart-btn"),
    loadingScreen: document.getElementById("loading-screen"),
    skillValue: document.getElementById("skill-value"),
    mentalityValue: document.getElementById("mentality-value"),
    popularityValue: document.getElementById("popularity-value"),
    ageValue: document.getElementById("age-value"),
    experienceValue: document.getElementById("experience-value"),
    currentClub: document.getElementById("current-club"),
    achievementsList: document.getElementById("achievements-list")
};

// Oyunu başlat
async function initGame() {
    // Event listener'ları ekle
    elements.restartBtn.addEventListener("click", restartGame);
    
    // Sahneleri yükle
    await loadScenes();
    
    // İlk sahneyi yükle
    loadScene(currentSceneId);
}

// Sahneleri yükle
async function loadScenes() {
    try {
        const response = await fetch("scenes.json");
        scenes = await response.json();
        
        // Yükleme ekranını kapat
        elements.loadingScreen.style.opacity = "0";
        setTimeout(() => {
            elements.loadingScreen.style.display = "none";
        }, 500);
    } catch (error) {
        console.error("Scenes loading error:", error);
        elements.loadingScreen.style.display = "none";
        
        // Fallback basit sahne
        scenes = {
            scene1: {
                title: "Error Loading Game",
                text: "Sorry, the game data could not be loaded. Please try again later.",
                options: []
            }
        };
    }
}

// Sahneyi yükle
function loadScene(id) {
    const scene = scenes[id];
    if (!scene) {
        console.error("Scene not found:", id);
        return;
    }

    currentSceneId = id;
    elements.sceneTitle.textContent = scene.title;
    elements.sceneText.textContent = scene.text;
    
    // Oyuncu düşüncelerini göster/gizle
    if (scene.playerThoughts) {
        elements.playerThoughts.textContent = scene.playerThoughts;
        elements.playerThoughts.style.display = "block";
    } else {
        elements.playerThoughts.style.display = "none";
    }

    // Seçenekleri temizle
    elements.choicesContainer.innerHTML = "";

    if (scene.options && scene.options.length > 0) {
        // Seçenek butonlarını oluştur
        scene.options.forEach(option => {
            const button = document.createElement("button");
            button.className = "choice-btn";
            button.textContent = option.text;
            button.onclick = () => {
                if (option.effects) {
                    applyEffects(option.effects);
                }
                loadScene(option.nextScene);
            };
            elements.choicesContainer.appendChild(button);
        });
    } else {
        // Oyun sonu senaryosu
        showFinalStats(scene.finalStats);
        elements.restartContainer.style.display = "block";
    }

    // Başarıları ekle
    if (scene.achievements) {
        addAchievements(scene.achievements);
    }
}

// Etkileri uygula (istatistik güncelleme)
function applyEffects(effects) {
    for (const stat in effects) {
        if (stats.hasOwnProperty(stat)) {
            stats[stat] += effects[stat];
            updateStatDisplay(stat);
        }
    }
}

// İstatistik görüntüsünü güncelle
function updateStatDisplay(stat) {
    const valueElements = {
        skill: elements.skillValue,
        mentality: elements.mentalityValue,
        popularity: elements.popularityValue,
        age: elements.ageValue,
        experience: elements.experienceValue,
        club: elements.currentClub
    };
    
    if (valueElements[stat]) {
        valueElements[stat].textContent = stat === 'experience' ? 
            `${stats[stat]} XP` : stats[stat];
    }
}

// Başarı ekle
function addAchievements(newAchievements) {
    // Zaten var olan başarıları filtrele
    newAchievements = newAchievements.filter(ach => !achievements.includes(ach));
    
    if (newAchievements.length === 0) return;
    
    // Başarı listesine ekle
    achievements.push(...newAchievements);
    
    // UI'ı güncelle
    if (elements.achievementsList.querySelector(".no-achievements")) {
        elements.achievementsList.innerHTML = "";
    }
    
    // Yeni başarı rozetlerini oluştur
    newAchievements.forEach(achievement => {
        const badge = document.createElement("span");
        badge.className = "achievement-badge";
        badge.textContent = achievement;
        elements.achievementsList.appendChild(badge);
        
        // Bildirim göster
        showAchievementNotification(achievement);
    });
}

// Başarı bildirimi göster
function showAchievementNotification(achievement) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `<i class="fas fa-trophy"></i> Yeni Başarı: ${achievement}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("show");
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Final istatistiklerini göster
function showFinalStats(finalStats) {
    elements.finalStats.style.display = "block";
    
    let html = `<h3>Kariyer İstatistiklerin</h3><div class="final-stats-grid">`;
    
    for (const stat in finalStats) {
        html += `
            <div class="final-stat">
                <span class="stat-name">${stat.replace('_', ' ')}</span>
                <span class="stat-value">${finalStats[stat]}</span>
            </div>
        `;
    }
    
    html += `</div>`;
    
    if (achievements.length > 0) {
        html += `
            <div class="achievements-summary">
                <h4>Kazandığın Başarılar</h4>
                ${achievements.map(ach => `<span class="achievement-badge">${ach}</span>`).join('')}
            </div>
        `;
    }
    
    elements.finalStats.innerHTML = html;
}

// Oyunu yeniden başlat
function restartGame() {
    // Oyun durumunu sıfırla
    stats = {
        skill: 70,
        mentality: 75,
        popularity: 50,
        age: 17,
        experience: 0,
        club: "Kartalspor U17"
    };
    achievements = [];
    
    // İstatistikleri güncelle
    elements.skillValue.textContent = stats.skill;
    elements.mentalityValue.textContent = stats.mentality;
    elements.popularityValue.textContent = stats.popularity;
    elements.ageValue.textContent = stats.age;
    elements.experienceValue.textContent = `${stats.experience} XP`;
    elements.currentClub.textContent = stats.club;
    
    // Başarıları sıfırla
    elements.achievementsList.innerHTML = 
        '<span class="no-achievements">Henüz başarı yok</span>';
    
    // UI elementlerini gizle
    elements.restartContainer.style.display = "none";
    elements.finalStats.style.display = "none";
    
    // İlk sahneyi yükle
    currentSceneId = "scene1";
    loadScene(currentSceneId);
}

// Sayfa yüklendiğinde oyunu başlat
document.addEventListener("DOMContentLoaded", initGame);
