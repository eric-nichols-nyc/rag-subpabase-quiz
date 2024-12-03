import { z } from "zod"

export const uploadSchema = z.object({
  title: z.string(),
  file: z.instanceof(File)
})