type LeaderboardData = {
    name: string;
    totalExpenses: number;
    email?: string
};


type Expense = {
    _id: string;
    amount: number;
    category: string;
    createdAt: Date;
    description: string;
    updatedAt: Date;
};

type DashboardData = {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    expenses: Expense[];
};

type DownloadData = {
    _id: string;
    createdAt: Date;
    url: string;
}

type Order = {
    amount: number;
    amount_due: number;
    amount_paid: number;
    attempts: number;
    created_at: number;
    currency: string;
    entity: string;
    id: string;
    notes: string[];
    offer_id: string | null;
    receipt: string | null;
    status: string;
};

type RazorpayPaymentFailedResponse = {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id: string;
        };
    };
};

type RazorpayResponse = {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

type LeaderboardUser = {
    name: string;
    totalExpenses: number;
    email?: string;
};

type LeaderboardResponse = {
    leaderboard: LeaderboardUser[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    currentUser: CurrentUserRankInfo | null;
};

interface CurrentUserRankInfo {
    name: string;
    email: string;
    totalExpenses: number;
    rank: number;
}