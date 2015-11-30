var goFish = (function () {
	var Fishbowl, Game, CompPlayer, Player;

	Fishbowl = function (deck) {
		this.deck = deck;
	};

	Fishbowl.prototype.draw = function (idx) {
		return this.deck.cards.splice(idx, 1);
	};

	Game = function (deck) {
		this.deck = deck;
		this.deck.shuffle();

		this.players = makePlayers(this.deck, this);

		this.fishbowl = new Fishbowl(this.deck);

	};

	Game.prototype.start = function () {
		this.currentPlayerIdx = 0;
		this.render();
		this.players[this.currentPlayerIdx].go();
	};

	Game.prototype.gameOver = function () {
		for (var i in this.players) {
			if (this.players[i].hand.length) {
				return false;
			}
		}
		return true;
	};

	Game.prototype.next = function () {
		this.currentPlayerIdx++;
		if (this.currentPlayerIdx === this.players.length) {
			this.currentPlayerIdx = 0;
		}
		if (!this.gameOver()) {
			this.render();
			this.players[this.currentPlayerIdx].go();
		}
		else {
			this.render();
			alert('Game Over!');
		}
	};

	Game.prototype.render = function () {
		var myCards = document.getElementById('my-cards'),
			myCardString = '',
			fishbowl = document.getElementById('fishbowl'),
			fishbowlString = '',
			compCards1 = document.getElementById('comp-cards1'),
			compCards2 = document.getElementById('comp-cards2'),
			compCards3 = document.getElementById('comp-cards3'),
			compCardString = '',
			compHand1 = this.players[1].hand,
			compHand2 = this.players[2].hand,
			compHand3 = this.players[3].hand, //How do I not repeat myself for each CPU player
			hand = this.players[0].hand,
			messages = document.getElementById('messages');

		for (var i in hand) {
			myCardString += '<span class="my-card" card-idx="' + i + '">' + hand[i].unicode + '</span>';
		}
		myCards.innerHTML = myCardString;

		for (var i in this.fishbowl.deck.cards) {
			fishbowlString += '<span class="fishbowl-card" card-idx="' + i + '">&#x1f0a0;</span>';
		}
		fishbowl.innerHTML = fishbowlString;

		for (var i in compHand1) {
			compCardString += '<span class="comp-card" card-idx=" ' + i + '">&#x1f0a0;</span>';
		}
		compCards1.innerHTML = compCardString;

		for (var i in compHand2) {
			compCardString += '<span class="comp-card" card-idx=" ' + i + '">&#x1f0a0;</span>';
		}
		compCards2.innerHTML = compCardString;

		for (var i in compHand3) {
			compCardString += '<span class="comp-card" card-idx=" ' + i + '">&#x1f0a0;</span>';
		}
		compCards3.innerHTML = compCardString;
	};

	Player = function (hand, game) {
		this.hand = hand; //array
		this.books = [];
		this.game = game;
		this.turn = {};
	};

	Player.prototype.go = function () {
		var self = this;

		this.game.render();
		this.choosePlayer(choosePlayerCallback);

		function choosePlayerCallback() {
			self.chooseCard(chooseCardCallback);
		};

		function chooseCardCallback(otherPlayer) {
			self.ask(askCallback); //TODO ask()
		};

		function askCallback(response) { //TODO response()
			response.innerHTML = messages;

			if (response.length) {
				self.hand = self.hand.concat(response);
				self.makeBooks();
				self.game.render();
				self.go();
			}
			else {
				self.goFish(self.game.next.bind(self.game));
			}
		};
	};

	Player.prototype.choosePlayer = function(callback) {
		var self = this;

		document.addEventListener('click', callbackHelper);

		function callbackHelper(event) {
			if (event.target.matches('.player')) {
				self.turn.otherPlayer = self.game.players[event.target.getAttribute('player-idx')];
				callback();
				document.removeEventListener('click', callbackHelper);
			}
		}
	};

	Player.prototype.chooseCard = function (callback) {
		var self = this;

		console.log('Player Chosen');
		document.addEventListener('click', callbackHelper);

		function callbackHelper(event) {
			if (event.target.matches('.my-card')) {
				self.turn.card = self.hand[event.target.getAttribute('card-idx')];
				callback();
				document.removeEventListener('click', callbackHelper);
			}
		}
	};

	Player.prototype.ask = function (callback) {
		var card = this.turn.card,
			hand = this.turn.otherPlayer.hand,
			response = [];

		console.log("Card Chosen"); //TODO!!!!!!!!!!!
		
		for (var i = hand.length - 1; i >= 0; i--) {
			if (card.value === hand[i].value) {
				response = response.concat(hand.splice(i, 1));
			}
		}
		callback(response);
	};

	Player.prototype.makeBooks = function () {
		var self = this,
			counts = {},
			card;

		for (var i = 0; i < this.hand.length; i++) {
			card = this.hand[i];
			counts[card.value] = counts[card.value] || 0;
			counts[card.value]++;
		}

		for (var i in counts) {
			if (counts[i] === 4) {
				this.books.push(removeCards(i, this.hand));
			}
		}

		function removeCards(val, hand) {
			var book = [];

			for (var i = 0; i < 4; i++) {
				for (var j in hand) {
					if (hand[j].value === parseInt(val)) {
						book.push(hand.splice(j, 1));
					}
				}			
			}
			console.log(val, hand, book, self.hand)
			return book;
		}
	};

	Player.prototype.goFish = function (callback) {
		var fishbowl = document.getElementById('fishbowl')
			self = this;

		if (this.game.fishbowl.deck.cards.length) {
			console.log('Go Fish!');
			fishbowl.addEventListener('click', callbackHelper);
		}
		else {
			callback();
		}

		function callbackHelper (event) {
			if (event.target.matches('.fishbowl-card')) {
				var cardIdx = event.target.getAttribute('card-idx'),
					card = self.game.fishbowl.deck.cards.splice(cardIdx, 1);
				
				self.hand = self.hand.concat(card);
				
				fishbowl.removeEventListener('click', callbackHelper);
				callback();
			}
		}
	};
	
	CompPlayer = function (hand, game) {
		this.books = [];
		this.game = game;
		this.hand = hand;
		this.turn = {};
	};
	extend(Player, CompPlayer)

	CompPlayer.prototype.choosePlayer = function (callback) {
		var index = this.game.currentPlayerIdx;

		while (this.game.currentPlayerIdx === index) {
			index = Math.floor(Math.random() * 4);
		}

		this.turn.otherPlayer = this.game.players[index];

		callback();
	};

	CompPlayer.prototype.chooseCard = function (callback) {
		this.turn.card = this.hand[Math.floor(Math.random() * this.hand.length)];
		callback();
	};

	CompPlayer.prototype.goFish = function (callback) {
		var cardIdx = Math.floor(Math.random() * this.game.fishbowl.length),
			card = this.game.fishbowl.deck.cards.splice(cardIdx, 1);

		this.hand = this.hand.concat(card);

		callback();
	};

	return new Game(new deckjs.Deck());

	function makePlayers(deck, game) {
		var players = [];

		players.push(new Player(deck.deal(5), game));  
		players.push(new CompPlayer(deck.deal(5), game));
		players.push(new CompPlayer(deck.deal(5), game));
		players.push(new CompPlayer(deck.deal(5), game));

		return players;
	};
}());
