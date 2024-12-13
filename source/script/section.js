// Объект с информацией о каждом узле
const nodeInfo = {
  "Vladimir Hermann": {
    text: "Герман Владимир Александрович / Vladimir Hermann...",
    images: [
      "source/images1/5coOw4GiK3c.jpg",
      "source/images1/_000033.jpg",
      "source/images1/20190907_143937.jpg",
      "source/images1/1980 год_000045.jpg",
      "source/images1/май 1978 года_000042.jpg",
      "source/images1/май 1978 года_000043.jpg",
    ],
    URL: "C:\\Users\\vlad_\\Meine Projeckte\\test1\\Vladimir.html",
  },
  // Добавьте остальные узлы с информацией и массивами изображений
};

function updateSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const margin = { top: 20, right: 100, bottom: 100, left: 100 };

  d3.select("svg").attr("width", width).attr("height", height);

  const svg = d3
    .select("svg")
    .select("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const root = d3.hierarchy(data);
  const treeLayout = d3
    .tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
  treeLayout(root);

  svg.selectAll(".link").remove();
  svg.selectAll(".node").remove();

  // Создание связей (линий)
  svg
    .selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal().x((d) => width - margin.right - margin.left - d.y).y((d) => d.x))
    .attr("stroke", "#ccc")
    .attr("fill", "none")
    .attr("stroke-width", 2);

  const nodes = svg
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${width - margin.right - margin.left - d.y},${d.x}) scale(0.9)`);

  // Создаем узлы-круги с событиями
  nodes
    .append("circle")
    .attr("r", 5)
    .on("mouseover", (event, d) => showTooltip(event, d.data.name)) // При наведении
    .on("mouseout", hideTooltip) // При уходе мыши
    .on("click", (event, d) => showNodeInfo(d.data.name));

  nodes
    .append("text")
    .attr("dy", 3)
    .attr("x", (d) => (d.children ? 15 : -15))
    .style("text-anchor", (d) => (d.children ? "start" : "end"))
    .style("font-size", "11px")
    .text((d) => d.data.name);

  let currentImageIndex = 0; // Текущий индекс изображения
  let currentNodeImages = []; // Массив изображений текущего узла

  function showNodeInfo(name) {
    const info = nodeInfo[name];

    if (info && info.url) {
      window.open(info.url, "_blank");
    } else {
      openModalWindow(info, name);
    }
  }

  function openModalWindow(info, name) {
    const nodeInfoContainer = document.getElementById("node-info");
    const nodeNameElem = document.getElementById("node-name");
    const nodeDetailsElem = document.getElementById("node-details");
    const nodeImageElem = document.getElementById("node-image");

    nodeNameElem.textContent = name;
    nodeDetailsElem.textContent = info ? info.text : "Информация не найдена.";

    currentNodeImages = info && info.images ? info.images : [];
    currentImageIndex = 0;
    updateImage();

    nodeImageElem.onclick = function () {
      showLargeImage(this.src);
    };

    nodeInfoContainer.style.display = "block";
  }

  function updateImage() {
    const nodeImageElem = document.getElementById("node-image");
    if (currentNodeImages.length > 0) {
      nodeImageElem.src = currentNodeImages[currentImageIndex];
      nodeImageElem.style.display = "block";
    } else {
      nodeImageElem.style.display = "none";
    }
  }

  function showNextImage() {
    if (currentNodeImages.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % currentNodeImages.length;
      updateImage();
    }
  }

  function showPrevImage() {
    if (currentNodeImages.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + currentNodeImages.length) % currentNodeImages.length;
      updateImage();
    }
  }

  document.getElementById("next-btn").addEventListener("click", showNextImage);
  document.getElementById("prev-btn").addEventListener("click", showPrevImage);

  function showTooltip(event, name) {
    const tooltip = d3.select("#tooltip");
    tooltip
      .style("display", "block")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px")
      .text(`Информация о: ${name}`);
  }

  function hideTooltip() {
    d3.select("#tooltip").style("display", "none");
  }
}

function closeNodeInfo() {
  document.getElementById("node-info").style.display = "none";
}

function showLargeImage(src) {
  const largeImageContainer = document.getElementById("large-image-container");
  const largeImage = document.getElementById("large-image");

  largeImage.src = src;
  largeImageContainer.style.display = "block";
}

function closeLargeImage() {
  document.getElementById("large-image-container").style.display = "none";
}

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g");

window.addEventListener("resize", updateSize);
updateSize();
