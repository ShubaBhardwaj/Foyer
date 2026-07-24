import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Reusable hook to quickly instantiate React Hook Form with a Zod validation schema.
 */
export function useAppForm<TSchema extends z.ZodType<FieldValues, any, any>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema) as any,
  });
}
