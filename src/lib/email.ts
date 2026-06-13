import { Resend } from 'resend';

// Use environment variables for Resend configuration
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@vic-kakadon.com.ng';

const resend = new Resend(resendApiKey);

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  products: Array<{
    productName: string;
    quantity: number;
    size: string;
    color: string;
    price: string;
  }>;
  address: string;
  city: string;
  state?: string;
  phone: string;
  trackingNumber?: string;
  paymentStatus: string;
  orderStatus: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  try {
    console.log('Sending order confirmation email to:', orderData.customerEmail);
    console.log('From:', resendFromEmail);

    const { data, error } = await resend.emails.send({
      from: resendFromEmail,
      to: [orderData.customerEmail],
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: generateOrderConfirmationTemplate(orderData),
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function sendOrderStatusUpdateEmail(
  orderData: OrderEmailData,
  previousStatus?: string
) {
  try {
    console.log('Sending order status update email to:', orderData.customerEmail);

    const { data, error } = await resend.emails.send({
      from: resendFromEmail,
      to: [orderData.customerEmail],
      subject: `Order Status Update - ${orderData.orderNumber}`,
      html: generateOrderStatusUpdateTemplate(orderData, previousStatus),
    });

    if (error) {
      console.error('Error sending order status update email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending order status update email:', error);
    return { success: false, error: error.message || String(error) };
  }
}

function generateOrderConfirmationTemplate(orderData: OrderEmailData): string {
  const productsList = orderData.products
    .map(
      (product) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 600; color: #1a1a1a;">${product.productName}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            Size: ${product.size} | Color: ${product.color} | Qty: ${product.quantity}
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1a1a1a;">
          ₦${parseFloat(product.price).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B0000 0%, #D4A017 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Kakadon</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Premium Collections</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: bold;">Order Confirmed!</h2>
            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
              Dear ${orderData.customerName},
            </p>
            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for your order! We're pleased to confirm that your order has been received and is being processed.
            </p>

            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
                <div>
                  <span style="color: #6b7280;">Order Number:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.orderNumber}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Payment Status:</span>
                  <span style="color: #10b981; font-weight: 600; margin-left: 8px;">${orderData.paymentStatus}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Order Status:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.orderStatus}</span>
                </div>
                ${orderData.trackingNumber ? `
                <div>
                  <span style="color: #6b7280;">Tracking Number:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.trackingNumber}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Products Table -->
            <div style="margin-bottom: 30px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #1a1a1a;">Product</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #1a1a1a;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>
              <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <span style="font-size: 18px; font-weight: bold; color: #1a1a1a;">Total: ₦${parseFloat(orderData.totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <!-- Shipping Address -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">Shipping Address</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${orderData.address}<br>
                ${orderData.city}${orderData.state ? `, ${orderData.state}` : ''}<br>
                Phone: ${orderData.phone}
              </p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_API_URL || 'https://vic-kakadon.com.ng/track'}/track" style="display: inline-block; background: linear-gradient(135deg, #8B0000 0%, #D4A017 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Order
              </a>
            </div>

            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: bold;">Kakadon</p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2024 Kakadon. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateOrderStatusUpdateTemplate(
  orderData: OrderEmailData,
  previousStatus?: string
): string {
  const statusMessage = {
    'pending': 'Your payment is being processed.',
    'confirmed': 'Your payment has been confirmed and your order is being prepared.',
    'processing': 'Your order is being processed and will be shipped soon.',
    'shipped': 'Your order has been shipped and is on its way to you!',
    'delivered': 'Your order has been delivered. Thank you for shopping with us!',
  };

  const message = statusMessage[orderData.orderStatus as keyof typeof statusMessage] || `Your order status has been updated to: ${orderData.orderStatus}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B0000 0%, #D4A017 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Kakadon</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Premium Collections</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: bold;">Order Status Update</h2>
            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
              Dear ${orderData.customerName},
            </p>
            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
              ${message}
            </p>

            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
                <div>
                  <span style="color: #6b7280;">Order Number:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.orderNumber}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Payment Status:</span>
                  <span style="color: ${orderData.paymentStatus === 'confirmed' ? '#10b981' : '#f59e0b'}; font-weight: 600; margin-left: 8px;">${orderData.paymentStatus}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Current Status:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.orderStatus}</span>
                </div>
                ${previousStatus ? `
                <div>
                  <span style="color: #6b7280;">Previous Status:</span>
                  <span style="color: #6b7280; margin-left: 8px;">${previousStatus}</span>
                </div>
                ` : ''}
                ${orderData.trackingNumber ? `
                <div>
                  <span style="color: #6b7280;">Tracking Number:</span>
                  <span style="color: #1a1a1a; font-weight: 600; margin-left: 8px;">${orderData.trackingNumber}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/track" style="display: inline-block; background: linear-gradient(135deg, #8B0000 0%, #D4A017 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Order
              </a>
            </div>

            <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: bold;">Kakadon</p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2024 Kakadon. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
