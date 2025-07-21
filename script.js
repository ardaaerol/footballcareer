let scenes = {};
let currentSceneId = "scene1";

async function loadScenes() {
  const response = await fetch("scenes.json");
  const data = await response.json();
  scenes = data; // HATASIZ!
  loadScene(currentSceneId);
}

function loadScene(id) {
  const scene = scenes[id];
  currentSceneId = id;

  // Eğer image bir emoji ise, direkt göster.
  if (scene.image && scene.image.length <= 3) {
    document.getElementById("scene-image").innerText = scene.image;
  } else if (scene.image) {
    // Eğer image bir dosya adıysa, resim olarak göster.
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

// Oyun yüklenince başlat
loadScenes();
