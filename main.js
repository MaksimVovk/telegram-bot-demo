const express = require('express')
const request = require('request')
const TelegramBot = require('node-telegram-bot-api')

const {url, port, token, help} = require('./configs/index')

const app = express()
const bot = new TelegramBot(token, { polling: true })

bot.on('message', async (mes) => {
	const { chat: { id }} = mes
	const cmd = mes.text

	if (/help/.test(cmd)) {
		return
	}

	let result = ''
	const data = cmd == 'rate' ? await sendRequest(url.currency) : 'Error, use /help for more info'

	cmd == 'rate' ? JSON.parse(data).map((it) => {
		const tempData = it.ccy != 'BTC' ? `${it.ccy} - ${beautifyNum(Number(it.buy))} | ${beautifyNum(Number(it.sale))} \n` : ''
		result = result + tempData
	})
	: result = data

	bot.sendMessage(id, result)
})

bot.onText(/help/, async (msg, [source, match]) => {
	const { chat: { id }} = msg
	bot.sendMessage(id, help)
})

function sendRequest (url) {
	return new Promise ((resolve, reject) => {
		request(url, async (error, response, body) => {
			if (error) { return reject(error) }
			resolve(body)
		})
	})
}

function beautifyNum (num) {
	return num.toFixed(2)
}

//start server
app.listen(port, () => {
	console.log('all work')
})