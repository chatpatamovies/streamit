import type { NextApiRequest, NextApiResponse } from 'next'
import Razorpay from 'razorpay';

const rzp = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const method = req.method;
    if (method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { plan_id, customer_id } = req.body;

    console.log('Creating subscription for plan:', plan_id, 'and customer:', customer_id);

    if (!plan_id || !customer_id) {
        return res.status(400).json({ error: 'Missing plan_id or customer_id' });
    }


    try {
        const subscription = await rzp.subscriptions.create({
            plan_id: String(plan_id).trim(), // e.g., from dashboard or created plan
            customer_notify: 1,
            total_count: 12, // e.g., max 12 charges (1 year), adjust as needed
            notes: {
                customer_id: String(customer_id).trim(), // For your reference
            },
        });
        return res.status(200).json(subscription);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create subscription' });
    }

}