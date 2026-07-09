import { NextResponse } from "next/server";
import { getAllHostessesAsync, createHostessAsync } from "@/lib/hostess-store";

export async function GET() {
  try {
    const items = await getAllHostessesAsync();
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/admin/hostess]", err);
    return NextResponse.json({ error: "Erreur lecture données." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, src } = data;

    if (!name || !src) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (name, src)." },
        { status: 400 }
      );
    }

    const newItem = await createHostessAsync({ name, src });
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/hostess]", err);
    return NextResponse.json({ error: "Erreur création hôtesse." }, { status: 500 });
  }
}
