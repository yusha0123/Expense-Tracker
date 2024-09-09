type User = {
    email: string | null;
    token: string | null;
    isPremium: boolean | null;
};

type AuthState = {
    user: User | null;
    showConfetti: boolean;
    isInitializing: boolean;
}

type AuthAction =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" }
    | { type: "UPGRADE" }
    | { type: "TOGGLE_CONFETTI" }
    | { type: "SET_INITIALIZING"; payload: boolean };


type LeaderboardData = {
    name: string;
    totalExpenses: number;
    email?: string
};

type ReportData = {
    _id: string;
    amount: number;
    category: string;
    createdAt: Date;
    description: string;
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

interface DecodedToken {
    email: string;
    isPremium: boolean;
}