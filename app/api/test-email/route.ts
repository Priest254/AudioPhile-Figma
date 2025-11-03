import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function GET(req: Request) {
  // Simple diagnostic endpoint to test email configuration
  const diagnostic = {
    hasResendApiKey: !!RESEND_API_KEY,
    apiKeyLength: RESEND_API_KEY ? RESEND_API_KEY.length : 0,
    apiKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 3) : 'N/A',
    fromEmail: FROM_EMAIL,
    fromEmailConfigured: FROM_EMAIL && FROM_EMAIL !== 'onboarding@resend.dev',
    hasResendClient: !!resend,
    status: resend ? 'ready' : 'not_configured',
    message: resend 
      ? 'Email service is configured. Check your server console logs when placing an order to see email sending status.'
      : 'RESEND_API_KEY is missing. Please set it in your .env.local file. Get your API key from https://resend.com/api-keys'
  }

  return NextResponse.json(diagnostic, { status: 200 })
}

