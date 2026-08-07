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
    const {
      name,
      src,
      height,
      frenchLevel,
      englishLevel,
      studies,
      phone,
      address,
      comment,
    } = data;

    if (!name || !src) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (name, src)." },
        { status: 400 }
      );
    }

    const clampLevel = (n: unknown) =>
      Math.min(5, Math.max(0, Number(n) || 0));
    const asStr = (v: unknown) => (typeof v === "string" ? v : "");

    const newItem = await createHostessAsync({
      name,
      src,
      height: asStr(height),
      frenchLevel: clampLevel(frenchLevel),
      englishLevel: clampLevel(englishLevel),
      studies: asStr(studies),
      phone: asStr(phone),
      address: asStr(address),
      comment: asStr(comment),
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/hostess]", err);
    return NextResponse.json({ error: "Erreur création hôtesse." }, { status: 500 });
  }
}
