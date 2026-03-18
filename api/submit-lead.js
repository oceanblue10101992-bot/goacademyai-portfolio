export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { name, email, phone, message } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const airtableData = {
        fields: {
            "Name": name,
            "Email": email,
            "Phone": phone || "",
            "Message": message || "",
            "Source": "Website",
            "Status": "New"
        }
    };
    
    try {
        const response = await fetch('https://api.airtable.com/v0/appRszGAozGXEvJp6/Leads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(airtableData)
        });
        
        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorData = await response.json();
            return res.status(500).json({ error: errorData });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
