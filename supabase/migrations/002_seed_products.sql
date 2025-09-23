/*
  # Seed PageMint Products
  
  1. Purpose: Insert PageMint product catalog with live Stripe Price IDs
  2. Products: Starter Pack ($29) and Pro Pack ($59)
  3. Note: Replace stripe_price_id values with your actual Stripe Price IDs
*/

-- Insert PageMint products
INSERT INTO products (name, description, price_cents, stripe_price_id, product_type, metadata) VALUES 
(
  'PageMint Starter Pack',
  'Perfect for indie hackers - 2 Template Variations with HTML + TailwindCSS, Mobile Responsive design, Basic SEO Setup, and Personal Use License',
  2900, -- $29.00
  'price_REPLACE_WITH_YOUR_STARTER_PACK_PRICE_ID', -- Replace with actual Stripe Price ID
  'digital',
  '{
    "template_count": 2,
    "includes": ["HTML + TailwindCSS", "Mobile Responsive", "Basic SEO Setup", "Personal Use License"],
    "download_files": [
      {
        "name": "minimalist-clean.zip",
        "size": "2.5 MB",
        "description": "Minimalist Clean Template + Assets"
      },
      {
        "name": "gradient-startup.zip", 
        "size": "3.1 MB",
        "description": "Gradient Startup Template + Assets"
      },
      {
        "name": "setup-guide.pdf",
        "size": "0.8 MB",
        "description": "Quick Setup & Customization Guide"
      }
    ]
  }'::jsonb
),
(
  'PageMint Pro Pack',
  'Best value for agencies - All 5 Template Variations with HTML + TailwindCSS, Mobile Responsive design, Advanced SEO Setup, Customization Guide, and Personal Use License',
  5900, -- $59.00
  'price_REPLACE_WITH_YOUR_PRO_PACK_PRICE_ID', -- Replace with actual Stripe Price ID
  'digital',
  '{
    "template_count": 5,
    "includes": ["All 5 Template Variations", "HTML + TailwindCSS", "Mobile Responsive", "Advanced SEO Setup", "Customization Guide", "Personal Use License"],
    "download_files": [
      {
        "name": "all-templates.zip",
        "size": "12.8 MB",
        "description": "Complete Template Collection (5 Templates)"
      },
      {
        "name": "customization-guide.pdf",
        "size": "1.2 MB",
        "description": "Complete Customization Guide"
      },
      {
        "name": "bonus-assets.zip",
        "size": "5.4 MB",
        "description": "Premium Icons, Fonts & Graphics"
      },
      {
        "name": "figma-files.zip",
        "size": "8.1 MB",
        "description": "Figma Source Files (Design Files)"
      }
    ]
  }'::jsonb
);

-- Verify products were inserted
SELECT id, name, price_cents, stripe_price_id, is_active 
FROM products 
ORDER BY price_cents;
