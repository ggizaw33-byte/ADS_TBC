export default async function handler(req, res) {

try {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    }


    const {
        telegram_id,
        status,
        elapsed
    } = req.body || {};


    if (!telegram_id) {

        return res.status(400).json({
            success: false,
            error: "Missing telegram_id"
        });

    }


    if (!status) {

        return res.status(400).json({
            success: false,
            error: "Missing status"
        });

    }


    /*
    ==========================================
    ONLY SEND FAILURE STATUS
    ==========================================
    */

    if (
        status !== "not_finished" &&
        status !== "expired"
    ) {

        return res.status(400).json({
            success: false,
            error: "Invalid status"
        });

    }


    /*
    ==========================================
    TBC WEBHOOK
    ==========================================
    */

    const tbcWebhook =
        process.env.TBC_AD_STATUS_WEBHOOK_URL;


    if (!tbcWebhook) {

        console.error(
            "TBC_AD_STATUS_WEBHOOK_URL is missing"
        );

        return res.status(500).json({
            success: false,
            error: "TBC webhook not configured"
        });

    }


    /*
    ==========================================
    SEND DATA TO TBC
    ==========================================
    */

    const payload = {

        telegram_id:
            String(telegram_id),

        status:
            String(status),

        elapsed:
            String(elapsed || "")

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


    console.log(
        "TBC status response:",
        response.status,
        responseText
    );


    if (!response.ok) {

        return res.status(502).json({

            success: false,

            error:
                "TBC webhook failed",

            tbc_status:
                response.status

        });

    }


    return res.status(200).json({

        success: true,

        telegram_id:
            String(telegram_id),

        status:
            String(status)

    });


} catch (error) {

    console.error(
        "Ad status error:",
        error
    );


    return res.status(500).json({

        success: false,

        error:
            "Internal server error"

    });

}

}