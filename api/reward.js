export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const { user_id, init_data, reward_event } = req.body || {};

        if (!user_id) {
            return res.status(400).json({
                success: false,
                error: "Missing user_id"
            });
        }

        if (!init_data) {
            return res.status(400).json({
                success: false,
                error: "Missing Telegram initData"
            });
        }

        if (!reward_event) {
            return res.status(400).json({
                success: false,
                error: "Missing reward event"
            });
        }

        /*
         * IMPORTANT:
         * Do not increase the user's balance here merely because
         * the browser says that an advertisement was completed.
         *
         * Verify:
         * 1. Telegram initData
         * 2. The ad-network's server-side reward notification,
         *    if supported by the provider
         * 3. That the same reward/event has not already been credited
         *
         * Only after those checks should your TBC balance-update
         * operation be performed.
         */

        return res.status(200).json({
            success: true,
            verified: false,
            message: "Reward request received and awaiting verification",
            user_id: String(user_id)
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}
