let scenes = {};
let currentSceneId = "scene1";

async function loadScenes() {
  const response = await fetch("scenes.json");
  scenes = await response.json(); // direkt object!
  loadScene(currentSceneId);
}

function loadScene(id) {
  const scene = scenes[id];
  currentSceneId = id;

  // Eğer image bir emoji ise bu satırı güncelle!
  // document.getElementById("scene-image").innerText = scene.image;  // <-- emoji için
  // Eğer image dosya ismi ise:
  // document.getElementById("scene-image").src = "images/" + scene.image; // <-- resim için

  document.getElementById("scene-title").innerText = scene.title || "";
  document.getElementById("scene-image").innerText = scene.image || "";
  document.getElementById("scene-text").innerText = scene.text || "";
  document.getElementById("player-thoughts").innerText = scene.playerThoughts || "";

  const optionsContainer = document.getElementById("choices-container");
  optionsContainer.innerHTML = "";

  if (scene.options && scene.options.length > 0) {
    scene.options.forEach(option => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.innerText = option.text;
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
