import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { ArtistProfile } from '@/types/artist'

interface ProfileRow {
  id: string
  display_name: string
  contact_url: string | null
  copyright: string | null
  created_at: string
}

function rowToProfile(row: ProfileRow): ArtistProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    ...(row.contact_url != null && { contactUrl: row.contact_url }),
    ...(row.copyright != null && { copyright: row.copyright }),
    createdAt: row.created_at,
  }
}

// GET /api/profiles?id=<id>  — fetch one profile by id
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const db = getDb()
  const row = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as ProfileRow | undefined

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(rowToProfile(row))
}

// POST /api/profiles  — create a new profile
export async function POST(req: NextRequest) {
  const body: ArtistProfile = await req.json()
  const { id, displayName, contactUrl, copyright, createdAt } = body

  if (!id || !displayName || !createdAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = getDb()
  db.prepare(`
    INSERT INTO profiles (id, display_name, contact_url, copyright, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, displayName, contactUrl ?? null, copyright ?? null, createdAt)

  return NextResponse.json(body, { status: 201 })
}

// PUT /api/profiles?id=<id>  — update an existing profile
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const body: Partial<ArtistProfile> = await req.json()
  const db = getDb()

  const existing = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id) as ProfileRow | undefined
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const displayName = body.displayName ?? existing.display_name
  const contactUrl = body.contactUrl !== undefined ? body.contactUrl : existing.contact_url
  const copyright = body.copyright !== undefined ? body.copyright : existing.copyright

  db.prepare(`
    UPDATE profiles SET display_name = ?, contact_url = ?, copyright = ? WHERE id = ?
  `).run(displayName, contactUrl ?? null, copyright ?? null, id)

  return NextResponse.json(rowToProfile({ ...existing, display_name: displayName, contact_url: contactUrl ?? null, copyright: copyright ?? null }))
}

// DELETE /api/profiles?id=<id>  — delete a profile
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const db = getDb()
  const result = db.prepare('DELETE FROM profiles WHERE id = ?').run(id)

  if (result.changes === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
