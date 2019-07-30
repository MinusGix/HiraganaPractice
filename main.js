var hiraganaBox = document.getElementById("hiragana-box");
var soundBox = document.getElementById("sound-box");
var timerInterval = null;
var time = 0;
var timerElement = document.getElementById("timer");

dragula([hiraganaBox], {
    isContainer (el) {
        return el.classList.contains('input');
    },
    moves: function (el, source, handle, sibling) {
        return true;
    },
    accepts: function (el, target, source, sibling) {
        if (!target.classList.contains('input')) {
            return false;
        }

        if (el.getAttribute('val') !== target.nextSibling.textContent) {
            return false;
        }

        if (el.children.length > 0) {
            return false;
        }

        return true;
    },
    revertOnSpill: true,
});

function getCharacters () {
    return [
        ['o', 'お'],
        ['e', 'え'],
        ['u', 'う'],
        ['i', 'い'],
        ['a', 'あ'],

        0, // 0 stands for group break

        ['ko', 'こ'],
        ['ke', 'け'],
        ['ku', 'く'],
        ['ki', 'き'],
        ['ka', 'か'],

        0,

        ['so', 'そ'],
        ['se', 'せ'],
        ['su', 'す'],
        ['shi', 'し'],
        ['sa', 'さ'],

        0,

        ['to', 'と'],
        ['te', 'て'],
        ['tsu', 'つ'],
        ['chi', 'ち'],
        ['ta', 'た'],

        0,

        ['no', 'の'],
        ['ne', 'ね'],
        ['nu', 'ぬ'],
        ['ni', 'に'],
        ['na', 'な'],

        0,

        ['ho', 'ほ'],
        ['he', 'へ'],
        ['fu', 'ふ'],
        ['hi', 'ひ'],
        ['ha', 'は'],

        0,

        ['mo', 'も'],
        ['me', 'め'],
        ['mu', 'む'],
        ['mi', 'み'],
        ['ma', 'ま'],

        0,

        ['yo', 'よ'],
        1, // 1 stands for empty item
        ['yu', 'ゆ'],
        1,
        ['ya', 'や'],

        0,

        ['ro', 'ろ'],
        ['re', 'れ'],
        ['ru', 'る'],
        ['ri', 'り'],
        ['ra', 'ら'],

        0,

        ['n', 'ん'],
        // These two weren't in the original hiragana practice
        // might add an option to enable them later
        //['wi', 'ゐ'],
        //['we', 'ゑ'],
        1,
        ['wo', 'を'],
        1,
        ['wa', 'わ'],
    ];
}

function addAllCharacters () {
    var characters = getCharacters();
    var shuffled = [];

    for (var j = 0; j < characters.length; j++) {
        if (characters[j] !== 0 && characters[j] !== 1) {
            shuffled.push(characters[j]);
        }
    }
    shuffle(shuffled);

    for (var i = 0; i < shuffled.length; i++) {
        var ele = document.createElement('div');
        ele.classList.add("char");
        ele.setAttribute('val', shuffled[i][0]);
        ele.innerText = shuffled[i][1];

        hiraganaBox.appendChild(ele);
    }
}
// See: https://stackoverflow.com/a/6274381, modifies original
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function clearHiraganaCharacters () {
    hiraganaBox.innerHTML = "";

    for (var i = 0; i < soundBox.children.length; i++) {
        var child = soundBox.children[i];
        if (child.classList.contains("empty") || child.classList.contains("break")) {
            continue;
        }

        if (child.children[0].children.length !== 0) {
            var inputBox = child.children[0];
            inputBox.removeChild(inputBox.children[0]);
        }
    }
}

function areAllInputsFilled () {
    for (var i = 0; i < soundBox.children.length; i++) {
        var child = soundBox.children[i];
        if (child.classList.contains("empty") || child.classList.contains("break")) {
            continue;
        }

        if (child.children[0].children.length === 0) {
            return false;
        }
    }

    return true;
}

function createAllInputs () {
    var characters = getCharacters();

    for (var i = characters.length-1; i >= 0; i--) {
        if (characters[i] === 0) {
            var breakEle = document.createElement('div');
            breakEle.classList.add("break");

            soundBox.appendChild(breakEle);
        } else if (characters[i] === 1) {
            var emptyEle = document.createElement('div');
            emptyEle.classList.add("item");
            emptyEle.classList.add("empty");

            soundBox.appendChild(emptyEle);
        } else {
            var root = document.createElement('div');
            root.classList.add("item");

            var input = document.createElement('div');
            input.classList.add("input");
            root.appendChild(input);

            var sound = document.createElement('span');
            sound.innerText = characters[i][0];
            root.appendChild(sound);

            soundBox.appendChild(root);
        }
    }
}
function clearInputs () {
    soundBox.innerHTML = "";
}

function padTwoDigits (value) {
    if (value > 9) {
        return value.toString();
    } else {
        return "0" + value.toString();
    }
}

function resetTimer () {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }
    time = 0;
}

function initializeTimer () {
    resetTimer();

    timerElement.innerText = "00:00";
    timerInterval = setInterval(function () {
        timerTick();
    }, 1000);
}

function timerTick () {
    var res = "";

    res += padTwoDigits(parseInt(time/60, 10));
    res += ":";
    res += padTwoDigits(time%60);
    time++;

    if (areAllInputsFilled()) {
        clearInterval(timerInterval);
        timerInterval = null;

        timerElement.innerText = timerElement.innerText + " You did it! Good job :)"
    } else {
        timerElement.innerText = res;
    }
}


document.getElementById("reset").addEventListener('click', function () {
    clearHiraganaCharacters();
    clearInputs();

    addAllCharacters();
    createAllInputs();
    initializeTimer();
});


addAllCharacters();
createAllInputs();
initializeTimer();