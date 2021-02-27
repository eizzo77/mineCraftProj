const world = document.querySelector(".game-world");
const ROWS = window
  .getComputedStyle(world)
  .getPropertyValue("grid-template-rows")
  .split(" ").length;
const COLS = window
  .getComputedStyle(world)
  .getPropertyValue("grid-template-columns")
  .split(" ").length;
console.log("COLD ==> " + COLS);

document
  .querySelector(".game-mode.normal-mode")
  .addEventListener("click", () => console.log("ASD"));

// document.documentElement.style.setProperty(
//   "--world-background",
//   'url("tile2/sky-snow.jpg")'
// );

const themesMapper = new Map([[]]);

const resourceToolMapper = new Map([
  ["ground-top-tile", "shovel"],
  ["ground-tile", "shovel"],
  ["tree-lower-tile", "axe"],
  ["tree-upper-tile", "axe"],
]);

// to be attached to an Obj:
let randomGroundTopLevel;

gameWorldMat = [];
const createGameWorld = (rows, cols) => {
  for (let i = 0; i < ROWS; ++i) {
    let row = [];
    for (let j = 0; j < COLS; ++j) {
      let cell = document.createElement("div");
      cell.className = "empty";
      world.appendChild(cell);
      row.push(cell);
    }
    gameWorldMat.push(row);
  }
};

const generateGround = (worldMat) => {
  randomGroundTopLevel = Math.floor(Math.random() * 4) + ROWS - 5;
  for (let i = randomGroundTopLevel; i < ROWS; ++i) {
    for (let j = 0; j < COLS; ++j) {
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

const generateTree = (worldMat) => {
  let numOfGeneratedTrees = Math.floor(COLS / 10); //29 -> 2
  let generatedTreesCols = [];
  while (numOfGeneratedTrees > 0) {
    let randomTreeColPos = Math.floor(Math.random() * (COLS - 5)) + 3;
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

const generateCloud = (worldMat) => {
  let numOfGeneratedClouds = Math.floor(COLS / 15);
  let generatedCloudCols = [];
  while (numOfGeneratedClouds > 0) {
    let randomCloudsColsPos = Math.floor(Math.random() * (COLS - 8)) + 3;
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

createGameWorld(ROWS, COLS);
generateGround(gameWorldMat);
generateTree(gameWorldMat);
generateCloud(gameWorldMat);

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
