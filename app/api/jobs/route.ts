import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('[v0] Creating job with data:', body)
    console.log('[v0] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'NOT SET')
    console.log('[v0] Supabase key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'NOT SET')

    const { data, error } = await supabase
      .from('print_jobs')
      .insert([
        {
          job_name: body.jobName,
          description: body.description,
          quantity_ordered: parseInt(body.quantity),
          rate_per_unit: parseFloat(body.rate),
          quantity_printed: 0,
        },
      ])
      .select()

    console.log('[v0] Supabase response - data:', data, 'error:', error)

    if (error) {
      console.error('[v0] Supabase error details:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
      })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create job' },
      { status: 500 }
    )
  }
}
