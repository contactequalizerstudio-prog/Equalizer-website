import { NextResponse } from "next/server";
import { getAllItemsAsync, createItemAsync } from "@/lib/album-store";

export async function GET() {
  try {
    const items = await getAllItemsAsync();
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/admin/album]", err);
    return NextResponse.json({ error: "Erreur lecture données." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { src, alt, category, title, event, objectPosition } = data;

    if (!src || !title || !category) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (src, title, category)." },
        { status: 400 }
      );
    }

    const newItem = await createItemAsync({
      src,
      alt: alt ?? "",
      category,
      title,
      event: event ?? "",
      objectPosition: objectPosition ?? "center center",
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/album]", err);
    return NextResponse.json({ error: "Erreur création article." }, { status: 500 });
  }
}
