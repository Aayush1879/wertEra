"use client"
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { Configuration } from '@prisma/client'
import Shirt from '@/components/Phone'
import Phone from '@/components/Phone'
import { COLORS, MODELS,NECK,Quantity } from '@/validators/option-validator'
import { ArrowRight, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { BASE_PRICE } from '../design/DesignConfigurator'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from './actions'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import LoginModal from '@/components/LoginModal'

const DesignPreview = ({ configuration }: { configuration: Configuration })=>{
    const router = useRouter()
    const { toast } = useToast()
    const { user } = useKindeBrowserClient()
    const [showConfetti, setShowConfetti] = useState<boolean>(false)
    useEffect(() => setShowConfetti(true))
    const { color, sleeve, size, neck, quantity} = configuration
    const {id} = configuration
    const tw = COLORS.find((supportedColor) => supportedColor.value === color)?.tw
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)

    const { label: modelLabel } = MODELS.options.find(
        ({ value }) => value === size
    )!
    const { label: colorlabel } = COLORS.find(
        ({ value }) => value === color
    )!
    const { label: necklabel } = NECK.options.find(
        ({ value }) => value === neck
    )!
    const { label: qtylabel } = Quantity.options.find(
        ({ value }) => value === quantity
    )!

    let totalPrice = BASE_PRICE
    if (sleeve === 'sleeveless'){
        totalPrice -= 100
    }
        
    if (sleeve === 'half'){
        totalPrice -= 50
    }
        
    if (sleeve === 'full'){
        totalPrice += 100
    }
    totalPrice = totalPrice * qtylabel
    
    const { mutate: createPaymentSession} = useMutation({
        mutationKey: ['get-checkout-session'],
        mutationFn: createCheckoutSession,
        onSuccess: ({ url }) => {
          if (url) router.push(url)
          else throw new Error('Unable to retrieve payment URL.')
        },
        onError: () => {
          toast({
            title: 'Something went wrong',
            description: 'There was an error on our end. Please try again.',
            variant: 'destructive',
          })
        },
    })

    const handleCheckout = () => {
        if (user) {
          createPaymentSession({ configurationId: id })
        } else {
          localStorage.setItem('configurationId', id)
          setIsLoginModalOpen(true)
        }
      }
   
    

    return(
        <>
            <div
                aria-hidden='true'
                className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
                <Confetti
                active={showConfetti}
                config={{ elementCount: 200, spread: 90 }}
                />
            </div>

            <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
                <div className="relative md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2 flex items-center justify-center">
                    <Phone imgSrc={configuration.croppedImageUrl!} 
                        // className="right-35 top-12"
                        style={{
                            right: '40.5%',  
                            top: '40px',
                            transform: 'translateX(50%)',
                        }}
                    />

                    <Shirt
                        imgSrc={`/tshirts/${tw}.jpg`}
                        className="absolute inset-0 w-[18rem] h-[22rem] z-10"
                        
                    />
                </div>
                <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

                <div className='mt-6 ml-2 sm:col-span-9 md:row-end-1'>
                    <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Your {modelLabel} size Tshirt
                    </h3>
                    <div className='mt-3 flex items-center gap-1.5 text-base'>
                        <Check className='h-4 w-4 text-green-500' />
                        In stock and ready to ship
                       
                    </div>
                    
                </div>

                <div className='sm:col-span-12 md:col-span-9 text-base ml-10'>
                    
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10'>
                       
                        <div>
                            <p className='font-medium text-zinc-950'>Highlights</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>This tee isn't just big, it's a statement piece. Made from a super-soft, breathable fabric that feels like your favorite old band tee (but way less worn-out), this shirt is perfect for just chilling.</li><br />
                                {/* <li>Style Tip: Pair your tee with ripped jeans and chunky sneakers. Create depth by layering your oversized tee over a Henley shirt or a plain white tee. Finish the look with dark wash jeans and boots for a modern vibe.</li> */}
                            </ol>
                        </div>
                        <div>
                            <p className='font-medium text-zinc-950'>Materials</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Premium Heavy Gauge Fabric</li>
                                <li>100% Cotton</li>
                                <li>Machine Wash </li>
                            </ol>
                        </div>
                        
                    </div>
                    <div className='mt-8'>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <p className='text-gray-600 py-1'>Color : {colorlabel}</p>
                                <p className='text-gray-600 py-1'>Neck : {necklabel}</p>
                                <p className='text-gray-600 py-1'>Quantity : {qtylabel}</p>
                                {sleeve === 'dropShoulder' ? (
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Sleeve: Drop shoulder (Oversize)</p>
                                    <p className='font-medium text-gray-900'>
                                    {formatPrice(599)}
                                    </p>
                                </div>
                                ) : null}
                                {sleeve === 'sleeveless' ? (
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Sleeve: Sleeveless</p>
                                    <p className='font-medium text-gray-900'>
                                    {formatPrice(499)}
                                    </p>
                                </div>
                                ) : null}
                                {sleeve === 'full' ? (
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Sleeve: Full sleeve</p>
                                    <p className='font-medium text-gray-900'>
                                    {formatPrice(699)}
                                    </p>
                                </div>
                                ) : null}
                                {sleeve === 'half' ? (
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Sleeve: Half sleeve</p>
                                    <p className='font-medium text-gray-900'>
                                    {formatPrice(549)}
                                    </p>
                                </div>
                                ) : null}

                                <div className='my-2 h-px bg-gray-200' />

                                <div className='flex items-center justify-between py-2'>
                                    <p className='font-semibold text-gray-900'>Order total</p>
                                    <p className='font-semibold text-gray-900'>
                                        {formatPrice(totalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-8 flex justify-end pb-12'>
                            <Button
                                // isLoading={true}
                                onClick={()=>handleCheckout()}
                                className='px-4 sm:px-6 lg:px-8'>
                                Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}
export default DesignPreview