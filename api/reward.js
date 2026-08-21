export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const { user_id } = req.body || {};

    if (!user_id) {
        return res.status(400).json({
            success: false,
            error: "Missing user_id"
        });
    }

    return res.status(200).json({
        success: true,
        user_id: user_id,
        message: "Request received"
    });
}
