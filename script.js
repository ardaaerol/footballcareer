let scenes = {};
let currentSceneId = "scene1";

async function loadScenes() {
  console.log("Starting to load scenes...");
  const response = await fetch("scenes.json");
  const data = await response.json();

  console.log("Response status:", response.status);
  console.log("Data type: object Is array:", Array.isArray(data));

  // scenes.json bir dizi mi, yoksa doğrudan bir nesne mi kontrol edelim
  if (Array.isArray(data)) {
    data.forEach(scene => {
      scenes[scene.id] = scene;
    });
  } else {
    scenes = data;
  }

  console.log("Scenes loaded successfully:", Object.keys(scenes).length, "scenes");
  console.log("Available scene IDs:", Object.keys(scenes));

  loadScene(currentSceneId);
}

function loadScene(id) {
  const scene = scenes[id];
  if (!scene) {
    console.error("Scene not found:", id);
    return;
  }

  currentSceneId = id;

  // Görsel gösterimi kaldırıldı
  // document.getElementById("scene-image").src = "images/" + scene.image;

  document.getElementById("scene-text").innerText = scene.text;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  scene.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.onclick = () => loadScene(option.nextScene);
    optionsContainer.appendChild(button);
  });

  if (scene.options.length === 0) {
    const endText = document.createElement("p");
    endText.innerText = "🏁 Oyun Sonu";
    optionsContainer.appendChild(endText);
  }
}

document.addEventListener("DOMContentLoaded", loadScenes);
