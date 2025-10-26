import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let ratelimit: Ratelimit | null = null

function getRatelimit() {
  if (!ratelimit && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    })
  }
  return ratelimit
}

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const rl = getRatelimit()
  if (!rl) return true // Skip if not configured

  try {
    const { success } = await rl.limit(identifier)
    return success
  } catch (error) {
    console.error("[Rate Limit Error]", error)
    return true // Allow on error
  }
}
