import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendFinanceSummaryUrl = buildBackendApiUrl("finance-summary/");

  try {
    const response = await fetch(backendFinanceSummaryUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          summary: {
            clients_count: 0,
            projects_count: 0,
            installments_count: 0,
            total_billed: "0.00",
            total_received: "0.00",
            total_pending: "0.00",
            total_overdue: "0.00",
            total_due_today: "0.00",
          },
          upcoming_installments: [],
          recent_payments: [],
        },
        { status: 200 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        summary: {
          clients_count: 0,
          projects_count: 0,
          installments_count: 0,
          total_billed: "0.00",
          total_received: "0.00",
          total_pending: "0.00",
          total_overdue: "0.00",
          total_due_today: "0.00",
        },
        upcoming_installments: [],
        recent_payments: [],
      },
      { status: 200 },
    );
  }
}
