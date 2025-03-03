// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"

// import { useToast } from "@/hooks/use-toast"

// interface AddCategoryDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
//     const {toast} = useToast()
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<CategoryFormValues>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       description: "",
//     },
//   })

//   async function onSubmit(data: CategoryFormValues) {
//     try {
//       setIsLoading(true)
//       // Here you would typically make an API call to save the category
//       console.log(data)

//       toast({
//         title: "Category created",
//         description: "The category has been created successfully.",
//       })

//       form.reset()
//       onOpenChange(false)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
//         <DialogHeader>
//           <DialogTitle className="text-white">Add Category</DialogTitle>
//           <DialogDescription className="text-gray-400">Create a new category for your products.</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="Enter category name"
//                       className="bg-gray-800 border-gray-700"
//                       disabled={isLoading}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       {...field}
//                       placeholder="Enter category description"
//                       className="bg-gray-800 border-gray-700"
//                       disabled={isLoading}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
//                 {isLoading ? "Creating..." : "Create"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

