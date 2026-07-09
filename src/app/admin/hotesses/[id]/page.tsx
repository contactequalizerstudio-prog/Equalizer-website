"use client";

import { use } from "react";
import HostessForm from "../_form";

export default function ModifierHotessePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <HostessForm mode="edit" itemId={Number(id)} />;
}
