const world = document.querySelector(".game-world");
const gameIntro = document.querySelector(".game-intro");

const normalThemeArr = [
  "url('tile2/sky.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop.jpg')",
  "url('tile2/lower-tree.jpg')",
  "url('tile2/tree-leaves.png')",
  "url('tile2/cloud.png')",
];
const snowThemeArr = [
  "url('tile2/sky-snow.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop-snow.jpg')",
  "url('tile2/lower-tree-snow.jpg')",
  "url('tile2/tree-leaves-snow.png')",
  "url('tile2/cloud-snow.jpg')",
];
const desertThemeArr = [
  "url('tile2/sky-desert.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop-desert.jpg')",
  "url('tile2/lower-tree-desert.png')",
  "url('tile2/tree-leaves-desert.png')",
  "url('tile2/cloud-desert.jpg')",
];
const outerThemeArr = [
  "url('tile2/sky-outer.jpg')",
  "url('tile2/soil-outer.jpg')",
  "url('tile2/soiltop-outer.png')",
  "url('tile2/lower-tree-outer.jpg')",
  "url('tile2/tree-leaves-outer.png')",
  "url('tile2/cloud-outer.jpg')",
];

const themesMapper = new Map([
  ["normal", normalThemeArr],
  ["desert", desertThemeArr],
  ["snow", snowThemeArr],
  ["outer", outerThemeArr],
]);

gameModes = document.querySelectorAll(".game-mode");
gameModes.forEach((mode) =>
  mode.addEventListener("click", (e) => {
    const rootStyle = document.documentElement.style;
    const themes = themesMapper.get(e.target.id);
    console.log(themes);
    rootStyle.setProperty("--world-background", themes[0]);
    rootStyle.setProperty("--ground-background", themes[1]);
    rootStyle.setProperty("--ground-top-background", themes[2]);
    rootStyle.setProperty("--tree-lower-background", themes[3]);
    rootStyle.setProperty("--tree-upper-background", themes[4]);
    rootStyle.setProperty("--cloud-background", themes[5]);
  })
);

// document.documentElement.style.setProperty(
//   "--world-background",
//   'url("tile2/sky-snow.jpg")'
// );

const resourceToolMapper = new Map([
  ["ground-top-tile", "shovel"],
  ["ground-tile", "shovel"],
  ["tree-lower-tile", "axe"],
  ["tree-upper-tile", "axe"],
]);

document.querySelector(".start-game").addEventListener("click", () => {
  const worldWidthInputEl = document.querySelector(".world-width-input");
  let valueParsed = parseInt(worldWidthInputEl.value);
  console.log(valueParsed);
  let min = parseInt(worldWidthInputEl.getAttribute("min"));
  let max = parseInt(worldWidthInputEl.getAttribute("max"));
  if (!valueParsed) {
    generateWorld(Math.floor(Math.random() * 6000) + 1200);
    gameIntro.classList.add("disabled");
  } else if (valueParsed > min && valueParsed < max) {
    generateWorld(worldWidthInputEl.textContent);
    gameIntro.classList.add("disabled");
  } else {
    alert("please enter a width in the range of ");
  }
  console.log(worldWidthInputEl.value);
});

const generateWorld = (width) => {
  console.log(world.style.width);
  world.style.width = `${width}px`;
  console.log(world.style.width);
  const gameRows = window
    .getComputedStyle(world)
    .getPropertyValue("grid-template-rows")
    .split(" ").length;
  const gameCols = window
    .getComputedStyle(world)
    .getPropertyValue("grid-template-columns")
    .split(" ").length;
  console.log(gameCols);
  console.log(gameRows);
  createGameWorld(gameRows, gameCols);
  generateGround(gameWorldMat, gameRows, gameCols);
  generateTree(gameWorldMat, gameRows, gameCols);
  generateCloud(gameWorldMat, gameRows, gameCols);
};

// to be attached to an Obj:
let randomGroundTopLevel;

gameWorldMat = [];
const createGameWorld = (rows, cols) => {
  for (let i = 0; i < rows; ++i) {
    let row = [];
    for (let j = 0; j < cols; ++j) {
      let cell = document.createElement("div");
      cell.className = "empty";
      world.appendChild(cell);
      row.push(cell);
    }
    gameWorldMat.push(row);
  }
};

const generateGround = (worldMat, rows, cols) => {
  randomGroundTopLevel = Math.floor(Math.random() * 4) + rows - 5;
  for (let i = randomGroundTopLevel; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      let groundCell = worldMat[i][j];
      groundCell.className =
        i === randomGroundTopLevel ? "ground-top-tile" : "ground-tile";
      groundCell.setAttribute("data-isResource", "true");
    }
  }
};

