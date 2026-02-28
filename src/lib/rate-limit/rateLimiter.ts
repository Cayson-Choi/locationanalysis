import { createClient } from '@/lib/supabase/server';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  maxRequests: number = 5,
  windowMinutes: number = 1
): Promise<RateLimitResult> {
  const supabase = await createClient();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  const { count, error } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart.toISOString());

  const currentCount = count ?? 0;
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000);

  if (currentCount >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt };
  }

  // Log this request
  await supabase.from('usage_logs').insert({
    user_id: userId,
    action: 'api_call',
    endpoint,
    metadata: { timestamp: new Date().toISOString() },
  });

  return {
    allowed: true,
    remaining: maxRequests - currentCount - 1,
    resetAt,
  };
}
