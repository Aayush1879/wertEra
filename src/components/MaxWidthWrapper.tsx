import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxwidthWrapper = ({className,children}:{
    className?:String
    children:ReactNode
})=>{
    return <div className={cn("h-full mx-auto max-w-screen-xl px-2.5 md:px-20",className)}>
        {children}
    </div>
}
export default MaxwidthWrapper