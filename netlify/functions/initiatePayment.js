const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


exports.handler = async (event) => {
    try {
        const { userId, amount, description } = JSON.parse(event.body);
        const paymentToken = process.env.TELEGRAM_PAYMENT_TOKEN; // Убедитесь, что у вас есть токен

        const response = await fetch(`https://api.telegram.org/bot${paymentToken}/sendInvoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: userId,
                title: 'Покупка Rug Pull',
                description: description,
                payload: 'rug_pull_purchase',
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: 'Rug Pull', amount: amount }]
            })
        });

        const data = await response.json();
        console.log('Telegram API Response:', data);

        if (data.ok) {
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        } else {
            return { statusCode: 400, body: JSON.stringify({ success: false, error: data.description }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
