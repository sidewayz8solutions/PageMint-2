import { verifyPayment } from './stripe';

// File delivery service for digital products
class FileDeliveryService {
  constructor() {
    this.baseUrl = window.location.origin;
    this.deliveryEmail = 'support@pagemint.com';
    this.downloadTokens = new Map(); // In production, use Redis or database
    this.securityKey = 'pagemint_secure_2024'; // In production, use proper secrets
  }

  // Generate secure download token
  generateSecureToken(productId, sessionId) {
    const timestamp = Date.now();
    const expirationTime = timestamp + (24 * 60 * 60 * 1000); // 24 hours
    const tokenData = {
      productId,
      sessionId,
      timestamp,
      expirationTime,
      used: false
    };
    
    // Create secure token (in production, use proper JWT or encryption)
    const token = btoa(JSON.stringify(tokenData)) + '_' + this.hashString(productId + sessionId + timestamp);
    
    // Store token (in production, use database)
    this.downloadTokens.set(token, tokenData);
    
    return token;
  }

  // Simple hash function (in production, use proper crypto)
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Validate download token
  validateToken(token) {
    const tokenData = this.downloadTokens.get(token);
    
    if (!tokenData) {
      return { valid: false, reason: 'Token not found' };
    }
    
    if (tokenData.used) {
      return { valid: false, reason: 'Token already used' };
    }
    
    if (Date.now() > tokenData.expirationTime) {
      return { valid: false, reason: 'Token expired' };
    }
    
    return { valid: true, data: tokenData };
  }
  // Generate secure download URLs for template packs
  async generateDownloadUrls(productId, sessionId) {
    const templatePacks = {
      STARTER_PACK: [
        {
          name: 'minimalist-clean.zip',
          url: `${this.baseUrl}/downloads/starter/minimalist-clean.zip`,
          size: '2.5 MB',
          description: 'Minimalist Clean Template + Assets',
          localPath: '/downloads/starter/minimalist-clean.zip',
          type: 'template'
        },
        {
          name: 'gradient-startup.zip', 
          url: `${this.baseUrl}/downloads/starter/gradient-startup.zip`,
          size: '3.1 MB',
          description: 'Gradient Startup Template + Assets',
          localPath: '/downloads/starter/gradient-startup.zip',
          type: 'template'
        },
        {
          name: 'setup-guide.pdf',
          localPath: '/downloads/starter/setup-guide.pdf',
          size: '0.8 MB',
          description: 'Quick Setup & Customization Guide',
          type: 'guide'
        }
      ],
      PRO_PACK: [
        {
          name: 'all-templates.zip',
          url: `${this.baseUrl}/downloads/pro/all-templates-pack.zip`,
          size: '12.8 MB',
          description: 'Complete Template Collection (5 Templates)',
          localPath: '/downloads/pro/all-templates-pack.zip',
          type: 'template'
        },
        {
          name: 'customization-guide.pdf',
          url: `${this.baseUrl}/downloads/pro/customization-guide.pdf`,
          size: '1.2 MB',
          description: 'Complete Customization Guide',
          localPath: '/downloads/pro/customization-guide.pdf',
          type: 'guide'
        },
        {
          name: 'bonus-assets.zip',
          url: `${this.baseUrl}/downloads/pro/bonus-assets.zip`,
          size: '5.4 MB',
          description: 'Premium Icons, Fonts & Graphics',
          localPath: '/downloads/pro/bonus-assets.zip',
          type: 'assets'
        },
        {
          name: 'figma-files.zip',
          localPath: '/downloads/pro/figma-source-files.zip',
          size: '8.1 MB',
          description: 'Figma Source Files (Design Files)',
          type: 'design'
        }
      ]
    };

    // Add timestamp and basic security token
    const timestamp = Date.now();
    const securityToken = btoa(`${productId}-${timestamp}`);
    
    const files = templatePacks[productId] || [];
    
    return files.map(file => ({
      ...file,
      secureUrl: `${file.url}?token=${securityToken}&t=${timestamp}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }));
  }

  // Initiate file download
  async downloadFile(url, filename) {
    try {
      // Show download starting notification
      this.showNotification(`Starting download: ${filename}`, 'info');
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add click handler for tracking
      link.addEventListener('click', () => {
        this.trackDownload(filename);
        this.showNotification(`Download started: ${filename}`, 'success');
      });
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Simulate download completion tracking
      setTimeout(() => {
        this.showNotification(`Download completed: ${filename}`, 'success');
      }, 2000);
      
      return { success: true, message: `Started download of ${filename}` };
    } catch (error) {
      console.error('Download error:', error);
      this.showNotification(`Download failed: ${filename}`, 'error');
      return { success: false, message: 'Download failed. Please try again.' };
    }
  }

  // Show user notifications
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    switch (type) {
      case 'success':
        notification.className += ' bg-green-500 text-white';
        break;
      case 'error':
        notification.className += ' bg-red-500 text-white';
        break;
      case 'info':
      default:
        notification.className += ' bg-blue-500 text-white';
        break;
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Batch download with progress tracking
  async downloadAllFiles(downloadUrls) {
    const results = [];
    let successCount = 0;
    
    this.showNotification(`Starting batch download of ${downloadUrls.length} files...`, 'info');
    
    for (let i = 0; i < downloadUrls.length; i++) {
      const file = downloadUrls[i];
      try {
        const result = await this.downloadFile(file.secureUrl, file.name);
        results.push({ ...result, filename: file.name });
        
        if (result.success) {
          successCount++;
        }
        
        // Add delay between downloads to prevent browser blocking
        if (i < downloadUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        results.push({ 
          success: false, 
          message: `Failed to download ${file.name}`, 
          filename: file.name 
        });
      }
    }
    
    // Show completion summary
    if (successCount === downloadUrls.length) {
      this.showNotification(`✅ All ${successCount} files downloaded successfully!`, 'success');
    } else if (successCount > 0) {
      this.showNotification(`⚠️ ${successCount}/${downloadUrls.length} files downloaded. Check email for backup links.`, 'info');
    } else {
      this.showNotification(`❌ Download failed. Please try individual downloads or check your email.`, 'error');
    }
    
    return {
      totalFiles: downloadUrls.length,
      successCount,
      results
    };
  }
  // Send delivery email with download links
  async sendDeliveryEmail(customerEmail, productId, downloadUrls) {
    try {
      const product = productId === 'STARTER_PACK' ? 'Starter Pack' : 'Pro Pack';
      
      // Prepare email data with enhanced template
      const emailData = {
        to: customerEmail,
        subject: `Your PageMint ${product} Templates Are Ready! 🎉`,
        template: 'digital_product_delivery',
        data: {
          productName: product,
          downloadUrls,
          customerEmail,
          supportEmail: this.deliveryEmail,
          expirationHours: 24,
          purchaseDate: new Date().toLocaleDateString(),
          downloadInstructions: this.getDownloadInstructions(productId),
          troubleshootingTips: this.getTroubleshootingTips()
        }
      };

      // Generate secure token for this download session
      const secureToken = this.generateSecureToken(productId, sessionId);
      // For demo purposes - simulate email delivery
      console.log('Email delivery data:', emailData);
      console.log('📧 EMAIL CONTENT PREVIEW:');
      console.log(`To: ${customerEmail}`);
      console.log(`Subject: ${emailData.subject}`);
      console.log(`Product: ${product}`);
      console.log(`Files: ${downloadUrls.length}`);
      downloadUrls.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.description} (${file.size})`);
        console.log(`     Download: ${file.secureUrl}`);
      });
      console.log(`Expires: ${downloadUrls[0]?.expiresAt}`);
      
      // In production, call your email API:
      // const response = await fetch('/api/send-delivery-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData)
      // });
      
      // Simulate successful email delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: `Delivery email sent to ${customerEmail}`,
        emailData,
        previewUrl: this.generateEmailPreviewUrl(emailData)
      };
    } catch (error) {
      console.error('Email delivery error:', error);
      return { 
        success: false, 
        message: 'Failed to send delivery email',
        error: error.message
      };
    }
  }

  // Get download instructions based on product
  getDownloadInstructions(productId) {
    const instructions = {
      STARTER_PACK: [
        "1. Click the download buttons below to save all files",
        "2. Extract the ZIP files to your project folder", 
        "3. Open any template's index.html in your browser",
        "4. Follow the included setup guide for customization",
        "5. Deploy using Vercel, Netlify, or any static host"
      ],
      PRO_PACK: [
        "1. Download all files using the buttons below",
        "2. Extract all ZIP archives to your project folder",
        "3. Review the comprehensive customization guide (PDF)",
        "4. Choose your favorite template and start customizing",
        "5. Use the bonus assets and Figma files for advanced customization",
        "6. Deploy following the included deployment guide"
      ]
    };
    
    return instructions[productId] || instructions.PRO_PACK;
  }

  // Get troubleshooting tips
  getTroubleshootingTips() {
    return [
      "🔍 Download issues? Try right-clicking links and 'Save As'",
      "📧 Links expire in 24 hours - download promptly",
      "🌐 Some browsers block multiple downloads - try one at a time",
      "📱 Mobile downloads? Use a desktop/laptop for best experience",
      "❓ Need help? Email support@pagemint.com with your order details"
    ];
  }

  // Generate email preview URL (for demo)
  generateEmailPreviewUrl(emailData) {
    return `${this.baseUrl}/email-preview?data=${encodeURIComponent(JSON.stringify(emailData))}`;
  }
  // Complete delivery process
  async deliverProduct(sessionId, customerEmail) {
    try {
      console.log('🚀 Starting product delivery process...');
      console.log(`Session: ${sessionId}, Email: ${customerEmail}`);
      
      // 1. Verify payment was successful
      const paymentData = await verifyPayment(sessionId);
      console.log('💳 Payment verification:', paymentData);
      
      if (!paymentData.success) {
        throw new Error('Payment verification failed');
      }

      // 2. Generate download URLs for the purchased product
      const downloadUrls = await this.generateDownloadUrls(paymentData.productId, sessionId);
      console.log(`📦 Generated ${downloadUrls.length} download URLs for ${paymentData.productId}`);
      
      if (downloadUrls.length === 0) {
        throw new Error('No files found for this product');
      }

      // 3. Send delivery email
      const emailResult = await this.sendDeliveryEmail(
        customerEmail, 
        paymentData.productId, 
        downloadUrls
      );
      console.log('📧 Email delivery result:', emailResult);

      // 4. Log delivery for analytics
      this.logDelivery({
        sessionId,
        productId: paymentData.productId,
        customerEmail,
        fileCount: downloadUrls.length,
        timestamp: new Date().toISOString(),
        emailSent: emailResult.success
      });
      // 4. Return complete delivery data
      return {
        success: true,
        productId: paymentData.productId,
        downloadUrls,
        emailDelivery: emailResult,
        message: 'Templates delivered successfully!'
      };

      // 5. Return complete delivery data
    } catch (error) {
      console.error('Product delivery error:', error);
      
      // Log delivery failure
      this.logDelivery({
        sessionId,
        customerEmail,
        error: error.message,
        timestamp: new Date().toISOString(),
        success: false
      });
      
      return {
        productName: paymentData.productId === 'STARTER_PACK' ? 'Starter Pack' : 'Pro Pack',
        deliveryTimestamp: new Date().toISOString(),
        expirationTime: downloadUrls[0]?.expiresAt,
        downloadInstructions: this.getDownloadInstructions(paymentData.productId),
        message: 'Templates delivered successfully! Check your email for backup links.',
        success: false,
        message: error.message || 'Failed to deliver product',
        error: error.message,
        supportContact: this.deliveryEmail
      };
    }
  }

  // Track download for analytics
  trackDownload(filename) {
    // Analytics tracking
    console.log(`Download tracked: ${filename} at ${new Date().toISOString()}`);
    
    // In production, send to analytics service:
    // gtag('event', 'download', {
    //   'event_category': 'Digital Product',
    //   'event_label': filename
    // });
    
    const downloadEvent = {
      filename,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('pagemint_session') || 'unknown'
    };
    
    console.log(`📥 Download tracked:`, downloadEvent);
    //   'event_label': filename,
    //   'custom_parameters': downloadEvent
    
    // Store download tracking
    const downloads = JSON.parse(localStorage.getItem('pagemint_downloads') || '[]');
    downloads.push(downloadEvent);
    localStorage.setItem('pagemint_downloads', JSON.stringify(downloads));
  }

  // Generate ZIP file in memory (for demo purposes)
  generateDemoZip(templateName) {
    // This is a simulation - in production you'd have actual ZIP files
    const demoContent = `
# ${templateName} Template Package

## What's Included:
- index.html (Main template file)
- style.css (Compiled TailwindCSS)
- assets/ (Images, icons, fonts)
- readme.md (Setup instructions)

## Quick Setup:
1. Extract all files
2. Open index.html in browser
3. Customize colors in CSS variables
4. Deploy to your hosting platform

## Customization:
- Colors: Edit CSS variables at top of style.css
- Content: Update text in index.html
- Images: Replace files in assets/images/
- Fonts: Swap font imports in <head>

## Support:
Email: support@pagemint.com
Docs: https://pagemint.com/docs

Happy building! 🚀
`;

    return new Blob([demoContent], { type: 'text/plain' });
  }

  // Log delivery for analytics and support
  logDelivery(deliveryData) {
    // In production, send to analytics service and support system
    console.log('📊 DELIVERY LOG:', deliveryData);
    
    // Store in localStorage for demo (in production, use proper backend)
    const deliveryLogs = JSON.parse(localStorage.getItem('pagemint_delivery_logs') || '[]');
    deliveryLogs.push(deliveryData);
    
    // Keep only last 50 logs
    if (deliveryLogs.length > 50) {
      deliveryLogs.splice(0, deliveryLogs.length - 50);
    }
    
    localStorage.setItem('pagemint_delivery_logs', JSON.stringify(deliveryLogs));
  }

  // Get delivery status for a session
  getDeliveryStatus(sessionId) {
    const deliveryLogs = JSON.parse(localStorage.getItem('pagemint_delivery_logs') || '[]');
    return deliveryLogs.find(log => log.sessionId === sessionId);
  }
}

// Create and export singleton instance
export const fileDelivery = new FileDeliveryService();

// Main delivery function for easy importing
export const deliverDigitalProduct = async (sessionId, customerEmail) => {
  return await fileDelivery.deliverProduct(sessionId, customerEmail);
};

export default fileDelivery;