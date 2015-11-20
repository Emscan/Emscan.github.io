var deckjs = (function () {
	var suits = {
			'spades'	: '1f0a',
			'hearts'	: '1f0b',
			'diamonds'	: '1f0c',
			'clubs'		: '1f0d'
		},
		Card, Deck, Suit;

	//card class
	Card = function (value, suit, deck) {
		var unicodeValue = value;

		if (unicodeValue > 11) unicodeValue++;
		this.value 	= value;
		this.suit 	= suit;
		this.deck 	= deck;
		this.suit.cards.push(this);
		this.deck.cards.push(this);
		this.unicode = '&#x' + this.suit.unicodeBase + unicodeValue.toString(16);
	};

	Card.prototype.toString = function () {
		return this.unicode;
	};


	//face card class
	FaceCard = function (value, suit, deck) {
		var names = {
			1: 'Ace',
			11: 'Jack',
			12: 'Queen',
			13: 'King'
		};

		this.name = names[value];

		Card.prototype.constructor.apply(this, arguments);
	}

	extend(Card, FaceCard);

	//deck class
	Deck = function () {
		this.suits = makeSuits();
		this.cards = [];

		for (var i in this.suits) {
			fillSuit(this.suits[i], this);
		}
	};

	Deck.prototype.deal = function(num) {
		return this.cards.splice(0, num);
	};

	Deck.prototype.shuffle = function(num) {
		var temp,
			rand; 

		num = num || 1;

		for (var i = 0; i < num; i++) {
			for (var j in this.cards) {
				rand = Math.floor(Math.random() * this.cards.length);
				temp = this.cards[j];
				this.cards[j] = this.cards[rand];
				this.cards[rand] = temp;
			}
		}
	}

	//suit class
	Suit = function (name, unicodeBase) {
		this.name 	= name;
		this.unicodeBase = unicodeBase;
		this.cards 	= [];
	};

	return {
		Deck 	: Deck,
		Card 	: Card,
		FaceCard: FaceCard,
		Suit 	: Suit
	};

	/*private functions*/

	function fillSuit(suit, deck) {
		var card;

		for (var i = 1; i < 14; i++) {
			if (i > 1 && i < 11) {
				card = new Card(i, suit, deck);
			}
			else {
				card = new FaceCard(i, suit, deck);
			}
		}
	}

	function makeSuits() {
		var result = [];

		for (var i in suits) {
			result.push(new Suit(i, suits[i]));
		}

		return result
	}

})();


/*update fillSuit (face card surrogate, face card will inherit from, 
		method to extend any class from any other class)

specify face card classes 

make a working Go Fish! 4 player (3)computer player AI? guess random. deck to draw from. 

Texas Hold 'Em.
*/








