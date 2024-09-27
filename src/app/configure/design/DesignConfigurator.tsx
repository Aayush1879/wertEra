'use client'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { cn, formatPrice } from '@/lib/utils'
import {Rnd} from 'react-rnd'
import HandleComponents from '@/components/HandleComponents'
import { ScrollArea } from '@/components/ui/scroll-area'
import {RadioGroup} from "@headlessui/react"
import { useEffect, useRef, useState } from 'react'
import { COLORS, MODELS, SLEEVE, NECK,Quantity} from '@/validators/option-validator'
// import { number } from 'zod'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { saveConfig as _saveConfig, SaveConfigArgs  } from './actions'
export let  BASE_PRICE = 599; 
interface DesignConfiguratorProps{
    configId: string
    imageUrl: string
    imageDimensions: { width: number; height: number }
}
const DesignConfigurator = ({configId, imageUrl , imageDimensions}: DesignConfiguratorProps) => {
    const { toast } = useToast()
    const router = useRouter()

    const { mutate: saveConfig, isPending } = useMutation({
        mutationKey: ['save-config'],
        mutationFn: async (args: SaveConfigArgs) => {
          await Promise.all([saveConfiguration(), _saveConfig(args)])
        },
        onError: () => {
          toast({
            title: 'Something went wrong',
            description: 'There was an error on our end. Please try again.',
            variant: 'destructive',
          })
        },
        onSuccess: () => {
          router.push(`/configure/preview?id=${configId}`)
        },
    })

    const [options,setOptions] = useState<{
        color: (typeof COLORS)[number]
        model: (typeof MODELS.options)[number]
        sleeves: (typeof SLEEVE.options)[number]
        neck: (typeof NECK.options)[number]
        quantity: (typeof Quantity.options)[number]

    }>({
        color:COLORS[0],
        model: MODELS.options[3],
        sleeves: SLEEVE.options[2],
        neck: NECK.options[0],
        quantity: Quantity.options[0],

    })

    const [renderedDimension, setRenderedDimension] = useState({
        width: imageDimensions.width / 4,
        height: imageDimensions.height / 4,
    })

    const [renderedPosition, setRenderedPosition] = useState({
        x: 160,
        y: 205,
    })

    const shirtRef = useRef<HTMLDivElement>(null)
    const containerRef   = useRef<HTMLDivElement>(null)
    const { startUpload } = useUploadThing('imageUploader')
    
    async function saveConfiguration(){
        try{
            const {
                left: shirtLeft,
                top: shirtTop,
                width,
                height,
            } = shirtRef.current!.getBoundingClientRect()
            const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect()
            const leftOffset = shirtLeft - containerLeft
            const topOffset = shirtTop - containerTop
            const actualX = renderedPosition.x - leftOffset
            const actualY = renderedPosition.y - topOffset
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')

            const userImage = new Image()
            userImage.crossOrigin = 'anonymous'
            userImage.src = imageUrl
            await new Promise((resolve) => (userImage.onload = resolve))

            ctx?.drawImage(
                userImage,
                actualX,
                actualY,
                renderedDimension.width,
                renderedDimension.height
            )

            const base64 = canvas.toDataURL()
            console.log(base64)
            const base64Data = base64.split(',')[1]
      
            const blob = base64ToBlob(base64Data, 'image/png')
            const file = new File([blob], 'filename.png', { type: 'image/png' })
            await startUpload([file], { configId })
        }
        catch(err){
            toast({
                title: 'Something went wrong',
                description:
                  'There was a problem saving your config, please try again.',
                variant: 'destructive',
            })
        }
    }
    function base64ToBlob(base64: string, mimeType: string) {
        const byteCharacters = atob(base64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: mimeType })
    }
    
    const [colorchange , setColorchange] = useState("black")

    return(
        <div className='relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20 '>
            <div ref={containerRef} className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-blue-500 p-12 text-center  '>
                <div className='relative w-60 h-full bg-opacity-50 pointer-events-none mr-[17.5rem]'>
                    <AspectRatio 
                        ref={shirtRef}
                        // ratio={896 / 1831}
                        className='relative z-40 aspect-square w-[30rem] h-[35rem]'
                    >   
                        <NextImage 
                            fill
                            alt='phone image'
                            src={`/tshirts/${colorchange}.jpg`}
                            className='pointer-events-none z-30 select-none border-none object-center   '
                        />
                        
                    </AspectRatio>
                    <div className="absolute inset-0 flex items-center justify-center">
{/*                         <div className="relative z-50 w-[15.5rem] h-[17rem] ml-[15rem] aspect-square bg-transparent shadow-[0_0_0_99999px_rgba(229,231,235,0.1)]" /> */}
                        <div
                            ref={containerRef}
                            className={cn(
                                'absolute z-50 w-[15rem] h-[17rem] ml-[14.75rem] overflow-hidden aspect-square border-2 border-dashed top-[12rem] opacity-100',
                            )}
                        />
                        
                    </div> 
                    
                    
                </div>
                <Rnd
                    default={{
                        x: 260,
                        y: 205,
                        height: imageDimensions.height / 4,
                        width: imageDimensions.width / 4,
                    }}
                    style={{
                        zIndex: 99, // Set a high z-index value to ensure it's on top
                    }}
                    onResizeStop={(_, __, ref, ___, { x, y }) => {
                        setRenderedDimension({
                          height: parseInt(ref.style.height.slice(0, -2)),
                          width: parseInt(ref.style.width.slice(0, -2)),
                        })
            
                        setRenderedPosition({ x, y })
                    }}
                    onDragStop={(_, data) => {
                        const { x, y } = data
                        setRenderedPosition({ x, y })
                    }}
                    // lockAspectRatio
                    resizeHandleComponent={{
                        bottomRight: <HandleComponents/>,
                        bottomLeft: <HandleComponents/>,
                        topRight: <HandleComponents/>,
                        topLeft: <HandleComponents/>
                    }}
                    >
                    <div className=' relative w-full h-full '>
                        <NextImage
                        src={imageUrl}
                        fill
                        alt='your image'
                        className='pointer-events-none mix-blend-multiply' 
                        />
                        {/* <input type="text" className='bg-white'/> */}
                    </div>
                </Rnd>
            </div>
            <div className='h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white'>
                <ScrollArea  className='relative flex-1 overflow-auto'>
                    <div
                        aria-hidden='true'
                        className='absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none'
                    />
                    <div className='px-8 pb-12 pt-8'>
                        <h2 className='tracking-tight font-bold text-3xl'>
                            Customize your Tshirt
                        </h2>
                        <div className='w-full h-px bg-zinc-200 my-6'/>
                        <div className='relative mt-4 h-full flex flex-col justify-between'>
                            <div className='flex flex-col gap-6'>
                                <RadioGroup value={options.color} onChange={(val)=>{
                                    setOptions((prev) => ({
                                        ...prev,
                                        color: val,
                                    }));
                                    setColorchange(val.tw);
                                    
                                }}
                                >
                                    <Label>Color: {options.color.label}</Label>
                                    <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                                        {COLORS.map((color) => (
                                            <RadioGroup.Option
                                                key={color.label}
                                                value={color}
                                                
                                                className={({ active, checked }) =>
                                                    cn(
                                                        'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                                        {
                                                            [`border-${color.tw}`]: active || checked,
                                                        }
                                                    )
                                                } 
                                                    
                                                >
                                                <span
                                                

                                                className={cn(
                                                    `bg-${color.tw}`,
                                                    'h-8 w-8 rounded-full border border-black border-opacity-10'
                                                )}
                                                />
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>
                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Size</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline"
                                                role="combobox"
                                                className='w-40 justify-center'
                                            >
                                                {options.model.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {MODELS.options.map((model)=>(
                                                <DropdownMenuItem 
                                                    key={model.label}
                                                    className={cn('flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100':
                                                                model.label === options.model.label,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions((prev) => ({ ...prev, model }))
                                                    }}
                                                >
                                                    <Check className={cn("m-2 h-4 w-4",model.label === options.model.label ? "opacity-100" : "opacity-0")} />
                                                    {model.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Sleeve</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline"
                                                role="combobox"
                                                className='w-40 justify-center'
                                            >
                                                {options.sleeves.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-5 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {SLEEVE.options.map((sleeves)=>(
                                                <DropdownMenuItem 
                                                    key={sleeves.label}
                                                    className={cn('flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100':
                                                                sleeves.label === options.sleeves.label,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions((prev) => ({ ...prev, sleeves }))
                                                    }}
                                                >
                                                    <Check className={cn("m-2 h-4 w-4",sleeves.label === options.sleeves.label ? "opacity-100" : "opacity-0")} />
                                                    {sleeves.label} 
                                                    
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Neck</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline"
                                                role="combobox"
                                                className='w-40 justify-center'
                                            >
                                                {options.neck.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-5 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {NECK.options.map((neck)=>(
                                                <DropdownMenuItem 
                                                    key={neck.label}
                                                    className={cn('flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100':
                                                                neck.label === options.neck.label,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions((prev) => ({ ...prev, neck }))
                                                    }}
                                                >
                                                    <Check className={cn("m-2 h-4 w-4",neck.label === options.neck.label ? "opacity-100" : "opacity-0")} />
                                                    {neck.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Quantity</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline"
                                                role="combobox"
                                                className='w-40 justify-center'
                                            >
                                                {options.quantity.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-5 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {Quantity.options.map((quantity)=>(
                                                <DropdownMenuItem 
                                                    key={quantity.label}
                                                    className={cn('flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100':
                                                                quantity.label === options.quantity.label,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions((prev) => ({ ...prev, quantity }))
                                                        
                                                    }}
                                                >
                                                    <Check className={cn("m-2 h-4 w-4",quantity.label === options.quantity.label ? "opacity-100" : "opacity-0")} />
                                                    {quantity.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className='w-full px-8 h-16 bg-white'>
                    <div className='h-px w-full bg-zinc-200'/>
                    <div className='w-full h-full flex justify-end items-center'>
                        <div  className='w-full flex gap-6 items-center'>
                            <p className='font-medium whitespace-nowrap'>
                                {formatPrice((BASE_PRICE*options.quantity.label))}
                            </p>
                            <Button 
                                onClick={()=>saveConfig({
                                    configId,
                                    color: options.color.value,
                                    sleeve: options.sleeves.value,
                                    size: options.model.value,
                                    neck: options.neck.value,
                                    quantity: options.quantity.value,
                                })} 
                                size='sm'
                                className='w-full'
                            >
                                Continue
                                <ArrowRight className='h-4 w-4 ml-1.5 inline'/>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    

    )
}
export default DesignConfigurator
