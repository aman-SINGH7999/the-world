export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export function validate(
  data: Record<string, any>,
  schema: ValidationSchema,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field]

    if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      errors[field] = `${field} is required`
      continue
    }

    if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field} must be at most ${rule.maxLength} characters`
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = `${field} format is invalid`
      }

      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors[field] = typeof result === "string" ? result : `${field} is invalid`
        }
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
