"use server";

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: account, error: accountError } = await supabase
    .from("wallet_accounts")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (accountError) {
    console.error("Wallet summary error", accountError);
    return NextResponse.json(
      { error: "Impossible de récupérer le wallet" },
      { status: 500 }
    );
  }

  if (!account) {
    return NextResponse.json({
      totalCredits: 0,
      bonusCredits: 0,
      lifetimeCredits: 0,
      lastTransactionAt: null,
      recentTransactions: [],
      categoryBreakdown: [],
    });
  }

  const { data: recentTransactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false })
    .limit(10);

  const { data: breakdown } = await supabase
    .from("wallet_transactions")
    .select("category, amount, type")
    .eq("user_id", user.id);

  const categoryBreakdown = (breakdown ?? []).reduce<Record<string, number>>(
    (acc, item) => {
      const factor = item.type === "debit" ? -1 : 1;
      const category = item.category ?? "autre";
      acc[category] = (acc[category] ?? 0) + Number(item.amount) * factor;
      return acc;
    },
    {}
  );

  return NextResponse.json({
    totalCredits: Number(account.total_credits),
    bonusCredits: Number(account.bonus_credits),
    lifetimeCredits: Number(account.lifetime_credits),
    lastTransactionAt: account.last_transaction_at,
    recentTransactions: (recentTransactions ?? []).map((tx) => ({
      id: tx.id,
      type: tx.type,
      category: tx.category,
      amount: Number(tx.amount),
      balanceAfter: Number(tx.balance_after),
      label: tx.label,
      metadata: tx.metadata,
      occurredAt: tx.occurred_at,
      status: tx.status,
    })),
    categoryBreakdown,
  });
}


