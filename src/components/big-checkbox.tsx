import { Checkbox } from "@/components/ui/checkbox"
import { type CheckboxProps } from "@radix-ui/react-checkbox"

export const BigCheckbox = (props: CheckboxProps) => (
  <Checkbox className="w-8 h-8 mr-2" {...props} />
)
