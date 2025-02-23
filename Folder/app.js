    // References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Business Logic
let currentLocation = 1;
let numOfPapers = 3;
let maxLocation = numOfPapers + 1;

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
    
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if(currentLocation < maxLocation) {
        switch(currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                closeBook(false);
                break;
            default:
                throw new Error("unkown state");
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if(currentLocation > 1) {
        switch(currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 3;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 2;
                break;
            case 4:
                openBook();
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 1;
                break;
            default:
                throw new Error("unkown state");
        }

        currentLocation--;
    }
}

// Rain Animation
function createRain() {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = Math.random() * 1.5 + 0.5 + "s";
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 2000);
}
setInterval(createRain, 10);


// Background Music

let isMusicStarted = false; // Prevent multiple fetch calls

async function fetchSongs() {
    if (isMusicStarted) return; // Prevent multiple calls on reload
    isMusicStarted = true;

    try {
        const response = await fetch("Folder/Music"); // Folder path
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        let songs = Array.from(doc.querySelectorAll("a"))
            .map(a => a.href)
            .filter(href => href.endsWith(".mp3"));

        if (songs.length === 0) {
            console.error("No songs found in the folder.");
            return;
        }

        shuffleArray(songs);
        playSongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function playSongs(songs) {
    let currentIndex = 0;
    const audioElement = document.getElementById("background-music");
    const unmuteButton = document.getElementById("unmute-button");

    // Ensure audio starts muted to avoid autoplay restrictions
    audioElement.volume = 0;
    audioElement.muted = true;

    function playNext() {
        if (currentIndex >= songs.length) {
            shuffleArray(songs);
            currentIndex = 0;
        }

        audioElement.src = songs[currentIndex];

        audioElement.play().then(() => {
            console.log(`Playing: ${songs[currentIndex]}`);
        }).catch(error => {
            console.warn("Playback error, retrying...", error);
            waitForUserInteraction(); // Wait for click if blocked
        });

        currentIndex++;
    }

    audioElement.addEventListener("ended", playNext);
    playNext();

    // Show unmute button
    unmuteButton.style.display = "block";

    // Unmute when the button is clicked
    unmuteButton.addEventListener("click", () => {
        audioElement.muted = false;
        audioElement.volume = 0.75;
        unmuteButton.style.display = "none"; // Hide button after unmuting
        if (audioElement.paused) {
            audioElement.play().catch(error => console.error("Error resuming playback:", error));
        }
    });

    // If autoplay is blocked, wait for a stronger interaction
    function waitForUserInteraction() {
        function resumePlayback() {
            audioElement.play().catch(error => console.error("Still blocked:", error));
            document.removeEventListener("click", resumePlayback);
            document.removeEventListener("keydown", resumePlayback);
        }
        document.addEventListener("click", resumePlayback);
        document.addEventListener("keydown", resumePlayback);
    }
}

// Function to start music when user interacts (mouse movement, click, or scroll)
function startMusicOnInteraction() {
    if (isMusicStarted) return; // Ensure fetchSongs() runs only once

    document.removeEventListener("mousemove", startMusicOnInteraction);
    document.removeEventListener("click", startMusicOnInteraction);
    document.removeEventListener("scroll", startMusicOnInteraction);

    fetchSongs(); // Start fetching and playing songs (muted)
}

// Listen for any user interaction (mouse move, click, scroll)
document.addEventListener("mousemove", startMusicOnInteraction);
document.addEventListener("click", startMusicOnInteraction);
document.addEventListener("scroll", startMusicOnInteraction);
