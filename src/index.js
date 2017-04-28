var Alexa = require('alexa-sdk');
var version = '0.0.3';

exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
}

var handlers = {
	'LaunchRequest': function() {
		this.emit(':ask', script['launch']);
	},
	'AboutAppIntent': function() {
		this.emit(':tell', script['about'] );
	},
	'HowMuchToPackIntent': function() {
		var days = this.event.request.intent.slots.days.value;
		var resp = "Sorry, I didn't get that. Can you try asking me again?";
		
		if (days > 0) {
			resp = "How fun! You'll be going on a " + days + " day trip! Let's see what I can recommend for you to pack. ";
			resp += "Let's start with the basics. Don't forget to bring "
			resp += dont_forget.join(', ') + '. ';
			resp += "For your " + days + " day trip, you should also pack ";
			clothes_strings = []
			for(var clothes in multiplier) {
				clothes_strings.push(Math.ceil(multiplier[clothes] * days) + ' ' + clothes);
			}
			resp += clothes_strings.slice(0, -1).join(', ');
			resp += ', and ' + clothes_strings[clothes_strings.length - 1] + '. '
			resp += 'That should be sufficient. If you can wash your clothes while on your trip, you can even pack less! Have fun!'
			this.emit(':tell', resp);
		} else if (days <= 0) {
			resp = "You've got a really short trip. I don't have any recommendations for you. Have fun!"
			this.emit(':tell', resp);
		} else {
			this.emit(':ask', resp);
		}
	},
	'AMAZON.HelpIntent': function() {
		this.emit(':ask', script['help']);
	},
	'AMAZON.StopIntent': function() {
		this.emit(':tell', script['stop']);
	},
	'AMAZON.CancelIntent': function() {
		this.emit(':tell', script['stop']);
	},
	'SessionEndedRequest': function() {
		this.emit(':tell', script['stop']);
	}
}

var script = {
	'launch': 'Welcome to Suitcase Helper, the Alexa app to help you estimate how much clothes you should pack on your next adventure. Try asking me, "How much should I pack for a three day trip?" Give it a try!',
	'about': 'Hello, Welcome to Suitcase Helper, version '+ version +'.',
	'help': 'Bonjour! I\'m Suitcase Helper, the Alexa app to help you estimate how much you should pack for your next adventure. Try asking me questions like, "How much should I pack for a three day trip?". Go ahead, give it a try!',
	'stop': 'Thank you for using Suitcase Helper. I hope you enjoyed my service. Bon voyage!'
}
var dont_forget = [
	"toothbrush",
	"toothpaste",
	"shampoo",
	"conditioner",
	"bodywash",
	"and deodorant"
	];
var multiplier = {
	"shirts": 1,
	"pants": 0.3,
	"underwear": 1,
	"pajamas": 0.2,
	"pairs of socks": 1,
	"jacket": 0.1
}