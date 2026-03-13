import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'



export function formatarTempoRelativo(data: Date | string) {
  return formatDistanceToNow(new Date(data), {
    addSuffix: true,
    locale: ptBR,
  })
}
