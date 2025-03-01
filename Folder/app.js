// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const papers = document.querySelectorAll(".paper");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Business Logic
let currentLocation = 1;
let numOfPapers = papers.length;
let maxLocation = numOfPapers + 1;

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
        }
        let paperIndex = currentLocation - 1;
        if (paperIndex < numOfPapers) {
            papers[paperIndex].classList.add("flipped");
            papers[paperIndex].style.zIndex = currentLocation;
        }
        if (currentLocation === numOfPapers) {
            closeBook(false);
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        currentLocation--;
        let paperIndex = currentLocation - 1;
        if (paperIndex < numOfPapers) {
            papers[paperIndex].classList.remove("flipped");
            papers[paperIndex].style.zIndex = numOfPapers - paperIndex;
        }
        if (currentLocation === 1) {
            closeBook(true);
        }
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
let isMusicStarted = false;

async function fetchSongs() {
    if (isMusicStarted) return;
    isMusicStarted = true;

    try {
        const response = await fetch("Folder/Music");
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
            waitForUserInteraction();
        });
        currentIndex++;
    }

    audioElement.addEventListener("ended", playNext);
    playNext();

    unmuteButton.style.display = "block";
    unmuteButton.addEventListener("click", () => {
        audioElement.muted = false;
        audioElement.volume = 0.75;
        unmuteButton.style.display = "none";
        if (audioElement.paused) {
            audioElement.play().catch(error => console.error("Error resuming playback:", error));
        }
    });

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

function startMusicOnInteraction() {
    if (isMusicStarted) return;
    document.removeEventListener("mousemove", startMusicOnInteraction);
    document.removeEventListener("click", startMusicOnInteraction);
    document.removeEventListener("scroll", startMusicOnInteraction);
    fetchSongs();
}

document.addEventListener("mousemove", startMusicOnInteraction);
document.addEventListener("click", startMusicOnInteraction);
document.addEventListener("scroll", startMusicOnInteraction);


document.addEventListener("DOMContentLoaded", function () {
    const poemTitle = "For the Light of My Life";
    const poemLines = [
        "",
        "If you raise a storm, wild and high,",
        "I'll be the calm that soothes the sky.",
        "If you have a hundred tears to shed,",
        "I'll bring a thousand smiles instead.",
        "",
        "If your fire burns too strong, too bright,",
        "I'll hold you close and make it right.",
        "If sadness tries to pull you down,",
        "I'll lift you up—won't let you drown.",
        "",
        "If you find a thousand reasons to say no,",
        "I’ll love you more than you'll ever know.",
        "",
        "Happy 20th birthday, my love,",
        "You are my heart, my shining dove.",
        "Through every joy and every test,",
        "With you, my love, I have the best.",
        "",
    ];

    const poemContainer = document.getElementById("poem-container");
    const titleContainer = document.createElement("div");
    titleContainer.style.fontWeight = "bold";
    titleContainer.style.textAlign = "center";
    titleContainer.style.marginBottom = "20px";
    poemContainer.appendChild(titleContainer);

    let charIndex = 0;
    let lineIndex = -1; // Start with title
    let isTyping = false;

    function typeTitle() {
        if (charIndex < poemTitle.length) {
            titleContainer.innerHTML += poemTitle[charIndex];
            charIndex++;
            setTimeout(typeTitle, 100);
        } else {
            titleContainer.innerHTML += "<br><br>"; // Underline after title
            charIndex = 0;
            lineIndex = 0; // Move to poem
            setTimeout(typePoem, 500);
        }
    }

    function typePoem() {
        if (lineIndex < poemLines.length) {
            if (charIndex < poemLines[lineIndex].length) {
                poemContainer.innerHTML += poemLines[lineIndex][charIndex];
                charIndex++;
                setTimeout(typePoem, 100);
            } else {
                poemContainer.innerHTML += "<br>";
                charIndex = 0;
                lineIndex++;
                setTimeout(typePoem, 500);
            }
        }
    }

    document.getElementById("p1").addEventListener("transitionend", function () {
        if (!isTyping && this.classList.contains("flipped")) {
            isTyping = true;
            poemContainer.style.display = "block";
            setTimeout(typeTitle, 500);
        }
    });
});

document.getElementById("p1").addEventListener("transitionend", function () {
    // Check if p2 has been flipped, then trigger the heart rainfall inside #b2
    if (this.classList.contains("flipped")) {
        const heartRainfall = document.querySelector(".heart-rainfall");
        heartRainfall.style.display = "block";  // Make heart rainfall visible
        startHeartRainfall();  // Start the heart falling animation
    }
});

// Function to add glitter effect alongside hearts
function startHeartRainfall() {
    const heartRainfall = document.querySelector(".heart-rainfall");
    const b2 = document.getElementById("b1");  // Target the back of page 2 (container for hearts)

    // Create heart elements falling from random positions inside #b2
    setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.textContent = "❤️";  // Heart symbol

        // Get the width and height of #b2 to keep hearts inside this container
        const pageWidth = b1.offsetWidth;
        const pageHeight = b1.offsetHeight;

        // Randomize the horizontal position based on the width of #b2
        heart.style.left = Math.random() * (pageWidth - 50) + "px";  // Random horizontal position
        heart.style.top = Math.random() * (pageHeight - 50) + "px";  // Random vertical position inside #b2

        heartRainfall.appendChild(heart);

        // Remove heart after animation completes (duration should match the animation time)
        setTimeout(() => {
            heart.remove();
        }, 2000);  // Duration of heart falling animation

        // Add glitter effect every few seconds
        addGlitterEffect(b1);
    }, 300);  // Adjust how often the hearts fall
}

// Function to create glitter effect around hearts
function addGlitterEffect(container) {
    const glitter = document.createElement("div");
    glitter.classList.add("glitter");

    // Randomize the position of the glitter inside the container
    const pageWidth = container.offsetWidth;
    const pageHeight = container.offsetHeight;
    glitter.style.left = Math.random() * (pageWidth - 5) + "px";
    glitter.style.top = Math.random() * (pageHeight - 5) + "px";

    container.appendChild(glitter);

    // Remove glitter after a short period
    setTimeout(() => {
        glitter.remove();
    }, 1000);
}
