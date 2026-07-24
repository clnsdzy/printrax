import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()

    if (body.action === 'reset-progress') {
      const { data, error } = await supabase
        .from('print_jobs')
        .update({ quantity_printed: 0 })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[v0] Supabase reset error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    // Get current batches and their corresponding timestamps.
    const { data: currentJob, error: fetchError } = await supabase
      .from('print_jobs')
      .select('batches, batch_dates')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('[v0] Fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Handle batches array
    let batches = currentJob?.batches || []
    let batchDates = currentJob?.batch_dates || []
    if (body.newBatch !== undefined && typeof body.newBatch === 'number') {
      // Pad legacy batches that predate timestamp tracking so indexes stay aligned.
      batchDates = batches.map(
        (_batch: number, index: number) => batchDates[index] ?? null
      )

      // Add the batch and its server timestamp, keeping the most recent 25.
      batches = [...batches, body.newBatch].slice(-25)
      batchDates = [...batchDates, new Date().toISOString()].slice(-25)
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .update({
        job_name: body.jobName,
        description: body.description,
        quantity_ordered: parseInt(body.quantity),
        quantity_printed: parseInt(body.quantityPrinted),
        rate_per_unit: parseFloat(body.rate),
        batches: batches,
        batch_dates: batchDates,
        packs: body.packs ? parseInt(body.packs) : undefined,
        qty_per_pack: body.qtyPerPack ? parseInt(body.qtyPerPack) : undefined,
        waste: body.waste !== undefined ? parseInt(body.waste) : undefined,
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No data returned' }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] PATCH error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('print_jobs')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
