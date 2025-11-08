"use server";

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const page = Number(url.searchParams.get("page") ?? "1");
  const offset = (page - 1) * limit;
  const categoryFilter = url.searchParams.get("category");
  const typeFilter = url.searchParams.get("type");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let query = supabase
    .from("wallet_transactions")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryFilter) {
    query = query.eq("category", categoryFilter);

  }
  if (typeFilter) {
    query = query.eq("type", typeFilter);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Liste transactions wallet", error);
    return NextResponse.json(
      { error: "Impossible de récupérer l'historique" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    page,
    limit,
    total: count ?? 0,
    items: (data ?? []).map((tx) => ({
      id: tx.id,
      type: tx.type,
      category: tx.category,
      amount: Number(tx.amount),
      balanceAfter: Number(tx.balance_after),
      label: tx.label,
      metadata: tx.metadata,
      referenceId: tx.reference_id,
      occurredAt: tx.occurred_at,
      status: tx.status,
    })),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const { type, category, amount, label, metadata, referenceId } = body ?? {};

  if (!type || !category || !amount || !label) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc("apply_wallet_transaction", {
      p_user_id: user.id,
      p_type: type,
      p_category: category,
      p_amount: Number(amount),
      p_label: label,
      p_metadata: metadata ?? {},
      p_reference_id: referenceId ?? null,
    });

    if (error || !data) {
      console.error("Apply wallet transaction", error);
      return NextResponse.json(
        { error: error?.message ?? "Impossible d'enregistrer la transaction" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      transaction: {
        id: data.id,
        type: data.type,
        category: data.category,
        amount: Number(data.amount),
        balanceAfter: Number(data.balance_after),
        label: data.label,
        metadata: data.metadata,
        referenceId: data.reference_id,
        occurredAt: data.occurred_at,
        status: data.status,
      },
    });
  } catch (error) {
    console.error("Erreur RPC wallet", error);
    return NextResponse.json(
      { error: "Erreur lors de l'application de la transaction" },
      { status: 500 }
    );
  }
}


