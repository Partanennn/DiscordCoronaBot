const axios 		= require("axios")
const Discord 		= require('discord.js')
const chalk			= require('chalk')
const bot 			= new Discord.Client()

const tokenFile		= require('./tokenFile') // File where is token-variable for discord bot
const bot_name 		= 'Jorma™Bot'
const time 			= 30 * 60 * 1000 // min * s * ms
let information		= [] // Information for global and other countries than Finland

// Bot login
if(tokenFile.token != null) {
	bot.login(tokenFile.token)
} else {
	console.log("Create tokenFile.js with token variable.")
}

// Bot is ready
bot.on('ready', () => {
	console.log(`${bot_name} is up`)
})

// When server get message
bot.on('message', (msg) => {
	let command = msg.content.split(' ')
	
	// If user give only !korona, then give total cases
	// Otherwise check second 'command' and find country from information array
	if(command.includes('!korona') && command.length === 1) {
		
		const x = information.filter(item => item['country'].toLowerCase() === 'all')
		msg.reply(
			'\nTotal cases in World: ' 	+ x[0]['cases']['total'] 	+
			'\nDeaths in World: ' 		+ x[0]['deaths']['total'] 	+ 
			'\nDay: ' 					+ x[0]['day']
		)
	} else if(command.includes('!korona')) {
		const item = information.filter(item => item['country'].toLowerCase() === command[1])
	
		if(item.length != 0) {
			msg.reply(
				item[0]['country'] 		+ ':' + 
				'\nTotal cases: '		+ item[0]['cases']['total'] +
				'\nTotal Deaths: ' 		+ item[0]['deaths']['total'] 	+
				'\nDay: ' 				+ item[0]['day']
			)
		} else {
			msg.reply("I didn't get that, try again💩")
		}
	}
})

if(tokenFile.token != null) {
	// Handles getting api information first time,
	// then gets new information about every 30min
	setTimeout(function doSomething() {
		
		// Get all infromation from rapidapi application
		getAllInfromation()

		setTimeout(doSomething, time)
	}, 500)
}

const getAllInfromation = () => {
	axios({
		"method":"GET",
		"url":"https://covid-193.p.rapidapi.com/statistics", //
		"headers":{
		"content-type":"application/octet-stream",
		"x-rapidapi-host":"covid-193.p.rapidapi.com",
		"x-rapidapi-key":"b4af6cf1d5msh18f8422250ddee4p1d6a90jsn414706decce1"
		}
	})
	.then((res)=>{
		// Set data to information array
		information = res.data.response
		let now = new Date()
		console.log(chalk.green(`[${now.toLocaleString()}]`) + "Fetched information from RapidAPI application, length: " + information.length)
	})
	.catch((error)=>{
		console.log(error)
	})
}
