export default async function handler(req, res) {
    try {

        /*
         * ==========================================
         * MONETAG → VERCEL → TBC REWARD API
         * ==========================================
         *
         * Monetag sends the verified postback to:
         *
         * /api/reward?telegram_id=...
         *
         * Vercel then sends the verified data to
         * the TBC webhook stored in:
         *
         * TBC_WEBHOOK_URL
         *
         * The TBC /ad_reward command is responsible
         * for adding +0.2 to the user's balance.
         */


        // ==========================================
        // 1. MONETAG POSTBACK MUST BE GET
        // ==========================================

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


            // ==========================================
            // 2. CHECK TELEGRAM USER ID
            // ==========================================

            if (!telegram_id) {

                return res.status(400).json({
                    success: false,
                    verified: false,
                    rewarded: false,
                    error: "Missing telegram_id"
                });

            }


            // ==========================================
            // 3. CHECK EVENT ID
            // ==========================================

            if (!ymid) {

                return res.status(400).json({
                    success: false,
                    verified: false,
                    rewarded: false,
                    error: "Missing ymid"
                });

            }


            // ==========================================
            // 4. CHECK REWARD EVENT
            // ==========================================

            const rewardType =
                String(reward_event_type || "")
                    .toLowerCase()
                    .trim();


            /*
             * Monetag rewarded events can be returned
             * as "valued" or "yes" depending on setup.
             */

            if (
                rewardType !== "valued" &&
                rewardType !== "yes"
            ) {

                return res.status(200).json({
                    success: true,
                    verified: false,
                    rewarded: false,
                    message: "Ad was not rewarded",
                    telegram_id: String(telegram_id),
                    ymid: String(ymid),
                    reward_event_type: rewardType
                });

            }


            // ==========================================
            // 5. GET TBC WEBHOOK URL
            // ==========================================

            const tbcWebhook =
                process.env.TBC_WEBHOOK_URL;


            if (!tbcWebhook) {

                console.error(
                    "TBC_WEBHOOK_URL environment variable is missing"
                );

                return res.status(500).json({
                    success: false,
                    verified: true,
                    rewarded: false,
                    error: "TBC_WEBHOOK_URL is missing"
                });

            }


            // ==========================================
            // 6. CREATE DATA FOR TBC
            // ==========================================

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


            console.log(
                "MONETAG REWARD RECEIVED:",
                payload
            );


            // ==========================================
            // 7. SEND VERIFIED DATA TO TBC
            // ==========================================

            const tbcResponse = await fetch(
                tbcWebhook,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );


            // ==========================================
            // 8. READ TBC RESPONSE
            // ==========================================

            const tbcText =
                await tbcResponse.text();


            console.log(
                "TBC RESPONSE STATUS:",
                tbcResponse.status
            );

            console.log(
                "TBC RESPONSE:",
                tbcText
            );


            // ==========================================
            // 9. TBC ERROR
            // ==========================================

            if (!tbcResponse.ok) {

                return res.status(502).json({

                    success: false,

                    verified: true,

                    rewarded: false,

                    error:
                        "TBC webhook failed",

                    tbc_status:
                        tbcResponse.status,

                    tbc_response:
                        tbcText,

                    telegram_id:
                        String(telegram_id),

                    ymid:
                        String(ymid)

                });

            }


            // ==========================================
            // 10. SUCCESS
            // ==========================================

            return res.status(200).json({

                success: true,

                verified: true,

                rewarded: true,

                message:
                    "Reward successfully sent to TBC",

                telegram_id:
                    String(telegram_id),

                ymid:
                    String(ymid),

                tbc_status:
                    tbcResponse.status,

                tbc_response:
                    tbcText

            });

        }


        // ==========================================
        // 11. BROWSER / MINI APP REQUEST
        // ==========================================

        if (req.method === "POST") {

            /*
             * IMPORTANT:
             *
             * Browser/Mini App requests NEVER receive
             * balance credit directly.
             *
             * Balance is credited only after Monetag
             * sends the verified postback.
             */

            return res.status(200).json({

                success: true,

                verified: false,

                rewarded: false,

                waiting: true,

                message:
                    "Waiting for Monetag postback verification"

            });

        }


        // ==========================================
        // 12. OTHER HTTP METHODS
        // ==========================================

        return res.status(405).json({

            success: false,

            verified: false,

            rewarded: false,

            error: "Method not allowed"

        });


    } catch (error) {

        // ==========================================
        // 13. SERVER ERROR
        // ==========================================

        console.error(
            "REWARD API ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            verified: false,

            rewarded: false,

            error:
                "Internal server error",

            details:
                String(error)

        });

    }
}
