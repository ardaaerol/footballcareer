let scenes = {};
let currentSceneId = "scene1";

async function loadScenes() {
  try {
    const response = await fetch("scenes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Ensure data is an object with scenes
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid JSON data format');
    }
    
    scenes = data;
    console.log('Scenes loaded successfully:', Object.keys(scenes).length, 'scenes');
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

  // Görsel gösterme
  if (scene.image && scene.image.length <= 3) {
    document.getElementById("scene-image").innerText = scene.image;
  } else if (scene.image) {
    document.getElementById("scene-image").innerHTML = `<img src="images/${scene.image}" alt="Sahne Görseli" />`;
  }

  document.getElementById("scene-title").innerText = scene.title || "";
  document.getElementById("scene-text").innerText = scene.text || "";
  document.getElementById("player-thoughts").innerText = scene.playerThoughts || "";

  const optionsContainer = document.getElementById("choices-container");
  optionsContainer.innerHTML = "";

  if (scene.options && scene.options.length > 0) {
    scene.options.forEach(option => {
      const button = document.createElement("button");
      button.innerText = option.text;
      button.className = "choice-btn";
      button.onclick = () => loadScene(option.nextScene);
      optionsContainer.appendChild(button);
    });
  } else {
    const endText = document.createElement("p");
    endText.innerText = "🏁 Oyun Sonu";
    optionsContainer.appendChild(endText);
  }
}

loadScenes();
