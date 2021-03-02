const CURSOR_SHOVEL = "url('tile2/shovel_cursor.cur'), auto";
const HOVER_MENU_AUDIO = new Audio("audio/menu-hover.mp3");
HOVER_MENU_AUDIO.volume = 0.45;
const MINECRAFT_AUDIO = new Audio("audio/Minecraft.mp3");
MINECRAFT_AUDIO.volume = 0.5;
MINECRAFT_AUDIO.addEventListener("ended", () => {
  this.currentTime = 0;
  this.play();
});
MINECRAFT_AUDIO.play();

// initialization of the world and game intro screen elements
const world = document.querySelector(".game-world");
const gameIntro = document.querySelector(".game-intro");
// arrays of themes.
const normalThemeArr = [
  "url('tile2/sky.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop.jpg')",
  "url('tile2/lower-tree.jpg')",
  "url('tile2/tree-leaves.png')",
  "url('tile2/cloud.png')",
  "url('tile2/rock.png')",
];
const snowThemeArr = [
  "url('tile2/sky-snow.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop-snow.jpg')",
  "url('tile2/lower-tree-snow.jpg')",
  "url('tile2/tree-leaves-snow.png')",
  "url('tile2/cloud-snow.jpg')",
  "url('tile2/rock-snow.png')",
];
const desertThemeArr = [
  "url('tile2/sky-desert.jpg')",
  "url('tile2/soil.jpg')",
  "url('tile2/soiltop-desert.jpg')",
  "url('tile2/lower-tree-desert.png')",
  "url('tile2/tree-leaves-desert.png')",
  "url('tile2/cloud-desert.jpg')",
  "url('tile2/rock-desert.png')",
];
const outerThemeArr = [
  "url('tile2/sky-outer.jpg')",
  "url('tile2/soil-outer.jpg')",
  "url('tile2/soiltop-outer.png')",
  "url('tile2/lower-tree-outer.jpg')",
  "url('tile2/tree-leaves-outer.png')",
  "url('tile2/cloud-outer.jpg')",
  "url('tile2/rock-outer.png')",
];
// themes map keys are the ids of the html elements of the themes and values are the array above.
const themesMapper = new Map([
  ["normal", normalThemeArr],
  ["desert", desertThemeArr],
  ["snow", snowThemeArr],
  ["outer", outerThemeArr],
]);
// setting the theme by clicking the desired one on the landing page.
const gameModes = document.querySelectorAll(".game-mode");
gameModes.forEach((mode) =>
  mode.addEventListener("click", (e) => {
    const rootStyle = document.documentElement.style;
    const themes = themesMapper.get(e.target.id);
    rootStyle.setProperty("--world-background", themes[0]);
    rootStyle.setProperty("--ground-background", themes[1]);
    rootStyle.setProperty("--ground-top-background", themes[2]);
    rootStyle.setProperty("--tree-lower-background", themes[3]);
    rootStyle.setProperty("--tree-upper-background", themes[4]);
    rootStyle.setProperty("--cloud-background", themes[5]);
    rootStyle.setProperty("--rock-background", themes[6]);
  })
);
gameModes.forEach((mode) => {
  mode.addEventListener("mouseover", (e) => HOVER_MENU_AUDIO.play());
});

// resources to tools mapper - keys are the HTML injected elements, values are the tools ids
const resourceToolMapper = new Map([
  ["ground-top-tile", "shovel"],
  ["ground-tile", "shovel"],
  ["tree-lower-tile", "axe"],
  ["tree-upper-tile", "axe"],
  ["rock-tile", "pickaxe"],
]);
// this is where everything starts, once clicking the start game button the
// generation of the world, handlers and logic methods are invoked
document.querySelector(".start-game").addEventListener("click", () => {
  const worldWidthInputEl = document.querySelector(".world-width-input");
  let valueParsed = parseInt(worldWidthInputEl.value);
  let min = parseInt(worldWidthInputEl.getAttribute("min"));
  let max = parseInt(worldWidthInputEl.getAttribute("max"));
  if (!valueParsed) {
    preGame(
      worldGenerator.generateWorld(Math.floor(Math.random() * 6000) + 1200)
    );
    gameIntro.classList.add("disabled");
  } else if (valueParsed > min && valueParsed < max) {
    preGame(worldGenerator.generateWorld(worldWidthInputEl.textContent));
    gameIntro.classList.add("disabled");
  } else {
    alert(
      `please enter a width in the range of ${min}-${max} or Leave empty for Random`
    );
  }
});
const tutorialDesc = document.querySelector(".tutorial-desc");
const tutorial = document
  .querySelector(".tutorial")
  .addEventListener("click", () => {
    tutorialDesc.style.display = "block";
  });
