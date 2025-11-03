import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { fetchMutation } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { Resend } from 'resend'

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
// Use Resend's default test email for development/testing - works immediately without domain verification
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@example.com'

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// List of common email domains that require verification in Resend
const UNVERIFIED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body?.customer?.email || !body?.items) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    // Validate email configuration
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set in environment variables. Email will not be sent.')
      console.warn('Please set RESEND_API_KEY in your .env.local file')
    }

    // Check if FROM_EMAIL uses an unverified domain
    const fromEmailDomain = FROM_EMAIL.split('@')[1]?.toLowerCase()
    if (fromEmailDomain && UNVERIFIED_DOMAINS.includes(fromEmailDomain)) {
      console.error('❌ ERROR: Cannot send from unverified email domains like gmail.com, yahoo.com, etc.')
      console.error('Resend does not allow sending from common email providers.')
      console.error('Solutions:')
      console.error('  1. For testing: Use FROM_EMAIL=onboarding@resend.dev (works immediately)')
      console.error('  2. For production: Verify your own domain at https://resend.com/domains')
      console.error(`  Current FROM_EMAIL: ${FROM_EMAIL}`)
    }

    const orderId = uuidv4()

    const orderDoc = {
      orderId,
      customer: body.customer,
      shipping: body.shipping,
      items: body.items,
      totals: body.totals,
      status: 'processing',
      createdAt: new Date().toISOString()
    }

    // Call Convex mutation function
    await fetchMutation(api.functions.createOrder.createOrder, orderDoc)

    // Send confirmation email
    try {
      if (!resend) {
        console.error('Resend client not initialized. RESEND_API_KEY is missing.')
        // Continue without email - order is still created
      } else {
        const emailHtml = buildEmailHtml(orderDoc, SUPPORT_EMAIL)
        
        console.log('Attempting to send email:', {
          from: FROM_EMAIL,
          to: body.customer.email,
          hasResendClient: !!resend
        })

        const emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: [body.customer.email],
          subject: `Order confirmation — ${orderId}`,
          html: emailHtml
        })

        if (emailData.error) {
          const error = emailData.error as any
          const errorMessage = error?.message || 'Unknown error'
          const statusCode = error?.statusCode || (error as any)?.status || 'Unknown'
          
          console.error('❌ Resend API Error:', {
            statusCode,
            message: errorMessage,
            fromEmail: FROM_EMAIL,
            toEmail: body.customer.email,
            fullError: error
          })

          // Provide helpful guidance for common errors
          if (statusCode === 403 && errorMessage?.includes('domain is not verified')) {
            console.error('')
            console.error('🔧 SOLUTION:')
            console.error('  Resend requires domain verification for custom email addresses.')
            console.error('  For testing, use: FROM_EMAIL=onboarding@resend.dev')
            console.error('  For production, verify your domain at: https://resend.com/domains')
            console.error('')
          }
        } else {
          console.log('Email sent successfully:', {
            emailId: emailData.data?.id,
            to: body.customer.email,
            from: FROM_EMAIL
          })
        }
      }
    } catch (emailError: any) {
      console.error('Email sending error:', {
        message: emailError.message,
        stack: emailError.stack,
        fromEmail: FROM_EMAIL,
        toEmail: body.customer.email,
        errorDetails: emailError
      })
      // Continue even if email fails - order is still created
    }

    return NextResponse.json({ orderId }, { status: 201 })
  } catch (err: any) {
    console.error('Checkout error:', {
      message: err.message,
      stack: err.stack
    })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

function buildEmailHtml(order: any, supportEmail: string) {
  const itemsHtml = order.items.map((it: any) => {
    const itemTotal = (it.price * it.quantity) / 100
    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0;">
          <div style="font-weight: 600; color: #111827;">${it.name}</div>
          <div style="font-size: 14px; color: #6b7280;">Quantity: ${it.quantity}</div>
        </td>
        <td align="right" style="padding: 12px 0; font-weight: 600; color: #111827;">
          KES ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
  }).join('')

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const orderUrl = `${baseUrl}/order/${order.orderId}`

  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Order Confirmation - ${order.orderId}</title>
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #f9fafb; 
        color: #111827;
        line-height: 1.6;
      }
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        background-color: #0f172a;
        color: #ffffff;
        padding: 32px 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }
      .container {
        padding: 32px 24px;
      }
      .greeting {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #111827;
      }
      .order-id {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 24px;
      }
      .section {
        margin-bottom: 32px;
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #111827;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }
      .totals {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 2px solid #e5e7eb;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
      }
      .total-row {
        font-weight: 700;
        font-size: 18px;
        padding-top: 12px;
        margin-top: 12px;
        border-top: 2px solid #e5e7eb;
        color: #0f172a;
      }
      .shipping-address {
        background-color: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        margin-top: 8px;
        font-size: 14px;
        line-height: 1.8;
        color: #374151;
      }
      .cta-button {
        display: inline-block;
        background-color: #0f172a;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        margin-top: 8px;
        font-size: 14px;
      }
      .cta-button:hover {
        background-color: #1e293b;
      }
      .footer {
        background-color: #f9fafb;
        padding: 24px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      }
      .footer a {
        color: #0f172a;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          padding: 24px 16px;
        }
        .header {
          padding: 24px 16px;
        }
        .header h1 {
          font-size: 20px;
        }
        table {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <h1>🎧 Audiophile</h1>
      </div>
      
      <div class="container">
        <div class="greeting">Hello ${order.customer.name},</div>
        <div class="order-id">Order ID: <strong>${order.orderId}</strong></div>
        
        <p style="margin-bottom: 24px; color: #374151;">
          Thank you for your order! We've received your order and will begin processing it right away.
        </p>

        <div class="section">
          <div class="section-title">Order Summary</div>
          <table>
            ${itemsHtml}
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>KES ${(order.totals.subtotal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row">
              <span>Shipping:</span>
              <span>KES ${(order.totals.shipping / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row">
              <span>Taxes:</span>
              <span>KES ${(order.totals.taxes / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row total-row">
              <span>Total:</span>
              <span>KES ${(order.totals.total / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <div class="shipping-address">
            ${order.shipping.addressLine1}${order.shipping.addressLine2 ? '<br/>' + order.shipping.addressLine2 : ''}<br/>
            ${order.shipping.city}, ${order.shipping.postalCode}<br/>
            ${order.shipping.country}
          </div>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${orderUrl}" class="cta-button">View Your Order</a>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #374151;">
          <p style="margin-bottom: 12px;">
            If you have any questions about your order, please don't hesitate to contact us:
          </p>
          <p style="margin: 0;">
            📧 Email: <a href="mailto:${supportEmail}" style="color: #0f172a; text-decoration: none;">${supportEmail}</a>
          </p>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0 0 8px 0;">
          <strong>Audiophile</strong> - Premium Audio Equipment
        </p>
        <p style="margin: 0;">
          This is an automated email. Please do not reply directly to this message.
        </p>
      </div>
    </div>
  </body>
  </html>
  `
}
