export default async function handler(req, res) {

    // Monetag Postback is received as GET
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {

        const {
            telegram_id,
            zone_id,
            sub_zone_id,
            event_type,
            reward_event_type,
            estimated_price,
            ymid,
            request_var
        } = req.query;


        // Telegram ID is required
        if (!telegram_id) {
            return res.status(400).json({
                success: false,
                error: "Missing telegram_id"
            });
        }


        // Only rewarded/valued events are accepted
        if (
            String(reward_event_type || "").toLowerCase()
            !== "valued"
        ) {
            return res.status(200).json({
                success: false,
                rewarded: false,
                message: "Event is not valued"
            });
        }


        // Unique Monetag event ID
        if (!ymid) {
            return res.status(400).json({
                success: false,
                error: "Missing ymid"
            });
        }


        /*
         * TBC webhook URL
         *
         * IMPORTANT:
         * Add this in Vercel:
         *
         * TBC_WEBHOOK_URL
         *
         * Do NOT put the private webhook URL directly
         * inside this file.
         */

        const webhookUrl =
            process.env.TBC_WEBHOOK_URL;


        if (!webhookUrl) {
            console.error(
                "TBC_WEBHOOK_URL is missing"
            );

            return res.status(500).json({
                success: false,
                error: "TBC webhook is not configured"
            });
        }


        /*
         * Send verified Monetag reward data
         * to TBC /ad_reward webhook.
         */

        const payload = {

            telegram_id: String(telegram_id),

            zone_id: String(zone_id || ""),

            sub_zone_id:
                String(sub_zone_id || ""),

            event_type:
                String(event_type || ""),

            reward_event_type:
                String(reward_event_type || ""),

            estimated_price:
                String(estimated_price || ""),

            ymid: String(ymid),

            request_var:
                String(request_var || "")

        };


        const webhookResponse =
            await fetch(
                webhookUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );


        const webhookText =
            await webhookResponse.text();


        if (!webhookResponse.ok) {

            console.error(
                "TBC webhook error:",
                webhookResponse.status,
                webhookText
            );

            return res.status(502).json({
                success: false,
                error: "TBC webhook failed"
            });
        }


        return res.status(200).json({

            success: true,

            rewarded: true,

            message:
                "Reward postback accepted",

            telegram_id:
                String(telegram_id),

            ymid:
                String(ymid)

        });


    } catch (error) {

        console.error(
            "Reward API error:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });

    }
}