document.querySelector(".exit-tut").addEventListener("click", () => {
  tutorialDesc.style.display = "none";
});
// a function responsible to invoke all pre-game generations and handlers
const preGame = (callBack) => {
  callBack; // invoke world Creation
  const blankTiles = document.querySelectorAll(".empty");
  logic.addDrawEvent(blankTiles);
  bagItems = document.querySelectorAll(".bag-item[data-revealed='true']");
  logic.addSelectedItemEvent(bagItems);
  resources = document.querySelectorAll("div[data-isresource='true']");
  logic.addGatherEvent(resources);
};

// obj responsible for the creation of the world
// consists method and the matrix to be filled with elements
// the top ground level index is generated as well to make the world random
// and reasonable based on the level of the ground.
const worldGenerator = {
  randomGroundTopLevel: 0,

  generateWorld: function (width) {
    world.style.width = `${width}px`;
    worldGenerator.gameRows = window
      .getComputedStyle(world)
      .getPropertyValue("grid-template-rows")
      .split(" ").length;
    worldGenerator.gameCols = window
      .getComputedStyle(world)
      .getPropertyValue("grid-template-columns")
      .split(" ").length;
    this.createGameWorld(this.gameRows, this.gameCols);
    this.generateGround(this.gameRows, this.gameCols);
    this.generateTree(this.gameRows, this.gameCols);
    this.generateCloud(this.gameRows, this.gameCols);
    this.generateRock();
  },

  createGameWorld: function (rows, cols) {
    this.gameWorldMat = [];
    for (let i = 0; i < rows; ++i) {
      let row = [];
      for (let j = 0; j < cols; ++j) {
        let cell = document.createElement("div");
        cell.className = "empty";
        world.appendChild(cell);
        row.push(cell);
      }
      this.gameWorldMat.push(row);
    }
  },

  createGround: function (rows, cols) {
    for (let i = randomGroundTopLevel; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        let groundCell = this.gameWorldMat[i][j];
        groundCell.className =
          i === randomGroundTopLevel ? "ground-top-tile" : "ground-tile";
        groundCell.setAttribute("data-isResource", "true");
      }
    }
  },

  generateGround: function (rows, cols) {
    randomGroundTopLevel = Math.floor(Math.random() * 4) + rows - 5;
    this.createGround(rows, cols);
  },

  createTree: function (colsPosArr) {
    colsPosArr.forEach((c) => {
      let randomNumOfLowerTree = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < randomNumOfLowerTree; ++i) {
        let treeCell = this.gameWorldMat[randomGroundTopLevel - 1 - i][c];
        treeCell.className = "tree-lower-tile";
        treeCell.setAttribute("data-isResource", "true");
      }
      let leavesStartRow = randomGroundTopLevel - randomNumOfLowerTree;
      randomNumOfLeaves = Math.floor(Math.random() * 2) + 1 === 1 ? 5 : 3;
      let startLeavesCol = c - Math.floor(randomNumOfLeaves / 2);
      for (let i = 0; i < randomNumOfLeaves; ++i) {
        for (let j = 0; j < randomNumOfLeaves; ++j) {
          let treeCell = this.gameWorldMat[leavesStartRow - i][
            startLeavesCol + j
          ];
          treeCell.className = "tree-upper-tile";
          treeCell.setAttribute("data-isResource", "true");
        }
      }
    });
  },

  generateTree: function (rows, cols) {
    let numOfGeneratedTrees = Math.floor(cols / 10); //29 -> 2
    this.generatedTreesCols = [];
    while (numOfGeneratedTrees > 0) {
      let randomTreeColPos = Math.floor(Math.random() * (cols - 8)) + 3;
      if (
        this.generatedTreesCols.length === 0 ||
        !this.generatedTreesCols.find((c) => Math.abs(c - randomTreeColPos) < 6)
      ) {
        this.generatedTreesCols.push(randomTreeColPos);
        numOfGeneratedTrees--;
      }
    }
    worldGenerator.createTree(this.generatedTreesCols);
  },

  createCloud: function (colsPosArr) {
    colsPosArr.forEach((c) => {
      let cloudStartRow = Math.floor(Math.random() * 2);
      let numOfCloudRows = Math.floor(Math.random() * 1) + 3;
      let cloudHeadTailPos = Math.floor(Math.random() * 4) + 1;
      this.gameWorldMat[cloudStartRow][c + cloudHeadTailPos].className =
        "cloud-tile";
      for (let i = 1; i < numOfCloudRows; ++i) {
        for (let j = 0; j < 6; ++j) {
          if (i !== 1 || (j !== 0 && j !== 5)) {
            this.gameWorldMat[cloudStartRow + i][c + j].className =
              "cloud-tile";
          }
        }
      }
      cloudHeadTailPos = Math.floor(Math.random() * 6);
      this.gameWorldMat[numOfCloudRows][
        c + cloudHeadTailPos
      ].className = this.gameWorldMat[numOfCloudRows][
        c + cloudHeadTailPos - 1
      ].className = "cloud-tile";
    });
  },

  generateCloud: function (rows, cols) {
    let numOfGeneratedClouds = Math.floor(cols / 15);
    this.generatedCloudCols = [];
    while (numOfGeneratedClouds > 0) {
      let randomCloudsColsPos = Math.floor(Math.random() * (cols - 8)) + 3;
      if (
        this.generatedCloudCols.length === 0 ||
        !this.generatedCloudCols.find(
          (c) => Math.abs(c - randomCloudsColsPos) < 7
        )
      ) {
        this.generatedCloudCols.push(randomCloudsColsPos);
        numOfGeneratedClouds--;
      }
    }
    this.createCloud(this.generatedCloudCols);
  },

  createRock: function (colsPosArr) {
    colsPosArr.forEach((c) => {
      let randomNumOfRockCols = Math.floor(Math.random() * 3) + 1;
      for (i = 0; i < randomNumOfRockCols; ++i) {
        let cell = this.gameWorldMat[randomGroundTopLevel - 1][c + i];
        cell.className = "rock-tile";
        cell.setAttribute("data-isResource", "true");
      }
    });
  },

  generateRock: function () {
    this.generatedRocksCols = this.generatedTreesCols.map((c) => c + 2);
    this.createRock(this.generatedRocksCols);
  },
};

