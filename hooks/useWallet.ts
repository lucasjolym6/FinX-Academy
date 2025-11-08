"use client";

import useSWR from "swr";

type WalletTransaction = {
  id: string;
  type: "credit" | "debit";
  category: string;
  amount: number;
  balanceAfter: number;
  label: string;
  metadata: Record<string, any> | null;
  referenceId?: string | null;
  occurredAt: string;
  status: string;
};

type WalletSummary = {
  totalCredits: number;
  bonusCredits: number;
  lifetimeCredits: number;
  lastTransactionAt: string | null;
  recentTransactions: WalletTransaction[];
  categoryBreakdown: Record<string, number>;
};

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error("Erreur fetch wallet");
  }
  return res.json();
});

export function useWalletSummary() {
  const { data, error, mutate, isLoading } = useSWR<WalletSummary>(
    "/api/wallet/summary",
    fetcher
  );

  return {
    summary: data,
    error,
    isLoading,
    refresh: mutate,
  };
}

export type WalletTransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  items: WalletTransaction[];
};

export function useWalletTransactions(query?: { page?: number; limit?: number; category?: string; type?: string }) {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.category) params.set("category", query.category);
  if (query?.type) params.set("type", query.type);

  const key = `/api/wallet/transactions${params.toString() ? `?${params.toString()}` : ""}`;

  const { data, error, mutate, isLoading } = useSWR<WalletTransactionsResponse>(
    key,
    fetcher
  );

  return {
    transactions: data,
    error,
    isLoading,
    refresh: mutate,
  };
}

type ApplyTransactionPayload = {
  type: "credit" | "debit";
  category: string;
  amount: number;
  label: string;
  metadata?: Record<string, any>;
  referenceId?: string;
};

export async function applyWalletTransaction(payload: ApplyTransactionPayload) {
  const res = await fetch("/api/wallet/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Impossible d'appliquer la transaction");
  }

  return res.json();
}


