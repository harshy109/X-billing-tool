import app from './app.js'

const port = process.env.PORT || 3001

app.listen(port, () => {
	console.log(`X-Billing backend listening on port ${port}`)
})