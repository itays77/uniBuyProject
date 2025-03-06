"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCreateItem } from "@/api/ItemApi"
import { ItemCountry, KitType } from "@/types"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  description: z.string().optional(),
  country: z.nativeEnum(ItemCountry, {
    message: "Please select a valid country.",
  }),
  kitType: z.nativeEnum(KitType, {
    message: "Please select a valid kit type.",
  }),
  season: z.string().min(4, {
    message: "Season must be at least 4 characters (e.g., '2023/24').",
  }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

const ItemForm = () => {
  const { createItem, isLoading } = useCreateItem()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      country: undefined, // Initialize with undefined for Select component
      kitType: undefined, // Initialize with undefined for Select component
      season: "",
    },
  })

  // Define the submit handler
  async function onSubmit(values: FormValues) {
    try {
      await createItem(values)
      toast.success("Item created successfully!")
      
      // Reset the form
      form.reset({
        name: "",
        price: 0,
        description: "",
        country: undefined,
        kitType: undefined,
        season: "",
      })
    } catch (error) {
      toast.error("Failed to create item")
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Barcelona Home Kit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="99.99" 
                    step="0.01" 
                    min="0" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the kit..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country field */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ItemCountry).map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kit Type field */}
          <FormField
            control={form.control}
            name="kitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kit Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a kit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(KitType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Season field */}
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                  <Input placeholder="2023/24" {...field} />
                </FormControl>
                <FormDescription>
                  The season for this kit (e.g., "2023/24")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Item"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ItemForm