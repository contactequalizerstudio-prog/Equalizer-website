import { NextResponse } from "next/server";
import {
  getHostessByIdAsync,
  updateHostessAsync,
  deleteHostessAsync,
} from "@/lib/hostess-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getHostessByIdAsync(Number(id));
    if (!item) {
      return NextResponse.json({ error: "Hôtesse introuvable." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updated = await updateHostessAsync(Number(id), data);
    if (!updated) {
      return NextResponse.json({ error: "Hôtesse introuvable." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur mise à jour." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = await deleteHostessAsync(Number(id));
    if (!ok) {
      return NextResponse.json({ error: "Hôtesse introuvable." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur suppression." }, { status: 500 });
  }
}
