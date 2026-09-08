import { useIsDesktop } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

export function ResponsiveDialog({ open, onOpenChange, title, description, children }: Props) {
  const isDesktop = useIsDesktop()
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-head font-black text-xl">{title}</DialogTitle>
            {description && <DialogDescription className="font-medium text-foreground">{description}</DialogDescription>}
          </DialogHeader>
          <div className="pt-2">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-4 border-black bg-white rounded-none">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-head font-black text-xl">{title}</DrawerTitle>
          {description && <DrawerDescription className="font-medium text-foreground">{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4 pb-6">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
