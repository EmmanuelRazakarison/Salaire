import { z } from "zod";

export const salaryFormSchema = z.object({
  grossSalary: z.string().optional(),
  netSalary: z.string().optional(),
  bonuses: z.string().optional(),
  allowances: z.string().optional(),
  otherGains: z.string().optional(),
  dependents: z.string().optional(),
  isNetToGross: z.boolean(),
});

export type SalaryFormValues = z.infer<typeof salaryFormSchema>;

export const DEFAULT_FORM_VALUES: SalaryFormValues = {
  grossSalary: "",
  netSalary: "",
  bonuses: "0",
  allowances: "0",
  otherGains: "0",
  dependents: "0",
  isNetToGross: false,
};
