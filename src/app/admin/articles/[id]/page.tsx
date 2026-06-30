"use client";

import { use } from "react";
import ArticleForm from "../_form";

export default function ModifierArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ArticleForm mode="edit" itemId={Number(id)} />;
}
