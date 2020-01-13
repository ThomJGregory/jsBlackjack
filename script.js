// Blackjack
// Thomas Gregory

let suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
let values = [
	'Ace',
	'King',
	'Queen',
	'Jack',
	'Ten',
	'Nine',
	'Eight',
	'Seven',
	'Six',
	'Five',
	'Four',
	'Three',
	'Two'
];

// DOM Variables
let textArea = document.getElementById('text-area'),
	btnNew = document.getElementById('btnNew'),
	btnHit = document.getElementById('btnHit'),
	btnStay = document.getElementById('btnStay');

// Game Variables
let gameStarted = true,
	gameOver = false,
	playerWon = false,
	playerCards = [],
	dealerCards = [],
	dealerScore = 0,
	playerScore = 0,
	deck = [];

btnHit.style.display = 'none';
btnStay.style.display = 'none';
showStatus();

// Event listeners
btnNew.addEventListener('click', function() {
	gameStarted = true;
	gameOver = false;
	playerWon = false;

	deck = createDeck();
	shuffleDeck(deck);

	dealerCards = [getNextCard(), getNextCard()];
	playerCards = [getNextCard(), getNextCard()];

	btnNew.style.display = 'none';
	btnHit.style.display = 'inline';
	btnStay.style.display = 'inline';
	showStatus();
});

btnHit.addEventListener('click', function() {
	playerCards.push(getNextCard());
	checkForEnd();
	showStatus();
});

btnStay.addEventListener('click', function() {
	gameOver = true;
	checkForEnd();
	showStatus();
});

function createDeck() {
	let deck = [];
	for (s = 0; s < suits.length; s++) {
		for (v = 0; v < values.length; v++) {
			let card = {
				suit: suits[s],
				value: values[v]
			};

			deck.push(card);
		}
	}
	return deck;
}

function shuffleDeck(deck) {
	for (let i = 0; i < deck.length; i++) {
		let swapIndex = Math.trunc(Math.random() * deck.length);
		let tmp = deck[swapIndex];
		deck[swapIndex] = deck[i];
		deck[i] = tmp;
	}
}

function getNextCard() {
	return deck.shift();
}

function getCardString(card) {
	return card.value + ' of ' + card.suit;
}

function getNumericValue(card) {
	switch (card.value) {
		case 'Ace':
			return 1;
		case 'Two':
			return 2;
		case 'Three':
			return 3;
		case 'Four':
			return 4;
		case 'Five':
			return 5;
		case 'Six':
			return 6;
		case 'Seven':
			return 7;
		case 'Eight':
			return 8;
		case 'Nine':
			return 9;
		default:
			return 10;
	}
}

function checkForEnd() {
	updateScores();

	if (gameOver) {
		while (
			dealerScore < playerScore &&
			playerScore <= 21 &&
			dealerScore <= 21
		) {
			dealerCards.push(getNextCard());
			updateScores();
		}
	}

	if (playerScore > 21) {
		(playerWon = false), (gameOver = true);
	} else if (dealerScore > 21) {
		(playerWon = true), (gameOver = true);
	} else if (gameOver) {
		if (playerScore > dealerScore) {
			playerWon = true;
		} else {
			playerWon = false;
		}
	}
}

function getScore(cardArray) {
	let score = 0,
		hasAce = false;
	for (let i = 0; i < cardArray.length; i++) {
		let card = cardArray[i];
		score += getNumericValue(card);
		if (card.value === 'Ace') {
			hasAce = true;
		}
	}

	if (hasAce && score + 10 <= 21) {
		return score + 10;
	}
	return score;
}

function updateScores() {
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}

function showStatus() {
	if (!gameStarted) {
		textArea.innerText = "Welcome to Tj's Table";
		return;
	}

	updateScores();

	let dealerCardString = '';
	for (let i = 0; i < dealerCards.length; i++) {
		dealerCardString += getCardString(dealerCards[i]) + '\n';
	}

	let playerCardString = '';
	for (let i = 0; i < playerCards.length; i++) {
		playerCardString += getCardString(playerCards[i]) + '\n';
	}

	textArea.innerText =
		'Dealer:\n' + dealerCardString + ' (score: ' + dealerScore + ')\n';
	textArea.innerText +=
		'\n Player:\n' + playerCardString + ' (score: ' + playerScore + ')\n';

	if (gameOver) {
		if (playerWon) {
			textArea.innerText += 'Congratulations, you win.';
		} else {
			textArea.innerText += 'Dealer wins. Better luck next time!';
		}
		btnNew.style.display = 'inline';
		btnHit.style.display = 'none';
		btnStay.style.display = 'none';
	}
}
