export default async function handler(req, res) {
    try {

        /*
         * MONETAG POSTBACK
         * ----------------
         * This is the only request that can
         * trigger the TBC reward.
         */

        if (req.method === "GET") {

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


            if (!telegram_id) {
                return res.status(400).json({
                    success: false,
                    error: "Missing telegram_id"
                });
            }


            if (!ymid) {
                return res.status(400).json({
                    success: false,
                    error: "Missing ymid"
                });
            }


            /*
             * Only valued reward events
             */

            if (
                String(reward_event_type || "")
                    .toLowerCase() !== "valued"
            ) {

                return res.status(200).json({
                    success: false,
                    rewarded: false,
                    message: "Not a valued reward"
                });

            }


            /*
             * TBC webhook URL
             */

            const tbcWebhook =
                process.env.TBC_WEBHOOK_URL;


            if (!tbcWebhook) {

                console.error(
                    "TBC_WEBHOOK_URL is missing"
                );

                return res.status(500).json({
                    success: false,
                    error: "TBC webhook not configured"
                });

            }


            /*
             * Send verified reward to TBC
             */

            const payload = {

                telegram_id:
                    String(telegram_id),

                zone_id:
                    String(zone_id || ""),

                sub_zone_id:
                    String(sub_zone_id || ""),

                event_type:
                    String(event_type || ""),

                reward_event_type:
                    String(reward_event_type || ""),

                estimated_price:
                    String(estimated_price || ""),

                ymid:
                    String(ymid),

                request_var:
                    String(request_var || "")

            };


            const response =
                await fetch(
                    tbcWebhook,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            const responseText =
                await response.text();


            if (!response.ok) {

                console.error(
                    "TBC webhook failed:",
                    response.status,
                    responseText
                );

                return res.status(502).json({
                    success: false,
                    error: "TBC webhook failed"
                });

            }


            return res.status(200).json({

                success: true,

                verified: true,

                rewarded: true,

                telegram_id:
                    String(telegram_id),

                ymid:
                    String(ymid)

            });

        }


        /*
         * Browser request
         *
         * DO NOT reward here.
         */

        if (req.method === "POST") {

            return res.status(200).json({

                success: true,

                verified: false,

                waiting: true,

                message:
                    "Waiting for Monetag postback verification"

            });

        }


        return res.status(405).json({

            success: false,

            error: "Method not allowed"

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
