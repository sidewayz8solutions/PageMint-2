// Email templates for digital product delivery

export const deliveryEmailTemplate = (data) => {
  const { 
    productName, 
    downloadUrls, 
    customerEmail, 
    expirationHours, 
    purchaseDate,
    downloadInstructions = [],
    troubleshootingTips = []
  } = data;
  
  return {
    subject: `Your PageMint ${productName} Templates Are Ready! 🎉`,
    html: `
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
        .support-box { background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .instructions-box { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #22c55e; }
        .troubleshooting-box { background-color: #fef7ff; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #a855f7; }
        .file-type-badge { display: inline-block; background-color: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 10px; text-transform: uppercase; margin-left: 8px; }
        .template-badge { background-color: #dcfce7; color: #166534; }
        .guide-badge { background-color: #dbeafe; color: #1e40af; }
        .assets-badge { background-color: #f3e8ff; color: #7c2d12; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Your Templates Are Ready!</h1>
            <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 18px;">
                Thank you for choosing PageMint ${productName}
            </p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2 style="color: #1e293b; margin-top: 0;">Hi there! 👋</h2>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
                Your <strong>${productName}</strong> purchase on ${purchaseDate} was successful! 
                You now have access to ${downloadUrls.length} professional template files that will help you launch faster and look amazing.
            </p>

            <!-- Download Section -->
            <div class="download-section">
                <h3 style="color: #166534; margin-top: 0; display: flex; align-items: center;">
                    📦 Your Template Files
                </h3>
                
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

            <!-- Expiry Warning -->
            <div class="expiry-warning">
                <p style="margin: 0; color: #92400e;">
                    ⚠️ <strong>Important:</strong> These download links expire in <strong>${expirationHours} hours</strong>. 
                    Please download your files as soon as possible!
                </p>
            </div>

            <!-- What's Included -->
            <div style="margin: 32px 0;">
                <h3 style="color: #1e293b;">What's Included in Your ${productName}:</h3>
                <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
                    ${productName === 'Starter Pack' ? `
                        <li>2 Premium template variations (HTML + CSS)</li>
                        <li>Mobile-responsive design</li>
                        <li>Basic SEO optimization</li>
                        <li>Setup & customization guide</li>
                        <li>Premium icon set</li>
                    ` : `
                        <li>5 Premium template variations (HTML + CSS)</li>
                        <li>Advanced mobile-responsive design</li>
                        <li>Complete SEO optimization</li>
                        <li>Comprehensive customization guide (PDF)</li>
                        <li>Premium asset library (icons, fonts, graphics)</li>
                        <li>Bonus stock photography</li>
                        <li>Lifetime updates</li>
                    `}
                </ul>
            </div>

            <!-- Quick Start -->
            <div style="margin: 32px 0;">
                <h3 style="color: #1e293b;">🚀 Quick Start Guide:</h3>
                <ol style="color: #475569; line-height: 1.8; padding-left: 20px;">
                    <li>Download and extract all template files</li>
                    <li>Open any template's index.html in your browser</li>
                    <li>Customize colors, text, and images to match your brand</li>
                    <li>Deploy to your favorite hosting platform</li>
                    <li>Launch and start converting visitors! 🎯</li>
                </ol>
            </div>

            <!-- Support -->
            <div class="support-box">
                <h3 style="color: #1e40af; margin-top: 0;">🛟 Need Help?</h3>
                <p style="color: #1e40af; margin-bottom: 16px;">
                    Our team is here to help you succeed! Reach out anytime:
                </p>
                <div style="color: #3730a3;">
                    <p style="margin: 8px 0;">📧 <strong>Email:</strong> support@pagemint.com</p>
                    <p style="margin: 8px 0;">📚 <strong>Documentation:</strong> https://pagemint.com/docs</p>
                    <p style="margin: 8px 0;">💬 <strong>Community:</strong> https://pagemint.com/community</p>
                </div>
            </div>

            <p style="color: #475569; line-height: 1.6; margin-top: 32px;">
                Thank you for choosing PageMint! We can't wait to see what you build with these templates. 
                Don't forget to share your creations with us – we love seeing our templates in action! 🌟
            </p>

            <p style="color: #475569; margin-top: 24px;">
                Happy building!<br>
                <strong>The PageMint Team</strong> 🚀
            </p>
        </div>

            <!-- Quick Start Instructions -->
            ${downloadInstructions.length > 0 ? `
            <div class="instructions-box">
                <h3 style="color: #22c55e; margin-top: 0;">🚀 Quick Start Guide:</h3>
                <ol style="color: #475569; line-height: 1.8; padding-left: 20px; margin: 12px 0;">
                    ${downloadInstructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
            ` : ''}
        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 12px 0;">
                <strong>PageMint</strong> - Professional SaaS Templates for Makers
            </p>
            <p style="margin: 0 0 12px 0;">
                This email was sent to ${customerEmail}
            </p>
            <p style="margin: 0; font-size: 12px;">
                If you have any questions, reply to this email or contact support@pagemint.com
            </p>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Your PageMint ${productName} Templates Are Ready! 🎉

Hi there! ��

Your ${productName} purchase was successful! You now have access to professional SaaS landing page templates.

            <!-- Troubleshooting Tips -->
            ${troubleshootingTips.length > 0 ? `
            <div class="troubleshooting-box">
                <h3 style="color: #a855f7; margin-top: 0;">🛠️ Troubleshooting Tips:</h3>
                <ul style="color: #475569; line-height: 1.8; padding-left: 20px; margin: 12px 0;">
                    ${troubleshootingTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
Your Download Links:
${downloadUrls.map(file => `- ${file.description} (${file.size}): ${file.secureUrl}`).join('\n')}

                    Our team is here to help you succeed! We typically respond within 4 hours:
                    <p style="margin: 8px 0;">🆔 <strong>Order ID:</strong> Include your order details when contacting support</p>
                    <p style="margin: 8px 0;">⏰ <strong>Response Time:</strong> 4 hours average (24/7 support)</p>
⚠️ IMPORTANT: These links expire in ${expirationHours} hours!

                Feel free to share your creations with us – we love seeing our templates in action! 🌟
Quick Start:
1. Download and extract all files
2. Open any template's index.html in your browser  
3. Customize colors, text, and images
4. Deploy to your hosting platform
5. Launch and start converting! 🎯

Need Help?
📧 Email: support@pagemint.com
📚 Docs: https://pagemint.com/docs

                This email was sent to ${customerEmail} on ${purchaseDate}
            <p style="margin: 0 0 12px 0;">
                Download links expire in ${expirationHours} hours • Lifetime updates included
            </p>
Thank you for choosing PageMint!
The PageMint Team 🚀
    `
  };
};

export default { deliveryEmailTemplate };
