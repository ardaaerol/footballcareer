let scenes = {};
let currentSceneId = "scene1";

async function loadScenes() {
  const response = await fetch("scenes.json");
  const data = await response.json();
  scenes = {};
  data.forEach(scene => scenes[scene.id] = scene);
  loadScene(currentSceneId);
}

function loadScene(id) {
  const scene = scenes[id];
  currentSceneId = id;

  document.getElementById("scene-image").src = "images/" + scene.image;
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

loadScenes();
