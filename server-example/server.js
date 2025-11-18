// Ejemplo mínimo de servidor para crear PaymentIntents y completar checkout
const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  console.error('Falta STRIPE_SECRET_KEY en el entorno. Usar .env basado en .env.example')
  process.exit(1)
}

const stripe = new Stripe(stripeKey)

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body
  if (!amount) return res.status(400).send('amount missing')
  try {
    const pi = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'eur',
      payment_method_types: ['card'],
    })
    res.json({ client_secret: pi.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

app.post('/api/complete-checkout', async (req, res) => {
  // Recibe: { customer, payment, paymentIntent }
  const { customer, payment, paymentIntent } = req.body
  // Aquí deberías validar y guardar la orden en BD.
  console.log('Complete checkout request:', { customer, payment, paymentIntent })
  // Simular creación de orden
  res.json({ success: true, orderId: `order_${Date.now()}` })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
