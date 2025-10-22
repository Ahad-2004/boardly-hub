import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  department: z.enum(["CSE", "IT", "ECE", "MECH", "CIVIL"]),
  year: z.enum(["1st", "2nd", "3rd", "4th"]),
  expiry_date: z.string().min(1, "Expiry date is required"),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

interface NoticeFormProps {
  onSubmit: (data: NoticeFormData) => Promise<void>;
  initialData?: Partial<NoticeFormData>;
  submitLabel?: string;
}

export const NoticeForm = ({ onSubmit, initialData, submitLabel = "Create Notice" }: NoticeFormProps) => {
  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      department: "CSE",
      year: "1st",
      expiry_date: "",
    },
  });

  const handleSubmit = async (data: NoticeFormData) => {
    await onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Notice" : "Create New Notice"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notice title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notice description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="ECE">ECE</SelectItem>
                        <SelectItem value="MECH">MECH</SelectItem>
                        <SelectItem value="CIVIL">CIVIL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