// logic and handlers obj
const logic = {
  drawResource: function (e) {
    const selectedResource = document.querySelector(
      ".resources-bag .bag-item[data-selected='true']"
    );
    if (selectedResource && selectedResource.textContent > 0) {
      e.target.className = `${selectedResource.id}-tile`;
      e.target.setAttribute("data-isResource", "true");
      e.target.removeEventListener("click", logic.drawResource);
      e.target.addEventListener("click", (e) => {
        logic.gatherResource(e);
      });
      logic.changeResourceQuantity(e.target.className, -1);
    }
  },

  gatherResource: function (e) {
    selectedTool = document.querySelector(".bag-item[data-selected='true']");
    const selectedResource = e.target.className;
    if (
      selectedTool &&
      resourceToolMapper.get(selectedResource) === selectedTool.id
    ) {
      e.target.className = "empty";
      e.target.removeEventListener("click", logic.gatherResource);
      e.target.addEventListener("click", (e) => {
        logic.drawResource(e);
      });
      logic.changeResourceQuantity(selectedResource, 1);
    }
  },
  addDrawEvent: function (blankTiles) {
    blankTiles.forEach((blankTile) => {
      blankTile.addEventListener("click", logic.drawResource);
    });
  },
  addGatherEvent: function (resources) {
    resources.forEach((resource) => {
      resource.addEventListener("click", logic.gatherResource);
    });
  },
  changeResourceQuantity: function (resource, delta) {
    let resourceType = resource.substring(0, resource.lastIndexOf("-"));
    let resourceEl = document.querySelector(`#${resourceType}`);
    resourceEl.textContent = Number(resourceEl.textContent) + delta;
  },
  addSelectedItemEvent: function (items) {
    bagItems.forEach((item) =>
      item.addEventListener("click", (e) => {
        let selected = document.querySelector(
          ".bag-item[data-selected='true']"
        );
        if (selected !== null) {
          selected.classList.remove("selected-item");
          selected.setAttribute("data-selected", "false");
        }
        e.target.classList.add("selected-item");
        e.target.setAttribute("data-selected", "true");
        document.body.style.cursor = CURSOR_SHOVEL;
      })
    );
  },
};
// reset button handle
resetWorldButton = document.querySelector("#reset");
resetWorldButton.addEventListener("click", (e) => {
  while (world.firstChild) {
    world.removeChild(world.lastChild);
  }
  preGame(worldGenerator.generateWorld(world.getAttribute("width")));
  document
    .querySelectorAll(".resources-bag .bag-item")
    .forEach((r) => (r.textContent = 0));
});
