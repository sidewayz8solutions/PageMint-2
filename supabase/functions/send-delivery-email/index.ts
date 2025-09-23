import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  customerEmail: string;
  productName: string;
  downloadToken: string;
  filesMetadata: Array<{
    name: string;
    size: string;
    description: string;
  }>;
  expiresAt: Date;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerEmail, productName, downloadToken, filesMetadata, expiresAt }: EmailRequest = await req.json()

    const downloadUrls = filesMetadata.map(file => ({
      ...file,
      secureUrl: `${Deno.env.get('SITE_URL')}/api/download/${downloadToken}/${encodeURIComponent(file.name)}`,
      directUrl: `${Deno.env.get('SITE_URL')}/downloads/${file.name}`
    }))

    const emailHtml = generateDeliveryEmailHtml({
      customerEmail,
      productName,
      downloadUrls,
      expiresAt: new Date(expiresAt)
    })

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `PageMint <${Deno.env.get('FROM_EMAIL')}>`,
        to: [customerEmail],
        subject: `Your PageMint ${productName} Templates Are Ready! 🎉`,
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      throw new Error(`Resend API error: ${errorData}`)
    }

    const emailResult = await emailResponse.json()
    console.log(`Email sent successfully:`, emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        message: 'Delivery email sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateDeliveryEmailHtml(params: {
  customerEmail: string;
  productName: string;
  downloadUrls: Array<{
    name: string;
    size: string;
    description: string;
    secureUrl: string;
    directUrl: string;
  }>;
  expiresAt: Date;
}): string {
  const { customerEmail, productName, downloadUrls, expiresAt } = params
  const expirationHours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PageMint Templates</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .download-section { background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .download-item { background-color: #ffffff; border-radius: 8px; padding: 16px; margin: 12px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .download-btn { display: inline-block; background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 8px; }
        .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .expiry-warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your Templates Are Ready!</h1>
            <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 18px;">
                Thank you for choosing PageMint ${productName}
            </p>
        </div>

        <div class="content">
            <h2 style="color: #1e293b; margin-top: 0;">Hi there! 👋</h2>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
                Your <strong>${productName}</strong> purchase was successful! 
                You now have access to ${downloadUrls.length} professional template files.
            </p>

            <div class="download-section">
                <h3 style="color: #166534; margin-top: 0;">📦 Your Template Files</h3>
                
                ${downloadUrls.map(file => `
                    <div class="download-item">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin: 0 0 4px 0; color: #1e293b;">${file.description}</h4>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">Size: ${file.size}</p>
                            </div>
                            <a href="${file.secureUrl}" class="download-btn">Download</a>
                        </div>
                    </div>
                `).join('')}
                
                <p style="margin: 16px 0 0 0; color: #166534; font-size: 14px;">
                    💡 <strong>Pro Tip:</strong> Download all files now to avoid any issues later!
                </p>
            </div>

            <div class="expiry-warning">
                <p style="margin: 0; color: #92400e;">
                    ⚠️ <strong>Important:</strong> These download links expire in <strong>${expirationHours} hours</strong>. 
                    Please download your files as soon as possible!
                </p>
            </div>

            <p style="color: #475569; line-height: 1.6; margin-top: 32px;">
                Thank you for choosing PageMint! We can't wait to see what you build with these templates.
            </p>

            <p style="color: #475569; margin-top: 24px;">
                Happy building!<br>
                <strong>The PageMint Team</strong> 🚀
            </p>
        </div>

        <div class="footer">
            <p style="margin: 0 0 12px 0;">
                <strong>PageMint</strong> - Professional SaaS Templates for Makers
            </p>
            <p style="margin: 0 0 12px 0;">
                This email was sent to ${customerEmail}
            </p>
            <p style="margin: 0; font-size: 12px;">
                Need help? Reply to this email or contact support@pagemint.com
            </p>
        </div>
    </div>
</body>
</html>
  `
}
