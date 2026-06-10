# Resend Email Integration Setup Guide

This guide will walk you through setting up Resend email service with Supabase for your Kakadon e-commerce platform.

## Prerequisites

- A Supabase account (already set up for your project)
- A Resend account (free tier available)

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Complete the onboarding process

## Step 2: Get Your Resend API Key

1. After logging in to Resend, navigate to the [API Keys section](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give your API key a name (e.g., "Kakadon Production")
4. Select the permissions you need (at minimum: "Emails: Send")
5. Copy the generated API key - **you won't be able to see it again**

## Step 3: Configure Your Domain in Resend

### Option A: Use Resend's Default Domain (Quick Start)

For testing and development, you can use Resend's default domain:
- From email: `onboarding@resend.dev`

### Option B: Use Your Custom Domain (Recommended for Production)

1. In Resend, go to [Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `kakadon.com` or `mail.kakadon.com`)
4. Resend will provide DNS records you need to add to your domain registrar

#### Adding DNS Records:

1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
2. Navigate to DNS management
3. Add the following DNS records provided by Resend:

**For TXT records:**
```
Type: TXT
Host: @
Value: resend-verification=your-verification-code
```

**For MX records:**
```
Type: MX
Host: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

**For CNAME records:**
```
Type: CNAME
Host: mail._domainkey
Value: dkim.resend.com
```

4. Wait for DNS propagation (usually takes 10-30 minutes, up to 48 hours)
5. In Resend, click "Verify DNS records"
6. Once verified, you can use your custom domain for sending emails

## Step 4: Add Environment Variables

Add the following environment variables to your `.env` file:

```env
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_email@yourdomain.com
# For development, you can use: RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Important:** Never commit your `.env` file to version control. It's already in your `.gitignore`.

## Step 5: Update Supabase Database Schema

The email system requires a `tracking_number` field in the orders table. Run the following SQL in your Supabase SQL Editor:

```sql
-- Add tracking_number column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255) DEFAULT '';
```

### Alternative: Using Drizzle Migration

If you're using Drizzle ORM, run:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

This will automatically add the `tracking_number` field to your database.

## Step 6: Test Email Sending

### Test with Development Email

1. Make sure your `.env` file has the Resend API key
2. Restart your development server:
   ```bash
   npm run dev
   ```

3. Create a test order in your application
4. Go to the admin orders page
5. Update an order's payment status to "confirmed"
6. Check the checkbox next to the status dropdown to notify the customer
7. Check your email (or the test email address) for the confirmation email

### Test with Custom Domain

Once your custom domain is verified in Resend:

1. Update your `.env` file:
   ```env
   RESEND_FROM_EMAIL=notifications@yourdomain.com
   ```

2. Restart your development server
3. Repeat the test above

## Step 7: Monitor Email Delivery

1. In Resend, go to the [Logs section](https://resend.com/logs)
2. You can see all sent emails, their status (delivered, bounced, etc.)
3. Check for any delivery issues or bounces

## Step 8: Configure Email Templates (Optional)

The email templates are located in `src/lib/email.ts`. You can customize:

- **Order Confirmation Email**: `generateOrderConfirmationTemplate()`
- **Order Status Update Email**: `generateOrderStatusUpdateTemplate()`

### Customization Options:

- Change colors and branding
- Add your logo
- Modify the email structure
- Add custom fields
- Change the email subject lines

## Step 9: Set Up Email for Production

### Environment Variables for Production

In your production environment (Vercel, Netlify, etc.):

1. Add the same environment variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

2. Use your production API key (not the development one)

### Vercel Setup:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `RESEND_API_KEY` = your production Resend API key
   - `RESEND_FROM_EMAIL` = your production email address
4. Redeploy your application

## Step 10: Email Notification Workflow

### For Customers:

1. **Order Confirmation**: When payment status changes to "confirmed", customer receives:
   - Order number
   - Order details
   - Items purchased
   - Total amount
   - Shipping address
   - Tracking number (if available)

2. **Order Status Updates**: When order status changes (processing → shipped → delivered), customer receives:
   - Order number
   - Current status
   - Previous status
   - Status-specific message
   - Tracking number (if available)

### For Admins:

1. Go to Admin → Orders page
2. Find the order you want to update
3. Next to the status dropdowns, you'll see checkboxes
4. **Check the box** if you want to notify the customer via email
5. **Leave unchecked** if you want to update without notifying
6. Change the status (payment or order status)
7. Email will be sent automatically if checkbox is checked

## Troubleshooting

### Emails Not Sending:

1. Check your Resend API key is correct
2. Verify your domain is verified in Resend
3. Check Resend Logs for error messages
4. Ensure environment variables are set correctly
5. Restart your development server after changing `.env`

### Emails Going to Spam:

1. Ensure your domain has proper DNS records
2. Set up SPF, DKIM, and DMARC records
3. Use a consistent sending domain
4. Avoid spam-like content in emails

### API Key Errors:

1. Verify the API key has correct permissions
2. Ensure you're using the right API key (dev vs production)
3. Check the API key hasn't been revoked

### Domain Verification Issues:

1. Wait for DNS propagation (up to 48 hours)
2. Verify DNS records are correctly configured
3. Check for typos in DNS records
4. Contact your domain registrar if issues persist

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** periodically
4. **Use separate API keys** for development and production
5. **Monitor email logs** for suspicious activity
6. **Implement rate limiting** if sending bulk emails
7. **Keep your Resend account secure** with 2FA

## Cost Considerations

- Resend Free Tier: 3,000 emails per month
- Resend Paid Tier: Starts at $20/month for 50,000 emails
- Monitor your usage in Resend dashboard
- Consider upgrading if you exceed free tier limits

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Supabase Documentation](https://supabase.com/docs)
- [Email Deliverability Best Practices](https://resend.com/docs/deliverability)

## Support

If you encounter issues:

1. Check Resend Logs for error details
2. Review this guide for common solutions
3. Consult Resend documentation
4. Contact Resend support if needed

---

**Note:** This guide assumes you're using Supabase as your database. If you're using a different database, adjust the SQL migration steps accordingly.