const createTree = (worldMat, colsPosArr) => {
  colsPosArr.forEach((c) => {
    let randomNumOfLowerTree = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < randomNumOfLowerTree; ++i) {
      let treeCell = worldMat[randomGroundTopLevel - 1 - i][c];
      treeCell.className = "tree-lower-tile";
      treeCell.setAttribute("data-isResource", "true");
    }
    let leavesStartRow = randomGroundTopLevel - randomNumOfLowerTree;
    randomNumOfLeaves = Math.floor(Math.random() * 2) + 1 === 1 ? 5 : 3;
    let startLeavesCol = c - Math.floor(randomNumOfLeaves / 2);
    for (let i = 0; i < randomNumOfLeaves; ++i) {
      for (let j = 0; j < randomNumOfLeaves; ++j) {
        let treeCell = worldMat[leavesStartRow - i][startLeavesCol + j];
        treeCell.className = "tree-upper-tile";
        treeCell.setAttribute("data-isResource", "true");
      }
    }
  });
};

const generateTree = (worldMat, rows, cols) => {
  let numOfGeneratedTrees = Math.floor(cols / 10); //29 -> 2
  let generatedTreesCols = [];
  while (numOfGeneratedTrees > 0) {
    let randomTreeColPos = Math.floor(Math.random() * (cols - 5)) + 3;
    if (
      generatedTreesCols.length === 0 ||
      !generatedTreesCols.find((c) => Math.abs(c - randomTreeColPos) < 6)
    ) {
      console.log(numOfGeneratedTrees);
      generatedTreesCols.push(randomTreeColPos);
      numOfGeneratedTrees--;
    }
  }
  createTree(worldMat, generatedTreesCols);
};

const createCloud = (worldMat, colsPosArr) => {
  colsPosArr.forEach((c) => {
    let cloudStartRow = Math.floor(Math.random() * 2);
    let numOfCloudRows = Math.floor(Math.random() * 1) + 3;
    let cloudHeadTailPos = Math.floor(Math.random() * 4) + 1;
    worldMat[cloudStartRow][c + cloudHeadTailPos].className = "cloud-tile";
    for (let i = 1; i < numOfCloudRows; ++i) {
      for (let j = 0; j < 6; ++j) {
        if (i !== 1 || (j !== 0 && j !== 5)) {
          worldMat[cloudStartRow + i][c + j].className = "cloud-tile";
        }
      }
    }
    cloudHeadTailPos = Math.floor(Math.random() * 6);
    worldMat[numOfCloudRows][c + cloudHeadTailPos].className = worldMat[
      numOfCloudRows
    ][c + cloudHeadTailPos - 1].className = "cloud-tile";
  });
};

const generateCloud = (worldMat, rows, cols) => {
  let numOfGeneratedClouds = Math.floor(cols / 15);
  let generatedCloudCols = [];
  while (numOfGeneratedClouds > 0) {
    let randomCloudsColsPos = Math.floor(Math.random() * (cols - 8)) + 3;
    if (
      generatedCloudCols.length === 0 ||
      !generatedCloudCols.find((c) => Math.abs(c - randomCloudsColsPos) < 7)
    ) {
      generatedCloudCols.push(randomCloudsColsPos);
      numOfGeneratedClouds--;
    }
  }
  createCloud(worldMat, generatedCloudCols);
};

// another obj

const bagItems = document.querySelectorAll(".bag-item[data-revealed='true']");
console.log(bagItems);
bagItems.forEach((item) =>
  item.addEventListener("click", (e) => {
    let selected = document.querySelector(".bag-item[data-selected='true']");
    if (selected !== null) {
      selected.classList.remove("selected-item");
      selected.setAttribute("data-selected", "false");
    }
    e.target.classList.add("selected-item");
    e.target.setAttribute("data-selected", "true");
  })
);

function drawResource(e) {
  const selectedResource = document.querySelector(
    ".resources-bag .bag-item[data-selected='true']"
  );
  if (selectedResource && selectedResource.textContent > 0) {
    e.target.className = `${selectedResource.id}-tile`;
    e.target.setAttribute("data-isResource", "true");
    e.target.removeEventListener("click", drawResource);
    e.target.addEventListener("click", (e) => {
      gatherResource(e);
    });
    changeResourceQuantity(e.target.className, -1);
  }
}

function gatherResource(e) {
  selectedTool = document.querySelector(".bag-item[data-selected='true']");
  const selectedResource = e.target.className;
  console.log(selectedResource);
  if (
    selectedTool &&
    resourceToolMapper.get(selectedResource) === selectedTool.id
  ) {
    e.target.className = "empty";
    e.target.removeEventListener("click", gatherResource);
    e.target.addEventListener("click", (e) => {
      drawResource(e);
    });
    console.log(e.target);
    changeResourceQuantity(selectedResource, 1);
  }
}

const blankTiles = document.querySelectorAll(".empty");
blankTiles.forEach((blankTile) => {
  blankTile.addEventListener("click", drawResource);
});

const resources = document.querySelectorAll("div[data-isresource='true']");
resources.forEach((resource) => {
  resource.addEventListener("click", gatherResource);
});

const changeResourceQuantity = (resource, delta) => {
  let resourceType = resource.substring(0, resource.lastIndexOf("-"));
  let resourceEl = document.querySelector(`#${resourceType}`);
  resourceEl.textContent = Number(resourceEl.textContent) + delta;
};
