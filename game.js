var gameContainer = document.getElementById("game-container");
var swatter = document.getElementById("swatter");
var scoreDisplay = document.getElementById("score");
var flies = [];
var score = 0;
var maxFlies = 5;
var containerWidth = gameContainer.offsetWidth;
var containerHeight = gameContainer.offsetHeight;
var swatX = containerWidth / 2 - swatter.offsetWidth / 2;
var swatY = containerHeight / 2 - swatter.offsetHeight / 2;
var swatSpeedX = 0;
var swatSpeedY = 0;
var swatAcceleration = 0.2;
var swatMaxSpeed = 5;
var isSwatting = false;

// Function to generate random starting positions and directions for the flies
function generateFlyData() {
  var flyData = {
    x: Math.random() * (containerWidth - 60),
    y: Math.random() * (containerHeight - 60),
    dx: (Math.random() - 0.5) * 5, // Random value between -2.5 and 2.5
    dy: (Math.random() - 0.5) * 5, // Random value between -2.5 and 2.5
  };
  return flyData;
}

// Function to create a fly element
function createFly() {
  var flyData = generateFlyData();
  var fly = document.createElement("div");
  fly.className = "fly";
  fly.style.left = flyData.x + "px";
  fly.style.top = flyData.y + "px";
  gameContainer.appendChild(fly);
  return { element: fly, data: flyData };
}

// Function to update the position of the flies
function updateFlyPositions() {
  for (var i = 0; i < flies.length; i++) {
    var fly = flies[i];
    var flyData = fly.data;
    var flyElement = fly.element;

    flyData.x += flyData.dx;
    flyData.y += flyData.dy;

    // Check if the fly has hit the boundaries of the game container
    if (
      flyData.x <= 0 ||
      flyData.x >= containerWidth - flyElement.offsetWidth
    ) {
      flyData.dx *= -1;
    }

    if (
      flyData.y <= 0 ||
      flyData.y >= containerHeight - flyElement.offsetHeight
    ) {
      flyData.dy *= -1;
    }

    flyElement.style.left = flyData.x + "px";
    flyElement.style.top = flyData.y + "px";
  }

  requestAnimationFrame(updateFlyPositions);
}

// Function to add a fly to the game container
function addFly() {
  if (flies.length < maxFlies) {
    var fly = createFly();
    flies.push(fly);
  }
}

// Function to change the background color of the game container to a random bright color
function changeBackgroundColor() {
  var randomColor = getRandomBrightColor();
  gameContainer.style.backgroundColor = randomColor;
}

// Function to generate a random bright color
function getRandomBrightColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to handle swatting the flies
function swatFlies() {
  if (isSwatting) {
    for (var i = flies.length - 1; i >= 0; i--) {
      var fly = flies[i];
      var flyElement = fly.element;
      var flyPosition = flyElement.getBoundingClientRect();
      var swatterPosition = swatter.getBoundingClientRect();

      if (
        flyPosition.left < swatterPosition.right &&
        flyPosition.right > swatterPosition.left &&
        flyPosition.top < swatterPosition.bottom &&
        flyPosition.bottom > swatterPosition.top
      ) {
        // Remove the fly from the game container
        flies.splice(i, 1);
        gameContainer.removeChild(flyElement);
        score++;
        scoreDisplay.textContent = "Score: " + score;

        // Check if the score is a multiple of 25 and change the background color
        if (score % 25 === 0) {
          changeBackgroundColor();
        }
      }
    }
  }
}

// Function to update the swatter position continuously
function updateSwatter() {
  swatSpeedX += swatAcceleration * (swatX - swatter.offsetLeft);
  swatSpeedX *= 0.9; // Damping factor
  swatSpeedX = Math.max(-swatMaxSpeed, Math.min(swatSpeedX, swatMaxSpeed));
  swatX += swatSpeedX;

  swatSpeedY += swatAcceleration * (swatY - swatter.offsetTop);
  swatSpeedY *= 0.9; // Damping factor
  swatSpeedY = Math.max(-swatMaxSpeed, Math.min(swatSpeedY, swatMaxSpeed));
  swatY += swatSpeedY;

  swatX = Math.max(0, Math.min(swatX, containerWidth - swatter.offsetWidth));
  swatY = Math.max(0, Math.min(swatY, containerHeight - swatter.offsetHeight));

  swatter.style.left = swatX + "px";
  swatter.style.top = swatY + "px";
  requestAnimationFrame(updateSwatter);
}

// Start the game
updateFlyPositions();
setInterval(addFly, 800);
setInterval(swatFlies, 100);

// Event listener for mouse movement
document.addEventListener("mousemove", function(event) {
  swatX = event.clientX - gameContainer.getBoundingClientRect().left - swatter.offsetWidth / 2;
  swatY = event.clientY - gameContainer.getBoundingClientRect().top - swatter.offsetHeight / 2;
  updateSwatterPosition();
});

// Event listeners for keyboard movement
document.addEventListener("keydown", function(event) {
  switch (event.code) {
    case "ArrowUp":
      swatY -= swatMaxSpeed;
      break;
    case "ArrowDown":
      swatY += swatMaxSpeed;
      break;
    case "ArrowLeft":
      swatX -= swatMaxSpeed;
      break;
    case "ArrowRight":
      swatX += swatMaxSpeed;
      break;
  }
  updateSwatterPosition();
});

// Event listeners for swatting flies with the left mouse button or spacebar
document.addEventListener("mousedown", function (event) {
  if (event.button === 0 || event.button === 2 || event.code === "Space") {
    isSwatting = true;
    swatFlies(); // Call swatFlies immediately upon mouse down or spacebar press
  }
});

document.addEventListener("mouseup", function (event) {
  if (event.button === 0 || event.button === 2 || event.code === "Space") {
    isSwatting = false;
  }
});

// Event listener for touch start event
document.addEventListener("touchstart", function (event) {
  handleTouch(event.touches[0]);
});

// Event listener for touch move event
document.addEventListener("touchmove", function (event) {
  handleTouch(event.touches[0]);
});

// Function to handle touch events
function handleTouch(touch) {
  swatX = touch.clientX - gameContainer.getBoundingClientRect().left - swatter.offsetWidth / 2;
  swatY = touch.clientY - gameContainer.getBoundingClientRect().top - swatter.offsetHeight / 2;
}

// Event listener for touch end event
document.addEventListener("touchend", function () {
  isSwatting = false;
});

// Function to update the swatter position
function updateSwatterPosition() {
  swatX = Math.max(0, Math.min(swatX, containerWidth - swatter.offsetWidth));
  swatY = Math.max(0, Math.min(swatY, containerHeight - swatter.offsetHeight));
  swatter.style.left = swatX + "px";
  swatter.style.top = swatY + "px";
}
