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

    // Handle batches array
    let batches: number[] = []
    
    // Try to get current batches if the column exists
    try {
      const { data: currentJob } = await supabase
        .from('print_jobs')
        .select('batches')
        .eq('id', id)
        .single()

      if (currentJob?.batches) {
        batches = currentJob.batches
      }
    } catch {
      // Column might not exist yet, continue with empty array
      batches = []
    }

    if (body.newBatch !== undefined && typeof body.newBatch === 'number') {
      // Add new batch value and keep only last 25
      batches = [...batches, body.newBatch].slice(-25)
    }

    // Update without batches if the column doesn't exist
    const updatePayload: any = {
      job_name: body.jobName,
      description: body.description,
      quantity_ordered: parseInt(body.quantity),
      quantity_printed: parseInt(body.quantityPrinted),
      rate_per_unit: parseFloat(body.rate),
    }

    // Only add batches if we have values to add
    if (batches.length > 0 || body.newBatch !== undefined) {
      updatePayload.batches = batches
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .update(updatePayload)
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
