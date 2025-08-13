import { z } from 'zod';

// Esquema de validación para platos
export const dishSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Nombre muy largo'),
  description: z.string().min(1, 'La descripción es requerida').max(200, 'Descripción muy larga'),
  full_description: z.string().min(1, 'La descripción completa es requerida'),
  ingredients: z.array(z.string()).min(1, 'Al menos un ingrediente es requerido'),
  price: z.number().positive('El precio debe ser positivo').max(999.99, 'Precio muy alto'),
  category: z.enum(['appetizer', 'main', 'dessert'], {
    errorMap: () => ({ message: 'Categoría inválida' })
  }),
  available: z.boolean(),
  discount_percentage: z.number().min(0, 'El descuento no puede ser negativo').max(100, 'El descuento no puede ser mayor al 100%').optional(),
  image: z.string().url('URL de imagen inválida').optional()
});

// Esquema de validación para autenticación
export const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type DishFormData = z.infer<typeof dishSchema>;
export type AuthFormData = z.infer<typeof authSchema>;

// Hook para validación centralizada
export const useValidation = () => {
  const validateDish = (data: unknown) => {
    return dishSchema.safeParse(data);
  };

  const validateAuth = (data: unknown) => {
    return authSchema.safeParse(data);
  };

  return {
    validateDish,
    validateAuth,
    dishSchema,
    authSchema
  };
};