'use server'

import { BASE_PRICE } from '../design/DesignConfigurator'
import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { Quantity } from '@/validators/option-validator'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Order } from '@prisma/client'

export const createCheckoutSession = async ({
  configurationId,
} : {
  configurationId: string
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configurationId },
  })

  if (!configuration) {
    throw new Error('No such configuration found')
  }

const { getUser } = getKindeServerSession()
const user = await getUser()

if (!user) {
  throw new Error('You need to be logged in')
}

const { sleeve, quantity } = configuration
const { label: qtylabel } = Quantity.options.find(
  ({ value }) => value === quantity
)!

let totalPrice = BASE_PRICE
if (sleeve === 'sleeveless'){
    totalPrice -= 100
    for(let i = 1; i<11 ;i++){
        if(qtylabel == i){
          totalPrice = totalPrice*i
        }
    }
}
      
if (sleeve === 'half'){
    totalPrice -= 50
    for(let i = 1; i<11 ;i++){
        if(qtylabel == i){
            totalPrice = totalPrice*i
        }
    }
}
    
if (sleeve === 'full'){
    totalPrice += 100
    for(let i = 1; i<11 ;i++){
        if(qtylabel == i){
            totalPrice = totalPrice*i
        }
    }
}
  console.log(user.id, configuration.id)
let order: Order | undefined = undefined
const existingOrder = await db.order.findFirst({
  where: {
    userId: user.id,
    configurationId: configuration.id,
  },
})


if (existingOrder) {
  order = existingOrder
} else {
  order = await db.order.create({
    data: {
      amount: totalPrice,
      userId: user.id,
      configurationId: configuration.id,
    },
  })
}

  const product = await stripe.products.create({
    name: 'Custom tshirt',
    images: [configuration.imageUrl],
    default_price_data: {
      currency: 'INR',
      unit_amount: totalPrice,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['IN','US'] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: qtylabel }],
  })

  return { url: stripeSession.url }
}