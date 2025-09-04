import pb from '@/lib/pocketbase';
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const rzp = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentId, subscriptionId, userId } = req.body;

    try {
        // Verify payment status
        const payment = await rzp.payments.fetch(paymentId);
        if (payment.status === 'captured') {
            // Verify subscription status
            // const subscription = await rzp.subscriptions.fetch(subscriptionId);
            // if (subscription.status === 'active') {
            // }
            // Update DB
            pb.authStore.save(process.env.DB_SUPER_USER_TOKEN!);

            await pb.collection("users").update(userId, {
                plan_expiry: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            });

            pb.authStore.clear();

            return res.json({ success: true });
        }
        return res.json({ success: false, error: 'Payment or subscription not confirmed yet' });
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ success: false, error: 'Verification failed' });
    }
}