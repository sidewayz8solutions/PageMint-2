const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event, context) => {
  const { token, filename } = event.pathParameters

  try {
    // Verify download token
    const { data: delivery, error } = await supabase
      .from('digital_deliveries')
      .select('*')
      .eq('download_token', token)
      .gt('expires_at', new Date().toISOString())
      .eq('is_expired', false)
      .single()

    if (error || !delivery) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Download link expired or invalid' })
      }
    }

    // Log download analytics
    await supabase
      .from('download_analytics')
      .insert({
        delivery_id: delivery.id,
        file_name: filename,
        user_agent: event.headers['user-agent'],
        ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        success: true
      })

    // Update download count
    await supabase
      .from('digital_deliveries')
      .update({
        download_count: delivery.download_count + 1,
        last_downloaded_at: new Date().toISOString()
      })
      .eq('id', delivery.id)

    // Redirect to actual file
    const fileUrl = `${process.env.SITE_URL}/downloads/${filename}`
    
    return {
      statusCode: 302,
      headers: {
        'Location': fileUrl,
        'Cache-Control': 'no-cache'
      }
    }

  } catch (error) {
    console.error('Download handler error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Download failed' })
    }
  }
}
