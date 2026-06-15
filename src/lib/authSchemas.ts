// Schemas de validação dos formulários de autenticação (validação no boundary,
// antes de chamar o Firebase). Mensagens em PT-BR.
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// Retorna a 1ª mensagem de erro de um safeParse, ou null se válido.
export function firstError(
  result: { success: true } | { success: false; error: z.ZodError },
): string | null {
  if (result.success) return null
  return result.error.issues[0]?.message ?? 'Dados inválidos'
}
